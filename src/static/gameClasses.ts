import { Action, DEFAULT_ACTIONS, DEFEND_ACTION, DO_NOTHING_ACTION, PASS_ACTION } from "./Actions";
import { Attack, PierceLevel,  } from "./Attack"
import { Card, CardType } from "./Cards";
import { Enemy } from "./Enemy";
import { Item } from "./Items";
import { logger } from "./logger";
import { PlayerBuild } from "./PlayerBuild";
import { StatusHolder, StatusType, statusIsDebuff } from "./StatusHolder";

// ######            ######
// ###### CORE STUFF ######
// ######            ######


export class Entity {
  hp: number;
  name: string;
  isDead: boolean = false;
  maxHp: number;
  attackBoost: number = 0;
  defense: number;
  statuses: StatusHolder = new StatusHolder();

  public constructor(hp: number, name: string, defense: number){
    this.hp = this.maxHp = hp;
    this.name = name;
    this.defense = defense;
  }

  public dealDamage(target: Entity, atk : Attack) {
    if (atk.boostable) {
      atk.dmg += this.getStatusIntensity(StatusType.FIRST_STRIKE)
      this.statuses.removeStatus(StatusType.FIRST_STRIKE)
      atk.dmg += this.attackBoost
    }
    atk.dmg -= this.getStatusIntensity(StatusType.DAMAGE_DOWN)

    if (atk.undodgeable == false ){
      if (this.hasStatus(StatusType.SMALL)) { atk.dmg -= 2 } 
      if (this.hasStatus(StatusType.ARMOR_PIERCING)) { atk.piercing = PierceLevel.FULL}
    }
    atk.dmg = Math.max(atk.dmg, 1)

    let dmgDealt = target.takeDamage(atk)
    return dmgDealt
  }

  public takeDamage(atk : Attack){
    if (atk.piercing != PierceLevel.FULL) {
      if (this.hasStatus(StatusType.DEFENDING)) { atk.dmg = Math.floor(atk.dmg * 0.8) } //apply defend 20% reduction (floor) (gets pierced)
    }
    //reduce dmg by defense stat, or half(floored) if half piercing, or none if full piercing
    if (atk.piercing == PierceLevel.NONE) { atk.dmg -= this.defense }
    else if (atk.piercing == PierceLevel.HALF) { atk.dmg -= Math.floor(this.defense * 0.5) }
    else if (atk.piercing == PierceLevel.FULL) { /*no dmg reduction*/ }

    if (atk.piercing != PierceLevel.FULL) {
      atk.dmg -= this.getStatusIntensity(StatusType.ARMOR_UP) //reduce dmg by defense status if not full piercing
      if (this.hasStatus(StatusType.HALF_DAMAGE)) { atk.dmg = Math.ceil(atk.dmg * 0.5) } //apply half-def 50% reduction (ceil) (gets piereced)
    }

    if (this.hasStatus(StatusType.GARLIC)) { atk.dmg = Math.ceil(atk.dmg * 0.8) } //apply garlic 20% reduction (ceil) (not pierced)
    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP)) { atk.dmg = Math.ceil(atk.dmg * 0.5) } //apply sleep 50% reduction (ceil) (not pierced)

    if (atk.dmg > 0){
      this.loseHp(atk.dmg, this.name, atk.name)
    } else {
      logger.log(`${this.name} deflected ${atk.name}`)
    }
    return atk.dmg
  }

  public loseHp(n: number, target: string, source: string){
      this.hp -= n
      logger.log(`${target} took ${n} damage from ${source}`)

      this.deathCheck()
  }

  public deathCheck() {
    if (this.hp <= 0) {
      if (this.isDead == false) {logger.log(`${this.name}'s HP reached 0 and died`)}
      this.isDead = true
    }
  }

  public addHp(n: number){
    let hpBefore = this.hp
    this.hp = Math.min(this.hp+n, this.maxHp)
    let healed = this.hp - hpBefore

    if (n > 0) {
      if (this.hp == this.maxHp){
        if (healed < n){
          logger.log(`${this.name} healed ${n} HP to max HP (actually healed ${healed} HP)`)
        } else {
          logger.log(`${this.name} healed ${n} to max HP`)
        }
      } else {
        logger.log(`${this.name} healed ${n} HP`)
      }
    }
  }

  public startOfTurnEffects() {
    if (this.hasStatus(StatusType.FIRE)){
      this.loseHp(1, this.name, "Fire Status");
    }
    this.statuses.decrementTimers()
  }


  public getStatusIntensity(type: StatusType){
    return this.statuses.getStatusIntensity(type)
  }

  public hasStatus(type: StatusType){
    let hasStatus = this.statuses.getStatusIntensity(type) > 0
    return hasStatus
  }

  public tryApplyStatus(type: StatusType, duration: number, intensity: number = 1){ 
    //TODO status immunities here

    if (this.hasStatus(StatusType.FEEL_FINE)){
      if (statusIsDebuff(type)){
        return
      }
    }

    //on-application effects 
    if (type == StatusType.FEEL_FINE){
      this.statuses.removeAllDebuffs()
    } else if (type == StatusType.INVISIBLE){
      this.statuses.removeStatus(StatusType.FEEL_FINE)
      this.tryApplyStatus(StatusType.EXHAUSTED, 2)

    }
    

    let appliedStatus = this.statuses.applyStatus(type, duration, intensity)
    if (appliedStatus.hideIntensity){
      logger.log(`${this.name} was applied with ${appliedStatus.name} for ${appliedStatus.duration} turns`)
    } else {
      logger.log(`${this.name} was applied with ${appliedStatus.name} ${appliedStatus.intensity} for ${appliedStatus.duration} turns`)

    }
  
  }

  public endOfActionEffects(){

  }

  public canAct() {
    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP) || this.hasStatus(StatusType.EXHAUSTED) ){
      return false
    }
    return true
  }

}

export class Player extends Entity{
  sp: number;
  maxSp: number;
  sleepActions: Action[];
  actions: Action[];
  cards: Card[];
  items: Item[];

  dealtDamageThisAction: boolean = false;
  hasAnotherAction: boolean = true;
  hasUsedMedkit: boolean = false;

  spOnHit: number = 0;
  hpOnHit: number = 0;
  spOnPass: number = 1;

  public constructor(build: PlayerBuild){
    super(build.hp, "Player", 0);
    this.sp = this.maxSp = build.sp;
    this.cards = build.selectedCards;
    this.items = build.selectedItems;

    this.sleepActions = [DO_NOTHING_ACTION];

    // ### adding player actions ###
    this.actions = DEFAULT_ACTIONS
    this.cards.forEach((card: Card) => {
      if (card.type == CardType.ACTIVE){
        card.doEffect(this)
      }
    })
    
    // ### start-of-combat card effects ###
    this.cards.forEach((card: Card) => {
      if (card.type == CardType.START_OF_COMBAT){
        card.doEffect(this)
      }
    })

    // ### other start-of-combat effects ###
    this.attackBoost = Math.max(this.attackBoost, -1)

    this.tryApplyStatus(StatusType.FIRST_STRIKE, 999, 2)
  }

  public override dealDamage(target: Entity, atk: Attack ) { 
    let dmgDealt = super.dealDamage(target, atk)

    if (dmgDealt > 0){
      this.dealtDamageThisAction = true
    }

    return dmgDealt
    
  }

  public override takeDamage(atk: Attack ) { 
    //dodging implemented here
    if (this.hasStatus(StatusType.INVISIBLE))
    {
      logger.log(`${this.name} phased through ${atk.name}`)
      return 0 
    }

    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP) || atk.undodgeable == true){
      return super.takeDamage(atk)
    }
    logger.log(`${this.name} dodged ${atk.name}`)
    return 0
    
  }

  public addSp(n: number){
    this.sp = Math.min(this.sp+n, this.maxSp)

    let spBefore = this.sp
    this.sp = Math.min(this.sp+n, this.maxHp)
    let spGained = this.sp - spBefore

    if (n > 0) {
      if (this.hp == this.maxHp){
        if (spGained < n){
          logger.log(`${this.name} gained ${n} SP to max SP (actually gained ${spGained} SP)`)
        } else {
          logger.log(`${this.name} gained ${n} to max SP`)

        }
      } else {
        logger.log(`${this.name} gained ${n} SP`)
      }
    }
  }

  public override deathCheck() {
    if (this.hp <= 0) {

      let resCard = this.cards.find(c => c.name == "Resurrect")
      if (resCard != undefined){
        let spCost = 3
        if (this.cards.some(c => c.name == "SP Saver")) {spCost--}
        if (resCard.enabled  && this.sp >= spCost){ 
          resCard.enabled = false
          this.sp -= spCost
          this.hp = 5
          return
        }
      }

      if (!this.hasUsedMedkit){
        if (this.items.some(item => item.name == "Medkit")){
          let hpHeal = this.itemPlusBuff(10) 
          this.hp = hpHeal
          this.hasUsedMedkit = true
          this.items.filter(item => item.name != "Medkit")
          return
        }
      }

      super.deathCheck()

    }
  }

  public getActions(){
    if (!this.canAct()){
      return this.sleepActions
    }

      if (this.hasAnotherAction){
        return [DEFEND_ACTION].concat(this.actions)
      } else {
        return [PASS_ACTION].concat(this.actions)
      }
  }

  public checkActionCost(action: Action) {
    if (action.spCost > this.sp){
      return "missing sp"
    } else if (action.hpCost >= this.hp){
      return "missing hp"
    } 
    return "success"
    
  }

  public canHeal(){
    return this.hp < this.maxHp
  }

  public doAction(action: Action, enemy: Enemy, enemyList: Enemy[] ){
    this.sp -= action.spCost;
    this.hp -= action.hpCost;
    action.doEffect(this, enemy, enemyList)
  }

  public override endOfActionEffects(): void {
    if (this.dealtDamageThisAction){ //leech effect
      this.addHp(this.hpOnHit)
      this.addSp(this.spOnHit)  
      this.dealtDamageThisAction = false;
    }
  }

  public override startOfTurnEffects() {
    
    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP)){
      this.addHp(2)
      this.addSp(2)
    }
    
    super.startOfTurnEffects()

    //do start-of-turn card effects
    this.cards.forEach((card: Card) => {
      if (card.type == CardType.START_OF_TURN){
        card.doEffect(this)
      }
    })
  }

  public itemPlusBuff(n: number){
    if (this.cards.some(card => card.name == "Item+")){
      return Math.round(n*1.3)
    }
    return n
  }
}


export class Game {
  player : Player
  enemies : Enemy[]
  gameOver : boolean = false

  public constructor(player: Player, enemies : Enemy[]){
    this.player = player;
    this.enemies = enemies;
  }

  public getEnemyByPosition(pos : number) {
    return this.enemies[pos]
  }

  public clone() {
    return new Game(this.player, this.enemies)
  }
  
}

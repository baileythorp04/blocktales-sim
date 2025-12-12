import { Action, DEFAULT_ACTIONS, DEFEND_ACTION, DO_NOTHING_ACTION, PASS_ACTION } from "./Actions";
import { Attack, PierceLevel,  } from "./Attack"
import { Card, CardType } from "./Cards";
import { Enemy } from "./Enemy";
import { Item } from "./Items";
import { logger, LoggerState } from "./logger";
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

  icon: string;

  public constructor(hp: number, name: string, icon: string,defense: number){
    this.hp = this.maxHp = hp;
    this.name = name;
    this.icon = icon;
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

    const dmgDealt = target.takeDamage(atk)
    return dmgDealt
  }

  public takeDamage(atk : Attack){
    if (atk.piercing != PierceLevel.FULL) {
      if (this.hasStatus(StatusType.DEFENDING)) { atk.dmg = Math.floor(atk.dmg * 0.8) } //apply defend 20% reduction (floor) (gets pierced)
    }
    //reduce dmg by defense stat, or half(floored) if half piercing, or none if full piercing
    const effectiveDefense = Math.max(0, this.defense - (this.getStatusIntensity(StatusType.ARMOR_DOWN)))
    if (atk.piercing == PierceLevel.NONE) { atk.dmg -= effectiveDefense }
    else if (atk.piercing == PierceLevel.HALF) { atk.dmg -= Math.floor(effectiveDefense * 0.5) }
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
      logger.log(`${this.name} deflected the attack`)
    }
    return atk.dmg
  }

  public loseHp(n: number, target: string, source: string){
      this.hp -= n
      logger.log(`${target} took ${n} damage`)

      this.deathCheck()
  }

  public deathCheck() {
    if (this.hp <= 0) {
      if (this.isDead == false) {logger.log(`${this.name}'s HP reached 0 and died`)}
      this.isDead = true
    }
  }

  public addHp(n: number, source: string = ""){
    if (n > 0) { //only log if >0 healing

      const hpBefore = this.hp
      this.hp = Math.min(this.hp+n, this.maxHp)
      const healed = this.hp - hpBefore

      let logMsg = `${this.name} healed ${n} HP`

      if (this.hp == this.maxHp){
        if (healed < n){
          //overhealed
          logMsg += ` and maxed HP (actually healed ${healed} HP)`
        } else {
          //maxed hp
          logMsg += " and maxed HP"
        }
      }

      logger.log(logMsg, (healed == 0))

    }
  }

  public startOfTurnEffects() {
    if (this.hasStatus(StatusType.FIRE)){
      logger.log(`Fire proc'd on ${this.name}`)
      this.loseHp(1, this.name, "Fire Status");
    }
    this.statuses.decrementTimers()
  }


  public getStatusIntensity(type: StatusType){
    return this.statuses.getStatusIntensity(type)
  }

  public hasStatus(type: StatusType){
    const hasStatus = this.statuses.getStatusIntensity(type) > 0
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

    } else if (type == StatusType.ARMOR_DOWN){
      intensity = this.statuses.reduceIntensity(StatusType.ARMOR_UP, intensity)
      logger.log(`${this.name}'s Armor Down status was reduced to ${Math.max(0, -intensity)}`, true)

    } else if (type == StatusType.ARMOR_UP){
      intensity = this.statuses.reduceIntensity(StatusType.ARMOR_DOWN, intensity)
      logger.log(`${this.name}'s Armor Up status was reduced to ${Math.max(0, -intensity)}`, true)
    }
    
    if (intensity > 0){
      const appliedStatus = this.statuses.applyStatus(type, duration, intensity)
      if (appliedStatus.hideIntensity){
        logger.log(`${this.name} was applied with ${appliedStatus.name} for ${appliedStatus.duration} turns`, true)
      } else {
        logger.log(`${this.name} was applied with ${appliedStatus.name} ${appliedStatus.intensity} for ${appliedStatus.duration} turns`, true)   
      }
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

  public constructor(build: PlayerBuild = {hp:100, sp:100, selectedCards:[], selectedItems:[]}){
    super(build.hp, "Player", "player.png", 0);
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
    const dmgDealt = super.dealDamage(target, atk)

    if (dmgDealt > 0){
      this.dealtDamageThisAction = true
    }

    return dmgDealt
    
  }

  public override takeDamage(atk: Attack ) { 
    //dodging implemented here
    if (this.hasStatus(StatusType.INVISIBLE))
    {
      logger.log(`${this.name} phased through the attack`, true)
      return 0 
    }

    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP) || atk.undodgeable == true){
      return super.takeDamage(atk)
    }
    logger.log(`${this.name} dodged the attack`, true)
    return 0
    
  }

  public addSp(n: number, source: string = ""){
    if (n > 0) { //only log if >0 gained

      const spBefore = this.sp
      this.sp = Math.min(this.sp+n, this.maxSp)
      const spGained = this.sp - spBefore

      let logMsg = `${this.name} gained ${n} SP`

      if (this.sp == this.maxSp){
        if (spGained < n){
          //overhealed
          logMsg += ` and maxed SP (actually gained ${spGained} SP)`
        } else {
          //maxed sp
          logMsg += " and maxed SP"
        }
      }

      logger.log(logMsg, (spGained == 0))

    }
  }


  

  public override deathCheck() {
    if (this.hp <= 0) {

      const resCard = this.cards.find(c => c.name == "Resurrect")
      if (resCard != undefined){
        let spCost = 3
        if (this.cards.some(c => c.name == "SP Saver")) {spCost--}
        if (resCard.enabled  && this.sp >= spCost){ 
          resCard.enabled = false
          this.sp -= spCost
          this.hp = 5
          logger.log(`${this.name} was saved by Resurrect and set to 5 HP`)
          this.statuses.removeAll()
          return
        }
      }

      if (!this.hasUsedMedkit){
        if (this.items.some(item => item.name == "Medkit")){
          const hpHeal = this.itemPlusBuff(10) 
          this.hp = hpHeal
          this.hasUsedMedkit = true
          this.items = this.items.filter(item => item.name != "Medkit")
          logger.log(`${this.name} was saved by Medkit and set to 10 HP`)
          this.statuses.removeAll()
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
    logger.log(`${this.name} used ${action.name}`, false, true)
    action.doEffect(this, enemy, enemyList)
  }

  public override endOfActionEffects(): void {
    if (this.dealtDamageThisAction){ //leech effect
      this.addHp(this.hpOnHit, "HP Drain")
      this.addSp(this.spOnHit, "SP Drain")  
      this.dealtDamageThisAction = false;
    }
  }

  public override startOfTurnEffects() {
    
    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP)){
      this.addHp(2, "Good Vibes")
      this.addSp(2, "Good Vibes")
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
  //loggerState : LoggerState = {logs:[[]], nextId:1, colNo:0}
  loggerState : LoggerState = logger.getState()
  gameOver : boolean = false
  win : boolean = false
  

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

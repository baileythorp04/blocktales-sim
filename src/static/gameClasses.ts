import { Action, DEFAULT_ACTIONS } from "./Actions";
import { Attack, PierceLevel,  } from "./Attack"
import { Card, CardType } from "./Cards";
import { Enemy } from "./Enemy";
import { PlayerBuild } from "./PlayerBuild";
import { StatusHolder, StatusType, statusIsDebuff } from "./StatusHolder";

// ######            ######
// ###### CORE STUFF ######
// ######            ######

let entityId = 0

export class Entity {
  id: number;
  hp: number;
  isDead: boolean = false;
  maxHp: number;
  attackBoost: number = 0;
  defense: number;
  statuses: StatusHolder = new StatusHolder();

  public constructor(hp: number, defense: number){
    this.id = entityId++;
    this.hp = this.maxHp = hp;
    this.defense = defense;
  }

  public dealDamage(target: Entity, atk : Attack) {
    atk.dmg -= this.getStatusIntensity(StatusType.DAMAGE_DOWN)
    atk.dmg += this.attackBoost
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
      this.loseHp(atk.dmg)
    } else {
      //deflected
    }
    return atk.dmg
  }

  public loseHp(n: number){
      this.hp -= n
      this.deathCheck()
      //TODO log here
  }

  public deathCheck() {
    if (this.hp <= 0) {
      this.isDead = true
    }
  }

  public addHp(n: number){
    this.hp = Math.min(this.hp+n, this.maxHp)
  }

  public startOfTurnEffects() {
    if (this.hasStatus(StatusType.FIRE)){
      this.loseHp(1);
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
    }
    

    this.statuses.applyStatus(type, duration, intensity)
  
  }

  public endOfActionEffects(){

  }

}

export class Player extends Entity{
  sp: number;
  maxSp: number;
  normalActions: Action[];
  sleepActions: Action[];
  actions: Action[];
  cards: Card[];

  dealtDamageThisAction: boolean = false;

  spOnHit: number = 0;
  hpOnHit: number = 0;
  spOnPass: number = 1;

  public constructor(build: PlayerBuild){
    super(build.hp, 0);
    this.sp = this.maxSp = build.sp;
    this.cards = build.selectedCards;

    this.sleepActions = [new Action("sleep.png", "Sleep", 0, () => {})];

    // ### adding player actions ###
    this.actions = DEFAULT_ACTIONS
    this.cards.forEach((card: Card) => {
      if (card.type == CardType.ACTIVE){
        card.doEffect(this)
      }
    })
    this.normalActions = this.actions

    
    // ### start-of-combat card effects ###
    this.cards.forEach((card: Card) => {
      if (card.type == CardType.START_OF_COMBAT){
        card.doEffect(this)
      }
    })

    // ### other start-of-combat effects ###
    this.attackBoost = Math.max(this.attackBoost, -1)
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
    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP) || atk.undodgeable == true){
      return super.takeDamage(atk)
    }
    return 0
    
  }

  public addSp(n: number){
    this.sp = Math.min(this.sp+n, this.maxSp)
  }

  public override deathCheck() {
    if (this.hp <= 0) {
      debugger

      let resCard = this.cards.find(c => c.name == "Resurrect")
      if (resCard != undefined){
        if (resCard.counter == 0 && this.sp >= 3){ //TODO make this spcost of 3 be reduced by spsaver. have ressurect card create an action which is cast here?
          resCard.counter++
          this.sp -= 3
          this.hp = 5
          return
        }
      }

      //TODO first-aid kit res

      this.isDead = true
    }
  }

  public doAction(action: Action, enemy: Enemy ){
    if (action.spCost > this.sp) {
      return "missing sp"
    } else if (action.hpCost > this.hp) {
      return "missing hp"
    } else { 
      this.sp -= action.spCost;
      this.hp -= action.hpCost;
      let result = action.doEffect(this, enemy)
      if (result == "refund"){
        this.sp += action.spCost;
        this.addSp(this.spOnPass)
      }
      
      return "success"
    }
  }

  public override endOfActionEffects(): void {
    if (this.dealtDamageThisAction){
      this.addHp(this.hpOnHit)
      this.addSp(this.spOnHit)  
      this.dealtDamageThisAction = false;
    }
  }

  public override startOfTurnEffects() {
    
    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP)){
      this.addHp(2)
      this.addSp(2)
      
      this.actions = this.sleepActions
    }

    super.startOfTurnEffects()

    if (!this.hasStatus(StatusType.GOOD_VIBES_SLEEP)){
      this.actions = this.normalActions
    }
    //do start-of-turn card effects
    this.cards.forEach((card: Card) => {
      if (card.type == CardType.START_OF_TURN){
        card.doEffect(this)
      }
    })
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

  public clone() {
    return new Game(this.player, this.enemies)
  }
  
}

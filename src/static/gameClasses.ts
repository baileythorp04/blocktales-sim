import { Action, DEFAULT_ACTIONS } from "./Actions";
import { Card, CardType } from "./Cards";
import { Enemy } from "./Enemy";
import { PlayerBuild } from "./PlayerBuild";
import { StatusHolder, StatusType, statusIsDebuff } from "./StatusHolder";


//TODO put this enum somewhere more fitting
export enum PierceLevel {
  NONE,
  HALF,
  FULL,
} 

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

  public dealDamage(target: Entity, dmg: number, piercing: PierceLevel = PierceLevel.NONE) {
    dmg -= this.getStatusIntensity(StatusType.DAMAGE_DOWN)
    dmg += this.attackBoost
    //TODO small only applies if not firebrand
    //if (undodgeable == false ){
      if (this.hasStatus(StatusType.SMALL)) { dmg -= 2 } 
    //}
    dmg = Math.max(dmg, 1)


    //TODO: piercing = full if has piercing status and is not firebrand (pass dmg as an Attack object/type?)
    let dmgDealt = target.takeDamage(dmg, piercing)
    return dmgDealt
  }

  public takeDamage(dmg: number, piercing: PierceLevel){
    //reduce dmg by defense stat, or half(floored) if half piercing, or none if full piercing
    if (piercing == PierceLevel.NONE) { dmg -= this.defense }
    else if (piercing == PierceLevel.HALF) { dmg -= Math.floor(this.defense * 0.5) }
    else if (piercing == PierceLevel.FULL) { /*no dmg reduction*/ }

    if (piercing != PierceLevel.FULL) {
      dmg -= this.getStatusIntensity(StatusType.ARMOR_UP) //reduce dmg by defense status if not full piercing
      if (this.hasStatus(StatusType.DEFENDING)) { dmg = Math.floor(dmg * 0.8) } //apply defend 20% reduction (floor) (gets pierced)
      if (this.hasStatus(StatusType.HALF_DAMAGE)) { dmg = Math.ceil(dmg * 0.5) } //apply half-def 50% reduction (ceil) (gets piereced)
    }

    if (this.hasStatus(StatusType.GARLIC)) { dmg = Math.ceil(dmg * 0.8) } //apply garlic 20% reduction (ceil) (not pierced)
    if (this.hasStatus(StatusType.GOOD_VIBES_SLEEP)) { dmg = Math.ceil(dmg * 0.5) } //apply sleep 50% reduction (ceil) (not pierced)

    //TODO replace this with loseHp() function for logging and decoupling
    if (dmg > 0){
      this.loseHp(dmg)
    } else {
      //deflected
    }
    return dmg
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
    if (this.hasStatus(StatusType.FEEL_FINE)){
      if (statusIsDebuff(type)){
        return
      }
    }
    this.statuses.applyStatus(type, duration, intensity)
  
  }

}

export class Player extends Entity{
  sp: number;
  maxSp: number;
  normalActions: Action[];
  sleepActions: Action[];
  actions: Action[];
  cards: Card[];

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

  public dealDamage(target: Entity, dmg: number, piercing: PierceLevel = PierceLevel.NONE ) { 
    let dmgDealt = super.dealDamage(target, dmg, piercing)

    if (dmgDealt > 0){
      this.addHp(this.hpOnHit) //TODO hp/sp drain shouldn't apply to multihits. 
      this.addSp(this.spOnHit)  
    }

    return dmgDealt
    
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

  public cast(action: Action, enemy: Enemy ){
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

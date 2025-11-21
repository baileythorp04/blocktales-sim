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
    target.takeDamage(dmg, piercing)
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
      this.hp -= dmg
    } else {
      //deflected
    }
  }

  public addHp(n: number){
    this.hp = Math.min(this.hp+n, this.maxHp)
  }

  public startOfTurnEffects() {
    if (this.hasStatus(StatusType.FIRE)){
      this.hp -= 1;
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


  

  //status: Status;
  //function applyStatus: () => void;
}

export class Player extends Entity{
  sp: number;
  maxSp: number;
  actions: Action[];
  cards: Card[];

  spOnHit: number = 0;
  hpOnHit: number = 0;
  spOnPass: number = 1;

  public constructor(build: PlayerBuild){
    super(build.hp, 0);
    this.sp = this.maxSp = build.sp;
    this.cards = build.selectedCards;


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
  }

  public dealDamage(target: Entity, dmg: number ) { 
    super.dealDamage(target, dmg)
    this.addHp(this.hpOnHit) //TODO hp/sp drain should only work if attack deals >0 damage (but thats hard to implement) and shouldn't apply to multihits. 
    this.addSp(this.spOnHit)  
  }

  public addSp(n: number){
    this.sp = Math.min(this.sp+n, this.maxSp)
  }

  public cast(action: Action, enemy: Enemy ){
    if (action.spCost > this.sp) {
      return "missing sp"
    } else if (action.hpCost > this.hp) {
      return "missing hp"
    } else { 
      this.sp -= action.spCost;
      this.hp -= action.hpCost;
      action.doEffect(this, enemy)
      return "success"
    }
  }

  public override startOfTurnEffects() {
    super.startOfTurnEffects()

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

  public constructor(player: Player, enemies : Enemy[]){
    this.player = player;
    this.enemies = enemies;
  }

  public clone() {
    return new Game(this.player, this.enemies)
  }
  
}

import { Action, DEFAULT_ACTIONS } from "./Actions";
import { Card, CardType } from "./Cards";
import { Enemy } from "./Enemy";
import { PlayerBuild } from "./PlayerBuild";
import { statusDebuffMap, StatusEffect, Statuses, StatusType } from "./Statuses";




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
  statuses: Statuses = new Statuses();

  public constructor(hp: number, defense: number){
    this.id = entityId++;
    this.hp = this.maxHp = hp;
    this.defense = defense;
  }

  public dealDamage(target: Entity, dmg: number ) {
    //TODO: implement comments:
    //apply attackboost
    //apply attack buff/debuff from status
    //minimum of 1 dmg.
    target.takeDamage(dmg)
  }

  public takeDamage(dmg: number){

    //TODO: implement these comments:
    //reduce dmg by defense stat, or half(floored) if half piercing, or none if full piercing
    //reduce dmg by defense status if not full piercing

    //apply defend 20% reduction (floor) (gets pierced)
    //apply half-def 50% reduction (ceil)(gets piereced (but not by inferno))
    //apply garlic 20% reduction (ceil) (not pierced)
    //apply sleep 50% reduction (ceil) (not pierced)

    dmg = dmg - this.getDefense()
    this.hp -= dmg


  }

  public getDefense(){
    return this.defense;
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

  public tryApplyStatus(type: StatusType, duration: number, intensity: number){ 
    if (this.hasStatus(StatusType.FEEL_FINE)){
      if (statusDebuffMap.get(type)){
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

  public startCombat() {

    // ### start-of-combat card effects ###
    this.player.cards.forEach((card: Card) => {
      if (card.type == CardType.START_OF_COMBAT){
        card.doEffect(this.player)
      }
    })

    // ### other start-of-combat effects ###
    this.player.attackBoost = Math.max(this.player.attackBoost, -1)


  }
  
}

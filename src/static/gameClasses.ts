import { Action, DEFAULT_ACTIONS } from "./Actions";
import { Card, CardType } from "./Cards";
import { Enemy } from "./Enemy";
import { PlayerBuild } from "./PlayerBuild";




// ######            ######
// ###### CORE STUFF ######
// ######            ######

let entityId = 0

export class Entity {
  id: number;
  hp: number;
  maxHp: number;
  attackBoost: number;
  defense: number;

  public constructor(hp: number, defense: number){
    this.id = entityId++;
    this.hp = this.maxHp = hp;
    this.attackBoost = 0;
    this.defense = defense;
  }

  public dealDamage(target: Entity, dmg: number ) {
    //TODO: account for damage buffs and debuffs
    target.takeDamage(dmg)
  }

  public takeDamage(dmg: number){
    //TODO: account for whether its full/half/none def piercing
    //TODO: account for half damage and sleep status
    //TODO: make sure rounding works properly

    //get default defense
    //apply half-pierce if true
    //add status defense
    //apply full pierce if true

    //sleep and half-damage?????

    dmg = dmg - this.getDefense()
    this.hp -= dmg


  }

  public getDefense(){
    //TODO : account for defense status when statuses is implemented
    return this.defense;
  }

  public addHp(n: number){
    this.hp = Math.min(this.hp+n, this.maxHp)
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

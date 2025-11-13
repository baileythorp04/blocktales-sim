

export class StatusEffect { 
  //should probably: have entity a list of active statuses which are removed when reaching 0 duration

  name: string;
  duration: number;
  intensity: number;

  public constructor(name: string, duration: number, intensity: number){
    this.name = name;
    this.duration = duration;
    this.intensity = intensity;
  }
}



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
    //TODO: account for half damage status
    //TODO: make sure rounding works properly
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
  public constructor(hp: number, sp: number){
    super(hp, 0);
    this.sp = this.maxSp = sp;
  }

  public sword(e : Entity) {
    let dmg = 2
    this.dealDamage(e, dmg)

  }

  public addSp(n: number){
    this.hp = Math.min(this.sp+n, this.maxSp)
  }
}

export class Enemy extends Entity{

  public constructor(hp: number, defense: number = 0){
    super(hp, defense)
  }

  
}


//button to do turn
  //do chosen player turn
  //do enemy turn

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
    //do all start-of-combat cards
  }
  
}

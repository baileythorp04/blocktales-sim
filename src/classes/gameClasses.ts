

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


export class Entity {
  hp: number;
  maxHp: number;
  defense: number;

  public constructor(hp: number, defense: number){
    this.hp = this.maxHp = hp;
    this.defense = defense
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

  //status: Status;
  //function applyStatus: () => void;
}

export class Player extends Entity{
  sp: number;
  maxSp: number;
  public constructor(hp: number, sp: number, defense: number = 0){
    super(hp, defense);
    this.sp = this.maxSp = sp;
  }

  public sword(e : Entity) {
    let dmg = 2
    this.dealDamage(e, dmg)

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
  
}

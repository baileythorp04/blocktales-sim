
enum StatusType{
  END_OF_TURN,
  ALTER_STAT,
}

class StatusEffect {
  statusType: StatusType

  public constructor(statusType: StatusType){
    this.statusType = statusType
  }
}



// ######            ######
// ###### CORE STUFF ######
// ######            ######


class Entity {
  hp: number;
  maxHp: number;

  public constructor(hp: number){
    this.hp = this.maxHp = hp;
  }

  //status: Status;
  //function applyStatus: () => void;
}

export class Player extends Entity{
  sp: number;
  maxSp: number;
  public constructor(hp: number, sp: number){
    super(hp)
    this.sp = this.maxSp = sp
  }

  public attack(e : Entity) {
    e.hp = e.hp - 1
    return e

  }
}

export class Enemy extends Entity{

  public constructor(hp: number){
    super(hp)
  }
}


//button to do turn
  //do chosen player turn
  //do enemy turn

export class Game {
  player : Player
  enemies : Enemy[]

  public constructor(player: Player, enemies : Enemy[]){
    this.player = player
    this.enemies = enemies
  }

  public clone() {
    return new Game(this.player, this.enemies)
  }
  
}

import { Attack, AttackType, createAttack } from "./Attack";
import { Entity } from "./gameClasses";
import { logger } from "./logger";
import { StatusType } from "./StatusHolder";

type EnemyAction = {
  name: string,
  action: ((target : Entity, self : Enemy, enemyList : Enemy[]) => void)
}

export class Enemy extends Entity{
  haste : boolean

  actions: EnemyAction[]
  actionCounter: number = 0
  stanceImmunity : AttackType | undefined = undefined

  public constructor(hp: number, name: string, icon: string, actions: EnemyAction[], defense: number = 0, haste : boolean = false){
    super(hp, name, icon, defense)
    this.actions = actions;
    this.haste = haste;
  }

  public doNextAction(target: Entity, enemyList: Enemy[]){
    this.actions[this.actionCounter].action(target, this, enemyList)
    this.iterateAction()
  }

  public iterateAction(){
    this.actionCounter++
    this.actionCounter %= this.actions.length
  }

  public getActionName(diff: number){
    let n = (this.actionCounter + diff) % this.actions.length
    let action = this.actions[n]
    return action.name
  }

}

class Trotter extends Enemy {
  stanceImmunity : AttackType = AttackType.RANGED
  halfHealthBuffed : boolean = false

  wasAttackedThisAction: boolean = false

  public override takeDamage(atk: Attack): number {
    if (atk.type == this.stanceImmunity){
      logger.log(`${this.name} deflected ${atk.name} with his stance`)
      return 0
    }

    let dmgDealt = super.takeDamage(atk)
    if (dmgDealt > 0){
      this.wasAttackedThisAction = true;
    } 

    return dmgDealt
  }

  public override loseHp(n: number, target: string, source: string): void {
    super.loseHp(n, target, source)


    //half health buff check
    if (!this.halfHealthBuffed){
      if (this.hp <= (this.maxHp/2)){
        this.halfHealthBuffed = true
        this.tryApplyStatus(StatusType.FEEL_FINE, 1000)
        this.tryApplyStatus(StatusType.ARMOR_PIERCING, 1000)

        let summonAtk : EnemyAction = {name:"summon", action:(target : Entity, self : Enemy, enemyList : Enemy[]) => {
          if (enemyList.length >= 4){
            this.iterateAction()
            logger.log(`${this.name} failed to summon`)
          } else {
            let summon = pirateGhost()
            enemyList.push(summon)
            logger.log(`${this.name} summoned ${summon.name}`)

          }
        }}

        this.actions.push(summonAtk)
      }
    }
  }

  public override endOfActionEffects(): void {
    if (this.wasAttackedThisAction){
      this.swapStance()
      this.wasAttackedThisAction = false
    }
  }

  public swapStance() {
    if (this.stanceImmunity == AttackType.RANGED){
      this.stanceImmunity = AttackType.MELEE
    } else if (this.stanceImmunity == AttackType.MELEE){
      this.stanceImmunity = AttackType.RANGED
    }
  }
}

export function dummy(){
  return new Enemy(10, "Dummy", "enemy.png", [
    {name:"nothing", action:(target : Entity, self : Enemy) => {}},
  ])
}

export function noob(){
  return new Enemy(20, "Noob", "enemy.png", [
    {name:"1 dmg action", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:1, name:"1dmghit"})
      self.dealDamage(target, atk)
    }},
    {name:"3 dmg action", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:3, name:"3dmghit"})
      self.dealDamage(target, atk)
    }},
    {name:"5 hp heal", action:(target : Entity, self : Enemy) => {
      self.addHp(5)
    }}
  ])
}

export function trotter(n:string){
  
    let barrelAtk : EnemyAction = {name:"barrel", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10, name:"Barrel"})
      let dmgDealt = self.dealDamage(target, atk)
      if (dmgDealt > 0){
        target.tryApplyStatus(StatusType.FIRE, 5) //TODO have status deflection be coded into dealDamage, not hard coded in each attack
      }
    }}

    let coinAtk : EnemyAction = {name:"coin", action:(target : Entity, self : Enemy) => {
      if (Math.random() > 0.5){
        let atk: Attack = createAttack({dmg:14, name:"Single Shot"})
        self.dealDamage(target, atk)
        
      } else {
        let atk: Attack = createAttack({dmg:5, name:"Triple Shot 1"})
        self.dealDamage(target, atk)

        let atk2: Attack = createAttack({dmg:5, name:"Triple Shot 2"})
        self.dealDamage(target, atk2)
        
        let atk3: Attack = createAttack({dmg:5, name:"Triple Shot 3"})
        self.dealDamage(target, atk3)
      }

    }}

    let prepAtk : EnemyAction = {name:"prepare", action:(target : Entity, self : Enemy) => {
    self.tryApplyStatus(StatusType.ARMOR_UP, 3, 1)

    }}

    let firebrandAtk : EnemyAction = {name:"firebrand", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10, name:"Firebrand", undodgeable:true})
      let dmgDealt = self.dealDamage(target, atk)
      if (dmgDealt > 0){
        target.tryApplyStatus(StatusType.FIRE, 5) //TODO have status deflection be coded into dealDamage, not hard coded in each attack
        target.tryApplyStatus(StatusType.DAMAGE_DOWN, 5, 2)
      }
    }}

    let atkList : EnemyAction[] = [coinAtk, barrelAtk, coinAtk, barrelAtk, prepAtk, barrelAtk, firebrandAtk]
    return new Trotter(40, "Trotter "+n, "trotter.png", atkList, 0, true)
}

function pirateGhost(){
  let barrelAtk : EnemyAction = {name:"barrel", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10, name:"Barrel"})
      let dmgDealt = self.dealDamage(target, atk)
      if (dmgDealt > 0){
        target.tryApplyStatus(StatusType.FIRE, 5) //TODO have status deflection be coded into dealDamage, not hard coded in each attack
      }
    }}

  let coinAtk : EnemyAction = {name:"coin", action:(target : Entity, self : Enemy) => {
    if (Math.random() > 0.5){
      let atk: Attack = createAttack({dmg:14, name:"Single Shot"})
      self.dealDamage(target, atk)
      
    } else {
      let atk: Attack = createAttack({dmg:5, name:"Triple Shot 1"})
      self.dealDamage(target, atk)

      let atk2: Attack = createAttack({dmg:5, name:"Triple Shot 2"})
      self.dealDamage(target, atk2)
      
      let atk3: Attack = createAttack({dmg:5, name:"Triple Shot 3"})
      self.dealDamage(target, atk3)
    }
  }}

  let atkList : EnemyAction[] = [coinAtk, barrelAtk] //should actually be random not alternating, but shouldn't matter much
  return new Enemy(2, "Ghost", "ghost.png", atkList, 10)
}

export function megaphoneMan(){
  let smack : EnemyAction = {name:"smack", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:8, name:"Smack"})
      self.dealDamage(target, atk)
    }}

  let motivate : EnemyAction = {name:"motivate", action:(target : Entity, self : Enemy, enemyList: Enemy[]) => {
    enemyList.forEach(e => e.addHp(10))
    self.tryApplyStatus(StatusType.EXHAUSTED, 3)
  }}

  let atkList : EnemyAction[] = [smack, motivate] 
  return new Enemy(10, "Megaphone", "megaphoneman.png", atkList)
}
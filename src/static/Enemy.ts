import { Attack, AttackType, createAttack } from "./Attack";
import { Entity } from "./gameClasses";
import { StatusType } from "./StatusHolder";

type EnemyAction = {
  name: string,
  action: ((target : Entity, self : Enemy, enemyList : Enemy[]) => void)
}

export class Enemy extends Entity{
  name: string
  haste : boolean

  actions: EnemyAction[]
  actionCounter: number = 0
  stanceImmunity : AttackType | undefined = undefined

  public constructor(hp: number, name: string, actions: EnemyAction[], defense: number = 0, haste : boolean = false){
    super(hp, defense)
    this.name = name;
    this.actions = actions;
    this.haste = haste;
  }

  public doNextAction(target: Entity, enemyList: Enemy[]){
    this.actions[this.actionCounter].action(target, this, enemyList)
    this.iterateAction()
  }

  public iterateAction(){
    //TODO: if summon is added immediately after firebrand, does it trigger immediately? as is, no
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
      return 0
    }

    let dmgDealt = super.takeDamage(atk)
    if (dmgDealt > 0){
      this.wasAttackedThisAction = true;
    } 

    return dmgDealt
  }

  public override loseHp(n: number): void {
    super.loseHp(n)

    if (!this.halfHealthBuffed){
      if (this.hp <= (this.maxHp/2)){
        this.halfHealthBuffed = true
        this.tryApplyStatus(StatusType.FEEL_FINE, 1000)
        this.tryApplyStatus(StatusType.ARMOR_PIERCING, 1000)

        let summonAtk : EnemyAction = {name:"summon", action:(target : Entity, self : Enemy, enemyList : Enemy[]) => {
          if (enemyList.length >= 4){
            this.iterateAction()
          } else {
            enemyList.push(pirateGhost())
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
  return new Enemy(10, "Dummy", [
    {name:"nothing", action:(target : Entity, self : Enemy) => {}},
  ])
}

export function noob(){
  return new Enemy(20, "Noob", [
    {name:"1 dmg action", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:1})
      self.dealDamage(target, atk)
    }},
    {name:"3 dmg action", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:3})
      self.dealDamage(target, atk)
    }},
    {name:"5 hp heal", action:(target : Entity, self : Enemy) => {
      self.addHp(5)
    }}
  ])
}

export function trotter(){
  
    let barrelAtk : EnemyAction = {name:"barrel", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10})
      let dmgDealt = self.dealDamage(target, atk)
      if (dmgDealt > 0){
        target.tryApplyStatus(StatusType.FIRE, 5) //TODO have status deflection be coded into dealDamage, not hard coded in each attack
      }
    }}

    let coinAtk : EnemyAction = {name:"coin", action:(target : Entity, self : Enemy) => {
      if (Math.random() > 0.5){
        let atk: Attack = createAttack({dmg:14})
        self.dealDamage(target, atk)
        
      } else {
        let atk: Attack = createAttack({dmg:5})
        self.dealDamage(target, atk)

        let atk2: Attack = createAttack({dmg:5})
        self.dealDamage(target, atk2)
        
        let atk3: Attack = createAttack({dmg:5})
        self.dealDamage(target, atk3)
      }

    }}

    let prepAtk : EnemyAction = {name:"prepare", action:(target : Entity, self : Enemy) => {
    self.tryApplyStatus(StatusType.ARMOR_UP, 3, 1)

    }}

    let firebrandAtk : EnemyAction = {name:"firebrand", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10, undodgeable:true})
      let dmgDealt = self.dealDamage(target, atk)
      if (dmgDealt > 0){
        target.tryApplyStatus(StatusType.FIRE, 5) //TODO have status deflection be coded into dealDamage, not hard coded in each attack
        target.tryApplyStatus(StatusType.DAMAGE_DOWN, 5, 2)
      }
    }}

    let atkList : EnemyAction[] = [coinAtk, barrelAtk, coinAtk, barrelAtk, prepAtk, barrelAtk, firebrandAtk]
    return new Trotter(40, "Trotter", atkList, 0, true)
}

function pirateGhost(){
  let barrelAtk : EnemyAction = {name:"barrel", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10})
      let dmgDealt = self.dealDamage(target, atk)
      if (dmgDealt > 0){
        target.tryApplyStatus(StatusType.FIRE, 5) //TODO have status deflection be coded into dealDamage, not hard coded in each attack
      }
    }}

  let coinAtk : EnemyAction = {name:"coin", action:(target : Entity, self : Enemy) => {
    if (Math.random() > 0.5){
      let atk: Attack = createAttack({dmg:14})
      self.dealDamage(target, atk)
      
    } else {
      let atk: Attack = createAttack({dmg:5})
      self.dealDamage(target, atk)

      let atk2: Attack = createAttack({dmg:5})
      self.dealDamage(target, atk2)
      
      let atk3: Attack = createAttack({dmg:5})
      self.dealDamage(target, atk3)
    }
  }}

  let atkList : EnemyAction[] = [coinAtk, barrelAtk] //should actually be random not alternating, but shouldn't matter much
  return new Enemy(2, "Ghost", atkList, 10)
}
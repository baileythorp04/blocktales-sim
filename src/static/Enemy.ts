import { Attack, AttackType, createAttack } from "./Attack";
import { Entity } from "./gameClasses";
import { StatusType } from "./StatusHolder";

type EnemyAction = {
  name: string,
  action: ((target : Entity, self : Enemy) => void)
}

export class Enemy extends Entity{
  actions: EnemyAction[]

  public constructor(hp: number, actions: EnemyAction[], defense: number = 0){
    super(hp, defense)
    this.actions = actions;
  }

  public doAction(target: Entity){

    const action = this.actions.shift()
    if (!action){
      console.error("Action does not exist")
      return
    }
    action.action(target, this)
    this.actions.push(action)

    //TODO handle new actions changing at half health (swap out EnemyAction object somehow?) (summon is inserted in after inferno)
    //TODO: summoning when full has no effect (doesn't skip)
  }

  public getActionName(n: number){
    //console.error("has "+this.actions.length+" actions")
    n = (n-1) % this.actions.length
    let action = this.actions[n]
    return action.name
  }

}

export function dummy(){
  return new Enemy(10, [
    {name:"nothing", action:(target : Entity, self : Enemy) => {}},
  ])
}

export function noob(){
  return new Enemy(20, [
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

    let summonAtk : EnemyAction = {name:"summon", action:(target : Entity, self : Enemy) => {
      //????
    }}

    let atkList : EnemyAction[] = [coinAtk, barrelAtk, coinAtk, prepAtk, barrelAtk, firebrandAtk]
    return new Enemy(40, atkList)
}
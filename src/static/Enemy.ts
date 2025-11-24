import { Attack, AttackType, createAttack } from "./Attack";
import { Entity } from "./gameClasses";
import { StatusType } from "./StatusHolder";

type enemyAction = {
  name: string,
  action: ((target : Entity, self : Enemy) => void)
}

export class Enemy extends Entity{
  actions: enemyAction[]

  public constructor(hp: number, actions: enemyAction[], defense: number = 0){
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

    //TODO handle new actions changing at half health (swap out enemyAction object somehow?) (summon is inserted in after inferno)
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
  //TODO put these in the correct order
  return new Enemy(40, [
    {name:"barrel", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10})
      self.dealDamage(target, atk)
    }},
    {name:"single coin", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:14})
      self.dealDamage(target, atk)
    }},
    {name:"triple coin", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:7})
      self.dealDamage(target, atk)

      let atk2: Attack = createAttack({dmg:7})
      self.dealDamage(target, atk2)
      
      let atk3: Attack = createAttack({dmg:7})
      self.dealDamage(target, atk3)
    }},
    {name:"prepare", action:(target : Entity, self : Enemy) => {
    self.tryApplyStatus(StatusType.ARMOR_UP, 3, 1)

    }},
    {name:"firebrand", action:(target : Entity, self : Enemy) => {
      let atk: Attack = createAttack({dmg:10, undodgeable:true})
      self.dealDamage(target, atk)
      target.tryApplyStatus(StatusType.FIRE, 5)
      target.tryApplyStatus(StatusType.DAMAGE_DOWN, 5, 2)
    }},
    {name:"summon", action:(target : Entity, self : Enemy) => {
      //????
    }},
  ])
}
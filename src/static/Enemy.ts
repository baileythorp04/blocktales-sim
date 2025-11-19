import { Entity } from "./gameClasses";

type EnemyAttack = {
  name: string,
  action: ((target : Entity, self : Enemy) => void)
}

export class Enemy extends Entity{
  attacks: EnemyAttack[]

  public constructor(hp: number, attacks: EnemyAttack[], defense: number = 0){
    super(hp, defense)
    this.attacks = attacks;
  }

  public doAttack(target: Entity){

    const attack = this.attacks.shift()
    if (!attack){
      console.error("Attack does not exist")
      return
    }
    attack.action(target, this)
    this.attacks.push(attack)

    //TODO handle new attacks changing at half health (swap out EnemyAttack object somehow?)
    //TODO handle skipping atttacks (action gets return value)
  }

  public getAttackName(n: number){
    //console.error("has "+this.attacks.length+" attacks")
    n = (n-1) % this.attacks.length
    let attack = this.attacks[n]
    return attack.name
  }

}

export function dummy(){
  return new Enemy(10, [
    {name:"nothing", action:(target : Entity, self : Enemy) => {}},
  ])
}

export function trotter(){
  return new Enemy(40, [
    {name:"1 dmg attack", action:(target : Entity, self : Enemy) => {self.dealDamage(target, 1)}},
    {name:"3 dmg attack", action:(target : Entity, self : Enemy) => {self.dealDamage(target, 3)}},
    {name:"5 hp heal", action:(target : Entity, self : Enemy) => {self.addHp(5)}}
  ])
}
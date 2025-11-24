import { Player } from "./gameClasses"
import { PierceLevel, AttackType, Attack, createAttack } from "./Attack";

import { Enemy } from "./Enemy"
import { StatusType } from "./StatusHolder";

let idCounter = 0;

export class Action{
  id: number;
  icon: string;
  name: string;
  spCost: number;
  hpCost: number;
  doEffect: (player: Player, target: Enemy ) => void | string;

  public constructor(icon: string, name: string, spCost: number, doEffect:(player: Player, target: Enemy) => void | string, hpCost: number = 0 ){
    this.id = idCounter++;
    this.icon = icon;
    this.name = name;
    this.spCost = spCost;
    this.hpCost = hpCost;
    this.doEffect = doEffect;
    
  }

}



export const DEFAULT_ACTIONS: Action[] = [

  //TODO: program double turns later
  new Action("defend.png", "Defend", 0, (player: Player, target: Enemy ) => {
    debugger
    player.tryApplyStatus(StatusType.DEFENDING, 1)
    player.addSp(player.spOnPass);
  }), 
  new Action("pass.png", "Pass", 0, (player: Player, target: Enemy ) => {
    player.addSp(player.spOnPass);
  }),
  new Action("ball.png", "Ball", 0, (player: Player, target: Enemy ) => {
    let atk: Attack = createAttack({dmg:1, type:AttackType.RANGED})
    player.dealDamage(target, atk)

    //ball's guranteed, unmodifiable second hit
    target.loseHp(1);  //TODO make this not work on trotter's ball stance
  }),
  new Action("sword.png", "Sword", 0, (player: Player, target: Enemy ) => {
    let atk: Attack = createAttack({dmg:2, type:AttackType.MELEE, piercing:PierceLevel.HALF})
    player.dealDamage(target, atk)
  }),
  new Action("dynamite.png", "Dynamite", 5, (player: Player, target: Enemy ) => {
    let atk: Attack = createAttack({dmg:5, type:AttackType.RANGED, piercing:PierceLevel.FULL})
    player.dealDamage(target, atk)
  }),

];
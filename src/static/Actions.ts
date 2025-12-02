import { Player } from "./gameClasses"
import { PierceLevel, AttackType, Attack, createAttack } from "./Attack";

import { Enemy } from "./Enemy"
import { StatusType } from "./StatusHolder";
import { logger } from "./logger";

let idCounter = 0;

export class Action{
  icon: string;
  name: string;
  spCost: number;
  hpCost: number;
  isHeal: boolean;
  doEffect: (player: Player, target: Enemy, enemyList: Enemy[]) => void | string;

  public constructor(icon: string, name: string, spCost: number, doEffect:(player: Player, target: Enemy, enemyList: Enemy[]) => void | string, isHeal: boolean = false, hpCost: number = 0 ){
    this.icon = icon;
    this.name = name;
    this.spCost = spCost;
    this.hpCost = hpCost;
    this.isHeal = isHeal;
    this.doEffect = doEffect;
    
  }

}



export const DEFAULT_ACTIONS: Action[] = [

  new Action("ball.png", "Ball", 0, (player: Player, target: Enemy ) => {
    let atk: Attack = createAttack({dmg:1, name:"Ball", type:AttackType.RANGED})
    player.dealDamage(target, atk)

    let atk2: Attack = createAttack({dmg:1, name:"Ball's second hit", type:AttackType.RANGED, piercing:PierceLevel.FULL, boostable:false}) //to deal with hyperball's unique case, have a new pierce level which floors damage at 1 and doesn't get buffed
    player.dealDamage(target, atk2)
  }),
  new Action("sword.png", "Sword", 0, (player: Player, target: Enemy, enemyList: Enemy[]) => {
    let atk: Attack = createAttack({dmg:2, name:"Sword", type:AttackType.MELEE, piercing:PierceLevel.HALF})
    player.dealDamage(enemyList[0], atk)
  }),
  new Action("dynamite.png", "Dynamite", 5, (player: Player, target: Enemy ) => {
    let atk: Attack = createAttack({dmg:5, name:"Dynamite", type:AttackType.RANGED, piercing:PierceLevel.FULL})
    player.dealDamage(target, atk)
  }),

];

export const DEFEND_ACTION: Action = new Action("defend.png", "Defend", 0, (player: Player, target: Enemy ) => {
  player.tryApplyStatus(StatusType.DEFENDING, 1)
  player.addSp(player.spOnPass);
})

export const PASS_ACTION: Action = new Action("pass.png", "Pass", 0, (player: Player, target: Enemy ) => {
  player.addSp(player.spOnPass);
})

export const DO_NOTHING_ACTION: Action = new Action("sleep.png", "Sleep", 0, (player: Player, target: Enemy ) => {
  logger.log(`${player.name} did nothing`)
})
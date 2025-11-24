import { PierceLevel, Player } from "./gameClasses"
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
    player.tryApplyStatus(StatusType.DEFENDING, 1)
    player.addSp(player.spOnPass);
  }), 
  new Action("pass.png", "Pass", 0, (player: Player, target: Enemy ) => {
    player.addSp(player.spOnPass);
  }),
  new Action("ball.png", "Ball", 0, (player: Player, target: Enemy ) => {
    player.dealDamage(target, 1)
    target.loseHp(1); //ball's guranteed, unmodifiable second hit
  }),
  new Action("sword.png", "Sword", 0, (player: Player, target: Enemy ) => {
    player.dealDamage(target, 2, PierceLevel.HALF) // TODO: account for half armor piercing (see also e.takeDamage())
  }),
  new Action("dynamite.png", "Dynamite", 5, (player: Player, target: Enemy ) => {
    player.dealDamage(target, 5, PierceLevel.FULL) // TODO: account for armor piercing (see also e.takeDamage())
  }),

];
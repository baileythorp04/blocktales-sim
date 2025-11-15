import { Player, Enemy, StatusEffect } from "./gameClasses"

let idCounter = 0;

export class Action{
  id: number;
  icon: string;
  name: string;
  spCost: number;
  doEffect: (player: Player, target: Enemy ) => void;

  public constructor(icon: string, name: string, spCost: number, doEffect:(player: Player, target: Enemy) => void ){
    this.id = idCounter++;
    this.icon = icon;
    this.name = name;
    this.spCost = spCost;
    this.doEffect = doEffect;
  }

}



export const DEFAULT_ACTIONS: Action[] = [

//  new Action("defend.png", "Defend", 0, 0), //TODO: program double turns later
  new Action("pass.png", "Pass", 0, (player: Player, target: Enemy ) => {
    player.addSp(player.spOnPass);
  }),
  new Action("ball.png", "Ball", 0, (player: Player, target: Enemy ) => {
    player.dealDamage(target,1)
    target.hp -= 1; //ball's guranteed, unmodifiable second hit
  }),
  new Action("sword.png", "Sword", 0, (player: Player, target: Enemy ) => {
    player.dealDamage(target,2) // TODO: account for half armor piercing (see also e.takeDamage())
  }),
  new Action("dynamite.png", "Dynamite", 5, (player: Player, target: Enemy ) => {
    player.dealDamage(target,5) // TODO: account for armor piercing (see also e.takeDamage())
  }),

];
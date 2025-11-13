import { Player, Enemy, StatusEffect } from "./gameClasses"

let idCounter = 0;

export class Action{
  id: number;
  icon: string;
  name: string;
  spCost: number;
  doEffect: (player: Player, enemy: Enemy ) => void;

  public constructor(icon: string, name: string, spCost: number, doEffect:(player: Player, enemy: Enemy) => void ){
    this.id = idCounter++;
    this.icon = icon;
    this.name = name;
    this.spCost = spCost;
    this.doEffect = doEffect;
  }

}



export const DEFAULT_ACTIONS: Action[] = [

//  new Action("defend.png", "Defend", 0, 0), //TODO: program double turns later
  new Action("pass.png", "Pass", 0, (player: Player, enemy: Enemy ) => {
    player.addSp(1);
  }),
  new Action("ball.png", "Ball", 0, (player: Player, enemy: Enemy ) => {
    player.dealDamage(enemy,1)
    enemy.hp -= 1; //ball's guranteed, unmodifiable second hit
  }),
  new Action("sword.png", "Sword", 0, (player: Player, enemy: Enemy ) => {
    player.dealDamage(enemy,2) // TODO: account for half armor piercing (see also e.takeDamage())
  }),
  new Action("dynamite.png", "Dynamite", 5, (player: Player, enemy: Enemy ) => {
    player.dealDamage(enemy,5) // TODO: account for armor piercing (see also e.takeDamage())
  }),

];
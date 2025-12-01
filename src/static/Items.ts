import { Action } from "./Actions";
import { Player } from "./gameClasses";
import { StatusType } from "./StatusHolder";

export class Item extends Action{
  usable: boolean;

  public constructor(icon: string, name: string, doEffect:(player: Player) => void | string, isHeal: boolean = false, usable: boolean = true){
    super(icon, name, 0, doEffect, isHeal)
    this.usable = usable;
  } 

}


export const BUYABLE_ITEMS: Item[] = [

  new Item("slateskin_potion.png", "Slateskin Potion", (player: Player) => {
    player.tryApplyStatus(StatusType.HALF_DAMAGE, 5)
  }),

  new Item("medkit.png", "Medkit", (player: Player) => {}, false, false //isheal, unusable
  ),

  new Item("ghost_burger.png", "Ghost Burger", (player: Player) => {
    player.addHp(player.itemPlusBuff(6))
    player.tryApplyStatus(StatusType.INVISIBLE, 1) //remove feelfine, apply 2 exhaused. immune to damage and debuffs
  }),

  new Item("burger.png", "Burger", (player: Player) => {
    player.addHp(player.itemPlusBuff(5))
  }, true
),

]
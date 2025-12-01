import { Action } from "./Actions";
import { Player } from "./gameClasses";
import { StatusType } from "./StatusHolder";

export class Item extends Action{
  usable: boolean;

  public constructor(icon: string, name: string, doEffect:(player: Player) => void | string, usable: boolean = true){
    super(icon, name, 0, doEffect)
    this.usable = usable;
  } 

}


export const BUYABLE_ITEMS: Item[] = [

  new Item("slateskin_potion.png", "Slateskin Potion", (player: Player) => {
    player.tryApplyStatus(StatusType.HALF_DAMAGE, 5)
  }),

  new Item("medkit.png", "Medkit", (player: Player) => {}, false //unusable
  ),

  new Item("ghost_burger.png", "Ghost Burger", (player: Player) => {
    player.tryApplyStatus(StatusType.INVISIBLE, 1) //remove feelfine, apply 2 exhaused. immune to damage and debuffs
  }),

  new Item("burger.png", "Burger", (player: Player) => {
    return player.addHp(5)
  }),

]
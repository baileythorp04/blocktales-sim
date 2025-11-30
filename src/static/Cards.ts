import { useState } from "react";
import {Player} from "./gameClasses"
import {Enemy} from "./Enemy"
import {Action} from "./Actions"
import { StatusType } from "./StatusHolder";
import { PierceLevel, AttackType, Attack, createAttack } from "./Attack";

let idCounter = 0;

export enum CardType {
  ACTIVE,
  START_OF_COMBAT,
  START_OF_TURN,
}

export class Card {
  id: number;
  icon: string;
  name: string;
  bux: number;
  bp: number;

  enabled: boolean;

  type: CardType;
  effect: (player: Player, card: Card) => void;

  public constructor(icon: string, name: string, bux: number, bp: number, type: CardType, effect: (player: Player, card: Card) => void, startEnabled: boolean = true) {
    this.id = idCounter++;
    this.icon = icon;
    this.name = name;
    this.bux = bux;
    this.bp = bp;

    this.enabled = startEnabled;

    this.type = type,
    this.effect = effect;

  }

  public doEffect(player: Player){
    this.effect(player, this)
  }
}

export const BUYABLE_CARDS: Card[] = [

  new Card("ante_up.png", "Ante Up", 5, 4, CardType.START_OF_COMBAT, (player: Player) => {
    player.attackBoost += 1;
  }),

  new Card("defend+.png", "Defend+", 5, 4, CardType.START_OF_COMBAT, (player: Player) => {
    player.defense += 1;
  }), 

  new Card("sp_saver.png", "SP Saver", 4, 3, CardType.START_OF_COMBAT, (player: Player) => {
    player.actions.forEach((action)=> {
      if (action.spCost > 0) {
        action.spCost = Math.max(action.spCost - 1, 1)
      }
    })
  }), 

  new Card("sp_regen+.png", "SP Regen+", 4, 2, CardType.START_OF_COMBAT, (player: Player) => {
    player.spOnPass++;
  }),

  new Card("item+.png", "Item+", 3, 3, CardType.START_OF_COMBAT, (player: Player) => {
    // TODO implement items
  }),

  new Card("defender.png", "Defender", 2, 3, CardType.START_OF_COMBAT, (player: Player) => {
    player.defense++;
    player.attackBoost--;
  }), 

  new Card("sp_drain.png", "SP Drain", 2, 1, CardType.START_OF_COMBAT, (player: Player) => {
    player.spOnHit++;
    player.attackBoost--;
  }), 

  new Card("hp_drain.png", "HP drain", 2, 1, CardType.START_OF_COMBAT, (player: Player) => {
    player.hpOnHit++;
    player.attackBoost--;

  }), 

  new Card("good_vibes.png", "Good Vibes", 1, 2, CardType.ACTIVE, (player: Player) => {
    let action = new Action("good_vibes.png", "Good Vibes", 3, (player: Player, target: Enemy) => {
      player.tryApplyStatus(StatusType.GOOD_VIBES_SLEEP, 3)
    })
    player.actions = player.actions.concat(action);
  }), 

  new Card("cure.png", "Cure", 0, 2, CardType.ACTIVE, (player: Player) => {
    let action = new Action("cure.png", "Cure", 2, (player: Player, target: Enemy) => {
      if (player.hp < player.maxHp){
        player.addHp(5)
      } else {
        return "refund"
      }
    })
    player.actions = player.actions.concat(action);
  }),

  new Card("resurrect.png", "Resurrect", 0, 2, CardType.START_OF_TURN, (player: Player, thisCard: Card) => {
    //TODO maybe fix the resurrect jank problem by doing something useful here?
  }),

  new Card("happy_hp.png", "Happy HP", 0, 1, CardType.START_OF_TURN, (player: Player, thisCard: Card) => {
    if (thisCard.enabled) {
      player.addHp(1);
    }
    thisCard.enabled = !thisCard.enabled
  }, false //startEnabled
  ),

  new Card("linebounce.png", "Linebounce (WIP)", 0, 1, CardType.ACTIVE, (player: Player) => {
    let action = new Action("linebounce.png", "Linebounce (WIP)", 2, (player: Player, target: Enemy) => {
      //TODO code in multi-targetting later (or dont)
    })
    player.actions = player.actions.concat(action);
  }), 

  new Card("minimize.png", "Minimize", 0, 1, CardType.ACTIVE, (player: Player) => {
    let action = new Action("minimize.png", "Minimize", 2, (player: Player, target: Enemy) => {
      let atk: Attack = createAttack({dmg:2, type:AttackType.RANGED})
      let dmgDealt = player.dealDamage(target, atk)
      if (dmgDealt > 0){
        target.tryApplyStatus(StatusType.SMALL, 3) //TODO have status deflection be coded into dealDamage, not hard coded in each attack
      }
    })
    player.actions = player.actions.concat(action);
  }), 

  new Card("daze.png", "Daze (WIP)", 0, 1, CardType.ACTIVE, (player: Player) => {
    let action = new Action("daze.png", "Daze (WIP)", 2, (player: Player, target: Enemy) => {
      //TODO code in multi-targetting later (or dont)
      //TODO code in daze status effect (and immunity chance)

    })
    player.actions = player.actions.concat(action);
  }), 

  new Card("pity_sp.png", "Pity SP", 0, 0, CardType.ACTIVE, (player: Player) => {
    let action = new Action("pity_sp.png", "Pity SP", 0, (player: Player, target: Enemy) => {
      player.addSp(5)
    },
    10 //hpCost
  )
    player.actions = player.actions.concat(action);
  }), 

  new Card("power_stab.png", "Power Stab", 0, 0, CardType.ACTIVE, (player: Player) => {
    let action = new Action("power_stab.png", "Power Stab", 2, (player: Player, target: Enemy, enemyList: Enemy[]) => {
      let atk: Attack = createAttack({dmg:3, type:AttackType.MELEE, piercing:PierceLevel.HALF})
      player.dealDamage(enemyList[0], atk)
    })
    player.actions = player.actions.concat(action);
  }), 
  
  //cards are entered alphabetically
  //then sort by bp
  //cardList.sort((a, b) => a.bp > b.bp ? -1 : 1);
  //then sort by bux
  //cardList.sort((a, b) => a.bux > b.bux ? -1 : 1);
];



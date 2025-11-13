import { useState } from "react";
import { Player, StatusEffect } from "./gameClasses"

let idCounter = 0;

enum CardType {
  ACTIVE,
  START_OF_COMBAT,
  ON_ATTACK, //ante up, hp leech
  START_OF_TURN,
}

export class Card {
  id: number;
  icon: string;
  name: string;
  bux: number;
  bp: number;

  type: CardType;
  effect: (player: Player, card?: Card) => void;

  public constructor(icon: string, name: string, bux: number, bp: number, type: CardType, effect: (player: Player) => void) {
    this.id = idCounter++;
    this.icon = icon;
    this.name = name;
    this.bux = bux;
    this.bp = bp;

    this.type = type,
    this.effect = effect;

    //available targets
    //card type (when does it activate?)
    //effect(player, enemy | enemy[], ) => void (for active usable cards)
    //  do enemy.takedamage() or player.dealdamage(enemy)?
    // the second one, so damage mods can take effect in player.dealdamage.

    //make each card extend Card and override Effect
  }

  //this only applies to selectable turn cards
  public doEffect(target: Player, dmg?: number, status?: StatusEffect) {
    if (dmg !== undefined){ //TODO: better way to check if undefined
      target.takeDamage(dmg)
    }
    if (status !== undefined){ 
      //target.applyStatus(status)
    }
  }

}

export const BUYABLE_CARDS: Card[] = [

  new Card("ante_up.png", "Ante Up", 5, 4, CardType.START_OF_COMBAT, (player: Player) => {
    player.attackBoost += 1;
  }),
  new Card("defend+.png", "Defend+", 5, 4, CardType.START_OF_COMBAT, (player: Player) => {
    player.defense =+ 1;
  }), 
  new Card("sp_saver.png", "SP Saver", 4, 3, CardType.START_OF_COMBAT, (player: Player) => {
    //reduce cost of all player.actions
  }), 
  new Card("sp_regen+.png", "SP Regen+", 4, 2, CardType.START_OF_COMBAT, (player: Player) => {
    //alter the pass and defend actions
  }),
  new Card("item+.png", "Item+", 3, 3, CardType.START_OF_COMBAT, (player: Player) => {
    // idk
  }), 
  new Card("sp_drain.png", "SP Drain", 2, 1, CardType.ON_ATTACK, (player: Player) => {
    //havent figured out how to do the -1 atk yet
    player.addSp(1)
  }), 
  new Card("hp_drain.png", "HP drain", 2, 1, CardType.ON_ATTACK, (player: Player) => {
    //havent figured out how to do the -1 atk yet
    player.addHp(1)
  }), 
  new Card("good_vibes.png", "Good Vibes", 1, 2, CardType.ACTIVE, (player: Player) => {
    //add action
  }), 
  new Card("charge.png", "Charge", 1, 1, CardType.ACTIVE, (player: Player) => {
    //add action
  }),
  new Card("cure.png", "Cure", 0, 2, CardType.ACTIVE, (player: Player) => {
    //add action
  }),
  new Card("resurrect.png", "Resurrect", 0, 2, CardType.START_OF_TURN, (player: Player) => {
    //make sure this happens before the death check in game.startOfTurn()
    //TODO: will implement a 'has-self-revived' counter when I do the four-functions card implementation later
    if (player.hp >= 0){
      player.hp = 5;
    }
  }),
  new Card("happy_hp.png", "Happy HP", 0, 1, CardType.START_OF_TURN, (player: Player) => {
    //TODO: will implement a odd-turn counter when I do the four-functions card implementation later
    player.addHp(1);
  }), 
  new Card("linebounce.png", "Linebounce", 0, 1, CardType.ACTIVE, (player: Player) => {
    //add action
  }), 
  new Card("minimize.png", "Minimize", 0, 1, CardType.ACTIVE, (player: Player) => {
    //add action
  }), 
  new Card("daze.png", "Daze", 0, 1, CardType.ACTIVE, (player: Player) => {
    //add action
  }), 
  new Card("pity_sp.png", "Pity SP", 0, 0, CardType.ACTIVE, (player: Player) => {
    //add action
  }), 
  new Card("power_stab.png", "Power Stab", 0, 0, CardType.ACTIVE, (player: Player) => {
    //add action
  }), 
  
  //cards are entered alphabetically
  //then sort by bp
  //cardList.sort((a, b) => a.bp > b.bp ? -1 : 1);
  //then sort by bux
  //cardList.sort((a, b) => a.bux > b.bux ? -1 : 1);
];

export const DEFAULT_CARDS: Card[] = [

//   new Card("defend.png", "Defend", 0, 0),
//   new Card("pass.png", "Pass", 0, 0),
//   new Card("ball.png", "Ball", 0, 0),
//   new Card("sword.png", "Sword", 0, 0),
//   new Card("dynamite.png", "Dynamite", 0, 0),

];

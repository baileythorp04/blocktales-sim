import { useState } from "react";
import { Entity, StatusEffect } from "@/classes/gameClasses"

let idCounter = 0;

export class Card {
  id: number;
  icon: string;
  name: string;
  bux: number;
  bp: number

  public constructor(icon: string, name: string, bux: number, bp: number) {
    this.id = idCounter++;
    this.icon = icon;
    this.name = name;
    this.bux = bux;
    this.bp = bp;

    // this.effect = effect; (function?)
    // can figure out how to implement effects when the combat system is started
  }

  //this only applies to selectable turn cards
  public doEffect(target: Entity, dmg?: number, status?: StatusEffect) {
    if (dmg !== undefined){ //TODO: better way to check if undefined
      target.takeDamage(dmg)
    }
    if (status !== undefined){ 
      //target.applyStatus(status)
    }
  }

}

export function useCards() {

  //this whole list is being reloaded every time cardList is updated (or read? in menu.tsx). Should really be database of some kind
  let cardList: Card[] = [];
  idCounter = 0

  cardList.push(new Card("ante_up.png", "Ante Up", 5, 4));
  cardList.push(new Card("charge.png", "Charge", 1, 1));
  cardList.push(new Card("cure.png", "Cure", 0, 2));
  cardList.push(new Card("daze.png", "Daze", 0, 1));
  cardList.push(new Card("defend.png", "Defend+", 5, 4));
  cardList.push(new Card("good_vibes.png", "Good Vibes", 1, 2));
  cardList.push(new Card("happy_hp.png", "Happy HP", 0, 1));
  cardList.push(new Card("hp_drain.png", "HP drain", 2, 1));
  cardList.push(new Card("item.png", "Item+", 3, 3));
  cardList.push(new Card("linebounce.png", "Linebounce", 0, 1));
  cardList.push(new Card("minimize.png", "Minimize", 0, 1));
  cardList.push(new Card("pity_sp.png", "Pity SP", 0, 0));
  cardList.push(new Card("power_stab.png", "Power Stab", 0, 0));
  cardList.push(new Card("resurrect.png", "Resurrect", 0, 2));
  cardList.push(new Card("sp_drain.png", "SP Drain", 2, 1));
  cardList.push(new Card("sp_regen.png", "SP Regen+", 4, 2));
  cardList.push(new Card("sp_saver.png", "SP Saver", 4, 3));

  //cards are entered alphabetically
  //then sort by bp
  cardList.sort((a, b) => a.bp > b.bp ? -1 : 1);
  //then sort by bux
  cardList.sort((a, b) => a.bux > b.bux ? -1 : 1);

  return {
    cardList
  };
}
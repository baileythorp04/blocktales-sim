import { useState } from "react";
import { Entity, StatusEffect } from "./gameClasses"

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

export const BUYABLE_CARDS: Card[] = [

  new Card("ante_up.png", "Ante Up", 5, 4),
  new Card("defend+.png", "Defend+", 5, 4),
  new Card("sp_saver.png", "SP Saver", 4, 3),
  new Card("sp_regen+.png", "SP Regen+", 4, 2),
  new Card("item+.png", "Item+", 3, 3),
  new Card("sp_drain.png", "SP Drain", 2, 1),
  new Card("hp_drain.png", "HP drain", 2, 1),
  new Card("good_vibes.png", "Good Vibes", 1, 2),
  new Card("charge.png", "Charge", 1, 1),
  new Card("cure.png", "Cure", 0, 2),
  new Card("resurrect.png", "Resurrect", 0, 2),
  new Card("happy_hp.png", "Happy HP", 0, 1),
  new Card("linebounce.png", "Linebounce", 0, 1),
  new Card("minimize.png", "Minimize", 0, 1),
  new Card("daze.png", "Daze", 0, 1),
  new Card("pity_sp.png", "Pity SP", 0, 0),
  new Card("power_stab.png", "Power Stab", 0, 0),
  
  //cards are entered alphabetically
  //then sort by bp
  //cardList.sort((a, b) => a.bp > b.bp ? -1 : 1);
  //then sort by bux
  //cardList.sort((a, b) => a.bux > b.bux ? -1 : 1);
];

export const DEFAULT_CARDS: Card[] = [

  new Card("defend.png", "Defend", 0, 0),
  new Card("pass.png", "Pass", 0, 0),
  new Card("ball.png", "Ball", 0, 0),
  new Card("sword.png", "Sword", 0, 0),
  new Card("dynamite.png", "Dynamite", 0, 0),

];

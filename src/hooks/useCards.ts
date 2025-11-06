import { useState } from "react";

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
}

export function useCards() {

  let cardList: Card[] = [];

  cardList.push(new Card("ante_up.png", "Ante Up", 5, 4));
  cardList.push(new Card("charge.png", "Charge", 1, 1));
  cardList.push(new Card("cure.png", "Cure", 0, 2));

  //cards are entered alphabetically
  //then sort by bp
  //then sory by bux

  return {
    cardList
  };
}
import { Card } from "./Cards"
import { Item } from "./Items"

export type PlayerBuild = {
    hp: number
    sp: number
    selectedCards: Card[]
    selectedItems: Item[]
}
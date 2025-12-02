export enum PierceLevel {
  NONE,
  HALF,
  FULL,
} 

export enum AttackType {
  MELEE,
  RANGED,
  PURE,
} 

export type Attack = {
  dmg: number,
  name: string,
  piercing: PierceLevel,
  type: AttackType,
  undodgeable: boolean,
  boostable: boolean
}

export function createAttack({ dmg, name, piercing = PierceLevel.NONE, type = AttackType.MELEE, undodgeable = false, boostable = true}: {dmg : number, name: string, piercing? : PierceLevel, type? : AttackType, undodgeable? : boolean, boostable? : boolean }) {
    let atk : Attack = {dmg, name, piercing, type, undodgeable, boostable}
    return atk
}
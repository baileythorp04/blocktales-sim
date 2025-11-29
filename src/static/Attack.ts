//TODO put this enum somewhere more fitting
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
  piercing: PierceLevel,
  type: AttackType,
  undodgeable: boolean,
  boostable: boolean
}

export function createAttack({ dmg, piercing = PierceLevel.NONE, type = AttackType.MELEE, undodgeable = false, boostable = true}: {dmg : number, piercing? : PierceLevel, type? : AttackType, undodgeable? : boolean, boostable? : boolean }) {
    let atk : Attack = {dmg, piercing, type, undodgeable, boostable}
    return atk
}
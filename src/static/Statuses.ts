export enum StatusType {
  FIRE,
  DAMAGE_DOWN,
  SMALL,
  ARMOR_PIERCE,
  FEEL_FINE,
  GOOD_VIBES_SLEEP,
  ARMOR_UP,
}

const statusDebuffMap: Map<StatusType, boolean> = new Map([
  [StatusType.FIRE, true],
  [StatusType.DAMAGE_DOWN, true],
  [StatusType.SMALL, true],
  [StatusType.ARMOR_PIERCE, false],
  [StatusType.FEEL_FINE, false],
  [StatusType.GOOD_VIBES_SLEEP, true],
  [StatusType.ARMOR_UP, false],
])
//fire: DoT
//dmg down: attack modifier (modified getAttackBoost())
//small: attack modifier (modified getAttackBoost())
//armor pierce: attack modifier
//feel fine: passive
//good vibes sleep: passive/start of turn
//armor up: on attacked (modified getDefense())


export class Statuses {
  statuses: StatusEffect[] = []

  public applyStatus(type: StatusType, duration: number, intensity: number){
    let existingStatus = this.statuses.find((s)=> {s.type == type})
    
    if (existingStatus == undefined){
      let newStatus = new StatusEffect(type, duration, intensity)
      this.statuses.concat(newStatus)
    } else {
      existingStatus.duration = Math.max(existingStatus.duration, duration)
      existingStatus.intensity = Math.max(existingStatus.intensity, intensity)
    }
  }

  public getStatusIntensity(type: StatusType){
    let status = this.statuses.find((s)=> {s.type == type})

    if (status == undefined){
      return 0
    } else {
      return status.intensity
    }

  }

  public decrementTimers() {
    this.statuses.forEach((s) => {
      s.duration--;
      if (s.duration == 0){
        this.removeStatus(s)
      }
    })
  }

  public removeStatus(status: StatusEffect | StatusType) {
    this.statuses = this.statuses.filter((s) => {!(s == status || s.type == status)})
  }

}


export class StatusEffect { 

  type: StatusType;
  duration: number;
  intensity: number;
  debuff: boolean;

  public constructor(type: StatusType, duration: number, intensity: number = 1){
    this.type = type;
    this.duration = duration;
    this.intensity = intensity;

    this.debuff = statusDebuffMap.get(type) || false;
  }
}



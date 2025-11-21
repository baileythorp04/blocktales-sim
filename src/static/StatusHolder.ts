//NOTE: all statuses tick at the start of the player's turn (before they choose an action)
// fire does deal damage a final time when it expires

export enum StatusType {
  FIRE,
  DAMAGE_DOWN,
  SMALL,
  ARMOR_PIERCING,
  FEEL_FINE,
  GOOD_VIBES_SLEEP,
  ARMOR_UP,
  HALF_DAMAGE,
  GARLIC,
  DEFENDING,
}
//TODO: will have to implement defence pierce status (which doenst apply to inferno) and damage for the other attacks if i want to do a sleep build

type statusProperties = {
  debuff: boolean,
  color: string,
  icon: string,
  hideIntensity: boolean,
}

export const statusMap: Map<StatusType, statusProperties> = new Map([
  [StatusType.FIRE, {debuff:true, color:"#ff8301", icon:"fire.png", hideIntensity:false}],
  [StatusType.DAMAGE_DOWN, {debuff:true, color:"#ac3232", icon:"damage_down.png", hideIntensity:false}],
  [StatusType.SMALL, {debuff:true, color:"#ac3232", icon:"small.png", hideIntensity:true}],
  [StatusType.ARMOR_PIERCING, {debuff:false, color:"#5b6ee1", icon:"armor_pierce.png", hideIntensity:true}],
  [StatusType.FEEL_FINE, {debuff:false, color:"#f7da47", icon:"feel_fine.png", hideIntensity:true}], //NOT YET IMPLEMENTED REMOVAL OF DEBUFFS UPON APPLICATION
  [StatusType.GOOD_VIBES_SLEEP, {debuff:true, color:"#847e87", icon:"sleep.png", hideIntensity:true}], //NOT YET IMPLEMENTED TURN SKIPPING/NO
  [StatusType.ARMOR_UP, {debuff:false, color:"#5b6ee1", icon:"armor_up.png", hideIntensity:false}],
  [StatusType.HALF_DAMAGE, {debuff:false, color:"#5b6ee1", icon:"half_damage.png", hideIntensity:true}],
  [StatusType.GARLIC, {debuff:false, color:"#6abe30", icon:"garlic.png", hideIntensity:true}],
  [StatusType.DEFENDING, {debuff:false, color:"#00c8ff", icon:"defend.png", hideIntensity:true}],
])

export function statusIsDebuff(type : StatusType) {
  return statusMap.get(type)?.debuff || false
}


export class StatusHolder {
  statusList: StatusEffect[] = []

  public applyStatus(type: StatusType, duration: number, intensity: number){ 
    let existingStatus = this.statusList.find((s)=> s.type == type)

    if (existingStatus == undefined){
      let newStatus = new StatusEffect(type, duration, intensity)
      this.statusList.push(newStatus)
    } else {
      existingStatus.duration = Math.max(existingStatus.duration, duration)
      existingStatus.intensity = Math.max(existingStatus.intensity, intensity)
    }
  }

  public getStatusIntensity(type: StatusType){
    let status = this.statusList.find((s) => s.type == type)
    if (status == undefined){
      return 0
    } else {
      return status.intensity
    }
  }

  public decrementTimers() {
    this.statusList.forEach((s) => {
      s.duration--;
      if (s.duration == 0){
        this.removeStatus(s)
      }
    })
  }

  public removeStatus(status: StatusEffect | StatusType) {
    this.statusList = this.statusList.filter((s) => !(s == status || s.type == status))
  }

  public removeAllDebuffs() {
    this.statusList = this.statusList.filter((s) => s.debuff != true)
  }
}


export class StatusEffect { 

  type: StatusType;
  duration: number;
  intensity: number;
  
  debuff: boolean = false;
  color: string = "red";
  icon: string = "";
  hideIntensity: boolean = false;

  public constructor(type: StatusType, duration: number, intensity: number = 1){
    this.type = type;
    this.duration = duration;
    this.intensity = intensity;
    
    let map = statusMap.get(type);
    if (map != undefined){
      this.debuff = map.debuff;
      this.color = map.color;
      this.icon = map.icon;
      this.hideIntensity = map.hideIntensity;
    }
  }
}



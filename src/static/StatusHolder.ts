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
  FIRST_STRIKE,
  INVISIBLE,
  EXHAUSTED
}

type statusProperties = {
  name: string,
  debuff: boolean,
  color: string,
  icon: string,
  hideIntensity: boolean,
}

export const statusMap: Map<StatusType, statusProperties> = new Map([
  [StatusType.FIRE, {name:"Fire", debuff:true, color:"#ff8301", icon:"fire.png", hideIntensity:false}],
  [StatusType.DAMAGE_DOWN, {name:"Damage Down", debuff:true, color:"#ac3232", icon:"damage_down.png", hideIntensity:false}],
  [StatusType.SMALL, {name:"Small", debuff:true, color:"#ac3232", icon:"small.png", hideIntensity:true}],
  [StatusType.ARMOR_PIERCING, {name:"Armor Piercing", debuff:false, color:"#5b6ee1", icon:"armor_pierce.png", hideIntensity:true}],
  [StatusType.FEEL_FINE, {name:"Feel Fine", debuff:false, color:"#f7da47", icon:"feel_fine.png", hideIntensity:true}], 
  [StatusType.GOOD_VIBES_SLEEP, {name:"Good Vibes", debuff:true, color:"#847e87", icon:"sleep.png", hideIntensity:true}], 
  [StatusType.ARMOR_UP, {name:"Armor Up", debuff:false, color:"#5b6ee1", icon:"armor_up.png", hideIntensity:false}],
  [StatusType.HALF_DAMAGE, {name:"Half Damage", debuff:false, color:"#5b6ee1", icon:"half_damage.png", hideIntensity:true}],
  [StatusType.GARLIC, {name:"Garlic", debuff:false, color:"#6abe30", icon:"garlic.png", hideIntensity:true}],
  [StatusType.DEFENDING, {name:"Defending", debuff:false, color:"#00c8ff", icon:"defend.png", hideIntensity:true}],
  [StatusType.FIRST_STRIKE, {name:"First Strike", debuff:false, color:"#5b6ee1", icon:"first_strike.png", hideIntensity:false}],
  [StatusType.INVISIBLE, {name:"Invisible", debuff:false, color:"#847387", icon:"invisible.png", hideIntensity:true}],
  [StatusType.EXHAUSTED, {name:"Exhausted", debuff:true, color:"#f7da47", icon:"exhausted.png", hideIntensity:true}],
])

export function statusIsDebuff(type : StatusType) {
  return statusMap.get(type)?.debuff || false
}


export class StatusHolder {
  statusList: StatusEffect[] = []

  public applyStatus(type: StatusType, duration: number, intensity: number){ 
    const existingStatus = this.statusList.find((s)=> s.type == type)

    if (existingStatus == undefined){
      const newStatus = new StatusEffect(type, duration, intensity)
      this.statusList.push(newStatus)
      return newStatus
    } else {
      existingStatus.duration = Math.max(existingStatus.duration, duration)
      existingStatus.intensity = Math.max(existingStatus.intensity, intensity)
      return existingStatus
    }
  }

  public getStatusIntensity(type: StatusType){
    const status = this.statusList.find((s) => s.type == type)
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

  public removeAll() {
    this.statusList = []
  }
}


export class StatusEffect { 

  type: StatusType;
  duration: number;
  intensity: number;
  
  name: string = "default status name"
  debuff: boolean = false;
  color: string = "red";
  icon: string = "";
  hideIntensity: boolean = false;

  public constructor(type: StatusType, duration: number, intensity: number = 1){
    this.type = type;
    this.duration = duration;
    this.intensity = intensity;
    
    const map = statusMap.get(type);
    if (map != undefined){
      this.name = map.name;
      this.debuff = map.debuff;
      this.color = map.color;
      this.icon = map.icon;
      this.hideIntensity = map.hideIntensity;
    }
  }
}



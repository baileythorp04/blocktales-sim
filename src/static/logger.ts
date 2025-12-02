export type LogEntry = {
  id: number
  msg: string
  new: boolean
  boring: boolean
}

const _logs: LogEntry[][] = [[]]
const _subs = new Set<(logs: LogEntry[][]) => void>()

let _nextId = 1
let _colNo = 0

function notify() {
  const snapshot = _logs.slice()
  _subs.forEach(cb => cb(snapshot))
}

export const logger = {
  log(msg: string, boring: boolean = false): LogEntry {
    const entry: LogEntry = { id: _nextId++, msg: msg, new: true, boring: boring}
    _logs[_colNo].push(entry)
    notify()
    return entry
  },

  nextAction(): void {
    for (let logCol of _logs.slice().reverse()) {
      for (let log of logCol.slice().reverse()) {
        if (log.new){
          log.new = false
        } else {
          return
        }
      }
    }
  },

  nextTurn(): void {
    _logs.push([])
    _colNo++;
    notify()
  },

  get(allowBoring : boolean = true): LogEntry[][] {
    debugger
    if (allowBoring){
      return _logs.slice()
    } else {
      let filtLogs = _logs.slice()
      const range = Array.from({ length: filtLogs.length }, (_, i) => i);
      for (let i of range) {
        filtLogs[i] = filtLogs[i].filter(l => !l.boring)
      }
      filtLogs.forEach(logCol => { logCol = logCol.filter(l => false) })
      return filtLogs
    }
  },

  subscribe(cb: (logs: LogEntry[][]) => void) {
    _subs.add(cb)
    // deliver initial snapshot
    cb(_logs.slice())
    return () => _subs.delete(cb)
  }
}
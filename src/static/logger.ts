export type LogEntry = {
  id: number
  msg: string
  new: boolean
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
  log(msg: string): LogEntry {
    const entry: LogEntry = { id: _nextId++, msg, new: true}
    _logs[_colNo].push(entry)
    notify()
    return entry
  },

  nextAction(): void {
    debugger
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

  get(): LogEntry[][] {
    return _logs.slice()
  },

  subscribe(cb: (logs: LogEntry[][]) => void) {
    _subs.add(cb)
    // deliver initial snapshot
    cb(_logs.slice())
    return () => _subs.delete(cb)
  }
}
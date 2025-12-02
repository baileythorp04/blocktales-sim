export type LogEntry = {
  id: number
  msg: string
}

const _logs: LogEntry[] = []
const _subs = new Set<(logs: LogEntry[]) => void>()
let _nextId = 1

function notify() {
  const snapshot = _logs.slice()
  _subs.forEach(cb => cb(snapshot))
}

export const logger = {
  log(msg: string): LogEntry {
    const entry: LogEntry = { id: _nextId++, msg }
    _logs.push(entry)
    notify()
    return entry
  },

  clear() {
    _logs.length = 0
    _nextId = 1
    notify()
  },

  get(): LogEntry[] {
    return _logs.slice()
  },

  subscribe(cb: (logs: LogEntry[]) => void) {
    _subs.add(cb)
    // deliver initial snapshot
    cb(_logs.slice())
    return () => _subs.delete(cb)
  }
}
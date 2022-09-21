class Queue {
  constructor(items = []) {
    this.items = items
  }
  add(e) {
    this.items.push(e)
  }
  pop() {
    return this.items.shift()
  }
  front() {
    return this.items[0]
  }
  length() {
    return this.items.length
  }
}

export const States = {
  R: "Готов",
  E: "Исполнение",
  W: "Ожидание",
  S: "Завершён"
}

export const Commands = {
  Exec: "И",
  Wait: "О"
}

export class process {
  constructor(name, commands) {
    this.initCommands(commands)
    this.state = this.nextCommand() == Commands.Wait ? States.W : States.R

    this.name = name
    this.history = []
    this.waitTime = 0
  }

  nextCommand() {
    return this.commands.front()
  }

  initCommands(commandsArray) {
    this.commands = new Queue(Array.from(commandsArray))
  }

  exec() {
    let isExecuting
    switch (this.nextCommand()) {
      case Commands.Exec:
        this.state = States.E
        this.commands.pop()
        isExecuting = true
        break
      case Commands.Wait:
        if (this.state == States.E) {
          this.waitTime = 0
        }
        this.state = States.W
        this.commands.pop()
        this.waitTime++
        isExecuting = false
        break
      case undefined:
        this.state = States.S
        this.waitTime = -1
        isExecuting = false
        break
    }
    this.history.push(this.state)
    return isExecuting
  }

  wait() {
    if (this.nextCommand() == undefined) {
      this.state = States.S
      this.waitTime = -1
      this.history.push(this.state)
      return
    }

    switch (this.state) {
      case States.E:
      case States.W:
      case States.R:
        if (this.nextCommand() == Commands.Wait) {
          this.state = States.W
          this.commands.pop()
        } else {
          this.state = States.R
        }
        break
    }
    this.waitTime++
    this.history.push(this.state)
  }
}

class Sheluder {
  constructor(processes = []) {
    this.initProcesses(processes)
    this.currentIdx = null
  }

  reset(props) {
    Object.entries(props).forEach(([name, value]) => {
      this[name] = value
    })
  }

  initProcesses(procs) {
    this.processes = procs.map((p) => new process(p.name, p.queue))
  }

  chooseNextExec() {
    return false
  }

  processFunction(proc, idx, needSelectAnother) {
    if (this.currentIdx != idx) {
      proc.wait()
      return
    }

    proc.exec()
    proc.waitTime = 0
    if (
      proc.state == States.W ||
      proc.state == States.S ||
      proc.nextCommand() == Commands.Wait ||
      proc.nextCommand() == undefined
    ) {
      needSelectAnother.ok = true
    }
  }

  nextTick() {
    if (this.currentIdx == null && this.chooseNextExec()) {
      this.processes[this.currentIdx].waitTime = 0
    }

    if (this.processes.every((p) => p.state == States.S)) {
      return false
    }

    let needSelectAnother = { ok: false }
    this.processes.forEach((p, i) =>
      this.processFunction(p, i, needSelectAnother)
    )
    if (needSelectAnother.ok) this.currentIdx = null
    return true
  }
}
export class FCFS extends Sheluder {
  constructor(processes = []) {
    super(processes)
  }

  chooseNextExec() {
    this.currentIdx = this.processes.reduce((min, cur, idx, arr) => {
      if (min == null) {
        return idx
      }

      if (arr[min].waitTime >= cur.waitTime) {
        // || cur.nextCommand() == undefined) {
        return min
      } else {
        return idx
      }
    }, null)
  }
}

export class RR extends Sheluder {
  constructor(timeoutLimit, processes = []) {
    super(processes)
    this.timeoutLimit = timeoutLimit
    this.timeout = 0
  }

  chooseNextExec() {
    this.currentIdx = this.processes.reduce((min, cur, idx, arr) => {
      if (min == null) {
        return idx
      }

      if (arr[min].waitTime >= cur.waitTime || cur.nextCommand() == undefined) {
        return min
      } else {
        if (this.timeout >= this.timeoutLimit) {
          this.timeout = 0
          return min
        }
        return idx
      }
    }, null)
  }

  processFunction(proc, idx, needSelectAnother) {
    if (this.currentIdx != idx) {
      proc.wait()
      return
    }

    proc.exec()
    this.timeout++
    if (
      proc.state == States.W ||
      proc.state == States.S ||
      proc.nextCommand() == Commands.Wait ||
      proc.nextCommand() == undefined ||
      this.timeout >= this.timeoutLimit
    ) {
      this.timeout = 0
      needSelectAnother.ok = true
    }
  }
}

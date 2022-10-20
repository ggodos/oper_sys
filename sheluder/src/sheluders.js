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
        this.state = States.W
        this.commands.pop()
        isExecuting = false
        break
      case undefined:
        this.state = States.S
        isExecuting = false
        break
    }
    this.history.push(this.state)
    return isExecuting
  }

  wait() {
    if (this.nextCommand() == undefined) {
      this.state = States.S
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
    this.history.push(this.state)
  }
}

class Sheduler {
  constructor(processes = []) {
    this.initProcesses(processes)
    this.currentIdx = 0
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
    if (this.currentIdx >= this.processes.length) {
      this.currentIdx = 0
    }

    if (this.processes.every((p) => p.state == States.S)) {
      return false
    }

    let needSelectAnother = { ok: false }
    this.processes.forEach((p, i) =>
      this.processFunction(p, i, needSelectAnother)
    )
    if (needSelectAnother.ok) this.currentIdx++
    return true
  }
}
export class FCFS extends Sheduler {
  constructor(processes = []) {
    super(processes)
  }
}

export class RR extends Sheduler {
  constructor(timeoutLimit, processes = []) {
    super(processes)
    this.timeoutLimit = timeoutLimit
    this.timeout = 0
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

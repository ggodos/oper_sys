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
    this.name = name
    this.state = States.R
    this.waitTime = 0
    this.commands = new Queue(Array.from(commands))
    this.history = []
  }

  next() {
    const cmd = this.commands.front()
    switch (cmd) {
      case Commands.Exec:
        this.state = States.E
        this.commands.pop()
        break
      case Commands.Wait:
        this.state = States.W
        this.commands.pop()
        this.waitTime++
        break
      case undefined:
        this.state = States.S
        break
    }
    this.history.push(this.state)
  }

  wait() {
    if (this.commands.front() == undefined) {
      this.state = States.S
      this.history.push(this.state)
      return
    }

    switch (this.state) {
      case States.E:
      case States.W:
        if (this.commands.front() == Commands.Wait) {
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

export class FCFS {
  constructor(processes = []) {
    this.processes = processes
    this.currentIdx = null
  }

  initProcesses(procs) {
    this.processes = procs.map((p) => new process(p.name, p.queue))
  }

  nextTick() {
    if (this.currentIdx == null) {
      this.currentIdx = this.processes.reduce((min, cur, idx, arr) => {
        if (min == null) {
          return idx
        }

        if (
          arr[min].waitTime >= cur.waitTime ||
          cur.commands.front() == undefined
        ) {
          return min
        } else {
          return idx
        }
      }, null)
      this.processes[this.currentIdx].waitTime = 0

      if (this.processes.every((p) => p.state == States.S)) {
        return false
      }
    }

    let needReset = false
    this.processes.forEach((p, i) => {
      if (this.currentIdx == i) {
        p.next()
        if (
          p.state == States.W ||
          p.state == States.S ||
          p.commands.front() == Commands.Wait ||
          p.commands.front() == undefined
        ) {
          needReset = true
        }
      } else {
        p.wait()
      }
    })
    if (needReset) this.currentIdx = null
    return true
  }
}

export class RR {
  constructor(timeoutLimit, processes = []) {
    this.processes = processes
    this.currentIdx = null
    this.timeoutLimit = timeoutLimit
    this.timeout = 0
  }

  initProcesses(procs) {
    this.processes = procs.map((p) => new process(p.name, p.queue))
  }

  nextTick() {
    if (this.currentIdx == null) {
      this.currentIdx = this.processes.reduce((min, cur, idx, arr) => {
        if (min == null) {
          return idx
        }

        if (
          arr[min].waitTime >= cur.waitTime ||
          cur.commands.front() == undefined
        ) {
          return min
        } else {
          if (this.timeout >= this.timeoutLimit) {
            this.timeout = 0
            return min
          }
          return idx
        }
      }, null)
      this.processes[this.currentIdx].waitTime = 0

      if (this.processes.every((p) => p.state == States.S)) {
        return false
      }
    }

    let needReset = false
    this.processes.forEach((p, i) => {
      if (this.currentIdx == i) {
        p.next()
        this.timeout++
        if (
          p.state == States.W ||
          p.state == States.S ||
          p.commands.front() == Commands.Wait ||
          p.commands.front() == undefined ||
          this.timeout >= this.timeoutLimit
        ) {
          this.timeout = 0
          needReset = true
        }
      } else {
        p.wait()
      }
    })
    if (needReset) this.currentIdx = null
    return true
  }
}

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

const States = {
  R: "Готов",
  E: "Исполнение",
  W: "Ожидание",
  S: "Завершён"
}

const Commands = {
  Exec: "И",
  Wait: "О"
}

export class process {
  constructor(commands) {
    this.state = States.R
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
        break
      case undefined:
        this.state = States.S
        break
    }
    this.history.push(this.state)
  }

  wait() {
    if (this.state == States.W) {
      const cmd = this.commands.pop()
      switch (cmd) {
        case Commands.Exec:
          this.state = States.R
          break
        case Commands.Wait:
          this.state = States.W
          break
      }
    }
    this.history.push(this.state)
  }
}

export class FCFS {
  constructor(processes = []) {
    this.processes = processes
    this.currentIdx = null
  }

  initProcesses(procs) {
    this.processes = procs.map((p) => new process(p.queue))
    this.processes.forEach((p) => {
      console.log(p.state)
    })
  }

  nextTick() {
    if (this.currentIdx == null) {
      this.processes.some((p, i) => {
        if (p.state == States.R) {
          this.currentIdx = i
          return true
        }
        return false
      })

      if (this.processes.every((p) => p.state == States.S)) {
        return false
      }
    }

    this.processes.forEach((p, i) => {
      if (this.currentIdx == i) {
        p.next()
        if (p.state == States.W || p.state == States.S) {
          this.currentIdx = null
          console.log(`Restart ${i}`)
        }
      } else {
        p.wait()
      }
    })
    return true
  }
}

export const testFCFS = () => {
  let processes = [
    new process("ИИИОООИИИИИ"),
    new process("ИИИИИООИИ"),
    new process("ИИОООИИ")
  ]

  const fcfs = new FCFS(processes)
}

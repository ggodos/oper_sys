import { FCFS, RR } from "./sheluders.js"

function zip(rows) {
  return rows[0].map((_, c) => rows.map((row) => row[c]))
}

const processes = [
  { name: 1, queue: "ИИИОООИИИИИ" },
  { name: 2, queue: "ИИИИИООИИ" },
  { name: 3, queue: "ИИОООИИ" }
]

let sheluder = new FCFS(processes)
sheluder = new RR(2, processes)

let history = []
let run = true
let asd = 0
while (run) {
  run = sheluder.nextTick()
  asd++
  if (asd > 24) {
    run = false
  }
}
history = zip(sheluder.processes.map((p) => p.history))
console.log(history)

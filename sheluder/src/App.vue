<template>
  <div class="header">
    <div>
      <h1 class="green">Планировщик</h1>
      <button
        v-for="algo in Object.values($options.Algos)"
        :key="algo"
        @click="chooseAlgo(algo)"
        :disabled="choosedAlgorithm == algo"
      >
        Выбрать {{ algo }}
      </button>
    </div>
    <div class="green">Системное время: {{ currentDateTime }}</div>
    <div v-if="choosedAlgorithm == 'RR'">
      <input type="number" v-model="rrCounter" />
    </div>
    <div>
      <label for="commands">Добавить процесс:</label><br />
      <input v-model="commands" id="commands" type="text" />
      Пример: ИИООИИИ
    </div>
    <button @click="addProcess">Добавить процесс</button>
    <button @click="resetTable">Сбросить историю</button>
  </div>
  <br />
  <button @click="runDemo">Запустить тест</button>
  <br />
  <br />

  <table class="body">
    <thead>
      <tr>
        <th v-for="p in processes">
          {{ p.name }}
          <button @click="removeProc(p.name)">X</button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in history">
        <td
          id="stateCell"
          v-for="s in row"
          :style="{
            backgroundColor: $options.StatesColors[s]
          }"
        >
          {{ s }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { FCFS as FCFSSheluder, RR as RRSheluder } from "./sheluders.js"

export default {
  name: "App",

  data() {
    return {
      currentDateTime: null,
      choosedAlgorithm: "FCFS",
      sheluder: new FCFSSheluder(),
      processes: [...this.$options.processes],
      history: [],
      rrCounter: 2,
      commands: ""
    }
  },

  Algos: { FCFS: "FCFS", RR: "RR" },
  StatesColors: {
    Готов: "#4A4458",
    Исполнение: "#4F378B",
    Ожидание: "#633B48",
    Завершён: "#332D41"
  },

  processes: [
    { name: 1, queue: "ИИИОООИИИИИ" },
    { name: 2, queue: "ИИИИИООИИ" },
    { name: 3, queue: "ИИОООИИ" }
  ],

  mounted() {
    this.sheluder.initProcesses(this.processes)
    setInterval(() => {
      this.currentDateTime = this.getCurrentTime()
    }, 1000)
  },

  methods: {
    removeProc(name) {
      this.processes = this.processes.filter((p) => p.name != name)
      this.sheluder.initProcesses(this.processes)
      this.resetTable()
    },

    resetTable() {
      this.history = []
    },

    chooseAlgo(algo) {
      this.choosedAlgorithm = algo
      switch (algo) {
        case "FCFS":
          this.sheluder = new FCFSSheluder()
          this.sheluder.initProcesses(this.processes)
          break

        case "RR":
          this.sheluder = new RRSheluder(parseInt(this.rrCounter))
          this.sheluder.initProcesses(this.processes)
          break
      }
    },

    zip(rows) {
      return rows[0].map((_, c) => rows.map((row) => row[c]))
    },

    runDemo() {
      this.history = []
      let run = true
      // let asd = 0
      while (run) {
        run = this.sheluder.nextTick()
        // asd++
        // if (asd > 60) {
        //   run = false
        // }
      }
      this.history = this.zip(this.sheluder.processes.map((p) => p.history))
    },

    addProcess() {
      const procName = this.processes[this.processes.length - 1].name + 1
      const newProc = {
        name: procName,
        queue: this.commands
      }
      this.processes.push(newProc)
      this.sheluder.initProcesses(this.processes)
    },

    getCurrentTime() {
      const pad = (num) => (num > 9 ? num : `0${num}`)
      const date = new Date()
      const hours = pad(date.getHours())
      const minutes = pad(date.getMinutes())
      const seconds = pad(date.getSeconds())
      return `${hours}:${minutes}:${seconds}`
    }
  },

  watch: {
    rrCounter(newCounter) {
      this.sheluder.reset({ timeoutLimit: newCounter })
      this.sheluder.initProcesses(this.processes)
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
table {
  width: 100%;
}

tr:hover {
  background-color: coral;
}

th {
  background-color: #04aa6d;
  color: white;
}

table,
th,
td {
  border: 1px solid;
}
#stateCell {
  color: #cccccc;
  border-color: black;
}
</style>

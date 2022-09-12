<template>
  <div class="header">
    <div>
      <h1 class="green">Планировщик</h1>
      <button
        v-for="algo in ['FCFS', 'RR']"
        :key="algo"
        @click="chooseAlgo(algo)"
        :disabled="choosedAlgorithm == algo"
      >
        Выбрать {{ algo }}
      </button>
    </div>
    <div class="green">Системное время: {{ currentDateTime }}</div>
    <div>Параметры процесса:</div>
    <div>
      <label for="commands">Добавить процесс:</label><br />
      <input v-model="commands" id="commands" type="text" />
      Пример: ИИООИИИ
    </div>
    <button @click="addProcess">Добавить процесс</button>
  </div>
  <br />
  <button @click="runDemo">Запустить тест</button>
  <br />
  <br />

  <table>
    <thead>
      <tr>
        <th v-for="p in processes">{{ p.name }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in history">
        <td v-for="s in row">{{ s }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { FCFS } from "./sheluders"

export default {
  name: "App",

  data() {
    return {
      currentDateTime: null,
      choosedAlgorithm: "FCFS",
      sheluder: new FCFS(),
      processes: [...this.$options.processes],
      history: [],
      commands: ""
    }
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
    zip(rows) {
      return rows[0].map((_, c) => rows.map((row) => row[c]))
    },

    runDemo() {
      let run = true
      let asd = 0
      while (run) {
        run = this.sheluder.nextTick()
        asd++
        if (asd > 25) {
          run = false
        }
      }
      this.history = this.zip(this.sheluder.processes.map((p) => p.history))
      console.log(this.sheluder.processes)
    },

    addProcess() {
      const newProc = {
        name: this.processes.length + 1,
        queue: this.commands
      }
      this.processes.push(newProc)
    },

    getCurrentTime() {
      const pad = (num) => (num > 9 ? num : `0${num}`)
      const date = new Date()
      const hours = pad(date.getHours())
      const minutes = pad(date.getMinutes())
      const seconds = pad(date.getSeconds())
      return `${hours}:${minutes}:${seconds}`
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
</style>

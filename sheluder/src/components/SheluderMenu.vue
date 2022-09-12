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
      <label for="pname">Название:</label><br />
      <input v-model="pname" id="pname" type="text" />
    </div>
    <div>
      <label for="commands">Команды:</label><br />
      <input v-model="commands" id="commands" type="text" />
    </div>
    <button @click="addProcess">Добавить процесс</button>
  </div>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      choosedAlgorithm: "FCFS",
      currentDateTime: null,
      pname: "",
      commands: []
    }
  },
  mounted() {
    setInterval(() => {
      this.currentDateTime = this.getCurrentTime()
    }, 1000)
  },

  methods: {
    chooseAlgo(algoName) {
      this.choosedAlgorithm = algoName
    },

    addProcess() {
      const addProc = {
        status: "Ready"
      }
      this.$emit("add-proc", addProc)
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
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.header h1,
.header h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .header h1,
  .header h3 {
    text-align: left;
  }
}
</style>

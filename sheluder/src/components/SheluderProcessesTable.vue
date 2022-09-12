<template>
  <table>
    <tr>
      <th>Name</th>
      <th v-for="(step, idx) in steps" :key="step">{{ idx + 1 }}</th>
    </tr>
    <SheluderProcess v-for="p in processes" :key="p.id" :process="p" />
  </table>
</template>

<script>
import SheluderProcess from "./SheluderProcess.vue"

export default {
  components: {
    SheluderProcess
  },

  props: {
    processes: {
      type: Array
    },
    steps: {
      type: Number,
      required: true
    }
  }
}
</script>

<style></style>

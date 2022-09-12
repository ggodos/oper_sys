<template>
  <tr>
    <td>{{ process.name }}</td>
    <td>{{ process.commands }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    process: {
      type: Object,
      required: true
    }
  }
}
</script>

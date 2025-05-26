<template>
  <BaseAlert
    type="danger"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import BaseAlert from './BaseAlert.vue'

export default {
  name: 'DangerAlert',
  extends: BaseAlert,
  props: {
    title: {
      type: String,
      required: true,
      default: 'This is a danger alert'
    },
    message: {
      type: String,
      required: true,
      default: 'More info about this danger alert goes here.'
    }
  }
}
</script> 
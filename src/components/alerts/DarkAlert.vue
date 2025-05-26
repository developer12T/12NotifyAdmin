<template>
  <BaseAlert
    type="dark"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import BaseAlert from './BaseAlert.vue'

export default {
  name: 'DarkAlert',
  extends: BaseAlert,
  props: {
    title: {
      type: String,
      required: true,
      default: 'This is a dark alert'
    },
    message: {
      type: String,
      required: true,
      default: 'More info about this dark alert goes here.'
    }
  }
}
</script> 
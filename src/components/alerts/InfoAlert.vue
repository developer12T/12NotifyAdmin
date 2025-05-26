<template>
  <BaseAlert
    type="info"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import BaseAlert from './BaseAlert.vue'

export default {
  name: 'InfoAlert',
  extends: BaseAlert,
  props: {
    title: {
      type: String,
      required: true,
      default: 'This is an info alert'
    },
    message: {
      type: String,
      required: true,
      default: 'More info about this info alert goes here.'
    }
  }
}
</script> 
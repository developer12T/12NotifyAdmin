<template>
  <BaseAlert
    type="warning"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import BaseAlert from './BaseAlert.vue'

export default {
  name: 'WarningAlert',
  extends: BaseAlert,
  props: {
    title: {
      type: String,
      required: true,
      default: 'This is a warning alert'
    },
    message: {
      type: String,
      required: true,
      default: 'More info about this warning alert goes here.'
    }
  }
}
</script> 
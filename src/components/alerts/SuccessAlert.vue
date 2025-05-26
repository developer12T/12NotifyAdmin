<template>
  <BaseAlert
    type="success"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import BaseAlert from './BaseAlert.vue'

export default {
  name: 'SuccessAlert',
  extends: BaseAlert,
  props: {
    title: {
      type: String,
      required: true,
      default: 'This is a success alert'
    },
    message: {
      type: String,
      required: true,
      default: 'More info about this success alert goes here.'
    }
  }
}
</script> 
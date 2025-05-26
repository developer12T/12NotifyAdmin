<template>
  <div v-if="show" class="fixed inset-0 flex items-start justify-center p-4 z-50">
    <!-- Overlay background -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
    ></div>
    
    <!-- Alert container -->
    <div
      :class="[
        'p-4 rounded-lg border min-w-80 max-w-md',
        typeClasses[type].container,
        'transition-all duration-300 ease-in-out transform',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full',
        'relative z-10 mt-16'
      ]"
      role="alert"
    >
      <div class="flex items-center">
        <svg
          class="shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span class="sr-only">Info</span>
        <h3 :class="['text-lg font-medium', typeClasses[type].title]">
          {{ title }}
        </h3>
      </div>
      <div class="mt-2 mb-4 text-sm" :class="typeClasses[type].message">
        {{ message }}
      </div>
      <div class="flex">
        <button
          v-if="showViewMore"
          type="button"
          :class="[
            'text-white font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center',
            typeClasses[type].viewMoreButton
          ]"
          @click="$emit('view-more')"
        >
          <svg
            class="me-2 h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 14"
          >
            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
          </svg>
          View more
        </button>
        <button
          v-if="showDismiss"
          type="button"
          :class="[
            'bg-transparent border font-medium rounded-lg text-xs px-3 py-1.5 text-center',
            typeClasses[type].dismissButton
          ]"
          @click="$emit('dismiss')"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseAlert',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['info', 'danger', 'success', 'warning', 'dark'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    },
    showViewMore: {
      type: Boolean,
      default: false
    },
    showDismiss: {
      type: Boolean,
      default: true
    }
  },
  emits: ['view-more', 'dismiss'],
  data() {
    return {
      typeClasses: {
        info: {
          container: 'text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800',
          title: 'text-blue-800 dark:text-blue-400',
          message: 'text-blue-800 dark:text-blue-400',
          viewMoreButton: 'bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
          dismissButton: 'text-blue-800 border-blue-800 hover:bg-blue-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 dark:hover:bg-blue-600 dark:border-blue-600 dark:text-blue-400 dark:hover:text-white dark:focus:ring-blue-800'
        },
        danger: {
          container: 'text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800',
          title: 'text-red-800 dark:text-red-400',
          message: 'text-red-800 dark:text-red-400',
          viewMoreButton: 'bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800',
          dismissButton: 'text-red-800 border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800'
        },
        success: {
          container: 'text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800',
          title: 'text-green-800 dark:text-green-400',
          message: 'text-green-800 dark:text-green-400',
          viewMoreButton: 'bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
          dismissButton: 'text-green-800 border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 dark:hover:bg-green-600 dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:focus:ring-green-800'
        },
        warning: {
          container: 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800',
          title: 'text-yellow-800 dark:text-yellow-300',
          message: 'text-yellow-800 dark:text-yellow-300',
          viewMoreButton: 'bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-300 dark:text-gray-800 dark:hover:bg-yellow-400 dark:focus:ring-yellow-800',
          dismissButton: 'text-yellow-800 border-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:hover:bg-yellow-300 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-gray-800 dark:focus:ring-yellow-800'
        },
        dark: {
          container: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800',
          title: 'text-gray-800 dark:text-gray-300',
          message: 'text-gray-800 dark:text-gray-300',
          viewMoreButton: 'bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800',
          dismissButton: 'text-gray-800 border-gray-700 hover:bg-gray-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-800 dark:text-gray-300 dark:hover:text-white'
        }
      }
    }
  }
}
</script>
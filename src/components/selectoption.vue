<template>
<!--  <select id="underline_select" v-model="searchInput" @change="handleSearch"-->
  <select id="underline_select"
          v-model="searchInput"
          @change="handleSearch"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
    dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <option selected value="">เลือกหน่วยโดส</option>
    <option value="200">200</option>
    <option value="300">300</option>
    <option value="500">500</option>
    <option value="600">600</option>
    <option value="1000">1000</option>
    <option value="20">20</option>
  </select>
</template>

<script>
export default {
  props: {
    searchBar: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchInput: this.searchBar,
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchInput);
    },
  },
};
</script>

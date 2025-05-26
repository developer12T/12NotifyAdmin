<script setup>   
import { useAuthStore } from './stores'
const authStore = useAuthStore()
import SideBar from "@/components/sideBar.vue";
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
    <div :class="authStore.user">
        <SideBar v-if="route.path !== '/'"/>
        <routerView />
    </div>
</template>

<style>

</style>
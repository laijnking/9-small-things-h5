<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup>
// App.vue - 主应用组件
</script>

<style>
#app {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--background);
}

html {
  overflow-x: hidden;
  width: 100%;
  min-height: 100%;
  min-height: 100dvh;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 允许页面滚动 */
.page-container {
  min-height: 100vh;
  min-height: 100dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 80px;
}

* {
  -webkit-tap-highlight-color: transparent;
}

* {
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
}

input, textarea {
  user-select: text;
  -webkit-user-select: text;
}
</style>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup>
// App.vue - 主应用组件
// 页面切换动画已在模板中配置
</script>

<style>
/* 全局样式已在 src/assets/styles.css 中定义 */
/* 此处仅保留必要的全局覆盖样式 */

/* 确保所有页面都使用统一的最小高度 */
#app {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--background);
}

/* 优化移动端滚动体验 */
html {
  overflow-x: hidden;
  width: 100%;
}

/* 防止 iOS 橡皮筋效果 */
body {
  position: fixed;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

/* 允许内容区域滚动 */
#app {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 优化点击高亮 */
* {
  -webkit-tap-highlight-color: transparent;
}

/* 防止长按选中 */
* {
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
}

/* 输入框允许选择文本 */
input, textarea {
  user-select: text;
  -webkit-user-select: text;
}
</style>

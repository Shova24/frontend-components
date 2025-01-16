<template>
  <div class="main-page">
    <NuxtLink to="/banner-diagonal-transition"
      >Banner Diagonal Transition</NuxtLink
    >
    <NuxtLink to="/parallax-scaling-with-lenis"
      >Parallax-scaling-with-lenis</NuxtLink
    >
  </div>
</template>

<script setup></script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-page{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f1f1f1;
  gap: 1rem;
}
</style>

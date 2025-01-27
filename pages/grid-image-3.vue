<template>
  <div class="grid-page-container">
    <button type="button" class="btn btn-primary" @click="nextImage">
      Next Image
    </button>

    <div class="image-container">
      <div class="base-image">
        <div
          v-for="(block, index) in 2"
          :key="index"
          class="base"
          :class="`base-${index}`"
          :style="{
            left: `${(index % 2) * 50}%`,
            top: `${Math.floor(index / 2) * 50}%`,
            width: '50%',
            height: '100%',
  

          }"
        >
          <img
            :src="currentImage"
            alt="Current image"
            :style="{
              left: `${-(index % 2) * 100}%`,
              top: `${-Math.floor(index / 2) * 100}%`,
              width: '200%',
              height: '200%',
            }"
          />
        </div>
      </div>

      <!-- Next image in quadrants -->
      <div class="blocks-container">
        <div
          v-for="(block, index) in 2"
          :key="index"
          class="block"
          :class="`block-${index}`"
          :style="{
            left: `${(index % 2) * 50}%`,
            top: `${Math.floor(index / 2) * 50}%`,
            width: '50%',
            height: '100%',
      
          }"
        >
          <img
            :src="isTransitioning ? nextImageSrc : currentImage"
            alt="Next image"
            :style="{
              left: `${-(index % 2) * 100}%`,
              top: `${-Math.floor(index / 2) * 100}%`,
              width: '200%',
              height: '200%',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import gsap from "gsap";

const images = [
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg",
  "https://img.freepik.com/free-photo/cool-bicycle-indoors_23-2150884314.jpg",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363267.jpg",
  "https://img.freepik.com/premium-photo/vector-art-celestial-kitty-dreamy-feline-portrait-amidst_1041239-27980.jpg",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg",
];

const currentIndex = ref(0);
const nextIndex = ref(1);
const currentImage = ref(images[0]);
const nextImageSrc = ref(images[1]);

const nextImage = async () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
  nextIndex.value = (currentIndex.value + 1) % images.length;
  currentImage.value = images[currentIndex.value];
  nextImageSrc.value = images[nextIndex.value];
};
</script>

<style lang="scss" scoped>
.grid-page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: black;
}

.image-container {
  position: relative;
  width: 600px;
  height: 400px;
  overflow: hidden;
}

.base-image,
.blocks-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.base,
.block {
  position: absolute;
  overflow: hidden;

  img {
    position: absolute;
    object-fit: cover;
  }
}

// Set transform origins for each quadrant
.base-0 {
  transform-origin: top left;
  border: 1px SOLID RED;
}
.base-1 {
  transform-origin: top left;
  border: 1px SOLID rgb(94, 255, 0);
}

.block-1 {
  transform-origin: top right;
  border: 1px SOLID RED;
}
.block-2 {
  transform-origin: bottom left;
  border: 1px SOLID RED;
}

.btn {
  margin: 20px;
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
  font-size: 16px;

  &:hover {
    background: #f0f0f0;
  }
}
</style>

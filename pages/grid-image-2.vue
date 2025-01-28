<template>
  <div class="grid-page-container">
    <button type="button" class="btn btn-primary" @click="nextImage">
      Next Image
    </button>

    <div class="image-container">
      <!-- Base (current) image in quadrants -->
      <div class="base-image">
        <div
          v-for="(block, index) in 4"
          :key="index"
          class="base"
          :class="`base-${index}`"
          :style="{
            left: `${(index % 2) * 50}%`,
            top: `${0}%`,
            width: '50%',
            height: '100%',
          }"
        >
          <img 
            :src="currentImage" 
            alt="Current image" 
            :style="{
              left: `${-(index % 2) * 100}%`,
              top: `${0}%`,
              width: '200%',
              height: '200%'
            }"
          />
        </div>
      </div>
      
      <!-- Next image in quadrants -->
      <div class="blocks-container">
        <div
          v-for="(block, index) in 4"
          :key="index"
          class="block"
          :class="`block-${index}`"
          :style="{
            left: `${(index % 2) * 50}%`,
            top: `${0}%`,
            width: '50%',
            height: '100%',
            visibility: shouldShowBlock(index) ? 'visible' : 'hidden'
          }"
        >
          <img 
            :src="isTransitioning ? nextImageSrc : currentImage" 
            alt="Next image" 
            :style="{
              left: `${-(index % 2) * 100}%`,
              top: `${0}%`,
              width: '200%',
              height: '200%'
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
const currentImage = ref(images[0]);
const nextImageSrc = ref('');
const isTransitioning = ref(false);

// Helper functions to determine which quadrants should be visible
const shouldShowBlock = (index) => {
  // Show top-right (1) and bottom-left (2) for next image
  return index === 1 || index === 2;
};

const shouldHideBase = (index) => {
  // Hide top-right (1) and bottom-left (2) of current image
  return index === 1 || index === 2;
};

const nextImage = async () => {
  if (isTransitioning.value) return;
  
  isTransitioning.value = true;
  const nextIndex = (currentIndex.value + 1) % images.length;
  nextImageSrc.value = images[nextIndex];

  // Wait for next image to load
  await new Promise(resolve => {
    const img = new Image();
    img.onload = resolve;
    img.src = nextImageSrc.value;
  });

  const tl = gsap.timeline();
  const blocks = document.querySelectorAll('.block');
  const bases = document.querySelectorAll('.base');

  // Set initial states
  gsap.set([blocks[1], blocks[2]], {
    scaleY: 0,
  });

  // Animate out current image quadrants (top-left and bottom-right)
  tl.to([bases[0], bases[3]], {
    scaleY: 0,
    duration: 0.7,
    ease: "power2.inOut",
  })
  // Animate in next image quadrants (top-right and bottom-left)
  .to([blocks[1], blocks[2]], {
    scaleY: 1,
    duration: 0.7,
    ease: "power2.inOut",
  }, "<") // Start at the same time
  .then(() => {
    // Update current image
    currentIndex.value = nextIndex;
    currentImage.value = nextImageSrc.value;
    isTransitioning.value = false;
  });
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

.base-image, .blocks-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.base, .block {
  position: absolute;
  overflow: hidden;

  img {
    position: absolute;
    object-fit: cover;
  }
}

// Set transform origins for each quadrant
.base-0 { transform-origin: top left; }
.base-3 { transform-origin: bottom right; }
.block-1 { transform-origin: top right; }
.block-2 { transform-origin: bottom left; }

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
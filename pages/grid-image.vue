<template>
    <div class="grid-page-container">
      <button type="button" class="btn btn-primary" @click="nextImage">
        Next Image
      </button>
  
      <div class="image-container">
        <!-- Base (current) image -->
        <img :src="currentImage" alt="Current image" class="base-image" />
        
        <!-- Overlay blocks container -->
        <div class="blocks-container" v-if="isTransitioning">
          <div
            v-for="(block, index) in 4"
            :key="index"
            class="block"
            :style="{
              left: `${index * 25}%`,
              width: '25%',
            }"
          >
            <img 
              :src="nextImageSrc" 
              alt="Next image" 
              :style="{
                left: `${-index * 100}%`,
                width: '400%'
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
  
    // Get all blocks
    const blocks = document.querySelectorAll('.block');
    
    // Reset initial state
    gsap.set(blocks, {
      scaleY: 0,
    });
  
    // Animate blocks
    await gsap.to(blocks, {
      scaleY: 1,
      duration: 0.7,
      stagger: {
        amount: 0.3,
        from: "left",
      },
      ease: "power2.inOut",
    });
  
    // Update current image
    currentIndex.value = nextIndex;
    currentImage.value = nextImageSrc.value;
    isTransitioning.value = false;
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
  
  .base-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .blocks-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .block {
    position: absolute;
    height: 100%;
    overflow: hidden;
    transform-origin: top;
    transform: scaleY(0);
  
    img {
      position: absolute;
      top: 0;
      height: 100%;
      object-fit: cover;
    }
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
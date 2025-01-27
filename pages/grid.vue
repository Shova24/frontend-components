<template>
    <div class="grid-page-container">
      <button type="button" class="btn btn-primary" @click="nextImage">
        Next Image
      </button>
  
      <Transition
        name="image-fade"
        mode="out-in"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div class="image-container" v-if="currentImage" :key="currentImage">
          <div class="overly-image">
            <div class="transition-row row-1">
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
            </div>
            <!-- <div class="transition-row row-2">
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
            </div> -->
          </div>
          <img :src="currentImage" alt="image" />
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
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
  
  const nextImage = () => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
    currentImage.value = images[currentIndex.value];
  };
  
  const onEnter = (el, done) => {
    const blocks = el.querySelectorAll('.block');
    
    // Reset blocks
    gsap.set(blocks, {
      visibility: 'visible',
      scaleX: 1
    });
  
    // Animate blocks
    gsap.to(blocks, {
      scaleX: 0,
      duration: 0.8,
      stagger: {
        amount: 0.5,
        from: "start",
        grid: "auto",
        axis: "y"
      },
      ease: "power2.inOut",
      onComplete: done
    });
  };
  
  const onLeave = (el, done) => {
    const blocks = el.querySelectorAll('.block');
    
    // Reset blocks
    gsap.set(blocks, {
      visibility: 'visible',
      scaleX: 0
    });
  
    // Animate blocks
    gsap.to(blocks, {
      scaleX: 1,
      duration: 0.8,
      stagger: {
        amount: 0.5,
        from: "start",
        grid: "auto",
        axis: "y"
      },
      ease: "power2.inOut",
      onComplete: done
    });
  };
//   const onEnter = (el, done) => {
//     const blocks = el.querySelectorAll('.block');
    
//     // Reset blocks
//     gsap.set(blocks, {
//       visibility: 'visible',
//       scaleX: 1
//     });
  
//     // Animate blocks
//     gsap.to(blocks, {
//       scaleX: 0,
//       duration: 0.8,
//       stagger: {
//         amount: 0.5,
//         from: "start",
//         grid: "auto",
//         axis: "y"
//       },
//       ease: "power2.inOut",
//       onComplete: done
//     });
//   };
  
//   const onLeave = (el, done) => {
//     const blocks = el.querySelectorAll('.block');
    
//     // Reset blocks
//     gsap.set(blocks, {
//       visibility: 'visible',
//       scaleX: 0
//     });
  
//     // Animate blocks
//     gsap.to(blocks, {
//       scaleX: 1,
//       duration: 0.8,
//       stagger: {
//         amount: 0.5,
//         from: "start",
//         grid: "auto",
//         axis: "y"
//       },
//       ease: "power2.inOut",
//       onComplete: done
//     });
//   };
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
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .overly-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 2;
    pointer-events: none;
  }
  
  .transition-row {
    flex: 1;
    display: flex;
  }
  
  .block {
    flex: 1;
    background: white;
    visibility: hidden;
    transform-origin: top;
  }
  
  .row-2 .block {
    transform-origin: bottom;
  }
  
  .btn {
    margin: 20px;
    padding: 10px 20px;
    background: white;
    border: none;
    cursor: pointer;
    z-index: 10;
  }
  </style>
<template>
  <div class="grid-page-container">
    <div class="slides-container">
      <div class="slider slider-container left">
        <div class="slider-images" ref="sliderImages">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="slider-image"
          >
            <img :src="image" alt="Slide Image" />
          </div>
        </div>
      </div>

      <div class="slider slider-container right">
        <div class="slider-images" ref="sliderImagesRight">
          <div
            v-for="(image, index) in revImages"
            :key="index"
            class="slider-image"
          >
            <img :src="image" alt="Slide Image" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const images = ref([
"https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg",
    "https://img.freepik.com/free-photo/cool-bicycle-indoors_23-2150884314.jpg",
    "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363267.jpg",
    // "https://img.freepik.com/premium-photo/vector-art-celestial-kitty-dreamy-feline-portrait-amidst_1041239-27980.jpg",
    // "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg",
]);
const revImages = ref([

    "https://img.freepik.com/free-photo/cool-bicycle-indoors_23-2150884314.jpg",
    "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363267.jpg",
    "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg",
]);
// const revImages = ref([...images.value].reverse());

const currentIndex = ref(0);
const sliderImages = ref(null);
const sliderImagesRight = ref(null);

const nextImage = () => {
  gsap.to(sliderImages.value, {
    y: "-=100vh", // Move the images up
    duration: 1,
    ease: "expo.inOut",
    onComplete: () => {
      // Move first image to the end
      images.value.push(images.value.shift());
      gsap.set(sliderImages.value, { y: "0vh" }); // Reset position instantly
    },
  });

  gsap.to(sliderImagesRight.value, {
    y: "+=100vh", // Move the images up
    duration: 1,
    ease: "expo.inOut",
    onComplete: () => {
      // Move first image to the end
      revImages.value.push(revImages.value.shift());
      gsap.set(sliderImagesRight.value, { y: "0vh" }); // Reset position instantly
    },
  });
};




onMounted(() => {
  gsap.set(sliderImages.value, { y: "0vh" });
  gsap.set(sliderImagesRight.value, { y: "0vh" });

  setInterval(()=>{
  nextImage()
}, 2000)
});
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  border: none;
}
$page-height: 100;
$page-width: 50;

.grid-page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: black;

  .slides-container {
    width: calc($page-width * 2) + 0lvw;
    height: $page-height + 0lvh;
    overflow: hidden;
    display: flex;
    position: relative;

    .slider {
      width: 100%;
      height: 100%;
      position: absolute;

      &.left {
        img {
          clip-path: inset(0 40% 0 0);
        }
      }

      &.right {

        transform: translateY($page-height * -1vh);

        img {
          clip-path: inset(0 0 0 50%);
        }
      }

      &.slider-container {
        // position: relative;

        .slider-images {
          position: absolute;
          width: 100%;
          display: flex;
          flex-direction: column; // Stack images vertically

          .slider-image {
            width: 100%;
            height: $page-height + 0lvh;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }
  }
}


</style>

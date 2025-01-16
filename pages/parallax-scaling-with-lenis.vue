<template>
  <div class="wrapper">
    <section class="archive" ref="archiveRef">
      <div class="archive_slider" ref="sliderRef">
        <figure
          class="archive_slider_figure"
          v-for="imageLink in images"
          :key="i"
        >
          <img class="archive_slider_image" :src="imageLink" alt="" />
        </figure>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Lenis from "@studio-freight/lenis";

const archiveRef = ref(null);
const sliderRef = ref(null);
let lenisInstance = null;
const figureScales = new Map();

// Image sources
const images = [

  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/cool-bicycle-indoors_23-2150884314.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363267.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/vector-art-celestial-kitty-dreamy-feline-portrait-amidst_1041239-27980.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/cool-bicycle-indoors_23-2150884314.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363267.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/vector-art-celestial-kitty-dreamy-feline-portrait-amidst_1041239-27980.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/high-angle-view-plant-pod-amidst-leaves-pond_1048944-30684171.jpg?ga=GA1.1.716202888.1736745677&semt=ais_hybrid",
  
  //   dark
  "https://img.freepik.com/free-photo/black-background-with-rocks-water_23-2149872551.jpg?ga=GA1.1.716202888.1736745677&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/summer-flowers-purple-lupins-vase-table-sunlight-summer-still-life-with-blue-lupines_370028-9609.jpg?ga=GA1.1.716202888.1736745677&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/black-background-with-rocks-water_23-2149872551.jpg?ga=GA1.1.716202888.1736745677&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/summer-flowers-purple-lupins-vase-table-sunlight-summer-still-life-with-blue-lupines_370028-9609.jpg?ga=GA1.1.716202888.1736745677&semt=ais_hybrid",
];

// Smooth transition function
const lerp = (start, end, amt) => start + (end - start) * amt;

onMounted(() => {
  if (process.client) {
    const settings = {
      center: window.innerWidth / 2,
      scaleFactor: 1.5, // More natural scaling
      lerpFactor: 0.1, // Smooth transition
    };

    lenisInstance = new Lenis({
      wrapper: archiveRef.value,
      content: sliderRef.value,
      orientation: "horizontal",
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2,
      lerp: settings.lerpFactor,
      mobile: true,
    //   infinite: true,
    });

    lenisInstance.on("scroll", () => {
      archiveRef.value
        ?.querySelectorAll(".archive_slider_figure")
        ?.forEach((figure) => {
          const figureRect = figure.getBoundingClientRect();
          const img = figure.querySelector("img");

          const distanceFromCenter = Math.abs(
            figureRect.left + figureRect.width / 2 - settings.center
          );

          const targetScale =
            settings.scaleFactor -
            ((settings.center - distanceFromCenter) / settings.center) *
              (settings.scaleFactor - 1);

          const clampedScale = Math.max(1, targetScale);
          const previousScale = figureScales.get(figure) || 1;
          const smoothedScale = lerp(previousScale, clampedScale, 0.1);

          figureScales.set(figure, smoothedScale);
          img.style.transform = `scale(${smoothedScale})`;
          img.style.transition = "transform 0.3s ease-out"; // Ensures smooth animation
        });
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
});

onUnmounted(() => {
  if (lenisInstance) {
    lenisInstance.destroy();
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: pan-x;
}

.archive {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.archive_slider {
  display: flex;
  height: 100%;
  width: max-content;
  touch-action: pan-x;
}

.archive_slider_figure {
  width: 50vw; /* Reduced width for proper spacing */
  height: 100%;
  flex: 0 0 auto;
  position: relative;
  overflow: hidden;
}

.archive_slider_image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-out;
}
</style>

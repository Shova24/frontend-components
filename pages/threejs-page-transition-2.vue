<template>
  <ThreeSlider :images="images" disp-image="/disp1.jpg" />
</template>

<script setup>
import { ref } from "vue";
import ThreeSlider from "~/components/ThreeSlider.vue";

import img_2 from "../assets/images/img_2.jpg";
import img_3 from "../assets/images/img_3.jpg";
import img_4 from "../assets/images/img_4.jpg";
import img_5 from "../assets/images/img_5.jpg";

const images = ref([img_2, img_3, img_4, img_5]);
</script>

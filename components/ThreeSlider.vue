<!-- components/ThreeSlider.vue -->
<template>
  <div>
    <div id="content" class="content">
      <div 
        ref="container"
        id="slider" 
        :data-images="JSON.stringify(images)" 
        :data-disp="dispImage"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useThreeSlider } from '~/composables/useThreeSlider';

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  dispImage: {
    type: String,
    required: true
  }
});

const container = ref(null);

const sliderOptions = {
  debug: true,
  uniforms: {
    intensity: { value: 10, type: "f", min: 1, max: 100 },
  },
  fragment: `
    uniform float progress;
    uniform float intensity;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform sampler2D displacement;
    uniform vec4 resolution;
    varying vec2 vUv;
    mat2 rotate(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    const float PI = 3.1415;
    const float angle1 = PI *0.25;
    const float angle2 = -PI *0.75;

    void main() {
        vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
        vec2 uvDivided = fract(newUV*vec2(intensity,1.));
        vec2 uvDisplaced1 = newUV + rotate(3.1415926/4.)*uvDivided*progress*0.1;
        vec2 uvDisplaced2 = newUV + rotate(3.1415926/4.)*uvDivided*(1. - progress)*0.1;
        vec4 t1 = texture2D(texture1,uvDisplaced1);
        vec4 t2 = texture2D(texture2,uvDisplaced2);
        gl_FragColor = mix(t1, t2, progress);
    }
  `,
};

const { init, next } = useThreeSlider(sliderOptions);

const handleClick = () => {
  next();
};

onMounted(() => {
  if (container.value) {
    init(container.value, props.images, props.dispImage);
  }
});
</script>

<style scoped>
.content {
  width: 100%;
  height: 100vh;
}

#slider {
  width: 100%;
  height: 100%;
}
</style>
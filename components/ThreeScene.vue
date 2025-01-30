<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import * as THREE from "three";
import gsap from "gsap";
import img_2 from "../assets/images/img_2.jpg";
import img_3 from "../assets/images/img_3.jpg";
import img_4 from "../assets/images/img_4.jpg";
import img_5 from "../assets/images/img_5.jpg";


const images = ref([img_2, img_3, img_4, img_5]);

const sliderContainer = ref(null);
let sketchInstance = null;

onMounted(async () => {
  await nextTick();
  if (process.client && sliderContainer.value) {
    sketchInstance = new Sketch({ container: sliderContainer.value, images: images.value });
  }
});

onUnmounted(() => {
  if (sketchInstance) sketchInstance.stop();
});

// Sketch Class
class Sketch {
  constructor(opts) {
    this.container = opts.container;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.001, 1000);
    this.camera.position.set(0, 0, 2);
    this.textures = [];
    this.paused = true;
    this.current = 0;
    this.isRunning = false;
    this.duration = opts.duration || 1;

    this.loadTextures(opts.images, () => {
      this.setupResize();
      this.addObjects();
      this.resize();
      this.play();
    });
  }

  loadTextures(images, callback) {
    const loader = new THREE.TextureLoader();
    const promises = images.map((url, i) =>
      new Promise((resolve) => {
        loader.load(url, (texture) => {
          this.textures[i] = texture;
          resolve();
        });
      })
    );
    Promise.all(promises).then(callback);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        texture1: { value: this.textures[0] },
        texture2: { value: this.textures[1] },
      },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform sampler2D texture1; uniform sampler2D texture2; uniform float progress;
        void main() {
          vec4 tex1 = texture2D(texture1, vUv);
          vec4 tex2 = texture2D(texture2, vUv);
          gl_FragColor = mix(tex1, tex2, progress);
        }`,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  next() {
    if (this.isRunning) return;
    this.isRunning = true;
    let nextTexture = this.textures[(this.current + 1) % this.textures.length];
    this.material.uniforms.texture2.value = nextTexture;

    gsap.to(this.material.uniforms.progress, {
      value: 1,
      duration: this.duration,
      ease: "power2.out",
      onComplete: () => {
        this.current = (this.current + 1) % this.textures.length;
        this.material.uniforms.texture1.value = nextTexture;
        this.material.uniforms.progress.value = 0;
        this.isRunning = false;
      },
    });
  }

  play() {
    this.paused = false;
    this.render();
  }

  stop() {
    this.paused = true;
  }

  render() {
    if (this.paused) return;
    this.material.uniforms.time.value += 0.05;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
</script>

<template>
  <div ref="sliderContainer" id="slider"></div>
</template>

<style scoped>
#slider {
  width: 100%;
  position: relative;
}
</style>

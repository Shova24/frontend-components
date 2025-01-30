<script setup>
import * as THREE from 'three'
import { gsap } from 'gsap'
import { onMounted, ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  duration: {
    type: Number,
    default: 1
  },
  debug: {
    type: Boolean,
    default: false
  },
  easing: {
    type: String,
    default: 'easeInOut'
  },
  fragment: {
    type: String,
    required: true
  },
  uniforms: {
    type: Object,
    required: true
  }
})

const container = ref(null)
const current = ref(0)
const isRunning = ref(false)
const time = ref(0)
let scene, camera, renderer, material, geometry, plane
let textures = []
let animationFrame

// Basic setup
const initThree = () => {
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer()
  
  const width = container.value.offsetWidth
  const height = container.value.offsetHeight
  
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(0xeeeeee, 1)
  
  container.value.appendChild(renderer.domElement)
  
  camera = new THREE.PerspectiveCamera(
    70,
    width / height,
    0.001,
    1000
  )
  camera.position.set(0, 0, 2)
}

// Load textures
const loadTextures = async () => {
  const loadPromises = props.images.map((url, i) => {
    return new Promise(resolve => {
      textures[i] = new THREE.TextureLoader().load(url, resolve)
    })
  })
  await Promise.all(loadPromises)
}

// Add objects to scene
const addObjects = () => {
  material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0 },
      progress: { type: "f", value: 0 },
      texture1: { type: "f", value: textures[0] },
      texture2: { type: "f", value: textures[1] },
      resolution: { type: "v4", value: new THREE.Vector4() },
      ...props.uniforms
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: props.fragment
  })

  geometry = new THREE.PlaneGeometry(1, 1, 2, 2)
  plane = new THREE.Mesh(geometry, material)
  scene.add(plane)
}

// Handle resize
const handleResize = () => {
  const width = container.value.offsetWidth
  const height = container.value.offsetHeight
  
  renderer.setSize(width, height)
  camera.aspect = width / height
  
  // Image cover calculation
  const imageAspect = textures[0].image.height / textures[0].image.width
  let a1, a2
  if (height / width > imageAspect) {
    a1 = (width / height) * imageAspect
    a2 = 1
  } else {
    a1 = 1
    a2 = (height / width) / imageAspect
  }
  
  material.uniforms.resolution.value.set(width, height, a1, a2)
  
  const dist = camera.position.z
  const height_const = 1
  camera.fov = 2 * (180 / Math.PI) * Math.atan(height_const / (2 * dist))
  
  plane.scale.x = camera.aspect
  plane.scale.y = 1
  
  camera.updateProjectionMatrix()
}

// Animation loop
const render = () => {
  time.value += 0.05
  material.uniforms.time.value = time.value
  
  renderer.render(scene, camera)
  animationFrame = requestAnimationFrame(render)
}

// Next slide transition
const next = () => {
  if (isRunning.value) return
  
  isRunning.value = true
  const len = textures.length
  const nextTexture = textures[(current.value + 1) % len]
  material.uniforms.texture2.value = nextTexture
  
  gsap.to(material.uniforms.progress, {
    value: 1,
    duration: props.duration,
    ease: `power2.${props.easing}`,
    onComplete: () => {
      current.value = (current.value + 1) % len
      material.uniforms.texture1.value = nextTexture
      material.uniforms.progress.value = 0
      isRunning.value = false
    }
  })
}

// Lifecycle hooks
onMounted(async () => {
  await loadTextures()
  initThree()
  addObjects()
  handleResize()
  window.addEventListener('resize', handleResize)
  render()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrame)
  renderer?.dispose()
  material?.dispose()
  geometry?.dispose()
})
</script>

<template>
  <div ref="container" class="webgl-slider" @click="next">
    <!-- Slider will be rendered here -->
  </div>
</template>

<style scoped>
.webgl-slider {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
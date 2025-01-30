// composables/useThreeSlider.js
import gsap, { Power2 } from "gsap";
import * as THREE from "three";
import { onBeforeUnmount, ref, shallowRef } from 'vue';

export const useThreeSlider = (options) => {
  // Use shallowRef for Three.js objects to prevent deep reactivity
  const scene = shallowRef(new THREE.Scene());
  const renderer = shallowRef();
  const camera = shallowRef();
  const material = shallowRef();
  const plane = shallowRef();
  const textures = shallowRef([]);
  
  // Regular refs for primitive values
  const currentIndex = ref(0);
  const isRunning = ref(false);
  const time = ref(0);
  const autoPlayInterval = ref();

  const state = ref({
    width: 0,
    height: 0,
    paused: true,
    container: null
  });

  const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const initRenderer = (container) => {
    state.value.container = container;
    renderer.value = new THREE.WebGLRenderer();
    state.value.width = container.offsetWidth;
    state.value.height = container.offsetHeight;
    renderer.value.setPixelRatio(window.devicePixelRatio);
    renderer.value.setSize(state.value.width, state.value.height);
    renderer.value.setClearColor(0xeeeeee, 1);
    container.appendChild(renderer.value.domElement);
  };

  const initCamera = () => {
    camera.value = new THREE.PerspectiveCamera(
      70,
      state.value.width / state.value.height,
      0.001,
      1000
    );
    camera.value.position.set(0, 0, 2);
  };

  const loadTextures = async (images) => {
    const loadTexture = (url) => 
      new Promise((resolve) => {
        new THREE.TextureLoader().load(url, resolve);
      });

    const loadedTextures = await Promise.all(images.map(loadTexture));
    textures.value = loadedTextures; // Assign array of loaded textures
  };

  const createMaterial = (dispImage) => {
    const dispTexture = new THREE.TextureLoader().load(dispImage);
    
    material.value = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        texture1: { type: "f", value: textures.value[0] },
        texture2: { type: "f", value: textures.value[1] },
        displacement: { type: "f", value: dispTexture },
        resolution: { type: "v4", value: new THREE.Vector4() },
        ...options.uniforms
      },
      vertexShader: vertex,
      fragmentShader: options.fragment
    });
  };

  const createPlane = () => {
    const geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    const mesh = new THREE.Mesh(geometry, material.value);
    plane.value = mesh;
    scene.value.add(mesh);
  };

  const handleResize = () => {
    if (!renderer.value || !camera.value || !material.value || !textures.value[0] || !state.value.container) return;

    state.value.width = state.value.container.offsetWidth;
    state.value.height = state.value.container.offsetHeight;
    
    renderer.value.setSize(state.value.width, state.value.height);
    camera.value.aspect = state.value.width / state.value.height;

    const imageAspect = textures.value[0].image.height / textures.value[0].image.width;
    const [a1, a2] = calculateAspectRatios(imageAspect);

    updateMaterialResolution(a1, a2);
    updateCameraAndPlane();
  };

  const calculateAspectRatios = (imageAspect) => {
    const { width, height } = state.value;
    if (height / width > imageAspect) {
      return [(width / height) * imageAspect, 1];
    }
    return [1, (height / width) / imageAspect];
  };

  const updateMaterialResolution = (a1, a2) => {
    if (!material.value) return;
    
    const resolution = material.value.uniforms.resolution.value;
    resolution.x = state.value.width;
    resolution.y = state.value.height;
    resolution.z = a1;
    resolution.w = a2;
  };

  const updateCameraAndPlane = () => {
    if (!camera.value || !plane.value) return;

    const dist = camera.value.position.z;
    const height = 1;
    camera.value.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));
    camera.value.updateProjectionMatrix();

    plane.value.scale.x = camera.value.aspect;
    plane.value.scale.y = 1;
  };

  const startAutoPlay = () => {
    autoPlayInterval.value = setInterval(() => {
      next();
    }, 2000);
  };

  const next = () => {
    if (isRunning.value || !material.value || !textures.value.length) return;
    
    isRunning.value = true;
    const nextIndex = (currentIndex.value + 1) % textures.value.length;
    material.value.uniforms.texture2.value = textures.value[nextIndex];

    gsap.to(material.value.uniforms.progress, {
      duration: options.duration || 1,
      value: 1,
      ease: Power2[options.easing || "easeInOut"],
      onComplete: () => {
        currentIndex.value = nextIndex;
        material.value.uniforms.texture1.value = textures.value[nextIndex];
        material.value.uniforms.progress.value = 0;
        isRunning.value = false;
      }
    });
  };

  const render = () => {
    if (state.value.paused) return;
    
    time.value += 0.05;
    if (material.value) {
      material.value.uniforms.time.value = time.value;
      
      Object.keys(options.uniforms).forEach((item) => {
        material.value.uniforms[item].value = options.uniforms[item].value;
      });
    }

    renderer.value?.render(scene.value, camera.value);
    requestAnimationFrame(render);
  };

  const init = async (container, images, dispImage) => {    
    await loadTextures(images);
    initRenderer(container);
    initCamera();
    createMaterial(dispImage);
    createPlane();
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    state.value.paused = false;
    render();
    startAutoPlay();
  };

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    clearInterval(autoPlayInterval.value);
    
    // Cleanup Three.js resources
    material.value?.dispose();
    plane.value?.geometry.dispose();
    textures.value.forEach(texture => texture.dispose());
    renderer.value?.dispose();
  });

  return {
    init,
    next,
    currentIndex
  };
};
<template>
    <div>
      <div id="content" class="content">
        <div 
          id="slider" 
          :data-images="JSON.stringify(images)" 
          :data-disp="dispImage"
          ref="container">
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import * as THREE from "three";
  import gsap from "gsap";
  import { Power2 } from "gsap"; 

  
  import img_2 from "../assets/images/img_2.jpg";
  import img_3 from "../assets/images/img_3.jpg";
  import img_4 from "../assets/images/img_4.jpg";
  import img_5 from "../assets/images/img_5.jpg";
  
  const images = ref([img_2, img_3, img_4, img_5]);
  const dispImage = ref('../assets/images/disp1.jpg');
  const container = ref(null);
  
  onMounted(() => {
      class Sketch {
        constructor(opts) {
          this.scene = new THREE.Scene();
          this.vertex = `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`;
          this.fragment = opts.fragment;
          this.uniforms = opts.uniforms;
          this.renderer = new THREE.WebGLRenderer();
          this.width = window.innerWidth;
          this.height = window.innerHeight;
          this.renderer.setPixelRatio(window.devicePixelRatio);
          this.renderer.setSize(this.width, this.height);
          this.renderer.setClearColor(0xeeeeee, 1);
          this.duration = opts.duration || 1;
          this.debug = opts.debug || false;
          this.easing = opts.easing || "easeInOut";
          this.clicker = document.getElementById("content");
      
          this.container = document.getElementById("slider");
          // Parse the data-images attribute properly
          this.images = JSON.parse(this.container.getAttribute('data-images'));
          this.dispImage = this.container.getAttribute('data-disp');
          this.width = this.container.offsetWidth;
          this.height = this.container.offsetHeight;
          this.container.appendChild(this.renderer.domElement);
      
          this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
          );
      
          this.camera.position.set(0, 0, 2);
          this.time = 0;
          this.current = 0;
          this.textures = [];
      
          this.paused = true;
          this.initiate(() => {
            this.setupResize();
            this.settings();
            this.addObjects();
            this.resize();
            this.clickEvent();
            this.play();

            this.startAutoNext();
          });
        }
      
        initiate(cb) {
          const promises = [];
          let that = this;
          this.images.forEach((url, i) => {
            let promise = new Promise((resolve) => {
              that.textures[i] = new THREE.TextureLoader().load(url, resolve);
            });
            promises.push(promise);
          });
      
          Promise.all(promises).then(() => {
            cb();
          });
        }
      
        clickEvent() {
          this.clicker.addEventListener("click", () => {
            this.next();
          });
        }

        startAutoNext() {
  this.interval = setInterval(() => {
    this.next();
  }, 3000); // Change 2000 to your desired interval in milliseconds
}

stopAutoNext() {
  clearInterval(this.interval);
}

// Stop auto-play when component is destroyed
beforeDestroy() {
  this.stopAutoNext();
}
  
        settings() {
          this.settings = { progress: 0.5 };
          Object.keys(this.uniforms).forEach((item) => {
            this.settings[item] = this.uniforms[item].value;
          });
        }
      
        setupResize() {
          window.addEventListener("resize", this.resize.bind(this));
        }
      
        resize() {
          this.width = this.container.offsetWidth;
          this.height = this.container.offsetHeight;
          this.renderer.setSize(this.width, this.height);
          this.camera.aspect = this.width / this.height;
      
          this.imageAspect = this.textures[0].image.height / this.textures[0].image.width;
          let a1, a2;
          if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
          } else {
            a1 = 1;
            a2 = this.height / this.width / this.imageAspect;
          }
      
          this.material.uniforms.resolution.value.x = this.width;
          this.material.uniforms.resolution.value.y = this.height;
          this.material.uniforms.resolution.value.z = a1;
          this.material.uniforms.resolution.value.w = a2;
      
          const dist = this.camera.position.z;
          const height = 1;
          this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));
      
          this.plane.scale.x = this.camera.aspect;
          this.plane.scale.y = 1;
      
          this.camera.updateProjectionMatrix();
        }
      
        addObjects() {
          this.material = new THREE.ShaderMaterial({
            extensions: {
              derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
              time: { type: "f", value: 0 },
              progress: { type: "f", value: 0 },
              border: { type: "f", value: 0 },
              intensity: { type: "f", value: 0 },
              scaleX: { type: "f", value: 40 },
              scaleY: { type: "f", value: 40 },
              transition: { type: "f", value: 40 },
              swipe: { type: "f", value: 0 },
              width: { type: "f", value: 0 },
              radius: { type: "f", value: 0 },
              texture1: { type: "f", value: this.textures[0] },
              texture2: { type: "f", value: this.textures[1] },
              displacement: {
                type: "f",
                value: new THREE.TextureLoader().load(this.dispImage),
              },
              resolution: { type: "v4", value: new THREE.Vector4() },
            },
            vertexShader: this.vertex,
            fragmentShader: this.fragment,
          });
      
          this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
          this.plane = new THREE.Mesh(this.geometry, this.material);
          this.scene.add(this.plane);
        }
      
        stop() {
          this.paused = true;
        }
      
        play() {
          this.paused = false;
          this.render();
        }
      
        next() {
          if (this.isRunning) return;
          this.isRunning = true;
          let len = this.textures.length;
          let nextTexture = this.textures[(this.current + 1) % len];
          this.material.uniforms.texture2.value = nextTexture;
          let tl = gsap.timeline();
          tl.to(this.material.uniforms.progress, {
            duration: this.duration,
            value: 1,
            ease: Power2[this.easing],
            onComplete: () => {
              this.current = (this.current + 1) % len;
              this.material.uniforms.texture1.value = nextTexture;
              this.material.uniforms.progress.value = 0;
              this.isRunning = false;
            },
          });
        }
      
        render() {
          if (this.paused) return;
          this.time += 0.05;
          this.material.uniforms.time.value = this.time;
      
          Object.keys(this.uniforms).forEach((item) => {
            this.material.uniforms[item].value = this.settings[item];
          });
      
          requestAnimationFrame(this.render.bind(this));
          this.renderer.render(this.scene, this.camera);
        }
      }
      
      new Sketch({
        debug: true,
        uniforms: {
          intensity: { value: 50, type: "f", min: 1, max: 100 },
        },
        fragment: `
          uniform float time;
          uniform float progress;
          uniform float intensity;
          uniform float width;
          uniform float scaleX;
          uniform float scaleY;
          uniform float transition;
          uniform float radius;
          uniform float swipe;
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
      });
  });


  </script>
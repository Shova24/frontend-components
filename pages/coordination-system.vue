<template>
    <div class="coordinate-container">
      <div class="axes">
        <div class="x-axis"></div>
        <div class="y-axis"></div>
      </div>
      
      <div class="angle-lines">
        <div 
          v-for="(angle, index) in predefinedAngles" 
          :key="index" 
          class="angle-line"
          :style="getAngleLineStyle(angle)"
        ></div>
      </div>
  
      <div class="cards">
        <div 
          v-for="(angle, index) in predefinedAngles" 
          :key="index" 
          class="card"
          :style="getCardPosition(angle, index)"
        >
          Card {{ index + 1 }}
        </div>
      </div>
  
      <div class="info-panel">
        <h3>Coordinate Information</h3>
        <div>Mouse X: {{ mouseX }}</div>
        <div>Mouse Y: {{ mouseY }}</div>
        <div>Angle: {{ currentAngle.toFixed(2) }} rad</div>
        <div>Degrees: {{ (currentAngle * 180 / Math.PI).toFixed(2) }}°</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const centerX = ref(0)
  const centerY = ref(0)
  const radius = ref(0)
  const mouseX = ref(0)
  const mouseY = ref(0)
  const currentAngle = ref(0)
  
  const predefinedAngles = [
    0, 
    Math.PI/4, 
    Math.PI/2, 
    3*Math.PI/4, 
    Math.PI, 
    5*Math.PI/4, 
    3*Math.PI/2, 
    7*Math.PI/4
  ]
  
  const getAngleLineStyle = (angle) => ({
    width: `${radius.value}px`,
    transform: `rotate(${angle}rad)`
  })
  
  const getCardPosition = (angle, index) => {
    const x = centerX.value + Math.cos(angle) * radius.value
    const y = centerY.value + Math.sin(angle) * radius.value
    
    return {
      left: `${x - 50}px`,
      top: `${y - 75}px`,
      transform: `rotate(${angle}rad)`
    }
  }
  
  const updateCoordinates = (event) => {
    const container = event.target.closest('.coordinate-container')
    const rect = container.getBoundingClientRect()
    
    mouseX.value = event.clientX - rect.left - centerX.value
    mouseY.value = event.clientY - rect.top - centerY.value
    
    currentAngle.value = Math.atan2(mouseY.value, mouseX.value)
  }
  
  onMounted(() => {
    const container = document.querySelector('.coordinate-container')
    centerX.value = container.clientWidth / 2
    centerY.value = container.clientHeight / 2
    radius.value = Math.min(container.clientWidth, container.clientHeight) * 0.4
  })
  </script>
  
  <style scoped>
  .coordinate-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #f0f0f0;
    overflow: hidden;
  }
  
  .axes .x-axis {
    position: absolute;
    height: 2px;
    width: 100%;
    top: 50%;
    background-color: red;
  }
  
  .axes .y-axis {
    position: absolute;
    width: 2px;
    height: 100%;
    left: 50%;
    background-color: red;
  }
  
  .angle-line {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 2px;
    background-color: green;
    transform-origin: left center;
  }
  
  .card {
    position: absolute;
    width: 100px;
    height: 150px;
    background-color: #3498db;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 10px;
  }
  
  .info-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0,0,0,0.7);
    color: white;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
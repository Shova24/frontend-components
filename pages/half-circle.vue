<script setup>
import { onMounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const images = [
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/cool-bicycle-indoors_23-2150884314.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363267.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/vector-art-celestial-kitty-dreamy-feline-portrait-amidst_1041239-27980.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
];

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  const stickySection = document.querySelector(".steps");
  const cards = document.querySelectorAll(".card");
  const totalCards = cards.length;

  // Create SVG for arc line
  const createArcSVG = (radius) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "arc-svg");
    svg.style.position = "absolute";
    svg.style.top = "40dvh";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";

    svg.style.pointerEvents = "none";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const startAngle = Math.PI ;
    const endAngle = 0;

    const x1 = window.innerWidth / 2 + Math.cos(startAngle) * radius;
    const y1 = window.innerHeight / 2 + radius / 2 + Math.sin(startAngle) * radius;
    const x2 = window.innerWidth / 2 + Math.cos(endAngle) * radius;
    const y2 = window.innerHeight / 2 + radius / 2 + Math.sin(endAngle) * radius;

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    path.setAttribute("d", `
      M ${x1} ${y1} 
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
    `);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(255,255,255,0.2)");
    path.setAttribute("stroke-width", "2");

    svg.appendChild(path);
    stickySection.appendChild(svg);
  };

  // Half-circle specific calculations
  const getRadius = () => {
    return window.innerWidth < 900
      ? window.innerWidth * 0.5
      : window.innerWidth * 0.5;
  };

  const arcAngle = Math.PI; // Full half-circle
  const startAngle =( Math.PI * 3)/2;

  const positionCards = (progress = 0) => {
    const radius = getRadius();

    // Create or update arc line
    const existingArc = document.querySelector(".arc-svg");
    if (existingArc) existingArc.remove();
    createArcSVG(radius);

    cards.forEach((card, index) => {
      // Normalized progress for each card
      const normalizedProgress = (totalCards - 1 - index) / (totalCards - 1);
      const cardProgress = normalizedProgress + progress;

      // Calculate angle within half-circle
      const angle = startAngle + arcAngle * cardProgress;

      // Calculate x and y positions
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Apply transformations
      gsap.set(card, {
        x: x,
        y: -y + radius + radius / 2, // Adjust vertical positioning
        rotation: -(angle - Math.PI / 2) * (180 / Math.PI),
        transformOrigin: "center center",
        scale: 1 - Math.abs(cardProgress - 0.5) * 0.2, // Optional scaling effect
      });
    });
  };

  // ScrollTrigger configuration
  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: () => `+=${stickySection.offsetHeight * 3}`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      positionCards(self.progress);
    },
    markers: true, // Remove in production
  });

  // Initial positioning
  positionCards(0);
});
</script>

<template>
  <section class="top-banner">
    <h1>Half Circle</h1>
  </section>
  <section class="steps">
    <div class="cards">
      <div class="card" v-for="(image, index) in images" :key="index">
        <div class="card-img">
          <img :src="image" :alt="`Card ${index + 1}`" />
        </div>
        <div class="card-content">
          <p>Card {{ index + 1 }} Description</p>
        </div>
      </div>
    </div>
  </section>

  <section class="bottom-section">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam sit debitis
      repudiandae? Mollitia consectetur architecto assumenda nostrum! Animi,
      excepturi fuga. Ut, minima. Maxime nam, itaque laborum modi voluptates
      earum?
    </p>
  </section>
</template>

<style scoped>
.top-banner {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #045037;
  color: white;
  h1 {
    font-size: 6rem;
  }
}
.steps {
  position: relative;
  height: 100dvh;
  background: black;
  color: white;
   border: 1px solid green;
}

.cards {
  position: absolute;
  top: -35dvh;
  left: 40lvw; 
  z-index: 1;

}

.card {
  width: 20vw;
  position: absolute;
  aspect-ratio: 5/6;
  transform-origin: center center; 
  border-radius: 1rem;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bottom-section {
  background: #f1f1f1;
  color: black;
  padding: 2rem;
  height: 100lvh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  p {
    max-width: 75%;
    font-size: 3.5rem;
    text-align: center;
  }
}
</style>
<script setup>

const images = [
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/cool-bicycle-indoors_23-2150884314.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363267.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/vector-art-celestial-kitty-dreamy-feline-portrait-amidst_1041239-27980.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/dreamy-arrangement-with-decorative-dried-flowers_23-2151363285.jpg?ga=GA1.1.1707687320.1721033496&semt=ais_hybrid",
];


import gsap from 'gsap';
import  ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';


onMounted(async () => {
  const { gsap } = await import('gsap')
  // const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  // const Lenis = (await import('@studio-freight/lenis')).default

  gsap.registerPlugin(ScrollTrigger)

  // let lenisInstance = new Lenis()

  // lenisInstance.on('scroll', ScrollTrigger.update)

  // gsap.ticker.add((time) => {
  //   lenisInstance.raf(time * 1000)
  // })

  // gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector('.steps');
  const stickyHeight = stickySection.innerHeight * 7;
  const cards = document.querySelectorAll('.card');

  const countContainer = document.querySelector('.count-container');
  const totalCards = cards.length;

  ScrollTrigger.create({
      trigger: stickySection,
      start: 'top top',
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      markers: true, 

      onUpdate: self =>{
        positionCards(self.progress);
      }
    });

    const getRadius = () =>{
      return window.innerWidth < 900 ? window.innerWidth * 7.5 : window.innerWidth * 2.5;
    }

    const arcAngle = Math.PI / .4;
    const startAngle = Math.PI / 2 - arcAngle/2;


    const positionCards = (progress = 0) =>{
      const radius = getRadius();
const totalTravel = 1 + totalCards/7.5;
const adjustedProgress = (process * totalTravel -1 ) * .75;

      cards.forEach((card, i) =>{
       const normalizedProgress = (totalCards - 1- i) / totalCards;
       const cardProgress = normalizedProgress + adjustedProgress;

       const angle = startAngle + arcAngle * cardProgress;
       const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = (angle -Math.PI / 2) * (180/Math.PI)


        gsap.set(card, {
          x: x, 
          y: -y + radius,
          rotation: -rotation,
          transformOrigin: 'center center',

        })



      });
    }


    positionCards(0);




  console.log('====================================');
  console.log("stickySection : ", stickySection);
  console.log("stickyHeight : ", stickyHeight);
  console.log("cards : ", cards);
  console.log("countContainer : ", countContainer);
  
  
  console.log("totalCards'",totalCards);
  console.log('====================================');
})

onUnmounted(() => {
  if (lenisInstance) {
    lenisInstance.destroy()
  }
})

// If you need to access lenisInstance in your template or other methods:
const scrollTo = (target) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target)
  }
}
</script>

<template>
  <section class="card-parallax-cards-container">
    <nav>
      <p class="logo">Voxel</p>
      <button>Download Now</button>
    </nav>

    <section class="intro"></section>
    <section class="steps">
      <div class="step-counter">
        <div class="counter-title">
          <h1>Steps</h1>
        </div>
        <div class="count">
          <div class="count-container">
            <h1>01</h1>
            <h1>02</h1>
            <h1>03</h1>
            <h1>04</h1>
            <h1>05</h1>
          </div>
        </div>

        <div class="cards">
          <div class="card" v-for="image in images" :key="image">
            <div class="card-img">
              <img :src="image" alt="" />
            </div>
            <div class="card-content">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
                velit nisi, adipisci temporibus libero nemo in vero ullam
                maiores deleniti.
              </p>
            </div>
          </div>
        </div>

        <div class="card empty"></div>
        <div class="card empty"></div>
      </div>
    </section>
    <section class="outro">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi
        natus perspiciatis assumenda numquam modi vel et, quia culpa ratione
        odio veritatis saepe, blanditiis aspernatur? Ratione voluptate deleniti
        repellat quisquam, suscipit quaerat sequi ullam vero quibusdam, facilis
        fugit voluptatibus, nobis unde cupiditate molestiae nemo aspernatur at
        inventore iste cumque ipsa exercitationem aliquid? Vel debitis voluptate
        cumque modi error eveniet ullam eligendi.
      </p>
    </section>
  </section>
</template>

<style scoped lang="scss">
.card-parallax-cards-container {
  //   background: beige;
  //   color: rgb(167, 161, 161);

  background: black;
  color: white;
  font-size: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    padding: 1.5em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;

    .logo {
      text-transform: uppercase;
      font-family: "PP Monument Extended";
      font-weight: 900;
    }

    button {
      border: none;
      outline: none;
      font-weight: 500;
      color: black;
      padding: 0.75em 1em;
      background-color: white;
      border-radius: 0.25em;
    }
  }

  section {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .intro {
    background: url("https://img.freepik.com/free-vector/hand-drawn-flat-design-boho-wall-art_23-2149298532.jpg?t=st=1737520576~exp=1737524176~hmac=132f4a4ab934cad6a518d4a82aebfeaaf64aa5cbf652215810e2e81d4a008077&w=826")
      no-repeat 50% 50%;
    background-size: cover;
  }

  .outro {
    display: flex;
    justify-content: center;
    align-self: center;
    background: linear-gradient(180deg, #000000, #364549);
    background-size: 200% 200%;

    p {
      width: 75%;
      text-align: center;
      color: white;
      font-size: 52px;
      font-weight: 400;
      line-height: 1.25;
    }
  }

  .cards {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150vw;
    height: 600px;
    will-change: transform;


    .card {
      position: absolute;
      width: 500px;
      height: 550px;
      top: 50%;
      left: 50%;
      transform-origin: center center;
      margin-left: -250px;
      display: flex;
      flex-direction: column;
      gap: 1em;
      will-change: transform;

      .card-img {
        flex: 1;
        border-radius: 0.5em;
        overflow: hidden;
      }

      .card-content {
        width: 100%;
        height: 60px;
        p {
          text-align: left;
          color: white;
          font-size: 1em;
          font-weight: 500;
          line-height: 1.25;
        }
      }
    }


  }


  .step-counter {
      position: absolute;
      display: flex;
      flex-direction: column;
      margin: 2em;

      .count, .counter-title{
        position: absolute;
        width: 1200px;
        height: 150px;
        clip-path: polygon(0 0, 100% 0,100% 100%,0% 100%);
        overflow: hidden;
      }

      .count{
        top: 10px;;
      }
    }

    .count-container{
        position: relative;
        transform: translateY(150px);
        will-change: transform;
    }

    .step-counter h1{
        width: 100%;
        position: relative;
        color: white;
        text-transform: uppercase;
        font-family: "PP Monument Extended";
        font-weight: 900;
        font-size: 150px;
        line-height: 1;
        letter-spacing: -.04em;
        will-change: transform;
    }


    .empty{
        opacity: 0;
    }
}
</style>

<template>
  <div class="container">
    <div class="cursor">
      <p>View</p>
    </div>



    <div class="story-img">
      <div class="img">
        <img
          src="https://img.freepik.com/premium-photo/chocolate-brownies-with-chocolate-ice-cream_1339-17809.jpg?w=1380"
          alt=""
        />
      </div>
    </div>

    <div class="story-content">
      <div class="row">
        <div class="indices">
          <div class="index">
            <div class="index-highlight"></div>
          </div>
          <div class="index">
            <div class="index-highlight"></div>
          </div>
          <div class="index">
            <div class="index-highlight"></div>
          </div>
          <div class="index">
            <div class="index-highlight"></div>
          </div>
          <div class="index">
            <div class="index-highlight"></div>
          </div>
          <div class="index">
            <div class="index-highlight"></div>
          </div>
        </div>
        <div class="profile">
          <div class="profile-icon">
            <img
              src="https://img.freepik.com/premium-photo/chocolate-brownies-with-chocolate-ice-cream_1339-17809.jpg?w=1380"
              alt=""
            />
          </div>

          <div class="profile-name">
            <p>Profile Name</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="title">
          <div class="title-row">
            <h1>ipsum dolor sit amet consectetur adipisicing elit.</h1>
          </div>
          <div class="title-row">
            <h1>ipsum dolor sit amet consectetur adipisicing elit.</h1>
          </div>
          <div class="title-row">
            <h1>ipsum dolor sit amet consectetur adipisicing elit.dfds</h1>
          </div>
        </div>

        <div class="link">
          <a href="/"> Read More </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from "gsap";

const stories = [
  {
    profileImg:
      "https://img.freepik.com/premium-vector/blue-person-with-blue-logo_809378-240.jpg?w=826",
    profileName: "Behance",
    title: [
      "Showcasing creative work",
      "Showcasing creative work",
      "Showcasing creative work",
    ],
    linkLabel: "Read More",
    linkSrc: "https://www.behance.net/",
    storyImg:
      "https://img.freepik.com/premium-photo/chocolate-brownies-with-chocolate-ice-cream_1339-17809.jpg?w=1380",
  },
  {
    profileImg:
      "https://img.freepik.com/premium-vector/blue-person-with-blue-logo_809378-240.jpg?w=826",
    profileName: "Behance",
    title: [
      "Showcasing creative work",
      "Showcasing creative work",
      "Showcasing creative work",
    ],
    linkLabel: "Read More",
    linkSrc: "https://www.behance.net/",
    storyImg:
      "https://img.freepik.com/premium-photo/chocolate-brownies-with-chocolate-ice-cream_1339-17809.jpg?w=1380",
  },
  {
    profileImg:
      "https://img.freepik.com/premium-vector/blue-person-with-blue-logo_809378-240.jpg?w=826",
    profileName: "Behance",
    title: [
      "Showcasing creative work",
      "Showcasing creative work",
      "Showcasing creative work",
    ],
    linkLabel: "Read More",
    linkSrc: "https://www.behance.net/",
    storyImg:
      "https://img.freepik.com/premium-photo/chocolate-brownies-with-chocolate-ice-cream_1339-17809.jpg?w=1380",
  },
  {
    profileImg:
      "https://img.freepik.com/premium-vector/blue-person-with-blue-logo_809378-240.jpg?w=826",
    profileName: "Behance",
    title: [
      "Showcasing creative work",
      "Showcasing creative work",
      "Showcasing creative work",
    ],
    linkLabel: "Read More",
    linkSrc: "https://www.behance.net/",
    storyImg:
      "https://img.freepik.com/premium-photo/chocolate-brownies-with-chocolate-ice-cream_1339-17809.jpg?w=1380",
  },
  {
    profileImg:
      "https://img.freepik.com/premium-vector/blue-person-with-blue-logo_809378-240.jpg?w=826",
    profileName: "Behance",
    title: [
      "Showcasing creative work",
      "Showcasing creative work",
      "Showcasing creative work",
    ],
    linkLabel: "Read More",
    linkSrc: "https://www.behance.net/",
    storyImg:
      "https://img.freepik.com/premium-photo/chocolate-brownies-with-chocolate-ice-cream_1339-17809.jpg?w=1380",
  },
];






onMounted(() => {
  gsap.to(".box", { x: 100, duration: 1 });

  let activeStory = 0;
const storyDuration = 4000;
const contentUpdateDelay = 0.4;
let direction = "next";
let storyTimeout;

const cursor = document.querySelector(".cursor");
const cursorText = cursor.querySelector("p");

console.log(cursorText);


const changeStory = () =>{
    const previousStory = activeStory;
    if(direction === "next"){
        activeStory = (activeStory + 1) % stories.length;
    } else{
        activeStory = (activeStory - 1 + stories.length) % stories.length;
    }

    const story = stories[activeStory];

    gsap.to(".profile-icon p", { y: direction === "next" ? 24 : -24,  duration: 0.5, delay: contentUpdateDelay });


}





});
</script>

<style lang="scss" scoped>
.container {
  width: 100lvw;
  height: 100vh;
  overflow: hidden;
  background: black;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1,
p,
a {
  color: white;
  text-decoration: none;
  font-weight: 400;
}
h1 {
  font-size: 36px;
}

p,
a {
  font-size: 16px;
}

.cursor {
  position: absolute;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 100%;
  z-index: 2;
  pointer-events: none;

  p {
    font-size: 12px;
    text-transform: uppercase;
  }
}

.story-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  opacity: 0.5;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.story-content {
  position: absolute;
  padding: 4em 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .indices {
    align-items: center;

    width: 100%;
    height: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.25em;

    .index {
      position: relative;
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.25);

      .index-highlight {
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        background: white;
        transform: scaleX(100%);
      }
    }
  }

  .profile {
    width: 100%;
    height: 60px;
    display: flex;
    gap: 1em;
    align-items: center;
  }

  .profile-icon {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
  }

  .profile-name {
    position: relative;
    width: 200px;
    height: 20px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);

    p {
      position: absolute;
      top: 0;
    }
  }

  .title-row {
    position: relative;
    width: 100%;
    height: 42px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);

    h1 {
      position: absolute;
      top: 0;
    }
  }

  .link {
    position: relative;
    width: max-content;
    margin: 2em 0;
  }

  .link::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 1px;
    background: white;
  }
}
</style>

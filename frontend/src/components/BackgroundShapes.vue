<template>
  <div class="animated-bg">
    <svg
      v-for="(shape, i) in shapes"
      :key="i"
      class="shape"
      :class="shape.type"
      :style="{
        left: shape.left + '%',
        width: shape.size + 'px',
        height: shape.size + 'px',
        animationDelay: shape.delay + 's',
        animationDuration: shape.duration + 's'
      }"
      viewBox="0 0 20 20"
    >
      <template v-if="shape.type === 'square'">
        <rect width="20" height="20" />
      </template>
      <template v-else-if="shape.type === 'circle'">
        <circle cx="10" cy="10" r="10" />
      </template>
      <template v-else>
        <polygon points="10,0 20,20 0,20" />
      </template>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'BackgroundShapes',
  data() {
    return { shapes: [] };
  },
  created() {
    const types = ['square', 'circle', 'triangle'];
    for (let i = 0; i < 12; i++) {
      this.shapes.push({
        type: types[i % 3],
        left: Math.random() * 100,
        size: 20 + Math.random() * 20,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
      });
    }
  },
};
</script>

<style scoped>
.animated-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.shape {
  position: absolute;
  bottom: -40px;
  fill: #6a0dad;
  opacity: 0.6;
  animation-name: move-diagonal, color-change;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@keyframes move-diagonal {
  from {
    transform: translate(0, 0) rotate(0deg);
  }
  to {
    transform: translate(120vw, -120vh) rotate(360deg);
  }
}
@keyframes color-change {
  0% {
    fill: #6a0dad;
  }
  50% {
    fill: #00bfff;
  }
  100% {
    fill: #6a0dad;
  }
}
</style>

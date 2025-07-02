<template>
  <v-btn v-bind="$attrs" class="modern-btn" @click="$emit('click', $event)">
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'ModernButton',
  inheritAttrs: false,
};
</script>

<style scoped>
.modern-btn {
  background: linear-gradient(135deg, #00f0ff, #7f00ff);
  color: white;
  font-weight: bold;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.modern-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 0 12px #7f00ff;
}
@media (max-width: 768px) {
  .modern-btn {
    width: 100%;
    margin: 5px auto;
  }
}
</style>

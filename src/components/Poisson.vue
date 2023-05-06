<template>
  <div class="poisson"></div>
</template>

<script setup>
import { Poisson } from '@/assets/js/Poisson';

onMounted(() => {
  new Poisson();
});
</script>
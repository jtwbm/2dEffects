<template>
  <div class="poisson"></div>
</template>

<script setup>
import { TD } from '@/assets/js/TD';
import { Poisson } from '@/assets/js/Poisson';
import { Point } from '@/assets/js/Point';

// генерация холста внутри .poisson
// разные типы модулей для generate и particles
// убрать p5 из зависимостей
// генерация чанков по умолчанию, если не переданы модули

onMounted(() => {
  new TD({
    radius: 30,
    generate: {
      module: Poisson,
      settings: {},
    },
    particles: {
      module: Point,
      settings: {},
    },
  });
});
</script>
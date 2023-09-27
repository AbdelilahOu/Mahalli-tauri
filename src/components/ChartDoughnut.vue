<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

defineProps<{
  chartData: {
    labels: string[];
    datasets: { [key: string]: any; data: number[] }[];
  };
  chartOptions: Record<any, any>;
  id: string;
}>();

ChartJS.register(ArcElement, Tooltip, Legend);
</script>

<template>
  <Doughnut :options="chartOptions" :data="chartData" />
</template>

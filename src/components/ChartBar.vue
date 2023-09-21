<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

defineProps<{
  chartData: {
    labels: string[];
    datasets: { [key: string]: any; data: number[] }[];
  };
  chartOptions: Record<any, any>;
  id: string;
}>();

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
</script>

<template><Bar :options="chartOptions" :data="chartData" /></template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  LineController,
  Filler,
  PointElement,
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
  LineController,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  Title,
);
</script>

<template>
  <Line :options="chartOptions" :data="chartData" />
</template>

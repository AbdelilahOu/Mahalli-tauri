import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { defineComponent, type PropType } from "vue";
import { Doughnut } from "vue-chartjs";

export const ChartDoughnut = defineComponent({
  name: "ChartDoughnut",
  props: {
    chartData: {
      type: Object as PropType<{
        labels: string[];
        datasets: { [key: string]: any; data: number[] }[];
      }>,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    ChartJS.register(ArcElement, Tooltip, Legend);

    return () => (
      <Doughnut options={props.chartOptions} data={props.chartData} />
    );
  },
});

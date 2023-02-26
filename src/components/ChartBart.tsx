import { defineComponent, type PropType } from "vue";
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

export const ChartBar = defineComponent({
  name: "ChartBar",
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
    ChartJS.register(
      Title,
      Tooltip,
      Legend,
      BarElement,
      CategoryScale,
      LinearScale
    );

    return () => (
      <Bar id={props.id} options={props.chartOptions} data={props.chartData} />
    );
  },
});

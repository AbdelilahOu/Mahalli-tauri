export const chartOptions = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "rgba(25,23,17,0.6)",
        textStrokeWidth: 10,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        lineWidth: 1,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "rgba(25,23,17,0.6)",
        min: 0,
        textStrokeWidth: 1,
        padding: 10,
      },
    },
  },
};

export const optionsWoTicks = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "rgba(25,23,17,0.6)",
        textStrokeWidth: 10,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        lineWidth: 0.5,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      ticks: {
        display: false,
        // color: "rgba(25,23,17,0.6)",
        // min: 0,
        // textStrokeWidth: 1,
        // padding: 10,
      },
    },
  },
};

class OverallGraph {
  constructor() {}

  getConfig(data) {
    return {
      type: "line",
      data: {
        datasets: data,
      },
      options: {
        parsing: {
          xAxisKey: "day",
          yAxisKey: "dist",
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
          },
          y: {
            type: "time",
            time: {
              unit: "minute"
            },
          },
        },
        radius: 7,
        plugins: {
          title: {
            display: true,
            text: "Overall score",
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy",
            },
            pan: {
              enabled: true,
              mode: "xy",
            },
          },
        },
      },
    };
  }
}

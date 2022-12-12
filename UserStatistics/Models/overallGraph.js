class OverallGraph {
  constructor() {}

  getConfig(data) {
    console.log(data);
    return {
      type: "bubble",
      data: {
        datasets: data,
      },
      options: {
        parsing: {
          xAxisKey: "day",
          yAxisKey: "dist",
        },
        radius: 7,
        pointStyle: 'circle',
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

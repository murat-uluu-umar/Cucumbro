class OverallGraph {
  constructor() {
    this.data = {
      labels: labels,
      datasets: [],
    };

    this.config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Overall statistics",
          },
        },
        interaction: {
          intersect: true,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Value",
            },
          },
        },
      },
    };
  }

  getGraphTemplate(label, data) {
    return {
      label: label,
      data: data,
      fill: false,
      tension: 0.1,
      cubicInterpolationMode: "monotone",
    };
  }
}

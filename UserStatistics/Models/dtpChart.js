class DtpChart {
  constructor(database) {
    this.database = database;
    this.onUpdate = null;
  }
  getConfig() {
    return {
      type: "polarArea",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
    };
  }
  update(total, palette) {
    if (day !== null) {
      var data = this.prepare(total);
      console.log(data);
      var config = {
        type: "polarArea",
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
              backgroundColor: palette,
            },
          ],
        },
      };
      if (this.onUpdate) this.onUpdate(config);
    }
  }

  prepare(total) {
    var otherTime = this.toHours(57600000 - total.task + total.rest + total.divert);
    return {
      Tasks: this.toHours(total.task),
      Rests: this.toHours(total.rest),
      Diverts: this.toHours(total.divert),
      Other: otherTime,
    };
  }

  toHours(milliseconds) {
    return Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
  }
}

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
  update(total) {
    if (day !== null) {
      var data = this.prepare(total);
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
    var otherTime = this.toMinutes(57600000 - total.task + total.rest + total.divert);
    return {
      Tasks: this.toMinutes(total.task),
      Rests: this.toMinutes(total.rest),
      Diverts: this.toMinutes(total.divert),
      Other: otherTime,
    };
  }

  toMinutes(milliseconds) {
    return Math.floor(milliseconds / 60000)
  }
}

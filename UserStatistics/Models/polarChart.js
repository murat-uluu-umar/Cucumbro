class PolarChart {
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
            data: []
          },
        ],
      },
      plugins: {
        colors: {
          enabled: true
        }
      },
    };
  }
  update(day) {
    this.database.openDataBase((store) => {
      if (day !== null) {
        var request = store.index("Days-Tasks").getAll([day, "task"]);
        request.onsuccess = (event) => {
          var data = this.preapare(event.target.result);
          var config = {
            type: "polarArea",
            data: {
              labels: Object.keys(data),
              datasets: [
                {
                  data: Object.values(data),
                  backgroundColor: palette("tol", Object.keys(data).length).map(
                    function (hex) {
                      return "#" + hex;
                    }
                  )
                },
              ],
            },
            plugins: {
              colors: {
                enabled: true
              }
            },
          };
          if (this.onUpdate) this.onUpdate(config);
        };
      }
    });
  }
  preapare(result) {
    var data = {};
    result.forEach((element) => {
      var amount =
        typeof data[element.subject] === "number" ? data[element.subject] : 0;
      (data[element.subject] =
        (new Date(element.amount.dist).getTime() % (1000 * 60 * 60)) /
        (1000 * 60)),
        +amount;
    });
    return data;
  }
}

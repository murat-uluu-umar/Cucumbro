class DayGraph {
  constructor(database) {
    this.database = database;
    this.onUpdate = null;
  }

  getConfig() {
    return {
      type: "bar",
      data: {
        datasets: [],
      },
    };
  }

  update(day, palette) {
    console.log(day, palette);
    this.database.openDataBase((store) => {
      if (day !== null) {
        var request = store.index("Days").getAll([day]);
        request.onsuccess = (event) => {
          var data = this.preapare(event.target.result);
          if (this.onUpdate) this.onUpdate(data);
        };
      }
    });
  }
  preapare(result) {
    var data = [];
    var total = {
      task: 0,
      rest: 0,
      divert: 0,
    };
    var item = {
      diverts: [],
    };
    result.forEach((p) => {
      if (p.type === "rest") {
        item.rest = this.normalize(p.amount);
        data.push(item);
        item = {
          diverts: [],
        };
      } else if (p.type === "task") {
        item.subject = p.subject;
        item.amount = this.normalize(p.amount);
      } else if (p.type === "divert") {
        item.diverts.push(this.normalize(p.amount));
      }
      total[p.type] += p.amount.dist;
    });
    return { data, total };
  }

  normalize(amount) {
    return {
      start: new Date(amount.start).toLocaleTimeString(),
      end: new Date(amount.end).toLocaleTimeString(),
      dist: new Date(
        amount.dist + new Date().getTimezoneOffset() * 60000
      ).toLocaleTimeString(),
    };
  }
}

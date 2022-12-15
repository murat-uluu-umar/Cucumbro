class Calendar {
  constructor() {
    this.date = new Date();
    this.selected = null;
    this.onSelected = null;
    this.hightlighted = {};
  }
  getDays() {
    var date = new Date(this.date.getTime());
    var month = date.getMonth();
    var year = date.getFullYear();
    var up = new Date(year, month+1);
    up.setDate(0);
    this.voids = new Date(year, month, 1).getDay();
    var days = [];
    for (var i = 0; i < this.voids; i++) days.push("none");
    for (var i = 1; i <= up.getDate(); i++) {
      var day = new Date(year, month, i);
      days.push(day);
    }
    this.days = days;
    return days;
  }
  getTitle() {
    return this.date.getFullYear() + " " + this.date.toLocaleString("en-US", { month: "long" });
  }
  forward() {
    this.date.setMonth(this.date.getMonth() + 1);
  }
  backward() {
    this.date.setMonth(this.date.getMonth() - 1);
  }
  select(index) {
    if (this.days) this.selected = this.days[this.voids + index];
    if (typeof this.onSelected == 'function') this.onSelected(this.selected);
  }
  initHightlightDays(data) {
    data.forEach(element => {
      console.log(element);
      this.hightlighted[element.day] = true;      
    });
  }
}

const DATABASE = "WarptimeDB";
const DAYSDATA = "DAYSDATA";
const SUBJECTS = "SUBJECTS";
const VERSION = 6;

class DataBase {
  constructor() {}

  openDataBase(callback) {
    var request = this.dataBase();
    request.onsuccess = function () {
      const db = request.result;

      const transaction = db.transaction(DAYSDATA, "readwrite");

      const store = transaction.objectStore(DAYSDATA);
      callback(store);

      transaction.oncomplete = function () {
        db.close();
      };
    };
  }

  dataBase() {
    const request = indexedDB.open(DATABASE, VERSION);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };
    request.onupgradeneeded = function () {
      const db = request.result;

      const store = db.createObjectStore(DAYSDATA, {
        keyPath: "id",
        autoIncrement: true,
      });

      store.createIndex("Days", ["day"], { unique: false });
      store.createIndex("Subjects", ["subject"], { unique: false });
      store.createIndex("Tasks", ["type"], { unique: false });
      store.createIndex("Subjects-Tasks", ["subject", "type"], {
        unique: false,
      });
      store.createIndex("Days-Tasks", ["day", "type"], {
        unique: false,
      });
    };
    return request;
  }
  loadData(result) {
    var data = {};
    var days = [];
    var day = -1;
    for (let i = 0; i < result.length; i++) {
      var day = result[i].day;
      days.push(day);
      while (i < result.length && day === result[i].day) {
        var subj = result[i].subject;
        var piece = {
          start: result[i].amount.start,
          dist: result[i].amount.dist,
        };
        var type = result[i].type;
        data[type] = typeof data[type] === "object" ? data[type] : [];
        data[type][subj] =
          typeof data[type][subj] === "object" ? data[type][subj] : [];
        data[type][subj].push(piece);
        i++;
      }
    }
    return data;
  }
}

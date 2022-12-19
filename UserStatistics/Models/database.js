const DATABASE = "WarptimeDB";
const DAYSDATA = "DAYSDATA";
const SUBJECTS = "SUBJECTS";
const VERSION = 6;

class DataBase {
  constructor() {
    this.indexedDataBase = null;
  }

  openDataBase(callback, idb = null) {
    var request = this.dataBase();
    request.onsuccess = function () {
      const db = request.result;
      if (idb) idb(db)

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
        if (result[i].type == "task") {
          var subj = result[i].subject;
          var piece = {
            start: result[i].amount.start,
            dist: Math.floor(result[i].amount.dist / 60000),
          };
          data[subj] = typeof data[subj] === "object" ? data[subj] : [];
          data[subj].push(piece);
        }
        i++;
      }
    }
    return data;
  }
  randomDataSet(days, store) {
    var subjects = [
      "English",
      "Programming",
      "Art",
      "Physics",
      "Math",
      "Data Sciense",
      "Game Dev",
      "Chemistry",
      "Biology",
      "Literature",
    ];
    for (let i = 0; i <= days; i++) {
      for (let j = 0; j < Math.floor(Math.random() * i); j++) {
        var start =
          new Date(Date.now() + i * 86400000).getTime() +
          ((57600000 + Math.floor(Math.random() * 57600000)) % 57600000);
        var end = start + Math.floor(Math.random() * 14400000);
        var item = {
          day: new Date(Date.now() + i * 86400000).toLocaleDateString(),
          type: ["task", "divert", "rest"][Math.floor(Math.random() * 3)],
          subject: subjects[Math.floor(Math.random() * 10)],
          amount: {
            start: start,
            end: end,
            dist: end - start,
          },
        };
        store.put(item);
      }
    }
  }
}

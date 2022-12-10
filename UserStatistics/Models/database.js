const DATABASE = "WarptimeDB";
const DAYSDATA = "DAYSDATA";
const SUBJECTS = "SUBJECTS";
const VERSION = 3;

class DataBase {
  constructor() {}

  openDataBase(callback) {
    const request = indexedDB.open(DATABASE, VERSION);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };
    request.onupgradeneeded = function () {
      const db = request.result;

      const store = db.createObjectStore(DAYSDATA, { keyPath: "id", autoIncrement:true });

      store.createIndex("Days", ["day"], { unique: false });
      store.createIndex("Subjects", ["subject"], { unique: false });
      store.createIndex("Tasks", ["task"], { unique: false });
      store.createIndex("Subjects-Tasks", ["subject", "task"], { unique: false });
    };
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

  openSubjectsDataBase (callback) {
    const request = indexedDB.open(DATABASE, VERSION);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };
    request.onupgradeneeded = function () {
      const db = request.result;

      const store = db.createObjectStore(SUBJECTS, { keyPath: "subject"});

      store.createIndex("Subject", ["subject"], { unique: false });
    };
    request.onsuccess = function () {

      const db = request.result;

      const transaction = db.transaction(SUBJECTS, "readwrite");

      const store = transaction.objectStore(SUBJECTS);
      callback(store);
      
      transaction.oncomplete = function () {
        db.close();
      };
    };
  }
}

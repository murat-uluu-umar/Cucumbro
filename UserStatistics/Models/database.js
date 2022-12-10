class DataBase {
  constructor() {}

  openDataBase(name, storeName, version, callback) {
    const request = indexedDB.open(name, version);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };
    request.onupgradeneeded = function () {
      const db = request.result;

      const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement:true });

      store.createIndex("subject", ["subjects"], { unique: false });
    };
    request.onsuccess = function () {
      console.log("Database opened successfully");

      const db = request.result;

      const transaction = db.transaction(storeName, "readwrite");

      const store = transaction.objectStore(storeName);
      callback(store);
      
      transaction.oncomplete = function () {
        db.close();
      };
    };
  }
}

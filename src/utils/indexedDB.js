import { openDB } from "idb";

const DB_NAME = "MoviesDB";
const DB_VERSION = 2;

const indexes = [
  { name: "title", keyPath: "title", options: { unique: false } },
  { name: "id", keyPath: "id", options: { unique: false } },
  { name: "poster_path", keyPath: "poster_path", options: { unique: false } },
  { name: "release_date", keyPath: "release_date", options: { unique: false } },
  { name: "vote_average", keyPath: "vote_average", options: { unique: false } },
  { name: "media_type", keyPath: "media_type", options: { unique: false } },
  { name: "playbackTime", keyPath: "playbackTime", options: { unique: false } },
  {
    name: "movieDuration",
    keyPath: "movieDuration",
    options: { unique: false },
  },
];

const createAllIndexes = (moviesStore) => {
  indexes.forEach((index) => {
    if (!moviesStore.indexNames.contains(index.name)) {
      moviesStore.createIndex(index.name, index.keyPath, index.options);
    }
  });
};
export const indexedDBInit = async () => {
  const upgradeDB = (db, oldVersion, newVersion, transaction) => {
    if (oldVersion < newVersion) {
      if (!db.objectStoreNames.contains("movies")) {
        const moviesStore = db.createObjectStore("movies", {
          keyPath: "uid",
        });
        createAllIndexes(moviesStore);
      } else {
        const moviesStore = transaction.objectStore("movies");
        createAllIndexes(moviesStore);
      }
    }
  };
  const db = await openDB(DB_NAME, DB_VERSION, { upgrade: upgradeDB });
  return db;
};

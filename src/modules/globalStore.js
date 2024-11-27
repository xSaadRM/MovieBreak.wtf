const globalStore = {};
globalStore.selectedMovie = {};

let { selectedMovie } = globalStore;

selectedMovie.Set = (value) => {
  selectedMovie = { ...value, Set: selectedMovie.Set };
};

export { selectedMovie };
export default globalStore;

import DisableDevtool from "disable-devtool";
import { useEffect, useReducer, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import SearchPage from "./components/SearchPage.jsx";
import CastPage from "./components/CastPage.jsx";
import MovieDescription from "./pages/MovieDescription.jsx";
import HomePage from "./pages/Home.jsx";
import WatchPage from "./pages/WatchPage.jsx";
import { reducer, initialState } from "./reducer/reducer.js";
import FloatingSocials from "./components/FloatingSocial.jsx";
import { indexedDBInit } from "./utils/indexedDB.js";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [groupedMovies, setGroupedMovies] = useState({ shows: {}, movies: [] });
  
  const getallMovies = async () => {
    const db = await indexedDBInit();
    const tx = db.transaction("movies", "readonly");
    const store = tx.objectStore("movies");
    const allMovies = await store.getAll();
    const tvShows = allMovies.filter((movie) => {
      return movie.media_type === "tv";
    });
    const moviesArray = allMovies.filter((movie) => {
      return movie.media_type === "movie";
    });
    let groupedTvShows = {};
    tvShows.forEach((show) => {
      if (!groupedTvShows[show.id]) {
        groupedTvShows[show.id] = [];
      }
      groupedTvShows[show.id].push(show);
    }, {});
    setGroupedMovies({ movies: moviesArray, shows: groupedTvShows });
  };
  useEffect(() => {
    getallMovies();
    DisableDevtool({
      ondevtoolopen: () => {
        window.location.href = "/sonic.html";
      },
    });
  }, []);

  return (
    <Router>
      <FloatingSocials />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              getallMovies={getallMovies}
              groupedMovies={groupedMovies}
              state={state}
              dispatch={dispatch}
            />
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          groupedMovies={groupedMovies}
          path="/:mediaType/:movieID/:season?/"
          element={<MovieDescription state={state} dispatch={dispatch} />}
        />
        <Route
          path="/:mediaType/:movieID/:season?/:ep?/"
          element={<WatchPage state={state} dispatch={dispatch} />}
        ></Route>
        <Route path="/cast/:personID" element={<CastPage />} />
      </Routes>
    </Router>
  );
}

export default App;

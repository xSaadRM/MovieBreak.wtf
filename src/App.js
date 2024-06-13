import DisableDevtool from "disable-devtool";
import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import SearchPage from "./components/SearchPage.jsx";
import CastPage from "./components/CastPage.jsx";
import MovieDescription from "./pages/MovieDescription.jsx";
import HomePage from "./pages/Home.jsx";
import WatchPage from "./pages/WatchPage.jsx";
import { reducer, initialState } from "./reducer/reducer.js";
import FloatingSocials from "./components/FloatingSocial.jsx";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
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
          element={<HomePage state={state} dispatch={dispatch} />}
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
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

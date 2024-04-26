import DisableDevtool from "disable-devtool";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import SearchPage from "./components/SearchPage.jsx";
import CastPage from "./components/CastPage.jsx";
import MovieDescription from "./pages/MovieDescription.jsx";
import HomePage from "./pages/Home.jsx";
import WatchPage from "./pages/WatchPage.jsx";

function App() {
  const [devtoolsDetected, setDevtoolsDetected] = useState(false);

  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        if (!devtoolsDetected) {
          setDevtoolsDetected(true);
          window.location.href = "/sonic.html";
        }
      },
    });
  }, [devtoolsDetected]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/:mediaType/:movieID/:season?/"
          element={<MovieDescription />}
        />
        <Route
          path="/:mediaType/:movieID/:season?/:ep?/"
          element={<WatchPage />}
        ></Route>
        <Route path="/cast/:personID" element={<CastPage />} />
      </Routes>
    </Router>
  );
}

export default App;

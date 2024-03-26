import DisableDevtool from "disable-devtool";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieDescription from "./components/MovieDescription.jsx";
import HomePage from "./components/Home.jsx";
import "./styles/App.css";
import SearchPage from "./components/SearchPage.jsx";

function App() {
  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        window.location.href = "/sonic.html";
      },
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<HomePage />} />
        <Route
          path="/:mediaType/:movieID/:season?/:ep?"
          element={<MovieDescription />}
        />
      </Routes>
    </Router>
  );
}

export default App;

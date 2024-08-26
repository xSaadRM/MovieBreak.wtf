import { Route, Router } from "@solidjs/router";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import About from "./Pages/About";
import MovieInfos from "./Pages/MovieInfo";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Route path={"/"} component={Home} />
        <Route path={"/info/:mediaType/:id"} component={MovieInfos} />
        <Route path="/about" component={About} />
      </Router>
    </>
  );
}

export default App;

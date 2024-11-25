import { Route, Router } from "@solidjs/router";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Info from "./Pages/Info";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Route path={"/"} component={Home} />
        <Route path={"/info/:mediaType/:id"} component={Info} />
        <Route path="/about" component={About} />
      </Router>
    </>
  );
}

export default App;

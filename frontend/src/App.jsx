import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import Home from "./Home.jsx";
import AllBookings from "./AllBookings.jsx";

import {backend} from "./data.json";
import { useState } from "react/cjs/react.development";

function App() {

  const [sent, setSent] = useState(false);

  const handleResetAll = ()=>{
    setSent(true);
    fetch(backend+"reset",{
        method: "delete",
        headers:{
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin':'*'
        },
      })
      .then(req=> req.json())
      .then(data=> {
        if(data.data.status)
          alert("Database is set to its initial state.");
        setSent(false);
      }).catch(e=> {
        setSent(false);
        alert("Something not right please try again");
      });
  }

  return (
    <Router>
      {sent && <div className="top-0 bottom-0 start-0 end-0 position-fixed text-white d-flex justify-content-center align-items-center" style={{backgroundColor: "#00000069", zIndex: 10000}}>
        Please await till proccessing...
      </div>}
      {/* nav bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-0 position-fixed w-100">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"><img src="https://img.icons8.com/emoji/1000/000000/train-emoji.png" style={{width: 50, objectFit: "contain"}}/></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-start" id="navbarSupportedContent">

            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/bookigs">Bookings</Link>
              </li>
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Book</Link>
              </li>
            </ul>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="link-warning text-decoration-none btn" type="button" onClick={handleResetAll}>Reset database</button>
              </li>
            </ul>

          </div>
        </div>
      </nav>

      <div className="d-flex justify-content-center align-items-center" style={{minHeight: "calc(100vh - 60px)", marginTop: 60}}>
        <div className="d-flex justify-content-center align-items-center w-100 flex-column" style={{maxWidth: 1260}}>

          <Switch>
            <Route path="/bookigs" component={AllBookings} />
            <Route path="*" component={Home} />
          </Switch>
      
        </div>
      </div>
    </Router>
  );
}

export default App;

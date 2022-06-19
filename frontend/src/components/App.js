import "./App.css";
import {
  BrowserRouter as Router,Switch,Route, NavLink} from 'react-router-dom'
import Login from "./Login";
import Upload from "./Upload";
import Trainee from "./Trainee";
import Staff from "./Staff";
import { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";


const App = () => {

  const [isLogged, setIsLogged] = useState(false);
  let history = useHistory();


  useEffect(()=>{
    let tk = localStorage.getItem('token')
    if(tk !== "null"){
      let userData = JSON.parse(localStorage.getItem('user_type'))
      let is_staff = userData.is_staff
      setIsLogged(true)
      if(is_staff){
          <Redirect to="/staff" />
      }
      else{
          <Redirect to="/trainee" />
      }
    }
    else{
      setIsLogged(false)
    }
  },[])

  function logOut(){
    localStorage.setItem('token', "null")
    setIsLogged(false)
    // return <Redirect to="/" />
    // return <Redirect push to="/" />
    window.location.href = "http://localhost:3000/"
  }


  return (
    <Router>
      <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* <NavLink className='nav-link' to="/">Home</NavLink> */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              {isLogged?
              <button type="button" onClick={logOut} className="btn btn-secondary">Logout</button>
                :<NavLink className='nav-link' to="/">Login</NavLink>
              }
            </li>
            {/* <li className="nav-item active">
              <NavLink className='nav-link' to="/upload">Upload</NavLink>
            </li>
            <li className="nav-item active">
              <NavLink className='nav-link' to="/trainee">Trainee</NavLink>
            </li> */}
          </ul>
        </div>
      </nav>
          {/* <NavLink to="/">Home</NavLink>
          <NavLink to="/Login">Login</NavLink>
          <NavLink to="/Upload">Upload</NavLink> */}
        <Switch>
          <Route exact path="/" children={<Login setLogged={setIsLogged}/>} />
          {/* <Route exact path="/login" children={<Login/>} /> */}
          <Route exact path="/upload" children={<Upload/>} />
          <Route exact path="/trainee" children={<Trainee/>} />
          <Route exact path="/staff" children={<Staff/>} />
        </Switch>
      </div>
    </Router>
  );


};

export default App;

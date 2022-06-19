import React from 'react'
import axios from "axios";

import { useHistory } from "react-router-dom";


const homeClient = axios.create({
    baseURL: "http://localhost:8000/login"
  });

const URL = 'http://192.168.0.171:8000';

export default function Login({setLogged}) {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [msg, setMsg] = React.useState(undefined)
    let history = useHistory();

    function handleSubmit(e){
        e.preventDefault()
        setIsLoading(true)
        console.log("VALS")
        console.log(username)
        console.log(password)
        axios.post(`${URL}/login/`,{
            username: username,
            password: password,
          })
          .then(function (response) {
            console.log(response.data.token);
            let token = response.data.token;
            localStorage.setItem('token', response.data.token);
            axios.post(`${URL}/api/get_user_detail`,{},
            {
                headers: {
                  "Authorization" : `Token ${token}`
                }
                }).then(function (res){
                    console.log(res.data);
                    localStorage.setItem('user_type', JSON.stringify(res.data));
                    let is_staff = res.data.is_staff
                    setLogged(true);
                    setIsLoading(false)
                    if(is_staff){
                        history.push("/staff");
                    }
                    else{
                        history.push("/trainee");
                    }
                }).catch(function (error){
                    setIsLoading(false)
                    console.log(error);
                })
          })
          .catch(function (error) {
            setIsLoading(false)
            console.log(error);
            if(error.response.status == 400){
                setMsg("Invalid username or password.")
            }
          });
    }
    function handleUsernameChange(e){
        setUsername(e.target.value)
    }
    function handlePasswordChange(e){
        setPassword(e.target.value)
    }

  return (
    <div className='container' style={{maxWidth:400}} onSubmit={handleSubmit}>
        <form>
        <div className="form-group">
          <label >Username</label>
          <input onChange={handleUsernameChange} value={username} type="text" className="form-control" id="exampleusername" placeholder="Enter username"/>  
        </div>
        <br />
        <div className="form-group">
          <label >Password</label>
          <input onChange={handlePasswordChange} value={password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
        </div>
        <br/>
        {isLoading && (
        // <img  height='110px' className="card-img-top" src="https://giphy.com/gifs/mashable-3oEjI6SIIHBdRxXI40" alt="Card cap"/>
        <p>Loading.....</p>
        )}
        {msg!==undefined&&
        <p>{msg}</p>
    }

        <hr/>
        <button type="button" onClick={handleSubmit} className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

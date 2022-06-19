import React from 'react'
import "./App.css";
import { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import axios from "axios";
import { H4 } from '@blueprintjs/core';


const client = create("https://ipfs.infura.io:5001/api/v0");

const URL = 'http://192.168.0.171:8000';


export default function Upload() {
    const [file, setFile] = useState(null);
    const [urlArr, setUrlArr] = useState([]);
    const [userid, setUserId] = useState(-1);
    const [fn, setFn] = useState("");
    const [ln, setln] = useState("");
    const [token, setToken] = useState("");
    const [res, setRes] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("")

    useEffect(()=>{
        let uid = localStorage.getItem('user_id')
        let f = localStorage.getItem('fn')
        let l = localStorage.getItem('ln')
        let tk = localStorage.getItem('token')
        console.log(tk)
        setToken(tk)
        setUserId(uid)
        setFn(f)
        setln(l)
    },[])

    function sendUrl(ur){
        setIsLoading(true);
        axios.post(`${URL}/api/create_new_nft`,{
            "user_id": userid,
            "url": ur
        },{
            headers:{
                "Authorization" : `Token ${token}`
            }
        }).then(function(res){
            console.log(res.data);
            setMessage(res.data.message)
            setIsLoading(false);
        }).catch(function(error){
            console.log(error)
            setIsLoading(false);
        })
    }
  
    const retrieveFile = (e) => {
      const data = e.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
  
      reader.onloadend = () => {
        setFile(Buffer(reader.result));
      };
  
      e.preventDefault();
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const created = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        console.log(url);
        console.log(created.path);
        setUrlArr((prev) => [...prev, url]);
        sendUrl(url);
      } catch (error) {
        console.log(error.message);
      }
    };
  
    return (
      <div className="App">
        <header className="App-header">Upload Image for {fn} {ln}</header>
  
        <div className="main">
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={retrieveFile} />
            <button type="submit" className="button">Submit</button>
          </form>
        </div>
        {isLoading && <p>Loading......</p>}
        {message.length!=0 && <h4>{message}</h4>}
        <div className="display">
          {urlArr.length !== 0
            ? urlArr.map((el,index) =>(
                <div className="card" style={{width: '18rem'}} key={`el${index}`}>
                    <img src={el} alt="nfts" className="card-img-top"/>
                </div>
            ))
            : <h3>Upload data</h3>}
        </div>
      </div>
    );
}

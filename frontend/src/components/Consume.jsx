import React,{useEffect, useState} from 'react'

import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000/api/" 
});


export default function Consume() {
    const [posts, setPosts] = useState([]);
    useEffect(()=>{
        client.get().then((response)=>{
            console.log(response)
            setPosts(response.data.message)
        })
    },[])
    return (
        <div>
            <h1>API RESPONSE</h1>
            <h3>{posts}</h3>
        </div>
    )
}

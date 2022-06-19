import React from 'react'
import axios from "axios";
import { useHistory } from "react-router-dom";


const URL = 'http://192.168.0.171:8000';

export default function Staff() {

    const [token, setToken] = React.useState();
    const [isLoading, setIsLoading] = React.useState(false);
    const [requestList, setRequestList] = React.useState([]); 

    let history = useHistory();


    React.useEffect(()=>{
        let tk = localStorage.getItem('token')
        console.log(tk)
        setToken(tk)
        getList(tk)
    },[token])

    function getList(token){
        setIsLoading(true)
        axios.get(`${URL}/api/get_request_list`,{
            headers:{
                "Authorization" : `Token ${token}`
            }
        }).then(function(res){
            console.log(res.data)
            let requesters = res.data.requesters;
            let ls = [];
            for(let i = 0;i<requesters.length;i++){
                ls.push({
                    first_name: requesters[i].first_name,
                    last_name: requesters[i].last_name,
                    user_id: requesters[i].user_id
                })
            }
            console.log(ls)
            setRequestList(ls)
            setIsLoading(false)
        }).catch(function(error){
            console.log(error)
            setIsLoading(false)
        })
    }

    function btnClicked(user_id, fn, ln){
        console.log(user_id)
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('fn', fn);
        localStorage.setItem('ln', ln);
        history.push("/upload");
    }




  return (
    <div className='container'>
       {isLoading && <p>Loading.....</p>}
       { requestList.length > 0?
        <div className="row">
            {requestList.map( data =>(
                <div className="col-sm-6" key={data.user_id}>
                    <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{data.first_name} {data.last_name}</h5>
                        <p className="card-text">ID: {data.user_id}</p>
                        <button type="button" onClick={()=>btnClicked(data.user_id, data.first_name, data.last_name)} className="btn btn-primary">Button</button>
                    </div>
                    </div>
                </div>
            ))}
            {/* <div className="col-sm-6">
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Special title treatment</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <button type="button" className="btn btn-primary">Button</button>
                    
                </div>
                </div>
            </div> */}
        </div>
        :
        <div className="">
            <p>No request list found</p>
        </div>
        }
       {/* <div className="row">
        <div className="card" style={{width: '18rem', marginRight:"20px"}}>
                <img className="card-img-top" src="https://images.unsplash.com/photo-1655439191535-93f1d284f74d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Card cap"/>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <button type="button" className="btn btn-primary">Button</button>
                </div>
            </div>
            <p>{token}</p>
            <div className="card" style={{width: '18rem', marginRight:"20px"}}>
                <img className="card-img-top" src="https://images.unsplash.com/photo-1655439191535-93f1d284f74d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Card cap"/>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <button type="button" className="btn btn-primary">Button</button>
                </div>
            </div>
            <div className="card" style={{width: '18rem', marginRight:"20px"}}>
                <img className="card-img-top" src="https://images.unsplash.com/photo-1655439191535-93f1d284f74d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Card cap"/>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <button type="button" className="btn btn-primary">Button</button>
                </div>
            </div>
       </div> */}
    </div>
  )
}

import React from 'react'

import axios from "axios";


const URL = 'http://192.168.0.171:8000';


export default function Trainee() {

    const [token, setToken] = React.useState("");
    const [certCount,setCertCount] = React.useState(-1);
    const [certReady,setCertReady] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [claimed, setClaimed] = React.useState(false);
    const [msg, setMsg] = React.useState(undefined)

    const [address, setAddress] = React.useState(undefined);



    React.useEffect(()=>{
        let tk = localStorage.getItem('token')
        let userData = JSON.parse(localStorage.getItem('user_type'))
        let certC = userData.certificate_list
        let certR = userData.certificate_ready
        let cl = userData.claimed
        console.log(tk)
        console.log(userData) 
        setToken(tk)
        setCertCount(certC)
        setCertReady(certR)
        setClaimed(cl)
        setAddress(userData.asset['created-asset'].url)
    },[])

    function optIn(){
        setIsLoading(true)
        axios.get(`${URL}/api/optin_to_asset`, {
            headers:{
                "Authorization" : `Token ${token}`
            }
        }).then(function(res){
            console.log(res.data)
            // console.log(res.data.asset_info['created-asset'])
            // console.log(res.data.asset_info['created-asset'].url)
            setIsLoading(false)
            setAddress(res.data.asset_info['created-asset'].url)
            setClaimed(true)
            let userData = JSON.parse(localStorage.getItem('user_type'))
            userData.claimed = true
            localStorage.setItem('user_type', JSON.stringify(userData));
        }).catch(function(err){
            setIsLoading(false)
            console.log(err)
        })
    }
    function makeRequest(){
        axios.get(`${URL}/api/send_cirtificate_request`, {
            headers:{
                "Authorization" : `Token ${token}`
            }
        }).then(function (res){
            setMsg(res.data.message)
            setCertCount(100)
        }).catch(function(err){
            console.log(err)
        })
    }

  return (
    <div className='container'>
        {isLoading && <p>Loading......</p>}
        {msg !== undefined && <p>{msg}</p>}
        { certCount == 0 ?
            <button type="button" className="btn btn-primary">Send Request</button>
            :(
                <p>You can't send a request right now. Request already sent</p>
            )
        }
        <hr />
        { !claimed ? 
            <div className='col'>
                <p>Your certifate is ready, you can opt in.</p>
                <button onClick={optIn} type="button" className="btn btn-primary">OptIN</button>
            </div>
            :
            (
                <p>You already claimed your nft, you can not opt in.</p>
            )
        }
        <hr />
        
        {(address !== undefined) && (
        <div className="card" style={{width: '18rem'}}>
            <img src={address} alt="nfts" className="card-img-top"/>
        </div>
        )}
    </div>
  )
}

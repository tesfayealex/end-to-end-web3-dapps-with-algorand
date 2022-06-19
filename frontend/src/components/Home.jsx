import React from 'react'

export default function Home() {
  return (
    <div className='container'>
        <div className="card" style={{width: '18rem'}}>
        <img className="card-img-top" src="https://images.unsplash.com/photo-1655439191535-93f1d284f74d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="Card cap"/>
        <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
        </div>
        </div>
    </div>
  )
}

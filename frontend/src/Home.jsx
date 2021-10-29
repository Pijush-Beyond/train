import React, { createRef } from 'react'
import { useState } from 'react/cjs/react.development';

import {backend} from "./data.json";

export default function Home() {

  const [data, setData] = useState({name:"",ticketCount: 1});
  const [submitted, setSubmitted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const form = createRef();
  const [req, setReq] = useState(undefined);

  const handleBooking = (e)=>{
    e.preventDefault();
    if(req) return;
    setSubmitted(true);
    setBuffering(true);
    if(!form.current.checkValidity()){
      setBuffering(false);
    }else{
      setSubmitted(false);
      fetch(backend+"book",{
        method: "post",
        body: JSON.stringify(Object.fromEntries(new FormData(form.current))),
        headers:{
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin':'*'
        },
      }).then(res=> res.json())
      .then(data=>{
        setReq(data.data);
        setBuffering(false);
      })
      .catch(e=> {
        setBuffering(false);
        alert("Something not right please try again");
      });
    }
  }

  return (
    <>
      <form className={`m-4 p-4 rounded shadow ${submitted?"was-validated":""}`} noValidate ref={form} onSubmit={handleBooking} style={{width:"95%"}}>
        <div className="mb-3">
          <label htmlFor="name">Your name:</label>
          <input id="name" name="name" type="text" className="form-control" value={data.name} onInput={(e)=> setData({...data, name: e.target.value})} required placeholder="put your name here"  readOnly={Boolean(req)}/>
          <div className="invalid-feedback">Please provide your name.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="ticketCount">Number of ticket </label>
          <input id="ticketCount" name="ticketCount" type="number" className="form-control" min={1} max={7} value={data.ticketCount} onInput={(e)=> setData({...data, ticketCount: e.target.value})} required placeholder="number of ticket" readOnly={Boolean(req)}/>
          <div className="invalid-feedback">You can book 1 to 7 ticket at a time.</div>
        </div>

        {!req && !buffering && <button type="submit" className="btn btn-primary w-100">Book</button>}
        {!req && buffering && <button type="button" className="btn btn-primary w-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </button>}
        {req && <button type="button" className="btn btn-warning w-100" onClick={() => setReq(undefined)}>Book again</button>}
      </form>

      {req && <div className="m-4 p-4 shadow" style={{width:"95%"}}>
        <table className="w-100">
          <caption style={{captionSide: "top"}}>Booking details</caption>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{data.name}</td>
            </tr>
            <tr>
              <td>Number tickets</td>
              <td>{data.ticketCount}</td>
            </tr>
            {req.data && <tr>
              <td>Seat numners</td>
              <td>
                <table className="w-100">
                  <tbody>
                    <tr>
                      <th>Row</th>
                      <th>Column</th>
                    </tr>
                    {req.data.map((e,i)=> (
                      <tr key={i}>
                        <th>{e.row}</th>
                        <th>{e.seat}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>}
            {req.status && <tr>
              <td>Status</td>
              <td className="text-success">success</td>
            </tr>}
            {req.status && <tr>
              <th>Message</th>
              <th className="text-success">Ticket book successfull!!</th>
            </tr>}

            {!req.status && <tr>
              <td>Status</td>
              <td className="text-danger">unsuccessful</td>
            </tr>}
            {!req.status && <tr>
              <th>Message</th>
              <th className="text-danger">Train is full or not enough tickets!!</th>
            </tr>}
          </tbody>
        </table>
      </div>}
    </>
  )
}

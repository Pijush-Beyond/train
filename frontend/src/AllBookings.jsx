import React, { useEffect, useState } from 'react'

import {backend} from "./data.json";

export default function AllBookings() {

  const [data, setData] = useState([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(true);
    fetch(backend+"bookings").then(res=> res.json())
    .then(data=>{
      setData(data.data.data);
      setSent(false);
    })
    .catch(e=> {
      setSent(false);
      alert("Something not right please try again");
    });
  }, []);

  console.log(data);

  return (
    <>
      {sent && <div className="top-0 bottom-0 start-0 end-0 position-fixed text-white d-flex justify-content-center align-items-center" style={{backgroundColor: "#00000069", zIndex: 10000}}>
        Please await till proccessing...
      </div>}

      {data.length>0 && <div className="m-4 p-4 shadow min-hv-100" style={{width:"95%"}}>
        <table className="w-100">
          <caption style={{captionSide: "top"}}>All booking details</caption>

          <tbody>
            <tr>
              <th>Name</th>
              <th>Seat Row</th>
              <th>Seat Colmun</th>
            </tr>
            {
              data.map((e,i)=> (
                <tr key={i}>
                  <th>{e.name}</th>
                  <th>{e.seat}</th>
                  <th>{e.seat}</th>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>}

      {
        data.length<=0 &&
        <div>No booking yet</div>
      }
    </>
  )
}

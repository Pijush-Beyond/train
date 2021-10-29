import express from "express";
import db, {defaultValue} from "./database.js";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json());

app.post("/book", async (req,res)=>{
  const user = req.body['name'];
  let ticketCount = Number.parseInt(req.body['ticketCount']);

  if(user===undefined || ticketCount===undefined)
    res.status(403).json({
      data: undefined,
      error: "All fields are not present!!",
    })
  else{

    const data = await db;
    const bookedSeats = [];

    // for first priority seat bookings
    for(let row of data.row){
      if (row.leftToBook >= ticketCount && ticketCount > 0)
        for(let seat of row.seats)
          if (!seat.status && ticketCount>0){
            seat.status = true;
            seat.user = user;
            ticketCount--;
            row.leftToBook--;
            bookedSeats.push({row: row._id,seat: seat._id});
          }
    }

    // second priority seat bookings
    if(ticketCount>0){
      for(let row of data.row){
        if (row.leftToBook >0 && ticketCount > 0)
          for (let seat of row.seats)
            if (!seat.status && ticketCount > 0) {
              seat.status = true;
              seat.user = user;
              ticketCount--;
              row.leftToBook --;
              bookedSeats.push({ row: row._id, seat: seat._id })
            }
      }
    }

    if(ticketCount>0)
      res.json({ data: { status: false, data: undefined}, error: undefined});
    else{
      data.save();
      res.json({ data: { status: true, data: bookedSeats}, error: undefined});
    }

  }
})

app.get("/bookings",async(req,res)=>{
  const data = await db;
  const toSent = [];
  for(let row of data.row){
    for(let seat of row.seats)
      if (seat.status)
        toSent.push({ name: seat.user, row: row._id, seat: seat._id});
  }
  res.json({ data: { status: true, data: toSent}, error: undefined });
})

app.delete("/reset", async (req,res)=>{
  const data = await db;
  data.row = defaultValue;
  await data.save();
  res.json({ data: { status: true, data: undefined }, error: undefined });
})

app.listen(80, ()=> console.log("started on port"+80));
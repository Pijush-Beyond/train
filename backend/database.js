import mongoose from "mongoose";

const seats = new Array(7);
for(let i=0;i<7;i++) 
  seats[i]= {
      _id: i+1,
      user: undefined,
      status: false,
    };

export const defaultValue = new Array(12);
for (let i = 0; i < 11; i++)
  defaultValue[i] = {
    _id: i + 1,
    seats: JSON.parse(JSON.stringify(seats))
  };

defaultValue[11] = {
  _id:12,
  leftToBook:3,
  seats: (()=>{
    const seats = new Array(3);
    for (let i = 0; i < 3; i++)
      seats[i] = {
        _id: i + 1,
        user: undefined,
        status: false,
      };
    return seats;
  })(),
  status: false,
};

// console.log(JSON.stringify(defaultValue, null ,2));

const bookings = mongoose.Schema({
  _id: Number,
  row:{
    type:[
      {
        _id: Number,
        seats:[{
          _id: Number,
          user:{
            type: String,
            default: undefined,
          },
          status: Boolean,
        }],
        leftToBook: {
          type: Number,
          default: 7
        },
      }
    ],
    default: defaultValue
  }
});


mongoose.connect("mongodb+srv://itsme:1234@cluster0.bjt0i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

const db = mongoose.model("bookings", bookings);

export default (async ()=>{
  
  let data = await db.findById(1);
  if(data===null){
    data = await db.create({_id: 1});
  }
  return data;
})();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then((res)=>{
    console.log("Connecting to Data Base");
}).catch((err)=>{
    console.log(err);
});

const initDB = async ()=>{
    // await Listing.deleteMany({});
    // initData.data = initData.data.map((obj)=>({...obj,owner: "669cdbb2366839519d4a4bde"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
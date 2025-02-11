const express = require("express");
const mongoose = require("mongoose");
const {dbConnect} = require("./db.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors())
dbConnect();

mongoose.connection.once("open", () => {
    console.log(`✅ Connected to database: ${mongoose.connection.name}`);
});


const detailsSchema = new mongoose.Schema({
    displayName : String,
    email : String
});

const detailsModel = mongoose.model("google_signups_data",detailsSchema,"google_signups_data");

//get login details

// app.get("/login",async(req,res)=>{
//         try{
//             let data = await detailsModel.find();
//             console.log(data);
//             res.send(data);
//         }
//         catch(err){
//             console.error("❌ Error fetching data:", err);
//             res.status(500).send({ error: "Internal Server Error" });
//         }
// });


app.post("/login", async (req, res) => {
    try {
        const { displayName, email } = req.body; // Assuming login details are sent in the request body
        if (!displayName || !email) {
            return res.status(400).send({ error: "displayName and email are required" });
        }

        let user = await detailsModel.findOne({ displayName, email }); // Adjust based on your schema
        if (!user) {
            return res.status(401).send({ error: "Invalid credentials" });
        }

        console.log("✅ User logged in:", user);
        res.send(user); // Or send a success message/token
    } catch (err) {
        console.error("❌ Error logging in:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

app.post("/register",async(req,res)=>{
    try{
        const data = req.body;
        console.log(data);
        let post = await detailsModel.create(data);
        res.send({
            message: "✅ Data inserted successfully into google_signups_data",
            user: post
        });
    }
    catch (error) {
        console.error("❌ Error inserting data into google_signups_data:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
})
app.listen(port,()=>{
    console.log(`🚀 Server running at http://localhost:${port}`);
})
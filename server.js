const express = require("express")
const app = express();
const Router = require("./routes/router")
require("dotenv").config();

const port = process.env.PORT || 4000;

app.use(express.json())
app.use(Router)

app.listen(port, () => {
    console.log("connected to the server at port:", port)
})
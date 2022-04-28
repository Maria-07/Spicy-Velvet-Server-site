const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (res, req) => {
  res.send("Spicy Velvet warehouse website running");
});

app.listen(port, () => {
  console.log("Server is running : ", port);
});

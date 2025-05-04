const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const apiRoutes = require("./routes/api")
const app = express()

const corsOptions = {
  origin: ['https://hbdgen.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}

dotenv.config()
const MONGO_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 5000

app.use(cors(corsOptions))
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/api", apiRoutes)

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.get("/", (req, res) => {
  res.send("Birthday Generator API is running...")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

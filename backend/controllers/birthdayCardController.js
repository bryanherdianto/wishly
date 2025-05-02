const BirthdayCard = require("../models/BirthdayCard")
const fs = require("fs")
const path = require("path")
const multer = require("multer")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads")
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Get all birthday cards
exports.getBirthdayCards = async (req, res) => {
  try {
    const cards = await BirthdayCard.find().sort({ createdAt: -1 })
    res.json(cards)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new birthday card
exports.createBirthdayCard = async (req, res) => {
  try {
    const cardData = req.body

    // If there's a file uploaded, add the URL
    if (req.file) {
      // Create URL based on server configuration
      const baseUrl = `${req.protocol}://${req.get("host")}`
      cardData.photoUrl = `${baseUrl}/uploads/${req.file.filename}`
    }

    const newCard = new BirthdayCard(cardData)
    const savedCard = await newCard.save()
    res.status(201).json(savedCard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get birthday card by ID
exports.getBirthdayCardById = async (req, res) => {
  try {
    const card = await BirthdayCard.findById(req.params.id)
    if (!card) return res.status(404).json({ message: "Birthday card not found" })
    res.json(card)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update birthday card
exports.updateBirthdayCard = async (req, res) => {
  try {
    const cardData = req.body

    // If there's a file uploaded, add the URL
    if (req.file) {
      // Create URL based on server configuration
      const baseUrl = `${req.protocol}://${req.get("host")}`
      cardData.photoUrl = `${baseUrl}/uploads/${req.file.filename}`

      // Delete old photo if exists
      const oldCard = await BirthdayCard.findById(req.params.id)
      if (oldCard && oldCard.photoUrl) {
        const oldPhotoPath = oldCard.photoUrl.split("/uploads/")[1]
        if (oldPhotoPath) {
          const filePath = path.join(__dirname, "../uploads", oldPhotoPath)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        }
      }
    }

    const updatedCard = await BirthdayCard.findByIdAndUpdate(req.params.id, cardData, { new: true })
    if (!updatedCard) return res.status(404).json({ message: "Birthday card not found" })
    res.json(updatedCard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete birthday card
exports.deleteBirthdayCard = async (req, res) => {
  try {
    const card = await BirthdayCard.findById(req.params.id)
    if (!card) return res.status(404).json({ message: "Birthday card not found" })

    // Delete photo if exists
    if (card.photoUrl) {
      const photoPath = card.photoUrl.split("/uploads/")[1]
      if (photoPath) {
        const filePath = path.join(__dirname, "../uploads", photoPath)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
    }

    await BirthdayCard.findByIdAndDelete(req.params.id)
    res.json({ message: "Birthday card deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Middleware for handling file uploads
exports.uploadPhoto = upload.single("photo")

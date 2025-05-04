const express = require("express")
const router = express.Router()
const birthdayCardController = require("../controllers/birthdayCardController")

router.get("/birthday-cards", birthdayCardController.getBirthdayCards)
router.post("/birthday-cards", birthdayCardController.uploadPhoto, birthdayCardController.createBirthdayCard)
router.get("/birthday-cards/:id", birthdayCardController.getBirthdayCardById)
router.put("/birthday-cards/:id", birthdayCardController.uploadPhoto, birthdayCardController.updateBirthdayCard)
router.delete("/birthday-cards/:id", birthdayCardController.deleteBirthdayCard)

module.exports = router
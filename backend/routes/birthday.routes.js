const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const birthdayController = require("../controllers/birthday.controller");

router.get("/cards", requireAuth(), birthdayController.getBirthdays);
router.post("/cards", requireAuth(), birthdayController.createBirthday);
router.get("/slug/:slug", birthdayController.getBirthdayBySlug);
router.put("/cards/:id", requireAuth(), birthdayController.updateBirthday);
router.delete("/cards/:id", requireAuth(), birthdayController.deleteBirthday);
router.get("/cards/:id", birthdayController.getBirthdayById);

module.exports = router;

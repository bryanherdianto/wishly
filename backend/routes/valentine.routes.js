const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const valentineController = require("../controllers/valentine.controller");

router.get("/cards", requireAuth(), valentineController.getValentines);
router.post("/cards", requireAuth(), valentineController.createValentine);
router.get("/slug/:slug", valentineController.getValentineBySlug);
router.get("/cards/:id", valentineController.getValentineById);
router.put("/cards/:id", requireAuth(), valentineController.updateValentine);
router.delete("/cards/:id", requireAuth(), valentineController.deleteValentine);

module.exports = router;

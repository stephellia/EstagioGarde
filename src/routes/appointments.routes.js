
const express = require("express");
const controller = require("../controllers/appointments.controller");

const router = express.Router();

router.get("/available", controller.getAvailable);
router.post("/appointments", controller.create);
router.get("/appointments", controller.list);

module.exports = router;

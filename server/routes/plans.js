const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getAllPlans } = require('../controllers/planController');

router.get('/', protect, getAllPlans);

module.exports = router;
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getAllGuides, getGuideBySlug } = require('../controllers/guideController');

router.get('/', protect, getAllGuides);
router.get('/:slug', protect, getGuideBySlug);

module.exports = router;
const Guide = require('../models/Guide');

exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find({}, 'slug category title sub');
    res.json(guides);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getGuideBySlug = async (req, res) => {
  try {
    const guide = await Guide.findOne({ slug: req.params.slug });
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json(guide);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
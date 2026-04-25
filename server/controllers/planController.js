const Plan = require('../models/Plan');

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
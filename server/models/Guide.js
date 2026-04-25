const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  sub: { type: String },
  sections: [{ heading: String, body: String }],
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
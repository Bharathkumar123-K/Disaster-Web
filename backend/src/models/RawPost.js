const mongoose = require('mongoose');

const rawPostSchema = new mongoose.Schema({
  source: { type: String, required: true },
  sourceId: { type: String, unique: true },
  title: { type: String },
  text: { type: String },
  mediaUrls: [{ type: String }],
  author: { type: String },
  url: { type: String },
  rawTimestamp: { type: Date },
  fetchedAt: { type: Date, default: Date.now },
  processed: { type: Boolean, default: false }
});

module.exports = mongoose.model('RawPost', rawPostSchema);

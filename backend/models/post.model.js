const mogoose = require('mongoose');

const postSchema = mogoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
});

module.exports = mogoose.model('Post', postSchema);

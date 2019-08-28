const mogoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mogoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mogoose.model('User', userSchema);

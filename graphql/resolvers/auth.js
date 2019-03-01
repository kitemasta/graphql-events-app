const User = require('../../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
  createUser: async ({ userInput: { email, password } }) => {
    try {
      const creator = await User.findOne({
        email
      })
      if (creator) {
        throw new Error('User exists already');
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const hashedUser = new User({
        email,
        password: hashedPassword
      });
      const result = await hashedUser.save();

      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  }
}
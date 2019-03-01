const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
      expiresIn: '1h'
    });

    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    }
  }
}
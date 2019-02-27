const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => ({
      ...event._doc,
      creator: user.bind(this, event.creator),
      date: new Date(event._doc.date).toISOString()
    }))
  } catch (err) {
    throw err;
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }
  } catch (err) {
    throw err
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
      }));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: '5c7694c731e6d908691405db'
    });
    let createdEvent;

    try {
      const result = await event
        .save()
      createdEvent = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById('5c7567023a386d653e424dba')
      if (!creator) {
        throw new Error('Can\'t find user');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
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
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err;
  }
}

const singleEvent = async eventId => {
  try {
    const event = await Event.findById({ _id: eventId });
    return transformEvent(event);
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

const transformEvent = event => ({
  ...event._doc,
  creator: user.bind(this, event.creator),
  date: dateToString(event._doc.date)
});

const transformBooking = booking => ({
  ...booking._doc,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt)
});

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
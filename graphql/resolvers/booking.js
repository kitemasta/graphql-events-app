const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => transformBooking(booking));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async ({ eventId }) => {
    const fetchedEvent = await Event.findOne({ _id: eventId });
    const booking = new Booking({
      user: '5c7694c731e6d908691405db',
      event: fetchedEvent
    });

    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  }
}
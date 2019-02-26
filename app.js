const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(events => {
                return events.map(event => ({ ...event._doc }));
            }).catch(err => {
                throw err
            });
        },
        createEvent: ({ eventInput: { title, description, price, date } }) => {
            const event = new Event({
                title,
                description,
                price: +price,
                date: new Date(date),
                creator: '5c7567023a386d653e424dba'
            });
            let createdEvent;

            return event
                .save()
                .then(result => {
                    createdEvent = { ...result._doc };
                    return User.findById('5c7567023a386d653e424dba')
                })
                .then(user => {
                    if (!user) {
                        throw new Error('Can\'t find user');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(res => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err)
                    throw err;
                });
        },
        createUser: ({ userInput: { email, password } }) => {
            return User.findOne({
                email
            }).then(user => {
                if (user) {
                    throw new Error('User exists already');
                }
                return bcrypt.hash(password, 12);
            })
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    console.log(result)
                    return { ...result._doc, password: null };
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@events-acei1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() => {
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    })
// src/session.js
const Session  = require('./models/Session');
const { v4: uuidv4 } = require('uuid');

async function createSession(userId) {
    let session = await Session.findBy({userId: userId});

    if(!session) {
        const sessionId = uuidv4();
        session = await Session.create({ sessionId, userId });
    }
   
    return session.sessionId;
}

async function getSession(sessionId) {
    return await Session.findOne({ where: { sessionId } });
}

async function destroySession(sessionId) {
    await Session.destroy({ where: { sessionId } });
    localStorage.removeItem('sessionId');
}

module.exports = { createSession, getSession, destroySession };

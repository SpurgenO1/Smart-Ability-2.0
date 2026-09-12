'use strict';

const { Server } = require('socket.io');
const tokenService = require('../services/token.service');
const userModel = require('../models/user.model');
const studentModel = require('../models/student.model');
const therapistModel = require('../models/therapist.model');
const parentModel = require('../models/parent.model');

let ioInstance = null;

function roomFor(role, roleEntityId) {
  return `${role}:${roleEntityId}`;
}

async function resolveRoomsForUser(user) {
  const rooms = [];
  if (user.role === 'student') {
    const student = await studentModel.findByUserId(user.id);
    if (student) rooms.push(roomFor('student', student.id));
  } else if (user.role === 'therapist') {
    const therapist = await therapistModel.findByUserId(user.id);
    if (therapist) rooms.push(roomFor('therapist', therapist.id));
  } else if (user.role === 'parent') {
    const parent = await parentModel.findByUserId(user.id);
    if (parent) rooms.push(roomFor('parent', parent.id));
  }
  return rooms;
}

function initSocket(server) {
  ioInstance = new Server(server, {
    path: '/ws',
    cors: { origin: process.env.CORS_ORIGIN || '*' },
  });

  ioInstance.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('AUTH_UNAUTHORIZED'));
      const payload = tokenService.verifyAccessToken(token);
      const user = await userModel.findById(payload.sub);
      if (!user || user.status !== 'active') return next(new Error('AUTH_UNAUTHORIZED'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('AUTH_UNAUTHORIZED'));
    }
  });

  ioInstance.on('connection', async (socket) => {
    const rooms = await resolveRoomsForUser(socket.user);
    rooms.forEach((room) => socket.join(room));
  });

  return ioInstance;
}

function getIO() {
  return ioInstance;
}

function emitToRoom(room, event, payload) {
  if (!ioInstance) return;
  ioInstance.to(room).emit(event, payload);
}

module.exports = { initSocket, getIO, emitToRoom, roomFor };

'use strict';

const notificationModel = require('../models/notification.model');

async function notify({ recipientId, type, title, message, referenceType, referenceId }) {
  const notification = await notificationModel.create({
    recipient_id: recipientId,
    type,
    title,
    message,
    reference_type: referenceType || null,
    reference_id: referenceId || null,
  });
  return notification;
}

module.exports = { notify };

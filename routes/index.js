/**
 * All api routes handles here
 * @author Yousuf Kalim
 */
const router = require('express').Router();
const { sendPushMessage } = require('../utils/sendFcmNotification');

// Parent Routes
router.use('/admins', require('./admins')); // All the admins routes
router.use('/users', require('./users')); // All the user routes
router.use('/appPicture', require('./appPicture')); // All the user routes
router.use('/serviceProviders', require('./serviceProviders')); // All the user routes
router.use('/auth', require('./auth')); // All the auth routes
router.use('/events', require('./events')); // All the event routes
router.use('/services', require('./services')); // All the services routes
router.use('/chat', require('./chat')); // All the chat routes
router.use('/bookings', require('./bookings')); // All the booking routes
router.use('/notifications', require('./notifications')); // All the notification routes

// Export
module.exports = router;

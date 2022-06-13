/**
 * Notification routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const notifications = require("../controllers/notifications");

// get Notifications
router.get("/:userId", notifications.getByUserID);

router.get("/:userId/count", notifications.getCount);

router.put("/:notificationId", notifications.markAsRead);

router.put("/:userId/all", notifications.markAllAsRead);

router.delete("/:userId", notifications.clearNotifications);

// Export
module.exports = router;

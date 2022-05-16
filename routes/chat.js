/**
 * All chat routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const chat = require("../controllers/chat");

router.get("/", chat.getChatData);
router.get("/:userId", chat.getAllChats);

// Export
module.exports = router;

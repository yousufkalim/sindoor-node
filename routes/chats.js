/**
 * Services CRUD routes
 * @author Yousuf Kalim
 *  @codeby Shuja Naqvi
 */
const router = require("express").Router();
const chats = require("../controllers/chats");
const {
  validateChat,
  validateChatID,
  validateRole,
  validateUserID,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post initialize chat
 * @method put update chat
 * @method delete chat
 */
// Initialize a new chat
router.post("/", validateChat, isValidated, chats.create);

//Find-All chats of a user
router.get("/:role/:userID", validateUserID, validateRole,isValidated, chats.getAllChats);

//Find-chat by Id
router.get("/mychat/:chatID/:role", validateChatID, isValidated, chats.getById);


// Export
module.exports = router;

/**
 ** Services Routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const services = require("../controllers/services");
const { validateService, isValidated } = require("../middleware/validators");
const { upload } = require("../middleware/multer");

router.post(
  "/:userId",
  upload.array("photos"),
  validateService,
  isValidated,
  services.createService
); //* create service

router.put(
  "/:serviceId",
  upload.array("photos"),
  validateService,
  isValidated,
  services.editService
); //* update service

router.delete("/:serviceId", services.deleteService); //* delete service

router.get("/:serviceId", services.getById); //* Get service by id

router.get("/:userId/all", services.getAllByUserID); //* get all services of user
router.get("/:userId/few", services.getFewByUserId); //* get few services of user

router.get("/", services.getRandomServiceProviders); //* Get random service providers by services

// Export
module.exports = router;

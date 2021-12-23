/**
 * Services CRUD routes
 * @author Yousuf Kalim
 *  @codeby Shuja Naqvi
 */
 const router = require("express").Router();
 const services = require("../controllers/services");
 const { upload } = require("../middleware/multer");
 const { validateService,validateCoordinates, isValidated } = require("../middleware/validators");
 
 /**
  * ////////////////////////// Routes /////////////////////////
  * @method post Create service 
  * @method put update Update Service
  * @method delete delete Service
  */
 // Create - New Service
router.post(
    "/",
    upload.array("photo",5),
    validateService,
    isValidated,
    services.create
  );
  //get nearby services
  router.get(
   "/nearby",
   validateCoordinates,
   isValidated,
   services.getNearby
  ),
  
 //get all services of a serviceProvider
 router.get('/myservices/:providerID',services.myservices)
  //Update service based on its id
  router.put(
  "/:serviceId",
  upload.array("photo",5),
   services.update
  ); 

  //Find-All Services 
  router.get("/", services.getAll);
  //Delete-Service based upon its id
  router.delete("/:serviceId", services.delete);
  //Update service based on its id
  router.get("/:category", services.getBycategory);
  
 
 // Export
 module.exports = router;
 
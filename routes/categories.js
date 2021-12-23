/**
 * Services CRUD routes
 * @author Yousuf Kalim
 *  @codeby Shuja Naqvi
 */
const router = require("express").Router();
const categories = require("../controllers/categories");
const { validateCategory, isValidated } = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post Create Category
 * @method put update Category
 * @method delete delete Category
 */
// Create - New Category
router.post("/", validateCategory, isValidated, categories.create);

//Find-All Categories
router.get("/", categories.getAll);
//Find-by-ID
router.get("/:categoryID" ,categories.getbyId);
//update Category
router.put("/:categoryID" ,categories.updatecategory);

//Delete Category
router.delete("/:categoryID",categories.deletecategory)
// Export
module.exports = router;

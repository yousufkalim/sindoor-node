/**
 * picture & Service Provider CRUD routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const picture = require('../controllers/appPicture');
const { upload } = require('../middleware/multer');

const { checkAdminAuth } = require('../middleware/adminAuth');

/**
 ** picture Routes
 * @method post picture signup
 * @method get get all pictures
 * @method get get picture by id
 * @method put update picture
 * @method delete delete picture
 */

// Create - Picture
router.post('/', checkAdminAuth, upload.single('image'), picture.create);
// Read
router.get('/', checkAdminAuth, picture.getAll); // Get all picture at once
router.get('/getTwo', checkAdminAuth, picture.getTwo); // Get all picture at once
router.get('/:pictureId', checkAdminAuth, picture.getById); // Get one picture by it's id
// Update
router.put('/:pictureId', checkAdminAuth, upload.single('image'), picture.update); // Update a specific picture by it's id
// Delete
router.delete('/:pictureId', checkAdminAuth, picture.delete); // delete a specific picture by it's id

// Export
module.exports = router;

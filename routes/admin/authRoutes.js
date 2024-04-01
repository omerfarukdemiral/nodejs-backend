/**
 * authRoutes.js
 * @description :: CRUD API routes for auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../../controller/admin/authController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/auth/create').post(auth(PLATFORM.ADMIN),checkRolePermission,authController.addAuth);
router.route('/admin/auth/list').post(auth(PLATFORM.ADMIN),checkRolePermission,authController.findAllAuth);
router.route('/admin/auth/count').post(auth(PLATFORM.ADMIN),checkRolePermission,authController.getAuthCount);
router.route('/admin/auth/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,authController.getAuth);
router.route('/admin/auth/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,authController.updateAuth);    
router.route('/admin/auth/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,authController.partialUpdateAuth);
router.route('/admin/auth/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,authController.softDeleteAuth);
router.route('/admin/auth/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,authController.softDeleteManyAuth);
router.route('/admin/auth/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,authController.bulkInsertAuth);
router.route('/admin/auth/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,authController.bulkUpdateAuth);
router.route('/admin/auth/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,authController.deleteAuth);
router.route('/admin/auth/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,authController.deleteManyAuth);

module.exports = router;

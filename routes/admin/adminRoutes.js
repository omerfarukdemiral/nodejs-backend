/**
 * adminRoutes.js
 * @description :: CRUD API routes for admin
 */

const express = require('express');
const router = express.Router();
const adminController = require('../../controller/admin/adminController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/admin/create').post(auth(PLATFORM.ADMIN),checkRolePermission,adminController.addAdmin);
router.route('/admin/admin/list').post(auth(PLATFORM.ADMIN),checkRolePermission,adminController.findAllAdmin);
router.route('/admin/admin/count').post(auth(PLATFORM.ADMIN),checkRolePermission,adminController.getAdminCount);
router.route('/admin/admin/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,adminController.getAdmin);
router.route('/admin/admin/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,adminController.updateAdmin);    
router.route('/admin/admin/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,adminController.partialUpdateAdmin);
router.route('/admin/admin/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,adminController.softDeleteAdmin);
router.route('/admin/admin/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,adminController.softDeleteManyAdmin);
router.route('/admin/admin/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,adminController.bulkInsertAdmin);
router.route('/admin/admin/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,adminController.bulkUpdateAdmin);
router.route('/admin/admin/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,adminController.deleteAdmin);
router.route('/admin/admin/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,adminController.deleteManyAdmin);

module.exports = router;

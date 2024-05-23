/**
 * earningsRoutes.js
 * @description :: CRUD API routes for earnings
 */

const express = require('express');
const router = express.Router();
const earningsController = require('../../controller/admin/earningsController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/earnings/create').post(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.addEarnings);
router.route('/admin/earnings/list').post(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.findAllEarnings);
router.route('/admin/earnings/count').post(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.getEarningsCount);
router.route('/admin/earnings/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.getEarnings);
router.route('/admin/earnings/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.updateEarnings);    
router.route('/admin/earnings/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.partialUpdateEarnings);
router.route('/admin/earnings/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.softDeleteEarnings);
router.route('/admin/earnings/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.softDeleteManyEarnings);
router.route('/admin/earnings/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.bulkInsertEarnings);
router.route('/admin/earnings/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.bulkUpdateEarnings);
router.route('/admin/earnings/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.deleteEarnings);
router.route('/admin/earnings/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,earningsController.deleteManyEarnings);

module.exports = router;

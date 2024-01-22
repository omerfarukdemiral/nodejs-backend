/**
 * assetRoutes.js
 * @description :: CRUD API routes for asset
 */

const express = require('express');
const router = express.Router();
const assetController = require('../../controller/admin/assetController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/asset/create').post(auth(PLATFORM.ADMIN),checkRolePermission,assetController.addAsset);
router.route('/admin/asset/list').post(auth(PLATFORM.ADMIN),checkRolePermission,assetController.findAllAsset);
router.route('/admin/asset/count').post(auth(PLATFORM.ADMIN),checkRolePermission,assetController.getAssetCount);
router.route('/admin/asset/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,assetController.getAsset);
router.route('/admin/asset/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,assetController.updateAsset);    
router.route('/admin/asset/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,assetController.partialUpdateAsset);
router.route('/admin/asset/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,assetController.softDeleteAsset);
router.route('/admin/asset/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,assetController.softDeleteManyAsset);
router.route('/admin/asset/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,assetController.bulkInsertAsset);
router.route('/admin/asset/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,assetController.bulkUpdateAsset);
router.route('/admin/asset/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,assetController.deleteAsset);
router.route('/admin/asset/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,assetController.deleteManyAsset);

module.exports = router;

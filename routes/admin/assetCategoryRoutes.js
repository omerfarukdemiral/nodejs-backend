/**
 * assetCategoryRoutes.js
 * @description :: CRUD API routes for assetCategory
 */

const express = require('express');
const router = express.Router();
const assetCategoryController = require('../../controller/admin/assetCategoryController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/assetcategory/create').post(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.addAssetCategory);
router.route('/admin/assetcategory/list').post(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.findAllAssetCategory);
router.route('/admin/assetcategory/count').post(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.getAssetCategoryCount);
router.route('/admin/assetcategory/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.getAssetCategory);
router.route('/admin/assetcategory/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.updateAssetCategory);    
router.route('/admin/assetcategory/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.partialUpdateAssetCategory);
router.route('/admin/assetcategory/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.softDeleteAssetCategory);
router.route('/admin/assetcategory/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.softDeleteManyAssetCategory);
router.route('/admin/assetcategory/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.bulkInsertAssetCategory);
router.route('/admin/assetcategory/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.bulkUpdateAssetCategory);
router.route('/admin/assetcategory/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.deleteAssetCategory);
router.route('/admin/assetcategory/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,assetCategoryController.deleteManyAssetCategory);

module.exports = router;

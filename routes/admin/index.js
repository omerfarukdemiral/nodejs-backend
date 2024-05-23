/**
 * index.js
 * @description :: index route file of admin platform.
 */

const express =  require('express');
const router =  express.Router();
router.use('/admin/auth',require('./auth'));
router.use(require('./authRoutes'));
router.use(require('./earningsRoutes'));
router.use(require('./adminRoutes'));
router.use(require('./userRoutes'));
router.use(require('./assetRoutes'));
router.use(require('./assetCategoryRoutes'));
router.use(require('./orderRoutes'));
router.use(require('./stateRoutes'));
router.use(require('./walletRoutes'));
router.use(require('./walletTransactionRoutes'));
router.use(require('./roleRoutes'));
router.use(require('./projectRouteRoutes'));
router.use(require('./routeRoleRoutes'));
router.use(require('./userRoleRoutes'));
router.use(require('./uploadRoutes'));

module.exports = router;

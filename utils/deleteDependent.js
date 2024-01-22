/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let Admin = require('../model/admin');
let User = require('../model/user');
let Asset = require('../model/asset');
let AssetCategory = require('../model/assetCategory');
let Order = require('../model/order');
let State = require('../model/state');
let Wallet = require('../model/wallet');
let WalletTransaction = require('../model/walletTransaction');
let UserTokens = require('../model/userTokens');
let ActivityLog = require('../model/activityLog');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');

const deleteAdmin = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Admin,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) =>{
  try {
    let user = await dbService.findMany(User,filter);
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const adminFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const adminCnt = await dbService.deleteMany(Admin,adminFilter);

      const userFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userCnt = await dbService.deleteMany(User,userFilter);

      const assetFilter = { $or: [{ sellerId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const assetCnt = await dbService.deleteMany(Asset,assetFilter);

      const assetCategoryFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const assetCategoryCnt = await dbService.deleteMany(AssetCategory,assetCategoryFilter);

      const orderFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const orderCnt = await dbService.deleteMany(Order,orderFilter);

      const stateFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const stateCnt = await dbService.deleteMany(State,stateFilter);

      const walletFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletCnt = await dbService.deleteMany(Wallet,walletFilter);

      const walletTransactionFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletTransactionCnt = await dbService.deleteMany(WalletTransaction,walletTransactionFilter);

      const userTokensFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userTokensCnt = await dbService.deleteMany(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const roleCnt = await dbService.deleteMany(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const projectRouteCnt = await dbService.deleteMany(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(User,filter);
      let response = {
        admin :adminCnt,
        user :userCnt + deleted,
        asset :assetCnt,
        assetCategory :assetCategoryCnt,
        order :orderCnt,
        state :stateCnt,
        wallet :walletCnt,
        walletTransaction :walletTransactionCnt,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAsset = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Asset,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAssetCategory = async (filter) =>{
  try {
    let assetcategory = await dbService.findMany(AssetCategory,filter);
    if (assetcategory && assetcategory.length){
      assetcategory = assetcategory.map((obj) => obj.id);

      const assetFilter = { $or: [{ category : { $in : assetcategory } },{ subCategory : { $in : assetcategory } }] };
      const assetCnt = await dbService.deleteMany(Asset,assetFilter);

      const assetCategoryFilter = { $or: [{ parentCategoryId : { $in : assetcategory } }] };
      const assetCategoryCnt = await dbService.deleteMany(AssetCategory,assetCategoryFilter);

      let deleted  = await dbService.deleteMany(AssetCategory,filter);
      let response = {
        asset :assetCnt,
        assetCategory :assetCategoryCnt,
      };
      return response; 
    } else {
      return {  assetcategory : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteOrder = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Order,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteState = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(State,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteWallet = async (filter) =>{
  try {
    let wallet = await dbService.findMany(Wallet,filter);
    if (wallet && wallet.length){
      wallet = wallet.map((obj) => obj.id);

      const walletTransactionFilter = { $or: [{ walletId : { $in : wallet } }] };
      const walletTransactionCnt = await dbService.deleteMany(WalletTransaction,walletTransactionFilter);

      let deleted  = await dbService.deleteMany(Wallet,filter);
      let response = { walletTransaction :walletTransactionCnt, };
      return response; 
    } else {
      return {  wallet : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteWalletTransaction = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(WalletTransaction,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserTokens,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteActivityLog = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(ActivityLog,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(Role,filter);
      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      let deleted  = await dbService.deleteMany(ProjectRoute,filter);
      let response = { routeRole :routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const countAdmin = async (filter) =>{
  try {
    const adminCnt =  await dbService.count(Admin,filter);
    return { admin : adminCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await dbService.findMany(User,filter);
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const adminFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const adminCnt =  await dbService.count(Admin,adminFilter);

      const userFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const assetFilter = { $or: [{ sellerId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const assetCnt =  await dbService.count(Asset,assetFilter);

      const assetCategoryFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const assetCategoryCnt =  await dbService.count(AssetCategory,assetCategoryFilter);

      const orderFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const orderCnt =  await dbService.count(Order,orderFilter);

      const stateFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const stateCnt =  await dbService.count(State,stateFilter);

      const walletFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletCnt =  await dbService.count(Wallet,walletFilter);

      const walletTransactionFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const walletTransactionCnt =  await dbService.count(WalletTransaction,walletTransactionFilter);

      const userTokensFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userTokensCnt =  await dbService.count(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const roleCnt =  await dbService.count(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const projectRouteCnt =  await dbService.count(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        admin : adminCnt,
        user : userCnt,
        asset : assetCnt,
        assetCategory : assetCategoryCnt,
        order : orderCnt,
        state : stateCnt,
        wallet : walletCnt,
        walletTransaction : walletTransactionCnt,
        userTokens : userTokensCnt,
        role : roleCnt,
        projectRoute : projectRouteCnt,
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countAsset = async (filter) =>{
  try {
    const assetCnt =  await dbService.count(Asset,filter);
    return { asset : assetCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countAssetCategory = async (filter) =>{
  try {
    let assetcategory = await dbService.findMany(AssetCategory,filter);
    if (assetcategory && assetcategory.length){
      assetcategory = assetcategory.map((obj) => obj.id);

      const assetFilter = { $or: [{ category : { $in : assetcategory } },{ subCategory : { $in : assetcategory } }] };
      const assetCnt =  await dbService.count(Asset,assetFilter);

      const assetCategoryFilter = { $or: [{ parentCategoryId : { $in : assetcategory } }] };
      const assetCategoryCnt =  await dbService.count(AssetCategory,assetCategoryFilter);

      let response = {
        asset : assetCnt,
        assetCategory : assetCategoryCnt,
      };
      return response; 
    } else {
      return {  assetcategory : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countOrder = async (filter) =>{
  try {
    const orderCnt =  await dbService.count(Order,filter);
    return { order : orderCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countState = async (filter) =>{
  try {
    const stateCnt =  await dbService.count(State,filter);
    return { state : stateCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countWallet = async (filter) =>{
  try {
    let wallet = await dbService.findMany(Wallet,filter);
    if (wallet && wallet.length){
      wallet = wallet.map((obj) => obj.id);

      const walletTransactionFilter = { $or: [{ walletId : { $in : wallet } }] };
      const walletTransactionCnt =  await dbService.count(WalletTransaction,walletTransactionFilter);

      let response = { walletTransaction : walletTransactionCnt, };
      return response; 
    } else {
      return {  wallet : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countWalletTransaction = async (filter) =>{
  try {
    const walletTransactionCnt =  await dbService.count(WalletTransaction,filter);
    return { walletTransaction : walletTransactionCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) =>{
  try {
    const userTokensCnt =  await dbService.count(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countActivityLog = async (filter) =>{
  try {
    const activityLogCnt =  await dbService.count(ActivityLog,filter);
    return { activityLog : activityLogCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await dbService.count(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await dbService.count(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAdmin = async (filter,updateBody) =>{  
  try {
    const adminCnt =  await dbService.updateMany(Admin,filter);
    return { admin : adminCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody) =>{  
  try {
    let user = await dbService.findMany(User,filter, { id:1 });
    if (user.length){
      user = user.map((obj) => obj.id);

      const adminFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const adminCnt = await dbService.updateMany(Admin,adminFilter,updateBody);

      const userFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userCnt = await dbService.updateMany(User,userFilter,updateBody);

      const assetFilter = { '$or': [{ sellerId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const assetCnt = await dbService.updateMany(Asset,assetFilter,updateBody);

      const assetCategoryFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const assetCategoryCnt = await dbService.updateMany(AssetCategory,assetCategoryFilter,updateBody);

      const orderFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const orderCnt = await dbService.updateMany(Order,orderFilter,updateBody);

      const stateFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const stateCnt = await dbService.updateMany(State,stateFilter,updateBody);

      const walletFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const walletCnt = await dbService.updateMany(Wallet,walletFilter,updateBody);

      const walletTransactionFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const walletTransactionCnt = await dbService.updateMany(WalletTransaction,walletTransactionFilter,updateBody);

      const userTokensFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userTokensCnt = await dbService.updateMany(UserTokens,userTokensFilter,updateBody);

      const roleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const roleCnt = await dbService.updateMany(Role,roleFilter,updateBody);

      const projectRouteFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const projectRouteCnt = await dbService.updateMany(ProjectRoute,projectRouteFilter,updateBody);

      const routeRoleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(User,filter,updateBody);

      let response = {
        admin :adminCnt,
        user :userCnt + updated,
        asset :assetCnt,
        assetCategory :assetCategoryCnt,
        order :orderCnt,
        state :stateCnt,
        wallet :walletCnt,
        walletTransaction :walletTransactionCnt,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAsset = async (filter,updateBody) =>{  
  try {
    const assetCnt =  await dbService.updateMany(Asset,filter);
    return { asset : assetCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAssetCategory = async (filter,updateBody) =>{  
  try {
    let assetcategory = await dbService.findMany(AssetCategory,filter, { id:1 });
    if (assetcategory.length){
      assetcategory = assetcategory.map((obj) => obj.id);

      const assetFilter = { '$or': [{ category : { '$in' : assetcategory } },{ subCategory : { '$in' : assetcategory } }] };
      const assetCnt = await dbService.updateMany(Asset,assetFilter,updateBody);

      const assetCategoryFilter = { '$or': [{ parentCategoryId : { '$in' : assetcategory } }] };
      const assetCategoryCnt = await dbService.updateMany(AssetCategory,assetCategoryFilter,updateBody);
      let updated = await dbService.updateMany(AssetCategory,filter,updateBody);

      let response = {
        asset :assetCnt,
        assetCategory :assetCategoryCnt,
      };
      return response;
    } else {
      return {  assetcategory : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteOrder = async (filter,updateBody) =>{  
  try {
    const orderCnt =  await dbService.updateMany(Order,filter);
    return { order : orderCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteState = async (filter,updateBody) =>{  
  try {
    const stateCnt =  await dbService.updateMany(State,filter);
    return { state : stateCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteWallet = async (filter,updateBody) =>{  
  try {
    let wallet = await dbService.findMany(Wallet,filter, { id:1 });
    if (wallet.length){
      wallet = wallet.map((obj) => obj.id);

      const walletTransactionFilter = { '$or': [{ walletId : { '$in' : wallet } }] };
      const walletTransactionCnt = await dbService.updateMany(WalletTransaction,walletTransactionFilter,updateBody);
      let updated = await dbService.updateMany(Wallet,filter,updateBody);

      let response = { walletTransaction :walletTransactionCnt, };
      return response;
    } else {
      return {  wallet : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteWalletTransaction = async (filter,updateBody) =>{  
  try {
    const walletTransactionCnt =  await dbService.updateMany(WalletTransaction,filter);
    return { walletTransaction : walletTransactionCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter,updateBody) =>{  
  try {
    const userTokensCnt =  await dbService.updateMany(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteActivityLog = async (filter,updateBody) =>{  
  try {
    const activityLogCnt =  await dbService.updateMany(ActivityLog,filter);
    return { activityLog : activityLogCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody) =>{  
  try {
    let role = await dbService.findMany(Role,filter, { id:1 });
    if (role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(Role,filter,updateBody);

      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody) =>{  
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter, { id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectroute } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);
      let updated = await dbService.updateMany(ProjectRoute,filter,updateBody);

      let response = { routeRole :routeRoleCnt, };
      return response;
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody) =>{  
  try {
    const routeRoleCnt =  await dbService.updateMany(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody) =>{  
  try {
    const userRoleCnt =  await dbService.updateMany(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteAdmin,
  deleteUser,
  deleteAsset,
  deleteAssetCategory,
  deleteOrder,
  deleteState,
  deleteWallet,
  deleteWalletTransaction,
  deleteUserTokens,
  deleteActivityLog,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countAdmin,
  countUser,
  countAsset,
  countAssetCategory,
  countOrder,
  countState,
  countWallet,
  countWalletTransaction,
  countUserTokens,
  countActivityLog,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteAdmin,
  softDeleteUser,
  softDeleteAsset,
  softDeleteAssetCategory,
  softDeleteOrder,
  softDeleteState,
  softDeleteWallet,
  softDeleteWalletTransaction,
  softDeleteUserTokens,
  softDeleteActivityLog,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};

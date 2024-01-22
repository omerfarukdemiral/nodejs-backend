/**
 * assetCategoryController.js
 * @description : exports action methods for assetCategory.
 */

const AssetCategory = require('../../model/assetCategory');
const assetCategorySchemaKey = require('../../utils/validation/assetCategoryValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of AssetCategory in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created AssetCategory. {status, message, data}
 */ 
const addAssetCategory = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      assetCategorySchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new AssetCategory(dataToCreate);
    let createdAssetCategory = await dbService.create(AssetCategory,dataToCreate);
    return res.success({ data : createdAssetCategory });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of AssetCategory in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created AssetCategorys. {status, message, data}
 */
const bulkInsertAssetCategory = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }
    let createdAssetCategorys = await dbService.create(AssetCategory,dataToCreate);
    createdAssetCategorys = { count: createdAssetCategorys ? createdAssetCategorys.length : 0 };
    return res.success({ data:{ count:createdAssetCategorys.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of AssetCategory from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found AssetCategory(s). {status, message, data}
 */
const findAllAssetCategory = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      assetCategorySchemaKey.findFilterKeys,
      AssetCategory.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(AssetCategory, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundAssetCategorys = await dbService.paginate( AssetCategory,query,options);
    if (!foundAssetCategorys || !foundAssetCategorys.data || !foundAssetCategorys.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundAssetCategorys });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of AssetCategory from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found AssetCategory. {status, message, data}
 */
const getAssetCategory = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundAssetCategory = await dbService.findOne(AssetCategory,query, options);
    if (!foundAssetCategory){
      return res.recordNotFound();
    }
    return res.success({ data :foundAssetCategory });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of AssetCategory.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getAssetCategoryCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      assetCategorySchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedAssetCategory = await dbService.count(AssetCategory,where);
    return res.success({ data : { count: countedAssetCategory } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of AssetCategory with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated AssetCategory.
 * @return {Object} : updated AssetCategory. {status, message, data}
 */
const updateAssetCategory = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      assetCategorySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAssetCategory = await dbService.updateOne(AssetCategory,query,dataToUpdate);
    if (!updatedAssetCategory){
      return res.recordNotFound();
    }
    return res.success({ data :updatedAssetCategory });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of AssetCategory with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated AssetCategorys.
 * @return {Object} : updated AssetCategorys. {status, message, data}
 */
const bulkUpdateAssetCategory = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    delete dataToUpdate['addedBy'];
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { 
        ...req.body.data,
        updatedBy : req.user.id
      };
    }
    let updatedAssetCategory = await dbService.updateMany(AssetCategory,filter,dataToUpdate);
    if (!updatedAssetCategory){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedAssetCategory } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of AssetCategory with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated AssetCategory.
 * @return {obj} : updated AssetCategory. {status, message, data}
 */
const partialUpdateAssetCategory = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      assetCategorySchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAssetCategory = await dbService.updateOne(AssetCategory, query, dataToUpdate);
    if (!updatedAssetCategory) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAssetCategory });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of AssetCategory from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of AssetCategory.
 * @return {Object} : deactivated AssetCategory. {status, message, data}
 */
const softDeleteAssetCategory = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedAssetCategory = await deleteDependentService.softDeleteAssetCategory(query, updateBody);
    if (!updatedAssetCategory){
      return res.recordNotFound();
    }
    return res.success({ data:updatedAssetCategory });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of AssetCategory from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted AssetCategory. {status, message, data}
 */
const deleteAssetCategory = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedAssetCategory;
    if (req.body.isWarning) { 
      deletedAssetCategory = await deleteDependentService.countAssetCategory(query);
    } else {
      deletedAssetCategory = await deleteDependentService.deleteAssetCategory(query);
    }
    if (!deletedAssetCategory){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAssetCategory });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of AssetCategory in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyAssetCategory = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedAssetCategory;
    if (req.body.isWarning) {
      deletedAssetCategory = await deleteDependentService.countAssetCategory(query);
    }
    else {
      deletedAssetCategory = await deleteDependentService.deleteAssetCategory(query);
    }
    if (!deletedAssetCategory){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAssetCategory });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of AssetCategory from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of AssetCategory.
 * @return {Object} : number of deactivated documents of AssetCategory. {status, message, data}
 */
const softDeleteManyAssetCategory = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedAssetCategory = await deleteDependentService.softDeleteAssetCategory(query, updateBody);
    if (!updatedAssetCategory) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAssetCategory });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addAssetCategory,
  bulkInsertAssetCategory,
  findAllAssetCategory,
  getAssetCategory,
  getAssetCategoryCount,
  updateAssetCategory,
  bulkUpdateAssetCategory,
  partialUpdateAssetCategory,
  softDeleteAssetCategory,
  deleteAssetCategory,
  deleteManyAssetCategory,
  softDeleteManyAssetCategory    
};
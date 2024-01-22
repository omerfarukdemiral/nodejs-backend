/**
 * assetController.js
 * @description : exports action methods for asset.
 */

const Asset = require('../../model/asset');
const assetSchemaKey = require('../../utils/validation/assetValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Asset in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Asset. {status, message, data}
 */ 
const addAsset = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      assetSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Asset(dataToCreate);
    let createdAsset = await dbService.create(Asset,dataToCreate);
    return res.success({ data : createdAsset });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Asset in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Assets. {status, message, data}
 */
const bulkInsertAsset = async (req,res)=>{
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
    let createdAssets = await dbService.create(Asset,dataToCreate);
    createdAssets = { count: createdAssets ? createdAssets.length : 0 };
    return res.success({ data:{ count:createdAssets.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Asset from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Asset(s). {status, message, data}
 */
const findAllAsset = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      assetSchemaKey.findFilterKeys,
      Asset.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Asset, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundAssets = await dbService.paginate( Asset,query,options);
    if (!foundAssets || !foundAssets.data || !foundAssets.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundAssets });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Asset from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Asset. {status, message, data}
 */
const getAsset = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundAsset = await dbService.findOne(Asset,query, options);
    if (!foundAsset){
      return res.recordNotFound();
    }
    return res.success({ data :foundAsset });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Asset.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getAssetCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      assetSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedAsset = await dbService.count(Asset,where);
    return res.success({ data : { count: countedAsset } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Asset with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Asset.
 * @return {Object} : updated Asset. {status, message, data}
 */
const updateAsset = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      assetSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAsset = await dbService.updateOne(Asset,query,dataToUpdate);
    if (!updatedAsset){
      return res.recordNotFound();
    }
    return res.success({ data :updatedAsset });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Asset with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Assets.
 * @return {Object} : updated Assets. {status, message, data}
 */
const bulkUpdateAsset = async (req,res)=>{
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
    let updatedAsset = await dbService.updateMany(Asset,filter,dataToUpdate);
    if (!updatedAsset){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedAsset } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Asset with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Asset.
 * @return {obj} : updated Asset. {status, message, data}
 */
const partialUpdateAsset = async (req,res) => {
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
      assetSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAsset = await dbService.updateOne(Asset, query, dataToUpdate);
    if (!updatedAsset) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAsset });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Asset from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Asset.
 * @return {Object} : deactivated Asset. {status, message, data}
 */
const softDeleteAsset = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedAsset = await dbService.updateOne(Asset, query, updateBody);
    if (!updatedAsset){
      return res.recordNotFound();
    }
    return res.success({ data:updatedAsset });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Asset from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Asset. {status, message, data}
 */
const deleteAsset = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedAsset = await dbService.deleteOne(Asset, query);
    if (!deletedAsset){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAsset });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Asset in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyAsset = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedAsset = await dbService.deleteMany(Asset,query);
    if (!deletedAsset){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedAsset } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Asset from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Asset.
 * @return {Object} : number of deactivated documents of Asset. {status, message, data}
 */
const softDeleteManyAsset = async (req,res) => {
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
    let updatedAsset = await dbService.updateMany(Asset,query, updateBody);
    if (!updatedAsset) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedAsset } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addAsset,
  bulkInsertAsset,
  findAllAsset,
  getAsset,
  getAssetCount,
  updateAsset,
  bulkUpdateAsset,
  partialUpdateAsset,
  softDeleteAsset,
  deleteAsset,
  deleteManyAsset,
  softDeleteManyAsset    
};
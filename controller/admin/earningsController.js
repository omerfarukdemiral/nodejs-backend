/**
 * earningsController.js
 * @description : exports action methods for earnings.
 */

const Earnings = require('../../model/earnings');
const earningsSchemaKey = require('../../utils/validation/earningsValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Earnings in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Earnings. {status, message, data}
 */ 
const addEarnings = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      earningsSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Earnings(dataToCreate);
    let createdEarnings = await dbService.create(Earnings,dataToCreate);
    return res.success({ data : createdEarnings });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Earnings in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Earningss. {status, message, data}
 */
const bulkInsertEarnings = async (req,res)=>{
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
    let createdEarningss = await dbService.create(Earnings,dataToCreate);
    createdEarningss = { count: createdEarningss ? createdEarningss.length : 0 };
    return res.success({ data:{ count:createdEarningss.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Earnings from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Earnings(s). {status, message, data}
 */
const findAllEarnings = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      earningsSchemaKey.findFilterKeys,
      Earnings.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Earnings, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundEarningss = await dbService.paginate( Earnings,query,options);
    if (!foundEarningss || !foundEarningss.data || !foundEarningss.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundEarningss });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Earnings from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Earnings. {status, message, data}
 */
const getEarnings = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundEarnings = await dbService.findOne(Earnings,query, options);
    if (!foundEarnings){
      return res.recordNotFound();
    }
    return res.success({ data :foundEarnings });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Earnings.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getEarningsCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      earningsSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedEarnings = await dbService.count(Earnings,where);
    return res.success({ data : { count: countedEarnings } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Earnings with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Earnings.
 * @return {Object} : updated Earnings. {status, message, data}
 */
const updateEarnings = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      earningsSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEarnings = await dbService.updateOne(Earnings,query,dataToUpdate);
    if (!updatedEarnings){
      return res.recordNotFound();
    }
    return res.success({ data :updatedEarnings });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Earnings with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Earningss.
 * @return {Object} : updated Earningss. {status, message, data}
 */
const bulkUpdateEarnings = async (req,res)=>{
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
    let updatedEarnings = await dbService.updateMany(Earnings,filter,dataToUpdate);
    if (!updatedEarnings){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedEarnings } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Earnings with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Earnings.
 * @return {obj} : updated Earnings. {status, message, data}
 */
const partialUpdateEarnings = async (req,res) => {
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
      earningsSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEarnings = await dbService.updateOne(Earnings, query, dataToUpdate);
    if (!updatedEarnings) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedEarnings });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Earnings from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Earnings.
 * @return {Object} : deactivated Earnings. {status, message, data}
 */
const softDeleteEarnings = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedEarnings = await dbService.updateOne(Earnings, query, updateBody);
    if (!updatedEarnings){
      return res.recordNotFound();
    }
    return res.success({ data:updatedEarnings });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Earnings from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Earnings. {status, message, data}
 */
const deleteEarnings = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedEarnings = await dbService.deleteOne(Earnings, query);
    if (!deletedEarnings){
      return res.recordNotFound();
    }
    return res.success({ data :deletedEarnings });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Earnings in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyEarnings = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedEarnings = await dbService.deleteMany(Earnings,query);
    if (!deletedEarnings){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedEarnings } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Earnings from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Earnings.
 * @return {Object} : number of deactivated documents of Earnings. {status, message, data}
 */
const softDeleteManyEarnings = async (req,res) => {
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
    let updatedEarnings = await dbService.updateMany(Earnings,query, updateBody);
    if (!updatedEarnings) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedEarnings } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addEarnings,
  bulkInsertEarnings,
  findAllEarnings,
  getEarnings,
  getEarningsCount,
  updateEarnings,
  bulkUpdateEarnings,
  partialUpdateEarnings,
  softDeleteEarnings,
  deleteEarnings,
  deleteManyEarnings,
  softDeleteManyEarnings    
};
/**
 * adminController.js
 * @description : exports action methods for admin.
 */

const Admin = require('../../model/admin');
const adminSchemaKey = require('../../utils/validation/adminValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
   
/**
 * @description : create document of Admin in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Admin. {status, message, data}
 */ 
const addAdmin = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      adminSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Admin(dataToCreate);
    let createdAdmin = await dbService.create(Admin,dataToCreate);
    return res.success({ data : createdAdmin });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Admin in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Admins. {status, message, data}
 */
const bulkInsertAdmin = async (req,res)=>{
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
    let createdAdmins = await dbService.create(Admin,dataToCreate);
    createdAdmins = { count: createdAdmins ? createdAdmins.length : 0 };
    return res.success({ data:{ count:createdAdmins.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Admin from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Admin(s). {status, message, data}
 */
const findAllAdmin = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      adminSchemaKey.findFilterKeys,
      Admin.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Admin, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundAdmins = await dbService.paginate( Admin,query,options);
    if (!foundAdmins || !foundAdmins.data || !foundAdmins.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundAdmins });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Admin from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Admin. {status, message, data}
 */
const getAdmin = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundAdmin = await dbService.findOne(Admin,query, options);
    if (!foundAdmin){
      return res.recordNotFound();
    }
    return res.success({ data :foundAdmin });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Admin.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getAdminCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      adminSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedAdmin = await dbService.count(Admin,where);
    return res.success({ data : { count: countedAdmin } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Admin with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Admin.
 * @return {Object} : updated Admin. {status, message, data}
 */
const updateAdmin = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      adminSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAdmin = await dbService.updateOne(Admin,query,dataToUpdate);
    if (!updatedAdmin){
      return res.recordNotFound();
    }
    return res.success({ data :updatedAdmin });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Admin with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Admins.
 * @return {Object} : updated Admins. {status, message, data}
 */
const bulkUpdateAdmin = async (req,res)=>{
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
    let updatedAdmin = await dbService.updateMany(Admin,filter,dataToUpdate);
    if (!updatedAdmin){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedAdmin } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Admin with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Admin.
 * @return {obj} : updated Admin. {status, message, data}
 */
const partialUpdateAdmin = async (req,res) => {
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
      adminSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedAdmin = await dbService.updateOne(Admin, query, dataToUpdate);
    if (!updatedAdmin) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedAdmin });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Admin from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Admin.
 * @return {Object} : deactivated Admin. {status, message, data}
 */
const softDeleteAdmin = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedAdmin = await dbService.updateOne(Admin, query, updateBody);
    if (!updatedAdmin){
      return res.recordNotFound();
    }
    return res.success({ data:updatedAdmin });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Admin from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Admin. {status, message, data}
 */
const deleteAdmin = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedAdmin = await dbService.deleteOne(Admin, query);
    if (!deletedAdmin){
      return res.recordNotFound();
    }
    return res.success({ data :deletedAdmin });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Admin in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyAdmin = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedAdmin = await dbService.deleteMany(Admin,query);
    if (!deletedAdmin){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedAdmin } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Admin from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Admin.
 * @return {Object} : number of deactivated documents of Admin. {status, message, data}
 */
const softDeleteManyAdmin = async (req,res) => {
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
    let updatedAdmin = await dbService.updateMany(Admin,query, updateBody);
    if (!updatedAdmin) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedAdmin } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addAdmin,
  bulkInsertAdmin,
  findAllAdmin,
  getAdmin,
  getAdminCount,
  updateAdmin,
  bulkUpdateAdmin,
  partialUpdateAdmin,
  softDeleteAdmin,
  deleteAdmin,
  deleteManyAdmin,
  softDeleteManyAdmin    
};
/**
 * walletValidation.js
 * @description :: validate each post and put request as per wallet model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');
const authConstantDefault = require('../../constants/authConstant');    
const { USER_TYPES } = require('../../constants/authConstant');
const { convertObjectToEnum } = require('../common');   

/** validation keys and properties of wallet */
exports.schemaKeys = joi.object({
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  walletAddress: joi.string().allow(null).allow(''),
  walletAmount: joi.number().integer().allow(0),
  isActive: joi.boolean(),
  userType: joi.number().allow(0),
  email: joi.string().allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date().options({ convert: true })
  })
}).unknown(true);

/** validation keys and properties of wallet for updation */
exports.updateSchemaKeys = joi.object({
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  walletAddress: joi.string().allow(null).allow(''),
  walletAmount: joi.number().integer().allow(0),
  isActive: joi.boolean(),
  userType: joi.number().allow(0),
  email: joi.string().allow(null).allow(''),
  mobileNo: joi.string().allow(null).allow(''),
  password: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  resetPasswordLink: joi.object({
    code:joi.string(),
    expireTime:joi.date().options({ convert: true })
  }),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of wallet for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      userId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      walletAddress: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      walletAmount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      mobileNo: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      password: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

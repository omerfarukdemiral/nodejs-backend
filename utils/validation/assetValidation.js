/**
 * assetValidation.js
 * @description :: validate each post and put request as per asset model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of asset */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  pool: joi.number().integer().required(),
  minInvestment: joi.number().integer().required(),
  maxInvestment: joi.number().integer().allow(0),
  category: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  subCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of asset for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  pool: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  minInvestment: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  maxInvestment: joi.number().integer().allow(0),
  category: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  subCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of asset for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      pool: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      minInvestment: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      maxInvestment: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      category: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      subCategory: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

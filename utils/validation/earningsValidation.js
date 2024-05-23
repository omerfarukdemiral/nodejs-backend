/**
 * earningsValidation.js
 * @description :: validate each post and put request as per earnings model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of earnings */
exports.schemaKeys = joi.object({
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  assetId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  monthlEarnings: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of earnings for updation */
exports.updateSchemaKeys = joi.object({
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  assetId: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  monthlEarnings: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of earnings for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      userId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      assetId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      monthlEarnings: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);

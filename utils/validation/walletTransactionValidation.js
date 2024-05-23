/**
 * walletTransactionValidation.js
 * @description :: validate each post and put request as per walletTransaction model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of walletTransaction */
exports.schemaKeys = joi.object({
  fromwalletId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  towalletId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  transactionAmount: joi.number().integer().required(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of walletTransaction for updation */
exports.updateSchemaKeys = joi.object({
  fromwalletId: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  towalletId: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  transactionAmount: joi.number().integer().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of walletTransaction for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      fromwalletId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      towalletId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      transactionAmount: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
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

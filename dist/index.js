'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class ValidationError$1 extends Error {
  constructor(params = "", code = 0, statusCode = 404) {
    super();
    let paramsObj = {};
    if (typeof params === "string") {
      paramsObj.message = params;
      paramsObj.code = code;
      paramsObj.statusCode = statusCode;
    } else {
      paramsObj = params;
    }
    this.statusCode = paramsObj.statusCode ?? 404;
    this.code = paramsObj.code ?? 0;
    this.message = paramsObj.message ?? "";
    this.data = paramsObj.data ?? {};
    this.headers = paramsObj.headers ?? {};
  }
  getMessage() {
    return this.message;
  }
  getStatusCode() {
    return this.statusCode;
  }
  getCode() {
    return this.code;
  }
  getData() {
    return this.data;
  }
  getHeaders() {
    return this.headers;
  }
}

const validationDefaultOption = {
  isFieldNameMode: true,
  defaultCode: 400
};
const isObject = (obj) => obj != null && typeof obj === "object" && !Array.isArray(obj);
const defaultMessages = {
  required: "the value is empty",
  boolean: "the value not boolean value",
  array: "the value not array value",
  object: "the value not object value",
  minlength: "the number of characters in the line is less !%",
  maxlength: "the number of characters in the line is more !%",
  rangelength: "the number of characters in a line outside the range from !% to !% \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
  range: "the value is not in the range from !% to !%",
  min: "the value less than minimum value !%",
  max: "the value is greater than the maximum value !%",
  email: "the email address is not correct",
  url: "the url is not correct",
  dateIso: "the ISO date format is not correct",
  digits: "the value is not an integer",
  number: "the value is not a decimal number",
  equal: "field values are not full equivalent",
  eql: "field values are not  eql",
  regexp: "the field value does not match the pattern",
  phone: "the phone number is not correct",
  depends: "the custom handler error",
  rangedate: "the date out of range !% - !%"
};
const required = (params = {}) => ({ param: true, ...params });
const boolean = (params = {}) => ({ param: true, ...params });
const number = (params = {}) => ({ param: true, ...params });
const array = (params = {}) => ({ param: true, ...params });
const object = (params = {}) => ({ param: true, ...params });
const minlength = (min2 = 0, params = {}) => ({ param: min2, ...params });
const maxlength = (max2 = 255, params = {}) => ({ param: max2, ...params });
const rangelength = (range2 = [0, 255], params = {}) => ({ param: range2, ...params });
const range = (range2 = [0, 65535], params = {}) => ({ param: range2, ...params });
const min = (min2 = 0, params = {}) => ({ param: min2, ...params });
const max = (max2 = 65535, params = {}) => ({ param: max2, ...params });
const email = (params = {}) => ({ param: true, ...params });
const url = (params = {}) => ({ param: true, ...params });
const dateIso = (params = {}) => ({ param: true, ...params });
const digits = (params = {}) => ({ param: true, ...params });
const equal = (value, params = {}) => ({ param: value, ...params });
const eql = (value, params = {}) => ({ param: value, ...params });
const regexp = (regexp2 = /\d/i, params = {}) => ({ param: regexp2, ...params });
const uaPhone = (params = {}) => ({ param: true, ...params });
const depends = (handler = (value, options = { param: true }) => true, params = {}) => ({ param: handler, ...params });
const rangedate = (range2 = [new Date(), new Date()], params = {}) => ({ param: range2, ...params });
class Validation {
  constructor(model = {}, options = {}) {
    this.validatedParams = {};
    const opt = Object.assign({}, validationDefaultOption, options);
    this.validationModel = this.executeFunctionInModel(model);
    this.isFieldNameMode = opt.isFieldNameMode;
    this.defaultStatusCode = opt.defaultStatusCode;
  }
  setModel(model = {}) {
    this.validationModel = this.executeFunctionInModel(model);
  }
  executeFunctionInModel(model) {
    for (const key in model) {
      if (model.hasOwnProperty(key)) {
        if (isObject(model[key])) {
          model[key] = this.executeFunctionInModel(model[key]);
        }
        model[key] = typeof model[key] === "function" && key !== "param" ? model[key]() : model[key];
      }
    }
    return model;
  }
  validate(params, filters = []) {
    const schema = this.lastLevelCut(this.validationModel);
    if (!schema) {
      throw new ValidationError$1({
        message: `invalid validation model`,
        code: 1,
        statusCode: this.defaultStatusCode
      });
    }
    return this.validateRecursively(schema, params, filters);
  }
  validateRecursively(schema, params, filters = [], deepKey = []) {
    for (const key in schema) {
      if (!this.isKeyDeepInFilters([...deepKey, key], filters) && filters.length) {
        continue;
      }
      const value = params[key] ?? void 0;
      if (isObject(schema[key])) {
        this.validateRecursively(schema[key], value, filters, [...deepKey, key]);
      } else {
        this.validateParam([...deepKey, key], value, filters);
        this.setValidatedValue([...deepKey, key], value);
      }
    }
    return true;
  }
  setValidatedValue(deepKey = [], value) {
    const len = deepKey.length;
    deepKey.reduce((ac, key, i) => {
      if (i + 1 === len) {
        ac[key] = value;
      } else {
        if (!ac.hasOwnProperty(key)) {
          ac[key] = {};
        }
      }
      return ac[key];
    }, this.validatedParams);
  }
  lastLevelCut(obj, output = {}) {
    if (!obj) {
      return void 0;
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (isObject(value) && !value.hasOwnProperty("param")) {
          output[key] = this.lastLevelCut(value);
        } else {
          return void 0;
        }
      }
    }
    return output;
  }
  validateParam(deepKey, value, filters) {
    this.currentField = deepKey.join(".");
    const validators = this.getDeepValidators(deepKey);
    for (const validator in validators) {
      if (!validators.hasOwnProperty(validator) || typeof this[validator] !== "function") {
        throw new ValidationError$1({
          message: `Row ${deepKey.join(".")}: validator ${validator} not implemented`,
          code: 2,
          statusCode: this.defaultStatusCode
        });
      }
      let options;
      if (isObject(validators[validator])) {
        options = validators[validator];
      } else {
        throw new ValidationError$1({
          message: `validator should be function or object`,
          code: 1,
          statusCode: this.defaultStatusCode
        });
      }
      if (!options.hasOwnProperty("param")) {
        throw new ValidationError$1({
          message: `validator options should have param key`,
          code: 1,
          statusCode: this.defaultStatusCode
        });
      }
      if (value !== "" && value !== void 0 && value !== null && !Number.isNaN(value) || validator === "required") {
        this[validator](value, options);
      }
    }
  }
  getDeepValidators(deepKeys) {
    return deepKeys.reduce((accumulator, key) => {
      if (!accumulator.hasOwnProperty(key)) {
        throw new ValidationError$1({
          message: `There no validators for ${deepKeys.join(".")}`,
          code: 1,
          statusCode: this.defaultStatusCode
        });
      }
      return accumulator[key];
    }, this.validationModel);
  }
  isKeyDeepInFilters(deepKey, filters, deep = 0) {
    const key = deepKey[deep];
    if (!key) {
      return false;
    }
    let isExists = filters.includes(key);
    const objects = filters.filter((v) => isObject(v));
    for (const obj of objects) {
      if (obj.hasOwnProperty(key)) {
        if (deep < deepKey.length - 1) {
          isExists = this.isKeyDeepInFilters(deepKey, obj[key], ++deep);
        } else {
          isExists = true;
        }
      }
    }
    return isExists;
  }
  getValidatedParams() {
    return this.validatedParams;
  }
  getInputParams() {
    return this.inputParams;
  }
  adaptToErrorMessage(options, defaultMessage, defaultCode, replace = []) {
    const errorMessageObj = Object.assign({
      message: defaultMessage,
      code: defaultCode,
      statusCode: this.defaultStatusCode
    }, options);
    errorMessageObj.message = this.messageReplace(errorMessageObj.message, replace);
    return errorMessageObj;
  }
  valueLength(value) {
    let length;
    if (typeof value === "string" || Array.isArray(value)) {
      length = value.length;
    } else if (value instanceof Set || value instanceof Map) {
      length = value.size;
    } else {
      throw new ValidationError$1({
        message: `the value has no length`,
        code: 3,
        statusCode: this.defaultStatusCode
      });
    }
    return length;
  }
  messageReplace(message, arrReplace = []) {
    arrReplace.map((v) => message = message.replace("!%", v));
    return this.isFieldNameMode ? `${this.currentField}: ${message}` : message;
  }
  required(value, options) {
    if (typeof value === "undefined" || Number.isNaN(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.required, 4));
    }
  }
  boolean(value, options) {
    if (typeof value !== "boolean") {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.boolean, 5));
    }
  }
  array(value, options) {
    if (!Array.isArray(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.array, 5));
    }
  }
  object(value, options) {
    if (!isObject(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.object, 5));
    }
  }
  minlength(value, options) {
    const length = this.valueLength(value);
    if (length < options.param) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.minlength, 6, [options.param]));
    }
  }
  maxlength(value, options) {
    const length = this.valueLength(value);
    if (length > options.param) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.maxlength, 7, [options.param]));
    }
  }
  rangelength(value, options) {
    if (!Array.isArray(options.param)) {
      throw new ValidationError$1({
        message: `options for rangelength should be an array`,
        code: 8,
        statusCode: this.defaultStatusCode
      });
    }
    const length = this.valueLength(value);
    if (length < options.param[0] || length > options.param[1]) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.rangelength, 9, [...options.param]));
    }
  }
  min(value, options) {
    if (typeof options.param !== "number") {
      throw new ValidationError$1({
        message: `options for min should be should be a number`,
        code: 10,
        statusCode: this.defaultStatusCode
      });
    }
    if (typeof value !== "number") {
      throw new ValidationError$1({
        message: `value for min should be should be a number`,
        code: 10,
        statusCode: this.defaultStatusCode
      });
    }
    if (value < options.param) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.min, 11, [String(options.param)]));
    }
  }
  max(value, options) {
    if (typeof options.param !== "number") {
      throw new ValidationError$1({
        message: `options for max should be should be a number`,
        code: 12,
        statusCode: this.defaultStatusCode
      });
    }
    if (typeof value !== "number") {
      throw new ValidationError$1({
        message: `value for min should be should be a number`,
        code: 12,
        statusCode: this.defaultStatusCode
      });
    }
    if (value > options.param) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.max, 13, [String(options.param)]));
    }
  }
  range(value, options) {
    if (!Array.isArray(options.param) || typeof options.param[0] !== "number" || typeof options.param[1] !== "number") {
      throw new ValidationError$1({
        message: `options for range should be should be an array`,
        code: 12,
        statusCode: this.defaultStatusCode
      });
    }
    if (typeof value !== "number") {
      throw new ValidationError$1({
        message: `value for range should be should be a number`,
        code: 12,
        statusCode: this.defaultStatusCode
      });
    }
    if (value < options.param[0] || value > options.param[1]) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.range, 15, [...options.param]));
    }
  }
  email(value, options) {
    const regexp2 = /^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
    if (!regexp2.test(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.email, 16));
    }
  }
  url(value, options) {
    const regexp2 = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]-*)*[a-z0-9]+)(?:\.(?:[a-z0-9]-*)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i;
    if (!regexp2.test(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.url, 17));
    }
  }
  dateIso(value, options) {
    const regexp2 = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/i;
    if (!regexp2.test(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.dateIso, 18));
    }
  }
  digits(value, options) {
    if (typeof value !== "number" || value !== Math.round(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.digits, 19));
    }
  }
  number(value, options) {
    if (typeof value !== "number") {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.number, 20));
    }
  }
  equal(value, options) {
    if (value !== options.param) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.equal, 21));
    }
  }
  eql(value, options) {
    if (typeof value !== typeof options.param) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.eql, 22));
    }
    if (typeof value === "object") {
      if (JSON.stringify(value) !== JSON.stringify(options.param)) {
        throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.eql, 22));
      }
    } else {
      if (value !== options.param) {
        throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.eql, 22));
      }
    }
  }
  regexp(value, options) {
    if (!(options.param instanceof RegExp)) {
      throw new ValidationError$1({
        message: `options for regexp should be should be a regex`,
        code: 22,
        statusCode: this.defaultStatusCode
      });
    }
    if (!options.param.test(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.regexp, 23));
    }
  }
  uaPhone(value, options) {
    const regexp2 = /^\+380[5-9]{1}[0-9]{1}[0-9]{3}[0-9]{2}[0-9]{2}$/i;
    if (!regexp2.test(value)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.phone, 24));
    }
  }
  rangedate(value, options) {
    if (!Array.isArray(options.param)) {
      throw new ValidationError$1({
        message: `options for rangedate should be should be an array`,
        code: 25,
        statusCode: this.defaultStatusCode
      });
    }
    const date = new Date(value);
    let isValid = true;
    if (options.param[0] && date < new Date(options.param[0])) {
      isValid = false;
    }
    if (options.param[0] && date > new Date(options.param[1])) {
      isValid = false;
    }
    if (!isValid) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.rangedate, 26, [...options.param]));
    }
  }
  depends(value, options) {
    if (typeof options.param !== "function") {
      throw new ValidationError$1({
        message: `options depends should be should be a function`,
        code: 24,
        statusCode: this.defaultStatusCode
      });
    }
    if (!options.param(value, options)) {
      throw new ValidationError$1(this.adaptToErrorMessage(options, defaultMessages.depends, 27));
    }
  }
}

class ValidationError extends Error {
  constructor(params = "", code = 0, statusCode = 404) {
    super();
    let paramsObj = {};
    if (typeof params === "string") {
      paramsObj.message = params;
      paramsObj.code = code;
      paramsObj.statusCode = statusCode;
    } else {
      paramsObj = params;
    }
    this.statusCode = paramsObj.statusCode ?? 404;
    this.code = paramsObj.code ?? 0;
    this.message = paramsObj.message ?? "";
    this.data = paramsObj.data ?? {};
    this.headers = paramsObj.headers ?? {};
  }
  getMessage() {
    return this.message;
  }
  getStatusCode() {
    return this.statusCode;
  }
  getCode() {
    return this.code;
  }
  getData() {
    return this.data;
  }
  getHeaders() {
    return this.headers;
  }
}

const validator = () => new Validation();

exports.Validation = Validation;
exports.ValidationError = ValidationError;
exports.array = array;
exports.boolean = boolean;
exports.dateIso = dateIso;
exports.depends = depends;
exports.digits = digits;
exports.email = email;
exports.eql = eql;
exports.equal = equal;
exports.max = max;
exports.maxlength = maxlength;
exports.min = min;
exports.minlength = minlength;
exports.number = number;
exports.object = object;
exports.range = range;
exports.rangedate = rangedate;
exports.rangelength = rangelength;
exports.regexp = regexp;
exports.required = required;
exports.uaPhone = uaPhone;
exports.url = url;
exports.validator = validator;

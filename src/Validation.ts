import {ValidationError} from "@/ValidationError";
import type {ValidationErrorMessage} from "@/ValidationError";

/**
 * Options for validators
 */
export interface ValidatorsOptions {
    message?: string, // Error message
    param: any, // Any params to validator
    code?: number, // Error code
    statusCode?: number // Error status code
}

/**
 * Filters that show - what need validate
 */
export type ValidationFilters = Array<string|Record<string, ValidationFilters>>;
export type validators = "required"|"boolean"|"array"|"object"|"minlength"|"range"|"min"|"max"|"email"|"url"|"dateIso"|"digits"|"number"|"equal"|"eql"|"regexp"|"phone"|"depends"|"rangedate";
/**
 * Validation model
 */
export interface ValidationModel {
    [x:validators|string]: ((...params: any[]) => ValidatorsOptions)|ValidatorsOptions|ValidationModel
}

/**
 * Default options for validation class
 */
const validationDefaultOption = {
    isFieldNameMode: true,
    defaultCode: 400
};

/**
 * Check is param object
 * @param obj
 */
const isObject = (obj: any): boolean => obj != null && typeof obj === 'object' && !Array.isArray(obj);

/**
 * Validators default messages
 * !% replace with values
 */
const defaultMessages = {
    required:  "the value is empty",
    boolean: "the value not boolean value",
    array: "the value not array value",
    object: "the value not object value",
    minlength: "the number of characters in the line is less !%",
    maxlength: "the number of characters in the line is more !%",
    rangelength: "the number of characters in a line outside the range from !% to !% символов",
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

// Validators with default options
/**
 * Value is required
 */
export const required = (params = {}) => ({param: true, ...params});

/**
 * Value has boolean type
 */
export const boolean = (params = {}) => ({param: true, ...params});

/**
 * Value has number type
 */
export const number = (params = {}) => ({param: true, ...params});

/**
 * Value is array
 */
export const array = (params = {}) => ({param: true, ...params});

/**
 * Value is object
 */
export const object = (params = {}) => ({param: true, ...params});

/**
 * Value has min length > param
 */
export const minlength = (min = 0,params = {}) => ({param: min, ...params});

/**
 * Value has max length < param
 */
export const maxlength = (max = 255,params = {}) => ({param: max, ...params});

/**
 * Value has length in range: [min, max]
 */
export const rangelength = (range = [0, 255], params = {}) => ({param: range, ...params});

/**
 * The value is a digit and in the range: [min, max]
 */
export const range = (range = [0, 65535], params = {}) => ({param: range, ...params});

/**
 * The value higher then param
 */
export const min = (min = 0,params = {}) => ({param: min, ...params});

/**
 * The value lower then param
 */
export const max = (max = 65535,params = {}) => ({param: max, ...params});

/**
 * Value is valid email
 */
export const email = (params = {}) => ({param: true, ...params});

/**
 * Value is valid url
 */
export const url = (params = {}) => ({param: true, ...params});

/**
 * Value is valid date stirng in ISO format
 */
export const dateIso = (params = {}) => ({param: true, ...params});

/**
 * Value is only digits
 */
export const digits = (params = {}) => ({param: true, ...params});

/**
 * Value equal to param
 */
export const equal = (value: any, params = {}) => ({param: value, ...params});

/**
 * Value equal to param
 */
export const eql = (value: any, params = {}) => ({param: value, ...params});

/**
 * The value matches a regular expression
 */
export const regexp = (regexp: RegExp = /\d/i, params = {}) => ({param: regexp, ...params});

/**
 * The value is ua phone
 */
export const uaPhone = (params = {}) => ({param: true, ...params});

/**
 * Value check by handler
 */
export const depends = (
    handler = (value: any, options: ValidatorsOptions = {param: true}): boolean => true,
    params = {}
) => ({param: handler, ...params});

/**
 * The value is Date and in date range: [startDate, endDate]
 */
export const rangedate = (range = [new Date(), new Date()], params = {}) => ({param: range, ...params});

/**
 * @class Validations
 * Beckend system for validation input data
 * Deep validation model support
 */
export default class Validation<T = Record<string, any>> {

    /**
     * Is show field names
     */
    private readonly isFieldNameMode: boolean;

    /**
     * Default statusCode
     */
    private readonly defaultStatusCode: number;

    /**
     * Input params
     */
    private inputParams: Record<string, any>;

    /**
     * Only params that has to validate
     */
    private validatedParams: Record<keyof T, any> = {} as Record<keyof T|keyof ValidationModel, any>;

    /**
     * Validation model
     * {"name":{required, minlength: 3}}
     */
    private validationModel: ValidationModel;

    /**
     * Current field
     * @private
     */
    private currentField: string;

    /**
     * @constructor
     * @param model - validation model
     * @param options - validation default options
     */
    public constructor(
        model: ValidationModel = {},
        options: {
            isFieldNameMode?: boolean,
            defaultStatusCode?: number
        } = {}
    ) {
        const opt = Object.assign({}, validationDefaultOption, options);
        this.validationModel = this.executeFunctionInModel(model);
        this.isFieldNameMode = <boolean>opt.isFieldNameMode;
        this.defaultStatusCode = <number>opt.defaultStatusCode;
    }

    /**
     * Set validation model
     * @param model - validations model ruls
     */
    public setModel(model: ValidationModel = {}) {
        this.validationModel = this.executeFunctionInModel(model);
    }

    /**
     * Execute functions in validation model
     * @param model
     * @private
     */
    private executeFunctionInModel(model: ValidationModel) {
        for(const key in model) {
            if(model.hasOwnProperty(key)) {

                if(isObject(model[key])) {

                    model[key] = this.executeFunctionInModel(model[key] as ValidationModel);
                }

                // @ts-ignore
                model[key] = typeof model[key] === "function" && key !== "param" ? model[key]() : model[key];
            }
        }

        return model;
    }

    /**
     * Validate all object
     * @param params - input object {"test": 123, "user": {"fio":"1", "phone":"2"}}
     * @param filters - array of keys if need
     * @returns
     * @throws ValidationError
     */
    public validate(
        params: T|Record<string, any>,
        filters: ValidationFilters = []
    ): boolean {
        this.validatedParams = {} as Record<keyof T, any>;
        const schema = this.lastLevelCut(this.validationModel);

        if(!schema) {
            throw new ValidationError({
                message: `invalid validation model`,
                code: 1,
                statusCode: this.defaultStatusCode
            });
        }

        return this.validateRecursively(schema, params, filters);
    }

    /**
     * Validate all object
     * @param params - input object {"test": 123, "user": {"fio":"1", "phone":"2"}}
     * @param filters - array of keys if need
     * @param deepKey - deep key
     * @param schema - deep key
     * @returns
     * @throws ValidationError
     */
    private validateRecursively(
        schema: Record<string, any>,
        params: Record<string, any>,
        filters: ValidationFilters = [],
        deepKey: Array<string> = [],
    ): boolean {

        for(const key in schema) {

            if(!this.isKeyDeepInFilters([...deepKey, key], filters) && filters.length) {
                continue;
            }

            const value = params?.[key] ?? undefined;

            if(isObject(schema[key])) {
                this.validateRecursively(schema[key], value, filters, [...deepKey, key]);

                if(Object.keys(schema[key]).length === 0) {
                    this.setValidatedValue([...deepKey, key], value);
                }
            } else {
                this.validateParam([...deepKey, key], value, filters);
                this.setValidatedValue([...deepKey, key], value);
            }
        }

        return true;
    }

    /**
     * Set validated key
     * @param deepKey
     * @param value
     * @private
     */
    private setValidatedValue(deepKey: Array<string> = [], value: any): void {
        const len = deepKey.length;

        deepKey.reduce((ac, key, i: number) => {

            if((i + 1) === len) {
                ac[key] = value;
            } else {

                if(!ac.hasOwnProperty(key)) {
                    ac[key] = {};
                }
            }

            return ac[key];
        }, this.validatedParams);
    }

    /**
     * Cut last level of object and replace by undefined
     * @param obj - input object (ValidationModel)
     * @param output - output
     * @private
     */

    private lastLevelCut(obj: Record<string, any>|undefined, output = {}):Record<string, any>|undefined  {
        if(!obj) {
            return undefined;
        }

        for(const key in obj as Record<string, any>) {

            if(obj.hasOwnProperty(key)) {
                const value = obj[key];

                if(isObject(value) && !value.hasOwnProperty("param")) {
                    output[key] = this.lastLevelCut(value);
                } else {

                    return undefined;
                }
            }
        }

        return output;
    }

    /**
     * Validate param
     * @param deepKey array of keys
     * @param value validated value
     * @param filters validated filters
     * @returns
     */

    private validateParam(
        deepKey: Array<string>,
        value: any,
        filters: ValidationFilters
    ): void {
        this.currentField = deepKey.join(".");
        const validators = this.getDeepValidators(deepKey);

        for(const validator in validators) {

            if(!validators.hasOwnProperty(validator) || typeof this[validator] !== "function") {
                throw new ValidationError({
                    message: `Row ${deepKey.join(".")}: validator ${validator} not implemented`,
                    code: 2,
                    statusCode: this.defaultStatusCode
                });
            }
            let options;

            if(isObject(validators[validator])) {
                options = validators[validator];
            } else {
                throw new ValidationError({
                    message: `validator should be function or object`,
                    code: 1,
                    statusCode: this.defaultStatusCode
                });
            }

            if(!options.hasOwnProperty("param")) {
                throw new ValidationError({
                    message: `validator options should have param key`,
                    code: 1,
                    statusCode: this.defaultStatusCode
                });
            }

            // Если пустая строка, то проходит и require и другие валидаторы
            if((
                value !== undefined
                && value !== null
                && !Number.isNaN(value)
            ) || validator === 'required') {
                this[validator](value, options);
            }
        }
    }

    /**
     * Get ruls for deep Keys aray
     * @param deepKeys - keys array
     * @private
     */
    private getDeepValidators(deepKeys: Array<string>) {

        return deepKeys.reduce((accumulator, key) => {

            if(!accumulator.hasOwnProperty(key)) {
                throw new ValidationError({
                    message: `There no validators for ${deepKeys.join(".")}`,
                    code: 1,
                    statusCode: this.defaultStatusCode
                });
            }

            return accumulator[key] as unknown as ValidationModel;
        }, this.validationModel);
    }

    /**
     * Check is key in filters
     * @param deepKey keys array
     * @param filters - filters array
     * @param deep - deep range
     * @private
     */
    public isKeyDeepInFilters(
        deepKey: Array<string>,
        filters: ValidationFilters,
        deep: number = 0
    ): boolean {
        const key = deepKey[deep];

        if(!key) {
            return false;
        }

        let isExists = filters.includes(key);
        const objects = filters.filter(v => isObject(v));

        for(const obj of objects) {
            if(obj.hasOwnProperty(key)) {

                if(deep < (deepKey.length - 1)) {
                    isExists = this.isKeyDeepInFilters(deepKey, obj[key], ++deep);
                } else {
                    isExists = true;
                }
            }
        }

        return isExists;
    }

    /**
     * Get only validated params
     * @returns params, that have been validated
     */
    public getValidatedParams() {
        return this.validatedParams
    }

    /**
     * Get input params
     * @returns all input params
     */
    public getInputParams() {
        return this.inputParams;
    }

    /**
     * Adapt options to ErrorMessage
     * @param options - validator options
     * @param defaultMessage - default string message
     * @param defaultCode - default code
     * @param replace - addition data for replace !% in message
     * @private
     */

    private adaptToErrorMessage(
        options: ValidatorsOptions,
        defaultMessage: string,
        defaultCode: number,
        replace: Array<string> = []
    ): ValidationErrorMessage {
        const errorMessageObj =  Object.assign({
            message: defaultMessage,
            code: defaultCode,
            statusCode: this.defaultStatusCode
        }, options);
        errorMessageObj.message = this.messageReplace(errorMessageObj.message, replace);

        return errorMessageObj;
    }

    /**
     * determine the length
     * @param value
     * @returns length
     * @private
     */
    private valueLength(value: any): number {
        let length;

        if(typeof value === "string" || Array.isArray(value)) {
            length = value.length;
        } else if(value instanceof Set || value instanceof Map) {
            length = value.size
        } else {
            throw new ValidationError({
                message: `the value has no length`,
                code: 3,
                statusCode: this.defaultStatusCode
            });
        }

        return length;
    }

    /**
     * Replace insert in error massage
     * @param message input message string
     * @param arrReplace - array of replace value
     */
    private messageReplace(message: string, arrReplace: Array<string> = []) {
        arrReplace.map(v => message = message.replace('!%', v));

        return this.isFieldNameMode ? `${this.currentField}: ${message}` : message;
    }

    /**
     * Required
     * @param value - input value
     * @param options - validator`s options
     * @returns
     * @throws ValidationError
     */
    private required(value: any, options: ValidatorsOptions): void {

        if(typeof value === "undefined" || Number.isNaN(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.required, 4));
        }
    }

    /**
     * Boolean
     * @param value - input value
     * @param options - validator`s options
     */
    private boolean(value: any, options: ValidatorsOptions) {

        if(typeof value !== "boolean") {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.boolean, 5));
        }
    }

    /**
     * array
     * @param value - input value
     * @param options - validator`s options
     */
    private array(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.array, 5));
        }
    }

    /**
     * object
     * @param value - input value
     * @param options - validator`s options
     */
    private object(value: any, options: ValidatorsOptions) {

        if(!isObject(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.object, 5));
        }
    }

    /**
     * Minlength
     * @param value - input value
     * @param options - validator`s options
     */
    private minlength(value: any, options: ValidatorsOptions) {
        const length = this.valueLength(value);

        if(length < options.param) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.minlength, 6, [options.param])
            );
        }
    }

    /**
     * Maxlength
     * @param value - input value
     * @param options - validator`s options
     */
    private maxlength(value: any, options: ValidatorsOptions) {
        const length = this.valueLength(value);

        if(length > options.param) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.maxlength, 7, [options.param])
            );
        }
    }

    /**
     *  Check range of string length
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private rangelength(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(options.param)) {
            throw new ValidationError({
                message: `options for rangelength should be an array`,
                code: 8,
                statusCode: this.defaultStatusCode
            });
        }

        const length = this.valueLength(value);

        if(length < options.param[0] || length > options.param[1]) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.rangelength, 9, [...options.param])
            );
        }
    }

    /**
     * Check min value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private min(value: any, options: ValidatorsOptions) {

        if(typeof options.param !== "number") {
            throw new ValidationError({
                message: `options for min should be should be a number`,
                code: 10,
                statusCode: this.defaultStatusCode
            });
        }

        if(typeof value !== "number") {
            throw new ValidationError({
                message: `value for min should be should be a number`,
                code: 10,
                statusCode: this.defaultStatusCode
            });
        }

        if(value < options.param) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.min, 11, [String(options.param)])
            );
        }
    }

    /**
     * check max value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private max(value: any, options: ValidatorsOptions) {

        if(typeof options.param !== "number") {
            throw new ValidationError({
                message: `options for max should be should be a number`,
                code: 12,
                statusCode: this.defaultStatusCode
            });
        }

        if(typeof value !== "number") {
            throw new ValidationError({
                message: `value for min should be should be a number`,
                code: 12,
                statusCode: this.defaultStatusCode
            });
        }

        if(value > options.param) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.max, 13, [String(options.param)])
            );
        }
    }

    /**
     * check range value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private range(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(options.param)
            || typeof options.param[0] !== "number"
            || typeof options.param[1] !== "number"
        ) {
            throw new ValidationError({
                message: `options for range should be should be an array`,
                code: 12,
                statusCode: this.defaultStatusCode
            });
        }

        if(typeof value !== "number") {
            throw new ValidationError({
                message: `value for range should be should be a number`,
                code: 12,
                statusCode: this.defaultStatusCode
            });
        }

        if(value < options.param[0] || value > options.param[1]) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.range, 15, [...options.param])
            );
        }
    }

    /**
     * Check email format
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private email(value: any, options: ValidatorsOptions) {
        const regexp = /^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;

        if(!regexp.test(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.email, 16));
        }
    }

    /**
     *  Check is string url
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private url(value: any, options: ValidatorsOptions) {
        const regexp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]-*)*[a-z0-9]+)(?:\.(?:[a-z0-9]-*)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i

        if(!regexp.test(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.url, 17));
        }
    }

    /**
     *  Check date ISO fromat
     * @param value - input value
     * @param options - validator`s options
     *
     * @return {Boolean}
     */
    private dateIso(value: any, options: ValidatorsOptions) {
        const regexp = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/i;

        if(!regexp.test(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.dateIso, 18));
        }
    }

    /**
     * Check integer
     * @param value
     * @param {Object} options
     * @return {Boolean}
     */
    private digits(value: any, options: ValidatorsOptions) {

        if(typeof value !== "number" || value !== Math.round(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.digits, 19));
        }
    }

    /**
     * Check number
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private number(value: any, options: ValidatorsOptions) {

        if(typeof value !== "number") {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.number, 20));
        }
    }

    /**
     *  Check equal 2 values
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private equal(value: any, options: ValidatorsOptions) {

        if(value !== options.param) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.equal, 21));
        }
    }

    /**
     * Check equal 2 values
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private eql(value: any, options: ValidatorsOptions) {

        if(typeof value !== typeof options.param) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.eql, 22));
        }

        if(typeof value === "object") {
            if(JSON.stringify(value) !== JSON.stringify(options.param)) {
                throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.eql, 22));
            }
        } else {
            if(value !== options.param) {
                throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.eql, 22));
            }
        }
    }

    /**
     * test to reqexp
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private regexp(value: any, options: ValidatorsOptions) {

        if(!(options.param instanceof RegExp)) {
            throw new ValidationError({
                message: `options for regexp should be should be a regex`,
                code: 22,
                statusCode: this.defaultStatusCode
            });
        }

        if(!options.param.test(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.regexp, 23));
        }
    }

    /**
     *  check phone format +380971234567
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private uaPhone(value: any, options: ValidatorsOptions) {
        const regexp = /^\+380[5-9]{1}[0-9]{1}[0-9]{3}[0-9]{2}[0-9]{2}$/i;

        if(!regexp.test(value)) {
            throw new ValidationError(this.adaptToErrorMessage(options, defaultMessages.phone, 24));
        }
    }

    /**
     *  Check range date, date can be null - so it not influence
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private rangedate(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(options.param)) {
            throw new ValidationError({
                message: `options for rangedate should be should be an array`,
                code: 25,
                statusCode: this.defaultStatusCode
            });
        }

        const date = new Date(value);
        let isValid = true;

        if(options.param[0] && date < new Date(options.param[0])) {
            isValid = false;
        }

        if(options.param[0] && date > new Date(options.param[1])) {
            isValid = false;
        }

        if(!isValid) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.rangedate, 26, [...options.param])
            );
        }
    }

    /**
     * Check by out side depends function
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private depends(value: any, options: ValidatorsOptions) {

        if(typeof options.param !== "function") {
            throw new ValidationError({
                message: `options depends should be should be a function`,
                code: 24,
                statusCode: this.defaultStatusCode
            });
        }

        if(!options.param(value, options)) {
            throw new ValidationError(
                this.adaptToErrorMessage(options, defaultMessages.depends, 27)
            );
        }
    }
}
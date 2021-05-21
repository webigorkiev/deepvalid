import isObject from "@jwn-js/easy-ash/isObject";
import ApiError from "@jwn-js/common/ApiError";
import type {ApiErrorMessage} from "@jwn-js/common/ApiError";

/**
 * Options for validators
 */
export interface ValidatorsOptions {
    message?: string,
    param: any,
    code?: number,
    statusCode?: number
}

/**
 * Filters that show - what need validate
 */
type ValidationFilters = Array<string|Record<string, ValidationFilters>>;

/**
 * Validation model
 */
interface ValidationModel {
    [x:string]: ValidationModel|ValidatorsOptions|any
}

/**
 * Default options for validation class
 */
const validationDefaultOption = {
    isFieldNameMode: true,
    defaultCode: 400
};

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
    dateISO: "the ISO date format is not correct",
    digits: "the value is not an integer",
    number: "the value is not a decimal number",
    equalTo: "field values are not equivalent",
    regexp: "the field value does not match the pattern",
    phone: "the phone number is not correct",
    depends: "the custom handler error",
    rangedate: "the date out of range !% - !%"
};

// Validators with default options
export const required = {param: true};
export const boolean = {param: true};
export const array = {param: true};
export const object = {param: true};
export const minlength = {param: 0};
export const maxlength = {param: 65535};
export const rangelength = {param: [0, 255]};
export const range = {param: [0, 65535]};
export const min = {param: 0};
export const max = {param: 65535};
export const email = {param: true};
export const url = {param: true};
export const dateISO = {param: true};
export const digits = {param: true};
export const number = {param: true};
export const equalTo = {param: true};
export const regexp = {param: /\d/i};
export const uaPhone = {param: true};
export const depends = {param: (value: any, options: ValidatorsOptions) => true};
export const rangedate = {param: [new Date(), new Date()]};

/**
 * @class Validations
 * Beckend system for validation input data
 * Deep validation model support
 */
export default class Validation {

    /**
     * Is show field names
     */
    #isFieldNameMode: boolean;

    /**
     * Default statusCode
     */
    #defaultStatusCode: number;

    /**
     * Input params
     */
    #inputParams: Record<string, any>;

    /**
     * Only params that has to validate
     */
    #validatedParams: Record<string| number, any>;

    /**
     * Validation model
     * {"name":{required, minlength: 3}}
     */
    #validationModel: ValidationModel;

    /**
     * Current field
     * @private
     */
    #currentField: string;

    /**
     * @constructor
     * @param model - validation model
     * @param options - validation default options
     */
    constructor(model: ValidationModel = {}, options: {isFieldNameMode?: boolean, defaultStatusCode?: number} = {}) {
        const opt = Object.assign({}, validationDefaultOption, options);
        this.#validationModel = model;
        this.#isFieldNameMode = <boolean>opt.isFieldNameMode;
        this.#defaultStatusCode = <number>opt.defaultStatusCode;
    }

    /**
     * Set validation model
     * @param model - validations model ruls
     */
    setModel(model: ValidationModel = {}) {
        this.#validationModel = model;
    }

    /**
     * Validate all object
     * @param params - input object {"test": 123, "user": {"fio":"1", "phone":"2"}}
     * @param filters - array of keys if need
     * @returns
     * @throws ApiError
     */
    validate(
        params: Record<string, any>,
        filters: ValidationFilters = []
    ): boolean {
        const schema = this.#cutTwolastLevel(this.#validationModel);

        if(!schema) {
            throw new ApiError({
                message: `invalid validation model`,
                code: 1,
                statusCode: this.#defaultStatusCode
            });
        }

        return this.#validateRecurcive(schema, params, filters);
    }

    /**
     * Validate all object
     * @param params - input object {"test": 123, "user": {"fio":"1", "phone":"2"}}
     * @param filters - array of keys if need
     * @param deepKey - deep key
     * @param schema - deep key
     * @returns
     * @throws ApiError
     */
    #validateRecurcive(
        schema: Record<string, any>,
        params: Record<string, any>,
        filters: ValidationFilters = [],
        deepKey: Array<string> = [],
    ): boolean {
        const deepKeysDefault = [...deepKey];

        for(const key in schema) {

            deepKey.push(key);
            const value = params[key] || undefined;
            this.#validateParam(deepKey, value, filters);

            if(isObject(schema[key])) {
                this.#validateRecurcive(schema[key], value, filters, deepKey);
            } else {
                deepKey = deepKeysDefault;
            }
        }

        return true;
    }

    /**
     * Cut last to levels
     * @param obj - validation model
     * @returns validation schema
     * @private
     */
    #cutTwolastLevel(obj: ValidationModel):Record<string, any>|undefined {
        return this.#lastLevelCut(this.#lastLevelCut(obj));
    }

    /**
     * Cut last level of object and replace by undefined
     * @param obj - input object (ValidationModel)
     * @param output - output
     * @private
     */
    #lastLevelCut(obj: Record<string, any>|undefined, output = {}):Record<string, any>|undefined  {
        if(!obj) {
            return undefined;
        }

        for(const key in obj as Record<string, any>) {

            if(obj.hasOwnProperty(key)) {
                const value = obj[key];

                if(isObject(value)) {
                    output[key] = this.#lastLevelCut(value);
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
    #validateParam(
        deepKey: Array<string>,
        value: any,
        filters: ValidationFilters
    ): void {
        this.#currentField = deepKey.join(".");

        if(!this.isKeyDeepInFilters(deepKey, filters) && filters.length) {
            return;
        }
        const validators = this.#getDeepValidators(deepKey);

        for(const validator in validators) {

            if(!validators.hasOwnProperty(validator) || typeof this[validator] !== "function") {
                throw new ApiError({
                    message: `Row ${deepKey.join(".")}: validator ${validator} not implemented`,
                    code: 2,
                    statusCode: this.#defaultStatusCode
                });
            }
            const options = validators[validator];

            if((value !== '' && value !== undefined && value !== null && !isNaN(value)) || validator === 'required') {
                this[validator](value, options);
            }
        }
    }


    /**
     * Get ruls for deep Keys aray
     * @param deepKeys - keys array
     * @private
     */
    #getDeepValidators(deepKeys: Array<string>) {

        return deepKeys.reduce((accumulator, key) => {

            if(!accumulator.hasOwnProperty(key)) {
                throw new ApiError({
                    message: `There no validators for ${deepKeys.join(".")}`,
                    code: 1,
                    statusCode: this.#defaultStatusCode
                });
            }

            return accumulator[key] as ValidationModel;
        }, this.#validationModel);
    }

    /**
     * Check is key in filters
     * @param deepKey keys array
     * @param filters - filters array
     * @param deep - deep range
     * @private
     */
    isKeyDeepInFilters(
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
    getValidatedParams() {
        return this.#validatedParams
    }

    /**
     * Get input params
     * @returns all input params
     */
    getInputParams() {
        return this.#inputParams;
    }

    /**
     * Adapt options to ErrorMessage
     * @param options - validator options
     * @param defaultMessage - default string message
     * @param defaultCode - default code
     * @param replace - addition data for replace !% in message
     * @private
     */
    #adaptToErrorMessage(
        options: ValidatorsOptions,
        defaultMessage: string,
        defaultCode: number,
        replace: Array<string> = []
    ): ApiErrorMessage {
        const errorMessageObj =  Object.assign({
            message: defaultMessage,
            code: defaultCode,
            statusCode: this.#defaultStatusCode
        }, options);
        errorMessageObj.message = this.#messageReplace(errorMessageObj.message, replace);

        return errorMessageObj;
    }

    /**
     * Required
     * @param value - input value
     * @param options - validator`s options
     * @returns
     * @throws ApiError
     */
    required(value: any, options: ValidatorsOptions): void {

        if(!value) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.required, 4));
        }
    }

    /**
     * Boolean
     * @param value - input value
     * @param options - validator`s options
     */
    boolean(value: any, options: ValidatorsOptions) {

        if(typeof value !== "boolean") {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.boolean, 5));
        }
    }

    /**
     * array
     * @param value - input value
     * @param options - validator`s options
     */
    array(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.array, 5));
        }
    }

    /**
     * object
     * @param value - input value
     * @param options - validator`s options
     */
    object(value: any, options: ValidatorsOptions) {

        if(!isObject(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.object, 5));
        }
    }

    /**
     * Minlength
     * @param value - input value
     * @param options - validator`s options
     */
    minlength(value: any, options: ValidatorsOptions) {

        if(value.length < options.param) {
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.minlength, 6, [options.param])
            );
        }
    }

    /**
     * Minlength
     * @param value - input value
     * @param options - validator`s options
     */
    maxlength(value: any, options: ValidatorsOptions) {

        if(value.length > options.param) {
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.maxlength, 7, [options.param])
            );
        }
    }

    /**
     *  Check range of string length
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    rangelength(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(options.param)) {
            throw new ApiError({
                message: `options for rangelength should be an array`,
                code: 8,
                statusCode: this.#defaultStatusCode
            });
        }

        if(value.length < options.param[0] || value.length > options.param[1]) {
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.rangelength, 9, [...options.param])
            );
        }
    }

    /**
     * Check min value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    min(value: any, options: ValidatorsOptions) {

        if(typeof options.param !== "number") {
            throw new ApiError({
                message: `options for min should be should be a number`,
                code: 10,
                statusCode: this.#defaultStatusCode
            });
        }

        if(value < options.param) {
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.min, 11, [String(options.param)])
            );
        }
    }

    /**
     * check max value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    max(value: any, options: ValidatorsOptions) {

        if(typeof options.param !== "number") {
            throw new ApiError({
                message: `options for max should be should be a number`,
                code: 12,
                statusCode: this.#defaultStatusCode
            });
        }

        if(value > options.param) {
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.max, 13, [String(options.param)])
            );
        }
    }

    /**
     * check range value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    range(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(options.param)) {
            throw new ApiError({
                message: `options for range should be should be an array`,
                code: 12,
                statusCode: this.#defaultStatusCode
            });
        }

        if(value < options.param[0] || value > options.param[1]) {
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.range, 15, [...options.param])
            );
        }
    }

    /**
     * Check email format
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    email(value: any, options: ValidatorsOptions) {
        const regexp = /^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;

        if(!regexp.test(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.email, 16));
        }
    }

    /**
     *  Check is string url
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    url(value: any, options: ValidatorsOptions) {
        const regexp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]-*)*[a-z0-9]+)(?:\.(?:[a-z0-9]-*)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i

        if(!regexp.test(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.url, 17));
        }
    }

    /**
     *  Check date ISO fromat
     *
     * @param value - input value
     * @param options - validator`s options
     *
     * @return {Boolean}
     */
    dateISO(value: any, options: ValidatorsOptions) {
        const regexp = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/i;

        if(!regexp.test(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.dateISO, 18));
        }
    }

    /**
     * Check integer
     * @param value
     * @param {Object} options
     * @return {Boolean}
     */
    digits(value: any, options: ValidatorsOptions) {

        if(typeof value !== "number" || value !== Math.round(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.digits, 19));
        }
    }

    /**
     * Check number
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    number(value: any, options: ValidatorsOptions) {

        if(typeof value !== "number") {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.number, 20));
        }
    }

    /**
     *  Check equal 2 values
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    equalTo(value: any, options: ValidatorsOptions) {

        if(value !== options.param) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.equalTo, 21));
        }
    }

    /**
     * test to reqexp
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    regexp(value: any, options: ValidatorsOptions) {

        if(!(options.param instanceof RegExp)) {
            throw new ApiError({
                message: `options for regexp should be should be a regex`,
                code: 22,
                statusCode: this.#defaultStatusCode
            });
        }

        if(!options.param.test(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.regexp, 22));
        }
    }

    /**
     *  check phone format +380971234567
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    uaPhone(value: any, options: ValidatorsOptions) {
        const regexp = /^\+380[5-9]{1}[0-9]{1}[0-9]{3}[0-9]{2}[0-9]{2}$/i;

        if(!regexp.test(value)) {
            throw new ApiError(this.#adaptToErrorMessage(options, defaultMessages.phone, 23));
        }
    }

    /**
     *  Check range date, date can be null - so it not influence
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    rangedate(value: any, options: ValidatorsOptions) {

        if(!Array.isArray(options.param)) {
            throw new ApiError({
                message: `options for rangedate should be should be an array`,
                code: 24,
                statusCode: this.#defaultStatusCode
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
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.rangedate, 25, [...options.param])
            );
        }
    }

    /**
     * Check by out side depends function
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    depends(value: any, options: ValidatorsOptions) {

        if(typeof options.param !== "function") {
            throw new ApiError({
                message: `options depends should be should be a function`,
                code: 24,
                statusCode: this.#defaultStatusCode
            });
        }

        if(!options.param(value, options)) {
            throw new ApiError(
                this.#adaptToErrorMessage(options, defaultMessages.depends, 25)
            );
        }
    }

    /**
     * Replace insert in error massage
     * @param message input message string
     * @param arrReplace - array of replace value
     */
    #messageReplace(message: string, arrReplace: Array<string> = []) {
        arrReplace.map(v => message = message.replace('!%', v));

        return this.#isFieldNameMode ? `${this.#currentField}: ${message}` : message;
    }
}
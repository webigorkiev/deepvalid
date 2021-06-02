/**
 * Options for validators
 */
export interface ValidatorsOptions {
    message?: string;
    param: any;
    code?: number;
    statusCode?: number;
}
/**
 * Filters that show - what need validate
 */
export declare type ValidationFilters = Array<string | Record<string, ValidationFilters>>;
/**
 * Validation model
 */
export interface ValidationModel {
    [x: string]: ValidationModel | ValidatorsOptions | any;
}
/**
 * Value is required
 */
export declare const required: (params?: {}) => {
    param: boolean;
};
/**
 * Value has boolean type
 */
export declare const boolean: (params?: {}) => {
    param: boolean;
};
/**
 * Value has number type
 */
export declare const number: (params?: {}) => {
    param: boolean;
};
/**
 * Value is array
 */
export declare const array: (params?: {}) => {
    param: boolean;
};
/**
 * Value is object
 */
export declare const object: (params?: {}) => {
    param: boolean;
};
/**
 * Value has min length > param
 */
export declare const minlength: (min?: number, params?: {}) => {
    param: number;
};
/**
 * Value has max length < param
 */
export declare const maxlength: (max?: number, params?: {}) => {
    param: number;
};
/**
 * Value has length in range: [min, max]
 */
export declare const rangelength: (range?: number[], params?: {}) => {
    param: number[];
};
/**
 * The value is a digit and in the range: [min, max]
 */
export declare const range: (range?: number[], params?: {}) => {
    param: number[];
};
/**
 * The value higher then param
 */
export declare const min: (min?: number, params?: {}) => {
    param: number;
};
/**
 * The value lower then param
 */
export declare const max: (max?: number, params?: {}) => {
    param: number;
};
/**
 * Value is valid email
 */
export declare const email: (params?: {}) => {
    param: boolean;
};
/**
 * Value is valid url
 */
export declare const url: (params?: {}) => {
    param: boolean;
};
/**
 * Value is valid date stirng in ISO format
 */
export declare const dateIso: (params?: {}) => {
    param: boolean;
};
/**
 * Value is only digits
 */
export declare const digits: (params?: {}) => {
    param: boolean;
};
/**
 * Value equal to param
 */
export declare const equal: (value: any, params?: {}) => {
    param: any;
};
/**
 * Value equal to param
 */
export declare const eql: (value: any, params?: {}) => {
    param: any;
};
/**
 * The value matches a regular expression
 */
export declare const regexp: (regexp?: RegExp, params?: {}) => {
    param: RegExp;
};
/**
 * The value is ua phone
 */
export declare const uaPhone: (params?: {}) => {
    param: boolean;
};
/**
 * Value check by handler
 */
export declare const depends: (handler?: (value: any, options?: ValidatorsOptions) => boolean, params?: {}) => {
    param: (value: any, options?: ValidatorsOptions) => boolean;
};
/**
 * The value is Date and in date range: [startDate, endDate]
 */
export declare const rangedate: (range?: Date[], params?: {}) => {
    param: Date[];
};
/**
 * @class Validations
 * Beckend system for validation input data
 * Deep validation model support
 */
export default class Validation {
    #private;
    /**
     * @constructor
     * @param model - validation model
     * @param options - validation default options
     */
    constructor(model?: ValidationModel, options?: {
        isFieldNameMode?: boolean;
        defaultStatusCode?: number;
    });
    /**
     * Set validation model
     * @param model - validations model ruls
     */
    setModel(model?: ValidationModel): void;
    /**
     * Execute functions in validation model
     * @param model
     * @private
     */
    private executeFunctionInModel;
    /**
     * Validate all object
     * @param params - input object {"test": 123, "user": {"fio":"1", "phone":"2"}}
     * @param filters - array of keys if need
     * @returns
     * @throws ValidationError
     */
    validate(params: Record<string, any>, filters?: ValidationFilters): boolean;
    /**
     * Validate all object
     * @param params - input object {"test": 123, "user": {"fio":"1", "phone":"2"}}
     * @param filters - array of keys if need
     * @param deepKey - deep key
     * @param schema - deep key
     * @returns
     * @throws ValidationError
     */
    private validateRecursively;
    /**
     * Cut last level of object and replace by undefined
     * @param obj - input object (ValidationModel)
     * @param output - output
     * @private
     */
    private lastLevelCut;
    /**
     * Validate param
     * @param deepKey array of keys
     * @param value validated value
     * @param filters validated filters
     * @returns
     */
    private validateParam;
    /**
     * Get ruls for deep Keys aray
     * @param deepKeys - keys array
     * @private
     */
    private getDeepValidators;
    /**
     * Check is key in filters
     * @param deepKey keys array
     * @param filters - filters array
     * @param deep - deep range
     * @private
     */
    isKeyDeepInFilters(deepKey: Array<string>, filters: ValidationFilters, deep?: number): boolean;
    /**
     * Get only validated params
     * @returns params, that have been validated
     */
    getValidatedParams(): Record<string | number, any>;
    /**
     * Get input params
     * @returns all input params
     */
    getInputParams(): Record<string, any>;
    /**
     * Adapt options to ErrorMessage
     * @param options - validator options
     * @param defaultMessage - default string message
     * @param defaultCode - default code
     * @param replace - addition data for replace !% in message
     * @private
     */
    private adaptToErrorMessage;
    /**
     * determine the length
     * @param value
     * @returns length
     * @private
     */
    private valueLength;
    /**
     * Replace insert in error massage
     * @param message input message string
     * @param arrReplace - array of replace value
     */
    private messageReplace;
    /**
     * Required
     * @param value - input value
     * @param options - validator`s options
     * @returns
     * @throws ValidationError
     */
    private required;
    /**
     * Boolean
     * @param value - input value
     * @param options - validator`s options
     */
    private boolean;
    /**
     * array
     * @param value - input value
     * @param options - validator`s options
     */
    private array;
    /**
     * object
     * @param value - input value
     * @param options - validator`s options
     */
    private object;
    /**
     * Minlength
     * @param value - input value
     * @param options - validator`s options
     */
    private minlength;
    /**
     * Maxlength
     * @param value - input value
     * @param options - validator`s options
     */
    private maxlength;
    /**
     *  Check range of string length
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private rangelength;
    /**
     * Check min value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private min;
    /**
     * check max value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private max;
    /**
     * check range value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private range;
    /**
     * Check email format
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private email;
    /**
     *  Check is string url
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private url;
    /**
     *  Check date ISO fromat
     * @param value - input value
     * @param options - validator`s options
     *
     * @return {Boolean}
     */
    private dateIso;
    /**
     * Check integer
     * @param value
     * @param {Object} options
     * @return {Boolean}
     */
    private digits;
    /**
     * Check number
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private number;
    /**
     *  Check equal 2 values
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private equal;
    /**
     * Check equal 2 values
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private eql;
    /**
     * test to reqexp
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private regexp;
    /**
     *  check phone format +380971234567
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private uaPhone;
    /**
     *  Check range date, date can be null - so it not influence
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private rangedate;
    /**
     * Check by out side depends function
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    private depends;
}

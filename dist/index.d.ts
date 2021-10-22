/**
 * Options for validators
 */
interface ValidatorsOptions {
    message?: string;
    param: any;
    code?: number;
    statusCode?: number;
}
/**
 * Filters that show - what need validate
 */
declare type ValidationFilters = Array<string | Record<string, ValidationFilters>>;
/**
 * Validation model
 */
interface ValidationModel {
    [x: string]: ValidationModel | ValidatorsOptions | any;
}
/**
 * Value is required
 */
declare const required: (params?: {}) => {
    param: boolean;
};
/**
 * Value has boolean type
 */
declare const boolean: (params?: {}) => {
    param: boolean;
};
/**
 * Value has number type
 */
declare const number: (params?: {}) => {
    param: boolean;
};
/**
 * Value is array
 */
declare const array: (params?: {}) => {
    param: boolean;
};
/**
 * Value is object
 */
declare const object: (params?: {}) => {
    param: boolean;
};
/**
 * Value has min length > param
 */
declare const minlength: (min?: number, params?: {}) => {
    param: number;
};
/**
 * Value has max length < param
 */
declare const maxlength: (max?: number, params?: {}) => {
    param: number;
};
/**
 * Value has length in range: [min, max]
 */
declare const rangelength: (range?: number[], params?: {}) => {
    param: number[];
};
/**
 * The value is a digit and in the range: [min, max]
 */
declare const range: (range?: number[], params?: {}) => {
    param: number[];
};
/**
 * The value higher then param
 */
declare const min: (min?: number, params?: {}) => {
    param: number;
};
/**
 * The value lower then param
 */
declare const max: (max?: number, params?: {}) => {
    param: number;
};
/**
 * Value is valid email
 */
declare const email: (params?: {}) => {
    param: boolean;
};
/**
 * Value is valid url
 */
declare const url: (params?: {}) => {
    param: boolean;
};
/**
 * Value is valid date stirng in ISO format
 */
declare const dateIso: (params?: {}) => {
    param: boolean;
};
/**
 * Value is only digits
 */
declare const digits: (params?: {}) => {
    param: boolean;
};
/**
 * Value equal to param
 */
declare const equal: (value: any, params?: {}) => {
    param: any;
};
/**
 * Value equal to param
 */
declare const eql: (value: any, params?: {}) => {
    param: any;
};
/**
 * The value matches a regular expression
 */
declare const regexp: (regexp?: RegExp, params?: {}) => {
    param: RegExp;
};
/**
 * The value is ua phone
 */
declare const uaPhone: (params?: {}) => {
    param: boolean;
};
/**
 * Value check by handler
 */
declare const depends: (handler?: (value: any, options?: ValidatorsOptions) => boolean, params?: {}) => {
    param: (value: any, options?: ValidatorsOptions) => boolean;
};
/**
 * The value is Date and in date range: [startDate, endDate]
 */
declare const rangedate: (range?: Date[], params?: {}) => {
    param: Date[];
};
/**
 * @class Validations
 * Beckend system for validation input data
 * Deep validation model support
 */
declare class Validation {
    /**
     * Is show field names
     */
    private readonly isFieldNameMode;
    /**
     * Default statusCode
     */
    private readonly defaultStatusCode;
    /**
     * Input params
     */
    private inputParams;
    /**
     * Only params that has to validate
     */
    private validatedParams;
    /**
     * Validation model
     * {"name":{required, minlength: 3}}
     */
    private validationModel;
    /**
     * Current field
     * @private
     */
    private currentField;
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
     * Set validated key
     * @param deepKey
     * @param value
     * @private
     */
    private setValidatedValue;
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

/**
 * Input params of error
 */
interface ValidationErrorMessage {
    message?: string;
    code?: number;
    statusCode?: number;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
}
/**
 * @class ValidationError
 * @description Error for validators
 */
declare class ValidationError extends Error {
    statusCode: number;
    code: number;
    data: Record<string, unknown>;
    headers: Record<string, string>;
    /**
     * @constructor
     * @param params - text mesage of error
     * @param code - number internal code
     * @param statusCode - number http status code
     */
    constructor(params?: ValidationErrorMessage | string, code?: number, statusCode?: number);
    /**
     * Get error message
     * @returns message
     */
    getMessage(): string;
    /**
     * Get internal status code
     * @returns status code
     */
    getStatusCode(): number;
    /**
     * Get internal error code
     * @returns code
     */
    getCode(): number;
    /**
     * Get error data
     * @returns data object
     */
    getData(): Record<string, unknown>;
    /**
     * Get error headers
     * @returns headers object
     */
    getHeaders(): Record<string, string>;
}

declare const validator: () => Validation;

export { Validation, ValidationError, ValidationErrorMessage, ValidationFilters, ValidationModel, ValidatorsOptions, array, boolean, dateIso, depends, digits, email, eql, equal, max, maxlength, min, minlength, number, object, range, rangedate, rangelength, regexp, required, uaPhone, url, validator };

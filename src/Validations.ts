/*
 let params = {
        name: 'Test',
        last: '+380971234567'
    };
 let validationsModel = {
        name: {
            required: true,
            minlength: 10
        },
        last: {
            required: true,
            phone: true
        },
    };
 let objValidation = new Validations(validationsModel);
 let r = objValidation.validate(params, ['last']);
 */
import pickBy from '../../es-lodash/pickBy';
import {ApiError} from "@jwn-js/common";

const defaultMessages = {
    required:  "пустое поле",
    boolean: "не булевое значение",
    minlength: "количество символов в строке меньше !%",
    maxlength: "количество символов в строке больше !%",
    rangelength: "количество символов в строке находится не в дипазоне от !% до !% символов",
    range: "значение находится не в диапазоне от !% до !%",
    min: "значение меньше минимального значения !%",
    max: "значение больше максимального значения !%",
    email: "email адрес не корректный",
    url: "URL адрес не корректный",
    dateISO: "формат даты не корректный",
    digits: "значение не является целым числом",
    number: "значение не является десятичным числом",
    equalTo: "значения полей не эквивалентны",
    regexp: "значение поля не соответствует шаблону",
    phone: "номер телефона не корректный",
    depends: "Ошибка пользовательской функции",
    rangedate: "Дата вне диапазона дат !% - !%"
};

// Validators
export const required = true;
export const boolean = true;
export const minlength = 0;
export const maxlength = 65535;
export const rangelength = [0, 65535];
export const range = [0, 65535];
export const min = 0;
export const max = 65535;
export const email = true;
export const url = true;
export const dateISO = true;
export const digits = true;
export const number = true;
export const equalTo = true;
export const regexp = /\d/i;
export const phone = true;
export const depends = (value, options) => true;
export const rangedate = [new Date(), new Date()];

/**
 * @class Validations
 * Beckend system for validation input data
 */
export default class {

    /**
     * Constructor
     * @param {Object} model - validation model
     * @param {Boolean} isFieldNameMode - show row name in error message
     * @param {Number} defaultCode - response code
     */
    constructor(model = {}, isFieldNameMode = true, defaultCode = 400) {

        // All input field
        this._params;

        // validated rows - onli rows that has validation
        this._filteredParams;

        // current param name
        this._current;

        // Model validation
        this._validationModel = model;

        // Show row name
        this._isFieldNameMode = isFieldNameMode;

        // Default response code
        this.defaultCode = defaultCode;
    }

    /**
     * Set validation model
     *
     * @param {Object} model - validations ruls
     */
    setModel(model = {}) {
        this._validationModel = model;
    }

    /**
     * Validate params
     * @param params
     * @param filters
     * @return {Boolean} - result of validation
     */
    validate(params, filters = []) {
        this._params = params;
        this._filteredParams = params;

        // Get object with all filters or set all filters by key
        if(filters.length) {
            this._filteredParams = pickBy(params, (v, k) => filters.includes(k));
            filters.map(v => this._filteredParams[v] = this._filteredParams[v] ?? undefined);
        } else {
            filters = Object.keys(params);
        }

        // Test if all rows has validators
        let validationModelKey = Object.keys(this._validationModel);
        Object.keys(this._filteredParams).map(paramKey => {
            if(!validationModelKey.includes(paramKey)) {
                throw new ApiError(`Param ${paramKey} not described in validations model`, 1, this.defaultCode);
            }
        });


        // Validate all filteredParams
        for(let key in this._filteredParams) {
            let validators = this._validationModel[key];
            let value = this._filteredParams[key];
            this._current = key;

            for(let validator in validators) {

                if(typeof this[validator] !== "function") {
                    throw new ApiError(`Row ${key}: validator ${validator} undefined`, 2, this.defaultCode);
                }

                let options = validators[validator];
                options = !options.param && (
                    typeof options === 'string'
                    || typeof options === 'number'
                    || typeof options === 'boolean'
                    || Array.isArray(options)
                    || options instanceof RegExp
                ) ? {param: options} : options;

                if((value !== '' && value !== undefined && value !== null) || validator === 'required') {
                    this[validator](value, options);
                }
            }
        }
    }

    /**
     * Get only validated params
     * @return {*}
     */
    getParams() {
        return this._filteredParams
    }

    /**
     * Get input params
     * @return {*}
     */
    getInputParams() {
        return this._params;
    }

    /**
     * Required
     * @param value - input value
     * @param options - validator`s options
     * @return {boolean}
     */
    required(value, options) {
        if(!value && value !== 0 && value !== false) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['required'];
            throw new ApiError(this._messageReplace(options['message']), 3, this.defaultCode);
        }
    }

    /**
     * Boolean
     * @param value - input value
     * @param options - validator`s options
     */
    boolean(value, options) {

        if(typeof value !== "boolean") {
            options['message'] = options['message'] ? options['message'] : defaultMessages['boolean'];
            throw new ApiError(this._messageReplace(options['message']), 5, this.defaultCode);
        }
    }

    /**
     * Minlength
     * @param value - input value
     * @param options - validator`s options
     */
    minlength(value, options) {

        if(value.length < options.param) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['minlength'];
            throw new ApiError(this._messageReplace(options['message'], [options.param]), 6, this.defaultCode);
        };
    }

    /**
     * Minlength
     * @param value - input value
     * @param options - validator`s options
     */
    maxlength(value, options) {

        if(value.length > options.param) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['maxlength'];
            throw new ApiError(this._messageReplace(options['message'], [options.param]), 7, this.defaultCode);
        }
    }

    /**
     *  Check range of string length
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    rangelength(value, options) {

        if(!Array.isArray(options.param)) {
            throw new ApiError(this._messageReplace(`Options for rangelength must be array`));
        }

        if(value.length < options.param[0] || value.length > options.param[1]) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['rangelength'];
            throw new ApiError(this._messageReplace(options['message'], options.param), 8, this.defaultCode);
        }
    }

    /**
     * Check min value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    min(value, options) {

        if(typeof options.param !== "number") {
            throw new ApiError(this._messageReplace(`Options for min must be number`));
        }

        if(value < options.param) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['min'];
            throw new ApiError(this._messageReplace(options['message'], [options.param]), 9, this.defaultCode);
        };
    }

    /**
     * check max value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    max(value, options) {

        if(typeof options.param !== "number") {
            throw new ApiError(this._messageReplace(`Options for min must be number`));
        }

        if(value > options.param) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['max'];
            throw new ApiError(this._messageReplace(options['message'], [options.param]), 10, this.defaultCode);
        };
    }

    /**
     * check range value
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    range(value, options) {

        if(!Array.isArray(options.param)) {
            throw new ApiError(this._messageReplace(`Options for range length must be array`), 11, this.defaultCode);
        }

        if(value < options.param[0] || value > options.param[1]) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['range'];
            throw new ApiError(this._messageReplace(options['message'], options.param), 12, this.defaultCode);
        }
    }

    /**
     * Check email format
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    email(value, options) {
        let regexp = /^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;

        if(!regexp.test(value)) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['email'];
            throw new ApiError(this._messageReplace(options['message'], []), 13, this.defaultCode);
        }
    }

    /**
     *  Check is string url
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    url(value, options) {
        let regexp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]-*)*[a-z0-9]+)(?:\.(?:[a-z0-9]-*)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i

        if(!regexp.test(value)) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['url'];
            throw new ApiError(this._messageReplace(options['message'], []), 14, this.defaultCode);
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
    dateISO(value, options) {
        let regexp = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/i;

        if(!regexp.test(value)) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['dateISO'];
            throw new ApiError(this._messageReplace(options['message'], []), 15, this.defaultCode);
        }
    }

    /**
     * Check integer
     * @param value
     * @param {Object} options
     * @return {Boolean}
     */
    digits(value, options) {

        if(typeof value !== "number" || value !== Math.round(value)) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['digits'];
            throw new ApiError(this._messageReplace(options['message'], []), 16, this.defaultCode);
        }
    }


    /**
     * Check number
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    number(value, options) {

        if(typeof value !== "number") {
            options['message'] = options['message'] ? options['message'] : defaultMessages['number'];
            throw new ApiError(this._messageReplace(options['message'], []), 16, this.defaultCode);
        }
    }

    /**
     *  Check equal 2 values
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    equalTo(value, options) {

        if(value !== options.param) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['equalTo'];
            throw new ApiError(this._messageReplace(options['message'], []), 17, this.defaultCode);
        }
    }

    /**
     * test to reqexp
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    regexp(value, options) {

        if(!(options.param instanceof RegExp)) {
            throw new ApiError(this._messageReplace(`Options for regexp must be regexp`), 18, this.defaultCode);
        }

        if(!options.param.test(value)) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['regexp'];
            throw new ApiError(this._messageReplace(options['message'], []), 19, this.defaultCode);
        }
    }

    /**
     *  check phone format +380971234567
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    phone(value, options) {
        let regexp = /^\+380[5-9]{1}[0-9]{1}[0-9]{3}[0-9]{2}[0-9]{2}$/i;

        if(!regexp.test(value)) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['phone'];
            throw new ApiError(this._messageReplace(options['message'], []), 20, this.defaultCode);
        }
    }

    /**
     *  Check range date, date can be null - so it not influence
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    rangedate(value, options) {

        if(!Array.isArray(options.param)) {
            throw new ApiError(this._messageReplace(`Options for range length must be array`), 21, this.defaultCode);
        }

        let date = new Date(value);
        let isValid = true;

        if(options.param[0] && date < new Date(options.param[0])) {
            isValid = false;
        }

        if(options.param[0] && date > new Date(options.param[1])) {
            isValid = false;
        }

        if(!isValid) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['rangedate'];
            throw new ApiError(this._messageReplace(options['message'], options.param), 22, this.defaultCode);
        }
    }

    /**
     * Check by out side depends function
     * @param value - input value
     * @param options - validator`s options
     * @return {Boolean}
     */
    depends(value, options) {
        if(!typeof options.param !== "function") {
            throw new ApiError(this._messageReplace(`Options for depends must be function`), 23, this.defaultCode);
        }

        if(!options.param(value, options)) {
            options['message'] = options['message'] ? options['message'] : defaultMessages['depends'];
            throw new ApiError(this._messageReplace(options['message'], options.param), 24, this.defaultCode);
        }
    }

    /**
     * Replace insert in error massage
     * @param {String} message
     * @param {Array} arrReplace - array of replace value
     * @private
     */
    _messageReplace(message, arrReplace = []) {
        arrReplace.map(v => message = message.replace('!%', v));

        message = this._isFieldNameMode ? `${this._current}: ${message}` : message;

        return message;
    }
}
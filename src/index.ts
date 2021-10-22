import type {
    ValidationFilters,
    ValidationModel,
    ValidatorsOptions,
} from "./Validation";

import Validation, {
    required,
    boolean,
    array,
    object,
    minlength,
    maxlength,
    rangelength,
    range,
    min,
    max,
    email,
    url,
    dateIso,
    digits,
    number,
    equal,
    eql,
    regexp,
    uaPhone,
    depends,
    rangedate
} from "./Validation";
import {ValidationError} from "./ValidationError";
import type {ValidationErrorMessage} from "./ValidationError";

const validator = () => new Validation();

export {
    validator,
    Validation,
    ValidationError,
    required,
    boolean,
    array,
    object,
    minlength,
    maxlength,
    rangelength,
    range,
    min,
    max,
    email,
    url,
    dateIso,
    digits,
    number,
    equal,
    eql,
    regexp,
    uaPhone,
    depends,
    rangedate
};
export type {
    ValidationFilters,
    ValidationModel,
    ValidatorsOptions,
    ValidationErrorMessage,
}
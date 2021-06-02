import Validation, { ValidationFilters, ValidationModel, ValidatorsOptions, required, boolean, array, object, minlength, maxlength, rangelength, range, min, max, email, url, dateIso, digits, number, equal, eql, regexp, uaPhone, depends, rangedate } from "./Validation";
import { ValidationError } from "./ValidationError";
import { ValidationErrorMessage } from "./ValidationError";
declare const validation: () => Validation;
export { Validation, ValidationFilters, ValidationModel, ValidatorsOptions, ValidationError, ValidationErrorMessage, validation, required, boolean, array, object, minlength, maxlength, rangelength, range, min, max, email, url, dateIso, digits, number, equal, eql, regexp, uaPhone, depends, rangedate };
export default validation;

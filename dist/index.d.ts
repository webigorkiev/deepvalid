import Validation, { required, boolean, array, object, minlength, maxlength, rangelength, range, min, max, email, url, dateIso, digits, number, equal, eql, regexp, uaPhone, depends, rangedate } from "./Validation";
import { ValidationError } from "./ValidationError";
import { ValidationErrorMessage } from "./ValidationError";
export { Validation, ValidationError, ValidationErrorMessage, required, boolean, array, object, minlength, maxlength, rangelength, range, min, max, email, url, dateIso, digits, number, equal, eql, regexp, uaPhone, depends, rangedate };
declare const _default: () => Validation;
export default _default;

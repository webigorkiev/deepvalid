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
    dateISO,
    digits,
    number,
    equalTo,
    regexp,
    uaPhone,
    depends,
    rangedate
} from "@/Validation";

export {
    Validation,
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
    dateISO,
    digits,
    number,
    equalTo,
    regexp,
    uaPhone,
    depends,
    rangedate
};
export default () => new Validation();
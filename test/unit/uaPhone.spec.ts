import validation, {uaPhone} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validation();

describe(`uaPhone`, () => {
    valid.setModel({test: {uaPhone}});
    it(`+380931002030`, () => {
        expect(() => {
            valid.validate({test: "+380931002030"}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`string`, () => {
        expect(() => {
            valid.validate({test: "380931002030"}, ["test"])
        }).throw(ValidationError);
    });
});
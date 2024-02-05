import {validator, minlength, required} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`minlength`, () => {
    valid.setModel({test: {minlength: minlength(5)}, testMinLength: {required, minlength: minlength(1)}});
    it(`param:5 for "12345"`, () => {
        expect(() => {
            valid.validate({test: "12345"}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`param:5 for "123"`, () => {
        expect(() => {
            valid.validate({test: "123"}, ["test"])
        }).throw(ValidationError);
    });
    it(`param:5 for new Set([1,2])`, () => {
        expect(() => {
            valid.validate({test: new Set([1,2])}, ["test"])
        }).throw(ValidationError);
    });
    it(`param:1 for "1"`, () => {
        expect(() => {
            valid.validate({testMinLength: ""}, ["testMinLength"])
        }).throw(ValidationError);
    });
});
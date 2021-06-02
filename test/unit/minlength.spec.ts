import validation, {minlength} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validation();

describe(`minlength`, () => {
    valid.setModel({test: {minlength: minlength(5)}});
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
});
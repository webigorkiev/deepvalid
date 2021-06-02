import validation, {number} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validation();

describe(`number`, () => {
    valid.setModel({test: {number}});
    it(`1230.56`, () => {
        expect(() => {
            valid.validate({test: 1230.56}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`string`, () => {
        expect(() => {
            valid.validate({test: "string"}, ["test"])
        }).throw(ValidationError);
    });
});
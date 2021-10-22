import {validator, number} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

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
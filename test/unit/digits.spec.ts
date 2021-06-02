import validation, {digits} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validation();

describe(`digits`, () => {
    valid.setModel({test: {digits}});
    it(`1230`, () => {
        expect(() => {
            valid.validate({test: 1230}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`string`, () => {
        expect(() => {
            valid.validate({test: "string"}, ["test"])
        }).throw(ValidationError);
    });
});
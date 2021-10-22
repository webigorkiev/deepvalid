import {validator, email} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`email`, () => {
    valid.setModel({test: {email}});
    it(`test@gmail.com`, () => {
        expect(() => {
            valid.validate({test: "test@gmail.com"}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`test-gmail.com throw error`, () => {
        expect(() => {
            valid.validate({test: "test-gmail.com"}, ["test"])
        }).throw(ValidationError);
    });
});
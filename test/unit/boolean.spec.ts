import {validator, boolean, required, Validation} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`boolean`, () => {
    valid.setModel({test: {boolean}});
    it("boolean true", () => {
        expect(() => {
            valid.validate({test: true}, ["test"])
        }).not.throw(ValidationError);
    });
    it("boolean false", () => {
        expect(() => {
            valid.validate({test: false}, ["test"])
        }).not.throw(ValidationError);
    });
    it("boolean {}", () => {
        expect(() => {
            valid.validate({}, ["test"])
        }).not.throw(ValidationError);
    });
    it("boolean 0", () => {
        expect(() => {
            valid.validate({test: 0}, ["test"])
        }).throw(ValidationError);
    });
});
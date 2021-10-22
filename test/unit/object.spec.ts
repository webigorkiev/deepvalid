import {validator, object} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`object`, () => {
    valid.setModel({test: {object}});
    it("object {}", () => {
        expect(() => {
            valid.validate({test: {}}, ["test"])
        }).not.throw(ValidationError);
    });
    it("object []", () => {
        expect(() => {
            valid.validate({test: []}, ["test"])
        }).throw(ValidationError);
    });
});
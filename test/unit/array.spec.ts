import {validator, array} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`array`, () => {
    valid.setModel({test: {array}});
    it("array []", () => {
        expect(() => {
            valid.validate({test: []}, ["test"])
        }).not.throw(ValidationError);
    });
    it("array {}", () => {
        expect(() => {
            valid.validate({test: {}}, ["test"])
        }).throw(ValidationError);
    });
});
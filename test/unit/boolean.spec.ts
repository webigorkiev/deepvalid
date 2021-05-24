import validation, {boolean, required, Validation} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`boolean`, () => {
    valid.setModel({test: {boolean}});
    it("boolean true", () => {
        expect(() => {
            valid.validate({test: true}, ["test"])
        }).not.throw(ApiError);
    });
    it("boolean false", () => {
        expect(() => {
            valid.validate({test: false}, ["test"])
        }).not.throw(ApiError);
    });
    it("boolean {}", () => {
        expect(() => {
            valid.validate({}, ["test"])
        }).not.throw(ApiError);
    });
    it("boolean 0", () => {
        expect(() => {
            valid.validate({test: 0}, ["test"])
        }).throw(ApiError);
    });
});
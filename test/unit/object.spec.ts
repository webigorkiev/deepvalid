import validation, {object} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`object`, () => {
    valid.setModel({test: {object}});
    it("object {}", () => {
        expect(() => {
            valid.validate({test: {}}, ["test"])
        }).not.throw(ApiError);
    });
    it("object []", () => {
        expect(() => {
            valid.validate({test: []}, ["test"])
        }).throw(ApiError);
    });
});
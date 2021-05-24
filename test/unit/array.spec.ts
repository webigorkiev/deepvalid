import validation, {array} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`array`, () => {
    valid.setModel({test: {array}});
    it("array []", () => {
        expect(() => {
            valid.validate({test: []}, ["test"])
        }).not.throw(ApiError);
    });
    it("array {}", () => {
        expect(() => {
            valid.validate({test: {}}, ["test"])
        }).throw(ApiError);
    });
});
import validation, {email} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`email`, () => {
    valid.setModel({test: {email}});
    it(`test@gmail.com`, () => {
        expect(() => {
            valid.validate({test: "test@gmail.com"}, ["test"])
        }).not.throw(ApiError);
    });
    it(`test-gmail.com throw error`, () => {
        expect(() => {
            valid.validate({test: "test-gmail.com"}, ["test"])
        }).throw(ApiError);
    });
});
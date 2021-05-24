import validation, {url} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`email`, () => {
    valid.setModel({test: {url}});
    it(`test@gmail.com`, () => {
        expect(() => {
            valid.validate({test: "test@gmail.com"}, ["test"])
        }).throw(ApiError);
    });
    it(`test-gmail.com throw error`, () => {
        expect(() => {
            valid.validate({test: "https://test-gmail.com"}, ["test"])
        }).not.throw(ApiError);
    });
});
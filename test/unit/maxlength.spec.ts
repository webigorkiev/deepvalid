import validation, {maxlength} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`maxlength`, () => {
    valid.setModel({test: {maxlength: maxlength(5)}});
    it(`param:5 for "123456"`, () => {
        expect(() => {
            valid.validate({test: "123456"}, ["test"])
        }).throw(ApiError);
    });
    it(`param:5 for "123"`, () => {
        expect(() => {
            valid.validate({test: "123"}, ["test"])
        }).not.throw(ApiError);
    });
    it(`param:5 for new Set([1,2,3,4,5,6])`, () => {
        expect(() => {
            valid.validate({test: new Set([1,2,3,4,5,6])}, ["test"])
        }).throw(ApiError);
    });
});
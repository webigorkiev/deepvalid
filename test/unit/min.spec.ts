import validation, {min} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`min`, () => {
    valid.setModel({test: {min: min(5)}});
    it(`param:5 for 10`, () => {
        expect(() => {
            valid.validate({test: 10}, ["test"])
        }).not.throw(ApiError);
    });
    it(`param:5 for 3`, () => {
        expect(() => {
            valid.validate({test: 3}, ["test"])
        }).throw(ApiError);
    });
    it(`param:5 for new Set([1,2])`, () => {
        expect(() => {
            valid.validate({test: new Set([1,2])}, ["test"])
        }).throw(ApiError);
    });
});
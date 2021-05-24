import validation, {max} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`min`, () => {
    valid.setModel({test: {max: max(5)}});
    it(`param:5 for 10`, () => {
        expect(() => {
            valid.validate({test: 10}, ["test"])
        }).throw(ApiError);
    });
    it(`param:5 for 3`, () => {
        expect(() => {
            valid.validate({test: 3}, ["test"])
        }).not.throw(ApiError);
    });
    it(`param:5 for {})`, () => {
        expect(() => {
            valid.validate({test: {}}, ["test"])
        }).throw(ApiError);
    });
});
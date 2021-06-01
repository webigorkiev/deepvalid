import validation, {number} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`number`, () => {
    valid.setModel({test: {number}});
    it(`1230.56`, () => {
        expect(() => {
            valid.validate({test: 1230.56}, ["test"])
        }).not.throw(ApiError);
    });
    it(`string`, () => {
        expect(() => {
            valid.validate({test: "string"}, ["test"])
        }).throw(ApiError);
    });
});
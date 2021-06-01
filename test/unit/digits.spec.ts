import validation, {digits} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`digits`, () => {
    valid.setModel({test: {digits}});
    it(`1230`, () => {
        expect(() => {
            valid.validate({test: 1230}, ["test"])
        }).not.throw(ApiError);
    });
    it(`string`, () => {
        expect(() => {
            valid.validate({test: "string"}, ["test"])
        }).throw(ApiError);
    });
});
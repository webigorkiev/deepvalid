import validation, {required} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`required`, () => {
    valid.setModel({"test": {required}});
    it("required string", () => {
        expect(() => {
            valid.validate({test: "test"}, ["test"])
        }).not.throw(ApiError);
    });
    it("required 0", () => {
        expect(() => {
            valid.validate({test: 0}, ["test"])
        }).not.throw(ApiError);
    });
    it(`required "0"`, () => {
        expect(() => {
            valid.validate({test: "0"}, ["test"])
        }).not.throw(ApiError);
    });
    it("required false", () => {
        expect(() => {
            valid.validate({test: false}, ["test"])
        }).not.throw(ApiError);
    });
    it("required {}", () => {
        expect(() => {
            valid.validate({}, ["test"])
        }).throw(ApiError);
    })
    it(`required ""`, () => {
        expect(() => {
            valid.validate({test: ""}, ["test"])
        }).not.throw(ApiError);
    })
    it("required undefined", () => {
        expect(() => {
            valid.validate({test: undefined}, ["test"])
        }).throw(ApiError);
    });
    it("required null", () => {
        expect(() => {
            valid.validate({test: null}, ["test"])
        }).throw(ApiError);
    });
    it("required Nan", () => {
        expect(() => {
            valid.validate({test: NaN}, ["test"])
        }).throw(ApiError);
    });
});
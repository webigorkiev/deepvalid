import validation, {required} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validation();

describe(`required`, () => {
    valid.setModel({"test": {required}});
    it("required string", () => {
        expect(() => {
            valid.validate({test: "test"}, ["test"])
        }).not.throw(ValidationError);
    });
    it("required 0", () => {
        expect(() => {
            valid.validate({test: 0}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`required "0"`, () => {
        expect(() => {
            valid.validate({test: "0"}, ["test"])
        }).not.throw(ValidationError);
    });
    it("required false", () => {
        expect(() => {
            valid.validate({test: false}, ["test"])
        }).not.throw(ValidationError);
    });
    it("required {}", () => {
        expect(() => {
            valid.validate({}, ["test"])
        }).throw(ValidationError);
    })
    it(`required ""`, () => {
        expect(() => {
            valid.validate({test: ""}, ["test"])
        }).not.throw(ValidationError);
    })
    it("required undefined", () => {
        expect(() => {
            valid.validate({test: undefined}, ["test"])
        }).throw(ValidationError);
    });
    it("required null", () => {
        expect(() => {
            valid.validate({test: null}, ["test"])
        }).throw(ValidationError);
    });
    it("required Nan", () => {
        expect(() => {
            valid.validate({test: NaN}, ["test"])
        }).throw(ValidationError);
    });
});
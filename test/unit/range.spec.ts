import validation, {range} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validation();

describe(`min`, () => {
    valid.setModel({test: {range: range([1, 5])}});
    it(`param:[1, 5] for 10`, () => {
        expect(() => {
            valid.validate({test: 10}, ["test"])
        }).throw(ValidationError);
    });
    it(`param:[1, 5] for 3`, () => {
        expect(() => {
            valid.validate({test: 3}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`param:[1, 5] for {})`, () => {
        expect(() => {
            valid.validate({test: {}}, ["test"])
        }).throw(ValidationError);
    });
});
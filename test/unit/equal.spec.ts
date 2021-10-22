import {validator, equal} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();
describe(`equal`, () => {
    valid.setModel({test: {equal: equal(1)}});
    it(`1 equal 1`, () => {
        expect(() => {
            valid.validate({test: 1}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`1 not equal "1"`, () => {
        expect(() => {
            valid.validate({test: "1"}, ["test"])
        }).throw(ValidationError);
    });
});
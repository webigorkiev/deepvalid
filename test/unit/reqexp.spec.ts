import {validator, regexp} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`regexp`, () => {
    valid.setModel({test: {regexp: regexp(/\d+/)}});
    it(`/\\d+/ => 1230`, () => {
        expect(() => {
            valid.validate({test: 1230}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`/\\d+/ => "string"`, () => {
        expect(() => {
            valid.validate({test: "string"}, ["test"])
        }).throw(ValidationError);
    });
});
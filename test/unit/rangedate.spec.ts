import {validator, rangedate} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`uaPhone`, () => {
    valid.setModel({test: {rangedate: rangedate([new Date("2020-01-01 00:00:00"), new Date("2020-01-01 01:00:00")])}});
    it(`+380931002030`, () => {
        expect(() => {
            valid.validate({test: new Date("2020-01-01 00:00:00")}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`string`, () => {
        expect(() => {
            valid.validate({test: new Date("2020-01-01 01:00:01")}, ["test"])
        }).throw(ValidationError);
    });
});
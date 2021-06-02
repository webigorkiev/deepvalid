import validation, {dateIso} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validation();

describe(`dateIso`, () => {
    valid.setModel({test: {dateIso}});
    const iso = new Date().toISOString().split("T")[0];
    const date = new Date().toString();
    it(`${iso}`, () => {
        expect(() => {
            valid.validate({test: iso}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`${date}`, () => {
        expect(() => {
            valid.validate({test: date}, ["test"])
        }).throw(ValidationError);
    });
});
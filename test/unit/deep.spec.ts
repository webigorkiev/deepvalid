import {validator, required} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`deep required`, () => {
    valid.setModel({
        item: {
            test: {required}
        }
    });

    it("no field", () => {
        expect(() => {
            valid.validate({}, ["item"])
        }).throw(ValidationError);
    });

});
import {validator, depends} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();

describe(`depends`, () => {
    valid.setModel({
        test: {
            depends: depends(v => !!v)
        }
    });
    it("depends true", () => {
        expect(() => {
            valid.validate({test: true}, ["test"])
        }).not.throw(ValidationError);
    });
    it("depends false", () => {
        expect(() => {
            valid.validate({test: false}, ["test"])
        }).throw(ValidationError);
    });
});
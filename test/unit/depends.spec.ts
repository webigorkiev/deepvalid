import validation, {depends} from "@/index";
import ApiError from "@jwn-js/common/ApiError";
import {expect} from "chai";

const valid = validation();

describe(`depends`, () => {
    valid.setModel({
        test: {
            depends: depends(v => !!v)
        }
    });
    it("depends true", () => {
        expect(() => {
            valid.validate({test: true}, ["test"])
        }).not.throw(ApiError);
    });
    it("depends false", () => {
        expect(() => {
            valid.validate({test: false}, ["test"])
        }).throw(ApiError);
    });
});
import {expect} from "chai";
import ApiError from "@jwn-js/common/ApiError";
import {Validation, required, uaPhone, digits} from "@/index"
import cloneDeep from "@jwn-js/easy-ash/cloneDeep";

// https://runebook.dev/ru/docs/chai/-index-

describe("@jwn-js/validation", () => {
    const validation = new Validation();

    describe("Validate single param, filters - default, model: {test: {required}}", () => {
        validation.setModel({
            test: {required},
            user: {
                fio: {required},
                phone: {required, uaPhone},
                address: {
                    street: {required},
                    flat: {
                        required,
                        digits
                    }
                }
            }
        });
        const inputParams = {
            test: "test",
            user: {
                fio: "Jws Js J$",
                phone: "+380931001028",
                address: {
                    street: "Love Street",
                    flat: 45
                }
            }
        };

        it(`{} => ApiError`, () => {
            expect(() => {
                validation.validate({})
            }).throw(ApiError);
        })
        it(`right input params`, () => {
            expect(() => {
                validation.validate(inputParams)
            }).not.throw(ApiError);
        })
        it(`1 wrong deep param`, () => {
            expect(() => {
                const input = cloneDeep(inputParams);
                input.user.address.flat = "10f";
                validation.validate(input)
            }).throw(ApiError);
        })
        it(`delete 2 level param`, () => {
            expect(() => {
                const input = cloneDeep(inputParams);
                delete(input.user.phone)
                validation.validate(input)
            }).throw(ApiError);
        })
    });

    describe("::isKeyInFilters", () => {
        it("finds 1 level deep key in 1 level", () => {
            const result = validation.isKeyDeepInFilters(["test"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(true);
        });
        it("finds 2 level deep key in 2 level", () => {
            const result = validation.isKeyDeepInFilters(["user", "fio"], ["test", {"user": ["fio", "phone"]}]);
            expect(result).to.eql(true);
        });
        it("finds 1 level deep key in 2 level, user - object", () => {
            const result = validation.isKeyDeepInFilters(["user"], ["test", {"user": ["fio", "phone"]}]);
            expect(result).to.eql(true);
        });
        it("finds 2 level deep key in 3 level, user - object", () => {
            const result = validation.isKeyDeepInFilters(["user", "address"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(true);
        });
        it("finds 3 level deep key in 3 level", () => {
            const result = validation.isKeyDeepInFilters(["user", "address", "flat"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(true);
        });
        it("finds 1 level deep key(from 2 level) in 3 level", () => {
            const result = validation.isKeyDeepInFilters(["address"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(false);
        });
        it("absent key 1 level in 3 level", () => {
            const result = validation.isKeyDeepInFilters(["absent"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(false);
        });
        it("key 1 level and absent key 2 level in 3 level", () => {
            const result = validation.isKeyDeepInFilters(["user", "absent"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(false);
        });
    });

});
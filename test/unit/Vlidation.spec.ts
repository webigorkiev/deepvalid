import {expect} from "chai";

import {Validation} from "@/index"

describe("@jwn-js/validation", () => {
    const validation = new Validation();

    describe("::isKeyInFilters", () => {
        it("finds 1 level deep key in 1 level", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["test"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(true);
        });
        it("finds 2 level deep key in 2 level", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["user", "fio"], ["test", {"user": ["fio", "phone"]}]);
            expect(result).to.eql(true);
        });
        it("finds 1 level deep key in 2 level, user - object", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["user"], ["test", {"user": ["fio", "phone"]}]);
            expect(result).to.eql(true);
        });
        it("finds 2 level deep key in 3 level, user - object", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["user", "address"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(true);
        });
        it("finds 3 level deep key in 3 level", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["user", "address", "flat"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(true);
        });
        it("finds 1 level deep key(from 2 level) in 3 level", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["address"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(false);
        });
        it("absent key 1 level in 3 level", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["absent"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(false);
        });
        it("key 1 level and absent key 2 level in 3 level", () => {
            const result = validation.__private__("#isKeyDeepInFilters", ["user", "absent"], ["test", {"user": ["fio", "phone", {"address":["flat", "street"]}]}]);
            expect(result).to.eql(false);
        });
    })
})
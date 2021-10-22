import {validator, eql} from "@/index";
import {ValidationError} from "@/ValidationError";
import {expect} from "chai";

const valid = validator();
describe(`eql`, () => {
    valid.setModel({test: {eql: eql({p:1})}});
    it(`{p:1} eql {p:1}`, () => {
        expect(() => {
            valid.validate({test: {p:1}}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`{p:1} not eql "1"`, () => {
        expect(() => {
            valid.validate({test: "1"}, ["test"])
        }).throw(ValidationError);
    });
    it(`null eql null`, () => {
        valid.setModel({test: {eql: eql(null)}});
        expect(() => {
            valid.validate({test: null}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`NaN eql NaN`, () => {
        valid.setModel({test: {eql: eql(NaN)}});
        expect(() => {
            valid.validate({test: NaN}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`undefined eql undefined`, () => {
        valid.setModel({test: {eql: eql(undefined)}});
        expect(() => {
            valid.validate({test: undefined}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`deep object`, () => {
        valid.setModel({test: {eql: eql({p:1, a:[1,2]})}});
        expect(() => {
            valid.validate({test: {p:1, a:[1,2]}}, ["test"])
        }).not.throw(ValidationError);
    });
    it(`deep not eql object`, () => {
        valid.setModel({test: {eql: eql({p:1, a:[1,2]})}});
        expect(() => {
            valid.validate({test: {p:1, a:[1,3]}}, ["test"])
        }).throw(ValidationError);
    });
});
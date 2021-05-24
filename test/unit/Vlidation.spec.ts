import {expect} from "chai";
import ApiError from "@jwn-js/common/ApiError";
import {
    Validation,
    required,
    boolean,
    array,
    object,
    uaPhone,
    digits,
    minlength,
    maxlength,
    rangelength
} from "@/index"

// https://runebook.dev/ru/docs/chai/-index-

describe("@jwn-js/validation", () => {
    const validation = new Validation();
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

    describe("Validate single param, filters - default, model: {test: {required}}", () => {
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
                const inputParams = {
                    test: "test",
                    user: {
                        fio: "Jws Js J$",
                        phone: "+380931001028",
                        address: {
                            street: "Love Street",
                            flat: "10f"
                        }
                    }
                };
                validation.validate(inputParams)
            }).throw(ApiError);
        })
        it(`delete 2 level param`, () => {
            expect(() => {
                const inputParams = {
                    test: "test",
                    user: {
                        fio: "Jws Js J$",
                        address: {
                            street: "Love Street",
                            flat: 45
                        }
                    }
                };
                validation.validate(inputParams)
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

    describe("Validators tests with filters", () => {

        describe(`required`, () => {
            it("required string", () => {
                expect(() => {
                    validation.validate({test: "test"}, ["test"])
                }).not.throw(ApiError);
            });
            it("required 0", () => {
                expect(() => {
                    validation.validate({test: 0}, ["test"])
                }).not.throw(ApiError);
            });
            it(`required "0"`, () => {
                expect(() => {
                    validation.validate({test: "0"}, ["test"])
                }).not.throw(ApiError);
            });
            it("required false", () => {
                expect(() => {
                    validation.validate({test: false}, ["test"])
                }).not.throw(ApiError);
            });
            it("required {}", () => {
                expect(() => {
                    validation.validate({}, ["test"])
                }).throw(ApiError);
            })
            it(`required ""`, () => {
                expect(() => {
                    validation.validate({test: ""}, ["test"])
                }).not.throw(ApiError);
            })
            it("required undefined", () => {
                expect(() => {
                    validation.validate({test: undefined}, ["test"])
                }).throw(ApiError);
            });
            it("required null", () => {
                expect(() => {
                    validation.validate({test: null}, ["test"])
                }).throw(ApiError);
            });
            it("required Nan", () => {
                expect(() => {
                    validation.validate({test: NaN}, ["test"])
                }).throw(ApiError);
            });
        });

        describe(`boolean`, () => {
            const validation = new Validation({test: {boolean}});
            it("boolean true", () => {
                expect(() => {
                    validation.validate({test: true}, ["test"])
                }).not.throw(ApiError);
            });
            it("boolean false", () => {
                expect(() => {
                    validation.validate({test: false}, ["test"])
                }).not.throw(ApiError);
            });
            it("boolean {}", () => {
                expect(() => {
                    validation.validate({}, ["test"])
                }).not.throw(ApiError);
            });
            it("boolean 0", () => {
                expect(() => {
                    validation.validate({test: 0}, ["test"])
                }).throw(ApiError);
            });
        });

        describe(`array`, () => {
            const validation = new Validation({test: {array}});
            it("array []", () => {
                expect(() => {
                    validation.validate({test: []}, ["test"])
                }).not.throw(ApiError);
            });
            it("array {}", () => {
                expect(() => {
                    validation.validate({test: {}}, ["test"])
                }).throw(ApiError);
            });
        });

        describe(`object`, () => {
            const validation = new Validation({test: {object}});
            it("object {}", () => {
                expect(() => {
                    validation.validate({test: {}}, ["test"])
                }).not.throw(ApiError);
            });
            it("object []", () => {
                expect(() => {
                    validation.validate({test: []}, ["test"])
                }).throw(ApiError);
            });
        });

        describe(`minlength`, () => {
            const validation = new Validation({test: {minlength: {param: 5}}});
            it(`param:5 for "12345"`, () => {
                expect(() => {
                    validation.validate({test: "12345"}, ["test"])
                }).not.throw(ApiError);
            });
            it(`param:5 for "123"`, () => {
                expect(() => {
                    validation.validate({test: "123"}, ["test"])
                }).throw(ApiError);
            });
            it(`param:5 for new Set([1,2])`, () => {
                expect(() => {
                    validation.validate({test: new Set([1,2])}, ["test"])
                }).throw(ApiError);
            });
        });

        describe(`maxlength`, () => {
            const validation = new Validation({test: {maxlength: {param: 5}}});
            it(`param:5 for "123456"`, () => {
                expect(() => {
                    validation.validate({test: "123456"}, ["test"])
                }).throw(ApiError);
            });
            it(`param:5 for "123"`, () => {
                expect(() => {
                    validation.validate({test: "123"}, ["test"])
                }).not.throw(ApiError);
            });
            it(`param:5 for new Set([1,2,3,4,5,6])`, () => {
                expect(() => {
                    validation.validate({test: new Set([1,2,3,4,5,6])}, ["test"])
                }).throw(ApiError);
            });
        });

        describe(`rangelength 1-5`, () => {
            const validation = new Validation({test: {rangelength: {param: [1, 5]}}});
            it(`param:5 for "123456"`, () => {
                expect(() => {
                    validation.validate({test: "123456"}, ["test"])
                }).throw(ApiError);
            });
            it(`param:5 for "123"`, () => {
                expect(() => {
                    validation.validate({test: "123"}, ["test"])
                }).not.throw(ApiError);
            });
            it(`param:5 for new Set([1,2,3,4,5,6])`, () => {
                expect(() => {
                    validation.validate({test: new Set([1,2,3,4,5,6])}, ["test"])
                }).throw(ApiError);
            });
        });
    });

});
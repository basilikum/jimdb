describe("_", function() {

    describe("isArray", function() {

        it("should return true if value is Array", function () {
            expect(_.isArray([])).toBe(true);
        });
        it("should return false if value is not Array", function () {
            expect(_.isArray(1)).toBe(false);
            expect(_.isArray("string")).toBe(false);
            expect(_.isArray(true)).toBe(false);
            expect(_.isArray(NaN)).toBe(false);
            expect(_.isArray(undefined)).toBe(false);
            expect(_.isArray(null)).toBe(false);
            expect(_.isArray({})).toBe(false);
            expect(_.isArray(new Date())).toBe(false);
            expect(_.isArray(/^a/)).toBe(false);
            expect(_.isArray(function () {})).toBe(false);
        });
    });

    describe("isObject", function() {
        it("should return true if value is Object", function () {
            expect(_.isObject({})).toBe(true);
            expect(_.isObject([])).toBe(true);
            expect(_.isObject(new Date())).toBe(true);
            expect(_.isObject(function () {})).toBe(true);
            expect(_.isObject(/^a/)).toBe(true);
        });
        it("should return false if value is not Object", function () {
            expect(_.isObject(1)).toBe(false);
            expect(_.isObject("string")).toBe(false);
            expect(_.isObject(true)).toBe(false);
            expect(_.isObject(NaN)).toBe(false);
            expect(_.isObject(undefined)).toBe(false);
            expect(_.isObject(null)).toBe(false);
        });
    });

    describe("isFunction", function() {
        it("should return true if value is Function", function () {
            expect(_.isFunction(function () {})).toBe(true);
        });
        it("should return false if value is not Function", function () {
            expect(_.isFunction(/^a/)).toBe(false);
            expect(_.isFunction({})).toBe(false);
            expect(_.isFunction([])).toBe(false);
            expect(_.isFunction(new Date())).toBe(false);
            expect(_.isFunction(1)).toBe(false);
            expect(_.isFunction("string")).toBe(false);
            expect(_.isFunction(true)).toBe(false);
            expect(_.isFunction(NaN)).toBe(false);
            expect(_.isFunction(undefined)).toBe(false);
            expect(_.isFunction(null)).toBe(false);
        });
    });

    describe("isBoolean", function() {
        it("should return true if value is Boolean", function () {
            expect(_.isBoolean(true)).toBe(true);
            expect(_.isBoolean(new Boolean(false))).toBe(true);
        });
        it("should return false if value is not Boolean", function () {
            expect(_.isBoolean(/^a/)).toBe(false);
            expect(_.isBoolean({})).toBe(false);
            expect(_.isBoolean([])).toBe(false);
            expect(_.isBoolean(new Date())).toBe(false);
            expect(_.isBoolean(1)).toBe(false);
            expect(_.isBoolean("string")).toBe(false);
            expect(_.isBoolean(NaN)).toBe(false);
            expect(_.isBoolean(undefined)).toBe(false);
            expect(_.isBoolean(null)).toBe(false);
            expect(_.isBoolean(function () {})).toBe(false);
        });
    });

    describe("isInt", function() {
        it("should return true if value is Integer", function () {
            expect(_.isInt(43)).toBe(true);
            expect(_.isInt(-34)).toBe(true);
            expect(_.isInt(new Number(34))).toBe(true);
        });
        it("should return false if value is not Integer", function () {
            expect(_.isInt(/^a/)).toBe(false);
            expect(_.isInt({})).toBe(false);
            expect(_.isInt([])).toBe(false);
            expect(_.isInt(new Date())).toBe(false);
            expect(_.isInt("string")).toBe(false);
            expect(_.isInt(NaN)).toBe(false);
            expect(_.isInt(Infinity)).toBe(false);
            expect(_.isInt(-Infinity)).toBe(false);
            expect(_.isInt(1.2)).toBe(false);
            expect(_.isInt(new Number(4.34))).toBe(false);
            expect(_.isInt(undefined)).toBe(false);
            expect(_.isInt(null)).toBe(false);
            expect(_.isInt(function () {})).toBe(false);
            expect(_.isInt(true)).toBe(false);
            expect(_.isInt(new Boolean(false))).toBe(false);
        });
    });

    describe("isPositiveInt", function() {
        it("should return true if value is positive Integer", function () {
            expect(_.isPositiveInt(43)).toBe(true);
        });
        it("should return false if value is not positive Integer", function () {
            expect(_.isPositiveInt(/^a/)).toBe(false);
            expect(_.isPositiveInt({})).toBe(false);
            expect(_.isPositiveInt([])).toBe(false);
            expect(_.isPositiveInt(new Date())).toBe(false);
            expect(_.isPositiveInt("string")).toBe(false);
            expect(_.isPositiveInt(NaN)).toBe(false);
            expect(_.isPositiveInt(Infinity)).toBe(false);
            expect(_.isPositiveInt(-Infinity)).toBe(false);
            expect(_.isPositiveInt(1.2)).toBe(false);
            expect(_.isPositiveInt(-34)).toBe(false);
            expect(_.isPositiveInt(undefined)).toBe(false);
            expect(_.isPositiveInt(null)).toBe(false);
            expect(_.isPositiveInt(function () {})).toBe(false);
            expect(_.isPositiveInt(true)).toBe(false);
            expect(_.isPositiveInt(new Boolean(false))).toBe(false);
        });
    });

    describe("isDate", function() {
        it("should return true if value is valid (!) Date", function () {
            expect(_.isDate(new Date())).toBe(true);
        });
        it("should return false if value is not valid Date", function () {
            expect(_.isDate(/^a/)).toBe(false);
            expect(_.isDate({})).toBe(false);
            expect(_.isDate([])).toBe(false);
            expect(_.isDate(new Date("some nonesense"))).toBe(false);
            expect(_.isDate("string")).toBe(false);
            expect(_.isDate(NaN)).toBe(false);
            expect(_.isDate(1.2)).toBe(false);
            expect(_.isDate(undefined)).toBe(false);
            expect(_.isDate(null)).toBe(false);
            expect(_.isDate(function () {})).toBe(false);
            expect(_.isDate(true)).toBe(false);
            expect(_.isDate(new Boolean(false))).toBe(false);
        });
    });

    describe("isString", function() {
        it("should return true if value is String", function () {
            expect(_.isString("string")).toBe(true);
            expect(_.isString("")).toBe(true);
            expect(_.isString(new String("string"))).toBe(true);
        });
        it("should return false if value is not String", function () {
            expect(_.isString(/^a/)).toBe(false);
            expect(_.isString({})).toBe(false);
            expect(_.isString([])).toBe(false);
            expect(_.isString(new Date("some nonesense"))).toBe(false);
            expect(_.isString(NaN)).toBe(false);
            expect(_.isString(1.2)).toBe(false);
            expect(_.isString(undefined)).toBe(false);
            expect(_.isString(null)).toBe(false);
            expect(_.isString(function () {})).toBe(false);
            expect(_.isString(true)).toBe(false);
            expect(_.isString(new Boolean(false))).toBe(false);
            expect(_.isString(new Date())).toBe(false);
        });
    });

    describe("each", function() {
        it("should traverse every item of Array in correct order", function () {
            var testArray = [1,undefined,3,4,5],
                i, max_i, counter = 0;
            testArray.someOtherProperty = 6;
            testArray[8] = 7;
            _.each(testArray, function (item, index, arr) {
                expect(index).toBe(counter);
                expect(arr).toBe(testArray);
                expect(item).toBe(testArray[index]);
                counter += 1;
            });
            expect(counter).toBe(testArray.length);
        });
        it("should traverse every own item of Object", function () {
            var testObj = new X(),
                counter = 0;

            function X() {
                this.a = 1;
                this.b = 2;
                this.c = 3;
            }
            X.prototype.d = 4;

            _.each(testObj, function (item, key, list) {
                expect(list).toBe(testObj);
                expect(Object.prototype.hasOwnProperty.call(list, key)).toBe(true);
                expect(list[key]).toBe(item);
                counter += 1;
            });
            expect(counter).toBe(3);
        });
        it("should throw exception is object is not iterable", function () {
            function each() {
                _.each(1, function (item, key, list) {});
            }
            expect(each).toThrow();
        });
    });

    describe("invokeEach", function() {
        it("should call every function in array or object with correct context and arguments", function () {
            var context = {},
                counter = 0;
                testArray = [
                    function (a, b) { expect(this).toBe(context); expect(a).toBe(1); expect(b).toBe(2); counter += 1; },
                    function (a, b) { expect(this).toBe(context); expect(a).toBe(1); expect(b).toBe(2); counter += 1; }
                ],
                testObj = {
                    a: function (a, b) { expect(this).toBe(context); expect(a).toBe(1); expect(b).toBe(2); counter += 1; },
                    b: function (a, b) { expect(this).toBe(context); expect(a).toBe(1); expect(b).toBe(2); counter += 1; }
                };

            _.invokeEach(testArray, context, 1, 2);
            _.invokeEach(testObj, context, 1, 2);
            expect(counter).toBe(4);
        });

        it("should throw exception if one item is not a function", function () {
            var context = {},
                testArray = [
                    function (a, b) { },
                    "something else"
                ];

            function test() {
                _.invokeEach(testArray, context, 1, 2);
            }
            expect(test).toThrow();
        });
    });

    describe("map", function() {
        it("should map object items", function () {
            var testArray = [1,2,3],
                result;
            result = _.map(testArray, function (item, index, arr) {
                return item * item;
            });
            expect(result).toEqual([1,4,9]);
        });
    });

    describe("count", function() {
        it("should count array items", function () {
            var testArray = [1,2,3,4,5,6,7],
                result;
            result = _.count(testArray, function (item, index, arr) {
                return item % 2 === 0;
            });
            expect(result).toEqual(3);
        });
    });

    describe("filter", function() {
        it("should filter array items", function () {
            var testArray = [1,2,3,4,5,6,7],
                result;
            result = _.filter(testArray, function (item, index, arr) {
                return item % 2 === 0;
            });
            expect(result).toEqual([2,4,6]);
        });
    });

    describe("values", function() {
        it("should return copy of array", function () {
            var testArray = [1,2,3],
                result;
            result = _.values(testArray);
            expect(result).toEqual(testArray);
            expect(result).not.toBe(testArray);
        });
        it("should return values of object", function () {
            var testObj = {a:1, b:2, c:3},
                result;
            result = _.values(testObj);
            expect(result).toEqual([1,2,3]);
        });
    });

    describe("indexOf", function() {
        it("should return index of item in array", function () {
            var testArray = [1,2,3],
                result;
            result = _.indexOf(testArray, 2);
            expect(result).toBe(1);
        });
        it("should raise exception if value is not array", function () {
            function test() {
                _.indexOf({a:1}, 1);
            }
            expect(test).toThrow();
        });
    });

    describe("find", function() {
        it("should return first item in array that matches", function () {
            var testArray = [1,2,5,4,3],
                result;
            result = _.find(testArray, function (item) {
                return item > 2;
            });
            expect(result).toBe(5);
        });
        it("should return undefined if no match in array", function () {
            var testArray = [1,2,5,4,3],
                result;
            result = _.find(testArray, function (item) {
                return item > 5;
            });
            expect(result).toBe(undefined);
        });
        it("should return one of the items in object that matches", function () {
            var testObj = {a:1, b:2, c:5, d:4, e:3},
                result;
            result = _.find(testObj, function (item) {
                return item > 2;
            });
            expect(result === 5 || result === 4 || result === 3).toBe(true);
        });
        it("should return undefined if no match in object", function () {
            var testObj = {a:1, b:2, c:5, d:4, e:3},
                result;
            result = _.find(testObj, function (item) {
                return item > 5;
            });
            expect(result).toBe(undefined);
        });
    });

    describe("contains", function() {
        it("should return true if item is in array", function () {
            var testArray = [1,2,3],
                result;
            result = _.contains(testArray, 2);
            expect(result).toBe(true);
        });
        it("should return false if item is not array", function () {
            var testArray = [1,2,3],
                result;
            result = _.contains(testArray, 4);
            expect(result).toBe(false);
        });
        it("should return true if item is in object", function () {
            var testObj = {a:1, b:2, c:3},
                result;
            result = _.contains(testObj, 2);
            expect(result).toBe(true);
        });
        it("should return false if item is not in object", function () {
            var testObj = {a:1, b:2, c:3},
                result;
            result = _.contains(testObj, 4);
            expect(result).toBe(false);
        });
    });

    describe("has", function() {
        it("should return true if object has own key", function () {
            var testObj = {a:1, b:2, c:3},
                result;
            result = _.has(testObj, "b");
            expect(result).toBe(true);
        });
        it("should return false if object has not own key", function () {
            var testObj = {a:1, b:2, c:3},
                result;
            result = _.has(testObj, "d");
            expect(result).toBe(false);
        });
        it("should return false if item is not object", function () {
            expect( _.has("string", "b")).toBe(false);
            expect( _.has(1, "b")).toBe(false);
            expect( _.has(NaN, "b")).toBe(false);
            expect( _.has(true, "b")).toBe(false);
        });
        it("should raise exception if item is undefined or null", function () {
            function test1 () {
                _.has(null, "b");
            }
            function test2 () {
                _.has(undefined, "b");
            }
            expect(test1).toThrow();
            expect(test2).toThrow();
        });
    });

    describe("isUnique", function() {
        it("should return true if the same value is not returned more than once", function () {
            var testArray = [1,2,3],
                result;
            result = _.isUnique(testArray, function (item, index, arr) {
                return item;
            });
            expect(result).toBe(true);
        });
        it("should return false if the same value is returned more than once", function () {
            var testArray = [1,2,1],
                result;
            result = _.isUnique(testArray, function (item, index, arr) {
                return item;
            });
            expect(result).toBe(false);
        });
    });
});


describe("trim", function() {
    it("should trim all whitespaces on both sides of a string", function () {
        var testString = " \f\n\r\t\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000a \f\n\r\t\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000a \f\n\r\t\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000";
        expect(trim(testString)).toBe("a \f\n\r\t\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000a");
    });
});
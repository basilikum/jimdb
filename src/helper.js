var _ = (function () {

    function each(obj, func) {
        var i, max_i, key;
        if (isArray(obj)) {
            for (i = 0, max_i = obj.length; i < max_i; i++) {
                func(obj[i], i, obj);
            }
        } else if (isObject(obj)) {
            for (key in obj) {
                if (has(obj, key)) {
                    func(obj[key], key, obj);
                }
            }
        } else {
            throw "cannot iterate " + obj.toString() + " of type " + (typeof obj);
        }
    }

    function map(obj, func) {
        var res = [];
        each(obj, function () {
            res.push(func.apply(this, arguments));
        });
        return res;
    }

    function values(obj) {
        return map(obj, function (val) {
            return val;
        });
    }

    function count(obj, func) {
        var counter = 0;
        each(obj, function () {
            if (func.apply(this, arguments)) {
                counter += 1;
            }
        });
        return counter;
    }

    function filter(obj, func) {
        var res = [];
        each(obj, function (item) {
            if (func.apply(this, arguments)) {
                res.push(item);
            }
        });
        return res;
    }

    function invokeEach(obj, context) {
        var args = Array.prototype.slice.call(arguments, 2);
        each(obj, function (item) {
            item.apply(context, args);
        });
    }

    function indexOf(arr, item) {
        var i, max_i;
        if (isArray(arr)) {
            for (i = 0, max_i = arr.length; i < max_i; i++) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        } else {
            throw "cannot use indexOf on non Array value";
        }
    }

    function find(obj, func) {
        var i, max_i, key;
        if (isArray(obj)) {
            for (i = 0, max_i = obj.length; i < max_i; i++) {
                if (func(obj[i], i, obj)) {
                    return obj[i];
                }
            }
        } else if (isObject(obj)) {
            for (key in obj) {
                if (has(obj, key)) {
                    if (func(obj[key], key, obj)) {
                        return obj[key];
                    }
                }
            }
        } else {
            throw "cannot iterate " + obj.toString() + " of type " + (typeof obj);
        }
    }

    function contains(obj, item) {
        var key;
        if (isArray(obj)) {
            return indexOf(obj, item) > -1;
        } else if (isObject(obj)) {
            for (key in obj) {
                if (has(obj, key) && obj[key] === item) {
                    return true;
                }
            }
        }
        return false;
    }

    function has(obj, key) {
        if (obj === null || obj === undefined) {
            throw "Cannot convert undefined or null to object";
        }
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function isUnique(obj, func) {
        var hash = {}, result = true;
        each(obj, function () {
            var key = func.apply(this, arguments);
            if (hash[key]) {
                result = false;
            }
            hash[key] = true;
        });
        return result;
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }

    function isObject(obj) {
        var objType = typeof obj;
        return (objType === "object" && obj !== null) || objType === "function";
    }

    function isFunction(obj) {
        return typeof obj === "function";
    }

    function isBoolean(obj) {
        return Object.prototype.toString.call(obj) === '[object Boolean]';
    }

    function isPositiveInt(n) {
       return isInt(n) && n > 0;
    }

    function isInt(n) {
       return Object.prototype.toString.call(n) === '[object Number]' && n % 1 === 0;
    }

    function isDate(n) {
        return n instanceof Date && !isNaN(n.getTime());
    }

    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    return {
        each: each,
        map: map,
        values: values,
        count: count,
        filter: filter,
        invokeEach: invokeEach,
        indexOf: indexOf,
        find: find,
        contains: contains,
        has: has,
        isUnique: isUnique,
        isArray: isArray,
        isObject: isObject,
        isFunction: isFunction,
        isBoolean: isBoolean,
        isInt: isInt,
        isPositiveInt: isPositiveInt,
        isDate: isDate,
        isString: isString
    };
}());


function trim(str) {
    return str.toString().replace(/^\s+/, "").replace(/\s+$/, "");
}


function isValidPk(pk) {
    return (typeof pk === "string" && pk.length > 0) || (typeof pk === "number" && !isNaN(pk) && pk > -Infinity && pk < Infinity);
}

function toPk(pk) {
    if (typeof pk === "number" && !isNaN(pk) && pk > -Infinity && pk < Infinity) {
        return pk;
    } else {
        return "" + pk;
    }
}
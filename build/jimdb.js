/**
 * jimdb - v0.0.1 - 2014-06-12
 * 
 *
 * Copyright (c) 2014 Bastian Krüger
 * Licensed MIT <https://raw.githubusercontent.com/basilikum/jimdb/master/LICENSE>
 */
(function (window, undefined) {
var register = {};
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

function Set(model) {
    var that = this;
    this.$$model = model;
    this.$$items = {};
    this.$$handler = {
        add: [],
        remove: [],
        beforeAdd: [],
        beforeRemove: []
    };
}

Set.prototype.toArray = function () {
    return _.values(this.$$items);
};

Set.prototype.on = function (name, handler) {
    if (_.has(this.$$handler, name)) {
        this.$$handler[name].push(handler);
    }
};

Set.prototype.add = function (item) {
    var matchItem, pk;
    if (item instanceof this.$$model.constructor) {
        if (_.contains(this.$$items, item)) {
            return;
        }
        matchItem = item;
        pk = item[this.$$model.pkName];
    } else {
        pk = toPk(item);
        if (_.has(this.$$items, item)) {
            return;
        }
        matchItem = this.$$model.items[pk] || null;
    }

    _.invokeEach(this.$$handler.beforeAdd, null, pk, matchItem, this);
    this.$$items[pk] = matchItem;
    _.invokeEach(this.$$handler.add, null, pk, matchItem, this);
};

Set.prototype.remove = function (item) {
    var matchItem, pk;
    if (item instanceof this.$$model.constructor) {
        if (!_.contains(this.$$items, item)) {
            return;
        }
        matchItem = item;
        pk = item[this.$$model.pkName];
    } else {
        if (!_.has(this.$$items, item)) {
            return;
        }
        pk = toPk(item);
        matchItem = this.$$items[pk];
    }
    _.invokeEach(this.$$handler.beforeRemove, null, pk, matchItem, this);
    delete this.$$items[pk];
    _.invokeEach(this.$$handler.remove, null, pk, matchItem, this);
};




function Field(name, model, related) {
    this.name = name;
    this.related = related;
    this.model = model;

    Field.verifyName(name);
}
Field.verifyName = function (name) {
    if (name === "pk") {
        throw "Cannot use reserved word \"pk\" as field name";
    }
};

Field.prototype.verify = function () {
    return true;
};

Field.prototype.sanitize = function (value) {
    return value;
};

Field.prototype.set = function (item, value) {
    item["$$" + this.name] = value;
};

Field.prototype.get = function (item) {
    return item["$$" + this.name];
};

Field.prototype.getDefault = function (item) {
    return "";
};

Field.prototype.addGetterSetter = function (item) {
    var field = this;
    Object.defineProperty(item, field.name, {
        get: function () { return field.get(item); },
        set: function (value) { return field.set(item, value); }
    });
};

Field.prototype.init = function (item) {
    this.initFlat(item);
};

Field.prototype.initFlat = function (item) {
    item[this.name] = this.getDefault(item);
};

Field.prototype.initGetSet = function (item) {
    item["$$" + this.name] = this.getDefault(item);
    this.addGetterSetter(item);
};

Field.prototype.initRelated = function (item) {
    this.initGetSet(item);
    item["$$" + this.name + "_rel"] = {
        pk: null,
        resolved: false
    };
};

function PkField(model, relatedField) {
    Field.call(this, "", model, false);
    this.name = "pk";

    this.relatedField = relatedField;
}

PkField.prototype = Object.create(Field.prototype);
PkField.prototype.constructor = PkField;
PkField.prototype.get = function (item) {
    if (this.relatedField.related) {
        return item["$$" + this.relatedField.name + "_rel"].pk;
    } else {
        return item[this.relatedField.name];
    }
};
PkField.prototype.set = function (item, value) {
    return false;
};
PkField.prototype.init = function (item) {
    this.addGetterSetter(item);
};


function OneToManyCounterField(name, model, relatedField, resolve) {
    var relatedModel = relatedField.model, that = this;

    Field.call(this, name, model, true);

    if (!(model instanceof Model)) {
        throw "required property \"model\" not set correctly; Model expected";
    }
    this.relatedField = relatedField;
    this.resolve = resolve;
    this.relatedModel = relatedModel;
}

OneToManyCounterField.prototype = Object.create(Field.prototype);
OneToManyCounterField.prototype.constructor = OneToManyCounterField;
OneToManyCounterField.prototype.set = function (item, value) {
    return false;
};
OneToManyCounterField.prototype.getDefault = function (item) {
    var that = this, set;
    
    set = new Set(that.relatedModel);
    set.on("beforeAdd", function (pk, relatedItem, set) {
        if (!relatedItem) {
            return;
        }
        var oldItem = relatedItem["$$" + that.relatedField.name];
        if (oldItem) {
            oldItem[that.name].remove(relatedItem);
        }  
    });
    set.on("add", function (pk, relatedItem, set) {
        if (!relatedItem) {
            return;
        }
        relatedItem["$$" + that.relatedField.name] = item;
        relatedItem["$$" + that.relatedField.name + "_rel"] = {
            pk: item[that.model.pkName],
            resolved: true
        };    
    });
    set.on("remove", function (pk, relatedItem, set) {
        if (!relatedItem) {
            return;
        }
        relatedItem["$$" + that.relatedField.name] = null;
        relatedItem["$$" + that.relatedField.name + "_rel"] = {
            pk: null,
            resolved: true
        };
    });
    return set;
};
OneToManyCounterField.prototype.init = function (item) {
    this.initGetSet(item);
};

function OneToManyField(name, model, data) {
    Field.call(this, name, model, true);

    OneToManyField.verfiyData(data);
    this.relatedModel = register[data.relatedModel];
    this.resolve = data.resolveForward;
    this.optional = !!data.optional;
    this.relatedField = new OneToManyCounterField(model.name.toLowerCase() + "_set", this.relatedModel, this, data.resolveBackward);

    this.relatedModel.fields.push(this.relatedField);
}


OneToManyField.verfiyData = function (data) {
    if (!(register[data.relatedModel] instanceof Model)) {
        throw "no model with the name \"" + data.relatedModel + "\" defined";
    }
    if (!_.isFunction(data.resolveForward)) {
        throw "required property \"resolveForward\" not set correctly; function expected";
    }
    if (!_.isFunction(data.resolveBackward)) {
        throw "required property \"resolveBackward\" not set correctly; function expected";
    }
    if (_.has(data, "optional") && !_.isBoolean(data.optional)) {
        throw "optional property \"optional\" not set correctly; boolean value expected";
    }
};

OneToManyField.prototype = Object.create(Field.prototype);
OneToManyField.prototype.constructor = OneToManyField;
OneToManyField.prototype.verify = function (value) {
    if (value instanceof this.relatedModel.constructor || (this.optional && (value === undefined || value === null))) {
        return true;
    }
    return false;
};
OneToManyField.prototype.set = function (item, value) {
    var inst = null, pk,
        currentInst = item["$$" + this.name];

    if (value instanceof this.relatedModel.constructor) {
        inst = value;
        pk = inst[this.relatedModel.pkName];
    } else {
        inst = this.relatedModel.items[value] || null;
        pk = value;
    }

    if (currentInst && currentInst !== inst) {
        currentInst[this.relatedField.name].remove(item);
    }

    item["$$" + this.name] = inst;
    item["$$" + this.name + "_rel"] = {
        pk: pk,
        resolved: !!inst
    };
    if (inst) {
        inst[this.relatedField.name].add(item);
    }
};

OneToManyField.prototype.getDefault = function (item) {
    return null;
};

OneToManyField.prototype.init = function (item) {
    this.initRelated(item);
};

function ManyToManyCounterField(name, model, relatedField, resolve) {
    var relatedModel = relatedField.model, that = this;

    Field.call(this, name, model, true);

    if (!(model instanceof Model)) {
        throw "required property \"model\" not set correctly; Model expected";
    }
    this.relatedField = relatedField;
    this.resolve = resolve;
    this.relatedModel = relatedModel;
}

ManyToManyCounterField.prototype = Object.create(Field.prototype);
ManyToManyCounterField.prototype.constructor = ManyToManyCounterField;
ManyToManyCounterField.prototype.set = function (item, value) {
    return false;
};
ManyToManyCounterField.prototype.getDefault = function (item) {
    var that = this, set;
    
    set = new Set(that.relatedModel);
    set.on("add", function (pk, relatedItem, set) {
        if (!relatedItem) {
            return;
        }
        relatedItem["$$" + that.relatedField.name].add(item);  
    });
    set.on("remove", function (pk, relatedItem, set) {
        if (!relatedItem) {
            return;
        }
        relatedItem["$$" + that.relatedField.name].remove(item);
    });
    return set;
};
ManyToManyCounterField.prototype.init = function (item) {
    this.initGetSet(item);
};

function ManyToManyField(name, model, data) {
    var that = this;

    Field.call(this, name, model, true);

    ManyToManyField.verfiyData(data);
    this.relatedModel = register[data.relatedModel];
    this.resolve = data.resolveForward;
    this.relatedField = new ManyToManyCounterField(model.name.toLowerCase() + "_set", this.relatedModel, this, data.resolveBackward);

    this.relatedModel.fields.push(this.relatedField);
}

ManyToManyField.verfiyData = function (data) {
    if (!(register[data.relatedModel] instanceof Model)) {
        throw "no model with the name \"" + data.relatedModel + "\" defined";
    }
    if (!_.isFunction(data.resolveForward)) {
        throw "required property \"resolveForward\" not set correctly; function expected";
    }
    if (!_.isFunction(data.resolveBackward)) {
        throw "required property \"resolveBackward\" not set correctly; function expected";
    }
};

ManyToManyField.prototype = Object.create(Field.prototype);
ManyToManyField.prototype.constructor = ManyToManyField;
ManyToManyField.prototype.verify = function (value) {
    var that = this;

    if (!_.isArray(value)) {
        return false;
    }
    return _.every(value, function (obj) {
        return obj instanceof that.relatedModel.constructor;
    });
};
ManyToManyField.prototype.set = function (item, value) {
    return false;
};
ManyToManyField.prototype.getDefault = function (item) {
    var that = this, set;
    
    set = new Set(that.relatedModel);
    set.on("add", function (pk, relatedItem, set) {
        if (!relatedItem) {
            return;
        }
        relatedItem["$$" + that.relatedField.name].add(item);  
    });
    set.on("remove", function (pk, relatedItem, set) {
        if (!relatedItem) {
            return;
        }
        relatedItem["$$" + that.relatedField.name].remove(item);
    });
    return set;
};
ManyToManyField.prototype.init = function (item) {
    this.initGetSet(item);
};


function OneToOneCounterField(name, model, relatedField, resolve) {
    var relatedModel = relatedField.model, that = this;

    Field.call(this, name, model, true);

    if (!(model instanceof Model)) {
        throw "required property \"model\" not set correctly; Model expected";
    }
    this.relatedField = relatedField;
    this.resolve = resolve;
    this.relatedModel = relatedModel;
}

OneToOneCounterField.prototype = Object.create(Field.prototype);
OneToOneCounterField.prototype.constructor = OneToOneCounterField;
OneToOneCounterField.prototype.set = function (item, value) {
    var inst = null, pk,
        currentInst = item["$$" + this.name];

    if (value instanceof this.relatedModel.constructor) {
        inst = value;
        pk = inst[this.relatedModel.pkName];
    } else {
        inst = this.relatedModel.items[value] || null;
        pk = value;
    }

    if (currentInst) {
        if (currentInst !== inst) {
            currentInst["$$" + this.relatedField.name] = null;
            currentInst["$$" + this.relatedField.name + "_rel"] = {
                pk: null,
                resolved: true
            };
        } else {
            return;
        }
    }

    item["$$" + this.name] = inst;
    item["$$" + this.name + "_rel"] = {
        pk: pk,
        resolved: !!inst
    };
    if (inst) {
        inst[this.relatedField.name] = item;
    }
};
OneToOneCounterField.prototype.getDefault = function (item) {
    return null;
};
OneToOneCounterField.prototype.init = function (item) {
    this.initRelated(item);
};


function OneToOneField(name, model, data) {
    Field.call(this, name, model, true);

    OneToOneField.verfiyData(data);
    this.relatedModel = register[data.relatedModel];
    this.resolve = data.resolveForward;
    this.optional = !!data.optional;
    this.relatedField = new OneToOneCounterField(model.name.toLowerCase(), this.relatedModel, this, data.resolveBackward);

    this.relatedModel.fields.push(this.relatedField);
}

OneToOneField.verfiyData = function (data) {
    if (!(register[data.relatedModel] instanceof Model)) {
        throw "no model with the name \"" + data.relatedModel + "\" defined";
    }
    if (!_.isFunction(data.resolveForward)) {
        throw "required property \"resolveForward\" not set correctly; function expected";
    }
    if (!_.isFunction(data.resolveBackward)) {
        throw "required property \"resolveBackward\" not set correctly; function expected";
    }
    if (_.has(data, "optional") && !_.isBoolean(data.optional)) {
        throw "optional property \"optional\" not set correctly; boolean value expected";
    }
};

OneToOneField.prototype = Object.create(Field.prototype);
OneToOneField.prototype.constructor = OneToOneField;
OneToOneField.prototype.verify = function (value) {
    if (value instanceof this.relatedModel.constructor || (this.optional && (value === undefined || value === null))) {
        return true;
    }
    return false;
};
OneToOneField.prototype.set = function (item, value) {
    var inst = null, pk,
        currentInst = item["$$" + this.name];

    if (value instanceof this.relatedModel.constructor) {
        inst = value;
        pk = inst[this.relatedModel.pkName];
    } else {
        inst = this.relatedModel.items[value] || null;
        pk = value;
    }

    if (currentInst) {
        if (currentInst !== inst) {
            currentInst["$$" + this.relatedField.name] = null;
            currentInst["$$" + this.relatedField.name + "_rel"] = {
                pk: null,
                resolved: true
            };
        } else {
            return;
        }
    }

    item["$$" + this.name] = inst;
    item["$$" + this.name + "_rel"] = {
        pk: pk,
        resolved: !!inst
    };
    if (inst) {
        inst[this.relatedField.name] = item;
    }
};

OneToOneField.prototype.getDefault = function (item) {
    return null;
};

OneToOneField.prototype.init = function (item) {
    this.initRelated(item);
};

function StringField(name, model, data) {
    Field.call(this, name, model, false);

    StringField.verfiyData(data);
    this.optional = !!data.optional;
    this.primary = !!data.primary;
    this.maxLength = data.maxLength || Infinity;
}

StringField.verfiyData = function (data) {
    if (_.has(data, "primary") && !_.isBoolean(data.primary)) {
        throw "optional property \"primary\" not set correctly; boolean value expected";
    }
    if (_.has(data, "optional") && !_.isBoolean(data.optional)) {
        throw "optional property \"optional\" not set correctly; boolean value expected";
    }
    if (data.optional && data.primary) {
        throw "primary fields can never be optional";
    }
    if (_.has(data, "maxLength") && !_.isPositiveInt(data.maxLength)) {
        throw "optional property \"maxLength\" not set correctly; positive integer value expected";
    }
};

StringField.prototype = Object.create(Field.prototype);
StringField.prototype.constructor = StringField;
StringField.prototype.verify = function (value) {
    value = trim(value);
    if ((_.isString(value) && value.length <= this.maxLength && value.length > 0) || (this.optional && (value === undefined || value === null || value === ""))) {
        return true;
    }
    return false;
};
StringField.prototype.sanitize = function (value) {
    return value.toString().trim();
};
StringField.prototype.getDefault = function (item) {
    return "";
};
StringField.prototype.init = function (item) {
    this.initFlat(item);
};

function IntegerField(name, model, data) {
    Field.call(this, name, model, false);

    IntegerField.verfiyData(data);
    this.optional = !!data.optional;
    this.primary = !!data.primary;
    this.maxValue = _.has(data, "maxValue") ? data.maxValue : Infinity;
    this.minValue = _.has(data, "minValue") ? data.minValue : -Infinity;
}

IntegerField.verfiyData = function (data) {
    var hasMaxValue, hasMinValue;

    if (_.has(data, "primary") && !_.isBoolean(data.primary)) {
        throw "optional property \"primary\" not set correctly; boolean value expected";
    }
    if (_.has(data, "optional") && !_.isBoolean(data.optional)) {
        throw "optional property \"optional\" not set correctly; boolean value expected";
    }
    if (data.optional && data.primary) {
        throw "primary fields can never be optional";
    }
    hasMaxValue = _.has(data, "maxValue");
    hasMinValue = _.has(data, "minValue");
    if (hasMaxValue && !_.isInt(data.maxValue)) {
        throw "optional property \"maxValue\" not set correctly; integer value expected";
    }
    if (hasMinValue && !_.isInt(data.minValue)) {
        throw "optional property \"minValue\" not set correctly; integer value expected";
    }
    if (hasMaxValue && hasMinValue && data.minValue >= data.maxValue) {
        throw "optional property \"minValue\" must be smaller than optional property \"maxValue\"";
    }
};

IntegerField.prototype = Object.create(Field.prototype);
IntegerField.prototype.constructor = IntegerField;
IntegerField.prototype.verify = function (value) {
    if ((_.isInt(value) && value <= this.maxValue && value >= this.minValue) || (this.optional && (value === undefined || value === null))) {
        return true;
    }
    return false;
};
IntegerField.prototype.sanitize = function (value) {
    return parseInt(value, 10);
};
IntegerField.prototype.getDefault = function (item) {
    return 0;
};
IntegerField.prototype.init = function (item) {
    this.initFlat(item);
};

function DateField(name, model, data) {
    Field.call(this, name, model, false);

    DateField.verfiyData(data);
    this.optional = !!data.optional;
}

DateField.verfiyData = function (data) {
    if (_.has(data, "optional") && !_.isBoolean(data.optional)) {
        throw "optional property \"optional\" not set correctly; boolean value expected";
    }
};

DateField.prototype = Object.create(Field.prototype);
DateField.prototype.constructor = DateField;
DateField.prototype.verify = function (value) {
    if (_.isDate(value) || (this.optional && (value === undefined || value === null))) {
        return true;
    }
    return false;
};
DateField.prototype.sanitize = function (value) {
    if (value instanceof Date) {
        return value;
    }
    return new Date(value);
};
DateField.prototype.getDefault = function (item) {
    return new Date();
};
DateField.prototype.init = function (item) {
    this.initFlat(item);
};




function fillField(data, field, item) {
    var key = field.name;

    field.init(item);

    if (_.has(data, key)) {
        item[key] = data[key];
    }

}

function Model(name, fieldObj) {
    var that = this;

    this.name = Model.validateName(name);
    this.fields = createAndVerifyFieldSet(fieldObj, this);
    this.items = {};
    this.pkName = _.filter(this.fields, function (field) {
        return field.primary === true;
    })[0].name;

    this.constructor = function (futureData) {
        var item = this, pk;
        Item.call(this, that);

        pk = futureData[that.pkName];
        if (_.has(that.items, pk)) {
            throw "An instance of \"" + that.name + "\" with the primary key \"" + pk + "\" is already in use";
            //item = that.items[pk];
        }

        _.each(that.fields, function (field, key) {
            fillField(futureData, field, item);
        });

        that.items[pk] = item;
        return item;
    };
    this.constructor.prototype = Object.create(Item.prototype);
    this.constructor.prototype.constructor = this.constructor;
}

Model.validateName = function (name) {
    if (!_.isString(name) || name.length === 0) {
        throw "model name must a string with a length > 0";
    }
    return name;
};

Model.StringField = function (data) {
    return new FieldDef(StringField, data);
};

function FieldDef (constr, data) {
    this.constr = constr;
    this.data = data;
}

function createAndVerifyFieldSet(fieldObj, model) {
    var fieldSet = createFieldSet(fieldObj, model);
    verifyFieldSet(fieldSet);
    return fieldSet;
}

function createFieldSet(fieldObj, model) {
    var fields, primaryFields;

    fields = _.map(fieldObj, function (fieldDef, name) {
        return new fieldDef.constr(name, model, fieldDef.data);
    });
    fields.sort(function (a, b) {
        if (a.primary && !b.primary) {
            return -1;
        }
        if (!a.primary && b.primary) {
            return 1;
        }
        return 0;
    });
    primaryFields = _.filter(fields, function (field) {
        return field.primary === true;
    });
    _.each(primaryFields, function (field) {
        fields.push(new PkField(model, field));
    });
    return fields;
}

function verifyFieldSet(fields) {
    var nonFieldCount, primaryCount, areFieldNamesUnique;

    nonFieldCount = _.count(fields, function (field) {
        return !(field instanceof Field);
    });
    primaryCount = _.count(fields, function (field) {
        return field.primary === true;
    });
    areFieldNamesUnique = _.isUnique(fields, function (field) {
        return field.name;
    });

    if (nonFieldCount > 0) {
        throw "Fieldset can only contain Field instances!";
    }

    if (primaryCount === 0) {
        throw "Fieldset must have a primary field!";
    } else if (primaryCount > 1) {
        throw "Fieldset can only have one primary field!";
    }

    if (!areFieldNamesUnique) {
        throw "Fieldset cannot contain field with the same name";
    }
}
window.$M = {
    define: function (name, fields) {
        if (_.has(register, name)) {
            throw "a model with the name \"" + name + "\" is already registered";
        }
        var model = new Model(name, fields);
        register[name] = model;
        return model.constructor;
    },
    OneToManyField: function (data) {
        return {
            constr: OneToManyField,
            data: data
        };
    },
    ManyToManyField: function (data) {
        return {
            constr: ManyToManyField,
            data: data
        };
    },
    OneToOneField: function (data) {
        return {
            constr: OneToOneField,
            data: data
        };
    },
    StringField: function (data) {
        return {
            constr: StringField,
            data: data
        };
    },
    IntegerField: function (data) {
        return {
            constr: IntegerField,
            data: data
        };
    },
    DateField: function (data) {
        return {
            constr: DateField,
            data: data
        };
    }
};
})( window );
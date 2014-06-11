


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


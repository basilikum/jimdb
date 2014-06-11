

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
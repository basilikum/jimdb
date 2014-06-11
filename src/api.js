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
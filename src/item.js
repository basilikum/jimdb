function Item(model) {
    this.$$model = model;
}

Item.prototype.$verify = function (fieldName, value) {

};

Item.prototype.$verifyAll = function () {

};

Item.prototype.$resolve = function (fieldName) {
    var field = this.$$model.fields[fieldName],
        data;

    if (!field || !field.related) {
        console.warn("Model has no resolveable field \"" + fieldName + "\"");
        return null;
    }

    data = field.resolve(this[this.$$model.pkName]);

    if (field instanceof OneToManyField) {
        if (typeof data !== "object") {
            console.error("resolve function returns unsupported type " + (typeof data) + "; object expected");
            return null;
        }
        return new field.model.constructor(data);
    } else {
        if (!_.isArray(data)) {
            console.error("resolve function returns unsupported type " + (typeof data) + "; array expected");
            return null;
        }
        return data.map(function (itemData) {
            return new field.model.constructor(itemData);
        });
    }
};

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

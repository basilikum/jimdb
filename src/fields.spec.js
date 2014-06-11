describe("fields -->", function() {

    describe("Field Base Class:", function() {


    });


    describe("OneToMany Relation:", function() {
        var relatedModel, model, relItem1, relItem2, resolveBackward, resolveForward;

        beforeEach(function () {
            relatedModel = new Model("yz", {
                id: {
                    constr: StringField,
                    data: { primary: true }
                }
            });
            register[relatedModel.name] = relatedModel;
            resolveBackward = function () {};
            resolveForward = function () {};
            model = new Model("xy", {
                id: {
                    constr: StringField,
                    data: { primary: true }
                },
                ref: {
                    constr: OneToManyField,
                    data: { 
                        relatedModel: "yz", 
                        resolveForward: resolveForward, 
                        resolveBackward: resolveBackward
                    }
                }
            });
            relItem1 = new relatedModel.constructor({ id: "1" });
            relItem2 = new relatedModel.constructor({ id: "2" });            
        });

        afterEach(function () {
            register = {};
        });


        it("should add counter field when creating OneToManyField", function () {
            var field = _.find(model.fields, function (field) {
                return field.name === "ref";
            });
            expect(field.relatedField instanceof OneToManyCounterField).toBe(true);
            expect(field.relatedField.name).toBe("xy_set");
            expect(field.relatedField.relatedModel).toBe(model);
            expect(field.relatedField.relatedField).toBe(field);
            expect(field.relatedField.resolve).toBe(resolveBackward);
            expect(_.contains(relatedModel.fields, field.relatedField)).toBe(true);
        });

        it("should be initialized correctly (without value)", function () {
            var item = new model.constructor({ id: "pk"});
            expect(item.ref).toBeNull();
            expect(item.$$ref).toBeNull();
            expect(item.$$ref_rel).toEqual({ pk: null, resolved: false});
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
        });

        it("should be initialized correctly (with value as id)", function () {
            var item = new model.constructor({ id: "pk", ref: "1"});
            expect(item.ref).toBe(relItem1);
            expect(item.$$ref).toBe(relItem1);
            expect(item.$$ref_rel.pk).toBe("1");
            expect(item.$$ref_rel.resolved).toBe(true);
            expect(relItem1.xy_set.$$items.pk).toBe(item);
        });

        it("should be initialized correctly (with value as instance)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            expect(item.ref).toBe(relItem1);
            expect(item.$$ref).toBe(relItem1);
            expect(item.$$ref_rel.pk).toBe("1");
            expect(item.$$ref_rel.resolved).toBe(true);
            expect(relItem1.xy_set.$$items.pk).toBe(item);
        });

        it("should be set correctly after change to different item (item exists)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            item.ref = relItem2;
            expect(item.ref).toBe(relItem2);
            expect(item.$$ref).toBe(relItem2);
            expect(item.$$ref_rel.pk).toBe("2");
            expect(item.$$ref_rel.resolved).toBe(true);
            expect(relItem2.xy_set.$$items.pk).toBe(item);
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
        });

        it("should be set correctly after change to different item (item does not exist)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            item.ref = "something else";
            expect(item.ref).toBe(null);
            expect(item.$$ref).toBe(null);
            expect(item.$$ref_rel.pk).toBe("something else");
            expect(item.$$ref_rel.resolved).toBe(false);
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
        });

        it("should be set correctly after removing item from set", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            relItem1.xy_set.remove(item);
            expect(item.ref).toBe(null);
            expect(item.$$ref).toBe(null);
            expect(item.$$ref_rel.pk).toBe(null);
            expect(item.$$ref_rel.resolved).toBe(true);
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
        });

        it("should be set correctly after adding item to different set", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            relItem2.xy_set.add(item);
            expect(item.ref).toBe(relItem2);
            expect(item.$$ref).toBe(relItem2);
            expect(item.$$ref_rel.pk).toBe("2");
            expect(item.$$ref_rel.resolved).toBe(true);
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
            expect(relItem2.xy_set.$$items.pk).toBe(item);
        });
    });

    describe("ManyToMany Relation:", function() {
        var relatedModel, model, relItem1, relItem2, resolveBackward, resolveForward;

        beforeEach(function () {
            relatedModel = new Model("yz", {
                id: {
                    constr: StringField,
                    data: { primary: true }
                }
            });
            register[relatedModel.name] = relatedModel;
            resolveBackward = function () {};
            resolveForward = function () {};
            model = new Model("xy", {
                id: {
                    constr: StringField,
                    data: { primary: true }
                },
                ref: {
                    constr: ManyToManyField,
                    data: { 
                        relatedModel: "yz", 
                        resolveForward: resolveForward, 
                        resolveBackward: resolveBackward
                    }
                }
            });
            relItem1 = new relatedModel.constructor({ id: "1" });
            relItem2 = new relatedModel.constructor({ id: "2" });            
        });

        afterEach(function () {
            register = {};
        });


        it("should add counter field when creating ManyToManyField", function () {
            var field = _.find(model.fields, function (field) {
                return field.name === "ref";
            });
            console.log(field);
            expect(field.relatedField instanceof ManyToManyCounterField).toBe(true);
            expect(field.relatedField.name).toBe("xy_set");
            expect(field.relatedField.relatedModel).toBe(model);
            expect(field.relatedField.relatedField).toBe(field);
            expect(field.relatedField.resolve).toBe(resolveBackward);
            expect(_.contains(relatedModel.fields, field.relatedField)).toBe(true);
        });

        it("should be initialized correctly (without value)", function () {
            var item = new model.constructor({ id: "pk"});
            expect(item.ref instanceof Set).toBe(true);
            expect(item.$$ref instanceof Set).toBe(true);
            expect(item.ref.$$items["1"]).toBeUndefined();
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
        });

        it("should ignore any value given at initialization", function () {
            var item1 = new model.constructor({ id: "pk", ref: "1"}),
                item2 = new model.constructor({ id: "pk2", ref: relItem1});
            expect(item1.ref instanceof Set).toBe(true);
            expect(item1.$$ref instanceof Set).toBe(true);
            expect(item1.ref.$$items["1"]).toBeUndefined();
            expect(item2.ref instanceof Set).toBe(true);
            expect(item2.$$ref instanceof Set).toBe(true);
            expect(item2.ref.$$items["1"]).toBeUndefined();
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
            expect(relItem1.xy_set.$$items.pk2).toBeUndefined();

        });

        it("should be able to add new item (add to original set)", function () {
            var item = new model.constructor({ id: "pk" });
            item.ref.add(relItem1);
            item.ref.add(relItem2);
            expect(item.ref instanceof Set).toBe(true);
            expect(item.$$ref instanceof Set).toBe(true);
            expect(item.ref.$$items["1"]).toBe(relItem1);
            expect(item.ref.$$items["2"]).toBe(relItem2);
            expect(relItem1.xy_set.$$items.pk).toBe(item);
            expect(relItem2.xy_set.$$items.pk).toBe(item);
        });

        it("should be able to add new item (add to related set)", function () {
            var item = new model.constructor({ id: "pk" });
            relItem1.xy_set.add(item);
            relItem2.xy_set.add(item);
            expect(item.ref instanceof Set).toBe(true);
            expect(item.$$ref instanceof Set).toBe(true);
            expect(item.ref.$$items["1"]).toBe(relItem1);
            expect(item.ref.$$items["2"]).toBe(relItem2);
            expect(relItem1.xy_set.$$items.pk).toBe(item);
            expect(relItem2.xy_set.$$items.pk).toBe(item);
        });

        it("should be able to remove item (remove from original set)", function () {
            var item = new model.constructor({ id: "pk" });
            item.ref.add(relItem1);
            item.ref.add(relItem2);
            item.ref.remove(relItem1);
            expect(item.ref instanceof Set).toBe(true);
            expect(item.$$ref instanceof Set).toBe(true);
            expect(item.ref.$$items["1"]).toBeUndefined();
            expect(item.ref.$$items["2"]).toBe(relItem2);
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
            expect(relItem2.xy_set.$$items.pk).toBe(item);
        });

        it("should be able to remove item (remove from related set)", function () {
            var item = new model.constructor({ id: "pk" });
            item.ref.add(relItem1);
            item.ref.add(relItem2);
            relItem1.xy_set.remove(item);
            expect(item.ref instanceof Set).toBe(true);
            expect(item.$$ref instanceof Set).toBe(true);
            expect(item.ref.$$items["1"]).toBeUndefined();
            expect(item.ref.$$items["2"]).toBe(relItem2);
            expect(relItem1.xy_set.$$items.pk).toBeUndefined();
            expect(relItem2.xy_set.$$items.pk).toBe(item);
        });
    });


    describe("OneToOne Relation:", function() {
        var relatedModel, model, relItem1, relItem2, resolveBackward, resolveForward;

        beforeEach(function () {
            relatedModel = new Model("yz", {
                id: {
                    constr: StringField,
                    data: { primary: true }
                }
            });
            register[relatedModel.name] = relatedModel;
            resolveBackward = function () {};
            resolveForward = function () {};
            model = new Model("xy", {
                id: {
                    constr: StringField,
                    data: { primary: true }
                },
                ref: {
                    constr: OneToOneField,
                    data: { 
                        relatedModel: "yz", 
                        resolveForward: resolveForward, 
                        resolveBackward: resolveBackward
                    }
                }
            });
            relItem1 = new relatedModel.constructor({ id: "1" });
            relItem2 = new relatedModel.constructor({ id: "2" });            
        });

        afterEach(function () {
            register = {};
        });


        it("should add counter field when creating OneToManyField", function () {
            var field = _.find(model.fields, function (field) {
                return field.name === "ref";
            });
            expect(field.relatedField instanceof OneToOneCounterField).toBe(true);
            expect(field.relatedField.name).toBe("xy");
            expect(field.relatedField.relatedModel).toBe(model);
            expect(field.relatedField.relatedField).toBe(field);
            expect(field.relatedField.resolve).toBe(resolveBackward);
            expect(_.contains(relatedModel.fields, field.relatedField)).toBe(true);
        });

        it("should be initialized correctly (without value)", function () {
            var item = new model.constructor({ id: "pk"});
            expect(item.ref).toBeNull();
            expect(item.$$ref).toBeNull();
            expect(item.$$ref_rel).toEqual({ pk: null, resolved: false});
            expect(relItem1.xy).toBeNull();
            expect(relItem1.$$xy).toBeNull();
            expect(relItem1.$$xy_rel).toEqual({ pk: null, resolved: false});
        });

        it("should be initialized correctly (with value as id)", function () {
            var item = new model.constructor({ id: "pk", ref: "1"});
            expect(item.ref).toBe(relItem1);
            expect(item.$$ref).toBe(relItem1);
            expect(item.$$ref_rel.pk).toBe("1");
            expect(item.$$ref_rel.resolved).toBe(true);
            expect(relItem1.xy).toBe(item);
            expect(relItem1.$$xy).toBe(item);
            expect(relItem1.$$xy_rel).toEqual({ pk: "pk", resolved: true});
        });

        it("should be initialized correctly (with value as instance)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            expect(item.ref).toBe(relItem1);
            expect(item.$$ref).toBe(relItem1);
            expect(item.$$ref_rel.pk).toBe("1");
            expect(item.$$ref_rel.resolved).toBe(true);
            expect(relItem1.xy).toBe(item);
            expect(relItem1.$$xy).toBe(item);
            expect(relItem1.$$xy_rel).toEqual({ pk: "pk", resolved: true});
        });

        it("should be set correctly after change to different item (item exists - on original item)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            item.ref = relItem2;
            expect(item.ref).toBe(relItem2);
            expect(item.$$ref).toBe(relItem2);
            expect(item.$$ref_rel.pk).toBe("2");
            expect(item.$$ref_rel.resolved).toBe(true);

            expect(relItem1.xy).toBeNull();
            expect(relItem1.$$xy).toBeNull();
            expect(relItem1.$$xy_rel).toEqual({ pk: null, resolved: true});

            expect(relItem2.xy).toBe(item);
            expect(relItem2.$$xy).toBe(item);
            expect(relItem2.$$xy_rel).toEqual({ pk: "pk", resolved: true});
        });

        it("should be set correctly after change to different item (item exists - on related item)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            relItem2.xy = item;

            expect(item.ref).toBe(relItem2);
            expect(item.$$ref).toBe(relItem2);
            expect(item.$$ref_rel.pk).toBe("2");
            expect(item.$$ref_rel.resolved).toBe(true);

            expect(relItem1.xy).toBeNull();
            expect(relItem1.$$xy).toBeNull();
            expect(relItem1.$$xy_rel).toEqual({ pk: null, resolved: true});

            expect(relItem2.xy).toBe(item);
            expect(relItem2.$$xy).toBe(item);
            expect(relItem2.$$xy_rel).toEqual({ pk: "pk", resolved: true});
        });

        it("should be set correctly after change to different item (item does not exist - on original item)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            item.ref = "something else";
            expect(item.ref).toBe(null);
            expect(item.$$ref).toBe(null);
            expect(item.$$ref_rel.pk).toBe("something else");
            expect(item.$$ref_rel.resolved).toBe(false);

            expect(relItem1.xy).toBeNull();
            expect(relItem1.$$xy).toBeNull();
            expect(relItem1.$$xy_rel).toEqual({ pk: null, resolved: true});
        });

        it("should be set correctly after change to different item (item does not exist - on related item)", function () {
            var item = new model.constructor({ id: "pk", ref: relItem1});
            relItem1.xy = "something else";

            expect(item.ref).toBeNull();
            expect(item.$$ref).toBeNull();
            expect(item.$$ref_rel.pk).toBeNull();
            expect(item.$$ref_rel.resolved).toBe(true);

            expect(relItem1.xy).toBeNull();
            expect(relItem1.$$xy).toBeNull();
            expect(relItem1.$$xy_rel).toEqual({ pk: "something else", resolved: false});
        });

    });
});
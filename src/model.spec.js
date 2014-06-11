describe("Model", function() {

    describe("createFieldSet", function() {
        var fieldConstr = function (name, model, options) {
            var that = this;
            _.each(options, function (value, key) {
                that[key] = value;
            });
            that.model = model;
            that.name = name;
            that.__proto__ = Field.prototype;
            return that;
        };

        var fieldObj = {
            field1: {
                constr: fieldConstr,
                data: { primary: false }
            },
            field2: {
                constr: fieldConstr,
                data: { primary: true }
            },
            field3: {
                constr: fieldConstr,
                data: { primary: false }
            },
            field4: {
                constr: fieldConstr,
                data: { primary: true }
            }
        };

        var model = {};
        model.__proto__ = Model.prototype;

        it("should return list of fields", function () {
            var fields = createFieldSet(fieldObj, model);
            _.each(fields, function (field) {
                expect(field instanceof Field).toBe(true);
            });
        });

        it("should put primary fields at beginning", function () {
            var fields, primaryCount, i, max_i;

            fields = createFieldSet(fieldObj, model);
            primaryCount = _.count(fields, function (field) {
                return field.primary;
            });
            for (i = 0; i < primaryCount; i++) {
                expect(fields[i].primary).toBe(true);
            }
        });

        it("should add pkFields", function () {
            var fields, primaryCount, i, max_i;

            fields = createFieldSet(fieldObj, model);
            primaryCount = _.count(fields, function (field) {
                return field.primary;
            });
            for (i = 0; i < primaryCount; i++) {
                expect(fields[fields.length - primaryCount + i] instanceof PkField).toBe(true);
                expect(fields[fields.length - primaryCount + i].relatedField).toBe(fields[i]);
            }
        });    
    });

    describe("verifyFieldSet", function() {

        var TestField = function (name, primary) {
            var field = {
                name: name,
                primary: !!primary
            };
            field.__proto__ = Field.prototype;
            return field;
        };

        it("should raise no exception if everything is fine", function () {
            function verify() {
                verifyFieldSet([
                    new TestField("field1", true),
                    new TestField("field2")
                ]);
            }
            expect(verify).not.toThrow();
        });

        it("should raise exception if non field is present", function () {
            function verify() {
                verifyFieldSet([
                    new TestField("field1", true),
                    "something"
                ]);
            }
            expect(verify).toThrow();
        });

        it("should raise exception if no primary key field is present", function () {
            function verify() {
                verifyFieldSet([
                    new TestField("field1"),
                    new TestField("field2")
                ]);
            }
            expect(verify).toThrow();
        });

        it("should raise exception if multiple primary key fields are present", function () {
            function verify() {
                verifyFieldSet([
                    new TestField("field1", true),
                    new TestField("field2", true)
                ]);
            }
            expect(verify).toThrow();
        });

        it("should raise exception if two fields have the same name", function () {
            function verify() {
                verifyFieldSet([
                    new TestField("field1", true),
                    new TestField("field1")
                ]);
            }
            expect(verify).toThrow();
        });

    });

    describe("Model constructor", function() {

        var fieldObj = {
            field1: {
                constr: StringField,
                data: { }
            },
            field2: {
                constr: StringField,
                data: { primary: true }
            },
            field3: {
                constr: StringField,
                data: { }
            },
            field4: {
                constr: StringField,
                data: { }
            }
        };

        it("should throw exception if name is not string or of length 0", function () {
            function createModel1() {
                var model = new Model("", fieldObj);
            }
            function createModel2() {
                var model = new Model(23, fieldObj);
            }
            function createModel3() {
                var model = new Model({}, fieldObj);
            }
            expect(createModel1).toThrow();
            expect(createModel2).toThrow();
            expect(createModel3).toThrow();
        });

        it("should return model with correct pkName", function () {
            var model = new Model("xy", fieldObj);
            expect(model.pkName).toBe("field2");
        }); 
    });

    describe("Model public constructor", function() {

        var fieldObj = {
            field1: {
                constr: StringField,
                data: { }
            },
            field2: {
                constr: StringField,
                data: { primary: true }
            },
            field3: {
                constr: StringField,
                data: { }
            },
            field4: {
                constr: StringField,
                data: { }
            }
        };
        var model = new Model("xy", fieldObj);

        beforeEach(function() {
            model.items = {};
        });

        it("should add new item to repository", function () {
            var item = new model.constructor({field1: "a", field2: "b", field3: "c", field4: "d" });
            expect(model.items["b"]).toBe(item);
        });

        it("should throw exception when trying to add a item with already present pk", function () {
            var item1 = new model.constructor({field1: "a", field2: "b", field3: "c", field4: "d" });

            function addSecondItem() {
                var item2 = new model.constructor({field1: "a", field2: "b", field3: "c", field4: "d" });
            }
                
            expect(addSecondItem).toThrow();
        });

        it("should return item with initialized fields", function () {
            var item1 = new model.constructor({field1: "a", field2: "b", field3: "c", field4: "d" });

            expect(item1.field1).toBe("a");
            expect(item1.field2).toBe("b");
            expect(item1.field3).toBe("c");
            expect(item1.field4).toBe("d");
            expect(item1.pk).toBe("b");
        });
    });
});
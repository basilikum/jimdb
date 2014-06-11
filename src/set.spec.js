describe("Set", function() {

    describe("add", function() {

        var model, set;

        beforeEach(function() {
            model = {
                constructor: function (id) {
                    this.id = id;
                },
                pkName: "id",
                items: []
            };
            set = new Set(model);
        });

        it("should add item to list", function () {
            var item = new model.constructor(1);

            set.add(item);
            expect(set.$$items[1]).toBe(item);
        });
        it("should add pk to list with value = null", function () {
            var item = new model.constructor(1);

            set.add(1);
            set.add("id");
            set.add({});
            set.add(NaN);
            set.add(true);
            set.add(null);
            set.add(undefined);
            expect(set.$$items[1]).toBe(null);
            expect(set.$$items["id"]).toBe(null);
            expect(set.$$items["[object Object]"]).toBe(null);
            expect(set.$$items["NaN"]).toBe(null);
            expect(set.$$items["true"]).toBe(null);
            expect(set.$$items["null"]).toBe(null);
            expect(set.$$items["undefined"]).toBe(null);
        });
        it("should invoke add and beforeAdd handler", function () {
            var item = new model.constructor(1),
                counter = 0;

            set.on("add", function (pk, i, s) {
                expect(pk).toBe(1);
                expect(i).toBe(item);
                expect(s).toBe(set);
                counter += 1;
            });
            set.on("beforeAdd", function (pk, i, s) {
                expect(pk).toBe(1);
                expect(i).toBe(item);
                expect(s).toBe(set);
                counter += 1;
            });
            set.add(item);
            expect(counter).toBe(2);
        });
        it("should not add item if already in list", function () {
            var item = new model.constructor(1),
                counter = 0;

            set.on("add", function (pk, i, s) {
                counter += 1;
            });

            set.add(item);
            set.add(item);
            expect(counter).toBe(1);
            set.add(2);
            set.add(2);
            expect(counter).toBe(2);
        });
    });



    describe("remove", function() {

        var model, set, item1, item2;

        beforeEach(function() {
            model = {
                constructor: function (id) {
                    this.id = id;
                },
                pkName: "id",
                items: []
            };
            set = new Set(model);
            item1 = new model.constructor(1);
            item2 = new model.constructor(2);
            set.add(item1);
            set.add(item2);
        });

        it("should remove item from list", function () {
            set.remove(item1);
            expect(set.$$items[2]).toBe(item2);
            expect(set.$$items[1]).toBe(undefined);
        });
        it("should remove pk from list", function () {
            set.remove(1);
            expect(set.$$items[2]).toBe(item2);
            expect(set.$$items[1]).toBe(undefined);
        });
        it("should invoke remove and beforeRemove handler", function () {
            var counter = 0;

            set.on("remove", function (pk, i, s) {
                expect(pk).toBe(1);
                expect(i).toBe(item1);
                expect(s).toBe(set);
                counter += 1;
            });
            set.on("beforeRemove", function (pk, i, s) {
                expect(pk).toBe(1);
                expect(i).toBe(item1);
                expect(s).toBe(set);
                counter += 1;
            });
            set.remove(item1);
            expect(counter).toBe(2);
        });
        it("should not remove item if not in list", function () {
            var item = new model.constructor(1),
                counter = 0;

            set.on("remove", function (pk, i, s) {
                counter += 1;
            });

            set.remove(item1);
            set.remove(item1);
            expect(counter).toBe(1);
            set.remove(2);
            set.remove(2);
            expect(counter).toBe(2);
        });
    });
});
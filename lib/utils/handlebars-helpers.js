var Handlebars = require('handlebars');
Handlebars.registerHelper({
    eq: function (v1, v2) {
        return v1 === v2;
    },
    ne: function (v1, v2) {
        return v1 !== v2;
    },
    lt: function (v1, v2) {
        return v1 < v2;
    },
    gt: function (v1, v2) {
        return v1 > v2;
    },
    lte: function (v1, v2) {
        return v1 <= v2;
    },
    gte: function (v1, v2) {
        return v1 >= v2;
    },
    and: function (v1, v2) {
        return Array.prototype.slice.call(arguments, 0, arguments.length - 1).every(Boolean);
    },
    or: function (v1, v2) {
        return Array.prototype.slice.call(arguments, 0, arguments.length - 1).some(Boolean);
    }
});
//# sourceMappingURL=handlebars-helpers.js.map
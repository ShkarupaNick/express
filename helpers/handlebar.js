module.export = class HandlebarsHelpers {
    constructor(Handlebars) {
        this.Handlebars = Handlebars;
    }

    registerHelpers() {
        this.Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        })
    }
};


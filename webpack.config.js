"use strict";

const entries = {
    scripts: {},
    styles: {},
    copy: {},
};

/* Export */
module.exports = (env = {}) => {
    if (env.PRODUCTION) {
        return require("./webpack/webpack.prod")(env, entries);
    } else {
        return require("./webpack/webpack.dev")(env, entries);
    }
};

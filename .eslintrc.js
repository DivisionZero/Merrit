module.exports = {
    "extends": "airbnb",
    "plugins": [
        "chai-friendly"
    ],
    "env": {
        "node": true,
        "browser": false,
        "es6": true,
        "mocha": true
    },
    rules: {
        // indent 4 spaces
        "indent": [2, 4],

        // functions are usually ok with hoisting 
        "no-use-before-define": [2, {"functions": false}],

        // I like using let for object property assignment sometimes
        "prefer-const": 1,

        // keep empty lines to a minimum
        "no-multiple-empty-lines": [2, {"max": 1, "maxEOF": 0, "maxBOF": 0}],

        // disable modifying params, but not properties of params
        "no-param-reassign": [2, {"props": false}],

        // work with chai
        "no-unused-expressions": 0,
        "chai-friendly/no-unused-expressions": 2
    }
}

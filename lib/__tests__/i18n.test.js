"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var withCorrectData = (function () {
    var testLang = "en";
    var testDefaultNs = "namespace";
    var localeData = {
        namespace: {
            someKey: "This is some value",
            keyWithSingleStringInterpolation: "This is a value with variable {{variable1}}.",
            keyWithMultipleStringInterpolation: "This is a value with variables {{variable1}}, {{variable2}} and {{variable3}}.",
            variable1: "4",
            variable2: "5",
            variable3: "6"
        },
        anotherNamespace: {
            someKey: "This is some key",
            keyWithSingleStringInterpolation: "This is a value with variable {{variable1}}.",
            keyWithMultipleStringInterpolation: "This is a value with variables {{variable1}}, {{variable2}} and {{variable3}}.",
            variable1: "4",
            variable2: "5",
            variable3: "6"
        }
    };
    index_1.use(testLang, testDefaultNs, localeData);
    test("lang returns correct language set in use()", function () {
        expect(index_1.lang).toBe(testLang);
    });
    test("defaultNS returns set default namespace", function () {
        expect(index_1.defaultNS).toBe(testDefaultNs);
    });
    // resources
    test("resources should return same object as passed", function () {
        expect(index_1.resources).toBe(localeData);
    });
    test("resources strings should be available with dot notation", function () {
        expect(index_1.resources.namespace.someKey).toBe(localeData.namespace.someKey);
    });
    // t()
    test("t() returns a simple key from the default namespace with a single attribute", function () {
        expect(index_1.t("someKey")).toBe(localeData.namespace.someKey);
    });
    test("t() returns a non-string variable", function () {
        expect(index_1.t("variable1")).toBe(localeData.namespace.variable1);
    });
    test("t() returns a key from a non-default namespace with a single attribute", function () {
        expect(index_1.t("anotherNamespace:someKey")).toBe(localeData.anotherNamespace.someKey);
    });
    test("t() returns an interpolated string with a single substitution variable", function () {
        expect(index_1.t("keyWithSingleStringInterpolation", {
            variable1: "1"
        })).toBe("This is a value with variable 1.");
    });
    test("t() returns an interpolated string with a single substitution variable with t() inside attribute object", function () {
        expect(index_1.t("keyWithSingleStringInterpolation", {
            variable1: index_1.t("variable1")
        })).toBe("This is a value with variable 4.");
    });
    test("t() returns an interpolated string with multiple defined variables", function () {
        expect(index_1.t("keyWithMultipleStringInterpolation", {
            variable1: "1",
            variable2: "2",
            variable3: "3"
        })).toBe("This is a value with variables 1, 2 and 3.");
    });
    test("t() returns an interpolated string with multiple t() as attribute", function () {
        expect(index_1.t("keyWithMultipleStringInterpolation", {
            variable1: index_1.t("variable1"),
            variable2: index_1.t("variable2"),
            variable3: index_1.t("variable3")
        })).toBe("This is a value with variables 4, 5 and 6.");
    });
    test("t() returns an interpolated string with mixed substitution variables", function () {
        expect(index_1.t("keyWithMultipleStringInterpolation", {
            variable1: "1",
            variable2: index_1.t("variable2"),
            variable3: "3"
        })).toBe("This is a value with variables 1, 5 and 3.");
    });
    // t() errors
    test("t() throws error on empty string", function () {
        expect(function () { return index_1.t(""); }).toThrow("Key string is empty.");
    });
    test("t() throws error on incorrect string", function () {
        expect(function () { return index_1.t("wrongKeyWithSingleStringInterpolation"); }).toThrow("No string found! namespace.wrongKeyWithSingleStringInterpolation");
    });
    test("t() throws an error when variable count is different between passed attributes for t() and target value", function () {
        expect(function () { return index_1.t("keyWithMultipleStringInterpolation"); }).toThrow("Mismatch between string variables(3) and passed substitutions(0) for namespace.keyWithMultipleStringInterpolation");
    });
    test("t() throws an error when substitution variable key name is wrong", function () {
        expect(function () {
            return index_1.t("keyWithMultipleStringInterpolation", {
                variable1WithWrongName: index_1.t("variable1"),
                variable2: index_1.t("variable2"),
                variable3: index_1.t("variable3")
            });
        }).toThrow("Missing substitution variable from {{keyWithMultipleStringInterpolation}} in namespace.keyWithMultipleStringInterpolation");
    });
})();
// const withWrongData = (function () {
//   const testLang = "en"
//   const testDefaultNs = "namespace"
//   const localeData = {
//     namespace: {
//       someKey: "This is some value",
//       keyWithStringInterpolation:
//         "This is a value with a variable of {{variable}}",
//       variable: "3"
//     },
//     anotherNamespace: {
//       someKey: "This is some key",
//       keyWithStringInterpolation:
//         "This is a value with a variable of {{variable}}"
//     }
//   }
//   const { t, use } = i18n
//   use(testLang, testDefaultNs, localeData, false)
//   // Needs to be desctructured after use()
//   const { lang, defaultNS, resources } = i18n
//   test(`lang returns correct language set in use()`, () => {
//     expect(lang).toBe(testLang)
//   })
//   test(`defaultNS returns set defaut namespace`, () => {
//     expect(defaultNS).toBe("namespace")
//   })
//   // resources
//   test(`resources should return same object as passed`, () => {
//     expect(resources).toBe(localeData)
//   })
//   test(`resources strings should be available with dot notation`, () => {
//     expect(resources.namespace.someKey).toBe(localeData.namespace.someKey)
//   })
//   // t()
//   test(`t() returns a simple key from the default namespace with a single attribute`, () => {
//     expect(t("someKey")).toBe(localeData.namespace.someKey)
//   })
//   test(`t() returns a non-string variable`, () => {
//     expect(t("variable")).toBe(localeData.namespace.variable)
//   })
//   test(`t() returns a key from a non-default namespace with a single attribute`, () => {
//     expect(t("anotherNamespace:someKey")).toBe(
//       localeData.anotherNamespace.someKey
//     )
//   })
//   test(`t() returns an interpolated string with a defined variable`, () => {
//     expect(t("keyWithStringInterpolation", { variable: 1 })).toBe(
//       "This is a value with a variable of 1"
//     )
//   })
//   test(`t() returns an interpolated string with t() as variable`, () => {
//     expect(t("keyWithStringInterpolation", { variable: t("variable") })).toBe(
//       "This is a value with a variable of 3"
//     )
//   })
//   // t() errors
//   test(`t() throws error on empty string`, () => {
//     expect(() => t("")).toThrow("Key string is empty.")
//   })
//   test(`t() throws error on wrong type`, () => {
//     expect(() => t()).toThrow("Expected a string for key. Got undefined.")
//   })
//   test(`t() throws an error with missing string subsitution variable`, () => {
//     expect(() => t("keyWithStringInterpolation")).toThrow(
//       "Mismatch between string variables(1) and passed substitutions(0) for namespace.keyWithStringInterpolation"
//     )
//   })
// })()

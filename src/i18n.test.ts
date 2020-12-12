const { i18n } = require("./i18n")

const withCorrectData = (function () {
  const testLang = "en"
  const testDefaultNs = "namespace"
  const localeData = {
    namespace: {
      someKey: "This is some value",
      keyWithSingleStringInterpolation:
        "This is a value with variable {{variable1}}.",
      keyWithMultipleStringInterpolation:
        "This is a value with variables {{variable1}}, {{variable2}} and {{variable3}}.",
      variable1: "4",
      variable2: "5",
      variable3: "6"
    },
    anotherNamespace: {
      someKey: "This is some key",
      keyWithSingleStringInterpolation:
        "This is a value with variable {{variable1}}.",
      keyWithMultipleStringInterpolation:
        "This is a value with variables {{variable1}}, {{variable2}} and {{variable3}}.",
      variable1: "4",
      variable2: "5",
      variable3: "6"
    }
  }

  const { t, use } = i18n

  use(testLang, testDefaultNs, localeData, false)

  // Needs to be desctructured after use()
  const { lang, defaultNS, resources } = i18n

  test(`lang returns correct language set in use()`, () => {
    expect(lang).toBe(testLang)
  })

  test(`defaultNS returns set defaut namespace`, () => {
    expect(defaultNS).toBe("namespace")
  })

  // resources

  test(`resources should return same object as passed`, () => {
    expect(resources).toBe(localeData)
  })

  test(`resources strings should be available with dot notation`, () => {
    expect(resources.namespace.someKey).toBe(localeData.namespace.someKey)
  })

  // t()

  test(`t() returns a simple key from the default namespace with a single attribute`, () => {
    expect(t("someKey")).toBe(localeData.namespace.someKey)
  })

  test(`t() returns a non-string variable`, () => {
    expect(t("variable1")).toBe(localeData.namespace.variable1)
  })

  test(`t() returns a key from a non-default namespace with a single attribute`, () => {
    expect(t("anotherNamespace:someKey")).toBe(
      localeData.anotherNamespace.someKey
    )
  })

  test(`t() returns an interpolated string with a single substitution variable`, () => {
    expect(
      t("keyWithSingleStringInterpolation", {
        variable1: "1"
      })
    ).toBe("This is a value with variable 1.")
  })

  test(`t() returns an interpolated string with a single substitution variable with t() inside attribute object`, () => {
    expect(
      t("keyWithSingleStringInterpolation", {
        variable1: t("variable1")
      })
    ).toBe("This is a value with variable 4.")
  })

  test(`t() returns an interpolated string with multiple defined variables`, () => {
    expect(
      t("keyWithMultipleStringInterpolation", {
        variable1: "1",
        variable2: "2",
        variable3: "3"
      })
    ).toBe("This is a value with variables 1, 2 and 3.")
  })

  test(`t() returns an interpolated string with multiple t() as attribute`, () => {
    expect(
      t("keyWithMultipleStringInterpolation", {
        variable1: t("variable1"),
        variable2: t("variable2"),
        variable3: t("variable3")
      })
    ).toBe("This is a value with variables 4, 5 and 6.")
  })

  test(`t() returns an interpolated string with mixed substitution variables`, () => {
    expect(
      t("keyWithMultipleStringInterpolation", {
        variable1: "1",
        variable2: t("variable2"),
        variable3: "3"
      })
    ).toBe("This is a value with variables 1, 5 and 3.")
  })

  // t() errors

  test(`t() throws error on empty string`, () => {
    expect(() => t("")).toThrow("Key string is empty.")
  })

  test(`t() throws error on wrong type`, () => {
    expect(() => t()).toThrow("Expected a string for key. Got undefined.")
  })

  test(`t() throws an error when variable count is different between passed attributes for t() and target value`, () => {
    expect(() => t("keyWithMultipleStringInterpolation")).toThrow(
      "Mismatch between string variables(3) and passed substitutions(0) for namespace.keyWithMultipleStringInterpolation"
    )
  })

  test(`t() throws an error when substitution variable key name is wrong`, () => {
    expect(() =>
      t("keyWithMultipleStringInterpolation", {
        variable1WithWrongName: t("variable1"),
        variable2: t("variable2"),
        variable3: t("variable3")
      })
    ).toThrow(
      "Missing substitution variable from {{keyWithMultipleStringInterpolation}} in namespace.keyWithMultipleStringInterpolation"
    )
  })
})()

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

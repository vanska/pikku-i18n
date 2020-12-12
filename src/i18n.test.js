const i18n = require("./i18n")

const localeData = {
  namespace: {
    someKey: "This is some value",
    keyWithStringInterpolation:
      "This is a value with a variable of {{variable}}",
    variable: 3
  },
  anotherNamespace: {
    someKey: "This is some key",
    keyWithStringInterpolation:
      "This is a value with a variable of {{variable}}"
  }
}

i18n.use("en", "namespace", localeData)

test(`Return ${localeData.namespace.someKey}`, () => {
  expect(i18n.t("someKey")).toBe(localeData.namespace.someKey)
})

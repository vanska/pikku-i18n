import React from "react"

import { init, t, defaultNS, lang, resources, Trans } from "../index"
import localeData from "./locales/en.json"

import { render } from "@testing-library/react"
import { screen } from "@testing-library/dom"

const KEY_STRONG = "key_strong"
const KEY_SPAN = "key_span"
const KEY_B = "key_b"

const withCorrectData = (function () {
  const testLang = "en"
  const testDefaultNs = "namespace"

  init(testLang, testDefaultNs, localeData)

  describe("{ init } with correct locale data", () => {
    describe("{ lang, defaultNs, resources }", () => {
      test(`lang returns correct language set in init()`, () => {
        expect(lang).toBe(testLang)
      })

      test(`defaultNS returns set default namespace`, () => {
        expect(defaultNS).toBe(testDefaultNs)
      })

      test(`resources should return same object as passed`, () => {
        expect(resources).toBe(localeData)
      })

      test(`resources strings should be available with dot notation`, () => {
        expect(resources.namespace.someKey).toBe(localeData.namespace.someKey)
      })

      test(`resources strings should resturn deeply nested values`, () => {
        expect(resources.namespace.nestedKey.insideNestedKey).toBe(
          localeData.namespace.nestedKey.insideNestedKey
        )
      })
    })

    describe("{ t }", () => {
      test(`t() returns a simple key from the default namespace with a single attribute`, () => {
        expect(t("someKey")).toBe(localeData.namespace.someKey)
      })

      test(`t() returns a simple nested key from the default namespace`, () => {
        expect(t("nestedKey.insideNestedKey")).toBe(
          localeData.namespace.nestedKey.insideNestedKey
        )
      })

      test(`t() returns a non-string variable`, () => {
        expect(t("variable1")).toBe(localeData.namespace.variable1)
      })

      test(`t() returns a key from a non-default namespace with a single attribute`, () => {
        expect(t("someKey", null, "anotherNamespace")).toBe(
          localeData.anotherNamespace.someKey
        )
      })

      test(`t() returns a nested key from a non-default namespace`, () => {
        expect(t("nestedKey.insideNestedKey", null, "anotherNamespace")).toBe(
          localeData.anotherNamespace.nestedKey.insideNestedKey
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

      test(`t() throws error on empty string`, () => {
        expect(() => t("")).toThrow("Key string is empty.")
      })

      test(`t() throws error on incorrect string`, () => {
        expect(() => t("wrongKeyWithSingleStringInterpolation")).toThrow(
          "No string found! namespace.wrongKeyWithSingleStringInterpolation"
        )
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
    })

    describe("<Trans />", () => {
      test("should return the correct locale value", () => {
        render(
          <Trans
            i18nKey="keyWithSingleStringInterpolation"
            variable1={<strong key={KEY_STRONG}>123</strong>}
          />
        )
        screen.getByText("This is a value with variable", { exact: false })
      })
      test("should return the correct locale value from another namespace", () => {
        render(
          <Trans
            i18nKey="keyWithSingleStringInterpolation"
            ns="anotherNamespace"
            variable1={<strong key={KEY_STRONG}>123</strong>}
          />
        )
        screen.getByText(
          "This is a value from anotherNamespace with variable",
          {
            exact: false
          }
        )
      })
      test("should inject a <strong> tag inside the paragraph", async () => {
        render(
          <Trans
            i18nKey="keyWithSingleStringInterpolation"
            variable1={<strong key={KEY_STRONG}>123</strong>}
          />
        )
        screen.getByText("123", { selector: "strong" })
      })
      test("should inject a <span> tag inside the paragraph with t()", async () => {
        render(
          <Trans
            i18nKey="keyWithSingleStringInterpolation"
            variable1={<span key={KEY_SPAN}>{t("variable1")}</span>}
          />
        )
        screen.getByText("4", { selector: "span" })
      })
      test("should inject <span>,<strong> and <b> tags inside the paragraph", async () => {
        render(
          <Trans
            i18nKey="keyWithMultipleStringInterpolation"
            variable1={<span key={KEY_SPAN}>1</span>}
            variable2={<strong key={KEY_STRONG}>2</strong>}
            variable3={<b key={KEY_B}>3</b>}
          />
        )
        screen.getByText("1", { selector: "span" })
        screen.getByText("2", { selector: "strong" })
        screen.getByText("3", { selector: "b" })
      })
      test("should throw an error with the wrong key", async () => {
        const originalError = console.error
        console.error = jest.fn() // Avoid throwing error in the console

        expect(() => {
          render(
            <Trans
              i18nKey="wrongKeyWithSingleStringInterpolation"
              variable1={<strong key={KEY_STRONG}>666</strong>}
            />
          )
        }).toThrow(
          "No string found! namespace.wrongKeyWithSingleStringInterpolation"
        )

        console.error = originalError
      })
    })
  })
})()

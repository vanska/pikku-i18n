import React from "react"

import { init, t, defaultNS, lang, resources, Trans } from "../index"
import localeData from "./locales/en.json"

import { render } from "@testing-library/react"
import { screen } from "@testing-library/dom"

const KEY_STRONG = "key_strong",
  KEY_SPAN = "key_span",
  KEY_HELSINKI = "Helsinki",
  KEY_NEW_YORK = "New York",
  KEY_NEW_DELHI = "New Delhi",
  KEY_CARS_COUNT = "carsCountKey",
  KEY_SERVICE_TYPE = "serviceTypeKey"

const withCorrectData = (function () {
  const testLang = "en"
  const testDefaultNs = "home"

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
        expect(resources[testDefaultNs].title).toBe(
          localeData[testDefaultNs].title
        )
      })

      test(`resources strings should resturn deeply nested values`, () => {
        expect(resources[testDefaultNs].testimonials.customers.john.quote).toBe(
          localeData[testDefaultNs].testimonials.customers.john.quote
        )
      })
    })

    describe("{ t }", () => {
      test(`t() returns a simple key from the default namespace with a single attribute`, () => {
        expect(t("title")).toBe(localeData[testDefaultNs].title)
      })

      test(`t() returns a simple nested key from the default namespace`, () => {
        expect(t("testimonials.customers.john.quote")).toBe(
          localeData[testDefaultNs].testimonials.customers.john.quote
        )
      })

      test(`t() returns a key from a non-default namespace with a single attribute`, () => {
        expect(t("title", null, "modal")).toBe(localeData.modal.title)
      })

      test(`t() returns a nested key from a non-default namespace`, () => {
        expect(t("services.rental.title", null, "modal")).toBe(
          localeData.modal.services.rental.title
        )
      })

      test(`t() returns an interpolated string with a single substitution variable`, () => {
        expect(
          t("status", {
            currentStatus: "open"
          })
        ).toBe("We are currently open")
      })

      test(`t() returns an interpolated string with a single substitution variable from with nested key`, () => {
        expect(
          t("testimonials.description", {
            customerCount: "5"
          })
        ).toBe("This is what our 5 customers are saying")
      })

      test(`t() returns an interpolated string with a single substitution variable from with nested key with number value`, () => {
        expect(
          t("testimonials.description", {
            customerCount: 5
          })
        ).toBe("This is what our 5 customers are saying")
      })

      test(`t() returns an interpolated string with a single substitution variable with t() inside attribute object`, () => {
        expect(
          t("status", {
            currentStatus: t("open")
          })
        ).toBe("We are currently open")
      })

      test(`t() returns an interpolated string with multiple defined variables`, () => {
        expect(
          t("locations", {
            locationsCount: "20",
            citiesCount: "3",
            helsinki: "Helsinki",
            newYork: "New York",
            new_delhi: "New Delhi"
          })
        ).toBe(
          "We have 20 locations in 3 cities: Helsinki, New York and New Delhi."
        )
      })

      test(`t() returns an interpolated string with mixed substitution variables`, () => {
        expect(
          t("locations", {
            locationsCount: "20",
            citiesCount: "3",
            helsinki: t("helsinki", null, "locations"),
            newYork: t("newYork", null, "locations"),
            new_delhi: t("new_delhi", null, "locations")
          })
        ).toBe(
          "We have 20 locations in 3 cities: Helsinki, New York and New Delhi."
        )
      })

      test(`t() throws error on empty string`, () => {
        expect(() => t("")).toThrow("Key string is empty.")
      })

      test(`t() throws error on incorrect string`, () => {
        expect(() => t("_title")).toThrow("No string found! home._title")
      })

      test(`t() throws an error when variable count is different between passed attributes for t() and target value`, () => {
        expect(() => t("locations")).toThrow(
          "Mismatch between string variables(5) and passed substitutions(0) for home.locations"
        )
      })

      test(`t() throws an error when substitution variable key name is wrong`, () => {
        expect(() =>
          t("locations", {
            locationsCount: "20",
            citiesCount: "3",
            _helsinki: t("helsinki", null, "locations"),
            newYork: t("newYork", null, "locations"),
            new_delhi: t("new_delhi", null, "locations")
          })
        ).toThrow(
          "Missing substitution variable {{helsinki}} in home.locations"
        )
      })
    })

    describe("<Trans />", () => {
      test("should inject a <strong> tag inside the paragraph with t()", async () => {
        render(
          <Trans
            i18nKey="status"
            currentStatus={<strong key={KEY_SPAN}>{t("open")}</strong>}
          />
        )
        screen.getByText("We are currently", {
          exact: false
        })
        screen.getByText("open", { selector: "strong" })
      })

      test("should inject <span>,<strong> and <b> tags inside the paragraph", async () => {
        render(
          <Trans
            i18nKey="locations"
            locationsCount={<span key={KEY_SPAN}>20</span>}
            citiesCount={<strong key={KEY_STRONG}>3</strong>}
            helsinki={<b key={KEY_HELSINKI}>Helsinki</b>}
            newYork={<b key={KEY_NEW_YORK}>New York</b>}
            new_delhi={<b key={KEY_NEW_DELHI}>New Delhi</b>}
          />
        )
        screen.getByText("We have ", {
          exact: false
        })
        screen.getByText("20", { selector: "span" })
        screen.getByText(" locations in ", {
          exact: false
        })
        screen.getByText("3", { selector: "strong" })
        screen.getByText(" cities: ", {
          exact: false
        })
        screen.getByText(localeData.locations.helsinki, { selector: "b" })
        screen.getByText(localeData.locations.newYork, { selector: "b" })
        screen.getByText(localeData.locations.new_delhi, { selector: "b" })
      })

      test("should inject <span>,<strong> and <b> tags inside the paragraph with resources", async () => {
        render(
          <Trans
            i18nKey="locations"
            locationsCount={<span key={KEY_SPAN}>20</span>}
            citiesCount={<strong key={KEY_STRONG}>3</strong>}
            helsinki={<b key={KEY_HELSINKI}>{resources.locations.helsinki}</b>}
            newYork={<b key={KEY_NEW_YORK}>{resources.locations.newYork}</b>}
            new_delhi={
              <b key={KEY_NEW_DELHI}>{resources.locations.new_delhi}</b>
            }
          />
        )
        screen.getByText("We have ", {
          exact: false
        })
        screen.getByText("20", { selector: "span" })
        screen.getByText(" locations in ", {
          exact: false
        })
        screen.getByText("3", { selector: "strong" })
        screen.getByText(" cities: ", {
          exact: false
        })
        screen.getByText(localeData.locations.helsinki, { selector: "b" })
        screen.getByText(localeData.locations.newYork, { selector: "b" })
        screen.getByText(localeData.locations.new_delhi, { selector: "b" })
      })

      test("should inject <strong> tags inside the paragraph with mixed variables from non-default namespace", async () => {
        render(
          <Trans
            i18nKey="cars"
            ns="modal"
            carsCount={<strong key={KEY_CARS_COUNT}>3</strong>}
            serviceType={
              <strong key={KEY_SERVICE_TYPE}>
                {resources.modal.services.rental.title}
              </strong>
            }
          />
        )
        screen.getByText("3", { selector: "strong" })
        screen.getByText("rental", { selector: "strong" })
      })

      test("should throw an error with the wrong key", async () => {
        const originalError = console.error
        console.error = jest.fn() // Avoid throwing error in the console

        expect(() => {
          render(
            <Trans
              i18nKey="_title"
              variable1={<strong key={KEY_STRONG}>666</strong>}
            />
          )
        }).toThrow("No string found! home._title")

        console.error = originalError
      })
    })
  })
})()

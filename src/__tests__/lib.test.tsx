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

  const r = resources[defaultNS]

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

      test(`assigned namespace for resources return a simple string`, () => {
        expect(r.title).toBe(localeData[testDefaultNs].title)
      })
    })

    describe("{ t }", () => {
      test(`t() returns a string from non-default namespace`, () => {
        expect(t("modal:title")).toBe("How may we help?")
      })

      test(`t() returns an interpolated string with a single substitution variable`, () => {
        expect(
          t("status", {
            currentStatus: "open"
          })
        ).toBe("We are currently open")
      })

      test(`t() returns an interpolated string with variable as first item`, () => {
        expect(
          t("chosenLocation", {
            chosenLocation: t("locations:helsinki")
          })
        ).toBe("Helsinki chosen as home location")
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
            currentStatus: resources[defaultNS].open
          })
        ).toBe("We are currently open")
      })

      test(`t() returns an interpolated string with mixed substitution variables`, () => {
        expect(
          t("locations", {
            locationsCount: 20,
            citiesCount: "4",
            helsinki: t("locations:helsinki"),
            washington: t("locations:washington", {
              usState: t("locations:usStates.ohio")
            }),
            newYork: t("locations:newYork"),
            new_delhi: t("locations:new_delhi")
          })
        ).toBe(
          "We have 20 locations in 4 cities: Helsinki, Washington Ohio, New York and New Delhi."
        )
      })

      test(`t() throws an error when no substitution variables are provided`, () => {
        expect(() => t("")).toThrow("Key string is empty.")
      })

      test(`t() throws error on incorrect string`, () => {
        expect(() => t("_title")).toThrow("No string found! home._title")
      })

      test(`t() throws an error when variable count is different between passed attributes for t() and target value`, () => {
        expect(() => t("locations")).toThrow(
          "Mismatch between string variables(6) and passed substitutions(0) for home.locations"
        )
      })

      test(`t() throws an error when substitution variable key name is wrong`, () => {
        expect(() =>
          t("locations", {
            locationsCount: 20,
            citiesCount: "4",
            _helsinki: t("locations:helsinki"),
            washington: t("locations:washington", {
              usState: t("locations:usStates.ohio")
            }),
            newYork: t("locations:newYork"),
            new_delhi: t("locations:new_delhi")
          })
        ).toThrow(
          "Missing or wrong substitution variable {{helsinki}} in home.locations"
        )
      })
    })

    describe("<Trans />", () => {
      test("interpolates different strings", async () => {
        render(
          <Trans
            i18nKey="locations"
            subs={{
              locationsCount: <strong key="locations">20</strong>,
              citiesCount: <strong key="cities">{4}</strong>,
              helsinki: t("locations:helsinki"),
              washington: t("locations:washington", {
                usState: t("locations:usStates.ohio")
              }),
              newYork: t("locations:newYork"),
              new_delhi: t("locations:new_delhi")
            }}
          />
        )
        screen.getByText("We have ", {
          exact: false
        })
        screen.getByText("20", { selector: "strong" })
        screen.getByText(" locations in ", {
          exact: false
        })
        screen.getByText("4", { selector: "strong" })
        screen.getByText(
          " cities: Helsinki, Washington Ohio, New York and New Delhi.",
          {
            exact: false
          }
        )
      })

      test("Trans returns interpolated string with variable as first item", async () => {
        render(
          <Trans
            i18nKey="chosenLocation"
            subs={{
              chosenLocation: (
                <strong key="chosenLocation">{t("locations:helsinki")}</strong>
              )
            }}
          />
        )

        screen.getByText("Helsinki", { selector: "strong" })
        screen.getByText("chosen as home location", {
          exact: false
        })
      })

      test("Trans returns interpolation from non-default namespace", async () => {
        render(
          <Trans
            i18nKey="modal:cars"
            subs={{
              carsCount: <strong key="carsCount">20</strong>,
              serviceType: t("modal:services.lease.title")
            }}
          />
        )
        screen.getByText("We currently have ", {
          exact: false
        })
        screen.getByText("20", { selector: "strong" })
        screen.getByText(" cars available for ", {
          exact: false
        })
        screen.getByText("lease", {
          exact: false
        })
      })

      test("Trans should throw an error with missing key", async () => {
        const originalError = console.error
        console.error = jest.fn() // Avoid throwing error in the console
        expect(() => {
          render(
            <Trans
              i18nKey="_locations"
              subs={{
                locationsCount: <strong key="locations">20</strong>,
                citiesCount: <strong key="cities">{4}</strong>,
                helsinki: t("locations:helsinki"),
                washington: t("locations:washington", {
                  usState: t("locations:usStates.ohio")
                }),
                newYork: t("locations:newYork"),
                new_delhi: t("locations:new_delhi")
              }}
            />
          )
        }).toThrow("No string found! home._locations")
        console.error = originalError
      })

      test("Trans should throw an error with a wrong variable key", async () => {
        const originalError = console.error
        console.error = jest.fn() // Avoid throwing error in the console
        expect(() => {
          render(
            <Trans
              i18nKey="chosenLocation"
              subs={{
                _chosenLocation: (
                  <strong key="chosenLocation">
                    {t("locations:helsinki")}
                  </strong>
                )
              }}
            />
          )
        }).toThrow(
          "Missing or wrong substitution variable {{chosenLocation}} in home.chosenLocation"
        )
        console.error = originalError
      })

      test("Trans should throw an error with missing variable key", async () => {
        const originalError = console.error
        console.error = jest.fn() // Avoid throwing error in the console
        expect(() => {
          render(
            <Trans
              i18nKey="locations"
              subs={{
                locationsCount: <strong key="locations">20</strong>,
                citiesCount: <strong key="cities">{4}</strong>,
                // helsinki: t("locations:helsinki"),
                washington: t("locations:washington", {
                  usState: t("locations:usStates.ohio")
                }),
                newYork: t("locations:newYork"),
                new_delhi: t("locations:new_delhi")
              }}
            />
          )
        }).toThrow(
          "Mismatch between string variables(6) and passed substitutions(5) for home.locations"
        )
        console.error = originalError
      })
    })
  })
})()

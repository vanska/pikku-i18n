# pikku-i18n

> "Pikku" means tiny in the Finnish language.

A tiny ES6 library for i18n string interpolation with supporting React component.

Provides most commonly used i18n functionalities:

- String interpolation with variables
- Injecting React components inside string variables
- Helpful error messages for incorrect strings, missing variables etc.

## Install

```bash
npm install pikku-i18n
```

## Using pikku-i18n

Pikku-i18n can be used with both vanilla JavaScript and with React. The core library handles the string interpolations while the `Trans` component extends the library with React support.

### Javascript

```js
import { init, t, lang, defaultNS, resources, Trans } from "pikku-i18n"
import localeData from "./locales/en.json"

// Call init() before calling any other method.
init("en", "home", localeData)

// Access to passed data if needed
console.log(lang) // "en"
console.log(defaultNS) // "home"
console.log(resources) // "access passed localeData within the library"

console.log(t("title")) // returns "home.title" from locales

// Access alternative namespace strings
console.log(t("modal:title")) // returns "modal.title" from locales

// strings with variables
console.log(t("status", { currentStatus: t("open") })) // "We are currently open"

// Interpolate a variable
console.log(
  t("modal:cars", {
    carsCount: 5,
    serviceType: t("modal:services.lease.title")
  })
) // "We currently have 5 cars available for lease"

// Strings can contain multiple variables
console.log(
  t("locations", {
    locationsCount: 20, // Both numbers and
    citiesCount: "4", // strings can be used for interpolation.
    helsinki: t("locations:helsinki"),
    // Variables can be nested
    washington: t("locations:washington", {
      usState: t("locations:usStates.ohio")
    }), // Washington Ohio
    newYork: t("locations:newYork"), // Both camelCase and
    new_delhi: t("locations:new_delhi") // snake_case are supported
  })
) // "We have 20 locations in 4 cities: Helsinki, Washington Ohio, New York and New Delhi."
```

### With React

The `Trans` component is used for wrapping the string variables inside a React node.

```js
import React from "react"
import { init, t, Trans } from "vanska/pikku-i18n"
import localeData from "./locales/en.json"

export default function Component() {
  init("en", "home", localeData)

  return (
    <>
      <h1>{t("title")}</h1> // Use the core library the same way as with plain
      JavaScript
      <p>
        <Trans
          i18nKey="locations"
          subs={{
            locationsCount: <strong>20</strong>,
            citiesCount: <strong>{4}</strong>,
            helsinki: t("locations:helsinki"),
            washington: t("locations:washington", {
              usState: t("locations:usStates.ohio")
            }),
            newYork: t("locations:newYork"),
            new_delhi: t("locations:new_delhi")
          }}
        />
      </p>
    </>
  )
}
```

You can also access non-default namespaces with `Trans` component i.e. `i18nKey="modal:cars"`.

## i18n JSON format

```json
{
  "home": {
    "title": "This is our awesome home page title",
    "status": "We are currently {{currentStatus}}",
    "chosenLocation": "{{chosenLocation}} chosen as home location",
    "open": "open",
    "closed": "closed",
    "locations": "We have {{locationsCount}} locations in {{citiesCount}} cities: {{helsinki}}, {{washington}}, {{newYork}} and {{new_delhi}}.",
    "testimonials": {
      "title": "Testimonials",
      "description": "This is what our {{customerCount}} customers are saying",
      "customers": {
        "john": {
          "quote": "This is an awesome company!"
        },
        "mary": {
          "quote": "A great experience!"
        }
      }
    }
  },
  "modal": {
    "title": "How may we help?",
    "cars": "We currently have {{carsCount}} cars available for {{serviceType}}",
    "services": {
      "rental": {
        "title": "rental"
      },
      "lease": {
        "title": "lease"
      }
    }
  },
  "locations": {
    "helsinki": "Helsinki",
    "newYork": "New York",
    "new_delhi": "New Delhi",
    "washington": "Washington {{usState}}",
    "usStates": {
      "ohio": "Ohio",
      "north_carolina": "North Carolina"
    }
  }
}
```

### Development

```bash
# TypeScript
npm run tsc-watch
# Prettier
npm run format
# Jest
npm run jest-watch
```

### Local end to end package testing with yalc

```bash
npm run yalc-watch
cd ../destination-project
yalc link pikku-i18n
```

## Project roadmap

- Semantic release
- yalc-watch build
- NPM build on install
- Typescript
  - t()
    - Add min string lengths to types
  - Trans
    - Throw type error on any value other than i18nKey or ns that is not a ReactNode
- Tests
  - Add tests for incorrect locale data
  - i18n
    - init()
      - toThrow for incorrect locale data
- Trans
  - string substitution prop name needs to have an exact match with string variables

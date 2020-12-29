# pikku-i18n

> "Pikku" means tiny in the Finnish language.

A tiny ES6 library for i18n string interpolation with supporting React component. Great for GatsbyJS as it doesn't require React suspense for server side rendering (SSR).

Provides most commonly used i18n functionalities:

- String interpolation with variables
- Injecting React components inside string variables
- Helpful error messages for incorrect strings, missing variables etc.
- Node utility for validating string lengths
  - Set a max paragraph and word max length for defined keys

## Install

```bash
npm install --save pikku-i18n gatsby-plugin-compile-es6-packages
```

## Usage with GatsbyJS

Since this is an ES6 package it needs to be transpiled by Gatsby during build.

1. Install this plugin for Gatsby: [gatsby-plugin-compile-es6-packages](https://github.com/robwalkerco/gatsby-plugin-compile-es6-packages)
1. Add the plugin to your `gatsby-config.js`.

```js
plugins: [
  `gatsby-plugin-transform-i18n-locales`
  {
    resolve: `gatsby-plugin-compile-es6-packages`,
    options: {
      modules: [`pikku-i18n`]
    }
  }
]
```

## Using pikku-i18n

Pikku-i18n can be used with both simple JavaScript and with React. The core library handles the string interpolations while the `Trans` component extends the library with React support.

### Javascript

```js
import { init, t, lang, defaultNS, resources, Trans } from "pikku-i18n"
import localeData from "./locales/en.json"

// Call init() before calling any other method.
// init() is only needed when using t() method or the Trans component.
// You can optionally omit importing pikku-i18n entirely for components
// without string variable interpolation for even smaller bundle size.
init("en", "home", localeData)

// Access to passed data
console.log(lang) // "en"
console.log(defaultNS) // "home"
console.log(resources) // "access passed localeData within the library"

console.log(
  t("title") // returns "home.title" from locales
)
// Access alternative namespace strings
console.log(
  t("modal:title") // returns "modal.title" from locales
)
// strings with variables
console.log(
  t("status", { currentStatus: r.open }) // "We are currently open"
)
// Interpolate a string from a non-default namespace
console.log(
  t("cars", { carsCount: 5, serviceType: rModal.services.lease.title }, "modal") // "We currently have 5 cars available for lease"
)
// Strings can contain multiple variables
console.log(
  t(
    "locations", // returns interpolated "home.locations"
    // Pass an object containing each string variable
    {
      locationsCount: 20, // Both numbers and
      citiesCount: "4", // strings can be used for interpolation.
      helsinki: resources.locations.newYork, // "locations.helsinki"
      // Variables can be nested
      washington: t("washington", { usState: resources.locations.ohio }), // Washington Ohio
      newYork: resources.locations.newYork, // Both camelCase and
      new_delhi: resources.locations.new_delhi // snake_case are supported
    }
  )
)
```

### With React

The `Trans` component is used for wrapping the string variables inside a React node.

```js
import React from "react"
import { init, t, resources, Trans } from "vanska/pikku-i18n"
import localeData from "./locales/en.json"

export default function Component() {
  init("en", "home", localeData)

  return (
    <>
      // Use the core library the same way as with simple JavaScript
      <h1>{t("title")}</h1>
      <p>
        <Trans
          i18nKey="locations"
          locationsCount={<strong key="locations">20</strong>}
          citiesCount={<strong key="cities">{4}</strong>}
          helsinki={resources.locations.helsinki}
          washington={t(
            "washington",
            { usState: resources.locations.ohio },
            "locations"
          )}
          newYork={resources.locations.newYork}
          new_delhi={resources.locations.new_delhi}
        />
      </p>
    </>
  )
}
```

Trans component will wrap the string variables in React nodes

```jsx
<Trans
  i18nKey="keyWithStringInterpolation"
  variable={<span key={"variableSpanId"}>{t("variable")}</span>}
/>
```

### Tips

1. Rename imports if you have namespace collision with other libraries.

```js
import { init as i18nInit, resources as r } from "vanska/pikku-i18n"
```

## i18n JSON format

Note: All values need to be strings.

Example locale JSON `en.json`

```json
{
  "home": {
    "title": "This is our awesome home page title",
    "status": "We are currently {{currentStatus}}",
    "open": "open",
    "closed": "closed",
    "locations": "We have {{locationsCount}} locations in {{citiesCount}} cities: {{helsinki}}, {{newYork}} and {{new_delhi}}.",
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
    "newYork": "New York", // Both camelCase and
    "new_delhi": "New Delhi" // snake_case keys are supported
  }
}
```

## API

### .init(lang, defaultNamespace, data, \_isNodeObject)

```js
import i18n from "pikku-i18n"

const data = {
  home: {
    someKey: "This is some value",
    keyWithStringInterpolation:
      "This is a value with a variable of {{variable}}",
    variable: 3
  },
  about: {
    someKey: "This is some key",
    keyWithStringInterpolation:
      "This is a value with a variable of {{variable}}"
  }
}

i18n.init("en", "home", data)
```

### .t(string, object)

```js
import i18n from "pikku-i18n"

const { t } = i18n

t("someKey")
t("keyWithStringInterpolation", { variable: 3 })
t("keyWithStringInterpolation", { variable: t("countryCount") })
```

### Trans component for React

Replace a string variable with a react component.

```js
<Trans
  i18nKey="keyWithStringInterpolation"
  variable={<strong key={`someKey`}>3</strong>}
/>
```

### Combining Gatsby data queries from `vanska/gatsby-plugin-transform-i18n-locales`

```js
const data = {
  i18nStatic: {
    nodes: [
      {
        lang: "fi",
        namespace: "common",
        allTranslations: '{"title":"Common title Finnish"}'
      },
      {
        lang: "fi",
        namespace: "privacy-notice",
        allTranslations: '{"title":"Privacy notice Finnish"}'
      },
      {
        lang: "en",
        namespace: "common",
        allTranslations: '{"title":"Common title English"}'
      },
      {
        lang: "en",
        namespace: "privacy-notice",
        allTranslations: '{"title":"Privacy notice English"}'
      }
    ]
  },
  i18nPage: {
    nodes: [
      {
        namespace: "home",
        allTranslations:
          '{"countries":"We\'re in {{countryCount}} countries around Europe.","countryCount":"3","metaDescription":"Home metadescription text English","metaTitle":"Home metatitle English","title":"Home title English"}'
      }
    ]
  },
  i18nAdditions: {
    nodes: [
      {
        namespace: "design",
        singleTranslations: {
          title: "Design title English"
        }
      },
      {
        namespace: "services",
        singleTranslations: {
          title: "Services title English"
        }
      }
    ]
  }
}

i18n.init("en", "home", data, true)
```

## Testing i18n locale character count for words and paragraphs with NodeJS

Some languages like German and Finnish can have extremely long words that can cause your layout to overflow containers causing layout shifts if not handled properly. Better to catch these mistakes as early as possible.

> Max character count for visible text depends on your font family, size, spacing etc. and the space a container has. Usually the problem is pronounced with mobile devices with less horizontal space.

Reasoning:

- Avoid visual inconsistencies
- The `hyphens` CSS property works poorly with any other language than English, cutting words at undesired locations
- No need to set `overflow-x: hidden` CSS property
- Integrate as a part of e.g. build process and commit checks

### Node utils

```js
checkLocaleStringLengths("path/to/locales", rulesArray)
```

### Usage

```js
// translations/test/index.js

const { checkLocaleStringLengths } = require("pikku-i18n/lib/node-utils")

checkLocaleStringLengths("translations/locales", [
  {
    level: "error", // Will throw an error that stops the Node process
    type: "word", // Checks for total characters in single words
    key: "title", // Key to be tested
    maxCharacters: 20 // Max characters allowed.
  },
  {
    level: "warning", // Only prints a warning to the console but doesn't halt the process
    type: "paragraph", // Checks for total characters in a paragraph
    key: "metaTitle",
    maxCharacters: 60 // Sensible default for meta titles
  },
  {
    level: "warning",
    type: "paragraph",
    key: "metaDescription",
    maxCharacters: 300 // Sensible default for meta descriptions
  }
])
```

```js
// package.json
{
  "scripts": {
    "test-translations": "node ./translations/test/index.js"
  }
}
```

```terminal
npm run test-translations
```

Example terminal output:

```terminal
✖ Error:
=> fi.home.title
String contains a word with too many characters!
Character count of 61 for "Lentokonesuihkuturbiinimoottoriapumekaanikkoaliupseerioppilas" is more than the maximum character count of 20

⚠ Warning:
=> en.home.metaTitle
Paragraph length of 80 is greater than set maximum of 60
```

## Local package development with yalc

```bash
npm run yalc-watch
cd ../destination-project
yalc link pikku-i18n
```

## Project roadmap

- Semantic release
- yalc-watch build
- NPM build on install
- init()
  - Throw error for incorrect data structure
- ~~Convert to ES modules~~
- Typescript
  - t()
    - Add min string lengths to types
  - Trans
    - Throw type error on any value other than i18nKey or ns that is not a ReactNode
- ~~Decrease execution time by accessing simple strings with dot notation instead of parsing everything~~
  - ~~return the resources object for dot notation access when subsitution isn't needed~~
- Tests
  - Add tests for incorrect locale data
  - i18n
    - init()
      - toThrow for incorrect locale data
  - ~~Trans~~
- Add support for infinite key nesting
- Move createResources as an optional utility
- t()
  - accept numbers as parameter
- Trans
  - string substitution prop name needs to have an exact match with string variables
  - automatically create unique keys inside Trans
  - access strings from any namespace
- Optional: SSR API for simple variable substitutions

# pikku-i18n

> "Pikku" means tiny in the Finnish language.

A tiny i18n ES6 library built especially for GatsbyJS and React without the need for suspense for SSR. Provides most commonly used i18n functionalities for static site rendering with Gatsby.

Features:

- Fetch strings from json data
- String interpolation with data or a React component
- Assign language
- Assign default namespace
- Fetch any string from any namespace within the locale data

Utility extras:

- A NodeJS utility for testing i18n locale character count for words and paragraphs

## Install

```bash
npm install --save vanska/pikku-i18n gatsby-plugin-compile-es6-packages
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

## Using with React

```js
import React from "react"
import i18n, { Trans } from "vanska/pikku-i18n"

export default function SomePage() {
  i18n.init("en", "namespace", localeData)
  const { t } = i18n

  return (
    <>
      <h1>{t("someKey")}</h1>
      <p>{t("keyWithStringInterpolation", { variable: 3 })}</p>
      <p>{t("keyWithStringInterpolation", { variable: t("variable") })}</p>
      <p>
        <Trans
          i18nKey="keyWithStringInterpolation"
          variable={<strong key={"variableStrongId"}>666</strong>}
        />
        <Trans
          i18nKey="keyWithStringInterpolation"
          variable={<span key={"variableSpanId"}>{t("variable")}</span>}
        />
      </p>
      <p>{t("anotherNamespace:someKey")}</p>
    </>
  )
}
```

## i18n JSON format

It's important all values are strings.

```json
// en.json
{
  "namespace": {
    "someKey": "This is some value",
    "keyWithStringInterpolation": "This is a value with a variable of {{variable}}",
    "variable": "3"
  },
  "anotherNamespace": {
    "someKey": "This is some key",
    "keyWithStringInterpolation": "This is a value with a variable of {{variable}}"
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
- Trans
  - string substitution prop name needs to have an exact match with string variables
  - automatically create unique keys inside Trans
  - access strings from any namespace
- Optional: SSR API for simple variable substitutions

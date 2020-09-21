# Tiny i18n library for ES6 and React

Built especially for GatsbyJS and React without the need for suspense in SSR. Provides most commonly used i18n functionalities for static site rendering with Gatsby.

Features:

- Fetch strings from json data
- String interpolation with data or a React component
- Assign language
- Assign default namespace
- Fetch any string from any namespace within the locale data
- A tool for checking translation string lenghts

## Install

```shell
npm install --save vanska/pikku-i18n gatsby-plugin-compile-es6-packages
```

## Usage with GatsbyJS

Since this is an ES6 package it needs to be transpiled by Gatsby during build.

1. Install this plugin for Gatsby: [gatsby-plugin-compile-es6-packages](https://github.com/robwalkerco/gatsby-plugin-compile-es6-packages)
1. Add the plugin to your `gatsby-config.js`.

```js
plugins: [
  {
    resolve: `gatsby-plugin-compile-es6-packages`,
    options: {
      modules: [`pikku-i18n`],
    },
  },
]
```

## Using with React

```js
import React from 'react'
import i18n, { Trans } from 'vanska/pikku-i18n'

export default function SomePage() {
  i18n.use('en', 'namespace', localeData)
  const { t } = i18n

  return (
    <>
      <h1>{t('someKey')}</h1>
      <p>{t('keyWithStringInterpolation', { variable: 3 })}</p>
      <p>{t('keyWithStringInterpolation', { variable: t('variable') })}</p>
      <p>
        <Trans
          i18nKey="keyWithStringInterpolation"
          variable={<strong key={'variableStrongId'}>666</strong>}
        />
        <Trans
          i18nKey="keyWithStringInterpolation"
          variable={<span key={'variableSpanId'}>{t('variable')}</span>}
        />
      </p>
      <p>{t('anotherNamespace:someKey')}</p>
    </>
  )
}
```

## i18n JSON format

```json
// en.json
{
  "namespace": {
    "someKey": "This is some value",
    "keyWithStringInterpolation": "This is a value with a variable of {{variable}}",
    "variable": 3
  },
  "anotherNamespace": {
    "someKey": "This is some key",
    "keyWithStringInterpolation": "This is a value with a variable of {{variable}}"
  }
}
```

## Local package development with yalc

```bash
npm run yalc-watch
cd ../destination-project
yalc link pikku-i18n
```

## Project roadmap

- Separate modules

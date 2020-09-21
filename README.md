# pikku-i18n

> "Pikku" means tiny in the Finnish language.

A tiny i18n ES6 library built especially for GatsbyJS and React without the need for suspense for SSR. Provides most commonly used i18n functionalities for static site rendering with Gatsby.

Features:

- Fetch strings from json data
- String interpolation with data or a React component
- Assign language
- Assign default namespace
- Fetch any string from any namespace within the locale data
- A tool for checking translation string lenghts

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

## API

### .use(lang, defaultNamespace, data, \_isNodeObject)

```js
import i18n from 'pikku-i18n'

const data = {
  home: {
    someKey: 'This is some value',
    keyWithStringInterpolation:
      'This is a value with a variable of {{variable}}',
    variable: 3
  },
  about: {
    someKey: 'This is some key',
    keyWithStringInterpolation:
      'This is a value with a variable of {{variable}}'
  }
}

i18n.use('en', 'home', data)
```

### .t(string, object)

```js
import i18n from 'pikku-i18n'

const { t } = i18n

t('someKey')
t('keyWithStringInterpolation', { variable: 3 })
t('keyWithStringInterpolation', { variable: t('countryCount') })
```

### Trans

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
        lang: 'fi',
        namespace: 'common',
        allTranslations: '{"title":"Common title Finnish"}'
      },
      {
        lang: 'fi',
        namespace: 'privacy-notice',
        allTranslations: '{"title":"Privacy notice Finnish"}'
      },
      {
        lang: 'en',
        namespace: 'common',
        allTranslations: '{"title":"Common title English"}'
      },
      {
        lang: 'en',
        namespace: 'privacy-notice',
        allTranslations: '{"title":"Privacy notice English"}'
      }
    ]
  },
  i18nPage: {
    nodes: [
      {
        namespace: 'home',
        allTranslations:
          '{"countries":"We\'re in {{countryCount}} countries around Europe.","countryCount":"3","metaDescription":"Home metadescription text English","metaTitle":"Home metatitle English","title":"Home title English"}'
      }
    ]
  },
  i18nAdditions: {
    nodes: [
      {
        namespace: 'design',
        singleTranslations: {
          title: 'Design title English'
        }
      },
      {
        namespace: 'services',
        singleTranslations: {
          title: 'Services title English'
        }
      }
    ]
  }
}

i18n.use('en', 'home', data, true)
```

## Local package development with yalc

```bash
npm run yalc-watch
cd ../destination-project
yalc link pikku-i18n
```

## Project roadmap

- Separate modules
- API to skip client side work
  - no re-rendering of SSR strings on initial page load
    - reduces TBT (Total blocking time)

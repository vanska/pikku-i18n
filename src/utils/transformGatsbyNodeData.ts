import { lang } from "../i18n"

export const transformGatsbyNodeData = function (d: any) {
  let { i18nStatic, i18nPage, i18nAdditions } = d
  let r = {}
  if (i18nStatic) {
    i18nStatic.nodes.forEach((n) => {
      if (n.lang !== lang) return
      r[n.namespace] = JSON.parse(n.allTranslations)
    })
  }
  if (i18nPage) {
    i18nPage.nodes.forEach((n) => {
      r[n.namespace] = JSON.parse(n.allTranslations)
    })
  }
  if (i18nAdditions) {
    i18nAdditions.nodes.forEach((n) => {
      r[n.namespace] = n.singleTranslations
    })
  }
  return r
}

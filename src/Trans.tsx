import React from "react"
import { i18n } from "./i18n"

export const Trans = ({ i18nKey, ...rest }) => (
  <>
    {i18n
      .t(i18nKey, "", true)
      .split(i18n.subsRegEx)
      .reduce((prev: string[], current, i) => {
        if (!i) return [current]
        return prev.concat(
          Object.keys(rest).includes(current) ? rest[current] : current
        )
      }, [])}
  </>
)

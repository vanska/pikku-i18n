import React from "react"
import { t, SUBS_REG_EX } from "./i18n"

export const Trans = ({ i18nKey, ...rest }) => (
  <>
    {t(i18nKey, "", true)
      .split(SUBS_REG_EX)
      .reduce((prev: string[], current, i) => {
        if (!i) return [current]
        return prev.concat(
          Object.keys(rest).includes(current) ? rest[current] : current
        )
      }, [])}
  </>
)

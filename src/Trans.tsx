import React from "react"
import { t, VAR_REG_EX } from "./i18n"

export const Trans = ({
  i18nKey,
  ns,
  subs
}: {
  i18nKey: string
  ns?: string
  subs: {
    [key: string]: JSX.Element | string | number
  }
}) => (
  <>
    {t(i18nKey, subs, true) // Return the correct string with variables
      .split(VAR_REG_EX) // Split variables
      .reduce((prev: string[], current, i) => {
        if (!i) return [current]
        return (prev as any).concat(
          Object.keys(subs).includes(current) ? subs[current] : current
        )
      }, [])}
  </>
)

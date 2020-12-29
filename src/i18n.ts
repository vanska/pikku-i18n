export let lang = ""
export let defaultNS = ""
export let resources: Record<any, any> = {}
export const VAR_REG_EX = new RegExp(/\{{([^{]+)}}/g)

export const init = function (
  l: string,
  dns: string,
  data: Record<string, unknown>
): void {
  lang = l
  defaultNS = dns
  resources = data
}

export const t = function (
  str: string,
  subs?: Record<string, string | number | JSX.Element> | null,
  trans?: boolean
): string {
  let strSplit: string[], keyPath: string[], ns: string, val: string
  if (str.length > 0) {
    strSplit = str.split(":")
    ns = strSplit.length > 1 ? strSplit[0] : defaultNS
    keyPath =
      strSplit.length > 1 ? strSplit[1].split(".") : strSplit[0].split(".")
    val = keyPath.reduce((p, c) => p?.[c], resources[ns])
  } else {
    throw new Error(`Key string is empty.`)
  }
  // Check for namespace
  if (!resources[ns]) {
    throw new Error(`Namespace not found: ${ns}`)
  }
  // Check string exists
  if (!val) {
    throw new Error(`No string found! ${ns}.${keyPath}`)
  }

  const strSubs = val.match(VAR_REG_EX)

  // Skip interpolation if string doesn't contain variables
  if (!strSubs) {
    return val
  }

  const passedSubsCount = subs ? Object.keys(subs).length : 0

  if (passedSubsCount !== strSubs.length) {
    throw new Error(
      `Mismatch between string variables(${strSubs.length}) and passed substitutions(${passedSubsCount}) for ${ns}.${keyPath}`
    )
  }

  // String interpolation and passed varibale checks happen here
  return val.replace(
    VAR_REG_EX,
    function (match: string, subsKey: string): string {
      if (subs && !subs[subsKey]) {
        throw new Error(
          `Can't find variable key {{${subsKey}}} for ${ns}.${keyPath} from passed values`
        )
      }
      // Return string as is for Trans component after check
      if (trans) {
        return match
      }
      // Return an interpolated string
      return subs ? subs[subsKey].toString() : match
    }
  )
}

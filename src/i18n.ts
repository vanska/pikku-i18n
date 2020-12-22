export let lang = ""
export let defaultNS = ""
export let resources: any = {}
export const VAR_REG_EX = new RegExp(/\{{([^{]+)}}/g)

export const init = function (l: string, dns: string, data: {}): void {
  lang = l
  defaultNS = dns
  resources = data
}

export const t = function (str: string, subs?: {} | null, trans?: boolean) {
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

  let strSubs = val.match(VAR_REG_EX)

  // Skip interpolation if string doesn't contain variables
  if (!strSubs) {
    return val
  }

  let passedSubsCount = subs ? Object.keys(subs).length : 0

  if (strSubs) {
    if (passedSubsCount !== strSubs.length) {
      throw new Error(
        `Mismatch between string variables(${strSubs.length}) and passed substitutions(${passedSubsCount}) for ${ns}.${keyPath}`
      )
    }
  }

  return val.replace(VAR_REG_EX, function (match, subsKey: string) {
    if (subs) {
      if (!subs[subsKey]) {
        throw new Error(
          `Missing or wrong substitution variable {{${subsKey}}} in ${ns}.${keyPath}`
        )
      }
      // Return string as is for Trans component after check
      if (trans) {
        return match
      }
      return subs[subsKey] && subs[subsKey]
    }
  })
}

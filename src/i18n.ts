export let defaultNS = ""
export let resources: any = {}
export let lang = ""
export const SUBS_REG_EX = new RegExp(/\{{([^{]+)}}/g)

export const use = function (l: string, dns: string, data: any): void {
  lang = l
  defaultNS = dns
  resources = data
}

export const t = function (str: string, subs?: any, trans?: boolean) {
  let strSplit, key, ns, val
  if (str.length > 0) {
    strSplit = str.split(":") // Split string into array
    key = strSplit.length > 1 ? strSplit[1] : strSplit[0]
    ns = strSplit.length > 1 && strSplit[0].length > 0 ? strSplit[0] : defaultNS
    val = resources && resources[ns][key]
  } else {
    throw new Error(`Key string is empty.`)
  }
  // Skip interpolation for Trans component
  if (trans) {
    return val
  }

  // Check for namespace
  if (!resources[ns]) {
    throw new Error(`Namespace not found: ${ns}`)
  }
  // Check string exists
  if (!val) {
    throw new Error(`No string found! ${ns}.${key}`)
  }

  let strSubs = val.match(SUBS_REG_EX)
  if (!strSubs) return val

  let passedSubsCount = subs ? Object.keys(subs).length : 0

  if (passedSubsCount !== strSubs.length) {
    throw new Error(
      `Mismatch between string variables(${strSubs.length}) and passed substitutions(${passedSubsCount}) for ${ns}.${key}`
    )
  }

  return val.replace(SUBS_REG_EX, function (_, subsKey) {
    if (!subs[subsKey]) {
      throw new Error(
        `Missing substitution variable from {{${key}}} in ${ns}.${key}`
      )
    }
    return subs[subsKey] && subs[subsKey]
  })
}

export let lang = ""
export let defaultNS = ""
export let resources: any = {}
export const SUBS_REG_EX = new RegExp(/\{{([^{]+)}}/g)

export const init = function (l: string, dns: string, data: {}): void {
  lang = l
  defaultNS = dns
  resources = data
}

export const t = function (
  str: string,
  subs?: {} | null,
  nsO?: string | null,
  trans?: boolean
) {
  let keyPath: string[], ns: string, val: string
  if (str.length > 0) {
    // Check for empty namespace override
    if (nsO && nsO.length === 0) {
      throw new Error(`Namespace override doesn't exist for ${str}`)
    }
    // Set namespace override if it exists
    ns = nsO ? nsO : defaultNS
    keyPath = str.split(".")
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
  // Skip interpolation for Trans component
  if (trans) {
    return val
  }

  let strSubs = val.match(SUBS_REG_EX)
  if (!strSubs) return val

  let passedSubsCount = subs ? Object.keys(subs).length : 0

  if (passedSubsCount !== strSubs.length) {
    throw new Error(
      `Mismatch between string variables(${strSubs.length}) and passed substitutions(${passedSubsCount}) for ${ns}.${keyPath}`
    )
  }

  return val.replace(SUBS_REG_EX, function (_, subsKey: string) {
    if (subs) {
      if (!subs[subsKey]) {
        throw new Error(
          `Missing substitution variable from {{${keyPath}}} in ${ns}.${keyPath}`
        )
      }
      return subs[subsKey] && subs[subsKey]
    }
  })
}

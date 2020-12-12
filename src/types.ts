export interface IM {
  defaultNS: string
  resources: object
  lang: string
  subsRegEx: RegExp
  use?: (lang: string, dns: string, data: any, isNodeData: boolean) => void
  t?: (str: string, subs: any, trans: any) => void
}

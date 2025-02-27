export const fallbackLng = 'zh'
export const languages = [fallbackLng, 'en']
export const defaultNS: string | string[] = 'common'
export const cookieName = 'i18next'

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}

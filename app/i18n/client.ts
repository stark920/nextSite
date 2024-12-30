'use client'

import { useEffect, useState } from 'react'
import i18next, { Namespace } from 'i18next'
import {
  initReactI18next,
  UseTranslationOptions,
  useTranslation as useTranslationOrg,
} from 'react-i18next'
import { useCookies } from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, cookieName } from './settings'

const runsOnServerSide = typeof window === 'undefined'

//
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : [],
  })

export function useTranslation(
  lng: string,
  ns?: Namespace,
  options?: UseTranslationOptions<undefined>,
) {
  const [cookies, setCookie] = useCookies([cookieName])
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret

  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)

  // Update `activeLng` when `i18n.resolvedLanguage` changes
  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) return
    setActiveLng(i18n.resolvedLanguage)
  }, [activeLng, i18n.resolvedLanguage])

  // Change language when `lng` changes and differs from `i18n.resolvedLanguage`
  useEffect(() => {
    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
      i18n.changeLanguage(lng)
    } else if (lng && i18n.resolvedLanguage !== lng) {
      i18n.changeLanguage(lng)
    }
  }, [lng, i18n])

  // Set the cookie when `lng` changes
  useEffect(() => {
    if (cookies.i18next === lng) return
    setCookie(cookieName, lng, { path: '/' })
  }, [lng, cookies.i18next, setCookie])

  return ret
}

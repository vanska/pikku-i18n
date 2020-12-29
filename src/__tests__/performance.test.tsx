import { init, t, resources } from "../index"
import localeData from "./locales/en.json"

const testLang = "en"
const testDefaultNs = "home"

init(testLang, testDefaultNs, localeData)

const SIMPLE = "SIMPLE",
  NESTED = "NESTED",
  NESTED_SUBSTITUTIONS = "NESTED_SUBSTITUTIONS",
  NESTED_ALT_NAMESPACE = "NESTED_ALT_NAMESPACE",
  DOT_NOTATION = "DOT_NOTATION"

test(`pikku-i18n performance testing`, () => {
  const iterations = 1000 // 1000 is already a lot of strings for a page

  console.time(DOT_NOTATION)
  for (var i = 0; i < iterations; i++) {
    resources.home.title
  }
  console.timeEnd(DOT_NOTATION)

  console.time(SIMPLE)
  for (var i = 0; i < iterations; i++) {
    t("title")
  }
  console.timeEnd(SIMPLE)

  console.time(NESTED_ALT_NAMESPACE)
  for (var i = 0; i < iterations; i++) {
    t("modal:title")
  }
  console.timeEnd(NESTED_ALT_NAMESPACE)

  console.time(NESTED)
  for (var i = 0; i < iterations; i++) {
    t("testimonials.title")
  }
  console.timeEnd(NESTED)

  console.time(NESTED_SUBSTITUTIONS)
  for (var i = 0; i < iterations; i++) {
    t("locations", {
      locationsCount: 20,
      citiesCount: "4",
      helsinki: t("locations:helsinki"),
      washington: t("locations:washington", {
        usState: t("locations:usStates.ohio")
      }),
      newYork: t("locations:newYork"),
      new_delhi: t("locations:new_delhi")
    })
  }
  console.timeEnd(NESTED_SUBSTITUTIONS)
})

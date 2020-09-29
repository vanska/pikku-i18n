const path = require('path')
const fs = require('fs')
const glob = require('glob')
const log = require('log-beautify')

module.exports = checkLocaleStringLengths = (localesDir, rules) => {
  let localeFilesPerLanguage = glob.sync(`${localesDir}/*.json`, {})

  let matches = []

  const pushToMatches = (rule, msg) => {
    let o = {
      level: rule.level,
      msg: msg
    }
    if (rule.level === 'error') {
      matches.unshift(o)
    } else {
      matches.push(o)
    }
  }

  localeFilesPerLanguage.forEach((file) => {
    let localeLang = path.basename(file, path.extname(file))
    let fileData = JSON.parse(fs.readFileSync(file, 'utf-8'))

    Object.keys(fileData).forEach((ns) => {
      Object.keys(fileData[ns]).filter((key) => {
        rules.forEach((rule) => {
          if (key === rule.key) {
            if (rule.type === 'word') {
              fileData[ns][key]
                .split(' ')
                .filter((word) => word.length > rule.maxCharacters)
                .forEach((value) => {
                  let msg = `${localeLang}.${ns}.${key}\nString contains a word with too many characters!\nCharacter count of ${value.length} for "${value}" is more than the maximum character count of ${rule.maxCharacters}\n`
                  pushToMatches(rule, msg)
                })
            }
            if (rule.type === 'paragraph') {
              if (fileData[ns][key].length > rule.maxCharacters) {
                let msg = `${localeLang}.${ns}.${key}\nParagraph length of ${fileData[ns][key].length} is greater than set maximum of ${rule.maxCharacters}\n`
                pushToMatches(rule, msg)
              }
            }
          }
        })
      })
    })
  })
  if (matches.length > 0) {
    matches.forEach((match) => {
      if (match.level === 'error') {
        log.error(`Error:\n=> ${match.msg}`)
        throw new Error(`Character count test failed!`)
      } else {
        log.warning(`Warning:\n=> ${match.msg}`)
      }
    })
  } else {
    log.success('Success\nNo problems found in translation lengths.')
  }
}

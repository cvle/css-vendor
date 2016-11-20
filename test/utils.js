import * as bowser from 'bowser'
import db from 'caniuse-db/data.json'

// bowser id -> caniuse id
const browserIdMap = {
  msie: 'ie',
  msedge: 'edge',
  firefox: 'firefox',
  chrome: 'chrome',
  safari: 'safari',
  opera: 'opera',
  ios: 'ios_saf',
  android: 'android',
  blackberry: 'bb',
  ucbrowser: 'and_uc',
  samsungBrowser: 'samsung',
}

function detectBrowserId() {
  for (const b in browserIdMap) {
    if (bowser[b]) return browserIdMap[b]
  }
  return 'unknown'
}

export const browserId = detectBrowserId()
export const browserVersion = parseFloat(bowser.version)

export function getSupport(feature) {
  const ret = {full: false, partial: false, needPrefix: false, unknown: true}
  const stats = db.data[feature].stats[browserId]
  if (!stats) return ret
  // sorted contains a list with sorted version numbers.
  const sorted = Object.keys(stats).sort((a, b) => parseFloat(a) - parseFloat(b))

  // at the end of this loop, match contains the stat value of the closest matching
  // version <= browserVersion.
  let match = ''
  for (const v of sorted) {
    const [from, to] = v.split('-').map((x) => parseFloat(x))
    if (browserVersion >= from) match = stats[v]
    else break
    if (to !== undefined && browserVersion <= to) break
  }
  if (match) {
    ret.full = match.indexOf('y') !== -1
    ret.partial = match.indexOf('a') !== -1
    ret.needPrefix = match.indexOf('x') !== -1
    ret.unknown = false
  }
  return ret
}

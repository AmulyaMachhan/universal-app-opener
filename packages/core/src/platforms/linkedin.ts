import { DeepLinkHandler, DeepLinkResult } from '../types'


/**
 * Regex patterns to detect supported LinkedIn URL types
 */
const patterns: Array<[type: string, regex: RegExp]> = [
  ['profile', /linkedin\.com\/in\/([^/?#]+)/],
  ['post', /linkedin\.com\/posts\/([^/?#]+)/],
  ['post', /linkedin\.com\/feed\/update\/(?:urn:li:activity:)?([^/?#]+)/],
  ['company', /linkedin\.com\/company\/([^/?#]+)/],
  ['job', /linkedin\.com\/jobs\/view\/([^/?#]+)/],
]

/**
 * Helper to assemble a valid deeplink result object
 */
const buildResult = (
  webUrl: string,
  ios: string | null,
  android: string | null
): DeepLinkResult => ({
  webUrl,
  ios,
  android,
  platform: 'linkedin',
})

/**
 * Maps each recognized link type to its deeplink URL formats
 */
const builders: Record<string, (id: string, webUrl: string) => DeepLinkResult> = {
  profile: (id, webUrl) =>
    buildResult(
      webUrl,
      `linkedin://in/${id}`,
      `intent://in/${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`
    ),

  post: (id, webUrl) =>
    buildResult(
      webUrl,
      `linkedin://urn:li:activity:${id}`,
      `intent://urn:li:activity:${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`
    ),

  company: (id, webUrl) =>
    buildResult(
      webUrl,
      `linkedin://company/${id}`,
      `intent://company/${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`
    ),

  job: (id, webUrl) =>
    buildResult(
      webUrl,
      `linkedin://job/${id}`,
      `intent://job/${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`
    ),
}

/**
* generates corresponding deeplink metadata based on url types
*/
export const linkedinHandler: DeepLinkHandler = {
  match: (url) => {
    for (const [type, regex] of patterns) {
      const matchResult = url.match(regex)
      if (matchResult)
        return [matchResult[0], type, matchResult[1]] as RegExpMatchArray
    }
    return null
  },

  build: (webUrl, match) => {
    const type = match[1]
    const id = match[2]

    const builder = builders[type]
    return builder
      ? builder(id, webUrl)
      : buildResult(webUrl, null, null)
  },
}

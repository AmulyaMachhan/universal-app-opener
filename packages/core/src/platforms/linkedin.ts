import { DeepLinkHandler } from '../types';

/**
 * Match result:
 * match[0] => linkedin.com/in/{id}
 * match[1] => type
 * match[2] => id
 */
export const linkedinHandler: DeepLinkHandler = {
  match: (url) => {
    const patterns: Array<[type: string, regex: RegExp]> = [
      // Profile
      ['profile', /linkedin\.com\/in\/([^/?#]+)/],

      // Post (posts)
      ['post', /linkedin\.com\/posts\/([^/?#]+)/],

      // Post (feed update)
      ['post', /linkedin\.com\/feed\/update\/(?:urn:li:activity:)?([^/?#]+)/],

      // Company
      ['company', /linkedin\.com\/company\/([^/?#]+)/],

      // Job
      ['job', /linkedin\.com\/jobs\/view\/([^/?#]+)/],
    ];

    for (const [type, regex] of patterns) {
      const matchResult = url.match(regex);
      if (matchResult) {
        // Normalize into a predictable match array
        return [matchResult[0], type, matchResult[1]] as RegExpMatchArray;
      }
    }

    return null;
  },

  build: (webUrl, match) => {
    const type = match[1];
    const id = match[2];

    switch (type) {
      case 'profile':
        return {
          webUrl,
          ios: `linkedin://in/${id}`,
          android: `intent://in/${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`,
          platform: 'linkedin',
        };

      case 'post':
        return {
          webUrl,
          ios: `linkedin://urn:li:activity:${id}`,
          android: `intent://urn:li:activity:${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`,
          platform: 'linkedin',
        };

      case 'company':
        return {
          webUrl,
          ios: `linkedin://company/${id}`,
          android: `intent://company/${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`,
          platform: 'linkedin',
        };

      case 'job':
        return {
          webUrl,
          ios: `linkedin://job/${id}`,
          android: `intent://job/${id}#Intent;scheme=linkedin;package=com.linkedin.android;end`,
          platform: 'linkedin',
        };

      default:
        return {
          webUrl,
          ios: null,
          android: null,
          platform: 'linkedin',
        };
    }
  },
};

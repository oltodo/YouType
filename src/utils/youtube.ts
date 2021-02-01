import url from "url";

const idRegex = /^[a-zA-Z0-9-_]{11}$/;

export const validateID = (id: string): boolean => idRegex.test(id);

/**
 * Get video ID.
 *
 * There are a few type of video URL formats.
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://m.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/v/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://music.youtube.com/watch?v=VIDEO_ID
 *  - https://gaming.youtube.com/watch?v=VIDEO_ID
 *
 * @param {string} link
 * @return {string}
 * @throws {Error} If unable to find a id
 * @throws {TypeError} If videoid doesn't match specs
 */
const validQueryDomains = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "gaming.youtube.com",
]);

const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube.com\/(embed|v)\/)/;

export const getVideoID = (link: string): string | null => {
  const { pathname = "", hostname, query } = url.parse(link, true);
  let id = Array.isArray(query.v) ? query.v[0] : query.v;

  if (validPathDomains.test(link) && !id) {
    const paths = (pathname || "").split("/");
    id = paths[paths.length - 1];
  } else if (hostname && !validQueryDomains.has(hostname)) {
    return null;
  }

  if (!id) {
    return null;
  }

  id = id.substring(0, 11);
  if (!validateID(id)) {
    return null;
  }

  return id;
};

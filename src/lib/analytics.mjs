// goatcounter page view counting. it stays off unless GOATCOUNTER_CODE is set at build time,
// so local builds and tests never send anything.
// plain .mjs so astro.config.mjs can import it too.

export const GOATCOUNTER_SCRIPT = 'https://gc.zgo.at/count.js';

/**
 * turns a goatcounter site code (the "name" in name.goatcounter.com) into the urls the
 * script and the csp need. returns null when the code is missing or not a valid code.
 * @param {string | undefined} code
 * @returns {{ endpoint: string, origin: string } | null}
 */
export function goatCounter(code) {
  const value = code?.trim().toLowerCase();
  // goatcounter codes are letters, numbers and dashes
  if (!value || !/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(value)) return null;
  const origin = `https://${value}.goatcounter.com`;
  return { endpoint: `${origin}/count`, origin };
}

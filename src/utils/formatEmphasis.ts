/**
 * Highlights text based on markdown-style syntax.
 * @param {string} text - The raw string to process.
 * @param {boolean} shouldBold - If true, applies bold styling to highlighted parts. Defaults to false.
 */
export function highlightEmphasis(text: string, shouldBold: boolean = false) {
  let out = text;
  // This class only applies to the Blue/Green highlights based on the prop
  const coloredBoldClass = shouldBold ? "font-bold" : "";

  // 1. **double asterisks** → Standard Bold (Always bold, ignores shouldBold param)
  // Process this first so it doesn't get confused with single asterisks
  out = out.replace(
    /\*\*(.*?)\*\*/g, 
    '<span class="font-bold text-brandGrayDark">$1</span>'
  );

  // 2. __double underscore__ → brandBlue (Bold depends on param)
  out = out.replace(
    /__(.*?)__/g, 
    `<span class="text-brandBlue ${coloredBoldClass}">$1</span>`
  );

  // 3. *single asterisk* → brandGreen (Bold depends on param)
  out = out.replace(
    /\*(.*?)\*/g, 
    `<span class="text-brandGreen ${coloredBoldClass}">$1</span>`
  );

  return out;
}
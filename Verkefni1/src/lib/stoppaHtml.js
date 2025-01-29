/**
 * Hjalpari sem stoppar html kóðann í spurningunum að verða 
 * að alvöru html kóða
 */
export function stoppaHTML(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
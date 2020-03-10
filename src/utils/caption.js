export function parse(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const caption = xmlDoc.children[0].children;

  return Array.from(caption).map(curr => ({
    text: curr.textContent,
    ...(function(start, duration) {
      return {
        start,
        end: start + duration,
        duration
      };
    })(
      parseFloat(curr.getAttribute("start")),
      parseFloat(curr.getAttribute("dur"))
    )
  }));
}
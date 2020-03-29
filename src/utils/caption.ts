import decode from "parse-entities";

export type Caption = {
  index: number;
  text: string;
  start: number;
  end: number;
  duration: number;
};

export function parse(xml: string): Caption[] {
  const parser = new DOMParser();
  const xmlDoc: Document = parser.parseFromString(xml, "text/xml");
  const caption = xmlDoc.children[0].children;

  return Array.from(caption).map((curr: Element, index: number) => ({
    index,
    text: decode(curr.textContent || ""),
    ...(function (start, duration) {
      return {
        start,
        end: start + duration,
        duration,
      };
    })(parseFloat(curr.getAttribute("start") || ""), parseFloat(curr.getAttribute("dur") || "")),
  }));
}

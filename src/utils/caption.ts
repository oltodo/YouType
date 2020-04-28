import decode from "parse-entities";

export interface Caption {
  index: number;
  text: string;
  start: number;
  end: number;
  duration: number;
}

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

export function findTextInRange(captions: Caption[], start: number, end: number): string {
  let text = "";

  for (let i = 0; i < captions.length; i += 1) {
    if (captions[i].start > end) {
      return text;
    }

    if (captions[i].end <= start) {
      continue;
    }

    const duration = captions[i].end - captions[i].start;
    const min = Math.max(start, captions[i].start);
    const max = Math.min(end, captions[i].end);
    const percent = ((max - min) / duration) * 100;

    if (percent >= 50) {
      text += ` ${captions[i].text}`;
    }
  }

  return text;
}

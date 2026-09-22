/**
 * THE DOCUMENT OUTLINE.
 *
 * One list, read by both the page (which stamps these ids onto its sections)
 * and the rail (which follows the reader down them). Keeping it here is what
 * stops the rail pointing at an anchor the page no longer has.
 */
export interface OutlineChapter {
  id: string;
  n: string;
  label: string;
  sections: { id: string; label: string }[];
}

export const OUTLINE: OutlineChapter[] = [
  {
    id: "found",
    n: "01",
    label: "What we found",
    sections: [
      { id: "cycle", label: "The cash cycle, to scale" },
      { id: "trough", label: "Peak funding need" },
      { id: "projects", label: "Which projects carry it" },
    ],
  },
  {
    id: "leaked",
    n: "02",
    label: "Where it leaked",
    sections: [
      { id: "terms", label: "Credit already given" },
      { id: "waterfall", label: "Contract to cash" },
      { id: "simulator", label: "Move the levers" },
    ],
  },
  {
    id: "changed",
    n: "03",
    label: "What we changed",
    sections: [
      { id: "bottlenecks", label: "Ranked by money" },
      { id: "before", label: "Before against since" },
      { id: "loop", label: "How a ticket closes" },
      { id: "worth", label: "What it is worth" },
    ],
  },
];

/** Every anchor on the page, chapters and sections together, in reading order. */
export const ANCHORS: string[] = OUTLINE.flatMap((chapter) => [
  chapter.id,
  ...chapter.sections.map((section) => section.id),
]);

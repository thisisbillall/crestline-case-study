import * as echarts from "echarts";

/**
 * ONE CHART LANGUAGE.
 *
 * Soft lilac fintech: pastel fills with their own ink for the stroke, rounded
 * caps, whisper shadows. Light only — the palette is painted explicitly so the
 * page holds its own ground whatever theme the reader is in.
 *
 * Colour is never the only carrier: every series is also labelled.
 */

export const C = {
  lav: "#b8b0ee", lavInk: "#6b5fc7",
  mint: "#9fe0c5", mintInk: "#2f9e78",
  sky: "#a5cdf5", skyInk: "#4a86c4",
  peach: "#f9c9a4", peachInk: "#d4864a",
  rose: "#f7b8bd", roseInk: "#d76b78",
  butter: "#f7dfa0", butterInk: "#c99a2e",
  good: "#17a07a", warn: "#c9902a", bad: "#dd6670",
  ink: "#1a1d26", muted: "#6f7583", faint: "#9aa0ad",
  line: "#eeeff5", ground: "#f7f7fc",
  /** The months before Crestline: a warm slate, never a grey void. */
  slate: "#d2d6e0",
} as const;

export const FONT = "Inter, system-ui, sans-serif";
export const DISPLAY = "'Plus Jakarta Sans', system-ui, sans-serif";

/** A pastel-to-ink gradient. Horizontal for bar charts that run sideways. */
export function grad(from: string, to: string, horizontal = false) {
  return new echarts.graphic.LinearGradient(
    0, horizontal ? 0 : 1, horizontal ? 1 : 0, 0,
    [{ offset: 0, color: from }, { offset: 1, color: to }],
  );
}

export const TOOLTIP = {
  backgroundColor: "#ffffff",
  borderColor: "#e7e8f0",
  borderWidth: 1,
  padding: [11, 14] as [number, number],
  textStyle: { color: C.ink, fontSize: 12.5, fontFamily: FONT },
  extraCssText: "border-radius:14px; box-shadow:0 18px 40px -14px rgba(26,29,38,.22);",
};

export const AXIS_LABEL = { color: C.faint, fontSize: 11.5, fontFamily: FONT };
export const SPLIT_LINE = { lineStyle: { color: C.line, type: "dashed" as const } };
export const NO_LINE = { lineStyle: { color: "transparent" } };

export const CATEGORY_AXIS = {
  axisLine: NO_LINE,
  axisTick: { show: false },
  axisLabel: { fontSize: 12.5, color: C.ink, fontWeight: 600, fontFamily: FONT },
};

export const VALUE_AXIS = {
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: SPLIT_LINE,
  axisLabel: AXIS_LABEL,
};

export const LEGEND = {
  top: 2,
  left: 0,
  icon: "roundRect",
  itemWidth: 11,
  itemHeight: 11,
  itemGap: 18,
  textStyle: { color: C.muted, fontSize: 12, fontFamily: FONT },
};

/** A soft drop shadow under a bar, tinted to the bar's own hue. */
export const softShadow = (rgba: string) => ({
  shadowBlur: 16,
  shadowColor: rgba,
  shadowOffsetY: 5,
});

/**
 * ECharts hands every callback one wide param object and types it as such.
 * We only ever read a few fields, so the callbacks are declared `(p: unknown)`
 * — which satisfies ECharts' signature by contravariance — and narrowed here.
 */
export interface CbParam {
  dataIndex: number;
  value: number;
  name: string;
  data: unknown;
  seriesName: string;
  axisValue: string;
  marker: string;
}

export const cb = (p: unknown): CbParam => p as CbParam;
export const cbs = (p: unknown): CbParam[] => p as CbParam[];

/**
 * THE ONE CAST ON THE SITE, AND WHY.
 *
 * ECharts' published types under-declare its own runtime: `label.color`,
 * `itemStyle.borderColor` and several other style fields accept a callback at
 * runtime but are typed as plain strings, and `markPoint.data` demands a `name`
 * it never uses. Rather than scatter a cast per property, every chart builds a
 * plain option object and passes it through here once.
 */
export const asOption = (option: Record<string, unknown>): echarts.EChartsOption =>
  option as echarts.EChartsOption;

/**
 * ONE FILL FOR EVERY BAR ON THE SITE.
 *
 * The first cut ran each gradient from its pastel all the way to its ink, which
 * on a 40px bar reads as a saturated slab and fights the sheet it sits on. Each
 * pastel now deepens only to its own mid tone: enough shape to stop the bar
 * looking flat, soft enough that six of them on one screen stay quiet.
 *
 * Series meaning is fixed across every chart, so a colour means the same thing
 * on the ninth chart as it did on the first:
 *   sky    money coming in, the client, O2C
 *   peach  money going out, vendors, P2P
 *   lav    capital held between the two
 *   mint   released, improved, inside terms
 *   rose   late, past terms, funded by us
 *   butter waiting, built but not yet billable
 */
const MID: Record<string, string> = {
  [C.sky]: "#80b4e9",
  [C.mint]: "#75cea9",
  [C.peach]: "#f0ac78",
  [C.rose]: "#ef929a",
  [C.lav]: "#9b90e3",
  [C.butter]: "#eeca6f",
  [C.slate]: "#bcc2cf",
};

export function fill(pastel: string, horizontal = false) {
  return grad(pastel, MID[pastel] ?? pastel, horizontal);
}

/** The washed version, for a band or an area behind the data. */
export const WASH: Record<string, string> = {
  [C.sky]: "rgba(165,205,245,.22)",
  [C.mint]: "rgba(159,224,197,.26)",
  [C.peach]: "rgba(249,201,164,.24)",
  [C.rose]: "rgba(247,184,189,.24)",
  [C.lav]: "rgba(184,176,238,.24)",
  [C.butter]: "rgba(247,223,160,.26)",
  [C.slate]: "rgba(210,214,224,.30)",
};

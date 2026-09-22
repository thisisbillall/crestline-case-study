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
  /*
    A GRAPHITE RAMP AND ONE ACCENT.

    Six pastels meant every chart arrived in a different key and none of them
    meant anything. The series scale is now four steps of graphite, which
    separate on lightness rather than on hue, so a stack reads in order and a
    page of charts reads as one system.

    Green is the only accent and it always means the same thing: better, inside
    terms, released, since. Rose appears only where something is genuinely late
    or past an agreed line, and never as decoration.
  */
  g1: "#3b4150",
  g2: "#6f7787",
  g3: "#a5abb9",
  g4: "#d6dae2",

  green: "#2f9e78",
  greenSoft: "#8ccbaf",
  greenWash: "rgba(140,203,175,.20)",

  risk: "#bf6f79",
  riskSoft: "#e2a5ab",
  riskWash: "rgba(226,165,171,.20)",

  ink: "#1a1d26",
  muted: "#6f7583",
  faint: "#9aa0ad",
  line: "#eeeff5",
  ground: "#f7f7fc",
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
  [C.g1]: "#2d323e",
  [C.g2]: "#5d6473",
  [C.g3]: "#939aa9",
  [C.g4]: "#c5cad4",
  [C.green]: "#268665",
  [C.greenSoft]: "#72bd9c",
  [C.risk]: "#a85a64",
  [C.riskSoft]: "#d68f96",
};

export function fill(pastel: string, horizontal = false) {
  return grad(pastel, MID[pastel] ?? pastel, horizontal);
}

/** The washed version, for a band or an area behind the data. */
export const WASH: Record<string, string> = {
  [C.g1]: "rgba(59,65,80,.10)",
  [C.g2]: "rgba(111,119,135,.12)",
  [C.g3]: "rgba(165,171,185,.16)",
  [C.g4]: "rgba(214,218,226,.30)",
  [C.green]: C.greenWash,
  [C.greenSoft]: C.greenWash,
  [C.risk]: C.riskWash,
  [C.riskSoft]: C.riskWash,
};

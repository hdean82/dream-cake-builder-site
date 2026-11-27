// The promo's timeline, shared by the 3D renderer and the composer.
export const FPS = 30, W = 1080, H = 1920, DURATION = 40;
// Scenes, in seconds.
export const S = { hook: [0, 4.5], ask: [4.5, 8], build: [8, 17], send: [17, 24], proof: [24, 29], spin: [29, 35], end: [35, 40] };
// The Blush Lambeth, built up one detail at a time.
export const STAGES = [
  { key: 'tiers', label: 'Pick your tiers' },
  { key: 'colors', label: 'Choose the colors' },
  { key: 'borders', label: 'Pipe the borders' },
  { key: 'swags', label: 'Add Lambeth swags' },
  { key: 'bows', label: 'Tie on the bows' },
  { key: 'final', label: 'Finish with roses' },
];
export const STAGE_LEN = (S.build[1] - S.build[0]) / STAGES.length;

// Which cake picture (stage + angle in tenths of a degree) a moment of the video shows, or null.
export function cakeAt(t) {
  const q = a => Math.round((((a % 360) + 360) % 360) * 2) / 2; // half-degree steps
  if (t >= S.ask[0] + 0.4 && t < S.build[0]) return { stage: 'final', angle: q(-30 + (t - S.ask[0]) * 18) };
  if (t >= S.build[0] && t < S.build[1]) {
    const i = Math.min(STAGES.length - 1, Math.floor((t - S.build[0]) / STAGE_LEN));
    return { stage: STAGES[i].key, angle: q(-20 + (t - S.build[0]) * 14) };
  }
  if (t >= S.send[0] && t < S.send[0] + 0.9) return { stage: 'final', angle: q(-20 + (S.build[1] - S.build[0]) * 14) };
  if (t >= S.spin[0] && t < S.spin[1]) return { stage: 'final', angle: q(-40 + (t - S.spin[0]) * 60) };
  return null;
}
// The previous stage too, for a short crossfade when the cake changes.
export function cakePrevAt(t) {
  if (t < S.build[0] + STAGE_LEN || t >= S.build[1]) return null;
  const k = (t - S.build[0]) / STAGE_LEN, i = Math.floor(k), f = k - i;
  if (f > 0.2) return null;
  const c = cakeAt(t);
  return { stage: STAGES[i - 1].key, angle: c.angle, mix: 1 - f / 0.2 };
}
// Every picture the video needs, grouped by stage.
export function shotList() {
  const need = {};
  const add = c => { if (c) (need[c.stage] ||= new Set()).add(c.angle); };
  for (let f = 0; f < DURATION * FPS; f++) { const t = f / FPS; add(cakeAt(t)); add(cakePrevAt(t)); }
  add({ stage: 'final', angle: 0 }); // the still used on the phone and the proof
  return Object.fromEntries(Object.entries(need).map(([k, v]) => [k, [...v].sort((a, b) => a - b)]));
}
export const frameName = (stage, angle) => `${stage}_${String(Math.round(angle * 10)).padStart(4, '0')}.webp`;

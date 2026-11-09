import { writeFileSync } from "node:fs";
import * as k from "./iso-kit.mjs";

const WIDTH = 460;
const HEIGHT = 480;

const PLATE = { x: -100, y: -84, w: 210, d: 242, r: 10 };
const PLATE_H = 10;
const FOOT_H = 5;

const CASE = { x: -54, y: -62, w: 108, d: 124, r: 9 };
const FRONT = CASE.y + CASE.d;
const SIDE = CASE.x + CASE.w;
const PLINTH_H = 5;
const TOP = 176;
const SEAM = FRONT - 12;

const BEZEL = { x0: -42, x1: 42, z0: 74, z1: 162, r: 7, depth: 1.8 };
const CRT = { x0: -35, x1: 35, z0: 86, z1: 150, r: 9, depth: 5 };
const GLASS_Y = FRONT - BEZEL.depth - CRT.depth;
const CRT_MID = (CRT.z0 + CRT.z1) / 2;
const SLOT = { x0: 12, x1: 44, z0: 40, z1: 44.5, r: 2.2, depth: 4 };

const KB = { x: -76, y: 84, w: 152, d: 58, r: 4 };
const KB_Z = 1.6;
const KB_TOP = 8.6;
const U = 9.2;
const KEYS_X = -U * 7.5;
const KEYS_Y = 88.5;

const ROWS = [
  [["`", 1], ["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1], ["-", 1], ["=", 1], ["Backspace", 2]],
  [["Tab", 1.5], ["q", 1], ["w", 1], ["e", 1], ["r", 1], ["t", 1], ["y", 1], ["u", 1], ["i", 1], ["o", 1], ["p", 1], ["[", 1], ["]", 1], ["\\", 1.5]],
  [["CapsLock", 1.75], ["a", 1], ["s", 1], ["d", 1], ["f", 1], ["g", 1], ["h", 1], ["j", 1], ["k", 1], ["l", 1], [";", 1], ["'", 1], ["Enter", 2.25]],
  [["Shift", 2.25], ["z", 1], ["x", 1], ["c", 1], ["v", 1], ["b", 1], ["n", 1], ["m", 1], [",", 1], [".", 1], ["/", 1], ["ShiftRight", 2.75]],
  [["Alt", 1.5], ["Meta", 1.5], [" ", 9], ["NumpadEnter", 1.5], ["AltRight", 1.5]],
];
const ROW_H = [5.6, 5.2, 4.8, 4.4, 4];

const PORT = { y: 28, z: 9 };
const COIL = { x: 80, z: 3.6, r: 3.2, from: 44, to: 84, turns: 17 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(CASE, 0, TOP)],
  WIDTH,
  HEIGHT,
  { pad: 8, azimuth: 56 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flat = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const onFront = (points, y = FRONT) => k.pathOf(points.map(([x, z]) => at([x, y, z])));
const sideSlot = (y, z0, z1, half = 0.8) => k.pathOf(k.roundedPlan({ x: y - half, y: z0, w: half * 2, d: z1 - z0, r: half }, 4).map(([u, z]) => at([SIDE, u, z])), true);

let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "pc-well", inside = "") {
  const id = `pc-clip-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops = [];
  const sides = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
  });
  const shape = flat(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    `<path class="iso-top" d="${tops.join("")}"/>`,
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>` : "")),
    `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    inside,
    `</g>`,
    `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const label = { x: -88, y: 144, w: 40, d: 9, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L([30, 22].map((w, i) => k.lineOnTop([label.x + 4, label.y + 3 + i * 3], [label.x + 4 + w, label.y + 3 + i * 3], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + label.w - 3, label.y + label.d / 2, 0.8])], { size: 0.45 }));
  return out.join("");
}

function screen() {
  const lines = [];
  for (let z = CRT.z0 + 1.2; z < CRT.z1; z += 1.6) lines.push(`M${CRT.x0} ${(-z).toFixed(1)}H${CRT.x1}`);
  const glow = flat(-26, CRT.z0 + 8, 26, CRT.z1 - 8, 22, 10);
  const textX = CRT.x0 + 7;
  const crt = [
    `<path class="pc-glow" d="${glow}"/>`,
    `<path class="pc-scan" d="${lines.join("")}"/>`,
    `<text class="pc-text" x="${textX}" y="${-(CRT.z1 - 14)}" font-size="4.6" opacity=".55">tushin@mac:~$</text>`,
    `<text class="pc-text" x="${textX}" y="${-(CRT.z1 - 24)}" font-size="4.6">&gt; whoami</text>`,
    `<g data-part="idle">`,
    `<text class="pc-text" x="${textX}" y="${-(CRT.z1 - 36)}" font-size="6.2" font-weight="600">software</text>`,
    `<text class="pc-text" x="${textX}" y="${-(CRT.z1 - 45)}" font-size="6.2" font-weight="600">engineer</text>`,
    `<rect class="pc-cursor" x="${textX + 31}" y="${-(CRT.z1 - 45) - 5}" width="3.4" height="6"/>`,
    `</g>`,
    `<g data-part="typed" style="display:none">`,
    `<text class="pc-text" data-part="typed1" x="${textX}" y="${-(CRT.z1 - 37)}" font-size="6.2" font-weight="600">&gt; </text>`,
    `<text class="pc-text" data-part="typed2" x="${textX + 4.4}" y="${-(CRT.z1 - 46)}" font-size="6.2" font-weight="600"></text>`,
    `<rect class="pc-cursor" data-part="typedcursor" x="${textX + 8}" y="${-(CRT.z1 - 37) - 5}" width="3.4" height="6"/>`,
    `</g>`,
  ].join("");
  const back = [
    `<g data-part="crt" transform="">${crt}</g>`,
    `<path class="pc-beam" data-part="beam" d="M${CRT.x0 + 4} ${-CRT_MID}H${CRT.x1 - 4}" style="opacity:0"/>`,
    `<circle class="pc-dot" data-part="dot" cx="0" cy="${-CRT_MID}" r="1.4" style="opacity:0"/>`,
    `<path class="iso-line" data-tone="lo" d="M${CRT.x0 + 6} ${-(CRT.z1 - 16)}Q${CRT.x0 + 7} ${-(CRT.z1 - 7)} ${CRT.x0 + 16} ${-(CRT.z1 - 6)}"/>`,
  ].join("");
  return recess(BEZEL, FRONT, "", "pc-bezel", recess(CRT, FRONT - BEZEL.depth, back, "pc-glass"));
}

function computer() {
  const out = [`<path class="iso-halo" d="${k.haloOf(CASE, 0, 8, P)}"/>`];
  out.push(S(k.slabOf(k.insetPlan(CASE, 3), 0, PLINTH_H, P, 8), { tone: "lo" }));
  out.push(S(k.slabOf(CASE, PLINTH_H, TOP - PLINTH_H, P, 8, 1.6), { tone: "mid" }));
  const handle = { x: -42, y: CASE.y + 7, w: 84, d: 11, r: 5.5 };
  out.push(L(k.planOutline(handle, TOP, P, 8), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(handle, 2.2), TOP, P, 8), { tone: "faint" }));
  out.push(L(Array.from({ length: 7 }, (_, i) => k.planOutline({ x: -34, y: CASE.y + 27.3 + i * 3.4, w: 68, d: 1.4, r: 0.7 }, TOP, P, 4)).join(""), { tone: "faint" }));
  out.push(L(k.lineOnTop([CASE.x, SEAM], [SIDE, SEAM], TOP, P) + k.segment([SIDE, SEAM, TOP], [SIDE, SEAM, PLINTH_H], P), { tone: "lo" }));
  const rowOf = (from, to) => Array.from({ length: Math.floor((to - from) / 3.2 + 1e-9) + 1 }, (_, i) => from + i * 3.2);
  out.push(L(rowOf(CASE.y + 10, CASE.y + 52).map((y) => sideSlot(y, TOP - 48, TOP - 14)).join(""), { tone: "faint" }));
  out.push(L(rowOf(CASE.y + 10, CASE.y + 40).map((y) => sideSlot(y, 20, 30)).join(""), { tone: "faint" }));
  out.push(`<g transform="${planeOf(FRONT)}"><path class="iso-line" data-tone="faint" d="${flat(CASE.x + 4, PLINTH_H + 4, SIDE - 4, TOP - 4, 5)}"/></g>`);
  out.push(screen());
  out.push(recess(SLOT, FRONT, `<path class="iso-line" data-tone="lo" d="M${SLOT.x0} ${-(SLOT.z0 + 1.6)}H${SLOT.x1}"/>`, "pc-dark"));
  out.push(D([at([SLOT.x1 + 4, FRONT, SLOT.z0 - 1])], { size: 0.5, tone: "mid" }));
  out.push(`<g transform="${planeOf(FRONT)}">${L(Array.from({ length: 9 }, (_, i) => flat(-46.7 + i * 3, 42, -45.3 + i * 3, 54, 0.7, 4)).join(""), { tone: "lo" })}</g>`);
  out.push(`<g data-part="led">${D([at([-46, FRONT, 36])], { size: 0.8, tone: "hi" })}</g>`);
  out.push(rocker());
  out.push(port());
  return `<g class="pc-computer" data-part="computer">${out.join("")}</g>`;
}

function rocker() {
  const y = CASE.y + 8;
  const out = [S(k.slabOf({ x: SIDE, y, w: 1.2, d: 12, r: 1 }, 12, 15, P, 3), { tone: "mid" })];
  const half = (z, proud) => S(k.slabOf({ x: SIDE + 1.2, y: y + 1.5, w: proud ? 2.4 : 0.8, d: 9, r: 0.6 }, z, 5.6, P, 2), { tone: "mid" });
  out.push(`<g data-rocker="on">${half(13, true)}${half(20.4, false)}</g>`);
  out.push(`<g data-rocker="off" style="display:none">${half(20.4, true)}${half(13, false)}</g>`);
  return out.join("");
}

function port() {
  const out = [];
  out.push(S(k.slabOf({ x: SIDE - 0.4, y: PORT.y - 1, w: 1.4, d: 10, r: 1 }, PORT.z - 1, 9, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf({ x: SIDE + 1, y: PORT.y, w: 4.4, d: 8, r: 1 }, PORT.z, 7, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: SIDE + 5.4, y: PORT.y + 2, w: 5, d: 4, r: 1.6 }, PORT.z + 1.5, 4, P, 4), { tone: "mid" }));
  out.push(D([at([SIDE + 3.2, PORT.y + 1.6, PORT.z + 7]), at([SIDE + 3.2, PORT.y + 6.4, PORT.z + 7])], { size: 0.4 }));
  return out.join("");
}

const keyList = [];
function keyboard() {
  const out = [`<path class="iso-halo" d="${k.haloOf(KB, 0, 4, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(KB, 8))) out.push(S(k.cylinder(x, y, 2.8, 0, KB_Z, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(KB, KB_Z, KB_TOP - KB_Z, P, 6, 1), { tone: "mid" }));
  const well = { x: KEYS_X - 1.4, y: KEYS_Y - 1.4, w: U * 15 + 2.8, d: U * 5 + 2.8, r: 2 };
  out.push(L(k.planOutline(well, KB_TOP, P, 4), { tone: "lo" }));
  out.push(D([at([KB.x + 4, KB.y + 2.4, KB_TOP]), at([KB.x + KB.w - 4, KB.y + 2.4, KB_TOP])], { size: 0.45 }));
  ROWS.forEach((row, r) => {
    let x = KEYS_X;
    for (const [code, width] of row) {
      const plan = { x: x + 0.7, y: KEYS_Y + r * U + 0.7, w: width * U - 1.4, d: U - 1.4, r: 1.4 };
      const h = ROW_H[r];
      const index = keyList.length;
      keyList.push(code);
      const dish = code === " " ? k.planOutline(k.insetPlan(plan, 1.8), KB_TOP + h, P, 3) : k.planOutline(k.insetPlan(plan, 1.6), KB_TOP + h, P, 3);
      out.push(`<g class="pc-key" data-key="${index}">${S(k.slabOf(plan, KB_TOP, h, P, 3, 0.4), { tone: "mid", crease: "faint" })}${L(dish, { tone: "faint" })}</g>`);
      x += width * U;
    }
  });
  out.push(S(k.slabOf({ x: KB.x + KB.w, y: 90, w: 4, d: 4, r: 1.5 }, 2.5, 4, P, 4), { tone: "mid" }));
  return out.join("");
}

function cable() {
  const out = [];
  const curve = (points) => k.pathOf(points.map((point) => at(point)));
  const start = [COIL.x + COIL.r, COIL.from, COIL.z];
  const end = [COIL.x + COIL.r, COIL.to, COIL.z];
  out.push(`<path class="iso-line pc-cord" data-tone="mid" d="${curve([[SIDE + 10.4, PORT.y + 4, PORT.z + 3.5], [SIDE + 14, PORT.y + 6, PORT.z + 2.4], [SIDE + 17, PORT.y + 9.5, PORT.z - 1], [SIDE + 19.6, PORT.y + 13, COIL.z + 1.6], start])}"/>`);
  const spring = k.coil(COIL.from, COIL.to, [COIL.x, COIL.z], COIL.r, COIL.turns, "y", P);
  out.push(L(spring.back, { tone: "lo" }), L(spring.front, { tone: "mid" }));
  out.push(`<path class="iso-line pc-cord" data-tone="mid" d="${curve([end, [COIL.x + 2.6, COIL.to + 3, COIL.z + 0.2], [KB.x + KB.w + 6.4, 91.4, 4.4], [KB.x + KB.w + 4, 92, 4.5]])}"/>`);
  return out.join("");
}

function mouse() {
  const m = { x: 88, y: 98, w: 22, d: 32, r: 9 };
  const out = [`<path class="iso-halo" d="${k.haloOf(m, 0, 4, P)}"/>`];
  out.push(S(k.slabOf(m, 0, 6.5, P, 8, 1.2), { tone: "mid" }));
  out.push(L(k.lineOnTop([m.x + 1.5, m.y + 12], [m.x + m.w - 1.5, m.y + 12], 6.5, P) + k.lineOnTop([m.x + m.w / 2, m.y + 12], [m.x + m.w / 2, m.y + 3], 6.5, P), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(m, 2.4), 6.5, P, 6), { tone: "faint" }));
  out.push(S(k.cylinder(m.x + m.w / 2, m.y + 1.2, 2, 2.4, 2.4, P, 12), { tone: "lo" }));
  const curve = (points) => k.pathOf(points.map((point) => at(point)));
  out.push(`<path class="iso-line pc-cord" data-tone="mid" d="${curve([[m.x + 11, m.y + 1.2, 3.6], [m.x + 7, m.y - 6, 1.6], [KB.x + KB.w + 12, 86, 1.6], [KB.x + KB.w + 6.4, 88.4, 3.4], [KB.x + KB.w + 4, 90.5, 4]])}"/>`);
  return out.join("");
}

function badge() {
  return `<g transform="${planeOf(FRONT)}">${L(flat(-46, 27, -24, 34, 1.6), { tone: "lo" })}${L("M-43 29.6H-27M-43 31.6H-33", { tone: "faint", free: true })}</g>`;
}

const svg = k.figureSvg({
  standalone: "dark",
  width: WIDTH,
  height: HEIGHT,
  label:
    "An isometric 1990s all-in-one Macintosh on a bench plate: a beige CRT case with a bezel and a screen showing a terminal prompt, a floppy slot and drive indicator below it, vents on the top and side, a keyboard joined to the side port by a coiled cord, and a mouse.",
  body: [plate(), computer(), badge(), keyboard(), cable(), mouse()],
});


const css = `<style>
.pc-well{fill:var(--anatomy-shade-1)}
.pc-bezel{fill:var(--anatomy-top)}
.pc-dark{fill:var(--anatomy-shade-0)}
.pc-glass{fill:var(--anatomy-lit-shade)}
.pc-glow{fill:var(--anatomy-lit);opacity:.08;filter:blur(6px)}
.pc-scan{fill:none;stroke:var(--anatomy-faint);stroke-width:.5px;vector-effect:non-scaling-stroke;opacity:.7}
.pc-text{fill:var(--anatomy-lit);font-family:var(--anatomy-mono);letter-spacing:.02em}
.pc-cursor{fill:var(--anatomy-lit);animation:pc-blink 1.06s steps(1,end) infinite}
.pc-beam,.pc-dot{display:none}
.pc-cord{stroke-width:1.1px}
.pc-key{cursor:pointer}
.pc-key[data-down] .iso-edge{stroke:var(--anatomy-hi)}
@keyframes pc-blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.pc-cursor{animation:none}}
</style>`;
const down = k.axisVector(P, [0, 0, -1]).map((v) => (v * 2.2).toFixed(2)).join(" ");
const out = svg.replace(/<svg([^>]*)>/, (m, attrs) => `<svg${attrs} data-down="${down}">` + css);
writeFileSync(new URL("../../public/mac-classic.svg", import.meta.url), out);
console.log("wrote public/mac-classic.svg", out.length);

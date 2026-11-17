// Cena three.js do mapa do Brasil — reaproveita o GLB da BLT (mesma geometria dos estados).
// Pins, rotas, halos e sinais da BLT ficam ocultos: as conexões da iMédicos são desenhadas aqui,
// partindo do Sul para pontos nas cinco regiões. Conexões ilustrativas.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export type MapFrame = { x: number; y: number; h: number }; // centro (px no canvas) e altura do mapa (px)
export type MapTargets = {
  appear: number; // 0–1 o mapa surge por baixo do notebook
  shift: number; // 0–1 o mapa desliza para a direita
  routes: number; // 0–1 conexões em sequência
};

/** Origem no Sul e destinos (UF de referência de cada ponto). */
const ORIGIN = "SC";
const DESTS = [
  { uf: "RS", region: "S" },
  { uf: "MG", region: "SE" },
  { uf: "MT", region: "CO" },
  { uf: "PE", region: "NE" },
  { uf: "AM", region: "N" },
];

const C = {
  top: new THREE.Color("#F3EAE2"),
  side: new THREE.Color("#D3C1B3"),
  south: new THREE.Color("#E9D3C3"),
  southSide: new THREE.Color("#C9A08A"),
  dest: new THREE.Color("#E7C9B4"),
  origin: new THREE.Color("#8C4A2B"),
  base: new THREE.Color("#FFFFFF"),
  baseSide: new THREE.Color("#EAE3DC"),
  route: new THREE.Color("#8C4A2B"),
  marker: new THREE.Color("#5C2C17"),
};

const FOV = 24;
const DIST = 6.2;

function plateMaterial(top: THREE.Color, side: THREE.Color) {
  const uniforms = {
    uTop: { value: top.clone() },
    uSide: { value: side.clone() },
    uTopTarget: { value: top.clone() },
    uSideTarget: { value: side.clone() },
    uMix: { value: 0 },
  };
  const m = new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vNObj;")
      .replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\nvNObj = objectNormal;");
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vNObj;\nuniform vec3 uTop; uniform vec3 uSide; uniform vec3 uTopTarget; uniform vec3 uSideTarget; uniform float uMix;",
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float isTop = smoothstep(0.9, 0.99, normalize(vNObj).y);
        vec3 a = mix(uSide, uTop, isTop);
        vec3 b = mix(uSideTarget, uTopTarget, isTop);
        diffuseColor.rgb = mix(a, b, uMix);`,
      );
  };
  m.customProgramCacheKey = () => "imed-plate";
  return { m, uniforms };
}

function routeMaterial() {
  const uniforms = { uReveal: { value: 0 }, uFlow: { value: 0 }, uDashes: { value: 14 } };
  const m = new THREE.MeshBasicMaterial({ color: C.route, transparent: true });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vU;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvU = uv.x;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vU;\nuniform float uReveal; uniform float uFlow; uniform float uDashes;")
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        if (vU > uReveal) discard;
        float d = fract(vU * uDashes - uFlow);
        if (d > 0.62) discard;`,
      );
  };
  m.customProgramCacheKey = () => "imed-route";
  return { m, uniforms };
}

export async function createMap3D(canvas: HTMLCanvasElement, opts: { glb: string; motion: boolean }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(opts.glb);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.set(0, 0, DIST);

  const sun = new THREE.DirectionalLight(0xfffdfb, 2.1);
  sun.position.set(-1.8, 3.2, 4.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -2;
  sun.shadow.camera.right = 2;
  sun.shadow.camera.top = 2;
  sun.shadow.camera.bottom = -2;
  sun.shadow.bias = -0.0005;
  sun.shadow.radius = 4;
  const hemi = new THREE.HemisphereLight(0xfffaf5, 0xd6c8bc, 1.05);
  scene.add(sun, hemi);

  // layout (posição na tela) > tilt (inclinação) > orient (glTF Y-up → câmera de cima) > glTF
  const layout = new THREE.Group();
  const tilt = new THREE.Group();
  const orient = new THREE.Group();
  orient.rotation.x = Math.PI / 2;
  scene.add(layout);
  layout.add(tilt);
  tilt.add(orient);

  const root = gltf.scene;
  const rig = root.getObjectByName("MAPA_Rig") ?? root;
  rig.quaternion.identity(); // a inclinação é nossa
  root.updateMatrixWorld(true);

  type StateInfo = {
    node: THREE.Object3D;
    u: ReturnType<typeof plateMaterial>["uniforms"];
    region: string;
    base: THREE.Vector3;
    scaleY: number;
    delay: number; // 0 (Sul) → 1 (Norte): ordem da montagem
    spin: number;
  };
  const states = new Map<string, StateInfo>();
  let baseNode: THREE.Object3D | null = null;
  const baseScale = new THREE.Vector3(1, 1, 1);
  const hide: THREE.Object3D[] = [];

  root.traverse((o) => {
    const ud = o.userData ?? {};
    const tipo = ud.blt_tipo as string | undefined;
    if (tipo && ["pin", "ponto", "hub", "halo", "rota", "sinal"].includes(tipo)) hide.push(o);
    if (!(o as THREE.Mesh).isMesh) return;
    const mesh = o as THREE.Mesh;
    // nó nomeado mais próximo (o gltfpack pendura a malha em um filho)
    let named: THREE.Object3D | null = mesh;
    while (named && !named.userData?.blt_tipo) named = named.parent;
    const t = named?.userData?.blt_tipo as string | undefined;
    const matName = (mesh.material as THREE.Material)?.name;
    (mesh.material as THREE.Material)?.dispose?.();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (t === "estado" || matName === "UF") {
      const region = named!.userData.regiao as string;
      const uf = named!.userData.uf as string;
      const south = region === "S";
      const { m, uniforms } = plateMaterial(south ? C.south : C.top, south ? C.southSide : C.side);
      mesh.material = m;
      states.set(uf, {
        node: named!,
        u: uniforms,
        region,
        base: named!.position.clone(),
        scaleY: named!.scale.y,
        delay: 0,
        spin: 0,
      });
    } else if (t === "base" || matName === "BASE") {
      const { m } = plateMaterial(C.base, C.baseSide);
      mesh.material = m;
      baseNode = named ?? mesh;
      baseScale.copy(baseNode.scale);
    } else {
      mesh.visible = false;
    }
  });
  hide.forEach((o) => (o.visible = false));

  // sombra suave sob a bandeja
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.08 }));
  catcher.rotation.x = -Math.PI / 2;
  catcher.position.y = -0.052;
  catcher.receiveShadow = true;
  rig.add(catcher);

  orient.add(root);

  // centro de cada UF no espaço do rig (Y para cima, norte em -Z)
  root.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const centerOf = (uf: string) => {
    const s = states.get(uf);
    if (!s) return new THREE.Vector3();
    box.setFromObject(s.node);
    const c = box.getCenter(new THREE.Vector3());
    c.y = box.max.y;
    // box em coordenadas de mundo (com orient/tilt na identidade nesse instante? não) → converte
    return rig.worldToLocal(c);
  };
  // garante que orient/tilt/layout estejam na identidade ao medir
  const savedOrient = orient.rotation.x;
  orient.rotation.x = 0;
  scene.updateMatrixWorld(true);
  const pO = centerOf(ORIGIN);
  const pts = DESTS.map((d) => centerOf(d.uf));
  // montagem em onda: estados mais próximos do Sul surgem primeiro
  {
    let maxD = 0;
    const dist = new Map<string, number>();
    states.forEach((st, uf) => {
      const c = centerOf(uf);
      const d = Math.hypot(c.x - pO.x, c.z - pO.z);
      dist.set(uf, d);
      maxD = Math.max(maxD, d);
    });
    let k = 0;
    states.forEach((st, uf) => {
      st.delay = (dist.get(uf) ?? 0) / (maxD || 1);
      st.spin = ((k++ * 37) % 11) / 11 - 0.5; // leve rotação individual, determinística
    });
  }
  orient.rotation.x = savedOrient;

  // ---------- marcadores e rotas ----------
  const markerGeo = new THREE.CylinderGeometry(1, 1, 1, 40);
  const ringGeo = new THREE.RingGeometry(0.8, 1, 48);
  const matMarker = new THREE.MeshStandardMaterial({ color: C.marker, roughness: 0.4 });
  const matOrigin = new THREE.MeshStandardMaterial({ color: C.origin, roughness: 0.4, emissive: C.origin, emissiveIntensity: 0.15 });
  const matRing = new THREE.MeshBasicMaterial({ color: C.origin, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });

  const origin = new THREE.Group();
  const originDisc = new THREE.Mesh(markerGeo, matOrigin);
  originDisc.scale.set(0.034, 0.02, 0.034);
  originDisc.position.y = 0.01;
  originDisc.castShadow = true;
  const pulse = new THREE.Mesh(ringGeo, matRing);
  pulse.rotation.x = -Math.PI / 2;
  pulse.position.y = 0.022;
  origin.add(originDisc, pulse);
  origin.position.copy(pO);
  rig.add(origin);

  const arrowGeo = new THREE.ConeGeometry(0.022, 0.06, 20);
  arrowGeo.rotateX(Math.PI / 2); // aponta para +Z (lookAt)
  const matArrow = new THREE.MeshBasicMaterial({ color: C.route });

  type Route = {
    curve: THREE.QuadraticBezierCurve3;
    u: ReturnType<typeof routeMaterial>["uniforms"];
    arrow: THREE.Mesh;
    marker: THREE.Mesh;
    uf: string;
  };
  const routes: Route[] = pts.map((p, i) => {
    const a = pO.clone().add(new THREE.Vector3(0, 0.02, 0));
    const b = p.clone().add(new THREE.Vector3(0, 0.02, 0));
    const mid = a.clone().lerp(b, 0.5);
    const len = a.distanceTo(b);
    mid.y += Math.max(0.12, len * 0.42);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const geo = new THREE.TubeGeometry(curve, 96, 0.0075, 8, false);
    const { m, uniforms } = routeMaterial();
    uniforms.uDashes.value = Math.max(4, Math.round(len * 22));
    const tube = new THREE.Mesh(geo, m);
    tube.renderOrder = 3;
    rig.add(tube);

    const arrow = new THREE.Mesh(arrowGeo, matArrow);
    arrow.visible = false;
    rig.add(arrow);

    const marker = new THREE.Mesh(markerGeo, matMarker);
    marker.position.copy(p).add(new THREE.Vector3(0, 0.008, 0));
    marker.scale.setScalar(0.0001);
    marker.castShadow = true;
    rig.add(marker);
    return { curve, u: uniforms, arrow, marker, uf: DESTS[i].uf };
  });

  // ---------- estado / layout ----------
  const target: MapTargets = { appear: 0, shift: 0, routes: 0 };
  const cur: MapTargets = { appear: 0, shift: 0, routes: 0 };
  let start: MapFrame = { x: 0, y: 0, h: 100 };
  let end: MapFrame = { x: 0, y: 0, h: 100 };
  let W = 1;
  let H = 1;
  let running = false;
  let raf = 0;
  let last = performance.now();
  let flow = 0;
  let dirty = true;

  const visH = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const MAP_UNITS = 2.05; // altura aproximada do Brasil no modelo (unidades)

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutBack = (t: number) => {
    const c1 = 1.7;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  const seg = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  function resize() {
    W = canvas.clientWidth || 1;
    H = canvas.clientHeight || 1;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    dirty = true;
  }

  function apply(dt: number) {
    const k = opts.motion ? 1 - Math.exp(-dt * 9) : 1;
    let moving = false;
    for (const key of ["appear", "shift", "routes"] as const) {
      const d = target[key] - cur[key];
      if (Math.abs(d) > 0.0005) {
        cur[key] += d * k;
        moving = true;
      } else cur[key] = target[key];
    }

    const visW = visH * (W / H);
    const ap = ease(cur.appear);
    const sh = ease(cur.shift);
    const fx = lerp(start.x, end.x, sh);
    const fy = lerp(start.y, end.y, sh) + (1 - ap) * H * 0.22;
    const fh = lerp(start.h, end.h, sh) * lerp(0.72, 1, ap);
    layout.position.set((fx / W - 0.5) * visW, -(fy / H - 0.5) * visH, lerp(-1.4, 0, ap));
    layout.scale.setScalar((fh / H) * (visH / MAP_UNITS));
    // entra quase de perfil e gira até a vista final
    tilt.rotation.x = lerp(-1.12, -0.6, ap);
    tilt.rotation.z = lerp(0.22, 0, ap) + lerp(0.0, -0.06, sh);
    tilt.rotation.y = lerp(-0.18, 0, ap) + lerp(0.0, -0.08, sh);

    // montagem: cada estado desce do alto e assenta, em onda do Sul para o Norte
    const raw = cur.appear;
    states.forEach((st) => {
      const a0 = st.delay * 0.55;
      const t = seg(raw, a0, a0 + 0.42);
      const e = 1 - Math.pow(1 - t, 3);
      st.node.visible = t > 0.001;
      st.node.position.set(st.base.x, st.base.y + (1 - e) * 1.0, st.base.z);
      st.node.rotation.y = (1 - e) * st.spin * 0.9;
      st.node.scale.y = st.scaleY * (0.25 + 0.75 * e);
    });
    if (baseNode) {
      const b = ease(seg(raw, 0, 0.35));
      baseNode.visible = b > 0.001;
      baseNode.scale.copy(baseScale).multiplyScalar(0.92 + 0.08 * b);
    }
    sun.intensity = lerp(0.9, 2.1, ap);
    hemi.intensity = lerp(0.7, 1.05, ap);

    // origem acende, depois as rotas em sequência
    const r = cur.routes;
    const o = seg(r, 0.0, 0.12);
    originDisc.scale.set(0.034 * easeOutBack(o) + 1e-4, 0.02, 0.034 * easeOutBack(o) + 1e-4);
    const n = routes.length;
    let anyFlow = false;
    routes.forEach((rt, i) => {
      const a = 0.12 + (i * 0.84) / n;
      const b = a + 0.84 / n;
      const t = seg(r, a, b);
      rt.u.uReveal.value = t;
      if (t > 0 && t < 1) {
        const p = rt.curve.getPoint(t);
        const ahead = rt.curve.getPoint(Math.min(1, t + 0.01));
        rt.arrow.position.copy(p);
        rt.arrow.lookAt(rig.localToWorld(ahead.clone()));
        rt.arrow.visible = true;
      } else rt.arrow.visible = false;
      const mk = seg(r, b - 0.03, b + 0.06);
      const s = 0.024 * easeOutBack(mk) + 1e-4;
      rt.marker.scale.set(s, 0.016, s);
      const st = states.get(rt.uf);
      if (st && rt.uf !== "RS") {
        st.u.uTopTarget.value.copy(C.dest);
        st.u.uMix.value = mk;
      }
      if (t >= 1) anyFlow = true;
    });
    const so = states.get(ORIGIN);
    if (so) {
      so.u.uTopTarget.value.copy(new THREE.Color("#D9AE93"));
      so.u.uMix.value = o;
    }

    // fluxo contínuo dos traços (setas curtas percorrendo a rota) e pulso da origem
    if (opts.motion && anyFlow) {
      flow += dt * 0.55;
      routes.forEach((rt) => (rt.u.uFlow.value = rt.u.uReveal.value >= 1 ? flow : 0));
    }
    const pt = opts.motion ? (performance.now() / 1600) % 1 : 0.5;
    const ps = 0.04 + pt * 0.07;
    pulse.scale.setScalar(ps * (o > 0 ? 1 : 0.0001));
    matRing.opacity = 0.55 * (1 - pt) * o;

    return moving || (opts.motion && o > 0);
  }

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const keep = apply(dt);
    renderer.render(scene, camera);
    dirty = false;
    if (running && (keep || dirty)) raf = requestAnimationFrame(frame);
  }
  const kick = () => {
    if (!raf && running) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  resize();
  return {
    setTargets(t: Partial<MapTargets>) {
      Object.assign(target, t);
      kick();
    },
    setFrames(s: MapFrame, e: MapFrame) {
      start = s;
      end = e;
      dirty = true;
      kick();
    },
    resize() {
      resize();
      kick();
    },
    setRunning(on: boolean) {
      running = on;
      if (on) kick();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    renderOnce() {
      apply(1);
      renderer.render(scene, camera);
    },
    dispose() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
    },
  };
}

export type Map3D = Awaited<ReturnType<typeof createMap3D>>;

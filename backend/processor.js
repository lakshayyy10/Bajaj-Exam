
const EDGE_SHAPE = /^([A-Z])->([A-Z])$/;

function analyseEdges(rawList) {
  const invalid = [];
  const dupes = [];
  const dupeFlag = new Set();   // to push each repeat only once
  const accepted = new Set();   // edge keys that made it through
  const parentOf = new Map();   // child -> parent  (first one wins)
  const kidsOf = new Map();     // parent -> array of kids in insertion order
  const pool = new Set();       // every node we've seen in a valid edge

  // trim ,validate
  for (let i = 0; i < rawList.length; i++) {
    const raw = rawList[i];
    if (typeof raw !== "string") { invalid.push(String(raw)); continue; }

    const token = raw.trim();
    if (!token) { invalid.push(raw); continue; }

    const hit = token.match(EDGE_SHAPE);
    if (!hit) { invalid.push(raw); continue; }

    const from = hit[1], to = hit[2];
    if (from === to) { invalid.push(raw); continue; }   // self-loop -> invalid

    const key = from + "->" + to;

    if (accepted.has(key)) {
      if (!dupeFlag.has(key)) { dupes.push(key); dupeFlag.add(key); }
      continue;
    }
    accepted.add(key);

    // dimond / multiparent
    if (parentOf.has(to)) continue;

    parentOf.set(to, from);
    if (!kidsOf.has(from)) kidsOf.set(from, []);
    kidsOf.get(from).push(to);
    pool.add(from);
    pool.add(to);
  }

  // grp into small
  const uf = new Map();
  for (const n of pool) uf.set(n, n);

  function findRep(x) {
    let cur = x;
    while (uf.get(cur) !== cur) cur = uf.get(cur);
    let hop = x;
    while (uf.get(hop) !== cur) {
      const nxt = uf.get(hop);
      uf.set(hop, cur);
      hop = nxt;
    }
    return cur;
  }
  function join(a, b) {
    const ra = findRep(a), rb = findRep(b);
    if (ra !== rb) uf.set(ra, rb);
  }
  for (const [child, parent] of parentOf) join(child, parent);

  const buckets = new Map();
  for (const n of pool) {
    const r = findRep(n);
    if (!buckets.has(r)) buckets.set(r, []);
    buckets.get(r).push(n);
  }

  // hierarchies entry buckets
  const hierarchies = [];
  for (const group of buckets.values()) {
    let realRoot = null;
    for (const n of group) {
      if (!parentOf.has(n)) { realRoot = n; break; }
    }

    if (realRoot === null) {
      const sorted = [...group].sort();
      hierarchies.push({ root: sorted[0], tree: {}, has_cycle: true });
      continue;
    }
    const order = [];
    const stack = [realRoot];
    const seen = new Set([realRoot]);
    while (stack.length) {
      const n = stack.pop();
      order.push(n);
      const kids = kidsOf.get(n) || [];
      for (let j = kids.length - 1; j >= 0; j--) {
        const k = kids[j];
        if (!seen.has(k)) { seen.add(k); stack.push(k); }
      }
    }
    order.reverse();
    const built = new Map();
    const depthAt = new Map();
    for (const n of order) {
      const kids = kidsOf.get(n) || [];
      const inner = {};
      let tallestKid = 0;
      for (const k of kids) {
        inner[k] = built.get(k)[k];
        const dk = depthAt.get(k) || 1;
        if (dk > tallestKid) tallestKid = dk;
      }
      built.set(n, { [n]: inner });
      depthAt.set(n, tallestKid + 1);
    }

    hierarchies.push({
      root: realRoot,
      tree: built.get(realRoot),
      depth: depthAt.get(realRoot)
    });
  }
  let total_trees = 0;
  let total_cycles = 0;
  let pick = null;
  for (const h of hierarchies) {
    if (h.has_cycle) { total_cycles++; continue; }
    total_trees++;
    if (!pick) { pick = h; continue; }
    if (h.depth > pick.depth) pick = h;
    else if (h.depth === pick.depth && h.root < pick.root) pick = h;
  }
  return {
    hierarchies,
    invalid_entries: invalid,
    duplicate_edges: dupes,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root: pick ? pick.root : ""
    }
  };
}
module.exports = { analyseEdges };
if (require.main === module) {
  const sample = [
    "A->B", "A->C", "B->D", "C->E", "E->F",
    "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R",
    "G->H", "G->H", "G->I",
    "hello", "1->2", "A->"
  ];
  console.log(JSON.stringify(analyseEdges(sample), null, 2));
}

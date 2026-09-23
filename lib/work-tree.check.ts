/**
 * ponytail: one assert-style check for work-tree scanner.
 * Run: npx tsx lib/work-tree.check.ts
 */
import assert from "node:assert/strict";

import { getEventsTree, getWorkCategories } from "@/lib/work-tree";

const categories = getWorkCategories();
assert.ok(
  categories.length >= 1,
  "expected at least one scroll-to-explore category",
);
assert.ok(
  categories.every((c, i, arr) => i === 0 || arr[i - 1].order <= c.order),
  "categories must be sorted by folder order",
);
assert.ok(
  categories.some((c) => c.slug === "branding"),
  "expected branding category from `1 Branding`",
);

const branding = categories.find((c) => c.slug === "branding");
assert.ok(
  branding && branding.subsections.length >= 1,
  "branding needs subsections",
);

const events = getEventsTree();
assert.ok(
  events.groups.length >= 1,
  "expected event groups under EVENTS & EXHIBITIONS",
);

console.log(
  `ok — ${categories.length} categories, branding subsections=${branding?.subsections.length}, events=${events.groups.length}`,
);

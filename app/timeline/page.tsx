import type { Metadata } from "next";

import { HorizontalTimeline } from "@/features/timeline/horizontal-timeline";
import { getTimelineEvents } from "@/lib/resume";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Timeline",
  description: "A chronological view of Sugandha Saxena's creative journey.",
  path: "/timeline",
});

export default function TimelinePage() {
  const events = getTimelineEvents();
  return <HorizontalTimeline events={events} />;
}

/**
 * Validates Behance MCP scraper capabilities used by the MCP tools.
 * Run: node scripts/validate-behance-mcp.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { BehanceScraper } = await import(
  pathToFileURL("C:/suggu/tools/behance-mcp-server/dist/scraper.js").href
);
const PROFILE_URL = "https://www.behance.net/saxenasugu7614";
const report = {
  version: "1.0.0",
  testedAt: new Date().toISOString(),
  executablePath:
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  results: {},
};

process.env.PUPPETEER_EXECUTABLE_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const scraper = new BehanceScraper();

async function run(name, fn) {
  const started = Date.now();
  try {
    const data = await fn();
    report.results[name] = {
      ok: true,
      ms: Date.now() - started,
      summary: summarize(name, data),
      sample: truncate(data),
    };
    console.log(`OK  ${name} (${Date.now() - started}ms)`);
  } catch (error) {
    report.results[name] = {
      ok: false,
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
    console.error(`FAIL ${name}:`, error);
  }
}

function summarize(name, data) {
  if (Array.isArray(data)) return { count: data.length };
  if (data && typeof data === "object") {
    return {
      keys: Object.keys(data),
      title: data.title || data.displayName || data.username || undefined,
      imageCount: Array.isArray(data.images) ? data.images.length : undefined,
      tags: data.tags,
      tools: data.tools,
    };
  }
  return {};
}

function truncate(data) {
  try {
    const json = JSON.stringify(data, null, 2);
    if (json.length <= 4000) return data;
    return { truncated: true, preview: json.slice(0, 4000) };
  } catch {
    return { truncated: true, preview: String(data).slice(0, 1000) };
  }
}

await scraper.init();

await run("get_behance_profile_details", () =>
  scraper.getProfileDetails(PROFILE_URL),
);

await run("search_behance_profiles", () =>
  scraper.searchProfiles("Sugandha Saxena", 5),
);

await run("search_behance_projects", () =>
  scraper.searchProjects("Kit Packaging", 5),
);

const profile = report.results.get_behance_profile_details?.sample;
let projectUrl = null;

// Prefer a URL discovered from search; fallback known pattern after search
const projects = report.results.search_behance_projects?.sample;
if (Array.isArray(projects) && projects[0]?.url) {
  projectUrl = projects[0].url;
}

await run("search_behance_images", () =>
  scraper.searchImages("logo visiting card", 5),
);

await run("get_behance_jobs", () => scraper.getJobs(5));

if (projectUrl) {
  await run("get_behance_project_details", () =>
    scraper.getProjectDetails(projectUrl),
  );
} else {
  // Try profile page scrape path: search designer name projects
  await run("search_behance_projects_by_designer", () =>
    scraper.searchProjects("Sugandha Saxena", 10),
  );
  const designerProjects =
    report.results.search_behance_projects_by_designer?.sample;
  if (Array.isArray(designerProjects) && designerProjects[0]?.url) {
    projectUrl = designerProjects[0].url;
    await run("get_behance_project_details", () =>
      scraper.getProjectDetails(projectUrl),
    );
  } else {
    report.results.get_behance_project_details = {
      ok: false,
      ms: 0,
      error: "No project URL discovered to validate details tool",
    };
  }
}

const jobs = report.results.get_behance_jobs?.sample;
if (Array.isArray(jobs) && jobs[0]?.url) {
  await run("get_behance_job_details", () =>
    scraper.getJobDetails(jobs[0].url),
  );
} else {
  report.results.get_behance_job_details = {
    ok: false,
    ms: 0,
    error: "No job URL returned; skipped details test",
  };
}

await scraper.close();

const outDir = join(__dirname, "..", "docs");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "behance-mcp-validation.json");
writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log("Wrote", outPath);

const failed = Object.entries(report.results).filter(([, r]) => !r.ok);
process.exit(failed.length ? 1 : 0);

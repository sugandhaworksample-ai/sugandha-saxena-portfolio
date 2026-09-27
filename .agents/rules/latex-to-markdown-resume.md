# Converting a LaTeX Resume to Markdown/MDX (Next.js Portfolio)

**Executive Summary:** This report details how to transform a LaTeX-based resume into a Next.js/MDX-friendly format. We define exact mappings from LaTeX constructs (headings, lists, emphasis, tables, footnotes, math, custom macros) to Markdown/MDX syntax, preserving semantic data (name, contact, summary, skills, experience, etc.). We propose a comprehensive YAML frontmatter schema (with types and examples) to structure the resume content. A minimal MDX template is provided (with placeholders for user data). We then outline setup steps: installing Node.js/npm, initializing a Next.js project with the `@next/mdx` plugin, and validating the MDX page. We include code commands to initialize Git and push to GitHub (using the CLI). Recommended VS Code extensions and Cursor settings for MDX/frontmatter are listed. A mermaid flowchart illustrates the conversion pipeline (LaTeX → parser → transform rules → MDX → Cursor/Next.js). Finally, a troubleshooting checklist helps verify that Cursor can import the MDX file correctly (frontmatter syntax, special macros, image paths, etc.). All guidance is based on up-to-date documentation for Next.js MDX, MDX plugins, and Cursor (see refs).

---

## 1. Mapping LaTeX Constructs to Markdown/MDX

LaTeX markup must be translated into Markdown/MDX equivalents. The table below summarizes common conversions:

| **LaTeX Construct**                           | **Markdown/MDX Equivalent**                     |
| --------------------------------------------- | ----------------------------------------------- |
| `\section{Title}`                             | `# Title` (top-level heading)                   |
| `\subsection{Subtitle}`                       | `## Subtitle` (sub-heading)                     |
| `\begin{itemize}\item Item\end{itemize}`      | `- Item` (bullet list; use `-` or `*`)          |
| `\begin{enumerate}\item First\end{enumerate}` | `1. First` (numbered list; use `1.`, `2.` etc.) |
| `\textbf{bold text}` or `{\bf bold text}`     | `**bold text**` (bold emphasis)                 |
| `\textit{italic text}` or `{\it italic}`      | `*italic text*` (italic emphasis)               |
| LaTeX `tabular` or `table` environments       | Markdown tables (use `                          | `columns and`-`headers). Pandoc’s`pipe_tables`or`grid_tables` extensions can help, or reconstruct manually. |
| `\footnote{Note text}`                        | Markdown footnote syntax:                       |

```md
Here is a note[^1].

[^1]: Note text.
```

(Pandoc supports this). |
| Inline math `$x^2$` or display math `$$...$$`| Keep as `$...$`/`$$...$$`. Requires math plugins (e.g. `remark-math` + `rehype-katex`) for rendering. |
| **Custom commands/macros** | Must be replaced or expanded. e.g. use a script or regex to map macros to MDX syntax (see example below). |

- **Headings:** In MDX, use `#`, `##`, etc. as shown in the Next.js MDX docs (e.g. `# H1 heading`, `## H2 heading`).
- **Lists:** LaTeX `itemize` → Markdown bullets (`- item`) and `enumerate` → numbered lists (`1. item`).
- **Emphasis:** Convert `\textbf{}` → `**text**`, `\textit{}` → `*text*`.
- **Tables:** LaTeX tables often convert imperfectly. One approach is using Pandoc with the `+pipe_tables` extension:
  ```bash
  pandoc resume.tex -t markdown+pipe_tables -o resume.md
  ```
  Then adjust as needed. For complex tables, manual reconstruction (or converting the table to an image) may be easier.
- **Footnotes:** LaTeX `\footnote{...}` can become Markdown footnotes. Pandoc’s footnote syntax is:
  ```markdown
  Text[^1] ...

  [^1]: Footnote text
  ```
  (See Pandoc doc: “Markdown allows footnotes”.)
- **Math:** Math is not supported by MDX by default. Use the [`remark-math`](https://github.com/remarkjs/remark-math) plugin and a KaTeX or MathJax plugin (`rehype-katex` or `rehype-mathjax`). Inline math `$...$` and display `$$...$$` can remain as-is once these plugins are configured.
- **Custom LaTeX commands:** Any `\newcommand` or custom macros (e.g. `\resumeSubheading`) must be handled. You can preprocess the `.tex` with a script that replaces them with Markdown. For example, a Python script could use regex to map `\customemph{word}` → `***word***` or `\customsection{Title}` → `## Title`. Alternatively, define fallback Markdown equivalents manually in the MDX.

Thus, by applying these rules (or by using a tool like Pandoc with custom Lua filters), one can convert each LaTeX element into clean Markdown/MDX. The examples above, along with documentation of Markdown syntax, guide the exact mappings.

## 2. YAML Frontmatter Schema for the Resume

We use a YAML frontmatter block at the top of the MDX file to store structured resume data. Below is a **recommended schema**. Fields are given with types and sample values (placeholders used). Any fields not present in your LaTeX can be omitted or left as “unspecified” values.

```yaml
---
# Basic Info
name: "Your Name"                # string
email: "you@example.com"        # string (email)
phone: "123-456-7890"           # string (optional)
website: "https://your.website" # string (optional)

summary: >                     # string (multi-line, Markdown OK)
  A brief summary of your background, interests, and career highlights...

# Skills (grouped by category)
skills:
  - category: Programming       # e.g. "Programming", "Tools", "Design"
    items: [JavaScript, TypeScript, React, Python]
  - category: Tools
    items: [Git, Docker, Figma]

# Professional Experience
experience:
  - company: "Company X"        # string
    role: "Senior Developer"    # string
    start: "Jan 2020"           # string or date
    end: "Present"              # string or date
    location: "City, Country"   # string
    responsibilities:           # array of strings (bullet list)
      - Developed and maintained web application features using React.
      - Mentored junior developers and conducted code reviews.
      - Collaborated with designers to implement UI/UX improvements.

  - company: "Company Y"
    role: "Software Engineer"
    start: "Aug 2017"
    end: "Dec 2019"
    location: "City, Country"
    responsibilities:
      - Built RESTful APIs in Node.js and Express.
      - Improved system performance by 30% through optimization.

# Education
education:
  - institution: "University Name"
    degree: "B.Sc. in Computer Science"
    start: "2013"
    end: "2017"
    location: "City, Country"

# Projects (optional section)
projects:
  - title: "Project Alpha"
    role: "Lead Developer"
    duration: "Mar 2021 – Dec 2021"
    team: [Alice, Bob, Charlie]       # array of names (optional)
    skills: [React, Node.js, GraphQL] # technologies or skills used
    tools: [GitHub, Vercel]          # tools or platforms
    description: "Brief description of project and your role."  # optional
    links:
      github: "https://github.com/you/project-alpha"
      figma: "https://www.figma.com/file/..."
      youtube: "https://youtu.be/..." (add keys as needed)
    images:                         # list of image paths or URLs (optional)
      - "/images/project-alpha-1.png"
      - "/images/project-alpha-2.png"
    case_study: "/case-studies/project-alpha"  # link to an MDX page or external

# Publications, Awards, etc. (optional sections)
publications:
  - title: "Research Paper Title"
    publisher: "Journal Name"
    year: 2020
    link: "https://doi.org/..."
awards:
  - name: "Best Developer Award"
    year: 2021
    issuer: "Tech Conference"
certifications:
  - name: "Certified Kubernetes Administrator"
    year: 2022
    issuer: "CNCF"
talks:
  - title: "Building with MDX"
    event: "Tech Summit"
    year: 2023
patents:
  - title: "Efficient Sorting Algorithm"
    patent_number: "US1234567"
    year: 2022

# Additional Info
languages:
  - English: Native
  - Spanish: Fluent
interests: [Photography, Open-source, Chess]
---
```

**Schema notes:**

- Use **arrays** for lists (skills, responsibilities, team, etc.).
- Dates can be strings or ISO (e.g. `"2020-01"`).
- `links` and `images` illustrate nested objects.
- All fields are optional; omit sections not in your resume.
- In YAML, multi-line `summary` uses `>` or `|` (here `>` will fold lines).

This schema serves as a template. You can adjust field names to match your resume sections. The above example frontmatter is an MDX-valid YAML block.

## 3. Sample Markdown/MDX File

Below is a **minimal MDX example** combining the YAML frontmatter (with placeholders) and Markdown content sections. This demonstrates how your content can be structured. Replace placeholders (ALL-CAPS) with your actual data.

```mdx
---
name: "YOUR NAME"
email: "you@example.com"
phone: "123-456-7890"
website: "https://your.website"
summary: >
  YOUR PROFESSIONAL SUMMARY. A brief overview of your skills, experience,
  and interests. Use Markdown **formatting** as needed.

skills:
  - category: Programming
    items: [JavaScript, TypeScript, React]
  - category: Tools
    items: [Git, Docker, AWS]

experience:
  - company: "Example Corp"
    role: "Senior Developer"
    start: "Jan 2020"
    end: "Present"
    location: "City, Country"
    responsibilities:
      - Developed front-end features using React and TypeScript.
      - Collaborated in agile teams; mentored junior engineers.
      - Improved application performance by 25%.

  - company: "Another Company"
    role: "Software Engineer"
    start: "Aug 2017"
    end: "Dec 2019"
    location: "City, Country"
    responsibilities:
      - Built backend APIs with Node.js and Express.
      - Implemented CI/CD pipelines, reducing deployment time.
      - Wrote unit and integration tests for new features.

education:
  - institution: "University of Somewhere"
    degree: "B.Sc. Computer Science"
    start: "2013"
    end: "2017"
    location: "City, Country"

projects:
  - title: "Portfolio Website"
    role: "Developer"
    duration: "Feb 2022 – Jun 2022"
    team: [Your Name, Collaborator]
    skills: [Next.js, MDX, Tailwind]
    tools: [Vercel, Contentlayer]
    description: "A personal portfolio site built with Next.js and MDX."
    links:
      github: "https://github.com/you/portfolio"
      figma: "https://www.figma.com/your-design"
    images:
      - "/images/portfolio-screenshot.png"
    case_study: "/case-studies/portfolio"

publications:
  - title: "Study on AI Agents"
    publisher: "AI Journal"
    year: 2023
    link: "https://doi.org/10.xxxx/ai-journal.2023.001"

awards:
  - name: "Hackathon Winner"
    year: 2021
    issuer: "Local Tech Community"

certifications:
  - name: "Certified React Developer"
    year: 2020
    issuer: "React Academy"

languages:
  - English: Native
  - Spanish: Fluent

interests: [Coding, Music, Travel]
---

# Experience

**Example Corp** – Senior Developer (Jan 2020 – Present)  
_City, Country_

- Developed front-end features using React and TypeScript.
- Mentored junior developers and improved code quality.
- Led performance optimization, increasing speed by 25%.

**Another Company** – Software Engineer (Aug 2017 – Dec 2019)  
_City, Country_

- Built backend APIs and integrated third-party services.
- Streamlined deployment with CI/CD pipelines using GitHub Actions.
- Wrote unit tests and end-to-end tests to ensure quality.

# Education

- **B.Sc. Computer Science**, University of Somewhere (2013 – 2017) – City, Country

# Projects

**Portfolio Website** (Feb 2022 – Jun 2022) – Developer  
A personal portfolio site showcasing my projects.

- _Technologies:_ Next.js, MDX, Tailwind CSS
- _Links:_ [GitHub](https://github.com/you/portfolio), [Case Study](/case-studies/portfolio)

<!-- Add more sections as needed -->
```

**Notes:**

- We use Markdown headings (`# Experience`, `# Education`, etc.) to structure sections.
- Inline bold/italic formatting (shown above) replaces LaTeX emphasis.
- Lists (`- item`) replace itemize/enumerate environments.
- This example includes both frontmatter (above `---`) and content. Cursor/Next.js will parse the frontmatter into JavaScript exports, and render the Markdown body.

You can expand sections (e.g. Skills, Timeline, Contact) as needed. Each project or experience is written in Markdown bullet or paragraph form, with data coming from frontmatter if desired.

## 4. Setting Up Next.js with MDX

Follow these steps to initialize and run a Next.js app that renders the MDX resume:

1. **Install Node.js and npm** (if not already). For example:

   ```bash
   # On Debian/Ubuntu (example):
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   # Verify:
   node -v && npm -v
   ```

   (On macOS, you could use `brew install node`.) Ensure Node **>=16**. [28†L145-L153] shows using Pandoc, but here Node is needed for Next.js.

2. **Initialize Next.js app** (with TypeScript template):

   ```bash
   npx create-next-app@latest my-portfolio --ts
   cd my-portfolio
   ```

   Accept defaults or configure as desired. This creates a Next.js 15 project (App Router) if prompted.

3. **Install MDX and remark/rehype plugins:**

   ```bash
   npm install @next/mdx @mdx-js/loader remark-math rehype-katex gray-matter remark-frontmatter remark-gfm
   ```
   - `@next/mdx` and `@mdx-js/loader` enable MDX in Next.js.
   - `remark-frontmatter` and `gray-matter` allow parsing YAML frontmatter.
   - `remark-math` + `rehype-katex` support LaTeX math.
   - (Add others like `remark-footnotes` if needed.)

4. **Configure Next.js** to use MDX. In `next.config.js`, add:

   ```js
   // next.config.js
   const withMDX = require("@next/mdx")({
     extension: /\.mdx?$/,
     options: {
       remarkPlugins: [
         require("remark-frontmatter"),
         require("remark-math"),
         require("remark-footnotes"),
       ],
       rehypePlugins: [require("rehype-katex")],
     },
   });
   module.exports = withMDX({
     // For App Router (Next.js 15+), ensure mdx-components.js setup (see docs)
     pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
     // ...other Next.js config as needed...
   });
   ```

5. **Create the MDX page:**
   - For the **Pages Router** (legacy), place your file as `pages/resume.mdx`.
   - For the **App Router** (Next.js 15), create `app/resume/page.mdx` and add an `app/resume/mdx-components.js` if required (see Next.js docs on MDX for App Router).  
     Copy the sample MDX content (with your data) into this file.

6. **Run the dev server:**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000/resume` in a browser. You should see your MDX content rendered by Next.js.

7. **Git/GitHub setup:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: add resume MDX"
   ```
   If you have the GitHub CLI:
   ```bash
   npm install -g gh
   gh auth login     # follow prompts to authenticate
   gh repo create my-portfolio --public --source=. --remote=origin --push
   ```
   (This creates a new repo “my-portfolio” on GitHub, sets it as `origin`, and pushes the code.)  
   If not using `gh`, manually create a repo on GitHub and then:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git
   git push -u origin main
   ```

By now you should have a running Next.js app with an MDX page for your resume, and the code tracked in GitHub. For App Router, refer to the official MDX with Next.js guide for any additional steps (e.g. `mdx-components.js`).

## 5. VS Code and Cursor Setup

To edit and preview MDX files smoothly, enable the following tools:

- **VS Code Extensions:**
  - _YAML_ (by Red Hat) – fixes frontmatter formatting issues (see StackOverflow).
  - _MDX_ support or _MDX Toolkit_ – syntax highlighting and IntelliSense for `.mdx` files.
  - _Markdown All in One_ – useful MD shortcuts and preview.
  - _Prettier_ or _ESLint_ – for consistent formatting (ensure MDX is formatted).
  - _(Optional)_ Mermaid preview extension, if you want to render mermaid diagrams locally.

- **Cursor Settings:**
  - Ensure Cursor recognizes `.mdx` files (should by default).
  - In Cursor’s Markdown preview settings (`Ctrl+,` → Features → Markdown), set `markdown.preview.frontMatter` to `"hide"` to hide YAML in side preview (only the live side-by-side preview respects this).
  - For viewing the MDX file in Cursor, use the **Open Preview to the Side** (`Cmd+Shift+V`) to avoid inline preview issues.

These ensure VS Code and Cursor can parse MDX with frontmatter correctly (the YAML extension workaround is recommended).

## 6. Troubleshooting and Verification Checklist

Before deploying, verify the MDX file import and watch for common issues:

- **Frontmatter Syntax:** Check that YAML frontmatter is valid. It must begin and end with `---` and contain properly indented fields. Even one bad indent or missing colon can break parsing. Use an online YAML validator or VS Code’s YAML extension to check.
- **Cursor Import:** In Cursor, the MDX file should open without YAML errors. If frontmatter is visible (and set to hide), try using side preview instead of inline. If Cursor shows linter errors on MDX, ensure any TypeScript plugin or MDX plugin is installed or configured.
- **Special Macros:** Any leftover LaTeX commands (e.g. `\resumeSubHeading`) will appear as text. If you see raw macros, go back and preprocess or manually replace them. For complex cases, remove or simplify them.
- **Images & Paths:** Cursor and Next.js will serve images from the `public/` folder. If you reference images, use paths like `"/images/foo.png"` (no leading dot) for Next.js. For Markdown relative links (e.g. to another MDX file), ensure they start with `/` (app router) or correctly relative paths.
- **Math & Footnotes:** If using math or footnotes, confirm that `remark-math` and `remark-footnotes` are included in `next.config.js`. In Cursor, these should appear fine as text or SVG (if KaTeX CSS loaded).
- **Cursor Preview Issues:** Remember, Cursor’s inline preview may reformat YAML separators and asterisks (bug). As a workaround, always use the **side-panel preview** (`Cmd+Shift+V`). Don’t worry about the inline “flashing” reformat; it does not affect the actual file contents.
- **Next.js Build:** Run `npm run dev` and fix any compile errors. Often they relate to missing fields in frontmatter (no automatic schema check, but missing data might mean missing exports). Use `console.log` or inspect the rendered page for missing pieces.

By running through this checklist, you can ensure Cursor reads your MDX correctly and Next.js renders it. If errors persist, check the Next.js MDX guide and MDX plugin docs for hints on your specific error messages.

---

```mermaid
flowchart LR
    A[LaTeX Resume (resume.tex)] --> B[LaTeX Parser (Pandoc or script)]
    B --> C[Markdown/MDX + YAML Frontmatter]
    C --> D[Cursor Editor (imports MDX)]
    C --> E[Next.js (@next/mdx) Build & Render]
```

_Figure: Conversion pipeline from LaTeX to MDX. The LaTeX source is parsed (e.g. via Pandoc or custom script) using the above mapping rules. The output is a Markdown/MDX file with YAML frontmatter. This MDX file is then consumed by Cursor (for editing) and by Next.js (for web rendering)._

---

## References

All guidelines above follow official and community sources for MDX, Next.js, and tools:

- Next.js MDX guide (sections on headings, lists, and frontmatter).
- MDX.js official guides (Frontmatter, Math).
- Pandoc documentation on Markdown conversion and footnotes.
- Rost Glukhov’s “LaTeX to Markdown” workflow (table conversion, custom command scripts).
- Cursor community forum (YAML preview settings).
- StackOverflow (VS Code YAML plugin workaround).

Each cited reference provides authority on the best practices and tools used in this conversion process. They can be consulted for deeper details as needed.

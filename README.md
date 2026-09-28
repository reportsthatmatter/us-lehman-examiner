The Report of Anton R. Valukas, the court-appointed examiner in the Lehman Brothers Holdings Inc. Chapter 11 bankruptcy (U.S. Bankruptcy Court, Southern District of New York, Case No. 08-13555 (JMP)), filed 11 March 2010. Nine volumes, roughly 2,200 pages in total, investigating why Lehman failed and whether there are colorable claims against its officers, directors or auditor. The Examiner found that Lehman used an accounting device the firm called "Repo 105" to temporarily remove tens of billions of dollars of assets from its balance sheet just before each quarterly report, understating its leverage to investors, regulators and its own Board — conduct the report finds gives rise to "colorable claims" against Lehman's auditor, Ernst & Young.

## Scope: Volume 1 of 9 (reportsthatmatter-b7z)

This repo ingests **Volume 1 only**: Sections I & II (Introduction; Executive Summary of the Examiner's Conclusions; Procedural Background and Nature of the Examination) and Section III.A.1 (Risk: Business and Risk Management). Confirmed against the report's own front matter and against [web.stanford.edu/~jbulow/Lehmandocs/menu.html](https://web.stanford.edu/~jbulow/Lehmandocs/menu.html), which lists all nine volumes' contents:

| Volume | Contents |
| --- | --- |
| **1** | **Sections I & II: Introduction, Executive Summary & Procedural Background; Section III.A.1: Risk** |
| 2 | Section III.A.2: Valuation; Section III.A.3: Survival |
| 3 | **Section III.A.4: Repo 105** |
| 4 | Section III.A.5: Secured Lenders; Section III.A.6: Government |
| 5 | Section III.B: Avoidance Actions; Section III.C: Barclays Transaction |
| 6-9 | Appendices 1-34 |

**"Repo 105" — the finding readers most associate with this report — is not in Volume 1.** Volume 1's Executive Summary discusses it (Repo 105 removed net leverage from 13.9 to 12.1 at Q2 2008, "there was no substance to the transaction except to remove unwanted assets"), but the Examiner's dedicated analysis is Section III.A.4, in **Volume 3**. A Bead (reportsthatmatter-94u) tracks ingesting the remaining eight volumes; Volume 3 is the likely next candidate given reader interest.

## What's in `archive/`

- `valukas-report-volume-1.pdf` — **the official Volume 1 PDF, as published**, hosted by [Jenner & Block LLP](https://www.jenner.com/en/news-insights/news/lehman-brothers-holdings-inc-chapter-11-proceedings-examiner-s-report) (counsel to the Examiner). 239 pages. Kept in full for provenance; this is what `source_url` in `datapackage.json`/`ingest.ts` points a reader at.
- `valukas-report-volume-1-body.pdf` — **what actually gets ingested**: pages 44-239 of the file above. Pages 1-43 of the official PDF are a cover page and the master table of contents for the *entire nine-volume report* (every volume down to sub-subsections, in a pagination that spans all 2,200 pages), followed by a table of appendices and a second, repeated cover page. None of that is Volume 1's own text — it names sections and pages in volumes 2-9, which this release does not have — and its dot-leader contents entries (a title glued straight to leader dots straight to a page number, e.g. `Barclays....................703`) pushed `pnpm ingest verify`'s losslessCheck over its fidelity threshold: the pipeline's render step correctly splits the fused label and page number apart for readability, but the check's source-word tokenizer doesn't yet credit that split-off number as a real source word the way it does for footnote-marker stems (it only does that one case). See `reportsthatmatter-b78.1`'s notes for the full account; a pipeline fix belongs there, not as a hack in this repo.

  Page 44 — Volume 1's *own* short local contents page, listing only this volume's sections — is kept; it's genuinely useful and doesn't have the fidelity problem the master contents does (far fewer entries).

  Derived deterministically from the official PDF with poppler's `pdfseparate`/`pdfunite` (the same tool family `pdftotext` already depends on):
  ```bash
  pdfseparate -f 44 -l 239 archive/valukas-report-volume-1.pdf page-%04d.pdf
  pdfunite page-*.pdf archive/valukas-report-volume-1-body.pdf
  ```
  Both files are pinned by SHA-256 in `ingest.ts`.

## License

A U.S. court filing by an examiner appointed under 11 U.S.C. § 1104(c); no copyright restricts it.

## Rebuilding the text

`full.md` is generated, never hand-edited. `ingest.ts` is the whole recipe —
which PDFs, in what order, with what metadata, and which pipeline passes.

```bash
pnpm install
pnpm exec tsx ../reportsthatmatter/scripts/ingest/cli.ts run us-lehman-examiner
```

Corrections to the text go in `corrections.yaml`, never into `full.md`. Each
must match exactly once or the build fails naming it. `baseline.json` is the
regression digest: if a pipeline change moves this report's output, it fails
until the baseline moves with it after the diff has been read.

The pipeline itself is [`@rtm/ingest`](https://github.com/reportsthatmatter/ingest),
pinned in `package.json` — improvements are adopted here deliberately, with a
diff, rather than arriving unannounced. This report uses v0.13.0's
`contentsOutline()` pass (reads Volume 1's own local contents page into
headings for the body) — see `ingest.ts` for why.

See `PROCESSING.md` for what shipped, what's known to be imperfect, and where
to report a problem with the text.

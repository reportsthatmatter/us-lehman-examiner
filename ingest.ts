import { pipeline, contentsOutline } from "@rtm/ingest";

/**
 * How this report is built. Owned by the report: every decision that shaped
 * its text is named here, and the passes it composes are library code, so a
 * fix to a shared pass reaches every report that calls it.
 *
 * Scope: Volume 1 of 9 only (reportsthatmatter-b7z). Volume 1 covers
 * Sections I & II (Introduction, Executive Summary & Procedural Background)
 * and Section III.A.1 (Risk). The "Repo 105" material readers most associate
 * with this report is discussed in the Executive Summary here, but its
 * dedicated analysis (Section III.A.4) is in Volume 3, out of scope for this
 * release — see README.md.
 *
 * The official Volume 1 PDF (archive/valukas-report-volume-1.pdf, pinned and
 * checksummed below for provenance) opens with pages 1-43: a cover page and
 * the master table of contents for the *entire* 9-volume, ~2,200-page
 * report (every volume's sections, down to sub-subsections, with page
 * numbers in that whole-report pagination), followed by a table of
 * appendices and a second, repeated cover page. None of that is Volume 1's
 * own text — it lists sections and pages in volumes 2-9, which this release
 * does not have, using a pagination that means nothing without them — and
 * its dot-leader entries (title glued straight to leader dots straight to a
 * page number, e.g. "Barclays....................703") pushed
 * `pnpm ingest verify`'s losslessCheck over its 0.1% threshold: the render
 * step correctly splits the fused label and page number apart for
 * readability, but the fidelity check's source-word tokenizer never learns
 * that split-off page number as a real source word (it only does this for
 * footnote-marker stems), so ~150 legitimately-derived numbers read as
 * invented. See reportsthatmatter-b78.1 for the full writeup; a pipeline fix
 * belongs there, not in this file.
 *
 * archive/valukas-report-volume-1-body.pdf is pages 44-239 of the official
 * PDF — Volume 1's own local table of contents (page 44, which *does* list
 * only this volume) through the end of the volume — extracted deterministic-
 * ally with poppler's pdfseparate/pdfunite:
 *   pdfseparate -f 44 -l 239 archive/valukas-report-volume-1.pdf page-%04d.pdf
 *   pdfunite page-*.pdf archive/valukas-report-volume-1-body.pdf
 * This is what gets ingested. The full official PDF stays pinned in archive/
 * for provenance and is what a reader following source_url downloads.
 */
export default pipeline({
  id: "us-lehman-examiner",
  title: "Report of Anton R. Valukas, Examiner, In re Lehman Brothers Holdings Inc., et al. — Volume 1",
  authors: "Anton R. Valukas, Examiner (Jenner & Block LLP)",
  published_at: "11 March 2010",
  source_url: "https://www.jenner.com/en/news-insights/news/lehman-brothers-holdings-inc-chapter-11-proceedings-examiner-s-report",
  repo: ".",
  volumes: [
    { path: "archive/valukas-report-volume-1-body.pdf", sha256: "cf52e63563f976cb059ee72093a181ac537544b44da8f956b157e1667e1f88a8" },
  ],
  passes: [contentsOutline()],
});

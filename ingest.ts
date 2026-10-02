import { quoteListRunOns, pipeline, contentsOutline, flushFootnoteMarkers } from "@rtm/ingest";

/**
 * How this report is built. Owned by the report: every decision that shaped
 * its text is named here, and the passes it composes are library code, so a
 * fix to a shared pass reaches every report that calls it.
 *
 * Scope: Volumes 1 and 3 of 9 (reportsthatmatter-b7z, reportsthatmatter-dnv).
 * Volume 1 covers
 * Sections I & II (Introduction, Executive Summary & Procedural Background)
 * and Section III.A.1 (Risk). The "Repo 105" material readers most associate
 * with this report is discussed in the Executive Summary here; its dedicated
 * analysis (Section III.A.4) is Volume 3, below.
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
 *
 * Volume 3 (reportsthatmatter-dnv) adds Section III.A.4, Repo 105 (the
 * Examiner's dedicated analysis of the accounting device, printed pages
 * 732-1053 of the whole report). The official Jenner & Block PDF
 * (archive/valukas-report-volume-3.pdf, 336 pages) opens with a cover page,
 * the short-form master contents of all nine volumes (pages 3-8, roman
 * numbered) and a second cover page (9); page 10 begins Volume 3's own
 * local contents (five pages, 727-731), and the body starts on page 15.
 * archive/valukas-report-volume-3-body.pdf is pages 10-336, cut as for
 * Volume 1:
 *   pdfseparate -f 10 -l 336 archive/valukas-report-volume-3.pdf page-%04d.pdf
 *   pdfunite page-*.pdf archive/valukas-report-volume-3-body.pdf
 * Volumes carry the whole report's pagination and footnote numbering, so
 * Volume 1's pages (1-195) and notes (1-690) and Volume 3's (727-1053,
 * 2800s onward) do not collide.
 */
export default pipeline({
  id: "us-lehman-examiner",
  title: "Report of Anton R. Valukas, Examiner, In re Lehman Brothers Holdings Inc., et al. — Volumes 1 and 3",
  authors: "Anton R. Valukas, Examiner (Jenner & Block LLP)",
  published_at: "11 March 2010",
  source_url: "https://www.jenner.com/en/news-insights/news/lehman-brothers-holdings-inc-chapter-11-proceedings-examiner-s-report",
  repo: ".",
  volumes: [
    { path: "archive/valukas-report-volume-1-body.pdf", sha256: "cf52e63563f976cb059ee72093a181ac537544b44da8f956b157e1667e1f88a8" },
    { path: "archive/valukas-report-volume-3-body.pdf", sha256: "a6731331d255386fdb6efaa624b09754f6e4727f60bb6b7933cadc1daa2e5b39" },
  ],
  passes: [
    // A quotation running over a page arrives as two (reportsthatmatter-38s.9).
    quoteListRunOns(),
    // Each volume's own contents page is read as an outline of its headings
    // (labels "a)", "(1)", "(a)", "(i)", "a." as well as "A."), and the
    // outline carries over from one volume to the next.
    contentsOutline(),
    // Markers the PDF prints flush against the word before them ("2007.2",
    // "investors.\u201d2860"): before this pass 5 of Volume 1's 690 notes and
    // 1 of Volume 3's 1,094 had a linked reference (reportsthatmatter-0bf).
    // Safe here because a note number names one note: the volumes share the
    // report's own continuous numbering (Volume 1: 1-690; Volume 3: 2847-3951).
    flushFootnoteMarkers(),
  ],
});

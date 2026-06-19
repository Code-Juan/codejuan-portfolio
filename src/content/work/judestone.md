---
title: Judestone LLC
blurb: A premium quartz & sink catalog with real filtering, compare, and saved designs — in vanilla JavaScript.
tags: [Web, Vanilla JS, Catalog]
live: https://judestoneusa.com
repo: https://github.com/Code-Juan/judestoneusa
stack: Vanilla JavaScript, HTML, CSS; static build via a Node build script, deployed on GitHub Pages (repo also includes a Netlify config); Express/Node backend (Helmet, rate limiting, CORS, validation) delivering submissions to a designated mailbox
year: "2026"
image: /images/judestone-home.jpg
imageAlt: Judestone LLC website homepage
og: /og/og-judestone.png
order: 2
status: Live
---

A browsable product catalog for a quartz countertop and sink supplier, with real filtering, sorting, saved designs, and side-by-side comparison built in vanilla JavaScript.

## The brief

Judestone LLC sells premium quartz countertop materials and professional-grade sinks, with a focus on bulk procurement for multifamily housing and large-scale production projects. They needed a clean, premium storefront where contractors and commercial buyers could browse the full range of designs, narrow down to what fits a project, and request samples or a bulk quote. The catalog had to feel like a real shopping experience without standing up a full e-commerce platform.

## What I built

Judestone's full live catalog — 16 quartz designs and 20 sink products — as a real shopping experience. Each quartz design is filterable across 25 descriptive tags, such as Warm-Tone, High-Contrast, Polished, Modern, Neutral, and Designer-Favorite, so a buyer can drill from "everything" down to the handful that match a look. The 20 sinks filter by category (Kitchen and Bath) and series (R-Series, D-Series, and Vanity-Series), and include ADA-compliant and undermount options. On top of filtering I added sort controls (Recommended, A-Z, Z-A, plus Newest on the quartz designs), a "My Saved Designs" favorites system with a live count badge in the header, and a Compare tool that holds up to four items per type for side-by-side review. The site points buyers toward the two conversion actions: Order a Sample and Request Bulk Quote.

## How it works

The catalog runs client-side from a single product data file, with no database, so it loads fast and ships as a static site. That data file is generated from CSV through a small Node script (`parse-csv.js`), so the catalog is data-driven and easy to regenerate rather than hand-maintained. Filtering, sorting, favorites, and compare are all handled in plain JavaScript. Saved designs persist in the browser via localStorage, so a buyer's shortlist survives between visits. A small Node `build.js` step compiles the pages into a `/dist` folder that's served on GitHub Pages, with clean section URLs coming from the generated folder structure. The repo includes a lightweight Express/Node backend (Helmet, rate limiting, CORS, validation) for handling submissions, and on the live site contact and bulk-quote requests are delivered to a designated mailbox.

## Outcome

The catalog gives Judestone a credible, premium storefront — buyers can shop the full inventory, shortlist, compare, and send a sample or bulk-quote request, which lands in a designated mailbox. It establishes legitimacy and brand for a supplier going after multifamily and production work. Built in 2026 over 47 commits, with the full source published in a public repo. (Featured with the client's permission.)

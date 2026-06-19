---
title: The Wooden Stone LLC
blurb: A commercial countertop & cabinetry site with a real, hand-built bid-request backend.
tags: [Web, Node/Express, SEO]
live: https://woodenstonemi.com
repo: https://github.com/Code-Juan/woodenstonemi
stack: HTML, CSS, JavaScript (no framework), Node.js, Express, Postmark, Helmet, multer; GitHub Pages with Netlify/Render configs and GitHub Actions CI/CD
year: "2025"
image: /images/woodenstone-home.jpg
imageAlt: The Wooden Stone LLC website homepage
og: /og/og-wooden-stone.png
order: 1
status: Live
---

The public-facing site for a commercial countertop and cabinetry contractor, with a hand-built contact and bid-request backend.

## The brief

The Wooden Stone is a licensed and insured commercial fabrication and installation contractor. Its primary markets are Michigan, Ohio, Indiana, Illinois, and Wisconsin, and the company states the ability to service all 48 mainland states. The customer isn't a homeowner; it's the general contractor running a multifamily development on a deadline. The site had to speak to that buyer: read as a serious commercial operation, show proof of work, and turn a visiting GC into a bid request.

## What I built

A multi-page marketing site with a contact and bid-request backend. Core pieces:

- A "Request a Bid Today" path — the site's primary call to action — wired to a real contact form and Node/Express backend rather than a mailto link, so inquiries reach a designated mailbox and the team can hold its stated 24-hour response promise.
- A full commercial site structure: Home, What We Do, Scopes & Materials, Project Portfolio, Resources, Contact Us, and FAQ — built around the commercial/multifamily positioning rather than a single landing page.
- A dynamic project portfolio with image galleries; the site highlights "30+ Projects Completed" as proof of work.
- SEO work — sitemap.xml and robots.txt — so contractors searching for fabrication partners in those markets can find them.
- Performance work: responsive layout, lazy-loaded below-the-fold images with eager-loaded hero content, and image-optimization tooling to keep galleries fast.

## How it works

The frontend is hand-built HTML, CSS, and JavaScript with no frontend framework. Behind it, a Node.js/Express server handles form submissions and sends notification emails through Postmark, a transactional email service. The backend is hardened with Helmet security headers, express-validator input validation, express-rate-limit rate limiting, CORS rules, and health-check endpoints, with multer handling file uploads. The live site is served on GitHub Pages, with form submissions delivered to a designated mailbox; the repo also includes Netlify and Render deploy configs and GitHub Actions CI/CD.

## Outcome

Since launch, the site has helped The Wooden Stone win new bids. It gives the business a credible, branded commercial presence that proves legitimacy to the general contractors it pitches — so the site does sales work rather than sitting as a brochure, with bid requests landing in a designated mailbox. It's an actively maintained build, not a one-off: the repository spans 206 commits, was started in July 2025, and has continued to receive updates since. (Featured with the client's permission.)

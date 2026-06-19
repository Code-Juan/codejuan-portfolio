---
title: Project Stone
blurb: A cross-platform fabrication-management app for a stone shop, built in Flutter with offline storage and cloud sync.
tags: [App, Flutter/Dart, Supabase]
stack: Flutter, Dart, Supabase, SQLite; built and tested on Windows (Flutter leaves web/mobile open for later)
year: "2027 (target)"
image: /images/project-stone.png
imageAlt: Project Stone — fabrication dashboard prototype
og: /og/og-project-stone.png
order: 3
status: In progress
---

A custom project-management app for a countertop and stone fabrication business: run jobs, customers, and fabrication phases from one place. *("Project Stone" is a working title.)*

## The brief

A stone and countertop fabrication shop runs on spreadsheets, texts, and paper. The job was to give that business one tool to track customers, manage active projects, and follow each job through fabrication — without forcing anyone onto complicated software. This was scoped as a product, not a one-off website: a real application the shop could run its operation on, built for a specific client.

## What I built

A desktop application built around how a fabrication shop actually works:

- A **customer database** to store and look up clients in one place.
- **Project management** with the detail a fabrication job needs: project name, address, customer, site contact, material, sinks, edge detail, backsplash, and notes — captured per job.
- **Fabrication phase tracking** across the real stages of the work — Saw Tables, CNC Programming, CNC Fabrication, and Projected Yield — each shown as a live progress dial of completed vs. projected quantity, with time tracked per phase.
- **File attachments** so frontend and backend files live with the project they belong to.
- **Reporting** to pull the data back out in a usable form instead of digging through individual records.

## How it works

It's built in Flutter and Dart, so a single codebase can target Windows, web, and mobile. It currently runs as a native Windows desktop app — the platform the shop works on. Data is stored locally with SQLite so the app stays fast and works offline, then syncs to a Supabase cloud backend so the same information is available wherever you sign in.

## Outcome

An in-progress prototype, built for a specific fabrication client, with the core dashboard and project workflow working (the screenshot above shows the live UI with placeholder data). It is not yet deployed or in production use, so there are no live-usage numbers to report. The next step is polishing toward delivery. What it shows: I can build a real, offline-capable desktop application with cloud sync — app-development work well beyond websites.

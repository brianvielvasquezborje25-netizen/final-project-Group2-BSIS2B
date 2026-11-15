# BU Hangout - Frontend Implementation (Phase 3 & Step 6)

## Overview
This repository contains the frontend implementation for BU Hangout, an integrated web application designed for Bicol University Polangui. The platform allows students to discover student-run food stalls, view operating statuses, check GCash availability, and explore daily menu offerings.


## What Was Implemented
* Figma UI & Landing Page (`index.html`): Built a responsive, welcoming landing page featuring custom BU branding, a hero description, and the student-run food stall image collage.
* Authentication Pages (`login.html`, `register.html`): Developed clean, containerized authentication forms mapped directly to user roles (`Consumer`, `seller`, `admin`).
* Stall Directory Dashboard (`dashboard.html`):Created the central grid displaying all 6 Entrep food stalls, complete with live status badges, GCash payment indicators, search filtering, and dynamic menu preview modals.
* Stall Owner Workspace (`manage-stall.html`):Implemented a dedicated management view for stall owners to update stall information and add/edit daily menu items.
* User Profile (`profile.html`): Provided an account settings and session management interface.
* Bootstrap 5 Styling & Architecture (`/frontend/css/style.css`):Utilized a responsive grid system (`container`, `row`, `col`), custom pill navigation, cards, and modal dialogs adhering to the project's color scheme (`#003366` and `#FF6600`).
* API Integration Skeletons (`/frontend/js/app.js`):Prepared structured client-side event handlers and `fetch` placeholders to seamlessly connect the frontend forms with backend Mongoose APIs next week.


## Alignment with Use Case & ERD
The frontend architecture directly mirrors the database models and use cases defined in the backend ERD:
1. `User.js` Schema Alignment: Registration and login inputs (`name`, `email`, `password`, `role`) synchronize directly with user authentication and role-based permissions (Consumer, Seller, Admin).
2. `Stall.js` Schema Alignment: The stall directory cards and management forms explicitly map to backend fields (`stallName`, `section`, `operatingHours`, `isOpen`, `gcashAvailable`).
3. `MenuItem.js` Schema Alignment: Modal views and management tables reflect item properties (`itemName`, `category`, `price`, `isAvailable`, `isBestseller`), enabling seamless relational referencing (`stallId`).
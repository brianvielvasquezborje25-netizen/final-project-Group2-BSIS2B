<div align="center">

# BU Hangout — Frontend Implementation (Phase 3 & Step 6)
**Integrated Food Stall Directory and Digital Menu System**

*Client-side interface for Bicol University Polangui students and student-run food stalls*

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap 5" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" />
</p>

`Bicol University - Polangui` | `Phase 3 & Step 6` | `Frontend Module`

</div>

---

## Overview

This repository contains the frontend implementation for **BU Hangout**, an integrated web application designed for **Bicol University Polangui**. The platform allows students to discover student-run food stalls, view operating statuses, check GCash availability, and explore daily menu offerings.

---

## What Was Implemented

| Component | File / Path | Implementation Details |
| :--- | :--- | :--- |
| **Figma UI & Landing Page** | `index.html` | Built a responsive, welcoming landing page featuring custom BU branding, a hero description, and the student-run food stall image collage. |
| **Authentication Pages** | `login.html`<br>`register.html` | Developed clean, containerized authentication forms mapped directly to user roles (`Consumer`, `seller`, `admin`). |
| **Stall Directory Dashboard** | `dashboard.html` | Created the central grid displaying all 6 Entrep food stalls, complete with live status badges, GCash payment indicators, search filtering, and dynamic menu preview modals. |
| **Stall Owner Workspace** | `manage-stall.html` | Implemented a dedicated management view for stall owners to update stall information and add/edit daily menu items. |
| **User Profile** | `profile.html` | Provided an account settings and session management interface. |
| **Bootstrap 5 Styling & Architecture** | `/frontend/css/style.css` | Utilized a responsive grid system (`container`, `row`, `col`), custom pill navigation, cards, and modal dialogs adhering to the project's color scheme (`#003366` and `#FF6600`). |
| **API Integration Skeletons** | `/frontend/js/app.js` | Prepared structured client-side event handlers and fetch placeholders to seamlessly connect the frontend forms with backend Mongoose APIs next week. |

---

## Alignment with Use Case & ERD

The frontend architecture directly mirrors the database models and use cases defined in the backend ERD:

| Backend Schema | Frontend Synchronization | Mapped Fields |
| :--- | :--- | :--- |
| **`User.js`** | Registration and login inputs synchronize directly with user authentication and role-based permissions (`Consumer`, `Seller`, `Admin`). | `name`, `email`, `password`, `role` |
| **`Stall.js`** | The stall directory cards and management forms explicitly map to backend fields. | `stallName`, `section`, `operatingHours`, `isOpen`, `gcashAvailable` |
| **`MenuItem.js`** | Modal views and management tables reflect item properties, enabling seamless relational referencing (`stallId`). | `itemName`, `category`, `price`, `isAvailable`, `isBestseller` |

---

## Frontend Directory Structure

```text
frontend/
├── css/
│   └── style.css          # Bootstrap 5 overrides & custom theme (#003366 / #FF6600)
├── js/
│   └── app.js             # Event handlers, DOM logic, & REST API fetch skeletons
├── img/                   # Custom BU branding & student-run stall visual assets
├── index.html             # Landing page & platform overview
├── login.html             # Role-based user login
├── register.html          # Role-based account registration
├── dashboard.html         # Campus food stall directory & menu modals
├── manage-stall.html      # Stall owner dashboard & menu inventory manager
└── profile.html           # Account settings & session management

## Phase 5: Dashboard Integration & Search

### Overview
Phase 5 focuses on establishing live data synchronization between the frontend dashboard and the backend API, allowing student-run stalls and administrators to view dynamic user records and filter them in real time.

### Key Features & Implementation
-Dynamic Data Fetching: Connected `dashboard.html` and `dashboard.js` to the backend `/api/users` endpoint to pull and render registered MongoDB user documents dynamically.
- Real-Time Search Filter: Implemented vanilla JavaScript filtering logic enabling users to instantly search through records by name or email.
- Version Control & Tagging: Synchronized local and remote repository updates and tagged the release version with `phase-5` for structured tracking.

### Tech Stack
- Frontend: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript (`fetch` API)
- Backend: Node.js, Express, MongoDB Atlas, Mongoose
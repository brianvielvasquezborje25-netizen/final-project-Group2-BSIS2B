BU Hangout (BU EntrepHub)
Integrated Food Stall Directory and Digital Menu System
Project Team — BSIS 2B (Group 2)
Bicol University - Polangui | Computer Studies Department (SY 2025–2026)
Course: IS ELEC 2 — Web Systems and Technologies
Instructor: Prof. Guillermo V. Red, Jr.
GROUP 2 MEMBERS
Name                         Role
Jielaine Roz I. Atienza      Project Manager
Kristelle Joy N. De Jesus    Frontend Developer & Database Manager
Raiver L. Sarte              Backend Developer
Brian Viel V. Borje          GitHub Manager
Paula Jane J. Gonzales       Tester & Documentation

Overview
During short lecture breaks, Bicol University Polangui (BUP) students often encounter long queues, tight schedules, and uncertainty regarding which campus food stalls are open or what menu items are available.
BU Hangout (originally proposed as BU EntrepHub) is a web-based platform that bridges student consumers and student entrepreneurs. It provides a real-time campus directory to check stall availability, view operating hours, verify GCash payment options, and browse daily menus before walking across campus—while empowering student vendors with a free, easy-to-use dashboard to manage their stalls and menus.

Target Users

Primary Users:
BUP Students (Consumers): Browse daily menus, filter stalls by open status or GCash availability, search by stall name/section, and save time during breaks.
Student Entrepreneurs (Sellers): Manage stalls for free, toggle real-time operating statuses (Open/Closed), update menu items and prices, and mark item availability.

Secondary Users:
BUP Faculty & Staff, Campus Guests/Visitors, and BUP Administration overseeing student entrepreneurship initiatives.

Key Features
Landing & Onboarding (index.html): Clean, student-friendly overview explaining how the platform works with quick-access portals for browsing stalls or registering as a vendor.

Campus Food Stall Directory (dashboard.html):
Live status indicators (OPEN / CLOSED) and payment badges (GCASH).
Search bar (by stall name or course/section) and quick filters (All Stalls, Open Now, GCash Accepted, plus sorting by Open first).

Seller Management Dashboard (ManageStall.html):
Two-column workspace to edit stall details (Stall Name, Course & Section, Description, Operating Hours).
One-click live switches for Open right now and Accepts GCash.
Menu inventory table to add, edit, or toggle availability of daily food items.

Authentication & User Profile (register.html, login.html, profile.html):
Role-based registration (Consumer, seller, admin) with university email support.
Profile management to update personal details, change passwords, or delete accounts/stalls.

System Architecture & Tech Stack
BU Hangout operates on a 3-Tier Model-View-Controller (MVC) web architecture:
Frontend (Client Layer): HTML5, CSS3,
Backend (Application Layer): Node.js, Express.js, CORS, Dotenv
Database (Persistence Layer): MongoDB & Mongoose ODM
API Testing & Design: Postman

Database Schema (Collections)
Users: name, email (unique), password, role (Consumer, seller, admin), createdAt
Stalls: ownerId (FK $\rightarrow$ Users), stallName, section, operatingHours, isOpen, gcashAvailable
MenuItems: stallId (FK $\rightarrow$ Stalls), itemName, category, price, isAvailable, isBestseller

# FoundIt! : Your Campus-Wide Lost & Found
[cite_start]**A Campus-Based Lost and Found Management System** [cite: 22]

## Introduction
[cite_start]FoundIt! is a web-based system designed to centralize the process of posting and claiming found items on campus[cite: 23, 24]. [cite_start]It replaces disorganized manual methods with a digital database to ensure lost property is returned to rightful owners through "Active" and "Archive" listings[cite: 24, 25].

### Technologies Used
* [cite_start]**Front-End:** HTML5, CSS3, Vanilla JavaScript [cite: 26]
* [cite_start]**Back-End:** PHP, PDO (PHP Data Objects) [cite: 26]
* [cite_start]**Database:** MySQL [cite: 26]
* [cite_start]**Tools:** XAMPP, phpMyAdmin, VS Code [cite: 26]

---

## Database Design
[cite_start]The schema uses a normalized 3-table structure (Categories, Items, and Claims) to ensure data integrity[cite: 28].

> [cite_start]**[PLACEHOLDER: Insert ER Diagram Image Here - Figure 1]** [cite: 27]

### Relationships
* [cite_start]**Categories to Items:** One-to-Many; one category covers multiple items[cite: 29].
* [cite_start]**Items to Claims:** One-to-Zero-or-One; items stay 'active' until a single claim record is linked via a Unique Foreign Key[cite: 30, 31, 32].

---

## Web Interface & Functionalities
[cite_start]The system features a responsive GUI that adapts to both desktop and mobile views[cite: 34, 39].

* [cite_start]**Posting Form:** Allows users to upload item titles, locations, descriptions, and photos[cite: 35].
* [cite_start]**Found Items Panel:** A real-time list fetching "active" items as cards[cite: 36].
* [cite_start]**Claim System:** A modal pop-up that captures claimant details and triggers a database transaction to archive the item[cite: 37].
* [cite_start]**Archive:** Stores the history of claimed items and claimant information[cite: 38].

> **[PLACEHOLDER: Insert Interface Screenshots Here - Figures 2 to 7]**

---

## Challenges and Learning
* [cite_start]**Normalization:** Transitioning to a three-table model and managing Foreign Key constraints (like `ON DELETE CASCADE`) was a significant hurdle[cite: 39].
* [cite_start]**Pathing & Caching:** Debugging 404 errors for images taught me the nuances of absolute vs. relative paths in PHP[cite: 40].
* [cite_start]**Full-Stack Integration:** Gained insight into using JavaScript fetch requests to bridge the UI and MySQL via PHP[cite: 41].
* [cite_start]**UI/UX Precision:** Learned modern styling techniques like `object-fit: cover` to ensure consistent image rendering[cite: 42].

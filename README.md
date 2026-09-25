# Personal CV Web Page

## Student Information

| | |
|---|---|
| **Complete Name** | Christian Dominique L. Jorda |
| **Year Level** | 4th Year |
| **Set/Section** | C |
| **Subject** | IT415 - Application Development and Emerging Technologies |
| **Program** | BS Information Systems, Davao del Norte State College |

## Project Description

A responsive, single-page personal Curriculum Vitae website with a minimalist, editorial design: white background, strong black typography, and a two-column layout (section labels on the left, content on the right). It presents my profile, education, technical skills, selected projects, and contact information.

It is built with HTML5, CSS3 (Grid and Flexbox), and a small amount of vanilla JavaScript. No frameworks are used.

### Features

- Semantic HTML5 structure (`header`, `nav`, `main`, `section`, `footer`)
- Two-column grid layout that collapses to a single column on screens under 768px
- Sticky header with a square "CD" monogram and smooth-scrolling navigation
- Accessible markup: alt text, visible keyboard focus, high color contrast, and reduced-motion support
- Footer year updates automatically

## File Structure

```
CV Web/
├── index.html      # Page structure and CV content
├── style.css       # All styling, organized by section, with responsive media queries
├── script.js       # Smooth scrolling and current year in the footer
├── README.md       # Project documentation
└── images/
    └── profile-cd.png  # Profile photo
```

## Viewing the Page Locally

1. Download or clone this project folder.
2. Make sure the profile photo `profile-cd.png` is inside the `images/` folder.
3. Open `index.html` in any modern web browser (double-click the file, or right-click and choose **Open with**).

Optional: in VS Code, install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server** to reload the page automatically as you edit.

# Pro Build Construction — Before & After Website

A professional construction portfolio website featuring interactive before/after photo sliders, project filtering, and a contact form.

## Features
- 🖼️ Draggable before/after image sliders on every project
- 🔍 Category filter bar (All, Landscaping, Drainage, Hardscape)
- 💬 Lightbox modal with full-size slider + project details
- 📱 Fully responsive (mobile, tablet, desktop)
- ✨ Scroll-triggered fade animations
- 📬 Contact / quote request form with file upload
- ⚡ No build tools — pure HTML, CSS, and vanilla JS

## Project Structure
```
/
├── index.html       # Main page
├── style.css        # All styles
├── main.js          # Interactions (sliders, modal, filters)
├── vercel.json      # Vercel deployment config
└── images/
    ├── before1.jpg
    ├── during1.jpg
    └── after1.jpg
```

## Customization
- **Company name**: Search for "Pro Build" in `index.html` and replace
- **Colors**: Edit CSS variables at the top of `style.css`
- **Photos**: Replace files in the `images/` folder (keep same filenames or update references in `index.html` and `main.js`)
- **Contact info**: Update phone, email, address in the Contact section of `index.html`

## Deploy to Vercel
1. Push this repo to GitHub (done ✓)
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import this GitHub repo
4. Leave all settings as default → click **Deploy**
5. Done! Your site is live.

## Add More Projects
In `index.html`, copy a `.project-card` block and update the images.  
In `main.js`, add a new entry to the `projectData` array with matching index.

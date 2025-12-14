# Portfolio Website

Professional portfolio website for Mahadharsan Ravichandran - Data Scientist, Data Engineer, Business Analyst, and LLM Engineer.

## Features

- **Professional Design**: Clean, corporate professional design system
- **Filterable Projects**: Filter projects by category (Data Analysis, Data Science, Data Engineering, LLM/Gen AI, Business Analytics)
- **Responsive**: Fully responsive design for all devices
- **Performance Optimized**: Fast loading times and smooth animations
- **SEO Optimized**: Meta tags and Open Graph tags for social sharing

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Professional design system with CSS variables
- **JavaScript (ES6 Modules)**: Dynamic content loading and filtering
- **Vite**: Build tool for development and production

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd portfolio-website
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Your site will be live!

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Vite and configure the build
4. Deploy!

## Project Structure

```
portfolio-website/
├── index.html          # Main HTML structure
├── styles.css          # Professional CSS styles
├── script.js           # JavaScript for interactions
├── data.js            # Content data (projects, experience, skills)
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── netlify.toml        # Netlify deployment config
└── README.md          # This file
```

## Customization

### Adding Your Photo

1. Add your professional photo to the project
2. Update the hero section in `index.html`:
   - Replace the `.photo-placeholder` div with an `<img>` tag
   - Recommended size: 400x400px to 600x600px
   - Format: JPG or PNG
   - Optimize for web (under 200KB)

### Updating Content

All content is stored in `data.js`:
- `projectsData`: Your projects
- `experienceData`: Your work experience
- `skillsData`: Your skills organized by domain
- `educationData`: Your education
- `certificationsData`: Your certifications

### Updating Resume

1. Add your resume PDF to the project
2. Update the resume download link in `index.html`

## License

© 2025 Mahadharsan Ravichandran. All rights reserved.

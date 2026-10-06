NATHANIEL WORKS — RENDER WIDE LAYOUT & SPACING UPDATE
Prepared 6 October 2026. Not published.

TARGET
https://nathaniel-creative-portfolio.onrender.com/
Repository: https://github.com/khie101521-coder/nathaniel-portfolio
Branch: main
Base commit: 94681ece5c8f888fa0bd5460842df2dc4f366876

CHANGES
- Wider desktop sections: 48px gutters at 1920px rather than 300px.
- Wider landscape carousel, with height derived from its 16:9 media ratio.
- Wider portrait stage retaining card sizes and three visible thumbnails.
- Wider, bounded testimonial group.
- Reduced desktop section padding: 76.8px at 1920px rather than 112px.
- Removed unnecessary minimum heights from the hero and service cards.
- Landscape phone grids and testimonials use available width.
- Landscape phone section padding reduced to 36px.
- Fixed phone heading widths so side margins fit inside the viewport.

PRESERVED
Original logo, fonts, gray background, glow, corner radii, all copy, media links,
assets, Mobile QA v4, swipe handling, chevrons and existing script.js.

VALIDATION
Verified HTML changes only its CSS cache version. Content and scripts are
identical to the current source; assets and script.js are unchanged.
Git whitespace validation passed. This final combined patch has not yet
been visually tested in a browser or published.

INSTALL
Replace only index.html and style.css in the repository root.
Keep script.js and assets/ unchanged.
Commit to main; existing Render service has automatic deploy enabled.
Verify the resulting deploy is Live at the unchanged target URL.

This ZIP contains only the two replacement files, not the complete website.

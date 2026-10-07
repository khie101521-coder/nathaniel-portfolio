NATHANIEL WORKS — LOGO VISIBILITY / ASPECT-RATIO FIX

WHAT THIS FIXES
- Restores all brand/client logo paths to the existing /assets root folder.
- Removes the /assets/client-logos dependency that caused broken images when that folder was not pushed.
- Replaces Brands-carousel SVG wrappers with normal IMG elements.
- Preserves each PNG logo's original aspect ratio (no stretching).
- Removes circle clipping / forced width+height from the Brands section.
- Keeps the current Clients layout, portraits, navigation, and other revisions unchanged.

GITHUB UPLOAD
Replace:
- index.html
- style.css

Also upload/overwrite these files inside /assets:
- wise-cleaner-logo.png
- wise-skin-logo.png
- prulife-uk-logo.png
- jasper-sky-royals-logo.png
- muse-logo.png
- highlevel-logo.png
- idigital-creators-logo.png

Do NOT create an assets/client-logos folder for this fix.
Keep script.js, portfolio-media.js, and all other assets unchanged.

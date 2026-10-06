diff --git a/index.html b/index.html
index f205950..be5ad4b 100644
--- a/index.html
+++ b/index.html
@@ -23,7 +23,7 @@
 <meta name="twitter:image:alt" content="Nathaniel Oclares profile photo with the label CREATIVE VIDEO EDITOR">
 <link rel="image_src" href="https://nathaniel-creative-portfolio.onrender.com/assets/nathaniel-oclares-creative-video-editor-20260929.png">
 <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='15' fill='%2317191b'/%3E%3Cpath d='M15 45V19l18 26V19M40 19h11v26H40' fill='none' stroke='%231cff16' stroke-width='5'/%3E%3C/svg%3E">
-<link rel="stylesheet" href="style.css?v=20261006-type-original-logo1">
+<link rel="stylesheet" href="style.css?v=20261006-wide-spacing3">
 
 <style>
 .contact::before,
diff --git a/style.css b/style.css
index 6d5a764..c48bdbb 100644
--- a/style.css
+++ b/style.css
@@ -2889,3 +2889,178 @@ body#top footer .logo-mark {
   box-shadow: none !important;
   padding: 0 !important;
 }
+
+
+/* WIDE RESPONSIVE LAYOUT — 2026-10-06
+   Based on the approved font-size + original-logo package.
+   Wider sections; existing typography, logo, colors and media proportions retained. */
+@media (min-width:901px) {
+  html:not(.phone-view) body#top {
+    --nw-wide-gutter: clamp(24px, 2.5vw, 64px);
+  }
+  html:not(.phone-view) body#top main {
+    width:100%;
+    max-width:none;
+    min-width:0;
+  }
+  html:not(.phone-view) body#top main > .section,
+  html:not(.phone-view) body#top > footer {
+    padding-left:var(--nw-wide-gutter) !important;
+    padding-right:var(--nw-wide-gutter) !important;
+  }
+  /* Shared left/right alignment: do not inset a grid again inside its section. */
+  html:not(.phone-view) body#top .section-title,
+  html:not(.phone-view) body#top .featured-heading,
+  html:not(.phone-view) body#top .nw-section-head,
+  html:not(.phone-view) body#top .rail-heading,
+  html:not(.phone-view) body#top .nw-service-grid,
+  html:not(.phone-view) body#top .featured-grid,
+  html:not(.phone-view) body#top .nw-tool-grid,
+  html:not(.phone-view) body#top .client-grid,
+  html:not(.phone-view) body#top .client-profile-grid {
+    width:100% !important;
+    max-width:none !important;
+    margin-left:0 !important;
+    margin-right:0 !important;
+    min-width:0;
+  }
+  html:not(.phone-view) body#top .hero {
+    column-gap:clamp(32px, 4vw, 80px);
+  }
+  html:not(.phone-view) body#top .hero-copy,
+  html:not(.phone-view) body#top .hero-proof,
+  html:not(.phone-view) body#top .about-intro-copy,
+  html:not(.phone-view) body#top .about-media {
+    min-width:0;
+  }
+  /* Full-width carousel stage. All existing media aspect ratios are retained. */
+  html:not(.phone-view) body#top .carousel {
+    width:100%;
+    max-width:none;
+  }
+  html:not(.phone-view) body#top .landscape .slides {
+    width:100% !important;
+    max-width:none !important;
+    margin-inline:auto;
+    /* 44% active slide x 9/16, plus room for the caption. */
+    height:calc((100vw - var(--nw-wide-gutter) * 2) * .2475 + 82px) !important;
+  }
+  @supports (height:1cqw) {
+    html:not(.phone-view) body#top .landscape .slides {
+      height:calc(44cqw * 9 / 16 + 82px) !important;
+    }
+  }
+  html:not(.phone-view) body#top .portrait-carousel .slides {
+    width:100% !important;
+    max-width:none !important;
+    margin-inline:auto;
+  }
+  /* Keep portrait tiles at their existing size, grouped around the center.
+     Their new full-width stage must not scatter tiles to the far edges. */
+  html:not(.phone-view) body#top .portrait-carousel .slide.is-before {
+    left:calc(50% - 250px);
+  }
+  html:not(.phone-view) body#top .portrait-carousel .slide.is-after {
+    left:calc(50% + 250px);
+  }
+  html:not(.phone-view) body#top .carousel .previous { left:12px; }
+  html:not(.phone-view) body#top .carousel .next { right:12px; }
+  /* A wider centered testimonial group, not full-width stretched video. */
+  html:not(.phone-view) body#top .testimonial-grid {
+    width:min(100%, 1040px);
+    max-width:1040px;
+    grid-template-columns:minmax(0, 360px) minmax(0, 1fr);
+    gap:24px;
+    margin-inline:auto;
+  }
+  html:not(.phone-view) body#top .testimonial-video {
+    width:100%;
+    max-width:360px;
+    margin-inline:auto;
+  }
+  html:not(.phone-view) body#top .testimonial-messages {
+    width:100%;
+    max-width:none;
+  }
+}
+
+/* Landscape phone: use the available horizontal space while preserving
+   the existing phone typography, navigation and native touch handling. */
+@media (orientation:landscape) and (min-width:641px) and (max-height:600px) {
+  html.phone-view body#top main > .section {
+    padding-left:max(24px, env(safe-area-inset-left)) !important;
+    padding-right:max(24px, env(safe-area-inset-right)) !important;
+  }
+  html.phone-view body#top .works > .section-title,
+  html.phone-view body#top .works > .nw-swipe-note,
+  html.phone-view body#top .rail-heading {
+    width:auto !important;
+    max-width:100% !important;
+    margin-left:0 !important;
+    margin-right:0 !important;
+  }
+  html.phone-view body#top .nw-service-grid,
+  html.phone-view body#top .nw-tool-grid {
+    grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
+  }
+  html.phone-view body#top .nw-tool-grid .nw-tool-wide {
+    grid-column:1 / -1 !important;
+  }
+  html.phone-view body#top .testimonial-grid {
+    width:min(100%, 860px) !important;
+    max-width:860px !important;
+    grid-template-columns:minmax(0, .8fr) minmax(0, 1.2fr) !important;
+    align-items:start;
+    gap:20px !important;
+  }
+  html.phone-view body#top .testimonial-video {
+    width:min(100%, 260px) !important;
+    max-width:260px !important;
+  }
+  html.phone-view body#top .testimonial-messages {
+    width:100% !important;
+    max-width:none !important;
+  }
+  html.phone-view body#top .contact-layout {
+    width:min(100%, 680px) !important;
+    max-width:680px !important;
+  }
+}
+
+
+/* Keep the existing phone gutter inside the viewport, not in addition to it.
+   This prevents a 100%-wide heading plus side margins from clipping on phones. */
+@media (max-width:900px) {
+  html.phone-view body#top .works > .section-title,
+  html.phone-view body#top .works > .nw-swipe-note {
+    width:auto !important;
+    max-width:none !important;
+  }
+}
+
+
+/* Compact section rhythm without reserving an empty screen-height hero. */
+@media (min-width:901px) {
+  html:not(.phone-view) body#top main > .section {
+    padding-top:clamp(56px, 4vw, 80px);
+    padding-bottom:clamp(56px, 4vw, 80px);
+  }
+  html:not(.phone-view) body#top main > .hero {
+    min-height:0;
+    padding-top:clamp(80px, 6vw, 112px);
+    padding-bottom:clamp(56px, 4vw, 80px);
+  }
+  html:not(.phone-view) body#top .nw-service-card {
+    min-height:0;
+  }
+}
+@media (orientation:landscape) and (min-width:641px) and (max-height:600px) {
+  html.phone-view body#top main > .section {
+    padding-top:36px !important;
+    padding-bottom:36px !important;
+  }
+  html.phone-view body#top main > .hero {
+    min-height:0 !important;
+    padding-top:48px !important;
+  }
+}

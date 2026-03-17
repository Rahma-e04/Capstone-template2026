How to add Gridlite PE Variable font for this project

Option A — Adobe Fonts (recommended if you have a license):
1. Go to https://fonts.adobe.com and sign in.
2. Add "Gridlite PE Variable" to a web project and copy the embed <script> Adobe provides.
3. Paste the <script> embed code into the <head> of `index.html` (above the local @font-face block).

Option B — Local font files (manual install):
1. Obtain the Gridlite PE Variable font files legally (check your license).
2. Place the variable font file in this project at:
   ./fonts/GridlitePEVF.woff2
   (or adjust the path in `index.html` if you use a different filename).
3. The project already contains a local @font-face rule that looks for ./fonts/GridlitePEVF.woff2 and will use it if present.

Notes:
- Adobe Fonts requires using their web project kit script. I cannot add a working kit script for you because each Adobe Fonts kit is tied to your Adobe account.
- If you provide the Adobe embed <script> (the kit script), I can insert it into `index.html` for you.
- Ensure the font license allows web embedding before uploading or serving the font files.

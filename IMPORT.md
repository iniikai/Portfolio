# Importing the site files

The live site at inikai.com lives on Bluehost. Its root-level HTML pages are
already in this repo; the asset folders are still empty placeholders.

## What to do

1. Locate the unzipped copy of the site downloaded from Bluehost cPanel
   (the folder containing `css/`, `js/`, and `img/`).
2. Copy `css/`, `js/`, and `img/` from there into this repo, preserving
   structure. Overwrite the `.gitkeep` placeholders.
3. Commit and push to `main`.

`.gitignore` already excludes `.mp4`/`.mov`/`.webm` — those stay on the
Bluehost server and are served from there. Do not try to add them.

Skip `cgi-bin/` (server artifact) and `website_4147d67c/` (a separate
project with its own repo).

## Verifying

The site's pages reference the files listed below. After copying, every one
of these should exist. Paths are URL-encoded exactly as they appear in the
HTML — `%20` is a space.

css/about.css
css/more.css
css/project.css
css/project.css
css/style.css
css/style.css
img/about.png
img/about/about1-herbertgreg.png
img/about/about10.jpg
img/about/about11.jpg
img/about/about12.jpeg
img/about/about13-saeid.sole.png
img/about/about14.png
img/about/about15.png
img/about/about16.png
img/about/about17.png
img/about/about18.jpg
img/about/about19.jpg
img/about/about2-jpnstudio2023.png
img/about/about20.jpg
img/about/about21.png
img/about/about22.jpg
img/about/about23.jpg
img/about/about24.jpg
img/about/about25.jpg
img/about/about26.png
img/about/about27.jpg
img/about/about3-DelniaYousefi.png
img/about/about4-arjsun.png
img/about/about5-arttacksyou.png
img/about/about6.png
img/about/about8.png
img/about/about9.png
img/amuse.jpg
img/amuse/1.png
img/amuse/2.png
img/amuse/3.png
img/benjerrys/1.png
img/benjerrys/2.jpeg
img/benjerrys/F/F.002.jpeg
img/benjerrys/ap1.png
img/benjerrys/ap2.gif
img/benjerrys/busstra.jpeg
img/benjerrys/fprop.jpeg
img/benjerrys/i1.png
img/benjerrys/i2.png
img/benjerrys/i7.png
img/benjerrys/i8.png
img/benjerrys/jf1.jpeg
img/benjerrys/jf2.jpeg
img/benjerrys/lp1i.png
img/benjerrys/lp1ii.png
img/benjerrys/lp2.gif
img/benjerrys/pfw1.jpeg
img/benjerrys/pfw2.jpeg
img/benjerrys/pp1.png
img/benjerrys/pp2.gif
img/benjerrys/screens/1%20Main%20Page.png
img/benjerrys/screens/2%20Article%20page1.png
img/benjerrys/screens/3%20Article%20page%202.png
img/benjerrys/screens/4%20Article%20page%203.png
img/benjerrys/screens/5%20Article%20page%204.png
img/benjerrys/screens/6%20Single%20Product.png
img/benjerrys/screens/Thank%20You.png
img/benjerrys/style.png
img/benjerrys/top.png
img/benjerrys/tou1.jpeg
img/benjerrys/tou2.jpeg
img/benjerrys/tou3.jpeg
img/benjerrys/vpp.jpeg
img/benjerrys/ww.jpeg
img/birks/birks.001.jpeg
img/birks/birks.002.jpeg
img/birks/birks.004.jpeg
img/birks/birks.005.jpeg
img/birks/birks.006.jpeg
img/birks/birks.007.jpeg
img/birks/birks.008.jpeg
img/birks/birks.009.jpeg
img/birks/birks.010.jpeg
img/birks/birks.011.jpeg
img/birks/birks.012.jpeg
img/birks/birks.013.jpeg
img/birks/birks.014.jpeg
img/birks/birks.015.jpeg
img/birks/birks.017.jpeg
img/birks/birks.018.jpeg
img/birks/birks.019.jpeg
img/birks/birks.020.jpeg
img/birks/birks.026.jpeg
img/birks/birks.027.jpeg
img/birks/top.png
img/birks/videos/add%20to%20my%20box.gif
img/birks/videos/birks%20inspire.gif
img/birks/videos/landingpage.gif
img/birks/videos/product%20page.gif
img/bs.png
img/bs/0.png
img/bs/1.jpg
img/bs/2.jpg
img/bs/3.png
img/bs/4.png
img/bs/5.png
img/bs/bs.png
img/gcp.png
img/gcp/AA.png
img/gcp/AR.png
img/gcp/aw.png
img/gcp/cli.png
img/gcp/gca.png
img/gcp/geminiint.png
img/gcp/gh.gif
img/gcp/ghint0.png
img/gcp/ghint1.png
img/gcp/ghint10.png
img/gcp/ghint11.png
img/gcp/ghint12.png
img/gcp/ghint2.png
img/gcp/ghint3.png
img/gcp/ghint4.png
img/gcp/ghint5.png
img/gcp/ghint6.png
img/gcp/ghint7.png
img/gcp/ghint8.png
img/gcp/ghint9.png
img/gcp/os.gif
img/invento/1.png
img/invento/2.png
img/invento/top.png
img/iwall.gif
img/iwall/1.png
img/iwall/15.png
img/iwall/19.png
img/iwall/3.png
img/iwall/8.png
img/iwall/proc1.png
img/iwall/proc2.png
img/iwall/proc3.png
img/iwall/proc4.jpg
img/iwall/proc5.jpg
img/jelly.png
img/jellybeans/1.png
img/jellybeans/10.png
img/jellybeans/11.png
img/jellybeans/12.png
img/jellybeans/13.png
img/jellybeans/14.png
img/jellybeans/15.png
img/jellybeans/16.png
img/jellybeans/17.png
img/jellybeans/18.png
img/jellybeans/19.png
img/jellybeans/2.png
img/jellybeans/20.png
img/jellybeans/21.png
img/jellybeans/22.png
img/jellybeans/23.png
img/jellybeans/24.png
img/jellybeans/25.png
img/jellybeans/26.png
img/jellybeans/3.png
img/jellybeans/4.png
img/jellybeans/5.png
img/jellybeans/6.png
img/jellybeans/7.png
img/jellybeans/8.png
img/jellybeans/9.png
img/jellybeans/jelly.png
img/kobe.png
img/kobe/ld1.png
img/kobe/ld2.png
img/kobe/ld3.png
img/kobe/ld4.png
img/kobe/nar1.png
img/kobe/nar2.png
img/kobe/nar3.png
img/kobe/nar4.png
img/kobe/nar5.png
img/kobe/nar6.png
img/kobe/nar7.png
img/kobe/vis1.png
img/kobe/vis2.png
img/kobe/vis3.png
img/kobe/vis4.webp
img/kobe/vis5.webp
img/kobe/vis6.webp
img/kobe/vis7.webp
img/placeholder.jpg
img/primagate/top.png
img/sap/top.png
img/subscriptly/top.png
img/uxhero.jpg
img/visiero.png
img/war.png
js/about.js
js/style.js
js/style.js
primagate.html
project.html
ref.html
sap.html
subscriptly.html
uxhero.html
visier.html
war.html
whatif.html

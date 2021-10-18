



# Notes on SVG for Typesetting

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Notes on SVG for Typesetting](#notes-on-svg-for-typesetting)
  - [Structure of an 'SVG Font' File](#structure-of-an-svg-font-file)
  - [Structure of a HTML Page using an 'SVG Font'](#structure-of-a-html-page-using-an-svg-font)
    - [Solution: Use Symbol from External (rejected)](#solution-use-symbol-from-external-rejected)
    - [Solution: SVG Outline-Per-Glyf in DOM](#solution-svg-outline-per-glyf-in-dom)
    - [Solution: All Inclusive](#solution-all-inclusive)
  - [Strategy: Standalone, Static Standards-Compliant File(s)](#strategy-standalone-static-standards-compliant-files)
  - [Strategy: Dual Browser Support](#strategy-dual-browser-support)
  - [SVG 'Use Symbol' with External Ressource Not Working in Chrome](#svg-use-symbol-with-external-ressource-not-working-in-chrome)
  - [Coordinate Systems, Viewports, Sizes and Units](#coordinate-systems-viewports-sizes-and-units)
    - [Page Scale Necessary?](#page-scale-necessary)
  - [Font Design Size](#font-design-size)
  - [Converting SVG Typeset Material to Other Formats](#converting-svg-typeset-material-to-other-formats)
  - [Embedding SVG in HTML](#embedding-svg-in-html)
    - [Overflow](#overflow)
    - [XXX](#xxx)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Notes on SVG for Typesetting


## Structure of an 'SVG Font' File

## Structure of a HTML Page using an 'SVG Font'

Possible solutions:

### Solution: Use Symbol from External (rejected)

* Use SVG `symbol`s in an SVG 'font' (outlines) file, and SVG `use` in an SVG 'galley' file to define and
  render outlines.

While the
[demo](https://github.com/loveencounterflow/hengist/tree/93b8ae143deea940707e03755b1d89d67c64ed08/apps-typesetting/html%2Bsvg-demos/011)
shows that this is, as such, a viable approach, there are downsides:

* **Downside:** the SVG 'font' file (which would presumably be produced dynamically rather than be realised
  as an actual file in the file system) should be constructed such that it only contains the outlines needed
  by the rendering task at hand; this is mainly a concern for CJK typesetting with its huge glyf
  inventories.
* **Downside:** The technique is known not to work in Chrome, so violates the [Dual Browser
  Strategy](#strategy-dual-browser-support).
* **Downside:** As such, it only works with a running server; one would have to further transform the output
  to make a document truly archivable.

### Solution: SVG Outline-Per-Glyf in DOM

* This is an ancient and venerable technique; one of the few popular websites that still works this way is
  [Rick Harbough's 中文.com](http://zhongwen.com/).
* **Downside:** Bazillions of (virtual) files, gazillions of HTTP requests (a lot, even with a local web
  server).
* **Downside:** Data volume increases because **(1)** *each outline needs to be wrapped in namespaced SVG
  tags*, and **(2)** *each request brings its own, highly repetitive overhead*.
* **Downside:** As such, it only works with a running server; one would have to further transform the output
  to make a document truly archivable.

### Solution: All Inclusive

A.k.a. 'Single HTML Page with Glyf Outlines Included and Arranged on One SVG Per Page' (SHPGOIAOSPP)

* Multiple print pages included and arranged in single HTML file ...
* ... that can, if need be, also be split up into separate pages.
* Glyf Outlines included in a separate SVG element near the top of the document to enable better rendering
  when big files are opened.
* Possible to add more glyf oputlines later on if in a long document that data should not be initially
  known.
* Could prepend *each* page with either *all* the outlines needed on that page, or only those that are
  *added* on that page.
* **Surprise**: Unless explicitly clipped, *SVG elements can appear outside of their respective SVG
  rectangle*.

## Strategy: Standalone, Static Standards-Compliant File(s)

The [Single HTML Page Solution](#solution-single-html-page) offers the potential to produce *passive*,
*static* yet in-browser *renderable* documents that, once compiled, **obviate the need to have a server
running just to view a document**. This is only achieved with the [All-Inclusive
Solution](#solution-all-inclusive).

* With [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) it becomes
  possible to bundle resources such as GIFs, PNGs and JPGs into a single HTML file that can easily be passed
  around.
* **Question**: Any size limit on the length of Data URLs?—**Answer**: [It
  depends.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

## Strategy: Dual Browser Support

As of 2021, there are more or less only two kind of web browsers left: those that are (built on)
Chrom(e|ium), and Mozilla Firefox. The [Chrome External Symbol
Bug](#svg-use-symbol-with-external-ressource-not-working-in-chrome) is one more indicator that the best
strategy will be to see this software will work in *both* Chromish and Firefoxish browsers.

## SVG 'Use Symbol' with External Ressource Not Working in Chrome

* See the [respective
  commit](https://github.com/loveencounterflow/hengist/tree/93b8ae143deea940707e03755b1d89d67c64ed08/apps-typesetting/html%2Bsvg-demos/011)
* use simple web server from inside that directory
* open `index.html`
* see that it does work in Firefox (v93.0) but not in Chromium (v94.0)


`foofont.svg`:

```xml
<?xml version='1.0' standalone='no'?>
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21000 29700' width='210mm' height='297mm' overflow='visible'>
<style> symbol { overflow: visible; } </style>
<symbol id='g74' width='1000' height='1000' viewBox='0,0,1000,1000'><path d='M839-18C839-31 83...827 0 839 0 839-18Z'/></symbol>
<symbol id='g77' width='1000' height='1000' viewBox='0,0,1000,1000'><path d='M586-143C586-153 ...11 586-138 586-143Z'/></symbol>
...
</svg>
```

`galley_001.svg`:

```xml
<?xml version='1.0' standalone='no'?>
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21000 29700' width='210mm' height='297mm' overflow='visible'>
<style> symbol { overflow: visible; } </style>
<use x='1000' y='1000' style='fill:red;' href='foofont.svg#g74'/>
<use x='2000' y='1000' style='fill:black;' href='foofont.svg#g77'/>
...
</svg>
```

`index.html`:

```html
<div><object
  type='image/svg+xml'
  data='./galley_001.svg'
  style='width:210mm;height:297mm;'>(Fallback for SVG here)</object></div>
```

## Coordinate Systems, Viewports, Sizes and Units


* [*MDN SVG Tutorial: Positions*](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions)
* [*SVG Viewport and View Box*](http://tutorials.jenkov.com/svg/svg-viewport-view-box.html)
* A more thorough introduction: [*Understanding SVG Coordinate Systems and Transformations (Part 1) — The
  viewport, viewBox, and preserveAspectRatio*](https://www.sarasoueidan.com/blog/svg-coordinate-systems/)
* (*W3 SVG2: Chapter 8: Coordinate Systems, Transformations and
  Units*)[https://www.w3.org/TR/SVG2/coords.html]
* (*W3 SVG2: §8.9: Units*)[https://www.w3.org/TR/SVG2/coords.html#Units]

* (*W3 SVG2: §8.4: The Initial Coordinate
  System*)[https://www.w3.org/TR/SVG2/coords.html#InitialCoordinateSystem]

> the initial viewport coordinate system (and therefore the initial user coordinate system) must have its
> origin at the top/left of the viewport, with the positive x-axis pointing towards the right, the positive
> y-axis pointing down, and text rendered with an "upright" orientation, which means glyphs are oriented
> such that Roman characters and full-size ideographic characters for Asian scripts have the top edge of the
> corresponding glyphs oriented upwards and the right edge of the corresponding glyphs oriented to the
> right.—(W3 SVG2 *§8.4: The Initial Coordinate System*)[https://www.w3.org/TR/SVG2/coords.html#InitialCoordinateSystem]

* The dimensionless units that are (preferably) used in SVG documents can be scaled to relate to a physical
  size by setting a CSS style attribute `width` on the `<object>` tag that represents the SVG file in an
  HTML document:

* In the SVG document, we set a view box having width and height (here: 10000 user units):

  ```svg
  <?xml version='1.0' standalone='no'?>
  <svg xmlns='http://www.w3.org/2000/svg'
    xmlns:xlink='http://www.w3.org/1999/xlink'
    viewBox='0 0 10000 10000'
    overflow='visible'>
  ```

* In the HTML document we render the SVG by way of an explicitly sized `<object>` tag:

  ```html
  <object
    type='image/svg+xml'
    data='./sample-font.svg'
    style='width:1000mm'>
      (Fallback for SVG here)
      </object>
  ```

* In the above example, we have mapped 10'000u (user units) to 1'000mm (= 1m) of real-world length.

* 90dpi ≘ 3.543307px per mm (what Inkscape used to use), but I believe the common standard these days is
* 96dpi ≘ 3.779527559px per mm

### Page Scale Necessary?

* All content rendered too small in browsers
* but why does the browser scale all content?
* tested in Firefox, Vivaldi, Brave...

```html
<style>
  body {
    transform-origin:       0px 0px 0px;
    transform:              scale(1.43,1.43); }
  hgauge { ... }
  vgauge { ... }
</style>

<body>
  <hgauge>hgauge</hgauge>
  <vgauge>vgauge</vgauge>
  </body>
```

## Font Design Size

* fixed at 1000⨉1000
* only intzeger steps, no decimal fractions
* should be good enough
* numbers are human-readable, coordinate pairs like `( 560, 2000 )` are immediately intelligible (although a
  hundred lines / ems à 1000 units gives `y = 100000` which is far more readable with thousands separator, `y =
  100_000`)
* alternative: design size of 1⨉1 (!), then we have *only* fractional measurements within each glyph
  outline; extra care must be taken to always round at 4 digits after the decimal point; the good thing is
  when seeing `( 78.4430, 23.0114 )` one can immediately say it's 78 ems to the right and 23 ems down. But
  this is highly unusual and needs further evaluation.

## Converting SVG Typeset Material to Other Formats

* in the browser
* https://github.com/shakiba/svgexport/, which uses puppeteer

```bash
svgexport 'sample-font.svg' '/tmp/preview.png' 0.1x
```

## Embedding SVG in HTML

### Overflow

* `overflow` attribute in `<svg>` element *always* set to `visible`.
* in addition, in the `<style>` section, `overflow: visible` is set for all `<symbol>`s.

### XXX


```xml
<?xml version='1.0' standalone='no'?>
<svg xmlns='http://www.w3.org/2000/svg'
  xmlns:xlink='http://www.w3.org/1999/xlink'
  viewBox='0 0 10000 10000'
  overflow='visible'>
<style>
  symbol { overflow: visible; }
</style>
<symbol id='g33' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/0040 @ --><path d='M706-68C706-78 700-78 681-78C665-78 663-78 647-71C566-34 478-11 389-11C251-11 182-119 182-246C182-470 377-683 556-683C681-683 759-581 759-448C759-400 721-150 632-150C626-150 614-150 614-175C614-181 616-189 617-195L682-458C683-461 684-471 684-471C684-481 677-481 661-481L635-481C627-501 601-566 522-566C403-566 279-429 279-286C279-188 341-128 417-128C483-128 533-174 553-193C556-136 607-128 628-128C699-128 731-200 746-241C747-244 789-354 789-445C789-611 684-705 557-705C356-705 151-480 151-248C151-113 230 11 388 11C402 11 471 11 558-11C584-17 706-52 706-68ZM570-268C561-232 488-150 420-150C357-150 340-224 340-270C340-401 437-544 522-544C596-544 613-458 613-444L610-430Z'/></symbol>
<symbol id='g34' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/0042 B --><path d='M677-219C677-302 610-348 538-357C660-384 734-470 734-547C734-619 675-683 566-683L255-683C239-683 228-683 228-664C228-652 236-652 255-652C286-652 313-652 313-635C313-632 313-630 309-616L174-73C166-39 160-31 92-31C76-31 65-31 65-12C65 0 74 0 90 0L420 0C562 0 677-115 677-219ZM646-553C646-468 569-366 455-366L323-366L385-616C394-652 401-652 434-652L552-652C636-652 646-584 646-553ZM588-232C588-135 508-31 398-31L274-31C243-31 243-34 243-41C243-47 246-57 247-63L317-344L489-344C582-344 588-258 588-232Z'/></symbol>
<symbol id='g35' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/0062 b --><path d='M459-286C459-393 399-442 339-442C301-442 267-421 233-389L303-669C304-672 306-682 306-682C306-691 300-694 292-694C289-694 279-693 276-692L177-684C165-683 154-682 154-663C154-652 164-652 178-652C226-652 228-645 228-635C228-632 225-618 225-618L126-223C125-220 115-179 115-141C115-57 157 11 230 11C342 11 459-139 459-286ZM336-106C324-81 281-11 230-11C205-11 172-32 172-107C172-151 181-186 210-300C217-324 217-326 232-346C261-386 299-420 337-420C382-420 392-363 392-331C392-289 365-170 336-106Z'/></symbol>
<symbol id='g36' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/005c \ --><path d='M386 230C386 230 387 225 385 212L280-728C279-739 278-750 264-750C253-750 241-741 239-730C239-730 237-725 239-712L344 228C345 239 347 250 361 250C372 250 383 241 386 230Z'/></symbol>
<symbol id='g37' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/007c | --><path d='M105 217L338-717C342-731 347-750 327-750C307-750 302-731 298-717L65 217C61 231 57 250 77 250C97 250 101 231 105 217Z'/></symbol>
<symbol id='g38' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/007b { --><path d='M612-739C615-750 607-750 595-750C495-750 393-699 373-627L327-444C304-350 300-334 267-306C249-292 215-265 151-261C144-261 137-260 135-250C132-240 138-240 148-239C190-236 270-215 245-115L195 83C181 141 172 175 215 212C251 242 314 250 345 250C357 250 365 250 367 239C370 229 364 229 354 228C276 223 251 178 251 142C250 131 251 129 260 94L297-56C305-86 317-137 318-147C321-213 264-239 228-250C354-284 372-355 379-383L424-563C442-635 447-657 478-682C500-700 529-724 600-728C605-729 610-733 612-739Z'/></symbol>
<symbol id='g39' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/007d } --><path d='M490-250C492-260 486-260 476-261C434-264 354-285 379-385L429-583C443-641 452-675 409-712C373-741 312-750 280-750C270-750 260-750 257-739C254-729 260-729 270-728C348-723 374-678 374-642C374-631 373-629 365-594L327-444C320-414 307-363 306-353C303-287 360-261 397-250C270-216 252-145 245-117L200 63C182 135 177 157 147 182C124 200 95 224 24 228C19 229 14 233 12 239C10 250 20 250 30 250C130 250 231 199 251 127L297-56C321-150 325-166 358-194C375-208 409-235 473-239C480-239 487-240 490-250Z'/></symbol>
<symbol id='g40' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/005b [ --><path d='M206 222C206 210 196 210 180 210L121 210L351-710L416-710C434-710 435-711 439-715C442-720 446-738 446-738C446-750 436-750 420-750L343-750C321-750 320-750 315-731L76 225C75 228 73 238 73 238C73 250 83 250 99 250L176 250C194 250 195 249 199 245C202 240 206 222 206 222Z'/></symbol>
<symbol id='g41' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/005d ] --><path d='M117 231L356-725C357-728 359-738 359-738C359-750 349-750 333-750L256-750C238-750 237-749 233-745C230-740 226-722 226-722C226-710 236-710 252-710L311-710L81 210L16 210C-2 210-3 211-7 215C-10 220-14 238-14 238C-14 250-4 250 12 250L89 250C111 250 112 250 117 231Z'/></symbol>
<symbol id='g42' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/0043 C --><path d='M810-681C811-685 812-691 812-695C812-695 811-705 801-705C801-705 794-705 785-694L722-620C679-689 621-705 571-705C365-705 150-480 150-245C150-81 257 22 395 22C590 22 699-192 699-240C699-250 689-250 684-250C678-250 671-250 668-242C617-73 492-9 409-9C325-9 237-65 237-207C237-269 262-426 342-536C410-628 502-674 579-674C685-674 721-578 721-491C721-465 716-433 716-430C716-420 726-420 731-420C742-420 745-421 749-438Z'/></symbol>
<symbol id='g43' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/0063 c --><path d='M468-104C468-109 460-120 452-120C448-120 447-119 439-109C365-15 276-11 259-11C205-11 180-56 180-114C180-167 207-272 233-320C269-385 319-420 364-420C375-420 420-418 435-377C385-371 385-328 385-328C385-312 396-296 419-296C446-296 470-318 470-356C470-405 427-442 363-442C239-442 110-300 110-154C110-55 169 11 257 11C385 11 468-89 468-104Z'/></symbol>
<symbol id='g44' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/003a : --><path d='M222-63C222-85 206-106 178-106C146-106 113-76 113-43C113-17 131 0 157 0C191 0 222-33 222-63ZM303-388C303-411 287-431 259-431C225-431 194-399 194-368C194-345 210-325 238-325C272-325 303-357 303-388Z'/></symbol>
<symbol id='g45' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/002c , --><path d='M224-47C224-80 210-106 178-106C138-106 113-71 113-42C113-10 136 0 157 0C177 0 193-11 198-15C183 62 133 126 86 166C74 178 73 179 73 183C73 186 76 193 83 193C101 193 224 72 224-47Z'/></symbol>
<symbol id='g46' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/0044 D --><path d='M775-438C775-581 694-683 565-683L253-683C237-683 226-683 226-664C226-652 234-652 253-652C284-652 311-652 311-635C311-632 311-630 307-616L172-73C164-39 158-31 90-31C74-31 63-31 63-12C63 0 72 0 88 0L395 0C584 0 775-213 775-438ZM692-476C692-417 663-230 578-130C529-73 458-31 378-31L275-31C244-31 244-34 244-41C244-47 247-57 248-63L386-616C395-651 402-652 435-652L532-652C613-652 692-607 692-476Z'/></symbol>
<symbol id='g47' width='1000' height='1800' viewBox='0,0,1000,1000'><!-- u/0064 d --><path d='M535-143C535-153 527-153 520-153C508-153 507-152 501-130C487-74 468-11 434-11C408-11 408-38 408-52C408-59 408-74 414-98L557-669C558-672 560-682 560-682C560-691 554-694 546-694C543-694 533-693 530-692L431-684C419-683 408-682 408-663C408-652 418-652 432-652C480-652 482-645 482-635C482-632 479-618 479-618L421-384C406-415 379-442 337-442C226-442 108-290 108-144C108-59 154 11 229 11C265 11 309-10 349-59C360-10 397 11 432 11C469 11 490-14 505-45C523-83 535-143 535-143ZM355-122C347-91 286-11 231-11C184-11 176-70 176-100C176-150 207-267 225-309C250-370 296-420 337-420C345-420 368-419 386-391C396-375 406-346 406-327C406-324 405-320 403-314Z'/></symbol>
<use x='0'    y='0' style='fill:red;'   xlink:href="#g117"/>
<use x='250'    y='0' style='fill:red;'   xlink:href="#g117"/>
<use x='500'    y='0' style='fill:red;'   xlink:href="#g117"/>
<use x='1000' y='800' style='fill:green;' xlink:href="#g118"/>
<use x='2000' y='800' style='fill:green;' xlink:href="#g119"/>
<use x='3000' y='800' style='fill:green;' xlink:href="#g120"/>
<use x='4000' y='800' style='fill:green;' xlink:href="#g121"/>
<use x='5000' y='800' style='fill:green;' xlink:href="#g122"/>
<use x='6000' y='800' style='fill:green;' xlink:href="#g123"/>
<use x='7000' y='800' style='fill:green;' xlink:href="#g124"/>
<use x='8000' y='800' style='fill:green;' xlink:href="#g125"/>
<use x='9000' y='800' style='fill:blue;'  xlink:href="#g402"/>
</svg>
```





<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Data Sources](#data-sources)
  - [RSGs and Unicode Codepoint Ranges](#rsgs-and-unicode-codepoint-ranges)
  - [Styles, CID Ranges, Font Names](#styles-cid-ranges-font-names)
  - [Disjunct Ranges](#disjunct-ranges)
- [To Do](#to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


CSS rules in general (and CSS3 Unicode Range rules in particular) work by the 'backwards early worm'
principle (i.e. who comes late takes the cake), analogous to JS `Object.assign( a, b, c )` where any
attribute in the later argument, say `c.x`, will override (shadow) any homonymous attribute in both `a` and
`b`.

> This is the right way to do it: When doing configurations, we want to start with defaults and end with
> specific overrides. Linux' Font-Config got this backwars which is one reason it sucks so terribly:
> you can't make one of your own rules become effective unless you wrestle against a system that believes
> earlier settings must override later ones. Anyhoo.


```
═════════════════ ══════════════════════════  ══════════════════════════════════════════════════════════════
superset          ABCDEFGHIJKLMNOPQRSTUVWXYZ  │ CSS-like Configuration with Overlapping Ranges
————————————————— ——————————————————————————  ——————————————————————————————————————————————————————————————
font1             BCDEFGH J L NOPQRSTUVWX    │ [B-H] [J] [L] [N-X]                      ◮ least precedence
font2             BCD                        │ [B-D]                                    │
font3                  GHI                   │ [G-I]                                    │
font4                        MNOPQ           │ [M-Q]                                    │
font5                        M OPQRST        │ [M] [O-T]                                │
font6                        M       U  XY   │ [M] [U] [X-Y]                            │ most precedence
═════════════════ ══════════════════════════  ══════════════════════════════════════════════════════════════
superset          ABCDEFGHIJKLMNOPQRSTUVWXYZ  │
————————————————— ——————————————————————————  ——————————————————————————————————————————————————————————————
font1              ┼┼┼EF┼┼│J L│┼┼┼┼┼┼┼┼VW┼│   │                                          ◮ least precedence
font2              BCD  │││   │││││││││  ││   │                                          │
font3                   GHI   │││││││││  ││   │                                          │
font4                         ┼N┼┼┼││││  ││   │                                          │
font5                         ┼ OPQRST│  ││   │                                          │
font6                         M       U  XY   │                                          │ most precedence
═════════════════ ══════════════════════════  ══════════════════════════════════════════════════════════════
superset          ABCDEFGHIJKLMNOPQRSTUVWXYZ  │ Kitty-like Configuration with Disjunct Ranges
————————————————— ——————————————————————————  ——————————————————————————————————————————————————————————————
font1                 EF   J L         VW     │ [E-F] [J] [L] [V-W]                      ◮ least precedence
font2              BCD                        │ [B-D]                                    │
font3                   GHI                   │ [G-I]                                    │
font4                          N              │ [N]                                      │
font5                           OPQRST        │ [O-T]                                    │
font6                         M       U  XY   │ [M] [U] [X-Y]                            │ most precedence

NB
* first mentioned => 'most fallback' => least precedence
* last  mentioned => 'least fallback' => most precedence
```

[The Kitty terminal emulator](https://sw.kovidgoyal.net/kitty/index.html) is special for a terminal emulator
in that **Kitty allows to configue fonts by codepoints and codepoint ranges** similar to what is possible on
web pages using CSS3 Unicode Ranges; in fact, its syntax—example:

```
symbol_map U+4E00-U+9FFF  HanaMinA Regular
symbol_map U+4D00-U+9FFF  EPSON 行書体Ｍ
```

—is so similar to CSS that one might believe the semantics will likewise be compatible.

Alas, this is not so, and it also looks like Kitty's interpretation can't possibly have been meant to work
the way it does. For example, when I configure

```
# Note: do *not* use inline comments as shown below, they will not be parsed correctly
font_family               IosevkaNerdFontCompleteM-Thin
symbol_map U+61-U+7a      Iosevka-Slab-Heavy  # (1) /[a-z]/
symbol_map U+51-U+5a      Iosevka-Slab-Heavy  # (2) /[Q-Z]/
symbol_map U+61           LastResort          # (3) /[a]/
symbol_map U+65           LastResort          # (4) /[e]/
symbol_map U+69           LastResort          # (5) /[i]/
symbol_map U+6F           LastResort          # (6) /[o]/
symbol_map U+75           LastResort          # (7) /[u]/
symbol_map U+51-U+53      LastResort          # (8) /[QRS]/
symbol_map U+59-U+5a      LastResort          # (9) /[YZ]/
```

I'd expect the outcome to be as follows:

* **(1)** Use `IosevkaNerdFontCompleteM-Thin` as default,
* **(2)** except for the lower case `[a-z]` range, for which use `Iosevka-Slab-Heavy`,
* **(3)** except for the upper case `[Q-Z]` range, for which likewise use `Iosevka-Slab-Heavy`; of these,
* **(4-7)** use LastResort for `/[aeiou]/`, overriding **(1)**,
* **(8)** use LastResort for `/[QRS]/` overriding **(2)**,
* **(9)** use LastResort for `/[YZ]/`, likewise overriding **(2)**.

What happens in reality is that Kitty applies the only rules **(1)**, **(2)**, **(3)**, **(8)**, but
discards **(4)**, **(5)**, **(6)**, **(7)** and **(9)**; it so happens that both the ranges / single
codepoints addressed in the shadowing rules that *were* honored (**(3)** and **(8)**), their first
codepoints (`a` = `U+61` and `Q` = `U+51`) coincided with the first codepoints of the rules they shadowed.
Observe that while e.g. codepoint `e` = `U+65` of rule **(4)** is indeed the first (and only) codepoint of
that rule, that is not what matters; what matters is where that shadowing codepoint falls within the rule it
is intended to supplant, namely rule **(1)**. Since there it is the 5th, not the 1st codepoint of the range
given, it does—erroneuosly, one should think—not succeed.

This is a somewhat weird and at any rate unexpected behavior that cannot possibly have been the intent of
the developers. There is no way users could be expected to follow or profit from such strange rules, so I
assume this must be a bug.

The **solution** to this problematic behavior would seem to consist in **only using disjunct `symbol_map`
ranges** by avoiding to mention any codepoint more than once.

References:

* [Extension Kitty graphics protocol to support fonts #2259](https://github.com/kovidgoyal/kitty/issues/2259)
* [Symbol map problem #1948](https://github.com/kovidgoyal/kitty/issues/1948)






* Do not use an all-boxes fallback font such as LastResort as standard font as one could do in CSS; the font
  named under in `font_family` [is used to calculate cell metrics, this happens before any
  fallback](https://github.com/kovidgoyal/kitty/issues/2396#issuecomment-590639250)


## Data Sources

The style mappings are generated from two source files: the first data source file introduces some
convenient abbreviations for some Unicode ranges of interest (my personal interest is in CJK characters so
those feature prominently).

These 'Range Sigils' (RSGs) can then be used in lieu of concrete numbers in the second file that
basically tells you what font to use for which codepoints.

### RSGs and Unicode Codepoint Ranges

This is what the first file—`rsgs-and-blocks.txt`—looks like:

```
# file rsgs-and-blocks.txt
# IC Group  Range Sigil (RSG)     Kanji  CID-Range                Unicode Block Name
# ————————  ————————————————————  —————  ———————————————————————  ———————————————————————————————————————
jzr---      jzr                   true   0x0e000..0x0f8ff         Jizura
ux0000      u-latn                false  0x00000..0x0007f         Basic Latin
ux0060      u-arab                false  0x00600..0x006ff         Arabic
uchira      u-cjk-hira            false  0x03040..0x0309f         Hiragana
uc0---      u-cjk                 true   0x04e00..0x09fff         CJK Unified Ideographs
uccmp-      u-cjk-cmp             true   0x03300..0x033ff         CJK Compatibility
uccmp1      u-cjk-cmpi1           true   0x0f900..0x0faff         CJK Compatibility Ideographs
uccmp2      u-cjk-cmpi2           true   0x2f800..0x2fa1f         CJK Compatibility Ideographs Supplement
uccmpf      u-cjk-cmpf            true   0x0fe30..0x0fe4f         CJK Compatibility Forms
ucelet      u-cjk-enclett         true   0x03200..0x032ff         Enclosed CJK Letters and Months
ucesup      u-cjk-encsupp         true   0x1f200..0x1f2ff         Enclosed Ideographic Supplement
uchalf      u-halfull             true   0x0ff00..0x0ffef         Halfwidth and Fullwidth Forms
uckanb      u-cjk-kanbun          true   0x03190..0x0319f         Kanbun
ucrad1      u-cjk-rad1            true   0x02f00..0x02fdf         Kangxi Radicals
```

From this we derive an object whose keys are RSGs and whose values represent CID ranges

```js
{ 'u-cjk-hira':       Segment(2) [  12352,  12447 ],
  'u-cjk-kanasupp':   Segment(2) [ 110592, 110847 ],
  'u-cjk-kata':       Segment(2) [  12448,  12543 ],
  'u-cjk-kata-x':     Segment(2) [  12784,  12799 ],
  'u-cjk-kana-xa':    Segment(2) [ 110848, 110895 ] }
```


### Styles, CID Ranges, Font Names

Next, we have a data source file that identifies a style and states, for that style, single code points or
sets of codepoints for which we want to use a given font (here identified by monikers called 'fontnicks',
but it could be PostScript font names or any unique identifier):

```
# file styles-codepoints-and-fontnicks.txt
# Style Tag                   CID Range                   Font Nick
# ——————————————————————————  ——————————————————————————  ————————————————————————————————
+style:ming                   *                           sunexta
+style:ming                   rsg:u-cjk-cmpi1             babelstonehan
+style:ming                   rsg:u-cjk-xd                babelstonehan
+style:ming                   '＠'                        sunexta
+style:ming                   0x9fb0..0x9fff              thtshynpzero
+style:ming                   0x9feb..0x9fff              unifonttwelve
```

CID range literals come in a few flavors:
* the asterisk `*` marks 'anything in Unicode', so comprises all codepoints between `U+0000` and `U+10ffff`;
* entries prefixed with `rsg:` use the range sigils (RSGs) as introduced above, so must be looked up in that
  data structure;
* entries in quotes use a single character to denote a single codepoint literally;
* entries that look like `0xNNNN..0xNNNN` spell out a range by giving the first and last CIDs in
  hexadecimal.

> NOTE we conveniently ignore the style tag for the purpose at hand; these become important when one wants
> to typeset in different styles—say, use serif fonts of normal weight for running text but sans-serif bold
> fonts for headings.

This—with the addition of a simple `fontnick -> psname` lookup—gives use a list of ranges and associated
fonts; note that entries are order in their order of occurrance, which, as we have stated above, means
earlier ones have less precedence than later ones:

```js
# configured_ranges:
[ { fontnick: 'sunexta',       psname: 'Sun-ExtA',      lap: Interlap(1) [ Segment(2) [      0, 1114111 ] ] },
  { fontnick: 'babelstonehan', psname: 'BabelStoneHan', lap: Interlap(1) [ Segment(2) [  63744,   64255 ] ] },
  { fontnick: 'babelstonehan', psname: 'BabelStoneHan', lap: Interlap(1) [ Segment(2) [ 177984,  178207 ] ] } ]
````


### Disjunct Ranges

We now know everything to derive a sequence of disjunct discontinuous CID ranges that identifies the font to
be used for any codepoint. This we do by iterating over the entries in `configured_ranges` in the reverse,
keeping note of all the codepoints covered so far. For each entry, the disjunct codepoints—those that do not
overlap with any other range—are those mentioned in the `configured_ranges` entry, minus any codepoints
mentioned in any entries with higher precedences (that come closer to the bottom of the configuration file).

In this simplified case, we then find (using the Unicode convention for writing CID ranges):

```
disjunct range Sun-ExtA                  U+0000-U+f8ff
disjunct range Sun-ExtA                  U+fb00-U+2b73f
disjunct range Sun-ExtA                  U+2b820-U+10ffff
disjunct range BabelStoneHan             U+f900-U+faff
disjunct range BabelStoneHan             U+2b740-U+2b81f
```

In the general case, any font mentioned anywhere in the configuration
(`styles-codepoints-and-fontnicks.txt`) *except for the very last entry* might end up not being used at all,
or its use being split up into any number of non-adjacent ranges. Also observe that because of all ranges
being disjunct, their relative ordering becomes immaterial.



## To Do

* [ ] treat asterisk-font special: use it for `font_family`, omit it from `symbol_map` lines
* [X] exclude non-character codepoints as per https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Special_code_points






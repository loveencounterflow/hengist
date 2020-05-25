
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
superset          ABCDEFGHIJKLMNOPQRSTUVWXYZ  │ Kiitty-like Configuration with Disjunct Ranges
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


(function() {
  'use strict';
  var CND, badge, debug, echo, help, info, isa, rpr, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'CHOICY-FORMULAS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, validate} = types.export());

  /*

   * Original Code Comment from `mojikura3-model/db/245-sfx.sql`:

  A **Choicy Formula** (*cFormula*) is a formula in which alternative resolutions have been made explicit.
  For example, glyph u-cjk-xa/3b79 㭹 can be equivalently described as either `⿰木弦` or as
  `⿰杛玄`; we notate these possibilities in a single Choicy Formula as `{㭹|⿰木弦|⿰杛玄}`.
  Both of these formulas are classed as *Short Formulas*, or *sFormulas*, because both represent
  ways to decompose the glpyh in question into a minimal number of formula parts.

  A Choicy Formula always starts with the glyph itself as the first choice, and then lists
  all of the alternative decompositions, separated by `|` pipe symbols.

  Choicy formulas can be expanded by substituting all decomposable elements by their respective
  Choicy Formulas. Since `弦` and `杛` can be decomposed into `{弦|⿰弓玄}` and `{杛|⿰木弓}`,
  a deeper representation of 㭹 can be written as `{㭹|⿰木{弦|⿰弓玄}|⿰{杛|⿰木弓}玄}`.

  Notice how Choicy Formulas, unlike 'destructive' element substitutions, presevere the intermediate
  steps and the identities of the substituted formula constituents; hence, it is possible
  to not only reconstruct the sFormula(s) of the glyph described, but also (from a fully resolved
  Choicy Formula), its *Factorial Formula* (*fFormula*) and, crucially, all well-formed
  intermediate IDL decompositions of the glyph. This functionality is provided by function
  `SFX.expand( glyph, cformula )`. In the simple case, seemingly nothing of interest gets added to our
  input, and we get (edited for readablity; actual return value is a list):

  ```
  select SFX.expand( '㭹', '{㭹|⿰木{弦|⿰弓玄}|⿰{杛|⿰木弓}玄}' ); ->

  㭹
  ⿰杛玄
  ⿰木弦
  ⿰⿰木弓玄
  ⿰木⿰弓玄
  ```

  > Note that `SFX.expand()` does not (yet) perform formula normalization; with formula normalization
  > applied, the last two decompositions would both turn into `(⿰木弓玄)`, and the function
  > would return a list of 4 instead of 5 items.

  Let's add some depth to our cFormula and see what happens. A:uc0---:007384:玄 *Arcanum* is classified as a
  Factor and most of the time, we will persue decompositions no further than down to the level of factors.
  If we were to decompose 玄, however, we'd find that there are three obvious ways to assemble 玄 from
  smaller parts, *viz.* ⿱亠幺 (the most obvious one), ⿱丶𢆰 (which is equally valid), and ⿰𤣥丶 (a little
  more contrived, but not without historical significance, see 𤣥 *Arcanum attenuatissimum*); therefore,
  we have `{玄|⿱亠幺|⿱丶𢆰|⿰𤣥丶}`, and substituting this into the above cFormula for 㭹 gives us
  {㭹|⿰木{弦|⿰弓{玄|⿱亠幺|⿱丶𢆰|⿰𤣥丶}}|⿰{杛|⿰木弓}{玄|⿱亠幺|⿱丶𢆰|⿰𤣥丶}}. Expansion
  (and normalization) turns this into:

  ```
  㭹
  ⿰木弦
  (⿰木弓玄)
  (⿰木弓⿱亠幺)
  (⿰木弓⿱丶𢆰)
  (⿰木弓𤣥丶)
  ⿰杛玄
  ⿰杛⿱亠幺
  ⿰杛⿱丶𢆰
  (⿰杛𤣥丶)
  ```

  The beauty of this rather exhaustive, nine-fold decomposition of our glyph 㭹 lies in the fact
  that we can derive a similarly exhaustive set of **Relational Bigrams** (*rbGrams*) from the
  formulas:

  ```
  ⿰弓丶
  ⿰弓亠
  ⿰弓玄
  ⿰弓𤣥
  ⿰木弓
  ⿰木弦
  ⿰杛丶
  ⿰杛亠
  ⿰杛玄
  ⿰杛𤣥
  ⿰𤣥丶
  ⿱丶𢆰
  ⿱亠幺
  ```

  Relational Bigrams afford an X-ray like peek into (some local details in) the inner makeup of characters;
  thus, the central part of 㭹 shows 弓 *Arcus* to the left of 𤣥 *Arcanum attenuatissimum*, and the
  rbGram ⿰弓𤣥 captures this bit of detail.

   */
  //===========================================================================================================
  this.XXX = class XXX extends Array {
    //---------------------------------------------------------------------------------------------------------
    constructor(...P) {
      var i, len, p;
      super();
      for (i = 0, len = P.length; i < len; i++) {
        p = P[i];
        this.push(p);
      }
      return void 0;
    }

  };

  this.Glyph = class Glyph extends this.XXX {};

  this.Formulas = class Formulas extends this.XXX {};

  this.Formula = class Formula extends this.XXX {};

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function() {
    var registry;
    // debug '^4575^', new @X '㭹', [ '⿰杛玄', '⿰木弦', ]
    return registry = [];
  };

  // registry[ '㭹' ]  = new @Glyph '㭹', ( @Formula.from '⿰杛玄' ), ( @Formula.from '⿰木弦' )
  // registry[ '弦' ]  = new @Glyph '弦', ( @Formula.from '⿰弓玄' )
  // registry[ '杛' ]  = new @Glyph '杛', ( @Formula.from '⿰木弓' )
  // registry[ '玄' ]  = new @Glyph '玄', ( @Formula.from '⿱亠幺' ), ( @Formula.from '⿱丶𢆰' ), ( @Formula.from '⿰𤣥丶' )
  // registry[ '㭹' ]  = new @Glyph '㭹', new @Formulas ( @Formula.from '⿰杛玄' ), ( @Formula.from '⿰木弦' )
  // registry[ '弦' ]  = new @Glyph '弦', new @Formulas ( @Formula.from '⿰弓玄' )
  // registry[ '杛' ]  = new @Glyph '杛', new @Formulas ( @Formula.from '⿰木弓' )
  // registry[ '玄' ]  = new @Glyph '玄', new @Formulas ( @Formula.from '⿱亠幺' ), ( @Formula.from '⿱丶𢆰' ), ( @Formula.from '⿰𤣥丶' )

  //-----------------------------------------------------------------------------------------------------------
  this.string_demo = function() {
    var IDLX, cformula, chr, chrs, component, components, count, glyph, i, idx, j, k, len, len1, non_components, rcformula, ref, ref1, ref2, registry;
    IDLX = require('../../../../../io/mingkwai-rack/mojikura-idl');
    non_components = new Set(Array.from("|()[]{}§'≈'●⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻〓≈ ↻↔ ↕ ▽"));
    registry = {};
    registry['弦'] = '{弦|⿰弓玄}';
    registry['杛'] = '{杛|⿰木弓}';
    registry['木'] = '{木|⿻十人}';
    registry['㭹'] = '{㭹|⿰杛玄|⿰木弦}';
    registry['十'] = '{十|⿻一丨}';
    registry['人'] = '{人|⿰丿㇏}';
    registry['玄'] = '{玄|⿱亠幺|⿱丶𢆰|⿰𤣥丶}';
    for (glyph in registry) {
      cformula = registry[glyph];
      chrs = Array.from(cformula);
      while (true) {
        // info '^558^', glyph, cformula
        count = 0;
        for (idx = i = 3, ref = chrs.length - 1; (3 <= ref ? i < ref : i > ref); idx = 3 <= ref ? ++i : --i) {
          chr = chrs[idx];
          if (non_components.has(chr)) {
            continue;
          }
          if ((rcformula = registry[chr]) == null) {
            continue;
          }
          count++;
          chrs.splice(idx, 1, Array.from(rcformula));
        }
        if (count === 0) {
          break;
        }
      }
      registry[glyph] = chrs = chrs.flat().join('');
    }
    for (glyph in registry) {
      cformula = registry[glyph];
      urge('^443^', glyph, cformula);
      components = new Set();
      ref1 = this.SFX_expand(glyph, cformula);
      for (j = 0, len = ref1.length; j < len; j++) {
        rcformula = ref1[j];
        ref2 = [...cformula];
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          component = ref2[k];
          if (component === glyph) {
            continue;
          }
          if (non_components.has(component)) {
            continue;
          }
          components.add(component);
        }
        help('^443^', glyph, rcformula);
      }
      info('^4568^', glyph, [...components].join(''));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.SFX_expand = function(glyph, cformula) {
    var cformulas, choice, choices, collector, hint, i, j, len, len1, match, new_formula, position, prefix, ref, suffix, term, term_pattern;
    // declare
    collector = null; // text[];
    cformulas = [cformula]; // text[]  :=  array[ cformula ];
    term_pattern = /(?<term>\{[^{}]+\})/u; // text    :=  '\{[^{}}]+\}';
    match = null;
    term = null; // text;
    position = null; // integer;
    prefix = null; // text;
    suffix = null; // text;
    choice = null; // text;
    choices = null; // text[];
    hint = ''; // text    :=  '';
    new_formula = null; // text;
    while (true) {
      //.........................................................................................................
      // begin
      collector = [];
//.......................................................................................................
      for (i = 0, len = cformulas.length; i < len; i++) {
        cformula = cformulas[i];
        //.....................................................................................................
        if ((match = cformula.match(term_pattern)) != null) {
          term = match.groups.term;
          // debug '^222^', rpr term
          position = cformula.indexOf(term);
          prefix = position === 0 ? '' : cformula.slice(0, +(position - 1) + 1 || 9e9);
          suffix = (ref = cformula.slice(position + term.length)) != null ? ref : '';
          choices = term.slice(1, +(term.length - 2) + 1 || 9e9).split('|');
// urge '^44472^', { cformula, position, }
// urge '^44472^', { prefix, term, suffix, }
// urge '^44472^', { choices, }
//...................................................................................................
          for (j = 0, len1 = choices.length; j < len1; j++) {
            choice = choices[j];
            new_formula = prefix + choice + suffix;
            // debug '^33423^', glyph, new_formula
            // debug '^33423^', glyph, collector
            // if not array[ new_formula ] <@ collector then
            // if false
            collector.push(new_formula);
          }
        }
      }
      //.......................................................................................................
      if (collector.length === 0) {
        return Array.from(new Set(cformulas));
      }
      //.......................................................................................................
      // cformulas = U.array_unique( collector );
      cformulas = Array.from(new Set(collector));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.list_demo = function() {
    var _, d, element, formula, formulas, glyph, i, idx, j, len, len1, registry;
    registry = {};
    registry['㭹'] = ['㭹', [...'⿰杛玄'], [...'⿰木弦']];
    registry['弦'] = ['弦', [...'⿰弓玄']];
    registry['杛'] = ['杛', [...'⿰木弓']];
    registry['玄'] = ['玄', [...'⿱亠幺'], [...'⿱丶𢆰'], [...'⿰𤣥丶']];
    registry['木'] = ['木', [...'⿻十人']];
    for (glyph in registry) {
      d = registry[glyph];
      [_, ...formulas] = d;
      urge('^589^', glyph);
      for (i = 0, len = formulas.length; i < len; i++) {
        formula = formulas[i];
        whisper('^589^  ', formula);
        for (idx = j = 0, len1 = formula.length; j < len1; idx = ++j) {
          element = formula[idx];
          if ((d = registry[element]) == null) {
            continue;
          }
          whisper('^589^    ', d);
          formula[idx] = d;
        }
        info('^589^  ', formula);
      }
    }
    // for x, idx in d
    //   if idx is 0
    //   if
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await @list_demo()
      return (await this.string_demo());
    })();
  }

}).call(this);

//# sourceMappingURL=mojikura-sfx-choicy-formulas-with-multiple-expansions.js.map
(function() {
  'use strict';
  var CND, INTERTEXT, badge, cast, compute_naive_ascii_monospace_width, debug, echo, help, info, isa, jr, rpr, type_of, types, urge, validate, warn;

  /*

  * MIT 6.006 Introduction to Algorithms, Fall 2011, View the complete course: http://ocw.mit.edu/6-006F11
    Instructor: Erik Demaine; [20. Dynamic Programming II: Text Justification,
    Blackjack](https://youtu.be/ENyox7kNKeY?t=1027)

  * [Text Justification Dynamic Programming (Tushar Roy - Coding Made
    Simple)](https://www.youtube.com/watch?v=RORuwHiblPc). Given a sequence of words, and a limit on the
    number of characters that can be put in one line (line width). Put line breaks in the given sequence such
    that the lines are printed neatly. See code at
    https://github.com/mission-peace/interview/blob/master/src/com/interview/dynamic/TextJustification.java

   */
  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERTEXT/DEMO-SLAB-BASED-TYPESETTING';

  debug = CND.get_logger('debug', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  help = CND.get_logger('help', badge);

  warn = CND.get_logger('warn', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  jr = JSON.stringify;

  // test                      = require 'guy-test'
  types = new (require('intertype')).Intertype();

  ({isa, validate, cast, type_of} = types);

  // SP                        = require '../../../apps/steampipes'
  // { $
  //   $async
  //   $watch
  //   $show
  //   $drain }                = SP.export()
  INTERTEXT = require('../../../apps/intertext');

  //-----------------------------------------------------------------------------------------------------------
  compute_naive_ascii_monospace_width = function(metrics, slab) {
    /* NOTE Implementation of a very crude estimate of visual string width that assigns each codepoint a
     width of `1` (which is OK for much of unaccented Latin, Cyrillic, Greek and so on but wrong for
     combining marks, CJK, Indic Scripts and so on). For demonstration purposes, we iterate over single
     characters and add up their individual lengths; more precise algorithms might use e.g. Harfbuzz and
     arrive at values per slab, ignoring the individual character widths altogether which may or may
     not add up to the resulting width because of diacritics, ligatures, kerning and so on. */
    var base, base1, chr, chrs, fragment, i, idx, len, ref, width;
    width = 0;
    fragment = '';
    ref = chrs = Array.from(slab);
    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
      chr = ref[idx];
      fragment += chr;
      width += ((base = metrics.widths)[chr] != null ? base[chr] : base[chr] = 1);
      if ((base1 = metrics.widths)[chr] == null) {
        base1[chr] = width;
      }
    }
    // metrics.widths[ slab ] = width ### NOTE setting of slab width done implicitly ###
    return width;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_looping = function(text) {
    return new Promise((resolve, reject) => {
      var base, crib, get_next_line, get_width, i, joint, len, line, metrics, msegment, ref, segment, sjs, slab, width;
      //.........................................................................................................
      text = INTERTEXT.HYPH.hyphenate(text);
      sjs = INTERTEXT.SLABS.slabjoints_from_text(text);
      //.........................................................................................................
      /* NOTES

      * The widths in `metrics.widths` are to be filled by `compute_width()`;
      * the catalog may be DB-backed to avoid re-computation of known metrics.
      * `metrics.line_width` is the wiidth of the line to be typeset next; its units are arbitrary but must be
        identical to those used in `metrics.widths` in order to make sense.

       */
      metrics = {
        compute_width: compute_naive_ascii_monospace_width,
        line_width: 20,
        widths: {
          'a': 1
        }
      };
      //.........................................................................................................
      /* The crib is where the preset lines go; it may be modified later when it is found that width estimates
       were incorrect: */
      crib = {
        segments: {},
        lineup: [],
        galley: []
      };
      //.........................................................................................................
      get_width = function(metrics, slab) {
        var base;
        return (base = metrics.widths)[slab] != null ? base[slab] : base[slab] = metrics.compute_width(metrics, slab);
      };
      ref = sjs.segments;
      //.........................................................................................................
      /* Collecting slab lengths: */
      for (i = 0, len = ref.length; i < len; i++) {
        segment = ref[i];
        [slab, joint] = INTERTEXT.SLABS.text_and_joint_from_segment(segment);
        width = get_width(metrics, slab);
        debug(slab.padEnd(10), width);
        switch (joint) {
          case '=':
            if ((msegment = crib.segments[segment]) == null) {
              msegment = {
                joint,
                '#': {slab, width}
              };
              slab += '-';
              width = get_width(metrics, slab);
              msegment['-'] = {slab, width};
              crib.segments[segment] = msegment;
            }
            break;
          case '#':
          case '°':
            msegment = (base = crib.segments)[segment] != null ? base[segment] : base[segment] = {
              joint,
              slab,
              [joint]: {slab, width}
            };
            break;
          default:
            throw new Error(`^xxx/demo@4459^ unknown joint ${rpr(joint)}`);
        }
        debug(msegment);
        // cribslab          = new_cribslab crib, slab, joint, width
        // crib.segments[ segments ] =
        crib.lineup.push(msegment);
      }
      //.........................................................................................................
      get_next_line = function(crib, current_line = null) {
        if ((current_line != null) && current_line.segments.length > 0) {
          crib.galley.push(current_line);
        }
        return {
          $key: '^line',
          width: 0,
          segments: []
        };
      };
      //.........................................................................................................
      /* Distributing lineup over lines: */
      line = get_next_line(crib);
      while (true) {
        if ((msegment = crib.lineup.shift()) == null) {
          break;
        }
        switch (msegment.joint) {
          case '#':
            /* TAINT code duplication */
            if (line.width + msegment['#'].width <= metrics.line_width) {
              line.segments.push(msegment);
              line.width += msegment['#'].width;
            } else {
              line = get_next_line(crib, line);
              line.segments.push(msegment);
              line.width += msegment['#'].width;
            }
            break;
          case '°':
            /* TAINT code duplication */
            if (line.width + msegment['°'].width <= metrics.line_width) {
              line.segments.push(msegment);
              line.width += msegment['°'].width;
            } else {
              line = get_next_line(crib, line);
              line.segments.push(msegment);
              line.width += msegment['°'].width;
            }
            break;
          default:
            warn(`^xxx/demo@4460^ unknown joint ${rpr(msegment, joint)}`);
        }
      }
      // throw new Error "^xxx/demo@4460^ unknown joint #{rpr msegment,joint}"
      get_next_line(crib, line);
      //.........................................................................................................
      help('^337637^', CND.inspect(sjs));
      help('^337637^', CND.inspect(crib.segments));
      help('^337637^', CND.inspect(crib));
      help('^337637^', rpr(metrics));
      // for slab, width of metrics.widths
      //   help '^337637^', ( slab.padEnd 20 ), width
      //.........................................................................................................
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_piping = function(text) {
    return new Promise((resolve, reject) => {
      var pipeline, source;
      //.........................................................................................................
      source = [text];
      pipeline = [];
      pipeline.push(source);
      pipeline.push($(function(text, send) {
        return send(INTERTEXT.HYPH.hyphenate(text));
      }));
      pipeline.push($(function(text, send) {
        return send(INTERTEXT.SLABS.slabjoints_from_text(text));
      }));
      pipeline.push($show());
      pipeline.push($drain(function() {
        return resolve();
      }));
      //.........................................................................................................
      SP.pull(...pipeline);
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var text;
      text = `Hercules (/ˈhɜːrkjuliːz, -jə-/) is a Roman hero and god. He was the Roman equivalent of the
Greek divine hero Heracles, who was the son of Zeus (Roman equivalent Jupiter) and the mortal Alcmene. In
classical mythology, Hercules is famous for his strength and for his numerous far-ranging adventures.`;
      text = "very short example";
      text = "Zentral/Dezentral, Innenorientierung/Kundenzentrierung und Fremdsteuerung/Selbstverantwortung";
      text = text.replace(/\n/g, ' ');
      text = text.replace(/\s+/g, ' ');
      // await @demo_looping text
      return (await this.demo_piping(text));
    })();
  }

}).call(this);

//# sourceMappingURL=line-breaking-with-dynamic-programming.js.map
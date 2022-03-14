(function() {
  'use strict';
  var CND, FS, HDML, PATH, badge, debug, echo, equals, help, info, isa, rpr, samples, tabulate, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, width_of;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'VARIOUS-MD-PARSERS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  // SQL                       = String.raw
  // guy                       = require '../../../apps/guy'
  // { DBay }                  = require '../../../apps/dbay'
  ({width_of, to_width} = require('to-width'));

  ({HDML} = require('../../../apps/hdml'));

  // X                         = require '../../../lib/helpers'

  //-----------------------------------------------------------------------------------------------------------
  tabulate = function(db, query) {
    return X.tabulate(query, db(query));
  };

  //-----------------------------------------------------------------------------------------------------------
  samples = {
    script_and_xmp: `this is *it*

\`\`\`foo
<script> do **not** parse this</script>
\`\`\`

this is just a <script> do **not** parse this</script>

<code> do **not** parse this</code>

<xmp> do **not** parse this</xmp>`
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_mdtojsx = function() {
    var Markdown;
    ({Markdown} = require('markdown-to-jsx'));
    debug('^075^', Markdown);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_marked = function() {
    var k, marked;
    ({marked} = require('marked'));
    marked.use({
      pedantic: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
      walkTokens: function(d) {
        return help(d);
      }
    });
    for (k in marked) {
      debug('^355^', k);
    }
    urge('^355^', '\n' + marked.parse(samples.script_and_xmp));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_find_syntax_stretches = function() {
    var _locate, d, i, len, locate, matchers, ref;
    _locate = function(text, pattern) {
      var R, match, ref;
      R = [];
      ref = text.matchAll(pattern);
      for (match of ref) {
        R.push({
          start: match.index,
          stop: match.index + match[0].length
        });
      }
      return R;
    };
    locate = function(text) {
      var R, close, hit, i, j, l, len, len1, len2, name, open, pattern, ref, ref1, role;
      R = [];
      for (i = 0, len = matchers.length; i < len; i++) {
        ({name, open, close} = matchers[i]);
        ref = [['open', open], ['close', close]];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          [role, pattern] = ref[j];
          ref1 = _locate(text, pattern);
          for (l = 0, len2 = ref1.length; l < len2; l++) {
            hit = ref1[l];
            R.push({name, role, ...hit});
          }
        }
      }
      if (!(R.length > 0)) {
        return null;
      }
      R.sort(function(a, b) {
        if (a.start > b.start) {
          return +1;
        }
        if (a.start < b.start) {
          return -1;
        }
        return 0;
      });
      return R;
    };
    matchers = [
      {
        name: 'html_script',
        open: /<script\b/g,
        close: /<\/script>/g,
        environment: 'html',
        syntax: 'script'
      },
      {
        name: 'html_xmp',
        open: /<xmp\b/g,
        close: /<\/xmp>/g,
        environment: 'html',
        syntax: 'literal'
      },
      {
        name: 'md_fenced_code',
        open: /```/g,
        close: /```/g,
        environment: 'md',
        syntax: 'code'
      }
    ];
    ref = locate(samples.script_and_xmp);
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      help('^376^', d);
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @demo_mdtojsx()
      // @demo_marked()
      return this.demo_find_syntax_stretches();
    })();
  }

}).call(this);

//# sourceMappingURL=various-md-parsers.js.map
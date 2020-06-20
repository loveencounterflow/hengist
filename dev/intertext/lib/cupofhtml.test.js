(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'INTERTEXT/TESTS/HTML';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  //...........................................................................................................
  test = require('guy-test');

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["HTML specials"] = async function(T, done) {
    var Cupofhtml, INTERTEXT, coh, error, html_from_datoms, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    ({Cupofhtml} = INTERTEXT.CUPOFHTML);
    ({html_from_datoms} = INTERTEXT.HTML.export());
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          "script",
          (function() {
            var square;
            square = (function(x) {
              return x ** 2;
            });
            return console.log(square(42));
          })
        ],
        [
          [
            {
              "$key": "<script"
            },
            {
              "text": "(function() {\n            var square;\n            square = (function(x) {\n              return x ** 2;\n            });\n            return console.log(square(42));\n          })();",
              "$key": "^raw"
            },
            {
              "$key": ">script"
            }
          ],
          "<script>(function() {\n            var square;\n            square = (function(x) {\n              return x ** 2;\n            });\n            return console.log(square(42));\n          })();</script>"
        ],
        null
      ],
      [
        ["script",
        "path to app.js"],
        [
          [
            {
              "src": "path to app.js",
              "$key": "^script"
            }
          ],
          "<script src='path to app.js'></script>"
        ],
        null
      ],
      [
        ["link_css",
        "path/to/styles.css"],
        [
          [
            {
              "rel": "stylesheet",
              "href": "path/to/styles.css",
              "$key": "^link"
            }
          ],
          "<link href=path/to/styles.css rel=stylesheet>"
        ],
        null
      ],
      [
        ["text",
        "a b c < & >"],
        [
          [
            {
              "text": "a b c < & >",
              "$key": "^text"
            }
          ],
          "a b c &lt; &amp; &gt;"
        ],
        null
      ],
      [
        ["raw",
        "a b c < & >"],
        [
          [
            {
              "text": "a b c < & >",
              "$key": "^raw"
            }
          ],
          "a b c < & >"
        ],
        null
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      coh = new Cupofhtml();
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var P, d, ds, html, idx, j, key, len1;
          [key, ...P] = probe;
          coh.S[key](...P);
          ds = coh.expand();
          html = html_from_datoms(ds);
          for (idx = j = 0, len1 = ds.length; j < len1; idx = ++j) {
            d = ds[idx];
            ds[idx] = coh.DATOM.lets(d, function(d) {
              return delete d.$;
            });
          }
          // debug ds
          return resolve([ds, html]);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML Cupofhtml (1)"] = function(T, done) {
    var Cupofhtml, H, INTERTEXT, S, cram, cupofhtml, expand, isa, tag, type_of;
    INTERTEXT = require('../../../apps/intertext');
    ({Cupofhtml} = INTERTEXT.CUPOFHTML);
    cupofhtml = new Cupofhtml();
    ({isa, type_of} = INTERTEXT.types.export());
    //.........................................................................................................
    T.eq(cupofhtml.settings.flatten, true);
    T.ok(isa.list(cupofhtml.collector));
    T.ok(isa.function(cupofhtml.cram));
    T.ok(isa.function(cupofhtml.expand));
    T.ok(isa.function(cupofhtml.tag));
    T.ok(isa.function(cupofhtml.S.link_css));
    T.ok(isa.function(cupofhtml.S.script));
    T.ok(isa.function(cupofhtml.S.raw));
    T.ok(isa.function(cupofhtml.S.text));
    //.........................................................................................................
    ({cram, expand, tag, H, S} = cupofhtml.export());
    T.ok(isa.function(cram));
    T.ok(isa.function(expand));
    T.ok(isa.function(tag));
    T.ok(isa.function(S.text));
    T.ok(isa.function(S.raw));
    T.ok(isa.function(S.script));
    T.ok(isa.function(S.link_css));
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML Cupofhtml (2)"] = function(T, done) {
    var Cupofhtml, H, INTERTEXT, S, cram, cupofhtml, datoms, datoms_from_html, expand, html, html_from_datoms, tag;
    INTERTEXT = require('../../../apps/intertext');
    ({Cupofhtml} = INTERTEXT.CUPOFHTML);
    cupofhtml = new Cupofhtml();
    ({cram, expand, tag, S, H} = cupofhtml.export());
    ({datoms_from_html, html_from_datoms} = INTERTEXT.HTML.export());
    //.........................................................................................................
    // debug '^33343^', ( k for k of cupofhtml )
    // debug '^33343^', ( k for k of cupofhtml.export() )
    cupofhtml.new_tag('paper', {
      $blk: true
    });
    cupofhtml.new_tag('conclusion', {
      $blk: true
    });
    H.paper(function() {
      S.link_css('./styles.css');
      S.script('./awesome.js');
      S.script(function() {
        return console.log("pretty darn cool");
      });
      S.newline();
      H.article(function() {
        H.h3("Some Thoughts on Nested Data Structures");
        H.p(function() {
          S.text("An interesting ");
          tag('em', "fact");
          S.text(" about CupOfJoe is that you ");
          tag('em', function() {
            return S.text("can");
          });
          return tag('strong', " nest", " with both sequences", " and function calls.");
        });
        // H.p ->
        return H.p(function() {
          S.text("Text is escaped before output: <&>, ");
          return S.raw("but can also be included literally with `raw`: <&>.");
        });
      });
      return H.conclusion({
        id: 'c2334',
        class: 'hilite big'
      }, function() {
        return S.text("With CupOfJoe, you don't need brackets.");
      });
    });
    datoms = expand();
    html = html_from_datoms(datoms);
    info(datoms);
    urge('\n' + html);
    // T.eq html, "<paper><link href=./styles.css rel=stylesheet><script src=./awesome.js></script><script>(function() {\n        return console.log(\"pretty darn cool\");\n      })();</script><article><title>Some Thoughts on Nested Data Structures</title><p>An interesting <em>fact</em> about CupOfJoe is that you <em>can</em><strong> nest with both sequences and function calls.</strong></p><p>Text is escaped before output: &lt;&amp;&gt;, but can also be included literally with `raw`: <&>.</p></article><conclusion>With CupOfJoe, you don't need brackets.</conclusion></paper>"
    T.eq(html.trim(), `<paper><link href=./styles.css rel=stylesheet><script src=./awesome.js></script><script>(function() {
        return console.log("pretty darn cool");
      })();</script>
<article><h3>Some Thoughts on Nested Data Structures</h3>

<p>An interesting <em>fact</em> about CupOfJoe is that you <em>can</em><strong> nest with both sequences and function calls.</strong></p>

<p>Text is escaped before output: &lt;&amp;&gt;, but can also be included literally with \`raw\`: <&>.</p>

</article>

<conclusion class='hilite big' id=c2334>With CupOfJoe, you don't need brackets.</conclusion>

</paper>`);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => { // await do =>
      // debug ( k for k of ( require '../..' ).HTML ).sort().join ' '
      // await @_demo()
      return test(this);
    })();
  }

  // test @[ "HTML specials" ]
// test @[ "HTML Cupofhtml (1)" ]
// test @[ "HTML Cupofhtml (2)" ]

}).call(this);

//# sourceMappingURL=cupofhtml.test.js.map
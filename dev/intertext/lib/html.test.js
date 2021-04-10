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
  this["___TMP_NOT_USED_must quote attribute value"] = async function(T, done) {
    var INTERTEXT, error, i, isa, len, matcher, probe, probes_and_matchers, type_of, validate;
    INTERTEXT = require('../../../apps/intertext');
    ({isa, validate, type_of} = INTERTEXT.types.export());
    probes_and_matchers = [["", true, null], ["\"", true, null], ["'", true, null], ["<", true, null], ["<>", true, null], ["foo", false, null], ["foo bar", true, null], ["foo\nbar", true, null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var must_quote;
          must_quote = !isa.intertext_html_naked_attribute_value(probe);
          return resolve(must_quote);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_DATOM.HTML._as_attribute_literal"] = async function(T, done) {
    var HTML, INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [["", "''", null], ['"', '\'"\'', null], ["'", "'&#39;'", null], ["<", "'&lt;'", null], ["<>", "'&lt;&gt;'", null], ["foo", "foo", null], ["foo bar", "'foo bar'", null], ["foo\nbar", "'foo&#10;bar'", null], ["'<>'", "'&#39;&lt;&gt;&#39;'", null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(HTML._as_attribute_literal(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_isa.intertext_html_tagname (1)"] = async function(T, done) {
    var INTERTEXT, error, i, isa, len, matcher, probe, probes_and_matchers, type_of, validate;
    INTERTEXT = require('../../../apps/intertext');
    ({isa, validate, type_of} = INTERTEXT.types.export());
    probes_and_matchers = [["", false, null], ["\"", false, null], ["'", false, null], ["<", false, null], ["<>", false, null], ["foo bar", false, null], ["foo\nbar", false, null], ["foo", true, null], ["此は何ですか", true, null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(isa.intertext_html_tagname(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_isa.intertext_html_tagname (2)"] = async function(T, done) {
    var INTERTEXT, i, isa, len, probe, probes, type_of, validate;
    INTERTEXT = require('../../../apps/intertext');
    ({isa, validate, type_of} = INTERTEXT.types.export());
    probes = `a abbr acronym address applet area article aside audio b base basefont bdi bdo bgsound big
blink blockquote body br button canvas caption center cite code col colgroup command datalist dd del
details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2
h3 h4 h5 h6 head header hgroup hr html i iframe img input ins isindex kbd keygen label legend li link
listing main map mark marquee menu meta meter multicol nav nextid nobr noembed noframes noscript object ol
optgroup option output p param plaintext pre progress q rb rp rt ruby s samp script section select small
source spacer span strike strong sub summary sup table tbody td textarea tfoot th thead time title tr
track tt u ul video wbr xmp
foo:bar foo-bar Foo-bar`.split(/\s+/);
    for (i = 0, len = probes.length; i < len; i++) {
      probe = probes[i];
      await T.perform(probe, true, null, function() {
        return new Promise(function(resolve) {
          return resolve(isa.intertext_html_tagname(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (singular tags)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [['^foo'],
      "<foo></foo>"],
      [
        [
          '^foo',
          {
            height: 42
          }
        ],
        "<foo height=42></foo>"
      ],
      [
        [
          '^foo',
          {
            class: 'plain'
          }
        ],
        "<foo class=plain></foo>"
      ],
      [
        [
          '^foo',
          {
            class: 'plain hilite'
          }
        ],
        "<foo class='plain hilite'></foo>"
      ],
      [
        [
          '^foo',
          {
            editable: true
          }
        ],
        "<foo editable></foo>"
      ],
      [
        [
          '^foo',
          {
            empty: ''
          }
        ],
        "<foo empty=''></foo>"
      ],
      [
        [
          '^foo',
          {
            specials: '<\n\'"&>'
          }
        ],
        "<foo specials='&lt;&#10;&#39;\"&amp;&gt;'></foo>"
      ],
      [
        [
          '^something',
          {
            one: 1,
            two: 2
          }
        ],
        "<something one=1 two=2></something>"
      ],
      [
        [
          '^something',
          {
            z: 'Z',
            a: 'A'
          }
        ],
        "<something a=A z=Z></something>"
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve(HTML.html_from_datoms(d));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (closing tags)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [['>foo'],
      "</foo>"],
      [
        [
          '>foo',
          {
            height: 42
          }
        ],
        "</foo>"
      ],
      [
        [
          '>foo',
          {
            class: 'plain'
          }
        ],
        "</foo>"
      ],
      [
        [
          '>foo',
          {
            class: 'plain hilite'
          }
        ],
        "</foo>"
      ],
      [
        [
          '>foo',
          {
            editable: true
          }
        ],
        "</foo>"
      ],
      [
        [
          '>foo',
          {
            empty: ''
          }
        ],
        "</foo>"
      ],
      [
        [
          '>foo',
          {
            specials: '<\n\'"&>'
          }
        ],
        "</foo>"
      ],
      [
        [
          '>something',
          {
            one: 1,
            two: 2
          }
        ],
        "</something>"
      ],
      [
        [
          '>something',
          {
            z: 'Z',
            a: 'A'
          }
        ],
        "</something>"
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve(HTML.html_from_datoms(d));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (opening tags)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [['<foo'],
      "<foo>"],
      [
        [
          '<foo',
          {
            height: 42
          }
        ],
        "<foo height=42>"
      ],
      [
        [
          '<foo',
          {
            class: 'plain'
          }
        ],
        "<foo class=plain>"
      ],
      [
        [
          '<foo',
          {
            class: 'plain hilite'
          }
        ],
        "<foo class='plain hilite'>"
      ],
      [
        [
          '<foo',
          {
            editable: true
          }
        ],
        "<foo editable>"
      ],
      [
        [
          '<foo',
          {
            empty: ''
          }
        ],
        "<foo empty=''>"
      ],
      [
        [
          '<foo',
          {
            specials: '<\n\'"&>'
          }
        ],
        "<foo specials='&lt;&#10;&#39;\"&amp;&gt;'>"
      ],
      [
        [
          '<something',
          {
            one: 1,
            two: 2
          }
        ],
        "<something one=1 two=2>"
      ],
      [
        [
          '<something',
          {
            z: 'Z',
            a: 'A'
          }
        ],
        "<something a=A z=Z>"
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve(HTML.html_from_datoms(d));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (texts)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [['^text'],
      ""],
      [
        [
          '^text',
          {
            height: 42
          }
        ],
        ""
      ],
      [
        [
          '^text',
          {
            text: '<me & you>\n'
          }
        ],
        "&lt;me &amp; you&gt;\n"
      ],
      [
        [
          '<text',
          {
            z: 'Z',
            a: 'A'
          }
        ],
        "<text a=A z=Z>"
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve(HTML.html_from_datoms(d));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (opening tags w/ $value)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [['<foo'],
      "<foo>"],
      [
        [
          '<foo',
          {
            ignored: 'xxx',
            $value: {
              height: 42
            }
          }
        ],
        "<foo height=42>"
      ],
      [
        [
          '<foo',
          {
            ignored: 'xxx',
            $value: {
              class: 'plain'
            }
          }
        ],
        "<foo class=plain>"
      ],
      [
        [
          '<foo',
          {
            ignored: 'xxx',
            $value: {
              class: 'plain hilite'
            }
          }
        ],
        "<foo class='plain hilite'>"
      ],
      [
        [
          '<foo',
          {
            ignored: 'xxx',
            $value: {
              editable: true
            }
          }
        ],
        "<foo editable>"
      ],
      [
        [
          '<foo',
          {
            ignored: 'xxx',
            $value: {
              empty: ''
            }
          }
        ],
        "<foo empty=''>"
      ],
      [
        [
          '<foo',
          {
            ignored: 'xxx',
            $value: {
              specials: '<\n\'"&>'
            }
          }
        ],
        "<foo specials='&lt;&#10;&#39;\"&amp;&gt;'>"
      ],
      [
        [
          '<something',
          {
            ignored: 'xxx',
            $value: {
              one: 1,
              two: 2
            }
          }
        ],
        "<something one=1 two=2>"
      ],
      [
        [
          '<something',
          {
            ignored: 'xxx',
            $value: {
              z: 'Z',
              a: 'A'
            }
          }
        ],
        "<something a=A z=Z>"
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve(HTML.html_from_datoms(d));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (system tags)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [["~foo"],
      "<x-sys x-key=foo><x-sys-key>foo</x-sys-key></x-sys>",
      null],
      [
        [
          "~foo",
          {
            "height": 42
          }
        ],
        "<x-sys x-key=foo height=42><x-sys-key>foo</x-sys-key></x-sys>",
        null
      ],
      [
        [
          "[foo",
          {
            "class": "plain"
          }
        ],
        "<x-sys x-key=foo class=plain><x-sys-key>foo</x-sys-key>",
        null
      ],
      [
        [
          "[foo",
          {
            "class": "plain hilite"
          }
        ],
        "<x-sys x-key=foo class='plain hilite'><x-sys-key>foo</x-sys-key>",
        null
      ],
      [
        [
          "]foo",
          {
            "editable": true
          }
        ],
        "</x-sys>",
        null
      ],
      [
        [
          "]foo",
          {
            "empty": ""
          }
        ],
        "</x-sys>",
        null
      ],
      [
        [
          "~foo",
          {
            "specials": "<\n'\"&>"
          }
        ],
        "<x-sys x-key=foo specials='&lt;&#10;&#39;\"&amp;&gt;'><x-sys-key>foo</x-sys-key></x-sys>",
        null
      ],
      [
        [
          "~something",
          {
            "one": 1,
            "two": 2
          }
        ],
        "<x-sys x-key=something one=1 two=2><x-sys-key>something</x-sys-key></x-sys>",
        null
      ],
      [
        [
          "~something",
          {
            "z": "Z",
            "a": "A"
          }
        ],
        "<x-sys x-key=something a=A z=Z><x-sys-key>something</x-sys-key></x-sys>",
        null
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve(HTML.html_from_datoms(d));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (raw pseudo-tag)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [['^raw'],
      ""],
      [
        [
          '^raw',
          {
            height: 42
          }
        ],
        ""
      ],
      [
        [
          '^raw',
          {
            text: '<\n\'"&>'
          }
        ],
        '<\n\'"&>'
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve(HTML.html_from_datoms(d));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (doctype)"] = async function(T, done) {
    var DATOM, HTML, INTERTEXT, error, i, len, lets, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    INTERTEXT = require('../../../apps/intertext');
    ({HTML} = INTERTEXT);
    probes_and_matchers = [
      [['^doctype'],
      "<!DOCTYPE html>"],
      [
        [
          '^doctype',
          {
            height: 42
          }
        ],
        "<!DOCTYPE html>"
      ],
      [['^doctype',
      "obvious"],
      "<!DOCTYPE obvious>"]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d;
          d = new_datom(...probe);
          return resolve((HTML.html_from_datoms(d)).trim());
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (1)"] = async function(T, done) {
    var INTERTEXT, error, html_from_datoms, i, len, matcher, probe, probes_and_matchers, tag;
    INTERTEXT = require('../../../apps/intertext');
    ({html_from_datoms, tag} = INTERTEXT.HTML.export());
    //.........................................................................................................
    probes_and_matchers = [
      [["div"],
      "<div></div>",
      null],
      [["div#x32"],
      "<div id=x32></div>",
      null],
      [["div.foo"],
      "<div class=foo></div>",
      null],
      [["div#x32.foo"],
      "<div class=foo id=x32></div>",
      null],
      [
        [
          "div#x32",
          {
            "alt": "nice guy"
          }
        ],
        "<div alt='nice guy' id=x32></div>",
        null
      ],
      [
        [
          "div#x32",
          {
            "alt": "nice guy"
          },
          " a > b & b > c => a > c"
        ],
        "<div alt='nice guy' id=x32> a &gt; b &amp; b &gt; c =&gt; a &gt; c</div>",
        null
      ],
      [["foo-bar"],
      "<foo-bar></foo-bar>",
      null],
      [["foo-bar#c55"],
      "<foo-bar id=c55></foo-bar>",
      null],
      [["foo-bar.blah.beep"],
      "<foo-bar class='blah beep'></foo-bar>",
      null],
      [["foo-bar#c55.blah.beep"],
      "<foo-bar class='blah beep' id=c55></foo-bar>",
      null],
      [["#c55"],
      null,
      "not a valid intertext_html_tagname"],
      [[".blah.beep"],
      null,
      "not a valid intertext_html_tagname"],
      [["...#"],
      null,
      "illegal compact tag syntax"]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          // urge html_from_datoms tag probe...
          return resolve(html_from_datoms(tag(...probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (2)"] = function(T, done) {
    var INTERTEXT, ds, html_from_datoms, tag;
    INTERTEXT = require('../../../apps/intertext');
    ({html_from_datoms, tag} = INTERTEXT.HTML.export());
    //.........................................................................................................
    urge(ds = tag('article#c2', {
      editable: true
    }, tag('h1', "A truly curious Coincidence")));
    T.eq(ds, [
      {
        '$key': '<article',
        id: 'c2',
        editable: true
      },
      {
        '$key': '<h1'
      },
      {
        '$key': '^text',
        text: 'A truly curious Coincidence'
      },
      {
        '$key': '>h1'
      },
      {
        '$key': '>article'
      }
    ]);
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["___TMP_NOT_USED_HTML.html_from_datoms (3)"] = function(T, done) {
    var INTERTEXT, ds, html_from_datoms, tag;
    INTERTEXT = require('../../../apps/intertext');
    ({html_from_datoms, tag} = INTERTEXT.HTML.export());
    //.........................................................................................................
    urge(ds = tag('article#c2', {
      editable: true
    }, tag('h1', "A truly curious Coincidence"), tag('p.noindent', tag('em', "Seriously,"), " he said, ", tag('em', "we'd better start cooking now."))));
    //.........................................................................................................
    whisper(jr(html_from_datoms(ds)));
    T.eq(html_from_datoms(ds), "<article editable id=c2><h1>A truly curious Coincidence</h1><p class=noindent><em>Seriously,</em> he said, <em>we'd better start cooking now.</em></p></article>");
    T.eq(ds, [
      {
        '$key': '<article',
        id: 'c2',
        editable: true
      },
      {
        '$key': '<h1'
      },
      {
        '$key': '^text',
        text: 'A truly curious Coincidence'
      },
      {
        '$key': '>h1'
      },
      {
        '$key': '<p',
        class: 'noindent'
      },
      {
        '$key': '<em'
      },
      {
        '$key': '^text',
        text: 'Seriously,'
      },
      {
        '$key': '>em'
      },
      {
        '$key': '^text',
        text: ' he said, '
      },
      {
        '$key': '<em'
      },
      {
        '$key': '^text',
        text: "we'd better start cooking now."
      },
      {
        '$key': '>em'
      },
      {
        '$key': '>p'
      },
      {
        '$key': '>article'
      }
    ]);
    //.........................................................................................................
    done();
    return null;
    // #-----------------------------------------------------------------------------------------------------------
    // @[ "HTML.datoms_as_nlhtml (1)" ] = ( T, done ) ->
    return INTERTEXT = require('../../../apps/intertext');
  };

  //   { datoms_as_nlhtml
  //     datoms_from_html }        = INTERTEXT.HTML.export()
  //   #.........................................................................................................
  //   urge jr ds = datoms_from_html """
  //     <h1>A Star is Born</h1><p class=noindent>Stars are born when hydrogen amasses.</p><p>When they are <em>big</em> enough, nuclear fusion starts.</p>
  //     """
  //   #.........................................................................................................
  //   help datoms_as_nlhtml ds
  //   done()
  //   return null

  //###########################################################################################################
  if (module === require.main) {
    (() => { // await do =>
      // debug ( k for k of ( require '../..' ).HTML ).sort().join ' '
      // await @_demo()
      return test(this);
    })();
  }

  // test @[ "must quote attribute value" ]
// test @[ "DATOM.HTML._as_attribute_literal" ]
// test @[ "isa.intertext_html_tagname (1)" ]
// test @[ "isa.intertext_html_tagname (2)" ]
// test @[ "HTML.html_from_datoms (singular tags)" ]
// test @[ "HTML.html_from_datoms (closing tags)" ]
// test @[ "HTML.html_from_datoms (opening tags)" ]
// test @[ "HTML.html_from_datoms (texts)" ]
// test @[ "HTML.html_from_datoms (opening tags w/ $value)" ]
// test @[ "HTML.html_from_datoms (system tags)" ]
// test @[ "HTML.html_from_datoms (raw pseudo-tag)" ]
// test @[ "HTML.html_from_datoms (doctype)" ]
// test @[ "HTML.html_from_datoms (1)" ]
// test @[ "HTML.html_from_datoms (2)" ]
// test @[ "HTML.html_from_datoms (3)" ]
// test @[ "HTML specials" ]
// test @[ "HTML demo" ]
// test @[ "HTML Cupofhtml (1)" ]
// test @[ "HTML Cupofhtml (2)" ]

}).call(this);

//# sourceMappingURL=html.test.js.map
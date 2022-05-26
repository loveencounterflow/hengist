(function() {
  'use strict';
  var CND, PATH, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HDML/TESTS/BASIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["basics"] = async function(T, done) {
    var HDML, Hdml, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({HDML, Hdml} = require('../../../apps/hdml'));
    //.........................................................................................................
    probes_and_matchers = [
      [['<',
      'foo'],
      '<foo>',
      null],
      [['<',
      'foo',
      null],
      '<foo>',
      null],
      [['<',
      'foo',
      {}],
      '<foo>',
      null],
      [
        [
          '<',
          'foo',
          {
            a: '42',
            b: "'",
            c: '"'
          }
        ],
        `<foo a='42' b='&#39;' c='"'>`,
        null
      ],
      [
        [
          '<',
          'foo',
          {
            a: '42',
            b: void 0
          }
        ],
        `<foo a='42'>`
      ],
      [
        [
          '^',
          'foo',
          {
            a: '42',
            b: "'",
            c: '"'
          }
        ],
        `<foo a='42' b='&#39;' c='"'/>`,
        null
      ],
      [
        [
          '^',
          'prfx:foo',
          {
            a: '42',
            b: "'",
            c: '"'
          }
        ],
        `<prfx:foo a='42' b='&#39;' c='"'/>`,
        null
      ],
      // [ [ '^', '$text' ], '<mrg:loc#baselines/>', null ]
      [['>',
      'foo'],
      '</foo>',
      null],
      [['>',
      42],
      null,
      'not a valid text: 42'],
      [
        [
          '<',
          'foo',
          {
            a: 42,
            b: void 0
          }
        ],
        null,
        'not a valid text: 42'
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = HDML.create_tag(...probe);
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["can use or not use compact tagnames"] = function(T, done) {
    var Hdml;
    // T?.halt_on_error()
    ({Hdml} = require('../../../apps/hdml'));
    (() => {      //.........................................................................................................
      var hdml;
      hdml = new Hdml({
        use_compact_tags: false
      });
      return T != null ? T.eq(hdml.create_tag('^', 'mrg:loc#baselines'), '<mrg:loc#baselines/>') : void 0;
    })();
    (() => {      //.........................................................................................................
      var hdml;
      hdml = new Hdml({
        use_compact_tags: true
      });
      return T != null ? T.eq(hdml.create_tag('^', 'mrg:loc#baselines'), "<mrg:loc id='baselines'/>") : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HDML.parse_compact_tagname 1"] = async function(T, done) {
    var HDML, error, i, len, matcher, probe, probes_and_matchers;
    ({HDML} = require('../../../apps/hdml'));
    //.........................................................................................................
    probes_and_matchers = [
      [
        'foo-bar',
        {
          tag: 'foo-bar'
        },
        null
      ],
      [
        'foo-bar#c55',
        {
          tag: 'foo-bar',
          id: 'c55'
        },
        null
      ],
      [
        'foo-bar.blah.beep',
        {
          tag: 'foo-bar',
          class: ['blah',
        'beep']
        },
        null
      ],
      [
        'foo-bar#c55.blah.beep',
        {
          tag: 'foo-bar',
          id: 'c55',
          class: ['blah',
        'beep']
        },
        null
      ],
      [
        'dang:blah',
        {
          prefix: 'dang',
          tag: 'blah'
        },
        null
      ],
      [
        'dang:blah#c3',
        {
          prefix: 'dang',
          tag: 'blah',
          id: 'c3'
        },
        null
      ],
      [
        'dang:blah#c3.some.thing',
        {
          prefix: 'dang',
          tag: 'blah',
          id: 'c3',
          class: ['some',
        'thing']
        },
        null
      ],
      [
        'dang:bar.dub#c3.other',
        {
          prefix: 'dang',
          tag: 'bar',
          class: ['dub',
        'other'],
          id: 'c3'
        },
        null
      ],
      //.......................................................................................................
      ['#c55',
      null,
      "illegal compact tag syntax"],
      ['dang:#c3.some.thing',
      null,
      "illegal compact tag syntax"],
      ['.blah.beep',
      null,
      "illegal compact tag syntax"],
      ['...#',
      null,
      'illegal compact tag syntax'],
      ['',
      null,
      'illegal compact tag syntax']
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(HDML.parse_compact_tagname(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HDML.parse_compact_tagname 2"] = async function(T, done) {
    var HDML, Hdml, error, i, len, matcher, probe, probes_and_matchers;
    ({Hdml} = require('../../../apps/hdml'));
    HDML = new Hdml({
      strict_compact_tags: false
    });
    //.........................................................................................................
    probes_and_matchers = [
      [
        'foo-bar',
        {
          tag: 'foo-bar'
        },
        null
      ],
      [
        'foo-bar#c55',
        {
          tag: 'foo-bar',
          id: 'c55'
        },
        null
      ],
      [
        'foo-bar.blah.beep',
        {
          tag: 'foo-bar',
          class: ['blah',
        'beep']
        },
        null
      ],
      [
        'foo-bar#c55.blah.beep',
        {
          tag: 'foo-bar',
          id: 'c55',
          class: ['blah',
        'beep']
        },
        null
      ],
      [
        'dang:blah',
        {
          prefix: 'dang',
          tag: 'blah'
        },
        null
      ],
      [
        'dang:blah#c3',
        {
          prefix: 'dang',
          tag: 'blah',
          id: 'c3'
        },
        null
      ],
      [
        'dang:blah#c3.some.thing',
        {
          prefix: 'dang',
          tag: 'blah',
          id: 'c3',
          class: ['some',
        'thing']
        },
        null
      ],
      [
        'dang:bar.dub#c3.other',
        {
          prefix: 'dang',
          tag: 'bar',
          class: ['dub',
        'other'],
          id: 'c3'
        },
        null
      ],
      [
        //.......................................................................................................
        '#c55',
        {
          id: 'c55'
        },
        null
      ],
      [
        'dang:#c3.some.thing',
        {
          prefix: 'dang',
          id: 'c3',
          class: ['some',
        'thing']
        },
        null
      ],
      [
        '.blah.beep',
        {
          class: ['blah',
        'beep']
        },
        null
      ],
      ['...#',
      {},
      null],
      ['',
      {},
      null]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(HDML.parse_compact_tagname(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HDML use compact tagnames 1"] = async function(T, done) {
    var HDML, error, i, len, matcher, probe, probes_and_matchers;
    ({HDML} = require('../../../apps/hdml'));
    //.........................................................................................................
    probes_and_matchers = [
      [['<',
      'foo-bar'],
      '<foo-bar>',
      null],
      [['<',
      'foo-bar#c55'],
      "<foo-bar id='c55'>",
      null],
      [['<',
      'foo-bar.blah.beep'],
      "<foo-bar class='blah beep'>",
      null],
      [['<',
      'foo-bar#c55.blah.beep'],
      "<foo-bar id='c55' class='blah beep'>",
      null],
      [['<',
      'dang:blah'],
      '<dang:blah>',
      null],
      [['<',
      'dang:blah#c3'],
      "<dang:blah id='c3'>",
      null],
      [['<',
      'dang:blah#c3.some.thing'],
      "<dang:blah id='c3' class='some thing'>",
      null],
      [['<',
      'dang:bar.dub#c3.other'],
      "<dang:bar id='c3' class='dub other'>",
      null],
      //.......................................................................................................
      [['<',
      '#c55'],
      null,
      "illegal compact tag syntax"],
      [['<',
      'dang:#c3.some.thing'],
      null,
      "illegal compact tag syntax"],
      [['<',
      '.blah.beep'],
      null,
      "illegal compact tag syntax"],
      [['<',
      '...#'],
      null,
      'illegal compact tag syntax'],
      [['<',
      ''],
      null,
      'illegal compact tag syntax']
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // urge '^609^', rpr probe
      // urge '^609^', HDML.create_tag probe...
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(HDML.create_tag(...probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HDML V2 API"] = function(T, done) {
    var HDML;
    ({HDML} = require('../../../apps/hdml'));
    if (T != null) {
      T.eq(HDML.single('path', {
        id: 'c1',
        d: 'M100,100L200,200'
      }), `<path id='c1' d='M100,100L200,200'/>`);
    }
    if (T != null) {
      T.eq(HDML.open('div', {
        id: 'c1',
        class: 'foo bar'
      }), `<div id='c1' class='foo bar'>`);
    }
    if (T != null) {
      T.eq(HDML.text("<helo>"), `&lt;helo&gt;`);
    }
    if (T != null) {
      T.eq(HDML.close('div'), `</div>`);
    }
    if (T != null) {
      T.eq(HDML.pair('div'), `<div></div>`);
    }
    if (T != null) {
      T.eq(HDML.single('mrg:loc#baselines'), `<mrg:loc id='baselines'/>`);
    }
    if (T != null) {
      T.eq(HDML.pair('mrg:loc#baselines'), `<mrg:loc id='baselines'></mrg:loc>`);
    }
    if (T != null) {
      T.eq(HDML.pair('div', {
        id: 'c1',
        class: 'foo bar'
      }, HDML.text("<helo>")), `<div id='c1' class='foo bar'>&lt;helo&gt;</div>`);
    }
    if (T != null) {
      T.eq(HDML.pair('div', {
        id: 'c1',
        class: 'foo bar'
      }, HDML.single('path', {
        id: 'c1',
        d: 'M100,100L200,200'
      })), `<div id='c1' class='foo bar'><path id='c1' d='M100,100L200,200'/></div>`);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HDML boolean attributes"] = async function(T, done) {
    var HDML, error, i, len, matcher, probe, probes_and_matchers;
    ({HDML} = require('../../../apps/hdml'));
    probes_and_matchers = [
      [
        [
          'foo',
          {
            bar: ''
          }
        ],
        "<foo bar>"
      ],
      [
        [
          'foo',
          {
            bar: true
          }
        ],
        "<foo bar>"
      ],
      [
        [
          'foo',
          {
            bar: false
          }
        ],
        "<foo>"
      ],
      [
        [
          'foo',
          {
            bar: null
          }
        ],
        "<foo>"
      ],
      [
        [
          'foo',
          {
            bar: void 0
          }
        ],
        "<foo>"
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(HDML.open(...probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HDML datom API"] = async function(T, done) {
    var HTML, SP, source;
    SP = require('../../../apps/steampipes');
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    //.........................................................................................................
    source = ["<title>A Short Document</title>", "<p>The Nemean lion (<ipa>/nɪˈmiːən/</ipa>; Greek: <greek>Νεμέος λέων</greek> Neméos léōn; ", "Latin: Leo Nemeaeus) was a vicious monster in <a href='greek-mythology'>Greek mythology</a> ", "that lived at Nemea.", "</p>"];
    await (() => {
      return new Promise((resolve) => {
        var pipeline;
        pipeline = [];
        pipeline.push(source);
        pipeline.push(HTML.$parse());
        pipeline.push(SP.$watch(function(d) {
          return info(d);
        }));
        pipeline.push(SP.$drain(function() {
          return resolve();
        }));
        return SP.pull(...pipeline);
      });
    })();
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return test(this["basics"]);
    })();
  }

  // test @[ "HDML.parse_compact_tagname 1" ]
// test @[ "HDML.parse_compact_tagname 2" ]
// test @[ "HDML use compact tagnames 1" ]
// test @[ "HDML use compact tagnames 1" ]
// @[ "can use or not use compact tagnames" ]()
// test @[ "can use or not use compact tagnames" ]
// @[ "HDML V2 API" ]()
// test @[ "HDML V2 API" ]
// test @[ "HDML datom API" ]
// test @[ "HDML boolean attributes" ]
// @[ "HDML use compact tagnames 1" ]()

}).call(this);

//# sourceMappingURL=basic.tests.js.map
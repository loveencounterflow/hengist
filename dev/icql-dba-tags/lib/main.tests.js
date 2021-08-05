(function() {
  'use strict';
  var CND, NCR, Ncr, PATH, SQL, _add_tagged_ranges, add_sql_functions, badge, dba_path, debug, demo_html, echo, freeze, help, info, isa, jp, jr, lets, on_process_exit, regex_demo, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA-TAGS/TESTS';

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

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  on_process_exit = require('exit-hook');

  sleep = function(dts) {
    return new Promise((done) => {
      return setTimeout(done, dts * 1000);
    });
  };

  SQL = String.raw;

  jr = JSON.stringify;

  jp = JSON.parse;

  dba_path = '../../../apps/icql-dba';

  ({lets, freeze} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  add_sql_functions = function(dba) {
    var R, k, v;
    //=========================================================================================================
    R = {
      //-------------------------------------------------------------------------------------------------------
      walk_pattern_matches: function*(text, pattern) {
        var match, regex;
        regex = new RegExp(pattern, 'g');
        while ((match = regex.exec(text)) != null) {
          yield [match[0], match[1]];
        }
        return null;
      },
      //-------------------------------------------------------------------------------------------------------
      generate_series: function*(start, stop, step = null) {
        var n;
        // stop ?= start
        debug('^3334^', this);
        if (step == null) {
          step = 1;
        }
        n = start;
        while (true) {
          if (n > stop) {
            break;
          }
          // if n %% 2 is 0 then yield [ "*#{n}*", ]
          // else                yield [ n, ]
          yield [n];
          n += step;
        }
        return null;
      }
    };
    for (k in R) {
      v = R[k];
      //.........................................................................................................
      R[k] = v.bind(R);
    }
    //.........................................................................................................
    dba.create_table_function({
      name: 'generate_series',
      columns: ['n'],
      parameters: ['start', 'stop', 'step'],
      rows: R.generate_series
    });
    //.........................................................................................................
    dba.create_table_function({
      name: 're_matches',
      columns: ['match', 'capture'],
      parameters: ['text', 'pattern'],
      rows: R.walk_pattern_matches
    });
    //.........................................................................................................
    return R;
  };

  //===========================================================================================================
  Ncr = class Ncr {
    // constructor: ->
    //---------------------------------------------------------------------------------------------------------
    parse_multirange_declaration(range_declaration) {
      var R, hi, i, len, lo, match, part, ref;
      validate.text(range_declaration);
      R = [];
      if (range_declaration === '') {
        return R;
      }
      ref = range_declaration.split(/,\s+/);
      for (i = 0, len = ref.length; i < len; i++) {
        part = ref[i];
        if ((match = part.match(/^(?<lo>.+)\.\.(?<hi>.+)/)) != null) {
          lo = match.groups.lo.codePointAt(0);
          hi = match.groups.hi.codePointAt(0);
        } else {
          validate.chr(part);
          lo = hi = part.codePointAt(0);
        }
        R.push({lo, hi});
      }
      return R;
    }

  };

  NCR = new Ncr();

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this["tags: tags_from_tagexchain"] = async function(T, done) {
    var Dtags, dtags, error, i, len, matcher, probe, probes_and_matchers;
    if (T != null) {
      T.halt_on_error();
    }
    //.........................................................................................................
    probes_and_matchers = [
      [
        ['+foo'],
        {
          foo: true
        }
      ],
      [
        ['+foo:"abc"'],
        {
          foo: 'abc'
        }
      ],
      [
        ['+font:"superset"'],
        {
          font: 'superset'
        }
      ],
      [
        ['+font:"font1"'],
        {
          font: 'font1'
        }
      ],
      [
        ['+font:"font1"',
        '+font:"Arial"'],
        {
          font: 'Arial'
        }
      ],
      [['+rounded',
      '-rounded'],
      {}],
      [
        ['+shape/ladder',
        '+shape/pointy'],
        {
          'shape/ladder': true,
          'shape/pointy': true
        }
      ]
    ];
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    dtags = new Dtags();
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = dtags.tags_from_tagexchain({
            tagexchain: probe
          });
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tags: add_tag with value"] = async function(T, done) {
    var Dtags, error, get_tags, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    //.........................................................................................................
    get_tags = function(dtags) {
      var R, ref, row;
      R = [];
      ref = dtags.dba.query("select * from t_tags;");
      for (row of ref) {
        // row.value = jp row.value
        R.push(row);
      }
      return R;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        {
          tag: 'foo'
        },
        [
          {
            nr: 1,
            tag: 'foo',
            value: 'false'
          }
        ]
      ],
      [
        {
          tag: 'foo',
          value: 'abc'
        },
        [
          {
            nr: 1,
            tag: 'foo',
            value: '"abc"'
          }
        ]
      ],
      [
        {
          tag: 'font',
          value: 'font1'
        },
        [
          {
            nr: 1,
            tag: 'font',
            value: '"font1"'
          }
        ]
      ],
      [
        {
          tag: 'rounded',
          value: false
        },
        [
          {
            nr: 1,
            tag: 'rounded',
            value: 'false'
          }
        ]
      ],
      [
        {
          tag: 'shape/ladder'
        },
        [
          {
            nr: 1,
            tag: 'shape/ladder',
            value: 'false'
          }
        ]
      ]
    ];
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var dtags, result;
          dtags = new Dtags();
          dtags.add_tag(probe);
          result = get_tags(dtags);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tags: parse_tagex"] = async function(T, done) {
    var Dtags, dtags, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    //.........................................................................................................
    probes_and_matchers = [
      [
        {
          tagex: '+foo'
        },
        {
          mode: '+',
          tag: 'foo',
          value: true
        }
      ],
      [
        {
          tagex: '-foo'
        },
        {
          mode: '-',
          tag: 'foo',
          value: false
        }
      ],
      [
        {
          tagex: '+shape/excentricity:0.2'
        },
        {
          mode: '+',
          tag: 'shape/excentricity',
          value: 0.2
        }
      ],
      [
        {
          tagex: '+css/font-family:"Helvetica"'
        },
        {
          mode: '+',
          tag: 'css/font-family',
          value: 'Helvetica'
        }
      ],
      [
        {
          tagex: '-css/font-family:"Helvetica"'
        },
        null,
        "Dtags_subtractive_value"
      ],
      [
        {
          tagex: '*bar'
        },
        null,
        "Dtags_invalid_tagex"
      ],
      [
        {
          tagex: '+bar:blah'
        },
        null,
        "Dtags_illegal_tagex_value_literal"
      ]
    ];
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    dtags = new Dtags();
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = dtags.parse_tagex(probe);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tags: fallbacks"] = function(T, done) {
    var Dtags, add_some_tags_and_ranges;
    // T?.halt_on_error()
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    //.........................................................................................................
    add_some_tags_and_ranges = function(dtags) {
      dtags.add_tag({
        tag: 'foo',
        value: true
      });
      dtags.add_tag({
        tag: 'bar',
        value: false
      });
      dtags.add_tag({
        tag: 'baz',
        value: 42
      });
      dtags.add_tagged_range({
        lo: 10,
        hi: 10,
        tag: 'foo'
      });
      dtags.add_tagged_range({
        lo: 11,
        hi: 11,
        mode: '-',
        tag: 'foo'
      });
      dtags.add_tagged_range({
        lo: 12,
        hi: 12,
        tag: 'bar'
      });
      dtags.add_tagged_range({
        lo: 13,
        hi: 13,
        mode: '-',
        tag: 'bar'
      });
      dtags.add_tagged_range({
        lo: 14,
        hi: 14,
        tag: 'baz',
        value: 108
      });
      dtags.add_tagged_range({
        lo: 15,
        hi: 15,
        mode: '-',
        tag: 'baz'
      });
      return null;
    };
    (() => { //...................................................................................................
      var dtags;
      dtags = new Dtags();
      add_some_tags_and_ranges(dtags);
      T.eq(dtags.get_fallbacks(), {
        foo: true,
        bar: false,
        baz: 42
      });
      T.eq(dtags.get_filtered_fallbacks(), {});
      T.eq(dtags.tags_from_id({
        id: 10
      }), {
        foo: true
      });
      T.eq(dtags.tags_from_id({
        id: 11
      }), {});
      T.eq(dtags.tags_from_id({
        id: 12
      }), {
        bar: true
      });
      T.eq(dtags.tags_from_id({
        id: 13
      }), {});
      T.eq(dtags.tags_from_id({
        id: 14
      }), {
        baz: 108
      });
      return T.eq(dtags.tags_from_id({
        id: 15
      }), {});
    })();
    (() => { //...................................................................................................
      var dtags;
      dtags = new Dtags({
        fallbacks: true
      });
      add_some_tags_and_ranges(dtags);
      T.eq(dtags.get_fallbacks(), {
        foo: true,
        bar: false,
        baz: 42
      });
      T.eq(dtags.get_filtered_fallbacks(), {
        foo: true,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 10
      }), {
        foo: true,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 11
      }), {
        foo: true,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 12
      }), {
        foo: true,
        baz: 42,
        bar: true
      });
      T.eq(dtags.tags_from_id({
        id: 13
      }), {
        foo: true,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 14
      }), {
        foo: true,
        baz: 108
      });
      return T.eq(dtags.tags_from_id({
        id: 15
      }), {
        foo: true,
        baz: 42
      });
    })();
    (() => { //...................................................................................................
      var dtags;
      dtags = new Dtags({
        fallbacks: 'all'
      });
      add_some_tags_and_ranges(dtags);
      T.eq(dtags.get_fallbacks(), {
        foo: true,
        bar: false,
        baz: 42
      });
      T.eq(dtags.get_filtered_fallbacks(), {
        foo: true,
        bar: false,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 10
      }), {
        foo: true,
        bar: false,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 11
      }), {
        foo: true,
        bar: false,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 12
      }), {
        foo: true,
        bar: true,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 13
      }), {
        foo: true,
        bar: false,
        baz: 42
      });
      T.eq(dtags.tags_from_id({
        id: 14
      }), {
        foo: true,
        bar: false,
        baz: 108
      });
      return T.eq(dtags.tags_from_id({
        id: 15
      }), {
        foo: true,
        bar: false,
        baz: 42
      });
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tags: add_tagged_range"] = async function(T, done) {
    var Dtags, dtags, error, get_tagged_ranges, i, len, matcher, prefix, probe, probes_and_matchers;
    // T?.halt_on_error()
    //.........................................................................................................
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    prefix = 't_';
    //.........................................................................................................
    get_tagged_ranges = function(dtags) {
      var R, ref, row;
      R = [];
      ref = dtags.dba.query(SQL`select * from t_tagged_ranges order by lo, hi, tag;`);
      for (row of ref) {
        row.value = jp(row.value);
        R.push(row);
      }
      return R;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        {
          lo: 1,
          hi: 11,
          mode: '+',
          tag: 'foo'
        },
        [
          {
            nr: 1,
            lo: 1,
            hi: 11,
            mode: '+',
            tag: 'foo',
            value: true
          }
        ]
      ],
      [
        {
          lo: 2,
          hi: 12,
          mode: '+',
          tag: 'foo',
          value: 'abc'
        },
        [
          {
            nr: 1,
            lo: 2,
            hi: 12,
            mode: '+',
            tag: 'foo',
            value: 'abc'
          }
        ]
      ],
      [
        {
          lo: 5,
          hi: 15,
          mode: '+',
          tag: 'font',
          value: 'font1'
        },
        [
          {
            nr: 1,
            lo: 5,
            hi: 15,
            mode: '+',
            tag: 'font',
            value: 'font1'
          }
        ]
      ],
      [
        {
          lo: 6,
          hi: 16,
          mode: '-',
          tag: 'rounded'
        },
        [
          {
            nr: 1,
            lo: 6,
            hi: 16,
            mode: '-',
            tag: 'rounded',
            value: false
          }
        ]
      ],
      [
        {
          lo: 7,
          hi: 17,
          mode: '+',
          tag: 'shape/ladder'
        },
        [
          {
            nr: 1,
            lo: 7,
            hi: 17,
            mode: '+',
            tag: 'shape/ladder',
            value: true
          }
        ]
      ]
    ];
    dtags = new Dtags();
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          dtags = new Dtags({prefix});
          dtags.add_tag(probe);
          dtags.add_tagged_range(probe);
          result = get_tagged_ranges(dtags);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tags: caching (1)"] = function(T, done) {
    var Dba, Dtags, dba, dtags, get_cache, get_tagged_ranges, prefix;
    // T?.halt_on_error()
    //.........................................................................................................
    ({Dba} = require('../../../apps/icql-dba'));
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    // E                 = require '../../../apps/icql-dba/lib/errors'
    prefix = 't_';
    dba = new Dba();
    dtags = new Dtags({dba, prefix});
    //.........................................................................................................
    get_tagged_ranges = function() {
      return dba.list(dba.query(SQL`select * from t_tagged_ranges order by nr;`));
    };
    get_cache = function() {
      return dba.list(dba.query(SQL`select * from t_tagged_ids_cache order by id;`));
    };
    (() => {      // get_tagchain      = ( id ) -> dba.list dba.query SQL"""
      //   select mode, tag, value from t_tagged_ranges where $id between lo and hi order by nr asc;""", { id, }
      //.........................................................................................................
      dtags.add_tag({
        tag: 'first'
      });
      dtags.add_tag({
        tag: 'second'
      });
      dtags.add_tagged_range({
        mode: '+',
        lo: 10,
        hi: 20,
        tag: 'first'
      });
      dtags.add_tagged_range({
        mode: '+',
        lo: 10,
        hi: 15,
        tag: 'second'
      });
      dtags.add_tagged_range({
        mode: '-',
        lo: 12,
        hi: 12,
        tag: 'second'
      });
      T.eq(get_cache(), []);
      T.eq(get_tagged_ranges(), [
        {
          nr: 1,
          lo: 10,
          hi: 20,
          mode: '+',
          tag: 'first',
          value: 'true'
        },
        {
          nr: 2,
          lo: 10,
          hi: 15,
          mode: '+',
          tag: 'second',
          value: 'true'
        },
        {
          nr: 3,
          lo: 12,
          hi: 12,
          mode: '-',
          tag: 'second',
          value: 'false'
        }
      ]);
      T.eq(dtags.tagchain_from_id({
        id: 10
      }), [
        {
          nr: 1,
          mode: '+',
          tag: 'first',
          value: true
        },
        {
          nr: 2,
          mode: '+',
          tag: 'second',
          value: true
        }
      ]);
      T.eq(dtags.tagchain_from_id({
        id: 12
      }), [
        {
          nr: 1,
          mode: '+',
          tag: 'first',
          value: true
        },
        {
          nr: 2,
          mode: '+',
          tag: 'second',
          value: true
        },
        {
          nr: 3,
          mode: '-',
          tag: 'second',
          value: false
        }
      ]);
      T.eq(dtags.tagchain_from_id({
        id: 16
      }), [
        {
          nr: 1,
          mode: '+',
          tag: 'first',
          value: true
        }
      ]);
      T.eq(get_cache(), []);
      T.eq(dtags.tags_from_id({
        id: 10
      }), {
        first: true,
        second: true
      });
      T.eq(dtags.tags_from_id({
        id: 12
      }), {
        first: true
      });
      T.eq(dtags.tags_from_id({
        id: 16
      }), {
        first: true
      });
      return T.eq(get_cache(), [
        {
          id: 10,
          tags: '{"first":true,"second":true}'
        },
        {
          id: 12,
          tags: '{"first":true}'
        },
        {
          id: 16,
          tags: '{"first":true}'
        }
      ]);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tags: caching with empty values"] = function(T, done) {
    var Dtags, dtags, get_cache, get_tagged_ranges, prefix;
    // T?.halt_on_error()
    //.........................................................................................................
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    prefix = 't_';
    dtags = new Dtags({
      prefix,
      fallbacks: true
    });
    //.........................................................................................................
    get_tagged_ranges = function() {
      return dtags.dba.list(dtags.dba.query(SQL`select * from t_tagged_ranges order by nr;`));
    };
    get_cache = function() {
      return dtags.dba.list(dtags.dba.query(SQL`select * from t_tagged_ids_cache order by id;`));
    };
    (() => {      // get_tagchain      = ( id ) -> dba.list dba.query SQL"""
      //   select mode, tag, value from t_tagged_ranges where $id between lo and hi order by nr asc;""", { id, }
      //.........................................................................................................
      dtags.add_tag({
        tag: 'first'
      });
      dtags.add_tagged_range({
        mode: '+',
        lo: 10,
        hi: 10,
        tag: 'first'
      });
      T.eq(get_cache(), []);
      T.eq(get_tagged_ranges(), [
        {
          nr: 1,
          lo: 10,
          hi: 10,
          mode: '+',
          tag: 'first',
          value: 'true'
        }
      ]);
      T.eq(dtags.tagchain_from_id({
        id: 10
      }), [
        {
          nr: 1,
          mode: '+',
          tag: 'first',
          value: true
        }
      ]);
      T.eq(dtags.tagchain_from_id({
        id: 11
      }), []);
      T.eq(get_cache(), []);
      T.eq(dtags.tags_from_id({
        id: 10
      }), {
        first: true
      });
      T.eq(dtags.tags_from_id({
        id: 11
      }), {});
      T.eq(get_cache(), [
        {
          id: 10,
          tags: '{"first":true}'
        },
        {
          id: 11,
          tags: '{}'
        }
      ]);
      console.table(dtags.dba.list(dtags.dba.query(SQL`select * from ${prefix}tagged_ids_cache order by id;`)));
      return console.table(dtags.dba.list(dtags.dba.query(SQL`select * from ${prefix}tagged_ranges order by lo, hi, nr;`)));
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  _add_tagged_ranges = function(dtags) {
    var hi, i, j, len, len1, lo, mode, ranges, ref, rules, seen_tags, tag, tagex, value;
    // [ '+superset',      'A..Z',               ]
    // [ '+font:"fallback"', 'A..Z',               ]
    // [ '+script:"latin"',  'A..Z',               ]
    rules = [['+font:"font1"', 'B..H, J, L, N..X'], ['+font:"font2"', 'B..D'], ['+font:"font3"', 'G..I'], ['+font:"font4"', 'M..Q'], ['+font:"font5"', 'M, O..T'], ['+font:"font6"', 'M, U, X..X'], ['+vowel', 'A, E, I, O, U'], ['+shape-pointy', 'A, V'], ['+shape-crossed', 'X'], ['+shape-ladder', 'A, H'], ['+pushraise:{"x":100,"y":200}', 'O']];
    seen_tags = new Set();
    seen_tags.add('font');
    dtags.add_tag({
      tag: 'font',
      value: 'fallback'
    });
    seen_tags.add('pushraise');
    dtags.add_tag({
      tag: 'pushraise',
      value: false
    });
    for (i = 0, len = rules.length; i < len; i++) {
      [tagex, ranges] = rules[i];
      ({mode, tag, value} = dtags.parse_tagex({tagex}));
      if (!seen_tags.has(tag)) {
        seen_tags.add(tag);
        dtags.add_tag({
          tag,
          value: (value === true ? false : value)
        });
      }
      ref = NCR.parse_multirange_declaration(ranges);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        ({lo, hi} = ref[j]);
        dtags.add_tagged_range({mode, tag, value, lo, hi});
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: ranges (1)"] = function(T, done) {
    var Dtags, f, fallbacks, i, len, ref;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    //.........................................................................................................
    f = function(fallbacks) {
      var chr, chr_from_cid, cid, cid_from_chr, dtags, first_cid, i, last_cid, prefix, ref, ref1, tags;
      prefix = 't_';
      dtags = new Dtags({prefix, fallbacks});
      cid_from_chr = function(chr) {
        return chr.codePointAt(0);
      };
      chr_from_cid = function(cid) {
        return String.fromCodePoint(cid);
      };
      dtags.dba.create_function({
        name: 'chr_from_cid',
        call: chr_from_cid
      });
      first_cid = cid_from_chr('A');
      last_cid = cid_from_chr('Z');
      //.......................................................................................................
      _add_tagged_ranges(dtags);
      //.......................................................................................................
      console.table(dtags.dba.list(dtags.dba.query(SQL`select
    nr                      as nr,
    chr_from_cid( lo )      as chr_lo,
    chr_from_cid( hi )      as chr_hi,
    mode                    as mode,
    tag                     as tag,
    value                   as value
  from ${prefix}tagged_ranges
  order by nr;`)));
      console.table(dtags.dba.list(dtags.dba.query(SQL`select * from ${prefix}tags order by tag;`)));
// console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tags_by_cid order by tag, cid, nr;"""
//.......................................................................................................
      for (cid = i = ref = first_cid, ref1 = last_cid; (ref <= ref1 ? i <= ref1 : i >= ref1); cid = ref <= ref1 ? ++i : --i) {
        chr = String.fromCodePoint(cid);
        tags = dtags.tags_from_id({
          id: cid
        });
        info(CND.gold(chr), CND.blue(tags));
      }
      return console.table(dtags.dba.list(dtags.dba.query(SQL`select * from ${prefix}tagged_ids_cache order by id;`)));
    };
    ref = ['all', true, false];
    // console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tagged_ranges order by lo, hi, nr;"""
    //.........................................................................................................
    for (i = 0, len = ref.length; i < len; i++) {
      fallbacks = ref[i];
      f(fallbacks);
    }
    return typeof done === "function" ? done() : void 0;
  };

  
  //-----------------------------------------------------------------------------------------------------------
  this["DBA: contiguous ranges"] = function(T, done) {
    var Dtags, chr_from_cid, cid_from_chr, dba, dtags, prefix;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    //.........................................................................................................
    prefix = 't_';
    dtags = new Dtags({
      prefix,
      fallbacks: true
    });
    ({dba} = dtags);
    cid_from_chr = function(chr) {
      return chr.codePointAt(0);
    };
    chr_from_cid = function(cid) {
      return String.fromCodePoint(cid);
    };
    //.........................................................................................................
    _add_tagged_ranges(dtags);
    dtags.add_tagged_range({
      lo: dtags.cfg.first_id,
      hi: dtags.cfg.last_id,
      tag: 'font',
      value: 'font1'
    });
    //.........................................................................................................
    console.table(dba.list(dba.query(SQL`select * from ${prefix}_potential_inflection_points order by id;`)));
    dtags._create_minimal_contiguous_ranges();
    console.table(dba.list(dba.query(SQL`select * from ${prefix}contiguous_ranges order by lo;`)));
    if (T != null) {
      T.eq(dba.first_row(dba.query(SQL`select * from ${prefix}contiguous_ranges where lo = 0 order by lo;`)), {
        lo: 0,
        hi: 64,
        tags: '{"font":"font1"}'
      });
    }
    if (T != null) {
      T.eq(dba.first_row(dba.query(SQL`select * from ${prefix}contiguous_ranges where lo = 89 order by lo;`)), {
        lo: 89,
        hi: 1114111,
        tags: '{"font":"font1"}'
      });
    }
    if (T != null) {
      T.eq(dtags.tags_from_id({
        id: 10
      }), {
        font: 'font1'
      });
    }
    if (T != null) {
      T.eq(dtags.tags_from_id({
        id: 65
      }), {
        font: 'font1',
        vowel: true,
        'shape-pointy': true,
        'shape-ladder': true
      });
    }
    if (T != null) {
      T.eq(dtags.tags_from_id({
        id: cid_from_chr('X')
      }), {
        font: 'font1',
        'shape-crossed': true
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: validate contiguous ranges"] = function(T, done) {
    var Dtags, chr_from_cid, cid_from_chr, dba, dtags, i, id, j, n, prefix, prv_hi, ref, row, rows;
    // T?.halt_on_error()
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    //.........................................................................................................
    prefix = 't_';
    dtags = new Dtags({
      prefix,
      fallbacks: true
    });
    ({dba} = dtags);
    cid_from_chr = function(chr) {
      return chr.codePointAt(0);
    };
    chr_from_cid = function(cid) {
      return String.fromCodePoint(cid);
    };
    //.........................................................................................................
    _add_tagged_ranges(dtags);
    dtags.add_tagged_range({
      lo: dtags.cfg.first_id,
      hi: dtags.cfg.last_id,
      tag: 'font',
      value: 'font1'
    });
    dtags._create_minimal_contiguous_ranges();
    //.........................................................................................................
    rows = dba.list(dba.query(SQL`select * from t_contiguous_ranges where lo = ?;`, [dtags.cfg.first_id]));
    if (T != null) {
      T.eq(rows.length, 1);
    }
    //.........................................................................................................
    rows = dba.list(dba.query(SQL`select * from t_contiguous_ranges where hi = ?;`, [dtags.cfg.last_id]));
    if (T != null) {
      T.eq(rows.length, 1);
    }
    //.........................................................................................................
    prv_hi = null;
    ref = dtags.dba.query(SQL`select * from t_contiguous_ranges order by lo;`);
    for (row of ref) {
      info('^4333^', row);
      T.ok(row.lo <= row.hi);
      if (prv_hi != null) {
        T.eq(row.lo, prv_hi + 1);
      }
      prv_hi = row.hi;
    }
//.........................................................................................................
    for (id = i = 0; i <= 100; id = ++i) {
      rows = dba.list(dba.query(SQL`select * from t_contiguous_ranges where ? between lo and hi;`, [id]));
      if (T != null) {
        T.eq(rows.length, 1);
      }
    }
//.........................................................................................................
    for (n = j = 1; j <= 10; n = ++j) {
      id = CND.random_integer(dtags.cfg.first_id, dtags.cfg.last_id + 1);
      rows = dba.list(dba.query(SQL`select * from t_contiguous_ranges where ? between lo and hi;`, [id]));
      if (T != null) {
        T.eq(rows.length, 1);
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  
  //-----------------------------------------------------------------------------------------------------------
  this["DBA: split text along ranges (demo)"] = function(T, done) {
    var Dtags, chr_from_cid, cid_from_chr, dba, dtags, prefix, to_hex;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    //.........................................................................................................
    prefix = 't_';
    dtags = new Dtags({
      prefix,
      fallbacks: true
    });
    ({dba} = dtags);
    cid_from_chr = function(chr) {
      return chr.codePointAt(0);
    };
    chr_from_cid = function(cid) {
      return String.fromCodePoint(cid);
    };
    to_hex = function(cid) {
      return '0x' + cid.toString(16);
    };
    dtags.dba.create_function({
      name: 'to_hex',
      call: to_hex
    });
    dtags.dba.create_function({
      name: 'chr_from_cid',
      call: chr_from_cid
    });
    //.........................................................................................................
    _add_tagged_ranges(dtags);
    dtags.add_tagged_range({
      lo: dtags.cfg.first_id,
      hi: dtags.cfg.last_id,
      tag: 'font',
      value: 'font1'
    });
    dtags._create_minimal_contiguous_ranges();
    console.table(dba.list(dba.query(SQL`select
  to_hex( lo )          as lo,
  to_hex( hi )          as hi,
  chr_from_cid( lo )    as loc,
  chr_from_cid( hi )    as hic,
  tags
from ${prefix}contiguous_ranges
order by lo;`)));
    (function() {      //.........................................................................................................
      var R, group, groups, i, len, match, part, re, ref, ref1, results, text;
      /* Demo for a regex that partitons a text into chunks of characters that all have the same tags. */
      debug('abcdefgh'.match(/(?<vowels>[aeiou])/g));
      text = 'arbitrary text';
      re = /(?<g1>[a-d]+\s*)|(?<g2>[e-h]+\s*)|(?<g3>[i-n]+\s*)|(?<g4>[o-t]+\s*)|(?<g5>[u-z]+\s*)|(?<g0>\s+)/g;
      //.......................................................................................................
      R = [];
      ref = [...(text.matchAll(re))];
      for (i = 0, len = ref.length; i < len; i++) {
        match = ref[i];
        ({groups} = match);
        ref1 = match.groups;
        for (group in ref1) {
          part = ref1[group];
          if (part == null) {
            continue;
          }
          R.push({group, part});
          break;
        }
      }
      results = [];
      for (group in R) {
        part = R[group];
        results.push(info(group, rpr(part)));
      }
      return results;
    })();
    (function() {      //.........................................................................................................
      var f, re, text;
      /* Build regex to split text from actual table contents */
      dtags._hex_re_from_contiguous_ranges = function() {
        /* TAINT make addition of spaces configurable, e.g. as `all_groups_extra: '\\s'`  */
        var hi, lo, ranges, ref, row;
        ranges = [];
        ref = dtags.dba.query(SQL`select * from ${prefix}contiguous_ranges order by lo;`);
        for (row of ref) {
          lo = `\\u{${row.lo.toString(16)}}`;
          if (row.lo === row.hi) {
            ranges.push(`(?<g${row.lo}>[${lo}]+)`);
          } else {
            hi = `\\u{${row.hi.toString(16)}}`;
            ranges.push(`(?<g${row.lo}>[${lo}-${hi}]+)`);
          }
        }
        ranges = ranges.join('|');
        return new RegExp(`${ranges}`, 'gu');
      };
      //.......................................................................................................
      whisper('-'.repeat(108));
      text = "ARBITRARY TEXT";
      text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      re = dtags._hex_re_from_contiguous_ranges();
      debug('^33436^', re);
      // re = /(?<g0>[\u{0000}-\u{0040}]+s*)|(?<g65>\u{0041}+s*)|(?<g66>[\u{0042}-\u{0044}]+s*)/gu
      // re = /([\u{0000}-\u{0040}]\s*)/gu
      // re = /(?<g777>[a-z]+)/gu
      debug('^33436^', re);
      f = function(re, text) {
        var R, idx, key, match, ref, ref1, value;
        R = [];
        idx = 0;
        debug(text.length);
        ref = text.matchAll(re);
        for (match of ref) {
          ref1 = match.groups;
          for (key in ref1) {
            value = ref1[key];
            if (value != null) {
              break;
            }
          }
          if (match.index > idx) {
            warn(idx, match.index, CND.reverse(rpr(text.slice(idx, match.index))));
            idx = match.index;
          }
          idx += value.length;
          info(match.index, idx, key, rpr(value));
        }
        return R;
      };
      return f(re, text);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  
  //-----------------------------------------------------------------------------------------------------------
  this["DBA: split text along ranges"] = function(T, done) {
    var Dtags, chr_from_cid, cid_from_chr, dba, dtags, prefix, tagsets_by_keys, to_hex;
    // T?.halt_on_error()
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    //.........................................................................................................
    prefix = 't_';
    dtags = new Dtags({
      prefix,
      fallbacks: true
    });
    ({dba} = dtags);
    cid_from_chr = function(chr) {
      return chr.codePointAt(0);
    };
    chr_from_cid = function(cid) {
      return String.fromCodePoint(cid);
    };
    to_hex = function(cid) {
      return '0x' + cid.toString(16);
    };
    dtags.dba.create_function({
      name: 'to_hex',
      call: to_hex
    });
    dtags.dba.create_function({
      name: 'chr_from_cid',
      call: chr_from_cid
    });
    //.........................................................................................................
    _add_tagged_ranges(dtags);
    dtags.add_tagged_range({
      lo: dtags.cfg.first_id,
      hi: dtags.cfg.last_id,
      tag: 'font',
      value: 'font1'
    });
    tagsets_by_keys = dtags.get_tagsets_by_keys();
    if (T != null) {
      T.eq(tagsets_by_keys, {
        g1: {
          font: 'font1',
          'shape-crossed': true
        },
        g2: {
          font: 'font1',
          'shape-ladder': true
        },
        g3: {
          font: 'font1',
          'shape-pointy': true
        },
        g4: {
          font: 'font1',
          vowel: true,
          pushraise: {
            x: 100,
            y: 200
          }
        },
        g5: {
          font: 'font1',
          vowel: true,
          'shape-pointy': true,
          'shape-ladder': true
        },
        g6: {
          font: 'font1',
          vowel: true
        },
        g7: {
          font: 'font1'
        }
      });
    }
    dtags._create_minimal_contiguous_ranges();
    console.table(dba.list(dba.query(SQL`select
  lo                    as lo,
  hi                    as hi,
  to_hex( lo )          as lox,
  to_hex( hi )          as hix,
  chr_from_cid( lo )    as loc,
  chr_from_cid( hi )    as hic,
  tags
from ${prefix}contiguous_ranges
order by lo;`)));
    console.table(dba.list(dba.query(SQL`select * from ${prefix}tags_and_rangelists;`)));
    (function() {      //.........................................................................................................
      var i, len, ref, region, regions, text;
      // text  = "ARBITRARY TEXT"
      text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      ref = regions = dtags.find_tagged_regions(text);
      for (i = 0, len = ref.length; i < len; i++) {
        region = ref[i];
        debug('^33443^', region);
      }
      if (T != null) {
        T.eq(regions, [
          {
            key: 'g5',
            start: 0,
            stop: 1,
            part: 'A'
          },
          {
            key: 'g7',
            start: 1,
            stop: 4,
            part: 'BCD'
          },
          {
            key: 'g6',
            start: 4,
            stop: 5,
            part: 'E'
          },
          {
            key: 'g7',
            start: 5,
            stop: 7,
            part: 'FG'
          },
          {
            key: 'g2',
            start: 7,
            stop: 8,
            part: 'H'
          },
          {
            key: 'g6',
            start: 8,
            stop: 9,
            part: 'I'
          },
          {
            key: 'g7',
            start: 9,
            stop: 14,
            part: 'JKLMN'
          },
          {
            key: 'g4',
            start: 14,
            stop: 15,
            part: 'O'
          },
          {
            key: 'g7',
            start: 15,
            stop: 20,
            part: 'PQRST'
          },
          {
            key: 'g6',
            start: 20,
            stop: 21,
            part: 'U'
          },
          {
            key: 'g3',
            start: 21,
            stop: 22,
            part: 'V'
          },
          {
            key: 'g7',
            start: 22,
            stop: 23,
            part: 'W'
          },
          {
            key: 'g1',
            start: 23,
            stop: 24,
            part: 'X'
          },
          {
            key: 'g7',
            start: 24,
            stop: 26,
            part: 'YZ'
          }
        ]);
      }
      tagsets_by_keys = dtags.get_tagsets_by_keys();
      return T != null ? T.eq(tagsets_by_keys, {
        g1: {
          font: 'font1',
          'shape-crossed': true
        },
        g2: {
          font: 'font1',
          'shape-ladder': true
        },
        g3: {
          font: 'font1',
          'shape-pointy': true
        },
        g4: {
          font: 'font1',
          vowel: true,
          pushraise: {
            x: 100,
            y: 200
          }
        },
        g5: {
          font: 'font1',
          vowel: true,
          'shape-pointy': true,
          'shape-ladder': true
        },
        g6: {
          font: 'font1',
          vowel: true
        },
        g7: {
          font: 'font1'
        }
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  
  //-----------------------------------------------------------------------------------------------------------
  this["DBA: tagged text"] = function(T, done) {
    var Cupofhtml, Dtags, H, INTERTEXT, S, _tag, chr, chr_from_cid, chrs, cid_from_chr, cupofhtml, dtag_as_html_tag, dtags, fallbacks, flush, html_tag, i, id, is_open, len, prefill_stack, ref, stack, tag, tags, text, value;
    if (T != null) {
      T.halt_on_error();
    }
    INTERTEXT = require('../../../apps/intertext');
    ({Cupofhtml} = INTERTEXT.CUPOFHTML);
    cupofhtml = new Cupofhtml();
    ({
      tag: _tag,
      S,
      H
    } = cupofhtml.export());
    //.........................................................................................................
    ({Dtags} = require('../../../apps/icql-dba-tags'));
    fallbacks = 'all';
    dtags = new Dtags({fallbacks});
    cid_from_chr = function(chr) {
      return chr.codePointAt(0);
    };
    chr_from_cid = function(cid) {
      return String.fromCodePoint(cid);
    };
    // dtags.dba.create_function name: 'chr_from_cid', call: chr_from_cid
    // dtags.dba.create_function name: 'cid_from_chr', call: cid_from_chr
    _add_tagged_ranges(dtags);
    //.........................................................................................................
    text = "lore ipsum";
    text = text.toUpperCase();
    chrs = Array.from(text);
    //.........................................................................................................
    is_open = {};
    stack = [];
    //.........................................................................................................
    dtag_as_html_tag = function(tag, value) {
      var R, closer, opener, type;
      switch ((type = type_of(value))) {
        case 'object':
          urge('^77464^', INTERTEXT.CUPOFHTML._html_from_datom({}, {
            $key: '<foo',
            bar: 42
          }));
          urge('^77464^', INTERTEXT.CUPOFHTML._html_from_datom({}, {
            $key: '^foo',
            bar: 42
          }));
          urge('^77464^', INTERTEXT.CUPOFHTML._html_from_datom({}, {
            $key: '>foo',
            bar: 42
          }));
          urge('^77464^', INTERTEXT.CUPOFHTML._html_from_datom({}, 'foo<bar>'));
          _tag('mytag', value, '\x00');
          R = cupofhtml.as_html();
          [opener, closer] = R.split('\x00');
          return opener;
        default:
          return `<${tag} class='${value}'>`;
      }
    };
    //.........................................................................................................
    prefill_stack = function*() {
      var ref, tag, value;
      ref = dtags.get_fallbacks();
      for (tag in ref) {
        value = ref[tag];
        stack.push({tag, value});
        yield dtag_as_html_tag(tag, value);
      }
      return null;
    };
    ref = prefill_stack();
    for (html_tag of ref) {
      debug('^5576^', html_tag);
    }
    whisper('^545^', stack);
// return done?()
//.........................................................................................................
    for (i = 0, len = chrs.length; i < len; i++) {
      chr = chrs[i];
      id = cid_from_chr(chr);
      tags = dtags.tags_from_id({id});
      whisper('^777^', chr, tags);
      for (tag in tags) {
        value = tags[tag];
        info('^44476^', {tag, value});
        if (tag !== 'font' && tag !== 'vowel') {
          continue;
        }
        if ((is_open[tag] != null ? is_open[tag] : is_open[tag] = false)) {
          (flush = function() {
            var top_tag;
            while (true) {
              top_tag = stack.pop();
              urge('^777^', `</${top_tag}>`);
              is_open[top_tag] = false;
              if (tag === top_tag) {
                break;
              }
            }
            return null;
          })();
        }
        debug('^777^', chr);
        is_open[tag] = true;
        info('^777^', `<${tag} class='${value}'>`);
        stack.push(tag);
        whisper('^777^', stack);
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  
  //-----------------------------------------------------------------------------------------------------------
  demo_html = function() {
    var Cupofhtml, H, INTERTEXT, S, cram, cupofhtml, datoms_from_html, expand, html, html_from_datoms, tag;
    INTERTEXT = require('../../../apps/intertext');
    ({Cupofhtml} = INTERTEXT.CUPOFHTML);
    cupofhtml = new Cupofhtml();
    ({cram, expand, tag, S, H} = cupofhtml.export());
    ({datoms_from_html, html_from_datoms} = INTERTEXT.HTML.export());
    //.........................................................................................................
    H.p(function() {
      S.text("An interesting ");
      tag('em', "fact");
      S.text(" about CupOfJoe is that you ");
      tag('em', {
        foo: 'bar'
      }, function() {
        return S.text("can");
      });
      return tag('strong', " nest", " with both sequences", " and function calls.");
    });
    //.........................................................................................................
    html = cupofhtml.as_html();
    info(cupofhtml.last_expansion);
    urge('\n' + html);
    //.........................................................................................................
    H.p("another paragraph");
    debug(cupofhtml.as_html());
    //.........................................................................................................
    tag('p', {
      guess: 'what'
    }, function() {
      S.text("yet another paragraph");
      return tag('foobar', {
        atr: 'value with spaces'
      }, "yay");
    });
    debug(cupofhtml.as_html());
    //.........................................................................................................
    return null;
  };

  regex_demo = function() {
    /* ... but we prefer to not special-case whitespace to avoid spaces to be treated like a preceding
     special-cased glyf (which might get scaled, translated and so on); `<g3>` is now an ordinary group
     without any overlaps: */
    var R, idx, key, match, re, ref, ref1, text, value;
    text = " abcdab cfgbbzäöüabc ÄÖÜ z";
    // re    = dtags._hex_re_from_contiguous_ranges()
    // debug '^33436^', re
    // re = /(?<g0>[\u{0000}-\u{0040}]+s*)|(?<g65>\u{0041}+s*)|(?<g66>[\u{0042}-\u{0044}]+s*)/gu
    // re = /([\u{0000}-\u{0040}]\s*)/gu
    /* Version with trailing spaces becoming part of preceding group; `<g0>` only used for leading space
     and space after unmatched characters (hich should never happen) */
    re = /(?<g0>[\s]+)|(?<g1>[\u{61}-\u{65}\s]+)|(?<g2>[\u{66}-\u{7a}\s]+)/gu;
    re = /(?<g1>[\u{61}-\u{65}]+)|(?<g2>[\u{66}-\u{7a}]+)|(?<g3>[\s]+)/gu;
    debug('^33436^', re);
    R = [];
    idx = 0;
    debug(text.length);
    ref = text.matchAll(re);
    for (match of ref) {
      ref1 = match.groups;
      for (key in ref1) {
        value = ref1[key];
        if (value != null) {
          break;
        }
      }
      if (match.index > idx) {
        warn(idx, match.index, CND.reverse(rpr(text.slice(idx, match.index))));
        idx = match.index;
      }
      idx += value.length;
      info(match.index, idx, key, rpr(value));
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      // test @[ "DBA: ranges (1)" ]
      // test @[ "DBA: contiguous ranges" ]
      // test @[ "DBA: validate contiguous ranges" ]
      // test @[ "DBA: split text along ranges (demo)" ]
      return test(this["DBA: split text along ranges"]);
    })();
  }

  // @[ "DBA: split text along ranges" ]()
// regex_demo()
// @[ "DBA: contiguous ranges" ]()
// test @[ "tags: caching with empty values" ]
// test @[ "tags: tags_from_tagexchain" ]
// test @[ "tags: add_tagged_range" ]
// test @[ "tags: add_tag with value" ]
// test @[ "tags: parse_tagex" ]
// @[ "DBA: ranges (1)" ]()
// test @[ "tags: caching (1)" ]
// test @[ "tags: fallbacks" ]
// @[ "tags: fallbacks" ]()
// @[ "DBA: tagged text" ]()
// demo_html()
/*
 * from https://github.com/loveencounterflow/hengist/tree/master/dev/kitty-font-config-writer-kfcw

superset          ABCDEFGHIJKLMNOPQRSTUVWXYZ  │ CSS-like Configuration with Overlapping Ranges
————————————————— ——————————————————————————  ——————————————————————————————————————————————————————————————
font1             BCDEFGH J L NOPQRSTUVWX    │ [B-H] [J] [L] [N-X]                      ◮ least precedence
font2             BCD                        │ [B-D]                                    │
font3                  GHI                   │ [G-I]                                    │
font4                        MNOPQ           │ [M-Q]                                    │
font5                        M OPQRST        │ [M] [O-T]                                │
font6                        M       U  XY   │ [M] [U] [X-Y]                            │ most precedence
 */

}).call(this);

//# sourceMappingURL=main.tests.js.map
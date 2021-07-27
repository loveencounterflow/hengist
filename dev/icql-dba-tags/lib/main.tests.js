(function() {
  'use strict';
  var CND, NCR, Ncr, PATH, SQL, badge, dba_path, debug, echo, freeze, help, info, isa, jp, jr, lets, on_process_exit, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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
  this["tags: tags_from_tagchain"] = async function(T, done) {
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
        ['+foo:abc'],
        {
          foo: 'abc'
        }
      ],
      [
        ['+font:superset'],
        {
          font: 'superset'
        }
      ],
      [
        ['+font:font1'],
        {
          font: 'font1'
        }
      ],
      [
        ['+font:"font1"'],
        {
          font: 'font1'
        }
      ],
      [
        ["+font:'font1'"],
        {
          font: 'font1'
        }
      ],
      [
        ['+font:font1',
        '+font:Arial'],
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
          result = dtags.tags_from_tagchain(probe);
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
            tag: 'foo',
            value: 'true'
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
            tag: 'shape/ladder',
            value: 'true'
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
    var Dba, E, dba, dtags, get_cache, get_tagged_ranges, prefix;
    if (T != null) {
      T.halt_on_error();
    }
    //.........................................................................................................
    ({Dba} = require('../../../apps/icql-dba'));
    E = require('../../../apps/icql-dba/lib/errors');
    prefix = 't_';
    dba = new Dba();
    dtags = new Dtags({dba, prefix});
    //.........................................................................................................
    get_tagged_ranges = function() {
      return dba.list(dba.query(SQL`select * from t_tagged_ranges order by lo, hi, tag;`));
    };
    get_cache = function() {
      return dba.list(dba.query(SQL`select * from t_tagged_cids_cache order by cid, tag;`));
    };
    (() => {      //.........................................................................................................
      dtags.add_tag({
        tag: 'first'
      });
      dtags.add_tagged_range({
        tag: 'first',
        lo: 10,
        hi: 20
      });
      debug('^4487^', get_tagged_ranges());
      debug('^4487^', get_cache());
      T.eq(get_tagged_ranges(), [
        {
          nr: 1,
          lo: 10,
          hi: 20,
          tag: 'first'
        }
      ]);
      T.eq(get_cache(), []);
      return debug('^4487^', get_cache());
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: ranges (1)"] = function(T, done) {
    var Dba, E, chr, chr_from_cid, cid, cid_from_chr, dba, dtags, first_cid, hi, i, j, k, last_cid, len, len1, lo, prefix, ranges, ref, ref1, ref2, rules, tag, tags, value;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dba} = require('../../../apps/icql-dba'));
    E = require('../../../apps/icql-dba/lib/errors');
    prefix = 't_';
    dba = new Dba();
    dtags = new Dtags({dba, prefix});
    cid_from_chr = function(chr) {
      return chr.codePointAt(0);
    };
    chr_from_cid = function(cid) {
      return String.fromCodePoint(cid);
    };
    dba.create_function({
      name: 'chr_from_cid',
      call: chr_from_cid
    });
    first_cid = cid_from_chr('A');
    last_cid = cid_from_chr('Z');
    //.........................................................................................................
    rules = [
      // [ '+superset',      'A..Z',               ]
      ['+font:fallback',
      'A..Z'],
      // [ '+script:latin',  'A..Z',               ]
      ['+font:font1',
      'B..H, J, L, N..X'],
      ['+font:font2',
      'B..D'],
      ['+font:font3',
      'G..I'],
      ['+font:font4',
      'M..Q'],
      ['+font:font5',
      'M, O..T'],
      ['+font:font6',
      'M, U, X..Y'],
      ['+vowel',
      'A, E, I, O, U'],
      ['+shape/pointy',
      'A, V'],
      ['+shape/crossed',
      'X'],
      ['+shape/ladder',
      'A, H']
    ];
    for (i = 0, len = rules.length; i < len; i++) {
      [tag, ranges] = rules[i];
      dtags.add_tag({tag});
      ref = NCR.parse_multirange_declaration(ranges);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        ({lo, hi} = ref[j]);
        dtags.add_tagged_range({tag, lo, hi});
      }
    }
    //.........................................................................................................
    console.table(dba.list(dba.query(SQL`select
    nr                      as nr,
    tag                     as tag,
    chr_from_cid( lo )      as chr_lo,
    chr_from_cid( hi )      as chr_hi
  from ${prefix}tagged_ranges
  order by nr;`)));
    console.table(dba.list(dba.query(SQL`select * from ${prefix}tags order by tag;`)));
// console.table dba.list dba.query SQL"""select * from #{prefix}tags_by_cid order by tag, cid, nr;"""
//.........................................................................................................
    for (cid = k = ref1 = first_cid, ref2 = last_cid; (ref1 <= ref2 ? k <= ref2 : k >= ref2); cid = ref1 <= ref2 ? ++k : --k) {
      chr = String.fromCodePoint(cid);
      tags = dtags.tags_from_tagchain(dtags.tagchain_from_cid({cid}));
      info(CND.gold(chr), CND.blue(tags));
      for (tag in tags) {
        value = tags[tag];
        value = JSON.stringify(value);
        dba.run(SQL`insert into ${prefix}tagged_cids_cache ( cid, tag, value )
  values ( $cid, $tag, $value );`, {cid, tag, value});
      }
    }
    console.table(dba.list(dba.query(SQL`select * from ${prefix}tagged_cids_cache order by cid, tag;`)));
    return typeof done === "function" ? done() : void 0;
  };

  
  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      // test @[ "DBA: ranges (1)" ]
      // test @[ "tags: tags_from_tagchain" ]
      // test @[ "tags: add_tagged_range" ]
      return test(this["tags: add_tag with value"]);
    })();
  }

  // @[ "DBA: ranges (1)" ]()
// test @[ "tags: caching (1)" ]
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
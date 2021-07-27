(function() {
  'use strict';
  var CND, Dbatags, H, NCR, Ncr, PATH, SQL, badge, dba_path, debug, echo, freeze, help, info, isa, jp, jr, lets, on_process_exit, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/BASICS';

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

  H = require('./helpers');

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
  types.declare('dbatags_constructor_cfg', {
    tests: {
      '@isa.object x': function(x) {
        return this.isa.object(x);
      },
      'x.prefix is a prefix': function(x) {
        if (!this.isa.text(x.prefix)) {
          return false;
        }
        if (x.prefix === '') {
          return true;
        }
        return /^[_a-z][_a-z0-9]*$/.test(x.prefix);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('dbatags_tag', {
    tests: {
      '@isa.nonempty_text x': function(x) {
        return this.isa.nonempty_text(x);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('dbatags_add_tag_cfg', {
    tests: {
      '@isa.object x': function(x) {
        return this.isa.object(x);
      },
      '@isa.dbatags_tag x.tag': function(x) {
        return this.isa.dbatags_tag(x.tag);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('dbatags_add_tagged_range_cfg', {
    tests: {
      '@isa.object x': function(x) {
        return this.isa.object(x);
      },
      '@isa.integer x.lo': function(x) {
        return this.isa.integer(x.lo);
      },
      '@isa.integer x.hi': function(x) {
        return this.isa.integer(x.hi);
      },
      '@isa.dbatags_tag x.tag': function(x) {
        return this.isa.dbatags_tag(x.tag);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('dbatags_tagchain_from_cid_cfg', {
    tests: {
      '@isa.object x': function(x) {
        return this.isa.object(x);
      },
      '@isa.integer x.cid': function(x) {
        return this.isa.integer(x.cid);
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  types.defaults = {
    dbatags_constructor_cfg: {
      dba: null,
      prefix: 't_'
    },
    dbatags_add_tag_cfg: {
      tag: null
    },
    dbatags_add_tagged_range_cfg: {
      tag: null,
      lo: null,
      hi: null
    },
    dbatags_tagchain_from_cid_cfg: {
      cid: null
    }
  };

  Dbatags = (function() {
    //===========================================================================================================
    class Dbatags {
      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        validate.dbatags_constructor_cfg(this.cfg = {...types.defaults.dbatags_constructor_cfg, ...cfg});
        if (this.cfg.dba != null) {
          this.dba = this.cfg.dba;
          delete this.cfg.dba;
        } else {
          this.dba = new (require(dba_path)).Dba();
        }
        this.cfg = freeze(this.cfg);
        this._create_db_structure();
        this._compile_sql();
        return void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      _create_db_structure() {
        var x;
        x = this.cfg.prefix;
        this.dba.execute(SQL`create table if not exists ${x}tags ( tag text unique not null primary key );
create table if not exists ${x}tagged_ranges (
    nr      integer primary key,
    lo      integer not null,
    hi      integer not null,
    -- chr_lo  text generated always as ( chr_from_cid( lo ) ) virtual not null,
    -- chr_hi  text generated always as ( chr_from_cid( hi ) ) virtual not null,
    tag     text    not null references ${x}tags ( tag ) );
create index if not exists ${x}cidlohi_idx on ${x}tagged_ranges ( lo, hi );
create index if not exists ${x}cidhi_idx on   ${x}tagged_ranges ( hi );
create table if not exists ${x}tagged_cids_cache (
    cid     integer not null,
    -- chr     text    not null,
    tag     text    not null,
    value   json    not null,
  primary key ( cid, tag ) );`);
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      _compile_sql() {
        var x;
        x = this.cfg.prefix;
        this.sql = {
          insert_tag: SQL`insert into ${x}tags ( tag )
  values ( $tag )
  on conflict ( tag ) do nothing;`,
          insert_tagged_range: SQL`insert into ${x}tagged_ranges ( lo, hi, tag )
  values ( $lo, $hi, $tag )`,
          tags_from_cid: SQL`select
    tag,
    value
  from ${x}tagged_ranges
  where $cid between lo and hi
  order by nr asc;`
        };
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      add_tag(cfg) {
        validate.dbatags_add_tag_cfg(cfg = {...types.defaults.dbatags_add_tag_cfg, ...cfg});
        this.dba.run(this.sql.insert_tag, cfg);
        this._clear_cache_for_range(cfg);
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      _clear_cache_for_range(cfg) {}

      //---------------------------------------------------------------------------------------------------------
      add_tagged_range(cfg) {
        validate.dbatags_add_tagged_range_cfg(cfg = {...types.defaults.dbatags_add_tagged_range_cfg, ...cfg});
        this.dba.run(this.sql.insert_tagged_range, cfg);
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      tagchain_from_cid(cfg) {
        var R, ref, row;
        validate.dbatags_tagchain_from_cid_cfg(cfg = {...types.defaults.dbatags_tagchain_from_cid_cfg, ...cfg});
        R = [];
        ref = this.dba.query(this.sql.tags_from_cid, {
          cid: cfg.cid
        });
        for (row of ref) {
          R.push([row.tag, row.value]);
        }
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      tags_from_cid(cfg) {
        throw new Error('XXXXXXXXXXXXXXX');
      }

      //---------------------------------------------------------------------------------------------------------
      tags_from_tagchain(tagchain) {
        var R, i, key, len, match, mode, ref, tag_expression, value;
        validate_list_of.text(tagchain);
        R = {};
        if (tagchain.length === 0) {
          return R;
        }
        for (i = 0, len = tagchain.length; i < len; i++) {
          tag_expression = tagchain[i];
          if ((match = tag_expression.match(this.tag_pattern)) == null) {
            throw new Error(`^tags_from_tagchain@448^ tag expression not recognized: ${rpr(tag_expression)}`);
          }
          // debug '^9458^', match
          ({mode, key, value} = match.groups);
          switch (mode) {
            case '+':
              if (value == null) {
                value = true;
              } else if ((ref = value[0]) === '"' || ref === "'") {
                value = value.slice(1, value.length - 1);
              }
              R[key] = value;
              break;
            case '-':
              delete R[key];
          }
        }
        return R;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Dbatags.prototype.tag_pattern = /^(?<mode>[-+])(?<key>[a-zA-Z_\/\$][-a-zA-Z0-9_\/\$]*)(:(?<value>[^-+]+|'.*'|".*"))?$/;

    return Dbatags;

  }).call(this);

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

  //###########################################################################################################
  this["tags: tags_from_tagchain"] = async function(T, done) {
    var dbatags, error, i, len, matcher, probe, probes_and_matchers;
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
    dbatags = new Dbatags();
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = dbatags.tags_from_tagchain(probe);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tags: caching (1)"] = function(T, done) {
    var Dba, E, dba, dbatags, get_cache, get_tagged_ranges, prefix;
    if (T != null) {
      T.halt_on_error();
    }
    //.........................................................................................................
    ({Dba} = require('../../../apps/icql-dba'));
    E = require('../../../apps/icql-dba/lib/errors');
    prefix = 't_';
    dba = new Dba();
    dbatags = new Dbatags({dba, prefix});
    //.........................................................................................................
    get_tagged_ranges = function() {
      return dba.list(dba.query(SQL`select * from t_tagged_ranges order by lo, hi, tag;`));
    };
    get_cache = function() {
      return dba.list(dba.query(SQL`select * from t_tagged_cids_cache order by cid, tag;`));
    };
    (() => {      //.........................................................................................................
      dbatags.add_tag({
        tag: 'first'
      });
      dbatags.add_tagged_range({
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
    var Dba, E, chr, chr_from_cid, cid, cid_from_chr, dba, dbatags, first_cid, hi, i, j, k, last_cid, len, len1, lo, prefix, ranges, ref, ref1, ref2, rules, tag, tags, value;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dba} = require('../../../apps/icql-dba'));
    E = require('../../../apps/icql-dba/lib/errors');
    prefix = 't_';
    dba = new Dba();
    dbatags = new Dbatags({dba, prefix});
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
      dbatags.add_tag({tag});
      ref = NCR.parse_multirange_declaration(ranges);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        ({lo, hi} = ref[j]);
        dbatags.add_tagged_range({tag, lo, hi});
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
      tags = dbatags.tags_from_tagchain(dbatags.tagchain_from_cid({cid}));
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
      return test(this, {
        timeout: 10e3
      });
    })();
  }

  // test @[ "DBA: ranges (1)" ]
// test @[ "tags: tags_from_tagchain" ]
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

//# sourceMappingURL=ranges.tests.js.map
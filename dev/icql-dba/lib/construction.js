(function() {
  'use strict';
  var CND, Dba, Dbax, E, H, PATH, SQL, _Xxx_dbax, _xxx_dba, badge, debug, echo, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/CONSTRUCTION';

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

  SQL = String.raw;

  guy = require('../../../apps/guy');

  ({Dba} = require(H.icql_dba_path));

  E = require(H.icql_dba_path + '/lib/errors');

  _Xxx_dbax = (function() {
    class _Xxx_dbax extends Dba {};

    _Xxx_dbax._rnd_int_cfg = true;

    return _Xxx_dbax;

  }).call(this);

  _xxx_dba = new _Xxx_dbax();

  types.declare('dba_urlsafe_word', {
    tests: {
      "@isa.nonempty_text x": function(x) {
        return this.isa.nonempty_text(x);
      },
      "/^[a-zA-Z0-9_]+$/.test x": function(x) {
        return /^[a-zA-Z0-9_]+$/.test(x);
      }
    }
  });

  types.declare('constructor_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      },
      "@isa_optional.boolean x.ram": function(x) {
        return this.isa_optional.boolean(x.ram);
      },
      "@isa_optional.nonempty_text x.url": function(x) {
        return this.isa_optional.nonempty_text(x.url);
      },
      "@isa_optional.dba_urlsafe_word x.dbnick": function(x) {
        return this.isa_optional.dba_urlsafe_word(x.dbnick);
      },
      "@isa_optional.dba_urlsafe_word x.dbnick": function(x) {
        return this.isa_optional.dba_urlsafe_word(x.dbnick);
      }
    }
  });

  Dbax = (function() {
    class Dbax { // extends Dba
      //---------------------------------------------------------------------------------------------------------
      static cast_constructor_cfg(self) {
        var base, base1, dbnick, ref, url;
        if ((self.cfg.ram === false) && (self.cfg.path == null)) {
          throw new E.Dba_cfg_error('^dba@1^', `missing argument \`path\`, got ${rpr(self.cfg)}`);
        }
        if ((base = self.cfg).ram == null) {
          base.ram = self.cfg.path == null;
        }
        if ((!self.cfg.ram) && (self.cfg.path != null) && (self.cfg.dbnick != null)) {
          throw new E.Dba_cfg_error('^dba@1^', `only RAM DB can have both \`path\` and \`dbnick\`, got ${rpr(self.cfg)}`);
        }
        if (self.cfg.ram) {
          ({dbnick, url} = _xxx_dba._get_connection_url((ref = self.cfg.dbnick) != null ? ref : null));
          if ((base1 = self.cfg).dbnick == null) {
            base1.dbnick = dbnick;
          }
          self.cfg.url = url;
        } else {
          self.cfg.url = null;
        }
        return self.cfg;
      }

      //---------------------------------------------------------------------------------------------------------
      static declare_types(self) {
        // debug '^133^', self.cfg, Object.isFrozen self.cfg
        self.cfg = this.cast_constructor_cfg(self);
        self.types.validate.constructor_cfg(self.cfg);
        // guy.props.def self, 'dba', { enumerable: false, value: self.cfg.dba, }
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        // super()
        guy.cfg.configure_with_types(this, cfg, types);
        // @_compile_sql()
        // @_create_sql_functions()
        // @_create_db_structure()
        return void 0;
      }

    };

    
    //---------------------------------------------------------------------------------------------------------
    Dbax.C = guy.lft.freeze({
      defaults: {
        constructor_cfg: {
          _temp_prefix: '_dba_temp_',
          readonly: false,
          create: true,
          overwrite: false,
          timeout: 5000,
          //...................................................................................................
          ram: false,
          path: null,
          dbnick: null
        }
      }
    });

    return Dbax;

  }).call(this);

  //-----------------------------------------------------------------------------------------------------------
  this["DBA constructor arguments 1"] = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    ({Dba} = require(H.icql_dba_path));
    //.........................................................................................................
    probes_and_matchers = [
      [
        {
          ram: false,
          path: null,
          dbnick: null
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 5  */
      ram: false,
          path: null,
          dbnick: 'dbnick'
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 6  */
      ram: null,
          path: 'db/path',
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 4  */
      ram: false,
          path: 'db/path',
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 8  */
      //.......................................................................................................
      ram: null,
          path: null,
          dbnick: null
        },
        {
          ram: true,
          path: null,
          dbnick: '_icql_6200294332',
          url: 'file:_icql_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 1  */
      ram: null,
          path: null,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: null,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 2  */
      ram: null,
          path: 'db/path',
          dbnick: null
        },
        {
          ram: false,
          path: 'db/path',
          dbnick: null,
          url: null
        },
        null
      ],
      [
        {
          /* 3  */
      ram: false,
          path: 'db/path',
          dbnick: null
        },
        {
          ram: false,
          path: 'db/path',
          dbnick: null,
          url: null
        },
        null
      ],
      [
        {
          /* 7  */
      ram: true,
          path: null,
          dbnick: null
        },
        {
          ram: true,
          path: null,
          dbnick: '_icql_4260041910',
          url: 'file:_icql_4260041910?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 9  */
      ram: true,
          path: null,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: null,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 10 */
      ram: true,
          path: 'db/path',
          dbnick: null
        },
        {
          ram: true,
          path: 'db/path',
          dbnick: '_icql_9982321802',
          url: 'file:_icql_9982321802?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 11 */
      ram: true,
          path: 'db/path',
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: 'db/path',
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ]
    ];
//.........................................................................................................
/* 12 */
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          (() => {
            var k, result;
            result = {...(new Dbax(probe)).cfg};
            for (k in result) {
              if (k !== 'ram' && k !== 'path' && k !== 'dbnick' && k !== 'url') {
                delete result[k];
              }
            }
            // resolve result
            return resolve(result);
          })();
          return null;
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: _get_connection_url()"] = function(T, done) {
    var dba;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    Dbax = (function() {
      //.........................................................................................................
      class Dbax extends Dba {};

      Dbax._rnd_int_cfg = true;

      return Dbax;

    }).call(this);
    //.........................................................................................................
    dba = new Dbax();
    if (T != null) {
      T.eq(dba._get_connection_url(), {
        url: 'file:_icql_6200294332?mode=memory&cache=shared',
        dbnick: '_icql_6200294332'
      });
    }
    if (T != null) {
      T.eq(dba._get_connection_url(), {
        url: 'file:_icql_4260041910?mode=memory&cache=shared',
        dbnick: '_icql_4260041910'
      });
    }
    if (T != null) {
      T.eq(dba._get_connection_url(), {
        url: 'file:_icql_9982321802?mode=memory&cache=shared',
        dbnick: '_icql_9982321802'
      });
    }
    if (T != null) {
      T.eq(dba._get_connection_url(), {
        url: 'file:_icql_2420402559?mode=memory&cache=shared',
        dbnick: '_icql_2420402559'
      });
    }
    if (T != null) {
      T.eq(dba._get_connection_url(), {
        url: 'file:_icql_1965667491?mode=memory&cache=shared',
        dbnick: '_icql_1965667491'
      });
    }
    if (T != null) {
      T.eq(dba._get_connection_url('yournamehere'), {
        url: 'file:yournamehere?mode=memory&cache=shared',
        dbnick: 'yournamehere'
      });
    }
    //.........................................................................................................
    info(dba._get_connection_url());
    info(dba._get_connection_url('yournamehere'));
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "DBA: _get_connection_url()" ]

}).call(this);

//# sourceMappingURL=construction.js.map
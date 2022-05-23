(function() {
  'use strict';
  var CND, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-TABULATOR/TESTS/HTML-GENERATION';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // H                         = require './helpers'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  //-----------------------------------------------------------------------------------------------------------
  this["as_html() 1"] = function(T, done) {
    var Tabulator, result, rows, tabulator;
    ({Tabulator} = require('../../../apps/dbay-tabulator'));
    tabulator = new Tabulator();
    rows = [
      {
        sid_min: 1,
        sid_max: 1,
        pid: 'xx-1',
        dsk: 'xx',
        rank: 1,
        ts: '12345Z',
        raw_trend: '[{"dsk":"xx","pid":"xx-1","sid":1,"rank":1,"first":1,"last":1}]',
        details: JSON.stringify({
          foo: 42,
          bar: 108
        })
      }
    ];
    result = tabulator.as_html({rows});
    help('^348^', result);
    if (T != null) {
      T.ok((result.indexOf("<table>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<th class='sid_min'>sid_min</th>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<th class='sid_max'>sid_max</th>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<th class='dsk'>dsk</th>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<th class='ts'>ts</th>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<th class='pid'>pid</th>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='dsk'>xx</td>`)) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='sid_min'>1</td>`)) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='sid_max'>1</td>`)) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='pid'>xx-1</td>`)) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='rank'>1</td>`)) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='raw_trend'>[{"dsk":"xx","pid":"xx-1","sid":1,"rank":1,"first":1,"last":1}]</td>`)) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='details'>{"foo":42,"bar":108}</td>`)) > -1);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["as_html() 2"] = function(T, done) {
    var Tabulator, cfg, result, rows, tabulator;
    ({Tabulator} = require('../../../apps/dbay-tabulator'));
    tabulator = new Tabulator();
    rows = [
      {
        sid: 1,
        pid: 'xx-1',
        dsk: 'xx',
        sid_min: 1,
        sid_max: 1,
        details: JSON.stringify({
          foo: 42,
          bar: 108
        })
      }
    ];
    cfg = {
      rows: rows,
      class: 'vogue_trends',
      undefined: "N/A",
      fields: {
        dsk: {
          title: "DSK"
        },
        sid_min: {
          display: false
        },
        sid_max: {
          title: "SIDs",
          value: (value, {row}) => {
            return `${row.sid_min}—${row.sid_max}`;
          },
          outer_html: (value, details) => {
            help('^4535^', {value, details});
            if (T != null) {
              T.eq(value, "1—1");
            }
            if (T != null) {
              T.eq(details.raw_value, 1);
            }
            return `<td class=sids>${value}</td>`;
          }
        },
        details: {
          inner_html: (value, details) => {
            return `<div>${rpr(details.raw_value)}</div>`;
          }
        },
        extra: {
          title: "Extra",
          value: (value, details) => {
            return details.row_nr;
          }
        },
        asboolean: true
      }
    };
    result = tabulator.as_html(cfg);
    help('^348^', result);
    if (T != null) {
      T.ok((result.indexOf("<th class='dsk'>DSK</th>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<th class='extra'>Extra</th>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<td class='extra'>1</td>")) > -1);
    }
    if (T != null) {
      T.ok((!result.indexOf("<th class='sid_min'>")) > -1);
    }
    if (T != null) {
      T.ok((!result.indexOf("<td class='sid_min'>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<td class=sids>1—1</td>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<td class='asboolean'>N/A</td>")) > -1);
    }
    if (T != null) {
      T.ok((result.indexOf(`<td class='details'><div>'{"foo":42,"bar":108}'</div></td>`)) > -1);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["`query`, `table` are disallowed"] = function(T, done) {
    var SQL, Tabulator, tabulator;
    ({Tabulator} = require('../../../apps/dbay-tabulator'));
    tabulator = new Tabulator();
    ({SQL} = (require('../../../apps/dbay')).DBay);
    (() => {      //.........................................................................................................
      var cfg;
      cfg = {
        class: 'tabulator trends xx',
        query: SQL`select * from vogue_trends where dsk = $dsk order by pid;`,
        parameters: {
          dsk: 'xx'
        }
      };
      return T != null ? T.throws(/not a valid vogue_db_as_html_cfg/, () => {
        return tabulator.as_html(cfg);
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var cfg;
      cfg = {
        table: 'mytable',
        parameters: {
          dsk: 'xx'
        }
      };
      return T != null ? T.throws(/not a valid vogue_db_as_html_cfg/, () => {
        return tabulator.as_html(cfg);
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var cfg;
      cfg = {
        rows: [],
        parameters: {
          dsk: 'xx'
        }
      };
      if (T != null) {
        T.throws(/not a valid vogue_db_as_html_cfg/, () => {
          return tabulator.as_html(cfg);
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["as_html() can use `rows`"] = function(T, done) {
    var Tabulator, tabulator;
    ({Tabulator} = require('../../../apps/dbay-tabulator'));
    tabulator = new Tabulator();
    (() => {      //.........................................................................................................
      var cfg, result;
      cfg = {
        rows: []
      };
      result = tabulator.as_html(cfg);
      help('^348^', result);
      if (T != null) {
        T.eq(result, "<table>\n</table>");
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var cfg, result;
      cfg = {
        class: 'classy',
        rows: [],
        fields: {
          a: true,
          b: true,
          c: true
        }
      };
      result = tabulator.as_html(cfg);
      help('^348^', result);
      if (T != null) {
        T.ok((result.indexOf("<table class='classy'>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<th class='a'>a</th>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<th class='b'>b</th>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<th class='c'>c</th>")) > -1);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var cfg, result;
      cfg = {
        rows: [
          {
            a: 1,
            b: "something",
            c: "else"
          },
          {
            a: 2,
            b: "something",
            c: "else"
          },
          {
            a: 3,
            b: "something",
            c: "else"
          },
          {
            a: 4,
            b: "something",
            c: "else"
          }
        ]
      };
      result = tabulator.as_html(cfg);
      help('^348^', result);
      if (T != null) {
        T.ok((result.indexOf("<th class='a'>a</th>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<th class='b'>b</th>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<th class='c'>c</th>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<td class='a'>3</td>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<td class='b'>something</td>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<td class='c'>else</td>")) > -1);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["as_html() can use subtables"] = function(T, done) {
    var Tabulator, tabulator;
    ({Tabulator} = require('../../../apps/dbay-tabulator'));
    tabulator = new Tabulator();
    (() => {      //.........................................................................................................
      var cfg, result;
      cfg = {
        rows: [
          {
            nr: 1,
            details: JSON.stringify({
              "something": "something",
              c: "else"
            })
          }
        ],
        // { nr: 2, details: ( JSON.stringify { "something", c: "else" } ), }
        // { nr: 3, details: ( JSON.stringify { "something", c: "else" } ), }
        // { nr: 4, details: ( JSON.stringify { "something", c: "else" } ), }
        fields: {
          details: {
            inner_html: function(value) {
              return tabulator.as_subtable_html(value);
            }
          }
        }
      };
      result = tabulator.as_html(cfg);
      help('^348^', result);
      // T?.ok ( result.indexOf "<td class='c'>else</td>" ) > -1
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @[ "as_html() can use subtables" ]
      return test(this);
    })();
  }

  // test @[ "as_html() 2" ]
// test @[ "`query`, `table` are disallowed" ]
// test @[ "as_html() can use `rows`" ]
// test @[ "as_html() 1" ]

}).call(this);

//# sourceMappingURL=html-generation.tests.js.map
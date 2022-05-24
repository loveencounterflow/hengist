(function() {
  'use strict';
  var CND, GUY, badge, debug, echo, equals, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

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

  GUY = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  //-----------------------------------------------------------------------------------------------------------
  this["tabulate() 1"] = function(T, done) {
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
        duh: JSON.stringify({
          foo: 42,
          bar: 108
        })
      }
    ];
    result = tabulator.tabulate({rows});
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
      T.ok((result.indexOf(`<td class='duh'>{"foo":42,"bar":108}</td>`)) > -1);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tabulate() 2"] = function(T, done) {
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
          hide: true
        },
        sid_max: {
          title: "SIDs",
          outer_html: (d) => {
            var value;
            value = `${d.row.sid_min}—${d.row.sid_max}`;
            urge('^4535^', d);
            urge('^4535^', rpr(value));
            if (T != null) {
              T.eq(value, "1—1");
            }
            if (T != null) {
              T.eq(d.raw_value, 1);
            }
            return `<td class=sids>${value}</td>`;
          }
        },
        details: {
          inner_html: (d) => {
            return `<div>${rpr(d.raw_value)}</div>`;
          }
        },
        extra: {
          title: "Extra",
          inner_html: (d) => {
            return `${d.row_nr}`;
          }
        },
        asboolean: true
      }
    };
    result = tabulator.tabulate(cfg);
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
      T.ok((result.indexOf("<th class='sid_min'>")) === -1);
    }
    if (T != null) {
      T.ok((result.indexOf("<td class='sid_min'>")) === -1);
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
    var SQL, TABULATOR;
    ({TABULATOR} = require('../../../apps/dbay-tabulator'));
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
      return T != null ? T.throws(/not a valid vgt_as_html_cfg/, () => {
        return TABULATOR.tabulate(cfg);
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
      return T != null ? T.throws(/not a valid vgt_as_html_cfg/, () => {
        return TABULATOR.tabulate(cfg);
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
        T.throws(/not a valid vgt_as_html_cfg/, () => {
          return TABULATOR.tabulate(cfg);
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tabulate() can use `rows`"] = function(T, done) {
    var Tabulator, tabulator;
    ({Tabulator} = require('../../../apps/dbay-tabulator'));
    tabulator = new Tabulator();
    (() => {      //.........................................................................................................
      var cfg, result;
      cfg = {
        rows: []
      };
      result = tabulator.tabulate(cfg);
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
      result = tabulator.tabulate(cfg);
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
      result = tabulator.tabulate(cfg);
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
  this["tabulate() can use iterator for `rows`"] = function(T, done) {
    var TABULATOR;
    ({TABULATOR} = require('../../../apps/dbay-tabulator'));
    (() => {      //.........................................................................................................
      var _rows, result, rows;
      _rows = [
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
      ];
      rows = (function*() {
        return (yield* _rows);
      })();
      result = TABULATOR.tabulate({rows});
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
    (() => {      //.........................................................................................................
      var DBay, SQL, db, result, rows;
      ({DBay} = require('../../../apps/dbay'));
      ({SQL} = GUY.str);
      db = new DBay();
      rows = db(SQL`select * from sqlite_schema;`);
      result = TABULATOR.tabulate({rows});
      help('^348^', result);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tabulate() can use subtables 1"] = function(T, done) {
    var summarize, tabulate;
    ({tabulate, summarize} = require('../../../apps/dbay-tabulator'));
    (() => {      //.........................................................................................................
      var cfg, result;
      cfg = {
        rows: [
          {
            nr: 1,
            details: JSON.stringify({
              a: "something",
              b: "else"
            })
          }
        ],
        // { nr: 2, details: ( JSON.stringify { "something", c: "else" } ), }
        // { nr: 3, details: ( JSON.stringify { "something", c: "else" } ), }
        // { nr: 4, details: ( JSON.stringify { "something", c: "else" } ), }
        fields: {
          details: {
            inner_html: function(d) {
              return summarize({
                row: d.value
              });
            }
          }
        }
      };
      result = tabulate(cfg);
      help('^348^', result);
      if (T != null) {
        T.ok((result.indexOf("<td class='details'><table>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<tr><th>a</th><td class='a'>something</td></tr>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<tr><th>b</th><td class='b'>else</td></tr>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("</table></td>")) > -1);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["tabulate() can use subtables 2"] = function(T, done) {
    var Tabulator, tabulator;
    ({Tabulator} = require('../../../apps/dbay-tabulator'));
    tabulator = new Tabulator();
    (() => {      //.........................................................................................................
      var details_cfg, result, table_cfg;
      //.......................................................................................................
      details_cfg = {
        fields: {
          a: {
            title: "Ants",
            inner_html: function(d) {
              return `*${d.value}*`;
            }
          }
        }
      };
      //.......................................................................................................
      table_cfg = {
        rows: [
          {
            nr: 1,
            details: JSON.stringify({
              a: "something",
              b: "else"
            })
          }
        ],
        // { nr: 2, details: ( JSON.stringify { "something", c: "else" } ), }
        // { nr: 3, details: ( JSON.stringify { "something", c: "else" } ), }
        // { nr: 4, details: ( JSON.stringify { "something", c: "else" } ), }
        fields: {
          details: {
            inner_html: function(d) {
              return tabulator.summarize({
                row: d.value,
                ...details_cfg
              });
            }
          }
        }
      };
      //.......................................................................................................
      result = tabulator.tabulate(table_cfg);
      help('^348^', result);
      if (T != null) {
        T.ok((result.indexOf("<td class='details'><table>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<tr><th>Ants</th><td class='a'>*something*</td></tr>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("<tr><th>b</th><td class='b'>else</td></tr>")) > -1);
      }
      if (T != null) {
        T.ok((result.indexOf("</table></td>")) > -1);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["`inner_html()`, `outer_html()` can hide lines"] = function(T, done) {
    var cfg, i, len, result, row, rows, show_word, summarize;
    ({summarize} = require('../../../apps/dbay-tabulator'));
    rows = [
      {
        nr: 1,
        word: "one",
        show_word: true
      },
      {
        nr: 2,
        word: "two",
        show_word: false
      },
      {
        nr: 3,
        word: "three",
        show_word: true
      },
      {
        nr: 4,
        word: "four",
        show_word: false
      }
    ];
    //.........................................................................................................
    cfg = {
      fields: {
        nr: {
          title: "Nr",
          inner_html: function(d) {
            return `#${d.value}`;
          }
        },
        word: {
          title: "Word",
          inner_html: function(d) {
            if (modulo(d.row.nr, 2) === 0) {
              return Symbol.for('hide');
            }
            return d.value;
          }
        }
      }
    };
//.........................................................................................................
    for (i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      ({show_word} = row);
      delete row.show_word;
      result = summarize({row, ...cfg});
      help('^348^', result);
      if (show_word) {
        if (T != null) {
          T.ok((result.indexOf("<th>Word</th><td class='word'>")) > -1);
        }
      } else {
        if (T != null) {
          T.ok((result.indexOf("<th>Word</th><td class='word'>")) === -1);
        }
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["vgt_iterable()"] = async function(T, done) {
    var TABULATOR, error, i, len, matcher, probe, probes_and_matchers;
    ({TABULATOR} = require('../../../apps/dbay-tabulator'));
    probes_and_matchers = [[null, false], [[], true], [{}, false], [new Set(), true], [new Set().keys(), true], ["whatever", true]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(TABULATOR.types.isa.vgt_iterable(probe));
        });
      });
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["vgt_iterable_no_text()"] = async function(T, done) {
    var TABULATOR, error, i, len, matcher, probe, probes_and_matchers;
    ({TABULATOR} = require('../../../apps/dbay-tabulator'));
    probes_and_matchers = [[null, false], [[], true], [{}, false], [new Set(), true], [new Set().keys(), true], ["whatever", false]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(TABULATOR.types.isa.vgt_iterable_no_text(probe));
        });
      });
    }
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @
      // test @[ "tabulate() can use subtables 2" ]
      // test @[ "vgt_iterable_no_text()" ]
      // @[ "tabulate() 2" ]()
      // test @[ "tabulate() 2" ]
      return test(this["`inner_html()`, `outer_html()` can hide lines"]);
    })();
  }

  // test @[ "`query`, `table` are disallowed" ]
// test @[ "tabulate() can use iterator for `rows`" ]
// test @[ "tabulate() can use `rows`" ]
// @[ "tabulate() 1" ]()
// test @[ "tabulate() 1" ]
// echo x for x from [ 1, 2, 3, ]
// echo x for x from { a: 4, b: 5, c: 6, }
// echo x for x from ( new Set [ 18,9,10,] )
// echo x for x from ( new Set [ 18,9,10,] ).keys()

}).call(this);

//# sourceMappingURL=html-generation.tests.js.map
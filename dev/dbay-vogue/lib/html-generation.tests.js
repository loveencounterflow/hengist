(function() {
  'use strict';
  var CND, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-VOGUE/TESTS/HTML-GENERATION';

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
  this["DB as_html() 1"] = function(T, done) {
    var Vogue, Vogue_scraper_ABC, Xx_scraper, details, dsk, pid, result, row, scraper, session, sid, vogue;
    ({Vogue, Vogue_scraper_ABC} = require('../../../apps/dbay-vogue'));
    vogue = new Vogue();
    dsk = 'xx';
    Xx_scraper = class Xx_scraper extends Vogue_scraper_ABC {};
    scraper = new Xx_scraper();
    vogue.scrapers.add({dsk, scraper});
    /* TAINT use API method, don't use query directly */
    /* TAINT should be done by `vogue.scraper.add()` */
    vogue.vdb.queries.insert_datasource.run({
      dsk,
      url: 'http://nourl'
    });
    session = vogue.vdb.new_session(dsk);
    ({sid} = session);
    pid = 'xx-1';
    // title                 = "helo world"
    // title_url             = 'https://example.com/blog/1'
    // details               = { title, title_url, foo: 42, bar: 108, }
    details = {
      foo: 42,
      bar: 108
    };
    row = vogue.vdb.new_post({dsk, sid, pid, session, details});
    result = vogue.vdb.as_html({
      dsk,
      table: 'vogue_trends'
    });
    debug('^348^', result);
    if (T != null) {
      T.ok((result.indexOf("<table class='vogue_trends'>")) > -1);
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
  this["DB as_html() 2"] = function(T, done) {
    var Vogue, Vogue_scraper_ABC, Xx_scraper, cfg, details, dsk, pid, result, row, scraper, session, sid, vogue;
    ({Vogue, Vogue_scraper_ABC} = require('../../../apps/dbay-vogue'));
    vogue = new Vogue();
    dsk = 'xx';
    Xx_scraper = class Xx_scraper extends Vogue_scraper_ABC {};
    scraper = new Xx_scraper();
    vogue.scrapers.add({dsk, scraper});
    /* TAINT use API method, don't use query directly */
    /* TAINT should be done by `vogue.scraper.add()` */
    vogue.vdb.queries.insert_datasource.run({
      dsk,
      url: 'http://nourl'
    });
    session = vogue.vdb.new_session(dsk);
    ({sid} = session);
    pid = 'xx-1';
    details = {
      foo: 42,
      bar: 108
    };
    row = vogue.vdb.new_post({dsk, sid, pid, session, details});
    if (T != null) {
      T.eq(row.sid, 1);
    }
    if (T != null) {
      T.eq(row.pid, 'xx-1');
    }
    cfg = {
      table: 'vogue_trends',
      dsk: dsk,
      fields: {
        dsk: {
          title: "DSK"
        },
        sid_min: {
          display: false
        },
        sid_max: {
          title: "SIDs",
          format: (value, {row}) => {
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
          format: (value, details) => {
            return details.row_nr;
          }
        }
      }
    };
    result = vogue.vdb.as_html(cfg);
    debug('^348^', result);
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
      T.ok((result.indexOf(`<td class='details'><div>'{"foo":42,"bar":108}'</div></td>`)) > -1);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // @[ "DB as_html() 1" ]()
// test @[ "DB as_html() 1" ]

}).call(this);

//# sourceMappingURL=html-generation.tests.js.map
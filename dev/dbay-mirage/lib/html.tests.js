(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE/BASICS';

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

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this["Mirage HTML: quotes in attribute values"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, prefix, probes_and_matchers, result, text;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    prefix = 'mrg';
    probes_and_matchers = [];
    dsk = 'quotedattributes';
    mrg.register_dsk({
      dsk,
      url: 'live:'
    });
    // debug '^435^', mrg.append_text { dsk, trk: 1, text: """<title id=c1 x="Q"></title>""", }
    // debug '^435^', mrg.append_text { dsk, trk: 1, text: """<title id=c2 x='Q'></title>""", }
    // debug '^435^', mrg.append_text { dsk, trk: 1, text: """<title id=c3 x='"Q"'></title>""", }
    // debug '^435^', mrg.append_text { dsk, trk: 1, text: """<title id=c4 x="'Q'"></title>""", }
    text = `<title id=c1 x="Q"></title>
<title id=c2 x='Q'></title>
<title id=c3 x='"Q"'></title>
<title id=c4 x="'Q'"></title>`;
    mrg.append_text({
      dsk,
      trk: 1,
      text
    });
    mrg.html.parse_dsk({dsk});
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_mirror;`));
    H.tabulate(`${prefix}_html_mirror`, db(SQL`select * from ${prefix}_html_mirror;`));
    H.tabulate(`${prefix}_html_tags_and_html`, db(SQL`select * from ${prefix}_html_tags_and_html;`));
    H.tabulate(`${prefix}_tags_and_atrs`, db(SQL`select
    *
  from ${prefix}_html_mirror as m
  join ${prefix}_html_atrs as a using ( atrid )
  where true
    and ( m.typ = '<' )
    and ( m.tag = 'title' )
    and ( a.k   = 'x' )
  order by m.tid;`));
    result = db.all_first_values(SQL`select
    v
  from ${prefix}_html_mirror as m
  join ${prefix}_html_atrs as a using ( atrid )
  where true
    and ( m.typ = '<' )
    and ( m.tag = 'title' )
    and ( a.k   = 'x' )
  order by m.tid;`);
    if (T != null) {
      T.eq(result, ['Q', 'Q', '"Q"', "'Q'"]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "altering mirrored source lines causes error" ]
// @[ "altering mirrored source lines causes error" ]()

}).call(this);

//# sourceMappingURL=html.tests.js.map
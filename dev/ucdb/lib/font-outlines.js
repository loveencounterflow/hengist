(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, log, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/UCDB/FONT-OUTLINES';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  this.svg_pathdata_from_gid = async function(db, font, gid) {
    var sql;
    // sql = """
    //   select
    //       *
    //     from svgttf.outlines
    //     where true
    //       and font  = $1
    //       and gid   = $2
    //   """
    // debug '^3334^', db.query [ sql, [ font, gid, ], ]
    sql = "select * from U.variables where key = 'intershop/db/name';";
    return debug('^3334^', (await db.query_one([sql])));
  };

}).call(this);

//# sourceMappingURL=font-outlines.js.map
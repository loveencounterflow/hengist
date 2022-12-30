(function() {
  'use strict';
  var CND, FS, PATH, alert, badge, debug, demo, echo, help, info, log, rpr, urge, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SNIPPETS/PRQL';

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
  demo = function() {
    var PRQL, prql;
    PRQL = require('prql-js');
    prql = "from employees select first_name";
    info('^23-1^', rpr(PRQL.compile(prql)));
    info('^23-1^', rpr(PRQL.to_sql(prql)));
    info('^23-1^', rpr(PRQL.to_json(prql)));
    prql = `from employees
filter start_date > @2021-01-01
derive [
  gross_salary = salary + (tax ?? 0),
  gross_cost = gross_salary + benefits_cost,
]
filter gross_cost > 0
group [title, country] (
  aggregate [
    average gross_salary,
    sum_gross_cost = sum gross_cost,
  ]
)
filter sum_gross_cost > 100000
derive id = f"{title}_{country}"
derive country_code = s"LEFT(country, 2)"
sort [sum_gross_cost, -country]
take 1..20`;
    urge('^23-1^', PRQL.to_sql(prql));
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-prql.js.map
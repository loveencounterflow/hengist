(function() {
  'use strict';
  var CND, badge, customers, debug, echo, help, info, pull_query, push_query, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'PUSH&PULL';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  customers = [
    {
      id: 1,
      firstName: "justin",
      balance: 10
    },
    {
      id: 2,
      firstName: "sissel",
      balance: 0
    },
    {
      id: 3,
      firstName: "justin",
      balance: -3
    },
    {
      id: 4,
      firstName: "smudge",
      balance: 2
    },
    {
      id: 5,
      firstName: "smudge",
      balance: 0
    }
  ];

  //===========================================================================================================
  pull_query = function() {
    var Distinct, Map, Scan, Select;
    //---------------------------------------------------------------------------------------------------------
    Scan = function*(collection) {
      var x;
      for (x of collection) {
        yield x;
      }
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    Select = function*(filter, iterator) {
      var x;
      for (x of iterator) {
        if (!filter(x)) {
          continue;
        }
        yield x;
      }
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    Map = function*(f, iterator) {
      var x;
      for (x of iterator) {
        yield f(x);
      }
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    Distinct = function*(iterator) {
      var seen, x;
      seen = new Set();
      for (x of iterator) {
        if (seen.has(x)) {
          continue;
        }
        seen.add(x);
        yield x;
      }
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    /* SELECT DISTINCT customer_first_name FROM customers WHERE customer_balance > 0 */
    info([
      ...(Distinct(Map(((c) => {
        return c.firstName;
      }),
      Select(((c) => {
        return c.balance > 0;
      }),
      Scan(customers)))))
    ]);
    //---------------------------------------------------------------------------------------------------------
    return null;
  };

  //===========================================================================================================
  push_query = function() {
    var Distinct, Map, Scan, Select, result;
    //---------------------------------------------------------------------------------------------------------
    Scan = function(relation, send) {
      var r;
      for (r of relation) {
        send(r);
      }
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    Select = function(test, send) {
      return (x) => {
        if (test(x)) {
          return send(x);
        }
      };
    };
    //---------------------------------------------------------------------------------------------------------
    Map = function(f, send) {
      return (x) => {
        return send(f(x));
      };
    };
    //---------------------------------------------------------------------------------------------------------
    Distinct = function(send) {
      var seen;
      seen = new Set();
      return (x) => {
        if (seen.has(x)) {
          return null;
        }
        seen.add(x);
        send(x);
        return null;
      };
    };
    //---------------------------------------------------------------------------------------------------------
    result = [];
    Scan(customers, Select(((c) => {
      return c.balance > 0;
    }), Map(((c) => {
      return c.firstName;
    }), Distinct(((r) => {
      return result.push(r);
    })))));
    help(result);
    //---------------------------------------------------------------------------------------------------------
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      pull_query();
      return push_query();
    })();
  }

}).call(this);

//# sourceMappingURL=push-and-pull-queries.js.map
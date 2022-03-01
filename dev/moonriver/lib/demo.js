(function() {
  'use strict';
  var CND, GUY, Moonriver, badge, debug, demo, echo, help, info, isa, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MINIMAL';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  GUY = require('guy');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate} = types);

  ({Moonriver} = require('../../../apps/moonriver'));

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var $add_call_count, $addsome, $embellish, $generator, $show, $source_A, $source_B, drive, pipeline, trace;
    //.........................................................................................................
    $source_A = function(a_list) {
      var source;
      return source = function(d, send) {
        var e, i, len;
        send(d);
        for (i = 0, len = a_list.length; i < len; i++) {
          e = a_list[i];
          if (trace) {
            help('^source A^', e);
          }
          send(e);
        }
        send.over();
        return null;
      };
    };
    //.........................................................................................................
    $source_B = function(a_list) {
      var idx, last_idx, source;
      last_idx = a_list.length - 1;
      idx = -1;
      return source = function(d, send) {
        send(d);
        idx++;
        if (idx > last_idx) {
          idx = -1;
          return send.over();
        }
        if (trace) {
          help('^source B^', a_list[idx]);
        }
        send(a_list[idx]);
        return null;
      };
    };
    //.........................................................................................................
    $addsome = function() {
      var addsome;
      return addsome = function(d, send) {
        if (trace) {
          help('^addsome^', d);
        }
        if (!isa.float(d)) {
          return send((rpr(d)) + ' * 100 + 1');
        }
        send(d * 100 + 1);
        return null;
      };
    };
    //.........................................................................................................
    $embellish = function() {
      var embellish;
      return embellish = function(d, send) {
        if (trace) {
          help('^embellish^', d);
        }
        send(`*${rpr(d)}*`);
        return null;
      };
    };
    //.........................................................................................................
    $show = function() {
      var show;
      return show = function(d, send) {
        if (trace) {
          help('^show^', d);
        }
        info(d);
        send(d);
        return null;
      };
    };
    //.........................................................................................................
    $generator = function() {
      return function*() {
        yield 22;
        yield 33;
        return null;
      };
    };
    //.........................................................................................................
    $add_call_count = function() {
      return function(d, send) {
        urge('^449^', send.call_count, d);
        return send(isa.float ? send.call_count * 10_000 + d : d);
      };
    };
    //.........................................................................................................
    pipeline = [];
    // pipeline.push $source_A [ 1, 2, 3, ]
    // pipeline.push $source_B [ 1, 2, ]
    pipeline.push([1, 2]);
    pipeline.push(['A', 'B']);
    pipeline.push(['C', 'D', 'E'].values());
    pipeline.push((new Map([['a', 42]])).entries());
    pipeline.push($generator());
    pipeline.push($add_call_count());
    pipeline.push($addsome());
    pipeline.push($embellish());
    pipeline.push($show());
    trace = false;
    drive = function(mode) {
      var _, i, len, mr, ref, results;
      mr = new Moonriver(pipeline);
      ref = [1, 2];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        _ = ref[i];
        if (!mr.can_repeat()) {
          warn("not repeatable");
          break;
        }
        whisper('————————————————————————————————————————');
        results.push(mr.drive({mode}));
      }
      return results;
    };
    drive('breadth');
    drive('depth');
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=demo.js.map
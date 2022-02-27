(function() {
  'use strict';
  var $addsome, $embellish, $show, $source, CND, badge, debug, drive, echo, first_q, help, i, idx, info, inputs, last_idx, last_q, len, pipeline, raw_pipeline, rpr, show_pipeline, symbol, tf, urge, warn, whisper;

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

  $source = function(a_list) {
    var exhausted, source;
    exhausted = false;
    return source = function(d, send) {
      var e, i, len;
      send(d);
      if (!exhausted) {
        for (i = 0, len = a_list.length; i < len; i++) {
          e = a_list[i];
          help('^source^', e);
          send(e);
        }
        send.done();
        exhausted = true;
      }
      return null;
    };
  };

  $addsome = function() {
    var addsome;
    return addsome = function(d, send) {
      help('^addsome^', d);
      send(d + 100);
      send(d + 200);
      return null;
    };
  };

  $embellish = function() {
    var embellish;
    return embellish = function(d, send) {
      help('^embellish^', d);
      send(`*${rpr(d)}*`);
      return null;
    };
  };

  $show = function() {
    var show;
    return show = function(d, send) {
      help('^show^', d);
      info(d);
      send(d);
      return null;
    };
  };

  raw_pipeline = [$source([1, 2, 3]), $addsome(), $embellish(), $show()];

  symbol = {
    done: Symbol.for('done'),
    drop: Symbol.for('drop'),
    stop: Symbol.for('stop')
  };

  first_q = [];

  last_q = [];

  pipeline = [];

  last_idx = raw_pipeline.length - 1;

  inputs = [];

  for (idx = i = 0, len = raw_pipeline.length; i < len; idx = ++i) {
    tf = raw_pipeline[idx];
    (() => {
      var entry, input, output, send;
      input = idx === 0 ? first_q : pipeline[idx - 1].output;
      output = idx === last_idx ? last_q : [];
      entry = {
        tf,
        input,
        output,
        done: false,
        stopped: false
      };
      send = function(d) {
        switch (d) {
          case symbol.drop:
            info(`dropped: ${rpr(d)}`);
            break;
          case symbol.done:
            info(`done: ${rpr(d)}`);
            this.done = true;
            break;
          case symbol.stop:
            info(`stopped: ${rpr(d)}`);
            this.stopped = true;
            break;
          default:
            this.output.push(d);
        }
        return null;
      };
      send = send.bind(entry);
      send.symbol = symbol;
      send.done = function() {
        return send(send.symbol.done);
      };
      entry.send = send;
      pipeline.push(entry);
      return inputs.push(input);
    })();
  }

  show_pipeline = function() {
    var j, len1, ref, segment;
    urge(inputs[0]);
    for (j = 0, len1 = pipeline.length; j < len1; j++) {
      segment = pipeline[j];
      urge((ref = segment.tf.name) != null ? ref : '?', segment.output);
    }
    return null;
  };

  drive = function(cfg) {
    var j, mode, round, segment;
    ({mode} = cfg);
    show_pipeline();
    round = 0;
    while (true) {
      round++;
      whisper('^4958^', `round ${round} -------------------------------`);
      for (idx = j = 0; j <= 3; idx = ++j) {
        segment = pipeline[idx];
        if (idx === 0) {
          segment.tf(symbol.drop, segment.send);
          continue;
        }
        while (segment.input.length > 0) {
          segment.tf(segment.input.shift(), segment.send);
          if (mode === 'depth') {
            break;
          }
        }
        show_pipeline();
      }
      if (!inputs.some(function(x) {
        return x.length > 0;
      })) {
        break;
      }
    }
    return null;
  };

  // drive { mode: 'breadth', }
  drive({
    mode: 'depth'
  });

  // f = ->
//   yield 1
//   yield 2
//   yield 3
//   return null

  // debug g = f()
// debug g.next()
// debug g.next()
// debug g.next()
// debug g.next()

}).call(this);

//# sourceMappingURL=minimal.js.map
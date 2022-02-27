(function() {
  'use strict';
  var CND, Steampipe, badge, debug, demo, echo, help, info, rpr, urge, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var $addsome, $embellish, $show, $source, drive, pipeline;
    //.........................................................................................................
    $source = function(a_list) {
      var source;
      return source = function(d, send) {
        var e, i, len;
        send(d);
        for (i = 0, len = a_list.length; i < len; i++) {
          e = a_list[i];
          help('^source^', e);
          send(e);
        }
        send.over();
        return null;
      };
    };
    //.........................................................................................................
    $addsome = function() {
      var addsome;
      return addsome = function(d, send) {
        help('^addsome^', d);
        send(d * 100 + 1);
        send(d * 100 + 2);
        // send.exit() if d is 2
        // send.pass() if d is 2
        // throw send.symbol.exit if d is 2
        // throw send.symbol.done if d is 2
        return null;
      };
    };
    //.........................................................................................................
    $embellish = function() {
      var embellish;
      return embellish = function(d, send) {
        help('^embellish^', d);
        send(`*${rpr(d)}*`);
        return null;
      };
    };
    //.........................................................................................................
    $show = function() {
      var show;
      return show = function(d, send) {
        help('^show^', d);
        info(d);
        send(d);
        return null;
      };
    };
    //.........................................................................................................
    pipeline = [];
    pipeline.push($source([1, 2, 3]));
    pipeline.push($addsome());
    pipeline.push($embellish());
    pipeline.push($show());
    drive = function(mode) {
      var sp;
      sp = new Steampipe(pipeline);
      sp._show_pipeline();
      sp.drive({mode});
      whisper('———————————————————————————————————————');
      sp._show_pipeline();
      sp.drive({mode});
      return sp._show_pipeline();
    };
    drive('breadth');
    drive('depth');
    return null;
  };

  Steampipe = (function() {
    var symbol;

    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Steampipe {
      
        //---------------------------------------------------------------------------------------------------------
      constructor(raw_pipeline) {
        var i, idx, last_idx, len, tf;
        this.first_q = [];
        this.last_q = [];
        this.pipeline = [];
        last_idx = raw_pipeline.length - 1;
        this.inputs = [];
        for (idx = i = 0, len = raw_pipeline.length; i < len; idx = ++i) {
          tf = raw_pipeline[idx];
          (() => {
            var entry, input, output, send;
            input = idx === 0 ? this.first_q : this.pipeline[idx - 1].output;
            output = idx === last_idx ? this.last_q : [];
            entry = {
              tf,
              input,
              output,
              exit: false
            };
            // entry       = { tf, input, output, done: false, over: false, exit: false, }
            send = function(d) {
              switch (d) {
                case symbol.drop:
                  info(`dropped: ${rpr(d)}`);
                  break;
                // when symbol.done
                //   info "done: #{rpr d}"
                //   @done = true
                case symbol.over:
                  info(`over: ${rpr(d)}`);
                  this.over = true;
                  break;
                case symbol.exit:
                  info(`exit: ${rpr(d)}`);
                  this.exit = true;
                  break;
                default:
                  this.output.push(d);
              }
              return null;
            };
            send = send.bind(entry);
            send.symbol = symbol;
            // send.done   = -> send send.symbol.done
            send.over = function() {
              return send(send.symbol.over);
            };
            send.exit = function() {
              return send(send.symbol.exit);
            };
            entry.send = send;
            this.pipeline.push(entry);
            return this.inputs.push(input);
          })();
        }
        return void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      drive(cfg) {
        var error, i, idx, j, len, len1, mode, ref, ref1, round, segment;
        ({mode} = cfg);
        round = 0;
        ref = this.pipeline;
        for (i = 0, len = ref.length; i < len; i++) {
          segment = ref[i];
          segment.over = false;
        }
        try {
          while (true) {
            round++;
            whisper('^4958^', `round ${round} -------------------------------`);
            ref1 = this.pipeline;
            for (idx = j = 0, len1 = ref1.length; j < len1; idx = ++j) {
              segment = ref1[idx];
              if (segment.over) {
                continue;
              }
              if (idx === 0) {
                segment.tf(symbol.drop, segment.send);
              } else {
                while (segment.input.length > 0) {
                  segment.tf(segment.input.shift(), segment.send);
                  if (mode === 'depth') {
                    break;
                  }
                }
              }
              if (segment.exit) {
                info('^443^', `stopped by ${rpr(segment)}`);
                throw symbol.exit;
              }
            }
            this.last_q.length = 0;
            if (!this.inputs.some(function(x) {
              return x.length > 0;
            })) {
              break;
            }
          }
        } catch (error1) {
          error = error1;
          if (error !== symbol.exit) {
            // throw error unless typeof error is 'symbol'
            throw error;
          }
        }
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      _show_pipeline() {
        var i, len, ref, ref1, segment;
        urge(this.inputs[0]);
        ref = this.pipeline;
        for (i = 0, len = ref.length; i < len; i++) {
          segment = ref[i];
          urge((ref1 = segment.tf.name) != null ? ref1 : '?', segment.output);
        }
        return null;
      }

    };

    Steampipe.C = symbol = {
      drop: Symbol.for('drop'), // this value will not go to output
      exit: Symbol.for('exit'), // exit pipeline processing
      // done:       Symbol.for 'done' # done for this iteration
      over: Symbol.for('over') // do not call again in this round
    };

    return Steampipe;

  }).call(this);

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=minimal.js.map
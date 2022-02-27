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
    var $addsome, $embellish, $show, $source, pipeline;
    //.........................................................................................................
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
          exhausted = true;
        }
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
    pipeline = new Steampipe(pipeline);
    pipeline.drive({
      mode: 'depth'
    });
    return null;
  };

  Steampipe = (function() {
    var symbol;

    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Steampipe {
      // done:       Symbol.for 'done' # done for this iteration
      // pass:       Symbol.for 'pass' # do not call again

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
            // entry       = { tf, input, output, done: false, pass: false, exit: false, }
            send = function(d) {
              switch (d) {
                case symbol.drop:
                  info(`dropped: ${rpr(d)}`);
                  break;
                // when symbol.done
                //   info "done: #{rpr d}"
                //   @done = true
                // when symbol.pass
                //   info "pass: #{rpr d}"
                //   @pass = true
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
            // send.pass   = -> send send.symbol.pass
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
        var error, i, idx, mode, round, segment;
        ({mode} = cfg);
        this._show_pipeline();
        round = 0;
        try {
          while (true) {
            round++;
            whisper('^4958^', `round ${round} -------------------------------`);
            for (idx = i = 0; i <= 3; idx = ++i) {
              segment = this.pipeline[idx];
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
              // @_show_pipeline()
              if (segment.exit) {
                info('^443^', `stopped by ${rpr(segment)}`);
                throw symbol.exit;
              }
            }
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
          warn(error);
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
      exit: Symbol.for('exit') // exit pipeline processing
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
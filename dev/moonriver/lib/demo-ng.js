(function() {
  'xxxxxxxxxuse strict';
  var GUY, Pipeline, Reporting_collector, Segment, UTIL, alert, debug, def, demo_1, demo_2, echo, help, hide, info, inspect, isa, log, model_1, model_2a, model_2b, nameit, plain, praise, rpr, type_of, types, urge, validate, validate_optional, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_optional} = types);

  UTIL = require('node:util');

  ({hide, def} = GUY.props);

  nameit = function(name, f) {
    return def(f, 'name', {
      value: name
    });
  };

  //===========================================================================================================
  Segment = class Segment {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var ref, ref1, send;
      this.input = (ref = cfg.input) != null ? ref : [];
      this.output = (ref1 = cfg.output) != null ? ref1 : [];
      hide(this, 'transform', this._as_transform(cfg.fitting));
      hide(this, '_send', send = (d) => {
        this.output.push(d);
        return d/* 'inner' send method */;
      });
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _as_transform(fitting) {
      /* TAINT validate arity */
      /*

      * `fitting`: a value that may be used as (the central part of) a transform in a pipeline. This may be a
        function of arity 2 (a transducer), a list (a source) &c.
      * `transform`: one of the serial elements that constitute a pipeline. While a `fitting` may be of
        various types, a `transform` is always a function. `transform`s have a `type` attribute which takes
        one of the following values:
        * `source`: a `transform` that does not take any arguments and will yield one value per call
        * `observer`: a `transform` that takes one argument (the current value) and does not send any values
          into the pipeline; the value an observer gets called with will be the same value that the next
          transformer will be called with. Note that if an observer receives a mutable value it can modify it
          and thereby affect one data item at a time.
        * `transducer`: a `transform` that takes two arguments, the current data item and a `send()` function
          that can be used any number of times to send values to the ensuing transform.

       */
      var R, arity, fitting_type, ref, transform_type;
      transform_type = null;
      switch (fitting_type = type_of(fitting)) {
        case 'function':
          R = fitting;
          break;
        case 'list':
          R = (function*() {
            var d, i, len, results;
            results = [];
            for (i = 0, len = fitting.length; i < len; i++) {
              d = fitting[i];
              results.push((yield d));
            }
            return results;
          })();
          break;
        default:
          throw new Error(`unable to use a ${rpr(fitting_type)} as a fitting`);
      }
      //.......................................................................................................
      switch (arity = (ref = R.length) != null ? ref : 0) {
        case 0:
          transform_type = 'source';
          break;
        case 1:
          transform_type = 'observer';
          break;
        case 2:
          transform_type = 'transducer';
          break;
        default:
          throw new Error(`fittings with arity ${arity} not implemented`);
      }
      if (R.name === '') {
        //.......................................................................................................
        nameit('ƒ', R);
      }
      R.type = transform_type;
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    /* 'outer' send method */
    send(d) {
      this.input.push(d);
      return d;
    }

    //---------------------------------------------------------------------------------------------------------
    process() {
      if (this.input.length > 0) {
        this.transform.call(null, this.input.shift(), this._send);
        return 1;
      }
      return 0;
    }

    //---------------------------------------------------------------------------------------------------------
    [UTIL.inspect.custom]() {
      return this.toString();
    }

    toString() {
      return `${rpr(this.input)} ▶ ${this.transform.name} ▶ ${rpr(this.output)}`;
    }

  };

  //===========================================================================================================
  Reporting_collector = class Reporting_collector {
    //---------------------------------------------------------------------------------------------------------
    constructor(callback) {
      hide(this, 'callback', callback);
      hide(this, 'd', []);
      GUY.props.def(this, 'length', {
        get: function() {
          return this.d.length;
        }
      });
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    push(d) {
      this.callback(+1);
      return this.d.push(d);
    }

    unshift(d) {
      this.callback(+1);
      return this.d.unshift(d);
    }

    pop() {
      this.callback(-1);
      return this.d.pop();
    }

    shift() {
      this.callback(-1);
      return this.d.shift();
    }

    //---------------------------------------------------------------------------------------------------------
    [UTIL.inspect.custom]() {
      return this.toString();
    }

    toString() {
      return rpr(this.d);
    }

  };

  //===========================================================================================================
  Pipeline = class Pipeline {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var ref, ref1, ref2, ref3;
      cfg = {...{}, ...cfg};
      // cfg                 = types.create.mr_pipeline_cfg cfg
      this.datacount = 0;
      this.input = this._new_collector();
      this.output = [];
      this./* pipeline output buffer does not participate in datacount */segments = [];
      this.on_before_step = (ref = cfg.on_before_step) != null ? ref : null;
      this.on_after_step = (ref1 = cfg.on_after_step) != null ? ref1 : null;
      this.on_before_process = (ref2 = cfg.on_before_process) != null ? ref2 : null;
      this.on_after_process = (ref3 = cfg.on_after_process) != null ? ref3 : null;
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _new_collector() {
      return new Reporting_collector((delta) => {
        return this.datacount += delta;
      });
    }

    //---------------------------------------------------------------------------------------------------------
    push(fitting) {
      var R, count, input, prv_segment;
      if ((count = this.segments.length) === 0) {
        input = this.input;
      } else {
        prv_segment = this.segments[count - 1];
        prv_segment.output = this._new_collector();
        input = prv_segment.output;
      }
      R = new Segment({
        input,
        fitting,
        output: this.output
      });
      this.segments.push(R);
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    send(d) {
      this.input.push(d);
      return d;
    }

    //---------------------------------------------------------------------------------------------------------
    process() {
      var i, len, ref, segment, segment_idx;
      if (this.on_before_process != null) {
        this.on_before_process();
      }
      ref = this.segments;
      for (segment_idx = i = 0, len = ref.length; i < len; segment_idx = ++i) {
        segment = ref[segment_idx];
        if (this.on_before_step != null) {
          this.on_before_step(segment_idx);
        }
        segment.process();
        if (this.on_after_step != null) {
          this.on_after_step(segment_idx);
        }
      }
      if (this.on_after_process != null) {
        this.on_after_process();
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    run() {
      var d, ref, results;
      ref = this.walk();
      results = [];
      for (d of ref) {
        results.push(d);
      }
      return results;
    }

    //---------------------------------------------------------------------------------------------------------
    * walk() {
      var d, i, len, ref;
      while (true) {
        this.process();
        ref = this.output;
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          yield d;
        }
        this.output.length = [];
        if (this.datacount < 1) {
          // yield @output.shift() while @output.length > 0
          break;
        }
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    [UTIL.inspect.custom]() {
      return this.toString();
    }

    toString() {
      var R, i, len, ref, segment;
      R = [];
      ref = this.segments;
      for (i = 0, len = ref.length; i < len; i++) {
        segment = ref[i];
        R.push(rpr(segment.input));
        R.push('▶');
        R.push(segment.transform.name);
        R.push('▶');
      }
      R.push(rpr(this.output));
      return R.join(' ');
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var on_after_process, on_after_step, on_before_process, on_before_step, p, plus_2, times_2, times_3;
    echo('—————————————————————————————————————————————');
    on_before_process = function() {
      return help('^97-1^', this);
    };
    on_after_process = function() {
      return warn('^97-2^', this);
    };
    on_before_step = function(sidx) {
      return urge('^97-3^', sidx, this);
    };
    on_after_step = function(sidx) {
      return urge('^97-4^', sidx, this);
    };
    on_before_step = null;
    // on_after_step     = null
    on_after_process = null;
    p = new Pipeline({on_before_process, on_before_step, on_after_step, on_after_process});
    p.push(times_2 = function(d, send) {
      if (isa.float(d)) {
        // send '('
        return send(d * 2);
      } else {
        // send ')'
        return send(d);
      }
    });
    p.push(plus_2 = function(d, send) {
      if (isa.float(d)) {
        // send '['
        return send(d + 2);
      } else {
        // send ']'
        return send(d);
      }
    });
    p.push(times_3 = function(d, send) {
      if (isa.float(d)) {
        // send '{'
        return send(d * 3);
      } else {
        // send '}'
        return send(d);
      }
    });
    p.send(1);
    p.send(2);
    p.send(3);
    // urge '^97-4^', d for d from p.walk()
    info('^97-4^', p.run());
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var on_after_process, on_after_step, on_before_process, on_before_step, p;
    echo('—————————————————————————————————————————————');
    on_before_process = function() {
      return help('^97-1^', this);
    };
    on_after_process = function() {
      return warn('^97-2^', this);
    };
    on_before_step = function(sidx) {
      return urge('^97-3^', sidx, this);
    };
    on_after_step = function(sidx) {
      return urge('^97-4^', sidx, this);
    };
    on_before_step = null;
    // on_after_step     = null
    on_after_process = null;
    p = new Pipeline({on_before_process, on_before_step, on_after_step, on_after_process});
    p.push([1, 2, 3]);
    info('^97-4^', p.run());
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  model_1 = function() {
    /* use a transform of arity 0 whose return value is the next data item. Must use special value `nothing`
     to unambiguously decide between 'has value', has no value'. Flag `done` could be made attribute of `tf`
     so unwarranted calls can be avoided. */
    var $tf, _, g, i, nothing, s, tf;
    echo('—————————————————————————————————————————————');
    s = [5, 6, 7];
    // g       = ( -> yield from s )() # the more general formulation
    g = s.values();
    nothing = Symbol('nothing');
    $tf = function(g) {
      var done;
      done = false;
      return function() {
        var value;
        if (done) {
          return nothing;
        }
        ({value, done} = g.next());
        whisper('^59-1^', {value, done});
        if (done) {
          return nothing;
        } else {
          return value;
        }
      };
    };
    tf = $tf(g);
    for (_ = i = 1; i <= 5; _ = ++i) {
      info('^59-2^', tf());
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  model_2a = function() {
    /* use a transform of arity 0, to be called with `send()` method as other transforms are, too. */
    var $tf, _, i, s, send, tf;
    echo('—————————————————————————————————————————————');
    s = [5, 6, 7];
    // gf  = -> yield from s # s.values()
    // g   = gf()
    send = function(d) {
      info('^60-1^', d);
      return d;
    };
    $tf = function(source) {
      var idx, last_idx;
      idx = -1;
      last_idx = s.length - 1;
      return function(send) {
        if (idx >= last_idx) {
          return null;
        }
        idx++;
        send(s[idx]);
        return null;
      };
    };
    tf = $tf(s);
    for (_ = i = 1; i <= 5; _ = ++i) {
      debug(tf(send));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  model_2b = function() {
    /* Same as `model_2a()`, but using a generator as the more general solution. */
    var mr, s, send;
    echo('—————————————————————————————————————————————');
    s = [5, 6, 7];
    // gf  = -> yield from s # s.values()
    // g   = gf()
    send = function(d) {
      info('^61-1^', d);
      return d;
    };
    mr = {
      get_tf: function(s) {
        var method, type;
        type = type_of(s);
        if ((method = this[`tf_from_${type}`]) == null) {
          throw new Error(`unable to convert a ${type} to a transform`);
        }
        return method.call(this, s);
      },
      tf_from_generator: function(s) {
        var done;
        debug('^61-2^', s);
        done = false;
        return function(send) {
          var d;
          if (done) {
            return null;
          }
          ({
            value: d,
            done
          } = s.next());
          if (!done) {
            send(d);
          }
          return null;
        };
      },
      tf_from_generatorfunction: function(s) {
        debug('^61-3^', type_of(s));
        return this.get_tf(s());
      },
      tf_from_list: function(s) {
        debug('^61-4^', type_of(s));
        return this.get_tf(s.values());
      },
      tf_from_arrayiterator: function(s) {
        debug('^61-4^', type_of(s));
        return this.tf_from_generator(s);
      }
    };
    debug('^61-5^', type_of(s));
    debug('^61-6^', type_of(s.values));
    debug('^61-7^', type_of(s.values()));
    debug('^61-8^', type_of((function*() {
      return (yield 1);
    })));
    debug('^61-9^', type_of((function*() {
      return (yield 1);
    })()));
    (function() {
      var _, i, results, tf;
      whisper('...................');
      tf = mr.get_tf(s);
      results = [];
      for (_ = i = 1; i <= 5; _ = ++i) {
        results.push(debug(tf(send)));
      }
      return results;
    })();
    (function() {
      var _, i, results, tf;
      whisper('...................');
      tf = mr.get_tf((function*() {
        return (yield* 'ABC');
      }));
      results = [];
      for (_ = i = 1; i <= 5; _ = ++i) {
        results.push(debug(tf(send)));
      }
      return results;
    })();
    (function() {
      var _, i, results, tf;
      whisper('...................');
      tf = mr.get_tf(s.values());
      results = [];
      for (_ = i = 1; i <= 5; _ = ++i) {
        results.push(debug(tf(send)));
      }
      return results;
    })();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      demo_1();
      demo_2();
      model_1();
      model_2a();
      return model_2b();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-ng.js.map
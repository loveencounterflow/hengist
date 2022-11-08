(function() {
  'use strict';
  var GUY, Pipeline, Reporting_collector, Segment, UTIL, alert, debug, def, demo_1, demo_2, echo, help, hide, info, inspect, isa, log, nameit, plain, praise, rpr, type_of, types, urge, validate, validate_optional, warn, whisper;

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
      hide(this, 'transform', this._as_transform(cfg.transform));
      hide(this, '_send', send = (d) => {
        this.output.push(d);
        return d/* 'inner' send method */;
      });
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _as_transform(transform) {
      /* TAINT validate arity */
      var R, name, source, type;
      switch (type = type_of(transform)) {
        case 'function':
          R = transform;
          break;
        case 'list':
          source = transform;
          R = function(d, send) {
            return debug(arguments);
          };
          break;
        default:
          throw new Error(`unable to push value of type ${rpr(type)}`);
      }
      //.......................................................................................................
      name = R.name;
      if (name === '') {
        name = 'ƒ';
      }
      return nameit(name, R);
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
    push(transform) {
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
        transform,
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

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      demo_1();
      return demo_2();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-ng.js.map
(function() {
  'use strict';
  var Collector, GUY, Pipeline, Segment, UTIL, alert, debug, echo, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, validate, validate_optional, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_optional} = types);

  UTIL = require('node:util');

  //===========================================================================================================
  Segment = class Segment {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var ref, ref1, send;
      this.input = (ref = cfg.input) != null ? ref : [];
      this.output = (ref1 = cfg.output) != null ? ref1 : [];
      GUY.props.hide(this, 'transform', cfg.transform.bind(this));
      /* binding is optional */      GUY.props.hide(this, '_send', send = (d) => {
        this.output.push(d);
        return d/* 'inner' send method */;
      });
      return void 0;
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

  };

  //---------------------------------------------------------------------------------------------------------
  // unshift: ->

    //===========================================================================================================
  Collector = class Collector {
    //---------------------------------------------------------------------------------------------------------
    constructor(host) {
      GUY.props.hide(this, 'host', host);
      GUY.props.hide(this, 'd', []);
      GUY.props.def(this, 'length', {
        get: function() {
          return this.d.length;
        }
      });
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    push(d) {
      this.host._on_change_datacount(+1);
      return this.d.push(d);
    }

    unshift(d) {
      this.host._on_change_datacount(+1);
      return this.d.unshift(d);
    }

    pop() {
      this.host._on_change_datacount(-1);
      return this.d.pop();
    }

    shift() {
      this.host._on_change_datacount(-1);
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
      this.datacount = 0;
      this.input = new Collector(this);
      this.output = new Collector(this);
      this.segments = [];
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _on_change_datacount(delta) {
      return this.datacount += delta;
    }

    //---------------------------------------------------------------------------------------------------------
    push(transform) {
      var R, count, input, output, prv_segment;
      output = this.output;
      if ((count = this.segments.length) === 0) {
        input = this.input;
      } else {
        prv_segment = this.segments[count - 1];
        prv_segment.output = new Collector(this);
        input = prv_segment.output;
      }
      R = new Segment({input, transform, output});
      this.segments.push(R);
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    send(d) {
      this.input.push(d);
      return d;
    }

    //---------------------------------------------------------------------------------------------------------
    * walk() {
      var i, len, ref, segment;
      while (true) {
        ref = this.segments;
        for (i = 0, len = ref.length; i < len; i++) {
          segment = ref[i];
          debug('^56-1^', this);
          segment.process();
          debug('^56-1^', this);
          debug('^56-1^', {
            output: this.output,
            datacount: this.datacount
          });
          while (this.output.length > 0) {
            yield this.output.shift();
          }
        }
        debug('^56-1^', {
          output: this.output,
          datacount: this.datacount
        });
        if (this.datacount < 1) {
          break;
        }
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    show() {
      var i, len, ref, segment;
      echo({
        input: this.input
      });
      ref = this.segments;
      for (i = 0, len = ref.length; i < len; i++) {
        segment = ref[i];
        echo(segment);
      }
      echo({
        output: this.output
      });
      return null;
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var d, p, ref;
      p = new Pipeline();
      p.push(function(d, send) {
        return send(d * 2);
      });
      p.push(function(d, send) {
        return send(d + 2);
      });
      debug(p.input.host);
      debug(p.input.host === p);
      p.send(1);
      p.send(2);
      p.send(3);
      p.show();
      ref = p.walk();
      // info '^97-3^', p.segments[ 0 ].process()
      // p.show()
      // info '^97-3^', p.segments[ 1 ].process()
      // p.show()
      for (d of ref) {
        urge('^97-4^', d);
      }
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=demo-ng.js.map
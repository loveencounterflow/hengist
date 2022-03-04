(function() {
  'use strict';
  var CND, Duct, GUY, Moonriver, Segment, UTIL, add_length_prop, badge, debug, demo_1, demo_2, echo, help, info, isa, misfit, pluck, rpr, symbol, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'PSEUDO-ARRAY';

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

  // { Moonriver }             = require '../../../apps/moonriver'
  UTIL = require('util');

  misfit = Symbol('misfit');

  symbol = GUY.lft.freeze({
    drop: Symbol.for('drop'), // this value will not go to output
    exit: Symbol.for('exit'), // exit pipeline processing
    // done:       Symbol.for 'done' # done for this iteration
    over: Symbol.for('over') // do not call again in this round
  });

  
  //-----------------------------------------------------------------------------------------------------------
  add_length_prop = function(target, key) {
    return GUY.props.def(target, 'length', {
      get: function() {
        return this[key].length;
      },
      set: function(x) {
        return this[key].length = x;
      }
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  pluck = function(o, k) {
    var R;
    R = o[k];
    delete o[k];
    return R;
  };

  Duct = (function() {
    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Duct {
      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        cfg = {...this.constructor.C.defaults.constructor, ...cfg};
        this.is_oblivious = pluck(cfg, 'is_oblivious');
        this.on_change = pluck(cfg, 'on_change');
        this.cfg = GUY.lft.freeze(this.cfg);
        this.d = [];
        this.delta = 0;
        this.rear = null;
        this.fore = null;
        this.moonriver = null;
        this.transform = null/* transform to be called when data arrives */
        this.prv_length = 0;
        add_length_prop(this, 'd');
        return void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      _on_change() {
        var ref;
        this.delta = this.length - this.prv_length;
        info('^348^', this.length, this.delta, rpr(this));
        this.prv_length = this.length;
        if ((ref = this.moonriver) != null) {
          ref.on_change(delta);
        }
        if (typeof this.on_change === "function") {
          this.on_change();
        }
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      set_oblivious(onoff) {
        validate.boolean(onoff);
        if (onoff && this.length > 0) {
          throw new Error("^XXX@1^ cannot set to oblivious unless duct is empty");
        }
        this.is_oblivious = onoff;
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      set_rear(x) {
        // validate.pond x
        this.rear = x;
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      set_fore(x) {
        // validate.pond x
        this.fore = x;
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      push(x) {
        var R;
        if (this.is_oblivious) {
          return null;
        }
        R = this.d.push(x);
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      pop(fallback = misfit) {
        var R;
        if (this.d.length === 0) {
          if (fallback !== misfit) {
            return fallback;
          }
          throw new Error("^XXX@1^ cannot pop() from empty list");
        }
        R = this.d.pop();
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      unshift(x) {
        var R;
        if (this.is_oblivious) {
          return null;
        }
        R = this.d.unshift(x);
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      shift(fallback = misfit) {
        var R;
        if (this.d.length === 0) {
          if (fallback !== misfit) {
            return fallback;
          }
          throw new Error("^XXX@1^ cannot shift() from empty list");
        }
        if (this.is_oblivious) {
          return null;
        }
        R = this.d.shift();
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      clear() {
        this.d.length = 0;
        this._on_change();
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      toString() {
        if (this.is_oblivious) {
          return '[X]';
        }
        return rpr(this.d); // + ' ➡︎ ' + ( @transform?.name ? './.' )
      }

      [UTIL.inspect.custom]() {
        return this.toString();
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Duct.C = GUY.lft.freeze({
      misfit: misfit,
      defaults: {
        constructor: {
          on_change: null,
          is_oblivious: false
        }
      }
    });

    return Duct;

  }).call(this);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  Segment = class Segment {
    //---------------------------------------------------------------------------------------------------------
    constructor(raw_transform) {
      // constructor: ( modifiers..., raw_transform ) ->
      //   throw new Error "^segment@1^ modifiers not implemented" if modifiers.length > 0
      this.input = null;
      this.output = null;
      this.moonriver = null;
      this.modifiers = null;
      this.arity = null;
      this.is_over = false;
      this.has_exited = false;
      // @is_listener      = false
      this.is_sender = false;
      this.is_source = false;
      this.transform = this._transform_from_raw_transform(raw_transform);
      GUY.props.def(this, '_has_input_data', {
        get: () => {
          return (this.input == null) || this.input.length === 0;
        }
      });
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    set_input(duct) {
      this.input = duct;
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    set_output(duct) {
      this.output = duct;
      return null;
    }

    //=========================================================================================================

    //---------------------------------------------------------------------------------------------------------
    _transform_from_raw_transform(raw_transform) {
      var is_sender, is_source, modifications, transform;
      ({is_sender, is_source, modifications, transform} = this._get_transform(raw_transform));
      this.arity = transform.length;
      // input             = if idx is 0         then @first_input else @pipeline[ idx - 1 ].output
      // output            = if idx is last_idx  then @last_output else []
      // @is_listener       = not ( modifications.do_once_before or modifications.do_once_after )
      this.modifications = {};
      this./* !!!!!!!!!!!!!!!!!!!!!!!!!! */is_sender = is_sender;
      this.is_source = is_source;
      //...................................................................................................
      if (this.is_sender) {
        if (this.modifications.do_once_after) {
          throw new Error("^moonriver@2^ transforms with modifier once_after cannot be senders");
        }
        this.call = (d, _) => {
          this.send.call_count++;
          if ((this.send.call_count === 1) && this.modifications.do_first) {
            this.transform(this.modifications.first, this.send);
          }
          this.transform(d, this.send);
          return null;
        };
      } else {
        //...................................................................................................
        this.call = (d, forward = true) => {
          this.send.call_count++;
          if ((this.send.call_count === 1) && this.modifications.do_first) {
            this.transform(this.modifications.first);
          }
          this.transform(d);
          if (forward && (!this.modifications.do_once_before) && (!this.modifications.do_once_after)) {
            this.send(d);
          }
          return null;
        };
      }
      //...................................................................................................
      // call        = call.bind segment
      this.send = (d) => {
        switch (d) {
          case symbol.drop:
            null;
            break;
          case symbol.over:
            this.over = true;
            break;
          case symbol.exit:
            this.exit = true;
            break;
          default:
            if (this.over) {
              throw new Error("^moonriver@3^ cannot send values after pipeline has terminated;" + `error occurred in transform idx ${idx} (${rpr(segment.transform.name)})`);
            }
            this.output.push(d);
        }
        return null;
      };
      //...................................................................................................
      // send            = send.bind segment
      this.send.symbol = symbol;
      this.send.over = () => {
        return this.send(symbol.over);
      };
      this.send.exit = () => {
        return this.send(symbol.exit);
      };
      this.send.call_count = 0;
      // GUY.props.hide segment, 'send', send
      // GUY.props.hide segment, 'call', call
      // @pipeline.push        segment
      // @on_once_before.push  segment if modifications.do_once_before
      // @on_once_after.push   segment if modifications.do_once_after
      // @on_last.push         segment if modifications.do_last
      // @sources.push         segment if is_source
      // @inputs.push    input
      return transform;
    }

    //=========================================================================================================

    //---------------------------------------------------------------------------------------------------------
    _get_transform(raw_transform) {
      var modifications, transform;
      if ((type_of(raw_transform)) === 'XXXXXXXXXXXXXXXXXtransform_with_modifications') {
        modifications = raw_transform.modifications;
        transform = this._get_transform_2(raw_transform.transform);
      } else {
        modifications = {};
        transform = this._get_transform_2(raw_transform);
      }
      //.......................................................................................................
      return {modifications, ...transform};
    }

    //---------------------------------------------------------------------------------------------------------
    _get_transform_2(raw_transform) {
      var arity, is_sender, is_source, transform, type;
      is_source = false;
      is_sender = true;
      switch (type = type_of(raw_transform)) {
        case 'function':
          switch ((arity = raw_transform.length)) {
            case 0:
              throw new Error("^moonriver@4^ zero-arity transform not implemented");
            case 1:
              is_sender = false;
              transform = raw_transform;
              break;
            case 2:
              transform = raw_transform;
              break;
            default:
              throw new Error(`^moonriver@5^ expected function with arity 2 got one with arity ${arity}`);
          }
          break;
        case 'generatorfunction':
          is_source = true;
          transform = this._source_from_generatorfunction(raw_transform);
          if ((arity = transform.length) !== 2) {
            throw new Error(`^moonriver@6^ expected function with arity 2 got one with arity ${arity}`);
          }
          break;
        case 'list':
          is_source = true;
          transform = this._source_from_list(raw_transform);
          break;
        default:
          if ((type === 'generator') || (isa.function(raw_transform[Symbol.iterator]))) {
            this.is_repeatable = false;
            is_source = true;
            transform = this._source_from_generator(raw_transform);
            if ((arity = transform.length) !== 2) {
              throw new Error(`^moonriver@7^ expected function with arity 2 got one with arity ${arity}`);
            }
          } else {
            throw new Error(`^moonriver@8^ cannot convert a ${type} to a source`);
          }
      }
      transform = transform.bind(this);
      return {is_sender, is_source, transform};
    }

    //---------------------------------------------------------------------------------------------------------
    _source_from_generatorfunction(generatorfunction) {
      var generator, generatorfunction_source;
      generator = null;
      return generatorfunction_source = function(d, send) {
        var done, value;
        if (generator == null) {
          generator = generatorfunction();
        }
        send(d);
        ({value, done} = generator.next());
        if (!done) {
          /* NOTE silently discards value of `return` where present in keeping with JS `for of` loops */
          return send(value);
        }
        generator = null;
        send.over();
        return null;
      };
    }

    //---------------------------------------------------------------------------------------------------------
    _source_from_generator(generator) {
      var generator_source;
      return generator_source = function(d, send) {
        var done, value;
        send(d);
        ({value, done} = generator.next());
        if (!done) {
          /* NOTE silently discards value of `return` where present in keeping with JS `for of` loops */
          return send(value);
        }
        send.over();
        return null;
      };
    }

    //---------------------------------------------------------------------------------------------------------
    _source_from_list(list) {
      var idx, last_idx, list_source;
      last_idx = list.length - 1;
      idx = -1;
      return list_source = function(d, send) {
        send(d);
        idx++;
        if (idx > last_idx) {
          idx = -1;
          return send.over();
        }
        send(list[idx]);
        return null;
      };
    }

    //=========================================================================================================

    //---------------------------------------------------------------------------------------------------------
    _name_of_transform() {
      if (this.transform == null) {
        return '???';
      }
      if (this.transform.name == null) {
        return '(anon)';
      }
      return this.transform.name.replace(/^bound /, '');
    }

    //---------------------------------------------------------------------------------------------------------
    [UTIL.inspect.custom]() {
      return this.toString();
    }

    toString() {
      var parts;
      parts = [];
      if (this.input != null) {
        parts.push((rpr(this.input)) + ' ➡︎ ');
      }
      parts.push(this._name_of_transform() + ' ➡︎ ' + (rpr(this.output)));
      return parts.join(' ');
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  Moonriver = class Moonriver {
    //---------------------------------------------------------------------------------------------------------
    constructor(transforms = null) {
      var transform;
      this.data_count = 0;
      this.segments = [];
      this.turns = 0;
      this.inputs = [];
      this.sources = [];
      // @on_last        = []
      // @on_once_before = []
      // @on_once_after  = []
      this.user = {};
      /* user area for sharing state between transforms, etc */      add_length_prop(this, 'segments');
      if (transforms != null) {
        for (transform of transforms) {
          this.push(transform);
        }
      }
      //.......................................................................................................
      GUY.props.def(this, 'sources_are_repeatable', {
        get: () => {
          return this.sources.every(function(x) {
            return x.is_repeatable;
          });
        }
      });
      GUY.props.def(this, 'can_repeat', {
        get: () => {
          return this.turns === 0 || this.is_repeatable;
        }
      });
      GUY.props.def(this, 'first_segment', {
        get: () => {
          return this.segments[0];
        }
      });
      GUY.props.def(this, 'last_segment', {
        get: () => {
          return this.segments[this.segments.length - 1];
        }
      });
      //.......................................................................................................
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    push(transform) {
      var last_segment, segment;
      segment = new Segment(transform);
      if ((last_segment = this.last_segment) != null) {
        segment.set_input(last_segment.output);
        last_segment.output.set_oblivious(false);
      }
      segment.set_output(new Duct({
        is_oblivious: true
      }));
      this.segments.push(segment);
      info('^322^', segment);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    on_change(delta) {
      this.data_count += delta;
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    * [Symbol.iterator]() {
      var i, len, ref, segment;
      ref = this.segments;
      for (i = 0, len = ref.length; i < len; i++) {
        segment = ref[i];
        yield segment;
      }
      return null;
    }

    //=========================================================================================================

    //---------------------------------------------------------------------------------------------------------
    _on_drive_start() {
      if (!this.sources_are_repeatable) {
        return false;
      }
      this.turns++;
      return true;
    }

    //---------------------------------------------------------------------------------------------------------
    drive(cfg) {
      var defaults, do_exit, i, j, len, len1, mode, ref, ref1, segment;
      if (!this._on_drive_start()) {
        /* TAINT validate `cfg` */
        throw new Error("^moonriver@9^ pipeline is not repeatable");
      }
      if (this.segments.length === 0) {
        return null;
      }
      defaults = {
        mode: 'depth'
      };
      ({mode} = {...defaults, ...cfg});
      ref = this.segments;
      for (i = 0, len = ref.length; i < len; i++) {
        segment = ref[i];
        segment.over = false;
      }
      do_exit = false;
      while (true) {
        ref1 = this.segments;
        //.......................................................................................................
        /*
        for segment in @on_once_before
          segment.call segment.modifications.once_before
        */
        //.......................................................................................................
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          segment = ref1[j];
          //...................................................................................................
          if ((segment.input != null) && (segment.over || !segment.is_listener)) {
            while (segment.input.length > 0) {
              /* If current segment has signalled it's gone out of business for this lap or is not a listener
                       in the first place, route all data on its input queue to its output queue: */
              /* TAINT rewrite to single step operation using Array::splice() */
              /* TAINT taking non-listeners out of the pipeline would speed this up but also somehwat
                       complicate the construction */
              segment.output.push(segment.input.shift());
            }
            continue;
          }
          //...................................................................................................
          if (segment.is_source && !segment._has_input_data) {
            /* If current segment is a source and no inputs are waiting to be sent, trigger the transform by
                     calling  with a discardable `drop` value: */
            segment.call(symbol.drop);
          } else {
            /* Otherwise, call transform with next value from input queue, if any; when in operational mode
                     `breadth`, repeat until input queue is empty: */
            //...................................................................................................
            if (segment.input != null) {
              while (segment.input.length > 0) {
                segment.call(segment.input.shift());
                if (mode === 'depth') {
                  break;
                }
              }
            }
          }
          //...................................................................................................
          /* Stop processing if the `exit` signal has been received: */
          if (segment.exit) {
            do_exit = true;
            break;
          }
        }
        if (do_exit) {
          break;
        }
        //.....................................................................................................
        /* When all sources have called it quits and no more input queues have data, end processing: */
        /* TAINT collect stats in above loop */
        if (this.sources.every(function(source) {
          return source.over;
        })) {
          if (!this.inputs.some(function(input) {
            return input.length > 0;
          })) {
            // debug '^453453^', "recognized pipeline exhausted"
            // debug '^453453^', @segments[ 2 ].send Symbol.for 'before_last'
            // continue
            break;
          }
        }
      }
      // #.......................................................................................................
      // ### Call all transforms that have the `last` modifier, then all transforms with the `once_after`
      // modifier, skipping those that have signalled `over` or `exit`: ###
      // ### TAINT make `last` and `once_after` mutually exclusive ###
      // for segment in @on_last
      //   continue if segment.over or segment.exit
      //   segment.over = true
      //   segment.call segment.modifications.last, false
      // #.......................................................................................................
      // for segment in @on_once_after
      //   continue if segment.over or segment.exit
      //   segment.over = true
      //   segment.call segment.modifications.once_after, false
      //.......................................................................................................
      return null;
    }

    //=========================================================================================================

    //---------------------------------------------------------------------------------------------------------
    toString() {
      return rpr(this.segments);
    }

    [UTIL.inspect.custom]() {
      return this.toString();
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var mr, multiply, show;
    mr = new Moonriver();
    mr.push([12, 13, 14]);
    mr.push(show = function(d) {
      return info('^332-1^', d);
    });
    mr.push(multiply = function(d, send) {
      send(d * 2);
      return send(d * 3);
    });
    mr.push(show = function(d) {
      return info('^332-2^', d);
    });
    mr.drive();
    debug('^343^', mr);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var d1, d2, f, multiply, show;
    d1 = new Duct();
    d2 = new Duct();
    d1.transform = multiply = function(d, send) {
      send(d * 2);
      return send(d * 3);
    };
    d2.transform = show = function(d) {
      return info('^332-3^', d);
    };
    d1.rear = null;
    d1.fore = d2;
    d2.rear = d1;
    d2.fore = null;
    d1.push(123);
    urge('^958^', d1);
    urge('^958^', d2);
    f = () => {
      d.push(42);
      d.push(43);
      d.push(44);
      d.shift();
      // d.splice 1, 0, 'a', 'b', 'c'
      urge('^948^', d);
      urge('^948^', d.length);
      return null;
    };
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_2();
    })();
  }

}).call(this);

//# sourceMappingURL=array-like-object.js.map
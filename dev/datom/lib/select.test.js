(function() {
  'use strict';
  var CND, badge, debug, echo, help, info, isa, jr, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DATOM/TESTS/SELECT';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  //...........................................................................................................
  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, validate, type_of} = types);

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "selector keypatterns" ] = ( T, done ) ->
  //   probes_and_matchers = [
  //     ["",{"sigils":"","name":""},null]
  //     ["^foo",{"sigils":"^","name":"foo"},null]
  //     ["<foo",{"sigils":"<","name":"foo"},null]
  //     ["  ",null,null]
  //     [">foo",{"sigils":">","name":"foo"},null]
  //     ["<>foo",{"sigils":"<>","name":"foo"},null]
  //     ["<>^foo",{"sigils":"<>^","name":"foo"},null]
  //     ["^ foo",null,null]
  //     ["^prfx:foo",{"sigils":"^","prefix":"prfx","name":"foo"},null]
  //     ["<prfx:foo",{"sigils":"<","prefix":"prfx","name":"foo"},null]
  //     [">prfx:foo",{"sigils":">","prefix":"prfx","name":"foo"},null]
  //     ["<>prfx:foo",{"sigils":"<>","prefix":"prfx","name":"foo"},null]
  //     ["<>^prfx:foo",{"sigils":"<>^","prefix":"prfx","name":"foo"},null]
  //     ["^<>",{"sigils":"^<>","name":""},null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, ->
  //       R = ( probe.match DATOM._selector_keypattern )?.groups ? null
  //       return null unless R?
  //       for key, value of R
  //         delete R[ key ] if value is undefined
  //       return R
  //   done()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "datom keypatterns" ] = ( T, done ) ->
  //   probes_and_matchers = [
  //     ["text",null,null]
  //     ["^text",{"sigil":"^","name":"text"},null]
  //     ["<bold",{"sigil":"<","name":"bold"},null]
  //     [">bold",{"sigil":">","name":"bold"},null]
  //     ["~collect",{"sigil":"~","name":"collect"},null]
  //     ["~kwic:collect",{"sigil":"~","prefix":"kwic","name":"collect"},null]
  //     ["<kwic:bar",{"sigil":"<","prefix":"kwic","name":"bar"},null]
  //     [">kwic:bar",{"sigil":">","prefix":"kwic","name":"bar"},null]
  //     [">!kwic:bar",null,null]
  //     ["<>kwic:bar",null,null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, ->
  //       R = ( probe.match DATOM._datom_keypattern )?.groups ? null
  //       return null unless R?
  //       for key, value of R
  //         delete R[ key ] if value is undefined
  //       return R
  //   done()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "classify_selector" ] = ( T, done ) ->
  //   probes_and_matchers = [
  //     ["#justatag",["tag","justatag"],'illegal']
  //     ["^bar",["keypattern",{"sigils":"^","name":"bar"}],null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, ->
  //       probe = ( -> ) if probe.startsWith '!!!'
  //       R     = DATOM._classify_selector probe
  //       if R[ 0 ] is 'keypattern'
  //         for key, value of R[ 1 ]
  //           delete R[ 1 ][ key ] if value is undefined
  //       else if R[ 0 ] is 'function'
  //         R[ 1 ] = null
  //       return R
  //   done()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this.select_2 = async function(T, done) {
    var DATOM, error, i, len, matcher, new_datom, probe, probes_and_matchers, select;
    ({DATOM} = require('../../../apps/datom'));
    ({new_datom, select} = DATOM);
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          {
            '$key': 'number',
            '$stamped': true
          },
          'number'
        ],
        false,
        null
      ],
      [
        [
          {
            '$key': 'number'
          },
          'number'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:number'
          },
          'number'
        ],
        false,
        null
      ],
      [
        [
          {
            '$key': 'math:number'
          },
          'math'
        ],
        false,
        null
      ],
      [
        [
          {
            '$key': 'math:number:integer'
          },
          'math:*:int*'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'outline:nl'
          },
          'outline:nl*'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'outline:nlsuper'
          },
          'outline:nl*'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'outline:nl'
          },
          ['outline:nl',
          'outline:nls']
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'outline:nls'
          },
          ['outline:nl',
          'outline:nls']
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'outline:nlsuper'
          },
          ['outline:nl',
          'outline:nls']
        ],
        false,
        null
      ],
      [
        [
          {
            '$key': 'x'
          },
          '?'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'xx'
          },
          '?'
        ],
        false,
        null
      ],
      [
        [
          {
            '$key': 'wat'
          },
          '?'
        ],
        false,
        null
      ],
      [
        [
          {
            '$key': '福'
          },
          '?'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:'
          },
          'math:*'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:*'
          },
          'math:*'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': '𫝂'
          },
          '?'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:*'
          },
          'math:\\*'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:number'
          },
          '*:number'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:number'
          },
          'math:*'
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:'
          },
          'math:\\*'
        ],
        false,
        null
      ],
      [
        [
          {
            '$key': 'math:'
          },
          ['math:\\*',
          '*:']
        ],
        true,
        null
      ],
      [
        [
          {
            '$key': 'math:number'
          },
          'm?th:n?mber'
        ],
        true,
        null
      ],
      [[42,
      'm?th:n?mber'],
      false,
      null],
      [[42,
      '*'],
      false,
      null]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d, result, selector;
          [d, selector] = probe;
          if (isa.text(selector)) {
            result = select(d, selector);
          } else {
            result = select(d, ...selector);
          }
          return resolve(result);
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["select ignores values other than PODs"] = async function(T, done) {
    var DATOM, error, i, len, matcher, new_datom, probe, probes_and_matchers, select;
    ({DATOM} = require('../../../apps/datom'));
    ({new_datom, select} = DATOM);
    //.........................................................................................................
    probes_and_matchers = [[[null, '^number'], false], [[123, '^number'], false]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, selector;
          [d, selector] = probe;
          try {
            resolve(select(d, selector));
          } catch (error1) {
            error = error1;
            return resolve(error.message);
          }
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["new_datom complains when value has `$key`"] = async function(T, done) {
    var DATOM, error, i, len, matcher, new_datom, probe, probes_and_matchers, select;
    ({DATOM} = require('../../../apps/datom'));
    ({new_datom, select} = DATOM);
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          "^number",
          {
            "$value": 123
          }
        ],
        {
          "$key": "^number",
          "$value": 123
        },
        null
      ],
      [
        [
          "^number",
          {
            "$value": 123,
            "$key": "something"
          }
        ],
        null,
        "value must not have attribute '\\$key'"
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var key, value;
          [key, value] = probe;
          return resolve(new_datom(key, value));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["xxx"] = async function(T, done) {
    var DATOM, error, i, len, matcher, new_datom, probe, probes_and_matchers, select;
    ({DATOM} = require('../../../apps/datom'));
    ({new_datom, select} = DATOM);
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          '^foo',
          {
            time: 1500000,
            value: "msg#1"
          }
        ],
        {
          "time": 1500000,
          "value": "msg#1",
          "$key": "^foo"
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var key, value;
          [key, value] = probe;
          return resolve(new_datom(key, value));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["new_datom (default settings)"] = async function(T, done) {
    var DATOM, error, i, len, matcher, new_datom, probe, probes_and_matchers, select;
    ({DATOM} = require('../../../apps/datom'));
    ({new_datom, select} = DATOM);
    //.........................................................................................................
    probes_and_matchers = [
      [
        ["^number",
        null],
        {
          "$key": "^number"
        },
        null
      ],
      [
        ["^number",
        123],
        {
          "$key": "^number",
          "$value": 123
        },
        null
      ],
      [
        [
          "^number",
          {
            "$value": 123
          }
        ],
        {
          "$key": "^number",
          "$value": 123
        },
        null
      ],
      [
        [
          "^number",
          {
            "value": 123
          }
        ],
        {
          "$key": "^number",
          "value": 123
        },
        null
      ],
      [
        [
          "^number",
          {
            "$value": {
              "$value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "$value": 123
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "value": {
              "$value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "value": {
            "$value": 123
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "$value": {
              "value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "value": 123
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "value": {
              "value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "value": {
            "value": 123
          }
        },
        null
      ],
      [
        ["^value",
        123],
        {
          "$key": "^value",
          "$value": 123
        },
        null
      ],
      [
        ["<start",
        123],
        {
          "$key": "<start",
          "$value": 123
        },
        null
      ],
      [
        [">stop",
        123],
        {
          "$key": ">stop",
          "$value": 123
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var key, value;
          [key, value] = probe;
          return resolve(new_datom(key, value));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["new_datom (without value merging)"] = async function(T, done) {
    var DATOM, error, i, len, matcher, new_datom, probe, probes_and_matchers, select;
    DATOM = new (require('../../../apps/datom')).Datom({
      merge_values: false
    });
    ({new_datom, select} = DATOM);
    //.........................................................................................................
    probes_and_matchers = [
      [
        ["^number",
        null],
        {
          "$key": "^number"
        },
        null
      ],
      [
        ["^number",
        123],
        {
          "$key": "^number",
          "$value": 123
        },
        null
      ],
      [
        [
          "^number",
          {
            "$value": 123
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "$value": 123
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "value": 123
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "value": 123
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "$value": {
              "$value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "$value": {
              "$value": 123
            }
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "value": {
              "$value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "value": {
              "$value": 123
            }
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "$value": {
              "value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "$value": {
              "value": 123
            }
          }
        },
        null
      ],
      [
        [
          "^number",
          {
            "value": {
              "value": 123
            }
          }
        ],
        {
          "$key": "^number",
          "$value": {
            "value": {
              "value": 123
            }
          }
        },
        null
      ],
      [
        ["^value",
        123],
        {
          "$key": "^value",
          "$value": 123
        },
        null
      ],
      [
        ["<start",
        123],
        {
          "$key": "<start",
          "$value": 123
        },
        null
      ],
      [
        [">stop",
        123],
        {
          "$key": ">stop",
          "$value": 123
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var key, value;
          [key, value] = probe;
          return resolve(new_datom(key, value));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["freezing"] = function(T, done) {
    var DATOM_FREEZE, DATOM_NOFREEZE, new_datom_freeze, new_datom_nofreeze;
    DATOM_FREEZE = new (require('../../../apps/datom')).Datom({
      freeze: true
    });
    ({
      new_datom: new_datom_freeze
    } = DATOM_FREEZE);
    DATOM_NOFREEZE = new (require('../../../apps/datom')).Datom({
      freeze: false
    });
    ({
      new_datom: new_datom_nofreeze
    } = DATOM_NOFREEZE);
    //.........................................................................................................
    T.ok(Object.isFrozen(new_datom_freeze('^mykey')));
    T.ok(!Object.isFrozen(new_datom_nofreeze('^mykey')));
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["_regex performance, runaway test"] = function(T, done) {};

  /*
  See https://github.com/loveencounterflow/runaway-regex-test
  and select-benchmark in this project
  */
  //-----------------------------------------------------------------------------------------------------------
  this["dirty"] = function(T, done) {
    var DATOM_DEFAULT, DATOM_DIRTY, DATOM_NODIRTY, d;
    DATOM_DIRTY = new (require('../../../apps/datom')).Datom({
      dirty: true
    });
    DATOM_NODIRTY = new (require('../../../apps/datom')).Datom({
      dirty: false
    });
    DATOM_DEFAULT = new (require('../../../apps/datom')).Datom();
    //.........................................................................................................
    d = DATOM_DEFAULT.new_datom('^foo', {
      x: 42,
      y: 108
    });
    // debug d
    // debug DATOM_DEFAULT.lets d, ( d ) -> null
    T.eq(DATOM_DIRTY.lets(d, function(d) {
      return delete d.x;
    }), {
      $key: '^foo',
      y: 108,
      $dirty: true
    });
    T.eq(DATOM_NODIRTY.lets(d, function(d) {
      return delete d.x;
    }), {
      $key: '^foo',
      y: 108
    });
    T.eq(DATOM_DEFAULT.lets(d, function(d) {
      return delete d.x;
    }), {
      $key: '^foo',
      y: 108
    });
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "dirty" ]
      // test @[ "new_datom complains when value has `$key`" ]
      // test @[ "selector keypatterns" ]
      return test(this.select_2);
    })();
  }

  // test @[ "new_datom (default settings)" ]
// debug new_datom '^helo', 42

}).call(this);

//# sourceMappingURL=select.test.js.map
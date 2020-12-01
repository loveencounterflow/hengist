(function() {
  'use strict';
  var CND, PATH, badge, debug, declare, echo, freeze, help, info, isa, lets, log, new_register, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERMATIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  log = urge;

  //...........................................................................................................
  test = require('guy-test');

  PATH = require('path');

  types = new (require('intertype')).Intertype();

  ({isa, validate, declare, type_of} = types.export());

  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  // declare

  //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  new_register = function() {
    var register, result;
    result = [];
    register = function(...P) {
      var x;
      x = P.length === 1 ? P[0] : P;
      whisper('^2321^', rpr(x));
      return result.push(x);
    };
    return {result, register};
  };

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic empty FSM"] = function(T, done) {
    var Intermatic, fsm;
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic({});
    T.eq(fsm.triggers, {
      start: {
        void: 'void'
      }
    });
    T.eq(fsm.start(), null);
    T.eq(fsm.lstate, 'void');
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic before.start(), after.start()"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      before: {
        start: function(s) {
          return register("before start");
        }
      },
      after: {
        start: function(s) {
          return register("after start");
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    T.eq(fsm.start(), null);
    T.eq(fsm.lstate, 'void');
    T.eq(result, ['before start', 'after start']);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic basics"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      triggers: [['void', 'start', 'lit'], ['*', 'reset', 'void'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
      // [ 'void',   'toggle', 'lit',  ]
      after: {
        change: function(s) {
          return register(`after change:  ${rpr(s)}`);
        }
      },
      enter: {
        dark: function(s) {
          return register(`enter dark:    ${rpr(s)}`);
        }
      },
      leave: {
        lit: function(s) {
          return register(`leave lit      ${rpr(s)}`);
        }
      },
      fail: function(s) {
        return register(`failed: ${rpr(s)}`);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    info('^44455^', JSON.stringify(fsm.triggers, null, 2));
    T.eq(fsm.triggers, {
      "start": {
        "void": "lit"
      },
      "toggle": {
        "lit": "dark",
        "dark": "lit"
      },
      "reset": {
        "void": "void",
        "lit": "void",
        "dark": "void"
      }
    });
    fsm.start();
    fsm.toggle();
    fsm.reset();
    fsm.toggle();
    // fsm.goto 'lit'
    // fsm.goto 'lit'
    // fsm.goto 'dark'
    echo(result);
    T.eq(result, ["after change:  { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'lit', changed: true }", "leave lit      { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "enter dark:    { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "after change:  { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "after change:  { '$key': '^trigger', id: 't3', from: 'dark', via: 'reset', to: 'void', changed: true }", "failed: { '$key': '^trigger', id: 't4', failed: true, from: 'void', via: 'toggle' }"]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic goto 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      triggers: [['void', 'start', 'lit'], ['*', 'reset', 'void'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
      // [ 'void',   'toggle', 'lit',  ]
      after: {
        change: function(s) {
          return register('after change', s);
        }
      },
      enter: {
        dark: function(s) {
          return register('enter dark', s);
        }
      },
      leave: {
        lit: function(s) {
          return register('leave lit', s);
        }
      },
      goto: '*',
      fail: function(s) {
        return register('failed', s);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    // T.eq ( Object.keys fsm ),  [ 'reserved', 'fsmd', 'triggers', 'fsm_names', 'has_subfsms', '_lstate', 'before', 'enter', 'stay', 'leave', 'after', 'up', 'starts_with', 'start', 'toggle', 'reset', 'goto', 'name', 'fail' ]
    fsm.start();
    fsm.toggle();
    fsm.reset();
    fsm.toggle();
    fsm.goto('lit');
    fsm.goto.lit();
    fsm.goto('dark');
    echo(result);
    T.eq(result, [
      [
        'after change',
        {
          '$key': '^trigger',
          id: 't1',
          from: 'void',
          via: 'start',
          to: 'lit',
          changed: true
        }
      ],
      [
        'leave lit',
        {
          '$key': '^trigger',
          id: 't2',
          from: 'lit',
          via: 'toggle',
          to: 'dark',
          changed: true
        }
      ],
      [
        'enter dark',
        {
          '$key': '^trigger',
          id: 't2',
          from: 'lit',
          via: 'toggle',
          to: 'dark',
          changed: true
        }
      ],
      [
        'after change',
        {
          '$key': '^trigger',
          id: 't2',
          from: 'lit',
          via: 'toggle',
          to: 'dark',
          changed: true
        }
      ],
      [
        'after change',
        {
          '$key': '^trigger',
          id: 't3',
          from: 'dark',
          via: 'reset',
          to: 'void',
          changed: true
        }
      ],
      [
        'failed',
        {
          '$key': '^trigger',
          id: 't4',
          failed: true,
          from: 'void',
          via: 'toggle'
        }
      ],
      [
        'after change',
        {
          '$key': '^trigger',
          id: 't5',
          from: 'void',
          via: 'goto',
          to: 'lit',
          changed: true
        }
      ],
      [
        'leave lit',
        {
          '$key': '^trigger',
          id: 't6',
          from: 'lit',
          via: 'goto',
          to: 'dark',
          changed: true
        }
      ],
      [
        'enter dark',
        {
          '$key': '^trigger',
          id: 't6',
          from: 'lit',
          via: 'goto',
          to: 'dark',
          changed: true
        }
      ],
      [
        'after change',
        {
          '$key': '^trigger',
          id: 't6',
          from: 'lit',
          via: 'goto',
          to: 'dark',
          changed: true
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cyclers 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'switch',
      triggers: [['void', 'start', 'off']],
      cyclers: {
        toggle: ['on', 'off'],
        step: ['bar', 'baz', 'gnu', 'doe']
      },
      goto: '*',
      after: {
        change: function(s) {
          return register(s);
        }
      },
      fail: function(s) {
        return register(s);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    fsm.start();
    fsm.toggle();
    fsm.toggle();
    fsm.step();
    fsm.goto('doe');
    fsm.step();
    fsm.step();
    fsm.step();
    fsm.step();
    fsm.step();
    echo(result);
    T.eq(result, [
      {
        '$key': '^trigger',
        id: 't1',
        from: 'void',
        via: 'start',
        to: 'off',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't2',
        from: 'off',
        via: 'toggle',
        to: 'on',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't3',
        from: 'on',
        via: 'toggle',
        to: 'off',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't4',
        failed: true,
        from: 'off',
        via: 'step'
      },
      {
        '$key': '^trigger',
        id: 't5',
        from: 'off',
        via: 'goto',
        to: 'doe',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't6',
        from: 'doe',
        via: 'step',
        to: 'bar',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't7',
        from: 'bar',
        via: 'step',
        to: 'baz',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't8',
        from: 'baz',
        via: 'step',
        to: 'gnu',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't9',
        from: 'gnu',
        via: 'step',
        to: 'doe',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't10',
        from: 'doe',
        via: 'step',
        to: 'bar',
        changed: true
      }
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic catchalls 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'knob',
      triggers: [['void', 'start', 'bar']],
      cyclers: {
        step: ['bar', 'baz', 'gnu', 'doe']
      },
      goto: '*',
      before: {
        any: function(s) {
          return register('before any', fsm.lstate, s);
        }
      },
      enter: {
        any: function(s) {
          return register('enter any', fsm.lstate, s);
        }
      },
      stay: {
        any: function(s) {
          return register('stay any', fsm.lstate, s);
        }
      },
      leave: {
        any: function(s) {
          return register('leave any', fsm.lstate, s);
        }
      },
      after: {
        any: function(s) {
          return register('after any', fsm.lstate, s);
        }
      },
      fail: function(s) {
        return register('fail', fsm.lstate, s);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    info("fsm.start()     ———");
    fsm.start();
    info("fsm.step()      ———");
    fsm.step();
    info(`fsm.goto.${fsm.lstate}()  ———`);
    fsm.goto(fsm.lstate);
    echo(result);
    T.eq(result, [
      [
        'before any',
        'void',
        {
          '$key': '^trigger',
          id: 't1',
          from: 'void',
          via: 'start',
          to: 'bar',
          changed: true
        }
      ],
      [
        'leave any',
        'void',
        {
          '$key': '^trigger',
          id: 't1',
          from: 'void',
          via: 'start',
          to: 'bar',
          changed: true
        }
      ],
      [
        'enter any',
        'bar',
        {
          '$key': '^trigger',
          id: 't1',
          from: 'void',
          via: 'start',
          to: 'bar',
          changed: true
        }
      ],
      [
        'after any',
        'bar',
        {
          '$key': '^trigger',
          id: 't1',
          from: 'void',
          via: 'start',
          to: 'bar',
          changed: true
        }
      ],
      [
        'before any',
        'bar',
        {
          '$key': '^trigger',
          id: 't2',
          from: 'bar',
          via: 'step',
          to: 'baz',
          changed: true
        }
      ],
      [
        'leave any',
        'bar',
        {
          '$key': '^trigger',
          id: 't2',
          from: 'bar',
          via: 'step',
          to: 'baz',
          changed: true
        }
      ],
      [
        'enter any',
        'baz',
        {
          '$key': '^trigger',
          id: 't2',
          from: 'bar',
          via: 'step',
          to: 'baz',
          changed: true
        }
      ],
      [
        'after any',
        'baz',
        {
          '$key': '^trigger',
          id: 't2',
          from: 'bar',
          via: 'step',
          to: 'baz',
          changed: true
        }
      ],
      [
        'before any',
        'baz',
        {
          '$key': '^trigger',
          id: 't3',
          from: 'baz',
          via: 'goto',
          to: 'baz',
          changed: false
        }
      ],
      [
        'stay any',
        'baz',
        {
          '$key': '^trigger',
          id: 't3',
          from: 'baz',
          via: 'goto',
          to: 'baz',
          changed: false
        }
      ],
      [
        'after any',
        'baz',
        {
          '$key': '^trigger',
          id: 't3',
          from: 'baz',
          via: 'goto',
          to: 'baz',
          changed: false
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic tryto 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'oneway_switch',
      triggers: [['void', 'start', 'off'], ['off', 'toggle', 'on']],
      after: {
        change: function(s) {
          return register(s);
        }
      },
      fail: function(s) {
        return register(s);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    fsm.start();
    T.eq(true, fsm.can.toggle());
    T.eq(true, fsm.tryto.toggle());
    T.eq(false, fsm.can('toggle'));
    T.eq(false, fsm.tryto('toggle'));
    T.throws(/unknown trigger "nonexisting_trigger"/, function() {
      return fsm.can('nonexisting_trigger');
    });
    echo(result);
    T.eq(result, [
      {
        '$key': '^trigger',
        id: 't1',
        from: 'void',
        via: 'start',
        to: 'off',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't2',
        from: 'off',
        via: 'toggle',
        to: 'on',
        changed: true
      }
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic tryto 2"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'oneway_switch',
      triggers: [['void', 'start', 'one']],
      cyclers: {
        step: ['one', 'two', 'three']
      },
      after: {
        change: function(s) {
          return register(s);
        }
      },
      // step:       ( s ) -> @step()
      fail: function(s) {
        return register(s);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    info('fsm.start()       ------------');
    info(CND.truth(fsm.start()));
    info('fsm.step()        ------------');
    info(CND.truth(fsm.step()));
    info('fsm.tryto.step()  ------------');
    info(CND.truth(fsm.tryto.step()));
    info('fsm.step()        ------------');
    info(CND.truth(fsm.step()));
    info('fsm.tryto.step()  ------------');
    info(CND.truth(fsm.tryto.step()));
    info('fsm.tryto.start() ------------');
    info(CND.truth(fsm.tryto.start()));
    echo(result);
    T.eq(result, [
      {
        '$key': '^trigger',
        id: 't1',
        from: 'void',
        via: 'start',
        to: 'one',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't2',
        from: 'one',
        via: 'step',
        to: 'two',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't3',
        from: 'two',
        via: 'step',
        to: 'three',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't4',
        from: 'three',
        via: 'step',
        to: 'one',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't5',
        from: 'one',
        via: 'step',
        to: 'two',
        changed: true
      },
      {
        '$key': '^trigger',
        id: 't6',
        from: 'two',
        via: 'step',
        to: 'three',
        changed: true
      }
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm 1"] = function(T, done) {
    var Intermatic, button, fsmd, register, result, srpr;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      //.......................................................................................................
      triggers: [['void', 'start', 'released'], ['*', 'reset', 'void'], ['released', 'press', 'pressed'], ['pressed', 'release', 'released']],
      enter: {
        pressed: function(s) {
          this.lamp.goto('lit');
          return register(`button: enter pressed: ${srpr(s)}`);
        },
        released: function(s) {
          this.lamp.goto('dark');
          return register(`button: enter released: ${srpr(s)}`);
        }
      },
      stay: {
        pressed: function(s) {
          return register(`button: stay pressed: ${srpr(s)}`);
        },
        released: function(s) {
          return register(`button: stay released: ${srpr(s)}`);
        }
      },
      after: {
        start: function(s) {
          return this.lamp.start();
        }
      },
      before: {
        trigger: function(s) {
          return register(`button: before *: ${srpr(s)}`);
        }
      },
      goto: '*',
      //.......................................................................................................
      fsms: {
        //.....................................................................................................
        lamp: {
          triggers: [['void', 'start', 'lit'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
          after: {
            change: function(s) {
              return register(`lamp: after change:  ${srpr(s)}`);
            }
          },
          enter: {
            dark: function(s) {
              this.up.goto('released');
              return register(`lamp: enter dark: ${srpr(s)}`);
            },
            lit: function(s) {
              this.up.goto('pressed');
              return register(`lamp: enter lit: ${srpr(s)}`);
            }
          },
          stay: {
            dark: function(s) {
              return register(`lamp: stay dark: ${srpr(s)}`);
            },
            lit: function(s) {
              return register(`lamp: stay lit: ${srpr(s)}`);
            }
          },
          before: {
            trigger: function(s) {
              return register(`lamp: before *: ${srpr(s)}`);
            }
          },
          goto: '*',
          bar: 108
        }
      },
      //.......................................................................................................
      after: {
        change: function(s) {
          return register("root_fsm.change");
        }
      },
      foo: 42
    };
    //---------------------------------------------------------------------------------------------------------
    srpr = function(s) {
      return `${s.from}--${s.via}->${s.to}`;
    };
    ({result, register} = new_register());
    //---------------------------------------------------------------------------------------------------------
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    button = new Intermatic(fsmd);
    T.eq(button.foo, 42);
    T.eq(button.lamp.bar, 108);
    info(button.triggers);
    info({
      button: {
        $value: button.lstate,
        lamp: button.lamp.lstate
      }
    });
    urge({
      button: button.lstate,
      'button/lamp': button.lamp.lstate
    });
    urge({
      button: button.lstate,
      button_lamp: button.lamp.lstate
    });
    urge({
      root: button.lstate,
      lamp: button.lamp.lstate
    });
    help([`°button:^${button.lstate}`, `°button/lamp:^${button.lamp.lstate}`]);
    button.start();
    info({
      button: {
        $value: button.lstate,
        lamp: button.lamp.lstate
      }
    });
    urge({
      button: button.lstate,
      'button/lamp': button.lamp.lstate
    });
    urge({
      button: button.lstate,
      button_lamp: button.lamp.lstate
    });
    urge({
      root: button.lstate,
      lamp: button.lamp.lstate
    });
    help([`°button:^${button.lstate}`, `°button/lamp:^${button.lamp.lstate}`]);
    button.press();
    info({
      button: {
        $value: button.lstate,
        lamp: button.lamp.lstate
      }
    });
    urge({
      button: button.lstate,
      'button/lamp': button.lamp.lstate
    });
    urge({
      button: button.lstate,
      button_lamp: button.lamp.lstate
    });
    urge({
      root: button.lstate,
      lamp: button.lamp.lstate
    });
    help([`°button:^${button.lstate}`, `°button/lamp:^${button.lamp.lstate}`]);
    T.eq(result, ['button: stay released: released--goto->released', 'lamp: enter dark: void--goto->dark', 'lamp: after change:  void--goto->dark', 'button: enter released: void--start->released', 'root_fsm.change', 'button: stay pressed: pressed--goto->pressed', 'lamp: enter lit: dark--goto->lit', 'lamp: after change:  dark--goto->lit', 'button: enter pressed: released--press->pressed', 'root_fsm.change']);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm 2"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, srpr;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      fsms: {
        alpha_btn: {
          //.......................................................................................................
          triggers: [['void', 'start', 'released'], ['*', 'reset', 'void'], ['released', 'press', 'pressed'], ['pressed', 'release', 'released']],
          // enter:
          //   pressed:  ( s ) ->
          //   released: ( s ) ->
          before: {
            start: function(s) {
              return this.lamp.start();
            }
          },
          after: {
            change: function(s) {
              this.lamp.toggle();
              return register({
                from: s.from,
                via: s.via,
                alpha_btn: this.lstate,
                lamp: this.lamp.lstate,
                color: this.color.lstate
              });
            }
          },
          //.......................................................................................................
          fsms: {
            //.....................................................................................................
            color: {
              triggers: [['red', 'toggle', 'green'], ['green', 'toggle', 'red']],
              after: {
                change: function(s) {
                  return register({
                    from: s.from,
                    via: s.via,
                    alpha_btn_color: this.lstate
                  });
                }
              }
            },
            //.....................................................................................................
            lamp: {
              triggers: [['void', 'start', 'lit'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
              before: {
                start: function(s) {
                  return this.up.color.start();
                }
              },
              enter: {
                dark: function(s) {
                  return this.up.color.toggle();
                }
              },
              after: {
                change: function(s) {
                  return register({
                    from: s.from,
                    via: s.via,
                    alpha_btn_lamp: this.lstate
                  });
                }
              }
            }
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    srpr = function(s) {
      return `${s.from}--${s.via}->${s.to}`;
    };
    ({result, register} = new_register());
    //---------------------------------------------------------------------------------------------------------
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    // debug '^898922^', fsm
    // debug '^898922^', ( k for k of fsm )
    whisper('-----------');
    whisper('start');
    fsm.alpha_btn.start();
    whisper('-----------');
    whisper('press');
    fsm.alpha_btn.press();
    whisper('-----------');
    whisper('release');
    fsm.alpha_btn.release();
    whisper('-----------');
    whisper('press');
    fsm.alpha_btn.press();
    whisper('-----------');
    whisper('release');
    fsm.alpha_btn.release();
    whisper('-----------');
    // debug result
    T.eq(result, [
      {
        from: 'void',
        via: 'start',
        alpha_btn_color: 'green'
      },
      {
        from: 'void',
        via: 'start',
        alpha_btn_lamp: 'lit'
      },
      {
        from: 'green',
        via: 'toggle',
        alpha_btn_color: 'red'
      },
      {
        from: 'lit',
        via: 'toggle',
        alpha_btn_lamp: 'dark'
      },
      {
        from: 'void',
        via: 'start',
        alpha_btn: 'released',
        lamp: 'dark',
        color: 'red'
      },
      {
        from: 'dark',
        via: 'toggle',
        alpha_btn_lamp: 'lit'
      },
      {
        from: 'released',
        via: 'press',
        alpha_btn: 'pressed',
        lamp: 'lit',
        color: 'red'
      },
      {
        from: 'red',
        via: 'toggle',
        alpha_btn_color: 'green'
      },
      {
        from: 'lit',
        via: 'toggle',
        alpha_btn_lamp: 'dark'
      },
      {
        from: 'pressed',
        via: 'release',
        alpha_btn: 'released',
        lamp: 'dark',
        color: 'green'
      },
      {
        from: 'dark',
        via: 'toggle',
        alpha_btn_lamp: 'lit'
      },
      {
        from: 'released',
        via: 'press',
        alpha_btn: 'pressed',
        lamp: 'lit',
        color: 'green'
      },
      {
        from: 'green',
        via: 'toggle',
        alpha_btn_color: 'red'
      },
      {
        from: 'lit',
        via: 'toggle',
        alpha_btn_lamp: 'dark'
      },
      {
        from: 'pressed',
        via: 'release',
        alpha_btn: 'released',
        lamp: 'dark',
        color: 'red'
      }
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_2()
      // @toolbox_demo()
      return test(this);
    })();
  }

  // test @[ "Intermatic catchalls 1" ]
// test @[ "Intermatic toolbox" ]
// test @[ "Intermatic tryto 1" ]
// test @[ "Intermatic tryto 2" ]
// test @[ "Intermatic cyclers 1" ]
// test @[ "Intermatic cFsm 1" ]
// test @[ "Intermatic cFsm" ]
// test @[ "Intermatic empty FSM" ]
// test @[ "Intermatic before.start(), after.start()" ]
// @[ "Intermatic empty FSM" ]()

}).call(this);

//# sourceMappingURL=main.tests.js.map
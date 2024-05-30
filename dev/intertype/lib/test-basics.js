(async function() {
  'use strict';
  var GTNG, GUY, TMP_types, Test, alert, async_test, debug, demo_1, echo, eq, help, info, inspect, log, plain, praise, reverse, rpr, sample_declarations, tasks, test, throws, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertype/test-basics'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  GTNG = require('../../../apps/guy-test-NG');

  TMP_types = new (require('intertype')).Intertype();

  ({Test, test, async_test, eq, throws} = GTNG);

  // test_mode                 = 'throw_failures'
  // test_mode                 = 'throw_errors'
  // test_mode                 = 'failsafe'

  //-----------------------------------------------------------------------------------------------------------
  // s                         = ( name ) -> Symbol.for  name
  // ps                        = ( name ) -> Symbol      name

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_XEMITTER: _" ] = ( T, done ) ->
  //   { DATOM }                 = require '../../../apps/datom'
  //   { new_datom
  //     select }                = DATOM
  // { Djehuti }               = require '../../../apps/intertalk'
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       [ key, value, ] = probe
  //       resolve new_datom key, value
  //   done()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @can_use_optional_refs_to_dotted_types = ( T, done ) ->
  //   { Intertype } = require '../../../apps/intertype'
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       isa } = types
  //     declare { maybefloat1: 'optional.float', }
  //     #.......................................................................................................
  //     eq ( Ω_intertype___1 = -> isa.float       null  ), false
  //     eq ( Ω_intertype___2 = -> isa.float       true  ), false
  //     eq ( Ω_intertype___3 = -> isa.float       0     ), true
  //     eq ( Ω_intertype___4 = -> isa.maybefloat1 null  ), true
  //     eq ( Ω_intertype___5 = -> isa.maybefloat1 true  ), false
  //     eq ( Ω_intertype___6 = -> isa.maybefloat1 0     ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       isa } = types
  //     declare { 'q':              'object', }
  //     declare { 'q.maybefloat2':  'optional.float', }
  //     #.......................................................................................................
  //     eq ( Ω_intertype___7 = -> isa.q             null                    ), false
  //     eq ( Ω_intertype___8 = -> isa.q             {}                      ), true
  //     eq ( Ω_intertype___9 = -> isa.q             { maybefloat2: null }   ), true
  //     eq ( Ω_intertype__10 = -> isa.q             { maybefloat2: false }  ), false
  //     eq ( Ω_intertype__11 = -> isa.q             { maybefloat2: 3 }      ), true
  //     eq ( Ω_intertype__12 = -> isa.q.maybefloat2  null                   ), true
  //     eq ( Ω_intertype__13 = -> isa.q.maybefloat2  true                   ), false
  //     eq ( Ω_intertype__14 = -> isa.q.maybefloat2  0                      ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       isa } = types
  //     declare { 'q':              'optional.object', }
  //     declare { 'q.maybefloat3':  'optional.float', }
  //     # isa.q null
  //     #.......................................................................................................
  //     safeguard T, => eq ( Ω_intertype__15 = -> isa.q             null                    ), true
  //     safeguard T, => eq ( Ω_intertype__16 = -> isa.q             {}                      ), true
  //     safeguard T, => eq ( Ω_intertype__17 = -> isa.q             { maybefloat3: null }   ), true
  //     safeguard T, => eq ( Ω_intertype__18 = -> isa.q             { maybefloat3: false }  ), false
  //     safeguard T, => eq ( Ω_intertype__19 = -> isa.q             { maybefloat3: 3 }      ), true
  //     safeguard T, => eq ( Ω_intertype__20 = -> isa.q.maybefloat3  null                   ), true
  //     safeguard T, => eq ( Ω_intertype__21 = -> isa.q.maybefloat3  true                   ), false
  //     safeguard T, => eq ( Ω_intertype__22 = -> isa.q.maybefloat3  0                      ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       validate
  //       isa } = types
  //     declare { 'person':                       'object', }
  //     declare { 'person.name':                  'text',   }
  //     declare { 'person.address':               'object', }
  //     declare { 'person.address.city':          'object', }
  //     declare { 'person.address.city.name':     'text',   }
  //     declare { 'person.address.city.postcode': 'text',   }
  //     declare { 'maybesomeone':                 'optional.person', }
  //     declare { 'mycity':                       'optional.person.address.city', }
  //     #.......................................................................................................
  //     eq ( Ω_intertype__23 = -> isa.person        null                                                            ), false
  //     eq ( Ω_intertype__24 = -> isa.person        {}                                                              ), false
  //     eq ( Ω_intertype__25 = -> isa.person        { name: 'Fred',                                               } ), false
  //     eq ( Ω_intertype__26 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
  //     eq ( Ω_intertype__27 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     eq ( Ω_intertype__28 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
  //     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
  //     eq ( Ω_intertype__29 = -> isa.maybesomeone  null                                                            ), true
  //     # eq ( Ω_intertype__30 = -> isa.maybesomeone  {}                                                              ), false
  //     # eq ( Ω_intertype__31 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
  //     # eq ( Ω_intertype__32 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
  //     # eq ( Ω_intertype__33 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     # eq ( Ω_intertype__34 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var Intertype_minimal, declarations, types;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    //.........................................................................................................
    declarations = {
      integer: {
        test: function(x) {
          return Number.isInteger(x);
        },
        create: function(p = null) {
          return parseInt(p != null ? p : this.declarations.integer.template, 10);
        },
        template: 0
      },
      text: {
        template: '',
        test: (function(x) {
          return (typeof x) === 'string';
        })
      },
      float: {
        test: function(x) {
          return Number.isFinite(x);
        },
        create: function(p = null) {
          return parseFloat(p != null ? p : this.declarations.float.template);
        },
        template: 0
      }
    };
    //.........................................................................................................
    declarations = {...sample_declarations, ...declarations};
    types = new Intertype_minimal(declarations);
    //.........................................................................................................
    debug('^233-1^', types.create.float('345.678'));
    debug('^233-1^', types.create.integer('345.678'));
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  sample_declarations = {
    boolean: function(x) {
      return (x === true) || (x === false);
    },
    function: function(x) {
      return (Object.prototype.toString.call(x)) === '[object Function]';
    },
    asyncfunction: function(x) {
      return (Object.prototype.toString.call(x)) === '[object AsyncFunction]';
    },
    symbol: function(x) {
      return (typeof x) === 'symbol';
    },
    object: function(x) {
      return (x != null) && (typeof x === 'object') && ((Object.prototype.toString.call(x)) === '[object Object]');
    },
    float: function(x) {
      return Number.isFinite(x);
    },
    text: function(x) {
      return (typeof x) === 'string';
    },
    nullary: function(x) {
      return (x != null) && ((x.length === 0) || (x.size === 0));
    },
    unary: function(x) {
      return (x != null) && ((x.length === 1) || (x.size === 1));
    },
    binary: function(x) {
      return (x != null) && ((x.length === 2) || (x.size === 2));
    },
    trinary: function(x) {
      return (x != null) && ((x.length === 3) || (x.size === 3));
    },
    object: function(x) {
      return (x != null) && (typeof x === 'object') && ((Object.prototype.toString.call(x)) === '[object Object]');
    },
    set: function(x) {
      return x instanceof Set;
    },
    list: function(x) {
      return Array.isArray(x);
    }
  };

  //###########################################################################################################

  //===========================================================================================================
  tasks = {
    //-----------------------------------------------------------------------------------------------------------
    interface: function() {
      var INTERTYPE, Ω_intertype__35, Ω_intertype__36, Ω_intertype__37, Ω_intertype__38, Ω_intertype__39, Ω_intertype__40, Ω_intertype__41, Ω_intertype__42, Ω_intertype__43, Ω_intertype__44, Ω_intertype__45, Ω_intertype__47, Ω_intertype__49, Ω_intertype__50, Ω_intertype__51, Ω_intertype__52, Ω_intertype__53, Ω_intertype__54, Ω_intertype__55, Ω_intertype__56, Ω_intertype__57, Ω_intertype__62, Ω_intertype__63;
      INTERTYPE = require('../../../apps/intertype');
      eq((Ω_intertype__35 = function() {
        return TMP_types.isa.object(INTERTYPE.types);
      }), true);
      eq((Ω_intertype__36 = function() {
        return TMP_types.isa.undefined(INTERTYPE.types.get_isa);
      }), true);
      eq((Ω_intertype__37 = function() {
        return TMP_types.isa.undefined(INTERTYPE.types.get_isa_optional);
      }), true);
      eq((Ω_intertype__38 = function() {
        return TMP_types.isa.undefined(INTERTYPE.types.get_validate);
      }), true);
      eq((Ω_intertype__39 = function() {
        return TMP_types.isa.undefined(INTERTYPE.types.get_validate_optional);
      }), true);
      eq((Ω_intertype__40 = function() {
        return TMP_types.isa.function(INTERTYPE.types._get_isa);
      }), true);
      eq((Ω_intertype__41 = function() {
        return TMP_types.isa.function(INTERTYPE.types._get_isa_optional);
      }), true);
      eq((Ω_intertype__42 = function() {
        return TMP_types.isa.function(INTERTYPE.types._get_validate);
      }), true);
      eq((Ω_intertype__43 = function() {
        return TMP_types.isa.function(INTERTYPE.types._get_validate_optional);
      }), true);
      eq((Ω_intertype__44 = function() {
        return TMP_types.isa.object(INTERTYPE.types);
      }), true);
      eq((Ω_intertype__45 = function() {
        return TMP_types.isa.object(INTERTYPE.types.isa);
      }), true);
      // eq ( Ω_intertype__46 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
      eq((Ω_intertype__47 = function() {
        return TMP_types.isa.object(INTERTYPE.types.validate);
      }), true);
      // eq ( Ω_intertype__48 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
      eq((Ω_intertype__49 = function() {
        return TMP_types.isa.function(INTERTYPE.types.isa.boolean);
      }), true);
      eq((Ω_intertype__50 = function() {
        return TMP_types.isa.function(INTERTYPE.types.isa.optional.boolean);
      }), true);
      eq((Ω_intertype__51 = function() {
        return TMP_types.isa.function(INTERTYPE.types.validate.boolean);
      }), true);
      eq((Ω_intertype__52 = function() {
        return TMP_types.isa.function(INTERTYPE.types.validate.optional.boolean);
      }), true);
      eq((Ω_intertype__53 = function() {
        return TMP_types.isa.object(INTERTYPE.types.create);
      }), true);
      eq((Ω_intertype__54 = function() {
        return TMP_types.isa.function(INTERTYPE.types.isa.text);
      }), true);
      eq((Ω_intertype__55 = function() {
        return TMP_types.isa.function(INTERTYPE.types.create.text);
      }), true);
      eq((Ω_intertype__56 = function() {
        return TMP_types.isa.object(INTERTYPE.types.declarations);
      }), true);
      eq((Ω_intertype__57 = function() {
        return TMP_types.isa.object(INTERTYPE.types.declarations.text);
      }), true);
      //.........................................................................................................
      // eq ( Ω_intertype__58 = -> INTERTYPE.types.isa.name           ), 'isa'
      // eq ( Ω_intertype__59 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
      // eq ( Ω_intertype__60 = -> INTERTYPE.types.validate.name      ), 'validate'
      // eq ( Ω_intertype__61 = -> INTERTYPE.types.create.name        ), 'create'
      eq((Ω_intertype__62 = function() {
        return INTERTYPE.types.declare.name;
      }), 'declare');
      eq((Ω_intertype__63 = function() {
        return INTERTYPE.types.type_of.name;
      }), 'type_of');
      (() => {        //.........................................................................................................
        var results, type, Ω_intertype__64;
        results = [];
        for (type in INTERTYPE.testing._isa) {
          if (Reflect.has(INTERTYPE.declarations, type)) {
            continue;
          }
          results.push(eq((Ω_intertype__64 = function() {
            return false;
          }), `type missing from default_declarations: ${rpr(type)}`));
        }
        return results;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    basic_functionality_using_types_object: function() {
      var INTERTYPE, types, Ω_intertype_100, Ω_intertype_101, Ω_intertype_102, Ω_intertype__65, Ω_intertype__66, Ω_intertype__67, Ω_intertype__68, Ω_intertype__69, Ω_intertype__70, Ω_intertype__71, Ω_intertype__72, Ω_intertype__73, Ω_intertype__74, Ω_intertype__75, Ω_intertype__76, Ω_intertype__77, Ω_intertype__78, Ω_intertype__79, Ω_intertype__80, Ω_intertype__81, Ω_intertype__82, Ω_intertype__83, Ω_intertype__84, Ω_intertype__85, Ω_intertype__86, Ω_intertype__87, Ω_intertype__88, Ω_intertype__89, Ω_intertype__90, Ω_intertype__91, Ω_intertype__92, Ω_intertype__93, Ω_intertype__94, Ω_intertype__95, Ω_intertype__96, Ω_intertype__97, Ω_intertype__98, Ω_intertype__99;
      INTERTYPE = require('../../../apps/intertype');
      types = new INTERTYPE.Intertype_minimal(sample_declarations);
      eq((Ω_intertype__65 = function() {
        return types.isa.boolean(false);
      }), true);
      eq((Ω_intertype__66 = function() {
        return types.isa.boolean(true);
      }), true);
      eq((Ω_intertype__67 = function() {
        return types.isa.boolean(null);
      }), false);
      eq((Ω_intertype__68 = function() {
        return types.isa.boolean(1);
      }), false);
      eq((Ω_intertype__69 = function() {
        return types.isa.optional.boolean(false);
      }), true);
      eq((Ω_intertype__70 = function() {
        return types.isa.optional.boolean(true);
      }), true);
      eq((Ω_intertype__71 = function() {
        return types.isa.optional.boolean(null);
      }), true);
      eq((Ω_intertype__72 = function() {
        return types.isa.optional.boolean(1);
      }), false);
      //.........................................................................................................
      eq((Ω_intertype__73 = function() {
        return types.validate.boolean(false);
      }), false);
      eq((Ω_intertype__74 = function() {
        return types.validate.boolean(true);
      }), true);
      eq((Ω_intertype__75 = function() {
        return types.validate.optional.boolean(true);
      }), true);
      eq((Ω_intertype__76 = function() {
        return types.validate.optional.boolean(false);
      }), false);
      eq((Ω_intertype__77 = function() {
        return types.validate.optional.boolean(void 0);
      }), void 0);
      eq((Ω_intertype__78 = function() {
        return types.validate.optional.boolean(null);
      }), null);
      throws((Ω_intertype__79 = function() {
        return types.validate.boolean(1);
      }), /expected a boolean/);
      throws((Ω_intertype__80 = function() {
        return types.validate.optional.boolean(1);
      }), /expected an optional boolean/);
      //.........................................................................................................
      eq((Ω_intertype__81 = function() {
        return types.type_of(null);
      }), 'null');
      eq((Ω_intertype__82 = function() {
        return types.type_of(void 0);
      }), 'undefined');
      eq((Ω_intertype__83 = function() {
        return types.type_of(false);
      }), 'boolean');
      eq((Ω_intertype__84 = function() {
        return types.type_of(Symbol('p'));
      }), 'symbol');
      eq((Ω_intertype__85 = function() {
        return types.type_of({});
      }), 'object');
      eq((Ω_intertype__86 = function() {
        return types.type_of(0/0);
      }), 'unknown');
      eq((Ω_intertype__87 = function() {
        return types.type_of(+2e308);
      }), 'unknown');
      eq((Ω_intertype__88 = function() {
        return types.type_of(-2e308);
      }), 'unknown');
      //.........................................................................................................
      debug('^4324^', 'null           ', types.declarations.null);
      debug('^4324^', 'function       ', types.declarations.function);
      debug('^4324^', 'boolean        ', types.declarations.boolean);
      debug('^4324^', 'text           ', types.declarations.text);
      debug('^4324^', 'asyncfunction  ', types.declarations.asyncfunction);
      debug('^4324^');
      debug('^4324^', 'null           ', types.isa.null);
      debug('^4324^', 'function       ', types.isa.function);
      debug('^4324^', 'boolean        ', types.isa.boolean);
      debug('^4324^', 'text           ', types.isa.text);
      debug('^4324^', 'asyncfunction  ', types.isa.asyncfunction);
      debug('^4324^');
      debug('^4324^', 'null           ', types.isa.optional.null);
      debug('^4324^', 'function       ', types.isa.optional.function);
      debug('^4324^', 'boolean        ', types.isa.optional.boolean);
      debug('^4324^', 'text           ', types.isa.optional.text);
      debug('^4324^', 'asyncfunction  ', types.isa.optional.asyncfunction);
      debug('^4324^');
      debug('^4324^', 'null           ', types.validate.null);
      debug('^4324^', 'function       ', types.validate.function);
      debug('^4324^', 'boolean        ', types.validate.boolean);
      debug('^4324^', 'text           ', types.validate.text);
      debug('^4324^', 'asyncfunction  ', types.validate.asyncfunction);
      eq((Ω_intertype__89 = function() {
        return types.isa.asyncfunction.name;
      }), 'isa.asyncfunction');
      eq((Ω_intertype__90 = function() {
        return types.isa.optional.asyncfunction.name;
      }), 'isa.optional.asyncfunction');
      eq((Ω_intertype__91 = function() {
        return types.validate.asyncfunction.name;
      }), 'validate.asyncfunction');
      eq((Ω_intertype__92 = function() {
        return types.validate.optional.asyncfunction.name;
      }), 'validate.optional.asyncfunction');
      eq((Ω_intertype__93 = function() {
        var ref;
        return (ref = types.declarations.null) != null ? ref.type : void 0;
      }), 'null');
      eq((Ω_intertype__94 = function() {
        var ref;
        return (ref = types.declarations.function) != null ? ref.type : void 0;
      }), 'function');
      eq((Ω_intertype__95 = function() {
        var ref;
        return (ref = types.declarations.boolean) != null ? ref.type : void 0;
      }), 'boolean');
      eq((Ω_intertype__96 = function() {
        var ref;
        return (ref = types.declarations.text) != null ? ref.type : void 0;
      }), 'text');
      eq((Ω_intertype__97 = function() {
        var ref;
        return (ref = types.declarations.asyncfunction) != null ? ref.type : void 0;
      }), 'asyncfunction');
      eq((Ω_intertype__98 = function() {
        var ref;
        return (ref = types.isa.null) != null ? ref.name : void 0;
      }), 'isa.null');
      eq((Ω_intertype__99 = function() {
        var ref;
        return (ref = types.isa.function) != null ? ref.name : void 0;
      }), 'isa.function');
      eq((Ω_intertype_100 = function() {
        var ref;
        return (ref = types.isa.boolean) != null ? ref.name : void 0;
      }), 'isa.boolean');
      eq((Ω_intertype_101 = function() {
        var ref;
        return (ref = types.isa.text) != null ? ref.name : void 0;
      }), 'isa.text');
      eq((Ω_intertype_102 = function() {
        var ref;
        return (ref = types.isa.asyncfunction) != null ? ref.name : void 0;
      }), 'isa.asyncfunction');
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    basic_functionality_using_standalone_methods: function() {
      var INTERTYPE, isa, type_of, validate, Ω_intertype_103, Ω_intertype_104, Ω_intertype_105, Ω_intertype_106, Ω_intertype_107, Ω_intertype_108, Ω_intertype_109, Ω_intertype_110, Ω_intertype_111, Ω_intertype_112, Ω_intertype_113, Ω_intertype_114, Ω_intertype_115, Ω_intertype_116, Ω_intertype_117, Ω_intertype_118, Ω_intertype_119, Ω_intertype_120, Ω_intertype_121, Ω_intertype_122, Ω_intertype_123, Ω_intertype_124, Ω_intertype_125, Ω_intertype_126, Ω_intertype_127, Ω_intertype_128, Ω_intertype_129, Ω_intertype_130, Ω_intertype_131, Ω_intertype_132, Ω_intertype_133, Ω_intertype_134, Ω_intertype_135, Ω_intertype_136, Ω_intertype_137, Ω_intertype_138;
      INTERTYPE = require('../../../apps/intertype');
      ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
      eq((Ω_intertype_103 = function() {
        return isa.boolean(false);
      }), true);
      eq((Ω_intertype_104 = function() {
        return isa.boolean(true);
      }), true);
      eq((Ω_intertype_105 = function() {
        return isa.boolean(null);
      }), false);
      eq((Ω_intertype_106 = function() {
        return isa.boolean(1);
      }), false);
      eq((Ω_intertype_107 = function() {
        return isa.unknown(1);
      }), false);
      eq((Ω_intertype_108 = function() {
        return isa.unknown(2e308);
      }), true);
      eq((Ω_intertype_109 = function() {
        return isa.optional.boolean(false);
      }), true);
      eq((Ω_intertype_110 = function() {
        return isa.optional.boolean(true);
      }), true);
      eq((Ω_intertype_111 = function() {
        return isa.optional.boolean(null);
      }), true);
      eq((Ω_intertype_112 = function() {
        return isa.optional.boolean(1);
      }), false);
      eq((Ω_intertype_113 = function() {
        return isa.optional.unknown(1);
      }), false);
      eq((Ω_intertype_114 = function() {
        return isa.optional.unknown(2e308);
      }), true);
      eq((Ω_intertype_115 = function() {
        return isa.optional.unknown(void 0);
      }), true);
      eq((Ω_intertype_116 = function() {
        return isa.optional.unknown(void 0);
      }), true);
      //.........................................................................................................
      eq((Ω_intertype_117 = function() {
        return validate.boolean(false);
      }), false);
      eq((Ω_intertype_118 = function() {
        return validate.boolean(true);
      }), true);
      eq((Ω_intertype_119 = function() {
        return validate.optional.boolean(true);
      }), true);
      eq((Ω_intertype_120 = function() {
        return validate.optional.boolean(false);
      }), false);
      eq((Ω_intertype_121 = function() {
        return validate.optional.boolean(void 0);
      }), void 0);
      eq((Ω_intertype_122 = function() {
        return validate.optional.boolean(null);
      }), null);
      throws((Ω_intertype_123 = function() {
        return validate.boolean(1);
      }), /expected a boolean/);
      throws((Ω_intertype_124 = function() {
        return validate.optional.boolean(1);
      }), /expected an optional boolean/);
      //.........................................................................................................
      eq((Ω_intertype_125 = function() {
        return type_of(null);
      }), 'null');
      eq((Ω_intertype_126 = function() {
        return type_of(void 0);
      }), 'undefined');
      eq((Ω_intertype_127 = function() {
        return type_of(false);
      }), 'boolean');
      eq((Ω_intertype_128 = function() {
        return type_of(Symbol('p'));
      }), 'symbol');
      eq((Ω_intertype_129 = function() {
        return type_of({});
      }), 'object');
      eq((Ω_intertype_130 = function() {
        return type_of(0/0);
      }), 'unknown');
      eq((Ω_intertype_131 = function() {
        return type_of(+2e308);
      }), 'unknown');
      eq((Ω_intertype_132 = function() {
        return type_of(-2e308);
      }), 'unknown');
      //.........................................................................................................
      eq((Ω_intertype_133 = function() {
        return isa.asyncfunction.name;
      }), 'isa.asyncfunction');
      eq((Ω_intertype_134 = function() {
        return isa.optional.asyncfunction.name;
      }), 'isa.optional.asyncfunction');
      eq((Ω_intertype_135 = function() {
        return validate.asyncfunction.name;
      }), 'validate.asyncfunction');
      eq((Ω_intertype_136 = function() {
        return validate.optional.asyncfunction.name;
      }), 'validate.optional.asyncfunction');
      //.........................................................................................................
      throws((Ω_intertype_137 = function() {
        return isa.float(3, 4);
      }), /method 'isa.float' expects 1 arguments, got 2/);
      throws((Ω_intertype_138 = function() {
        return isa.float();
      }), /method 'isa.float' expects 1 arguments, got 0/);
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    methods_check_arity: function() {
      var INTERTYPE, isa, type_of, validate, Ω_intertype_139, Ω_intertype_140, Ω_intertype_141, Ω_intertype_142, Ω_intertype_143, Ω_intertype_144, Ω_intertype_145, Ω_intertype_146, Ω_intertype_147, Ω_intertype_148;
      INTERTYPE = require('../../../apps/intertype');
      ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
      //.........................................................................................................
      throws((Ω_intertype_139 = function() {
        return isa.float(3, 4);
      }), /method 'isa.float' expects 1 arguments, got 2/);
      throws((Ω_intertype_140 = function() {
        return isa.float();
      }), /method 'isa.float' expects 1 arguments, got 0/);
      throws((Ω_intertype_141 = function() {
        return isa.optional.float(3, 4);
      }), /method 'isa.optional.float' expects 1 arguments, got 2/);
      throws((Ω_intertype_142 = function() {
        return isa.optional.float();
      }), /method 'isa.optional.float' expects 1 arguments, got 0/);
      throws((Ω_intertype_143 = function() {
        return validate.float(3, 4);
      }), /method 'validate.float' expects 1 arguments, got 2/);
      throws((Ω_intertype_144 = function() {
        return validate.float();
      }), /method 'validate.float' expects 1 arguments, got 0/);
      throws((Ω_intertype_145 = function() {
        return validate.optional.float(3, 4);
      }), /method 'validate.optional.float' expects 1 arguments, got 2/);
      throws((Ω_intertype_146 = function() {
        return validate.optional.float();
      }), /method 'validate.optional.float' expects 1 arguments, got 0/);
      throws((Ω_intertype_147 = function() {
        return type_of(3, 4);
      }), /expected 1 arguments, got 2/);
      throws((Ω_intertype_148 = function() {
        return type_of();
      }), /expected 1 arguments, got 0/);
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    same_basic_types: function() {
      var $function, asyncfunction, asyncgenerator, asyncgeneratorfunction, boolean, generator, generatorfunction, isa, symbol, type_of, validate, Ω_intertype_149, Ω_intertype_150, Ω_intertype_151, Ω_intertype_152, Ω_intertype_153, Ω_intertype_154, Ω_intertype_155, Ω_intertype_156, Ω_intertype_157, Ω_intertype_158, Ω_intertype_159, Ω_intertype_160, Ω_intertype_161, Ω_intertype_162, Ω_intertype_163, Ω_intertype_164, Ω_intertype_165, Ω_intertype_166, Ω_intertype_167, Ω_intertype_168, Ω_intertype_169, Ω_intertype_170, Ω_intertype_171, Ω_intertype_172;
      ({isa, validate, type_of} = require('../../../apps/intertype'));
      //.........................................................................................................
      boolean = false;
      $function = function() {};
      asyncfunction = async function() {
        return (await null);
      };
      generatorfunction = (function*() {
        return (yield null);
      });
      generator = (function*() {
        return (yield null);
      })();
      asyncgeneratorfunction = (async function*() {
        return (yield (await null));
      });
      asyncgenerator = (async function*() {
        return (yield (await null));
      })();
      symbol = Symbol('what');
      //.........................................................................................................
      eq((Ω_intertype_149 = function() {
        return isa.boolean(boolean);
      }), true);
      eq((Ω_intertype_150 = function() {
        return isa.function($function);
      }), true);
      eq((Ω_intertype_151 = function() {
        return isa.asyncfunction(asyncfunction);
      }), true);
      eq((Ω_intertype_152 = function() {
        return isa.generatorfunction(generatorfunction);
      }), true);
      eq((Ω_intertype_153 = function() {
        return isa.asyncgeneratorfunction(asyncgeneratorfunction);
      }), true);
      eq((Ω_intertype_154 = function() {
        return isa.asyncgenerator(asyncgenerator);
      }), true);
      eq((Ω_intertype_155 = function() {
        return isa.generator(generator);
      }), true);
      eq((Ω_intertype_156 = function() {
        return isa.symbol(symbol);
      }), true);
      //.........................................................................................................
      eq((Ω_intertype_157 = function() {
        return validate.boolean(boolean);
      }), boolean);
      eq((Ω_intertype_158 = function() {
        return validate.function($function);
      }), $function);
      eq((Ω_intertype_159 = function() {
        return validate.asyncfunction(asyncfunction);
      }), asyncfunction);
      eq((Ω_intertype_160 = function() {
        return validate.generatorfunction(generatorfunction);
      }), generatorfunction);
      eq((Ω_intertype_161 = function() {
        return validate.asyncgeneratorfunction(asyncgeneratorfunction);
      }), asyncgeneratorfunction);
      eq((Ω_intertype_162 = function() {
        return validate.asyncgenerator(asyncgenerator);
      }), asyncgenerator);
      eq((Ω_intertype_163 = function() {
        return validate.generator(generator);
      }), generator);
      eq((Ω_intertype_164 = function() {
        return validate.symbol(symbol);
      }), symbol);
      //.........................................................................................................
      eq((Ω_intertype_165 = function() {
        return type_of(boolean);
      }), 'boolean');
      eq((Ω_intertype_166 = function() {
        return type_of($function);
      }), 'function');
      eq((Ω_intertype_167 = function() {
        return type_of(asyncfunction);
      }), 'asyncfunction');
      eq((Ω_intertype_168 = function() {
        return type_of(generatorfunction);
      }), 'generatorfunction');
      eq((Ω_intertype_169 = function() {
        return type_of(asyncgeneratorfunction);
      }), 'asyncgeneratorfunction');
      eq((Ω_intertype_170 = function() {
        return type_of(asyncgenerator);
      }), 'asyncgenerator');
      eq((Ω_intertype_171 = function() {
        return type_of(generator);
      }), 'generator');
      eq((Ω_intertype_172 = function() {
        return type_of(symbol);
      }), 'symbol');
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    throw_instructive_error_on_missing_type: function() {
      var INTERTYPE, isa, type_of, validate, Ω_intertype_173, Ω_intertype_174, Ω_intertype_175, Ω_intertype_176, Ω_intertype_177, Ω_intertype_178, Ω_intertype_179, Ω_intertype_180, Ω_intertype_181, Ω_intertype_182, Ω_intertype_183, Ω_intertype_184, Ω_intertype_185, Ω_intertype_186, Ω_intertype_187, Ω_intertype_188;
      INTERTYPE = require('../../../apps/intertype');
      ({isa, validate, type_of} = new INTERTYPE.Intertype());
      //.........................................................................................................
      throws((Ω_intertype_173 = function() {
        return isa.quux;
      }), /unknown type 'quux'/);
      throws((Ω_intertype_174 = function() {
        return isa.quux();
      }), /unknown type 'quux'/);
      throws((Ω_intertype_175 = function() {
        return isa.quux(3);
      }), /unknown type 'quux'/);
      throws((Ω_intertype_176 = function() {
        return isa.quux(3, 4);
      }), /unknown type 'quux'/);
      throws((Ω_intertype_177 = function() {
        return isa.optional.quux;
      }), /unknown type 'quux'/);
      throws((Ω_intertype_178 = function() {
        return isa.optional.quux();
      }), /unknown type 'quux'/);
      throws((Ω_intertype_179 = function() {
        return isa.optional.quux(3);
      }), /unknown type 'quux'/);
      throws((Ω_intertype_180 = function() {
        return isa.optional.quux(3, 4);
      }), /unknown type 'quux'/);
      throws((Ω_intertype_181 = function() {
        return validate.quux;
      }), /unknown type 'quux'/);
      throws((Ω_intertype_182 = function() {
        return validate.quux();
      }), /unknown type 'quux'/);
      throws((Ω_intertype_183 = function() {
        return validate.quux(3);
      }), /unknown type 'quux'/);
      throws((Ω_intertype_184 = function() {
        return validate.quux(3, 4);
      }), /unknown type 'quux'/);
      throws((Ω_intertype_185 = function() {
        return validate.optional.quux;
      }), /unknown type 'quux'/);
      throws((Ω_intertype_186 = function() {
        return validate.optional.quux();
      }), /unknown type 'quux'/);
      throws((Ω_intertype_187 = function() {
        return validate.optional.quux(3);
      }), /unknown type 'quux'/);
      throws((Ω_intertype_188 = function() {
        return validate.optional.quux(3, 4);
      }), /unknown type 'quux'/);
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    throw_instructive_error_when_optional_is_declared: function() {
      var INTERTYPE, Ω_intertype_189;
      INTERTYPE = require('../../../apps/intertype');
      throws((Ω_intertype_189 = function() {
        return new INTERTYPE.Intertype_minimal({
          optional: (function(x) {
            return true;
          })
        });
      }), /not allowed to re-declare type 'optional'/);
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    throw_instructive_error_when_wrong_type_of_isa_test_declared: function() {
      var Intertype, Ω_intertype_190, Ω_intertype_191, Ω_intertype_192, Ω_intertype_193, Ω_intertype_194, Ω_intertype_195, Ω_intertype_196, Ω_intertype_197, Ω_intertype_198, Ω_intertype_199;
      ({Intertype} = require('../../../apps/intertype'));
      //.........................................................................................................
      throws((Ω_intertype_190 = function() {
        return new Intertype({
          foo: (function() {})
        });
      }), /expected function with 1 parameters, got one with 0/);
      throws((Ω_intertype_191 = function() {
        return new Intertype({
          foo: (function(a, b) {})
        });
      }), /expected function with 1 parameters, got one with 2/);
      throws((Ω_intertype_192 = function() {
        return new Intertype({
          foo: true
        });
      }), /expected type name, method, or object to indicate test method, got a boolean/);
      throws((Ω_intertype_193 = function() {
        return new Intertype({
          foo: void 0
        });
      }), /expected type name, method, or object to indicate test method, got a undefined/);
      throws((Ω_intertype_194 = function() {
        return new Intertype({
          foo: null
        });
      }), /expected type name, method, or object to indicate test method, got a null/);
      throws((Ω_intertype_195 = function() {
        return new Intertype({
          foo: {}
        });
      }), /expected type name, method, or object to indicate test method, got a undefined/);
      throws((Ω_intertype_196 = function() {
        return new Intertype({
          foo: {
            test: null
          }
        });
      }), /expected type name, method, or object to indicate test method, got a null/);
      throws((Ω_intertype_197 = function() {
        return new Intertype({
          foo: {
            test: false
          }
        });
      }), /expected type name, method, or object to indicate test method, got a boolean/);
      throws((Ω_intertype_198 = function() {
        return new Intertype({
          foo: {
            test: (function(a, b) {})
          }
        });
      }), /expected function with 1 parameters, got one with 2/);
      throws((Ω_intertype_199 = function() {
        return new Intertype({
          foo: 'quux'
        });
      }), /unknown type 'quux'/);
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    allow_declaration_objects: function() {
      var Intertype_minimal;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, types, Ω_intertype_200, Ω_intertype_201, Ω_intertype_202, Ω_intertype_203;
        declarations = {...sample_declarations};
        declarations.integer = {
          test: function(x) {
            return Number.isInteger(x);
          },
          template: 0
        };
        types = new Intertype_minimal(declarations);
        eq((Ω_intertype_200 = function() {
          return TMP_types.isa.function(types.isa.integer);
        }), true);
        eq((Ω_intertype_201 = function() {
          return types.isa.integer.length;
        }), 1);
        eq((Ω_intertype_202 = function() {
          return types.isa.integer(123);
        }), true);
        eq((Ω_intertype_203 = function() {
          return types.isa.integer(123.456);
        }), false);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    create_entries_must_be_sync_functions: function() {
      var Intertype_minimal;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, Ω_intertype_204;
        declarations = {...sample_declarations};
        declarations.integer = {
          test: function(x) {
            return Number.isInteger(x);
          },
          create: async function() {
            return (await 0);
          }
        };
        throws((Ω_intertype_204 = function() {
          return new Intertype_minimal(declarations);
        }), /expected a function for `create` entry of type 'integer', got a asyncfunction/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    template_methods_must_be_nullary: function() {
      var Intertype_minimal;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, Ω_intertype_205;
        declarations = {...sample_declarations};
        declarations.foolist = {
          test: function(x) {
            return true;
          },
          template: function(n) {
            return [n];
          }
        };
        throws((Ω_intertype_205 = function() {
          return new Intertype_minimal(declarations);
        }), /template method for type 'foolist' has arity 1 but must be nullary/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    intertype_knows_its_base_types: function() {
      var isa, Ω_intertype_206, Ω_intertype_207, Ω_intertype_208, Ω_intertype_209, Ω_intertype_210, Ω_intertype_211, Ω_intertype_212, Ω_intertype_213, Ω_intertype_214, Ω_intertype_215, Ω_intertype_216, Ω_intertype_217, Ω_intertype_218, Ω_intertype_219, Ω_intertype_220;
      ({isa} = require('../../../apps/intertype'));
      //.........................................................................................................
      eq((Ω_intertype_206 = function() {
        return isa.basetype('optional');
      }), false);
      eq((Ω_intertype_207 = function() {
        return isa.basetype('anything');
      }), true);
      eq((Ω_intertype_208 = function() {
        return isa.basetype('nothing');
      }), true);
      eq((Ω_intertype_209 = function() {
        return isa.basetype('something');
      }), true);
      eq((Ω_intertype_210 = function() {
        return isa.basetype('null');
      }), true);
      eq((Ω_intertype_211 = function() {
        return isa.basetype('undefined');
      }), true);
      eq((Ω_intertype_212 = function() {
        return isa.basetype('unknown');
      }), true);
      eq((Ω_intertype_213 = function() {
        return isa.basetype('integer');
      }), false);
      eq((Ω_intertype_214 = function() {
        return isa.basetype('float');
      }), false);
      eq((Ω_intertype_215 = function() {
        return isa.basetype('basetype');
      }), false);
      eq((Ω_intertype_216 = function() {
        return isa.basetype('quux');
      }), false);
      eq((Ω_intertype_217 = function() {
        return isa.basetype('toString');
      }), false);
      eq((Ω_intertype_218 = function() {
        return isa.basetype(null);
      }), false);
      eq((Ω_intertype_219 = function() {
        return isa.basetype(void 0);
      }), false);
      eq((Ω_intertype_220 = function() {
        return isa.basetype(4);
      }), false);
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    disallow_licensed_overrides: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var overrides, types, Ω_intertype_221, Ω_intertype_222, Ω_intertype_223, Ω_intertype_224;
        types = new Intertype();
        eq((Ω_intertype_221 = function() {
          return types.isa.float(4);
        }), true);
        //.......................................................................................................
        overrides = {
          float: {
            test: function(x) {
              return x === 'float';
            }
          }
        };
        throws((Ω_intertype_222 = function() {
          return types.declare(overrides);
        }), /not allowed to re-declare type 'float'/);
        //.......................................................................................................
        /* pre-existing declaration remains valid: */
        eq((Ω_intertype_223 = function() {
          return types.isa.float(4);
        }), true);
        eq((Ω_intertype_224 = function() {
          return types.isa.float('float');
        }), false);
        return null;
      })();
      (() => {        //.........................................................................................................
        var overrides, types, Ω_intertype_225, Ω_intertype_226;
        types = new Intertype();
        eq((Ω_intertype_225 = function() {
          return types.isa.float(4);
        }), true);
        //.......................................................................................................
        overrides = {
          float: {
            override: true,
            test: function(x) {
              return x === 'float';
            }
          }
        };
        throws((Ω_intertype_226 = function() {
          return types.declare(overrides);
        }), /not allowed to re-declare type 'float'/);
        return null;
      })();
      (() => {        //.........................................................................................................
        var overrides, types, Ω_intertype_227, Ω_intertype_228, Ω_intertype_229, Ω_intertype_230;
        types = new Intertype();
        eq((Ω_intertype_227 = function() {
          return types.isa.float(4);
        }), true);
        //.......................................................................................................
        overrides = {
          anything: {
            override: true,
            test: function(x) {
              return true;
            }
          }
        };
        throws((Ω_intertype_228 = function() {
          return types.declare(overrides);
        }), /not allowed to re-declare basetype 'anything'/);
        //.......................................................................................................
        /* pre-existing declaration remains valid: */
        eq((Ω_intertype_229 = function() {
          return types.isa.anything(4);
        }), true);
        eq((Ω_intertype_230 = function() {
          return types.isa.anything('float');
        }), true);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    can_create_types_with_templates_and_create: function() {
      var Intertype, Intertype_minimal;
      ({Intertype, Intertype_minimal} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, types, Ω_intertype_231, Ω_intertype_232, Ω_intertype_233, Ω_intertype_234, Ω_intertype_235, Ω_intertype_236, Ω_intertype_237, Ω_intertype_238, Ω_intertype_239, Ω_intertype_240;
        declarations = {...sample_declarations};
        declarations.integer = {
          test: function(x) {
            return Number.isInteger(x);
          },
          template: 0
        };
        declarations.text = {
          template: '',
          test: (function(x) {
            return (typeof x) === 'string';
          })
        };
        declarations.float = {
          test: function(x) {
            return Number.isFinite(x);
          },
          create: function(p = null) {
            return parseFloat(p != null ? p : this.declarations.float.template);
          },
          template: 0
        };
        declarations.nan = function(x) {
          return Number.isNaN(x);
        };
        //.......................................................................................................
        types = new Intertype_minimal(declarations);
        eq((Ω_intertype_231 = function() {
          return TMP_types.isa.object(types.declarations);
        }), true);
        eq((Ω_intertype_232 = function() {
          return TMP_types.isa.object(types.declarations.float);
        }), true);
        eq((Ω_intertype_233 = function() {
          return TMP_types.isa.object(types.declarations.text);
        }), true);
        //.......................................................................................................
        throws((Ω_intertype_234 = function() {
          return types.create.boolean();
        }), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/);
        throws((Ω_intertype_235 = function() {
          return types.create.text('foo');
        }), /expected 0 arguments, got 1/);
        //.......................................................................................................
        eq((Ω_intertype_236 = function() {
          return types.create.text();
        }), '');
        eq((Ω_intertype_237 = function() {
          return types.create.integer();
        }), 0);
        eq((Ω_intertype_238 = function() {
          return types.create.float();
        }), 0);
        eq((Ω_intertype_239 = function() {
          return types.create.float('123.45');
        }), 123.45);
        throws((Ω_intertype_240 = function() {
          return types.create.float('***');
        }), /expected `create\.float\(\)` to return a float but it returned a nan/);
        //.......................................................................................................
        return null;
      })();
      (() => {        //.........................................................................................................
        var create, declarations, isa, validate, Ω_intertype_241;
        declarations = {
          quantity: {
            test: 'object',
            template: {
              q: 0,
              u: 'u'
            }
          },
          'quantity.q': 'float',
          'quantity.u': 'text'
        };
        ({isa, validate, create} = new Intertype(declarations));
        eq((Ω_intertype_241 = function() {
          return create.quantity();
        }), {
          q: 0,
          u: 'u'
        });
        return null;
      })();
      (() => {        //.........................................................................................................
        var create, declarations, isa, validate, Ω_intertype_242, Ω_intertype_243, Ω_intertype_244, Ω_intertype_245;
        declarations = {
          quantity: {
            test: 'object',
            template: {
              q: 0,
              u: 'u'
            },
            fields: {
              q: 'float',
              u: 'text'
            }
          }
        };
        ({isa, validate, create} = new Intertype(declarations));
        eq((Ω_intertype_242 = function() {
          return create.quantity();
        }), {
          q: 0,
          u: 'u'
        });
        eq((Ω_intertype_243 = function() {
          return create.quantity({
            q: 123
          });
        }), {
          q: 123,
          u: 'u'
        });
        eq((Ω_intertype_244 = function() {
          return create.quantity({
            u: 'kg'
          });
        }), {
          q: 0,
          u: 'kg'
        });
        eq((Ω_intertype_245 = function() {
          return create.quantity({
            u: 'kg',
            foo: 'bar'
          });
        }), {
          q: 0,
          u: 'kg',
          foo: 'bar'
        });
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    builtin_types_support_create: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var create, type_of, types, Ω_intertype_246, Ω_intertype_247, Ω_intertype_248, Ω_intertype_249, Ω_intertype_250, Ω_intertype_251, Ω_intertype_252, Ω_intertype_253, Ω_intertype_254, Ω_intertype_255, Ω_intertype_256, Ω_intertype_257;
        types = new Intertype();
        ({create, type_of} = types);
        eq((Ω_intertype_246 = function() {
          return create.float();
        }), 0);
        eq((Ω_intertype_247 = function() {
          return create.boolean();
        }), false);
        eq((Ω_intertype_248 = function() {
          return create.object();
        }), {});
        eq((Ω_intertype_249 = function() {
          return create.float();
        }), 0);
        eq((Ω_intertype_250 = function() {
          return create.infinity();
        }), 2e308);
        eq((Ω_intertype_251 = function() {
          return create.text();
        }), '');
        eq((Ω_intertype_252 = function() {
          return create.list();
        }), []);
        eq((Ω_intertype_253 = function() {
          return create.regex();
        }), new RegExp());
        eq((Ω_intertype_254 = function() {
          return type_of(create.function());
        }), 'function');
        eq((Ω_intertype_255 = function() {
          return type_of(create.asyncfunction());
        }), 'asyncfunction');
        eq((Ω_intertype_256 = function() {
          return type_of(create.symbol());
        }), 'symbol');
        throws((Ω_intertype_257 = function() {
          return create.basetype();
        }), /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    template_functions_are_called_in_template_fields: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var create, declarations, declare, isa, type_of, types, Ω_intertype_258, Ω_intertype_259, Ω_intertype_260, Ω_intertype_261;
        types = new Intertype();
        ({declare, create, isa, type_of, declarations} = types);
        declare({
          quantity: {
            test: 'object',
            fields: {
              q: 'float',
              u: 'text'
            },
            template: {
              q: function() {
                return this.create.float();
              },
              u: function() {
                return 'u';
              }
            }
          }
        });
        debug('^3234^', create.quantity());
        debug('^3234^', declarations.quantity);
        eq((Ω_intertype_258 = function() {
          return create.quantity();
        }), {
          q: 0,
          u: 'u'
        });
        eq((Ω_intertype_259 = function() {
          return isa.quantity({
            q: 9
          });
        }), false);
        eq((Ω_intertype_260 = function() {
          return type_of(declarations.quantity.sub_tests.q);
        }), 'function');
        eq((Ω_intertype_261 = function() {
          return type_of(declarations.quantity.sub_tests.u);
        }), 'function');
        return null;
      })();
      (() => {        //.........................................................................................................
        var create, declare, type_of, types, Ω_intertype_262;
        types = new Intertype();
        ({declare, create, type_of} = types);
        declare({
          foo: {
            test: 'object',
            fields: {
              foo: {
                test: 'object',
                fields: {
                  bar: {
                    test: 'float'
                  }
                }
              }
            },
            template: {
              foo: {
                bar: 123
              }
            }
          }
        });
        debug('^3234^', create.foo());
        eq((Ω_intertype_262 = function() {
          return create.foo();
        }), {
          foo: {
            bar: 123
          }
        });
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    type_object_assumed_if_fields_present: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var create, declarations, declare, isa, type_of, types, Ω_intertype_263, Ω_intertype_264, Ω_intertype_265, Ω_intertype_266, Ω_intertype_267;
        types = new Intertype();
        ({declare, declarations, create, type_of, isa} = types);
        declare({
          quantity: {
            // test: 'object'
            fields: {
              q: 'float',
              u: 'text'
            }
          }
        });
        eq((Ω_intertype_263 = function() {
          return type_of(declarations.quantity.test);
        }), 'function');
        debug('^342342^', declarations.quantity);
        eq((Ω_intertype_264 = function() {
          return type_of(declarations.quantity.sub_tests.q);
        }), 'function');
        eq((Ω_intertype_265 = function() {
          return type_of(declarations.quantity.sub_tests.u);
        }), 'function');
        eq((Ω_intertype_266 = function() {
          return isa.quantity({
            q: 987,
            u: 's'
          });
        }), true);
        eq((Ω_intertype_267 = function() {
          return isa.quantity({
            q: 987
          });
        }), false);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    intertype_minimal_has_only_base_types: function() {
      var Intertype_minimal, types, Ω_intertype_268, Ω_intertype_269;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      types = new Intertype_minimal();
      eq((Ω_intertype_268 = function() {
        return (Object.keys(types.declarations)).sort();
      }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown']);
      types.declare({
        z: (function(x) {})
      });
      eq((Ω_intertype_269 = function() {
        return (Object.keys(types.declarations)).sort();
      }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z']);
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    can_use_type_name_for_test: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var types, Ω_intertype_270, Ω_intertype_271, Ω_intertype_272, Ω_intertype_273, Ω_intertype_274, Ω_intertype_275, Ω_intertype_276, Ω_intertype_277;
        types = new Intertype();
        throws((Ω_intertype_270 = function() {
          return types.declare({
            z: 'quux'
          });
        }), /unknown type 'quux'/);
        types.declare({
          z: 'float'
        });
        eq((Ω_intertype_271 = function() {
          return types.isa.z(12);
        }), true);
        eq((Ω_intertype_272 = function() {
          return types.isa.float.name;
        }), 'isa.float');
        eq((Ω_intertype_273 = function() {
          return types.declarations.float.type;
        }), 'float');
        eq((Ω_intertype_274 = function() {
          return types.declarations.float.test.name;
        }), 'float');
        eq((Ω_intertype_275 = function() {
          return types.isa.z.name;
        }), 'isa.z');
        eq((Ω_intertype_276 = function() {
          return types.declarations.z.type;
        }), 'z');
        return eq((Ω_intertype_277 = function() {
          return types.declarations.z.test.name;
        }), 'z'); // ?
      })();
      (() => {        //.........................................................................................................
        var types, Ω_intertype_278, Ω_intertype_279, Ω_intertype_280, Ω_intertype_281, Ω_intertype_282, Ω_intertype_283, Ω_intertype_284, Ω_intertype_285;
        types = new Intertype();
        throws((Ω_intertype_278 = function() {
          return types.declare({
            z: {
              test: 'quux'
            }
          });
        }), /unknown type 'quux'/);
        types.declare({
          z: {
            test: 'float'
          }
        });
        eq((Ω_intertype_279 = function() {
          return types.isa.z(12);
        }), true);
        eq((Ω_intertype_280 = function() {
          return types.isa.float.name;
        }), 'isa.float');
        eq((Ω_intertype_281 = function() {
          return types.declarations.float.type;
        }), 'float');
        eq((Ω_intertype_282 = function() {
          return types.declarations.float.test.name;
        }), 'float');
        eq((Ω_intertype_283 = function() {
          return types.isa.z.name;
        }), 'isa.z');
        eq((Ω_intertype_284 = function() {
          return types.declarations.z.type;
        }), 'z');
        return eq((Ω_intertype_285 = function() {
          return types.declarations.z.test.name;
        }), 'z');
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    resolve_dotted_type: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var types, Ω_intertype_286, Ω_intertype_287, Ω_intertype_288, Ω_intertype_289, Ω_intertype_290, Ω_intertype_291, Ω_intertype_292, Ω_intertype_293, Ω_intertype_294;
        types = new Intertype();
        eq((Ω_intertype_286 = function() {
          return Reflect.has(types.declarations, 'foo');
        }), false);
        types.declare({
          foo: 'object'
        });
        eq((Ω_intertype_287 = function() {
          return Reflect.has(types.declarations, 'foo');
        }), true);
        eq((Ω_intertype_288 = function() {
          return Reflect.has(types.declarations, 'foo.bar');
        }), false);
        types.declare({
          'foo.bar': 'object'
        });
        eq((Ω_intertype_289 = function() {
          return Reflect.has(types.declarations, 'foo.bar');
        }), true);
        eq((Ω_intertype_290 = function() {
          return Reflect.has(types.declarations, 'foo.bar.baz');
        }), false);
        types.declare({
          'foo.bar.baz': 'float'
        });
        eq((Ω_intertype_291 = function() {
          return Reflect.has(types.declarations, 'foo.bar.baz');
        }), true);
        eq((Ω_intertype_292 = function() {
          return types.isa.foo.bar.baz(null);
        }), false);
        eq((Ω_intertype_293 = function() {
          return types.isa.foo.bar.baz(4);
        }), true);
        eq((Ω_intertype_294 = function() {
          return types.isa.foo.bar.baz(+2e308);
        }), false);
        // T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
        // types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    dotted_types_are_test_methods: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var types, Ω_intertype_295, Ω_intertype_296, Ω_intertype_297, Ω_intertype_298, Ω_intertype_299, Ω_intertype_300, Ω_intertype_301, Ω_intertype_302, Ω_intertype_303, Ω_intertype_304, Ω_intertype_305, Ω_intertype_306;
        types = new Intertype();
        types.declare({
          quantity: 'object'
        });
        types.declare({
          'quantity.q': 'float'
        });
        types.declare({
          'quantity.u': 'text'
        });
        eq((Ω_intertype_295 = function() {
          return types.isa['quantity.q'];
        }), types.declarations['quantity'].sub_tests['q']);
        eq((Ω_intertype_296 = function() {
          return types.isa['quantity.q'];
        }), types.isa.quantity.q);
        // debug '^409-1^', types.declarations
        eq((Ω_intertype_297 = function() {
          return types.isa.quantity({});
        }), false);
        eq((Ω_intertype_298 = function() {
          return types.isa.quantity({
            q: {}
          });
        }), false);
        eq((Ω_intertype_299 = function() {
          return types.isa.quantity({
            q: 3
          });
        }), false);
        eq((Ω_intertype_300 = function() {
          return types.isa.quantity({
            q: 3,
            u: 'm'
          });
        }), true);
        eq((Ω_intertype_301 = function() {
          return types.isa.quantity.q(3);
        }), true);
        eq((Ω_intertype_302 = function() {
          return types.isa.quantity.q(3.1);
        }), true);
        eq((Ω_intertype_303 = function() {
          return types.isa.quantity.q('3.1');
        }), false);
        eq((Ω_intertype_304 = function() {
          return types.isa.quantity.u('m');
        }), true);
        eq((Ω_intertype_305 = function() {
          return types.isa.quantity.u(null);
        }), false);
        eq((Ω_intertype_306 = function() {
          return types.isa.quantity.u(3);
        }), false);
        debug('^433-1^', types.declarations['quantity']);
        debug('^433-1^', types.declarations['quantity.q']);
        debug('^433-1^', types.declarations['quantity.u']);
        return null;
      })();
      (() => {        //.........................................................................................................
        var f, k, types, Ω_intertype_307, Ω_intertype_308, Ω_intertype_309, Ω_intertype_310, Ω_intertype_311, Ω_intertype_312, Ω_intertype_313, Ω_intertype_314, Ω_intertype_315, Ω_intertype_316, Ω_intertype_317, Ω_intertype_318, Ω_intertype_319, Ω_intertype_320, Ω_intertype_321, Ω_intertype_322, Ω_intertype_323;
        types = new Intertype();
        types.declare({
          'person': 'object'
        });
        types.declare({
          'person.name': 'text'
        });
        types.declare({
          'person.address': 'object'
        });
        types.declare({
          'person.address.city': 'object'
        });
        types.declare({
          'person.address.city.name': 'text'
        });
        types.declare({
          'person.address.city.postcode': 'text'
        });
        // T?.eq types.isa[ 'quantity.q' ], types.declarations[ 'quantity' ].sub_tests[ 'q' ]
        // T?.eq types.isa[ 'quantity.q' ], types.isa.quantity.q
        eq((Ω_intertype_307 = function() {
          return types.isa.person.address.city.name('P');
        }), true);
        eq((Ω_intertype_308 = function() {
          return types.isa.person.address.city.name(1234);
        }), false);
        eq((Ω_intertype_309 = function() {
          return types.isa.person(1234);
        }), false);
        eq((Ω_intertype_310 = function() {
          return types.isa.person({
            name: 'Bob'
          });
        }), false);
        eq((Ω_intertype_311 = function() {
          return types.isa.person({
            name: 'Bob',
            address: {}
          });
        }), false);
        eq((Ω_intertype_312 = function() {
          return types.isa.person({
            name: 'Bob',
            address: {
              city: {}
            }
          });
        }), false);
        eq((Ω_intertype_313 = function() {
          return types.isa.person({
            name: 'Bob',
            address: {
              city: {
                name: 'P'
              }
            }
          });
        }), false);
        eq((Ω_intertype_314 = function() {
          return types.isa.person({
            name: 'Bob',
            address: {
              city: {
                name: 'P',
                postcode: 'SO36'
              }
            }
          });
        }), true);
        eq((Ω_intertype_315 = function() {
          return types.isa.person.address.city.name('P');
        }), true);
        eq((Ω_intertype_316 = function() {
          return types.isa.person.address.city.postcode('SO36');
        }), true);
        eq((Ω_intertype_317 = function() {
          return types.isa.person.address.city({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        eq((Ω_intertype_318 = function() {
          return types.isa.person.address({
            city: {
              name: 'P',
              postcode: 'SO36'
            }
          });
        }), true);
        help('^322-1^', (function() {
          var ref, results;
          ref = types.declarations['person'].sub_tests;
          results = [];
          for (k in ref) {
            f = ref[k];
            results.push({
              [`${k}`]: f.name
            });
          }
          return results;
        })());
        help('^322-2^', (function() {
          var ref, results;
          ref = types.declarations['person.address'].sub_tests;
          results = [];
          for (k in ref) {
            f = ref[k];
            results.push({
              [`${k}`]: f.name
            });
          }
          return results;
        })());
        help('^322-3^', (function() {
          var ref, results;
          ref = types.declarations['person.address.city'].sub_tests;
          results = [];
          for (k in ref) {
            f = ref[k];
            results.push({
              [`${k}`]: f.name
            });
          }
          return results;
        })());
        eq((Ω_intertype_319 = function() {
          return Object.keys(types.declarations['person'].sub_tests);
        }), ['name', 'address']);
        eq((Ω_intertype_320 = function() {
          return Object.keys(types.declarations['person.address'].sub_tests);
        }), ['city']);
        eq((Ω_intertype_321 = function() {
          return Object.keys(types.declarations['person.address.city'].sub_tests);
        }), ['name', 'postcode']);
        eq((Ω_intertype_322 = function() {
          return types.declarations['person'].sub_tests !== types.declarations['person.address'].sub_tests;
        }), true);
        eq((Ω_intertype_323 = function() {
          return types.declarations['person'].sub_tests !== types.declarations['person.address.city'].sub_tests;
        }), true);
        return null;
      })();
      (() => {        //.........................................................................................................
        var types;
        types = new Intertype();
        types.declare({
          'foo': 'float'
        });
        types.declare({
          'foo.bar': 'text'
        });
        (() => {
          var d, Ω_intertype_324;
          d = 3;
          // d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
          eq((Ω_intertype_324 = function() {
            return types.isa.foo(d);
          }), false);
          return null;
        })();
        (() => {
          var d, Ω_intertype_325, Ω_intertype_326;
          d = new Number(3);
          d.bar = '?';
          eq((Ω_intertype_325 = function() {
            return d.bar;
          }), '?');
          // still won't work b/c `float` doesn't accept objects (which is a good thing):
          eq((Ω_intertype_326 = function() {
            return types.isa.foo(d);
          }), false);
          return null;
        })();
        return null;
      })();
      (() => {        //.........................................................................................................
        var types, Ω_intertype_327, Ω_intertype_328;
        types = new Intertype();
        types.declare({
          'foo': 'object'
        });
        types.declare({
          'foo.bind': 'float'
        });
        types.declare({
          'foo.apply': 'float'
        });
        types.declare({
          'foo.call': 'float'
        });
        types.declare({
          'foo.name': 'float'
        });
        types.declare({
          'foo.length': 'float'
        });
        eq((Ω_intertype_327 = function() {
          return types.isa.foo({});
        }), false);
        eq((Ω_intertype_328 = function() {
          return types.isa.foo({
            bind: 1,
            apply: 2,
            call: 3,
            name: 4,
            length: 5
          });
        }), true);
        return null;
      })();
      (() => {        //.........................................................................................................
        var types, Ω_intertype_329, Ω_intertype_330;
        types = new Intertype();
        types.declare({
          'foo': 'object'
        });
        types.declare({
          'foo.text': (function(x) {
            return x === 1;
          })
        });
        types.declare({
          'foo.float': (function(x) {
            return x === 2;
          })
        });
        eq((Ω_intertype_329 = function() {
          return types.isa.foo({});
        }), false);
        eq((Ω_intertype_330 = function() {
          return types.isa.foo({
            text: 1,
            float: 2
          });
        }), true);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    can_use_refs_to_dotted_types: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var types, Ω_intertype_331, Ω_intertype_332, Ω_intertype_333, Ω_intertype_334, Ω_intertype_335, Ω_intertype_336;
        types = new Intertype();
        types.declare({
          'person': 'object'
        });
        types.declare({
          'person.name': 'text'
        });
        types.declare({
          'person.address': 'object'
        });
        types.declare({
          'person.address.city': 'object'
        });
        types.declare({
          'person.address.city.name': 'text'
        });
        types.declare({
          'person.address.city.postcode': 'text'
        });
        types.declare({
          'mycity': (function(x) {
            return this.isa.person.address.city(x);
          })
        });
        // debug '^434-1^', types.declarations[ 'person.address.city' ]
        // debug '^434-2^', types.declarations.mycity
        urge('^342-1^', types.declarations.mycity);
        eq((Ω_intertype_331 = function() {
          return types.isa.person.address.city({});
        }), false);
        eq((Ω_intertype_332 = function() {
          return types.isa.person.address.city(null);
        }), false);
        eq((Ω_intertype_333 = function() {
          return types.isa.person.address.city({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        eq((Ω_intertype_334 = function() {
          return types.isa.mycity({});
        }), false);
        eq((Ω_intertype_335 = function() {
          return types.isa.mycity(null);
        }), false);
        eq((Ω_intertype_336 = function() {
          return types.isa.mycity({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        return null;
      })();
      (() => {        //.........................................................................................................
        var types, Ω_intertype_337, Ω_intertype_338, Ω_intertype_339, Ω_intertype_340, Ω_intertype_341, Ω_intertype_342;
        types = new Intertype();
        types.declare({
          'person': 'object'
        });
        types.declare({
          'person.name': 'text'
        });
        types.declare({
          'person.address': 'object'
        });
        types.declare({
          'person.address.city': 'object'
        });
        types.declare({
          'person.address.city.name': 'text'
        });
        types.declare({
          'person.address.city.postcode': 'text'
        });
        types.declare({
          'mycity': 'person.address.city'
        });
        // debug '^434-3^', types.declarations[ 'person.address.city' ]
        // debug '^434-4^', types.declarations.mycity
        urge('^342-2^', types.declarations.mycity);
        eq((Ω_intertype_337 = function() {
          return types.isa.person.address.city({});
        }), false);
        eq((Ω_intertype_338 = function() {
          return types.isa.person.address.city(null);
        }), false);
        eq((Ω_intertype_339 = function() {
          return types.isa.person.address.city({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        eq((Ω_intertype_340 = function() {
          return types.isa.mycity({});
        }), false);
        eq((Ω_intertype_341 = function() {
          return types.isa.mycity(null);
        }), false);
        eq((Ω_intertype_342 = function() {
          return types.isa.mycity({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        return null;
      })();
      (() => {        //.........................................................................................................
        var types, Ω_intertype_343, Ω_intertype_344, Ω_intertype_345, Ω_intertype_346, Ω_intertype_347, Ω_intertype_348, Ω_intertype_349, Ω_intertype_350, Ω_intertype_351;
        types = new Intertype();
        types.declare({
          'person': 'object'
        });
        types.declare({
          'person.name': 'text'
        });
        types.declare({
          'person.address': 'object'
        });
        types.declare({
          'person.address.city': 'object'
        });
        types.declare({
          'person.address.city.name': 'text'
        });
        types.declare({
          'person.address.city.postcode': 'text'
        });
        types.declare({
          'mycity': (function(x) {
            return this.isa.optional.person.address.city(x);
          })
        });
        // debug '^434-5^', types.declarations[ 'person.address.city' ]
        // debug '^434-6^', types.declarations.mycity
        urge('^342-3^', types.declarations.mycity);
        eq((Ω_intertype_343 = function() {
          return types.isa.person.address.city({});
        }), false);
        eq((Ω_intertype_344 = function() {
          return types.isa.person.address.city(null);
        }), false);
        eq((Ω_intertype_345 = function() {
          return types.isa.person.address.city({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        eq((Ω_intertype_346 = function() {
          return types.isa.optional.person.address.city({});
        }), false);
        eq((Ω_intertype_347 = function() {
          return types.isa.optional.person.address.city(null);
        }), true);
        eq((Ω_intertype_348 = function() {
          return types.isa.optional.person.address.city({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        eq((Ω_intertype_349 = function() {
          return types.isa.mycity({});
        }), false);
        eq((Ω_intertype_350 = function() {
          return types.isa.mycity(null);
        }), true);
        eq((Ω_intertype_351 = function() {
          return types.isa.mycity({
            name: 'P',
            postcode: 'SO36'
          });
        }), true);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    forbidden_to_define_fields_on_basetypes: async function() {
      var Intertype, declarations;
      ({Intertype, declarations} = require('../../../apps/intertype'));
      await (() => {        //.........................................................................................................
        var declare, isa, types, validate, Ω_intertype_352, Ω_intertype_353, Ω_intertype_354, Ω_intertype_355, Ω_intertype_356, Ω_intertype_357, Ω_intertype_358;
        types = new Intertype();
        ({declare, validate, isa} = types);
        throws((Ω_intertype_352 = function() {
          return types.declare({
            'optional.d': (function(x) {})
          });
        }), /illegal use of 'optional' in declaration of type 'optional.d'/);
        throws((Ω_intertype_353 = function() {
          return types.declare({
            'anything.d': (function(x) {})
          });
        }), /illegal use of basetype 'anything' in declaration of type 'anything.d'/);
        throws((Ω_intertype_354 = function() {
          return types.declare({
            'nothing.d': (function(x) {})
          });
        }), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/);
        throws((Ω_intertype_355 = function() {
          return types.declare({
            'something.d': (function(x) {})
          });
        }), /illegal use of basetype 'something' in declaration of type 'something.d'/);
        throws((Ω_intertype_356 = function() {
          return types.declare({
            'null.d': (function(x) {})
          });
        }), /illegal use of basetype 'null' in declaration of type 'null.d'/);
        throws((Ω_intertype_357 = function() {
          return types.declare({
            'undefined.d': (function(x) {})
          });
        }), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/);
        throws((Ω_intertype_358 = function() {
          return types.declare({
            'unknown.d': (function(x) {})
          });
        }), /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    internal_type_of_method: function() {
      var Intertype, __type_of, _isa, declaration, declarations, type;
      ({Intertype, declarations, __type_of} = require('../../../apps/intertype'));
      //.........................................................................................................
      _isa = Object.fromEntries((function() {
        var results;
        results = [];
        for (type in declarations) {
          declaration = declarations[type];
          results.push([type, declaration.test]);
        }
        return results;
      })());
      (() => {        //.........................................................................................................
        var types, Ω_intertype_359, Ω_intertype_360, Ω_intertype_361, Ω_intertype_362, Ω_intertype_363, Ω_intertype_364, Ω_intertype_365, Ω_intertype_366, Ω_intertype_367;
        types = new Intertype();
        eq((Ω_intertype_359 = function() {
          return __type_of(_isa, null);
        }), 'null');
        eq((Ω_intertype_360 = function() {
          return __type_of(_isa, void 0);
        }), 'undefined');
        eq((Ω_intertype_361 = function() {
          return __type_of(_isa, 4);
        }), 'float');
        eq((Ω_intertype_362 = function() {
          return __type_of(_isa, function() {});
        }), 'function');
        eq((Ω_intertype_363 = function() {
          return __type_of(_isa, async function() {
            return (await null);
          });
        }), 'asyncfunction');
        eq((Ω_intertype_364 = function() {
          return __type_of(_isa, {});
        }), 'object');
        eq((Ω_intertype_365 = function() {
          return __type_of(_isa, []);
        }), 'list');
        eq((Ω_intertype_366 = function() {
          return __type_of(_isa, +2e308);
        }), 'infinity');
        eq((Ω_intertype_367 = function() {
          return __type_of(_isa, -2e308);
        }), 'infinity');
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    deepmerge: function() {
      var Intertype, declarations, deepmerge;
      ({Intertype, declarations, deepmerge} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var probe, result, sub, Ω_intertype_368, Ω_intertype_369, Ω_intertype_370, Ω_intertype_371, Ω_intertype_372, Ω_intertype_373;
        sub = {
          foo: 3
        };
        probe = {
          bar: {
            baz: {
              sub: sub
            }
          },
          gnu: 4
        };
        result = deepmerge(probe);
        eq((Ω_intertype_368 = function() {
          return result;
        }), probe);
        eq((Ω_intertype_369 = function() {
          return result.bar === probe.bar;
        }), false);
        eq((Ω_intertype_370 = function() {
          return result.bar.baz === probe.bar.baz;
        }), false);
        eq((Ω_intertype_371 = function() {
          return result.bar.baz.sub === probe.bar.baz.sub;
        }), false);
        eq((Ω_intertype_372 = function() {
          return result.bar.baz.sub === sub;
        }), false);
        eq((Ω_intertype_373 = function() {
          return probe.bar.baz.sub === sub;
        }), true);
        return null;
      })();
      (() => {        //.........................................................................................................
        var probe, result, sub, types, Ω_intertype_374, Ω_intertype_375, Ω_intertype_376, Ω_intertype_377, Ω_intertype_378, Ω_intertype_379;
        sub = {
          foo: 3
        };
        probe = {
          bar: {
            baz: {
              sub: sub
            }
          },
          gnu: 4
        };
        types = new Intertype({
          q: {
            test: 'object',
            template: probe
          }
        });
        result = types.create.q();
        eq((Ω_intertype_374 = function() {
          return result;
        }), probe);
        eq((Ω_intertype_375 = function() {
          return result.bar === probe.bar;
        }), false);
        eq((Ω_intertype_376 = function() {
          return result.bar.baz === probe.bar.baz;
        }), false);
        eq((Ω_intertype_377 = function() {
          return result.bar.baz.sub === probe.bar.baz.sub;
        }), false);
        eq((Ω_intertype_378 = function() {
          return result.bar.baz.sub === sub;
        }), false);
        eq((Ω_intertype_379 = function() {
          return probe.bar.baz.sub === sub;
        }), true);
        return null;
      })();
      (() => {        //.........................................................................................................
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    validate_dotted_types: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var types, validate, Ω_intertype_380, Ω_intertype_381, Ω_intertype_382, Ω_intertype_383, Ω_intertype_384, Ω_intertype_385, Ω_intertype_386, Ω_intertype_387, Ω_intertype_388, Ω_intertype_389, Ω_intertype_390, Ω_intertype_391, Ω_intertype_392, Ω_intertype_393, Ω_intertype_394;
        types = new Intertype();
        ({validate} = types);
        types.declare({
          'person': 'object'
        });
        types.declare({
          'person.name': 'text'
        });
        types.declare({
          'person.address': 'object'
        });
        types.declare({
          'person.address.city': 'object'
        });
        types.declare({
          'person.address.city.name': 'text'
        });
        types.declare({
          'person.address.city.postcode': 'text'
        });
        //.......................................................................................................
        throws((Ω_intertype_380 = function() {
          return validate.person(null);
        }), /expected a person, got a null/);
        throws((Ω_intertype_381 = function() {
          return validate.person.address(null);
        }), /expected a person.address, got a null/);
        throws((Ω_intertype_382 = function() {
          return validate.person.address.city(null);
        }), /expected a person.address.city, got a null/);
        throws((Ω_intertype_383 = function() {
          return validate.person.address.city.postcode(null);
        }), /expected a person.address.city.postcode, got a null/);
        //.......................................................................................................
        eq((Ω_intertype_384 = function() {
          return types.isa.person.address.city.postcode(3);
        }), false);
        throws((Ω_intertype_385 = function() {
          return validate.person.address.city.postcode(3);
        }), /expected a person.address.city.postcode/);
        //.......................................................................................................
        eq((Ω_intertype_386 = function() {
          return types.isa.person.address.city({
            name: 'P'
          });
        }), false);
        throws((Ω_intertype_387 = function() {
          return validate.person.address.city({
            name: 'P'
          });
        }), /expected a person.address.city/);
        // #.......................................................................................................
        eq((Ω_intertype_388 = function() {
          return types.isa.person.address.city({
            postcode: '3421'
          });
        }), false);
        throws((Ω_intertype_389 = function() {
          return validate.person.address.city();
        }), /method 'validate.person.address.city' expects 1 arguments, got 0/);
        throws((Ω_intertype_390 = function() {
          return validate.person.address.city(null);
        }), /expected a person.address.city/);
        throws((Ω_intertype_391 = function() {
          return validate.person.address.city('3421');
        }), /expected a person.address.city/);
        throws((Ω_intertype_392 = function() {
          return validate.person.address.city({
            postcode: '3421'
          });
        }), /expected a person.address.city/);
        //.......................................................................................................
        eq((Ω_intertype_393 = function() {
          return types.isa.person.address.city({
            name: 'P',
            postcode: '3421'
          });
        }), true);
        eq((Ω_intertype_394 = function() {
          return validate.person.address.city({
            name: 'P',
            postcode: '3421'
          });
        }), {
          name: 'P',
          postcode: '3421'
        });
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    use_evaluate: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var evaluate, isa, types, validate, Ω_intertype_395, Ω_intertype_396, Ω_intertype_397, Ω_intertype_398, Ω_intertype_399, Ω_intertype_400, Ω_intertype_401, Ω_intertype_402, Ω_intertype_403, Ω_intertype_404, Ω_intertype_405, Ω_intertype_406, Ω_intertype_407, Ω_intertype_408;
        types = new Intertype();
        ({validate, isa, evaluate} = types);
        types.declare({
          'person': 'object'
        });
        types.declare({
          'person.name': 'text'
        });
        types.declare({
          'person.address': 'object'
        });
        types.declare({
          'person.address.city': 'object'
        });
        types.declare({
          'person.address.city.name': 'text'
        });
        types.declare({
          'person.address.city.postcode': 'text'
        });
        //.......................................................................................................
        throws((Ω_intertype_395 = function() {
          return evaluate.optional(1);
        }), /`optional` is not a legal type for `evaluate` methods/);
        throws((Ω_intertype_396 = function() {
          return evaluate.optional.person(1);
        }), /`optional` is not a legal type for `evaluate` methods/);
        //.......................................................................................................
        eq((Ω_intertype_397 = function() {
          return isa.person({
            name: 'Alice',
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), true);
        eq((Ω_intertype_398 = function() {
          return evaluate.person({
            name: 'Alice',
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), {
          person: true,
          'person.name': true,
          'person.address': true,
          'person.address.city': true,
          'person.address.city.name': true,
          'person.address.city.postcode': true
        });
        //.......................................................................................................
        eq((Ω_intertype_399 = function() {
          return isa.person({
            name: 'Alice',
            address: {
              city: {
                name: 'Atown',
                postcode: 12345678
              }
            }
          });
        }), false);
        eq((Ω_intertype_400 = function() {
          return evaluate.person({
            name: 'Alice',
            address: {
              city: {
                name: 'Atown',
                postcode: 12345678
              }
            }
          });
        }), {
          person: false,
          'person.name': true,
          'person.address': false,
          'person.address.city': false,
          'person.address.city.name': true,
          'person.address.city.postcode': false
        });
        //.......................................................................................................
        eq((Ω_intertype_401 = function() {
          return isa.person({
            address: {
              city: {
                name: 'Atown',
                postcode: 12345678
              }
            }
          });
        }), false);
        eq((Ω_intertype_402 = function() {
          return evaluate.person({
            address: {
              city: {
                name: 'Atown',
                postcode: 12345678
              }
            }
          });
        }), {
          person: false,
          'person.name': false,
          'person.address': false,
          'person.address.city': false,
          'person.address.city.name': true,
          'person.address.city.postcode': false
        });
        //.......................................................................................................
        eq((Ω_intertype_403 = function() {
          return isa.person({
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), false);
        eq((Ω_intertype_404 = function() {
          return evaluate.person({
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), {
          person: false,
          'person.name': false,
          'person.address': true,
          'person.address.city': true,
          'person.address.city.name': true,
          'person.address.city.postcode': true
        });
        //.......................................................................................................
        eq((Ω_intertype_405 = function() {
          return isa.person(null);
        }), false);
        eq((Ω_intertype_406 = function() {
          return evaluate.person(null);
        }), {
          person: false,
          'person.name': false,
          'person.address': false,
          'person.address.city': false,
          'person.address.city.name': false,
          'person.address.city.postcode': false
        });
        //.......................................................................................................
        eq((Ω_intertype_407 = function() {
          return isa.person({});
        }), false);
        eq((Ω_intertype_408 = function() {
          return evaluate.person({});
        }), {
          person: false,
          'person.name': false,
          'person.address': false,
          'person.address.city': false,
          'person.address.city.name': false,
          'person.address.city.postcode': false
        });
        return null;
      })();
      (() => {        //.........................................................................................................
        var evaluate, isa, types, validate, Ω_intertype_409, Ω_intertype_410, Ω_intertype_411, Ω_intertype_412, Ω_intertype_413, Ω_intertype_414, Ω_intertype_415, Ω_intertype_416, Ω_intertype_417, Ω_intertype_418, Ω_intertype_419, Ω_intertype_420, Ω_intertype_421, Ω_intertype_422, Ω_intertype_423;
        types = new Intertype();
        ({validate, isa, evaluate} = types);
        types.declare({
          'person': 'object'
        });
        types.declare({
          'person.address': 'object'
        });
        types.declare({
          'person.address.city': 'object'
        });
        types.declare({
          'person.address.city.postcode': 'text'
        });
        types.declare({
          'person.address.city.name': 'text'
        });
        types.declare({
          'person.name': 'text'
        });
        //.......................................................................................................
        eq((Ω_intertype_409 = function() {
          return isa.person({
            name: 'Alice',
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), true);
        eq((Ω_intertype_410 = function() {
          return evaluate.person({
            name: 'Alice',
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), {
          person: true,
          'person.name': true,
          'person.address': true,
          'person.address.city': true,
          'person.address.city.name': true,
          'person.address.city.postcode': true
        });
        eq((Ω_intertype_411 = function() {
          return Object.keys(evaluate.person({
            name: 'Alice',
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          }));
        }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
        //.......................................................................................................
        eq((Ω_intertype_412 = function() {
          return isa.person({
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), false);
        eq((Ω_intertype_413 = function() {
          return evaluate.person({
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          });
        }), {
          person: false,
          'person.name': false,
          'person.address': true,
          'person.address.city': true,
          'person.address.city.name': true,
          'person.address.city.postcode': true
        });
        eq((Ω_intertype_414 = function() {
          return Object.keys(evaluate.person({
            address: {
              city: {
                name: 'Atown',
                postcode: 'VA1234'
              }
            }
          }));
        }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
        //.......................................................................................................
        eq((Ω_intertype_415 = function() {
          return isa.person(null);
        }), false);
        eq((Ω_intertype_416 = function() {
          return evaluate.person(null);
        }), {
          person: false,
          'person.name': false,
          'person.address': false,
          'person.address.city': false,
          'person.address.city.name': false,
          'person.address.city.postcode': false
        });
        eq((Ω_intertype_417 = function() {
          return Object.keys(evaluate.person(null));
        }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
        //.......................................................................................................
        eq((Ω_intertype_418 = function() {
          return isa.person({});
        }), false);
        eq((Ω_intertype_419 = function() {
          return evaluate.person({});
        }), {
          person: false,
          'person.name': false,
          'person.address': false,
          'person.address.city': false,
          'person.address.city.name': false,
          'person.address.city.postcode': false
        });
        eq((Ω_intertype_420 = function() {
          return Object.keys(evaluate.person({}));
        }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
        //.......................................................................................................
        eq((Ω_intertype_421 = function() {
          return isa.person.address({
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          });
        }), true);
        eq((Ω_intertype_422 = function() {
          return evaluate.person.address({
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          });
        }), {
          'person.address': true,
          'person.address.city': true,
          'person.address.city.name': true,
          'person.address.city.postcode': true
        });
        eq((Ω_intertype_423 = function() {
          return Object.keys(evaluate.person.address({
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }));
        }), ['person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name']);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    walk_prefixes: function() {
      var isa, type_of, walk_prefixes;
      ({walk_prefixes, isa, type_of} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var Ω_intertype_424, Ω_intertype_425, Ω_intertype_426, Ω_intertype_427, Ω_intertype_428, Ω_intertype_429;
        eq((Ω_intertype_424 = function() {
          return isa.generatorfunction(walk_prefixes);
        }), true);
        eq((Ω_intertype_425 = function() {
          return [...(walk_prefixes('one'))];
        }), []);
        eq((Ω_intertype_426 = function() {
          return [...(walk_prefixes('one.two'))];
        }), ['one']);
        eq((Ω_intertype_427 = function() {
          return [...(walk_prefixes('one.two.three'))];
        }), ['one', 'one.two']);
        eq((Ω_intertype_428 = function() {
          return [...(walk_prefixes('one.two.three.four'))];
        }), ['one', 'one.two', 'one.two.three']);
        /* TAINT should not allow empty namers: */
        eq((Ω_intertype_429 = function() {
          return [...(walk_prefixes('.one.two.three'))];
        }), ['', '.one', '.one.two']);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    can_use_namespaces: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, Ω_intertype_430;
        declarations = {
          'foo.bar': function(x) {
            return x === 'foo.bar';
          },
          'foo.bar.baz': function(x) {
            return x === 'foo.bar.baz';
          }
        };
        throws((Ω_intertype_430 = function() {
          var types;
          return types = new Intertype(declarations);
        }), /unknown partial type 'foo'/);
        return null;
      })();
      (() => {        //.........................................................................................................
        var declarations, types, Ω_intertype_431, Ω_intertype_432, Ω_intertype_433, Ω_intertype_434, Ω_intertype_435, Ω_intertype_436;
        declarations = {
          'quantity': 'object',
          'quantity.q': 'float',
          'quantity.u': 'text'
        };
        types = new Intertype(declarations);
        eq((Ω_intertype_431 = function() {
          return types.isa.quantity({});
        }), false);
        eq((Ω_intertype_432 = function() {
          return types.isa.quantity({
            q: 12,
            u: 'kg'
          });
        }), true);
        eq((Ω_intertype_433 = function() {
          return types.isa['quantity.q'](12);
        }), true);
        eq((Ω_intertype_434 = function() {
          return types.isa['quantity.u']('kg');
        }), true);
        eq((Ω_intertype_435 = function() {
          return types.isa.quantity.q(12);
        }), true);
        eq((Ω_intertype_436 = function() {
          return types.isa.quantity.u('kg');
        }), true);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    can_use_qualifiers: function() {
      var Intertype_minimal;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, isa, types, Ω_intertype_437, Ω_intertype_438, Ω_intertype_439, Ω_intertype_440, Ω_intertype_441, Ω_intertype_442, Ω_intertype_443, Ω_intertype_444, Ω_intertype_445, Ω_intertype_446, Ω_intertype_447, Ω_intertype_448, Ω_intertype_449;
        declarations = {
          'empty': {
            test: 'object',
            role: 'qualifier'
          },
          'nonempty': {
            test: 'object',
            role: 'qualifier'
          },
          'empty.list': function(x) {
            return (this.isa.list(x)) && (x.length === 0);
          },
          'empty.text': function(x) {
            return (this.isa.text(x)) && (x.length === 0);
          },
          'empty.set': function(x) {
            return (this.isa.set(x)) && (x.size === 0);
          },
          'nonempty.list': function(x) {
            return (this.isa.list(x)) && (x.length > 0);
          },
          'nonempty.text': function(x) {
            return (this.isa.text(x)) && (x.length > 0);
          },
          'nonempty.set': function(x) {
            return (this.isa.set(x)) && (x.size > 0);
          }
        };
        types = new Intertype_minimal(sample_declarations, declarations);
        ({isa} = types);
        eq((Ω_intertype_437 = function() {
          return isa.empty.list([]);
        }), true);
        eq((Ω_intertype_438 = function() {
          return isa.empty.list(['A']);
        }), false);
        eq((Ω_intertype_439 = function() {
          return isa.empty.list(4);
        }), false);
        eq((Ω_intertype_440 = function() {
          return isa.nonempty.list([]);
        }), false);
        eq((Ω_intertype_441 = function() {
          return isa.nonempty.list(['A']);
        }), true);
        eq((Ω_intertype_442 = function() {
          return isa.nonempty.list(4);
        }), false);
        eq((Ω_intertype_443 = function() {
          return isa.empty.text('');
        }), true);
        eq((Ω_intertype_444 = function() {
          return isa.empty.text('A');
        }), false);
        eq((Ω_intertype_445 = function() {
          return isa.empty.text(4);
        }), false);
        eq((Ω_intertype_446 = function() {
          return isa.nonempty.text('');
        }), false);
        eq((Ω_intertype_447 = function() {
          return isa.nonempty.text('A');
        }), true);
        eq((Ω_intertype_448 = function() {
          return isa.nonempty.text(4);
        }), false);
        /* this doesn't make a terrible lot of sense: */
        eq((Ω_intertype_449 = function() {
          return isa.empty({
            list: [],
            text: '',
            set: new Set()
          });
        }), false);
        return null;
      })();
      (() => {        //.........................................................................................................
        var declarations, isa, types, validate, Ω_intertype_450, Ω_intertype_451, Ω_intertype_452, Ω_intertype_453, Ω_intertype_454, Ω_intertype_455, Ω_intertype_456, Ω_intertype_457, Ω_intertype_458, Ω_intertype_459, Ω_intertype_460, Ω_intertype_461, Ω_intertype_462, Ω_intertype_463, Ω_intertype_464, Ω_intertype_465, Ω_intertype_466, Ω_intertype_467, Ω_intertype_468, Ω_intertype_469, Ω_intertype_470, Ω_intertype_471, Ω_intertype_472, Ω_intertype_473;
        declarations = {
          'empty': {
            role: 'qualifier'
          },
          'nonempty': {
            role: 'qualifier'
          },
          'empty.list': function(x) {
            return (this.isa.list(x)) && (x.length === 0);
          },
          'empty.text': function(x) {
            return (this.isa.text(x)) && (x.length === 0);
          },
          'empty.set': function(x) {
            return (this.isa.set(x)) && (x.size === 0);
          },
          'nonempty.list': function(x) {
            return (this.isa.list(x)) && (x.length > 0);
          },
          'nonempty.text': function(x) {
            return (this.isa.text(x)) && (x.length > 0);
          },
          'nonempty.set': function(x) {
            return (this.isa.set(x)) && (x.size > 0);
          }
        };
        types = new Intertype_minimal(sample_declarations, declarations);
        ({isa, validate} = types);
        eq((Ω_intertype_450 = function() {
          return isa.empty.list([]);
        }), true);
        eq((Ω_intertype_451 = function() {
          return isa.empty.list(['A']);
        }), false);
        eq((Ω_intertype_452 = function() {
          return isa.empty.list(4);
        }), false);
        eq((Ω_intertype_453 = function() {
          return isa.nonempty.list([]);
        }), false);
        eq((Ω_intertype_454 = function() {
          return isa.nonempty.list(['A']);
        }), true);
        eq((Ω_intertype_455 = function() {
          return isa.nonempty.list(4);
        }), false);
        eq((Ω_intertype_456 = function() {
          return isa.empty.text('');
        }), true);
        eq((Ω_intertype_457 = function() {
          return isa.empty.text('A');
        }), false);
        eq((Ω_intertype_458 = function() {
          return isa.empty.text(4);
        }), false);
        eq((Ω_intertype_459 = function() {
          return isa.nonempty.text('');
        }), false);
        eq((Ω_intertype_460 = function() {
          return isa.nonempty.text('A');
        }), true);
        eq((Ω_intertype_461 = function() {
          return isa.nonempty.text(4);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_462 = function() {
          return isa.empty([]);
        }), true);
        eq((Ω_intertype_463 = function() {
          return isa.empty('');
        }), true);
        eq((Ω_intertype_464 = function() {
          return isa.empty(new Set());
        }), true);
        eq((Ω_intertype_465 = function() {
          return isa.empty([1]);
        }), false);
        eq((Ω_intertype_466 = function() {
          return isa.empty('A');
        }), false);
        eq((Ω_intertype_467 = function() {
          return isa.empty(new Set('abc'));
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_468 = function() {
          return validate.empty([]);
        }), []);
        eq((Ω_intertype_469 = function() {
          return validate.empty('');
        }), '');
        eq((Ω_intertype_470 = function() {
          return validate.empty(new Set());
        }), new Set());
        throws((Ω_intertype_471 = function() {
          return validate.empty([1]);
        }), /expected a empty, got a list/);
        throws((Ω_intertype_472 = function() {
          return validate.empty('A');
        }), /expected a empty, got a text/);
        throws((Ω_intertype_473 = function() {
          return validate.empty(new Set('abc'));
        }), /expected a empty, got a set/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    can_use_optional_with_qualifiers: function() {
      var Intertype_minimal;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, isa, types, validate, Ω_intertype_474, Ω_intertype_475, Ω_intertype_476, Ω_intertype_477, Ω_intertype_478, Ω_intertype_479, Ω_intertype_480, Ω_intertype_481, Ω_intertype_482, Ω_intertype_483, Ω_intertype_484, Ω_intertype_485, Ω_intertype_486, Ω_intertype_487, Ω_intertype_488, Ω_intertype_489, Ω_intertype_490, Ω_intertype_491, Ω_intertype_492, Ω_intertype_493, Ω_intertype_494, Ω_intertype_495, Ω_intertype_496, Ω_intertype_497, Ω_intertype_498, Ω_intertype_499, Ω_intertype_500, Ω_intertype_501, Ω_intertype_502, Ω_intertype_503, Ω_intertype_504, Ω_intertype_505, Ω_intertype_506, Ω_intertype_507, Ω_intertype_508, Ω_intertype_509, Ω_intertype_510;
        declarations = {
          'empty': {
            role: 'qualifier'
          },
          'nonempty': {
            role: 'qualifier'
          },
          'empty.list': function(x) {
            return (this.isa.list(x)) && (x.length === 0);
          },
          'empty.text': function(x) {
            return (this.isa.text(x)) && (x.length === 0);
          },
          'empty.set': function(x) {
            return (this.isa.set(x)) && (x.size === 0);
          },
          'nonempty.list': function(x) {
            return (this.isa.list(x)) && (x.length > 0);
          },
          'nonempty.text': function(x) {
            return (this.isa.text(x)) && (x.length > 0);
          },
          'nonempty.set': function(x) {
            return (this.isa.set(x)) && (x.size > 0);
          }
        };
        types = new Intertype_minimal(sample_declarations, declarations);
        ({isa, validate} = types);
        eq((Ω_intertype_474 = function() {
          return isa.optional.empty.list([]);
        }), true);
        eq((Ω_intertype_475 = function() {
          return isa.optional.empty.list(['A']);
        }), false);
        eq((Ω_intertype_476 = function() {
          return isa.optional.empty.list(4);
        }), false);
        eq((Ω_intertype_477 = function() {
          return isa.optional.nonempty.list([]);
        }), false);
        eq((Ω_intertype_478 = function() {
          return isa.optional.nonempty.list(['A']);
        }), true);
        eq((Ω_intertype_479 = function() {
          return isa.optional.nonempty.list(4);
        }), false);
        eq((Ω_intertype_480 = function() {
          return isa.optional.empty.text('');
        }), true);
        eq((Ω_intertype_481 = function() {
          return isa.optional.empty.text('A');
        }), false);
        eq((Ω_intertype_482 = function() {
          return isa.optional.empty.text(4);
        }), false);
        eq((Ω_intertype_483 = function() {
          return isa.optional.nonempty.text('');
        }), false);
        eq((Ω_intertype_484 = function() {
          return isa.optional.nonempty.text('A');
        }), true);
        eq((Ω_intertype_485 = function() {
          return isa.optional.nonempty.text(4);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_486 = function() {
          return isa.optional.empty([]);
        }), true);
        eq((Ω_intertype_487 = function() {
          return isa.optional.empty('');
        }), true);
        eq((Ω_intertype_488 = function() {
          return isa.optional.empty(new Set());
        }), true);
        eq((Ω_intertype_489 = function() {
          return isa.optional.empty([1]);
        }), false);
        eq((Ω_intertype_490 = function() {
          return isa.optional.empty('A');
        }), false);
        eq((Ω_intertype_491 = function() {
          return isa.optional.empty(new Set('abc'));
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_492 = function() {
          return validate.optional.empty([]);
        }), []);
        eq((Ω_intertype_493 = function() {
          return validate.optional.empty('');
        }), '');
        eq((Ω_intertype_494 = function() {
          return validate.optional.empty(new Set());
        }), new Set());
        eq((Ω_intertype_495 = function() {
          return validate.optional.empty.list([]);
        }), []);
        eq((Ω_intertype_496 = function() {
          return validate.optional.empty.text('');
        }), '');
        eq((Ω_intertype_497 = function() {
          return validate.optional.empty.set(new Set());
        }), new Set());
        throws((Ω_intertype_498 = function() {
          return validate.optional.empty([1]);
        }), /expected an optional empty, got a list/);
        throws((Ω_intertype_499 = function() {
          return validate.optional.empty('A');
        }), /expected an optional empty, got a text/);
        throws((Ω_intertype_500 = function() {
          return validate.optional.empty(new Set('abc'));
        }), /expected an optional empty, got a set/);
        //.......................................................................................................
        eq((Ω_intertype_501 = function() {
          return isa.optional.empty([]);
        }), true);
        eq((Ω_intertype_502 = function() {
          return isa.optional.empty('');
        }), true);
        eq((Ω_intertype_503 = function() {
          return isa.optional.empty(new Set());
        }), true);
        eq((Ω_intertype_504 = function() {
          return isa.optional.empty([1]);
        }), false);
        eq((Ω_intertype_505 = function() {
          return isa.optional.empty('A');
        }), false);
        eq((Ω_intertype_506 = function() {
          return isa.optional.empty(new Set('abc'));
        }), false);
        eq((Ω_intertype_507 = function() {
          return validate.optional.empty(null);
        }), null);
        eq((Ω_intertype_508 = function() {
          return validate.optional.empty.list(null);
        }), null);
        eq((Ω_intertype_509 = function() {
          return validate.optional.empty.text(null);
        }), null);
        eq((Ω_intertype_510 = function() {
          return validate.optional.empty.set(null);
        }), null);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    use_fields_to_declare_qualifiers: function() {
      var Intertype_minimal;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, isa, types, validate, Ω_intertype_511, Ω_intertype_512, Ω_intertype_513, Ω_intertype_514, Ω_intertype_515, Ω_intertype_516, Ω_intertype_517, Ω_intertype_518, Ω_intertype_519, Ω_intertype_520, Ω_intertype_521, Ω_intertype_522, Ω_intertype_523, Ω_intertype_524, Ω_intertype_525, Ω_intertype_526, Ω_intertype_527, Ω_intertype_528, Ω_intertype_529, Ω_intertype_530, Ω_intertype_531, Ω_intertype_532, Ω_intertype_533, Ω_intertype_534, Ω_intertype_535, Ω_intertype_536, Ω_intertype_537, Ω_intertype_538, Ω_intertype_539, Ω_intertype_540, Ω_intertype_541, Ω_intertype_542, Ω_intertype_543, Ω_intertype_544, Ω_intertype_545, Ω_intertype_546, Ω_intertype_547, Ω_intertype_548, Ω_intertype_549, Ω_intertype_550, Ω_intertype_551, Ω_intertype_552, Ω_intertype_553, Ω_intertype_554, Ω_intertype_555, Ω_intertype_556, Ω_intertype_557, Ω_intertype_558, Ω_intertype_559, Ω_intertype_560, Ω_intertype_561, Ω_intertype_562, Ω_intertype_563, Ω_intertype_564, Ω_intertype_565, Ω_intertype_566, Ω_intertype_567, Ω_intertype_568, Ω_intertype_569, Ω_intertype_570, Ω_intertype_571, Ω_intertype_572, Ω_intertype_573, Ω_intertype_574, Ω_intertype_575, Ω_intertype_576, Ω_intertype_577, Ω_intertype_578, Ω_intertype_579, Ω_intertype_580, Ω_intertype_581, Ω_intertype_582, Ω_intertype_583, Ω_intertype_584;
        declarations = {
          empty: {
            role: 'qualifier',
            fields: {
              list: function(x) {
                return (this.isa.list(x)) && (x.length === 0);
              },
              text: function(x) {
                return (this.isa.text(x)) && (x.length === 0);
              },
              set: function(x) {
                return (this.isa.set(x)) && (x.size === 0);
              }
            }
          },
          nonempty: {
            role: 'qualifier',
            fields: {
              list: function(x) {
                return (this.isa.list(x)) && (x.length > 0);
              },
              text: function(x) {
                return (this.isa.text(x)) && (x.length > 0);
              },
              set: function(x) {
                return (this.isa.set(x)) && (x.size > 0);
              }
            }
          }
        };
        //.......................................................................................................
        types = new Intertype_minimal(sample_declarations, declarations);
        ({isa, validate} = types);
        //.......................................................................................................
        eq((Ω_intertype_511 = function() {
          return isa.empty.list([]);
        }), true);
        eq((Ω_intertype_512 = function() {
          return isa.empty.list(['A']);
        }), false);
        eq((Ω_intertype_513 = function() {
          return isa.empty.list(4);
        }), false);
        eq((Ω_intertype_514 = function() {
          return isa.nonempty.list([]);
        }), false);
        eq((Ω_intertype_515 = function() {
          return isa.nonempty.list(['A']);
        }), true);
        eq((Ω_intertype_516 = function() {
          return isa.nonempty.list(4);
        }), false);
        eq((Ω_intertype_517 = function() {
          return isa.empty.text('');
        }), true);
        eq((Ω_intertype_518 = function() {
          return isa.empty.text('A');
        }), false);
        eq((Ω_intertype_519 = function() {
          return isa.empty.text(4);
        }), false);
        eq((Ω_intertype_520 = function() {
          return isa.nonempty.text('');
        }), false);
        eq((Ω_intertype_521 = function() {
          return isa.nonempty.text('A');
        }), true);
        eq((Ω_intertype_522 = function() {
          return isa.nonempty.text(4);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_523 = function() {
          return isa.empty([]);
        }), true);
        eq((Ω_intertype_524 = function() {
          return isa.empty('');
        }), true);
        eq((Ω_intertype_525 = function() {
          return isa.empty(new Set());
        }), true);
        eq((Ω_intertype_526 = function() {
          return isa.empty([1]);
        }), false);
        eq((Ω_intertype_527 = function() {
          return isa.empty('A');
        }), false);
        eq((Ω_intertype_528 = function() {
          return isa.empty(new Set('abc'));
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_529 = function() {
          return validate.empty([]);
        }), []);
        eq((Ω_intertype_530 = function() {
          return validate.empty('');
        }), '');
        eq((Ω_intertype_531 = function() {
          return validate.empty(new Set());
        }), new Set());
        eq((Ω_intertype_532 = function() {
          return validate.empty.list([]);
        }), []);
        eq((Ω_intertype_533 = function() {
          return validate.empty.text('');
        }), '');
        eq((Ω_intertype_534 = function() {
          return validate.empty.set(new Set());
        }), new Set());
        throws((Ω_intertype_535 = function() {
          return validate.empty([1]);
        }), /expected a empty, got a list/);
        throws((Ω_intertype_536 = function() {
          return validate.empty('A');
        }), /expected a empty, got a text/);
        throws((Ω_intertype_537 = function() {
          return validate.empty(new Set('abc'));
        }), /expected a empty, got a set/);
        //.......................................................................................................
        eq((Ω_intertype_538 = function() {
          return isa.empty([]);
        }), true);
        eq((Ω_intertype_539 = function() {
          return isa.empty('');
        }), true);
        eq((Ω_intertype_540 = function() {
          return isa.empty(new Set());
        }), true);
        eq((Ω_intertype_541 = function() {
          return isa.empty([1]);
        }), false);
        eq((Ω_intertype_542 = function() {
          return isa.empty('A');
        }), false);
        eq((Ω_intertype_543 = function() {
          return isa.empty(new Set('abc'));
        }), false);
        throws((Ω_intertype_544 = function() {
          return validate.empty(null);
        }), /expected a empty, got a null/);
        throws((Ω_intertype_545 = function() {
          return validate.empty.list(null);
        }), /expected a empty.list, got a null/);
        throws((Ω_intertype_546 = function() {
          return validate.empty.text(null);
        }), /expected a empty.text, got a null/);
        throws((Ω_intertype_547 = function() {
          return validate.empty.set(null);
        }), /expected a empty.set, got a null/);
        //.......................................................................................................
        eq((Ω_intertype_548 = function() {
          return isa.optional.empty.list([]);
        }), true);
        eq((Ω_intertype_549 = function() {
          return isa.optional.empty.list(['A']);
        }), false);
        eq((Ω_intertype_550 = function() {
          return isa.optional.empty.list(4);
        }), false);
        eq((Ω_intertype_551 = function() {
          return isa.optional.nonempty.list([]);
        }), false);
        eq((Ω_intertype_552 = function() {
          return isa.optional.nonempty.list(['A']);
        }), true);
        eq((Ω_intertype_553 = function() {
          return isa.optional.nonempty.list(4);
        }), false);
        eq((Ω_intertype_554 = function() {
          return isa.optional.empty.text('');
        }), true);
        eq((Ω_intertype_555 = function() {
          return isa.optional.empty.text('A');
        }), false);
        eq((Ω_intertype_556 = function() {
          return isa.optional.empty.text(4);
        }), false);
        eq((Ω_intertype_557 = function() {
          return isa.optional.nonempty.text('');
        }), false);
        eq((Ω_intertype_558 = function() {
          return isa.optional.nonempty.text('A');
        }), true);
        eq((Ω_intertype_559 = function() {
          return isa.optional.nonempty.text(4);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_560 = function() {
          return isa.optional.empty([]);
        }), true);
        eq((Ω_intertype_561 = function() {
          return isa.optional.empty('');
        }), true);
        eq((Ω_intertype_562 = function() {
          return isa.optional.empty(new Set());
        }), true);
        eq((Ω_intertype_563 = function() {
          return isa.optional.empty([1]);
        }), false);
        eq((Ω_intertype_564 = function() {
          return isa.optional.empty('A');
        }), false);
        eq((Ω_intertype_565 = function() {
          return isa.optional.empty(new Set('abc'));
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_566 = function() {
          return validate.optional.empty([]);
        }), []);
        eq((Ω_intertype_567 = function() {
          return validate.optional.empty('');
        }), '');
        eq((Ω_intertype_568 = function() {
          return validate.optional.empty(new Set());
        }), new Set());
        eq((Ω_intertype_569 = function() {
          return validate.optional.empty.list([]);
        }), []);
        eq((Ω_intertype_570 = function() {
          return validate.optional.empty.text('');
        }), '');
        eq((Ω_intertype_571 = function() {
          return validate.optional.empty.set(new Set());
        }), new Set());
        throws((Ω_intertype_572 = function() {
          return validate.optional.empty([1]);
        }), /expected an optional empty, got a list/);
        throws((Ω_intertype_573 = function() {
          return validate.optional.empty('A');
        }), /expected an optional empty, got a text/);
        throws((Ω_intertype_574 = function() {
          return validate.optional.empty(new Set('abc'));
        }), /expected an optional empty, got a set/);
        //.......................................................................................................
        eq((Ω_intertype_575 = function() {
          return isa.optional.empty([]);
        }), true);
        eq((Ω_intertype_576 = function() {
          return isa.optional.empty('');
        }), true);
        eq((Ω_intertype_577 = function() {
          return isa.optional.empty(new Set());
        }), true);
        eq((Ω_intertype_578 = function() {
          return isa.optional.empty([1]);
        }), false);
        eq((Ω_intertype_579 = function() {
          return isa.optional.empty('A');
        }), false);
        eq((Ω_intertype_580 = function() {
          return isa.optional.empty(new Set('abc'));
        }), false);
        eq((Ω_intertype_581 = function() {
          return validate.optional.empty(null);
        }), null);
        eq((Ω_intertype_582 = function() {
          return validate.optional.empty.list(null);
        }), null);
        eq((Ω_intertype_583 = function() {
          return validate.optional.empty.text(null);
        }), null);
        eq((Ω_intertype_584 = function() {
          return validate.optional.empty.set(null);
        }), null);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    builtin_qualifiers: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var evaluate, isa, type_of, types, validate, Ω_intertype_585, Ω_intertype_586, Ω_intertype_587, Ω_intertype_588, Ω_intertype_589, Ω_intertype_590, Ω_intertype_591, Ω_intertype_592, Ω_intertype_593, Ω_intertype_594, Ω_intertype_595, Ω_intertype_596, Ω_intertype_597, Ω_intertype_598, Ω_intertype_599, Ω_intertype_600, Ω_intertype_601, Ω_intertype_602, Ω_intertype_603, Ω_intertype_604, Ω_intertype_605, Ω_intertype_606, Ω_intertype_607, Ω_intertype_608, Ω_intertype_609, Ω_intertype_610, Ω_intertype_611, Ω_intertype_612, Ω_intertype_613, Ω_intertype_614, Ω_intertype_615, Ω_intertype_616, Ω_intertype_617, Ω_intertype_618, Ω_intertype_619, Ω_intertype_620, Ω_intertype_621, Ω_intertype_622, Ω_intertype_623, Ω_intertype_624, Ω_intertype_625, Ω_intertype_626, Ω_intertype_627, Ω_intertype_628, Ω_intertype_629, Ω_intertype_630, Ω_intertype_631, Ω_intertype_632, Ω_intertype_633, Ω_intertype_634, Ω_intertype_635, Ω_intertype_636, Ω_intertype_637, Ω_intertype_638, Ω_intertype_639, Ω_intertype_640, Ω_intertype_641, Ω_intertype_642, Ω_intertype_643, Ω_intertype_644, Ω_intertype_645, Ω_intertype_646, Ω_intertype_647, Ω_intertype_648, Ω_intertype_649, Ω_intertype_650, Ω_intertype_651, Ω_intertype_652, Ω_intertype_653, Ω_intertype_654, Ω_intertype_655, Ω_intertype_656, Ω_intertype_657, Ω_intertype_658, Ω_intertype_659, Ω_intertype_660, Ω_intertype_661, Ω_intertype_662, Ω_intertype_663, Ω_intertype_664, Ω_intertype_665, Ω_intertype_666, Ω_intertype_667, Ω_intertype_668, Ω_intertype_669, Ω_intertype_670, Ω_intertype_671, Ω_intertype_672, Ω_intertype_673, Ω_intertype_674, Ω_intertype_675, Ω_intertype_676, Ω_intertype_677, Ω_intertype_678, Ω_intertype_679, Ω_intertype_680, Ω_intertype_681, Ω_intertype_682, Ω_intertype_683, Ω_intertype_684, Ω_intertype_685, Ω_intertype_686, Ω_intertype_687, Ω_intertype_688, Ω_intertype_689, Ω_intertype_690, Ω_intertype_691, Ω_intertype_692, Ω_intertype_693, Ω_intertype_694, Ω_intertype_695, Ω_intertype_696, Ω_intertype_697, Ω_intertype_698, Ω_intertype_699, Ω_intertype_700, Ω_intertype_701, Ω_intertype_702, Ω_intertype_703, Ω_intertype_704, Ω_intertype_705, Ω_intertype_706, Ω_intertype_707, Ω_intertype_708, Ω_intertype_709, Ω_intertype_710, Ω_intertype_711, Ω_intertype_712, Ω_intertype_713, Ω_intertype_714, Ω_intertype_715, Ω_intertype_716, Ω_intertype_717, Ω_intertype_718, Ω_intertype_719, Ω_intertype_720, Ω_intertype_721, Ω_intertype_722, Ω_intertype_723, Ω_intertype_724, Ω_intertype_725, Ω_intertype_726, Ω_intertype_727, Ω_intertype_728, Ω_intertype_729, Ω_intertype_730, Ω_intertype_731;
        types = new Intertype();
        ({isa, validate, evaluate, type_of} = types);
        //.......................................................................................................
        eq((Ω_intertype_585 = function() {
          return isa.empty.list([]);
        }), true);
        eq((Ω_intertype_586 = function() {
          return isa.empty.list(['A']);
        }), false);
        eq((Ω_intertype_587 = function() {
          return isa.empty.list(4);
        }), false);
        eq((Ω_intertype_588 = function() {
          return isa.nonempty.list([]);
        }), false);
        eq((Ω_intertype_589 = function() {
          return isa.nonempty.list(['A']);
        }), true);
        eq((Ω_intertype_590 = function() {
          return isa.nonempty.list(4);
        }), false);
        eq((Ω_intertype_591 = function() {
          return isa.empty.text('');
        }), true);
        eq((Ω_intertype_592 = function() {
          return isa.empty.text('A');
        }), false);
        eq((Ω_intertype_593 = function() {
          return isa.empty.text(4);
        }), false);
        eq((Ω_intertype_594 = function() {
          return isa.nonempty.text('');
        }), false);
        eq((Ω_intertype_595 = function() {
          return isa.nonempty.text('A');
        }), true);
        eq((Ω_intertype_596 = function() {
          return isa.nonempty.text(4);
        }), false);
        eq((Ω_intertype_597 = function() {
          return isa.empty({
            list: [],
            text: '',
            set: new Set()
          });
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_598 = function() {
          return isa.empty([]);
        }), true);
        eq((Ω_intertype_599 = function() {
          return isa.empty('');
        }), true);
        eq((Ω_intertype_600 = function() {
          return isa.empty(new Set());
        }), true);
        eq((Ω_intertype_601 = function() {
          return isa.empty(/d/);
        }), false);
        eq((Ω_intertype_602 = function() {
          return isa.empty([1]);
        }), false);
        eq((Ω_intertype_603 = function() {
          return isa.empty('A');
        }), false);
        eq((Ω_intertype_604 = function() {
          return isa.empty(new Set('abc'));
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_605 = function() {
          return validate.empty([]);
        }), []);
        eq((Ω_intertype_606 = function() {
          return validate.empty('');
        }), '');
        eq((Ω_intertype_607 = function() {
          return validate.empty(new Set());
        }), new Set());
        throws((Ω_intertype_608 = function() {
          return validate.empty([1]);
        }), /expected a empty, got a list/);
        throws((Ω_intertype_609 = function() {
          return validate.empty('A');
        }), /expected a empty, got a text/);
        throws((Ω_intertype_610 = function() {
          return validate.empty(new Set('abc'));
        }), /expected a empty, got a set/);
        //.......................................................................................................
        eq((Ω_intertype_611 = function() {
          return type_of([]);
        }), 'list');
        eq((Ω_intertype_612 = function() {
          return type_of('');
        }), 'text');
        eq((Ω_intertype_613 = function() {
          return type_of(new Set());
        }), 'set');
        eq((Ω_intertype_614 = function() {
          return type_of(['a']);
        }), 'list');
        eq((Ω_intertype_615 = function() {
          return type_of('a');
        }), 'text');
        eq((Ω_intertype_616 = function() {
          return type_of(new Set('a'));
        }), 'set');
        //.......................................................................................................
        eq((Ω_intertype_617 = function() {
          return type_of(1234);
        }), 'float');
        eq((Ω_intertype_618 = function() {
          return isa.integer(1234);
        }), true);
        eq((Ω_intertype_619 = function() {
          return isa.positive.integer(1234);
        }), true);
        eq((Ω_intertype_620 = function() {
          return isa.negative.integer(1234);
        }), false);
        eq((Ω_intertype_621 = function() {
          return isa.negative.integer(-1234);
        }), true);
        eq((Ω_intertype_622 = function() {
          return isa.negative.integer(-2e308);
        }), false);
        eq((Ω_intertype_623 = function() {
          return isa.negative.integer(-12.34);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_624 = function() {
          return isa.positive.float(+4);
        }), true);
        eq((Ω_intertype_625 = function() {
          return isa.positive.integer(+4);
        }), true);
        eq((Ω_intertype_626 = function() {
          return isa.positive.infinity(+4);
        }), false);
        eq((Ω_intertype_627 = function() {
          return isa.negative.float(+4);
        }), false);
        eq((Ω_intertype_628 = function() {
          return isa.negative.integer(+4);
        }), false);
        eq((Ω_intertype_629 = function() {
          return isa.negative.infinity(+4);
        }), false);
        eq((Ω_intertype_630 = function() {
          return isa.posnaught.float(+4);
        }), true);
        eq((Ω_intertype_631 = function() {
          return isa.posnaught.integer(+4);
        }), true);
        eq((Ω_intertype_632 = function() {
          return isa.posnaught.infinity(+4);
        }), false);
        eq((Ω_intertype_633 = function() {
          return isa.negnaught.float(+4);
        }), false);
        eq((Ω_intertype_634 = function() {
          return isa.negnaught.integer(+4);
        }), false);
        eq((Ω_intertype_635 = function() {
          return isa.negnaught.infinity(+4);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_636 = function() {
          return isa.positive.float(0);
        }), false);
        eq((Ω_intertype_637 = function() {
          return isa.positive.integer(0);
        }), false);
        eq((Ω_intertype_638 = function() {
          return isa.positive.infinity(0);
        }), false);
        eq((Ω_intertype_639 = function() {
          return isa.negative.float(0);
        }), false);
        eq((Ω_intertype_640 = function() {
          return isa.negative.integer(0);
        }), false);
        eq((Ω_intertype_641 = function() {
          return isa.negative.infinity(0);
        }), false);
        eq((Ω_intertype_642 = function() {
          return isa.posnaught.float(0);
        }), true);
        eq((Ω_intertype_643 = function() {
          return isa.posnaught.integer(0);
        }), true);
        eq((Ω_intertype_644 = function() {
          return isa.posnaught.infinity(0);
        }), false);
        eq((Ω_intertype_645 = function() {
          return isa.negnaught.float(0);
        }), true);
        eq((Ω_intertype_646 = function() {
          return isa.negnaught.integer(0);
        }), true);
        eq((Ω_intertype_647 = function() {
          return isa.negnaught.infinity(0);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_648 = function() {
          return isa.positive.float(2e308);
        }), false);
        eq((Ω_intertype_649 = function() {
          return isa.positive.integer(2e308);
        }), false);
        eq((Ω_intertype_650 = function() {
          return isa.positive.infinity(2e308);
        }), true);
        eq((Ω_intertype_651 = function() {
          return isa.negative.float(2e308);
        }), false);
        eq((Ω_intertype_652 = function() {
          return isa.negative.integer(2e308);
        }), false);
        eq((Ω_intertype_653 = function() {
          return isa.negative.infinity(2e308);
        }), false);
        eq((Ω_intertype_654 = function() {
          return isa.posnaught.float(2e308);
        }), false);
        eq((Ω_intertype_655 = function() {
          return isa.posnaught.integer(2e308);
        }), false);
        eq((Ω_intertype_656 = function() {
          return isa.posnaught.infinity(2e308);
        }), true);
        eq((Ω_intertype_657 = function() {
          return isa.negnaught.float(2e308);
        }), false);
        eq((Ω_intertype_658 = function() {
          return isa.negnaught.integer(2e308);
        }), false);
        eq((Ω_intertype_659 = function() {
          return isa.negnaught.infinity(2e308);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_660 = function() {
          return isa.positive.float(+4.3);
        }), true);
        eq((Ω_intertype_661 = function() {
          return isa.positive.integer(+4.3);
        }), false);
        eq((Ω_intertype_662 = function() {
          return isa.positive.infinity(+4.3);
        }), false);
        eq((Ω_intertype_663 = function() {
          return isa.negative.float(+4.3);
        }), false);
        eq((Ω_intertype_664 = function() {
          return isa.negative.integer(+4.3);
        }), false);
        eq((Ω_intertype_665 = function() {
          return isa.negative.infinity(+4.3);
        }), false);
        eq((Ω_intertype_666 = function() {
          return isa.posnaught.float(+4.3);
        }), true);
        eq((Ω_intertype_667 = function() {
          return isa.posnaught.integer(+4.3);
        }), false);
        eq((Ω_intertype_668 = function() {
          return isa.posnaught.infinity(+4.3);
        }), false);
        eq((Ω_intertype_669 = function() {
          return isa.negnaught.float(+4.3);
        }), false);
        eq((Ω_intertype_670 = function() {
          return isa.negnaught.integer(+4.3);
        }), false);
        eq((Ω_intertype_671 = function() {
          return isa.negnaught.infinity(+4.3);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_672 = function() {
          return isa.positive.float(-4.3);
        }), false);
        eq((Ω_intertype_673 = function() {
          return isa.positive.integer(-4.3);
        }), false);
        eq((Ω_intertype_674 = function() {
          return isa.positive.infinity(-4.3);
        }), false);
        eq((Ω_intertype_675 = function() {
          return isa.negative.float(-4.3);
        }), true);
        eq((Ω_intertype_676 = function() {
          return isa.negative.integer(-4.3);
        }), false);
        eq((Ω_intertype_677 = function() {
          return isa.negative.infinity(-4.3);
        }), false);
        eq((Ω_intertype_678 = function() {
          return isa.posnaught.float(-4.3);
        }), false);
        eq((Ω_intertype_679 = function() {
          return isa.posnaught.integer(-4.3);
        }), false);
        eq((Ω_intertype_680 = function() {
          return isa.posnaught.infinity(-4.3);
        }), false);
        eq((Ω_intertype_681 = function() {
          return isa.negnaught.float(-4.3);
        }), true);
        eq((Ω_intertype_682 = function() {
          return isa.negnaught.integer(-4.3);
        }), false);
        eq((Ω_intertype_683 = function() {
          return isa.negnaught.infinity(-4.3);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_684 = function() {
          return isa.posnaught(+2e308);
        }), true);
        eq((Ω_intertype_685 = function() {
          return isa.negnaught(+2e308);
        }), false);
        eq((Ω_intertype_686 = function() {
          return isa.posnaught(-2e308);
        }), false);
        eq((Ω_intertype_687 = function() {
          return isa.negnaught(-2e308);
        }), true);
        eq((Ω_intertype_688 = function() {
          return isa.posnaught(0);
        }), true);
        eq((Ω_intertype_689 = function() {
          return isa.negnaught(0);
        }), true);
        eq((Ω_intertype_690 = function() {
          return isa.posnaught(0);
        }), true);
        eq((Ω_intertype_691 = function() {
          return isa.negnaught(0);
        }), true);
        //.......................................................................................................
        eq((Ω_intertype_692 = function() {
          return isa.frozen(Object.freeze({}));
        }), true);
        eq((Ω_intertype_693 = function() {
          return isa.frozen(Object.freeze([]));
        }), true);
        eq((Ω_intertype_694 = function() {
          return isa.frozen({});
        }), false);
        eq((Ω_intertype_695 = function() {
          return isa.frozen([]);
        }), false);
        eq((Ω_intertype_696 = function() {
          return isa.frozen.object(Object.freeze({}));
        }), true);
        eq((Ω_intertype_697 = function() {
          return isa.frozen.list(Object.freeze([]));
        }), true);
        eq((Ω_intertype_698 = function() {
          return isa.frozen.object({});
        }), false);
        eq((Ω_intertype_699 = function() {
          return isa.frozen.list([]);
        }), false);
        //.......................................................................................................
        eq((Ω_intertype_700 = function() {
          return isa.odd.integer([]);
        }), false);
        eq((Ω_intertype_701 = function() {
          return isa.odd.integer(102.4);
        }), false);
        eq((Ω_intertype_702 = function() {
          return isa.odd.integer(9997);
        }), true);
        eq((Ω_intertype_703 = function() {
          return isa.odd.integer('1024');
        }), false);
        eq((Ω_intertype_704 = function() {
          return isa.odd.integer(0);
        }), false);
        eq((Ω_intertype_705 = function() {
          return isa.odd.integer(1024);
        }), false);
        eq((Ω_intertype_706 = function() {
          return isa.odd.positive.integer(1024);
        }), false);
        eq((Ω_intertype_707 = function() {
          return isa.odd.positive.integer(102.4);
        }), false);
        eq((Ω_intertype_708 = function() {
          return isa.odd.positive.integer(1023);
        }), true);
        eq((Ω_intertype_709 = function() {
          return isa.odd.positive.integer(-1023);
        }), false);
        eq((Ω_intertype_710 = function() {
          return isa.odd.positive.integer(103.4);
        }), false);
        eq((Ω_intertype_711 = function() {
          return isa.even.integer([]);
        }), false);
        eq((Ω_intertype_712 = function() {
          return isa.even.integer(102.4);
        }), false);
        eq((Ω_intertype_713 = function() {
          return isa.even.integer(9997);
        }), false);
        eq((Ω_intertype_714 = function() {
          return isa.even.integer('1024');
        }), false);
        eq((Ω_intertype_715 = function() {
          return isa.even.integer(0);
        }), true);
        eq((Ω_intertype_716 = function() {
          return isa.even.integer(1024);
        }), true);
        eq((Ω_intertype_717 = function() {
          return isa.even.positive.integer(1024);
        }), true);
        eq((Ω_intertype_718 = function() {
          return isa.even.positive.integer(0);
        }), false);
        eq((Ω_intertype_719 = function() {
          return isa.even.posnaught.integer(1024);
        }), true);
        eq((Ω_intertype_720 = function() {
          return isa.even.posnaught.integer(0);
        }), true);
        //.......................................................................................................
        eq((Ω_intertype_721 = function() {
          return isa.even.posnaught(0);
        }), true);
        eq((Ω_intertype_722 = function() {
          return isa.even.posnaught(1);
        }), false);
        eq((Ω_intertype_723 = function() {
          return isa.even.posnaught(2);
        }), true);
        //.......................................................................................................
        eq((Ω_intertype_724 = function() {
          return isa.cardinal(-1024);
        }), false);
        eq((Ω_intertype_725 = function() {
          return isa.cardinal(10);
        }), true);
        eq((Ω_intertype_726 = function() {
          return isa.cardinal(123.7);
        }), false);
        eq((Ω_intertype_727 = function() {
          return isa.cardinal(0);
        }), true);
        eq((Ω_intertype_728 = function() {
          return isa.cardinal(1);
        }), true);
        eq((Ω_intertype_729 = function() {
          return isa.cardinal(2e308);
        }), false);
        eq((Ω_intertype_730 = function() {
          return evaluate.cardinal(2e308);
        }), {
          cardinal: false
        });
        eq((Ω_intertype_731 = function() {
          return evaluate.posnaught.integer(2e308);
        }), {
          'posnaught.integer': false
        });
        //.......................................................................................................
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    disallow_rhs_optional: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var Ω_intertype_732, Ω_intertype_733, Ω_intertype_734, Ω_intertype_735, Ω_intertype_736, Ω_intertype_737;
        /* TAINT observe the out-comment messages would perhaps make more sense as they are more specific */
        eq((Ω_intertype_732 = function() {
          return (new Intertype()).declare({
            foo: 'float'
          });
        }), null);
        eq((Ω_intertype_733 = function() {
          return (new Intertype()).declare({
            foo: 'text'
          });
        }), null);
        // ( new Intertype() ).declare { foo: 'optional', }
        throws((Ω_intertype_734 = function() {
          return (new Intertype()).declare({
            foo: 'optional'
          });
        }), /illegal use of 'optional' in declaration of type 'foo'/);
        throws((Ω_intertype_735 = function() {
          return (new Intertype()).declare({
            foo: 'qqq'
          });
        }), /unknown type 'qqq'/);
        throws((Ω_intertype_736 = function() {
          return (new Intertype()).declare({
            foo: 'optional.float'
          });
        }), /illegal use of 'optional' in declaration of type 'foo'/);
        throws((Ω_intertype_737 = function() {
          return (new Intertype()).declare({
            foo: 'anything.float'
          });
        }), /illegal use of basetype 'anything' in declaration of type 'foo'/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    parallel_behavior_of_isa_validate_mandatory_and_optional: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var isa, validate, Ω_intertype_738, Ω_intertype_739, Ω_intertype_740, Ω_intertype_741, Ω_intertype_742, Ω_intertype_743, Ω_intertype_744, Ω_intertype_745, Ω_intertype_746, Ω_intertype_747, Ω_intertype_748, Ω_intertype_749, Ω_intertype_750, Ω_intertype_751, Ω_intertype_752, Ω_intertype_753;
        ({isa, validate} = new Intertype({
          normalfloat: (function(x) {
            return (this.isa.float(x)) && ((0 <= x && x <= 1));
          })
        }));
        eq((Ω_intertype_738 = function() {
          return isa.normalfloat(0);
        }), true);
        eq((Ω_intertype_739 = function() {
          return isa.normalfloat(null);
        }), false);
        eq((Ω_intertype_740 = function() {
          return isa.normalfloat(-1);
        }), false);
        eq((Ω_intertype_741 = function() {
          return isa.normalfloat('?');
        }), false);
        eq((Ω_intertype_742 = function() {
          return isa.optional.normalfloat(0);
        }), true);
        eq((Ω_intertype_743 = function() {
          return isa.optional.normalfloat(null);
        }), true);
        eq((Ω_intertype_744 = function() {
          return isa.optional.normalfloat(-1);
        }), false);
        eq((Ω_intertype_745 = function() {
          return isa.optional.normalfloat('?');
        }), false);
        eq((Ω_intertype_746 = function() {
          return validate.normalfloat(0);
        }), 0);
        eq((Ω_intertype_747 = function() {
          return validate.optional.normalfloat(0);
        }), 0);
        eq((Ω_intertype_748 = function() {
          return validate.optional.normalfloat(null);
        }), null);
        throws((Ω_intertype_749 = function() {
          return validate.normalfloat(null);
        }), /expected a normalfloat, got a null/);
        throws((Ω_intertype_750 = function() {
          return validate.normalfloat(-1);
        }), /expected a normalfloat, got a float/);
        throws((Ω_intertype_751 = function() {
          return validate.normalfloat('?');
        }), /expected a normalfloat, got a text/);
        throws((Ω_intertype_752 = function() {
          return validate.optional.normalfloat(-1);
        }), /expected an optional normalfloat, got a float/);
        throws((Ω_intertype_753 = function() {
          return validate.optional.normalfloat('?');
        }), /expected an optional normalfloat, got a text/);
        return null;
      })();
      (() => {        //.........................................................................................................
        var isa, my_types, types, validate, Ω_intertype_754, Ω_intertype_755, Ω_intertype_756, Ω_intertype_757, Ω_intertype_758, Ω_intertype_759, Ω_intertype_760, Ω_intertype_761, Ω_intertype_762, Ω_intertype_763, Ω_intertype_764, Ω_intertype_765, Ω_intertype_766, Ω_intertype_767, Ω_intertype_768, Ω_intertype_769, Ω_intertype_770, Ω_intertype_771, Ω_intertype_772, Ω_intertype_773, Ω_intertype_774, Ω_intertype_775, Ω_intertype_776, Ω_intertype_777, Ω_intertype_778, Ω_intertype_779, Ω_intertype_780, Ω_intertype_781, Ω_intertype_782, Ω_intertype_783, Ω_intertype_784;
        my_types = {
          'quantity': 'object',
          'quantity.q': 'float',
          'quantity.u': 'text',
          'foo': 'object',
          'foo.bar': 'object',
          'foo.bar.baz': 'float'
        };
        ({isa, validate} = types = new Intertype(my_types));
        eq((Ω_intertype_754 = function() {
          return isa.quantity({
            q: 1,
            u: 'm'
          });
        }), true);
        eq((Ω_intertype_755 = function() {
          return isa.quantity(null);
        }), false);
        eq((Ω_intertype_756 = function() {
          return isa.optional.quantity({
            q: 2,
            u: 'm'
          });
        }), true);
        eq((Ω_intertype_757 = function() {
          return isa.optional.quantity(null);
        }), true);
        eq((Ω_intertype_758 = function() {
          return validate.quantity({
            q: 3,
            u: 'm'
          });
        }), {
          q: 3,
          u: 'm'
        });
        eq((Ω_intertype_759 = function() {
          return validate.optional.quantity({
            q: 4,
            u: 'm'
          });
        }), {
          q: 4,
          u: 'm'
        });
        eq((Ω_intertype_760 = function() {
          return validate.optional.quantity.q(null);
        }), null);
        eq((Ω_intertype_761 = function() {
          return validate.optional.quantity.q(111);
        }), 111);
        eq((Ω_intertype_762 = function() {
          return isa.quantity(null);
        }), false);
        eq((Ω_intertype_763 = function() {
          return isa.quantity(-1);
        }), false);
        eq((Ω_intertype_764 = function() {
          return isa.quantity('?');
        }), false);
        eq((Ω_intertype_765 = function() {
          return isa.quantity.q('?');
        }), false);
        eq((Ω_intertype_766 = function() {
          return isa.quantity.q(3);
        }), true);
        eq((Ω_intertype_767 = function() {
          return isa.optional.quantity({
            q: 1,
            u: 'm'
          });
        }), true);
        eq((Ω_intertype_768 = function() {
          return isa.optional.quantity(null);
        }), true);
        eq((Ω_intertype_769 = function() {
          return isa.optional.quantity(-1);
        }), false);
        eq((Ω_intertype_770 = function() {
          return isa.optional.quantity('?');
        }), false);
        eq((Ω_intertype_771 = function() {
          return isa.optional.quantity.q('?');
        }), false);
        eq((Ω_intertype_772 = function() {
          return isa.optional.quantity.q(3);
        }), true);
        eq((Ω_intertype_773 = function() {
          return validate.quantity({
            q: 1,
            u: 'm'
          });
        }), {
          q: 1,
          u: 'm'
        });
        eq((Ω_intertype_774 = function() {
          return validate.optional.quantity({
            q: 1,
            u: 'm'
          });
        }), {
          q: 1,
          u: 'm'
        });
        eq((Ω_intertype_775 = function() {
          return validate.optional.quantity(null);
        }), null);
        throws((Ω_intertype_776 = function() {
          return validate.quantity({
            q: 5
          });
        }), /expected a quantity, got a object/);
        /* TAINT message should be more specific */        throws((Ω_intertype_777 = function() {
          return validate.quantity(null);
        }), /expected a quantity, got a null/);
        throws((Ω_intertype_778 = function() {
          return validate.quantity(-1);
        }), /expected a quantity, got a float/);
        throws((Ω_intertype_779 = function() {
          return validate.quantity('?');
        }), /expected a quantity, got a text/);
        throws((Ω_intertype_780 = function() {
          return validate.quantity({
            q: 1
          });
        }), /expected a quantity, got a object/);
        /* TAINT message should be more specific */        throws((Ω_intertype_781 = function() {
          return validate.optional.quantity(-1);
        }), /expected an optional quantity, got a float/);
        throws((Ω_intertype_782 = function() {
          return validate.optional.quantity({
            q: 1
          });
        }), /expected an optional quantity, got a object/);
        /* TAINT message should be more specific */        throws((Ω_intertype_783 = function() {
          return validate.optional.quantity.q({
            q: 1
          });
        }), /expected an optional quantity.q, got a object/);
        throws((Ω_intertype_784 = function() {
          return validate.optional.quantity.q(3, 4, 5);
        }), /method 'validate.optional.quantity.q' expects 1 arguments, got 3/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    declaration_role_field: function() {
      var Intertype;
      ({Intertype} = require('../../../apps/intertype'));
      (() => {        //.........................................................................................................
        var declarations, Ω_intertype_785, Ω_intertype_786, Ω_intertype_787, Ω_intertype_788, Ω_intertype_789;
        ({declarations} = new Intertype());
        eq((Ω_intertype_785 = function() {
          return declarations.float.role;
        }), 'usertype');
        eq((Ω_intertype_786 = function() {
          return declarations.null.role;
        }), 'basetype');
        eq((Ω_intertype_787 = function() {
          return declarations.anything.role;
        }), 'basetype');
        eq((Ω_intertype_788 = function() {
          return declarations.unknown.role;
        }), 'basetype');
        eq((Ω_intertype_789 = function() {
          return declarations.optional.role;
        }), 'optional');
        // throws T, /expected a normalfloat, got a null/,             -> validate.normalfloat           null
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    minimal_type_of_results: function() {
      var Intertype_minimal, create, declare, isa, type_of, validate;
      ({Intertype_minimal} = require('../../../apps/intertype'));
      ({isa, validate, create, declare, type_of} = new Intertype_minimal());
      (() => {        //.........................................................................................................
        var Ω_intertype_790, Ω_intertype_791, Ω_intertype_792, Ω_intertype_793;
        eq((Ω_intertype_790 = function() {
          return type_of(null);
        }), 'null');
        eq((Ω_intertype_791 = function() {
          return type_of(void 0);
        }), 'undefined');
        eq((Ω_intertype_792 = function() {
          return type_of(+2e308);
        }), 'unknown');
        eq((Ω_intertype_793 = function() {
          return type_of(4);
        }), 'unknown');
        return null;
      })();
      (() => {        //.........................................................................................................
        var Ω_intertype_794, Ω_intertype_795, Ω_intertype_796, Ω_intertype_797;
        eq((Ω_intertype_794 = function() {
          return isa.anything(1);
        }), true);
        eq((Ω_intertype_795 = function() {
          return isa.nothing(1);
        }), false);
        eq((Ω_intertype_796 = function() {
          return isa.something(1);
        }), true);
        eq((Ω_intertype_797 = function() {
          return isa.unknown(1);
        }), true);
        return null;
      })();
      (() => {        //.........................................................................................................
        var Ω_intertype_798, Ω_intertype_799, Ω_intertype_800, Ω_intertype_801;
        eq((Ω_intertype_798 = function() {
          return isa.anything(null);
        }), true);
        eq((Ω_intertype_799 = function() {
          return isa.nothing(null);
        }), true);
        eq((Ω_intertype_800 = function() {
          return isa.something(null);
        }), false);
        eq((Ω_intertype_801 = function() {
          return isa.unknown(null);
        }), false);
        return null;
      })();
      (() => {        //.........................................................................................................
        var Ω_intertype_802, Ω_intertype_803, Ω_intertype_804, Ω_intertype_805;
        eq((Ω_intertype_802 = function() {
          return isa.anything(void 0);
        }), true);
        eq((Ω_intertype_803 = function() {
          return isa.nothing(void 0);
        }), true);
        eq((Ω_intertype_804 = function() {
          return isa.something(void 0);
        }), false);
        eq((Ω_intertype_805 = function() {
          return isa.unknown(void 0);
        }), false);
        return null;
      })();
      (() => {        //.........................................................................................................
        var Ω_intertype_806, Ω_intertype_807, Ω_intertype_808;
        throws((Ω_intertype_806 = function() {
          return isa.optional(1);
        }), /`optional` is not a legal type for `isa` methods/);
        throws((Ω_intertype_807 = function() {
          return validate.optional(1);
        }), /`optional` is not a legal type for `validate` methods/);
        throws((Ω_intertype_808 = function() {
          return create.optional(1);
        }), /`optional` is not a legal type for `create` methods/);
        return null;
      })();
      //.........................................................................................................
      return null;
    },
    //-----------------------------------------------------------------------------------------------------------
    can_use_null_and_undefined_in_record_create_methods: function() {
      var Intertype, types, Ω_intertype_809, Ω_intertype_810, Ω_intertype_811, Ω_intertype_812, Ω_intertype_813, Ω_intertype_814;
      ({Intertype} = require('../../../apps/intertype'));
      types = new Intertype();
      types.declare({
        foobar: {
          fields: {
            foo: 'integer',
            bar: 'integer'
          },
          template: {
            foo: 4,
            bar: 5
          }
        }
      });
      eq((Ω_intertype_809 = function() {
        return types.create.foobar({
          foo: 8,
          bar: 9
        });
      }), {
        foo: 8,
        bar: 9
      });
      eq((Ω_intertype_810 = function() {
        return types.create.foobar({
          foo: 8
        });
      }), {
        foo: 8,
        bar: 5
      });
      eq((Ω_intertype_811 = function() {
        return types.create.foobar({
          foo: 4,
          bar: 5
        });
      }), {
        foo: 4,
        bar: 5
      });
      eq((Ω_intertype_812 = function() {
        return types.create.foobar({});
      }), {
        foo: 4,
        bar: 5
      });
      eq((Ω_intertype_813 = function() {
        return types.create.foobar(void 0);
      }), {
        foo: 4,
        bar: 5
      });
      eq((Ω_intertype_814 = function() {
        return types.create.foobar(null);
      }), {
        foo: 4,
        bar: 5
      });
      return null;
    }
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      // @use_fields_to_declare_qualifiers()
      // test @use_fields_to_declare_qualifiers
      return (await async_test(tasks));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map
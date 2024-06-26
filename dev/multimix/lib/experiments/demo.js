(function() {
  'use strict';
  var CND, alert, badge, debug, example_for_overwrite_false, example_using_multimix, help, info, rewritten_example, rpr, urge, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MULTIMIX/EXPERIMENTS/ES6-CLASSES-WITH.MIXINS';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  //-----------------------------------------------------------------------------------------------------------
  rewritten_example = function() {
    var Intertype, Multimix, _get_keymethod_proxy, declare, intertype_1, intertype_2, isa, isa_keymethod_proxy, js_type_of, module_keywords, object_with_class_properties, object_with_instance_properties;
    //=========================================================================================================
    // MODULE METACLASS provides static methods `@extend()`, `@include()`
    //---------------------------------------------------------------------------------------------------------
    /* The little dance around the module_keywords variable is to ensure we have callback support when mixins
     extend a class. See https://arcturo.github.io/library/coffeescript/03_classes.html */
    //---------------------------------------------------------------------------------------------------------
    module_keywords = ['extended', 'included'];
    //=========================================================================================================
    Multimix = class Multimix {
      //-------------------------------------------------------------------------------------------------------
      static extend(object) {
        var key, ref, value;
        for (key in object) {
          value = object[key];
          if (indexOf.call(module_keywords, key) < 0) {
            this[key] = value;
          }
        }
        if ((ref = object.extended) != null) {
          ref.apply(this);
        }
        return this;
      }

      //-------------------------------------------------------------------------------------------------------
      static include(object) {
        var key, ref, value;
        for (key in object) {
          value = object[key];
          if (indexOf.call(module_keywords, key) < 0) {
            // Assign properties to the prototype
            this.prototype[key] = value;
          }
        }
        if ((ref = object.included) != null) {
          ref.apply(this);
        }
        return this;
      }

      //-------------------------------------------------------------------------------------------------------
      export() {
        /* Return an object with methods, bound to the current instance. */
        var R, k, ref, ref1, v;
        R = {};
        ref = this;
        for (k in ref) {
          v = ref[k];
          if ((v != null ? v.bind : void 0) == null) {
            continue;
          }
          if ((ref1 = v[isa_keymethod_proxy]) != null ? ref1 : false) {
            R[k] = _get_keymethod_proxy(this, v);
          } else {
            R[k] = v.bind(this);
          }
        }
        return R;
      }

    };
    //=========================================================================================================
    // KEYMETHOD FACTORY
    //---------------------------------------------------------------------------------------------------------
    _get_keymethod_proxy = function(bind_target, f) {
      var R;
      R = new Proxy(f.bind(bind_target), {
        get: function(target, key) {
          if (key === 'bind') { // ... other properties ...
            return target[key];
          }
          if ((js_type_of(key)) === 'symbol') {
            return target[key];
          }
          return function(...xP) {
            return target(key, ...xP);
          };
        }
      });
      R[isa_keymethod_proxy] = true;
      return R;
    };
    //=========================================================================================================
    // SAMPLE OBJECTS WITH INSTANCE METHODS, STATIC METHODS
    //---------------------------------------------------------------------------------------------------------
    object_with_class_properties = {
      find: function(id) {
        var k;
        return info("class method 'find()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      },
      create: function(attrs) {
        var k;
        return info("class method 'create()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      }
    };
    //---------------------------------------------------------------------------------------------------------
    object_with_instance_properties = {
      save: function() {
        var k;
        return info("instance method 'save()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      }
    };
    //=========================================================================================================
    js_type_of = function(x) {
      return ((Object.prototype.toString.call(x)).slice(8, -1)).toLowerCase();
    };
    isa_keymethod_proxy = Symbol('proxy');
    //---------------------------------------------------------------------------------------------------------
    isa = function(type, ...xP) {
      /* NOTE realistic method should throw error when `type` not in `specs` */
      urge(`µ1129 object ${rpr(this.instance_name)} isa ${rpr(type)} called with ${rpr(xP)}`);
      urge(`µ1129 my @specs: ${rpr(this.specs)}`);
      return urge(`µ1129 spec for type ${rpr(type)}: ${rpr(this.specs[type])}`);
    };
    Intertype = (function() {
      //---------------------------------------------------------------------------------------------------------
      class Intertype extends Multimix {
        //-------------------------------------------------------------------------------------------------------
        constructor(instance_name) {
          var ref, type, value;
          super();
          this.instance_name = instance_name;
          this.specs = {};
          ref = this.constructor.base_types;
          for (type in ref) {
            value = ref[type];
            this.declare(type, value);
          }
          this.isa = _get_keymethod_proxy(this, isa);
        }

        //-------------------------------------------------------------------------------------------------------
        declare(type, value) {
          whisper('µ7474', 'declare', type, rpr(value));
          return this.specs[type] = value;
        }

      };

      Intertype.extend(object_with_class_properties);

      Intertype.include(object_with_instance_properties);

      //-------------------------------------------------------------------------------------------------------
      Intertype.base_types = {
        foo: 'spec for type foo',
        bar: 'spec for type bar'
      };

      return Intertype;

    }).call(this);
    //#########################################################################################################
    intertype_1 = new Intertype();
    intertype_2 = new Intertype();
    info('µ002-1', Intertype.base_types);
    info('µ002-2', intertype_1.declare('new_on_it1', 'a new hope'));
    info('µ002-3', 'intertype_1.specs', intertype_1.specs);
    info('µ002-4', 'intertype_2.specs', intertype_2.specs);
    info('µ002-5', intertype_1.isa('new_on_it1', 1, 2, 3));
    info('µ002-6', intertype_1.isa.new_on_it1(1, 2, 3));
    info('µ002-7', intertype_2.isa('new_on_it1', 1, 2, 3));
    info('µ002-8', intertype_2.isa.new_on_it1(1, 2, 3));
    ({isa, declare} = intertype_1.export());
    info('µ002-9', isa('new_on_it1', 1, 2, 3));
    return info('µ002-10', isa.new_on_it1(1, 2, 3));
  };

  //-----------------------------------------------------------------------------------------------------------
  example_using_multimix = function() {
    var Intertype, Multimix, declare, intertype_1, intertype_2, isa, object_with_class_properties, object_with_instance_properties, target;
    Multimix = require('../..');
    //=========================================================================================================
    // SAMPLE OBJECTS WITH INSTANCE METHODS, STATIC METHODS
    //---------------------------------------------------------------------------------------------------------
    object_with_class_properties = {
      find: function(id) {
        var k;
        return info("class method 'find()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      },
      create: function(attrs) {
        var k;
        return info("class method 'create()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      }
    };
    //---------------------------------------------------------------------------------------------------------
    object_with_instance_properties = {
      save: function() {
        var k;
        return info("instance method 'save()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      },
      find: function() {
        var k;
        return info("instance method 'find()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      }
    };
    //=========================================================================================================
    // CLASS DECLARATION
    //---------------------------------------------------------------------------------------------------------
    isa = function(type, ...xP) {
      /* NOTE realistic method should throw error when `type` not in `specs` */
      urge(`µ1129 object ${rpr(this.instance_name)} isa ${rpr(type)} called with ${rpr(xP)}`);
      urge(`µ1129 my @specs: ${rpr(this.specs)}`);
      return urge(`µ1129 spec for type ${rpr(type)}: ${rpr(this.specs[type])}`);
    };
    Intertype = (function() {
      //---------------------------------------------------------------------------------------------------------
      class Intertype extends Multimix {
        //-------------------------------------------------------------------------------------------------------
        constructor(instance_name) {
          var ref, type, value;
          super();
          this.instance_name = instance_name;
          this.specs = {};
          ref = this.constructor.base_types;
          for (type in ref) {
            value = ref[type];
            this.declare(type, value);
          }
          this.isa = Multimix.get_keymethod_proxy(this, isa);
        }

        //-------------------------------------------------------------------------------------------------------
        declare(type, value) {
          whisper('µ7474', 'declare', type, rpr(value));
          return this.specs[type] = value;
        }

      };

      Intertype.extend(object_with_class_properties, {
        overwrite: true
      });

      Intertype.include(object_with_instance_properties, {
        overwrite: true
      });

      //-------------------------------------------------------------------------------------------------------
      Intertype.base_types = {
        foo: 'spec for type foo',
        bar: 'spec for type bar'
      };

      return Intertype;

    }).call(this);
    //#########################################################################################################
    target = {};
    intertype_1 = new Intertype(target);
    intertype_2 = new Intertype();
    info('µ002-1', Intertype.base_types);
    info('µ002-2', intertype_1.declare('new_on_it1', 'a new hope'));
    info('µ002-3', 'intertype_1.specs', intertype_1.specs);
    info('µ002-4', 'intertype_2.specs', intertype_2.specs);
    info('µ002-5', intertype_1.isa('new_on_it1', 1, 2, 3));
    info('µ002-6', intertype_1.isa.new_on_it1(1, 2, 3));
    info('µ002-7', intertype_2.isa('new_on_it1', 1, 2, 3));
    info('µ002-8', intertype_2.isa.new_on_it1(1, 2, 3));
    target = {};
    ({isa, declare} = intertype_1.export(target));
    info('µ002-9', isa('new_on_it1', 1, 2, 3));
    info('µ002-10', isa.new_on_it1(1, 2, 3));
    info('µ002-11', target.isa('new_on_it1', 1, 2, 3));
    info('µ002-12', target.isa.new_on_it1(1, 2, 3));
    info('µ002-13', intertype_1.find());
    info('µ002-14', intertype_2.find());
    debug(target);
    return debug(intertype_2);
  };

  //-----------------------------------------------------------------------------------------------------------
  example_for_overwrite_false = function() {
    var Intertype, Multimix, error, isa, object_with_class_properties, object_with_instance_properties;
    Multimix = require('../..');
    //=========================================================================================================
    // SAMPLE OBJECTS WITH INSTANCE METHODS, STATIC METHODS
    //---------------------------------------------------------------------------------------------------------
    object_with_class_properties = {
      find: function(id) {
        var k;
        return info("class method 'find()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      },
      create: function(attrs) {
        var k;
        return info("class method 'create()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      }
    };
    //---------------------------------------------------------------------------------------------------------
    object_with_instance_properties = {
      save: function() {
        var k;
        return info("instance method 'save()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      },
      find: function() {
        var k;
        return info("instance method 'find()'", (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
      }
    };
    //=========================================================================================================
    // CLASS DECLARATION
    //---------------------------------------------------------------------------------------------------------
    isa = function(type, ...xP) {
      /* NOTE realistic method should throw error when `type` not in `specs` */
      urge(`µ1129 object ${rpr(this.instance_name)} isa ${rpr(type)} called with ${rpr(xP)}`);
      urge(`µ1129 my @specs: ${rpr(this.specs)}`);
      return urge(`µ1129 spec for type ${rpr(type)}: ${rpr(this.specs[type])}`);
    };
    try {
      Intertype = (function() {
        //---------------------------------------------------------------------------------------------------------
        class Intertype extends Multimix {};

        Intertype.extend(object_with_class_properties, {
          overwrite: false
        });

        Intertype.include(object_with_instance_properties, {
          overwrite: false
        });

        return Intertype;

      }).call(this);
    } catch (error1) {
      // intertype = new Intertype()
      error = error1;
      warn(error.message);
    }
    return null;
  };

  //###########################################################################################################
  if (module.parent == null) {
    // raw_example()
    // rewritten_example()
    example_using_multimix();
    example_for_overwrite_false();
  }

}).call(this);

//# sourceMappingURL=demo.js.map
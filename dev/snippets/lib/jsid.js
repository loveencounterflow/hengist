(function() {
  'use strict';
  var CND, CRYPTO, alert, badge, debug, help, info, isa, jr, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'JSID';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  jr = JSON.stringify;

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate} = types.export());

  //...........................................................................................................
  CRYPTO = require('crypto');

  //...........................................................................................................
  this.registry = new WeakMap();

  this.object_count = 0;

  this.salt = 'arbitrary';

  //-----------------------------------------------------------------------------------------------------------
  this.id_of = function(x) {
    var R, error, type, v;
    if (x === null) {
      return 'null:0';
    }
    if (x === void 0) {
      return 'undefined:0';
    }
    if (x === false) {
      return 'boolean:f';
    }
    if (x === true) {
      return 'boolean:t';
    }
    if (x === +2e308) {
      return 'infinity:p';
    }
    if (x === -2e308) {
      return 'infinity:n';
    }
    if (Number.isNaN(x)) {
      return 'nan:0';
    }
    if ((R = this.registry.get(x)) != null) {
      return R;
    }
    this.object_count++;
    R = `object:${this.object_count}`;
    try {
      this.registry.set(x, R);
      return R;
    } catch (error1) {
      error = error1;
      if (error.name !== 'TypeError') {
        throw error;
      }
    }
    this.object_count--;
    switch (type = type_of(x)) {
      case 'text':
        v = ((CRYPTO.createHash('sha1')).update(x)).digest('hex');
        break;
      default:
        v = rpr(x);
    }
    return `${type}:${v}`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function(x) {
    return help(CND.yellow(rpr(x)), CND.blue(rpr(this.id_of(x))));
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var d;
      this.demo('helo');
      this.demo('42');
      this.demo(42);
      this.demo(2e308);
      this.demo(-2e308);
      this.demo(new Date());
      this.demo(void 0);
      d = {
        x: 42
      };
      this.demo(d);
      this.demo({
        x: 42
      });
      this.demo(Object.freeze(d));
      this.demo(true);
      this.demo(false);
      this.demo(0/0);
      this.demo(0/0);
      this.demo(new Boolean(true));
      this.demo(new Boolean(true));
      return this.demo(new Boolean(false));
    })();
  }

}).call(this);

//# sourceMappingURL=jsid.js.map
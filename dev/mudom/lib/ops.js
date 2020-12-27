(function() {
  var CND, INTERTYPE, Intermatic, after, debug, log, rpr, sleep;

  globalThis.µ = require('mudom');

  CND = require('cnd');

  INTERTYPE = require('intertype');

  Intermatic = require('intermatic');

  log = console.log;

  debug = console.debug;

  rpr = CND.rpr;

  after = function(dts, f) {
    return setTimeout(f, dts * 1000);
  };

  sleep = function(dts) {
    return new Promise(function(done) {
      return after(dts, done);
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  µ.DOM.ready(function() {
    var _keys_from_button, keynames, update_button;
    //---------------------------------------------------------------------------------------------------------
    _keys_from_button = function(button) {
      switch (µ.DOM.get(button, 'latching')) {
        case 'toggle':
          return ['up', 'down', 'toggle'];
        case 'latch':
          return ['up', 'down', 'latch'];
        case 'both':
          return ['up', 'down', 'toggle', 'latch'];
        case 'tlatch':
          return ['up', 'down', 'tlatch'];
      }
      return ['up', 'down'];
    };
    //---------------------------------------------------------------------------------------------------------
    update_button = (button, name, state) => {
      var classes, i, key, len, ref, ref1, text;
      text = `${name} `;
      ref = _keys_from_button(button);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if (!((ref1 = state[key]) != null ? ref1 : false)) {
          continue;
        }
        text += `${key} `;
      }
      // log '^4443^', ( µ.DOM.get button, 'id' ), name, state
      classes = `btn ${text}`;
      button.innerHTML = text;
      µ.DOM.set(button, 'class', classes);
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    keynames = null;
    (() => {
      var button;
      keynames = (function() {
        var i, len, ref, results;
        ref = µ.DOM.select_all('.btn');
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          button = ref[i];
          results.push(µ.DOM.get(button, 'name'));
        }
        return results;
      })();
      return keynames = [...(new Set(keynames))];
    })();
    (() => {      //.........................................................................................................
      var behavior, i, j, keyname, len, len1, ref;
//.......................................................................................................
      for (i = 0, len = keynames.length; i < len; i++) {
        keyname = keynames[i];
        ref = ['up', 'down', 'toggle', 'latch', 'tlatch'];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          behavior = ref[j];
          ((keyname, behavior) => {
            //.................................................................................................
            debug('^ops@4453^', {keyname, behavior});
            µ.KB._listen_to_key(keyname, behavior, (d) => {
              var button, k, len2, ref1;
              ref1 = µ.DOM.select_all(`.btn[name=${keyname}]`);
              for (k = 0, len2 = ref1.length; k < len2; k++) {
                button = ref1[k];
                update_button(button, keyname, d.state);
              }
              return null;
            });
            //.................................................................................................
            return null;
          })(keyname, behavior);
        }
      }
      return null;
    })();
    //.........................................................................................................
    return null;
  });

}).call(this);

//# sourceMappingURL=ops.js.map
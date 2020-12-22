(function() {
  var CND, INTERTYPE, Intermatic, after, log, rpr, sleep, update_button;

  globalThis.µ = require('mudom');

  CND = require('cnd');

  INTERTYPE = require('intertype');

  Intermatic = require('intermatic');

  log = console.log;

  rpr = CND.rpr;

  after = function(dts, f) {
    return setTimeout(f, dts * 1000);
  };

  sleep = function(dts) {
    return new Promise(function(done) {
      return after(dts, done);
    });
  };

  log({Intermatic});

  // log { INTERTYPE, }
  // log new INTERTYPE.Intertype()
  // log CND.rpr( Array.from( 'abcd' ) )
  log(Array.from('abcd'));

  // ### NOTE `require` with local file *must* use file extension
  /*
  µ.KB.XXXXXXXXXXXX_foobar()
  µ.DOM.on document, 'µ_kb_capslock_changed', ( event ) =>
    log '^33334^', "µ_kb_capslock_changed", event.detail
    return null

  µ.DOM.on document, 'µ_kb_modifier_changed', ( event ) =>
    log '^33334^', "µ_kb_modifier_changed", event.detail
    for key, value of event.detail
      continue if key.startsWith '_'
      selector  = "[name=#{key}]"
      btn       = µ.DOM.select selector, null
      continue unless btn?
      log '^344^', key, rpr value, selector
      switch value
        when true then  µ.DOM.swap_class btn, 'false', 'true'
        when false then µ.DOM.swap_class btn, 'true',  'false'
        else µ.DOM.insert_as_last btn, rpr value
    return null
  */
  //-----------------------------------------------------------------------------------------------------------
  µ.DOM.ready(function() {
    var button, i, len, ref;
    ref = µ.DOM.select_all('.btn');
    for (i = 0, len = ref.length; i < len; i++) {
      button = ref[i];
      (function(button) {
        var keyname;
        keyname = µ.DOM.get(button, 'name');
        µ.KB._listen_to_key(keyname, 'down', function(d) {
          return update_button(button, keyname, d.state);
        });
        µ.KB._listen_to_key(keyname, 'up', function(d) {
          return update_button(button, keyname, d.state);
        });
        µ.KB._listen_to_key(keyname, 'double', function(d) {
          return update_button(button, keyname, d.state);
        });
        //.....................................................................................................
        return null;
      })(button);
    }
    // log '^44454^', µ.KB._registry
    return null;
  });

  //-----------------------------------------------------------------------------------------------------------
  update_button = (button, name, state) => {
    var classes, k, text, v;
    text = `${name} `;
    text += ((function() {
      var results;
      results = [];
      for (k in state) {
        v = state[k];
        if (v) {
          results.push(k);
        }
      }
      return results;
    })()).join(' ');
    classes = `btn ${text}`;
    µ.DOM.set(button, 'class', classes);
    button.innerHTML = text;
    return null;
  };

  // µ.KB._listen_to_key 'Alt',      'down',   handler
// µ.KB._listen_to_key 'ä',        'down',   handler
// µ.KB._listen_to_key 'Shift',    'up',     handler
// µ.KB._listen_to_key 'Shift',    'down',   handler
// µ.KB._listen_to_key 'Shift',    'double', handler
// µ.KB._listen_to_key 'Alt',      'double', handler
// µ.KB._listen_to_key 'AltGraph', 'double', handler
// # µ.KB._listen_to_key 'Alt', null,   ( d ) => log "^22209^ 'Alt', null,   ", d
// # µ.KB._listen_to_key null, 'down',  ( d ) => log "^22209^ null, 'down',  ", d

  // µ.KB._listen_to_key null, null,    ( d ) => log "^22209^ null, null,    ", d

}).call(this);

//# sourceMappingURL=ops.js.map
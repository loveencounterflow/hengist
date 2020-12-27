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
    var keynames, update_button;
    // #---------------------------------------------------------------------------------------------------------
    // _keys_from_button = ( button ) ->
    //   switch µ.DOM.get button, 'latching'
    //     when 'toggle' then  return  [ 'up', 'down', 'toggle', ]
    //     when 'latch'  then  return  [ 'up', 'down', 'latch', ]
    //     when 'both'   then  return  [ 'up', 'down', 'toggle', 'latch', ]
    //     when 'tlatch' then  return  [ 'up', 'down', 'tlatch', ]
    //   return                        [ 'up', 'down', ]

    //---------------------------------------------------------------------------------------------------------
    update_button = (button, keyname, behavior, state) => {
      if (state) {
        button.innerHTML = `${keyname} ${behavior}`;
        µ.DOM.add_class(button, behavior);
      } else {
        button.innerHTML = `${keyname} <strike>${behavior}</strike>`;
        µ.DOM.remove_class(button, behavior);
      }
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
      var all_buttons, behavior, button, buttons, i, j, k, keyname, len, len1, len2, ref;
      //.......................................................................................................
      // debug '^3646346^', µ.DOM.select_all '.btn'
      all_buttons = [...(µ.DOM.select_all('.btn'))];
      for (i = 0, len = keynames.length; i < len; i++) {
        keyname = keynames[i];
        ref = ['push', 'toggle', 'latch', 'tlatch'];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          behavior = ref[j];
          // debug '^ops@4453^', { keyname, behavior, }
          buttons = all_buttons.filter((x) => {
            return keyname === µ.DOM.get(x, 'name');
          });
          buttons = (function() {
            switch (behavior) {
              case 'push':
                return buttons;
              case 'toggle':
                return buttons.filter((x) => {
                  var ref1;
                  return (ref1 = µ.DOM.get(x, 'latching')) === 'both' || ref1 === 'toggle';
                });
              case 'latch':
                return buttons.filter((x) => {
                  var ref1;
                  return (ref1 = µ.DOM.get(x, 'latching')) === 'both' || ref1 === 'latch';
                });
              case 'tlatch':
                return buttons.filter((x) => {
                  return (µ.DOM.get(x, 'latching')) === 'tlatch';
                });
            }
          }).call(this);
// debug '^ops@338^', { keyname, behavior, buttons, }
          for (k = 0, len2 = buttons.length; k < len2; k++) {
            button = buttons[k];
            ((keyname, behavior, button) => {
              //...............................................................................................
              µ.KB._listen_to_key(keyname, behavior, (d) => {
                if (behavior === 'latch') {
                  debug('^ops@338^', {
                    keyname,
                    behavior,
                    state: d.state,
                    d
                  });
                }
                update_button(button, keyname, behavior, d.state);
                return null;
              });
              return null;
            })(keyname, behavior, button);
          }
        }
      }
      //.................................................................................................
      return null;
    })();
    //.........................................................................................................
    return null;
  });

}).call(this);

//# sourceMappingURL=ops.js.map
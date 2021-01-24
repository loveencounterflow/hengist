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
    var demo_toggling_etc, get_mbmcd_state, keynames, setup, update_button, use_event_names, watch_modifiers;
    //---------------------------------------------------------------------------------------------------------
    keynames = null;
    //---------------------------------------------------------------------------------------------------------
    get_mbmcd_state = function() {
      return (µ.DOM.select('#mbmcd')).checked;
    };
    //---------------------------------------------------------------------------------------------------------
    setup = () => {
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
      keynames = [...(new Set(keynames))];
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    demo_toggling_etc = () => {
      var all_buttons, behavior, behaviors, button, buttons, i, keyname, len, results;
      all_buttons = [...(µ.DOM.select_all('.btn'))];
      behaviors = ['push', 'toggle', 'latch', 'tlatch', 'ptlatch', 'ntlatch'];
      results = [];
      for (i = 0, len = keynames.length; i < len; i++) {
        keyname = keynames[i];
        results.push((function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = behaviors.length; j < len1; j++) {
            behavior = behaviors[j];
            buttons = all_buttons.filter((x) => {
              return keyname === µ.DOM.get(x, 'name');
            });
            buttons = (function() {
              switch (behavior) {
                case 'push':
                  return buttons;
                case 'toggle':
                  return buttons.filter((x) => {
                    var ref;
                    return (ref = µ.DOM.get(x, 'latching')) === 'both' || ref === 'toggle';
                  });
                case 'latch':
                  return buttons.filter((x) => {
                    var ref;
                    return (ref = µ.DOM.get(x, 'latching')) === 'both' || ref === 'latch';
                  });
                case 'tlatch':
                  return buttons.filter((x) => {
                    return (µ.DOM.get(x, 'latching')) === 'tlatch';
                  });
                case 'ptlatch':
                  return buttons.filter((x) => {
                    return (µ.DOM.get(x, 'latching')) === 'ptlatch';
                  });
                case 'ntlatch':
                  return buttons.filter((x) => {
                    return (µ.DOM.get(x, 'latching')) === 'ntlatch';
                  });
              }
            }).call(this);
            results1.push((function() {
              var k, len2, results2;
              results2 = [];
              for (k = 0, len2 = buttons.length; k < len2; k++) {
                button = buttons[k];
                results2.push(((keyname, behavior, button) => {
                  µ.KB._listen_to_key(keyname, behavior, (d) => {
                    update_button(button, keyname, behavior, d.state);
                    return null;
                  });
                  return null;
                })(keyname, behavior, button));
              }
              return results2;
            }).call(this));
          }
          return results1;
        }).call(this));
      }
      return results;
    };
    //---------------------------------------------------------------------------------------------------------
    use_event_names = function() {
      var eventdetail_div, i, keyname, len;
// "y Y Space Alt AltGraph Control Meta Shift CapsLock".split /\s+/
/* Demo for using event names instead of callbacks: */
      for (i = 0, len = keynames.length; i < len; i++) {
        keyname = keynames[i];
        µ.KB._listen_to_key(keyname, 'toggle', 'pushed_key_y');
      }
      eventdetail_div = µ.DOM.select('#eventdetail');
      µ.DOM.on(document, 'pushed_key_y', (event) => {
        var detail_txt;
        detail_txt = rpr(event.detail);
        detail_txt = detail_txt.replace('event: { isTrusted: [Getter] }', 'event: ...');
        eventdetail_div.innerHTML = µ.TEXT._escape(`event.detail: ${detail_txt}`);
        return null;
      });
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    watch_modifiers = () => {
      var modblink_div;
      modblink_div = µ.DOM.select('#modblink');
      return µ.KB._listen_to_modifiers(function(d) {
        var eventname, key, key_div, state, use_mbmcd;
        // log '^9801^', d
        // log '^9801^', µ.KB._prv_modifiers
        µ.DOM.add_class(modblink_div, 'hilite');
        after(0.25, () => {
          return µ.DOM.remove_class(modblink_div, 'hilite');
        });
        // µ.DOM.on document, 'keydown'
        use_mbmcd = get_mbmcd_state();
        for (key in d) {
          state = d[key];
          if (key === '_type') {
            continue;
          }
          if (use_mbmcd) {
            eventname = state ? 'keydown' : 'keyup';
            document.dispatchEvent(new KeyboardEvent(eventname, {key}));
          }
          key_div = µ.DOM.select(`.lamp[name=${key}]`);
          if (state) {
            µ.DOM.add_class(key_div, 'push');
          } else {
            µ.DOM.remove_class(key_div, 'push');
          }
        }
        return null;
      });
    };
    //---------------------------------------------------------------------------------------------------------
    update_button = (button, keyname, behavior, state) => {
      if (state) {
        // button.innerHTML = "#{keyname} #{behavior}"
        µ.DOM.add_class(button, behavior);
      } else {
        // button.innerHTML = "#{keyname} <strike>#{behavior}</strike>"
        µ.DOM.remove_class(button, behavior);
      }
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    setup();
    demo_toggling_etc();
    use_event_names();
    watch_modifiers();
    //.........................................................................................................
    return null;
  });

}).call(this);

//# sourceMappingURL=ops.js.map
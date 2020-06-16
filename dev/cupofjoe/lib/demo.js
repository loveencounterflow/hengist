(function() {
  'use strict';
  var CND, after, alert, badge, debug, defer, equals, help, info, isa, log, rpr, sleep, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'CUPOFJOE/DEMO';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  //...........................................................................................................
  // types                     = require '../types'
  ({isa, validate, equals, type_of} = (new (require('intertype')).Intertype()).export());

  //...........................................................................................................
  defer = setImmediate;

  after = function(dts, f) {
    return setTimeout(f, dts * 1000);
  };

  sleep = function(dts) {
    return new Promise(function(done) {
      return after(dts, done);
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_0 = function() {
    var Cupofjoe, c;
    ({Cupofjoe} = require('../../../apps/cupofjoe'));
    //.........................................................................................................
    whisper('-'.repeat(108));
    c = new Cupofjoe();
    c.cram('a', 'b', 'c');
    urge('^4454-1^', {
      collector: c.collector
    });
    info('^4454-1^', c.expand());
    urge('^4454-3^', {
      collector: c.collector
    });
    //.........................................................................................................
    whisper('-'.repeat(108));
    c = new Cupofjoe();
    c.cram('a', 'b', 'c', function() {
      return c.cram('d');
    });
    urge('^4454-4^', {
      collector: c.collector
    });
    info('^4454-5^', c.expand());
    urge('^4454-6^', {
      collector: c.collector
    });
    //.........................................................................................................
    whisper('-'.repeat(108));
    c = new Cupofjoe();
    c.cram(function() {
      return c.cram('a', 'b', 'c', function() {
        return c.cram('d');
      });
    });
    urge('^4454-7^', {
      collector: c.collector
    });
    info('^4454-8^', c.expand());
    urge('^4454-9^', {
      collector: c.collector
    });
    //.........................................................................................................
    whisper('-'.repeat(108));
    c = new Cupofjoe({
      expand_early: true
    });
    c = new Cupofjoe({
      expand_early: false
    });
    c.cram(function() {
      c.cram('a', 1);
      c.cram('b', 2);
      c.cram('c', 3);
      return c.cram(4, function() {
        c.cram('d');
        return c.cram('e');
      });
    });
    urge('^4454-10^', {
      collector: c.collector
    });
    info('^4454-11^', c.expand());
    urge('^4454-12^', {
      collector: c.collector
    });
    c.cram('XXX');
    info('^4454-13^', c.expand());
    c.clear();
    c.cram('YYY');
    info('^4454-14^', c.expand());
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_1 = function() {
    var Cupofjoe, cram, cupofjoe, ds, expand;
    ({Cupofjoe} = require('../../../apps/cupofjoe'));
    cupofjoe = new Cupofjoe({
      flatten: false
    });
    ({cram, expand} = cupofjoe.export());
    //.........................................................................................................
    cram(null, function() {
      cram('pre1');
      cram('pre2', 'wat');
      cram('one', function() {
        cram('two', 42);
        return cram('three', function() {
          return cram('four', function() {
            return cram('five', function() {
              return cram('six');
            });
          });
        });
      });
      return cram('post');
    });
    help(rpr(cupofjoe));
    ds = expand();
    info(rpr(ds));
    info(jr(ds.flat(2e308)));
    // urge '^4443^', ds
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_2 = function() {
    var DATOM, cram, cupofjoe, ds, expand, h, lets, new_datom, select;
    cupofjoe = new (require('../../../apps/cupofjoe')).Cupofjoe();
    ({cram, expand} = cupofjoe.export());
    //.........................................................................................................
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    //.........................................................................................................
    h = function(tagname, ...content) {
      var d, d1, d2;
      if (content.length === 0) {
        d = new_datom(`^${tagname}`);
        return cram(d, ...content);
      }
      d1 = new_datom(`<${tagname}`);
      d2 = new_datom(`>${tagname}`);
      return cram(d1, ...content, d2);
    };
    //.........................................................................................................
    cram(null, function() {
      h('pre1');
      cram(null);
      h('pre2', 'wat');
      h('one', function() {
        h('two', new_datom('^text', {
          text: '42'
        }));
        return h('three', function() {
          return h('four', function() {
            return h('five', function() {
              return h('six', function() {
                return cram(new_datom('^text', {
                  text: 'bottom'
                }));
              });
            });
          });
        });
      });
      return h('post');
    });
    // urge rpr cupofjoe.collector
    ds = expand();
    info(jr(ds));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_toy_formatter_1 = function() {
    var Cupofjoe, c, ds, format;
    ({Cupofjoe} = require('../../../apps/cupofjoe'));
    c = new Cupofjoe();
    //.........................................................................................................
    format = function(list) {
      var R, d, i, idx, last_idx, len, tagname;
      last_idx = list.length - 1;
      R = [];
      tagname = null;
      for (idx = i = 0, len = list.length; i < len; idx = ++i) {
        d = list[idx];
        if (isa.list(d)) {
          // R = [ R..., ( format d )..., ]
          R.splice(R.length, 0, ...(format(d)));
          continue;
        }
        if (!isa.text(d)) {
          d = rpr(d);
        }
        if (idx === 0) {
          tagname = d;
          R.push(idx === last_idx ? `<${tagname}/>` : `<${tagname}>`);
        } else {
          R.push(d);
        }
      }
      if ((tagname != null) && last_idx > 0) {
        R.push(`</${tagname}>`);
      }
      return R.join('');
    };
    //.........................................................................................................
    c.cram(function() {
      c.cram('alpha', 'ONE');
      c.cram('beta', 'TWO');
      c.cram(null);
      c.cram('gamma');
      return c.cram('delta', function() {
        c.cram('eta');
        return c.cram('theta');
      });
    });
    info('^4454-2^', ds = c.expand());
    info('^4454-3^', format(ds));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_toy_formatter_2 = function() {
    var Cupofjoe, as_datoms, c, ds;
    ({Cupofjoe} = require('../../../apps/cupofjoe'));
    c = new Cupofjoe();
    //.........................................................................................................
    as_datoms = function(list) {
      var R, d, i, idx, last_idx, len, tagname;
      last_idx = list.length - 1;
      R = [];
      tagname = null;
      for (idx = i = 0, len = list.length; i < len; idx = ++i) {
        d = list[idx];
        if (isa.list(d)) {
          // R = [ R..., ( as_datoms d )..., ]
          R.splice(R.length, 0, ...(as_datoms(d)));
          continue;
        }
        if (!isa.text(d)) {
          d = rpr(d);
        }
        if (idx === 0) {
          tagname = d;
          R.push(idx === last_idx ? `<${tagname}/>` : `<${tagname}>`);
        } else {
          R.push(d);
        }
      }
      if ((tagname != null) && last_idx > 0) {
        R.push(`</${tagname}>`);
      }
      return R.join('');
    };
    //.........................................................................................................
    c.cram(function() {
      c.cram('alpha', 'ONE');
      c.cram('beta', 'TWO');
      c.cram(null);
      c.cram('gamma');
      return c.cram('delta', function() {
        c.cram('eta');
        return c.cram('theta');
      });
    });
    info('^4454-4^', "c.collector:  ", c.collector);
    info('^4454-5^', ds = c.expand());
    info('^4454-6^', as_datoms(ds));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_simple = function() {
    var Cupofjoe, c, collector, ds;
    ({Cupofjoe} = require('../../../apps/cupofjoe'));
    c = new Cupofjoe();
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram('one');
    collector = CND.deep_copy(c.collector);
    info('^4454-8^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram('one', 'two');
    collector = CND.deep_copy(c.collector);
    info('^4454-10^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram('one', function() {
      return c.cram('two');
    });
    collector = CND.deep_copy(c.collector);
    info('^4454-12^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram('one');
    c.cram('two');
    collector = CND.deep_copy(c.collector);
    info('^4454-14^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram(function() {
      return c.cram(function() {
        return c.cram('one');
      });
    });
    collector = CND.deep_copy(c.collector);
    info('^4454-16^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram(function() {
      return c.cram(function() {
        return c.cram('one');
      });
    });
    c.cram('two');
    collector = CND.deep_copy(c.collector);
    info('^4454-18^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram(function() {
      return c.cram(function() {
        return 'one';
      });
    });
    c.cram('two');
    collector = CND.deep_copy(c.collector);
    info('^4454-20^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    whisper('---------------------------------');
    c.cram('h1', "Heading One");
    // c.cram 'p', "Paragraph with ", ( c.cram 'strong', "bold text" ), " in it." ### wrong ###
    c.cram('p', "Paragraph with ", (function() {
      return c.cram('strong', "bold text");
    }), " in it.");
    /* the same, except when using customized crammer, which is why we use them: */
    c.cram('p', "Paragraph with ", ['strong', "bold text"], " in it.");
    collector = CND.deep_copy(c.collector);
    info('^4454-20^', ds = c.expand());
    if (!equals(collector, ds)) {
      urge(CND.reverse(collector));
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["CUP demo 2 flat"] = function(T, done) {
    var DATOM, cram, cupofjoe, ds, expand, h, lets, new_datom, select;
    cupofjoe = new (require('../../../apps/cupofjoe')).Cupofjoe({
      flatten: true
    });
    ({cram, expand} = cupofjoe.export());
    //.........................................................................................................
    DATOM = new (require('datom')).Datom({
      dirty: false
    });
    ({new_datom, lets, select} = DATOM.export());
    //.........................................................................................................
    h = function(tagname, ...content) {
      var d, d1, d2;
      if (content.length === 0) {
        d = new_datom(`^${tagname}`);
        return cram(d, ...content);
      }
      d1 = new_datom(`<${tagname}`);
      d2 = new_datom(`>${tagname}`);
      return cram(d1, ...content, d2);
    };
    //.........................................................................................................
    cram(null, function() {
      h('pre1');
      cram(null);
      h('pre2', 'wat');
      h('one', function() {
        h('two', new_datom('^text', {
          text: '42'
        }));
        return h('three', function() {
          return h('four', function() {
            return h('five', function() {
              return h('six', function() {
                return cram(new_datom('^text', {
                  text: 'bottom'
                }));
              });
            });
          });
        });
      });
      return h('post');
    });
    urge(rpr(cupofjoe.collector));
    ds = expand();
    info(jr(ds));
    T.eq(ds, [
      {
        '$key': '^pre1'
      },
      {
        '$key': '<pre2'
      },
      'wat',
      {
        '$key': '>pre2'
      },
      {
        '$key': '<one'
      },
      {
        '$key': '<two'
      },
      {
        text: '42',
        '$key': '^text'
      },
      {
        '$key': '>two'
      },
      {
        '$key': '<three'
      },
      {
        '$key': '<four'
      },
      {
        '$key': '<five'
      },
      {
        '$key': '<six'
      },
      {
        text: 'bottom',
        '$key': '^text'
      },
      {
        '$key': '>six'
      },
      {
        '$key': '>five'
      },
      {
        '$key': '>four'
      },
      {
        '$key': '>three'
      },
      {
        '$key': '>one'
      },
      {
        '$key': '^post'
      }
    ]);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["CUP demo reformat"] = function(T, done) {
    var cram, cupofjoe, expand, h, html;
    cupofjoe = new (require('../../../apps/cupofjoe')).Cupofjoe({
      flatten: true
    });
    ({cram, expand} = cupofjoe.export());
    //.........................................................................................................
    h = function(tagname, ...content) {
      if ((tagname == null) || (tagname === 'text')) {
        return cram(...content);
      }
      if (content.length === 0) {
        return cram(`<${tagname}/>`);
      }
      return cram(`<${tagname}>`, ...content, `</${tagname}>`);
    };
    //.........................................................................................................
    h('paper', function() {
      h('article', function() {
        h('title', "Some Thoughts on Nested Data Structures");
        return h('par', function() {
          h('text', "A interesting ");
          h('em', "fact");
          h('text', " about CupOfJoe is that you ");
          h('em', "can");
          return h('text', " nest with both sequences and function calls.");
        });
      });
      return h('conclusion', function() {
        return h('text', "With CupOfJoe, you don't need brackets.");
      });
    });
    html = expand().join('|');
    info(jr(html));
    // info html
    T.eq(html, "<paper>|<article>|<title>|Some Thoughts on Nested Data Structures|</title>|<par>|A interesting |<em>|fact|</em>| about CupOfJoe is that you |<em>|can|</em>| nest with both sequences and function calls.|</par>|</article>|<conclusion>|With CupOfJoe, you don't need brackets.|</conclusion>|</paper>");
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_0()
      // @demo_1()
      // @demo_2()
      this.demo_toy_formatter_1();
      this.demo_toy_formatter_2();
      return this.demo_simple();
    })();
  }

}).call(this);

//# sourceMappingURL=demo.js.map
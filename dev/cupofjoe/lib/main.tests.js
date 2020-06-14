(function() {
  'use strict';
  var CND, alert, badge, debug, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'CUPOFJOE/TESTS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  //...........................................................................................................
  // # types                     = require '../types'
  // { isa
  //   validate
  //   type_of }               = ( new ( require 'intertype' ).Intertype() ).export()
  //...........................................................................................................
  // CUPOFJOE                 = require '../../../apps/cupofjoe'
  ({jr} = CND);

  test = require('guy-test');

  //-----------------------------------------------------------------------------------------------------------
  this["CUP demo 1"] = function(T, done) {
    var Cupofjoe, cram, cupofjoe, ds, expand;
    // debug ( k for k of ( require '../../../apps/cupofjoe' ) ); process.exit 1
    ({Cupofjoe} = require('../../../apps/cupofjoe'));
    cupofjoe = new Cupofjoe();
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
    T.eq(ds, [['pre1'], ['pre2', 'wat'], ['one', ['two', 42], ['three', ['four', ['five', ['six']]]]], ['post']]);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["CUP demo 2"] = function(T, done) {
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
    urge(rpr(cupofjoe.collector));
    ds = expand();
    info(jr(ds));
    T.eq(ds, [
      [
        {
          '$key': '^pre1'
        }
      ],
      [
        {
          '$key': '<pre2'
        },
        'wat',
        {
          '$key': '>pre2'
        }
      ],
      [
        {
          '$key': '<one'
        },
        [
          {
            '$key': '<two'
          },
          {
            text: '42',
            '$key': '^text'
          },
          {
            '$key': '>two'
          }
        ],
        [
          {
            '$key': '<three'
          },
          [
            {
              '$key': '<four'
            },
            [
              {
                '$key': '<five'
              },
              [
                {
                  '$key': '<six'
                },
                [
                  {
                    text: 'bottom',
                    '$key': '^text'
                  }
                ],
                {
                  '$key': '>six'
                }
              ],
              {
                '$key': '>five'
              }
            ],
            {
              '$key': '>four'
            }
          ],
          {
            '$key': '>three'
          }
        ],
        {
          '$key': '>one'
        }
      ],
      [
        {
          '$key': '^post'
        }
      ]
    ]);
    if (done != null) {
      //.........................................................................................................
      return done();
    }
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

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_CUP cram w/out functions" ] = ( T, done ) ->
  //   # debug ( k for k of ( require '../../../apps/cupofjoe' ) ); process.exit 1
  //   cupofjoe = new ( require '../../../apps/cupofjoe' ).Cupofjoe()
  //   { cram
  //     expand }  = cupofjoe.export()
  //   #.........................................................................................................
  //   cram null
  //   cram null, null
  //   cram 'first'
  //   cram [ 'one', ]
  //   cram 'two', 'three', 'four'
  //   cram undefined, null
  //   cram 'five', 'six', 'seven', 'eight'
  //   result = expand()
  //   urge '^7777^', result
  //   T.eq result, ["first","one",["two","three","four"],["five","six","seven","eight"]]
  //   cram 'ten'
  //   result = expand()
  //   T.eq result, ["first","one",["two","three","four"],["five","six","seven","eight"],["ten"]]
  //   #.........................................................................................................
  //   done() if done?

  //-----------------------------------------------------------------------------------------------------------
  this["CUP _unwrap"] = async function(T, done) {
    var _unwrap, cupofjoe, error, expand, i, len, matcher, probe, probes_and_matchers;
    cupofjoe = new (require('../../../apps/cupofjoe')).Cupofjoe();
    ({_unwrap, expand} = cupofjoe.export());
    //.........................................................................................................
    probes_and_matchers = [[[], [], null], [[null], [null], null], [[null, null], [null, null], null], [[null, null, void 0], [null, null, void 0], null], [[null, null, []], [null, null, []], null], [[null, null, [[]]], [null, null, [[]]], null], [[['foo']], ['foo'], null], [['a', 'b', ['c']], ['a', 'b', ['c']], null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(_unwrap(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "CUP cram w/out functions" ]
// @[ "CUP demo 1" ]()
// test @[ "expand()" ]
// test @[ "CUP configuration" ]
// test @[ "CUP demo 2" ]

}).call(this);

//# sourceMappingURL=main.tests.js.map
(function() {
  'use strict';
  var CND, GUY, H, INTERTEXT, alert, badge, debug, demo, demo_streaming, echo, help, info, isa, jr, lets, log, rpr, test, type_of, urge, warn, whisper;

  // coffeelint: disable=max_line_length

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/INTERIM-TESTS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  //...........................................................................................................
  test = require('guy-test');

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  ({isa, type_of} = INTERTEXT.types);

  ({lets} = (require('datom')).export());

  H = require('./test-helpers');

  GUY = require('../../../apps/guy');

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  // @[ "API" ] = ( T, done ) ->
  //   grammar       = require './grammar'
  //   grammar  = require './../paragate/lib/htmlish.grammar'
  //   debug '^34334^', rpr ( k for k of grammar )
  //   debug '^34334^', rpr ( k for k of grammar )
  //   # urge grammar.parse """<title>Helo Worlds</title>"""
  //   return done()

  //-----------------------------------------------------------------------------------------------------------
  this["HTML: parse (1)"] = async function(T, done) {
    var HTML, error, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    probes_and_matchers = [
      [
        '<!DOCTYPE html>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<!DOCTYPE html>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '^doctype',
            start: 0,
            stop: 15,
            text: '<!DOCTYPE html>',
            '$vnr': [1,
          1]
          },
          {
            '$key': '>document',
            start: 15,
            stop: 15,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<!DOCTYPE obvious>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<!DOCTYPE obvious>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '^doctype',
            start: 0,
            stop: 18,
            text: '<!DOCTYPE obvious>',
            '$vnr': [1,
          1]
          },
          {
            '$key': '>document',
            start: 18,
            stop: 18,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<title>Helo Worlds</title>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<title>Helo Worlds</title>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'title',
            type: 'otag',
            text: '<title>',
            start: 0,
            stop: 7,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 7,
            stop: 18,
            text: 'Helo Worlds',
            '$vnr': [1,
          8]
          },
          {
            '$key': '>tag',
            name: 'title',
            type: 'ctag',
            text: '</title>',
            start: 18,
            stop: 26,
            '$vnr': [1,
          19]
          },
          {
            '$key': '>document',
            start: 26,
            stop: 26,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<img width=200>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<img width=200>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'img',
            type: 'otag',
            text: '<img width=200>',
            start: 0,
            stop: 15,
            atrs: {
              width: '200'
            },
            '$vnr': [1,
          1]
          },
          {
            '$key': '>document',
            start: 15,
            stop: 15,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<foo/>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<foo/>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '^tag',
            name: 'foo',
            type: 'stag',
            text: '<foo/>',
            start: 0,
            stop: 6,
            '$vnr': [1,
          1]
          },
          {
            '$key': '>document',
            start: 6,
            stop: 6,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<foo></foo>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<foo></foo>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'foo',
            type: 'otag',
            text: '<foo>',
            start: 0,
            stop: 5,
            '$vnr': [1,
          1]
          },
          {
            '$key': '>tag',
            name: 'foo',
            type: 'ctag',
            text: '</foo>',
            start: 5,
            stop: 11,
            '$vnr': [1,
          6]
          },
          {
            '$key': '>document',
            start: 11,
            stop: 11,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<p>here and<br></br>there</p>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<p>here and<br></br>there</p>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'br',
            type: 'otag',
            text: '<br>',
            start: 11,
            stop: 15,
            '$vnr': [1,
          12]
          },
          {
            '$key': '>tag',
            name: 'br',
            type: 'ctag',
            text: '</br>',
            start: 15,
            stop: 20,
            '$vnr': [1,
          16]
          },
          {
            '$key': '^text',
            start: 20,
            stop: 25,
            text: 'there',
            '$vnr': [1,
          21]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 25,
            stop: 29,
            '$vnr': [1,
          26]
          },
          {
            '$key': '>document',
            start: 29,
            stop: 29,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<p>here and<br>there',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<p>here and<br>there',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'br',
            type: 'otag',
            text: '<br>',
            start: 11,
            stop: 15,
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 15,
            stop: 20,
            text: 'there',
            '$vnr': [1,
          16]
          },
          {
            '$key': '>document',
            start: 20,
            stop: 20,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<p>here and<br>there</p>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<p>here and<br>there</p>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'br',
            type: 'otag',
            text: '<br>',
            start: 11,
            stop: 15,
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 15,
            stop: 20,
            text: 'there',
            '$vnr': [1,
          16]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 20,
            stop: 24,
            '$vnr': [1,
          21]
          },
          {
            '$key': '>document',
            start: 24,
            stop: 24,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<p>here and<br x=42/>there</p>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<p>here and<br x=42/>there</p>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '^tag',
            name: 'br',
            type: 'stag',
            text: '<br x=42/>',
            start: 11,
            stop: 21,
            atrs: {
              x: '42'
            },
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 21,
            stop: 26,
            text: 'there',
            '$vnr': [1,
          22]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 26,
            stop: 30,
            '$vnr': [1,
          27]
          },
          {
            '$key': '>document',
            start: 30,
            stop: 30,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<p>here and<br/>there</p>',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<p>here and<br/>there</p>',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '^tag',
            name: 'br',
            type: 'stag',
            text: '<br/>',
            start: 11,
            stop: 16,
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 16,
            stop: 21,
            text: 'there',
            '$vnr': [1,
          17]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 21,
            stop: 25,
            '$vnr': [1,
          22]
          },
          {
            '$key': '>document',
            start: 25,
            stop: 25,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        'just some plain text',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: 'just some plain text',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '^text',
            start: 0,
            stop: 20,
            text: 'just some plain text',
            '$vnr': [1,
          1]
          },
          {
            '$key': '>document',
            start: 20,
            stop: 20,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '<p>one<p>two',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 0,
            source: '<p>one<p>two',
            errors: [],
            '$vnr': [-2e308]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 6,
            text: 'one',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 6,
            stop: 9,
            '$vnr': [1,
          7]
          },
          {
            '$key': '^text',
            start: 9,
            stop: 12,
            text: 'two',
            '$vnr': [1,
          10]
          },
          {
            '$key': '>document',
            start: 12,
            stop: 12,
            '$vnr': [2e308]
          }
        ],
        null
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(H.delete_refs(HTML.grammar.parse(probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML: parse (1a)"] = async function(T, done) {
    var HTML, error, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    probes_and_matchers = [['<!DOCTYPE html>', "$key='^doctype',$vnr=[ 1, 1 ],start=0,stop=15,text='<!DOCTYPE html>'", null], ['<!DOCTYPE obvious>', "$key='^doctype',$vnr=[ 1, 1 ],start=0,stop=18,text='<!DOCTYPE obvious>'", null], ['<title>Helo Worlds</title>', "$key='<tag',$vnr=[ 1, 1 ],name='title',start=0,stop=7,text='<title>',type='otag'#$key='^text',$vnr=[ 1, 8 ],start=7,stop=18,text='Helo Worlds'#$key='>tag',$vnr=[ 1, 19 ],name='title',start=18,stop=26,text='</title>',type='ctag'", null], ['<img width=200>', "$key='<tag',$vnr=[ 1, 1 ],atrs={ width: '200' },name='img',start=0,stop=15,text='<img width=200>',type='otag'", null], ['<foo/>', "$key='^tag',$vnr=[ 1, 1 ],name='foo',start=0,stop=6,text='<foo/>',type='stag'", null], ['<foo></foo>', "$key='<tag',$vnr=[ 1, 1 ],name='foo',start=0,stop=5,text='<foo>',type='otag'#$key='>tag',$vnr=[ 1, 6 ],name='foo',start=5,stop=11,text='</foo>',type='ctag'", null], ['<p>here and<br></br>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='<tag',$vnr=[ 1, 12 ],name='br',start=11,stop=15,text='<br>',type='otag'#$key='>tag',$vnr=[ 1, 16 ],name='br',start=15,stop=20,text='</br>',type='ctag'#$key='^text',$vnr=[ 1, 21 ],start=20,stop=25,text='there'#$key='>tag',$vnr=[ 1, 26 ],name='p',start=25,stop=29,text='</p>',type='ctag'", null], ['<p>here and<br>there', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='<tag',$vnr=[ 1, 12 ],name='br',start=11,stop=15,text='<br>',type='otag'#$key='^text',$vnr=[ 1, 16 ],start=15,stop=20,text='there'", null], ['<p>here and<br>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='<tag',$vnr=[ 1, 12 ],name='br',start=11,stop=15,text='<br>',type='otag'#$key='^text',$vnr=[ 1, 16 ],start=15,stop=20,text='there'#$key='>tag',$vnr=[ 1, 21 ],name='p',start=20,stop=24,text='</p>',type='ctag'", null], ['<p>here and<br x=42/>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='^tag',$vnr=[ 1, 12 ],atrs={ x: '42' },name='br',start=11,stop=21,text='<br x=42/>',type='stag'#$key='^text',$vnr=[ 1, 22 ],start=21,stop=26,text='there'#$key='>tag',$vnr=[ 1, 27 ],name='p',start=26,stop=30,text='</p>',type='ctag'", null], ['<p>here and<br/>there</p>', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=11,text='here and'#$key='^tag',$vnr=[ 1, 12 ],name='br',start=11,stop=16,text='<br/>',type='stag'#$key='^text',$vnr=[ 1, 17 ],start=16,stop=21,text='there'#$key='>tag',$vnr=[ 1, 22 ],name='p',start=21,stop=25,text='</p>',type='ctag'", null], ['just some plain text', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=20,text='just some plain text'", null], ['<p>one<p>two', "$key='<tag',$vnr=[ 1, 1 ],name='p',start=0,stop=3,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=6,text='one'#$key='<tag',$vnr=[ 1, 7 ],name='p',start=6,stop=9,text='<p>',type='otag'#$key='^text',$vnr=[ 1, 10 ],start=9,stop=12,text='two'", null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(H.condense_tokens(HTML.grammar.parse(probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML: parse bare"] = async function(T, done) {
    var HTML, error, grammar, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    probes_and_matchers = [
      [
        '<!DOCTYPE html>',
        [
          {
            '$key': '^doctype',
            start: 0,
            stop: 15,
            text: '<!DOCTYPE html>',
            '$vnr': [1,
          1]
          }
        ],
        null
      ],
      [
        '<!DOCTYPE obvious>',
        [
          {
            '$key': '^doctype',
            start: 0,
            stop: 18,
            text: '<!DOCTYPE obvious>',
            '$vnr': [1,
          1]
          }
        ],
        null
      ],
      [
        '<title>Helo Worlds</title>',
        [
          {
            '$key': '<tag',
            name: 'title',
            type: 'otag',
            text: '<title>',
            start: 0,
            stop: 7,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 7,
            stop: 18,
            text: 'Helo Worlds',
            '$vnr': [1,
          8]
          },
          {
            '$key': '>tag',
            name: 'title',
            type: 'ctag',
            text: '</title>',
            start: 18,
            stop: 26,
            '$vnr': [1,
          19]
          }
        ],
        null
      ],
      [
        '<img width=200>',
        [
          {
            '$key': '<tag',
            name: 'img',
            type: 'otag',
            text: '<img width=200>',
            start: 0,
            stop: 15,
            atrs: {
              width: '200'
            },
            '$vnr': [1,
          1]
          }
        ],
        null
      ],
      [
        '<foo/>',
        [
          {
            '$key': '^tag',
            name: 'foo',
            type: 'stag',
            text: '<foo/>',
            start: 0,
            stop: 6,
            '$vnr': [1,
          1]
          }
        ],
        null
      ],
      [
        '<foo></foo>',
        [
          {
            '$key': '<tag',
            name: 'foo',
            type: 'otag',
            text: '<foo>',
            start: 0,
            stop: 5,
            '$vnr': [1,
          1]
          },
          {
            '$key': '>tag',
            name: 'foo',
            type: 'ctag',
            text: '</foo>',
            start: 5,
            stop: 11,
            '$vnr': [1,
          6]
          }
        ],
        null
      ],
      [
        '<p>here and<br></br>there</p>',
        [
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'br',
            type: 'otag',
            text: '<br>',
            start: 11,
            stop: 15,
            '$vnr': [1,
          12]
          },
          {
            '$key': '>tag',
            name: 'br',
            type: 'ctag',
            text: '</br>',
            start: 15,
            stop: 20,
            '$vnr': [1,
          16]
          },
          {
            '$key': '^text',
            start: 20,
            stop: 25,
            text: 'there',
            '$vnr': [1,
          21]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 25,
            stop: 29,
            '$vnr': [1,
          26]
          }
        ],
        null
      ],
      [
        '<p>here and<br>there',
        [
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'br',
            type: 'otag',
            text: '<br>',
            start: 11,
            stop: 15,
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 15,
            stop: 20,
            text: 'there',
            '$vnr': [1,
          16]
          }
        ],
        null
      ],
      [
        '<p>here and<br>there</p>',
        [
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'br',
            type: 'otag',
            text: '<br>',
            start: 11,
            stop: 15,
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 15,
            stop: 20,
            text: 'there',
            '$vnr': [1,
          16]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 20,
            stop: 24,
            '$vnr': [1,
          21]
          }
        ],
        null
      ],
      [
        '<p>here and<br x=42/>there</p>',
        [
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '^tag',
            name: 'br',
            type: 'stag',
            text: '<br x=42/>',
            start: 11,
            stop: 21,
            atrs: {
              x: '42'
            },
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 21,
            stop: 26,
            text: 'there',
            '$vnr': [1,
          22]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 26,
            stop: 30,
            '$vnr': [1,
          27]
          }
        ],
        null
      ],
      [
        '<p>here and<br/>there</p>',
        [
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 11,
            text: 'here and',
            '$vnr': [1,
          4]
          },
          {
            '$key': '^tag',
            name: 'br',
            type: 'stag',
            text: '<br/>',
            start: 11,
            stop: 16,
            '$vnr': [1,
          12]
          },
          {
            '$key': '^text',
            start: 16,
            stop: 21,
            text: 'there',
            '$vnr': [1,
          17]
          },
          {
            '$key': '>tag',
            name: 'p',
            type: 'ctag',
            text: '</p>',
            start: 21,
            stop: 25,
            '$vnr': [1,
          22]
          }
        ],
        null
      ],
      [
        'just some plain text',
        [
          {
            '$key': '^text',
            start: 0,
            stop: 20,
            text: 'just some plain text',
            '$vnr': [1,
          1]
          }
        ],
        null
      ],
      [
        '<p>one<p>two',
        [
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 0,
            stop: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^text',
            start: 3,
            stop: 6,
            text: 'one',
            '$vnr': [1,
          4]
          },
          {
            '$key': '<tag',
            name: 'p',
            type: 'otag',
            text: '<p>',
            start: 6,
            stop: 9,
            '$vnr': [1,
          7]
          },
          {
            '$key': '^text',
            start: 9,
            stop: 12,
            text: 'two',
            '$vnr': [1,
          10]
          }
        ],
        null
      ]
    ];
    grammar = new HTML.new_grammar({
      bare: true
    });
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(H.delete_refs(grammar.parse(probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML: $parse"] = function(T, done) {
    var HTML, SP, pipeline, source;
    SP = require('steampipes');
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    //.........................................................................................................
    source = ["<title>A Short Document</title>", "<p>The Nemean lion (<ipa>/nɪˈmiːən/</ipa>; Greek: <greek>Νεμέος λέων</greek> Neméos léōn; ", "Latin: Leo Nemeaeus) was a vicious monster in <a href='greek-mythology'>Greek mythology</a> ", "that lived at Nemea.", "</p>"];
    pipeline = [];
    pipeline.push(source);
    pipeline.push(HTML.$parse());
    pipeline.push(SP.$watch(function(d) {
      return info(d);
    }));
    pipeline.push(SP.$drain(function(ds) {
      var result;
      result = H.delete_refs(ds);
      T.eq(result, [
        {
          '$vnr': [1,
        0],
          '$key': '^newline'
        },
        {
          '$key': '<tag',
          name: 'title',
          type: 'otag',
          text: '<title>',
          start: 0,
          stop: 7,
          '$vnr': [1,
        1]
        },
        {
          '$key': '^text',
          start: 7,
          stop: 23,
          text: 'A Short Document',
          '$vnr': [1,
        8]
        },
        {
          '$key': '>tag',
          name: 'title',
          type: 'ctag',
          text: '</title>',
          start: 23,
          stop: 31,
          '$vnr': [1,
        24]
        },
        {
          '$vnr': [2,
        0],
          '$key': '^newline'
        },
        {
          '$key': '<tag',
          name: 'p',
          type: 'otag',
          text: '<p>',
          start: 0,
          stop: 3,
          '$vnr': [2,
        1]
        },
        {
          '$key': '^text',
          start: 3,
          stop: 20,
          text: 'The Nemean lion (',
          '$vnr': [2,
        4]
        },
        {
          '$key': '<tag',
          name: 'ipa',
          type: 'otag',
          text: '<ipa>',
          start: 20,
          stop: 25,
          '$vnr': [2,
        21]
        },
        {
          '$key': '^text',
          start: 25,
          stop: 35,
          text: '/nɪˈmiːən/',
          '$vnr': [2,
        26]
        },
        {
          '$key': '>tag',
          name: 'ipa',
          type: 'ctag',
          text: '</ipa>',
          start: 35,
          stop: 41,
          '$vnr': [2,
        36]
        },
        {
          '$key': '^text',
          start: 41,
          stop: 50,
          text: '; Greek: ',
          '$vnr': [2,
        42]
        },
        {
          '$key': '<tag',
          name: 'greek',
          type: 'otag',
          text: '<greek>',
          start: 50,
          stop: 57,
          '$vnr': [2,
        51]
        },
        {
          '$key': '^text',
          start: 57,
          stop: 68,
          text: 'Νεμέος λέων',
          '$vnr': [2,
        58]
        },
        {
          '$key': '>tag',
          name: 'greek',
          type: 'ctag',
          text: '</greek>',
          start: 68,
          stop: 76,
          '$vnr': [2,
        69]
        },
        {
          '$key': '^text',
          start: 76,
          stop: 90,
          text: ' Neméos léōn; ',
          '$vnr': [2,
        77]
        },
        {
          '$vnr': [3,
        0],
          '$key': '^newline'
        },
        {
          '$key': '^text',
          start: 0,
          stop: 46,
          text: 'Latin: Leo Nemeaeus) was a vicious monster in ',
          '$vnr': [3,
        1]
        },
        {
          '$key': '<tag',
          name: 'a',
          type: 'otag',
          text: "<a href='greek-mythology'>",
          start: 46,
          stop: 72,
          atrs: {
            href: "'greek-mythology'"
          },
          '$vnr': [3,
        47]
        },
        {
          '$key': '^text',
          start: 72,
          stop: 87,
          text: 'Greek mythology',
          '$vnr': [3,
        73]
        },
        {
          '$key': '>tag',
          name: 'a',
          type: 'ctag',
          text: '</a>',
          start: 87,
          stop: 91,
          '$vnr': [3,
        88]
        },
        {
          '$key': '^text',
          start: 91,
          stop: 92,
          text: ' ',
          '$vnr': [3,
        92]
        },
        {
          '$vnr': [4,
        0],
          '$key': '^newline'
        },
        {
          '$key': '^text',
          start: 0,
          stop: 20,
          text: 'that lived at Nemea.',
          '$vnr': [4,
        1]
        },
        {
          '$vnr': [5,
        0],
          '$key': '^newline'
        },
        {
          '$key': '>tag',
          name: 'p',
          type: 'ctag',
          text: '</p>',
          start: 0,
          stop: 4,
          '$vnr': [5,
        1]
        }
      ]);
      return done();
    }));
    SP.pull(...pipeline);
    return null;
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML: parse (dubious)"] = async function(T, done) {
    var HTML, error, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    probes_and_matchers = [['< >', "$key='<tag',$vnr=[ 1, 1 ],start=0,stop=3,text='< >',type='otag'#$key='^error',$vnr=[ 1, 3 ],chvtname='MismatchedTokenException',code='mismatch',origin='parser',start=2,stop=3,text='>'", null], ['< x >', "$key='<tag',$vnr=[ 1, 1 ],name='x',start=0,stop=5,text='< x >',type='otag'", null], ['</x>', "$key='>tag',$vnr=[ 1, 1 ],name='x',start=0,stop=4,text='</x>',type='ctag'", null], ['</x >', "$key='>tag',$vnr=[ 1, 1 ],name='x',start=0,stop=5,text='</x >',type='ctag'", null], ['</ x>', "$key='>tag',$vnr=[ 1, 1 ],name='x',start=0,stop=5,text='</ x>',type='ctag'", null], ['< / x >', "$key='<tag',$vnr=[ 1, 1 ],start=0,stop=3,text='< /',type='ntag'#$key='^error',$vnr=[ 1, 3 ],chvtname='MismatchedTokenException',code='mismatch',origin='parser',start=2,stop=3,text='/'#$key='^text',$vnr=[ 1, 4 ],start=3,stop=7,text=' x >'", null], ['<>', "$key='<tag',$vnr=[ 1, 1 ],start=0,stop=2,text='<>',type='otag'#$key='^error',$vnr=[ 1, 2 ],chvtname='MismatchedTokenException',code='mismatch',origin='parser',start=1,stop=2,text='>'", null], ['<', "$key='^error',$vnr=[ 1, 1 ],chvtname='MismatchedTokenException',code='mismatch',origin='parser',start=0,stop=1,text='<'", null], ['<tag', "$key='<tag',$vnr=[ 1, 1 ],name='tag',start=0,stop=4,text='<tag'#$key='^error',$vnr=[ 1, 2 ],chvtname='NoViableAltException',code='missing',origin='parser',start=1,stop=4,text='tag'", null], ['if <math> a > b </math> then', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=3,text='if '#$key='<tag',$vnr=[ 1, 4 ],name='math',start=3,stop=9,text='<math>',type='otag'#$key='^text',$vnr=[ 1, 10 ],start=9,stop=16,text=' a > b '#$key='>tag',$vnr=[ 1, 17 ],name='math',start=16,stop=23,text='</math>',type='ctag'#$key='^text',$vnr=[ 1, 24 ],start=23,stop=28,text=' then'", null], ['>', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=1,text='>'", null], ['&', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=1,text='&'", null], ['&amp;', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=5,text='&amp;'", null], ["<tag a='<'>", `$key='<tag',$vnr=[ 1, 1 ],atrs={ a: "'<'" },name='tag',start=0,stop=11,text="<tag a='<'>",type='otag'`, null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(H.condense_tokens(HTML.grammar.parse(probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML: parse escaped"] = async function(T, done) {
    var HTML, error, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    probes_and_matchers = [['<div>', "$key='<tag',$vnr=[ 1, 1 ],name='div',start=0,stop=5,text='<div>',type='otag'", null], ['?[div]', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=6,text='?[div]'", null], ['before ?[div] after', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=19,text='before ?[div] after'", null], ['\\<div>', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=6,text='\\\\<div>'", null], ['before \\<div> after', "$key='^text',$vnr=[ 1, 1 ],start=0,stop=19,text='before \\\\<div> after'", null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(H.condense_tokens(HTML.grammar.parse(probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HTML: quotes in attribute values"] = async function(T, done) {
    var HTML, error, grammar, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    grammar = new HTML.new_grammar({
      bare: true
    });
    probes_and_matchers = [['<div x=1>', '1'], ['<div x="1">', '1'], ["<div x='1'>", '1'], [`<div x='"1"'>`, '"1"'], [`<div x="'1'">`, "'1'"], [`<div x="'">`, "'"], [`<div x='"'>`, '"'], [`<div x>`, true]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var ref, ref1, ref2;
          return resolve((ref = grammar.parse(probe)) != null ? (ref1 = ref[0]) != null ? (ref2 = ref1.atrs) != null ? ref2.x : void 0 : void 0 : void 0);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "HTML.$datoms_from_html" ] = ( T, done ) ->
  //   INTERTEXT                 = require '../..'
  //   { HTML, }                 = INTERTEXT
  //   SP                        = require 'steampipes'
  //   # SP                        = require '../../apps/steampipes'
  //   { $
  //     $async
  //     $drain
  //     $watch
  //     $show  }                = SP.export()
  //   #.........................................................................................................
  //   probe         = """
  //     <p>A <em>concise</em> introduction to the things discussed below.</p>
  //     """
  //   matcher = [{"$key":"<p"},{"text":"A ","$key":"^text"},{"$key":"<em"},{"text":"concise","$key":"^text"},{"$key":">em"},{"text":" introduction to the things discussed below.","$key":"^text"},{"$key":">p"}]
  //   #.........................................................................................................
  //   pipeline      = []
  //   pipeline.push [ ( Buffer.from probe ), ]
  //   pipeline.push SP.$split()
  //   pipeline.push HTML.$datoms_from_html()
  //   pipeline.push $show()
  //   pipeline.push $drain ( result ) =>
  //     help jr result
  //     T.eq result, matcher
  //     done()
  //   SP.pull pipeline...
  //   #.........................................................................................................
  //   return null

  //###########################################################################################################
  //###########################################################################################################
  //###########################################################################################################
  //###########################################################################################################

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "HTML.datoms_from_html (1)" ] = ( T, done ) ->
  //   INTERTEXT                 = require '../../../apps/intertext'
  //   { HTML, }                 = INTERTEXT
  //   probes_and_matchers = [
  //     ["<!DOCTYPE html>",[{"$key":"^report","source":"<!DOCTYPE html>","errors":[]},{"$key":"^DOCTYPE","text":"<!DOCTYPE html>","start":0,"stop":15,"escaped":true}],null]
  //     ["<!DOCTYPE obvious>",[{"$key":"^report","source":"<!DOCTYPE obvious>","errors":[]},{"$key":"^DOCTYPE","text":"<!DOCTYPE obvious>","start":0,"stop":18,"escaped":true}],null]
  //     ["<img width=200>",[{"$key":"^report","source":"<img width=200>","errors":[]},{"$key":"<tag","name":"img","type":"otag","text":"<img width=200>","start":0,"stop":15,"atrs":{"width":"200"}}],null]
  //     ["<foo/>",[{"$key":"^report","source":"<foo/>","errors":[]},{"$key":"<tag","name":"foo","type":"stag","text":"<foo/>","start":0,"stop":6}],null]
  //     ["<foo></foo>",[{"$key":"^report","source":"<foo></foo>","errors":[]},{"$key":"<tag","name":"foo","type":"otag","text":"<foo>","start":0,"stop":5},{"$key":">tag","name":"foo","type":"ctag","text":"</foo>","start":5,"stop":11}],null]
  //     ["<p>here and<br></br>there</p>",[{"$key":"^report","source":"<p>here and<br></br>there</p>","errors":[]},{"$key":"<tag","name":"p","type":"otag","text":"<p>","start":0,"stop":3},{"$key":"^text","text":"here and","start":3,"stop":11},{"$key":"<tag","name":"br","type":"otag","text":"<br>","start":11,"stop":15},{"$key":">tag","name":"br","type":"ctag","text":"</br>","start":15,"stop":20},{"$key":"^text","text":"there","start":20,"stop":25},{"$key":">tag","name":"p","type":"ctag","text":"</p>","start":25,"stop":29}],null]
  //     ["<p>here and<br>there",[{"$key":"^report","source":"<p>here and<br>there","errors":[]},{"$key":"<tag","name":"p","type":"otag","text":"<p>","start":0,"stop":3},{"$key":"^text","text":"here and","start":3,"stop":11},{"$key":"<tag","name":"br","type":"otag","text":"<br>","start":11,"stop":15},{"$key":"^text","text":"there","start":15,"stop":20}],null]
  //     ["<p>here and<br>there</p>",[{"$key":"^report","source":"<p>here and<br>there</p>","errors":[]},{"$key":"<tag","name":"p","type":"otag","text":"<p>","start":0,"stop":3},{"$key":"^text","text":"here and","start":3,"stop":11},{"$key":"<tag","name":"br","type":"otag","text":"<br>","start":11,"stop":15},{"$key":"^text","text":"there","start":15,"stop":20},{"$key":">tag","name":"p","type":"ctag","text":"</p>","start":20,"stop":24}],null]
  //     ["<p>here and<br x=42/>there</p>",[{"$key":"^report","source":"<p>here and<br x=42/>there</p>","errors":[]},{"$key":"<tag","name":"p","type":"otag","text":"<p>","start":0,"stop":3},{"$key":"^text","text":"here and","start":3,"stop":11},{"$key":"<tag","name":"br","type":"stag","text":"<br x=42/>","start":11,"stop":21,"atrs":{"x":"42"}},{"$key":"^text","text":"there","start":21,"stop":26},{"$key":">tag","name":"p","type":"ctag","text":"</p>","start":26,"stop":30}],null]
  //     ["<p>here and<br/>there</p>",[{"$key":"^report","source":"<p>here and<br/>there</p>","errors":[]},{"$key":"<tag","name":"p","type":"otag","text":"<p>","start":0,"stop":3},{"$key":"^text","text":"here and","start":3,"stop":11},{"$key":"<tag","name":"br","type":"stag","text":"<br/>","start":11,"stop":16},{"$key":"^text","text":"there","start":16,"stop":21},{"$key":">tag","name":"p","type":"ctag","text":"</p>","start":21,"stop":25}],null]
  //     ["just some plain text",[{"$key":"^report","source":"just some plain text","errors":[]},{"$key":"^text","text":"just some plain text","start":0,"stop":20}],null]
  //     ["<p>one<p>two",[{"$key":"^report","source":"<p>one<p>two","errors":[]},{"$key":"<tag","name":"p","type":"otag","text":"<p>","start":0,"stop":3},{"$key":"^text","text":"one","start":3,"stop":6},{"$key":"<tag","name":"p","type":"otag","text":"<p>","start":6,"stop":9},{"$key":"^text","text":"two","start":9,"stop":12}],null]
  //     ]
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
  //       resolve HTML.datoms_from_html probe
  //   #.........................................................................................................
  //   done()
  //   return null

  // ###
  // #-----------------------------------------------------------------------------------------------------------
  // probes_and_matchers = [
  //   ["<!DOCTYPE html>",[{"data":{"html":true},"$key":"<!DOCTYPE"}],null]
  //   ["<title>MKTS</title>",[{"$key":"<title"},{"text":"MKTS","$key":"^text"},{"$key":">title"}],null]
  //   ["<document/>",[{"$key":"<document"},{"$key":">document"}],null]
  //   ["<foo bar baz=42>",[{"data":{"bar":true,"baz":"42"},"$key":"<foo"}],null]
  //   ["<br/>",[{"$key":"^br"}],null]
  //   ["</thing>",[{"$key":">thing"}],null]
  //   ["</foo>",[{"$key":">foo"}],null]
  //   ["</document>",[{"$key":">document"}],null]
  //   ["<title>MKTS</title>",[{"$key":"<title"},{"text":"MKTS","$key":"^text"},{"$key":">title"}],null]
  //   ["<p foo bar=42>omg</p>",[{"data":{"foo":true,"bar":"42"},"is_block":true,"$key":"<p"},{"text":"omg","$key":"^text"},{"is_block":true,"$key":">p"}],null]
  //   ["<document/><foo bar baz=42>something<br/>else</thing></foo>",[{"$key":"<document"},{"$key":">document"},{"data":{"bar":true,"baz":"42"},"$key":"<foo"},{"text":"something","$key":"^text"},{"$key":"^br"},{"text":"else","$key":"^text"},{"$key":">thing"},{"$key":">foo"}],null]
  //   ["<!DOCTYPE html><html lang=en><head><title>x</title></head><p data-x='<'>helo</p></html>",[{"data":{"html":true},"$key":"<!DOCTYPE"},{"data":{"lang":"en"},"$key":"<html"},{"$key":"<head"},{"$key":"<title"},{"text":"x","$key":"^text"},{"$key":">title"},{"$key":">head"},{"data":{"data-x":"<"},"is_block":true,"$key":"<p"},{"text":"helo","$key":"^text"},{"is_block":true,"$key":">p"},{"$key":">html"}],null]
  //   ["<p foo bar=42><em>Yaffir stood high</em></p>",[{"data":{"foo":true,"bar":"42"},"is_block":true,"$key":"<p"},{"$key":"<em"},{"text":"Yaffir stood high","$key":"^text"},{"$key":">em"},{"is_block":true,"$key":">p"}],null]
  //   ["<p foo bar=42><em><xxxxxxxxxxxxxxxxxxx>Yaffir stood high</p>",[{"data":{"foo":true,"bar":"42"},"is_block":true,"$key":"<p"},{"$key":"<em"},{"$key":"<xxxxxxxxxxxxxxxxxxx"},{"text":"Yaffir stood high","$key":"^text"},{"is_block":true,"$key":">p"}],null]
  //   ["<p föö bär=42><em>Yaffir stood high</p>",[{"data":{"föö":true,"bär":"42"},"is_block":true,"$key":"<p"},{"$key":"<em"},{"text":"Yaffir stood high","$key":"^text"},{"is_block":true,"$key":">p"}],null]
  //   ["<document 文=zh/><foo bar baz=42>something<br/>else</thing></foo>",[{"data":{"文":"zh"},"$key":"<document"},{"$key":">document"},{"data":{"bar":true,"baz":"42"},"$key":"<foo"},{"text":"something","$key":"^text"},{"$key":"^br"},{"text":"else","$key":"^text"},{"$key":">thing"},{"$key":">foo"}],null]
  //   ["<p foo bar=<>yeah</p>",[{"data":{"foo":true,"bar":"<"},"is_block":true,"$key":"<p"},{"text":"yeah","$key":"^text"},{"is_block":true,"$key":">p"}],null]
  //   ["<p foo bar='<'>yeah</p>",[{"data":{"foo":true,"bar":"<"},"is_block":true,"$key":"<p"},{"text":"yeah","$key":"^text"},{"is_block":true,"$key":">p"}],null]
  //   ["<p foo bar='&lt;'>yeah</p>",[{"data":{"foo":true,"bar":"&lt;"},"is_block":true,"$key":"<p"},{"text":"yeah","$key":"^text"},{"is_block":true,"$key":">p"}],null]
  //   ["<<<<<",[{"text":"<<<<","$key":"^text"}],null]
  //   ["something",[{"text":"something","$key":"^text"}],null]
  //   ["else",[{"text":"else","$key":"^text"}],null]
  //   ["<p>dangling",[{"is_block":true,"$key":"<p"},{"text":"dangling","$key":"^text"}],null]
  //   ["𦇻𦑛𦖵𦩮𦫦𧞈",[{"text":"𦇻𦑛𦖵𦩮𦫦𧞈","$key":"^text"}],null]
  //   ]

  // ###

  // # #-----------------------------------------------------------------------------------------------------------
  // # @[ "HTML.datoms_from_html (dubious)" ] = ( T, done ) ->
  // #   INTERTEXT                 = require '../../../apps/intertext'
  // #   { HTML, }                 = INTERTEXT
  // #   DEMO                      = require '../chevrotain-html/demo'
  // #   probes_and_matchers = [
  // #     ["< >","^error-MismatchedTokenException-mismatch-parser-2-2->",null]
  // #     ["< x >","<tag-x-0-5-< x >-otag",null]
  // #     ["<>","^error-MismatchedTokenException-mismatch-parser-1-1->",null]
  // #     ["<","^error-MismatchedTokenException-mismatch-parser-0-0-<",null]
  // #     ["<tag","^error-NoViableAltException-missing-parser-1-3-tag",null]
  // #     ["if <math> a > b </math> then","^text-0-3-if #<tag-math-3-9-<math>-otag#^text-9-16- a > b #>tag-math-16-23-</math>-ctag#^text-23-28- then",null]
  // #     [">","^text-0-1->",null]
  // #     ["&","^text-0-1-&",null]
  // #     ["&amp;","^text-0-5-&amp;",null]
  // #     ["<tag a='<'>","<tag-{\"a\":\"'<'\"}-tag-0-11-<tag a='<'>-otag",null]
  // #     ]
  // #   for [ probe, matcher, error, ] in probes_and_matchers
  // #     await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
  // #       resolve DEMO.H.condense_tokens HTML.datoms_from_html probe
  // #   #.........................................................................................................
  // #   done()
  // #   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "HTML.datoms_from_html (2)" ] = ( T, done ) ->
  //   INTERTEXT                 = require '../../../apps/intertext'
  //   { HTML, }                 = INTERTEXT
  //   probes_and_matchers = [
  //     ["<!DOCTYPE html>","<!DOCTYPE html>",null]
  //     # ["<!DOCTYPE obvious>","<!DOCTYPE obvious>",null]
  //     # ["<p contenteditable>","<p contenteditable>",null]
  //     # ["<dang z=Z a=A>","<dang a=A z=Z>",null]
  //     # ["<foo/>","<foo>|</foo>",null]
  //     # ["<foo></foo>","<foo>|</foo>",null]
  //     # ["just some plain text","just some plain text",null]
  //     # ["<p>one<p>two","<p>|one|<p>|two",null]
  //     # ["<p>here and</br>there","<p>|here and|there",null]
  //     # ["<img width=200>","<img width=200>",null]
  //     # ["<p>here and<br>there","<p>|here and|<br>|there",null]
  //     # ["<p>here and<br>there</p>","<p>|here and|<br>|there|</p>",null]
  //     # ["<p>here and<br/>there</p>","<p>|here and|<br>|there|</p>",null]
  //       # @parse """bare value: <t a=v>"""
  //       # @parse """bare value: <t a=v'w>"""
  //       # @parse """bare value: <t a=v"w>"""
  //       # @parse """squot value: <t a='v'>"""
  //       # @parse """dquot value: <t a="v">"""
  //       # @parse """squot value: <t a='"v"'>"""
  //       # @parse """dquot value: <t a="'v'">"""
  //     ]
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
  //       debug '^30^', datoms  = HTML.datoms_from_html probe
  //       urge '^30^',  html    = HTML.html_from_datoms datoms
  //       resolve ( HTML.html_from_datoms d for d in HTML.datoms_from_html probe ).join '|'
  //   #.........................................................................................................
  //   done()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "HTML.$datoms_from_html" ] = ( T, done ) ->
  //   INTERTEXT                 = require '../../../apps/intertext'
  //   { HTML, }                 = INTERTEXT
  //   SP                        = require 'steampipes'
  //   # SP                        = require '../../apps/steampipes'
  //   { $
  //     $async
  //     $drain
  //     $watch
  //     $show  }                = SP.export()
  //   #.........................................................................................................
  //   probe         = """
  //     <p>A <em>concise</em> introduction to the things discussed below.</p>
  //     """
  //   matcher = [{"$key":"<p"},{"text":"A ","$key":"^text"},{"$key":"<em"},{"text":"concise","$key":"^text"},{"$key":">em"},{"text":" introduction to the things discussed below.","$key":"^text"},{"$key":">p"}]
  //   #.........................................................................................................
  //   pipeline      = []
  //   pipeline.push [ ( Buffer.from probe ), ]
  //   pipeline.push SP.$split()
  //   pipeline.push HTML.$datoms_from_html()
  //   pipeline.push $show()
  //   pipeline.push $drain ( result ) =>
  //     help jr result
  //     T.eq result, matcher
  //     done()
  //   SP.pull pipeline...
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "HTML demo" ] = ( T, done ) ->
  //   INTERTEXT                 = require '../../../apps/intertext'
  //   { HTML, }                 = INTERTEXT
  //   text = """<!DOCTYPE html>
  //   <h1><strong>CHAPTER VI.</strong> <name ref=hd553>Humpty Dumpty</h1>

  //   <p id=p227>However, the egg only got larger and larger, and <em>more and more human</em>:<br>

  //   when she had come within a few yards of it, she saw that it had eyes and a nose and mouth; and when she
  //   had come close to it, she saw clearly that it was <name ref=hd556>HUMPTY DUMPTY</name> himself. ‘It can’t
  //   be anybody else!’ she said to herself.<br/>

  //   ‘I’m as certain of it, as if his name were written all over his face.’

  //   """
  //   for d in datoms = HTML.datoms_from_html text
  //     echo jr d
  //   echo '-'.repeat 108
  //   echo ( HTML.html_from_datoms d for d in datoms ).join ''
  //   #.........................................................................................................
  //   done()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "HTML demo (buffer)" ] = ( T, done ) ->
  //   INTERTEXT                 = require '../../../apps/intertext'
  //   { HTML, }                 = INTERTEXT
  //   text    = """<!DOCTYPE html>
  //   <h1><strong>CHAPTER VI.</strong> <name ref=hd553>Humpty Dumpty</h1>"""
  //   buffer  = Buffer.from text
  //   debug '^80009^', buffer
  //   for d in datoms = HTML.datoms_from_html buffer
  //     echo jr d
  //   echo '-'.repeat 108
  //   echo ( HTML.html_from_datoms d for d in datoms ).join ''
  //   #.........................................................................................................
  //   done()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_HTML demo (layout)" ] = ( T, done ) ->
  //   DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
  //   { new_datom
  //     lets
  //     select }                = DATOM.export()
  //   { tag
  //     html_from_datoms
  //     raw
  //     text
  //     script
  //     css }                   = ( require '../..' ).HTML.export()
  //   layout = ( settings ) ->
  //     defaults  = { title: "My App", content: ( new_datom '~content' ), }
  //     settings  = { defaults..., settings..., }
  //     # Doctype   = ( P... ) -> tag 'doctype',    P...
  //     # Div       = ( P... ) -> tag 'div',        P...
  //     # div       = ( P... ) -> tag 'div',        P...
  //     H = tag
  //     return [
  //       ( H 'doctype'                                             )
  //       H 'head', [
  //         ( H 'meta', charset: 'utf-8'                              )
  //         ( H 'title', settings.title                               )
  //         ( script    './jquery-3.4.1.js'                           )
  //         ( css       './jquery-ui-1.12.1/jquery-ui.min.css'        ) ]
  //       H 'body', [
  //         settings.content
  //         H 'article', [
  //           H 'h3', "Greetings"
  //           H 'p', "helo world!"
  //           ]
  //         H 'span#page-ready' ] ]
  //     # tag 'meta', 'http-equiv': "Content-Security-Policy", content: "default-src 'self'"
  //     # tag 'meta', 'http-equiv': "Content-Security-Policy", content: "script-src 'unsafe-inline'"
  //     return null
  //   #.........................................................................................................
  //   info html_from_datoms layout { title: "Beautiful HTML" }
  //   done() if done?
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "《现代常用独体字规范》" ] = ( T, done ) ->
  //   SP                        = require 'steampipes'
  //   # SP                        = require '../../apps/steampipes'
  //   { $
  //     $async
  //     $drain
  //     $watch
  //     $split
  //     $show  }                = SP.export()
  //   DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
  //   { new_datom
  //     lets
  //     select }                = DATOM.export()
  //   { tag
  //     datoms_from_html
  //     $datoms_from_html
  //     html_from_datoms
  //     raw
  //     text
  //     script
  //     css }                   = ( require '../..' ).HTML.export()
  //   html_source = """<div class="ie-fix"><span class="wkwm5edb3638">来自</span><style type="text/css">.wkwm5edb3638{display: none; font-size: 12px;}</style><p class="reader-word-layer reader-word-s1-1" style="width:144px;height:288px;line-height:288px;top:1260px;left:2890px;z-index:0;font-family:simsun;">&nbsp;
  // </p><span class="wkwm5edb3638">百度</span><p class="reader-word-layer reader-word-s1-0" style="width:3184px;height:288px;line-height:288px;top:1760px;left:2890px;z-index:1;font-family:'黑体','42c2b43eeefdc8d376ee32f60020001','黑体';letter-spacing:1.1300000000000001px;false">《现代常用独体字规范》</p><p class="reader-word-layer reader-word-s1-1" style="width:144px;height:288px;line-height:288px;top:1760px;left:6078px;z-index:2;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-4" style="width:835px;height:258px;line-height:258px;top:2282px;left:2644px;z-index:3;false">CF&nbsp;0013</p><p class="reader-word-layer reader-word-s1-6" style="width:480px;height:258px;line-height:258px;top:2282px;left:3481px;z-index:4;false">——</p><p class="reader-word-layer reader-word-s1-4" style="width:479px;height:258px;line-height:258px;top:2282px;left:3962px;z-index:5;letter-spacing:-0.37px;false">2009</p><p class="reader-word-layer reader-word-s1-6" style="width:721px;height:258px;line-height:258px;top:2282px;left:4441px;z-index:6;false">，一共</p><p class="reader-word-layer reader-word-s1-4" style="width:362px;height:258px;line-height:258px;top:2282px;left:5221px;z-index:7;letter-spacing:0.8999999999999999px;false">256</p><p class="reader-word-layer reader-word-s1-6" style="width:480px;height:258px;line-height:258px;top:2282px;left:5644px;z-index:8;false">个字</p><p class="reader-word-layer reader-word-s1-4" style="width:60px;height:258px;line-height:258px;top:2282px;left:6124px;z-index:9;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:2681px;left:1442px;z-index:10;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-10" style="width:384px;height:192px;line-height:192px;top:2994px;left:1442px;z-index:11;false">音序</p><p class="reader-word-layer reader-word-s1-9" style="width:192px;height:192px;line-height:192px;top:2994px;left:1827px;z-index:12;false">&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:384px;height:192px;line-height:192px;top:2994px;left:2019px;z-index:13;false">字数</p><p class="reader-word-layer reader-word-s1-9" style="width:577px;height:192px;line-height:192px;top:2994px;left:2403px;z-index:14;false">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:576px;height:192px;line-height:192px;top:2994px;left:2981px;z-index:15;false">独体字</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:192px;line-height:192px;top:2994px;left:3558px;z-index:16;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:3369px;left:1442px;z-index:17;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:319px;height:206px;line-height:206px;top:3369px;left:1586px;z-index:18;letter-spacing:-2.8000000000000003px;false">A&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:3369px;left:1954px;z-index:19;false">1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:192px;height:206px;line-height:206px;top:3369px;left:2434px;z-index:20;">凹</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:3369px;left:2629px;z-index:21;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:3744px;left:1442px;z-index:22;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:319px;height:206px;line-height:206px;top:3744px;left:1586px;z-index:23;letter-spacing:-0.32px;false">B&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:3744px;left:1954px;z-index:24;false">14&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10 reader-word-s1-11" style="width:2693px;height:206px;line-height:206px;top:3744px;left:2530px;z-index:25;font-family:'宋体','42c2b43eeefdc8d376ee32f60040001','宋体';false">八巴白百办半贝本匕必丙秉卜不</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:3744px;left:5225px;z-index:26;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:4119px;left:1442px;z-index:27;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9 reader-word-s1-11" style="width:321px;height:206px;line-height:206px;top:4119px;left:1586px;z-index:28;font-family:'Times New Roman','42c2b43eeefdc8d376ee32f60030001','Times New Roman';false">C&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:4119px;left:1955px;z-index:29;false">20&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:3845px;height:206px;line-height:206px;top:4119px;left:2532px;z-index:30;false">才册叉产长厂车臣承尺斥虫丑出川串垂匆囱寸</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:4119px;left:6379px;z-index:31;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:4494px;left:1442px;z-index:32;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-12" style="width:330px;height:206px;line-height:206px;top:4494px;left:1586px;z-index:33;false">D&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:4494px;left:1965px;z-index:34;false">10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1922px;height:206px;line-height:206px;top:4494px;left:2542px;z-index:35;false">大歹丹刀弟电刁丁东斗</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:4494px;left:4466px;z-index:36;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:4869px;left:1442px;z-index:37;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:309px;height:206px;line-height:206px;top:4869px;left:1586px;z-index:38;false">E&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:4869px;left:1944px;z-index:39;false">4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:769px;height:206px;line-height:206px;top:4869px;left:2425px;z-index:40;false">儿而耳二</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:4869px;left:3194px;z-index:41;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:5244px;left:1442px;z-index:42;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:297px;height:206px;line-height:206px;top:5244px;left:1586px;z-index:43;letter-spacing:-0.28px;false">F&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:5244px;left:1932px;z-index:44;false">8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1540px;height:206px;line-height:206px;top:5244px;left:2413px;z-index:45;letter-spacing:0.22999999999999998px;false">凡方飞丰夫弗甫父</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:5244px;left:3954px;z-index:46;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:5619px;left:1442px;z-index:47;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-12" style="width:330px;height:206px;line-height:206px;top:5619px;left:1586px;z-index:48;false">G&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:5619px;left:1965px;z-index:49;false">13&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:2499px;height:206px;line-height:206px;top:5619px;left:2542px;z-index:50;false">丐干甘戈革个更工弓瓜广鬼果</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:5619px;left:5043px;z-index:51;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:5994px;left:1442px;z-index:52;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-12" style="width:330px;height:206px;line-height:206px;top:5994px;left:1586px;z-index:53;false">H&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:5994px;left:1965px;z-index:54;false">6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1153px;height:206px;line-height:206px;top:5994px;left:2446px;z-index:55;false">亥禾乎互户火</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:5994px;left:3600px;z-index:56;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:6369px;left:1442px;z-index:57;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:269px;height:206px;line-height:206px;top:6369px;left:1586px;z-index:58;letter-spacing:0.47px;false">J&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:6369px;left:1904px;z-index:59;false">16&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:3074px;height:206px;line-height:206px;top:6369px;left:2480px;z-index:60;letter-spacing:-0.10999999999999999px;false">击及几己夹甲兼柬见巾斤井九久臼巨</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:6369px;left:5556px;z-index:61;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:6744px;left:1442px;z-index:62;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-12" style="width:330px;height:206px;line-height:206px;top:6744px;left:1586px;z-index:63;false">K&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:6744px;left:1965px;z-index:64;false">3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:576px;height:206px;line-height:206px;top:6744px;left:2446px;z-index:65;false">卡开口</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:6744px;left:3023px;z-index:66;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:7120px;left:1442px;z-index:67;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:297px;height:206px;line-height:206px;top:7120px;left:1588px;z-index:68;letter-spacing:-2.75px;false">L&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:7120px;left:1934px;z-index:69;false">12&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:2309px;height:206px;line-height:206px;top:7120px;left:2511px;z-index:70;letter-spacing:0.14px;false">来乐里力立吏隶两了六龙卤</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:7120px;left:4821px;z-index:71;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:7495px;left:1442px;z-index:72;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:363px;height:206px;line-height:206px;top:7495px;left:1586px;z-index:73;false">M&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:7495px;left:1998px;z-index:74;false">13&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:2499px;height:206px;line-height:206px;top:7495px;left:2575px;z-index:75;false">马毛矛么门米面民皿末母木目</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:7495px;left:5075px;z-index:76;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:7869px;left:1442px;z-index:77;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-12" style="width:330px;height:206px;line-height:206px;top:7869px;left:1586px;z-index:78;false">N&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:7869px;left:1965px;z-index:79;false">7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1346px;height:206px;line-height:206px;top:7869px;left:2446px;z-index:80;false">乃内年鸟牛农女</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:7869px;left:3792px;z-index:81;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:8244px;left:1442px;z-index:82;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:292px;height:206px;line-height:206px;top:8244px;left:1586px;z-index:83;letter-spacing:-1.6300000000000001px;false">P&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:8244px;left:1927px;z-index:84;false">2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:384px;height:206px;line-height:206px;top:8244px;left:2407px;z-index:85;false">片平</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:8244px;left:2792px;z-index:86;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:8619px;left:1442px;z-index:87;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-12" style="width:330px;height:206px;line-height:206px;top:8619px;left:1586px;z-index:88;false">Q&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:8619px;left:1965px;z-index:89;false">9&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1730px;height:206px;line-height:206px;top:8619px;left:2446px;z-index:90;false">七气千羌且丘求曲犬</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:8619px;left:4177px;z-index:91;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:417px;height:206px;line-height:206px;top:8994px;left:1442px;z-index:92;false">&nbsp;&nbsp;R&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:8994px;left:1907px;z-index:93;false">7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1346px;height:206px;line-height:206px;top:8994px;left:2388px;z-index:94;false">冉人王刃日肉人</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:8994px;left:3735px;z-index:95;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:9369px;left:1442px;z-index:96;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:299px;height:206px;line-height:206px;top:9369px;left:1586px;z-index:97;letter-spacing:0.16px;false">S&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:9369px;left:1934px;z-index:98;false">29&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:5576px;height:206px;line-height:206px;top:9369px;left:2511px;z-index:99;false">三山上少申身升生尸失十石史矢土氏世事手首书鼠术束甩水巳四肃</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:9369px;left:8089px;z-index:100;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:9744px;left:1442px;z-index:101;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:305px;height:206px;line-height:206px;top:9744px;left:1586px;z-index:102;letter-spacing:-0.96px;false">T&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:9744px;left:1940px;z-index:103;false">7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1346px;height:206px;line-height:206px;top:9744px;left:2421px;z-index:104;false">太天田头凸土屯</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:9744px;left:3767px;z-index:105;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:10120px;left:1442px;z-index:106;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:371px;height:206px;line-height:206px;top:10120px;left:1586px;z-index:107;letter-spacing:-0.64px;false">W&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:10120px;left:2005px;z-index:108;false">16&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:3076px;height:206px;line-height:206px;top:10120px;left:2486px;z-index:109;false">瓦丸万亡王为卫未文我乌无五午勿戊</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:10120px;left:5564px;z-index:110;font-family:simsun;">&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:10495px;left:1442px;z-index:111;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-12" style="width:330px;height:206px;line-height:206px;top:10495px;left:1586px;z-index:112;false">X&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:480px;height:206px;line-height:206px;top:10495px;left:1965px;z-index:113;false">10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:1922px;height:206px;line-height:206px;top:10495px;left:2446px;z-index:114;false">夕西习下乡象小心囟血</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:10495px;left:4370px;z-index:115;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:10870px;left:1442px;z-index:116;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:322px;height:206px;line-height:206px;top:10870px;left:1588px;z-index:117;letter-spacing:-1.9px;false">Y&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:482px;height:206px;line-height:206px;top:10870px;left:1961px;z-index:118;letter-spacing:0.25px;false">33&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:5646px;height:206px;line-height:206px;top:10870px;left:2446px;z-index:119;letter-spacing:2.3200000000000003px;false">丫牙亚严言央羊夭也业页一衣夷乙已义亦永用尤由酉又于予与雨禹</p><p class="reader-word-layer reader-word-s1-10" style="width:769px;height:192px;line-height:192px;top:11245px;left:1442px;z-index:120;false">玉曰月云</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:192px;line-height:192px;top:11245px;left:2211px;z-index:121;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-9" style="width:96px;height:206px;line-height:206px;top:11620px;left:1442px;z-index:122;false">&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:307px;height:206px;line-height:206px;top:11620px;left:1586px;z-index:123;letter-spacing:-0.51px;false">Z&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-9" style="width:576px;height:206px;line-height:206px;top:11620px;left:1942px;z-index:124;false">16&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p class="reader-word-layer reader-word-s1-10" style="width:3078px;height:206px;line-height:206px;top:11620px;left:2519px;z-index:125;letter-spacing:0.1px;false">再乍丈正之止中重舟州朱主爪专子自</p><p class="reader-word-layer reader-word-s1-9" style="width:48px;height:206px;line-height:206px;top:11620px;left:5598px;z-index:126;font-family:simsun;">&nbsp;
  // </p><p class="reader-word-layer reader-word-s1-5" style="width:42px;height:182px;line-height:182px;top:12005px;left:1442px;z-index:127;font-size:169px;font-family:simsun;">&nbsp;
  // </p><span class="wkwm5edb3638">文库</span></div>"""
  //   # html_source = """<p>helo</p><p></p><p></p>     <p>    </p><p>over</p>"""
  //   #.........................................................................................................
  //   $resolve_entities = -> $ ( d, send ) =>
  //     return send d unless select d, '^text'
  //     send lets d, ( d ) => d.text = d.text.replace /&nbsp;/g, ' '
  //   #.........................................................................................................
  //   $remove_styles_and_classes = -> $ ( d, send ) =>
  //     return if select d, '<span'
  //     return if select d, '>span'
  //     return send d unless d.style? or d.class?
  //     send lets d, ( d ) =>
  //       delete d.style
  //       delete d.class
  //   #.........................................................................................................
  //   $skip_styles = ->
  //     within_style = false
  //     return $ ( d, send ) =>
  //       if select d, '<style'
  //         within_style = true
  //         return
  //       if select d, '>style'
  //         within_style = false
  //         return
  //       return if within_style
  //       send d
  //   #.........................................................................................................
  //   $trim = -> $ ( d, send ) =>
  //     return send d unless select d, '^text'
  //     d = lets d, ( d ) => d.text = d.text.trim()
  //     send d unless d.text is ''
  //   #.........................................................................................................
  //   $remove_empty_tags = ->
  //     width     = 2
  //     fallback  = Symbol 'fallback'
  //     skip_next = false
  //     #.......................................................................................................
  //     return SP.window { width, fallback, }, $ ( ds, send ) ->
  //       if skip_next
  //         skip_next = false
  //         return
  //       #.....................................................................................................
  //       [ this_d, next_d, ] = ds
  //       # return send next_d  if this_d  is fallback
  //       return              if this_d is fallback
  //       return send this_d  if next_d is fallback
  //       this_sigil    = this_d.$key[ 0 ]
  //       return send this_d unless this_sigil is '<'
  //       this_tagname  = this_d.$key[ 1 .. ]
  //       next_sigil    = next_d.$key[ 0 ]
  //       return send this_d unless next_sigil is '>'
  //       next_tagname  = next_d.$key[ 1 .. ]
  //       return send this_d unless this_tagname is next_tagname
  //       skip_next     = true
  //   #.........................................................................................................
  //   pipeline  = []
  //   pipeline.push [ ( Buffer.from html_source ), ] ### TAINT fix `$split()` to accept string ###
  //   pipeline.push $split()
  //   pipeline.push $datoms_from_html()
  //   pipeline.push $resolve_entities()
  //   pipeline.push $remove_styles_and_classes()
  //   pipeline.push $skip_styles()
  //   pipeline.push $trim()
  //   pipeline.push $remove_empty_tags()
  //   # pipeline.push $show()
  //   pipeline.push SP.$filter ( d ) -> select d, '^text'
  //   pipeline.push $drain ( ds ) -> urge ( d.text for d in ds ).join ''
  //   SP.pull pipeline...
  //   #.........................................................................................................
  //   done() if done?
  //   return null

  //###########################################################################################################
  //###########################################################################################################
  //###########################################################################################################
  //###########################################################################################################

  //-----------------------------------------------------------------------------------------------------------
  this["HTML._parse_compact_tagname"] = async function(T, done) {
    var HTML, error, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    //.........................................................................................................
    probes_and_matchers = [
      [
        'foo-bar',
        {
          name: 'foo-bar'
        },
        null
      ],
      [
        'foo-bar#c55',
        {
          name: 'foo-bar',
          id: 'c55'
        },
        null
      ],
      [
        'foo-bar.blah.beep',
        {
          name: 'foo-bar',
          class: ['blah',
        'beep']
        },
        null
      ],
      [
        'foo-bar#c55.blah.beep',
        {
          name: 'foo-bar',
          id: 'c55',
          class: ['blah',
        'beep']
        },
        null
      ],
      ['#c55',
      null,
      "illegal compact tag syntax in '#c55'"],
      [
        'dang:blah',
        {
          prefix: 'dang',
          name: 'blah'
        },
        null
      ],
      [
        'dang:blah#c3',
        {
          prefix: 'dang',
          name: 'blah',
          id: 'c3'
        },
        null
      ],
      [
        'dang:blah#c3.some.thing',
        {
          prefix: 'dang',
          name: 'blah',
          id: 'c3',
          class: ['some',
        'thing']
        },
        null
      ],
      ['dang:#c3.some.thing',
      null,
      "illegal compact tag syntax in 'dang:#c3.some.thing'"],
      [
        'dang:bar.dub#c3.other',
        {
          prefix: 'dang',
          name: 'bar',
          class: ['dub',
        'other'],
          id: 'c3'
        },
        null
      ],
      ['.blah.beep',
      null,
      "illegal compact tag syntax in '.blah.beep'"],
      ['...#',
      null,
      'illegal compact tag syntax']
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(HTML.grammar._parse_compact_tagname(probe));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["parse_compact_tagname 2"] = async function(T, done) {
    var HTML, error, i, len, matcher, probe, probes_and_matchers;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    //.........................................................................................................
    probes_and_matchers = [['<foo-bar>', "$key='<tag',$vnr=[ 1, 1 ],name='foo-bar',start=0,stop=9,text='<foo-bar>',type='otag'", null], ['<foo-bar#c55>', "$key='<tag',$vnr=[ 1, 1 ],id='c55',name='foo-bar',start=0,stop=13,text='<foo-bar#c55>',type='otag'", null], ['<foo-bar.blah.beep>', "$key='<tag',$vnr=[ 1, 1 ],class=[ 'blah', 'beep' ],name='foo-bar',start=0,stop=19,text='<foo-bar.blah.beep>',type='otag'", null], ['<foo-bar#c55.blah.beep>', "$key='<tag',$vnr=[ 1, 1 ],class=[ 'blah', 'beep' ],id='c55',name='foo-bar',start=0,stop=23,text='<foo-bar#c55.blah.beep>',type='otag'", null], ['<#c55>', null, "illegal compact tag syntax"], ['<dang:blah>', "$key='<tag',$vnr=[ 1, 1 ],name='blah',prefix='dang',start=0,stop=11,text='<dang:blah>',type='otag'", null], ['<dang:blah#c3>', "$key='<tag',$vnr=[ 1, 1 ],id='c3',name='blah',prefix='dang',start=0,stop=14,text='<dang:blah#c3>',type='otag'", null], ['<dang:blah#c3.some.thing>', "$key='<tag',$vnr=[ 1, 1 ],class=[ 'some', 'thing' ],id='c3',name='blah',prefix='dang',start=0,stop=25,text='<dang:blah#c3.some.thing>',type='otag'", null], ['<dang:#c3.some.thing>', null, "illegal compact tag syntax"], ['<dang:bar.dub#c3.other>', "$key='<tag',$vnr=[ 1, 1 ],class=[ 'dub', 'other' ],id='c3',name='bar',prefix='dang',start=0,stop=23,text='<dang:bar.dub#c3.other>',type='otag'", null], ['<.blah.beep>', null, "illegal compact tag syntax"], ['<...#>', null, 'illegal compact tag syntax']];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          return resolve(H.condense_tokens(HTML.grammar.parse(probe)));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "HTML.tag" ] = ( T, done ) ->
  //   INTERTEXT                 = require '../../../apps/intertext'
  //   { _parse_compact_tagname
  //     tag }                 = INTERTEXT.HTML.export()
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [["div"],[{"$key":"^div"}],null]
  //     [["div#x32"],[{"$key":"^div","id":"x32"}],null]
  //     [["div.foo"],[{"$key":"^div","class":"foo"}],null]
  //     [["div#x32.foo"],[{"$key":"^div","id":"x32","class":"foo"}],null]
  //     [["div#x32",{"alt":"nice guy"}],[{"$key":"^div","id":"x32","alt":"nice guy"}],null]
  //     [["div#x32",{"alt":"nice guy"}," a > b & b > c => a > c"],[{"id":"x32","alt":"nice guy","$key":"<div"},{"text":" a > b & b > c => a > c","$key":"^text"},{"$key":">div"}],null]
  //     [["foo-bar"],[{"$key":"^foo-bar"}],null]
  //     [["foo-bar#c55"],[{"$key":"^foo-bar","id":"c55"}],null]
  //     [["foo-bar.blah.beep"],[{"$key":"^foo-bar","class":"blah beep"}],null]
  //     [["foo-bar#c55.blah.beep"],[{"$key":"^foo-bar","id":"c55","class":"blah beep"}],null]
  //     [["div#sidebar.green", { id: 'd3', class: "orange"}, ],[{"id":"d3","class":"orange","$key":"^div"}],null]
  //     [["#c55"],null,"not a valid intertext_html_tagname"]
  //     [[".blah.beep"],null,"not a valid intertext_html_tagname"]
  //     [["...#"],null,"illegal compact tag syntax"]
  //     ]
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
  //       # urge h probe...
  //       resolve tag probe...
  //   #.........................................................................................................
  //   done()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var HTML, _, d, grammar, i, len, prefix, ref, tail, tokens;
    HTML = require('../../../apps/paragate/lib/htmlish.grammar');
    // grammar = HTML.grammar.new { bare: true, }
    grammar = new HTML.new_grammar({
      bare: true
    });
    urge(grammar.settings);
    tokens = grammar.parse(`<p#c123>helo\nthis is a placeholder: <drb:loc#first/>, isn't it?</p>
<blah#id1 id=id2/>`);
    for (i = 0, len = tokens.length; i < len; i++) {
      d = tokens[i];
      if ((ref = d.$key) !== '^tag' && ref !== '<tag') {
        continue;
      }
      [_, prefix, tail] = d.name.split(/^([^:]*):(.*)$/);
      debug('^44403^', {prefix, tail});
      if (prefix !== 'drb') {
        continue;
      }
      // d.id = 'xxx'
      debug('^44947^', d);
    }
    console.table(tokens);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_streaming = function() {
    return new Promise(function(resolve) {
      var HTML, SP, pipeline, source;
      SP = require('steampipes');
      HTML = require('../../../apps/paragate/lib/htmlish.grammar');
      //.........................................................................................................
      source = ["<title>A Short Document</title>", "<p>The Nemean lion (<ipa>/nɪˈmiːən/</ipa>; Greek: <greek>Νεμέος λέων</greek> Neméos léōn; ", "Latin: Leo Nemeaeus) was a vicious monster in <a href='greek-mythology'>Greek mythology</a> ", "that lived at Nemea.", "</p>"];
      pipeline = [];
      pipeline.push(source);
      pipeline.push(HTML.$parse());
      pipeline.push(SP.$watch(function(d) {
        return info(d);
      }));
      pipeline.push(SP.$drain(function() {
        return resolve();
      }));
      SP.pull(...pipeline);
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => { // await do =>
      // test @
      // test @[ "HTML: parse bare" ]
      // demo()
      // await demo_streaming()
      // test @[ "HTML._parse_compact_tagname" ]
      // test @[ "parse_compact_tagname 2" ]
      // test @[ "HTML: parse (dubious)" ]
      // test @[ "HTML: parse escaped" ]
      return test(this["HTML: quotes in attribute values"]);
    })();
  }

}).call(this);

//# sourceMappingURL=htmlish.tests.js.map
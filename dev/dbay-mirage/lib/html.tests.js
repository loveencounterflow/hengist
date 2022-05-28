(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, text_from_token, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE/BASICS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  text_from_token = function(token) {
    var $key, HDML, R, name, text, type;
    ({HDML} = require('../../../apps/hdml'));
    ({$key, name, type, text} = token);
    if (name == null) {
      name = 'MISSING';
    }
    R = (function() {
      var ref;
      switch ($key) {
        case '^text':
          return text;
        case '^error':
          return (HDML.create_tag('<', 'error', {
            ...token.attrs,
            message: token.message
          })) + ((ref = token.text) != null ? ref : '') + (HDML.create_tag('>', 'error'));
        case '<tag':
          return HDML.create_tag('<', name, token.atrs);
        case '^tag':
          return HDML.create_tag('^', name, token.atrs);
        case '>tag':
          return HDML.create_tag('>', name);
        case '^entity':
          return `(NCR:${type}:${text})`;
        default:
          throw new Error(`unknown $key ${rpr($key)}`);
      }
    })();
    return `(${token.start}-${token.stop})${R}`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Mirage HTML: Basic functionality"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, prefix, probes_and_matchers;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    prefix = 'mrg';
    probes_and_matchers = [];
    dsk = 'b';
    mrg.register_dsk({
      dsk,
      url: 'live:'
    });
    help('^307^', `using DB at ${db.cfg.path}`);
    // debug '^435^1, mrg.append_text { dsk, trk: 1, text: """<title id=c1 x="Q"></title>""", }
    // debug '^435^2, mrg.append_text { dsk, trk: 1, text: """<title id=c2 x='Q'></title>""", }
    // debug '^435^3, mrg.append_text { dsk, trk: 1, text: """<title id=c3 x='"Q"'></title>""", }
    // debug '^435^4, mrg.append_text { dsk, trk: 1, text: """<title id=c4 x="'Q'"></title>""", }
    mrg.append_text({
      dsk,
      trk: 1,
      text: `<div id=c1 x="Q"></div>`
    });
    mrg.append_text({
      dsk,
      trk: 1,
      text: ''
    });
    mrg.append_text({
      dsk,
      trk: 1,
      text: `<div id=c2 x="Q">Some Text</div>`
    });
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_mirror;`));
    H.tabulate(`${prefix}_raw_mirror`, db(SQL`select * from ${prefix}_raw_mirror;`));
    H.tabulate(`${prefix}_paragraphs`, db(SQL`select * from ${prefix}_paragraphs;`));
    H.tabulate(`_${prefix}_ws_linecounts`, db(SQL`select * from _${prefix}_ws_linecounts;`));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Mirage HTML: quotes in attribute values"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, prefix, probes_and_matchers, result, text;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    db = new DBay();
    mrg = new Mrg({db});
    prefix = 'mrg';
    probes_and_matchers = [];
    dsk = 'quotedattributes';
    mrg.register_dsk({
      dsk,
      url: 'live:'
    });
    // debug '^435^5, mrg.append_text { dsk, trk: 1, text: """<title id=c1 x="Q"></title>""", }
    // debug '^435^6, mrg.append_text { dsk, trk: 1, text: """<title id=c2 x='Q'></title>""", }
    // debug '^435^7, mrg.append_text { dsk, trk: 1, text: """<title id=c3 x='"Q"'></title>""", }
    // debug '^435^8, mrg.append_text { dsk, trk: 1, text: """<title id=c4 x="'Q'"></title>""", }
    text = `<title id=c1 x="Q"></title>

<title id=c2 x='Q'></title>

<title id=c3 x='"Q"'></title>

<title id=c4 x="'Q'"></title>`;
    mrg.append_text({
      dsk,
      trk: 1,
      text
    });
    mrg.html.parse_dsk({dsk});
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_mirror;`));
    H.tabulate(`${prefix}_raw_mirror`, db(SQL`select * from ${prefix}_raw_mirror;`));
    H.tabulate(`${prefix}_paragraphs`, db(SQL`select * from ${prefix}_paragraphs;`));
    H.tabulate(`_${prefix}_ws_linecounts`, db(SQL`select * from _${prefix}_ws_linecounts;`));
    // H.tabulate "_#{prefix}_ws_linecounts",      db SQL"""select
    //     *
    //   from #{prefix}_raw_mirror as raw_mirror
    //   join #{prefix}_mirror     as mirror using ( dsk, oln, trk, pce );"""
    H.tabulate(`${prefix}_html_mirror`, db(SQL`select * from ${prefix}_html_mirror;`));
    H.tabulate(`${prefix}_html_tags_and_html`, db(SQL`select * from ${prefix}_html_tags_and_html;`));
    result = db.all_rows(SQL`select
    oln, v
  from ${prefix}_html_mirror as m
  join ${prefix}_html_atrs as a using ( atrid )
  where true
    and ( m.typ = '<' )
    and ( m.tag = 'title' )
    and ( a.k   = 'x' )
  order by m.dsk, m.oln, m.trk, m.pce;`);
    if (T != null) {
      T.eq(result, [
        {
          oln: 1,
          v: "Q"
        },
        {
          oln: 3,
          v: 'Q'
        },
        {
          oln: 5,
          v: '"Q"'
        },
        {
          oln: 7,
          v: "'Q'"
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Mirage HTML: tag syntax variants"] = async function(T, done) {
    var DBay, HDML, Mrg, db, error, i, len, lets, matcher, mrg, probe, probes_and_matchers, thaw;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    ({HDML} = require('../../../apps/hdml'));
    db = new DBay();
    mrg = new Mrg({db});
    // debug '^237^', { text, reveal, } = mrg.html.HTMLISH._tunnel 'foo\\';   info rpr reveal text
    // debug '^237^', { text, reveal, } = mrg.html.HTMLISH._tunnel 'foo\\a';  info rpr reveal text
    // debug '^237^', { text, reveal, } = mrg.html.HTMLISH._tunnel 'foo\\\n';  info rpr reveal text
    // debug '^237^', { text, reveal, } = mrg.html.HTMLISH._tunnel 'foo\\\\'; info rpr reveal text
    // return done()
    ({lets, thaw} = guy.lft);
    // #.........................................................................................................
    // debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\' ).text
    // debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\\\' ).text
    // debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\&amp;' ).text
    // return done?()
    //.........................................................................................................
    // [ '<py/ling3/',         null, ]
    probes_and_matchers = [['<title>My Page</title>', '(0-7)<title>|(7-14)My Page|(14-22)</title>', null], ['< title>My Page< /title>', "(0-8)<error message='extraneous whitespace before tag name'>< title></error>|(8-15)My Page|(15-18)<MISSING>|(17-18)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;/&#39; &lt;--'>/</error>|(18-24)title>", null], ['<title >My Page< /title>', "(0-8)<title>|(8-15)My Page|(15-18)<MISSING>|(17-18)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;/&#39; &lt;--'>/</error>|(18-24)title>", null], ['<title>My Page< /title>', "(0-7)<title>|(7-14)My Page|(14-17)<MISSING>|(16-17)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;/&#39; &lt;--'>/</error>|(17-23)title>", null], ['<title>My Page</ title>', "(0-7)<title>|(7-14)My Page|(14-23)<error message='extraneous whitespace in closing tag'></ title></error>", null], ['<title>My Page</title >', '(0-7)<title>|(7-14)My Page|(14-23)</title>', null], ['<title/My\\/Your Page/>', '(0-7)<title>|(7-21)My/Your Page|(21-22)</title>|(22-23)>', null], ['<title>My Page</>', "(0-7)<title>|(7-14)My Page|(14-17)</title>|(16-17)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;&gt;&#39; &lt;--'>></error>", null], ['<title/My Page/>', '(0-7)<title>|(7-14)My Page|(14-15)</title>|(15-16)>', null], ['<title/My/Your Page/>', '(0-7)<title>|(7-9)My|(9-10)</title>|(10-21)Your Page/>', null], ['<title/My\npage/', '(0-7)<title>|(7-14)My\npage|(14-15)</title>', null], ['<title k=v j=w/My Page/', "(0-15)<title k='v' j='w'>|(15-22)My Page|(22-23)</title>", null], ['<title/<b>My</b> Page/', "(0-7)<title>|(7-13)<error message='bare active characters'><b>My<</error>|(13-14)</title>|(14-22)b> Page/", null], ['<title//', '(0-7)<title>|(7-8)</title>', null], ['<title/>', '(0-8)<title/>', null], ['<title/My Page/', '(0-7)<title>|(7-14)My Page|(14-15)</title>', null], ['<title#c1.x/My Page/', '(0-12)<title>|(12-19)My Page|(19-20)</title>', null], ['\\<title/>', '(0-10)&lt;title/>', null], ['\\&amp;', '(0-7)&amp;amp;', null], ['foo\\bar', '(0-8)foobar', null], ['\\abc', '(0-5)abc', null], ['foo\\\\bar', '(0-9)foo\\bar', null], ['first\\\nsecond', '(0-14)firstsecond', null], ['xxx&amp;xxx', '(0-3)xxx|(3-8)(NCR:named:&amp;)|(8-11)xxx', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, j, len1, parts, ref, result;
          // help '^435-12^', rpr probe
          parts = [];
          ref = mrg.html.HTMLISH.parse(probe);
          for (j = 0, len1 = ref.length; j < len1; j++) {
            d = ref[j];
            parts.push(text_from_token(d));
            d = thaw(d);
            delete d.$;
            delete d.$vnr;
          }
          // urge '^435-13^', d
          result = parts.join('|');
          // info '^435-14^', rpr result
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Mirage HTML: XNCR parsing 1"] = function(T, done) {
    var Htmlish, i, key, len, match, matcher, probe, probes, result, value;
    ({Htmlish} = require('../../../apps/dbay-mirage/lib/htmlish-parser'));
    // { DBay  } = require '../../../apps/dbay'
    // { Mrg   } = require '../../../apps/dbay-mirage'
    // { HDML  } = require '../../../apps/hdml'
    // db        = new DBay()
    // mrg       = new Mrg { db, }
    //...........................................................................................................
    probes = [
      ['nothing to see here',
      void 0],
      [
        '&bar;',
        {
          name: 'bar'
        }
      ],
      [
        '&#x123;',
        {
          hex: '123'
        }
      ],
      [
        '&#123;',
        {
          dec: '123'
        }
      ],
      [
        '&xy#x123;',
        {
          csg: 'xy',
          hex: '123'
        },
        {
          name: 'baz'
        }
      ]
    ];
    for (i = 0, len = probes.length; i < len; i++) {
      [probe, matcher] = probes[i];
      match = probe.match(Htmlish.C.xncr.matcher);
      if (match != null) {
        result = {...match.groups};
        for (key in result) {
          value = result[key];
          if (value == null) {
            delete result[key];
          }
        }
      }
      urge('^652^', [probe, result]);
      if (T != null) {
        T.eq(matcher, result);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Mirage HTML: XNCR parsing 2"] = async function(T, done) {
    var DBay, HDML, Mrg, db, error, i, len, lets, matcher, mrg, probe, probes_and_matchers, thaw;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    ({HDML} = require('../../../apps/hdml'));
    db = new DBay();
    mrg = new Mrg({db});
    ({lets, thaw} = guy.lft);
    //.........................................................................................................
    probes_and_matchers = [['<b x="&">&lt;<&foo;', "(0-9)<b x='&amp;'>(0-4)(NCR:named:&lt;)(13-19)<&foo;>(14-19)<error message='Expecting: one of these possible Token sequences:&#10;  1. [i_close]&#10;  2. [i_slash_close]&#10;  3. [stm_slash1]&#10;but found: &#39;&#39;'>&foo;</error>", null], ['&foo;', '(0-5)(NCR:named:&foo;)', null], ['abcdef', '(0-6)abcdef', null], ['xxx&#x123;xxx', '(0-3)xxx(3-10)(NCR:ncr:&#x123;)(10-13)xxx', null], ['xxx&#123;xxx', '(0-3)xxx(3-9)(NCR:ncr:&#123;)(9-12)xxx', null], ['xxx&jzr#xe123;xxx', '(0-3)xxx(3-14)(NCR:xncr:&jzr#xe123;)(14-17)xxx', null], ['xxx&amp;xxx', '(0-3)xxx(3-8)(NCR:named:&amp;)(8-11)xxx', null], ['foo &amp;bar&jzr#xe123; baz', '(0-4)foo (4-9)(NCR:named:&amp;)(9-12)bar(12-23)(NCR:xncr:&jzr#xe123;)(23-27) baz', null], ['xxx&a&mp;xxx', "(0-3)xxx(3-9)<error message='bare active characters'>&a&mp;</error>(9-12)xxx", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, j, len1, parts, ref, result;
          // help '^435-12^', rpr probe
          parts = [];
          ref = mrg.html.HTMLISH.parse(probe);
          for (j = 0, len1 = ref.length; j < len1; j++) {
            d = ref[j];
            d = thaw(d);
            delete d.$;
            delete d.$vnr;
            // urge '^342^', d
            parts.push(text_from_token(d));
          }
          result = parts.join('');
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Mirage HTML: parse stretch with compact tagnames"] = async function(T, done) {
    var DBay, HDML, Mrg, db, error, i, len, lets, matcher, mrg, probe, probes_and_matchers, thaw;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    ({HDML} = require('../../../apps/hdml'));
    db = new DBay();
    mrg = new Mrg({db});
    ({lets, thaw} = guy.lft);
    //.........................................................................................................
    probes_and_matchers = [['<foo-bar#c55>*xxx*</foo-bar>', '(0-13)<foo-bar>#(13-17)<em>#(17-20)xxx#(20-25)</em>#(25-35)</foo-bar>', null], ['1 \\< 2', '(0-7)1 &lt; 2', null], ['<foo-bar#c55.blah.beep>xxx</foo-bar>', '(0-23)<foo-bar>#(23-26)xxx#(26-36)</foo-bar>', null], ['<foo-bar#c55>here &amp; there</foo-bar>', '(0-13)<foo-bar>#(0-5)here #(5-10)(NCR:named:&amp;)#(10-16) there#(29-39)</foo-bar>', null], ['<foo-bar#c55>1 < 2</foo-bar>', `(0-13)<foo-bar>#(13-15)1 #(15-20)<2>#(18-19)<error message='extraneous characters on line 1 column 19: "&lt;"'><</error>#(20-28)foo-bar>`, null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var d, j, k, len1, len2, parts, token, tokens;
          tokens = mrg.html.HTMLISH.parse(probe);
          for (j = 0, len1 = tokens.length; j < len1; j++) {
            token = tokens[j];
            if (token.message == null) {
              token.message = null;
            }
          }
          H.tabulate(probe, tokens);
          parts = [];
          for (k = 0, len2 = tokens.length; k < len2; k++) {
            d = tokens[k];
            parts.push(text_from_token(d));
          }
          return resolve(parts.join('#'));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "Mirage HTML: parse stretch with compact tagnames" ]
// @[ "Mirage HTML: Basic functionality" ]()
// test @[ "Mirage HTML: quotes in attribute values" ]
// test @[ "altering mirrored source lines causes error" ]
// @[ "altering mirrored source lines causes error" ]()
// test @[ "Mirage HTML: tag syntax variants" ]
// @[ "Mirage HTML: XNCR parsing 1" ]()
// test @[ "Mirage HTML: XNCR parsing 1" ]
// test @[ "Mirage HTML: XNCR parsing 2" ]
// for match from 'xxxabcxdefxxx'.matchAll /(?<xs>x{2,})|(?<notx>[^x]+)|(?<any>.+?)/g
//   text    = match[ 0 ]
//   index   = match.index
//   result  = { text, index, }
//   result[ k ] = v for k, v of match.groups when v?
//   info '^904^', result

}).call(this);

//# sourceMappingURL=html.tests.js.map
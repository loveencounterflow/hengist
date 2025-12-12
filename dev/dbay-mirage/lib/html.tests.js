(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, freeze, help, info, isa, lets, rpr, test, text_from_token, thaw, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({freeze, thaw, lets} = require('letsfreezethat'));

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
          })) + (HDML.text((ref = token.text) != null ? ref : '')) + (HDML.create_tag('>', 'error'));
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
    var DBay, HDML, Mrg, db, error, i, len, matcher, mrg, probe, probes_and_matchers;
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
    // #.........................................................................................................
    // debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\' ).text
    // debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\\\' ).text
    // debug '^33673^', rpr ( mrg.html.HTMLISH._tunnel '\\&amp;' ).text
    // return done?()
    //.........................................................................................................
    // [ '<py/ling3/',         null, ]
    probes_and_matchers = [['< title>My Page< /title>', "(0-8)<error message='extraneous whitespace before tag name'>&lt; title&gt;</error>|(8-15)My Page|(15-18)<error message='extraneous whitespace before tag name'>&lt; /</error>|(17-18)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;/&#39; &lt;--'>/</error>|(18-24)title>", null], ['<title>My Page</title>', '(0-7)<title>|(7-14)My Page|(14-22)</title>', null], ['<title >My Page< /title>', "(0-8)<title>|(8-15)My Page|(15-18)<error message='extraneous whitespace before tag name'>&lt; /</error>|(17-18)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;/&#39; &lt;--'>/</error>|(18-24)title>", null], ['<title>My Page< /title>', "(0-7)<title>|(7-14)My Page|(14-17)<error message='extraneous whitespace before tag name'>&lt; /</error>|(16-17)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;/&#39; &lt;--'>/</error>|(17-23)title>", null], ['<title>My Page</ title>', "(0-7)<title>|(7-14)My Page|(14-23)<error message='extraneous whitespace in closing tag'>&lt;/ title&gt;</error>", null], ['<title>My Page</title >', '(0-7)<title>|(7-14)My Page|(14-23)</title>', null], ['<title/My\\/Your Page/>', '(0-7)<title>|(7-21)My/Your Page|(21-22)</title>|(22-23)>', null], ['<title>My Page</>', "(0-7)<title>|(7-14)My Page|(14-17)</title>|(16-17)<error message='Expecting token of type --&gt; i_name &lt;-- but found --&gt; &#39;&gt;&#39; &lt;--'>&gt;</error>", null], ['<title/My Page/>', '(0-7)<title>|(7-14)My Page|(14-15)</title>|(15-16)>', null], ['<title/My/Your Page/>', '(0-7)<title>|(7-9)My|(9-10)</title>|(10-21)Your Page/>', null], ['<title/My\npage/', '(0-7)<title>|(7-14)My\npage|(14-15)</title>', null], ['<title k=v j=w/My Page/', "(0-15)<title k='v' j='w'>|(15-22)My Page|(22-23)</title>", null], ['<title/<b>My</b> Page/', "(0-7)<title>|(7-13)<error message='bare active characters'>&lt;b&gt;My&lt;</error>|(13-14)</title>|(14-22)b> Page/", null], ['<title//', '(0-7)<title>|(7-8)</title>', null], ['<title/>', '(0-8)<title/>|(0-8)<title/>', null], ['<title/My Page/', '(0-7)<title>|(7-14)My Page|(14-15)</title>', null], ['<title#c1.x/My Page/', "(0-12)<title id='c1' class='x'>|(12-19)My Page|(19-20)</title>", null], ['\\<title/>', '(0-10)&lt;title/>', null], ['\\&amp;', '(0-7)&amp;amp;', null], ['foo\\bar', '(0-8)foobar', null], ['\\abc', '(0-5)abc', null], ['foo\\\\bar', '(0-9)foo\\bar', null], ['first\\\nsecond', '(0-14)firstsecond', null], ['xxx&amp;xxx', '(0-3)xxx|(3-8)(NCR:named:&amp;)|(8-11)xxx', null]];
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
          // echo CND.blue [ probe, matcher, null, ]
          resolve(result);
          // resolve matcher # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
      // urge '^652^', [ probe, result, ]
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
    var DBay, HDML, Mrg, db, error, i, len, matcher, mrg, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    ({HDML} = require('../../../apps/hdml'));
    db = new DBay();
    mrg = new Mrg({db});
    //.........................................................................................................
    probes_and_matchers = [['<b x="&">&lt;<&foo;', "(0-9)<b x='&amp;'>(0-4)(NCR:named:&lt;)(13-19)<&foo;>(14-19)<error message='Expecting: one of these possible Token sequences:&#10;  1. [i_close]&#10;  2. [i_slash_close]&#10;  3. [stm_slash1]&#10;but found: &#39;&#39;'>&amp;foo;</error>", null], ['&foo;', '(0-5)(NCR:named:&foo;)', null], ['abcdef', '(0-6)abcdef', null], ['xxx&#x123;xxx', '(0-3)xxx(3-10)(NCR:ncr:&#x123;)(10-13)xxx', null], ['xxx&#123;xxx', '(0-3)xxx(3-9)(NCR:ncr:&#123;)(9-12)xxx', null], ['xxx&jzr#xe123;xxx', '(0-3)xxx(3-14)(NCR:xncr:&jzr#xe123;)(14-17)xxx', null], ['xxx&amp;xxx', '(0-3)xxx(3-8)(NCR:named:&amp;)(8-11)xxx', null], ['foo &amp;bar&jzr#xe123; baz', '(0-4)foo (4-9)(NCR:named:&amp;)(9-12)bar(12-23)(NCR:xncr:&jzr#xe123;)(23-27) baz', null], ['xxx&a&mp;xxx', "(0-3)xxx(3-9)<error message='bare active characters'>&amp;a&amp;mp;</error>(9-12)xxx", null]];
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
    var DBay, HDML, Mrg, db, error, i, len, matcher, mrg, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    ({HDML} = require('../../../apps/hdml'));
    db = new DBay();
    mrg = new Mrg({db});
    //.........................................................................................................
    // [ '<foo-bar#c55>*xxx*</foo-bar>', '(0-13)<foo-bar>#(13-17)<em>#(17-20)xxx#(20-25)</em>#(25-35)</foo-bar>', null ]
    probes_and_matchers = [['<foo-bar#c55>*xxx*</foo-bar>', "(0-13)<foo-bar id='c55'>#(13-17)<em>#(17-20)xxx#(20-25)</em>#(25-35)</foo-bar>", null], ['1 \\< 2', '(0-7)1 &lt; 2', null], ['<foo-bar#c55.blah.beep>xxx</foo-bar>', "(0-23)<foo-bar id='c55' class='blah beep'>#(23-26)xxx#(26-36)</foo-bar>", null], ['<foo-bar#c55>here &amp; there</foo-bar>', "(0-13)<foo-bar id='c55'>#(0-5)here #(5-10)(NCR:named:&amp;)#(10-16) there#(29-39)</foo-bar>", null], ['<foo-bar#c55>1 < 2</foo-bar>', `(0-13)<foo-bar id='c55'>#(13-15)1 #(15-20)<error message='extraneous whitespace before tag name'>&lt; 2&lt;/</error>#(18-19)<error message='extraneous characters on line 1 column 19: "&lt;"'>&lt;</error>#(20-28)foo-bar>`, null]];
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
          // H.tabulate probe, tokens
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

  // @[ "Mirage HTML: quotes in attribute values" ]()
// test @[ "Mirage HTML: quotes in attribute values" ]
//.........................................................................................................
// test @[ "Mirage HTML: parse stretch with compact tagnames" ]
// @[ "Mirage HTML: Basic functionality" ]()
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2h0bWwudGVzdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLGVBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsUUFBQSxFQUFBLGdCQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7OztFQUlBLEdBQUEsR0FBNEIsT0FBQSxDQUFRLEtBQVI7O0VBQzVCLEdBQUEsR0FBNEIsR0FBRyxDQUFDOztFQUNoQyxLQUFBLEdBQTRCOztFQUM1QixLQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsT0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLE9BQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxTQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBVCxDQUFjLEdBQWQsRUFiNUI7OztFQWVBLElBQUEsR0FBNEIsT0FBQSxDQUFRLHdCQUFSOztFQUM1QixJQUFBLEdBQTRCLE9BQUEsQ0FBUSxNQUFSLEVBaEI1Qjs7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TSxNQUFBLEdBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBakIsQ0FBdUIsS0FBdkI7VUFDVixLQUFBLDBDQUFBOzs7Y0FBQSxLQUFLLENBQUMsVUFBVzs7VUFBakIsQ0FETjs7VUFHTSxLQUFBLEdBQVE7VUFDUixLQUFBLDBDQUFBOztZQUNFLEtBQUssQ0FBQyxJQUFOLENBQVcsZUFBQSxDQUFnQixDQUFoQixDQUFYO1VBREY7aUJBRUEsT0FBQSxDQUFRLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWCxDQUFSO1FBUG9ELENBQVo7TUFBSCxDQUFqQztJQURSLENBZkY7O0lBeUJFLElBQUEsQ0FBQTtBQUNBLFdBQU87RUEzQmlELEVBN1ExRDs7O0VBNFNBLElBQUcsT0FBTyxDQUFDLElBQVIsS0FBZ0IsTUFBbkI7SUFBa0MsQ0FBQSxDQUFBLENBQUEsR0FBQTthQUNoQyxJQUFBLENBQUssSUFBTDtJQURnQyxDQUFBLElBQWxDOzs7RUE1U0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0J1xuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuQ05EICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2NuZCdcbnJwciAgICAgICAgICAgICAgICAgICAgICAgPSBDTkQucnByXG5iYWRnZSAgICAgICAgICAgICAgICAgICAgID0gJ0RCQVktTUlSQUdFL0JBU0lDUydcbmRlYnVnICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnZGVidWcnLCAgICAgYmFkZ2Vcbndhcm4gICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnd2FybicsICAgICAgYmFkZ2VcbmluZm8gICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnaW5mbycsICAgICAgYmFkZ2VcbnVyZ2UgICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAndXJnZScsICAgICAgYmFkZ2VcbmhlbHAgICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnaGVscCcsICAgICAgYmFkZ2VcbndoaXNwZXIgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnd2hpc3BlcicsICAgYmFkZ2VcbmVjaG8gICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZWNoby5iaW5kIENORFxuIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG50ZXN0ICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9ndXktdGVzdCdcblBBVEggICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdwYXRoJ1xuIyBGUyAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZnMnXG50eXBlcyAgICAgICAgICAgICAgICAgICAgID0gbmV3ICggcmVxdWlyZSAnaW50ZXJ0eXBlJyApLkludGVydHlwZVxueyBpc2FcbiAgZXF1YWxzXG4gIHR5cGVfb2ZcbiAgdmFsaWRhdGVcbiAgdmFsaWRhdGVfbGlzdF9vZiB9ICAgICAgPSB0eXBlcy5leHBvcnQoKVxuU1FMICAgICAgICAgICAgICAgICAgICAgICA9IFN0cmluZy5yYXdcbnsgZnJlZXplLFxuICB0aGF3LFxuICBsZXRzLCAgICAgICAgICAgICAgICAgfSA9IHJlcXVpcmUgJ2xldHNmcmVlemV0aGF0J1xuSCAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2xpYi9oZWxwZXJzJ1xuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnRleHRfZnJvbV90b2tlbiA9ICggdG9rZW4gKSAtPlxuICB7IEhETUwgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvaGRtbCdcbiAgeyAka2V5XG4gICAgbmFtZVxuICAgIHR5cGVcbiAgICB0ZXh0IH0gPSB0b2tlblxuICBuYW1lID89ICdNSVNTSU5HJ1xuICBSID0gc3dpdGNoICRrZXlcbiAgICB3aGVuICdedGV4dCcgIHRoZW4gdGV4dFxuICAgIHdoZW4gJ15lcnJvcicgdGhlbiAgKCBIRE1MLmNyZWF0ZV90YWcgJzwnLCAnZXJyb3InLCB7IHRva2VuLmF0dHJzLi4uLCBtZXNzYWdlOiB0b2tlbi5tZXNzYWdlIH0gKSBcXFxuICAgICAgICAgICAgICAgICAgICAgICsgKCBIRE1MLnRleHQgdG9rZW4udGV4dCA/ICcnICkgXFxcbiAgICAgICAgICAgICAgICAgICAgICArICggSERNTC5jcmVhdGVfdGFnICc+JywgJ2Vycm9yJyApXG4gICAgd2hlbiAnPHRhZycgICB0aGVuIEhETUwuY3JlYXRlX3RhZyAnPCcsIG5hbWUsIHRva2VuLmF0cnNcbiAgICB3aGVuICdedGFnJyAgIHRoZW4gSERNTC5jcmVhdGVfdGFnICdeJywgbmFtZSwgdG9rZW4uYXRyc1xuICAgIHdoZW4gJz50YWcnICAgdGhlbiBIRE1MLmNyZWF0ZV90YWcgJz4nLCBuYW1lXG4gICAgd2hlbiAnXmVudGl0eSdcbiAgICAgIFwiKE5DUjoje3R5cGV9OiN7dGV4dH0pXCJcbiAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcInVua25vd24gJGtleSAje3JwciAka2V5fVwiXG4gIHJldHVybiBcIigje3Rva2VuLnN0YXJ0fS0je3Rva2VuLnN0b3B9KSN7Un1cIlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiTWlyYWdlIEhUTUw6IEJhc2ljIGZ1bmN0aW9uYWxpdHlcIiBdID0gKCBULCBkb25lICkgLT5cbiAgIyBUPy5oYWx0X29uX2Vycm9yKClcbiAgeyBEQmF5ICB9ID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9kYmF5J1xuICB7IE1yZyAgIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXktbWlyYWdlJ1xuICBkYiAgICAgICAgPSBuZXcgREJheSgpXG4gIG1yZyAgICAgICA9IG5ldyBNcmcgeyBkYiwgfVxuICBwcmVmaXggICAgPSAnbXJnJ1xuICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW11cbiAgZHNrICAgICAgID0gJ2InXG4gIG1yZy5yZWdpc3Rlcl9kc2sgeyBkc2ssIHVybDogJ2xpdmU6JywgfVxuICBoZWxwICdeMzA3XicsIFwidXNpbmcgREIgYXQgI3tkYi5jZmcucGF0aH1cIlxuICAjIGRlYnVnICdeNDM1XjEsIG1yZy5hcHBlbmRfdGV4dCB7IGRzaywgdHJrOiAxLCB0ZXh0OiBcIlwiXCI8dGl0bGUgaWQ9YzEgeD1cIlFcIj48L3RpdGxlPlwiXCJcIiwgfVxuICAjIGRlYnVnICdeNDM1XjIsIG1yZy5hcHBlbmRfdGV4dCB7IGRzaywgdHJrOiAxLCB0ZXh0OiBcIlwiXCI8dGl0bGUgaWQ9YzIgeD0nUSc+PC90aXRsZT5cIlwiXCIsIH1cbiAgIyBkZWJ1ZyAnXjQzNV4zLCBtcmcuYXBwZW5kX3RleHQgeyBkc2ssIHRyazogMSwgdGV4dDogXCJcIlwiPHRpdGxlIGlkPWMzIHg9J1wiUVwiJz48L3RpdGxlPlwiXCJcIiwgfVxuICAjIGRlYnVnICdeNDM1XjQsIG1yZy5hcHBlbmRfdGV4dCB7IGRzaywgdHJrOiAxLCB0ZXh0OiBcIlwiXCI8dGl0bGUgaWQ9YzQgeD1cIidRJ1wiPjwvdGl0bGU+XCJcIlwiLCB9XG4gIG1yZy5hcHBlbmRfdGV4dCB7IGRzaywgdHJrOiAxLCB0ZXh0OiBcIlwiXCI8ZGl2IGlkPWMxIHg9XCJRXCI+PC9kaXY+XCJcIlwiLCB9XG4gIG1yZy5hcHBlbmRfdGV4dCB7IGRzaywgdHJrOiAxLCB0ZXh0OiAnJywgfVxuICBtcmcuYXBwZW5kX3RleHQgeyBkc2ssIHRyazogMSwgdGV4dDogXCJcIlwiPGRpdiBpZD1jMiB4PVwiUVwiPlNvbWUgVGV4dDwvZGl2PlwiXCJcIiwgfVxuICBILnRhYnVsYXRlIFwiI3twcmVmaXh9X21pcnJvclwiLCAgICAgICAgICAgICAgICAgICAgICBkYiBTUUxcInNlbGVjdCAqIGZyb20gI3twcmVmaXh9X21pcnJvcjtcIlxuICBILnRhYnVsYXRlIFwiI3twcmVmaXh9X3Jhd19taXJyb3JcIiwgICAgICAgICAgICAgICAgICBkYiBTUUxcInNlbGVjdCAqIGZyb20gI3twcmVmaXh9X3Jhd19taXJyb3I7XCJcbiAgSC50YWJ1bGF0ZSBcIiN7cHJlZml4fV9wYXJhZ3JhcGhzXCIsICAgICAgICAgICAgICAgICAgZGIgU1FMXCJzZWxlY3QgKiBmcm9tICN7cHJlZml4fV9wYXJhZ3JhcGhzO1wiXG4gIEgudGFidWxhdGUgXCJfI3twcmVmaXh9X3dzX2xpbmVjb3VudHNcIiwgICAgICAgICAgICAgIGRiIFNRTFwic2VsZWN0ICogZnJvbSBfI3twcmVmaXh9X3dzX2xpbmVjb3VudHM7XCJcbiAgcmV0dXJuIGRvbmU/KClcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIk1pcmFnZSBIVE1MOiBxdW90ZXMgaW4gYXR0cmlidXRlIHZhbHVlc1wiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIFQ/LmhhbHRfb25fZXJyb3IoKVxuICB7IERCYXkgIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXknXG4gIHsgTXJnICAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheS1taXJhZ2UnXG4gIGRiICAgICAgICA9IG5ldyBEQmF5KClcbiAgbXJnICAgICAgID0gbmV3IE1yZyB7IGRiLCB9XG4gIHByZWZpeCAgICA9ICdtcmcnXG4gIHByb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXVxuICBkc2sgICAgICAgPSAncXVvdGVkYXR0cmlidXRlcydcbiAgbXJnLnJlZ2lzdGVyX2RzayB7IGRzaywgdXJsOiAnbGl2ZTonLCB9XG4gICMgZGVidWcgJ140MzVeNSwgbXJnLmFwcGVuZF90ZXh0IHsgZHNrLCB0cms6IDEsIHRleHQ6IFwiXCJcIjx0aXRsZSBpZD1jMSB4PVwiUVwiPjwvdGl0bGU+XCJcIlwiLCB9XG4gICMgZGVidWcgJ140MzVeNiwgbXJnLmFwcGVuZF90ZXh0IHsgZHNrLCB0cms6IDEsIHRleHQ6IFwiXCJcIjx0aXRsZSBpZD1jMiB4PSdRJz48L3RpdGxlPlwiXCJcIiwgfVxuICAjIGRlYnVnICdeNDM1XjcsIG1yZy5hcHBlbmRfdGV4dCB7IGRzaywgdHJrOiAxLCB0ZXh0OiBcIlwiXCI8dGl0bGUgaWQ9YzMgeD0nXCJRXCInPjwvdGl0bGU+XCJcIlwiLCB9XG4gICMgZGVidWcgJ140MzVeOCwgbXJnLmFwcGVuZF90ZXh0IHsgZHNrLCB0cms6IDEsIHRleHQ6IFwiXCJcIjx0aXRsZSBpZD1jNCB4PVwiJ1EnXCI+PC90aXRsZT5cIlwiXCIsIH1cbiAgdGV4dCA9IFwiXCJcIlxuICAgIDx0aXRsZSBpZD1jMSB4PVwiUVwiPjwvdGl0bGU+XG5cbiAgICA8dGl0bGUgaWQ9YzIgeD0nUSc+PC90aXRsZT5cblxuICAgIDx0aXRsZSBpZD1jMyB4PSdcIlFcIic+PC90aXRsZT5cblxuICAgIDx0aXRsZSBpZD1jNCB4PVwiJ1EnXCI+PC90aXRsZT5cIlwiXCJcbiAgbXJnLmFwcGVuZF90ZXh0IHsgZHNrLCB0cms6IDEsIHRleHQsIH1cbiAgbXJnLmh0bWwucGFyc2VfZHNrIHsgZHNrLCB9XG4gIEgudGFidWxhdGUgXCIje3ByZWZpeH1fbWlycm9yXCIsICAgICAgICAgICAgICBkYiBTUUxcInNlbGVjdCAqIGZyb20gI3twcmVmaXh9X21pcnJvcjtcIlxuICBILnRhYnVsYXRlIFwiI3twcmVmaXh9X3Jhd19taXJyb3JcIiwgICAgICAgICAgZGIgU1FMXCJzZWxlY3QgKiBmcm9tICN7cHJlZml4fV9yYXdfbWlycm9yO1wiXG4gIEgudGFidWxhdGUgXCIje3ByZWZpeH1fcGFyYWdyYXBoc1wiLCAgICAgICAgICBkYiBTUUxcInNlbGVjdCAqIGZyb20gI3twcmVmaXh9X3BhcmFncmFwaHM7XCJcbiAgSC50YWJ1bGF0ZSBcIl8je3ByZWZpeH1fd3NfbGluZWNvdW50c1wiLCAgICAgIGRiIFNRTFwic2VsZWN0ICogZnJvbSBfI3twcmVmaXh9X3dzX2xpbmVjb3VudHM7XCJcbiAgIyBILnRhYnVsYXRlIFwiXyN7cHJlZml4fV93c19saW5lY291bnRzXCIsICAgICAgZGIgU1FMXCJcIlwic2VsZWN0XG4gICMgICAgICpcbiAgIyAgIGZyb20gI3twcmVmaXh9X3Jhd19taXJyb3IgYXMgcmF3X21pcnJvclxuICAjICAgam9pbiAje3ByZWZpeH1fbWlycm9yICAgICBhcyBtaXJyb3IgdXNpbmcgKCBkc2ssIG9sbiwgdHJrLCBwY2UgKTtcIlwiXCJcbiAgSC50YWJ1bGF0ZSBcIiN7cHJlZml4fV9odG1sX21pcnJvclwiLCAgICAgICAgIGRiIFNRTFwic2VsZWN0ICogZnJvbSAje3ByZWZpeH1faHRtbF9taXJyb3I7XCJcbiAgSC50YWJ1bGF0ZSBcIiN7cHJlZml4fV9odG1sX3RhZ3NfYW5kX2h0bWxcIiwgIGRiIFNRTFwic2VsZWN0ICogZnJvbSAje3ByZWZpeH1faHRtbF90YWdzX2FuZF9odG1sO1wiXG4gIHJlc3VsdCA9IGRiLmFsbF9yb3dzIFNRTFwiXCJcIlxuICAgIHNlbGVjdFxuICAgICAgICBvbG4sIHZcbiAgICAgIGZyb20gI3twcmVmaXh9X2h0bWxfbWlycm9yIGFzIG1cbiAgICAgIGpvaW4gI3twcmVmaXh9X2h0bWxfYXRycyBhcyBhIHVzaW5nICggYXRyaWQgKVxuICAgICAgd2hlcmUgdHJ1ZVxuICAgICAgICBhbmQgKCBtLnR5cCA9ICc8JyApXG4gICAgICAgIGFuZCAoIG0udGFnID0gJ3RpdGxlJyApXG4gICAgICAgIGFuZCAoIGEuayAgID0gJ3gnIClcbiAgICAgIG9yZGVyIGJ5IG0uZHNrLCBtLm9sbiwgbS50cmssIG0ucGNlO1wiXCJcIlxuICBUPy5lcSByZXN1bHQsIFtcbiAgICB7IG9sbjogMSwgdjogXCJRXCIsIH1cbiAgICB7IG9sbjogMywgdjogJ1EnLCB9XG4gICAgeyBvbG46IDUsIHY6ICdcIlFcIicsIH1cbiAgICB7IG9sbjogNywgdjogXCInUSdcIiwgfVxuICAgIF1cbiAgIyBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgZXJyb3IsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuICAjICAgYXdhaXQgVC5wZXJmb3JtIHByb2JlLCBtYXRjaGVyLCBlcnJvciwgLT4gcmV0dXJuIG5ldyBQcm9taXNlICggcmVzb2x2ZSwgcmVqZWN0ICkgLT5cbiAgIyAgICAgdXJsICAgID0gbXJnLl91cmxfZnJvbV9wYXRoIHByb2JlXG4gICMgICAgIHBhdGggICA9IG1yZy5fcGF0aF9mcm9tX3VybCB1cmxcbiAgIyAgICAgIyB1cmdlIHsgcHJvYmUsIHVybCwgcGF0aCwgfVxuICAjICAgICByZXNvbHZlIFsgdXJsLCBwYXRoLCBdXG4gIHJldHVybiBkb25lPygpXG5cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIk1pcmFnZSBIVE1MOiB0YWcgc3ludGF4IHZhcmlhbnRzXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gICMgVD8uaGFsdF9vbl9lcnJvcigpXG4gIHsgREJheSAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheSdcbiAgeyBNcmcgICB9ID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9kYmF5LW1pcmFnZSdcbiAgeyBIRE1MICB9ID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9oZG1sJ1xuICBkYiAgICAgICAgPSBuZXcgREJheSgpXG4gIG1yZyAgICAgICA9IG5ldyBNcmcgeyBkYiwgfVxuICAjIGRlYnVnICdeMjM3XicsIHsgdGV4dCwgcmV2ZWFsLCB9ID0gbXJnLmh0bWwuSFRNTElTSC5fdHVubmVsICdmb29cXFxcJzsgICBpbmZvIHJwciByZXZlYWwgdGV4dFxuICAjIGRlYnVnICdeMjM3XicsIHsgdGV4dCwgcmV2ZWFsLCB9ID0gbXJnLmh0bWwuSFRNTElTSC5fdHVubmVsICdmb29cXFxcYSc7ICBpbmZvIHJwciByZXZlYWwgdGV4dFxuICAjIGRlYnVnICdeMjM3XicsIHsgdGV4dCwgcmV2ZWFsLCB9ID0gbXJnLmh0bWwuSFRNTElTSC5fdHVubmVsICdmb29cXFxcXFxuJzsgIGluZm8gcnByIHJldmVhbCB0ZXh0XG4gICMgZGVidWcgJ14yMzdeJywgeyB0ZXh0LCByZXZlYWwsIH0gPSBtcmcuaHRtbC5IVE1MSVNILl90dW5uZWwgJ2Zvb1xcXFxcXFxcJzsgaW5mbyBycHIgcmV2ZWFsIHRleHRcbiAgIyByZXR1cm4gZG9uZSgpXG4gICMgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjIGRlYnVnICdeMzM2NzNeJywgcnByICggbXJnLmh0bWwuSFRNTElTSC5fdHVubmVsICdcXFxcJyApLnRleHRcbiAgIyBkZWJ1ZyAnXjMzNjczXicsIHJwciAoIG1yZy5odG1sLkhUTUxJU0guX3R1bm5lbCAnXFxcXFxcXFwnICkudGV4dFxuICAjIGRlYnVnICdeMzM2NzNeJywgcnByICggbXJnLmh0bWwuSFRNTElTSC5fdHVubmVsICdcXFxcJmFtcDsnICkudGV4dFxuICAjIHJldHVybiBkb25lPygpXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiAgICAjIFsgJzxweS9saW5nMy8nLCAgICAgICAgIG51bGwsIF1cbiAgICBbICc8IHRpdGxlPk15IFBhZ2U8IC90aXRsZT4nLCBcIigwLTgpPGVycm9yIG1lc3NhZ2U9J2V4dHJhbmVvdXMgd2hpdGVzcGFjZSBiZWZvcmUgdGFnIG5hbWUnPiZsdDsgdGl0bGUmZ3Q7PC9lcnJvcj58KDgtMTUpTXkgUGFnZXwoMTUtMTgpPGVycm9yIG1lc3NhZ2U9J2V4dHJhbmVvdXMgd2hpdGVzcGFjZSBiZWZvcmUgdGFnIG5hbWUnPiZsdDsgLzwvZXJyb3I+fCgxNy0xOCk8ZXJyb3IgbWVzc2FnZT0nRXhwZWN0aW5nIHRva2VuIG9mIHR5cGUgLS0mZ3Q7IGlfbmFtZSAmbHQ7LS0gYnV0IGZvdW5kIC0tJmd0OyAmIzM5Oy8mIzM5OyAmbHQ7LS0nPi88L2Vycm9yPnwoMTgtMjQpdGl0bGU+XCIsIG51bGwgXVxuICAgIFsgJzx0aXRsZT5NeSBQYWdlPC90aXRsZT4nLCAnKDAtNyk8dGl0bGU+fCg3LTE0KU15IFBhZ2V8KDE0LTIyKTwvdGl0bGU+JywgbnVsbCBdXG4gICAgWyAnPHRpdGxlID5NeSBQYWdlPCAvdGl0bGU+JywgXCIoMC04KTx0aXRsZT58KDgtMTUpTXkgUGFnZXwoMTUtMTgpPGVycm9yIG1lc3NhZ2U9J2V4dHJhbmVvdXMgd2hpdGVzcGFjZSBiZWZvcmUgdGFnIG5hbWUnPiZsdDsgLzwvZXJyb3I+fCgxNy0xOCk8ZXJyb3IgbWVzc2FnZT0nRXhwZWN0aW5nIHRva2VuIG9mIHR5cGUgLS0mZ3Q7IGlfbmFtZSAmbHQ7LS0gYnV0IGZvdW5kIC0tJmd0OyAmIzM5Oy8mIzM5OyAmbHQ7LS0nPi88L2Vycm9yPnwoMTgtMjQpdGl0bGU+XCIsIG51bGwgXVxuICAgIFsgJzx0aXRsZT5NeSBQYWdlPCAvdGl0bGU+JywgXCIoMC03KTx0aXRsZT58KDctMTQpTXkgUGFnZXwoMTQtMTcpPGVycm9yIG1lc3NhZ2U9J2V4dHJhbmVvdXMgd2hpdGVzcGFjZSBiZWZvcmUgdGFnIG5hbWUnPiZsdDsgLzwvZXJyb3I+fCgxNi0xNyk8ZXJyb3IgbWVzc2FnZT0nRXhwZWN0aW5nIHRva2VuIG9mIHR5cGUgLS0mZ3Q7IGlfbmFtZSAmbHQ7LS0gYnV0IGZvdW5kIC0tJmd0OyAmIzM5Oy8mIzM5OyAmbHQ7LS0nPi88L2Vycm9yPnwoMTctMjMpdGl0bGU+XCIsIG51bGwgXVxuICAgIFsgJzx0aXRsZT5NeSBQYWdlPC8gdGl0bGU+JywgXCIoMC03KTx0aXRsZT58KDctMTQpTXkgUGFnZXwoMTQtMjMpPGVycm9yIG1lc3NhZ2U9J2V4dHJhbmVvdXMgd2hpdGVzcGFjZSBpbiBjbG9zaW5nIHRhZyc+Jmx0Oy8gdGl0bGUmZ3Q7PC9lcnJvcj5cIiwgbnVsbCBdXG4gICAgWyAnPHRpdGxlPk15IFBhZ2U8L3RpdGxlID4nLCAnKDAtNyk8dGl0bGU+fCg3LTE0KU15IFBhZ2V8KDE0LTIzKTwvdGl0bGU+JywgbnVsbCBdXG4gICAgWyAnPHRpdGxlL015XFxcXC9Zb3VyIFBhZ2UvPicsICcoMC03KTx0aXRsZT58KDctMjEpTXkvWW91ciBQYWdlfCgyMS0yMik8L3RpdGxlPnwoMjItMjMpPicsIG51bGwgXVxuICAgIFsgJzx0aXRsZT5NeSBQYWdlPC8+JywgXCIoMC03KTx0aXRsZT58KDctMTQpTXkgUGFnZXwoMTQtMTcpPC90aXRsZT58KDE2LTE3KTxlcnJvciBtZXNzYWdlPSdFeHBlY3RpbmcgdG9rZW4gb2YgdHlwZSAtLSZndDsgaV9uYW1lICZsdDstLSBidXQgZm91bmQgLS0mZ3Q7ICYjMzk7Jmd0OyYjMzk7ICZsdDstLSc+Jmd0OzwvZXJyb3I+XCIsIG51bGwgXVxuICAgIFsgJzx0aXRsZS9NeSBQYWdlLz4nLCAnKDAtNyk8dGl0bGU+fCg3LTE0KU15IFBhZ2V8KDE0LTE1KTwvdGl0bGU+fCgxNS0xNik+JywgbnVsbCBdXG4gICAgWyAnPHRpdGxlL015L1lvdXIgUGFnZS8+JywgJygwLTcpPHRpdGxlPnwoNy05KU15fCg5LTEwKTwvdGl0bGU+fCgxMC0yMSlZb3VyIFBhZ2UvPicsIG51bGwgXVxuICAgIFsgJzx0aXRsZS9NeVxcbnBhZ2UvJywgJygwLTcpPHRpdGxlPnwoNy0xNClNeVxcbnBhZ2V8KDE0LTE1KTwvdGl0bGU+JywgbnVsbCBdXG4gICAgWyAnPHRpdGxlIGs9diBqPXcvTXkgUGFnZS8nLCBcIigwLTE1KTx0aXRsZSBrPSd2JyBqPSd3Jz58KDE1LTIyKU15IFBhZ2V8KDIyLTIzKTwvdGl0bGU+XCIsIG51bGwgXVxuICAgIFsgJzx0aXRsZS88Yj5NeTwvYj4gUGFnZS8nLCBcIigwLTcpPHRpdGxlPnwoNy0xMyk8ZXJyb3IgbWVzc2FnZT0nYmFyZSBhY3RpdmUgY2hhcmFjdGVycyc+Jmx0O2ImZ3Q7TXkmbHQ7PC9lcnJvcj58KDEzLTE0KTwvdGl0bGU+fCgxNC0yMiliPiBQYWdlL1wiLCBudWxsIF1cbiAgICBbICc8dGl0bGUvLycsICcoMC03KTx0aXRsZT58KDctOCk8L3RpdGxlPicsIG51bGwgXVxuICAgIFsgJzx0aXRsZS8+JywgJygwLTgpPHRpdGxlLz58KDAtOCk8dGl0bGUvPicsIG51bGwgXVxuICAgIFsgJzx0aXRsZS9NeSBQYWdlLycsICcoMC03KTx0aXRsZT58KDctMTQpTXkgUGFnZXwoMTQtMTUpPC90aXRsZT4nLCBudWxsIF1cbiAgICBbICc8dGl0bGUjYzEueC9NeSBQYWdlLycsIFwiKDAtMTIpPHRpdGxlIGlkPSdjMScgY2xhc3M9J3gnPnwoMTItMTkpTXkgUGFnZXwoMTktMjApPC90aXRsZT5cIiwgbnVsbCBdXG4gICAgWyAnXFxcXDx0aXRsZS8+JywgJygwLTEwKSZsdDt0aXRsZS8+JywgbnVsbCBdXG4gICAgWyAnXFxcXCZhbXA7JywgJygwLTcpJmFtcDthbXA7JywgbnVsbCBdXG4gICAgWyAnZm9vXFxcXGJhcicsICcoMC04KWZvb2JhcicsIG51bGwgXVxuICAgIFsgJ1xcXFxhYmMnLCAnKDAtNSlhYmMnLCBudWxsIF1cbiAgICBbICdmb29cXFxcXFxcXGJhcicsICcoMC05KWZvb1xcXFxiYXInLCBudWxsIF1cbiAgICBbICdmaXJzdFxcXFxcXG5zZWNvbmQnLCAnKDAtMTQpZmlyc3RzZWNvbmQnLCBudWxsIF1cbiAgICBbICd4eHgmYW1wO3h4eCcsICcoMC0zKXh4eHwoMy04KShOQ1I6bmFtZWQ6JmFtcDspfCg4LTExKXh4eCcsIG51bGwgXVxuICAgIF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgZXJyb3IsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuICAgIGF3YWl0IFQucGVyZm9ybSBwcm9iZSwgbWF0Y2hlciwgZXJyb3IsIC0+IHJldHVybiBuZXcgUHJvbWlzZSAoIHJlc29sdmUsIHJlamVjdCApIC0+XG4gICAgICAjIGhlbHAgJ140MzUtMTJeJywgcnByIHByb2JlXG4gICAgICBwYXJ0cyA9IFtdXG4gICAgICBmb3IgZCBpbiBtcmcuaHRtbC5IVE1MSVNILnBhcnNlIHByb2JlXG4gICAgICAgIHBhcnRzLnB1c2ggdGV4dF9mcm9tX3Rva2VuIGRcbiAgICAgICAgZCA9IHRoYXcgZFxuICAgICAgICBkZWxldGUgZC4kXG4gICAgICAgIGRlbGV0ZSBkLiR2bnJcbiAgICAgICAgIyB1cmdlICdeNDM1LTEzXicsIGRcbiAgICAgIHJlc3VsdCA9IHBhcnRzLmpvaW4gJ3wnXG4gICAgICAjIGVjaG8gQ05ELmJsdWUgWyBwcm9iZSwgbWF0Y2hlciwgbnVsbCwgXVxuICAgICAgcmVzb2x2ZSByZXN1bHRcbiAgICAgICMgcmVzb2x2ZSBtYXRjaGVyICMgISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISFcbiAgICAgIHJldHVybiBudWxsXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZSgpXG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQFsgXCJNaXJhZ2UgSFRNTDogWE5DUiBwYXJzaW5nIDFcIiBdID0gKCBULCBkb25lICkgLT5cbiAgeyBIdG1saXNoIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXktbWlyYWdlL2xpYi9odG1saXNoLXBhcnNlcidcbiAgIyB7IERCYXkgIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXknXG4gICMgeyBNcmcgICB9ID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9kYmF5LW1pcmFnZSdcbiAgIyB7IEhETUwgIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2hkbWwnXG4gICMgZGIgICAgICAgID0gbmV3IERCYXkoKVxuICAjIG1yZyAgICAgICA9IG5ldyBNcmcgeyBkYiwgfVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcHJvYmVzID0gW1xuICAgIFsgJ25vdGhpbmcgdG8gc2VlIGhlcmUnLCAgdW5kZWZpbmVkLCBdXG4gICAgWyAnJmJhcjsnLCAgICAgICAgICAgICAgICB7IG5hbWU6ICdiYXInIH0sICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICBbICcmI3gxMjM7JywgICAgICAgICAgICAgIHsgaGV4OiAnMTIzJyB9LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgIFsgJyYjMTIzOycsICAgICAgICAgICAgICAgeyBkZWM6ICcxMjMnIH0sICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgWyAnJnh5I3gxMjM7JywgICAgICAgICAgICB7IGNzZzogJ3h5JywgaGV4OiAnMTIzJyB9LCB7IG5hbWU6ICdiYXonIH0sIF1cbiAgICBdXG4gIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc1xuICAgIG1hdGNoICAgPSBwcm9iZS5tYXRjaCBIdG1saXNoLkMueG5jci5tYXRjaGVyXG4gICAgaWYgbWF0Y2g/XG4gICAgICByZXN1bHQgPSB7IG1hdGNoLmdyb3Vwcy4uLiwgfVxuICAgICAgZGVsZXRlIHJlc3VsdFsga2V5IF0gZm9yIGtleSwgdmFsdWUgb2YgcmVzdWx0IHdoZW4gbm90IHZhbHVlP1xuICAgICMgdXJnZSAnXjY1Ml4nLCBbIHByb2JlLCByZXN1bHQsIF1cbiAgICBUPy5lcSBtYXRjaGVyLCByZXN1bHRcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvbmU/KClcbiAgcmV0dXJuIG51bGxcblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiTWlyYWdlIEhUTUw6IFhOQ1IgcGFyc2luZyAyXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gICMgVD8uaGFsdF9vbl9lcnJvcigpXG4gIHsgREJheSAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheSdcbiAgeyBNcmcgICB9ID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9kYmF5LW1pcmFnZSdcbiAgeyBIRE1MICB9ID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9oZG1sJ1xuICBkYiAgICAgICAgPSBuZXcgREJheSgpXG4gIG1yZyAgICAgICA9IG5ldyBNcmcgeyBkYiwgfVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHByb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXG4gICAgWyAnPGIgeD1cIiZcIj4mbHQ7PCZmb287JywgXCIoMC05KTxiIHg9JyZhbXA7Jz4oMC00KShOQ1I6bmFtZWQ6Jmx0OykoMTMtMTkpPCZmb287PigxNC0xOSk8ZXJyb3IgbWVzc2FnZT0nRXhwZWN0aW5nOiBvbmUgb2YgdGhlc2UgcG9zc2libGUgVG9rZW4gc2VxdWVuY2VzOiYjMTA7ICAxLiBbaV9jbG9zZV0mIzEwOyAgMi4gW2lfc2xhc2hfY2xvc2VdJiMxMDsgIDMuIFtzdG1fc2xhc2gxXSYjMTA7YnV0IGZvdW5kOiAmIzM5OyYjMzk7Jz4mYW1wO2Zvbzs8L2Vycm9yPlwiLCBudWxsIF1cbiAgICBbICcmZm9vOycsICcoMC01KShOQ1I6bmFtZWQ6JmZvbzspJywgbnVsbCBdXG4gICAgWyAnYWJjZGVmJywgJygwLTYpYWJjZGVmJywgbnVsbCBdXG4gICAgWyAneHh4JiN4MTIzO3h4eCcsICcoMC0zKXh4eCgzLTEwKShOQ1I6bmNyOiYjeDEyMzspKDEwLTEzKXh4eCcsIG51bGwgXVxuICAgIFsgJ3h4eCYjMTIzO3h4eCcsICcoMC0zKXh4eCgzLTkpKE5DUjpuY3I6JiMxMjM7KSg5LTEyKXh4eCcsIG51bGwgXVxuICAgIFsgJ3h4eCZqenIjeGUxMjM7eHh4JywgJygwLTMpeHh4KDMtMTQpKE5DUjp4bmNyOiZqenIjeGUxMjM7KSgxNC0xNyl4eHgnLCBudWxsIF1cbiAgICBbICd4eHgmYW1wO3h4eCcsICcoMC0zKXh4eCgzLTgpKE5DUjpuYW1lZDomYW1wOykoOC0xMSl4eHgnLCBudWxsIF1cbiAgICBbICdmb28gJmFtcDtiYXImanpyI3hlMTIzOyBiYXonLCAnKDAtNClmb28gKDQtOSkoTkNSOm5hbWVkOiZhbXA7KSg5LTEyKWJhcigxMi0yMykoTkNSOnhuY3I6Jmp6ciN4ZTEyMzspKDIzLTI3KSBiYXonLCBudWxsIF1cbiAgICBbICd4eHgmYSZtcDt4eHgnLCBcIigwLTMpeHh4KDMtOSk8ZXJyb3IgbWVzc2FnZT0nYmFyZSBhY3RpdmUgY2hhcmFjdGVycyc+JmFtcDthJmFtcDttcDs8L2Vycm9yPig5LTEyKXh4eFwiLCBudWxsIF1cbiAgICBdXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIGVycm9yLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiAgICBhd2FpdCBULnBlcmZvcm0gcHJvYmUsIG1hdGNoZXIsIGVycm9yLCAtPiByZXR1cm4gbmV3IFByb21pc2UgKCByZXNvbHZlLCByZWplY3QgKSAtPlxuICAgICAgIyBoZWxwICdeNDM1LTEyXicsIHJwciBwcm9iZVxuICAgICAgcGFydHMgPSBbXVxuICAgICAgZm9yIGQgaW4gbXJnLmh0bWwuSFRNTElTSC5wYXJzZSBwcm9iZVxuICAgICAgICBkID0gdGhhdyBkXG4gICAgICAgIGRlbGV0ZSBkLiRcbiAgICAgICAgZGVsZXRlIGQuJHZuclxuICAgICAgICAjIHVyZ2UgJ14zNDJeJywgZFxuICAgICAgICBwYXJ0cy5wdXNoIHRleHRfZnJvbV90b2tlbiBkXG4gICAgICByZXN1bHQgPSBwYXJ0cy5qb2luICcnXG4gICAgICByZXNvbHZlIHJlc3VsdFxuICAgICAgcmV0dXJuIG51bGxcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkb25lKClcbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIk1pcmFnZSBIVE1MOiBwYXJzZSBzdHJldGNoIHdpdGggY29tcGFjdCB0YWduYW1lc1wiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIFQ/LmhhbHRfb25fZXJyb3IoKVxuICB7IERCYXkgIH0gPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXknXG4gIHsgTXJnICAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheS1taXJhZ2UnXG4gIHsgSERNTCAgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvaGRtbCdcbiAgZGIgICAgICAgID0gbmV3IERCYXkoKVxuICBtcmcgICAgICAgPSBuZXcgTXJnIHsgZGIsIH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW1xuICAgICMgWyAnPGZvby1iYXIjYzU1Pip4eHgqPC9mb28tYmFyPicsICcoMC0xMyk8Zm9vLWJhcj4jKDEzLTE3KTxlbT4jKDE3LTIwKXh4eCMoMjAtMjUpPC9lbT4jKDI1LTM1KTwvZm9vLWJhcj4nLCBudWxsIF1cbiAgICBbICc8Zm9vLWJhciNjNTU+Knh4eCo8L2Zvby1iYXI+JywgXCIoMC0xMyk8Zm9vLWJhciBpZD0nYzU1Jz4jKDEzLTE3KTxlbT4jKDE3LTIwKXh4eCMoMjAtMjUpPC9lbT4jKDI1LTM1KTwvZm9vLWJhcj5cIiwgbnVsbCBdXG4gICAgWyAnMSBcXFxcPCAyJywgJygwLTcpMSAmbHQ7IDInLCBudWxsIF1cbiAgICBbICc8Zm9vLWJhciNjNTUuYmxhaC5iZWVwPnh4eDwvZm9vLWJhcj4nLCBcIigwLTIzKTxmb28tYmFyIGlkPSdjNTUnIGNsYXNzPSdibGFoIGJlZXAnPiMoMjMtMjYpeHh4IygyNi0zNik8L2Zvby1iYXI+XCIsIG51bGwgXVxuICAgIFsgJzxmb28tYmFyI2M1NT5oZXJlICZhbXA7IHRoZXJlPC9mb28tYmFyPicsIFwiKDAtMTMpPGZvby1iYXIgaWQ9J2M1NSc+IygwLTUpaGVyZSAjKDUtMTApKE5DUjpuYW1lZDomYW1wOykjKDEwLTE2KSB0aGVyZSMoMjktMzkpPC9mb28tYmFyPlwiLCBudWxsIF1cbiAgICBbICc8Zm9vLWJhciNjNTU+MSA8IDI8L2Zvby1iYXI+JywgXCJcIlwiKDAtMTMpPGZvby1iYXIgaWQ9J2M1NSc+IygxMy0xNSkxICMoMTUtMjApPGVycm9yIG1lc3NhZ2U9J2V4dHJhbmVvdXMgd2hpdGVzcGFjZSBiZWZvcmUgdGFnIG5hbWUnPiZsdDsgMiZsdDsvPC9lcnJvcj4jKDE4LTE5KTxlcnJvciBtZXNzYWdlPSdleHRyYW5lb3VzIGNoYXJhY3RlcnMgb24gbGluZSAxIGNvbHVtbiAxOTogXCImbHQ7XCInPiZsdDs8L2Vycm9yPiMoMjAtMjgpZm9vLWJhcj5cIlwiXCIsIG51bGwgXVxuICAgIF1cbiAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIGVycm9yLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiAgICBhd2FpdCBULnBlcmZvcm0gcHJvYmUsIG1hdGNoZXIsIGVycm9yLCAtPiBuZXcgUHJvbWlzZSAoIHJlc29sdmUgKSAtPlxuICAgICAgdG9rZW5zICA9IG1yZy5odG1sLkhUTUxJU0gucGFyc2UgcHJvYmVcbiAgICAgIHRva2VuLm1lc3NhZ2UgPz0gbnVsbCBmb3IgdG9rZW4gaW4gdG9rZW5zXG4gICAgICAjIEgudGFidWxhdGUgcHJvYmUsIHRva2Vuc1xuICAgICAgcGFydHMgPSBbXVxuICAgICAgZm9yIGQgaW4gdG9rZW5zXG4gICAgICAgIHBhcnRzLnB1c2ggdGV4dF9mcm9tX3Rva2VuIGRcbiAgICAgIHJlc29sdmUgcGFydHMuam9pbiAnIydcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkb25lKClcbiAgcmV0dXJuIG51bGxcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmlmIHJlcXVpcmUubWFpbiBpcyBtb2R1bGUgdGhlbiBkbyA9PlxuICB0ZXN0IEBcbiAgIyBAWyBcIk1pcmFnZSBIVE1MOiBxdW90ZXMgaW4gYXR0cmlidXRlIHZhbHVlc1wiIF0oKVxuICAjIHRlc3QgQFsgXCJNaXJhZ2UgSFRNTDogcXVvdGVzIGluIGF0dHJpYnV0ZSB2YWx1ZXNcIiBdXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyB0ZXN0IEBbIFwiTWlyYWdlIEhUTUw6IHBhcnNlIHN0cmV0Y2ggd2l0aCBjb21wYWN0IHRhZ25hbWVzXCIgXVxuICAjIEBbIFwiTWlyYWdlIEhUTUw6IEJhc2ljIGZ1bmN0aW9uYWxpdHlcIiBdKClcbiAgIyB0ZXN0IEBbIFwiYWx0ZXJpbmcgbWlycm9yZWQgc291cmNlIGxpbmVzIGNhdXNlcyBlcnJvclwiIF1cbiAgIyBAWyBcImFsdGVyaW5nIG1pcnJvcmVkIHNvdXJjZSBsaW5lcyBjYXVzZXMgZXJyb3JcIiBdKClcbiAgIyB0ZXN0IEBbIFwiTWlyYWdlIEhUTUw6IHRhZyBzeW50YXggdmFyaWFudHNcIiBdXG4gICMgQFsgXCJNaXJhZ2UgSFRNTDogWE5DUiBwYXJzaW5nIDFcIiBdKClcbiAgIyB0ZXN0IEBbIFwiTWlyYWdlIEhUTUw6IFhOQ1IgcGFyc2luZyAxXCIgXVxuICAjIHRlc3QgQFsgXCJNaXJhZ2UgSFRNTDogWE5DUiBwYXJzaW5nIDJcIiBdXG4gICMgZm9yIG1hdGNoIGZyb20gJ3h4eGFiY3hkZWZ4eHgnLm1hdGNoQWxsIC8oPzx4cz54ezIsfSl8KD88bm90eD5bXnhdKyl8KD88YW55Pi4rPykvZ1xuICAjICAgdGV4dCAgICA9IG1hdGNoWyAwIF1cbiAgIyAgIGluZGV4ICAgPSBtYXRjaC5pbmRleFxuICAjICAgcmVzdWx0ICA9IHsgdGV4dCwgaW5kZXgsIH1cbiAgIyAgIHJlc3VsdFsgayBdID0gdiBmb3IgaywgdiBvZiBtYXRjaC5ncm91cHMgd2hlbiB2P1xuICAjICAgaW5mbyAnXjkwNF4nLCByZXN1bHRcblxuIl19

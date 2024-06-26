(function() {
  'use strict';
  var CND, alert, badge, debug, demo_2, demo_comprehensive_tagnames, demo_cupofhtml_without_newlines, echo, help, info, log, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/INTERTEXT/DEMO-CUPOFHTML';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var H, INTERTEXT, S, coh, d, ds, i, len, tag, trim;
    INTERTEXT = require('../../../apps/intertext');
    coh = new INTERTEXT.CUPOFHTML.Cupofhtml({
      flatten: true
    });
    ({tag, H, S} = coh.export());
    S.doctype('html');
    tag('mytag');
    H.title("A Short Introduction");
    S.link_css('https://example.com/style.css');
    S.newline();
    S.script('https://example.com/script.js');
    S.newline();
    S.script(function() {
      return console.log('helo world');
    });
    S.newline();
    H.h1({
      id: 'c334'
    }, "The Importance of Being Earnest");
    H.div({
      id: 'c334'
    }, function() {
      S.comment("just a comment");
      S.text("foo", "bar");
      S.raw("foo", "bar");
      return S.text("helo");
    });
    H.p("Some remarks");
    // tag 'mytag', { style: "display:block;width:50%;", }
    // tag 'othertag', { style: "display:block;", }, "some ", ->
    //   tag 'bold', "bold content"
    //   coh.text " here indeed."
    // tag 'p', ->
    //   coh.text "It is very ", ( -> tag 'em', "convenient" ), " to write"
    // tag 'p', ->
    //   coh.text "It is very "
    //   tag 'em', "convenient"
    //   coh.text " to write"
    // tag 'mytag', =>
    //   tag 'h1', => #, { id: 'c67', }
    //     tag 'p', "helo world"
    // debug '^3344^', coh
    ds = coh.expand();
    for (i = 0, len = ds.length; i < len; i++) {
      d = ds[i];
      echo(CND.blue(d));
    }
    trim = function(text) {
      return text.replace(/\s+$/, '');
    };
    return urge('^3344^', '\n' + trim(INTERTEXT.HTML.html_from_datoms(ds)));
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_comprehensive_tagnames = function() {
    var INTERTEXT, html;
    INTERTEXT = require('../../../apps/intertext');
    html = new INTERTEXT.CUPOFHTML.Cupofhtml({
      flatten: true
    });
    urge(INTERTEXT.HTML._parse_compact_tagname('mytag'));
    urge(INTERTEXT.HTML._parse_compact_tagname('mytag#id8702'));
    urge(INTERTEXT.HTML._parse_compact_tagname('mytag.flat.draggable'));
    return urge(INTERTEXT.HTML._parse_compact_tagname('mytag#id77787.flat.draggable'));
  };

  // debug '^3344^', h
  // ds = h.expand()
  // info d for d in ds
  // debug '^3344^', INTERTEXT.HTML.html_from_datoms ds

  //-----------------------------------------------------------------------------------------------------------
  demo_cupofhtml_without_newlines = function() {
    var Cupofhtml, INTERTEXT, cupofhtml;
    INTERTEXT = require('../../../apps/intertext');
    ({Cupofhtml} = INTERTEXT.CUPOFHTML);
    //.........................................................................................................
    cupofhtml = new Cupofhtml({
      newlines: false
    });
    info(cupofhtml.settings);
    info(CND.truth(INTERTEXT.types.equals(cupofhtml.settings.newlines, false)));
    //.........................................................................................................
    cupofhtml = new Cupofhtml({
      newlines: true
    });
    info(cupofhtml.settings);
    info(CND.truth(INTERTEXT.types.equals(cupofhtml.settings.newlines, true)));
    //.........................................................................................................
    cupofhtml = new Cupofhtml();
    info(cupofhtml.settings);
    return info(CND.truth(INTERTEXT.types.equals(cupofhtml.settings.newlines, true)));
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo()
      demo_2();
      demo_comprehensive_tagnames();
      return demo_cupofhtml_without_newlines();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-cupofhtml.js.map
(function() {
  'use strict';
  var CND, alert, badge, debug, demo, echo, help, info, log, provide_new_cupofhtml_implementation, rpr, urge, warn, whisper;

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

  provide_new_cupofhtml_implementation = function() {
    var DATOM, INTERTEXT, isa, validate;
    DATOM = require('datom');
    INTERTEXT = require('../../../apps/intertext');
    ({isa, validate} = INTERTEXT.types.export());
    //---------------------------------------------------------------------------------------------------------
    return this.Cupofhtml = class Cupofhtml extends DATOM.Cupofdatom {
      // @include CUPOFHTML, { overwrite: false, }
      // @extend MAIN, { overwrite: false, }

        // #---------------------------------------------------------------------------------------------------------
      // constructor: ( settings = null) ->
      //   super { { flatten: true, }..., settings..., }
      //   return @

        // #---------------------------------------------------------------------------------------------------------
      // tag: ( tagname, content... ) ->
      //   return @cram content...      unless tagname?
      //   ### TAINT allow extended syntax, attributes ###
      //   return @cram new_datom "^#{tagname}" if content.length is 0
      //   return @cram ( new_datom "<#{tagname}" ), content..., ( new_datom ">#{tagname}" )

        // #---------------------------------------------------------------------------------------------------------
      // text:     ( P... ) -> @cram MAIN.text     P...
      // raw:      ( P... ) -> @cram MAIN.raw      P...
      // script:   ( P... ) -> @cram MAIN.script   P...
      // css:      ( P... ) -> @cram MAIN.css      P...

        //---------------------------------------------------------------------------------------------------------
      tag(name, ...content) {
        validate.intertext_html_tagname;
        if (isa.nonempty_text(name)) {
          name = `html:${name}`;
        }
        debug('^3536^', {name, content});
        return this.cram(name, ...content);
      }

      //---------------------------------------------------------------------------------------------------------
      text(...content) {
        return this.tag(null, ...content);
      }

    };
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var INTERTEXT, c, cram, d, ds, expand, i, len, results, tag, text;
    INTERTEXT = require('../../../apps/intertext');
    provide_new_cupofhtml_implementation.apply(INTERTEXT.HTML);
    c = new INTERTEXT.HTML.Cupofhtml({
      flatten: true
    });
    ({cram, expand, tag, text} = c.export());
    tag('mytag');
    tag('mytag', {
      style: "display:block;width:50%;"
    });
    tag('othertag', {
      style: "display:block;"
    }, "some ", function() {
      tag('bold', "content");
      return text("here indeed.");
    });
    tag('p', function() {
      return text("It is very ", tag('em', "convenient"), " to write");
    });
    // tag 'mytag', =>
    //   tag 'h1', => #, { id: 'c67', }
    //     tag 'p', "helo world"
    debug('^3344^', c);
    ds = expand();
    results = [];
    for (i = 0, len = ds.length; i < len; i++) {
      d = ds[i];
      results.push(info(d));
    }
    return results;
  };

  // debug '^3344^', INTERTEXT.HTML.html_from_datoms ds

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-cupofhtml.js.map
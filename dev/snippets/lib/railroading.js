(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, echo, equals, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'RAILROADING';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this.demo_railroad_diagrams = function() {
    var RR, d, html, path, pos1, pos2;
    // Diagram
    // ComplexDiagram
    // Sequence
    // Choice
    // Optional
    // OneOrMore
    // ZeroOrMore
    // Terminal
    // NonTerminal
    // Comment
    // Skip
    // { JSDOM }           = require 'jsdom'
    // dom                 = new JSDOM '', { pretendToBeVisual: true }
    // globalThis.window   = dom.window
    // globalThis.document = dom.document
    // debug '^78643^', ( k for k of document )
    RR = require('railroad-diagrams');
    d = RR.Diagram('foo', RR.Choice(0, 'bar', 'baz'));
    d.format(0, 0, 0, 0);
    path = PATH.resolve(PATH.join(__dirname, '../../../apps-typesetting/html+svg-demos/railroading-output.html'));
    html = FS.readFileSync(path, {
      encoding: 'utf-8'
    });
    pos1 = html.indexOf('<svg class="railroad-diagram" ');
    pos2 = (html.indexOf('</svg>')) + 6;
    if (!(pos1 >= 0 && pos2 >= 0)) {
      throw new Error("unable to find target");
    }
    html = html.slice(0, pos1) + urge(d.toString() + html.slice(pos2));
    FS.writeFileSync(path, html);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_railroad_diagrams();
    })();
  }

}).call(this);

//# sourceMappingURL=railroading.js.map
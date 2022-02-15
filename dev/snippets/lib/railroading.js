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
    // Choice
    // Comment
    // ComplexDiagram
    // Diagram
    // NonTerminal
    // OneOrMore
    // Optional
    // Sequence
    // Skip
    // Terminal
    // ZeroOrMore

    // RR    = require 'tetsudou'
    RR = require('../../../apps/tetsudou');
    // debug '^948^', RR.Options
    // RR.Options.VS = 20
    // RR.Options.AR = 8
    //.........................................................................................................
    d = RR.ComplexDiagram('foo', RR.Sequence(RR.Terminal('a node'), RR.Terminal('other')), RR.Choice(0, 'bar', 'baz'), RR.NonTerminal('nonterminal'), RR.Stack(RR.ZeroOrMore(RR.Terminal('A'), RR.Comment('whatever'), 'skip'), RR.Optional('+', 'skip'), RR.Choice(0, RR.NonTerminal('name-start char'), RR.NonTerminal('escape')), RR.ZeroOrMore(RR.Choice(0, RR.NonTerminal('name char'), RR.NonTerminal('escape')))));
    //.........................................................................................................
    // d.format 10, 10, 10, 10
    // d.walk ( P... ) ->
    //   debug '^587^', P
    //   return null
    //.........................................................................................................
    path = PATH.resolve(PATH.join(__dirname, '../../../apps-typesetting/html+svg-demos/railroading-output.html'));
    html = FS.readFileSync(path, {
      encoding: 'utf-8'
    });
    pos1 = html.indexOf('<svg class="railroad-diagram" ');
    pos2 = (html.indexOf('</svg>')) + 6;
    if (!(pos1 >= 0 && pos2 >= 0)) {
      throw new Error("unable to find target");
    }
    html = html.slice(0, pos1) + d.toString() + html.slice(pos2);
    FS.writeFileSync(path, html);
    help(`output written to ${PATH.relative(process.cwd(), path)}`);
    // # debug await import( '/Users/benutzer/3rdparty/tetsudou/railroad.mjs' )
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.require_esm = function(path) {
    var require_esm;
    require_esm = (require('esm'))(module);
    return (require_esm(path)).default;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_railroad_diagrams();
    })();
  }

  // debug require '../../../apps/tetsudou/loader.js'
// debug require '../../../apps/tetsudou'
// debug @require_esm

}).call(this);

//# sourceMappingURL=railroading.js.map
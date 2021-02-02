(function() {
  'use strict';
  var CND, FS, HTML, PATH, alert, badge, debug, echo, help, info, jr, log, rpr, urge, warn, whisper,
    splice = [].splice;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/SNIPPETS/FIND-SVELTE-SCRIPT-TAGS';

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

  // #...........................................................................................................
  // DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
  // { new_datom
  //   lets
  //   select }                = DATOM.export()
  // #...........................................................................................................
  // # test                      = require 'guy-test'
  // types                     = new ( require 'intertype' ).Intertype()
  // { isa
  //   declare
  //   validate
  //   cast
  //   type_of }               = types.export()
  FS = require('fs');

  PATH = require('path');

  HTML = require('../../../apps/paragate/lib/htmlish.grammar');

  HTML = new HTML.new_grammar({
    bare: true
  });

  //-----------------------------------------------------------------------------------------------------------
  this._find_script_block_idxs = function(me, lines) {
    /* NOTE this part developed in hengist/dev/snippets/src/find-svelte-script-tags.coffee */
    /* NOTE will mis-identify code blocks wrapped in HTML comments */
    var R, i, idx, len, line, location, start_pattern, stop_pattern, tag;
    R = [];
    start_pattern = /^(<script\b.*\blang=coffeescript.*>|<script\b.*\blang='coffeescript'.*>|<script\b.*\blang="coffeescript".*>)$/;
    stop_pattern = /^<\/script>$/;
    location = 'outside';
    for (idx = i = 0, len = lines.length; i < len; idx = ++i) {
      line = lines[idx];
      if (location === 'outside') {
        if ((line.match(start_pattern)) != null) {
          tag = (HTML.parse(line))[0];
          R.push({
            start: idx,
            stop: null,
            tag
          });
          location = 'inside';
        }
      } else {
        if ((line.match(stop_pattern)) != null) {
          R[R.length - 1].stop = idx;
          location = 'outside';
        }
      }
    }
    return R;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function() {
    var block, blocks, full_text, i, idx, js_txt, lines, path, ref, ref1, result, source_txt, start, stop;
    path = '../../../dev/sveltekit-with-coffeescript/origin/src/components/Counter.svelte';
    path = PATH.resolve(PATH.join(__dirname, path));
    full_text = FS.readFileSync(path, {
      encoding: 'utf-8'
    });
    lines = full_text.split(/\n/);
    blocks = this._find_script_block_idxs(null, lines);
    for (idx = i = ref = blocks.length - 1; i >= 0; idx = i += -1) {
      block = blocks[idx];
      ({start, stop} = block);
      if (!((start != null) && (stop != null))) {
        warn(`^3332^ unclosed script: ${rpr(block)}`);
        continue;
      }
      source_txt = lines.slice(start + 1, +(stop - 1) + 1 || 9e9).join('\n');
      js_txt = '// JS here';
      /* TAINT must honor 'module' scripts */
      lines[start] = '<script>';
      splice.apply(lines, [(ref1 = start + 1), (stop - 1) - ref1 + 1].concat([js_txt])), [js_txt];
      info(block);
      urge('\n' + source_txt);
    }
    //.........................................................................................................
    result = lines.join('\n');
    help('\n' + result);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await this.demo());
    })();
  }

}).call(this);

//# sourceMappingURL=find-svelte-script-tags.js.map
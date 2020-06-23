(function() {
  //!node
  var CAT, CND, Intertype, alert, badge, colorize, debug, demo_diff_match_patch, echo, get_tty_width, help, info, isa, log, stderr, stdin, stdout, to_width, type_of, types, urge, validate, warn, whisper, width_of;

  CND = require('cnd');

  badge = 'DIFF';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({stdin, stdout, stderr} = process);

  ({Intertype} = require('intertype'));

  types = new Intertype();

  ({isa, validate, type_of} = types.export());

  ({to_width, width_of} = require('to-width'));

  CAT = require('multimix/lib/cataloguing');

  //-----------------------------------------------------------------------------------------------------------
  colorize = function(delta_code, text) {
    var color, line, lines;
    lines = text.split('\n');
    color = (function() {
      switch (delta_code) {
        case -1:
          return CND.orange;
        case 0:
          return CND.white;
        case +1:
          return CND.lime;
      }
    })();
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        results.push(CND.reverse(color(line)));
      }
      return results;
    })()).join('\n');
  };

  //-----------------------------------------------------------------------------------------------------------
  get_tty_width = function() {
    var R, execSync;
    if ((R = process.stdout.columns) != null) {
      return R;
    }
    ({execSync} = require('child_process'));
    return parseInt(execSync("tput cols", {
      encoding: 'utf-8'
    }), 10);
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_diff_match_patch = function(old_text, new_text) {
    var DMP, _cnd, colorized, dd, diff, dmp, i, len, line, lines, ref, text, width;
    DMP = require('diff-match-patch');
    // width = Math.min 500, process.stdout.columns ? 108
    width = Math.min(500, (ref = get_tty_width()) != null ? ref : 108);
    _cnd = require('cnd/lib/TRM-CONSTANTS');
    // debug CAT.all_keys_of DMP
    // debug type_of DMP.diff_match_patch
    // debug CAT.all_keys_of DMP.diff_match_patch
    type_of(dmp = new DMP.diff_match_patch());
    // debug CAT.all_keys_of new DMP.diff_match_patch()
    // debug diff = dmp.diff_main 'dogs bark', 'cats bark'
    // debug diff = dmp.diff_main 'mouse', 'sofas'
    diff = dmp.diff_main(old_text, new_text);
    whisper(dmp.diff_prettyHtml(diff));
    dmp.diff_cleanupSemantic(diff);
    whisper(dmp.diff_prettyHtml(diff));
    help(diff);
    colorized = ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = diff.length; i < len; i++) {
        [dd, text] = diff[i];
        results.push(colorize(dd, text));
      }
      return results;
    })()).join('');
    lines = colorized.split('\n');
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      // line += ' '.repeat Math.max 0, line.replace //
      line += _cnd.reverse + _cnd.colors.white;
      line = (to_width(line, width)) + '\n';
      process.stdout.write(line);
    }
    // process.stdout.write ( to_width width, line ) + '\n'
    return process.stdout.write(CND.white(CND.reverse((' '.repeat(width)) + '\n')));
  };

  // { Diff, } = DMP
  // dmp   = new Diff()
  // debug CAT.all_keys_of dmp
  // debug ( k for k of dmp )
  // diff  = dmp.diff_main 'dogs bark', 'cats bark'
  // // You can also use the following properties:
  // urge DMP.DIFF_DELETE
  // urge DMP.DIFF_INSERT
  // urge DMP.DIFF_EQUAL

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var FS, new_text, old_text;
      // await demo()
      FS = require('fs');
      old_text = FS.readFileSync('/tmp/old-galley-main.html', {
        encoding: 'utf-8'
      });
      new_text = FS.readFileSync('/tmp/new-galley-main.html', {
        encoding: 'utf-8'
      });
      return (await demo_diff_match_patch(old_text, new_text));
    })();
  }

}).call(this);

//# sourceMappingURL=diff.js.map
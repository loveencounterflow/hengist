(function() {
  //!node
  var $, $drain, $show, $tee_to_stdout, $transform, $watch, CND, SP, alert, badge, debug, demo, echo, help, info, log, stderr, stdin, stdout, urge, warn, whisper;

  CND = require('cnd');

  badge = 'TP';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  // urge                      = CND.get_logger 'urge',      badge
  echo = CND.echo.bind(CND);

  ({stdin, stdout, stderr} = process);

  SP = require('steampipes');

  ({$, $watch, $drain, $show} = SP.export());

  urge = function(...P) {
    var p;
    return stderr.write(CND.gold((((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        p = P[i];
        results.push(p.toString());
      }
      return results;
    })()).join(' ')) + '\n'));
  };

  //-----------------------------------------------------------------------------------------------------------
  $transform = function() {
    return $((line, send) => {
      line = line.replace(/(<!DOCTYPE html>)/g, '$1\n');
      line = line.replace(/(<meta [^>]+>)/g, '$1\n');
      line = line.replace(/(<\/[^>]+>)/g, '$1\n');
      line = line.replace(/(\x20\/>)/g, '$1\n');
      return send(line);
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  $tee_to_stdout = function() {
    return $((line, send) => {
      stdout.write(line + '\n');
      return send(line);
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    return new Promise(function(resolve, reject) {
      var pipeline, source;
      source = SP.new_push_source();
      pipeline = [];
      //.........................................................................................................
      pipeline.push(source);
      pipeline.push(SP.$split());
      pipeline.push($transform());
      pipeline.push($tee_to_stdout());
      // pipeline.push $show()
      pipeline.push($drain(function() {
        // urge "stdin ended"
        return resolve();
      }));
      //.........................................................................................................
      stdin.on('data', function(data) {
        var lines;
        source.send(data);
        return lines = data.toString('utf-8');
      });
      //.........................................................................................................
      stdin.on('end', function() {
        return source.end();
      });
      //.........................................................................................................
      stdin.on('error', function(error) {
        return warn("**************" + error);
      });
      //.........................................................................................................
      stdin.resume();
      return SP.pull(...pipeline);
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo());
    })();
  }

}).call(this);

//# sourceMappingURL=transform-piped.js.map
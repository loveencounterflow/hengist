(function() {
  'use strict';
  var AUDIOPLAYER, Audioplayer, CND, badge, debug, demo, echo, help, info, rpr, spawn, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DEMO-NODE-BEEP';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  spawn = (require('child_process')).spawn;

  Audioplayer = class Audioplayer {
    play(path) {
      return new Promise((resolve, reject) => {
        /* throw error if file not exists or is no playable file */
        var cp;
        cp = spawn('/usr/bin/play', [path]);
        cp.on('close', function() {
          var exit_code;
          if ((exit_code = cp.exitCode) === 0) {
            return resolve(null);
          }
          warn('^Audioplayer@1^', {exit_code});
          return reject(new Error(`command \`play ${rpr(path)}\` exited with code ${exit_code}`));
        });
        cp.on('error', function(error) {
          warn('^Audioplayer@1^', error);
          return reject(error);
        });
        cp.stderr.on('error', function(error) {
          warn('^Audioplayer@2^', error);
          return reject(error);
        });
        return cp;
      });
    }

    every(dts, f) {
      return setInterval(f, dts * 1000);
    }

    after(dts, f) {
      return setTimeout(f, dts * 1000);
    }

    sleep(dts) {
      return new Promise((done) => {
        return setTimeout(done, dts * 1000);
      });
    }

  };

  this.AUDIOPLAYER = AUDIOPLAYER = new Audioplayer();

  //-----------------------------------------------------------------------------------------------------------
  demo = async function() {
    // ```
    // var player = require('play-sound')(opts = {})

    // // $ mplayer foo.mp3
    // player.play(path, function(err){
    //   if (err) throw err
    // })

    // // { timeout: 300 } will be passed to child process
    // player.play(path, { timeout: 300 }, function(err){
    //   if (err) throw err
    // })

    // // configure arguments for executable if any
    // player.play(path, { afplay: ['-v', 1 ] /* lower volume for afplay on OSX */ }, function(err){
    //   if (err) throw err
    // })

    // // access the node child_process in case you need to kill it on demand
    // var audio = player.play(path, function(err){
    //   if (err && !err.killed) throw err
    // })
    // audio.kill()
    // ```
    AUDIOPLAYER.play('/usr/share/sounds/LinuxMint/stereo/button-pressed.ogg');
    await AUDIOPLAYER.sleep(0.5);
    AUDIOPLAYER.play('/usr/share/sounds/LinuxMint/stereo/button-pressed.ogg');
    await AUDIOPLAYER.sleep(0.5);
    AUDIOPLAYER.play('/usr/share/sounds/LinuxMint/stereo/dialog-error.ogg');
    await AUDIOPLAYER.sleep(0.5);
    AUDIOPLAYER.play('/usr/share/sounds/LinuxMint/stereo/dialog-information.ogg');
    await AUDIOPLAYER.sleep(0.5);
    AUDIOPLAYER.play('/usr/share/sounds/LinuxMint/stereo/dialog-question.ogg');
    await AUDIOPLAYER.sleep(0.5);
    AUDIOPLAYER.play('/usr/share/sounds/LinuxMint/stereo/dialog-question.wav');
    await AUDIOPLAYER.sleep(0.5);
    AUDIOPLAYER.play('/usr/share/sounds/LinuxMint/stereo/dialog-warning.ogg');
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-node-beep.js.map
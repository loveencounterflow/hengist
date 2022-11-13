(async function() {
  'use strict';
  var GUY, PHASH, alert, debug, echo, glob, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, validate, validate_optional, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_optional} = types);

  PHASH = require('phash-im');

  glob = require('glob');

  //###########################################################################################################
  if (module === require.main) {
    await (async() => {
      var PATH, count1, count2, h1, h2, i, j, len, len1, path1, path2, pattern, ref, ref1;
      PATH = require('node:path');
      //.........................................................................................................
      pattern = PATH.resolve(PATH.join(__dirname, '../../../../../Downloads/b/*'));
      count1 = 0;
      ref = glob.sync(pattern);
      for (i = 0, len = ref.length; i < len; i++) {
        path1 = ref[i];
        if (!path1.endsWith('.jpg')) {
          continue;
        }
        count1++;
        urge('^423^', path1);
        h1 = (await PHASH.compute(path1));
        if (count1 > 5) {
          break;
        }
        count2 = 0;
        ref1 = glob.sync(pattern);
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          path2 = ref1[j];
          if (!path2.endsWith('.jpg')) {
            continue;
          }
          count2++;
          if (count2 > 5) {
            break;
          }
          help('^423^', path2);
          h2 = (await PHASH.compute(path2));
          info('^423^', (await PHASH.compare(h1, h2)));
        }
      }
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=perceptual-image-hash-phash.js.map
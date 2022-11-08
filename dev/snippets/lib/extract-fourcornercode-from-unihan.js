(function() {
  'use strict';
  var GUY, Segment, alert, debug, echo, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, validate, validate_optional, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_optional} = types);

  //===========================================================================================================
  Segment = class Segment {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      this.input = [];
      this.output = [];
      return void 0;
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var PATH, cat, chr, chrs, cid, cid_hex, code, codes, count, e, entries, i, j, len, len1, line, match, path, probe, probes, ref, ucid_text, value;
      PATH = require('node:path');
      //.........................................................................................................
      path = PATH.resolve(PATH.join(__dirname, '../../../../../io/mingkwai-rack/jzrds/unicode.org-ucd-v14.0/Unihan_DictionaryLikeData.txt'));
      count = 0;
      entries = [];
      ref = GUY.fs.walk_lines(path);
      for (line of ref) {
        // result.push line
        [ucid_text, cat, value] = line.split('\t');
        if (cat !== 'kFourCornerCode') {
          continue;
        }
        if (value == null) {
          continue;
        }
        count++;
        codes = value.split(/\s+/);
        cid_hex = ucid_text.slice(2);
        cid = parseInt(cid_hex, 16);
        chr = String.fromCodePoint(cid);
        for (i = 0, len = codes.length; i < len; i++) {
          code = codes[i];
          // debug { count, cid_hex, chr, code, }
          entries.push([code, chr]);
        }
      }
      entries.sort(function(a, b) {
        if (a[0] > b[0]) {
          return +1;
        }
        if (a[0] < b[0]) {
          return -1;
        }
        return null;
      });
      // info entry for entry in entries
      chrs = ((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = entries.length; j < len1; j++) {
          e = entries[j];
          results.push(e[1]);
        }
        return results;
      })()).join('');
      probes = Array.from('厂厃厄厅历厇厈厉厊压厌厍厎厏厐厑厒厓厔厕厖厗厘厙厚厛厜厝厞原');
      for (j = 0, len1 = probes.length; j < len1; j++) {
        probe = probes[j];
        if ((match = chrs.match(RegExp(`^.*(.{0}${probe}.{25}).*`, "u"))) == null) {
          continue;
        }
        help(match[1]);
      }
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=extract-fourcornercode-from-unihan.js.map
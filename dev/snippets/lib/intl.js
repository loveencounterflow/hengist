(function() {
  'use strict';
  var CND, H, MMX, badge, debug, demo_segmenter, echo, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'INTL';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  H = require('../../../lib/helpers');

  MMX = require('multimix/lib/cataloguing');

  debug('^474^', MMX.all_keys_of(Intl));

  /*
  getCanonicalLocales
  DateTimeFormat
  NumberFormat
  Collator
  PluralRules
  RelativeTimeFormat
  ListFormat
  Locale
  DisplayNames
  Segmenter
  */
  //-----------------------------------------------------------------------------------------------------------
  demo_segmenter = function() {
    (() => {
      var iterator1, segmenterFr, string1;
      segmenterFr = new Intl.Segmenter('fr', {
        granularity: 'word'
      });
      string1 = 'Que ma joie demeure';
      iterator1 = segmenterFr.segment(string1)[Symbol.iterator]();
      H.tabulate('segments', iterator1);
      // for d from iterator1
      //   help d
      return null;
    })();
    (() => {
      var iterator1, segmenter, text;
      segmenter = new Intl.Segmenter('ja-JP', {
        granularity: 'word'
      });
      text = "吾輩は猫である。名前はたぬき。";
      iterator1 = segmenter.segment(text);
      return H.tabulate('segments', iterator1);
    })();
    (() => {
      var iterator1, segmenter, text;
      segmenter = new Intl.Segmenter('ko-KR', {
        granularity: 'grapheme'
      });
      text = "서울특별시는 대한민국의 수도이자 최대 도시이다.";
      // text      = text.normalize 'NFC'
      // text      = text.normalize 'NFKD'
      text = text.normalize('NFD');
      help(Array.from(text));
      iterator1 = segmenter.segment(text);
      return H.tabulate('segments', iterator1);
    })();
    (() => {
      var iterator1, segmenter, text;
      segmenter = new Intl.Segmenter('ko-KR', {
        granularity: 'word'
      });
      text = "吾輩は猫である。名前はたぬき。서울특별시는 대한민국의 수도이자 최대 도시이다.";
      iterator1 = segmenter.segment(text);
      return H.tabulate('segments', iterator1);
    })();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_segmenter();
    })();
  }

}).call(this);

//# sourceMappingURL=intl.js.map
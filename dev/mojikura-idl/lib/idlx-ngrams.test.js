(function() {
  'use strict';
  var CND, IDL, IDLX, alert, badge, conflate, debug, echo, equals, help, info, isa, log, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MOJIKURA-IDL/TESTS/NGRAMS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  ({IDL, IDLX} = require('../../../apps/mojikura-idl'));

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, equals} = types.export());

  /*
  Ngrams with Relations:
  谆:⿰讠(⿱亠口子)
  谆∋⿰讠亠
  谆∋⿱亠口
  谆∋⿱口子
  (谆∋⿱亠...子)
  (谆∋⿰讠⿱亠)
  */
  //-----------------------------------------------------------------------------------------------------------
  conflate = function(bigrams) {
    var R, bigram, i, len, token;
    // bigrams.sort()
    R = [];
    for (i = 0, len = bigrams.length; i < len; i++) {
      bigram = bigrams[i];
      R.push(((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = bigram.length; j < len1; j++) {
          token = bigram[j];
          results.push(token.s);
        }
        return results;
      })()).join(''));
    }
    return R.join(',');
  };

  //-----------------------------------------------------------------------------------------------------------
  this["(IDLX) bigrams"] = function(T, done) {
    /* !!!!!!!!!!!!!!!!!!!! */
    var bigrams, error, formula, glyph, i, len, matcher, probe, probes_and_matchers/* TAINT not normalized? */, result;
    [/* !!!!!!!!!!!!!!!!!!!! */ '䨻:⿱⿰⿱⻗田⿱⻗田⿰⿱⻗田⿱⻗田'];
    [/* TAINT not normalized? */ '𩙡:⿱⿰⿵𠘨䖝⿵𠘨䖝⿰⿵𠘨䖝⿵𠘨䖝'];
    probes_and_matchers = [["乳:⿰⿱爫子乚", "⿱⊚爫,⿱爫子,⿰子乚,⿰乚⊚"], ["鐓:(⿰金(⿱亠口子)夊)", "⿰⊚金,⿰金亠,⿱亠口,⿱口子,⿰子夊,⿰夊⊚"], ["孔:⿰子乚", "⿰⊚子,⿰子乚,⿰乚⊚"], ["谆:⿰讠(⿱亠口子)", "⿰⊚讠,⿰讠亠,⿱亠口,⿱口子,⿱子⊚"], ["享:(⿱亠口子)", "⿱⊚亠,⿱亠口,⿱口子,⿱子⊚"], ["孫:⿰子系", "⿰⊚子,⿰子系,⿰系⊚"], ["浮:⿰氵⿱爫子", "⿰⊚氵,⿰氵爫,⿱爫子,⿱子⊚"], ["仔:⿰亻子", "⿰⊚亻,⿰亻子,⿰子⊚"], ["郭:⿰(⿱亠口子)阝", "⿱⊚亠,⿱亠口,⿱口子,⿰子阝,⿰阝⊚"], ["孙:⿰子小", "⿰⊚子,⿰子小,⿰小⊚"], ["敦:⿰(⿱亠口子)夊", "⿱⊚亠,⿱亠口,⿱口子,⿰子夊,⿰夊⊚"], ["孕:⿱乃子", "⿱⊚乃,⿱乃子,⿱子⊚"], ["遜:⿺辶⿰子系", "⿺⊚辶,⿺辶子,⿰子系,⿰系⊚"], ["鷻:(⿰鳥(⿱亠口子)夊)", "⿰⊚鳥,⿰鳥亠,⿱亠口,⿱口子,⿰子夊,⿰夊⊚"], ["𤅸:⿰氵⿱⿰臣⿱𠂉⿴占𠂭皿", "⿰⊚氵,⿰氵臣,⿰臣𠂉,⿱𠂉占,⿴占𠂭,⿱𠂭皿,⿱皿⊚"], ["𣟁:⿰木⿱⿰阝⿱⿸𠂇工⺝土", "⿰⊚木,⿰木阝,⿰阝𠂇,⿸𠂇工,⿱工⺝,⿱⺝土,⿱土⊚"], ["𧃚:⿱卄⿰月⿺辶⿱⿸𠂇工⺝", "⿱⊚卄,⿱卄月,⿰月辶,⿺辶𠂇,⿸𠂇工,⿱工⺝,⿱⺝⊚"], ["𥷿:⿱𥫗⿰⿱巛田⿸广⿱廿灬", "⿱⊚𥫗,⿱𥫗巛,⿱巛田,⿰田广,⿸广廿,⿱廿灬,⿱灬⊚"], ["𤬣:⿱⿻⿴乂⿰⿱大亏瓜", "⿻⊚,⿻,⿴乂,⿱乂大,⿱大亏,⿰亏瓜,⿰瓜⊚"], ["䨻:⿱⿰⿱⻗田⿱⻗田⿰⿱⻗田⿱⻗田", "⿱⊚⻗,⿱⻗田,⿰田⻗,⿱⻗田,⿱田⻗,⿱⻗田,⿰田⻗,⿱⻗田,⿱田⊚"], ["𩙡:⿱⿰⿵𠘨䖝⿵𠘨䖝⿰⿵𠘨䖝⿵𠘨䖝", "⿵⊚𠘨,⿵𠘨䖝,⿰䖝𠘨,⿵𠘨䖝,⿱䖝𠘨,⿵𠘨䖝,⿰䖝𠘨,⿵𠘨䖝,⿵䖝⊚"], ["竜:⿱立≈电", "⿱⊚立,⿱立电,⿱电⊚"], ["覽:⿱⿰臣⿱罒見", "⿰⊚臣,⿰臣,⿱罒,⿱罒見,⿱見⊚"], ["龟:⿱𠂊≈电", "⿱⊚𠂊,⿱𠂊电,⿱电⊚"], ["𠗬:⿰冫⿸戶用", "⿰⊚冫,⿰冫戶,⿸戶用,⿸用⊚"], ["𠗭:(⿱⿰冫士寸)", "⿰⊚冫,⿰冫,⿱士,⿱士寸,⿱寸⊚"], ["𠚖:⿶≈凵王", "⿶⊚凵,⿶凵王,⿶王⊚"], ["𠚜:⿶≈凵⿱爫臼", "⿶⊚凵,⿶凵爫,⿱爫臼,⿱臼⊚"], ["𠚡:⿶?凵⿱爫臼", "⿶⊚凵,⿶凵爫,⿱爫臼,⿱臼⊚"], ["繭:⿱卄⿻≈巾⿰糹虫", "⿱⊚卄,⿱卄巾,⿻巾糹,⿰糹虫,⿰虫⊚"], ["𠕄:↻凹", ""], ["孝:⿱耂子", "⿱⊚耂,⿱耂子,⿱子⊚"], ["猛:⿰犭⿱子皿", "⿰⊚犭,⿰犭子,⿱子皿,⿱皿⊚"], ["孟:⿱子皿", "⿱⊚子,⿱子皿,⿱皿⊚"], ["勃:⿰⿱子力", "⿱⊚,⿱子,⿰子力,⿰力⊚"], ["郭:⿰(⿱亠口子)阝", "⿱⊚亠,⿱亠口,⿱口子,⿰子阝,⿰阝⊚"]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      [glyph, formula] = probe.split(':');
      try {
        // debug '27821', IDLX.list_tokens formula, { all_brackets: yes, }
        bigrams = IDLX.get_relational_bigrams_as_tokens(formula);
        // urge  '93209', formula
        result = conflate(bigrams);
        (() => {          //.....................................................................................................
          /* NOTE: as used in MojiKura RPC call */
          var R, rbgram, rbgrams, token;
          rbgrams = bigrams;
          R = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = rbgrams.length; j < len1; j++) {
              rbgram = rbgrams[j];
              results.push((function() {
                var k, len2, results1;
                results1 = [];
                for (k = 0, len2 = rbgram.length; k < len2; k++) {
                  token = rbgram[k];
                  results1.push(token.s);
                }
                return results1;
              })());
            }
            return results;
          })();
          R = R.slice(1, R.length - 1);
          return urge('93209', R);
        })();
      } catch (error1) {
        //.....................................................................................................
        // urge  '93209', result
        // debug JSON.stringify [ probe, result, ]
        error = error1;
        T.fail(`${probe} failed with ${rpr(error.message)}`);
        continue;
      }
      if (result === matcher) {
        T.ok(true);
      } else {
        T.fail(`expected ${matcher}, got ${result}`);
      }
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["(IDLX) cached bigrams with indices"] = function(T, done) {
    var bigram, bigrams, bigrams_as_indices, formula, glyph, i, len, matcher, parts, probe, probes_and_matchers, result;
    probes_and_matchers = [["乳:⿰⿱爫子乚", "⿱⊚爫,⿱爫子,⿰子乚,⿰乚⊚"], ["鐓:(⿰金(⿱亠口子)夊)", "⿰⊚金,⿰金亠,⿱亠口,⿱口子,⿰子夊,⿰夊⊚"], ["孔:⿰子乚", "⿰⊚子,⿰子乚,⿰乚⊚"], ["𠃨:⿹⺄&cdp#x88c6;", "⿹⊚⺄,⿹⺄&cdp#x88c6;,⿹&cdp#x88c6;⊚"], ["𠄋:⿰(⿱&cdp#x855e;日丂)乞", "⿱⊚&cdp#x855e;,⿱&cdp#x855e;日,⿱日丂,⿰丂乞,⿰乞⊚"], ["𠄋:⿰酉⿱日𤴓", "⿰⊚酉,⿰酉日,⿱日𤴓,⿱𤴓⊚"]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      [glyph, formula] = probe.split(':');
      parts = IDLX.split_formula(formula);
      bigrams_as_indices = IDLX.get_relational_bigrams_as_indices(formula);
      bigrams = IDLX.bigrams_from_parts_and_indices(parts, bigrams_as_indices);
      result = ((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = bigrams.length; j < len1; j++) {
          bigram = bigrams[j];
          results.push(bigram.join(''));
        }
        return results;
      })()).join(',');
      // urge  '93209', glyph, formula
      // help  '93209', result
      // debug '22020', JSON.stringify [ probe, result, ]
      if (result === matcher) {
        T.ok(true);
      } else {
        T.fail(`expected ${matcher}, got ${result}`);
      }
    }
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["(IDLX) bigrams as lists of texts"] = function(T, done) {
    var formula, glyph, i, len, matcher, probe, probes_and_matchers, result;
    probes_and_matchers = [["乳:⿰⿱爫子乚", ["⿱⊚爫", "⿱爫子", "⿰子乚", "⿰乚⊚"]], ["鐓:(⿰金(⿱亠口子)夊)", ["⿰⊚金", "⿰金亠", "⿱亠口", "⿱口子", "⿰子夊", "⿰夊⊚"]], ["孔:⿰子乚", ["⿰⊚子", "⿰子乚", "⿰乚⊚"]], ["𠃨:⿹⺄&cdp#x88c6;", ["⿹⊚⺄", "⿹⺄&cdp#x88c6;", "⿹&cdp#x88c6;⊚"]], ["𠄋:⿰(⿱&cdp#x855e;日丂)乞", ["⿱⊚&cdp#x855e;", "⿱&cdp#x855e;日", "⿱日丂", "⿰丂乞", "⿰乞⊚"]], ["𠄋:⿰酉⿱日𤴓", ["⿰⊚酉", "⿰酉日", "⿱日𤴓", "⿱𤴓⊚"]], ["𠕄:↻凹", []], ["孝:⿱耂子", ["⿱⊚耂", "⿱耂子", "⿱子⊚"]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      [glyph, formula] = probe.split(':');
      result = IDLX.get_relational_bigrams(formula);
      debug('32321', JSON.stringify(result));
      if (equals(result, matcher)) {
        T.ok(true);
      } else {
        T.fail(`expected ${matcher}, got ${result}`);
      }
    }
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2lkbHgtbmdyYW1zLnRlc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7O0VBSUEsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsR0FBQSxHQUE0QixHQUFHLENBQUM7O0VBQ2hDLEtBQUEsR0FBNEI7O0VBQzVCLEdBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxPQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsT0FBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLFNBQWYsRUFBNEIsS0FBNUI7O0VBQzVCLEtBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxPQUFmLEVBQTRCLEtBQTVCOztFQUM1QixLQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsT0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQVQsQ0FBYyxH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QUFDLE9BQUQsRUFBUyxDQUFDLEtBQUQsRUFBTyxLQUFQLEVBQWEsS0FBYixDQUFULENBUm9CO0lBVXRCLEtBQUEscURBQUE7TUFBSSxDQUFFLEtBQUYsRUFBUyxPQUFUO01BQ0YsQ0FBRSxLQUFGLEVBQVMsT0FBVCxDQUFBLEdBQXNCLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWjtNQUN0QixNQUFBLEdBQXNCLElBQUksQ0FBQyxzQkFBTCxDQUE0QixPQUE1QjtNQUN0QixLQUFBLENBQU0sT0FBTixFQUFlLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQUFmO01BQ0EsSUFBSyxNQUFBLENBQU8sTUFBUCxFQUFlLE9BQWYsQ0FBTDtRQUFtQyxDQUFDLENBQUMsRUFBRixDQUFLLElBQUwsRUFBbkM7T0FBQSxNQUFBO1FBQ0ssQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFBLFNBQUEsQ0FBQSxDQUFZLE9BQVosQ0FBQSxNQUFBLENBQUEsQ0FBNEIsTUFBNUIsQ0FBQSxDQUFQLEVBREw7O0lBSkY7V0FNQSxJQUFBLENBQUE7RUFqQndDLEVBeEkxQzs7O0VBNkpBLElBQUcsTUFBQSxLQUFVLE9BQU8sQ0FBQyxJQUFyQjtJQUFrQyxDQUFBLENBQUEsQ0FBQSxHQUFBO2FBQ2hDLElBQUEsQ0FBSyxJQUFMO0lBRGdDLENBQUEsSUFBbEM7O0FBN0pBIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCdcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbkNORCAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdjbmQnXG5ycHIgICAgICAgICAgICAgICAgICAgICAgID0gQ05ELnJwclxuYmFkZ2UgICAgICAgICAgICAgICAgICAgICA9ICdNT0pJS1VSQS1JREwvVEVTVFMvTkdSQU1TJ1xubG9nICAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdwbGFpbicsICAgICBiYWRnZVxuaW5mbyAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdpbmZvJywgICAgICBiYWRnZVxud2hpc3BlciAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICd3aGlzcGVyJywgICBiYWRnZVxuYWxlcnQgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdhbGVydCcsICAgICBiYWRnZVxuZGVidWcgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdkZWJ1ZycsICAgICBiYWRnZVxud2FybiAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICd3YXJuJywgICAgICBiYWRnZVxuaGVscCAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdoZWxwJywgICAgICBiYWRnZVxudXJnZSAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICd1cmdlJywgICAgICBiYWRnZVxuZWNobyAgICAgICAgICAgICAgICAgICAgICA9IENORC5lY2hvLmJpbmQgQ05EXG4jLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbnRlc3QgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2d1eS10ZXN0J1xueyBJREwsIElETFgsIH0gICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvbW9qaWt1cmEtaWRsJ1xudHlwZXMgICAgICAgICAgICAgICAgICAgICA9IG5ldyAoIHJlcXVpcmUgJ2ludGVydHlwZScgKS5JbnRlcnR5cGUoKVxueyBpc2FcbiAgdHlwZV9vZlxuICB2YWxpZGF0ZVxuICBlcXVhbHMgICB9ICAgICAgICAgICAgICA9IHR5cGVzLmV4cG9ydCgpXG5cblxuIyMjXG5OZ3JhbXMgd2l0aCBSZWxhdGlvbnM6XG7osIY64r+w6K6gKOK/seS6oOWPo+WtkClcbuiwhuKIi+K/sOiuoOS6oFxu6LCG4oiL4r+x5Lqg5Y+jXG7osIbiiIviv7Hlj6PlrZBcbijosIbiiIviv7HkuqAuLi7lrZApXG4o6LCG4oiL4r+w6K6g4r+x5Lqg7oGlKVxuIyMjXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uZmxhdGUgPSAoIGJpZ3JhbXMgKSAtPlxuICAjIGJpZ3JhbXMuc29ydCgpXG4gIFIgPSBbXVxuICBmb3IgYmlncmFtIGluIGJpZ3JhbXNcbiAgICBSLnB1c2ggKCB0b2tlbi5zIGZvciB0b2tlbiBpbiBiaWdyYW0gKS5qb2luICcnXG4gIHJldHVybiBSLmpvaW4gJywnXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQFsgXCIoSURMWCkgYmlncmFtc1wiIF0gPSAoIFQsIGRvbmUgKSAtPlxuICAjIyMgISEhISEhISEhISEhISEhISEhISEgIyMjXG4gIFsgJ+Souzriv7Hiv7Div7Hiu5fnlLDiv7Hiu5fnlLDiv7Div7Hiu5fnlLDiv7Hiu5fnlLAnIF0gIyMjIFRBSU5UIG5vdCBub3JtYWxpemVkPyAjIyNcbiAgWyAn8KmZoTriv7Hiv7Div7XwoJio5Jad4r+18KCYqOSWneK/sOK/tfCgmKjklp3iv7XwoJio5JadJyBdICMjIyBUQUlOVCBub3Qgbm9ybWFsaXplZD8gIyMjXG4gICMjIyAhISEhISEhISEhISEhISEhISEhISAjIyNcbiAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiAgICBbXCLkubM64r+w4r+x54ir5a2Q5LmaXCIsXCLiv7HiiprniKss4r+x54ir5a2QLOK/sOWtkOS5miziv7DkuZriippcIl1cbiAgICBbXCLpkJM6KOK/sOmHkSjiv7HkuqDlj6PlrZAp5aSKKVwiLFwi4r+w4oqa6YeRLOK/sOmHkeS6oCziv7HkuqDlj6Ms4r+x5Y+j5a2QLOK/sOWtkOWkiiziv7DlpIriippcIl1cbiAgICBbXCLlrZQ64r+w5a2Q5LmaXCIsXCLiv7DiiprlrZAs4r+w5a2Q5LmaLOK/sOS5muKKmlwiXVxuICAgIFtcIuiwhjriv7DorqAo4r+x5Lqg5Y+j5a2QKVwiLFwi4r+w4oqa6K6gLOK/sOiuoOS6oCziv7HkuqDlj6Ms4r+x5Y+j5a2QLOK/seWtkOKKmlwiXVxuICAgIFtcIuS6qzoo4r+x5Lqg5Y+j5a2QKVwiLFwi4r+x4oqa5LqgLOK/seS6oOWPoyziv7Hlj6PlrZAs4r+x5a2Q4oqaXCJdXG4gICAgW1wi5a2rOuK/sOWtkOezu1wiLFwi4r+w4oqa5a2QLOK/sOWtkOezuyziv7Dns7viippcIl1cbiAgICBbXCLmta464r+w5rC14r+x54ir5a2QXCIsXCLiv7DiiprmsLUs4r+w5rC154irLOK/seeIq+WtkCziv7HlrZDiippcIl1cbiAgICBbXCLku5Q64r+w5Lq75a2QXCIsXCLiv7Diiprkurss4r+w5Lq75a2QLOK/sOWtkOKKmlwiXVxuICAgIFtcIumDrTriv7Ao4r+x5Lqg5Y+j5a2QKemYnVwiLFwi4r+x4oqa5LqgLOK/seS6oOWPoyziv7Hlj6PlrZAs4r+w5a2Q6ZidLOK/sOmYneKKmlwiXVxuICAgIFtcIuWtmTriv7DlrZDlsI9cIixcIuK/sOKKmuWtkCziv7DlrZDlsI8s4r+w5bCP4oqaXCJdXG4gICAgW1wi5pWmOuK/sCjiv7HkuqDlj6PlrZAp5aSKXCIsXCLiv7HiiprkuqAs4r+x5Lqg5Y+jLOK/seWPo+WtkCziv7DlrZDlpIos4r+w5aSK4oqaXCJdXG4gICAgW1wi5a2VOuK/seS5g+WtkFwiLFwi4r+x4oqa5LmDLOK/seS5g+WtkCziv7HlrZDiippcIl1cbiAgICBbXCLpgZw64r+66L624r+w5a2Q57O7XCIsXCLiv7riiprovrYs4r+66L625a2QLOK/sOWtkOezuyziv7Dns7viippcIl1cbiAgICBbXCLpt7s6KOK/sOmzpSjiv7HkuqDlj6PlrZAp5aSKKVwiLFwi4r+w4oqa6bOlLOK/sOmzpeS6oCziv7HkuqDlj6Ms4r+x5Y+j5a2QLOK/sOWtkOWkiiziv7DlpIriippcIl1cbiAgICBbXCLwpIW4OuK/sOawteK/seK/sOiHo+K/sfCggoniv7TljaDwoIKt55q/XCIsXCLiv7DiiprmsLUs4r+w5rC16IejLOK/sOiHo/Cggoks4r+x8KCCieWNoCziv7TljaDwoIKtLOK/sfCggq3nmr8s4r+x55q/4oqaXCJdXG4gICAgW1wi8KOfgTriv7DmnKjiv7Hiv7DpmJ3iv7Hiv7jwoIKH5bel4rqd5ZyfXCIsXCLiv7DiiprmnKgs4r+w5pyo6ZidLOK/sOmYnfCggocs4r+48KCCh+W3pSziv7Hlt6Xiup0s4r+x4rqd5ZyfLOK/seWcn+KKmlwiXVxuICAgIFtcIvCng5o64r+x5Y2E4r+w5pyI4r+66L624r+x4r+48KCCh+W3peK6nVwiLFwi4r+x4oqa5Y2ELOK/seWNhOaciCziv7DmnIjovrYs4r+66L628KCChyziv7jwoIKH5belLOK/seW3peK6nSziv7Hiup3iippcIl1cbiAgICBbXCLwpbe/OuK/sfClq5fiv7Div7Hlt5vnlLDiv7jlub/iv7Hlu7/ngaxcIixcIuK/seKKmvClq5cs4r+x8KWrl+W3myziv7Hlt5vnlLAs4r+w55Sw5bm/LOK/uOW5v+W7vyziv7Hlu7/ngaws4r+x54Gs4oqaXCJdXG4gICAgW1wi8KSsozriv7Hiv7vujK3iv7TuhIXkuYLiv7Div7HlpKfkuo/nk5xcIixcIuK/u+KKmu6MrSziv7vujK3uhIUs4r+07oSF5LmCLOK/seS5guWkpyziv7HlpKfkuo8s4r+w5LqP55OcLOK/sOeTnOKKmlwiXVxuICAgIFtcIuSouzriv7Hiv7Div7Hiu5fnlLDiv7Hiu5fnlLDiv7Div7Hiu5fnlLDiv7Hiu5fnlLBcIixcIuK/seKKmuK7lyziv7Hiu5fnlLAs4r+w55Sw4ruXLOK/seK7l+eUsCziv7HnlLDiu5cs4r+x4ruX55SwLOK/sOeUsOK7lyziv7Hiu5fnlLAs4r+x55Sw4oqaXCJdXG4gICAgW1wi8KmZoTriv7Hiv7Div7XwoJio5Jad4r+18KCYqOSWneK/sOK/tfCgmKjklp3iv7XwoJio5JadXCIsXCLiv7XiiprwoJioLOK/tfCgmKjklp0s4r+w5Jad8KCYqCziv7XwoJio5JadLOK/seSWnfCgmKgs4r+18KCYqOSWnSziv7Dklp3woJioLOK/tfCgmKjklp0s4r+15Jad4oqaXCJdXG4gICAgW1wi56ucOuK/seeri+KJiOeUtVwiLFwi4r+x4oqa56uLLOK/seeri+eUtSziv7HnlLXiippcIl1cbiAgICBbXCLopr064r+x4r+w6Iej4r+x7oSb572S6KaLXCIsXCLiv7Diiproh6Ms4r+w6Iej7oSbLOK/se6Em+e9kiziv7HnvZLoposs4r+x6KaL4oqaXCJdXG4gICAgW1wi6b6fOuK/sfCggoriiYjnlLVcIixcIuK/seKKmvCggoos4r+x8KCCiueUtSziv7HnlLXiippcIl1cbiAgICBbXCLwoJesOuK/sOWGq+K/uOaItueUqFwiLFwi4r+w4oqa5YarLOK/sOWGq+aItiziv7jmiLbnlKgs4r+455So4oqaXCJdXG4gICAgW1wi8KCXrToo4r+x4r+w5Yar7oS+5aOr5a+4KVwiLFwi4r+w4oqa5YarLOK/sOWGq+6Eviziv7HuhL7lo6ss4r+x5aOr5a+4LOK/seWvuOKKmlwiXVxuICAgIFtcIvCgmpY64r+24omI5Ye1546LXCIsXCLiv7biiprlh7Us4r+25Ye1546LLOK/tueOi+KKmlwiXVxuICAgIFtcIvCgmpw64r+24omI5Ye14r+x54ir6Ie8XCIsXCLiv7biiprlh7Us4r+25Ye154irLOK/seeIq+iHvCziv7Hoh7ziippcIl1cbiAgICBbXCLwoJqhOuK/tj/lh7Xiv7HniKvoh7xcIixcIuK/tuKKmuWHtSziv7blh7XniKss4r+x54ir6Ie8LOK/seiHvOKKmlwiXVxuICAgIFtcIue5rTriv7HljYTiv7viiYjlt77iv7Dns7nomatcIixcIuK/seKKmuWNhCziv7HljYTlt74s4r+75be+57O5LOK/sOezueiZqyziv7DomaviippcIl1cbiAgICBbXCLwoJWEOuKGu+WHuVwiLFwiXCJdXG4gICAgW1wi5a2dOuK/seiAguWtkFwiLFwi4r+x4oqa6ICCLOK/seiAguWtkCziv7HlrZDiippcIl1cbiAgICBbXCLnjJs64r+w54qt4r+x5a2Q55q/XCIsXCLiv7Diiprniq0s4r+w54qt5a2QLOK/seWtkOeavyziv7Hnmr/iippcIl1cbiAgICBbXCLlrZ864r+x5a2Q55q/XCIsXCLiv7HiiprlrZAs4r+x5a2Q55q/LOK/seeav+KKmlwiXVxuICAgIFtcIuWLgzriv7Div7HuhbLlrZDliptcIixcIuK/seKKmu6Fsiziv7HuhbLlrZAs4r+w5a2Q5YqbLOK/sOWKm+KKmlwiXVxuICAgIFtcIumDrTriv7Ao4r+x5Lqg5Y+j5a2QKemYnVwiLFwi4r+x4oqa5LqgLOK/seS6oOWPoyziv7Hlj6PlrZAs4r+w5a2Q6ZidLOK/sOmYneKKmlwiXVxuICAgIF1cbiAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuICAgIFsgZ2x5cGgsIGZvcm11bGEsIF0gPSBwcm9iZS5zcGxpdCAnOidcbiAgICAjIGRlYnVnICcyNzgyMScsIElETFgubGlzdF90b2tlbnMgZm9ybXVsYSwgeyBhbGxfYnJhY2tldHM6IHllcywgfVxuICAgIHRyeVxuICAgICAgYmlncmFtcyA9IElETFguZ2V0X3JlbGF0aW9uYWxfYmlncmFtc19hc190b2tlbnMgZm9ybXVsYVxuICAgICAgIyB1cmdlICAnOTMyMDknLCBmb3JtdWxhXG4gICAgICByZXN1bHQgID0gY29uZmxhdGUgYmlncmFtc1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAjIyMgTk9URTogYXMgdXNlZCBpbiBNb2ppS3VyYSBSUEMgY2FsbCAjIyNcbiAgICAgIGRvID0+XG4gICAgICAgIHJiZ3JhbXMgPSBiaWdyYW1zXG4gICAgICAgIFIgPSAoICggdG9rZW4ucyBmb3IgdG9rZW4gaW4gcmJncmFtICkgZm9yIHJiZ3JhbSBpbiByYmdyYW1zIClcbiAgICAgICAgUiA9IFJbIDEgLi4uIFIubGVuZ3RoIC0gMSBdXG4gICAgICAgIHVyZ2UgICc5MzIwOScsIFJcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgIyB1cmdlICAnOTMyMDknLCByZXN1bHRcbiAgICAgICMgZGVidWcgSlNPTi5zdHJpbmdpZnkgWyBwcm9iZSwgcmVzdWx0LCBdXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIFQuZmFpbCBcIiN7cHJvYmV9IGZhaWxlZCB3aXRoICN7cnByIGVycm9yLm1lc3NhZ2V9XCJcbiAgICAgIGNvbnRpbnVlXG4gICAgaWYgcmVzdWx0ID09IG1hdGNoZXIgdGhlbiBULm9rIHRydWVcbiAgICBlbHNlIFQuZmFpbCBcImV4cGVjdGVkICN7bWF0Y2hlcn0sIGdvdCAje3Jlc3VsdH1cIlxuICBkb25lKClcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIihJRExYKSBjYWNoZWQgYmlncmFtcyB3aXRoIGluZGljZXNcIiBdID0gKCBULCBkb25lICkgLT5cbiAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiAgICBbXCLkubM64r+w4r+x54ir5a2Q5LmaXCIsXCLiv7HiiprniKss4r+x54ir5a2QLOK/sOWtkOS5miziv7DkuZriippcIl1cbiAgICBbXCLpkJM6KOK/sOmHkSjiv7HkuqDlj6PlrZAp5aSKKVwiLFwi4r+w4oqa6YeRLOK/sOmHkeS6oCziv7HkuqDlj6Ms4r+x5Y+j5a2QLOK/sOWtkOWkiiziv7DlpIriippcIl1cbiAgICBbXCLlrZQ64r+w5a2Q5LmaXCIsXCLiv7DiiprlrZAs4r+w5a2Q5LmaLOK/sOS5muKKmlwiXVxuICAgIFtcIvCgg6g64r+54rqEJmNkcCN4ODhjNjtcIixcIuK/ueKKmuK6hCziv7niuoQmY2RwI3g4OGM2Oyziv7kmY2RwI3g4OGM2O+KKmlwiXVxuICAgIFtcIvCghIs64r+wKOK/sSZjZHAjeDg1NWU75pel5LiCKeS5nlwiLFwi4r+x4oqaJmNkcCN4ODU1ZTss4r+xJmNkcCN4ODU1ZTvml6Us4r+x5pel5LiCLOK/sOS4guS5niziv7DkuZ7iippcIl1cbiAgICBbXCLwoISLOuK/sOmFieK/seaXpfCktJNcIixcIuK/sOKKmumFiSziv7DphYnml6Us4r+x5pel8KS0kyziv7HwpLST4oqaXCJdXG4gICAgXVxuICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgXSBpbiBwcm9iZXNfYW5kX21hdGNoZXJzXG4gICAgWyBnbHlwaCwgZm9ybXVsYSwgXSA9IHByb2JlLnNwbGl0ICc6J1xuICAgIHBhcnRzICAgICAgICAgICAgICAgPSBJRExYLnNwbGl0X2Zvcm11bGEgZm9ybXVsYVxuICAgIGJpZ3JhbXNfYXNfaW5kaWNlcyAgPSBJRExYLmdldF9yZWxhdGlvbmFsX2JpZ3JhbXNfYXNfaW5kaWNlcyBmb3JtdWxhXG4gICAgYmlncmFtcyAgICAgICAgICAgICA9IElETFguYmlncmFtc19mcm9tX3BhcnRzX2FuZF9pbmRpY2VzIHBhcnRzLCBiaWdyYW1zX2FzX2luZGljZXNcbiAgICByZXN1bHQgICAgICAgICAgICAgID0gKCBiaWdyYW0uam9pbiAnJyBmb3IgYmlncmFtIGluIGJpZ3JhbXMgKS5qb2luICcsJ1xuICAgICMgdXJnZSAgJzkzMjA5JywgZ2x5cGgsIGZvcm11bGFcbiAgICAjIGhlbHAgICc5MzIwOScsIHJlc3VsdFxuICAgICMgZGVidWcgJzIyMDIwJywgSlNPTi5zdHJpbmdpZnkgWyBwcm9iZSwgcmVzdWx0LCBdXG4gICAgaWYgcmVzdWx0ID09IG1hdGNoZXIgdGhlbiBULm9rIHRydWVcbiAgICBlbHNlIFQuZmFpbCBcImV4cGVjdGVkICN7bWF0Y2hlcn0sIGdvdCAje3Jlc3VsdH1cIlxuICBkb25lKClcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIihJRExYKSBiaWdyYW1zIGFzIGxpc3RzIG9mIHRleHRzXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gIHByb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXG4gICAgW1wi5LmzOuK/sOK/seeIq+WtkOS5mlwiLFtcIuK/seKKmueIq1wiLFwi4r+x54ir5a2QXCIsXCLiv7DlrZDkuZpcIixcIuK/sOS5muKKmlwiXV1cbiAgICBbXCLpkJM6KOK/sOmHkSjiv7HkuqDlj6PlrZAp5aSKKVwiLFtcIuK/sOKKmumHkVwiLFwi4r+w6YeR5LqgXCIsXCLiv7HkuqDlj6NcIixcIuK/seWPo+WtkFwiLFwi4r+w5a2Q5aSKXCIsXCLiv7DlpIriippcIl1dXG4gICAgW1wi5a2UOuK/sOWtkOS5mlwiLFtcIuK/sOKKmuWtkFwiLFwi4r+w5a2Q5LmaXCIsXCLiv7DkuZriippcIl1dXG4gICAgW1wi8KCDqDriv7niuoQmY2RwI3g4OGM2O1wiLFtcIuK/ueKKmuK6hFwiLFwi4r+54rqEJmNkcCN4ODhjNjtcIixcIuK/uSZjZHAjeDg4YzY74oqaXCJdXVxuICAgIFtcIvCghIs64r+wKOK/sSZjZHAjeDg1NWU75pel5LiCKeS5nlwiLFtcIuK/seKKmiZjZHAjeDg1NWU7XCIsXCLiv7EmY2RwI3g4NTVlO+aXpVwiLFwi4r+x5pel5LiCXCIsXCLiv7DkuILkuZ5cIixcIuK/sOS5nuKKmlwiXV1cbiAgICBbXCLwoISLOuK/sOmFieK/seaXpfCktJNcIixbXCLiv7DiiprphYlcIixcIuK/sOmFieaXpVwiLFwi4r+x5pel8KS0k1wiLFwi4r+x8KS0k+KKmlwiXV1cbiAgICBbXCLwoJWEOuKGu+WHuVwiLFtdXVxuICAgIFtcIuWtnTriv7HogILlrZBcIixbXCLiv7HiiprogIJcIixcIuK/seiAguWtkFwiLFwi4r+x5a2Q4oqaXCJdXVxuICAgIF1cbiAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuICAgIFsgZ2x5cGgsIGZvcm11bGEsIF0gPSBwcm9iZS5zcGxpdCAnOidcbiAgICByZXN1bHQgICAgICAgICAgICAgID0gSURMWC5nZXRfcmVsYXRpb25hbF9iaWdyYW1zIGZvcm11bGFcbiAgICBkZWJ1ZyAnMzIzMjEnLCBKU09OLnN0cmluZ2lmeSByZXN1bHRcbiAgICBpZiAoIGVxdWFscyByZXN1bHQsIG1hdGNoZXIgKSB0aGVuIFQub2sgdHJ1ZVxuICAgIGVsc2UgVC5mYWlsIFwiZXhwZWN0ZWQgI3ttYXRjaGVyfSwgZ290ICN7cmVzdWx0fVwiXG4gIGRvbmUoKVxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuaWYgbW9kdWxlIGlzIHJlcXVpcmUubWFpbiB0aGVuIGRvID0+XG4gIHRlc3QgQFxuIl19

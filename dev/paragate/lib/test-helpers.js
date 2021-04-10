(function() {
  'use strict';
  var CND, INTERTEXT, alert, badge, debug, echo, help, info, isa, jr, lets, log, rpr, type_of, urge, warn, whisper;

  // coffeelint: disable=max_line_length

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/TEST-HELPERS';

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

  //...........................................................................................................
  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  ({isa, type_of} = INTERTEXT.types);

  ({lets} = (require('datom')).export());

  //-----------------------------------------------------------------------------------------------------------
  this.as_text = function(x) {
    return rpr(x);
    switch (type_of(x)) {
      case 'text':
        return x;
      case 'object':
        return jr(x);
      case 'list':
        return jr(x);
    }
    return x.toString();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.condense_token = function(token) {
    var k, keys, values;
    keys = (Object.keys(token)).sort();
    keys = keys.filter(function(x) {
      return x !== 'message' && x !== '$';
    });
    values = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        k = keys[i];
        results.push(k + '=' + this.as_text(token[k]));
      }
      return results;
    }).call(this);
    return values.join(',');
  };

  // return as_text values

  //-----------------------------------------------------------------------------------------------------------
  this.condense_tokens = function(tokens) {
    var R, i, len, ref, t;
    R = [];
    for (i = 0, len = tokens.length; i < len; i++) {
      t = tokens[i];
      if ((ref = t.$key) === '<document' || ref === '>document') {
        continue;
      }
      R.push(this.condense_token(t));
    }
    return R.join('#');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.delete_refs = function(ds) {
    var R, d, i, len;
    R = [];
    for (i = 0, len = ds.length; i < len; i++) {
      d = ds[i];
      R.push(lets(d, function(d) {
        return delete d.$;
      }));
    }
    return R;
  };

  // #-----------------------------------------------------------------------------------------------------------
// @show_condensed_tokens = ( tokens ) ->
//   for token in tokens
//     help @condense_token token
//   info @condense_tokens tokens
//   return null

}).call(this);

//# sourceMappingURL=test-helpers.js.map
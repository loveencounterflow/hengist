(function() {
  'use strict';
  var CND, badge, debug, echo, help, info, jr, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'INTERSHOP/TESTS/INTERSHOP-OBJECT';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  // #...........................................................................................................
  // types                     = require '../types'
  // { isa
  //   validate
  //   type_of }               = types
  //...........................................................................................................

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "INTERSHOP object: initializes acc. to project" ] = ( T, done ) ->
  //   ### TAINT how to set up mock environment? ###
  //   done()

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "test VNR._first_nonzero_is_negative()" ] = ( T, done ) ->
  //   PATH          = require 'path'
  //   project_path  = PATH.resolve PATH.join ( require.resolve 'intershop' ), '../../'
  //   debug '^443^', project_path
  //   intershop     = ( require 'intershop' ).new_intershop project_path
  //   intershop.variables.my_boolean  = { value: 'true', type: 'boolean',           }
  //   intershop.variables.my_int      = { value: '4445', type: 'int',               }
  //   intershop.variables.my_integer  = { value: '' type: 'integer',           }
  //   intershop.variables.my_json     = { value: '' type: 'json',              }
  //   intershop.variables.my_text     = { value: type: 'text',              }
  //   intershop.variables.my_U        = { value: type: 'U.natural_number',  }
  //   #.........................................................................................................
  //   # [ [ 'boolean']]
  //   # [ [ 'int']]
  //   # [ [ 'integer']]
  //   # [ [ 'json'               ]]
  //   # [ [ 'text'               ]]
  //   # [ [ 'U.natural_number']]

  //   probes_and_matchers = [
  //     [[ [3,4,0,0,],        4, ], false, ]
  //     ]
  //   #.........................................................................................................
  //   debug '^443^', intershop
  //   # for [ probe, matcher, error, ] in probes_and_matchers
  //   #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //   #     [ list, first_idx, ] = probe
  //   #     resolve VNR._first_nonzero_is_negative list, first_idx
  //   done()
  //   return null

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "VNR sort 2" ]
// test @[ "VNR sort 3" ]
// @[ "VNR sort 3" ]()
// test @[ "test VNR._first_nonzero_is_negative()" ]

}).call(this);

//# sourceMappingURL=intershop-object.tests.js.map
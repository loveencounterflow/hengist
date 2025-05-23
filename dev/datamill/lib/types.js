(function() {
  'use strict';
  var CND, Intertype, badge, intertype, rpr;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'FILEWATCHER/TYPES';

  // debug                     = CND.get_logger 'debug',     badge
  // alert                     = CND.get_logger 'alert',     badge
  // whisper                   = CND.get_logger 'whisper',   badge
  // warn                      = CND.get_logger 'warn',      badge
  // help                      = CND.get_logger 'help',      badge
  // urge                      = CND.get_logger 'urge',      badge
  // info                      = CND.get_logger 'info',      badge
  // jr                        = JSON.stringify
  Intertype = (require('intertype')).Intertype;

  intertype = new Intertype(module.exports);

  // @declare_check 'equals', ( a, b ) -> if CND.equals a, b then true else @sad

  // #-----------------------------------------------------------------------------------------------------------
// @declare 'pd_nonempty_list_of_positive_integers', ( x ) ->
//   return false unless @isa.nonempty_list x
//   return x.every ( xx ) => @isa.positive_integer xx

  // #-----------------------------------------------------------------------------------------------------------
// @declare 'pd_datom_sigil',
//   tests:
//     "x is a chr":                             ( x ) -> @isa.chr x
//     "x has sigil":                            ( x ) -> x in '^<>~[]'

  // #-----------------------------------------------------------------------------------------------------------
// @declare 'pd_datom_key',
//   tests:
//     "x is a nonempty text":                   ( x ) -> @isa.nonempty_text   x
//     "x has sigil":                            ( x ) -> @isa.pd_datom_sigil  x[ 0 ]

  // #-----------------------------------------------------------------------------------------------------------
// @declare 'pd_datom',
//   tests:
//     "x is a object":                          ( x ) -> @isa.object          x
//     "x has key 'key'":                        ( x ) -> @has_key             x, 'key'
//     "x.key is a pd_datom_key":                ( x ) -> @isa.pd_datom_key    x.key
//     "x.$stamped is an optional boolean":      ( x ) -> ( not x.$stamped? ) or ( @isa.boolean x.$stamped )
//     "x.$dirty is an optional boolean":        ( x ) -> ( not x.$dirty?   ) or ( @isa.boolean x.$dirty   )
//     "x.$fresh is an optional boolean":        ( x ) -> ( not x.$fresh?   ) or ( @isa.boolean x.$fresh   )
//     #.......................................................................................................
//     "x.$vnr is an optional nonempty list of positive integers": ( x ) ->
//       ( not x.$vnr? ) or @isa.pd_nonempty_list_of_positive_integers x.$vnr

  //     # "?..$vnr is a ?positive":            ( x ) -> ( not x.$vnr? ) or @isa.positive x.$vnr
// #     "? has key 'vlnr_txt'":                   ( x ) -> @has_key             x, 'vlnr_txt'
// #     "? has key 'value'":                      ( x ) -> @has_key             x, 'value'
// #     "?.vlnr_txt is a nonempty text":          ( x ) -> @isa.nonempty_text   x.vlnr_txt
// #     "?.vlnr_txt starts, ends with '[]'":      ( x ) -> ( x.vlnr_txt.match /^\[.*\]$/ )?
// #     "?.vlnr_txt is a JSON array of integers": ( x ) ->
// #       # debug 'µ55589', x
// #       ( @isa.list ( lst = JSON.parse x.vlnr_txt ) ) and \
// #       ( lst.every ( xx ) => ( @isa.integer xx ) and ( @isa.positive xx ) )

  // # #-----------------------------------------------------------------------------------------------------------
// # @declare 'true', ( x ) -> x is true

}).call(this);

//# sourceMappingURL=types.js.map
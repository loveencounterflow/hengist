(function() {
  // 'use strict'

  // ############################################################################################################
// CND                       = require 'cnd'
// rpr                       = CND.rpr
// badge                     = 'GUY/TESTS/SRC'
// log                       = CND.get_logger 'plain',     badge
// info                      = CND.get_logger 'info',      badge
// whisper                   = CND.get_logger 'whisper',   badge
// alert                     = CND.get_logger 'alert',     badge
// debug                     = CND.get_logger 'debug',     badge
// warn                      = CND.get_logger 'warn',      badge
// help                      = CND.get_logger 'help',      badge
// urge                      = CND.get_logger 'urge',      badge
// echo                      = CND.echo.bind CND
// #...........................................................................................................
// test                      = require '../../../apps/guy-test'
// # PATH                      = require 'path'
// # FS                        = require 'fs'
// # { freeze }                = require 'letsfreezethat'
// H                         = require './helpers'
// types                     = new ( require 'intertype' ).Intertype
// { isa
//   type_of
//   validate
//   validate_list_of
//   equals }                = types.export()

  // #-----------------------------------------------------------------------------------------------------------
// convert_to_plain_objects = ( ast ) ->
//   if types.isa.object ast
//     R = { ast..., }
//     R[ key ]  = convert_to_plain_objects value for key, value of R
//     return R
//   if types.isa.list ast
//     R         = [ ast..., ]
//     R[ idx ]  = convert_to_plain_objects value for value, idx in R
//     return R
//   return ast

  // #-----------------------------------------------------------------------------------------------------------
// @[ "GUY.src.parse()" ] = ( T, done ) ->
//   # T?.halt_on_error()
//   GUY     = require H.guy_path
//   do =>
//     result = convert_to_plain_objects GUY.src.parse text: "42"
//     debug '^975-1^', result
//     T?.eq result, { type: 'Program', start: 0, end: 2, body: [ { type: 'ExpressionStatement', start: 0, end: 2, expression: { type: 'Literal', start: 0, end: 2, value: 42, raw: '42' } } ], sourceType: 'script' }
//   do =>
//     result = convert_to_plain_objects GUY.src.parse text: "var x = 'helo world';"
//     debug '^975-2^', result
//     T?.eq result, { type: 'Program', start: 0, end: 21, body: [ { type: 'VariableDeclaration', start: 0, end: 21, kind: 'var', declarations: [ { type: 'VariableDeclarator', start: 4, end: 20, id: { type: 'Identifier', start: 4, end: 5, name: 'x' }, init: { type: 'Literal', start: 8, end: 20, value: 'helo world', raw: "'helo world'" } } ] } ], sourceType: 'script' }
//   do =>
//     f       = ( x ) -> 42
//     debug '^975-3^', f.toString()
//     result  = convert_to_plain_objects GUY.src.parse { function: f, use: 'loose', }
//     debug '^975-3^', result
//     T?.eq result, { type: 'Program', start: 0, end: 26, body: [ { type: 'FunctionDeclaration', start: 0, end: 26, id: { type: 'Identifier', start: 8, end: 8, name: '✖' }, params: [ { type: 'Identifier', start: 9, end: 10, name: 'x' } ], generator: false, expression: false, async: false, body: { type: 'BlockStatement', start: 12, end: 26, body: [ { type: 'ReturnStatement', start: 14, end: 24, argument: { type: 'Literal', start: 21, end: 23, value: 42, raw: '42' } } ] } } ], sourceType: 'script' }
//   return done?()

  // #-----------------------------------------------------------------------------------------------------------
// @[ "GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ] = ( T, done ) ->
//   # T?.halt_on_error()
//   GUY     = require H.guy_path
//   probes_and_matchers = [
//     [ { text: "let x = 1 + 1;", }, { type: 'Program', start: 0, end: 14, body: [ { type: 'VariableDeclaration', start: 0, end: 14, kind: 'let', declarations: [ { type: 'VariableDeclarator', start: 4, end: 13, id: { type: 'Identifier', start: 4, end: 5, name: 'x' }, init: { type: 'BinaryExpression', start: 8, end: 13, left: { type: 'Literal', start: 8, end: 9, value: 1, raw: '1' }, operator: '+', right: { type: 'Literal', start: 12, end: 13, value: 1, raw: '1' } } } ] } ], sourceType: 'script' }, ]
//     [ { text: "let x = 1 ^^^^^ 1;", use: 'strict' }, null, 'Unexpected token', ]
//     [ { text: "let x = 1 ^^^^^ 1;", use: 'strict,loose' }, { type: 'Program', start: 0, end: 18, body: [ { type: 'VariableDeclaration', start: 0, end: 18, kind: 'let', declarations: [ { type: 'VariableDeclarator', start: 4, end: 17, id: { type: 'Identifier', start: 4, end: 5, name: 'x' }, init: { type: 'BinaryExpression', start: 8, end: 17, left: { type: 'BinaryExpression', start: 8, end: 14, left: { type: 'BinaryExpression', start: 8, end: 13, left: { type: 'BinaryExpression', start: 8, end: 12, left: { type: 'BinaryExpression', start: 8, end: 11, left: { type: 'Literal', start: 8, end: 9, value: 1, raw: '1' }, operator: '^', right: { type: 'Identifier', start: 11, end: 11, name: '✖' } }, operator: '^', right: { type: 'Identifier', start: 12, end: 12, name: '✖' } }, operator: '^', right: { type: 'Identifier', start: 13, end: 13, name: '✖' } }, operator: '^', right: { type: 'Identifier', start: 14, end: 14, name: '✖' } }, operator: '^', right: { type: 'Literal', start: 16, end: 17, value: 1, raw: '1' } } } ] } ], sourceType: 'script' }, ]
//     [ { text: "let x = 1 ^^^^^ 1;", use: 'loose' }, { type: 'Program', start: 0, end: 18, body: [ { type: 'VariableDeclaration', start: 0, end: 18, kind: 'let', declarations: [ { type: 'VariableDeclarator', start: 4, end: 17, id: { type: 'Identifier', start: 4, end: 5, name: 'x' }, init: { type: 'BinaryExpression', start: 8, end: 17, left: { type: 'BinaryExpression', start: 8, end: 14, left: { type: 'BinaryExpression', start: 8, end: 13, left: { type: 'BinaryExpression', start: 8, end: 12, left: { type: 'BinaryExpression', start: 8, end: 11, left: { type: 'Literal', start: 8, end: 9, value: 1, raw: '1' }, operator: '^', right: { type: 'Identifier', start: 11, end: 11, name: '✖' } }, operator: '^', right: { type: 'Identifier', start: 12, end: 12, name: '✖' } }, operator: '^', right: { type: 'Identifier', start: 13, end: 13, name: '✖' } }, operator: '^', right: { type: 'Identifier', start: 14, end: 14, name: '✖' } }, operator: '^', right: { type: 'Literal', start: 16, end: 17, value: 1, raw: '1' } } } ] } ], sourceType: 'script' }, ]
//     [ { text: "let x = 1 ^^^^^ 1;", use: 'strict', fallback: null, }, null, ]
//     ]
//   #.........................................................................................................
//   for [ probe, matcher, error, ] in probes_and_matchers
//     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
//       result  = GUY.src.parse probe
//       # debug '^34234^', GUY.src._generate result
//       result  = convert_to_plain_objects result
//       resolve result
//   #.........................................................................................................
//   return done?()

  // #-----------------------------------------------------------------------------------------------------------
// @[ "GUY.src.slug_node_from_simple_function()" ] = ( T, done ) ->
//   # T?.halt_on_error()
//   GUY     = require H.guy_path
//   f3      =  ( x ) ->
//     return true if x > 0
//     return false if x < 0
//     return null
//   probes_and_matchers = [
//     [ { function: ( -> ), },                                                                    { type: 'BlockStatement', start: 11, end: 13, body: [] }, ]
//     [ { function: ( ( x ) -> 42 ), },                                                           { type: 'ReturnStatement', start: 14, end: 24, argument: { type: 'Literal', start: 21, end: 23, value: 42, raw: '42' } }, ]
//     [ { function: ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) ), },  { type: 'ReturnStatement', start: 14, end: 88, argument: { type: 'LogicalExpression', start: 21, end: 87, left: { type: 'LogicalExpression', start: 21, end: 56, left: { type: 'BinaryExpression', start: 22, end: 31, left: { type: 'Identifier', start: 22, end: 23, name: 'x' }, operator: '==', right: { type: 'Literal', start: 27, end: 31, value: null, raw: 'null' } }, operator: '||', right: { type: 'CallExpression', start: 37, end: 55, callee: { type: 'MemberExpression', start: 37, end: 52, object: { type: 'MemberExpression', start: 37, end: 45, object: { type: 'ThisExpression', start: 37, end: 41 }, property: { type: 'Identifier', start: 42, end: 45, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 46, end: 52, name: 'object' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 53, end: 54, name: 'x' } ], optional: false } }, operator: '||', right: { type: 'CallExpression', start: 61, end: 86, callee: { type: 'MemberExpression', start: 61, end: 83, object: { type: 'MemberExpression', start: 61, end: 78, object: { type: 'MemberExpression', start: 61, end: 69, object: { type: 'ThisExpression', start: 61, end: 65 }, property: { type: 'Identifier', start: 66, end: 69, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 70, end: 78, name: 'nonempty' }, computed: false, optional: false }, property: { type: 'Identifier', start: 79, end: 83, name: 'text' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 84, end: 85, name: 'x' } ], optional: false } } }, ]
//     [ { function: ( `function ( x ) { 42; }` ), },                                              { type: 'BlockStatement', start: 15, end: 22, body: [ { type: 'ExpressionStatement', start: 17, end: 20, expression: { type: 'Literal', start: 17, end: 19, value: 42, raw: '42' } } ] }, ]
//     [ { function: ( `function ( x ) { return 42; }` ), },                                       { type: 'ReturnStatement', start: 17, end: 27, argument: { type: 'Literal', start: 24, end: 26, value: 42, raw: '42' } }, ]
//     [ { function: ( ( x ) -> if x? then true else false ), },                                   { type: 'BlockStatement', start: 12, end: 70, body: [ { type: 'IfStatement', start: 14, end: 68, test: { type: 'BinaryExpression', start: 18, end: 27, left: { type: 'Identifier', start: 18, end: 19, name: 'x' }, operator: '!=', right: { type: 'Literal', start: 23, end: 27, value: null, raw: 'null' } }, consequent: { type: 'BlockStatement', start: 29, end: 45, body: [ { type: 'ReturnStatement', start: 31, end: 43, argument: { type: 'Literal', start: 38, end: 42, value: true, raw: 'true' } } ] }, alternate: { type: 'BlockStatement', start: 51, end: 68, body: [ { type: 'ReturnStatement', start: 53, end: 66, argument: { type: 'Literal', start: 60, end: 65, value: false, raw: 'false' } } ] } } ] }, ]
//     [ { function: ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) ), },  { type: 'ReturnStatement', start: 14, end: 88, argument: { type: 'LogicalExpression', start: 21, end: 87, left: { type: 'LogicalExpression', start: 21, end: 56, left: { type: 'BinaryExpression', start: 22, end: 31, left: { type: 'Identifier', start: 22, end: 23, name: 'x' }, operator: '==', right: { type: 'Literal', start: 27, end: 31, value: null, raw: 'null' } }, operator: '||', right: { type: 'CallExpression', start: 37, end: 55, callee: { type: 'MemberExpression', start: 37, end: 52, object: { type: 'MemberExpression', start: 37, end: 45, object: { type: 'ThisExpression', start: 37, end: 41 }, property: { type: 'Identifier', start: 42, end: 45, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 46, end: 52, name: 'object' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 53, end: 54, name: 'x' } ], optional: false } }, operator: '||', right: { type: 'CallExpression', start: 61, end: 86, callee: { type: 'MemberExpression', start: 61, end: 83, object: { type: 'MemberExpression', start: 61, end: 78, object: { type: 'MemberExpression', start: 61, end: 69, object: { type: 'ThisExpression', start: 61, end: 65 }, property: { type: 'Identifier', start: 66, end: 69, name: 'isa' }, computed: false, optional: false }, property: { type: 'Identifier', start: 70, end: 78, name: 'nonempty' }, computed: false, optional: false }, property: { type: 'Identifier', start: 79, end: 83, name: 'text' }, computed: false, optional: false }, arguments: [ { type: 'Identifier', start: 84, end: 85, name: 'x' } ], optional: false } } }, ]
//     [ { function: f3, },                                                                        { type: 'BlockStatement', start: 12, end: 85, body: [ { type: 'IfStatement', start: 14, end: 41, test: { type: 'BinaryExpression', start: 18, end: 23, left: { type: 'Identifier', start: 18, end: 19, name: 'x' }, operator: '>', right: { type: 'Literal', start: 22, end: 23, value: 0, raw: '0' } }, consequent: { type: 'BlockStatement', start: 25, end: 41, body: [ { type: 'ReturnStatement', start: 27, end: 39, argument: { type: 'Literal', start: 34, end: 38, value: true, raw: 'true' } } ] }, alternate: null }, { type: 'IfStatement', start: 42, end: 70, test: { type: 'BinaryExpression', start: 46, end: 51, left: { type: 'Identifier', start: 46, end: 47, name: 'x' }, operator: '<', right: { type: 'Literal', start: 50, end: 51, value: 0, raw: '0' } }, consequent: { type: 'BlockStatement', start: 53, end: 70, body: [ { type: 'ReturnStatement', start: 55, end: 68, argument: { type: 'Literal', start: 62, end: 67, value: false, raw: 'false' } } ] }, alternate: null }, { type: 'ReturnStatement', start: 71, end: 83, argument: { type: 'Literal', start: 78, end: 82, value: null, raw: 'null' } } ] }, ]
//     ]
//   #.........................................................................................................
//   for [ probe, matcher, error, ] in probes_and_matchers
//     # result  = GUY.src.slug_node_from_simple_function probe
//     # result  = convert_to_plain_objects result
//     # urge '^33424^', result
//     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
//       result  = GUY.src.slug_node_from_simple_function probe
//       result  = convert_to_plain_objects result
//       urge '^33424^', result
//       resolve result
//   #.........................................................................................................
//   return done?()

  // #-----------------------------------------------------------------------------------------------------------
// @[ "GUY.src.slug_from_simple_function()" ] = ( T, done ) ->
//   # T?.halt_on_error()
//   GUY     = require H.guy_path
//   f3      =  ( x ) ->
//     return true if x > 0
//     return false if x < 0
//     return null
//   probes_and_matchers = [
//     [ { function: ( -> ), },                                                                    '', ]
//     [ { function: ( ( x ) -> x %% 3 is 0 ), },                                                  'modulo(x, 3) === 0', ]
//     [ { function: ( ( x ) -> 42 ), },                                                           '42', ]
//     [ { function: ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) ), },  'x == null || this.isa.object(x) || this.isa.nonempty.text(x)', ]
//     [ { function: ( `function ( x ) { 42; }` ), },                                              '42;', ]
//     [ { function: ( `function ( x ) { return 42; }` ), },                                       '42', ]
//     [ { function: ( ( x ) -> if x? then true else false ), },                                   'if (x != null) { return true; } else { return false; }', ]
//     [ { function: ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) ), },  'x == null || this.isa.object(x) || this.isa.nonempty.text(x)', ]
//     [ { function: f3, },                                                                        'if (x > 0) { return true; } if (x < 0) { return false; } return null;', ]
//     [ { text: 'let x = 42;' }, 'let x = 42;', null ]
//     ]
//   #.........................................................................................................
//   for [ probe, matcher, error, ] in probes_and_matchers
//     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
//       result  = GUY.src.slug_from_simple_function probe
//       # urge '^33424^', rpr result
//       resolve result
//   #.........................................................................................................
//   return done?()

  // #-----------------------------------------------------------------------------------------------------------
// @[ "GUY.src.slug_from_simple_function() for bound functions" ] = ( T, done ) ->
//   # T?.halt_on_error()
//   GUY     = require H.guy_path
//   f3      = ( x ) -> 42
//   f4      = f3.bind null
//   T?.throws /unable to parse native code/, -> GUY.src.slug_from_simple_function { function: f4, }
//   result  = GUY.src.slug_from_simple_function { function: f4, fallback: null, }
//   T?.eq result, null
//   # urge '^33424^', rpr result
//   #.........................................................................................................
//   return done?()

  // #-----------------------------------------------------------------------------------------------------------
// demo_return_clauses = ->
//   GUY       = require H.guy_path
//   functions = [
//     ( x ) -> 42
//     ( x ) -> g 42
//     ( x ) -> if x > 0 then g 42 else g 108
//     ]
//   for f in functions
//     ast = GUY.src.get_first_return_clause_node f
//     info convert_to_plain_objects ast
//     urge GUY.src.ASTRING.generate ast
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// demo_acorn_walk = ->
//   ### Count return statements; if more than one, return first BlockStatement, otherwise `argument` property
//   of first and only ReturnStatement ###
//   GUY     = require H.guy_path
//   acorn   = require 'acorn'
//   walk    = require 'acorn-walk'
//   # ast     = acorn.parse "let x = 10;", { ecmaVersion: '2022', }
//   # ast     = GUY.src.parse function: ( x ) -> if x? then true else false
//   ast     = GUY.src.parse function: ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x )
//   # debug '^24324^', ast
//   walk.simple ast,
//     Literal: ( node ) ->
//       source = GUY.src.ASTRING.generate node
//       info "Found a literal: #{source}"
//     ReturnStatement: ( node ) ->
//       source = GUY.src.ASTRING.generate node
//       urge "Found a return statement: #{source}"
//     BlockStatement: ( node ) ->
//       # debug node
//       source = GUY.src.ASTRING.generate node
//       source = source.trim().replace /\s*\n\s*/g, ' '
//       info "Found a block statement: #{source}"
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// demo_acorn_walk = ->
//   ### Count return statements; if more than one, return first BlockStatement, otherwise `argument` property
//   of first and only ReturnStatement ###
//   GUY       = require H.guy_path
//   f3        =  ( x ) ->
//     return true if x > 0
//     return false if x < 0
//     return null
//   cfgs      = [
//     # { function: ( `function ( x ) { 42; }` ), }
//     # { function: ( `function ( x ) { return 42; }` ), }
//     # { function: ( ( x ) -> if x? then true else false ), }
//     # { function: ( ( x ) -> ( not x? ) or ( @isa.object x ) or ( @isa.nonempty.text x ) ), }
//     # { function: f3, }
//     { text: 'let x ^^^ 42;', use: 'strict', fallback: 'NOTGOOD', }
//     # { text: 'let x ^^^ 42;', use: 'strict', }
//     { text: 'let x = 42;', use: 'strict', }
//     { text: 'let x = 42;', }
//     ]
//   for cfg in cfgs
//     whisper '————————————————————————————————————————————————————'
//     urge '^5345^', ( cfg.function ? cfg.text ).toString()
//     info '^5345^', rpr GUY.src.slug_from_simple_function cfg
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// demo_parse_use_and_fallback = ->
//   GUY           = require H.guy_path
//   error_literal = { type: 'Literal', start: 0, end: 7, value: 'ERROR', raw: "'ERROR'" }
//   debug '^334^', GUY.src.parse { use: 'strict',       text: "'ERROR'", }
//   debug '^334^', result = GUY.src.parse { use: 'strict',       text: 'let x = 1;', fallback: error_literal, }
//   info rpr GUY.src._generate result
//   debug '^334^', result = GUY.src.parse { use: 'strict,loose', text: 'let x = 1;', fallback: error_literal, }
//   info rpr GUY.src._generate result
//   debug '^334^', result = GUY.src.parse { use: 'loose',        text: 'let x = 1;', fallback: error_literal, }
//   info rpr GUY.src._generate result
//   debug '^334^', result = GUY.src.parse { use: 'strict',       text: 'let x ^^^ 1;', fallback: error_literal, }
//   info rpr GUY.src._generate result
//   debug '^334^', result = GUY.src.parse { use: 'strict,loose', text: 'let x ^^^ 1;', fallback: error_literal, }
//   info rpr GUY.src._generate result
//   debug '^334^', result = GUY.src.parse { use: 'loose',        text: 'let x ^^^ 1;', fallback: error_literal, }
//   info rpr GUY.src._generate result
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// demo_slug_for_inadvertent_multiline_function = ->
//   GUY           = require H.guy_path
//   div3int       = ( x ) -> x %% 3 is 0
//   ```
//   const div3int_js = {
//           function: (function(x) {
//             return modulo(x,
//         3) === 0;
//           })
//         };
//   ```
//   whisper '————————————————————————————————————————————————————'
//   info '^353^', div3int.toString()
//   urge '^353^', rpr GUY.src.slug_from_simple_function { function: div3int, }
//   whisper '————————————————————————————————————————————————————'
//   info '^353^', div3int_js.function.toString()
//   urge '^353^', rpr GUY.src.slug_from_simple_function { function: div3int_js.function, }
//   whisper '————————————————————————————————————————————————————'
//   info '^353^', text = div3int_js.function.toString().replace /\s*\n\s*/g, ' '
//   urge '^353^', rpr GUY.src.slug_from_simple_function { text, }
//   whisper '————————————————————————————————————————————————————'
//   return null

  // ############################################################################################################
// if require.main is module then do =>
//   # test @
//   # test @[ "GUY.src.slug_from_simple_function() for bound functions" ]
//   # @[ "guy.str.SQL tag function" ]()
//   # demo_return_clauses()
//   # test @[ "GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ]
//   # @[ "GUY.src.parse()" ]()
//   # test @[ "GUY.src.parse()" ]
//   # demo_parse_use_and_fallback()
//   # demo_acorn_walk()
//   # test @[ "GUY.src.slug_node_from_simple_function()" ]
//   test @[ "GUY.src.slug_from_simple_function()" ]
//   # demo_slug_for_inadvertent_multiline_function()


}).call(this);

//# sourceMappingURL=src.tests.js.map
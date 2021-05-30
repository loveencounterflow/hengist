
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'SCDA'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
{ Dba }                   = require '../../../apps/icql-dba'
Readlines                 = require 'n-readlines'
glob                      = require 'glob'
{ freeze
  lets }                  = require 'letsfreezethat'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types.export()


#-----------------------------------------------------------------------------------------------------------
@demo_ast_walker = ->
  CS = require 'coffeescript'
  xrpr = ( x ) -> ( rpr x )[ .. 100 ]
  #-----------------------------------------------------------------------------------------------------------
  walk_ast = ( tree ) ->
    whisper '^38^', '-'.repeat 108
    urge '^38^', tree.children, CND.steel xrpr tree
    switch tree_type = type_of tree
      #.....................................................................................................
      when 'root'
        yield { name: 'root', }
        yield from walk_ast tree.body
      #.....................................................................................................
      when 'block'
        yield { name: 'block', }
        for childname in tree.children
          debug '^39^', childname, xrpr tree[ childname ]
          yield from walk_ast tree[ childname ]
      #.....................................................................................................
      when 'list'
        for element in tree
          yield from walk_ast element
      #.....................................................................................................
      else
        whisper "^54^ unknown tree_type: #{rpr tree_type}"
    #.......................................................................................................
    return null
    # #.......................................................................................................
    # whisper '^35345-1^', 'type:', type_of tree
    # # whisper '^35345-2^', 'type:', type_of tree
    # for childname in tree.children
    #   whisper '^35345-3^', childname
    #   switch childname
    #     when 'variable'
    #       debug '^6456-1^', 'variable:                     ', xrpr tree.variable
    #       debug '^6456-1^', 'variable.children:            ', xrpr tree.variable.children
    #       debug '^6456-1^', 'variable.base:                ', xrpr tree.variable.base
    #       debug '^6456-1^', 'variable.base.children:       ', xrpr tree.variable.base.children
    #       debug '^6456-1^', 'variable.properties:          ', xrpr tree.variable.properties
    #       debug '^6456-1^', 'variable.properties.children: ', xrpr tree.variable.properties.children
    #       null
    #     when 'value'
    #       debug '^6456-1^', 'value:                        ', xrpr tree.value
    #       debug '^6456-1^', 'value.children:               ', xrpr tree.value.children
    #       debug '^6456-1^', 'value.params:                 ', xrpr tree.value.params
    #       debug '^6456-1^', 'value.params.children:        ', xrpr tree.value.params.children
    #       debug '^6456-1^', 'value.body:                   ', xrpr tree.value.body
    #       debug '^6456-1^', 'value.body.children:          ', xrpr tree.value.body.children
    #       null
    #     when 'expressions'
    #       for node in tree.expressions
    #         whisper '^35345-4^', 'type:', type_of node
    #         delete node.locationData
    #         info  '^6456-2^', node.children
    #         # switch node_type = type_of node
    #         #   when 'assign'
    #         #     null
    #         #   when 'variable'
    #         #     null
    #         #   when 'value'
    #         #     null
    #         #   else throw new Error "unknown node type #{node_type}"
    #         walk_ast node
    #     else throw new Error "unknown node type #{rpr childname}"
    # return null
  #.........................................................................................................
  source = """
    @foo = ( x ) -> x * x
    bar = -> 42
    """
  for d from walk_ast CS.nodes source
    info '^54^', d
  #.........................................................................................................
  return null

############################################################################################################
if module is require.main then do =>
  @demo_ast_walker()


'use strict'

types       = new ( require '../../../apps/intertype' ).Intertype()
{ isa
  declare } = types
log         = console.log

declare 'xy_quantity', test: [
  ( x ) -> @isa.object          x
  ( x ) -> @isa.float           x.value
  ( x ) -> @isa.nonempty.text   x.unit
  ]

log '^1-1^', isa.xy_quantity null
log '^1-1^', isa.xy_quantity 42
log '^1-1^', isa.xy_quantity { value: 42, unit: 'm', }


### Simplest forms: either define by a single string (creating a type alias) or a single function (whose
processed source code will serve as a name to identify the rule): ###
types.declare.string 'text'                 # now `string` is another word for `text`
types.declare.div3int ( x ) -> x %% 3 is 0
#...........................................................................................................
types.declare.div3int
  groups:   'number'
  all: [
    'integer'
    { name: 'divisible by 3', test: ( ( x ) -> x %% 3 is 0 ), } ]
#...........................................................................................................
types.declare.Type_cfg_groups_element all: [ 'nonempty.text', { not_match: /[\s,]/, }, ]
types.declare.Type_cfg_groups         any: [ 'nonempty.text', 'list_of.Type_cfg_groups_element', ]
#...........................................................................................................
types.declare.Type_cfg_constructor_cfg
  all: {
    self:         'object'
    '.name':      'nonempty.text'
    '.test':      any:  { 'function', 'list_of.function', }
    '.groups':    'Type_cfg_groups'
    }



'use strict'


############################################################################################################
GUY                       = require 'guy'
{ debug
  warn
  urge
  help }                  = GUY.trm.get_loggers 'INTERTYPE/type-factory'
{ rpr }                   = GUY.trm
#...........................................................................................................
E                         = require './errors'
H                         = require './helpers'
{ types
  defaults }              = require './types'



#===========================================================================================================
class Type_factory extends H.Intertype_abc

  #---------------------------------------------------------------------------------------------------------
  constructor: ( hub ) ->
    super()
    types.validate.object hub
    @hub = hub
    @cfg = GUY.lft.freeze { rename: [ 'isa', '', ], }
    return undefined

  #---------------------------------------------------------------------------------------------------------
  create_type: ( name, dsc ) ->
    dsc         = @_normalize_type_cfg name, dsc
    debug '^302-1^', { dsc, }
    if dsc.fields?
      name    = dsc.isa.name
      R       = ( @_create_test_walker dsc ).bind dsc
    else
      name    = dsc.name
      R       = dsc.isa
      dsc.isa = null
    GUY.props.hide R, k, v for k, v of dsc when k isnt 'name'
    H.nameit name, R
    R = GUY.props.Strict_owner.create { target: R, oneshot: true, }
    return R


  #=========================================================================================================
  #
  # #---------------------------------------------------------------------------------------------------------
  # _validate_name: ( name ) ->
  #   return name if types.isa.nonempty_text name
  #   throw new E.Intertype_ETEMPTBD '^tf@1^', \
  #     "expected a nonempty text for new type name, got #{rpr name}"

  # #---------------------------------------------------------------------------------------------------------
  # _validate_dsc: ( dsc ) ->
  #   return dsc            if types.isa.object         dsc
  #   return { isa: dsc, }  if types.isa.function       dsc
  #   return { isa: dsc, }  if types.isa.nonempty_text  dsc
  #   throw new E.Intertype_ETEMPTBD '^tf@2^', \
  #     "expected an object, a function or a nonempty text for type description, got #{rpr dsc}"

  # #---------------------------------------------------------------------------------------------------------
  # _validate_isa: ( isa ) ->
  #   return isa  if types.isa.function       isa
  #   return isa  if types.isa.nonempty_text  isa
  #   throw new E.Intertype_ETEMPTBD '^tf@3^', \
  #     "expected a function or a nonempty text for `isa`, got #{rpr isa}"


  #=========================================================================================================
  #
  #---------------------------------------------------------------------------------------------------------
  _dsc_from_proto_dsc: ( proto_dsc ) ->
    template = defaults.Type_factory_type_dsc
    switch type = types.type_of proto_dsc
      when 'function' then return { template..., isa: proto_dsc,                      }
      when 'list'     then return { template..., isa: ( @_isa_from_list proto_dsc ),  }
      when 'set'      then return { template..., isa: ( @_isa_from_set  proto_dsc ),  }
      when 'object'   then return { template..., proto_dsc...,                        }
      else throw new E.Intertype_ETEMPTBD '^tf@4^', \
        "expected a function, list, set or object as type description got a #{type}"
    return null

  #---------------------------------------------------------------------------------------------------------
  _normalize_type_cfg: ( name, proto_dsc ) ->
    dsc   = @_dsc_from_proto_dsc proto_dsc
    return dsc # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  #   # isa   = null
  #   #.......................................................................................................
  #   if name? and ( dsc_name = GUY.props.get dsc, 'name', null )? and ( dsc_name isnt name )
  #     throw new E.Intertype_ETEMPTBD '^tf@6^', \
  #       "got two conflicting values for `name` (#{rpr name} and #{rpr dsc_name})"
  #   dsc.name     ?= name
  #   dsc.typename  = dsc.name
  #   #.......................................................................................................
  #   @_assemble_fields dsc
  #   #.......................................................................................................
  #   if dsc.isa?
  #     if types.isa.text dsc.isa
  #       dsc.isa     = @_test_from_hedgepath dsc.isa
  #     name_of_isa = if dsc.isa.name in @cfg.rename then '#0' else dsc.isa.name
  #     dsc.isa     = H.nameit "#{dsc.name}:#{name_of_isa}", do =>
  #       f = dsc.isa.bind @hub
  #       return ( x ) =>
  #         @hub.state.x = x if @hub.state.isa_depth < 2
  #         R = do =>
  #           try
  #             return f x
  #           catch error
  #             throw error if @hub.cfg.errors or error instanceof E.Intertype_error
  #             @hub.state.error = error
  #           return false
  #         @hub.push_hedgeresult [ '▲nt2', @hub.state.isa_depth, dsc.name, x, R ]
  #         return if ( @hub.state.verb is 'validate' ) and ( @hub.state.hedges.length is 1 ) then x else R
  #   #.......................................................................................................
  #   dsc = { defaults.Type_factory_type_dsc..., dsc..., }
  #   types.validate.Type_factory_type_dsc dsc
  #   #.......................................................................................................
  #   return dsc

  # #---------------------------------------------------------------------------------------------------------
  # _assemble_fields: ( dsc ) ->
  #   ### Re-assemble fields in `fields` property, delete `$`-prefixed keys ###
  #   fields = dsc.fields ? null
  #   for key, field_dsc of dsc
  #     continue unless key.startsWith '$'
  #     if key is '$'
  #       throw new E.Intertype_ETEMPTBD '^tf@7^', "found illegal key '$'"
  #     nkey    = key[ 1 .. ]
  #     fields ?= {}
  #     if fields[ key ]?
  #       throw new E.Intertype_ETEMPTBD '^tf@8^', "found duplicate key #{rpr key}"
  #     delete dsc[ key ]
  #     fields[ nkey ] = field_dsc
  #   #.......................................................................................................
  #   if fields?
  #     dsc.fields  = fields
  #     dsc.isa    ?= 'object'
  #   #.......................................................................................................
  #   if dsc.fields?
  #     nr = 0
  #     unless types.isa.object dsc.fields
  #       throw new E.Intertype_ETEMPTBD '^tf@8^', \
  #         "expected an object for `field` property, got a #{rpr types.type_of dsc.fields}"
  #     for fieldname, field_dsc of dsc.fields
  #       if ( types.type_of field_dsc ) is 'text'
  #         hedges    = @hub._split_hedgerow_text field_dsc
  #         field_dsc = do ( fieldname, field_dsc, hedges ) =>
  #           H.nameit field_dsc, ( x ) -> @_isa hedges..., x[ fieldname ]
  #       if ( type = types.type_of field_dsc ) is 'function'
  #         nr++
  #         name_of_isa = if field_dsc.name in @cfg.rename then '#{nr}' else field_dsc.name
  #         dsc.fields[ fieldname ] = H.nameit "#{dsc.name}.#{fieldname}:#{name_of_isa}", field_dsc.bind @hub
  #       else
  #         throw new E.Intertype_ETEMPTBD '^tf@8^', "expected a text or a function for field description, got a #{rpr type}"
  #   #.......................................................................................................
  #   return null

  # #---------------------------------------------------------------------------------------------------------
  # _test_from_hedgepath: ( hedgepath ) ->
  #   hedges = @hub._split_hedgerow_text hedgepath
  #   hedges = hedgepath.split @hub.cfg.sep
  #   H.nameit hedgepath, ( x ) -> @_isa hedges..., x


  # #=========================================================================================================
  # #
  # #---------------------------------------------------------------------------------------------------------
  # _create_test_walker: ( dsc ) ->
  #   has_extras  = null
  #   hub         = @hub
  #   if ( test_for_extras = not dsc.extras )
  #     has_extras = @_create_has_extras dsc
  #   #.......................................................................................................
  #   return ( x ) ->
  #     R = do =>
  #       #.....................................................................................................
  #       hub.state.isa_depth++
  #       R = @isa x
  #       # debug '^767-1^', dsc
  #       # debug '^767-1^', hub.state
  #       # debug '^767-1^', { x, R, }
  #       hub.push_hedgeresult [ '▲tw2', hub.state.isa_depth - 1, @isa.name, x, R, ]
  #       if ( R is false ) or ( R isnt true )
  #         hub.state.isa_depth--; return R
  #       #.....................................................................................................
  #       if test_for_extras
  #         if has_extras x
  #           ### TAINT return value, recorded value should both be `false` ###
  #           # debug '^767-2^', dsc, x
  #           hub.push_hedgeresult [ '▲tw3', hub.state.isa_depth, has_extras.name, x, true, ]
  #           hub.state.isa_depth--; return false
  #       #.....................................................................................................
  #       for _, f of @fields
  #         R = f x
  #         # debug '^767-3^', dsc, x
  #         hub.push_hedgeresult [ '▲tw5', hub.state.isa_depth, f.name, x, R, ]
  #         if ( R is false ) or ( R isnt true )
  #           hub.state.isa_depth--; return R
  #       #.....................................................................................................
  #       hub.state.isa_depth--
  #       return true
  #     return R

  # #---------------------------------------------------------------------------------------------------------
  # _create_has_extras: ( dsc ) ->
  #   default_keys = new Set Object.keys dsc.default
  #   R = ( x ) ->
  #     x_keys = new Set Object.keys x
  #     if ( extra_keys = GUY.sets.subtract x_keys, default_keys ).size isnt 0
  #       @state.extra_keys = [ extra_keys..., ]
  #       return true
  #     return false
  #   return H.nameit "#{dsc.name}:has_extras", R.bind @hub


############################################################################################################
@Type_factory = Type_factory


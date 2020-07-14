
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERTEXT/DEMO-SLAB-BASED-TYPESETTING'
debug                     = CND.get_logger 'debug',     badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
help                      = CND.get_logger 'help',      badge
warn                      = CND.get_logger 'warn',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
jr                        = JSON.stringify
# test                      = require 'guy-test'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  cast
  type_of }               = types
SP                        = require '../../../apps/steampipes'
{ $
  $async
  $watch
  $show
  $drain }                = SP.export()
INTERTEXT                 = require '../../../apps/intertext'


#-----------------------------------------------------------------------------------------------------------
compute_naive_ascii_monospace_width = ( metrics, slab ) ->
  ### NOTE Implementation of a very crude estimate of visual string width that assigns each codepoint a
  width of `1` (which is OK for much of unaccented Latin, Cyrillic, Greek and so on but wrong for
  combining marks, CJK, Indic Scripts and so on). For demonstration purposes, we iterate over single
  characters and add up their individual lengths; more precise algorithms might use e.g. Harfbuzz and
  arrive at values per slab, ignoring the individual character widths altogether which may or may
  not add up to the resulting width because of diacritics, ligatures, kerning and so on. ###
  width     = 0
  fragment  = ''
  for chr, idx in chrs = Array.from slab
    fragment               += chr
    width                  += ( metrics.widths[ chr ] ?= 1 )
    metrics.widths[ chr ]  ?= width
  # metrics.widths[ slab ] = width ### NOTE setting of slab width done implicitly ###
  return width

#-----------------------------------------------------------------------------------------------------------
@demo_looping = ( text ) -> new Promise ( resolve, reject ) =>
  #.........................................................................................................
  text      = INTERTEXT.HYPH.hyphenate text
  sjs       = INTERTEXT.SLABS.slabjoints_from_text text
  #.........................................................................................................
  ### NOTES

  * The widths in `metrics.widths` are to be filled by `compute_width()`;
  * the catalog may be DB-backed to avoid re-computation of known metrics.
  * `metrics.line_width` is the wiidth of the line to be typeset next; its units are arbitrary but must be
    identical to those used in `metrics.widths` in order to make sense.

  ###
  metrics =
    compute_width:    compute_naive_ascii_monospace_width
    line_width:       20
    widths:           { 'a': 1, }
  #.........................................................................................................
  ### The crib is where the preset lines go; it may be modified later when it is found that width estimates
  were incorrect: ###
  crib =
    segments: {}
    lineup:   []
    galley:   []
  #.........................................................................................................
  get_width = ( metrics, slab ) -> metrics.widths[ slab ] ?= metrics.compute_width metrics, slab
  #.........................................................................................................
  ### Collecting slab lengths: ###
  for segment in sjs.segments
    [ slab, joint, ]  = INTERTEXT.SLABS.text_and_joint_from_segment segment
    width             = get_width metrics, slab
    debug ( slab.padEnd 10 ), width
    switch joint
      when '='
        unless ( msegment = crib.segments[ segment ] )?
          msegment                  = { joint, '#': { slab, width, }, }
          slab                     += '-'
          width                     = get_width metrics, slab
          msegment[ '-' ]           = { slab, width, }
          crib.segments[ segment ]  = msegment
      when '#', '°'
        msegment = crib.segments[ segment ] ?= { joint, slab, [joint]: { slab, width, }, }
      else
        throw new Error "^xxx/demo@4459^ unknown joint #{rpr joint}"
    debug msegment
    # cribslab          = new_cribslab crib, slab, joint, width
    # crib.segments[ segments ] =
    crib.lineup.push msegment
  #.........................................................................................................
  get_next_line = ( crib, current_line = null ) ->
    crib.galley.push current_line if current_line? and current_line.segments.length > 0
    return { $key: '^line', width: 0, segments: [], }
  #.........................................................................................................
  ### Distributing lineup over lines: ###
  line        = get_next_line crib
  loop
    break unless ( msegment = crib.lineup.shift() )?
    switch msegment.joint
      when '#'
        ### TAINT code duplication ###
        if line.width + msegment[ '#' ].width <= metrics.line_width
          line.segments.push msegment
          line.width += msegment[ '#' ].width
        else
          line = get_next_line crib, line
          line.segments.push msegment
          line.width += msegment[ '#' ].width
      when '°'
        ### TAINT code duplication ###
        if line.width + msegment[ '°' ].width <= metrics.line_width
          line.segments.push msegment
          line.width += msegment[ '°' ].width
        else
          line = get_next_line crib, line
          line.segments.push msegment
          line.width += msegment[ '°' ].width
      else
        warn "^xxx/demo@4460^ unknown joint #{rpr msegment,joint}"
        # throw new Error "^xxx/demo@4460^ unknown joint #{rpr msegment,joint}"
  get_next_line crib, line
  #.........................................................................................................
  help '^337637^', CND.inspect sjs
  help '^337637^', CND.inspect crib.segments
  help '^337637^', CND.inspect crib
  help '^337637^', rpr metrics
  # for slab, width of metrics.widths
  #   help '^337637^', ( slab.padEnd 20 ), width
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_piping = ( text ) -> new Promise ( resolve, reject ) =>
  #.........................................................................................................
  source    = [ text, ]
  pipeline  = []
  pipeline.push source
  pipeline.push $ ( text, send ) -> send INTERTEXT.HYPH.hyphenate text
  pipeline.push $ ( text, send ) ->
    send INTERTEXT.SLABS.slabjoints_from_text text
  pipeline.push $show()
  pipeline.push $drain -> resolve()
  #.........................................................................................................
  SP.pull pipeline...
  return null


############################################################################################################
if module is require.main then do =>

  text = """Hercules (/ˈhɜːrkjuliːz, -jə-/) is a Roman hero and god. He was the Roman equivalent of the
  Greek divine hero Heracles, who was the son of Zeus (Roman equivalent Jupiter) and the mortal Alcmene. In
  classical mythology, Hercules is famous for his strength and for his numerous far-ranging adventures."""
  text = "very short example"
  text = "Zentral/Dezentral, Innenorientierung/Kundenzentrierung und Fremdsteuerung/Selbstverantwortung"
  text = text.replace /\n/g, ' '
  text = text.replace /\s+/g, ' '
  # await @demo_looping text
  await @demo_piping text












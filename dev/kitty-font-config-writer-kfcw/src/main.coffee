


'use strict'

############################################################################################################
CND                       = require 'cnd'
badge                     = 'kittyfonts'
rpr                       = CND.rpr
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
hex                       = ( n ) -> ( n.toString 16 ).toUpperCase().padStart 4, '0'
LAP                       = require '../../../apps/interlap'
{ type_of
  isa
  validate
  equals    }             = LAP.types.export()


#-----------------------------------------------------------------------------------------------------------
to_width = ( text, width ) ->
  ### TAINT use `to_width` module ###
  validate.text text
  validate.positive_integer width
  return text[ .. width ].padEnd width, ' '

#===========================================================================================================
# PERTAINING TO SPECIFIC SETTINGS / FONT CHOICES
#-----------------------------------------------------------------------------------------------------------
S =
  # source_path:  '../../../assets/write-font-configuration-for-kitty-terminal.sample-data.json'
  paths:
    # configured_cid_ranges:  '../../../../ucdb/cfg/styles-codepoints-and-fontnicks.txt'
    configured_cid_ranges:  '../../../assets/ucdb/styles-codepoints-and-fontnicks.short.txt'
    cid_ranges_by_rsgs:     '../../../../ucdb/cfg/rsgs-and-blocks.txt'

  psname_by_fontnicks:
    babelstonehan:              'BabelStoneHan'
    cwtexqheibold:              'cwTeXQHei-Bold'
    dejavuserif:                'DejaVuSerif'
    hanaminaotf:                'HanaMinA'
    hanaminbotf:                'HanaMinB'
    ipamp:                      'IPAPMincho'
    jizurathreeb:               'jizura3b'
    nanummyeongjo:              'NanumMyeongjo'
    sunexta:                    'Sun-ExtA'
    thtshynpone:                'TH-Tshyn-P1'
    thtshynptwo:                'TH-Tshyn-P2'
    thtshynpzero:               'TH-Tshyn-P0'
    umingttcone:                'UMingCN'
    # @default
    # asanamath
    # ebgaramondtwelveregular:    ''
    # hanaminexatwootf:           ''
    lmromantenregular:          'Iosevka-Slab'
    iosevkaslab:                'Iosevka-Slab'
    # sourcehanserifheavytaiwan:  ''
    # unifonttwelve:              ''
    lastresort:                 'LastResort'

  illegal_codepoints: [ # see https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Special_code_points
    [   0x0000,   0x0000, ]
    [   0xd800,   0xdfff, ] # surrogates
    [   0xfdd0,   0xfdef, ]
    [   0xfffe,   0xffff, ]
    [  0x1fffe,  0x1ffff, ]
    [  0x2fffe,  0x2ffff, ]
    [  0x3fffe,  0x3ffff, ]
    [  0x4fffe,  0x4ffff, ]
    [  0x5fffe,  0x5ffff, ]
    [  0x6fffe,  0x6ffff, ]
    [  0x7fffe,  0x7ffff, ]
    [  0x8fffe,  0x8ffff, ]
    [  0x9fffe,  0x9ffff, ]
    [  0xafffe,  0xaffff, ]
    [  0xbfffe,  0xbffff, ]
    [  0xcfffe,  0xcffff, ]
    [  0xdfffe,  0xdffff, ]
    [  0xefffe,  0xeffff, ]
    [  0xffffe,  0xfffff, ]
    [ 0x10fffe, 0x10ffff, ] ]


#===========================================================================================================
# GENERIC STUFF
#-----------------------------------------------------------------------------------------------------------
cid_range_pattern = ///^ 0x (?<first_cid_txt> [0-9a-fA-F]+ ) \.\. 0x (?<last_cid_txt> [0-9a-fA-F]+ ) $ ///
parse_cid_hex_range_txt = ( cid_range_txt ) ->
  unless ( match = cid_range_txt.match cid_range_pattern )?
    throw new Error "^33736^ illegal line #{rpr line} (unable to parse CID range #{rpr cid_range_txt})"
  { first_cid_txt
    last_cid_txt  } = match.groups
  first_cid         = parseInt first_cid_txt, 16
  last_cid          = parseInt last_cid_txt,  16
  return [ first_cid, last_cid, ]

#-----------------------------------------------------------------------------------------------------------
segment_from_cid_hex_range_txt = ( cid_range_txt ) -> new LAP.Segment parse_cid_hex_range_txt cid_range_txt

#-----------------------------------------------------------------------------------------------------------
@_read_cid_ranges_by_rsgs = ( settings ) ->
  return R if ( R = settings.cid_ranges_by_rsgs )?
  R                 = settings.cid_ranges_by_rsgs = {}
  source_path       = PATH.resolve PATH.join __dirname, settings.paths.cid_ranges_by_rsgs
  lines             = ( FS.readFileSync source_path, { encoding: 'utf-8', } ).split '\n'
  for line in lines
    line = line.replace /^\s+$/g, ''
    continue if ( line.length is 0 ) or ( /^\s*#/.test line )
    [ icgroup, rsg, is_cjk_txt, cid_range_txt, range_name..., ] = line.split /\s+/
    continue if rsg.startsWith 'u-x-'
    R[ rsg ] = segment_from_cid_hex_range_txt cid_range_txt
  return R

# #-----------------------------------------------------------------------------------------------------------
# @_read_illegal_codepoints = ( settings ) ->
#   return R if isa.interlap ( R = settings.illegal_codepoints )
#   R = settings.illegal_codepoints = new LAP.Interlap settings.illegal_codepoints
#   return R

#-----------------------------------------------------------------------------------------------------------
@_read_configured_cid_ranges = ( settings ) ->
  return R if ( R = settings.configured_cid_ranges )?
  cid_ranges_by_rsgs  = @_read_cid_ranges_by_rsgs settings
  R                   = settings.configured_cid_ranges = []
  source_path         = PATH.resolve PATH.join __dirname, settings.paths.configured_cid_ranges
  lines               = ( FS.readFileSync source_path, { encoding: 'utf-8', } ).split '\n'
  unknown_fontnicks   = new Set()
  unknown_rsgs        = new Set()
  for line in lines
    line = line.replace /^\s+$/g, ''
    continue if ( line.length is 0 ) or ( /^\s*#/.test line )
    [ styletag, cid_literal, fontnick, glyphstyle..., ] = line.split /\s+/
    glyphstyle = glyphstyle.join ' '
    validate.nonempty_text styletag
    validate.nonempty_text cid_literal
    validate.nonempty_text fontnick
    validate.text glyphstyle
    # continue unless fontnick?
    # continue unless first_cid?
    # continue unless last_cid?
    continue unless styletag is '+style:ming'
    continue if     glyphstyle? and /\bglyph\b/.test glyphstyle
    #.......................................................................................................
    unless ( psname = settings.psname_by_fontnicks[ fontnick ] )?
      unless unknown_fontnicks.has fontnick
        unknown_fontnicks.add fontnick
        warn "unknown fontnick #{rpr fontnick}"
      continue
    #.......................................................................................................
    ### TAINT the below as function ###
    #.......................................................................................................
    if cid_literal is '*'
      segment = new LAP.Segment [ 0x000000, 0x10ffff, ]
    #.......................................................................................................
    else if ( cid_literal.startsWith "'" ) and ( cid_literal.endsWith "'" )
      validate.chr chr  = cid_literal[ 1 ... cid_literal.length - 1 ]
      first_cid         = chr.codePointAt 0
      last_cid          = first_cid
      segment           = new LAP.Segment [ first_cid, last_cid, ]
    #.......................................................................................................
    else if ( cid_literal.startsWith 'rsg:' )
      rsg = cid_literal[ 4 .. ]
      validate.nonempty_text rsg
      unless ( segment = cid_ranges_by_rsgs[ rsg ] )?
        unknown_rsgs.add rsg
        warn "unknown rsg #{rpr rsg}"
        continue
    #.......................................................................................................
    else
      segment = segment_from_cid_hex_range_txt cid_literal
    #.......................................................................................................
    ### NOTE for this particular file format, we could use segments inbstead of laps since there can be only
    one segment per record; however, for consistency with those cases where several disjunct segments per
    record are allowed, we use laps. ###
    ### TAINT consider to use a non-committal name like `cids` instead of `lap`, which is bound to a
    particular data type; allow to use segments and laps for this and similar attributes. ###
    lap = new LAP.Interlap segment
    R.push { fontnick, psname, lap, }
  return R

#-----------------------------------------------------------------------------------------------------------
@_read_disjunct_cid_ranges = ( settings ) ->
  overlaps            = @_read_configured_cid_ranges settings
  R                   = settings.disjunct_cid_ranges = []
  org_by_fontnicks    = {}
  exclusion           = new LAP.Interlap settings.illegal_codepoints
  for idx in [ overlaps.length - 1 .. 0 ] by -1
    rule                = overlaps[ idx ]
    { fontnick
      psname
      lap       }       = rule
    disjunct            = LAP.difference  lap, exclusion
    exclusion           = LAP.union       lap, exclusion
    R.unshift { fontnick, psname, lap: disjunct, }
  return R

#-----------------------------------------------------------------------------------------------------------
@write_font_configuration_for_kitty_terminal = ( settings ) ->
  fontnicks_and_laps = @_read_disjunct_cid_ranges S
  # debug '^443^', fontnicks_and_laps
  for disjunct_range in fontnicks_and_laps
    { fontnick
      psname
      lap     } = disjunct_range
    # debug lap
    if lap.size is 0
      filler = ( '-/-' ).padEnd 30
      echo "# symbol_map      #{filler} (#{psname})"
    else
      for segment in lap
        # help fontnick, LAP.as_unicode_range lap
        unicode_range_txt = ( LAP.as_unicode_range segment ).padEnd 30
        echo "symbol_map      #{unicode_range_txt} #{psname}"
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo = ->
  pseudo_css_configuration = [
    [ 'font1', '[B-H] [J] [L] [N-X]          ', ]
    [ 'font2', '[B-D]                        ', ]
    [ 'font3', '[G-I]                        ', ]
    [ 'font4', '[M-Q]                        ', ]
    [ 'font5', '[M] [O-T]                    ', ]
    [ 'font6', '[M] [U] [X-Y]                ', ]
    ]

  #-----------------------------------------------------------------------------------------------------------
  overlapping_laps_from_pseudo_css = ( pseudo_css ) ->
    R = []
    for [ fontnick, ranges_txt, ] in pseudo_css
      matches         = ranges_txt.matchAll /// \[ (?<range_literal> [^ \] ]+ ) \]///g
      range_literals  = ( match.groups.range_literal for match from matches )
      range_endpoints = ( range_literal.trim().split /\s*-\s*/ for range_literal in range_literals )
      segments        = []
      for range_endpoint in range_endpoints
        first_chr = range_endpoint[ 0 ]
        last_chr  = range_endpoint[ 1 ] ? first_chr
        lo        = first_chr.codePointAt 0
        hi        = last_chr.codePointAt  0
        segments.push [ lo, hi, ]
      lap = new LAP.Interlap segments
      R.push [ fontnick, lap, ]
    return R

  #.........................................................................................................
  chr_from_cid = ( cid ) -> String.fromCodePoint cid

  #.........................................................................................................
  segment_as_demo_text = ( segment ) ->
    validate.segment segment
    return "[#{chr_from_cid segment.lo}]" if segment.lo is segment.hi
    return "[#{chr_from_cid segment.lo}-#{chr_from_cid segment.hi}]"

  #.........................................................................................................
  interlap_as_demo_text = ( interlap ) ->
    validate.interlap interlap
    return ( segment_as_demo_text s for s in interlap ).join ' '

  #.........................................................................................................
  overlaps = overlapping_laps_from_pseudo_css pseudo_css_configuration
  for [ fontnick, lap, ] from overlaps
    fontnick_txt  = to_width ( fontnick                   ), 20
    lap_txt       = to_width ( interlap_as_demo_text lap  ), 20
    info ( CND.lime fontnick_txt ), ( CND.gold lap_txt )
  #.........................................................................................................
  info()
  exclusion   = new LAP.Interlap()
  disjuncts   = []
  exclusions  = []
  for idx in [ overlaps.length - 1 .. 0 ] by -1
    [ fontnick, lap, ]  = overlaps[ idx ]
    disjunct            = LAP.difference  lap, exclusion
    exclusion           = LAP.union       lap, exclusion
    disjuncts.unshift disjunct
    exclusions.unshift exclusion
  for exclusion in exclusions
    info ( CND.yellow interlap_as_demo_text exclusion )
  for [ fontnick, lap, ], idx in overlaps
    disjunct      = disjuncts[ idx ]
    fontnick_txt  = to_width ( fontnick                       ), 20
    lap_txt       = to_width ( interlap_as_demo_text lap      ), 20
    disjunct_txt  = to_width ( interlap_as_demo_text disjunct ), 20
    info ( CND.lime fontnick_txt ), ( CND.gold lap_txt ), ( CND.blue disjunct_txt ), ( CND.steel LAP.as_unicode_range disjunct )
    for segment in disjunct
      unicode_range = LAP.as_unicode_range segment
      help "symbol_map \t#{unicode_range} \t#{fontnick}"
  disjuncts_uranges = ( LAP.as_unicode_range d for d in disjuncts ).join '\n'
  validate.true equals disjuncts_uranges, """U+0045-U+0046,U+004a-U+004a,U+004c-U+004c,U+0056-U+0057
    U+0042-U+0044
    U+0047-U+0049
    U+004e-U+004e
    U+004f-U+0054
    U+004d-U+004d,U+0055-U+0055,U+0058-U+0059"""
  return null

#===========================================================================================================
# DATA STRUCTURE DEMOS
#-----------------------------------------------------------------------------------------------------------
@demo_cid_ranges_by_rsgs = ->
  echo CND.steel CND.reverse "CID Ranges by RSGs".padEnd 108
  for rsg, segment of @_read_cid_ranges_by_rsgs S
    continue unless /kana|kata|hira/.test rsg
    rsg_txt   = ( rsg.padEnd 25 )
    range_txt = LAP.as_unicode_range segment
    echo ( CND.grey "rsg and CID range" ), ( CND.blue rsg_txt ), ( CND.lime range_txt )
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_configured_ranges = ->
  echo CND.steel CND.reverse "Configured CID Ranges".padEnd 108
  # debug @_read_configured_cid_ranges S
  for configured_range in @_read_configured_cid_ranges S
    { fontnick
      psname
      lap     } = configured_range
    font_txt  = ( psname.padEnd 25 )
    range_txt = LAP.as_unicode_range lap
    # echo ( CND.grey "configured range" ), ( CND.yellow configured_range )
    echo ( CND.grey "configured range" ), ( CND.yellow font_txt ), ( CND.lime range_txt )
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_disjunct_ranges = ->
  echo CND.steel CND.reverse "Disjunct CID Ranges".padEnd 108
  for disjunct_range in @_read_disjunct_cid_ranges S
    { fontnick
      psname
      lap     } = disjunct_range
    font_txt  = ( psname.padEnd 25 )
    if lap.size is 0
      echo ( CND.grey "disjunct range" ), ( CND.grey font_txt ), ( CND.grey "no codepoints" )
    else
      for segment in lap
        range_txt = LAP.as_unicode_range segment
        echo ( CND.grey "disjunct range" ), ( CND.yellow font_txt ), ( CND.lime range_txt )
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_kitty_font_config = ->
  echo CND.steel CND.reverse "Kitty Font Config".padEnd 108
  @write_font_configuration_for_kitty_terminal S


############################################################################################################
if module is require.main then do =>
  @demo_cid_ranges_by_rsgs()
  @demo_configured_ranges()
  @demo_disjunct_ranges()
  @demo_kitty_font_config()
  #.........................................................................................................
  # @write_font_configuration_for_kitty_terminal S
  # demo()






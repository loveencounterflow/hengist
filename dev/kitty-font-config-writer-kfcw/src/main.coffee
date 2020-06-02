


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
OS                        = require 'os'
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
  # write_pua_sample: false
  write_pua_sample:     true
  write_ranges_sample:  true
  # source_path:  '../../../assets/write-font-configuration-for-kitty-terminal.sample-data.json'
  paths:
    # configured_cid_ranges:  '../../../../ucdb/cfg/styles-codepoints-and-fontnicks.txt'
    configured_cid_ranges:  '../../../assets/ucdb/styles-codepoints-and-fontnicks.short.txt'
    cid_ranges_by_rsgs:     '../../../../ucdb/cfg/rsgs-and-blocks.txt'
    kitty_fonts_conf:       '~/.config/kitty/kitty-fonts.conf'

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

  illegal_codepoints: null
  # illegal_codepoints: [ # see https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Special_code_points
  #   [   0x0000,   0x0000, ] # zero
  #   [   0x0001,   0x001f, ] # lower controls
  #   [   0x007f,   0x009f, ] # higher controls
  #   [   0xd800,   0xdfff, ] # surrogates
  #   [   0xfdd0,   0xfdef, ]
  #   [   0xfffe,   0xffff, ]
  #   [  0x1fffe,  0x1ffff, ]
  #   [  0x2fffe,  0x2ffff, ]
  #   [  0x3fffe,  0x3ffff, ]
  #   [  0x4fffe,  0x4ffff, ]
  #   [  0x5fffe,  0x5ffff, ]
  #   [  0x6fffe,  0x6ffff, ]
  #   [  0x7fffe,  0x7ffff, ]
  #   [  0x8fffe,  0x8ffff, ]
  #   [  0x9fffe,  0x9ffff, ]
  #   [  0xafffe,  0xaffff, ]
  #   [  0xbfffe,  0xbffff, ]
  #   [  0xcfffe,  0xcffff, ]
  #   [  0xdfffe,  0xdffff, ]
  #   [  0xefffe,  0xeffff, ]
  #   [  0xffffe,  0xfffff, ]
  #   [ 0x10fffe, 0x10ffff, ] ]

  illegal_codepoint_patterns: [
    ///^\p{Cc}$///u # Control
    ///^\p{Cs}$///u # Surrogate
    # ///^\p{Cn}$///u # Unassigned
    ]

#===========================================================================================================
# GENERIC STUFF
#-----------------------------------------------------------------------------------------------------------
cid_range_pattern = ///^ 0x (?<first_cid_txt> [0-9a-fA-F]+ ) \.\. 0x (?<last_cid_txt> [0-9a-fA-F]+ ) $ ///
parse_cid_hex_range_txt = ( cid_range_txt ) ->
  unless ( match = cid_range_txt.match cid_range_pattern )?
    throw new Error "^33736^ unable to parse CID range #{rpr cid_range_txt}"
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
  for line, line_idx in lines
    line = line.replace /^\s+$/g, ''
    continue if ( line.length is 0 ) or ( /^\s*#/.test line )
    [ icgroup, rsg, is_cjk_txt, cid_range_txt, range_name..., ] = line.split /\s+/
    continue if rsg.startsWith 'u-x-'
    try
      R[ rsg ] = segment_from_cid_hex_range_txt cid_range_txt
    catch error
      throw new Error "^4445^ illegal line: #{error.message}, linenr: #{line_idx + 1}, line: #{rpr line}"
  return R

# #-----------------------------------------------------------------------------------------------------------
# @_read_illegal_codepoints = ( settings ) ->
#   return R if isa.interlap ( R = settings.illegal_codepoints )
#   R = settings.illegal_codepoints = new LAP.Interlap settings.illegal_codepoints
#   return R

#-----------------------------------------------------------------------------------------------------------
@_read_configured_cid_ranges = ( settings ) ->
  cid_ranges_by_rsgs  = @_read_cid_ranges_by_rsgs settings
  R                   = settings.configured_cid_ranges = []
  source_path         = PATH.resolve PATH.join __dirname, settings.paths.configured_cid_ranges
  lines               = ( FS.readFileSync source_path, { encoding: 'utf-8', } ).split '\n'
  unknown_fontnicks   = new Set()
  unknown_rsgs        = new Set()
  for line, line_idx in lines
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
      debug '^778^', { styletag, cid_literal, fontnick, }
      settings.default_fontnick ?= fontnick
      settings.default_psname   ?= psname
      continue
      # segment = new LAP.Segment [ 0x000000, 0x10ffff, ]
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
      try
        segment = segment_from_cid_hex_range_txt cid_literal
      catch error
        throw new Error "^4445^ illegal line: #{error.message}, linenr: #{line_idx + 1}, line: #{rpr line}"
    #.......................................................................................................
    ### NOTE for this particular file format, we could use segments instead of laps since there can be only
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
  exclusion           = @_read_illegal_codepoints settings
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
@_read_disjunct_cid_segments = ( settings ) ->
  R = []
  for disjunct_range in @_read_disjunct_cid_ranges settings
    { fontnick
      psname
      lap     } = disjunct_range
    for segment in lap
      continue if segment.size is 0 # should never happen
      R.push { fontnick, psname, segment, }
  R.sort ( a, b ) ->
    return -1 if a.segment.lo < b.segment.lo
    return +1 if a.segment.lo < b.segment.lo
    return  0
  return R

#-----------------------------------------------------------------------------------------------------------
@_write_method_from_path = ( settings, path = null ) ->
  return echo unless path?
  validate.nonempty_text path
  path = PATH.join OS.homedir(), path.replace /^~/, ''
  try FS.statSync path catch error
    throw error unless error.code is 'ENOENT'
    warn "^729^target path #{rpr path} does not exist"
    throw error
  FS.writeFileSync path, ''
  return write = ( line ) ->
    validate.text line
    FS.appendFileSync path, line + '\n'

#-----------------------------------------------------------------------------------------------------------
@_write_ranges_sample = ( settings, write ) ->
  for disjunct_range in settings.fontnicks_and_segments
    { fontnick
      psname
      segment } = disjunct_range
    # help fontnick, LAP.as_unicode_range lap
    unicode_range_txt = ( LAP.as_unicode_range segment ).padEnd 30
    sample            = ( String.fromCodePoint c for c in [ segment.lo .. segment.hi ][ .. 30 ] )
    sample_txt        = sample.join ''
    psname_txt        = psname.padEnd 30
    write "# symbol_map      #{unicode_range_txt} #{psname_txt} # #{sample_txt}"

#-----------------------------------------------------------------------------------------------------------
@_write_pua_sample = ( settings, write ) ->
  for row_cid in [ 0xe000 .. 0xe3a0 ] by 0x10
    row = []
    for col_cid in [ 0x00 .. 0x0f ]
      cid = row_cid + col_cid
      row.push String.fromCodePoint cid
    row_cid_txt = "U+#{( row_cid.toString 16 ).padStart 4, '0'}"
    write "# #{row_cid_txt} #{row.join ''}"
  @_write_special_interest_sample settings, write

#-----------------------------------------------------------------------------------------------------------
@_write_special_interest_sample = ( settings, write ) ->
  write "# x𒇷x"
  write "# x﷽x"

#-----------------------------------------------------------------------------------------------------------
@write_font_configuration_for_kitty_terminal = ( settings ) ->
  write                           = @_write_method_from_path settings, settings.paths.kitty_fonts_conf
  settings.fontnicks_and_segments = @_read_disjunct_cid_segments settings
  @_write_ranges_sample settings, write if settings.write_ranges_sample ? false
  @_write_pua_sample    settings, write if settings.write_pua_sample    ? false
  #.........................................................................................................
  unless settings.default_psname?
    warn "^334^ no default font configured"
    urge "^334^ add settings.default_fontnick"
    urge "^334^ or add CID range with asterisk in #{PATH.resolve settings.paths.configured_cid_ranges}"
  else
    write "font_family      #{settings.default_psname}"
    write "bold_font        auto"
    write "italic_font      auto"
    write "bold_italic_font auto"
  #.........................................................................................................
  for disjunct_range in settings.fontnicks_and_segments
    { fontnick
      psname
      segment } = disjunct_range
    ### !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ###
    ### exclude default font: ###
    continue if psname is 'Iosevka-Slab'
    ### !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ###
    unicode_range_txt = ( LAP.as_unicode_range segment ).padEnd 30
    write "symbol_map      #{unicode_range_txt} #{psname}"
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@write_whisk_character_tunnel = ( settings ) ->
  # https://www.aivosto.com/articles/control-characters.html#APC
  chr_ranges  = "[\\ue000-\\uefff]"
  source      = """#!/usr/bin/env node
  const pattern = /(#{chr_ranges})/g;
  const rl      = require( 'readline' ).createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false })

  rl.on( 'line', ( line ) => {
    return process.stdout.write( line.replace( pattern, '$1 ' ) + '\\n' ); } );
  """
  # #!/usr/bin/env node
  # const pattern_2 = /([\ue000-\uefff])/ug;
  # const pattern_3 = /([\ufb50-\ufdff])/ug;
  # const pattern_7 = /([\u{12000}-\u{123ff}])/ug;
  # const rl      = require( 'readline' ).createInterface({
  #   input: process.stdin,
  #   output: process.stdout,
  #   terminal: false })

  # rl.on( 'line', ( line ) => {
  #   return process.stdout.write(
  #     line
  #       .replace( pattern_2, '$1 ' )
  #       .replace( pattern_3, '$1  ' )
  #       .replace( pattern_7, '$1      ' )
  #       + '\n' ); } );
  echo()
  echo source
  echo()
  # path = ???
  # FS.writeFileSync path, source
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

#-----------------------------------------------------------------------------------------------------------
@_read_illegal_codepoints = ( settings ) ->
  return R if ( R = settings.illegal_codepoints )?
  segments = []
  ranges = [
    { lo: 0x0000, hi: 0xe000, }
    { lo: 0xf900, hi: 0xffff, }
    # { lo: 0x10000, hi: 0x1ffff, }
    # { lo: 0x20000, hi: 0x2ffff, }
    # { lo: 0x30000, hi: 0x3ffff, }
    # { lo: 0x0000, hi: 0x10ffff, }
    ]
  for range in ranges
    prv_cid = null
    for cid in [ range.lo .. range.hi ]
      if settings.illegal_codepoint_patterns.some ( re ) -> re.test String.fromCodePoint cid
        segments.push [ cid, cid, ]
  R = settings.illegal_codepoints = new LAP.Interlap segments
  help "excluding #{R.size} codepoints"
  return R

#-----------------------------------------------------------------------------------------------------------
@demo_illegal_codepoints = ->
  lap = @_read_illegal_codepoints S
  for segment in lap
    urge LAP.as_unicode_range segment
  return null

############################################################################################################
if module is require.main then do =>
  # @demo_illegal_codepoints()
  # @demo_cid_ranges_by_rsgs()
  # @demo_configured_ranges()
  # @demo_disjunct_ranges()
  # @demo_kitty_font_config()
  #.........................................................................................................
  @write_font_configuration_for_kitty_terminal S
  @write_whisk_character_tunnel S
  # demo()
  # { freeze } = require 'letsfreezethat'
  # d = new Map()
  # d.set 42, { foo: 'bar', }
  # e = freeze d
  # info d
  # debug d is e
  # debug Object.isFrozen d
  # debug Object.isFrozen e
  # # e.set 42, false
  # info d
  # info e






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

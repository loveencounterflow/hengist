
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/SNIPPETS/EVOLUTIONARY-LINE-SPLITTING'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
{ new_datom
  lets
  select }                = DATOM.export()
#...........................................................................................................
# test                      = require 'guy-test'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  declare
  validate
  cast
  type_of }               = types.export()

#-----------------------------------------------------------------------------------------------------------
declare 'EVO_population', tests:
  "x is an object":                       ( x ) -> @isa.object x
  "x.players is a list_of EVO_player":    ( x ) -> @isa.list_of 'EVO_player', x.players

#-----------------------------------------------------------------------------------------------------------
declare 'EVO_player', tests:
  "x is an object":                       ( x ) -> @isa.object x
  "x.dna is a EVO_dna":                   ( x ) -> @isa.EVO_dna x.dna
  "x.score is a float":                   ( x ) -> @isa.float x.score

#-----------------------------------------------------------------------------------------------------------
declare 'EVO_dna', tests:
  "x is a nonempty_text":                 ( x ) -> @isa.nonempty_text x
  "x consists of letters, pipes, spaces": ( x ) -> /^[a-zA-Z.,|\x20]+$/.test x
  "no pipe symbol next to space":         ( x ) -> not /// ( \s [|] ) | ( [|] \s ) ///.test x

#-----------------------------------------------------------------------------------------------------------
@score_from_dna = ( line_width, dna ) ->
  validate.positive_integer line_width
  validate.EVO_dna dna
  R         = 0
  lines     = dna.split '|'
  last_idx  = lines.length - 1
  for line, line_idx in lines
    score         = 0
    is_last_line  = line_idx is last_idx
    delta         = line_width - line.length
    line_too_long = delta < 0
    # return null if line_too_long
    delta         = Math.abs delta
    exponent      = if line_too_long then 4 else 2
    score         = -( delta ** exponent )
    # if is_last_line
    #   if line_too_long
    #     score = -100 * delta ** 2
    #   else
    #     score = 0 # -10 * delta
    # else
    #   if line_too_long
    #     score = -100 * delta ** 2
    #   else
    #     score     = -10 * delta
    #     nxt_line  = lines[ line_idx ]
    #     match     = nxt_line.match /^[^\x20|]+/
    #     if ( match[ 0 ].length + line.length ) < line_width
    #       score = -500000
    R      += score
  # for line, line_idx in lines
  #   delta   = line_width - line.length
  #   if delta < 0  then  delta *= 1.5
  #   else                delta *= 1
  #   delta   = 0 if line_idx is last_idx and delta > 0
  #   delta   = delta ** 4
  #   score   = -delta
  #   R      += score
  return R / lines.length
  #   score  *= overshoot_factor
  # return ( R / lines.length ** 2 ) * 100

#-----------------------------------------------------------------------------------------------------------
@mutate_dna = ( dna ) ->
  validate.EVO_dna dna
  threshold   = 0.1
  lo          = 0
  hi          = dna.length
  separators  = [ '\x20', '|', ]
  for chr, idx in chrs = Array.from dna
    continue unless chr in separators
    continue unless Math.random() > threshold
    chrs[ idx ] = if chr is '\x20' then '|' else '\x20'
  return chrs.join ''


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo = ->
  dna = 'foo bar buzz|blah dang sux hey'


############################################################################################################
if module is require.main then do =>
  # await @_demo()
  # debug @score_from_dna line_width, 'xxx'
  # debug @score_from_dna line_width, 'xxx|xxx'
  # debug @score_from_dna line_width, 'xxx|xxx|xxx'
  # debug @score_from_dna line_width, 'xxx|xx|x|AAAxxx'
  # debug @score_from_dna line_width, 'xxx|xxxy|xxx'
  # debug @score_from_dna line_width, 'foo bar buzz a b'
  # debug @score_from_dna line_width, 'foo bar|buzz a b'
  # debug @score_from_dna line_width, 'foo|bar buzz|a b'
  # debug @score_from_dna line_width, 'foo|bar|buzz|a b'
  # debug @score_from_dna line_width, 'foo|bar|buzz|a|b'
  # prv_dna           = 'the best we can do is grappling on and on'
  prv_dna           = 'Based on the fitness we can tell which sentence is good and which one is not. For this example, a small fitness means a sentence has a small distance to the objective sentence, therefore, the smallest the fitness is, the better. We will try to minimize this fitness to get closer and closer to the objective sentence.'
  # prv_dna           = 'a few short words plus then a few more'
  # prv_dna           = 'ab cd ef gh ij kl mn op qr'
  # line_width        = 10 + Math.floor prv_dna.length / 5 + 0.5
  line_width        = 30
  prv_score         = @score_from_dna line_width, prv_dna
  info ( rpr prv_dna ), @score_from_dna line_width, prv_dna
  generation_count  = 1500
  last_active       = null
  active_count      = 0
  #.........................................................................................................
  for generation_idx in [ 0 .. generation_count ]
    nxt_dna   = @mutate_dna prv_dna
    nxt_score = @score_from_dna line_width, nxt_dna
    unless nxt_score? and nxt_score > prv_score
      # whisper ( rpr nxt_dna ), @score_from_dna line_width, nxt_dna
      continue
    active_count++
    last_active = generation_idx
    prv_dna     = nxt_dna
    prv_score   = nxt_score
    # urge ( rpr nxt_dna ), @score_from_dna line_width, nxt_dna
  #.........................................................................................................
  border = ( CND.yellow CND.reverse '│' )
  for line in lines = prv_dna.split '|'
    help border + ( CND.yellow CND.reverse line.padEnd line_width ) + border
  #.........................................................................................................
  info { last_active, active_count, }
  return null


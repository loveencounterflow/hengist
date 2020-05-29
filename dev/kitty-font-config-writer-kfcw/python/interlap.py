

#-----------------------------------------------------------------------------------------------------------
from _testing import Testing
from _testing import C
from _testing import debug
from _testing import urge
from _testing import help
from typing import NamedTuple
from typing import Union
from typing import Tuple
from typing import Iterable
from functools import total_ordering
class Interlap_error( TypeError, ValueError ): pass
def throw( message: str ) -> None: raise Interlap_error( message )
# from typing import NewType
# from typing import Any
from math import inf

#-----------------------------------------------------------------------------------------------------------
def isa( T, x ):
  ### thx to https://stackoverflow.com/a/49471187/7568091 ###
  ### TAINT This is much more complicated than it should be ###
  if getattr( T, '__origin__', None ) == Union: return isinstance( x, T.__args__ )
  return isinstance( x, T )

#-----------------------------------------------------------------------------------------------------------
@total_ordering
class Segment:
  def __init__( me, lo, hi ): me.lo = lo; me.hi = hi
  def __repr__( me ): return f"Segment( {me.lo}, {me.hi} )"
  def __iter__( me ): return iter( ( me.lo, me.hi ) )

  # #---------------------------------------------------------------------------------------------------------
  # def __cmp__( me, other ):
  #   if not isinstance( other, Segment ): throw( f"^786^ unable to compare a Segment with a {type( other )}" )
  #   if me.lo < other.lo: return -1
  #   if me.lo > other.lo: return +1
  #   if me.hi < other.hi: return -1
  #   if me.hi > other.hi: return +1
  #   return 0

  #---------------------------------------------------------------------------------------------------------
  def __lt__( me, other ):
    if not isinstance( other, Segment ): throw( f"^786^ unable to compare a Segment with a {type( other )}" )
    return ( me.lo < other.lo ) or ( me.hi < other.hi )

  #---------------------------------------------------------------------------------------------------------
  def __eq__( me, other ):
    if not isinstance( other, Segment ): return False
    return ( me.lo == other.lo ) and ( me.hi == other.hi )

# #-----------------------------------------------------------------------------------------------------------
# class Segment( NamedTuple ):
#   lo:   int
#   hi:   int

#-----------------------------------------------------------------------------------------------------------
class Lap( Tuple ): pass

#-----------------------------------------------------------------------------------------------------------
bi_int          = Tuple[ int, int ]
gen_segment     = Union[ Segment, bi_int, ]
# intinf          = Union[ int, inf, ]
intinf          = Union[ int, str ]
# Lap             = Tuple[ Segment ]
# opt_gen_segment = Union[ gen_segment, None, ]

#-----------------------------------------------------------------------------------------------------------
def new_segment( lohi: gen_segment ) -> Segment:
  if isinstance( lohi, Segment ): return lohi
  if len( lohi ) != 2:
    throw( f"expected a tuple of length 2, got one with length {len( lohi )}")
  lo, hi = lohi
  #.........................................................................................................
  if not isinstance( lo, int ): throw( f"expected an integer, got a {type( lo )}" )
  if not isinstance( hi, int ): throw( f"expected an integer, got a {type( hi )}" )
  if not lo <= hi: throw( f"expected lo <= hi, got {lo} and {hi}" )
  #.........................................................................................................
  return Segment( lo, hi, )

# #-----------------------------------------------------------------------------------------------------------
# def _new_lap( segments: Tup[ gen_segment ] ) -> Lap:
#   _segments: Tuple[ Segment ] = [ new_segment( s ) for s in segments ].sort()
#   return Lap( _segments )

#-----------------------------------------------------------------------------------------------------------
def new_lap( *P: Iterable[ gen_segment ] ) -> Lap: return merge_segments( *P )

#   _segments: Tuple[ Segment ] = [ new_segment( s ) for s in segments ].sort()
#   return Lap( _segments )


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
# class A:
# @classmethod ... def disjunct( cls, ... )
def disjunct( me: gen_segment, other: gen_segment ) -> bool:
  return _disjunct( new_segment( me ), new_segment( other ) )

#-----------------------------------------------------------------------------------------------------------
def overlaps( me: gen_segment, other: gen_segment ) -> bool:
  return _overlaps( new_segment( me ), new_segment( other ) )

#-----------------------------------------------------------------------------------------------------------
def union( me: gen_segment, other: gen_segment ) -> Lap:
  return _union( new_segment( me ), new_segment( other ) )


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
def _disjunct( me: Segment, other: Segment ) -> bool:
  return ( me.hi < other.lo ) or ( other.hi < me.lo )

#-----------------------------------------------------------------------------------------------------------
def _overlaps( me: Segment, other: Segment ) -> bool:
  return not ( ( me.hi < other.lo ) or ( other.hi < me.lo ) )

#-----------------------------------------------------------------------------------------------------------
def _union( me: Segment, other: Segment ) -> Lap:
  if _disjunct( me, other ): return new_lap( me, other )
  # return not ( ( me.hi < other.lo ) or ( other.hi < me.lo ) )
  return Lap()

#-----------------------------------------------------------------------------------------------------------
def merge_segments( *P: Tuple[ gen_segment ] ):
  if len( P ) == 0: return Lap()
  if len( P ) == 1: return Lap( [ new_segment( P[ 0 ] ), ] )
  if len( P ) == 2: return Lap( _merge_two_segments( new_segment( P[ 0 ] ), new_segment( P[ 1 ] ) ) )
  return Lap( _merge_segments( *P ) )

#-----------------------------------------------------------------------------------------------------------
def _merge_segments( *P: Tuple[ gen_segment ] ):
  if len( P ) == 0: return []
  if len( P ) == 1: return [ new_segment( P[ 0 ] ), ]
  if len( P ) == 2: return _merge_two_segments( new_segment( P[ 0 ] ), new_segment( P[ 1 ] ) )
  segments      = [ new_segment( s ) for s in P ]
  segments.sort()
  reference, \
  segments      = segments[ 0 ], segments[ 1 : ]
  R             = []
  idx           = -1
  last_idx      = len( segments ) - 1
  while True:
    idx += +1
    if idx > last_idx: break
    segment = segments[ idx ]
    if segment == reference: continue
    merged_segments = _merge_two_segments( reference, segment )
    if len( merged_segments ) > 1:
      R.append( merged_segments[ 0 ] )
      reference = merged_segments[ 1 ]
      continue
    reference = merged_segments[ 0 ]
  R.append( reference )
  return R

#-----------------------------------------------------------------------------------------------------------
def _merge_two_segments( a: gen_segment, b: gen_segment ):
  if a.lo > b.lo: a, b = b, a
  if b.lo > a.hi + 1: return [ a, b, ]
  return [ new_segment( ( a.lo, max( a.hi, b.hi ), ) ), ]

#-----------------------------------------------------------------------------------------------------------
def test() -> None:
  T = Testing()
  test_basics( T )
  test_sorting( T )
  test_overlaps_disjunct( T )
  # test_union( T )
  test_merge_two_segments( T )
  test_merge_more_segments( T )
  test_merge_segments( T )
  test_new_lap( T )
  T.report()

#-----------------------------------------------------------------------------------------------------------
def test_basics( T ) -> None:
  print( '^332-1^', 'test_basics' )
  T.eq( '^T1^', type( new_segment( ( 42, 48, ) ) ), Segment )
  T.ne( '^T2^', type( new_segment( ( 42, 48, ) ) ), tuple )
  T.eq( '^T3^', new_segment( ( 42, 48, ) ), Segment( 42, 48 ) )
  # T.ne( '^T4^', new_segment( ( 1, 1, ) ), ( 1, 1, ) )
  # try:    r = new_segment( ( False, True, ) )
  # except  Interlap_error as e: pass
  # else:   T.fail( '^T5^', f"should not be acceptable: {r}" )

#-----------------------------------------------------------------------------------------------------------
def test_sorting( T ) -> None:
  print( '^332-1^', 'test_sorting' )
  urge( '^334^', Segment( 3, 4 ) < Segment( 4, 4 ) )

#-----------------------------------------------------------------------------------------------------------
def test_overlaps_disjunct( T ) -> None:
  print( '^332-1^', 'test_overlaps_disjunct' )
  #.........................................................................................................
  s1 = new_segment( ( 20, 29, ) )
  s2 = new_segment( ( 10, 19, ) )
  s3 = new_segment( ( 10, 20, ) )
  s4 = new_segment( ( 10, 21, ) )
  s5 = new_segment( ( 28, 39, ) )
  s6 = new_segment( ( 29, 39, ) )
  s7 = new_segment( ( 30, 39, ) )
  s8 = new_segment( ( 31, 39, ) )
  #.........................................................................................................
  T.eq( '^T6^',  overlaps( s1, s1 ), True   )
  T.eq( '^T7^',  overlaps( s1, s2 ), False  )
  T.eq( '^T8^',  overlaps( s1, s3 ), True   )
  T.eq( '^T9^',  overlaps( s1, s4 ), True   )
  T.eq( '^T10^',  overlaps( s1, s5 ), True   )
  T.eq( '^T11^', overlaps( s1, s6 ), True   )
  T.eq( '^T12^', overlaps( s1, s7 ), False  )
  T.eq( '^T13^', overlaps( s1, s8 ), False  )
  #.........................................................................................................
  T.eq( '^T14^', disjunct( s1, s1 ), False  )
  T.eq( '^T15^', disjunct( s1, s2 ), True   )
  T.eq( '^T16^', disjunct( s1, s3 ), False  )
  T.eq( '^T17^', disjunct( s1, s4 ), False  )
  T.eq( '^T18^', disjunct( s1, s5 ), False  )
  T.eq( '^T19^', disjunct( s1, s6 ), False  )
  T.eq( '^T20^', disjunct( s1, s7 ), True   )
  T.eq( '^T21^', disjunct( s1, s8 ), True   )

# #-----------------------------------------------------------------------------------------------------------
# def test_union( T ) -> None:
#   print( '^332-1^', 'test_union' )
#   #.........................................................................................................
#   s1 = new_segment( ( 10, 20, ) )
#   s2 = new_segment( ( 10, 20, ) )
#   s3 = new_segment( ( 15, 15, ) )
#   s4 = new_segment( ( 15, 25, ) )
#   s5 = new_segment( ( 20, 25, ) )
#   s6 = new_segment( ( 21, 25, ) )
#   s7 = ( 15, 18 )
#   s8 = ( 5, 30 )
#   #.........................................................................................................
#   print( union( s1, s1 ), '^T22^' )
#   print( union( s1, s2 ), '^T23^' )
#   print( union( s1, s3 ), '^T24^' )
#   print( union( s1, s4 ), '^T25^' )
#   print( union( s1, s5 ), '^T26^' )
#   print( union( s1, s6 ), '^T27^' )
#   print( union( s1, s7 ), '^T28^' )
#   print( union( s1, s8 ), '^T29^' )

#-----------------------------------------------------------------------------------------------------------
def test_merge_two_segments( T ):
  print( '^332-1^', 'test_merge_two_segments' )
  def s( lo, hi ): return Segment( lo, hi )
  T.eq( '^T30^', _merge_two_segments( s( 20, 29, ), s( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T31^', _merge_two_segments( s( 20, 29, ), s( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T32^', _merge_two_segments( s( 20, 29, ), s( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T33^', _merge_two_segments( s( 20, 29, ), s( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T34^', _merge_two_segments( s( 20, 29, ), s( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_more_segments( T ):
  print( '^332-1^', 'test_merge_segments' )
  def s( lo, hi ): return Segment( lo, hi )
  T.eq( '^T35^', _merge_segments(), [] )
  T.eq( '^T36^', _merge_segments(     ( 20, 29, ),             ), [ s( 20, 29, ),              ] )
  T.eq( '^T37^', _merge_segments(     ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T38^', _merge_segments(     ( 20, 29, ), ( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T39^', _merge_segments(     ( 20, 29, ), ( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T40^', _merge_segments(     ( 20, 29, ), ( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T41^', _merge_segments(     ( 20, 29, ), ( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )
  T.eq( '^T42^', _merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T43^', _merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), [ s( 20, 30, ),              ] )
  T.eq( '^T44^', _merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), [ s( 20, 49, ),              ] )
  T.eq( '^T45^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), [ s( 20, 29, ), s( 40, 59, )  ] )
  T.eq( '^T46^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), [ s( 20, 29, ), s( 40, 49, ), s( 60, 69, ),   ] )
  T.eq( '^T47^', _merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), [ s( 10, 11, ), s( 13, 13, ),   ] )
  T.eq( '^T48^', _merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), [ s( 10, 19, ),    ] )
  # T.eq( _merge_segments( '^T49^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), [ ( 10, float( 'inf' ), ),   ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_segments( T ):
  print( '^332-1^', 'test_merge_segments' )
  # try:    _merge_segments()
  # except  Interlap_error as e: T.ok( '^T50^', True )
  # else:   T.fail( '^T51^', "`new_segment()` without arguments should fail" )
  def S( lo, hi ): return Segment( lo, hi )
  def L( *P ): return Lap( P )
  urge( '^T52^', merge_segments() )
  T.eq( '^T52^', merge_segments(), L() )
  T.eq( '^T53^', merge_segments(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T54^', merge_segments(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T55^', merge_segments(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T56^', merge_segments(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T57^', merge_segments(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T58^', merge_segments(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T59^', merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T60^', merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T61^', merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T62^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T63^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T64^', merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T65^', merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )
  # T.eq( _merge_segments( '^T66^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), ( ( 10, float( 'inf' ), ),   ) )

#-----------------------------------------------------------------------------------------------------------
def test_new_lap( T ):
  print( '^332-1^', 'test_new_lap' )
  def S( lo, hi ): return Segment( lo, hi )
  def L( *P ): return Lap( P )
  T.eq( '^T67^', new_lap(), () )
  T.eq( '^T68^', new_lap(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T69^', new_lap(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T70^', new_lap(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T71^', new_lap(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T72^', new_lap(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T73^', new_lap(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T74^', new_lap( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T75^', new_lap( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T76^', new_lap( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T77^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T78^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T79^', new_lap( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T80^', new_lap( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )
  # T.eq( _merge_segments( '^T81^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), ( ( 10, float( 'inf' ), ),   ) )

# float( '-inf' ) < float( '+inf' )

############################################################################################################
if __name__ == '__main__':
  test()
  # urge( '^599^', _merge_segments( ( False, True, ) ) )
  # help( '^233^', inf )
  # help( '^233^', intinf )
  # help( '^233^', type( intinf ) )
  # help( '^233^', type( intinf ) == Union )
  # help( '^233^', intinf.__origin__ == Union )
  # # help( '^233^', getattr( intinf, '__origin__', None ) == Union )
  # # help( '^233^', getattr( None, '__origin__', None ) == Union )
  # # help( '^233^', isinstance( intinf, Union ) )
  # help( '^233^', isa( intinf, 4 ) )
  # help( '^233^', isa( intinf, '4' ) )
  # help( '^233^', isa( intinf, False ) )
  # help( '^233^', isa( int, 4 ) )
  # help( '^233^', isa( int, '4' ) )
  # help( '^233^', isinstance( False, int ) ) ### TAINT returns true!!! ###
  # help( '^233^', isa( int, False ) ) ### TAINT returns true!!! ###
  # # help( '^233^', isinstance( inf, intinf ) )




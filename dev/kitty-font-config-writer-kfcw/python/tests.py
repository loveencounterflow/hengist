

#-----------------------------------------------------------------------------------------------------------
from _testing import Testing
# from _testing import C
# from _testing import debug
# from _testing import urge
# from _testing import help
# from typing import NamedTuple
# from typing import Union
# from typing import Tuple
# from typing import Iterable
# from typing import List
# from functools import total_ordering
# from typing import NewType
from typing import Any
# from math import inf
#...........................................................................................................
class Interlap_error( TypeError, ValueError ): pass
def throw( message: str ) -> None: raise Interlap_error( message )
#...........................................................................................................
from interlap import Segment
from interlap import new_segment
from interlap import Lap
from interlap import new_lap
from interlap import _merge_segments
from interlap import _merge_two_segments
from interlap import merge_segments
from interlap import overlaps
from interlap import disjunct
from interlap import gen_segment
from interlap import adjacent


# print( new_segment( ( 'x', 'y', ) ) ) ### TAINT not

#-----------------------------------------------------------------------------------------------------------
def test() -> None:
  T = Testing()
  test_basics( T )
  test_sorting( T )
  test_overlaps_disjunct( T )
  test_adjacent( T )
  test_merge_two_segments( T )
  test_merge_more_segments( T )
  test_merge_segments( T )
  test_new_lap( T )
  T.report()

#-----------------------------------------------------------------------------------------------------------
def test_basics( T: Any ) -> None:
  print( '^332-1^', 'test_basics' )
  T.eq( '^T1^', type( new_segment( ( 42, 48, ) ) ), Segment )
  T.ne( '^T2^', type( new_segment( ( 42, 48, ) ) ), tuple )
  T.eq( '^T3^', new_segment( ( 42, 48, ) ), Segment( 42, 48 ) )
  # T.ne( '^T4^', new_segment( ( 1, 1, ) ), ( 1, 1, ) )
  # try:    r = new_segment( ( False, True, ) )
  # except  Interlap_error as e: pass
  # else:   T.fail( '^T5^', f"should not be acceptable: {r}" )

#-----------------------------------------------------------------------------------------------------------
def test_sorting( T: Any ) -> None:
  print( '^332-1^', 'test_sorting' )
  T.eq( '^T6^', Segment( 3, 4 ) <  Segment( 4, 4 ), True )
  T.eq( '^T7^', Segment( 5, 8 ) <  Segment( 5, 7 ), False )
  T.eq( '^T8^', Segment( 5, 8 ) >  Segment( 5, 7 ), True )
  #.........................................................................................................
  T.eq( '^T9^', new_lap( ( 3, 4 ) ) <  new_lap( ( 1, 1, ) ), False )
  T.eq( '^T10^', new_lap( ( 3, 4 ) ) == new_lap( ( 1, 1, ) ), False )
  T.eq( '^T11^', new_lap( ( 3, 4 ) ) >  new_lap( ( 1, 1, ) ), True  )
  #.........................................................................................................
  T.eq( '^T12^', new_lap( ( 3, 4 ) ) <  new_lap( ( 4, 4, ) ), True  )
  T.eq( '^T13^', new_lap( ( 3, 4 ) ) == new_lap( ( 4, 4, ) ), False )
  T.eq( '^T14^', new_lap( ( 3, 4 ) ) >  new_lap( ( 4, 4, ) ), False )
  #.........................................................................................................
  T.eq( '^T15^', new_lap( ( 3, 4 ) ) <  new_lap( ( 3, 5, ) ), True  )
  T.eq( '^T16^', new_lap( ( 3, 4 ) ) == new_lap( ( 3, 5, ) ), False )
  T.eq( '^T17^', new_lap( ( 3, 4 ) ) >  new_lap( ( 3, 5, ) ), False )
  #.........................................................................................................
  T.eq( '^T18^', new_lap( ( 3, 4 ) ) <  new_lap( ( 5, 5, ) ), True  )
  T.eq( '^T19^', new_lap( ( 3, 4 ) ) == new_lap( ( 5, 5, ) ), False )
  T.eq( '^T20^', new_lap( ( 3, 4 ) ) >  new_lap( ( 5, 5, ) ), False )

#-----------------------------------------------------------------------------------------------------------
def test_overlaps_disjunct( T: Any ) -> None:
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
  T.eq( '^T21^', overlaps( s1, s1 ), True   )
  T.eq( '^T22^', overlaps( s1, s2 ), False  )
  T.eq( '^T23^', overlaps( s1, s3 ), True   )
  T.eq( '^T24^', overlaps( s1, s4 ), True   )
  T.eq( '^T25^', overlaps( s1, s5 ), True   )
  T.eq( '^T26^', overlaps( s1, s6 ), True   )
  T.eq( '^T27^', overlaps( s1, s7 ), False  )
  T.eq( '^T28^', overlaps( s1, s8 ), False  )
  #.........................................................................................................
  T.eq( '^T29^', disjunct( s1, s1 ), False  )
  T.eq( '^T30^', disjunct( s1, s2 ), True   )
  T.eq( '^T31^', disjunct( s1, s3 ), False  )
  T.eq( '^T32^', disjunct( s1, s4 ), False  )
  T.eq( '^T33^', disjunct( s1, s5 ), False  )
  T.eq( '^T34^', disjunct( s1, s6 ), False  )
  T.eq( '^T35^', disjunct( s1, s7 ), True   )
  T.eq( '^T36^', disjunct( s1, s8 ), True   )

#-----------------------------------------------------------------------------------------------------------
def test_adjacent( T: Any ) -> None:
  print( '^332-1^', 'test_overlaps_disjunct' )
  #.........................................................................................................
  s1 = new_segment( ( 20, 29, ) )
  s2 = new_segment( ( 10, 18, ) )
  s3 = new_segment( ( 10, 19, ) )
  s4 = new_segment( ( 10, 20, ) )
  s5 = new_segment( ( 29, 39, ) )
  s6 = new_segment( ( 30, 39, ) )
  s7 = new_segment( ( 31, 39, ) )
  T.eq( '^T37^', adjacent( s1, s1 ), False  )
  T.eq( '^T38^', adjacent( s1, s2 ), False  )
  T.eq( '^T39^', adjacent( s1, s3 ), True   )
  T.eq( '^T40^', adjacent( s1, s4 ), False  )
  T.eq( '^T41^', adjacent( s1, s5 ), False  )
  T.eq( '^T42^', adjacent( s1, s6 ), True   )
  T.eq( '^T43^', adjacent( s1, s7 ), False  )

# #-----------------------------------------------------------------------------------------------------------
# def test_union( T: Any ) -> None:
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
#   print( union( s1, s1 ), '^T44^' )
#   print( union( s1, s2 ), '^T45^' )
#   print( union( s1, s3 ), '^T46^' )
#   print( union( s1, s4 ), '^T47^' )
#   print( union( s1, s5 ), '^T48^' )
#   print( union( s1, s6 ), '^T49^' )
#   print( union( s1, s7 ), '^T50^' )
#   print( union( s1, s8 ), '^T51^' )

#-----------------------------------------------------------------------------------------------------------
def test_merge_two_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_two_segments' )
  def s( lo, hi ): return Segment( lo, hi ) # type: ignore
  T.eq( '^T52^', _merge_two_segments( s( 20, 29, ), s( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T53^', _merge_two_segments( s( 20, 29, ), s( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T54^', _merge_two_segments( s( 20, 29, ), s( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T55^', _merge_two_segments( s( 20, 29, ), s( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T56^', _merge_two_segments( s( 20, 29, ), s( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_more_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_segments' )
  def s( lo, hi ): return Segment( lo, hi ) # type: ignore
  T.eq( '^T57^', _merge_segments(), [] )
  T.eq( '^T58^', _merge_segments(     ( 20, 29, ),             ), [ s( 20, 29, ),              ] )
  T.eq( '^T59^', _merge_segments(     ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T60^', _merge_segments(     ( 20, 29, ), ( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T61^', _merge_segments(     ( 20, 29, ), ( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T62^', _merge_segments(     ( 20, 29, ), ( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T63^', _merge_segments(     ( 20, 29, ), ( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )
  T.eq( '^T64^', _merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T65^', _merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), [ s( 20, 30, ),              ] )
  T.eq( '^T66^', _merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), [ s( 20, 49, ),              ] )
  T.eq( '^T67^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), [ s( 20, 29, ), s( 40, 59, )  ] )
  T.eq( '^T68^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), [ s( 20, 29, ), s( 40, 49, ), s( 60, 69, ),   ] )
  T.eq( '^T69^', _merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), [ s( 10, 11, ), s( 13, 13, ),   ] )
  T.eq( '^T70^', _merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), [ s( 10, 19, ),    ] )
  # T.eq( _merge_segments( '^T71^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), [ ( 10, float( 'inf' ), ),   ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_segments' )
  # try:    _merge_segments()
  # except  Interlap_error as e: T.ok( '^T72^', True )
  # else:   T.fail( '^T73^', "`new_segment()` without arguments should fail" )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  T.eq( '^T74^', merge_segments(), L() )
  T.eq( '^T75^', merge_segments(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T76^', merge_segments(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T77^', merge_segments(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T78^', merge_segments(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T79^', merge_segments(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T80^', merge_segments(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T81^', merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T82^', merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T83^', merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T84^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T85^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T86^', merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T87^', merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )

#-----------------------------------------------------------------------------------------------------------
def test_new_lap( T: Any ) -> None:
  print( '^332-1^', 'test_new_lap' )
  def S( lo: int, hi: int ) -> Segment: return Segment( lo, hi )
  def L( *P: gen_segment ) -> Lap: return Lap( P ) # type: ignore
  T.eq( '^T88^', new_lap(), L() )
  T.eq( '^T89^', new_lap(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T90^', new_lap(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T91^', new_lap(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T92^', new_lap(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T93^', new_lap(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T94^', new_lap(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T95^', new_lap( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T96^', new_lap( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T97^', new_lap( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T98^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T99^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T100^', new_lap( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T101^', new_lap( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )
  # T.eq( _merge_segments( '^T102^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), ( ( 10, float( 'inf' ), ),   ) )

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




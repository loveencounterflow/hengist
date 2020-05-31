

#-----------------------------------------------------------------------------------------------------------
from _testing import Testing
# from _testing import C
from _testing import debug
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
from interlap import Segment
from interlap import new_segment
from interlap import Lap
from interlap import new_lap
from interlap import _merge_segments
from interlap import _merge_two_segments
from interlap import merge_segments
from interlap import segments_overlap
from interlap import segments_are_disjunct
from interlap import gen_segment
from interlap import segments_are_adjacent
from interlap import subtract_segments
from interlap import Interlap_error

# print( new_segment( ( 'x', 'y', ) ) ) ### TAINT not

#-----------------------------------------------------------------------------------------------------------
def test() -> None:
  T = Testing()
  test_basics( T )
  test_sorting( T )
  test_segments_overlap_segments_are_disjunct( T )
  test_segments_are_adjacent( T )
  test_merge_two_segments( T )
  test_merge_more_segments( T )
  test_merge_segments( T )
  test_subtract_segments( T )
  test_size( T )
  test_new_lap( T )
  test_immutability( T )
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
def test_segments_overlap_segments_are_disjunct( T: Any ) -> None:
  print( '^332-1^', 'test_segments_overlap_segments_are_disjunct' )
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
  T.eq( '^T21^', segments_overlap( s1, s1 ), True   )
  T.eq( '^T22^', segments_overlap( s1, s2 ), False  )
  T.eq( '^T23^', segments_overlap( s1, s3 ), True   )
  T.eq( '^T24^', segments_overlap( s1, s4 ), True   )
  T.eq( '^T25^', segments_overlap( s1, s5 ), True   )
  T.eq( '^T26^', segments_overlap( s1, s6 ), True   )
  T.eq( '^T27^', segments_overlap( s1, s7 ), False  )
  T.eq( '^T28^', segments_overlap( s1, s8 ), False  )
  #.........................................................................................................
  T.eq( '^T29^', segments_are_disjunct( s1, s1 ), False  )
  T.eq( '^T30^', segments_are_disjunct( s1, s2 ), True   )
  T.eq( '^T31^', segments_are_disjunct( s1, s3 ), False  )
  T.eq( '^T32^', segments_are_disjunct( s1, s4 ), False  )
  T.eq( '^T33^', segments_are_disjunct( s1, s5 ), False  )
  T.eq( '^T34^', segments_are_disjunct( s1, s6 ), False  )
  T.eq( '^T35^', segments_are_disjunct( s1, s7 ), True   )
  T.eq( '^T36^', segments_are_disjunct( s1, s8 ), True   )

#-----------------------------------------------------------------------------------------------------------
def test_segments_are_adjacent( T: Any ) -> None:
  print( '^332-1^', 'test_segments_are_adjacent' )
  #.........................................................................................................
  s1 = new_segment( ( 20, 29, ) )
  s2 = new_segment( ( 10, 18, ) )
  s3 = new_segment( ( 10, 19, ) )
  s4 = new_segment( ( 10, 20, ) )
  s5 = new_segment( ( 29, 39, ) )
  s6 = new_segment( ( 30, 39, ) )
  s7 = new_segment( ( 31, 39, ) )
  T.eq( '^T37^', segments_are_adjacent( s1, s1 ), False  )
  T.eq( '^T38^', segments_are_adjacent( s1, s2 ), False  )
  T.eq( '^T39^', segments_are_adjacent( s1, s3 ), True   )
  T.eq( '^T40^', segments_are_adjacent( s1, s4 ), False  )
  T.eq( '^T41^', segments_are_adjacent( s1, s5 ), False  )
  T.eq( '^T42^', segments_are_adjacent( s1, s6 ), True   )
  T.eq( '^T43^', segments_are_adjacent( s1, s7 ), False  )

#-----------------------------------------------------------------------------------------------------------
def test_subtract_segments( T: Any ) -> None:
  print( '^332-1^', 'test_subtract_segments' )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  #.........................................................................................................
  s1  = new_segment( ( 20, 29, ) )
  s2  = new_segment( ( 10, 18, ) )
  s3  = new_segment( ( 10, 19, ) )
  s4  = new_segment( ( 10, 20, ) )
  s5  = new_segment( ( 29, 39, ) )
  s6  = new_segment( ( 30, 39, ) )
  s7  = new_segment( ( 31, 39, ) )
  s8  = new_segment( ( 22, 25, ) )
  s9  = new_segment( ( 25, 29, ) )
  s10 = new_segment( ( 20, 25, ) )
  s11 = new_segment( ( 28, 39, ) )
  T.eq( '^T44^', subtract_segments( s1,  s1 ), L()  )
  T.eq( '^T45^', subtract_segments( s1,  s2 ), L( s1 )  )
  T.eq( '^T46^', subtract_segments( s1,  s3 ), L( s1 )   )
  T.eq( '^T47^', subtract_segments( s1,  s4 ), L( S( 21, 29 ) )  )
  T.eq( '^T48^', subtract_segments( s1,  s5 ), L( S( 20, 28 ) )  )
  T.eq( '^T49^', subtract_segments( s1,  s6 ), L( s1 )   )
  T.eq( '^T50^', subtract_segments( s1,  s7 ), L( s1 )  )
  T.eq( '^T51^', subtract_segments( s1,  s8 ), L( S( 20, 21 ), S( 26, 29 ) )  )
  T.eq( '^T52^', subtract_segments( s1,  s9 ), L( S( 20, 24 ) )  )
  T.eq( '^T53^', subtract_segments( s1, s10 ), L( S( 26, 29 ) )  )
  T.eq( '^T53^', subtract_segments( s1, s11 ), L( S( 20, 27 ) )  )
  T.eq( '^T53^', subtract_segments( s1, s4, s9 ), L( S( 21, 24 ) )  )
  T.eq( '^T53^', subtract_segments( s1, s9, s4 ), L( S( 21, 24 ) )  )
  T.eq( '^T53^', subtract_segments( S( 30, 39 ), S( 10, 29 ), S( 25, 34 ), S( 36, 36 ) ), L( S( 35, 35 ), S( 37, 39 ) )  )
  T.eq( '^T53^', subtract_segments( S( 30, 39 ), S( 10, 29 ), S( 25, 34 ), S( 36, 36 ), S( 37, 37 ) ), L( S( 35, 35 ), S( 38, 39 ) )  )
  T.eq( '^T53^', subtract_segments( S( 30, 39 ), S( 10, 29 ), S( 25, 34 ), S( 36, 36 ), S( 37, 37 ), S( 39, 42 ) ), L( S( 35, 35 ), S( 38, 38 ) )  )

#-----------------------------------------------------------------------------------------------------------
def test_merge_two_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_two_segments' )
  def s( lo, hi ): return Segment( lo, hi ) # type: ignore
  T.eq( '^T54^', _merge_two_segments( s( 20, 29, ), s( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T55^', _merge_two_segments( s( 20, 29, ), s( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T56^', _merge_two_segments( s( 20, 29, ), s( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T57^', _merge_two_segments( s( 20, 29, ), s( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T58^', _merge_two_segments( s( 20, 29, ), s( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_more_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_segments' )
  def s( lo, hi ): return Segment( lo, hi ) # type: ignore
  T.eq( '^T59^', _merge_segments(), [] )
  T.eq( '^T60^', _merge_segments(     ( 20, 29, ),             ), [ s( 20, 29, ),              ] )
  T.eq( '^T61^', _merge_segments(     ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T62^', _merge_segments(     ( 20, 29, ), ( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T63^', _merge_segments(     ( 20, 29, ), ( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T64^', _merge_segments(     ( 20, 29, ), ( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T65^', _merge_segments(     ( 20, 29, ), ( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )
  T.eq( '^T66^', _merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T67^', _merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), [ s( 20, 30, ),              ] )
  T.eq( '^T68^', _merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), [ s( 20, 49, ),              ] )
  T.eq( '^T69^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), [ s( 20, 29, ), s( 40, 59, )  ] )
  T.eq( '^T70^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), [ s( 20, 29, ), s( 40, 49, ), s( 60, 69, ),   ] )
  T.eq( '^T71^', _merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), [ s( 10, 11, ), s( 13, 13, ),   ] )
  T.eq( '^T72^', _merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), [ s( 10, 19, ),    ] )
  # T.eq( _merge_segments( '^T73^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), [ ( 10, float( 'inf' ), ),   ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_segments' )
  # try:    _merge_segments()
  # except  Interlap_error as e: T.ok( '^T74^', True )
  # else:   T.fail( '^T75^', "`new_segment()` without arguments should fail" )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  T.eq( '^T76^', merge_segments(), L() )
  T.eq( '^T77^', merge_segments(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T78^', merge_segments(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T79^', merge_segments(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T80^', merge_segments(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T81^', merge_segments(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T82^', merge_segments(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T83^', merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T84^', merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T85^', merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T86^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T87^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T88^', merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T89^', merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )

#-----------------------------------------------------------------------------------------------------------
def test_new_lap( T: Any ) -> None:
  print( '^332-1^', 'test_new_lap' )
  def S( lo: int, hi: int ) -> Segment: return Segment( lo, hi )
  def L( *P: gen_segment ) -> Lap: return Lap( P ) # type: ignore
  T.eq( '^T90^', new_lap(), L() )
  T.eq( '^T91^', new_lap(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T92^', new_lap(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T93^', new_lap(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T94^', new_lap(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T95^', new_lap(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T96^', new_lap(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T97^', new_lap( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T98^', new_lap( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T99^', new_lap( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T100^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T101^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T102^', new_lap( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T103^', new_lap( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )
  # T.eq( _merge_segments( '^T104^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), ( ( 10, float( 'inf' ), ),   ) )


#-----------------------------------------------------------------------------------------------------------
def test_size( T: Any ) -> None:
  print( '^332-1^', 'test_size' )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  #.........................................................................................................
  T.eq( '^T1^', S( 100, 100 ).size, 1 )
  T.eq( '^T1^', S( 100, 101 ).size, 2 )
  T.eq( '^T1^', L( S( 100, 101 ) ).size, 2 )
  T.eq( '^T1^', L( S( 100, 101 ), S( 110, 119 ) ).size, 12 )

#-----------------------------------------------------------------------------------------------------------
def test_immutability( T: Any ) -> None:
  print( '^332-1^', 'test_immutability' )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  s1 = S( 10, 15 )
  debug( '^T3^', s1 )
  try:    s1.lo = 11
  except  Interlap_error: T.ok( '^T74^', True )
  else:   T.fail( '^T75^', "attempt to mutate segment should fail" )
  try:    s1.hi = 17
  except  Interlap_error: T.ok( '^T74^', True )
  else:   T.fail( '^T75^', "attempt to mutate segment should fail" )
  # #.........................................................................................................
  # T.eq( '^T1^', S( 100, 100 ).size, 1 )
  # T.eq( '^T1^', S( 100, 101 ).size, 2 )
  # T.eq( '^T1^', L( S( 100, 101 ) ).size, 2 )
  # T.eq( '^T1^', L( S( 100, 101 ), S( 110, 119 ) ).size, 12 )


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




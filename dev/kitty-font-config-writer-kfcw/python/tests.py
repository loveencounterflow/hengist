

#-----------------------------------------------------------------------------------------------------------
from _testing import Testing
# from _testing import C
from _testing import debug
from _testing import urge
# from _testing import help
# from typing import NamedTuple
# from typing import Union
# from typing import Tuple
# from typing import Iterable
# from typing import List
# from functools import total_ordering
# from typing import NewType
from typing import Any
from typing import Dict
from typing import Tuple
# from math import inf
#...........................................................................................................
from interlap import _merge_segments
from interlap import _merge_two_segments
from interlap import gen_segment
from interlap import InterlapError
from interlap import InterlapKeyError
from interlap import InterlapValueError
from interlap import Lap
from interlap import merge_segments
from interlap import new_lap
from interlap import new_segment
from interlap import Segment
from interlap import segments_are_adjacent
from interlap import segments_are_disjunct
from interlap import segments_overlap
from interlap import subtract_segments

# print( new_segment( ( 'x', 'y', ) ) ) ### TAINT not

#-----------------------------------------------------------------------------------------------------------
def test() -> None:
  T = Testing()
  test_basics( T )
  test_sorting( T )
  test_hashing( T )
  test_segments_overlap_segments_are_disjunct( T )
  test_segments_are_adjacent( T )
  test_merge_two_segments( T )
  test_merge_more_segments( T )
  test_merge_segments( T )
  test_subtract_segments( T )
  test_size( T )
  test_new_lap( T )
  test_immutability( T )
  test_kitty_font_conf_1( T )
  test_kitty_font_conf_2( T )
  T.report()

#-----------------------------------------------------------------------------------------------------------
def test_basics( T: Any ) -> None:
  print( '^332-1^', 'test_basics' )
  T.eq( '^T1^', type( new_segment( ( 42, 48, ) ) ), Segment )
  T.ne( '^T2^', type( new_segment( ( 42, 48, ) ) ), tuple )
  urge( '^21-1^', new_segment( ( 42, 48, ) ) )
  urge( '^21-2^', Segment( 42, 48, ) )
  urge( '^21-3^', Lap( Segment( 42, 48, ) ) )
  T.eq( '^T3^', new_segment( ( 42, 48, ) ), Segment( 42, 48 ) )
  T.eq( '^T4^', new_segment( lo = 42, hi = 48 ), Segment( 42, 48 ) )
  try:    new_segment( 42, 48 )
  except  TypeError: T.ok( '^T5^', True )
  else:   T.fail( '^T6^', "`new_segment()` with two unnamed arguments should fail" )
  # T.eq( '^T7-3^', new_segment( 42, 48 ), Segment( 42, 48 ) )
  # T.ne( '^T8^', new_segment( ( 1, 1, ) ), ( 1, 1, ) )
  # try:    r = new_segment( ( False, True, ) )
  # except  InterlapKeyError as e: pass
  # else:   T.fail( '^T9^', f"should not be acceptable: {r}" )

#-----------------------------------------------------------------------------------------------------------
def test_hashing( T: Any ) -> None:
  print( '^332-1^', 'test_hashing' )
  T.eq( '^T10^', { Segment( 3, 4 ): 42, }, { Segment( 3, 4 ): 42, } )

#-----------------------------------------------------------------------------------------------------------
def test_sorting( T: Any ) -> None:
  print( '^332-1^', 'test_sorting' )
  T.eq( '^T10^', Segment( 3, 4 ) <  Segment( 4, 4 ), True )
  T.eq( '^T11^', Segment( 5, 8 ) <  Segment( 5, 7 ), False )
  T.eq( '^T12^', Segment( 5, 8 ) >  Segment( 5, 7 ), True )
  #.........................................................................................................
  T.eq( '^T13^', new_lap( ( 3, 4 ) ) <  new_lap( ( 1, 1, ) ), False )
  T.eq( '^T14^', new_lap( ( 3, 4 ) ) == new_lap( ( 1, 1, ) ), False )
  T.eq( '^T15^', new_lap( ( 3, 4 ) ) >  new_lap( ( 1, 1, ) ), True  )
  #.........................................................................................................
  T.eq( '^T16^', new_lap( ( 3, 4 ) ) <  new_lap( ( 4, 4, ) ), True  )
  T.eq( '^T17^', new_lap( ( 3, 4 ) ) == new_lap( ( 4, 4, ) ), False )
  T.eq( '^T18^', new_lap( ( 3, 4 ) ) >  new_lap( ( 4, 4, ) ), False )
  #.........................................................................................................
  T.eq( '^T19^', new_lap( ( 3, 4 ) ) <  new_lap( ( 3, 5, ) ), True  )
  T.eq( '^T20^', new_lap( ( 3, 4 ) ) == new_lap( ( 3, 5, ) ), False )
  T.eq( '^T21^', new_lap( ( 3, 4 ) ) >  new_lap( ( 3, 5, ) ), False )
  #.........................................................................................................
  T.eq( '^T22^', new_lap( ( 3, 4 ) ) <  new_lap( ( 5, 5, ) ), True  )
  T.eq( '^T23^', new_lap( ( 3, 4 ) ) == new_lap( ( 5, 5, ) ), False )
  T.eq( '^T24^', new_lap( ( 3, 4 ) ) >  new_lap( ( 5, 5, ) ), False )

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
  T.eq( '^T25^', segments_overlap( s1, s1 ), True   )
  T.eq( '^T26^', segments_overlap( s1, s2 ), False  )
  T.eq( '^T27^', segments_overlap( s1, s3 ), True   )
  T.eq( '^T28^', segments_overlap( s1, s4 ), True   )
  T.eq( '^T29^', segments_overlap( s1, s5 ), True   )
  T.eq( '^T30^', segments_overlap( s1, s6 ), True   )
  T.eq( '^T31^', segments_overlap( s1, s7 ), False  )
  T.eq( '^T32^', segments_overlap( s1, s8 ), False  )
  #.........................................................................................................
  T.eq( '^T33^', segments_are_disjunct( s1, s1 ), False  )
  T.eq( '^T34^', segments_are_disjunct( s1, s2 ), True   )
  T.eq( '^T35^', segments_are_disjunct( s1, s3 ), False  )
  T.eq( '^T36^', segments_are_disjunct( s1, s4 ), False  )
  T.eq( '^T37^', segments_are_disjunct( s1, s5 ), False  )
  T.eq( '^T38^', segments_are_disjunct( s1, s6 ), False  )
  T.eq( '^T39^', segments_are_disjunct( s1, s7 ), True   )
  T.eq( '^T40^', segments_are_disjunct( s1, s8 ), True   )

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
  T.eq( '^T41^', segments_are_adjacent( s1, s1 ), False  )
  T.eq( '^T42^', segments_are_adjacent( s1, s2 ), False  )
  T.eq( '^T43^', segments_are_adjacent( s1, s3 ), True   )
  T.eq( '^T44^', segments_are_adjacent( s1, s4 ), False  )
  T.eq( '^T45^', segments_are_adjacent( s1, s5 ), False  )
  T.eq( '^T46^', segments_are_adjacent( s1, s6 ), True   )
  T.eq( '^T47^', segments_are_adjacent( s1, s7 ), False  )

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
  T.eq( '^T48^', subtract_segments( s1,  s1 ), L()  )
  T.eq( '^T49^', subtract_segments( s1,  s2 ), L( s1 )  )
  T.eq( '^T50^', subtract_segments( s1,  s3 ), L( s1 )   )
  T.eq( '^T51^', subtract_segments( s1,  s4 ), L( S( 21, 29 ) )  )
  T.eq( '^T52^', subtract_segments( s1,  s5 ), L( S( 20, 28 ) )  )
  T.eq( '^T53^', subtract_segments( s1,  s6 ), L( s1 )   )
  T.eq( '^T54^', subtract_segments( s1,  s7 ), L( s1 )  )
  T.eq( '^T55^', subtract_segments( s1,  s8 ), L( S( 20, 21 ), S( 26, 29 ) )  )
  T.eq( '^T56^', subtract_segments( s1,  s9 ), L( S( 20, 24 ) )  )
  T.eq( '^T57^', subtract_segments( s1, s10 ), L( S( 26, 29 ) )  )
  T.eq( '^T58^', subtract_segments( s1, s11 ), L( S( 20, 27 ) )  )
  T.eq( '^T59^', subtract_segments( s1, s4, s9 ), L( S( 21, 24 ) )  )
  T.eq( '^T60^', subtract_segments( s1, s9, s4 ), L( S( 21, 24 ) )  )
  T.eq( '^T61^', subtract_segments( S( 30, 39 ), S( 10, 29 ), S( 25, 34 ), S( 36, 36 ) ), L( S( 35, 35 ), S( 37, 39 ) )  )
  T.eq( '^T62^', subtract_segments( S( 30, 39 ), S( 10, 29 ), S( 25, 34 ), S( 36, 36 ), S( 37, 37 ) ), L( S( 35, 35 ), S( 38, 39 ) )  )
  T.eq( '^T63^', subtract_segments( S( 30, 39 ), S( 10, 29 ), S( 25, 34 ), S( 36, 36 ), S( 37, 37 ), S( 39, 42 ) ), L( S( 35, 35 ), S( 38, 38 ) )  )

#-----------------------------------------------------------------------------------------------------------
def test_merge_two_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_two_segments' )
  def s( lo, hi ): return Segment( lo, hi ) # type: ignore
  T.eq( '^T64^', _merge_two_segments( s( 20, 29, ), s( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T65^', _merge_two_segments( s( 20, 29, ), s( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T66^', _merge_two_segments( s( 20, 29, ), s( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T67^', _merge_two_segments( s( 20, 29, ), s( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T68^', _merge_two_segments( s( 20, 29, ), s( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_more_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_segments' )
  def s( lo, hi ): return Segment( lo, hi ) # type: ignore
  T.eq( '^T69^', _merge_segments(), [] )
  T.eq( '^T70^', _merge_segments(     ( 20, 29, ),             ), [ s( 20, 29, ),              ] )
  T.eq( '^T71^', _merge_segments(     ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T72^', _merge_segments(     ( 20, 29, ), ( 29, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T73^', _merge_segments(     ( 20, 29, ), ( 29, 39, ) ), [ s( 20, 39, ),              ] )
  T.eq( '^T74^', _merge_segments(     ( 20, 29, ), ( 15, 19, ) ), [ s( 15, 29, ),              ] )
  T.eq( '^T75^', _merge_segments(     ( 20, 29, ), ( 15, 18, ) ), [ s( 15, 18, ), s( 20, 29, ), ] )
  T.eq( '^T76^', _merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), [ s( 20, 29, ),              ] )
  T.eq( '^T77^', _merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), [ s( 20, 30, ),              ] )
  T.eq( '^T78^', _merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), [ s( 20, 49, ),              ] )
  T.eq( '^T79^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), [ s( 20, 29, ), s( 40, 59, )  ] )
  T.eq( '^T80^', _merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), [ s( 20, 29, ), s( 40, 49, ), s( 60, 69, ),   ] )
  T.eq( '^T81^', _merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), [ s( 10, 11, ), s( 13, 13, ),   ] )
  T.eq( '^T82^', _merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), [ s( 10, 19, ),    ] )
  # T.eq( _merge_segments( '^T83^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), [ ( 10, float( 'inf' ), ),   ] )

#-----------------------------------------------------------------------------------------------------------
def test_merge_segments( T: Any ) -> None:
  print( '^332-1^', 'test_merge_segments' )
  # try:    _merge_segments()
  # except  InterlapKeyError as e: T.ok( '^T84^', True )
  # else:   T.fail( '^T85^', "`new_segment()` without arguments should fail" )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  T.eq( '^T86^', merge_segments(), L() )
  T.eq( '^T87^', merge_segments(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T88^', merge_segments(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T89^', merge_segments(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T90^', merge_segments(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T91^', merge_segments(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T92^', merge_segments(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T93^', merge_segments( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T94^', merge_segments( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T95^', merge_segments( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T96^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T97^', merge_segments( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T98^', merge_segments( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T99^', merge_segments( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )

#-----------------------------------------------------------------------------------------------------------
def test_new_lap( T: Any ) -> None:
  print( '^332-1^', 'test_new_lap' )
  def S( lo: int, hi: int ) -> Segment: return Segment( lo, hi )
  def L( *P: gen_segment ) -> Lap: return Lap( P ) # type: ignore
  T.eq( '^T100^', new_lap(), L() )
  T.eq( '^T101^', new_lap(     ( 20, 29, ),             ), L( S( 20, 29, ),              ) )
  T.eq( '^T102^', new_lap(     ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T103^', new_lap(     ( 20, 29, ), ( 29, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T104^', new_lap(     ( 20, 29, ), ( 29, 39, ) ), L( S( 20, 39, ),              ) )
  T.eq( '^T105^', new_lap(     ( 20, 29, ), ( 15, 19, ) ), L( S( 15, 29, ),              ) )
  T.eq( '^T106^', new_lap(     ( 20, 29, ), ( 15, 18, ) ), L( S( 15, 18, ), S( 20, 29, ), ) )
  T.eq( '^T107^', new_lap( ( 20, 29, ), ( 20, 29, ), ( 20, 29, ) ), L( S( 20, 29, ),              ) )
  T.eq( '^T108^', new_lap( ( 20, 29, ), ( 20, 30, ), ( 20, 29, ) ), L( S( 20, 30, ),              ) )
  T.eq( '^T109^', new_lap( ( 20, 29, ), ( 30, 39, ), ( 40, 49, ) ), L( S( 20, 49, ),              ) )
  T.eq( '^T110^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 50, 59, ) ), L( S( 20, 29, ), S( 40, 59, )  ) )
  T.eq( '^T111^', new_lap( ( 20, 29, ), ( 40, 49, ), ( 60, 69, ) ), L( S( 20, 29, ), S( 40, 49, ), S( 60, 69, ),   ) )
  T.eq( '^T112^', new_lap( ( 10, 10, ), ( 11, 11, ), ( 13, 13, ) ), L( S( 10, 11, ), S( 13, 13, ),   ) )
  T.eq( '^T113^', new_lap( ( 10, 19, ), ( 15, 19, ), ( 11, 13, ) ), L( S( 10, 19, ),    ) )
  # T.eq( _merge_segments( '^T114^', ( 10, float( 'inf' ), ), ( 15, 19, ), ), ( ( 10, float( 'inf' ), ),   ) )

#-----------------------------------------------------------------------------------------------------------
def test_size( T: Any ) -> None:
  print( '^332-1^', 'test_size' )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  #.........................................................................................................
  T.eq( '^T115^', S( 100, 100 ).size, 1 )
  T.eq( '^T116^', S( 100, 101 ).size, 2 )
  T.eq( '^T117^', L( S( 100, 101 ) ).size, 2 )
  T.eq( '^T118^', L( S( 100, 101 ), S( 110, 119 ) ).size, 12 )

#-----------------------------------------------------------------------------------------------------------
def test_immutability( T: Any ) -> None:
  print( '^332-1^', 'test_immutability' )
  def S( lo, hi ): return Segment( lo, hi ) # type: ignore
  def L( *P ): return Lap( P ) # type: ignore
  s1 = S( 10, 15 )
  l1 = L( s1 )
  debug( '^T119^', s1 )
  try:    s1.lo = 11
  except  InterlapKeyError: T.ok( '^T120^', True )
  else:   T.fail( '^T121^', "attempt to mutate segment should fail" )
  try:    s1.hi = 17
  except  InterlapKeyError: T.ok( '^T122^', True )
  else:   T.fail( '^T123^', "attempt to mutate segment should fail" )
  try:    l1.foo = 'bar'
  except  InterlapKeyError: T.ok( '^T124^', True )
  else:   T.fail( '^T125^', "attempt to mutate lap should fail" )
  try:    l1.segments = ( ( 1, 2, ) )
  except  InterlapKeyError: T.ok( '^T126^', True )
  else:   T.fail( '^T127^', "attempt to mutate lap should fail" )
  T.eq( '^T128^', type( l1.segments ), tuple )


#-----------------------------------------------------------------------------------------------------------
def coalesce_symbol_maps( maps: Dict[ Tuple[ int, int, ], str, ] ) -> Dict[ Tuple[ int, int, ], str, ]:
    if not maps:
        return maps
    R:            Dict[ Tuple[ int, int, ], str, ]
    R           = {}
    ranges_tpl  = reversed( list( range_tpl for range_tpl in maps ) )
    exclusion   = new_lap( new_segment( lo = 0x0, hi = 0x0, ), )
    for range_tpl in ranges_tpl:
        psname    = maps[ range_tpl ]
        segment   = new_segment( range_tpl )
        disjunct  = subtract_segments(  segment, *exclusion )
        exclusion = merge_segments(     segment, *exclusion )
        for disjunct_segment in disjunct:
            R[ ( disjunct_segment.lo, disjunct_segment.hi, ) ] = psname
    return R

#-----------------------------------------------------------------------------------------------------------
def test_kitty_font_conf_1( T: Any ) -> None:
  print( '^332-1^', 'test_kitty_font_conf_1' )
  probe   = { ( 0x4e00, 0x9fff, ): 'Sun-ExtA', ( 0x4e01, 0x4e01, ): 'TakaoGothic'}
  matcher = { ( 0x4e00, 0x4e00, ): 'Sun-ExtA', ( 0x4e02, 0x9fff, ): 'Sun-ExtA',  ( 0x4e01, 0x4e01, ): 'TakaoGothic'}
  debug( f"^443^ probe: {probe}" )
  debug( f"^443^ matcher: {matcher}" )
  result: Dict[ Tuple[ int, int, ], str, ] = coalesce_symbol_maps( probe )
  T.eq( '^T129^', result, matcher )

#-----------------------------------------------------------------------------------------------------------
def test_kitty_font_conf_2( T: Any ) -> None:
  print( '^332-1^', 'test_kitty_font_conf_2' )
  probe   = { ( 0x4e00, 0x9fff, ): 'Sun-ExtA', ( 0x4e01, 0x4e01, ): 'TakaoGothic', ( 0x9000, 0xa010, ): 'OtherFont', }
  matcher = { ( 0x4e00, 0x4e00, ): 'Sun-ExtA', ( 0x4e02, 0x8fff, ): 'Sun-ExtA',  ( 0x4e01, 0x4e01, ): 'TakaoGothic', ( 0x9000, 0xa010, ): 'OtherFont', }
  debug( f"^443^ probe: {probe}" )
  debug( f"^443^ matcher: {matcher}" )
  result: Dict[ Tuple[ int, int, ], str, ] = coalesce_symbol_maps( probe )
  T.eq( '^T129^', result, matcher )


############################################################################################################
if __name__ == '__main__':
  # test()
  non_characters = frozenset(range(0xfffe, 0x10ffff, 0x10000))
  for cid in non_characters:
    debug( '^33^', "{:02X}".format( cid ) )
    width = 8
    debug( '^33^', f"{cid:0{width}x}" )

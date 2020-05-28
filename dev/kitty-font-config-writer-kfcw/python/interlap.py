

#-----------------------------------------------------------------------------------------------------------
from typing import NamedTuple
from typing import Union
from typing import Tuple
# from typing import NewType
# from typing import Any

  # def _name_from_type( x: Any ) -> str:
  #   if x == None: return 'null'
  #   return type( x ).__name__


#-----------------------------------------------------------------------------------------------------------
class EX( TypeError, ValueError ): pass

#-----------------------------------------------------------------------------------------------------------
class Segment( NamedTuple ):
  lo:   int
  hi:   int

#-----------------------------------------------------------------------------------------------------------
class Lap( Tuple ): pass

#-----------------------------------------------------------------------------------------------------------
bi_int          = Tuple[ int, int ]
gen_segment     = Union[ Segment, bi_int, ]
# Lap             = Tuple[ Segment ]
# opt_gen_segment = Union[ gen_segment, None, ]

#-----------------------------------------------------------------------------------------------------------
def new_segment( lo: int, hi: int ) -> Segment:
  # if isinstance( lo, Segment ):
  #   if hi != None: raise EX( "cannot give second argument when first is a segment" )
  #   return lo
  # if isinstance( lo, tuple ):
  #   if hi != None: raise EX( "cannot give second argument when first is a tuple" )
  #   if len( lo ) != 2:
  #     raise EX( f"expected a tuple of length 2, got one with length {len( lo )}")
  #   return new_segment( lo[ 0 ], lo[ 1 ] )
  #.........................................................................................................
  if not isinstance( lo, int ): raise EX( f"expected an integer, got a {type(lo)}" )
  if not isinstance( hi, int ): raise EX( f"expected an integer, got a {type(hi)}" )
  if not lo <= hi: raise EX( f"expected lo <= hi, got {lo} and {hi}" )
  #.........................................................................................................
  return Segment( lo, hi )

#-----------------------------------------------------------------------------------------------------------
def new_lap( *segments: Segment ) -> Lap:
  return Lap( segments )

#-----------------------------------------------------------------------------------------------------------
def _as_segment( me: gen_segment ) -> Segment:
  return me if isinstance( me, Segment ) else new_segment( me[ 0 ], me[ 1 ] )

# #-----------------------------------------------------------------------------------------------------------
# def _as_lap( me: gen_segment, other: gen_segment ) -> Lap:
#   return ( me, ) if isinstance( me, Segment ) else new_segment( me[ 0 ], me[ 1 ] )

#-----------------------------------------------------------------------------------------------------------
def disjunct( me: gen_segment, other: gen_segment ) -> bool:
  return _disjunct( _as_segment( me ), _as_segment( other ) )
#...........................................................................................................
def _disjunct( me: Segment, other: Segment ) -> bool:
  return ( me.hi < other.lo ) or ( other.hi < me.lo )

#-----------------------------------------------------------------------------------------------------------
def overlaps( me: gen_segment, other: gen_segment ) -> bool:
  return _overlaps( _as_segment( me ), _as_segment( other ) )
#...........................................................................................................
def _overlaps( me: Segment, other: Segment ) -> bool:
  return not ( ( me.hi < other.lo ) or ( other.hi < me.lo ) )

#-----------------------------------------------------------------------------------------------------------
def union( me: gen_segment, other: gen_segment ) -> Lap:
  return _union( _as_segment( me ), _as_segment( other ) )
#...........................................................................................................
def _union( me: Segment, other: Segment ) -> Lap:
  if _disjunct( me, other ): return new_lap( me, other )
  # return not ( ( me.hi < other.lo ) or ( other.hi < me.lo ) )
  return Lap()

#-----------------------------------------------------------------------------------------------------------
def test() -> None:
  test_basics()
  test_overlaps_disjunct()
  test_union()

#-----------------------------------------------------------------------------------------------------------
def test_basics() -> None:
  assert 1 == 1, "should be equal"
  assert 1 != 2, "should be equal"
  assert type( new_segment( 42, 48 ) ) == Segment
  assert type( new_segment( 42, 48 ) ) != tuple
  assert new_segment( 42, 48 ) == ( 42, 48 )
  # print( new_segment( 42, 48.3 ) )
  # print( new_segment( 42, 0 ) )
  # print( new_segment( 42 ) )
  # print( new_segment( ( 42 ) ) ) ### TAINT shouldn't work ###
  # print( new_segment( ( 42, 108 ) ) )
  # print( new_segment( new_segment( 42 ) ) )

#-----------------------------------------------------------------------------------------------------------
def test_overlaps_disjunct() -> None:
  #.........................................................................................................
  s1 = new_segment( 20, 29 )
  s2 = new_segment( 10, 19 )
  s3 = new_segment( 10, 20 )
  s4 = new_segment( 10, 21 )
  s5 = new_segment( 28, 39 )
  s6 = new_segment( 29, 39 )
  s7 = new_segment( 30, 39 )
  s8 = new_segment( 31, 39 )
  #.........................................................................................................
  assert overlaps( s1, s1 ) == True,  '^od-1-1^'
  assert overlaps( s1, s2 ) == False, '^od-1-2^'
  assert overlaps( s1, s3 ) == True,  '^od-1-3^'
  assert overlaps( s1, s4 ) == True,  '^od-1-4^'
  assert overlaps( s1, s5 ) == True,  '^od-1-5^'
  assert overlaps( s1, s6 ) == True,  '^od-1-6^'
  assert overlaps( s1, s7 ) == False, '^od-1-7^'
  assert overlaps( s1, s8 ) == False, '^od-1-7^'
  #.........................................................................................................
  assert disjunct( s1, s1 ) == False, '^od-2-1^'
  assert disjunct( s1, s2 ) == True,  '^od-2-2^'
  assert disjunct( s1, s3 ) == False, '^od-2-3^'
  assert disjunct( s1, s4 ) == False, '^od-2-4^'
  assert disjunct( s1, s5 ) == False, '^od-2-5^'
  assert disjunct( s1, s6 ) == False, '^od-2-6^'
  assert disjunct( s1, s7 ) == True,  '^od-2-7^'
  assert disjunct( s1, s8 ) == True,  '^od-2-7^'

#-----------------------------------------------------------------------------------------------------------
def test_union() -> None:
  #.........................................................................................................
  s1 = new_segment( 10, 20 )
  s2 = new_segment( 10, 20 )
  s3 = new_segment( 15, 15 )
  s4 = new_segment( 15, 25 )
  s5 = new_segment( 20, 25 )
  s6 = new_segment( 21, 25 )
  s7 = ( 15, 18 )
  s8 = ( 5, 30 )
  #.........................................................................................................
  print( union( s1, s1 ), '^mrg-1-1^' )
  print( union( s1, s2 ), '^mrg-1-2^' )
  print( union( s1, s3 ), '^mrg-1-3^' )
  print( union( s1, s4 ), '^mrg-1-4^' )
  print( union( s1, s5 ), '^mrg-1-5^' )
  print( union( s1, s6 ), '^mrg-1-6^' )
  print( union( s1, s7 ), '^mrg-1-7^' )
  print( union( s1, s8 ), '^mrg-1-8^' )


############################################################################################################
if __name__ == '__main__':
  test()



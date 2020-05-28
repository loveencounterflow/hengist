

# import re


# # import interval
# # print( 'helo', interval )
# # print( dir( interval ) )
# # from interval import interval, inf, imath
# # k = interval([0, 1], [2, 3], [10, 15])
# # print( '^7776^', k )

# #-----------------------------------------------------------------------------------------------------------
# pseudo_css_configuration = [
#   [ 'font1', '[B-H] [J] [L] [N-X]          ', ],
#   [ 'font2', '[B-D]                        ', ],
#   [ 'font3', '[G-I]                        ', ],
#   [ 'font4', '[M-Q]                        ', ],
#   [ 'font5', '[M] [O-T]                    ', ],
#   [ 'font6', '[M] [U] [X-Y]                ', ],
#   ]

# #-----------------------------------------------------------------------------------------------------------
# def segments_overlap( me, other ):
#   return not ( me[ 1 ] < other[ 0 ] or me[ 0 ] > other[ 1 ] )

# #-----------------------------------------------------------------------------------------------------------
# def segments_from_pseudo_css( pseudo_css ):
#   pseudo_css_line_re = re.compile( r'\[ (?P<range_literal> [^ \] ]+ ) \]', re.X )
#   R = []
#   for [ fontnick, ranges_txt ] in pseudo_css:
#     # print( '^3337^', fontnick, ranges_txt )
#     for range_literal in pseudo_css_line_re.findall( ranges_txt ):
#       lohi       = range_literal.split( '-' )
#       lohi[ 0 ]  = ord( lohi[ 0 ] )
#       if len( lohi ) == 1:
#         lohi.append( lohi[ 0 ] )
#       else:
#         lohi[ 1 ]  = ord( lohi[ 1 ] )
#       segment = ( lohi[ 0 ], lohi[ 1 ], )
#       R.append( { 'fontnick': fontnick, 'segment': segment, } )
#   return R

# #-----------------------------------------------------------------------------------------------------------
# def difference( a, b ):
#   pass
#   # const _subtract = (subrange) => {
#   #     let i = 0;
#   #     while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
#   #         i++;
#   #     }
#   #     let newRanges = this.ranges.slice(0, i);
#   #     while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
#   #         newRanges = newRanges.concat(this.ranges[i].difference(subrange));
#   #         i++;
#   #     }
#   #     this.ranges = newRanges.concat(this.ranges.slice(i));
#   #     this._update_length();
#   # };

#   # if (a instanceof DRange) {
#   #     a.ranges.forEach(_subtract);
#   # } else {
#   #     if (b == null) b = a;
#   #     _subtract(new SubRange(a, b));
#   # }
#   # return this;

# #-----------------------------------------------------------------------------------------------------------
# def disjunct_segments_from_pseudo_css( pseudo_css ):
#   R = {}
#   segments  = segments_from_pseudo_css( pseudo_css )
#   s0        = segments[ 0 ][ 'segment' ]
#   for s in segments:
#     print( '^8887^', s[ 'segment' ], segments_overlap( s[ 'segment' ], segments[ 7 ][ 'segment' ] ) )

# ############################################################################################################
# if __name__ == '__main__':
#   # disjunct_segments_from_pseudo_css( pseudo_css_configuration )
#   from typing import NamedTuple, Union, NewType, Tuple

#   class EX( TypeError, ValueError ): pass

#   class Segment( NamedTuple ):
#     lo:   int
#     hi:   int

#   # gen_segment = NewType( 'gen_segment', Union( Segment, tuple ) )
#   mono_int    = Tuple[ int ]
#   bi_int      = Tuple[ int, int ]
#   gen_segment = Union[ Segment, mono_int, bi_int, ]

#   def new_segment( lo: int, hi: int = None ):
#     if isinstance( lo, Segment ):
#       if hi != None: raise EX( "cannot give second argument when first is a segment" )
#       return lo
#     if isinstance( lo, tuple ):
#       if hi != None: raise EX( "cannot give second argument when first is a segment" )
#       if len( lo ) != 2:
#         raise EX( f"expected a tuple of length 2, got one with length {len( lo )}")
#       return new_segment( lo[ 0 ], lo[ 1 ] )
#     if hi == None: hi = lo
#     if not isinstance( lo, int ): raise EX( f"expected an integer, got a {type(lo)}" )
#     if not isinstance( hi, int ): raise EX( f"expected an integer, got a {type(hi)}" )
#     if not lo <= hi: raise EX( f"expected lo <= hi, got {lo} and {hi}" )
#     return Segment( lo, hi )

#   def overlaps( me: gen_segment, other: gen_segment ) -> bool:
#     if not isinstance( me,    Segment ): me     = new_segment( me    )
#     if not isinstance( other, Segment ): other  = new_segment( other )
#     print( '^332^', me, other, me.lo, me.lo < other.hi, me.hi, me.hi > other.lo )
#     return not ( ( me.lo < other.hi ) or ( me.hi > other.lo ) )

#   def test():
#     assert 1 == 1, "should be equal"
#     assert 1 != 2, "should be equal"
#     assert type( new_segment( 42, 48 ) ) == Segment
#     assert type( new_segment( 42, 48 ) ) != tuple
#     assert new_segment( 42, 48 ) == ( 42, 48 )
#     # print( new_segment( 42, 48.3 ) )
#     # print( new_segment( 42, 0 ) )
#     print( new_segment( 42 ) )
#     print( new_segment( ( 42 ) ) ) ### TAINT shouldn't work ###
#     print( new_segment( ( 42, 108 ) ) )
#     print( new_segment( new_segment( 42 ) ) )
#     s1 = new_segment( 10, 20 )
#     s2 = new_segment( 10, 20 )
#     s3 = new_segment( 15, 15 )
#     s4 = new_segment( 15, 25 )
#     s5 = new_segment( 20, 25 )
#     s5 = new_segment( 21, 25 )
#     print( '^334-1^', overlaps( s1, s1 ) )
#     print( '^334-2^', overlaps( s1, s2 ) )
#     print( '^334-3^', overlaps( s1, s3 ) )
#     print( '^334-4^', overlaps( s1, s4 ) )
#     print( '^334-5^', overlaps( s1, s5 ) )
#     print( '^334-6^', overlaps( ( 10, 20 ), ( 15, 18 ) ) )

#   test()




# thx to https://www.geeksforgeeks.org/word-wrap-problem-dp-19/
# This code is contributed by sahil shelangia

# A Dynamic programming solution
# for Word Wrap Problem

# A utility function to print
# the solution
# word_lengths[] represents lengths of different
# words in input sequence. For example,
# word_lengths[] = {3, 2, 2, 5} is for a sentence
# like "aaa bb cc ddddd". word_count is size of
# word_lengths[] and line_width is line width ( maximum no.
# of characters that can fit in a line )

infinity = float( 'inf' )

#-----------------------------------------------------------------------------------------------------------
def get_badness ( line_width, local_word_count, extraspace_count ):
  return extraspace_count
  # return extraspace_count ** 2
  # return extraspace_count ** 3

#-----------------------------------------------------------------------------------------------------------
def solveWordWrap ( word_lengths, word_count, line_width ):
  # For simplicity, 1 extra space is used in all below arrays.
  #.........................................................................................................
  # * extras[ i ][ j ] will have number of extra spaces if words from i to j are put in a single line
  # * lc[ i ][ j ] will have cost of a line which has words from i to j
  extras  = [ [ 0 for i in range( word_count + 1 ) ] for i in range( word_count + 1 ) ]
  lc      = [ [ 0 for i in range( word_count + 1 ) ] for i in range( word_count + 1 ) ]
  #.........................................................................................................
  # * c[ i ] will have total cost of optimal arrangement of words from 1 to i
  # * p[] is used to print the solution.
  c       = [ 0, ] * ( word_count + 1 )
  p       = [ 0, ] * ( word_count + 1 )
  #.........................................................................................................
  # calculate extra spaces in a single line. The value extra[ i ][ j ] indicates extra spaces if words from
  # word number i to j are placed in a single line
  for i in range( word_count + 1 ):
    local_word_count  = 1
    extras[ i ][ i ]  = get_badness( line_width, local_word_count, line_width - word_lengths[ i - 1 ] )
    for j in range( i + 1, word_count + 1 ):
      local_word_count  = j + 1
      extraspace_count  = extras[ i ][ j - 1 ] - word_lengths[ j - 1 ] - 1
      extras[ i ][ j ]  = get_badness( line_width, local_word_count, extraspace_count )
  #.........................................................................................................
  # Calculate line cost corresponding to the above calculated extra spaces. The value lc[ i ][ j ] indicates
  # cost of putting words from word number i to j in a single line
  for i in range( word_count + 1 ):
    for j in range( i, word_count + 1 ):
      if extras[ i ][ j ] < 0:
        lc[ i ][ j ] = infinity
      elif j == word_count and extras[ i ][ j ] >= 0:
        lc[ i ][ j ] = 0
      else:
        lc[ i ][ j ] = ( extras[ i ][ j ] * extras[ i ][ j ] )
  for x in extras:
    print( "^2227^ extras:", x )
  for x in lc:
    print( "^2227^ lc:", x )
  #.........................................................................................................
  # Calculate minimum cost and find minimum cost arrangement. The value c[ j ] indicates optimized cost to
  # arrange words from word number 1 to j.
  c[ 0 ] = 0
  for j in range( 1, word_count + 1 ):
    c[ j ] = infinity
    for i in range( 1, j + 1 ):
      if c[ i - 1 ]   == infinity: continue
      if lc[ i ][ j ] == infinity: continue
      xxx = c[ i - 1 ] + lc[ i ][ j ]
      if xxx >= c[ j ]: continue
      c[ j ] = xxx
      p[ j ] = i
  return p

#-----------------------------------------------------------------------------------------------------------
def printSolution( words, line_width, p, word_count ):
  print( '^2322^', p )
  k = 0
  if p[ word_count ] == 1:
    k = 1
  else:
    k = printSolution( words, line_width, p, p[ word_count ] - 1 ) + 1
  first_word_idx  = p[ word_count ] - 1
  last_word_idx   = word_count - 1
  # print( 'Line number ', k, ': From word no. ', first_word_idx, 'to ', last_word_idx )
  # print( [ words[ idx ] for idx in range( first_word_idx, last_word_idx ) ] )
  print( ' '.join( words[ idx ] for idx in range( first_word_idx, last_word_idx + 1 ) ) )
  return k

#-----------------------------------------------------------------------------------------------------------
def demo():
  import re
  text            = "Tushar Roy likes to code"
  words           = re.split( '\s+', text )
  print( "^786^ words:", words )
  word_lengths    = list( len( word ) for word in words )
  word_count      = len( word_lengths )
  line_width      = 10
  p               = solveWordWrap( word_lengths, word_count, line_width )
  printSolution( words, line_width, p, word_count )

############################################################################################################
if __name__ == '__main__':
  demo()



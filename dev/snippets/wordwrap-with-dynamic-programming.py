
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
import random as _RND

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
  # define two square matrix extraSpace and lineCost of order (size + 1)
  # define two array totalCost and solution of size (size + 1)
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
  # for x in extras:
  #   print( "^2227^ extras:", x )
  # for x in lc:
  #   print( "^2227^ lc:", x )
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
def justify( words, line_width ):
  #.........................................................................................................
  word_count = len( words )
  if word_count == 0: raise ValueError( "^3322^ expected list with at least 1 element, got empty list" )
  if word_count == 1: return words[ 0 ]
  #.........................................................................................................
  length = sum( len( word ) for word in words ) + word_count - 1
  if length >= line_width: return ' '.join( words )
  if word_count == 2:
    return ( ' ' * ( line_width - length + 1 ) ).join( words )
  #.........................................................................................................
  idxs  = list( idx for idx in range( 0, word_count - 1 ) )
  found = False
  while True:
    _RND.shuffle( idxs )
    # print( '^33376^', idxs )
    for idx in idxs:
      # if _RND.random() < 0.5: continue
      words[ idx ] += ' '
      length += +1
      if length >= line_width:
        found = True
        break
    if found: break
  #.........................................................................................................
  return ' '.join( words )

#-----------------------------------------------------------------------------------------------------------
def printSolution( words, line_width, line_breaks ):
  for idx, line in enumerate( get_lines( words, line_width, line_breaks ) ):
    line_txt = justify( line, line_width )
    line_nr = idx + 1
    print( f"{line_nr:20}|{line_txt:{line_width}}|" )

#-----------------------------------------------------------------------------------------------------------
def get_lines( words, line_width, line_breaks ):
  R         = []
  last_idx  = len( words )
  idxs      = list( i - 1 for i in line_breaks )
  # print( '^27^', f"line_breaks:   {line_breaks}" )
  # print( '^27^', f"idxs:          {idxs}" )
  while True:
    if last_idx < 1: break
    first_idx = idxs[ last_idx ]
    line      = words[ first_idx : last_idx ]
    last_idx  = first_idx
    # print( '^2223^', line, first_idx, last_idx )
    R.append( line )
  R.reverse()
  return R

#-----------------------------------------------------------------------------------------------------------
def demo():
  import re
  text            = "Tushar Roy likes to code"
  text            = "Geeks for Geeks presents word wrap problem"
  text            = """a b c d e
                    f g h i j
                    k l m n o
                    p
                    qqqqqqqqq"""
  text            = 'x ' * 200
  text            = "aaaaaa bbb ccccc dd eeee"
  text            = "000000 111 22222 33 4444 55"
  text            = "000000 111 22222 33 4444 5555555555"
  text            = "aaaaaa bbb ccccc dd eeee xxxxxxxxxxx"
  text            = "aaaaaa bbb cccccccccc dd eeee xx"
  text            = "aaaaaa bbb ccccccccccc dd eeee xx"
  text            = "supercalifragilistic is a song from the film Mary Poppins, written by the Sherman Brothers."
  text            = """Hercules (/ˈhɜːrkjuliːz, -jə-/) is a Roman hero and god. He was the Roman equivalent
                      of the Greek divine hero Heracles, who was the son of Zeus (Roman equivalent Jupiter)
                      and the mortal Alcmene. In classical mythology, Hercules is famous for his strength
                      and for his numerous far-ranging adventures."""
  text            = re.sub( r'\n', ' ', text )
  text            = re.sub( r'\s+', ' ', text )
  text            = text.strip()
  _words          = re.split( r'\s+', text )
  words           = []
  # print( "^786^ words:", words )
  line_width      = 50
  for word in _words:
    word_length = len( word )
    if word_length > line_width:
      words.append( word[ : line_width ] )
      words.append( '█' * ( word_length - line_width ) )
    else:
      words.append( word )
  word_lengths    = list( len( word ) for word in words )
  word_count      = len( word_lengths )
  p               = solveWordWrap( word_lengths, word_count, line_width )
  printSolution( words, line_width, p )
  # print( get_lines( words, line_width, p ) )

############################################################################################################
if __name__ == '__main__':
  demo()



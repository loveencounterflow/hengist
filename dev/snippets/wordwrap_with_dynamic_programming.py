
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
def get_badness( line_width, local_word_count, extraspace_count ):
  return extraspace_count # ** 3
  # return extraspace_count ** 2
  # return extraspace_count ** 3

#-----------------------------------------------------------------------------------------------------------
def new_matrix( x, y = None, value = 0 ):
  if y == None: y = x
  return [ [ value for i in range( x + 1 ) ] for j in range( y + 1 ) ]

#-----------------------------------------------------------------------------------------------------------
def new_vector( x, value = 0 ):
  return [ value for i in range( x + 1 ) ]

#-----------------------------------------------------------------------------------------------------------
def wrap_monospaced_dp( word_lengths, word_count, line_width ):
  # For simplicity, 1 extra space is used in all below arrays.
  #.........................................................................................................
  # * `demerits[ i ][ j ]` will have number of extra spaces if words from `i` to `j` are put in a single
  #   line
  # * `lc[ i ][ j ]` will have cost of a line which has words from `i` to `j`
  demerits          = new_matrix( word_count, value = 0 )
  extra_spc_counts  = new_matrix( word_count, value = 0 )
  lc                = new_matrix( word_count, value = 0 )
  #.........................................................................................................
  # * `optimal_costs[ i ]` will have total cost of optimal arrangement of words from `1` to `i`
  # * `line_breaks[]` contains indexes into `word_lengths`
  optimal_costs     = new_vector( word_count, value = 0 )
  line_breaks       = new_vector( word_count, value = 0 )
  #.........................................................................................................
  # calculate extra spaces in a single line. The value `demerits[ i ][ j ]` indicates extra spaces if words
  # from word number `i` to `j` are placed in a single line
  for i in range( word_count + 1 ):
    extra_spc_counts[ i ][ i ] = line_width - word_lengths[ i - 1 ]
    for j in range( i + 1, word_count + 1 ):
      extra_spc_counts[ i ][ j ] = extra_spc_counts[ i ][ j - 1 ] - word_lengths[ j - 1 ] - 1
  #.........................................................................................................
  # Calculate demerits
  for i in range( word_count + 1 ):
    local_word_count    = 1
    demerits[ i ][ i ]  = get_demerit( line_width, local_word_count, line_width - word_lengths[ i - 1 ] )
    for j in range( i + 1, word_count + 1 ):
      local_word_count    = j + 1
      demerits[ i ][ j ]  = get_demerit( line_width, local_word_count, extra_spc_counts[ i ][ j ] )
  #.........................................................................................................
  # Calculate line cost corresponding to the above calculated extra spaces. The value `lc[ i ][ j ]`
  # indicates cost of putting words from word number `i` to `j` in a single line
  for i in range( word_count + 1 ):
    for j in range( i, word_count + 1 ):
      demerit = demerits[ i ][ j ]
      if demerit < 0:                         lc[ i ][ j ] = infinity
      elif j == word_count and demerit >= 0:  lc[ i ][ j ] = 0
      else:                                   lc[ i ][ j ] = demerit
  #.........................................................................................................
  # Calculate minimum cost and find minimum cost arrangement. The value `optimal_costs[ j ]` indicates
  # optimized cost to arrange words from word number `1` to `j`.
  optimal_costs[ 0 ] = 0
  for j in range( 1, word_count + 1 ):
    optimal_costs[ j ] = infinity
    for i in range( 1, j + 1 ):
      if optimal_costs[ i - 1 ]   == infinity: continue
      if lc[ i ][ j ]             == infinity: continue
      optimal_cost = optimal_costs[ i - 1 ] + lc[ i ][ j ]
      if optimal_cost >= optimal_costs[ j ]: continue
      optimal_costs[  j ] = optimal_cost
      line_breaks[    j ] = i
  return line_breaks

#-----------------------------------------------------------------------------------------------------------
def lines_from_line_breaks( words, line_breaks ):
  R         = []
  last_idx  = len( words )
  idxs      = list( i - 1 for i in line_breaks )
  while True:
    if last_idx < 1: break
    first_idx = idxs[ last_idx ]
    line      = words[ first_idx : last_idx ]
    last_idx  = first_idx
    R.append( line )
  R.reverse()
  return R


############################################################################################################
if __name__ == '__main__':
  pass



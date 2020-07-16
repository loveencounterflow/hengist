
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
  lines     = get_lines( words, line_width, line_breaks )
  last_idx  = len( lines ) - 1
  print()
  for idx, line in enumerate( lines ):
    if idx == last_idx:
      line_txt = ' '.join( line )
    else:
      line_txt = justify( line, line_width )
    # line_nr = idx + 1
    # print( f"{line_nr:20}|{line_txt:{line_width}}|" )
    print( f"{'':20} {line_txt:{line_width}}" )
  print()

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
  # text            = """\xa0\xa0In olden times when wishing still helped one, there lived a king whose daughters were
  text            = """__In olden times when wishing still helped one, there lived a king whose daughters were
                      all beautiful, but the youngest was so beautiful that the sun itself, which has seen so
                      much, was astonished whenever it shone in her face.

                      Close by the king's castle lay a great dark forest, and under an old lime-tree in the
                      forest was a well, and when the day was very warm, the king's child went out into the
                      forest and sat down by the side of the cool fountain, and when she was bored she took
                      a golden ball, and threw it up on high and caught it, and this ball was her favorite
                      plaything.

                      Now it so happened that on one occasion the princess's golden ball did not fall into
                      the little hand which she was holding up for it, but on to the ground beyond, and
                      rolled straight into the water. The king's daughter followed it with her eyes, but it
                      vanished, and the well was deep, so deep that the bottom could not be seen. At this
                      she began to cry, and cried louder and louder, and could not be comforted.

                      And as she thus lamented someone said to her, "What ails you, king's daughter? You
                      weep so that even a stone would show pity."

                      She looked round to the side from whence the voice came, and saw a frog stretching
                      forth its big, ugly head from the water.

                      "Ah, oldwater-splasher, is it you," she said, "I am weeping for my golden ball, which
                      has fallen into the well."

                      "Be quiet, and do not weep," answered the frog, "I can help you, but what will you
                      give me if I bring your plaything up again?"

                      "Whatever you will have, dear frog," said she, "My clothes, my pearls and jewels, and
                      even the golden crown which I am wearing."

                      The frog answered, "I do not care for your clothes, your pearls and jewels, nor for
                      your golden crown, but if you will love me and let me be your companion and
                      play-fellow, and sit by you at your little table, and eat off your little golden
                      plate, and drink out of your little cup, and sleep in your little bed - if you will
                      promise me this I will go down below, and bring you your golden ball up again."

                      "Oh yes," said she, "I promise you all you wish, if you will but bring me my ball back
                      again." But she thought, "How the silly frog does talk. All he does is to sit in the
                      water with the other frogs, and croak. He can be no companion to any human being."

                      But the frog when he had received this promise, put his head into the water and sank
                      down; and in a short while came swimming up again with the ball in his mouth, and
                      threw it on the grass.

                      The king's daughter was delighted to see her pretty plaything once more, and picked it
                      up, and ran away with it. "Wait, wait," said the frog. "Take me with you. I can't run
                      as you can." But what did it avail him to scream his croak, croak, after her, as
                      loudly as he could. She did not listen to it, but ran home and soon forgot the poor
                      frog, who was forced to go back into his well again.

                      The next day when she had seated herself at table with the king and all the courtiers,
                      and was eating from her little golden plate, something came creeping splish splash,
                      splish splash, up the marble staircase, and when it had got to the top, it knocked at
                      the door and cried, "Princess, youngest princess, open the door for me."

                      She ran to see who was outside, but when she opened the door, there sat the frog in
                      front of it. Then she slammed the door to, in great haste, sat down to dinner again,
                      and was quite frightened.

                      The king saw plainly that her heart was beating violently, and said, "My child, what
                      are you so afraid of? Is there perchance a giant outside who wants to carry you away?"

                      "Ah, no," replied she. "It is no giant but a disgusting frog. Yesterday as I was in
                      the forest sitting by the well, playing, my golden ball fell into the water. And
                      because I cried so, the frog brought it out again for me, and because he so insisted,
                      I promised him he should be my companion, but I never thought he would be able to come
                      out of his water. And now he is outside there, and wants to come in to me."

                      In the meantime it knocked a second time, and cried, "Princess, youngest princess,
                      open the door for me, do you not know what you said to me yesterday by the cool waters
                      of the well. Princess, youngest princess, open the door for me."

                      Then said the king, "That which you have promised must you perform. Go and let him
                      in."

                      She went and opened the door, and the frog hopped in and followed her, step by step,
                      to her chair. There he sat and cried, "Lift me up beside you."

                      She delayed, until at last the king commanded her to do it. Once the frog was on the
                      chair he wanted to be on the table, and when he was on the table he said, "Now, push
                      your little golden plate nearer to me that we may eat together."
                      """
  text            = "the im- mediately following week"
  text            = "Tushar Roy likes to code"
  text            = "xxxx x xxxx xxxxx xx xx xxxxx x xx xxxxxxx xxxxx xxx xxxx xxx xxxxx x x xxx xxxx xxx xx xx xxxxxxx x xxxx xx xxxx xxx xxx xx"
  text            = re.sub( r'\n', ' ', text )
  text            = re.sub( r'\x20+', ' ', text )
  text            = text.strip()
  _words          = re.split( r'\x20+', text )
  words           = []
  # print( "^786^ words:", words )
  line_width      = 32
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



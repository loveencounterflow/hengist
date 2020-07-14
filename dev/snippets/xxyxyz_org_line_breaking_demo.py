
"""

# Comment:

All algorithms in xxyxyz_org_line_breaking deliver (apparently) the same results, and they all have the same
flaw: when lines get longer, too much whitespace is left on all lines:

```bash
$ python3.6 dev/snippets/xxyxyz_org_line_breaking_demo.py
line width set to 125
----------------------------------------------------
dynamic             |Hercules (/ˈhɜːrkjuliːz, -jə-/) is a Roman hero and god. He was the Roman equivalent of the Greek                            |
                    |divine hero Heracles, who was the son of Zeus (Roman equivalent Jupiter) and the mortal Alcmene. In                          |
                    |classical mythology, Hercules is famous for his strength and for his numerous far-ranging adventures.                        |
```

Compare this to the output of `wordwrap-with-dynamic-programming`:

```bash
$ python3.6 dev/snippets/wordwrap-with-dynamic-programming.py
                    |Hercules (/ˈhɜːrkjuliːz, -jə-/) is a Roman hero and god. He was the Roman equivalent of the Greek divine hero Heracles, who  |
                    |was the son of Zeus (Roman equivalent Jupiter) and the mortal Alcmene. In classical mythology, Hercules is famous for his    |
                    |strength and for his numerous far-ranging adventures.                                                                        |
```

This fault seems to appear at some arbitrary line length.

"""




############################################################################################################
import xxyxyz_org_line_breaking as XX

#-----------------------------------------------------------------------------------------------------------
def show( title, width, lines ):
  print( '----------------------------------------------------' )
  for line in lines:
    print( f"{title:20}|{line:{width}}|" )
    title = ''

#-----------------------------------------------------------------------------------------------------------
def demo():
  import re
  text            = "Tushar Roy likes to code"
  text            = "Geeks for Geeks presents word wrap problem"
  # text            = "a b c d e f g h i j k l m n o p qqqqqqqqq"
  text            = """Hercules (/ˈhɜːrkjuliːz, -jə-/) is a Roman hero and god. He was the Roman equivalent
                      of the Greek divine hero Heracles, who was the son of Zeus (Roman equivalent Jupiter)
                      and the mortal Alcmene. In classical mythology, Hercules is famous for his strength
                      and for his numerous far-ranging adventures."""
  text            = 'x ' * 200
  text            = "aaaaaa bbb ccccc dd eeee xxxxxxxxxxx"
  text            = re.sub( r'\n', ' ', text )
  text            = re.sub( r'\s+', ' ', text )
  text            = text.strip()
  width           = 10
  # width           = max( 9, *( len( word ) for word in ' '.split( text ) ) )
  print( f"line width set to {width}" )
  # show( 'naive',    width, XX.naive(    text, width ) )
  show( 'dynamic',  width, XX.dynamic(  text, width ) )
  # show( 'shortest', width, XX.shortest( text, width ) )
  # show( 'binary',   width, XX.binary(   text, width ) )
  # show( 'linear',   width, XX.linear(   text, width ) )
  show( 'linear2',  width, XX.linear2(  text, width ) )
  show( 'divide',   width, XX.divide(   text, width ) )

############################################################################################################
if __name__ == '__main__':
  demo()




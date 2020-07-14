

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
  text            = re.sub( '\n', ' ', text )
  text            = re.sub( '\s+', ' ', text )
  width           = 12
  show( 'naive',    width, XX.naive(    text, width ) )
  show( 'dynamic',  width, XX.dynamic(  text, width ) )
  show( 'shortest', width, XX.shortest( text, width ) )
  show( 'binary',   width, XX.binary(   text, width ) )
  show( 'linear',   width, XX.linear(   text, width ) )
  show( 'divide',   width, XX.divide(   text, width ) )

############################################################################################################
if __name__ == '__main__':
  demo()




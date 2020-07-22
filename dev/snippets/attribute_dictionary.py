



class AttributeDict(dict):
  def __getattr__(self, attr):
    return self[attr]
  def __setattr__(self, attr, value):
    self[attr] = value


def demo():
  import json as JSON
  d     = AttributeDict()
  d.foo = 'bar'
  print( d )
  print( repr( d ) )
  print( JSON.dumps( d ) )


############################################################################################################
# if __name__ is '__main__':
demo()





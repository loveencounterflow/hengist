
sleep = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
text  = """just a generator demo"""

if module is require.main then do =>
  console.log 'helo'
  words = text.split /\s+/
  console.log words
  for word in words
    console.log word
    # await sleep 0.1
  process.stderr.write "and hello over the other channel!\n"


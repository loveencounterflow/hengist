
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTL'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
H                         = require '../../../lib/helpers'
MMX                       = require 'multimix/lib/cataloguing'

debug '^474^', MMX.all_keys_of Intl

###
getCanonicalLocales
DateTimeFormat
NumberFormat
Collator
PluralRules
RelativeTimeFormat
ListFormat
Locale
DisplayNames
Segmenter
###

#-----------------------------------------------------------------------------------------------------------
demo_segmenter = ->
  do =>
    segmenterFr = new Intl.Segmenter 'fr', { granularity: 'word' }
    string1 = 'Que ma joie demeure'
    iterator1 = segmenterFr.segment(string1)[Symbol.iterator]();
    # console.log(iterator1.next().value.segment);
    # console.log(iterator1.next().value.segment);
    H.tabulate 'segments', iterator1
    # for d from iterator1
    #   help d
    return null
  do =>
    segmenter = new Intl.Segmenter 'ja-JP', { granularity: 'word' }
    text      = "吾輩は猫である。名前はたぬき。"
    iterator1 = segmenter.segment text
    H.tabulate 'segments', iterator1
  do =>
    segmenter = new Intl.Segmenter 'ko-KR', { granularity: 'grapheme' }
    text      = "서울특별시는 대한민국의 수도이자 최대 도시이다."
    # text      = text.normalize 'NFC'
    # text      = text.normalize 'NFKD'
    text      = text.normalize 'NFD'
    help Array.from text
    iterator1 = segmenter.segment text
    H.tabulate 'segments', iterator1
  do =>
    segmenter = new Intl.Segmenter 'ko-KR', { granularity: 'word' }
    text      = "吾輩は猫である。名前はたぬき。서울특별시는 대한민국의 수도이자 최대 도시이다."
    iterator1 = segmenter.segment text
    H.tabulate 'segments', iterator1
  return null


############################################################################################################
if module is require.main then do =>
  demo_segmenter()

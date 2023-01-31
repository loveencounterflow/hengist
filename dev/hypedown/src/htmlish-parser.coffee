
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DATAMILL/DOCUMENT'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
_HTMLISH                  = ( require 'paragate/lib/htmlish.grammar' ).new_grammar { bare: true, }
{ lets
  freeze
  thaw }                  = GUY.lft
TIMETUNNEL                = require 'timetunnel'
{ Pipeline
  $ }                     = require 'moonriver'
new_markdown_parser       = require 'markdown-it'


#===========================================================================================================
### TAINT use more relaxed syntax for names ###
# G: grouped
# O: optional
xncr          = {}
xncr.nameG    = ( ///     (?<name>      [a-z][a-z0-9]* )       /// ).source
xncr.nameOG   = ( /// (?: (?<csg>   (?: [a-z][a-z0-9]* ) ) | ) /// ).source
xncr.hexG     = ( /// (?:     x  (?<hex> [a-fA-F0-9]+ )      ) /// ).source
xncr.decG     = ( ///            (?<dec> [      0-9]+ )        /// ).source
xncr.matcher  = /// ^ & #{xncr.nameG} ; | & #{xncr.nameOG} \# (?: #{xncr.hexG} | #{xncr.decG} ) ; $ ///
xncr.splitter = /// ( & [^\s;]+ ; ) ///


#===========================================================================================================
class @Htmlish

  #---------------------------------------------------------------------------------------------------------
  @C: GUY.lft.freeze
    xncr: xncr

  # #---------------------------------------------------------------------------------------------------------
  # constructor: ->
  #   return undefined

  #---------------------------------------------------------------------------------------------------------
  _tunnel: ( text ) ->
    ### TAINT do not reconstruct tunnel for each call ###
    # guards    = 'äöüßp'
    # guards    = '①②③④⑤'
    guards    = '¥₽₨฿₮'
    intalph   = '0123456789'
    tnl       = new TIMETUNNEL.Timetunnel { guards, intalph, }
    tnl.add_tunnel TIMETUNNEL.tunnels.keep_backslash
    # tnl.add_tunnel TIMETUNNEL.tunnels.remove_backslash
    text      = tnl.hide text
    return { text, reveal: ( tnl.reveal.bind tnl ), }

  #---------------------------------------------------------------------------------------------------------
  _entity_token_from_match: ( d, start, stop, match ) ->
    g         = match.groups
    R         = { d..., }
    R.$key    = '^entity'
    R.text    = match[ 0 ]
    R.start   = start
    R.stop    = stop
    if g.name?
      R.type    = 'named'
      R.name    = g.name
    else
      R.type    = if g.csg? then 'xncr' else 'ncr'
      R.csg     = g.csg if g.csg?
      R.$value  = parseInt g.hex ? g.dec, ( if g.hex? then 16 else 10 )
    return R

  #---------------------------------------------------------------------------------------------------------
  _text_token_from_part: ( d, start, stop, part ) ->
    R       = { d..., }
    R.text  = part
    R.start = start
    R.stop  = stop
    return R


  #=========================================================================================================
  #
  #---------------------------------------------------------------------------------------------------------
  $tunnel: ( tunnel_wrap ) -> ( text, send ) =>
    { text
      reveal          } = @_tunnel text
    tunnel_wrap.reveal  = reveal
    send text
    return null

  #---------------------------------------------------------------------------------------------------------
  $reveal_tunneled_text: ( tunnel_wrap ) -> ( d, send ) =>
    return send d unless ( d.$key is '^text' ) or ( d.$key is '^rawtext' )
    d.text = tunnel_wrap.reveal d.text
    send d

  #---------------------------------------------------------------------------------------------------------
  $transpile_markdownish: ->
    mdit_cfg =
      html:         true          # Enable HTML tags in source
      xhtmlOut:     false         # Use '/' to close single tags (<br />).
      breaks:       false         # Convert '\n' in paragraphs into <br>
      langPrefix:   'language-'   # CSS language prefix for fenced blocks.
      linkify:      false         # Autoconvert URL-like text to links
      typographer:  false         # see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
      quotes:       '“”‘’'        # '„“‚‘' for German, ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French
      highlight:    null          # function (/*str, lang*/) { return ''; }
    # md = ( require 'markdown-it' ) 'zero'
    md = new_markdown_parser mdit_cfg
    md.enable 'emphasis'
    # md.enable 'autolink'
    md.enable 'backticks'
    md.disable 'entity'
    # md.enable 'escape'
    # md.enable 'html_inline'
    # md.enable 'image'
    md.enable 'link'
    # md.enable 'newline'
    # md.enable 'text'
    # md.enable 'balance_pairs'
    # md.enable 'text_collapse'
    md.disable 'smartquotes'
    return ( text, send ) =>
      text  = md.renderInline text
      ### TAINT didn't find a way to keep markdown-it from escaping `<`, `&`; as a hotfix, undo these: ###
      text  = text.replace /&lt;/g,   '<'
      text  = text.replace /&amp;/g,  '&'
      send text

  #---------------------------------------------------------------------------------------------------------
  $parse_htmlish: -> ( text, send ) => send d for d in thaw _HTMLISH.parse text

  #---------------------------------------------------------------------------------------------------------
  $add_location: -> ( d, send ) =>
    [ lnr
      col       ] = d.$vnr ? [ null, null, ]
    d.delta_lnr   = lnr - 1
    d.col         = col
    send d

  #---------------------------------------------------------------------------------------------------------
  $set_syntax_on_otag: ( tag_catalog ) -> ( d, send ) =>
    return send d unless ( d.$key is '<tag' )
    d.syntax = tag_catalog[ d.name ]?.syntax ? 'html'
    send d

  #---------------------------------------------------------------------------------------------------------
  $convert_nonhtml_syntax: ->
    wait_for_name = null
    return ( d, send ) =>
      if wait_for_name?
        #...................................................................................................
        if ( d.$key is '>tag' ) and ( d.name is wait_for_name )
          wait_for_name = null
          return send d
        #...................................................................................................
        e = { d..., }
        e.$key    = '^rawtext'
        e.syntax  = null
        delete e.atrs
        return send e
      #.....................................................................................................
      if ( d.$key is '<tag' ) and ( d.syntax isnt 'html' )
        wait_for_name = d.name
      #.....................................................................................................
      send d

  #---------------------------------------------------------------------------------------------------------
  $set_syntax_on_other_tokens: ( tag_catalog ) ->
    stack = [ 'html', ]
    return ( d, send ) =>
      if      ( d.$key is '<tag' )  then  stack.push d.syntax ? 'html'
      else if ( d.$key is '>tag' )  then  stack.pop()
      d.syntax = stack[ stack.length - 1 ] ? 'html'
      send d

  #---------------------------------------------------------------------------------------------------------
  $parse_ncrs: ->
    xncr_matcher  = @constructor.C.xncr.matcher
    xncr_splitter = @constructor.C.xncr.splitter
    return ( d, send ) =>
      return send d unless ( d.$key is '^text' )
      parts     = d.text.split xncr_splitter
      return send d unless parts.length > 1
      is_entity = true
      start     = 0
      #.....................................................................................................
      for part in parts
        is_entity = not is_entity
        continue if part is ''
        stop      = start + part.length
        #...................................................................................................
        if is_entity and ( match = part.match xncr_matcher )?
          send @_entity_token_from_match d, start, stop, match
        else
          send @_text_token_from_part d, start, stop, part
        #...................................................................................................
        start = stop
      return null

  #---------------------------------------------------------------------------------------------------------
  $complain_about_bareachrs: -> ( d, send ) =>
    return send d unless ( d.$key is '^text' )
    #.....................................................................................................
    if ( d.$key is '^text' )
      if ( /(?<!\\)[<&]/.test d.text )
        @_as_error d, '^ð1^', 'bareachrs', "bare active characters"
    #.....................................................................................................
    send d

  #---------------------------------------------------------------------------------------------------------
  $remove_backslashes: -> ( d, send ) =>
    return send d unless ( d.$key is '^text' )
    d.text = d.text.replace /\\</g,     '&lt;'  ### TAINT conflicts with NCR parsing ###
    d.text = d.text.replace /\\&/g,     '&amp;' ### TAINT conflicts with NCR parsing ###
    d.text = d.text.replace /\\\n/ugs,  ''    ### replace escaped newlines with empty string ###
    d.text = d.text.replace /\\(.)/ugs, '$1'  ### obliterate remaining backslashes (exc. escaped ones) ###
    send d

  #---------------------------------------------------------------------------------------------------------
  $treat_xws_in_opening_tags: -> ( d, send ) =>
    return send d unless ( d.$key is '<tag' )
    if ( d.type is 'otag' ) and ( /^<\s+/.test d.text )
      @_as_error d, '^ð1^', 'xtraows', "extraneous whitespace before tag name"
    send d

  #---------------------------------------------------------------------------------------------------------
  $treat_xws_in_closing_tags: -> ( d, send ) =>
    return send d unless ( d.$key is '>tag' )
    if ( d.type is 'ctag' ) and ( ( /^<\s*\/\s+/.test d.text ) or ( /^<\s+\/\s*/.test d.text ) )
      @_as_error d, '^ð2^', 'xtracws', "extraneous whitespace in closing tag"
    send d

  #---------------------------------------------------------------------------------------------------------
  $validate_paired_tags: ->
    stack = []
    return ( d, send ) =>
      if ( d.$key is '<tag' )
        stack.push d
        send d
      #.....................................................................................................
      else if ( d.$key is '>tag' )
        #...................................................................................................
        if stack.length is 0
          return send @_as_error d, '^ð2^', 'xtractag', "extraneous closing tag </#{d.name}>"
        #...................................................................................................
        matching_d = stack.pop()
        if d.name?
          if ( d.name != matching_d.name )
            return send @_as_error d, '^ð2^', 'nomatch', "expected </#{matching_d.name}>, got </#{d.name}>"
        #...................................................................................................
        else
          d.name = matching_d.name
        send d
      #.....................................................................................................
      else
        send d
      #.....................................................................................................
      return null

  #---------------------------------------------------------------------------------------------------------
  $relabel_rawtexts: -> ( d, send ) ->
    d.$key = '^text' if d.$key is '^rawtext'
    send d

  #---------------------------------------------------------------------------------------------------------
  $consolidate_texts: ->
    last          = Symbol 'last'
    # prv_was_text  = false
    send          = null
    collector     = []
    #.......................................................................................................
    flush = ->
      # prv_was_text      = false
      return if collector.length is 0
      d = collector[  0 ]
      if collector.length > 1
        d.text  = ( e.text for e in collector ).join ''
        d.stop  = collector[ collector.length - 1 ].stop
      send d
      collector.length  = 0
    #.......................................................................................................
    return $ { last, }, ( d, _send ) ->
      send = _send
      return flush() if d is last
      unless d.$key is '^text'
        flush()
        return send d
      collector.push d

  #---------------------------------------------------------------------------------------------------------
  $split_lines: -> ( d, send ) =>
    return send d unless ( d.$key is '^text' )
    return send d unless ( lines = d.text.split '\n' ).length > 1
    e = d
    ### TAINT makes `start`, `stop` invalid (but are thery still needed?) ###
    for line, idx in lines
      e       = { e..., }
      e.oln  += idx
      e.col   = 1 unless idx is 0
      e.text  = line
      send e
    return null

  #---------------------------------------------------------------------------------------------------------
  parse: ( text, tag_catalog = null ) ->
    ### TAINT use `cfg` pattern ###
    ### TAINT do not reconstruct pipeline on each run ###
    tunnel_wrap   = {}
    R             = []
    p            = new Pipeline()
    #-------------------------------------------------------------------------------------------------------
    p.push [ text, ]
    p.push @$tunnel                         tunnel_wrap
    # p.push @$transpile_markdownish()
    p.push @$parse_htmlish()
    p.push ( text ) -> info '^394^', rpr text
    p.push @$add_location()
    p.push @$set_syntax_on_otag             tag_catalog if tag_catalog?
    p.push @$convert_nonhtml_syntax()                   if tag_catalog?
    p.push @$set_syntax_on_other_tokens     tag_catalog if tag_catalog?
    p.push @$parse_ncrs()
    p.push @$complain_about_bareachrs()
    p.push @$reveal_tunneled_text           tunnel_wrap
    p.push @$remove_backslashes()
    p.push @$treat_xws_in_opening_tags()
    p.push @$treat_xws_in_closing_tags()
    p.push @$validate_paired_tags()
    p.push @$relabel_rawtexts()
    # p.push @$consolidate_texts()
    # p.push @$split_lines()
    p.push ( d ) -> R.push d
    p.run()
    return R

  #---------------------------------------------------------------------------------------------------------
  _as_error: ( token, ref, code, message ) ->
    token.$key    = '^error'
    token.origin  = 'htmlish'
    token.code    = code
    token.message = message
    token.$       = ref
    return token

#-----------------------------------------------------------------------------------------------------------
@HTMLISH = HTMLISH = new @Htmlish()


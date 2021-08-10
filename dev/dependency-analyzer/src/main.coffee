
'use strict'


### NOTE consider to refactor this to [SCDA](https://github.com/loveencounterflow/scda) ###

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DEPENDENCY-ANALYZER'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
SQL                       = String.raw
{ lets
  freeze }                = require 'letsfreezethat'
{ Dba, }                  = require 'icql-dba'
def                       = Object.defineProperty
glob                      = require 'glob'
PATH                      = require 'path'

#===========================================================================================================
types.declare 'dpan_constructor_cfg', tests:
  '@isa.object x':        ( x ) -> @isa.object x
  'x.prefix is a prefix': ( x ) ->
    return false unless @isa.text x.prefix
    return true if x.prefix is ''
    return ( /^[_a-z][_a-z0-9]*$/ ).test x.prefix
  '@isa.boolean x.recreate': ( x ) -> @isa.boolean x.recreate

#-----------------------------------------------------------------------------------------------------------
types.defaults =
  dpan_constructor_cfg:
    dba:        null
    prefix:     'dpan_'
    db_path:    PATH.resolve PATH.join __dirname, '../dpan.sqlite'
    recreate:   false


#===========================================================================================================
class Dpan

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    validate.dpan_constructor_cfg @cfg = { types.defaults.dpan_constructor_cfg..., cfg..., }
    debug '^4877^', @cfg
    #.......................................................................................................
    dba  = if @cfg.dba? then @cfg.dba else new Dba()
    def @, 'dba', { enumerable: false, value: dba, }
    delete @cfg.dba
    @cfg = freeze @cfg
    #.......................................................................................................
    if @cfg.db_path?
      @dba.open { path: @cfg.db_path, }
    #.......................................................................................................
    @_clear_db() if @cfg.recreate
    @_create_db_structure()
    @_compile_sql()
    # @_create_sql_functions()
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _create_db_structure: ->
    prefix = @cfg.prefix
    @dba.execute SQL"""
      create table if not exists #{prefix}packages (
          name        text    not null,
          version     text    not null,
          vname       text    generated always as ( name || '@' || version ) virtual not null unique,
        primary key ( name, version ) );
      create unique index if not exists #{prefix}packages_vname_idx on #{prefix}packages ( vname );
      create table if not exists #{prefix}dependencies (
          package     text    not null references #{prefix}packages ( vname ),
          depends_on  text    not null references #{prefix}packages ( vname ),
        primary key ( package, depends_on ) );
      """
    return null

  #---------------------------------------------------------------------------------------------------------
  _clear_db: ->
    ### TAINT should be a method of ICQL/DB ###
    prefix = @cfg.prefix
    @dba.execute SQL"""
      drop index if exists #{prefix}packages_vname_idx;
      drop table if exists #{prefix}dependencies;
      drop table if exists #{prefix}packages;
      """
    return null

  #---------------------------------------------------------------------------------------------------------
  _compile_sql: ->
    prefix = @cfg.prefix
    # sql =
    #   get: SQL"""
    #     select value from #{prefix}variables
    #       where key = $key
    #       limit 1;"""
    #   set: SQL"""
    #     insert into #{prefix}variables ( key, value )
    #       values ( $key, $value )
    #       on conflict do update set value = $value;"""
    # def @, 'sql', { enumerable: false, value: sql, }
    return null

  # #---------------------------------------------------------------------------------------------------------
  # _create_sql_functions: ->

  #=========================================================================================================
  # RETRIEVE CANONICAL PACKAGE URL
  #---------------------------------------------------------------------------------------------------------
  _url_from_vpackage_d_homepage: ( vpackage_d ) ->
    if ( R = vpackage_d.homepage ? null )?
      return R.replace /#readme$/, ''
    return null

  #---------------------------------------------------------------------------------------------------------
  _url_from_vpackage_d_repository: ( vpackage_d ) ->
    if ( R = vpackage_d.repository?.url  ? null )?
      return R.replace /^(git\+)?(.+?)(\.git)?$/, '$2'
    return null

  #---------------------------------------------------------------------------------------------------------
  _url_from_vpackage_d_bugs: ( vpackage_d ) ->
    if ( R = vpackage_d.bugs?.url        ? null )?
      return R.replace /\/issues$/, ''
    return null

  #---------------------------------------------------------------------------------------------------------
  get_package_url: ( package_d, version ) ->
    unless ( vpackage_d = package_d.versions?[ version ] ? null )?
      throw new Error "^37596^ unknown version: #{rpr version}"
    return R if ( R = @_url_from_vpackage_d_homepage    vpackage_d )?
    return R if ( R = @_url_from_vpackage_d_repository  vpackage_d )?
    return R if ( R = @_url_from_vpackage_d_bugs        vpackage_d )?
    return null

  #=========================================================================================================
  #
  #---------------------------------------------------------------------------------------------------------
  walk_dependencies: ->
    home_path             = PATH.resolve PATH.join __dirname, '..'
    project_path_pattern  = PATH.join home_path, '../../../*/package.json'
    # pattern   = PATH.join home_path, '../../../*/node_modules/*'
    # pattern   = PATH.join home_path, '../../../*/node_modules/*/package.json'
    debug '^488^', project_path_pattern
    for project_path in glob.sync project_path_pattern
      package_json        = require project_path
      project_version     = package_json.version
      project_path        = PATH.dirname project_path
      project_name        = PATH.basename project_path
      project_deps        = package_json.dependencies ? {}
      project_deps_names  = Object.keys project_deps
      continue unless project_name in [ 'icql-dba-tags', 'icql-dba-vars', ]
      debug ( CND.grey project_path ), ( CND.gold project_name ), ( CND.lime project_version )
      #.....................................................................................................
      if project_deps_names.length is 0
        yield { project_name, project_version, dep_name, dep_version, is_new_project: true, }
        continue
      #.....................................................................................................
      ### TAINT issue one datom in case no dependencies found ###
      for dep_name, idx in project_deps_names
        dep_jsonb_path = PATH.join project_path, 'node_modules', dep_name, 'package.json'
        try
          dep_json = require dep_jsonb_path
        catch error
          throw error
        # debug dep_path
        dep_version      = dep_json.version
        if ( idx is 0 )
          yield { project_name, project_version, dep_name, dep_version, is_new_project: true, }
        else
          yield { project_name, project_version, dep_name, dep_version, }
        debug ' ', ( CND.gold dep_name ), ( CND.lime dep_version )
        # debug ( CND.grey dep_path ), ( CND.gold dep_name ), ( CND.lime dep_version )
    return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  dpan    = new Dpan { recreate: true, }
  debug '^332^', dpan
  prefix  = dpan.cfg.prefix
  for d from dpan.walk_dependencies()
    debug '^684^', d
    # if d.is_new_project
    ### TAINT code duplication, same logic in SQL ###
    package_vname = "#{d.project_name}@#{d.project_version}"
    dep_vname     = "#{d.dep_name}@#{d.dep_version}"
    dpan.dba.run SQL"""insert into #{prefix}packages ( name, version )
      values ( $name, $version )
      on conflict do nothing;""", { name: d.project_name, version: d.project_version, }
    dpan.dba.run SQL"""insert into #{prefix}packages ( name, version )
      values ( $name, $version )
      on conflict do nothing;""", { name: d.dep_name, version: d.dep_version, }
    dpan.dba.run SQL"""insert into #{prefix}dependencies ( package, depends_on )
      values ( $package, $depends_on )
      on conflict do nothing;""", { package: package_vname, depends_on: dep_vname, }

  return null


############################################################################################################
if module is require.main then do =>
  # demo()
  CP = require 'child_process'
  # debug '^33442^', CP.execSync "npm view icql-dba@^6 dependencies", { encoding: 'utf-8', }
  # debug '^33442^', CP.execSync "npm view icql-dba dependencies", { encoding: 'utf-8', }
  cfg =
    registry_url: 'https://registry.npmjs.org/'
  debug '^446^', cfg
  package_name  = 'icql-dba-vars'
  package_name  = 'icql-dba-tags'
  rq_url        = ( cfg.registry_url.replace /\/$/, '') + '/' + package_name
  debug '^2334^', rq_url
  got = require 'got'
  debug '^443^', rsp = await ( got rq_url ).json()
  debug '^443^', ( k for k of rsp )
  debug '^443^', ( k for k of rsp.versions )
  urge '^443^', ( k for k of rsp.versions[ '0.2.1' ] )
  debug '^443^', ( k for k of rsp.versions[ '0.2.1' ].dependencies )
  info '^443^', rsp.versions[ '0.2.1' ].description
  get_package_url rsp, '0.2.1'
  info '^443^', rsp.versions[ '0.2.1' ].dependencies





  # debug '^2334^', fetch rq_url
  # request.get( xxx, {json: true}, function (err, res, obj) {
  #   if (err || (res.statusCode < 200 || res.statusCode >= 400)) {
  #     var message = res ? 'status = ' + res.statusCode : 'error = ' + err.message
  #     _this.logger.log(
  #       'could not load ' + name + '@' + task.version + ' ' + message










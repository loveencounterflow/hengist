
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
got                       = require 'got'

  # #=========================================================================================================
  # #
  # #---------------------------------------------------------------------------------------------------------
  # walk_dependencies: ->
  #   home_path             = PATH.resolve PATH.join __dirname, '..'
  #   project_path_pattern  = PATH.join home_path, '../../../*/package.json'
  #   # pattern   = PATH.join home_path, '../../../*/node_modules/*'
  #   # pattern   = PATH.join home_path, '../../../*/node_modules/*/package.json'
  #   debug '^488^', project_path_pattern
  #   for project_path in glob.sync project_path_pattern
  #     package_json        = require project_path
  #     project_version     = package_json.version
  #     project_path        = PATH.dirname project_path
  #     project_name        = PATH.basename project_path
  #     project_deps        = package_json.dependencies ? {}
  #     project_deps_names  = Object.keys project_deps
  #     continue unless project_name in [ 'icql-dba-tags', 'icql-dba-vars', ]
  #     debug ( CND.grey project_path ), ( CND.gold project_name ), ( CND.lime project_version )
  #     #.....................................................................................................
  #     if project_deps_names.length is 0
  #       yield { project_name, project_version, dep_name, dep_version, is_new_project: true, }
  #       continue
  #     #.....................................................................................................
  #     ### TAINT issue one datom in case no dependencies found ###
  #     for dep_name, idx in project_deps_names
  #       dep_jsonb_path = PATH.join project_path, 'node_modules', dep_name, 'package.json'
  #       try
  #         dep_json = require dep_jsonb_path
  #       catch error
  #         throw error
  #       # debug dep_path
  #       dep_version      = dep_json.version
  #       if ( idx is 0 )
  #         yield { project_name, project_version, dep_name, dep_version, is_new_project: true, }
  #       else
  #         yield { project_name, project_version, dep_name, dep_version, }
  #       debug ' ', ( CND.gold dep_name ), ( CND.lime dep_version )
  #       # debug ( CND.grey dep_path ), ( CND.gold dep_name ), ( CND.lime dep_version )
  #   return null

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
    dba:          null
    prefix:       'dpan_'
    db_path:      PATH.resolve PATH.join __dirname, '../dpan.sqlite'
    recreate:     false
    registry_url: 'https://registry.npmjs.org/'


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
    ### TAINT unify name / pkg_name, version / pkg_version ###
    prefix = @cfg.prefix
    @dba.execute SQL"""
      create table if not exists #{prefix}pkgs (
          pkg_name          text    not null references #{prefix}pkg_names    ( pkg_name    ),
          pkg_version       text    not null references #{prefix}pkg_versions ( pkg_version ),
          pkg_vname         text    generated always as ( pkg_name || '@' || pkg_version ) virtual not null unique,
        primary key ( pkg_name, pkg_version ) );
      create unique index if not exists #{prefix}pkgs_vname_idx on #{prefix}pkgs ( pkg_vname );
      create table if not exists #{prefix}deps (
          pkg_vname         text    not null references #{prefix}pkgs ( pkg_vname ),
          dep_vname         text    not null references #{prefix}pkgs ( pkg_vname ),
        primary key ( pkg_vname, dep_vname ) );
      create table if not exists #{prefix}pkg_names (
          pkg_name          text not null primary key );
      create table if not exists #{prefix}pkg_versions (
          pkg_version       text not null primary key );
      """
    return null

  #---------------------------------------------------------------------------------------------------------
  _clear_db: ->
    ### TAINT should be a method of ICQL/DB ###
    prefix = @cfg.prefix
    @dba.execute SQL"""
      drop index if exists #{prefix}pkgs_vname_idx;
      drop table if exists #{prefix}deps;
      drop table if exists #{prefix}pkgs;
      drop table if exists #{prefix}pkg_names;
      drop table if exists #{prefix}pkg_versions;
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
  _npm_api_url_from_package_name: ( pkg_name ) ->
    return ( @cfg.registry_url.replace /\/$/, '' ) + '/' + pkg_name

  #---------------------------------------------------------------------------------------------------------
  _fetch_package_d_from_package_name: ( pkg_name ) ->
    rq_url        = @_npm_api_url_from_package_name pkg_name
    return await ( got rq_url ).json()

  #---------------------------------------------------------------------------------------------------------
  _package_infos_from_package_d_and_version: ( package_d, version ) ->
    R = {}
    R.pkg_name    = package_d.name
    R.pkg_version = version
    R.versions        = ( k for k of package_d.versions ? [] )
    R.url             = @get_package_url package_d, version
    R.description     = package_d.versions[ version ]?.description  ? null
    R.dependencies    = package_d.versions[ version ]?.dependencies ? null
    return R

  #---------------------------------------------------------------------------------------------------------
  fetch_package_infos: ( pkg_name, version ) ->
    package_d = await @_fetch_package_d_from_package_name pkg_name
    # debug '^443^', ( k for k of package_d )
    # debug '^443^', ( k for k of package_d.versions )
    # urge '^443^', ( k for k of package_d.versions[ '0.2.1' ] )
    # debug '^443^', ( k for k of package_d.versions[ '0.2.1' ].dependencies )
    return @_package_infos_from_package_d_and_version package_d, version

#-----------------------------------------------------------------------------------------------------------
register_package = ( dpan, pkg_name, pkg_version ) ->
  prefix          = dpan.cfg.prefix
  ### TAINT code duplication, same logic in SQL ###
  pkg_vname   = "#{pkg_name}@#{pkg_version}"
  #.........................................................................................................
  dpan._add_package_name = ( pkg_name ) ->
    @dba.run SQL"""insert into #{prefix}pkg_names ( pkg_name )
      values ( $pkg_name )
      on conflict do nothing;""", { pkg_name, }
    return null
  #.........................................................................................................
  dpan._add_package_version = ( pkg_version ) ->
    @dba.run SQL"""insert into #{prefix}pkg_versions ( pkg_version )
      values ( $pkg_version )
      on conflict do nothing;""", { pkg_version, }
    return null
  #.........................................................................................................
  dpan._add_package = ( package_info ) ->
    @_add_package_name    package_info.pkg_name
    @_add_package_version package_info.pkg_version
    @dba.run SQL"""insert into #{prefix}pkgs ( pkg_name, pkg_version )
      values ( $pkg_name, $pkg_version )
      on conflict do nothing;""", package_info
    #.......................................................................................................
    for dep_name, dep_version of package_info.dependencies
      ### TAINT code duplication, same logic in SQL ###
      dep_vname   = "#{dep_name}@#{dep_version}"
      @_add_package_name    dep_name
      @_add_package_version dep_version
      @dba.run SQL"""insert into #{prefix}pkgs ( pkg_name, pkg_version )
        values ( $pkg_name, $pkg_version )
        on conflict do nothing;""", { pkg_name: dep_name, pkg_version: dep_version, }
      @dba.run SQL"""insert into #{prefix}deps ( pkg_vname, dep_vname )
        values ( $pkg_vname, $dep_vname )
        on conflict do nothing;""", { pkg_vname, dep_vname, }
    #.......................................................................................................
    return null
  #.........................................................................................................
  package_info = await dpan.fetch_package_infos pkg_name, pkg_version
  info '^677^', JSON.stringify package_info, null, '  '
  #.........................................................................................................
  dpan._add_package package_info
  # for version in package_info.versions
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  dpan            = new Dpan { recreate: true, }
  pkgs = [
    { pkg_name: 'cnd',                pkg_version: '9.2.2', }
    { pkg_name: 'csv-parser',         pkg_version: '3.0.0', }
    { pkg_name: 'del',                pkg_version: '6.0.0', }
    { pkg_name: 'hollerith-codec',    pkg_version: '3.0.1', }
    { pkg_name: 'icql-dba',           pkg_version: '7.2.0', }
    { pkg_name: 'icql-dba-tags',      pkg_version: '0.2.1', }
    { pkg_name: 'intertype',          pkg_version: '7.6.7', }
    { pkg_name: 'is-stream',          pkg_version: '2.0.0', }
    { pkg_name: 'jsx-number-format',  pkg_version: '0.1.4', }
    { pkg_name: 'letsfreezethat',     pkg_version: '3.1.0', }
    { pkg_name: 'multimix',           pkg_version: '5.0.0', }
    { pkg_name: 'mysql-tokenizer',    pkg_version: '1.0.7', }
    { pkg_name: 'n-readlines',        pkg_version: '1.0.1', }
    { pkg_name: 'temp-dir',           pkg_version: '2.0.0', }
    { pkg_name: 'tempy',              pkg_version: '1.0.1', }
    { pkg_name: 'type-fest',          pkg_version: '0.16.0', }
    { pkg_name: 'unique-string',      pkg_version: '2.0.0', }
    ]
  for { pkg_name, pkg_version, } in pkgs
    await register_package dpan, pkg_name, pkg_version
  return null



############################################################################################################
if module is require.main then do =>
  await demo()
  # CP = require 'child_process'
  # debug '^33442^', CP.execSync "npm view icql-dba@^6 dependencies", { encoding: 'utf-8', }
  # debug '^33442^', CP.execSync "npm view icql-dba dependencies", { encoding: 'utf-8', }

f = ->
  dpan          = new Dpan()
  pkg_name  = 'icql-dba-vars'
  pkg_name  = 'icql-dba-tags'
  package_d     = await dpan._fetch_package_d_from_package_name pkg_name
  debug '^443^', ( k for k of package_d )
  debug '^443^', ( k for k of package_d.versions )
  urge '^443^', ( k for k of package_d.versions[ '0.2.1' ] )
  debug '^443^', ( k for k of package_d.versions[ '0.2.1' ].dependencies )
  package_info  = dpan._package_infos_from_package_d_and_version package_d, '0.2.1'
  info '^677^', JSON.stringify package_info, null, '  '

f = ->
  #.........................................................................................................
  for d from dpan.walk_dependencies()
    debug '^684^', d
    ### TAINT code duplication, same logic in SQL ###
    pkg_vname = "#{d.project_name}@#{d.project_version}"
    dep_vname     = "#{d.dep_name}@#{d.dep_version}"
    # if d.is_new_project
    dpan.dba.run SQL"""insert into #{prefix}pkgs ( name, version )
      values ( $name, $version )
      on conflict do nothing;""", { name: d.project_name, version: d.project_version, }
    dpan.dba.run SQL"""insert into #{prefix}pkgs ( name, version )
      values ( $name, $version )
      on conflict do nothing;""", { name: d.dep_name, version: d.dep_version, }
    dpan.dba.run SQL"""insert into #{prefix}dependencies ( package, depends_on )
      values ( $package, $depends_on )
      on conflict do nothing;""", { package: pkg_vname, depends_on: dep_vname, }
  #.........................................................................................................
  return null









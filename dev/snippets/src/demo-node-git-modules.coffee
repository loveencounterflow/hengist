
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DEMO-NODE-GIT-MODULES'
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
{ to_width }              = require 'to-width'
glob                      = require 'glob'
PATH                      = require 'path'
FS                        = require 'fs'


#-----------------------------------------------------------------------------------------------------------
demo_nodegit = ->
  NodeGit             = require 'nodegit'
  pkg_fspath          = '../../../'
  pkg_fspath          = PATH.resolve PATH.join __dirname, pkg_fspath
  repo                = await NodeGit.Repository.open pkg_fspath
  status              = await repo.getStatus()
  for d in status
    info d
  return null

#-----------------------------------------------------------------------------------------------------------
demo_gitutils = ->
  GU                  = require 'git-utils'
  pkg_fspath          = '../../../'
  pkg_fspath          = PATH.resolve PATH.join __dirname, pkg_fspath
  help '^353^', { pkg_fspath, }
  repo                = GU.open pkg_fspath
  urge repo
  #.........................................................................................................
  status_from_snr = ( snr ) =>
    R     = {}
    count = 0
    ( R.ignored   = true; count++ ) if repo.isStatusIgnored  snr
    ( R.modified  = true; count++ ) if repo.isStatusModified snr
    ( R.new       = true; count++ ) if repo.isStatusNew      snr
    ( R.deleted   = true; count++ ) if repo.isStatusDeleted  snr
    ( R.staged    = true; count++ ) if repo.isStatusStaged   snr
    R.unknown   = true if count is 0
    return R
  #.........................................................................................................
  # refs = repo.getReferences()
  # for remote in refs.remotes
  #   info remote
  abc         = repo.getAheadBehindCount 'HEAD'
  acc         = abc.ahead   ### ACC, ahead-commit  count ###
  bcc         = abc.behind  ### BCC, behind-commit count ###
  dfc         = 0           ### DFC, dirty file    count ###
  for obj_fspath, snr of repo.getStatus()
    dfc++
    info snr, obj_fspath, status_from_snr snr
  help "dfc:            ", dfc
  help "acc:            ", acc
  help "bcc:            ", bcc
  help "head:           ", repo.getHead()
  urge repo.getUpstreamBranch()
  # urge repo.getReferenceTarget 'refs/remotes/origin/HEAD'
  # help 'commits:',        repo.getCommitCount()
  repo.release()
  # debug ( k for k of repo ).sort()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_gitlog = ->
  gitlog              = ( require 'gitlog' ).default
  pkg_fspath          = '../../../'
  pkg_fspath          = PATH.resolve PATH.join __dirname, pkg_fspath
  cfg                 =
    repo:       pkg_fspath
    number:     1e6
    # fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
    execOptions: { maxBuffer: 1000 * 1024 },
  commits       = gitlog cfg
  commit_count  = commits.length
  info "commit_count:", commit_count
  for commit in commits[ .. 10 ]
    file_count  = commit.files.length
    short_hash  = commit.abbrevHash
    date        = commit.authorDate
    subject     = to_width commit.subject, 100
    urge file_count, short_hash, date, subject
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_nodegit()
  await demo_gitutils()
  await demo_gitlog()



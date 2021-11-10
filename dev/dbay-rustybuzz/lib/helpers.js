(function() {
  'use strict';
  var CND, DATA, DATOM, FS, FSP, H, PATH, badge, debug, echo, equals, help, info, isa, rpr, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DRB/TESTS/HELPERS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  // #...........................................................................................................
  // test                      = require 'guy-test'
  // jr                        = JSON.stringify
  // { inspect, }              = require 'util'
  // xrpr                      = ( x ) -> inspect x, { colors: yes, breakLength: Infinity, maxArrayLength: Infinity, depth: Infinity, }
  // xrpr2                     = ( x ) -> inspect x, { colors: yes, breakLength: 20, maxArrayLength: Infinity, depth: Infinity, }
  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  FSP = require('fs/promises');

  this.types = new (require('intertype')).Intertype();

  ({isa, validate, validate_list_of, equals} = this.types.export());

  DATA = require('../../../lib/data-providers-nocache');

  DATOM = require('datom');

  H = this;

  (() => {    //-----------------------------------------------------------------------------------------------------------
    var message;
    if (indexOf.call(process.argv, '--dbay-use-installed') >= 0) {
      H.dbay_use_installed = true;
      H.dbay_path = 'dbay';
      message = "using installed version of dbay";
    } else {
      H.dbay_use_installed = false;
      H.dbay_path = '../../../apps/dbay';
      message = "using linked dbay";
    }
    debug('^3337^', CND.reverse(message));
    process.on('exit', function() {
      return debug('^3337^', CND.reverse(message));
    });
    return null;
  })();

  (() => {    //-----------------------------------------------------------------------------------------------------------
    var message;
    if (indexOf.call(process.argv, '--drb-use-installed') >= 0) {
      H.drb_use_installed = true;
      H.drb_path = 'drb';
      message = "using installed version of drb";
    } else {
      H.drb_use_installed = false;
      H.drb_path = '../../../apps/dbay-rustybuzz';
      message = "using linked drb";
    }
    debug('^3337^', CND.reverse(message));
    process.on('exit', function() {
      return debug('^3337^', CND.reverse(message));
    });
    return null;
  })();

  //-----------------------------------------------------------------------------------------------------------
  this.fontnicks_and_paths = {
    djvs: 'DejaVuSerif.ttf'
  };

  (() => {
    var fontnick, fspath, ref;
    ref = this.fontnicks_and_paths;
    for (fontnick in ref) {
      fspath = ref[fontnick];
      this.fontnicks_and_paths[fontnick] = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts/', fspath));
    }
    return null;
  })();

  //-----------------------------------------------------------------------------------------------------------
  this.settings_from_set_id = function(set_id) {
    var cgid_map, chrs, cids, fontnick, fspath, text;
    chrs = null;
    cids = null;
    cgid_map = null;
    fontnick = null;
    fspath = null;
    //.........................................................................................................
    switch (set_id) {
      case 'small':
        fontnick = 'djvs';
        fspath = 'DejaVuSerif.ttf';
        chrs = "abcdefghijklm";
        text = "affirmation.";
        break;
      case 'smalli':
        fontnick = 'djvsi';
        fspath = 'DejaVuSerif-Italic.ttf';
        chrs = "abcdefghijklm";
        text = "affirmation.";
        break;
      case 'small-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = "Affirmation字缺TitianիϪSylt.";
        break;
      case 'medium-eg8i-da':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = `Dansk er et nordisk sprog, også præciseret som østnordisk, i den germanske
sprogfamilie. Det danske sprog tales af ca. seks millioner mennesker, hovedsageligt i Danmark, men
også i Sydslesvig (i Flensborg ca. 20 %), på Færøerne og Grønland. Dansk er tæt forbundet med
norsk og svensk, og sproghistorisk har dansk været stærkt påvirket af plattysk.`;
        break;
      case 'medium-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language spoken by about six million people, principally in
Denmark, Greenland, the Fa&shy;roe Islands and in the region of Southern Schles&shy;wig in northern Germany,
where it has minority language status. This-and-that this-and-that this-and-that this-and-that.`;
        break;
      case 'medium-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language spoken by about six million people, principally in
Denmark, Greenland, the Fa&shy;roe Islands and in the region of Southern Schles&shy;wig in northern Germany,
where it has minority language status.`;
        break;
      case 'egypt-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `Egypt has one of the longest histories of any country, tracing its heritage along the
Nile Delta back to the 6th–4th millennia BCE. Considered a cradle of civilisation, Ancient Egypt saw
some of the earliest developments of writing, agriculture, urbanisation, organised religion and
central government. Iconic monuments such as the Giza Necropolis and its Great Sphinx, as well the
ruins of Memphis, Thebes, Karnak, and the Valley of the Kings, reflect this legacy and remain a
significant focus of scientific and popular interest. Egypt's long and rich cultural heritage is an
integral part of its national identity, which reflects its unique transcontinental location being
simultaneously Mediterranean, Middle Eastern and North African. Egypt was an early and important
centre of Christianity, but was largely Islamised in the seventh century and remains a predominantly
Muslim country, albeit with a significant Christian minority.`;
        break;
      case 'short-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language.`;
        break;
      case 'uppercasehyphen-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `Hyphenated uppercase that should cause reformatting b/o kerning STORMY&shy;YEAR`;
        break;
      case 'longwords-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `xxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxx.`;
        break;
      case 'small-aleo':
        fontnick = 'aleo';
        fspath = 'Aleo_font_v1.2.2/Desktop OTF/Aleo-Italic.otf';
        chrs = "abcdefghijklm";
        text = "Affirmation字缺TitianիϪSylt.";
        break;
      case 'small-djvsi':
        fontnick = 'djvsi';
        fspath = 'DejaVuSerif-Italic.ttf';
        chrs = "abcdefghijklm";
        text = "Af&shy;&shy;&wbr;firmation字缺TitianիϪSylt.";
        break;
      case 'widechrs':
        fontnick = 'sfb';
        fspath = 'sunflower-u-cjk-xb.ttf';
        chrs = "𠀀𠀁𠀂𠀃𠀄𠀅𠀆";
        text = "𠀀𠀁𠀂𠀃𠀄𠀅𠀆";
        break;
      case '3a':
        fontnick = 'djvsi';
        fspath = 'DejaVuSerif-Italic.ttf';
        chrs = "abcdefghijklm";
        text = "abc";
        break;
      case '3b':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = "abc";
        break;
      case 'all':
        fontnick = 'qkai';
        fspath = 'cwTeXQKai-Medium.ttf';
        chrs = drb.get_assigned_unicode_chrs();
        break;
      case 'tibetan':
        fontnick = 'tbm';
        fspath = 'TibetanMachineUni.ttf';
        text = "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ";
        chrs = 'abc';
        break;
      case 'arabic':
        fontnick = 'amiri';
        fspath = 'arabic/Amiri-0.113/Amiri-Bold.ttf';
        text = ([..."نستعلیق‎ 字缺 الخط الأمیری"].reverse()).join('');
        chrs = ([..."الخط الأمیری"].reverse()).join('');
        break;
      case 'urdu':
        fontnick = 'nur';
        fspath = 'noto-arabic/NotoNastaliqUrdu-unhinted/NotoNastaliqUrdu-Regular.ttf';
        // text      = ( [ "اُردُو‌ حُرُوفِ ‌تَہَجِّی"... ].reverse() ).join ''
        // text      = "نستعلیق‎"
        text = ([..."نستعلیق‎"].reverse()).join('');
        chrs = ([..."الخط الأمیری"].reverse()).join('');
        break;
      default:
        throw new Error(`^345^ unknown set_id ${rpr(set_id)}`);
    }
    //.........................................................................................................
    fspath = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts/', fspath));
    return {chrs, cids, cgid_map, text, fontnick, fspath};
  };

  // #-----------------------------------------------------------------------------------------------------------
// { Dba }                   = require H.dbay_path
// dba_types                 = require H.dbay_path + '/lib/types'

  // #-----------------------------------------------------------------------------------------------------------
// @types.declare 'interpolatable_value', ( x ) ->
//   return true if @isa.text x
//   return true if @isa.float x
//   return true if @isa.boolean x
//   return false

  // #-----------------------------------------------------------------------------------------------------------
// @types.declare 'procure_db_cfg', tests:
//   "@isa.object x":                      ( x ) -> @isa.object x
//   "@isa.nonempty_text x.ref":           ( x ) -> @isa.nonempty_text x.ref
//   "@isa.nonempty_text x.size":          ( x ) -> @isa.nonempty_text x.size
//   "@isa.boolean x.reuse":               ( x ) -> @isa.boolean x.reuse

  // #-----------------------------------------------------------------------------------------------------------
// @types.declare 'looks_like_db_cfg', tests:
//   "@isa.object x":                      ( x ) -> @isa.object x
//   "dba_types.isa.dba x.dba":            ( x ) -> dba_types.isa.dba x.dba
//   "dba_types.isa.ic_schema x.schema":   ( x ) -> dba_types.isa.ic_schema x.schema

  // #-----------------------------------------------------------------------------------------------------------
// @types.declare 'datamill_db_lookalike', ( cfg ) ->
//   @validate.looks_like_db_cfg cfg
//   { dba, schema, }  = cfg
//   schema_i          = dba.sql.I schema
//   try
//     return false unless ( dba.first_value dba.query "select count(*) from #{schema_i}.main;" ) is 327
//     # debug '^35354^', dba.list dba.query "select * from #{schema_i}.main order by vnr_blob limit 3;"
//   catch error
//     throw error unless error.code is 'SQLITE_ERROR'
//     return false
//   return true

  // #-----------------------------------------------------------------------------------------------------------
// @types.declare 'chinook_db_lookalike', ( cfg ) ->
//   @validate.looks_like_db_cfg cfg
//   { dba, schema, }  = cfg
//   schema_i          = dba.sql.I schema
//   try
//     db_objects = dba.list dba.query "select type, name from #{schema_i}.sqlite_schema where true or type is 'table' order by name;"
//     info db_objects
//     return false unless equals db_objects, [
//       { type: 'table', name: 'Album',                             }
//       { type: 'table', name: 'Artist',                            }
//       { type: 'table', name: 'Customer',                          }
//       { type: 'table', name: 'Employee',                          }
//       { type: 'table', name: 'Genre',                             }
//       { type: 'index', name: 'IFK_AlbumArtistId',                 }
//       { type: 'index', name: 'IFK_CustomerSupportRepId',          }
//       { type: 'index', name: 'IFK_EmployeeReportsTo',             }
//       { type: 'index', name: 'IFK_InvoiceCustomerId',             }
//       { type: 'index', name: 'IFK_InvoiceLineInvoiceId',          }
//       { type: 'index', name: 'IFK_InvoiceLineTrackId',            }
//       { type: 'index', name: 'IFK_PlaylistTrackTrackId',          }
//       { type: 'index', name: 'IFK_TrackAlbumId',                  }
//       { type: 'index', name: 'IFK_TrackGenreId',                  }
//       { type: 'index', name: 'IFK_TrackMediaTypeId',              }
//       { type: 'table', name: 'Invoice',                           }
//       { type: 'table', name: 'InvoiceLine',                       }
//       { type: 'table', name: 'MediaType',                         }
//       { type: 'table', name: 'Playlist',                          }
//       { type: 'table', name: 'PlaylistTrack',                     }
//       { type: 'table', name: 'Track',                             }
//       { type: 'index', name: 'sqlite_autoindex_PlaylistTrack_1',  }
//       { type: 'table', name: 'sqlite_sequence',                   } ]
//   catch error
//     throw error unless error.code is 'SQLITE_ERROR'
//     return false
//   return true

  // #-----------------------------------------------------------------------------------------------------------
// @types.declare 'micro_db_lookalike', ( cfg ) ->
//   @validate.looks_like_db_cfg cfg
//   { dba, schema, }  = cfg
//   schema_i          = dba.sql.I schema
//   try
//     db_objects = dba.list dba.query "select type, name from #{schema_i}.sqlite_schema order by name;"
//     info db_objects
//     return false unless equals db_objects, [
//       { type: 'table', name: 'main',                   } ]
//   catch error
//     throw error unless error.code is 'SQLITE_ERROR'
//     return false
//   return true

  // #===========================================================================================================
// #
// #-----------------------------------------------------------------------------------------------------------
// @file_exists = ( path ) ->
//   try ( stat = FS.statSync path ) catch error
//     return false if error.code is 'ENOENT'
//     throw error
//   return true if stat.isFile()
//   throw new Error "^434534^ not a file: #{rpr path}\n#{rpr stat}"

  // #-----------------------------------------------------------------------------------------------------------
// @ensure_file_exists = ( path ) ->
//   throw new Error "^434534^ not a file: #{rpr path}" unless @file_exists path
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @try_to_remove_file = ( path ) ->
//   try FS.unlinkSync path catch error
//     return if error.code is 'ENOENT'
//     throw error
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @resolve_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../../', path

  // #-----------------------------------------------------------------------------------------------------------
// @copy_over = ( from_path, to_path ) ->
//   @try_to_remove_file to_path unless to_path in [ ':memory:', '', ]
//   await FSP.copyFile from_path, to_path
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @interpolate  = ( template, namespace ) ->
//   validate.text template
//   validate.object namespace
//   R = template
//   for name, value of namespace
//     continue unless ( R.indexOf ( pattern = "{#{name}}" ) ) > -1
//     validate.interpolatable_value value
//     R = R.replaceAll pattern, value
//   if ( match = R.match /(?<!\\)\{/ )
//     throw new Error "unresolved curly bracket in template #{rpr template}"
//   R = R.replaceAll '\\{', '{'
//   R = R.replaceAll '\\}', '}'
//   return R

  // #-----------------------------------------------------------------------------------------------------------
// @get_data = ( cfg ) ->
//   return data_cache if data_cache?
//   whisper "retrieving test data..."
//   #.........................................................................................................
//   texts       = DATA.get_words cfg.word_count
//   #.........................................................................................................
//   data_cache  = { texts, }
//   data_cache  = DATOM.freeze data_cache
//   whisper "...done"
//   return data_cache

  // #-----------------------------------------------------------------------------------------------------------
// @get_cfg = ->
//   R =
//     # word_count: 10_000
//     word_count: 10
//     sql:
//       small:  @resolve_path 'assets/icql/small-datamill.sql'
//       big:    @resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.sql'
//     csv:
//       small:  @resolve_path 'assets/icql/chineselexicaldatabase2.1.small.txt'
//       holes:  @resolve_path 'assets/icql/ncrglyphwbf-with-holes.csv'
//     tsv:
//       micro:  @resolve_path 'assets/icql/ncrglyphwbf.tsv'
//       holes:  @resolve_path 'assets/icql/ncrglyphwbf-with-holes.tsv'
//     db:
//       templates:
//         nnt:    @resolve_path 'assets/icql/numbersandtexts.db'
//         micro:  @resolve_path 'assets/icql/micro.db'
//         small:  @resolve_path 'assets/icql/small-datamill.db'
//         big:    @resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.db'
//       target:
//         small:  @resolve_path 'data/dbay/dbay-{ref}-{size}.db'
//         big:    @resolve_path 'data/dbay/dbay-{ref}-{size}.db'
//       work:
//         mem:    ':memory:'
//         fle:    @resolve_path 'data/dbay/dbay-{ref}-{size}.db'
//       temp:
//         small:  @resolve_path 'data/dbay/dbay-{ref}-{size}-temp.db'
//         big:    @resolve_path 'data/dbay/dbay-{ref}-{size}-temp.db'
//       old:
//         small:  @resolve_path 'data/dbay/dbay-{ref}-{size}-old.db'
//         big:    @resolve_path 'data/dbay/dbay-{ref}-{size}-old.db'
//     pragma_sets:
//       #.....................................................................................................
//       ### thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 ###
//       fle: [
//         'page_size = 4096'
//         'cache_size = 16384'
//         'temp_store = MEMORY'
//         'journal_mode = WAL'
//         'locking_mode = EXCLUSIVE'
//         'synchronous = OFF' ]
//       #.....................................................................................................
//       mem: []
//       bare: []
//   return R

  // #-----------------------------------------------------------------------------------------------------------
// @nonexistant_path_from_ref = ( ref ) ->
//   R = @interpolate @get_cfg().db.work.fle, { ref, size: 'any', }
//   @try_to_remove_file R
//   return R

  // #-----------------------------------------------------------------------------------------------------------
// @procure_db = ( cfg ) ->
//   cfg           = { reuse: false, cfg..., }
//   validate.procure_db_cfg cfg
//   xcfg          = @get_cfg()
//   template_path = @interpolate xcfg.db.templates[ cfg.size ], cfg
//   @ensure_file_exists template_path
//   # work_path     = @interpolate xcfg.db.work[      cfg.mode ], cfg
//   work_path     = @interpolate xcfg.db.work.fle, cfg
//   unless cfg.reuse and @file_exists work_path
//     help "^4341^ procuring DB #{work_path}"
//     await @copy_over template_path, work_path
//   else
//     warn "^4341^ skipping DB file creation (#{work_path} already exists)"
//   return { template_path, work_path, }

  // #-----------------------------------------------------------------------------------------------------------
// @procure_file = ( cfg ) ->
//   { path
//     name  }     = cfg
//   @ensure_file_exists path
//   work_path     = @resolve_path PATH.join 'data/icql', name
//   await @copy_over path, work_path
//   return work_path

}).call(this);

//# sourceMappingURL=helpers.js.map
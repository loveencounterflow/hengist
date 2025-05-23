

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL/TESTS/MAIN'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../../apps/guy-test'
jr                        = JSON.stringify
{ inspect, }              = require 'util'
xrpr                      = ( x ) -> inspect x, { colors: yes, breakLength: Infinity, maxArrayLength: Infinity, depth: Infinity, }
xrpr2                     = ( x ) -> inspect x, { colors: yes, breakLength: 20, maxArrayLength: Infinity, depth: Infinity, }
#...........................................................................................................
PATH                      = require 'path'

#-----------------------------------------------------------------------------------------------------------
get_icql_settings = ( remove_db = false ) ->
  R                 = {}
  R.connector       = require 'better-sqlite3'
  R.db_path         = '/tmp/icql.db'
  R.icql_path       = PATH.resolve PATH.join __dirname, '../../../../assets/icql/test.icql'
  if remove_db
    try
      ( require 'fs' ).unlinkSync R.db_path
    catch error
      throw error unless ( error.code is 'ENOENT' )
  return R

#-----------------------------------------------------------------------------------------------------------
@[ "oneliners" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  IC                = require '../../../../apps/intercourse'
  PATH              = require 'path'
  intercourse_path  = require.resolve '../../../../apps/intercourse'
  demo_path         = PATH.join intercourse_path, '../../demos/sqlite-demo.icql'
  debug '22999', demo_path
  db                = {}
  ICQL.definitions_from_path_sync db, demo_path
  debug '33442', db
  return done()
  throw new Error "sorry no tests as yet"
  probes_and_matchers = [
    # ["procedure foobar:  some text\n  illegal line",null,'illegal follow-up after one-liner']
    ["procedure foobar: some text",{"foobar":{"type":"procedure","null":{"text":"some text\n","location":{"line_nr":1},"kenning":"null","type":"procedure"}}},null]
    ["procedure foobar(): some text",{"foobar":{"type":"procedure","()":{"text":"some text\n","location":{"line_nr":1},"kenning":"()","type":"procedure","signature":[]}}},null]
    ["procedure foobar( first ): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
    ["procedure foobar(first): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
    ["procedure foobar( first, ): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
    ["procedure foobar(first,): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
    ["procedure foobar( first, second ): some text",{"foobar":{"type":"procedure","(first,second)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first,second)","type":"procedure","signature":["first","second"]}}},null]
    ["procedure foobar( first, second, ): some text",{"foobar":{"type":"procedure","(first,second)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first,second)","type":"procedure","signature":["first","second"]}}},null]
    ]
  #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  #     # try
  #     result = await IC.read_definitions_from_text probe
  #     # catch error
  #     #   return resolve error
  #     # debug '29929', xrpr2 result
  #     resolve result
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "parameters are expanded in procedures" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  db                = ICQL.bind get_icql_settings()
  # debug 'µ44433', db
  db.create_demo_table()
  #.........................................................................................................
  db.$.function 'echo', { deterministic: false, varargs: true  }, ( P... ) -> urge ( CND.grey 'DB' ), P...;  null
  db.$.function 'e',    { deterministic: false, varargs: false }, ( x    ) -> urge ( CND.grey 'DB' ), rpr x; x
  #.........................................................................................................
  debug db.$.all_rows db.read_demo_rows()
  debug db.$.all_rows db.select_by_rowid { rowid: 2, }
  try
    db.update_by_rowid { rowid: 2, status: 'bar', }
  catch error
    debug 'µ33555', error.code
    debug 'µ33555', error.name
    debug 'µ33555', ( k for k of error )
    debug 'µ33555', error.message
    # TypeError
    process.exit 1
  debug db.$.all_rows db.select_by_rowid { rowid: 2, }
  #.........................................................................................................
  # statement = db.$.prepare "select rowid, * from demo where rowid = $rowid;"
  # info 'µ00908', [ ( statement.iterate { rowid: 2, } )..., ]
  # # statement = db.$.prepare "select 42; select rowid, * from demo where rowid = $rowid;"
  # # statement = db.$.prepare "update demo set status = 'yes!' where rowid = $rowid;"
  # # info 'µ00908', statement.run { rowid: 2, }
  # info 'µ00908', db.$.run "update demo set status = 'yes!' where rowid = $rowid;", { rowid: 2, extra: true, }
  # debug db.$.all_rows db.select_by_rowid { rowid: 2, }

  # probes_and_matchers = [
  #   # ["procedure foobar:  some text\n  illegal line",null,'illegal follow-up after one-liner']
  #   ["procedure foobar: some text",{"foobar":{"type":"procedure","null":{"text":"some text\n","location":{"line_nr":1},"kenning":"null","type":"procedure"}}},null]
  #   ["procedure foobar(): some text",{"foobar":{"type":"procedure","()":{"text":"some text\n","location":{"line_nr":1},"kenning":"()","type":"procedure","signature":[]}}},null]
  #   ["procedure foobar( first ): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
  #   ["procedure foobar(first): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
  #   ["procedure foobar( first, ): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
  #   ["procedure foobar(first,): some text",{"foobar":{"type":"procedure","(first)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first)","type":"procedure","signature":["first"]}}},null]
  #   ["procedure foobar( first, second ): some text",{"foobar":{"type":"procedure","(first,second)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first,second)","type":"procedure","signature":["first","second"]}}},null]
  #   ["procedure foobar( first, second, ): some text",{"foobar":{"type":"procedure","(first,second)":{"text":"some text\n","location":{"line_nr":1},"kenning":"(first,second)","type":"procedure","signature":["first","second"]}}},null]
  #   ]
  #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  #     # try
  #     result = await IC.read_definitions_from_text probe
  #     # catch error
  #     #   return resolve error
  #     # debug '29929', xrpr2 result
  #     resolve result
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "as_sql" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  PATH              = require 'path'
  db                = ICQL.bind get_icql_settings()
  probes_and_matchers = [
    [true,'1',]
    [false,'0',]
    [42,'42',]
    ['text',"'text'",]
    ["text with 'quotes'","'text with ''quotes'''",]
    [[1,2,3],"'[1,2,3]'",]
    [[],"'[]'",]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve db.$.as_sql probe
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "interpolate" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  PATH              = require 'path'
  db                = ICQL.bind get_icql_settings()
  probes_and_matchers = [
    [["foo, $bar, baz",{bar:42,}],"foo, 42, baz"]
    [["select * from t where d = $d;",{bar:42,}],null,"unable to express 'undefined' as SQL literal"]
    [["select * from t where d = $d;",{d:true,}],"select * from t where d = 1;"]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ sql, Q, ] = probe
      resolve db.$.interpolate sql, Q
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "fragments return interpolated source text" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  db                = ICQL.bind get_icql_settings()
  # debug 'µ44430', db
  # debug 'µ44430', db.$.sql
  # debug 'µ44430', db.create_demo_table_middle
  key     = 'somekey'
  value   = 'somevalue'
  status  = 'somestatus'
  first   = db.create_demo_table_first()
  middle  = db.create_demo_table_middle { key, value, status, }
  last    = db.create_demo_table_last()
  T.eq first,   "drop table if exists demo;\ncreate table demo (\n  key     text,\n  value   text,\n  status  text );\ninsert into demo values"
  T.eq middle,  "( 'somekey', 'somevalue', 'somestatus' )"
  T.eq last,    ";"
  done()

# #-----------------------------------------------------------------------------------------------------------
# @[ "x" ] = ( T, done ) ->
#   T.eq 42, 42
#   T.eq 42, 43
#   done()
#   return null

#-----------------------------------------------------------------------------------------------------------
@[ "foreign keys" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  settings          = get_icql_settings true
  settings.echo     = true
  db                = ICQL.bind settings
  db.create_tables_with_foreign_key()
  db.populate_tables_with_foreign_key()
  rows              = db.$.all_rows db.select_from_tables_with_foreign_key()
  T.eq rows, [{"id":"id1","key":"foo"},{"id":"id2","key":"foo"},{"id":"id3","key":"other"},{"id":"id4","key":"bar"}]
  db.drop_tables_with_foreign_key()
  #---------------------------------------------------------------------------------------------------------
  db                = ICQL.bind settings
  db.create_tables_with_foreign_key()
  T.eq [],        db.$.dependencies_of 't1'
  T.eq [ 't1' ],  db.$.dependencies_of 't2'
  #---------------------------------------------------------------------------------------------------------
  T.eq db.$.get_toposort(), [
    { name: 't2', type: 'table', sql: 'CREATE TABLE t2 (\n  id      text  not null  unique primary key,\n  key     text  not null         references t1 ( key ) )' },
    { name: 't1', type: 'table', sql: 'CREATE TABLE t1 (\n  key     text  not null  unique primary key )' },
    { name: 'sqlite_autoindex_t1_1', type: 'index', sql: null },
    { name: 'sqlite_autoindex_t2_1', type: 'index', sql: null } ]
  #---------------------------------------------------------------------------------------------------------
  db.populate_tables_with_foreign_key()
  T.eq rows, [{"id":"id1","key":"foo"},{"id":"id2","key":"foo"},{"id":"id3","key":"other"},{"id":"id4","key":"bar"}]
  db.$.clear()
  T.eq db.$.get_toposort(), []
  # db.drop_tables_with_foreign_key()
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "toposort with schema" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  settings          = get_icql_settings true
  settings.echo     = true
  db                = ICQL.bind settings
  schema            = 'subdb'
  db.$.attach ':memory:', schema
  #.........................................................................................................
  T.eq db.$.list_schemas(), [
    { seq: 0, name: 'main', file: '/tmp/icql.db' },
    { seq: 2, name: 'subdb', file: '' } ]
  T.eq ( db.$.get_toposort schema ), []
  #.........................................................................................................
  template          = db.create_tables_with_foreign_key_frg()
  ### TAINT use compile-time interpolation as soon as available ###
  sql               = template.replace /\{schema\}/g, db.$.as_identifier schema
  db.$.execute sql
  #.........................................................................................................
  do =>
    d                 = db.$.list_objects()
    T.eq d, []
  #.........................................................................................................
  do =>
    d                 = db.$.list_objects schema
    d                 = ( e for e in d when e.type is 'table' )
    for e in d
      delete e.sql
    T.eq d, [ { type: 'table', name: 'table_one' }, { type: 'table', name: 'table_two' } ]
  #.........................................................................................................
  T.eq ( db.$.get_toposort() ), []
  T.eq ( db.$.get_toposort schema ), [
    { name: 'table_one', type: 'table', sql: 'CREATE TABLE table_one (\n  key     text  not null  unique primary key )' },
    { name: 'table_two', type: 'table', sql: 'CREATE TABLE table_two (\n  id      text  not null  unique primary key,\n  key     text  not null         references table_one ( key ) )' },
    { name: 'sqlite_autoindex_table_one_1', type: 'index', sql: null },
    { name: 'sqlite_autoindex_table_two_1', type: 'index', sql: null } ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "_error messages" ] = ( T, done ) ->
  ### demo to show that printout gets limited for long statements ###
  ICQL              = require '../../../../apps/icql'
  settings          = get_icql_settings true
  db                = ICQL.bind settings
  db.create_demo_table()
  sql               = "select
    1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018,
    1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037,
    1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056,
    1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075,
    1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094,
    1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113,
    1114, 1115, 1116, 1117, 1118, 1119, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1127, 1128, 1129, 1130, 1131, 1132,
    1133, 1134, 1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151,
    1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1170,
    1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189,
    1190, 1191, 1192, 1193, 1194, 1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208,
    1209, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226, 1227,
    1228, 1229, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240, 1241, 1242, 1243, 1244, 1245, 1246,
    1247, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265,
    1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1284,
    1285, 1286, 1287, 1288, 1289, 1290, 1291, 1292, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300, 1301, 1302, 1303,
    1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320, 1321, 1322,
    1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330, 1331, 1332, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340, 1341,
    1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350, 1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1359, 1360,
    from demo;"
  try
    db.$.query sql
  catch error
    null
  done()


############################################################################################################
unless module.parent?
  test @
  # test @[ "load_extension" ]
  # test @[ "foreign keys" ]
  # test @[ "toposort with schema" ]
  # @[ "toposort with schema" ]()



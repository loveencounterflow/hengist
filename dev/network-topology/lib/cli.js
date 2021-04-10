(function() {
  'use strict';
  var $, $batch, $drain, $echo_channels, $process_nmap_output, $sample, $show, $split_lines, $watch, CND, FS, JFEE, MIXA, PATH, SL, SP, badge, cli, debug, echo, freeze, help, info, isa, rpr, show_hosts, spawn, types, urge, validate, validate_optional, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'NETWORK-TOPOLOGY';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, validate, validate_optional} = types.export());

  MIXA = require('mixa');

  SL = require('intertext-splitlines');

  ({freeze} = Object);

  SP = require('./steampipes-extras');

  ({$, $watch, $drain, $split_lines, $show, $sample, $batch} = SP.export());

  JFEE = require('jfee');

  ({spawn} = require('child_process'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  types.declare('sql_insert_target_encoding', function(x) {
    return x === 'binary' || x === 'text';
  });

  //-----------------------------------------------------------------------------------------------------------
  $echo_channels = function() {
    return $watch((d) => {
      switch (d.$key) {
        case '^stdout':
          echo(CND.yellow(d.$value));
          break;
        case '^stderr':
          echo(CND.red(d.$value));
          break;
        default:
          debug(d); //.$value
      }
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  $process_nmap_output = function() {
    var blank_re, entry, first_noname_re, first_re, latency_re, mac_re;
    blank_re = /^\s*$/;
    first_re = /^Nmap scan report for (?<name>.*)\s+\((?<ip>[0-9a-f.]+)\)/;
    first_noname_re = /^Nmap scan report for (?<ip>[0-9a-f.]+)$/;
    latency_re = /^Host is up \((?<latency>\S+) latency\)\.$/;
    mac_re = /^MAC Address: (?<mac>[0-9A-F:]+) \((?<info>.*)\)$/;
    entry = null;
    return $(function(d, send) {
      var line, match, ref, ref1;
      if ((ref = d.$key) === '<cp' || ref === '>cp') {
        return send(d);
      }
      if (d.$key !== '^stdout') {
        echo(CND.red((ref1 = d.$value) != null ? ref1 : d));
        return;
      }
      //.......................................................................................................
      line = d.$value;
      if ((line.match(blank_re)) != null) {
        return;
      }
      if (line.startsWith('Starting Nmap ')) {
        return;
      }
      if (line.startsWith('Nmap done: ')) {
        if (entry != null) {
          send(freeze(entry));
        }
        entry = null;
      } else if ((match = line.match(first_re)) != null) {
        if (entry != null) {
          send(freeze(entry));
        }
        entry = {...match.groups};
      } else if ((match = line.match(first_noname_re)) != null) {
        if (entry != null) {
          send(freeze(entry));
        }
        entry = {...match.groups};
      } else if (line === 'Host is up.') {
        entry.status = 'up';
      } else if ((match = line.match(latency_re)) != null) {
        entry.latency = match.groups.latency;
        entry.status = 'up';
      } else if ((match = line.match(mac_re)) != null) {
        entry.mac = match.groups.mac;
        if ((match.groups.info != null) && (match.groups.info !== 'Unknown')) {
          entry.info = match.groups.info;
        }
      } else {
        echo(CND.red('???', rpr(line)));
      }
      // echo CND.grey d
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show_hosts = function() {
    return new Promise(async(resolve, reject) => {
      var cp, pipeline, ref, source, x;
      source = SP.new_push_source();
      pipeline = [];
      pipeline.push(source);
      pipeline.push(SP.$split_channels());
      pipeline.push($process_nmap_output());
      pipeline.push($watch(function(d) {
        var ref, ref1, ref2, ref3;
        if ((ref = d.$key) === '<cp' || ref === '>cp') {
          return;
        }
        // echo CND.steel d
        return echo(CND.yellow((ref1 = d.ip) != null ? ref1 : '?', (ref2 = d.name) != null ? ref2 : '?', '(' + ((ref3 = d.info) != null ? ref3 : '?') + ')'));
      }));
      // pipeline.push $show()
      pipeline.push($drain(function() {
        return resolve();
      }));
      SP.pull(...pipeline);
      cp = spawn('sudo', ['nmap', '-sn', '192.168.190.0/24']);
      ref = JFEE.Receiver.from_child_process(cp);
      for await (x of ref) {
        source.send(x);
      }
      source.end();
      //.........................................................................................................
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  cli = function() {
    return new Promise((done) => {
      var jobdefs;
      //.........................................................................................................
      jobdefs = {
        commands: {
          //-----------------------------------------------------------------------------------------------------
          'show-hosts': {
            description: "create DB `tessera`",
            runner: async(d) => {
              await show_hosts();
              return done();
            }
          }
        }
      };
      // #-----------------------------------------------------------------------------------------------------
      // 'copy-data':
      //   description:  "copy data into DB; specify individual DSKs or 'all'"
      //   flags:
      //     'input':
      //       alias:        'i'
      //       type:         String
      //       positional:   true
      //       multiple:     'greedy'
      //       description:  "input file(s)"
      //   runner: ( d ) =>
      //     unless ( dsks = d.verdict.parameters.input )?
      //       warn "need at least one DSK; use 'all' to copy data from all files"
      //     debug '^33344^', { dsks, }
      //     await copy_data dsks
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'locate':
      //   description:  "given a DSK, locate file(s) in datasources"
      //   flags:
      //     'input':
      //       alias:        'i'
      //       type:         String
      //       positional:   true
      //       multiple:     'greedy'
      //       description:  "input file(s)"
      //   runner: ( d ) =>
      //     unless ( dsks = d.verdict.parameters.input )?
      //       warn "need at least one DSK; use 'all' for all files"
      //     await locate dsks
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'as-sql-insert':
      //   description:  "turn lines in text file into SQL insert statements"
      //   flags:
      //     'encode-to':
      //       alias:        't'
      //       type:         String
      //       fallback:     'binary'
      //       description:  "target encoding (text, binary)"
      //     'dsk':
      //       alias:        'd'
      //       type:         String
      //       fallback:     'UNKNOWN'
      //       description:  "Data Source Key (DSK) that identfies source"
      //     'batchsize':
      //       alias:        's'
      //       type:         Number
      //       fallback:     10000
      //       description:  "number of rows per insert statement (default 10'000)"
      //     'input':
      //       alias:        'i'
      //       positional:   true
      //       type:         String
      //       description:  "data source file"
      //   runner: ( d ) =>
      //     debug '^77665^', d.verdict
      //     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      //     encode_to   = d.verdict.parameters[ 'encode-to' ]
      //     dsk         = d.verdict.parameters.dsk
      //     batchsize   = d.verdict.parameters.batchsize
      //     await file_as_sql_inserts dsk, input_path, encode_to, batchsize
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'write':
      //   description:  "write challenging test data"
      //   flags:
      //     'input':
      //       alias:        'i'
      //       type:         String
      //       fallback:     'demo-data/challenging.template.txt'
      //       description:  "template to use"
      //     'output':
      //       alias:        'o'
      //       type:         String
      //       fallback:     'demo-data/challenging.txt'
      //       description:  "file to write data to"
      //   runner: ( d ) =>
      //     # write_challenging_data d.verdict.parameters.input, d.verdict.parameters.output
      //     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      //     output_path = PATH.resolve process.cwd(), d.verdict.parameters.output
      //     debug '^33442^', { input_path, output_path, }
      //     await write_challenging_data input_path, output_path
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'show-lines':
      //   description:  "show lines of file in hex with context"
      //   flags:
      //     'line':
      //       alias:        'l'
      //       type:         Number
      //       fallback:     null
      //       description:  "line nr to show"
      //     'input':
      //       alias:        'i'
      //       type:         String
      //       positional:   true
      //       fallback:     'demo-data/challenging.txt'
      //       description:  "path to file"
      //   runner: ( d ) =>
      //     line_nr     = d.verdict.parameters.line
      //     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      //     debug '^33442^', { line_nr, input_path, }
      //     await show_lines line_nr, input_path
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'detect-encoding':
      //   description:  "detect encoding of given file"
      //   flags:
      //     'input':
      //       alias:        'i'
      //       type:         String
      //       positional:   true
      //       fallback:     'demo-data/challenging.txt'
      //       description:  "path to file"
      //   runner: ( d ) =>
      //     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      //     await detect_encoding input_path
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'show-encodings':
      //   description:  "show encodings of given file"
      //   flags:
      //     'input':
      //       alias:        'i'
      //       type:         String
      //       positional:   true
      //       fallback:     'demo-data/strange-encodings.txt'
      //       description:  "path to file"
      //     'from':
      //       alias:        'f'
      //       type:         Number
      //       fallback:     1
      //       description:  "first line number"
      //     'to':
      //       alias:        't'
      //       type:         Number
      //       fallback:     Infinity
      //       description:  "last line number"
      //   runner: ( d ) =>
      //     first_lnr   = d.verdict.parameters.from
      //     last_lnr    = d.verdict.parameters.to
      //     input_path  = PATH.resolve process.cwd(), d.verdict.parameters.input
      //     debug '^2369^', { input_path, first_lnr, last_lnr, }
      //     await show_encodings input_path, first_lnr, last_lnr
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'test-utf8-byte-pattern':
      //   description:  "test utf-8 byte pattern contained in _utf8-byte-pattern.sh"
      //   runner: ( d ) =>
      //     await test_utf8_byte_pattern()
      //     done()
      // #-----------------------------------------------------------------------------------------------------
      // 'add-indexes':
      //   description:  "add indexes to DB"
      //   runner: ( d ) =>
      //     await add_indexes()
      //     done()
      //.........................................................................................................
      MIXA.run(jobdefs, process.argv);
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_receiver()
      return (await cli());
    })();
  }

}).call(this);

//# sourceMappingURL=cli.js.map
(function() {
  'use strict';
  var $, $async, $drain, $show, $watch, CND, DATOM, FS, SP, alert, assign, badge, cast, debug, echo, freeze, help, info, isa, jr, last_of, lets, log, new_datom, rpr, select, type_of, types, urge, validate, warn, whisper, wrap_datom;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'CONTACTS-VCF-READER';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  warn("^345876^ this code now part of contacts");

  process.exit(1);

  //...........................................................................................................
  ({assign, jr} = CND);

  types = (require('intertext')).types;

  ({isa, validate, cast, last_of, type_of} = types);

  SP = require('steampipes');

  ({$, $async, $watch, $show, $drain} = SP.export());

  ({jr} = CND);

  DATOM = new (require('datom')).Datom({
    dirty: false
  });

  ({new_datom, wrap_datom, lets, freeze, select} = DATOM.export());

  FS = require('fs');

  //-----------------------------------------------------------------------------------------------------------
  /* TAINT should implement in SteamPipes */
  this.$read_from_file = function() {
    return $((path, send) => {
      return send(FS.readFileSync(path));
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$clean = function() {
    return $((line, send) => {
      line = line.trim();
      if (line !== '') {
        return send(line);
      }
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$fields = function() {
    return $((line, send) => {
      var $value, match, name;
      if ((match = line.match(/^(?<name>[^:]+):(?<$value>.*)$/)) == null) {
        warn(`not a valid VCF line: ${jr(line)}`);
        return;
      }
      ({name, $value} = match.groups);
      name = name.toLowerCase();
      //.........................................................................................................
      if ((name.indexOf('encoding=quoted-printable')) > -1) {
        $value = ((require('libqp')).decode($value)).toString('utf-8');
      }
      //.........................................................................................................
      name = name.replace(/;internet;pref$/, '');
      name = name.replace(/;charset=utf-8;encoding=quoted-printable$/, '');
      if ((name === 'begin') && ($value === 'VCARD')) {
        return send(new_datom('<vcard'));
      }
      if ((name === 'end') && ($value === 'VCARD')) {
        return send(new_datom('>vcard'));
      }
      return send(new_datom(`^${name}`, $value));
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$filter = function() {
    return SP.$filter((d) => {
      if (select(d, '^n')) {
        return false;
      }
      if (select(d, '^version')) {
        return false;
      }
      if (d.$value === '') {
        return false;
      }
      return true;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$resolve_name = function() {
    return $((d, send) => {
      if (select(d, '^n')) {
        return;
      }
      if (!select(d, '^fn')) {
        return send(d);
      }
      return send(new_datom("^name", d.$value));
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$resolve_number = function() {
    return $((d, send) => {
      if (!select(d, '^tel;cell;pref')) {
        return send(d);
      }
      return send(new_datom("^fon", d.$value));
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$prefix_number = function() {
    return $((d, send) => {
      if (!select(d, '^fon')) {
        return send(d);
      }
      if (d.$value.startsWith('0')) {
        d = lets(d, function(d) {
          return d.$value = '+49' + d.$value.slice(1);
        });
      }
      return send(new_datom("^fon", d.$value));
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$consolidate = function() {
    var buffer, within_vcard;
    within_vcard = false;
    buffer = {};
    return $((d, send) => {
      var name;
      if (select(d, '<vcard')) {
        within_vcard = true;
        buffer = {};
        return null;
      }
      if (select(d, '>vcard')) {
        send(new_datom('^vcard', buffer));
        within_vcard = false;
        buffer = null;
        return null;
      }
      name = d.$key.slice(1);
      if (!within_vcard) {
        return send(d);
      }
      if ((buffer[name] != null) && !isa.list(buffer[name])) {
        buffer[name] = [buffer[name]];
      }
      if (isa.list(buffer[name])) {
        buffer[name].push(d.$value);
      } else {
        buffer[name] = d.$value;
      }
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$add_sortkey = function(key, sortkey) {
    return $((d, send) => {
      if (d[key] == null) {
        return send(d);
      }
      d = lets(d, function(d) {
        return d[sortkey] = d[key].toLowerCase();
      });
      send(d);
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$dedup = function() {
    return SP.window({
      width: 2
    }, $((ds, send) => {
      var d, d1;
      [d1, d] = ds;
      if (!(d1 && (d != null))) {
        return;
      }
      if ((d1.sortkey === d.sortkey) && (d1.fon === d.fon)) {
        return;
      }
      send(d);
      return null;
    }));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.read_vcards = function(...paths) {
    return new Promise((resolve) => {
      var R, pipeline;
      R = [];
      paths = paths.flat(2e308);
      pipeline = [];
      pipeline.push(paths);
      pipeline.push(this.$read_from_file());
      pipeline.push(SP.$split());
      pipeline.push(this.$clean());
      pipeline.push(this.$fields());
      pipeline.push(this.$filter());
      pipeline.push(this.$resolve_name());
      pipeline.push(this.$resolve_number());
      pipeline.push(this.$prefix_number());
      pipeline.push(this.$consolidate());
      pipeline.push(this.$add_sortkey('name', 'sortkey'));
      pipeline.push(SP.$sort({
        key: 'fon',
        strict: false
      }));
      pipeline.push(SP.$sort({
        key: 'sortkey',
        strict: false
      }));
      pipeline.push(this.$dedup());
      // pipeline.push @$delete_key 'sortkey'
      // pipeline.push $show()
      pipeline.push($drain((collector) => {
        return resolve(collector);
      }));
      return SP.pull(...pipeline);
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var i, len, results, vcard, vcards;
      vcards = (await this.read_vcards(['../../../../../../contacts/**/*.vcf']));
      results = [];
      for (i = 0, len = vcards.length; i < len; i++) {
        vcard = vcards[i];
        // console.table vcards
        results.push(echo(jr(vcard)));
      }
      return results;
    })();
  }

}).call(this);

//# sourceMappingURL=contacts-vcf-reader.js.map
(function() {
  'use strict';
  var CND, INTERTEXT, after, assign, badge, bar_from_percentage, debug, declare, echo, f0, f0l, f1s, f3, f3s, f9, first_of, help, info, isa, jr, last_of, rpr, size_of, type_of, urge, validate, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/BENCHMARKS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  ({jr} = CND);

  assign = Object.assign;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  // nf                        = require 'number-format.js'
  INTERTEXT = require('intertext');

  //...........................................................................................................
  // H                         = require '../helpers'
  // DATAMILL                  = require '../..'
  this.types = require('./types');

  ({isa, validate, declare, first_of, last_of, size_of, type_of} = this.types);

  // VNR                       = require '../vnr'
  // $fresh                    = true
  // first                     = Symbol 'first'
  // last                      = Symbol 'last'
  // FS                        = require 'fs'

  //-----------------------------------------------------------------------------------------------------------
  this.time_now = function() {
    var t;
    t = process.hrtime();
    return BigInt(`${t[0]}` + `${t[1]}`.padStart(9, '0'));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.stopwatch_sync = function(f) {
    /* return time needed to call `f()` synchronously, in milliseconds */
    var t0ns, t1ns;
    t0ns = this.time_now();
    f();
    t1ns = this.time_now();
    return (parseInt(t1ns - t0ns, 10)) / 1e6;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.stopwatch_async = async function(f) {
    /* return time needed to call `f()` asynchronously, in milliseconds */
    var t0ns, t1ns;
    t0ns = this.time_now();
    await f();
    t1ns = this.time_now();
    return (parseInt(t1ns - t0ns, 10)) / 1e6;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.add_result = function(me, test_name, data) {
    return me.records.push({test_name, ...data});
  };

  //-----------------------------------------------------------------------------------------------------------
  /* taken from InterShop db/011-bar.sql */
  bar_from_percentage = function(n) {
    var R;
    if (n === null || n <= 0) {
      R = '';
    } else if (n > 100) {
      R = '████████████▌';
    } else {
      R = '█'.repeat(Math.floor(n / 8));
      switch (modulo(n, 8)) {
        case 0:
          R += '';
          break;
        case 1:
          R += '▏';
          break;
        case 2:
          R += '▎';
          break;
        case 3:
          R += '▍';
          break;
        case 4:
          R += '▌';
          break;
        case 5:
          R += '▋';
          break;
        case 6:
          R += '▊';
          break;
        case 7:
          R += '▉';
      }
    }
    // when 8 then R += '█'
    return '│' + (R.padEnd(13, ' ')) + '│';
  };

  //-----------------------------------------------------------------------------------------------------------
  this._get_averages = function(me) {
    var R, average, collector, data, i, j, k, key, keys, len, len1, len2, measurements, name, record, records, ref, target, test_name, value;
    R = {};
    collector = {};
    ref = me.records;
    for (i = 0, len = ref.length; i < len; i++) {
      record = ref[i];
      (collector[name = record.test_name] != null ? collector[name] : collector[name] = []).push(record);
    }
    keys = (function() {
      var results;
      results = [];
      for (key in me.records[0]) {
        if (key !== 'test_name') {
          results.push(key);
        }
      }
      return results;
    })();
    for (test_name in collector) {
      records = collector[test_name];
      target = R[test_name] = {};
      for (j = 0, len1 = keys.length; j < len1; j++) {
        key = keys[j];
        measurements = [];
        for (k = 0, len2 = records.length; k < len2; k++) {
          record = records[k];
          if ((value = record[key]) == null) {
            continue;
          }
          measurements.push(value);
        }
        average = (measurements.reduce((function(x, y) {
          return x + y;
        }), 0)) / measurements.length;
        target[key] = average;
      }
    }
    return (function() {
      var results;
      results = [];
      for (test_name in R) {
        data = R[test_name];
        results.push({test_name, ...data});
      }
      return results;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  /* TAINT use `me` argument instead of module globals */
  this.show_totals = function(me) {
    /* TAINT code duplication */
    var bar, best_ops, i, len, ops, ops_txt, record, records, results, rops, rops_txt, test_name, test_name_txt;
    if (me.records.length === 0) {
      throw new Error("µ33998 must do benchmarks before showing totals");
    }
    // test_names  = ( test_name for test_name, data of me.records )
    records = this._get_averages(me);
    records.sort(function(a, b) {
      if (a.ops < b.ops) {
        return +1;
      }
      if (a.ops > b.ops) {
        return -1;
      }
      return 0;
    });
    best_ops = records[0].ops;
    results = [];
    for (i = 0, len = records.length; i < len; i++) {
      record = records[i];
      ({test_name, ops} = record);
      rops = (ops / best_ops) * 100;
      test_name_txt = test_name.padEnd(40);
      ops_txt = f0l(ops);
      rops_txt = f1s(rops);
      bar = bar_from_percentage(Math.round(rops));
      results.push(info(test_name_txt, ops_txt, 'Hz', rops_txt, '%', bar));
    }
    return results;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  f0 = function(n) {
    return (nf('###,##0.', n)).padStart(15);
  };

  f0l = function(n) {
    return (nf('###,##0.', n)).padStart(15);
  };

  f1s = function(n) {
    return (nf('###,##0.0', n)).padStart(7);
  };

  f3 = function(n) {
    return (nf('###,##0.000', n)).padStart(15);
  };

  f3s = function(n) {
    return (nf('###,##0.000', n)).padStart(7);
  };

  f9 = function(n) {
    return (nf('###,##0.000000000', n)).padStart(24);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.new_benchmarks = function() {
    return {
      records: []
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this.benchmark = function(me, n, show, parent, test_name) {
    var benchmark;
    return new Promise(benchmark = async(resolve) => {
      var count, count_txt, cpu1, cpu2, cpusys_txt, cpuusr_txt, dt1ns, dt1s, dt2ns, dt2s, dt2s_txt, error, nspc, nspc_txt, ops, ops_txt, t0ns, t1ns, t2ns, test, test_name_txt;
      if (test_name == null) {
        for (test_name in parent) {
          if (test_name.startsWith('_')) {
            continue;
          }
          await this.benchmark(n, show, parent, test_name);
        }
        return null;
      }
      //.........................................................................................................
      t0ns = this.time_now();
      try {
        test = (await parent[test_name](n, show));
      } catch (error1) {
        error = error1;
        warn(`µ77812 when trying to run test ${rpr(test_name)}, an error occurred`);
        throw error;
      }
      t1ns = this.time_now();
      cpu1 = process.cpuUsage();
      console.profile(test_name);
      count = (await test());
      console.profileEnd(test_name);
      cpu2 = process.cpuUsage(cpu1);
      t2ns = this.time_now();
      //.........................................................................................................
      dt1ns = parseInt(t1ns - t0ns, 10);
      dt2ns = parseInt(t2ns - t1ns, 10);
      dt1s = dt1ns / 1e9;
      dt2s = dt2ns / 1e9;
      nspc = dt2ns / count;
      ops = count / dt2s;
      //.........................................................................................................
      test_name_txt = test_name.padEnd(40);
      // dt1s_txt      = f3s   dt1s
      dt2s_txt = f3s(dt2s);
      count_txt = f0(count);
      ops_txt = f0l(ops);
      nspc_txt = f0(nspc);
      cpuusr_txt = f0(cpu2.user / 1e3);
      cpusys_txt = f0(cpu2.system / 1e3);
      echo([
        `${CND.yellow(test_name_txt)}`,
        // "#{CND.grey dt1s_txt + ' s'}"
        `${dt2s_txt} s`,
        `${count_txt} items`,
        `${CND.green(ops_txt)}⏶Hz`,
        `${CND.gold(nspc_txt)}⏷nspc`,
        `${CND.gold(cpuusr_txt)}⏷CPU/u`,
        `${CND.gold(cpusys_txt)}⏷CPU/s`
      ].join(' '));
      // debug '^1662^ cpu', cpu2
      this.add_result(me, test_name, {ops});
      resolve();
      return null;
    });
  };

}).call(this);

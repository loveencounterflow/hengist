(function() {
  'use strict';
  var CHEERIO, CND, DBay, Ebayde, FS, GUY, H, HDML, Hnrss, PATH, SQL, Vogue, Vogue_scraper_ABC, badge, debug, demo_1, demo_ebayde, demo_hnrss, demo_serve_ebayde, demo_serve_hnrss, demo_statement_type_info, demo_zvg24_net, demo_zvg_online_net, echo, glob, got, help, info, rpr, show_post_counts, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-VOGUE/DEMO';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  //...........................................................................................................
  // ( require 'mixa/lib/check-package-versions' ) require '../pinned-package-versions.json'
  PATH = require('path');

  FS = require('fs');

  got = require('got');

  CHEERIO = require('cheerio');

  GUY = require('../../../apps/guy');

  ({DBay} = require('../../../apps/dbay'));

  ({SQL} = DBay);

  ({Vogue, Vogue_scraper_ABC} = require('../../../apps/dbay-vogue'));

  ({HDML} = require('../../../apps/hdml'));

  H = require('../../../apps/dbay-vogue/lib/helpers');

  glob = require('glob');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = async function() {
    var data, elements, response, url;
    url = 'https://ionicabizau.net';
    elements = {
      title: ".header h1",
      desc: ".header h2",
      avatar: {
        selector: ".header img",
        attr: "src"
      }
    };
    ({data, response} = (await scrape_it(url, elements)));
    info("Status Code: ${response.statusCode}");
    urge(data);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_zvg_online_net = async function() {
    var R, buffer, container, d, elements, encoding, html, i, idx, j, key, len, len1, line, match, ref, ref1, url, value;
    url = 'https://www.zvg-online.net/1400/1101986118/ag_seite_001.php';
    elements = {
      // containers: '.container_vors a'
      containers: {
        listItem: '.container_vors',
        data: {
          listing: {
            listItem: 'a'
          }
        }
      }
    };
    encoding = 'latin1';
    //.........................................................................................................
    buffer = (await got(url));
    html = buffer.rawBody.toString(encoding);
    d = (await scrape_it.scrapeHTML(html, elements));
    ref = d.containers;
    // info "Status Code: #{response.statusCode}"
    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
      container = ref[idx];
      urge('^74443^', idx, rpr(container.listing));
      R = [];
      ref1 = container.listing;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        line = ref1[j];
        if ((match = line.match(/^(?<key>[^:]*):(?<value>.*)$/)) == null) {
          help('^3453^', rpr(line));
          R.push({
            key: './.',
            value: line
          });
          continue;
        }
        ({key, value} = match.groups);
        key = key.trim();
        value = value.trim();
        R.push({key, value});
      }
      console.table(R);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_zvg24_net = async function() {
    var buffer, d, elements, encoding, html, i, idx, len, line, lines, ref, text, url;
    url = 'https://www.zvg24.net/zwangsversteigerung/brandenburg';
    elements = {
      // containers: '.container_vors a'
      containers: {
        listItem: 'article'
      }
    };
    //     data:
    //       listing:
    //         listItem: 'a'
    encoding = 'utf8';
    //.........................................................................................................
    // buffer    = await got url
    // html      = buffer.rawBody.toString encoding
    buffer = FS.readFileSync(PATH.join(__dirname, '../sample-data/www.zvg24.net_,_zwangsversteigerung_,_brandenburg.html'));
    html = buffer.toString(encoding);
    d = (await scrape_it.scrapeHTML(html, elements));
    ref = d.containers;
    // info "Status Code: #{response.statusCode}"
    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
      text = ref[idx];
      lines = text.split(/\s*\n\s*/);
      // text = text.replace /\x20+/g, ' '
      // text = text.replace /\n\x20\n/g, '\n'
      // text = text.replace /\n+/g, '\n'
      // text = text.replace /Musterbild\n/g, ''
      lines = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = lines.length; j < len1; j++) {
          line = lines[j];
          if (line !== 'Musterbild') {
            results.push(line);
          }
        }
        return results;
      })();
      urge('^74443^', idx, rpr(lines));
    }
    // urge '^74443^', idx, rpr container.replace /\n+/g, '\n'
    // R = []
    // for line in container.listing
    //   unless ( match = line.match /^(?<key>[^:]*):(?<value>.*)$/ )?
    //     help '^3453^', rpr line
    //     R.push { key: './.', value: line, }
    //     continue
    //   { key, value, } = match.groups
    //   key             = key.trim()
    //   value           = value.trim()
    //   R.push { key, value, }
    // console.table R
    return null;
  };

  //===========================================================================================================
  Ebayde = class Ebayde extends Vogue_scraper_ABC {
    //---------------------------------------------------------------------------------------------------------
    scrape_html(html_or_buffer) {
      var $, R, details, dsk, html, i, insert_post, item, item_details, item_id, item_price, item_subtitle, item_title, item_url, len, pid, ref, row, seen, session, sid, subtitle, title, title_url;
      dsk = 'ebayde';
      session = this.hub.vdb.new_session(dsk);
      ({sid} = session);
      insert_post = this.hub.vdb.queries.insert_post;
      seen = this.hub.vdb.db.dt_now();
      //.......................................................................................................
      html = this._html_from_html_or_buffer(html_or_buffer);
      $ = CHEERIO.load(html);
      R = [];
      ref = $('div.s-item__info');
      //.......................................................................................................
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        item = $(item);
        item_details = item.find('div.s-item__details');
        item_title = item.find('h3.s-item__title');
        item_subtitle = item.find('div.s-item__subtitle');
        item_price = item.find('span.s-item__price');
        // urge '^434554^', item_details.text()
        // info '^434554^', item_title.text()
        // info '^434554^', item_subtitle.text()
        // info '^434554^', item_price.text()
        item_url = (item.find('a')).attr('href');
        item_url = item_url.replace(/^([^?]+)\?.*$/, '$1');
        item_id = item_url.replace(/^.*\/([^\/]+)$/, '$1');
        if (item_id === '123456') {
          warn("skipping invalid Item ID (123456)");
          continue;
        }
        // info '^434554^', item_url
        // info '^434554^', item_id
        pid = `ebayde-${item_id}`;
        title = item_title.text();
        subtitle = item_subtitle.text();
        title = title + ` / ${subtitle}`;
        title_url = item_url;
        //.....................................................................................................
        details = {title, title_url};
        row = this.hub.vdb.new_post({dsk, sid, pid, session, details});
      }
      //.......................................................................................................
      // process.exit 111
      return null;
    }

  };

  //===========================================================================================================
  Hnrss = class Hnrss extends Vogue_scraper_ABC {
    //---------------------------------------------------------------------------------------------------------
    _remove_cdata(text) {
      return text.replace(/^<!\[CDATA\[(.*)\]\]>$/, '$1');
    }

    //---------------------------------------------------------------------------------------------------------
    _article_url_from_description(description) {
      var match;
      if ((match = description.match(/Article URL:\s*(?<article_url>[^\s]+)/)) != null) {
        return match.groups.article_url;
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    async scrape() {
      var buffer, encoding, url;
      url = 'https://hnrss.org/newest?link=comments';
      encoding = 'utf8';
      buffer = (await got(url));
      return this.scrape_html(buffer.rawBody);
    }

    //---------------------------------------------------------------------------------------------------------
    scrape_html(html_or_buffer) {
      /* TAINT avoid duplicate query */
      var $, article_url, creator, date, description, details, discussion_url, dsk, href, html, i, insert_post, item, len, pid, ref, row, seen, session, sid, title, title_url;
      dsk = 'hn';
      session = this.hub.vdb.new_session(dsk);
      ({sid} = session);
      insert_post = this.hub.vdb.queries.insert_post;
      seen = this.hub.vdb.db.dt_now();
      //.......................................................................................................
      html = this._html_from_html_or_buffer(html_or_buffer);
      //.......................................................................................................
      /* NOTE This is RSS XML, so `link` doesn't behave like HTML `link` and namespaces are not supported: */
      /* TAINT Cheerio docs: "can select with XML Namespaces but due to the CSS specification, the colon (:)
          needs to be escaped for the selector to be valid" */
      html = html.replace(/<dc:creator>/g, '<creator>');
      html = html.replace(/<\/dc:creator>/g, '</creator>');
      html = html.replace(/<link>/g, '<reserved-link>');
      html = html.replace(/<\/link>/g, '</reserved-link>');
      //.......................................................................................................
      $ = CHEERIO.load(html);
      ref = $('item');
      //.......................................................................................................
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        item = $(item);
        //.....................................................................................................
        title = item.find('title');
        title = title.text();
        title = this._remove_cdata(title);
        title = title.trim();
        //.....................................................................................................
        discussion_url = item.find('reserved-link');
        discussion_url = discussion_url.text();
        pid = discussion_url.replace(/^.*item\?id=([0-9]+)$/, 'hn-$1');
        //.....................................................................................................
        date = item.find('pubDate');
        date = date.text();
        //.....................................................................................................
        creator = item.find('creator');
        creator = creator.text();
        //.....................................................................................................
        description = item.find('description');
        description = description.text();
        description = this._remove_cdata(description);
        article_url = this._article_url_from_description(description);
        title_url = discussion_url;
        //.....................................................................................................
        href = null;
        details = {title, title_url, date, creator, description};
        row = this.hub.vdb.new_post({dsk, sid, pid, session, details});
      }
      return null;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  demo_hnrss = async function() {
    var Vogue_db, db, dsk, glob_pattern, i, len, path, ref, scraper, trash_path, trash_sql_path, vdb, vogue;
    ({Vogue, Vogue_scraper_ABC, Vogue_db} = require('../../../apps/dbay-vogue'));
    ({DBay} = require('../../../apps/dbay'));
    path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/dbay-vogue.db'));
    trash_path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/dbay-vogue.trashed.db'));
    trash_sql_path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/dbay-vogue.trashed.sql'));
    db = new DBay({path});
    vdb = new Vogue_db({db});
    vogue = new Vogue({vdb});
    dsk = 'hn';
    scraper = new Hnrss();
    vogue.scrapers.add({dsk, scraper});
    /* TAINT use API method, don't use query directly */
    /* TAINT should be done by `vogue.scraper.add()` */
    vogue.vdb.queries.insert_datasource.run({
      dsk,
      url: 'http://nourl'
    });
    //.........................................................................................................
    glob_pattern = PATH.join(__dirname, '../../../assets/dbay-vogue/hnrss.org_,_newest.???.xml');
    ref = glob.sync(glob_pattern);
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      await (async() => {
        var buffer;
        buffer = FS.readFileSync(path);
        return (await scraper.scrape_html(buffer));
      })();
    }
    //.........................................................................................................
    show_post_counts(db);
    return vogue;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_ebayde = async function() {
    var Vogue_db, db, dsk, glob_pattern, i, len, path, ref, scraper, vdb, vogue;
    ({Vogue, Vogue_scraper_ABC, Vogue_db} = require('../../../apps/dbay-vogue'));
    ({DBay} = require('../../../apps/dbay'));
    dsk = 'ebayde';
    path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/dbay-vogue.db'));
    db = new DBay({path});
    vdb = new Vogue_db({db});
    vogue = new Vogue({vdb});
    scraper = new Ebayde();
    vogue.scrapers.add({dsk, scraper});
    /* TAINT use API method, don't use query directly */
    /* TAINT should be done by `vogue.scraper.add()` */
    vogue.vdb.queries.insert_datasource.run({
      dsk,
      url: 'http://nourl'
    });
    //.........................................................................................................
    glob_pattern = PATH.join(__dirname, '../../../assets/dbay-vogue/ebay-de-search-result-rucksack-????????-??????Z.html');
    ref = glob.sync(glob_pattern);
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      await (async() => {
        var buffer;
        buffer = FS.readFileSync(path);
        return (await scraper.scrape_html(buffer));
      })();
    }
    //.........................................................................................................
    show_post_counts(db);
    return vogue;
  };

  //-----------------------------------------------------------------------------------------------------------
  show_post_counts = function(db) {
    H.tabulate("PIDs", db(SQL`select 'distinct in vogue_posts'  as "title", count( distinct pid ) as count from vogue_posts
union all
select 'all in vogue_trends'      as "title", count(*)              as count from vogue_trends;`));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_serve_hnrss = async function(cfg) {
    var vogue;
    vogue = (await demo_hnrss());
    debug('^445345-16^', vogue.server.start());
    help('^445345-17^', "server started");
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_serve_ebayde = async function(cfg) {
    var vogue;
    vogue = (await demo_ebayde());
    // H.tabulate 'vogue_ordered_trends', vogue.vdb.db SQL"""
    //   select
    //     rnr,
    //     dsk,
    //     sid,
    //     ts,
    //     pid,
    //     rank,
    //     substring( raw_trend, 1, 10 ) as raw_trend,
    //     substring( details, 1, 10 ) as details
    //   from vogue_ordered_trends;"""
    // process.exit 111
    debug('^445345-16^', vogue.server.start());
    help('^445345-17^', "server started");
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_statement_type_info = function() {
    var Vogue_db, db, error, name, query, ref, vdb;
    ({Vogue_db} = require('../../../apps/dbay-vogue'));
    ({DBay} = require('../../../apps/dbay'));
    db = new DBay();
    vdb = new Vogue_db({db});
    ref = vdb.queries;
    for (name in ref) {
      query = ref[name];
      try {
        H.tabulate(name, query.columns());
      } catch (error1) {
        error = error1;
        warn('^446^', name, error.message);
      }
    }
    query = db.prepare(SQL`select * from vogue_trends;`);
    H.tabulate("vogue_trends", query.columns());
    query = db.prepare(SQL`select * from vogue_XXX_grouped_ranks;`);
    H.tabulate("vogue_XXX_grouped_ranks", query.columns());
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_zvg_online_net()
      // await demo_zvg24_net()
      // await demo_hnrss()
      return (await demo_serve_hnrss());
    })();
  }

  // await demo_serve_ebayde()
// await demo_statement_type_info()

}).call(this);

//# sourceMappingURL=demo-hnrss.js.map
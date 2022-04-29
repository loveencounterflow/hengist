(function() {
  'use strict';
  var CHEERIO, CND, DBay, Ebayde, FS, GUY, H, HDML, Hnrss, PATH, SQL, Vogue, Vogue_scraper, badge, debug, demo_1, demo_ebayde, demo_hnrss, demo_serve_ebayde, demo_serve_hnrss, demo_zvg24_net, demo_zvg_online_net, echo, glob, got, help, info, rpr, types, urge, warn, whisper;

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

  ({Vogue, Vogue_scraper} = require('../../../apps/dbay-vogue'));

  ({HDML} = require('../../../apps/dbay-vogue/lib/hdml2'));

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
  Ebayde = class Ebayde extends Vogue_scraper {
    //---------------------------------------------------------------------------------------------------------
    scrape_html(html_or_buffer) {
      var $, R, details, dsk, html, i, insert_post, item, item_details, item_id, item_price, item_subtitle, item_title, item_url, len, pid, ref, row, seen, sid, subtitle, title;
      dsk = 'ebayde';
      ({sid} = this.vogue.new_session(dsk));
      insert_post = this.vogue.queries.insert_post;
      seen = this.vogue.db.dt_now();
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
        //.....................................................................................................
        details = {title, item_url};
        details = JSON.stringify(details);
        row = this.vogue.new_post({sid, pid, details});
      }
      //.......................................................................................................
      // process.exit 111
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    get_html_for_trends(row) {
      var details, dsk, dsk_html, id_html, pid, rank, rank_html, sid, sid_html, tds, title_html, trend, trend_html, ts, ts_html;
      ({dsk, sid, ts, pid, rank, trend, details} = row);
      //.......................................................................................................
      trend = JSON.parse(trend);
      details = JSON.parse(details);
      dsk_html = HDML.text(dsk);
      sid_html = HDML.text(`${sid}`);
      ts_html = HDML.text(ts);
      id_html = HDML.text(pid);
      rank_html = HDML.text(`${rank}`);
      trend_html = HDML.text(JSON.stringify(trend));
      title_html = HDML.insert('a', {
        href: details.item_url
      }, HDML.text(details.title));
      //.......................................................................................................
      tds = [HDML.insert('td', dsk_html), HDML.insert('td', sid_html), HDML.insert('td', id_html), HDML.insert('td', ts_html), HDML.insert('td', rank_html), HDML.insert('td', this.get_sparkline(trend)), HDML.insert('td', trend_html), HDML.insert('td', title_html)];
      //.......................................................................................................
      return HDML.insert('tr', null, tds.join('\n'));
    }

  };

  //===========================================================================================================
  Hnrss = class Hnrss extends Vogue_scraper {
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
      var $, R, article_url, creator, date, description, details, discussion_url, dsk, href, html, i, insert_post, item, len, pid, ref, row, seen, sid, title;
      dsk = 'hn';
      ({sid} = this.vogue.new_session(dsk));
      insert_post = this.vogue.queries.insert_post;
      seen = this.vogue.db.dt_now();
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
      R = [];
      ref = $('item');
      // debug types.type_of $ 'item'
      // debug ( $ 'item' ).html()
      // debug ( $ 'item' ).each
      // debug ( $ 'item' ).forEach
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
        //.....................................................................................................
        href = null;
        R.push({pid, title, date, creator, discussion_url, article_url});
        details = {title, discussion_url, date, creator, description};
        details = JSON.stringify(details);
        row = this.vogue.new_post({sid, pid, details});
      }
      //.......................................................................................................
      // # H.tabulate "Hacker News", R
      // H.tabulate "Hacker News", @vogue.db SQL"""select
      //     sid                     as sid,
      //     pid                      as pid,
      //     rank                    as rank,
      //     substring( details, 1, 100 )  as details
      //   from scr_posts
      //   where true
      //     -- and ( rank < 10 )
      //   order by sid, rank;"""
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    get_html_for_trends(row) {
      var article_url, details, discussion_url, dsk, dsk_html, id_html, pid, rank, rank_html, sid, sid_html, tds, title, title_html, trend, trend_html, ts, ts_html;
      ({dsk, sid, ts, pid, rank, trend, details} = row);
      //.......................................................................................................
      ({title, discussion_url, article_url} = details);
      //.......................................................................................................
      trend = JSON.parse(trend);
      details = JSON.parse(details);
      dsk_html = HDML.text(dsk);
      sid_html = HDML.text(`${sid}`);
      ts_html = HDML.text(ts);
      id_html = HDML.text(pid);
      rank_html = HDML.text(`${rank}`);
      // debug '^354534^', rpr details
      // debug '^354534^', rpr details.title
      // debug '^354534^', rpr title
      // debug '^354534^', rpr discussion_url
      // debug '^354534^', rpr article_url
      // debug '^354534^', types.type_of HDML.insert 'a', { href: discussion_url, }, HDML.text title
      // process.exit 111
      trend_html = HDML.text(JSON.stringify(trend));
      title_html = HDML.insert('a', {
        href: details.discussion_url
      }, HDML.text(details.title));
      //.......................................................................................................
      tds = [HDML.insert('td', dsk_html), HDML.insert('td', sid_html), HDML.insert('td', id_html), HDML.insert('td', ts_html), HDML.insert('td', rank_html), HDML.insert('td', this.get_sparkline(trend)), HDML.insert('td', trend_html), HDML.insert('td', title_html)];
      //.......................................................................................................
      return HDML.insert('tr', null, tds.join('\n'));
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  demo_hnrss = async function() {
    var glob_pattern, hnrss, i, len, path, ref;
    hnrss = new Hnrss();
    hnrss.vogue.queries.insert_datasource.run({
      dsk: 'hn',
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
        return (await hnrss.scrape_html(buffer));
      })();
    }
    //.........................................................................................................
    // H.tabulate "trends", hnrss.vogue.db SQL"""select * from _scr_trends order by pid;"""
    // H.tabulate "trends", hnrss.vogue.db SQL"""
    //   select
    //       dsk                                           as dsk,
    //       sid                                           as sid,
    //       pid                                           as pid,
    //       rank                                          as rank,
    //       trend                                         as trend,
    //       substring( details, 1, 30 )                   as details
    //     from scr_trends order by
    //       sid desc,
    //       rank;"""
    // H.tabulate "trends", hnrss.vogue.db SQL"""select * from scr_trends_html order by nr;"""
    //.........................................................................................................
    // demo_trends_as_table hnrss
    //.........................................................................................................
    return hnrss;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_ebayde = async function() {
    var Vogue_db, ebayde, glob_pattern, i, len, path, ref, vogue;
    ({Vogue_db} = require('../../../apps/dbay-vogue'));
    vogue = new Vogue_db();
    ebayde = new Ebayde();
    vogue.XXX_add_scraper(ebayde);
    /* TAINT use API method, don't use query directly */
    vogue.queries.insert_datasource.run({
      dsk: 'ebayde',
      url: 'http://nourl'
    });
    //.........................................................................................................
    glob_pattern = PATH.join(__dirname, '../../../assets/dbay-vogue/ebay-de-search-result-rucksack-????????-??????Z.html');
    ref = glob.sync(glob_pattern);
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      debug('^435345^', path);
      await (async() => {
        var buffer;
        buffer = FS.readFileSync(path);
        return (await ebayde.scrape_html(buffer));
      })();
    }
    //.........................................................................................................
    return ebayde;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_serve_hnrss = async function(cfg) {
    var Vogue_server, hnrss, k, vogue_server;
    ({Vogue_server} = require('../../../apps/dbay-vogue/lib/vogue-server'));
    hnrss = (await demo_hnrss());
    vogue_server = new Vogue_server({
      client: hnrss
    });
    debug('^45345^', vogue_server);
    debug('^45345^', (function() {
      var results;
      results = [];
      for (k in vogue_server) {
        results.push(k);
      }
      return results;
    })());
    return debug('^45345^', (await vogue_server.start()));
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_serve_ebayde = async function(cfg) {
    var Vogue_server, ebayde, k, vogue_server;
    ({Vogue_server} = require('../../../apps/dbay-vogue/lib/vogue-server'));
    ebayde = (await demo_ebayde());
    vogue_server = new Vogue_server({
      client: ebayde
    });
    debug('^45345^', vogue_server);
    debug('^45345^', (function() {
      var results;
      results = [];
      for (k in vogue_server) {
        results.push(k);
      }
      return results;
    })());
    return debug('^45345^', (await vogue_server.start()));
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_zvg_online_net()
      // await demo_zvg24_net()
      // await demo_hnrss()
      // await demo_serve_hnrss()
      return (await demo_serve_ebayde());
    })();
  }

  // view-source:https://www.skypack.dev/search?q=sqlite&p=1
// await demo_oanda_com_jsdom()
// f()

}).call(this);

//# sourceMappingURL=demo-hnrss.js.map
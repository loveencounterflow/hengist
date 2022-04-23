(function() {
  'use strict';
  var CHEERIO, CND, DBay, FS, GUY, H, HDML, Hnrss, PATH, SQL, Scraper, badge, debug, demo_1, demo_hnrss, demo_zvg24_net, demo_zvg_online_net, echo, got, help, info, relation_as_html, rpr, types, urge, warn, whisper;

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

  ({Scraper} = require('../../../apps/dbay-vogue'));

  ({HDML} = require('../../../apps/dbay-vogue/lib/hdml2'));

  H = require('../../../apps/dbay-vogue/lib/helpers');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  types.declare('scraper_html_or_buffer', {
    tests: {
      // "@isa.object x":                        ( x ) -> @isa.object x
      "@type_of x in [ 'text', 'buffer', ]": function(x) {
        return this.type_of(x === 'text' || x === 'buffer');
      }
    }
  });

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
  Hnrss = class Hnrss {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      /* TAINT encoding, url are not configurables */
      var defaults;
      defaults = {
        encoding: 'utf-8'
      };
      this.cfg = GUY.lft.freeze({...defaults, ...cfg});
      GUY.props.hide(this, 'scr', new Scraper({
        client: this
      }));
      return void 0;
    }

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
    _html_from_html_or_buffer(html_or_buffer) {
      types.validate.scraper_html_or_buffer(html_or_buffer);
      if ((types.type_of(html_or_buffer)) === 'buffer') {
        return html_or_buffer.toString(this.cfg.encoding);
      }
      return html_or_buffer;
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
      ({sid} = this.scr.new_session(dsk));
      insert_post = this.scr.queries.insert_post;
      seen = this.scr.db.dt_now();
      //.......................................................................................................
      html = this._html_from_html_or_buffer(html_or_buffer);
      //.......................................................................................................
      /* NOTE This is RSS XML, so `link` doesn't behave like HTML `link` and namespaces are not supported: */
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
        row = this.scr.new_post({sid, pid, details});
      }
      //.......................................................................................................
      // # H.tabulate "Hacker News", R
      // H.tabulate "Hacker News", @scr.db SQL"""select
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

    //-----------------------------------------------------------------------------------------------------------
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
      title_html = HDML.text(details.title.slice(0, 51));
      //.......................................................................................................
      /* TAINT use proper way to shorten string */      tds = [HDML.embrace('td', null, dsk_html), HDML.embrace('td', null, sid_html), HDML.embrace('td', null, id_html), HDML.embrace('td', null, ts_html), HDML.embrace('td', null, rank_html), HDML.embrace('td', null, trend_html), HDML.embrace('td', null, title_html)];
      //.........................................................................................................
      return HDML.embrace('tr', null, tds.join(''));
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  demo_hnrss = async function() {
    var hnrss;
    // #.........................................................................................................
    // do =>
    //   scraper   = new Hnrss()
    //   await scraper.scrape()
    hnrss = new Hnrss();
    // H.tabulate "scr", hnrss.scr.db SQL"select * from sqlite_schema;"
    hnrss.scr.queries.insert_datasource.run({
      dsk: 'hn',
      url: 'http://nourl'
    });
    await (async() => {      //.........................................................................................................
      var buffer;
      buffer = FS.readFileSync(PATH.join(__dirname, '../../../apps/dbay-vogue/sample-data/hnrss.org_,_newest.001.xml'));
      return (await hnrss.scrape_html(buffer));
    })();
    await (async() => {      //.........................................................................................................
      var buffer;
      buffer = FS.readFileSync(PATH.join(__dirname, '../../../apps/dbay-vogue/sample-data/hnrss.org_,_newest.002.xml'));
      return (await hnrss.scrape_html(buffer));
    })();
    await (async() => {      //.........................................................................................................
      var buffer;
      buffer = FS.readFileSync(PATH.join(__dirname, '../../../apps/dbay-vogue/sample-data/hnrss.org_,_newest.003.xml'));
      return (await hnrss.scrape_html(buffer));
    })();
    await (async() => {      //.........................................................................................................
      var buffer;
      buffer = FS.readFileSync(PATH.join(__dirname, '../../../apps/dbay-vogue/sample-data/hnrss.org_,_newest.004.xml'));
      return (await hnrss.scrape_html(buffer));
    })();
    //.........................................................................................................
    // H.tabulate "trends", hnrss.scr.db SQL"""select * from _scr_trends order by pid;"""
    // H.tabulate "trends", hnrss.scr.db SQL"""
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
    H.tabulate("trends", hnrss.scr.db(SQL`select * from scr_trends_html order by nr;`));
    //.........................................................................................................
    // demo_trends_as_table hnrss
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  relation_as_html = function(cfg) {};

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_zvg_online_net()
      // await demo_zvg24_net()
      return (await demo_hnrss());
    })();
  }

  // view-source:https://www.skypack.dev/search?q=sqlite&p=1
// await demo_oanda_com_jsdom()
// f()

}).call(this);

//# sourceMappingURL=demo-hnrss.js.map
(function() {
  'use strict';
  var CHEERIO, CND, DBay, Ebayde, FS, GUY, H, HDML, Hnrss, PATH, SQL, Scraper, Vogue, badge, debug, demo_1, demo_hnrss, demo_serve, demo_zvg24_net, demo_zvg_online_net, echo, glob, got, help, info, rpr, types, urge, warn, whisper;

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

  ({Vogue, Scraper} = require('../../../apps/dbay-vogue'));

  ({HDML} = require('../../../apps/dbay-vogue/lib/hdml2'));

  H = require('../../../apps/dbay-vogue/lib/helpers');

  glob = require('glob');

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
  Ebayde = class Ebayde extends Scraper {};

  //===========================================================================================================
  Hnrss = class Hnrss extends Scraper {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var defaults;
      /* TAINT encoding, url are not configurables */
      super();
      defaults = {
        encoding: 'utf-8'
      };
      this.cfg = GUY.lft.freeze({...defaults, ...cfg});
      GUY.props.hide(this, 'vogue', new Vogue({
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
      ({sid} = this.vogue.new_session(dsk));
      insert_post = this.vogue.queries.insert_post;
      seen = this.vogue.db.dt_now();
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
    get_sparkline(trend) {
      var R, dense_trend, i, j, len, len1, rank, sid, values, values_json;
      // # values = [ { sid: -1, rank: -1,  }, ]
      // values = []
      // for [ sid, rank, ] in trend
      //   values.push { sid, rank: -rank, }
      // values.unshift { sid: -1, rank: -1, } if values.length < 2
      //.......................................................................................................
      dense_trend = [];
      for (i = 0, len = trend.length; i < len; i++) {
        [sid, rank] = trend[i];
        dense_trend[sid] = rank;
      }
      // for rank, sid in dense_trend
      //   dense_trend[ sid ] = 21 unless rank?
      // dense_trend.unshift 21 while dense_trend.length < 12
      values = [];
      for (sid = j = 0, len1 = dense_trend.length; j < len1; sid = ++j) {
        rank = dense_trend[sid];
        values.push({sid, rank});
      }
      //.......................................................................................................
      values_json = JSON.stringify(values);
      //.......................................................................................................
      R = `<script>
var data      = ${values_json};
var plot_cfg  = {
  marks: [
    Plot.line( data, {
      x:            'sid',
      y:            'rank',
      stroke:       'red',
      strokeWidth:  4,
      // curve:        'step' } ),
      curve:        'linear' } ),
      // curve:        'cardinal' } ),
    Plot.dot( data, {
      x:            'sid',
      y:            'rank',
      stroke:       'red',
      fill:         'red',
      strokeWidth:  4, } ),
    ],
  width:      500,
  height:     100,
  x:          { ticks: 12, domain: [ 0, 12, ], step: 1, },
  y:          { ticks: 4, domain: [ 0, 20, ], step: 1, reverse: true, },
  marginLeft: 50,
  // color: {
  //   type: "linear",
  //   scheme: "cividis",
  //   legend: true,
  //   domain: [0, 20],
  //   range: [0, 1] },
  };
  // color: {
  //   legend: true,
  //   width: 554,
  //   columns: '120px', } };
document.body.append( Plot.plot( plot_cfg ) );
</script>`;
      //.......................................................................................................
      return R;
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
      return HDML.insert('tr', null, tds.join(''));
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  demo_hnrss = async function() {
    var glob_pattern, hnrss, i, len, path, ref;
    // #.........................................................................................................
    // do =>
    //   scraper   = new Hnrss()
    //   await scraper.scrape()
    hnrss = new Hnrss();
    // H.tabulate "vogue", hnrss.vogue.db SQL"select * from sqlite_schema;"
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
    H.tabulate("trends", hnrss.vogue.db(SQL`select * from scr_trends_html order by nr;`));
    //.........................................................................................................
    // demo_trends_as_table hnrss
    //.........................................................................................................
    return hnrss;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_serve = async function(cfg) {
    var Vogue_server, hnrss, k, vogue_server;
    ({Vogue_server} = require('../../../apps/dbay-vogue/lib/server'));
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

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_zvg_online_net()
      // await demo_zvg24_net()
      // await demo_hnrss()
      return (await demo_serve());
    })();
  }

  // view-source:https://www.skypack.dev/search?q=sqlite&p=1
// await demo_oanda_com_jsdom()
// f()

}).call(this);

//# sourceMappingURL=demo-hnrss.js.map
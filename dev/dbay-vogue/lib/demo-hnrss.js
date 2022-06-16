(function() {
  'use strict';
  var CHEERIO, CND, DBay, Ebayde, FS, GUY, Github, H, HDML, Hnrss, PATH, SQL, URL, Vogue, Vogue_scraper_ABC, badge, debug, demo_1, demo_read_datasources_start_server, demo_zvg24_net, demo_zvg_online_net, echo, glob, got, help, info, rpr, show_post_counts, to_width, types, urge, warn, whisper;

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

  ({to_width} = require('to-width'));

  URL = require('node:url');

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
    _article_from_article_url(article_url) {
      var url;
      if (article_url == null) {
        return null;
      }
      url = URL.parse(article_url);
      return `${url.host}${to_width(url.pathname, 50)}`;
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
      var $, article, article_url, creator, date, description, details, dsk, href, html, i, insert_post, item, len, pid, ref, row, seen, session, sid, title, title_url;
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
        title_url = item.find('reserved-link');
        title_url = title_url.text();
        pid = title_url.replace(/^.*item\?id=([0-9]+)$/, 'hn-$1');
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
        article = this._article_from_article_url(article_url);
        //.....................................................................................................
        href = null;
        /* TAINT avoid duplicate query */
        // details = { title, title_url, article_url, date, creator, description, }
        details = {title, title_url, article, article_url, date};
        row = this.hub.vdb.new_post({dsk, sid, pid, session, details});
      }
      return null;
    }

  };

  //===========================================================================================================
  Github = class Github extends Vogue_scraper_ABC {
    /*

    Properties of `repo`:

    allow_forking archive_url archived assignees_url blobs_url branches_url clone_url collaborators_url
    comments_url commits_url compare_url contents_url contributors_url created_at default_branch deployments_url
    description disabled downloads_url events_url fork forks forks_count forks_url full_name git_commits_url
    git_refs_url git_tags_url git_url has_downloads has_issues has_pages has_projects has_wiki homepage
    hooks_url html_url id is_template issue_comment_url issue_events_url issues_url keys_url labels_url language
    languages_url license merges_url milestones_url mirror_url name node_id notifications_url open_issues
    open_issues_count owner private pulls_url pushed_at releases_url size ssh_url stargazers_count
    stargazers_url statuses_url subscribers_url subscription_url svn_url tags_url teams_url topics trees_url
    updated_at url visibility watchers watchers_count

    */
    //---------------------------------------------------------------------------------------------------------
    _get_authorization() {
      var mimi_path;
      mimi_path = PATH.resolve(PATH.join(__dirname, '../../../../../temp/mimi'));
      return (FS.readFileSync(mimi_path, {
        encoding: 'utf-8'
      })).trim();
    }

    //---------------------------------------------------------------------------------------------------------
    async scrape() {
      /* TAINT make `dsk` a `cfg` property of instance */
      var buffer, description, dsk, got_cfg, i, len, q, ref, repo, repo_d, repo_name, repo_url, repos_d, repos_url, session, sid, username;
      dsk = 'gh';
      // { dsk, }    = @cfg
      session = this.hub.vdb.new_session(dsk);
      ({sid} = session);
      username = 'loveencounterflow';
      //.......................................................................................................
      /* TAINT use proper URL builder */
      repos_url = `https://api.github.com/users/${encodeURIComponent(username)}/repos`;
      q = {
        per_page: 100,
        page: 0
      };
      got_cfg = {
        headers: {
          'accept': 'application/vnd.github.v3+json',
          authorization: this._get_authorization()
        },
        searchParams: q
      };
      while (true) {
        whisper('^342-1^', '——————————————————————————————————————————————————————');
        q.page++;
        if (q.page > 10) {
          process.exit(111);
        }
        buffer = (await got(repos_url, got_cfg));
        repos_d = JSON.parse(buffer.rawBody.toString());
        if (repos_d.length === 0) {
          break;
        }
        for (i = 0, len = repos_d.length; i < len; i++) {
          repo_d = repos_d[i];
          repo_name = repo_d.name;
          repo_url = repo_d.url;
          description = (ref = repo_d.description) != null ? ref : '';
          description = (Array.from(description)).slice(0, 81).join('');
          if (description.length > 0) {
            repo = `${repo_name} (${description})`;
          } else {
            repo = repo_name;
          }
          debug('^342-2^', repo);
          echo(repo_name);
        }
      }
      // #.....................................................................................................
      // ### TAINT use proper URL builder ###
      // debug '^34534-9^', db.dt_isots_from_dbayts db.dt_now { subtract: [ 1, 'month', ], }
      // commits_url = "https://api.github.com/repos/#{encodeURIComponent username}/#{encodeURIComponent repo_name}/commits"
      // buffer      = await got commits_url, got_cfg
      // commits     = JSON.parse buffer.rawBody.toString()
      // for commit in commits
      //   title_url = commit.html_url
      //   title     = ( ( commit.commit.message ? '' ).split '\n' )[ 0 ]
      //   sha       = commit.sha
      //   sha       = sha[ .. 7 ]
      //   pid       = "#{dsk}-#{repo_name}-#{sha}"
      //   date      = @hub.vdb.db.dt_from_iso commit.commit.author.date
      //   details   = { title, title_url, date, repo, repo_url, }
      //   row       = @hub.vdb.new_post { dsk, sid, pid, session, details, }
      //   whisper '^33423^', { repo, sha, date, title, title_url, }
      //   debug '^33423^', row
      // #.....................................................................................................
      // process.exit 111
      // url       = 'https://hnrss.org/newest?link=comments'
      // encoding  = 'utf8'
      // return @scrape_html buffer.rawBody
      return null;
    }

  };

  // #-----------------------------------------------------------------------------------------------------------
  // demo_hnrss = ->
  //   { Vogue
  //     Vogue_scraper_ABC
  //     Vogue_db      } = require '../../../apps/dbay-vogue'
  //   { DBay          } = require '../../../apps/dbay'
  //   path              = PATH.resolve PATH.join __dirname, '../../../dev-shm/dbay-vogue.db'
  //   db                = new DBay { path, }
  //   vdb               = new Vogue_db { db, }
  //   vogue             = new Vogue { vdb, }
  //   dsk               = 'hn'
  //   scraper           = new Hnrss()
  //   vogue.scrapers.add { dsk, scraper, }
  //   ### TAINT use API method, don't use query directly ###
  //   ### TAINT should be done by `vogue.scraper.add()` ###
  //   vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
  //   #.........................................................................................................
  //   glob_pattern  = PATH.join __dirname, '../../../assets/dbay-vogue/hnrss.org_,_newest.???.xml'
  //   for path in glob.sync glob_pattern
  //     await do =>
  //       buffer    = FS.readFileSync path
  //       await scraper.scrape_html buffer
  //   #.........................................................................................................
  //   show_post_counts db
  //   return vogue

  // #-----------------------------------------------------------------------------------------------------------
  // demo_ebayde = ->
  //   { Vogue
  //     Vogue_scraper_ABC
  //     Vogue_db      } = require '../../../apps/dbay-vogue'
  //   { DBay          } = require '../../../apps/dbay'
  //   dsk               = 'ebayde'
  //   path              = PATH.resolve PATH.join __dirname, '../../../dev-shm/dbay-vogue.db'
  //   db                = new DBay { path, }
  //   vdb               = new Vogue_db { db, }
  //   vogue             = new Vogue { vdb, }
  //   scraper           = new Ebayde()
  //   vogue.scrapers.add { dsk, scraper, }
  //   ### TAINT use API method, don't use query directly ###
  //   ### TAINT should be done by `vogue.scraper.add()` ###
  //   vogue.vdb.queries.insert_datasource.run { dsk, url: 'http://nourl', }
  //   #.........................................................................................................
  //   glob_pattern  = PATH.join __dirname, '../../../assets/dbay-vogue/ebay-de-search-result-rucksack-????????-??????Z.html'
  //   for path in glob.sync glob_pattern
  //     await do =>
  //       buffer    = FS.readFileSync path
  //       await scraper.scrape_html buffer
  //   #.........................................................................................................
  //   show_post_counts db
  //   return vogue

  //-----------------------------------------------------------------------------------------------------------
  show_post_counts = function(db) {
    H.tabulate("PIDs", db(SQL`select 'distinct in vogue_posts'  as "title", count( distinct pid ) as count from vogue_posts
union all
select 'all in vogue_trends'      as "title", count(*)              as count from vogue_trends;`));
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // demo_statement_type_info = ->
  //   { Vogue_db      } = require '../../../apps/dbay-vogue'
  //   { DBay          } = require '../../../apps/dbay'
  //   db                = new DBay()
  //   vdb               = new Vogue_db { db, }
  //   for name, query of vdb.queries
  //     try
  //       H.tabulate name, query.columns()
  //     catch error
  //       warn '^446^', name, error.message
  //   query = db.prepare SQL"select * from vogue_trends;"; H.tabulate "vogue_trends", query.columns()
  //   query = db.prepare SQL"select * from vogue_XXX_grouped_ranks;"; H.tabulate "vogue_XXX_grouped_ranks", query.columns()
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // demo_serve_hnrss = ( cfg ) ->
  //   vogue = await demo_hnrss()
  //   debug '^445345-1^', vogue.server.start()
  //   help '^445345-2^', "server started"
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // demo_serve_ebayde = ( cfg ) ->
  //   vogue = await demo_ebayde()
  //   debug '^445345-3^', vogue.server.start()
  //   help '^445345-4^', "server started"
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  demo_read_datasources_start_server = async function(cfg) {
    var Vogue_db, db, defaults, path, response, vdb, vogue;
    defaults = {
      hnrss: true,
      ebayde: true,
      gh: true
    };
    cfg = {...defaults, ...cfg};
    ({Vogue, Vogue_scraper_ABC, Vogue_db} = require('../../../apps/dbay-vogue'));
    ({DBay} = require('../../../apps/dbay'));
    path = PATH.resolve(PATH.join(__dirname, '../../../dev-shm/dbay-vogue.db'));
    db = new DBay({path});
    vdb = new Vogue_db({db});
    vogue = new Vogue({vdb});
    //.........................................................................................................
    if (cfg.ebayde) {
      await (async() => {
        var data_path, dsk, ebayde_scraper, glob_pattern, i, len, ref, results;
        dsk = 'ebayde';
        ebayde_scraper = new Ebayde({dsk});
        vogue.scrapers.add({
          scraper: ebayde_scraper
        });
        vogue.vdb.queries.insert_datasource.run({
          dsk,
          url: 'http://nourl'
        });
        glob_pattern = PATH.join(__dirname, '../../../assets/dbay-vogue/ebay-de-search-result-rucksack-????????-??????Z.html');
        ref = glob.sync(glob_pattern);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          data_path = ref[i];
          results.push((await (async() => {
            var buffer;
            buffer = FS.readFileSync(data_path);
            return (await ebayde_scraper.scrape_html(buffer));
          })()));
        }
        return results;
      })();
    }
    //.........................................................................................................
    if (cfg.hnrss) {
      await (async() => {
        var data_path, dsk, glob_pattern, hn_scraper, i, len, ref, results;
        dsk = 'hn';
        hn_scraper = new Hnrss({dsk});
        vogue.scrapers.add({
          scraper: hn_scraper
        });
        vogue.vdb.queries.insert_datasource.run({
          dsk,
          url: 'http://nourl'
        });
        glob_pattern = PATH.join(__dirname, '../../../assets/dbay-vogue/hnrss.org_,_newest.???.xml');
        ref = glob.sync(glob_pattern);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          data_path = ref[i];
          results.push((await (async() => {
            var buffer;
            buffer = FS.readFileSync(data_path);
            return (await hn_scraper.scrape_html(buffer));
          })()));
        }
        return results;
      })();
    }
    //.........................................................................................................
    if (cfg.gh) {
      await (async() => {
        var dsk, gh_scraper;
        dsk = 'gh';
        gh_scraper = new Github({dsk});
        /* TAINT use API method, don't use query directly */
        /* TAINT should be done by `vogue.scraper.add()` */
        vogue.scrapers.add({
          scraper: gh_scraper
        });
        vogue.vdb.queries.insert_datasource.run({
          dsk,
          url: 'http://nourl'
        });
        return (await gh_scraper.scrape());
      })();
    }
    //.........................................................................................................
    show_post_counts(db);
    debug('^445345-5^', (await vogue.server.start()));
    help('^445345-6^', "server started");
    if (cfg.hnrss) {
      response = (await got("http://localhost:3456/trends?dsk=hn"));
      help('^445345-6^', `received ${Buffer.byteLength(response.body)} bytes`);
    }
    if (cfg.gh) {
      response = (await got("http://localhost:3456/trends?dsk=gh"));
      help('^445345-6^', `received ${Buffer.byteLength(response.body)} bytes`);
    }
    response = (await got("http://localhost:3456/trends"));
    help('^445345-6^', `received ${Buffer.byteLength(response.body)} bytes`);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_zvg_online_net()
      // await demo_zvg24_net()
      // await demo_serve_hnrss()
      // await demo_serve_ebayde()
      // await demo_statement_type_info()
      return (await demo_read_datasources_start_server({
        hnrss: false,
        ebayde: false,
        gh: true
      }));
    })();
  }

  // await demo_read_datasources_start_server { hnrss: true, ebayde: true, gh: false, }

}).call(this);

//# sourceMappingURL=demo-hnrss.js.map
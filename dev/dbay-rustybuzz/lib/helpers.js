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
        text = "affirmation.";
        break;
      case 'smalli':
        fontnick = 'djvsi';
        fspath = 'DejaVuSerif-Italic.ttf';
        text = "affirmation.";
        break;
      case 'small-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = "affirm affluent";
        break;
      case 'specials-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        text = "abc&wbr;x&shy;y&nl;z u近Ϣk";
        break;
      case 'small-b42':
        fontnick = 'b42';
        // text      = "far-out"
        text = `sic habet cognomina, affirmatio.&nl;sic habet cognomina, affir&wbr;matio.`;
        break;
      // text      = """sic habet cognomina, affirmatio."""
      case 'twolines-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        // text      = "far-out"
        text = `first&nl;second`;
        break;
      case 'shorties-b42':
        fontnick = 'b42';
        // text      = "far-out"
        text = `af&shy;f&shy;irm affluent deus in excelsior. ** major/minor designati.&nl;
sic habet cognomina, affirmatio.&nl;
sic habet cognomina, affir&wbr;matio.&nl;
of Memphis, Thebes, Karnak, and the Valley of the Kings&nl;
talibus appellata) pro ostentu ad visum pertinente os‌tentu brot‌zeit brotzeit&nl;`;
        break;
      case 'shorties-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        // text      = "far-out"
        text = `af&shy;f&shy;irm affluent deus in excelsior. ** major/minor designati.&nl;
sic habet cognomina, affirmatio.&nl;
of Memphis, Thebes, Karnak, and the Valley of the Kings&nl;
talibus appellata) pro ostentu ad visum pertinente os‌tentu brot‌zeit brotzeit&nl;`;
        break;
      case 'affirm-b42':
        fontnick = 'b42';
        text = `**********affirm affluent deus in excelsior`;
        break;
      case 'memphis-b42':
        fontnick = 'b42';
        text = `of Memphis, Thebes, Karnak, and the Valley of the Kings`;
        break;
      case 'small-arya':
        fontnick = 'arya';
        fspath = 'indic/arya/AArya-Bold.otf';
        text = `mirror mirror देवनागरी A वकिव mirror mirror mirror mirror mirror 1कि2`;
        break;
      case 'apollo-b42':
        fontnick = 'b42';
        // text      = "far-out"
        text = `Apollo, (-inis, m, Graece Ἀπόλλων, Apóllōn) in mythologia Graeca est filius Iovis et
Latonae, Deli in insula natus. Qui est deus vaticinationis, musicae, iuventutis, scientiae,
medicinae, et solis (igitur, varia habet cognomina, primo scilicet Phoebus (Graece φοῖβος
'resplendens, luminosus') etiam Paean, 'deus salutaris').`;
        break;
      case 'gaga-b42':
        fontnick = 'b42';
        text = "talibus appellata) pro ostentu ad visum pertinente os‌tentu brot‌zeit brotzeit";
        break;
      case 'typo-b42':
        fontnick = 'b42';
        text = "Typothetica, vel fortasse compositio typographica, est compositio linguae scriptae per typos effecta. Litterae et alia signa reposita (sortes in rationibus mechanicis et glypha in rationibus digitalibus appellata) pro ostentu ad visum pertinente recuperantur et secundum orthographiam linguae ordinantur. Typothetica prioris rationis eget, fontis designati. Impressio stipibus ligni est modus textús, imaginum, vel exemplaria impressa, qui late per Asia Orientali adhibitus est. Antiquitus in Sina ortus est ut modus imprimendi in textilibus, et tunc in chartis. Modi imprimendi in textilibus, prima exempla exstantia ex Sina facta sunt ante 220 a.C.n., et ex Aegypto Romana ad saeculum quartum.";
        break;
      case 'missing-t-b42':
        fontnick = 'b42';
        text = "talibus appellata) pro ostentu ad visum pertinente";
        break;
      case 'typo-b36':
        fontnick = 'b36';
        text = "Typothetica, vel fortasse compositio typographica, est compositio linguae scriptae per typos effecta. Litterae et alia signa reposita (sortes in rationibus mechanicis et glypha in rationibus digitalibus appellata) pro ostentu ad visum pertinente recuperantur et secundum orthographiam linguae ordinantur. Typothetica prioris rationis eget, fontis designati. Impressio stipibus ligni est modus textús, imaginum, vel exemplaria impressa, qui late per Asia Orientali adhibitus est. Antiquitus in Sina ortus est ut modus imprimendi in textilibus, et tunc in chartis. Modi imprimendi in textilibus, prima exempla exstantia ex Sina facta sunt ante 220 a.C.n., et ex Aegypto Romana ad saeculum quartum.";
        break;
      case 'medium-b42':
        fontnick = 'b42';
        text = `Dansk er et nordisk sprog, også præciseret som østnordisk, i den germanske
sprogfamilie. Det danske sprog tales af ca. seks millioner mennesker, hovedsageligt i Danmark, men
også i Sydslesvig (i Flensborg ca. 20 %), på Færøerne og Grønland. Dansk er tæt forbundet med
norsk og svensk, og sproghistorisk har dansk været stærkt påvirket af plattysk.`;
        break;
      case 'medium-eg8i-da':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        text = `Dansk er et nordisk sprog, også præciseret som østnordisk, i den germanske
sprogfamilie. Det danske sprog tales af ca. seks millioner mennesker, hovedsageligt i Danmark, men
også i Sydslesvig (i Flensborg ca. 20 %), på Færøerne og Grønland. Dansk er tæt forbundet med
norsk og svensk, og sproghistorisk har dansk været stærkt påvirket af plattysk.`;
        break;
      case 'medium-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language spoken by about six million people, principally in
Denmark, Greenland, the Fa&shy;roe Islands and in the region of Southern Schles&shy;wig in northern Germany,
where it has minority language status. This-and-that this-and-that this-and-that this-and-that.`;
        break;
      case 'medium-n1518':
        fontnick = 'n1518';
        fspath = 'kps-fonts.ch/1518_neudoerffer_fraktur.otf';
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language spoken by about six million people, principally in
Denmark, Greenland, the Fa&shy;roe Islands and in the region of Southern Schles&shy;wig in northern Germany,
where it has minority language status. This-and-that this-and-that this-and-that this-and-that.`;
        break;
      case 'medium-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language spoken by about six million people, principally in
Denmark, Greenland, the Fa&shy;roe Islands and in the region of Southern Schles&shy;wig in northern Germany,
where it has minority language status.`;
        break;
      case 'egypt-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
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
      case 'egypt-b42':
        fontnick = 'b42';
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
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language.`;
        break;
      case 'uppercasehyphen-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        text = `Hyphenated uppercase that should cause reformatting b/o kerning STORMY&shy;YEAR`;
        break;
      case 'longwords-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        text = `xxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxx.`;
        break;
      case 'small-aleo':
        fontnick = 'aleo';
        fspath = 'Aleo_font_v1.2.2/Desktop OTF/Aleo-Italic.otf';
        text = "Affirmation字缺TitianիϪSylt.";
        break;
      case 'small-djvsi':
        fontnick = 'djvsi';
        fspath = 'DejaVuSerif-Italic.ttf';
        text = "Af&shy;&shy;&wbr;firmation字缺TitianիϪSylt.";
        break;
      case 'widechrs':
        fontnick = 'sfb';
        fspath = 'sunflower-u-cjk-xb.ttf';
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
        break;
      case 'tibetan':
        fontnick = 'tbm';
        fspath = 'TibetanMachineUni.ttf';
        text = "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ";
        break;
      case 'arabic':
        fontnick = 'amiri';
        fspath = 'arabic/Amiri-0.113/Amiri-Bold.ttf';
        text = ([..."نستعلیق‎ 字缺 الخط الأمیری"].reverse()).join('');
        break;
      case 'urdu':
        fontnick = 'nur';
        fspath = 'noto-arabic/NotoNastaliqUrdu-unhinted/NotoNastaliqUrdu-Regular.ttf';
        // text      = ( [ "اُردُو‌ حُرُوفِ ‌تَہَجِّی"... ].reverse() ).join ''
        // text      = "نستعلیق‎"
        text = ([..."نستعلیق‎"].reverse()).join('');
        break;
      default:
        throw new Error(`^345^ unknown set_id ${rpr(set_id)}`);
    }
    if (fspath != null) {
      //.........................................................................................................
      fspath = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts/', fspath));
    }
    return {chrs, cids, cgid_map, text, fontnick, fspath};
  };

  //-----------------------------------------------------------------------------------------------------------
  this.reveal = function(text) {
    return text.replace(/[^\x20-\x7f]/ug, function($0) {
      return `&#x${($0.codePointAt(0)).toString(16)};`;
    });
  };

}).call(this);

//# sourceMappingURL=helpers.js.map
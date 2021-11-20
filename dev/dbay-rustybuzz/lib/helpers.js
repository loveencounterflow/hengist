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
        chrs = "abcdefghijklm";
        text = "affirmation.";
        break;
      case 'smalli':
        fontnick = 'djvsi';
        fspath = 'DejaVuSerif-Italic.ttf';
        chrs = "abcdefghijklm";
        text = "affirmation.";
        break;
      case 'small-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = "affirm affluent";
        break;
      case 'small-b42':
        fontnick = 'b42';
        fspath = null;
        chrs = "abcdefghijklm";
        text = "af&shy;f&shy;irm affluent deus in excelsior. ** major/minor designati.";
        break;
      case 'gaga-b42':
        fontnick = 'b42';
        fspath = null;
        chrs = "abcdefghijklm";
        text = "*************lalblc—ldlelf";
        break;
      case 'typo-b42':
        fontnick = 'b42';
        fspath = null;
        chrs = "abcdefghijklm";
        text = "Typothetica, vel fortasse compositio typographica, est compositio linguae scriptae per typos effecta. Litterae et alia signa reposita (sortes in rationibus mechanicis et glypha in rationibus digitalibus appellata) pro ostentu ad visum pertinente recuperantur et secundum orthographiam linguae ordinantur. Typothetica prioris rationis eget, fontis designati. Impressio stipibus ligni est modus textús, imaginum, vel exemplaria impressa, qui late per Asia Orientali adhibitus est. Antiquitus in Sina ortus est ut modus imprimendi in textilibus, et tunc in chartis. Modi imprimendi in textilibus, prima exempla exstantia ex Sina facta sunt ante 220 a.C.n., et ex Aegypto Romana ad saeculum quartum.";
        break;
      case 'typo-b36':
        fontnick = 'b36';
        fspath = null;
        chrs = "abcdefghijklm";
        text = "Typothetica, vel fortasse compositio typographica, est compositio linguae scriptae per typos effecta. Litterae et alia signa reposita (sortes in rationibus mechanicis et glypha in rationibus digitalibus appellata) pro ostentu ad visum pertinente recuperantur et secundum orthographiam linguae ordinantur. Typothetica prioris rationis eget, fontis designati. Impressio stipibus ligni est modus textús, imaginum, vel exemplaria impressa, qui late per Asia Orientali adhibitus est. Antiquitus in Sina ortus est ut modus imprimendi in textilibus, et tunc in chartis. Modi imprimendi in textilibus, prima exempla exstantia ex Sina facta sunt ante 220 a.C.n., et ex Aegypto Romana ad saeculum quartum.";
        break;
      case 'medium-b42':
        fontnick = 'b42';
        fspath = null;
        chrs = "abcdefghijklm";
        text = `Dansk er et nordisk sprog, også præciseret som østnordisk, i den germanske
sprogfamilie. Det danske sprog tales af ca. seks millioner mennesker, hovedsageligt i Danmark, men
også i Sydslesvig (i Flensborg ca. 20 %), på Færøerne og Grønland. Dansk er tæt forbundet med
norsk og svensk, og sproghistorisk har dansk været stærkt påvirket af plattysk.`;
        break;
      case 'medium-eg8i-da':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = `Dansk er et nordisk sprog, også præciseret som østnordisk, i den germanske
sprogfamilie. Det danske sprog tales af ca. seks millioner mennesker, hovedsageligt i Danmark, men
også i Sydslesvig (i Flensborg ca. 20 %), på Færøerne og Grønland. Dansk er tæt forbundet med
norsk og svensk, og sproghistorisk har dansk været stærkt påvirket af plattysk.`;
        break;
      case 'medium-eg8i':
        fontnick = 'eg8i';
        fspath = 'EBGaramond08-Italic.otf';
        chrs = "abcdefghijklm";
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language spoken by about six million people, principally in
Denmark, Greenland, the Fa&shy;roe Islands and in the region of Southern Schles&shy;wig in northern Germany,
where it has minority language status. This-and-that this-and-that this-and-that this-and-that.`;
        break;
      case 'medium-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language spoken by about six million people, principally in
Denmark, Greenland, the Fa&shy;roe Islands and in the region of Southern Schles&shy;wig in northern Germany,
where it has minority language status.`;
        break;
      case 'egypt-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
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
        chrs = "abcdefghijklm";
        text = `f&shy;f&shy;i f&wbr;f&wbr;i affirmation丹麥Danish is a North Germanic language.`;
        break;
      case 'uppercasehyphen-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `Hyphenated uppercase that should cause reformatting b/o kerning STORMY&shy;YEAR`;
        break;
      case 'longwords-eg12i':
        fontnick = 'eg12i';
        fspath = 'EBGaramond12-Italic.otf';
        chrs = "abcdefghijklm";
        text = `xxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxx.`;
        break;
      case 'small-aleo':
        fontnick = 'aleo';
        fspath = 'Aleo_font_v1.2.2/Desktop OTF/Aleo-Italic.otf';
        chrs = "abcdefghijklm";
        text = "Affirmation字缺TitianիϪSylt.";
        break;
      case 'small-djvsi':
        fontnick = 'djvsi';
        fspath = 'DejaVuSerif-Italic.ttf';
        chrs = "abcdefghijklm";
        text = "Af&shy;&shy;&wbr;firmation字缺TitianիϪSylt.";
        break;
      case 'widechrs':
        fontnick = 'sfb';
        fspath = 'sunflower-u-cjk-xb.ttf';
        chrs = "𠀀𠀁𠀂𠀃𠀄𠀅𠀆";
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
        chrs = drb.get_assigned_unicode_chrs();
        break;
      case 'tibetan':
        fontnick = 'tbm';
        fspath = 'TibetanMachineUni.ttf';
        text = "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ";
        chrs = 'abc';
        break;
      case 'arabic':
        fontnick = 'amiri';
        fspath = 'arabic/Amiri-0.113/Amiri-Bold.ttf';
        text = ([..."نستعلیق‎ 字缺 الخط الأمیری"].reverse()).join('');
        chrs = ([..."الخط الأمیری"].reverse()).join('');
        break;
      case 'urdu':
        fontnick = 'nur';
        fspath = 'noto-arabic/NotoNastaliqUrdu-unhinted/NotoNastaliqUrdu-Regular.ttf';
        // text      = ( [ "اُردُو‌ حُرُوفِ ‌تَہَجِّی"... ].reverse() ).join ''
        // text      = "نستعلیق‎"
        text = ([..."نستعلیق‎"].reverse()).join('');
        chrs = ([..."الخط الأمیری"].reverse()).join('');
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

const log = console.log;
import slugify from '@sindresorhus/slugify';

log( slugify('I ♥ Dogs') );
import rr from '/Users/benutzer/3rdparty/railroad-diagrams/railroad.mjs'
const d = rr.Diagram("foo", rr.Choice(0, "bar", "baz"), rr.MultipleChoice(1, 'any', "woo", "gnu" ), rr.MultipleChoice(1, 'all', "woo", "gnu" ) );
log( d.toString() );

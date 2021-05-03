PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE sources (
  id              integer not null unique primary key, /* alias for system rowid */
  path            text );
-- a comment
INSERT INTO sources VALUES(1,'/home/flow/jzr/datamill/src/tests/demo-medium.md');
CREATE TABLE realms (
  realm           text    not null unique primary key );
INSERT INTO realms VALUES('input');
INSERT INTO realms VALUES('html');--comment
CREATE TABLE keys (
  key             text    not null unique primary key,
  is_block        boolean not null default false,
  has_paragraphs  boolean not null default false
  check ( not ( ( not is_block ) and has_paragraphs ) ) );
COMMIT;

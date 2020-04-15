<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [𐌷𐌴𐌽𐌲𐌹𐍃𐍄 Apps Folder](#%F0%90%8C%B7%F0%90%8C%B4%F0%90%8C%BD%F0%90%8C%B2%F0%90%8C%B9%F0%90%8D%83%F0%90%8D%84-apps-folder)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# 𐌷𐌴𐌽𐌲𐌹𐍃𐍄 Apps Folder

This folder, `hengist/apps/`, may contain symlinks to the 'parent' projects that you're developing in the
`hengist/` directory.

The idea is to replace calls like `require 'myapp'` that would have to have an installed dependency in
`hengist/node_modules/` with calls like `require '../../apps/myapp'` and thereby be able to use the current
version of that codebase, be it committed or published or not, as the case may be. That, of course, could be
done without going through another folder with symlinks, but doing it this way makes such special paths
searchable (they all contain the `/apps/` part); it also serves as a reminder and documentation which
projects are treated special by dev code.




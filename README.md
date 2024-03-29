## Pathfinder plugin for the Quilvyn RPG character sheet generator

The quilvyn-pathfinder package bundles modules that extend Quilvyn to work with
the 1st Edition Pathfinder RPG, applying the rules of the
<a href="http://legacy.aonprd.com/">Pathfinder Roleplaying Game Reference 
Document</a>.

### Requirements

quilvyn-pathfinder relies on the core and srd35 modules installed by the
quilvyn-core package.

### Installation

To use quilvyn-pathfinder, unbundle the release package, making sure that the
contents of the plugins/ and Images/ subdirectories are placed into the
corresponding Quilvyn installation subdirectories, then append the following
lines to the file plugins/plugins.js:

    RULESETS['Pathfinder 1E'] = {
      url:'plugins/Pathfinder.js',
      group:'Pathfinder',
      require:'SRD35.js'
    };
    RULESETS["Pathfinder 1E Advanced Player's Guide"] = {
      url:'plugins/PFAPG.js',
      group:'Pathfinder',
      supplement:'Pathfinder 1E'
    };

### Usage

Once the quilvyn-pathfinder package is installed as described above, start
Quilvyn and check the boxes next to "Pathfinder 1E" and/or "Pathfinder 1E
Advanced Player's Guide" from the rule sets menu in the initial window.

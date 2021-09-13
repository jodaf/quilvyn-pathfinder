## Pathfinder plugin for the Quilvyn RPG character sheet generator

The quilvyn-pathfinder package bundles modules that extend Quilvyn to work with
the 1st Edition Pathfinder RPG, applying the rules of the
<a href="http://legacy.aonprd.com/">Pathfinder Roleplaying Game Reference 
Document</a>.

### Requirements

quilvyn-pathfinder relies on the core and srd35 modules installed by the
quilvyn-core package.

### Installation

To use quilvyn-pathfinder, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['Pathfinder 1E'] = {
      url:'plugins/Pathfinder.js',
      group:'Pathfinder 1E',
      require:'v3.5 (SRD only)'
    };

### Usage

Once the quilvyn-pathfinder package is installed as described above, start
Quilvyn and check the box next to "Pathfinder 1E" from the rule sets menu in
the initial window.

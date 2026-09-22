/*
Copyright 2026, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/*jshint esversion: 6 */
/* jshint forin: false */
/* globals ObjectViewer, PFAPG, Quilvyn, QuilvynRules, QuilvynUtils, SRD35 */
"use strict";

/*
 * This module loads the rules from the Pathfinder Reference Document. The
 * Pathfinder function contains methods that load rules for particular parts of
 * the PRD; raceRules for character races, shieldRules for shields, etc. These
 * member methods can be called independently in order to use a subset of the
 * PRD rules. Similarly, the constant fields of Pathfinder (ALIGNMENTS, FEATS,
 * etc.) can be manipulated to modify the choices. If the SRD35NPC plugin is
 * available, Pathfinder includes the NPC classes in the Pathfinder rules.
 */
function Pathfinder() {

  if(window.SRD35 == null) {
    alert('The Pathfinder module requires use of the SRD35 module');
    return;
  }

  let rules = new QuilvynRules('Pathfinder 1E', Pathfinder.VERSION);
  rules.plugin = Pathfinder;
  Pathfinder.rules = rules;

  rules.defineChoice('choices', Pathfinder.CHOICES);
  rules.choiceEditorElements = Pathfinder.choiceEditorElements;
  rules.choiceRules = Pathfinder.choiceRules;
  rules.removeChoice = SRD35.removeChoice;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getChoices = SRD35.getChoices;
  rules.getFormats = Pathfinder.getFormats;
  rules.getPlugins = Pathfinder.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Pathfinder.randomizeOneAttribute;
  rules.defineChoice('random', Pathfinder.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Pathfinder.ruleNotes;

  SRD35.ABBREVIATIONS.CMB = 'Combat Maneuver Bonus';
  SRD35.ABBREVIATIONS.CMD = 'Combat Maneuver Defense';

  Pathfinder.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'experienceTrack:Track,select-one,tracks',
    'levels:Class Levels,bag,levels', 'prestige:Prestige Levels,bag,prestiges',
    'npc:NPC Levels,bag,nPCs');

  Pathfinder.abilityRules(rules);
  Pathfinder.aideRules
    (rules, Pathfinder.ANIMAL_COMPANIONS, Pathfinder.FAMILIARS);
  Pathfinder.combatRules
    (rules, Pathfinder.ARMORS, Pathfinder.SHIELDS, Pathfinder.WEAPONS);
  Pathfinder.magicRules(rules, Pathfinder.SCHOOLS, Pathfinder.SPELLS);
  // Feats must be defined before paths
  Pathfinder.talentRules
    (rules, Pathfinder.FEATS, Pathfinder.FEATURES, Pathfinder.GOODIES,
     Pathfinder.LANGUAGES, Pathfinder.SKILLS);
  Pathfinder.identityRules(
    rules, Pathfinder.ALIGNMENTS, Pathfinder.CLASSES, Pathfinder.DEITIES,
    Pathfinder.FACTIONS, Pathfinder.PATHS, Pathfinder.RACES, Pathfinder.TRACKS,
    Pathfinder.TRAITS, Pathfinder.PRESTIGE_CLASSES, Pathfinder.NPC_CLASSES
  );

  Quilvyn.addRuleSet(rules);

}

Pathfinder.VERSION = '2.4.1.6';

/* List of choices that can be expanded by house rules. */
Pathfinder.CHOICES = SRD35.CHOICES.concat('Faction', 'Trait');
/*List of items handled by randomizeOneAttribute method. */
Pathfinder.RANDOMIZABLE_ATTRIBUTES =
  SRD35.RANDOMIZABLE_ATTRIBUTES.concat('faction', 'traits');
Pathfinder.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
Pathfinder.ANIMAL_COMPANIONS = {
  // Attack, Dam, AC include all modifiers
  'Ape':
    'Str=13 Dex=17 Con=10 Int=2 Wis=12 Cha=7 AC=14 Attack=1 ' +
    'Dam=2@1d4+1,1d4+1 Size=M Speed=30',
  'Badger':
    'Str=10 Dex=17 Con=15 Int=2 Wis=12 Cha=10 AC=16 Attack=1 Dam=1d4 ' +
    'Size=S Speed=30',
  'Bear':
    'Str=15 Dex=15 Con=13 Int=2 Wis=12 Cha=6 AC=15 Attack=3 ' +
    'Dam=2@1d3+2,1d4+2 Size=S Speed=40',
  'Boar':
    'Str=13 Dex=12 Con=15 Int=2 Wis=13 Cha=4 AC=18 Attack=2 Dam=1d6+1 ' +
    'Size=S Speed=40',
  'Camel':
    'Str=18 Dex=16 Con=14 Int=2 Wis=11 Cha=4 AC=13 Attack=3 Dam=1d4+4 ' +
    'Size=L Speed=50',
  'Cheetah':
    'Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6 AC=17 Attack=2 ' +
    'Dam=2@1d2+1,1d4+1 Size=S Speed=50',
  'Constrictor':
    'Str=15 Dex=17 Con=13 Int=1 Wis=12 Cha=2 AC=15 Attack=2 Dam=1d3+2 ' +
    'Size=M Speed=20',
  'Crocodile':
    'Str=15 Dex=14 Con=15 Int=1 Wis=12 Cha=2 AC=17 Attack=3 Dam=1d6+2 ' +
    'Size=S Speed=30',
  'Deinonychus':
    'Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14 AC=15 Attack=1 Dam=2@1d6,1d4 ' +
    'Size=S Speed=60',
  'Dog':
    'Str=13 Dex=17 Con=15 Int=2 Wis=12 Cha=6 AC=16 Attack=2 Dam=1d4+1 ' +
    'Size=S Speed=40',
  'Eagle':
    'Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 AC=14 Attack=1 Dam=2@1d4,1d4 ' +
    'Size=S Speed=80',
  'Hawk':
    'Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 AC=14 Attack=1 Dam=2@1d4,1d4 ' +
    'Size=S Speed=80',
  'Horse':
    'Str=16 Dex=13 Con=15 Int=2 Wis=12 Cha=6 AC=14 Attack=2 ' +
    'Dam=2@1d6+3,1d4+3 Size=L Speed=50',
  'Leopard':
    'Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6 AC=17 Attack=2 ' +
    'Dam=2@1d2+1,1d4+1 Size=S Speed=50',
  'Lion':
    'Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10 AC=14 Attack=1 ' +
    'Dam=2@1d4+1,1d6+1 Size=M Speed=40',
  'Owl':
    'Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 AC=14 Attack=1 Dam=2@1d4,1d4 ' +
    'Size=S Speed=80',
  'Pony':
    'Str=13 Dex=13 Con=12 Int=2 Wis=11 Cha=4 AC=13 Attack=1 Dam=2@1d3+1 ' +
    'Size=M Speed=50',
  'Shark':
    'Str=13 Dex=15 Con=15 Int=1 Wis=12 Cha=2 AC=17 Attack=2 Dam=1d4+1 ' +
    'Size=S Speed=60',
  'Tiger':
    'Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10 AC=14 Attack=1 ' +
    'Dam=2@1d4+1,1d6+1 Size=M Speed=40',
  'Velociraptor':
    'Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14 AC=15 Attack=1 Dam=2@1d6,1d4 ' +
    'Size=S Speed=60',
  'Viper':
    'Str=8 Dex=17 Con=11 Int=1 Wis=12 Cha=2 AC=16 Attack=0 Dam=1d3-1 ' +
    'Size=S Speed=20',
  'Wolf':
    'Str=13 Dex=15 Con=15 Int=2 Wis=12 Cha=6 AC=14 Attack=1 Dam=1d6+1 ' +
    'Size=M Speed=50'
};
Object.assign(Pathfinder.ANIMAL_COMPANIONS, {
  'Advanced Ape': Pathfinder.ANIMAL_COMPANIONS.Ape +
    ' Level=4 Size=L Attack=4 AC=13 Dam=2@1d6+5,1d6+5 Str=21 Dex=15 Con=14',
  'Advanced Badger': Pathfinder.ANIMAL_COMPANIONS.Badger +
    ' Level=4 Size=M Attack=2 AC=14 Dam=2@1d4+2,1d6+2 Str=14 Dex=15 Con=17',
  'Advanced Bear': Pathfinder.ANIMAL_COMPANIONS.Bear +
    ' Level=4 Size=M Attack=4 AC=13 Dam=2@1d4+4,1d6+4 Str=19 Dex=13 Con=15',
  'Advanced Boar': Pathfinder.ANIMAL_COMPANIONS.Boar +
    ' Level=4 Size=M Attack=3 AC=16 Dam=1d8+3 Str=17 Dex=10 Con=17',
  'Advanced Camel': Pathfinder.ANIMAL_COMPANIONS.Camel +
    ' Level=4 Attack=4 AC=13 Dam=1d4+5 Str=20 Con=19',
  'Advanced Cheetah': Pathfinder.ANIMAL_COMPANIONS.Cheetah +
    ' Level=4 Size=M Attack=3 AC=15 Dam=2@1d3+3,1d6+3 Str=16 Dex=19 Con=15',
  'Advanced Constrictor': Pathfinder.ANIMAL_COMPANIONS.Constrictor +
    ' Level=4 Size=L Attack=5 AC=12 Dam=1d4+6 Str=23 Dex=15 Con=17',
  'Advanced Crocodile': Pathfinder.ANIMAL_COMPANIONS.Crocodile +
    ' Level=4 Size=M Attack=4 AC=15 Dam=1d8+4 Str=19 Dex=12 Con=17',
  'Advanced Deinonychus': Pathfinder.ANIMAL_COMPANIONS.Deinonychus +
    ' Level=7 Size=M Attack=2 AC=14 Dam=2@1d8+2,1d6+2,2@1d4+2 Str=15 Dex=15 Con=15',
  'Advanced Dog': Pathfinder.ANIMAL_COMPANIONS.Dog +
    ' Level=4 Size=L Attack=3 AC=14 Dam=1d6+3 Str=17 Dex=15 Con=17',
  'Advanced Eagle': Pathfinder.ANIMAL_COMPANIONS.Eagle +
    ' Level=4 Attack=2 AC=14 Dam=2@1d4+1,1d4+1 Str=12 Con=14',
  'Advanced Hawk': Pathfinder.ANIMAL_COMPANIONS.Hawk +
    ' Level=4 Attack=2 AC=14 Dam=2@1d4+1,1d4+1 Str=12 Con=14',
  'Advanced Horse': Pathfinder.ANIMAL_COMPANIONS.Horse +
    ' Level=4 Attack=3 AC=14 Dam=2@1d6+4,1d4+4 Str=18 Con=17',
  'Advanced Leopard': Pathfinder.ANIMAL_COMPANIONS.Leopard +
    ' Level=4 Size=M Attack=3 AC=15 Dam=2@1d3+3,1d6+3 Str=16 Dex=19 Con=15',
  'Advanced Lion': Pathfinder.ANIMAL_COMPANIONS.Lion +
    ' Level=7 Size=L Attack=4 AC=13 Dam=2@1d6+5,1d6+5 Str=21 Dex=15 Con=17',
  'Advanced Owl': Pathfinder.ANIMAL_COMPANIONS.Owl +
    ' Level=4 Attack=2 AC=14 Dam=2@1d4+1,1d4+1 Str=12 Con=14',
  'Advanced Pony': Pathfinder.ANIMAL_COMPANIONS.Pony +
    ' Level=4 Attack=2 AC=13 Dam=2@1d3+2 Str=15 Con=14',
  'Advanced Shark': Pathfinder.ANIMAL_COMPANIONS.Shark +
    ' Level=4 Size=M Attack=3 AC=11 Dam=1d6+3 Str=17 Dex=13 Con=17',
  'Advanced Tiger': Pathfinder.ANIMAL_COMPANIONS.Tiger +
    ' Level=7 Size=L Attack=4 AC=13 Dam=2@1d6+5,1d6+5 Str=21 Dex=15 Con=17',
  'Advanced Velociraptor': Pathfinder.ANIMAL_COMPANIONS.Velociraptor +
    ' Level=7 Size=M Attack=2 AC=14 Dam=2@1d8+2,1d6+2,2@1d4+2 Str=15 Dex=15 Con=15',
  'Advanced Viper': Pathfinder.ANIMAL_COMPANIONS.Viper +
    ' Level=4 Size=M Attack=1 AC=15 Dam=1d4+1 Str=12 Dex=15 Con=13',
  'Advanced Wolf': Pathfinder.ANIMAL_COMPANIONS.Wolf +
    ' Level=7 Size=L Attack=4 AC=13 Dam=1d8+5 Str=21 Dex=13 Con=19'
});
Pathfinder.ARMORS = {
  'None':SRD35.ARMORS.None,
  'Padded':SRD35.ARMORS.Padded,
  'Leather':SRD35.ARMORS.Leather,
  'Studded Leather':SRD35.ARMORS['Studded Leather'],
  'Chain Shirt':SRD35.ARMORS['Chain Shirt'],
  'Hide':SRD35.ARMORS.Hide + ' AC=4',
  'Scale Mail':SRD35.ARMORS['Scale Mail'] + ' AC=5',
  'Chainmail':SRD35.ARMORS.Chainmail + ' AC=6',
  'Breastplate':SRD35.ARMORS.Breastplate + ' AC=6',
  'Splint Mail':SRD35.ARMORS['Splint Mail'] + ' AC=7',
  'Banded Mail':SRD35.ARMORS['Banded Mail'] + ' AC=7',
  'Half Plate':SRD35.ARMORS['Half Plate'] + ' AC=8',
  'Full Plate':SRD35.ARMORS['Full Plate'] + ' AC=9'
};
Pathfinder.FACTIONS = {
  'Andoran':'Season=1,2,3,4,5 Successor="Liberty\'s Edge"',
  'Cheliax':'Season=1,2,3,4,5 Successor="Dark Archive"',
  'The Concordance':'Season=9,10',
  'Dark Archive':'Season=6,7,8,9,10',
  'The Exchange':'Season=6,7,8,9,10',
  'Grand Lodge':'Season=4,5,6,7,8,9,10',
  'Lantern Lodge':'Season=4',
  "Liberty's Edge":'Season=6,7,8,9,10',
  'None':'',
  'Osirion':'Season=1,2,3,4,5 Successor="Scarab Sages"',
  'Qadira':'Season=1,2,3,4,5 Successor="The Exchange"',
  'Scarab Sages':'Season=6,7,8,9',
  'Sczarni':'Season=4,5',
  'Shadow Lodge':'Season=4',
  'Silver Crusade':'Season=4,5,6,7,8,9,10',
  'Sovereign Court':'Season=6,7,8,9,10',
  'Taldor':'Season=1,2,3,4,5 Successor="Sovereign Court"'
};
Pathfinder.FAMILIARS = {
  // Attack, Dam, AC include all modifiers
  'Bat':
    'Str=1 Dex=15 Con=6 Int=2 Wis=14 Cha=5 HD=1 AC=16 Attack=6 Dam=1d3-5 ' +
    'Size=D Speed=40',
  'Cat':
    'Str=3 Dex=15 Con=8 Int=2 Wis=12 Cha=7 HD=1 AC=14 Attack=4 ' +
    'Dam=2@1d2-4,1d3-4 Size=T Speed=30',
  'Hawk':
    'Str=6 Dex=17 Con=11 Int=2 Wis=14 Cha=7 HD=1 AC=15 Attack=5 Dam=2@1d4-2 ' +
    'Size=T Speed=60',
  'Lizard':
    'Str=3 Dex=15 Con=8 Int=1 Wis=12 Cha=2 HD=1 AC=14 Attack=4 Dam=1d4-4 ' +
    'Size=T Speed=20',
  'Monkey':
    'Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5 HD=1 AC=14 Attack=4 Dam=1d3-4 ' +
    'Size=T Speed=30',
  'Owl':
    'Str=6 Dex=17 Con=11 Int=2 Wis=15 Cha=6 HD=1 AC=15 Attack=5 Dam=2@1d4-2 ' +
    'Size=T Speed=60',
  'Rat':
    'Str=2 Dex=15 Con=11 Int=2 Wis=13 Cha=2 HD=1 AC=14 Attack=4 Dam=1d3-4 ' +
    'Size=T Speed=15',
  'Raven':
    'Str=2 Dex=15 Con=8 Int=2 Wis=15 Cha=7 HD=1 AC=14 Attack=4 Dam=1d3-4 ' +
    'Size=T Speed=40',
  'Toad':
    'Str=1 Dex=12 Con=6 Int=1 Wis=15 Cha=4 HD=1 AC=15 Attack=0 Dam=0 ' +
    'Size=D Speed=5',
  'Viper':
    'Str=4 Dex=17 Con=8 Int=1 Wis=13 Cha=2 HD=1 AC=16 Attack=5 Dam=1d2-2 ' +
    'Size=T Speed=20',
  'Weasel':
    'Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5 HD=1 AC=15 Attack=4 Dam=1d3-4 ' +
    'Size=T Speed=20',
  'Air Elemental':
    'Str=12 Dex=17 Con=12 Int=4 Wis=11 Cha=11 HD=2 AC=17 Attack=6 Dam=1d4+1 ' +
    'Size=S Speed=100 Level=5',
  'Dire Rat':
    'Str=10 Dex=17 Con=13 Int=2 Wis=13 Cha=4 HD=1 AC=14 Attack=1 Dam=1d4 ' +
    'Size=S Speed=40 Level=3',
  'Earth Elemental':
    'Str=16 Dex=8 Con=13 Int=4 Wis=11 Cha=11 HD=2 AC=17 Attack=6 Dam=1d6+4 ' +
    'Size=S Speed=20 Level=5',
  'Fire Elemental':
    'Str=10 Dex=13 Con=10 Int=4 Wis=11 Cha=11 HD=2 AC=16 Attack=4 Dam=1d4 ' +
    'Size=S Speed=50 Level=5',
  'Homunculus':
    'Str=8 Dex=15 Con=0 Int=10 Wis=12 Cha=7 HD=2 AC=14 Attack=3 Dam=1d4-1 ' +
    'Size=T Speed=50 Level=7',
  'Imp':
    'Str=10 Dex=17 Con=10 Int=13 Wis=12 Cha=14 HD=3 AC=17 Attack=8 Dam=1d4 ' +
    'Size=T Speed=50 Level=7',
  'Mephit':
    'Str=13 Dex=15 Con=12 Int=6 Wis=11 Cha=14 HD=3 AC=17 Attack=5 Dam=1d3+1 ' +
    'Size=S Speed=40 Level=7',
  'Pseudodragon':
    'Str=7 Dex=15 Con=13 Int=10 Wis=12 Cha=10 HD=2 AC=16 Attack=6 ' +
    'Dam=1d3-2,1d2-2 Size=T Speed=60 Level=7',
  'Quasit':
    'Str=8 Dex=14 Con=11 Int=11 Wis=12 Cha=11 HD=3 AC=16 Attack=7 ' +
    'Dam=1d3-1,1d4-1 Size=T Speed=50 Level=7',
  'Stirge':
    'Str=3 Dex=19 Con=10 Int=1 Wis=12 Cha=6 HD=1 AC=16 Attack=7 Dam=0 Size=M ' +
    'Level=5 Speed=40',
  'Water Elemental':
    'Str=14 Dex=10 Con=13 Int=4 Wis=11 Cha=11 HD=2 AC=17 Attack=5 Dam=1d6+3 ' +
    'Size=T Speed=90 Level=5'
};
Pathfinder.FEATS = {
  'Acrobatic':'Type=General',
  'Acrobatic Steps':'Type=General',
  'Agile Maneuvers':'Type=Fighter Imply="dexterityModifier > strengthModifier"',
  'Alertness':'Type=General',
  'Alignment Channel (Chaos)':'Type=General Require="features.Channel Energy"',
  'Alignment Channel (Evil)':'Type=General Require="features.Channel Energy"',
  'Alignment Channel (Good)':'Type=General Require="features.Channel Energy"',
  'Alignment Channel (Law)':'Type=General Require="features.Channel Energy"',
  'Animal Affinity':'Type=General',
  'Arcane Armor Mastery':
    'Type=Fighter ' +
    'Require=' +
      '"casterLevel >= 7",' +
      '"features.Arcane Armor Training",' +
      '"armorProficiency.Medium"',
  'Arcane Armor Training':
    'Type=Fighter ' +
    'Require=' +
      '"casterLevel >= 3",' +
      '"armorProficiency.Light"',
  'Arcane Strike':'Type=Fighter Require="casterLevelArcane >= 1"',
  'Athletic':'Type=General',
  'Augment Summoning':
    'Type=General Require="features.Spell Focus (Conjuration)"',
  'Bleeding Critical':
    'Type=Fighter,Critical Require="baseAttack>=11","features.Critical Focus"',
  'Blind-Fight':'Type=Fighter',
  'Blinding Critical':
    'Type=Fighter,Critical ' +
    'Require="baseAttack >= 15","features.Critical Focus"',
  'Brew Potion':'Type="Item Creation",Wizard Require="casterLevel >= 3"',
  'Catch Off-Guard':'Type=Fighter',
  'Channel Smite':'Type=Fighter Require="features.Channel Energy"',
  'Cleave':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","features.Power Attack","strength >= 13"',
  'Combat Casting':'Type=General Imply="casterLevel >= 1"',
  'Combat Expertise':'Type=Fighter Require="intelligence >= 13"',
  'Combat Reflexes':'Type=Fighter',
  'Command Undead':'Type=General Require="features.Channel Energy"',
  'Craft Magic Arms And Armor':
    'Type="Item Creation",Wizard Require="casterLevel >= 5"',
  'Craft Rod':'Type="Item Creation",Wizard Require="casterLevel >= 9"',
  'Craft Staff':'Type="Item Creation",Wizard Require="casterLevel >= 11"',
  'Craft Wand':'Type="Item Creation",Wizard Require="casterLevel >= 5"',
  'Craft Wondrous Item':
    'Type="Item Creation",Wizard Require="casterLevel >= 3"',
  'Critical Focus':'Type=Fighter Require="baseAttack >= 9"',
  'Critical Mastery':
    'Type=Fighter ' +
    'Require=' +
      '"fighterFeatLevel >= 14",' +
      '"features.Critical Focus",' +
      '"sumCriticalFeats >= 2"',
  'Dazzling Display':
    'Type=Fighter Require="Sum \'^features\\.Weapon Focus\' >= 1"',
  'Deadly Aim':'Type=Fighter Require="dexterity >= 13","baseAttack >= 1"',
  'Deadly Stroke':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"features.Dazzling Display",' +
      '"Sum \'^features\\.Greater Weapon Focus\' >= 1",' +
      '"features.Shatter Defenses",' +
      '"Sum \'^features\\.Weapon Focus\' >= 1"',
  'Deafening Critical':
    'Type=Fighter,Critical ' +
    'Require="baseAttack >= 13","features.Critical Focus"',
  'Deceitful':'Type=General',
  'Defensive Combat Training':'Type=Fighter',
  'Deflect Arrows':
    'Type=Fighter Require="dexterity >= 13","features.Improved Unarmed Strike"',
  'Deft Hands':'Type=General',
  'Diehard':'Type=General Require="features.Endurance"',
  'Disruptive':'Type=Fighter Require="fighterFeatLevel >= 6"',
  'Dodge':'Type=Fighter Require="dexterity >= 13"',
  'Double Slice':
    'Type=Fighter Require="dexterity >= 15","features.Two-Weapon Fighting"',
  'Elemental Channel (Air)':'Type=General Require="features.Channel Energy"',
  'Elemental Channel (Earth)':'Type=General Require="features.Channel Energy"',
  'Elemental Channel (Fire)':'Type=General Require="features.Channel Energy"',
  'Elemental Channel (Water)':'Type=General Require="features.Channel Energy"',
  'Empower Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Endurance':'Type=General',
  'Enlarge Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Eschew Materials':'Type=General Imply="casterLevel >= 1"',
  'Exhausting Critical':
    'Type=Fighter,Critical ' +
    'Require=' +
      '"baseAttack >= 15",' +
      '"features.Critical Focus",' +
      '"features.Tiring Critical"',
  'Exotic Weapon Proficiency (%exoticWeapon)':
    'Type=General Require="baseAttack >= 1" Imply="weapons.%exoticWeapon"',
  'Extend Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Extra Channel':'Type=General Require="features.Channel Energy"',
  'Extra Ki':'Type=General Require="features.Ki Pool"',
  'Extra Lay On Hands':'Type=General Require="features.Lay On Hands"',
  'Extra Mercy':'Type=General Require="features.Lay On Hands",features.Mercy',
  'Extra Performance':'Type=General Require="features.Bardic Performance"',
  'Extra Rage':'Type=General Require=features.Rage',
  'Far Shot':'Type=Fighter Require="features.Point-Blank Shot"',
  'Fleet':'Type=General Imply="armorWeight =~ \'None|Light\'"',
  'Forge Ring':'Type="Item Creation",Wizard Require="casterLevel >= 7"',
  "Gorgon's Fist":
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"features.Improved Unarmed Strike",' +
      '"features.Scorpion Style"',
  'Great Cleave':
    'Type=Fighter ' +
    'Require=' +
      '"strength >= 13",' +
      '"baseAttack >= 4",' +
      '"features.Cleave",' +
      '"features.Power Attack"',
  'Great Fortitude':'Type=General',
  'Greater Bull Rush':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"strength >= 13",' +
      '"features.Improved Bull Rush",' +
      '"features.Power Attack"',
  'Greater Disarm':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Disarm"',
  'Greater Feint':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Feint"',
  'Greater Grapple':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"dexterity >= 13",' +
      '"features.Improved Grapple",' +
      '"features.Improved Unarmed Strike"',
  'Greater Overrun':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"strength >= 13",' +
      '"features.Improved Overrun",' +
      '"features.Power Attack"',
  'Greater Penetrating Strike':
    'Type=Fighter ' +
    'Require=' +
      '"fighterFeatLevel >= 16",' +
      '"features.Penetrating Strike",' +
      '"Sum \'^features\\.Weapon Focus\' >= 1"',
  'Greater Shield Focus':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 1",' +
      '"fighterFeatLevel >= 8",' +
      '"features.Shield Focus",' +
      '"armorProficiency.Shield"',
  'Greater Spell Focus (%school)':
    'Type=General Require="features.Spell Focus (%school)"',
  'Greater Spell Penetration':
    'Type=General ' +
    'Imply="casterLevel >= 1" ' +
    'Require="features.Spell Penetration"',
  'Greater Sunder':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"strength >= 13",' +
      '"features.Improved Sunder",' +
      '"features.Power Attack"',
  'Greater Trip':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Trip"',
  'Greater Two-Weapon Fighting':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"dexterity >= 19",' +
      '"features.Improved Two-Weapon Fighting",' +
      '"features.Two-Weapon Fighting"',
  'Greater Vital Strike':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 16",' +
      '"features.Improved Vital Strike",' +
      '"features.Vital Strike"',
  'Greater Weapon Focus (%weapon)':
    'Type=Fighter ' +
    'Imply="ownedWeapons.%weapon" ' +
    'Require=' +
      '"features.Weapon Focus (%weapon)",' +
      '"fighterFeatLevel >= 8"',
  'Greater Weapon Specialization (%weapon)':
    'Type=Fighter ' +
    'Imply="ownedWeapons.%weapon" ' +
    'Require=' +
      '"features.Weapon Focus (%weapon)",' +
      '"features.Greater Weapon Focus (%weapon)",' +
      '"features.Weapon Specialization (%weapon)",' +
      '"fighterFeatLevel >= 12"',
  'Heavy Armor Proficiency':
    'Type=Fighter Require="armorProficiency.Medium"',
  'Heighten Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Improved Bull Rush':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Channel':'Type=General Require="features.Channel Energy"',
  'Improved Counterspell':'Type=General Imply="casterLevel >= 1"',
  'Improved Critical (%weapon)':
    'Type=Fighter Require="baseAttack >= 8" Imply="ownedWeapons.%weapon"',
  'Improved Disarm':
    'Type=Fighter Require="intelligence >= 13","features.Combat Expertise"',
  'Improved Familiar':'Type=General Require="features.Familiar"',
  'Improved Feint':
    'Type=Fighter Require="intelligence >= 13","features.Combat Expertise"',
  'Improved Grapple':
    'Type=Fighter Require="dexterity >= 13","features.Improved Unarmed Strike"',
  'Improved Great Fortitude':'Type=General Require="features.Great Fortitude"',
  'Improved Initiative':'Type=Fighter',
  'Improved Iron Will':'Type=General Require="features.Iron Will"',
  'Improved Lightning Reflexes':
    'Type=General Require="features.Lightning Reflexes"',
  'Improved Overrun':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Precise Shot':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"dexterity >= 19",' +
      '"features.Point-Blank Shot",' +
      '"features.Precise Shot"',
  'Improved Shield Bash':
    'Type=Fighter Require="armorProficiency.Shield"',
  'Improved Sunder':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Trip':
    'Type=Fighter Require="intelligence >= 13","features.Combat Expertise"',
  'Improved Two-Weapon Fighting':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"dexterity >= 17",' +
      '"features.Two-Weapon Fighting"',
  'Improved Unarmed Strike':'Type=Fighter',
  'Improved Vital Strike':
    'Type=Fighter Require="baseAttack >= 11","features.Vital Strike"',
  'Improvised Weapon Mastery':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 8",' +
      '"features.Catch Off-Guard || features.Throw Anything"',
  'Intimidating Prowess':'Type=Fighter',
  'Iron Will':'Type=General',
  'Leadership':'Type=General Require="level >= 7"',
  'Light Armor Proficiency':'Type=Fighter',
  'Lightning Reflexes':'Type=General',
  'Lightning Stance':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"dexterity >= 17",' +
      '"features.Dodge",' +
      '"features.Wind Stance"',
  'Lunge':'Type=Fighter Require="baseAttack >= 6"',
  'Magical Aptitude':'Type=General',
  'Manyshot':
    'Type=Fighter ' +
    'Require=' +
      '"dexterity >= 17",' +
      '"baseAttack >= 6",' +
      '"features.Point-Blank Shot",' +
      '"features.Rapid Shot"',
  'Martial Weapon Proficiency (%martialWeapon)':
    'Type=General Imply="weapons.%martialWeapon"',
  'Master Craftsman (%craftSkill)':
    'Type=General Require="skills.%craftSkill >= 5"',
  'Master Craftsman (%professionSkill)':
    'Type=General Require="skills.%professionSkill >= 5"',
  'Maximize Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Medium Armor Proficiency':
    'Type=Fighter Require="armorProficiency.Light"',
  "Medusa's Wrath":
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"features.Improved Unarmed Strike",' +
      '"features.Gorgon\'s Fist",' +
      '"features.Scorpion Style"',
  'Mobility':'Type=Fighter Require="dexterity >= 13",features.Dodge',
  'Mounted Archery':
    'Type=Fighter Require="features.Mounted Combat",skills.Ride',
  'Mounted Combat':'Type=Fighter Require=skills.Ride',
  'Natural Spell':'Type=General Require="wisdom >= 13","features.Wild Shape"',
  'Nimble Moves':'Type=General Require="dexterity >= 13"',
  'Penetrating Strike':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 1",' +
      '"fighterFeatLevel >= 12",' +
      '"Sum \'^features\\.Weapon Focus\' >= 1"',
  'Persuasive':'Type=General',
  'Pinpoint Targeting':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 16",' +
      '"dexterity >= 19",' +
      '"features.Improved Precise Shot",' +
      '"features.Point-Blank Shot"',
  'Point-Blank Shot':'Type=Fighter',
  'Power Attack':'Type=Fighter Require="baseAttack >= 1","strength >= 13"',
  'Precise Shot':'Type=Fighter Require="features.Point-Blank Shot"',
  'Quick Draw':'Type=Fighter Require="baseAttack >= 1"',
  'Quicken Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Rapid Reload (Hand)':'Type=Fighter Imply="weapons.Hand Crossbow"',
  'Rapid Reload (Heavy)':'Type=Fighter Imply="weapons.Heavy Crossbow"',
  'Rapid Reload (Light)':'Type=Fighter Imply="weapons.Light Crossbow"',
  'Rapid Shot':
    'Type=Fighter Require="dexterity >= 13","features.Point-Blank Shot"',
  'Ride-By Attack':'Type=Fighter Require="features.Mounted Combat",skills.Ride',
  'Run':'Type=General',
  'Scorpion Style':'Type=Fighter Require="features.Improved Unarmed Strike"',
  'Scribe Scroll':'Type="Item Creation",Wizard Require="casterLevel >= 1"',
  'Selective Channeling':
    'Type=General Require="charisma >= 13","features.Channel Energy"',
  'Self-Sufficient':'Type=General',
  'Shatter Defenses':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"Sum \'^features\\.Weapon Focus\' >= 1",' +
      '"features.Dazzling Display"',
  'Shield Focus':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","armorProficiency.Shield"',
  'Shield Master':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"features.Improved Shield Bash",' +
      '"armorProficiency.Shield",' +
      '"features.Shield Slam",' +
      '"features.Two-Weapon Fighting"',
  'Shield Proficiency':'Type=Fighter',
  'Shield Slam':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"features.Improved Shield Bash",' +
      '"armorProficiency.Shield",' +
      '"features.Two-Weapon Fighting"',
  'Shot On The Run':
    'Type=Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"baseAttack >= 4",' +
      '"features.Dodge",' +
      '"features.Mobility",' +
      '"features.Point-Blank Shot"',
  'Sickening Critical':'Type=Fighter,Critical',
  'Silent Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Simple Weapon Proficiency':'Type=General',
  'Skill Focus (%skill)':'Type=General',
  'Snatch Arrows':
    'Type=Fighter ' +
    'Require=' +
      '"dexterity >= 15",' +
      '"features.Deflect Arrows",' +
      '"features.Improved Unarmed Strike"',
  'Spell Focus (%school)':'Type=General Imply="casterLevel >= 1"',
  'Spell Mastery':
    'Type=Wizard Imply="intelligenceModifier > 0" Require="levels.Wizard >= 1"',
  'Spell Penetration':'Type=General Imply="casterLevel >= 1"',
  'Spellbreaker':
    'Type=Fighter Require="fighterFeatLevel >= 10","features.Disruptive"',
  'Spirited Charge':
    'Type=Fighter ' +
    'Require="features.Mounted Combat","features.Ride-By Attack",skills.Ride',
  'Spring Attack':
    'Type=Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"baseAttack >= 4",' +
      '"features.Dodge",' +
      '"features.Mobility"',
  'Staggering Critical':
    'Type=Fighter,Critical ' +
    'Require="baseAttack >= 13","features.Critical Focus"',
  'Stand Still':'Type=Fighter Require="features.Combat Reflexes"',
  'Stealthy':'Type=General',
  'Step Up':'Type=Fighter Require="baseAttack >= 1"',
  'Still Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Strike Back':'Type=Fighter Require="baseAttack >= 11"',
  'Stunning Critical':
    'Type=Fighter,Critical ' +
    'Require=' +
      '"baseAttack >= 17",' +
      '"features.Critical Focus",' +
      '"features.Staggering Critical"',
  'Stunning Fist':
    'Type=Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"wisdom >= 13",' +
      '"baseAttack >= 8",' +
      '"features.Improved Unarmed Strike"',
  'Throw Anything':'Type=Fighter',
  'Tiring Critical':
    'Type=Fighter,Critical ' +
    'Require="baseAttack >= 13","features.Critical Focus"',
  'Toughness':'Type=General',
  'Tower Shield Proficiency':'Type=Fighter',
  'Trample':'Type=Fighter Require="features.Mounted Combat",skills.Ride',
  'Turn Undead':'Type=General Require="features.Channel Energy"',
  'Two-Weapon Defense':
    'Type=Fighter Require="dexterity >= 15","features.Two-Weapon Fighting"',
  'Two-Weapon Fighting':'Type=Fighter Require="dexterity >= 15"',
  'Two-Weapon Rend':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"dexterity >= 17",' +
      '"features.Double Slice",' +
      '"features.Improved Two-Weapon Fighting",' +
      '"features.Two-Weapon Fighting"',
  'Unseat':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 1",' +
      '"strength >= 13",' +
      '"skills.Ride",' +
      '"features.Mounted Combat",' +
      '"features.Power Attack",' +
      '"features.Improved Bull Rush"',
  'Vital Strike':'Type=Fighter Require="baseAttack >= 6"',
  'Weapon Finesse':
    'Type=Fighter ' +
    'Imply="dexterityModifier > strengthModifier"',
  'Weapon Focus (%weapon)':
    'Type=Fighter Require="baseAttack >= 1" Imply="ownedWeapons.%weapon"',
  'Weapon Specialization (%weapon)':
    'Type=Fighter ' +
    'Imply="ownedWeapons.%weapon" ' +
    'Require=' +
      '"features.Weapon Focus (%weapon)",' +
      '"fighterFeatLevel >= 4"',
  'Whirlwind Attack':
    'Type=Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"intelligence >= 13",' +
      '"baseAttack >= 4",' +
      '"features.Combat Expertise",' +
      '"features.Dodge",' +
      '"features.Mobility",' +
      '"features.Spring Attack"',
  'Widen Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Wind Stance':
    'Type=Fighter Require="baseAttack >= 6","dexterity >= 15","features.Dodge"'
};
Pathfinder.FEATURES = {

  // Races

  // Dwarf
  'Darkvision':SRD35.FEATURES.Darkvision,
  'Defensive Training':SRD35.FEATURES['Dodge Giants'],
  'Dwarf Ability Adjustment':
    SRD35.FEATURES['Dwarf Ability Adjustment']
    .replace('+2 Constitution', '+2 Constitution/+2 Wisdom'),
  'Dwarf Hatred':SRD35.FEATURES['Dwarf Enmity'],
  'Greed':'Section=skill Note="+2 Appraise with precious metals and gems"',
  'Hardy':
    'Section=save ' +
    'Note="+%V vs. poison/+%1 vs. spells and spell-like abilities"',
  'Stability':
    SRD35.FEATURES.Stability
    .replace('+4', '+4 CMD'),
  'Steady':SRD35.FEATURES.Steady,
  'Stonecunning':
    'Section=skill ' +
    'Note="+%V Perception for unusual stonework and makes an automatic check when within 10\'"',

  // Elf
  'Elf Ability Adjustment':
    SRD35.FEATURES['Elf Ability Adjustment']
    .replace('+2 Dexterity', '+2 Dexterity/+2 Intelligence'),
  'Elven Immunities':SRD35.FEATURES['Elf Resistances'],
  'Elven Magic':
    'Section=magic,skill ' +
    'Note=' +
      '"+2 checks to overcome spell resistance",' +
      '"+2 Spellcraft to identify magic item properties"',
  'Keen Senses':'Section=skill Note="+%V Perception"',
  'Low-Light Vision':SRD35.FEATURES['Low-Light Vision'],

  // Gnome
  // Defensive Training as above
  'Gnome Ability Adjustment':
    SRD35.FEATURES['Gnome Ability Adjustment']
    .replace('+2 Constitution', '+2 Constitution/+2 Charisma'),
  'Gnome Hatred':
    SRD35.FEATURES['Gnome Enmity']
    .replace('kobold', 'reptilian'),
  'Gnome Magic':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Spell DC (Illusion)",' +
      '"Can cast <i>Dancing Lights</i>, <i>Ghost Sound</i>, <i>Prestidigitation</i>, and <i>Speak With Animals</i> once per day" ' +
    'Spells="Dancing Lights","Ghost Sound","Prestidigitation","Speak With Animals" ' +
    'SpellAbility=Charisma',
  'Illusion Resistance':SRD35.FEATURES['Resist Illusion'],
  // Keen Senses as above
  // Low-Light Vision as above
  'Obsessive':'Section=skill Note="+2 on a choice of Craft or Profession"',

  // Half-Elf
  'Adaptability':'Section=feature Note="+1 General Feat (Skill Focus)"',
  'Half-Elf Ability Adjustment':'Section=ability Note="+2 any"',
  'Elf Blood':
    SRD35.FEATURES['Elven Blood']
    .replace('an elf', 'both elf and human'),
  // Elven Immunities as above
  // Keen Senses as above
  // Low-Light Vision as above
  'Multitalented':'Section=feature Note="Can choose two favored classes"',

  // Half-Orc
  // Darkvision as above
  'Half-Orc Ability Adjustment':'Section=ability Note="+2 any"',
  'Intimidating':'Section=skill Note="+2 Intimidate"',
  'Orc Blood':
    SRD35.FEATURES['Orc Blood']
    .replace('an orc', 'both orc and human'),
  'Orc Ferocity':
    'Section=combat ' +
    'Note="Can continue to fight for 1 rd when brought to negative hit points once per day"',

  // Halfling
  'Fearless':SRD35.FEATURES['Resist Fear'],
  'Halfling Ability Adjustment':
    SRD35.FEATURES['Halfling Ability Adjustment']
    .replace('+2 Dexterity', '+2 Dexterity/+2 Charisma'),
  'Halfling Luck':SRD35.FEATURES.Fortunate,
  // Keen Senses as above
  'Sure-Footed':'Section=skill Note="+2 Acrobatics/+2 Climb"',

  // Human
  'Bonus Feat (Human)':SRD35.FEATURES['Bonus Feat (Human)'],
  'Human Ability Adjustment':'Section=ability Note="+2 any"',
  'Skilled':'Section=skill Note="+%V Skill ranks"',

  // Class

  // Barbarian
  'Animal Fury':
    'Section=combat ' +
    'Note="Can use a +%{baseAttack-5} bite attack during rage that inflicts %V+%{(strengthModifier+2+(combatNotes.greaterRage?1:0)+(combatNotes.mightyRage?1:0))//2} HP; a hit also gives +2 on a subsequent grapple check"',
  'Clear Mind':'Section=save Note="Can reroll a Will save once per rage"',
  'Fast Movement (Barbarian)':SRD35.FEATURES['Fast Movement (Barbarian)'],
  'Guarded Stance':
    'Section=combat ' +
    'Note="Can gain a +%{ragePowerLevel//6+1} dodge bonus to Armor Class for %{(constitutionModifier+2+(combatNotes.greaterRage?1:0)+(combatNotes.mightyRage?1:0))>?1} rd during rage"',
  'Fearless Rage':
    'Section=save Note="Has immunity to shaken and frightened during rage"',
  'Greater Rage':SRD35.FEATURES['Greater Rage'],
  'Improved Uncanny Dodge':SRD35.FEATURES['Improved Uncanny Dodge'],
  'Increased Damage Reduction':'Section=combat Note="Has +%V DR/- during rage"',
  'Indomitable Will':SRD35.FEATURES['Indomitable Will'],
  'Internal Fortitude':
    'Section=save Note="Has immunity to sickened and nauseated during rage"',
  'Intimidating Glare':
    'Section=skill ' +
    'Note="Successful Intimidate during rage shakes the target for 1d4 rd plus 1 rd per 5 points over the DC"',
  'Knockback':
    'Section=combat ' +
    'Note="Successful Bull Rush during rage inflicts %{strengthModifier+2+(combatNotes.greaterRage?1:0)+(combatNotes.mightyRage?1:0)} HP"',
  'Low-Light Vision (Barbarian)':
    SRD35.FEATURES['Low-Light Vision']
    .replace(/"$/, ' during rage"'),
  'Mighty Rage':SRD35.FEATURES['Mighty Rage'],
  'Mighty Swing':
    'Section=combat Note="Can automatically confirm a crit once per rage"',
  'Moment Of Clarity':
    'Section=combat Note="Can suspend rage effects for 1 rd once per rage"',
  'Night Vision':
    SRD35.FEATURES['Darkvision']
    .replace(/"$/, ' during rage"'),
  'No Escape':
    'Section=combat ' +
    'Note="Can use an immediate action to follow a withdrawing foe at 2x normal Speed once per rage"',
  'Powerful Blow':
    'Section=combat ' +
    'Note="Can use a swift action before an attack to inflict +%{ragePowerLevel//4+1} HP once per rage"',
  'Quick Reflexes':
    'Section=combat Note="Can make an additional AOO each rd during rage"',
  'Rage':
    'Section=combat ' +
    'Note="Can gain +%{combatNotes.mightyRage?8:combatNotes.greaterRage?6:4} Strength, +%{combatNotes.mightyRage?8:combatNotes.greaterRage?6:4} Constitution, and +%{combatNotes.mightyRage?4:combatNotes.greaterRage?3:2} Will and suffer -2 Armor Class%{combatNotes.tirelessRage?\'\':\', becoming fatigued afterward for twice as many rd,\'} for %V rd per 8 hr of rest"',
  'Rage Powers':'Section=feature Note="%V selections"',
  'Raging Climber':'Section=skill Note="+%{ragePowerLevel} Climb during rage"',
  'Raging Leaper':
    'Section=skill ' +
    'Note="+%{ragePowerLevel} Acrobatics for jumping during rage"',
  'Raging Swimmer':'Section=skill Note="+%{ragePowerLevel} Swim during rage"',
  'Renewed Vigor':
    'Section=combat ' +
    'Note="Can recover %{ragePowerLevel//4>?1}d8+%{constitutionModifier+2+(combatNotes.greaterRage?1:0)+(combatNotes.mightyRage?1:0)} hit points during rage once per day"',
  'Rolling Dodge':
    'Section=combat ' +
    'Note="Can gain a +%{ragePowerLevel//6+1} dodge bonus to Armor Class vs. ranged attacks for %{(constitutionModifier+2+(combatNotes.greaterRage?1:0)+(combatNotes.mightyRage?1:0))>?1} rd during rage"',
  'Roused Anger':
    'Section=combat ' +
    'Note="Can rage when fatigued, gaining immunity to fatigued but becoming exhausted afterward for 10 min per rd raging"',
  'Scent (Barbarian)':
    'Section=skill Note="Can detect creatures via smell during rage"',
  'Strength Surge':
    'Section=combat ' +
    'Note="Can use an immediate action to gain +%{ragePowerLevel} on a Strength, CMB, or CMD check once per rage"',
  'Superstition':
    'Section=save ' +
    'Note="+%{ragePowerLevel//4+2} vs. spells, supernatural, and spell-like abilities during rage and cannot willingly fail a save"',
  'Surprise Accuracy':
    'Section=combat ' +
    'Note="Can use a swift action to gain +%{ragePowerLevel//4+1} on an attack once per rage"',
  'Swift Foot':
    'Section=ability ' +
    'Note="Gains +%{$\'barbarianFeatures.Swift Foot\'*5} Speed during rage"',
  'Terrifying Howl':
    'Section=combat ' +
    'Note="R30\' Can emit a howl that panics shaken foes (save Will DC %{10+ragePowerLevel//2+strengthModifier+2+(combatNotes.greaterRage?1:0)+(combatNotes.mightyRage?1:0)} negates) for 1d4+1 rd; a creature can be targeted only once per 24 hr"',
  'Tireless Rage':SRD35.FEATURES['Tireless Rage'],
  'Trap Sense':
    'Section=save Note="+%V Reflex and dodge bonus to Armor Class vs. traps"',
  'Uncanny Dodge':SRD35.FEATURES['Uncanny Dodge'],
  'Unexpected Strike':
    'Section=combat ' +
    'Note="Can take an AOO when a foe enters threat area once per rage"',

  // Bard
  'Bardic Knowledge':
    'Section=skill,skill ' +
    'Note=' +
      '"+%V all Knowledge",' +
      '"Can use any Knowledge skill untrained"',
  'Bardic Performance':
    'Section=skill ' +
    'Note="Can use Bardic Performance effects %{bardicPerformanceLevel*2+2+charismaModifier+(skillNotes.extraPerformance||0)} rd per day, starting or changing each as a %{bardicPerformanceLevel<7?\'standard\':bardicPerformanceLevel<13?\'move\':\'swift\'} action"',
  'Cantrips':'Section=magic Note="Knows 0-level spells"',
  'Countersong':
    'Section=skill ' +
    'Note="R30\' Can allow listeners to substitute a Bardic Performance check for saves vs. sonic magic and give them additional saves each rd vs. existing effects"',
  'Deadly Performance':
    'Section=skill ' +
    'Note="R30\' Can use Bardic Performance to kill a target (save Will DC %{10+bardicPerformanceLevel//2+charismaModifier} inflicts staggered for 1d4 rd and prevents additional attempts for 24 hr)"',
  'Dirge Of Doom':
    'Section=skill ' +
    'Note="R30\' Can use Bardic Performance to inflict shaken on foes"',
  'Distraction':
    'Section=skill ' +
    'Note="R30\' Can allow listeners to substitute a Bardic Performance check for saves vs. pattern and figment illusions and give them additional saves each rd vs. existing effects"',
  'Fascinate':
    SRD35.FEATURES.Fascinate
    .replace('vs. Perform check', 'DC %{10+bardicPerformanceLevel//2+charismaModifier}'),
  'Frightening Tune':
    'Section=skill ' +
    'Note="R30\' Can use Bardic Performance to cause foes to flee (save Will DC %{10+bardicPerformanceLevel//2+charismaModifier} negates for 24 hr)"',
  'Inspire Competence':
    'Section=skill ' +
    'Note="R30\' Can use Bardic Performance to give allies +%{(bardicPerformanceLevel+5)//4} skill checks"',
  'Inspire Courage':
    'Section=skill ' +
    'Note="Can use Bardic Performance to give allies +%{(inspireCourageLevel+7)//6} attack, damage, and charm and fear saves"',
  'Inspire Greatness':
    SRD35.FEATURES['Inspire Greatness']
    .replace('Bardic Music', 'Bardic Performance')
    .replace(/, lasting.*ends/, ''),
  'Inspire Heroics':
    SRD35.FEATURES['Inspire Heroics']
    .replace('Bardic Music', 'Bardic Performance')
    .replaceAll('levels.Bard', 'bardicPerformanceLevel')
    .replace(/, lasting.*ends/, ''),
  'Jack-Of-All-Trades':
    'Section=skill,skill ' +
    'Note=' +
      '"Can use any skill untrained%{levels.Bard>18?\' and can take 10 on any skill\':\'\'}",' +
      '"All skills are class skills"',
  'Lore Master':
    'Section=skill ' +
    'Note="Can take 10 on any ranked Knowledge skill and can take 20 on any Knowledge skill %{levels.Bard>10?(levels.Bard+1)//6+\' times\':\'once\'} per day"',
  'Mass Suggestion':SRD35.FEATURES['Mass Suggestion'],
  'Simple Somatics':SRD35.FEATURES['Simple Somatics'],
  'Soothing Performance':
    'Section=magic ' +
    'Note="R30\' Can use a 4 rd Bardic Performance to invoke <i>Mass Cure Serious Wounds</i> effects; also removes fatigued, sickened, and shaken" ' +
    'Spells="Mass Cure Serious Wounds" ' +
    'SpellAbility=Charisma',
  'Suggestion':SRD35.FEATURES.Suggestion,
  'Versatile Performance':'Section=feature Note="%V selections"',
  'Well-Versed':
    'Section=save ' +
    'Note="+4 vs. bardic performance, sonic, and language-dependent effects"',

  // Cleric
  'Aligned Spells':SRD35.FEATURES['Aligned Spells'],
  'Aura':SRD35.FEATURES.Aura,
  'Channel Energy':
    'Section=magic ' +
    'Note="Can restore %1d6 hit points or inflict the same amount (save Will DC %{10+channelLevel//2+charismaModifier} half) to all creatures within 30\' %{%V>1?\'%V times\':\'once\'} per day"',
  'Orisons':'Section=magic Note="Knows 0-level spells"',
  'Spontaneous Casting (Cleric)':SRD35.FEATURES['Spontaneous Casting (Cleric)'],
  // Air Domain
  'Electricity Resistance':
    'Section=save ' +
    'Note="Has %{!%V?\'immunity\':\'resistance %V\'} to electricity"',
  'Lightning Arc':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d6+%{casterLevels.Air//2} HP electricity %{wisdomModifier+3} times per day"',
  // Animal Domain
  'Animal Domain':'Section=skill Note="Knowledge (Nature) is a class skill"',
  'Animal Companion':SRD35.FEATURES['Animal Companion'],
  'Speak With Animals':
    'Section=magic ' +
    'Note="Can use <i>Speak With Animals</i> effects for %{casterLevels.Animal+3} rd per day" ' +
    'Spells="Speak With Animals" ' +
    'SpellAbility=Charisma',
  // Artifice Domain
  "Artificer's Touch":
    'Section=combat,magic ' +
    'Note=' +
      '"Touch attack on objects and constructs inflicts 1d6+%{casterLevels.Artifice//2} HP, bypassing %{casterLevels.Artifice} DR and hardness, %{wisdomModifier+3} times per day",' +
      '"Can use <i>Mending</i> effects at will" ' +
    'Spells="Mending" ' +
    'SpellAbility=Wisdom',
  'Dancing Weapons':
    'Section=combat ' +
    'Note="Touched weapon gains the <i>dancing</i> quality for 4 rd %{casterLevels.Artifice>11?(casterLevels.Artifice-4)//4+\' times\':\'once\'} per day"',
  // Chaos Domain
  'Chaos Blade':
    'Section=combat ' +
    'Note="Touched weapon gains the <i>anarchic</i> quality for %{casterLevels.Chaos//2} rd %{casterLevels.Chaos>11?(casterLevels.Chaos-4)//4+\' times\':\'once\'} per day"',
  'Touch Of Chaos':
    'Section=combat ' +
    'Note="Touch attack causes the target to take the worse result of 2 d20 rolls for 1 rd %{wisdomModifier+3} times per day"',
  // Charm Domain
  'Charming Smile':
    'Section=magic ' +
    'Note="Can use a swift action to invoke <i>Charm Person</i> effects (save Will DC %{10+casterLevels.Charm//2+wisdomModifier}) for %{casterLevels.Charm} rd per day" ' +
    'Spells="Charm Person" ' +
    'SpellAbility=Charisma',
  'Dazing Touch (Charm)':
    'Section=combat ' +
    'Note="Touch dazes a foe with up to %{casterLevels.Charm} HD for 1 rd %{wisdomModifier+3} times per day"',
  // Community Domain
  'Calming Touch':
    'Section=magic ' +
    'Note="Touch restores 1d6+%{casterLevels.Community} nonlethal hit points and removes fatigued, shaken, and sickened conditions %{wisdomModifier+3} times per day"',
  'Unity':
    'Section=save ' +
    'Note="R30\' Can allow allies to use self saving throw vs. an effect that affects both %{casterLevels.Community>11?(casterLevels.Community-4)//4+\' times\':\'once\'} per day"',
  // Darkness Domain
  'Darkness Domain':'Section=combat Note="Has the Blind-Fight feature"',
  'Eyes Of Darkness':
    'Section=feature ' +
    'Note="Can see normally in any lighting, including magical darkness, for %{casterLevels.Darkness//2} rd per day"',
  'Touch Of Darkness':
    'Section=combat ' +
    'Note="Touch attack inflicts a 20% miss chance on attacks for %{casterLevels.Darkness//2>?1} rd %{wisdomModifier+3} times per day"',
  // Death Domain
  'Bleeding Touch':
    'Section=combat ' +
    'Note="Touch attack inflicts 1d6 HP bleed damage for %{casterLevels.Death//2>?1} rd (magical healing or a DC 15 Heal ends) %{wisdomModifier+3} times per day"',
  "Death's Embrace":
    'Section=combat Note="Regains hit points from channeled negative energy"',
  // Destruction Domain
  'Destructive Aura':
    'Section=combat ' +
    'Note="Attacks by any creature vs. a target within a 30\' emanation inflict +%{casterLevels.Destruction//2} HP and automatically confirm crit threats for %{casterLevels.Destruction} rd per day"',
  'Destructive Smite':
    'Section=combat ' +
    'Note="Melee attack inflicts +%{casterLevels.Destruction//2} HP %{wisdomModifier+3} times per day"',
  // Earth Domain
  'Acid Dart (Earth)':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d6+%{casterLevels.Earth//2} HP acid %{wisdomModifier+3} times per day"',
  'Acid Resistance':
    'Section=save ' +
    'Note="Has %{!%V?\'immunity\':\'resistance %V\'} to acid"',
  // Evil Domain
  'Scythe Of Evil':
    'Section=combat ' +
    'Note="Touched weapon gains the <i>unholy</i> quality for %{casterLevels.Evil//2} rd %{casterLevels.Evil>11?(casterLevels.Evil-4)//4+\' times\':\'once\'} per day"',
  'Touch Of Evil':
    'Section=combat ' +
    'Note="Touch inflicts sickened and susceptibility to good-targeted spells for %{casterLevels.Evil//2>?1} rd %{wisdomModifier+3} times per day"',
  // Fire Domain
  'Fire Bolt':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d6+%{casterLevels.Fire//2} HP fire %{wisdomModifier+3} times per day"',
  'Fire Resistance':
    'Section=save ' +
    'Note="Has %{!%V?\'immunity\':\'resistance %V\'} to fire"',
  // Glory Domain
  'Divine Presence':
    'Section=magic ' +
    'Note="30\' emanation gives allies DC %{10+casterLevels.Glory//2+wisdomModifier} <i>Sanctuary</i> effects for %{casterLevels.Glory} rd per day; self attacking ends" ' +
    'Spells="Sanctuary" ' +
    'SpellAbility=Charisma',
  'Glory Domain':
    'Section=magic Note="+2 save DC on channeled energy to harm undead"',
  'Touch Of Glory':
    'Section=magic ' +
    'Note="Touch gives +%{casterLevels.Glory} on a Charisma check within 1 hr %{wisdomModifier+3} times per day"',
  // Good Domain
  'Holy Lance':
    'Section=combat ' +
    'Note="Touched weapon gains the <i>holy</i> quality for %{casterLevels.Good//2} rd %{casterLevels.Good>11?(casterLevels.Good-4)//4+\' times\':\'once\'} per day"',
  'Touch Of Good':
    'Section=magic ' +
    'Note="Touch gives +%{casterLevels.Good//2>?1} attacks, skill checks, ability checks, and saves for 1 rd %{wisdomModifier+3} times per day"',
  // Healing Domain
  "Healer's Blessing":
    'Section=magic Note="<i>Cure</i> spells restore 50% more hit points"',
  'Rebuke Death':
    'Section=magic ' +
    'Note="Touch restores 1d4+%{casterLevels.Healing//2} hit points to a creature with negative hit points %{wisdomModifier+3} times per day"',
  // Knowledge Domain
  'Knowledge Domain':
    'Section=skill Note="All Knowledge skills are class skills"',
  'Lore Keeper':
    'Section=skill ' +
    'Note="Touch attack reveals info as per a %{15+casterLevels.Knowledge+wisdomModifier} Knowledge check"',
  'Remote Viewing':
    'Section=magic ' +
    'Note="Can use <i>Clairaudience/Clairvoyance</i> effects for %{casterLevels.Knowledge} rd per day" ' +
    'Spells="Clairaudience/Clairvoyance" ' +
    'SpellAbility=Charisma',
  // Law Domain
  'Staff Of Order':
    'Section=combat ' +
    'Note="Touched weapon gains the <i>axiomatic</i> quality for %{casterLevels.Law//2} rd %{casterLevels.Law>11?(casterLevels.Law-4)//4+\' times\':\'once\'} per day"',
  'Touch Of Law':
    'Section=magic ' +
    'Note="Touched can take 11 on all d20 rolls for 1 rd %{wisdomModifier+3} times per day"',
  // Liberation Domain
  "Freedom's Call":
    'Section=magic ' +
    'Note="30\' emanation gives allies immunity to confused, grappled, frightened, panicked, paralyzed, pinned, and shaken conditions for %{casterLevels.Liberation} rd per day"',
  'Liberation':
    'Section=ability ' +
    'Note="Can ignore movement impediments for %{casterLevels.Liberation} rd per day"',
  // Luck Domain
  'Bit Of Luck':
    'Section=magic ' +
    'Note="Touch gives d20 rerolls for 1 rd %{wisdomModifier+3} times per day"',
  'Good Fortune':
    SRD35.FEATURES['Luck Domain']
    .replace('a roll', 'a d20 roll')
    .replace('once', "%{casterLevels.Luck>11?casterLevels.Luck//6+' times':'once'}"),
  // Madness Domain
  'Aura Of Madness':
    'Section=magic ' +
    'Note="30\' emanation inflicts <i>Confusion</i> effects (save Will DC %{10+casterLevels.Madness//2+wisdomModifier} negates for 24 hr) for %{casterLevels.Madness} rd per day" ' +
    'Spells="Confusion" ' +
    'SpellAbility=Charisma',
  'Vision Of Madness':
    'Section=magic ' +
    'Note="Gives touched +%{casterLevels.Madness//2>?1} on a choice of attacks, saves, or skill checks and -%{casterLevels.Madness//2>?1} on the others for 3 rd %{wisdomModifier+3} times per day"',
  // Magic Domain
  'Dispelling Touch':
    'Section=magic ' +
    'Note="Touch invokes <i>Dispel Magic</i> effects %{casterLevels.Magic>11?(casterLevels.Magic-4)//4+\' times\':\'once\'} per day" ' +
    'Spells="Dispel Magic" ' +
    'SpellAbility=Charisma',
  'Hand Of The Acolyte':
    'Section=combat ' +
    'Note="R30\' Can make a +%{rangedAttack-dexterityModifier+wisdomModifier} ranged attack with a melee weapon %{wisdomModifier+3} times per day"',
  // Nobility Domain
  'Inspiring Word':
    'Section=magic ' +
    'Note="R30\' Gives the target +2 attacks, skill checks, ability checks, and saves for %{casterLevels.Nobility//2>?1} rd %{wisdomModifier+3} times per day"',
  'Leadership (Cleric)':
    'Section=feature,feature ' +
    'Note=' +
      '"Has the Leadership feature",' +
      '"+2 Leadership score"',
  // Plant Domain
  'Bramble Armor':
    'Section=combat ' +
    'Note="Successful melee attackers without reach suffer 1d6+%{casterLevels.Plant//2} HP piercing for %{casterLevels.Plant} rd per day"',
  'Wooden Fist':
    'Section=combat ' +
    'Note="Unarmed attacks inflict +%{casterLevels.Plant//2} HP and provoke no AOO for %{wisdomModifier+3} rd per day"',
  // Protection Domain
  'Aura Of Protection':
    'Section=combat ' +
    'Note="30\' emanation gives allies a +%{(casterLevels.Protection-4)//4} deflection bonus to Armor Class and resistance %{casterLevels.Protection<14?5:10} to all energy for %{casterLevels.Protection} rd per day"',
  'Protection Domain':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Resistant Touch':
    'Section=save ' +
    'Note="Touch transfers resistance bonus to an ally for 1 min %{wisdomModifier+3} times per day"',
  // Repose Domain
  'Gentle Rest':
    'Section=combat ' +
    'Note="Touch inflicts staggered for 1 rd (undead for %{wisdomModifier} rd), or asleep on an already-staggered creature, %{wisdomModifier+3} times per day"',
  'Ward Against Death':
    'Section=magic ' +
    'Note="30\' emanation gives living creatures immunity to death effects, energy drain, and negative level effects for %{casterLevels.Repose} rd per day"',
  // Rune Domain
  'Blast Rune':
    'Section=magic ' +
    'Note="Can create a rune in an adjacent unoccupied square that inflicts 1d6+%{casterLevels.Rune//2} HP of a choice of acid, cold, electricity, or fire damage once within %{casterLevels.Rune} rd %{wisdomModifier+3} times per day"',
  'Rune Domain':'Section=magic Note="Has the Scribe Scroll feature"',
  'Spell Rune':
    'Section=magic Note="Can add a known spell of up to level %{spellSlots.C9?8:spellSlots.C8?7:spellSlots.C7?6:spellSlots.C6?5:spellSlots.C5?4:3} to the effects of Blast Rune"',
  // Strength Domain
  'Might Of The Gods':
    'Section=ability ' +
    'Note="Can gain +%{casterLevels.Strength} Strength for %{wisdomModifier+3} rd per day"',
  'Strength Surge (Cleric)':
    'Section=magic ' +
    'Note="Touch gives +%{casterLevels.Strength//2>?1} melee attacks and Strength checks for 1 rd %{wisdomModifier+3} times per day"',
  // Sun Domain
  'Nimbus Of Light':
    'Section=magic ' +
    'Note="30\' emanation invokes <i>Daylight</i> effects, inflicts %{casterLevels.Sun} HP on undead, and dispels spells with the Darkness descriptor for %{casterLevels.Sun} rd per day" ' +
    'Spells="Daylight" ' +
    'SpellAbility=Charisma',
  "Sun's Blessing":
    'Section=magic ' +
    'Note="Channel Energy inflicts +%{casterLevels.Sun} HP on undead and negates channel resistance"',
  // Travel Domain
  'Agile Feet':
    'Section=ability ' +
    'Note="Can ignore difficult terrain for 1 rd %{wisdomModifier+3} times per day"',
  'Dimensional Hop':
    'Section=magic ' +
    'Note="Can teleport %{casterLevels.Travel*10}\' per day; including others uses an equal portion of the daily distance"',
  'Travel Domain':'Section=ability Note="+10 Speed"',
  // Trickery Domain
  'Copycat':
    'Section=magic ' +
    'Note="Can use <i>Mirror Image</i> effects to create a single copy for %{casterLevels.Trickery} rd %{wisdomModifier+3} times per day" ' +
    'Spells="Mirror Image" ' +
    'SpellAbility=Charisma',
  "Master's Illusion":
    'Section=magic ' +
    'Note="30\' emanation invokes <i>Veil</i> effects (save Will DC %{10+casterLevels.Trickery//2+wisdomModifier} disbelieve) for %{casterLevels.Trickery} rd per day" ' +
    'Spells="Veil" ' +
    'SpellAbility=Charisma',
  'Trickery Domain':
    'Section=skill Note="Bluff is a class skill/Disguise is a class skill/Stealth is a class skill"',
  // War Domain
  'Battle Rage':
    'Section=combat ' +
    'Note="Touch gives a +%{casterLevels.War//2>?1} damage bonus for 1 rd %{wisdomModifier+3} times per day"',
  'Weapon Master':
    'Section=combat ' +
    'Note="Can use the effects of additional combat feats for %{casterLevels.War} rd per day; must meet any feat prerequisites"',
  // Water Domain
  'Cold Resistance':
    'Section=save ' +
    'Note="Has %{!%V?\'immunity\':\'resistance %V\'} to cold"',
  'Icicle':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d6+%{casterLevels.Water//2} HP cold %{wisdomModifier+3} times per day"',
  // Weather Domain
  'Lightning Lord':
    'Section=magic ' +
    'Note="Can use <i>Call Lightning</i> effects on targets within 15\' for %{casterLevels.Weather} bolts per day" ' +
    'Spells="Call Lightning" ' +
    'SpellAbility=Charisma',
  'Storm Burst':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d6+%{casterLevels.Weather//2} HP nonlethal and -2 attacks for 1 rd %{wisdomModifier+3} times per day"',

  // Druid
  'A Thousand Faces':SRD35.FEATURES['A Thousand Faces'],
  // Aligned Spells as above
  // Animal Companion as above
  'Nature Bond':'Section=feature Note="1 selection"',
  'Nature Sense':SRD35.FEATURES['Nature Sense'],
  // Orisons as above
  "Resist Nature's Lure":
    SRD35.FEATURES["Resist Nature's Lure"]
    .replace('fey creatures', 'fey creatures and effects that target plants'),
  'Spontaneous Casting (Druid)':SRD35.FEATURES['Spontaneous Casting (Druid)'],
  'Timeless Body':SRD35.FEATURES['Timeless Body'],
  'Trackless Step':SRD35.FEATURES['Trackless Step'],
  'Venom Immunity':SRD35.FEATURES['Venom Immunity'],
  'Wild Empathy':SRD35.FEATURES['Wild Empathy'],
  'Wild Shape':
    'Section=magic ' +
    'Note="Can change into a %{wildShapeLevel<6?\'small\':wildShapeLevel<8?\'tiny\':\'diminutive\'} to %{wildShapeLevel<6?\'medium\':wildShapeLevel<8?\'large\':\'huge\'} animal%{wildShapeLevel>=8?\', a small to \'+(wildShapeLevel<10?\'medium\':wildShapeLevel<12?\'large\':\'huge\')+\' plant,\':\'\'}%{wildShapeLevel>=6?\' or a \'+(wildShapeLevel<8?\'small\':wildShapeLevel<10?\'small to medium\':wildShapeLevel<12?\'small to large\':\'small to huge\')+\' elemental\':\'\'} for %{wildShapeLevel} hr %{wildShapeLevel<20?(wildShapeLevel>=6?(wildShapeLevel-2)//2+\' times\':\'once\')+\' per day\':\'at will\'}"',
  'Woodland Stride':SRD35.FEATURES['Woodland Stride'],

  // Fighter
  'Armor Mastery':
    'Section=combat Note="Has DR 5/- when using armor or a shield"',
  'Armor Training':
    'Section=ability,combat,skill ' +
    'Note=' +
      '"No Speed penalty in %V armor",' +
      '"Raises armor maximum Dexterity bonus to Armor Class by %V",' +
      '"Reduces armor skill check penalty by %V"',
  'Bonus Feats (Fighter)':SRD35.FEATURES['Bonus Feats (Fighter)'],
  'Bravery':'Section=save Note="+%{(levels.Fighter+2)//4} vs. fear"',
  'Weapon Mastery':
    'Section=combat ' +
    'Note="Crit threats with a chosen weapon are automatically confirmed and gain +1 damage multiplier; cannot be disarmed when wielding this weapon"',
  'Weapon Training':
    'Section=combat ' +
    // TODO Implement? Group properties on weapons?
    'Note="%V attacks, damage, CMB, and CMD with weapons from %1 chosen weapon group%{combatNotes.weaponTraining.1==1?\'\':\'s\'}"',

  // Monk
  'Abundant Step':
    'Section=magic ' +
    'Note="Can spend 2 Ki Points to teleport self %{levels.Monk*40+400}\'"',
  'Armor Class Bonus':
    SRD35.FEATURES['Armor Class Bonus']
    .replace('Armor Class', 'Armor Class and CMD'),
  'Bonus Feats (Monk)':SRD35.FEATURES['Bonus Feats (Monk)'],
  'Diamond Body':SRD35.FEATURES['Diamond Body'],
  'Diamond Soul':SRD35.FEATURES['Diamond Soul'],
  'Empty Body':
    'Section=magic Note="Can spend 3 Ki Points to become ethereal for 1 min"',
  'Evasion':SRD35.FEATURES.Evasion,
  'Fast Movement (Monk)':SRD35.FEATURES['Fast Movement (Monk)'],
  'Flurry Of Blows':
    'Section=combat ' +
    'Note="Can make %1%2%3%4%5%6%7 monk weapon attacks as a full-round action and can spend 1 Ki Point for an additional %8 attack"',
  'High Jump':
    'Section=skill ' +
    'Note="+%{levels.Monk} Acrobatics on jumps; can spend 1 Ki Point to gain +20"',
  'Improved Evasion':SRD35.FEATURES['Improved Evasion'],
  'Ki Dodge':
    'Section=combat ' +
    'Note="Can spend 1 Ki Point to gain a +4 dodge bonus to Armor Class for 1 rd"',
  'Ki Pool':'Section=combat Note="%V points; refills after 8 hr rest"',
  'Ki Speed':
    'Section=ability Note="Can spend 1 Ki Point to gain +20 Speed for 1 rd"',
  'Ki Strike':
    'Section=combat ' +
    'Note="When Ki Pool contains at least 1 point, Unarmed Strikes count as magic%{levels.Monk>15?\', cold iron, silver, lawful, and adamantine\':levels.Monk>9?\', cold iron, silver, and lawful\':levels.Monk>6?\', cold iron, and silver\':\'\'} weapons"',
  'Maneuver Training':'Section=combat Note="+%V CMB"',
  'Perfect Self':
    SRD35.FEATURES['Perfect Self']
    .replace('magic', 'chaotic'),
  'Purity Of Body':
    SRD35.FEATURES['Purity Of Body']
    .replace('natural', 'all'),
  'Quivering Palm':
    SRD35.FEATURES['Quivering Palm']
    .replace('week', 'day'),
  'Slow Fall':SRD35.FEATURES['Slow Fall'],
  'Still Mind':SRD35.FEATURES['Still Mind'],
  'Stunning Fist':
    SRD35.FEATURES['Stunning Fist']
    .replace('stunned for 1 rd', "stunned for 1 rd%{levels.Monk>3?(levels.Monk>7?',':' or')+' fatigued':''}%{levels.Monk>7?(levels.Monk>11?',':', or')+' sickened for 1 min':''}%{levels.Monk>11?(levels.Monk>15?',':', or')+' staggered for 1d6+1 rd':''}%{levels.Monk>15?(levels.Monk>19?',':', or')+' permanently blind or deafened':''}%{levels.Monk>19?', or paralyzed for 1d6+1 rd':''}"),
  // Timeless Body as above
  'Tongue Of The Sun And Moon':SRD35.FEATURES['Tongue Of The Sun And Moon'],
  'Unarmed Strike':SRD35.FEATURES['Unarmed Strike'],
  'Wholeness Of Body':
    'Section=combat ' +
    'Note="Can spend 2 Ki Points to restore %{levels.Monk} hit points to self"',

  // Paladin
  'Aura Of Courage':SRD35.FEATURES['Aura Of Courage'],
  'Aura Of Faith':
    'Section=combat ' +
    'Note="Self weapons and ally attacks vs. foes within 10\' count as good-aligned"',
  'Aura Of Good':SRD35.FEATURES['Aura Of Good'],
  'Aura Of Righteousness':
    SRD35.FEATURES['Aura Of Courage']
    .replaceAll('fear', 'compulsion')
    .replace('Section=', 'Section=combat,')
    .replace('Note=', 'Note="Has DR %V/evil",'),
  'Aura Of Justice':
    'Section=combat ' +
    'Note="Can expend 2 Smite Evil uses to allow allies within 10\' to Smite Evil for 1 min"',
  'Aura Of Resolve':
    SRD35.FEATURES['Aura Of Courage']
    .replaceAll('fear', 'charm'),
  'Channel Positive Energy':
    'Section=magic ' +
    'Note="Can expend 2 Lay On Hands uses to use Channel Energy effects"',
  'Companion Spell Resistance':SRD35.FEATURES['Companion Spell Resistance'],
  'Detect Evil':SRD35.FEATURES['Detect Evil'],
  'Divine Grace':SRD35.FEATURES['Divine Grace'],
  'Divine Health':SRD35.FEATURES['Divine Health'],
  'Divine Mount':
    'Section=feature ' +
    'Note="Can magically summon a companion mount %{levels.Paladin>8?(levels.Paladin-1)//4+\' times\':\'once\'} per day; death of the mount inflicts -1 attacks and damage for 30 days or until a Paladin level is gained"',
  'Divine Weapon':
    'Section=combat ' +
    'Note="Can add %{(levels.Paladin-2)//3} +1 enhancements (these stack with an existing enhancement to a maximum of +5) or choices of <i>axiomatic</i>, <i>brilliant energy</i>, <i>defending</i>, <i>disruption</i>, <i>flaming</i>, <i>flaming burst</i>, <i>holy</i>, <i>keen</i>, <i>merciful</i>, and <i>speed</i> to a chosen weapon for %{levels.Paladin} min %{levels.Paladin>8?(levels.Paladin-1)//4+\' times\':\'once\'} per day; destruction of the weapon inflicts -1 attacks and damage for 30 days or until a Paladin level is gained"',
  'Holy Champion':
    'Section=magic ' +
    'Note="Channel Positive Energy and Lay On Hands heal or inflict the maximum possible hit points/Using Smite Evil vs. an outsider immediately ends the use and inflicts <i>Banishment</i> effects" ' +
    'Spells="Banishment" ' +
    'SpellAbility=Charisma',
  'Lay On Hands':
    'Section=magic ' +
    'Note="Touch restores %Vd6 hit points %{%1>1?%1+\' times\':\'once\'} per day; use on undead instead inflicts HP"',
  'Mercy':
    'Section=magic ' +
    'Note="Lay On Hands also removes the %V condition%{magicNotes.mercy=~\' and \'?\'s\':\'\'}"',
  'Mercy (Cursed)':
    'Section=magic ' +
    'Note="Lay On Hands acts as a <i>Remove Curse</i> spell" ' +
    'Spells="Remove Curse" ' +
    'SpellAbility=Charisma',
  'Mercy (Diseased)':
    'Section=magic ' +
    'Note="Lay On Hands acts as a <i>Remove Disease</i> spell" ' +
    'Spells="Remove Disease" ' +
    'SpellAbility=Charisma',
  'Mercy (Poisoned)':
    'Section=magic ' +
    'Note="Lay On Hands acts as a <i>Neutralize Poison</i> spell" ' +
    'Spells="Neutralize Poison" ' +
    'SpellAbility=Charisma',
  'Smite Evil':
    'Section=combat ' +
    'Note="Can gain +%{charismaModifier>?0} attack, inflict +%{levels.Paladin} HP, bypass DR, and gain a +%{charismaModifier>?0} deflection bonus to Armor Class vs. a chosen evil foe %{%V>1?%V+\' times\':\'once\'} per day; does an additional +%{levels.Paladin} HP on first the hit if the target is %1"',

  // Ranger
  // Animal Companion as above
  'Camouflage':
    SRD35.FEATURES.Camouflage
    .replace('natural', 'favored'),
  'Combat Style':SRD35.FEATURES['Combat Style'],
  'Companion Bond':
    'Section=combat ' +
    'Note="R30\' Can use a move action to give half of a favored enemy bonus to allies for %{wisdomModifier>?1} rd"',
  // Evasion as above
  'Favored Enemy':
    SRD35.FEATURES['Favored Enemy']
    .replaceAll('damage', 'attack and damage'),
  'Favored Terrain':
    'Section=combat,skill ' +
    'Note=' +
      '"%{combatNotes.favoredTerrain>1?\'Has \'+(combatNotes.favoredTerrain*2-1)+\' +2 Initiative bonuses distributed among %V terrain types\':\'+2 Initiative in a chosen terrain type\'}",' +
      '"%{skillNotes.favoredTerrain>1?\'Has \'+(skillNotes.favoredTerrain*2-1)+\' +2 bonuses on Knowledge (Geography), Perception, Stealth, and Survival distributed among %V terrain types and and leaves no trail in those terrains\':\'+2 Knowledge (Geography), Perception, Stealth, and survival in a chosen terrain type and leaves no tracks in that terrain\'}"',
  'Hide In Plain Sight':
    'Section=skill Note="Can Stealth %V even when observed"',
  "Hunter's Bond":'Section=feature Note="1 selection"',
  // Improved Evasion as above
  'Improved Quarry':
    'Section=combat,skill ' +
    'Note=' +
      '"Has increased Quarry effects",' +
      '"Has increased Quarry effects"',
  'Master Hunter':
    'Section=combat,skill ' +
    'Note=' +
      '"Full attack vs. a favored enemy kills or inflicts nonlethal HP equal to the target\'s current hit points (save Fortitude DC %{10+levels.Ranger//2+wisdomModifier} negates) once per day per favored enemy type",' +
      '"Can take 20 when tracking at full Speed"',
  'Quarry':
    'Section=combat,skill ' +
    'Note=' +
      '"Can use a %{combatNotes.improvedQuarry?\'free\':\'standard\'} action to gain +%{combatNotes.improvedQuarry?4:2} attacks and automatically confirm crit threats vs. a chosen favored enemy target once per %{combatNotes.improvedQuarry?\'10 min\':\'24 hr\'}",' +
      '"Can take %{combatNotes.improvedQuarry?20:10} to track quarry at full Speed"',
  'Swift Tracker':SRD35.FEATURES['Swift Tracker'],
  'Track':'Section=skill Note="+%V Survival to follow creatures\' trails"',
  // Wild Empathy as above
  // Woodland Stride as above

  // Rogue
  'Advanced Talents':
    'Section=feature Note="Has additional Rogue Talent choices"',
  'Bleeding Attack':
    'Section=combat ' +
    'Note="Sneak Attack inflicts %{combatNotes.sneakAttack} HP bleed each rd; magical healing or a DC 15 Heal ends"',
  'Feat (Rogue)':'Section=feature Note="+1 General Feat"',
  'Combat Trick':'Section=feature Note="+1 Fighter Feat"',
  'Crippling Strike':SRD35.FEATURES['Crippling Strike'],
  'Defensive Roll':SRD35.FEATURES['Defensive Roll'],
  'Dispelling Attack':
    'Section=magic ' +
    'Note="Sneak Attack acts as <i>Dispel Magic</i> vs. the lowest-level spell affecting the target" ' +
    'Spells="Dispel Magic" ' +
    'SpellAbility=Charisma',
  // Evasion as above
  'Fast Stealth':
    'Section=skill Note="Can use Stealth at full Speed without penalty"',
  'Finesse Rogue':'Section=feature Note="Has the Weapon Finesse feature"',
  // Improved Evasion as above
  // Improved Uncanny Dodge as above
  'Ledge Walker':
    'Section=skill ' +
    'Note="Can use Acrobatics along narrow surfaces at full Speed and is not flat-footed when on one"',
  'Minor Magic':
    'Section=magic Note="Can cast a chosen Rogue0 spell 3 times per day"',
  'Major Magic':
    'Section=magic Note="Can cast a chosen Rogue1 spell 2 times per day"',
  'Master Strike':
    'Section=combat ' +
    'Note="Sneak Attack inflicts a choice of sleep for 1d4 hr, paralysis for 2d6 rd, or death (save Fortitude DC %{10+levels.Rogue//2+intelligenceModifier} negates)"',
  'Opportunist':SRD35.FEATURES.Opportunist,
  'Quick Disable':
    'Section=skill Note="Can use Disable Device in half the normal time"',
  'Resiliency':
    'Section=combat ' +
    'Note="Can gain %{(rogueFeatures.Resiliency?levels.Rogue:0)+(shadowdancerFeatures.Resiliency?levels.Shadowdancer:0)} temporary hit points for 1 min when taken to negative hit points once per day"',
  'Rogue Crawl':
    'Section=ability ' +
    'Note="Has a %{speed//2}\' crawl Speed and can take a 5\' Step while crawling"',
  'Rogue Talents':
    'Section=feature ' +
    'Note="%V selection%{featureNotes.rogueTalents>1?\'s\':\'\'}"',
  'Skill Mastery':SRD35.FEATURES['Skill Mastery'],
  'Slippery Mind':SRD35.FEATURES['Slippery Mind'],
  'Slow Reactions':
    'Section=combat ' +
    'Note="Successful Sneak Attack prevents the target from taking AOO for 1 rd"',
  'Sneak Attack':
    'Section=combat ' +
    'Note="Melee hit or ranged hit within 30\' inflicts +%Vd6 HP when the target is flanked or denied its Dexterity bonus"',
  'Stand Up':'Section=combat Note="Can stand from prone as free action"',
  'Surprise Attack':
    'Section=combat ' +
    'Note="Treats all foes as flat-footed during the surprise rd"',
  // Trap Sense as above
  'Trap Spotter':
    'Section=skill ' +
    'Note="Makes an automatic Perception check when within 10\' of a trap"',
  'Trapfinding':
    'Section=skill ' +
    'Note="+%V Perception to locate traps and Disable Device to disarm them"',
  // Uncanny Dodge as above
  'Weapon Training (Rogue)':
    'Section=feature Note="+1 Fighter Feat (Weapon Focus)"',

  // Sorcerer
  'Bloodline':'Section=feature Note="1 selection"',
  // Cantrips as above
  // Aberrant
  'Aberrant Form':
    'Section=combat,combat,skill ' +
    'Note=' +
      '"Has DR 5/-",' +
      '"Has immunity to critical hits and Sneak Attacks",' +
      '"Has the Blindsight feature"',
  'Acidic Ray':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts %{1+levels.Sorcerer//2}d6 HP acid %{charismaModifier+3} times per day"',
  'Alien Resistance':'Section=save Note="Has Spell Resistance %V"',
  'Blindsight':
    'Section=skill Note="R%V\' Can operate effectively without vision"',
  'Bloodline Aberrant':
    'Section=magic,skill '+
    'Note=' +
      '"Increases the duration of Polymorph spells by 50%",' +
      '"Knowledge (Dungeoneering) is a class skill"',
  'Long Limbs':
    'Section=combat ' +
    'Note="Has a +%{levels.Sorcerer<11?5:levels.Sorcerer<17?10:15}\' melee touch attack range"',
  'Unusual Anatomy':
    'Section=combat ' +
    'Note="Has a %{level<13?25:50}% chance to ignore each critical hit and Sneak Attack"',
  // Abyssal
  'Added Summonings':
    'Section=magic ' +
    'Note="<i>Summon Monster</i> brings an additional demon or fiendish creature"',
  'Bloodline Abyssal':
    'Section=magic,skill ' +
    'Note=' +
      '"Summoned creatures gain DR %{levels.Sorcerer//2>?1}/good",' +
      '"Knowledge (Planes) is a class skill"',
  'Claws':
    'Section=combat ' +
    'Note="Can make 2 +%{meleeAttack}%{levels.Sorcerer<5?\'\':\' magical\'} attacks that inflict %V+%{strengthModifier} HP%{levels.Sorcerer>10?\' +1d6 HP \'+(bloodlineEnergy||\'fire\'):\'\'} each for %{charismaModifier+3} rd per day"',
  'Demon Resistances':
    'Section=save,save ' +
      'Note=' +
        '"Has %{!%V?\'immunity\':\'resistance %V\'} to electricity",' +
        '"+%V vs. poison"',
  'Demonic Might':
    'Section=save,skill ' +
    'Note=' +
      '"Has immunity to electricity and poison and resistance 10 to acid, cold, and fire",' +
      '"R60\' Can communicate telepathically with any speaking creature"',
  'Strength Of The Abyss':'Section=ability Note="+%V Strength"',
  // Arcane
  'Arcane Apotheosis':
    'Section=magic ' +
    'Note="Can expend 3 spell slots to power 1 magic item charge"',
  'Arcane Bond':'Section=feature Note="1 selection"',
  'Bloodline Arcane':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 metamagicked spell DC",' +
      '"Choice of Knowledge is a class skill"',
  'Bonded Object':
    'Section=magic Note="Can cast a known spell through a chosen object"',
  'Familiar':
    'Section=companion ' +
    'Note="Can bond with a magical creature with expanded abilities"',
  'Metamagic Adept':
    'Section=magic ' +
    'Note="Can apply a metamagic feat to a spell without increasing its casting time%{levels.Sorcerer<20?(levels.Sorcerer+1)//4+\' times per day\':\'\'}"',
  'New Arcana':'Section=magic Note="+%V spells available"',
  'School Power':'Section=magic Note="+2 DC on spells from a choice of school"',
  // Celestial
  'Ascension':
    'Section=save,save,skill ' +
    'Note=' +
      '"Has immunity to acid, cold, and petrification and resistance 10 to electricity and fire",' +
      '"+4 vs. poison",' +
      '"Can communicate with any speaking creature"',
  'Bloodline Celestial':
    'Section=magic,skill ' +
    'Note=' +
      '"Summoned creatures gain DR %{levels.Sorcerer//2>?1}/evil",' +
      '"Heal is a class skill"',
  'Celestial Resistances':
    'Section=save Note="Has resistance %V to acid and cold"',
  'Conviction':
    'Section=feature ' +
    'Note="Can reroll an ability check, attack, skill check, or save once per day"',
  'Heavenly Fire':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d4+%{levels.Sorcerer//2} HP on an evil target or restores the same amount to a good one %{charismaModifier+3} times per day"',
  'Wings Of Heaven':
    'Section=ability ' +
    // TODO: include maneuverability?
    'Note="%{levels.Sorcerer>19?\\"Has a 60\' fly Speed\\":\\"Can gain a 60\' fly Speed for \\"+levels.Sorcerer+\' min per day\'}"',
  // Destined
  'Bloodline Destined':
    'Section=save,skill ' +
    'Note=' +
      '"Casting a personal spell gives +spell level on saves for 1 rd",' +
      '"Knowledge (History) is a class skill"',
  'Destiny Realized':
    'Section=combat,magic ' +
    'Note=' +
      '"Automatically confirms spell crit threats; foe crit threats require a natural 20 to confirm",' +
      '"Can automatically overcome spell resistance once per day"',
  'Fated':
    'Section=combat,save ' +
    'Note=' +
      '"+%{(levels.Sorcerer+1)//4} Armor Class when surprised",' +
      '"+%{(levels.Sorcerer+1)//4} saves when surprised"',
  'It Was Meant To Be':
    'Section=feature ' +
    'Note="Can reroll an attack, crit confirmation, or check to overcome spell resistance %{levels.Sorcerer<17?\'once\':\'2 times\'} per day"',
  'Touch Of Destiny':
    'Section=combat ' +
    'Note="Touch gives +%{levels.Sorcerer//2>?1} attacks, skill checks, ability checks, and saves for 1 rd %{charismaModifier+3} times per day"',
  'Within Reach':
    'Section=save ' +
    'Note="Taking fatal damage allows a DC 20 Will save that results in -1 hit point and stable once per day"',
  // Draconic
  'Blindsense':SRD35.FEATURES['Blindsense'],
  'Bloodline Draconic':
    'Section=magic,skill ' +
    'Note=' +
      '"Spells with the %{bloodlineEnergy} descriptor inflict +1 HP per die",' +
      '"Perception is a class skill"',
  'Breath Weapon':
    'Section=combat ' +
    'Note="%{bloodlineShape} inflicts %{levels.Sorcerer}d6 HP %{bloodlineEnergy} (save Reflex DC %{10+levels.Sorcerer//2+charismaModifier} half) %{%V>1?%V+\' times\':\'once\'} per day"',
  'Dragon Resistances':
    'Section=combat,save ' +
    'Note=' +
      '"+%V natural armor bonus to Armor Class",' +
      '"Has resistance %V to %{bloodlineEnergy}"',
  'Power Of Wyrms':
    'Section=save,skill ' +
    'Note=' +
      '"Has immunity to paralysis and sleep",' +
      '"Has the Blindsense feature"',
  'Wings':'Section=ability Note="Has a %V\' fly Speed"',
  // Elemental
  'Bloodline Elemental':
    'Section=magic,skill ' +
    'Note=' +
      '"Can change a spell\'s energy type to %{bloodlineEnergy}",' +
      '"Knowledge (Planes) is a class skill"',
  'Elemental Blast':
    'Section=combat ' +
    'Note="R60\' 20\' radius inflicts %{levels.Sorcerer}d6 HP %{bloodlineEnergy} and vulnerability to %{bloodlineEnergy} until the end of the next turn (save Reflex DC %{10+levels.Sorcerer//20+charismaModifier} half HP only) %{levels.Sorcerer<17?\'once\':levels.Sorcerer<20?\'2 times\':\'3 times\'} per day"',
  'Elemental Body':
    'Section=combat,save ' +
    'Note=' +
      '"Has immunity to critical hits and Sneak Attacks",' +
      '"Has immunity to %{bloodlineEnergy}"',
  'Elemental Movement (Air)':'Section=ability Note="Has a 60\' fly Speed"',
  'Elemental Movement (Earth)':'Section=ability Note="Has a 30\' burrow Speed"',
  'Elemental Movement (Fire)':'Section=ability Note="+30 Speed"',
  'Elemental Movement (Water)':'Section=ability Note="Has a 60\' swim Speed"',
  'Elemental Ray':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d6+%{levels.Sorcerer//2} HP %{bloodlineEnergy} %{charismaModifier+3} times per day"',
  'Elemental Resistance':
    'Section=save Note="Has resistance %V to %{bloodlineEnergy}"',
  // Fey
  'Bloodline Fey':
    'Section=magic,skill ' +
    'Note=' +
      '"+2 compulsion spell DC",' +
      '"Knowledge (Nature) is a class skill"',
  'Fleeting Glance':
    'Section=magic ' +
    'Note="Can use <i>Greater Invisibility</i> effects on self for %{levels.Sorcerer} rd per day" ' +
    'Spells="Greater Invisibility" ' +
    'SpellAbility=Charisma',
  'Fey Magic':
    'Section=magic Note="Can reroll checks to overcome spell resistance"',
  'Laughing Touch':
    'Section=combat ' +
    'Note="Touch inflicts laughter for 1 rd, preventing attacks, %{charismaModifier+3} times per day; a creature can ony be affected once per 24 hr"',
  'Soul Of The Fey':
    'Section=combat,combat,magic,save ' +
    'Note=' +
      '"Has DR 10/cold iron",' +
      '"Animals attack self only if magically compelled",' +
      '"Can use <i>Shadow Walk</i> effects once per day",' +
      '"Has immunity to poison"',
  // Woodland Stride as above
  // Infernal
  'Bloodline Infernal':
    'Section=magic,skill ' +
    'Note=' +
      '"+2 charm spell DC",' +
      '"Diplomacy is a class skill"',
  'Corrupting Touch':
    'Section=combat ' +
    'Note="Touch inflicts shaken for %{levels.Sorcerer//2>?1} rd %{charismaModifier+3} times per day"',
  'Hellfire':
    'Section=combat ' +
    'Note="R60\' 10\' radius inflicts %{levels.Sorcerer}d6 HP fire and shakes good creatures for %{levels.Sorcerer} rd (save Reflex DC %{10+levels.Sorcerer//2+charismaModifier} half HP ony) %{levels.Sorcerer<17?\'once\':levels.Sorcerer<20?\'2 times\':\'3 times\'} per day"',
  'Infernal Resistances':
    'Section=save,save ' +
    'Note=' +
      '"Has resistance %V to fire",' +
      '"+%{levels.Sorcerer<9?2:4} vs. poison"',
  'On Dark Wings':'Section=ability Note="Has a 60\' fly Speed"',
  'Power Of The Pit':
    'Section=save,skill ' +
    'Note=' +
      '"Has resistance 10 to acid and cold and immunity to fire and poison",' +
      '"R60\' Has full vision in complete darkness, including magical darkness"',
  // Undead
  'Bloodline Undead':
    'Section=magic,skill ' +
    'Note=' +
      '"Mind-affecting spells affect corporeal undead that were once humanoids",' +
      '"Knowledge (Religion) is a class skill"',
  "Death's Gift":
    'Section=save,save ' +
    'Note=' +
      '"Has resistance %V to cold",' +
      '"Has DR %{levels.Sorcerer<10?5:10}/- vs. nonlethal"',
  'Grasp Of The Dead':
    'Section=combat ' +
    'Note="R60\' 20\' radius inflicts %{levels.Sorcerer}d6 HP slashing and grappled (save Reflex DC %{10+levels.Sorcerer//2+charismaModifier} half HP only) for 1 rd %{levels.Sorcerer<17?1:levels.Sorcerer<20?2:3} times per day"',
  'Grave Touch (Undead)':
    'Section=combat ' +
    'Note="Touch inflicts shaken on living creatures for %{levels.Sorcerer//2>?1} rd%{levels.Sorcerer>1?\' and frightens already-shaken creatures with up to \'+(levels.Sorcerer-1)+\' HD for 1 rd\':\'\'} %{charismaModifier+3} times per day"',
  'Incorporeal Form':
    'Section=magic ' +
    'Note="Can become incorporeal for %{levels.Sorcerer} rd once per day"',
  'Magic Claws':'Section=combat Note="Claws are magical weapons"',
  'One Of Us':
    'Section=combat,feature,save,save ' +
    'Note=' +
      '"Has DR 5/-",' +
      '"Ignored by unintelligent undead",' +
      '"Has immunity to paralysis, sleep, cold, and nonlethal",' +
      '"+4 vs. spells and spell-like abilities cast by undead"',

  // Wizard
  // Arcane Bond as above
  // Bonded Object as above
  'Bonus Feats (Wizard)':SRD35.FEATURES['Bonus Feats (Wizard)'],
  // Cantrips as above
  // Familiar as above
  'School Opposition (%school)':
    'Section=magic Note="Casting %school spells requires two spell slots each"',
  'School Specialization':SRD35.FEATURES['School Specialization'],
  'School Specialization (%school)':
    'Section=magic Note="+1 %school spell slot in each spell level"',
  // Abjuration
  'Energy Absorption':
    'Section=save ' +
    'Note="Ignores %{levels.Wizard*3} HP of energy damage per day"',
  'Protective Ward':
    'Section=combat ' +
    'Note="R10\' Can give allies a +%{levels.Wizard//5+1} deflection bonus to Armor Class for %{intelligenceModifier} rd %{intelligenceModifier+3} times per day"',
  'Resistance':
    'Section=save ' +
    'Note="Gains %{levels.Wizard<11?\'resistance 5\':levels.Wizard<20?\'resistance 10\':\'immunity\'} to a chosen energy type each day"',
  // Conjuration
  'Acid Dart (Conjuration)':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d6+%{levels.Wizard//2} HP acid %{intelligenceModifier+3} times per day"',
  'Dimensional Steps':
    'Section=magic Note="Can teleport %{levels.Wizard*30}\' per day"',
  "Summoner's Charm":
    'Section=magic ' +
    'Note="Increases the duration of summoning spells by %{levels.Wizard//2>?1} rd%{levels.Wizard>19?\' and can make permanent 1 <i>Summon Monster</i> spell at a time\':\'\'}"',
  // Divination
  "Diviner's Fortune":
    'Section=combat ' +
    'Note="Touch gives +%{levels.Wizard//2>?1} attacks, skill checks, ability checks, and saves for 1 rd %{intelligenceModifier+3} times per day"',
  'Forewarned':
    'Section=combat,combat ' +
    'Note=' +
      '"+%V Initiative",' +
      '"Can always act during the surprise rd%{levels.Wizard>19?\'/Can take 20 on Initiative\':\'\'}"',
  'Scrying Adept':
    'Section=magic ' +
    'Note="Has continuous <i>Detect Scrying</i> effects/Gains +1 familiarity step when scrying" ' +
    'Spells="Detect Scrying" ' +
    'SpellAbility=Charisma',
  // Enchantment
  'Aura Of Despair':
    'Section=combat ' +
    'Note="R30\' Foes suffer -2 ability checks, attacks, damage, saves, and skill checks for %{levels.Wizard} rd per day"',
  'Dazing Touch (Enchantment)':
    'Section=combat ' +
    'Note="Touch dazes a foe with up to %{casterLevels.Wizard} HD for 1 rd %{intelligenceModifier+3} times per day"',
  'Enchanting Smile':
    'Section=save,skill ' +
    'Note=' +
      '"Successful saves reflect enchantment spells onto the caster",' +
      '"+%V Bluff/+%V Diplomacy/+%V Intimidate"',
  // Evocation
  'Elemental Wall':
    'Section=magic ' +
    'Note="Can use <i>Wall Of Fire</i> effects to inflict acid, cold, electricity, or fire damage for %{levels.Wizard} rd per day" ' +
    'Spells="Wall Of Fire" ' +
    'SpellAbility=Charisma',
  'Force Missile':
    'Section=combat ' +
    'Note="Missile automatically hits, inflicting 1d4+%{levels.Wizard//2>?1} HP force, %{intelligenceModifier+3} times per day"',
  'Intense Spells':
    'Section=magic ' +
    'Note="Evocation spells inflict +%{levels.Wizard//2>?1} HP%{levels.Wizard>19?\' and can use the better of 2 rolls to overcome SR\':\'\'}"',
  // Illusion
  'Blinding Ray':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack blinds a target with up to %{levels.Wizard} HD or dazzles a target with more for 1 rd %{intelligenceModifier+3} times per day"',
  'Extended Illusions':
    'Section=magic ' +
    'Note="Increases the duration of Illusion spells by %{levels.Wizard//2} rd%{levels.Wizard>19?\' and can make permanent 1 Illusion spell at a time\':\'\'}"',
  'Invisibility Field':
    'Section=magic ' +
    'Note="Can use swift actions to invoke <i>Greater Invisibility</i> effects on self for %{levels.Wizard} rd per day" ' +
    'Spells="Greater Invisibility" ' +
    'SpellAbility=Charisma',
  // Necromancy
  'Grave Touch (Necromancy)':
    'Section=combat ' +
    'Note="Touch inflicts shaken on living creatures for %{levels.Wizard//2>?1} rd%{levels.Wizard>1?\' and frightens already-shaken creatures with up to \'+(levels.Wizard-1)+\' HD for 1 rd\':\'\'} %{intelligenceModifier+3} times per day"',
  'Life Sight':
    'Section=skill ' +
    'Note="R%{(levels.Wizard-4)//4*10}\' Can locate unseen living and undead creatures for %{levels.Wizard} rd per day"',
  'Power Over Undead':
    'Section=combat,feature ' +
    'Note=' +
      '"Can use chosen Power Over Undead feat %{3+intelligenceModifier} times per day",' +
      '"+1 General Feat (Command Undead or Turn Undead)"',
  // Transmutation
  'Change Shape':
    'Section=magic ' +
    'Note="Can use <i>Beast Shape II%{levels.Wizard<12?\'\':\'I\'}</i> or <i>Elemental Body I%{levels.Wizard<12?\'\':\'I\'}</i> effects for %{levels.Wizard} rd per day" ' +
    'Spells=' +
      '"Beast Shape II","Elemental Body I",' +
      '"12:Beast Shape III","12:Elemental Body II" ' +
    'SpellAbility=Charisma',
  'Physical Enhancement':
    'Section=ability ' +
    'Note="Gains +%{levels.Wizard//5+1} to %{levels.Wizard>19?\'2 choices\':\'a choice\'} of Strength, Dexterity, and Constitution each day"',
  'Telekinetic Fist':
    'Section=combat ' +
    'Note="R30\' Ranged touch attack inflicts 1d4+%{levels.Wizard//2} HP bludgeoning %{intelligenceModifier+3} times per day"',
  // Universalist
  'Hand Of The Apprentice':
    'Section=combat ' +
    'Note="R30\' Can make a +%{rangedAttack-dexterityModifier+intelligenceModifier} ranged attack with a melee weapon %{intelligenceModifier+3} times per day"',
  'Metamagic Mastery':
    'Section=magic ' +
    'Note="Can apply a metamagic feat to a spell without changing its level or casting time %{levels.Wizard>9?(levels.Wizard-6)//2+\' times\':\'once\'} per day; applying a metamagic feat that normally adds multiple levels to the spell expends additional uses"',

  // Adept
  'Summon Familiar':'Section=companion Note="Has the Familiar feature"',

  // Expert
  'Expert Skills':SRD35.FEATURES['Expert Skills'],

  // Arcane Archer
  'Arcane Caster Level Bonus':SRD35.FEATURES['Arcane Caster Level Bonus'],
  'Arrow Of Death':
    SRD35.FEATURES['Arrow Of Death']
    .replace('20', '%{20+charismaModifier}'),
  'Enhance Arrows (Aligned)':
    'Section=combat ' +
    'Note="Arrows fired by self gain a choice of <i>anarchic</i>, <i>axiomatic</i>, <i>holy</i>, or <i>unholy</i> each day"',
  'Enhance Arrows (Distance)':
    'Section=combat Note="Arrows fired by self have x2 range"',
  'Enhance Arrows (Elemental)':
    'Section=combat Note="Arrows fired by self gain a choice of %V each day"',
  'Enhance Arrows (Magic)':
    'Section=combat Note="Arrows fired by self have a +1 enhancement bonus"',
  'Hail Of Arrows':SRD35.FEATURES['Hail Of Arrows'],
  'Imbue Arrow':SRD35.FEATURES['Imbue Arrow'],
  'Phase Arrow':
    SRD35.FEATURES['Phase Arrow']
    .replace(' once ', " %{$$'levels.Arcane Archer'>7?($$'levels.Arcane Archer'-4)//2+' times ':' once '}"),
  'Seeker Arrow':
    SRD35.FEATURES['Seeker Arrow']
    .replace(' once ', " %{$$'levels.Arcane Archer'>5?($$'levels.Arcane Archer'-2)//2+' times ':' once '}"),

  // Arcane Trickster
  // Arcane Caster Level Bonus as above
  'Impromptu Sneak Attack':SRD35.FEATURES['Impromptu Sneak Attack'],
  'Invisible Thief':
    'Section=magic ' +
    'Note="Can use <i>Greater Invisibility</i> effects on self for %{$\'levels.Arcane Trickster\'} rd per day" ' +
    'Spells="Greater Invisibility" ' +
    'SpellAbility=Charisma',
  'Ranged Legerdemain':
    'Section=skill ' +
    'Note="Can use Disable Device and Sleight Of Hand at a range of 30\', increasing the DC by 5"',
  // Sneak Attack as above
  'Surprise Spells':
    'Section=magic ' +
    'Note="Spells that inflict HP damage also inflict Sneak Attack damage vs. flat-footed foes"',
  'Tricky Spells':
    'Section=magic ' +
    'Note="Can cast a spell without somatic or verbal components %{($\'levels.Arcane Trickster\'+1)//2} times per day"',

  // Assassin
  'Angel Of Death':
    'Section=combat ' +
    'Note="Successful Death Attack disintegrates the victim, preventing use of <i>Raise Dead</i> and <i>Resurrection</i>, once per day"',
  'Death Attack':SRD35.FEATURES['Death Attack'],
  // Hide In Plain Sight as above
  'Hidden Weapons':
    'Section=skill Note="+%{levels.Assassin} Sleight Of Hand to hide weapons"',
  // Improved Uncanny Dodge as above
  'Poison Use':SRD35.FEATURES['Poison Use'],
  'Quiet Death':
    'Section=combat ' +
    'Note="Successful Stealth vs. Perception during a surprise rd allows performing a Death Attack without being noticed"',
  'Save Bonus Against Poison':SRD35.FEATURES['Save Bonus Against Poison'],
  // Sneak Attack as above
  'Swift Death':
    'Section=combat ' +
    'Note="Can make a Death Attack without prior study once per day"',
  'True Death':
    'Section=combat ' +
    'Note="Raising a Death Attack victim requires a successful DC %{10+levels.Assassin} <i>Remove Curse</i> or DC %{15+levels.Assassin} caster level check"',
  // Uncanny Dodge as above

  // Dragon Disciple
  'Ability Boost':SRD35.FEATURES['Ability Boost'],
  // Arcane Caster Level Bonus as above
  // Blindsense as above
  'Blood Of Dragons':
    'Section=feature ' +
    'Note="Dragon Disciple level triggers Bloodline features"',
  'Bloodline Feat':'Section=feature Note="+%V Bloodline Draconic feats"',
  // Breath Weapon as above
  'Dragon Bite':
    'Section=combat ' +
    'Note="Bite attack inflicts 1d%{features.Small?4:features.Large?8:6}+%{strengthModifier*1.5//1}%{$\'levels.Dragon Disciple\'>5?\' plus 1d6 \'+bloodlineEnergy:\'\'} when using Claws"',
  'Dragon Form':
    'Section=magic ' +
    'Note="Can use <i>Form Of The Dragon I%{$\'levels.Dragon Disciple\'<10?\'\':\'I\'}</i> effects %{$\'levels.Dragon Disciple\'<10?\'once\':\'2 times\'} per day" ' +
    'Spells="Form Of The Dragon I","10:Form Of The Dragon II" ' +
    'SpellAbility=Charisma',
  'Natural Armor Increase':SRD35.FEATURES['Natural Armor Increase'],
  // Wings as above

  // Duelist
  'Acrobatic Charge':SRD35.FEATURES['Acrobatic Charge'],
  'Canny Defense':
    SRD35.FEATURES['Canny Defense']
    .replace('Dexterity', 'dodge')
    .replace('unarmored', 'wearing light or no armor'),
  'Crippling Critical (Duelist)':
    'Section=combat ' +
    'Note="Critical hits with a light or one-handed piercing weapon also inflict a choice of -10 Speed for 1 min, 1d4 points of Strength or Dexterity damage, -4 saves for 1 min, -4 Armor Class for 1 min, or 2d6 HP bleed each rd until ended by magical healing or a DC 15 Heal"',
  // Note change in name from SRD35
  'Elaborate Defense':
    SRD35.FEATURES['Elaborate Parry']
    .replace('levels.Duelist', 'levels.Duelist//3'),
  'Elaborate Parry':
    'Section=combat ' +
    'Note="+%{levels.Duelist} dodge bonus to Armor Class when fighting defensively"',
  'Enhanced Mobility':
    SRD35.FEATURES['Enhanced Mobility']
    .replace('unarmored', 'wearing light or no armor'),
  'Grace':
    SRD35.FEATURES.Grace
    .replace('unarmored', 'wearing light or no armor'),
  'Improved Reaction':SRD35.FEATURES['Improved Reaction'],
  'No Retreat':
    'Section=combat ' +
    'Note="Can take an AOO when an adjacent foe takes a withdraw action"',
  'Parry':
    'Section=combat ' +
    'Note="During a full attack action with a light or one-handed piercing weapon, can dedicate 1 attack roll to negate a foe attack on self or an adjacent ally; requires rolling higher than the foe, and attacks by larger foes or on an adjacent ally each incur a -4 penalty"',
  'Precise Strike (Duelist)':
    SRD35.FEATURES['Precise Strike']
    .replace('{levels.Duelist//5}d6', '{levels.Duelist}'),
  'Riposte':'Section=combat Note="Can take an AOO after a successful Parry"',

  // Eldritch Knight
  // Arcane Caster Level Bonus as above
  'Bonus Feat (Eldritch Knight)':
    'Section=feature ' +
    'Note="+%V Fighter Feat%{$\'featureNotes.bonusFeat(EldritchKnight)\'>1?\'s\':\'\'}"',
  'Diverse Training':
    'Section=feature ' +
    'Note="+%{$\'levels.Eldritch Knight\'} level for Fighter and arcane feat prerequisites"',
  'Spell Critical':
    'Section=magic ' +
    'Note="Can use a swift action immediately following a critical hit to cast a spell that affects the target"',

  // Loremaster
  'Applicable Knowledge':SRD35.FEATURES['Applicable Knowledge'],
  'Bonus Languages':SRD35.FEATURES['Bonus Languages'],
  'Caster Level Bonus':SRD35.FEATURES['Caster Level Bonus'],
  'Dodge Trick':SRD35.FEATURES['Dodge Trick'],
  'Greater Lore':
    'Section=skill Note="+10 Spellcraft to identify magic item properties"',
  'Instant Mastery':SRD35.FEATURES['Instant Mastery'],
  'Lore':
    'Section=skill,skill ' +
    'Note=' +
      '"+%V all Knowledge",' +
      '"Can use any Knowledge untrained"',
  'More Newfound Arcana':SRD35.FEATURES['More Newfound Arcana'],
  'Newfound Arcana':SRD35.FEATURES['Newfound Arcana'],
  'Secret':SRD35.FEATURES['Secret'],
  'Secret Health':'Section=combat Note="Has the Toughness feature"',
  'Secret Knowledge Of Avoidance':
    SRD35.FEATURES['Secret Knowledge Of Avoidance'],
  'Secrets Of Inner Strength':SRD35.FEATURES['Secrets Of Inner Strength'],
  'The Lore Of True Stamina':SRD35.FEATURES['The Lore Of True Stamina'],
  'True Lore':SRD35.FEATURES['True Lore'],
  'Weapon Trick':SRD35.FEATURES['Weapon Trick'],

  // Mystic Theurge
  'Combined Spells':
    'Section=magic ' +
    'Note="Can prepare spells of up to level %{($\'levels.Mystic Theurge\'+1)//2} in 1 level higher spell slots from a different class"',
  'Divine Caster Level Bonus':SRD35.FEATURES['Divine Caster Level Bonus'],
  'Spell Synthesis':
    'Section=magic ' +
    'Note="Can cast two spells simultaneously with -2 target saves and +2 checks to overcome spell resistance"',

  // Pathfinder Chronicler
  // Bardic Knowledge as above
  // Bardic Performance as above
  'Call Down The Legends':
    'Section=magic ' +
    'Note="Can summon 2d4 level 4 construct barbarians once per week"',
  'Deep Pockets':
    'Section=ability,feature,skill ' +
    'Note=' +
      '"+4 Strength for light load determination",' +
      '"Can retrieve any small object from backpack as a full-round action",' +
      '"+4 Sleight Of Hand to conceal small objects"',
  'Epic Tales':
    'Section=skill ' +
    'Note="Can spend 1 hr and expend any number of Bardic Performance rd, using Profession (Scribe) in place of Perform for any checks, to create a text that evokes a Bardic Performance effect on the first reader within %{$\'levels.Pathfinder Chronicler\'} days; the effect has a duration equal to half the number of Bardic Performance rd expended"',
  'Greater Epic Tales':
    'Section=skill ' +
    'Note="Allows an Epic Tales text to be read aloud, evoking its Bardic Performance effect on those targeted by the reader"',
  'Improved Aid':'Section=combat Note="Using Aid Another gives a +4 bonus"',
  'Inspire Action':
    'Section=skill ' +
    'Note="Can use Bardic Performance to give an ally an extra move%{$\'levels.Pathfinder Chronicler\'>8?\' or standard\':\'\'} action"',
  'Lay Of The Exalted Dead':
    'Section=magic ' +
    'Note="Can summon d4+1 level 5 incorporeal construct barbarians, wearing +2 studded leather armor and wielding +1 <i>ghost touch</i> greataxes, once per week; their appearance inflicts shaken on foes (save Will DC %{15+charismaModifier} negates) for 1 rd per barbarian"',
  'Live To Tell The Tale':
    'Section=save ' +
    'Note="Can attempt another save on the round after a failure %{$\'levels.Pathfinder Chronicler\'>3?$\'levels.Pathfinder Chronicler\'//2+\' times\':\'once\'} per day"',
  'Master Scribe':
    'Section=skill,skill ' +
    'Note=' +
      '"+%V Linguistics/+%V Profession (Scribe)",' +
      '"+%{$\'levels.Pathfinder Chronicler\'} Use Magic Device involving scrolls and magical writing/Can take 10 on Linguistics and Profession (Scribe) checks when distracted"',
  'Pathfinding':
    'Section=save,skill ' +
    'Note=' +
      '"+5 to escape a <i>Maze</i>",' +
      '"+5 Survival to avoid becoming lost/Can treat trackless terrain as a road, and a DC 15 Survival check extends this benefit to %{$\'levels.Pathfinder Chronicler\'} companions"',
  'Whispering Campaign':
    'Section=magic ' +
    'Note="Can use <i>Doom</i> and <i>Enthrall</i> effects via Bardic Performance to change listeners\' perception of a target" ' +
    'Spells="Doom","Enthrall" ' +
    'SpellAbility=Charisma',

  // Shadowdancer
  // Darkvision as above
  // Defensive Roll as above
  // Evasion as above
  // Hide In Plain Sight as above
  // Improved Evasion as above
  // Improved Uncanny Dodge as above
  'Rogue Talents (Shadowdancer)':'Section=feature Note="%V selections"',
  'Shadow Call':
    'Section=magic ' +
    'Note="Can use <i>%{levels.Shadowdancer<10?\'\':\'Greater \'}Shadow Conjuration</i> effects %{levels.Shadowdancer>5?(levels.Shadowdancer-2)//2+\' times\':\'once\'} per day" ' +
    'Spells="Shadow Conjuration","Greater Shadow Conjuration" ' +
    'SpellAbility=Charisma',
  'Shadow Illusion':
    SRD35.FEATURES['Shadow Illusion']
    .replace(' once ', " %{levels.Shadowdancer>3?levels.Shadowdancer//2+' times ':' once '}"),
  'Shadow Jump':SRD35.FEATURES['Shadow Jump'],
  'Shadow Master':
    'Section=combat,save ' +
    'Note=' +
      '"Has DR 10/- in dim light, and critical hits in dim light inflict blinded for d6 rd",' +
      '"+2 saves in dim light"',
  'Shadow Power':
    'Section=magic ' +
    'Note="Can use <i>Shadow Evocation</i> effects %{levels.Shadowdancer<10?\'once\':\'2 times\'} per day" ' +
    'Spells="Shadow Evocation" ' +
    'SpellAbility=Charisma',
  // Slippery Mind as above
  'Summon Shadow':
    'Section=magic ' +
    'Note="Can summon an unturnable Shadow companion with %{hitPoints//2} hit points that uses self BAB and saves and gains +4 Will vs. channeled energy; its destruction inflicts a permanent negative level (save Fortitude DC 15 negates) and prevents replacement for 30 days"',
  // Uncanny Dodge as above

  // Feats
  'Acrobatic':'Section=skill Note="+%V Acrobatics/+%1 Fly"',
  'Acrobatic Steps':
    'Section=ability ' +
    'Note="Can move normally through difficult terrain 20\' per rd"',
  'Agile Maneuvers':'Section=combat Note="+%V CMB"',
  'Alertness':'Section=skill Note="+%V Perception/+%1 Sense Motive"',
  'Alignment Channel (Chaos)':
    'Section=combat ' +
    'Note="Can use Channel Energy to heal or harm chaotic outsiders"',
  'Alignment Channel (Evil)':
    'Section=combat ' +
    'Note="Can use Channel Energy to heal or harm evil outsiders"',
  'Alignment Channel (Good)':
    'Section=combat ' +
    'Note="Can use Channel Energy to heal or harm good outsiders"',
  'Alignment Channel (Law)':
    'Section=combat ' +
    'Note="Can use Channel Energy to heal or harm lawful outsiders"',
  'Animal Affinity':'Section=skill Note="+%V Handle Animal/+%1 Ride"',
  'Arcane Armor Mastery':
    'Section=magic ' +
    'Note="Can use a swift action to reduce the armored casting penalty by 20%"',
  'Arcane Armor Training':
    'Section=magic ' +
    'Note="Can use a swift action to reduce the armored casting penalty by 10%"',
  'Arcane Strike':
    'Section=combat ' +
    'Note="Can use a swift action to make weapons magic with a +%V damage bonus for 1 rd"',
  // Heavy, Light, and Medium Armor Proficiency have no note
  'Athletic':'Section=skill Note="+%V Climb/+%1 Swim"',
  'Augment Summoning':SRD35.FEATURES['Augment Summoning'],
  'Bleeding Critical':
    'Section=combat ' +
    'Note="Critical hits inflict 2d6 HP bleed each rd; magical healing or a DC 15 Heal ends"',
  'Blind-Fight':
    'Section=combat,skill ' +
    'Note=' +
      '"Can reroll misses due to concealment/Invisible foes gain no melee bonus",' +
      '"Requires no Acrobatics check to move full Speed when blinded"',
  'Blinding Critical':
    'Section=combat ' +
    'Note="Critical hits inflict permanent blindness (save Fortitude DC %{10+baseAttack} inflicts dazzled for 1d4 rd)"',
  'Brew Potion':SRD35.FEATURES['Brew Potion'],
  'Catch Off-Guard':
    'Section=combat ' +
    'Note="Using an improvised melee weapon inflicts no penalty and makes unarmed foes flat-footed"',
  'Channel Smite':
    'Section=combat ' +
    'Note="Can use a swift action before a melee attack to add Channel Energy to its damage"',
  'Cleave':
    'Section=combat ' +
    'Note="Can use a full attack to attack two adjacent foes, suffering a -2 penalty to Armor Class until the next turn"',
  'Combat Casting':
    SRD35.FEATURES['Combat Casting']
    .replace(', grappling, or pinned', ' or grappling'),
  'Combat Expertise':
    SRD35.FEATURES['Combat Expertise']
    .replace('baseAttack<?5', '1+baseAttack//4')
    .replace('next action', 'next turn'),
  'Combat Reflexes':SRD35.FEATURES['Combat Reflexes'],
  'Command Undead':
    'Section=combat ' +
    'Note="R30\' Can use Channel Energy to control %{channelLevel} HD of undead (save Will DC %{10+channelLevel//2+charismaModifier} negates)"',
  'Craft Magic Arms And Armor':SRD35.FEATURES['Craft Magic Arms And Armor'],
  'Craft Rod':SRD35.FEATURES['Craft Rod'],
  'Craft Staff':SRD35.FEATURES['Craft Staff'],
  'Craft Wand':SRD35.FEATURES['Craft Wand'],
  'Craft Wondrous Item':SRD35.FEATURES['Craft Wondrous Item'],
  'Critical Focus':'Section=combat Note="+4 to confirm crit threats"',
  'Critical Mastery':
    'Section=combat ' +
    'Note="Can apply the effects of 2 critical feats to critical hits"',
  'Dazzling Display':
    'Section=combat ' +
    'Note="R30\' Can use Intimidate to demoralize foes using a Weapon Focus weapon"',
  'Deadly Aim':
    'Section=combat ' +
    'Note="Can suffer -%{1+baseAttack//4} on ranged attacks to inflict +%{2*(1+baseAttack//4)} HP until the next turn"',
  'Deadly Stroke':
    'Section=combat ' +
    'Note="Attacks using a Greater Weapon Focus weapon against a stunned or flat-footed foe inflict x2 damage and 1 point Constitution bleed"',
  'Deafening Critical':
    'Section=combat ' +
    'Note="Critical hit inflicts permanent deafness (save Fortitude DC %{10+baseAttack{ inflicts deafness for 1 rd)"',
  'Deceitful':'Section=skill Note="+%V Bluff/+%1 Disguise"',
  'Defensive Combat Training':'Section=combat Note="+%V CMD"',
  'Deflect Arrows':SRD35.FEATURES['Deflect Arrows'],
  'Deft Hands':'Section=skill Note="+%V Disable Device/+%1 Sleight Of Hand"',
  'Diehard':SRD35.FEATURES.Diehard,
  'Disruptive':
    'Section=combat ' +
    'Note="Foes within threat area suffer +4 defensive spell DC"',
  'Dodge':SRD35.FEATURES.Dodge,
  'Double Slice':
    'Section=combat Note="Adds full Strength modifier to off-hand damage"',

  // Shared with SRD35
  'Bonus Tricks':SRD35.FEATURES['Bonus Tricks'],
  'Companion Alertness':
    'Section=skill ' +
    'Note="+2 Perception and Sense Motive when companion in reach"',
  'Companion Evasion':
    'Section=companion ' +
    'Note="Successful Reflex saves yield no damage instead of half%{companionNotes.companionImprovedEvasion?\', and failed Reflex saves yield half damage\':\'\'}"',
  'Companion Improved Evasion':
    'Section=companion Note="Has increased Companion Evasion effects"',
  'Damage Reduction':'Section=combat Note="DR %V/-"',
  'Deliver Touch Spells':
    'Section=companion ' +
    'Note="May deliver touch spells if in contact w/master when cast"',
  'Devotion':'Section=companion Note="+4 Will vs. enchantment"',
  'Empathic Link':'Section=companion Note="May share emotions up to 1 mile"',
  'Empower Spell':
    'Section=magic ' +
    'Note="Can use +2 spell slot to increase chosen spell variable effects by 50%"',
  'Endurance':'Section=save Note="+4 extended physical action"',
  'Enlarge Spell':
    'Section=magic Note="May use +1 spell slot to dbl chosen spell range"',
  'Eschew Materials':'Section=magic Note="Can cast spells without materials"',
  'Extend Spell':
    'Section=magic Note="May use +1 spell slot to dbl chosen spell duration"',
  'Familiar Bat':'Section=skill Note="+3 Fly"',
  'Familiar Cat':'Section=skill Note="+3 Stealth"',
  'Familiar Hawk':'Section=skill Note="+3 Spot in bright light"',
  'Familiar Lizard':'Section=skill Note="+3 Climb"',
  'Familiar Owl':'Section=skill Note="+3 Spot in shadows and darkness"',
  'Familiar Rat':'Section=save Note="+2 Fortitude"',
  'Familiar Raven':'Section=skill Note="+3 Appraise"',
  'Familiar Tiny Viper':'Section=skill Note="+3 Bluff"',
  'Familiar Toad':'Section=combat Note="+3 Hit Points"',
  'Familiar Weasel':'Section=save Note="+2 Reflex"',
  'Far Shot':
    'Section=combat Note="Reduces range penalty by 1 per range increment"',
  'Forge Ring':'Section=magic Note="May create and mend magic rings"',
  'Great Cleave':'Section=combat Note="May cleave w/out limit"',
  'Great Fortitude':'Section=save Note="+2 Fortitude"',
  'Greater Spell Focus (%school)':'Section=magic Note="+1 Spell DC (%school)"',
  'Greater Spell Penetration':
    'Section=magic Note="+2 checks to overcome spell resistance"',
  'Greater Two-Weapon Fighting':
    'Section=combat Note="May make third off-hand attack at -10 penalty"',
  'Greater Weapon Focus (%weapon)':
    'Section=combat Note="+1 %weapon Attack Modifier"',
  'Greater Weapon Specialization (%weapon)':
    'Section=combat Note="+2 %weapon Damage Modifier"',
  'Heighten Spell':
    'Section=magic Note="May cast chosen spell at a higher level"',
  'Improved Bull Rush':
    'Section=combat ' +
    'Note="Bull Rush provokes no AOO, gains +2 Bull Rush check and CMD"',
  'Improved Counterspell':
    'Section=magic ' +
    'Note="May counterspell using a higher-level spell from the same school"',
  'Improved Critical (%weapon)':
    'Section=combat Note="x2 %weapon Threat Range"',
  'Improved Disarm':
    'Section=combat ' +
    'Note="Disarm provokes no AOO, gains +2 Disarm check and CMD"',
  'Improved Familiar':'Section=feature Note="Has expanded Familiar choices"',
  'Improved Feint':
    'Section=combat Note="May make Bluff check to Feint as a move action"',
  'Improved Grapple':
    'Section=combat ' +
    'Note="Grapple provokes no AOO, gains +2 Grapple check and CMD"',
  'Improved Initiative':'Section=combat Note="+4 Initiative"',
  'Improved Overrun':
    'Section=combat ' +
    'Note="Overrun provokes no AOO, gains +2 Overrun check and CMD, and foe cannot avoid Overrun"',
  'Improved Precise Shot':
    'Section=combat Note="Foe gains no AC bonus for partial cover"',
  'Improved Shield Bash':
    'Section=combat Note="Suffers no AC penalty when using Shield Bash"',
  'Improved Speed':'Section=companion Note="+10 companion Speed"',
  'Improved Sunder':
    'Section=combat ' +
    'Note="Sunder provokes no AOO, gains +2 Sunder check and CMD"',
  'Improved Trip':
    'Section=combat Note="Trip provokes no AOO, gains +2 Trip check and CMD"',
  'Improved Two-Weapon Fighting':
    'Section=combat Note="Gains second off-hand attack at -5 penalty"',
  'Improved Unarmed Strike':
    'Section=combat ' +
    'Note="Unarmed attack provokes no AOO and may inflict lethal damage"',
  'Improvised Weapon Mastery':
    'Section=combat ' +
    'Note="Suffers no penalty for improvised weapon, gains +1 damage step and crit 19-20/x2 on improvised weapon"',
  'Iron Will':'Section=save Note="+2 Will"',
  'Large':
    'Section=ability,combat,skill ' +
    'Note="x2 Load Max",' +
         '"-1 AC/-1 Melee Attack/-1 Ranged Attack/+1 CMB/+1 CMD",' +
         '"-2 Fly/+4 Intimidate/-4 Stealth"',
  'Leadership':'Section=feature Note="Attracts followers"',
  'Lightning Reflexes':'Section=save Note="+2 Reflex"',
  'Link':
    'Section=skill ' +
    'Note="+4 Handle Animal (companion)/+4 Wild Empathy (companion)"',
  'Magical Aptitude':'Section=skill Note="+%V Spellcraft/+%1 Use Magic Device"',
  'Manyshot':'Section=combat Note="May fire 2 arrows simultaneously"',
  'Maximize Spell':
    'Section=magic ' +
    'Note="May use +3 spell slot to maximize all variable effects on chosen spell"',
  'Mobility':'Section=combat Note="+4 AC vs. movement AOO"',
  'Mounted Archery':
    'Section=combat Note="Suffers half normal mounted ranged weapon penalty"',
  'Mounted Combat':
    'Section=combat ' +
    'Note="Successful Ride skill check (DC foe attack roll) negates mount damage 1/rd"',
  'Multiattack':
    'Section=companion ' +
    'Note="Reduces additional attack penalty to -2 or gives second attack at -5"',
  'Natural Spell':'Section=magic Note="May cast spells during Wild Shape"',
  'Persuasive':'Section=skill Note="+%V Diplomacy/+%1 Intimidate"',
  'Point-Blank Shot':
    'Section=combat Note="+1 ranged attack and damage w/in 30\'"',
  'Power Attack':
    'Section=combat ' +
    'Note="May suffer -%V attack to gain +%1 damage (+%2 when wielding weapon w/two hands)"',
  'Precise Shot':'Section=combat Note="Suffers no penalty on shot into melee"',
  'Quick Draw':'Section=combat Note="May draw a weapon as a free action"',
  'Quicken Spell':
    'Section=magic Note="May use +4 spell slot to cast chosen spell as a free action 1/rd"',
  'Rapid Reload (Hand)':
    'Section=combat Note="May reload a hand crossbow as a free action"',
  'Rapid Reload (Heavy)':
    'Section=combat Note="May reload a heavy crossbow as a move action"',
  'Rapid Reload (Light)':
    'Section=combat Note="May reload a light crossbow as a free action"',
  'Rapid Shot':
    'Section=combat ' +
    'Note="May make normal and extra ranged attacks at a -2 penalty"',
  'Resist Illusion':'Section=save Note="+2 vs. illusions"',
  'Ride-By Attack':
    'Section=combat Note="May move before and after mounted attack w/out AOO"',
  'Run':
    'Section=ability,combat,skill ' +
    'Note="+1 Run Speed Multiplier",' +
         '"Retains Dexterity bonus to AC while running",' +
         '"+4 Acrobatics (running jump)"',
  'Scribe Scroll':SRD35.FEATURES['Scribe Scroll'],
  'Scry On Familiar':'Section=companion Note="Master may view companion 1/dy"',
  'Self-Sufficient':'Section=skill Note="+%V Heal/+%1 Survival"',
  'Share Spells':
    'Section=companion Note="Master may share self spell w/adjacent companion"',
  'Shot On The Run':
    'Section=combat Note="May move before and after ranged attack"',
  'Silent Spell':
    'Section=magic ' +
    'Note="May use +1 spell slot to cast chosen spell w/out speech"',
  'Skill Focus (%skill)':'Section=skill Note="+%V %skill"',
  'Small':
    // changed effects
    'Section=ability,combat,skill ' +
    'Note=' +
      '"x0.75 Load Max",' +
      '"+1 size bonus to Armor Class/+1 Melee Attack/+1 Ranged Attack/-1 CMB/-1 CMD",' +
      '"+2 Fly/-4 Intimidate/+4 Stealth"',
  'Snatch Arrows':'Section=combat Note="May catch ranged weapons"',
  'Speak With Animals Of Its Kind':
    SRD35.FEATURES['Speak With Animals Of Its Kind'],
  'Speak With Master':
    'Section=companion Note="May talk w/master in secret language"',
  'Special Mount':'Section=feature Note="Magical mount w/special abilities"',
  'Spell Focus (%school)':'Section=magic Note="+1 Spell DC (%school)"',
  'Spell Mastery':'Section=magic Note="May prepare %V spells w/out spellbook"',
  'Spell Penetration':
    'Section=magic Note="+2 checks to overcome spell resistance"',
  'Spirited Charge':
    'Section=combat Note="x2 damage (x3 lance) on mounted charge"',
  'Spontaneous Druid Spell':
    'Section=magic ' +
    'Note="May cast <i>Summon Nature\'s Ally</i> in place of known spell"',
  'Spring Attack':
    'Section=combat Note="May move before and after melee attack w/out AOO"',
  'Stealthy':'Section=skill Note="+%V Escape Artist/+%1 Stealth"',
  'Still Spell':
    'Section=magic ' +
    'Note="May use +1 spell slot to cast chosen spell w/out movement"',
  'Toughness':SRD35.FEATURES.Toughness,
  'Trample':
    'Section=combat ' +
    'Note="Foe cannot avoid mounted overrun; mount gains bonus hoof attack"',
  'Turn Undead':
    'Section=combat ' +
    'Note="R30\' Channel Energy causes undead to flee for 1 min (DC %V Will neg)"',
  'Two-Weapon Defense':
    'Section=combat ' +
    'Note="+1 AC when wielding two weapons; +2 when fighting defensively"',
  'Two-Weapon Fighting':
    'Section=combat Note="Reduces on-hand penalty by 2 and off-hand by 6"',
  'Unarmored Speed Bonus':'Section=ability Note="+%V Speed"',
  // Uncanny Dodge as above
  'Weapon Finesse':
    'Section=combat ' +
    'Note="+%V light melee weapon attack (Dexterity instead of Strength)"',
  'Weapon Focus (%weapon)':'Section=combat Note="+1 %weapon Attack Modifier"',
  'Weapon Specialization (%weapon)':
    'Section=combat Note="+2 %weapon Damage Modifier"',
  'Whirlwind Attack':'Section=combat Note="May attack all foes w/in reach"',
  'Widen Spell':
    'Section=magic ' +
    'Note="May use +3 spell slot to dbl chosen spell area of affect"',
  // New features
  'A Sure Thing':'Section=combat Note="+2 attack vs. evil creature 1/dy"',
  'Adopted':'Section=feature Note="Has one trait from adoptive family\'s race"',
  'Aid Allies':'Section=combat Note="+1 on aid another actions"',
  'Anatomist':'Section=combat Note="+1 crit confirm"',
  'Ancient Historian':
    'Section=skill ' +
    'Note="+1 Choice of Knowledge (History) or Linguistics/Choice of Knowledge (History) or Linguistics is a class skill/May learn 1 ancient language"',
  'Animal Friend':
    'Section=save,skill ' +
    'Note=' +
      '"+1 Will when within 30\' of an unhostile animal",' +
      '"Handle Animal is a class skill"',
  'Apothecary':
    'Section=feature,skill ' +
    'Note=' +
      '"Has reliable poisons source",' +
      '"+1 Knowledge (Local)/Knowledge (Local) is a class skill"',
  'Arcane Archivist':
    'Section=skill ' +
    'Note="+1 Use Magic Device/Use Magic Device is a class skill"',
  'Armor Expert':'Section=skill Note="Reduces armor skill check penalty by 1"',
  'Attuned To The Ancestors':
    'Section=magic ' +
    'Note="May become imperceptible to unintelligent undead for %{level//2>?1} rd 1/dy"',
  'Bad Reputation':
    'Section=skill Note="+2 Intimidate/Intimidate is a class skill"',
  'Balanced Offensive':
    'Section=combat ' +
    'Note="R30\' Ranged touch inflicts 1d6+%{level//2} HP choice of nonlethal (plus -2 attack for 1 rd), acid, fire, cold, or electricity %{1+level//5}/dy"',
  'Beastspeaker':
    'Section=skill ' +
    'Note="+1 Diplomacy (animals); no penalty w/elemental animals"',
  'Beneficent Touch':'Section=magic Note="May reroll healing spell 1s 1/dy"',
  'Birthmark':'Section=save Note="+2 vs. charm and compulsion"',
  'Bitter Nobleman':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Local)/Knowledge (Local) is a class skill",' +
      '"+1 choice of Bluff, Sleight Of Hand, or Stealth/Choice of Bluff, Sleight Of Hand, or Stealth is a class skill"',
  'Brute':'Section=skill Note="+1 Intimidate/Intimidate is a class skill"',
  'Bullied':'Section=combat Note="+1 unarmed AOO attack"',
  'Bully':'Section=skill Note="+1 Intimidate/Intimidate is a class skill"',
  'Canter':
    'Section=skill ' +
    'Note="+5 Sense Motive (intercept secret message)/+5 ally Bluff (deliver secret message to self)"',
  "Captain's Blade":
    'Section=skill ' +
    'Note="+1 Acrobatics and Climb when on a boat/Choice of Acrobatics or Climb is a class skill"',
  'Caretaker':'Section=skill Note="+1 Heal/Heal is a class skill"',
  'Charming':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 spell DC w/attracted creatures",' +
      '"+1 Bluff and Diplomacy w/attracted creatures"',
  'Child Of Nature':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Nature)",' +
      '"+1 Survival (finding food and water)/Choice of Knowledge (Nature) or Survival is a class skill"',
  'Child Of The Streets':
    'Section=skill Note="+1 Sleight Of Hand/Sleight Of Hand is a class skill"',
  'Child Of The Temple':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Nobility)/+1 Knowledge (Religion)",' +
      '"Choice of Knowledge (Nobility) or Knowledge (Religion) is a class skill"',
  'Classically Schooled':
    'Section=skill Note="+1 Spellcraft/Spellcraft is a class skill"',
  'Comparative Religion':
    'Section=skill ' +
    'Note="+1 Knowledge (Religion)/Knowledge (Religion) is a class skill"',
  'Courageous':'Section=save Note="+2 vs. fear"',
  'Dangerously Curious':
    'Section=skill ' +
    'Note="+1 Use Magic Device/Use Magic Device is a class skill"',
  'Deft Dodger':'Section=save Note="+1 Reflex"',
  'Demon Hunter':
    'Section=skill,save ' +
    'Note=' +
      '"+3 Knowledge (Planes) (demons)",' +
      '"+2 Will vs. demonic mental spells and effects"',
  'Dervish':'Section=combat Note="+1 AC vs. movement AOO"',
  'Desert Child':'Section=save Note="+4 heat stamina, +1 vs. fire effects"',
  'Desert Shadow':
    'Section=skill Note="May use Stealth at full Speed w/out penalty"',
  "Devil's Mark":
    'Section=skill ' +
    'Note="+2 Bluff, Diplomacy, Intimidate, and Sense Motive with evil outsiders"',
  'Devotee Of The Green':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Geography)/+1 Knowledge (Nature)",' +
      '"Choice of Knowledge (Geography) or Knowledge (Nature) is a class skill"',
  'Dirty Fighter':'Section=combat Note="+1 damage when flanking"',
  'Divine Courtesan':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Sense Motive",' +
      '"+1 Diplomacy (gather information)/Choice of Diplomacy or Sense Motive is a class skill"',
  'Divine Warrior':'Section=magic Note="+1 damage w/enspelled melee weapons"',
  'Dunewalker':
    'Section=ability,save ' +
    'Note=' +
      '"May move normally through sand",' +
      '"+4 Fortitude vs. heat"',
  'Ear For Music':
    'Section=skill ' +
    'Note="+1 choice of Perform/+2 Knowledge (Local) (art and music)"',
  'Ease Of Faith':
    'Section=skill Note="+1 Diplomacy/Diplomacy is a class skill"',
  'Eastern Mysteries':'Section=magic Note="+2 spell DC 1/dy"',
  'Elemental Channel (Air)':
    'Section=combat ' +
    'Note="May use Channel Energy to heal or harm Air outsiders"',
  'Elemental Channel (Earth)':
    'Section=combat ' +
    'Note="May use Channel Energy to heal or harm Earth outsiders"',
  'Elemental Channel (Fire)':
    'Section=combat ' +
    'Note="May use Channel Energy to heal or harm Fire outsiders"',
  'Elemental Channel (Water)':
    'Section=combat ' +
    'Note="May use Channel Energy to heal or harm Water outsiders"',
  'Elven Reflexes':'Section=combat Note="+2 Initiative"',
  'Exhausting Critical':
    'Section=combat Note="Critical hit inflicts exhausted"',
  'Exile':'Section=combat Note="+2 Initiative"',
  'Expert Duelist':
    'Section=combat ' +
    'Note="+1 bonus to Armor Class and CMD when adjacent to a single foe; does not apply to touch or flat-footed Armor Class"',
  'Explorer':'Section=skill Note="+1 Survival/Survival is a class skill"',
  'Extra Channel':'Section=magic Note="Channel Energy +2/dy"',
  'Extra Ki':'Section=feature Note="+%V Ki pool"',
  'Extra Lay On Hands':'Section=magic Note="Lay On Hands +%V/dy"',
  'Extra Mercy':'Section=magic Note="+%V Mercy effects"',
  'Extra Performance':'Section=skill Note="Bardic Performance +%V rd/dy"',
  'Extra Rage':'Section=combat Note="Rage +%V rd/dy"',
  'Eyes And Ears Of The City':
    'Section=skill Note="+1 Perception/Perception is a class skill"',
  'Failed Apprentice':'Section=save Note="+1 vs. arcane spells"',
  'Familiar Monkey':'Section=skill Note="+3 Acrobatics"',
  'Fashionable':
    'Section=skill ' +
    'Note="+1 Bluff, Diplomacy, and Sense Motive when well-dressed/Choice of Bluff, Diplomacy, or Sense Motive is a class skill"',
  'Fast-Talker':'Section=skill Note="+1 Bluff/Bluff is a class skill"',
  'Fencer':'Section=combat Note="+1 attack on AOO with blades"',
  'Fiendish Presence':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Diplomacy/+1 Sense Motive",' +
      '"Choice of Diplomacy or Sense Motive is a class skill"',
  'Fires Of Hell':
    'Section=combat Note="Flaming blade inflicts +1 HP fire for %{charismaModifier} rd 1/dy"',
  'Flame Of The Dawnflower':
    'Section=combat Note="Crit w/scimitar inflicts +2 HP fire"',
  'Fleet':'Section=ability Note="+%V Speed in light or no armor"',
  'Focused Mind':'Section=magic Note="+2 concentration checks"',
  'Force For Good':'Section=magic Note="+1 caster level on Good spells"',
  'Forlorn':'Section=save Note="+1 Fortitude"',
  'Fortified Drinker':
    'Section=save Note="Drinking alcohol gives +2 vs. mental effects for 1 hr"',
  'Fortified':
    'Section=combat ' +
    'Note="May gain 20% chance to negate critical hit or Sneak Attack 1/dy"',
  'Freedom Fighter (Halfling)':
    'Section=combat,skill,skill ' +
    'Note=' +
      '"+1 attack during escape",' +
      '"Escape Artist is a class skill",' +
      '"+1 skills during escape"',
  "Freedom Fighter (Liberty's Edge)":
    'Section=combat,skill ' +
    'Note=' +
      '"+1 attack during surprise rd",' +
      '"+1 Stealth"',
  'Gifted Adept':'Section=magic Note="+1 caster level on chosen spell"',
  'Gold Finger':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Disable Device/+1 Sleight Of Hand",' +
      '"Choice of Disable Device or Sleight Of Hand is a class skill"',
  'Goldsniffer':'Section=skill Note="+2 Perception (metals, jewels, gems)"',
  "Gorgon's Fist":
    'Section=combat ' +
    'Note="Unarmed attack vs. slowed foe staggers (DC %V Fort neg)"',
  'Greasy Palm':'Section=feature Note="10% discount on bribes"',
  'Greater Bull Rush':
    'Section=combat ' +
    'Note="+2 Bull Rush checks, may take AOO on Bull Rushed foes"',
  'Greater Disarm':
    'Section=combat Note="+2 disarm checks, disarmed weapons land 15\' away"',
  'Greater Feint':
    'Section=combat Note="Feinted foe loses Dexterity AC bonus for 1 rd"',
  'Greater Grapple':
    'Section=combat ' +
    'Note="+2 grapple checks, may maintain grapple as move action"',
  'Greater Overrun':
    'Section=combat ' +
    'Note="+2 overrun checks, may take AOO on foes knocked prone"',
  'Greater Penetrating Strike':
    'Section=combat Note="Focused weapons ignore DR 5/- or DR 10/any"',
  'Greater Shield Focus':'Section=combat Note="+1 shield bonus to Armor Class"',
  'Greater Sunder':
    'Section=combat Note="+2 sunder checks, foe takes excess damage"',
  'Greater Trip':
    'Section=combat Note="+2 trip checks, may take AOO on tripped foes"',
  'Greater Vital Strike':'Section=combat Note="4x base damage"',
  'Guardian Of The Forge':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Engineering)/+1 Knowledge (History)",' +
      '"Choice of Knowledge (Engineering) or Knowledge (History) is a class skill"',
  'Hedge Magician':
    'Section=skill Note="Cost to craft magic items is reduced by 5%"',
  'Highlander':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Stealth/Stealth is a class skill",' +
      '"+1 Stealth (hilly and rocky areas)"',
  'History Of Heresy':'Section=save Note="+1 vs. divine spells"',
  'Horse Lord (Trait)':'Section=skill Note="+2 Ride/Ride is a class skill"',
  "Hunter's Eye":
    'Section=combat ' +
    'Note="Has Proficiency and suffers no penalty for 2nd range increment w/choice of longbow or shortbow"',
  'I Know A Guy':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Local)",' +
      '"+2 Diplomacy (gather information)"',
  'Impressive Presence':
    'Section=combat ' +
    'Note="May take full-round action that inflicts shaken on adjacent foes (DC %{10+level//2+charismaModifier} Will neg) for 1 rd 1/dy"',
  'Improved Channel':'Section=magic Note="+2 Channel Energy DC"',
  'Improved Great Fortitude':'Section=save Note="May reroll Fort 1/dy"',
  'Improved Iron Will':'Section=save Note="May reroll Will 1/dy"',
  'Improved Lightning Reflexes':'Section=save Note="May reroll Ref 1/dy"',
  'Improved Vital Strike':'Section=combat Note="3x base damage"',
  'Indomitable Faith':'Section=save Note="+1 Will"',
  'Indomitable':'Section=save Note="+1 vs. enchantment"',
  'Influential':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 DC on language-dependent spell 1/dy",' +
      '"+3 Diplomacy (requests)"',
  'Insider Knowledge':
    'Section=skill ' +
    'Note="+1 choice of Diplomacy or Knowledge (Local)/Choice of Diplomacy of Knowledge (Local) is a class skill"',
  'Intimidating Prowess':'Section=skill Note="+%V Intimidate"',
  'Killer':
    'Section=combat ' +
    'Note="Inflicts extra damage equal to weapon damage multiplier on critical hit"',
  'Librarian':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Linguistics/+1 Profession (Librarian)",' +
      '"Choice of Linguistics or Profession (Librarian) is a class skill/+1 reading bonus 1/dy"',
  'Lightning Stance':
    'Section=combat Note="Dbl move or withdraw action gives 50% concealment"',
  'Log Roller':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 CMD vs. Trip",' +
      '"+1 Acrobatics"',
  'Lore Seeker':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 caster level and save DC on chosen 3 arcane spells",' +
      '"+1 Knowledge (Arcana)/Knowledge (Arcana) is a class skill"',
  'Loyalty':'Section=save Note="+1 vs. enchantment"',
  'Lunge':'Section=combat Note="May suffer -2 AC to gain +5\' melee range"',
  'Magic Is Life':
    'Section=save ' +
    'Note="+2 vs. death effects and stabilizes automatically when enspelled"',
  'Magical Knack':
    'Section=magic Note="Gains +2 caster level (max %{level}) in chosen class"',
  'Magical Lineage':
    'Section=magic ' +
    'Note="Reduces spell level penalty by 1 for metamagic feats applied to chosen spell"',
  'Magical Talent (Trait)':
    'Section=magic Note="May use chosen Talent0 spell 1/dy"',
  'Master Craftsman (%craftSkill)':
    'Section=feature,skill ' +
    'Note=' +
      '"May use %craftSkill with Craft Magic Arms And Armor and Craft Wondrous Item",' +
      '"+2 %craftSkill"',
  'Master Craftsman (%professionSkill)':
    'Section=feature,skill ' +
    'Note=' +
      '"May use %professionSkill with Craft Magic Arms And Armor and Craft Wondrous Item",' +
      '"+2 %professionSkill"',
  'Master Of Pentacles':
    'Section=magic ' +
    'Note="+2 caster level to determine duration when casting a conjuration spell 1/dy"',
  'Mathematical Prodigy':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Arcana)/+1 Knowledge (Engineering)",' +
      '"Choice of Knowledge (Arcana) or Knowledge (Engineering) is a class skill"',
  'Medic':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 caster level on <i>Remove</i> spells",' +
      '"+2 Heal (disease, poison)"',
  "Medusa's Wrath":
    'Section=combat ' +
    'Note="May make 2 extra unarmed attacks vs. diminished-capacity foe"',
  'Meridian Strike':'Section=combat Note="May reroll crit damage 1s 1/dy"',
  'Meticulous Artisan':'Section=skill Note="+1 Craft for day job"',
  'Militia Veteran':
    'Section=skill ' +
    'Note="+1 choice of Profession (Soldier), Ride, or Survival/Choice of Profession (Soldier), Ride, or Survival is a class skill"',
  'Mind Over Matter':'Section=save Note="+1 Will"',
  'Missionary':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 caster level and save DC on 3 divine spells",' +
      '"+1 Knowledge (Religion)/Knowledge (Religion) is a class skill"',
  'Mummy-Touched':'Section=save Note="+2 vs. curse and disease"',
  'Natural Negotiator':
    'Section=feature,skill ' +
    'Note=' +
      '"+1 Language Count",' +
      '"Choice of Diplomacy or Handle Animal is a class skill"',
  'Natural-Born Leader':
    'Section=feature,save ' +
    'Note=' +
      '"+1 Leadership score",' +
      '"+1 followers\' Will vs. mind-altering effects"',
  'Nimble Moves':
    'Section=ability Note="May move normally through difficult terrain 5\'/rd"',
  'Observant':
    'Section=skill ' +
    'Note="+1 choice of Perception or Sense Motive/Choice of Perception or Sense Motive is a class skill"',
  'Outcast':'Section=skill Note="+1 Survival/Survival is a class skill"',
  'Patient Optimist':
    'Section=skill ' +
    'Note="+2 Diplomacy (unfriendly or hostile creatures); may retry once"',
  'Penetrating Strike':'Section=combat Note="Focused weapons ignore DR 5/any"',
  'Performance Artist':
    'Section=skill ' +
    'Note="+1 choice of Perform (+5 when performing for money)/Choice of Perform is a class skill"',
  'Pinpoint Targeting':
    'Section=combat Note="Ranged attack ignores armor bonus"',
  'Planar Voyager':
    'Section=combat,save ' +
    'Note=' +
      '"+1 Initiative when not on Material Plane",' +
      '"+1 saves when not on Material Plane"',
  'Poverty-Stricken':
    'Section=skill Note="+1 Survival/Survival is a class skill"',
  'Proper Training':
    'Section=skill ' +
    'Note="+1 choice of Knowledge (Geography) or Knowledge (History)/Choice of Knowledge (Geography) or Knowledge (History) is a class skill"',
  'Rapscallion':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 Initiative",' +
      '"+1 Escape Artist"',
  'Reactionary':'Section=combat Note="+2 Initiative"',
  'Resilient':'Section=save Note="+1 Fortitude"',
  'Reverent Wielder':
    'Section=combat,save ' +
    'Note=' +
      '"+1 disarm, steal, and sunder CMD",' +
      '"Equipment gains +1 saves"',
  'Rich Parents':'Section=feature Note="Starts w/900 GP"',
  'River Rat':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 damage w/daggers",' +
      '"+1 Swim/Swim is a class skill"',
  'Rousing Oratory':
    'Section=skill ' +
    'Note="Choice of Perform (Act, Comedy, Oratory, or Sing) is a class skill/R60\' DC 15/25 gives allies +1/+2 vs. fear for 5 min 1/dy"',
  'Sacred Conduit':'Section=magic Note="+1 channeled energy save DC"',
  'Sacred Touch':'Section=magic Note="Touch stabilizes"',
  'Savanna Child':
    'Section=skill ' +
    'Note="+1 choice of Handle Animal, Knowledge (Nature), or Ride/Choice of Handle Animal, Knowledge (Nature) or Ride is a class skill"',
  'Scholar Of Balance':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Nature)/+1 Knowledge (Planes)",' +
      '"Choice of Knowledge (Nature) or Knowledge (Planes) is a class skill"',
  'Scholar Of Ruins':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Dungeoneering)/+1 Knowledge (Geography)",' +
      '"Choice of Knowledge (Dungeoneering) or Knowledge (Geography) is a class skill"',
  'Scholar Of The Great Beyond':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (History)/+1 Knowledge (Planes)",' +
      '"Choice of Knowledge (History) or Knowledge (Planes) is a class skill"',
  'Scorpion Style':
    'Section=combat ' +
    'Note="Unarmed hit slows foe to 5\' for %V rd (DC %1 Fort neg)"',
  'Secrets Of The Sphinx':
    'Section=skill ' +
    'Note="+2 Knowledge check 1/dy/Choice of Knowledge is a class skill"',
  'Selective Channeling':
    'Section=magic ' +
    'Note="May withhold Channel Energy effects from up to %V targets"',
  'Shadow Diplomat':
    'Section=skill Note="+1 Diplomacy/Diplomacy is a class skill"',
  'Shatter Defenses':
    'Section=combat Note="Fearful struck foes suffer flat-footed for 1 rd"',
  'Sheriff':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Local)/Knowledge (Local) is a class skill",' +
      '"May use legal favor or +10 local Bluff, Diplomacy, or Intimidate 1/session"',
  'Shield Focus':'Section=combat Note="+1 shield bonus to Armor Class"',
  'Shield Master':
    'Section=combat ' +
    'Note="No penalty on shield attacks/May apply shield enhancements to attack and damage"',
  'Shield Slam':'Section=combat Note="Shield Bash inflicts Bull Rush"',
  'Shiv':'Section=combat Note="+1 surprise piercing and slashing damage"',
  'Sickening Critical':
    'Section=combat Note="Critical hit inflicts sickened for 1 min"',
  'Skeptic':'Section=save Note="+2 vs. illusions"',
  'Smuggler':
    'Section=skill,skill ' +
    'Note=' +
      '"Sleight Of Hand is a class skill",' +
      '"+3 Sleight Of Hand (hide object)"',
  'Soul Drinker':
    'Section=combat ' +
    'Note="May gain temporary HP equal to slain foe\'s HD for 1 min 1/dy"',
  'Spellbreaker':
    'Section=combat Note="May take AOO after foe failed defensive casting"',
  'Staggering Critical':
    'Section=combat ' +
    'Note="Critical hit staggers for 1d4+1 rd (DC %V Fort staggered for 1 rd)"',
  'Stand Still':
    'Section=combat Note="May use AOO for CMB check to halt foe movement"',
  'Starchild':
    'Section=skill ' +
    'Note="+4 Survival (avoid becoming lost)/Always know direction of north"',
  'Step Up':'Section=combat Note="May match foe 5\' step"',
  'Storyteller':
    'Section=skill ' +
    'Note="+%{intelligenceModifier+3>?1} choice of Knowledge 1/scenario"',
  'Strike Back':
    'Section=combat ' +
    'Note="May ready melee attack against melee foes that are out of range"',
  'Stunning Critical':
    'Section=combat ' +
    'Note="Critical hit inflicts stunned (DC %V Fort staggered) for 1d4 rd"',
  'Suspicious':
    'Section=skill Note="+1 Sense Motive/Sense Motive is a class skill"',
  'Tavern Owner':
    'Section=feature,skill ' +
    'Note=' +
      '"Receives free lodging and 10% extra from treasure sale",' +
      '"+1 Knowledge (Local)/Knowledge (Local) is a class skill"',
  'Teaching Mistake':
    'Section=save Note="+1 next save after nat 1 save roll 1/scenario"',
  'Throw Anything':
    'Section=combat ' +
    'Note="No penalty for improvised ranged weapon, +1 attack w/thrown splash"',
  'Tireless':
    'Section=ability,combat ' +
    'Note=' +
      '"+2 Constitution vs. nonlethal exertion and environment",' +
      '"+1 HP"',
  'Tiring Critical':'Section=combat Note="Critical hit inflicts fatigued"',
  'Tomb Raider':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Dungeoneering)/+1 Perception",' +
      '"Choice of Knowledge (Dungeoneering) or Perception is a class skill"',
  'Trouper':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. Perform-related abilities",' +
      '"+1 choice of Perform"',
  'Tunnel Fighter':
    'Section=combat ' +
    'Note="+2 Initiative (underground)/Inflicts extra damage equal to weapon damage multiplier on critical hit"',
  'Two-Weapon Rend':'Section=combat Note="Double hit inflicts +1d10%1 HP"',
  'Undead Slayer':'Section=combat Note="+1 weapon damage vs. undead"',
  'Unflappable':
    'Section=save,skill ' +
    'Note=' +
      '"+1 vs. fear",' +
      '"+3 DC on foe attempts to demoralize self using Intimidate"',
  'Unorthodox Strategy':
    'Section=skill Note="+2 Acrobatics (traverse threatened squares)"',
  'Unseat':
    'Section=combat ' +
    'Note="May make Bull Rush after lance hit to unseat mounted foe"',
  'Upstanding':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Diplomacy/+1 Sense Motive",' +
      '"Choice of Diplomacy or Sense Motive is a class skill"',
  'Vagabond Child':
    'Section=skill ' +
    'Note="+1 choice of Disable Device, Escape Artist, or Sleight Of Hand/Choice of Disable Device, Escape Artist, or Sleight Of Hand is a class skill"',
  'Versatile Skill (Act)':
    'Section=skill Note="Can use Perform (Act) in place of Bluff and Disguise"',
  'Versatile Skill (Comedy)':
    'Section=skill ' +
    'Note="Can use Perform (Comedy) in place of Bluff and Intimidate"',
  'Versatile Skill (Dance)':
    'Section=skill ' +
    'Note="Can use Perform (Dance) in place of Acrobatics and Fly"',
  'Versatile Skill (Keyboard)':
    'Section=skill ' +
    'Note="Can use Perform (Keyboard) in place of Diplomacy and Intimidate"',
  'Versatile Skill (Oratory)':
    'Section=skill ' +
    'Note="Can use Perform (Oratory) in place of Diplomacy and Sense Motive"',
  'Versatile Skill (Percussion)':
    'Section=skill ' +
    'Note="Can use Perform (Percussion) in place of Handle Animal and Intimidate"',
  'Versatile Skill (Sing)':
    'Section=skill ' +
    'Note="Can use Perform (Sing) in place of Bluff and Sense Motive"',
  'Versatile Skill (String)':
    'Section=skill ' +
    'Note="Can use Perform (String) in place of Bluff and Diplomacy"',
  'Versatile Skill (Wind)':
    'Section=skill ' +
    'Note="Can use Perform (Wind) in place of Diplomacy and Handle Animal"',
  'Veteran Of Battle':
    'Section=combat,combat ' +
    'Note=' +
      '"+1 Initiative",' +
      '"May draw weapon as a free action during a surprise rd"',
  'Vindictive':
    'Section=combat ' +
    'Note="May inflict +1 damage vs. successful attacker for 1 min 1/dy"',
  'Vital Strike':'Section=combat Note="2x base damage"',
  'Warrior Of Old':'Section=combat Note="+2 Initiative"',
  'Watchdog':
    'Section=skill Note="+1 Sense Motive/Sense Motive is a class skill"',
  'Weapon Style':'Section=combat Note="Proficient with choice of monk weapon"',
  'Well-Informed':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Local)",' +
      '"+1 Diplomacy (gather information)/Choice of Diplomacy or Knowledge (Local) is a class skill"',
  'Whistleblower':
    'Section=skill Note="+1 Sense Motive/Sense Motive is a class skill"',
  'Wind Stance':
    'Section=combat Note="20% concealment vs. ranged attacks when moving more than 5\'"',
  'Wisdom In The Flesh':
    'Section=skill ' +
    'Note="May use Wisdom modifier for choice of Strength, Constitution, or Dexterity skill/Choice of Strength, Constitution, or Dexterity skill is a class skill"',
  'World Traveler (Trait)':
    'Section=skill ' +
    'Note="+1 choice of Diplomacy, Knowledge (Local), or Sense Motive/Choice of Diplomacy, Knowledge (Local), or Sense Motive is a class skill"'

};
Pathfinder.GOODIES = Object.assign({}, SRD35.GOODIES, {
  'Combat Maneuver Bonus':
    'Pattern="([-+]\\d+).*\\bcmb|\\bcmb\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=combatManeuverBonus ' +
    'Section=combat Note="%V CMB"',
  'Combat Maneuver Defense':
    'Pattern="([-+]\\d+).*\\bcmd|\\bcmd\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=combatManeuverDefense ' +
    'Section=combat Note="%V CMD"',
  'Adept Caster Level':
    'Pattern="([-+]\\d+).*\\bAdept?\\s+caster\\s+level|\\bAdept?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $4" ' +
    'Attribute=casterLevels.Adept ' +
    'Section=magic Note="%V Adept caster level"',
  'Bard Caster Level':
    'Pattern="([-+]\\d+).*\\bB(ard)?\\s+caster\\s+level|\\bB(ard)?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $4" ' +
    'Attribute=casterLevels.Bard ' +
    'Section=magic Note="%V Bard caster level"',
  'Cleric Caster Level':
    'Pattern="([-+]\\d+).*\\bC(leric)?\\s+caster\\s+level|\\bC(leric)?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $4" ' +
    'Attribute=casterLevels.Cleric ' +
    'Section=magic Note="%V Cleric caster level"',
  'Druid Caster Level':
    'Pattern="([-+]\\d+).*\\bD(ruid)?\\s+caster\\s+level|\\bD(ruid)?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $4" ' +
    'Attribute=casterLevels.Druid ' +
    'Section=magic Note="%V Druid caster level"',
  'Paladin Caster Level':
    'Pattern="([-+]\\d+).*\\bP(aladin)?\\s+caster\\s+level|\\bP(aladin)?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $4" ' +
    'Attribute=casterLevels.Paladin ' +
    'Section=magic Note="%V Paladin caster level"',
  'Ranger Caster Level':
    'Pattern="([-+]\\d+).*\\bR(anger)?\\s+caster\\s+level|\\bR(anger)?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $4" ' +
    'Attribute=casterLevels.Ranger ' +
    'Section=magic Note="%V Ranger caster level"',
  'Sorcerer Caster Level':
    'Pattern="([-+]\\d+).*\\bS(orcerer)?\\s+caster\\s+level|\\bS(orcerer)?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $4" ' +
    'Attribute=casterLevels.Sorcerer ' +
    'Section=magic Note="%V Sorcerer caster level"',
  'Wizard Caster Level':
    'Pattern="([-+]\\d+).*\\bW(izard)?\\s+caster\\s+level|\\bW(izard)?\\s+caster\\s+level\\s+([-+]\\d+)" ' +
    'Effect=add ' +
    'Value="$1 || $8" ' +
    'Attribute=casterLevels.Wizard ' +
    'Section=magic Note="%V Wizard caster level"'
});
Pathfinder.LANGUAGES = {
  'Abyssal':'',
  'Aklo':'',
  'Aquan':'',
  'Auran':'',
  'Celestial':'',
  'Common':'',
  'Draconic':'',
  'Druidic':'',
  'Dwarven':'',
  'Elven':'',
  'Giant':'',
  'Gnoll':'',
  'Gnome':'',
  'Goblin':'',
  'Halfling':'',
  'Ignan':'',
  'Infernal':'',
  'Orc':'',
  'Sylvan':'',
  'Terran':'',
  'Undercommon':''
};
Pathfinder.PATHS = {
};
Pathfinder.RACES = {
  'Dwarf':
    'Size=Medium ' +
    'Speed=20 ' +
    'Features=' +
      '"Dwarf Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh; Dwarven Waraxe)",' +
      '"Weapon Proficiency (Battleaxe; Heavy Pick; Warhammer)",' +
      '"Darkvision","Defensive Training","Dwarf Hatred","Greed","Hardy",' +
      '"Stability","Steady","Stonecunning" ' +
    'Languages=Common,Dwarven',
  'Elf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Elven Curve Blade)",' +
      '"Weapon Proficiency (Composite Longbow; Composite Shortbow; Longbow; Longsword; Rapier; Shortbow)",' +
      '"Elven Immunities","Elven Magic","Keen Senses","Low-Light Vision" ' +
    'Languages=Common,Elven',
  'Gnome':
    'Size=Small ' +
    'Speed=20 ' +
    'Features=' +
      '"Gnome Ability Adjustment",' +
      '"Weapon Familiarity (Gnome Hooked Hammer)",' +
      '"Defensive Training","Gnome Hatred","Gnome Magic",' +
      '"Illusion Resistance","Keen Senses","Low-Light Vision","Obsessive" ' +
    'Languages=Common,Gnome,Sylvan',
  'Half-Elf':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"Half-Elf Ability Adjustment",' +
      '"Adaptability","Elf Blood","Elven Immunities","Keen Senses",' +
      '"Low-Light Vision","Multitalented" ' +
    'Languages=Common,Elven',
  'Half-Orc':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"Half-Orc Ability Adjustment",' +
      '"Weapon Familiarity (Orc Double Axe)",' +
      '"Weapon Proficiency (Falchion; Greataxe)",' +
      '"Darkvision","Intimidating","Orc Blood","Orc Ferocity" ' +
    'Languages=Common,Orc',
  'Halfling':
    'Size=Small ' +
    'Speed=20 ' +
    'Features=' +
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Sling Staff)",' +
      '"Weapon Proficiency (Sling)",' +
      '"Fearless","Halfling Luck","Keen Senses","Sure-Footed" ' +
    'Languages=Common,Halfling',
  'Human':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"Human Ability Adjustment",' +
      '"Bonus Feat (Human)","Skilled" ' +
    'Languages=Common'
};
Pathfinder.SCHOOLS = {
  'Abjuration':
    'Features=' +
      '"1:Resistance","1:Protective Ward","6:Energy Absorption"',
  'Conjuration':
    'Features=' +
      '"1:Acid Dart (Conjuration)","1:Summoner\'s Charm","8:Dimensional Steps"',
  'Divination':
    'Features=' +
      '1:Forewarned,"1:Diviner\'s Fortune","8:Scrying Adept"',
  'Enchantment':
    'Features=' +
      '"1:Enchanting Smile","1:Dazing Touch (Enchantment)","8:Aura Of Despair"',
  'Evocation':
    'Features=' +
      '"1:Intense Spells","1:Force Missile","8:Elemental Wall"',
  'Illusion':
    'Features=' +
      '"1:Extended Illusions","1:Blinding Ray","8:Invisibility Field"',
  'Necromancy':
    'Features=' +
      '"1:Power Over Undead","1:Grave Touch (Necromancy)","8:Life Sight"',
  'Transmutation':
    'Features=' +
      '"1:Physical Enhancement","1:Telekinetic Fist","8:Change Shape"'
};
Pathfinder.SHIELDS = {
  'None':SRD35.SHIELDS.None,
  'Buckler':SRD35.SHIELDS.Buckler,
  'Light Wooden':SRD35.SHIELDS['Light Wooden'],
  'Light Steel':SRD35.SHIELDS['Light Steel'],
  'Heavy Wooden':SRD35.SHIELDS['Heavy Wooden'],
  'Heavy Steel':SRD35.SHIELDS['Heavy Steel'],
  'Tower':SRD35.SHIELDS.Tower
};
Pathfinder.SKILLS = {
  'Acrobatics':
    'Ability=Dexterity Untrained=true Class=Barbarian,Bard,Monk,Rogue',
  'Appraise':
    'Ability=Intelligence Untrained=true ' +
    'Class=Bard,Cleric,Rogue,Sorcerer,Wizard',
  'Bluff':'Ability=Charisma Untrained=true Class=Bard,Rogue,Sorcerer',
  'Climb':
    'Ability=Strength Untrained=true ' +
    'Class=Barbarian,Bard,Druid,Fighter,Monk,Ranger,Rogue',
  'Craft (Alchemy)':
    'Ability=Intelligence Untrained=true ' +
    'Class=Barbarian,Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Craft (Armor)':
    'Ability=Intelligence Untrained=true ' +
    'Class=Barbarian,Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Craft (Bows)':
    'Ability=Intelligence Untrained=true ' +
    'Class=Barbarian,Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Craft (Traps)':
    'Ability=Intelligence Untrained=true ' +
    'Class=Barbarian,Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Craft (Weapons)':
    'Ability=Intelligence Untrained=true ' +
    'Class=Barbarian,Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Diplomacy':'Ability=Charisma Untrained=true Class=Bard,Cleric,Paladin,Rogue',
  'Disable Device':'Ability=Dexterity Untrained=false Class=Rogue',
  'Disguise':'Ability=Charisma Untrained=true Class=Bard,Rogue',
  'Escape Artist':'Ability=Dexterity Untrained=true Class=Bard,Monk,Rogue',
  'Fly':'Ability=Dexterity Untrained=true Class=Druid,Sorcerer,Wizard',
  'Handle Animal':
    'Ability=Charisma Untrained=false ' +
    'Class=Barbarian,Druid,Fighter,Paladin,Ranger',
  'Heal':'Ability=Wisdom Untrained=true Class=Cleric,Druid,Paladin,Ranger',
  'Intimidate':
    'Ability=Charisma Untrained=true ' +
    'Class=Barbarian,Bard,Fighter,Monk,Ranger,Rogue,Sorcerer',
  'Knowledge (Arcana)':
    'Ability=Intelligence Untrained=false Class=Bard,Cleric,Sorcerer,Wizard',
  'Knowledge (Dungeoneering)':
    'Ability=Intelligence Untrained=false ' +
    'Class=Bard,Fighter,Ranger,Rogue,Wizard',
  'Knowledge (Engineering)':
    'Ability=Intelligence Untrained=false Class=Bard,Fighter,Wizard',
  'Knowledge (Geography)':
    'Ability=Intelligence Untrained=false Class=Bard,Druid,Ranger,Wizard',
  'Knowledge (History)':
    'Ability=Intelligence Untrained=false Class=Bard,Cleric,Monk,Wizard',
  'Knowledge (Local)':
    'Ability=Intelligence Untrained=false Class=Bard,Rogue,Wizard',
  'Knowledge (Nature)':
    'Ability=Intelligence Untrained=false ' +
    'Class=Barbarian,Bard,Druid,Ranger,Wizard',
  'Knowledge (Nobility)':
    'Ability=Intelligence Untrained=false Class=Bard,Cleric,Paladin,Wizard',
  'Knowledge (Planes)':
    'Ability=Intelligence Untrained=false Class=Bard,Cleric,Wizard',
  'Knowledge (Religion)':
    'Ability=Intelligence Untrained=false ' +
    'Class=Bard,Cleric,Monk,Paladin,Wizard',
  'Linguistics':
    'Ability=Intelligence Untrained=false Class=Bard,Cleric,Rogue,Wizard',
  'Perception':
    'Ability=Wisdom Untrained=true ' +
    'Class=Barbarian,Bard,Druid,Monk,Ranger,Rogue',
  'Perform (Act)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (Comedy)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (Dance)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (Keyboard)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (Oratory)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (Percussion)':
    'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (Sing)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (String)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Perform (Wind)':'Ability=Charisma Untrained=true Class=Bard,Monk,Rogue',
  'Profession (Librarian)':
    'Ability=Wisdom Untrained=false ' +
    'Class=Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Profession (Soldier)':
    'Ability=Wisdom Untrained=false ' +
    'Class=Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Profession (Scribe)':
    'Ability=Wisdom Untrained=false ' +
    'Class=Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Profession (Tanner)':
    'Ability=Wisdom Untrained=false ' +
    'Class=Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Ride':
    'Ability=Dexterity Untrained=true ' +
    'Class=Barbarian,Druid,Fighter,Monk,Paladin,Ranger',
  'Sense Motive':
    'Ability=Wisdom Untrained=true Class=Bard,Cleric,Monk,Paladin,Rogue',
  'Sleight Of Hand':'Ability=Dexterity Untrained=false Class=Bard,Rogue',
  'Spellcraft':
    'Ability=Intelligence Untrained=false ' +
    'Class=Bard,Cleric,Druid,Paladin,Ranger,Sorcerer,Wizard',
  'Stealth':'Ability=Dexterity Untrained=true Class=Bard,Monk,Ranger,Rogue',
  'Survival':
    'Ability=Wisdom Untrained=true Class=Barbarian,Druid,Fighter,Ranger',
  'Swim':
    'Ability=Strength Untrained=true ' +
    'Class=Barbarian,Druid,Fighter,Monk,Ranger,Rogue',
  'Use Magic Device':
    'Ability=Charisma Untrained=false Class=Bard,Rogue,Sorcerer'
};
Pathfinder.SPELLS = {

  'Acid Arrow':'Level=S2,W2',
  'Acid Fog':'Level=S6,W6',
  'Acid Splash':'Level=Talent0,S0,W0',
  'Aid':'Level=Adept2,C2,Luck2 Liquid=Potion',
  'Air Walk':'Level=Air4,C4,D4',
  'Alarm':'Level=B1,R1,S1,W1',
  'Align Weapon':'Level=C2,Chaos2,Evil2,Good2,Law2 Liquid=Oil',
  'Alter Self':
    'Level=B2,S2,W2 ' +
    'Description="Self becomes small (+2 Dexterity) or medium (+2 Strength) humanoid for %{lvl} min"',
  'Analyze Dweomer':'Level=B6,S6,W6',
  'Animal Growth':
    'Level=D5,R4,S5,W5 ' +
    'Description="R%{100+lvl*10}\' %{lvl//2} animal targets in 15\' radius dbl size (+8 Strength, +4 Constitution, +2 AC, -2 Dexterity) for %{lvl} min (Fort neg)"',
  'Animal Messenger':'Level=B2,D2,R1',
  'Animal Shapes':
    'Level=Animal7,D8 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} willing targets in 15\' radius become chosen diminutive - huge animal or small - medium magical beast for %{lvl} hr"',
  'Animal Trance':'Level=Adept2,B2,D2',
  'Animate Dead':'Level=Adept3,C3,Death3,S4,W4',
  'Animate Objects':'Level=B6,C6,Chaos6',
  'Animate Plants':'Level=D7,Plant7',
  'Animate Rope':'Level=Artifice1,B1,S1,W1 Liquid=Oil',
  'Antilife Shell':
    'Level=Animal6,C6,D6 ' +
    'Description="10\' radius bars living for %{lvl} min"',
  'Antimagic Field':'Level=C8,Magic6,Protection6,S6,W6',
  'Antipathy':'Level=D9,S8,W8',
  'Antiplant Shell':
    'Level=D4 ' +
    'Description="10\' radius bars animate plants for %{lvl} min"',
  'Arcane Eye':'Level=S4,W4',
  'Arcane Lock':'Level=S2,W2 Liquid=Oil',
  'Arcane Mark':'Level=Talent0,S0,W0 Liquid=Oil',
  'Arcane Sight':'Level=S3,W3',
  'Astral Projection':'Level=C9,Travel9,S9,W9',
  'Atonement':'Level=C5,D5',
  'Augury':'Level=C2',
  'Awaken':'Level=D5',
  'Baleful Polymorph':'Level=Adept5,D5,S5,W5',
  'Bane':'Level=C1',
  'Banishment':'Level=C6,S7,W7',
  'Barkskin':'Level=D2,Plant2,R2 Liquid=Potion',
  'Bear\'s Endurance':'Level=Adept2,C2,D2,R2,S2,W2 Liquid=Potion',
  'Bestow Curse':'Level=Adept3,C3,S4,W4',
  'Binding':'Level=S8,W8',
  'Black Tentacles':
    'Level=S4,W4 ' +
    'Description="R%{100+lvl*10}\' Tentacles in a 20\' radius grapple (BAB +%{casterLevel+5}) and inflict 1d6+4 HP/rd for %{lvl} rd"',
  'Blade Barrier':'Level=C6,Good6,War6',
  'Blasphemy':
    'Level=C7,Evil7 ' +
    'Description="Nonevil creatures in 40\' radius with equal/-1/-5/-10 HD dazed for 1 rd (Will neg)/suffer -2d6 Strength for 2d4 rd (Will half)/paralyzed for 1d10 min (Will for 1 rd)/killed (Will suffer 3d6+%{lvl} HP) and banished (Will -4 neg)"',
  'Bless':'Level=Adept1,C1,Community1,P1',
  'Bless Water':'Level=C1,P1',
  'Bless Weapon':'Level=Glory2,P1 Liquid=Oil',
  'Blight':'Level=D4,S5,W5',
  'Blindness/Deafness':'Level=B2,C3,Darkness2,S2,W2',
  'Blink':'Level=B3,S3,W3',
  'Blur':'Level=B2,S2,W2 Liquid=Potion',
  'Break Enchantment':'Level=Adept5,B4,C5,Liberation5,Luck5,P4,S5,W5',
  'Bull\'s Strength':
    'Level=Adept2,C2,D2,P2,Strength2,S2,W2 Liquid=Potion',
  'Burning Hands':'Level=Adept1,Fire1,S1,W1',
  'Call Lightning':'Level=D3,Weather3',
  'Call Lightning Storm':'Level=D5',
  'Calm Animals':'Level=Animal1,D1,R1',
  'Calm Emotions':'Level=B2,C2,Charm2',
  'Cat\'s Grace':'Level=Adept2,B2,D2,R2,S2,W2 Liquid=Potion',
  'Cause Fear':'Level=Adept1,B1,C1,Death1,S1,W1',
  'Chain Lightning':
    'Level=Air6,S6,W6 ' +
    'Description="R%{400+lvl*40}\' Bolt inflicts %{lvl<?20}d6 HP to primary target (Ref half) and %{lvl<?20} secondary targets in 30\' radius (Ref +2 half)"',
  'Changestaff':'Level=D7',
  'Chaos Hammer':'Level=C4,Chaos4',
  'Charm Animal':'Level=D1,R1',
  'Charm Monster':'Level=B3,Charm5,S4,W4',
  'Charm Person':'Level=B1,Charm1,S1,W1',
  'Chill Metal':'Level=D2',
  'Chill Touch':'Level=S1,W1',
  'Circle Of Death':'Level=S6,W6',
  'Clairaudience/Clairvoyance':'Level=B3,Knowledge3,S3,W3',
  'Clenched Fist':
    'Level=Strength8,S8,W8 ' +
    'Description="R%{100+lvl*10}\' 10\' hand (AC 20, %{hitPoints} HP) moves 60\'/rd, gives +4 AC, and performs +%{lvl+12} bull rush and +$Lplus11+mod melee attack that inflicts 1d8+11 HP and stuns for 1 rd (Fort neg) for %{lvl} rd"',
  'Cloak Of Chaos':'Level=C8,Chaos8',
  'Clone':'Level=S8,W8',
  'Cloudkill':'Level=S5,W5',
  'Color Spray':'Level=S1,W1',
  'Command':'Level=Adept1,C1',
  'Command Plants':'Level=D4,Plant4,R3',
  'Command Undead':'Level=S2,W2',
  'Commune':'Level=Adept5,C5',
  'Commune With Nature':'Level=D5,R4',
  'Comprehend Languages':'Level=Adept1,B1,C1,Knowledge1,S1,W1',
  'Cone Of Cold':'Level=S5,W5,Water6',
  'Confusion':
    'Level=B3,Madness4,Trickery4,S4,W4 ' +
    'Description="R%{100+lvl*10}\' Creatures in 15\' radius randomly 25% act normal/25% babble/25% attack themselves/25% attack nearest for %{lvl} rd (Will neg)"',
  'Consecrate':'Level=C2',
  'Contact Other Plane':'Level=S5,W5',
  'Contagion':'Level=Adept3,C3,D3,S4,W4',
  'Contingency':'Level=S6,W6',
  'Continual Flame':'Level=Adept3,C3,S2,W2 Liquid=Oil',
  'Control Plants':'Level=D8,Plant8',
  'Control Undead':'Level=S7,W7',
  'Control Water':'Level=C4,D4,S6,W6,Water4',
  'Control Weather':'Level=C7,D7,S7,W7,Weather7',
  'Control Winds':'Level=Air5,D5,Weather6',
  'Create Food And Water':'Level=C3',
  'Create Greater Undead':'Level=C8,Death8,S8,W8',
  'Create Undead':'Level=C6,Death6,Evil6,S6,W6',
  'Create Water':'Level=Adept0,C0,D0,P1,Talent0',
  'Creeping Doom':'Level=D7',
  'Crushing Despair':'Level=B3,S4,W4',
  'Crushing Hand':
    'Level=Strength9,S9,W9 ' +
    'Description="R%{100+lvl*10}\' 10\' hand (AC 20, %{hitPoints} HP) moves 60\'/rd, gives +4 AC, and performs +%{lvl+13} bull rush and +%{lvl+13} grapple that inflicts 2d6+12 HP for %{lvl} rd"',
  'Cure Critical Wounds':'Level=Adept4,B4,C4,D5,Healing4',
  'Cure Light Wounds':'Level=Adept1,B1,C1,D1,Healing1,P1,R2 Liquid=Potion',
  'Cure Moderate Wounds':'Level=Adept2,B2,C2,D3,Healing2,P3,R3 Liquid=Potion',
  'Cure Serious Wounds':'Level=Adept3,B3,C3,D4,Healing3,P4,R4 Liquid=Potion',
  'Curse Water':'Level=C1',
  'Dancing Lights':'Level=B0,Talent0,S0,W0',
  'Darkness':
    'Level=Adept2,B2,C2,S2,W2 ' +
    'Description="Touched reduces light level by 1 in 20\' radius for %{lvl} min" ' +   'Liquid=Oil',
  'Darkvision':'Level=R3,S2,W2 Liquid=Potion',
  'Daylight':
    'Level=Adept3,B3,C3,D3,P3,S3,W3 ' +
    'Description="Touched increases light level by 1 in 60\' radius for %{lvl*10} min" ' +
    'Liquid=Oil',
  'Daze':'Level=B0,Talent0,S0,W0',
  'Daze Monster':'Level=B2,S2,W2',
  'Death Knell':'Level=C2,Death2',
  'Death Ward':
    'Level=C4,D5,Death4,Repose4,P4 ' +
    'Description="Touched gains +4 saves vs. death spells and death effects and immunity to energy drain and negative energy effects for %{lvl} min"',
  'Deathwatch':'Level=C1,Repose1',
  'Deep Slumber':'Level=B3,S3,W3',
  'Deeper Darkness':
    'Level=Adept3,C3,Darkness3 ' +
    'Description="Touched reduces light level by 2 in 60\' radius for %{lvl} min"',
  'Delay Poison':'Level=Adept2,B2,C2,D2,P2,R1 Liquid=Potion',
  'Delayed Blast Fireball':'Level=S7,W7',
  'Demand':'Level=Charm8,Nobility8,S8,W8',
  'Desecrate':
    'Level=C2 ' +
    'Description="R%{25+lvl//2*5}\' 20\' radius gives +3 DC vs. negative channel, undead +1 attack, damage, saves, and 1 temporary HP/HD for %{lvl*2} hr"',
  'Destruction':
    'Level=C7,Death7,Repose7 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers %{lvl*10} HP, consumed if slain (Fort 10d6 HP)"',
  'Detect Animals Or Plants':'Level=D1,R1',
  'Detect Chaos':'Level=Adept1,C1',
  'Detect Evil':'Level=Adept1,C1',
  'Detect Good':'Level=Adept1,C1',
  'Detect Law':'Level=Adept1,C1',
  'Detect Magic':'Level=Adept0,B0,C0,D0,Talent0,S0,W0',
  'Detect Poison':'Level=C0,D0,P1,R1,Talent0,S0,W0',
  'Detect Scrying':'Level=B4,S4,W4',
  'Detect Secret Doors':'Level=B1,S1,W1',
  'Detect Snares And Pits':'Level=D1,R1',
  'Detect Thoughts':'Level=B2,Knowledge2,S2,W2',
  'Detect Undead':'Level=C1,P1,S1,W1',
  'Dictum':
    'Level=C7,Law7 ' +
    'Description="Nonlawful creatures in 40\' radius with equal/-1/-5/-10 HD deafened for 1d4 rd (Will neg)/staggered for 2d4 rd (Will for 1d4 rd)/paralyzed for 1d10 min (Will for 1 rd)/killed (Will suffer 3d6+%{lvl} HP) and banished (Will -4 neg)"',
  'Dimension Door':'Level=B4,Travel4,S4,W4',
  'Dimensional Anchor':'Level=C4,S4,W4',
  'Dimensional Lock':'Level=C8,S8,W8',
  'Diminish Plants':'Level=D3,R3',
  'Discern Lies':'Level=C4,Nobility4,P3',
  'Discern Location':'Level=C8,Knowledge8,S8,W8',
  'Disguise Self':'Level=B1,Trickery1,S1,W1',
  'Disintegrate':'Level=Destruction7,S6,W6',
  'Dismissal':
    'Level=C4,S5,W5 ' +
    'Description="R%{25+lvl//2*5}\' Returns target to native plane (Will neg)"',
  'Dispel Chaos':'Level=C5,Law5,P4',
  'Dispel Evil':'Level=C5,Good5,P4',
  'Dispel Good':'Level=C5,Evil5',
  'Dispel Law':'Level=C5,Chaos5',
  'Dispel Magic':
    'Level=B3,C3,D4,Magic3,P3,S3,W3 Liquid=Potion ' +
    'Description="R%{100+lvl*10}\' Successful d20+%{lvl} check vs. 11+caster level cancels targeted spell or 1 spell on targeted creature"',
  'Displacement':'Level=B3,S3,W3 Liquid=Potion',
  'Disrupt Undead':'Level=Talent0,S0,W0',
  'Disrupting Weapon':'Level=C5',
  'Divination':'Level=C4,Knowledge4',
  'Divine Favor':'Level=C1,Nobility1,P1',
  'Divine Power':
    'Level=C4,War4 ' +
    'Description="Self gains +%{lvl//3<?6} attack, damage, Strength checks, and Strength-based skill checks, +%{lvl} temporary HP, and extra attack for %{lvl} rd"',
  'Dominate Animal':'Level=Animal3,D3',
  'Dominate Monster':'Level=Charm9,S9,W9',
  'Dominate Person':'Level=B4,S5,W5',
  'Doom':'Level=C1',
  'Dream':'Level=B5,S5,W5',
  'Eagle\'s Splendor':'Level=B2,C2,P2,S2,W2 Liquid=Potion',
  'Earthquake':'Level=C8,D8,Destruction8,Earth8',
  'Elemental Swarm':'Level=Air9,D9,Earth9,Fire9,Water9',
  'Endure Elements':'Level=Adept1,C1,D1,P1,R1,Sun1,S1,W1 Liquid=Potion',
  'Energy Drain':'Level=C9,S9,W9',
  'Enervation':'Level=S4,W4',
  'Enlarge Person':'Level=Strength1,S1,W1 Liquid=Potion',
  'Entangle':
    'Level=D1,Plant1,R1 ' +
    'Description="R%{400+lvl*40}\' Creatures in 40\' radius entangled for %{lvl} min (Ref neg)"',
  'Enthrall':'Level=B2,C2,Nobility2',
  'Entropic Shield':'Level=C1',
  'Erase':'Level=B1,Rune1,S1,W1 Liquid=Oil',
  'Ethereal Jaunt':'Level=C7,S7,W7',
  'Etherealness':'Level=C9,S9,W9',
  'Expeditious Retreat':'Level=B1,S1,W1',
  'Explosive Runes':'Level=Rune4,S3,W3',
  'Eyebite':'Level=B6,S6,W6',
  'Fabricate':'Level=Artifice5,S5,W5',
  'Faerie Fire':'Level=D1',
  'False Life':'Level=S2,W2',
  'False Vision':'Level=B5,Trickery5,S5,W5',
  'Fear':'Level=B3,S4,W4',
  'Feather Fall':'Level=B1,S1,W1',
  'Feeblemind':'Level=S5,W5',
  'Find The Path':'Level=B6,C6,D6,Knowledge6,Travel6',
  'Find Traps':
    'Level=C2 ' +
    'Description="Self gains +%{lvl//2<?10} Perception to uncover traps for %{lvl} min"',
  'Finger Of Death':
    'Level=D8,S7,W7 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers %{lvl*10} HP (Fort 3d6+%{lvl} HP)"',
  'Fire Seeds':
    'Level=D6,Fire6,Sun6 ' +
    'Description="Touched 4 acorn grenades inflict %{lvl<?20}d4 total or 8 berry bombs detonate on command to inflict 1d8+%{lvl} in 5\' radius (Ref half) for %{lvl*10} min"',
  'Fire Shield':'Level=Fire5,Sun4,S4,W4',
  'Fire Storm':
    'Level=C8,D7 ' +
    'Description="R%{100+lvl*10}\' %{lvl*2} 10\' cu inflicts %{lvl<?20}d6 HP, then 4d6 HP/rd until extinguished (Ref half, initial damage only)"',
  'Fire Trap':'Level=D2,S4,W4 Liquid=Oil',
  'Fireball':'Level=Fire3,S3,W3',
  'Flame Arrow':'Level=S3,W3 Liquid=Oil',
  'Flame Blade':'Level=D2',
  'Flame Strike':'Level=C5,D4,Sun5,War5',
  'Flaming Sphere':
    'Level=D2,S2,W2 ' +
    'Description="R%{100+lvl*10}\' 5\' diameter sphere inflicts 3d6 HP (Ref neg), jumps or moves 30\'/rd for %{lvl} rd"',
  'Flare':'Level=B0,D0,Talent0,S0,W0',
  'Flesh To Stone':'Level=S6,W6',
  'Floating Disk':'Level=S1,W1',
  'Fly':
    'Level=Travel3,S3,W3 ' +
    'Description="Touched gains 60\' fly Speed and +%{lvl//2} Fly skill for %{lvl} min" ' +
    'Liquid=Potion',
  'Fog Cloud':'Level=D2,S2,W2,Water2,Weather2',
  'Forbiddance':'Level=C6',
  'Forcecage':
    'Level=S7,W7 ' +
    'Description="R%{25+lvl//2*5}\' Traps targets in 20\' cage or 10\' cube for %{lvl} rd"',
  'Forceful Hand':
    'Level=S6,W6 ' +
    'Description="R%{100+lvl*10}\' 10\' hand (AC 20, %{hitPoints} HP) moves 60\'/rd, gives +4 AC, and performs %{lvl+9} bull rush for %{lvl} rd"',
  'Foresight':'Level=D9,Knowledge9,S9,W9',
  'Fox\'s Cunning':'Level=B2,S2,W2 Liquid=Potion',
  'Freedom':'Level=Liberation9,S9,W9',
  'Freedom Of Movement':'Level=B4,C4,D4,Liberation4,Luck4,R4',
  'Freezing Sphere':
    'Level=S6,W6 ' +
    'Description="R%{400+lvl*40}\' 40\' radius inflicts %{lvl<?15}d6 HP (Ref half)"',
  'Gaseous Form':
    'Level=Air3,B3,S3,W3 ' +
    'Description="Touched becomes insubstantial (DR 10/magic, immune to poison, Sneak Attacks, and critical hits, unable to use spell components, fly 10\') for %{lvl*2} min" ' +
    'Liquid=Potion',
  'Gate':'Level=C9,Glory9,S9,W9',
  'Geas/Quest':'Level=B6,C6,Charm6,Nobility6,S6,W6',
  'Gentle Repose':'Level=C2,Repose2,S3,W3 Liquid=Oil',
  'Ghost Sound':'Level=Adept0,B0,Talent0,S0,W0',
  'Ghoul Touch':'Level=S2,W2',
  'Giant Vermin':
    'Level=C4,D4 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl<10?3:lvl<14?4:lvl<18?6:lvl<20?8:12} centipedes, %{lvl<10?2:lvl<14?3:lvl<18?4:lvl<20?5:8} spiders, or %{lvl<10?1:lvl<14?2:lvl<18?3:lvl<20?4:6} scorpions in 15\' radius become giant and obey self for %{lvl} min"',
  'Glibness':
    'Level=B3 ' +
    'Description="Self gains +20 Bluff, SR %{lvl+15} (magical lie detection) for %{lvl*10} min"',
  'Glitterdust':'Level=B2,S2,W2',
  'Globe Of Invulnerability':'Level=S6,W6',
  'Glyph Of Warding':'Level=C3,Rune3',
  'Good Hope':'Level=B3 Liquid=Potion',
  'Goodberry':'Level=D1 Liquid=Oil',
  'Grasping Hand':
    'Level=Strength7,S7,W7 ' +
    'Description="R%{100+lvl*10}\' 10\' hand (AC 20, %{hitPoints} HP) moves 60\'/rd, gives +4 AC, and performs +%{lvl+11} bull rush and +%{lvl+11} grapple for %{lvl} rd"',
  'Grease':
    'Level=B1,S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Object or 10\' sq becomes slippery, causing falls (Ref DC 10 Acrobatics for half Speed) for %{lvl} min" ' +
    'Liquid=Oil',
  'Greater Arcane Sight':'Level=S7,W7',
  'Greater Command':'Level=C5,Nobility5',
  'Greater Dispel Magic':
    'Level=B5,C6,Liberation6,D6,S6,W6 ' +
    'Description="R%{100+lvl*10}\' Successful d20+%{lvl<?20} check vs. 11+caster level cancels %{lvl//4} targeted spells or 1 spell or curse on each creature in a 20\' radius"',
  'Greater Glyph Of Warding':'Level=C6,Rune6',
  'Greater Heroism':'Level=B5,S6,W6',
  'Greater Invisibility':'Level=B4,S4,W4',
  'Greater Magic Fang':'Level=D3,R3 Liquid=Potion',
  'Greater Magic Weapon':'Level=C4,P3,S3,W3 Liquid=Oil',
  'Greater Planar Ally':'Level=C8',
  'Greater Planar Binding':'Level=S8,W8',
  'Greater Prying Eyes':
    'Level=S8,W8 ' +
    'Description="1d4+%{lvl} floating eyes (AC 18, 1 HP, +16 Stealth, +%{lvl<?25} Perception, Fly 30\') with True Seeing scout 1 mile for %{lvl} hr"',
  'Greater Restoration':'Level=C7',
  'Greater Scrying':'Level=B6,C7,D7,S7,W7',
  'Greater Shadow Conjuration':'Level=S7,W7',
  'Greater Shadow Evocation':'Level=Darkness8,S8,W8',
  'Greater Shout':'Level=B6,S8,W8',
  'Greater Spell Immunity':'Level=C8',
  'Greater Teleport':'Level=Travel7,S7,W7',
  'Guards And Wards':'Level=S6,W6',
  'Guidance':'Level=Adept0,C0,D0,Talent0 Liquid=Potion',
  'Gust Of Wind':'Level=D2,S2,W2',
  'Hallow':
    'Level=C5,D5 ' +
    'Description="40\' radius from touched gives +2 AC and saves vs. evil, suppresses mental control, bars contact by summoned evil creatures, prevents undead creation, gives positive channeling +4 DC and negative channeling -4 DC, and evokes boon spell"',
  'Hallucinatory Terrain':'Level=B4,S4,W4',
  'Halt Undead':'Level=S3,W3',
  'Harm':'Level=C6,Destruction6',
  'Haste':'Level=B3,S3,W3 Liquid=Potion',
  'Heal':'Level=Adept5,C6,D7,Healing6',
  'Heal Mount':'Level=P3',
  'Heat Metal':'Level=D2,Sun2',
  'Helping Hand':'Level=C3',
  'Heroes\' Feast':
    'Level=B6,C6,Community6 ' +
    'Description="R%{25+lvl//2*5}\' Food for %{lvl} creatures cures sickness, poison, and disease, gives 1d8+%{lvl//2<?10} temporary HP, +1 attack and Will saves, and +4 vs. poison and fear for 12 hr"',
  'Heroism':'Level=B2,Charm4,S3,W3 Liquid=Potion',
  'Hide From Animals':'Level=D1,R1 Liquid=Potion',
  'Hide From Undead':'Level=C1 Liquid=Potion',
  'Hideous Laughter':'Level=B1,S2,W2',
  'Hold Animal':'Level=Animal2,D2,R2',
  'Hold Monster':'Level=B4,Law6,S5,W5',
  'Hold Person':'Level=B2,C2,S3,W3',
  'Hold Portal':'Level=S1,W1 Liquid=Oil',
  'Holy Aura':'Level=C8,Glory8,Good8',
  'Holy Smite':'Level=C4,Glory4,Good4',
  'Holy Sword':'Level=Glory7,P4',
  'Holy Word':
    'Level=C7,Good7 ' +
    'Description="Nongood creatures in 40\' radius with equal/-1/-5/-10 HD deafened for 1d4 rd (Will neg)/blinded for 2d4 rd (Will for 1d4 rd)/paralyzed for 1d10 min (Will for 1 rd)/killed (Will suffer 3d6+%{lvl} HP) and banished (Will neg)"',
  'Horrid Wilting':'Level=Water8,S8,W8',
  'Hypnotic Pattern':'Level=B2,S2,W2',
  'Hypnotism':'Level=B1,S1,W1',
  'Ice Storm':
    'Level=D4,S4,W4,Water5,Weather5 ' +
    'Description="R%{400+lvl*40}\' Hail in 20\' radius inflicts 3d6 HP bludgeoning, 2d6 HP cold, and -4 Perception for %{lvl} rd"',
  'Identify':
    'Level=Magic1,B1,S1,W1 ' +
    'Description="R60\' Cone gives self info on magical auras, +10 Spellcraft (item properties) for conc or %{lvl*3} rd"',
  'Illusory Script':'Level=B3,S3,W3',
  'Illusory Wall':'Level=S4,W4',
  'Imbue With Spell Ability':'Level=C4,Community4,Magic4',
  'Implosion':
    'Level=C9,Destruction9 ' +
    'Description="R%{25+lvl//2*5}\' 1 target/rd suffers %{lvl*10} HP for conc or %{lvl//2} rd (Fort neg)"',
  'Imprisonment':'Level=S9,W9',
  'Incendiary Cloud':
    'Level=Fire8,S8,W8 ' +
    'Description="R%{100+lvl*10}\' Fire in 20\' radius inflicts 6d6 HP (Ref half) while moving away 10\'/rd for %{lvl} rd"',
  'Inflict Critical Wounds':'Level=C4,Destruction4',
  'Inflict Light Wounds':'Level=C1',
  'Inflict Moderate Wounds':'Level=C2',
  'Inflict Serious Wounds':'Level=C3',
  'Insanity':
    'Level=Charm7,Madness7,S7,W7 ' +
    'Description="R%{100+lvl*10}\' Target permanently randomly 25% acts normal/25% babbles/25% attacks themselves/25% attacks nearest permanently (Will neg)"',
  'Insect Plague':
    'Level=C5,D5 ' +
    'Description="R%{400+lvl*40}\' %{lvl//3<?6} wasp swarms inflict 2d6 HP and -1 Dexterity (DC 13 Fort neg) for %{lvl} min"',
  'Instant Summons':'Level=Rune7,S7,W7',
  'Interposing Hand':'Level=S5,W5',
  'Invisibility':'Level=Adept2,B2,Trickery2,S2,W2 Liquid=Oil,Potion',
  'Invisibility Purge':'Level=C3',
  'Invisibility Sphere':'Level=B3,S3,W3',
  'Iron Body':
    'Level=S8,W8 ' +
    'Description="Self becomes iron (+6 Strength, -6 Dexterity, half Speed, 35% arcane failure, -6 skill, DR 15/adamantine, half damage from acid and fire, immunity to other attacks and effects) for %{lvl} min"',
  'Ironwood':'Level=D6',
  'Irresistible Dance':
    'Level=B6,S8,W8 ' +
    'Description="Touched dances (-4 AC, -10 Reflex) for d4+1 rd (Will for 1 rd)"',
  'Jump':
    'Level=D1,R1,S1,W1 ' +
    'Description="Touched +%{lvl<5?10:lvl<9?20:30} Acrobatics (jump) for %{lvl} min" ' +
    'Liquid=Potion',
  'Keen Edge':'Level=S3,W3 Liquid=Oil',
  'Knock':'Level=S2,W2',
  'Know Direction':'Level=B0,D0,Talent0',
  'Legend Lore':'Level=B4,Knowledge7,S6,W6',
  'Lesser Confusion':
    'Level=B1,Madness1 ' +
    'Description="R%{100+lvl*10}\' Target randomly 25% acts normal/25% babbles/25% attacks themselves/25% attacks nearest for 1 rd (Will neg)"',
  'Lesser Geas':'Level=B3,S4,W4',
  'Lesser Globe Of Invulnerability':'Level=S4,W4',
  'Lesser Planar Ally':'Level=C4',
  'Lesser Planar Binding':'Level=Rune5,S5,W5',
  'Lesser Restoration':'Level=C2,D2,P1 Liquid=Potion',
  'Levitate':'Level=S2,W2 Liquid=Oil,Potion',
  'Light':
    'Level=Adept0,B0,C0,D0,Talent0,S0,W0 ' +
    'Description="Touched gives 20\' normal light for %{lvl*10} min" ' +
    'Liquid=Oil',
  'Lightning Bolt':'Level=Adept3,S3,W3',
  'Limited Wish':'Level=S7,W7',
  'Liveoak':'Level=D6',
  'Locate Creature':'Level=B4,S4,W4',
  'Locate Object':'Level=B2,C3,Travel2,S2,W2',
  'Longstrider':'Level=D1,R1,Travel1', // no liquid--personal
  'Lullaby':
    'Level=B0,Talent0 ' +
    'Description="R%{100+lvl*10}\' Creatures in 10\' radius suffer -5 Perception, -2 Will vs. sleep for conc + %{lvl} rd (Will neg)"',
  'Mage Armor':'Level=S1,W1 Liquid=Potion',
  'Mage Hand':'Level=B0,Talent0,S0,W0',
  'Mage\'s Disjunction':'Level=Magic9,S9,W9',
  'Mage\'s Faithful Hound':'Level=S5,W5',
  'Mage\'s Lucubration':'Level=S6,W6',
  'Mage\'s Magnificent Mansion':'Level=S7,W7',
  'Mage\'s Private Sanctum':'Level=S5,W5',
  'Mage\'s Sword':'Level=S7,W7',
  'Magic Aura':'Level=B1,S1,W1',
  'Magic Circle Against Chaos':
    'Level=C3,Law3,P3,S3,W3 ' +
    'Description="10\' radius from touched gives +2 AC and saves vs. chaotic creatures, extra save to suppress mental control, bars contact and entry (SR neg) by chaotic summoned creatures for %{lvl*10} min or traps nonlawful summoned creatures (SR neg) for %{lvl} dy" ' +
    'Liquid=Potion',
  'Magic Circle Against Evil':
    'Level=C3,Good3,P3,S3,W3 ' +
    'Description="10\' radius from touched gives +2 AC and saves vs. evil creatures, extra save to suppress mental control, bars contact and entry (SR neg) by evil summoned creatures for %{lvl*10} min or traps nongood summoned creatures (SR neg) for %{lvl} dy" ' +
    'Liquid=Potion',
  'Magic Circle Against Good':
    'Level=C3,Evil3,S3,W3 ' +
    'Description="10\' radius from touched gives +2 AC and saves vs. good creatures, extra save to suppress mental control, bars contact and entry (SR neg) by good summoned creatures for %{lvl*10} min or traps nonevil summoned creatures (SR neg) for %{lvl} dy" ' +
    'Liquid=Potion',
  'Magic Circle Against Law':
    'Level=C3,Chaos3,S3,W3 ' +
    'Description="10\' radius from touched gives +2 AC and saves vs. lawful creatures, extra save to suppress mental control, bars contact and entry (SR neg) by lawful summoned creatures for %{lvl*10} min or traps nonchaotic summoned creatures (SR neg) for %{lvl} dy" ' +
    'Liquid=Potion',
  'Magic Fang':'Level=D1,R1 Liquid=Potion',
  'Magic Jar':'Level=S5,W5',
  'Magic Missile':'Level=S1,W1',
  'Magic Mouth':'Level=B1,Magic2,S2,W2',
  'Magic Stone':'Level=C1,D1,Earth1 Liquid=Oil',
  'Magic Vestment':'Level=C3,Nobility3,Strength3,War3 Liquid=Oil',
  'Magic Weapon':'Level=C1,P1,S1,W1,War1 Liquid=Oil',
  'Major Creation':'Level=Adept5,Artifice6,S5,W5',
  'Major Image':'Level=B3,S3,W3',
  'Make Whole':'Level=C2,S2,W2 Liquid=Oil',
  'Mark Of Justice':'Level=C5,P4',
  'Mass Bear\'s Endurance':'Level=C6,D6,S6,W6',
  'Mass Bull\'s Strength':'Level=C6,D6,S6,W6',
  'Mass Cat\'s Grace':'Level=B6,D6,S6,W6',
  'Mass Charm Monster':'Level=B6,S8,W8',
  'Mass Cure Critical Wounds':'Level=C8,Community8,D9,Healing8',
  'Mass Cure Light Wounds':'Level=B5,C5,D6',
  'Mass Cure Moderate Wounds':'Level=B6,C6,D7',
  'Mass Cure Serious Wounds':'Level=C7,D8',
  'Mass Eagle\'s Splendor':'Level=B6,C6,S6,W6',
  'Mass Enlarge Person':'Level=S4,W4',
  'Mass Fox\'s Cunning':'Level=B6,S6,W6',
  'Mass Heal':'Level=C9,Healing9',
  'Mass Hold Monster':'Level=S9,W9',
  'Mass Hold Person':'Level=S7,W7',
  'Mass Inflict Critical Wounds':'Level=C8',
  'Mass Inflict Light Wounds':'Level=C5',
  'Mass Inflict Moderate Wounds':'Level=C6',
  'Mass Inflict Serious Wounds':'Level=C7',
  'Mass Invisibility':'Level=Trickery8,S7,W7',
  'Mass Owl\'s Wisdom':'Level=C6,D6,S6,W6',
  'Mass Reduce Person':'Level=S4,W4',
  'Mass Suggestion':'Level=B5,S6,W6',
  'Maze':'Level=S8,W8',
  'Meld Into Stone':'Level=C3,D3',
  'Mending':
    'Level=Adept0,Artifice0,B0,C0,D0,Talent0,S0,W0 ' + // no liquid--10 min cast
    'Description="R10\' Repairs minor damage to %{lvl} lb object"',
  'Message':'Level=B0,Talent0,S0,W0',
  'Meteor Swarm':'Level=S9,W9',
  'Mind Blank':
    'Level=Liberation8,Protection8,S8,W8 ' +
    'Description="R%{25+lvl//2*5}\' Target gains immunity to divination and +8 save vs. mental effects for 1 dy"',
  'Mind Fog':'Level=B5,S5,W5',
  'Minor Creation':'Level=Adept4,Artifice4,S4,W4',
  'Minor Image':'Level=B2,S2,W2',
  'Miracle':'Level=C9,Community9,Luck9',
  'Mirage Arcana':'Level=B5,S5,W5',
  'Mirror Image':'Level=Adept2,B2,Trickery2,S2,W2',
  'Misdirection':'Level=B2,S2,W2 Liquid=Potion',
  'Mislead':'Level=B5,Luck6,Trickery6,S6,W6',
  'Mnemonic Enhancer':'Level=S4,W4',
  'Modify Memory':'Level=B4',
  'Moment Of Prescience':'Level=Luck8,S8,W8',
  'Mount':'Level=S1,W1',
  'Move Earth':'Level=D6,S6,W6',
  'Neutralize Poison':'Level=Adept3,B4,C4,D3,P4,R3 Liquid=Potion',
  'Nightmare':'Level=B5,Madness5,S5,W5',
  'Nondetection':'Level=R4,Trickery3,S3,W3 Liquid=Potion',
  'Obscure Object':'Level=B1,C3,S2,W2 Liquid=Oil',
  'Obscuring Mist':'Level=Adept1,Air1,C1,D1,Darkness1,Water1,S1,W1,Weather1',
  'Open/Close':'Level=B0,Talent0,S0,W0',
  'Order\'s Wrath':'Level=C4,Law4',
  'Overland Flight':
    'Level=S5,W5 ' +
    'Description="Self gains 40\' fly Speed and +%{lvl//2} Fly skill for %{lvl} hr"',
  'Owl\'s Wisdom':'Level=C2,D2,P2,R2,S2,W2 Liquid=Potion',
  'Passwall':'Level=S5,W5',
  'Pass Without Trace':'Level=D1,R1 Liquid=Potion',
  'Permanency':'Level=S5,W5',
  'Permanent Image':'Level=B6,S6,W6',
  'Persistent Image':'Level=B5,S5,W5',
  'Phantasmal Killer':'Level=Madness6,S4,W4',
  'Phantom Steed':
    'Level=B3,S3,W3 ' +
    'Description="Creates mount (%{lvl+7} HP, AC 18, move %{lvl//2*20<?100}\') that only target can ride for %{lvl} hr"',
  'Phantom Trap':'Level=S2,W2',
  'Phase Door':'Level=Travel8,S7,W7',
  'Planar Ally':'Level=C6',
  'Planar Binding':'Level=S6,W6',
  'Plane Shift':'Level=C5,S7,W7',
  'Plant Growth':'Level=D3,Plant3,R3',
  'Poison':
    'Level=C4,D3 ' +
    'Description="Touched suffers -1d3 Constitution/rd for 6 rd (Fort neg)"',
  'Polar Ray':
    'Level=S8,W8 ' +
    'Description="R%{100+lvl*10}\' Ranged touch inflicts %{lvl<?25}d6 HP, -1d4 Dexterity"',
  'Polymorph':'Level=Adept4,S5,W5',
  'Polymorph Any Object':'Level=S8,W8',
  'Power Word Blind':'Level=Darkness7,S7,W7,War7',
  'Power Word Kill':'Level=S9,W9,War9',
  'Power Word Stun':'Level=S8,W8,War8',
  'Prayer':'Level=C3,Community3,P3',
  'Prestidigitation':'Level=B0,Talent0,S0,W0',
  'Prismatic Sphere':'Level=Artifice9,Protection9,Sun9,S9,W9',
  'Prismatic Spray':'Level=S7,W7',
  'Prismatic Wall':'Level=S8,W8',
  'Produce Flame':'Level=D1,Fire2',
  'Programmed Image':'Level=B6,S6,W6',
  'Project Image':'Level=B6,S7,W7',
  'Protection From Arrows':'Level=S2,W2 Liquid=Potion',
  'Protection From Chaos':
    'Level=Adept1,C1,Law1,P1,S1,W1 Liquid=Potion ' +
    'Description="Touched gains +2 AC and saves vs. chaotic creatures, suppresses mental control, and bars contact by chaotic summoned creatures for %{lvl} min"',
  'Protection From Energy':
    'Level=C3,D3,Luck3,Protection3,R2,S3,W3 Liquid=Potion',
  'Protection From Evil':
    'Level=Adept1,C1,Good1,P1,S1,W1 Liquid=Potion ' +
    'Description="Touched gains +2 AC and saves vs. evil creatures, suppresses mental control, and bars contact by evil summoned creatures for %{lvl} min"',
  'Protection From Good':
    'Level=Adept1,C1,Evil1,S1,W1 Liquid=Potion ' +
    'Description="Touched gains +2 AC and saves vs. good creatures, suppresses mental control, and bars contact by good summoned creatures for %{lvl} min"',
  'Protection From Law':
    'Level=Adept1,C1,Chaos1,S1,W1 Liquid=Potion ' +
    'Description="Touched gains +2 AC and saves vs. lawful creatures, suppresses mental control, and bars contact by lawful summoned creatures for %{lvl} min"',
  'Protection From Spells':'Level=Magic8,S8,W8',
  'Prying Eyes':
    'Level=S5,W5 ' +
    'Description="1d4+%{lvl} floating eyes (AC 18, 1 HP, +16 Stealth, +%{lvl<?15} Perception, Fly 30\') scout 1 mile for %{lvl} hr"',
  'Purify Food And Drink':'Level=Adept0,C0,D0,Talent0 Liquid=Oil',
  'Pyrotechnics':'Level=B2,S2,W2',
  'Quench':'Level=D3',
  'Rage':'Level=B2,Destruction3,Madness3,S3,W3 Liquid=Potion',
  'Rainbow Pattern':'Level=B4,S4,W4',
  'Raise Dead':'Level=Adept5,C5',
  'Ray Of Enfeeblement':
    'Level=S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Ranged touch inflicts -1d6+%{lvl//2<?5} Strength for %{lvl} rd"',
  'Ray Of Exhaustion':'Level=S3,W3',
  'Ray Of Frost':'Level=Talent0,S0,W0',
  'Read Magic':'Level=Adept0,B0,C0,D0,P1,R1,Talent0,S0,W0',
  'Reduce Animal':'Level=D2,R3 Liquid=Potion',
  'Reduce Person':'Level=S1,W1 Liquid=Potion',
  'Refuge':'Level=C7,Community7,Liberation7,S9,W9',
  'Regenerate':'Level=C7,D9,Healing7',
  'Reincarnate':'Level=D4',
  'Remove Blindness/Deafness':'Level=C3,P3 Liquid=Potion',
  'Remove Curse':
    'Level=Adept3,B3,C3,Liberation3,P3,S4,W4 ' +
    'Description="Self makes caster level check to dispel all curses from touched" ' +
    'Liquid=Potion',
  'Remove Disease':
    'Level=Adept3,C3,D3,R3 ' +
    'Description="Self makes caster level check to cure touched of all diseases" ' +
    'Liquid=Potion',
  'Remove Fear':'Level=B1,C1,Liberation1 Liquid=Potion',
  'Remove Paralysis':'Level=C2,Liberation2,P2 Liquid=Potion',
  'Repel Metal Or Stone':'Level=D8',
  'Repel Vermin':'Level=B4,C4,D4,R3',
  'Repel Wood':'Level=D6,Plant6',
  'Repulsion':'Level=C7,Nobility7,Protection7,S6,W6',
  'Resilient Sphere':'Level=S4,W4',
  'Resist Energy':
    'Level=Adept2,C2,D2,P2,R1,S2,W2 Liquid=Potion',
  'Resistance':'Level=B0,C0,D0,P1,Talent0,S0,W0 Liquid=Potion',
  'Restoration':'Level=Adept4,C4,P4',
  'Resurrection':'Level=C7',
  'Reverse Gravity':
    'Level=D8,S7,W7 ' +
    'Description="R%{100+lvl*10}\' Objects in %{lvl} 10\' cu fall upward for %{lvl} rd"',
  'Righteous Might':
    'Level=C5,Glory5,Strength5 ' +
    'Description="Self dbl size (+4 Str, +2 Con, -2 Dex, +2 AC) and gains DR %{lvl>14?10:5}/evil or DR %{lvl>14?10:5}/good for %{lvl} rd"',
  'Rope Trick':'Level=S2,W2 Liquid=Oil',
  'Rusting Grasp':'Level=D4',
  'Sanctuary':'Level=C1,Glory1,Protection1 Liquid=Potion',
  'Scare':'Level=B2,S2,W2',
  'Scintillating Pattern':'Level=Madness8,S8,W8',
  'Scorching Ray':'Level=Adept2,S2,W2',
  'Screen':'Level=Trickery7,S8,W8',
  'Scrying':'Level=B3,C5,D4,S4,W4',
  'Sculpt Sound':'Level=B3',
  'Searing Light':'Level=C3,Glory3,Sun3',
  'Secret Chest':'Level=S5,W5',
  'Secret Page':'Level=B3,Rune2,S3,W3',
  'Secure Shelter':'Level=B4,S4,W4',
  'See Invisibility':'Level=Adept2,B3,S2,W2',
  'Seeming':'Level=B5,S5,W5',
  'Sending':'Level=C4,S5,W5',
  'Sepia Snake Sigil':'Level=B3,S3,W3',
  'Sequester':'Level=S7,W7',
  'Shades':'Level=Darkness9,S9,W9',
  'Shadow Conjuration':'Level=B4,Darkness4,S4,W4',
  'Shadow Evocation':'Level=B5,S5,W5',
  'Shadow Walk':'Level=B5,Darkness6,S6,W6',
  'Shambler':
    'Level=D9,Plant9 ' +
    'Description="R%{100+lvl*10}\' Creates 1d4+2 advanced shambling mounds in 15\' radius that fight for 7 dy or guard for 7 mo"',
  'Shapechange':'Level=Animal9,D9,S9,W9',
  'Shatter':'Level=B2,C2,Destruction2,S2,W2',
  'Shield':'Level=S1,W1',
  'Shield Of Faith':'Level=C1,Glory1 Liquid=Potion',
  'Shield Of Law':'Level=C8,Law8',
  'Shield Other':'Level=C2,Community2,Protection2,P2',
  'Shillelagh':'Level=D1 Liquid=Oil',
  'Shocking Grasp':'Level=S1,W1',
  'Shout':'Level=B4,Destruction5,S4,W4',
  'Shrink Item':'Level=S3,W3 Liquid=Oil',
  'Silence':
    'Level=B2,C2 ' +
    'Description="R%{400+lvl*40}\' Bars sound in 20\' radius (Will neg if targeted) for %{lvl} rd"',
  'Silent Image':'Level=B1,S1,W1',
  'Simulacrum':'Level=S7,W7',
  'Slay Living':
    'Level=C5,Death5,Repose5 ' +
    'Description="Touched suffers 12d6+%{lvl} HP (Fort 3d6+%{lvl} HP)"',
  'Sleep':'Level=Adept1,B1,S1,W1',
  'Sleet Storm':
    'Level=D3,S3,W3,Weather4 ' +
    'Description="R%{400+lvl*40}\' Sleet in 40\' radius binds, inflicts DC 10 Acrobatics to move for %{lvl} rd"',
  'Slow':'Level=B3,S3,W3',
  'Snare':'Level=D3,R2',
  'Soften Earth And Stone':'Level=D2,Earth2',
  'Solid Fog':
    'Level=S4,W4 ' +
    'Description="R%{100+lvl*10}\' Fog in 20\' radius obscures vision, reduces Speed to half, and imposes -2 attack and damage for %{lvl} min"',
  'Song Of Discord':'Level=B5',
  'Soul Bind':'Level=C9,S9,W9',
  'Sound Burst':'Level=B2,C2',
  'Speak With Animals':'Level=Animal1,B3,D1,R1',
  'Speak With Dead':'Level=C3,Knowledge3,Repose3',
  'Speak With Plants':'Level=B4,D3,R2',
  'Spectral Hand':'Level=S2,W2',
  'Spell Immunity':'Level=C4,Protection4,Strength4',
  'Spell Resistance':'Level=C5,Magic5,Protection5',
  'Spell Turning':'Level=Luck7,Magic7,S7,W7',
  'Spellstaff':'Level=D6',
  'Spider Climb':'Level=D2,S2,W2 Liquid=Potion',
  'Spike Growth':'Level=D3,R2',
  'Spike Stones':'Level=D4,Earth4',
  'Spiritual Weapon':'Level=C2,War2',
  'Statue':'Level=Artifice8,S7,W7',
  'Status':'Level=C2',
  'Stinking Cloud':'Level=S3,W3',
  'Stone Shape':'Level=Artifice3,C3,D3,Earth3,S4,W4 Liquid=Oil',
  'Stone Tell':'Level=D6',
  'Stone To Flesh':'Level=S6,W6',
  'Stoneskin':'Level=Adept4,D5,Earth6,Strength6,S4,W4',
  'Storm Of Vengeance':'Level=C9,D9,Nobility9,Weather9',
  'Suggestion':'Level=B2,Charm3,S3,W3',
  'Summon Instrument':'Level=B0,Talent0',
  'Summon Monster I':'Level=B1,C1,S1,W1',
  'Summon Monster II':'Level=B2,C2,S2,W2',
  'Summon Monster III':'Level=B3,C3,S3,W3',
  'Summon Monster IV':'Level=B4,C4,S4,W4',
  'Summon Monster IX':'Level=C9,Chaos9,Evil9,Good9,Law9,S9,W9',
  'Summon Monster V':'Level=B5,C5,Darkness5,S5,W5',
  'Summon Monster VI':'Level=B6,C6,S6,W6',
  'Summon Monster VII':'Level=C7,S7,W7',
  'Summon Monster VIII':'Level=C8,S8,W8',
  'Summon Nature\'s Ally I':'Level=D1,R1',
  'Summon Nature\'s Ally II':'Level=D2,R2',
  'Summon Nature\'s Ally III':'Level=D3,R3',
  'Summon Nature\'s Ally IV':'Level=Animal4,D4,R4',
  'Summon Nature\'s Ally IX':'Level=D9',
  'Summon Nature\'s Ally V':'Level=D5',
  'Summon Nature\'s Ally VI':'Level=D6',
  'Summon Nature\'s Ally VII':'Level=D7',
  'Summon Nature\'s Ally VIII':'Level=Animal8,D8',
  'Summon Swarm':'Level=B2,D2,S2,W2',
  'Sunbeam':'Level=D7,Sun7',
  'Sunburst':'Level=D8,Sun8,S8,W8',
  'Symbol Of Death':'Level=C8,Rune8,S8,W8',
  'Symbol Of Fear':'Level=C6,S6,W6',
  'Symbol Of Insanity':'Level=C8,S8,W8',
  'Symbol Of Pain':'Level=C5,S5,W5',
  'Symbol Of Persuasion':'Level=C6,S6,W6',
  'Symbol Of Sleep':'Level=C5,S5,W5',
  'Symbol Of Stunning':'Level=C7,S7,W7',
  'Symbol Of Weakness':'Level=C7,S7,W7',
  'Sympathetic Vibration':'Level=B6',
  'Sympathy':'Level=D9,S8,W8',
  'Telekinesis':'Level=S5,W5',
  'Telekinetic Sphere':'Level=S8,W8',
  'Telepathic Bond':'Level=Community5,S5,W5',
  'Teleport':'Level=Travel5,S5,W5',
  'Teleport Object':'Level=S7,W7',
  'Teleportation Circle':'Level=Rune9,S9,W9',
  'Temporal Stasis':'Level=S8,W8',
  'Time Stop':'Level=Trickery9,S9,W9',
  'Tiny Hut':'Level=B3,S3,W3',
  'Tongues':'Level=Adept3,B2,C4,S3,W3 Liquid=Potion',
  'Touch Of Fatigue':'Level=Adept0,Talent0,S0,W0',
  'Touch Of Idiocy':'Level=Madness2,S2,W2',
  'Transformation':'Level=S6,W6',
  'Transmute Metal To Wood':'Level=D7',
  'Transmute Mud To Rock':'Level=D5,S5,W5',
  'Transmute Rock To Mud':'Level=D5,S5,W5',
  'Transport Via Plants':'Level=D6',
  'Trap The Soul':'Level=S8,W8',
  'Tree Shape':'Level=D2,R3',
  'Tree Stride':'Level=D5,R4',
  'True Resurrection':'Level=C9',
  'True Seeing':'Level=Adept5,C5,D7,Knowledge5,S6,W6',
  'True Strike':'Level=Destruction1,Luck1,S1,W1',
  'Undeath To Death':'Level=C6,Glory6,Repose6,S6,W6',
  'Undetectable Alignment':'Level=B1,C2,P2 Liquid=Potion',
  'Unhallow':
    'Level=C5,D5 ' +
    'Description="40\' radius from touched gives +2 AC and saves vs. good, suppresses mental control, bars contact by summoned good creatures, gives negative channeling +4 DC and positive channeling -4 DC, and evokes bane spell"',
  'Unholy Aura':'Level=C8,Evil8',
  'Unholy Blight':'Level=C4,Evil4',
  'Unseen Servant':'Level=B1,S1,W1',
  'Vampiric Touch':'Level=S3,W3',
  'Veil':'Level=B6,S6,W6',
  'Ventriloquism':'Level=B1,S1,W1',
  'Virtue':'Level=C0,D0,P1,Talent0 Liquid=Potion',
  'Vision':'Level=S7,W7',
  'Wail Of The Banshee':
    'Level=Death9,Repose9,S9,W9 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 40\' radius suffer %{lvl*10} HP (Fort neg)"',
  'Wall Of Fire':'Level=Adept4,D5,Fire4,S4,W4',
  'Wall Of Force':'Level=S5,W5',
  'Wall Of Ice':'Level=S4,W4',
  'Wall Of Iron':'Level=Artifice7,S6,W6',
  'Wall Of Stone':'Level=Adept5,C5,D6,Earth5,S5,W5',
  'Wall Of Thorns':'Level=D5,Plant5',
  'Warp Wood':'Level=D2 Liquid=Oil',
  'Water Breathing':'Level=C3,D3,S3,W3,Water3 Liquid=Potion',
  'Water Walk':'Level=C3,R3 Liquid=Potion',
  'Waves Of Exhaustion':'Level=Repose8,S7,W7',
  'Waves Of Fatigue':'Level=S5,W5',
  'Web':
    'Level=Adept2,S2,W2 ' +
    'Description="R%{100+lvl*10}\' Webs in 20\' radius entangle (Ref neg, Str or Escape Artist break), burning inflicts 2d4 HP for %{lvl*10} min"',
  'Weird':'Level=Madness9,S9,W9',
  'Whirlwind':'Level=Air8,D8,Weather8',
  'Whispering Wind':'Level=B2,S2,W2',
  'Wind Walk':'Level=C6,D7',
  'Wind Wall':'Level=Air2,C3,D3,R2,S3,W3',
  'Wish':'Level=S9,W9',
  'Wood Shape':'Level=Artifice2,D2 Liquid=Oil',
  'Word Of Chaos':
    'Level=C7,Chaos7 ' +
    'Description="Nonchaotic creatures in 40\' radius with equal/-1/-5/-10 HD deafened for 1d4 rd (Will neg)/stunned for 1 rd (Will neg)/confused for 1d10 min (Will for 1 rd)/killed (Will 3d6+%{lvl} HP) and banished (Will neg)"',
  'Word Of Recall':'Level=C6,D8',
  'Zone Of Silence':'Level=B4',
  'Zone Of Truth':'Level=C2,P2',

  'Beast Shape I':
    'School=Transmutation ' +
    'Level=S3,W3 ' +
    'Description="Self becomes small (+2 Dexterity, +1 AC) or medium (+2 Strength, +2 AC) animal for %{lvl} min"',
  'Beast Shape II':
    'School=Transmutation ' +
    'Level=S4,W4 ' +
    'Description="Self becomes tiny (+4 Dexterity, -2 Strength, +1 AC) or large (+4 Strength, -2 Dexterity, +4 AC) animal for %{lvl} min"',
  'Beast Shape III':
    'School=Transmutation ' +
    'Level=Animal5,S5,W5 ' +
    'Description="Self becomes diminutive (+6 Dexterity, -4 Strength, +1 AC) or huge (+6 Strength, -4 Dexterity, +6 AC) animal or small (+4 Dexterity, +2 AC) or medium (+4 Strength, +4 AC) magical beast for %{lvl} min"',
  'Beast Shape IV':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'Description="Self becomes tiny (+8 Dexterity, -2 Strength, +3 AC) or large (+6 Strength, -2 Dexterity, +2 Constitution, +6 AC) magical beast for %{lvl} min"',
  'Bleed':
    'School=Necromancy ' +
    'Level=C0,Talent0,S0,W0 ' +
    'Description="R%{25+lvl//2*5}\' Stabilized target suffers 1 HP and resumes dying (Will neg)"',
  'Breath Of Life':
    'School=Conjuration ' +
    'Level=C5,Healing5 ' +
    'Description="Touched corpse dead less than 1 rd resurrected and heals 5d8+%{lvl<?25} HP"',
  'Elemental Body I':
    'School=Transmutation ' +
    'Level=S4,W4 ' +
    'Description="Self becomes small air (+2 Dexterity, +2 AC, fly 60\', whirlwind), earth (+2 Strength, +4 AC, earth glide), fire (+2 Dexterity, +2 AC, resist fire, burn), or water (+2 Constitution, +4 AC, swim 60\', vortex, breathe water) elemental, gains 60\' darkvision for %{lvl} min"',
  'Elemental Body II':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'Description="Self becomes medium air (+4 Dexterity, +3 AC, fly 60\', whirlwind), earth (+4 Strength, +5 AC, earth glide), fire (+4 Dexterity, +3 AC, resist fire, burn), or water (+4 Constitution, +5 AC, swim 60\', vortex, breathe water) elemental, gains 60\' darkvision for %{lvl} min"',
  'Elemental Body III':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'Description="Self becomes large air (+2 Strength, +4 Dexterity, +4 AC, fly 60\', whirlwind), earth (+6 Strength, -2 Dexterity, +2 Constitution, +6 AC, earth glide), fire (+4 Dexterity, +2 Constitution, +4 AC, resist fire, burn), or water (+2 Strength, -2 Dexterity, +6 Constitution, +6 AC, swim 60\', vortex, breathe water) elemental, gains 60\' darkvision, immunity to bleeding, critical hits, and Sneak Attacks for %{lvl} min"',
  'Elemental Body IV':
    'School=Transmutation ' +
    'Level=Air7,Earth7,Fire7,S7,W7,Water7 ' +
    'Description="Self becomes huge air (+4 Strength, +6 Dexterity, +4 AC, fly 120\', whirlwind), earth (+8 Strength, -2 Dexterity, +4 Constitution, +6 AC, earth glide), fire (+6 Dexterity, +4 Constitution, +4 AC, resist fire, burn), or water (+4 Strength, -2 Dexterity, +8 Constitution, +6 AC, swim 120\', vortex, breathe water) elemental, gains 60\' darkvision, immunity to bleeding, critical hits, and Sneak Attacks, DR 5/- for %{lvl} min"',
  'Form Of The Dragon I':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'Description="Self becomes medium dragon (+4 Strength, +2 Constitution, +4 AC, Fly 60\', Darkvision 60\', breath weapon once 6d8 HP (Ref half), resistance to energy, bite 1d8 HP, claws 2x1d6 HP, wings 2x1d4 HP) for %{lvl} min"',
  'Form Of The Dragon II':
    'School=Transmutation ' +
    'Level=S7,W7 ' +
    'Description="Self becomes large dragon (+6 Strength, +4 Constitution, +6 AC, Fly 90\', Darkvision 60\', breath weapon twice 8d8 HP (Ref half), resistance to energy, bite 2d6 HP, claws 2x1d8 HP, wings 2x1d6 HP) for %{lvl} min"',
  'Form Of The Dragon III':
    'School=Transmutation ' +
    'Level=S8,W8 ' +
    'Description="Self becomes huge dragon (+10 Strength, +8 Constitution, +8 AC, Fly 120\', Blindsense 60\', Darkvision 120\', breath weapon 1/d4 rd 12d8 HP (Ref half), element immunity, bite 2d8 HP, claws 2x2d6 HP, wings 2x1d8 HP, tail 2d6 HP) for %{lvl} min"',
  'Giant Form I':
    'School=Transmutation ' +
    'Level=S7,W7 ' +
    'Description="Self becomes large giant (+6 Strength, -2 Dexterity, +4 Constitution, +4 AC, low-light vision, form abilities) for %{lvl} min"',
  'Giant Form II':
    'School=Transmutation ' +
    'Level=S8,W8 ' +
    'Description="Self becomes huge giant (+8 Strength, -2 Dexterity, +6 Constitution, +6 AC, low-light vision, form abilities) for %{lvl} min"',
  'Greater Polymorph':
    'School=Transmutation ' +
    'Level=S7,W7 ' +
    'Description="Willing target becomes animal, elemental, plant, or dragon for %{lvl} min"',
  'Plant Shape I':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'Description="Self becomes small (+2 Constitution, +2 AC) or medium (+2 Strength, +2 Constitution, +2 AC) plant creature for %{lvl} min"',
  'Plant Shape II':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'Description="Self becomes large (+4 Strength, +2 Constitution, +4 AC) plant creature for %{lvl} min"',
  'Plant Shape III':
    'School=Transmutation ' +
    'Level=S7,W7 ' +
    'Description="Self becomes huge (+8 Strength, -2 Dexterity, +4 Constitution, +6 AC) plant creature for %{lvl} min"',
  'Stabilize':
    'School=Conjuration ' +
    'Level=Adept0,C0,Talent0,D0 ' +
    'Description="R%{25+lvl//2*5}\' Stabilizes target w/negative HP" ' +
    'Liquid=Potion'

};
for(let s in Pathfinder.SPELLS) {
  Pathfinder.SPELLS[s] = (SRD35.SPELLS[s]||'') + ' ' + Pathfinder.SPELLS[s];
}
Pathfinder.TRACKS = {
  '3.5':
    'Progression=' +
      '0,1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190',
  'Fast':
    'Progression=' +
      '0,1.3,3.3,6,10,15,23,34,50,71,105,145,210,295,425,600,850,1200,1700,2400',
  'Medium':
    'Progression=' +
      '0,2,5,9,15,23,35,51,75,105,155,220,315,445,635,890,1300,1800,2550,3600',
  'Slow':
    'Progression=' +
      '0,3,7.5,14,23,35,53,77,115,160,235,330,475,665,955,1350,1900,2700,' +
      '3850,5350',
  'PSOP':
    'Progression=' +
      '0,.003,.006,.009,.012,.015,.018,.021,.024,.027,.03,.033,.036,.039,' +
      '.042,.045,.048,.051,.054,.057,.060' 
};
Pathfinder.TRAITS = {
  // Advanced Player's Guide
  'Adopted':'Type=Basic Subtype=Social',
  'Anatomist':'Type=Basic Subtype=Combat',
  'Animal Friend':'Type=Race Subtype=Gnome',
  'Apothecary':'Type=Campaign Subtype="Black Sheep"',
  'Armor Expert':'Type=Basic Subtype=Combat',
  'Birthmark':'Type=Basic Subtype=Faith',
  'Bitter Nobleman':'Type=Campaign Subtype="Black Sheep"',
  'Brute':'Type=Race Subtype=Half-Orc',
  'Bullied':'Type=Basic Subtype=Combat',
  'Bully':'Type=Basic Subtype=Social',
  'Canter':'Type=Basic Subtype=Social',
  'Caretaker':'Type=Basic Subtype=Faith',
  'Charming':'Type=Basic Subtype=Social',
  'Child Of Nature':'Type=Religion Subtype=N',
  'Child Of The Streets':'Type=Basic Subtype=Social',
  'Child Of The Temple':'Type=Basic Subtype=Faith',
  'Classically Schooled':'Type=Basic Subtype=Magic',
  'Courageous':'Type=Basic Subtype=Combat',
  'Dangerously Curious':'Type=Basic Subtype=Magic',
  'Deft Dodger':'Type=Basic Subtype=Combat',
  'Demon Hunter':'Type=Religion Subtype=LE',
  'Desert Child':'Type=Regional Subtype=Desert',
  'Devotee Of The Green':'Type=Basic Subtype=Faith',
  'Dirty Fighter':'Type=Basic Subtype=Combat',
  'Divine Courtesan':'Type=Religion Subtype=CN',
  'Divine Warrior':'Type=Religion Subtype=LG',
  'Ear For Music':'Type=Religion Subtype=NG',
  'Ease Of Faith':'Type=Basic Subtype=Faith',
  'Elven Reflexes':'Type=Race Subtype=Half-Elf',
  'Exile':'Type=Campaign Subtype=Outlander',
  'Eyes And Ears Of The City':'Type=Religion Subtype=LG',
  'Failed Apprentice':'Type=Race Subtype=Half-Elf',
  'Fast-Talker':'Type=Basic Subtype=Social',
  'Fencer':'Type=Basic Subtype=Combat',
  'Flame Of The Dawnflower':'Type=Religion Subtype=NG',
  'Focused Mind':'Type=Basic Subtype=Magic',
  'Forlorn':'Type=Race Subtype=Elf',
  'Fortified Drinker':'Type=Religion Subtype=CG',
  'Freedom Fighter (Halfling)':'Type=Race Subtype=Halfling',
  'Gifted Adept':'Type=Basic Subtype=Magic',
  'Goldsniffer':'Type=Race Subtype=Dwarf',
  'Guardian Of The Forge':'Type=Religion Subtype=LG',
  'Hedge Magician':'Type=Basic Subtype=Magic',
  'Highlander':'Type=Regional Subtype=Hills,Mountains',
  'History Of Heresy':'Type=Basic Subtype=Faith',
  'Indomitable Faith':'Type=Basic Subtype=Faith',
  'Killer':'Type=Basic Subtype=Combat',
  'Log Roller':'Type=Regional Subtype=Forest',
  'Lore Seeker':'Type=Campaign Subtype=Outlander',
  'Magic Is Life':'Type=Religion Subtype=N',
  'Magical Knack':'Type=Basic Subtype=Magic',
  'Magical Lineage':'Type=Basic Subtype=Magic',
  'Magical Talent (Trait)':'Type=Basic Subtype=Magic',
  'Mathematical Prodigy':'Type=Basic Subtype=Magic',
  'Militia Veteran':'Type=Regional Subtype=Town,Village',
  'Missionary':'Type=Campaign Subtype=Outlander',
  'Natural-Born Leader':'Type=Basic Subtype=Social',
  'Outcast':'Type=Race Subtype=Half-Orc',
  'Patient Optimist':'Type=Religion Subtype=LG',
  'Poverty-Stricken':'Type=Basic Subtype=Social',
  'Rapscallion':'Type=Race Subtype=Gnome',
  'Reactionary':'Type=Basic Subtype=Combat',
  'Resilient':'Type=Basic Subtype=Combat',
  'Rich Parents':'Type=Basic Subtype=Social',
  'River Rat':'Type=Regional Subtype=Marsh,River',
  'Sacred Conduit':'Type=Basic Subtype=Faith',
  'Sacred Touch':'Type=Basic Subtype=Faith',
  'Savanna Child':'Type=Regional Subtype=Plains',
  'Scholar Of Ruins':'Type=Race Subtype=Human',
  'Scholar Of The Great Beyond':'Type=Basic Subtype=Faith',
  'Sheriff':'Type=Campaign Subtype="Favored Child"',
  'Skeptic':'Type=Basic Subtype=Magic',
  'Starchild':'Type=Religion Subtype=CG',
  'Suspicious':'Type=Basic Subtype=Social',
  'Tavern Owner':'Type=Campaign Subtype="Favored Child"',
  'Tunnel Fighter':'Type=Race Subtype=Dwarf',
  'Undead Slayer':'Type=Religion Subtype=N',
  'Vagabond Child':'Type=Regional Subtype=Urban',
  'Veteran Of Battle':'Type=Religion Subtype=CN',
  'Warrior Of Old':'Type=Race Subtype=Elf',
  'Well-Informed':'Type=Race Subtype=Halfling',
  'Wisdom In The Flesh':'Type=Religion Subtype=LN',
  'World Traveler (Trait)':'Type=Race Subtype=Human',
  // Faction Traits - PS Roleplaying Guild Guide (v10.0)
  'A Sure Thing':'Type=Faction Subtype="Silver Crusade"',
  'Arcane Archivist':'Type=Faction Subtype="Dark Archive"',
  'Balanced Offensive':'Type=Faction Subtype="The Concordance"',
  'Beastspeaker':'Type=Faction Subtype="The Concordance"',
  'Beneficent Touch':'Type=Faction Subtype="Silver Crusade"',
  "Captain's Blade":'Type=Faction Subtype="Liberty\'s Edge"',
  'Comparative Religion':'Type=Faction Subtype="Silver Crusade"',
  "Devil's Mark":'Type=Faction Subtype="Dark Archive"',
  'Expert Duelist':'Type=Faction Subtype="Sovereign Court"',
  'Fashionable':'Type=Faction Subtype="Sovereign Court"',
  'Force For Good':'Type=Faction Subtype="Silver Crusade"',
  "Freedom Fighter (Liberty's Edge)":'Type=Faction Subtype="Liberty\'s Edge"',
  'Gold Finger':'Type=Faction Subtype="The Exchange"',
  'Greasy Palm':'Type=Faction Subtype="The Exchange"',
  'Impressive Presence':'Type=Faction Subtype="Sovereign Court"',
  'Indomitable':'Type=Faction Subtype="Liberty\'s Edge"',
  'Influential':'Type=Faction Subtype="Sovereign Court"',
  'Insider Knowledge':'Type=Faction Subtype="Grand Lodge"',
  'Librarian':'Type=Faction Subtype="Dark Archive"',
  'Loyalty':'Type=Faction Subtype="Grand Lodge"',
  'Master Of Pentacles':'Type=Faction Subtype="Dark Archive"',
  'Natural Negotiator':'Type=Faction Subtype="The Concordance"',
  'Observant':'Type=Faction Subtype="Grand Lodge"',
  'Planar Voyager':'Type=Faction Subtype="The Concordance"',
  'Proper Training':'Type=Faction Subtype="Grand Lodge"',
  'Rousing Oratory':'Type=Faction Subtype="Liberty\'s Edge"',
  'Scholar Of Balance':'Type=Faction Subtype="The Concordance"',
  'Smuggler':'Type=Faction Subtype="The Exchange"',
  'Soul Drinker':'Type=Faction Subtype="Dark Archive"',
  'Teaching Mistake':'Type=Faction Subtype="Grand Lodge"',
  'Tireless':'Type=Faction Subtype="The Exchange"',
  'Unflappable':'Type=Faction Subtype="Sovereign Court"',
  'Unorthodox Strategy':'Type=Faction Subtype="Silver Crusade"',
  'Upstanding':'Type=Faction Subtype="The Exchange"',
  'Whistleblower':'Type=Faction Subtype="Liberty\'s Edge"',
  // Faction Traits from prior Guide versions
  'Aid Allies':'Type=Faction Subtype="Shadow Lodge"',
  'Ancient Historian':'Type=Faction Subtype="Scarab Sages"',
  'Attuned To The Ancestors':'Type=Faction Subtype="Scarab Sages"',
  'Bad Reputation':'Type=Faction Subtype=Sczarni',
  'Dervish':'Type=Faction Subtype=Qadira',
  'Desert Shadow':'Type=Faction Subtype=Qadira',
  'Dunewalker':'Type=Faction Subtype=Osirion',
  'Eastern Mysteries':'Type=Faction Subtype=Qadira',
  'Explorer':'Type=Faction Subtype=Andoran',
  'Fiendish Presence':'Type=Faction Subtype=Cheliax',
  'Fires Of Hell':'Type=Faction Subtype=Cheliax',
  'Fortified':'Type=Faction Subtype="Shadow Lodge"',
  'Horse Lord (Trait)':'Type=Faction Subtype=Qadira',
  "Hunter's Eye":'Type=Faction Subtype=Andoran',
  'I Know A Guy':'Type=Faction Subtype=Sczarni',
  'Medic':'Type=Faction Subtype="Shadow Lodge"',
  'Meridian Strike':'Type=Faction Subtype="Lantern Lodge"',
  'Meticulous Artisan':'Type=Faction Subtype="Lantern Lodge"',
  'Mind Over Matter':'Type=Faction Subtype="Lantern Lodge"',
  'Mummy-Touched':'Type=Faction Subtype=Osirion',
  'Performance Artist':'Type=Faction Subtype=Taldor',
  'Reverent Wielder':'Type=Faction Subtype="Scarab Sages"',
  'Secrets Of The Sphinx':'Type=Faction Subtype="Scarab Sages"',
  'Shadow Diplomat':'Type=Faction Subtype="Shadow Lodge"',
  'Shiv':'Type=Faction Subtype=Sczarni',
  'Storyteller':'Type=Faction Subtype="Lantern Lodge"',
  'Tomb Raider':'Type=Faction Subtype="Scarab Sages"',
  'Trouper':'Type=Faction Subtype=Sczarni',
  'Vindictive':'Type=Faction Subtype=Taldor',
  'Watchdog':'Type=Faction Subtype="Shadow Lodge"',
  'Weapon Style':'Type=Faction Subtype="Lantern Lodge"'
};
Pathfinder.WEAPONS = {
  'Bastard Sword':'Level=Exotic Category=One-Handed Damage=d10 Threat=19',
  'Battleaxe':'Level=Martial Category=One-Handed Damage=d8 Crit=3',
  'Bolas':'Level=Exotic Category=Ranged Damage=d4 Range=10',
  'Blowgun':'Level=Simple Category=Ranged Damage=d2 Range=20',
  'Club':'Level=Simple Category=One-Handed Damage=d6 Range=10',
  'Composite Longbow':
    'Level=Martial Category=Ranged Damage=d8 Crit=3 Range=110',
  'Composite Shortbow':
    'Level=Martial Category=Ranged Damage=d6 Crit=3 Range=70',
  'Dagger':'Level=Simple Category=Light Damage=d4 Threat=19 Range=10',
  'Dart':'Level=Simple Category=Ranged Damage=d4 Range=20',
  'Dire Flail':'Level=Exotic Category=Two-Handed Damage=d8/d8',
  'Dwarven Urgosh':'Level=Exotic Category=Two-Handed Damage=d8/d6 Crit=3',
  'Dwarven Waraxe':'Level=Exotic Category=One-Handed Damage=d10 Crit=3',
  'Elven Curve Blade':'Level=Exotic Category=Two-Handed Damage=d10 Threat=18',
  'Falchion':'Level=Martial Category=Two-Handed Damage=2d4 Threat=18',
  'Flail':'Level=Martial Category=One-Handed Damage=d8',
  'Gauntlet':'Level=Unarmed Category=Unarmed Damage=d3',
  'Glaive':'Level=Martial Category=Two-Handed Damage=d10 Crit=3',
  'Gnome Hooked Hammer':'Level=Exotic Category=Two-Handed Damage=d8/d6 Crit=4',
  'Greataxe':'Level=Martial Category=Two-Handed Damage=d12 Crit=3',
  'Greatclub':'Level=Martial Category=Two-Handed Damage=d10',
  'Greatsword':'Level=Martial Category=Two-Handed Damage=2d6 Threat=19',
  'Guisarme':'Level=Martial Category=Two-Handed Damage=2d4 Crit=3',
  'Halberd':'Level=Martial Category=Two-Handed Damage=d10 Crit=3',
  'Halfling Sling Staff':
    'Level=Exotic Category=Ranged Damage=d8 Crit=3 Range=80',
  'Hand Crossbow':'Level=Exotic Category=Ranged Damage=d4 Threat=19 Range=30',
  'Handaxe':'Level=Martial Damage=d6 Category=Light Crit=3',
  'Heavy Crossbow':
    'Level=Simple Category=Ranged Damage=d10 Threat=19 Range=120',
  'Heavy Flail':'Level=Martial Category=Two-Handed Damage=d10 Threat=19',
  'Heavy Mace':'Level=Simple Category=One-Handed Damage=d8',
  'Heavy Pick':'Level=Martial Category=One-Handed Damage=d6 Crit=4',
  'Heavy Shield':'Level=Martial Category=One-Handed Damage=d4',
  'Heavy Spiked Shield':'Level=Martial Category=One-Handed Damage=d6',
  'Improvised':'Level=Exotic Category=Ranged Damage=d4 Range=10',
  'Javelin':'Level=Simple Category=Ranged Damage=d6 Range=30',
  'Kama':'Level=Exotic Category=Light Damage=d6',
  'Kukri':'Level=Martial Category=Light Damage=d4 Threat=18',
  'Lance':'Level=Martial Category=Two-Handed Damage=d8 Crit=3',
  'Light Crossbow':'Level=Simple Category=Ranged Damage=d8 Threat=19 Range=80',
  'Light Hammer':'Level=Martial Category=Light Damage=d4 Range=20',
  'Light Mace':'Level=Simple Category=Light Damage=d6',
  'Light Pick':'Level=Martial Category=Light Damage=d4 Crit=4',
  'Light Shield':'Level=Martial Category=Light Damage=d3',
  'Light Spiked Shield':'Level=Martial Category=Light Damage=d4',
  'Longbow':'Level=Martial Category=Ranged Damage=d8 Crit=3 Range=100',
  'Longspear':'Level=Simple Category=Two-Handed Damage=d8 Crit=3',
  'Longsword':'Level=Martial Category=One-Handed Damage=d8 Threat=19',
  'Morningstar':'Level=Simple Category=One-Handed Damage=d8',
  'Net':'Level=Exotic Category=Ranged Damage=None Range=10',
  'Nunchaku':'Level=Exotic Category=Light Damage=d6',
  'Orc Double Axe':'Level=Exotic Category=Two-Handed Damage=d8/d8 Crit=3',
  'Punching Dagger':'Level=Simple Category=Light Damage=d4 Crit=3',
  'Quarterstaff':'Level=Simple Category=Two-Handed Damage=d6/d6',
  'Ranseur':'Level=Martial Category=Two-Handed Damage=2d4 Crit=3',
  'Rapier':'Level=Martial Category=One-Handed Damage=d6 Threat=18',
  'Repeating Heavy Crossbow':
    'Level=Exotic Category=Ranged Damage=d10 Threat=19 Range=120',
  'Repeating Light Crossbow':
    'Level=Exotic Category=Ranged Damage=d8 Threat=19 Range=80',
  'Sai':'Level=Exotic Category=Light Damage=d4',
  'Sap':'Level=Martial Category=Light Damage=d6',
  'Scimitar':'Level=Martial Category=One-Handed Damage=d6 Threat=18',
  'Scythe':'Level=Martial Category=Two-Handed Damage=2d4 Crit=4',
  'Short Sword':'Level=Martial Category=Light Damage=d6 Threat=19',
  'Shortbow':'Level=Martial Category=Ranged Damage=d6 Crit=3 Range=60',
  'Shortspear':'Level=Simple Category=One-Handed Damage=d6 Range=20',
  'Shuriken':'Level=Exotic Category=Ranged Damage=d2 Range=10',
  'Siangham':'Level=Exotic Category=Light Damage=d6',
  'Sickle':'Level=Simple Category=Light Damage=d6',
  'Sling':'Level=Simple Category=Ranged Damage=d4 Range=50',
  'Spear':'Level=Simple Category=Two-Handed Damage=d8 Crit=3 Range=20',
  'Spiked Armor':'Level=Martial Category=Light Damage=d6',
  'Spiked Chain':'Level=Exotic Category=Two-Handed Damage=2d4',
  'Spiked Gauntlet':'Level=Simple Category=Light Damage=d4',
  'Starknife':'Level=Martial Category=Light Damage=d4 Crit=3 Range=20',
  'Throwing Axe':'Level=Martial Category=Light Damage=d6 Range=10',
  'Trident':'Level=Martial Category=One-Handed Damage=d8 Range=10',
  'Two-Bladed Sword':'Level=Exotic Category=Two-Handed Damage=d8/d8 Threat=19',
  'Unarmed Strike':'Level=Unarmed Category=Unarmed Damage=d3',
  'Warhammer':'Level=Martial Category=One-Handed Damage=d8 Crit=3',
  'Whip':'Level=Exotic Category=One-Handed Damage=d3'
};
Pathfinder.CLASSES = {
  'Barbarian':
    'Require="alignment !~ \'Lawful\'" ' +
    'HitDie=d12 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Fast Movement (Barbarian)","1:Rage","2:Rage Powers",' +
      '"2:Uncanny Dodge","3:Trap Sense","5:Improved Uncanny Dodge",' +
      '"7:Damage Reduction","11:Greater Rage","14:Indomitable Will",' +
      '"17:Tireless Rage","20:Mighty Rage" ' +
    'Selectables=' +
      '"2:Animal Fury:Rage Power",' +
      '"8:Clear Mind:Rage Power",' +
      '"12:Fearless Rage:Rage Power",' +
      '"2:Guarded Stance:Rage Power",' +
      '"8:Increased Damage Reduction:Rage Power",' +
      '"8:Internal Fortitude:Rage Power",' +
      '"2:Intimidating Glare:Rage Power",' +
      '"2:Knockback:Rage Power",' +
      '"2:Low-Light Vision (Barbarian):Rage Power",' +
      '"12:Mighty Swing:Rage Power",' +
      '"2:Moment Of Clarity:Rage Power",' +
      '"2:Night Vision:Rage Power",' +
      '"2:No Escape:Rage Power",' +
      '"2:Powerful Blow:Rage Power",' +
      '"2:Quick Reflexes:Rage Power",' +
      '"2:Raging Climber:Rage Power",' +
      '"2:Raging Leaper:Rage Power",' +
      '"2:Raging Swimmer:Rage Power",' +
      '"8:Renewed Vigor:Rage Power",' +
      '"2:Rolling Dodge:Rage Power",' +
      '"2:Roused Anger:Rage Power",' +
      '"2:Scent (Barbarian):Rage Power",' +
      '"2:Strength Surge:Rage Power",' +
      '"2:Superstition:Rage Power",' +
      '"2:Surprise Accuracy:Rage Power",' +
      '"2:Swift Foot:Rage Power",' +
      '"features.Intimidating Glare ? 8:Terrifying Howl:Rage Power",' +
      '"4:Unexpected Strike:Rage Power"',
  'Bard':
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Longsword; Rapier; Sap; Short Sword; Shortbow; Whip)",' +
      '"1:Bardic Knowledge","1:Bardic Performance","1:Countersong",' +
      '"1:Distraction","1:Fascinate","1:Inspire Courage",' +
      '"1:Simple Somatics","2:Versatile Performance","2:Well-Versed",' +
      '"3:Inspire Competence","5:Lore Master","6:Suggestion",' +
      '"8:Dirge Of Doom","9:Inspire Greatness","10:Jack-Of-All-Trades",' +
      '"12:Soothing Performance","14:Frightening Tune","15:Inspire Heroics",' +
      '"18:Mass Suggestion","20:Deadly Performance" ' +
    'Selectables=' +
      '"1:Versatile Skill (Act):Versatile Skill",' +
      '"1:Versatile Skill (Comedy):Versatile Skill",' +
      '"1:Versatile Skill (Dance):Versatile Skill",' +
      '"1:Versatile Skill (Keyboard):Versatile Skill",' +
      '"1:Versatile Skill (Oratory):Versatile Skill",' +
      '"1:Versatile Skill (Percussion):Versatile Skill",' +
      '"1:Versatile Skill (Sing):Versatile Skill",' +
      '"1:Versatile Skill (String):Versatile Skill",' +
      '"1:Versatile Skill (Wind):Versatile Skill" ' +
    'CasterLevelArcane=levels.Bard ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'B0:4@1;5@2;6@3,' +
      'B1:1@1;2@2;3@3;4@5;5@9,' +
      'B2:1@4;2@5;3@6;4@8;5@12,' +
      'B3:1@7;2@8;3@9;4@11;5@15,' +
      'B4:1@10;2@11;3@12;4@14;5@18,' +
      'B5:1@13;2@14;3@15;4@17;5@19,' +
      'B6:1@16;2@17;3@18;4@19;5@20 ' +
    'SpellsAvailable=' +
      'B0:4@1;5@2;6@3,' +
      'B1:2@1;3@2;4@3;5@7;6@11,' +
      'B2:2@4;3@5;4@6;5@10;6@14,' +
      'B3:2@7;3@8;4@9;5@13;6@17,' +
      'B4:2@10;3@11;4@12;5@16;6@20,' +
      'B5:2@13;3@14;4@15;5@19,' +
      'B6:2@16;3@17;4@18;5@20',
  'Cleric':
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Aligned Spells","1:Aura","1:Channel Energy","1:Orisons",' +
      '"1:Spontaneous Casting (Cleric)",' +
      '"clericDomainFeatures.Air ? 1:Lightning Arc",' +
      '"clericDomainFeatures.Air ? 6:Electricity Resistance",' +
      '"clericDomainFeatures.Animal ? 1:Speak With Animals",' +
      '"clericDomainFeatures.Animal ? 4:Animal Companion",' +
      '"clericDomainFeatures.Artifice ? 1:Artificer\'s Touch",' +
      '"clericDomainFeatures.Artifice ? 8:Dancing Weapons",' +
      '"clericDomainFeatures.Chaos ? 1:Touch Of Chaos",' +
      '"clericDomainFeatures.Chaos ? 8:Chaos Blade",' +
      '"clericDomainFeatures.Charm ? 1:Dazing Touch (Charm)",' +
      '"clericDomainFeatures.Charm ? 8:Charming Smile",' +
      '"clericDomainFeatures.Community ? 1:Calming Touch",' +
      '"clericDomainFeatures.Community ? 8:Unity",' +
      '"clericDomainFeatures.Darkness ? 1:Touch Of Darkness",' +
      '"clericDomainFeatures.Darkness ? 8:Eyes Of Darkness",' +
      '"clericDomainFeatures.Death ? 1:Bleeding Touch",' +
      '"clericDomainFeatures.Death ? 8:Death\'s Embrace",' +
      '"clericDomainFeatures.Destruction ? 1:Destructive Smite",' +
      '"clericDomainFeatures.Destruction ? 8:Destructive Aura",' +
      '"clericDomainFeatures.Earth ? 1:Acid Dart (Earth)",' +
      '"clericDomainFeatures.Earth ? 6:Acid Resistance",' +
      '"clericDomainFeatures.Evil ? 1:Touch Of Evil",' +
      '"clericDomainFeatures.Evil ? 8:Scythe Of Evil",' +
      '"clericDomainFeatures.Fire ? 1:Fire Bolt",' +
      '"clericDomainFeatures.Fire ? 6:Fire Resistance",' +
      '"clericDomainFeatures.Glory ? 1:Touch Of Glory",' +
      '"clericDomainFeatures.Glory ? 8:Divine Presence",' +
      '"clericDomainFeatures.Good ? 1:Touch Of Good",' +
      '"clericDomainFeatures.Good ? 8:Holy Lance",' +
      '"clericDomainFeatures.Healing ? 1:Rebuke Death",' +
      '"clericDomainFeatures.Healing ? 6:Healer\'s Blessing",' +
      '"clericDomainFeatures.Knowledge ? 1:Lore Keeper",' +
      '"clericDomainFeatures.Knowledge ? 6:Remote Viewing",' +
      '"clericDomainFeatures.Law ? 1:Touch Of Law",' +
      '"clericDomainFeatures.Law ? 8:Staff Of Order",' +
      '"clericDomainFeatures.Liberation ? 1:Liberation",' +
      '"clericDomainFeatures.Liberation ? 8:Freedom\'s Call",' +
      '"clericDomainFeatures.Luck ? 1:Bit Of Luck",' +
      '"clericDomainFeatures.Luck ? 6:Good Fortune",' +
      '"clericDomainFeatures.Madness ? 1:Vision Of Madness",' +
      '"clericDomainFeatures.Madness ? 8:Aura Of Madness",' +
      '"clericDomainFeatures.Magic ? 1:Hand Of The Acolyte",' +
      '"clericDomainFeatures.Magic ? 8:Dispelling Touch",' +
      '"clericDomainFeatures.Nobility ? 1:Inspiring Word",' +
      '"clericDomainFeatures.Nobility ? 8:Leadership (Cleric)",' +
      '"clericDomainFeatures.Plant ? 1:Wooden Fist",' +
      '"clericDomainFeatures.Plant ? 6:Bramble Armor",' +
      '"clericDomainFeatures.Protection ? 1:Resistant Touch",' +
      '"clericDomainFeatures.Protection ? 8:Aura Of Protection",' +
      '"clericDomainFeatures.Repose ? 1:Gentle Rest",' +
      '"clericDomainFeatures.Repose ? 8:Ward Against Death",' +
      '"clericDomainFeatures.Rune ? 1:Blast Rune",' +
      '"clericDomainFeatures.Rune ? 8:Spell Rune",' +
      '"clericDomainFeatures.Strength ? 1:Strength Surge (Cleric)",' +
      '"clericDomainFeatures.Strength ? 8:Might Of The Gods",' +
      '"clericDomainFeatures.Sun ? 1:Sun\'s Blessing",' +
      '"clericDomainFeatures.Sun ? 8:Nimbus Of Light",' +
      '"clericDomainFeatures.Travel ? 1:Agile Feet",' +
      '"clericDomainFeatures.Travel ? 8:Dimensional Hop",' +
      '"clericDomainFeatures.Trickery ? 1:Copycat",' +
      '"clericDomainFeatures.Trickery ? 8:Master\'s Illusion",' +
      '"clericDomainFeatures.War ? 1:Battle Rage",' +
      '"clericDomainFeatures.War ? 8:Weapon Master",' +
      '"clericDomainFeatures.Water ? 1:Icicle",' +
      '"clericDomainFeatures.Water ? 6:Cold Resistance",' +
      '"clericDomainFeatures.Weather ? 1:Storm Burst",' +
      '"clericDomainFeatures.Weather ? 8:Lightning Lord" ' +
    'Selectables=' +
      '"deityDomains =~ \'Air\' ? 1:Air Domain:Domain",' +
      '"deityDomains =~ \'Animal\' ? 1:Animal Domain:Domain",' +
      '"deityDomains =~ \'Artifice\' ? 1:Artifice Domain:Domain",' +
      '"alignment =~ \'Chaotic\' && deityDomains =~ \'Chaos\' ? 1:Chaos Domain:Domain",' +
      '"deityDomains =~ \'Charm\' ? 1:Charm Domain:Domain",' +
      '"deityDomains =~ \'Community\' ? 1:Community Domain:Domain",' +
      '"deityDomains =~ \'Darkness\' ? 1:Darkness Domain:Domain",' +
      '"deityDomains =~ \'Death\' ? 1:Death Domain:Domain",' +
      '"deityDomains =~ \'Destruction\' ? 1:Destruction Domain:Domain",' +
      '"deityDomains =~ \'Earth\' ? 1:Earth Domain:Domain",' +
      '"alignment =~ \'Evil\' && deityDomains =~ \'Evil\' ? 1:Evil Domain:Domain",' +
      '"deityDomains =~ \'Fire\' ? 1:Fire Domain:Domain",' +
      '"deityDomains =~ \'Glory\' ? 1:Glory Domain:Domain",' +
      '"alignment =~ \'Good\' && deityDomains =~ \'Good\' ? 1:Good Domain:Domain",' +
      '"deityDomains =~ \'Healing\' ? 1:Healing Domain:Domain",' +
      '"deityDomains =~ \'Knowledge\' ? 1:Knowledge Domain:Domain",' +
      '"alignment =~ \'Lawful\' && deityDomains =~ \'Law\' ? 1:Law Domain:Domain",' +
      '"deityDomains =~ \'Liberation\' ? 1:Liberation Domain:Domain",' +
      '"deityDomains =~ \'Luck\' ? 1:Luck Domain:Domain",' +
      '"deityDomains =~ \'Madness\' ? 1:Madness Domain:Domain",' +
      '"deityDomains =~ \'Magic\' ? 1:Magic Domain:Domain",' +
      '"deityDomains =~ \'Nobility\' ? 1:Nobility Domain:Domain",' +
      '"deityDomains =~ \'Plant\' ? 1:Plant Domain:Domain",' +
      '"deityDomains =~ \'Protection\' ? 1:Protection Domain:Domain",' +
      '"deityDomains =~ \'Repose\' ? 1:Repose Domain:Domain",' +
      '"deityDomains =~ \'Rune\' ? 1:Rune Domain:Domain",' +
      '"deityDomains =~ \'Strength\' ? 1:Strength Domain:Domain",' +
      '"deityDomains =~ \'Sun\' ? 1:Sun Domain:Domain",' +
      '"deityDomains =~ \'Travel\' ? 1:Travel Domain:Domain",' +
      '"deityDomains =~ \'Trickery\' ? 1:Trickery Domain:Domain",' +
      '"deityDomains =~ \'War\' ? 1:War Domain:Domain",' +
      '"deityDomains =~ \'Water\' ? 1:Water Domain:Domain",' +
      '"deityDomains =~ \'Weather\' ? 1:Weather Domain:Domain" ' +
    'CasterLevelDivine=levels.Cleric ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'C0:3@1;4@2,' +
      'C1:1@1;2@2;3@4;4@7,' +
      'C2:1@3;2@4;3@6;4@9,' +
      'C3:1@5;2@6;3@8;4@11,' +
      'C4:1@7;2@8;3@10;4@13,' +
      'C5:1@9;2@10;3@12;4@15,' +
      'C6:1@11;2@12;3@14;4@17,' +
      'C7:1@13;2@14;3@16;4@19,' +
      'C8:1@15;2@16;3@18;4@20,' +
      'C9:1@17;2@18;3@19;4@20,' +
      'Domain1:1@1,' +
      'Domain2:1@3,' +
      'Domain3:1@5,' +
      'Domain4:1@7,' +
      'Domain5:1@9,' +
      'Domain6:1@11,' +
      'Domain7:1@13,' +
      'Domain8:1@15,' +
      'Domain9:1@17',
  'Druid':
    'Require=' +
      '"alignment =~ \'Neutral\'",' +
      '"armor =~ \'None|Hide|Leather|Padded\'",' +
      '"shield =~ \'None|Wooden\'" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Club; Dagger; Dart; Quarterstaff; Scimitar; Scythe; Sickle; Shortspear; Sling; Spear)",' +
      '"1:Aligned Spells","1:Nature Bond","1:Nature Sense","1:Orisons",' +
      '"1:Spontaneous Casting (Druid)","1:Wild Empathy","2:Woodland Stride",' +
      '"3:Trackless Step","4:Resist Nature\'s Lure","4:Wild Shape",' +
      '"9:Venom Immunity","13:A Thousand Faces","15:Timeless Body",' +
      '"druidFeatures.Air Domain ? 1:Lightning Arc",' +
      '"druidFeatures.Air Domain ? 6:Electricity Resistance",' +
      '"druidFeatures.Animal Domain ? 1:Speak With Animals",' +
      // '"druidFeatures.Animal Domain ? 4:Animal Companion",' +
      '"druidFeatures.Earth Domain ? 1:Acid Dart (Earth)",' +
      '"druidFeatures.Earth Domain ? 6:Acid Resistance",' +
      '"druidFeatures.Fire Domain ? 1:Fire Bolt",' +
      '"druidFeatures.Fire Domain ? 6:Fire Resistance",' +
      '"druidFeatures.Plant Domain ? 1:Wooden Fist",' +
      '"druidFeatures.Plant Domain ? 6:Bramble Armor",' +
      '"druidFeatures.Water Domain ? 1:Icicle",' +
      '"druidFeatures.Water Domain ? 6:Cold Resistance",' +
      '"druidFeatures.Weather Domain ? 1:Storm Burst",' +
      '"druidFeatures.Weather Domain ? 8:Lightning Lord" ' +
    'Selectables=' +
      '"1:Air Domain:Nature Bond",' +
      '"1:Animal Companion:Nature Bond",' +
      '"1:Animal Domain:Nature Bond",' +
      '"1:Earth Domain:Nature Bond",' +
      '"1:Fire Domain:Nature Bond",' +
      '"1:Plant Domain:Nature Bond",' +
      '"1:Water Domain:Nature Bond",' +
      '"1:Weather Domain:Nature Bond" ' +
    'Languages=Druidic ' +
    'CasterLevelDivine=levels.Druid ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'D0:3@1;4@2,' +
      'D1:1@1;2@2;3@4;4@7,' +
      'D2:1@3;2@4;3@6;4@9,' +
      'D3:1@5;2@6;3@8;4@11,' +
      'D4:1@7;2@8;3@10;4@13,' +
      'D5:1@9;2@10;3@12;4@15,' +
      'D6:1@11;2@12;3@14;4@17,' +
      'D7:1@13;2@14;3@16;4@19,' +
      'D8:1@15;2@16;3@18;4@20,' +
      'D9:1@17;2@18;3@19;4@20',
  'Fighter':
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Heavy; Shield; Tower Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Bonus Feats (Fighter)","2:Bravery","3:Armor Training",' +
      '"5:Weapon Training","19:Armor Mastery","20:Weapon Mastery"',
  'Monk':
    'Require="alignment =~ \'Lawful\'" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Club; Dagger; Handaxe; Heavy Crossbow; Javelin; Kama; Light Crossbow; Nunchaku; Quarterstaff; Sai; Shortspear; Short Sword; Shuriken; Siangham; Sling; Spear)",' +
      '"1:Armor Class Bonus","1:Bonus Feats (Monk)","1:Flurry Of Blows",' +
      '"1:Stunning Fist","1:Two-Weapon Fighting","1:Unarmed Strike",' +
      '"2:Evasion","3:Fast Movement (Monk)","3:Maneuver Training",' +
      '"3:Still Mind","4:Ki Dodge","4:Ki Pool","4:Ki Speed","4:Ki Strike",' +
      '"4:Slow Fall","5:High Jump","5:Purity Of Body","7:Wholeness Of Body",' +
      '"8:Improved Two-Weapon Fighting","9:Improved Evasion",' +
      '"11:Diamond Body","12:Abundant Step","13:Diamond Soul",' +
      '"15:Greater Two-Weapon Fighting","15:Quivering Palm",' +
      '"17:Timeless Body","17:Tongue Of The Sun And Moon","19:Empty Body",' +
      '"20:Perfect Self" ' +
    'Selectables=' +
      '"1:Catch Off-Guard:Bonus Feats",' +
      '"1:Combat Reflexes:Bonus Feats",' +
      '"1:Deflect Arrows:Bonus Feats",' +
      '"1:Dodge:Bonus Feats",' +
      '"1:Improved Grapple:Bonus Feats",' +
      '"1:Scorpion Style:Bonus Feats",' +
      '"1:Throw Anything:Bonus Feats",' +
      '"6:Gorgon\'s Fist:Bonus Feats",' +
      '"6:Improved Bull Rush:Bonus Feats",' +
      '"6:Improved Disarm:Bonus Feats",' +
      '"6:Improved Feint:Bonus Feats",' +
      '"6:Improved Trip:Bonus Feats",' +
      '"6:Mobility:Bonus Feats",' +
      '"10:Medusa\'s Wrath:Bonus Feats",' +
      '"10:Snatch Arrows:Bonus Feats",' +
      '"10:Spring Attack:Bonus Feats"',
  'Paladin':
    'Require="alignment == \'Lawful Good\'" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Aura Of Good","1:Detect Evil","1:Smite Evil","2:Divine Grace",' +
      '"2:Lay On Hands","3:Aura Of Courage","3:Divine Health",3:Mercy,' +
      '"4:Channel Positive Energy","8:Aura Of Resolve","11:Aura Of Justice",' +
      '"14:Aura Of Faith","17:Aura Of Righteousness","20:Holy Champion" ' +
    'Selectables=' +
      '"5:Divine Mount:Divine Bond","5:Divine Weapon:Divine Bond",' +
      '"3:Mercy (Fatigued):Mercy","3:Mercy (Shaken):Mercy",' +
      '"3:Mercy (Sickened):Mercy","6:Mercy (Dazed):Mercy",' +
      '"6:Mercy (Diseased):Mercy","6:Mercy (Staggered):Mercy",' +
      '"9:Mercy (Cursed):Mercy",' +
      '"features.Mercy (Fatigued) ? 9:Mercy (Exhausted):Mercy",' +
      '"features.Mercy (Shaken) ? 9:Mercy (Frightened):Mercy",' +
      '"features.Mercy (Sickened) ? 9:Mercy (Nauseated):Mercy",' +
      '"9:Mercy (Poisoned):Mercy","12:Mercy (Blinded):Mercy",' +
      '"12:Mercy (Deafened):Mercy","12:Mercy (Paralyzed):Mercy",' +
      '"12:Mercy (Stunned):Mercy" ' +
    'CasterLevelDivine="levels.Paladin >= 4 ? levels.Paladin - 3 : null" ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'P1:4=0;5=1;9=2;13=3;17=4,' +
      'P2:7=0;8=1;12=2;16=3;20=4,' +
      'P3:10=0;11=1;15=2;19=3,' +
      'P4:13=0;14=1;18=2;20=3',
  'Ranger':
    'HitDie=d10 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Favored Enemy","1:Track","1:Wild Empathy","2:Combat Style",' +
      '"3:Endurance","3:Favored Terrain","4:Hunter\'s Bond",' +
      '"7:Woodland Stride","8:Swift Tracker","9:Evasion","11:Quarry",' +
      '"12:Camouflage","16:Improved Evasion","17:Hide In Plain Sight",' +
      '"19:Improved Quarry","20:Master Hunter" ' +
    'Selectables=' +
      '"2:Combat Style (Archery):Combat Style",' +
      '"2:Combat Style (Two-Weapon Combat):Combat Style",' +
      '"4:Animal Companion:Hunter\'s Bond","4:Companion Bond:Hunter\'s Bond",' +
      '"2:Far Shot:Archery Feat",' +
      '"2:Point-Blank Shot:Archery Feat",' +
      '"2:Precise Shot:Archery Feat",' +
      '"2:Rapid Shot:Archery Feat",' +
      '"6:Improved Precise Shot:Archery Feat",' +
      '"6:Manyshot:Archery Feat",' +
      '"10:Pinpoint Targeting:Archery Feat",' +
      '"10:Shot On The Run:Archery Feat",' +
      '"2:Double Slice:Two-Weapon Feat",' +
      '"2:Improved Shield Bash:Two-Weapon Feat",' +
      '"2:Quick Draw:Two-Weapon Feat",' +
      '"2:Two-Weapon Fighting:Two-Weapon Feat",' +
      '"6:Improved Two-Weapon Fighting:Two-Weapon Feat",' +
      '"6:Two-Weapon Defense:Two-Weapon Feat",' +
      '"10:Greater Two-Weapon Fighting:Two-Weapon Feat",' +
      '"10:Two-Weapon Rend:Two-Weapon Feat" ' +
    'CasterLevelDivine="levels.Ranger >= 4 ? levels.Ranger - 3 : null" ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'R1:4=0;5=1;9=2;13=3;17=4,' +
      'R2:7=0;8=1;12=2;16=3;20=4,' +
      'R3:10=0;11=1;15=2;19=3,' +
      'R4:13=0;14=1;18=2;20=3',
  'Rogue':
    'HitDie=d8 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons; Hand Crossbow; Rapier; Sap; Shortbow; Short Sword)",' +
      '"1:Sneak Attack","1:Trapfinding","2:Evasion","2:Rogue Talents",' +
      '"3:Trap Sense","4:Uncanny Dodge","8:Improved Uncanny Dodge",' +
      '"10:Advanced Talents","20:Master Strike" ' +
    'Selectables=' +
      '"2:Bleeding Attack:Talent",' +
      '"2:Combat Trick:Talent",' +
      '"2:Fast Stealth:Talent",' +
      '"2:Finesse Rogue:Talent",' +
      '"2:Ledge Walker:Talent",' +
      '"2:Minor Magic:Talent",' +
      '"2:Quick Disable:Talent",' +
      '"2:Resiliency:Talent",' +
      '"2:Rogue Crawl:Talent",' +
      '"2:Slow Reactions:Talent",' +
      '"2:Stand Up:Talent",' +
      '"2:Surprise Attack:Talent",' +
      '"2:Trap Spotter:Talent",' +
      '"2:Weapon Training (Rogue):Talent",' +
      '"10:Crippling Strike:Talent",' +
      '"10:Defensive Roll:Talent",' +
      '"10:Feat (Rogue):Talent",' +
      '"10:Improved Evasion:Talent",' +
      '"10:Opportunist:Talent",' +
      '"10:Skill Mastery:Talent",' +
      '"10:Slippery Mind:Talent",' +
      '"features.Minor Magic ? 2:Major Magic:Talent",' +
      '"features.Major Magic ? 10:Dispelling Attack:Talent"',
  'Sorcerer':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Bloodline","1:Cantrips","1:Eschew Materials",' +
      '"sorcererFeatures.Bloodline Aberrant ? 1:Acidic Ray",' +
      '"sorcererFeatures.Bloodline Aberrant ? 3:Long Limbs",' +
      '"sorcererFeatures.Bloodline Aberrant ? 9:Unusual Anatomy",' +
      '"sorcererFeatures.Bloodline Aberrant ? 15:Alien Resistance",' +
      '"sorcererFeatures.Bloodline Aberrant ? 20:Aberrant Form",' +
      '"sorcererFeatures.Bloodline Abyssal || features.Bloodline Draconic ? 1:Claws",' +
      '"sorcererFeatures.Bloodline Abyssal ? 3:Demon Resistances",' +
      '"sorcererFeatures.Bloodline Abyssal ? 9:Strength Of The Abyss",' +
      '"sorcererFeatures.Bloodline Abyssal ? 15:Added Summonings",' +
      '"sorcererFeatures.Bloodline Abyssal ? 20:Demonic Might",' +
      '"sorcererFeatures.Bloodline Arcane ? 1:Arcane Bond",' +
      '"sorcererFeatures.Bloodline Arcane ? 3:Metamagic Adept",' +
      '"sorcererFeatures.Bloodline Arcane ? 9:New Arcana",' +
      '"sorcererFeatures.Bloodline Arcane ? 15:School Power",' +
      '"sorcererFeatures.Bloodline Arcane ? 20:Arcane Apotheosis",' +
      '"sorcererFeatures.Bloodline Celestial ? 1:Heavenly Fire",' +
      '"sorcererFeatures.Bloodline Celestial ? 3:Celestial Resistances",' +
      '"sorcererFeatures.Bloodline Celestial ? 9:Wings Of Heaven",'+
      '"sorcererFeatures.Bloodline Celestial ? 15:Conviction",' +
      '"sorcererFeatures.Bloodline Celestial ? 20:Ascension",' +
      '"sorcererFeatures.Bloodline Destined ? 1:Touch Of Destiny",' +
      '"sorcererFeatures.Bloodline Destined ? 3:Fated",' +
      '"sorcererFeatures.Bloodline Destined ? 9:It Was Meant To Be",' +
      '"sorcererFeatures.Bloodline Destined ? 15:Within Reach",' +
      '"sorcererFeatures.Bloodline Destined ? 20:Destiny Realized",' +
      // Claws included above
      '"features.Bloodline Draconic ? 3:Dragon Resistances",' +
      '"features.Bloodline Draconic ? 9:Breath Weapon",' +
      '"features.Bloodline Draconic ? 15:Wings",' +
      '"features.Bloodline Draconic ? 20:Power Of Wyrms",' +
      '"features.Bloodline Elemental ? 1:Elemental Ray",' +
      '"features.Bloodline Elemental ? 3:Elemental Resistance",' +
      '"features.Bloodline Elemental ? 9:Elemental Blast",' +
      '"features.Bloodline Elemental ? 15:Elemental Movement",' +
      '"features.Bloodline Elemental ? 20:Elemental Body",' +
      '"sorcererFeatures.Bloodline Fey ? 1:Laughing Touch",' +
      '"sorcererFeatures.Bloodline Fey ? 3:Woodland Stride",' +
      '"sorcererFeatures.Bloodline Fey ? 9:Fleeting Glance",' +
      '"sorcererFeatures.Bloodline Fey ? 15:Fey Magic",' +
      '"sorcererFeatures.Bloodline Fey ? 20:Soul Of The Fey",' +
      '"sorcererFeatures.Bloodline Infernal ? 1:Corrupting Touch",' +
      '"sorcererFeatures.Bloodline Infernal ? 3:Infernal Resistances",' +
      '"sorcererFeatures.Bloodline Infernal ? 9:Hellfire",' +
      '"sorcererFeatures.Bloodline Infernal ? 15:On Dark Wings",' +
      '"sorcererFeatures.Bloodline Infernal ? 20:Power Of The Pit",' +
      '"sorcererFeatures.Bloodline Undead ? 1:Grave Touch (Undead)",' +
      '"sorcererFeatures.Bloodline Undead ? 3:Death\'s Gift",' +
      '"sorcererFeatures.Bloodline Undead ? 9:Grasp Of The Dead",' +
      '"sorcererFeatures.Bloodline Undead ? 15:Incorporeal Form",' +
      '"sorcererFeatures.Bloodline Undead ? 20:One Of Us" ' +
    'Selectables=' +
      '"1:Bloodline Aberrant:Bloodline",' +
      '"1:Bloodline Abyssal:Bloodline",' +
      '"1:Bloodline Arcane:Bloodline",' +
      '"1:Bloodline Celestial:Bloodline",' +
      '"1:Bloodline Destined:Bloodline",' +
      '"1:Bloodline Draconic (Black):Bloodline",' +
      '"1:Bloodline Draconic (Blue):Bloodline",' +
      '"1:Bloodline Draconic (Green):Bloodline",' +
      '"1:Bloodline Draconic (Red):Bloodline",' +
      '"1:Bloodline Draconic (White):Bloodline",' +
      '"1:Bloodline Draconic (Brass):Bloodline",' +
      '"1:Bloodline Draconic (Bronze):Bloodline",' +
      '"1:Bloodline Draconic (Copper):Bloodline",' +
      '"1:Bloodline Draconic (Gold):Bloodline",' +
      '"1:Bloodline Draconic (Silver):Bloodline",' +
      '"1:Bloodline Elemental (Air):Bloodline",' +
      '"1:Bloodline Elemental (Earth):Bloodline",' +
      '"1:Bloodline Elemental (Fire):Bloodline",' +
      '"1:Bloodline Elemental (Water):Bloodline",' +
      '"1:Bloodline Fey:Bloodline",' +
      '"1:Bloodline Infernal:Bloodline",' +
      '"1:Bloodline Undead:Bloodline",' +
      '"1:Bonded Object:Arcane Bond",' +
      '"1:Familiar:Arcane Bond" ' +
    'CasterLevelArcane=levels.Sorcerer ' +
    'SpellAbility=Charisma ' +
    'SpellsAvailable=' +
      'S0:4@1;5@2;6@4;7@6;8@8;9@10,' +
      'S1:2@1;3@3;4@5;5@7,' +
      'S2:1@4;2@5;3@7;4@9;5@11,' +
      'S3:1@6;2@7;3@9;4@11,' +
      'S4:1@8;2@9;3@11;4@13,' +
      'S5:1@10;2@11;3@13;4@15,' +
      'S6:1@12;2@13;3@15,' +
      'S7:1@14;2@15;3@17,' +
      'S8:1@16;2@17;3@19,' +
      'S9:1@18;2@19;3@20 ' +
    'SpellSlots=' +
      'S0:4@1;5@2;6@4;7@6;8@8;9@10,' +
      'S1:3@1;4@2;5@3;6@4,' +
      'S2:3@4;4@5;5@6;6@7,' +
      'S3:3@6;4@7;5@8;6@9,' +
      'S4:3@8;4@9;5@10;6@11,' +
      'S5:3@10;4@11;5@12;6@13,' +
      'S6:3@12;4@13;5@14;6@15,' +
      'S7:3@14;4@15;5@16;6@17,' +
      'S8:3@16;4@17;5@18;6@19,' +
      'S9:3@18;4@19;6@20',
  'Wizard':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Club; Dagger; Heavy Crossbow; Light Crossbow; Quarterstaff)",' +
      '"1:Arcane Bond","1:School Specialization","1:Scribe Scroll",' +
      '"5:Bonus Feats (Wizard)",' +
      '"features.School Specialization (None) ? 1:Hand Of The Apprentice",' +
      '"features.School Specialization (None) ? 8:Metamagic Mastery" ' +
    'Selectables=' +
      '"1:Bonded Object:Arcane Bond",' +
      '"1:Familiar:Arcane Bond",' +
      '"1:School Specialization (None):Specialization",'+
      QuilvynUtils.getKeys(SRD35.SCHOOLS).map(x => '"1:School Specialization (' + x + '):Specialization"').join(',') + ',' +
      QuilvynUtils.getKeys(SRD35.SCHOOLS).map(x => '"1:School Opposition (' + x + '):Opposition"').join(',') + ' ' +
    'CasterLevelArcane=levels.Wizard ' +
    'SpellAbility=Intelligence ' +
    'SpellSlots=' +
      'W0:1=3;2=4,' +
      'W1:1=1;2=2;4=3;7=4,' +
      'W2:3=1;4=2;6=3;9=4,' +
      'W3:5=1;6=2;8=3;11=4,' +
      'W4:7=1;8=2;10=3;13=4,' +
      'W5:9=1;10=2;12=3;15=4,' +
      'W6:11=1;12=2;14=3;17=4,' +
      'W7:13=1;14=2;16=3;19=4,' +
      'W8:15=1;16=2;18=3;20=4,' +
      'W9:17=1;18=2;19=3;20=4'
};
Pathfinder.NPC_CLASSES = {
  'Adept':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple Weapons)","2:Summon Familiar" ' +
    'Skills=' +
      'Craft,"Handle Animal",Heal,Knowledge,Profession,Spellcraft,Survival ' +
    'CasterLevelDivine=levels.Adept ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'Adept0:3@1,' +
      'Adept1:1@1;2@3;3@7,' +
      'Adept2:0@4;1@5;2@7;3@11,' +
      'Adept3:0@8;1@9;2@11;3@15,' +
      'Adept4:0@12;1@13;2@15;3@19,' +
      'Adept5:0@16;1@17;2@19',
  'Aristocrat':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)" ' +
    'Skills=' +
      'Appraise,Bluff,Craft,Diplomacy,Disguise,"Handle Animal",Intimidate,' +
      'Knowledge,Linguistics,Perception,Perform,Profession,Ride,' +
      '"Sense Motive",Swim,Survival',
  'Commoner':
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple Weapons)" ' +
    'Skills=Climb,Craft,"Handle Animal",Perception,Profession,Ride,Swim',
  'Expert':
    'HitDie=d6 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Simple Weapons)",' +
      '"1:Expert Skills"',
  'Warrior':
    'HitDie=d8 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Heavy; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)" ' +
    'Skills=Climb,Craft,"Handle Animal",Intimidate,Profession,Ride,Swim'
};
Pathfinder.PRESTIGE_CLASSES = {
  'Arcane Archer':
    'Require=' +
      '"baseAttack >= 6","casterLevelArcane >= 1","features.Point-Blank Shot",'+
      '"features.Precise Shot",' +
      '"features.Weapon Focus (Longbow) || ' +
      ' features.Weapon Focus (Composite Longbow) || ' +
      ' features.Weapon Focus (Shortbow) || ' +
      ' features.Weapon Focus (Composite Shortbow)" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Perception,Ride,Stealth,Survival ' +
    'Features=' +
      '"1:Armor Proficiency (Light; Medium; Shield)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Enhance Arrows (Magic)","2:Arcane Caster Level Bonus",' +
      '"2:Imbue Arrow","3:Enhance Arrows (Elemental)","4:Seeker Arrow",' +
      '"5:Enhance Arrows (Distance)","6:Phase Arrow","8:Hail Of Arrows",' +
      '"9:Enhance Arrows (Aligned)","10:Arrow Of Death"',
  'Arcane Trickster':
    'Require=' +
      '"alignment !~ \'Lawful\'","sneakAttack >= 2",' +
      '"skills.Disable Device >= 4","skills.Escape Artist >= 4",' +
      '"skills.Knowledge (Arcana) >= 4","Sum \'^spells\\.Mage Hand\' >= 1",' +
      '"Sum \'^spells\\..*[BSW]3\' >= 0" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Acrobatics,Appraise,Bluff,Climb,Diplomacy,"Disable Device",Disguise,' +
      '"Escape Artist",Knowledge,Perception,"Sense Motive","Sleight Of Hand",' +
      'Spellcraft,Stealth,Swim ' +
    'Features=' +
      '"1:Arcane Caster Level Bonus","1:Ranged Legerdemain","2:Sneak Attack",' +
      '"3:Impromptu Sneak Attack","5:Tricky Spells","9:Invisible Thief",' +
      '"10:Surprise Spells"',
  'Assassin':
    'Require=' +
      '"alignment =~ \'Evil\'","skills.Disguise >= 2","skills.Stealth >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,Climb,Diplomacy,"Disable Device",Disguise,' +
      '"Escape Artist",Intimidate,Linguistics,Perception,"Sense Motive",' +
      '"Sleight Of Hand",Stealth,Swim,"Use Magic Device" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Dagger; Dart; Hand Crossbow; Heavy Crossbow; Light Crossbow; Punching Dagger; Rapier; Sap; Shortbow; Composite Shortbow; Short Sword)",' +
      '"1:Death Attack","1:Poison Use","1:Sneak Attack",' +
      '"2:Save Bonus Against Poison","2:Uncanny Dodge","4:Hidden Weapons",' +
      '"4:True Death","5:Improved Uncanny Dodge","6:Quiet Death",' +
      '"8:Hide In Plain Sight","9:Swift Death","10:Angel Of Death"',
  'Dragon Disciple':
    'Require=' +
      '"languages.Draconic","race !~ \'Dragon\'",' +
      '"skills.Knowledge (Arcana) >= 5",' +
      // i.e., Arcane spells w/out prep
      '"levels.Bard > 0 || levels.Sorcerer > 0",' +
      '"levels.Sorcerer == 0 || features.Bloodline Draconic" ' +
    'HitDie=d12 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Diplomacy,"Escape Artist",Fly,Knowledge,Perception,Spellcraft ' +
    'Features=' +
      '"1:Blood Of Dragons","1:Natural Armor Increase","2:Ability Boost",' +
      '"2:Arcane Caster Level Bonus","2:Bloodline Feat","2:Dragon Bite",' +
      '"5:Blindsense","7:Dragon Form",9:Wings ' +
    'Selectables=' +
      '"1:Bloodline Draconic (Black):Bloodline",' +
      '"1:Bloodline Draconic (Blue):Bloodline",' +
      '"1:Bloodline Draconic (Green):Bloodline",' +
      '"1:Bloodline Draconic (Red):Bloodline",' +
      '"1:Bloodline Draconic (White):Bloodline",' +
      '"1:Bloodline Draconic (Brass):Bloodline",' +
      '"1:Bloodline Draconic (Bronze):Bloodline",' +
      '"1:Bloodline Draconic (Copper):Bloodline",' +
      '"1:Bloodline Draconic (Gold):Bloodline",' +
      '"1:Bloodline Draconic (Silver):Bloodline"',
  'Duelist':
    'Require=' +
      '"baseAttack >= 6",features.Dodge,features.Mobility,' +
      '"features.Weapon Finesse","skills.Acrobatics >= 2",' +
      '"Sum \'^skills\\.Perform \' >= 2" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,"Escape Artist",Perception,Perform,"Sense Motive" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple Weapons; Martial Weapons)",' +
      '"1:Canny Defense","1:Precise Strike (Duelist)","2:Improved Reaction",' +
      '"2:Parry","3:Enhanced Mobility","4:Combat Reflexes","4:Grace",' +
      '"5:Riposte","6:Acrobatic Charge","7:Elaborate Defense",' +
      '"9:Deflect Arrows","9:No Retreat","10:Crippling Critical (Duelist)"',
  'Eldritch Knight':
    'Require=' +
      '"weaponProficiency.Martial Weapons",' +
      '"Sum \'^spells\\..*[BSW]3\' >= 0" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,"Knowledge (Arcana)","Knowledge (Nobility)",Linguistics,Ride,' +
      '"Sense Motive",Spellcraft,Swim ' +
    'Features=' +
      '"1:Bonus Feat (Eldritch Knight)","1:Diverse Training",' +
      '"2:Arcane Caster Level Bonus","10:Spell Critical"',
  'Loremaster':
    'Require=' +
      '"Sum \'^features\\.Skill Focus .Knowledge\' >= 0",' +
      '"Sum \'^spells\\..*Divi\' >= 7","Sum \'^spells\\..*3 Divi\' >= 1",' +
      '"countKnowledgeGe7 >= 2" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Appraise,Diplomacy,"Handle Animal",Heal,Knowledge,Linguistics,' +
      'Perform,Spellcraft,"Use Magic Device" ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Secret","2:Lore","4:Bonus Languages",' +
      '"6:Greater Lore","10:True Lore" ' +
    'Selectables=' +
      '"1:Applicable Knowledge:Secret",' +
      '"1:Dodge Trick:Secret",' +
      '"1:Instant Mastery:Secret",' +
      '"1:More Newfound Arcana:Secret",' +
      '"1:Newfound Arcana:Secret",' +
      '"1:Secret Health:Secret",' +
      '"1:Secret Knowledge Of Avoidance:Secret",' +
      '"1:Secrets Of Inner Strength:Secret",' +
      '"1:The Lore Of True Stamina:Secret",' +
      '"1:Weapon Trick:Secret"',
  'Mystic Theurge':
    'Require=' +
      '"casterLevelArcane >= 3","casterLevelDivine >= 3",' +
      '"skills.Knowledge (Arcana) >= 3","skills.Knowledge (Religion) >= 3" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      '"Knowledge (Arcana)","Knowledge (Religion)","Sense Motive",Spellcraft ' +
    'Features=' +
      '"1:Arcane Caster Level Bonus","1:Divine Caster Level Bonus",' +
      '"1:Combined Spells","10:Spell Synthesis"',
  'Pathfinder Chronicler':
    'Require=' +
      '"skills.Linguistics >= 3","skills.Perform (Oratory) >= 5",' +
      '"skills.Profession (Scribe) >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Diplomacy,Disguise,"Escape Artist",Intimidate,' +
      'Knowledge,Linguistics,Perception,Perform,Ride,"Sense Motive",' +
      '"Sleight Of Hand",Survival,"Use Magic Device" ' +
    'Features=' +
      '"1:Bardic Knowledge","1:Deep Pockets","1:Master Scribe",' +
      '"2:Live To Tell The Tale",2:Pathfinding,"3:Bardic Performance",' +
      '"3:Countersong","3:Distraction","3:Fascinate","3:Improved Aid",' +
      '"3:Inspire Courage","4:Epic Tales","5:Inspire Competence",' +
      '"5:Whispering Campaign","6:Inspire Action","7:Call Down The Legends",' +
      '"8:Greater Epic Tales","8:Suggestion","10:Dirge Of Doom",' +
      '"10:Lay Of The Exalted Dead"',
  'Shadowdancer':
    'Require=' +
      '"features.Combat Reflexes",features.Dodge,features.Mobility,' +
      '"skills.Stealth >= 5","skills.Perform (Dance) >= 2" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,Diplomacy,Disguise,"Escape Artist",Perception,' +
      'Perform,"Sleight Of Hand",Stealth ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Club; Composite Shortbow; Dagger; Dart; Hand Crossbow; Heavy Crossbow; Light Crossbow; Mace; Morningstar; Punching Dagger; Quarterstaff; Rapier; Sap; Shortbow; Short Sword)",' +
      '"1:Hide In Plain Sight",2:Darkvision,2:Evasion,"2:Uncanny Dodge",' +
      '"3:Rogue Talents (Shadowdancer)","3:Shadow Illusion",' +
      '"3:Summon Shadow","4:Shadow Call","4:Shadow Jump","5:Defensive Roll",' +
      '"5:Improved Uncanny Dodge","7:Slippery Mind","8:Shadow Power",' +
      '"10:Improved Evasion","10:Shadow Master" ' +
    'Selectables=' +
      '"3:Bleeding Attack:Talent",' +
      '"3:Combat Trick:Talent",' +
      '"3:Fast Stealth:Talent",' +
      '"3:Finesse Rogue:Talent",' +
      '"3:Ledge Walker:Talent",' +
      '"3:Major Magic:Talent",' +
      '"3:Minor Magic:Talent",' +
      '"3:Quick Disable:Talent",' +
      '"3:Resiliency:Talent",' +
      '"3:Rogue Crawl:Talent",' +
      '"3:Slow Reactions:Talent",' +
      '"3:Stand Up:Talent",' +
      '"3:Surprise Attack:Talent",' +
      '"3:Trap Spotter:Talent",' +
      '"3:Weapon Training (Rogue):Talent",' +
      '"3:Crippling Strike:Talent",' +
      '"3:Defensive Roll:Talent",' +
      '"3:Dispelling Attack:Talent",' +
      '"3:Feat (Rogue):Talent",' +
      '"3:Improved Evasion:Talent",' +
      '"3:Opportunist:Talent",' +
      '"3:Skill Mastery:Talent",' +
      '"3:Slippery Mind:Talent"'
};
Pathfinder.DEITIES = {
  'None':'',
  'Abadar':
    'Alignment=LN ' +
    'Weapon="Light Crossbow" ' +
    'Domain=Earth,Law,Nobility,Protection,Travel',
  'Asmodeus':
    'Alignment=LE ' +
    'Weapon="Heavy Mace","Light Mace" ' +
    'Domain=Evil,Fire,Law,Magic,Trickery',
  'Calistria':
    'Alignment=CN ' +
    'Weapon=Whip ' +
    'Domain=Chaos,Charm,Knowledge,Luck,Trickery',
  'Cayden Cailean':
    'Alignment=CG ' +
    'Weapon=Rapier ' +
    'Domain=Chaos,Charm,Good,Strength,Travel',
  'Desna':
    'Alignment=CG ' +
    'Weapon=Starknife ' +
    'Domain=Chaos,Good,Liberation,Luck,Travel',
  'Erastil':
    'Alignment=LG ' +
    'Weapon=Longbow ' +
    'Domain=Animal,Community,Good,Law,Plant',
  'Gozreh':
    'Alignment=N ' +
    'Weapon=Trident ' +
    'Domain=Air,Animal,Plant,Water,Weather',
  'Gorum':
    'Alignment=CN ' +
    'Weapon=Greatsword ' +
    'Domain=Chaos,Destruction,Glory,Strength,War',
  'Iomedae':
    'Alignment=LG ' +
    'Weapon=Longsword ' +
    'Domain=Glory,Good,Law,Sun,War',
  'Irori':
    'Alignment=LN ' +
    'Weapon="Unarmed Strike" ' +
    'Domain=Healing,Knowledge,Law,Rune,Strength',
  'Lamashtu':
    'Alignment=CE ' +
    'Weapon=Falchion ' +
    'Domain=Chaos,Evil,Madness,Strength,Trickery',
  'Nethys':
    'Alignment=N ' +
    'Weapon=Quarterstaff ' +
    'Domain=Destruction,Knowledge,Magic,Protection,Rune',
  'Norgorber':
    'Alignment=NE ' +
    'Weapon="Short Sword" ' +
    'Domain=Charm,Death,Evil,Knowledge,Trickery',
  'Pharasma':
    'Alignment=N ' +
    'Weapon=Dagger ' +
    'Domain=Death,Healing,Knowledge,Repose,Water',
  'Rovagug':
    'Alignment=CE ' +
    'Weapon=Greataxe ' +
    'Domain=Chaos,Destruction,Evil,War,Weather',
  'Sarenrae':
    'Alignment=NG ' +
    'Weapon=Scimitar ' +
    'Domain=Fire,Glory,Good,Healing,Sun',
  'Shelyn':
    'Alignment=NG ' +
    'Weapon=Glaive ' +
    'Domain=Air,Charm,Good,Luck,Protection',
  'Torag':
    'Alignment=LG ' +
    'Weapon=Warhammer ' +
    'Domain=Artifice,Earth,Good,Law,Protection',
  'Urgathoa':
    'Alignment=NE ' +
    'Weapon=Scythe ' +
    'Domain=Death,Evil,Magic,Strength,War',
  'Zon-Kuthon':
    'Alignment=LE ' +
    'Weapon="Spiked Chain" ' +
    'Domain=Darkness,Death,Destruction,Evil,Law'
};

Pathfinder.SRD35_SKILL_MAP = {
  'Balance':'Acrobatics',
  'Concentration':'',
  'Decipher Script':'Linguistics',
  'Forgery':'Linguistics',
  'Gather Information':'Diplomacy',
  'Hide':'Stealth',
  'Jump':'Acrobatics',
  'Listen':'Perception',
  'Move Silently':'Stealth',
  'Open Lock':'Disable Device',
  'Search':'Perception',
  'Speak Language':'Linguistics',
  'Spot':'Perception',
  'Tumble':'Acrobatics',
  'Use Rope':''
};

/* Defines rules related to character abilities. */
Pathfinder.abilityRules = function(rules) {
  SRD35.abilityRules(rules);
  // Disable SRD35's minimum ability checks--not part of the PFv1 rules
  rules.defineRule('validationNotes.abilityMinimum', 'wisdom', '=', '0');
  rules.defineRule
    ('validationNotes.abilityModifierSum', 'wisdomModifier', '^', '0');
};

/* Defines rules related to animal companions and familiars. */
Pathfinder.aideRules = function(rules, companions, familiars) {
  SRD35.aideRules(rules, companions, familiars);
  // Override SRD35 HD calculation
  rules.defineRule('animalCompanionStats.HD',
    'companionMasterLevel', '=', 'source + 1 - Math.floor((source + 1) / 4)'
  );
  // Pathfinder-specific attributes
  rules.defineChoice('notes',
    'animalCompanionStats.CMB:%S',
    'familiarStats.CMB:%S'
  ); 
  rules.defineRule('animalCompanionStats.Feats',
    'companionMasterLevel', '=',
    'source >= 18 ? 8 : source >= 10 ? Math.floor((source + 5) / 3) : ' +
    'Math.floor((source + 4) / 3)'
  );
  rules.defineRule('animalCompanionStats.Skills',
    'companionMasterLevel', '=', 'source + 1 - Math.floor((source + 1) / 4)'
  );
  rules.defineRule('companionBAB',
    'animalCompanionStats.HD', '=', 'Math.floor(source * 3 / 4)'
  );
  rules.defineRule('animalCompanionStats.CMB',
    'companionBAB', '=', null,
    'companionCMBAbility', '+', 'Math.floor((source - 10) / 2)',
    'animalCompanionStats.Size', '+', 'source=="D" ? -4 : source=="T" ? -2 : source=="S" ? -1 : source=="L" ? 1 : source=="H" ? 2 : null'
  );
  rules.defineRule('animalCompanionStats.CMD',
    'companionBAB', '=', 'source + 10',
    'animalCompanionStats.Dex', '+', 'Math.floor((source - 10) / 2)',
    'animalCompanionStats.Str', '+', 'Math.floor((source - 10) / 2)',
    'animalCompanionStats.Size', '+', 'source=="D" ? -4 : source=="T" ? -2 : source=="S" ? -1 : source=="L" ? 1 : source=="H" ? 2 : null'
  );
  rules.defineRule('tinyCompanionCMBAbility',
    'animalCompanionStats.Size', '?', 'source == "T" || source == "D"',
    'animalCompanionStats.Dex', '=', null
  );
  rules.defineRule('companionCMBAbility',
    'animalCompanionStats.Str', '=', null,
    'tinyCompanionCMBAbility', '^', null
  );
  rules.defineRule('familiarMaxDexOrStr',
    'hasFamiliar', '?', null,
    'familiarStats.Dex', '=', null,
    'familiarStats.Str', '^', null
  );
  rules.defineRule('familiarBAB',
    'hasFamiliar', '?', null,
    'baseAttack', '=', null
  );
  rules.defineRule('tinyFamiliarCMBAbility',
    'familiarStats.Size', '?', 'source == "T" || source == "D"',
    'familiarStats.Dex', '=', null
  );
  rules.defineRule('familiarCMBAbility',
    'familiarStats.Str', '=', null,
    'tinyFamiliarCMBAbility', '^', null
  );
  rules.defineRule('familiarStats.CMB',
    'familiarBAB', '=', null,
    'familiarCMBAbility', '+', 'Math.floor((source - 10) / 2)',
    'familiarStats.Size', '+', 'source=="D" ? -4 : source=="T" ? -2 : source=="S" ? -1 : source=="L" ? 1 : null'
  );
  rules.defineRule('familiarStats.CMD',
    'familiarBAB', '=', 'source + 10',
    'familiarStats.Dex', '+', 'Math.floor((source - 10) / 2)',
    'familiarStats.Str', '+', 'Math.floor((source - 10) / 2)',
    'familiarStats.Size', '+', 'source=="D" ? -4 : source=="T" ? -2 : source=="S" ? -1 : source=="L" ? 1 : null'
  );
  // Rules for advanced companions
  rules.defineRule('companionMasterLevelsUntilAdvance',
    'animalCompanionStats.Advance Level', '=', null,
    'companionMasterLevel', '+', '-source'
  );
  rules.defineRule('animalCompanionStats.AC',
    'companionMasterLevelsUntilAdvance', '+', 'source <= 0 ? 1 : null'
  );
  rules.defineRule('animalCompanionStats.Con',
    'companionMasterLevelsUntilAdvance', '+', 'source <= 0 ? 2 : null'
  );
  rules.defineRule('animalCompanionStats.Dex',
    'companionMasterLevelsUntilAdvance', '+', 'source <= 0 ? 2 : null'
  );
  // Remove fiendish/celestial improvements from editor
  rules.defineEditorElement('familiarCelestial');
  rules.defineEditorElement('familiarFiendish');
};

/* Defines rules related to combat. */
Pathfinder.combatRules = function(rules, armors, shields, weapons) {
  SRD35.combatRules(rules, armors, shields, weapons);
  // Pathfinder-specific attributes
  rules.defineChoice('notes',
    'combatManeuverBonus:%S',
    'damageReduction.-:%V/%N',
    'damageReduction.Chaotic:%V/%N',
    'damageReduction.Cold Iron:%V/%N',
    'damageReduction.Evil:%V/%N'
  );
  rules.defineRule('combatManeuverBonus',
    'baseAttack', '=', null,
    'strengthModifier', '+', null
  );
  rules.defineRule('combatManeuverDefense',
    'baseAttack', '=', '10 + source',
    'strengthModifier', '+', null,
    'dexterityModifier', '+', null,
    'armorClassDeflectionModifier', '+', null,
    'armorClassDodgeModifier', '+', null
  );
  rules.defineSheetElement(
    'CombatManeuver', 'CombatStats/',
    '<b>Combat Maneuver Bonus/Defense</b>: %V', '/'
  );
  rules.defineSheetElement('Combat Maneuver Bonus', 'CombatManeuver/', '%V');
  rules.defineSheetElement('Combat Maneuver Defense', 'CombatManeuver/', '%V');
  rules.defineSheetElement(
    'CompanionTalents', 'CompanionAbilities/',
    '<b>Tricks/Feats/Skills</b>: %V', '/'
  );
  rules.defineSheetElement
    ('Animal Companion Stats.Tricks', 'CompanionTalents/', '%V');
  rules.defineSheetElement
    ('Animal Companion Stats.Feats', 'CompanionTalents/', '%V');
  rules.defineSheetElement
    ('Animal Companion Stats.Skills', 'CompanionTalents/', '%V');
  rules.defineSheetElement(
    'CompanionManeuver', 'CompanionSaves', '<b>CMB/CMD</b>: %V', '/'
  );
  rules.defineSheetElement
    ('Animal Companion Stats.CMB', 'CompanionManeuver/', '%V');
  rules.defineSheetElement
    ('Animal Companion Stats.CMD', 'CompanionManeuver/', '%V');
  rules.defineSheetElement(
    'FamiliarManeuver', 'FamiliarSaves', '<b>CMB/CMD</b>: %V', '/'
  );
  rules.defineSheetElement('Familiar Stats.CMB', 'FamiliarManeuver/', '%V');
  rules.defineSheetElement('Familiar Stats.CMD', 'FamiliarManeuver/', '%V');
};

/* Defines rules related to basic character identity. */
Pathfinder.identityRules = function(
  rules, alignments, classes, deities, factions, paths, races, tracks, traits,
  prestigeClasses, npcClasses
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots', 'SpellsAvailable']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Weapon']);
  QuilvynUtils.checkAttrTable(factions, ['Season', 'Successor']);
  // Note addition of feats and skills to SRD35's list
  QuilvynUtils.checkAttrTable
    (paths, ['Group', 'Level', 'Features', 'Selectables', 'Feats', 'Skills', 'SpellAbility', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(races, ['Require', 'Features', 'Selectables', 'Languages', 'SpellAbility', 'SpellSlots', 'Size', 'Speed']);
  QuilvynUtils.checkAttrTable(tracks, ['Progression']);
  QuilvynUtils.checkAttrTable(traits, ['Type', 'Subtype']);

  for(let alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(let clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  if(prestigeClasses) {
    for(let pc in prestigeClasses) {
      rules.choiceRules(rules, 'Prestige', pc, prestigeClasses[pc]);
      rules.defineRule('levels.' + pc, 'prestige.' + pc, '=', null);
      // Pathfinder prestige classes use different progressions for saves
      for(let save in {'Fortitude':'', 'Reflex':'', 'Will':''}) {
        let value = QuilvynUtils.getAttrValue(prestigeClasses[pc], save);
        rules.defineRule('class' + save + 'Bonus',
          'levels.' + pc, '+', 'Math.floor((source + 1) / ' + (value == '1/2' ? '2' : '3') + ')'
        );
      }
    }
  }
  if(npcClasses) {
    for(let nc in npcClasses) {
      rules.choiceRules(rules, 'NPC', nc, npcClasses[nc]);
      rules.defineRule('levels.' + nc, 'npc.' + nc, '=', null);
    }
  }
  for(let faction in factions) {
    rules.choiceRules(rules, 'Faction', faction, factions[faction]);
  }
  for(let deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(let path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
  }
  for(let race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }
  for(let track in tracks) {
    rules.choiceRules(rules, 'Track', track, tracks[track]);
  }
  for(let trait in traits) {
    rules.choiceRules(rules, 'Trait', trait, traits[trait]);
  }

  rules.defineEditorElement
    ('faction', 'Faction', 'select-one', 'factions', 'alignment');
  rules.defineSheetElement('Faction', 'Alignment');
  rules.defineEditorElement('traits', 'Traits', 'set', 'traits', 'skills');
  rules.defineSheetElement('Traits', 'Feats+', null, '; ');
  rules.defineChoice('extras', 'traits');
  rules.defineEditorElement
    ('experienceTrack', 'Track', 'select-one', 'tracks', 'feats');
  rules.defineSheetElement('Experience Track', 'ExperienceInfo/', ' (%V)');
  rules.defineEditorElement
    ('favoredClassHitPoints', 'Favored Class Hit Points/Skill Ranks', 'text', [4, '(\\+?\\d+)?'], 'hitPoints');
  rules.defineEditorElement
    ('favoredClassSkillPoints', '', 'text', [4, '(\\+?\\d+)?'], 'hitPoints');

  rules.defineRule('casterLevel',
    'casterLevelArcane', '=', null,
    'casterLevelDivine', '+=', null
  );
  rules.defineRule
    ('combatNotes.favoredClassHitPoints', 'favoredClassHitPoints', '=', null);
  rules.defineRule('features.Large', 'size', '=', 'source=="Large" ? 1 : null');
  rules.defineRule('features.Small', 'size', '=', 'source=="Small" ? 1 : null');
  rules.defineRule
    ('skillNotes.favoredClassSkillRanks', 'favoredClassSkillPoints', '=',null);
  rules.defineRule
    ('hitPoints', 'combatNotes.favoredClassHitPoints', '+=', null);
  rules.defineRule
    ('skillPoints', 'skillNotes.favoredClassSkillRanks', '+=', null);

  QuilvynRules.validAllocationRules
    (rules, 'level', 'level', 'Sum "^levels\\."');

};

/* Defines rules related to magic use. */
Pathfinder.magicRules = function(rules, schools, spells) {
  SRD35.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines rules related to character aptitudes. */
Pathfinder.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  SRD35.talentRules(rules, feats, features, goodies, languages, skills);
  // Override SRD35 intelligence skillPoint adjustment, feat count computation,
  // max ranks per skill, and armor skill check penalty and disable armor swim
  // check penalty.
  rules.defineRule
    ('skillNotes.intelligenceSkillPointsAdjustment', 'level', '*', '0');
  rules.defineRule('skillNotes.intelligenceSkillRanksAdjustment',
    'intelligenceModifier', '=', null,
    'level', '*', null
  );
  rules.defineRule
    ('skillPoints', 'skillNotes.intelligenceSkillRanksAdjustment', '+', null);
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');
  rules.defineRule('maxAllowedSkillAllocation', 'level', '=', null);
  rules.defineChoice
    ('notes', 'skillNotes.armorSkillCheckPenalty:%V Dexterity- and Strength-based skills');
  rules.defineRule('skillNotes.armorSwimCheckPenalty', 'level', '?', 'false');
  // Define specific attributes for Stat Block character sheet format
  rules.defineRule
    ('cmb', 'combatManeuverBonus', '=', '(source>=0 ? "+" : "") + source');
  rules.defineRule('cmd', 'combatManeuverDefense', '=', null);
  rules.defineRule('perception',
    'wisdomModifier', '=', '(source>=0 ? "+" : "") + source',
    'skillModifier.Perception', '=', '(source>=0 ? "+" : "") + source'
  );
  rules.defineSheetElement
    ('Skill Points', 'Max Allowed Skill Allocation', '<b>Skills</b> (%V ranks');
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Pathfinder.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    Pathfinder.alignmentRules(rules, name);
  else if(type == 'Animal Companion')
    Pathfinder.companionRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Armor')
    Pathfinder.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Class' || type == 'NPC' || type == 'Prestige') {
    Pathfinder.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValue(attrs, 'SkillPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Fortitude'),
      QuilvynUtils.getAttrValue(attrs, 'Reflex'),
      QuilvynUtils.getAttrValue(attrs, 'Will'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsAvailable')
    );
    Pathfinder.classRulesExtra(rules, name);
    if(type == 'Prestige')
      rules.defineRule('levels.' + name, 'prestige.' + name, '=', null);
    else if(type == 'NPC')
      rules.defineRule('levels.' + name, 'npc.' + name, '=', null);
  } else if(type == 'Class Feature') {
    SRD35.classFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Class'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  } else if(type == 'Deity')
    Pathfinder.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'Faction')
    Pathfinder.factionRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Season'),
      QuilvynUtils.getAttrValue(attrs, 'Successor')
    );
  else if(type == 'Familiar')
    Pathfinder.familiarRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Feat') {
    Pathfinder.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    Pathfinder.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    Pathfinder.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility')
    );
  else if(type == 'Goody')
    Pathfinder.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    Pathfinder.languageRules(rules, name);
  else if(type == 'Race') {
    Pathfinder.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Speed')
    );
    Pathfinder.raceRulesExtra(rules, name);
  } else if(type == 'Race Feature') {
    SRD35.raceFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Race'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
  } else if(type == 'School') {
    Pathfinder.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    Pathfinder.schoolRulesExtra(rules, name);
  } else if(type == 'Shield')
    Pathfinder.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    let untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    Pathfinder.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained && !(untrained+'').match(/(^n|false)$/i),
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergy')
    );
    Pathfinder.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    if(groupLevels.includes('W0'))
      groupLevels.push('Rogue0');
    else if(groupLevels.includes('W1'))
      groupLevels.push('Rogue1');
    let liquids = QuilvynUtils.getAttrValueArray(attrs, 'Liquid');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let schoolAbbr = (school || 'Universal').substring(0, 4);
    groupLevels.forEach(gl => {
      let matchInfo = (gl + '').match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + gl + '" for spell ' + name);
      } else {
        let group = matchInfo[1];
        let level = matchInfo[2] * 1;
        let fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
        let domainSpell =
          (rules.getChoices('selectableFeatures') != null &&
           ('Cleric - ' + group + ' Domain') in rules.getChoices('selectableFeatures')) ||
          Pathfinder.CLASSES.Cleric.includes(group + ' Domain');
        Pathfinder.spellRules
          (rules, fullName, school, group, level, description, domainSpell,
           liquids);
        rules.addChoice('spells', fullName, attrs);
      }
    });
  } else if(type == 'Track')
    Pathfinder.trackRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Progression')
    );
  else if(type == 'Trait') {
    Pathfinder.traitRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'Subtype')
    );
    Pathfinder.traitRulesExtra(rules, name);
  } else if(type == 'Weapon')
    Pathfinder.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Threat'),
      QuilvynUtils.getAttrValue(attrs, 'Crit'),
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValueArray(attrs, 'Properties')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
Pathfinder.alignmentRules = function(rules, name) {
  SRD35.alignmentRules(rules, name);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, imposes
 * #skillPenalty# on specific skills and yields a #spellFail# percent chance of
 * arcane spell failure.
 */
Pathfinder.armorRules = function(
  rules, name, ac, weight, maxDex, skillPenalty, spellFail
) {
  SRD35.armorRules(rules, name, ac, weight, maxDex, skillPenalty, spellFail);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points and #skillPoints# additional skill points with each
 * level advance. #attack# is one of '1', '1/2', or '3/4', indicating the base
 * attack progression for the class; similarly, #saveFort#, #saveRef#, and
 * #saveWill# are each one of '1/2' or '1/3', indicating the saving throw
 * progressions. #skills# indicate class skills for the class; see skillRules
 * for an alternate way these can be defined. #features# and #selectables# list
 * the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. If the class grants spell slots,
 * #spellAbility# names the ability for computing spell difficulty class,
 * #spellSlots# lists the number of spells per level per day granted, and
 * #spellsAvailable# list the number of spells known at each level.
 */
Pathfinder.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots, spellsAvailable
) {
  if(name == 'Monk') {
    let allFeats = rules.getChoices('feats');
    for(let feat in allFeats) {
      if(feat.startsWith('Improved Critical'))
        selectables.push('10:' + feat);
    }
  }
  SRD35.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots, spellsAvailable
  );
  // Override SRD35 skillPoints rule
  rules.defineRule
    ('skillPoints', 'levels.' + name, '+', 'source * ' + skillPoints);
  // Calculate maxSpellLevel for PFAPG
  spellSlots.forEach(s => {
    let m = s.match(/^([^:]+(\d+)):/);
    if(m)
      rules.defineRule('maxSpellLevel', 'spellSlots.' + m[1], '^=', m[2]);
  });
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * directly derived from the attributes passed to classRules.
 */
Pathfinder.classRulesExtra = function(rules, name) {

  let classLevel = 'levels.' + name;

  if(name == 'Barbarian') {

    rules.defineRule('ragePowerLevel', classLevel, '=', null);
    rules.defineRule('abilityNotes.fastMovement(Barbarian).1',
      'armorWeight', '?', 'source != "Heavy"',
      'abilityNotes.fastMovement(Barbarian)', '=', '10'
    );
    rules.defineRule('combatNotes.animalFury',
      '', '=', '"d4"',
      'features.Large', '=', '"' + SRD35.LARGE_DAMAGE.d4 + '"',
      'features.Small', '=', '"' + SRD35.SMALL_DAMAGE.d4 + '"'
    );
    rules.defineRule('combatNotes.damageReduction',
      classLevel, '^=', 'Math.floor((source - 4) / 3)'
    );
    rules.defineRule('combatNotes.increasedDamageReduction',
      'barbarianFeatures.Increased Damage Reduction', '=', null
    );
    rules.defineRule('combatNotes.rage',
      'constitutionModifier', '=', '4 + source',
      classLevel, '+', '(source - 1) * 2'
    );
    rules.defineRule
      ('damageReduction.-', 'combatNotes.damageReduction', '^=', null);
    rules.defineRule
      ('featureNotes.ragePowers', classLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('selectableFeatureCount.Barbarian (Rage Power)',
      'featureNotes.ragePowers', '+=', null
    );
    rules.defineRule
      ('saveNotes.trapSense', classLevel, '+=', 'Math.floor(source / 3)');
    rules.defineRule
      ('speed', 'abilityNotes.fastMovement(Barbarian).1', '+', null);
    rules.defineRule('barbarianFeatures.Improved Uncanny Dodge',
      'barbarianFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source>=2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      classLevel, '+=', null,
      '', '+', '4'
    );
    rules.defineRule
      ('uncannyDodgeSources', classLevel, '+=', 'source>=2 ? 1 : null');

  } else if(name == 'Bard') {

    rules.defineRule('bardicPerformanceLevel', classLevel, '+=', null);
    rules.defineRule('featureNotes.versatilePerformance',
      classLevel, '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule
      ('inspireCourageLevel', 'bardicPerformanceLevel', '+=', null);
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.simpleSomatics.1', 'v', '0'
    );
    // Compute in simpleSomatics.1 so that note will show even if character is
    // wearing heavy armor
    rules.defineRule('magicNotes.simpleSomatics.1',
      'magicNotes.simpleSomatics', '?', null,
      'armorWeight', '=', '"MediumHeavy".includes(source) ? null : 1'
    );
    rules.defineRule('selectableFeatureCount.Bard (Versatile Skill)',
      'featureNotes.versatilePerformance', '=', null
    );
    rules.defineRule('skillNotes.bardicKnowledge',
      classLevel, '+=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule
      ('skillNotes.jack-Of-All-Trades-1', classLevel, '?', 'source>=16');

  } else if(name == 'Cleric') {

    rules.defineRule('channelLevel', classLevel, '+=', null);
    rules.defineRule('magicNotes.channelEnergy',
      'charismaModifier', '=', '3 + source'
    );
    rules.defineRule('magicNotes.channelEnergy.1',
      'features.Channel Energy', '?', null,
      'channelLevel', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('selectableFeatureCount.Cleric (Domain)', classLevel, '=', '2');

    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Cleric - .* Domain/)) {
        let domain = s.replace('Cleric - ', '').replace(' Domain', '');
        rules.defineRule('clericDomainLevels.' + domain,
          'clericFeatures.' + domain + ' Domain', '?', null,
          'levels.Cleric', '=', null
        );
        rules.defineRule('clericDomainFeatures.' + domain,
          'clericDomainLevels.' + domain, '=', '1'
        );
        rules.defineRule('casterLevels.' + domain,
          'clericDomainLevels.' + domain, '^=', null
        );
        // Clerics w/no deity don't need to match deity domain
        rules.defineRule('validationNotes.cleric-' + domain + 'DomainSelectableFeature',
          'deity', '+', 'source == "None" ? 1 : null'
        );
      }
    }

    // N.B. Quilvyn.js replaces Infinity with "immune" on the character sheet
    // Air Domain
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.electricityResistance', '^=', null);
    rules.defineRule('saveNotes.electricityResistance',
      'casterLevels.Air', '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );
    // Animal Domain
    rules.defineRule
      ('companionMasterLevel', 'casterLevels.Animal', '^=', 'source - 3');
    // Earth Domain
    rules.defineRule
      ('resistance.Acid', 'saveNotes.acidResistance', '^=', null);
    rules.defineRule('saveNotes.acidResistance',
      'casterLevels.Earth', '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );
    // Fire Domain
    rules.defineRule
      ('resistance.Fire', 'saveNotes.fireResistance', '^=', null);
    rules.defineRule('saveNotes.fireResistance',
      'casterLevels.Fire', '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );
    // Protection Domain
    rules.defineRule('saveNotes.protectionDomain',
      'levels.Cleric', '=', '1 + Math.floor(source / 5)'
    );
    // Water Domain
    rules.defineRule('resistance.Cold', 'saveNotes.coldResistance', '^=', null);
    rules.defineRule('saveNotes.coldResistance',
      'casterLevels.Water', '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );

  } else if(name == 'Druid') {

    rules.defineRule('casterLevels.Domain', 'druidDomainLevel', '^=', null);
    rules.defineRule('companionDruidLevel',
      'druidFeatures.Animal Companion', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('companionMasterLevel', 'companionDruidLevel', '^=', null);
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Druid - .* Domain/)) {
        let domain = s.replace('Druid - ', '').replace(' Domain', '');
        rules.defineRule('druidDomainLevels.' + domain,
          'druidFeatures.' + domain + ' Domain', '?', null,
          'levels.Druid', '=', null
        );
        rules.defineRule('casterLevels.' + domain,
          'druidDomainLevels.' + domain, '^=', null
        );
        rules.defineRule
          ('druidDomainLevel', 'druidDomainLevels.' + domain, '^=', null);
      }
    }
    rules.defineRule('druidFeatures.Animal Companion',
      'druidDomainLevels.Animal', '=', 'source>=4 ? 1 : null'
    );
    rules.defineRule('selectableFeatureCount.Druid (Nature Bond)',
      'featureNotes.natureBond', '=', '1'
    );
    rules.defineRule('skillNotes.wildEmpathy',
      classLevel, '+=', null,
      'charismaModifier', '+', null
    );
    for(let level = 1; level <= 9; level++) {
      rules.defineRule('spellSlots.Domain' + level,
        'druidDomainLevel', '+=', 'source>=' + (level * 2 - 1) + ' ? 1 : null'
      );
    }
    rules.defineRule('wildShapeLevel', classLevel, '=', null);
    rules.defineRule
      ('casterLevels.AThousandFaces', 'casterLevels.Druid', '=', null);

  } else if(name == 'Fighter') {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.armorTraining.1', '^', 'source>=0 ? 0 : null'
    );
    rules.defineRule('abilityNotes.armorTraining',
      classLevel, '=', 'source>=7 ? "heavy" : "medium"'
    );
    rules.defineRule('abilityNotes.armorTraining.1',
      'abilityNotes.armorTraining', '=', 'source=="heavy" ? 3 : 2',
      'armorWeight', '+', '{None:0, Light:-1, Medium:-2, Heavy:-3}[source]'
    );
    rules.defineRule
      ('armorDexterityMaximum', 'combatNotes.armorTraining', '+', null);
    rules.defineRule('combatNotes.armorMastery.1',
      'combatNotes.armorMastery', '?', null,
      'armor', '=', 'source != "None" ? 1 : null',
      'shield', '=', 'source != "None" ? 1 : null'
    );
    rules.defineRule('combatNotes.armorTraining',
      'dexterityModifier', '=', null,
      'dexterityArmorClassModifier', '+', '-source',
      classLevel, 'v', 'Math.min(Math.floor((source + 1) / 4), 4)',
      '', '^', '0'
    );
    rules.defineRule('combatNotes.weaponTraining',
      classLevel, '=',
        '(source>=17 ? "+4, " : "") + (source>=13 ? "+3, " : "") + ' +
        '(source>=9 ? "+2, " : "") + "+1"'
    );
    rules.defineRule('combatNotes.weaponTraining.1',
      'combatNotes.weaponTraining', '=', '(source+"").replace("+", "").replace(/,.*/, "")'
    );
    rules.defineRule
      ('damageReduction.-', 'combatNotes.armorMastery.1', '^=', '5');
    rules.defineRule
      ('featCount.Fighter', 'featureNotes.bonusFeats(Fighter)', '+=', null);
    rules.defineRule('featureNotes.bonusFeats(Fighter)',
      classLevel, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('fighterFeatLevel', classLevel, '+=', null);
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.armorTraining', '+', null
    );
    rules.defineRule('skillNotes.armorTraining',
      classLevel, '=', 'Math.min(Math.floor((source + 1) / 4), 4)'
    );

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.fastMovement(Monk)',
      classLevel, '+=', '10 * Math.floor(source / 3)'
    );
    // N.B.: this untyped bonus applies to both flat-footed and touch
    rules.defineRule('armorClass', 'combatNotes.armorClassBonus.1', '+', null);
    // Display the Armor Class Bonus note even when armored
    rules.defineRule('combatNotes.armorClassBonus',
      classLevel, '=', 'Math.floor(source / 4)', // Changed from SRD35
      'wisdomModifier', '+', 'source>0 ? source : null'
    );
    rules.defineRule('combatNotes.armorClassBonus.1',
      'armor', '?', 'source == "None"',
      'combatNotes.armorClassBonus', '=', null
    );
    // fob.0 isn't displayed--used only to ease prefixing '+' as appropriate
    rules.defineRule('combatNotes.flurryOfBlows.0',
      classLevel, '=', 'source - 2',
      'meleeAttack', '+', null,
      'baseAttack', '+', '-source'
    );
    rules.defineRule('combatNotes.flurryOfBlows.1',
      'combatNotes.flurryOfBlows.0', '=', 'source>=0 ? "+" + source : source'
    );
    rules.defineRule('combatNotes.flurryOfBlows.2',
      'combatNotes.flurryOfBlows.0', '=', 'source>=0 ? ", +" + source : (", " + source)'
    );
    rules.defineRule('combatNotes.flurryOfBlows.3',
      'combatNotes.flurryOfBlows.0', '=', 'source>=5 ? ", +" + (source - 5) : (", " + (source - 5))',
      classLevel, '=', 'source<6 ? "" : null'
    );
    rules.defineRule('combatNotes.flurryOfBlows.4',
      'combatNotes.flurryOfBlows.3', '=', null,
      classLevel, '=', 'source<8 ? "" : null'
    );
    rules.defineRule('combatNotes.flurryOfBlows.5',
      'combatNotes.flurryOfBlows.0', '=', 'source>=10 ? ", +" + (source - 10) : (", " + (source - 10))',
      classLevel, '=', 'source<11 ? "" : null'
    );
    rules.defineRule('combatNotes.flurryOfBlows.6',
      'combatNotes.flurryOfBlows.5', '=', null,
      classLevel, '=', 'source<15 ? "" : null'
    );
    rules.defineRule('combatNotes.flurryOfBlows.7',
      'combatNotes.flurryOfBlows.0', '=', 'source>=15 ? ", +" + (source - 15) : (", " + (source - 15))',
      classLevel, '=', 'source<16 ? "" : null'
    );
    rules.defineRule('combatNotes.flurryOfBlows.8',
      'combatNotes.flurryOfBlows.0', '=', 'source>=0 ? "+" + source : source'
    );
    rules.defineRule('combatNotes.maneuverTraining',
      classLevel, '=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule
      ('damageReduction.Chaotic', 'combatNotes.perfectSelf', '^=', '10');
    rules.defineRule('combatNotes.kiPool',
      classLevel, '=', 'Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('speed', 'abilityNotes.fastMovement(Monk)', '+', null);
    // NOTE Our rule engine doesn't support modifying a value via indexing.
    // Here, we work around this limitation by defining rules that set global
    // values as a side effect, then use these values in our calculations.
    rules.defineRule('combatNotes.unarmedStrike',
      classLevel, '=',
        'SRD35.SMALL_DAMAGE["monk"] = ' +
        'SRD35.LARGE_DAMAGE["monk"] = ' +
        'source < 12 ? ("d" + (6 + Math.floor(source / 4) * 2)) : ' +
        '              ("2d" + (6 + Math.floor((source - 12) / 4) * 2))',
      'features.Small', '=', 'SRD35.SMALL_DAMAGE[SRD35.SMALL_DAMAGE["monk"]]',
      'features.Large', '=', 'SRD35.LARGE_DAMAGE[SRD35.LARGE_DAMAGE["monk"]]'
    );
    rules.defineRule
      ('unarmedStrikeDamageDice', 'combatNotes.unarmedStrike', '=', null);
    rules.defineRule('featureNotes.bonusFeats(Monk)',
      classLevel, '=', '1 + Math.floor((source + 2) / 4)'
    );
    rules.defineRule
      ('resistance.Disease', 'saveNotes.purityOfBody', '=', '"immune"');
    rules.defineRule
      ('saveNotes.diamondSoul', classLevel, '=', '10 + source');
    rules.defineRule('selectableFeatureCount.Monk (Bonus Feats)',
      'featureNotes.bonusFeats(Monk)', '=', null
    );
    rules.defineRule('spellResistance', 'saveNotes.diamondSoul', '^=', null);

  } else if(name == 'Paladin') {

    rules.defineRule('animalCompanion.Celestial',
      'companionPaladinLevel', '=', 'source >= 11 ? 1 : null'
    );
    rules.defineRule('animalCompanionFeatures.Companion Spell Resistance',
      'companionPaladinLevel', '=', 'source >= 15 ? 1 : null'
    );
    rules.defineRule
      ('animalCompanionStats.Int', 'companionPaladinLevel', '^', '6');
    rules.defineRule('animalCompanionStats.SR',
      'companionNotes.companionSpellResistance', '^=', null
    );
    rules.defineRule
      ('channelLevel', classLevel, '+=', 'source>=4 ? source : null');
    rules.defineRule('combatNotes.auraOfRighteousness',
      classLevel, '=', 'source >= 20 ? 10 : 5'
    );
    rules.defineRule('combatNotes.smiteEvil',
      classLevel, '+=', '1 + Math.floor((source - 1) / 3)'
    );
    rules.defineRule('combatNotes.smiteEvil.1',
      'features.Smite Evil', '?', null,
      '', '=', '"an antipaladin, outsider, dragon, or undead"'
    );
    rules.defineRule
      ('companionMasterLevel', 'companionPaladinLevel', '^=', null);
    rules.defineRule('companionNotes.companionSpellResistance',
      'companionPaladinLevel', '=', 'source + 11'
    );
    rules.defineRule('companionPaladinLevel',
      'paladinFeatures.Divine Mount', '?', null,
      classLevel, '=', null
    );
    rules.defineRule
      ('damageReduction.Evil', 'combatNotes.auraOfRighteousness', '^=', null);
    rules.defineRule
      ('features.Channel Energy', 'features.Channel Positive Energy', '=', '1');
    rules.defineRule('features.Companion Spell Resistance',
      'animalCompanionFeatures.Companion Spell Resistance', '=', null
    );
    rules.defineRule
      ('magicNotes.layOnHands', classLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.layOnHands.1',
      classLevel, '=', 'Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('saveNotes.divineGrace', 'charismaModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Paladin (Divine Bond)',
      classLevel, '=', 'source >= 5 ? 1 : null'
    );
    rules.defineRule('selectableFeatureCount.Paladin (Mercy)',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    let mercies =
      QuilvynUtils.getKeys(rules.getChoices('selectableFeatures'), /Mercy/).map(x => x.replace(/^.*Mercy/, 'Mercy'));
    // Rule used only for its side-effect
    rules.defineRule('magicNotes.mercy',
      classLevel, '=', '(Pathfinder.merciesTaken = []) ? null : null'
    );
    for(let i = 0; i < mercies.length; i++) {
      let mercy = mercies[i];
      rules.defineRule('magicNotes.mercy',
        'paladinFeatures.' + mercy, '=', 'Pathfinder.merciesTaken.push("' + mercy.replace(/Mercy..|.$/g, '').toLowerCase() + '") ? Pathfinder.merciesTaken.length==2 ? Pathfinder.merciesTaken[0] + " and " + Pathfinder.merciesTaken[1] : Pathfinder.merciesTaken.join(", ").replace(/(.*),/, "$1, and") : ""'
      );
    }
    Pathfinder.featureSpells(rules,
      'Detect Evil', 'DetectEvil', 'charisma', classLevel,
      null, ['Detect Evil']
    );
    rules.defineRule('casterLevels.DetectEvil', classLevel, '=', null);

  } else if(name == 'Ranger') {

    rules.defineRule('combatNotes.favoredEnemy',
      classLevel, '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.favoredTerrain',
      classLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule
      ('companionMasterLevel', 'companionRangerLevel', '^=', null);
    rules.defineRule('companionRangerLevel',
      'rangerFeatures.Animal Companion', '?', null,
      classLevel, '+=', 'source - 3'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Archery Feat)',
      'features.Combat Style (Archery)', '?', null,
      classLevel, '=', 'source >= 2 ? Math.floor((source + 2) / 4) : null'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Combat Style)',
      'featureNotes.combatStyle', '=', '1'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Bond)",
      "featureNotes.hunter'sBond", '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Two-Weapon Feat)',
      'features.Combat Style (Two-Weapon Combat)', '?', null,
      classLevel, '=', 'source >= 2 ? Math.floor((source + 2) / 4) : null'
    );
    rules.defineRule('skillNotes.favoredEnemy',
      classLevel, '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('skillNotes.favoredTerrain',
      classLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('skillNotes.hideInPlainSight',
      'rangerFeatures.Hide In Plain Sight', '=', '"in a favored terrain"'
    );
    rules.defineRule('skillNotes.track',
      classLevel, '+=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('skillNotes.wildEmpathy',
      classLevel, '+=', null,
      'charismaModifier', '+', null
    );

  } else if(name == 'Rogue') {

    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'rogueWeaponTraining',
      'features.Weapon Training (Rogue)', 'Sum \'features\\.Weapon Focus\' >= 1'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      classLevel, '+=', null,
      '', '+', '4'
    );
    rules.defineRule('combatNotes.sneakAttack', 'sneakAttack', '=', null);
    rules.defineRule('featCount.Fighter',
      'featureNotes.combatTrick', '+=', '1',
      'featureNotes.weaponTraining(Rogue)', '+=', '1'
    );
    rules.defineRule
      ('features.Weapon Finesse', 'featureNotes.finesseRogue', '=', '1');
    rules.defineRule('featureNotes.rogueTalents',
      classLevel, '+=', 'Math.floor(source / 2)',
      'featureNotes.advancedTalents', '+', 'null' // italics
    );
    rules.defineRule('rogueFeatures.Improved Uncanny Dodge',
      'rogueFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('saveNotes.trapSense',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('selectableFeatureCount.Rogue (Talent)',
      'featureNotes.rogueTalents', '+=', null
    );
    rules.defineRule('skillNotes.trapfinding',
      classLevel, '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('sneakAttack',
      classLevel, '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('uncannyDodgeSources',
      classLevel, '+=', 'source >= 4 ? 1 : null'
    );
    Pathfinder.featureSpells(rules,
      'Dispelling Attack', 'DispellingAttack', 'intelligence', classLevel, null,
      ['Dispel Magic']
    );
    rules.defineRule('casterLevels.DispellingAttack', classLevel, '=', null);
    rules.defineRule('spellDifficultyClass.Rogue',
      'features.Minor Magic', '?', null,
      'intelligenceModifier', '=', '10 + source'
    );
    rules.defineRule('casterLevels.Rogue',
      'features.Minor Magic', '?', null,
      classLevel, '=', null
    );

  } else if(name == 'Sorcerer') {

    rules.defineRule('casterLevels.S', 'casterLevels.Sorcerer', '^=', null);
    rules.defineRule('selectableFeatureCount.Sorcerer (Bloodline)',
      'featureNotes.bloodline', '=', '1'
    );
    rules.defineRule('spellDifficultyClass.S',
      'casterLevels.S', '?', null,
      'charismaModifier', '=', '10 + source'
    );

    let allFeats = rules.getChoices('feats');
    let bloodlineFeats = {
      'Aberrant': [
        'Combat Casting', 'Improved Disarm', 'Improved Grapple',
        'Improved Initiative', 'Improved Unarmed Strike', 'Iron Will',
        'Silent Spell', 'Skill Focus (Knowledge (Dungeoneering))'
      ],
      'Abyssal': [
        'Augment Summoning', 'Cleave', 'Empower Spell', 'Great Fortitude',
        'Improved Bull Rush', 'Improved Sunder', 'Power Attack',
        'Skill Focus (Knowledge (Planes))'
      ],
      'Arcane': [
        'Combat Casting', 'Improved Counterspell', 'Improved Initiative',
        'Iron Will', 'Scribe Scroll', 'Skill Focus (Knowledge (Arcana))',
        'Still Spell'
      ],
      'Celestial': [
        'Dodge', 'Extend Spell', 'Iron Will', 'Mobility', 'Mounted Combat',
        'Ride-By Attack', 'Skill Focus (Knowledge (Religion))', 'Weapon Finesse'
      ],
      'Destined': [
        'Arcane Strike', 'Diehard', 'Endurance', 'Leadership',
        'Lightning Reflexes', 'Maximize Spell',
        'Skill Focus (Knowledge (History))'
      ],
      'Draconic': [
        'Blind-Fight', 'Great Fortitude', 'Improved Initiative',
        'Power Attack', 'Quicken Spell', 'Skill Focus (Fly)',
        'Skill Focus (Knowledge (Arcana))', 'Toughness'
      ],
      'Elemental': [
        'Dodge', 'Empower Spell', 'Great Fortitude', 'Improved Initiative',
        'Lightning Reflexes', 'Power Attack',
        'Skill Focus (Knowledge (Planes))', 'Weapon Finesse'
      ],
      'Fey': [
        'Dodge', 'Improved Initiative', 'Lightning Reflexes', 'Mobility',
        'Point-Blank Shot', 'Precise Shot', 'Quicken Spell',
        'Skill Focus (Knowledge (Nature))'
      ],
      'Infernal': [
        'Blind-Fight', 'Combat Expertise', 'Deceitful', 'Extend Spell',
        'Improved Disarm', 'Iron Will', 'Skill Focus (Knowledge (Planes))',
        'Spell Penetration'
      ],
      'Undead': [
        'Combat Casting', 'Diehard', 'Endurance', 'Iron Will',
         'Skill Focus (Knowledge (Religion))', 'Toughness'
      ]
    };
    for(let f in allFeats) {
      if(f.startsWith('Weapon Focus'))
        bloodlineFeats.Destined.push(f);
      else if(f.startsWith('Spell Focus')) {
        bloodlineFeats.Arcane.push(f);
        bloodlineFeats.Undead.push(f);
      }
    }

    for(let s in rules.getChoices('selectableFeatures')) {
      if(!s.match(/Sorcerer - Bloodline .*/))
        continue;
      let bloodline =
        s.replace('Sorcerer - Bloodline ', '').replace(/ \(.*\)/, '');
      rules.defineRule('bloodlineLevels.' + bloodline,
        'features.Bloodline ' +  bloodline, '?', null,
        'levels.Sorcerer', '+=', null
      );
      rules.defineRule('featCount.Bloodline ' + bloodline,
        'features.Bloodline ' + bloodline, '?', null,
        classLevel, '+=', 'source>=7 ? Math.floor((source - 1) / 6) : null'
      );
      (bloodlineFeats[bloodline] || []).forEach(f => {
        let attrs = allFeats[f];
        if(attrs == null) {
          console.log('Feat "' + f + '" undefined for bloodline ' + bloodline);
        } else {
          allFeats[f] =
            attrs.replace(/Type=/, 'Type="Bloodline ' + bloodline + '",');
        }
      });
    }

    rules.defineRule('casterLevels.Bloodline', classLevel, '=', null);
    Pathfinder.featureSpells(rules,
      'Bloodline Aberrant', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Enlarge Person', '5:See Invisibility', '7:Tongues',
       '9:Black Tentacles', '11:Feeblemind', '13:Veil',
       '15:Plane Shift', '17:Mind Blank', '19:Shapechange']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Abyssal', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Cause Fear', "5:Bull\'s Strength", '7:Rage',
       '9:Stoneskin', '11:Dismissal', '13:Transformation',
       '15:Greater Teleport', '17:Unholy Aura', '19:Summon Monster IX']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Arcane', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Identify', '5:Invisibility', '7:Dispel Magic',
       '9:Dimension Door', '11:Overland Flight', '13:True Seeing',
       '15:Greater Teleport', '17:Power Word Stun', '19:Wish']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Celestial', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Bless', '5:Resist Energy', '7:Magic Circle Against Evil',
       '9:Remove Curse', '11:Flame Strike', '13:Greater Dispel Magic',
       '15:Banishment', '17:Sunburst', '19:Gate']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Destined', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Alarm', '5:Blur', '7:Protection From Energy',
       '9:Freedom Of Movement', '11:Break Enchantment', '13:Mislead',
       '15:Spell Turning', '17:Moment Of Prescience', '19:Foresight']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Draconic', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Mage Armor', '5:Resist Energy', '7:Fly',
       '9:Fear', '11:Spell Resistance', '13:Form Of The Dragon I',
       '15:Form Of The Dragon II', '17:Form Of The Dragon III', '19:Wish']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Elemental', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Burning Hands', '5:Scorching Ray', '7:Protection From Energy',
       '9:Elemental Body I', '11:Elemental Body II', '13:Elemental Body III',
       '15:Elemental Body IV', '17:Summon Monster VIII', '19:Elemental Swarm']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Fey', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Entangle', '5:Hideous Laughter', '7:Deep Slumber',
       '9:Poison', '11:Tree Stride', '13:Mislead',
       '15:Phase Door', '17:Irresistible Dance', '19:Shapechange']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Infernal', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Protection From Good', '5:Scorching Ray', '7:Suggestion',
       '9:Charm Monster', '11:Dominate Person', '13:Planar Binding',
       '15:Greater Teleport', '17:Power Word Stun', '19:Meteor Swarm']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Undead', 'Bloodline', 'charisma',
      'casterLevels.Bloodline', '',
      ['3:Chill Touch', '5:False Life', '7:Vampiric Touch',
       '9:Animate Dead', '11:Waves Of Fatigue', '13:Undeath To Death',
       '15:Finger Of Death', '17:Horrid Wilting', '19:Energy Drain']
    );

    // Bloodline Aberrant
    rules.defineRule
      ('damageReduction.-', 'combatNotes.aberrantForm', '^=', '5');
    rules.defineRule
      ('skillNotes.blindsight', 'skillNotes.aberrantForm', '^=', '60');
    rules.defineRule('saveNotes.alienResistance',
      'bloodlineLevels.Aberrant', '=', 'source + 10'
    );
    rules.defineRule
      ('spellResistance', 'saveNotes.alienResistance', '^=', null);

    // Bloodline Abyssal
    rules.defineRule('abilityNotes.strengthOfTheAbyss',
      'bloodlineLevels.Abyssal', '=', 'source>=17 ? 6 : source>=13 ? 4 : 2'
    );
    rules.defineRule('clawsDamageLevel',
      'features.Claws', '?', null,
      'levels.Sorcerer', '=', 'source>=7 ? 2 : 1',
      'features.Small', '+', '-1',
      'features.Large', '+', '1'
    );
    rules.defineRule('combatNotes.claws',
      'clawsDamageLevel', '=', '["1d3", "1d4", "1d6", "1d8"][source]'
    );
    rules.defineRule('resistance.Acid', 'saveNotes.demonicMight', '^=', '10');
    rules.defineRule('resistance.Cold', 'saveNotes.demonicMight', '^=', '10');
    // N.B. Quilvyn.js replaces Infinity with "immune" on the character sheet
    rules.defineRule('resistance.Electricity',
      'saveNotes.demonResistances', '^=', null,
      'saveNotes.demonicMight', '=', 'Infinity'
    );
    rules.defineRule('resistance.Fire', 'saveNotes.demonicMight', '^=', '10');
    rules.defineRule('resistance.Poison',
      'saveNotes.demonicMight', '=', 'Infinity'
    );
    rules.defineRule('saveNotes.demonResistances',
      'bloodlineLevels.Abyssal', '=', 'source>=9 ? 10 : 5'
    );
    rules.defineRule('saveNotes.demonResistances-1',
      'bloodlineLevels.Abyssal', '=', 'source>=9 ? 4 : 2'
    );

    // Bloodline Arcane
    rules.defineRule
      ('familiarMasterLevel', 'familiarSorcererLevel', '^=', null);
    rules.defineRule('familiarSorcererLevel',
      'sorcererFeatures.Familiar', '?', null,
      'levels.Sorcerer', '=', null
    );
    rules.defineRule('magicNotes.newArcana',
      'bloodlineLevels.Arcane', '=', 'Math.floor((source - 5) / 4)'
    );
    rules.defineRule('selectableFeatureCount.Sorcerer (Arcane Bond)',
      'sorcererFeatures.Arcane Bond', '?', null,
      'featureNotes.arcaneBond', '=', '1'
    );
    rules.defineRule('spellsAvailable.S', 'magicNotes.newArcana', '+=', null);

    // Bloodline Celestial
    // N.B. Quilvyn.js replaces Infinity with "immune" on the character sheet
    rules.defineRule('resistance.Acid',
      'saveNotes.celestialResistances', '^=', null,
      'saveNotes.ascension', '=', 'Infinity'
    );
    rules.defineRule('resistance.Cold',
      'saveNotes.celestialResistances', '^=', null,
      'saveNotes.ascension', '=', 'Infinity'
    );
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.ascension', '^=', '10');
    rules.defineRule('resistance.Fire', 'saveNotes.ascension', '^=', '10');
    rules.defineRule
      ('resistance.Petrification', 'saveNotes.ascension', '=', 'Infinity');
    rules.defineRule('saveNotes.celestialResistances',
      'bloodlineLevels.Celestial', '=', 'source>=9 ? 10 : 5'
    );

    // Bloodline Draconic
    let colors = {
      'Black':'', 'Blue':'', 'Brass':'', 'Bronze':'', 'Copper':'', 'Gold':'',
      'Green':'', 'Red':'', 'Silver':'', 'White':''
    };
    for(let color in colors) {
      let energy = 'BlackCopperGreen'.indexOf(color) >= 0 ? 'acid' :
                   'SilverWhite'.indexOf(color) >= 0 ? 'cold' :
                   'BlueBronze'.indexOf(color) >= 0 ? 'electricity' : 'fire';
      let subFeature = 'features.Bloodline Draconic (' + color + ')';
      rules.defineRule('bloodlineEnergy', subFeature, '=', '"' + energy + '"');
      rules.defineRule('bloodlineShape',
        subFeature, '=',  '"' + (color <= 'F' ? "60' line" : "30' cone") + '"'
      );
      rules.defineRule('features.Bloodline Draconic', subFeature, '=', '1');
    }
    rules.defineRule('abilityNotes.wings',
      'bloodlineLevels.Draconic', '^=', 'source>=15 ? 60 : null'
    );
    // N.B. Other claws rules defined by Bloodline Abyssal
    rules.defineRule('clawsDamageLevel',
      'bloodlineLevels.Draconic', '=', 'source>=7 ? 2 : 1'
    );
    rules.defineRule('combatNotes.breathWeapon',
      classLevel, '+=', 'source<17 ? 1 : source<20 ? 2 : 3'
    );
    rules.defineRule('combatNotes.dragonResistances',
      'bloodlineLevels.Draconic', '+=', 'source>=15 ? 4 : source>=10 ? 2 : 1'
    );
    rules.defineRule
      ('skillNotes.blindsense', 'bloodlineLevels.Draconic', '^=', '60');
    // N.B. Quilvyn.js replaces Infinity with "immune" on the character sheet
    ['Acid', 'Cold', 'Electricity', 'Fire'].forEach(e => {
      rules.defineRule('resistance.' + e,
        'bloodlineEnergy', '+', 'null', // recomputation trigger
        'saveNotes.dragonResistances', '^=', 'dict.bloodlineEnergy=="' + e.toLowerCase() + '" ? source : null',
        'saveNotes.powerOfWyrms', '^=', 'dict.bloodlineEnergy=="' + e.toLowerCase() + '" ? Infinity : null'
      );
    });
    rules.defineRule
      ('resistance.Paralysis', 'saveNotes.powerOfWyrms', '=', 'Infinity');
    rules.defineRule
      ('resistance.Sleep', 'saveNotes.powerOfWyrms', '=', 'Infinity');
    rules.defineRule('saveNotes.dragonResistances',
      'bloodlineLevels.Draconic', '=', 'source>=9 ? 10 : 5'
    );

    // Bloodline Elemental
    ['Air', 'Earth', 'Fire', 'Water'].forEach(e => {
      let energy = e == 'Earth' ? 'acid' :
                   e == 'Water' ? 'cold' :
                   e == 'Air' ? 'electricity' : 'fire';
      let subFeature = 'features.Bloodline Elemental (' + e + ')';
      rules.defineRule('bloodlineEnergy', subFeature, '=', '"' + energy + '"');
      rules.defineRule('features.Bloodline Elemental', subFeature, '=', '1');
      rules.defineRule('features.Elemental Movement (' + e + ')',
        'features.Elemental Movement', '?', null,
        subFeature, '=', '1'
      );
    });
    // N.B. Quilvyn.js replaces Infinity with "immune" on the character sheet
    ['Acid', 'Cold', 'Electricity', 'Fire'].forEach(e => {
      rules.defineRule('resistance.' + e,
        'bloodlineEnergy', '+', 'null', // recomputation trigger
        'saveNotes.elementalResistance', '^=', 'dict.bloodlineEnergy=="' + e.toLowerCase() + '" ? source : null',
        'saveNotes.elementalBody', '^=', 'dict.bloodlineEnergy=="' + e.toLowerCase() + '" ? Infinity : null'
      );
    });
    rules.defineRule('saveNotes.elementalResistance',
      'bloodlineLevels.Elemental', '=', 'source>=9 ? 20 : 10'
    );

    // Bloodline Fey
    rules.defineRule
      ('damageReduction.Cold Iron', 'combatNotes.soulOfTheFey', '^=', '10');
    Pathfinder.featureSpells(rules,
      'Fleeting Glance', 'FleetingGlance', 'charisma',
      'bloodlineLevels.Fey', '',
      ['9:Greater Invisibility']
    );
    rules.defineRule
      ('casterLevels.FleetingGlance', 'bloodlineLevels.Fey', '=', null);
    Pathfinder.featureSpells(rules,
      'Soul Of The Fey', 'SoulOfTheFey', 'charisma', 'bloodlineLevels.Fey', '',
      ['20:Shadow Walk']
    );
    rules.defineRule
      ('casterLevels.SoulOfTheFey', 'bloodlineLevels.Fey', '=', null);

    // Bloodline Infernal
    rules.defineRule('resistance.Acid', 'saveNotes.powerOfThePit', '^=', '10');
    rules.defineRule('resistance.Cold', 'saveNotes.powerOfThePit', '^=', '10');
    // N.B. Quilvyn.js replaces Infinity with "immune" on the character sheet
    rules.defineRule('resistance.Fire',
      'saveNotes.infernalResistances', '^=', null,
      'saveNotes.powerOfThePit', '^=', 'Infinity'
    );
    rules.defineRule
      ('resistance.Poison', 'saveNotes.powerOfThePit', '^=', 'Infinity');
    rules.defineRule('saveNotes.infernalResistances',
      'bloodlineLevels.Infernal', '=', 'source>=9 ? 10 : 5'
    );

    // Bloodline Undead
    rules.defineRule('damageReduction.-', 'combatNotes.oneOfUs', '^=', '5');
    ['Cold', 'Nonlethal', 'Paralysis', 'Sleep'].forEach(c => {
      rules.defineRule
       ('resistance.' + c, 'saveNotes.oneOfUs', '^=', 'Infinity');
    });
    rules.defineRule("saveNotes.death'sGift",
      'bloodlineLevels.Undead', '=', 'source>=9 ? 10 : 5'
    );

  } else if(name == 'Wizard') {

    rules.defineRule('familiarMasterLevel', 'familiarWizardLevel', '^=', null);
    rules.defineRule('familiarWizardLevel',
      'wizardFeatures.Familiar', '?', null,
      classLevel, '+=', null
    );
    rules.defineRule('featCount.Wizard',
      'featureNotes.bonusFeats(Wizard)', '+=', null
    );
    rules.defineRule('featureNotes.bonusFeats(Wizard)',
      classLevel, '=', 'Math.floor(source / 5)'
    );
    rules.defineRule('selectableFeatureCount.Wizard (Arcane Bond)',
      'wizardFeatures.Arcane Bond', '?', null,
      'featureNotes.arcaneBond', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Wizard (Specialization)',
      classLevel, '=', '1'
    );

    let schools = rules.getChoices('schools');
    for(let school in schools) {
      rules.defineRule('selectableFeatureCount.Wizard (Opposition)',
        'wizardFeatures.School Specialization (' + school + ')', '=', '2'
      );
      for(let i = 1; i <= 9; i++) {
        rules.defineRule('spellSlots.W' + i,
          'magicNotes.schoolSpecialization(' + school + ')', '+', '1'
        );
      }
    }

  } else if(name == 'Adept') {

    rules.defineRule
      ('familiarMasterLevel', 'familiarAdeptLevel', '^=', null);
    rules.defineRule('familiarAdeptLevel',
      'adeptFeatures.Summon Familiar', '?', null,
      classLevel, '=', null
    );

  } else if(name == 'Arcane Archer') {

    rules.defineRule('combatNotes.enhanceArrows(Elemental)',
      classLevel, '=',
      'source<7 ? "<i>flaming</i>, <i>frost</i>, or <i>shock</i>, inflicting +1d6 HP," : "<i>flaming burst</i>, <i>icy burst</i>, or <i>shocking burst</i>, inflicting +1d6 HP and +1d10 HP on a critical hit,"'
    );
    rules.defineRule('magicNotes.arcaneCasterLevelBonus',
      classLevel, '+=', 'source - Math.floor((source + 3) / 4)'
    );

  } else if(name == 'Arcane Trickster') {

    rules.defineRule('combatNotes.sneakAttack', 'sneakAttack', '=', null);
    rules.defineRule
      ('magicNotes.arcaneCasterLevelBonus', classLevel, '+=', null);
    rules.defineRule('sneakAttack', classLevel, '+=', 'Math.floor(source / 2)');

  } else if(name == 'Assassin') {

    rules.defineRule('combatNotes.sneakAttack', 'sneakAttack', '=', null);
    rules.defineRule('assassinFeatures.Improved Uncanny Dodge',
      'assassinFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      classLevel, '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('skillNotes.hideInPlainSight',
      'assassinFeatures.Hide In Plain Sight', '=', '"within 10\' of shadows"'
    );
    rules.defineRule
      ('uncannyDodgeSources', classLevel, '+=', 'source >= 2 ? 1 : null');
    rules.defineRule
      ('sneakAttack', classLevel, '+=', 'Math.floor((source + 1) / 2)');

  } else if(name == 'Dragon Disciple') {

    rules.defineRule('abilityNotes.wings',
      classLevel, '^=', 'source>=9 ? 60 : null',
      'abilityNotes.wings.1', '+', null
    );
    rules.defineRule('abilityNotes.wings.1',
      classLevel, '?', 'source>=9',
      'bloodlineLevels.Draconic', '=', 'source>=15 ? 30 : null'
    );
    // Natural armor bonuses don't normally stack. However, the text for the
    // Natural Armor Increase feature states that it gives "an increase to the
    // character’s existing natural armor"--a rephrase of "it stacks"--so
    // override the ^= rule generated by featureRules.
    rules.defineRule('armorClassNaturalArmorModifier',
      'combatNotes.naturalArmorIncrease', '+=', null
    );
    rules.defineRule('combatNotes.breathWeapon',
      classLevel, '+=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule('combatNotes.naturalArmorIncrease',
      classLevel, '+=', 'source<4 ? 1 : source<7 ? 2 : 3'
    );
    rules.defineRule
      ('constitution', 'levels.Dragon Disciple', '+', 'source>=6 ? 2 : null');
    rules.defineRule('featCount.Bloodline Draconic',
      'featureNotes.bloodlineFeat', '+=', null
    );
    rules.defineRule('featureNotes.bloodlineFeat',
      classLevel, '+=', 'source>=2 ? Math.floor((source + 1) / 3) : null'
    );
    rules.defineRule
      ('intelligence', 'levels.Dragon Disciple', '+', 'source>=8 ? 2 : null');
    rules.defineRule('magicNotes.arcaneCasterLevelBonus',
      classLevel, '+=', 'source - Math.floor((source + 3) / 4)'
    );
    rules.defineRule('skillNotes.blindsense',
      classLevel, '^=', 'source<5? null : source<10 ? 30 : 60'
    );
    rules.defineRule('sorcererFeatures.Breath Weapon',
      classLevel, '=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule
      ('sorcererFeatures.Wings', classLevel, '=', 'source >= 9 ? 1 : null');
    // Choice of Draconic Bloodline if not Sorcerer
    rules.defineRule('dragonDiscipleIsNotSorcerer',
      classLevel, '=', '1',
      'levels.Sorcerer', 'v', '0'
    );
    rules.defineRule('selectableFeatureCount.Dragon Disciple (Bloodline)',
      'dragonDiscipleIsNotSorcerer', '?', null,
      classLevel, '=', '1'
    );
    rules.defineRule('bloodlineLevels.Draconic',
      'selectableFeatureCount.Dragon Disciple (Bloodline)', '+=', 'source == 1 ? 0 : null',
      classLevel, '+', null
    );
    rules.defineRule('strength',
      'abilityNotes.abilityBoost', '+', 'null', // italics
      'levels.Dragon Disciple', '+', 'source>=4 ? 4 : source>=2 ? 2 : null'
    );
    rules.defineRule('casterLevels.Bloodline', classLevel, '+=', null);
    rules.defineRule('spells.Form Of The Dragon I(DragonForm6 Tran)',
      classLevel, '?', 'source < 10'
    );

  } else if(name == 'Duelist') {

    rules.defineRule('combatNotes.elaborateDefense',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.improvedReaction',
      classLevel, '+=', 'source < 2 ? null : source < 8 ? 2 : 4'
    );
    rules.defineRule('saveNotes.grace.1',
      'armorWeight', '?', '"NoneLight".includes(source)',
      'shield', '?', 'source == "None"',
      'saveNotes.grace', '=', '2'
    );
    rules.defineRule('save.Reflex', 'saveNotes.grace.1', '+', null);

  } else if(name == 'Eldritch Knight') {

    rules.defineRule('casterLevelArcane', classLevel, '+=', null);
    rules.defineRule('featureNotes.bonusFeat(EldritchKnight)',
      classLevel, '+=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('featCount.Fighter',
      'featureNotes.bonusFeat(EldritchKnight)', '+=', null
    );
    rules.defineRule('fighterFeatLevel', classLevel, '+=', null);
    rules.defineRule('magicNotes.arcaneCasterLevelBonus',
      classLevel, '+=', 'source > 1 ? source - 1 : null'
    );

  } else if(name == 'Loremaster') {

    rules.defineRule('casterLevelArcane', classLevel, '+=', null);
    rules.defineRule('featureNotes.secret',
      classLevel, '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule('selectableFeatureCount.Loremaster (Secret)',
      'featureNotes.secret', '+=', null
    );
    rules.defineRule('skillNotes.bonusLanguages',
      classLevel, '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule
      ('skillNotes.lore', classLevel, '+=', 'Math.floor(source / 2)');

  } else if(name == 'Mystic Theurge') {

    rules.defineRule
      ('magicNotes.arcaneCasterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.divineCasterLevelBonus', classLevel, '+=', null);

  } else if(name == 'Pathfinder Chronicler') {

    rules.defineRule('bardicPerformanceLevel',
      classLevel, '+=', 'source>=3 ? source - 2 : null'
    );
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calculated even for non-Wizard Pathfinder Chroniclers.
    rules.defineRule('casterLevels.W', classLevel, '=', 'source<3 ? null : 1');
    rules.defineRule('loadLight',
      'abilityNotes.deepPockets', '^', 'Math.floor(SRD35.STRENGTH_MAX_LOADS[dict.strength + 4] / 3)'
    );
    rules.defineRule('skillNotes.bardicKnowledge',
      classLevel, '+=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.masterScribe', classLevel, '=', null);

  } else if(name == 'Shadowdancer') {

    rules.defineRule('featureNotes.darkvision',
      'shadowdancerFeatures.Darkvision', '+=', '60'
    );
    rules.defineRule('featureNotes.rogueTalents(Shadowdancer)',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.shadowJump',
      classLevel, '=', '40 * Math.pow(2, Math.floor(source/2)-2)'
    );
    rules.defineRule('selectableFeatureCount.Shadowdancer (Talent)',
      'featureNotes.rogueTalents(Shadowdancer)', '+=', null
    );
    rules.defineRule('shadowdancerFeatures.Improved Uncanny Dodge',
      'shadowdancerFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('spells.Shadow Conjuration(ShadowCall4 Illu)',
      classLevel, '?', 'source < 10'
    );
    rules.defineRule('skillNotes.hideInPlainSight',
      'shadowdancerFeatures.Hide In Plain Sight', '=', '"within 10\' of dim light"'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      classLevel, '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule
      ('uncannyDodgeSources', classLevel, '+=', 'source >= 2 ? 1 : null');

  }

};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack#, does
 * #damage# damage, moves at #speed# (which may be fly or swim speed for
 * creatures who normally use that form of movement) and is size #size#. If
 * specified, #level# indicates the minimum master level the character needs to
 * have this animal as a companion.
 */
Pathfinder.companionRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  speed, level
) {
  // NOTE The PRD calculates HD from master level, in contrast to the SRD's
  // addition to a starting value
  SRD35.companionRules(
    rules, name, str, dex, con, intel, wis, cha, 1, ac, attack, damage, size,
    speed, level
  );
  if(name.startsWith('Advanced ') && level) {
    name = name.replace('Advanced ', '');
    rules.defineRule('animalCompanionStats.Advance Level',
      'animalCompanion.' + name, '=', level
    );
  }
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, and #domains# and #weapons# list the associated
 * domains and favored weapons.
 */
Pathfinder.deityRules = function(rules, name, alignment, domains, weapons) {
  SRD35.deityRules(rules, name, alignment, domains, weapons);
  // Pathfinder clerics get proficiency in the deity's favored weapon without
  // taking the War domain, and the War domain does not grant Weapon Focus.
  for(let i = 0; i < weapons.length; i++) {
    let weapon = weapons[i];
    let focusFeature = 'Weapon Focus (' + weapon + ')';
    let proficiencyFeature = 'Weapon Proficiency (' + weapon + ')';
    rules.defineRule
      ('clericFeatures.' + focusFeature, 'levels.Cleric', '?', 'source == 0');
    rules.defineRule('clericFeatures.' + proficiencyFeature,
      'levels.Cleric', '?', null,
      'deityFavoredWeapon', '=', 'source.indexOf("'+weapon+'")>=0 ? 1 : null',
      'combatNotes.weaponOfWar', '=', 'null'
    );
  }
};

/*
 * Defines in #rules the rules associated with faction #name#, which was in
 * play during the list of seasons #seasons# and was replaced by faction
 * #successor#.
 */
Pathfinder.factionRules = function(rules, name, seasons, successor) {
  if(!name) {
    console.log('Empty faction name');
    return;
  }
  // No rules pertain to faction
};

/*
 * Defines in #rules# the rules associated with familiar #name#, which has
 * abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The familiar has attack bonus #attack#, does
 * #damage# damage, moves at #speed# (which may be fly or swim speed for
 * creatures who normally use that form of movement) and is size #size#. If
 * specified, #level# indicates the minimum master level the character needs to
 * have this animal as a familiar.
 */
Pathfinder.familiarRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  speed, level
) {
  SRD35.familiarRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    speed, level
  );
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
Pathfinder.featRules = function(rules, name, requires, implies, types) {
  SRD35.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
Pathfinder.featRulesExtra = function(rules, name) {

  let matchInfo;

  if(name == 'Acrobatic') {
    rules.defineRule('skillNotes.acrobatic',
      '', '=', '2',
      'skills.Acrobatics', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.acrobatic.1',
      'features.Acrobatic', '?', null,
      '', '=', '2',
      'skills.Fly', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Agile Maneuvers') {
    rules.defineRule('combatNotes.agileManeuvers',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  } else if(name == 'Alertness') {
    rules.defineRule('skillNotes.alertness',
      '', '=', '2',
      'skills.Perception', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.alertness.1',
      'features.Alertness', '?', null,
      '', '=', '2',
      'skills.Sense Motive', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Animal Affinity') {
    rules.defineRule('skillNotes.animalAffinity',
      '', '=', '2',
      'skills.Handle Animal', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.animalAffinity.1',
      'features.Animal Affinity', '?', null,
      '', '=', '2',
      'skills.Ride', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Arcane Strike') {
    rules.defineRule('combatNotes.arcaneStrike',
      'casterLevelArcane', '=', '1 + Math.floor(source / 5)'
    );
  } else if(name == 'Athletic') {
    rules.defineRule('skillNotes.athletic',
      '', '=', '2',
      'skills.Climb', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.athletic.1',
      'features.Athletic', '?', null,
      '', '=', '2',
      'skills.Swim', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Deceitful') {
    rules.defineRule('skillNotes.deceitful',
      '', '=', '2',
      'skills.Bluff', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.deceitful.1',
      'features.Deceitful', '?', null,
      '', '=', '2',
      'skills.Disguise', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Defensive Combat Training') {
    rules.defineRule('combatNotes.defensiveCombatTraining',
      'level', '=', null,
      'baseAttack', '+', '-source'
    );
  } else if(name == 'Deft Hands') {
    rules.defineRule('skillNotes.deftHands',
      '', '=', '2',
      'skills.Disable Device', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.deftHands.1',
      'features.Deft Hands', '?', null,
      '', '=', '2',
      'skills.Sleight Of Hands', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Extra Channel') {
    rules.defineRule
      ('magicNotes.channelEnergy', 'magicNotes.extraChannel', '+', '2');
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.extraChannel', '+', '4');
  } else if(name == 'Extra Ki') {
    rules.defineRule
      ('featureNotes.extraKi', 'feats.Extra Ki', '=', 'source * 2');
    rules.defineRule('combatNotes.kiPool', 'featureNotes.extraKi', '+', null);
  } else if(name == 'Extra Lay On Hands') {
    rules.defineRule('magicNotes.extraLayOnHands',
      'feats.Extra Lay On Hands', '=', 'source * 2'
    );
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.extraLayOnHands', '+', null);
  } else if(name == 'Extra Mercy') {
    rules.defineRule('magicNotes.extraMercy', 'feats.Extra Mercy', '=', null);
    rules.defineRule('selectableFeatureCount.Paladin (Mercy)',
      'magicNotes.extraMercy', '+', null
    );
  } else if(name == 'Extra Performance') {
    rules.defineRule('skillNotes.extraPerformance',
      'feats.Extra Performance', '=', 'source * 6'
    );
  } else if(name == 'Extra Rage') {
    rules.defineRule
      ('combatNotes.extraRage', 'feats.Extra Rage', '=', 'source * 6');
    rules.defineRule('combatNotes.rage', 'combatNotes.extraRage', '+', null);
  } else if(name == 'Fleet') {
    rules.defineRule('abilityNotes.fleet',
      'armorWeight', '?', '"NoneLight".includes(source)',
      'feats.Fleet', '=', 'source * 5'
    );
    rules.defineRule('speed', 'abilityNotes.fleet', '+', null);
  } else if(name == "Gorgon's Fist") {
    rules.defineRule("combatNotes.gorgon'sFist",
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
  } else if((matchInfo = name.match(/^Improved\sCritical\s\((.*)\)$/)) != null){
    Pathfinder.featureRules
      (rules, name, ['combat'], ['x2 ' + matchInfo[1] + ' Threat Range']);
  } else if(name == 'Intimidating Prowess') {
    rules.defineRule
      ('skillModifier.Intimidate', 'skillNotes.intimidatingProwess', '+', null);
    rules.defineRule
      ('skillNotes.intimidatingProwess', 'strengthModifier', '=', null);
  } else if(name == 'Magical Aptitude') {
    rules.defineRule('skillNotes.magicalAptitude',
      '', '=', '2',
      'skills.Spellcraft', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.magicalAptitude.1',
      'features.Magical Aptitude', '?', null,
      '', '=', '2',
      'skills.Use Magic Device', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Persuasive') {
    rules.defineRule('skillNotes.persuasive',
      '', '=', '2',
      'skills.Diplomacy', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.persuasive.1',
      'features.Persuasive', '?', null,
      '', '=', '2',
      'skills.Intimidate', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Power Attack') {
    rules.defineRule('combatNotes.powerAttack',
      'baseAttack', '=', 'Math.floor((source + 4) / 4)'
    );
    rules.defineRule('combatNotes.powerAttack.1',
      'features.Power Attack', '?', null,
      'baseAttack', '=', 'Math.floor((source + 4) / 4) * 2'
    );
    rules.defineRule('combatNotes.powerAttack.2',
      'combatNotes.powerAttack.1', '=', 'Math.floor(source * 1.5)'
    );
  } else if(name == 'Scorpion Style') {
    rules.defineRule('combatNotes.scorpionStyle', 'wisdomModifier', '=', null);
    rules.defineRule('combatNotes.scorpionStyle.1',
      'features.Scorpion Style', '?', null,
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
  } else if(name == 'Selective Channeling') {
    rules.defineRule
      ('magicNotes.selectiveChanneling', 'charismaModifier', '=', null);
  } else if(name == 'Self-Sufficient') {
    rules.defineRule('skillNotes.self-Sufficient',
      '', '=', '2',
      'skills.Heal', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.self-Sufficient.1',
      'features.Self-Sufficient', '?', null,
      '', '=', '2',
      'skills.Survival', '+', 'source >= 10 ? 2 : null'
    );
  } else if((matchInfo = name.match(/^Skill\sFocus\s\((.*)\)$/)) != null) {
    let skill = matchInfo[1];
    rules.defineRule('skillNotes.skillFocus(' + skill.replaceAll(' ', '') + ')',
      'skills.' + skill, '=', 'source >= 10 ? 6 : 3'
    );
  } else if(name == 'Spell Mastery') {
    rules.defineRule
      ('magicNotes.spellMastery', 'intelligenceModifier', '=', null);
  } else if(name == 'Staggering Critical') {
    rules.defineRule
      ('combatNotes.staggeringCritical', 'baseAttack', '=', '10 + source');
  } else if(name == 'Stealthy') {
    rules.defineRule('skillNotes.stealthy',
      '', '=', '2',
      'skills.Escape Artist', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.stealthy.1',
      'features.Stealthy', '?', null,
      '', '=', '2',
      'skills.Stealth', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Stunning Critical') {
    rules.defineRule
      ('combatNotes.stunningCritical', 'baseAttack', '=', '10 + source');
  } else if(name == 'Toughness') {
    rules.defineRule
      ('combatNotes.toughness', 'level', '=', 'Math.max(source, 3)');
  } else if(name.match(/^(Tower )?Shield Proficiency/)) {
    rules.defineRule('armorProficiency.' + name.replace(' Proficiency', ''),
      'features.' + name, '=', '1'
    );
  } else if(name == 'Turn Undead') {
    rules.defineRule('combatNotes.turnUndead',
      'channelLevel', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Two-Weapon Rend') {
    rules.defineRule('combatNotes.two-WeaponRend.1',
      'features.Two-Weapon Rend', '?', null,
      'strengthModifier', '=', 'source>0 ? "+" + Math.floor(source * 1.5) : source<0 ? source : ""'
    );
  } else if(name == 'Weapon Finesse') {
    rules.defineRule('combatNotes.weaponFinesse',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  } else if(name == 'Simple Weapon Proficiency') {
    rules.defineRule('weaponProficiency.Simple Weapons',
      'features.' + name, '=', '1'
    );
  } else if((matchInfo = name.match(/^(Exotic|Martial)\sWeapon\sProficiency.\((.*)\)$/)) != null) {
    rules.defineRule('weaponProficiency.' + matchInfo[2],
      'features.' + name, '=', '1'
    );
  } else if((matchInfo = name.match(/^(Heavy|Medium|Light)\sArmor\sProficiency$/)) != null) {
    rules.defineRule('armorProficiency.' + matchInfo[1],
      'features.' + name, '=', '1'
    );
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements. #spells# lists any spells
 * acquired as part of the feature, and #spellAbility# is the ability used to
 * calculate attack and difficulty class for these spells.
 */
Pathfinder.featureRules = function(
  rules, name, sections, notes, spells, spellAbility
) {
  SRD35.featureRules(rules, name, sections, notes, spells, spellAbility);
  if(name.match(/^(Greater )?Shield Focus$/))
    // Override ^= from SRD35.featureRules with +
    rules.defineRule('armorClassShieldModifier',
      'combatNotes.' + name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', ''), '+', '1'
    );
};

/*
 * Defines in #rules# the rules to grant the spells listed in #spellList# when
 * feature #feature# is acquired. #spellType# contains the spell group,
 * #spellAbility# the associated ability, and #levelAttr# the related
 * character level. If non-null, #spellDC# specifies the expression for
 * computing the DC for the spell; an empty string indicates that standard
 * DC computation (10 + ability modifier + spell level). Each element of
 * #spellList# has the format "[min level:]spell name[,spell name...]". If min
 * level is provided, the spells listed in that element are not acquired until
 * the character's value of #levelAttr# reaches that level.
 */
Pathfinder.featureSpells = function(
  rules, feature, spellType, spellAbility, levelAttr, spellDC, spellList
) {
  return SRD35.featureSpells(
    rules, feature, spellType, spellAbility, levelAttr, spellDC, spellList
  );
};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
Pathfinder.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  SRD35.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines in #rules# the rules associated with language #name#. */
Pathfinder.languageRules = function(rules, name) {
  SRD35.languageRules(rules, name);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features listed in #features#. If the path
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted. #feats# lists feats that may be selected by characters
 * following the path, and #skills# lists skills that become class skills.
 */
Pathfinder.pathRules = function(
  rules, name, group, levelAttr, features, selectables, feats, skills,
  spellAbility, spellSlots
) {
  SRD35.pathRules(
    rules, name, group, levelAttr, features, selectables, spellAbility,
    spellSlots
  );
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. #size# and
 * #speed# give the race's size (one of Small, Medium, or Large) and speed.
 */
Pathfinder.raceRules = function(
  rules, name, requires, features, selectables, languages, size, speed
) {
  SRD35.raceRules
    (rules, name, requires, features, selectables, languages, size, speed);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Pathfinder.raceRulesExtra = function(rules, name) {
  if(name.match(/Elf|Gnome|Halfling/)) {
    rules.defineRule('skillNotes.keenSenses', '', '=', '2');
  }
  if(name.match(/Dwarf/)) {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
    rules.defineRule('saveNotes.hardy', '', '=', '2');
    rules.defineRule('saveNotes.hardy.1',
      'features.Hardy', '?', null,
      '', '=', '2'
    );
    rules.defineRule('skillNotes.stonecunning', '', '=', '2');
  } else if(name.match(/Gnome/)) {
    rules.defineRule('magicNotes.gnomeMagic-1', 'charisma', '?', 'source>10');
    rules.defineRule
      ('spellDCSchoolBonus.Illusion', 'magicNotes.gnomeMagic', '+=', '1');
    rules.defineRule('spells.Dancing Lights(GnomeMagic0 Evoc)',
      'charisma', '?', 'source>10'
    );
    rules.defineRule('spells.Ghost Sound(GnomeMagic0 Illu)',
      'charisma', '?', 'source>10'
    );
    rules.defineRule('spells.Prestidigitation(GnomeMagic0 Univ)',
      'charisma', '?', 'source>10'
    );
    rules.defineRule('spells.Speak With Animals(GnomeMagic1 Divi)',
      'charisma', '?', 'source>10'
    );
    rules.defineRule
      ('casterLevels.GnomeMagic', 'charisma', '?', 'source >= 11');
  } else if(name == 'Half-Elf') {
    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'adaptability', 'features.Adaptability',
      'Sum \'features.Skill Focus\' >= 1'
    );
  } else if(name.match(/Human/)) {
    rules.defineRule('skillNotes.skilled', 'level', '=', null);
    rules.defineRule('skillPoints', 'skillNotes.skilled', '+', null);
  }
};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
Pathfinder.schoolRules = function(rules, name, features) {
  SRD35.schoolRules(rules, name, features);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with school #name# that cannot be
 * derived directly from the parameters passed to schoolRules.
 */
Pathfinder.schoolRulesExtra = function(rules, name) {

  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ','');
  let schoolLevel = prefix + 'Level';

  if(name == 'Divination') {
    rules.defineRule('combatNotes.forewarned',
      schoolLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Enchantment') {
    rules.defineRule
      ('saveNotes.enchantingSmile', schoolLevel, '?', 'source==20');
    rules.defineRule('skillNotes.enchantingSmile',
      schoolLevel, '=', '2 + Math.floor(source / 5)'
    );
  } else if(name == 'Illusion') {
    rules.defineRule
      ('magicNotes.invisibilityField', schoolLevel, '=', null);
  } else if(name == 'Necromancy') {
    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'powerOverUndead', 'features.Power Over Undead',
      'features.Command Undead || features.Turn Undead'
    );
    rules.defineRule('channelLevel', schoolLevel, '+=', null);
    rules.defineRule('validationNotes.commandUndeadFeat',
      'featureNotes.powerOverUndead', '^', '0'
    );
    rules.defineRule('validationNotes.turnUndeadFeat',
      'featureNotes.powerOverUndead', '^', '0'
    );
  } else if(name == 'Transmutation') {
    rules.defineRule('spells.Beast Shape II(ChangeShape4 Tran)',
      'levels.Wizard', '?', 'source < 12'
    );
    rules.defineRule('spells.Elemental Body I(ChangeShape4 Tran)',
      'levels.Wizard', '?', 'source < 12'
    );
    rules.defineRule('magicNotes.changeShape', schoolLevel, '=', null);
    rules.defineRule('magicNotes.changeShape.1',
      'features.Change Shape', '?', null,
      schoolLevel, '=', 'source >= 12 ? "III" : "II"'
    );
    rules.defineRule('magicNotes.changeShape.2',
      'features.Change Shape', '?', null,
      schoolLevel, '=', 'source >= 12 ? "II" : "I"'
    );
  }

};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, imposes
 * #skillFail# on specific skills and yields a #spellFail# percent chance of
 * arcane spell failure.
 */
Pathfinder.shieldRules = function(
  rules, name, ac, weight, maxDex, skillFail, spellFail
) {
  SRD35.shieldRules(rules, name, ac, weight, maxDex, skillFail, spellFail);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * basic ability #ability#. #untrained#, if specified, is a boolean indicating
 * whether or not the skill can be used untrained; the default is true.
 * #classes# lists the classes for which this is a class skill; a value of
 * "all" indicates that this is a class skill for all classes. #synergies#
 * lists any synergies with other skills and abilities granted by high ranks in
 * this skill.
 */
Pathfinder.skillRules = function(
  rules, name, ability, untrained, classes, synergies
) {
  // NOTE: SRD v3.5 uses the term "Skill Point" to designate assignable points
  // acquired via class advance and "Skill Rank" to designate skill abilities
  // purchased using skill points. Pathfinder eliminates skill points, using
  // "Skill Rank" for both concepts. Although this module consistently displays
  // "Skill Rank" in the UI, the term "Skill Point" remains within the code to
  // enable reuse of portions of the SRD35 module.
  SRD35.skillRules(rules, name, ability, untrained, classes, synergies);
  // Override effects of class skills and armor skill check penalty
  rules.defineRule('classSkillBump.' + name,
    'skills.' + name, '?', 'source > 0',
    'classSkills.' + name, '=', '3'
  );
  rules.defineRule('skillModifier.' + name,
    'skills.' + name, '=', null,
    'classSkillBump.' + name, '+', null,
    'classSkills.' + name, '+', '0'
  );
  if(ability.match(/^(strength|dexterity)$/i)) {
    rules.defineRule('skillModifier.' + name,
      'skillNotes.armorSkillCheckPenalty', '+', null
    );
  }
  if(name.startsWith('Craft'))
    rules.addChoice('craftSkills', name, '');
  else if(name.startsWith('Knowledge')) {
    // For Loremaster
    rules.defineRule
      ('countKnowledgeGe7', 'skills.' + name, '+=', 'source>=7 ? 1 : null');
    rules.defineRule('skillModifier.' + name,
      'skillNotes.bardicKnowledge', '+', null,
      'skillNotes.lore', '+', null
    );
  } else if(name.startsWith('Profession'))
    rules.addChoice('professionSkills', name, '');
  rules.defineRule
    ('classSkills.' + name, 'skillNotes.jack-Of-All-Trades-1', '=', '1');
};

/*
 * Defines in #rules# the rules associated with skill #name# that cannot be
 * derived directly from the attributes passed to skillRules.
 */
Pathfinder.skillRulesExtra = function(rules, name) {
  if(name == 'Linguistics') {
    rules.defineRule('languageCount', 'skills.Linguistics', '+', null);
  }
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a concise
 * description of the spell's effects. #liquids# lists any liquid forms via
 * which the spell can be applied.
 */
Pathfinder.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell, liquids
) {
  SRD35.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell,
     liquids);
  // SRD35 uses wisdomModifier when calculating the save DC for Paladin
  // spells; in Pathfinder we override to use charismaModifier.
  if(casterGroup == 'P') {
    let matchInfo;
    let note = rules.getChoices('notes')[name];
    if(note != null && (matchInfo = note.match(/\(DC\s%(\d+)/)) != null)
      rules.defineRule(note + '.' + matchInfo[1],
        'charismaModifier', '=', '10 + source + ' + level
      );
  }
  // SRD35 specifies the caster level of Paladins and Rangers to be half their
  // class level; Pathfinder specifies class level - 3. This difference doesn't
  // affect the spell itself, since casterLevel.{Paladin,Ranger} is calculated
  // differently in the two plugins, but we have to adjust the notes for
  // potions and scrolls that calculate the minimum caster level required to
  // cast the corresponding spell.
  if(casterGroup == 'P' || casterGroup == 'R') {
    let notes = rules.getChoices('notes');
    let note;
    liquids.forEach(liquid => {
      if(liquid != 'None') {
        let liquidName = 'potions.' + name.replace('(', ' ' + liquid + ' (');
        note = notes[liquidName];
        if(note) {
          // casterLevels.[PR] may be resolved to a value, so handle both
          note = note.replaceAll(/(casterLevels.[PR]|\d+)\s*\/\/\s*2/g, '$1-3');
          notes[liquidName] = note;
        }
      }
    });
    let scrollName = 'scrolls.' + name;
    note = notes[scrollName];
    if(note) {
      // casterLevels.[PR] may be resolved to a value, so handle both
      note = note.replaceAll(/(casterLevels.[PR]|\d+)\s*\/\/\s*2/g, '$1-3');
      notes[scrollName] = note;
    }
  }
};

/*
 * Defines in #rules# the rules associated with experience track #name#, which
 * has the level progression listed by #progression#.
 */
Pathfinder.trackRules = function(rules, name, progression) {
  let trackLevel = name + 'Level';
  let trackNeeded = name + 'Needed';
  rules.defineRule('experienceNeeded', trackNeeded, '=', null);
  rules.defineRule('level', trackLevel, '=', null);
  rules.defineRule(trackLevel,
    'experienceTrack', '?', 'source == "' + name + '"',
    'experience', '=', 'source >= ' + (progression[progression.length - 1] * 1000) + ' ? ' + progression.length + ' : [' + progression + '].findIndex(item => item * 1000 > source)'
  );
  rules.defineRule(trackNeeded,
    'experienceTrack', '?', 'source == "' + name + '"',
    trackLevel, '=', 'source < ' + progression.length + ' ? [' + progression + '][source] * 1000 : ' + (progression[progression.length - 1] * 1000 + 1)
  );
};

/*
 * Defines in #rules# the rules associated with trait #name#, which is of type
 * #type# and subtype #subtype#.
 */
Pathfinder.traitRules = function(rules, name, type, subtype) {
  rules.defineRule('features.' + name, 'traits.' + name, '=', null);
};

/*
 * Defines in #rules# the rules associated with trait #name# that are not
 * directly derived from the parameters passed to traitRules.
 */
Pathfinder.traitRulesExtra = function(rules, name) {
  if(name == 'Armor Expert') {
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.armorExpert', '+', '1'
    );
  } else if(name == 'Magical Talent (Trait)') {
    rules.defineRule
      ('spellSlots.Talent0', 'features.Magical Talent (Trait)', '=', '1');
    rules.defineRule('casterLevels.Talent',
      'spellSlots.Talent0', '?', null,
      'level', '=', null
    );
    rules.defineRule('spellDifficultyClass.Talent',
      'casterLevels.Talent', '?', null,
      'charismaModifier', '=', '10 + source'
    );
  } else if(name == 'River Rat') {
    rules.defineRule('daggerDamageModifier', 'combatNotes.riverRat', '+', '1');
    rules.defineRule
      ('punchingDaggerDamageModifier', 'combatNotes.riverRat', '+', '1');
  }
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #profLevel# proficiency level to use effectively and belongs to weapon
 * category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their spelled-out
 * equivalents). The weapon does #damage# HP on a successful attack and
 * threatens x#critMultiplier# (default 2) damage on a roll of #threat# (default
 * 20). If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet. #properties# lists any additional properties of
 * the weapon, such as "Thrown" or "Reach".
 */
Pathfinder.weaponRules = function(
  rules, name, profLevel, category, damage, threat, critMultiplier, range,
  properties
) {
  SRD35.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range,
    properties
  );
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Returns the dictionary of attribute formats associated with character sheet
 * format #viewer# in #rules#.
 */
Pathfinder.getFormats = function(rules, viewer) {
  let result = SRD35.getFormats(rules, viewer);
  for(let a in result)
    result[a] = result[a].replaceAll('Skill Point', 'Skill Rank');
  return result;
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Pathfinder.createViewers = function(rules, viewers) {
  SRD35.createViewers(rules, viewers);
  if(viewers.includes('Stat Block')) {
    // Minor differences from SRD35 version
    let viewer = new ObjectViewer();
    viewer.addElements(
      {name: '_top', separator: '\n', columns: '1L'},
        {name: 'Name', within: '_top', format: '<div style="font-size:2em"><b>%V</b></div>'},
        {name: 'GenderRaceAndLevels', within: '_top', separator: ' '},
          {name: 'Gender', within: 'GenderRaceAndLevels', format: '%V'},
          {name: 'Race', within: 'GenderRaceAndLevels', format: '%V'},
          {name: 'Levels', within: 'GenderRaceAndLevels', format: '%V', separator: '/'},
        {name: 'AlignAndSize', within: '_top', separator: ' '},
          {name: 'Alignment Abbr', within: 'AlignAndSize', format: '%V'},
          {name: 'Size', within: 'AlignAndSize', format: '%V humanoid'},
        {name: 'InitAndSenses', within: '_top', separator: ''},
          {name: 'Initiative', within: 'InitAndSenses', format: '<b>Init</b> %V; <b>Senses</b> '},
          {name: 'Sense Features', within: 'InitAndSenses', format: '%V; '},
          {name: 'Perception', within: 'InitAndSenses', format: 'Perception %V'},
        {name: 'Sep1', within: '_top', format: '<hr/>'},
        {name: 'ACs', within: '_top', separator: ''},
          {name: 'Armor Class', within: 'ACs', format: '<b>AC</b> %V'},
          {name: 'Armor Class Touch', within: 'ACs', format: ', touch %V'},
          {name: 'Armor Class Flatfooted', within: 'ACs', format: ', flat-footed %V'},
          {name: 'Dodge Features', within: 'ACs', format: '; %V'},
        {name: 'HPandHD', within: '_top', separator: ' '},
          {name: 'Hit Points', within: 'HPandHD', format: '<b>hp</b> %V'},
          {name: 'Level', within: 'HPandHD', format: '(%V HD)'},
        {name: 'Saves', within: '_top', separator: ''},
          {name: 'Save', within: 'Saves', format: '<b>%N</b> %V',
           separator: ', '},
          {name: 'Evasion', within: 'Saves', format: '; %V'},
        {name: 'Sep2', within: '_top', format: '<hr/>'},
        {name: 'Speed', within: '_top', format: '<b>%N</b> %V ft.'},
        {name: 'Weapons', within: '_top', separator: ', ', format: '<b>%N</b> %V'},
        {name: 'Spells', within: '_top', separator: ', ', format: '<b>%N</b> %V'},
        {name: 'Sep3', within: '_top', format: '<hr/>'},
        {name: 'Abilities', within: '_top', separator: ', ', format: '<b>%N</b> %V'},
          {name: 'Strength', within: 'Abilities', format: 'Str %V'},
          {name: 'Dexterity', within: 'Abilities', format: 'Dex %V'},
          {name: 'Constitution', within: 'Abilities', format: 'Con %V'},
          {name: 'Intelligence', within: 'Abilities', format: 'Int %V'},
          {name: 'Wisdom', within: 'Abilities', format: 'Wis %V'},
          {name: 'Charisma', within: 'Abilities', format: 'Cha %V'},
        {name: 'Attack', within: '_top', separator: '; '},
          {name: 'Base Attack', within: 'Attack', format: '<b>Base Atk</b> %V'},
          {name: 'Cmb', within: 'Attack', format: '<b>CMB</b> %V'},
          {name: 'Cmd', within: 'Attack', format: '<b>CMD</b> %V'},
        {name: 'Feats', within: '_top', separator: ', ', format: '<b>%N</b> %V'},
        {name: 'Skill Modifier', within: '_top', separator: ', ', format: '<b>Skills</b> %V'},
        {name: 'Languages', within: '_top', separator: ', ', format: '<b>%N</b> %V'},
        {name: 'Sep4', within: '_top', format: '<hr/>'},
        {name: 'Notes', within: '_top', format: '%V'}
    );
    rules.defineViewer('Stat Block', viewer);
  }
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
Pathfinder.choiceEditorElements = function(rules, type) {
  let result = [];
  if(type == 'Faction')
    result.push(
      // empty
    );
  else if(type == 'Skill')
    result =
      SRD35.choiceEditorElements(rules, type).filter(x => x[0] != 'Synergy');
  else if(type == 'Trait')
    result.push(
      ['Type', 'Type', 'select-one', ['Basic', 'Campaign', 'Faction', 'Race', 'Regional', 'Religion']],
      ['Subtype', 'Subtype', 'text', [20]]
    );
  else {
    result = SRD35.choiceEditorElements(rules, type);
    for(let i = 0; i < result.length; i++)
      result[i][1] = result[i][1].replaceAll('Skill Points', 'Skill Ranks');
  }
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Pathfinder.randomizeOneAttribute = function(attributes, attribute) {
  SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
  let attrs;
  let choices;
  let howMany;
  if(attribute == 'levels') {
    // Set experience track and override SRD3.5's experience value
    if(!attributes.experienceTrack)
      attributes.experienceTrack =
        QuilvynUtils.randomKey(this.getChoices('tracks'));
    let progression =
      QuilvynUtils.getAttrValueArray
        (Pathfinder.TRACKS[attributes.experienceTrack], 'Progression');
    let level =
      QuilvynUtils.sumMatching(attributes, /levels\./) +
      QuilvynUtils.sumMatching(attributes, /npc\./) +
      QuilvynUtils.sumMatching(attributes, /prestige\./);
    if(!level) {
      level = 1;
      attributes['levels.' + QuilvynUtils.randomKey(this.getChoices('levels'))] = level;
    }
    if(level < progression.length) {
      let min = progression[level - 1] * 1000;
      let max = progression[level] * 1000 - 1;
      attributes.experience = QuilvynUtils.random(min, max);
    }
  } else if(attribute == 'traits') {
    let allTraits = this.getChoices('traits');
    attrs = this.applyRules(attributes);
    let allowedTraits = {}; // arrays of choices by trait type
    for(let t in allTraits) {
      let traitType = QuilvynUtils.getAttrValue(allTraits[t], 'Type');
      let traitSubtype = QuilvynUtils.getAttrValue(allTraits[t], 'Subtype');
      if(traitType == 'Basic')
        traitType = traitSubtype;
      if(!traitType ||
         attrs['traits.' + t] ||
         (traitType == 'Race' &&
          !((attrs.race + '').match('(^| )' + traitSubtype))) ||
         (traitType == 'Faction' && attrs.faction != traitSubtype) ||
         (traitType == 'Religion' && attrs.deityAlignment != traitSubtype))
        continue;
      if(!(traitType in allowedTraits))
        allowedTraits[traitType] = [];
      allowedTraits[traitType].push(t);
    }
    for(let a in attrs) {
      if(!a.startsWith('traits.'))
        continue;
      let t = a.replace('traits.', '');
      if(!(t in allTraits))
        continue;
      let traitType = QuilvynUtils.getAttrValue(allTraits[t], 'Type');
      let traitSubtype = QuilvynUtils.getAttrValue(allTraits[t], 'Subtype');
      if(traitType == 'Basic')
        traitType = traitSubtype;
      if(traitType in allowedTraits)
        delete allowedTraits[traitType];
    }
    howMany = attrs.traitCount || 0;
    while(howMany > 0 && Object.keys(allowedTraits).length > 0) {
      let traitType = QuilvynUtils.randomKey(allowedTraits);
      choices = allowedTraits[traitType];
      let index = QuilvynUtils.random(0, choices.length - 1);
      attributes['traits.' + choices[index]] = 1;
      howMany--;
      delete allowedTraits[traitType];
    }
  }
};

/* Returns an array of plugins upon which this one depends. */
Pathfinder.getPlugins = function() {
  let result = [SRD35];
  if(window.PFAPG != null && 'Oracle' in Pathfinder.rules.getChoices('levels'))
    result.unshift(PFAPG);
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
Pathfinder.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Pathfinder Rule Set Notes</h2>\n' +
    '<p>\n' +
    'Quilvyn Pathfinder Rule Set Version ' + Pathfinder.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn provides no specific place to record character favored\n' +
    '    classes. When this information is important (e.g., for characters\n' +
    '    with levels in a non-favored class), you can list favored classes\n' +
    '    in the notes section.\n' +
    '  </li><li>\n' +
    '    Discussion of adding different types of homebrew options to the\n' +
    '    Pathfinder rule set can be found in <a href="plugins/homebrew-pathfinder.html">Pathfinder Homebrew Examples</a>.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn incorrectly validates the Mystic Theurge requirement of\n' +
    '    being able to cast 2nd-level arcane and divine spells.  It checks\n' +
    '    that the character is caster level 3 in each category, whereas\n' +
    '    some magic-using classes (e.g., Sorcerer) don\'t allow 2nd-level\n' +
    '    spells until a higher caster level.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Pathfinder material is Open Game Content from the Pathfinder ' +
    'Roleplaying Game Reference Document, released by Paizo Publishing, LLC ' +
    'under the Open Game License. ©2011, Paizo Publishing, LLC; Author: ' +
    'Paizo Publishing, LLC.\n' +
    '</p><p>\n' +
    'Open Game License v 1.0a Copyright 2000, Wizards of the Coast, LLC. You ' +
    'should have received a copy of the Open Game License with this program; ' +
    'if not, you can obtain one from ' +
    'https://media.wizards.com/2016/downloads/SRD-OGL_V1.1.pdf. ' +
    '<a href="plugins/ogl-pathfinder.txt">Click here</a> to see the license.<br/>\n'+
    '</p>\n';
};

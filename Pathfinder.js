/*
Copyright 2020, James J. Hayes

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
"use strict";

var PATHFINDER_VERSION = '2.1.1.4';

/*
 * This module loads the rules from the Pathfinder Reference Document.  The
 * Pathfinder function contains methods that load rules for particular parts of
 * the PRD; raceRules for character races, shieldRules for shields, etc.  These
 * member methods can be called independently in order to use a subset of the
 * PRD rules.  Similarly, the constant fields of Pathfinder (ALIGNMENTS, FEATS,
 * etc.) can be manipulated to modify the choices.
 */
function Pathfinder() {

  if(window.SRD35 == null) {
    alert('The Pathfinder module requires use of the SRD35 module');
    return;
  }

  var rules = new QuilvynRules('Pathfinder 1E', PATHFINDER_VERSION);
  Pathfinder.rules = rules;

  rules.defineChoice('choices', Pathfinder.CHOICES);
  rules.choiceEditorElements = Pathfinder.choiceEditorElements;
  rules.choiceRules = Pathfinder.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Pathfinder.randomizeOneAttribute;
  rules.defineChoice('random', Pathfinder.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Pathfinder.ruleNotes;

  Pathfinder.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset', 'race', 'level', 'levels');

  Pathfinder.abilityRules(rules);
  Pathfinder.aideRules
    (rules, Pathfinder.ANIMAL_COMPANIONS, Pathfinder.FAMILIARS);
  Pathfinder.combatRules
    (rules, Pathfinder.ARMORS, Pathfinder.SHIELDS, Pathfinder.WEAPONS);
  // Most spell definitions are handled by individual classes and domains.
  // Schools must be defined before this can be done.
  Pathfinder.magicRules(rules, Pathfinder.SCHOOLS, []);
  // Feats must be defined before paths
  Pathfinder.talentRules
    (rules, Pathfinder.FEATS, Pathfinder.FEATURES, Pathfinder.LANGUAGES,
     Pathfinder.SKILLS);
  Pathfinder.identityRules(
    rules, Pathfinder.ALIGNMENTS, Pathfinder.CLASSES, Pathfinder.DEITIES,
    Pathfinder.FACTIONS, Pathfinder.PATHS, Pathfinder.RACES, Pathfinder.TRACKS,
    Pathfinder.TRAITS
  );
  Pathfinder.goodiesRules(rules);

  Quilvyn.addRuleSet(rules);

}

/* List of items handled by choiceRules method. */
Pathfinder.CHOICES = [
  'Alignment', 'Animal Companion', 'Armor', 'Class', 'Deity', 'Faction',
  'Familiar', 'Feat', 'Feature', 'Language', 'Path', 'Race', 'School',
  'Shield', 'Skill', 'Spell', 'Track', 'Trait', 'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
Pathfinder.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'deity', 'levels', 'features',
  'feats', 'skills', 'languages', 'hitPoints', 'armor', 'shield', 'weapons',
  'spells', 'companion', 'faction', 'traits'
];

SRD35.ABBREVIATIONS['CMB'] = 'Combat Maneuver Bonus';
SRD35.ABBREVIATIONS['CMD'] = 'Combat Maneuver Defense';

Pathfinder.ALIGNMENTS = {
  'Chaotic Evil':'',
  'Chaotic Good':'',
  'Chaotic Neutral':'',
  'Neutral Evil':'',
  'Neutral Good':'',
  'Neutral':'',
  'Lawful Evil':'',
  'Lawful Good':'',
  'Lawful Neutral':''
};
Pathfinder.ANIMAL_COMPANIONS = {

  // Attack, Dam, AC include all modifiers
  'Ape':
    'Str=13 Dex=17 Con=10 Int=2 Wis=12 Cha=7 AC=14 Attack=1 ' +
    'Dam=2@1d4+1,1d4+1 Size=M',
  'Badger':
    'Str=10 Dex=17 Con=15 Int=2 Wis=12 Cha=10 AC=16 Attack=1 Dam=1d4 Size=S',
  'Bear':
    'Str=15 Dex=15 Con=13 Int=2 Wis=12 Cha=6 AC=15 Attack=3 ' +
    'Dam=2@1d3+2,1d4+2 Size=S',
  'Boar':
    'Str=13 Dex=12 Con=15 Int=2 Wis=13 Cha=4 AC=18 Attack=2 Dam=1d6+1 Size=S',
  'Camel':
    'Str=18 Dex=16 Con=14 Int=2 Wis=11 Cha=4 AC=13 Attack=3 Dam=1d4+4 Size=L',
  'Cheetah':
    'Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6 AC=17 Attack=2 ' +
    'Dam=2@1d2+1,1d4+1 Size=S',
  'Constrictor':
    'Str=15 Dex=17 Con=13 Int=1 Wis=12 Cha=2 AC=15 Attack=2 Dam=1d3+2 Size=M',
  'Crocodile':
    'Str=15 Dex=14 Con=15 Int=1 Wis=12 Cha=2 AC=17 Attack=3 Dam=1d6+2 Size=S',
  'Deinonychus':
    'Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14 AC=15 Attack=1 Dam=2@1d6,1d4 ' +
    'Size=S',
  'Dog':
    'Str=13 Dex=17 Con=15 Int=2 Wis=12 Cha=6 AC=16 Attack=2 Dam=1d4+1 Size=S',
  'Eagle':
    'Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 AC=14 Attack=1 Dam=2@1d4,1d4 ' +
    'Size=S',
  'Hawk':
    'Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 AC=14 Attack=1 Dam=2@1d4,1d4 ' +
    'Size=S',
  'Horse':
    'Str=16 Dex=13 Con=15 Int=2 Wis=12 Cha=6 AC=14 Attack=2 ' +
    'Dam=2@1d6+3,1d4+3 Size=L',
  'Leopard':
    'Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6 AC=17 Attack=2 ' +
    'Dam=2@1d2+1,1d4+1 Size=S',
  'Lion':
    'Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10 AC=14 Attack=1 ' +
    'Dam=2@1d4+1,1d6+1 Size=M',
  'Owl':
    'Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 AC=14 Attack=1 Dam=2@1d4,1d4 ' +
    'Size=S',
  'Pony':
    'Str=13 Dex=13 Con=12 Int=2 Wis=11 Cha=4 AC=13 Attack=1 Dam=2@1d3+1 Size=M',
  'Shark':
    'Str=13 Dex=15 Con=15 Int=1 Wis=12 Cha=2 AC=17 Attack=2 Dam=1d4+1 Size=S',
  'Tiger':
    'Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10 AC=14 Attack=1 ' +
    'Dam=2@1d4+1,1d6+1 Size=M',
  'Velociraptor':
    'Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14 AC=15 Attack=1 Dam=2@1d6,1d4 ' +
    'Size=S',
  'Viper':
    'Str=8 Dex=17 Con=11 Int=1 Wis=12 Cha=2 AC=16 Attack=0 Dam=1d3-1 Size=S',
  'Wolf':
    'Str=13 Dex=15 Con=15 Int=2 Wis=12 Cha=6 AC=14 Attack=1 Dam=1d6+1 Size=M'
};
Object.assign(Pathfinder.ANIMAL_COMPANIONS, {
  'Advanced Ape': Pathfinder.ANIMAL_COMPANIONS['Ape'] +
    ' Level=4 Size=L Attack=4 AC=13 Dam=2@1d6+5,1d6+5 Str=21 Dex=15 Con=14',
  'Advanced Badger': Pathfinder.ANIMAL_COMPANIONS['Badger'] +
    ' Level=4 Size=M Attack=2 AC=14 Dam=2@1d4+2,1d6+2 Str=14 Dex=15 Con=17',
  'Advanced Bear': Pathfinder.ANIMAL_COMPANIONS['Bear'] +
    ' Level=4 Size=M Attack=4 AC=13 Dam=2@1d4+4,1d6+4 Str=19 Dex=13 Con=15',
  'Advanced Boar': Pathfinder.ANIMAL_COMPANIONS['Boar'] +
    ' Level=4 Size=M Attack=3 AC=16 Dam=1d8+3 Str=17 Dex=10 Con=17',
  'Advanced Camel': Pathfinder.ANIMAL_COMPANIONS['Camel'] +
    ' Level=4 Attack=4 AC=13 Dam=1d4+5 Str=20 Con=19',
  'Advanced Cheetah': Pathfinder.ANIMAL_COMPANIONS['Cheetah'] +
    ' Level=4 Size=M Attack=3 AC=15 Dam=2@1d3+3,1d6+3 Str=16 Dex=19 Con=15',
  'Advanced Constrictor': Pathfinder.ANIMAL_COMPANIONS['Constrictor'] +
    ' Level=4 Size=L Attack=5 AC=12 Dam=1d4+6 Str=23 Dex=15 Con=17',
  'Advanced Crocodile': Pathfinder.ANIMAL_COMPANIONS['Crocodile'] +
    ' Level=4 Size=M Attack=4 AC=15 Dam=1d8+4 Str=19 Dex=12 Con=17',
  'Advanced Deinonychus': Pathfinder.ANIMAL_COMPANIONS['Deinonychus'] +
    ' Level=7 Size=M Attack=2 AC=14 Dam=2@1d8+2,1d6+2,2@1d4+2 Str=15 Dex=15 Con=15',
  'Advanced Dog': Pathfinder.ANIMAL_COMPANIONS['Dog'] +
    ' Level=4 Size=L Attack=3 AC=14 Dam=1d6+3 Str=17 Dex=15 Con=17',
  'Advanced Eagle': Pathfinder.ANIMAL_COMPANIONS['Eagle'] +
    ' Level=4 Attack=2 AC=14 Dam=2@1d4+1,1d4+1 Str=12 Con=14',
  'Advanced Hawk': Pathfinder.ANIMAL_COMPANIONS['Hawk'] +
    ' Level=4 Attack=2 AC=14 Dam=2@1d4+1,1d4+1 Str=12 Con=14',
  'Advanced Horse': Pathfinder.ANIMAL_COMPANIONS['Horse'] +
    ' Level=4 Attack=3 AC=14 Dam=2@1d6+4,1d4+4 Str=18 Con=17',
  'Advanced Leopard': Pathfinder.ANIMAL_COMPANIONS['Leopard'] +
    ' Level=4 Size=M Attack=3 AC=15 Dam=2@1d3+3,1d6+3 Str=16 Dex=19 Con=15',
  'Advanced Lion': Pathfinder.ANIMAL_COMPANIONS['Lion'] +
    ' Level=7 Size=L Attack=4 AC=13 Dam=2@1d6+5,1d6+5 Str=21 Dex=15 Con=17',
  'Advanced Owl': Pathfinder.ANIMAL_COMPANIONS['Owl'] +
    ' Level=4 Attack=2 AC=14 Dam=2@1d4+1,1d4+1 Str=12 Con=14',
  'Advanced Pony': Pathfinder.ANIMAL_COMPANIONS['Pony'] +
    ' Level=4 Attack=2 AC=13 Dam=2@1d3+2 Str=15 Con=14',
  'Advanced Shark': Pathfinder.ANIMAL_COMPANIONS['Shark'] +
    ' Level=4 Size=M Attack=3 AC=11 Dam=1d6+3 Str=17 Dex=13 Con=17',
  'Advanced Tiger': Pathfinder.ANIMAL_COMPANIONS['Tiger'] +
    ' Level=7 Size=L Attack=4 AC=13 Dam=2@1d6+5,1d6+5 Str=21 Dex=15 Con=17',
  'Advanced Velociraptor': Pathfinder.ANIMAL_COMPANIONS['Velociraptor'] +
    ' Level=7 Size=M Attack=2 AC=14 Dam=2@1d8+2,1d6+2,2@1d4+2 Str=15 Dex=15 Con=15',
  'Advanced Viper': Pathfinder.ANIMAL_COMPANIONS['Viper'] +
    ' Level=4 Size=M Attack=1 AC=15 Dam=1d4+1 Str=12 Dex=15 Con=13',
  'Advanced Wolf': Pathfinder.ANIMAL_COMPANIONS['Wolf'] +
    ' Level=7 Size=L Attack=4 AC=13 Dam=1d8+5 Str=21 Dex=13 Con=19'
});
Pathfinder.ARMORS = {
  'None':'AC=0 Weight=0 Dex=10 Skill=0 Spell=0',
  'Padded':'AC=1 Weight=1 Dex=8 Skill=0 Spell=5',
  'Leather':'AC=2 Weight=1 Dex=6 Skill=0 Spell=10',
  'Studded Leather':'AC=3 Weight=1 Dex=5 Skill=1 Spell=15',
  'Chain Shirt':'AC=4 Weight=1 Dex=4 Skill=2 Spell=20',
  'Hide':'AC=4 Weight=2 Dex=4 Skill=3 Spell=20',
  'Scale Mail':'AC=5 Weight=2 Dex=3 Skill=4 Spell=25',
  'Chainmail':'AC=6 Weight=2 Dex=2 Skill=5 Spell=30',
  'Breastplate':'AC=5 Weight=2 Dex=3 Skill=4 Spell=25',
  'Splint Mail':'AC=7 Weight=3 Dex=0 Skill=7 Spell=40',
  'Banded Mail':'AC=7 Weight=3 Dex=1 Skill=6 Spell=35',
  'Half Plate':'AC=8 Weight=3 Dex=0 Skill=7 Spell=40',
  'Full Plate':'AC=9 Weight=3 Dex=1 Skill=6 Spell=35'
};
Pathfinder.DEITIES = {
  'None':'',
  'Abadar':
    'Alignment=LN ' +
    'Weapon="Light Crossbow" ' +
    'Domain=Earth,Law,Nobility,Protection,Travel',
  'Asmodeus':
    'Alignment=LE ' +
    'Weapon=Mace ' +
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
    'Weapon=Unarmed ' +
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
Pathfinder.FACTIONS = {
  'Andoran':'',
  'Cheliax':'',
  'The Concordance':'',
  'Dark Archive':'',
  'The Exchange':'',
  'Grand Lodge':'',
  'Lantern Lodge':'',
  "Liberty's Edge":'',
  'None':'',
  'Osirion':'',
  'Qadira':'',
  'Sczarni':'',
  'Shadow Lodge':'',
  'Silver Crusade':'',
  'Sovereign Court':'',
  'Taldor':''
};
Pathfinder.FAMILIARS = {

  // Attack, Dam, AC include all modifiers
  'Bat':
    'Str=1 Dex=15 Con=6 Int=2 Wis=14 Cha=5 HD=1 AC=16 Attack=6 Dam=1d3-5 ' +
    'Size=D',
  'Cat':
    'Str=3 Dex=15 Con=8 Int=2 Wis=12 Cha=7 HD=1 AC=14 Attack=4 ' +
    'Dam=2@1d2-4,1d3-4 Size=T',
  'Hawk':
    'Str=6 Dex=17 Con=11 Int=2 Wis=14 Cha=7 HD=1 AC=15 Attack=5 Dam=2@1d4-2 ' +
    'Size=T',
  'Lizard':
    'Str=3 Dex=15 Con=8 Int=1 Wis=12 Cha=2 HD=1 AC=14 Attack=4 Dam=1d4-4 ' +
    'Size=T',
  'Monkey':
    'Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5 HD=1 AC=14 Attack=4 Dam=1d3-4 ' +
    'Size=T',
  'Owl':
    'Str=6 Dex=17 Con=11 Int=2 Wis=15 Cha=6 HD=1 AC=15 Attack=5 Dam=2@1d4-2 ' +
    'Size=T',
  'Rat':
    'Str=2 Dex=15 Con=11 Int=2 Wis=13 Cha=2 HD=1 AC=14 Attack=4 Dam=1d3-4 ' +
    'Size=T',
  'Raven':
    'Str=2 Dex=15 Con=8 Int=2 Wis=15 Cha=7 HD=1 AC=14 Attack=4 Dam=1d3-4 ' +
    'Size=T',
  'Toad':
    'Str=1 Dex=12 Con=6 Int=1 Wis=15 Cha=4 HD=1 AC=15 Attack=0 Dam=0 Size=D',
  'Viper':
    'Str=4 Dex=17 Con=8 Int=1 Wis=13 Cha=2 HD=1 AC=16 Attack=5 Dam=1d2-2 ' +
    'Size=T',
  'Weasel':
    'Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5 HD=1 AC=15 Attack=4 Dam=1d3-4 ' +
    'Size=T',

  'Air Elemental':
    'Str=12 Dex=17 Con=12 Int=4 Wis=11 Cha=11 HD=2 AC=17 Attack=6 Dam=1d4+1 ' +
    'Size=S Level=5',
  'Dire Rat':
    'Str=10 Dex=17 Con=13 Int=2 Wis=13 Cha=4 HD=1 AC=14 Attack=1 Dam=1d4 ' +
    'Size=S Level=3',
  'Earth Elemental':
    'Str=16 Dex=8 Con=13 Int=4 Wis=11 Cha=11 HD=2 AC=17 Attack=6 Dam=1d6+4 ' +
    'Size=S Level=5',
  'Fire Elemental':
    'Str=10 Dex=13 Con=10 Int=4 Wis=11 Cha=11 HD=2 AC=16 Attack=4 Dam=1d4 ' +
    'Size=S Level=5',
  'Homunculus':
    'Str=8 Dex=15 Con=0 Int=10 Wis=12 Cha=7 HD=2 AC=14 Attack=3 Dam=1d4-1 ' +
    'Size=T Level=7',
  'Imp':
    'Str=10 Dex=17 Con=10 Int=13 Wis=12 Cha=14 HD=3 AC=17 Attack=8 Dam=1d4 ' +
    'Size=T Level=7',
  'Mephit':
    'Str=13 Dex=15 Con=12 Int=6 Wis=11 Cha=14 HD=3 AC=17 Attack=5 Dam=1d3+1 ' +
    'Size=S Level=7',
  'Pseudodragon':
    'Str=7 Dex=15 Con=13 Int=10 Wis=12 Cha=10 HD=2 AC=16 Attack=6 ' +
    'Dam=1d3-2,1d2-2 Size=T Level=7',
  'Quasit':
    'Str=8 Dex=14 Con=11 Int=11 Wis=12 Cha=11 HD=3 AC=16 Attack=7 ' +
    'Dam=1d3-1,1d4-1 Size=T Level=7',
  'Stirge':
    'Str=3 Dex=19 Con=10 Int=1 Wis=12 Cha=6 HD=1 AC=16 Attack=7 Dam=0 Size=M ' +
    'Level=5',
  'Water Elemental':
    'Str=14 Dex=10 Con=13 Int=4 Wis=11 Cha=11 HD=2 AC=17 Attack=5 Dam=1d6+3 ' +
    'Size=T Level=5'

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
      '"features.Armor Proficiency (Medium)"',
  'Arcane Armor Training':
    'Type=Fighter ' +
    'Require=' +
      '"casterLevel >= 3",' +
      '"features.Armor Proficiency (Light)"',
  'Arcane Strike':'Type=Fighter Require="casterLevelArcane >= 1"',
  'Armor Proficiency (Heavy)':
    'Type=Fighter Require="features.Armor Proficiency (Medium)"',
  'Armor Proficiency (Light)':'Type=Fighter',
  'Armor Proficiency (Medium)':
    'Type=Fighter Require="features.Armor Proficiency (Light)"',
  'Athletic':'Type=General',
  'Augment Summoning':
    'Type=General Require="features.Spell Focus (Conjuration)"',
  'Bleeding Critical':
    'Type=Fighter,Critical Require="baseAttack>=11","features.Critical Focus"',
  'Blind-Fight':'Type=Fighter',
  'Blinding Critical':
    'Type=Fighter,Critical Require="baseAttack>=15","features.Critical Focus"',
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
      '"level.Fighter >= 14",' +
      '"features.Critical Focus",' +
      '"Sum \'^features\\..*Critical$\' >= 2"',
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
      '"features.WeaponFocus"',
  'Deafening Critical':
    'Type=Fighter,Critical Require="baseAttack>=13","features.Critical Focus"',
  'Deceitful':'Type=General',
  'Defensive Combat Training':'Type=Fighter',
  'Deflect Arrows':
    'Type=Fighter Require="dexterity >= 13","features.Improved Unarmed Strike"',
  'Deft Hands':'Type=General',
  'Diehard':'Type=General Require="features.Endurance"',
  'Disruptive':'Type=Fighter Require="level.Fighter >= 6"',
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
  'Extend Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Extra Channel':'Type=General Require="features.Channel Energy"',
  'Extra Ki':'Type=General Require="features.Ki Pool"',
  'Extra Lay On Hands':'Type=General Require="features.Lay On Hands"',
  'Extra Mercy':'Type=General Require="features.Lay On Hands",features.Mercy',
  'Extra Performance':'Type=General Require="features.Bardic Performance"',
  'Extra Rage':'Type=General Require=features.Rage',
  'Far Shot':'Type=Fighter Require="features.Point-Blank Shot"',
  'Fleet':'Type=General Imply="armorWeight < 2"',
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
      '"level.Fighter >= 16",' +
      '"features.Penetrating Strike",' +
      '"Sum \'^features\\.Weapon Focus\' >= 1"',
  'Greater Shield Focus':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 1",' +
      '"levels.Fighter >= 8",' +
      '"features.Shield Focus",' +
      '"features.Shield Proficiency (Heavy)"',
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
  'Greater Weapon Focus (Longsword)':
    'Type=Fighter ' +
    'Imply=weapons.Longsword ' +
    'Require=' +
      '"features.Weapon Focus (Longsword)",' +
      '"levels.Fighter >= 8"',
  'Greater Weapon Specialization (Longsword)':
    'Type=Fighter ' +
    'Imply=weapons.Longsword ' +
    'Require=' +
      '"features.Weapon Focus (Longsword)",' +
      '"features.Greater Weapon Focus (Longsword)",' +
      '"features.Weapon Specialization (Longsword)",' +
      '"levels.Fighter >= 12"',
  'Heighten Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Improved Bull Rush':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Channel':'Type=General Require="features.Channel Energy"',
  'Improved Counterspell':'Type=General Imply="casterLevel >= 1"',
  'Improved Critical (Longsword)':
    'Type=Fighter Require="baseAttack >= 8" Imply=weapons.Longsword',
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
    'Type=Fighter Require="features.Shield Proficiency (Heavy)"',
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
  'Master Craftsman (Craft (Armor))':
    'Type=General Require="skills.Craft (Armor) >= 5"',
  'Master Craftsman (Profession (Tanner))':
    'Type=General Require="skills.Profession (Tanner) >= 5"',
  'Maximize Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
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
      '"levels.Fighter >= 12",' +
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
  'Scorpion Style':'Type=Fighter Require="Improved Unarmed Strike"',
  'Scribe Scroll':'Type="Item Creation",Wizard Require="casterLevel >= 1"',
  'Selective Channeling':
    'Type=General Require="charisma >= 13","features.Channel Energy"',
  'Self-Sufficient':'Type=General',
  'Shatter Defenses':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"Sum \'^features\\.Weapon Focus\' >= 1",' +
      '"features.Dazzing Display"',
  'Shield Focus':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","features.Shield Proficiency (Heavy)"',
  'Shield Master':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"features.Improved Shield Bash",' +
      '"features.Shield Proficiency (Heavy)",' +
      '"features.Shield Slam",' +
      '"features.Two-Weapon Fighting"',
  'Shield Proficiency (Heavy)':'Type=Fighter',
  'Shield Proficiency (Tower)':'Type=Fighter',
  'Shield Slam':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"features.Improved Shield Bash",' +
      '"features.Shield Proficiency (Heavy)",' +
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
  // Skill Focus subfeats required by bloodlines
  'Skill Focus (Fly)':'Type=General',
  'Skill Focus (Knowledge (Arcana))':'Type=General',
  'Skill Focus (Knowledge (Dungeoneering))':'Type=General',
  'Skill Focus (Knowledge (History))':'Type=General',
  'Skill Focus (Knowledge (Nature))':'Type=General',
  'Skill Focus (Knowledge (Planes))':'Type=General',
  'Skill Focus (Knowledge (Religion))':'Type=General',
  'Snatch Arrows':
    'Type=Fighter ' +
    'Require=' +
      '"dexterity >= 15",' +
      '"features.Deflect Arrows",' +
      '"features.Improved Unarmed Strike"',
  'Spell Focus (Abjuration)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Conjuration)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Divination)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Enchantment)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Evocation)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Illusion)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Necromancy)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Transmutation)':'Type=General Imply="casterLevel >= 1"',
  'Spell Mastery':
    'Type=Wizard Imply="intelligenceModifier > 0" Require="levels.Wizard >= 1"',
  'Spell Penetration':'Type=General Imply="casterLevel >= 1"',
  'Spellbreaker':
    'Type=Fighter Require="levels.Fighter >= 10","features.Disruptive"',
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
    'Type=Fighter,Critcial ' +
    'Require="baseAttack >= 13","features.Critical Focus"',
  'Toughness':'Type=General',
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
      '"features.Mounted Attack",' +
      '"features.Power Attack",' +
      '"features.Improved Bull Rush"',
  'Vital Strike':'Type=Fighter Require="baseAttack >= 6"',
  'Weapon Finesse':
    'Type=Fighter ' +
    'Imply="dexterityModifier > strengthModifier"',
  'Weapon Focus (Longsword)':
    'Type=Fighter Require="baseAttack >= 1" Imply=weapons.Longsword',
  'Weapon Proficiency (Simple)':'Type=General',
  'Weapon Proficiency (Longsword)':
    'Type=General Require="baseAttack >= 1" Imply="weapons.Longsword"',
  'Weapon Specialization (Longsword)':
    'Type=Fighter ' +
    'Imply="weapons.Longsword" ' +
    'Require=' +
      '"features.Weapon Focus (Longsword)",' +
      '"levels.Fighter >= 4"',
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

  // Shared with SRD35
  'Abundant Step':'Section=magic Note="Use 2 ki to <i>Dimension Door</i>"',
  'Acrobatic':'Section=skill Note="+%V Acrobatics/+%V Fly"',
  'Alertness':'Section=skill Note="+%V Perception/+%V Sense Motive"',
  'Animal Affinity':'Section=skill Note="+%V Handle Animal/+%V Ride"',
  'Animal Companion':'Section=feature Note="Special bond and abilities"',
  'Armor Class Bonus':'Section=combat Note="+%V AC/+%V CMD"',
  'Athletic':'Section=skill Note="+%V Climb/+%V Swim"',
  'Augment Summoning':'Section=magic Note="Summoned creatures +4 Str, +4 Con"',
  'Aura':
    'Section=magic ' +
    'Note="Visible to <i>Detect Chaos/Evil/Good/Law</i> based on deity alignment"',
  'Aura Of Courage':'Section=save Note="Immune fear, +4 to allies w/in 30\'"',
  'Bardic Knowledge':
    'Section=skill Note="+%V all Knowledge, use any Knowledge untrained"',
  'Blind-Fight':
    'Section=combat ' +
    'Note="Reroll concealed miss, no bonus to invisible foe, no skill check on blinded full speed move"',
  'Brew Potion':'Section=magic Note="Create potion for up to 3rd level spell"',
  'Camouflage':'Section=skill Note="Hide in favored terrain"',
  'Cleave':'Section=combat Note="-2 AC for attack against two foes"',
  'Combat Casting':
    'Section=skill Note="+4 concentration (defensive or grappling)"',
  'Combat Expertise':
    'Section=combat Note="Trade up to -%V attack for equal AC bonus"',
  'Combat Reflexes':'Section=combat Note="Flatfooted AOO, %V AOO/rd"',
  'Companion Alertness':
    'Section=skill Note="+2 Perception, Sense Motive when companion in reach"',
  'Companion Evasion':
    'Section=companion Note="Reflex save yields no damage instead of half"',
  'Companion Improved Evasion':
    'Section=companion Note="Failed save yields half damage"',
  'Countersong':
    'Section=magic Note="R30\' Perform check vs. sonic magic for 10 rd"',
  'Craft Magic Arms And Armor':
    'Section=magic Note="Create and mend magic weapons, armor, and shields"',
  'Craft Rod':'Section=magic Note="Create magic rod"',
  'Craft Staff':'Section=magic Note="Create magic staff"',
  'Craft Wand':'Section=magic Note="Create wand for up to 4th level spell"',
  'Craft Wondrous Item':
    'Section=magic Note="Create and mend miscellaneous magic items"',
  'Crippling Strike':
    'Section=combat Note="2 points Str damage from sneak attack"',
  'Damage Reduction':'Section=combat Note="Negate %V HP each attack"',
  'Darkvision':'Section=feature Note="60\' b/w vision in darkness"',
  'Deceitful':'Section=skill Note="+%V Bluff/+%V Disguise"',
  'Defensive Roll':
    'Section=combat ' +
    'Note="DC damage Reflex save vs. lethal blow for half damage"',
  'Deflect Arrows':'Section=combat Note="No damage from ranged hit 1/rd"',
  'Deft Hands':'Section=skill Note="+%V Disable Device/+%V Sleight Of Hand"',
  'Deliver Touch Spells':
    'Section=companion ' +
    'Note="Deliver touch spells if in contact w/master when cast"',
  'Detect Evil':'Section=magic Note="<i>Detect Evil</i> at will"',
  'Devotion':'Section=companion Note="+4 Will vs. enchantment"',
  'Diamond Body':'Section=save Note="Immune to poison"',
  'Diamond Soul':'Section=save Note="DC %V spell resistance"',
  'Diehard':
    'Section=combat Note="Remain conscious and stable with negative HP"',
  'Divine Grace':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Divine Health':'Section=save Note="Immune to disease"',
  'Dodge':'Section=combat Note="+1 AC/+1 CMD"',
  'Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/+2 Wisdom/-2 Charisma"',
  'Dwarf Armor Speed Adjustment':
    'Section=ability Note="No armor speed penalty"',
  'Dwarf Enmity':'Section=combat Note="+1 attack vs. goblinoid and orc"',
  'Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Constitution"',
  'Empathic Link':'Section=companion Note="Share emotions up to 1 mile"',
  'Empower Spell':
    'Section=magic ' +
    'Note="x1.5 chosen spell variable effects uses +2 spell slot"',
  'Empty Body':'Section=magic Note="Use 3 ki for 1 min <i>Etherealness</i>"',
  'Endurance':'Section=save Note="+4 extended physical action"',
  'Enlarge Spell':
    'Section=magic Note="x2 chosen spell range uses +1 spell slot"',
  'Eschew Materials':'Section=magic Note="Cast spells w/out materials"',
  'Evasion':'Section=save Note="Reflex save yields no damage instead of half"',
  'Extend Spell':
    'Section=magic Note="x2 chosen spell duration uses +1 spell slot"',
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
  'Familiar':'Section=feature Note="Special bond and abilities"',
  'Far Shot':'Section=combat Note="-1 range penalty"',
  'Fascinate':
    'Section=magic ' +
    'Note="R90\' Hold %V creatures spellbound %1 rd (DC %2 Will neg)"',
  'Fast Movement':'Section=ability Note="+%V Speed"',
  'Favored Enemy':
    'Section=combat,skill ' +
    'Note="+2 or more attack and damage vs. %V type(s) of creatures",' +
         '"+2 or more Bluff, Knowledge, Perception, Sense Motive, Survival vs. %V type(s) of creatures"',
  'Feat Bonus':'Section=feature Note="+1 General Feat"',
  'Flurry Of Blows':
    'Section=combat ' +
    'Note="Full-round %V +%1 monk weapon attacks, use 1 ki for one more"',
  'Forge Ring':'Section=magic Note="Create and mend magic rings"',
  'Fortunate':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Gnome Ability Adjustment':
    'Section=ability Note="+2 Constitution/+2 Charisma/-2 Strength"',
  'Gnome Enmity':'Section=combat Note="+1 attack vs. goblinoid and reptilian"',
  'Good Fortune':'Section=magic Note="Reroll d20 %V/day"',
  'Great Cleave':'Section=combat Note="Cleave w/out limit"',
  'Great Fortitude':'Section=save Note="+2 Fortitude"',
  'Greater Rage':'Section=combat Note="+6 Str, +6 Con, +3 Will during rage"',
  'Greater Spell Focus (Abjuration)':
    'Section=magic Note="+1 Spell DC (Abjuration)"',
  'Greater Spell Focus (Conjuration)':
    'Section=magic Note="+1 Spell DC (Conjuration)"',
  'Greater Spell Focus (Divination)':
    'Section=magic Note="+1 Spell DC (Divination)"',
  'Greater Spell Focus (Enchantment)':
    'Section=magic Note="+1 Spell DC (Enhancement)"',
  'Greater Spell Focus (Evocation)':
    'Section=magic Note="+1 Spell DC (Evocation)"',
  'Greater Spell Focus (Illusion)':
    'Section=magic Note="+1 Spell DC (Illusion)"',
  'Greater Spell Focus (Necromancy)':
    'Section=magic Note="+1 Spell DC (Necromancy)"',
  'Greater Spell Focus (Transmutation)':
    'Section=magic Note="+1 Spell DC (Transmutation)"',
  'Greater Spell Penetration':
    'Section=magic Note="+2 caster level vs. resistance checks"',
  'Greater Two-Weapon Fighting':
    'Section=combat Note="Third off-hand -10 attack"',
  'Half-Orc Ability Adjustment':'Section=ability Note="+2 any"',
  'Heighten Spell':'Section=magic Note="Increase chosen spell level"',
  'Hide In Plain Sight':'Section=skill Note="Hide even when observed"',
  'Improved Bull Rush':
    'Section=combat ' +
    'Note="No AOO on Bull Rush, +2 Bull Rush check, +2 Bull Rush CMD"',
  'Improved Counterspell':
    'Section=magic Note="Counter using higher-level spell from same school"',
  'Improved Critical (Longsword)':
    'Section=combat Note="x2 Longsword Threat Range"',
  'Improved Disarm':
    'Section=combat Note="No AOO on Disarm, +2 Disarm check, +2 Disarm CMD"',
  'Improved Evasion':'Section=save Note="Failed save yields half damage"',
  'Improved Familiar':'Section=feature Note="Expanded Familiar choices"',
  'Improved Feint':'Section=combat Note="Bluff check to Feint as move action"',
  'Improved Grapple':
    'Section=combat Note="No AOO on Grapple, +2 Grapple check, +2 Grapple CMD"',
  'Improved Initiative':'Section=combat Note="+4 Initiative"',
  'Improved Overrun':
    'Section=combat ' +
    'Note="No AOO on Overrun, +2 Overrun check, +2 Overrun CMD, foes cannot avoid"',
  'Improved Precise Shot':
    'Section=combat Note="No foe AC bonus for partial concealment"',
  'Improved Shield Bash':'Section=combat Note="No AC penalty on Shield Bash"',
  'Improved Speed':'Section=companion Note="+10 companion Speed"',
  'Improved Sunder':
    'Section=combat Note="No AOO on Sunder, +2 Sunder check, +2 Sunder CMD"',
  'Improved Trip':
    'Section=combat Note="No AOO on Trip, +2 Trip check, +2 Trip CMD"',
  'Improved Turning':'Section=combat Note="+1 Turning Level"',
  'Improved Two-Weapon Fighting':
    'Section=combat Note="Second off-hand -5 attack"',
  'Improved Unarmed Strike':
    'Section=combat Note="No AOO on Unarmed attack, may deal lethal damage"',
  'Improved Uncanny Dodge':
    'Section=combat ' +
    'Note="Cannot be flanked, sneak attack only by rogue level %V+"',
  'Increased Unarmed Damage':'Section=combat Note="%V"',
  'Indomitable Will':
    'Section=save Note="+4 enchantment resistance during rage"',
  'Inspire Competence':
    'Section=magic Note="+%V allies skill checks while performing"',
  'Inspire Courage':
    'Section=magic ' +
    'Note="+%V allies attack, damage, charm, fear saves while performing"',
  'Inspire Greatness':
    'Section=magic ' +
    'Note="%V allies +2d10 HP, +2 attack, +1 Fortitude while performing"',
  'Inspire Heroics':
    'Section=magic Note="%V allies +4 AC and saves while performing"',
  'Iron Will':'Section=save Note="+2 Will"',
  'Keen Senses':'Section=skill Note="+2 Perception"',
  'Ki Strike':'Section=combat Note="Unarmed attack is %V"',
  'Large':
    'Section=ability,combat,skill ' +
    'Note="x2 Load Max",' +
         '"-1 AC/-1 Melee Attack/-1 Ranged Attack/+1 CMB/+1 CMD",' +
         '"-2 Fly/+4 Intimidate/-4 Stealth"',
  'Lay On Hands':'Section=magic Note="Harm undead or heal %Vd6 HP %1/day"',
  'Leadership':'Section=feature Note="Attract followers"',
  'Lightning Reflexes':'Section=save Note="+2 Reflex"',
  'Link':
    'Section=skill ' +
    'Note="+4 Handle Animal (companion)/Wild Empathy (companion)"',
  'Low-Light Vision':'Section=feature Note="x2 normal distance in poor light"',
  'Magical Aptitude':'Section=skill Note="+%V Spellcraft/+%V Use Magic Device"',
  'Manyshot':'Section=combat Note="Fire 2 arrows simultaneously"',
  'Mass Suggestion':
    'Section=magic ' +
    'Note="<i>Suggestion</i> to all fascinated creatures (DC %V Will neg)"',
  'Maximize Spell':
    'Section=magic ' +
    'Note="Maximize all chosen spell variable effects uses +3 spell slot"',
  'Mighty Rage':'Section=combat Note="+8 Str, +8 Con, +4 Will during rage"',
  'Mobility':'Section=combat Note="+4 AC vs. movement AOO"',
  'Mounted Archery':'Section=combat Note="x.5 mounted ranged penalty"',
  'Mounted Combat':
    'Section=combat Note="Ride skill save vs. mount damage 1/rd"',
  'Natural Spell':'Section=magic Note="Cast spell during <i>Wild Shape</i>"',
  'Nature Sense':'Section=skill Note="+2 Knowledge (Nature)/+2 Survival"',
  'Opportunist':'Section=combat Note="AOO vs. foe struck by ally"',
  'Perfect Self':
    'Section=combat,save ' +
    'Note="DR 10/chaotic","Treat as outsider for magic saves"',
  'Persuasive':'Section=skill Note="+%V Diplomacy/+%V Intimidate"',
  'Point-Blank Shot':
    'Section=combat Note="+1 ranged attack and damage w/in 30\'"',
  'Power Attack':
    'Section=combat Note="Trade up to -%V attack for double damage bonus"',
  'Precise Shot':'Section=combat Note="No penalty on shot into melee"',
  'Purity Of Body':'Section=save Note="Immune to normal disease"',
  'Quick Draw':'Section=combat Note="Draw weapon as free action"',
  'Quicken Spell':
    'Section=magic Note="Free action casting 1/rd uses +4 spell slot"',
  'Quivering Palm':
    'Section=combat Note="Struck foe dies 1/dy (DC %V Fort neg)"',
  'Rage':'Section=combat Note="+4 Str, +4 Con, +2 Will, -2 AC %V rd/8 hr rest"',
  'Rapid Reload (Hand)':
    'Section=combat Note="Reload Hand Crossbow as free action"',
  'Rapid Reload (Heavy)':
    'Section=combat Note="Reload Heavy Crossbow as move action"',
  'Rapid Reload (Light)':
    'Section=combat Note="Reload Light Crossbow as free action"',
  'Rapid Shot':'Section=combat Note="Normal and extra ranged -2 attacks"',
  'Remove Disease':'Section=magic Note="<i>Remove Disease</i> %V/week"',
  'Resist Enchantment':'Section=save Note="+2 vs. enchantment"',
  'Resist Fear':'Section=save Note="+2 vs. fear"',
  'Resist Illusion':'Section=save Note="+2 vs. illusions"',
  "Resist Nature's Lure":'Section=save Note="+4 vs. spells of feys"',
  'Ride-By Attack':'Section=combat Note="Move before, after mounted attack"',
  'Run':
    'Section=ability,combat,skill ' +
    'Note="+1 Run Speed Multiplier",' +
         '"Retain dex bonus to AC while running",' +
         '"+4 Acrobatics (running jump)"',
  'School Opposition (Abjuration)':
    'Section=magic Note="Double cost to cast Abjuration spells"',
  'School Opposition (Conjuration)':
    'Section=magic Note="Double cost to cast Conjuration spells"',
  'School Opposition (Enchantment)':
    'Section=magic Note="Double cost to cast Enchantment spells"',
  'School Opposition (Evocation)':
    'Section=magic Note="Double cost to cast Evocation spells"',
  'School Opposition (Illusion)':
    'Section=magic Note="Double cost to cast Illusion spells"',
  'School Opposition (Necromancy)':
    'Section=magic Note="Double cost to cast Necromancy spells"',
  'School Opposition (Transmutation)':
    'Section=magic Note="Double cost to cast Transmutation spells"',
  'School Specialization (Abjuration)':
    'Section=magic,skill ' +
    'Note="Extra Abjuration spell/dy each spell level",' +
         '"+2 Spellcraft (Abjuration effects)"',
  'School Specialization (Conjuration)':
    'Section=magic,skill ' +
    'Note="Extra Conjuration spell/dy each spell level",' +
         '"+2 Spellcraft (Conjuration effects)"',
  'School Specialization (Divination)':
    'Section=magic,skill ' +
    'Note="Extra Divination spell/dy each spell level",' +
         '"+2 Spellcraft (Divination effects)"',
  'School Specialization (Enchantment)':
    'Section=magic,skill ' +
    'Note="Extra Enchantment spell/dy each spell level",' +
         '"+2 Spellcraft (Enchantment effects)"',
  'School Specialization (Evocation)':
    'Section=magic,skill ' +
    'Note="Extra Evocation spell/dy each spell level",' +
         '"+2 Spellcraft (Evocation effects)"',
  'School Specialization (Illusion)':
    'Section=magic,skill ' +
    'Note="Extra Illusion spell/dy each spell level",' +
         '"+2 Spellcraft (Illusion effects)"',
  'School Specialization (Necromancy)':
    'Section=magic,skill ' +
    'Note="Extra Necromancy spell/dy each spell level",' +
         '"+2 Spellcraft (Necromancy effects)"',
  'School Specialization (Transmutation)':
    'Section=magic,skill ' +
    'Note="Extra Transmutation spell/dy each spell level",' +
         '"+2 Spellcraft (Transmutation effects)"',
  'Scribe Scroll':'Section=magic Note="Create scroll of any known spell"',
  'Scry':'Section=companion Note="Master views companion 1/dy"',
  'Self-Sufficient':'Section=skill Note="+%V Heal/+%V Survival"',
  'Share Saving Throws':'Section=companion Note="+%1 Fort/+%2 Ref/+%3 Will"',
  'Share Spells':
    'Section=companion Note="Master share self spell w/companion w/in 5\'"',
  'Shot On The Run':'Section=combat Note="Move before, after ranged attack"',
  'Silent Spell':
    'Section=magic Note="Cast spell w/out speech uses +1 spell slot"',
  'Simple Somatics':
    'Section=magic Note="No arcane spell failure in light armor"',
  'Skill Mastery':
    'Section=skill Note="Take 10 despite distraction on %V chosen skills"',
  'Sleep Immunity':'Section=save Note="Immune <i>Sleep</i>"',
  'Slippery Mind':'Section=save Note="Second save vs. enchantment"',
  'Slow':'Section=ability Note="-10 Speed"',
  'Slow Fall':'Section=save Note="Subtract %V\' from falling damage distance"',
  'Small':
    'Section=ability,combat,skill ' +
    'Note="x0.75 Load Max",' +
         '"+1 AC/+1 Melee Attack/+1 Ranged Attack/-1 CMB/-1 CMD",' +
         '"+2 Fly/-4 Intimidate/+4 Stealth"',
  'Smite Evil':
    'Section=combat Note="+%V attack/+%1 damage/+%2 AC vs. evil foe %2/day"',
  'Snatch Arrows':'Section=combat Note="Catch ranged weapons"',
  'Sneak Attack':
    'Section=combat Note="Hit +%Vd6 HP when surprising or flanking"',
  'Speak With Like Animals':'Section=companion Note="Talk w/similar creatures"',
  'Speak With Master':
    'Section=companion Note="Talk w/master in secret language"',
  'Special Mount':'Section=feature Note="Magical mount w/special abilities"',
  'Spell Focus (Abjuration)':'Section=magic Note="+1 Spell DC (Abjuration)"',
  'Spell Focus (Conjuration)':'Section=magic Note="+1 Spell DC (Conjuration)"',
  'Spell Focus (Divination)':'Section=magic Note="+1 Spell DC (Divination)"',
  'Spell Focus (Enchantment)':'Section=magic Note="+1 Spell DC (Enhancement)"',
  'Spell Focus (Evocation)':'Section=magic Note="+1 Spell DC (Evocation)"',
  'Spell Focus (Illusion)':'Section=magic Note="+1 Spell DC (Illusion)"',
  'Spell Focus (Necromancy)':'Section=magic Note="+1 Spell DC (Necromancy)"',
  'Spell Focus (Transmutation)':
    'Section=magic Note="+1 Spell DC (Transmutation)"',
  'Spell Mastery':'Section=magic Note="Prepare %V spells w/out spellbook"',
  'Spell Penetration':
    'Section=magic Note="+2 checks to overcome spell resistance"',
  'Spirited Charge':
    'Section=combat Note="x2 damage (x3 lance) on mounted charge"',
  'Spontaneous Cleric Spell':
    'Section=magic ' +
    'Note="Cast <i>Cure</i> or <i>Inflict</i> in place of known spell"',
  'Spontaneous Druid Spell':
    'Section=magic ' +
    'Note="Cast <i>Summon Nature\'s Ally</i> in place of known spell"',
  'Spring Attack':'Section=combat Note="Move before, after melee attack"',
  'Stability':'Section=combat Note="+4 CMD vs. Bull Rush and Trip"',
  'Stealthy':'Section=skill Note="+%V Escape Artist/+%V Stealth"',
  'Still Mind':'Section=save Note="+2 vs. enchantment"',
  'Still Spell':
    'Section=magic Note="Cast spell w/out movement uses +1 spell slot"',
  'Stonecunning':
    'Section=skill Note="+2 Perception (stone), automatic check w/in 10\'"',
  'Stunning Fist':
    'Section=combat Note="Struck foe stunned %V/dy (DC %1 Fort neg)"',
  'Suggestion':
    'Section=magic ' +
    'Note="<i>Suggestion</i> to 1 fascinated creature (DC %V neg)"',
  'Swift Tracker':'Section=skill Note="Track at full speed"',
  'Thousand Faces':'Section=magic Note="<i>Alter Self</i> at will"',
  'Timeless Body':'Section=feature Note="No aging penalties"',
  'Tireless Rage':'Section=combat Note="Not fatigued after rage"',
  'Tongue Of The Sun And Moon':
    'Section=feature Note="Speak w/any living creature"',
  'Toughness':'Section=combat Note="+%V HP"',
  'Track':'Section=skill Note="+%V Survival to follow creatures\' trail"',
  'Trackless Step':'Section=feature Note="Untrackable outdoors"',
  'Trample':
    'Section=combat Note="Mounted overrun unavoidable, bonus hoof attack"',
  'Trap Sense':'Section=save Note="+%V Reflex and AC vs. traps"',
  'Trapfinding':
    'Section=skill Note="+%V Perception (traps)/+%V Disable Device (traps)"',
  'Turn Undead':
    'Section=combat ' +
    'Note="Channel energy to cause undead panic (DC %V Will neg)"',
  'Two-Weapon Defense':
    'Section=combat ' +
    'Note="+1 AC wielding two weapons (+2 fighting defensively)"',
  'Two-Weapon Fighting':
    'Section=combat Note="Reduce on-hand penalty by 2, off-hand by 6"',
  'Unarmored Speed Bonus':'Section=ability Note="+%V Speed"',
  'Uncanny Dodge':'Section=combat Note="Always adds Dex modifier to AC"',
  'Venom Immunity':'Section=save Note="Immune to poisons"',
  'Weapon Finesse':
    'Section=combat ' +
    'Note="+%V light melee weapon attack (dex instead of str)"',
  'Whirlwind Attack':'Section=combat Note="Attack all foes in reach"',
  'Wholeness Of Body':'Section=magic Note="Use 2 ki to heal %V HP to self"',
  'Widen Spell':'Section=magic Note="x2 area of affect uses +3 spell slot"',
  'Wild Empathy':'Section=skill Note="+%V Diplomacy (animals)"',
  'Wild Shape':
    'Section=magic Note="Change into creature of size %V %1 hr %2/dy"',
  'Woodland Stride':
    'Section=feature Note="Normal movement through undergrowth"',

  // New features
  'A Sure Thing':'Section=combat Note="+2 attack vs. evil 1/day"',
  'Aberrant Form':
    'Section=combat,feature ' +
    'Note="Immune critical hit and sneak attack, DR 5/-",' +
         '"Blindsight 60\'"',
  'Acid Dart':'Section=magic Note="R30\' touch 1d6+%1 HP %V/day"',
  'Acid Resistance':'Section=save Note="%V"',
  'Acidic Ray':'Section=magic Note="R30\' %Vd6 HP %1/day"',
  'Acrobatic Steps':
    'Section=ability Note="Move through difficult terrain 20\'/rd"',
  'Adaptability':'Section=feature Note="+1 General Feat (Skill Focus)"',
  'Added Summonings':
    'Section=magic ' +
    'Note="<i>Summon Monster</i> brings additional demon or fiendish creature"',
  'Addling Touch':
    'Section=magic Note="Touch attack dazes %V HD foe 1 rd %1/day"',
  'Adopted':'Section=feature Note="Family race traits available"',
  'Agile Feet':
    'Section=feature Note="Unaffected by difficult terrain 1 rd %V/day"',
  'Agile Maneuvers':'Section=combat Note="+%V CMB"',
  'Aid Allies':'Section=combat Note="+1 aid another action"',
  'Alien Resistance':'Section=save Note="%V spell resistance"',
  'Alignment Channel (Chaos)':
    'Section=combat Note="Channel Energy to heal or harm Chaos outsiders"',
  'Alignment Channel (Evil)':
    'Section=combat Note="Channel Energy to heal or harm Evil outsiders"',
  'Alignment Channel (Good)':
    'Section=combat Note="Channel Energy to heal or harm Good outsiders"',
  'Alignment Channel (Law)':
    'Section=combat Note="Channel Energy to heal or harm Law outsiders"',
  'Anatomist':'Section=combat Note="+1 critical hit rolls"',
  'Ancient Historian':
    'Section=skill ' +
    'Note="+1 Choice of Knowledge (History), Linguistics/choice is a class skill, learn 1 ancient language"',
  'Animal Friend':
    'Section=save,skill ' +
    'Note="+1 Will when unhostile animal w/in 30\'",' +
         '"Handle Animal is a class skill"',
  'Animal Fury':'Section=combat Note="Bite attack %V+%1 during rage"',
  'Apothecary':'Section=feature Note="Has reliable poisons source"',
  'Arcane Apotheosis':
    'Section=magic Note="Expend 3 spell slots to power 1 magic item charge"',
  'Arcane Archivist':
    'Section=skill ' +
    'Note="+1 Use Magic Device/Use Magic Device is a class skill"',
  'Arcane Armor Mastery':
    'Section=magic Note="Reduce armored casting penalty 10%"',
  'Arcane Armor Training':
    'Section=magic Note="Reduce armored casting penalty 10%"',
  'Arcane Strike':
    'Section=combat Note="Imbue weapons with +%V magic damage bonus 1 rd"',
  'Armor Expert':'Section=skill Note="-1 armor skill check penalty"',
  'Armor Mastery':'Section=combat Note="DR 5/- when using armor or shield"',
  'Armor Training':
    'Section=ability,combat,skill ' +
    'Note="No speed penalty in %V armor",' +
         '"Additional +%V Dex AC bonus",' +
         '"Reduce armor skill check penalty by %V"',
  "Artificer's Touch":
    'Section=combat,magic ' +
    'Note="Touch attack on objects/constructs 1d6+%1 HP %V/day",' +
         '"<i>Mending</i> at will"',
  'Ascension':
    'Section=magic,save ' +
    'Note="<i>Tongues</i> at will",' +
         '"Immune petrification, 10 electricity/fire, +4 poison"',
  'Attuned To The Ancestors':
    'Section=magic Note="<i>Hide From Undead</i> %V rd 1/day"',
  'Aura Of Despair':
    'Section=magic ' +
    'Note="R30\' Foes -2 ability, attack, damage, save, and skill %V rd/day"',
  'Aura Of Justice':'Section=combat Note="R10\' Grant Smite Evil to allies"',
  'Aura Of Madness':'Section=magic Note="30\' <i>Confusion</i> aura %V rd/day"',
  'Aura Of Protection':
    'Section=magic ' +
    'Note="Allies w/in 30\' +%V AC, %1 elements resistance %2 rd/day"',
  'Aura Of Resolve':'Section=save Note="Immune charm, +4 to allies w/in 30\'"',
  'Aura Of Righteousness':
    'Section=combat,save ' +
    'Note="DR %V/evil",' +
         '"Immune compulsion, +4 to allies w/in 30\'"',
  'Bad Reputation':
    'Section=skill Note="+2 Intimidate/Intimidate is a class skill"',
  'Balanced Offensive':
    'Section=combat Note="Cleric-like elemental attack %V/day"',
  'Bardic Performance':
    'Section=feature Note="Bardic Performance effect %V rd/day"',
  'Battle Rage':
    'Section=combat Note="Touch imparts +%V damage bonus 1 rd %1/day"',
  'Beastspeaker':
    'Section=skill ' +
    'Note="+1 Diplomacy (animals), no penalty w/elemental animals"',
  'Beneficient Touch':'Section=magic Note="Reroll healing spell 1s 1/day"',
  'Birthmark':'Section=save Note="+2 vs. charm, compulsion"',
  'Bit Of Luck':'Section=magic Note="Touch imparts reroll d20 next rd %V/day"',
  'Bitter Nobleman':
    'Section=skill ' +
    'Note="+1 choice of Bluff, Sleight Of Hand, Stealth/choice is a class skill"',
  'Blast Rune':
    'Section=magic ' +
    'Note="Rune in adjacent square causes 1d6+%1 HP %V rd %2/day"',
  'Bleeding Attack':
    'Section=combat Note="Sneak attack causes extra %V HP/rd until healed"',
  'Bleeding Critical':
    'Section=combat Note="Critical hit causes 2d6 HP/rd until healed (DC 15)"',
  'Bleeding Touch':
    'Section=combat ' +
    'Note="Touch attack causes 1d6 HP/rd %V rd or until healed (DC 15) %1/day"',
  'Blinding Critical':
    'Section=combat ' +
    'Note="Critical hit causes permanent blindness (DC %V Fort dazzled 1d4 rd)"',
  'Blinding Ray':'Section=magic Note="Ranged touch blinds/dazzles 1 rd %V/day"',
  'Blindsense':
    'Section=feature ' +
    'Note="R%V\' Other senses allow detection of unseen objects"',
  'Bloodline Aberrant':'Section=magic Note="Polymorph spells last 50% longer"',
  'Bloodline Abyssal':'Section=magic Note="Summoned creatures gain DR %V/good"',
  'Bloodline Arcane':'Section=magic Note="+1 boosted spell DC"',
  'Bloodline Celestial':
    'Section=magic Note="Summoned creatures gain DR %V/evil"',
  'Bloodline Destined':
    'Section=save ' +
    'Note="+spell level on saves 1 rd after casting personal spell"',
  'Bloodline Draconic':'Section=magic Note="+1 damage/die on %V spells"',
  'Bloodline Elemental':'Section=magic Note="Change spell energy type to %V"',
  'Bloodline Fey':'Section=magic Note="+2 compulsion spell DC"',
  'Bloodline Infernal':'Section=magic Note="+2 charm spell DC"',
  'Bloodline Undead':'Section=magic Note="Affect corporeal undead as humanoid"',
  'Bonded Object':'Section=magic Note="Cast known spell through object"',
  'Bonus Feat':'Section=feature Note="+1 General Feat"',
  'Bramble Armor':
    'Section=combat ' +
    'Note="Thorny hide causes 1d6+%1 HP to striking foes %V/day"',
  'Bravery':'Section=save Note="+%V vs. fear"',
  'Breath Weapon':'Section=combat Note="%1 %2 %3d6 HP (%4 DC Ref half) %V/day"',
  'Brute':'Section=skill Note="+1 Intimidate/Intimidate is a class skill"',
  'Bullied':'Section=combat Note="+1 unarmed AOO attack"',
  'Bully':'Section=skill Note="+1 Intimidate/Intimidate is a class skill"',
  'Calming Touch':
    'Section=magic ' +
    'Note="Touch heals 1d6+%1 HP, removes fatigued, shaken, and sickened %V/day"',
  'Canter':
    'Section=skill ' +
    'Note="+5 Bluff (secret message)/+5 Sense Motive (secret message)"',
  "Captain's Blade":
    'Section=skill ' +
    'Note="+1 Acrobatics, Climb when on ship/choice is a class skill"',
  'Caretaker':'Section=skill Note="+1 Heal/Heal is a class skill"',
  'Catch Off-Guard':
    'Section=combat ' +
    'Note="No penalty for improvised weapon, unarmed opponents flat-footed"',
  'Celestial Resistances':'Section=save Note="%V acid/cold"',
  'Change Shape':
    'Section=magic ' +
    'Note="<i>Beast Shape %1</i>/<i>Elemental Body %2</i> %V rd/day"',
  'Channel Energy':
    'Section=magic ' +
    'Note="Heal or inflict %Vd6 HP 30\' radius (DC %1 Will half) %2/day"',
  'Channel Smite':
    'Section=combat Note="Channel energy into weapon strike as swift action"',
  'Chaos Blade':
    'Section=combat Note="Add <i>anarchic</i> to weapon %1 rd %V/day"',
  'Charming Smile':'Section=magic Note="DC %V <i>Charm Person</i> %1 rd/day"',
  'Charming':
    'Section=magic,skill ' +
    'Note="+1 spell DC w/attracted creatures",' +
         '"+1 Bluff, Diplomacy w/attracted creatures"',
  'Child Of Nature':
    'Section=skill ' +
    'Note="+1 Knowledge (Nature)/+1 Survival (finding food and water)/choice is a class skill"',
  'Child Of The Streets':
    'Section=skill Note="+1 Sleight Of Hand/Sleight Of Hand is a class skill"',
  'Child Of The Temple':
    'Section=skill ' +
    'Note="+1 Knowledge (Nobility)/+1 Knowledge (Religion)/choice is a class skill"',
  'Clasically Schooled':
    'Section=skill Note="+1 Spellcraft/Spellcraft is a class skill"',
  'Claws':'Section=combat Note="%V+%1 HP %2 rd/day"',
  'Clear Mind':'Section=save Note="Reroll Will save 1/rage"',
  'Cold Resistance':'Section=save Note="%V"',
  'Combat Trick':'Section=feature Note="+1 Fighter Feat"',
  'Command Undead':
    'Section=combat Note="R30\' Control undead (%V DC Will neg)"',
  'Companion Bond':
    'Section=combat Note="Half favored enemy bonus to allies w/in 30\' %V rd"',
  'Comparative Religion':
    'Section=skill ' +
    'Note="+1 Knowledge (Religion)/Knowledge (Religion) is a class skill"',
  'Condition Fist':
    'Section=combat Note="Stunning Fist may instead make target %V"',
  'Conjured Dart':'Section=magic Note="Ranged touch 1d6+%1 HP %V/day"',
  'Conviction':
    'Section=feature Note="Reroll ability, attack, skill, or save 1/day"',
  'Copycat':'Section=magic Note="<i>Mirror Image</i> %V rd %1/day"',
  'Corrupting Touch':'Section=magic Note="Touch causes shaken %V rd %1/day"',
  'Courageous':'Section=save Note="+2 vs. fear"',
  'Critical Focus':'Section=combat Note="+4 attack on critical hits"',
  'Critical Mastery':'Section=combat Note="Apply two effects to critical hits"',
  'Dancing Weapons':
    'Section=combat Note="Add <i>dancing</i> to weapon 4 rd %V/day"',
  'Dangerously Curious':
    'Section=skill ' +
    'Note="+1 Use Magic Device/Use Magic Device is a class skill"',
  'Dazing Touch':
    'Section=magic Note="Touch attack dazes %V HD foe 1 rd %1/day"',
  'Dazzling Display':
    'Section=combat ' +
    'Note="R30\' Intimidate to demoralize foes using focused weapon"',
  'Deadly Aim':'Section=combat Note="-%V attack/+%1 damage on ranged attacks"',
  'Deadly Performance':'Section=magic Note="Target killed (DC %V Will neg)"',
  'Deadly Stroke':
    'Section=combat ' +
    'Note="x2 damage and 1 point Con bleed against stunned or flat-footed foe"',
  'Deafening Critical':
    'Section=combat ' +
    'Note="Critical hit causes permanent deafness (DC %V Fort 1 rd)"',
  "Death's Embrace":'Section=combat Note="Healed by channeled negative energy"',
  "Death's Gift":'Section=save Note="%V cold/DR %1/- vs. non-lethal"',
  'Defensive Combat Training':'Section=combat Note="+%V CMD"',
  'Defensive Training':'Section=combat Note="+4 AC vs. giant creatures"',
  'Deft Dodger':'Section=save Note="+1 Reflex"',
  'Demon Hunter':
    'Section=skill,save ' +
    'Note="+3 Knowledge (Planes) wrt demons",' +
         '"+2 Will vs. demonic mental spells and effects"',
  'Demon Resistances':'Section=save Note="%V electricity/%1 poison"',
  'Demonic Might':
    'Section=feature,save Note="Telepathy 60\'","10 acid, cold, and fire"',
  'Dervish':'Section=combat Note="+1 AC vs. move AOO"',
  'Desert Child':'Section=save Note="+4 heat stamina, +1 vs. fire effects"',
  'Desert Shadow':'Section=skill Note="Full speed Stealth in desert"',
  'Destiny Realized':
    'Section=combat,magic ' +
    'Note="Critical hits confirmed, foe critical requires 20",' +
         '"Automatically overcome resistance 1/day"',
  'Destructive Aura':
    'Section=combat ' +
    'Note="R30\' Attacks +%V damage and critical confirmed %1 rd/day"',
  'Destructive Smite':'Section=combat Note="+%V damage %1/day"',
  "Devil's Mark":
    'Section=skill ' +
    'Note="+2 Bluff, Diplomacy, Intimidate, Sense Motive with evil outsiders"',
  'Devotee Of The Green':
    'Section=skill ' +
    'Note="+1 Knowledge (Geography)/+1 Knowledge (Nature)/choice is a class skill"',
  'Dimensional Hop':'Section=magic Note="Teleport up to %V\'/day"',
  'Dimensional Steps':'Section=magic Note="Teleport up to %V\'/day"',
  'Dirge Of Doom':
    'Section=magic Note="R30\' Creatures shaken while performing"',
  'Dirty Fighter':'Section=combat Note="+1 damage when flanking"',
  'Dispelling Attack':
    'Section=magic Note="Sneak attack acts as <i>Dispel Magic</i> on target"',
  'Dispelling Touch':
    'Section=magic Note="<i>Dispel Magic</i> touch attack %V/day"',
  'Disruptive':'Section=combat Note="+4 foe defensive spell DC"',
  'Distraction':
    'Section=magic Note="R30\' Perform check vs. visual magic 10 rd"',
  'Divine Courtesan':
    'Section=skill ' +
    'Note="+1 Diplomacy (gather information)/+1 Sense Motive/choice is a class skill"',
  'Divine Mount':'Section=feature Note="Magically summon mount %V/day"',
  'Divine Presence':
    'Section=magic Note="R30\' Allies DC %V <i>Sanctuary</i> %1 rd/day"',
  'Divine Warrior':'Section=magic Note="Enspelled weapons +1 damage"',
  'Divine Weapon':
    'Section=combat Note="Add %V enhancements to weapon %1 minutes %2/day"',
  "Diviner's Fortune":
    'Section=magic ' +
    'Note="Touched creature +%V attack, skill, ability, and save 1 rd %1/day"',
  'Double Slice':
    'Section=combat Note="Add full Str modifier to off-hand damage"',
  'Dragon Resistances':'Section=save Note="%V vs. %1"',
  'Dune Walker':
    'Section=ability,save ' +
    'Note="Normal movement through sand",' +
         '"+4 Fort vs. heat"',
  'Ear For Music':
    'Section=skill Note="+1 Perform choice/+2 Knowledge (Local) (art, music)"',
  'Ease Of Faith':
    'Section=skill Note="+1 Diplomacy/Diplomacy is a class skill"',
  'Eastern Mysteries':'Section=magic Note="+2 spell DC 1/day"',
  'Electricity Resistance':'Section=save Note="%V"',
  'Elemental Blast':
    'Section=combat ' +
    'Note="R60\' 20\' radius %Vd6 HP %3 (DC %1 Ref half) %2/day"',
  'Elemental Body':'Section=save Note="Immune %V"',
  'Elemental Channel (Air)':
    'Section=combat Note="Channel energy to heal or harm Air outsiders"',
  'Elemental Channel (Earth)':
    'Section=combat Note="Channel energy to heal or harm Air outsiders"',
  'Elemental Channel (Fire)':
    'Section=combat Note="Channel energy to heal or harm Air outsiders"',
  'Elemental Channel (Water)':
    'Section=combat Note="Channel energy to heal or harm Air outsiders"',
  'Elemental Movement':'Section=ability Note="%V"',
  'Elemental Ray':'Section=magic Note="R30\' 1d6+%1 HP %2 %V/day"',
  'Elemental Resistance':'Section=save Note="%V vs. %1"',
  'Elemental Wall':
    'Section=magic ' +
    'Note="<i>Wall Of Fire</i>/<i>Acid</i>/<i>Cold</i>/<i>Electricity</i> %V rd/day"',
  'Elf Blood':'Section=feature Note="Elf and human for racial effects"',
  'Elven Magic':
    'Section=magic,skill ' +
    'Note="+2 vs. spell resistance",' +
         '"+2 Spellcraft (identify magic item properties)"',
  'Elven Reflexes':'Section=combat Note="+2 Initiative"',
  'Enchanting Smile':
    'Section=skill Note="+%V Bluff/+%V Diplomacy/+%V Intimidate"',
  'Enchantment Reflection':
    'Section=save Note="Successful save reflects enchantment spells on caster"',
  'Energy Absorption':'Section=save Note="Ignore %V HP energy/day"',
  'Energy Resistance':'Section=save Note="%V chosen energy type"',
  'Exhausting Critical':
    'Section=combat Note="Critical hit causes foe exhaustion"',
  'Exile':'Section=combat Note="+2 Initiative"',
  'Expert Duelist':'Section=combat Note="+1 AC/+1 CMD"',
  'Explorer':'Section=skill Note="+1 Survival/Survival is a class skill"',
  'Extended Illusions':'Section=magic Note="Illusion duration increased %V rd"',
  'Extra Channel':'Section=magic Note="Channel energy +2/day"',
  'Extra Ki':'Section=feature Note="+2 Ki pool"',
  'Extra Lay On Hands':'Section=magic Note="Lay On Hands +2/day"',
  'Extra Mercy':'Section=magic Note="Lay On Hands gives Mercy effect"',
  'Extra Performance':
    'Section=feature Note="Use Barding Performance extra 6 rd/day"',
  'Extra Rage':'Section=feature Note="Rage extra 6 rd/day"',
  'Eyes And Ears Of The City':
    'Section=skill Note="+1 Perception/Perception is a class skill"',
  'Eyes Of Darkness':
    'Section=feature Note="Normal vision in any lighting %V rd/day"',
  'Faction Freedom Fighter':
    'Section=combat,skill Note="+1 surprise attack","+1 Stealth"',
  'Failed Apprentice':'Section=save Note="+1 vs. arcane spells"',
  'Familiar Monkey':'Section=skill Note="+3 Acrobatics"',
  'Fashionable':
    'Section=skill ' +
    'Note="+1 Bluff, Diplomacy, Sense Motive when well-dressed/choice is a class skill"',
  'Fast Stealth':'Section=skill Note="Use Stealth at full speed"',
  'Fast-Talker':'Section=skill Note="+1 Bluff/Bluff is a class skill"',
  'Fated':'Section=save Note="+%V saves when surprised"',
  'Favored Terrain':
    'Section=combat,skill ' +
    'Note="+2 Initiative in %V terrain type(s)",' +
         '"+2 Knowledge (Geography), Perception, Stealth, Survival, leaves no trail in %V terrain type(s)"',
  'Fearless Rage':
    'Section=save Note="Cannot be shaken or frightened during rage"',
  'Fencer':'Section=combat Note="+1 attack on AOO with blades"',
  'Fey Magic':'Section=magic Note="Reroll any resistance check"',
  'Fiendish Presence':
    'Section=skill Note="+1 Diplomacy/+1 Sense Motive/choice is a class skill"',
  'Fire Bolt':'Section=combat Note="R30\' touch 1d6+%1 HP %V/day"',
  'Fire Resistance':'Section=save Note="%V"',
  'Fires Of Hell':'Section=combat Note="Flaming blade +1 damage %V rd 1/day"',
  'Flame Of The Dawn Flower':
    'Section=combat Note="+2 scimitar critical damage"',
  'Fleet':'Section=ability Note="+5 Speed in light or no armor"',
  'Fleeting Glance':
    'Section=magic Note="<i>Greater Invisibility</i> %V rd/day"',
  'Focused Mind':'Section=magic Note="+2 concentration checks"',
  'Force For Good':
    'Section=magic Note="+1 caster level on good-aligned spells"',
  'Force Missile':'Section=magic Note="<i>Magic Missile</i> 1d4+%V HP %1/day"',
  'Forewarned':
    'Section=combat Note="+%V initiative, always act in surprise round"',
  'Forlorn':'Section=save Note="+1 Fortitude"',
  'Fortified Drinker':
    'Section=save Note="+2 vs. mental effect 1 hr after drinking"',
  'Fortified':
    'Section=combat ' +
    'Note="20% chance to negate critical hit or sneak attack 1/day"',
  'Freedom Fighter':
    'Section=combat,skill ' +
    'Note="+1 attack during escape",' +
         '"+1 skills during escape/Escape Artist is a class skill"',
  "Freedom's Call":
    'Section=magic ' +
    'Note="R30\' Allies unaffected by movement conditions %V rd/day"',
  'Frightening Tune':
    'Section=magic Note="R30\' DC %V Will <i>Cause Fear</i> via performance"',
  'Gentle Rest':'Section=magic Note="Touch staggers %1 rd %V/day"',
  'Gifted Adept':'Section=magic Note="+1 caster level on chosen spell"',
  'Gnome Magic':'Section=magic Note="+1 DC on Illusion spells"',
  'Gold Finger':
    'Section=skill ' +
    'Note="+1 Disable Device/+1 Sleight Of Hand/choice is a class skill"',
  'Goldsniffer':'Section=skill Note="+2 Perception (metals, jewels, gems)"',
  "Gorgon's Fist":
    'Section=combat ' +
    'Note="Unarmed attack vs. slowed foe staggers (DC %V ford neg)"',
  'Grasp Of The Dead':
    'Section=magic ' +
    'Note="R60\' Skeletal arms claw 20\' radius %Vd6 HP (DC %1 Ref half) %2/day"',
  'Grave Touch':
    'Section=magic Note="Touch causes shaken/frightened %V rd %1/day"',
  'Greasy Palm':'Section=feature Note="10% discount on bribes"',
  'Greater Bull Rush':
    'Section=combat Note="+2 Bull Rush checks, AOO on Bull Rushed foes"',
  'Greater Disarm':
    'Section=combat Note="+2 disarm checks, disarmed weapons land 15\' away"',
  'Greater Feint':'Section=combat Note="Feinted foe loses Dex bonus 1 rd"',
  'Greater Grapple':
    'Section=combat Note="+2 grapple checks, grapple is move action"',
  'Greater Overrun':
    'Section=combat Note="+2 overrun checks, AOO on overrun foes"',
  'Greater Penetrating Strike':
    'Section=combat Note="Focused weapons ignore DR 5/- or DR 10/anything"',
  'Greater Shield Focus':'Section=combat Note="+1 AC"', // No change to CMD
  'Greater Sunder':
    'Section=combat Note="+2 sunder checks, foe takes excess damage"',
  'Greater Trip':'Section=combat Note="+2 trip checks, AOO on tripped foes"',
  'Greater Vital Strike':'Section=combat Note="4x base damage"',
  'Greed':'Section=skill Note="+2 Appraise (precious metals, gems)"',
  'Guarded Stance':'Section=combat Note="+%V AC during rage"',
  'Guardian Of The Forge':
    'Section=skill ' +
    'Note="+1 Knowledge (Engineering)/+1 Knowledge (History)/choice is a class skill"',
  'Half-Elf Ability Adjustment':'Section=ability Note="+2 any"',
  'Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Charisma/-2 Strength"',
  'Hand Of The Acolyte':'Section=combat Note="R30\' +%V w/melee weapon %1/day"',
  'Hand Of The Apprentice':
    'Section=combat Note="R30\' +%V w/melee weapon %1/day"',
  'Hardy':'Section=save Note="+2 vs. poison and spells"',
  "Healer's Blessing":'Section=magic Note="%V% bonus on healed damage"',
  'Heavenly Fire':
    'Section=magic ' +
    'Note="R30\' Ranged touch heal good/harm evil 1d4+%V HP %1/day"',
  'Hedge Magician':'Section=magic Note="5% discount on magic craft cost"',
  'Hellfire':
    'Section=magic ' +
    'Note="R60\' 10\' radius %Vd6 HP (DC %1 Ref half), good target shaken %2 rd %3/dy"',
  'High Jump':'Section=skill Note="+%V Acrobatics (jump), use 1 ki for +20"',
  'Highlander':
    'Section=skill ' +
    'Note="+1 Stealth/+1 Stealth (hilly and rocky areas)/Stealth is a class skill"',
  'History Of Heresy':'Section=save Note="+1 vs. divine spells"',
  'Holy Champion':
    'Section=magic ' +
    'Note="Maximize lay on hands, smite evil DC %V <i>Banishment</i>"',
  'Holy Lance':'Section=combat Note="Add <i>holy</i> to weapon %1 rd %V/day"',
  'Horse Lord':'Section=skill Note="+2 Ride/Ride is a class skill"',
  'Human Ability Adjustment':'Section=ability Note="+2 any"',
  "Hunter's Eye":
    'Section=combat ' +
    'Note="No penalty for longbow or shortbow 2nd range increment/proficiency in choice"',
  'I Know A Guy':
    'Section=skill ' +
    'Note="+1 Knowledge (Local)/+2 Diplomacy (gather information)"',
  'Icicle':'Section=combat Note="R30\' touch 1d6+%1 HP %V/day"',
  'Impressive Presence':
    'Section=combat Note="Adjacent foes shaken 1 rd 1/day (DC %V Will neg)"',
  'Improved Channel':'Section=magic Note="+2 DC on channeled energy"',
  'Improved Claws':'Section=combat Note="Claws do additional 1d6 %V HP"',
  'Improved Great Fortitude':'Section=save Note="Reroll Fort 1/day"',
  'Improved Iron Will':'Section=save Note="Reroll Will 1/day"',
  'Improved Lightning Reflexes':'Section=save Note="Reroll Ref 1/day"',
  'Improved Vital Strike':'Section=combat Note="3x base damage"',
  'Improved Weapon Mastery':
    'Section=combat ' +
    'Note="No penalties for improvised weapons, improvised weapon damage +step, critical x2@19"',
  'Incorporeal Form':'Section=magic Note="Incorporeal %V rd 1/day"',
  'Indomitable Faith':'Section=save Note="+1 Will"',
  'Indomitable':'Section=save Note="+1 vs. enchantment"',
  'Infernal Resistances':'Section=save Note="%V fire/%1 poison"',
  'Influential':
    'Section=magic,skill ' +
    'Note="+1 DC on language-dependent spell 1/day",' +
         '"+3 Diplomacy (requests)"',
  'Insider Knowledge':
    'Section=skill ' +
    'Note="+1 choice of Diplomacy or Knowledge (Local)/choice is a class skill"',
  'Inspiring Word':
    'Section=magic ' +
    'Note="R30\' word imparts +2 attack, skill, ability, and save to target %V rd %1/day"',
  'Intense Spells':'Section=magic Note="+%V Evocation spell damage"',
  'Internal Fortitude':
    'Section=save Note="Cannot be sickened or nauseated during rage"',
  'Intimidating Glare':
    'Section=skill ' +
    'Note="Successful Intimidate during rage shakes foe at least 1d4 rd"',
  'Intimidating Prowess':'Section=skill Note="+%V Intimidate"',
  'Intimidating':'Section=skill Note="+2 Intimidate"',
  'Invisibility Field':
    'Section=magic Note="<i>Greater Invisibility</i> %V rd/day"',
  'It Was Meant To Be':
    'Section=feature ' +
    'Note="Reroll attack, critical, or spell resistance check %V/day"',
  'Jack Of All Trades':'Section=skill Note="Use any skill untrained"',
  'Ki Dodge':'Section=combat Note="Use 1 ki for +4 AC"',
  'Ki Pool':'Section=feature Note="%V points refills w/8 hours rest"',
  'Ki Speed':'Section=ability Note="Use 1 ki for +20 Speed"',
  'Killer':'Section=combat Note="Extra damage on critical hit"',
  'Knockback':'Section=combat Note="Successful Bull Rush during rage %V HP"',
  'Laughing Touch':'Section=magic Note="Touch causes 1 rd of laughter %V/day"',
  'Ledge Walker':
    'Section=skill Note="Use Acrobatics along narrow surfaces at full speed"',
  'Liberation':'Section=magic Note="Ignore movement impediments %V rd/day"',
  'Librarian':
    'Section=skill ' +
    'Note="+1 Linguistics/+1 Profession (Librarian)/choice is a class skill/+1 reading bonus 1/day"',
  'Life Sight':'Section=feature Note="%V blindsight for living or undead"',
  'Lightning Arc':'Section=combat Note="R30\' touch 1d6+%1 HP %V/day"',
  'Lightning Lord':'Section=magic Note="<i>Call Lightning</i> %V bolts/day"',
  'Lightning Stance':
    'Section=combat Note="50% concealment with 2 move or withdraw actions"',
  'Log Roller':'Section=combat,skill Note="+1 CMD vs. Trip","+1 Acrobatics"',
  'Long Limbs':'Section=combat Note="+%V\' touch attack range"',
  'Lore Keeper':
    'Section=skill Note="Touch attack provides info as per %V Knowledge check"',
  'Lore Master':
    'Section=skill ' +
    'Note="Take 10 on any ranked Knowledge skill, take 20 %V/day"',
  'Lore Seeker':
    'Section=magic,skill ' +
    'Note="+1 caster level on 3 spells",' +
         '"+1 Knowledge (Arcana)/Knowledge (Arcana) is a class skill"',
  'Loyalty':'Section=save Note="+1 vs. enchantment"',
  'Lunge':'Section=combat Note="-2 AC to increase melee range 5\'"',
  'Magic Claws':'Section=combat Note="Claws are magical weapon"',
  'Magic Is Life':
    'Section=save ' +
    'Note="+2 vs. death effects when enspelled, stabilize automatically"',
  'Magical Knack':'Section=magic Note="+2 caster level (max %V)"',
  'Magical Lineage':
    'Section=magic Note="-1 spell level for chosen spell metamagic"',
  'Magical Talent':'Section=magic Note="Use chosen cantrip 1/dy"',
  'Major Magic':'Section=magic Note="Cast W1 spell 2/day"',
  'Maneuver Training':'Section=combat Note="+%V CMB"',
  'Master Craftsman (Craft (Armor))':
    'Section=feature,skill ' +
    'Note="Use Craft (Armor) with Craft Magic Arms And Armor, Craft Wondrous Item",' +
         '"+2 Craft (Armor)"',
  'Master Craftsman (Profession (Tanner))':
    'Section=feature,skill ' +
    'Note="Use Profession (Tanner) with Craft Magic Arms And Armor, Craft Wondrous Item",' +
         '"+2 Profession (Tanner)"',
  'Master Hunter':
    'Section=combat ' +
    'Note="Full attack vs. favored enemy kills (DC %V Fort neg)"',
  'Master Of Pentacles':
    'Section=magic Note="+2 Conjuration spell caster level 1/dy"',
  'Master Strike':
    'Section=combat ' +
    'Note="Sneak attack causes choice of sleep, paralysis, or death (DC %V Fort neg)"',
  "Master's Illusion":
    'Section=magic Note="DC %V 30\' radius <i>Veil</i> %1 rd/day"',
  'Mathematical Prodigy':
    'Section=skill ' +
    'Note="+1 Knowledge (Arcana)/+1 Knowledge (Engineering)/choice is a class skill"',
  'Medic':
    'Section=magic,kill ' +
    'Note="+1 caster level with <i>Remove</i> healing",' +
         '"+2 Heal (disease, poison)"',
  "Medusa's Wrath":
    'Section=combat Note="2 extra unarmed attacks vs. diminished-capacity foe"',
  'Mercy':'Section=magic Note="Lay on hands removes additional effects"',
  'Meridian Strike':'Section=combat Note="Reroll crit damage 1s 1/day"',
  'Metamagic Adept':
    'Section=magic ' +
    'Note="Applying metamagic feat w/out increased casting time %V/day"',
  'Metamagic Mastery':'Section=magic Note="Apply metamagic feat %V/day"',
  'Meticulous Artisan':'Section=skill Note="+1 Craft for day job"',
  'Might Of The Gods':'Section=magic Note="+%V Str checks %1 rd/day"',
  'Mighty Swing':'Section=combat Note="Automatic critical 1/rage"',
  'Militia Veteran':
    'Section=skill ' +
    'Note="+1 choice of Profession (Soldier), Ride, Survival/choice is a class skill"',
  'Mind Over Matter':'Section=save Note="+1 Will"',
  'Minor Magic':'Section=magic Note="Cast W0 spell 3/day"',
  'Missionary':
    'Section=magic,skill ' +
    'Note="+1 caster level on 3 spells",' +
         '"+1 Knowledge (Religion)/Knowledge (Religion) is a class skill"',
  'Moment Of Clarity':'Section=combat Note="Rage effects suspended 1 rd"',
  'Multitalented':'Section=feature Note="Two favored classes"',
  'Mummy-Touched':'Section=save Note="+2 vs. curse and disease"',
  'Natural Armor':'Section=combat Note="+%V AC"', // No bonus to CMD
  'Natural Negotiator':
    'Section=feature,skill ' +
    'Note="Additional language",' +
         '"Choice of Diplomacy, Handle Animal is a class skill"',
  'Natural-Born Leader':
    'Section=feature,save ' +
    'Note="+1 Leadership score",' +
         '"+1 followers\' Will vs. mind-altering effects"',
  'Necromantic Touch':
    'Section=magic Note="Touch causes shaken or frightened %V rd %1/day"',
  'New Arcana':'Section=magic Note="%V additional spells"',
  'Night Vision':'Section=feature Note="60\' Darkvision during rage"',
  'Nimble Moves':
    'Section=ability ' +
    'Note="Move through difficult terrain 5\'/rd as though normal terrain"',
  'Nimbus Of Light':
    'Section=magic ' +
    'Note="30\' radius <i>Daylight</i> does %V HP to undead %1 rd/day"',
  'No Escape':'Section=combat Note="x2 speed 1/rage when foe withdraws"',
  'Noble Leadership':'Section=feature Note="+%V Leadership"',
  'Observant':
    'Section=skill ' +
    'Note="+1 choice of Perception, Sense Motive/choice is a class skill"',
  'Obsessive':'Section=skill Note="+2 choice of Craft or Profession"',
  'On Dark Wings':'Section=ability Note="Fly 60\'/average"',
  'One Of Us':
    'Section=combat,save ' +
    'Note="Ignored by unintelligent undead",' +
         '"Immune paralysis and sleep, +4 vs. undead\'s spells"',
  'Orc Blood':'Section=feature Note="Orc and human for racial effects"',
  'Orc Ferocity':'Section=combat Note="Fight 1 rd below zero HP"',
  'Outcast':'Section=skill Note="+1 Survival/Survival is a class skill"',
  'Patient Optimist':
    'Section=skill Note="+1 Diplomacy, 1 retry on unfriendly or hostile"',
  'Penetrating Spells':
    'Section=magic Note="Best of two rolls to overcome spell resistance"',
  'Penetrating Strike':
    'Section=combat Note="Focused weapons ignore DR 5/anything"',
  'Performance Artist':
    'Section=skill Note="+1 choice of Perform/choice is a class skill"',
  'Physical Enhancement':'Section=ability Note="+%V %1 of Str, Dex, and Con"',
  'Pinpoint Targeting':
    'Section=combat Note="Ranged attack ignores armor bonus"',
  'Planar Voyage':
    'Section=combat,save ' +
    'Note="+1 Initiative off PM plane",' +
         '"+1 saves off PM plane"',
  'Poverty-Stricken':
    'Section=skill Note="+1 Survival/Survival is a class skill"',
  'Power Of The Pit':
    'Section=feature,save Note="60\' Darkvision","Resistance 10 acid/cold"',
  'Power Of Wyrms':'Section=save Note="Immune paralysis and sleep"',
  'Power Over Undead':
    'Section=feature Note="+1 General Feat (Command Undead or Turn Undead)"',
  'Powerful Blow':'Section=combat Note="+%V HP 1/rage"',
  'Proper Training':
    'Section=skill ' +
    'Note="+1 choice of Knowledge (Geography), Knowledge (History)/choice is a class skill"',
  'Protective Ward':'Section=magic Note="+%V AC 10\' radius %1/day"',
  'Quarry':
    'Section=combat,skill ' +
    'Note="+%V attack, automatic critical vs. target",' +
         '"Take %V to track target"',
  'Quick Disable':'Section=skill Note="Disable Device in half normal time"',
  'Quick Reflexes':'Section=combat Note="+1 AOO/rd during rage"',
  'Raging Climber':'Section=skill Note="+%V Climb during rage"',
  'Raging Leaper':'Section=skill Note="+%V Acrobatics (jump) during rage"',
  'Raging Swimmer':'Section=skill Note="+%V Swim during rage"',
  'Rapscallion':'Section=combat,skill Note="+1 Initiative","+1 Escape Artist"',
  'Reactionary':'Section=combat Note="+2 Initiative"',
  'Rebuke Death':
    'Section=magic Note="Touch creature below 0 HP to heal 1d4+%1 HP %V/day"',
  'Remote Viewing':
    'Section=magic Note="<i>Clairaudience/Clairvoyance</i> %V rd/day"',
  'Renewed Vigor':'Section=magic Note="Heal %Vd8+%1 HP 1/day during rage"',
  'Resiliency':
    'Section=combat Note="1 minute of %V temporary HP when below 0 HP 1/day"',
  'Resilient':'Section=save Note="+1 Fortitude"',
  'Resistance Bonus':
    'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Resistant Touch':
    'Section=magic ' +
    'Note="Touch transfers resistance bonus to ally 1 minute %V/day"',
  'Reverent Wielder':
    'Section=combat,save ' +
    'Note="+1 disarm, steal, sunder CMD",' +
         '"Equipment +1 saves"',
  'Rich Parents':'Section=feature Note="Start w/900 GP"',
  'River Rat':
    'Section=combat,skill ' +
    'Note="+1 damage w/daggers",' +
         '"+1 Swim/Swim is a class skill"',
  'Rogue Crawl':'Section=ability Note="Crawl at half speed"',
  'Rogue Weapon Training':
    'Section=feature Note="+1 Fighter Feat (Weapon Focus)"',
  'Rolling Dodge':'Section=combat Note="+%V AC vs. ranged %1 rd during rage"',
  'Roused Anger':'Section=combat Note="Rage even if fatigued"',
  'Rousing Oratory':
    'Section=skill ' +
    'Note="Choice of Perform is a class skill/DC 15 gives allies w/in 60\' +1 or better vs. fear 5 min 1/day"',
  'Sacred Conduit':'Section=magic Note="+1 channeled energy save DC"',
  'Sacred Touch':'Section=magic Note="Touch stabilizes"',
  'Savanna Child':
    'Section=skill ' +
    'Note="+1 choice of Handle Animal, Knowledge (Nature), Ride/choice is a class skill"',
  'Scent':'Section=feature Note="Detect creatures via smell"',
  'Scholar Of Balance':
    'Section=skill ' +
    'Note="+1 Knowledge (Nature)/+1 Knowledge (Planes)/choice is a class skill"',
  'Scholar Of Ruins':
    'Section=skill ' +
    'Note="+1 Knowledge (Dungeoneering)/+1 Knowledge (Geography)/choice is a class skill"',
  'Scholar Of The Great Beyond':
    'Section=skill ' +
    'Note="+1 Knowledge (History)/+1 Knowledge (Planes)/choice is a class skill"',
  'School Power':'Section=magic Note="+2 DC on spells from chosen school"',
  'Scorpion Style':
    'Section=combat Note="Unarmed hit slows foe %V rd (DC %1 Fort neg)"',
  'Scrying Adept':
    'Section=magic ' +
    'Note="Constant <i>Detect Scrying</i>, +1 scrying subject familiarity"',
  'Scythe Of Evil':
    'Section=combat Note="Add <i>unholy</i> to weapon %1 rd %V/day"',
  'Secrets Of The Sphinx':
    'Section=skill ' +
    'Note="+2 Knowledge check 1/dy/choice of Knowledge is a class skill"',
  'Selective Channeling':'Section=magic Note="Avoid up to %V targets"',
  'Shadow Diplomat':
    'Section=skill Note="+1 Diplomacy/Diplomacy is a class skill"',
  'Shatter Defenses':
    'Section=combat Note="Fearful opponents flat-footed through next rd"',
  'Sheriff':
    'Section=skill Note="+10 local Bluff, Diplomacy, Intimidate 1/session"',
  'Shield Focus':'Section=combat Note="+1 AC"', // No change to CMD
  'Shield Master':
    'Section=combat ' +
    'Note="No penalty on shield attacks, apply shield enhancements to attack and damage"',
  'Shield Slam':'Section=combat Note="Shield Bash includes Bull Rush"',
  'Shiv':'Section=combat Note="+1 surprise piercing and slashing damage"',
  'Sickening Critical':
    'Section=combat Note="Critical hit causes foe sickening"',
  'Skeptic':'Section=save Note="+2 vs. illusions"',
  'Skilled':'Section=skill Note="+%V Skill Points"',
  'Slow Reactions':'Section=combat Note="Sneak attack target no AOO 1 rd"',
  'Smuggler':
    'Section=skill ' +
    'Note="+3 Sleight Of Hand (hide object)/Sleight Of Hand is a class skill"',
  'Soothing Performance':
    'Section=magic ' +
    'Note="R30\' <i>Mass Cure Serious Wounds</i> via performance"',
  'Soul Drinker':
    'Section=combat Note="Gain HP equal to slain foe\'s hit dice 1 min 1/day"',
  'Soul Of The Fey':
    'Section=combat,magic,save ' +
    'Note="Animals attack only if magically forced",' +
         '"<i>Shadow Walk</i> 1/day",' +
         '"Immune poison/DR 10/cold iron"',
  'Speak With Animals':
    'Section=magic Note="<i>Speak With Animals</i> %V rd/day"',
  'Spell Rune':'Section=magic Note="Add known spell to Blast Rune"',
  'Spellbreaker':'Section=combat Note="AOO on foe failed defensive casting"',
  'Staff Of Order':
    'Section=combat Note="Add <i>axiomatic</i> to weapon %1 rd %V/day"',
  'Staggering Critical':
    'Section=combat ' +
    'Note="Critical hit staggers for 1d4+1 rd (DC %V Fort negates)"',
  'Stand Still':'Section=combat Note="CMB check to halt foe movement"',
  'Stand Up':'Section=combat Note="Stand from prone as free action"',
  'Starchild':
    'Section=skill Note="+4 Survival (avoid becoming lost), know North"',
  'Steady':'Section=ability Note="No speed penalty in armor"',
  'Step Up':'Section=combat Note="Match foe 5\' step"',
  'Storm Burst':
    'Section=combat ' +
    'Note="R30\' Touch 1d6+%1 HP non-lethal and -2 attack %V/day"',
  'Storyteller':'Section=skill Note="+%V choice of Knowledge check 1/scenario"',
  'Strength Of The Abyss':'Section=ability Note="+%V Strength"',
  'Strength Rush':
    'Section=magic ' +
    'Note="Touch imparts +%V melee attack and Str check bonus %1/day"',
  'Strength Surge':
    'Section=combat Note="+%V Str or combat maneuver check 1/rage"',
  'Strike Back':'Section=combat Note="Attack attackers beyond reach"',
  'Stunning Critical':
    'Section=combat Note="Critical hit stuns 1d4 rd (DC %V Fort staggered)"',
  "Summoner's Charm":'Section=magic Note="Summon duration increased %V rd"',
  "Sun's Blessing":
    'Section=magic Note="+%V undead damage, negate channel resistance"',
  'Superstition':
    'Section=save ' +
    'Note="+%V vs. spells, supernatural, spell-like abilities during rage"',
  'Sure-Footed':'Section=skill Note="+2 Acrobatics/+2 Climb"',
  'Surprise Accuracy':'Section=combat Note="+%V attack 1/rage"',
  'Surprise Attack':
    'Section=combat Note="All foes flat-footed during surprise round"',
  'Suspicious':
    'Section=skill Note="+1 Sense Motive/Sense Motive is a class skill"',
  'Swift Foot':'Section=ability Note="+5 Speed during rage"',
  'Tavern Owner':'Section=feature Note="10% extra from treasure sale"',
  'Teaching Mistake':
    'Section=save Note="+1 save after nat 1 save roll 1/scenario"',
  'Telekinetic Fist':'Section=magic Note="Ranged touch 1d4+%1 HP %V/day"',
  'Terrifying Howl':
    'Section=combat Note="R30\' Howl causes shaken 1d4+1 rd (DC %V Will neg)"',
  'Throw Anything':
    'Section=combat ' +
    'Note="No penalty for improvised ranged weapon, +1 attack w/thrown splash"',
  'Tireless':
    'Section=ability,combat ' +
    'Note="+2 Con vs. nonlethal exertion and environment",' +
         '"+1 HP"',
  'Tiring Critical':'Section=combat Note="Critical hit tires foe"',
  'Tomb Raider':
    'Section=skill ' +
    'Note="+1 Knowledge (Dungeoneering)/+1 Perception/choice is a class skill"',
  'Touch Of Chaos':
    'Section=combat ' +
    'Note="Touch attack %V/day causes target to take worse result of d20 rerolls 1 rd"',
  'Touch Of Darkness':
    'Section=combat Note="Touch attack causes 20% miss chance %V rd %1/day"',
  'Touch Of Destiny':
    'Section=magic ' +
    'Note="Touched creature +%V attack, skill, ability, save 1 rd %1/day"',
  'Touch Of Evil':'Section=combat Note="Touch attack sickens %V rd %1/day"',
  'Touch Of Glory':
    'Section=magic Note="Touch imparts +%V Cha check bonus %1/day"',
  'Touch Of Good':
    'Section=magic ' +
    'Note="Touch imparts +%V attack, skill, ability, and save 1 rd %1/day"',
  'Touch Of Law':
    'Section=magic Note="Touched take 11 on all d20 rolls 1 rd %V/day"',
  'Trap Spotter':
    'Section=skill Note="Automatic Perception check w/in 10\' of trap"',
  'Travel Speed':'Section=ability Note="+10 Speed"',
  'Trouper':
    'Section=save,skill ' +
    'Note="+1 vs. Perform-related abilities",' +
         '"+1 choice of Perform"',
  'Tunnel Fighter':
    'Section=combat ' +
    'Note="+2 Initiative (underground)/+1 critical damage (underground)"',
  'Two-Weapon Rend':'Section=combat Note="Extra 1d10+%V HP from double hit"',
  'Undead Bane':'Section=magic Note="+2 DC on energy channeled to harm undead"',
  'Undead Slayer':'Section=combat Note="+1 damage vs. undead"',
  'Unexpected Strike':'Section=combat Note="AOO when foe enters threat 1/rage"',
  'Unflappable':
    'Section=save,skill Note="+1 vs. fear","+3 resist Intimidate DC"',
  'Unity':'Section=save Note="R30\' Allies use your saving throw %V/day"',
  'Unorthodox Strategy':
    'Section=skill Note="+2 Acrobatics (traverse threatened squares)"',
  'Unseat':
    'Section=combat Note="Bull Rush after lance hit to unseat mounted foe"',
  'Unusual Anatomy':
    'Section=combat Note="%V% chance to ignore critical hit and sneak attack"',
  'Upstanding':
    'Section=skill Note="+1 Diplomacy/+1 Sense Motive/choice is a class skill"',
  'Vagabond Child':
    'Section=skill ' +
    'Note="+1 choice of Disable Device, Escape Artist, Sleight Of Hand/choice is a class skill"',
  'Versatile Performance':
    'Section=skill Note="Substitute Perform ranking for associated skills"',
  'Veteran Of Battle':
    'Section=combat Note="+1 Initiative/Draw weapon during surprise round"',
  'Vindictive':'Section=combat Note="+1 damage vs. successful foe 1 min 1/day"',
  'Vision Of Madness':
    'Section=magic ' +
    'Note="Touch imparts +%V attack, save, or skill, -%1 others 3 rd %2/day"',
  'Vital Strike':'Section=combat Note="2x base damage"',
  'Ward Against Death':
    'Section=magic ' +
    'Note="R30\' Creatures immune to death effects, energy drain, and negative levels %V rd/day"',
  'Warrior Of Old':'Section=combat Note="+2 Initiative"',
  'Watchdog':
    'Section=skill Note="+1 Sense Motive/Sense Motive is a class skill"',
  'Weapon Master':'Section=combat Note="Use additional combat feat %V rd/day"',
  'Weapon Mastery':
    'Section=combat ' +
    'Note="Critical automatically hits, +1 damage multiplier, no disarm w/chosen weapon"',
  'Weapon Style':'Section=combat Note="Proficient with choice of monk weapon"',
  'Weapon Training':
    'Section=combat ' +
    'Note="Attack and damage bonus w/weapons from trained groups"',
  'Well-Informed':
    'Section=skill ' +
    'Note="+1 Diplomacy (gather information)/+1 Knowledge (Local)/choice is a class skill"',
  'Well-Versed':'Section=save Note="+4 vs. bardic effects"',
  'Whistleblower':
    'Section=skill Note="+1 Sense Motive/Sense Motive is a class skill"',
  'Wind Stance':'Section=combat Note="20% concealment when moving > 5\'"',
  'Wings Of Heaven':'Section=ability Note="Fly 60\'/good %V minutes/day"',
  'Wings':'Section=ability Note="Fly %V\'/average"',
  'Wisdom In The Flesh':
    'Section=skill ' +
    'Note="Use Wis modifier for chosen Str, Con, or Dex skill/choice is a class skill"',
  'Within Reach':'Section=save Note="DC 20 Will save vs. fatal attack 1/day"',
  'Wooden Fist':
    'Section=combat ' +
    'Note="+%V Unarmed damage and no AOO on Unarmed attacks %1 rd/day"',
  'World Traveler':
    'Section=skill ' +
    'Note="+1 choice of Diplomacy, Knowledge (Local), Sense Motive/choice is a class skill"'
};
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
  'Air Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Lightning Arc","6:Electricity Resistance" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Air1:Obscuring Mist",' +
      '"Air2:Wind Wall",' +
      '"Air3:Gaseous Form",' +
      '"Air4:Air Walk",' +
      '"Air5:Control Winds",' +
      '"Air6:Chain Lightning",' +
      '"Air7:Elemental Body IV",' +
      'Air8:Whirlwind,' +
      '"Air9:Elemental Swarm"',
  'Animal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Speak With Animals","4:Animal Companion" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Animal1:Calm Animals",' +
      '"Animal2:Hold Animal",' +
      '"Animal3:Dominate Animal",' +
      '"Animal4:Summon Nature\'s Ally IV",' +
      '"Animal5:Beast Shape III",' +
      '"Animal6:Antilife Shell",' +
      '"Animal7:Animal Shapes",' +
      '"Animal8:Summon Nature\'s Ally VIII",' +
      'Animal9:Shapechange',
  'Artifice Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Artificer\'s Touch","8:Dancing Weapons" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Artifice1:Animate Rope",' +
      '"Artifice2:Wood Shape",' +
      '"Artifice3:Stone Shape",' +
      '"Artifice4:Minor Creation",' +
      'Artifice5:Fabricate,' +
      '"Artifice6:Major Creation",' +
      '"Artifice7:Wall Of Iron",' +
      'Artifice8:Statue,' +
      '"Artifice9:Prismatic Sphere"',
  'Chaos Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Chaos","8:Chaos Blade" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Chaos1:Protection From Law",' +
      '"Chaos2:Align Weapon",' +
      '"Chaos3:Magic Circle Against Law",' +
      '"Chaos4:Chaos Hammer",' +
      '"Chaos5:Dispel Law",' +
      '"Chaos6:Animate Objects",' +
      '"Chaos7:Word Of Chaos",' +
      '"Chaos8:Cloak Of Chaos",' +
      '"Chaos9:Summon Monster IX"',
  'Charm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Addling Touch","8:Charming Smile" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Charm1:Charm Person",' +
      '"Charm2:Calm Emotions",' +
      'Charm3:Suggestion,' +
      'Charm4:Heroism,' +
      '"Charm5:Charm Monster",' +
      'Charm6:Geas/Quest,' +
      'Charm7:Insanity,' +
      'Charm8:Demand,' +
      '"Charm9:Dominate Monster"',
  'Community Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Calming Touch","8:Unity" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      'Community1:Bless,' +
      '"Community2:Shield Other",' +
      'Community3:Prayer,' +
      '"Community4:Imbue With Spell Ability",' +
      '"Community5:Telepathic Bond",' +
      '"Community6:Heroes\' Feast",' +
      'Community7:Refuge,' +
      '"Community8:Mass Cure Critical Wounds",' +
      'Community9:Miracle',
  'Darkness Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Blind-Fight","1:Touch Of Darkness","8:Eyes Of Darkness" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Darkness1:Obscuring Mist",' +
      'Darkness2:Blindness/Deafness,' +
      '"Darkness3:Deeper Darkness",' +
      '"Darkness4:Shadow Conjuration",' +
      '"Darkness5:Summon Monster V",' +
      '"Darkness6:Shadow Walk",' +
      '"Darkness7:Power Word Blind",' +
      '"Darkness8:Greater Shadow Evocation",' +
      'Darkness9:Shades',
  'Death Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Bleeding Touch","8:Death\'s Embrace" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Death1:Cause Fear",' +
      '"Death2:Death Knell",' +
      '"Death3:Animate Dead",' +
      '"Death4:Death Ward",' +
      '"Death5:Slay Living",' +
      '"Death6:Create Undead",' +
      'Death7:Destruction,' +
      '"Death8:Create Greater Undead",' +
      '"Death9:Wail Of The Banshee"',
  'Destruction Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Destructive Smite","8:Destructive Aura" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Destruction1:True Strike",' +
      'Destruction2:Shatter,' +
      'Destruction3:Rage,' +
      '"Destruction4:Inflict Critical Wounds",' +
      'Destruction5:Shout,' +
      'Destruction6:Harm,' +
      'Destruction7:Disintegrate,' +
      'Destruction8:Earthquake,' +
      'Destruction9:Implosion',
  'Earth Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Acid Dart","6:Acid Resistance" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Earth1:Magic Stone",' +
      '"Earth2:Soften Earth And Stone",' +
      '"Earth3:Stone Shape",' +
      '"Earth4:Spike Stones",' +
      '"Earth5:Wall Of Stone",' +
      'Earth6:Stoneskin,' +
      '"Earth7:Elemental Body IV",' +
      'Earth8:Earthquake,' +
      '"Earth9:Elemental Swarm"',
  'Evil Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Evil","8:Scythe Of Evil" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Evil1:Protection From Good",' +
      '"Evil2:Align Weapon",' +
      '"Evil3:Magic Circle Against Good",' +
      '"Evil4:Unholy Blight",' +
      '"Evil5:Dispel Good",' +
      '"Evil6:Create Undead",' +
      'Evil7:Blasphemy,' +
      '"Evil8:Unholy Aura",' +
      '"Evil9:Summon Monster IX"',
  'Fire Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Fire Bolt","6:Fire Resistance" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Fire1:Burning Hands",' +
      '"Fire2:Produce Flame",' +
      'Fire3:Fireball,' +
      '"Fire4:Wall Of Fire",' +
      '"Fire5:Fire Shield",' +
      '"Fire6:Fire Seeds",' +
      '"Fire7:Elemental Body IV",' +
      '"Fire8:Incendiary Cloud",' +
      '"Fire9:Elemental Swarm"',
  'Glory Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Undead Bane","1:Touch Of Glory","8:Divine Presence" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Glory1:Shield Of Faith",' +
      '"Glory2:Bless Weapon",' +
      '"Glory3:Searing Light",' +
      '"Glory4:Holy Smite",' +
      '"Glory5:Righteous Might",' +
      '"Glory6:Undeath To Death",' +
      '"Glory7:Holy Sword",' +
      '"Glory8:Holy Aura",' +
      'Glory9:Gate',
  'Good Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Good","8:Holy Lance" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Good1:Protection From Evil",' +
      '"Good2:Align Weapon",' +
      '"Good3:Magic Circle Against Evil",' +
      '"Good4:Holy Smite",' +
      '"Good5:Dispel Evil",' +
      '"Good6:Blade Barrier",' +
      '"Good7:Holy Word",' +
      '"Good8:Holy Aura",' +
      '"Good9:Summon Monster IX"',
  'Healing Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Rebuke Death","6:Healer\'s Blessing" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Healing1:Cure Light Wounds",' +
      '"Healing2:Cure Moderate Wounds",' +
      '"Healing3:Cure Serious Wounds",' +
      '"Healing4:Cure Critical Wounds",' +
      '"Healing5:Breath Of Life",' +
      'Healing6:Heal,' +
      'Healing7:Regenerate,' +
      '"Healing8:Mass Cure Critical Wounds",' +
      '"Healing9:Mass Heal"',
  'Knowledge Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Lore Keeper","6:Remote Viewing" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Knowledge1:Comprehend Languages",' +
      '"Knowledge2:Detect Thoughts",' +
      '"Knowledge3:Speak With Dead",' +
      'Knowledge4:Divination,' +
      '"Knowledge5:True Seeing",' +
      '"Knowledge6:Find The Path",' +
      '"Knowledge7:Legend Lore",' +
      '"Knowledge8:Discern Location",' +
      'Knowledge9:Foresight',
  'Law Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Law","8:Staff Of Order" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Law1:Protection From Chaos",' +
      '"Law2:Align Weapon",' +
      '"Law3:Magic Circle Against Chaos",' +
      '"Law4:Order\'s Wrath",' +
      '"Law5:Dispel Chaos",' +
      '"Law6:Hold Monster",' +
      'Law7:Dictum,' +
      '"Law8:Shield Of Law",' +
      '"Law9:Summon Monster IX"',
  'Liberation Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Liberation","8:Freedom\'s Call" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Liberation1:Remove Fear",' +
      '"Liberation2:Remove Paralysis",' +
      '"Liberation3:Remove Curse",' +
      '"Liberation4:Freedom Of Movement",' +
      '"Liberation5:Break Enchantment",' +
      '"Liberation6:Greater Dispel Magic",' +
      'Liberation7:Refuge,' +
      '"Liberation8:Mind Blank",' +
      'Liberation9:Freedom',
  'Luck Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Bit Of Luck","6:Good Fortune" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Luck1:True Strike",' +
      'Luck2:Aid,' +
      '"Luck3:Protection From Energy",' +
      '"Luck4:Freedom Of Movement",' +
      '"Luck5:Break Enchantment",' +
      'Luck6:Mislead,' +
      '"Luck7:Spell Turning",' +
      '"Luck8:Moment Of Prescience",' +
      'Luck9:Miracle',
  'Madness Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Vision Of Madness","8:Aura Of Madness" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Madness1:Lesser Confusion",' +
      '"Madness2:Touch Of Idiocy",' +
      'Madness3:Rage,' +
      'Madness4:Confusion,' +
      'Madness5:Nightmare,' +
      '"Madness6:Phantasmal Killer",' +
      'Madness7:Insanity,' +
      '"Madness8:Scintillating Pattern",' +
      'Madness9:Weird',
  'Magic Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Hand Of The Acolyte","8:Dispelling Touch" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      'Magic1:Identify,' +
      '"Magic2:Magic Mouth",' +
      '"Magic3:Dispel Magic",' +
      '"Magic4:Imbue With Spell Ability",' +
      '"Magic5:Spell Resistance",' +
      '"Magic6:Antimagic Field",' +
      '"Magic7:Spell Turning",' +
      '"Magic8:Protection From Spells",' +
      '"Magic9:Mage\'s Disjunction"',
  'Nobility Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Inspiring Word","8:Noble Leadership" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Nobility1:Divine Favor",' +
      'Nobility2:Enthrall,' +
      '"Nobility3:Magic Vestment",' +
      '"Nobility4:Discern Lies",' +
      '"Nobility5:Greater Command",' +
      'Nobility6:Geas/Quest,' +
      'Nobility7:Repulsion,' +
      'Nobility8:Demand,' +
      '"Nobility9:Storm Of Vengeance"',
  'Plant Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Wooden Fist","6:Bramble Armor" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      'Plant1:Entangle,' +
      'Plant2:Barkskin,' +
      '"Plant3:Plant Growth",' +
      '"Plant4:Command Plants",' +
      '"Plant5:Wall Of Thorns",' +
      '"Plant6:Repel Wood",' +
      '"Plant7:Animate Plants",' +
      '"Plant8:Control Plants",' +
      'Plant9:Shambler',
  'Protection Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Resistance Bonus","1:Resistant Touch","8:Aura Of Protection" '+
    'SpellAbility=wisdom ' +
    'Spells=' +
      'Protection1:Sanctuary,' +
      '"Protection2:Shield Other",' +
      '"Protection3:Protection From Energy",' +
      '"Protection4:Spell Immunity",' +
      '"Protection5:Spell Resistance",' +
      '"Protection6:Antimagic Field",' +
      'Protection7:Repulsion,' +
      '"Protection8:Mind Blank",' +
      '"Protection9:Prismatic Sphere"',
  'Repose Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Gentle Rest","8:Ward Against Death" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      'Repose1:Deathwatch,' +
      '"Repose2:Gentle Repose",' +
      '"Repose3:Speak With Dead",' +
      '"Repose4:Death Ward",' +
      '"Repose5:Slay Living",' +
      '"Repose6:Undeath To Death",' +
      'Repose7:Destruction,' +
      '"Repose8:Waves Of Exhaustion",' +
      '"Repose9:Wail Of The Banshee"',
  'Rune Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Scribe Scroll","1:Blast Rune","8:Spell Rune" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      'Rune1:Erase,' +
      '"Rune2:Secret Page",' +
      '"Rune3:Glyph Of Warding",' +
      '"Rune4:Explosive Runes",' +
      '"Rune5:Lesser Planar Binding",' +
      '"Rune6:Greater Glyph Of Warding",' +
      '"Rune7:Instant Summons",' +
      '"Rune8:Symbol Of Death",' +
      '"Rune9:Teleportation Circle"',
  'Strength Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Strength Rush","8:Might Of The Gods" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Strength1:Enlarge Person",' +
      '"Strength2:Bull\'s Strength",' +
      '"Strength3:Magic Vestment",' +
      '"Strength4:Spell Immunity",' +
      '"Strength5:Righteous Might",' +
      'Strength6:Stoneskin,' +
      '"Strength7:Grasping Hand",' +
      '"Strength8:Clenched Fist",' +
      '"Strength9:Crushing Hand"',
  'Sun Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Sun\'s Blessing","8:Nimbus Of Light" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Sun1:Endure Elements",' +
      '"Sun2:Heat Metal",' +
      '"Sun3:Searing Light",' +
      '"Sun4:Fire Shield",' +
      '"Sun5:Flame Strike",' +
      '"Sun6:Fire Seeds",' +
      'Sun7:Sunbeam,' +
      'Sun8:Sunburst,' +
      '"Sun9:Prismatic Sphere"',
  'Travel Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Travel Speed","1:Agile Feet","8:Dimensional Hop" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      'Travel1:Longstrider,' +
      '"Travel2:Locate Object",' +
      'Travel3:Fly,' +
      '"Travel4:Dimension Door",' +
      'Travel5:Teleport,' +
      '"Travel6:Find The Path",' +
      '"Travel7:Greater Teleport",' +
      '"Travel8:Phase Door",' +
      '"Travel9:Astral Projection"',
  'Trickery Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Copycat","8:Master\'s Illusion" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Trickery1:Disguise Self",' +
      'Trickery2:Invisibility,' +
      'Trickery3:Nondetection,' +
      'Trickery4:Confusion,' +
      '"Trickery5:False Vision",' +
      'Trickery6:Mislead,' +
      'Trickery7:Screen,' +
      '"Trickery8:Mass Invisibility",' +
      '"Trickery9:Time Stop"',
  'War Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Battle Rage","8:Weapon Master" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"War1:Magic Weapon",' +
      '"War2:Spiritual Weapon",' +
      '"War3:Magic Vestment",' +
      '"War4:Divine Power",' +
      '"War5:Flame Strike",' +
      '"War6:Blade Barrier",' +
      '"War7:Power Word Blind",' +
      '"War8:Power Word Stun",' +
      '"War9:Power Word Kill"',
  'Water Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Icicle","6:Cold Resistance" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Water1:Obscuring Mist",' +
      '"Water2:Fog Cloud",' +
      '"Water3:Water Breathing",' +
      '"Water4:Control Water",' +
      '"Water5:Ice Storm",' +
      '"Water6:Cone Of Cold",' +
      '"Water7:Elemental Body IV",' +
      '"Water8:Horrid Wilting",' +
      '"Water9:Elemental Swarm"',
  'Weather Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Storm Burst","8:Lightning Lord" ' +
    'SpellAbility=wisdom ' +
    'Spells=' +
      '"Weather1:Obscuring Mist",' +
      '"Weather2:Fog Cloud",' +
      '"Weather3:Call Lightning",' +
      '"Weather4:Sleet Storm",' +
      '"Weather5:Ice Storm",' +
      '"Weather6:Control Winds",' +
      '"Weather7:Control Weather",' +
      'Weather8:Whirlwind,' +
      '"Weather9:Storm Of Vengeance"',
  'Bloodline Aberrant':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Acidic Ray","3:Long Limbs","9:Unusual Anatomy",' +
      '"15:Alien Resistance","20:Aberrant Form" ' +
    'Feats=' +
      '"Combat Casting","Improved Disarm","Improved Grapple",' +
      '"Improved Initiative","Improved Unarmed Strike","Iron Will",' +
      '"Silent Spell","Skill Focus (Knowledge (Dungeoneering))" ' +
    'Skills="Knowledge (Dungeoneering)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Aberrant1:3=1,' +
      'Aberrant2:5=1,' +
      'Aberrant3:7=1,' +
      'Aberrant4:9=1,' +
      'Aberrant5:11=1,' +
      'Aberrant6:13=1,' +
      'Aberrant7:15=1,' +
      'Aberrant8:17=1,' +
      'Aberrant9:19=1 ' +
    'Spells=' +
      '"Aberrant1:Enlarge Person",' +
      '"Aberrant2:See Invisibility",' +
      'Aberrant3:Tongues,' +
      '"Aberrant4:Black Tentacles",' +
      'Aberrant5:Feeblemind,' +
      'Aberrant6:Veil,' +
      '"Aberrant7:Plane Shift",' +
      '"Aberrant8:Mind Blank",' +
      'Aberrant9:Shapechange',
  'Bloodline Abyssal':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Claws,"3:Demon Resistances","5:Magic Claws",' +
      '"9:Strength Of The Abyss","11:Improved Claws","15:Added Summonings",' +
      '"20:Demonic Might" ' +
    'Feats=' +
      '"Augment Summoning",Cleave,"Empower Spell","Great Fortitude",' +
      '"Improved Bull Rush","Improved Sunder","Power Attack",' +
      '"Skill Focus (Knowledge (Planes))" ' +
    'Skills="Knowledge (Planes)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Abyssal1:3=1,' +
      'Abyssal2:5=1,' +
      'Abyssal3:7=1,' +
      'Abyssal4:9=1,' +
      'Abyssal5:11=1,' +
      'Abyssal6:13=1,' +
      'Abyssal7:15=1,' +
      'Abyssal8:17=1,' +
      'Abyssal9:19=1 ' +
    'Spells=' +
      '"Abyssal1:Cause Fear",' +
      '"Abyssal2:Bull\'s Strength",' +
      'Abyssal3:Rage,' +
      'Abyssal4:Stoneskin,' +
      'Abyssal5:Dismissal,' +
      'Abyssal6:Transformation,' +
      '"Abyssal7:Greater Teleport",' +
      '"Abyssal8:Unholy Aura",' +
      '"Abyssal9:Summon Monster IX"',
  'Bloodline Arcane':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"3:Metamagic Adept","9:New Arcana","15:School Power",' +
      '"20:Arcane Apotheosis" ' +
    'Feats=' +
      '"Combat Casting","Improved Counterspell","Improved Initiative",' +
      '"Iron Will","Scribe Scroll","Skill Focus (Knowledge (Arcana))",' +
      '"Spell Focus (Abjuration)","Spell Focus (Conjuration)",' +
      '"Spell Focus (Divination)","Spell Focus (Enchantment)",' +
      '"Spell Focus (Evocation)","Spell Focus (Illusion)",' +
      '"Spell Focus (Necromancy)","Spell Focus (Transmutation)",' +
      '"Still Spell" ' +
    'Skills="choice of Knowledge" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Arcane1:3=1,' +
      'Arcane2:5=1,' +
      'Arcane3:7=1,' +
      'Arcane4:9=1,' +
      'Arcane5:11=1,' +
      'Arcane6:13=1,' +
      'Arcane7:15=1,' +
      'Arcane8:17=1,' +
      'Arcane9:19=1 ' +
    'Spells=' +
      'Arcane1:Identify,' +
      'Arcane2:Invisibility,' +
      '"Arcane3:Dispel Magic",' +
      '"Arcane4:Dimension Door",' +
      '"Arcane5:Overland Flight",' +
      '"Arcane6:True Seeing",' +
      '"Arcane7:Greater Teleport",' +
      '"Arcane8:Power Word Stun",' +
      'Arcane9:Wish',
  'Bloodline Celestial':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Heavenly Fire","3:Celestial Resistances","9:Wings Of Heaven",'+
      '15:Conviction,20:Ascension ' +
    'Feats=' +
      'Dodge,"Extend Spell","Iron Will",Mobility,"Mounted Combat",' +
      '"Ride-By Attack","Skill Focus (Knowledge (Religion))",' +
      '"Weapon Finesse" ' +
    'Skills=Heal ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Celestial1:3=1,' +
      'Celestial2:5=1,' +
      'Celestial3:7=1,' +
      'Celestial4:9=1,' +
      'Celestial5:11=1,' +
      'Celestial6:13=1,' +
      'Celestial7:15=1,' +
      'Celestial8:17=1,' +
      'Celestial9:19=1 ' +
    'Spells=' +
      'Celestial1:Bless,' +
      '"Celestial2:Resist Energy",' +
      '"Celestial3:Magic Circle Against Evil",' +
      '"Celestial4:Remove Curse",' +
      '"Celestial5:Flame Strike",' +
      '"Celestial6:Greater Dispel Magic",' +
      'Celestial7:Banishment,' +
      'Celestial8:Sunburst,' +
      'Celestial9:Gate',
  'Bloodline Destined':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Touch Of Destiny",3:Fated,"9:It Was Meant To Be","15:Within Reach",' +
      '"20:Destiny Realized" ' +
    'Feats=' +
      '"Arcane Strike",Diehard,Endurance,Leadership,"Lightning Reflexes",' +
      '"Maximize Spell","Skill Focus (Knowledge (History))" ' +
    'Skills="Knowledge (History)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Destined1:3=1,' +
      'Destined2:5=1,' +
      'Destined3:7=1,' +
      'Destined4:9=1,' +
      'Destined5:11=1,' +
      'Destined6:13=1,' +
      'Destined7:15=1,' +
      'Destined8:17=1,' +
      'Destined9:19=1 ' +
    'Spells=' +
      'Destined1:Alarm,' +
      'Destined2:Blur,' +
      '"Destined3:Protection From Energy",' +
      '"Destined4:Freedom Of Movement",' +
      '"Destined5:Break Enchantment",' +
      'Destined6:Mislead,' +
      '"Destined7:Spell Turning",' +
      '"Destined8:Moment Of Prescience",' +
      'Destined9:Foresight',
  'Bloodline Draconic':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Claws,"3:Dragon Resistances","3:Natural Armor","5:Magic Claws",' +
      '"9:Breath Weapon","11:Improved Claws",15:Wings,"20:Power Of Wyrms",' +
      '20:Blindsense ' +
    'Feats=' +
      '"Blind-Fight","Great Fortitude","Improved Initiative","Power Attack",' +
      '"Quicken Spell","Skill Focus (Fly)",' +
      '"Skill Focus (Knowledge (Arcana))",Toughness ' +
    'Skills=Perception ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Draconic1:3=1,' +
      'Draconic2:5=1,' +
      'Draconic3:7=1,' +
      'Draconic4:9=1,' +
      'Draconic5:11=1,' +
      'Draconic6:13=1,' +
      'Draconic7:15=1,' +
      'Draconic8:17=1,' +
      'Draconic9:19=1 ' +
    'Spells=' +
      '"Draconic1:Mage Armor",' +
      '"Draconic2:Resist Energy",' +
      'Draconic3:Fly,' +
      'Draconic4:Fear,' +
      '"Draconic5:Spell Resistance",' +
      '"Draconic6:Form Of The Dragon I",' +
      '"Draconic7:Form Of The Dragon II",' +
      '"Draconic8:Form Of The Dragon III",' +
      'Draconic9:Wish',
  'Bloodline Elemental':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Bloodline Elemental","1:Elemental Ray","3:Elemental Resistance",' +
      '"9:Elemental Blast","15:Elemental Movement","20:Elemental Body" ' +
    'Feats=' +
      'Dodge,"Empower Spell","Great Fortitude","Improved Initiative",' +
      '"Lightning Reflexes","Power Attack",' +
      '"Skill Focus (Knowledge (Planes))","Weapon Finesse" ' +
    'Skills="Knowledge (Planes)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Elemental1:3=1,' +
      'Elemental2:5=1,' +
      'Elemental3:7=1,' +
      'Elemental4:9=1,' +
      'Elemental5:11=1,' +
      'Elemental6:13=1,' +
      'Elemental7:15=1,' +
      'Elemental8:17=1,' +
      'Elemental9:19=1 ' +
    'Spells=' +
      '"Elemental1:Burning Hands",' +
      '"Elemental2:Scorching Ray",' +
      '"Elemental3:Protection From Energy",' +
      '"Elemental4:Elemental Body I",' +
      '"Elemental5:Elemental Body II",' +
      '"Elemental6:Elemental Body III",' +
      '"Elemental7:Elemental Body IV",' +
      '"Elemental8:Summon Monster VIII",' +
      '"Elemental9:Elemental Swarm"',
  'Bloodline Fey':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Laughing Touch","3:Woodland Stride","9:Fleeting Glance",' +
      '"15:Fey Magic","20:Soul Of The Fey" ' +
    'Feats=' +
      'Dodge,"Improved Initiative","Lightning Reflexes",Mobility,' +
      '"Point-Blank Shot","Precise Shot","Quicken Spell",' +
      '"Skill Focus (Knowledge (Nature))" ' +
    'Skills="Knowledge (Nature)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Fey1:3=1,' +
      'Fey2:5=1,' +
      'Fey3:7=1,' +
      'Fey4:9=1,' +
      'Fey5:11=1,' +
      'Fey6:13=1,' +
      'Fey7:15=1,' +
      'Fey8:17=1,' +
      'Fey9:19=1 ' +
    'Spells=' +
      'Fey1:Entangle,' +
      '"Fey2:Hideous Laughter",' +
      '"Fey3:Deep Slumber",' +
      'Fey4:Poison,' +
      '"Fey5:Tree Stride",' +
      'Fey6:Mislead,' +
      '"Fey7:Phase Door",' +
      '"Fey8:Irresistible Dance",' +
      'Fey9:Shapechange',
  'Bloodline Infernal':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Corrupting Touch","3:Infernal Resistances",9:Hellfire,' +
      '"15:On Dark Wings","20:Power Of The Pit" ' +
    'Feats=' +
      'Blind-Fight,"Combat Expertise",Deceitful,"Extend Spell",' +
      '"Improved Disarm","Iron Will","Skill Focus (Knowledge (Planes))",' +
      '"Spell Penetration" ' +
    'Skills=Diplomacy ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Infernal1:3=1,' +
      'Infernal2:5=1,' +
      'Infernal3:7=1,' +
      'Infernal4:9=1,' +
      'Infernal5:11=1,' +
      'Infernal6:13=1,' +
      'Infernal7:15=1,' +
      'Infernal8:17=1,' +
      'Infernal9:19=1 ' +
    'Spells=' +
      '"Infernal1:Protection From Good",' +
      '"Infernal2:Scorching Ray",' +
      'Infernal3:Suggestion,' +
      '"Infernal4:Charm Monster",' +
      '"Infernal5:Dominate Person",' +
      '"Infernal6:Planar Binding",' +
      '"Infernal7:Greater Teleport",' +
      '"Infernal8:Power Word Stun",' +
      '"Infernal9:Meteor Swarm"',
  'Bloodline Undead':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Grave Touch","3:Death\'s Gift","9:Grasp Of The Dead",' +
      '"15:Incorporeal Form","20:One Of Us" ' +
    'Feats=' +
      '"Combat Casting","Diehard",Endurance,"Iron Will",' +
      '"Skill Focus (Knowledge (Religion))",' +
      '"Spell Focus (Abjuration)","Spell Focus (Conjuration)",' +
      '"Spell Focus (Divination)","Spell Focus (Enchantment)",' +
      '"Spell Focus (Evocation)","Spell Focus (Illusion)",' +
      '"Spell Focus (Necromancy)","Spell Focus (Transmutation)",' +
      'Toughness ' +
    'Skills="Knowledge (Religion)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Undead1:3=1,' +
      'Undead2:5=1,' +
      'Undead3:7=1,' +
      'Undead4:9=1,' +
      'Undead5:11=1,' +
      'Undead6:13=1,' +
      'Undead7:15=1,' +
      'Undead8:17=1,' +
      'Undead9:19=1 ' +
    'Spells=' +
      '"Undead1:Chill Touch",' +
      '"Undead2:False Life",' +
      '"Undead3:Vampiric Touch",' +
      '"Undead4:Animate Dead",' +
      '"Undead5:Waves Of Fatigue",' +
      '"Undead6:Undeath To Death",' +
      '"Undead7:Finger Of Death",' +
      '"Undead8:Horrid Wilting",' +
      '"Undead9:Energy Drain"'
};
Pathfinder.RACES = {
  'Dwarf':
    'Features=' +
      '"Dwarf Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)",' +
      '"Weapon Proficiency (Battleaxe/Heavy Pick/Warhammer)",' +
      'Darkvision,"Defensive Training","Dwarf Enmity",Greed,Hardy,Slow,' +
      'Steady,Stability,Stonecunning ' +
    'Languages=Common,Dwarven',
  'Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Elven Curve Blade)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Longsword/Rapier/Shortbow)",' +
      '"Elven Magic","Keen Senses","Low-Light Vision","Resist Enchantment",' +
      '"Sleep Immunity" ' +
    'Languages=Common,Elven',
  'Gnome':
    'Features=' +
      '"Gnome Ability Adjustment",' +
      '"Weapon Familiarity (Gnome Hooked Hammer)",' +
      '"Defensive Training","Gnome Enmity","Gnome Magic","Keen Senses",' +
      '"Low-Light Vision",Obsessive,"Resist Illusion",Slow,Small ' +
    'Languages=Common,Gnome,Sylvan ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      '"Gnomish0:1=3",' +
      '"Gnomish1:1=1" ' +
    'Spells=' +
      '"Gnomish0:Dancing Lights;Ghost Sound;Prestidigitation",' +
      '"Gnomish1:Speak With Animals"',
  'Half-Elf':
    'Features=' +
      '"Half-Elf Ability Adjustment",' +
      'Adaptability,"Elf Blood","Keen Senses","Low-Light Vision",' +
      'Multitalented,"Resist Enchantment","Sleep Immunity" ' +
    'Languages=Common,Elven',
  'Half-Orc':
    'Features=' +
      '"Half-Orc Ability Adjustment",' +
      '"Weapon Familiarity (Orc Double Axe)",' +
      '"Weapon Proficiency (Falchion/Greataxe)",' +
      'Darkvision,Intimidating,"Orc Blood","Orc Ferocity" ' +
    'Languages=Common,Orc',
  'Halfling':
    'Features=' +
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Sling Staff)",' +
      '"Weapon Proficiency (Sling)",' +
      'Fortunate,"Keen Senses","Resist Fear",Slow,Small,Sure-Footed ' +
    'Languages=Common,Halfling',
  'Human':
    'Features=' +
      '"Human Ability Adjustment",' +
      '"Bonus Feat",Skilled ' +
    'Languages=Common'
};
Pathfinder.SCHOOLS = {
  'Abjuration':
    'Features=' +
      '"1:Energy Resistance","1:Protective Ward","6:Energy Absorption"',
  'Conjuration':
    'Features=' +
      '"1:Summoner\'s Charm","1:Conjured Dart","8:Dimensional Steps"',
  'Divination':
    'Features=' +
      '1:Forewarned,"1:Diviner\'s Fortune","8:Scrying Adept"',
  'Enchantment':
    'Features=' +
      '"1:Dazing Touch","1:Enchanting Smile","8:Aura Of Despair",' +
      '"20:Enchantment Reflection"',
  'Evocation':
    'Features=' +
      '"1:Intense Spells","1:Force Missile","8:Elemental Wall",' +
      '"20:Penetrating Spells"',
  'Illusion':
    'Features=' +
      '"1:Extended Illusions","1:Blinding Ray","8:Invisibility Field"',
  'Necromancy':
    'Features=' +
      '"1:Power Over Undead","1:Necromantic Touch","8:Life Sight"',
  'Transmutation':
    'Features=' +
      '"1:Physical Enhancement","1:Telekinetic Fist","8:Change Shape"',
  'Universal':
    'Features='
};
Pathfinder.SHIELDS = {
  'Buckler':'AC=1 Weight=1 Skill=1 Spell=5',
  'Heavy Steel':'AC=2 Weight=3 Skill=2 Spell=15',
  'Heavy Wooden':'AC=2 Weight=3 Skill=2 Spell=15',
  'Light Steel':'AC=1 Weight=1 Skill=1 Spell=5',
  'Light Wooden':'AC=1 Weight=1 Skill=1 Spell=5',
  'None':'AC=0 Weight=0 Skill=0 Spell=0',
  'Tower':'AC=4 Weight=4 Skill=10 Spell=50'
};
Pathfinder.SKILLS = {
  'Acrobatics':'Ability=dexterity Class=Barbarian,Bard,Monk,Rogue',
  'Appraise':'Ability=intelligence Class=Bard,Cleric,Rogue,Sorcerer,Wizard',
  'Bluff':'Ability=charisma Class=Bard,Rogue,Sorcerer',
  'Climb':
    'Ability=strength Class=Barbarian,Bard,Druid,Fighter,Monk,Ranger,Rogue',
  'Craft (Alchemy)':'Ability=intelligence Class=all',
  'Craft (Armor)':'Ability=intelligence Class=all',
  'Craft (Bows)':'Ability=intelligence Class=all',
  'Craft (Traps)':'Ability=intelligence Class=all',
  'Craft (Weapons)':'Ability=intelligence Class=all',
  'Diplomacy':'Ability=charisma Class=Bard,Cleric,Paladin,Rogue',
  'Disable Device':'Ability=dexterity Untrained=n Class=Rogue',
  'Disguise':'Ability=charisma Class=Bard,Rogue',
  'Escape Artist':'Ability=dexterity Class=Bard,Monk,Rogue',
  'Fly':'Ability=dexterity Class=Druid,Sorcerer,Wizard',
  'Handle Animal':
    'Ability=charisma Untrained=n Class=Barbarian,Druid,Fighter,Paladin,Ranger',
  'Heal':'Ability=wisdom Class=Cleric,Druid,Paladin,Ranger',
  'Intimidate':
    'Ability=charisma Class=Barbarian,Bard,Fighter,Monk,Ranger,Rogue,Sorcerer',
  'Knowledge (Arcana)':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Sorcerer,Wizard',
  'Knowledge (Dungeoneering)':
    'Ability=intelligence Untrained=n Class=Bard,Fighter,Ranger,Rogue,Wizard',
  'Knowledge (Engineering)':
    'Ability=intelligence Untrained=n Class=Bard,Fighter,Wizard',
  'Knowledge (Geography)':
    'Ability=intelligence Untrained=n Class=Bard,Druid,Ranger,Wizard',
  'Knowledge (History)':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Monk,Wizard',
  'Knowledge (Local)':
    'Ability=intelligence Untrained=n Class=Bard,Rogue,Wizard',
  'Knowledge (Nature)':
    'Ability=intelligence Untrained=n Class=Barbarian,Bard,Druid,Ranger,Wizard',
  'Knowledge (Nobility)':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Paladin,Wizard',
  'Knowledge (Planes)':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Wizard',
  'Knowledge (Religion)':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Monk,Paladin,Wizard',
  'Linguistics':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Rogue,Wizard',
  'Perception':'Ability=wisdom Class=Barbarian,Bard,Druid,Monk,Ranger,Rogue',
  'Perform (Act)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (Comedy)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (Dance)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (Keyboard)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (Oratory)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (Percussion)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (Sing)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (String)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Perform (Wind)':'Ability=charisma Class=Bard,Monk,Rogue',
  'Profession (Tanner)':
    'Ability=wisdom Untrained=n ' +
    'Class=Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Ride':'Ability=dexterity Class=Barbarian,Druid,Fighter,Monk,Paladin,Ranger',
  'Sense Motive':'Ability=wisdom Class=Bard,Cleric,Monk,Paladin,Rogue',
  'Sleight Of Hand':'Ability=dexterity Untrained=n Class=Bard,Rogue',
  'Spellcraft':
    'Ability=intelligence Untrained=n ' +
    'Class=Bard,Cleric,Druid,Paladin,Ranger,Sorcerer,Wizard',
  'Stealth':'Ability=dexterity Class=Bard,Monk,Ranger,Rogue',
  'Survival':'Ability=wisdom Class=Barbarian,Druid,Fighter,Ranger',
  'Swim':'Ability=strength Class=Barbarian,Druid,Fighter,Monk,Ranger,Rogue',
  'Use Magic Device':'Ability=charisma Untrained=n Class=Bard,Rogue,Sorcerer'
};
Pathfinder.SPELLS = Object.assign({}, SRD35.SPELLS, {

  'Beast Shape I':
    'School=Transmutation ' +
    'Description="Become small (+2 Dex, +1 AC) or medium (+2 Str, +2 AC) animal for $L min"',
  'Beast Shape II':
    'School=Transmutation ' +
    'Description="Become tiny (+4 Dex, -2 Str, +1 AC) or large (+4 Str, -2 Dex, +4 AC) animal for $L min"',
  'Beast Shape III':
    'School=Transmutation ' +
    'Description="Become dimunitive (+6 Dex, -4 Str, +1 AC) or huge (+6 Str, -4 Dex, +6 AC) animal or small (+4 Dex, +2 AC) or medium (+4 Str, +4 AC) magical beast for $L min"',
  'Beast Shape IV':
    'School=Transmutation ' +
    'Description="Become tiny (+8 Dex, -2 Str, +3 AC) or large (+6 Str, -2 Dex, +2 Con, +6 AC) magical beast for $L min"',
  'Bleed':
    'School=Necromancy ' +
    'Description="R$RS\' Stabilized target resume dying (Will neg)"',
  'Breath Of Life':
    'School=Conjuration ' +
    'Description="Heal 5d8+$L (max 25) plus resurrect target dead lt 1 rd"',
  'Elemental Body I':
    'School=Transmutation ' +
    'Description="Become small air (+2 Dex, +2 AC, fly 60\', whirlwind), earth (+2 Str, +4 AC, earth glide), fire (+2 Dex, +2 AC, resist fire, burn), water (+2 Con, +4 AC, swim 60\', vortex, breathe water) elemental, 60\' darkvision for $L min"',
  'Elemental Body II':
    'School=Transmutation ' +
    'Description="Become medium air (+4 Dex, +3 AC, fly 60\', whirlwind), earth (+4 Str, +5 AC, earth glide), fire (+4 Dex, +3 AC, resist fire, burn), water (+4 Con, +5 AC, swim 60\', vortex, breathe water) elemental, 60\' darkvision for $L min"',
  'Elemental Body III':
    'School=Transmutation ' +
    'Description="Become large air (+2 Str, +4 Dex, +4 AC, fly 60\', whirlwind), earth (+6 Str, -2 Dex, +2 Con, +6 AC, earth glide), fire (+4 Dex, +2 Con, +4 AC, resist fire, burn), water (+2 Str, -2 Dex, +6 Con, +6 AC, swim 60\', vortex, breathe water) elemental, 60\' darkvision, immune bleed, critical, sneak attack for $L min"',
  'Elemental Body IV':
    'School=Transmutation ' +
    'Description="Become huge air (+4 Str, +6 Dex, +4 AC, fly 120\', whirlwind), earth (+8 Str, -2 Dex, +4 Con, +6 AC, earth glide), fire (+6 Dex, +4 Con, +4 AC, resist fire, burn), water (+4 Str, -2 Dex, +8 Con, +6 AC, swim 120\', vortex, breathe water) elemental, 60\' darkvision, immune bleed, critical, sneak attack, DR 5, - for $L min"',
  'Form Of The Dragon I':
    'School=Transmutation ' +
    'Description="Become Medium dragon (+4 Str, +2 Con, +4 AC, Fly 60\', Darkvision 60\', breath weapon once 6d8 HP (Ref half), element resistance, bite 1d8 HP, claws 2x1d6 HP, wings 2x1d4 HP) for $L min"',
  'Form Of The Dragon II':
    'School=Transmutation ' +
    'Description="Become Large dragon (+6 Str, +4 Con, +6 AC, Fly 90\', Darkvision 60\', breath weapon twice 8d8 HP (Ref half), element resistance, bite 2d6 HP, claws 2x1d8 HP, wings 2x1d6 HP) for $L min"',
  'Form Of The Dragon III':
    'School=Transmutation ' +
    'Description="Become Huge dragon (+10 Str, +8 Con, +8 AC, Fly 120\', Blindsense 60\', Darkvision 120\', breath weapon 1, d4 rd 12d8 HP (Ref half), element immunity, bite 2d8 HP, claws 2x2d6 HP, wings 2x1d8 HP, tail 2d6 HP) for $L min"',
  'Giant Form I':
    'School=Transmutation ' +
    'Description="Become large giant (+6 Str, -2 Dex, +4 Con, +4 AC, low-light vision, form abilities) for $L min"',
  'Giant Form II':
    'School=Transmutation ' +
    'Description="Become huge giant (+8 Str, -2 Dex, +6 Con, +6 AC, low-light vision, form abilities) for $L min"',
  'Greater Polymorph':
    'School=Transmutation ' +
    'Description="Willing target becomes animal, elemental, plant, or dragon for $L min"',
  'Plant Shape I':
    'School=Transmutation ' +
    'Description="Become small (+2 Con, +2 AC) or medium (+2 Str, +2 Con, +2 AC) plant creature for $L min"',
  'Plant Shape II':
    'School=Transmutation ' +
    'Description="Become large (+4 Str, +2 Con, +4 AC) plant creature for $L min"',
  'Plant Shape III':
    'School=Transmutation ' +
    'Description="Become huge (+8 Str, -2 Dex, +4 Con, +6 AC) plant creature for $L min"',
  'Stabilize':
    'School=Conjuration ' +
    'Description="R$RS\' Stabilize dying target"'

});
// Delete SRD35 spells that don't exist in Pathfinder
delete Pathfinder.SPELLS['Cure Minor Wounds'];
delete Pathfinder.SPELLS['Inflict Minor Wounds'];
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
      '3850,5350'
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
  'Freedom Fighter':'Type=Race Subtype=Halfling',
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
  'Magical Talent':'Type=Basic Subtype=Magic',
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
  'World Traveler':'Type=Race Subtype=Human',
  // Faction Traits - PS Roleplaying Guild Guide (v10.0)
  'A Sure Thing':'Type=Faction Subtype="Silver Crusade"',
  'Arcane Archivist':'Type=Faction Subtype="Dark Archive"',
  'Balanced Offensive':'Type=Faction Subtype="The Concordance"',
  'Beastspeaker':'Type=Faction Subtype="The Concordance"',
  'Beneficient Touch':'Type=Faction Subtype="Silver Crusade"',
  'Captain\'s Blade':'Type=Faction Subtype="Liberty\'s Edge"',
  'Comparative Religion':'Type=Faction Subtype="Silver Crusade"',
  'Devil\'s Mark':'Type=Faction Subtype="Dark Archive"',
  'Expert Duelist':'Type=Faction Subtype="Sovereign Court"',
  'Faction Freedom Fighter':'Type=Faction Subtype="Liberty\'s Edge"',
  'Fashionable':'Type=Faction Subtype="Sovereign Court"',
  'Force For Good':'Type=Faction Subtype="Silver Crusade"',
  'Gold Finger':'Type=Faction Subtype="The Exchange"',
  'Greasy Palm':'Type=Faction Subtype="The Exchange"',
  'Impressive Presence':'Type=Faction Subtype="Sovereign Court"',
  'Indomitable':'Type=Faction Subtype="Liberty\'s Edge"',
  'Influential':'Type=Faction Subtype=Taldor',
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
  'Unflappable':'Type=Faction Subtype=Taldor',
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
  'Dunewalker':'Type=Faction Subtype=Osiron',
  'Eastern Mysteries':'Type=Faction Subtype=Qadira',
  'Explorer':'Type=Faction Subtype=Andoran',
  'Fiendish Presence':'Type=Faction Subtype=Cheliax',
  'Fires Of Hell':'Type=Faction Subtype=Cheliax',
  'Fortified':'Type=Faction Subtype="Shadow Lodge"',
  'Horse Lord':'Type=Faction Subtype=Qadira',
  'Hunter\'s Eye':'Type=Faction Subtype=Andoran',
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
Pathfinder.WEAPONS = Object.assign({}, SRD35.WEAPONS, {
  'Bastard Sword':'Level=3 Category=1h Damage=d10 Threat=19',
  'Battleaxe':'Level=2 Category=1h Damage=d8 Crit=3',
  'Bolas':'Level=3 Category=R Damage=d4 Range=10',
  'Blowgun':'Level=1 Category=R Damage=d2 Range=20',
  'Club':'Level=1 Category=1h Damage=d6 Range=10',
  'Composite Longbow':'Level=2 Category=R Damage=d8 Crit=3 Range=110',
  'Composite Shortbow':'Level=2 Category=R Damage=d6 Crit=3 Range=70',
  'Dagger':'Level=1 Category=Li Damage=d4 Threat=19 Range=10',
  'Dart':'Level=1 Category=R Damage=d4 Range=20',
  'Dire Flail':'Level=3 Category=2h Damage=d8/d8',
  'Dwarven Urgosh':'Level=3 Category=2h Damage=d8/d6 Crit=3',
  'Dwarven Waraxe':'Level=3 Category=1h Damage=d10 Crit=3',
  'Elven Curve Blade':'Level=3 Category=2h Damage=d10 Threat=18',
  'Falchion':'Level=2 Category=2h Damage=2d4 Threat=18',
  'Flail':'Level=2 Category=1h Damage=d8',
  'Gauntlet':'Level=0 Category=Un Damage=d3',
  'Glaive':'Level=2 Category=2h Damage=d10 Crit=3',
  'Gnome Hooked Hammer':'Level=3 Category=2h Damage=d8/d6 Crit=4',
  'Greataxe':'Level=2 Category=2h Damage=d12 Crit=3',
  'Greatclub':'Level=2 Category=2h Damage=d10',
  'Greatsword':'Level=2 Category=2h Damage=2d6 Threat=19',
  'Guisarme':'Level=2 Category=2h Damage=2d4 Crit=3',
  'Halberd':'Level=2 Category=2h Damage=d10 Crit=3',
  'Halfling Sling Staff':'Level=3 Category=R Damage=d8 Crit=3 Range=80',
  'Hand Crossbow':'Level=3 Category=R Damage=d4 Threat=19 Range=30',
  'Handaxe':'Level=2 Damage=d6 Category=Li Crit=3',
  'Heavy Crossbow':'Level=1 Category=R Damage=d10 Threat=19 Range=120',
  'Heavy Flail':'Level=2 Category=2h Damage=d10 Threat=19',
  'Heavy Mace':'Level=1 Category=1h Damage=d8',
  'Heavy Pick':'Level=2 Category=1h Damage=d6 Crit=4',
  'Heavy Shield':'Level=2 Category=1h Damage=d4',
  'Heavy Spiked Shield':'Level=2 Category=1h Damage=d6',
  'Improvised':'Level=3 Category=R Damage=d4 Range=10',
  'Javelin':'Level=1 Category=R Damage=d6 Range=30',
  'Kama':'Level=3 Category=Li Damage=d6',
  'Kukri':'Level=2 Category=Li Damage=d4 Threat=18',
  'Lance':'Level=2 Category=2h Damage=d8 Crit=3',
  'Light Crossbow':'Level=1 Category=R Damage=d8 Threat=19 Range=80',
  'Light Hammer':'Level=2 Category=Li Damage=d4 Range=20',
  'Light Mace':'Level=1 Category=Li Damage=d6',
  'Light Pick':'Level=2 Category=Li Damage=d4 Crit=4',
  'Light Shield':'Level=2 Category=Li Damage=d3',
  'Light Spiked Shield':'Level=2 Category=Li Damage=d4',
  'Longbow':'Level=2 Category=R Damage=d8 Crit=3 Range=100',
  'Longspear':'Level=1 Category=2h Damage=d8 Crit=3',
  'Longsword':'Level=2 Category=1h Damage=d8 Threat=19',
  'Morningstar':'Level=1 Category=1h Damage=d8',
  'Net':'Level=3 Category=R Damage=d0 Range=10',
  'Nunchaku':'Level=3 Category=Li Damage=d6',
  'Orc Double Axe':'Level=3 Category=2h Damage=d8/d8 Crit=3',
  'Punching Dagger':'Level=1 Category=Li Damage=d4 Crit=3',
  'Quarterstaff':'Level=1 Category=2h Damage=d6/d6',
  'Ranseur':'Level=2 Category=2h Damage=2d4 Crit=3',
  'Rapier':'Level=2 Category=1h Damage=d6 Threat=18',
  'Repeating Heavy Crossbow':
    'Level=3 Category=R Damage=d10 Threat=19 Range=120',
  'Repeating Light Crossbow':'Level=3 Category=R Damage=d8 Threat=19 Range=80',
  'Sai':'Level=3 Category=Li Damage=d4',
  'Sap':'Level=2 Category=Li Damage=d6',
  'Scimitar':'Level=2 Category=1h Damage=d6 Threat=18',
  'Scythe':'Level=2 Category=2h Damage=2d4 Crit=4',
  'Short Sword':'Level=2 Category=Li Damage=d6 Threat=19',
  'Shortbow':'Level=2 Category=R Damage=d6 Crit=3 Range=60',
  'Shortspear':'Level=1 Category=1h Damage=d6 Range=20',
  'Shuriken':'Level=3 Category=R Damage=d2 Range=10',
  'Siangham':'Level=3 Category=Li Damage=d6',
  'Sickle':'Level=1 Category=Li Damage=d6',
  'Sling':'Level=1 Category=R Damage=d4 Range=50',
  'Spear':'Level=1 Category=2h Damage=d8 Crit=3 Range=20',
  'Spiked Armor':'Level=2 Category=Li Damage=d6',
  'Spiked Chain':'Level=3 Category=2h Damage=2d4',
  'Spiked Gauntlet':'Level=1 Category=Li Damage=d4',
  'Starknife':'Level=2 Category=Li Damage=d4 Crit=3 Range=20',
  'Throwing Axe':'Level=2 Category=Li Damage=d6 Range=10',
  'Trident':'Level=2 Category=1h Damage=d8 Range=10',
  'Two-Bladed Sword':'Level=3 Category=2h Damage=d8/d8 Threat=19',
  'Unarmed':'Level=0 Category=Un Damage=d3',
  'Warhammer':'Level=2 Category=1h Damage=d8 Crit=3',
  'Whip':'Level=3 Category=1h Damage=d3'
});
Pathfinder.CLASSES = {
  'Barbarian':
    'Require="alignment !~ \'Lawful\'" ' +
    'HitDie=d12 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Fast Movement",1:Rage,"2:Uncanny Dodge","3:Trap Sense",' +
      '"5:Improved Uncanny Dodge","7:Damage Reduction","11:Greater Rage",' +
      '"14:Indomitable Will","17:Tireless Rage","20:Mighty Rage" ' +
    'Selectables=' +
      '"2:Animal Fury","8:Clear Mind","12:Fearless Rage","2:Guarded Stance",' +
      '"8:Increased Damage Reduction","8:Internal Fortitude",' +
      '"2:Intimidating Glare","2:Knockback","2:Low-Light Vision",' +
      '"12:Mighty Swing","2:Moment Of Clarity","2:Night Vision",' +
      '"2:No Escape","2:Powerful Blow","2:Quick Reflexes",' +
      '"2:Raging Climber","2:Raging Leaper","2:Raging Swimmer",' +
      '"8:Renewed Vigor","2:Rolling Dodge","2:Roused Anger","2:Scent",' +
      '"2:Strength Surge","2:Superstition","2:Surprise Accuracy",' +
      '"2:Swift Foot","8:Terrifying Howl","4:Unexpected Strike"',
  'Bard':
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Simple/Longsword/Rapier/Sap/Short Sword/Short Bow/Whip)",' +
      '"1:Bardic Knowledge","1:Bardic Performance",1:Countersong,' +
      '1:Distraction,1:Fascinate,"1:Inspire Courage","1:Simple Somatics",' +
      '"2:Versatile Performance",2:Well-Versed,"3:Inspire Competence",' +
      '"5:Lore Master",6:Suggestion,"8:Dirge Of Doom","9:Inspire Greatness",' +
      '"10:Jack Of All Trades","12:Soothing Performace",' +
      '"14:Frightening Tune","15:Inspire Heroics","18:Mass Suggestion",' +
      '"20:Deadly Performance" ' +
    'CasterLevelArcane=levels.Bard ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'B0:1=4;2=5;3=6,' +
      'B1:1=1;2=2;3=3;5=4;9=5,' +
      'B2:4=1;5=2;6=3;8=4;12=5,' +
      'B3:7=1;8=2;9=3;11=4;15=5,' +
      'B4:10=1;11=2;12=3;14=4;18=5,' +
      'B5:13=1;14=2;15=3;17=4;19=5,' +
      'B6:16=1;17=2;18=3;19=4;20=5 ' +
    'Spells=' +
      '"B0:Dancing Lights;Daze;Detect Magic;Flare;Ghost Sound;Know Direction;' +
      'Light;Lullaby;Mage Hand;Mending;Message;Open/Close;Prestidigitation;' +
      'Read Magic;Resistance;Summon Instrument",' +
      '"B1:Alarm;Animate Rope;Cause Fear;Charm Person;Comprehend Languages;' +
      'Cure Light Wounds;Detect Secret Doors;Disguise Self;Erase;' +
      'Expeditious Retreat;Feather Fall;Grease;Hideous Laughter;Hypnotism;' +
      'Identify;Lesser Confusion;Magic Aura;Magic Mouth;Obscure Object;' +
      'Remove Fear;Silent Image;Sleep;Summon Monster I;' +
      'Undetectable Alignment;Unseen Servant;Ventriloquism",' +
      '"B2:Alter Self;Animal Messenger;Animal Trance;Blindness/Deafness;Blur;' +
      'Calm Emotions;Cat\'s Grace;Cure Moderate Wounds;Darkness;Daze Monster;' +
      'Delay Poison;Detect Thoughts;Eagle\'s Splendor;Enthrall;' +
      'Fox\'s Cunning;Glitterdust;Heroism;Hold Person;Hypnotic Pattern;' +
      'Invisibility;Locate Object;Minor Image;Mirror Image;Misdirection;' +
      'Pyrotechnics;Rage;Scare;Shatter;Silence;Sound Burst;Suggestion;' +
      'Summon Monster II;Summon Swarm;Tongues;Whispering Wind",' +
      '"B3:Blink;Charm Monster;Clairaudience/Clairvoyance;Confusion;' +
      'Crushing Despair;Cure Serious Wounds;Daylight;Deep Slumber;' +
      'Dispel Magic;Displacement;Fear;Gaseous Form;Glibness;Good Hope;Haste;' +
      'Illusory Script;Invisibility Sphere;Lesser Geas;Major Image;' +
      'Phantom Steed;Remove Curse;Scrying;Sculpt Sound;Secret Page;' +
      'See Invisibility;Sepia Snake Sigil;Slow;Speak With Animals;' +
      'Summon Monster III;Tiny Hut",' +
      '"B4:Break Enchantment;Cure Critical Wounds;Detect Scrying;' +
      'Dimension Door;Dominate Person;Freedom Of Movement;' +
      'Greater Invisibility;Hallucinatory Terrain;Hold Monster;Legend Lore;' +
      'Locate Creature;Modify Memory;Neutralize Poison;Rainbow Pattern;' +
      'Repel Vermin;Secure Shelter;Shadow Conjuration;Shout;' +
      'Speak With Plants;Summon Monster IV;Zone Of Silence",' +
      '"B5:Dream;False Vision;Greater Dispel Magic;Greater Heroism;' +
      'Mass Cure Light Wounds;Mass Suggestion;Mind Fog;Mirage Arcana;Mislead;' +
      'Nightmare;Persistent Image;Seeming;Shadow Evocation;Shadow Walk;' +
      'Song Of Discord;Summon Monster V",' +
      '"B6:Analyze Dweomer;Animate Objects;Eyebite;Find The Path;Geas/Quest;' +
      'Greater Scrying;Greater Shout;Heroes\' Feast;Irresistible Dance;' +
      'Mass Cat\'s Grace;Mass Charm Monster;Mass Cure Moderate Wounds;' +
      'Mass Eagle\'s Splendor;Mass Fox\'s Cunning;Permanent Image;' +
      'Programmed Image;Project Image;Summon Monster VI;' +
      'Sympathetic Vibration;Veil"',
  'Cleric':
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '1:Aura,"1:Channel Energy","1:Spontaneous Cleric Spell" ' +
    'Selectables=' +
      QuilvynUtils.getKeys(Pathfinder.PATHS).filter(x => x.match(/Domain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Domain', '') + '\' ? 1:' + x + '"').join(',') + ' ' +
    'CasterLevelDivine=levels.Cleric ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'C0:1=3;2=4,' +
      'C1:1=1;2=2;4=3;7=4,' +
      'C2:3=1;4=2;6=3;9=4,' +
      'C3:5=1;6=2;8=3;11=4,' +
      'C4:7=1;8=2;10=3;13=4,' +
      'C5:9=1;10=2;12=3;15=4,' +
      'C6:11=1;12=2;14=3;17=4,' +
      'C7:13=1;14=2;16=3;19=4,' +
      'C8:15=1;16=2;18=3;20=4,' +
      'C9:17=1;18=2;19=3;20=4,' +
      'Domain1:1=1,' +
      'Domain2:3=1,' +
      'Domain3:5=1,' +
      'Domain4:7=1,' +
      'Domain5:9=1,' +
      'Domain6:11=1,' +
      'Domain7:13=1,' +
      'Domain8:15=1,' +
      'Domain9:17=1 ' +
      'Spells=' +
      '"C0:Bleed;Create Water;Detect Magic;Detect Poison;Guidance;Light;' +
      'Mending;Purify Food And Drink;Read Magic;Resistance;Stabilize;Virtue",' +
      '"C1:Bane;Bless;Bless Water;Cause Fear;Command;Comprehend Languages;' +
      'Cure Light Wounds;Curse Water;Deathwatch;Detect Chaos;Detect Evil;' +
      'Detect Good;Detect Law;Detect Undead;Divine Favor;Doom;' +
      'Endure Elements;Entropic Shield;Hide From Undead;Inflict Light Wounds;' +
      'Magic Stone;Magic Weapon;Obscuring Mist;Protection From Chaos;' +
      'Protection From Evil;Protection From Good;Protection From Law;' +
      'Remove Fear;Sanctuary;Shield Of Faith;Summon Monster I",' +
      '"C2:Aid;Align Weapon;Augury;Bear\'s Endurance;Bull\'s Strength;' +
      'Calm Emotions;Consecrate;Cure Moderate Wounds;Darkness;Death Knell;' +
      'Delay Poison;Desecrate;Eagle\'s Splendor;Enthrall;Find Traps;' +
      'Gentle Repose;Hold Person;Inflict Moderate Wounds;Lesser Restoration;' +
      'Make Whole;Owl\'s Wisdom;Remove Paralysis;Resist Energy;Shatter;' +
      'Shield Other;Silence;Sound Burst;Spiritual Weapon;Status;' +
      'Summon Monster II;Undetectable Alignment;Zone Of Truth",' +
      '"C3:Animate Dead;Bestow Curse;Blindness/Deafness;Contagion;' +
      'Continual Flame;Create Food And Water;Cure Serious Wounds;Daylight;' +
      'Deeper Darkness;Dispel Magic;Glyph Of Warding;Helping Hand;' +
      'Inflict Serious Wounds;Invisibility Purge;Locate Object;' +
      'Magic Circle Against Chaos;Magic Circle Against Evil;' +
      'Magic Circle Against Good;Magic Circle Against Law;Magic Vestment;' +
      'Meld Into Stone;Obscure Object;Prayer;Protection From Energy;' +
      'Remove Blindness/Deafness;Remove Curse;Remove Disease;Searing Light;' +
      'Speak With Dead;Stone Shape;Summon Monster III;Water Breathing;' +
      'Water Walk;Wind Wall",' +
      '"C4:Air Walk;Chaos Hammer;Control Water;Cure Critical Wounds;' +
      'Death Ward;Dimensional Anchor;Discern Lies;Dismissal;Divination;' +
      'Divine Power;Freedom Of Movement;Giant Vermin;Greater Magic Weapon;' +
      'Holy Smite;Imbue With Spell Ability;Inflict Critical Wounds;' +
      'Lesser Planar Ally;Neutralize Poison;Order\'s Wrath;Poison;' +
      'Repel Vermin;Restoration;Sending;Spell Immunity;Summon Monster IV;' +
      'Tongues;Unholy Blight",' +
      '"C5:Atonement;Break Enchantment;Breath Of Life;Commune;Dispel Chaos;' +
      'Dispel Evil;Dispel Good;Dispel Law;Disrupting Weapon;Flame Strike;' +
      'Greater Command;Hallow;Insect Plague;Mark Of Justice;' +
      'Mass Cure Light Wounds;Mass Inflict Light Wounds;Plane Shift;' +
      'Raise Dead;Righteous Might;Scrying;Slay Living;Spell Resistance;' +
      'Summon Monster V;Symbol Of Pain;Symbol Of Sleep;True Seeing;Unhallow;' +
      'Wall Of Stone",' +
      '"C6:Animate Objects;Antilife Shell;Banishment;Blade Barrier;' +
      'Create Undead;Find The Path;Forbiddance;Geas/Quest;' +
      'Greater Dispel Magic;Greater Glyph Of Warding;Harm;Heal;' +
      'Heroes\' Feast;Mass Bear\'s Endurance;Mass Bull\'s Strength;' +
      'Mass Cure Moderate Wounds;Mass Eagle\'s Splendor;' +
      'Mass Inflict Moderate Wounds;Mass Owl\'s Wisdom;Planar Ally;' +
      'Summon Monster VI;Symbol Of Fear;Symbol Of Persuasion;' +
      'Undeath To Death;Wind Walk;Word Of Recall",' +
      '"C7:Blasphemy;Control Weather;Destruction;Dictum;Ethereal Jaunt;' +
      'Greater Restoration;Greater Scrying;Holy Word;' +
      'Mass Cure Serious Wounds;Mass Inflict Serious Wounds;Refuge;' +
      'Regenerate;Repulsion;Resurrection;Summon Monster VII;' +
      'Symbol Of Stunning;Symbol Of Weakness;Word Of Chaos",' +
      '"C8:Antimagic Field;Cloak Of Chaos;Create Greater Undead;' +
      'Dimensional Lock;Discern Location;Earthquake;Fire Storm;' +
      'Greater Planar Ally;Greater Spell Immunity;Holy Aura;' +
      'Mass Cure Critical Wounds;Mass Inflict Critical Wounds;Shield Of Law;' +
      'Summon Monster VIII;Symbol Of Death;Symbol Of Insanity;Unholy Aura",' +
      '"C9:Astral Projection;Energy Drain;Etherealness;Gate;Implosion;' +
      'Mass Heal;Miracle;Soul Bind;Storm Of Vengeance;Summon Monster IX;' +
      'True Resurrection"',
  'Druid':
    'Require="alignment =~ \'Neutral\'","armor =~ \'None|Hide|Leather|Padded\'","shield =~ \'None|Wooden\'" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Club/Dagger/Dart/Quarterstaff/Scimitar/Scythe/Sickle/Shortspear/Sling/Spear)",' +
      '"1:Nature Sense","1:Spontaneous Druid Spell","1:Wild Empathy",' +
      '"2:Woodland Stride","3:Trackless Step","4:Resist Nature\'s Lure",' +
      '"4:Wild Shape","9:Venom Immunity","13:Thousand Faces",' +
      '"15:Timeless Body" ' +
    'Selectables=' +
      '"1:Animal Companion","1:Air Domain","1:Animal Domain",' +
      '"1:Earth Domain","1:Fire Domain","1:Plant Domain","1:Water Domain",' +
      '"1:Weather Domain" ' +
    'Languages=Druidic ' +
    'CasterLevelDivine=levels.Druid ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'D0:1=3;2=4,' +
      'D1:1=1;2=2;4=3;7=4,' +
      'D2:3=1;4=2;6=3;9=4,' +
      'D3:5=1;6=2;8=3;11=4,' +
      'D4:7=1;8=2;10=3;13=4,' +
      'D5:9=1;10=2;12=3;15=4,' +
      'D6:11=1;12=2;14=3;17=4,' +
      'D7:13=1;14=2;16=3;19=4,' +
      'D8:15=1;16=2;18=3;20=4,' +
      'D9:17=1;18=2;19=3;20=4 ' +
      'Spells=' +
      '"D0:Create Water;Detect Magic;Detect Poison;Flare;Guidance;' +
      'Know Direction;Light;Mending;Purify Food And Drink;Read Magic;' +
      'Resistance;Stabilize;Virtue",' +
      '"D1:Calm Animals;Charm Animal;Cure Light Wounds;' +
      'Detect Animals Or Plants;Detect Snares And Pits;Endure Elements;' +
      'Entangle;Faerie Fire;Goodberry;Hide From Animals;Jump;Longstrider;' +
      'Magic Fang;Magic Stone;Obscuring Mist;Pass Without Trace;' +
      'Produce Flame;Shillelagh;Speak With Animals;Summon Nature\'s Ally I",' +
      '"D2:Animal Messenger;Animal Trance;Barkskin;Bear\'s Endurance;' +
      'Bull\'s Strength;Cat\'s Grace;Chill Metal;Delay Poison;Fire Trap;' +
      'Flame Blade;Flaming Sphere;Fog Cloud;Gust Of Wind;Heat Metal;' +
      'Hold Animal;Lesser Restoration;Owl\'s Wisdom;Reduce Animal;' +
      'Resist Energy;Soften Earth And Stone;Spider Climb;' +
      'Summon Nature\'s Ally II;Summon Swarm;Tree Shape;Warp Wood",' +
      '"D3:Call Lightning;Contagion;Cure Moderate Wounds;Daylight;' +
      'Diminish Plants;Dominate Animal;Greater Magic Fang;Meld Into Stone;' +
      'Neutralize Poison;Plant Growth;Poison;Protection From Energy;Quench;' +
      'Remove Disease;Sleet Storm;Snare;Speak With Plants;Spike Growth;' +
      'Stone Shape;Summon Nature\'s Ally III;Water Breathing;Wind Wall;' +
      'Wood Shape",' +
      '"D4:Air Walk;Antiplant Shell;Blight;Command Plants;Control Water;' +
      'Cure Serious Wounds;Dispel Magic;Flame Strike;Freedom Of Movement;' +
      'Giant Vermin;Ice Storm;Reincarnate;Repel Vermin;Rusting Grasp;Scrying;' +
      'Spike Stones;Summon Nature\'s Ally IV",' +
      '"D5:Atonement;Awaken;Baleful Polymorph;Call Lightning Storm;' +
      'Commune With Nature;Control Winds;Cure Critical Wounds;Death Ward;' +
      'Hallow;Insect Plague;Stoneskin;Summon Nature\'s Ally V;' +
      'Transmute Mud To Rock;Transmute Rock To Mud;Tree Stride;Unhallow;' +
      'Wall Of Fire;Wall Of Thorns",' +
      '"D6:Antilife Shell;Find The Path;Fire Seeds;Greater Dispel Magic;' +
      'Ironwood;Liveoak;Mass Bear\'s Endurance;Mass Bull\'s Strength;' +
      'Mass Cat\'s Grace;Mass Cure Light Wounds;Mass Owl\'s Wisdom;' +
      'Move Earth;Repel Wood;Spellstaff;Stone Tell;Summon Nature\'s Ally VI;' +
      'Transport Via Plants;Wall Of Stone",' +
      '"D7:Animate Plants;Changestaff;Control Weather;Creeping Doom;' +
      'Fire Storm;Greater Scrying;Heal;Mass Cure Moderate Wounds;' +
      'Summon Nature\'s Ally VII;Sunbeam;Transmute Metal To Wood;True Seeing;' +
      'Wind Walk",' +
      '"D8:Animal Shapes;Control Plants;Earthquake;Finger Of Death;' +
      'Mass Cure Serious Wounds;Repel Metal Or Stone;Reverse Gravity;' +
      'Summon Nature\'s Ally VIII;Sunburst;Whirlwind;Word Of Recall",' +
      '"D9:Antipathy;Elemental Swarm;Foresight;Mass Cure Critical Wounds;' +
      'Regenerate;Shambler;Shapechange;Storm Of Vengeance;' +
      'Summon Nature\'s Ally IX;Sympathy"',
  'Fighter':
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Tower)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '2:Bravery,"3:Armor Training","5:Weapon Training","19:Armor Mastery",' +
      '"20:Weapon Mastery"',
  'Monk':
    'Require="alignment =~ \'Lawful\'" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Handaxe/Heavy Crossbow/Javelin/Kama/Light Crossbow/Nunchaku/Quarterstaff/Sai/Shortspear/Short Sword/Shuriken/Siangham/Sling/Spear)",' +
      '"1:Armor Class Bonus","1:Flurry Of Blows","1:Improved Unarmed Strike",' +
      '"1:Increased Unarmed Damage","1:Stunning Fist","1:Two-Weapon Fighting",'+
      '2:Evasion,"3:Fast Movement","3:Maneuver Training","3:Still Mind",' +
      '"4:Ki Dodge","4:Ki Pool","4:Ki Speed","4:Ki Strike","4:Slow Fall",' +
      '"5:High Jump","5:Purity Of Body","7:Wholeness Of Body",' +
      '"8:Condition Fist","8:Improved Two-Weapon Fighting",' +
      '"9:Improved Evasion","11:Diamond Body","12:Abundant Step",' +
      '"13:Diamond Soul","15:Greater Two-Weapon Fighting",' +
      '"15:Quivering Palm","17:Timeless Body",' +
      '"17:Tongue Of The Sun And Moon","19:Empty Body","20:Perfect Self" ' +
    'Selectables=' +
      '"1:Catch Off-Guard","1:Combat Reflexes","1:Deflect Arrows","1:Dodge",' +
      '"1:Improved Grapple","1:Scorpion Style","1:Throw Anything",' +
      '"6:Gorgon\'s Fist","6:Improved Bull Rush","6:Improved Disarm",' +
      '"6:Improved Feint","6:Improved Trip","6:Mobility",' +
      '"10:Medusa\'s Wrath","10:Snatch Arrows","10:Spring Attack" ' +
    'CasterLevelArcane="levels.Monk < 12 ? null : levels.Monk" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Monk4:12=1,' +
      'Monk9:19=1 ' +
    'Spells=' +
      '"Monk4:Dimension Door",' +
      'Monk9:Etherealness',
  'Paladin':
    'Require="alignment == \'Lawful Good\'" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '1:Aura,"1:Detect Evil","1:Smite Evil","2:Divine Grace",' +
      '"2:Lay On Hands","3:Aura Of Courage","3:Divine Health",3:Mercy,' +
      '"4:Channel Energy","8:Aura Of Resolve","14:Aura Of Faith",' +
      '"17:Aura Of Righteousness","17:Resist Evil","20:Holy Champion" ' +
    'Selectables=' +
      '"5:Divine Mount","5:Divine Weapon" ' +
    'CasterLevelDivine="levels.Paladin >= 4 ? levels.Paladin - 3 : null" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'P1:4=0;5=1;9=2;13=3;17=4,' +
      'P2:8=0;9=1;12=2;16=3;20=4,' +
      'P3:19=0;11=1;15=2;19=3,' +
      'P4:13=0;14=1;18=2;20=3 ' +
    'Spells=' +
      '"P1:Bless;Bless Water;Bless Weapon;Create Water;Cure Light Wounds;' +
      'Detect Poison;Detect Undead;Divine Favor;Endure Elements;' +
      'Lesser Restoration;Magic Weapon;Protection From Chaos;' +
      'Protection From Evil;Read Magic;Resistance;Virtue",' +
      '"P2:Bull\'s Strength;Delay Poison;Eagle\'s Splendor;Owl\'s Wisdom;' +
      'Remove Paralysis;Resist Energy;Shield Other;Undetectable Alignment;' +
      'Zone Of Truth",' +
      '"P3:Cure Moderate Wounds;Daylight;Discern Lies;Dispel Magic;' +
      'Greater Magic Weapon;Heal Mount;Magic Circle Against Chaos;' +
      'Protection From Evil;Prayer;Remove Blindness/Deafness;' +
      'Remove Curse",' +
      '"P4:Break Enchantment;Cure Serious Wounds;Death Ward;Dispel Chaos;' +
      'Dispel Evil;Holy Sword;Mark Of Justice;Neutralize Poison;Restoration"',
  'Ranger':
    'HitDie=d10 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Favored Enemy",1:Track,"1:Wild Empathy",3:Endurance,' +
      '"3:Favored Terrain","7:Woodland Stride","8:Swift Tracker",9:Evasion,' +
      '11:Quarry,12:Camouflage,"16:Improved Evasion",' +
      '"17:Hide In Plain Sight","19:Improved Quarry","20:Master Hunter" ' +
    'Selectables=' +
      '"2:Combat Style (Archery)","2:Combat Style (Two-Weapon Combat)",' +
      '"4:Animal Companion","4:Companion Bond",' +
      '"features.Combat Style (Archery) ? 2:Far Shot",' +
      '"features.Combat Style (Archery) ? 2:Point-Blank Shot",' +
      '"features.Combat Style (Archery) ? 2:Precise Shot",' +
      '"features.Combat Style (Archery) ? 2:Rapid Shot",' +
      '"features.Combat Style (Archery) ? 6:Improved Precise Shot",' +
      '"features.Combat Style (Archery) ? 6:Manyshot",' +
      '"features.Combat Style (Archery) ? 10:Pinpoint Targeting",' +
      '"features.Combat Style (Archery) ? 10:Shot On The Run",' +
      '"features.Combat Style (Two-Weapon Combat) ? 2:Double Slice",' +
      '"features.Combat Style (Two-Weapon Combat) ? 2:Improved Shield Bash",' +
      '"features.Combat Style (Two-Weapon Combat) ? 2:Quick Draw",' +
      '"features.Combat Style (Two-Weapon Combat) ? 2:Two-Weapon Fighting",' +
      '"features.Combat Style (Two-Weapon Combat) ? 6:Improved Two-Weapon Fighting",' +
      '"features.Combat Style (Two-Weapon Combat) ? 6:Two-Weapon Defense",' +
      '"features.Combat Style (Two-Weapon Combat) ? 10:Greater Two-Weapon Fighting",' +
      '"features.Combat Style (Two-Weapon Combat) ? 10:Two-Weapon Rend" ' +
    'CasterLevelDivine="levels.Ranger >= 4 ? levels.Ranger - 3 : null" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'R1:4=0;5=1;9=2;13=3;17=4,' +
      'R2:7=0;8=1;12=2;16=3;20=4,' +
      'R3:10=0;11=1;15=2;19=3,' +
      'R4:13=0;14=1;18=2;20=3 ' +
    'Spells=' +
      '"R1:Alarm;Animal Messenger;Calm Animals;Charm Animal;Delay Poison;' +
      'Detect Animals Or Plants;Detect Poison;Detect Snares And Pits;' +
      'Endure Elements;Entangle;Hide From Animals;Jump;Longstrider;' +
      'Magic Fang;Pass Without Trace;Read Magic;Resist Energy;' +
      'Speak With Animals;Summon Nature\'s Ally I",' +
      '"R2:Barkskin;Bear\'s Endurance;Cat\'s Grace;Cure Light Wounds;' +
      'Hold Animal;Owl\'s Wisdom;Protection From Energy;Snare;' +
      'Speak With Plants;Spike Growth;Summon Nature\'s Ally II;Wind Wall",' +
      '"R3:Command Plants;Cure Moderate Wounds;Darkvision;Diminish Plants;' +
      'Greater Magic Fang;Neutralize Poison;Plant Growth;Reduce Animal;' +
      'Remove Disease;Repel Vermin;Summon Nature\'s Ally III;Tree Shape;' +
      'Water Walk",' +
      '"R4:Animal Growth;Commune With Nature;Cure Serious Wounds;' +
      'Freedom Of Movement;Nondetection;Summon Nature\'s Ally IV;Tree Stride"',
  'Rogue':
    'HitDie=d8 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple/Hand Crossbow/Rapier/Shortbow/Short Sword)",' +
      '"1:Sneak Attack",1:Trapfinding,2:Evasion,"3:Trap Sense",' +
      '"4:Uncanny Dodge","8:Improved Uncanny Dodge","20:Master Strike" ' +
    'Selectables=' +
      '"2:Bleeding Attack","2:Combat Trick","2:Fast Stealth",' +
      '"2:Finesse Rogue","2:Ledge Walker","2:Minor Magic","2:Quick Disable",' +
      '2:Resiliency,"2:Rogue Crawl","2:Slow Reactions","2:Stand Up",' +
      '"2:Surprise Attack","2:Trap Spotter","2:Rogue Weapon Training",' +
      '"10:Crippling Strike","10:Defensive Roll","10:Feat Bonus",' +
      '"10:Improved Evasion",10:Opportunist,"10:Skill Mastery",' +
      '"10:Slippery Mind",' +
      '"features.Minor Magic ? 2:Major Magic",' +
      '"features.Major Magic ? 10:Dispelling Attack" ' +
    'CasterLevelArcane=levels.Rogue ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Rogue0:2=1,' +
      'Rogue1:2=1,' +
      'Rogue3:10=1 ' +
    'Spells=' +
      '"Rogue0:Acid Splash;Arcane Mark;Bleed;Dancing Lights;Daze;Detect Magic;'+
      'Detect Poison;Disrupt Undead;Flare;Ghost Sound;Light;Mage Hand;' +
      'Mending;Message;Open/Close;Prestidigitation;Ray Of Frost;Read Magic;' +
      'Resistance;Touch Of Fatigue",' +
      '"Rogue1:Alarm;Animate Rope;Burning Hands;Cause Fear;Charm Person;' +
      'Chill Touch;Color Spray;Comprehend Languages;Detect Secret Doors;' +
      'Detect Undead;Disguise Self;Endure Elements;Enlarge Person;Erase;' +
      'Expeditious Retreat;Feather Fall;Floating Disk;Grease;Hold Portal;' +
      'Hypnotism;Identify;Jump;Mage Armor;Magic Aura;Magic Missile;' +
      'Magic Weapon;Mount;Obscuring Mist;Protection From Chaos;' +
      'Protection From Evil;Protection From Good;Protection From Law;' +
      'Ray Of Enfeeblement;Reduce Person;Shield;Shocking Grasp;Silent Image;' +
      'Sleep;Summon Monster I;True Strike;Unseen Servant;Ventriloquism",' +
      '"Rogue3:Dispel Magic"',
  'Sorcerer':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Eschew Materials" ' +
    'Selectables=' +
      '"1:Bloodline Aberrant","1:Bloodline Abyssal","1:Bloodline Arcane",' +
      '"1:Bloodline Celestial","1:Bloodline Destined",' +
      '"1:Bloodline Draconic (Black)","1:Bloodline Draconic (Blue)",' +
      '"1:Bloodline Draconic (Green)","1:Bloodline Draconic (Red)",' +
      '"1:Bloodline Draconic (White)","1:Bloodline Draconic (Brass)",' +
      '"1:Bloodline Draconic (Bronze)","1:Bloodline Draconic (Copper)",' +
      '"1:Bloodline Draconic (Gold)","1:Bloodline Draconic (Silver)",' +
      '"1:Bloodline Elemental (Air)","1:Bloodline Elemental (Earth)",' +
      '"1:Bloodline Elemental (Fire)","1:Bloodline Elemental (Water)",' +
      '"1:Bloodline Fey","1:Bloodline Infernal","1:Bloodline Undead",' +
      '"features.Bloodline Arcane ? 1:Bonded Object",' +
      '"features.Bloodline Arcane ? 1:Familiar" ' +
    'CasterLevelDivine=levels.Sorcerer ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'S1:1=3;2=4;3=5;4=6,' +
      'S2:4=3;5=4;6=5;7=6,' +
      'S3:6=3;7=4;8=5;9=6,' +
      'S4:8=3;9=4;10=5;11=6,' +
      'S5:10=3;11=4;12=5;13=6,' +
      'S6:12=3;13=4;14=5;15=6,' +
      'S7:14=3;15=4;16=5;17=6,' +
      'S8:16=3;17=4;18=5;19=6,' +
      'S9:18=3;19=4;20=6',
  'Wizard':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Heavy Crossbow/Light Crossbow/Quarterstaff)",' +
      '"1:Scribe Scroll",' +
      '"features.School Specialization (None) ? 1:Hand Of The Apprentice",' +
      '"features.School Specialization (None) ? 8:Metamagic Mastery" ' +
    'Selectables=' +
      '"1:Bonded Object",1:Familiar,' +
      QuilvynUtils.getKeys(Pathfinder.SCHOOLS).map(x => '"1:School Specialization (' + (x == 'Universal' ? 'None' : x) + ')"').join(',') + ',' +
      QuilvynUtils.getKeys(Pathfinder.SCHOOLS).filter(x => x != 'Universal').map(x => '"1:School Opposition (' + x + ')"').join(',') + ' ' +
    'CasterLevelArcane=levels.Wizard ' +
    'SpellAbility=intelligence ' +
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
      'W9:17=1;18=2;19=3;20=4 ' +
    'Spells=' +
      '"W0:Acid Splash;Arcane Mark;Bleed;Dancing Lights;Daze;Detect Magic;' +
      'Detect Poison;Disrupt Undead;Flare;Ghost Sound;Light;Mage Hand;' +
      'Mending;Message;Open/Close;Prestidigitation;Ray Of Frost;Read Magic;' +
      'Resistance;Touch Of Fatigue",' +
      '"W1:Alarm;Animate Rope;Burning Hands;Cause Fear;Charm Person;' +
      'Chill Touch;Color Spray;Comprehend Languages;Detect Secret Doors;' +
      'Detect Undead;Disguise Self;Endure Elements;Enlarge Person;Erase;' +
      'Expeditious Retreat;Feather Fall;Floating Disk;Grease;Hold Portal;' +
      'Hypnotism;Identify;Jump;Mage Armor;Magic Aura;Magic Missile;' +
      'Magic Weapon;Mount;Obscuring Mist;Protection From Chaos;' +
      'Protection From Evil;Protection From Good;Protection From Law;' +
      'Ray Of Enfeeblement;Reduce Person;Shield;Shocking Grasp;Silent Image;' +
      'Sleep;Summon Monster I;True Strike;Unseen Servant;Ventriloquism",' +
      '"W2:Acid Arrow;Alter Self;Arcane Lock;Bear\'s Endurance;' +
      'Blindness/Deafness;Blur;Bull\'s Strength;Cat\'s Grace;Command Undead;' +
      'Continual Flame;Darkness;Darkvision;Daze Monster;Detect Thoughts;' +
      'Eagle\'s Splendor;False Life;Flaming Sphere;Fog Cloud;Fox\'s Cunning;' +
      'Ghoul Touch;Glitterdust;Gust Of Wind;Hideous Laughter;' +
      'Hypnotic Pattern;Invisibility;Knock;Levitate;Locate Object;' +
      'Magic Mouth;Make Whole;Minor Image;Mirror Image;Misdirection;' +
      'Obscure Object;Owl\'s Wisdom;Phantom Trap;Protection From Arrows;' +
      'Pyrotechnics;Resist Energy;Rope Trick;Scare;Scorching Ray;' +
      'See Invisibility;Shatter;Spectral Hand;Spider Climb;Summon Monster II;' +
      'Summon Swarm;Touch Of Idiocy;Web;Whispering Wind",' +
      '"W3:Arcane Sight;Beast Shape I;Blink;Clairaudience/Clairvoyance;' +
      'Daylight;Deep Slumber;Dispel Magic;Displacement;Explosive Runes;' +
      'Fireball;Flame Arrow;Fly;Gaseous Form;Gentle Repose;' +
      'Greater Magic Weapon;Halt Undead;Haste;Heroism;Hold Person;' +
      'Illusory Script;Invisibility Sphere;Keen Edge;Lightning Bolt;' +
      'Magic Circle Against Chaos;Magic Circle Against Evil;' +
      'Magic Circle Against Good;Magic Circle Against Law;Major Image;' +
      'Nondetection;Phantom Steed;Protection From Energy;Rage;' +
      'Ray Of Exhaustion;Secret Page;Sepia Snake Sigil;Shrink Item;' +
      'Sleet Storm;Slow;Stinking Cloud;Suggestion;Summon Monster III;' +
      'Tiny Hut;Tongues;Vampiric Touch;Water Breathing;Wind Wall",' +
      '"W4:Animate Dead;Arcane Eye;Beast Shape II;Bestow Curse;' +
      'Black Tentacles;Charm Monster;Confusion;Contagion;Crushing Despair;' +
      'Detect Scrying;Dimension Door;Dimensional Anchor;Elemental Body I;' +
      'Enervation;Fear;Fire Shield;Fire Trap;Greater Invisibility;' +
      'Hallucinatory Terrain;Ice Storm;Illusory Wall;Lesser Geas;' +
      'Lesser Globe Of Invulnerability;Locate Creature;Mass Enlarge Person;' +
      'Mass Reduce Person;Minor Creation;Mnemonic Enhancer;Phantasmal Killer;' +
      'Rainbow Pattern;Remove Curse;Resilient Sphere;Scrying;Secure Shelter;' +
      'Shadow Conjuration;Shout;Solid Fog;Stone Shape;Stoneskin;' +
      'Summon Monster IV;Wall Of Fire;Wall Of Ice",' +
      '"W5:Animal Growth;Baleful Polymorph;Beast Shape III;Blight;' +
      'Break Enchantment;Cloudkill;Cone Of Cold;Contact Other Plane;' +
      'Dismissal;Dominate Person;Dream;Elemental Body II;Fabricate;' +
      'False Vision;Feeblemind;Hold Monster;Interposing Hand;' +
      'Lesser Planar Binding;Mage\'s Faithful Hound;Mage\'s Private Sanctum;' +
      'Magic Jar;Major Creation;Mind Fog;Mirage Arcana;Nightmare;' +
      'Overland Flight;Passwall;Permanency;Persistent Image;Plant Shape I;' +
      'Polymorph;Prying Eyes;Secret Chest;Seeming;Sending;Shadow Evocation;' +
      'Summon Monster V;Symbol Of Pain;Symbol Of Sleep;Telekinesis;' +
      'Telepathic Bond;Teleport;Transmute Mud To Rock;Transmute Rock To Mud;' +
      'Wall Of Force;Wall Of Stone;Waves Of Fatigue",' +
      '"W6:Acid Fog;Analyze Dweomer;Antimagic Field;Bear\'s Endurance;' +
      'Beast Shape IV;Bull\'s Strength;Cat\'s Grace;Chain Lightning;' +
      'Circle Of Death;Contingency;Control Water;Create Undead;Disintegrate;' +
      'Eagle\'s Splendor;Elemental Body III;Eyebite;Flesh To Stone;' +
      'Forceful Hand;Form Of The Dragon I;Fox\'s Cunning;Freezing Sphere;' +
      'Geas/Quest;Globe Of Invulnerability;Greater Dispel Magic;' +
      'Greater Heroism;Guards And Wards;Legend Lore;Mage\'s Lucubration;' +
      'Mass Owl\'s Wisdom;Mass Suggestion;Mislead;Move Earth;Permanent Image;' +
      'Planar Binding;Plant Shape II;Programmed Image;Repulsion;Shadow Walk;' +
      'Stone To Flesh;Summon Monster VI;Symbol Of Fear;Symbol Of Persuasion;' +
      'Transformation;True Seeing;Undeath To Death;Veil;Wall Of Iron",' +
      '"W7:Banishment;Control Undead;Control Weather;Delayed Blast Fireball;' +
      'Elemental Body IV;Ethereal Jaunt;Finger Of Death;Forcecage;' +
      'Form Of The Dragon II;Giant Form I;Grasping Hand;Greater Arcane Sight;' +
      'Greater Polymorph;Greater Scrying;Greater Shadow Conjuration;' +
      'Greater Teleport;Insanity;Instant Summons;Limited Wish;' +
      'Mage\'s Magnificent Mansion;Mage\'s Sword;Mass Hold Person;' +
      'Mass Invisibility;Phase Door;Plane Shift;Plant Shape III;' +
      'Power Word Blind;Prismatic Spray;Project Image;Reverse Gravity;' +
      'Sequester;Simulacrum;Spell Turning;Statue;Summon Monster VII;' +
      'Symbol Of Weakness;Symbol Of Stunning;Teleport Object;Vision;' +
      'Waves Of Exhaustion",' +
      '"W8:Antipathy;Binding;Clenched Fist;Clone;Create Greater Undead;' +
      'Demand;Dimensional Lock;Discern Location;Form Of The Dragon III;' +
      'Giant Form II;Greater Planar Binding;Greater Prying Eyes;' +
      'Greater Shadow Evocation;Greater Shout;Horrid Wilting;' +
      'Incendiary Cloud;Iron Body;Irresistible Dance;Mass Charm Monster;Maze;' +
      'Mind Blank;Moment Of Prescience;Polar Ray;Polymorph Any Object;' +
      'Power Word Stun;Prismatic Wall;Protection From Spells;' +
      'Scintillating Pattern;Screen;Summon Monster VIII;Sunburst;' +
      'Symbol Of Death;Symbol Of Insanity;Sympathy;Telekinetic Sphere;' +
      'Temporal Stasis;Trap The Soul",' +
      '"W9:Astral Projection;Crushing Hand;Dominate Monster;Energy Drain;' +
      'Etherealness;Foresight;Freedom;Gate;Imprisonment;Mage\'s Disjunction;' +
      'Mass Hold Monster;Meteor Swarm;Power Word Kill;Prismatic Sphere;' +
      'Refuge;Shades;Shapechange;Soul Bind;Summon Monster IX;' +
      'Teleportation Circle;Time Stop;Wail Of The Banshee;Weird;Wish"'
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
  // No changes needed to the rules defined by SRD35 method
  // NOTE: SRD35.abilityRules adds SRD35 minimum ability checks (at least one
  // ability > 13, ability modifiers must sum to > 0), that are not in the PRD.
};

/* Defines rules related to animal companions and familiars. */
Pathfinder.aideRules = function(rules, companions, familiars) {
  SRD35.aideRules(rules, companions, familiars);
  // Override SRD35 HD calculation
  rules.defineRule('animalCompanionStats.HD',
    'companionMasterLevel', '=', 'source + 1 - Math.floor((source + 1) / 4)'
  );
  // Pathfinder-specific attributes
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
    'animalCompanionStats.Size', '+', 'source=="D" ? -4 : source=="T" ? -2 : source=="S" ? -1 : source=="L" ? 1 : null'
  );
  rules.defineRule('animalCompanionStats.CMD',
    'companionBAB', '=', 'source + 10',
    'animalCompanionStats.Dex', '+', 'Math.floor((source - 10) / 2)',
    'animalCompanionStats.Str', '+', 'Math.floor((source - 10) / 2)',
    'animalCompanionStats.Size', '+', 'source=="D" ? -4 : source=="T" ? -2 : source=="S" ? -1 : source=="L" ? 1 : null'
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
    'features.Familiar', '?', null,
    'familiarStats.Dex', '=', null,
    'familiarStats.Str', '^', null
  );
  rules.defineRule('familiarBAB',
    'features.Familiar', '?', null,
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
    'animalCompanionStats.Adv', '=', null,
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
  rules.defineRule('combatManeuverBonus',
    'baseAttack', '=', null,
    'strengthModifier', '+', null
  );
  rules.defineRule('combatManeuverDefense',
    'baseAttack', '=', '10 + source',
    'strengthModifier', '+', null,
    'combatNotes.dexterityArmorClassAdjustment', '+', null
  );
  rules.defineSheetElement(
    'CombatManeuver', 'CombatStats/',
    '<b>Combat Maneuver Bonus/Defense</b>: %V', '/'
  );
  rules.defineSheetElement('Combat Maneuver Bonus', 'CombatManeuver/', '%V');
  rules.defineSheetElement('Combat Maneuver Defense', 'CombatManeuver/', '%V');
};

/* Defines the rules related to goodies included in character notes. */
Pathfinder.goodiesRules = function(rules) {
  SRD35.goodiesRules(rules);
  // Pathfinder-specific attributes
  rules.defineRule('combatNotes.goodiesCMDAdjustment',
    'goodiesAffectingAC', '=',
      'source.filter(item => !item.match(/\\b(armor|shield)\\b/i)).reduce(' +
        'function(total, item) {' +
          'return total + ((item + "+0").match(/[-+]\\d+/) - 0);' +
        '}' +
      ', 0)'
  );
  rules.defineRule
    ('combatManeuverDefense', 'combatNotes.goodiesCMDAdjustment', '+', null);
};

/* Defines rules related to basic character identity. */
Pathfinder.identityRules = function(
  rules, alignments, classes, deities, factions, paths, races, tracks, traits
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Weapon']);
  // Note addition of feats and skills to SRD35's list
  QuilvynUtils.checkAttrTable
    (paths, ['Group', 'Level', 'Features', 'Selectables', 'Feats', 'Skills', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable(races, ['Require', 'Features', 'Selectables', 'Languages', 'SpellAbility', 'SpellSlots', 'Spells']);
  QuilvynUtils.checkAttrTable(factions, []);
  QuilvynUtils.checkAttrTable(tracks, ['Progression']);
  QuilvynUtils.checkAttrTable(traits, ['Type', 'Subtype']);

  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
  }
  for(var faction in factions) {
    rules.choiceRules(rules, 'Faction', faction, factions[faction]);
  }
  for(var path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'Race', race, races[race]);
  }
  for(var track in tracks) {
    rules.choiceRules(rules, 'Track', track, tracks[track]);
  }
  for(var trait in traits) {
    rules.choiceRules(rules, 'Trait', trait, traits[trait]);
  }

  rules.defineEditorElement
    ('faction', 'Faction', 'select-one', 'factions', 'experience');
  rules.defineSheetElement('Faction', 'Alignment');
  rules.defineEditorElement('traits', 'Traits', 'set', 'traits', 'skills');
  rules.defineSheetElement('Traits', 'Feats+', null, '; ');
  rules.defineChoice('extras', 'traits');
  rules.defineEditorElement
    ('experienceTrack', 'Track', 'select-one', 'tracks', 'levels');
  rules.defineSheetElement('Experience Track', 'ExperienceInfo/', ' (%V)');
  rules.defineEditorElement
    ('favoredClassHitPoints', 'Favored Class Hit Points', 'text', [4], 'armor');
  rules.defineEditorElement
    ('favoredClassSkillPoints', 'Favored Class Skill Points', 'text', [4],
     'armor');

  rules.defineRule('casterLevel',
    'casterLevelArcane', '=', null,
    'casterLevelDivine', '+=', null
  );
  rules.defineRule
    ('combatNotes.favoredClassHitPoints', 'favoredClassHitPoints', '=', null);
  rules.defineRule
    ('skillNotes.favoredClassSkillPoints', 'favoredClassSkillPoints', '=',null);
  rules.defineRule
    ('hitPoints', 'combatNotes.favoredClassHitPoints', '+=', null);
  rules.defineRule
    ('skillPoints', 'skillNotes.favoredClassSkillPoints', '+=', null);

  QuilvynRules.validAllocationRules
    (rules, 'level', 'level', 'Sum "^levels\\."');

};

/* Defines rules related to magic use. */
Pathfinder.magicRules = function(rules, schools, spells) {
  SRD35.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines rules related to character aptitudes. */
Pathfinder.talentRules = function(rules, feats, features, languages, skills) {
  SRD35.talentRules(rules, feats, features, languages, skills);
  // Override SRD35 intelligence skillPoint adjustment, feat count computation,
  // max ranks per skill, and armor skill check penalty and disable armor swim
  // check penalty.
  rules.defineRule
    ('skillNotes.intelligenceSkillPointsAdjustment', 'level', '*', null);
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');
  rules.defineRule('maxAllowedSkillAllocation', 'level', '=', null);
  rules.defineChoice
    ('notes', 'skillNotes.armorSkillCheckPenalty:-%V Dex- and Str-based skills');
  rules.defineRule('skillNotes.armorSwimCheckPenalty', 'level', '?', 'false');
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
  else if(type == 'Class') {
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
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder.SPELLS
    );
    Pathfinder.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Pathfinder.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'Faction')
    Pathfinder.factionRules(rules, name,
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
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    Pathfinder.languageRules(rules, name);
  else if(type == 'Path') {
    Pathfinder.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Feats'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder.SPELLS
    );
    Pathfinder.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    Pathfinder.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder.SPELLS
    );
    Pathfinder.raceRulesExtra(rules, name);
  } else if(type == 'School') {
    Pathfinder.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    Pathfinder.schoolRulesExtra(rules, name);
  } else if(type == 'Shield')
    Pathfinder.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    var untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    Pathfinder.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained != 'n' && untrained != 'N',
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergy')
    );
    Pathfinder.skillRulesExtra(rules, name);
  } else if(type == 'Spell')
    Pathfinder.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Track')
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
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature' && type != 'Path') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
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
 * character level attribute 'level'. #spellAbility#, if specified, names the
 * ability for computing spell difficulty class. #spellSlots# lists the
 * number of spells per level per day granted by the class, and #spells# lists
 * spells defined by the class. #spellDict# is the dictionary of all spells,
 * used to look up individual spell attributes.
 */
Pathfinder.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots, spells, spellDict
) {
  if(name == 'Monk') {
    var allFeats = rules.getChoices('feats');
    for(var feat in allFeats) {
      if(feat.startsWith('Improved Critical'))
        selectables.push('10:' + feat);
    }
  }
  SRD35.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots, spells, spellDict
  );
  // Override SRD35 skillPoints rule
  rules.defineRule
    ('skillPoints', 'levels.' + name, '+', 'source * ' + skillPoints);
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * directly derived from the attributes passed to classRules.
 */
Pathfinder.classRulesExtra = function(rules, name) {

  if(name == 'Barbarian') {

    rules.defineRule
      ('abilityNotes.fastMovement', 'levels.Barbarian', '+=', '10');
    rules.defineRule('combatNotes.animalFury',
      '', '=', '"d4"',
      'features.Large', '=', '"' + SRD35.LARGE_DAMAGE['d4'] + '"',
      'features.Small', '=', '"' + SRD35.SMALL_DAMAGE['d4'] + '"'
    );
    rules.defineRule('combatNotes.animalFury.1',
      'features.Animal Fury', '?', null,
      'strengthModifier', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('combatNotes.knockback', 'strengthModifier', '=', 'source + 2');
    rules.defineRule('combatNotes.guardedStance',
      'constitutionModifier', '=', 'Math.max(source, 1)',
      'levels.Barbarian', '+', 'Math.floor(source / 6)'
    );
    rules.defineRule('combatNotes.powerfulBlow',
      'levels.Barbarian', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.rage',
      'constitutionModifier', '=', '4 + source',
      'levels.Barbarian', '+', '(source - 1) * 2'
    );
    rules.defineRule('combatNotes.rollingDodge',
      'levels.Barbarian', '=', '1 + Math.floor(source / 6)'
    );
    rules.defineRule('combatNotes.rollingDodge.1',
      'features.Rolling Dodge', '?', null,
      'constitutionModifier', '=', 'Math.max(1, source)'
    );
    rules.defineRule
      ('combatNotes.strengthSurge', 'levels.Barbarian', '=', null);
    rules.defineRule('combatNotes.surpriseAccuracy',
      'levels.Barbarian', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.terrifyingHowl',
      'levels.Barbarian', '=', '10 + Math.floor(source / 2)',
      'strengthModifier', '+', null
    );
    rules.defineRule('magicNotes.renewedVigor',
      'levels.Barbarian', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('magicNotes.renewedVigor.1',
      'features.Renewed Vigor', '?', null,
      'constitutionModifier', '=', 'source + 2'
    );
    rules.defineRule('selectableFeatureCount.Barbarian',
      'levels.Barbarian', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.superstition',
      'levels.Barbarian', '=', '2 + Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.trapSense',
      'levels.Barbarian', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
    );
    rules.defineRule('skillNotes.ragingClimber', 'levels.Barbarian', '=', null);
    rules.defineRule('skillNotes.ragingLeaper', 'levels.Barbarian', '=', null);
    rules.defineRule('skillNotes.ragingSwimmer', 'levels.Barbarian', '=', null);
    rules.defineRule('barbarianFeatures.Improved Uncanny Dodge',
      'barbarianFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Barbarian', '+=', null,
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Barbarian', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Bard') {

    rules.defineRule('featureNotes.bardicPerformance',
      'levels.Bard', '=', '2 + 2 * source',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.simpleSomatics.1', 'v', '0'
    );
    rules.defineRule('magicNotes.deadlyPerformance',
      'levels.Bard', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.fascinate',
      'levels.Bard', '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.fascinate.1',
      'levels.Bard', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.fascinate.2',
      'levels.Bard', '=', 'Math.floor(source / 2) + 10',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.frighteningTune',
      'levels.Bard', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.inspireCompetence',
      'levels.Bard', '=', '1 + Math.floor((source + 1) / 4)'
    );
    rules.defineRule('magicNotes.inspireCourage',
      'levels.Bard', '=', '1 + Math.floor((source + 1) / 6)'
    );
    rules.defineRule('magicNotes.inspireGreatness',
      'levels.Bard', '=', 'Math.floor((source - 6) / 3)'
    );
    rules.defineRule('magicNotes.inspireHeroics',
      'levels.Bard', '=', 'Math.floor((source - 12) / 3)'
    );
    rules.defineRule('magicNotes.massSuggestion',
      'levels.Bard', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.simpleSomatics.1',
      'magicNotes.simpleSomatics', '?', null,
      'armorWeight', '=', 'source <= 1 ? 1 : null'
    );
    rules.defineRule('magicNotes.suggestion',
      'levels.Bard', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule(/^skillModifier.Knowledge/,
      'skillNotes.bardicKnowledge', '+', null
    );
    rules.defineRule('skillNotes.bardicKnowledge',
      'levels.Bard', '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.loreMaster',
      'levels.Bard', '=', '1 + Math.floor((source + 1) / 6)'
    );

  } else if(name == 'Cleric') {

    rules.defineRule('magicNotes.channelEnergy',
      'levels.Cleric', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.channelEnergy.1',
      'features.Channel Energy', '?', null,
      'levels.Cleric', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.channelEnergy.2',
      'features.Channel Energy', '?', null,
      'charismaModifier', '=', '3 + source'
    );
    rules.defineRule
      ('selectableFeatureCount.Cleric', 'levels.Cleric', '+=', '2');
    rules.defineRule('turningLevel',
      'features.Turn Undead', '?', null,
      'levels.Cleric', '+=', null
    );

  } else if(name == 'Druid') {

    rules.defineRule('companionDruidLevel',
      'druidFeatures.Animal Companion', '?', null,
      'levels.Druid', '=', null
    );
    rules.defineRule('companionMasterLevel', 'companionDruidLevel', '^=', null);
    rules.defineRule('magicNotes.wildShape',
      'levels.Druid', '=',
        'source < 4 ? null : ' +
        'source < 6 ? "small-medium" : ' +
        'source < 8 ? "tiny-large/small elemental" : ' +
        'source < 10 ? "diminutive-huge/medium elemental" : ' +
        'source < 12 ? "diminutive-huge/large elemental/plant" : ' +
        '"diminutive-huge/elemental/plant"'
    );
    rules.defineRule('magicNotes.wildShape.1', 'levels.Druid', '=', null);
    rules.defineRule('magicNotes.wildShape.2',
      'levels.Druid', '=', 'Math.floor((source - 2) / 2)'
    );
    rules.defineRule('selectableFeatureCount.Druid', 'levels.Druid', '=', '1');
    rules.defineRule('skillNotes.wildEmpathy',
      'levels.Druid', '+=', null,
      'charismaModifier', '+', null
    );

  } else if(name == 'Fighter') {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.armorTraining.1', '^', 'source >= 0 ? 0 : null'
    );
    rules.defineRule('abilityNotes.armorTraining',
      'levels.Fighter', '=', 'source >= 7 ? "heavy" : "medium"'
    );
    rules.defineRule('abilityNotes.armorTraining.1',
      'abilityNotes.armorTraining', '=', 'source == "heavy" ? 3 : 2',
      'armorWeight', '+', '-source'
    );
    rules.defineRule('armorClass', 'combatNotes.armorTraining', '+', null);
    rules.defineRule
      ('combatManeuverDefense', 'combatNotes.armorTraining', '+', null);
    rules.defineRule('combatNotes.armorTraining',
      'dexterityModifier', '=', null,
      'combatNotes.dexterityArmorClassAdjustment', '+', '-source',
      'levels.Fighter', 'v', 'Math.floor((source + 1) / 4)',
      '', '^', '0'
    );
    rules.defineRule('featCount.Fighter',
      'levels.Fighter', '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.bravery',
      'levels.Fighter', '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.armorTraining', '+', '-source'
    );
    rules.defineRule('skillNotes.armorTraining',
      'levels.Fighter', '=', 'Math.floor((source + 1) / 4)'
    );

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.fastMovement',
      'levels.Monk', '+=', '10 * Math.floor(source / 3)'
    );
    rules.defineRule('abilityNotes.unarmoredSpeedBonus',
      'armor', '?', 'source == "None"',
      'levels.Monk', '=', 'Math.floor(source / 3) * 10'
    );
    rules.defineRule
      ('combatNotes.flurryOfBlows', 'attacksPerRound', '=', 'source + 1');
    rules.defineRule('combatNotes.flurryOfBlows.1',
      'levels.Monk', '=', 'source - 2',
      'meleeAttack', '+', null,
      'baseAttack', '+', '-source'
    );
    rules.defineRule('combatNotes.kiStrike',
      'levels.Monk', '=',
      '"magic" + ' +
      '(source < 7 ? "" : "/iron/silver") + ' +
      '(source < 10 ? "" : "/lawful") + ' +
      '(source < 16 ? "" : "/adamantine")'
    )
    rules.defineRule('combatNotes.armorClassBonus',
      'armor', '?', 'source == "None"',
      'levels.Monk', '+=', 'Math.floor(source / 4)',
      'wisdomModifier', '+', 'Math.max(source, 0)'
    );
    rules.defineRule('combatNotes.conditionFist',
      'levels.Monk', '=', '"fatigued" + ' +
        '(source < 8 ? "" : "/sickened") + ' +
        '(source < 12 ? "" : "/staggered") + ' +
        '(source < 16 ? "" : "/blind/deafened") + ' +
        '(source < 20 ? "" : "/paralyzed")'
    );
    rules.defineRule('combatNotes.maneuverTraining',
      'levels.Monk', '=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('combatNotes.quiveringPalm',
      'levels.Monk', '+=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.stunningFist', 'levels.Monk', '^=', null);
    rules.defineRule('combatNotes.stunningFist.1',
      'features.Stunning Fist', '?', null,
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('featureNotes.kiPool',
      'levels.Monk', '=', 'Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.wholenessOfBody', 'levels.Monk', '=', null);
    rules.defineRule('saveNotes.diamondSoul', 'levels.Monk', '+=', '10+source');
    rules.defineRule('saveNotes.slowFall',
      'levels.Monk', '=',
      'source < 4 ? null : source < 20 ? Math.floor(source / 2) * 10 : "all"'
    );
    rules.defineRule('selectableFeatureCount.Monk',
      'levels.Monk', '=', '1 + Math.floor((source + 2) / 4)'
    );
    rules.defineRule('skillNotes.highJump', 'levels.Monk', '=', null);
    rules.defineRule('speed', 'abilityNotes.fastMovement', '+', null);
    // NOTE Our rule engine doesn't support modifying a value via indexing.
    // Here, we work around this limitation by defining rules that set global
    // values as a side effect, then use these values in our calculations.
    rules.defineRule('combatNotes.increasedUnarmedDamage',
      'levels.Monk', '=',
        'SRD35.SMALL_DAMAGE["monk"] = ' +
        'SRD35.LARGE_DAMAGE["monk"] = ' +
        'source < 12 ? ("d" + (6 + Math.floor(source / 4) * 2)) : ' +
        '              ("2d" + (6 + Math.floor((source - 12) / 4) * 2))',
      'features.Small', '=', 'SRD35.SMALL_DAMAGE[SRD35.SMALL_DAMAGE["monk"]]',
      'features.Large', '=', 'SRD35.LARGE_DAMAGE[SRD35.LARGE_DAMAGE["monk"]]'
    );

  } else if(name == 'Paladin') {

    rules.defineRule('animalCompanion.Celestial',
      'companionPaladinLevel', '=', 'source >= 11 ? 1 : null'
    );
    rules.defineRule('animalCompanionFeatures.Companion Resist Spells',
      'companionPaladinLevel', '=', 'source >= 15 ? 1 : null'
    );
    rules.defineRule
      ('animalCompanionStats.Int', 'companionPaladinLevel', '^', '6');
    rules.defineRule('animalCompanionStats.SR',
      'companionPaladinLevel', '^=', 'source >= 15 ? source + 11 : null'
    );
    rules.defineRule('combatNotes.auraOfRighteousness',
      'levels.Paladin', '=', 'source >= 20 ? 10 : 5'
    );
    rules.defineRule('combatNotes.divineWeapon',
      'levels.Paladin', '=', 'Math.floor((source - 2) / 3)'
    );
    rules.defineRule('combatNotes.divineWeapon.1', 'levels.Paladin', '=', null);
    rules.defineRule('combatNotes.divineWeapon.2',
      'levels.Paladin', '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule
      ('combatNotes.smiteEvil', 'charismaModifier', '=', 'Math.max(source, 0)');
    rules.defineRule('combatNotes.smiteEvil.1', 'levels.Paladin', '=', null);
    rules.defineRule('combatNotes.smiteEvil.2',
      'features.Smite Evil', '?', null,
      'charismaModifier', '=', 'source > 0 ? source : 0'
    );
    rules.defineRule('combatNotes.smiteEvil.3',
      'levels.Paladin', '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule
      ('companionMasterLevel', 'companionPaladinLevel', '^=', null);
    rules.defineRule('companionPaladinLevel',
      'paladinFeatures.Divine Mount', '?', null,
      'levels.Paladin', '=', null,
    );
    rules.defineRule('featureNotes.divineMount',
      'companionPaladinLevel', '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('magicNotes.channelEnergy',
      'levels.Paladin', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.channelEnergy.1',
      'levels.Paladin', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule
      ('magicNotes.channelEnergy.2', 'charismaModifier', '=', '3 + source');
    rules.defineRule('magicNotes.holyChampion', 'levels.Paladin', '=', null);
    rules.defineRule('magicNotes.layOnHands',
      'levels.Paladin', '=', 'Math.floor(source / 2)'
    )
    rules.defineRule('magicNotes.layOnHands.1',
      'levels.Paladin', '=', 'Math.floor(source / 2)',
      'charismaModifier', '+', null
    )
    rules.defineRule('magicNotes.removeDisease',
      'levels.Paladin', '=', 'Math.floor((source - 3) / 3)'
    );
    rules.defineRule('saveNotes.divineGrace', 'charismaModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Paladin',
      'levels.Paladin', '=', 'source >= 5 ? 1 : null'
    );

  } else if(name == 'Ranger') {

    rules.defineRule('combatNotes.favoredEnemy',
      'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.favoredTerrain',
      'levels.Ranger', '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('combatNotes.companionBond', 'wisdomModifier', '=', null);
    rules.defineRule('combatNotes.masterHunter',
      'levels.Ranger', '=', 'Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.quarry',
      '', '=', '2',
      'features.Improved Quarry', '^', '4'
    );
    rules.defineRule
      ('companionMasterLevel', 'companionRangerLevel', '^=', null);
    rules.defineRule('companionRangerLevel',
      'rangerFeatures.Animal Companion', '?', null,
      'levels.Ranger', '+=', 'source - 3'
    );
    rules.defineRule('selectableFeatureCount.Ranger',
      'levels.Ranger', '=',
      'source >= 2 ? Math.floor((source+6) / 4) + (source >= 4 ? 1 : 0) : null'
    );
    rules.defineRule('skillNotes.favoredEnemy',
      'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('skillNotes.favoredTerrain',
      'levels.Ranger', '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('skillNotes.quarry',
      '', '=', '10',
      'features.Improved Quarry', '^', '20'
    );
    rules.defineRule('skillNotes.track',
      'levels.Ranger', '+=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('skillNotes.wildEmpathy',
      'levels.Ranger', '+=', null,
      'charismaModifier', '+', null
    );

  } else if(name == 'Rogue') {

    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'rogueWeaponTraining',
      'features.Rogue Weapon Training', 'Sum \'features\\.Weapon Focus\' >= 1'
    );
    rules.defineRule('combatNotes.bleedingAttack',
      'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Rogue', '+=', null,
      '', '+', '4'
    );
    rules.defineRule('combatNotes.masterStrike',
      'levels.Rogue', '+=', '10 + Math.floor(source / 2)',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.resiliency', 'levels.Rogue', '=', null);
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('features.Weapon Finesse', 'features.Finesse Rogue', '=', '1');
    rules.defineRule('rogueFeatures.Improved Uncanny Dodge',
      'rogueFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('saveNotes.trapSense',
      'levels.Rogue', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('selectableFeatureCount.Rogue',
      'levels.Rogue', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.skillMastery',
      'intelligenceModifier', '=', 'source + 3',
      'rogueFeatures.Skill Mastery', '*', null
    );
    rules.defineRule('skillNotes.trapfinding',
      'levels.Rogue', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('spellSlots.Rogue0', 'features.Minor Magic', '?', null);
    rules.defineRule('spellSlots.Rogue1', 'features.Major Magic', '?', null);
    rules.defineRule
      ('spellSlots.Rogue3', 'features.Dispelling Attack', '?', null);
    rules.defineRule('uncannyDodgeSources',
      'levels.Rogue', '+=', 'source >= 4 ? 1 : null'
    );

  } else if(name == 'Sorcerer') {

    rules.defineRule
      ('selectableFeatureCount.Sorcerer', 'levels.Sorcerer', '=', '1');
    rules.defineRule('casterLevels.S', 'casterLevels.Sorcerer', '^=', null);
    rules.defineRule('spellDifficultyClass.S',
      'casterLevels.S', '?', null,
      'charismaModifier', '=', '10 + source'
    );

  } else if(name == 'Wizard') {

    rules.defineRule('familiarMasterLevel', 'familiarWizardLevel', '^=', null);
    rules.defineRule('familiarWizardLevel',
      'wizardFeatures.Familiar', '?', null,
      'levels.Wizard', '+=', null
    );
    rules.defineRule('featCount.Wizard',
      'levels.Wizard', '=', 'source >= 5 ? Math.floor(source / 5) : null'
    );
    rules.defineRule
      ('selectableFeatureCount.Wizard', 'levels.Wizard', '=', '2');

    var schools = rules.getChoices('schools');
    for(var school in schools) {
      if(school == 'Universal')
        continue;
      rules.defineRule('selectableFeatureCount.Wizard',
        'wizardFeatures.School Specialization (' + school + ')', '+', '2'
      );
      for(var i = 1; i <= 9; i++) {
        rules.defineRule('spellSlots.W' + i,
          'magicNotes.schoolSpecialization(' + school + ')', '+', '1'
        );
      }
    }

    rules.defineRule('combatNotes.handOfTheApprentice',
      'baseAttack', '=', null,
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.handOfTheApprentice.1',
      'features.Hand Of The Apprentice', '?', null,
      'intelligenceModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.metamagicMastery',
      'levels.Wizard', '=', 'source >= 8 ? Math.floor((source - 6) / 2) : null'
    );

  }

};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack#, does
 * #damage# damage, and is size #size#. If specified, #level# indicates the
 * minimum master level the character needs to have this animal as a companion.
 */
Pathfinder.companionRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level
) {
  // NOTE The PRD caclulates HD from master level, in contrast to the SRD's
  // addition to a starting value
  SRD35.companionRules
    (rules, name, str, dex, con, intel, wis, cha, 1, ac, attack, damage, size, level);
  if(name.startsWith('Advanced ') && level) {
    var name = name.replace('Advanced ', '');
    rules.defineRule
      ('animalCompanionStats.Adv', 'animalCompanion.' + name, '=', level);
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
  for(var i = 0; i < weapons.length; i++) {
    var weapon = weapons[i];
    var focusFeature = 'Weapon Focus (' + weapon + ')';
    var proficiencyFeature = 'Weapon Proficiency (' + weapon + ')';
    rules.defineRule
      ('clericFeatures.' + focusFeature, 'levels.Cleric', '?', 'source == 0');
    rules.defineRule('clericFeatures.' + proficiencyFeature,
      'levels.Cleric', '?', null,
      'deityFavoredWeapon', '=', 'source.indexOf("'+weapon+'")>=0 ? 1 : null',
      'featureNotes.weaponOfWar', '=', 'null'
    );
  }
};

/* Defines in #rules the rules assocated with faction #name#. */
Pathfinder.factionRules = function(rules, name) {
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
 * #damage# damage, and is size #size#. If specified, #level# indicates the
 * minimum master level the character needs to have this animal as a familiar.
 */
Pathfinder.familiarRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level
) {
  SRD35.familiarRules
    (rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level);
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

  var matchInfo;

  if(name == 'Acrobatic') {
    rules.defineRule('skillNotes.acrobatic',
      'skills.Acrobatics', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Agile Maneuvers') {
    rules.defineRule('combatNotes.agileManeuvers',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  } else if(name == 'Alertness') {
    rules.defineRule('skillNotes.alertness',
      'skills.Perception', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Animal Affinity') {
    rules.defineRule('skillNotes.animalAffinity',
      'skills.Handle Animal', '=', 'source >= 10 ? 4 : 2'
    );
    rules.defineRule
      ('skillNotes.animalAffinity', 'skills.Ride', '=', 'source >= 10 ? 4 : 2');
  } else if(name == 'Arcane Armor Mastery') {
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.arcaneArmorMastery', '+', '-10',
      '', '^', '0'
    );
  } else if(name == 'Arcane Armor Training') {
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.arcaneArmorTraining', '+', '-10',
      '', '^', '0'
    );
  } else if(name == 'Arcane Strike') {
    rules.defineRule('combatNotes.arcaneStrike',
      'casterLevelArcane', '=', 'Math.floor((source + 4) / 5)'
    );
  } else if(name == 'Athletic') {
    rules.defineRule
      ('skillNotes.athletic', 'skills.Climb', '=', 'source >= 10 ? 4 : 2');
  } else if(name == 'Blinding Critical') {
    rules.defineRule
      ('combatNotes.blindingCritical', 'baseAttack', '=', '10 + source');
  } else if(name == 'Combat Expertise') {
    rules.defineRule('combatNotes.combatExpertise',
      'baseAttack', '=', '1 + Math.floor(source / 4)'
    );
  } else if(name == 'Combat Reflexes') {
    rules.defineRule
      ('combatNotes.combatReflexes', 'dexterityModifier', '=', 'source + 1');
  } else if(name == 'Command Undead') {
    rules.defineRule('combatNotes.commandUndead',
      'levels.Cleric', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Deadly Aim') {
    rules.defineRule('combatNotes.deadlyAim',
      'baseAttack', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.deadlyAim.1',
      'features.Deadly Aim', '?', null,
      'baseAttack', '=', '2 * (1 + Math.floor(source / 4))'
    );
  } else if(name == 'Deafening Critical') {
    rules.defineRule
      ('combatNotes.deafeningCritical', 'baseAttack', '=', '10 + source');
  } else if(name == 'Deceitful') {
    rules.defineRule('skillNotes.deceitful',
      'skills.Bluff', '=', 'source >= 10 ? 4 : 2',
      'skills.Disguise', '^=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Defensive Combat Training') {
    rules.defineRule('combatNotes.defensiveCombatTraining',
      'level', '=', null,
      'baseAttack', '+', '-source'
    );
  } else if(name == 'Deft Hands') {
    rules.defineRule('skillNotes.deftHands',
      'skills.Disable Device', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Extra Channel') {
    rules.defineRule
      ('magicNotes.channelEnergy.2', 'magicNotes.extraChannel', '+', '2');
  } else if(name == 'Extra Ki') {
    rules.defineRule('featureNotes.kiPool', 'featureNotes.extraKi', '+', '2');
  } else if(name == 'Extra Lay On Hands') {
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.extraLayOnHands', '+', '2')
  } else if(name == 'Extra Performance') {
    rules.defineRule('featureNotes.bardicPerformance',
      'featureNotes.extraPerformance', '+', '6'
    );
  } else if(name == 'Extra Rage') {
    rules.defineRule('combatNotes.rage', 'featureNotes.extraRage', '+', '6');
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
      'skills.Spellcraft', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Persuasive') {
    rules.defineRule('skillNotes.persuasive',
      'skills.Diplomacy', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Power Attack') {
    rules.defineRule('combatNotes.powerAttack',
      'baseAttack', '=', '1 + Math.floor(source / 4)'
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
      ('magicNotes.selectiveChanneling', 'wisdomModifier', '=', null);
  } else if(name == 'Self-Sufficient') {
    rules.defineRule('skillNotes.self-Sufficient',
      'skills.Heal', '=', 'source >= 10 ? 4 : 2'
    );
  } else if((matchInfo = name.match(/^Skill\sFocus\s\((.*)\)$/)) != null) {
    var skill = matchInfo[1];
    Pathfinder.featureRules(rules, name, ['skill'], ['+%V ' + skill]);
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
      'skills.Escape Artist', '=', 'source >= 10 ? 4 : 2',
      'skills.Stealth', '^=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Stunning Critical') {
    rules.defineRule
      ('combatNotes.stunningCritical', 'baseAttack', '=', '10 + source');
  } else if(name == 'Stunning Fist') {
    rules.defineRule
      ('combatNotes.stunningFist', 'level', '^=', 'Math.floor(source / 4)');
    rules.defineRule('combatNotes.stunningFist.1',
      'features.Stunning Fist', '?', null,
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
  } else if(name == 'Toughness') {
    rules.defineRule
      ('combatNotes.toughness', 'level', '=', 'Math.max(source, 3)');
  } else if(name == 'Turn Undead') {
    rules.defineRule('combatNotes.turnUndead',
      'turningLevel', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
  } else if(name == 'Two-Weapon Rend') {
    rules.defineRule('combatNotes.two-WeaponRend',
      'strengthModifier', '=', 'Math.floor(source * 1.5)'
    );
  } else if(name == 'Weapon Finesse') {
    rules.defineRule('combatNotes.weaponFinesse',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  } else if((matchInfo = name.match(/^(Greater\s)?Weapon\sFocus\s\((.*)\)$/)) != null) {
    Pathfinder.featureRules
      (rules, name, ['combat'], ['+1 ' + matchInfo[2] + ' Attack Modifier']);
  } else if((matchInfo = name.match(/^(Greater\s)?Weapon\sSpecialization\s\((.*)\)$/)) != null) {
    Pathfinder.featureRules
      (rules, name, ['combat'], ['+2 ' + matchInfo[2] + ' Damage Modifier']);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Pathfinder.featureRules = function(rules, name, sections, notes) {
  SRD35.featureRules(rules, name, sections, notes);
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
 * #levelAttr#. The path grants the features and spells listed in #features#
 * and #spells#. #spellAbility#, if specified, names the ability for computing
 * spell difficulty class. #spellSlots# lists the number of spells per level
 * per day granted by the path, and #spells# lists spells defined by the path.
 * #spellDict# is the dictionary of all spells, used to look up individual
 * spell attributes. #feats# lists feats that may be selected by characters
 * following the path, and #skills# lists skills that become class skills.
 */
Pathfinder.pathRules = function(
  rules, name, group, levelAttr, features, selectables, feats, skills,
  spellAbility, spellSlots, spells, spellDict
) {

  var allFeats = rules.getChoices('feats');
  if(allFeats == null) {
    console.log('Feats not yet defined for path ' + name);
    return;
  }

  SRD35.pathRules(
    rules, name, group, levelAttr, features, selectables, spellAbility,
    spellSlots, spells, spellDict
  );

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ','') + 'Level';

  if(feats.length > 0) {
    // Applies to bloodlines, not domains
    rules.defineRule('featCount.' + name,
      pathLevel, '=', 'source >= 7 ? Math.floor((source - 1) / 6) : null'
    );
    if(name == 'Destined Bloodline') {
      for(var feat in allFeats) {
        if(feat.startsWith('Weapon Focus'))
          feats.push(feat);
      }
    }
    for(var i = 0; i < feats.length; i++) {
      var attrs = allFeats[feats[i]];
      if(attrs == null) {
        console.log('Feat "' + feats[i] + '" undefined for bloodline ' + name);
      } else {
        allFeats[feats[i]] = attrs.replace(/Type=/, 'Type="' + name + '",');
      }
    }
  }

  if(skills.length > 0) {
    var note = skills.join(' is a class skill/') + ' is a class skill';
    Pathfinder.featureRules(rules, name, ['skill'], [note]);
  }

};

/*
 * Defines in #rules# the rules associated with bloodline #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
Pathfinder.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ','') + 'Level';

  if(name == 'Bloodline Aberrant') {

    rules.defineRule('combatNotes.longLimbs',
      pathLevel, '=', 'source >= 17 ? 15 : source >= 11 ? 10 : 5'
    );
    rules.defineRule('combatNotes.unusualAnatomy',
      pathLevel, '=', 'source >= 13 ? 50 : 25'
    );
    rules.defineRule('magicNotes.acidicRay',
      pathLevel, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.acidicRay.1',
      'features.Acidic Ray', '?', null,
      'charismaModifier', '=', '1 + source'
    );
    rules.defineRule
      ('saveNotes.alienResistance', pathLevel, '=', 'source + 10');

  } else if(name == 'Bloodline Abyssal') {

    rules.defineRule('abilityNotes.strengthOfTheAbyss',
      pathLevel, '=', 'source >= 17 ? 6 : source >= 13 ? 4 : 2'
    );
    rules.defineRule('bloodlineEnergy', pathLevel, '=', '"fire"');
    rules.defineRule('clawsDamageLevel',
      'features.Claws', '=', '1',
      'features.Small', '+', '-1',
      'features.Large', '+', '1',
      pathLevel, '+', 'source >= 7 ? 1 : null'
    );
    rules.defineRule('combatNotes.claws',
      'clawsDamageLevel', '=', '["1d3", "1d4", "1d6", "1d8"][source]'
    );
    rules.defineRule('combatNotes.claws.1',
      'features.Claws', '?', null,
      'strengthModifier', '=', null
    );
    rules.defineRule('combatNotes.claws.2',
      'features.Claws', '?', null,
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule('combatNotes.improvedClaws', 'bloodlineEnergy', '=', null);
    rules.defineRule('magicNotes.bloodlineAbyssal',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('saveNotes.demonResistances',
      pathLevel, '=', 'source>=20 ? "immune" : source>=9 ? 10 : 5'
    );
    rules.defineRule('saveNotes.demonResistances.1',
      pathLevel, '=', 'source>=20 ? "immune" : source>=9 ? "+4" : "+2"'
    );

  } else if(name == 'Bloodline Arcane') {

    rules.defineRule
      ('familiarMasterLevel', 'familiarSorcererLevel', '^=', null);
    rules.defineRule('familiarSorcererLevel',
      'sorcererFeatures.Familiar', '?', null,
      'levels.Sorcerer', '=', null
    );
    rules.defineRule
      ('selectableFeatureCount.Sorcerer', pathLevel, '+', '1');
    rules.defineRule('magicNotes.metamagicAdept',
      pathLevel, '=', 'source >= 20 ? "any" : Math.floor((source+1)/4)'
    );
    rules.defineRule('magicNotes.newArcana',
      pathLevel, '=', 'Math.floor((source - 5) / 4)'
    );

  } else if(name == 'Bloodline Celestial') {

    rules.defineRule('abilityNotes.wingsOfHeaven',
      pathLevel, '=', 'source >= 20 ? "any" : source'
    );
    rules.defineRule('magicNotes.bloodlineCelestial',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.heavenlyFire',
      pathLevel, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.heavenlyFire.1',
      'features.Heavenly Fire', '?', null,
      'charismaModifier', '=', '1 + source'
    );
    rules.defineRule('saveNotes.celestialResistances',
      pathLevel, '=', 'source>=20 ? "immune" : source>=9 ? "+10":"+5"'
    );

  } else if(name == 'Bloodline Destined') {

    rules.defineRule('featureNotes.itWasMeantToBe',
      pathLevel, '=', 'Math.floor((source - 1) / 8)'
    );
    rules.defineRule('magicNotes.touchOfDestiny',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.touchOfDestiny.1',
      'features.Touch Of Destiny', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule
      ('saveNotes.fated', pathLevel, '=', 'Math.floor((source + 1) / 4)');

  } else if(name == 'Bloodline Draconic') {

    var colors = {
      'Black':'', 'Blue':'', 'Brass':'', 'Bronze':'', 'Copper':'', 'Gold':'',
      'Green':'', 'Red':'', 'Silver':'', 'White':''
    };
    for(var color in colors) {
      var energy = 'BlackCopperGreen'.indexOf(color) >= 0 ? 'acid' :
                   'SilverWhite'.indexOf(color) >= 0 ? 'cold' :
                   'BlueBronze'.indexOf(color) >= 0 ? 'electricity' : 'fire';
      var subFeature = 'features.Bloodline Draconic (' + color + ')';
      rules.defineRule('bloodlineEnergy', subFeature, '=', '"' + energy + '"');
      rules.defineRule('bloodlineShape',
        subFeature, '=',  '"' + (color <= 'F' ? "60' line" : "30' cone") + '"'
      );
      rules.defineRule('features.Bloodline Draconic', subFeature, '=', '1');
    }
    rules.defineRule
      ('abilityNotes.wings', pathLevel, '^=', 'source >= 15 ? 60 : null');
    // Other claws rules defined by Bloodline Abyssal
    rules.defineRule
      ('clawsDamageLevel', pathLevel, '+', 'source >= 7 ? 1 : null');
    rules.defineRule('combatNotes.breathWeapon',
      pathLevel, '=', 'source>=20 ? 3 : source>=17 ? 2 : source>=9 ? 1 : null'
    );
    rules.defineRule('combatNotes.breathWeapon.1',
      'features.Breath Weapon', '?', null,
      'bloodlineShape', '=', null
    );
    rules.defineRule('combatNotes.breathWeapon.2',
      'features.Breath Weapon', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule('combatNotes.breathWeapon.3',
      'features.Breath Weapon', '?', null,
      pathLevel, '=', null
    );
    rules.defineRule('combatNotes.breathWeapon.4',
      'features.Breath Weapon', '?', null,
      pathLevel, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.naturalArmor',
      pathLevel, '+=', 'source >= 15 ? 4 : source >= 10 ? 2 : 1'
    );
    rules.defineRule('featureNotes.blindsense', pathLevel, '^=', '60');
    rules.defineRule('saveNotes.dragonResistances',
      pathLevel, '=', 'source >= 20 ? "Immune" : source >= 9 ? 10 : 5'
    );
    rules.defineRule('saveNotes.dragonResistances.1',
      'features.Dragon Resistances', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule
      ('magicNotes.bloodlineDraconic', 'bloodlineEnergy', '=', null);

  } else if(name == 'Bloodline Elemental') {

    var elements = {'Air':'', 'Earth':'', 'Fire':'', 'Water':''};
    for(var element in elements) {
      var energy = element == 'Earth' ? 'acid' :
                   element == 'Water' ? 'cold' :
                   element == 'Air' ? 'electricity' : 'fire';
      var movement = element == 'Air' ? "Fly 60'/average" :
                     element == 'Earth' ? "Burrow 30'" :
                     element == 'Fire' ? 'Speed +30' : "Swim 60'";
      var subFeature = 'features.Bloodline Elemental (' + element + ')';
      rules.defineRule('bloodlineEnergy', subFeature, '=', '"' + energy + '"');
      rules.defineRule
        ('bloodlineMovement', subFeature, '=',  '"' + movement + '"');
      rules.defineRule('features.Bloodline Elemental', subFeature, '=', '1');
    }
    rules.defineRule
      ('abilityNotes.elementalMovement', 'bloodlineMovement', '=', null);
    rules.defineRule('combatNotes.elementalBlast', pathLevel, '=', null);
    rules.defineRule('combatNotes.elementalBlast.1',
      'features.Elemental Blast', '?', null,
      pathLevel, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.elementalBlast.2',
      'features.Elemental Blast', '?', null,
      pathLevel, '=', 'source >= 20 ? 3 : source >= 17 ? 2 : 1'
    );
    rules.defineRule('combatNotes.elementalBlast.3',
      'features.Elemental Blast', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule
      ('magicNotes.bloodlineElemental', 'bloodlineEnergy', '=', null);
    rules.defineRule
      ('magicNotes.elementalRay', 'charismaModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.elementalRay.1',
      'features.Elemental Ray', '?', null,
      pathLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.elementalRay.2',
      'features.Elemental Ray', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule('saveNotes.elementalBody', 'bloodlineEnergy', '=', null);
    rules.defineRule('saveNotes.elementalResistance',
      pathLevel, '=', 'source >= 20 ? "Immune" : source >= 9 ? 20 : 10'
    );
    rules.defineRule('saveNotes.elementalResistance.1',
      'features.Elemental Resistance', '?', null,
      'bloodlineEnergy', '=', null
    );

  } else if(name == 'Bloodline Fey') {

    rules.defineRule('magicNotes.fleetingGlance', pathLevel, '=', null);
    rules.defineRule
      ('magicNotes.laughingTouch', 'charismaModifier', '=', 'source + 3');

  } else if(name == 'Bloodline Infernal') {

    rules.defineRule('magicNotes.corruptingTouch',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.corruptingTouch.1',
      'features.Corrupting Touch', '?', null,
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.hellfire', pathLevel, '=', null);
    rules.defineRule('magicNotes.hellfire.1',
      'features.Hellfire', '?', null,
      pathLevel, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.hellfire.2',
      'features.Hellfire', '?', null,
      pathLevel, '=', null
    );
    rules.defineRule('magicNotes.hellfire.3',
      'features.Hellfire', '?', null,
      pathLevel, '=', 'source >= 20 ? 3 : source >= 17 ? 2 : 1'
    );
    rules.defineRule('saveNotes.infernalResistances',
      pathLevel, '=', 'source>=20 ? "immune" : source>=9 ? "+10":"+5"'
    );
    rules.defineRule('saveNotes.infernalResistances.1',
      pathLevel, '=', 'source>=20 ? "immune" : source>=9 ? "+4" : "+2"'
    );

  } else if(name == 'Bloodline Undead') {

    rules.defineRule('magicNotes.graspOfTheDead', pathLevel, '=', null);
    rules.defineRule('magicNotes.graspOfTheDead.1',
      'features.Grasp Of The Dead', '?', null,
      pathLevel, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.graspOfTheDead.2',
      'features.Grasp Of The Dead', '?', null,
      pathLevel, '=', 'source >= 20 ? 3 : source >= 17 ? 2 : 1'
    );
    rules.defineRule('magicNotes.graveTouch',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.graveTouch.1',
      'features.Grave Touch', '?', null,
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.incorporealForm', pathLevel, '=', null);
    rules.defineRule("saveNotes.death'sGift",
      pathLevel, '=', 'source >= 20 ? "Immune" : source >= 9 ? 10 : 5'
    );
    rules.defineRule("saveNotes.death'sGift.1",
      "features.Death's Gift", '?', null,
      pathLevel, '=', 'source >= 20 ? "Immune" : source >= 9 ? 10 : 5'
    );

  } else if(name == 'Air Domain') {
    rules.defineRule
      ('combatNotes.lightningArc', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('combatNotes.lightningArc.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.electricityResistance',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Animal Domain') {
    rules.defineRule
      ('companionMasterLevel', 'companionClericLevel', '^=', null);
    rules.defineRule('companionClericLevel',
      'features.Animal Domain', '?', null,
      'levels.Cleric', '=', 'source - 3'
    );
    rules.defineRule
      ('magicNotes.speakWithAnimals', 'levels.Cleric', '=', 'source + 3');
    rules.defineRule
      ('classSkills.Knowledge (Nature)', 'features.Animal Domain', '=', '1');
    rules.defineChoice('spells', 'Speak With Animals(Animal1 Divi)');
  } else if(name == 'Artifice Domain') {
    rules.defineRule
      ("combatNotes.artificer'sTouch", 'wisdomModifier', '=', 'source + 3');
    rules.defineRule("combatNotes.artificer'sTouch.1",
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.dancingWeapons',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineChoice('spells', 'Mending(Artifice0 Tran)');
  } else if(name == 'Chaos Domain') {
    rules.defineRule('combatNotes.chaosBlade',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.chaosBlade.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('combatNotes.touchOfChaos', 'wisdomModifier', '=', 'source + 3');
  } else if(name == 'Charm Domain') {
    rules.defineRule('magicNotes.charmingSmile',
      'levels.Cleric', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.charmingSmile.1', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.addlingTouch', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.addlingTouch.1',
      'features.Addling Touch', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    // Charm person already a Charm spell
  } else if(name == 'Community Domain') {
    rules.defineRule
      ('magicNotes.calmingTouch', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.calmingTouch.1', 'levels.Cleric', '=', null);
    rules.defineRule('saveNotes.unity',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
  } else if(name == 'Darkness Domain') {
    rules.defineRule('combatNotes.touchOfDarkness',
      'levels.Cleric', '=', 'source >= 2 ? Math.floor(source / 2) : 1'
    );
    rules.defineRule('combatNotes.touchOfDarkness.1',
      'features.Touch Of Darkness', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('featureNotes.eyesOfDarkness',
      'levels.Cleric', '=', 'source >= 4 ? Math.floor(source / 2) : null'
    );
  } else if(name == 'Death Domain') {
    rules.defineRule('combatNotes.bleedingTouch',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.bleedingTouch.1',
      'features.Bleeding Touch', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Destruction Domain') {
    rules.defineRule('combatNotes.destructiveAura',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor(source / 2) : null'
    );
    rules.defineRule
      ('combatNotes.destructiveAura.1', 'levels.Cleric', '=', null);
    rules.defineRule('combatNotes.destructiveSmite',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.destructiveSmite.1',
      'features.Destructive Smite', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Earth Domain') {
    rules.defineRule
      ('magicNotes.acidDart', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule
      ('magicNotes.acidDart.1', 'levels.Cleric', '=', 'Math.floor(source / 2)');
    rules.defineRule('saveNotes.acidResistance',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Evil Domain') {
    rules.defineRule('combatNotes.scytheOfEvil',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.scytheOfEvil.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.touchOfEvil',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.touchOfEvil.1',
      'features.Touch Of Evil', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Fire Domain') {
    rules.defineRule
      ('combatNotes.fireBolt', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('combatNotes.fireBolt.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.fireResistance',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Glory Domain') {
    rules.defineRule('magicNotes.divinePresence',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor(source / 2) : null',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.divinePresence.1', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.touchOfGlory', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.touchOfGlory.1',
      'features.Touch Of Glory', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineChoice('spells', 'Sanctuary(Glory1 Abju)');
  } else if(name == 'Good Domain') {
    rules.defineRule('combatNotes.holyLance',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.holyLance.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.touchOfGood',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.touchOfGood.1',
      'magicNotes.touchOfGood', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Healing Domain') {
    rules.defineRule("magicNotes.healer'sBlessing",
      'levels.Cleric', '=', 'source >= 6 ? 50 : null'
    );
    rules.defineRule
      ('magicNotes.rebukeDeath', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.rebukeDeath.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
  } else if(name == 'Knowledge Domain') {
    rules.defineRule(/classSkills.Knowledge/,
      'features.Knowledge Domain', '=', '1'
    );
    rules.defineRule('magicNotes.remoteViewing',
      'levels.Cleric', '=', 'source >= 6 ? source : null'
    );
    rules.defineRule('skillNotes.loreKeeper',
      'levels.Cleric', '=', 'source + 15',
      'wisdomModifier', '+', null
    );
    rules.defineChoice
      ('spells', 'Clairaudience/Clairvoyance(Knowledge3 Divi)');
  } else if(name == 'Law Domain') {
    rules.defineRule('combatNotes.staffOfOrder',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.staffOfOrder.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('magicNotes.touchOfLaw', 'wisdomModifier', '=', 'source + 3');
  } else if(name == 'Liberation Domain') {
    rules.defineRule("magicNotes.freedom'sCall",
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule('magicNotes.liberation', 'levels.Cleric', '=', null);
  } else if(name == 'Luck Domain') {
    rules.defineRule
      ('magicNotes.bitOfLuck', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.goodFortune',
      'levels.Cleric', '=', 'source >= 6 ? Math.floor(source / 6) : null'
    );
  } else if(name == 'Madness Domain') {
    rules.defineRule('magicNotes.auraOfMadness', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.visionOfMadness',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.visionOfMadness.1',
      'features.Vision Of Madness', '?', null,
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.visionOfMadness.2',
      'features.Vision Of Madness', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    // Confusion already a Madness spell
  } else if(name == 'Magic Domain') {
    rules.defineRule('combatNotes.handOfTheAcolyte',
      'baseAttack', '=', null,
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.handOfTheAcolyte.1',
      'features.Hand Of The Acolyte', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.dispellingTouch',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source - 4) / 4) : null'
    );
    // Dispel Magic already a Magic spell
  } else if(name == 'Nobility Domain') {
    rules.defineRule('featureNotes.nobleLeadership',
      'levels.Cleric', '=', 'source >= 8 ? 2 : null'
    );
    rules.defineRule
      ('features.Leadership', 'featureNotes.nobleLeadership', '=', '1');
    rules.defineRule('magicNotes.inspiringWord',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.inspiringWord.1',
      'features.Inspiring Word', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Plant Domain') {
    rules.defineRule('combatNotes.brambleArmor', 'levels.Cleric', '=', null);
    rules.defineRule('combatNotes.brambleArmor.1',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.woodenFist',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.woodenFist.1',
      'features.Wooden Fist', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Protection Domain') {
    rules.defineRule('magicNotes.auraOfProtection',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source - 4) / 4) : null'
    );
    rules.defineRule('magicNotes.auraOfProtection.1',
      'levels.Cleric', '=', 'source >= 14 ? 10 : 5'
    );
    rules.defineRule
      ('magicNotes.auraOfProtection.2', 'levels.Cleric', '=', null);
    rules.defineRule
      ('magicNotes.resistantTouch', 'wisdomModifier', '=', '3 + source');
    rules.defineRule('saveNotes.resistanceBonus',
      'levels.Cleric', '=', '1 + Math.floor(source / 5)'
    );
  } else if(name == 'Repose Domain') {
    rules.defineRule
      ('magicNotes.gentleRest', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.gentleRest.1',
      'features.Gentle Rest', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('magicNotes.wardAgainstDeath',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
  } else if(name == 'Rune Domain') {
    rules.defineRule('magicNotes.blastRune', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.blastRune.1',
      'features.Blast Rune', '?', null,
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.blastRune.2',
      'features.Blast Rune', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Strength Domain') {
    rules.defineRule('magicNotes.mightOfTheGods',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule('magicNotes.mightOfTheGods.1',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule('magicNotes.strengthRush',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.strengthRush.1',
      'features.Strength Rush', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Sun Domain') {
    rules.defineRule("magicNotes.sun'sBlessing", 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.nimbusOfLight',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule('magicNotes.nimbusOfLight.1',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
  } else if(name == 'Travel Domain') {
    rules.defineRule('speed', 'abilityNotes.travelSpeed', '+', '10');
    rules.defineRule
      ('featureNotes.agileFeet', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.dimensionalHop',
      'levels.Cleric', '=', 'source >= 8 ? 10 * source : null'
    );
  } else if(name == 'Trickery Domain') {
    rules.defineRule('classSkills.Bluff', 'features.TrickeryDomain', '=', '1');
    rules.defineRule
      ('classSkills.Disguise', 'features.TrickeryDomain', '=', '1');
    rules.defineRule
      ('classSkills.Stealth', 'features.TrickeryDomain', '=', '1');
    rules.defineRule('magicNotes.copycat', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.copycat.1',
      'features.Copycat', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule("magicNotes.master'sIllusion",
      'levels.Cleric', '=', 'source >= 8 ? 10 + Math.floor(source / 2) : null',
      'wisdomModifier', '+', null
    );
    rules.defineRule
      ("magicNotes.master'sIllusion.1", 'levels.Cleric', '=', null);
    rules.defineChoice('spells', 'Mirror Image(Trickery2 Illu)');
  } else if(name == 'War Domain') {
    rules.defineRule('combatNotes.battleRage',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.battleRage.1',
      'features.Battle Rage', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('combatNotes.weaponMaster',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
  } else if(name == 'Water Domain') {
    rules.defineRule('combatNotes.icicle', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule
      ('combatNotes.icicle.1', 'levels.Cleric', '=', 'Math.floor(source / 2)');
    rules.defineRule('saveNotes.coldResistance',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Weather Domain') {
    rules.defineRule
      ('combatNotes.stormBurst', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('combatNotes.stormBurst.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.lightningLord',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    // Call Lightning already a Weather spell
  }

};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. #spells# lists
 * any natural spells, for which #spellAbility# is used to compute the save DC.
 * #spellSlots# lists the number of spells per level per day granted by the
 * race, and #spells# lists spells defined by the race. #spellDict# is the
 * dictionary of all spells, used to look up individual spell attributes.
 */
Pathfinder.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spellSlots, spells, spellDict
) {
  SRD35.raceRules
    (rules, name, requires, features, selectables, languages, spellAbility,
     spellSlots, spells, spellDict);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
Pathfinder.raceRulesExtra = function(rules, name) {
  if(name.match(/Gnome/)) {
    rules.defineRule('spellSlots.Gnomish0', 'charisma', '?', 'source >= 11');
    rules.defineRule('spellSlots.Gnomish1', 'charisma', '?', 'source >= 11');
  } else if(name == 'Half-Elf') {
    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'adaptability', 'features.Adaptability',
      'Sum \'features.Skill Focus\' >= 1'
    );
  } else if(name.match(/Dwarf/)) {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
  } else if(name.match(/Human/)) {
    rules.defineRule('skillNotes.skilled', 'level', '=', null);
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
 * derived directly from the parmeters passed to schoolRules.
 */
Pathfinder.schoolRulesExtra = function(rules, name) {

  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ','');
  var schoolLevel = prefix + 'Level';

  if(name == 'Abjuration') {
    rules.defineRule('magicNotes.protectiveWard',
      schoolLevel, '=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('magicNotes.protectiveWard.1',
      'features.Protective Ward', '?', null,
      'intelligenceModifier', '=', 'source + 3'
    );
    rules.defineRule
      ('saveNotes.energyAbsorption', schoolLevel, '=', 'source * 3');
    rules.defineRule('saveNotes.energyResistance',
      schoolLevel, '=',
      'source >= 20 ? "Immune" : source >= 11 ? 10 : 5'
    );
  } else if(name == 'Conjuration') {
    rules.defineRule
      ('magicNotes.conjuredDart', 'intelligenceModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.conjuredDart.1',
      'features.Conjured Dart', '?', null,
      schoolLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('magicNotes.dimensionalSteps', schoolLevel, '=', '30 * source');
    rules.defineRule("magicNotes.summoner'sCharm",
      schoolLevel, '=', 'source>=20 ? "infinite" : Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Divination') {
    rules.defineRule('combatNotes.forewarned',
      schoolLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule("magicNotes.diviner'sFortune",
      schoolLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule("magicNotes.diviner'sFortune.1",
      "features.Diviner's Fortune", '?', null,
      'intelligenceModifier', '=', 'source + 3'
    );
  } else if(name == 'Enchantment') {
    rules.defineRule('magicNotes.auraOfDespair', schoolLevel, '=', null);
    rules.defineRule('magicNotes.dazingTouch', schoolLevel, '=', null);
    rules.defineRule('magicNotes.dazingTouch.1',
      'features.Dazing Touch', '?', null,
      'intelligenceModifier', '=', 'source + 3'
    );
    rules.defineRule('skillNotes.enchantingSmile',
      schoolLevel, '=', '1 + Math.floor(source / 5)'
    );
  } else if(name == 'Evocation') {
    rules.defineRule('magicNotes.elementalWall', schoolLevel, '=', null);
    rules.defineRule('magicNotes.forceMissile',
      schoolLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('magicNotes.forceMissile.1',
      'features.Force Missile', '?', null,
      'intelligenceModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.intenseSpells',
      schoolLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Illusion') {
    rules.defineRule
      ('magicNotes.blindingRay', 'intelligenceModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.extendedIllusions',
      schoolLevel, '=', 'source>=20 ? "infinite" : Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule
      ('magicNotes.invisibilityField', schoolLevel, '=', null);
  } else if(name == 'Necromancy') {
    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'powerOverUndead', 'features.Power Over Undead',
      'features.Command Undead || features.Turn Undead'
    );
    rules.defineRule('featureNotes.lifeSight',
      schoolLevel, '=', '10 * Math.floor((source - 4) / 4)'
    );
    rules.defineRule('magicNotes.necromanticTouch',
      schoolLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('magicNotes.necromanticTouch.1',
      'features.Necromantic Touch', '?', null,
      'intelligenceModifier', '=', 'source + 3'
    );
  } else if(name == 'Transmutation') {
    rules.defineRule('abilityNotes.physicalEnhancement',
      schoolLevel, '=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('abilityNotes.physicalEnhancement.1',
      'features.Physical Enhancement', '?', null,
      schoolLevel, '=', 'source >= 20 ? 2 : 1'
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
    rules.defineRule('magicNotes.telekineticFist',
      'intelligenceModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.telekineticFist.1',
      'features.Telekinetic Fist', '?', null,
      schoolLevel, '=', 'Math.floor(source / 2)'
    );
  }

};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, imposes #skillPenalty# on specific skills
 * and yields a #spellFail# percent chance of arcane spell failure.
 */
Pathfinder.shieldRules = function(
  rules, name, ac, profLevel, skillFail, spellFail
) {
  SRD35.shieldRules(rules, name, ac, profLevel, skillFail, spellFail);
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
  if(ability == 'strength' || ability == 'dexterity') {
    rules.defineRule('skillModifier.' + name,
      'skillNotes.armorSkillCheckPenalty', '+', '-source'
    );
  }
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
 * description of the spell's effects.
 */
Pathfinder.spellRules = function(
  rules, name, school, casterGroup, level, description
) {
  SRD35.spellRules(rules, name, school, casterGroup, level, description);
  // SRD35 uses wisdomModifier when calculating the save DC for Paladin
  // spells; in Pathfinder we override to use charismaModifier.
  if(casterGroup == 'P') {
    var matchInfo;
    var note = rules.getChoices('notes')[name];
    if(note != null && (matchInfo = notes[note].match(/\(DC\s%(\d+)/)) != null)
      rules.defineRule(note + '.' + matchInfo[1],
        'charismaModifier', '=', '10 + source + ' + level
      );
  }
};

/*
 * Defines in #rules# the rules associated with experience track #name#, which
 * has the level progression listed by #progression#.
 */
Pathfinder.trackRules = function(rules, name, progression) {
  var trackLevel = name + 'Level';
  var trackNeeded = name + 'Needed';
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
 * directly derived from the parmeters passed to traitRules.
 */
Pathfinder.traitRulesExtra = function(rules, name) {
  if(name == 'Armor Expert') {
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.armorExpert', '+', '-1'
    );
  } else if(name == 'Attuned To The Ancestors') {
    rules.defineRule('magicNotes.attunedToTheAncestors',
      'level', '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Balanced Offensive') {
    rules.defineRule('combatNotes.balancedOffensive',
      'level', '=', '1 + Math.floor(source / 5)'
    );
  } else if(name == 'Fires Of Hell') {
    rules.defineRule('combatNotes.firesOfHell', 'charismaModifier', '=', null);
  } else if(name == 'Impressive Presence') {
    rules.defineRule('combatNotes.impressivePresence',
      'level', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Magical Knack') {
    rules.defineRule('magicNotes.magicalKnack', 'level', '=', null);
  } else if(name == 'Storyteller') {
    rules.defineRule('skillNotes.storyteller',
      'intelligenceModifier', '=', 'Math.max(source + 3, 1)'
    );
  }
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #profLevel# proficiency level to use effectively and belongs to weapon
 * category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their spelled-out
 * equivalents). The weapon does #damage# HP on a successful attack and
 * threatens x#critMultiplier# (default 2) damage on a roll of #threat# (default
 * 20). If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
Pathfinder.weaponRules = function(
  rules, name, profLevel, category, damage, threat, critMultiplier, range
) {
  SRD35.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by SRD35 method
};

/* Returns HTML body content for user notes associated with this rule set. */
Pathfinder.ruleNotes = function() {
  return '' +
    '<h2>Pathfinder Quilvyn Module Notes</h2>\n' +
    'Pathfinder Quilvyn Module Version ' + PATHFINDER_VERSION + '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Although they have a range increment, the weapons Club, Dagger,\n' +
    '    Light Hammer, Shortspear, Spear, and Trident are all considered\n' +
    '    melee weapons.  Substitute the ranged attack attribute for the\n' +
    '    melee attack attribute given on the character sheet when any of\n' +
    '    these is thrown.\n' +
    '  </li><li>\n' +
    '    The armor class of characters with the Dodge feat includes a +1\n' +
    '    bonus that applies only to one foe at a time.\n' +
    '  </li><li>\n' +
    '    For purposes of computing strength damage bonuses, Quilvyn assumes\n' +
    '    that characters with a buckler wield their weapons one-handed and\n' +
    '    that characters with no buckler or shield wield with both hands.\n' +
    '  </li><li>\n' +
    '    Quilvyn assumes that masterwork composite bows are specially built\n' +
    '    to allow a strength damage bonus to be applied.\n' +
    '  </li><li>\n' +
    '    A few feats have been renamed to emphasize the relationship\n' +
    '    between similar feats: "Shield Proficiency" and "Tower Shield\n' +
    '    Proficiency" to "Shield Proficiency (Heavy)" and "Shield\n' +
    '    Proficiency (Tower)"; "Simple Weapon Proficiency" to "Weapon\n' +
    '    Proficiency (Simple)"; "Exotic Weapon Proficiency" and "Martial\n' +
    '    Weapon Proficiency" to "Weapon Proficiency" (a base feat that\n' +
    '    should be used to define weapon-specific subfeats).\n' +
    '  </li><li>\n' +
    '    The Charm domain "Dazing Touch" feature has been renamed "Addling\n' +
    '    Touch" to distinguish it from the Enchantment school feature of\n' +
    '    the same name.\n' +
    '  </li><li>\n' +
    '    The Strength domain "Strength Surge" feature has been renamed\n' +
    '    "Strength Rush" to distinguish it from the barbarian feature\n' +
    '    of the same name.\n' +
    '  </li><li>\n' +
    '    The Liberty\'s Edge "Freedom Fighter" trait has been renamed\n' +
    '    "Faction Freedom Fighter" to distinguish it from the halfling\n' +
    '    trait of the same name.\n' +
    '  </li><li>\n' +
    '    Quilvyn includes <i>Doom</i> in the list of Bard spells to support\n' +
    '    the Pathfinder Chronicler Whispering Campaign feature.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    You can only select each feat once. Multiple selections of feats\n' +
    '    that allow it can be managed by defining custom feats.\n' +
    '  </li><li>\n' +
    '    Quilvyn doesn\'t support double weapons where the two attacks have\n' +
    '    different critical mutipliers. In the predefined weapons this\n' +
    '    affects only the Gnome Hooked Hammer, where Quilvyn displays a\n' +
    '    critical multiplier of x4 instead of x3/x4.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not track companion feats, skills, and tricks.\n' +
    '  </li><li>\n' +
    '    Quilvyn has problems dealing with attributes containing an\n' +
    '    uncapitalized word.  This is why, e.g., Quilvyn defines the skills\n' +
    '    "Sleight Of Hand" and "Knowledge (Arcana)" instead of "Sleight of\n' +
    '    Hand" and "Knowledge (arcana)".  There are other occasions when\n' +
    '    Quilvyn is picky about case; when defining your own attributes,\n' +
    '    it\'s safest to follow the conventions Quilvyn uses.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn incorrectly validates the Mystic Theurge requirement of\n' +
    '    being able to cast 2nd-level arcane and divine spells.  It checks\n' +
    '    that the character is caster level 3 in each catetory, whereas\n' +
    '    some magic-using classes (e.g., Sorcerer) don\'t allow 2nd-level\n' +
    '    spells until a higher caster level.\n' +
    '  </li><li>\n' +
    '    Quilvyn lists the fly speed for a 9th-level Dragon Disciple as\n' +
    "    30' instead of the correct 60'.\n" +
    '  </li><li>\n' +
    '    When an character ability score is modified, Quilvyn recalculates\n' +
    '    attributes based on that ability from scratch.  For example,\n' +
    '    bumping intelligence when a character reaches fourth level causes\n' +
    '    Quilvyn to recompute the number of skill points awarded at first\n' +
    '    level.\n' +
    '  </li><li>\n' +
    '    When randomly generating clerics, Quilvyn reports a spell for each\n' +
    '    domain in each level, instead of a single domain spell per level.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Pathfinder.createViewers = function(rules, viewers) {
  SRD35.createViewers(rules, viewers); // No changes
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
Pathfinder.choiceEditorElements = function(rules, type) {
  var result = [];
  if(type == 'Faction')
    result.push(
      // empty
    );
  else if(type == 'Trait')
    result.push(
      ['Type', 'Type', 'select-one', ['Basic', 'Campaign', 'Faction', 'Race', 'Regional', 'Religion']],
      ['Subtype', 'Subtype', 'text', [20]]
    );
  else
    return SRD35.choiceEditorElements(rules, type);
  return result
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Pathfinder.randomizeOneAttribute = function(attributes, attribute) {
  SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
  if(attribute == 'levels') {
    // Set experience track and override SRD3.5's experience value
    if(!attributes.experienceTrack)
      attributes.experienceTrack =
        QuilvynUtils.randomKey(this.getChoices('tracks'));
    var progression =
      QuilvynUtils.getAttrValueArray
        (Pathfinder.TRACKS[attributes.experienceTrack], 'Progression');
    var level = QuilvynUtils.sumMatching(attributes, /levels\./);
    if(!level) {
      level = 1;
      attributes['levels.' + QuilvynUtils.randomKey(this.getChoices('levels'))] = level;
    }
    if(level < progression.length) {
      var min = progression[level - 1] * 1000;
      var max = progression[level] * 1000 - 1;
      attributes.experience = QuilvynUtils.random(min, max);
    }
  }
};

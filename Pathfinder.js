/*
Copyright 2021, James J. Hayes

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

  var rules = new QuilvynRules('Pathfinder 1E', Pathfinder.VERSION);
  Pathfinder.rules = rules;

  rules.defineChoice('choices', Pathfinder.CHOICES);
  rules.choiceEditorElements = Pathfinder.choiceEditorElements;
  rules.choiceRules = Pathfinder.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.getPlugins = Pathfinder.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Pathfinder.randomizeOneAttribute;
  rules.defineChoice('random', Pathfinder.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Pathfinder.ruleNotes;

  SRD35.ABBREVIATIONS['CMB'] = 'Combat Maneuver Bonus';
  SRD35.ABBREVIATIONS['CMD'] = 'Combat Maneuver Defense';

  Pathfinder.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels',
    'prestige:Prestige Levels,bag,prestiges', 'npc:NPC Levels,bag,npcs');

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

Pathfinder.VERSION = '2.2.2.9';

/* List of items handled by choiceRules method. */
Pathfinder.CHOICES = [
  'Alignment', 'Animal Companion', 'Armor', 'Class', 'Deity', 'Faction',
  'Familiar', 'Feat', 'Feature', 'Goody', 'Language', 'Npc', 'Path', 'Prestige',
  'Race', 'School', 'Shield', 'Skill', 'Spell', 'Track', 'Trait', 'Weapon'
];
/*
 * List of items handled by randomizeOneAttribute method. The order handles
 * dependencies among attributes when generating random characters.
 */
Pathfinder.RANDOMIZABLE_ATTRIBUTES = [
  'abilities',
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'deity', 'levels',
  'selectableFeatures', 'feats', 'skills', 'languages', 'hitPoints', 'armor',
  'shield', 'weapons', 'spells', 'companion', 'faction', 'traits'
];

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
    'Type=Fighter,Critical ' +
    'Require="baseAttack >= 13","features.Critical Focus"',
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
      '"features.Shield Proficiency"',
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
    'Imply=weapons.%weapon ' +
    'Require=' +
      '"features.Weapon Focus (%weapon)",' +
      '"levels.Fighter >= 8"',
  'Greater Weapon Specialization (%weapon)':
    'Type=Fighter ' +
    'Imply=weapons.%weapon ' +
    'Require=' +
      '"features.Weapon Focus (%weapon)",' +
      '"features.Greater Weapon Focus (%weapon)",' +
      '"features.Weapon Specialization (%weapon)",' +
      '"levels.Fighter >= 12"',
  'Heighten Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Improved Bull Rush':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Channel':'Type=General Require="features.Channel Energy"',
  'Improved Counterspell':'Type=General Imply="casterLevel >= 1"',
  'Improved Critical (%weapon)':
    'Type=Fighter Require="baseAttack >= 8" Imply=weapons.%weapon',
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
    'Type=Fighter Require="features.Shield Proficiency"',
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
  'Martial Weapon Proficiency (%martialWeapon)':
    'Type=General Imply="weapons.%martialWeapon"',
  'Master Craftsman (%craftSkill)':
    'Type=General Require="skills.%craftSkill >= 5"',
  'Master Craftsman (%professionSkill)':
    'Type=General Require="skills.%professionSkill >= 5"',
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
      '"features.Dazzling Display"',
  'Shield Focus':
    'Type=Fighter ' +
    'Require="baseAttack >= 1","features.Shield Proficiency"',
  'Shield Master':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 11",' +
      '"features.Improved Shield Bash",' +
      '"features.Shield Proficiency",' +
      '"features.Shield Slam",' +
      '"features.Two-Weapon Fighting"',
  'Shield Proficiency':'Type=Fighter',
  'Shield Slam':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 6",' +
      '"features.Improved Shield Bash",' +
      '"features.Shield Proficiency",' +
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
      '"features.Mounted Attack",' +
      '"features.Power Attack",' +
      '"features.Improved Bull Rush"',
  'Vital Strike':'Type=Fighter Require="baseAttack >= 6"',
  'Weapon Finesse':
    'Type=Fighter ' +
    'Imply="dexterityModifier > strengthModifier"',
  'Weapon Focus (%weapon)':
    'Type=Fighter Require="baseAttack >= 1" Imply=weapons.%weapon',
  'Weapon Specialization (%weapon)':
    'Type=Fighter ' +
    'Imply="weapons.%weapon" ' +
    'Require=' +
      '"features.Weapon Focus (%weapon)",' +
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
  'Gnome Ability Adjustment':
    'Section=ability Note="+2 Constitution/+2 Charisma/-2 Strength"',
  'Gnome Enmity':'Section=combat Note="+1 attack vs. goblinoid and reptilian"',
  'Good Fortune':'Section=magic Note="Reroll d20 %V/dy"',
  'Great Cleave':'Section=combat Note="Cleave w/out limit"',
  'Great Fortitude':'Section=save Note="+2 Fortitude"',
  'Greater Rage':'Section=combat Note="+6 Str, +6 Con, +3 Will during rage"',
  'Greater Spell Focus (%school)':'Section=magic Note="+1 Spell DC (%school)"',
  'Greater Spell Penetration':
    'Section=magic Note="+2 caster level vs. resistance checks"',
  'Greater Two-Weapon Fighting':
    'Section=combat Note="Third off-hand -10 attack"',
  'Half-Orc Ability Adjustment':'Section=ability Note="+2 any"',
  'Halfling Luck':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Heighten Spell':'Section=magic Note="Increase chosen spell level"',
  'Hide In Plain Sight':'Section=skill Note="Hide even when observed"',
  'Improved Bull Rush':
    'Section=combat ' +
    'Note="No AOO on Bull Rush, +2 Bull Rush check, +2 Bull Rush CMD"',
  'Improved Counterspell':
    'Section=magic Note="Counter using higher-level spell from same school"',
  'Improved Critical (%weapon)':
    'Section=combat Note="x2 %weapon Threat Range"',
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
  'Increased Damage Reduction':
    'Section=combat Note="Negate additional %V HP each attack during rage"',
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
  'Lay On Hands':'Section=magic Note="Harm undead or heal %Vd6 HP %1/dy"',
  'Leadership':'Section=feature Note="Attract followers"',
  'Lightning Reflexes':'Section=save Note="+2 Reflex"',
  'Link':
    'Section=skill ' +
    'Note="+4 Handle Animal (companion)/Wild Empathy (companion)"',
  'Low-Light Vision':'Section=feature Note="x2 normal distance in poor light"',
  'Low-Light Rage':
    'Section=feature Note="x2 normal distance in poor light during rage"',
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
  'School Opposition (%school)':
    'Section=magic Note="Double cost to cast %school spells"',
  'School Specialization (%school)':
    'Section=magic,skill ' +
    'Note="Extra %school spell/dy each spell level",' +
         '"+2 Spellcraft (%school effects)"',
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
    'Section=combat Note="+%V attack/+%1 damage/+%2 AC vs. evil foe %2/dy"',
  'Snatch Arrows':'Section=combat Note="Catch ranged weapons"',
  'Sneak Attack':
    'Section=combat Note="Hit +%Vd6 HP when surprising or flanking"',
  'Speak With Like Animals':'Section=companion Note="Talk w/similar creatures"',
  'Speak With Master':
    'Section=companion Note="Talk w/master in secret language"',
  'Special Mount':'Section=feature Note="Magical mount w/special abilities"',
  'Spell Focus (%school)':'Section=magic Note="+1 Spell DC (%school)"',
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
  'A Sure Thing':'Section=combat Note="+2 attack vs. evil 1/dy"',
  'Aberrant Form':
    'Section=combat,feature ' +
    'Note="Immune critical hit and sneak attack, DR 5/-",' +
         '"Blindsight 60\'"',
  'Acid Dart':'Section=magic Note="R30\' touch 1d6+%1 HP %V/dy"',
  'Acid Resistance':'Section=save Note="%V"',
  'Acidic Ray':'Section=magic Note="R30\' %Vd6 HP %1/dy"',
  'Acrobatic Steps':
    'Section=ability Note="Move through difficult terrain 20\'/rd"',
  'Adaptability':'Section=feature Note="+1 General Feat (Skill Focus)"',
  'Added Summonings':
    'Section=magic ' +
    'Note="<i>Summon Monster</i> brings additional demon or fiendish creature"',
  'Addling Touch':
    'Section=magic Note="Touch attack dazes %V HD foe 1 rd %1/dy"',
  'Adopted':'Section=feature Note="Family race traits available"',
  'Agile Feet':
    'Section=feature Note="Unaffected by difficult terrain 1 rd %V/dy"',
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
    'Note="Touch attack on objects/constructs 1d6+%1 HP %V/dy",' +
         '"<i>Mending</i> at will"',
  'Ascension':
    'Section=magic,save ' +
    'Note="<i>Tongues</i> at will",' +
         '"Immune petrification, 10 electricity/fire, +4 poison"',
  'Attuned To The Ancestors':
    'Section=magic Note="<i>Hide From Undead</i> %V rd 1/dy"',
  'Aura Of Despair':
    'Section=magic ' +
    'Note="R30\' Foes -2 ability, attack, damage, save, and skill %V rd/dy"',
  'Aura Of Justice':'Section=combat Note="R10\' Grant Smite Evil to allies"',
  'Aura Of Madness':
    'Section=magic Note="30\' <i>Confusion</i> (DC %1 Will neg) %V rd/dy"',
  'Aura Of Protection':
    'Section=magic ' +
    'Note="Allies w/in 30\' +%V AC, %1 elements resistance %2 rd/dy"',
  'Aura Of Resolve':'Section=save Note="Immune charm, +4 to allies w/in 30\'"',
  'Aura Of Righteousness':
    'Section=combat,save ' +
    'Note="DR %V/evil",' +
         '"Immune compulsion, +4 to allies w/in 30\'"',
  'Bad Reputation':
    'Section=skill Note="+2 Intimidate/Intimidate is a class skill"',
  'Balanced Offensive':
    'Section=combat Note="Cleric-like elemental attack %V/dy"',
  'Bardic Performance':
    'Section=feature Note="Bardic Performance effect %V rd/dy"',
  'Battle Rage':
    'Section=combat Note="Touch imparts +%V damage bonus 1 rd %1/dy"',
  'Beastspeaker':
    'Section=skill ' +
    'Note="+1 Diplomacy (animals), no penalty w/elemental animals"',
  'Beneficent Touch':'Section=magic Note="Reroll healing spell 1s 1/dy"',
  'Birthmark':'Section=save Note="+2 vs. charm, compulsion"',
  'Bit Of Luck':'Section=magic Note="Touch imparts reroll d20 next rd %V/dy"',
  'Bitter Nobleman':
    'Section=skill ' +
    'Note="+1 choice of Bluff, Sleight Of Hand, Stealth/choice is a class skill"',
  'Blast Rune':
    'Section=magic ' +
    'Note="Rune in adjacent square causes 1d6+%1 HP for %V rd %2/dy"',
  'Bleeding Attack':
    'Section=combat Note="Sneak attack causes extra %V HP/rd until healed"',
  'Bleeding Critical':
    'Section=combat Note="Critical hit causes 2d6 HP/rd until healed (DC 15)"',
  'Bleeding Touch':
    'Section=combat ' +
    'Note="Touch attack causes 1d6 HP/rd %V rd or until healed (DC 15) %1/dy"',
  'Blinding Critical':
    'Section=combat ' +
    'Note="Critical hit causes permanent blindness (DC %V Fort dazzled 1d4 rd)"',
  'Blinding Ray':'Section=magic Note="Ranged touch blinds/dazzles 1 rd %V/dy"',
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
    'Note="Thorny hide causes 1d6+%1 HP to striking foes %V/dy"',
  'Bravery':'Section=save Note="+%V vs. fear"',
  'Breath Weapon':'Section=combat Note="%1 %2 %3d6 HP (%4 DC Ref half) %V/dy"',
  'Brute':'Section=skill Note="+1 Intimidate/Intimidate is a class skill"',
  'Bullied':'Section=combat Note="+1 unarmed AOO attack"',
  'Bully':'Section=skill Note="+1 Intimidate/Intimidate is a class skill"',
  'Calming Touch':
    'Section=magic ' +
    'Note="Touch heals 1d6+%1 nonlethal HP, removes fatigued, shaken, and sickened %V/dy"',
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
    'Note="<i>Beast Shape %1</i>/<i>Elemental Body %2</i> %V rd/dy"',
  'Channel Energy':
    'Section=magic ' +
    'Note="Heal or inflict %Vd6 HP 30\' radius (DC %1 Will half) %2/dy"',
  'Channel Smite':
    'Section=combat Note="Channel energy into weapon strike as swift action"',
  'Chaos Blade':
    'Section=combat Note="Add <i>anarchic</i> to weapon %1 rd %V/dy"',
  'Charming Smile':'Section=magic Note="DC %V <i>Charm Person</i> %1 rd/dy"',
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
  'Classically Schooled':
    'Section=skill Note="+1 Spellcraft/Spellcraft is a class skill"',
  'Claws':'Section=combat Note="%V+%1 HP %2 rd/dy"',
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
  'Conjured Dart':'Section=magic Note="Ranged touch 1d6+%1 HP %V/dy"',
  'Conviction':
    'Section=feature Note="Reroll ability, attack, skill, or save 1/dy"',
  'Copycat':'Section=magic Note="<i>Mirror Image</i> %V rd %1/dy"',
  'Corrupting Touch':'Section=magic Note="Touch causes shaken %V rd %1/dy"',
  'Courageous':'Section=save Note="+2 vs. fear"',
  'Critical Focus':'Section=combat Note="+4 attack on critical hits"',
  'Critical Mastery':'Section=combat Note="Apply two effects to critical hits"',
  'Dancing Weapons':
    'Section=combat Note="Add <i>dancing</i> to weapon 4 rd %V/dy"',
  'Dangerously Curious':
    'Section=skill ' +
    'Note="+1 Use Magic Device/Use Magic Device is a class skill"',
  'Dazing Touch':
    'Section=magic Note="Touch attack dazes %V HD foe 1 rd %1/dy"',
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
         '"Automatically overcome resistance 1/dy"',
  'Destructive Aura':
    'Section=combat ' +
    'Note="R30\' Attacks +%V damage and critical confirmed %1 rd/dy"',
  'Destructive Smite':'Section=combat Note="+%V damage %1/dy"',
  "Devil's Mark":
    'Section=skill ' +
    'Note="+2 Bluff, Diplomacy, Intimidate, Sense Motive with evil outsiders"',
  'Devotee Of The Green':
    'Section=skill ' +
    'Note="+1 Knowledge (Geography)/+1 Knowledge (Nature)/choice is a class skill"',
  'Dimensional Hop':'Section=magic Note="Teleport up to %V\'/dy"',
  'Dimensional Steps':'Section=magic Note="Teleport up to %V\'/dy"',
  'Dirge Of Doom':
    'Section=magic Note="R30\' Creatures shaken while performing"',
  'Dirty Fighter':'Section=combat Note="+1 damage when flanking"',
  'Dispelling Attack':
    'Section=magic Note="Sneak attack acts as <i>Dispel Magic</i> on target"',
  'Dispelling Touch':
    'Section=magic Note="<i>Dispel Magic</i> touch attack %V/dy"',
  'Disruptive':'Section=combat Note="+4 foe defensive spell DC"',
  'Distraction':
    'Section=magic Note="R30\' Perform check vs. visual magic 10 rd"',
  'Divine Courtesan':
    'Section=skill ' +
    'Note="+1 Diplomacy (gather information)/+1 Sense Motive/choice is a class skill"',
  'Divine Mount':'Section=feature Note="Magically summon mount %V/dy"',
  'Divine Presence':
    'Section=magic Note="R30\' Allies DC %V <i>Sanctuary</i> %1 rd/dy"',
  'Divine Warrior':'Section=magic Note="Enspelled weapons +1 damage"',
  'Divine Weapon':
    'Section=combat Note="Add %V enhancements to weapon %1 minutes %2/dy"',
  "Diviner's Fortune":
    'Section=magic ' +
    'Note="Touched creature +%V attack, skill, ability, and save 1 rd %1/dy"',
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
  'Eastern Mysteries':'Section=magic Note="+2 spell DC 1/dy"',
  'Electricity Resistance':'Section=save Note="%V"',
  'Elemental Blast':
    'Section=combat ' +
    'Note="R60\' 20\' radius %Vd6 HP %3 (DC %1 Ref half) %2/dy"',
  'Elemental Body':'Section=save Note="Immune %V"',
  'Elemental Channel (Air)':
    'Section=combat Note="Channel energy to heal or harm Air outsiders"',
  'Elemental Channel (Earth)':
    'Section=combat Note="Channel energy to heal or harm Earth outsiders"',
  'Elemental Channel (Fire)':
    'Section=combat Note="Channel energy to heal or harm Fire outsiders"',
  'Elemental Channel (Water)':
    'Section=combat Note="Channel energy to heal or harm Water outsiders"',
  'Elemental Movement':'Section=ability Note="%V"',
  'Elemental Ray':'Section=magic Note="R30\' 1d6+%1 HP %2 %V/dy"',
  'Elemental Resistance':'Section=save Note="%V vs. %1"',
  'Elemental Wall':
    'Section=magic ' +
    'Note="<i>Wall Of Fire</i>/<i>Acid</i>/<i>Cold</i>/<i>Electricity</i> %V rd/dy"',
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
  'Energy Absorption':'Section=save Note="Ignore %V HP energy/dy"',
  'Energy Resistance':'Section=save Note="%V chosen energy type"',
  'Exhausting Critical':
    'Section=combat Note="Critical hit causes foe exhaustion"',
  'Exile':'Section=combat Note="+2 Initiative"',
  'Expert Duelist':'Section=combat Note="+1 AC/+1 CMD"',
  'Explorer':'Section=skill Note="+1 Survival/Survival is a class skill"',
  'Extended Illusions':'Section=magic Note="Illusion duration increased %V rd"',
  'Extra Channel':'Section=magic Note="Channel energy +2/dy"',
  'Extra Ki':'Section=feature Note="+%V Ki pool"',
  'Extra Lay On Hands':'Section=magic Note="Lay On Hands +%V/dy"',
  'Extra Mercy':'Section=magic Note="%V additional Mercy effect"',
  'Extra Performance':'Section=feature Note="Bardic Performance +%V rd/dy"',
  'Extra Rage':'Section=combat Note="Rage +%V rd/dy"',
  'Eyes And Ears Of The City':
    'Section=skill Note="+1 Perception/Perception is a class skill"',
  'Eyes Of Darkness':
    'Section=feature Note="Normal vision in any lighting %V rd/dy"',
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
  'Fire Bolt':'Section=combat Note="R30\' touch 1d6+%1 HP %V/dy"',
  'Fire Resistance':'Section=save Note="%V"',
  'Fires Of Hell':'Section=combat Note="Flaming blade +1 damage %V rd 1/dy"',
  'Flame Of The Dawn Flower':
    'Section=combat Note="+2 scimitar critical damage"',
  'Fleet':'Section=ability Note="+%V Speed in light or no armor"',
  'Fleeting Glance':
    'Section=magic Note="<i>Greater Invisibility</i> %V rd/dy"',
  'Focused Mind':'Section=magic Note="+2 concentration checks"',
  'Force For Good':
    'Section=magic Note="+1 caster level on good-aligned spells"',
  'Force Missile':'Section=magic Note="<i>Magic Missile</i> 1d4+%V HP %1/dy"',
  'Forewarned':
    'Section=combat Note="+%V initiative, always act in surprise round"',
  'Forlorn':'Section=save Note="+1 Fortitude"',
  'Fortified Drinker':
    'Section=save Note="+2 vs. mental effect 1 hr after drinking"',
  'Fortified':
    'Section=combat ' +
    'Note="20% chance to negate critical hit or sneak attack 1/dy"',
  'Freedom Fighter':
    'Section=combat,skill ' +
    'Note="+1 attack during escape",' +
         '"+1 skills during escape/Escape Artist is a class skill"',
  "Freedom's Call":
    'Section=magic ' +
    'Note="R30\' Allies unaffected by movement conditions %V rd/dy"',
  'Frightening Tune':
    'Section=magic Note="R30\' DC %V Will <i>Cause Fear</i> via performance"',
  'Gentle Rest':
    'Section=magic Note="Touch staggers 1 rd (undead %1 rd) %V/dy"',
  'Gifted Adept':'Section=magic Note="+1 caster level on chosen spell"',
  'Gnome Magic':'Section=magic Note="+1 DC on Illusion spells"',
  'Gold Finger':
    'Section=skill ' +
    'Note="+1 Disable Device/+1 Sleight Of Hand/choice is a class skill"',
  'Goldsniffer':'Section=skill Note="+2 Perception (metals, jewels, gems)"',
  "Gorgon's Fist":
    'Section=combat ' +
    'Note="Unarmed attack vs. slowed foe staggers (DC %V Fort neg)"',
  'Grasp Of The Dead':
    'Section=magic ' +
    'Note="R60\' Skeletal arms claw 20\' radius %Vd6 HP (DC %1 Ref half) %2/dy"',
  'Grave Touch':
    'Section=magic Note="Touch causes shaken/frightened %V rd %1/dy"',
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
  'Guarded Stance':'Section=combat Note="+%V AC for %1 rd during rage"',
  'Guardian Of The Forge':
    'Section=skill ' +
    'Note="+1 Knowledge (Engineering)/+1 Knowledge (History)/choice is a class skill"',
  'Half-Elf Ability Adjustment':'Section=ability Note="+2 any"',
  'Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Charisma/-2 Strength"',
  'Hand Of The Acolyte':'Section=combat Note="R30\' +%V w/melee weapon %1/dy"',
  'Hand Of The Apprentice':
    'Section=combat Note="R30\' +%V w/melee weapon %1/dy"',
  'Hardy':'Section=save Note="+2 vs. poison and spells"',
  "Healer's Blessing":'Section=magic Note="%V% bonus on healed damage"',
  'Heavenly Fire':
    'Section=magic ' +
    'Note="R30\' Ranged touch heal good/harm evil 1d4+%V HP %1/dy"',
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
  'Holy Lance':'Section=combat Note="Add <i>holy</i> to weapon %1 rd %V/dy"',
  'Horse Lord':'Section=skill Note="+2 Ride/Ride is a class skill"',
  'Human Ability Adjustment':'Section=ability Note="+2 any"',
  "Hunter's Eye":
    'Section=combat ' +
    'Note="No penalty for longbow or shortbow 2nd range increment/proficiency in choice"',
  'I Know A Guy':
    'Section=skill ' +
    'Note="+1 Knowledge (Local)/+2 Diplomacy (gather information)"',
  'Icicle':'Section=combat Note="R30\' touch 1d6+%1 HP %V/dy"',
  'Impressive Presence':
    'Section=combat Note="Adjacent foes shaken 1 rd 1/dy (DC %V Will neg)"',
  'Improved Channel':'Section=magic Note="+2 DC on channeled energy"',
  'Improved Claws':'Section=combat Note="Claws do additional 1d6 %V HP"',
  'Improved Great Fortitude':'Section=save Note="Reroll Fort 1/dy"',
  'Improved Iron Will':'Section=save Note="Reroll Will 1/dy"',
  'Improved Lightning Reflexes':'Section=save Note="Reroll Ref 1/dy"',
  'Improved Vital Strike':'Section=combat Note="3x base damage"',
  'Improved Weapon Mastery':
    'Section=combat ' +
    'Note="No penalties for improvised weapons, improvised weapon damage +step, critical x2@19"',
  'Incorporeal Form':'Section=magic Note="Incorporeal %V rd 1/dy"',
  'Indomitable Faith':'Section=save Note="+1 Will"',
  'Indomitable':'Section=save Note="+1 vs. enchantment"',
  'Infernal Resistances':'Section=save Note="%V fire/%1 poison"',
  'Influential':
    'Section=magic,skill ' +
    'Note="+1 DC on language-dependent spell 1/dy",' +
         '"+3 Diplomacy (requests)"',
  'Insider Knowledge':
    'Section=skill ' +
    'Note="+1 choice of Diplomacy or Knowledge (Local)/choice is a class skill"',
  'Inspiring Word':
    'Section=magic ' +
    'Note="R30\' word imparts +2 attack, skill, ability, and save to target %V rd %1/dy"',
  'Intense Spells':'Section=magic Note="+%V Evocation spell damage"',
  'Internal Fortitude':
    'Section=save Note="Cannot be sickened or nauseated during rage"',
  'Intimidating Glare':
    'Section=skill ' +
    'Note="Successful Intimidate during rage shakes foe at least 1d4 rd"',
  'Intimidating Prowess':'Section=skill Note="+%V Intimidate"',
  'Intimidating':'Section=skill Note="+2 Intimidate"',
  'Invisibility Field':
    'Section=magic Note="<i>Greater Invisibility</i> %V rd/dy"',
  'It Was Meant To Be':
    'Section=feature ' +
    'Note="Reroll attack, critical, or spell resistance check %V/dy"',
  'Jack Of All Trades':'Section=skill Note="Use any skill untrained"',
  'Ki Dodge':'Section=combat Note="Use 1 ki for +4 AC"',
  'Ki Pool':'Section=feature Note="%V points refills w/8 hours rest"',
  'Ki Speed':'Section=ability Note="Use 1 ki for +20 Speed"',
  'Killer':'Section=combat Note="Extra damage on critical hit"',
  'Knockback':
    'Section=combat Note="Successful Bull Rush during rage does %V HP"',
  'Laughing Touch':'Section=magic Note="Touch causes 1 rd of laughter %V/dy"',
  'Ledge Walker':
    'Section=skill Note="Use Acrobatics along narrow surfaces at full speed"',
  'Liberation':'Section=magic Note="Ignore movement impediments %V rd/dy"',
  'Librarian':
    'Section=skill ' +
    'Note="+1 Linguistics/+1 Profession (Librarian)/choice is a class skill/+1 reading bonus 1/dy"',
  'Life Sight':'Section=feature Note="%V blindsight for living or undead"',
  'Lightning Arc':'Section=combat Note="R30\' touch 1d6+%1 HP %V/dy"',
  'Lightning Lord':'Section=magic Note="<i>Call Lightning</i> %V bolts/dy"',
  'Lightning Stance':
    'Section=combat Note="50% concealment with 2 move or withdraw actions"',
  'Log Roller':'Section=combat,skill Note="+1 CMD vs. Trip","+1 Acrobatics"',
  'Long Limbs':'Section=combat Note="+%V\' touch attack range"',
  'Lore Keeper':
    'Section=skill Note="Touch attack provides info as per %V Knowledge check"',
  'Lore Master':
    'Section=skill ' +
    'Note="Take 10 on any ranked Knowledge skill, take 20 %V/dy"',
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
  'Major Magic':'Section=magic Note="Cast W1 spell 2/dy"',
  'Maneuver Training':'Section=combat Note="+%V CMB"',
  'Master Craftsman (%craftSkill)':
    'Section=feature,skill ' +
    'Note="Use %craftSkill with Craft Magic Arms And Armor, Craft Wondrous Item",' +
         '"+2 %craftSkill"',
  'Master Craftsman (%professionSkill)':
    'Section=feature,skill ' +
    'Note="Use %professionSkill with Craft Magic Arms And Armor, Craft Wondrous Item",' +
         '"+2 %professionSkill"',
  'Master Hunter':
    'Section=combat ' +
    'Note="Full attack vs. favored enemy kills (DC %V Fort neg)"',
  'Master Of Pentacles':
    'Section=magic Note="+2 Conjuration spell caster level 1/dy"',
  'Master Strike':
    'Section=combat ' +
    'Note="Sneak attack causes choice of sleep, paralysis, or death (DC %V Fort neg)"',
  "Master's Illusion":
    'Section=magic Note="30\' radius <i>Veil</i> (DC %V disbelieve) %1 rd/dy"',
  'Mathematical Prodigy':
    'Section=skill ' +
    'Note="+1 Knowledge (Arcana)/+1 Knowledge (Engineering)/choice is a class skill"',
  'Medic':
    'Section=magic,kill ' +
    'Note="+1 caster level with <i>Remove</i> healing",' +
         '"+2 Heal (disease, poison)"',
  "Medusa's Wrath":
    'Section=combat Note="2 extra unarmed attacks vs. diminished-capacity foe"',
  'Mercy':
    'Section=magic Note="Lay on hands removes %V additional conditions: %1"',
  'Meridian Strike':'Section=combat Note="Reroll crit damage 1s 1/dy"',
  'Metamagic Adept':
    'Section=magic ' +
    'Note="Applying metamagic feat w/out increased casting time %V/dy"',
  'Metamagic Mastery':'Section=magic Note="Apply metamagic feat %V/dy"',
  'Meticulous Artisan':'Section=skill Note="+1 Craft for day job"',
  'Might Of The Gods':'Section=magic Note="+%V Str checks %1 rd/dy"',
  'Mighty Swing':'Section=combat Note="Confirm critical automatically 1/rage"',
  'Militia Veteran':
    'Section=skill ' +
    'Note="+1 choice of Profession (Soldier), Ride, Survival/choice is a class skill"',
  'Mind Over Matter':'Section=save Note="+1 Will"',
  'Minor Magic':'Section=magic Note="Cast W0 spell 3/dy"',
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
    'Section=magic Note="Touch causes shaken or frightened %V rd %1/dy"',
  'New Arcana':'Section=magic Note="%V additional spells"',
  'Night Vision':'Section=feature Note="60\' Darkvision during rage"',
  'Nimble Moves':
    'Section=ability ' +
    'Note="Move through difficult terrain 5\'/rd as though normal terrain"',
  'Nimbus Of Light':
    'Section=magic ' +
    'Note="30\' radius <i>Daylight</i> does %V HP to undead %1 rd/dy"',
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
  'Protective Ward':'Section=magic Note="+%V AC 10\' radius %1/dy"',
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
    'Section=magic Note="Touch creature below 0 HP to heal 1d4+%1 HP %V/dy"',
  'Remote Viewing':
    'Section=magic Note="<i>Clairaudience/Clairvoyance</i> %V rd/dy"',
  'Renewed Vigor':'Section=magic Note="Heal %Vd8+%1 HP 1/dy during rage"',
  'Resiliency':
    'Section=combat Note="1 minute of %V temporary HP when below 0 HP 1/dy"',
  'Resilient':'Section=save Note="+1 Fortitude"',
  'Resistance Bonus':
    'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Resistant Touch':
    'Section=magic ' +
    'Note="Touch transfers resistance bonus to ally 1 minute %V/dy"',
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
    'Note="Choice of Perform is a class skill/DC 15 gives allies w/in 60\' +1 or better vs. fear 5 min 1/dy"',
  'Sacred Conduit':'Section=magic Note="+1 channeled energy save DC"',
  'Sacred Touch':'Section=magic Note="Touch stabilizes"',
  'Savanna Child':
    'Section=skill ' +
    'Note="+1 choice of Handle Animal, Knowledge (Nature), Ride/choice is a class skill"',
  'Scent':'Section=feature Note="Detect creatures via smell"',
  'Scent Rage':'Section=feature Note="Detect creatures via smell during rage"',
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
    'Section=combat Note="Add <i>unholy</i> to weapon %1 rd %V/dy"',
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
    'Section=combat Note="Gain HP equal to slain foe\'s hit dice 1 min 1/dy"',
  'Soul Of The Fey':
    'Section=combat,magic,save ' +
    'Note="Animals attack only if magically forced",' +
         '"<i>Shadow Walk</i> 1/dy",' +
         '"Immune poison/DR 10/cold iron"',
  'Speak With Animals':
    'Section=magic Note="<i>Speak With Animals</i> %V rd/dy"',
  'Spell Rune':'Section=magic Note="Add known spell to Blast Rune"',
  'Spellbreaker':'Section=combat Note="AOO on foe failed defensive casting"',
  'Staff Of Order':
    'Section=combat Note="Add <i>axiomatic</i> to weapon %1 rd %V/dy"',
  'Staggering Critical':
    'Section=combat ' +
    'Note="Critical hit staggers for 1d4+1 rd (DC %V Fort negates)"',
  'Stand Still':'Section=combat Note="CMB check to halt foe movement"',
  'Stand Up':'Section=combat Note="Stand from prone as free action"',
  'Starchild':
    'Section=skill Note="+4 Survival (avoid becoming lost), know North"',
  'Steady':
    'Section=ability Note="No speed penalty in heavy armor or with heavy load"',
  'Step Up':'Section=combat Note="Match foe 5\' step"',
  'Storm Burst':
    'Section=combat ' +
    'Note="R30\' Touch 1d6+%1 HP non-lethal and -2 attack %V/dy"',
  'Storyteller':'Section=skill Note="+%V choice of Knowledge check 1/scenario"',
  'Strength Of The Abyss':'Section=ability Note="+%V Strength"',
  'Strength Rush':
    'Section=magic ' +
    'Note="Touch imparts +%V melee attack and Str check bonus %1/dy"',
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
  'Telekinetic Fist':'Section=magic Note="Ranged touch 1d4+%1 HP %V/dy"',
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
    'Note="Touch attack %V/dy causes target to take worse result of d20 rerolls 1 rd"',
  'Touch Of Darkness':
    'Section=combat Note="Touch attack causes 20% miss chance %V rd %1/dy"',
  'Touch Of Destiny':
    'Section=magic ' +
    'Note="Touched creature +%V attack, skill, ability, save 1 rd %1/dy"',
  'Touch Of Evil':'Section=combat Note="Touch attack sickens %V rd %1/dy"',
  'Touch Of Glory':
    'Section=magic Note="Touch imparts +%V Cha check bonus w/in 1 hr %1/dy"',
  'Touch Of Good':
    'Section=magic ' +
    'Note="Touch imparts +%V attack, skill, ability, and save 1 rd %1/dy"',
  'Touch Of Law':
    'Section=magic Note="Touched take 11 on all d20 rolls 1 rd %V/dy"',
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
  'Unity':'Section=save Note="R30\' Allies use your saving throw %V/dy"',
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
  'Vindictive':'Section=combat Note="+1 damage vs. successful foe 1 min 1/dy"',
  'Vision Of Madness':
    'Section=magic ' +
    'Note="Touch imparts +%V attack, save, or skill, -%1 others 3 rd %2/dy"',
  'Vital Strike':'Section=combat Note="2x base damage"',
  'Ward Against Death':
    'Section=magic ' +
    'Note="R30\' Creatures immune to death effects, energy drain, and negative levels %V rd/dy"',
  'Warrior Of Old':'Section=combat Note="+2 Initiative"',
  'Watchdog':
    'Section=skill Note="+1 Sense Motive/Sense Motive is a class skill"',
  'Weapon Master':'Section=combat Note="Use additional combat feat %V rd/dy"',
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
  'Wings Of Heaven':'Section=ability Note="Fly 60\'/good %V minutes/dy"',
  'Wings':'Section=ability Note="Fly %V\'/average"',
  'Wisdom In The Flesh':
    'Section=skill ' +
    'Note="Use Wis modifier for chosen Str, Con, or Dex skill/choice is a class skill"',
  'Within Reach':'Section=save Note="DC 20 Will save vs. fatal attack 1/dy"',
  'Wooden Fist':
    'Section=combat ' +
    'Note="+%V Unarmed damage and no AOO on Unarmed attacks %1 rd/dy"',
  'World Traveler':
    'Section=skill ' +
    'Note="+1 choice of Diplomacy, Knowledge (Local), Sense Motive/choice is a class skill"',
  // Prestige classes
  'Acrobatic Charge':'Section=combat Note="May charge in difficult terrain"',
  'Aligned Arrows':
    'Section=combat Note="Arrows anarchic, axiomatic, holy, or unholy"',
  'Angel Of Death':'Section=combat Note="Death attack dusts corpse 1/dy"',
  'Applicable Knowledge':'Section=feature Note="+1 General Feat"',
  'Arrow Of Death':
    'Section=combat Note="Special arrow kills foe (DC %V Fort neg)"',
  'Blood Of Dragons':
    'Section=feature ' +
    'Note="Dragon Disciple level triggers Bloodline features"',
  'Bonus Language':'Section=feature Note="+%V Language Count"',
  'Call Down The Legends':
    'Section=magic Note="Summon 2d4 level 4 barbarians 1/wk"',
  'Canny Defense':'Section=combat Note="+%V AC in light or no armor"',
  'Caster Level Bonus':
    'Section=magic ' +
    'Note="+%V base class level for spells known and spells per day"',
  'Combined Spells':
    'Section=magic ' +
    'Note="Fill spell slots up to level %V with spells from different class"',
  'Constitution Boost':'Section=ability Note="+2 Constitution"',
  'Crippling Critical':
    'Section=combat Note="Critical hit causes follow-on damage"',
  'Death Attack':
    'Section=combat ' +
    'Note="Sneak attack after 3 rd of study causes death or paralysis d6+%1 rd (DC %V Fort neg)"',
  'Deep Pockets':
    'Section=feature,skill ' +
    'Note="Retrieve any small object from backpack as a full-round action",' +
         '"+4 Sleight Of Hand (conceal small objects)"',
  'Distance Arrows':'Section=combat Note="x2 range"',
  'Diverse Training':
    'Section=feature ' +
    'Note="Eldritch Knight level satisfies Fighter or arcane feat prerequisite"',
  'Dragon Bite':'Section=combat Note="d%V+%1%2 bite when using claws"',
  'Dragon Disciple':'Section=combat Note="+%V"',
  'Dragon Form':'Section=magic Note="<i>Form Of The Dragon %V</i> %1/dy"',
  'Elaborate Defense':'Section=combat Note="+%V AC when fighting defensively"',
  'Elemental Arrows':'Section=combat Note="Arrows %V"',
  'Enhance Arrow':'Section=combat Note="Arrows treated as +1 magic weapons"',
  'Enhanced Mobility':
    'Section=combat Note="+4 AC vs. movement AOO in light or no armor"',
  'Epic Tales':'Section=magic Note="Bardic Performance effect via writing%V"',
  'Grace':'Section=save Note="+2 Reflex in light or no armor"',
  'Greater Lore':
    'Section=skill Note="+10 Spellcraft (identify magic item properties)"',
  'Hail Of Arrows':
    'Section=combat Note="Simultaneously fire arrows at %V targets 1/dy"',
  'Hidden Weapons':'Section=skill Note="+%V Sleight Of Hand (hide weapons)"',
  'Imbue Arrow':'Section=magic Note="Center spell where arrow lands"',
  'Impromptu Sneak Attack':
    'Section=combat Note="Declare any attack a sneak attack %V/dy"',
  'Improved Aid':'Section=combat Note="Aid Another action gives +4 bonus"',
  'Improved Reaction':'Section=combat Note="+%V Initiative"',
  'Inspired Action':
    'Section=magic Note="Use Bardic Performance to give ally extra %V action"',
  'Instant Mastery':'Section=skill Note="4 ranks in untrained skill"',
  'Intelligence Boost':'Section=ability Note="+2 Intelligence"',
  'Invisible Thief':
    'Section=magic Note="<i>Greater Invisibility</i> %V rd/dy"',
  'Lay Of The Exalted Dead':
    'Section=magic Note="Summon d4+1 level 5 barbarians 1/wk"',
  'Live To Tell The Tale':
    'Section=save Note="Extra saving throw vs permanent condition %V/dy"',
  'Lore':'Section=skill Note="+%V All Knowledge/use any Knowledge untrained"',
  'Master Scribe':
    'Section=skill ' +
    'Note="+%V Linguistics/=%v Profession (Scribe)/+%V Use Magic Device (scrolls)"',
  'More Newfound Arcana':'Section=magic Note="Bonus level 2 spell"',
  'Newfound Arcana':'Section=magic Note="Bonus level 1 spell"',
  'No Retreat':'Section=combat Note="AOO on foe withdraw"',
  'Parry':
    'Section=combat ' +
    'Note="Hit on full-round attack negates foe attack instead of damaging"',
  'Pathfinding':
    'Section=ability,save,skill ' +
    'Note="Treat trackless terrain as road",' +
         '"+5 vs. <i>Maze</i>",' +
         '"+5 Survival (avoid becoming lost), DC 15 Survival to extend to companion"',
  'Phase Arrow':
    'Section=combat Note="Arrow passes through normal obstacles %V/dy"',
  'Poison Tolerance':'Section=save Note="+%V vs. poison"',
  'Poison Use':
    'Section=feature Note="No chance of self-poisoning when applying to blade"',
  'Precise Strike':'Section=combat Note="+%V HP with light piercing weapon"',
  'Quiet Death':
    'Section=combat Note="Stealth check to perform Death Attack unnoticed"',
  'Ranged Legerdemain':
    'Section=skill Note="+5 DC on Disable Device and Sleight Of Hand at 30\'"',
  'Riposte':'Section=combat Note="AOO after parry"',
  'Secret Health':'Section=combat Note="+3 HP"',
  'Secret Knowledge Of Avoidance':'Section=save Note="+2 Reflex"',
  'Secrets Of Inner Strength':'Section=save Note="+2 Will"',
  'Seeker Arrow':'Section=combat Note="Arrow maneuvers to target %V/dy"',
  'Shadow Call':'Section=magic Note="<i>Shadow Conjuration</i> %V/dy"',
  'Shadow Illusion':'Section=magic Note="<i>Silent Image</i> %V/dy"',
  'Shadow Jump':
    'Section=magic Note="<i>Dimension Door</i> between shadows %V\'/dy"',
  'Shadow Master':
    'Section=combat,save ' +
    'Note="DR 10/-, critical hit blinds d6 rd in dim light",' +
         '"+2 saves in dim light"',
  'Shadow Power':'Section=magic Note="<i>Shadow Evocation</i> %V/dy"',
  'Spell Critical':'Section=magic Note="Cast swift spell after critical hit"',
  'Spell Synthesis':
    'Section=magic ' +
    'Note="Cast two spells simultaneously, +2 vs. resistance, target -2 saves"',
  'Strength Boost':'Section=ability Note="+%V Strength"',
  'Summon Shadow':
    'Section=magic ' +
    'Note="Summon unturnable Shadow companion with %V HP, character attack/save, +4 will vs. channeled energy"',
  'Surprise Spells':
    'Section=combat Note="Sneak attack spell damage vs flat-footed foes"',
  'Swift Death':'Section=combat Note="Death attack w/out prior study 1/dy"',
  'The Lore Of True Stamina':'Section=save Note="+2 Fortitude"',
  'Tricky Spells':'Section=magic Note="Use Silent Spell and Still Spell %V/dy"',
  'True Death':
    'Section=combat ' +
    'Note="Raising victim requires DC %V <i>Remove Curse</i> or DC %1 caster level check"',
  'True Lore':
    'Section=magic Note="<i>Legend Lore</i>, <i>Analyze Dweomer</i> 1/dy"',
  'Weapon Trick':'Section=combat Note="+1 Melee Attack/+1 Ranged Attack"',
  'Whispering Campaign':
    'Section=magic Note="<i>Doom</i>/<i>Enthrall</i> via Bardic Performance"'
};
Pathfinder.GOODIES = Object.assign({}, SRD35.GOODIES, {
  'Protection CMD':
    'Pattern="([-+]\\d).*protection|protection\\s+([-+]\\d)" ' +
    'Effect=add ' +
    'Value="$1 || $2" ' +
    'Attribute=combatManeuverDefense ' +
    'Section=combat Note="%V CMD"'
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
  'Air Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Lightning Arc","6:Electricity Resistance"',
  'Animal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Speak With Animals","4:Animal Companion"',
  'Artifice Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Artificer\'s Touch","8:Dancing Weapons"',
  'Chaos Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Chaos","8:Chaos Blade"',
  'Charm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Addling Touch","8:Charming Smile"',
  'Community Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Calming Touch","8:Unity"',
  'Darkness Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Blind-Fight","1:Touch Of Darkness","8:Eyes Of Darkness"',
  'Death Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Bleeding Touch","8:Death\'s Embrace"',
  'Destruction Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Destructive Smite","8:Destructive Aura"',
  'Earth Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Acid Dart","6:Acid Resistance"',
  'Evil Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Evil","8:Scythe Of Evil"',
  'Fire Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Fire Bolt","6:Fire Resistance"',
  'Glory Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Undead Bane","1:Touch Of Glory","8:Divine Presence"',
  'Good Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Good","8:Holy Lance"',
  'Healing Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Rebuke Death","6:Healer\'s Blessing"',
  'Knowledge Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Lore Keeper","6:Remote Viewing"',
  'Law Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Touch Of Law","8:Staff Of Order"',
  'Liberation Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Liberation","8:Freedom\'s Call"',
  'Luck Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Bit Of Luck","6:Good Fortune"',
  'Madness Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Vision Of Madness","8:Aura Of Madness"',
  'Magic Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Hand Of The Acolyte","8:Dispelling Touch"',
  'Nobility Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Inspiring Word","8:Noble Leadership"',
  'Plant Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Wooden Fist","6:Bramble Armor"',
  'Protection Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Resistance Bonus","1:Resistant Touch","8:Aura Of Protection"',
  'Repose Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Gentle Rest","8:Ward Against Death"',
  'Rune Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Scribe Scroll","1:Blast Rune","8:Spell Rune"',
  'Strength Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Strength Rush","8:Might Of The Gods"',
  'Sun Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Sun\'s Blessing","8:Nimbus Of Light"',
  'Travel Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Travel Speed","1:Agile Feet","8:Dimensional Hop"',
  'Trickery Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Copycat","8:Master\'s Illusion"',
  'War Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Battle Rage","8:Weapon Master"',
  'Water Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Icicle","6:Cold Resistance"',
  'Weather Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Storm Burst","8:Lightning Lord"',
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
      'Aberrant9:19=1',
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
      'Abyssal9:19=1',
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
      'Arcane9:19=1',
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
      'Celestial9:19=1',
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
      'Destined9:19=1',
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
      'Draconic9:19=1',
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
      'Elemental9:19=1',
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
      'Fey9:19=1',
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
      'Infernal9:19=1',
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
      'Undead9:19=1'
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
      '"Gnomish1:1=1"',
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
      '"Halfling Luck","Keen Senses","Resist Fear",Slow,Small,Sure-Footed ' +
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
      '"1:Physical Enhancement","1:Telekinetic Fist","8:Change Shape"'
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
Pathfinder.SPELLS = {

  'Acid Arrow':'Level=W2',
  'Acid Fog':'Level=W6',
  'Acid Splash':'Level=Rogue0,W0',
  'Aid':'Level=C2,Luck2',
  'Air Walk':'Level=Air4,C4,D4',
  'Alarm':'Level=B1,Destined1,R1,Rogue1,W1',
  'Align Weapon':'Level=C2,Chaos2,Evil2,Good2,Law2',
  'Alter Self':'Level=B2,W2',
  'Analyze Dweomer':'Level=B6,W6',
  'Animal Growth':'Level=D5,R4,W5',
  'Animal Messenger':'Level=B2,D2,R1',
  'Animal Shapes':'Level=Animal7,D8',
  'Animal Trance':'Level=B2,D2',
  'Animate Dead':'Level=C3,Death3,Undead4,W4',
  'Animate Objects':'Level=B6,C6,Chaos6',
  'Animate Plants':'Level=D7,Plant7',
  'Animate Rope':'Level=Artifice1,B1,Rogue1,W1',
  'Antilife Shell':'Level=Animal6,C6,D6',
  'Antimagic Field':'Level=C8,Magic6,Protection6,W6',
  'Antipathy':'Level=D9,W8',
  'Antiplant Shell':'Level=D4',
  'Arcane Eye':'Level=W4',
  'Arcane Lock':'Level=W2',
  'Arcane Mark':'Level=Rogue0,W0',
  'Arcane Sight':'Level=W3',
  'Astral Projection':'Level=C9,Travel9,W9',
  'Atonement':'Level=C5,D5',
  'Augury':'Level=C2',
  'Awaken':'Level=D5',
  'Baleful Polymorph':'Level=D5,W5',
  'Bane':'Level=C1',
  'Banishment':'Level=C6,Celestial7,W7',
  'Barkskin':'Level=D2,Plant2,R2',
  'Bear\'s Endurance':'Level=C2,D2,R2,W2',
  'Bestow Curse':'Level=C3,W4',
  'Binding':'Level=W8',
  'Black Tentacles':'Level=Aberrant4,W4',
  'Blade Barrier':'Level=C6,Good6,War6',
  'Blasphemy':'Level=C7,Evil7',
  'Bless':'Level=C1,Celestial1,Community1,P1',
  'Bless Water':'Level=C1,P1',
  'Bless Weapon':'Level=Glory2,P1',
  'Blight':'Level=D4,W5',
  'Blindness/Deafness':'Level=B2,C3,Darkness2,W2',
  'Blink':'Level=B3,W3',
  'Blur':'Level=B2,Destined2,W2',
  'Break Enchantment':'Level=B4,C5,Destined5,Liberation5,Luck5,P4,W5',
  'Bull\'s Strength':'Level=Abyssal2,C2,D2,P2,Strength2,W2',
  'Burning Hands':'Level=Elemental1,Fire1,Rogue1,W1',
  'Call Lightning':'Level=D3,Weather3',
  'Call Lightning Storm':'Level=D5',
  'Calm Animals':'Level=Animal1,D1,R1',
  'Calm Emotions':'Level=B2,C2,Charm2',
  'Cat\'s Grace':'Level=B2,D2,R2,W2',
  'Cause Fear':'Level=Abyssal1,B1,C1,Death1,Rogue1,W1',
  'Chain Lightning':'Level=Air6,W6',
  'Changestaff':'Level=D7',
  'Chaos Hammer':'Level=C4,Chaos4',
  'Charm Animal':'Level=D1,R1',
  'Charm Monster':'Level=B3,Charm5,Infernal4,W4',
  'Charm Person':'Level=B1,Charm1,Rogue1,W1',
  'Chill Metal':'Level=D2',
  'Chill Touch':'Level=Rogue1,Undead1,W1',
  'Circle Of Death':'Level=W6',
  'Clairaudience/Clairvoyance':'Level=B3,Knowledge3,W3',
  'Clenched Fist':'Level=Strength8,W8',
  'Cloak Of Chaos':'Level=C8,Chaos8',
  'Clone':'Level=W8',
  'Cloudkill':'Level=W5',
  'Color Spray':'Level=Rogue1,W1',
  'Command':'Level=C1',
  'Command Plants':'Level=D4,Plant4,R3',
  'Command Undead':'Level=W2',
  'Commune':'Level=C5',
  'Commune With Nature':'Level=D5,R4',
  'Comprehend Languages':'Level=B1,C1,Knowledge1,Rogue1,W1',
  'Cone Of Cold':'Level=W5,Water6',
  'Confusion':'Level=B3,Madness4,Trickery4,W4',
  'Consecrate':'Level=C2',
  'Contact Other Plane':'Level=W5',
  'Contagion':'Level=C3,D3,W4',
  'Contingency':'Level=W6',
  'Continual Flame':'Level=C3,W2',
  'Control Plants':'Level=D8,Plant8',
  'Control Undead':'Level=W7',
  'Control Water':'Level=C4,D4,W6,Water4',
  'Control Weather':'Level=C7,D7,W7,Weather7',
  'Control Winds':'Level=Air5,D5,Weather6',
  'Create Food And Water':'Level=C3',
  'Create Greater Undead':'Level=C8,Death8,W8',
  'Create Undead':'Level=C6,Death6,Evil6,W6',
  'Create Water':'Level=C0,D0,P1',
  'Creeping Doom':'Level=D7',
  'Crushing Despair':'Level=B3,W4',
  'Crushing Hand':'Level=Strength9,W9',
  'Cure Critical Wounds':'Level=B4,C4,D5,Healing4',
  'Cure Light Wounds':'Level=B1,C1,D1,Healing1,P1,R2',
  'Cure Moderate Wounds':'Level=B2,C2,D3,Healing2,P3,R3',
  'Cure Serious Wounds':'Level=B3,C3,D4,Healing3,P4,R4',
  'Curse Water':'Level=C1',
  'Dancing Lights':'Level=B0,Gnomish0,Rogue0,W0',
  'Darkness':'Level=B2,C2,W2',
  'Darkvision':'Level=R3,W2',
  'Daylight':'Level=B3,C3,D3,P3,W3',
  'Daze':'Level=B0,Rogue0,W0',
  'Daze Monster':'Level=B2,W2',
  'Death Knell':'Level=C2,Death2',
  'Death Ward':'Level=C4,D5,Death4,Repose4,P4',
  'Deathwatch':'Level=C1,Repose1',
  'Deep Slumber':'Level=B3,Fey3,W3',
  'Deeper Darkness':'Level=C3,Darkness3',
  'Delay Poison':'Level=B2,C2,D2,P2,R1',
  'Delayed Blast Fireball':'Level=W7',
  'Demand':'Level=Charm8,Nobility8,W8',
  'Desecrate':'Level=C2',
  'Destruction':'Level=C7,Death7,Repose7',
  'Detect Animals Or Plants':'Level=D1,R1',
  'Detect Chaos':'Level=C1',
  'Detect Evil':'Level=C1',
  'Detect Good':'Level=C1',
  'Detect Law':'Level=C1',
  'Detect Magic':'Level=B0,C0,D0,Rogue0,W0',
  'Detect Poison':'Level=C0,D0,P1,R1,Rogue0,W0',
  'Detect Scrying':'Level=B4,W4',
  'Detect Secret Doors':'Level=B1,Rogue1,W1',
  'Detect Snares And Pits':'Level=D1,R1',
  'Detect Thoughts':'Level=B2,Knowledge2,W2',
  'Detect Undead':'Level=C1,P1,Rogue1,W1',
  'Dictum':'Level=C7,Law7',
  'Dimension Door':'Level=Arcane4,B4,Monk4,Shadowdancer4,Travel4,W4',
  'Dimensional Anchor':'Level=C4,W4',
  'Dimensional Lock':'Level=C8,W8',
  'Diminish Plants':'Level=D3,R3',
  'Discern Lies':'Level=C4,Nobility4,P3',
  'Discern Location':'Level=C8,Knowledge8,W8',
  'Disguise Self':'Level=B1,Rogue1,Trickery1,W1',
  'Disintegrate':'Level=Destruction7,W6',
  'Dismissal':'Level=Abyssal5,C4,W5',
  'Dispel Chaos':'Level=C5,Law5,P4',
  'Dispel Evil':'Level=C5,Good5,P4',
  'Dispel Good':'Level=C5,Evil5',
  'Dispel Law':'Level=C5,Chaos5',
  'Dispel Magic':'Level=Arcane3,B3,C3,D4,Magic3,P3,Rogue3,W3', // Arcane Magic
  'Displacement':'Level=B3,W3',
  'Disrupt Undead':'Level=Rogue0,W0',
  'Disrupting Weapon':'Level=C5',
  'Divination':'Level=C4,Knowledge4',
  'Divine Favor':'Level=C1,Nobility1,P1',
  'Divine Power':'Level=C4,War4',
  'Dominate Animal':'Level=Animal3,D3',
  'Dominate Monster':'Level=Charm9,W9',
  'Dominate Person':'Level=B4,Infernal5,W5',
  'Doom':'Level=C1',
  'Dream':'Level=B5,W5',
  'Eagle\'s Splendor':'Level=B2,C2,P2,W2',
  'Earthquake':'Level=C8,D8,Destruction8,Earth8',
  'Elemental Swarm':'Level=Air9,D9,Earth9,Elemental9,Fire9,Water9',
  'Endure Elements':'Level=C1,D1,P1,R1,Rogue1,Sun1,W1',
  'Energy Drain':'Level=C9,Undead9,W9',
  'Enervation':'Level=W4',
  'Enlarge Person':'Level=Aberrant1,Rogue1,Strength1,W1',
  'Entangle':'Level=D1,Fey1,Plant1,R1',
  'Enthrall':'Level=B2,C2,Nobility2',
  'Entropic Shield':'Level=C1',
  'Erase':'Level=B1,Rogue1,Rune1,W1',
  'Ethereal Jaunt':'Level=C7,W7',
  'Etherealness':'Level=C9,Monk9,W9',
  'Expeditious Retreat':'Level=B1,Rogue1,W1',
  'Explosive Runes':'Level=Rune4,W3',
  'Eyebite':'Level=B6,W6',
  'Fabricate':'Level=Artifice5,W5',
  'Faerie Fire':'Level=D1',
  'False Life':'Level=Undead2,W2',
  'False Vision':'Level=B5,Trickery5,W5',
  'Fear':'Level=B3,Draconic4,W4',
  'Feather Fall':'Level=B1,Rogue1,W1',
  'Feeblemind':'Level=Aberrant5,W5',
  'Find The Path':'Level=B6,C6,D6,Knowledge6,Travel6',
  'Find Traps':'Level=C2',
  'Finger Of Death':'Level=D8,Undead7,W7',
  'Fire Seeds':'Level=D6,Fire6,Sun6',
  'Fire Shield':'Level=Fire5,Sun4,W4',
  'Fire Storm':'Level=C8,D7',
  'Fire Trap':'Level=D2,W4',
  'Fireball':'Level=Fire3,W3',
  'Flame Arrow':'Level=W3',
  'Flame Blade':'Level=D2',
  'Flame Strike':'Level=C5,Celestial5,D4,Sun5,War5',
  'Flaming Sphere':'Level=D2,W2',
  'Flare':'Level=B0,D0,Rogue0,W0',
  'Flesh To Stone':'Level=W6',
  'Floating Disk':'Level=Rogue1,W1',
  'Fly':'Level=Draconic3,Travel3,W3',
  'Fog Cloud':'Level=D2,W2,Water2,Weather2',
  'Forbiddance':'Level=C6',
  'Forcecage':'Level=W7',
  'Forceful Hand':'Level=W6',
  'Foresight':'Level=D9,Destined9,Knowledge9,W9',
  'Fox\'s Cunning':'Level=B2,W2',
  'Freedom':'Level=Liberation9,W9',
  'Freedom Of Movement':'Level=B4,C4,D4,Destined4,Liberation4,Luck4,R4',
  'Freezing Sphere':'Level=W6',
  'Gaseous Form':'Level=Air3,B3,W3',
  'Gate':'Level=C9,Celestial9,Glory9,W9',
  'Geas/Quest':'Level=B6,C6,Charm6,Nobility6,W6',
  'Gentle Repose':'Level=C2,Repose2,W3',
  'Ghost Sound':'Level=B0,Gnomish0,Rogue0,W0',
  'Ghoul Touch':'Level=W2',
  'Giant Vermin':'Level=C4,D4',
  'Glibness':'Level=B3',
  'Glitterdust':'Level=B2,W2',
  'Globe Of Invulnerability':'Level=W6',
  'Glyph Of Warding':'Level=C3,Rune3',
  'Good Hope':'Level=B3',
  'Goodberry':'Level=D1',
  'Grasping Hand':'Level=Strength7,W7',
  'Grease':'Level=B1,Rogue1,W1',
  'Greater Arcane Sight':'Level=W7',
  'Greater Command':'Level=C5,Nobility5',
  'Greater Dispel Magic':'Level=B5,C6,Celestial6,Liberation6,D6,W6',
  'Greater Glyph Of Warding':'Level=C6,Rune6',
  'Greater Heroism':'Level=B5,W6',
  'Greater Invisibility':'Level=B4,W4',
  'Greater Magic Fang':'Level=D3,R3',
  'Greater Magic Weapon':'Level=C4,P3,W3',
  'Greater Planar Ally':'Level=C8',
  'Greater Planar Binding':'Level=W8',
  'Greater Prying Eyes':'Level=W8',
  'Greater Restoration':'Level=C7',
  'Greater Scrying':'Level=B6,C7,D7,W7',
  'Greater Shadow Conjuration':'Level=Shadowdancer7,W7',
  'Greater Shadow Evocation':'Level=Darkness8,W8',
  'Greater Shout':'Level=B6,W8',
  'Greater Spell Immunity':'Level=C8',
  'Greater Teleport':'Level=Abyssal7,Arcane7,Infernal7,Travel7,W7',
  'Guards And Wards':'Level=W6',
  'Guidance':'Level=C0,D0',
  'Gust Of Wind':'Level=D2,W2',
  'Hallow':'Level=C5,D5',
  'Hallucinatory Terrain':'Level=B4,W4',
  'Halt Undead':'Level=W3',
  'Harm':'Level=C6,Destruction6',
  'Haste':'Level=B3,W3',
  'Heal':'Level=C6,D7,Healing6',
  'Heal Mount':'Level=P3',
  'Heat Metal':'Level=D2,Sun2',
  'Helping Hand':'Level=C3',
  'Heroes\' Feast':'Level=B6,C6,Community6',
  'Heroism':'Level=B2,Charm4,W3',
  'Hide From Animals':'Level=D1,R1',
  'Hide From Undead':'Level=C1',
  'Hideous Laughter':'Level=B1,Fey2,W2',
  'Hold Animal':'Level=Animal2,D2,R2',
  'Hold Monster':'Level=B4,Law6,W5',
  'Hold Person':'Level=B2,C2,W3',
  'Hold Portal':'Level=Rogue1,W1',
  'Holy Aura':'Level=C8,Glory8,Good8',
  'Holy Smite':'Level=C4,Glory4,Good4',
  'Holy Sword':'Level=Glory7,P4',
  'Holy Word':'Level=C7,Good7',
  'Horrid Wilting':'Level=Undead8,Water8,W8',
  'Hypnotic Pattern':'Level=B2,W2',
  'Hypnotism':'Level=B1,Rogue1,W1',
  'Ice Storm':'Level=D4,W4,Water5,Weather5',
  'Identify':'Level=Arcane1,Magic1,B1,Rogue1,W1',
  'Illusory Script':'Level=B3,W3',
  'Illusory Wall':'Level=W4',
  'Imbue With Spell Ability':'Level=C4,Community4,Magic4',
  'Implosion':'Level=C9,Destruction9',
  'Imprisonment':'Level=W9',
  'Incendiary Cloud':'Level=Fire8,W8',
  'Inflict Critical Wounds':'Level=C4,Destruction4',
  'Inflict Light Wounds':'Level=C1',
  'Inflict Moderate Wounds':'Level=C2',
  'Inflict Serious Wounds':'Level=C3',
  'Insanity':'Level=Charm7,Madness7,W7',
  'Insect Plague':'Level=C5,D5',
  'Instant Summons':'Level=Rune7,W7',
  'Interposing Hand':'Level=W5',
  'Invisibility':'Level=Arcane2,B2,Trickery2,W2',
  'Invisibility Purge':'Level=C3',
  'Invisibility Sphere':'Level=B3,W3',
  'Iron Body':'Level=W8',
  'Ironwood':'Level=D6',
  'Irresistible Dance':'Level=B6,Fey8,W8',
  'Jump':'Level=D1,R1,Rogue1,W1',
  'Keen Edge':'Level=W3',
  'Knock':'Level=W2',
  'Know Direction':'Level=B0,D0',
  'Legend Lore':'Level=B4,Knowledge7,W6',
  'Lesser Confusion':'Level=B1,Madness1',
  'Lesser Geas':'Level=B3,W4',
  'Lesser Globe Of Invulnerability':'Level=W4',
  'Lesser Planar Ally':'Level=C4',
  'Lesser Planar Binding':'Level=Rune5,W5',
  'Lesser Restoration':'Level=C2,D2,P1',
  'Levitate':'Level=W2',
  'Light':'Level=B0,C0,D0,Rogue0,W0',
  'Lightning Bolt':'Level=W3',
  'Limited Wish':'Level=W7',
  'Liveoak':'Level=D6',
  'Locate Creature':'Level=B4,W4',
  'Locate Object':'Level=B2,C3,Travel2,W2',
  'Longstrider':'Level=D1,R1,Travel1',
  'Lullaby':'Level=B0',
  'Mage Armor':'Level=Draconic1,Rogue1,W1',
  'Mage Hand':'Level=B0,Rogue0,W0',
  'Mage\'s Disjunction':'Level=Magic9,W9',
  'Mage\'s Faithful Hound':'Level=W5',
  'Mage\'s Lucubration':'Level=W6',
  'Mage\'s Magnificent Mansion':'Level=W7',
  'Mage\'s Private Sanctum':'Level=W5',
  'Mage\'s Sword':'Level=W7',
  'Magic Aura':'Level=B1,Rogue1,W1',
  'Magic Circle Against Chaos':'Level=C3,Law3,P3,W3',
  'Magic Circle Against Evil':'Level=C3,Celestial3,Good3,P3,W3',
  'Magic Circle Against Good':'Level=C3,Evil3,W3',
  'Magic Circle Against Law':'Level=C3,Chaos3,W3',
  'Magic Fang':'Level=D1,R1',
  'Magic Jar':'Level=W5',
  'Magic Missile':'Level=Rogue1,W1',
  'Magic Mouth':'Level=B1,Magic2,W2',
  'Magic Stone':'Level=C1,D1,Earth1',
  'Magic Vestment':'Level=C3,Nobility3,Strength3,War3',
  'Magic Weapon':'Level=C1,P1,Rogue1,W1,War1',
  'Major Creation':'Level=Artifice6,W5',
  'Major Image':'Level=B3,W3',
  'Make Whole':'Level=C2,W2',
  'Mark Of Justice':'Level=C5,P4',
  'Mass Bear\'s Endurance':'Level=C6,D6,W6',
  'Mass Bull\'s Strength':'Level=C6,D6,W6',
  'Mass Cat\'s Grace':'Level=B6,D6,W6',
  'Mass Charm Monster':'Level=B6,W6',
  'Mass Cure Critical Wounds':'Level=C8,Community8,D9,Healing8',
  'Mass Cure Light Wounds':'Level=B5,C5,D6',
  'Mass Cure Moderate Wounds':'Level=B6,C6,D7',
  'Mass Cure Serious Wounds':'Level=C7,D8',
  'Mass Eagle\'s Splendor':'Level=B6,C6,W6',
  'Mass Enlarge Person':'Level=W4',
  'Mass Fox\'s Cunning':'Level=B6,W6',
  'Mass Heal':'Level=C9,Healing9',
  'Mass Hold Monster':'Level=W9',
  'Mass Hold Person':'Level=W7',
  'Mass Inflict Critical Wounds':'Level=C8',
  'Mass Inflict Light Wounds':'Level=C5',
  'Mass Inflict Moderate Wounds':'Level=C6',
  'Mass Inflict Serious Wounds':'Level=C7',
  'Mass Invisibility':'Level=Trickery8,W7',
  'Mass Owl\'s Wisdom':'Level=C6,D6,W6',
  'Mass Reduce Person':'Level=W4',
  'Mass Suggestion':'Level=B5,W6',
  'Maze':'Level=W8',
  'Meld Into Stone':'Level=C3,D3',
  'Mending':'Level=B0,C0,D0,Rogue0,W0',
  'Message':'Level=B0,Rogue0,W0',
  'Meteor Swarm':'Level=Infernal9,W9',
  'Mind Blank':'Level=Aberrant8,Liberation8,Protection8,W8',
  'Mind Fog':'Level=B5,W5',
  'Minor Creation':'Level=Artifice4,W4',
  'Minor Image':'Level=B2,W2',
  'Miracle':'Level=C9,Community9,Luck9',
  'Mirage Arcana':'Level=B5,W5',
  'Mirror Image':'Level=B2,W2',
  'Misdirection':'Level=B2,W2',
  'Mislead':'Level=B5,Destined6,Fey6,Luck6,Trickery6,W6',
  'Mnemonic Enhancer':'Level=W4',
  'Modify Memory':'Level=B4',
  'Moment Of Prescience':'Level=Destined8,Luck8,W8',
  'Mount':'Level=Rogue1,W1',
  'Move Earth':'Level=D6,W6',
  'Neutralize Poison':'Level=B4,C4,D3,P4,R3',
  'Nightmare':'Level=B5,Madness5,W5',
  'Nondetection':'Level=R4,Trickery3,W3',
  'Obscure Object':'Level=B1,C3,W2',
  'Obscuring Mist':'Level=Air1,C1,D1,Darkness1,Rogue1,Water1,W1,Weather1',
  'Open/Close':'Level=B0,Rogue0,W0',
  'Order\'s Wrath':'Level=C4,Law4',
  'Overland Flight':'Level=Arcane5,W5',
  'Owl\'s Wisdom':'Level=C2,D2,P2,R2,W2',
  'Passwall':'Level=W5',
  'Pass Without Trace':'Level=D1,R1',
  'Permanency':'Level=W5',
  'Permanent Image':'Level=B6,W6',
  'Persistent Image':'Level=B5,W5',
  'Phantasmal Killer':'Level=Madness6,W4',
  'Phantom Steed':'Level=B3,W3',
  'Phantom Trap':'Level=W2',
  'Phase Door':'Level=Fey7,Travel8,W7',
  'Planar Ally':'Level=C6',
  'Planar Binding':'Level=Infernal6,W6',
  'Plane Shift':'Level=Aberrant7,C5,W7',
  'Plant Growth':'Level=D3,Plant3,R3',
  'Poison':'Level=C4,D3,Fey4',
  'Polar Ray':'Level=W8',
  'Polymorph':'Level=W5',
  'Polymorph Any Object':'Level=W8',
  'Power Word Blind':'Level=Darkness7,W7,War7',
  'Power Word Kill':'Level=W9,War9',
  'Power Word Stun':'Level=Arcane8,Infernal8,W8,War8',
  'Prayer':'Level=C3,Community3,P3',
  'Prestidigitation':'Level=B0,Gnomish0,Rogue0,W0',
  'Prismatic Sphere':'Level=Artifice9,Protection9,Sun9,W9',
  'Prismatic Spray':'Level=W7',
  'Prismatic Wall':'Level=W8',
  'Produce Flame':'Level=D1,Fire2',
  'Programmed Image':'Level=B6,W6',
  'Project Image':'Level=B6,W7',
  'Protection From Arrows':'Level=W2',
  'Protection From Chaos':'Level=C1,Law1,P1,Rogue1,W1',
  'Protection From Energy':'Level=C3,D3,Destined3,Elemental3,Luck3,Protection3,R2,W3',
  'Protection From Evil':'Level=C1,Good1,P1,Rogue1,W1',
  'Protection From Good':'Level=C1,Evil1,Infernal1,Rogue1,W1',
  'Protection From Law':'Level=C1,Chaos1,Rogue1,W1',
  'Protection From Spells':'Level=Magic8,W8',
  'Prying Eyes':'Level=W5',
  'Purify Food And Drink':'Level=C0,D0',
  'Pyrotechnics':'Level=B2,W2',
  'Quench':'Level=D3',
  'Rage':'Level=Abyssal3,B2,Destruction3,Madness3,W3',
  'Rainbow Pattern':'Level=B4,W4',
  'Raise Dead':'Level=C5',
  'Ray Of Enfeeblement':'Level=Rogue1,W1',
  'Ray Of Exhaustion':'Level=W3',
  'Ray Of Frost':'Level=Rogue0,W0',
  'Read Magic':'Level=B0,C0,D0,P1,R1,Rogue0,W0',
  'Reduce Animal':'Level=D2,R3',
  'Reduce Person':'Level=Rogue1,W1',
  'Refuge':'Level=C7,Community7,Liberation7,W9',
  'Regenerate':'Level=C7,D9,Healing7',
  'Reincarnate':'Level=D4',
  'Remove Blindness/Deafness':'Level=C3,P3',
  'Remove Curse':'Level=B3,C3,Celestial4,Liberation3,P3,W4',
  'Remove Disease':'Level=C3,D3,R3',
  'Remove Fear':'Level=B1,C1,Liberation1',
  'Remove Paralysis':'Level=C2,Liberation2,P2',
  'Repel Metal Or Stone':'Level=D8',
  'Repel Vermin':'Level=B4,C4,D4,R3',
  'Repel Wood':'Level=D6,Plant6',
  'Repulsion':'Level=C7,Nobility7,Protection7,W6',
  'Resilient Sphere':'Level=W4',
  'Resist Energy':'Level=C2,Celestial2,D2,Draconic2,P2,R1,W2',
  'Resistance':'Level=B0,C0,D0,P1,Rogue0,W0',
  'Restoration':'Level=C4,P4',
  'Resurrection':'Level=C7',
  'Reverse Gravity':'Level=D8,W7',
  'Righteous Might':'Level=C5,Glory5,Strength5',
  'Rope Trick':'Level=W2',
  'Rusting Grasp':'Level=D4',
  'Sanctuary':'Level=C1,Glory1,Protection1',
  'Scare':'Level=B2,W2',
  'Scintillating Pattern':'Level=Madness8,W8',
  'Scorching Ray':'Level=Elemental2,Infernal2,W2',
  'Screen':'Level=Trickery7,W8',
  'Scrying':'Level=B3,C5,D4,W4',
  'Sculpt Sound':'Level=B3',
  'Searing Light':'Level=C3,Glory3,Sun3',
  'Secret Chest':'Level=W5',
  'Secret Page':'Level=B3,Rune2,W3',
  'Secure Shelter':'Level=B4,W4',
  'See Invisibility':'Level=Aberrant2,B3,W2',
  'Seeming':'Level=B5,W5',
  'Sending':'Level=C4,W5',
  'Sepia Snake Sigil':'Level=B3,W3',
  'Sequester':'Level=W7',
  'Shades':'Level=Darkness9,W9',
  'Shadow Conjuration':'Level=B4,Darkness4,Shadowdancer4,W4',
  'Shadow Evocation':'Level=B5,Shadowdancer5,W5',
  'Shadow Walk':'Level=B5,Darkness6,W6',
  'Shambler':'Level=D9,Plant9',
  'Shapechange':'Level=Aberrant9,Animal9,D9,Fey9,W9',
  'Shatter':'Level=B2,C2,Destruction2,W2',
  'Shield':'Level=Rogue1,W1',
  'Shield Of Faith':'Level=C1,Glory1',
  'Shield Of Law':'Level=C8,Law8',
  'Shield Other':'Level=C2,Community2,Protection2,P2',
  'Shillelagh':'Level=D1',
  'Shocking Grasp':'Level=Rogue1,W1',
  'Shout':'Level=B4,Destruction5,W4',
  'Shrink Item':'Level=W3',
  'Silence':'Level=B2,C2',
  'Silent Image':'Level=B1,Rogue1,Shadowdancer1,W1',
  'Simulacrum':'Level=W7',
  'Slay Living':'Level=C5,Death5,Repose5',
  'Sleep':'Level=B1,Rogue1,W1',
  'Sleet Storm':'Level=D3,W3,Weather4',
  'Slow':'Level=B3,W3',
  'Snare':'Level=D3,R2',
  'Soften Earth And Stone':'Level=D2,Earth2',
  'Solid Fog':'Level=W4',
  'Song Of Discord':'Level=B5',
  'Soul Bind':'Level=C9,W9',
  'Sound Burst':'Level=B2,C2',
  'Speak With Animals':'Level=Animal1,B3,D1,Gnomish1,R1',
  'Speak With Dead':'Level=C3,Knowledge3,Repose3',
  'Speak With Plants':'Level=B4,D3,R2',
  'Spectral Hand':'Level=W2',
  'Spell Immunity':'Level=C4,Protection4,Strength4',
  'Spell Resistance':'Level=C5,Draconic5,Magic5,Protection5',
  'Spell Turning':'Level=Destined7,Luck7,Magic7,W7',
  'Spellstaff':'Level=D6',
  'Spider Climb':'Level=D2,W2',
  'Spike Growth':'Level=D3,R2',
  'Spike Stones':'Level=D4,Earth4',
  'Spiritual Weapon':'Level=C2,War2',
  'Statue':'Level=Artifice8,W7',
  'Status':'Level=C2',
  'Stinking Cloud':'Level=W3',
  'Stone Shape':'Level=Artifice3,C3,D3,Earth3,W4',
  'Stone Tell':'Level=D6',
  'Stone To Flesh':'Level=W6',
  'Stoneskin':'Level=Abyssal4,D5,Earth6,Strength6,W4',
  'Storm Of Vengeance':'Level=C9,D9,Nobility9,Weather9',
  'Suggestion':'Level=B2,Charm3,Infernal3,W3',
  'Summon Instrument':'Level=B0',
  'Summon Monster I':'Level=B1,C1,Rogue1,W1',
  'Summon Monster II':'Level=B2,C2,W2',
  'Summon Monster III':'Level=B3,C3,W3',
  'Summon Monster IV':'Level=B4,C4,W4',
  'Summon Monster IX':'Level=Abyssal9,C9,Chaos9,Evil9,Good9,Law9,W9',
  'Summon Monster V':'Level=B5,C5,Darkness5,W5',
  'Summon Monster VI':'Level=B6,C6,W6',
  'Summon Monster VII':'Level=C7,W7',
  'Summon Monster VIII':'Level=C8,Elemental8,W8',
  'Summon Nature\'s Ally I':'Level=D1,R1',
  'Summon Nature\'s Ally II':'Level=D2,R2',
  'Summon Nature\'s Ally III':'Level=D3,R3',
  'Summon Nature\'s Ally IV':'Level=Animal4,D4,R4',
  'Summon Nature\'s Ally IX':'Level=D9',
  'Summon Nature\'s Ally V':'Level=D5',
  'Summon Nature\'s Ally VI':'Level=D6',
  'Summon Nature\'s Ally VII':'Level=D7',
  'Summon Nature\'s Ally VIII':'Level=Animal8,D8',
  'Summon Swarm':'Level=B2,D2,W2',
  'Sunbeam':'Level=D7,Sun7',
  'Sunburst':'Level=Celestial8,D8,Sun8,W8',
  'Symbol Of Death':'Level=C8,Rune8,W8',
  'Symbol Of Fear':'Level=C6,W6',
  'Symbol Of Insanity':'Level=C8,W8',
  'Symbol Of Pain':'Level=C5,W5',
  'Symbol Of Persuasion':'Level=C6,W6',
  'Symbol Of Sleep':'Level=C5,W5',
  'Symbol Of Stunning':'Level=C7,W7',
  'Symbol Of Weakness':'Level=C7,W7',
  'Sympathetic Vibration':'Level=B6',
  'Sympathy':'Level=D9,W8',
  'Telekinesis':'Level=W5',
  'Telekinetic Sphere':'Level=W8',
  'Telepathic Bond':'Level=Community5,W5',
  'Teleport':'Level=Travel5,W5',
  'Teleport Object':'Level=W7',
  'Teleportation Circle':'Level=Rune9,W9',
  'Temporal Stasis':'Level=W8',
  'Time Stop':'Level=Trickery9,W9',
  'Tiny Hut':'Level=B3,W3',
  'Tongues':'Level=Aberrant3,B2,C4,W3',
  'Touch Of Fatigue':'Level=Rogue0,W0',
  'Touch Of Idiocy':'Level=Madness2,W2',
  'Transformation':'Level=Abyssal6,W6',
  'Transmute Metal To Wood':'Level=D7',
  'Transmute Mud To Rock':'Level=D5,W5',
  'Transmute Rock To Mud':'Level=D5,W5',
  'Transport Via Plants':'Level=D6',
  'Trap The Soul':'Level=W8',
  'Tree Shape':'Level=D2,R3',
  'Tree Stride':'Level=D5,Fey5,R4',
  'True Resurrection':'Level=C9',
  'True Seeing':'Level=Arcane6,C5,D7,Knowledge5,W6',
  'True Strike':'Level=Destruction1,Luck1,Rogue1,W1',
  'Undeath To Death':'Level=C6,Glory6,Repose6,Undead6,W6',
  'Undetectable Alignment':'Level=B1,C2,P2',
  'Unhallow':'Level=C5,D5',
  'Unholy Aura':'Level=Abyssal8,C8,Evil8',
  'Unholy Blight':'Level=C4,Evil4',
  'Unseen Servant':'Level=B1,Rogue1,W1',
  'Vampiric Touch':'Level=Undead3,W3',
  'Veil':'Level=Aberrant6,B6,W6',
  'Ventriloquism':'Level=B1,Rogue1,W1',
  'Virtue':'Level=C0,D0,P1',
  'Vision':'Level=W7',
  'Wail Of The Banshee':'Level=Death9,Repose9,W9',
  'Wall Of Fire':'Level=D5,Fire4,W4',
  'Wall Of Force':'Level=W5',
  'Wall Of Ice':'Level=W4',
  'Wall Of Iron':'Level=Artifice7,W6',
  'Wall Of Stone':'Level=C5,D6,Earth5,W5',
  'Wall Of Thorns':'Level=D5,Plant5',
  'Warp Wood':'Level=D2',
  'Water Breathing':'Level=C3,D3,W3,Water3',
  'Water Walk':'Level=C3,R3',
  'Waves Of Exhaustion':'Level=Repose8,W7',
  'Waves Of Fatigue':'Level=Undead5,W5',
  'Web':'Level=W2',
  'Weird':'Level=Madness9,W9',
  'Whirlwind':'Level=Air8,D8,Weather8',
  'Whispering Wind':'Level=B2,W2',
  'Wind Walk':'Level=C6,D7',
  'Wind Wall':'Level=Air2,C3,D3,R2,W3',
  'Wish':'Level=Arcane9,Draconic9,W9',
  'Wood Shape':'Level=Artifice2,D2',
  'Word Of Chaos':'Level=C7,Chaos7',
  'Word Of Recall':'Level=C6,D8',
  'Zone Of Silence':'Level=B4',
  'Zone Of Truth':'Level=C2,P2',

  'Beast Shape I':
    'School=Transmutation ' +
    'Level=W3 ' +
    'Description="Become small (+2 Dex, +1 AC) or medium (+2 Str, +2 AC) animal for $L min"',
  'Beast Shape II':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="Become tiny (+4 Dex, -2 Str, +1 AC) or large (+4 Str, -2 Dex, +4 AC) animal for $L min"',
  'Beast Shape III':
    'School=Transmutation ' +
    'Level=Animal5,W5 ' +
    'Description="Become diminutive (+6 Dex, -4 Str, +1 AC) or huge (+6 Str, -4 Dex, +6 AC) animal or small (+4 Dex, +2 AC) or medium (+4 Str, +4 AC) magical beast for $L min"',
  'Beast Shape IV':
    'School=Transmutation ' +
    'Level=W6 ' +
    'Description="Become tiny (+8 Dex, -2 Str, +3 AC) or large (+6 Str, -2 Dex, +2 Con, +6 AC) magical beast for $L min"',
  'Bleed':
    'School=Necromancy ' +
    'Level=C0,Rogue0,W0 ' +
    'Description="R$RS\' Stabilized target resume dying (Will neg)"',
  'Breath Of Life':
    'School=Conjuration ' +
    'Level=C5,Healing5 ' +
    'Description="Heal 5d8+$L (max 25) plus resurrect target dead lt 1 rd"',
  'Elemental Body I':
    'School=Transmutation ' +
    'Level=Elemental4,W4 ' +
    'Description="Become small air (+2 Dex, +2 AC, fly 60\', whirlwind), earth (+2 Str, +4 AC, earth glide), fire (+2 Dex, +2 AC, resist fire, burn), water (+2 Con, +4 AC, swim 60\', vortex, breathe water) elemental, 60\' darkvision for $L min"',
  'Elemental Body II':
    'School=Transmutation ' +
    'Level=Elemental5,W5 ' +
    'Description="Become medium air (+4 Dex, +3 AC, fly 60\', whirlwind), earth (+4 Str, +5 AC, earth glide), fire (+4 Dex, +3 AC, resist fire, burn), water (+4 Con, +5 AC, swim 60\', vortex, breathe water) elemental, 60\' darkvision for $L min"',
  'Elemental Body III':
    'School=Transmutation ' +
    'Level=Elemental6,W6 ' +
    'Description="Become large air (+2 Str, +4 Dex, +4 AC, fly 60\', whirlwind), earth (+6 Str, -2 Dex, +2 Con, +6 AC, earth glide), fire (+4 Dex, +2 Con, +4 AC, resist fire, burn), water (+2 Str, -2 Dex, +6 Con, +6 AC, swim 60\', vortex, breathe water) elemental, 60\' darkvision, immune bleed, critical, sneak attack for $L min"',
  'Elemental Body IV':
    'School=Transmutation ' +
    'Level=Air7,Earth7,Elemental7,Fire7,W7,Water7 ' +
    'Description="Become huge air (+4 Str, +6 Dex, +4 AC, fly 120\', whirlwind), earth (+8 Str, -2 Dex, +4 Con, +6 AC, earth glide), fire (+6 Dex, +4 Con, +4 AC, resist fire, burn), water (+4 Str, -2 Dex, +8 Con, +6 AC, swim 120\', vortex, breathe water) elemental, 60\' darkvision, immune bleed, critical, sneak attack, DR 5, - for $L min"',
  'Form Of The Dragon I':
    'School=Transmutation ' +
    'Level=Draconic6,W6 ' +
    'Description="Become Medium dragon (+4 Str, +2 Con, +4 AC, Fly 60\', Darkvision 60\', breath weapon once 6d8 HP (Ref half), element resistance, bite 1d8 HP, claws 2x1d6 HP, wings 2x1d4 HP) for $L min"',
  'Form Of The Dragon II':
    'School=Transmutation ' +
    'Level=Draconic7,W7 ' +
    'Description="Become Large dragon (+6 Str, +4 Con, +6 AC, Fly 90\', Darkvision 60\', breath weapon twice 8d8 HP (Ref half), element resistance, bite 2d6 HP, claws 2x1d8 HP, wings 2x1d6 HP) for $L min"',
  'Form Of The Dragon III':
    'School=Transmutation ' +
    'Level=Draconic8,W8 ' +
    'Description="Become Huge dragon (+10 Str, +8 Con, +8 AC, Fly 120\', Blindsense 60\', Darkvision 120\', breath weapon 1, d4 rd 12d8 HP (Ref half), element immunity, bite 2d8 HP, claws 2x2d6 HP, wings 2x1d8 HP, tail 2d6 HP) for $L min"',
  'Giant Form I':
    'School=Transmutation ' +
    'Level=W7 ' +
    'Description="Become large giant (+6 Str, -2 Dex, +4 Con, +4 AC, low-light vision, form abilities) for $L min"',
  'Giant Form II':
    'School=Transmutation ' +
    'Level=W8 ' +
    'Description="Become huge giant (+8 Str, -2 Dex, +6 Con, +6 AC, low-light vision, form abilities) for $L min"',
  'Greater Polymorph':
    'School=Transmutation ' +
    'Level=W7 ' +
    'Description="Willing target becomes animal, elemental, plant, or dragon for $L min"',
  'Plant Shape I':
    'School=Transmutation ' +
    'Level=W5 ' +
    'Description="Become small (+2 Con, +2 AC) or medium (+2 Str, +2 Con, +2 AC) plant creature for $L min"',
  'Plant Shape II':
    'School=Transmutation ' +
    'Level=W6 ' +
    'Description="Become large (+4 Str, +2 Con, +4 AC) plant creature for $L min"',
  'Plant Shape III':
    'School=Transmutation ' +
    'Level=W7 ' +
    'Description="Become huge (+8 Str, -2 Dex, +4 Con, +6 AC) plant creature for $L min"',
  'Stabilize':
    'School=Conjuration ' +
    'Level=C0,D0 ' +
    'Description="R$RS\' Stabilize dying target"'

};
for(var s in Pathfinder.SPELLS) {
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
  'Beneficent Touch':'Type=Faction Subtype="Silver Crusade"',
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
  'Dunewalker':'Type=Faction Subtype=Osirion',
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
Pathfinder.WEAPONS = {
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
};
Pathfinder.CLASSES = {
  'Barbarian':
    'Require="alignment !~ \'Lawful\'" ' +
    'HitDie=d12 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Fast Movement",1:Rage,"2:Uncanny Dodge","3:Trap Sense",' +
      '"5:Improved Uncanny Dodge","7:Damage Reduction","11:Greater Rage",' +
      '"14:Indomitable Will","17:Tireless Rage","20:Mighty Rage" ' +
    'Selectables=' +
      '"2:Animal Fury","8:Clear Mind","12:Fearless Rage","2:Guarded Stance",' +
      '"8:Increased Damage Reduction","8:Internal Fortitude",' +
      '"2:Intimidating Glare","2:Knockback","2:Low-Light Rage",' +
      '"12:Mighty Swing","2:Moment Of Clarity","2:Night Vision",' +
      '"2:No Escape","2:Powerful Blow","2:Quick Reflexes",' +
      '"2:Raging Climber","2:Raging Leaper","2:Raging Swimmer",' +
      '"8:Renewed Vigor","2:Rolling Dodge","2:Roused Anger","2:Scent Rage",' +
      '"2:Strength Surge","2:Superstition","2:Surprise Accuracy",' +
      '"2:Swift Foot","8:Terrifying Howl","4:Unexpected Strike"',
  'Bard':
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Simple/Longsword/Rapier/Sap/Short Sword/Short Bow/Whip)",' +
      '"1:Bardic Knowledge","1:Bardic Performance",1:Countersong,' +
      '1:Distraction,1:Fascinate,"1:Inspire Courage","1:Simple Somatics",' +
      '"2:Versatile Performance",2:Well-Versed,"3:Inspire Competence",' +
      '"5:Lore Master",6:Suggestion,"8:Dirge Of Doom","9:Inspire Greatness",' +
      '"10:Jack Of All Trades","12:Soothing Performance",' +
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
      'B6:16=1;17=2;18=3;19=4;20=5',
  'Cleric':
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
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
      'Domain9:17=1',
  'Druid':
    'Require="alignment =~ \'Neutral\'","armor =~ \'None|Hide|Leather|Padded\'","shield =~ \'None|Wooden\'" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
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
      'D9:17=1;18=2;19=3;20=4',
  'Fighter':
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Tower Shield Proficiency",' +
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
      'Monk9:19=1',
  'Paladin':
    'Require="alignment == \'Lawful Good\'" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '1:Aura,"1:Detect Evil","1:Smite Evil","2:Divine Grace",' +
      '"2:Lay On Hands","3:Aura Of Courage","3:Divine Health",3:Mercy,' +
      '"4:Channel Energy","8:Aura Of Resolve","14:Aura Of Faith",' +
      '"17:Aura Of Righteousness","17:Resist Evil","20:Holy Champion" ' +
    'Selectables=' +
      '"3:Mercy (Fatigued)","3:Mercy (Shaken)","3:Mercy (Sickened)",' +
      '"features.Divine Weapon == 0 ? 5:Divine Mount",' +
      '"features.Divine Mount == 0 ? 5:Divine Weapon",' +
      '"6:Mercy (Dazed)","6:Mercy (Diseased)","6:Mercy (Staggered)",' +
      '"9:Mercy (Cursed)","9:Mercy (Exhausted)","9:Mercy (Frighted)",' +
      '"9:Mercy (Nauseated)","9:Mercy (Poisoned)","12:Mercy (Blinded)",' +
      '"12:Mercy (Deafened)","12:Mercy (Paralyzed)","12:Mercy (Stunned)" ' +
    'CasterLevelDivine="levels.Paladin >= 4 ? levels.Paladin - 3 : null" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'P1:4=0;5=1;9=2;13=3;17=4,' +
      'P2:8=0;9=1;12=2;16=3;20=4,' +
      'P3:19=0;11=1;15=2;19=3,' +
      'P4:13=0;14=1;18=2;20=3',
  'Ranger':
    'HitDie=d10 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
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
      'R4:13=0;14=1;18=2;20=3',
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
      'Rogue3:10=1',
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
      '"1:Bonded Object",1:Familiar,"1:School Specialization (None)",' +
      QuilvynUtils.getKeys(SRD35.SCHOOLS).map(x => '"1:School Specialization (' + x + ')"').join(',') + ',' +
      QuilvynUtils.getKeys(SRD35.SCHOOLS).map(x => '"1:School Opposition (' + x + ')"').join(',') + ' ' +
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
      'W9:17=1;18=2;19=3;20=4'
};
Pathfinder.NPC_CLASSES = {
  'Adept':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)","2:Summon Familiar" ' +
    'Skills=' +
      'Craft,"Handle Animal",Heal,Knowledge,Profession,Spellcraft,Survival ' +
    'CasterLevelDivine=Level ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Adept0:1=3,' +
      'Adept1:1=1;3=2;7=3,' +
      'Adept2:4=0;5=1;7=2;11=3,' +
      'Adept3:8=0;9=1;11=2;15=3,' +
      'Adept4:12=0;13=1;15=2;19=3,' +
      'Adept5:16=0;17=1;19=2',
  'Aristocrat':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)" ' +
    'Skills=' +
      'Appraise,Bluff,Craft,Diplomacy,Disguise,"Handle Animal",Intimidate,' +
      'Knowledge,Linguistics,Perception,Perform,Profession,Ride,' +
      '"Sense Motive",Swim,Survival',
  'Commoner':
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)" ' +
    'Skills=Climb,Craft,"Handle Animal",Perception,Profession,Ride,Swim',
  'Expert':
    'HitDie=d6 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Simple)"',
    // 10 skills of player's choice
  'Warrior':
    'HitDie=d8 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)" ' +
    'Skills=Climb,Craft,"Handle Animal",Intimidate,Profession,Ride,Swim'
};
Pathfinder.PRESTIGE_CLASSES = {
  'Arcane Archer':
    'Require=' +
      '"baseAttack >= 6","casterLevelArcane >= 1","features.Point-Blank Shot",'+
      '"features.Precise Shot",' +
      '"features.Weapon Focus (Longbow) || features.Weapon Focus (Shortbow)" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Perception,Ride,Stealth,Survival ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Enhance Arrows","2:Caster Level Bonus","2:Imbue Arrow",' +
      '"3:Elemental Arrows","4:Seeker Arrow","5:Distance Arrows",' +
      '"6:Phase Arrow","8:Hail Of Arrows","9:Aligned Arrows",' +
      '"10:Arrow Of Death"',
  'Arcane Trickster':
    'Require=' +
      '"alignment !~ \'Lawful\'","features.sneakAttack >= 2",' +
      '"skills.Disable Device >= 4","skills.Escape Artist >= 4",' +
      '"skills.Knowledge (Arcana) >= 4","Sum \'^spells\\.Mage Hand\' >= 1",' +
      '"Sum \'^spells\\..*[BW]3\' >= 0" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Climb,Diplomacy,"Disable Device",Disguise,' +
      '"Escape Artist",Knowledge,Perception,"Sense Motive","Sleight Of Hand",' +
      'Spellcraft,Stealth,Swim ' +
    'Features=' +
        '"1:Caster Level Bonus","1:Ranged Legerdemain","2:Sneak Attack",' +
        '"3:Impromptu Sneak Attack","5:Tricky Spells","9:Invisible Thief",' +
        '"10:Surprise Spells"',
  'Assassin':
    'Require=' +
      '"alignment =~ \'Evil\'","skills.Disguise >= 2","skill.Stealth >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,Climb,Diplomacy,"Disable Device",Disguise,' +
      '"Escape Artist",Intimidate,Linguistics,Perception,"Sense Motive",' +
      '"Sleight Of Hand",Stealth,Swim,"Use Magic Device" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Punching Dagger/Rapier/Sap/Shortbow/Composite Shortbow/Short Sword)",' +
      '"1:Death Attack","1:Poison Use","1:Sneak Attack","2:Poison Tolerance",' +
      '"2:Uncanny Dodge","4:Hidden Weapons","4:True Death",' +
      '"5:Improved Uncanny Dodge","6:Quiet Death","8:Hide In Plain Sight",' +
      '"9:Swift Death","10:Angel Of Death"',
  'Dragon Disciple':
    'Require=' +
      '"languages.Draconic","race !~ \'Dragon\'",' +
      '"skills.Knowledge (Arcana) >= 5",' +
      '"levels.Bard > 0 || levels.Sorcerer > 0",' +
      // i.e., Arcane spells w/out prep
      '"levels.Sorcerer == 0 || sorcererFeatures.Bloodline Draconic" ' +
    'HitDie=d12 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Diplomacy,"Escape Artist",Fly,Knowledge,Perception,Spellcraft ' +
    'Features=' +
      '"1:Blood Of Dragons","1:Natural Armor","2:Caster Level Bonus",' +
      '"2:Dragon Bite","2:Strength Boost",5:Blindsense,' +
      '"6:Constitution Boost","7:Dragon Form","8:Intelligence Boost" ' +
    'Selectables=' +
      '"1:Bloodline Draconic (Black)","1:Bloodline Draconic (Blue)",' +
      '"1:Bloodline Draconic (Green)","1:Bloodline Draconic (Red)",' +
      '"1:Bloodline Draconic (White)","1:Bloodline Draconic (Brass)",' +
      '"1:Bloodline Draconic (Bronze)","1:Bloodline Draconic (Copper)",' +
      '"1:Bloodline Draconic (Gold)","1:Bloodline Draconic (Silver)"',
  'Duelist':
    'Require=' +
      '"baseAttack >= 6",features.Dodge,features.Mobility,' +
      '"features.Weapon Finesse","skills.Acrobatics >= 2",' +
      '"Sum \'^skills\\.Perform \' >= 2" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,"Escape Artist",Perception,Perform,"Sense Motive" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Simple)",' +
      '"1:Canny Defense","1:Precise Strike","2:Improved Reaction",2:Parry,' +
      '"3:Enhanced Mobility","4:Combat Reflexes",4:Grace,5:Riposte,' +
      '"6:Acrobatic Charge","7:Elaborate Defense","9:Deflect Arrows",' +
      '"9:No Retreat","10:Crippling Critical"',
  'Eldritch Knight':
    'Require=' +
      '"features.Weapon Proficiency (Martial)",' +
      '"Sum \'^spells\\..*[BW]3\' >= 0" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,"Knowledge (Arcana)","Knowledge (Nobility)",Linguistics,Ride,' +
      '"Sense Motive",Spellcraft,Swim ' +
    'Features=' +
      '"1:Diverse Training","2:Caster Level Bonus","10:Spell Critical"',
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
      '"1:Caster Level Bonus",2:Lore,"4:Bonus Language","6:Greater Lore",' +
      '"10:True Lore" ' +
    'Selectables=' +
      '"1:Applicable Knowledge","1:Dodge Trick","1:Instant Mastery",' +
      '"1:More Newfound Arcana","Newfound Arcana","1:Secret Health",' +
      '"1:Secret Knowledge Of Avoidance","1:Secrets Of Inner Strength",' +
      '"1:The Lore Of True Stamina","1:Weapon Trick"',
  'Mystic Theurge':
    'Require=' +
      '"casterLevelArcane >= 3","casterLevelDivine >= 3",' +
      '"skills.Knowledge (Arcana) >= 3","skills.Knowledge (Religion) >= 3" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      '"Knowledge (Arcana)","Knowledge (Religion)","Sense Motive",Spellcraft ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Combined Spells","10:Spell Synthesis"',
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
      '3:Countersong,3:Distraction,3:Fascinate,"3:Improved Aid",' +
      '"3:Inspire Courage","4:Epic Tales","5:Inspire Competence",' +
      '"5:Whispering Campaign","6:Inspired Action","7:Call Down The Legends",' +
      '8:Suggestion,"10:Dirge Of Doom","10:Lay Of The Exalted Dead"',
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
      '"1:Weapon Proficiency (Composite Shortbow/Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Mace/Morningstar/Punching Dagger/Quarterstaff/Rapier/Sap/Shortbow/Short Sword)",' +
      '"1:Hide In Plain Sight",2:Darkvision,2:Evasion,"2:Uncanny Dodge",' +
      '"3:Shadow Illusion","3:Summon Shadow","4:Shadow Call","4:Shadow Jump",' +
      '"5:Defensive Roll","5:Improved Uncanny Dodge","7:Slippery Mind",' +
      '"8:Shadow Power","10:Improved Evasion","10:Shadow Master" ' +
    'Selectables=' +
      '"3:Bleeding Attack","3:Combat Trick","3:Fast Stealth",' +
      '"3:Finesse Rogue","3:Ledge Walker","3:Major Magic","3:Minor Magic",' +
      '"3:Quick Disable",3:Resiliency,"3:Rogue Crawl","3:Slow Reactions",' +
      '"3:Stand Up","3:Surprise Attack","3:Trap Spotter",' +
      '"3:Rogue Weapon Training","3:Crippling Strike","3:Defensive Roll",' +
      '"3:Dispelling Attack","3:Feat Bonus","3:Improved Evasion",' +
      '3:Opportunist,"3:Skill Mastery","3:Slippery Mind" ' +
    'CasterLevelArcane=levels.Shadowdancer ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Shadowdancer1:3=1,' +
      'Shadowdancer4:4=2,' +
      'Shadowdancer5:8=1,' +
      'Shadowdancer7:10=1'
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
  // NOTE: SRD35.abilityRules adds minimum ability checks (at least one ability
  // > 13, ability modifiers must sum to > 0), that are not in the PRD.
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

/* Defines rules related to basic character identity. */
Pathfinder.identityRules = function(
  rules, alignments, classes, deities, factions, paths, races, tracks, traits,
  prestigeClasses, npcClasses
) {

  QuilvynUtils.checkAttrTable(alignments, []);
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(deities, ['Alignment', 'Domain', 'Weapon']);
  QuilvynUtils.checkAttrTable(factions, []);
  // Note addition of feats and skills to SRD35's list
  QuilvynUtils.checkAttrTable
    (paths, ['Group', 'Level', 'Features', 'Selectables', 'Feats', 'Skills', 'SpellAbility', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(races, ['Require', 'Features', 'Selectables', 'Languages', 'SpellAbility', 'SpellSlots']);
  QuilvynUtils.checkAttrTable(tracks, ['Progression']);
  QuilvynUtils.checkAttrTable(traits, ['Type', 'Subtype']);

  for(var alignment in alignments) {
    rules.choiceRules(rules, 'Alignment', alignment, alignments[alignment]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
  }
  if(prestigeClasses) {
    for(var pc in prestigeClasses) {
      rules.choiceRules(rules, 'Prestige', pc, prestigeClasses[pc]);
      rules.defineRule('levels.' + pc, 'prestige.' + pc, '=', null);
      // Pathfinder prestige classes use different progressions for saves
      for(var save in {'Fortitude':'', 'Reflex':'', 'Will':''}) {
        var value = QuilvynUtils.getAttrValue(prestigeClasses[pc], save);
        rules.defineRule('class' + save + 'Bonus',
          'levels.' + pc, '+', 'Math.floor((source + 1) / ' + (value == '1/2' ? '2' : '3') + ')'
        );
      }
    }
  }
  if(npcClasses) {
    for(var nc in npcClasses) {
      rules.choiceRules(rules, 'Npc', nc, npcClasses[nc]);
      rules.defineRule('levels.' + nc, 'npc.' + nc, '=', null);
    }
  }
  for(var faction in factions) {
    rules.choiceRules(rules, 'Faction', faction, factions[faction]);
  }
  // Process paths before deities for domain definitions
  for(var path in paths) {
    rules.choiceRules(rules, 'Path', path, paths[path]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'Deity', deity, deities[deity]);
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
    ('faction', 'Faction', 'select-one', 'factions', 'alignment');
  rules.defineSheetElement('Faction', 'Alignment');
  rules.defineEditorElement('traits', 'Traits', 'set', 'traits', 'skills');
  rules.defineSheetElement('Traits', 'Feats+', null, '; ');
  rules.defineChoice('extras', 'traits');
  rules.defineEditorElement
    ('experienceTrack', 'Track', 'select-one', 'tracks', 'feats');
  rules.defineSheetElement('Experience Track', 'ExperienceInfo/', ' (%V)');
  rules.defineEditorElement
    ('favoredClassHitPoints', 'Favored Class Hit Points/Skill Points', 'text', [4], 'hitPoints');
  rules.defineEditorElement
    ('favoredClassSkillPoints', '', 'text', [4], 'hitPoints');

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
Pathfinder.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  SRD35.talentRules(rules, feats, features, goodies, languages, skills);
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
  else if(type == 'Class' || type == 'Npc' || type == 'Prestige') {
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
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
  else if(type == 'Goody')
    Pathfinder.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Path') {
    Pathfinder.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Feats'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Pathfinder.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    Pathfinder.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
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
  } else if(type == 'Spell') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = (school || 'Universal').substring(0, 4);
    for(var i = 0; i < groupLevels.length; i++) {
      var matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      var group = matchInfo[1];
      var level = matchInfo[2] * 1;
      var fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      // TODO indicate domain spells in attributes?
      var domainSpell = Pathfinder.PATHS[group + ' Domain'] != null;
      Pathfinder.spellRules
        (rules, fullName, school, group, level, description, domainSpell);
      rules.addChoice('spells', fullName, attrs);
    }
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
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature' && type != 'Path' && type != 'Spell') {
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
 * character level attribute 'level'. If the class grants spell slots,
 * #spellAbility# names the ability for computing spell difficulty class, and
 * #spellSlots# lists the number of spells per level per day granted.
 */
Pathfinder.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots
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
    casterLevelDivine, spellAbility, spellSlots
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
      'combatNotes.animalFury.2', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.animalFury.2',
      'features.Animal Fury', '?', null,
      'strengthModifier', '=', 'source + 2',
      'features.Greater Rage', '+', '1',
      'features.Mighty Rage', '+', '1'
    );
    rules.defineRule('combatNotes.damageReduction',
      'levels.Barbarian', '+=', 'Math.floor((source - 4) / 3)'
    );
    rules.defineRule('combatNotes.increasedDamageReduction',
      'features.Increased Damage Reduction', '=', null
    );
    rules.defineRule('combatNotes.guardedStance',
      'levels.Barbarian', '=', '1 + Math.floor(source / 6)'
    );
    rules.defineRule('combatNotes.guardedStance.1',
      'features.Guarded Stance', '?', null,
      'combatNotes.guardedStance.2', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.guardedStance.2',
      'features.Guarded Stance', '?', null,
      'constitutionModifier', '=', 'source + 2',
      'features.Greater Rage', '+', '1',
      'features.Mighty Rage', '+', '1'
    );
    rules.defineRule('combatNotes.knockback',
      'strengthModifier', '=', 'source + 2',
      'features.Greater Rage', '+', '1',
      'features.Mighty Rage', '+', '1'
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
      'combatNotes.rollingDodge.2', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.rollingDodge.2',
      'features.Rolling Dodge', '?', null,
      'constitutionModifier', '=', 'source + 2',
      'features.Greater Rage', '+', '1',
      'features.Mighty Rage', '+', '1'
    );
    rules.defineRule
      ('combatNotes.strengthSurge', 'levels.Barbarian', '=', null);
    rules.defineRule('combatNotes.surpriseAccuracy',
      'levels.Barbarian', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.terrifyingHowl',
      'levels.Barbarian', '=', '10 + Math.floor(source / 2)',
      'strengthModifier', '+', 'source + 2',
      'features.Greater Rage', '+', '1',
      'features.Mighty Rage', '+', '1'
    );
    rules.defineRule('magicNotes.renewedVigor',
      'levels.Barbarian', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('magicNotes.renewedVigor.1',
      'features.Renewed Vigor', '?', null,
      'constitutionModifier', '=', 'source + 2',
      'features.Greater Rage', '+', '1',
      'features.Mighty Rage', '+', '1'
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
      'magicNotes.charismaChannelEnergyAdjustment', '+', null
    );
    rules.defineRule('magicNotes.channelEnergy.2',
      'features.Channel Energy', '?', null,
      'magicNotes.charismaChannelEnergyAdjustment', '=', '3 + source'
    );
    rules.defineRule('magicNotes.charismaChannelEnergyAdjustment',
      'features.Channel Energy', '?', null,
      'charismaModifier', '=', null
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
    rules.defineRule
      ('magicNotes.mercy', 'levels.Paladin', '=', 'Math.floor(source / 3)');
    rules.defineRule('magicNotes.removeDisease',
      'levels.Paladin', '=', 'Math.floor((source - 3) / 3)'
    );
    rules.defineRule('saveNotes.divineGrace', 'charismaModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Paladin',
      'levels.Paladin', '+=', 'Math.floor(source / 3) + (source>=5 ? 1 : null)'
    );
    var mercies =
      QuilvynUtils.getKeys(rules.getChoices('selectableFeatures'), /Mercy/).map(x => x.replace(/^.*Mercy/, 'Mercy'));
    rules.defineRule('magicNotes.mercy.1',
      'levels.Paladin', '=', '(Pathfinder.merciesTaken = []).length'
    );
    for(var i = 0; i < mercies.length; i++) {
      var mercy = mercies[i];
      rules.defineRule('magicNotes.mercy.1',
        'paladinFeatures.' + mercy, '=', 'Pathfinder.merciesTaken.push("' + mercy.replace(/Mercy..|.$/g, '').toLowerCase() + '") ? Pathfinder.merciesTaken.join(", ") : ""'
      );
    }

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

  } else if(name == 'Arcane Archer') {

    rules.defineRule(
      'combatNotes.arrowOfDeath', 'charismaModifier', '=', 'source + 20'
    );
    rules.defineRule('combatNotes.elementalArrows',
     'levels.Arcane Archer', '=',
     'source < 7 ? "flaming/frost/shock" : "flaming burst/icy burst/shocking burst"'
    );
    rules.defineRule
      ('combatNotes.hailOfArrows', 'levels.Arcane Archer', '+=', null);
    rules.defineRule(
      'combatNotes.phaseArrow', 'levels.Arcane Archer', '=',
      'Math.floor((source - 4) / 2)'
    );
    rules.defineRule(
      'combatNotes.seekerArrow', 'levels.Arcane Archer', '=',
      'Math.floor((source - 2) / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Arcane Archer', '=',
      'source >= 2 ? source - Math.floor((source + 3) / 4) : null'
    );

  } else if(name == 'Arcane Trickster') {

    rules.defineRule('combatNotes.impromptuSneakAttack',
      'levels.Arcane Trickster', '+=', 'source < 7 ? 1 : 2'
    );
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Arcane Trickster', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Arcane Trickster', '+=', null
    );
    rules.defineRule('magicNotes.invisibleThief',
      'levels.Arcane Trickster', '+=', null
    );
    rules.defineRule('magicNotes.trickySpells',
      'levels.Arcane Trickster', '+=', 'Math.floor((source + 1) / 2)'
    );

  } else if(name == 'Assassin') {

    rules.defineRule('combatNotes.deathAttack',
      'levels.Assassin', '+=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.deathAttack.1', 'levels.Assassin', '+=', null);
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Assassin', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.trueDeath',
      'levels.Assassin', '+=', '10 + source'
    );
    rules.defineRule('combatNotes.trueDeath.1',
      'levels.Assassin', '+=', '15 + source'
    );
    rules.defineRule
      ('resistance.Poison', 'saveNotes.poisonTolerance', '+=', null);
    rules.defineRule('saveNotes.poisonTolerance',
      'levels.Assassin', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.hiddenWeapon', 'levels.Assassin', '=', null);
    rules.defineRule('assassinFeatures.Improved Uncanny Dodge',
      'assassinFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Assassin', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Assassin', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Dragon Disciple') {

    rules.defineRule('abilityNotes.wings',
      'levels.Dragon Disciple', '+=', 'source >= 9 ? 30 : null'
    );
    rules.defineRule('abilityNotes.strengthBoost',
      'levels.Dragon Disciple', '+=', 'source>=4 ? 4 : source>=2 ? 2 : null'
    );
    rules.defineRule('armorClass',
      'combatNotes.dragonDiscipleArmorClassAdjustment', '+', null
    );
    rules.defineRule('combatNotes.breathWeapon',
      'levels.Dragon Disciple', '+=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule('combatNotes.dragonBite',
      'levels.Dragon Disciple', '?', 'source >= 2',
      '', '=', '6',
      'features.Small', '=', '4',
      'features.Large', '=', '8'
    );
    rules.defineRule('combatNotes.dragonBite.1',
      'features.Dragon Bite', '?', null,
      'strengthModifier', '=', 'Math.floor(source * 1.5)'
    );
    rules.defineRule('combatNotes.dragonBite.2',
      'features.Dragon Bite', '?', null,
      'levels.Dragon Disciple', '=', 'source >= 6 ? ", d6 energy" : ""'
    );
    rules.defineRule('combatNotes.dragonDiscipleArmorClassAdjustment',
      'levels.Dragon Disciple', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('combatNotes.naturalArmor',
      'levels.Dragon Disciple', '+', 'source >= 7 ? 3 : source >= 4 ? 2 : 1'
    );
    rules.defineRule
      ('constitution', 'abilityNotes.constitutionBoost', '+', '2');
    rules.defineRule('featCount.Bloodline Draconic',
      'levels.Dragon Disciple', '+=', 'source<2 ? null : Math.floor((source + 4) / 6)'
    );
    rules.defineRule
      ('features.Bloodline Draconic', 'levels.Dragon Disciple', '=', '1');
    rules.defineRule('featureNotes.blindsense',
      'levels.Dragon Disciple', '^=', 'source >= 5 ? 30 : source >= 10 ? 60 : null'
    );
    rules.defineRule
      ('intelligence', 'abilityNotes.intelligenceBoost', '+', '2');
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Dragon Disciple', '+=', 'source - Math.floor((source + 3) / 4)'
    );
    rules.defineRule('magicNotes.dragonForm',
      'levels.Dragon Disciple', '=', 'source < 10 ? "I" : "II"'
    );
    rules.defineRule('magicNotes.dragonForm.1',
      'levels.Dragon Disciple', '=', 'source < 10 ? 1 : 2'
    );
    rules.defineRule('sorcererFeatures.Breath Weapon',
      'levels.Dragon Disciple', '=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule('sorcererFeatures.Wings',
      'levels.Dragon Disciple', '=', 'source >= 9 ? 1 : null'
    );
    rules.defineRule('strength', 'abilityNotes.strengthBoost', '+', null);
    // Choice of Draconic Bloodline if not Sorcerer
    rules.defineRule('selectableFeatureCount.Dragon Disciple',
      'levels.Dragon Disciple', '=', '1',
      'levels.Sorcerer', 'v', '0'
    );
    rules.defineRule('features.Bloodline Draconic',
      'selectableFeatureCount.Dragon Disciple', '=', 'source == 1 ? 1 : null'
    );
    rules.defineRule('bloodlineDraconicLevel',
      'selectableFeatureCount.Dragon Disciple', '=', 'source == 1 ? 0 : null',
      'levels.Dragon Disciple', '+', null
    );

  } else if(name == 'Duelist') {

    rules.defineRule('armorClass', 'combatNotes.cannyDefense', '+', null);
    rules.defineRule('combatNotes.cannyDefense',
      'intelligenceModifier', '+=', 'source < 0 ? null : source',
      'levels.Duelist', 'v', null
    );
    rules.defineRule('combatNotes.elaborateDefense',
      'levels.Duelist', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.improvedReaction',
      'levels.Duelist', '+=', 'source < 2 ? null : source < 8 ? 2 : 4'
    );
    rules.defineRule('combatNotes.preciseStrike', 'levels.Duelist', '=', null);
    rules.defineRule('initiative', 'combatNotes.improvedReaction', '+', null);
    rules.defineRule('save.Reflex', 'saveNotes.grace', '+', null);

  } else if(name == 'Eldritch Knight') {

    rules.defineRule('featCount.Fighter',
      'levels.Eldritch Knight', '+=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Eldritch Knight', '+=', 'source > 1 ? source - 1 : null'
    );

  } else if(name == 'Loremaster') {

    var allSkills = rules.getChoices('skills');
    for(var skill in allSkills) {
      if(skill.startsWith('Knowledge'))
        rules.defineRule('countKnowledgeGe7',
          'skills.' + skill, '+=', 'source >= 7 ? 1 : null'
        );
    }
    rules.defineRule('armorClass', 'combatNotes.dodgeTrick', '+', '1');
    rules.defineRule('baseAttack', 'combatNotes.weaponTrick', '+','1');
    rules.defineRule('casterLevelArcane', 'levels.Loremaster', '+=', null);
    rules.defineRule
      ('featCount.General', 'featureNotes.applicableKnowledge', '+', '1');
    rules.defineRule('featureNotes.bonusLanguage',
      'levels.Loremaster', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule('hitPoints', 'combatNotes.secretHealth', '+','3');
    rules.defineRule('languageCount', 'featureNotes.bonusLanguage', '+', null);
    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Loremaster', '+=', null);
    rules.defineRule
      ('save.Fortitude', 'saveNotes.theLoreOfTrueStamina', '+', '2');
    rules.defineRule('save.Will', 'saveNotes.secretsOfInnerStrength', '+', '2');
    rules.defineRule
      ('save.Reflex', 'saveNotes.secretKnowledgeOfAvoidance', '+', '2');
    rules.defineRule('selectableFeatureCount.Loremaster',
      'levels.Loremaster', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('skillNotes.lore', 'levels.Loremaster', '+=', 'Math.floor(source / 2)');

  } else if(name == 'Mystic Theurge') {

    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Mystic Theurge', '=', null
    );
    rules.defineRule('magicNotes.combinedSpells',
      'levels.Mystic Theurge', '+=', 'Math.floor((source + 1) / 2)'
    );

  } else if(name == 'Pathfinder Chronicler') {

    rules.defineRule('casterLevels.Doom',
      'levels.Pathfinder Chronicler', '^=', 'source < 5 ? null : source'
    );
    rules.defineRule('casterLevels.Enthrall',
      'levels.Pathfinder Chronicler', '^=', 'source < 5 ? null : source'
    );
    rules.defineRule('casterLevels.Suggestion',
      'levels.Pathfinder Chronicler', '^=', 'source < 3 ? null : source'
    );
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calculated even for non-Wizard Pathfinder Chroniclers.
    rules.defineRule('casterLevels.W',
      'levels.Pathfinder Chronicler', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('featureNotes.bardicPerformance',
      'levels.Pathfinder Chronicler', '+=', '2 + 2 * (source - 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.epicTales',
      'levels.Pathfinder Chronicler', '=',
      'source >= 8 ? " or reading by others" : ""'
    );
    rules.defineRule('magicNotes.fascinate',
      'levels.Pathfinder Chronicler', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.fascinate.1',
      'levels.Pathfinder Chronicler', '+=', '10 + Math.floor((source-2) / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.inspiredAction',
      'levels.Pathfinder Chronicler', '=',
      'source < 9 ? "Move" : "Move/Standard"'
    );
    rules.defineRule('magicNotes.inspireCompetence',
      'levels.Pathfinder Chronicler', '+=', '1 + Math.floor((source - 1) / 4)'
    );
    rules.defineRule('magicNotes.inspireCourage',
      'levels.Pathfinder Chronicler', '+=', '1 + Math.floor((source - 1) / 6)'
    );
    rules.defineRule('saveNotes.liveToTellTheTale',
      'levels.Pathfinder Chronicler', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule(/^skillModifier.Knowledge/,
      'skillNotes.bardicKnowledge', '+', null
    );
    rules.defineRule('skillNotes.bardicKnowledge',
      'levels.Pathfinder Chronicler', '+=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('skillNotes.masterScribe',
      'levels.Pathfinder Chronicler', '+=', null
    );

  } else if(name == 'Shadowdancer') {

    rules.defineRule('featureNotes.darkvision',
      'shadowdancerFeatures.Darkvision', '+=', '60'
    );
    rules.defineRule('magicNotes.shadowCall',
      'levels.Shadowdancer', '=', 'Math.floor(source / 2) - 1'
    );
    rules.defineRule('magicNotes.shadowIllusion',
      'levels.Shadowdancer', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.shadowJump',
      'levels.Shadowdancer', '=', '40 * Math.pow(2, Math.floor(source/2)-2)'
    );
    rules.defineRule('magicNotes.shadowPower',
      'levels.Shadowdancer', '=', 'source < 8 ? null : source < 10 ? 1 : 2'
    );
    rules.defineRule('magicNotes.summonShadow',
      'hitPoints', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('selectableFeatureCount.Shadowdancer',
      'levels.Shadowdancer', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('shadowdancerFeatures.Improved Uncanny Dodge',
      'shadowdancerFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Shadowdancer', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Shadowdancer', '+=', 'source >= 2 ? 1 : null'
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
  // NOTE The PRD calculates HD from master level, in contrast to the SRD's
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

/* Defines in #rules the rules associated with faction #name#. */
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
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.extraChannel', '+', '4')
  } else if(name == 'Extra Ki') {
    rules.defineRule
      ('featureNotes.extraKi', 'feats.Extra Ki', '=', 'source * 2');
    rules.defineRule('featureNotes.kiPool', 'featureNotes.extraKi', '+', null);
  } else if(name == 'Extra Lay On Hands') {
    rules.defineRule('magicNotes.extraLayOnHands',
      'feats.Extra Lay On Hands', '=', 'source * 2'
    );
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.extraLayOnHands', '+', null)
  } else if(name == 'Extra Mercy') {
    rules.defineRule('magicNotes.extraMercy', 'feats.Extra Mercy', '=', null);
    rules.defineRule('magicNotes.mercy', 'magicNotes.extraMercy', '+', null);
    rules.defineRule
      ('selectableFeatureCount.Paladin', 'magicNotes.extraMercy', '+', null);
  } else if(name == 'Extra Performance') {
    rules.defineRule('featureNotes.extraPerformance',
      'feats.Extra Performance', '=', 'source * 6'
    );
    rules.defineRule('featureNotes.bardicPerformance',
      'featureNotes.extraPerformance', '+', null
    );
  } else if(name == 'Extra Rage') {
    rules.defineRule
      ('combatNotes.extraRage', 'feats.Extra Rage', '=', 'source * 6');
    rules.defineRule('combatNotes.rage', 'combatNotes.extraRage', '+', null);
  } else if(name == 'Fleet') {
    rules.defineRule('abilityNotes.fleet',
      'armorWeight', '?', 'source < 2',
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
  } else if(name == 'Simple Weapon Proficiency') {
    rules.defineRule('features.Weapon Proficiency (Simple)',
      'features.' + name, '=', '1'
    );
  } else if((matchInfo = name.match(/^(Exotic|Martial)\sWeapon\sProficiency.\((.*)\)$/)) != null) {
    rules.defineRule('features.Weapon Proficiency (' + matchInfo[2] + ')',
      'features.' + name, '=', '1'
    );
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

  var allFeats = rules.getChoices('feats');
  if(allFeats == null) {
    console.log('Feats not yet defined for path ' + name);
    return;
  }

  SRD35.pathRules(
    rules, name, group, levelAttr, features, selectables, spellAbility,
    spellSlots
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
      'levels.Cleric', '=', 'source >= 8 ? 10 + Math.floor(source / 2) : null',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.divinePresence.1', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.touchOfGlory', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.touchOfGlory.1',
      'features.Touch Of Glory', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
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
      'features.Touch Of Good', '?', null,
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
    rules.defineRule('magicNotes.auraOfMadness.1',
      'features.Aura Of Madness', '?', null,
      'levels.Cleric', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
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
 * associated features and #languages# any automatic languages. If the race
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
Pathfinder.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spellSlots
) {
  SRD35.raceRules
    (rules, name, requires, features, selectables, languages, spellAbility,
     spellSlots);
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
 * derived directly from the parameters passed to schoolRules.
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
  if(name.startsWith('Craft'))
    rules.addChoice('craftSkills', name, '');
  else if(name.startsWith('Profession'))
    rules.addChoice('professionSkills', name, '');
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
  rules, name, school, casterGroup, level, description, domainSpell
) {
  SRD35.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell);
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
 * directly derived from the parameters passed to traitRules.
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
    var level =
      QuilvynUtils.sumMatching(attributes, /levels\./) +
      QuilvynUtils.sumMatching(attributes, /npc\./) +
      QuilvynUtils.sumMatching(attributes, /prestige\./);
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

/* Returns an array of plugins upon which this one depends. */
Pathfinder.getPlugins = function() {
  return [SRD35];
};

/* Returns HTML body content for user notes associated with this rule set. */
Pathfinder.ruleNotes = function() {
  return '' +
    '<h2>Pathfinder Quilvyn Plugin Notes</h2>\n' +
    'Pathfinder Quilvyn Plugin Version ' + Pathfinder.VERSION + '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
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
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn incorrectly validates the Mystic Theurge requirement of\n' +
    '    being able to cast 2nd-level arcane and divine spells.  It checks\n' +
    '    that the character is caster level 3 in each category, whereas\n' +
    '    some magic-using classes (e.g., Sorcerer) don\'t allow 2nd-level\n' +
    '    spells until a higher caster level.\n' +
    '  </li><li>\n' +
    '    Quilvyn lists the fly speed for a 9th-level Dragon Disciple as\n' +
    "    30' instead of the correct 60'.\n" +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

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

"use strict";

var PATHFINDER_VERSION = '2.0-alpha';

/*
 * This module loads the rules from the Pathfinder Reference Document.  The
 * Pathfinder function contains methods that load rules for particular parts of
 * the PRD; raceRules for character races, magicRules for spells, etc.  These
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
  rules.choiceEditorElements = Pathfinder.choiceEditorElements;
  rules.choiceRules = Pathfinder.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = SRD35.randomizeOneAttribute;
  Pathfinder.createViewers(rules, SRD35.VIEWERS);

  // For spells, schools have to be defined before bloodlines, classes, domains
  Pathfinder.magicRules(rules, Pathfinder.SCHOOLS, Pathfinder.SPELLS);
  Pathfinder.abilityRules(rules);
  Pathfinder.identityRules(
    rules, Pathfinder.ALIGNMENTS, Pathfinder.BLOODLINES, Pathfinder.CLASSES,
    Pathfinder.DEITIES, Pathfinder.DOMAINS, Pathfinder.FACTIONS,
    Pathfinder.GENDERS, Pathfinder.RACES, Pathfinder.TRAITS
  );
  Pathfinder.talentRules
    (rules, Pathfinder.FEATS, Pathfinder.FEATURES, Pathfinder.LANGUAGES,
     Pathfinder.SKILLS);
  Pathfinder.combatRules
    (rules, Pathfinder.ARMORS, Pathfinder.SHIELDS, Pathfinder.WEAPONS);
  Pathfinder.aideRules
    (rules, Pathfinder.ANIMAL_COMPANIONS, Pathfinder.FAMILIARS);
  Pathfinder.goodiesRules(rules);
  rules.defineChoice('choices',
    'armors', 'bloodlines', 'classes', 'deities', 'domains', 'factions',
    'familiars', 'feats', 'features', 'genders', 'languages', 'races',
    'schools', 'shields', 'skills', 'spells', 'traits', 'weapons'
  );
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', Pathfinder.RANDOMIZABLE_ATTRIBUTES);
  Quilvyn.addRuleSet(rules);
  rules.ruleNotes = Pathfinder.ruleNotes;
  Pathfinder.rules = rules;

  // For now, at least, allow direct entry of favored class hit/skill points
  rules.defineEditorElement
    ('favoredClassHitPoints', 'Favored Class Hit Points', 'text', [4], 'armor');
  rules.defineEditorElement
    ('favoredClassSkillPoints', 'Favored Class Skill Points', 'text', [4],
     'armor');
  rules.defineRule
    ('combatNotes.favoredClassHitPoints', 'favoredClassHitPoints', '=', null);
  rules.defineRule
    ('skillNotes.favoredClassSkillPoints', 'favoredClassSkillPoints', '=',null);
  rules.defineRule
    ('hitPoints', 'combatNotes.favoredClassHitPoints', '+=', null);
  rules.defineRule
    ('skillPoints', 'skillNotes.favoredClassSkillPoints', '+=', null);

  rules.defineChoice('extras', 'feats', 'featCount', 'selectableFeatureCount');
  rules.defineChoice('tracks', Pathfinder.TRACKS);
  rules.defineEditorElement
    ('faction', 'Faction', 'select-one', 'factions', 'experience');
  rules.defineEditorElement
    ('experienceTrack', 'Track', 'select-one', 'tracks', 'levels');
  rules.defineSheetElement('Faction', 'Alignment');
  rules.defineSheetElement('Experience Track', 'ExperienceInfo/', ' (%V)');

}

Pathfinder.RANDOMIZABLE_ATTRIBUTES =
  SRD35.RANDOMIZABLE_ATTRIBUTES.concat(['faction', 'traits']);

Pathfinder.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
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
    ' Level=4 Size=M Attac=4 AC=13 Dam=2@1d4+4,1d6+4 Str=19 Dex=13 Con=15',
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
    ' Level=4 Size=M, Attack=1 AC=15 Dam=1d4+1 Str=12 Dex=15 Con=13',
  'Advanced Wolf': Pathfinder.ANIMAL_COMPANIONS['Wolf'] +
    ' Level=7 Size=L Attack=4 AC=13 Dam=1d8+5 Str=21 Dex=13 Con=19'
});
Pathfinder.ARMORS = {
  'None':SRD35.ARMORS['None'] + ' AC=0',
  'Padded':SRD35.ARMORS['Padded'] + ' AC=1',
  'Leather':SRD35.ARMORS['Leather'] + ' AC=2',
  'Studded Leather':SRD35.ARMORS['Studded Leather'] + ' AC=3',
  'Chain Shirt':SRD35.ARMORS['Chain Shirt'] + ' AC=4',
  'Hide':SRD35.ARMORS['Hide'] + ' AC=4',
  'Scale Mail':SRD35.ARMORS['Scale Mail'] + ' AC=5',
  'Chainmail':SRD35.ARMORS['Chainmail'] + ' AC=6',
  'Breastplate':SRD35.ARMORS['Breastplate'] + ' AC=5',
  'Splint Mail':SRD35.ARMORS['Splint Mail'] + ' AC=7',
  'Banded Mail':SRD35.ARMORS['Banded Mail'] + ' AC=7',
  'Half Plate':SRD35.ARMORS['Half Plate'] + ' AC=8',
  'Full Plate':SRD35.ARMORS['Full Plate'] + ' AC=9'
};
Pathfinder.BLOODLINES = {
  'Aberrant':
    'Features=' +
      '"1:Acidic Ray","3:Long Limbs","9:Unusual Anatomy",' +
      '"15:Alien Resistance","20:Aberrant Form" ' +
    'Feats=' +
      '"Combat Casting","Improved Disarm","Improved Grapple",' +
      '"Improved Initiative","Improved Unarmed Strike","Iron Will",' +
      '"Silent Spell","Skill Focus (Knowledge (Dungeoneering))" ' +
    'Skills="Knowledge (Dungeoneering)" ' +
    'Spells=' +
      '"3:Enlarge Person","5:See Invisibility",7:Tongues,"9:Black Tentacles",' +
      '11:Feeblemind,13:Veil,"15:Plane Shift","17:Mind Blank",19:Shapechange',
  'Abyssal':
    'Features=' +
      '1:Claws,"3:Demon Resistances","5:Magic Claws",' +
      '"9:Strength Of The Abyss","11:Improved Claws","15:Added Summonings",' +
      '"20:Demonic Might" ' +
    'Feats=' +
      '"Augment Summoning",Cleave,"Empower Spell","Great Fortitude",' +
      '"Improved Bull Rush","Improved Sunder","Power Attack",' +
      '"Skill Focus (Knowledge (Planes)) ' +
    'Skills="Knowledge (Planes)" ' +
    'Spells=' +
      '"3:Cause Fear","5:Bull\'s Strength",7:Rage,9:Stoneskin,11:Dismissal,' +
      '13:Transformation,"15:Greater Teleport","17:Unholy Aura",' +
      '"19:Summon Monster IX"',
  'Arcane':
    'Features=' +
      '"1:Arcane Bond","3:Metamagic Adept","9:New Arcana","15:School Power",' +
      '"20:Arcane Apotheosis" ' +
    'Feats=' +
      '"Combat Casting","Improved Counterspell","Improved Initiative",' +
      '"Iron Will","Scribe Scroll","Skill Focus (Knowledge (Arcana))",' +
      '"Spell Focus","Still Spell" ' +
    'Skills="choice of Knowledge" ' +
    'Spells=' +
      '3:Identify,5:Invisibility,"7:Dispel Magic","9:Dimension Door",' +
      '"11:Overland Flight","13:True Seeing","15:Greater Teleport",' +
      '"17:Power Word Stun",19:Wish',
  'Celestial':
    'Features=' +
      '"1:Heavenly Fire","3:Celestial Resistances","9:Wings Of Heaven",'+
      '15:Conviction,20:Ascension ' +
    'Feats=' +
      'Dodge,"Extend Spell","Iron Will",Mobility,"Mounted Combat",' +
      '"Ride-By Attack","Skill Focus (Knowledge (Religion))",' +
      '"Weapon Finesse" ' +
    'Skills=Heal ' +
    'Spells=' +
      '3:Bless,"5:Resist Energy","7:Magic Circle Against Evil",' +
      '"9:Remove Curse","11:Flame Strike","13:Greater Dispel Magic",' +
      '15:Banishment,17:Sunburst,19:Gate',
  'Destined':
    'Features=' +
      '"1:Touch Of Destiny",3:Fated,"9:It Was Meant To Be","15:Within Reach",' +
      '"20:Destiny Realized" ' +
    'Feats=' +
      '"Arcane Strike",Diehard,Endurance,Leadership,"Lightning Reflexes",' +
      '"Maximize Spell","Skill Focus (Knowledge (History))","Weapon Focus" ' +
    'Skills="Knowledge (History)" ' +
    'Spells=' +
      '3:Alarm,5:Blur,"7:Protection From Energy","9:Freedom Of Movement",' +
      '"11:Break Enchantment",13:Mislead,"15:Spell Turning",' +
      '"17:Moment Of Prescience",19:Foresight',
  'Draconic':
    'Features=' +
      '1:Claws,"3:Dragon Resistances","5:Magic Claws","9:Breath Weapon",' +
      '"11:Improved Claws",15:Wings,"20:Power Of Wyrms",20:Blindsense ' +
    'Feats=' +
      '"Blind-Fight","Great Fortitude","Improved Initiative","Power Attack",' +
      '"Quicken Spell","Skill Focus (Fly)",' +
      '"Skill Focus (Knowledge (Arcana))",Toughness ' +
    'Skills=Perception ' +
    'Spells=' +
      '"3:Mage Armor","5:Resist Energy",7:Fly,9:Fear,"11:Spell Resistance",' +
      '"13:Form Of The Dragon I","15:Form Of The Dragon II",' +
      '"17:Form Of The Dragon III",19:Wish',
  'Elemental':
    'Features=' +
      '"1:Elemental Ray","3:Elemental Resistance","9:Elemental Blast",' +
      '"15:Elemental Movement","20:Elemental Body" ' +
    'Feats=' +
      'Dodge,"Empower Spell","Great Fortitude","Improved Initiative",' +
      'Lightning Reflexes","Power Attack","Skill Focus (Knowledge (Planes))",' +
      '"Weapon Finesse ' +
    'Skills="Knowledge (Planes)" ' +
    'Spells=' +
      '"3:Burning Hands","5:Scorching Ray","7:Protection From Energy",' +
      '"9:Elemental Body I","11:Elemental Body II","13:Elemental Body III",' +
      '"15:Elemental Body IV","17:Summon Monster VIII","19:Elemental Swarm"',
  'Fey':
    'Features=' +
      '"1:Laughing Touch","3:Woodland Stride","9:Fleeting Glance",' +
      '"15:Fey Magic","20:Soul Of The Fey" ' +
    'Feats=' +
      'Dodge,"Improved Initiative","Lightning Reflexes",Mobility,' +
      '"Point-Blank Shot","Precise Shot","Quicken Spell",' +
      '"Skill Focus (Knowledge (Nature)) ' +
    'Skills="Knowledge (Nature)" ' +
    'Spells=' +
      '3:Entangle,"5:Hideous Laughter","7:Deep Slumber",9:Poison,' +
      '"11:Tree Stride",13:Mislead,"15:Phase Door","17:Irresistible Dance",' +
      '19:Shapechange',
  'Infernal':
    'Features=' +
      '"1:Corrupting Touch","3:Infernal Resistances",9:Hellfire,' +
      '"15:On Dark Wings","20:Power Of The Pit" ' +
    'Feats=' +
      'Blind-Fight,"Combat Expertise",Deceitful,"Extend Spell",' +
      '"Improved Disarm","Iron Will","Skill Focus (Knowledge (Planes))",' +
      '"Spell Penetration" ' +
    'Skills=Diplomacy ' +
    'Spells=' +
      '"3:Protection From Good","5:Scorching Ray",7:Suggestion,' +
      '"9:Charm Monster","11:Dominate Person","13:Planar Binding",' +
      '"15:Greater Teleport","17:Power Word Stun","19:Meteor Swarm"',
  'Undead':
    'Features=' +
      '"1:Grave Touch","3:Death\'s Gift","9:Grasp Of The Dead",' +
      '"15:Incorporeal Form","20:One Of Us" ' +
    'Feats=' +
      '"Combat Casting","Diehard",Endurance,"Iron Will",' +
      '"Skill Focus (Knowledge (Religion))","Spell Focus",Toughness ' +
    'Skills="Knowledge (Religion)" ' +
    'Spells=' +
      '"3:Chill Touch","5:False Life","7:Vampiric Touch","9:Animate Dead",' +
      '"11:Waves Of Fatigue","13:Undeath To Death","15:Finger Of Death",' +
      '"17:Horrid Wilting","19:Energy Drain"'
};
Pathfinder.DEITIES = {
  'None':'',
  'Abadar (LN)':
    'Weapon="Light Crossbow" Domain=Earth,Law,Nobility,Protection,Travel',
  'Asmodeus (LE)':'Weapon=Mace Domain=Evil,Fire,Law,Magic,Trickery',
  'Calistria (CN)':'Weapon=Whip Domain=Chaos,Charm,Knowledge,Luck,Trickery',
  'Cayden Cailean (CG)':'Weapon=Rapier Domain=Chaos,Charm,Good,Strength,Travel',
  'Desna (CG)':'Weapon=Starknife Domain=Chaos,Good,Liberation,Luck,Travel',
  'Erastil (LG)':'Weapon=Longbow Domain=Animal,Community,Good,Law,Plant',
  'Gozreh (N)':'Weapon=Trident Domain=Air,Animal,Plant,Water,Weather',
  'Gorum (CN)':'Weapon=Greatsword Domain=Chaos,Destruction,Glory,Strength,War',
  'Iomedae (LG)':'Weapon=Longsword Domain=Glory,Good,Law,Sun,War',
  'Irori (LN)':'Weapon=Unarmed Domain=Healing,Knowledge,Law,Rune,Strength',
  'Lamashtu (CE)':'Weapon=Falchion Domain=Chaos,Evil,Madness,Strength,Trickery',
  'Nethys (N)':
    'Weapon=Quarterstaff Domain=Destruction,Knowledge,Magic,Protection,Rune',
  'Norgorber (NE)':
    'Weapon="Short Sword" Domain=Charm,Death,Evil,Knowledge,Trickery',
  'Pharasma (N)':'Weapon=Dagger Domain=Death,Healing,Knowledge,Repose,Water',
  'Rovagug (CE)':'Weapon=Greataxe Domain=Chaos,Destruction,Evil,War,Weather',
  'Sarenrae (NG)':'Weapon=Scimitar Domain=Fire,Glory,Good,Healing,Sun',
  'Shelyn (NG)':'Weapon=Glaive Domain=Air,Charm,Good,Luck,Protection',
  'Torag (LG)':'Weapon=Warhammer Domain=Artifice,Earth,Good,Law,Protection',
  'Urgathoa (NE)':'Weapon=Scythe Domain=Death,Evil,Magic,Strength,War',
  'Zon-Kuthon (LE)':
    'Weapon="Spiked Chain" Domain=Darkness,Death,Destruction,Evil,Law'
};
Pathfinder.DOMAINS = {
  'Air':
    'Features="1:Lightning Arc","6:Electricity Resistance" ' +
    'Spells="Obscuring Mist","Wind Wall","Gaseous Form","Air Walk",' +
    '"Control Winds","Chain Lightning","Elemental Body IV",Whirlwind,' +
    '"Elemental Swarm"',
  'Animal':
    'Features="1:Speak With Animals","4:Animal Companion" ' +
    'Spells="Calm Animals","Hold Animal","Dominate Animal",' +
    '"Summon Nature\'s Ally IV","Beast Shape III","Antilife Shell",' +
    '"Animal Shapes","Summon Nature\'s Ally VIII",Shapechange',
  'Artifice':
    'Features="1:Artificer\'s Touch","8:Dancing Weapons" ' +
    'Spells="Animate Rope","Wood Shape","Stone Shape","Minor Creation",' +
    'Fabricate,"Major Creation","Wall Of Iron",Statue,"Prismatic Sphere"',
  'Chaos':
    'Features="1:Touch Of Chaos","8:Chaos Blade" ' +
    'Spells="Protection From Law","Align Weapon","Magic Circle Against Law",' +
    '"Chaos Hammer","Dispel Law","Animate Objects","Word Of Chaos",' +
    '"Cloak Of Chaos","Summon Monster IX"',
  'Charm':
    'Features="1:Addling Touch","8:Charming Smile" ' +
    'Spells="Charm Person","Calm Emotions",Suggestion,Heroism,' +
    '"Charm Monster",Geas/Quest,Insanity,Demand,"Dominate Monster"',
  'Community':
    'Features="1:Calming Touch","8:Unity" ' +
    'Spells=Bless,"Shield Other",Prayer,"Imbue With Spell Ability",' +
    '"Telepathic Bond","Heroes\' Feast",Refuge,"Mass Cure Critical Wounds",' +
    'Miracle',
  'Darkness':
    'Features="1:Blind-Fight","1:Touch Of Darkness","8:Eyes Of Darkness" ' +
    'Spells="Obscuring Mist",Blindness/Deafness,"Deeper Darkness",' +
    '"Shadow Conjuration","Summon Monster V","Shadow Walk",' +
    '"Power Word Blind","Greater Shadow Evocation",Shades',
  'Death':
    'Features="1:Bleeding Touch","8:Death\'s Embrace" ' +
    'Spells="Cause Fear","Death Knell","Animate Dead","Death Ward",' +
    '"Slay Living","Create Undead",Destruction,"Create Greater Undead",' +
    '"Wail Of The Banshee"',
  'Destruction':
    'Features="1:Destructive Smite","8:Destructive Aura" ' +
    'Spells="True Strike",Shatter,Rage,"Inflict Critical Wounds",Shout,Harm,' +
    'Disintegrate,Earthquake,Implosion',
  'Earth':
    'Features="1:Acid Dart","6:Acid Resistance" ' +
    'Spells="Magic Stone","Soften Earth And Stone","Stone Shape",' +
    '"Spike Stones","Wall Of Stone",Stoneskin,"Elemental Body IV",Earthquake,' +
    '"Elemental Swarm"',
  'Evil':
    'Features="1:Touch Of Evil","8:Scythe Of Evil" ' +
    'Spells="Protection From Good","Align Weapon",' +
    '"Magic Circle Against Good","Unholy Blight","Dispel Good",' +
    '"Create Undead",Blasphemy,"Unholy Aura","Summon Monster IX"',
  'Fire':
    'Features="1:Fire Bolt","6:Fire Resistance" ' +
    'Spells="Burning Hands","Produce Flame",Fireball,"Wall Of Fire",' +
    '"Fire Shield","Fire Seeds","Elemental Body IV","Incendiary Cloud",' +
    '"Elemental Swarm"',
  'Glory':
    'Features="1:Undead Bane","1:Touch Of Glory","8:Divine Presence" ' +
    'Spells="Shield Of Faith","Bless Weapon","Searing Light","Holy Smite",' +
    '"Righteous Might","Undeath To Death","Holy Sword","Holy Aura",Gate',
  'Good':
    'Features="1:Touch Of Good","8:Holy Lance" ' +
    'Spells="Protection From Evil","Align Weapon",' +
    '"Magic Circle Against Evil","Holy Smite","Dispel Evil","Blade Barrier",' +
    '"Holy Word","Holy Aura","Summon Monster IX"',
  'Healing':
    'Features="1:Rebuke Death","6:Healer\'s Blessing" ' +
    'Spells="Cure Light Wounds","Cure Moderate Wounds","Cure Serious Wounds",' +
    '"Cure Critical Wounds","Breath Of Life",Heal,Regenerate,' +
    '"Mass Cure Critical Wounds","Mass Heal"',
  'Knowledge':
    'Features="1:Lore Keeper","6:Remote Viewing" ' +
    'Spells="Comprehend Languages","Detect Thoughts","Speak With Dead",' +
    'Divination,"True Seeing","Find The Path","Legend Lore",' +
    '"Discern Location",Foresight',
  'Law':
    'Features="1:Touch Of Law","8:Staff Of Order" ' +
    'Spells="Protection From Chaos","Align Weapon",' +
    '"Magic Circle Against Chaos","Order\'s Wrath","Dispel Chaos",' +
    '"Hold Monster",Dictum,"Shield Of Law","Summon Monster IX"',
  'Liberation':
    'Features="1:Liberation","8:Freedom\'s Call" ' +
    'Spells="Remove Fear","Remove Paralysis","Remove Curse",' +
    '"Freedom Of Movement","Break Enchantment","Greater Dispel Magic",Refuge,' +
    '"Mind Blank",Freedom',
  'Luck':
    'Features="1:Bit Of Luck","6:Good Fortune" ' +
    'Spells="True Strike",Aid,"Protection From Energy","Freedom Of Movement",' +
    '"Break Enchantment",Mislead,"Spell Turning","Moment Of Prescience",' +
    'Miracle',
  'Madness':
    'Features="1:Vision Of Madness","8:Aura Of Madness" ' +
    'Spells="Lesser Confusion","Touch Of Idiocy",Rage,Confusion,Nightmare,' +
    '"Phantasmal Killer",Insanity,"Scintillating Pattern",Weird',
  'Magic':
    'Features="1:Hand Of The Acolyte","8:Dispelling Touch" ' +
    'Spells=Identify,"Magic Mouth","Dispel Magic","Imbue With Spell Ability",' +
    '"Spell Resistance","Antimagic Field","Spell Turning",' +
    '"Protection From Spells","Mage\'s Disjunction"',
  'Nobility':
    'Features="1:Inspiring Word","8:Noble Leadership" ' +
    'Spells="Divine Favor",Enthrall,"Magic Vestment","Discern Lies",' +
    '"Greater Command",Geas/Quest,Repulsion,Demand,"Storm Of Vengeance"',
  'Plant':
    'Features="1:Wooden Fist","6:Bramble Armor" ' +
    'Spells=Entangle,Barkskin,"Plant Growth","Command Plants",' +
    '"Wall Of Thorns","Repel Wood","Animate Plants","Control Plants",Shambler',
  'Protection':
    'Features="1:Resistance Bonus","1:Resistant Touch","8:Aura Of Protection" '+
    'Spells=Sanctuary,"Shield Other","Protection From Energy",' +
    '"Spell Immunity","Spell Resistance","Antimagic Field",Repulsion,' +
    '"Mind Blank","Prismatic Sphere"',
  'Repose':
    'Features="1:Gentle Rest","8:Ward Against Death" ' +
    'Spells=Deathwatch,"Gentle Repose","Speak With Dead","Death Ward",' +
    '"Slay Living","Undeath To Death",Destruction,"Waves Of Exhaustion",' +
    '"Wail Of The Banshee"',
  'Rune':
    'Features="1:Scribe Scroll","1:Blast Rune","8:Spell Rune" ' +
    'Spells=Erase,"Secret Page","Glyph Of Warding","Explosive Runes",' +
    '"Lesser Planar Binding","Greater Glyph Of Warding","Instant Summons",' +
    '"Symbol Of Death","Teleportation Circle"',
  'Strength':
    'Features="1:Strength Rush","8:Might Of The Gods" ' +
    'Spells="Enlarge Person","Bull\'s Strength","Magic Vestment",' +
    '"Spell Immunity","Righteous Might",Stoneskin,"Grasping Hand",' +
    '"Clenched Fist","Crushing Hand"',
  'Sun':
    'Features="1:Sun\'s Blessing","8:Nimbus Of Light" ' +
    'Spells="Endure Elements","Heat Metal","Searing Light","Fire Shield",' +
    '"Flame Strike","Fire Seeds",Sunbeam,Sunburst,"Prismatic Sphere"',
  'Travel':
    'Features="1:Travel Speed","1:Agile Feet","8:Dimensional Hop" ' +
    'Spells=Longstrider,"Locate Object",Fly,"Dimension Door",Teleport,' +
    '"Find The Path","Greater Teleport","Phase Door","Astral Projection"',
  'Trickery':
    'Features="1:Copycat","8:Master\'s Illusion" ' +
    'Spells="Disguise Self",Invisibility,Nondetection,Confusion,' +
    '"False Vision",Mislead,Screen,"Mass Invisibility","Time Stop"',
  'War':
    'Features="1:Battle Rage","8:Weapon Master" ' +
    'Spells="Magic Weapon","Spiritual Weapon","Magic Vestment",' +
    '"Divine Power","Flame Strike","Blade Barrier","Power Word Blind",' +
    '"Power Word Stun","Power Word Kill"',
  'Water':
    'Features="1:Icicle","6:Cold Resistance" ' +
    'Spells="Obscuring Mist","Fog Cloud","Water Breathing","Control Water",' +
    '"Ice Storm","Cone Of Cold","Elemental Body IV","Horrid Wilting",' +
    '"Elemental Swarm"',
  'Weather':
    'Features="1:Storm Burst","8:Lightning Lord" ' +
    'Spells="Obscuring Mist","Fog Cloud","Call Lightning","Sleet Storm",' +
    '"Ice Storm","Control Winds","Control Weather",Whirlwind,' +
    '"Storm Of Vengeance"'
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
Pathfinder.FEATS = Object.assign({}, SRD35.FEATS, {
  // Override certain SRD35 attributes of some common feats
  'Armor Proficiency (Heavy)':
    SRD35.FEATS['Armor Proficiency (Heavy)'] + ' Type=Fighter',
  'Armor Proficiency (Light)':
    SRD35.FEATS['Armor Proficiency (Light)'] + ' Type=Fighter',
  'Armor Proficiency (Medium)':
    SRD35.FEATS['Armor Proficiency (Medium)'] + ' Type=Fighter',
  'Cleave':
    SRD35.FEATS['Cleave'] + ' Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Craft Staff':SRD35.FEATS['Craft Staff'] + ' Require="casterLevel >= 11',
  'Forge Ring':SRD35.FEATS['Forge Ring'] + ' Require=casterLevel >= 7',
  'Greater Two-Weapon Fighting':
    SRD35.FEATS['Greater Two-Weapon Fighting'] + ' Require="baseAttack >= 11","dexterity >= 19","features.Improved Two-Weapon Fighting","features.Two-Weapon Fighting"',
  'Improved Bull Rush':
    SRD35.FEATS['Improved Bull Rush'] + ' Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Overrun':
    SRD35.FEATS['Improved Overrun'] + ' Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Precise Shot':
    SRD35.FEATS['Improved Precise Shot'] + ' Require="baseAttack >= 11","dexterity >= 19","features.Point-Blank Shot","features.Precise Shot"',
  'Improved Sunder':
    SRD35.FEATS['Improved Sunder'] + ' Require="baseAttack >= 1","strength >= 13","features.Power Attack"',
  'Improved Two-Weapon Fighting':
    SRD35.FEATS['Improved Two-Weapon Fighting'] + ' Require="baseAttack >= 6","dexterity >= 17","features.Two-Weapon Fighting"',
  'Leadership':SRD35.FEATS['Leadership'] + ' Require="level >= 7"',
  'Power Attack':
    SRD35.FEATS['Power Attack'] + ' Require="baseAttack >= 1","strength >= 13"',
  'Shield Proficiency (Heavy)':
    SRD35.FEATS['Shield Proficiency (Heavy)'] + ' Type=Fighter',
  'Shield Proficiency (Tower)':
    SRD35.FEATS['Shield Proficiency (Tower)'] + ' Type=Fighter',
  'Weapon Finesse':SRD35.FEATS['Weapon Finesse'] + ' Require=',
  // New feats
  'Acrobatic Steps':'Type=General',
  'Agile Maneuvers':'Type=Fighter Implies:dexterityModifier > strengthModifier',
  'Alignment Channel (Chaos)':'Type=General Require="features.Channel Energy"',
  'Alignment Channel (Evil)':'Type=General Require="features.Channel Energy"',
  'Alignment Channel (Good)':'Type=General Require="features.Channel Energy"',
  'Alignment Channel (Law)':'Type=General Require="features.Channel Energy"',
  'Arcane Armor Mastery':
    'Type=Fighter Require="casterLevel >= 7","features.Arcane Armor Training","features.Armor Proficiency (Medium)"',
  'Arcane Armor Training':
    'Type=Fighter Require="casterLevel >= 3",features.Armor Proficiency (Light)"',
  'Arcane Strike':'Type=Fighter Require="casterLevelArcane >= 1"',
  'Bleeding Critical':
    'Type=Fighter,Critical Require="baseAttack>=11","features.Critical Focus"',
  'Blinding Critical':
    'Type=Fighter,Critical Require="baseAttack>=15","features.Critical Focus"',
  'Catch Off-Guard':'Type=Fighter',
  'Channel Smite':'Type=Fighter Require="features.Channel Energy"',
  'Command Undead':'Type=General Require="features.Channel Energy"',
  'Critical Focus':'Type=Fighter Require="baseAttack >= 9"',
  'Critical Mastery':
    'Type=Fighter Require="level.Fighter >= 14","features.Critical Focus"',
    // TODO Also requires two critical feats
  'Dazzling Display':'Type=Fighter Require="features.Weapon Focus"',
  'Deadly Aim':'Type=Fighter Require="dexterity >= 13","baseAttack >= 1"',
  'Deadly Stroke':'Type=Fighter Require="baseAttack >= 11","features.Dazzling Display","features.Greater Weapon Focus","features.Shatter Defenses","features.WeaponFocus"',
  'Deafening Critical':
    'Type=Fighter,Critical Require="baseAttack>=13","features.Critical Focus"',
  'Defensive Combat Training':'Type=Fighter',
  'Disruptive':'Type=Fighter Require="level.Fighter >= 6"',
  'Double Slice':
    'Type=Fighter Require="dexterity >= 15","features.Two-Weapon Fighting"',
  'Elemental Channel (Air)':'Type=General Require="features.Channel Energy"',
  'Elemental Channel (Earth)':'Type=General Require="features.Channel Energy"',
  'Elemental Channel (Fire)':'Type=General Require="features.Channel Energy"',
  'Elemental Channel (Water)':'Type=General Require="features.Channel Energy"',
  'Exhausting Critical':
    'Type=Fighter,Critical Require="baseAttack >= 15","features.Critical Focus","features.Tiring Critical"',
  'Extra Channel':'Type=General Require="features.Channel Energy"',
  'Extra Ki':'Type=General Require="features.Ki Pool"',
  'Extra Lay On Hands':'Type=General Require="features.Lay On Hands"',
  'Extra Mercy':'Type=General Require="features.Lay On Hands",features.Mercy',
  'Extra Performance':'Type=General Require="features.Bardic Performance"',
  'Extra Rage':'Type=General Require=features.Rage',
  'Fleet':'Type=General',
  // TODO implies (requires?) light/no armor
  "Gorgon's Fist":
    'Type=Fighter Require="baseAttack >= 6","features.Improved Unarmed Strike","features.Scorpion Style"',
  'Greater Bull Rush':
    'Type=Fighter Require="baseAttack >= 6","strength >= 13","features.Improved Bull Rush","features.Power Attack"',
  'Greater Disarm':
    'Type=Fighter Require="baseAttack >= 6","intelligence >= 13","features.Combat Expertise","features.Improved Disarm"',
  'Greater Feint':
    'Type=Fighter Require="baseAttack >= 6","intelligence >= 13","features.Combat Expertise","features.Improved Feint"',
  'Greater Grapple':
    'Type=Fighter Require="baseAttack >= 6","dexterity >= 13","features.Improved Grapple","features.Improved Unarmed Strike"',
  'Greater Overrun':
    'Type=Fighter Require="baseAttack >= 6","strength >= 13","features.Improved Overrun","features.Power Attack"',
  'Greater Penetrating Strike':'Type=Fighter Require="level.Fighter >= 16","features.Penetrating Strike","features.Weapon Focus"',
  'Greater Shield Focus':
    'Type=Fighter Require="baseAttack >= 1","levels.Fighter >= 8","features.Shield Focus","features.Shield Proficiency (Heavy)"',
  'Greater Sunder':
    'Type=Fighter Require="baseAttack >= 6","strength >= 13","features.Improved Sunder","features.Power Attack"',
  'Greater Trip':
    'Type=Fighter Require="baseAttack >= 6","intelligence >= 13","features.Combat Expertise","features.Improved Trip"',
  'Greater Vital Strike':
    'Type=Fighter Require="baseAttack >= 16","features.Improved Vital Strike","features.Vital Strike"',
  'Improved Channel':'Type=General Require="features.Channel Energy"',
  'Improved Great Fortitude':'Type=General Require="features.Great Fortitude"',
  'Improved Iron Will':'Type=General Require="features.Iron Will"',
  'Improved Lightning Reflexes':'Type=General Require="features.Lightning Reflexes"',
  'Improved Vital Strike':
    'Type=Fighter Require="baseAttack >= 11","features.Vital Strike"',
  'Improvised Weapon Mastery':
    'Type=Fighter Require="baseAttack >= 8","features.Catch Off-Guard","features.Throw Anything"',
    // TODO Catch Off-Guard *or* Throw Anything
  'Intimidating Prowess':'Type=Fighter',
  'Lightning Stance':
    'Type=Fighter Require="baseAttack >= 11","dexterity >= 17",features.Dodge,"features.Wind Stance"',
  'Lunge':'Type=Fighter Require="baseAttack >= 6"',
  'Master Craftsman (Craft (Armor))':
    'Type=General Require="skills.Craft (Armor) >= 5"',
  'Master Craftsman (Profession (Tanner))':
    'Type=General Require="skills.Profession (Tanner) >= 5"',
  "Medusa's Wrath":'Type=Fighter Require="baseAttack >= 11","features.Improved Unarmed Strike","features.Gorgon\'s Fist","features.Scorpion Style"',
  'Nimble Moves':'Type=General Require="dexterity >= 13"',
  'Penetrating Strike':'Type=Fighter Require="baseAttack >= 1","levels.Fighter >= 12","features.Weapon Focus"',
  'Pinpoint Targeting':'Type=Fighter Require="baseAttack >= 16","dexterity >= 19","features.Improved Precise Shot","features.Point-Blank Shot"',
  'Scorpion Style':'Type=Fighter Require="Improved Unarmed Strike"',
  'Selective Channeling':
    'Type=General Require="charisma >= 13","features.Channel Energy"',
  'Shatter Defenses':'Type=Fighter Require="baseAttack >= 6","features.Weapon Focus","features.Dazzing Display"',
  'Shield Focus':
    'Type=Fighter Require="baseAttack >= 1","features.Shield Proficiency (Heavy)"',
  'Shield Master':
    'Type=Fighter Require="baseAttack >= 11","features.Improved Shield Bash","features.Shield Proficiency (Heavy)","features.Shield Slam","features.Two-Weapon Fighting"',
  'Shield Slam':'Type=Fighter Requires="baseAttack >= 6","features.Improved Shield Bash","features.Shield Proficiency (Heavy)","features.Two-Weapon Fighting"',
  'Sickening Critical':'Type=Fighter,Critical',
  'Skill Focus':'Type=General Require="baseAttack >= 11","features.Critical Focus"',
  'Spellbreaker':'Type=Fighter Require="levels.Fighter >= 10","features.Disruptive"',
  'Staggering Critical':
    'Type=Fighter,Critical Require="baseAttack >= 13","features.Critical Focus"',
  'Stand Still':'Type=Fighter Require="features.Combat Reflexes"',
  'Step Up':'Type=Fighter Require="baseAttack >= 1"',
  'Strike Back':'Type=Fighter Require="baseAttack >= 11"',
  'Stunning Critical':
    'Type=Fighter,Critical Require="baseAttack >= 17","features.Critical Focus","features.Staggering Critical"',
  'Throw Anything':'Type=Fighter',
  'Tiring Critical':
    'Type=Fighter,Critcial Require="baseAttack >= 13","features.Critical Focus"',
  'Turn Undead':'Type=General Require="features.Channel Energy"',
  'Two-Weapon Rend':
    'Type=Fighter Require="baseAttack >= 11","dexterity >= 17","features.Double Slice","features.Improved Two-Weapon Fighting","features.Two-Weapon Fighting"',
  'Unseat':
    'Type=Fighter Require="baseAttack >= 1","strength >= 13","skills.Ride","features.Mounted Attack","features.Power Attack","features.Improved Bull Rush"',
  'Vital Strike':'Type=Fighter Require="baseAttack >= 6"',
  'Wind Stance':
    'Type=Fighter Require="baseAttack >= 6","dexterity >= 15","features.Dodge"'
});
Pathfinder.FEATURES = Object.assign({}, SRD35.FEATURES, {
  // Bloodlines
  'Aberrant Form':[
    'combat:Immune critical hit/sneak attack, DR 5/-',
    "feature:Blindsight 60'"
  ],
  'Ascension':[
    'magic:<i>Tongues</i> at will',
    'save:Immune petrification, 10 electricity/fire, +4 poison'
  ],
  'Acidic Ray':"magic:R30' %Vd6 HP %1/day",
  'Added Summonings':
    'magic:<i>Summon Monster</i> brings additional demon/fiendish creature',
  'Alien Resistance':'save:%V spell resistance',
  'Arcane Apotheosis':
    'magic:Expend 3 spell slots to replace 1 magic item charge',
  'Blindsense':
    "feature:Other senses allow detection of unseen objects w/in %V'",
  'Breath Weapon':"combat:%3 %4 %Vd6 HP (%1 DC Reflex half) %2/day",
  'Celestial Resistances':'save:%V acid/cold',
  'Claws':'combat:%V+%1 HP %2 rd/day',
  'Conviction':'feature:Reroll ability/attack/skill/save 1/day',
  'Corrupting Touch':'magic:Touch causes shaken %V rd %1/day',
  "Death's Gift":'save:%V cold/DR %1/- vs. non-lethal',
  'Demon Resistances':'save:%V electricity/%1 poison',
  'Demonic Might':[
    "feature:Telepathy 60'",
    'save:10 acid/cold/fire'
  ],
  'Destiny Realized':[
    'combat:Critical hits confirmed, foe critical requires 20',
    'magic:Automatically overcome resistance 1/day'
  ],
  'Dragon Resistances':[
    'combat:+%V AC', // No bonus to CMD
    'save:%V vs. %1'
  ],
  'Elemental Blast':"combat:R60' 20' radius %Vd6 HP %3 (DC %1 Reflex half) %2/day",
  'Elemental Body':'save:Immune %V',
  'Elemental Movement':'ability:%V',
  'Elemental Ray':"magic:R30' 1d6+%1 HP %2 %V/day",
  'Elemental Resistance':'save:%V vs. %1',
  'Fated':'save:+%V saves when surprised',
  'Fey Magic':'magic:Reroll any resistance check',
  'Fleeting Glance':'magic:<i>Greater Invisibility</i> %V rd/day',
  'Grasp Of The Dead':
    "magic:R60' Skeletal arms claw 20' radius %Vd6 HP (DC %1 Reflex half) %2/day",
  'Grave Touch':'magic:Touch causes shaken/frightened %V rd %1/day',
  'Heavenly Fire':
    "magic:R30' Ranged touch heal good/harm evil 1d4+%V HP %1/day",
  'Hellfire':
    "magic:R60' 10' radius %Vd6 HP (DC %1 Ref half), good target shaken %2 rd %3/dy",
  'Improved Claws':'combat:Claws do additional 1d6 %V damage',
  'Incorporeal Form':'magic:Incorporeal %V rd 1/day',
  'Infernal Resistances':'save:%V fire/%1 poison',
  'It Was Meant To Be':
    'feature:Reroll attack/critical/spell resistance check %V/day',
  'Laughing Touch':'magic:Touch causes 1 rd of laughter %V/day',
  'Long Limbs':"combat:+%V' touch attack range",
  'Magic Claws':'combat:Claws are magical weapon',
  'Metamagic Adept':'magic:Applying metamagic feat w/out increased casting time %V/day',
  'New Arcana':'magic:%V additional spells',
  'On Dark Wings':"ability:Fly 60'/average",
  'One Of Us':[
    'combat:Ignored by unintelligent undead',
    'save:Immune paralysis/sleep/+4 vs. undead\'s spells'
  ],
  'Power Of The Pit':[
    "feature:Darkvision 60'",
    'save:Resistance 10 acid/cold'
  ],
  'Power Of Wyrms':'save:Immune paralysis/sleep',
  'School Power':'magic:+2 DC on spells from chosen school',
  'Soul Of The Fey':[
    'combat:Animals attack only if magically forced',
    'magic:<i>Shadow Walk</i> 1/day',
    'save:Immune poison/DR 10/cold iron'
  ],
  'Strength Of The Abyss':'ability:+%V Strength',
  'Touch Of Destiny':
    'magic:Touched creature +%V attack, skill, ability, save 1 rd %1/day',
  'Unusual Anatomy':'combat:%V% chance to ignore critical hit/sneak attack',
  'Wings':"ability:Fly %V'/average",
  'Wings Of Heaven':"ability:Fly 60'/good %V minutes/day",
  'Within Reach':'save:DC 20 Will save vs. fatal attack 1/day',
  // Domains
  "Artificer's Touch":[
    'combat:Touch attack on objects/constructs 1d6+%1 HP %V/day',
    'magic:<i>Mending</i> at will'
  ],
  "Death's Embrace":'combat:Healed by channeled negative energy',
  "Freedom's Call":
    "magic:Allies w/in 30' unaffected by movement conditions %V rd/day",
  "Healer's Blessing":'magic:%V% bonus on healed damage',
  "Master's Illusion":"magic:DC %V 30' radius <i>Veil</i> %1 rd/day",
  "Sun's Blessing":'magic:+%V undead damage, negate channel resistance',
  'Acid Dart':"magic:R30' touch 1d6+%1 HP %V/day",
  'Acid Resistance':'save:%V',
  'Addling Touch':'magic:Touch attack dazes %V HD foe 1 rd %1/day',
  'Agile Feet':'feature:Unaffected by difficult terrain 1 rd %V/day',
  'Aura Of Madness':"magic:30' <i>Confusion</i> aura %V rd/day",
  'Aura Of Protection':
    "magic:Allies w/in 30' +%V AC, %1 elements resistance %2 rd/day",
  'Battle Rage':'combat:Touch imparts +%V damage bonus 1 rd %1/day',
  'Bit Of Luck':'magic:Touch imparts reroll d20 next rd %V/day',
  'Blast Rune':'magic:Rune in adjacent square causes 1d6+%1 HP %V rd %2/day',
  'Bleeding Touch':
    'combat:Touch attack causes 1d6 HP/rd %V rd or until healed (DC 15) %1/day',
  'Bramble Armor':'combat:Thorny hide causes 1d6+%1 HP to striking foes %V/day',
  'Calming Touch':
    'magic:Touch heals 1d6+%1 HP, removes fatigued/shaken/sickened %V/day',
  'Chaos Blade':'combat:Add <i>anarchic</i> to weapon %1 rd %V/day',
  'Charming Smile':'magic:DC %V <i>Charm Person</i> %1 rd/day',
  'Cold Resistance':'save:%V',
  'Copycat':'magic:<i>Mirror Image</i> %V rd %1/day',
  'Dancing Weapons':'combat:Add <i>dancing</i> to weapon 4 rd %V/day',
  'Destructive Aura':
    "combat:Attacks w/in 30' +%V damage + critical confirmed %1 rd/day",
  'Destructive Smite':'combat:+%V damage %1/day',
  'Dimensional Hop':"magic:Teleport up to %V'/day",
  'Dispelling Touch':'magic:<i>Dispel Magic</i> touch attack %V/day',
  'Divine Presence':
    "magic:DC %V <i>Sanctuary</i> for allies w/in 30' %1 rd/day",
  'Electricity Resistance':'save:%V',
  'Eyes Of Darkness':'feature:Normal vision in any lighting %V rd/day',
  'Fire Bolt':"combat:R30' touch 1d6+%1 HP %V/day",
  'Fire Resistance':'save:%V',
  'Gentle Rest':'magic:Touch staggers %1 rd %V/day',
  'Good Fortune':'magic:Reroll d20 %V/day',
  'Hand Of The Acolyte':"combat:R30' +%V w/melee weapon %1/day",
  'Holy Lance':'combat:Add <i>holy</i> to weapon %1 rd %V/day',
  'Icicle':"combat:R30' touch 1d6+%1 HP %V/day",
  'Inspiring Word':
    "magic:R30' word imparts +2 attack, skill, ability, and save to target %V rd %1/day",
  'Liberation':'magic:Ignore movement impediments %V rd/day',
  'Lightning Arc':"combat:R30' touch 1d6+%1 HP %V/day",
  'Lightning Lord':'magic:<i>Call Lightning</i> %V bolts/day',
  'Lore Keeper':'skill:Touch attack provides info as per %V Knowledge check',
  'Might Of The Gods':'magic:+%V strength checks %1 rd/day',
  'Nimbus Of Light':
    "magic:30' radius <i>Daylight</i> does %V HP to undead %1 rd/day",
  'Noble Leadership':'feature:+%V Leadership',
  'Rebuke Death':'magic:Touch creature below 0 HP to heal 1d4+%1 HP %V/day',
  'Remote Viewing':'magic:<i>Clairaudience/Clairvoyance</i> %V rd/day',
  'Resistance Bonus':'save:+%V saves',
  'Resistant Touch':
    'magic:Touch transfers resistance bonus to ally 1 minute %V/day',
  'Scythe Of Evil':'combat:Add <i>unholy</i> to weapon %1 rd %V/day',
  'Speak With Animals':'magic:<i>Speak With Animals</i> %V rd/day',
  'Spell Rune':'magic:Add known spell to Blast Rune',
  'Staff Of Order':'combat:Add <i>axiomatic</i> to weapon %1 rd %V/day',
  'Storm Burst':"combat:R30' touch 1d6+%1 HP non-lethal + -2 attack %V/day",
  'Strength Rush':
    'magic:Touch imparts +%V melee attack/strength check bonus %1/day',
  'Touch Of Chaos':
    'combat:Touch attack %V/day causes target to take worse result of d20 rerolls 1 rd',
  'Touch Of Darkness':'combat:Touch attack causes 20% miss chance %V rd %1/day',
  'Touch Of Evil':'combat:Touch attack sickens %V rd %1/day',
  'Touch Of Glory':'magic:Touch imparts +%V charisma check bonus %1/day',
  'Touch Of Good':
    'magic:Touch imparts +%V attack/skill/ability/save 1 rd %1/day',
  'Touch Of Law':'magic:Touch imparts "take 11" on all d20 rolls 1 rd %V/day',
  'Travel Speed':'ability:+10 Speed',
  'Undead Bane':'magic:+2 DC on energy channeled to harm undead',
  'Unity':"save:Allies w/in 30' use your saving throw %V/day",
  'Vision Of Madness':
    'magic:Touch imparts +%V attack, save, or skill, -%1 others 3 rd %2/day',
  'Ward Against Death':
    "magic:Creatures w/in 30' immune to death effects/energy drain/negative levels %V rd/day",
  'Weapon Master':'combat:Use additional combat feat %V rd/day',
  'Wooden Fist':'combat:+%V, no AOO unarmed attacks %1 rd/day',
  // Feats
  'Acrobatic':'skill:+%V Acrobatics/+%V Fly',
  'Acrobatic Steps':"ability:Move through difficult terrain 20'/rd",
  'Agile Maneuvers':'combat:+%V CMB (dex instead of str)',
  'Alertness':'skill:+%V Perception/+%V Sense Motive',
  'Alignment Channel (Chaos)':
    'combat:Channel Energy to heal or harm Chaos outsiders',
  'Alignment Channel (Evil)':
    'combat:Channel Energy to heal or harm Evil outsiders',
  'Alignment Channel (Good)':
    'combat:Channel Energy to heal or harm Good outsiders',
  'Alignment Channel (Law)':
    'combat:Channel Energy to heal or harm Law outsiders',
  'Animal Affinity':'skill:+%V Handle Animal/+%V Ride',
  'Arcane Armor Mastery':'magic:Reduce armored casting penalty 10%',
  'Arcane Armor Training':'magic:Reduce armored casting penalty 10%',
  'Arcane Strike':'combat:Imbue weapons with +%V magic damage bonus 1 rd',
  'Athletic':'skill:+%V Climb/+%V Swim',
  'Bleeding Critical':
    'combat:Critical hit causes 2d6 HP/rd until healed (DC 15)',
  'Blind-Fight':
    'combat:Reroll concealed miss, no bonus to invisible foe, no skill check on blinded full speed move',
  'Blinding Critical':
    'combat:Critical hit causes permanent blindness, DC %V fortitude save reduces to dazzled 1d4 rd',
  'Catch Off-Guard':
    'combat:No penalty for improvised weapon, unarmed opponents flat-footed',
  'Channel Smite':'combat:Channel energy into weapon strike as swift action',
  'Cleave':'combat:-2 AC for attack against two foes',
  'Combat Expertise':'combat:Trade up to -%V attack for equal AC bonus',
  'Command Undead':"combat:Undead w/in 30' %V DC will save or controlled",
  'Critical Focus':'combat:+4 attack on critical hits',
  'Critical Mastery':'combat:Apply two effects to critical hits',
  'Dazzling Display':
    "combat:Intimidate check to demoralize foes w/in 30' using focused weapon",
  'Deadly Aim':'combat:-%V attack/+%1 damage on ranged attacks',
  'Deadly Stroke':
    'combat:x2 damage/1 point con bleed against stunned/flat-footed foe',
  'Deafening Critical':
    'combat:Critical hit causes permanent deafness, DC %V fortitude save reduces to 1 rd',
  'Deceitful':'skill:+%V Bluff/+%V Disguise',
  'Defensive Combat Training':'combat:+%V CMD',
  'Deft Hands':'skill:+%V Disable Device/+%V Sleight Of Hand',
  'Disruptive':'combat:+4 foe defensive spell DC',
  'Dodge':'combat:+1 AC/+1 CMD',
  'Double Slice':'combat:Add full strength to off-hand damage',
  'Elemental Channel (Air)':
    'combat:Channel energy to heal or harm Air outsiders',
  'Elemental Channel (Earth)':
    'combat:Channel energy to heal or harm Air outsiders',
  'Elemental Channel (Fire)':
    'combat:Channel energy to heal or harm Air outsiders',
  'Elemental Channel (Water)':
    'combat:Channel energy to heal or harm Air outsiders',
  'Exhausting Critical':'combat:Critical hit causes foe exhaustion',
  'Extra Channel':'magic:Channel energy +2/day',
  'Extra Ki':'feature:+2 Ki pool',
  'Extra Lay On Hands':'magic:Lay On Hands +2/day',
  'Extra Mercy':'magic:Lay On Hands gives Mercy effect',
  'Extra Performance':'feature:Use Barding Performance extra 6 rd/day',
  'Extra Rage':'feature:Rage extra 6 rd/day',
  'Far Shot':'combat:-1 range penalty',
  'Fleet':'ability:+5 Speed in light or no armor',
  "Gorgon's Fist":
    'combat:Unarmed attack vs. slowed foe DC %V fortitude save or staggered',
  'Greater Bull Rush':'combat:+2 Bull Rush checks, AOO on Bull Rushed foes',
  'Greater Disarm':"combat:+2 disarm checks, disarmed weapons land 15' away",
  'Greater Feint':'combat:Feinted foe loses dex bonus 1 rd',
  'Greater Grapple':'combat:+2 grapple checks, grapple check is move action',
  'Greater Overrun':'combat:+2 overrun checks, AOO on overrun foes',
  'Greater Penetrating Strike':
    'combat:Focused weapons ignore DR 5/- or DR 10/anything',
  'Greater Shield Focus':'combat:+1 AC', // No change to CMD
  'Greater Sunder':'combat:+2 sunder checks, foe takes excess damage',
  'Greater Trip':'combat:+2 trip checks, AOO on tripped foes',
  'Greater Two-Weapon Fighting':'combat:Third off-hand -10 attack',
  'Greater Vital Strike':'combat:4x base damage',
  'Improved Bull Rush':
    'combat:No AOO on Bull Rush, +2 Bull Rush check, +2 Bull Rush CMD',
  'Improved Channel':'magic:+2 DC on channeled energy',
  'Improved Disarm':'combat:No AOO on Disarm, +2 Disarm check, +2 Disarm CMD',
  'Improved Grapple':
    'combat:No AOO on Grapple, +2 Grapple check, +2 Grapple CMD',
  'Improved Great Fortitude':'save:Reroll fortitude save 1/day',
  'Improved Iron Will':'save:Reroll will save 1/day',
  'Improved Lightning Reflexes':'save:Reroll reflex save 1/day',
  'Improved Overrun':
    'combat:No AOO on Overrun, +2 Overrun check, +2 Overrun CMD, foes cannot avoid',
  'Improved Precise Shot':'combat:No foe AC bonus for partial concealment',
  'Improved Sunder':'combat:No AOO on Sunder, +2 Sunder check, +2 Sunder CMD',
  'Improved Trip':'combat:No AOO on Trip, +2 Trip check, +2 Trip CMD',
  'Improved Vital Strike':'combat:3x base damage',
  'Improved Weapon Mastery':
    'combat:No penalties for improvised weapons, improvised weapon damage +step, critical x2@19',
  'Intimidating Prowess':'skill:+%V Intimidate',
  'Leadership':'feature:Attract followers',
  'Lightning Stance':'combat:50% concealment with 2 move or withdraw actions',
  'Lunge':"combat:-2 AC to increase melee range 5'",
  'Magical Aptitude':'skill:+%V Spellcraft/+%V Use Magic Device',
  'Manyshot':'combat:Fire 2 arrows simultaneously',
  'Master Craftsman (Craft (Armor))': [
    'feature:Use Craft (Armor) with Craft Magic Arms And Armor, Craft Wondrous Item',
    'skill:+2 Craft (Armor)'
  ],
  'Master Craftsman (Profession (Tanner))': [
    'feature:Use Profession (Tanner) with Craft Magic Arms And Armor, Craft Wondrous Item',
    'skill:+2 Profession (Tanner)'
  ],
  "Medusa's Wrath":'combat:2 extra unarmed attacks vs. diminished-capacity foe',
  'Nimble Moves':
    "ability:Move through difficult terrain 5'/rd as though normal terrain",
  'Penetrating Strike':'combat:Focused weapons ignore DR 5/anything',
  'Persuasive':'skill:+%V Diplomacy/+%V Intimidate',
  'Pinpoint Targeting':'combat:Ranged attack ignores armor bonus',
  'Power Attack':'combat:-%V attack/+%1 damage',
  'Run':[
    'ability:+1 Run Speed Multiplier',
    'combat:Retain dex bonus to AC while running',
    'skill:+4 Acrobatics (running jump)'
  ],
  'Scorpion Style':'combat:Unarmed hit slows foe %V rd (DC %1 Fort neg)',
  'Selective Channeling':'magic:Avoid up to %V targets',
  'Self-Sufficient':'skill:+%V Heal/+%V Survival',
  'Shatter Defenses':'combat:Fearful opponents flat-footed through next rd',
  'Shield Focus':'combat:+1 AC', // No change to CMD
  'Shield Master':
    'combat:No penalty on shield attacks, apply shield enhancements to attack/damage',
  'Shield Slam':'combat:Shield Bash includes Bull Rush',
  'Sickening Critical':'combat:Critical hit causes foe sickening',
  'Spellbreaker':'combat:AOO on foe failed defensive casting',
  'Staggering Critical':
    'combat:Critical hit causes foe staggered 1d4+1 rd, DC %V fortitude negates',
  'Stand Still':'combat:CMB check to halt foe movement',
  'Stealthy':'skill:+%V Escape Artist/+%V Stealth',
  'Step Up':"combat:Match foe's 5' step",
  'Strike Back':'combat:Attack attackers beyond reach',
  'Stunning Critical':'combat:Critical hit stuns 1d4 rd (DC %V Fort staggered)',
  'Stunning Fist':'combat:Foe DC %V Fortitude save or stunned %1/day',
  'Throw Anything':
    'combat:No penalty for improvised ranged weapon, +1 attack w/thrown splash',
  'Tiring Critical':'combat:Critical hit tires foe',
  'Toughness':'combat:+%V HP',
  'Turn Undead':
    'combat:Channel energy to cause undead panic, DC %V will save negates',
  'Two-Weapon Rend':'combat:Extra 1d10+%V HP from double hit',
  'Unseat':'combat:Bull Rush after hit w/lance to unseat mounted foe',
  'Vital Strike':'combat:2x base damage',
  'Wind Stance':"combat:20% concealment when moving > 5'",
  // Classes
  "Diviner's Fortune":
    'magic:Touched creature +%V attack, skill, ability, save 1 rd %1/day',
  "Summoner's Charm":'magic:Summon duration increased %V rd',
  'Abundant Step':'magic:Use 2 ki to <i>Dimension Door</i>',
  'Animal Fury':'combat:Bite attack %V+%1 during rage',
  'Armor Mastery':'combat:DR 5/- when using armor/shield',
  'Armor Training':[
    'ability:No speed penalty in %V armor',
    'combat:Additional +%V Dex AC bonus', 'skill:Reduce armor skill check penalty by %V'
  ],
  'Aura Of Despair':"magic:Foes w/in 30' -2 ability/attack/damage/save/skill %V rd/day",
  'Aura Of Justice':"combat:Grant Smite Evil to allies w/in 10'",
  'Aura Of Resolve':"save:Immune charm, +4 to allies w/in 30'",
  'Aura Of Righteousness':"save:Immune compulsion, +4 to allies w/in 30'",
  'Aura Of Righteousness':'combat:DR %V/evil',
  'Bardic Knowledge':'skill:+%V all Knowledge, use any Knowledge untrained',
  'Bardic Performance':'feature:Bardic Performance effect %V rd/day',
  'Bleeding Attack':'combat:Sneak attack causes extra %V HP/rd until healed',
  'Blinding Ray':'magic:Ranged touch blinds/dazzles 1 rd %V/day',
  'Bloodline Aberrant':'magic:Polymorph spells last 50% longer',
  'Bloodline Abyssal':'magic:Summoned creatures gain DR %V/good',
  'Bloodline Arcane':'magic:+1 boosted spell DC',
  'Bloodline Celestial':'magic:Summoned creatures gain DR %V/evil',
  'Bloodline Destined':'save:+spell level on saves 1 rd after casting personal spell',
  'Bloodline Draconic':'magic:+1 damage/die on %V spells',
  'Bloodline Elemental':'magic:Change spell energy type to %V',
  'Bloodline Fey':'magic:+2 compulsion spell DC',
  'Bloodline Infernal':'magic:+2 charm spell DC',
  'Bloodline Undead':'magic:Affect corporeal undead as humanoid',
  'Bonded Object':'magic:Cast known spell through object',
  'Bravery':'save:+%V vs. fear',
  'Camouflage':'skill:Hide in favored terrain',
  'Change Shape':'magic:<i>Beast Shape %1</i>/<i>Elemental Body %2</i> %V rd/day',
  'Channel Energy':"magic:Heal/inflict %Vd6 HP 30' radius (DC %1 Will half) %2/day",
  'Clear Mind':'save:Reroll Will save 1/rage',
  'Companion Bond':"combat:Half favored enemy bonus to allies w/in 30' %V rd",
  'Condition Fist':'combat:Stunning Fist may instead make target %V',
  'Conjured Dart':'magic:Ranged touch 1d6+%1 HP %V/day',
  'Combat Trick':'feature:+1 Combat Feat',
  'Dazing Touch':'magic:Touch attack dazes %V HD foe 1 rd %1/day',
  'Deadly Performance':'magic:Target DC %V Will save or die',
  'Dimensional Steps':"magic:Teleport up to %V'/day",
  'Dirge Of Doom':"magic:Creatures w/in 30' shaken while performing",
  'Dispelling Attack':'magic:Sneak attack acts as <i>Dispel Magic</i> on target',
  'Distraction':"magic:Perform check vs. visual magic w/in 30' 10 rd",
  'Divine Mount':'feature:Magically summon mount %V/day',
  'Divine Weapon':'combat:Add %V enhancements to weapon %1 minutes %2/day',
  'Elemental Wall':'magic:<i>Wall Of Fire</i>/acid/cold/electricity %V rd/day',
  'Empty Body':'magic:Use 3 ki for 1 minute <i>Etherealness</i>',
  'Enchanting Smile':'skill:+%V Bluff/+%V Diplomacy/+%V Intimidate',
  'Enchantment Reflection':'save:Successful save reflects enchantment spells on caster',
  'Energy Absorption':'save:Ignore %V HP energy/day',
  'Energy Resistance':'save:%V chosen energy type',
  'Extended Illusions':'magic:Illusion duration increased %V rd',
  'Fast Stealth':'skill:Use Stealth at full speed',
  'Favored Enemy':[
    'combat:+2 or more attack and damage vs. %V type(s) of creatures',
    'skill:+2 or more Bluff, Knowledge, Perception, Sense Motive, Survival vs. %V type(s) of creatures'
  ],
  'Favored Terrain':[
    'combat:+2 Initiative in %V terrain type(s)',
    'skill:+2 Knowledge (Geography), Perception, Stealth, Survival, leaves no trail in %V terrain type(s)'
  ],
  'Fearless Rage':'save:Cannot be shaken/frightened during rage',
  'Flurry Of Blows':
    'combat:Full-round %V +%1 monk weapon attacks, use 1 ki for one more',
  'Force Missile':'magic:<i>Magic Missile</i> 1d4+%V HP %1/day',
  'Forewarned':'combat:+%V initiative, always act in surprise round',
  'Frightening Tune':"magic:R30' DC %V Will <i>Cause Fear</i> via performance",
  'Guarded Stance':'combat:+%V AC during rage',
  'Hand Of The Apprentice':"combat:R30' +%V w/melee weapon %1/day",
  'High Jump':'skill:+%V Acrobatics (jump), use 1 ki for +20',
  'Holy Champion':'magic:Maximize lay on hands, smite evil DC %V <i>Banishment</i>',
  'Intense Spell':'magic:+%V evocation spell damage',
  'Internal Fortitude':'save:Cannot be sickened/nauseated during rage',
  'Intimidating Glare':
    'skill:Successful Intimidate during rage shakes foe at least 1d4 rd',
  'Invisibility Field':'magic:<i>Greater Invisibility</i> %V rd/day',
  'Jack Of All Trades':'skill:Use any skill untrained',
  'Ki Dodge':'combat:Use 1 ki for +4 AC',
  'Ki Pool':'feature:%V points refills w/8 hours rest',
  'Ki Speed':'ability:Use 1 ki for +20',
  'Ki Strike':'combat:Unarmed attack is %V',
  'Knockback':'combat:Successful Bull Rush during rage %V HP',
  'Lay On Hands':'magic:Harm undead or heal %Vd6 HP %1/day',
  'Ledge Walker':'skill:Use Acrobatics along narrow surfaces at full speed',
  'Life Sight':'feature:%V blindsight for living/undead',
  'Lore Master':'skill:Take 10 on any ranked Knowledge skill, take 20 %V/day',
  'Major Magic':'magic:Cast W1 spell 2/day',
  'Maneuver Training':'combat:+%V CMB',
  'Master Hunter':
    'combat:Full attack vs. favored enemy requires DC %V Fortitude save or die',
  'Master Strike':'combat:Sneak attack target DC %V Fortitude or sleep/paralyze/die',
  'Mercy':'magic:Lay on hands removes additional effects',
  'Metamagic Mastery':'magic:Apply metamagic feat %V/day',
  'Mighty Swing':'combat:Automatic critical 1/rage',
  'Minor Magic':'magic:Cast W0 spell 3/day',
  'Moment Of Clarity':'combat:Rage effects suspended 1 rd',
  'Monk Armor Class Adjustment':'combat:+%V AC/+%V CMD',
  'Necromantic Touch':'magic:Touch causes shaken/frightened %V rd %1/day',
  'Night Vision':"feature:60' Darkvision during rage",
  'No Escape':'combat:x2 speed 1/rage when foe withdraws',
  'Penetrating Spells':'magic:Best of two rolls to overcome spell resistance',
  'Perfect Self':[
    'combat:DR 10/chaotic',
    'save:Treat as outsider for magic saves'
  ],
  'Physical Enhancement':'ability:+%V %1 of str, dex, and con',
  'Power Over Undead':'feature:+1 General Feat (Command Undead or Turn Undead)',
  'Powerful Blow':'combat:+%V HP 1/rage',
  'Protective Ward':"magic:+%V AC 10' radius %1/day",
  'Quarry':[
    'combat:+%V attack, automatic critical vs. target',
    'skill:Take %V to track target'
  ],
  'Quick Disable':'skill:Disable Device in half normal time',
  'Quick Reflexes':'combat:+1 AOO/rd during rage',
  'Quivering Palm':'combat:Foe makes DC %V Fortitude save or dies 1/day',
  'Raging Climber':'skill:+%V Climb during rage',
  'Raging Leaper':'skill:+%V Acrobatics (jump) during rage',
  'Raging Swimmer':'skill:+%V Swim during rage',
  'Renewed Vigor':'magic:Heal %Vd8+%1 HP 1/day during rage',
  'Resiliency':'combat:1 minute of %V temporary HP when below 0 HP 1/day',
  'Rogue Crawl':'ability:Crawl at half speed',
  'Rogue Weapon Training':'feat:+1 Combat Feat (Weapon Focus)',
  'Rolling Dodge':'combat:+%V AC vs. ranged %1 rd during rage',
  'Roused Anger':'combat:Rage even if fatigued',
  'Scent':'feature:Detect creatures via smell',
  'Scrying Adept':
    'magic:Constant <i>Detect Scrying</i>, +1 scrying subject familiarity',
  'Slow Reactions':'combat:Sneak attack target no AOO 1 rd',
  'Soothing Performance':"magic:R30' <i>Mass Cure Serious Wounds</i> via performance",
  'Spontaneous Cleric Spell':
    'magic:Cast <i>Cure</i> or <i>Inflict<i> in place of known spell',
  'Spontaneous Druid Spell':
    "magic:Cast <i>Summon Nature's Ally</i> in place of known spell",
  'Stand Up':'combat:Stand from prone as free action',
  'Strength Surge':'combat:+%V strength or combat maneuver check 1/rage',
  'Superstition':'save:+%V vs. spells, supernatural, spell-like abilities during rage',
  'Surprise Accuracy':'combat:+%V attack 1/rage',
  'Surprise Attack':'combat:All foes flat-footed during surprise round',
  'Swift Foot':'ability:+5 Speed during rage',
  'Telekinetic Fist':'magic:Ranged touch 1d4+%1 HP %V/day',
  'Terrifying Howl':"combat:Howl DC %V will save w/in 30' or shaken 1d4+1 rd",
  'Track':"skill:+%V Survival to follow creatures' trail",
  'Trap Spotter':"skill:Automatic Perception check w/in 10' of trap",
  'Trapfinding':'skill:+%V Perception (traps)/+%V Disable Device (traps)',
  'Unexpected Strike':'combat:AOO when foe enters threat 1/rage',
  'Versatile Performance':'skill:Substitute Perform ranking for associated skills',
  'Weapon Mastery':
    'combat:Critical automatically hits, +1 damage multiplier, no disarm w/chosen weapon',
  'Weapon Training':'combat:Attack/damage bonus w/weapons from trained groups',
  'Well-Versed':'save:+4 vs. bardic effects',
  'Wholeness Of Body':'magic:Use 2 ki to heal %V HP to self',
  // Races
  'Adaptability':'feature:+1 General Feat (Skill Focus)',
  'Darkvision':"feature:60' b/w vision in darkness",
  'Defensive Training':'combat:+4 AC vs. giant creatures',
  'Dwarf Ability Adjustment':'ability:+2 Constitution/+2 Wisdom/-2 Charisma',
  'Dwarf Hatred':'combat:+1 attack vs. goblinoid and orc',
  'Elf Ability Adjustment':
    'ability:+2 Dexterity/+2 Intelligence/-2 Constitution',
  'Elf Blood':'feature:Elf and human for racial effects',
  'Elven Magic':[
    'magic:+2 vs. spell resistance',
    'skill:+2 Spellcraft (identify magic item properties)'
  ],
  'Fearless':'save:+2 vs. fear',
  'Gnome Ability Adjustment':'ability:+2 Constitution/+2 Charisma/-2 Strength',
  'Gnome Hatred':'combat:+1 attack vs. goblinoid and reptilian',
  'Gnome Magic':'magic:+1 DC on illusion spells',
  'Greed':'skill:+2 Appraise (precious metals, gems)',
  'Half-Elf Ability Adjustment':'ability:+2 any',
  'Half-Orc Ability Adjustment':'ability:+2 any',
  'Halfling Ability Adjustement':'ability:+2 Dexterity/+2 Charisma/-2 Strength',
  'Halfling Luck':'save:+1 all saves',
  'Hardy':'save:+2 vs. poison and spells',
  'Human Ability Adjustment':'ability:+2 any',
  'Intimidating':'skill:+2 Intimidate',
  'Keen Senses':'skill:+2 Perception',
  'Low-Light Vision':'feature:x%V normal distance in poor light',
  'Multitalented':'feature:Two favored classes',
  'Natural Spells':'magic:%V 1/day as caster %1',
  'Obsessive':'skill:+2 choice of Craft or Profession',
  'Orc Blood':'feature:Orc and human for racial effects',
  'Orc Ferocity':'combat:Fight 1 rd below zero HP',
  'Resist Enchantment':'save:+2 vs. enchantment',
  'Resist Illusion':'save:+2 vs. illusions',
  'Sleep Immunity':'save:Immune <i>Sleep</i>',
  'Slow':'ability:-10 Speed',
  'Small':[
    'combat:+1 AC/+1 Melee Attack/+1 Ranged Attack/-1 CMB/-1 CMD',
    'skill:+2 Fly/+4 Stealth'
  ],
  'Stability':'combat:+4 CMD vs. Bull Rush and Trip',
  'Steady':'ability:No speed penalty in armor',
  'Stonecunning':"skill:+2 Perception (stone), automatic check w/in 10'",
  'Sure-Footed':'skill:+2 Acrobatics/+2 Climb',
  // Animal companions and familiars
  'Companion Alertness':
    'skill:+2 Perception, Sense Motive when companion w/in reach',
  'Familiar Bat':'skill:+3 Fly',
  'Familiar Cat':'skill:+3 Stealth',
  'Familiar Monkey':'skill:+3 Acrobatics',
  // Traits
  'A Sure Thing':'combat:+2 attack vs evil 1/day',
  'Adopted':'feature:Family race traits available',
  'Aid Allies':'combat:+1 aid another action',
  'Anatomist':'combat:+1 critical hit rolls',
  'Ancient Historian':'skill:Choice of Knowledge (History), Linguistics class skill and +1, learn 1 ancient language',
  'Animal Friend':[
    "save:+1 Will when unhostile animal w/in 30'",
    'skill:Handle Animal is a class skill'
  ],
  'Apothecary':'feature:Has reliable poisons source',
  'Arcane Archivist':
    'skill:+1 Use Magic Device/Use Magic Device is a class skill',
  'Armor Expert':'skill:-1 armor skill check penalty',
  'Attuned To The Ancestors':'magic:<i>Hide From Undead</i> %V rd 1/day',
  'Bad Reputation':'skill:+2 Intimidate/Intimidate is a class skill',
  'Balanced Offensive':'combat:Cleric-like elemental attack %V/day',
  'Beastspeaker':'skill:+1 Diplomacy (animals), no penalty w/elemental animals',
  'Beneficient Touch':'magic:Reroll healing spell 1s 1/day',
  'Birthmark':'save:+2 vs. charm, compulsion',
  'Bitter Nobleman':
    'skill:+1 choice of Bluff, Sleight Of Hand, Stealth/choice is a class skill',
  'Brute':'skill:+1 Intimidate/Intimidate is a class skill',
  'Bullied':'combat:+1 unarmed AOO attack',
  'Bully':'skill:+1 Intimidate/Intimidate is a class skill',
  'Canter':'skill:+5 Bluff (secret message)/+5 Sense Motive (secret message)',
  "Captain's Blade":
    'skill:+1 Acrobatics, Climb when on ship/choice is a class skill',
  'Caretaker':'skill:+1 Heal/Heal is a class skill',
  'Charming':[
    'magic:+1 spell DC w/attracted creatures',
    'skill:+1 Bluff, Diplomacy w/attracted creatures'
  ],
  'Child Of Nature':
    'skill:+1 Knowledge (Nature)/+1 Survival (finding food and water)/choice is a class skill',
  'Child Of The Streets':'skill:+1 Sleight Of Hand/Sleight Of Hand is a class skill',
  'Child Of The Temple':
    'skill:+1 Knowledge (Nobility)/+1 Knowledge (Religion)/choice is a class skill',
  'Clasically Schooled':'skill:+1 Spellcraft/Spellcraft is a class skill',
  'Comparative Religion':
    'skill:+1 Knowledge (Religion)/Knowledge (Religion) is a class skill',
  'Courageous':'save:+2 vs. fear',
  'Dangerously Curious':
    'skill:+1 Use Magic Device/Use Magic Device is a class skill',
  'Deft Dodger':'save:+1 Reflex',
  'Demon Hunter':[
    'skill:+3 Knowledge (Planes) wrt demons',
    'save:+2 Will vs. demonic mental spells and effects'
  ],
  'Dervish':'combat:+1 AC vs. move AOO',
  'Desert Child':'save:+4 heat stamina, +1 vs. fire effects',
  'Desert Shadow':'skill:Full speed Stealth in desert',
  "Devil's Mark":
    'skill:+2 Bluff, Diplomacy, Intimidate, Sense Motive with evil outsiders',
  'Devotee Of The Green':
    'skill:+1 Knowledge (Geography)/+1 Knowledge (Nature)/choice is a class skill',
  'Dirty Fighter':'combat:+1 damage when flanking',
  'Divine Courtesan':
    'skill:+1 Diplomacy (gather information)/+1 Sense Motive/choice is a class skill',
  'Divine Warrior':'magic:Enspelled weapons +1 damage',
  'Dune Walker':[
    'ability:Normal movement through sand',
    'save:+4 Fort vs heat'
  ],
  'Ear For Music':'skill:+1 Perform choice/+2 Knowledge (Local) (art, music)',
  'Ease Of Faith':'skill:+1 Diplomacy/Diplomacy is a class skill',
  'Eastern Mysteries':'magic:+2 spell DC 1/day',
  'Elven Reflexes':'combat:+2 Initiative',
  'Exile':'combat:+2 Initiative',
  'Expert Duelist':'combat:+1 AC/+1 CMD',
  'Explorer':'skill:+1 Survival/Survival is a class skill',
  'Eyes And Ears Of The City':'skill:+1 Perception/Perception is a class skill',
  'Faction Freedom Fighter':[
    'combat:+1 surprise attack',
    'skill:+1 Stealth'
  ],
  'Failed Apprentice':'save:+1 vs. arcane spells',
  'Fashionable':
    'skill:+1 Bluff, Diplomacy, Sense Motive when well-dressed/choice is a class skill',
  'Fast-Talker':'skill:+1 Bluff/Bluff is a class skill',
  'Fencer':'combat:+1 attack on AOO with blades',
  'Fiendish Presence':
    'skill:+1 Diplomacy/+1 Sense Motive/choice is a class skill',
  'Fires Of Hell':'combat:Flaming blade +1 damage %V rd 1/day',
  'Flame Of The Dawn Flower':'combat:+2 scimitar critical damage',
  'Focused Mind':'magic:+2 concentration checks',
  'Force For Good':'spell:+1 caster level on good-aligned spells',
  'Forlorn':'save:+1 Fortitude',
  'Fortified':'combat:20% chance to negate critical hit or sneak attack 1/day',
  'Fortified Drinker':'save:+2 vs mental effect 1 hr after drinking',
  'Freedom Fighter':[
    'combat:+1 attack during escape',
    'skill:+1 skills during escape/Escape Artist is a class skill'
  ],
  'Gifted Adept':'magic:+1 caster level on chosen spell',
  'Gold Finger':
    'skill:+1 Disable Device/+1 Sleight Of Hand/choice is a class skill',
  'Goldsniffer':'skill:+2 Perception (metals, jewels, gems)',
  'Greasy Palm':'feature:10% discount on bribes',
  'Guardian Of The Forge':
    'skill:+1 Knowledge (Engineering)/+1 Knowledge (History)/choice is a class skill',
  'Hedge Magician':'magic:5% discount on magic craft cost',
  'Highlander':
    'skill:+1 Stealth/+2 Stealth (hilly and rocky areas)/Stealth is a class skill',
  'History Of Heresy':'save:+1 vs. divine spells',
  'Horse Lord':'skill:+2 Ride/Ride is a class skill',
  "Hunter's Eye":
    'combat:No penalty for longbow/shortbow 2nd range increment/proficiency in choice',
  'I Know A Guy':'skill:+1 Knowledge (Local)/+2 Diplomacy (gather information)',
  'Impressive Presence':
    'combat:Adjacent foes shaken 1 rd 1/day (DC %V Will neg)',
  'Indomitable':'save:+1 vs. enchantment',
  'Indomitable Faith':'save:+1 Will',
  'Influential':[
    'magic:+1 DC on language-dependent spell 1/day',
    'skill:+3 Diplomacy (requests)'
  ],
  'Insider Knowledge':
    'skill:+1 choice of Diplomacy, Knowledge (Local)/choice is a class skill',
  'Killer':'combat:Extra damage on critical hit',
  'Librarian':
    'skill:+1 Linguistics/+1 Profession (Librarian)/choice is a class skill/+1 reading bonus 1/day',
  'Log Roller':[
    'combat:+1 CMD vs. trip',
    'skill:+1 Acrobatics'
  ],
  'Lore Seeker':[
    'magic:+1 caster level on 3 spells',
    'skill:+1 Knowledge (Arcana)/Knowledge (Arcana) is a class skill'
  ],
  'Loyalty':'save:+1 vs enchantment',
  'Magic Is Life':
    'save:+2 vs. death effects when enspelled/stabilize automatically',
  'Magical Knack':'magic:+2 caster level (max %V)',
  'Magical Lineage':'magic:-1 spell level for chosen spell metamagic',
  'Magical Talent':'magic:Use chosen cantrip 1/day',
  'Master Of Pentacles':'magic:+2 Conjuration spell caster level 1/day',
  'Mathematical Prodigy':
    'skill:+1 Knowledge (Arcana)/+1 Knowledge (Engineering)/choice is a class skill',
  'Medic':[
    'magic:+1 caster level with <i>Remove</i> healing',
    'skill:+2 Heal (disease, poison)'
  ],
  'Meridian Strike':'combat:Reroll crit damage 1s 1/day',
  'Meticulous Artisan':'skill:+1 Craft for day job',
  'Militia Veteran':
    'skill:+1 choice of Profession (Soldier), Ride, Survival/choice is a class skill',
  'Mind Over Matter':'save:+1 Will',
  'Missionary':[
    'magic:+1 caster level on 3 spells',
    'skill:+1 Knowledge (Religion)/Knowledge (Religion) is a class skill'
  ],
  'Mummy-Touched':'save:+2 vs. curse and disease',
  'Natural Negotiator':[
    'feature:Additional language',
    'skill:Choice of Diplomacy, Handle Animal is a class skill'
  ],
  'Natural-Born Leader':[
    'feature:+1 Leadership score',
    "save:+1 followers' Will vs. mind-altering effects"
  ],
  'Observant':
    'skill:+1 choice of Perception, Sense Motive/choice is a class skill',
  'Outcast':'skill:+1 Survival/Survival is a class skill',
  'Patient Optimist':'skill:+1 Diplomacy, 1 retry on unfriendly or hostile',
  'Performance Artist':'skill:+1 choice of Perform/choice is a class skill',
  'Planar Voyage':[
    'combat:+1 Initiative off PM plane',
    'save:+1 saves off PM plane'
  ],
  'Poverty-Stricken':'skill:+1 Survival/Survival is a class skill',
  'Proper Training':
    'skill:+1 choice of Knowledge (Geography), Knowledge (History)/choice is a class skill',
  'Rapscallion':[
    'combat:+1 Initiative',
    'skill:+1 Escape Artist'
  ],
  'Reactionary':'combat:+2 Initiative',
  'Reverent Wielder':[
    'combat:+1 disarm, steal, sunder CMD',
    'save:Equipment +1 saves'
  ],
  'Resilient':'save:+1 Fortitude',
  'Rich Parents':'feature:Start w/900 GP',
  'River Rat':[
    'combat:+1 damage w/daggers',
    'skill:+1 Swim/Swim is a class skill'
  ],
  'Rousing Oratory':
    "skill:Choice of Perform is a class skill/DC 15 gives allies w/in 60' +1 or better vs. fear 5 min 1/day",
  'Sacred Conduit':'magic:+1 channeled energy save DC',
  'Sacred Touch':'magic:Touch stabilizes',
  'Savanna Child':
    'skill:+1 choice of Handle Animal, Knowledge (Nature), Ride/choice is a class skill',
  'Scholar Of Balance':
    'skill:+1 Knowledge (Nature)/+1 Knowledge (Planes)/choice is a class skill',
  'Scholar Of Ruins':
    'skill:+1 Knowledge (Dungeoneering)/+1 Knowledge (Geography)/choice is a class skill',
  'Scholar Of The Great Beyond':
    'skill:+1 Knowledge (History)/+1 Knowledge (Planes)/choice is a class skill',
  'Secrets Of The Sphinx':
    'skill:+2 Knowledge check 1/day/choice of Knowledge is a class skill',
  'Shadow Diplomat':'skill:+1 Diplomacy/Diplomacy is a class skill',
  'Sheriff':'skill:+10 local Bluff, Diplomacy, Intimidate 1/session',
  'Shiv':'combat:+1 surprise piercing/slashing damage',
  'Skeptic':'save:+2 vs. illusions',
  'Smuggler':
    'skill:+3 Sleight Of Hand (hide object)/Sleight Of Hand is a class skill',
  'Soul Drinker':"combat:Gain HP equal to slain foe's hit dice 1 min 1/day",
  'Starchild':'skill:+4 Survival (avoid becoming lost), know North',
  'Storyteller':'skill:+%V choice of Knowledge check 1/scenario',
  'Suspicious':'skill:+1 Sense Motive/Sense Motive is a class skill',
  'Tavern Owner':'feature:10% extra from treasure sale',
  'Teaching Mistake':'save:+1 save after nat 1 save roll 1/scenario',
  'Tireless':[
    'ability:+2 Con vs. nonlethal exertion/environ',
    'combat:+1 HP'
  ],
  'Tomb Raider':
    'skill:+1 Knowledge (Dungeoneering)/+1 Perception/choice is a class skill',
  'Trouper':[
    'save:+1 vs. Perform-related abilities',
    'skill:+1 choice of Perform'
  ],
  'Tunnel Fighter':
     'combat:+2 Initiative (underground)/+1 critical damage (underground)',
  'Unflappable':[
    'save:+1 vs. fear',
    'skill:+3 resist Intimidate DC'
  ],
  'Undead Slayer':'combat:+1 damage vs. undead',
  'Upstanding':'skill:+1 Diplomacy/+1 Sense Motive/choice is a class skill',
  'Unorthodox Strategy':'skill:+2 Acrobatics (traverse threatened squares)',
  'Vagabond Child':
    'skill:+1 choice of Disable Device, Escape Artist, Sleight Of Hand/choice is a class skill',
  'Veteran Of Battle':'combat:+1 Initiative, draw weapon during surprise round',
  'Vindictive':'combat:+1 damage vs. successful foe 1 min 1/day',
  'Warrior Of Old':'combat:+2 Initiative',
  'Watchdog':'skill:+1 Sense Motive/Sense Motive is a class skill',
  'Weapon Style':'combat:Proficient with choice of monk weapon',
  'Well-Informed':
    'skill:+1 Diplomacy (gather information)/+1 Knowledge (Local)/choice is a class skill',
  'Whistleblower':'skill:+1 Sense Motive/Sense Motive is a class skill',
  'Wisdom In The Flesh':
    'skill:Use Wis modifier for chosen Str/Con/Dex skill/choice is a class skill',
  'World Traveler':
    'skill:+1 choice of Diplomacy, Knowledge (Local), Sense Motive/choice is a class skill'
});
Pathfinder.GENDERS = Object.assign({}, SRD35.GENDERS);
Pathfinder.LANGUAGES = Object.assign({}, SRD35.LANGUAGES, {
  'Aklo':''
});
Pathfinder.RACES = {
  'Dwarf':
    'Features=Darkvision,"Defensive Training","Dwarf Ability Adjustment",' +
    '"Dwarf Hatred",Greed,Hardy,Slow,Steady,Stability,Stonecunning,' +
    '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)",' +
    '"Weapon Proficiency (Battleaxe/Heavy Pick/Warhammer)"',
  'Elf':
    'Features="Elf Ability Adjustment","Elven Magic","Keen Senses",' +
    '"Low-Light Vision","Resist Enchantment","Sleep Immunity",' +
    '"Weapon Familiarity (Elven Curve Blade)",' +
    '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Longsword/Rapier/Shortbow)"',
  'Gnome':
    'Features="Defensive Training","Gnome Ability Adjustment",' +
    '"Gnome Hatred","Gnome Magic","Keen Senses","Low-Light Vision",' +
    '"Natural Spells",Obsessive,"Resist Illusion",Slow,Small,' +
    '"Weapon Familiarity (Gnome Hooked Hammer)"',
  'Half-Elf':
    'Features=Adaptability,"Elf Blood","Half-Elf Ability Adjustment",' +
    '"Keen Senses","Low-Light Vision",Multitalented,"Resist Enchantment",' +
    '"Sleep Immunity"',
  'Half-Orc':
    'Features=Darkvision,"Half-Orc Ability Adjustment",Intimidating,' +
    '"Orc Blood","Orc Ferocity","Weapon Familiarity (Orc Double Axe)"' +
    '"Weapon Proficiency (Falchion/Greataxe)"',
  'Halfling':
  'Features=Fearless,"Halfling Ability Adjustment","Halfling Luck",' +
    '"Keen Senses",Slow,Small,Sure-Footed,' +
    '"Weapon Familiarity (Halfling Sling Staff)""Weapon Proficiency (Sling)"',
  'Human':
    'Features="Human Ability Adjustment"'
};
Pathfinder.SCHOOLS = Object.assign({}, SRD35.SCHOOLS);
Pathfinder.SHIELDS = Object.assign({}, SRD35.SHIELDS);
Pathfinder.SKILLS = Object.assign({}, SRD35.SKILLS, {
  'Acrobatics':'Ability=dexterity Class=Barbarian,Bard,Monk,Rogue',
  'Appraise':'Ability=intelligence Class=Bard,Cleric,Rogue,Sorcerer,Wizard',
  'Bluff':'Ability=charisma Class=,Bard,Rogue,Sorcerer',
  'Climb':'Ability=strength Class=Barbarian,Bard,Druid,Fighter,Monk,Rogue',
  'Craft (Armor)':'Ability=intelligence',
  'Diplomacy':'Ability=charisma Class=Bard,Cleric,Paladin,Rogue',
  'Disable Device':'Ability=dexterity Untrained=n Class=Rogue',
  'Disguise':'Ability=charisma Class=Bard,Rogue',
  'Escape Artist':'Ability=dexterity Class=Bard,Monk,Rogue',
  'Fly':'Ability=dexterity Class=Druid,Sorcerer,Wizard',
  'Handle Animal':
    'Ability=charisma Untrained=n Class=,Barbarian,Druid,Fighter,Paladin,Rogue',
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
    'Ability=wisdom Untrained=n Class=Bard,Cleric,Druid,Fighter,Monk,Paladin,Ranger,Rogue,Sorcerer,Wizard',
  'Ride':'Ability=dexterity Class=Barbarian,Druid,Fighter,Monk,Paladin,Ranger',
  'Sense Motive':'Ability=wisdom Class=Bard,Cleric,Monk,Paladin,Rogue',
  'Sleight Of Hand':'Ability=dexterity Untrained=n Class=Bard,Rogue',
  'Spellcraft':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Druid,Paladin,Ranger,Sorcerer,Wizard',
  'Stealth':'Ability=dexterity Class=Bard,Monk,Ranger,Rogue',
  'Survival':'Ability=wisdom Class=Barbarian,Druid,Fighter,Ranger',
  'Swim':'Ability=strength Class=Barbarian,Druid,Fighter,Monk,Ranger,Rogue',
  'Use Magic Device':'Ability=charisma Untrained=n Class=Bard,Rogue,Sorcerer'
});
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
Pathfinder.TRACKS = ['Slow', 'Medium', 'Fast'];
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
  'Bolas':'Level=3 Category=R Damage=d4 Range=10',
  'Blowgun':'Level=1 Category=R Damage=d2 Range=20',
  'Elven Curve Blade':'Level=3 Category=2h Damage=d10 Threat=18',
  'Halfling Sling Staff':'Level=3 Category=R Damage=d8 Crit=3 Range=80',
  'Sai':'Level=3 Category=Li Damage=d4', // removed range
  'Starknife':'Level=2 Category=Li Damage=d4 Crit=3 Range=20'
});
Pathfinder.CLASSES = {
  'Barbarian':
    'Require="alignment !~ /Lawful/" ' +
    'HitDie=d12 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)","1:Fast Movement",1:Rage,' +
      '"2:Uncanny Dodge","3:Trap Sense","5:Improved Uncanny Dodge",' +
      '"7:Damage Reduction","11:Greater Rage","14:Indomitable Will",' +
      '"17:Tireless Rage","20:Mighty Rage" ' +
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
    'CasterLevelArcane=Level ' +
    'SpellAbility=charisma ' +
    'SpellsPerDay=' +
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
      '"1:Weapon Proficiency (Simple)",1:Aura,"1:Channel Energy",' +
      '"1:Cleric Domains","1:Spontaneous Cleric Spell" ' +
    'Selectables=' +
      QuilvynUtils.getKeys(Pathfinder.DOMAINS).map(x => '"1:' + x + ' Domain"').join(',') + ' ' +
    'CasterLevelDivine=Level ' +
    'SpellAbility=wisdom ' +
    'SpellsPerDay=' +
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
      'Dom1:1=1,' +
      'Dom2:3=1,' +
      'Dom3:5=1,' +
      'Dom4:7=1,' +
      'Dom5:9=1,' +
      'Dom6:11=1,' +
      'Dom7:13=1,' +
      'Dom8:15=1,' +
      'Dom9:17=1 ' +
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
    'Require="alignment =~ /Neutral/","armor =~ /None|Hide|Leather|Padded/","shield =~ /None|Wooden/" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Club/Dagger/Dart/Quarterstaff/Scimitar/Scythe/Sickle/Shortspear/Sling/Spear)",' +
      '"1:Nature Sense","1:Spontaneous Druid Spell","1:Wild Empathy",' +
      '"2:Woodland Stride","3:Trackless Step","4:Resist Nature\'s Lure",' +
      '"4:Wild Shape","9:Venom Immunity","13:Thousand Faces",' +
      '"15:Timeless Body" ' +
    'Selectables=' +
      '"1:Animal Companion","1:Nature Domains" ' +
    'SpellAbility=wisdom ' +
    'SpellsPerDay=' +
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
      '"1:Armor Proficiency (Heavy)","Shield Proficiency (Tower)",' +
      '"1:Weapon Proficiency (Martial)","2:Bravery","3:Armor Training",' +
      '"5:Weapon Training","19:Armor Mastery","20:Weapon Mastery"',
  'Monk':
    'Require="alignment =~ /Lawful/" Imply="armor == \'None\'","shield == \'None\'" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Handaxe/Heavy Crossbow/Javelin/Kama/Light Crossbow/Nunchaku/Quarterstaff/Sai/Shortspear/Short Sword/Shuriken/Siangham/Sling/Spear)",' +
      '"1:Flurry Of Blows","1:Improved Unarmed Strike",' +
      '"1:Two-Weapon Fighting","1:Stunning Fist",2:Evasion,' +
      '"3:Fast Movement","3:Maneuver Training","3:Still Mind","4:Ki Dodge",' +
      '"4:Ki Pool","4:Ki Speed","4:Ki Strike","4:Slow Fall","5:High Jump",' +
      '"5:Purity Of Body","7:Wholeness Of Body","8:Condition Fist",' +
      '"8:Improved Two-Weapon Fighting","9:Improved Evasion",' +
      '"11:Diamond Body","12:Abundant Step","13:Diamond Soul",' +
      '"15:Greater Two-Weapon Fighting","15:Quivering Palm",' +
      '"17:Timeless Body","17:Tongue Of The Sun And Moon","19:Empty Body",' +
      '"20:Perfect Self" ' +
    'Selectables=' +
      '"1:Catch Off-Guard","1:Combat Reflexes","1:Deflect Arrows","1:Dodge",' +
      '"1:Improved Grapple","1:Scorpion Style","1:Throw Anything",' +
      '"6:Gorgon\'s Fist","6:Improved Bull Rush","6:Improved Disarm",' +
      '"6:Improved Feint","6:Improved Trip","6:Mobility",' +
      '"10:Improved Critical","10:Medusa\'s Wrath","10:Snatch Arrows",' +
      '"10:Spring Attack"',
  // TODO Improved Critical subfeats
  'Paladin':
    'Require="alignment == \'Lawful Good\'" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",1:Aura,"1:Detect Evil",' +
      '"1:Smite Evil","2:Divine Grace","2:Lay On Hands","3:Aura Of Courage",' +
      '"3:Divine Health",3:Mercy,"4:Channel Energy","8:Aura Of Resolve",' +
      '"14:Aura Of Faith","17:Aura Of Righteousness","17:Resist Evil",' +
      '"20:Holy Champion" ' +
    'Selectables=' +
      '"5:Divine Mount","5:Divine Weapon" ' +
    'SpellAbility=charisma ' +
    'SpellsPerDay=' +
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
      '"1:Weapon Proficiency (Martial)","1:Favored Enemy",1:Track,' +
      '"1:Wild Empathy",3:Endurance,"3:Favored Terrain","7:Woodland Stride",' +
      '"8:Swift Tracker",9:Evasion,11:Quarry,12:Camouflage,' +
      '"16:Improved Evasion","17:Hide In Plain Sight","19:Improved Quarry",' +
      '"20:Master Hunter" ' +
    'Selectables=' +
      '"2:Combat Style (Archery)","2:Combat Style (Two-Weapon Combat)",' +
      '"2:Far Shot","2:Point-Blank Shot","2:Precise Shot","2:Rapid Shot",' +
      '"2:Double Slice","2:Improved Shield Bash","2:Quick Draw",' +
      '"2:Two-Weapon Fighting","4:Animal Companion","4:Companion Bond",' +
      '"6:Improved Precise Shot",6:Manyshot,6:Improved Two-Weapon Fighting",' +
      '"6:Two-Weapon Defense","10:Pinpoint Targeting","10:Shot On The Run",' +
      '"10:Greater Two-Weapon Fighting","10:Two-Weapon Rend ' +
    'SpellAbility=wisdom ' +
    'SpellsPerDay=' +
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
  // TODO Combat Style requirements for selectables
  'Rogue':
    'HitDie=d8 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple/Hand Crossbow/Rapier/Shortbow/Short Sword)",' +
      '"1:Sneak Attack",1:Trapfinding,2:Evasion,"3:Trap Sense",' +
      '"4:Uncanny Dodge","8:Improved Uncanny Dodge","20:Master Strike" ' +
    'Selectables=' +
      '"2:Bleeding Attack","2:Combat Trick","2:Fast Stealth",' +
      '"2:Finesse Rogue","2:Ledge Walker","2:Major Magic","2:Minor Magic",' +
      '"2:Quick Disable2",2:Resiliency,"2:Rogue Crawl","2:Slow Reactions",' +
      '"2:Stand Up","2:Surprise Attack","2:Trap Spotter",' +
      '"2:Rogue Weapon Training","10:Crippling Strike","10:Defensive Roll",' +
      '"10:Dispelling Attack","10:Feat Bonus","10:Improved Evasion",' +
      '10:Opportunist,"10:Skill Mastery","10:Slippery Mind"',
  // TODO Dispelling Attack requires Major Magic requires Minor Magic
  'Sorcerer':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",1:Bloodline,"1:Eschew Materials" ' +
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
      '"1:Bonded Object",1:Familiar ' +
    'SpellAbility=charisma ' +
    'SpellsPerDay=' +
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
      '"1:Hand Of The Apprentice","1:Scribe Scroll",' +
      '"1:Wizard Specialization","8:Metamagic Mastery" ' +
    'Selectables=' +
      '"1:Bonded Object",1:Familiar ' +
    'SpellAbility=intelligence ' +
    'SpellsPerDay=' +
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

Pathfinder.tracksThreshholds = {
  '3.5':[
    0, 1, 3, 6, 10, 15, 21, 28, 36, 45,
    55, 66, 78, 91, 105, 120, 136, 153, 171, 190
  ],
  'Fast':[
    0, 1.3, 3.3, 6, 10, 15, 23, 34, 50, 71,
    105, 145, 210, 295, 425, 600, 850, 1200, 1700, 2400
  ],
  'Medium':[
    0, 2, 5, 9, 15, 23, 35, 51, 75, 105,
    155, 220, 315, 445, 635, 890, 1300, 1800, 2550, 3600
  ],
  'Slow':[
    0, 3, 7.5, 14, 23, 35, 53, 77, 115, 160,
    235, 330, 475, 665, 955, 1350, 1900, 2700, 3850, 5350
  ]
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
  // Override intelligence skillPoint adjustment
  rules.defineRule
    ('skillNotes.intelligenceSkillPointsAdjustment', 'level', '*', null);
  // NOTE: Using SRD35.abilityRules above adds SRD35 minimum ability checks
  // (at least one ability > 13, ability modifiers must sum to > 0), that are
  // not part of the Pathfinder rules.
};

/* Defines rules related to animal companions and familiars. */
Pathfinder.aideRules = function(rules, companions, familiars) {
  SRD35.aideRules(rules, companions, familiars);
  // Override SRD35 HD calculation
  rules.defineRule('animalCompanionStats.HD',
    'companionLevel', '=', 'null',
    'companionMasterLevel', '=', 'source + 1 - Math.floor((source+1)/4)'
  );
  // Pathfinder-specific attributes
  rules.defineRule('animalCompanionStats.Feats',
    'companionMasterLevel', '=',
    'source >= 18 ? 8 : source >= 10 ? Math.floor((source + 5) / 3) : ' +
    'Math.floor((source + 4) / 3)'
  );
  rules.defineRule('animalCompanionStats.Skills',
    'companionMasterLevel', '=',
    'source + 1 - Math.floor((source + 1) / 4)'
  );
  rules.defineRule('companionBAB',
    'animalCompanionStats.HD', '=', SRD35.ATTACK_BONUS_3_4
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
};

/* Defines rules related to combat. */
Pathfinder.combatRules = function(rules, armors, shields, weapons) {
  SRD35.combatRules(rules, armors, shields, weapons);
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
  rules, alignments, bloodlines, classes, deities, domains, factions, genders,
  races, traits
) {
  for(var alignment in alignments) {
    rules.choiceRules(rules, 'alignments', alignment, alignments[alignment]);
  }
  for(var bloodline in bloodlines) {
    rules.choiceRules(rules, 'bloodlines', bloodline, bloodlines[bloodline]);
  }
  for(var clas in classes) {
    rules.choiceRules(rules, 'levels', clas, classes[clas]);
  }
  for(var deity in deities) {
    rules.choiceRules(rules, 'deities', deity, deities[deity]);
  }
  for(var domain in domains) {
    rules.choiceRules(rules, 'domains', domain, domains[domain]);
  }
  for(var faction in factions) {
    rules.choiceRules(rules, 'factions', faction, factions[faction]);
  }
  for(var gender in genders) {
    rules.choiceRules(rules, 'genders', gender, genders[gender]);
  }
  for(var race in races) {
    rules.choiceRules(rules, 'races', race, races[race]);
  }
  for(var trait in traits) {
    rules.choiceRules(rules, 'traits', trait, traits[trait]);
  }
  rules.defineEditorElement('traits', 'Traits', 'set', 'traits', 'skills');
  rules.defineSheetElement('Traits', 'Feats+', null, '; ');
  rules.defineChoice('extras', 'traits');
  // NOTE: Our rule engine doesn't support indexing into an array. Here, we work
  // around this limitation by defining rules that set a global array as a side
  // effect, then indexing into that array.
  rules.defineRule('experienceNeeded',
    'level', '=', 'Pathfinder.tracksThreshholds["Current"] ? Pathfinder.tracksThreshholds["Current"][source] * 1000 : null'
  );
  rules.defineRule('level',
    '', '=', '(Pathfinder.tracksThreshholds["Current"] = Pathfinder.tracksThreshholds["Medium"]) ? 1 : 1',
    'experienceTrack', '=', '(Pathfinder.tracksThreshholds["Current"] = Pathfinder.tracksThreshholds[source]) ? 1 : 1',
    'experience', '=', 'Pathfinder.tracksThreshholds["Current"] ? Pathfinder.tracksThreshholds["Current"].findIndex(item => item * 1000 > source) : 1'
  );
  rules.defineRule('casterLevel',
    'casterLevelArcane', '=', null,
    'casterLevelDivine', '+=', null
  );
  SRD35.validAllocationRules(rules, 'level', 'level', /^levels\./);
};

/* Defines rules related to magic use. */
Pathfinder.magicRules = function(rules, schools, spells) {
  SRD35.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines rules related to character feats, languages, and skills. */
Pathfinder.talentRules = function(rules, feats, features, languages, skills) {
  SRD35.talentRules(rules, feats, features, languages, skills);
  // Override SRD35 feat count computation and max ranks per skill
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');
  rules.defineRule('maxAllowedSkillAllocation', 'level', '=', null);
  // Override armor skill check penalty and disable armor swim check penalty
  rules.defineChoice
    ('notes', 'skillNotes.armorSkillCheckPenalty:-%V Dex- and Str-based skills');
  rules.defineRule('skillNotes.armorSwimCheckPenalty', '', '?', 'false');
  // Define non-subfeat features for validation purposes
  rules.defineRule
    ('features.Weapon Focus', /features.Weapon Focus \(/, '=', '1');
  rules.defineRule('features.Greater Weapon Focus',
    /features.Greater Weapon Focus \(/, '=', '1'
  );
};

/*
 * TODO
 */
Pathfinder.choiceEditorElements = function(rules, type) {
  var result = [];
  if(type == 'factions')
    result.push(
      // empty
    );
  else if(type == 'traits')
    result.push(
      ['type', 'Type', 'select-one', ['Basic', 'Campaign', 'Faction', 'Race', 'Regional', 'Religion']],
      ['subtype', 'Subtype', 'text', [20]]
    );
  else
    return SRD35.choiceEditorElements(rules, type);
  return result
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Pathfinder.choiceRules = function(rules, type, name, attrs) {
  if(type == 'alignments')
    Pathfinder.alignmentRules(rules, name);
  else if(type == 'animalCompanions')
    Pathfinder.companionRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'bloodlines') {
    Pathfinder.bloodlineRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Feats'),
      QuilvynUtils.getAttrValueArray(attrs, 'skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder.SPELLS
    );
    Pathfinder.bloodlineRulesExtra(rules, name);
  } else if(type == 'armors')
    Pathfinder.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'deities')
    Pathfinder.deityRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'domains') {
    Pathfinder.domainRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder.SPELLS
    );
    Pathfinder.domainRulesExtras(rules, name);
  } else if(type == 'factions')
    Pathfinder.factionRules(rules, name,
    );
  else if(type == 'familiars')
    Pathfinder.familiarRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'feats') {
    Pathfinder.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Type'),
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply')
    );
    Pathfinder.featRulesExtra(rules, name);
  } else if(type == 'features')
    Pathfinder.featureRules(rules, name, attrs);
  else if(type == 'genders')
    Pathfinder.genderRules(rules, name);
  else if(type == 'languages')
    Pathfinder.languageRules(rules, name);
  else if(type == 'levels') {
    Pathfinder.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValue(attrs, 'SkillPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Fortitude'),
      QuilvynUtils.getAttrValue(attrs, 'Reflex'),
      QuilvynUtils.getAttrValue(attrs, 'Will'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsPerDay'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Pathfinder.SPELLS
    );
    Pathfinder.classRulesExtra(rules, name);
  } else if(type == 'races') {
    Pathfinder.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    Pathfinder.raceRulesExtra(rules, name);
  } else if(type == 'schools')
    Pathfinder.schoolRules(rules, name);
  else if(type == 'shields')
    Pathfinder.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'skills') {
    var untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    Pathfinder.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained != 'n' && untrained != 'N',
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
    Pathfinder.skillRulesExtra(rules, name);
  } else if(type == 'spells') {
    ; // empty -- handled by classes and domains
  } else if(type == 'traits')
    Pathfinder.traitRules(rules, name);
  else if(type == 'weapons')
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
  if(type != 'spells' && type != 'features')
    rules.addChoice(type, name, attrs);
};

/* Defines in #rules# the rules associated with alignment #name#. */
Pathfinder.alignmentRules = function(rules, name) {
  SRD35.alignmentRules(rules, name);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, imposes
 * #skillPenalty# on specific skills and yields a #spellFail# percent chance of
 * arcane spell failure.
 */
Pathfinder.armorRules = function(
  rules, name, ac, profLevel, maxDex, skillPenalty, spellFail
) {
  SRD35.armorRules(rules, name, ac, profLevel, maxDex, skillPenalty, spellFail);
  // Disable armor swim check note
  rules.defineRule
    ('skillNotes.armorSwimCheckPenaltyFeature', 'level', '^', '0');
};

/*
 * TODO
 */
Pathfinder.bloodlineRules = function(
  rules, name, features, feats, skills, spells, spellDict
) {

  var bloodlineLevelAttr = 'bloodlineLevel.' + name;
  rules.defineRule(bloodlineLevelAttr,
    'features.Bloodline ' + name, '?', null,
    'levels.Sorcerer', '=', null
  );

  for(var i = 0; i < features.length; i++) {
    var matchInfo = features[i].match(/^((\d+):)?(.*)$/);
    var feature = matchInfo ? matchInfo[3] : features[i];
    var level = matchInfo ? matchInfo[2] : 1;
    if(level == 1)
      rules.defineRule('sorcererFeatures.' + feature,
        bloodlineLevelAttr, '=', '1'
      );
    else
      rules.defineRule('sorcererFeatures.' + feature,
        bloodlineLevelAttr, '=', 'source >= ' + level + ' ? 1 : null'
      );
    rules.defineRule
      ('features.' + feature, 'sorcererFeatures.' + feature, '+=', null);
  }

  rules.defineRule('featCount.' + name,
    bloodlineLevelAttr, '=', 'source >= 7 ? Math.floor((source - 1) / 6) : null'
  );
  for(var i = 0; i < feats.length; i++) {
    feats[i] += ':' + name;
    Pathfinder.featRules(rules, feats[i], name, [], []);
  }

  var note = skills.join(' is a class skill/') + ' is a class skill';
  Pathfinder.featureRules(rules, 'Bloodline ' + name, 'skill:' + note);

  for(var i = 0; i < spells.length; i++) {
    var matchInfo = spells[i].match(/^((\d+):)?(.*)$/);
    var spellName = matchInfo ? matchInfo[3] : features[i];
    var level = matchInfo ? matchInfo[2] : 1;
    if(spellDict[spellName] == null) {
      console.log('Unknown spell "' + spellName + '"');
      continue;
    }
    var description =
      QuilvynUtils.getAttrValue(spellDict[spellName], 'description');
    var school = QuilvynUtils.getAttrValue(spellDict[spellName], 'School');
    var spell = spellName + '(W' + (i+1) + ' ' + school.substring(0, 4) + ')';
    Pathfinder.spellRules(rules, spell, school, 'W', i + 1, description);
    rules.defineRule('spells.' + spell,
      bloodlineLevelAttr, '=', 'source >= ' + level + ' ? 1 : null'
    );
  }

};

/*
 * Defines in #rules# the rules associated with bloodline #name# that are not
 * directly derived from the parmeters passed to bloodlineRules.
 */
Pathfinder.bloodlineRulesExtra = function(rules, name) {

  var bloodlineLevelAttr = 'bloodlineLevel.' + name;

  if(name == 'Abyssal' || name == 'Draconic') {
    rules.defineRule('clawsDamageLevel',
      'features.Claws', '=', '1',
      'features.Small', '+', '-1',
      'features.Large', '+', '1',
      bloodlineLevelAttr, '+', 'source >= 7 ? 1 : null'
    );
    rules.defineRule('combatNotes.clawsFeature',
      'clawsDamageLevel', '=',
      '["1d3", "1d4", "1d6", "1d8"][source]'
    );
    rules.defineRule('combatNotes.clawsFeature.1',
      'features.Claws', '?', null,
      'strengthModifier', '=', null
    );
    rules.defineRule('combatNotes.clawsFeature.2',
      'features.Claws', '?', null,
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule
      ('combatNotes.improvedClawsFeature', 'bloodlineEnergy', '=', null);
  }

  if(name == 'Aberrant') {

    rules.defineRule('combatNotes.longLimbsFeature',
      bloodlineLevelAttr, '=', 'source >= 17 ? 15 : source >= 11 ? 10 : 5'
    );
    rules.defineRule('combatNotes.unusualAnatomyFeature',
      bloodlineLevelAttr, '=', 'source >= 13 ? 50 : 25'
    );
    rules.defineRule('magicNotes.acidicRayFeature',
      bloodlineLevelAttr, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.acidicRayFeature.1',
      'features.Acidic Ray', '?', null,
      'charismaModifier', '=', '1 + source'
    );
    rules.defineRule('saveNotes.alienResistanceFeature',
      bloodlineLevelAttr, '=', 'source + 10'
    );

  } else if(name == 'Abyssal') {

    rules.defineRule('abilityNotes.strengthOfTheAbyssFeature',
      bloodlineLevelAttr, '=', 'source >= 17 ? 6 : source >= 13 ? 4 : 2'
    );
    rules.defineRule('magicNotes.bloodlineAbyssalFeature',
      bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('saveNotes.demonResistancesFeature',
      bloodlineLevelAttr, '=', 'source>=20 ? "immune" : source>=9 ? 10 : 5'
    );
    rules.defineRule('saveNotes.demonResistancesFeature.1',
      bloodlineLevelAttr, '=', 'source>=20 ? "immune" : source>=9 ? "+4" : "+2"'
    );

  } else if(name == 'Arcane') {

    rules.defineRule('familiarSorcererLevel',
      'sorcererFeatures.Familiar', '?', null,
      'levels.Sorcerer', '=', null
    );
    rules.defineRule('familiarLevel',
      'familiarSorcererLevel', '+=', 'Math.floor((source+1) / 2)'
    );
    rules.defineRule
      ('familiarMasterLevel', 'familiarSorcererLevel', '+=', null)
    rules.defineRule
      ('selectableFeatureCount.Sorcerer', bloodlineLevelAttr, '+', '1');
    rules.defineRule('magicNotes.metamagicAdeptFeature',
      bloodlineLevelAttr, '=', 'source >= 20 ? "any" : Math.floor((source+1)/4)'
    );
    rules.defineRule('magicNotes.newArcanaFeature',
      bloodlineLevelAttr, '=', 'Math.floor((source - 5) / 4)'
    );
    SRD35.testRules
      (rules, 'validation', 'sorcerer-BondedObjectSelectableFeatureFeature', 'levels.' + name, ['Requires Bloodline Arcane']);
    SRD35.testRules
      (rules, 'validation', 'sorcerer-FamiliarSelectableFeatureFeature', 'levels.' + name, ['Requires Bloodline Arcane']);

  } else if(name == 'Celestial') {

    rules.defineRule('abilityNotes.wingsOfHeavenFeature',
      bloodlineLevelAttr, '=', 'source >= 20 ? "any" : source'
    );
    rules.defineRule('magicNotes.bloodlineCelestialFeature',
      bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.heavenlyFireFeature',
      bloodlineLevelAttr, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.heavenlyFireFeature.1',
      'features.Heavenly Fire', '?', null,
      'charismaModifier', '=', '1 + source'
    );
    rules.defineRule('saveNotes.celestialResistancesFeature',
      bloodlineLevelAttr, '=', 'source>=20 ? "immune" : source>=9 ? "+10":"+5"'
    );

  } else if(name == 'Destined') {

    rules.defineRule('featureNotes.itWasMeantToBeFeature',
      bloodlineLevelAttr, '=', 'Math.floor((source - 1) / 8)'
    );
    rules.defineRule('magicNotes.touchOfDestinyFeature',
      bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.touchOfDestinyFeature.1',
      'features.Touch Of Destiny', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('saveNotes.fatedFeature',
      bloodlineLevelAttr, '=', 'Math.floor((source + 1) / 4)'
    );

  } else if(name == 'Draconic') {

    rules.defineRule
      ('abilityNotes.wingsFeature', bloodlineLevelAttr, '^=', null);
    rules.defineRule
      ('combatNotes.breathWeaponFeature', bloodlineLevelAttr, '=', null);
    rules.defineRule('combatNotes.breathWeaponFeature.1',
      'features.Breath Weapon', '?', null,
      bloodlineLevelAttr, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.breathWeaponFeature.2',
      'features.Breath Weapon', '?', null,
      bloodlineLevelAttr, '=', 'source >= 20 ? 3 : source >= 17 ? 2 : 1'
    );
    rules.defineRule('combatNotes.breathWeaponFeature.3',
      'features.Breath Weapon', '?', null,
      'bloodlineBreath', '=', null
    );
    rules.defineRule('combatNotes.breathWeaponFeature.4',
      'features.Breath Weapon', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule('combatNotes.dragonResistancesFeature',
      bloodlineLevelAttr, '=', 'source >= 15 ? 4 : source >= 10 ? 2 : 1'
    );
    rules.defineRule('saveNotes.dragonResistancesFeature',
      bloodlineLevelAttr, '=', 'source >= 20 ? "Immune" : source >= 9 ? 10 : 5'
    );
    rules.defineRule('saveNotes.dragonResistancesFeature.1',
      'features.Dragon Resistances', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule
      ('featureNotes.blindsenseFeature', bloodlineLevelAttr, '^=', '60');
    rules.defineRule('magicNotes.bloodlineDraconicFeature',
      'bloodlineEnergy', '=', null
    );

  } else if(name == 'Elemental') {

    rules.defineRule
      ('abilityNotes.elementalMovementFeature', 'bloodlineMovement', '=', null);
    rules.defineRule
      ('combatNotes.elementalBlastFeature', bloodlineLevelAttr, '=', null);
    rules.defineRule('combatNotes.elementalBlastFeature.1',
      'features.Elemental Blast', '?', null,
      bloodlineLevelAttr, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.elementalBlastFeature.2',
      'features.Elemental Blast', '?', null,
      bloodlineLevelAttr, '=', 'source >= 20 ? 3 : source >= 17 ? 2 : 1'
    );
    rules.defineRule('combatNotes.elementalBlastFeature.3',
      'features.Elemental Blast', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule('features.Bloodline Elemental',
      bloodlineLevelAttr, '=', '1'
    );
    rules.defineRule('magicNotes.elementalRayFeature',
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.elementalRayFeature.1',
      'features.Elemental Ray', '?', null,
      bloodlineLevelAttr, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.elementalRayFeature.2',
      'features.Elemental Ray', '?', null,
      'bloodlineEnergy', '=', null
    );
    rules.defineRule('saveNotes.elementalBodyFeature',
      'bloodlineEnergy', '=', null
    );
    rules.defineRule('saveNotes.elementalResistanceFeature',
      bloodlineLevelAttr, '=', 'source >= 20 ? "Immune" : source >= 9 ? 20 : 10'
    );
    rules.defineRule('saveNotes.elementalResistanceFeature.1',
      'features.Elemental Resistance', '?', null,
      'bloodlineEnergy', '=', null
    );

  } else if(name == 'Fey') {

    rules.defineRule
      ('magicNotes.fleetingGlanceFeature', bloodlineLevelAttr, '=', null);
    rules.defineRule('magicNotes.laughingTouchFeature',
      'charismaModifier', '=', 'source + 3'
    );

  } else if(name == 'Infernal') {

    rules.defineRule('magicNotes.corruptingTouchFeature',
      bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.corruptingTouchFeature.1',
      'features.Corrupting Touch', '?', null,
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule
      ('magicNotes.hellfireFeature', bloodlineLevelAttr, '=', null);
    rules.defineRule('magicNotes.hellfireFeature.1',
      'features.Hellfire', '?', null,
      bloodlineLevelAttr, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.hellfireFeature.2',
      'features.Hellfire', '?', null,
      bloodlineLevelAttr, '=', null
    );
    rules.defineRule('magicNotes.hellfireFeature.3',
      'features.Hellfire', '?', null,
      bloodlineLevelAttr, '=', 'source >= 20 ? 3 : source >= 17 ? 2 : 1'
    );
    rules.defineRule('saveNotes.infernalResistancesFeature',
      bloodlineLevelAttr, '=', 'source>=20 ? "immune" : source>=9 ? "+10":"+5"'
    );
    rules.defineRule('saveNotes.infernalResistancesFeature.1',
      bloodlineLevelAttr, '=', 'source>=20 ? "immune" : source>=9 ? "+4" : "+2"'
    );

  } else if(name == 'Undead') {

    rules.defineRule
      ('magicNotes.graspOfTheDeadFeature', bloodlineLevelAttr, '=', null);
    rules.defineRule('magicNotes.graspOfTheDeadFeature.1',
      'features.Grasp Of The Dead', '?', null,
      bloodlineLevelAttr, '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.graspOfTheDeadFeature.2',
      'features.Grasp Of The Dead', '?', null,
      bloodlineLevelAttr, '=', 'source >= 20 ? 3 : source >= 17 ? 2 : 1'
    );
    rules.defineRule('magicNotes.graveTouchFeature',
      bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.graveTouchFeature.1',
      'features.Grave Touch', '?', null,
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule
      ('magicNotes.incorporealFormFeature', bloodlineLevelAttr, '=', null);
    rules.defineRule("saveNotes.death'sGiftFeature",
      bloodlineLevelAttr, '=', 'source >= 20 ? "Immune" : source >= 9 ? 10 : 5'
    );
    rules.defineRule("saveNotes.death'sGiftFeature.1",
      "features.Death's Gift", '?', null,
      bloodlineLevelAttr, '=', 'source >= 20 ? "Immune" : source >= 9 ? 10 : 5'
    );

  }

};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires# and soft prerequisites #implies#. The class
 * grants #hitDie# (format [n]'d'n) additional hit points and #skillPoint#
 * additional skill points with each level advance. #attack# is one of '1',
 * '1/2', or '3/4', indicating the base attack progression for the class;
 * similarly, #saveFort#, #saveRef#, and #saveWill# are each one of '1/2' or
 * '1/3', indicating the saving through progressions. #skills# indicate class
 * skills for the class (but see also skillRules for an alternate way these can
 * be defined). #features# and #selectables# list the features and selectable
 * features acquired as the character advances in class level.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * expression for determining the caster level for the class; within these
 * expressions the text "Level" indicates class level. #spellAbility#, if
 * specified, contains the base ability for computing spell difficulty class
 * for cast spells. #spellsPerDay# lists the number of spells per day that the
 * class can cast, and #spells# lists spells defined by the class.
 */
Pathfinder.classRules = function(
  rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
  saveRef, saveWill, skills, features, selectables, casterLevelArcane,
  casterLevelDivine, spellAbility, spellsPerDay, spells, spellDict
) {
  SRD35.classRules(
    rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
    saveRef, saveWill, skills, features, selectables, casterLevelArcane,
    casterLevelDivine, spellAbility, spellsPerDay, spells, spellDict
  );
  // Override SRD35 skillPoints rule
  rules.defineRule
    ('skillPoints', 'levels.' + name, '+', 'source * ' + skillPoints);
};

/*
 * Defines in #rules# the rules associated with class #name# that are not
 * directly derived from the parmeters passed to classRules.
 */
Pathfinder.classRulesExtra = function(rules, name) {

  if(name == 'Barbarian') {

    rules.defineRule
      ('abilityNotes.fastMovementFeature', 'levels.Barbarian', '+=', '10');
    rules.defineRule('combatNotes.animalFuryFeature',
      '', '=', '"1d4"',
      'features.Large', '=', '"1d6"',
      'features.Small', '=', '"1d3"'
    );
    rules.defineRule('combatNotes.animalFuryFeature.1',
      'features.Animal Fury', '?', null,
      'strengthModifier', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.knockbackFeature',
      'strengthModifier', '=', 'source + 2'
    );
    rules.defineRule('combatNotes.guardedStanceFeature',
      'constitutionModifier', '=', 'Math.max(source, 1)',
      'levels.Barbarian', '+', 'Math.floor(source / 6)'
    );
    rules.defineRule('combatNotes.powerfulBlowFeature',
      'levels.Barbarian', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.rageFeature',
      'constitutionModifier', '=', '4 + source',
      'levels.Barbarian', '+', '(source - 1) * 2'
    );
    rules.defineRule('combatNotes.rollingDodgeFeature',
      'levels.Barbarian', '=', '1 + Math.floor(source / 6)'
    );
    rules.defineRule('combatNotes.rollingDodgeFeature.1',
      'features.Rolling Dodge', '?', null,
      'constitutionModifier', '=', 'Math.max(1, source)'
    );
    rules.defineRule('combatNotes.strengthSurgeFeature',
      'levels.Barbarian', '=', null
    );
    rules.defineRule('combatNotes.surpriseAccuracyFeature',
      'levels.Barbarian', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.terrifyingHowlFeature',
      'levels.Barbarian', '=', '10 + Math.floor(source / 2)',
      'strengthModifier', '+', null
    );
    rules.defineRule('magicNotes.renewedVigorFeature',
      'levels.Barbarian', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('magicNotes.renewedVigorFeature.1',
      'features.Renewed Vigor', '?', null,
      'constitutionModifier', '=', 'source + 2'
    );
    rules.defineRule('selectableFeatureCount.Barbarian',
      'levels.Barbarian', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.superstitionFeature',
      'levels.Barbarian', '=', '2 + Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.trapSenseFeature',
      'levels.Barbarian', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
    );
    rules.defineRule
      ('skillNotes.ragingClimberFeature', 'levels.Barbarian', '=', null);
    rules.defineRule
      ('skillNotes.ragingLeaperFeature', 'levels.Barbarian', '=', null);
    rules.defineRule
      ('skillNotes.ragingSwimmerFeature', 'levels.Barbarian', '=', null);
    rules.defineRule('barbarianFeatures.Improved Uncanny Dodge',
      'barbarianFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodgeFeature',
      'levels.Barbarian', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Barbarian', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Bard') {

    rules.defineRule('featureNotes.bardicPerformanceFeature',
      'levels.Bard', '+=', '2 + 2 * source',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.simpleSomaticsFeature.1', 'v', '0'
    );
    rules.defineRule('magicNotes.deadlyPerformanceFeature',
      'levels.Bard', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.fascinateFeature',
      'levels.Bard', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.fascinateFeature.1',
      'levels.Bard', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.frighteningTuneFeature',
      'levels.Bard', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.inspireCompetenceFeature',
      'levels.Bard', '+=', '1 + Math.floor((source + 1) / 4)'
    );
    rules.defineRule('magicNotes.inspireCourageFeature',
      'levels.Bard', '+=', '1 + Math.floor((source + 1) / 6)'
    );
    rules.defineRule('magicNotes.inspireGreatnessFeature',
      'levels.Bard', '+=', 'Math.floor((source - 6) / 3)'
    );
    rules.defineRule('magicNotes.inspireHeroicsFeature',
      'levels.Bard', '+=', 'Math.floor((source - 12) / 3)'
    );
    rules.defineRule('magicNotes.simpleSomaticsFeature.1',
      'magicNotes.simpleSomaticsFeature', '?', null,
      'wearingLightArmor', '=', null
    );
    rules.defineRule(/^skillModifier.Knowledge/,
      'skillNotes.bardicKnowledgeFeature', '+', null
    );
    rules.defineRule('skillNotes.bardicKnowledgeFeature',
      'levels.Bard', '+=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('skillNotes.loreMasterFeature',
      'levels.Bard', '+=', '1 + Math.floor((source + 1) / 6)'
    );

  } else if(name == 'Cleric') {

    rules.defineRule('magicNotes.channelEnergyFeature',
      'levels.Cleric', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.channelEnergyFeature.1',
      'features.Channel Energy', '?', null,
      'levels.Cleric', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.channelEnergyFeature.2',
      'features.Channel Energy', '?', null,
      'charismaModifier', '=', '3 + source'
    );
    rules.defineRule
      ('selectableFeatureCount.Cleric', 'levels.Cleric', '+=', '2');

  } else if(name == 'Druid') {

    rules.defineRule('languageCount', 'levels.Druid', '+', '1');
    rules.defineRule('languages.Druidic', 'levels.Druid', '=', '1');
    rules.defineRule('magicNotes.wildShapeFeature',
      'levels.Druid', '=',
        'source < 4 ? null : ' +
        'source < 6 ? "small-medium" : ' +
        'source < 8 ? "tiny-large/small elemental" : ' +
        'source < 10 ? "diminutive-huge/medium elemental" : ' +
        'source < 12 ? "diminutive-huge/large elemental/plant" : ' +
        '"diminutive-huge/elemental/plant"'
    );
    rules.defineRule
      ('magicNotes.wildShapeFeature.1', 'levels.Druid', '=', null);
    rules.defineRule('magicNotes.wildShapeFeature.2',
      'levels.Druid', '=', 'Math.floor((source - 2) / 2)'
    );
    rules.defineRule('selectableFeatureCount.Druid',
      'levels.Druid', '=', '1',
      // TODO
      'features.Nature Domains', '+', '1'
    );
    rules.defineRule('skillNotes.wildEmpathyFeature',
      'levels.Druid', '+=', null,
      'charismaModifier', '+', null
    );

    rules.defineRule('companionMasterLevelDruid',
      'druidFeatures.Animal Companion', '?', null,
      'levels.Druid', '=', null
    );
    rules.defineRule
      ('companionMasterLevel', 'companionMasterLevelDruid', '+=', null);

  } else if(name == 'Fighter') {

    rules.defineRule('abilityNotes.armorTrainingFeature',
      'levels.Fighter', '=', 'source >= 7 ? "heavy" : source >= 3 ? "medium" : null'
    );
/* TODO
    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'armorTrainingGap', '^', 'source >= 0 ? 0 : null'
    );
    rules.defineRule('armorTrainingGap',
      'armor', '+', '-SRD35.armorsProficiencyLevels[source]',
      'abilityNotes.armorTrainingFeature', '=', 'source == "heavy" ? SRD35.PROFICIENCY_HEAVY : SRD35.PROFICIENCY_MEDIUM'
    );
*/
    rules.defineRule
      ('armorClass', 'combatNotes.armorTrainingFeature', '+', null);
    rules.defineRule('combatManeuverDefense',
      'combatNotes.armorTrainingFeature', '+',null
    );
    rules.defineRule('combatNotes.armorTrainingFeature',
      'dexterityModifier', '=', null,
      'dexterityArmorClassAdjustment', '+', '-source',
      'levels.Fighter', 'v', 'Math.floor((source + 1) / 4)',
      '', '^', '0'
    );
    rules.defineRule('featCount.Fighter',
      'levels.Fighter', '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.braveryFeature',
      'levels.Fighter', '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('skillNotes.armorSkillCheckPenaltyFeature',
      'skillNotes.armorTrainingFeature', '+', '-source'
    );
    rules.defineRule('skillNotes.armorTrainingFeature',
      'levels.Fighter', '=', 'Math.floor((source + 1) / 4)'
    );

  } else if(name == 'Monk') {

    rules.defineRule('abilityNotes.fastMovementFeature',
      'levels.Monk', '+=', '10 * Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.flurryOfBlowsFeature',
      'attacksPerRound', '=', 'source + 1'
    );
    rules.defineRule('combatNotes.flurryOfBlowsFeature.1',
      'levels.Monk', '=', 'source - 2',
      'meleeAttack', '+', null,
      'baseAttack', '+', '-source'
    );
    rules.defineRule('combatNotes.kiStrikeFeature',
      'levels.Monk', '=',
      '"magic" + ' +
      '(source < 10 ? "" : "/lawful") + ' +
      '(source < 16 ? "" : "/adamantine")'
    )
    rules.defineRule('casterLevels.Dimension Door',
      'levels.Monk', '=', 'source < 12 ? null : Math.floor(source / 2)'
    );
    rules.defineRule('casterLevels.Etherealness',
      'levels.Monk', '=', 'source < 19 ? null : Math.floor(source / 2)'
    );
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calcuated even for non-Wizard Monks.
    rules.defineRule
      ('casterLevels.W', 'levels.Monk', '^=', 'source < 12 ? null : 1');
    rules.defineRule('combatNotes.conditionFist',
      'levels.Monk', '=', '"fatigued" + ' +
        '(source < 8 ? "" : "/sickened") + ' +
        '(source < 12 ? "" : "/staggered") + ' +
        '(source < 16 ? "" : "/blind/deafened") + ' +
        '(source < 20 ? "" : "/paralyzed")'
    );
    rules.defineRule('combatNotes.monkArmorClassAdjustment',
      'armor', '?', 'source == "None"',
      'levels.Monk', '+=', 'Math.floor(source / 4)',
      'wisdomModifier', '+', 'source > 0 ? source : null'
    );
    rules.defineRule('combatNotes.maneuverTrainingFeature',
      'levels.Monk', '=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('combatNotes.quiveringPalmFeature',
      'levels.Monk', '+=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.stunningFistFeature.1',
      'levels.Monk', '+', 'source - Math.floor(source / 4)'
    );
    rules.defineRule('featCount.Monk',
      'levels.Monk', '=', '1 + Math.floor((source + 2) / 4)'
    );
    rules.defineRule('featureNotes.kiPoolFeature',
      'levels.Monk', '=', 'Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule
      ('magicNotes.wholenessOfBodyFeature', 'levels.Monk', '=', null);
    rules.defineRule
      ('saveNotes.diamondSoulFeature', 'levels.Monk', '+=', '10 + source');
    rules.defineRule('saveNotes.slowFallFeature',
      'levels.Monk', '=',
      'source < 4 ? null : source < 20 ? Math.floor(source / 2) * 10 : "all"'
    );
    rules.defineRule('skillNotes.highJumpFeature', 'levels.Monk', '=', null);
    rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);
    // NOTE Our rule engine doesn't support modifying a value via indexing.
    // Here, we work around this limitation by defining rules that set global
    // values as a side effect, then use these values in our calculations.
    rules.defineRule('monkUnarmedDamage',
      'monkFeatures.Flurry Of Blows', '?', null, // Limit these rules to monks
      'levels.Monk', '=',
        'SRD35.weaponsSmallDamage["monk"] = ' +
        'SRD35.weaponsLargeDamage["monk"] = ' +
        'source < 12 ? ("d" + (6 + Math.floor(source / 4) * 2)) : ' +
        '              ("2d" + (6 + Math.floor((source - 12) / 4) * 2))',
      'features.Small', '=', 'SRD35.weaponsSmallDamage[SRD35.weaponsSmallDamage["monk"]]',
      'features.Large', '=', 'SRD35.weaponsLargeDamage[SRD35.weaponsLargeDamage["monk"]]'
    );

  } else if(name == 'Paladin') {

    rules.defineRule('combatNotes.auraOfRighteousnessFeature',
      'levels.Paladin', '=', 'source >= 20 ? 10 : 5'
    );
    rules.defineRule('combatNotes.divineWeaponFeature',
      'levels.Paladin', '=', 'Math.floor((source - 2) / 3)'
    );
    rules.defineRule
      ('combatNotes.divineWeaponFeature.1', 'levels.Paladin', '=', null);
    rules.defineRule('combatNotes.divineWeaponFeature.2',
      'levels.Paladin', '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('combatNotes.smiteEvilFeature',
      'charismaModifier', '=', 'source > 0 ? source : 0'
    );
    rules.defineRule
      ('combatNotes.smiteEvilFeature.1', 'levels.Paladin', '=', null);
    rules.defineRule('combatNotes.smiteEvilFeature.2',
      'features.Smite Evil', '?', null,
      'charismaModifier', '=', 'source > 0 ? source : 0'
    );
    rules.defineRule('combatNotes.smiteEvilFeature.3',
      'levels.Paladin', '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.channelEnergyFeature',
      'levels.Paladin', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.channelEnergyFeature.1',
      'levels.Paladin', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.channelEnergyFeature.2',
      'charismaModifier', '=', '3 + source'
    );
    rules.defineRule
      ('magicNotes.holyChampionFeature', 'levels.Paladin', '=', null);
    rules.defineRule('magicNotes.layOnHandsFeature',
      'levels.Paladin', '=', 'Math.floor(source / 2)'
    )
    rules.defineRule('magicNotes.layOnHandsFeature.1',
      'levels.Paladin', '=', 'Math.floor(source / 2)',
      'charismaModifier', '+', null
    )
    rules.defineRule
      ('save.Fortitude', 'saveNotes.divineGraceFeature', '+', null);
    rules.defineRule
      ('save.Reflex', 'saveNotes.divineGraceFeature', '+', null);
    rules.defineRule('save.Will', 'saveNotes.divineGraceFeature', '+', null);
    rules.defineRule
      ('saveNotes.divineGraceFeature', 'charismaModifier', '=', null);
    rules.defineRule('selectableFeatureCount.Paladin',
      'levels.Paladin', '=', 'source >= 5 ? 1 : null'
    );

    rules.defineRule('companionMasterLevelPaladin',
      'paladinFeatures.Divine Mount', '?', null,
      'levels.Paladin', '=', 'source >= 5 ? source : null'
    );
    rules.defineRule('companionMasterLevel',
      'companionMasterLevelPaladin', '+=', null
    );
    rules.defineRule('featureNotes.divineMountFeature',
      'companionMasterLevelPaladin', '=',
      'source < 5 ? null : Math.floor((source - 1) / 4)'
    );
    rules.defineRule('animalCompanion.Celestial',
      'companionMasterLevelPaladin', '^=', 'source < 11 ? null : 1'
    );
    rules.defineRule('animalCompanionFeatures.Companion Resist Spells',
      'companionMasterLevelPaladin', '=', 'source >= 15 ? 1 : null'
    );
    rules.defineRule
      ('animalCompanionStats.Int', 'companionMasterLevelPaladin', '^', '6');
    rules.defineRule('animalCompanionStats.SR',
      'companionMasterLevelPaladin', '^=', 'source >= 15 ? source + 11 : null'
    );

  } else if(name == 'Ranger') {

    rules.defineRule('combatNotes.favoredEnemyFeature',
      'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.favoredTerrainFeature',
      'levels.Ranger', '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule
      ('combatNotes.companionBondFeature', 'wisdomModifier', '=', null);
    rules.defineRule('combatNotes.masterHunterFeature',
      'levels.Ranger', '=', 'Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.quarryFeature',
      '', '=', '2',
      'features.Improved Quarry', '^', '4'
    );
    rules.defineRule('selectableFeatureCount.Ranger',
      'levels.Ranger', '=',
      'source >= 2 ? Math.floor((source+6) / 4) + (source >= 4 ? 1 : 0) : null'
    );
    rules.defineRule('skillNotes.favoredEnemyFeature',
      'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('skillNotes.favoredTerrainFeature',
      'levels.Ranger', '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('skillNotes.quarryFeature',
      '', '=', '10',
      'features.Improved Quarry', '^', '20'
    );
    rules.defineRule('skillNotes.trackFeature',
      'levels.Ranger', '+=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('skillNotes.wildEmpathyFeature',
      'levels.Ranger', '+=', null,
      'charismaModifier', '+', null
    );

    rules.defineRule('companionMasterLevelRanger',
      'rangerFeatures.Animal Companion', '?', null,
      'levels.Ranger', '+=', 'source >= 4 ? source - 3 : null'
    );
    rules.defineRule('companionMasterLevel',
      'companionMasterLevelRanger', '+=', null
    );

  } else if(name == 'Rogue') {

    rules.defineRule('casterLevels.Rogue',
      'rogueFeatures.Minor Magic', '?', null,
      'levels.Rogue', '=', null
    );
    rules.defineRule
      ('casterLevels.Dispel Magic', 'casterLevels.Rogue', '^=', null);
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calcuated even for non-Wizard Rogues.
    rules.defineRule('casterLevels.W', 'casterLevels.Rogue', '^=', '1');
    rules.defineRule('casterLevelArcane', 'casterLevels.W', '+=', null);
    rules.defineRule('combatNotes.masterStrikeFeature',
      'levels.Rogue', '+=', '10 + Math.floor(source / 2)',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.bleedingAttackFeature',
      'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('combatNotes.resiliencyFeature', 'levels.Rogue', '=', null);
    rules.defineRule('combatNotes.sneakAttackFeature',
      'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('featCount.General', 'features.Feat Bonus', '+=', 'null');
    rules.defineRule
      ('features.Weapon Finesse', 'features.Finesse Rogue', '=', '1');
    rules.defineRule('selectableFeatureCount.Rogue',
      'levels.Rogue', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.skillMasteryFeature',
      'intelligenceModifier', '=', 'source + 3',
      'rogueFeatures.Skill Mastery', '*', null
    );
    rules.defineRule('skillNotes.trapfindingFeature',
      'levels.Rogue', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.trapSenseFeature',
      'levels.Rogue', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('spellsKnown.W0', 'magicNotes.minorMagicFeature', '+=', '1');
    rules.defineRule
      ('spellsKnown.W1', 'magicNotes.majorMagicFeature', '+=', '1');
    rules.defineRule('validationNotes.rogueWeaponTrainingFeatureFeats',
      'features.Rogue Weapon Training', '=', '-1',
      'features.Weapon Training', '^', '0'
    );
    rules.defineRule('rogueFeatures.Improved Uncanny Dodge',
      'rogueFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodgeFeature',
      'levels.Rogue', '+=', 'source >= 4 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Rogue', '+=', 'source >= 4 ? 1 : null'
    );

  } else if(name == 'Sorcerer') {

    rules.defineRule
      ('selectableFeatureCount.Sorcerer', 'levels.Sorcerer', '=', '1');
    for(var feature in rules.getChoices('selectableFeatures')) {
      if(feature == 'Sorcerer - Bloodline Abyssal') {
        rules.defineRule('bloodlineEnergy',
          'selectableFeatures.' + feature, '=', '"fire"'
        );
      } else if(feature.startsWith('Sorcerer - Bloodline Draconic (')) {
        var color = feature.replace(/^.*\(|\)/g, '');
        var energy = 'BlackCopperGreen'.indexOf(color) >= 0 ? 'acid' :
                     'SilverWhite'.indexOf(color) >= 0 ? 'cold' :
                     'BlueBronze'.indexOf(color) >= 0 ? 'electricity' : 'fire';
        rules.defineRule('bloodlineEnergy',
          'selectableFeatures.' + feature, '=', '"' + energy + '"'
        );
        rules.defineRule('bloodlineBreath',
          'selectableFeatures.' + feature, '=', '"' + (color <= 'F' ? "60' line" : "30' cone") + '"'
        );
        rules.defineRule('features.Bloodline Draconic',
          'selectableFeatures.' + feature, '=', null
        );
      } else if(feature.startsWith('Sorcerer - Bloodline Elemental (')) {
        var element = feature.replace(/^.*\(|\)/g, '');
        var energy = element == 'Earth' ? 'acid' :
                     element == 'Water' ? 'cold' :
                     element == 'Air' ? 'electricity' : 'fire';
        var movement = element == 'Air' ? "Fly 60'/average" :
                       element == 'Earth' ? "Burrow 30'" :
                       element == 'Fire' ? 'Speed +30' : "Swim 60'";
        rules.defineRule('bloodlineEnergy',
          'selectableFeatures.' + feature, '=', '"' + energy + '"'
        );
        rules.defineRule('magicNotes.bloodlineElementalFeature',
          'bloodlineEnergy', '=', null
        );
        rules.defineRule('bloodlineMovement',
          'selectableFeatures.' + feature, '=', '"' + movement + '"'
        );
        rules.defineRule('features.Bloodline Elemental',
          'selectableFeatures.' + feature, '=', null
        );
      }
    }

  } else if(name == 'Wizard') {

    rules.defineRule('combatNotes.handOfTheApprenticeFeature',
      'baseAttack', '=', null,
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.handOfTheApprenticeFeature.1',
      'features.Hand Of The Apprentice', '?', null,
      'intelligenceModifier', '=', 'source + 3'
    );
    rules.defineRule('familiarWizardLevel',
      'wizardFeatures.Familiar', '?', null,
      'levels.Wizard', '=', null
    );
    rules.defineRule('familiarLevel',
      'familiarWizardLevel', '+=', 'Math.floor((source+1) / 2)'
    );
    rules.defineRule
      ('familiarMasterLevel', 'familiarWizardLevel', '+=', null);
    rules.defineRule('featCount.Wizard',
      'levels.Wizard', '=', 'source >= 5 ? Math.floor(source / 5) : null'
    );
    rules.defineRule('magicNotes.metamagicMasteryFeature',
      'levels.Wizard', '=', 'source >= 8 ? Math.floor((source - 6) / 2) : null'
    );
    rules.defineRule
      ('selectableFeatureCount.Wizard', 'levels.Wizard', '=', '1');
    rules.defineRule('wizardSpecializationCount', '', '=', '0');
    rules.defineRule('wizardFeatures.Hand Of The Apprentice',
      'wizardSpecializationCount', '?', 'source == 0'
    );
    rules.defineRule('wizardFeatures.Metamagic Mastery',
      'wizardSpecializationCount', '?', 'source == 0'
    );

    var schoolPowers = {
      'Abjuration':
        '1:Energy Resistance/1:Protective Ward/6:Energy Absorption',
      'Conjuration':
        '1:Summoner\'s Charm/1:Conjured Dart/8:Dimensional Steps',
      'Divination':
        '1:Forewarned/1:Diviner\'s Fortune/8:Scrying Adept',
      'Enchantment':
        '1:Dazing Touch/1:Enchanting Smile/8:Aura Of Despair/' +
        '20:Enchantment Reflection',
      'Evocation':
        '1:Intense Spells/1:Force Missile/8:Elemental Wall/' +
        '20:Penetrating Spells',
      'Illusion':
        '1:Extended Illusions/1:Blinding Ray/8:Invisibility Field',
      'Necromancy':
        '1:Power Over Undead/1:Necromantic Touch/8:Life Sight',
      'Transmutation':
        '1:Physical Enhancement/1:Telekinetic Fist/8:Change Shape'
    };

    for(var j = 0; j < SRD35.SCHOOLS.length; j++) {
      var school = SRD35.SCHOOLS[j].split(':')[0];
      var powers = schoolPowers[school].split('/');
      var schoolLevelAttr = 'schoolLevel.' + school;
      rules.defineRule('magicNotes.wizardSpecialization',
       'specialize.' + school, '=', '"' + school.toLowerCase() + '"'
      );
      rules.defineRule('skillNotes.wizardSpecialization',
        'specialize.' + school, '=', '"' + school.toLowerCase() + '"'
      );
      rules.defineRule(schoolLevelAttr,
        'specialize.' + school, '?', null,
        'levels.Wizard', '=', null
      );
      rules.defineRule
        ('wizardSpecializationCount', 'specialize.' + school, '+', '1');
      for(var k = 0; k < powers.length; k++) {
        var pieces = powers[k].split(':');
        rules.defineRule('wizardFeatures.' + pieces[1],
          schoolLevelAttr, '=', 'source >= ' + pieces[0] + ' ? 1 : null'
        );
        rules.defineRule('features.' + pieces[1],
          'wizardFeatures.' + pieces[1], '=', null
        );
      }
      if(school == 'Abjuration') {
        rules.defineRule('magicNotes.protectiveWardFeature',
          schoolLevelAttr, '=', '1 + Math.floor(source / 5)'
        );
        rules.defineRule('magicNotes.protectiveWardFeature.1',
          'features.Protective Ward', '?', null,
          'intelligenceModifier', '=', 'source + 3'
        );
        rules.defineRule('saveNotes.energyAbsorptionFeature',
          schoolLevelAttr, '=', 'source >= 6 ? source * 3 : null'
        );
        rules.defineRule('saveNotes.energyResistanceFeature',
          schoolLevelAttr, '=',
          'source >= 20 ? "Immune" : source >= 11 ? 10 : 5'
        );
      } else if(school == 'Conjuration') {
        rules.defineRule('magicNotes.conjuredDartFeature',
          'intelligenceModifier', '=', 'source + 3'
        );
        rules.defineRule('magicNotes.conjuredDartFeature.1',
          schoolLevelAttr, '=', 'Math.floor(source / 2)'
        );
        rules.defineRule('magicNotes.dimensionalHopFeature',
          schoolLevelAttr, '=', 'source >= 8 ? 30 * source : null'
        );
        rules.defineRule('magicNotes.summoner\'sCharmFeature',
          schoolLevelAttr, '=',
          'source >= 20 ? "infinite" : source==1 ? 1 : Math.floor(source / 2)'
        );
      } else if(school == 'Divination') {
        rules.defineRule('combatNote.forewarnedFeature',
          schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
        );
        rules.defineRule
          ('initiative', 'combatNote.forewarnedFeature', '+', null);
        rules.defineRule("magicNotes.diviner'sFortuneFeature",
          schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
        );
        rules.defineRule("magicNotes.diviner'sFortuneFeature.1",
          "magicNotes.diviner'sFortuneFeature", '?', null,
          'intelligenceModifier', '=', 'source + 3'
        );
      } else if(school == 'Enchantment') {
        rules.defineRule('magicNotes.auraOfDespairFeature',
          schoolLevelAttr, '=', null
        );
        rules.defineRule('magicNotes.dazingTouchFeature',
          schoolLevelAttr, '=', null
        );
        rules.defineRule('magicNotes.dazingTouchFeature.1',
          'features.Dazing Touch', '?', null,
          'intelligenceModifier', '=', 'source + 3'
        );
        rules.defineRule('skillNotes.enchantingSmileFeature',
          schoolLevelAttr, '=', '1 + Math.floor(source / 5)'
        );
      } else if(school == 'Evocation') {
        rules.defineRule
          ('magicNotes.elementalWallFeature', schoolLevelAttr, '=', null);
        rules.defineRule('magicNotes.forceMissileFeature',
          schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
        );
        rules.defineRule('magicNotes.forceMissileFeature.1',
          'features.Force Missile', '?', null,
          'intelligenceModifier', '=', 'source + 3'
        );
        rules.defineRule('magicNotes.intenseSpellsFeature',
          schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
        );
      } else if(school == 'Illusion') {
        rules.defineRule('magicNotes.blindingRayFeature',
          'intelligenceModifier', '=', 'source + 3'
        );
        rules.defineRule('magicNotes.extendedIllusionsFeature',
          schoolLevelAttr, '=',
          'source >= 20 ? "infinite" : source==1 ? 1 : Math.floor(source / 2)'
        );
        rules.defineRule('magicNotes.invisibilityFieldFeature',
          bloodlineLevelAttr, '=', 'source >= 8 ? source : null'
        );
      } else if(school == 'Necromancy') {
        rules.defineChoice('notes',
          'validationNotes.powerOverUndeadFeatureFeats:Requires Command Undead || Turn Undead'
        );
        rules.defineRule('validationNotes.powerOverUndeadFeatureFeats',
          'features.Power Over Undead', '=', '-1',
          'feats.Command Undead', '^', '0',
          'feats.Turn Undead', '^', '0'
        );
        rules.defineRule('featureNotes.lifeSightFeature',
          schoolLevelAttr, '=',
          'source >= 8 ? 10 * Math.floor((source - 4) / 4) : null'
        );
        rules.defineRule('magicNotes.necromanticTouchFeature',
          schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
        );
        rules.defineRule('magicNotes.necromanticTouchFeature.1',
          'features.Necromantic Touch', '?', null,
          'intelligenceModifier', '=', 'source + 3'
        );
      } else if(school == 'Transmutation') {
        rules.defineRule('abilityNotes.physicalEnhancementFeature',
          schoolLevelAttr, '=', '1 + Math.floor(source / 5)'
        );
        rules.defineRule('abilityNotes.physicalEnhancementFeature.1',
          schoolLevelAttr, '=', 'source >= 20 ? 2 : 1'
        );
        rules.defineRule('magicNotes.changeShapeFeature',
          schoolLevelAttr, '=', 'source >= 8 ? source : null'
        );
        rules.defineRule('magicNotes.changeShapeFeature.1',
          schoolLevelAttr, '=', 'source >= 12 ? "III" : "II"'
        );
        rules.defineRule('magicNotes.changeShapeFeature.2',
          schoolLevelAttr, '=', 'source >= 12 ? "II" : "I"'
        );
        rules.defineRule('magicNotes.telekineticFistFeature',
          'intelligenceModifier', '=', 'source + 3'
        );
        rules.defineRule('magicNotes.telekineticFistFeature.1',
          schoolLevelAttr, '=', 'Math.floor(source / 2)'
        );
      }
    }
    for(var j = 0; j < 10; j++) {
      rules.defineRule
        ('spellsPerDay.W' + j, 'magicNotes.wizardSpecialization', '+', '1');
    }
  }

};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #intel#, #wis#, #dex#, #con#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a companion.
 */
Pathfinder.companionRules = function(
  rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, level, size
) {
  if(!hd)
    hd = 1;
  SRD35.companionRules(rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, level);
  if(size != null)
    rules.defineRule('animalCompanionStats.Size',
      'animalCompanion.' + name, '=', '"' + size + '"'
    );
  if(name.startsWith('Advanced ') && level) {
    var name = name.replace('Advanced ', '');
    rules.defineRule
      ('animalCompanionStats.Adv', 'animalCompanion.' + name, '=', level);
  }
};

/*
 * Defines in #rules# the rules associated with deity #name#. #domains# and
 * #favoredWeapons# list the associated domains and favored weapons.
 */
Pathfinder.deityRules = function(rules, name, domains, favoredWeapons) {
  SRD35.deityRules(rules, name, domains, favoredWeapons);
  // Pathfinder clerics get proficiency in the deity's favored weapon without
  // taking the War domain, and the War domain does not grant Weapon Focus.
  for(var i = 0; i < favoredWeapons.length; i++) {
    var weapon = favoredWeapons[i];
    var focusFeature = 'Weapon Focus (' + weapon + ')';
    var proficiencyFeature = 'Weapon Proficiency (' + weapon + ')';
    rules.defineRule
      ('clericFeatures.' + focusFeature, 'levels.Cleric', '?', 'source == 0');
    rules.defineRule('clericFeatures.' + proficiencyFeature,
      'levels.Cleric', '?', null,
      'deityFavoredWeapon', '=', 'source.indexOf("'+weapon+'")>=0 ? 1 : null',
      'featureNotes.weaponOfWarFeature', '=', 'null'
    );
  }
};

/*
 * Defines in #rules# the rules associated with domain #name#. #features# and
 * #spells# list the associated features and domain spells.
 */
Pathfinder.domainRules = function(rules, name, features, spells, spellDict) {
  SRD35.domainRules(rules, name, features, spells, spellDict);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with domain #name# that are not
 * directly derived from the parmeters passed to domainRules.
 */
Pathfinder.domainRulesExtras = function(rules, name) {

  if(name == 'Air') {
    rules.defineRule
      ('combatNotes.lightningArcFeature', 'wisdomModifier', '=', 'source+3');
    rules.defineRule('combatNotes.lightningArcFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.electricityResistanceFeature',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Animal') {
    rules.defineRule('companionMasterLevelCleric',
      'domains.Animal', '?', null,
      'levels.Cleric', '=', 'source >= 4 ? source - 3 : null'
    );
    rules.defineRule('companionMasterLevel',
      'companionMasterLevelCleric', '+=', null
    );
    rules.defineRule('magicNotes.speakWithAnimalsFeature',
      'levels.Cleric', '=', 'source + 3'
    );
    rules.defineRule
      ('classSkills.Knowledge (Nature)', 'domains.Animal', '=', '1');
    rules.defineChoice('spells', 'Speak With Animals(Animal1 Divi)');
  } else if(name == 'Artifice') {
    rules.defineRule("combatNotes.artificer'sTouchFeature",
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule("combatNotes.artificer'sTouchFeature.1",
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.dancingWeaponsFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineChoice('spells', 'Mending(Artifice0 Tran)');
  } else if(name == 'Chaos') {
    rules.defineRule('combatNotes.chaosBladeFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.chaosBladeFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.touchOfChaosFeature',
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Charm') {
    rules.defineRule('magicNotes.charmingSmileFeature',
      'levels.Cleric', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule
      ('magicNotes.charmingSmileFeature.1', 'levels.Cleric', '=', null);
    rules.defineRule
      ('magicNotes.addlingTouchFeature', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.addlingTouchFeature.1',
      'features.Addling Touch', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    // Charm person already a Charm spell
  } else if(name == 'Community') {
    rules.defineRule
      ('magicNotes.calmingTouchFeature', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule
      ('magicNotes.calmingTouchFeature.1', 'levels.Cleric', '=', null);
    rules.defineRule('saveNotes.unityFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
  } else if(name == 'Darkness') {
    rules.defineRule('combatNotes.touchOfDarknessFeature',
      'levels.Cleric', '=', 'source >= 2 ? Math.floor(source / 2) : 1'
    );
    rules.defineRule('combatNotes.touchOfDarknessFeature.1',
      'features.Touch Of Darkness', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('featureNotes.eyesOfDarknessFeature',
      'levels.Cleric', '=', 'source >= 4 ? Math.floor(source / 2) : null'
    );
  } else if(name == 'Death') {
    rules.defineRule('combatNotes.bleedingTouchFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.bleedingTouchFeature.1',
      'features.Bleeding Touch', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Destruction') {
    rules.defineRule('combatNotes.destructiveAuraFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor(source / 2) : null'
    );
    rules.defineRule('combatNotes.destructiveAuraFeature.1',
      'levels.Cleric', '=', null
    );
    rules.defineRule('combatNotes.destructiveSmiteFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.destructiveSmiteFeature.1',
      'features.Destructive Smite', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Earth') {
    rules.defineRule('magicNotes.acidDartFeature',
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.acidDartFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.acidResistanceFeature',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Evil') {
    rules.defineRule('combatNotes.scytheOfEvilFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.scytheOfEvilFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.touchOfEvilFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.touchOfEvilFeature.1',
      'features.Touch Of Evil', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Fire') {
    rules.defineRule
      ('combatNotes.fireBoltFeature', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('combatNotes.fireBoltFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.fireResistanceFeature',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Glory') {
    rules.defineRule('magicNotes.divinePresenceFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor(source / 2) : null',
      'wisdomModifier', '+', null
    );
    rules.defineRule
      ('magicNotes.divinePresenceFeature.1', 'levels.Cleric', '=', null);
    rules.defineRule
      ('magicNotes.touchOfGloryFeature', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.touchOfGloryFeature.1',
      'features.Touch Of Glory', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineChoice('spells', 'Sanctuary(Glory1 Abju)');
  } else if(name == 'Good') {
    rules.defineRule('combatNotes.holyLanceFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.holyLanceFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.touchOfGoodFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.touchOfGoodFeature.1',
      'magicNotes.touchOfGoodFeature', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Healing') {
    rules.defineRule('magicNotes.healer\'sBlessingFeature',
      'levels.Cleric', '=', 'source >= 6 ? 50 : null'
    );
    rules.defineRule('magicNotes.rebukeDeathFeature',
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.rebukeDeathFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
  } else if(name == 'Knowledge') {
    rules.defineRule(/classSkills.Knowledge/, 'domains.Knowledge', '=', '1');
    rules.defineRule('magicNotes.remoteViewingFeature',
      'levels.Cleric', '=', 'source >= 6 ? source : null'
    );
    rules.defineRule('skillNotes.loreKeeperFeature',
      'levels.Cleric', '=', 'source + 15',
      'wisdomModifier', '+', null
    );
    rules.defineChoice
      ('spells', 'Clairaudience/Clairvoyance(Knowledge3 Divi)');
  } else if(name == 'Law') {
    rules.defineRule('combatNotes.staffOfOrderFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
    );
    rules.defineRule('combatNotes.staffOfOrderFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('magicNotes.touchOfLawFeature', 'wisdomModifier', '=', 'source + 3');
  } else if(name == 'Liberation') {
    rules.defineRule('magicNotes.freedom\'sCallFeature',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule
      ('magicNotes.liberationFeature', 'levels.Cleric', '=', null);
  } else if(name == 'Luck') {
    rules.defineRule('magicNotes.bitOfLuckFeature',
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.goodFortuneFeature',
      'levels.Cleric', '=', 'source >= 6 ? Math.floor(source / 6) : null'
    );
  } else if(name == 'Madness') {
    rules.defineRule
      ('magicNotes.auraOfMadnessFeature', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.visionOfMadnessFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.visionOfMadnessFeature.1',
      'features.Vision Of Madness', '?', null,
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.visionOfMadnessFeature.2',
      'features.Vision Of Madness', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    // Confusion already a Madness spell
  } else if(name == 'Magic') {
    rules.defineRule('combatNotes.handOfTheAcolyteFeature',
      'baseAttack', '=', null,
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.handOfTheAcolyteFeature.1',
      'features.Hand Of The Acolyte', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.dispellingTouchFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source - 4) / 4) : null'
    );
    // Dispel Magic already a Magic spell
  } else if(name == 'Nobility') {
    rules.defineRule('featureNotes.nobleLeadershipFeature',
      'levels.Cleric', '=', 'source >= 8 ? 2 : null'
    );
    rules.defineRule('features.Leadership',
      'featureNotes.nobleLeadershipFeature', '=', '1'
    );
    rules.defineRule('magicNotes.inspiringWordFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.inspiringWordFeature.1',
      'features.Inspiring Word', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Plant') {
    rules.defineRule
      ('combatNotes.brambleArmorFeature', 'levels.Cleric', '=', null);
    rules.defineRule('combatNotes.brambleArmorFeature.1',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.woodenFistFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.woodenFistFeature.1',
      'features.Wooden Fist', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Protection') {
    rules.defineRule('magicNotes.auraOfProtectionFeature',
      'levels.Cleric', '=', 'source >= 8 ? Math.floor((source - 4) / 4) : null'
    );
    rules.defineRule('magicNotes.auraOfProtectionFeature.1',
      'levels.Cleric', '=', 'source >= 14 ? 10 : 5'
    );
    rules.defineRule
      ('magicNotes.auraOfProtectionFeature.2', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.resistantTouchFeature',
      'wisdomModifier', '=', '3 + source'
    );
    rules.defineRule('saveNotes.resistanceBonusFeature',
      'levels.Cleric', '=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule
      ('save.Fortitude', 'saveNotes.resistanceBonusFeature', '+', null);
    rules.defineRule
      ('save.Reflex', 'saveNotes.resistanceBonusFeature', '+', null);
    rules.defineRule
      ('save.Will', 'saveNotes.resistanceBonusFeature', '+', null);
  } else if(name == 'Repose') {
    rules.defineRule
      ('magicNotes.gentleRestFeature', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.gentleRestFeature.1',
      'features.Gentle Rest', '?', null,
      'wisdomModifier', '=', null
    );
    rules.defineRule('magicNotes.wardAgainstDeathFeature',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
  } else if(name == 'Rune') {
    rules.defineRule
      ('magicNotes.blastRuneFeature', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.blastRuneFeature.1',
      'features.Blast Rune', '?', null,
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.blastRuneFeature.2',
      'features.Blast Rune', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Strength') {
    rules.defineRule('magicNotes.mightOfTheGodsFeature',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule('magicNotes.mightOfTheGodsFeature.1',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule('magicNotes.strengthRushFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.strengthRushFeature.1',
      'features.Strength Rush', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
  } else if(name == 'Sun') {
    rules.defineRule
      ('magicNotes.sun\'sBlessingFeature', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.nimbusOfLightFeature',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    rules.defineRule('magicNotes.nimbusOfLightFeature.1',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
  } else if(name == 'Travel') {
    rules.defineRule('speed', 'abilityNotes.travelSpeedFeature', '+', '10');
    rules.defineRule
      ('featureNotes.agileFeetFeature', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('magicNotes.dimensionalHopFeature',
      'levels.Cleric', '=', 'source >= 8 ? 10 * source : null'
    );
  } else if(name == 'Trickery') {
    rules.defineRule('classSkills.Bluff', 'domains.Trickery', '=', '1');
    rules.defineRule('classSkills.Disguise', 'domains.Trickery', '=', '1');
    rules.defineRule('classSkills.Stealth', 'domains.Trickery', '=', '1');
    rules.defineRule('magicNotes.copycatFeature', 'levels.Cleric', '=', null);
    rules.defineRule('magicNotes.copycatFeature.1',
      'features.Copycat', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.master\'sIllusionFeature',
      'levels.Cleric', '=', 'source >= 8 ? 10 + Math.floor(source / 2) : null',
      'wisdomModifier', '+', null
    );
    rules.defineRule
      ('magicNotes.master\'sIllusionFeature.1', 'levels.Cleric', '=', null);
    rules.defineChoice('spells', 'Mirror Image(Trickery2 Illu)');
  } else if(name == 'War') {
    rules.defineRule('combatNotes.battleRageFeature',
      'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('combatNotes.battleRageFeature.1',
      'features.Battle Rage', '?', null,
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('combatNotes.weaponMasterFeature',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
  } else if(name == 'Water') {
    rules.defineRule('combatNotes.icicleFeature',
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('combatNotes.icicleFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.coldResistanceFeature',
      'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                            'source >= 12 ? 20 : ' +
                            'source >= 6 ? 10 : null'
    );
  } else if(name == 'Weather') {
    rules.defineRule('combatNotes.stormBurstFeature',
      'wisdomModifier', '=', 'source + 3'
    );
    rules.defineRule('combatNotes.stormBurstFeature.1',
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.lightningLordFeature',
      'levels.Cleric', '=', 'source >= 8 ? source : null'
    );
    // Call Lightning already a Weather spell
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
 * abilities #str#, #intel#, #wis#, #dex#, #con#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The familiar has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a familiar.
 */
Pathfinder.familiarRules = function(
  rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, level, size
) {
  SRD35.familiarRules
    (rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, level);
  if(size != null)
    rules.defineRule
      ('familiarStats.Size', 'familiar.' + name, '=', '"' + size + '"');
};

/*
 * Defines in #rules# the rules associated with feat #name#. #types# lists the
 * categories of the feat, and #require# and #implies# list the hard and soft
 * prerequisites for the feat.
 */
Pathfinder.featRules = function(rules, name, types, requires, implies) {
  SRD35.featRules(rules, name, types, requires, implies);
};

/*
 * Defines in #rules# the rules associated with feat #name# that are not
 * directly derived from the parmeters passed to featRules.
 */
Pathfinder.featRulesExtra = function(rules, name) {

  var matchInfo;
  if(name == 'Acrobatic') {
    rules.defineRule('skillNotes.acrobaticFeature',
      'skills.Acrobatics', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Agile Maneuvers') {
    rules.defineRule('combatNotes.agileManeuversFeature',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  } else if(name == 'Alertness') {
    rules.defineRule('skillNotes.alertnessFeature',
      'skills.Perception', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Animal Affinity') {
    rules.defineRule('skillNotes.animalAffinityFeature',
      'skills.Handle Animal', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Arcane Armor Mastery') {
    rules.defineRule('magicNotes.arcaneSpellFailure',
      '', '^', '0',
      'magicNotes.arcaneArmorMasteryFeature', '+', '-10'
    );
  } else if(name == 'Arcane Armor Training') {
    rules.defineRule('magicNotes.arcaneSpellFailure',
      '', '^', '0',
      'magicNotes.arcaneArmorTrainingFeature', '+', '-10'
    );
  } else if(name == 'Arcane Strike') {
    rules.defineRule('combatNotes.arcaneStrikeFeature',
      'casterLevelArcane', '=', 'Math.floor((source + 4) / 5)'
    );
  } else if(name == 'Athletic') {
    rules.defineRule('skillNotes.athleticFeature',
      'skills.Climb', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Blinding Critical') {
    rules.defineRule('combatNotes.blindingCriticalFeature',
      'baseAttack', '=', '10 + source'
    );
  } else if(name == 'Combat Expertise') {
    rules.defineRule('combatNotes.combatExpertiseFeature',
      'baseAttack', '=', '1 + Math.floor(source / 4)'
    );
  } else if(name == 'Command Undead') {
    rules.defineRule('combatNotes.commandUndeadFeature',
      'levels.Cleric', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Deadly Aim') {
    rules.defineRule('combatNotes.deadlyAimFeature',
      'baseAttack', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.deadlyAimFeature.1',
      'features.Deadly Aim', '?', null,
      'baseAttack', '=', '2 * (1 + Math.floor(source / 4))'
    );
  } else if(name == 'Deafening Critical') {
    rules.defineRule('combatNotes.deafeningCriticalFeature',
      'baseAttack', '=', '10 + source'
    );
  } else if(name == 'Deceitful') {
    rules.defineRule('skillNotes.deceitfulFeature',
      'skills.Bluff', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Defensive Combat Training') {
    rules.defineRule('combatNotes.defensiveCombatTrainingFeature',
      'level', '=', null,
      'baseAttack', '+', '-source'
    );
  } else if(name == 'Deft Hands') {
    rules.defineRule('skillNotes.deftHandsFeature',
      'skills.Disable Device', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Extra Channel') {
    rules.defineRule('magicNotes.channelEnergyFeature.2',
      'magicNotes.extraChannelFeature', '+', '2'
    );
  } else if(name == 'Extra Ki') {
    rules.defineRule('featureNotes.kiPoolFeature',
      'featureNotes.extraKiFeature', '+', '2'
    );
  } else if(name == 'Extra Lay On Hands') {
    rules.defineRule('magicNotes.layOnHandsFeature.1',
      'magicNotes.extraLayOnHandsFeature', '+', '2'
    )
  } else if(name == 'Extra Performance') {
    rules.defineRule('featureNotes.bardicPerformanceFeature',
      'featureNotes.extraPerformanceFeature', '+', '6'
    );
  } else if(name == 'Extra Rage') {
    rules.defineRule('combatNotes.rageFeature',
      'featureNotes.extraRageFeature', '+', '6'
    );
  } else if(name == "Gorgon's Fist") {
    rules.defineRule("combatNotes.gorgon'sFistFeature",
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
  } else if(name == 'Intimidating Prowess') {
    rules.defineRule('skillModifier.Intimidate',
      'skillNotes.intimidatingProwessFeature', '+', null
    );
    rules.defineRule('skillNotes.intimidatingProwessFeature',
      'strengthModifier', '=', null
    );
  } else if(name == 'Magical Aptitude') {
    rules.defineRule('skillNotes.magicalAptitudeFeature',
      'skills.Spellcraft', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Persuasive') {
    rules.defineRule('skillNotes.persuasiveFeature',
      'skills.Diplomacy', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Power Attack') {
    rules.defineRule('combatNotes.powerAttackFeature',
      'baseAttack', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.powerAttackFeature.1',
      'features.Power Attack', '?', null,
      'baseAttack', '=', '2 * (1 + Math.floor(source / 4))'
    );
  } else if(name == 'Scorpion Style') {
    rules.defineRule('combatNotes.scorpionStyleFeature',
      'wisdomModifier', '=', null
    );
    rules.defineRule('combatNotes.scorpionStyleFeature.1',
      'features.Scorpion Style', '?', null,
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
  } else if(name == 'Selective Channeling') {
    rules.defineRule('magicNotes.selectiveChannelingFeature',
      'wisdomModifier', '=', null
    );
  } else if(name == 'Self-Sufficient') {
    rules.defineRule('skillNotes.self-SufficientFeature',
      'skills.Heal', '=', 'source >= 10 ? 4 : 2'
    );
  } else if((matchInfo = name.match(/^Skill Focus \((.*)\)$/)) != null) {
    var skill = matchInfo[1];
    Pathfinder.featureRules(rules, name, 'skill:+%V ' + skill);
    rules.defineRule('skillNotes.skillFocus(' + skill.replace(/ /g, '') + ')Feature',
      'skills.' + skill, '=', 'source >= 10 ? 6 : 3'
    );
  } else if(name == 'Staggering Critical') {
    rules.defineRule('combatNotes.staggeringCriticalFeature',
      'baseAttack', '=', '10 + source'
    );
  } else if(name == 'Stealthy') {
    rules.defineRule('skillNotes.stealthyFeature',
      'skills.Escape Artist', '=', 'source >= 10 ? 4 : 2'
    );
  } else if(name == 'Stunning Critical') {
    rules.defineRule('combatNotes.stunningCriticalFeature',
      'baseAttack', '=', '10 + source'
    );
  } else if(name == 'Stunning Fist') {
    rules.defineRule('combatNotes.stunningFistFeature',
      'level', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.stunningFistFeature.1',
      'features.Stunning Fist', '?', null,
      'level', '=', 'Math.floor(source / 4)'
    )
  } else if(name == 'Toughness') {
    rules.defineRule
      ('combatNotes.toughnessFeature', 'level', '=', 'Math.max(3, source)');
  } else if(name == 'Turn Undead') {
    rules.defineRule('combatNotes.turnUndeadFeature',
      'levels.Cleric', '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
  } else if(name == 'Two-Weapon Rend') {
    rules.defineRule('combatNotes.two-WeaponRendFeature',
      'strengthModifier', '=', 'Math.floor(source * 1.5)'
    );
  }

};

/*
 * TODO
 */
Pathfinder.featureRules = function(rules, name, notes) {
  if(typeof notes == 'string')
    notes = [notes];
  for(var i = 0; i < notes.length; i++) {
    notes[i] = notes[i].replace('CMB', 'Combat Maneuver Bonus').replace('CMD', 'Combat Maneuver Defense');
  }
  SRD35.featureRules(rules, name, notes);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines in #rules# the rules associated with gender #name#. */
Pathfinder.genderRules = function(rules, name) {
  SRD35.genderRules(rules, name);
  // No changes needed to the rules defined by SRD35 method
};

/* Defines in #rules# the rules associated with language #name#. */
Pathfinder.languageRules = function(rules, name) {
  SRD35.languageRules(rules, name);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with race #name#. #features# lists
 * the associated features.
 */
Pathfinder.raceRules = function(rules, name, features) {
  SRD35.raceRules(rules, name, features);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with race #name# that are not
 * directly derived from the parmeters passed to raceRules.
 */
Pathfinder.raceRulesExtra = function(rules, name, features) {

  var prefix =
    name.substring(0,1).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(name == 'Half-Elf') {

    rules.defineRule('featureNotes.low-LightVisionFeature',
      '', '=', '1',
      prefix + 'Features.Low-Light Vision', '+', null
    );
    rules.defineChoice('notes',
      'validationNotes.adaptabilityFeatureFeats:Requires Skill Focus'
    );
    rules.defineRule('validationNotes.adaptabilityFeatureFeats',
      'features.Adaptability', '=', '-1',
      /feats.Skill Focus/, '^', '0'
    );

  } else if(name.match(/Dwarf/)) {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.steadyFeature', '^', '0'
    );

  } else if(name.match(/Elf/)) {

    rules.defineRule('featureNotes.low-LightVisionFeature',
      '', '=', '1',
      prefix + 'Features.Low-Light Vision', '+', null
    );

  } else if(name.match(/Gnome/)) {

    rules.defineRule('casterLevels.Gnome',
      'gnomeFeatures.Natural Spells', '?', null,
      'level', '=', null
    );
    rules.defineRule
      ('casterLevels.Dancing Lights', 'casterLevels.Gnome', '^=', null);
    rules.defineRule
      ('casterLevels.Ghost Sound', 'casterLevels.Gnome', '^=', null);
    rules.defineRule
      ('casterLevels.Prestidigitation', 'casterLevels.Gnome', '^=', null);
    rules.defineRule
      ('casterLevels.Speak With Animals', 'casterLevels.Gnome', '^=', null);
    // Set casterLevels.B to a minimal value so that spell DC will be
    // calcuated even for non-Bard Gnomes.
    rules.defineRule('casterLevels.B', 'casterLevels.Gnome', '=', '1');
    rules.defineRule
      ('languages.Sylvan', 'race', '=', 'source.match(/Gnome/) ? 1 : null');
    rules.defineRule('magicNotes.naturalSpellsFeature',
      'charisma', '?', 'source >= 11',
      prefix + 'Features.Natural Spells', '=',
      '"<i>Dancing Lights</i>/<i>Ghost Sound</i>/<i>Prestidigitation</i>/' +
      '<i>Speak With Animals</i>"'
    );
    rules.defineRule('magicNotes.naturalSpellsFeature.1',
      'features.Natural Spells', '?', null,
      'level', '=', null
    );

  }

};

/* Defines in #rules# the rules associated with magic school #name#. */
Pathfinder.schoolRules = function(rules, name) {
  SRD35.schoolRules(rules, name);
  // No changes needed to the rules defined by SRD35 method
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
 * #ability# (one of 'strength', 'intelligence', etc.). #untrained#, if
 * specified is a boolean indicating whether or not the skill can be used
 * untrained; the default is true. #classes#, if specified, lists the classes
 * for which this is a class skill.
 */
Pathfinder.skillRules = function(rules, name, ability, untrained, classes) {
  SRD35.skillRules(rules, name, ability, untrained, classes, []);
  // Override effects of class skills and armor skill check penalty
  rules.defineRule('classSkillBump.' + name,
    'skills.' + name, '?', 'source > 0',
    'classSkills.' + name, '=', '3'
  );
  rules.defineRule('skillModifier.' + name,
    'skills.' + name, '=', null,
    'classSkillBump.' + name, '+', null,
    'classSkills.' + name, '+', 'null'
  );
  if(ability == 'strength' || ability == 'dexterity') {
    rules.defineRule
      ('skillModifier.' + name, 'skillNotes.armorSkillCheckPenalty', '+', 'source > 0 ? -3 : null');
  }
};

Pathfinder.skillRulesExtra = function(rules, name) {
  if(name == 'Fly') {
    rules.defineRule('skillModifier.Fly', 'features.Large', '+', '-2');
  }
  if(name == 'Linguistics') {
    rules.defineRule('languageCount', 'skills.Linguistics', '+', null);
  }
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
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
    if(note != null && (matchInfo = notes[note].match(/\(DC %(\d+)/)) != null)
      rules.defineRule(note + '.' + matchInfo[1],
        'charismaModifier', '=', '10 + source + ' + level
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
    '    Animal companion feats, skills, and tricks are not supported\n' +
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
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

/* Defines the rules related to (optional) character traits. */
Pathfinder.traitRules = function(rules, name, type, subtype) {

  rules.defineRule('features.' + name, 'traits.' + name, '=', null);

  if(name == 'Armor Expert') {
    rules.defineRule('skillNotes.armorSkillCheckPenaltyFeature',
      'skillNotes.armorExpertFeature', '+', '-1'
    );
  } else if(name == 'Attuned To The Ancestors') {
    rules.defineRule('magicNotes.attunedToTheAncestorsFeature',
      'level', '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Balanced Offensive') {
    rules.defineRule('combatNotes.balancedOffensiveFeature',
      'level', '=', '1 + Math.floor(source / 5)'
    );
  } else if(name == 'Fires Of Hell') {
    rules.defineRule
      ('combatNotes.firesOfHellFeature', 'charismaModifier', '=', null);
  } else if(name == 'Impressive Presence') {
    rules.defineRule('combatNotes.impressivePresenceFeature',
      'level', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Magical Knack') {
    rules.defineRule('magicNotes.magicalKnackFeature', 'level', '=', null);
  } else if(name == 'Storyteller') {
    rules.defineRule('skillNotes.storytellerFeature',
      'intelligenceModifier', '=', 'Math.max(source + 3, 1)'
    );
  }

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Pathfinder.randomizeOneAttribute = function(attributes, attribute) {
  SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
  if(attribute == 'levels') {
    // Set experience track and override SRD3.5's experience value
    var track = attributes.experienceTrack;
    if(!track)
      track = attributes.experienceTrack = 'Fast';
    var level = QuilvynUtils.sumMatching(attributes, /levels\./);
    if(!level)
      level = 1;
    if(level < Pathfinder.tracksThreshholds[track].length) {
      var min = Pathfinder.tracksThreshholds[track][level - 1] * 1000;
      var max = Pathfinder.tracksThreshholds[track][level] * 1000 - 1;
      attributes.experience = QuilvynUtils.random(min, max);
    }
  }
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Pathfinder.createViewers = function(rules, viewers) {
  SRD35.createViewers(rules, viewers); // No changes
};

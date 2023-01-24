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
/* jshint forin: false */
/* globals Pathfinder, QuilvynRules, QuilvynUtils, SRD35 */
"use strict";

/*
 * This module loads the rules from Pathfinder Advanced Players Guide. The
 * PFAPG function contains methods that load rules for particular parts of
 * rules; raceRules for character races, shieldRules for shields, etc. These
 * member methods can be called independently in order to use a subset of the
 * rules. Similarly, the constant fields of PFAPG (FEATS, RACES, etc.) can be
 * manipulated to modify the choices.
 */
function PFAPG(edition, rules) {

  if(window.Pathfinder == null) {
    alert('The PFAPG module requires use of the Pathfinder module');
    return;
  }

  if(rules == null)
    rules = Pathfinder.rules;

  let msBefore = new Date().getTime();
  PFAPG.aideRules(rules, PFAPG.ANIMAL_COMPANIONS, PFAPG.FAMILIARS);
  let msAfter = new Date().getTime();
  //console.log('aideRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.combatRules(rules, PFAPG.ARMORS, PFAPG.SHIELDS, PFAPG.WEAPONS);
  msAfter = new Date().getTime();
  //console.log('combatRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.magicRules
    (rules, PFAPG.SCHOOLS, PFAPG.SPELLS, PFAPG.SPELLS_LEVELS_ADDED);
  msAfter = new Date().getTime();
  //console.log('magicRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.talentRules
    (rules, PFAPG.FEATS, PFAPG.FEATURES, {}, PFAPG.LANGUAGES, PFAPG.SKILLS);
  msAfter = new Date().getTime();
  //console.log('talentRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.identityRules(
    rules, {}, PFAPG.CLASSES, PFAPG.DEITIES, {}, PFAPG.PATHS, PFAPG.RACES, {},
    PFAPG.TRAITS, PFAPG.PRESTIGE_CLASSES, {}
  );
  msAfter = new Date().getTime();
  //console.log('identityRules took ' + (msAfter - msBefore) + ' ms');

  rules.randomizeOneAttribute = PFAPG.randomizeOneAttribute;

}

PFAPG.VERSION = '2.3.1.0';

PFAPG.ANIMAL_COMPANIONS = {
  // Eidolons have the same stats as animal companions with modified
  // calculations.
  // Attack, Dam, AC include all modifiers
  'Biped Eidolon':
    'Str=16 Dex=12 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=13 Attack=3 ' +
    'Dam=2@1d4+3 Size=M', // Save F/R/W: G/B/G
  'Quadruped Eidolon':
    'Str=14 Dex=14 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=14 Attack=2 ' +
    'Dam=1d6+2 Size=M', // Save F/R/W: G/G/B
  'Serpentine Eidolon':
    'Str=12 Dex=16 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=15 Attack=1 ' +
    'Dam=1d6+1,1d6+1 Size=M' // Save F/R/W: B/G/G
};
PFAPG.ARMORS = {
  'Agile Breastplate':'AC=6 Weight=2 Dex=3 Skill=4 Spell=25',
  'Agile Half-Plate':'AC=8 Weight=2 Dex=0 Skill=7 Spell=40',
  'Armored Coat':'AC=4 Weight=2 Dex=3 Skill=2 Spell=20',
  'Quilted Cloth':'AC=1 Weight=1 Dex=8 Skill=0 Spell=10',
  'Wooden':'AC=3 Weight=1 Dex=3 Skill=1 Spell=15'
};
PFAPG.FAMILIARS = {
  'Centipede':
    'Str=1 Dex=17 Con=10 Int=0 Wis=10 Cha=2 HD=1 AC=17 Attack=5 Dam=1d3-5 ' +
    'Size=T',
  'Crab':
    'Str=7 Dex=15 Con=12 Int=0 Wis=10 Cha=2 HD=1 AC=18 Attack=0 Dam=1d2-2 ' +
    'Size=T',
  // Dog + young: Size -1 (AC, Attack +1) Dam -1 die step Str -4 Con -4 Dex +4
  'Fox':
    'Str=9 Dex=17 Con=11 Int=2 Wis=12 Cha=6 HD=1 AC=14 Attack=3 Dam=1d3+1 ' +
    'Size=T',
  // Octopus + young
  'Octopus':
    'Str=8 Dex=21 Con=10 Int=2 Wis=13 Cha=3 HD=2 AC=16 Attack=6 Dam=1d2+1 ' +
    'Size=T',
  'Scorpion':
    'Str=3 Dex=16 Con=10 Int=0 Wis=10 Cha=2 HD=1 AC=18 Attack=5 Dam=1d2-4 ' +
    'Size=T',
  'Spider':
    'Str=3 Dex=21 Con=10 Int=0 Wis=10 Cha=2 HD=1 AC=18 Attack=7 Dam=1d3-4 ' +
    'Size=T'
};
PFAPG.FEATS = {
  'Additional Traits':'Type=General',
  'Arcane Blast':'Type=General Require=casterLevelArcane,"casterLevel >= 10"',
  'Arcane Shield':'Type=General Require=casterLevelArcane,"casterLevel >= 10"',
  'Arcane Talent':
    'Type=General Require="charisma >= 10","race =~ \'Elf|Gnome\'"',
  'Aspect Of The Beast (Claws Of The Beast)':
    'Type=General Require="features.Wild Shape"',
  'Aspect Of The Beast (Night Senses)':
    'Type=General Require="features.Wild Shape"',
  "Aspect Of The Beast (Predator's Leap)":
    'Type=General Require="features.Wild Shape"',
  'Aspect Of The Beast (Wild Instinct)':
    'Type=General Require="features.Wild Shape"',
  'Bashing Finish':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Shield Master",' +
      '"features.Two-Weapon Fighting",' +
      '"baseAttack >= 11"',
  'Bloody Assault':
    'Type=General,Fighter ' +
    'Require="features.Power Attack","baseAttack >= 6"',
  'Bodyguard':'Type=General,Fighter Require="features.Combat Reflexes"',
  "In Harm's Way":'Type=General,Fighter Require="features.Bodyguard"',
  // Also, age >= 100
  'Breadth Of Experience':'Type=General Require="race =~ \'Dwarf|Elf|Gnome\'"',
  'Bull Rush Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Bull Rush","baseAttack >= 9"',
  'Charge Through':
    'Type=General,Fighter ' +
    'Require="features.Improved Overrun","baseAttack >= 1"',
  'Childlike':'Type=General Require="charisma >= 13","race =~ \'Halfling\'"',
  'Cockatrice Strike':
    'Type=General,Fighter ' +
    'Require="features.Medusa\'s Wrath","baseAttack >= 14"',
  'Combat Patrol':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Combat Reflexes",' +
      'features.Mobility,' +
      '"baseAttack >= 5"',
  // TODO
  // 'Cooperative Crafting':'Type=General Require=""'1 rank in any Craft skill, any item creation feat 
  'Cosmopolitan':'Type=General',
  'Covering Defense':
    'Type=General,Feature ' +
    'Require="features.Shield Focus","baseAttack >= 6"',
  'Crippling Critical':
    'Type=General,Fighter ' +
    'Require="features.Critical Focus","baseAttack >= 13"',
  'Crossbow Mastery':
    'Type=General,Fighter ' +
    'Require="dexterity >= 15","features.Rapid Reload","features.Rapid Shot"',
  'Dastardly Finish':'Type=General,Fighter Require="sneakAttack >= 5"',
  'Dazing Assault':
    'Type=General,Fighter ' +
    'Require="features.Power Attack","baseAttack >= 11"',
  'Deep Drinker':
    'Type=General ' +
    'Require="constitution >= 13","levels.Monk >= 11","features.Drunken Ki"',
  'Deepsight':'Type=General Require="features.Darkvision"',
  'Disarming Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Disarm","baseAttack >= 9"',
  'Disrupting Shot':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"features.Point-Blank Shot",' +
      '"levels.Fighter >= 6"',
  "Diviner's Delving":
    'Type=General Require="features.Spell Focus (Divination)"',
  'Eagle Eyes':'Type=General Require="wisdom >= 13","features.Keen Senses"',
  'Eclectic':'Type=General Require="race =~ \'Human\'"',
  'Eldritch Claws':
    'Type=General ' +
    'Require=' +
      '"strength >= 15",' +
      '"features.Natural Weapons",' +
      '"baseAttack >= 6"',
  'Elemental Fist':
    'Type=General,Fighter ' +
    'Require=' +
      '"constitution >= 13",' +
      '"wisdom >= 13",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttack >= 8"',
  'Elemental Focus (Acid)':'Type=General',
  'Elemental Focus (Cold)':'Type=General',
  'Elemental Focus (Electricity)':'Type=General',
  'Elemental Focus (Fire)':'Type=General',
  'Greater Elemental Focus (Acid)':
    'Type=General Require="features.Elemental Focus (Acid)"',
  'Greater Elemental Focus (Cold)':
    'Type=General Require="features.Elemental Focus (Cold)"',
  'Greater Elemental Focus (Electricity)':
    'Type=General Require="features.Elemental Focus (Electricity)"',
  'Greater Elemental Focus (Fire)':
    'Type=General Require="features.Elemental Focus (Fire)"',
  'Elven Accuracy':'Type=General,Fighter Require="race =~ \'Elf\'"',
  'Enforcer':'Type=General,Fighter Require=skills.Intimidate',
  'Expanded Arcana':'Type=General Require="casterLevel >= 1"',
  'Extra Bombs':'Type=General Require=features.Bomb',
  'Extra Discovery':'Type=General Require=features.Discovery',
  'Extra Hex':'Type=General Require=features.Hex',
  'Extra Rage Power':'Type=General Require="features.Rage Power"',
  'Extra Revelation':'Type=General Require=features.Revelation',
  'Extra Rogue Talent':'Type=General Require="features.Rogue Talent"',
  'Fast Drinker':
    'Type=General Require="constitution >= 18","features.Drunken Ki"',
  'Fast Healer':
    'Type=General ' +
    'Require="constitution >= 13",features.Diehard,features.Endurance',
  'Favored Defense':'Type=General Require="features.Favored Enemy"',
  'Fight On':
    'Type=General Require="constitution >= 13","race =~ \'Dwarf|Orc\'"',
  // From Bestiary; needed for Eagle Shaman
  'Flyby Attack':'Type=General Require=skills.Fly',
  'Focused Shot':
    'Type=General,Fighter Require="intelligence >= 13","features.Precise Shot"',
  'Following Step':
    'Type=General,Fighter Require="dexterity >= 13","features.Step Up"',
  'Step Up and Strike':
    'Type=General,Fighter ' +
    'Require="features.Following Step","baseAttack >= 6"',
  'Furious Focus':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttack >= 1"',
  'Dreadful Carnage':
    'Type=General,Fighter ' +
    'Require="strength >= 15","features.Furious Focus","baseAttack >= 11"',
  'Gang Up':'Type=General,Fighter Require="features.Combat Expertise"',
  'Team Up':
    'Type=General,Fighter Require=features.Gang-Up,"baseAttack >= 6"',
  'Gnome Trickster':
    'Type=General ' +
    'Require="charisma >= 13","race =~ \'Gnome\'","features.Gnome Magic"',
  'Go Unnoticed':'Type=General Require="dexterity >= 13",features.Small',
  'Groundling':
    'Type=General ' +
    'Require="charisma >= 13","race =~ \'Gnome\'","features.Gnome Magic"',
  'Heroic Defiance':
    'Type=General Require=features.Diehard,"save.Fortitude >= 8"',
  'Heroic Recovery':
    'Type=General Require=features.Diehard,"save.Fortitude >= 4"',
  'Improved Blind-Fight':
    'Type=General,Fighter ' +
     'Require="skills.Perception >= 10",features.Blind-Fight"',
  'Greater Blind-Fight':
    'Type=General,Fighter ' +
    'Require="skills.Perception >= 15","features.Improved Blind-Fight"',
  'Improved Dirty Trick':
    'Type=General,Fighter Require="features.Combat Expertise"',
  'Greater Dirty Trick':
    'Type=General,Fighter ' +
    'Require="features.Improved Dirty Trick","baseAttack >= 6"',
  'Improved Drag':'Type=General,Fighter Require="features.Power Attack"',
  'Greater Drag':
    'Type=General,Fighter ' +
    'Require="features.Improved Drag","baseAttack >= 6"',
  'Improved Reposition':
    'Type=General,Fighter Require="features.Combat Expertise"',
  'Greater Reposition':
    'Type=General,Fighter ' +
    'Require="features.Improved Reposition","baseAttack >= 6"',
  'Improved Share Spells':'Type=General Require="skills.Spellcraft >= 10"',
  'Improved Steal':'Type=General,Fighter Require="features.Combat Expertise"',
  'Greater Steal':
    'Type=General,Fighter ' +
    'Require="features.Improved Steal","baseAttack >= 6"',
  'Improved Stonecunning':
    'Type=General ' +
    'Require="wisdom >= 13","race =~ \'Dwarf\'",features.Stonecunning',
  'Stone Sense':
    'Type=General ' +
    'Require="skills.Perception >= 10","features.Improved Stonecunning"',
  'Ironguts':
    'Type=General Require="constitution >= 13","race =~ \'Dwarf|Orc\'"',
  'Ironhide':
    'Type=General Require="constitution >= 13","race =~ \'Dwarf|Orc\'"',
  'Keen Scent':'Type=General Require="wisdom >= 13","race =~ \'Orc\'"',
  'Smell Fear':'Type=General Require="features.Keen Scent","race =~ \'Orc\'"',
  'Ki Throw':
    'Type=General,Fighter ' +
    'Require="features.Improved Trip","features.Improved Unarmed Strike"',
  'Improved Ki Throw':
    'Type=General,Fighter ' +
    'Require="features.Improved Bull Rush","features.Ki Throw"',
  'Leaf Singer':
    'Type=General ' +
    'Require="charisma >= 13","features.Bardic Performance","race =~ \'Elf\'"',
  'Light Step':
    'Type=General ' +
    'Require=' +
      '"features.Acrobatic Steps",' +
      '"features.Nimble Moves",' +
      '"race == \'Elf\'"',
  'Lingering Performance':'Type=General Require="features.Bardic Performance"',
  'Low Profile':'Type=General,Fighter Require="dexterity >= 13",features.Small',
  'Lucky Halfling':'Type=General Require="race =~ \'Halfling\'"',
  'Master Alchemist':'Type=General Require="skills.Craft (Alchemy) >= 5"',
  // TODO
  // 'Minor Spell Expertise':'Type=General Require=""'Cast 4th-level spells
  // 'Major Spell Expertise':'Type=General Require=""'Minor Spell Expertise, cast 9th-level spells
  'Missile Shield':
    'Type=General,Fighter Require="dexterity >= 13","features.Shield Focus"',
  'Ray Shield':
    'Type=General,Fighter ' +
    'Require="dexterity >= 15","features.Missile Shield",features.Spellbreaker',
  'Mounted Shield':
    'Type=General,Fighter ' +
    'Require="features.Mounted Combat","features.Shield Focus"',
  'Parry Spell':
    'Type=General ' +
    'Require="skills.Spellcraft >= 15","features.Improved Counterspell"',
  'Parting Shot':
    'Type=General,Fighter ' +
    'Require="features.Shot on the Run","baseAttack >= 6"',
  'Pass for Human':
    'Type=General Require="race =~ \'Half-Elf|Half-Orc|Halfling\'"',
  'Perfect Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"wisdom >= 13",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttack >= 8"',
  // TODO
  // 'Point-Blank Master':'Type=General,Fighter Require=""'Weapon Specialization with a ranged weapon
  'Practiced Tactician':'Type=General Require=features.Tactician',
  'Preferred Spell':
    'Type=General Require="skills.Spellcraft >= 5","features.Heighten Spell"',
  'Punishing Kick':
    'Type=General,Fighter ' +
    'Require=' +
      '"constitution >= 13",' +
      '"wisdom >= 13",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttack >= 8"',
  'Pushing Assault':
    'Type=General,Fighter ' +
    'Require="strength >= 15","features.Power Attack","baseAttack >= 1"',
  'Racial Heritage':'Type=General Require="race =~ \'Human\'"',
  'Raging Vitality':'Type=General Require="constitution >= 15",features.Rage',
  'Razortusk':'Type=General Require="race == \'Half-Orc\'"',
  'Rending Claws':
    'Type=General,Fighter ' +
    'Require="strength >= 13",weapons.Claws,"baseAttack >= 6"',
  'Repositioning Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Reposition","baseAttack >= 9"',
  'Saving Shield':'Type=General,Fighter Require="features.Shield Proficiency"',
  'Second Chance':
    'Type=General,Fighter ' +
    'Require="features.Combat Expertise","baseAttack >= 6"',
  'Improved Second Chance':
    'Type=General,Fighter ' +
    'Require="features.Second Chance","baseAttack >= 11"',
  'Shadow Strike':'Type=General,Fighter Require="baseAttack >= 1"',
  'Shared Insight':'Type=General Require="wisdom >= 13","race == \'Half-Elf\'"',
  'Sharp Senses':'Type=General Require="features.Keen Senses"',
  'Shield Of Swings':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttack >= 1"',
  'Shield Specialization (Buckler)':
    'Type=General,Fighter ' +
    'Require="features.Shield Focus","features.Fighter >= 4"',
  'Shield Specialization (Heavy)':
    'Type=General,Fighter ' +
    'Require="features.Shield Focus","features.Fighter >= 4"',
  'Shield Specialization (Light)':
    'Type=General,Fighter ' +
    'Require="features.Shield Focus","features.Fighter >= 4"',
  'Shield Specialization (Tower)':
    'Type=General,Fighter ' +
    'Require="features.Shield Focus","features.Fighter >= 4"',
  'Greater Shield Specialization (Buckler)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization",' +
      '"levels.Fighter >= 12"',
  'Greater Shield Specialization (Heavy)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization",' +
      '"levels.Fighter >= 12"',
  'Greater Shield Specialization (Light)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization",' +
      '"levels.Fighter >= 12"',
  'Greater Shield Specialization (Tower)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization",' +
      '"levels.Fighter >= 12"',
  'Sidestep':
    'Type=General,Fighter ' +
    'Require="dexterity >= 13",features.Dodge,features.Mobility',
  'Improved Sidestep':
    'Type=General,Fighter Require="dexterity >= 15",features.Sidestep',
  'Smash':
    'Type=General,Fighter ' +
    'Require="features.Power Attack","race == \'Half-Orc\'"',
  'Sociable':'Type=General Require="charisma >= 13","race == \'Half-Elf\'"',
  'Spell Perfection':
    'Type=General Require="skills.Spellcraft >= 15","sumMetamagicFeats >= 3"',
  'Spider Step':
    'Type=General ' +
    'Require="skills.Acrobatics >= 6","skills.Climb >= 6","levels.Monk >= 6"',
  'Cloud Step':
    'Type=General Require="features.Spider Step","levels.Monk >= 12"',
  'Stabbing Shot':
    'Type=General,Fighter Require="features.Rapid Shot","race == \'Elf\'"',
  'Steel Soul':'Type=General Require="race =~ \'Dwarf\'",features.Hardy',
  'Stone-Faced':'Type=General Require="race =~ \'Dwarf\'"',
  'Stone Singer':
    'Type=General ' +
    'Require=' +
      '"charisma >= 13",' +
      '"features.Bardic Performance",' +
      '"race =~ \'Dwarf\'"',
  'Stunning Assault':
    'Type=General,Fighter ' +
    'Require="features.Power Attack","baseAttack >= 16"',
  "Summoner's Call":'Type=General Require=features.Eidolon',
  'Sundering Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Sunder","baseAttack >= 9"',
  'Swift Aid':
    'Type=General,Fighter ' +
    'Require="features.Combat Expertise","baseAttack >= 6"',
  'Taunt':'Type=General Require="charisma >= 13",features.Small',
  'Teleport Tactician':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Combat Reflexes",' +
      'features.Disruptive,' +
      'features.Spellbreaker',
  'Tenacious Transmutation':
    'Type=General Require="features.Spell Focus (Transmutation)"',
  'Touch Of Serenity':
    'Type=General,Fighter ' +
    'Require=' +
      '"wisdom >= 18",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttack >= 8"',
  'Trick Riding':
    'Type=General,Fighter Require="skills.Ride >= 9","features.Mounted Combat"',
  'Mounted Skirmisher':
    'Type=General,Fighter Require="skills.Ride >= 14","features.Trick Riding"',
  'Tripping Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Trip","baseAttack >= 9"',
  'Under and Over':
    'Type=General,Fighter Require="features.Agile Maneuvers",features.Small',
  'Underfoot':
    'Type=General,Fighter ' +
    'Require=features.Dodge,features.Mobility,features.Small',
  'Vermin Heart':'Type=General Require="features.Wild Empathy"',
  'War Singer':
    'Type=General ' +
    'Require="charisma >= 13","features.Bardic Performance","race =~ \'Orc\'"',
  'Well-Prepared':'Type=General Require="race =~ \'Halfling\'"',
  'Bouncing Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Dazing Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Disruptive Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Ectoplasmic Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Elemental Spell (Acid)':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Elemental Spell (Cold)':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Elemental Spell (Electricity)':
    'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Elemental Spell (Fire)':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Focused Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Intensified Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Lingering Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Merciful Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Persistent Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Reach Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Selective Spell':
    'Type=Metamagic,Wizard ' +
    'Require="skills.Spellcraft >= 10" ' +
    'Imply="casterLevel >= 1"',
  'Sickening Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Thundering Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
  'Allied Spellcaster':'Type=Teamwork Require="casterLevel >= 1"',
  'Coordinated Defense':'Type=Teamwork,Fighter',
  'Coordinated Maneuvers':'Type=Teamwork,Fighter',
  'Duck and Cover':'Type=Teamwork',
  'Lookout':'Type=Teamwork,Fighter',
  'Outflank':'Type=Teamwork,Fighter Require="baseAttack >= 4"',
  'Paired Opportunists':'Type=Teamwork,Fighter',
  'Precise Strike':
    'Type=Teamwork,Fighter Require="dexterity >= 13","baseAttack >= 1"',
  'Shield Wall':'Type=Teamwork,Fighter Require="features.Shield Proficiency"',
  'Shielded Caster':'Type=Teamwork',
  'Swap Places':'Type=Teamwork,Fighter'
};
PFAPG.FEATURES = {

  // Dwarf
  'Ancient Enmity':'Section=combat Note="+1 attack vs. elves"',
  'Craftsman':
    'Section=skill ' +
    'Note="+2 Craft and Profession to create metal and stone objects"',
  'Deep Warrior':'Section=combat Note="+2 AC and grapple CMB vs. aberrations"',
  'Lorekeeper (Dwarf)':
    'Section=skill Note="+2 Knowledge (History) (dwarves and dwarven enemies)"',
  'Magic Resistant':
    'Section=magic,save ' +
    'Note=' +
      '"-2 arcane spell concentration",' +
      '"SR %{level+5}"',
  'Relentless':
    'Section=combat Note="+2 bull rush and overrun when standing on ground"',
  'Stonesinger':'Section=magic Note="+1 caster level on Earth spells"',
  'Stubborn':
    'Section=save ' +
    'Note="+2 Will vs. charm and compulsion; may attempt save again 1 rd after failing"',

  // Elf
  'Desert Runner':
    'Section=save ' +
    'Note="+4 vs. fatigue, exhaustion, and effects from running, forced marches, starvation, thirst, and hot and cold environments"',
  'Dreamspeaker':
    'Section=magic ' +
    'Note="+1 divination and sleep spell DC%{charisma>=15 ? \'/May cast <i>Dream</i> 1/dy\' : \'\'}"',
  'Eternal Grudge':'Section=combat Note="+1 attack vs. dwarves and orcs"',
  'Lightbringer':
    'Section=magic,save ' +
    'Note=' +
      '"+1 caster level on light-based spells%{intelligence>=10 ? \'/May cast <i>Light</i> at will</i>\' : \'\'}",' +
      '"Immune to light-based blindness and dazzle"',
  'Silent Hunter':
    'Section=skill ' +
    'Note="Reduce moving Stealth penalty by 5/May use -20 Stealth while running"',
  'Spirit Of The Waters':
    'Section=feature,skill ' +
    'Note=' +
      '"Has Weapon Proficiency (Longspear/Net/Trident)",' +
      '"+4 Swim/May take 10 while swimming/May learn Aquan"',
  'Woodcraft':
    'Section=skill ' +
    'Note="+1 Knowledge (Nature)/+1 Survival/Additional +1 to both in forests"',

  // Gnome
  'Academician':'Section=skill Note="+2 choice of Knowledge"',
  'Eternal Hope':
    'Section=feature,save ' +
    'Note=' +
      '"May reroll 1 on d20 1/dy",' +
      '"+2 vs. fear and despair"',
  'Gift Of Tongues':
    'Section=skill Note="+1 Bluff/+1 Diplomacy/+%1 Language Count"',
  'Magical Linguist':
    'Section=magic,save ' +
    'Note=' +
      '"+1 save DC on language-dependent and magical writing spells%{charisma>=11 ? \'/May cast <i>Arcane Mark</i>, <i>Comprehend Languages</i>, <i>Message</i>, <i>Read Magic</i> 1/dy\' : \'\'}",' +
      '"+2 vs. language-dependent and magical writing spells"',
  'Master Tinker':
    'Section=combat,skill ' +
    'Note=' +
      '"Proficient with any self-made weapon",' +
      '"+1 Disable Device/+1 Knowledge (Dungeoneering)"',
  'Pyromaniac':
    'Section=magic ' +
    'Note="+1 caster level on fire spells%{charisma>=11 ? \'/May cast <i>Dancing Lights</i>, <i>Flare</i>, <i>Prestidigitation</i>, <i>Produce Flame</i> 1/dy\' : \'\'}"',
  'Warden Of Nature':
    'Section=combat ' +
    'Note="+2 AC and +1 attack vs. aberrations, oozes, and vermin"',

  // Half-Elf
  'Ancestral Arms':
    'Section=feature ' +
    'Note="+1 General Feat (Exotic Weapon Proficiency or Martial Weapon Proficiency)"',
  'Arcane Training':
    'Section=feature,magic ' +
    'Note=' +
      '"Favored class must include arcane spellcasting",' +
      '"+1 caster level on favored class spell trigger and completion items"',
  'Dual Minded':'Section=save Note="+2 Will"',
  'Integrated':'Section=skill Note="+1 Bluff/+1 Disguise/+1 Knowledge (Local)"',
  'Sociable (Half-Elf)':
    'Section=skill ' +
    'Note="May make second Diplomacy attempt to change attitude even after -5 failure"',
  'Water Child':
      'Section=skill ' +
      'Note="+4 Swim/May take 10 while swimming/May learn Aquan"',

  // Half-Orc
  'Beastmaster':
    'Section=feature,skill ' +
    'Note=' +
      '"Weapon Familiarity (Net/Whip)",' +
      '"+2 Handle Animal"',
  'Bestial':'Section=skill Note="+2 Perception"',
  'Cavewight':
    'Section=skill ' +
    'Note="+1 Knowledge (Dungeoneering) (underground)/+1 Survival (underground)"',
  'Chain Fighter':
    'Section=feature ' +
    'Note="Weapon Proficiency (Flail/Heavy Flail)/Weapon Familiarity (Dire Flail/Spike Chain)"',
  'Gatecrasher':
    'Section=combat Note="+2 Strength checks (break objects)/+2 Sunder CMB"',
  'Plagueborn':
    'Section=save ' +
    'Note="+2 vs. disease, ingested poison, nauseated, and sickened"',
  'Rock Climber':'Section=skill Note="+1 Acrobatics/+1 Climb"',
  'Sacred Tattoo':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Scavenger':
    'Section=skill ' +
    'Note="+2 Appraise/+2 Perception (find hidden objects, note spoiled food, identify poison by taste)"',
  'Toothy':'Section=combat Note="Bite inflicts 1d4 HP piercing"',

  // Halfling
  'Craven':
    'Section=ability,combat,save ' +
    'Note=' +
      '"+10 Speed when fearful",' +
      '"+1 Initiative/+1 attack when flanking/+1 AC when fearful",' +
      '"-2 vs. fear/No morale bonus on fear saves"',
  'Outrider':'Section=skill Note="+2 Handle Animal/+2 Ride"',
  'Low Blow':
    'Section=combat Note="+1 confirm crit on larger foe"',
  'Practicality':
    'Section=save,skill ' +
    'Note=' +
      '"+2 vs. illusions",' +
      '"+2 choice of Craft or Profession/+2 Sense Motive"',
  'Swift As Shadows':
    'Section=skill ' +
    'Note="Reduce penalty for moving Stealth by 5, sniping Stealth by 10"',
  'Underfoot (Halfling)':
    'Section=combat,save ' +
    'Note=' +
      '"+1 AC vs. larger foes",' +
      '"+1 Reflex vs. trample"',
  'Wanderlust':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 caster level on movement spells",' +
      '"+2 Knowledge (Geography)/+2 Survival"',
  'Warslinger':'Section=combat Note="May reload a sling as a free action"',

  // Human
  'Eye For Talent':
    'Section=feature,skill ' +
    'Note=' +
      '"Animal companion or familiar gains +2 on choice of ability",' +
      '"+2 Sense Motive"',
  'Heart Of The Fields':
    'Section=save,skill ' +
    'Note=' +
      '"May ignore fatigued or exhausted effect 1/dy",' +
      '"+%{level//2} on choice of Craft or Profession"',
  'Heart Of The Streets':
    'Section=ability,combat,save ' +
    'Note=' +
      '"Crowds count as normal terrain",' +
      '"+1 AC when adjacent to 2 allies",' +
      '"+1 Reflex when adjacent to 2 allies"',
  'Heart Of The Wilderness':
    'Section=combat,skill ' +
    'Note=' +
      '"+5 stabilization checks/Does not die until -%{constitution+5} HP",' +
      '"+%V Survival"',

  // Alchemist
  'Acid Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts acid damage instead of fire and direct hit an additional 1d6 HP the next round"',
  'Alchemy':
    'Section=magic,skill ' +
    'Note=' +
      '"May infuse extracts that duplicate spell effects for 1 dy",' +
      '"+%V Craft (Alchemy)/May use Craft (Alchemy) to identify potions"',
  'Awakened Intellect':'Section=ability Note="+2 Intelligence"',
  'Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict full HP on hit and %{levels.Alchemist+1)//2+intelligenceModifier} HP (DC %{10+levels.Alchemist//2+intelligenceModifier} Ref half) splash %V/dy"',
  // 'Brew Potion' in SRD35.js
  'Combine Extracts':
    'Section=magic Note="Combining two effects into one extract uses +2 slot"',
  'Concentrate Poison':
    'Section=feature ' +
    'Note="1 min process combines two poison doses; yields +50% frequency and +2 save DC for 1 hr"',
  'Concussive Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{levels.Alchemist//2+1}d4 sonic damage instead of fire and direct hit deafens for 1 min (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort neg)"',
  'Delayed Bomb':
    'Section=combat ' +
    'Note="May time bomb to explode after up to %{levels.Alchemist} rd"',
  'Dilution':'Section=magic Note="May split potion or elixir into two doses"',
  'Discovery':'Section=feature Note="%V Selections"',
  'Dispelling Bomb':
    'Section=combat ' +
    'Note="May create bomb that dispels magic instead of inflicting damage"',
  'Elixir Of Life':
    'Section=magic ' +
    'Note="May create elixir that acts as <i>True Resurrection</i> or readied self <i>Resurrection</i> for %{intelligenceModifier} dy 1/dy"',
  'Enhance Potion':
    'Section=magic ' +
    'Note="May cause imbibed potion to function at caster level %{levels.Alchemist} %{intelligenceModifier}/dy"',
  'Eternal Potion':
     'Section=magic Note="May make effects of 1 imbibed potion permanent"',
  'Eternal Youth':
    'Section=ability Note="Suffers no ability score penalties from age"',
  'Explosive Bomb':
    'Section=combat ' +
    'Note="Direct hit from bomb inflicts 1d6 HP fire/rd until extinguished; splash extends 10\'"',
  'Extend Potion':
     'Section=magic ' +
     'Note="May double duration of imbibed potion %{intelligenceModifier}/dy"',
  'Fast Bombs':
    'Section=combat Note="May use full attack to throw multiple bombs per rd"',
  'Fast Healing':'Section=combat Note="Regains %V HP/rd"',
  'Feral Mutagen':
    'Section=combat ' +
    'Note="Imbibing mutagen grants 2 claw attacks for 1d%{features.Small ? 4 : 6} HP each, 1 bite attack for 1d%{features.Small ? 6 : 8} HP damage, and +2 Intimidate"',
  'Force Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{levels.Alchemist//2+1}d4 force damage instead of fire and direct hit knocks prone (DC %{10+levels.Alchemist//2+intelligenceModifier} Ref neg)"',
  'Frost Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{levels.Alchemist//2+1}d6+%{intelligenceModifier} cold damage instead of fire and direct hit staggers (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort neg)"',
  'Grand Discovery':'Section=feature Note="%V Selection/+2 Discovery"',
  'Grand Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +6 AC and +8/+6/+4 to choices of strength, dexterity, and constitution and -2 to intelligence, wisdom, and charisma for %{levels.Alchemist*10} min"',
  'Greater Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +4 AC and +6/-2 and +4/-2 to strength/intelligence, dexterity/wisdom, or constitution/charisma for %{levels.Alchemist*10} min"',
  'Inferno Bomb':
    'Section=combat ' +
    'Note="May create bomb that inflicts 6d6 HP fire in dbl splash radius for %{levels.Alchemist} rd"',
  'Infuse Mutagen':
     'Section=magic ' +
     'Note="May retain multiple mutagens at the cost of 2 point intelligence damage per"',
  'Infusion':
    'Section=magic ' +
    'Note="Created extracts persist when not held and may be used by others"',
  'Instant Alchemy':
    'Section=combat,magic ' +
    'Note=' +
      '"May apply poison to a blade as an immediate action",' +
      '"May create alchemical items as a full-round action"',
  'Madness Bomb':
    'Section=combat ' +
    'Note="May create bomb that inflicts 1d4 points of wisdom damage, reducing fire damage by 2d6 HP"',
  'Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +2 AC and +4/-2 to strength/intelligence, dexterity/wisdom, or constitution/charisma for %{levels.Alchemist*10} min"',
  'Persistent Mutagen':'Section=magic Note="Mutagen effects last %{levels.Alchemist} hr"',
  "Philosopher's Stone":
    'Section=magic ' +
    'Note="May create stone that turns base metals into silver and gold or creates <i>True Resurrection</i> oil"',
  'Poison Bomb':
    'Section=combat ' +
    'Note="May create bomb that kills creatures up to 6 HD (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort 1d4 constitution damage for 4-6 HD) and inflicts 1d4 constitution damage on higher HD creatures (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort half) in dbl splash radius for %{levels.Alchemist} rd"',
  'Poison Resistance':'Section=save Note="Resistance %V poison"',
  'Poison Touch':
    'Section=combat ' +
    'Note="Touch may inflict 1d3 constitution damage/rd for 6 rd (DC %{10+levels.Alchemist//2+intelligenceModifier} Con neg)"',
  // 'Poison Use' in Pathfinder.js
  'Precise Bombs':
    'Section=combat ' +
    'Note="May specify %{intelligenceModifier} squares in bomb splash radius that are unaffected"',
  'Shock Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{levels.Alchemist//2+1}d6+%{intelligenceModifier} electricity damage instead of fire and direct hit dazzles for 1d4 rd"',
  'Smoke Bomb':
    'Section=combat ' +
    'Note="May create bomb that obscures vision in dbl splash radius for %{levels.Alchemist} rd"',
  'Sticky Bomb':
    'Section=combat ' +
    'Note="Direct hit by bomb inflicts splash damage the following rd"',
  'Sticky Poison':
    'Section=combat ' +
    'Note="Poison applied to blade remains effective for %{intelligenceModifier} strikes"',
  'Stink Bomb':
    'Section=combat ' +
    'Note="May create bomb that nauseates for 1d4+1 rd (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort neg) in dbl splash radius for 1 rd"',
  'Swift Alchemy':
    'Section=combat,magic ' +
    'Note=' +
      '"May apply poison to a blade as a move action",' +
      '"May create alchemical items in half normal time"',
  'Swift Poisoning':
    'Section=combat Note="May apply poison to a blade as a swift action"',
  'Throw Anything (Alchemist)':
    'Section=feature ' +
    'Note="Has Throw Anything feature; throws inflict +%{intelligenceModifier} HP damage"',
  'True Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +8 AC, +8 to strength, dexterity, and constitution, and -2 intelligence, wisdom, and charisma for %{levels.Alchemist*10} min"',

  // Cavalier
  'Act As One':
    'Section=combat ' +
    'Note="R30\' May give immediate move, +2 melee attack, and +2 AC to each ally 1/combat"',
  'Aid Allies (Cavalier)':
    'Section=combat ' +
    'Note="Aid Another action gives ally +%{(levels.Cavalier+4)//6+2} AC, attack, save, or skill check"',
  'Banner':
    'Section=combat ' +
    'Note="R60\' Allies gain +%{levels.Cavalier//5+1} save vs. fear and +%{levels.Cavalier//5} charge attack when banner visible"',
  'Braggart':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 attack vs. demoralized target",' +
      '"Has Dazzling Display features"',
  'By My Honor':
    'Section=save Note="+2 choice of save while maintaining alignment"',
  'Calling':
    'Section=feature,magic ' +
    'Note=' +
      '"May gain +%{charismaModifier} on choice of ability check, attack, save, or skill check within 1 min after prayer 1/choice/dy",' +
      '"+%V Channel Energy and Lay On Hands level"',
  'Cavalier Feat Bonus':'Section=feature Note="Gain %V Fighter Feats"',
  "Cavalier's Charge":
    'Section=combat ' +
    'Note="+4 mounted charge attack/No AC penalty after mounted charge"',
  'Challenge':
    'Section=combat ' +
    'Note="Self inflicts +%{levels.Cavalier} HP damage on chosen foe and suffers -2 AC against other foes %{(levels.Cavalier+2)//3}/dy"',
  'Demanding Challenge':
    'Section=combat Note="Challenged target suffers -2 AC from others"',
  'Expert Trainer':
    'Section=skill ' +
    'Note="+%{levels.Cavalier//2} Handle Animal (any mount)/May teach mount in 1/7 time (DC +5)"',
  'For The Faith':
    'Section=combat ' +
    'Note="R30\' May give self +%{charismaModifier>?1} attack and allies +%{charismaModifier//2>?1} attack for 1 rd %{levels.Cavalier//4-1}/dy"',
  'For The King':
    'Section=combat ' +
    'Note="R30\' May give allies +%{charismaModifier} attack and damage for 1 rd 1/combat"',
  'Greater Banner':
    'Section=combat ' +
    'Note="R60\' Allies gain +2 save vs. charm and compulsion/Waving banner gives allies additional save vs. spell or effect"',
  'Greater Tactician':'Section=feature Note="Gain 1 Teamwork feat"',
  "Knight's Challenge":
    'Section=combat ' +
    'Note="Gain additional daily challenge w/+%{charismaModifier} attack and damage and +4 to confirm crit"',
  "Lion's Call":
    'Section=combat ' +
    'Note="R60\' May give allies +%{charismaModifier} save vs. fear and +1 attack for %{levels.Cavalier} rd and immediate save vs. frightened or panicked"',
  'Master Tactician':'Section=feature Note="Gain 1 Teamwork feat/May use Tactician to share 2 Teamwork feats w/allies"',
  'Mighty Charge':
    'Section=combat ' +
    'Note="Dbl threat range during mounted charge/Free bull rush, disarm, sunder, or trip w/out AOO after successful mounted charge"',
  'Moment Of Triumph':
    'Section=feature ' +
    'Note="May automatically confirm crit and gain +%{charismaModifier} on ability checks, attack, damage, saves, skill checks, and AC for 1 rd 1/dy"',
  'Mount':'Section=companion,feature,skill ' +
    'Note=' +
      '"Mount has Light Armor Proficiency feature but lacks Share Spells feature",' +
      '"Has Animal Companion feature w/mount",' +
      '"No Ride armor check penalty w/mount"',
  'Mounted Mastery':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+4 AC vs. attack set against mounted charge/+%{((animalCompanionStats.Str||10)-10)//2} mounted charge damage",' +
      '"Gain 1 Order Of The Sword feat",' +
      '"No armor check penalty for Ride"',
  'Order':'Section=feature Note="1 Selection"',
  'Order Of The Cockatrice':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} HP damage vs. challenge target",' +
      '"Must put own interest above others\'",' +
      '"Appraise is a class skill/Perform is a class skill/+%{charismaModifier} DC to intimidate"',
  'Order Of The Dragon':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Allies gain +%{levels.Cavalier//4+1} attack on threatened challenge target",' +
      '"Must defend allies",' +
      '"Perception is a class skill/Survival is a class skill/+%{levels.Cavalier//2>?1} Survival (care for allies)"',
  'Order Of The Lion':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} AC vs. challenge target",' +
      '"Must defend and obey sovereign",' +
      '"Knowledge (Local) is a class skill/Knowledge (Nobility) is a class skill/May use Knowledge (Nobility) untrained/+%{levels.Cavalier//2>?1} Knowledge (Nobility) (sovereign)"',
  'Order Of The Shield':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} attack vs. challenge target for 1 min if target attacks another",' +
      '"Must defend the lives and prosperity of common folk",' +
      '"Heal is a class skill/Knowledge (Local) is a class skill/+%{levels.Cavalier//2>?1} Heal (others)"',
  'Order Of The Star':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} saves while threatening challenge target",' +
      '"Must protect and serve the faithful",' +
      '"Heal is a class skill/Knowledge (Religion) is a class skill/May use Knowledge (Religion) untrained/+%{levels.Cavalier//2>?1} Knowledge (Religion) (chosen faith)"',
  'Order Of The Sword':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} mounted attack vs. challenge target",' +
      '"Must show honor, mercy, and charity",' +
      '"Knowledge (Nobility) is a class skill/Knowledge (Religion) is a class skill/+%{levels.Cavalier//2>?1} Sense Motive (oppose Bluff)"',
  'Protect The Meek':
    'Section=combat ' +
    'Note="May take immediate move and attack; staggered for 1 rd afterward"',
  'Resolute':
    'Section=combat ' +
    'Note="May convert %{(levels.Cavalier+2)//4} HP damage per attack to nonlethal when wearing heavy armor"',
  'Retribution':
    'Section=combat ' +
    'Note="May make +2 AOO against adjacent foe who strikes self or follower of the same faith 1/rd"',
  'Shield Of The Liege':
    'Section=combat ' +
    'Note="Adjacent allies gain +2 AC/May redirect attack on adjacent ally to self"',
  'Steal Glory':
    'Section=combat ' +
    'Note="May make AOO against threatened target when ally scores a critical hit"',
  'Stem The Tide':
    'Section=feature ' +
    'Note="Has Stand Still features; may halt foe using attack instead of maneuver"',
  'Strategy':
    'Section=combat ' +
    'Note="R30\' May give each ally +2 AC for 1 rd, +2 attack for 1 rd, or immediate move 1/combat"',
  'Supreme Charge':
    'Section=combat ' +
    'Note="Mounted charge inflicts dbl damage (lance triple)/Critical hit on mounted charge inflicts stunned (DC %{baseAttack+10} Will staggered) for 1d4 rd"',
  'Tactician':
    'Section=feature ' +
    'Note="Gain 1 Teamwork feat/R30\' may share Teamwork feat w/allies for %{levels.Cavalier//2+3} rd %{levels.Cavalier//5+1}/dy"',

  // Inquisitor
  'Bane':
    'Section=combat ' +
    'Note="Gains +2 attack and +%Vd6 HP damage with chosen weapon vs. specified creature type for %{levels.Inquisitor} rd/dy"',
  'Cunning Initiative':'Section=combat Note="+%V Initiative"',
  'Detect Alignment':
    'Section=magic ' +
    'Note="May cast <i>Detect Chaos</i>, <i>Detect Good</i>, <i>Detect Evil</i>, <i>Detect Law</i> at will"',
  'Discern Lies':
    'Section=magic ' +
    'Note="May use <i>Discern Lies</i> effects %{levels.Inquisitor}/dy"',
  'Domain (Inquisitor)':'Section=feature Note="1 Selection"',
  'Exploit Weakness':
    'Section=combat ' +
    'Note="Critical hit ignores DR, negates regeneration for 1 rd/+1 HP energy damage/die vs. vulnerable foe"',
  'Greater Bane':'Section=combat Note="Increased Bane effects"',
  'Judgment':
    'Section=combat ' +
    'Note="May pronounce one of these judgments, gaining specified bonus, %{(levels.Inquisitor+2)//3}/dy: destruction (+%{(levels.Inquisitor+3)//3} weapon damage), healing (regains +%{(levels.Inquisitor+3)//3} HP/rd), justice (+%{(levels.Inquisitor+5)//5} attack%{levels.Inquisitor>=10 ? \', dbl to confirm crit\' : \'\'}), piercing (+%{(levels.Inquisitor+3)//3} concentration and caster level to overcome spell resistance), protection (+%{levels.Inquisitor+5)//5} AC%{levels.Inquisitor>=10 ? \', dbl vs. confirm crit\' : \'\'}), purity (+%{(levels.Inquisitor+5)//5} saves%{levels.Inquisitor>=10 ? \', dbl vs. curses, disease, and poison\' : \'\'}), resiliency (gain DR %{(levels.Inquisitor+5)//5}/%{levels.Inquisitor>=10 ? \'opposed alignment\' : \'magic\'}), resistance (resistance %{2+levels.Inquisitor//3*2} to chosen energy), smiting (weapons count as magic%{levels.Inquisitor>=6 ? \', aligned\' : \'\'}%{levels.Inquisitor>=10 ? \', adamantine\' : \'\'} to overcome DR)"',
  'Monster Lore':
    'Section=skill ' +
    'Note="+%{wisdomModifier} Knowledge (identify creature abilities and weaknesses)"',
  'Orisons':'Section=magic Note="Knows level-0 spells"',
  'Second Judgment':'Section=combat Note="May use 2 judgments simultaneously"',
  'Slayer':
    'Section=combat ' +
    'Note="Effects of choice of judgment increase to: destruction (+%{(levels.Inquisitor+8)//3} weapon damage), healing (regains +%{(levels.Inquisitor+8)//3} HP/rd), justice (+%{(levels.Inquisitor+10)//5} attack), piercing (+%{(levels.Inquisitor+8)//3} concentration and caster level to overcome spell resistance), protection (+%{levels.Inquisitor+10)//5} AC), purity (+%{(levels.Inquisitor+10)//5} saves), resiliency (gain DR %{(levels.Inquisitor+10)//5}/opposed alignment), resistance (resistance %{2+levels.Inquisitor//8*2} to chosen energy)"',
  'Solo Tactics':
    'Section=combat Note="All allies count for Teamwork feat bonuses"',
  'Stalwart':
    'Section=save ' +
    'Note="Successful Fortitude or Will save yields no damage instead of half (heavy armor neg)"',
  'Stern Gaze':'Section=skill Note="+%V Intimidate/+%V Sense Motive"',
  'Teamwork Feat':'Section=feature Note="Gains %V Teamwork feats"',
  'Third Judgment':'Section=combat Note="May use 3 judgments simultaneously"',
  // 'Track' in Pathfinder.js
  'True Judgment':
    'Section=combat ' +
    'Note="Successful judgment attack kills foe (DC %{10+levels.Inquisitor//2+wisdomModifier} Fort neg) 1/1d4 rd"',

  // Oracle
  'Acid Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : levels.Oracle>=5 ? \'Resistance 10\' : \'Resistance 5\'} to acid"',
  'Air Barrier':
    'Section=combat ' +
    'Note="Conjured air shell gives +%{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \' and foe 50% ranged miss chance\' : \'\'} for %{levels.Oracle} hr/dy"',
  'Arcane Archivist (Oracle)':
    'Section=magic ' +
    'Note="May cast Sorcerer/Wizard spell from lore book using +1 spell slot 1/dy"',
  'Armor Of Bones':
    'Section=combat ' +
    'Note="Conjured armor gives +%{(levels.Oracle+5)//4*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/bludgeoning\' : \'\'} for %{levels.Oracle} hr/dy"',
  'Automatic Writing':
    'Section=magic ' +
    'Note="1 hr meditation yields results of %{levels.Oracle>=8 ? \'<i>Commune</i>\' : levels.Oracle>=5 ? \'<i>Divination</i> (90% effective)\' : \'<i>Augury</i> (90% effective)\'} spell 1/dy"',
  'Awesome Display':
    'Section=magic ' +
    'Note="Treat illusion targets as having %{charismaModifier>?0} fewer HD"',
  'Battle Mystery':
    'Section=skill ' +
    'Note="Intimidate is a class skill/Knowledge (Engineering) is a class skill/Perception is a class skill/Ride is a class skill"',
  'Battlecry':
    'Section=combat ' +
    'Note="R100\' Allies gain +%{levels.Oracle>=10 ? 2 : 1} attack, skill checks, and saves for %{charismaModifier} rd %{(levels.Oracle+5)//5}/dy"',
  'Battlefield Clarity':
    'Section=save ' +
    'Note="May make +4 reroll on failed save vs. blind, deaf, frightened, panicked, paralyzed, shaken, or stunned %{levels.Oracle>=15 ? 3 : levels.Oracle>=7 ? 2 : 1}/dy"',
  'Bleeding Wounds':
    'Section=magic ' +
    'Note="Successful negative energy spell inflicts %{(levels.Oracle+5)//5} HP bleeding/rd (DC 15 Heal or healing effect ends)"',
  'Blizzard':
    'Section=combat ' +
    'Note="%{levels.Oracle} 10\' cu inflict %{levels.Oracle}d4 HP cold (DC %{10+levels.Oracle//2+charismaModifier} Ref half) and reduces vision to 5\' for %{charismaModifier} rd 1/dy"',
  'Bonded Mount':'Section=feature Note="Has Animal Companion feature w/mount"',
  'Bones Mystery':
    'Section=skill ' +
    'Note="Bluff is a class skill/Disguise is a class skill/Intimidate is a class skill/Stealth is a class skill"',
  'Brain Drain':
    'Section=feature ' +
    'Note="R100\' Mental probe inflicts %{levels.Oracle}d4 HP and yields 1 Knowledge check/rd at target\'s bonus (Will neg) for %{charismaModifier} rd %{(levels.Oracle+5)//5}/dy"',
  'Burning Magic':
    'Section=magic ' +
    'Note="Successful fire spell inflicts 1 HP/spell level fire for 1d4 rd (DC %{10+levels.Oracle//2+charismaModifier} Ref ends)"',
  'Channel':'Section=feature Note="Has Channel Energy feature"',
  'Cinder Dance':
    'Section=ability,feature ' +
    'Note=' +
      '"+10 Speed",' +
      '"Has %V features"',
  'Clobbering Strike':
    'Section=magic ' +
    'Note="May make swift action trip attempt w/out AOO after critical hit w/attack spell"',
  'Clouded Vision':
    'Section=feature ' +
    'Note="Has %{levels.Oracle>=5? 60 : 30}\' vision and darkvision%{levels.Oracle>=10 ? \\", 30\' Blindsense\\" : \'\'}%{levels.Oracle>=15 ? \\", 15\' Blindsight\\" : \'\'}"',
  'Coat Of Many Stars':
    'Section=combat ' +
    'Note="Conjured coat gives +%{(levels.Oracle+5)//4*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/slashing\' : \'\'} for %{levels.Oracle} hr/dy"',
  'Combat Healer':
    'Section=feature ' +
    'Note="May use two spell slots to cast quickened Cure spell %{(levels.Oracle-3)//4}/dy"',
  'Crystal Sight':
    'Section=feature ' +
    'Note="Can see through %{levels.Oracle}\' earth and %{levels.Oracle}\\" metal for %{levels.Oracle} rd/dy"',
  'Deaf':
    'Section=combat,feature,magic,skill ' +
    'Note=' +
      '"%V Initiative",' +
      '"Cannot hear%1",' +
      '"May cast all spells silently",' +
      '"Automatically fails Perception (sound)/-4 opposed Perception%{levels.Oracle>=5 ? \'/+3 Perception (non-sound)\' : \'\'}"',
  "Death's Touch":
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP negative energy (undead heals and gives +2 channel resistance for 1 min) %{charismaModifier+3}/dy"',
  'Delay Affliction':
    'Section=save ' +
    'Note="May delay effects of failed save vs. disease or poison for %{levels.Oracle} hr %{levels.Oracle>=15 ? 3 : levels.Oracle >= 7 ? 2 : 1}/dy"',
  'Dweller In Darkness':
    'Section=magic ' +
    'Note="Can use <i>Phantasmal Killer</i> effects%{levels.Oracle>=17 ? \' on multiple targets\' : \'\'} 1/dy"',
  'Earth Glide (Oracle)':
    'Section=ability ' +
    'Note="Can move at full speed through earth, leaving no trace, %{levels.Oracle} min/dy; including others uses equal portion of daily time"',
  'Energy Body':
    'Section=feature ' +
    'Note="Energy form lights 10\' radius, inflicts 1d6+%{levels.Oracle} HP positive energy when undead hits self w/melee attack, and heals target 1d6+%{levels.Oracle} HP 1/rd for %{levels.Oracle} rd/dy"',
  'Enhanced Cures':
     'Section=magic ' +
     'Note="Level-based healing by Cure spells gives %{levels.Oracle} HP"',
  'Erosion Touch':
    'Section=combat ' +
    'Note="Touch inflicts %{levels.Oracle}d6 HP to objects and constructs %{levels.Oracle//3+1}/dy"',
  'Final Revelation (Battle Mystery)':
    'Section=combat ' +
    'Note="May take full-attack action and move %{speed}\' as full-round action/Critical hits ignore DR/+4 AC vs. critical hits/Remain alive until -%{constitution*2} HP"',
  'Final Revelation (Bones Mystery)':
    'Section=combat,magic ' +
    'Note=' +
      '"Automatically stabilize at negative HP",' +
      '"May cast <i>Bleed</i> or <i>Stabilize</i> 1/rd, <i>Animate Dead</i> at will, and <i>Power Word Kill</i> vs. target w/up to 150 HP 1/dy"',
  'Final Revelation (Flame Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to fire spells w/out cost"',
  'Final Revelation (Heavens Mystery)':
    'Section=combat,feature,save ' +
    'Note=' +
      '"Automatically stabilize at negative HP/Automatically confirm crit",' +
      '"Automatically reborn 3 dy after death",' +
      '"+%V Fortitude/+%V Reflex/+%V Will/Immune to fear"',
  'Final Revelation (Life Mystery)':
    'Section=combat,save ' +
    'Note=' +
      '"Remain alive until -%{constitution*2} HP",' +
      '"Immune to bleed, death attack, exhausted, fatigued, nauseated effects, negative levels, and sickened effects/Ability scores cannot be drained below 1/Automatic save vs. massive damage"',
  'Final Revelation (Lore Mystery)':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Wish</i> 1/dy",' +
      '"May take 20 on all Knowledge"',
  'Final Revelation (Nature Mystery)':
    'Section=feature ' +
    'Note="Cocooning for 8 hr changes creature type, removes poisons and diseases, and restores HP and abilities 1/dy"',
  'Final Revelation (Stone Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to acid and earth spells w/out cost"',
  'Final Revelation (Waves Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to water and cold spells w/out cost"',
  'Final Revelation (Wind Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to air and electricity spells w/out cost"',
  'Fire Breath':
    'Section=combat ' +
    'Note="15\' cone inflicts %{levels.Oracle}d4 HP fire (DC %{10+levels.Oracle//2+charismaModifier} Ref half) %{1+levels.Oracle//5}/dy"',
  'Firestorm':
    'Section=combat ' +
    'Note="%{levels.Oracle} adjacent 10\' cu inflict %{levels.Oracle}d6 HP fire (DC %{10+levels.Oracle//2+charismaModifier} Ref half) for %{charismaModifier} rd 1/dy"',
  'Flame Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Climb is a class skill/Intimidate is a class skill/Perform is a class skill"',
  'Fluid Nature':
    'Section=combat,feature ' +
    'Note=' +
      '"+4 CMD vs. bull rush, drag, grapple, reposition, and trip/-4 Foe confirm crit",' +
      '"Has %V features"',
  'Fluid Travel':
    'Section=ability ' +
    'Note="May move full speed across liquid without contact damage%1 %{levels.Oracle} hr/dy"',
  'Focused Trance':
    'Section=skill ' +
    'Note="1d6 rd trance gives +%{levels.Oracle} save vs. sonic and gaze attack and 1 +20 intelligence skill check %{charismaModifier}/dy"',
  'Form Of Flame':
    'Section=magic ' +
    'Note="May use <i>Elemental Body %{levels.Oracle>=13 ? \'IV\' : levels.Oracle>=11 ? \'III\' : levels.Oracle>=9 ? \'II\' : \'I\'}</i> effects to become %{levels.Oracle>=13 ? \'huge\' : levels.Oracle>=11 ? \'large\' : levels.Oracle>=9 ? \'medium\' : \'small\'} fire elemental for %{levels.Oracle} hr 1/dy"',
  'Freezing Spells':
    'Section=magic ' +
    'Note="Spells that inflict cold damage slow target for 1%{levels.Oracle>=11 ? \'d4\' : \'\'} rd"',
  'Friend To The Animals':
    'Section=magic,save ' +
    'Note=' +
      '"Knows all <i>Summon Nature\'s Ally</i> spells",' +
      '"R30\' Animals gain +%{charismaModifier} on all saves"',
  'Gaseous Form':
    'Section=magic Note="May use <i>Gaseous Form</i> effects %{levels.Oracle} min/dy; including others uses equal portion of daily time"',
  'Gaze Of Flames':
    'Section=feature,magic ' +
    'Note=' +
      '"Can see through fire, fog, and smoke %{levels.Oracle} rd/dy",' +
      '"R%{levels.Oracle*10}\' Can use <i>Clairvoyance</i> effects via flame %V rd/dy"',
  'Guiding Star':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"May determine precise location under clear night sky",' +
      '"May use Empower Spell, Extend Spell, Silent Spell, or Still Spell outdoors without penalty 1/night",' +
      '"+%{charismaModifier} wisdom-linked skills under clear night sky"',
  'Haunted':
    'Section=feature,magic ' +
    'Note=' +
      '"Malevolent spirits inflict minor annoyances",' +
      '"Know %V spells"',
  'Healing Hands':
    'Section=skill ' +
    'Note="+4 Heal/May use Heal on dbl number of people simultaneously/May provide long-term care for self"',
  'Heat Aura':
    'Section=combat ' +
    'Note="10\' radius inflicts %{levels.Oracle>?1}d4 HP fire (DC %{10+levels.Oracle//2+charismaModifier} half), gives self 20% concealment for 1 rd %{(levels.Oracle+5)//5}/dy"',
  'Heavens Mystery':
    'Section=skill ' +
    'Note="Fly is a class skill/Knowledge (Arcana) is a class skill/Perception is a class skill/Survival is a class skill"',
  'Ice Armor':
    'Section=combat ' +
    'Note="Conjured armor gives +%{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \' and DR 5/piercing\' : \'\'} (+2 in cold, -2 in heat) for %{levels.Oracle} hr/dy"',
  'Icy Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : levels.Oracle>=5 ? \'Resistance 10\' : \'Resistance 5\'} to cold"',
  'Interstellar Void':
    'Section=combat ' +
    'Note="R30\' Inflicts %{levels.Oracle}d6 HP cold%{levels.Oracle>=15 ? \', exhausted, stunned 1 rd\' : levels.Oracle>=10 ? \', fatigued\' : \'\'} (DC %{10+levels.Oracle//2+charismaModifier} Fort half HP only) %{levels.Oracle>=10 ? 2 : 1}/dy"',
  'Invisibility':
    'Section=magic ' +
    'Note="May use <i>Invisibility</i> %{levels.Oracle} min/dy%{levels.Oracle>=9 ? \' or <i>Greater Invisibility</i> \' + levels.Oracle + \' rd/dy\' : \'\'}"',
  'Iron Skin':
    'Section=magic ' +
    'Note="Self <i>Stoneskin</i> gives DR 10/adamantine %{levels.Oracle>=15 ? 2 : 1}/dy"',
  'Lame':
    'Section=ability,save ' +
    'Note=' +
      '"%V Speed/Speed is unaffected by encumbrance%1",' +
      '"Immune to %V"',
  'Life Leach':
    'Section=combat ' +
    'Note="R30\' Target suffers %{levels.Oracle<?10}d6 HP (DC %{10+levels.Oracle//2+charismaModifier} Fort half), self gains equal temporary HP for %{charismaModifier} hr %{(levels.Oracle-3)//4}/dy"',
  'Life Link':
    'Section=combat ' +
    'Note="R%{levels.Oracle*10+100}\' May establish bond with up to %{levels.Oracle} targets that transfers 5 HP/rd damage to self"',
  'Life Mystery':
    'Section=skill ' +
    'Note="Handle Animal is a class skill/Knowledge (Nature) is a class skill/Survival is a class skill"',
  'Lifesense':'Section=feature Note="Has 30\' Blindsight"',
  'Lightning Breath':
    'Section=combat ' +
    'Note="30\' line inflicts %{levels.Oracle}d4 HP electricity (DC %{10+levels.Oracle//2+charismaModifier} Ref half) %{levels.Oracle//5+1}/dy"',
  'Lore Mystery':
    'Section=skill ' +
    'Note="Appraise is a class skill/Knowledge is a class skill"',
  'Lore Keeper (Oracle)':'Section=skill Note="+%1 all Knowledge"',
  'Lure Of The Heavens':
    'Section=feature,magic ' +
    'Note=' +
      '"Leaves no tracks",' +
      '"May use <i>Levitate</i> effects to hover 6\\" at will%1"',
  'Maneuver Mastery':
    'Section=combat,feature ' +
    'Note=' +
      '"+%{levels.Oracle - levels.Oracle*3//4} on chosen combat maneuver",' +
      '"+%V General Feat (Improved %{levels.Oracle>=11 ? \' and Greater\' : \'\'} combat maneuver)"',
  'Mantle Of Moonlight':
    'Section=combat,save ' +
    'Note=' +
      '"Touch forces lycanthrope target into human form%{levels.Oracle>=5 ? \' or inflicts rage\' : \'\'} for %{levels.Oracle} rd %{levels.Oracle//5>?1}/dy",' +
      '"Immune to lycanthropy"',
  'Mental Acuity':'Section=ability Note="+%V Intelligence"',
  'Mighty Pebble':
    'Section=combat ' +
    'Note="R20\' Thrown pebble +%{levels.Oracle//4} attack inflicts %{levels.Oracle//2>?1}d6, half in 5\' radius (DC %{10+levels.Oracle//2+charismaModifier} Ref neg) %{(levels.Oracle+5)//5}/dy"',
  'Molten Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : levels.Oracle>=5 ? \'Resistance 10\' : \'Resistance 5\'} to fire"',
  'Moonlight Bridge':
    'Section=magic ' +
    'Note="10\' x %{levels.Oracle*10}\' span provides passage for 1 dy or until self crosses %{charismaModifier}/dy"',
  'Mystery':'Section=feature Note="1 Selection"',
  'Natural Divination':
    'Section=feature ' +
    'Note="10 min nature study grants 1 +%{charismaModifier} save, +10 skill check, or +1 Initiative w/in 1 dy %{levels.Oracle//4+1}/dy"',
  'Nature Mystery':
    'Section=skill ' +
    'Note="Climb is a class skill/Fly is a class skill/Knowledge (Nature) is a class skill/Ride is a class skill/Survival is a class skill/Swim is a class skill"',
  "Nature's Whispers":'Section=combat Note="+%V AC/+%V CMD"',
  'Near Death':
    'Section=save ' +
    'Note="+%{levels.Oracle>=11 ? 4 : 2} vs. disease, mental effects, poison%{levels.Oracle>=7 ? \', death effects, sleep effects, stunning\' : \'\'}"',
  "Oracle's Curse":'Section=feature Note="1 Selection"',
  // Orisons as Inquisitor
  'Punitive Transformation':
    'Section=magic ' +
    'Note="May use <i>Baleful Polymorph</i> effects, lasting %{levels.Oracle} rd, to transform target into harmless animal %{charismaModifier}/dy"',
  'Raise The Dead':
    'Section=magic ' +
    'Note="Summoned %{levels.Oracle} HD %{levels.Oracle>= 15 ? \'advanced skeleton or zombie\' : levels.Oracle>=7 ? \'bloody skeleton or fast zombie\' : \'skeleton or zombie\'} serves for %{charismaModifier} rd %{levels.Oracle>=10 ? 2 : 1}/dy"',
  'Resiliency (Oracle)':
    'Section=combat,feature ' +
    'Note=' +
      '"Not disabled or staggered at 0 HP%{levels.Oracle>=11 ? \'/No HP loss from taking action while disabled\' : \'\'}",' +
      '"Has %V features"',
  'Resist Life':
    'Section=save ' +
    'Note="Save as undead vs. negative and positive energy%{levels.Oracle>=7 ? \' w/+\' + (levels.Oracle>=15 ? 6 : levels.Oracle>=11 ? 4 : 2) + \' channel resistance\' : \'\'}"',
  'Revelation':'Section=feature Note="%V Selections"',
  'Rock Throwing':
    'Section=combat ' +
    'Note="R20\' Thrown rock +1 attack inflicts 2d%{features.Small ? 3 : 4}+%{(strengthModifier*1.5)//1} HP"',
  'Safe Curing':'Section=magic Note="Cure spells do not provoke AOO"',
  'Shard Explosion':
    'Section=combat ' +
    'Note="10\' radius inflicts %{levels.Oracle//2>?1}d6 HP piercing (DC %{10+levels.Oracle//2+charismaModifier} Ref half) and difficult terrain for 1 rd %{levels.Oracle//5+1}/dy"',
  'Sidestep Secret':
    'Section=combat,save ' +
    'Note=' +
      '"Dexterity Armor Class adjustment uses Charisma instead",' +
      '"Dexterity Reflex adjustment uses Charisma instead"',
  'Skill At Arms':
    'Section=combat ' +
    'Note="Weapon Proficiency (Martial)/Armor Proficiency (Heavy)"',
  'Soul Siphon':
    'Section=magic ' +
    'Note="R30\' Ranged touch inflicts negative level for %{charismaModifier} min, heals %{levels.Oracle} HP to self %{(levels.Oracle-3)//4}/dy"',
  'Spark Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : levels.Oracle>=5 ? \'Resistance 10\' : \'Resistance 5\'} to electricity"',
  'Speak With Animals (Oracle)':
    'Section=magic ' +
    'Note="May converse at will with %{levels.Oracle//3+1} chosen animal types"',
  'Spirit Boost':
    'Section=magic ' +
    'Note="Up to %{levels.Oracle} excess HP from Cure spell become temporary HP for 1 rd"',
  'Spirit Of Nature':
    'Section=combat ' +
    'Note="At negative HP%{levels.Oracle<10 ? \' in natural setting\' : \'\'}, stabilize automatically%{levels.Oracle>=15 ? \' and gain fast healing 3 for 1d4 rd\' : levels.Oracle>=5 ? \' and gain fast healing 1 for 1d4 rd\' : \'\'}"',
  'Spirit Walk':
    'Section=magic ' +
    'Note="May become incorporeal for %{levels.Oracle} rd %{levels.Oracle>=15 ? 2 : 1}/dy"',
  'Spontaneous Symbology':
    'Section=magic Note="May use spell slot to cast any <i>Symbol</i> spell"',
  'Spray Of Shooting Stars':
    'Section=combat ' +
    'Note="R60\' 5\' radius inflicts %{levels.Oracle}d4 fire (DC %{10+levels.Oracle//2+charismaModifier} Ref half) %{(levels.Oracle+5)//5}/dy"',
  'Star Chart':
    'Section=magic ' +
    'Note="May use <i>Commune</i> effects via 10 min contemplation 1/dy"',
  'Steelbreaker Skin':
    'Section=combat ' +
    'Note="Skin inflicts %{levels.Oracle} HP on striking weapon%{levels.Oracle>=15 ? \', ignoring 10 points of hardness,\' : \'\'} for %{levels.Oracle} min 1/dy"',
  'Stone Mystery':
    'Section=skill ' +
    'Note="Appraise is a class skill/Climb is a class skill/Intimidate is a class skill/Survival is a class skill"',
  'Stone Stability':
    'Section=combat,feature ' +
    'Note=' +
      '"+4 CMD vs. bull rush and trip while standing on ground",' +
      '"Has %V"',
  'Surprising Charge':
    'Section=combat ' +
    'Note="May make immediate move %{levels.Oracle>=15 ? 3 : levels.Oracle>=7 ? 2 : 1}/dy"',
  'Think On It':
    'Section=skill Note="May make +10 reroll on failed Knowledge 1/day"',
  'Thunderburst':
    'Section=combat ' +
    'Note="R100\' %{(levels.Oracle+9)//4*5>?20}\' radius inflicts %{levels.Oracle}d6 HP bludgeoning and 1 hr deafness (DC %{10+levels.Oracle//2+charismaModifier} Fort half HP only) %{(levels.Oracle-3)//4>?1}/dy"',
  'Tongues':
    'Section=combat,skill ' +
    'Note=' +
      '"Can speak only chosen outsider or elemental language during combat",' +
      '"+%V Language Count%1"',
  'Touch Of Acid':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP acid %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'; wielded weapons inflict +1d6 HP acid\' : \'\'}"',
  'Touch Of Electricity':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP electricity %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'; wielded weapons have <i>shock</i> property\' : \'\'}"',
  'Touch Of Flame':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP fire %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'/Wielded weapons have <i>flaming</i> property\' : \'\'}"',
  'Transcendental Bond':
    'Section=magic ' +
    'Note="May use <i>Telepathic Bond</i> effects%{levels.Oracle>=10 ? \' and cast touch spell\' : \'\'} on %{charismaModifier} allies %{levels.Oracle} rd/dy"',
  'Undead Servitude':'Section=magic Note="May use Command Undead %V/dy"',
  'Undo Artifice':
    'Section=feature ' +
    'Note="May disintegrate nonliving item into raw materials (DC %{10+levels.Oracle//2+charismaModifier} Fort neg) %{charismaModifier}/dy"',
  'Voice Of The Grave':
    'Section=magic ' +
    'Note="May use <i>Speak With Dead</i> effects (DC %{spellDifficultyClass.O + 3 + levels.Oracle//5*2} Will neg) %{levels.Oracle} rd/dy"',
  'Vortex Spells':
    'Section=magic ' +
    'Note="Critical hit with spell staggers target for 1%{levels.Oracle>=11 ? \'d4\' : \'\'} rd"',
  'War Sight':
    'Section=combat ' +
    'Note="May take choice of %{levels.Oracle>=11 ? 3 : 2} Initiative rolls%{levels.Oracle>=7 ? \'/May always act in surprise round\' : \'\'}"',
  'Wasting':
    'Section=save,skill ' +
    'Note=' +
      '"%{levels.Oracle>=10 ? \'Immune to\' : \'+4 vs.\'} disease%{levels.Oracle>=5 ? \'/Immune to sickened\' : \'\'}%{levels.Oracle>=15 ? \' and nauseated\' : \'\'}",' +
      '"-4 Charisma-based skills other than Intimidate"',
  'Water Form':
    'Section=magic ' +
    'Note="May use <i>Elemental Body %{levels.Oracle>=13 ? \'IV\' : levels.Oracle>=11 ? \'III\' : levels.Oracle>=9 ? \'II\' : \'I\'}</i> effects to become %{levels.Oracle>=13 ? \'huge\' : levels.Oracle>=11 ? \'large\' : levels.Oracle>=9 ? \'medium\' : \'small\'} water elemental for %{levels.Oracle} hr 1/dy"',
  'Water Sight':
    'Section=feature,magic ' +
    'Note=' +
      '"Can see normally through fog and mist",' +
      '"May use <i>%V</i> effects via pool %{levels.Oracle} rd/dy"',
  'Waves Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Knowledge (Nature) is a class skill/Swim is a class skill"',
  'Weapon Mastery':
    'Section=feature Note="+%V General Feat (Weapon Focus%1 with chosen weapon)"',
  'Whirlwind Lesson':
    'Section=magic Note="May absorb lesson from magical tome in 8 hr%1"',
  'Wind Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Fly is a class skill/Stealth is a class skill"',
  'Wind Sight':
    'Section=magic,skill ' +
    'Note=' +
      '"May use <i>Clairaudience</i> and <i>Clairvoyance</i> effects on any unobstructed area %V rd/dy",' +
      '"Ignore Perception wind penalties and 100\' distance penalties"',
  'Wings Of Air':'Section=ability Note="Fly %{levels.Oracle>=10 ? 90 : 60}\' for %{levels.Oracle} min/dy"',
  'Wings Of Fire':'Section=ability Note="Fly 60\' %{levels.Oracle} min/dy"',
  'Wintry Touch':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP cold %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'; wielded weapons have <i>frost</i> property\' : \'\'}"',

  // Summoner
  'Ability Increase Evolution':
    'Section=companion Note="+2 each on %V chosen abilit%1"',
  'Ability Score Increase':
    'Section=companion ' +
    'Note="+%{levels.Summoner>=15 ? 3 : levels.Summoner>=10 ? 2 : 1} distributed among eidolon abilities"',
  'Aspect':'Section=feature Note="May apply %V evolution points to self"',
  'Bite Evolution':
    'Section=companion ' +
    'Note="Bite attack inflicts %{eidolonDamage}+%{eidolonPrimaryDamageBonus} HP"',
  'Blindsense Evolution':
    'Section=companion Note="R30\' May detect unseen creatures"',
  'Blindsight Evolution':
    'Section=companion ' +
    'Note="R30\' Unaffected by darkness or foe invisibility or concealment"',
  'Bond Senses':
    'Section=feature ' +
    'Note="May use eidolon senses for %{levels.Summoner} rd/dy"',
  'Breath Weapon Evolution':
    'Section=companion ' +
    'Note="30\' cone or 60\' line inflicts %{animalCompanionStats.HD}d6 HP of chosen energy type (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Con-10)//2} Ref half) %V/dy"',
  'Burrow Evolution':
    'Section=companion Note="May burrow through earth at %V\'"',
  'Cantrips':'Section=magic Note="May cast 0-level spells"',
  'Claws Evolution':
    'Section=companion ' +
    'Note="Claw attacks inflicts %{eidolonDamageMinor}+%{eidolonPrimaryDamageBonus} HP each"',
  'Climb Evolution':'Section=companion Note="%V\' Climb"',
  'Companion Darkvision':'Section=companion Note="60\' b/w vision in darkness"',
  'Constrict Evolution':
    'Section=companion Note="Successful grapple gives dbl grab damage"',
  'Damage Reduction Evolution':
    'Section=companion Note="DR %V/opposite alignment"',
  'Eidolon':'Section=feature Note="Special bond and abilities"',
  'Energy Attacks Evolution':
    'Section=companion ' +
    'Note="Natural attack inflicts 1d6 HP of chosen energy type"',
  'Fast Healing Evolution':'Section=companion Note="Heals %V HP/rd"',
  'Flight Evolution':'Section=companion Note="%V\' Fly"',
  'Frightful Presence Evolution':
    'Section=companion ' +
    'Note="R30\' Foes suffer frightened (up to %{animalCompanionStats.HD-4} HD) or shaken (up to %{animalCompanionStats.HD} HD) (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Cha-10)//2} Will neg)"',
  'Gills Evolution':'Section=companion Note="May breathe underwater"',
  'Gore Evolution':
    'Section=companion ' +
    'Note="Horn attack inflicts %{eidolonDamage}+%{eidolonPrimaryDamageBonus} HP"',
  'Grab Evolution':
    'Section=companion ' +
    'Note="Successful chosen natural attack allows free combat maneuver to grapple/+4 grapple CMB"',
  'Greater Aspect':'Section=feature Note="Increased Aspect Effects"',
  'Greater Shield Ally (Summoner)':
    'Section=combat,save ' +
    'Note=' +
      '"+2 ally AC (+4 self) when eidolon is within reach",' +
      '"+2 ally saves (+4 self) when eidolon is within reach"',
  'Immunity Evolution':
    'Section=companion Note="Immune to each of %V chosen energy type(s)"',
  'Improved Damage Evolution':
    'Section=companion ' +
    'Note="Choice of %V natural attacks each inflict damage 1 die type higher"',
  'Improved Natural Armor Evolution':
    'Section=companion Note="+%V natural armor"',
  'Large Evolution':
    'Section=companion ' +
    'Note="Size is %V: gains +%1 Str, +%2 Con, +%3 AC, +%4 CMB/CMD, and %5\' reach; suffers %6 Dex, %7 Attack, %8 Fly, %9 Stealth"',
  'Life Bond':
    'Section=combat ' +
    'Note="Damage that would reduce self to negative HP transferred to eidolon"',
  'Life Link (Summoner)':
    'Section=combat ' +
    'Note="May transfer damage from eidolon to self to negate forced return to home plane; eidolon must stay w/in 100\' to have full HP"',
  'Limbs (Arms) Evolution':'Section=companion Note="Has %V pairs of arms"',
  'Limbs (Legs) Evolution':
    'Section=companion Note="Has %V pairs of legs; +%1 speed"',
  'Link (Summoner)':
    'Section=companion ' +
    'Note="May communicate w/eidolon over any distance/Shares magic item slots w/eidolon"',
  'Magic Attacks Evolution':
    'Section=companion ' +
    'Note="Natural attacks count as magic%{levels.Summoner>=10 ? \' and aligned\' : \'\'}"',
  "Maker's Call":
    'Section=magic ' +
    'Note="May use <i>Dimension Door</i> effects to bring eidolon adjacent %{(levels.Summoner - 2) // 4}/dy"',
  'Merge Forms':
    'Section=combat ' +
    'Note="May merge into eidolon, becoming protected from harm, for %{levels.Summoner} rd/dy"',
  'Mount Evolution':'Section=companion Note="Self may ride eidolon"',
  'Pincers Evolution':
    'Section=companion ' +
    'Note="Pincer attacks inflict %{eidolonDamage}+%{eidolonSecondaryDamageBonus} HP each"',
  'Poison Evolution':
    'Section=companion ' +
    'Note="Chosen natural attack inflicts +1d4 %V damage (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Con-10)//2} Fort neg) 1/rd"',
  'Pounce Evolution':
    'Section=companion Note="May make full attack after charge"',
  'Pull Evolution':
    'Section=companion ' +
    'Note="Choice of %V natural attacks each allow free combat maneuver for 5\' pull"',
  'Push Evolution':
    'Section=companion ' +
    'Note="Choice of %V natural attacks each allow free combat maneuver for 5\' push"',
  'Rake Evolution':
    'Section=companion ' +
    'Note="Claw rake on grappled foe inflicts 2 x %{eidolonDamageMinor}+%{eidolonPrimaryDamageBonus} HP"',
  'Reach Evolution':
    'Section=companion Note="Choice of %V attacks each gains +5\' reach"',
  'Resistance Evolution':
    'Section=companion ' +
    'Note="Resistance %{(levels.Summoner+5)//5*5<?15} to %V chosen energy type(s)"',
  'Rend Evolution':
    'Section=companion ' +
    'Note="2 successful claw attacks inflict %{eidolonDamageMinor}+%{eidolonPrimaryDamageBonus} HP"',
  'Scent Evolution':'Section=companion Note="R30\' May detect foes by smell"',
  'Share Spells (Summoner)':
    'Section=companion ' +
    'Note="May cast spells that effect self on eidolon instead"',
  'Shield Ally (Summoner)':
    'Section=combat,save ' +
    'Note=' +
      '"+2 AC when eidolon is within reach",' +
      '"+2 saves when eidolon is within reach"',
  'Skilled Evolution':
    'Section=companion Note="+8 on each of %V chosen skill(s)"',
  'Slam Evolution':
    'Section=companion ' +
    'Note="Slam attacks inflict %{eidolonDamageMajor}+%{eidolonPrimaryDamageBonus} HP each"',
  'Small Eidolon':
    'Section=companion ' +
    'Note="Size is Small: gains +2 Dex, +1 AC, +1 attack, +2 Fly, and +4 Stealth; suffers -4 Str, -2 Con, -1 CMB/CMD, -1 damage die step"',
  'Spell Resistance Evolution':
    'Section=companion Note="Has Spell Resistance %{levels.Summoner + 11}"',
  'Sting Evolution':
    'Section=companion ' +
    'Note="Sting attacks inflict %{eidolonDamageMinor}+%{eidolonPrimaryDamageBonus} HP each"',
  'Summon Monster':
    'Section=magic ' +
    'Note="May cast <i>Summon Monster %V</i>%{levels.Summoner>=19 ? \' or <i>Gate</i>\' : \'\'}, lasting %{levels.Summoner} min, when eidolon not present %{3 + charismaModifier}/dy"',
  'Swallow Whole Evolution':
    'Section=companion ' +
    'Note="May make combat maneuver to swallow creature grappled by bite, inflicting %{eidolonDamage}+%{eidolonPrimaryDamageBonus}+1d6 HP/rd"',
  'Swim Evolution':'Section=companion Note="%V\' Swim"',
  'Tail Evolution':'Section=companion Note="+%V Acrobatics (balance)"',
  'Tail Slap Evolution':
    'Section=companion ' +
    'Note="Slap attacks inflict %{eidolonDamage}+%{eidolonSecondaryDamageBonus} HP each"',
  'Tentacle Evolution':
    'Section=companion ' +
    'Note="Tentacle attacks inflict %{eidolonDamageMinor}+%{eidolonSecondaryDamageBonus} HP each"',
  'Trample Evolution':
    'Section=companion ' +
    'Note="Full-round automatic overrun inflicts %{eidolonDamage}+%{eidolonPrimaryDamageBonus} HP (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Str-10)//2} Ref half)"',
  'Transposition':
    'Section=magic Note="May use Maker\'s Call to swap places w/eidolon"',
  'Tremorsense Evolution':
    'Section=companion Note="R30\' Senses creatures via ground vibrations"',
  'Trip Evolution':
    'Section=companion ' +
    'Note="Successful bite allows free combat maneuver to trip"',
  'Twin Eidolon':
    'Section=feature ' +
    'Note="May take form of eidolon for %{levels.Summoner} min/dy"',
  'Weapon Training Evolution':
    'Section=companion Note="Proficient with simple%1 weapons"',
  'Web Evolution':
    'Section=companion ' +
    'Note="R50\' May entangle target (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Con-10)//2} Escape Artist or -4 Str neg) 8/dy"',
  'Wing Buffet Evolution':
    'Section=companion ' +
    'Note="Wing attacks inflict %{eidolonDamageMinor}+%{eidolonSecondaryDamageBonus} HP each"',

  // Witch
  'Agony Hex':
    'Section=magic ' +
    'Note="R60\' Target nauseated for %{levels.Witch} rd (DC %{hexDC} Fort ends) 1/target/dy"',
  'Blight Hex':
    'Section=magic ' +
    'Note="Touch kills vegetation in %{levels.Witch * 10}\' radius over 1 wk or inflicts -1 Con/dy"',
  'Cackle Hex':
    'Section=magic ' +
    'Note="R30\' Extends agony, charm, evil eye, fortune, and misfortune hex affects for 1 rd"',
  // Cantrips as Summoner
  'Cauldron Hex':
    'Section=feature,skill ' +
    'Note=' +
      '"Has Brew Potion feature",' +
      '"+4 Craft (Alchemy)"',
  'Charm Hex':
    'Section=skill ' +
    'Note="R30\' Improves attitude of target animal or humanoid by %{levels.Witch>=8 ? 2 : 1} (DC %{hexDC} Will neg) for %{intelligenceModifier} rd"',
  'Coven Hex':
    'Section=feature,magic ' +
    'Note=' +
      '"May participate in a hag coven",' +
      '"R30\' May use aid another to give target w/coven hex +1 caster level for 1 rd"',
  'Death Curse Hex':
    'Section=magic ' +
    'Note="R30\' Target becomes fatigued (DC %{hexDC} Will neg), then exhausted, then dies (DC %{hexDC} Fort suffers 4d6+%{levels.Witch} HP) 1/dy"',
  'Disguise Hex':
    'Section=magic ' +
    'Note="May use <i>Disguise Self</i> effects for %{levels.Witch} hr/dy"',
  'Eternal Slumber Hex':
    'Section=magic ' +
    'Note="Touch or poison inflicts permanent sleep (DC %{hexDC} Will neg) 1/target/dy"',
  'Evil Eye Hex':
    'Section=magic ' +
    'Note="R30\' Target suffers %{levels.Witch>=8 ? -4 : -2} on choice of AC, ability checks, attack, saves, or skill checks for %{3 + intelligenceModifier} rd (DC %{hexDC} Will 1 rd)"',
  'Familiar Centipede':'Section=skill Note="+3 Stealth"',
  'Familiar Crab':'Section=combat Note="+2 grapple CMB"',
  'Familiar Fox':'Section=save Note="+2 Reflex"',
  'Familiar Octopus':'Section=skill Note="+3 Swim"',
  'Familiar Scorpion':'Section=combat Note="+2 Initiative"',
  'Familiar Spider':'Section=skill Note="+3 Climb"',
  'Flight Hex':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Feather Fall</i> at will%1",' +
      '"+4 Swim"',
  'Forced Reincarnation Hex':
    'Section=magic ' +
    'Note="R30\' Target killed and reincarnated (DC %{hexDC} Will neg) 1/target/dy"',
  'Fortune Hex':
    'Section=magic ' +
    'Note="R30\' Target gains better of 2 rolls on choice of ability check, attack, save, or skill check 1/rd for %{levels.Witch>=16 ? 3 : levels.Witch>=8 ? 2 : 1} rd 1/target/dy"',
  "Hag's Eye Hex":
    'Section=magic ' +
    'Note="Can use <i>Arcane Eye</i> effects %{levels.Witch} min/dy"',
  'Healing Hex':
    'Section=magic ' +
    'Note="May use <i>Cure %{levels.Witch>=5 ? \'Moderate\' : \'Light\'} Wounds</i> effects at will 1/target/dy"',
  'Hex':'Section=feature Note="%V Selections"',
  'Life Giver Hex':
    'Section=magic Note="May use <i>Resurrection</i> effects 1/dy"',
  'Major Healing Hex':
    'Section=magic ' +
    'Note="May use <i>Cure %{levels.Witch>=15 ? \'Critical\' : \'Serious\'} Wounds</i> effects at will 1/target/dy"',
  'Misfortune Hex':
    'Section=magic ' +
    'Note="R30\' Target suffers worse of 2 rolls on ability checks, attack, saves, and skill checks (DC %{hexDC} Will neg) for %{levels.Witch>=16 ? 3 : levels.Witch>=8 ? 2 : 1} rd 1/target/dy"',
  'Natural Disaster Hex':
    'Section=magic ' +
    'Note="May combine <i>Storm Of Vengeance</i> and <i>Earthquake</i> effects 1/dy"',
  'Nightmares Hex':
    'Section=magic ' +
    'Note="R60\' May use <i>Nightmare</i> effects (DC %{hexDC} Will ends) at will"',
  'Retribution Hex':
    'Section=magic ' +
    'Note="R60\' Target suffers half of damage it inflicts (DC %{hexDC} Will neg) for %{intelligenceModifier} rd"',
  'Slumber Hex':
    'Section=magic ' +
    'Note="R30\' May inflict sleep (DC %{hexDC} neg) for %{levels.Witch} rd at will 1/target/dy"',
  'Tongues Hex':
    'Section=magic ' +
    'Note="May understand%{levels.Witch>=5 ? \' and speak\' : \'\'} any spoken language for %{levels.Witch} min/dy"',
  'Vision Hex':
    'Section=magic ' +
    'Note="Touched target gains vision of possible event within next yr (DC %{hexDC} Will neg)"',
  'Ward Hex':
    'Section=magic ' +
    'Note="Target gains +%{levels.Witch>=16 ? 4 : levels.Witch>=8 ? 3 : 2} AC and saves until hit or fails save"',
  'Waxen Image Hex':
    'Section=magic ' +
    'Note="R30\' Self controls target action %{intelligenceModifier} times (DC %{hexDC} Will ends) 1/target/dy"',
  'Weather Control Hex':
    'Section=magic ' +
    'Note="May perform 1 hr ritual to use <i>Control Weather</i> effects 1/dy"',
  "Witch's Familiar":
    'Section=feature Note="Has Familiar feature/Familiar stores spells"',

  // Barbarian
  'Beast Totem':'Section=combat Note="+%{ragePowerLevel//4+1} AC during rage"',
  'Battle Scavenger':
    'Section=combat ' +
    'Note="No attack penalty and +%{(levels.Barbarian-3)//3} damage w/improvised and broken weapons"',
  'Bestial Mount':'Section=feature Note="Has Animal Companion features"',
  'Blindsight':'Section=feature Note="Can maneuver and fight w/out vision"',
  'Boasting Taunt':
    'Section=combat ' +
    'Note="Successful Intimidate inflicts shaken on target until attacks self"',
  'Brawler':
    'Section=combat Note="Has Improved Unarmed Strike features during rage"',
  'Chaos Totem':
    'Section=combat,skill ' +
    'Note=' +
      '"25% chance to ignore critical hit and sneak attack damage during rage",' +
      '"+4 Escape Artist during rage"',
  'Come And Get Me':
    'Section=combat ' +
    'Note="May trade +4 foe attack and damage for AOO before every foe attack during rage"',
  'Destructive':
    'Section=combat ' +
    'Note="+%{levels.Barbarian//2>?1} damage vs. objects and with sunder"',
  'Elemental Fury':
    'Section=combat ' +
    'Note="Taking %{levels.Barbarian} HP energy damage adds %{levels.Barbarian//3} to daily rage rds"',
  'Elemental Rage':
    'Section=combat Note="Attacks inflict +1d6 HP energy during rage"',
  'Energy Absorption (Rage)':
    'Section=combat ' +
    'Note="May convert energy damage to self to 1/3 temporary HP 1/rage"',
  'Energy Eruption':
    'Section=combat ' +
    'Note="May convert energy damage to self to R60\' line or R30\' cone breath attack of equal HP (DC %{10+ragePowerLevel//2+constitutionModifier} half) 1/rage"',
  'Energy Resistance':
    'Section=save ' +
    'Note="Resistance %{ragePowerLevel//2>?1} to chosen energy during rage"',
  'Extreme Endurance':
    'Section=save ' +
    'Note="Inured to choice of hot or cold climate/Resistance %{(levels.Barbarian-3)//3} to choice of fire or cold"',
  'Fast Rider':'Section=feature Note="+10\' Mount speed"',
  'Ferocious Mount':
    'Section=combat ' +
    'Note="May give mount rage benefits when adjacent or mounted during rage"',
  'Ferocious Trample':
    'Section=combat ' +
    'Note="Mount trample inflicts 1d8+strength (L/H mount 2d6/2d8, DC %{10+levels.Barbarian//2}+Str Ref half) during rage"',
  'Fiend Totem':
    'Section=combat ' +
    'Note="Successful foe melee attack inflicts 1d6 HP on attacker during rage"',
  'Flesh Wound':
    'Section=combat ' +
    'Note="May reduce damage to half nonlethal w/successful DC damage Fort 1/rage"',
  'Good For What Ails You':
    'Section=combat ' +
    'Note="Alcohol gives save vs. condition or poison during rage"',
  'Greater Beast Totem':
    'Section=combat ' +
    'Note="May make full attack at the end of a charge/Increased Lesser Beast Totem effects"',
  'Greater Brawler':
    'Section=combat ' +
    'Note="Has Two-Weapon Fighting features for Unarmed Strike during rage"',
  'Greater Chaos Totem':
    'Section=combat ' +
    'Note="DR %{ragePowerLevel//2}/lawful and weapons are chaotic during rage"',
  'Greater Elemental Rage':
   'Section=combat ' +
   'Note="Critical hits inflict +1d10 HP energy or better during rage"',
  'Greater Energy Resistance':
    'Section=combat ' +
    'Note="May reduce damage from chosen energy attack by half 1/rage"',
  'Greater Ferocious Mount':
    'Section=combat ' +
    'Note="May give mount rage power benefits when mounted during rage"',
  'Greater Ferocious Trample':
    'Section=combat ' +
    'Note="Mount may trample targets of same size and overrun during rage"',
  'Greater Fiend Totem':
    'Section=combat ' +
    'Note="Adjacent good creatures suffer 2d6 HP slashing and shaken and neutral creatures shaken during range"',
  'Greater Hurling':
    'Section=combat Note="May hurl +30\' or +2 size objects during rage"',
  'Greater Spirit Totem':
    'Section=combat ' +
    'Note="Spirits inflict 1d8 HP negative energy on adjacent foes, may attack 15\' away for 1d6 HP during rage"',
  'Ground Breaker':
    'Section=combat ' +
    'Note="Successful attack on floor inflicts knocked prone on adjacent (DC 15 Ref neg) and creates difficult terrain 1/rage"',
  'Guarded Life':
    'Section=combat ' +
    'Note="%{ragePowerLevel} HP damage converted to nonlethal when taken to negative HP and stabilize automatically during rage"',
  'Hurling':
    'Section=combat Note="May hurl +20\' or +1 size objects during rage"',
  'Hurling Charge':
    'Section=combat ' +
    'Note="May make +2 thrown attack while charging during rage"',
  'Improved Savage Grapple':
    'Section=combat ' +
    'Note="Increased Savage Grapple effects/Treated as one size larger for grappling and swallowing"',
  'Inspire Ferocity':
    'Section=combat ' +
    'Note="R30\' May share Reckless Abandon ability with allies for %{charismaModifier} rd"',
  'Invulnerability':'Section=combat Note="DR %V/-, dbl nonlethal"',
  'Keen Senses (Barbarian)':
    'Section=feature Note="Has Low-Light Vision%1 features"',
  'Knockdown':
    'Section=combat ' +
    'Note="May make trip attack w/out AOO that inflicts %{strengthModifier} HP and knocks prone 1/rage"',
  'Lesser Beast Totem':
    'Section=combat ' +
    'Note="Two claw attacks inflict 1d%V+%{strengthModifier}x%1@20 HP during rage"',
  'Lesser Chaos Totem':
    'Section=combat,save ' +
    'Note=' +
      '"+%V AC vs. lawful foe during rage",' +
      '"+%V save vs. confusion, insanity, polymorph, and lawful effects during rage"',
  'Lesser Elemental Rage':
    'Section=combat Note="Attacks inflict +1d6 HP energy for 1 rd 1/rage"',
  'Lesser Fiend Totem':
    'Section=combat ' +
    'Note="Gore attack inflicts 1d%{features.Small ? 6 : 8}+%{strengthModifier} HP during rage"',
  'Lesser Hurling':
    'Section=combat ' +
    'Note="R%V\' Ranged touched using thrown %1 object inflicts 1d6+%{strengthModifier} HP or more (DC %{10+levels.Barbarian//2+strengthModifier} Ref half) during rage"',
  'Lesser Spirit Totem':
    'Section=combat ' +
    'Note="Spirit attack inflicts 1d4+%{charismaModifier} HP negative energy 1/rd during rage"',
  'Liquid Courage':
    'Section=save ' +
    'Note="Alcohol gives up to +%{ragePowerLevel//4} save vs. mind-affecting effects during rage"',
  'Naked Courage':
    'Section=combat,save ' +
    'Note=' +
      '"+%V AC in no armor",' +
      '"+%{(levels.Barbarian+3)//6} save vs. fear in no armor"',
  'Natural Toughness':'Section=combat Note="+%V AC in no armor"',
  'Overbearing Advance':
    'Section=combat ' +
    'Note="Successful overrun inflicts %{strengthModifier} HP during rage"',
  'Overbearing Onslaught':
    'Section=combat Note="May make additional -2 CMB overruns during rage"',
  'Pit Fighter':
    'Section=combat ' +
    'Note="+%{armor==\'None\' ? 2 : 1} CMB or CMD on choice of %{levels.Barbarian//3} combat maneuvers"',
  'Raging Drunk':
    'Section=combat ' +
    'Note="May drink alcohol or potion w/out AOO during rage/Alcohol extends rage 1 rd and inflicts nauseated after rage"',
  'Reckless Abandon':
    'Section=combat ' +
    'Note="May trade up to -%{ragePowerLevel//4+1} AC for equal attack bonus during rage"',
  'Roaring Drunk':
    'Section=save,skill ' +
    'Note=' +
      '"Alcohol gives up to +%{ragePowerLevel//4} vs. fear during rage",' +
      '"Alcohol gives up to +%{ragePowerLevel//4} Intimidate during rage"',
  'Savage Grapple':
   'Section=combat ' +
   'Note="%V grappled penalties/Always has AOO vs. grapple; hit gives +2 vs. grapple"',
  'Sixth Sense':
    'Section=combat Note="+%V Initiative/+%V AC during surprise rd"',
  'Skilled Thrower':
    'Section=combat Note="+10\' range for thrown weapons and objects"',
  'Smasher':'Section=combat Note="Attack ignores object hardness 1/rage"',
  'Spirit Steed':
    'Section=combat ' +
    'Note="Mount gains DR %{ragePowerLevel//2}/magic and magic natural weapons during rage"',
  'Spirit Totem':
    'Section=combat ' +
    'Note="Spirits give 20% miss chance vs. ranged and non-adjacent attacks during rage"',
  'Staggering Drunk':
    'Section=combat ' +
    'Note="Alcohol gives up to +%{ragePowerLevel//4} AC vs. AOO during rage"',
  'Witch Hunter':
    'Section=combat Note="+%{ragePowerLevel//4+1} damage vs. spell users"',

  // Bard
  'Arcane Armor':
    'Section=feature,magic ' +
    'Note=' +
      '"Has %V Armor Proficiency features",' +
      '"No arcane spell failure in %V armor"',
  'Arcane Insight':
    'Section=magic,save,skill ' +
    'Note=' +
      '"+4 caster level to overcome protection vs. divination",' +
      '"+4 vs. illusions",' +
      '"May find and disable magical traps/+4 vs. disguises"',
  'Arcane Investigation':'Section=magic Note="Has access to additional spells"',
  'Battle Song':
    'Section=magic ' +
    'Note="R30\' Bardic Performance affects all allies as <i>Rage</i> spell"',
  'Berserkergang':
    'Section=magic ' +
    'Note="Bardic Performance suppresses pain, stun, and fear effects and gives DR5/- to %{(levels.Bard-9)//3} targets"',
  'Bladethirst':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives weapon of one ally choice of +%{(levels.Bard-3)//3} attack and damage or one of defending, distance, ghost touch, keen, mighty cleaving, returning, shock, shocking burst, seeking, speed, or wounding properties"',
  'Call The Storm':
    'Section=magic ' +
    'Note="Bardic Performance acts as <i>Control Water</i>, <i>Control Weather</i>, <i>Control Winds</i>, or <i>Storm Of Vengeance</i> spell"',
  'Careful Teamwork':
    'Section=magic ' +
    'Note="R30\' 3 rd Bardic Performance gives allies +%{(levels.Bard+7)//6} Initiative, Perception, Disable Device, Reflex saves, AC vs. traps, and flat-footed AC for 1 hr"',
  'Disappearing Act':
    'Section=magic ' +
    'Note="R30\' Bardic Performance causes creatures to overlook %{(levels.Bard+7)//6} allies (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Dramatic Subtext':
    'Section=magic ' +
    'Note="2 rd Bardic Performance allows casting spell w/out visual or audible components (opposed Perception vs. Sleight Of Hand to detect)"',
  'Dweomercraft':
    'Section=magic ' +
    'Note="Bardic Performance gives allies +%{(levels.Bard+7)//6} caster level checks, concentration, and spell attack"',
  'Expanded Repertoire':'Section=magic Note="Has access to additional spells"',
  'Extended Performance':
    'Section=magic ' +
    'Note="May expend spell slot to extend Bardic Performance effects"',
  'Eye For Detail':
    'Section=skill ' +
    'Note="+%V Diplomacy (gather information)/+%V Knowledge (Local)/+%V Perception/+%V Sense Motive"',
  'Gladhanding':
    'Section=skill ' +
    'Note="Perform gains dbl normal pay/May use Bluff to improve attitude"',
  'Glorious Epic':
    'Section=magic ' +
    'Note="R30\' Bardic Performance inflicts flat-footed (DC %{10+levels.Bard//2+charismaModifier} Will neg) on foes"',
  'Greater Stealspell':
    'Section=magic ' +
    'Note="Successful Stealspell reveals target\'s spells; may instead steal SR %{levels.Bard//2}"',
  'Harmless Performer':
    'Section=magic ' +
    'Note="Bardic Performance causes foes to lose attack on self (DC %{10+levels.Bard//2+charismaModifier} Will neg; DC %{10+levels.Bard//2+charismaModifier} concentration to redirect targeted spell)"',
  'Heraldic Expertise':
    'Section=skill ' +
    'Note="+%V Diplomacy/+%V Knowledge (History)/+%V Knowledge (Local)/+%V Knowledge (Nobility)/May reroll 1/dy"',
  'Incite Rage':
    'Section=magic ' +
    'Note="R30\' Bardic Performance affects target as <i>Rage</i> spell (DC %{10+levels.Bard//2+charismaModifier} neg)"',
  'Inspiring Blow':
    'Section=combat ' +
    'Note="Bardic Performance following critical hit gives self %{charismaModifier>?0} temporary HP and R30\' allies +1 next attack for 1 rd"',
  'Lamentable Belaborment':
    'Section=magic ' +
    'Note="Bardic Performance inflicts choice of dazed or confused on fascinated creature (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Madcap Prank':
    'Section=magic ' +
    'Note="R30\' Bardic Performance inflicts random negative effect on target (DC %{10+levels.Bard//2+charismaModifier} Ref neg) 1/rd"',
  'Magic Lore':
    'Section=save,skill ' +
    'Note=' +
      '"+4 vs. magical traps and language- and symbol-based effects",' +
      '"+%{levels.Bard//2} Spellcraft (identify items and decipher scrolls)/May use Disable Device on magical traps"',
  'Magical Talent (Magician)':
    'Section=skill ' +
    'Note="+%1 Knowledge (Arcana)/+%1 Spellcraft/+%1 Use Magic Device"',
  'Mass Bladethirst':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives +1 or better attack bonus to weapons of multiple allies"',
  'Mass Slumber Song':
    'Section=magic ' +
    'Note="R30\' May cause all fascinated targets to sleep (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Master Of Deception':
    'Section=skill ' +
    'Note="+%1 Bluff/+%1 Sleight Of Hand/+%1 Stealth/May disarm magical traps"',
  'Metamagic Mastery (Magician)':
    'Section=magic ' +
    'Note="May use Bardic Performance to apply metamagic feat to spell"',
  'Mockery':
    'Section=magic ' +
    'Note="Bardic Performance inflicts -%{(levels.Bard+5)//4>?2} on target Charisma and Charisma-based skill checks"',
  'Naturalist':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives allies +%{(levels.Bard+5)//6} AC, attack, and saves vs. abilities of creatures identified w/Knowledge check"',
  'Pedantic Lecture':
    'Section=magic ' +
    'Note="Bardic Performance inflicts choice of sleep, dazed, or confused on all fascinated creatures (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Probable Path':
    'Section=feature ' +
    'Note="May take 10 on any d20 roll %{(levels.Bard-7)//3>?1}/dy"',
  'Quick Change':
    'Section=skill ' +
    'Note="May don disguise as standard action (-5 check)/May use Bluff as diversion to hide/May take 10 on Bluff and Disguise; may take 20 %{(levels.Bard+1)//6}/dy"',
  'Rallying Cry':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives allies use of self Intimidate check for save vs. fear and despair"',
  'Satire':
    'Section=magic ' +
    'Note="Bardic Performance inflicts -%{(levels.Bard+7)//6} on attack, damage, and saves vs. fear and charm on foes w/in hearing"',
  'Scandal':
    'Section=magic ' +
    'Note="R30\' Bardic Performance inflicts 50% chance to attack nearest creature (DC %{10+levels.Bard//2+charismaModifier} Will neg) on foes"',
  'Sea Legs':
    'Section=combat,save ' +
    'Note="+4 CMD vs. grapple, overrun, and trip",' +
    '"+4 vs. air, water, and knocked prone"',
  'Sea Shanty':
    'Section=skill ' +
    'Note="R30\' Allies may use self Perform to save vs. exhausted, fatigued, nauseated, and sickened"',
  'Show Yourselves':
    'Section=combat ' +
    'Note="R30\' Bardic Performance compels foes to reveal selves (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Slip Through The Crowd':
    'Section=magic Note="Disappearing Act allows affected allies to move through occupied squares and attack"',
  'Slumber Song':
    'Section=magic ' +
    'Note="May cause one fascinated target to sleep (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Sneakspell':
    'Section=magic ' +
    'Note="%{levels.Bard>=6?(levels.Bard>=14?\'+4\':\'+2\')+\' caster level vs. SR and \':\'\'}+%{(levels.Bard+6)//8} spell DC and Bardic Performance vs. foes denied Dex bonus"',
  'Song Of The Fallen':
    'Section=magic ' +
    'Note="10 rd Bardic Performance summons barbarian warriors as %{levels.Bard>=19 ? \'iron\' : levels.Bard>=16 ? \'bronze\' : levels.Bard>=13 ? \'brass\' : \'silver\'} <i>horn of valhalla</i>"',
  'Spell Catching':
    'Section=magic ' +
    'Note="Bardic Performance and successful caster level check (DC 10 + foe caster level) negates foe targeted spell and allows immediate recast"',
  'Spell Suppression':
    'Section=magic ' +
    'Note="May use Bardic Performance to counter spell of level equal to performance rds"',
  'Stealspell':
    'Section=magic ' +
    'Note="Touch transfers spell to self (DC %{10+levels.Bard//2+charismaModifier} Will neg) for duration of Bardic Performance"',
  'Still Water':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives listeners -%{levels.Bard} DC for Profession (Sailor), Swim, Acrobatics (shipboard), and Climb (shipboard); 10 rd performance extends effect to 1 hr"',
  'Streetwise':
    'Section=skill ' +
    'Note="+%V Bluff/+%V Disguise/+%V Knowledge (Local)/+%V Sleight Of Hand/+%V Diplomacy (crowds or gather information)/+%V Intimidate (crowds)"',
  'True Confession':
    'Section=skill ' +
    'Note="%{levels.Bard>=20 ? 1 : levels.Bard>=15 ? 2 : 3} rd Bardic Performance and successful Sense Motive causes target to reveal lie or compulsion (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Wand Mastery':
    'Section=magic ' +
    'Note="Uses charisma bonus%{levels.Bard>=16 ? \' and caster level\' : \'\'} to calculate save DC of wands"',
  'Whistle The Wind':
   'Section=magic ' +
   'Note="Bardic Performance acts as <i>Gust Of Wind</i> spell; 5 rd performance extends effect to 1 min"',
  'Wide Audience':
    'Section=magic ' +
    'Note="Bardic Performance affects %{60+(levels.Bard-5)//5*20}\' cone, %{30+(levels.Bard-5)//5*10}\' radius, or +%{(levels.Bard-5)//5} targets"',
  'World Traveler (Sea Singer)':
    'Section=skill ' +
    'Note="+%1 Knowledge (Geography)/+%1 Knowledge (Local)/+%1 Knowledge (Nature)/+%1 Linguistics/May reroll %{(levels.Bard+5)//5}/dy"',

  // Cleric
  'Adoration':
    'Section=combat ' +
    'Note="May force foe to forego self attack (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{wisdomModifier+3}/dy"',
  'Animate Servant':
    'Section=magic ' +
    'Note="Cast <i>Animate Object</i> %{(levels.Cleric-4)//4}/dy"',
  'Anything To Please':
    'Section=magic ' +
    'Note="R30\' Target attempts to please self (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{(levels.Cleric-4)//4}/dy"',
  'Arcane Beacon':
    'Section=magic ' +
    'Note="15\' radius gives arcane spells +1 caster level or DC for 1 rd %{3+wisdomModifier}/dy"',
  'Aura Of Chaos':
    'Section=combat ' +
    'Note="30\' radius randomizes foe actions (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{levels.Cleric} rd/dy"',
  'Aura Of Decay':
    'Section=combat ' +
    'Note="30\' radius inflicts 1d6 HP/rd (plants 2d6 HP) and -1 Strength/rd %{levels.Cleric} rd/dy"',
  'Aura Of Forgetfulness':
    'Section=magic ' +
    'Note="Targets have no memory of time spent in 30\' radius (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) and lose 1 spell slot/rd (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{levels.Cleric} rd/dy"',
  'Aura Of Heroism':
    'Section=combat ' +
    'Note="30\' radius gives allies +2 attack, saves, and skill checks %{levels.Cleric} rd/dy"',
  'Aura Of Menace':
    'Section=magic ' +
    'Note="30\' radius inflicts -2 AC, attack, and saves on foes %{levels.Cleric} rd/dy"',
  'Aura Of Repetition':
    'Section=combat ' +
    'Note="R30\' Forces foes to repeat prior action (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{levels.Cleric} rd/dy"',
  'Bestow Resolve':
    'Section=magic ' +
    'Note="R20\' Gives allies %{levels.Cleric+wisdomModifier} temporary HP for 1 min %{(levels.Cleric-4)//4}/dy"',
  'Binding Ties':
    'Section=magic ' +
    'Note="Touch transfers condition to self and gives immunity for %{levels.Cleric} rd %{wisdomModifier+3}/dy"',
  'Blinding Flash':
    'Section=magic ' +
    'Note="20\' radius blinds creatures up to %{levels.Cleric-1} HD for 1d4 rd (DC %{10+levels.Cleric//2+wisdomModifier} Fort neg), dazzles for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Body Of Ice':
    'Section=combat ' +
    'Note="May trade dbl damage from fire for immunity to cold and DR 5/- %{levels.Cleric} rd/dy"',
  'Cloud Of Smoke':
    'Section=magic ' +
    'Note="R30\' 5\' radius inflicts -2 attack and Perception and gives concealment %{wisdomModifier+3}/dy"',
  'Command':'Section=magic Note="Cast <i>Command</i> %{wisdomModifier+3}/dy"',
  "Day's Resurgence":
    'Section=magic ' +
    'Note="10 minute ritual gives target 8 hrs rest %{(levels.Cleric-6)//2}/dy"',
  'Deadly Weather':
    'Section=magic ' +
    'Note="%{levels.Cleric*5}\' radius inflicts choice of rain (-4 Perception and ranged attack), winds (-8 Fly and ranged attack), snow (terrain becomes difficult), or <i>Call Lightning</i> %{levels.Cleric} rd/dy"',
  "Death's Kiss":
    'Section=magic ' +
    'Note="Touched healed and harmed as undead for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Deflection Aura':
    'Section=combat ' +
    'Note="20\' radius gives allies +2 AC and CMD for %{levels.Cleric} rd 1/dy"',
  'Divine Vessel':
    'Section=magic ' +
    'Note="R15\' Divine spell cast on self gives allies +2 next attack, skill check, or ability check for 1 rd %{wisdomModifier+3}/dy"',
  'Door Sight':
    'Section=magic ' +
    'Note="May see through %{6+levels.Cleric}\\" material for 10 min after 1 min touch %{wisdomModifier+3}/dy"',
  "Elysium's Call":
    'Section=magic ' +
    'Note="Touch gives immediate enchantment reroll, +2 save vs. enchantment, +2 CMB to escape grapple, and negate 5\' difficult terrain for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Enlarge':'Section=magic Note="May dbl size for 1 rd %{wisdomModifier+3}/dy"',
  'Eyes Of The Hawk':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Initiative (surprise round)",' +
      '"+%V Perception"',
  'Fearful Touch':
    'Section=combat ' +
    'Note="Touch inflicts -2 attack on self, loss of fear immunity, and -%{levels.Cleric//2>?1} save vs. fear for 1 rd %{wisdomModifier+3}/dy"',
  'Ferocious Strike':
    'Section=combat ' +
    'Note="Called attack inflicts +%{levels.Cleric//2} HP %{wisdomModifier+3}/dy"',
  'Fury Of The Abyss':
    'Section=combat ' +
    'Note="May trade -2 AC for +%{levels.Cleric//2>?1} attack, damage, and CMB for 1 rd %{wisdomModifier+3}/dy"',
  'Gale Aura':
    'Section=magic ' +
    'Note="30\' radius inflicts difficult terrain and no 5\' step %{levels.Cleric} rd/dy"',
  'Gift Of Life':
    'Section=magic ' +
    'Note="Touched corpse dead up to 1 min regains life w/%{levels.Cleric//2} HP for %{levels.Cleric} rd %{(levels.Cleric-4)//4}/dy"',
  'Guarded Hearth':
    'Section=magic ' +
    'Note="10 min ritual gives targets in %{levels.Cleric*5}\' radius notice of intruders and +%{wisdomModifier} attack and saves for %{levels.Cleric} hr 1/dy"',
  "Hell's Corruption":
    'Section=combat ' +
    'Note="Touch inflicts -2 saves and worse of two skill rolls for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Honor Bound':
    'Section=magic ' +
    'Note="Touch gives additional save vs. enchantment %{wisdomModifier+3}/dy"',
  'Insane Focus':
    'Section=magic ' +
    'Note="Touch gives +4 save vs. mind-affecting effects and immunity to confusion (failed save ends and confuses for 1 rd) for 1 min %{wisdomModifier+3}/dy"',
  'Inspiring Command':
    'Section=magic ' +
    'Note="R30\' Gives %{levels.Cleric//3+1} allies +2 attack, AC, CMD, and skill checks for 1 rd"',
  'Killing Blow':
    'Section=combat ' +
    'Note="Critical hit inflicts %{levels.Cleric//2} HP bleed damage %{(levels.Cleric-4)//4}/dy"',
  "Liberty's Blessing":
    'Section=magic Note="Touch gives additional save %{wisdomModifier+3}/dy"',
  'Malign Eye':
    'Section=magic ' +
    'Note="R30\' Inflicts -2 save vs. self spells on target for 1 min or until hits self %{wisdomModifier+3}/dy"',
  'Metal Fist':
    'Section=combat ' +
    'Note="Unarmed attack inflicts 1d6+%{strengthModifier} HP w/out AOO for 1 rd %{wisdomModifier+3}/dy"',
  'Night Hunter':
    'Section=feature ' +
    'Note="May become invisible to normal vision in dim light or darkness for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Powerful Persuader':
    'Section=skill ' +
    'Note="May take higher of 2 Diplomacy or Intimidate rolls %{(levels.Cleric-6)//2}/dy"',
  "Predator's Grace":
    'Section=ability,feature ' +
    'Note=' +
      '"+%{10+levels.Cleric//5*5}\' Speed for 1 rd %{wisdomModifier+3}/dy",' +
      '"Has Low-Light Vision features for 1 rd %{wisdomModifier+3}/dy"',
  'Protective Aura':
    'Section=magic ' +
    'Note="R30\' Allies gain +2 AC, +2 saves, and <i>Protection From Evil</i> effects %{levels.Cleric} rd/dy"',
  'Purifying Touch':
    'Section=magic ' +
    'Note="Touch gives additional save vs. effects %{(levels.Cleric-2)//6}/dy"',
  'Rage (Cleric)':
    'Section=combat ' +
    'Note="+4 Str, +4 Con, +2 Will, -2 AC and %1 powers %{levels.Cleric} rd/dy"',
  'Read Minds':
    'Section=magic ' +
    'Note="R30\' May read surface thoughts (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{levels.Cleric} rd/dy"',
  'Recall':
    'Section=skill ' +
    'Note="Touch gives +%{wisdomModifier} Knowledge reroll %{wisdomModifier+3}/dy"',
  'Restorative Touch':
    'Section=magic ' +
    'Note="Touch removes choice of dazed, fatigued, shaken, sickened, or staggered %{wisdomModifier+3}/dy"',
  'Rune Shift':
    'Section=magic Note="R30\' May move blast rune to adjacent square"',
  'Sacrificial Bond':
    'Section=combat ' +
    'Note="R30\' May transfer ally damage to self %{(levels.Cleric-2)//6}/dy"',
  'Seize The Initiative':
    'Section=magic ' +
    'Note="R30\' Target gains choice of 2 Initiative rolls %{wisdomModifier+3}/dy"',
  'Silver-Tongued Haggler':
    'Section=skill ' +
    'Note="+%{levels.Cleric//2>?1} Bluff, Diplomacy, or Sense Motive %{wisdomModifier+3}/dy"',
  'Speak With Dead':
    'Section=magic Note="May ask question of corpse %{levels.Cleric}/dy"',
  'Sudden Shift':
    'Section=combat ' +
    'Note="After foe miss, may teleport 10\' within foe threat range %{wisdomModifier+3}/dy"',
  'Surge':
    'Section=combat ' +
    'Note="Wave inflicts %{levels.Cleric+wisdomModifier} CMB bull rush or drag %{wisdomModifier+3}/dy"',
  'Thief Of The Gods':
    'Section=skill ' +
    'Note="May take higher of 2 Disable Device or Sleight Of Hand rolls %{(levels.Cleric-6)//2}/dy"',
  'Thundercloud':
    'Section=magic ' +
    'Note="R%{levels.Cleric*10+100}\' Fog in 20\' radius moves 30\'/rd, obscures vision, deafens, and inflicts 2d6 HP electricity %{levels.Cleric} rd/dy"',
  'Touch The Spirit World':
    'Section=magic ' +
    'Note="Touched weapon inflicts 1/2 damage (full damage if magic) on incorporeal creatures for %{levels.Cleric} rd %{wisdomModifier+3}/dy"',
  'Tugging Strands':
    'Section=combat Note="May force target reroll %{(levels.Cleric-2)//6}/dy"',
  'Tunnel Runner':
    'Section=feature ' +
    'Note="Self gains <i>Spider Climb</i> on stone surfaces, +60\' Darkvision, +%{levels.Cleric} Stealth underground, and +%{wisdomModifier} Initiative underground %{levels.Cleric} min/dy"',
  'Untouched By The Seasons':
    'Section=magic ' +
    'Note="Touch gives <i>Endure Elements</i> for %{levels.Cleric} hr %{wisdomModifier+3}/dy"',
  'Wall Of Ashes':
    'Section=magic ' +
    'Note="R100\' 20\'x%{levels.Cleric*10}\' ash wall blocks sight, blinds passers (DC %{10+levels.Cleric//2+wisdomModifier} Fort neg) for 1d4 rd, and reveals invisible creatures %{levels.Cleric} min/dy"',
  'Warding Rune':
    'Section=magic ' +
    'Note="Damage from blast rune prevents attack on self (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) for %{levels.Cleric//2} rd %{(levels.Cleric-2)//6}/dy"',
  'Whispering Evil':
    'Section=magic ' +
    'Note="30\' radius fascinates foes (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{levels.Cleric} rd/dy"',
  'Wind Blast':
    'Section=magic ' +
    'Note="30\' line inflicts CMB +%{levels.Cleric+wisdomModifier} bull rush %{wisdomModifier+3}/dy"',
  'Wounding Blade':
    'Section=magic ' +
    'Note="Hit w/touched weapon causes 1 HP bleeding damage (DC 15 Heal or cure ends) for %{levels.Cleric//2} rd %{(levels.Cleric-4)//4}/dy"',

  // Druid
  'Animal Shaman':
    'Section=magic,skill ' +
    'Note=' +
      '"+4 Wild Shape level w/totem animal",' +
      '"+4 Wild Empathy w/totem animal"',
  'Animal Shaman Feat Bonus':'Section=feature Note="%V Selections"',
  'Aquatic Adaptation':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in aquatic terrain",' +
      '"Cannot be tracked in aquatic environments",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, Survival, and Swim in aquatic terrain"',
  'Aquatic Druid':
    'Section=skill ' +
    'Note="Wild Empathy works only with swimming and water creatures"',
  'Arctic Endurance':
    'Section=save Note="Comfortable down to -50F; immune to dazzled"',
  'Arctic Native':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in cold terrain",' +
      '"Cannot be tracked in cold environments",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, and Survival in cold terrain"',
  'Bear Totem':
    'Section=feature ' +
    'Note="Must choose bear animal companion or one of Animal, Earth, Protection, or Strength Domains"',
  'Blight Druid':
    'Section=feature ' +
    'Note="May choose Familiar or Darkness, Death, or Destruction Domain, but not Animal Companion, for Nature Bond"',
  'Blightblooded':
    'Section=save Note="Immune to disease, sickened, and nauseated"',
  'Canny Charger':
    'Section=combat ' +
    'Note="May pass through allies\' squares and turn during charge/+4 AC vs. enemy charge/+4 damage when readied vs. charge"',
  'Cave Druid':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"May choose Darkness Domain, but not Air Domain or Weather Domain, for Nature Bond",' +
      '"Cannot Wild Shape into plant creature%{levels.Druid>=10 ? \'; May Wild Shape into ooze\':\'\'}",' +
      '"-4 Wild Empathy (oozes)"',
  'Cavesense':
    'Section=skill ' +
    'Note="Knowledge (Dungeoneering) is a class skill/+2 Knowledge (Dungeoneering)/+2 Survival"',
  'Deep Diver':
    'Section=combat ' +
    'Note="DR %{levels.Druid//2}/- vs. grappling spells, crushing spells, slashing, and piercing; immune to deep water pressure"',
  'Desert Druid':
    'Section=magic ' +
    'Note="Cannot Wild Shape into plant creature%{levels.Druid>=10 ? \'; May Wild Shape into vermin\':\'\'}"',
  'Desert Endurance':
    'Section=feature ' +
    'Note="Comfortable to 140F; reduced need for food and drink"',
  'Desert Native':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in desert terrain",' +
      '"Cannot be tracked in desert environments",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, and Survival in desert terrain"',
  'Dunemeld':
    'Section=magic,skill ' +
    'Note=' +
      '"May assume insubstantial sand form",' +
      '"Transformation gives +%{levels.Druid} Stealth in desert terrain"',
  'Eagle Totem':
    'Section=feature ' +
    'Note="Must choose eagle animal companion or one of Air, Animal, Nobility, or Weather Domains"',
  'Flurry Form':
    'Section=magic,skill ' +
    'Note=' +
      '"May assume insubstantial snow flurry form",' +
      '"Transformation gives +%{levels.Druid} Stealth in cold terrain"',
  'Icewalking':
    'Section=ability,skill ' +
    'Note=' +
      '"No speed penalty on ice or snow; does not break through snow crust or thin ice",' +
      '"No Acrobatics, Climb, or Stealth penalty on ice or snow"',
  'Jungle Guardian':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in jungle terrain",' +
      '"Cannot be tracked in jungle environments",' +
      '"+%{levels.Druid//2} Climb, Knowledge (Geography), Perception, Stealth, and Survival in jungle terrain"',
  'Lightfoot':'Section=feature Note="Undetectable via tremorsense"',
  'Lion Totem':
    'Section=feature ' +
    'Note="Must choose lion animal companion or one of Animal, Glory, Nobility, or Sun Domains"',
  'Lorekeeper':
    'Section=skill ' +
    'Note="+2 Diplomacy/+2 Knowledge (History)/+2 Knowledge (Local)/+2 Knowledge (Nobility)/Diplomacy is a class skill/Knowledge (History) is a class skill/Knowledge (Local) is a class skill/Knowledge (Nobility) is a class skill"',
  'Marshwight':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in swamp terrain",' +
      '"Cannot be tracked in swamp environments",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, Survival, and Swim in swamp terrain"',
  'Mental Strength':'Section=save Note="Immune to charm and compulsion"',
  'Miasma':
    'Section=combat ' +
    'Note="Inflicts sickened on adjacent creatures (DC %{10+levels.Druid//2+wisdomModifier} Fort neg) for 1 rd"',
  'Mountain Druid':
    'Section=magic ' +
    'Note="Cannot Wild Shape into plant creature%{levels.Druid>=12 ? \'; May Wild Shape into giant\':\'\'}"',
  'Mountain Stance':
    'Section=combat,save ' +
    'Note=' +
      '"+4 CMD vs. forced movement attempts",' +
      '"Immune to petrified, +4 vs. forced movement"',
  'Mountain Stone':
    'Section=magic Note="May transform into stone outcrop at will"',
  'Mountaineer':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in mountainous terrain",' +
      '"Cannot be tracked in mountainous environments",' +
      '"+%{levels.Druid//2} Climb, Knowledge (Geography), Perception, Stealth, and Survival in mountainous terrain"',
  'Natural Swimmer':'Section=ability Note="%V\' Swim speed"',
  'Plaguebearer':
    'Section=combat ' +
    'Note="Contact inflicts disease on attacker (DC %{10+levels.Druid//2+wisdomModifier} Fort neg)"',
  'Plains Traveler':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in plains terrain",' +
      '"Cannot be tracked in plains environments",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, and Survival in plains terrain"',
  'Pond Scum':
    'Section=combat,save ' +
    'Note=' +
      '"DR %{levels.Druid//2}/- vs. swarms",' +
      '"+4 vs. disease and abilities of monstrous humanoids"',
  "Resist Ocean's Fury":'Section=save Note="+4 vs. water spells and creatures"',
  'Resist Subterranean Corruption':
    'Section=save Note="+2 vs. abilities of oozes and aberrations"',
  'Resist Temptation':'Section=save Note="+2 vs. divinations and enchantments"',
  'Run Like The Wind':
    'Section=ability ' +
    'Note="+10\' Speed in light armor/May dbl speed for 1 rd 1/hr"',
  'Sandwalker':
    'Section=ability,skill ' +
    'Note=' +
      '"No speed penalty in sand or desert",' +
      '"No Acrobatics or Stealth penalty in sand or desert"',
  'Savanna Ambush':
    'Section=combat,skill ' +
    'Note=' +
      '"Gains concealment when prone in natural surroundings; may stand from prone during surprise round as immediate action",' +
      '"No Stealth penalty when prone, -5 when crawling"',
  'Seaborn':
    'Section=ability,feature ' +
    'Note=' +
      '"Increased Natural Swimmer effects",' +
      '"Has aquatic subtype and amphibious trait; comfortable down to -50F"',
  'Serpent Totem':
    'Section=feature ' +
    'Note="Must choose snake animal companion or one of Animal, Charm, Trickery, or Water Domains"',
  'Shaded Vision':
    'Section=save ' +
    'Note="+2 vs. gaze, figments, and patterns; immune to blinded and dazzled"',
  'Slippery':
    'Section=magic Note="Has continuous <i>Freedom Of Movement</i> effect"',
  'Snowcaster':
    'Section=feature,magic ' +
    'Note=' +
      '"Sees normally in snowstorms",' +
      '"May prepare fire spells to inflict cold damage"',
  'Spire Walker':
    'Section=feature,save,skill ' +
    'Note=' +
      '"Comfortable to -50F",' +
      '"Immune to altitude sickness",' +
      '"Retains dexterity bonus during climb"',
  'Spontaneous Casting':
    'Section=magic Note="May cast domain spell in place of prepared spell"',
  'Sure-Footed (Druid)':
    'Section=ability,skill ' +
    'Note=' +
      '"No speed penalty on slopes, rubble, or scree",' +
      '"No Acrobatics or Stealth penalty on slopes, rubble, or scree"',
  'Swamp Strider':
    'Section=ability,skill ' +
    'Note=' +
      '"No speed penalty in bogs or undergrowth",' +
      '"No Acrobatics or Stealth penalty in bogs or undergrowth"',
  'Torrid Endurance':
    'Section=feature,save ' +
    'Note=' +
      '"Comfortable to 140F",' +
      '"+4 vs. disease and exceptional abilities of animals and magical beasts"',
  'Totem Transformation (Bear)':
    'Section=magic ' +
    'Note="Gains <i>Speak With Animals</i> (mammals) at will and one of: +10\' speed and +4 Swim; Low-Light Vision and Scent; +2 AC and Endurance; 1d6 HP bite, 1d4 HP claws, and +2 grapple CMB for %{levels.Druid} min/dy"',
  'Totem Transformation (Eagle)':
    'Section=magic ' +
    'Note="Gains <i>Speak With Animals</i> (birds) at will and one of: 30\' fly speed; Low-Light Vision and +4 Perception; 1d4 HP bite and 1d4 HP talons for %{levels.Druid} min/dy"',
  'Totem Transformation (Lion)':
    'Section=magic ' +
    'Note="Gains <i>Speak With Animals</i> (felines) at will and one of: +20\' speed; Low-Light Vision and Scent; 1d4 HP bite, 1d4 HP claws, Rake, and +2 grapple CMB for %{levels.Druid} min/dy"',
  'Totem Transformation (Serpent)':
    'Section=magic ' +
    'Note="Gains <i>Speak With Animals</i> (reptiles) at will and one of: 20\' climb and 20\' swim; +2 AC; Low-Light Vision and Scent; 1d4 HP bite plus 1 Con damage poison for %{levels.Druid} min/dy"',
  'Totem Transformation (Wolf)':
    'Section=magic ' +
    'Note="Gains <i>Speak With Animals</i> (canines) at will and one of: +20\' speed; Low-Light Vision, Scent, and +4 Survival (tracking via scent); 1d4 HP bite with trip and +2 trip CMB for %{levels.Druid} min/dy"',
  'Totemic Summons':
    'Section=magic ' +
    'Note="May cast <i>Summon Nature\'s Ally</i> to summon %V with %{levels.Druid} temporary HP"',
  'Tunnelrunner':
    'Section=ability Note="May move at full speed through narrow passages"',
  'Urban Druid':
    'Section=feature ' +
    'Note="May choose Charm, Community, Knowledge, Nobility, Protection, Repose, Rune, or Weather domain, but not Animal Companion, for Nature Bond"',
  'Verdant Sentinel':
    'Section=magic Note="May cast <i>Tree Shape</i> at will"',
  'Vermin Empathy':
    'Section=skill ' +
    'Note="+%{levels.Druid+charismaModifier} Diplomacy (vermin, disease-bearing)/+%{levels.Druid+charismaModifier-4} Diplomacy (other animals)"',
  'Wolf Totem':
    'Section=feature ' +
    'Note="Must choose wolf animal companion or one of Animal, Community, Liberation, or Travel Domains"',

  // Fighter
  'Active Defense':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+1)//4} AC w/shield when fighting defensively or using Combat Expertise or total defense/May share bonus w/1 adjacent ally or half bonus w/all adjacent allies"',
  'Agility':
    'Section=save ' +
    'Note="+%{(levels.Fighter+2)//4} vs. paralyzed, slowed, and entangled"',
  'Armored Charger':
    'Section=combat,skill ' +
    'Note=' +
      '"Mount may move full speed with medium load",' +
      '"No armor skill check penalty for Ride"',
  'Backswing':
    'Section=combat ' +
    'Note="+%{strengthModifier*2-(strengthModifier*1.5//1)} damage on multiple attacks w/two-handed weapon"',
  'Careful Claw':
    'Section=combat ' +
    'Note="Reduces contact damage from natural attack by %{levels.Fighter//2}"',
  'Critical Specialist':
    'Section=combat Note="+4 DC vs. critical effects from chosen weapon"',
  'Crossbow Expert':'Section=combat Note="+%V attack and damage w/crossbows"',
  'Deadly Critical':
    'Section=combat ' +
    'Note="May apply +1 critical multiplier w/chosen weapon %{(levels.Fighter-10)//3}/dy"',
  'Deadly Defense':
    'Section=combat ' +
    'Note="May make AOO on every attacking foe after full attack w/both weapons"',
  'Deadshot':'Section=combat Note="+%V damage w/readied crossbow"',
  'Deceptive Strike':
    'Section=combat,skill ' +
    'Note=' +
     '"+%{(levels.Fighter+2)//4} CMB and CMD on disarm",' +
     '"+%{(levels.Fighter+2)//4} Bluff (feint or create distraction to hide)"',
  'Defensive Flurry':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+1)//4} AC when making full attack w/two weapons"',
  'Deft Doublestrike':
    'Section=combat ' +
    'Note="May make disarm or trip w/out AOO after hitting foe w/both weapons"',
  'Deft Shield':
    'Section=combat,skill ' +
    'Note=' +
      '"Reduces tower shield attack penalty by %V",' +
      '"Reduces armor skill check penalty w/tower shield by %V"',
  'Devastating Blow':
    'Section=combat ' +
    'Note="May suffer -5 two-handed weapon attack for automatic crit"',
  'Doublestrike':
    'Section=combat Note="May attack w/two weapons as a single action"',
  'Elusive':'Section=combat Note="+%V AC in light armor"',
  'Equal Opportunity':'Section=combat Note="May make AOO w/two weapons"',
  'Evasive Archer':
    'Section=combat Note="+%{levels.Fighter>=17?4:2} AC vs. ranged attacks"',
  'Expert Archer':'Section=combat Note="+%V attack and damage w/bows"',
  'Fleet Footed':
    'Section=ability,skill ' +
    'Note=' +
      '"+10 Speed",' +
      '"May take 10 on Acrobatics when threatened/May take 20 on Acrobatics %{levels.Fighter//5}/dy"',
  'Flexible Flanker':'Section=combat Note="May flank from adjacent square"',
  'Greater Deadshot':'Section=combat Note="Increased Deadshot effects"',
  'Greater Power Attack':
    'Section=combat Note="Power Attack w/two-handed weapon doubles damage"',
  'Greater Savage Charge':
    'Section=combat ' +
    'Note="Increased Savage Charge effects/May charge past allies and over difficult terrain"',
  'Hawkeye':
    'Section=combat,skill ' +
    'Note=' +
      '"+%V\' bow range",' +
      '"+%V Perception"',
  'Improved Balance':
    'Section=combat ' +
    'Note="Reduces two-weapon fighting penalties by 1 or treats one-handed weapon in off hand as light weapon"',
  'Improved Deadshot':
    'Section=combat Note="Crossbow readied attack negates target Dex AC bonus"',
  'Indomitable Steed':
    'Section=combat Note="Self and gain mount DR 5/- when mounted"',
  'Interference':
    'Section=combat ' +
    'Note="Successful disarm maneuver makes foe flat-footed for 1 rd or until hit"',
  'Irresistible Advance':
    'Section=combat Note="+%V CMB on bull rush and overrun"',
  'Leap From The Saddle':
    'Section=combat ' +
    'Note="DC 20 Ride check allows full attack after mount move"',
  'Leaping Attack':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} attack and damage after 5\' move"',
  'Meteor Shot':
    'Section=combat ' +
    'Note="May inflict bull rush or trip via successful -4 crossbow attack"',
  'Mirror Move':
    'Section=combat Note="+%{(levels.Fighter+1)//4} AC vs. chosen weapon"',
  'Mounted Mettle':
    'Section=combat ' +
    'Note="Self and mount gain +%{(levels.Fighter-1)//4} attack and damage when adjacent or mounted"',
  'Natural Savagery':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} attack, damage, and grapple CMB/CMD w/natural weapons"',
  'Natural Weapon Mastery':
    'Section=combat ' +
    'Note="Automatically confirm crit, +1 damage multiplier, no disarm w/chosen natural weapon"',
  'Overhand Chop':
    'Section=combat ' +
    'Note="+%{strengthModifier*2-(strengthModifier*1.5//1)} damage on single attack w/two-handed weapon"',
  'Penetrating Shot':
    'Section=combat ' +
    'Note="Successful crossbow attack threatens additional inline targets w/-4 attack"',
  'Perfect Balance':
    'Section=combat Note="Reduces two-weapon fighting penalties by 1"',
  'Phalanx Fighting':
    'Section=combat Note="May use polearm or spear 1-handed w/shield"',
  'Piledriver':
    'Section=combat ' +
    'Note="May make bull rush or trip w/out AOO after single attack w/two-handed weapon"',
  'Pole Fighting':
    'Section=combat ' +
    'Note="May make %{levels.Fighter<18 ? (levels.Fighter-18)//4 + \' \' : \'\'}polearm attack vs. adjacent foes"',
  'Polearm Parry':
    'Section=combat ' +
    'Note="May give ally attacked by threatened foe +2 AC and DR 5/- vs. attack"',
  'Polearm Training':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} attack and damage w/polearms"',
  'Quick Sniper':
    'Section=combat,skill ' +
    'Note=' +
      '"Can return fire immediately when hit by ranged attack",' +
      '"+%{levels.Fighter//2} Stealth when sniping"',
  'Ranged Defense':
    'Section=combat Note="DR 5/- vs. ranged/May catch and re-fire arrow"',
  'Rapid Attack':
    'Section=combat ' +
    'Note="May combine move w/full-attack action minus highest bonus attack"',
  'Ready Pike':
    'Section=combat ' +
    'Note="May brace weapon for +%{(levels.Fighter-1)//4} attack and damage %{(levels.Fighter-1)//4}/dy"',
  'Relentless Steed':
    'Section=combat,skill ' +
    'Note=' +
      '"Mount may move full speed with heavy load",' +
      '"May reroll Ride or mount save %{(levels.Fighter-7)//4}/dy"',
  'Reliable Strike':
    'Section=combat ' +
    'Note="May reroll attack, crit, miss chance, or damage %{levels.Fighter//5}/dy"',
  'Reversal':
    'Section=combat ' +
    'Note="Successful disarm maneuver redirects attack from self to foe"',
  'Ride Them Down':
    'Section=combat ' +
    'Note="May make full attack%{features.Trample ? \' or overrun\' : \'\'} during mount move"',
  'Safe Shot':'Section=combat Note="%V attack does not provoke AOO"',
  'Savage Charge':
    'Section=combat ' +
    'Note="May suffer -%V AC to gain +%{levels.Fighter//2} bull rush and overrun and make +%{levels.Fighter//2} attack w/natural weapon at end of charge"',
  'Shattering Strike':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+2)//4} CMB/CMD on sunder and damage vs. objects"',
  'Shield Ally':
    'Section=combat ' +
    'Note="May use heavy or tower shield move to give self and adjacent allies +%{levels.Fighter>=17 ? 4 : 2} AC and +%{levels.Fighter>=17 ? 2 : 1} Reflex%{levels.Fighter>=13 ? \' (or 1 adjacent ally \' + (levels.Fighter>=17 ? \'Improved Evasion, +8 AC, and +4 Reflex)\' : \'Evasion, +4 AC, and +2 Reflex)\') : \'\'} for 1 rd"',
  'Shield Buffet':
    'Section=combat ' +
    'Note="May use combat maneuver as %{levels.Fighter>=13 ? \'swift\' : \'move\'} action to inflict -2 attacks and -2 AC vs. self on adjacent foe"',
  'Shield Fighter':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} shield bash attack and damage/Full attack may alternate freely between shield and weapon"',
  'Shield Guard':
    'Section=combat ' +
    'Note="Foes in chosen adjacent square(s) cannot flank self or help others flank"',
  'Shield Mastery':'Section=combat Note="DR 5/- w/shield"',
  'Shield Ward':
    'Section=combat,feature,save ' +
    'Note=' +
      '"Shield cannot be disarmed or sundered/Adds shield bonus to touch AC",' +
      '"Has %V features w/shield",' +
      '"Adds shield bonus to Reflex saves"',
  'Shielded Fortress':
    'Section=combat,feature ' +
    'Note=' +
      '"Shield cannot be disarmed or sundered/May use move to provide adjacent allies with Evasion features for 1 rd",' +
      '"Has %V features"',
  'Singleton':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+1)//6} attack and damage w/one-handed weapon and other hand free"',
  'Spark Of Life':
    'Section=save ' +
    'Note="+%{(levels.Fighter+2)//4} vs. energy drain and death effects"',
  'Stand Firm':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+2)//4} CMD vs. bull rush, drag, overrun, trip, and trample"',
  'Steadfast Mount':
    'Section=combat ' +
    'Note="Mount gains +%{(levels.Fighter+2)//4} AC and saves when adjacent or mounted after 1 hr practice"',
  'Steadfast Pike':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+1)//4} readied attacks and AOO w/polearms"',
  'Step Aside':
    'Section=combat ' +
    'Note="May take 5\' step immediately after threatened foe; gains +2 AC vs. that foe for 1 rd"',
  'Sweeping Fend':
    'Section=combat Note="May use polearm for -4 CMB bull rush or trip"',
  'Timely Tip':
    'Section=combat ' +
    'Note="Successful disarm maneuver negates foe shield bonus for 1 rd"',
  'Trick Shot (Archer)':
    'Section=combat ' +
    'Note="R30\' May use bow shot to perform -4 CMB %{(levels.Fighter+1)//4} choices from disarm, feint, sunder%{levels.Fighter>=11 ? \', bull rush, grapple, trip\':\'\'}"',
  'Twin Blades':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} attack and damage when making full attack w/two weapons or double weapon"',
  'Unavoidable Onslaught':
    'Section=combat ' +
    'Note="May make mounted charge past allies and over difficult terrain"',
  'Unstoppable Strike':
    'Section=combat ' +
    'Note="May touch attack w/chosen weapon, ignoring DR or hardness, 1/rd"',
  'Volley':
    'Section=combat ' +
    'Note="May make full-round bow attack against all in 15\' radius"',
  'Weapon Guard':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+2)//4} vs. disarm, sunder, and saves vs. effects with chosen weapon"',
  'Weapon Training (Weapon Master)':
     'Section=combat ' +
     'Note="+%{(levels.Fighter+1)//4} attack and damage w/chosen weapon"',
  'Whirlwind Blitz':
    'Section=combat ' +
    'Note="May make full-attack action or use Whirlwind Attack as a standard action"',

  // Monk
  'Adamantine Monk':
    'Section=combat Note="DR %V/-; may spend 1 Ki Point to dbl for 1 rd"',
  'Ancient Healing Hand':
    'Section=combat ' +
    'Note="May spend 2 Ki Points to restore %{levels.Monk} HP to another"',
  'Aspect Master':'Section=combat Note="1 Selection"',
  'Aspect Of The Carp':
    'Section=ability,feature ' +
    'Note=' +
      '"%{speed}\' Swim",' +
      '"Has Amphibious features"',
  'Aspect Of The Ki-Rin':
    'Section=ability Note="May fly %{speed}\' each rd between landings"',
  'Aspect Of The Monkey':
    'Section=ability,feature ' +
    'Note=' +
      '"%{speed}\' Climb",' +
      '"May use tail to pick up objects and make unarmed attacks"',
  'Aspect Of The Oni':
    'Section=magic ' +
    'Note="May use effects of <i>Gaseous Form</i> %{levels.Monk} min/dy"',
  'Aspect Of The Owl':'Section=ability Note="30\' Fly"',
  'Aspect Of The Tiger':
    'Section=combat Note="May charge %{speed*10}\' and pounce 1/hr"',
  'Bastion Stance':
    'Section=combat ' +
    'Note="May forego move for immunity to knocked prone%{levels.Monk>=16 ? \' and forced move\' : \'\'} for 1 rd"',
  'Drunken Courage':
    'Section=save Note="Immunity to fear when Drunken Ki Pool is not empty"',
  'Drunken Ki':
    'Section=feature ' +
    'Note="Each alcoholic drink gives %V temporary Ki Point (%{(levels.Monk-1)//2} max) for 1 hr/May spend 1 Ki Point for 5\' swift action move w/out AOO when Drunken Ki Pool is not empty"',
  'Drunken Resilience':
    'Section=combat ' +
    'Note="DR %{(levels.Monk-10)//3}/- when Drunken Ki Pool is not empty"',
  'Drunken Strength':
    'Section=combat ' +
    'Note="May spend 1 Ki Point for +1d6 HP damage when Drunken Ki Pool is not empty%{levels.Monk>=10 ? \'; may spend 2\' + (levels.Monk>=15 ? \'-\' + levels.Monk//5 : \'\') + \' Drunken Ki Points to increase up to \' + levels.Monk//5 + \'d6\' : \'\'}"',
  'Firewater Breath':
    'Section=combat ' +
    'Note="May spend 4 Ki Points when Drunken Ki Pool is not empty for R30\' cone from alcohol drink that inflicts 20d6 HP fire (DC %{10+levels.Monk//2+wisdomModifier} Ref half)"',
  'Flurry Of Blows (Zen Archer)':
    'Section=combat Note="May only make Flurry Of Blows attacks with bow"',
  'Immortality':
    'Section=feature ' +
    'Note="Does not age; spontaneously reincarnates after 1 dy if killed"',
  'Iron Limb Defense':
    'Section=combat ' +
    'Note="May forego move for +2 AC and CMD for 1 rd; may spend 1 Ki Point for +4 AC and CMD"',
  'Iron Monk':
    'Section=combat,feature ' +
    'Note=' +
      '"+1 AC",' +
      '"Has Toughness features"',
  'Ki Arrows':
    'Section=combat ' +
    'Note="May spend 1 Ki Point to deal %{unarmedDamageDice}+%{unarmedDamageModifier} w/bow"',
  'Ki Focus Bow':
    'Section=combat ' +
    'Note="May use arrows for Ki attacks when Ki Pool is not empty"',
  'Ki Mystic':
    'Section=ability,skill ' +
    'Note=' +
      '"May spend 1 Ki Point for +4 on any ability check",' +
      '"+2 all Knowledge when Ki Pool is not empty/May spend 1 Ki Point for +4 on any skill check"',
  'Ki Pool (Zen Archer)':
    'Section=combat ' +
    'Note="May spend 1 Ki Point to increase bow range by 50\' for 1 rd"',
  'Ki Pool (Ki Mystic)':'Section=feature Note="+2 Ki Pool points"',
  'Ki Pool (Monk Of The Empty Hand)':
    'Section=combat Note="May spend 1 Ki Point for +20\' throw range for 1 rd"',
  'Ki Sacrifice':
    'Section=magic Note="May spend entire Ki Pool in 1 hr ritual for effects of <i>Raise Dead</i> (min 6 Ki Points)%{levels.Monk>=15 ? \' or <i>Resurrection</i> (min 8 Ki Points)\' : \'\'}; Ki Points replenish after 1 dy"',
  'Ki Weapons':
    'Section=combat ' +
    'Note="May spend 1 Ki Point to deal %{unarmedDamageDice}+%{unarmedDamageModifier} w/improvised weapon for 1 rd%{levels.Monk>=11 ? \'/May spend up to \' + (levels.Monk>=15 ? 5 : 3) + \' Ki Points to give improvised weapon enhancement bonus or abilities for 1 rd\' : \'\'}"',
  'Learned Master':
    'Section=skill ' +
    'Note="Knowledge is a class skill/Linguistics is a class skill/+%1 all Knowledge/+%1 Linguistics"',
  'Life From A Stone':
    'Section=combat Note="May use Steal Ki and Life Funnel on non-living foe"',
  'Life Funnel':
    'Section=combat ' +
    'Note="Scoring a critical hit or reducing foe to 0 HP when Ki Pool is not empty restores %{levels.Monk} HP to self"',
  'Mystic Insight':
    'Section=combat ' +
    'Note="R30\' May spend 2 Ki Points to give ally attack or save reroll"',
  'Mystic Persistence':
    'Section=combat ' +
    'Note="20\' radius gives allies better of two attack and save rolls for 1 rd/2 Ki Points"',
  'Mystic Prescience':'Section=combat Note="+%V AC/+%V CMD"',
  'Mystic Visions':
    'Section=magic ' +
    'Note="May spend 2 Ki Points for effects of <i>Divination</i> spell"',
  'Point Blank Master':'Section=feature Note="Has Point-Blank Shot features"',
  'Pure Power':'Section=ability Note="+2 Strength/+2 Dexterity/+2 Wisdom"',
  'Reflexive Shot':'Section=combat Note="May make AOO w/bow"',
  'Sipping Demon':
    'Section=combat ' +
    'Note="Self gains +1 temporary HP for 1 hr from successful attack (+2 from crit; %{levels.Monk} temporary HP max) when Ki Pool is not empty"',
  'Slow Time':
    'Section=combat Note="May spend 6 Ki Points for 2 extra standard actions"',
  'Steal Ki':
    'Section=combat ' +
    'Note="Scoring a critical hit or reducing living foe to 0 HP when Ki Pool is not empty transfers 1 Ki Point from foe to self%{levels.Monk>=11 ? \' and gives +\' + wisdomModifier + \' save vs. disease\' : \'\'}"',
  'Touch Of Peace':
    'Section=magic ' +
    'Note="May spend 6 Ki Points to have attack inflict <i>Charm Monster</i> effect for %{levels.Monk} dy instead of HP damage 1/dy"',
  'Touch Of Surrender':
    'Section=magic ' +
    'Note="May spend 6 Ki Points to add <i>Charm Monster</i> effect for %{levels.Monk} dy to damage that reduces foe to 0 HP"',
  'Trick Shot (Zen Archer)':
    'Section=combat Note="May spend 1 Ki Point to ignore concealment, 2 to ignore total concealment or cover, or 3 to ignore total cover w/bow shot for 1 rd"',
  'True Sacrifice':
    'Section=magic ' +
    'Note="May permanently destroy self for R50\' <i>True Resurrection</i> of allies\' corpses"',
  'Uncanny Initiative':'Section=combat Note="May choose Initiative value"',
  'Versatile Improvisation':
    'Section=combat Note="May change damage type of improvised weapon"',
  'Vow Of Silence':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 AC/+2 CMD",' +
      '"+4 Perception/+4 Sense Motive/+4 Stealth"',
  'Way Of The Bow':
    'Section=feature Note="+1 General Feat (Weapon Focus (bow))%1"',
  'Way Of The Weapon Master':
     'Section=feature Note="+1 General Feat (Weapon Focus (monk weapon))%1"',
  'Zen Archery':'Section=combat Note="+%V bow attacks"',

  // Paladin
  'Aura Of Healing':
    'Section=magic ' +
    'Note="May expend 1 Channel Energy use for 30\' radius that gives allies stabilization, immunity to bleed damage, save vs. affliction, and HD HP healing for %{levels.Paladin} rd"',
  'Aura Of Life':
    'Section=combat ' +
    'Note="10\' radius inflicts on undead -4 Will vs. positive energy and no recovery of HP from channeled negative energy"',
  'Call Celestial Ally':
    'Section=magic ' +
    'Note="May cast <i>%{levels.Paladin<12? \'Lesser \' : levels.Paladin>=16 ? \'Greater \' : \'\'}Planar Ally</i> 1/wk"',
  'Divine Armor':
    'Section=combat ' +
    'Note="Armor lights 30\' radius and gives +%{(levels.Paladin-2)//3} AC or special properties for %{levels.Paladin} min %{(levels.Paladin-1)//4}/dy"',
  'Divine Holy Symbol':
    'Section=magic ' +
    'Note="Holy symbol lights 30\' radius and gives %{(levels.Paladin-2)//3} choices of +1 spell caster level, +1 undead Channel Energy DC, +1d6 Channel Energy, or +1 Lay On Hands use, for %{levels.Paladin} min %{(levels.Paladin-1)//4}/dy"',
  'Domain (Paladin)':'Section=feature Note="1 Selection"',
  'Hospitaler':
    'Section=magic ' +
    'Note="May use Channel Energy w/out expending Lay On Hands"',
  "Knight's Charge":
    'Section=combat ' +
    'Note="Mounted charge provokes no AOO/Smite Evil at end of mounted charge inflicts panicked (DC %{10+levels.Paladin//2+charismaModifier} Will neg)"',
  'Light Of Faith':
    'Section=magic ' +
    'Note="May use Lay On Hands for %{levels.Paladin>=20 ? 60 : 30}\' radius that %{levels.Paladin>=12 ? \'acts as <i>Daylight</i> spell and \' : \'\'}gives allies +%{levels.Paladin>=20 ? 2 : 1} AC, attack, damage, and saves vs. fear%1"',
  'Power Of Faith':
   'Section=feature,magic ' +
   'Note=' +
     '"Has Light Of Faith feature",' +
     '"+%{levels.Paladin//4} daily uses of Lay On Hands"',
  'Shared Defense':
    'Section=magic ' +
    'Note="May expend 1 Lay On Hands use to give +%{levels.Paladin>=15 ? 3: levels.Paladin>=9 ? 2 : 1} AC and CMD%1 to allies in %{5+levels.Paladin//6*5}\' radius for %{charismaModifier} rd"',
  'Shining Light':
    'Section=combat ' +
    'Note="30\' radius inflicts %{levels.Paladin//2}d6 HP and blindness 1 rd on evil creatures (1d4 rd blindness on dragon, outsider, or undead) (DC %{10+levels.Paladin//2+charismaModifier} Ref half HP only); good creatures regain %{levels.Paladin//2}d6 HP and gain +2 ability checks, attack, saves, and skill checks for 1 rd %{(levels.Paladin-11)//3}/dy"',
  'Skilled Rider':
    'Section=companion,skill ' +
    'Note=' +
      '"+%V saves",' +
      '"No Ride armor penalty"',
  'Undead Annihilation':
    'Section=combat ' +
    'Note="Smite Evil hit on undead destroys foe below %{levels.Paladin*2} HD (DC %{10+levels.Paladin//2+charismaModifier} Will neg)"',
  'Undead Scourge':
    'Section=combat ' +
    'Note="No dbl damage on Smite Evil vs. dragons or outsiders"',

  // Ranger
  'Adaptation':
    'Section=feature ' +
    'Note="May use special ability of %{(levels.Ranger+2)//5} favored enemy %{levels.Ranger*10} min/dy"',
  'Aiding Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to give ally +2 next attack on foe hit by self for 1 rd"',
  'Blend In':
    'Section=skill ' +
    'Note="May substitute Stealth for Disguise w/in favored community"',
  'Bolster Companion':
    'Section=companion ' +
    'Note="May use Hunter\'s Trick to give animal companion immediate +4 AC, +4 CMD, and half damage reduction when hit"',
  'Catfall':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to ignore 20\' of falling damage"',
  'Chameleon Step':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to move dbl speed w/out Stealth penalty"',
  'Cunning Pantomime':
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to communicate w/any speaking creature for 10 min; suffers -4 Bluff and Diplomacy"',
  'Defensive Bow Stance':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to make ranged attack w/out provoking AOO for 1 rd"',
  'Deft Stand':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to stand up w/out provoking AOO"',
  'Distracting Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict -2 attacks on foe for 1 rd w/successful attack"',
  'Dual Form Shifter':'Section=feature Note="May use 2 Shifter\'s Blessings simultaneously"',
  'Favored Community':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+2 Initiative w/in favored community",' +
      '"%{(levels.Ranger+2)//5} Selections",' +
      '"+2 or more Knowledge (Local), Perception, Stealth, and Survival w/in favored community"',
  'Form Of The Bear':'Section=ability Note="+%V Strength%1 in shifted form"',
  'Form Of The Cat':
    'Section=ability,skill ' +
    'Note=' +
      '"+%V Speed in shifted form",' +
      '"+%V Acrobatics and Climb in shifted form"',
  'Form Of The Dragon':
    'Section=ability,combat ' +
    'Note=' +
      '"%V\' Fly in shifted form",' +
      '"+%V AC in shifted form"',
  'Form Of The Eagle':
    'Section=ability,skill ' +
    'Note=' +
     '"%V\' Fly in shifted form",' +
     '"+10 Perception in shifted form"',
  'Form Of The Jackal':
    'Section=combat Note="May move %V speed w/out provoking AOO"',
  'Form Of The Otter':
    'Section=ability,skill ' +
    'Note=' +
      '"%V\' Swim in shifted form",' +
      '"+%V Swim in shifted form"',
  'Hateful Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to dbl threat range against favored enemy for 1 rd"',
  'Heel':
    'Section=companion ' +
    'Note="May use Hunter\'s Trick to move animal companion to self w/out provoking AOO in starting square"',
  'Hobbling Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict half Speed for 1d4 rd with successful attack"',
  "Hunter's Tricks":
    'Section=feature ' +
    'Note="May use %V selections %{levels.Ranger//2+wisdomModifier}/dy"',
  'Improved Empathic Link':
    'Section=companion ' +
    'Note="May share emotions and see through companions eyes up to 1 mi"',
  'Improved Ranger\'s Luck':
    'Section=combat Note="Increased Ranger\'s Luck effects"',
  'Inspired Moment':
    'Section=feature ' +
    'Note="Self gains +10\' Speed, extra move, +4 AC and attack, +4 ability and skill checks, and confirm crit for 1 rd %{levels.Ranger>=19 ? 2 : 1}/dy"',
  'Invisibility Trick':
    'Section=magic ' +
    'Note="My cast self <i>Greater Invisibility</i> %{wisdomModifier>?1}/dy"',
  'Master Shifter':
    'Section=feature ' +
    'Note="Increased Shifter\'s Blessing effects; may polymorph instead"',
  'Mounted Bond':'Section=feature Note="Has Animal Companion mount"',
  'Push Through':
    'Section=combat ' +
    'Note="Not slowed by difficult terrain and can move through spaces occupied by locals w/in favored community"',
  'Quick Climb':
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to Climb at full speed w/out penalty for 1 rd"',
  'Quick Healing':
    'Section=combat ' +
    'Note="May use Hunter\'s Truck for swift action Heal skill or move action potion use on adjacent ally"',
  'Quick Swim':
    'Section=skill Note="May use Hunter\'s Truck for full speed Swim for 1 rd"',
  "Ranger's Counsel":
    'Section=skill ' +
    'Note="R30\' May use Hunter\'s Trick to give allies +2 on choice of known skill"',
  "Ranger's Focus":
    'Section=combat ' +
    'Note="+%{2+2*levels.Ranger//5} attack and damage vs. target until surrenders or unconscious %{(levels.Ranger+2)//3}/dy"',
  "Ranger's Luck":
    'Section=combat ' +
    'Note="May gain%1 reroll attack or force foe%2 reroll %{(levels.Ranger-4)//5}/dy"',
  'Rattling Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict shaken for 1d4 rd w/successful attack"',
  'Second Chance Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to immediately reroll melee miss w/-5 attack"',
  "Shifter's Blessing":
    'Section=feature ' +
    'Note="May use %{(levels.Ranger+2)//5} selections for %{levels.Ranger+wisdomModifier} rd %{(levels.Ranger+2)//5}/dy"',
  "Sic 'em":
    'Section=companion ' +
    'Note="May use Hunter\'s Trick to give animal companion immediate attack on adjacent foe"',
  'Skill Sage':
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to take the better of 2 skill rolls"',
  'Spirit Bond':
    'Section=magic ' +
    'Note="May cast <i>Augury</i> and %{levels.Ranger//4} ranger spells w/in favored terrain 1/dy"',
  'Spiritual Bond':'Section=companion Note="R30\' Mount gains %{levels.Ranger} temporary HP and self may take half of mount\'s damage 1/dy"',
  "Stag's Leap":
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to make running jump w/out prior move"',
  'Strong Bond':'Section=companion Note="+3 Companion Master Level"',
  'Surprise Shift':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to move 5\' w/out provoking AOO"',
  'Tangling Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict entangled for 1 rd w/successful attack"',
  'Terrain Bond':
    'Section=combat,skill ' +
    'Note="Allies w/in sight gain +2 Initiative in favored terrain",' +
         '"Allies w/in sight gain +2 Perception, Stealth, and Survival and leave no trail in favored terrain"',
  'Trick Shot':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to ignore concealment, soft cover, and partial cover w/ranged attack"',
  'Uncanny Senses':
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to gain +10 Perception for 1 rd"',
  'Upending Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict trip w/successful attack"',
  'Vengeance Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to make immediate attack on adjacent foe who hits ally"',
  'Wisdom Of The Spirits':
    'Section=magic Note="May cast <i>Divination</i> instead of <i>Augury</i> w/in favored terrain or <i>Augury</i> in any terrain"',

  // Rogue
  'Accuracy':
    'Section=combat ' +
    'Note="Suffers only half range penalty on bow and crossbow attacks"',
  'Another Day':
    'Section=combat ' +
    'Note="May take 5\' step to avoid disabling damage; staggered for 1 rd afterward"',
  'Assault Leader':
    'Section=combat ' +
    'Note="May give immediate attack to flanking ally after missing flanked foe 1/dy"',
  'Befuddling Strike':
    'Section=combat ' +
    'Note="Successful sneak attack inflicts -2 attacks on self for 1d4 rd"',
  "Bravado's Blade":
    'Section=combat ' +
    'Note="May forego 1d6 HP sneak attack damage for Intimidate check to demoralize; +5 Intimidate per each additional 1d6 HP"',
  'Brutal Beating':
    'Section=combat ' +
    'Note="May forego 1d6 HP sneak attack damage to inflict sickened for %{levels.Rogue//2} rd"',
  'Camouflage (Rogue)':
    'Section=skill ' +
    'Note="1 min prep using local foliage gives +4 Stealth in same terrain for remainder of day 1/dy"',
  'Canny Observer':
    'Section=skill ' +
    'Note="+4 Perception (hear conversation about concealed items)"',
  'Careful Disarm':
    'Section=skill ' +
    'Note="Disable Device springs trap only on fail by 10+; dbl Trap Sense to avoid trap effects on failure"',
  'Charmer':
    'Section=skill ' +
    'Note="May take better of 2 Diplomacy rolls %{levels.Rogue//5+1}/dy"',
  'Coax Information':
    'Section=skill ' +
    'Note="May use Bluff or Diplomacy instead of Intimidate to change foe attitude"',
  'Combat Swipe':'Section=feature Note="Has Improved Steal feature"',
  'Cunning Trigger':
    'Section=combat Note="R30\' May use swift action to trigger self trap"',
  'Daring':
    'Section=save,skill ' +
    'Note=' +
      '"+%{levels.Rogue//3} vs. fear",' +
      '"+%V Acrobatics"',
  'Deadly Cocktail':
    'Section=combat Note="May apply 2 different poisons or 2 doses of 1 poison (+2 save DC, +50% frequency) to a weapon at once"',
  'Deadly Range':
    'Section=combat Note="+%{levels.Rogue//3*10}\' ranged sneak attack"',
  'Deadly Sneak':
    'Section=combat ' +
    'Note="During full attack action, may trade -2 attack for treating sneak attack 1s and 2s as 3s"',
  'Distracting Attack (Rogue)':
    'Section=combat ' +
    'Note="May forego sneak attack damage to inflict flat-footed vs. chosen ally (Uncanny Dodge neg)"',
  'Distraction (Rogue)':
    'Section=skill ' +
    'Note="May use Bluff vs. Sense Motive to avoid detection after failed Stealth"',
  'Entanglement Of Blades':
    'Section=combat ' +
    'Note="Successful sneak attack prevents foe 5\' step for 1 rd"',
  'Expert Acrobat':
    'Section=skill ' +
    'Note="No light armor Acrobatics, Climb, Fly, Sleight Of Hand, or Stealth penalties/+2 Acrobatics and Fly in no armor"',
  'Expert Leaper':
    'Section=skill ' +
    'Note="Always gains running start benefit on jumps/Successful DC 15 Acrobatics negates 20\' damage on deliberate falls"',
  'Fast Fingers':
    'Section=skill ' +
    'Note="May take better of 2 Sleight Of Hand rolls %{levels.Rogue//5+1}/dy"',
  'Fast Getaway':
    'Section=combat ' +
    'Note="May make immediate withdraw after successful sneak attack or Sleight Of Hand"',
  'Fast Picks':
    'Section=skill ' +
    'Note="May use Disable Device to open lock as a standard action"',
  'Fast Tumble':
    'Section=skill ' +
    'Note="May use Acrobatics to move through threatened square w/out penalty"',
  'Follow Clues':'Section=skill Note="May use Perception to follow tracks"',
  'Follow Up':
    'Section=skill ' +
    'Note="May roll 2 Diplomacy (gather information) checks, gaining info from both"',
  'Frightening':
    'Section=skill ' +
    'Note="Shaken condition from successful Intimidate lasts +1 rd; may inflict frightened for 1 rd instead of shaken for 4+ rd"',
  'Frugal Trapsmith':'Section=feature Note="May construct traps for 75% cost"',
  'Guileful Polyglot':'Section=skill Note="+%V Language Count"',
  'Hard To Fool':
    'Section=skill ' +
    'Note="May take better of 2 Sense Motive rolls %{levels.Rogue//5+1}/dy"',
  'Honeyed Words':
    'Section=skill ' +
    'Note="May take better of 2 Bluff rolls %{levels.Rogue//5+1}/dy"',
  "Hunter's Surprise":
    'Section=combat ' +
    'Note="May add sneak attack damage to successful attack on adjacent foe for 1 rd 1/dy"',
  'Knock-Out Blow':
    'Section=combat ' +
    'Note="May forego sneak attack damage to inflict unconscious for 1d4 rd (DC %{10+levels.Rogue//2+intelligenceModifier} Fort staggered 1 rd)"',
  'Lasting Poison':
    'Section=combat ' +
    'Note="May apply poison to last 2 attacks; targets gain +2 save"',
  'Martial Training':
    'Section=feature Note="Gains 1 Combat Feat (Martial Weapon Proficiency)/May choose Combat Trick rogue talent twice"',
  'Master Of Disguise':'Section=skill Note="May gain +10 Disguise 1/dy"',
  'Master Poisoner':
    'Section=skill ' +
    'Note="+%{levels.Rogue//2} Craft (Alchemy) (poisons)/May use Craft (Alchemy) and 1 hr lab work to change type of poison"',
  'Measure The Mark':
    'Section=skill ' +
    'Note="Knows target Perception roll before Sleight Of Hand attempt; may make Bluff vs. Sense Motive to avoid detection after aborted Sleight Of Hand"',
  'Nimble Climber':
    'Section=skill ' +
    'Note="Successful DC +10 Climb check after failed Climb avoids falling"',
  'Offensive Defense':
    'Section=feature ' +
    'Note="Gains +%{sneakAttack} AC after successful sneak attack for 1 rd"',
  'Peerless Maneuver':
    'Section=skill ' +
    'Note="May take better of 2 Acrobatics rolls %{levels.Rogue//5+1}/dy"',
  // Poison Use in Pathfinder.js
  'Positioning Attack':
    'Section=combat ' +
    'Note="May move 30\' w/out provoking AOO after successful melee attack, ending adjacent to same foe, 1/dy"',
  'Powerful Sneak':
    'Section=combat ' +
    'Note="During full attack action, may trade -2 attack for treating sneak attack 1s as 2s"',
  'Quick Disguise':
    'Section=skill Note="Reduces time to create effective disguise"',
  'Quick Trapsmith':
    'Section=skill ' +
    'Note="May set CR %{levels.Rogue//2} trap as full-round action"',
  "Rake's Smile":'Section=skill Note="+%V Bluff/+%V Diplomacy"',
  'Redirect Attack':
    'Section=combat ' +
    'Note="May redirect successful hit on self to adjacent creature 1/dy"',
  "Scout's Charge":
    'Section=combat ' +
    'Note="Charge attack inflicts sneak attack damage (Uncanny Dodge neg)"',
  'Second Chance (Rogue)':
    'Section=skill ' +
    'Note="May make -5 reroll on Acrobatics, Climb, or Fly %{levels.Rogue//3}/dy"',
  'Skilled Liar':'Section=skill Note="+%{levels.Rogue//2>?1} Bluff (deceive)"',
  'Skirmisher (Rogue)':
    'Section=combat ' +
    'Note="First attack after 10\' move inflicts sneak attack damage (Uncanny Dodge neg)"',
  'Snap Shot':
    'Section=combat ' +
    'Note="May make ranged attack at Initiative 20 during surprise round"',
  "Sniper's Eye":
    'Section=combat Note="R30\' May use ranged sneak attack on concealed foes"',
  'Stab And Grab':
    'Section=combat ' +
    'Note="May inflict -5 Perception vs. Sleight Of Hand to steal from target after successful surprise or sneak attack"',
  'Stealthy Sniper':
    'Section=combat Note="Reduces sniping Stealth penalty to -10"',
  'Strong Impression':'Section=feature Note="Has Intimidating Prowess feature"',
  'Survivalist':
    'Section=skill Note="Heal is a class skill/Survival is a class skill"',
  'Swift Poison':
    'Section=combat Note="May apply poison to a weapon as a move action"',
  'Thoughtful Reexamining':
    'Section=skill ' +
    'Note="May reroll Knowledge, Perception, or Sense Motive 1/dy"',
  'Trap Master':
    'Section=skill ' +
    'Note="May bypass trap on any successful Disable Device; may change which creatures can safely pass trap"',

  // Sorcerer
  'Aquatic Adaptation (Sorcerer)':
    'Section=ability,combat,feature,save ' +
    'Note=' +
      '"%{levels.Sorcerer>=15 ? 60 : 30}\' Swim",' +
      '"+1 AC",' +
      '"Has %{levels.Sorcerer>=15 ? 60 : 30}\' Blindsense underwater",' +
      '"Cold resistance 5"',
  'Aquatic Telepathy':
    'Section=feature,magic ' +
    'Note=' +
      '"100\' telepathy w/aquatic and swimming creatures",' +
      '"May cast on aquatic and swimming creatures <i>Suggestion</i> %{charismaModifier}/dy%{levels.Sorcerer>=15 ? \' and <i>Demand</i> 1/dy\' : \'\'}"',
  'Aurora Borealis':
    'Section=magic ' +
    'Note="Modified <i>Wall Of Fire</i> inflicts cold damage, fascinates %{levels.Sorcerer*2} HD of creatures w/in 10\' (DC %{10+levels.Sorcerer//2+charismaModifier} Will neg) for %{levels.Sorcerer} rd/dy"',
  'Avatar Of Chaos':
    'Section=magic,save ' +
    'Note=' +
      '"+2 save DC and spell penetration vs. lawful creatures",' +
      '"Immunity to acid, petrification, and polymorph"',
  'Blizzard (Sorcerer)':
    'Section=magic ' +
    'Note="May cast combined <i>Control Winds</i> and <i>Sleet Storm</i> centered on self 1/dy"',
  'Bloodline Aquatic':
    'Section=magic ' +
    'Note="+1 Caster Level on water spells/Summoned water and swimming creatures gain +1 attack and damage"',
  'Bloodline Boreal':'Section=magic Note="+1 save DC on cold spells"',
  'Bloodline Deep Earth':
    'Section=magic Note="+1 save DC on spells cast underground"',
  'Bloodline Dreamspun':
    'Section=magic ' +
    'Note="Casting targeted spells gives +0.5/spell level to AC and saves vs. target for 1 rd"',
  'Bloodline Protean':
    'Section=magic Note="+4 dispel DC on transmutation and creation spells"',
  'Bloodline Serpentine':
    'Section=magic ' +
    'Note="May affect animals, magical beasts, and monstrous humanoids with mind-affecting and language-dependent spells"',
  'Bloodline Shadow':
    'Section=magic ' +
    'Note="Casting darkness or shadow spell gives +1/spell level to Stealth for 1d4 rd"',
  'Bloodline Starsoul':
    'Section=magic ' +
    'Note="Evocation spells inflict dazzled for 1 rd/spell level"',
  'Bloodline Stormborn':
    'Section=magic Note="+1 save DC on electricity and sonic spells"',
  'Bloodline Verdant':
    'Section=magic ' +
    'Note="Casting personal spell gives +1/spell level to AC for 1d4 rd"',
  'Breaching The Gulf':
    'Section=magic ' +
    'Note="+3 caster level on teleportation spells/R30\' May teleport target to void, inflicting 6d6 HP cold/rd and suffocation (DC %{10+levels.Sorcerer//2+charismaModifier} Will neg or ends) 1/dy"',
  'Child Of Ancient Winters':
    'Section=feature,save ' +
    'Note=' +
      '"Has cold subtype",' +
      '"Has immunity to fatigue, exhaustion, sneak attacks, and critical hits/Has vulnerability to fire"',
  'Cold Steel':
    'Section=magic ' +
    'Note="Touched weapon gains <i>Frost</i> property for %{levels.Sorcerer//2>?1} rd%{levels.Sorcerer>=9 ? \' or <i>Icy Burst</i> property for \' + (levels.Sorcerer//4) + \' rd\' : \'\'} %{charismaModifier+3}/dy"',
  'Combat Precognition':'Section=combat Note="+%V Initiative"',
  'Crystal Shard':
    'Section=magic ' +
    'Note="Touched weapon gains <i>Bane</i> property vs. earth, ooze, stone, and metal creatures for 1 min %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy"',
  'Deep One':
    'Section=feature,magic,save ' +
    'Note=' +
      '"Has 60\' Blindsense/Has 120\' Blindsight and Evasion feature underwater",' +
      '"Has continuous <i>Freedom Of Movement</i> effects",' +
      '"Has DR 10/piercing, cold resistance 20, and immunity to water pressure damage"',
  'Dehydrating Touch':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Sorcerer//2} HP nonlethal (oozes, plants, and water creatures lethal) and sickened for 1 rd %{charismaModifier+3}/dy"',
  'Den Of Vipers':
    'Section=magic ' +
    'Note="May use <i>Summon Swarm</i> effects w/serpents that inflict Con damage and entanglement 1/dy"',
  'Dreamshaper':
    'Section=magic Note="May use <i>Modify Memory</i> or mental <i>Speak With Dead</i> effects (DC %{10+levels.Sorcerer//2+charismaModifier} neg) %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy"',
  'Earth Glide':
    'Section=ability ' +
    'Note="May move through earth and stone at half speed, leaving no trace, for %V rd/dy"',
  'Enveloping Darkness':
    'Section=magic ' +
    'Note="May use entangling <i>Deeper Darkness</i> effects 1/dy"',
  'Eye Of Somnus':
    'Section=magic ' +
    'Note="May use <i>Arcane Eye</i> effects, optionally with <i>Symbol Of Sleep</i> effects, 1/dy"',
  'Icewalker':
    'Section=ability,save ' +
    'Note=' +
      '"Moves across ice and snow at full speed w/out leaving tracks%{levels.Sorcerer>=9 ? \'/May <i>Spider Climb</i> icy surfaces\' : \'\'}",' +
      '"Has cold resistance %{levels.Sorcerer>=9 ? 10 : 5}"',
  'Lullaby':
    'Section=magic ' +
    'Note="May cast <i>Lullaby</i> that inflicts -4 saves vs. sleep effects for 1 min %{charismaModifier+3}/dy"',
  'Massmorph':
    'Section=magic Note="May use <i>Plant Growth</i> and <i>Diminish Plants</i> at will, <i>Tree Shape</i>%{levels.Sorcerer>=15 ? \' or <i>Plant Shape I\' + (levels.Sorcerer>=20 ? \'I\' : \'\') : \'\'}</i> 1/dy"',
  'Minute Meteors':'Section=magic Note="R30\' 5\' diameter inflicts 1d4+%{levels.Sorcerer//2} HP fire (DC %{10+levels.Sorcerer//2+charismaModifier} Ref neg) %{charismaModifier+3}/dy"',
  'Nighteye':
    'Section=feature ' +
    'Note="%{(features.Darkvision ? 60 : 0) + (levels.Sorcerer>=9 ? 60 : 30)}\' b/w vision in darkness"',
  'Photosynthesis':
    'Section=feature,save ' +
    'Note=' +
      '"No need to eat/2 hr sleep gives benefits of 8 hr",' +
      '"+%{levels.Sorcerer>=9 ? 4 : 2} vs. poison and sleep"',
  'Protean Resistances':
    'Section=save ' +
    'Note="Has acid resistance %{levels.Sorcerer>=9 ? 10 : 5}/+%{levels.Sorcerer>=9 ? 4 : 2} vs. polymorph, petrification, and transmutation"',
  'Protoplasm':
    'Section=magic ' +
    'Note="R30\' Hurled protoplasm inflicts entanglement and 1 HP acid/rd for 1d3 rd %{charismaModifier+3}/dy"',
  'Raise The Deep':
    'Section=magic Note="May raise water as per%{levels.Sorcerer>=20 ? \' dbl dimension\' : \'\'} <i>Control Water</i> even when no water present 1/dy"',
  'Reality Wrinkle':
    'Section=combat ' +
    'Note="10\' radius inflicts 20% miss chance on outside attacks for %{levels.Sorcerer} rd/dy"',
  'Ride The Lightning':
    'Section=magic ' +
    'Note="Full-round action moves self %{speed*10}\' w/out AOO, inflicts Thunderbolt effect for %{levels.Sorcerer} rd 1/dy"',
  'Rockseer':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has Stonecunning feature%{levels.Sorcerer>=9 ? \'/Has 30\\\' tremorsense\' : \'\'}",' +
      '"Can see through solid objects for %{levels.Sorcerer} rd/dy",' +
      '"+2 Perception (stone)"',
  'Rooting':
    'Section=magic ' +
    'Note="May suffer Speed reduction to 5\' to gain +4 AC, +10 CMD vs. bull rush, overrun, reposition, and trip, 30\' tremorsense, and regain 1 HP/rd for %{levels.Sorcerer} min/dy"',
  'Scaled Soul':
    'Section=combat,feature,magic,save ' +
    'Note=' +
      '"May use Serpent\'s Fang at will, inflicting damage on choice of ability",' +
      '"Has shapechanger subtype",' +
      '"May assume form of reptilian humanoid or snake at will",' +
      '"Immune to poison and paralysis"',
  "Serpent's Fang":
    'Section=combat Note="%{levels.Sorcerer>=5 ? \'Magical f\' : \'F\'}angs inflict 1d%{features.Small ? 3 : 4}%{strengthModifier>=0 ? \'+\' + strengthModifier : strengthModifier} HP plus poison (1%{levels.Sorcerer>=11 ? \'d4\' : levels.Sorcerer>=5 ? \'d2\' : \'\'} Con/rd for 6 rd (DC %{10+levels.Sorcerer//2+constitutionModifier} neg or%{levels.Sorcerer>=7 ? \' twice to\' : \'\'} end)) for %{charismaModifier+3} rd/dy"',
  'Serpentfriend':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Familiar feature (Viper)",' +
      '"May use <i>Speak With Animals</i> at will with reptiles"',
  'Shadow Master (Sorcerer)':
    'Section=feature,magic ' +
    'Note=' +
      '"No sight penalty from natural or magical darkness",' +
      '"Summoned shadow creatures gain +4 Str, +4 Con, and 20% more reality"',
  'Shadow Well':
    'Section=magic,skill ' +
    'Note=' +
      '"R60\' May use <i>Dimension Door</i> effects in darkness or dim light to swap places w/ally%{levels.Sorcerer>=13 ? \' or swap 2 allies\' : \'\'} %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy",' +
      '"May use Stealth while being observed when w/in 10\' of shadow"',
  'Shadowstrike':
    'Section=combat ' +
    'Note="Touch inflicts 1d4 HP+%{levels.Sorcerer//2} nonlethal and dazzled for 1 min (Darkvision or Low-Light Vision HP only) %{charismaModifier+3}/dy"',
  'Shepherd Of The Trees':
    'Section=combat,feature,save ' +
    'Note=' +
      '"+4 AC",' +
      '"Has 30\' tremorsense",' +
      '"Immune to paralysis, poison, polymorph, sleep, and stunning"',
  'Snakeskin':
    'Section=combat,save,skill ' +
    'Note=' +
      '"+%V AC",' +
      '"+%{(levels.Sorcerer-1)//4} vs. poison",' +
      '"+%V Escape Artist"',
  'Snow Shroud':
    'Section=combat,magic,skill ' +
    'Note=' +
      '"Ignores concealment from snowy, icy, or foggy weather",' +
      '"May cast cold <i>Fire Shield</i> that gives 20% attack miss and +%{levels.Sorcerer//2} Stealth in snowy or icy areas for %{levels.Sorcerer} rd %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy",' +
      '"Suffers no Perception penalty from snowy, icy, or foggy weather"',
  'Solipsism':
    'Section=magic Note="May become incorporeal %{levels.Sorcerer} min/dy"',
  'Spatial Tear':
    'Section=magic ' +
    'Note="May use combined <i>Dimension Door</i> and <i>Black Tentacles</i> effects %{levels.Sorcerer>=20 ? 2 : 1}/dy"',
  'Starborn':
    'Section=combat,feature,save ' +
    'Note=' +
      '"Self regains 1 HP/rd at night when outdoors",' +
      '"No sight penalty from natural or magical darkness",' +
      '"Immune to cold and blindness"',
  'Storm Lord':
    'Section=combat,feature,save ' +
    'Note=' +
      '"May regain 1/3 HP from electricity or sonic attack damage 1/dy",' +
      '"Has 120\' Blindsight against concealment by fog, mist, or weather",' +
      '"Immune to deafness, stunning, and wind effects"',
  'Stormchild':
    'Section=feature,save ' +
    'Note=' +
      '"Has 60\' Blindsense vs. concealment from fog, mist, and weather",' +
      '"Has resistance to electricity 5 and sonic 5/Treats wind effects as %{levels.Sorcerer>=9 ? \'2 steps\' : \'1 step\'} less"',
  'Strength Of Stone':
    'Section=ability,combat,save ' +
    'Note=' +
      '"Suffers no penalty for squeezing through tight spaces",' +
      '"Has DR 10/adamantine/Immune to bull rush, drag, grapple, reposition, and trip maneuvers and push and pull effects when standing on ground",' +
      '"Immune to petrification"',
  'Tanglevine':
    'Section=combat ' +
    'Note="May make R15\' +%{levels.Sorcerer+charismaModifier} CMB disarm, steal, or trip maneuver %{charismaModifier+3}/dy"',
  'Thunderbolt':
    'Section=magic Note="R120\' 5\' radius inflicts %{levels.Sorcerer}d6 HP (half electricity, half sonic) (DC %{10+levels.Sorcerer//2+charismaModifier} Ref half) %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy"',
  'Thunderstaff':
    'Section=magic ' +
    'Note="Touched weapon gains <i>Shock</i> property for %{levels.Sorcerer//2>?1} rd%{levels.Sorcerer>=9 ? \' or <i>Shocking Burst</i> property for \' + (levels.Sorcerer//4) + \' rd\' : \'\'} %{charismaModifier+3}/dy"',
  'Tremor':
    'Section=combat ' +
    'Note="R30\' Shaking ground inflicts +%{levels.Sorcerer+charismaModifier} CMB trip on target %{charismaModifier+3}/dy"',
  'Voidwalker':
    'Section=feature,save ' +
    'Note=' +
      '"Has Low-Light Vision feature%{levels.Sorcerer>=9 ? \'/Does not need to breathe\' : \'\'}",' +
      '"Has resistance to cold 5, resistance to fire 5"',

  // Wizard
  'Acid Cloud':
    'Section=magic ' +
    'Note="R30\' 5\' radius inflicts 1d6+%{levels.Wizard//2} HP acid and sickened for 1 rd (DC %{10+levels.Wizard//2+intelligenceModifier} Fort half HP only) %{intelligenceModifier+3}/dy"',
  'Air Supremacy':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast self <i>Feather Fall</i>%{levels.Wizard>=5 ? \', <i>Levitate</i>\' : \'\'}%{levels.Wizard>=10 ? \', <i>Fly</i>\' : \'\'} at will",' +
      '"%V Fly"',
  'Augment':
    'Section=magic ' +
    'Note="Touch gives +%{levels.Wizard>=10 ? 4 : 2} ability or +%{1+levels.Wizard//5} AC for %{levels.Wizard//2>?1} rd %{intelligenceModifier+3}/dy"',
  'Aura Of Banishment':
    'Section=magic ' +
    'Note="30\' radius staggers summoned creatures (Will neg); next rd returns them to their home plane (Will neg) %{levels.Wizard} rd/dy"',
  'Battleshaping':
    'Section=magic Note="May use%{levels.Wizard>=11 ? \' 2\' : \'\'} +1 magical claw, bite, or gore %{intelligenceModifier+3}/dy"',
  'Bedeviling Aura':
    'Section=combat ' +
    'Note="30\' radius inflicts half speed, cannot take AOO, and flanked on foes for %{levels.Wizard} rd/dy"',
  'Beguiling Touch':
    'Section=magic ' +
    'Note="May touch for <i>Charm Monster</i> effects (%{levels.Wizard+1} HD, combat, hostile, or DC %{10+levels.Wizard//2+intelligenceModifier} Will neg) for %{levels.Wizard//2} rd %{intelligenceModifier+3}/dy"',
  'Binding Darkness':
    'Section=magic ' +
    'Note="R30\' Ranged touch inflicts entanglement for %{1+levels.Wizard//5} rd (bright light halves duration) %{intelligenceModifier+3}/dy"',
  'Bolster':
    'Section=magic ' +
    'Note="Touched undead gains +%{1+levels.Wizard//5} attack and saves, +2 turn resistance, and +1 temporary HP/HD for %{levels.Wizard//2>?1} rd %{intelligenceModifier+3}/dy"',
  'Cold Blast':
    'Section=magic ' +
    'Note="5\' radius inflicts 16d+%{levels.Wizard//2} HP cold and staggered for 1 rd (DC %{10+levels.Wizard//2+intelligenceModifier} Ref half HP only) %{intelligenceModifier+3}/dy"',
  'Counterspell Mastery':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Improved Counterspell feature",' +
      '"May use higher-level spell to counter as an immediate action %{(levels.Wizard-2)//4}/dy"',
  'Create Gear':
    'Section=magic ' +
    'Note="May create and retain for 1 min a %{levels.Wizard} lb simple item %{intelligenceModifier+3}/dy"',
  "Creator's Will":
    'Section=magic ' +
    'Note="May cast <i>%{levels.Wizard>=12 ? \'Major\' : \'Minor\'} Creation</i> %{levels.Wizard//2}/dy"',
  'Cyclone':
    'Section=combat ' +
    'Note="10\' radius negates ranged attacks, knocks flying creatures to the ground (DC %{10+levels.Wizard} Fly neg), and bars passage to ground creatures (DC %{10+levels.Wizard} Str neg) for %{levels.Wizard} rd/dy"',
  'Dancing Flame':
    'Section=magic ' +
    'Note="May move nonmagical fire 30\', remove squares from self instantaneous fire spell, or move effect of longer self fire spell %{levels.Wizard//2}/dy"',
  'Disruption':
    'Section=combat ' +
    'Note="Touch inflicts DC 15 + dbl spell level concentration to use spell for %{levels.Wizard//2>?1} rd %{intelligenceModifier+3}/dy"',
  // Earth Glide as Sorcerer
  'Earth Supremacy':
    'Section=combat,magic ' +
    'Note=' +
      '"+%{2+levels.Wizard//5} CMD vs. bull rush, drag, overrun, reposition, and trip when touching ground/+1 attack and damage when self and foe touching ground",' +
      '"Earth and stone do not block spell line of sight"',
  'Elemental Manipulation':
    'Section=magic ' +
    'Note="30\' radius modifies energy type of spells and supernatural effects from casters up to level %{levels.Wizard} and creatures up to %{levels.Wizard} HD %{levels.Wizard} rd/dy"',
  'Fire Jet':
    'Section=magic ' +
    'Note="20\' line inflicts 1d6+%{levels.Wizard//2} HP fire and 1d6 HP fire in next rd (DC %{10+levels.Wizard//2+intelligenceModifier} Ref half first rd only) %{intelligenceModifier+3}/dy"',
  'Fire Supremacy':
    'Section=combat,save ' +
    'Note=' +
      '"Surrounding flames inflict %{levels.Wizard//2>?1} HP fire on successful melee attack when w/in 5\' of a fire",' +
      '"%{levels.Wizard==20 ? \'Immune\' : levels.Wizard>=10 ? \'Resistance 10\' : \'Resistance 5\'} to fire"',
  'Force Of Will':
    'Section=magic ' +
    'Note="R60\' May transmit thoughts to%{levels.Wizard>=11 ? \' and from\' : \'\'} charmed and dominated creatures%{levels.Wizard>=20 ? \'/Target of self enchantment spell affected for 1 rd after successful save\' : \'\'}"',
  'Foretell':
    'Section=combat ' +
    'Note="30\' radius gives allies +2 or foes -2 on ability checks, attack, caster level checks, saves, and skill checks for %{levels.Wizard} rd/dy"',
  'Healing Grace':
    'Section=magic ' +
    'Note="Self targeted and area effect spells heal %{levels.Wizard>=20 ? 3 : levels.Wizard >= 11 ? 2 : 1} HP per spell level, distributed among targets"',
  'Irresistible Demand':
    'Section=magic ' +
    'Note="May use <i>Dominate Monster</i> effects on creatures up to %{levels.Wizard} HD (DC %{10+levels.Wizard//2+intelligenceModifier} Will neg) %{levels.Wizard} rd/dy"',
  'Lightning Flash':
    'Section=combat ' +
    'Note="5\' radius inflicts 1d6+%{levels.Wizard//2} HP electricity and dazzled for 1d4 rd (DC %{10+levels.Wizard//2+intelligenceModifier} Ref half HP only) %{intelligenceModifier+3}/dy"',
  'Lingering Evocations':
    'Section=magic ' +
    'Note="Evocation spells last +%{levels.Wizard//2>?1} rd%{levels.Wizard>=20 ? \'/Dispel checks vs. self evocation spells take worse of 2 rolls\' : \'\'}"',
  'Perfection Of Self':
    'Section=ability ' +
    'Note="May gain +%{levels.Wizard//2<?10} on choice of ability for 1 rd %{levels.Wizard}/dy"',
  'Prescience':
    'Section=combat ' +
    'Note="May substitute pre-rolled d20 value for any d20 roll for 1 rd %{intelligenceModifier+3}/dy"',
  'Send Senses':
    'Section=magic ' +
    'Note="R%{100+levels.Wizard*10}\' May see or hear remotely for %{levels.Wizard//2>?1} rd %{intelligenceModifier+3}/dy"',
  'Shadow Step':
    'Section=magic ' +
    'Note="May teleport %{levels.Wizard*30}\'/dy (5\' increments), reappearing 5\' off target and gaining effects of <i>Blur</i> for 1 rd; including others uses equal portion of daily distance"',
  'Shape Emotions':
    'Section=magic ' +
    'Note="30\' radius gives allies +4 saves vs. mind-affecting effects and reduction of fear by 1 step or inflicts -2 vs. mind-affecting effects on foes for %{levels.Wizard} rd/dy"',
  'Share Essence':
    'Section=magic ' +
    'Note="Touch gives 1d6+%{levels.Wizard//2} temporary HP for 1 hr and self suffers equal HP nonlethal %{intelligenceModifier+3}/dy"',
  'Shift':
    'Section=magic Note="May use <i>Dimension Door</i> effects to move %{levels.Wizard//2*5>?5}\' %{intelligenceModifier+3}/dy"',
  'Terror':
    'Section=combat ' +
    'Note="Touch causes target to provoke AOO (%{levels.Wizard+1} HD neg) %{intelligenceModifier+3}/dy"',
  'Unstable Bonds':
    'Section=combat ' +
    'Note="Touch inflicts shaken and staggered on summoned creature for %{levels.Wizard//2} rd %{intelligenceModifier+3}/dy"',
  'Versatile Evocation':
    'Section=magic ' +
    'Note="May change type of damage done by self energy spell %{intelligenceModifier+3}/dy"',
  'Water Supremacy':
    'Section=ability,feature,skill ' +
    'Note=' +
      '"%{speed}\' Swim",' +
      '"May hold breath for %{constitution*4} rd",' +
      '"%V Swim"',
  'Wave':
    'Section=magic ' +
    'Note="%{5*levels.Wizard}\'x20\' wave moves away 30\'/rd, douses flames, and knocks prone or carries away (caster level vs. CMD; DC %{10+levels.Wizard//2+intelligenceModifier} Str to end) %{levels.Wizard//2} rd/dy"',
  'Wind Servant':
    'Section=magic Note="May blow %{levels.Wizard} lb object 30\' %{intelligenceModifier+3}/dy"',

  // Feats
  'Additional Traits':'Section=feature Note="+2 Trait Count"',
  'Allied Spellcaster':
    'Section=magic ' +
    'Note="+2 to overcome spell resistance when adjacent ally has same feat, +4 and +1 spell level with same spell"',
  'Arcane Blast':
    'Section=magic ' +
    'Note="R30\' ranged touch uses spell slot to inflict 2d6 HP + 1d6 HP/slot level"',
  'Arcane Shield':
    'Section=feature Note="Use spell slot to gain +1 AC/slot level"',
  'Arcane Talent':
    'Section=magic ' +
    'Note="Cast chosen W0 spell 3/dy (DC %{10+charismaModifier})"',
  'Aspect Of The Beast (Claws Of The Beast)':
    'Section=combat ' +
    'Note="Claws inflict %{features.Small ? \'1d3\' : \'1d4\'} HP damage"',
  'Aspect Of The Beast (Night Senses)':'Section=feature Note="%V"',
  "Aspect Of The Beast (Predator's Leap)":
    'Section=skill Note="May make running jump without running beforehand"',
  'Aspect Of The Beast (Wild Instinct)':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Initiative",' +
      '"+2 Survival"',
  'Bashing Finish':
    'Section=combat Note="May make free shield bash after critical hit"',
  'Bloody Assault':
    'Section=combat ' +
    'Note="May trade -5 attack for extra 1d4 HP bleeding damage (DC 15 Heal ends)"',
  'Bodyguard':
    'Section=combat ' +
    'Note="May use AOO on aid another action to improve adjacent ally\'s AC"',
  'Bouncing Spell':'Section=magic Note="May redirect ineffectual spell"',
  'Breadth Of Experience':
    'Section=skill ' +
    'Note="+2 all Knowledge/+2 all Profession/May use Knowledge and Profession untrained"',
  'Bull Rush Strike':
    'Section=combat Note="May push on critical hit that exceeds foe CMD"',
  'Charge Through':
    'Section=combat Note="May attempt free overrun during charge"',
  'Childlike':
    'Section=skill ' +
    'Note="May take 10 on Bluff (appear innocent)/+2 Disguise (human child)"',
  'Cloud Step':
    'Section=magic ' +
    'Note="May <i>Air Walk</i> half of Slow Fall distance (50\' max)"',
  'Cockatrice Strike':
    'Section=combat ' +
    'Note="Unarmed crit petrifies dazed, flat-footed, paralyzed, staggered, stunned, or unconscious foe (DC %{10 + level//2 + wisdomModifier} Fort neg)"',
  'Combat Patrol':
    'Section=combat ' +
    'Note="May use full-round action to increase threat area by %{baseAttack//5}\'"',
  'Cooperative Crafting':
    'Section=skill ' +
    'Note="Assisting another gives +2 Craft or Spellcraft and dbl GP value"',
  'Coordinated Defense':
    'Section=combat ' +
    'Note="+2 CMD (+4 vs. larger foe) when adjacent ally also has this feat"',
  'Coordinated Maneuvers':
    'Section=combat ' +
    'Note="+2 CMB, +2 CMD, and +4 vs. grapple when adjacent ally also has this feat"',
  'Cosmopolitan':
    'Section=skill ' +
    'Note="+2 Language Count/Two chosen Int, Wis, or Cha skills are class skills"',
  'Covering Defense':
    'Section=combat ' +
    'Note="Total defense action gives +%{shield==\'Tower\' ? 4 : shield=~\'Heavy\' ? 2 : 1} AC to adjacent ally"',
  'Crippling Critical':
    'Section=combat ' +
    'Note="Critical hit reduces foe speed by half for 1 min (DC %{10 + baseAttack} Fort 1d4 rd)"',
  'Crossbow Mastery':
    'Section=combat Note="May reload crossbow as free action w/out AOO"',
  'Dastardly Finish':
    'Section=combat Note="May coup de grace cowering and stunned targets"',
  'Dazing Assault':
    'Section=feature ' +
    'Note="May suffer -5 attack to daze w/hit (DC %{10 + baseAttack} neg)"',
  'Dazing Spell':
    'Section=magic ' +
    'Note="May forego spell damage to daze target for spell level rd (spell save or Will neg)"',
  'Deep Drinker':'Section=feature Note="Gain 2 temporary ki from Drunken Ki"',
  'Deepsight':'Section=feature Note="120\' Darkvision"',
  'Disarming Strike':
    'Section=combat Note="May disarm on critical hit that exceeds foe CMD"',
  'Disrupting Shot':
    'Section=combat ' +
     'Note="R30\' Casting opponent suffers +4 concentration DC from successful ranged attack"',
  'Disruptive Spell':
    'Section=magic Note="Effect of disruptive spell last for 1 rd"',
  "Diviner's Delving":
    'Section=magic ' +
    'Note="+2 checks to overcome divination spell resistance; concentration divinations require 1 fewer rd"',
  'Dreadful Carnage':
    'Section=combat ' +
    'Note="R30\' May make Intimidation check to demoralize foes after reducing foe to 0 HP"',
  'Duck And Cover':
    'Section=combat,save ' +
    'Note=' +
      '"May use Reflex roll of adjacent ally who also has this feat; knocked prone afterward",' +
      '"+2 AC vs. ranged if adjacent ally also has this feat"',
  'Eagle Eyes':'Section=skill Note="Ignore -5 penalties on visual Perception"',
  'Eclectic':'Section=feature Note="Additional favored class"',
  'Ectoplasmic Spell':
    'Section=magic ' +
    'Note="Cast spell targeting incorporeal or ethereal target uses +1 spell slot"',
  'Eldritch Claws':
    'Section=combat ' +
    'Note="Natural weapons considered magic and silver for overcoming DR"',
  'Elemental Fist':
    'Section=combat ' +
    'Note="Successful attack inflicts +%Vd6 HP of choice of energy type"',
  'Elemental Focus (Acid)':
    'Section=magic Note="+%V DC on spells that inflict acid damage"',
  'Elemental Focus (Cold)':
    'Section=magic Note="+%V DC on spells that inflict cold damage"',
  'Elemental Focus (Electricity)':
    'Section=magic Note="+%V DC on spells that inflict electricity damage"',
  'Elemental Focus (Fire)':
    'Section=magic Note="+%V DC on spells that inflict fire damage"',
  'Elemental Spell (Acid)':
    'Section=magic Note="May convert half of spell damage to acid damage"',
  'Elemental Spell (Cold)':
    'Section=magic Note="May convert half of spell damage to cold damage"',
  'Elemental Spell (Electricity)':
    'Section=magic ' +
    'Note="May convert half of spell damage to electricity damage"',
  'Elemental Spell (Fire)':
    'Section=magic Note="May convert half of spell damage to fire damage"',
  'Elven Accuracy':
    'Section=combat Note="May reroll bow miss due to concealment"',
  'Enforcer':
    'Section=combat ' +
    'Note="May make Intimidation check to shake foe for HP rd (crit also frightened 1 rd) after inflicting nonlethal damage"',
  'Expanded Arcana':
    'Section=magic Note="+1 spells known (+2 of lower than max level)"',
  'Extra Bombs':'Section=combat Note="+%V bombs/dy"',
  'Extra Discovery':'Section=feature Note="+%V discoveries"',
  'Extra Hex':'Section=feature Note="+%V hexes"',
  'Extra Rage Power':'Section=feature Note="+%V powers"',
  'Extra Revelation':'Section=feature Note="+%V revelations"',
  'Extra Rogue Talent':'Section=feature Note="+%V talents"',
  'Fast Drinker':
    'Section=feature Note="Drinking for temporary Ki is a swift action"',
  'Fast Healer':
    'Section=combat Note="Regain +%{constitutionModifier//2>?1} when healing"',
  'Favored Defense':
    'Section=combat ' +
    'Note="+Half favored enemy bonus to AC and CMD vs. chosen enemy"',
  'Fight On':
    'Section=combat ' +
    'Note="Gain %{constitutionModifier} temporary HP for 1 min when brought to 0 HP 1/dy"',
  'Flyby Attack':
    'Section=combat Note="May take action any time during fly move"',
  'Focused Shot':
    'Section=combat ' +
    'Note="R30\' +%{intelligenceModifier} HP damage on bow or crossbow attack"',
  'Focused Spell':
    'Section=magic ' +
    'Note="Chosen target suffers +2 save DC on spell w/multiple targets"',
  'Following Step':'Section=combat Note="May use Step Up to move 10\'"',
  'Furious Focus':
    'Section=combat ' +
    'Note="Ignore penalty on first attack using Power Attack w/two-handed weapon"',
  'Gang Up':
    'Section=feature Note="Considered flanking regardless of ally position"',
  'Gnome Trickster':
    'Section=magic ' +
    'Note="May cast <i>Mage Hand</i> and <i>Prestidigitation</i> 1/dy"',
  'Go Unnoticed':
    'Section=skill Note="May use Stealth to hide from flat-footed foes"',
  'Greater Blind-Fight':
    'Section=combat ' +
    'Note="No penalty for foe partial concealment, 20% chance for full; located unseen attacker gets no attack bonus"',
  'Greater Dirty Trick':
    'Section=combat Note="Dirty Trick penalty extends +1d4+ rd"',
  'Greater Drag':'Section=combat Note="+2 checks to drag foe"',
  'Greater Elemental Focus (Acid)':
    'Section=magic Note="Increased Elemental Focus Effects"',
  'Greater Elemental Focus (Cold)':
    'Section=magic Note="Increased Elemental Focus Effects"',
  'Greater Elemental Focus (Electricity)':
    'Section=magic Note="Increased Elemental Focus Effects"',
  'Greater Elemental Focus (Fire)':
    'Section=magic Note="Increased Elemental Focus Effects"',
  'Greater Reposition':'Section=combat Note="+2 checks to move foe"',
  'Greater Shield Specialization (Buckler)':
    'Section=combat Note="+2 AC vs. crit, may negate crit 1/dy"',
  'Greater Shield Specialization (Heavy)':
    'Section=combat Note="+2 AC vs. crit, may negate crit 1/dy"',
  'Greater Shield Specialization (Light)':
    'Section=combat Note="+2 AC vs. crit, may negate crit 1/dy"',
  'Greater Shield Specialization (Tower)':
    'Section=combat Note="+2 AC vs. crit, may negate crit 1/dy"',
  'Greater Steal':
    'Section=combat ' +
    'Note="+2 CMB to steal from foe; foe does not notice successful steal"',
  'Groundling':
    'Section=magic ' +
    'Note="May use <i>Speak With Animals</i> w/burrowing animals at will"',
  'Heroic Defiance':
    'Section=combat Note="May delay effects of harmful condition 1 rd 1/dy"',
  'Heroic Recovery':
    'Section=save Note="May reroll failed Fort vs. harmful condition 1/dy"',
  'Improved Blind-Fight':
    'Section=combat ' +
    'Note="R30\' Located unseen attacker gains no ranged attack bonus"',
  'Improved Dirty Trick':
    'Section=combat Note="+2 CMB, +2 CMD, and no AOO w/dirty tricks"',
  'Improved Drag':
    'Section=combat Note="+2 CMB to drag foe w/out AOO/+2 CMD vs. drag"',
  'Improved Ki Throw':
    'Section=feature ' +
    'Note="May use Ki Throw for -4 bull rush on another target"',
  'Improved Reposition':
    'Section=combat ' +
    'Note="+2 CMB to move foe w/out AOO/+2 CMD vs. move attempts"',
  'Improved Second Chance':
    'Section=combat ' +
    'Note="May proceed w/additional attacks after failed Second Chance at -5 attack"',
  'Improved Share Spells':
    'Section=magic ' +
    'Note="May share non-instantaneous self spells w/companion; halves duration"',
  'Improved Sidestep':
    'Section=combat Note="May move on next rd after Sidestep"',
  'Improved Steal':
    'Section=combat ' +
    'Note="+2 CMB to steal from foe w/out AOO/+2 CMD vs. steal attempts"',
  'Improved Stonecunning':'Section=skill Note="+4 Perception (stone)"',
  "In Harm's Way":
    'Section=combat ' +
    'Note="May suffer damage from attack aimed at adjacent ally when using aid another"',
  'Intensified Spell':
    'Section=magic ' +
    'Note="Cast spell inflicts damage as caster level %{casterLevel+5} uses +1 spell slot"',
  'Ironguts':
    'Section=save,skill ' +
    'Note=' +
      '"+2 vs. ingested nauseated or sickened condition",' +
      '"+2 Survival (find food for self)"',
  'Ironhide':'Section=combat Note="+1 AC"',
  'Keen Scent':'Section=feature Note="Has Scent features"',
  'Ki Throw':
    'Section=feature ' +
    'Note="May throw foe into adjacent square after successful unarmed trip"',
  'Leaf Singer':
    'Section=feature ' +
    'Note="Dbl range or area of effect of Bardic Performance in forest/+2 Bardic Performance DC vs. feys"',
  'Light Step':
    'Section=ability Note="Ignore difficult terrain in natural environments"',
  'Lingering Performance':
    'Section=feature ' +
    'Note="Bardic Performance effects last 2 rd after performance ends"',
  'Lingering Spell':
    'Section=magic ' +
    'Note="Cast instantaneous spell to last 1 extra rd uses +1 spell slot"',
  'Lookout':
    'Section=combat ' +
    'Note="May act in surprise round when adjacent ally has same feat and can act"',
  'Low Profile':'Section=combat Note="+1 AC (ranged)"',
  'Lucky Halfling':
    'Section=save Note="R30\' May share saving throw w/ally 1/dy"',
  'Major Spell Expertise':
    'Section=magic ' +
    'Note="May use %V chosen 5th level spells as spell-like ability 2/dy"',
  'Master Alchemist':
    'Section=skill ' +
    'Note="+2 Craft (Alchemy)/Create %{intelligenceModifier} potion doses simultaneously/Craft alchemical items in 1/10 time"',
  'Merciful Spell':
    'Section=magic Note="May cast spells to inflict nonlethal damage"',
  'Minor Spell Expertise':
    'Section=magic ' +
    'Note="May use %V chosen 1st level spells as spell-like ability 2/dy"',
  'Missile':'Section=combat Note="No damage from ranged hit 1/rd"',
  'Mounted Shield':
    'Section=combat ' +
    'Note="Add shield bonus to mount AC and Ride checks to avoid mount damage"',
  'Mounted Skirmisher':
    'Section=combat Note="May take full-attack action after mount move"',
  'Outflank':
    'Section=combat ' +
    'Note="+4 flanking attack when ally has same feat; critical hit gives ally AOO"',
  'Paired Opportunists':
    'Section=combat ' +
    'Note="+4 AOO and share ally AOO when ally has same feat and threatens same foe"',
  'Parry Spell':'Section=magic Note="Countered spell turns back on caster"',
  'Parting Shot':'Section=combat Note="May make ranged attack during withdraw"',
  'Pass for Human':'Section=skill Note="+10 Disguise (pass as human)"',
  'Perfect Strike':
    'Section=combat ' +
    'Note="Use better of %V rolls when attacking w/kama, nunchaku, quarterstaff, sai or siangham %{level//4>?1}/dy"',
  'Persistent Spell':
    'Section=magic ' +
    'Note="Cast spell forcing target to take worse of 2 saving throws uses +2 spell slot"',
  'Point-Blank Master':
    'Section=combat Note="No AOO when firing chosen ranged weapon"',
  'Practiced Tactician':
    'Section=combat Note="May give allies a teamwork feat +1/dy"',
  'Precise Strike':
    'Section=combat Note="+1d6 damage when flanking ally has same feat"',
  'Preferred Spell':
    'Section=magic Note="May cast %V chosen spells in place of prepared spell"',
  'Punishing Kick':
    'Section=combat ' +
    'Note="Successful kick attack pushes foe %V\' or knocks prone (DC %{10+level//2+wisdomModifier} neg) %{level//5>?1}/dy"',
  'Pushing Assault':
    'Section=combat ' +
    'Note="May trade Power Attack damage bonus for 5\' push (10\' if critical hit)"',
  'Racial Heritage':
    'Section=feature ' +
    'Note="Count as both human and chosen race for racial effects"',
  'Raging Vitality':
    'Section=combat Note="+2 Con during rage; rage continues if unconscious"',
  'Ray Shield':'Section=combat Note="No damage from ranged touch hit 1/rd"',
  'Razortusk':'Section=combat Note="Bite inflicts 1d4 HP damage"',
  'Reach Spell':
    'Section=magic ' +
    'Note="Cast spell at longer rage uses +1 spell slot/range increase"',
  'Rending Claws':
    'Section=combat ' +
    'Note="Second claw hit in 1 rd inflicts +1d6 HP damage 1/rd"',
  'Repositioning Strike':
    'Section=combat Note="May move foe w/critical hit that exceeds foe CMD"',
  'Saving Shield':
    'Section=combat Note="May use shield to give adjacent ally +2 AC"',
  'Second Chance':
    'Section=combat ' +
    'Note="May forego additional attacks to reroll miss on first"',
  'Selective Spell':
    'Section=magic ' +
    'Note="May protect from damage ability modifier targets in spell effect area"',
  'Shadow Strike':
    'Section=combat ' +
    'Note="May inflict precision damage on targets w/partial concealment"',
  'Shared Insight':
    'Section=combat ' +
    'Note="$30\' May forego move to give allies +2 Perception for %{wisdomModifier} rd"',
  'Sharp Senses':'Section=skill Note="+2 Perception"',
  'Shield Of Swings':
    'Section=combat ' +
    'Note="May reduce two-handed weapon damage by half for +4 AC and CMD"',
  'Shield Specialization (Buckler)':
    'Section=combat Note="+2 AC vs. critical hit/+%V CMD"',
  'Shield Specialization (Heavy)':
    'Section=combat Note="+2 AC vs. critical hit/+%V CMD"',
  'Shield Specialization (Light)':
    'Section=combat Note="+2 AC vs. critical hit/+%V CMD"',
  'Shield Specialization (Tower)':
    'Section=combat Note="+2 AC vs. critical hit/+%V CMD"',
  'Shield Wall':
    'Section=combat ' +
    'Note="+1 AC when adjacent ally has same feat and buckler or light shield; +2 heavy or tower shield"',
  'Shielded Caster':
    'Section=magic ' +
    'Note="+4 concentration when adjacent ally has same feat, +5 with ally buckler or light shield, +6 with ally heavy or tower shield"',
  'Sickening Spell':
    'Section=magic ' +
    'Note="Cast spell to inflict sickness for spell level rd instead of damage (spell save or Fort neg) uses +2 spell slot"',
  'Sidestep':
    'Section=combat ' +
    'Note="May move 5\' w/in threatened area after foe miss w/out AOO"',
  'Smash':
    'Section=ability,combat ' +
    'Note=' +
      '"+5 Strength (force door)",' +
      '"Ignore 5 points of attack target hardness"',
  'Smell Fear':
    'Section=skill ' +
    'Note="+4 Perception (smell shaken, frightened, and panicked creatures)"',
  'Sociable':
    'Section=skill ' +
    'Note="R30\' +2 ally Diplomacy for %{charismaModifier>?1} rd"',
  'Spell Perfection':
    'Section=magic ' +
    'Note="May use Metamagic feat for chosen spell w/out cost; gains dbl feat bonuses on spell"',
  'Spider Step':
    'Section=ability ' +
    'Note="May move half Slow Fall distance (50\' max) across walls, ceiling, and unsupportive surfaces"',
  'Stabbing Shot':
    'Section=combat Note="May replace first full-attack bow shot w/5\' push"',
  'Steel Soul':'Section=save Note="+2 vs. spells"',
  'Step Up and Strike':'Section=combat Note="May make AOO after Step Up"',
  'Stone Sense':
    'Section=feature ' +
    'Note="10\' May sense location of creatures in contact with ground"',
  'Stone Singer':
    'Section=feature ' +
    'Note="Dbl range or area of effect of Bardic Performance underground/+2 Bardic Performance DC vs. earth creatures"',
  'Stone-Faced':
    'Section=skill ' +
    'Note="+4 Bluff (conceal feelings or motives), foe suffers +5 Sense Motive DC"',
  'Stunning Assault':
    'Section=combat ' +
    'Note="May trade -5 attack for 1 rd stun (DC %{10+baseAttack} neg)"',
  "Summoner's Call":
    'Section=companion ' +
    'Note="Summoned eidolon gains chose of +2 Strength, Dexterity, or Constitution for 10 min"',
  'Sundering Strike':
    'Section=combat ' +
    'Note="May inflict sundering damage to weapon w/critical hit that exceeds foe CMD"',
  'Swap Places':
    'Section=combat ' +
    'Note="May swap places w/adjacent ally has same feat; ally suffers no AOO"',
  'Swift Aid':
    'Section=combat ' +
    'Note="Swift Aid Another action gives ally +1 AC or +1 next attack"',
  'Taunt':'Section=skill Note="May use Bluff to demoralize foes"',
  'Team Up':
    'Section=combat ' +
    'Note="May use Aid Another as a move action when self and 2 allies threaten same foe"',
  'Teleport Tactician':
    'Section=combat ' +
    'Note="Foe teleporting to/from threatened square provokes AOO"',
  'Tenacious Transmutation':
    'Section=magic ' +
    'Note="+2 DC to dispel self transmutation; effects linger 1 rd after dispel"',
  'Thundering Spell':
    'Section=magic ' +
    'Note="Cast spell to inflict deafness for spell level rd instead of damage (spell save or Fort neg) uses +2 spell slot"',
  'Touch Of Serenity':
    'Section=combat ' +
    'Note="May trade damage on attack for preventing spellcasting for %V rd (DC %{10+level//2+wisdomModifier} Will neg)"',
  'Trick Riding':
    'Section=skill ' +
    'Note="DC 15 or lower ride checks automatically succeed, no penalty for bareback riding, may use Mounted Combat to negate 2 hits/rd"',
  'Tripping Strike':
    'Section=combat ' +
    'Note="May inflict trip w/critical hit that exceeds foe CMD"',
  'Under and Over':
    'Section=combat ' +
    'Note="May make immediate +2 trip attack after larger foe grapple fails"',
  'Underfoot':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 AC (AOO from moving through larger foe threat area)",' +
      '"+4 Acrobatics (move past larger foes w/out AOO)"',
  'Vermin Heart':
    'Section=magic,skill ' +
    'Note=' +
      '"May target vermin with animal spells",' +
      '"May use Wild Empathy w/vermin"',
  'War Singer':
    'Section=feature ' +
    'Note="Dbl range or area of effect of Bardic Performance on battlefield/+2 Bardic Performance DC vs. orcs"',
  'Well-Prepared':
    'Section=skill ' +
    'Note="May use Sleight Of Hand (DC 10 + GP cost) to produce required mundane item 1/dy"'
};
PFAPG.LANGUAGES = {
};
PFAPG.PATHS = {

  // Barbarian
  'Breaker':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '1:Destructive,"3:Battle Scavenger"',
  'Brutal Pugilist':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"2:Savage Grapple","3:Pit Fighter","5:Improved Savage Grapple"',
  'Drunken Brute':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"1:Raging Drunk"',
  'Elemental Kin':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Elemental Fury"',
  'Hurler':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"1:Skilled Thrower"',
  'Invulnerable Rager':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '2:Invulnerability,"3:Extreme Endurance"',
  'Mounted Fury':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"1:Fast Rider","5:Bestial Mount"',
  'Savage Barbarian':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Naked Courage","7:Natural Toughness"',
  'Superstitious':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Sixth Sense","7:Keen Senses (Barbarian)"',
  'Totem Warrior':
    'Group=Barbarian ' +
    'Level=levels.Barbarian',

  // Bard
  'Arcane Duelist':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"1:Arcane Strike","1:Rallying Cry",6:Bladethirst,' +
      '"18:Mass Bladethirst","2:Combat Casting",6:Disruptive,10:Spellbreaker,' +
      '"14:Penetrating Strike","18:Greater Penetrating Strike",' +
      '"5:Arcane Bond","10:Arcane Armor"',
  'Archivist':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '1:Naturalist,"6:Lamentable Belaborment","18:Pedantic Lecture",' +
      '"2:Lore Master","2:Magic Lore","5:Jack-Of-All-Trades",' +
      '"10:Probable Path"',
  'Court Bard':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '1:Satire,3:Mockery,"8:Glorious Epic",14:Scandal,' +
      '"1:Heraldic Expertise","5:Wide Audience"',
  'Detective':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"1:Careful Teamwork","9:True Confession","15:Show Yourselves",' +
      '"1:Eye For Detail","2:Arcane Insight","1:Arcane Investigation"',
  'Magician':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '1:Dweomercraft,"8:Spell Suppression",' +
      '"14:Metamagic Mastery (Magician)","1:Magical Talent (Magician)",' +
      '"1:Improved Counterspell","2:Extended Performance",' +
      '"2:Expanded Repertoire","5:Arcane Bond","10:Wand Mastery"',
  'Sandman':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '1:Stealspell,"6:Slumber Song","9:Dramatic Subtext",' +
      '"15:Greater Stealspell","18:Mass Slumber Song","20:Spell Catching",' +
      '"1:Master Of Deception",2:Sneakspell,"3:Trap Sense","5:Sneak Attack"',
  'Savage Skald':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"1:Inspiring Blow","6:Incite Rage","10:Song Of The Fallen",' +
      '12:Berserkergang,"18:Battle Song"',
  'Sea Singer':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"1:Sea Shanty","3:Still Water","6:Whistle The Wind",' +
      '"18:Call The Storm","1:World Traveler (Sea Singer)",2:Familiar,' +
      '"2:Sea Legs"',
  'Street Performer':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"1:Disappearing Act","3:Harmless Performer","9:Madcap Prank",' +
      '"15:Slip Through The Crowd",1:Gladhanding,1:Streetwise,' +
      '"5:Quick Change"',

  // Cleric
  'Agathion Subdomain':
    Pathfinder.PATHS['Good Domain'].replace('Holy Lance', 'Protective Aura'),
  'Ancestors Subdomain':
    Pathfinder.PATHS['Repose Domain'].replace('Ward Against Death', 'Speak With Dead'),
  'Arcana Subdomain':
    Pathfinder.PATHS['Magic Domain'].replace('Hand Of The Acolyte', 'Arcane Beacon'),
  'Archon Good Subdomain':
    Pathfinder.PATHS['Good Domain'].replace('Holy Lance', 'Aura Of Menace'),
  'Archon Law Subdomain':
    Pathfinder.PATHS['Law Domain'].replace('Staff Of Order', 'Aura Of Menace'),
  'Ash Subdomain':
    Pathfinder.PATHS['Fire Domain'].replace('Fire Resistance', 'Wall Of Ashes'),
  'Azata Chaos Subdomain':
    Pathfinder.PATHS['Chaos Domain'].replace('Touch Of Chaos', "Elysium's Call"),
  'Azata Good Subdomain':
    Pathfinder.PATHS['Good Domain'].replace('Touch Of Good', "Elysium's Call"),
  'Blood Subdomain':
    Pathfinder.PATHS['War Domain'].replace('Weapon Master', 'Wounding Blade'),
  'Catastrophe Subdomain':
    Pathfinder.PATHS['Destruction Domain'].replace('Destructive Aura', 'Deadly Weather'),
  'Caves Subdomain':
    Pathfinder.PATHS['Earth Domain'].replace('Acid Resistance', 'Tunnel Runner'),
  'Cloud Subdomain':
    Pathfinder.PATHS['Air Domain'].replace('Electricity Resistance', 'Thundercloud'),
  'Construct Subdomain':
    Pathfinder.PATHS['Artifice Domain'].replace('Dancing Weapons', 'Animate Servant'),
  'Curse Subdomain':
    Pathfinder.PATHS['Luck Domain'].replace('Bit Of Luck', 'Malign Eye'),
  'Daemon Subdomain':
    Pathfinder.PATHS['Evil Domain'].replace('Scythe Of Evil', 'Whispering Evil'),
  'Day Subdomain':
    Pathfinder.PATHS['Sun Domain'].replace('Nimbus Of Light', "Day's Resurgence"),
  'Decay Subdomain':
    Pathfinder.PATHS['Plant Domain'].replace('Bramble Armor', 'Aura Of Decay'),
  'Deception Subdomain':
    Pathfinder.PATHS['Trickery Domain'].replace('Copycat', 'Sudden Shift'),
  'Defense Subdomain':
    Pathfinder.PATHS['Protection Domain'].replace('Resistant Touch', 'Deflection Aura'),
  'Demon Chaos Subdomain':
    Pathfinder.PATHS['Chaos Domain'].replace('Touch Of Chaos', 'Fury Of The Abyss'),
  'Demon Evil Subdomain':
    Pathfinder.PATHS['Evil Domain'].replace('Touch Of Evil', 'Fury Of The Abyss'),
  'Devil Evil Subdomain':
    Pathfinder.PATHS['Evil Domain'].replace('Touch Of Evil', "Hell's Corruption"),
  'Devil Law Subdomain':
    Pathfinder.PATHS['Law Domain'].replace('Touch Of Law', "Hell's Corruption"),
  'Divine Subdomain':
    Pathfinder.PATHS['Magic Domain'].replace('Hand Of The Acolyte', 'Divine Vessel'),
  'Exploration Subdomain':
    Pathfinder.PATHS['Travel Domain'].replace('Agile Feet', 'Door Sight'),
  'Family Subdomain':
    Pathfinder.PATHS['Community Domain'].replace('Calming Touch', 'Binding Ties'),
  'Fate Subdomain':
    Pathfinder.PATHS['Luck Domain'].replace('Good Fortune', 'Tugging Strands'),
  'Feather Subdomain':
    Pathfinder.PATHS['Animal Domain'].replace('Speak With Animals', 'Eyes Of The Hawk'),
  'Ferocity Subdomain':
    Pathfinder.PATHS['Strength Domain'].replace('Strength Surge Touch', 'Ferocious Strike'),
  'Freedom Subdomain':
    Pathfinder.PATHS['Liberation Domain'].replace('Liberation', "Liberty's Blessing"),
  'Fur Subdomain':
    Pathfinder.PATHS['Animal Domain'].replace('Speak With Animals', "Predator's Grace"),
  'Growth Subdomain':
    Pathfinder.PATHS['Plant Domain'].replace('Wooden Fist', 'Enlarge'),
  'Heroism Subdomain':
    Pathfinder.PATHS['Glory Domain'].replace('Divine Presence', 'Aura Of Heroism'),
  'Home Subdomain':
    Pathfinder.PATHS['Community Domain'].replace('Unity', 'Guarded Hearth'),
  'Honor Subdomain':
    Pathfinder.PATHS['Glory Domain'].replace('Touch Of Glory', 'Honor Bound'),
  'Ice Subdomain':
    Pathfinder.PATHS['Water Domain'].replace('Cold Resistance', 'Body Of Ice'),
  'Inevitable Subdomain':
    Pathfinder.PATHS['Law Domain'].replace('Touch Of Law', 'Command'),
  'Insanity Subdomain':
    Pathfinder.PATHS['Madness Domain'].replace('Vision Of Madness', 'Insane Focus'),
  'Language Subdomain':
    Pathfinder.PATHS['Rune Domain'].replace('Spell Rune', 'Rune Shift'),
  'Leadership Subdomain':
    Pathfinder.PATHS['Nobility Domain'].replace('Inspiring Word', 'Inspiring Command'),
  'Light Subdomain':
    Pathfinder.PATHS['Sun Domain'].replace("Sun's Blessing", 'Blinding Flash'),
  'Loss Subdomain':
    Pathfinder.PATHS['Darkness Domain'].replace('Eyes Of Darkness', 'Aura Of Forgetfulness'),
  'Love Subdomain':
    Pathfinder.PATHS['Charm Domain'].replace('Dazing Touch', 'Adoration'),
  'Lust Subdomain':
    Pathfinder.PATHS['Charm Domain'].replace('Charming Smile', 'Anything To Please'),
  'Martyr Subdomain':
    Pathfinder.PATHS['Nobility Domain'].replace('Noble Leadership', 'Sacrificial Bond'),
  'Memory Subdomain':
    Pathfinder.PATHS['Knowledge Domain'].replace('Lore Keeper', 'Recall'),
  'Metal Subdomain':
    Pathfinder.PATHS['Earth Domain'].replace('Acid Dart', 'Metal Fist'),
  'Murder Subdomain':
    Pathfinder.PATHS['Death Domain'].replace("Death's Embrace", 'Killing Blow'),
  'Night Subdomain':
    Pathfinder.PATHS['Darkness Domain'].replace('Touch Of Darkness', 'Night Hunter'),
  'Nightmare Subdomain':
    Pathfinder.PATHS['Madness Domain'].replace('Vision Of Madness', 'Fearful Touch'),
  'Oceans Subdomain':
    Pathfinder.PATHS['Water Domain'].replace('Icicle', 'Surge'),
  'Proteus Subdomain':
    Pathfinder.PATHS['Chaos Domain'].replace('Chaos Blade', 'Aura Of Chaos'),
  'Purity Subdomain':
    Pathfinder.PATHS['Protection Domain'].replace('Aura Of Protection', 'Purifying Touch'),
  'Rage Subdomain':
    Pathfinder.PATHS['Destruction Domain'].replace('Destructive Aura', 'Rage (Cleric)'),
  'Resolve Subdomain':
    Pathfinder.PATHS['Strength Domain'].replace('Might Of The Gods', 'Bestow Resolve'),
  'Restoration Subdomain':
    Pathfinder.PATHS['Healing Domain'].replace('Rebuke Death', 'Restorative Touch'),
  'Resurrection Subdomain':
    Pathfinder.PATHS['Healing Domain'].replace("Healer's Blessing", 'Gift Of Life'),
  'Revolution Subdomain':
    Pathfinder.PATHS['Liberation Domain'].replace("Freedom's Call", 'Powerful Persuader'),
  'Seasons Subdomain':
    Pathfinder.PATHS['Weather Domain'].replace('Storm Burst', 'Untouched By The Seasons'),
  'Smoke Subdomain':
    Pathfinder.PATHS['Fire Domain'].replace('Fire Bolt', 'Cloud Of Smoke'),
  'Souls Subdomain':
    Pathfinder.PATHS['Repose Domain'].replace('Gentle Rest', 'Touch The Spirit World'),
  'Storms Subdomain':
    Pathfinder.PATHS['Weather Domain'].replace('Lightning Lord', 'Gale Aura'),
  'Tactics Subdomain':
    Pathfinder.PATHS['War Domain'].replace('Battle Rage', 'Seize The Initiative'),
  'Thievery Subdomain':
    Pathfinder.PATHS['Trickery Domain'].replace("Master's Illusion", 'Thief Of The Gods'),
  'Thought Subdomain':
    Pathfinder.PATHS['Knowledge Domain'].replace('Remote Viewing', 'Read Minds'),
  'Toil Subdomain':
    Pathfinder.PATHS['Artifice Domain'].replace('Dancing Weapons', 'Aura Of Repetition'),
  'Trade Subdomain':
    Pathfinder.PATHS['Travel Domain'].replace('Agile Feet', 'Silver-Tongued Haggler'),
  'Undeath Subdomain':
    Pathfinder.PATHS['Death Domain'].replace('Bleeding Touch', "Death's Kiss"),
  'Wards Subdomain':
    Pathfinder.PATHS['Rune Domain'].replace('Spell Rune', 'Warding Rune'),
  'Winds Subdomain':
    Pathfinder.PATHS['Air Domain'].replace('Lightning Arc', 'Wind Blast'),

  // Druid
  'Aquatic Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Aquatic Adaptation","3:Natural Swimmer","4:Resist Ocean\'s Fury",' +
      '"9:Seaborn","13:Deep Diver"',
  'Arctic Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Arctic Native","3:Icewalking","4:Arctic Endurance","9:Snowcaster",' +
      '"13:Flurry Form"',
  'Blight Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"1:Vermin Empathy","5:Miasma","9:Blightblooded","13:Plaguebearer"',
  'Cave Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"1:Cavesense","2:Tunnelrunner","3:Lightfoot",' +
      '"4:Resist Subterranean Corruption"',
  'Desert Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Desert Native","3:Sandwalker","4:Desert Endurance",' +
      '"9:Shaded Vision","13:Dunemeld"',
  'Jungle Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Jungle Guardian","3:Woodland Stride","4:Torrid Endurance",' +
      '"13:Verdant Sentinel"',
  'Mountain Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Mountaineer","3:Sure-Footed (Druid)","4:Spire Walker",' +
      '"9:Mountain Stance","13:Mountain Stone"',
  'Plains Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Plains Traveler","3:Run Like The Wind","4:Savanna Ambush",' +
      '"9:Canny Charger","13:Evasion"',
  'Swamp Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"2:Marshwight","3:Swamp Strider","4:Pond Scum","13:Slippery"',
  'Urban Druid':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"1:Spontaneous Casting","2:Lorekeeper","4:Resist Temptation",' +
      '"6:A Thousand Faces","9:Mental Strength" ' +
    'Selectables=' +
      '"1:Charm Domain:Nature Bond",' +
      '"1:Community Domain:Nature Bond",' +
      '"1:Knowledge Domain:Nature Bond",' +
      '"1:Nobility Domain:Nature Bond",' +
      '"1:Protection Domain:Nature Bond",' +
      '"1:Repose Domain:Nature Bond",' +
      '"1:Rune Domain:Nature Bond"',
      // TODO Weather Domain -- overlaps w/other druids
  'Animal Shaman':
    'Group="Druid" ' +
    'Level=levels.Druid ' +
    'Features=' +
      '"features.Bear Totem ? 2:Totem Transformation (Bear)",' +
      '"features.Eagle Totem ? 2:Totem Transformation (Eagle)",' +
      '"features.Lion Totem ? 2:Totem Transformation (Lion)",' +
      '"features.Serpent Totem ? 2:Totem Transformation (Serpent)",' +
      '"features.Wolf Totem ? 2:Totem Transformation (Wolf)",' +
      '"5:Totemic Summons","9:Animal Shaman Feat Bonus" ' +
    'Selectables=' +
      '"1:Bear Totem:Totem",' +
      '"1:Eagle Totem:Totem",' +
      '"1:Lion Totem:Totem",' +
      '"1:Serpent Totem:Totem",' +
      '"1:Wolf Totem:Totem"',

  // Fighter
  'Archer':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '2:Hawkeye,"3:Trick Shot (Archer)","5:Expert Archer","9:Safe Shot",' +
      '"13:Evasive Archer",17:Volley,"19:Ranged Defense"',
  'Crossbowman':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '3:Deadshot,"5:Crossbow Expert","7:Improved Deadshot","9:Quick Sniper",' +
      '"11:Greater Deadshot","13:Safe Shot","15:Pinpoint Targeting",' +
      '"17:Meteor Shot","19:Penetrating Shot"',
  'Free Hand Fighter':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"2:Deceptive Strike",3:Elusive,5:Singleton,"9:Timely Tip",' +
      '13:Interference,19:Reversal',
  'Mobile Fighter':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '2:Agility,"5:Leaping Attack","11:Rapid Attack","15:Fleet Footed",' +
      '"20:Whirlwind Blitz"',
  'Phalanx Soldier':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"2:Stand Firm","3:Phalanx Fighting","5:Ready Pike","7:Deft Shield",' +
      '"9:Shield Ally","15:Irresistible Advance","20:Shielded Fortress"',
  'Polearm Master':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"2:Pole Fighting","3:Steadfast Pike","5:Polearm Training",' +
      '"9:Flexible Flanker","13:Sweeping Fend","17:Step Aside",' +
      '"19:Polearm Parry"',
  'Roughrider':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"2:Steadfast Mount","3:Armored Charger","5:Mounted Mettle",' +
      '"7:Leap From The Saddle","11:Relentless Steed","15:Ride Them Down",' +
      '"15:Unavoidable Onslaught","19:Indomitable Steed"',
  'Savage Warrior':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"2:Spark Of Life","5:Natural Savagery","9:Savage Charge",' +
      '"13:Careful Claw","17:Greater Savage Charge",' +
      '"20:Natural Weapon Mastery"',
  'Shielded Fighter':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Active Defense","5:Shield Fighter","9:Shield Buffet",' +
      '"17:Shield Guard","19:Shield Mastery","20:Shield Ward"',
  'Two-Handed Fighter':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"2:Shattering Strike","3:Overhand Chop",7:Backswing,11:Piledriver,' +
      '"15:Greater Power Attack","19:Devastating Blow"',
  'Two-Weapon Warrior':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"3:Defensive Flurry","5:Twin Blades",9:Doublestrike,' +
      '"11:Improved Balance","13:Equal Opportunity","15:Perfect Balance",' +
      '"17:Deft Doublestrike","19:Deadly Defense"',
  'Weapon Master':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '"2:Weapon Guard","3:Weapon Training (Weapon Master)",' +
      '"5:Reliable Strike","9:Mirror Move","13:Deadly Critical",' +
      '"17:Critical Specialist","19:Unstoppable Strike"',

  // Monk
  'Drunken Master':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"3:Drunken Ki","5:Drunken Strength","11:Drunken Courage",' +
      '"13:Drunken Resilience","19:Firewater Breath"',
  'Hungry Ghost Monk':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"1:Punishing Kick","5:Steal Ki","7:Life Funnel",' +
      '"11:Life From A Stone","13:Sipping Demon"',
  'Ki Mystic':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"3:Ki Pool","3:Ki Pool (Ki Mystic)","5:Mystic Insight",' +
      '"11:Mystic Visions","13:Mystic Prescience","19:Mystic Persistence"',
  'Monk Of The Empty Hand':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"1:Weapon Proficiency (Shuriken)","1:Flurry Of Blows",' +
      '"3:Versatile Improvisation","4:Ki Pool (Monk Of The Empty Hand)",' +
      '"5:Ki Weapons"',
      // TODO Additional choices for bonus feats
  'Monk Of The Four Winds':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"1:Elemental Fist","12:Slow Time","17:Aspect Master","20:Immortality" ' +
    'Selectables=' +
      '"alignment !~ \'Evil\' ? 17:Aspect Of The Carp:Aspect",' +
      '"alignment == \'Lawful Good\' ? 17:Aspect Of The Ki-Rin:Aspect",' +
      '"17:Aspect Of The Monkey:Aspect",' +
      '"alignment =~ \'Evil\' ? 17:Aspect Of The Oni:Aspect",' +
      '"17:Aspect Of The Owl:Aspect",' +
      '"17:Aspect Of The Tiger:Aspect"',
  'Monk Of The Healing Hand':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"7:Ancient Healing Hand","11:Ki Sacrifice","20:True Sacrifice"',
  'Monk Of The Lotus':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"1:Touch Of Serenity","12:Touch Of Surrender","15:Touch Of Peace",' +
      '"17:Learned Master"',
  'Monk Of The Sacred Mountain':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"2:Iron Monk","4:Bastion Stance","5:Iron Limb Defense",' +
      '"9:Adamantine Monk","17:Vow Of Silence"',
  'Weapon Adept':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"1:Perfect Strike","2:Way Of The Weapon Master","9:Evasion",' +
      '"17:Uncanny Initiative","20:Pure Power"',
  'Zen Archer':
    'Group=Monk ' +
    'Level=levels.Monk ' +
    'Features=' +
      '"1:Weapon Proficiency(Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"1:Flurry Of Blows (Zen Archer)","1:Perfect Strike",' +
      '"2:Way Of The Bow","3:Zen Archery","3:Point Blank Master",' +
      '"4:Ki Pool (Zen Archer)","5:Ki Arrows","9:Reflexive Shot",' +
      '"11:Trick Shot (Zen Archer)","17:Ki Focus Bow"',
      // TODO Different choices for bonus feats

  // Paladin
  'Divine Defender':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"3:Shared Defense"',
  'Hospitaler':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"11:Aura Of Healing"',
  'Sacred Servant':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"4:Domain (Paladin)","8:Call Celestial Ally" ' +
    'Selectables=' +
      QuilvynUtils.getKeys(Pathfinder.PATHS).filter(x => x.match(/Domain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Domain', '') + '\' ? 4:' + x + ':Domain"').join(',') + ' ' +
    'SpellSlots=' +
      'Domain1:4=0;5=1,' +
      'Domain2:7=0;8=1,' +
      'Domain3:10=0;11=1,' +
      'Domain4:13=0;14=1',
  'Shining Knight':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"3:Skilled Rider","11:Knight\'s Charge"',
  'Undead Scourge':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"8:Aura Of Life","11:Undead Annihilation"',
  'Warrior Of The Holy Light':
    'Group=Paladin ' +
    'Level=levels.Paladin ' +
    'Features=' +
      '"4:Power Of Faith","14:Shining Light"',

  // Ranger
  'Beast Master':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    // Difference in class skills handled by classRulesExtra
    'Features=' +
      '"4:Animal Companion","6:Improved Empathic Link","12:Strong Bond"',
  'Guide':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"1:Ranger\'s Focus","4:Terrain Bond","9:Ranger\'s Luck",' +
      '"11:Inspired Moment","16:Improved Ranger\'s Luck"',
  'Horse Lord':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"4:Animal Companion","4:Mounted Bond","12:Strong Bond",' +
      '"17:Spiritual Bond"',
  'Infiltrator':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"3:Adaptation"',
  'Shapeshifter':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"3:Shifter\'s Blessing","12:Dual Form Shifter","20:Master Shifter"',
  'Skirmisher':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"5:Hunter\'s Tricks"',
  'Spirit Ranger':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"4:Spirit Bond","12:Wisdom Of The Spirits"',
  'Urban Ranger':
    'Group=Ranger ' +
    'Level=levels.Ranger ' +
    'Features=' +
      '"3:Favored Community","3:Trapfinding","7:Push Through","12:Blend In",' +
      '"17:Invisibility Trick"',

  // Rogue
  'Acrobat':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Expert Acrobat","3:Second Chance (Rogue)"',
  'Burglar':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"4:Careful Disarm","8:Distraction (Rogue)"',
  'Cutpurse':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Measure The Mark","3:Stab And Grab"',
  'Investigator':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Follow Up"',
  'Poisoner':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Poison Use","3:Master Poisoner"',
  'Rake':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"Bravado\'s Blade","3:Rake\'s Smile"',
  'Scout':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"4:Scout\'s Charge","8:Skirmisher (Rogue)"',
  'Sniper':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Accuracy","3:Deadly Range"',
  'Spy':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Skilled Liar","3:Poison Use"',
  'Swashbuckler':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Martial Training","3:Daring"',
  'Thug':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"1:Frightening","3:Brutal Beating"',
  'Trapsmith':
    'Group=Rogue ' +
    'Level=levels.Rogue ' +
    'Features=' +
      '"4:Careful Disarm","8:Trap Master"',

  // Sorcerer
  'Bloodline Aquatic':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Dehydrating Touch","3:Aquatic Adaptation (Sorcerer)",' +
      '"9:Aquatic Telepathy","15:Raise The Deep","20:Deep One" ' +
    'Feats=' +
      'Athletic,"Brew Potion","Defensive Combat Training",Dodge,Mobility,' +
      '"Silent Spell","Skill Focus (Swim)",Toughness ' +
    'Skills=Swim ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Aquatic1:3=1,' +
      'Aquatic2:5=1,' +
      'Aquatic3:7=1,' +
      'Aquatic4:9=1,' +
      'Aquatic5:11=1,' +
      'Aquatic6:13=1,' +
      'Aquatic7:15=1,' +
      'Aquatic8:17=1,' +
      'Aquatic9:19=1',
  'Bloodline Boreal':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Cold Steel",3:Icewalker,"9:Snow Shroud","15:Blizzard (Sorcerer)",' +
      '"20:Child Of Ancient Winters" ' +
    'Feats=' +
      // Also Exotic Weapon Proficiency (*), handled in classRulesExtra
      '"Arcane Strike",Diehard,"Empower Spell",Endurance,"Power Attack",' +
      '"Skill Focus (Intimidate)",Toughness ' +
    'Skills=Survival ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Boreal1:3=1,' +
      'Boreal2:5=1,' +
      'Boreal3:7=1,' +
      'Boreal4:9=1,' +
      'Boreal5:11=1,' +
      'Boreal6:13=1,' +
      'Boreal7:15=1,' +
      'Boreal8:17=1,' +
      'Boreal9:19=1',
  'Bloodline Deep Earth':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Tremor,3:Rockseer,"9:Crystal Shard","15:Earth Glide",' +
      '"20:Strength Of Stone" ' +
    'Feats=' +
      '"Acrobatic Steps",Alertness,Blind-Fight,"Forge Ring","Nimble Moves",' +
      '"Skill Focus (Perception)",Stealthy,"Still Spell" ' +
    'Skills="Knowledge (Dungeoneering)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      '"Deep1:3=1",' +
      '"Deep2:5=1",' +
      '"Deep3:7=1",' +
      '"Deep4:9=1",' +
      '"Deep5:11=1",' +
      '"Deep6:13=1",' +
      '"Deep7:15=1",' +
      '"Deep8:17=1",' +
      '"Deep9:19=1"',
  'Bloodline Dreamspun':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Lullaby,"3:Combat Precognition",9:Dreamshaper,"15:Eye Of Somnus",' +
      '20:Solipsism ' +
    'Feats=' +
      'Alertness,Blind-Fight,"Combat Expertise",Deceitful,"Heighten Spell",' +
      '"Improved Feint",Persuasive,"Skill Focus (Sense Motive)" ' +
    'Skills="Sense Motive" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Dreamspun1:3=1,' +
      'Dreamspun2:5=1,' +
      'Dreamspun3:7=1,' +
      'Dreamspun4:9=1,' +
      'Dreamspun5:11=1,' +
      'Dreamspun6:13=1,' +
      'Dreamspun7:15=1,' +
      'Dreamspun8:17=1,' +
      'Dreamspun9:19=1',
  'Bloodline Protean':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Protoplasm,"3:Protean Resistances","9:Reality Wrinkle",' +
      '"15:Spatial Tear","20:Avatar Of Chaos" ' +
    'Feats=' +
      // Also Skill Focus (Craft (*)), handled in classRulesExtra
      '"Agile Maneuvers","Defensive Combat Training","Enlarge Spell",' +
      '"Great Fortitude","Improved Great Fortitude",' +
      '"Spell Focus (Abjuration)","Spell Focus (Conjuration)",' +
      '"Spell Focus (Divination)","Spell Focus (Enchantment)",' +
      '"Spell Focus (Evocation)","Spell Focus (Illusion)",' +
      '"Spell Focus (Necromancy)","Spell Focus (Transmutation)",' +
      'Toughness ' +
    'Skills="Knowledge (Planes)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Protean1:3=1,' +
      'Protean2:5=1,' +
      'Protean3:7=1,' +
      'Protean4:9=1,' +
      'Protean5:11=1,' +
      'Protean6:13=1,' +
      'Protean7:15=1,' +
      'Protean8:17=1,' +
      'Protean9:19=1',
  'Bloodline Serpentine':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Serpent\'s Fang",3:Serpentfriend,9:Snakeskin,"15:Den Of Vipers",' +
      '"20:Scaled Soul" ' +
    'Feats=' +
      '"Combat Casting","Combat Reflexes",Deceitful,"Deft Hands",Persuasive,' +
      '"Silent Spell","Skill Focus (Bluff)",Stealthy ' +
    'Skills=Diplomacy ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Serpentine1:3=1,' +
      'Serpentine2:5=1,' +
      'Serpentine3:7=1,' +
      'Serpentine4:9=1,' +
      'Serpentine5:11=1,' +
      'Serpentine6:13=1,' +
      'Serpentine7:15=1,' +
      'Serpentine8:17=1,' +
      'Serpentine9:19=1',
  'Bloodline Shadow':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Shadowstrike,3:Nighteye,"9:Shadow Well","15:Enveloping Darkness",' +
      '"20:Shadow Master (Sorcerer)" ' +
    'Feats=' +
      'Acrobatic,Blind-Fight,Dodge,"Quick Draw","Silent Spell",' +
      '"Skill Focus (Stealth)",Stealthy,"Weapon Finesse" ' +
    'Skills=Stealth ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Shadow1:3=1,' +
      'Shadow2:5=1,' +
      'Shadow3:7=1,' +
      'Shadow4:9=1,' +
      'Shadow5:11=1,' +
      'Shadow6:13=1,' +
      'Shadow7:15=1,' +
      'Shadow8:17=1,' +
      'Shadow9:19=1',
  'Bloodline Starsoul':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '"1:Minute Meteors",3:Voidwalker,"9:Aurora Borealis",' +
      '"15:Breaching The Gulf",20:Starborn ' +
    'Feats=' +
      'Blind-Fight,"Craft Rod",Dodge,Endurance,"Improved Counterspell",' +
      '"Improved Iron Will","Iron Will","Quicken Spell",' +
      '"Skill Focus (Perception)",Toughness ' +
    'Skills="Knowledge (Nature)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Starsoul1:3=1,' +
      'Starsoul2:5=1,' +
      'Starsoul3:7=1,' +
      'Starsoul4:9=1,' +
      'Starsoul5:11=1,' +
      'Starsoul6:13=1,' +
      'Starsoul7:15=1,' +
      'Starsoul8:17=1,' +
      'Starsoul9:19=1',
  'Bloodline Stormborn':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Thunderstaff,3:Stormchild,9:Thunderbolt,"15:Ride The Lightning",' +
      '"20:Storm Lord" ' +
    'Feats=' +
      '"Deadly Aim",Dodge,"Enlarge Spell","Far Shot","Great Fortitude",' +
      '"Point-Blank Shot","Skill Focus (Fly)","Wind Stance" ' +
    'Skills="Knowledge (Nature)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Stormborn1:3=1,' +
      'Stormborn2:5=1,' +
      'Stormborn3:7=1,' +
      'Stormborn4:9=1,' +
      'Stormborn5:11=1,' +
      'Stormborn6:13=1,' +
      'Stormborn7:15=1,' +
      'Stormborn8:17=1,' +
      'Stormborn9:19=1',
  'Bloodline Verdant':
    'Group=Sorcerer ' +
    'Level=levels.Sorcerer ' +
    'Features=' +
      '1:Tanglevine,3:Photosynthesis,9:Massmorph,15:Rooting,' +
      '"20:Shepherd Of The Trees" ' +
    'Feats=' +
      '"Acrobatic Steps","Craft Staff",Endurance,"Extend Spell",Fleet,' +
      '"Nimble Moves","Skill Focus (Knowledge (Nature))",Toughness ' +
    'Skills="Knowledge (Nature)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Verdant1:3=1,' +
      'Verdant2:5=1,' +
      'Verdant3:7=1,' +
      'Verdant4:9=1,' +
      'Verdant5:11=1,' +
      'Verdant6:13=1,' +
      'Verdant7:15=1,' +
      'Verdant8:17=1,' +
      'Verdant9:19=1',

  // Oracle
  'Battle Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Battle1:2=1,' +
      'Battle2:4=1,' +
      'Battle3:6=1,' +
      'Battle4:8=1,' +
      'Battle5:10=1,' +
      'Battle6:12=1,' +
      'Battle7:14=1,' +
      'Battle8:16=1,' +
      'Battle9:18=1 ' +
    'Features="20:Final Revelation (Battle Mystery)" ' +
    'Selectables=' +
      '"1:Battlecry:Battle Revelation",' +
      '"1:Battlefield Clarity:Battle Revelation",' +
      '"11:Iron Skin:Battle Revelation",' +
      '"1:Maneuver Mastery:Battle Revelation",' +
      '"1:Resiliency (Oracle):Battle Revelation",' +
      '"1:Skill At Arms:Battle Revelation",' +
      '"1:Surprising Charge:Battle Revelation",' +
      '"1:War Sight:Battle Revelation",' +
      '"1:Weapon Mastery:Battle Revelation"',
  'Bones Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Bones1:2=1,' +
      'Bones2:4=1,' +
      'Bones3:6=1,' +
      'Bones4:8=1,' +
      'Bones5:10=1,' +
      'Bones6:12=1,' +
      'Bones7:14=1,' +
      'Bones8:16=1,' +
      'Bones9:18=1 ' +
    'Features="20:Final Revelation (Bones Mystery)" ' +
    'Selectables=' +
      '"1:Armor Of Bones:Bones Revelation",' +
      '"1:Bleeding Wounds:Bones Revelation",' +
      '"1:Death\'s Touch:Bones Revelation",' +
      '"1:Near Death:Bones Revelation",' +
      '"1:Raise The Dead:Bones Revelation",' +
      '"1:Resist Life:Bones Revelation",' +
      '"7:Soul Siphon:Bones Revelation",' +
      '"11:Spirit Walk:Bones Revelation",' +
      '"1:Undead Servitude:Bones Revelation",' +
      '"1:Voice Of The Grave:Bones Revelation"',
  'Flame Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Flame1:2=1,' +
      'Flame2:4=1,' +
      'Flame3:6=1,' +
      'Flame4:8=1,' +
      'Flame5:10=1,' +
      'Flame6:12=1,' +
      'Flame7:14=1,' +
      'Flame8:16=1,' +
      'Flame9:18=1 ' +
    'Features="20:Final Revelation (Flame Mystery)" ' +
    'Selectables=' +
      '"1:Burning Magic:Flame Revelation",' +
      '"1:Cinder Dance:Flame Revelation",' +
      '"1:Fire Breath:Flame Revelation",' +
      '"11:Firestorm:Flame Revelation",' +
      '"7:Form Of Flame:Flame Revelation",' +
      '"1:Gaze Of Flames:Flame Revelation",' +
      '"1:Heat Aura:Flame Revelation",' +
      '"1:Molten Skin:Flame Revelation",' +
      '"1:Touch Of Flame:Flame Revelation",' +
      '"7:Wings Of Fire:Flame Revelation"',
  'Heavens Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Heavens1:2=1,' +
      'Heavens2:4=1,' +
      'Heavens3:6=1,' +
      'Heavens4:8=1,' +
      'Heavens5:10=1,' +
      'Heavens6:12=1,' +
      'Heavens7:14=1,' +
      'Heavens8:16=1,' +
      'Heavens9:18=1 ' +
    'Features="20:Final Revelation (Heavens Mystery)" ' +
    'Selectables=' +
      '"1:Awesome Display:Heavens Revelation",' +
      '"1:Coat Of Many Stars:Heavens Revelation",' +
      '"11:Dweller In Darkness:Heavens Revelation",' +
      '"1:Guiding Star:Heavens Revelation",' +
      '"1:Interstellar Void:Heavens Revelation",' +
      '"1:Lure Of The Heavens:Heavens Revelation",' +
      '"1:Mantle Of Moonlight:Heavens Revelation",' +
      '"1:Moonlight Bridge:Heavens Revelation",' +
      '"1:Spray Of Shooting Stars:Heavens Revelation",' +
      '"7:Star Chart:Heavens Revelation"',
  'Life Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Life1:2=1,' +
      'Life2:4=1,' +
      'Life3:6=1,' +
      'Life4:8=1,' +
      'Life5:10=1,' +
      'Life6:12=1,' +
      'Life7:14=1,' +
      'Life8:16=1,' +
      'Life9:18=1 ' +
    'Features="20:Final Revelation (Life Mystery)" ' +
    'Selectables=' +
      '"1:Channel:Life Revelation",' +
      '"1:Delay Affliction:Life Revelation",' +
      '"1:Energy Body:Life Revelation",' +
      '"1:Enhanced Cures:Life Revelation",' +
      '"1:Healing Hands:Life Revelation",' +
      '"1:Life Link:Life Revelation",' +
      '"11:Lifesense:Life Revelation",' +
      '"1:Safe Curing:Life Revelation",' +
      '"1:Spirit Boost:Life Revelation"',
  'Lore Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Lore1:2=1,' +
      'Lore2:4=1,' +
      'Lore3:6=1,' +
      'Lore4:8=1,' +
      'Lore5:10=1,' +
      'Lore6:12=1,' +
      'Lore7:14=1,' +
      'Lore8:16=1,' +
      'Lore9:18=1 ' +
    'Features="20:Final Revelation (Lore Mystery)" ' +
    'Selectables=' +
      '"11:Arcane Archivist (Oracle):Lore Revelation",' +
      '"1:Automatic Writing:Lore Revelation",' +
      '"1:Brain Drain:Lore Revelation",' +
      '"1:Focused Trance:Lore Revelation",' +
      '"1:Lore Keeper (Oracle):Lore Revelation",' +
      '"7:Mental Acuity:Lore Revelation",' +
      '"1:Sidestep Secret:Lore Revelation",' +
      '"11:Spontaneous Symbology:Lore Revelation",' +
      '"1:Think On It:Lore Revelation",' +
      '"1:Whirlwind Lesson:Lore Revelation"',
  'Nature Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Nature1:2=1,' +
      'Nature2:4=1,' +
      'Nature3:6=1,' +
      'Nature4:8=1,' +
      'Nature5:10=1,' +
      'Nature6:12=1,' +
      'Nature7:14=1,' +
      'Nature8:16=1,' +
      'Nature9:18=1 ' +
    'Features="20:Final Revelation (Nature Mystery)" ' +
    'Selectables=' +
      '"1:Bonded Mount:Nature Revelation",' +
      '"1:Erosion Touch:Nature Revelation",' +
      '"1:Friend To The Animals:Nature Revelation",' +
      '"7:Life Leach:Nature Revelation",' +
      '"1:Natural Divination:Nature Revelation",' +
      '"1:Nature\'s Whispers:Nature Revelation",' +
      '"1:Speak With Animals (Oracle):Nature Revelation",' +
      '"1:Spirit Of Nature:Nature Revelation",' +
      '"1:Transcendental Bond:Nature Revelation",' +
      '"1:Undo Artifice:Nature Revelation"',
  'Stone Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Stone1:2=1,' +
      'Stone2:4=1,' +
      'Stone3:6=1,' +
      'Stone4:8=1,' +
      'Stone5:10=1,' +
      'Stone6:12=1,' +
      'Stone7:14=1,' +
      'Stone8:16=1,' +
      'Stone9:18=1 ' +
    'Features="20:Final Revelation (Stone Mystery)" ' +
    'Selectables=' +
      '"1:Acid Skin:Stone Revelation",' +
      '"1:Clobbering Strike:Stone Revelation",' +
      '"1:Crystal Sight:Stone Revelation",' +
      '"7:Earth Glide (Oracle):Stone Revelation",' +
      '"1:Mighty Pebble:Stone Revelation",' +
      '"1:Rock Throwing:Stone Revelation",' +
      '"1:Shard Explosion:Stone Revelation",' +
      '"7:Steelbreaker Skin:Stone Revelation",' +
      '"1:Stone Stability:Stone Revelation",' +
      '"1:Touch Of Acid:Stone Revelation"',
  'Waves Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Waves1:2=1,' +
      'Waves2:4=1,' +
      'Waves3:6=1,' +
      'Waves4:8=1,' +
      'Waves5:10=1,' +
      'Waves6:12=1,' +
      'Waves7:14=1,' +
      'Waves8:16=1,' +
      'Waves9:18=1 ' +
    'Features="20:Final Revelation (Waves Mystery)" ' +
    'Selectables=' +
      '"1:Blizzard:Waves Revelation",' +
      '"1:Fluid Nature:Waves Revelation",' +
      '"1:Fluid Travel:Waves Revelation",' +
      '"1:Freezing Spells:Waves Revelation",' +
      '"1:Ice Armor:Waves Revelation",' +
      '"1:Icy Skin:Waves Revelation",' +
      '"7:Punitive Transformation:Waves Revelation",' +
      '"7:Water Form:Waves Revelation",' +
      '"1:Water Sight:Waves Revelation",' +
      '"1:Wintry Touch:Waves Revelation"',
  'Wind Mystery':
    'Group="Oracle" ' +
    'Level=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Wind1:2=1,' +
      'Wind2:4=1,' +
      'Wind3:6=1,' +
      'Wind4:8=1,' +
      'Wind5:10=1,' +
      'Wind6:12=1,' +
      'Wind7:14=1,' +
      'Wind8:16=1,' +
      'Wind9:18=1 ' +
    'Features="20:Final Revelation (Wind Mystery)" ' +
    'Selectables=' +
      '"1:Air Barrier:Wind Revelation",' +
      '"7:Gaseous Form:Wind Revelation",' +
      '"3:Invisibility:Wind Revelation",' +
      '"1:Lightning Breath:Wind Revelation",' +
      '"1:Spark Skin:Wind Revelation",' +
      '"7:Thunderburst:Wind Revelation",' +
      '"1:Touch Of Electricity:Wind Revelation",' +
      '"1:Vortex Spells:Wind Revelation",' +
      '"1:Wind Sight:Wind Revelation",' +
      '"7:Wings Of Air:Wind Revelation"'

};
PFAPG.RACES = {
  'Dwarf':
    'Selectables=' +
      '"1:Dwarf Hatred:Racial Trait",' +
        '"1:Ancient Enmity:Racial Trait",' +
      '"1:Greed:Racial Trait",' +
        '"1:Craftsman:Racial Trait",' +
        '"1:Lorekeeper (Dwarf):Racial Trait",' +
      '"1:Defensive Training:Racial Trait",' +
        '"1:Deep Warrior:Racial Trait",' +
      '"1:Hardy:Racial Trait",' +
        '"1:Magic Resistant:Racial Trait",' +
        '"1:Stubborn:Racial Trait",' +
      '"1:Stability:Racial Trait",' +
        '"1:Relentless:Racial Trait",' +
      '"1:Stonecunning:Racial Trait",' +
        '"1:Stonesinger:Racial Trait"',
  'Elf':
    'Selectables=' +
      // Lightbringer, Spirit Of The Waters each replace 2 core traits
      '"1:Weapon Familiarity (Elven Curve Blade):Racial Trait",' +
        '"1:Spirit Of The Waters:Racial Trait",' +
      '"1:Elven Immunities:Racial Trait",' +
        '"1:Dreamspeaker:Racial Trait",' +
        '"1:Lightbringer:Racial Trait",' +
      '"1:Elven Magic:Racial Trait",' +
        '"1:Desert Runner:Racial Trait",' +
        '"1:Eternal Grudge",' +
        '"1:Lightbringer:Racial Trait",' +
        '"1:Silent Hunter:Racial Trait",' +
        '"1:Spirit Of The Waters:Racial Trait",' +
        '"1:Woodcraft:Racial Trait"',
  'Gnome':
    'Selectables=' +
      // Eternal Hope, Gift Of Tongues, Magical Linguist, Master Tinker,
      // Pyromaniac, Warden Of Nature each replace 2 core traits
      '"1:Defensive Training:Racial Trait",' +
        '"1:Eternal Hope:Racial Trait",' +
        '"1:Gift Of Tongues:Racial Trait",' +
        '"1:Master Tinker:Racial Trait",' +
        '"1:Warden Of Nature:Racial Trait",' +
      '"1:Gnome Hatred:Racial Trait",' +
        '"1:Eternal Hope:Racial Trait",' +
        '"1:Gift Of Tongues:Racial Trait",' +
        '"1:Master Tinker:Racial Trait",' +
        '"1:Warden Of Nature:Racial Trait",' +
      '"1:Gnome Magic:Racial Trait",' +
        '"1:Magical Linguist:Racial Trait",' +
        '"1:Pyromaniac:Racial Trait",' +
      '"1:Obsessive:Racial Trait",' +
        '"1:Academician:Racial Trait",' +
      '"1:Resist Illusion:Racial Trait",' +
        '"1:Magical Linguist:Racial Trait",' +
        '"1:Pyromaniac:Racial Trait"',
  'Half-Elf':
    'Selectables=' +
      // Water Child replaces 2 core traits
      '"1:Adaptability:Racial Trait",' +
        '"1:Ancestral Arms:Racial Trait",' +
        '"1:Dual Minded:Racial Trait",' +
        '"1:Integrated:Racial Trait",' +
        '"1:Sociable (Half-Elf):Racial Trait",' +
        '"1:Water Child:Racial Trait",' +
      '"1:Multitalented:Racial Trait",' +
        '"1:Arcane Training:Racial Trait",' +
        '"1:Water Child:Racial Trait"',
  'Half-Orc':
    'Selectables=' +
      // Plagueborn replaces 2 core traits
      '"1:Weapon Familiarity (Orc Double Axe):Racial Trait",' +
        '"1:Chain Fighter:Racial Trait",' +
      '"1:Intimidating:Racial Trait",' +
        '"1:Cavewight:Racial Trait",' +
        '"1:Plagueborn:Racial Trait",' +
        '"1:Rock Climber:Racial Trait",' +
        '"1:Scavenger:Racial Trait",' +
      '"1:Orc Ferocity:Racial Trait",' +
        '"1:Beastmaster:Racial Trait",' +
        '"1:Bestial:Racial Trait",' +
        '"1:Gatecrasher:Racial Trait",' +
        '"1:Plagueborn:Racial Trait",' +
        '"1:Sacred Tattoo:Racial Trait",' +
        '"1:Toothy:Racial Trait"',
  'Halfling':
    'Selectables=' +
      // Craven, Practicality, Wanderlust each replace 2 core traits
      '"1:Fearless:Racial Trait",' +
        '"1:Craven:Racial Trait",' +
        '"1:Practicality:Racial Trait",' +
        '"1:Wanderlust:Racial Trait",' +
      '"1:Halfling Luck:Racial Trait",' +
        '"1:Craven:Racial Trait",' +
        '"1:Underfoot (Halfling):Racial Trait",' +
        '"1:Wanderlust:Racial Trait",' +
      '"1:Keen Senses:Racial Trait",' +
        '"1:Low Blow:Racial Trait",' +
      '"1:Sure-Footed:Racial Trait",' +
        '"1:Outrider:Racial Trait",' +
        '"1:Practicality:Racial Trait",' +
        '"1:Swift As Shadows:Racial Trait",' +
        '"1:Warslinger:Racial Trait"',
  'Human':
    'Selectables=' +
      '"1:Bonus Feat:Racial Trait",' +
        '"1:Eye For Talent:Racial Trait",' +
      '"1:Skilled:Racial Trait",' +
        '"1:Heart Of The Fields:Racial Trait",' +
        '"1:Heart Of The Streets:Racial Trait",' +
        '"1:Heart Of The Wilderness:Racial Trait"'
};
PFAPG.SCHOOLS = {
  'Air':
    'Features="1:Air Supremacy","1:Lightning Flash",8:Cyclone',
  'Earth':
    'Features="1:Earth Supremacy","1:Acid Cloud","8:Earth Glide"',
  'Fire':
    'Features="1:Fire Supremacy","1:Fire Jet","8:Dancing Flame"',
  'Water':
    'Features="1:Water Supremacy","1:Cold Blast",8:Wave',
  'Admixture':
    Pathfinder.SCHOOLS.Evocation
      .replace('Force Missile', 'Versatile Evocation')
      .replace('Elemental Wall', 'Elemental Manipulation'),
  'Banishment':
    Pathfinder.SCHOOLS.Abjuration
      .replace('Protective Ward', 'Unstable Bonds')
      .replace('6:Energy Absorption', '8:Aura Of Banishment'),
  'Controller':
    Pathfinder.SCHOOLS.Enchantment
      .replace('Enchanting Smile', 'Force Of Will')
      .replace('Aura Of Despair', 'Irresistible Demand'),
  'Counterspell':
    Pathfinder.SCHOOLS.Abjuration
      .replace('Protective Ward', 'Disruption')
      .replace('Energy Absorption', 'Counterspell Mastery'),
  'Creation':
    Pathfinder.SCHOOLS.Conjuration
      .replace('Acid Dart Conjuration', 'Create Gear')
      .replace('Dimensional Steps', "Creator's Will"),
  'Enhancement':
    Pathfinder.SCHOOLS.Transmutation
      .replace('Telekinetic Fist', 'Augment')
      .replace('Change Shape', 'Perfection Of Self'),
  'Foresight':
    Pathfinder.SCHOOLS.Divination
      .replace("Diviner's Fortune", 'Prescience')
      .replace('Scrying Adept', 'Foretell'),
  'Generation':
    Pathfinder.SCHOOLS.Evocation
      .replace('Intense Spells', 'Lingering Evocations')
      .replace('Force Missile', 'Wind Servant'),
  'Life':
    Pathfinder.SCHOOLS.Necromancy
      .replace('Power Over Undead', 'Healing Grace')
      .replace('Grave Touch Necromantic', 'Share Essence'),
  'Manipulator':
    Pathfinder.SCHOOLS.Enchantment
      .replace('Dazing Touch Enchantment', 'Beguiling Touch')
      .replace('Aura Of Despair', 'Shape Emotions'),
  'Phantasm':
    Pathfinder.SCHOOLS.Illusion
      .replace('Blinding Ray', 'Terror')
      .replace('Invisibility Field', 'Bedeviling Aura'),
  'Scryer':
    Pathfinder.SCHOOLS.Divination
      .replace("Diviner's Fortune", 'Send Senses'),
  'Shadow':
    Pathfinder.SCHOOLS.Illusion
      .replace('Blinding Ray', 'Binding Darkness')
      .replace('Invisibility Field', 'Shadow Step'),
  'Shapechange':
    Pathfinder.SCHOOLS.Transmutation
      .replace('Telekinetic Fist', 'Battleshaping'),
  'Teleportation':
    Pathfinder.SCHOOLS.Conjuration
      .replace('Acid Dart Conjuration', 'Shift'),
  'Undead':
    Pathfinder.SCHOOLS.Necromancy
      .replace('Grave Touch Necromantic', 'Bolster')
};
PFAPG.SHIELDS = {
  'Light Steel Quickdraw':'AC=1 Weight=1 Skill=2 Spell=5',
  'Light Wooden Quickdraw':'AC=1 Weight=1 Skill=2 Spell=5'
};
PFAPG.SKILLS = {
};
PFAPG.SPELLS = {

  'Absorbing Touch':
    'School=Transmutation ' +
    'Level=Alchemist3 ' +
    'Description="Self hand absorbs $L lb object (Fort neg) for $L dy"',
  'Accelerate Poison':
    'School=Transmutation ' +
    'Level=D2,R2,W2 ' +
    'Description="Poison affecting touched takes effect immediately or inflicts dbl damage for half duration"',
  'Acid Pit':
    'School=Conjuration ' +
    'Level=W4,Summoner4 ' +
    'Description="R$RM\' Creates 10\'x10\' %{lvl//2*10<?100}\' deep extradimensional pit (Climb DC 30) that inflicts 2d6 HP acid for %{lvl+1} rd"',
  'Alchemical Allocation':
    'School=Transmutation ' +
    'Level=Alchemist2 ' +
    'Description="Self gains effect of potion used in next rd w/out swallowing"',
  'Allfood':
    'School=Transmutation ' +
    'Level=R2 ' +
    'Description="Transforms touched %{lvl*5} object into edible substance"',
  'Alter Winds':
    'School=Transmutation ' +
    'Level=D1,W1,Wind1 ' +
    'Description="%{lvl>=16 ? \'Severe\' : lvl>=10 ? \'Strong\' : lvl>=4 ? \'Moderate\' : \'Light\'} winds in 10\' radius around touched increased or decreased 1 step for $L hr"',
  'Amplify Elixir':
    'School=Transmutation ' +
    'Level=Alchemist3 ' +
    'Description="Effects of potions consumed by self increased by 1/2 for $L rd"',
  'Ant Haul':
    'School=Transmutation ' +
    'Level=Alchemist1,C1,D1,O1,R1,W1,Summoner1 ' +
    'Description="Touched creature gains triple carrying capacity for %{lvl*2} rd"',
  'Aqueous Orb':
    'School=Conjuration ' +
    'Level=Aquatic3,D3,W3,Summoner3 ' +
    'Description="R$RM\' 10\' diameter sphere douses fires, inflicts 2d6 HP nonlethal (Ref neg) and engulfs (Ref neg), jumps or moves 30\'/rd for $L rd"',
  'Arcane Concordance':
    'School=Evocation ' +
    'Level=B3 ' +
    'Description="10\' radius gives +1 ally spell DC and free use of choice of Enlarge Spell, Extend Spell, Silent Spell, or Still Spell for $L rd"',
  'Arrow Eruption':
    'School=Conjuration ' +
    'Level=R2,W2 ' +
    'Description="R$RL\' Duplicates of killing arrow attack %{lvl<?15} foes in 30\' radius"',
  'Aspect Of The Bear':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="Self gains +2 AC and CMD, no AOO on bull rush, grapple, and overrun for $L min"',
  'Aspect Of The Falcon':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description="Self gains +3 Perception, +1 ranged attack, and ranged crit of 19-20/x3 for $L min"',
  'Aspect Of The Stag':
    'School=Transmutation ' +
    'Level=D4,R3 ' +
    'Description="Self gains +2 AC vs. AOO, +20 Speed, full speed in undergrowth, and immediate attack after successful foe AOO for $L min"',
  'Aspect Of The Wolf':
    'School=Transmutation ' +
    'Level=D5,R4 ' +
    'Description="Self gains +4 Strength and Dexterity, +2 trip attack, and swift trip w/no AOO for $L min"',
  'Aura Of Greater Courage':
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="Allies in 10\' radius gain immunity to fear for %{lvl*10} min"',
  'Ball Lightning':
    'School=Evocation ' +
    'Level=D4,W4 ' +
    'Description="R$RM\' %{(lvl+1)//4} 5\' spheres move 20\'/rd, inflict 3d6 HP electricity (Ref neg; -4 in metal armor) in same square for $L rd"',
  'Banish Seeming':
    'School=Abjuration ' +
    'Level=Inquisitor3,Witch5 ' +
    'Description="Touch dispels illusions and reverts magical transformations for $L rd"',
  "Bard's Escape":
    'School=Conjuration ' +
    'Level=B5 ' +
    'Description="R$RM\' Self and %{lvl//2} willing targets in 15\' radius teleport to another location within range"',
  'Beguiling Gift':
    'School=Enchantment ' +
    'Level=B1,Witch1 ' +
    'Description="R5\' Target takes and uses offered object (Will neg)"',
  'Bestow Grace':
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="Touched adds its charisma bonus to saves for $L min"',
  'Blaze Of Glory':
    'School=Conjuration ' +
    'Level=P4 ' +
    'Description="30\' radius restores %{lvl//2}d6 HP to good creatures, inflicts %{lvl//2}d6 HP on evil (Will half), gives +1 attack, damage, save, and skill to allies and -1 to foes for $L rd; self drops to -1 HP and stabilizes"',
  'Blessing Of Courage and Life':
    'School=Conjuration ' +
    'Level=C2,O2,P2 ' +
    'Description="R$RS\' Target gains +2 save vs. fear and death for $L min; may end to regain 1d8+%{lvl<?10} HP"',
  'Blessing Of Fervor':
    'School=Transmutation ' +
    'Level=C4,O4 ' +
    'Description="R$RS\' $L targets in 15\' radius gain choice of: +30 Speed; +1 attacks/rd; +2 attack, damage, and Reflex; or cast level 2 spell w/metamagic each rd for $L rd"',
  'Blessing Of The Salamander':
    'School=Transmutation ' +
    'Level=D5,R4 ' +
    'Description="Touched gains fast healing 5, fire resistance 20, and +2 CMB for $L rd"',
  'Blood Biography':
    'School=Divination ' +
    'Level=B2,C3,Inquisitor3,O3,W3 ' +
    'Description="Touched blood of target creature answers questions about identity and damage (Will neg)"',
  'Bloodhound':
    'School=Transmutation ' +
    'Level=Alchemist3,Inquisitor2,R2 ' +
    'Description="Self gains Scent features, +8 Perception (smell), +4 Survival (track via scent), -4 save vs. odor, DC 20 to smell poison for $L hr"',
  'Bloody Claws':
    'School=Necromancy ' +
    'Level=D4,R3 ' +
    'Description="Touched inflicts %{lvl//2} bleed damage w/natural attack for $L min"',
  "Bomber's Eye":
    'School=Transmutation ' +
    'Level=Alchemist1 ' +
    'Description="Self gains +1 throw attack and +10\' throw range for $L rd"',
  'Borrow Fortune':
    'School=Evocation ' +
    'Level=Fate3,O3 ' +
    'Description="Self gains better of two immediate d20 rolls and suffers worse of two d20 rolls for 2 rd"',
  'Borrow Skill':
    'School=Transmutation ' +
    'Level=B1 ' +
    'Description="Self gains skill ability of touched for next attempt w/in $L rd"',
  'Bow Spirit':
    'School=Conjuration ' +
    'Level=R4 ' +
    'Description="Conjured spirit attacks w/1 arrow or bolt each rd for $L rd"',
  'Brand':
    'School=Transmutation ' +
    'Level=Inquisitor0 ' +
    'Description="Inflicts 1 HP on touched to etch indelible mark (Fort neg, scraping to remove inflicts 1d6 HP) for $L dy"',
  'Greater Brand':
    'School=Transmutation ' +
    'Level=Inquisitor4 ' +
    'Description="Inflicts 1d6 HP on touched to etch permanent indelible mark (Fort neg) that glows and sickens when w/in 30\' of self faith symbol"',
  'Break':
    'School=Transmutation ' +
    'Level=W1 ' +
    'Description="R$RS\' Target medium object becomes broken (Fort neg)"',
  'Brilliant Inspiration':
    'School=Evocation ' +
    'Level=B6,Leadership6 ' +
    'Description="R$RS\' Target gains better of two attack, ability, or skill rolls for $L rd or until nat 20 is rolled"',
  'Bristle':
    'School=Transmutation ' +
    'Level=D1 ' +
    'Description="Target may trade up to %{lvl//3<?5} natural armor bonus for equal damage bonus each rd for $L min"',
  'Burning Gaze':
    'School=Evocation ' +
    'Level=D2,W2,Witch2 ' +
    'Description="R30\' Inflicts 1d6 HP fire/rd on target (Ref ends) for $L rd"',
  'Burst Bonds':
    'School=Evocation ' +
    'Level=Inquisitor1 ' +
    'Description="Touched restraints or restraining creature suffers %{lvl<?5}d6 HP (Fort half); ignores hardness up to 10"',
  'Cacophonous Call':
    'School=Enchantment ' +
    'Level=B2 ' +
    'Description="R$$RS\' Target suffers nauseated (Will neg) for $L rd"',
  'Mass Cacophonous Call':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="R$RS\' $L targets in 15\' radius suffer nauseated (Will neg) for $L rd"',
  'Calcific Touch':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="Touched suffers permanent 1d4 Dex damage and effects of Slow spell (Fort Dex only) 1/rd for $L rd"',
  'Call Animal':
    'School=Enchantment ' +
    'Level=D1,R1 ' +
    'Description="Nearest wild animal of chosen type moves toward self for $L hr"',
  'Campfire Wall':
    'School=Evocation ' +
    'Level=B3,D2,R2,W3 ' +
    'Description="R$RS\' 20\' radius around fire blocks sight, inflicts 1d6 HP fire and 1d6 min glow on those passing toward fire for %{lvl*2} hr"',
  'Cast Out':
    'School=Abjuration ' +
    'Level=Inquisitor3 ' +
    'Description="Touched suffers 2d8+%{lvl<?15} HP and loss of %{lvl//4} magic effects (Will half HP and 1 effect)"',
  'Castigate':
    'School=Enchantment ' +
    'Level=Inquisitor2 ' +
    'Description="R$RS\' Target suffers fear for $L rd (Will shaken for 1 rd; same deity -2)"',
  'Mass Castigate':
    'School=Enchantment ' +
    'Level=Inquisitor5 ' +
    'Description="R$RM\' $L targets in 15\' radius suffer fear for $L rd (Will shaken for 1 rd; same deity -2)"',
  'Challenge Evil':
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="R$RS\' Target must fight you (self gains +2 attack) or suffer sickened (Will neg) for $L min"',
  'Chameleon Stride':
    'School=Illusion ' +
    'Level=R2 ' +
    'Description="Self gains +4 Stealth and 20% miss from non-adjacent foes for $L min"',
  'Clashing Rocks':
    'School=Conjuration ' +
    'Level=D9,Deep9,W9,Stone9 ' +
    'Description="R$RL\' Ranged touch inflicts 20d6 HP bludgeoning, knocked prone, and buried in rubble (Ref not buried); missed target and creatures in path suffer 10d6 HP and knocked prone (Ref half HP only)"',
  'Cleanse':
    'School=Evocation ' +
    'Level=C5,Divine5,Inquisitor6,O5 ' +
    'Description="Self regains 4d8+%{lvl<?25} HP, recovers from ability damage and conditions, and breaks one enchantment"',
  'Cloak Of Dreams':
    'School=Enchantment ' +
    'Level=B5,Nightmare6,W6,Witch6 ' +
    'Description="Creatures in 5\' radius fall asleep for 1 min (Will neg; creatures w/Scent -4) for $L rd"',
  'Cloak Of Shade':
    'School=Abjuration ' +
    'Level=D1,R1 ' +
    'Description="$L touched treat sunlight as 1 level less severe for $L hr"',
  'Cloak Of Winds':
    'School=Abjuration ' +
    'Level=D3,R3,W3,Wind3 ' +
    'Description="R$RS\' Foes of target suffer -4 ranged attacks; Tiny foes cannot touch target (Fort neg) for $L min"',
  'Confess':
    'School=Enchantment ' +
    'Level=Inquisitor2 ' +
    'Description="R$RS\' Target must answer question truthfully or suffer 1d6 HP and 2d4 rd sickened (Will half HP only)"',
  'Contagious Flame':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description="R$RS\' %{(lvl+1)//4} ranged touch rays in 15\' radius inflict 4d6 HP fire, reflect to new targets for 3 rd"',
  'Coordinated Effort':
    'School=Divination ' +
    'Level=B3,Inquisitor3 ' +
    'Description="R$RS\' %{lvl//3} allies in 15\' radius gain use of self Teamwork feat for $L min"',
  'Corruption Resistance':
    'School=Abjuration ' +
    'Level=Antipaladin2,Inquisitor2,P2 ' +
    'Description="Touched gains DR %{lvl>=11?15:lvl>=7?10:5}/- vs. chosen alignment damage for %{lvl*10} min"',
  "Coward's Lament":
    'School=Enchantment ' +
    'Level=Inquisitor4 ' +
    'Description="R$RS\' Target suffers -1 AC, attack, and saves/rd unless attacks self (Will neg) for $L rd"',
  "Crafter's Curse":
    'School=Transmutation ' +
    'Level=W1 ' +
    'Description="R$RS\' Target suffers -5 Craft (Will neg) for $L dy"',
  "Crafter's Fortune":
    'School=Transmutation ' +
    'Level=Alchemist1,W1 ' +
    'Description="R$RS\' Target gains +5 on next Craft skill check"',
  'Create Pit':
    'School=Conjuration ' +
    'Level=Caves2,W2,Summoner2 ' +
    'Description="R$RM\' Creates 10\'x10\' %{lvl//2*10<?30}\' deep extradimensional pit (Climb DC 25) for %{lvl+1} rd"',
  'Create Treasure Map':
    'School=Divination ' +
    'Level=B2,D3,R2,W2 ' +
    'Description="Allows use of 1-day-old corpse to create a map to %{lvl//3} treasures that it knew"',
  'Cup Of Dust':
    'School=Transmutation ' +
    'Level=D3,Witch3 ' +
    'Description="R$RS\' Target suffers dehydration (Fort neg) for $L dy"',
  'Dancing Lantern':
    'School=Transmutation ' +
    'Level=B1,C1,O1,R1,W1,Witch1 ' +
    'Description="Touched lantern follows 5\' behind self for $L hr"',
  'Deadly Finale':
    'School=Evocation ' +
    'Level=B6 ' +
    'Description="R$RS\' Ending Bardic Performance inflicts 2d8 HP sonic and 3d6 HP bleed for 1d6 rd (Fort sonic only) on %{lvl//3} targets in 15\' radius"',
  'Deafening Song Bolt':
    'School=Evocation ' +
    'Level=B5 ' +
    'Description="R$RS\' Ranged touch w/3 notes inflicts 3d10 HP sonic and deafened for 1d6 rd each"',
  'Defile Armor':
    'School=Abjuration ' +
    'Level=Inquisitor4,Antipaladin3 ' +
    'Description="Touched armor gives +%{lvl//4} AC, plus DR 5/good during judgment or smite for $L min"',
  'Deflection':
    'School=Abjuration ' +
    'Level=Defense7,W7 ' +
    'Description="Missed attacks on self reflected onto attacker for $L rd"',
  'Delayed Consumption':
    'School=Transmutation ' +
    'Level=Alchemist5 ' +
    'Description="Delays effects of second consumed extract up to $L dy"',
  'Denounce':
    'School=Enchantment ' +
    'Level=B4,Inquisitor4 ' +
    'Description="R$RS\' Creatures in 30\' radius shift attitude toward target 2 levels worse (Will neg) for $L hr"',
  'Detect Aberration':
    'School=Divination ' +
    'Level=D1,R1 ' +
    'Description="R$RL\' Cone gives self info on aberrations for conc or %{lvl*10} min"',
  'Detonate':
    'School=Evocation ' +
    'Level=Alchemist4,W4 ' +
    'Description="15\' radius inflicts %{lvl}d8 HP chosen energy type, 30\' radius and self half (Ref half)"',
  'Devolution':
    'School=Transmutation ' +
    'Level=W3,Summoner3 ' +
    'Description="R$RS\' Target eidolon loses %{lvl//5+1} evolutions for $L rd"',
  'Discordant Blast':
    'School=Evocation ' +
    'Level=B4 ' +
    'Description="10\' radius or 30\' cone inflicts 3d6 HP sonic and bull rush"',
  'Divine Transfer':
    'School=Necromancy ' +
    'Level=P3 ' +
    'Description="Touched regains up to %{constitution} HP, transferred from self, and gains DR %{charismaModifier}/evil for $L rd"',
  'Divine Vessel':
    'School=Transmutation ' +
    'Level=O8 ' +
    'Description="Self gains size level and anarchic, axiomatic, celestial, or fiendish abilities for $L rd"',
  'Draconic Reservoir':
    'School=Evocation ' +
    'Level=Alchemist3,W3 ' +
    'Description="Touched can absorb, then release in attack, %{lvl*6} HP of specified energy damage"',
  "Dragon's Breath":
    'School=Evocation ' +
    'Level=Alchemist4,W4 ' +
    'Description="60\' line or 30\' cone inflicts %{lvl<?12}d6 HP specified energy damage (Ref half)"',
  'Dust Of Twilight':
    'School=Conjuration ' +
    'Level=B2,W2 ' +
    'Description="R$RM\' 5\' radius inflicts fatigue (Fort neg) and extinguishes mundane light and 2nd level light spells"',
  'Eagle Eye':
    'School=Divination ' +
    'Level=D2,R2 ' +
    'Description="R$RL\' Self can view from higher point for $L min"',
  'Elemental Aura':
    'School=Evocation ' +
    'Level=Alchemist3,Boreal3,W3 ' +
    'Description="Creatures adjacent to self suffer 2d6 HP energy damage (Ref half), plus energy effects, for $L rd"',
  'Elemental Speech':
    'School=Divination ' +
    'Level=B3,C3,D2,O3,W2 ' +
    'Description="Self can converse w/chosen element creatures for $L min"',
  'Elemental Touch':
    'School=Evocation ' +
    'Level=Alchemist2,W2 ' +
    'Description="Touch inflicts 1d6 HP chosen energy, plus energy effects, for $L rd"',
  'Elude Time':
    'School=Transmutation ' +
    'Level=Alchemist5 ' +
    'Description="Self enters suspended animation, becoming impervious to damage, for up to $L min"',
  'Enemy Hammer':
    'School=Transmutation ' +
    'Level=W6 ' +
    'Description="R$RL\' Self can use target as 30\' thrown weapon (Fort neg, full-round resistance +4), inflicting 2d6 HP (medium target), for $L rd"',
  'Enter Image':
    'School=Transmutation ' +
    'Level=B2,C3,O3,W3 ' +
    'Description="R%{lvl*50}\' Self can interact via image of self for conc"',
  'Euphoric Tranquility':
    'School=Enchantment ' +
    'Level=B6,C8,D8,Love8,O8,W8 ' +
    'Description="Touched treats all as friends (Will after attacked neg 1 rd), suffers half speed for $L rd"',
  'Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner3 ' +
    'Description="Touched eidolon gains 4-point evolution for $L min"',
  'Greater Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner4 ' +
    'Description="Touched eidolon gains 6-point evolution for $L min"',
  'Lesser Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner2 ' +
    'Description="Touched eidolon gains 2-point evolution for $L min"',
  'Expeditious Excavation':
    'School=Transmutation ' +
    'Level=Deep1,D1,W1 ' +
    'Description="R$RS\' Moves 5\' cu of dirt"',
  'Expend':
    'School=Abjuration ' +
    'Level=W7 ' +
    'Description="R$RM\' 20\' radius inflicts ineffectual use of ability"',
  'Feast Of Ashes':
    'School=Transmutation ' +
    'Level=D2,Witch2 ' +
    'Description="R$RS\' Target suffers starvation, eating causes nausea (DC 12 Fort neg) for %{lvl*2} dy"',
  'Feather Step':
    'School=Transmutation ' +
    'Level=B1,D1,R1 ' +
    'Description="R$RS\' Target ignores difficult terrain for %{lvl*10} min"',
  'Mass Feather Step':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description="R$RS\' $L targets in 15\' radius ignore difficult terrain for %{lvl*10} min"',
  'Fester':
    'School=Necromancy ' +
    'Level=Inquisitor3,Witch2 ' +
    'Description="R$RS\' Target suffers %{lvl+12} resistance to healing for $L rd (Fort 1 rd)"',
  'Mass Fester':
    'School=Necromancy ' +
    'Level=Inquisitor6,Witch6 ' +
    'Description="R$RS\' $L targets in 15\' radius suffer %{lvl+12} resistance to healing for $L rd (Fort 1 rd)"',
  'Fiery Body':
    'School=Transmutation ' +
    'Level=Ash9,W9,Flame9 ' +
    'Description="Self gains immunity to fire, blindness, crit, ability damage, deafness, disease, drowning, stunning, and physiology spells, half damage from acid or electricity, +6 Dexterity, 40\' Fly, dazzling brightness, 50% miss chance, regains HP/3 from fire damage, and suffers 2d6 HP/rd in water, for $L min"',
  'Fire Breath':
    'School=Evocation ' +
    'Level=Alchemist2,W2 ' +
    'Description="3 uses of 15\' cone inflict 4d6, 2d6, and 1d6 HP (Ref half) in %{lvl*2} rd"',
  'Fire Of Entanglement':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="Next Smite Evil hit inflicts entanglement for $L rd (Ref 1 rd)"',
  'Fire Of Judgment':
    'School=Evocation ' +
    'Level=P3 ' +
    'Description="Next Smite Evil hit inflicts 1d6 HP (evil outsider, dragon, or undead 1d10 HP) when attacking others for $L rd (Will 1 rd)"',
  'Fire Of Vengeance':
    'School=Evocation ' +
    'Level=P4 ' +
    'Description="Next Smite Evil hit inflicts 3d8 HP on first attack on other"',
  'Fire Snake':
    'School=Evocation ' +
    'Level=D5,W5 ' +
    'Description="R60\' Curved line inflicts %{lvl<?15}d6 HP fire (Ref half)"',
  'Firebrand':
    'School=Transmutation ' +
    'Level=W7 ' +
    'Description="%{lvl//4} targets in 15\' radius gain torchlight, immunity to self fire spells, and 1d6 HP fire from attacks for $L rd; may end for R30\' ranged touch that inflicts 6d6 HP fire"',
  'Firefall':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="R$RL\' Target fire extinguished; 60\' radius inflicts 5d6 HP fire and catch on fire (Ref half HP only); 120\' radius inflicts blinded for 1d4+1 rd (Will neg)"',
  'Flames Of The Faithful':
    'School=Transmutation ' +
    'Level=Inquisitor2 ' +
    'Description="Touched self weapon gains flaming or flaming burst features for $L rd"',
  'Flare Burst':
    'School=Evocation ' +
    'Level=B1,D1,W1 ' +
    'Description="R$RS\' 10\' radius inflicts dazzled (Fort neg) for 1 min"',
  'Fluid Form':
    'School=Transmutation ' +
    'Level=Alchemist4,W6,Waves6 ' +
    'Description="Self gains DR 10/slashing, +10 reach, +60\' Swim, amphibious features, and ability to squeeze through cracks for $L min"',
  'Mass Fly':
    'School=Transmutation ' +
    'Level=Feather6,W7 ' +
    'Description="R$RS\' $L targets in 15\' radius gain 60\' fly speed for %{lvl*10} min"',
  'Foe To Friend':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="R$RM\' Redirects or negates foe attack (Will neg)"',
  'Follow Aura':
    'School=Divination ' +
    'Level=Inquisitor2 ' +
    'Description="Self can track chosen alignment aura for %{lvl*10} min"',
  "Fool's Forbiddance":
    'School=Abjuration ' +
    'Level=B6 ' +
    'Description="10\' radius inflicts confusion (Will staggered) for conc"',
  'Forced Repentance':
    'School=Enchantment ' +
    'Level=Inquisitor4,P4 ' +
    'Description="R$RS\' Evil target creature falls prone and makes confession for $L rd"',
  'Frozen Note':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="Creatures in 30\' radius held spellbound (Will (%{lvl-4} HD) or %{lvl+4} HD neg) for conc or $L rd"',
  'Gallant Inspiration':
    'School=Divination ' +
    'Level=B2 ' +
    'Description="R$RS\' Target immediately gains +2d4 on failed roll"',
  'Getaway':
    'School=Conjuration ' +
    'Level=B6,W6 ' +
    'Description="R30\' Self and %{lvl//2} willing pre-selected targets teleport to prepared location"',
  'Geyser':
    'School=Conjuration ' +
    'Level=Aquatic4,D4,W5,Waves5 ' +
    'Description="R$RL\' 5\' sq inflicts 3d6 HP fire and %{lvl//2}d6 falling (Ref half fire only), then 1d6 HP fire in %{lvl*5}\' radius for conc + 1 rd"',
  'Ghostbane Dirge':
    'School=Transmutation ' +
    'Level=B2,C2,Inquisitor2,O2,P1 ' +
    'Description="R$RS\' Incorporeal target suffers half damage from normal weapons and full damage from magic for $L rd"',
  'Mass Ghostbane Dirge':
    'School=Transmutation ' +
    'Level=B4,C5,Inquisitor5,O5,P3 ' +
    'Description="R$RS\' $L incorporeal targets in 15\' radius suffer half damage from normal weapons, full damage from magic, for $L rd"',
  'Glide':
    'School=Transmutation ' +
    'Level=D2,R1,W2,Summoner2,Witch2 ' +
    'Description="Self falls 60\'/rd and may move horizontally for $L min"',
  'Grace':
    'School=Abjuration ' +
    'Level=C2,O2,P1 ' +
    'Description="Self movement provokes no AOO for 1 rd"',
  'Gravity Bow':
    'School=Transmutation ' +
    'Level=R1,W1 ' +
    'Description="Self bow attacks inflict extra damage for $L min"',
  'Grove Of Respite':
    'School=Conjuration ' +
    'Level=D4,R4,Nature4 ' +
    'Description="R$RS\' Creates 20\' radius grove with food and water for %{lvl*2} hr"',
  'Guiding Star':
    'School=Divination ' +
    'Level=C3,O3,R2,Witch3 ' +
    'Description="Self aware of direction and distance to casting location for $L dy"',
  "Hero's Defiance":
    'School=Conjuration ' +
    'Level=P1 ' +
    'Description="Expending Lay on Hands use on self when reduced to 0 HP heals +1d6 HP"',
  'Heroic Finale':
    'School=Enchantment ' +
    'Level=B4 ' +
    'Description="R$RS\' End of Bardic Performance allows target move or action"',
  'Hidden Speech':
    'School=Transmutation ' +
    'Level=B2,Inquisitor3,Witch2 ' +
    'Description="R$RS\' Self and $L targets gain +10 Bluff to exchange secret messages; foes suffer -5 Sense Motive to decipher"',
  'Hide Campsite':
    'School=Illusion ' +
    'Level=D3,R2 ' +
    'Description="R$RS\' 20\' cu covers camp activity for %{lvl*2} hr"',
  'Holy Whisper':
    'School=Evocation ' +
    'Level=P3 ' +
    'Description="30\' cone sickens evil-aligned creatures and inflicts 2d8 HP on evil creatures and undead (Fort neg), gives good-aligned creatures +2 attack and damage for 1 rd"',
  'Honeyed Tongue':
    'School=Transmutation ' +
    'Level=B2,Inquisitor2,P1 ' +
    'Description="Self gains best of two Diplomacy rolls to change attitude, +5 Diplomacy to gather information for %{lvl*10} min"',
  'Hungry Pit':
    'School=Conjuration ' +
    'Level=Caves6,W5,Summoner5 ' +
    'Description="R$RM\' Creates 10\'x10\' %{lvl//2*10<?100}\' deep extradimensional pit (Climb DC 35) that inflicts 4d6 HP bludgeoning (Ref half) for %{lvl+1} rd"',
  "Hunter's Eye":
    'School=Divination ' +
    'Level=Inquisitor3,R2 ' +
    'Description="R$RM\' Self can see invisible target and gains +20 Perception to locate target for $L min"',
  "Hunter's Howl":
    'School=Necromancy ' +
    'Level=R1 ' +
    'Description="Self gains +2 attack, damage, Bluff, Knowledge, Perception, Sense Motive, and Survival vs. targets in 20\' radius (favored enemies shaken) (Will neg) for $L rd"',
  'Hydraulic Push':
    'School=Evocation ' +
    'Level=Aquatic1,D1,W1 ' +
    'Description="R$RS\' Target suffers CMB +%{lvl+(intelligenceModifier>?wisdomModifier>?charismaModifier)} bull rush; extinguishes fires"',
  'Hydraulic Torrent':
    'School=Evocation ' +
    'Level=D3,W3 ' +
    'Description="Creatures in 60\' line suffer CMB +%{lvl+(intelligenceModifier>?wisdomModifier>?charismaModifier)} bull rush; extinguishes fires"',
  'Ill Omen':
    'School=Enchantment ' +
    'Level=Witch1 ' +
    'Description="R$RS\' Target suffers worse of two rolls for next %{lvl//5+1} d20 rolls (prayer negates 1) w/in $L rd"',
  'Innocence':
    'School=Transmutation ' +
    'Level=B1 ' +
    'Description="Self gains +10 Bluff to promote own innocence for $L min"',
  'Instant Armor':
    'School=Conjuration ' +
    'Level=C2,O2,P2 ' +
    'Description="Self gains effects of %{lvl>=12 ? \'full plate\' : lvl>=9 ? \'half-plate\' : lvl>=6 ? \'banded mail\' : \'chainmail\'} for $L min"',
  'Instant Enemy':
    'School=Enchantment ' +
    'Level=R3 ' +
    'Description="R$RS\' Self gains favored enemy benefits vs. target for $L min"',
  'Invigorate':
    'School=Illusion ' +
    'Level=B1 ' +
    'Description="Touched ignores effects of fatigued and exhausted for %{lvl*10} min, suffers 1d6 HP nonlethal after"',
  'Mass Invigorate':
    'School=Illusion ' +
    'Level=B3 ' +
    'Description="$L touched ignore effects of fatigued and exhausted for %{lvl*10} min, suffer 1d6 HP nonlethal after"',
  "Jester's Jaunt":
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="Touched teleported 30\' to safe spot (Will neg)"',
  'Keen Senses':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,R1 ' +
    'Description="Touched gains +2 Perception and Low-Light Vision (or dbl range) for $L min"',
  "King's Castle":
    'School=Conjuration ' +
    'Level=P4 ' +
    'Description="R$RS\' Self exchanges places w/target ally"',
  "Knight's Calling":
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="R$RS\' Target must move to attack self (Will neg)"',
  'Lead Blades':
    'School=Transmutation ' +
    'Level=R1 ' +
    'Description="Self melee weapons inflict extra damage for $L min"',
  'Life Bubble':
    'School=Abjuration ' +
    'Level=C5,D4,O5,R3,W5 ' +
    'Description="$L touched breathe freely, comfortable from -40F to 150F, and unaffected by pressure for %{lvl*2} hr total"',
  'Light Lance':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="Self gains glowing +1 holy lance for %{lvl+1} rd"',
  'Lily Pad Stride':
    'School=Transmutation ' +
    'Level=D3 ' +
    'Description="R$RL\' Self moves across liquid, others can follow w/DC 10 Acrobatics, for %{lvl*10} min"',
  'Lockjaw':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="Touched gains +4 CMB to grapple w/natural weapon"',
  'Marks Of Forbiddance':
    'School=Abjuration ' +
    'Level=P3 ' +
    'Description="R$RS\' Ally target and foe target cannot attack one another (Will neg) for $L rd"',
  'Mask Dweomer':
    'School=Illusion ' +
    'Level=Witch1 ' +
    'Description="Spell aura on touched immune to <i>Detect Magic</i> for $L dy"',
  'Memory Lapse':
    'School=Enchantment ' +
    'Level=B1,Memory2,W1 ' +
    'Description="R$RS\' Target forgets prior rd (Will neg)"',
  'Moonstruck':
    'School=Enchantment ' +
    'Level=D4,Insanity4,Rage6,W4,Witch4 ' +
    'Description="R$RM\' Target suffers dazed for 1 rd, then bite attack, two claw attacks, rage, and confusion for $L rd, then dazed for 1 rd (Will neg)"',
  'Nap Stack':
    'School=Necromancy ' +
    'Level=C3,O3 ' +
    'Description="30\' gives effects of 8 hr sleep in 2 hr for 8 hr"',
  'Natural Rhythm':
    'School=Transmutation ' +
    'Level=D2 ' +
    'Description="Touched gains +1 cumulative damage on natural attacks (max +5, miss resets to +0) for $L rd"',
  "Nature's Exile":
    'School=Transmutation ' +
    'Level=D3,Witch3 ' +
    'Description="Touched suffers permanent hostility from natural animals and -10 Survival (Will neg)"',
  'Negate Aroma':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,R1 ' +
    'Description="R$RS\' Target loses odor (Fort neg) for $L rd"',
  'Oath Of Peace':
    'School=Abjuration ' +
    'Level=P4 ' +
    'Description="Self gains +5 AC and DR 10/evil for $L rd or until attacks"',
  "Oracle's Burden":
    'School=Necromancy ' +
    'Level=O2 ' +
    'Description="R$RM\' Target suffers Oracle\'s Curse effects (Will neg) for $L min"',
  'Pain Strike':
    'School=Evocation ' +
    'Level=W3,Witch3 ' +
    'Description="R$RS\' Target suffers 1d6 HP nonlethal and sickened (Fort neg) and self gains +4 Intimidate for %{lvl<?10} rd"',
  'Mass Pain Strike':
    'School=Evocation ' +
    'Level=W5,Witch5 ' +
    'Description="R$RS\' $L targets in 15\' radius suffer 1d6 HP nonlethal and sickened (Fort neg) and self gains +4 Intimidate for %{lvl<?10} rd"',
  "Paladin's Sacrifice":
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="R$RS\' Immediate damage to target transferred to self"',
  'Perceive Cues':
    'School=Transmutation ' +
    'Level=Alchemist2,Inquisitor2,R2,Witch2 ' +
    'Description="Self gains +5 Perception and Sense Motive for %{lvl*10} min"',
  'Phantasmal Revenge':
    'School=Illusion ' +
    'Level=W7 ' +
    'Description="Spectre from touched $L-day-old corpse finds killer and inflicts %{lvl*10} HP (Will 5d6+$L HP)"',
  'Phantasmal Web':
    'School=Illusion ' +
    'Level=B5,Insanity6,W5 ' +
    'Description="R$RM\' $L targets in 15\' radius suffer entanglement and nauseated (Will neg; Fort entanglement only) for $L rd"',
  'Pied Piping':
    'School=Enchantment ' +
    'Level=B6 ' +
    'Description="R90\' Creatures w/chosen trait follow self (Will neg) for conc"',
  'Pillar Of Life':
    'School=Conjuration ' +
    'Level=C5,O5 ' +
    'Description="R$RM\' Creatures touching 5\' sq regain 2d8+%{lvl<?20} HP, undead suffer %{lvl<?10}d6 HP (light-sensitive %{lvl<?10}d8)"',
  'Planar Adaptation':
    'School=Transmutation ' +
    'Level=Alchemist5,C4,O4,W5,Summoner5 ' +
    'Description="Self gains immunity to chosen planar harm and 20 energy resistance for $L hr"',
  'Mass Planar Adaptation':
    'School=Transmutation ' +
    'Level=W7,Summoner6 ' +
    'Description="R$RS\' $L targets in 15\' radius gain immunity to chosen planar harm and 20 energy resistance for $L hr"',
  'Pox Pustules':
    'School=Necromancy ' +
    'Level=D2,W2,Witch2 ' +
    'Description="R$RS\' Target suffers sickened and -4 Dexterity (Fort neg; full-round scratch neg sickened for 1 rd) for $L min"',
  'Protective Spirit':
    'School=Conjuration ' +
    'Level=R2 ' +
    'Description="+%{baseAttack+dexterityModifier} attack by spirit negates %{dexterityModifier>?1} AOO/rd on self for $L rd"',
  'Purging Finale':
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="R$RS\' End of Bardic Performance allows removing condition from target"',
  'Purified Calling':
    'School=Conjuration ' +
    'Level=Summoner4 ' +
    'Description="Summons eidolon w/full HP and no ability damage or temporary conditions"',
  'Putrefy Food And Drink':
    'School=Transmutation ' +
    'Level=W0,Witch0 ' +
    'Description="R10\' Fouls $L\' cu food and water or single potion"',
  'Rally Point':
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="R5\' Good creatures passing through 5\' sq gain +2 attacks, +2 saves, and %{lvl*2} temporary HP for 1 rd"',
  'Rampart':
    'School=Conjuration ' +
    'Level=D7,W7 ' +
    'Description="R$RM\' Creates 10\'x%{lvl//2*10}\' linear or %{3+lvl}\' radius circular earthen wall (DC 20 Climb)"',
  'Rebuke':
    'School=Evocation ' +
    'Level=Inquisitor4 ' +
    'Description="Foes in 20\' radius suffer %{lvl//2<?5}d8 HP and staggered for 1 rd (worshipers of same deity %{lvl<?10}d6 and stunned for 1d4 rd) (Fort half HP only)"',
  'Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner3 ' +
    'Description="Touched eidolon regains 3d10 HP+%{lvl<?10} HP"',
  'Greater Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner5 ' +
    'Description="Touched eidolon regains 5d10 HP+%{lvl<?20} HP"',
  'Lesser Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner1 ' +
    'Description="Touched eidolon regains 1d10 HP+%{lvl<?5} HP"',
  'Residual Tracking':
    'School=Divination ' +
    'Level=R1 ' +
    'Description="Self sees creation of touched footprint"',
  'Resounding Blow':
    'School=Evocation ' +
    'Level=Antipaladin4,Inquisitor5,Paladin4 ' +
    'Description="Self hits w/held weapon inflict +1d6 HP sonic, crit inflicts stunned 1rd and deafened 1d6 rd (Fort neg), for $L rd"',
  'Rest Eternal':
    'School=Necromancy ' +
    'Level=Ancestors4,C4,O4,D5,Witch5 ' +
    'Description="Touched corpse requires DC %{lvl+11} caster check to communicate, resurrect, or animate"',
  'Restful Sleep':
    'School=Necromancy ' +
    'Level=B1 ' +
    'Description="R$RS\' $L targets in 15\' radius gain full day\'s rest benefits from 8 hr sleep and regain 3 x level HP from full day\'s rest"',
  'Resurgent Transformation':
    'School=Conjuration ' +
    'Level=Alchemist5 ' +
    'Description="If taken to 1/4 HP w/in $L hr, self regains 4d8+%{lvl<?25} HP and gains +4 Constitution, +4 Strength, DR 5/-, and Haste effects for $L rd, then suffers exhausted and 1d4 points Constitution damage"',
  'Retribution':
    'School=Necromancy ' +
    'Level=Inquisitor3 ' +
    'Description="R$RS\' Target who just damaged self suffers -4 attack, skill checks, and ability checks for $L rd (Fort 1 rd)"',
  'Reviving Finale':
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="R$RS\' End of Bardic Performance causes 20\' radius to restore 2d6 HP to allies"',
  'Righteous Vigor':
    'School=Enchantment ' +
    'Level=Inquisitor3,P2 ' +
    'Description="Touched gains +1 attack and 1d8 temporary HP from each successful attack (max +4/20 THP, miss resets to +0) for $L rd"',
  'River Of Wind':
    'School=Evocation ' +
    'Level=D4,W4,Wind4 ' +
    'Description="120\' line inflicts 4d6 HP nonlethal and knocked prone (Fort half HP only)"',
  'Sacred Bond':
    'School=Conjuration ' +
    'Level=C3,Inquisitor2,O3,P2 ' +
    'Description="Self and touched may heal each other at $RS\' for %{lvl*10} min"',
  'Sacrificial Oath':
    'School=Abjuration ' +
    'Level=Martyr6,P4 ' +
    'Description="Self may suffer damage instead of touched target (refusal inflicts %{constitution} HP) for $L min"',
  'Saddle Surge':
    'School=Transmutation ' +
    'Level=P2 ' +
    'Description="Self gains +1 Ride and self and mount gain +1 damage per 5\' move (+$L max) for $L rd"',
  'Sanctify Armor':
    'School=Abjuration ' +
    'Level=Inquisitor4,P3 ' +
    'Description="Touched armor gives +%{lvl//4} AC, plus DR 5/evil during judgment or smite for $L min"',
  'Saving Finale':
    'School=Evocation ' +
    'Level=B1 ' +
    'Description="R$RS\' End of Bardic Performance allows target to reroll failed save"',
  'Scent Trail':
    'School=Transmutation ' +
    'Level=D2 ' +
    'Description="R$RS\' $L targets in 15\' radius gain +20 Survival to follow target trail for $L hr"',
  'Screech':
    'School=Evocation ' +
    'Level=Witch3 ' +
    'Description="Foes in 30\' radius provoke AOO (Fort neg)"',
  'Sculpt Corpse':
    'School=Necromancy ' +
    'Level=W1 ' +
    'Description="Reshapes touched corpse to look like another creature"',
  'Seamantle':
    'School=Conjuration ' +
    'Level=Aquatic8,D8,W8,Waves8 ' +
    'Description="30\' water column gives self +8 AC, +4 Reflex, and 30\' slam attack for $L min"',
  'Seek Thoughts':
    'School=Divination ' +
    'Level=Alchemist3,B3,Inquisitor3,Summoner3,Thought3,W3,Witch3 ' +
    'Description="40\' radius gives self answer from nearby thoughts for conc or $L min (Will neg)"',
  'Shadow Projection':
    'School=Necromancy ' +
    'Level=W4 ' +
    'Description="Self becomes shadow for $L hr; death reduces body to -1 HP"',
  'Share Language':
    'School=Divination ' +
    'Level=B1,C2,D2,Language2,O2,W2 ' +
    'Description="Touched can use %{lvl//4+1} languages self knows for 1 dy"',
  'Share Senses':
    'School=Divination ' +
    'Level=W4,Witch3 ' +
    'Description="R$RL\' Self can use familiar\'s senses for $L min"',
  'Shared Wrath':
    'School=Enchantment ' +
    'Level=Inquisitor4 ' +
    'Description="$L targets in 15\' radius gain +%{1>?lvl//3<?3} attack, damage, and spell resistance checks%{lvl>=12?\', plus dbl crit threat range,\':\'\'} vs. chosen foe for 1 min"',
  'Shifting Sand':
    'School=Transmutation ' +
    'Level=D3,Deep3,W3 ' +
    'Description="R$RM\' 10\' radius moves 10\'/rd, creates difficult terrain, entangles and knocks prone (Ref neg) for $L rd"',
  'Sift':
    'School=Divination ' +
    'Level=B0,Inquisitor0 ' +
    'Description="R30\' Self makes -5 Perception to note details at range"',
  'Sirocco':
    'School=Evocation ' +
    'Level=D6,Storms6,W6,Wind6 ' +
    'Description="R$RM\' 20\' radius inflicts 4d6+$L HP fire, fatigues, and knocks prone (Fort half HP only) for $L rd"',
  'Sleepwalk':
    'School=Enchantment ' +
    'Level=Inquisitor4,Witch4 ' +
    'Description="Touched unconscious creature animates and moves at half speed for $L hr"',
  'Slipstream':
    'School=Conjuration ' +
    'Level=Aquatic2,D2,Oceans2,R2,W2,Waves2 ' +
    'Description="Creates wave that moves touched 10\'/rd for %{lvl*10} min"',
  'Snake Staff':
    'School=Transmutation ' +
    'Level=C5,D5,O5 ' +
    'Description="R$RM\' Transforms sticks into snakes under self control for $L rd"',
  'Solid Note':
    'School=Conjuration ' +
    'Level=B1 ' +
    'Description="R$RS\' Note becomes hand-sized physical object for conc + $L rd"',
  'Spark':
    'School=Evocation ' +
    'Level=B0,C0,D0,O0,W0,Witch0 ' +
    'Description="R$RS\' Lights size fine flammable object (Fort neg)"',
  'Spiked Pit':
    'School=Conjuration ' +
    'Level=Caves3,W3,Summoner3 ' +
    'Description="R$RM\' Creates 10\'x10\' %{lvl//2*10<?50}\' deep extradimensional pit (Climb DC 20) that inflicts +2d6 HP piercing from fall and 1d6 HP piercing from contact for %{lvl+1} rd"',
  'Spiritual Ally':
    'School=Evocation ' +
    'Level=C4,O4 ' +
    'Description="R$RM\' Force being moves 30\'/rd and attacks at +%{baseAttack+wisdomModifier}, inflicts 1d10+%{lvl//3<?5} HP for $L rd (DC d20+$L SR ends)"',
  'Spite':
    'School=Abjuration ' +
    'Level=Witch4 ' +
    'Description="Damage to self triggers level 4 spell for $L hr"',
  'Stay The Hand':
    'School=Enchantment ' +
    'Level=P4 ' +
    'Description="$RM\' Target suffers negated attack (Will -5 attack and damage) and -2 attack and damage on targeted ally for $L rd"',
  'Stone Call':
    'School=Conjuration ' +
    'Level=D2,R2,W2,Stone2 ' +
    'Description="R$RM\' 40\' radius inflicts 2d6 HP bludgeoning for 1 rd, difficult terrain for $L rd"',
  'Stone Fist':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,W1 ' +
    'Description="Self Unarmed Strikes inflict 1d%{features.Small ? 4 : 6}+%{strengthModifier} w/o AOO for $L min"',
  'Stormbolts':
    'School=Evocation ' +
    'Level=C8,D8,O8,W8,Witch8 ' +
    'Description="Targets in 30\' radius suffer 1d8 HP electricity and stunned (Fort half HP only)"',
  'Strong Jaw':
    'School=Transmutation ' +
    'Level=D4,R3 ' +
    'Description="Touched natural weapon inflicts damage as +2 size for $L min"',
  'Stumble Gap':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Description="R$RS\' 5\' square inflicts 1d6 HP and knocked prone (Ref -1 all rolls for 1 rd) for %{lvl+1} rd"',
  'Stunning Finale':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="R$RS\' End of Bardic Performance inflicts stunned 1 rd (Fort staggered 1 rd) on 3 targets in 15\' radius"',
  'Suffocation':
    'School=Necromancy ' +
    'Level=Murder5,W5,Witch5 ' +
    'Description="R$RS\' Target suffers unconsciousness next rd (Fort staggered 1 rd), then -1 HP (Fort delays 1 rd), then death (Fort delays 1 rd) for 3 rd"',
  'Mass Suffocation':
    'School=Necromancy ' +
    'Level=Murder9,W9,Witch9 ' +
    'Description="R$RS\' %{lvl//2} targets in 15\' radius suffer unconsciousness next rd (Fort staggered 1 rd), then -1 HP (Fort delays 1 rd), then death (Fort delays 1 rd) for $L rd"',
  'Summon Eidolon':
    'School=Conjuration ' +
    'Level=Summoner2 ' +
    'Description="R$RS\' Teleports eidolon companion from home plane for $L min"',
  'Swarm Skin':
    'School=Transmutation ' +
    'Level=D6,Witch6 ' +
    'Description="Self flesh transforms into controlled insect swarms until destroyed or ordered to return to bones"',
  'Thorn Body':
    'School=Transmutation ' +
    'Level=Alchemist3,D4 ' +
    'Description="Melee hits on self inflict 1d6+%{lvl<?15} HP piercing on attacker, grapple 2d6+%{lvl<?15} HP, self unarmed attack +1d6 HP for $L rd"',
  'Threefold Aspect':
    'School=Transmutation ' +
    'Level=D5,Witch4 ' +
    'Description="Self may transform freely between young (+2 Dex and Con, -2 Wis), adult (+2 Wis and Int, -2 Dex), and elderly (+4 Wis, -2 Str and Dex) for 1 dy"',
  'Thundering Drums':
    'School=Evocation ' +
    'Level=B3 ' +
    'Description="15\' cone inflicts %{lvl<?5}d8 HP sonic and knocked prone (Fort half HP only)"',
  'Timely Inspiration':
    'School=Divination ' +
    'Level=B1 ' +
    'Description="R$RS\' Target gains +%{lvl//5<?3} on failed attack or skill roll"',
  'Tireless Pursuers':
    'School=Transmutation ' +
    'Level=Inquisitor4,R3 ' +
    'Description="Self and %{lvl//3} touched gain half damage from hustling and forced march and ignore fatigue for $L hr"',
  'Tireless Pursuit':
    'School=Transmutation ' +
    'Level=Inquisitor1,R1 ' +
    'Description="Self gains half damage from hustling and forced march and ignores fatigue for $L hr"',
  'Touch Of Gracelessness':
    'School=Transmutation ' +
    'Level=B1,W1 ' +
    'Description="Touched suffers 1d6+%{lvl//2<?5} Dexterity damage, knocked prone, and half movement (Fort half Dexterity only) for $L rd"',
  'Touch Of The Sea':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,W1,Waves1 ' +
    'Description="Touched gains +30\' swim speed and +8 Swim for $L min"',
  'Transmogrify':
    'School=Transmutation ' +
    'Level=Summoner4 ' +
    'Description="Modifies eidolon and self evolutions 1/dy"',
  'Transmute Potion To Poison':
    'School=Transmutation ' +
    'Level=Alchemist2 ' +
    'Description="Self transforms 1 potion to poison for $L min"',
  'Treasure Stitching':
    'School=Transmutation ' +
    'Level=B4,C4,O4,W5 ' +
    'Description="R$RS\' Transforms objects into embroidery for $L dy"',
  'True Form':
    'School=Abjuration ' +
    'Level=D4,W4 ' +
    'Description="R$RM\' Removes polymorph effects from %{lvl//3} targets (Will neg for ability, DC 11+effect level for spells) for $L rd"',
  'Tsunami':
    'School=Conjuration ' +
    'Level=D9,Oceans9,W9,Waves9 ' +
    'Description="R$RL\' 10\'x10\'x%{lvl*2}\' wave moves 60\'/rd (water) or 30\'/rd (land), inflicts 8d6 HP bludgeoning (Fort half), +%{lvl+8+(intelligenceModifier>?charismaModifier>?wisdomModifier)} CMB to knock down and sweep away for 5 rd"',
  'Twilight Knife':
    'School=Evocation ' +
    'Level=W3,Witch3 ' +
    'Description="R$RS\' Force knife flanks and attacks (+%{baseAttack+(intelligenceModifier>?charismaModifier)}) same foe as self, inflicts 1d4 HP plus %{lvl//4}d6 HP sneak attack for $L rd"',
  'Twin Form':
    'School=Transmutation ' +
    'Level=Alchemist6 ' +
    'Description="Self splits in two and may act from either for $L rd"',
  'Unfetter':
    'School=Transmutation ' +
    'Level=Summoner1 ' +
    'Description="R$RM\' Negates eidolon distance limit and damage sharing for %{lvl*10} min"',
  'Universal Formula':
    'School=Transmutation ' +
    'Level=Alchemist4 ' +
    'Description="Extract effects self as any known level 3 extract"',
  'Unwilling Shield':
    'School=Necromancy ' +
    'Level=B5,Inquisitor5,W6,Witch6 ' +
    'Description="R$RS\' Self gains half damage and +1 AC and saves, target suffers half of self damage (Will neg) for $L rd"',
  'Unwitting Ally':
    'School=Enchantment ' +
    'Level=B0 ' +
    'Description="R$RS\' Target counts as self ally for flanking (Will neg) for 1 rd"',
  'Vanish':
    'School=Illusion ' +
    'Level=B1,W1 ' +
    'Description="Touched becomes invisible for %{lvl<?5} rd or until attacks"',
  'Veil Of Positive Energy':
    'School=Abjuration ' +
    'Level=P1 ' +
    'Description="Self gains +2 AC and +2 saves vs. undead for %{lvl*10} min; dismissal inflicts $L HP to undead in 5\' radius"',
  'Venomous Bolt':
    'School=Necromancy ' +
    'Level=R3 ' +
    'Description="Fired arrow or bold inflicts -1d3 Constitution/rd for 6 rd (Fort neg)"',
  'Versatile Weapon':
    'School=Transmutation ' +
    'Level=B2,R2,W3 ' +
    'Description="R$RS\' Target weapon bypasses DR from choice of bludgeoning, cold iron, piercing, silver, or slashing for $L min"',
  'Vomit Swarm':
    'School=Conjuration ' +
    'Level=Alchemist2,Witch2 ' +
    'Description="Self moves insect swarm that attacks all creatures for $L rd"',
  'Vortex':
    'School=Evocation ' +
    'Level=D7,W7,Waves7 ' +
    'Description="R$RL\' 15\' radius inflicts 3d6 HP bludgeoning (Ref neg), then 1d8 HP/rd for $L rd"',
  'Wake Of Light':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="10\'x120\' trail behind mount makes difficult terrain normal for good creatures and normal terrain difficult for evil creatures for $L rd"',
  'Wall Of Lava':
    'School=Conjuration ' +
    'Level=D8,W8 ' +
    'Description="R$RM\' Creates $L 5\' sq wall sections for $L rd; foe strike inflicts 2d6 HP fire, passage inflicts 20d6 HP fire, R60\' ranged touch inflicts 10d6 HP fire"',
  'Wall Of Suppression':
    'School=Abjuration ' +
    'Level=W9 ' +
    'Description="R$RM\' Creates %{lvl*2} 5\' sq wall sections that suppress passing magic effects for $L rd for %{lvl*10} min"',
  'Wandering Star Motes':
    'School=Illusion ' +
    'Level=B4,W4,Witch4 ' +
    'Description="R$RS\' Target loses any concealment and suffers dazed (Will neg and transfers 30\' to nearest foe) for $L rd"',
  'Ward The Faithful':
    'School=Abjuration ' +
    'Level=Inquisitor3 ' +
    'Description="10\' radius around touched gives +%{lvl>=18?4:lvl>?12?3:2} AC and saves to fellow deists for %{lvl*10} min"',
  'Weapon Of Awe':
    'School=Transmutation ' +
    'Level=C2,Inquisitor2,O2,P2 ' +
    'Description="Touched weapon gains +2 damage and crit hit inflicts shaken for $L min"',
  'Winds Of Vengeance':
    'School=Transmutation ' +
    'Level=C9,D9,O9,W9,Wind9,Winds9 ' +
    'Description="Self gains 60\' fly and immunity to wind, gas, and ranged weapons; inflicts on attackers 5d8 HP bludgeoning and knocked prone (Fort half HP only), for $L min"',
  'World Wave':
    'School=Transmutation ' +
    'Level=Aquatic9,D9,Exploration9,W9,Nature9 ' +
    'Description="Earth or water tsunami inflicts 6d6 HP bludgeoning for $L rd or swell inflicts 1d6 HP bludgeoning for $L hr"',
  'Wrath':
    'School=Enchantment ' +
    'Level=Inquisitor1 ' +
    'Description="Self gains +%{1>?lvl//3<?3} attack, damage, and spell resistance checks%{lvl>=12?\', plus dbl crit threat range,\':\'\'} vs. chosen foe for 1 min"',
  'Wrathful Mantle':
    'School=Evocation ' +
    'Level=C3,O3,P3 ' +
    'Description="Touched gains +%{lvl//4<?5} saves for $L min; dismissal inflicts 2d8 HP force to creatures in 5\' radius"'

};
PFAPG.SPELLS_LEVELS_ADDED = {

  'Acid Splash':'Inquisitor0',
  'Aid':'Curse2,Inquisitor2,O2,Tactics2',
  'Air Walk':'O4,Winds4',
  'Alarm':'Home1,Inquisitor1',
  'Align Weapon':'Agathion2,"Archon Good2","Archon Law2","Azata Chaos2","Azata Good2",Daemon2,"Demon Chaos2","Demon Evil2","Devil Evil2","Devil Law2",Inevitable2,Inquisitor2,O2,Proteus2',
  'Alter Self':'Witch2',
  'Analyze Dweomer':'Arcana6,Witch6',
  'Animal Shapes':'Feather7,Fur7,Nature8',
  'Animate Dead':'Bones3,O3,Souls3,Undeath3',
  'Animate Objects':'O6,Witch6',
  'Animate Plants':'Decay7,Growth7,Verdant8',
  'Animate Rope':'Construct1',
  'Antilife Shell':'Fur6,O6,Souls6',
  'Antimagic Field':'Defense6,Divine6,Purity6,O8',
  'Antipathy':'Witch8',
  'Arcane Eye':'Arcana4,Witch4',
  'Arcane Lock':'Wards1',
  'Arcane Mark':'Witch0',
  'Arcane Sight':'Inquisitor3,Witch3',
  'Astral Projection':'Dreamspun9,O9,Witch9',
  'Atonement':'Inquisitor5,O5,Purity5',
  'Augury':'Dreamspun2,Fate2,O2,Witch2',
  'Awaken':'Nature5',
  'Baleful Polymorph':'Witch5',
  'Bane':'Curse1,Inquisitor1,O1',
  'Banishment':'Inquisitor5,O6',
  'Barkskin':'Decay2,Defense2,Growth2,Nature2,Verdant2',
  "Bear's Endurance":'O2',
  'Beast Shape I':'Fur3',
  'Beast Shape III':'Feather5,Fur5',
  'Beast Shape IV':'Aquatic6',
  'Bestow Curse':'Curse3,O3,Witch3',
  'Black Tentacles':'Witch4',
  'Blade Barrier':'Blood6,Inquisitor6,O6,Tactics6',
  'Blasphemy':'Daemon7,"Demon Evil7","Devil Evil7",Inquisitor6,O7',
  'Bleed':'Inquisitor0,O0,Witch0',
  'Bless':'Family1,Inquisitor1,Leadership1,O1,Resolve1',
  'Bless Water':'Divine2,Inquisitor1,O1',
  'Bless Weapon':'Heroism2',
  'Blight':'Seasons4,Witch5',
  'Blindness/Deafness':'Loss2,Night2,O3,Witch2',
  'Blink':'Starsoul3',
  'Blur':'Protean2',
  'Break Enchantment':
    'Curse5,Fate5,Inquisitor5,O5,Restoration5,Revolution5,Witch5',
  'Breath Of Life':'Life5,O5',
  "Bull's Strength":'Ferocity2,O2,Rage2,Resolve2',
  'Burning Hands':'Ash1,Flame1,Smoke1,Witch1',
  'Call Lightning':'Catastrophe3,Seasons3,Storms3',
  'Call Lightning Storm':'Starsoul4,Storms5',
  'Calm Animals':'Feather1',
  'Calm Emotions':'Family2,Inquisitor2,O2',
  'Cause Fear':'Bones1,Daemon1,Inquisitor1,Murder1,O1,Undeath1,Witch1',
  'Chain Lightning':'Cloud6,Heavens6,Stormborn6,Witch7',
  'Chaos Hammer':'"Azata Chaos4","Demon Chaos4",Inquisitor4,O4,Proteus4',
  'Charm Animal':'Nature1',
  'Charm Monster':'Love5,Lust5,Witch4',
  'Charm Person':'Love1,Lust1,Witch1',
  'Chill Touch':'Witch1',
  'Circle Of Death':'Bones6,Inquisitor6',
  'Clairaudience/Clairvoyance':'Witch3',
  'Clenched Fist':'Ferocity8,Resolve8',
  'Clone':'Witch8',
  'Cloudkill':'Witch5',
  'Cloak Of Chaos':'"Azata Chaos8","Demon Chaos8",O8,Proteus8',
  'Color Spray':'Heavens1',
  'Command':'"Devil Evil1","Devil Law1",Inquisitor1,O1,Toil1,Witch1',
  'Command Plants':'Growth4,Verdant4',
  'Command Undead':'Inevitable3',
  'Commune':'Inquisitor5,O5',
  'Comprehend Languages':'Inquisitor1,Language1,Memory1,O1,Thought1,Witch1',
  'Cone Of Cold':'Boreal5,Ice6,Oceans6,Witch6',
  'Confusion':'Deception4,Lust4,Protean4,Thievery4,Witch4',
  'Consecrate':'Inquisitor2,O2',
  'Contact Other Plane':'Lore5,Witch5',
  'Contagion':'Decay3,O3',
  'Continual Flame':'Day2,Inquisitor3,O3',
  'Control Plants':'Decay8,Growth8',
  'Control Undead':'Bones7',
  'Control Water':'Aquatic5,Ice4,O4,Oceans4',
  'Control Weather':
    'Battle7,Catastrophe7,O7,Seasons7,Stormborn7,Storms7,Wind7,Witch7',
  'Control Winds':'Cloud5,Seasons6,Wind5,Winds5',
  'Create Food And Water':'Family3,O3',
  'Create Greater Undead':'Murder8,O8,Undeath8',
  'Create Undead':'Murder6,O6,Undeath6',
  'Create Water':'Inquisitor0,O0',
  'Creeping Doom':'Nature7',
  'Crushing Hand':'Ferocity9,Resolve9',
  'Crushing Despair':'Witch4',
  'Cure Critical Wounds':'Inquisitor4,O4,Resurrection4,Witch5',
  'Cure Light Wounds':'Inquisitor1,O1,Restoration1,Resurrection1,Witch1',
  'Cure Moderate Wounds':'Inquisitor2,O2,Resurrection2,Witch2',
  'Cure Serious Wounds':'Inquisitor3,O3,Restoration3,Resurrection3,Witch4',
  'Curse Water':'Inquisitor1,O1',
  'Dancing Lights':'Witch0',
  'Darkness':'Inquisitor2,O2',
  'Darkvision':'Deep2,Shadow2',
  'Daylight':'Day3,Heavens3,Inquisitor3,Light3,O3',
  'Daze':'Inquisitor0,Witch0',
  'Daze Monster':'Witch2',
  'Death Knell':'Inquisitor2,Murder2,O2,Witch2',
  'Death Ward':'Inquisitor4,Murder4,O4,Souls4,Witch4',
  'Deathwatch':'Ancestors1,O1,Souls1',
  'Deep Slumber':'Dreamspun3,Witch3',
  'Deeper Darkness':'Inquisitor3,Loss3,Night3,O3,Shadow3',
  'Delay Poison':'Inquisitor2,O2,Serpentine2,Witch2',
  'Demand':'Leadership8,Lust8,Martyr8,Witch8',
  'Desecrate':'Inquisitor2,O2',
  'Destruction':'Ancestors7,Murder7,O7,Souls7,Undeath7,Witch8',
  'Detect Chaos':'Inquisitor1,O1',
  'Detect Evil':'Inquisitor1,O1',
  'Detect Good':'Inquisitor1,O1',
  'Detect Law':'Inquisitor1,O1',
  'Detect Magic':'Inquisitor0,O0,Witch0',
  'Detect Poison':'Inquisitor0,O0,Witch0',
  'Detect Secret Doors':'Witch1',
  'Detect Scrying':'Inquisitor4,Witch4',
  'Detect Thoughts':'Inquisitor2,Thought2,Witch2',
  'Detect Undead':'Inquisitor1,Life1,O1',
  'Dictum':'"Archon Law7","Devil Law7",Inevitable7,Inquisitor6,O7',
  'Dimension Door':'Trade4,Witch4',
  'Dimensional Anchor':'Inquisitor3,O4,Wards4',
  'Dimensional Lock':'O8',
  'Discern Lies':'Inquisitor4,Leadership4,Martyr4,O4,Witch4',
  'Discern Location':'O8,Witch8',
  'Disguise Self':'Deception1,Inquisitor1,Thievery1',
  'Disintegrate':'Ash7,Protean6,Rage7',
  'Dismissal':'Inquisitor4,O4',
  'Dispel Chaos':'"Archon Law5","Devil Law5",Inquisitor5,O5',
  'Dispel Evil':'Agathion5,"Archon Good5","Azata Good5",Inquisitor5,O5',
  'Dispel Good':'Daemon5,"Demon Evil5","Devil Evil5",Inquisitor5,O5',
  'Dispel Law':'"Azata Chaos5","Demon Chaos5",Inquisitor5,Proteus5,O5',
  'Dispel Magic':'Arcana3,Divine3,Inquisitor3,O3,Witch3',
  'Displacement':'Proteus3',
  'Disrupt Undead':'Inquisitor0',
  'Disrupting Weapon':'Inquisitor5,O5',
  'Divination':'Dreamspun4,Inquisitor4,Memory4,O4,Thought4,Witch4',
  'Divine Favor':'"Archon Good1","Archon Law1",Inquisitor1,Martyr1,O1',
  'Divine Power':'Blood4,Inquisitor4,O4,Tactics4',
  'Dominate Monster':'Love9,Lust9,Serpentine9,Witch9',
  'Dominate Person':'Witch5',
  'Doom':'"Demon Chaos1","Demon Evil1",Inquisitor1,O1',
  'Dream':'Dreamspun5',
  "Eagle's Splendor":'O2',
  'Earthquake':'Battle8,Catastrophe8,Caves8,Deep8,O8,Rage8',
  'Elemental Body IV':'Caves7,Cloud7,Metal7,Oceans7,Smoke7,Winds7',
  'Elemental Swarm':'Caves9,Metal9,Smoke9,Witch9',
  'Endure Elements':'Day1,O1',
  'Energy Drain':'Loss9,O9,Undeath9',
  'Enervation':'Loss5,Undeath4,Witch4',
  'Enlarge Person':'Boreal1,Battle1,Ferocity1,Growth1,Witch1',
  'Entangle':'Decay1,Verdant1',
  'Enthrall':'Inquisitor2,Leadership2,Love2,O2,Revolution2,Witch2',
  'Entropic Shield':'Protean1,O1',
  'Ethereal Jaunt':'O7,Thievery7',
  'Etherealness':'O9',
  'Expeditious Retreat':'"Azata Chaos1","Azata Good1",Exploration1,Inquisitor1',
  'Explosive Runes':'Language4',
  'Eyebite':'Curse6,Witch6',
  'Fabricate':'Construct5',
  'Faerie Fire':'Light1',
  'False Life':'Bones2,Witch2',
  'False Vision':'Deception5,Thievery5',
  'Fear':'Bones4,Inquisitor4,Witch4',
  'Feather Fall':'Feather2',
  'Feeblemind':'Witch5',
  'Find The Path':'Exploration6,Inquisitor6,O6,Thought6,Trade6,Witch6',
  'Find Traps':'Inquisitor2,O2,Witch2',
  'Fire Seeds':'Ash6,Day6,Flame6,Light6,Smoke6',
  'Fire Shield':'Ash5,Day4,Light4,Smoke5',
  'Fire Storm':'Flame7,O8',
  'Fireball':'Ash3,Flame3',
  'Flame Strike':'Day5,Inquisitor5,Light5,O5',
  'Floating Disk':'Trade1',
  'Flesh To Stone':'Witch6',
  'Fly':'"Azata Chaos3","Azata Good3",Exploration3,Feather3,Trade3,Witch3',
  'Fog Cloud':'Battle2,Ice2,Seasons2,Storms2,Witch2',
  'Forbiddance':'Inquisitor6,O6',
  'Foresight':'Memory9,Thought9,Witch9',
  'Freedom':'Freedom9,Revolution9',
  'Freedom Of Movement':'Curse4,Fate4,Freedom4,Inquisitor4,O4,Revolution4',
  'Freezing Sphere':'Ice7',
  'Gaseous Form':'Cloud3,Protean3,Winds3',
  'Gate':'Heroism9,Honor9,O9,Trade9',
  'Geas/Quest':'Ancestors6,Honor6,Inquisitor5,Love6,Lust6,O6,Witch6',
  'Gentle Repose':'Ancestors2,O2,Souls2,Witch2',
  'Ghoul Touch':'Undeath2',
  'Giant Form I':'Boreal7',
  'Giant Vermin':'O4',
  'Glitterdust':'Starsoul2,Witch2',
  'Glyph Of Warding':'Home3,Inquisitor3,O3,Wards3,Witch3',
  'Goodberry':'Seasons1',
  'Grasping Hand':'Ferocity7,Resolve7',
  'Greater Arcane Sight':'Witch7',
  'Greater Command':'Inevitable5,Inquisitor5,Leadership5,Martyr5,O5,Tactics5',
  'Greater Dispel Magic':'Freedom6,Inquisitor6,O6,Witch6',
  'Greater Glyph Of Warding':'Inquisitor6,Language6,O6',
  'Greater Heroism':'Heroism6,Witch6',
  'Greater Invisibility':'Inquisitor4',
  'Greater Magic Weapon':'Inquisitor3,O4',
  'Greater Planar Ally':'O8,Tactics8',
  'Greater Polymorph':'Protean7',
  'Greater Prying Eyes':'Starsoul8,Witch8',
  'Greater Restoration':'Life7,O7',
  'Greater Scrying':'O7,Witch7',
  'Greater Shadow Evocation':'Loss8,Night8,Shadow8',
  'Greater Spell Immunity':'O8',
  'Greater Teleport':'Exploration7,Trade7,Witch7',
  'Guards And Wards':'Home7,Wards6,Witch6',
  'Guidance':'Inquisitor0,O0,Witch0',
  'Gust Of Wind':'Catastrophe2,Stormborn2,Wind2',
  'Hallow':'Inquisitor5,O5',
  'Halt Undead':'Inquisitor3',
  'Harm':'Catastrophe6,Decay6,Inquisitor6,O6,Witch7',
  'Heal':'Inquisitor6,Life6,O6,Restoration6,Resurrection6,Witch7',
  'Heat Metal':'Light2,Metal2',
  'Helping Hand':'O3',
  "Heroes' Feast":'Family6,Home6,Inquisitor6,O6,Resolve6',
  'Heroism':'Heroism3,Inquisitor3,Love4,Witch3',
  'Hide From Undead':'Inquisitor1,O1',
  'Hold Animal':'Fur2',
  'Hold Monster':'Inquisitor4,Serpentine5,Witch5',
  'Hold Person':'Inquisitor2,O2,Witch2',
  'Holy Aura':'Agathion8,"Archon Good8","Azata Good8",Heroism8,Honor8,O8',
  'Holy Smite':'Agathion4,"Archon Good4","Azata Good4",Heroism4,Honor4,Inquisitor4,O4',
  'Holy Sword':'Heroism7,Honor7',
  'Holy Word':'Agathion7,"Archon Good7","Azata Good7",Inquisitor6,O7',
  'Horrid Wilting':'Bones8,Ice8,Oceans8,Witch8',
  'Hypnotic Pattern':'Heavens2',
  'Hypnotism':'Serpentine1,Witch1',
  'Ice Storm':'Ice5,Oceans5,Seasons5,Witch4',
  'Identify':'Divine1,Lore1,Witch1',
  'Imbue With Spell Ability':'Divine4,Family4,Home4,O4',
  'Implosion':'Catastrophe9,O9,Rage9',
  'Incendiary Cloud':'Ash8,Flame8,Smoke8',
  'Inflict Critical Wounds':'Catastrophe4,Inquisitor4,O4,Rage4,Witch5',
  'Inflict Light Wounds':'Inquisitor1,O1,Witch1',
  'Inflict Moderate Wounds':'Inquisitor2,O2,Witch2',
  'Inflict Serious Wounds':'Inquisitor3,O3,Witch4',
  'Insanity':'Insanity7,Love7,Lust7,Nightmare7,Witch7',
  'Insect Plague':'O5',
  'Instant Summons':'Language7,Wards7,Witch7',
  'Invisibility':'Inquisitor2,Thievery2',
  'Invisibility Purge':'Inquisitor3,O3',
  'Iron Body':'Metal8',
  'Irresistible Dance':'Serpentine8,Witch8',
  'Keen Edge':'Inquisitor3,Murder3',
  'Knock':'Inquisitor2',
  'Legend Lore':'Inquisitor6,Lore4,Memory7,Thought7,Witch6',
  'Lesser Confusion':'Insanity1,Nightmare1,Proteus1',
  'Lesser Geas':'Inquisitor4,Witch4',
  'Lesser Planar Ally':'O4',
  'Lesser Planar Binding':'Wards5',
  'Lesser Restoration':'Inquisitor2,Life2,O2',
  'Levitate':'Witch2',
  'Light':'Inquisitor0,O0,Witch0',
  'Lightning Bolt':'Stormborn3,Witch3',
  'Limited Wish':'Construct7',
  'Locate Creature':'Exploration4,Witch4',
  'Locate Object':'Exploration2,Inquisitor3,Lore3,O3,Thievery3,Trade2,Witch3',
  'Mage Armor':'Witch1',
  "Mage's Disjunction":'Arcana9',
  'Magic Aura':'Arcana1',
  'Magic Circle Against Chaos':'Inquisitor3,O3',
  'Magic Circle Against Evil':'Inquisitor3,O3',
  'Magic Circle Against Good':'Inquisitor3,O3',
  'Magic Circle Against Law':'Inquisitor3,O3',
  'Magic Fang':'Fur1',
  'Magic Jar':'Witch5',
  'Magic Mouth':'Arcana2',
  'Magic Stone':'Caves1,Metal1,O1,Stone1',
  'Magic Vestment':'Battle3,Inquisitor3,Martyr3,O3,Resolve3,Tactics3',
  'Magic Weapon':'Blood1,Inquisitor1,O1,Tactics1',
  'Major Creation':'Construct6,Protean5,Toil6,Witch5',
  'Make Whole':'O2',
  'Mark Of Justice':'Inquisitor5,O5,Witch5',
  "Mass Bear's Endurance":'O6',
  "Mass Bull's Strength":'Battle6,Ferocity6,O6',
  'Mass Charm Monster':'Witch8',
  'Mass Cure Critical Wounds':
    'Family8,Home8,O8,Restoration8,Resurrection8,Witch9',
  'Mass Cure Light Wounds':'Inquisitor5,O5,Witch6',
  'Mass Cure Moderate Wounds':'Inquisitor6,O6,Witch7',
  'Mass Cure Serious Wounds':'O7,Witch8',
  "Mass Eagle's Splendor":'O6',
  'Mass Heal':'Life8,O9,Restoration9',
  'Mass Hold Person':'Witch7',
  'Mass Hold Monster':'Witch9',
  'Mass Inflict Critical Wounds':'O8,Witch9',
  'Mass Inflict Light Wounds':'Inquisitor5,O5,Witch6',
  'Mass Inflict Moderate Wounds':'Inquisitor6,O6,Witch7',
  'Mass Inflict Serious Wounds':'Blood7,O7,Witch8',
  'Mass Invisibility':'Deception8,Thievery8',
  "Mass Owl's Wisdom":'Lore6,O6',
  'Mass Suggestion':'Serpentine6,Witch6',
  'Maze':'Witch8',
  'Meld Into Stone':'O3,Stone3',
  'Mending':'O0,Witch0',
  'Message':'Witch0',
  'Meteor Swarm':'Boreal9,Heavens9,Starsoul9',
  'Mind Blank':'Defense8,Freedom8,Purity8,Revolution8,Thought8,Witch8',
  'Mind Fog':'Witch5',
  'Minor Creation':'Construct4,Toil4,Witch4',
  'Miracle':'Curse9,Divine9,Family9,Fate9,Home9,O9',
  'Mirror Image':'Deception2',
  'Mislead':'Deception6,Fate6,Thievery6',
  'Modify Memory':'Loss6,Memory6',
  'Moment Of Prescience':'Curse8,Dreamspun8,Fate8,Lore8,Memory8,Witch8',
  'Mount':'Witch1',
  'Neutralize Poison':'Inquisitor4,Life3,O4,Restoration4,Witch4',
  'Nightmare':'Insanity5,Night6,Nightmare5',
  'Nondetection':'Deception3,Inquisitor3',
  'Obscure Object':'Inquisitor3,O3',
  'Obscuring Mist':'Cloud1,Ice1,Loss1,O1,Oceans1,Storms1,Witch1',
  "Order's Wrath":'"Archon Law4","Devil Law4",Inevitable4,Inquisitor4,O4',
  'Overland Flight':'Heavens5,Starsoul5,Stormborn5,Trade5,Witch5',
  "Owl's Wisdom":'O2',
  'Phantasmal Killer':'Nightmare4,Witch4',
  'Phase Door':'Exploration8,Trade8,Witch7',
  'Planar Ally':'Agathion6,"Archon Good6","Archon Law6","Azata Chaos6","Azata Good6",O6',
  'Planar Binding':'Daemon6,"Demon Chaos6","Demon Evil6","Devil Evil6","Devil Law6",Inevitable6,Proteus6',
  'Plane Shift':'Freedom5,O5,Witch7',
  'Plant Growth':'Growth3',
  'Plant Shape III':'Verdant7',
  'Poison':'Decay4,O4,Serpentine4,Witch4',
  'Polar Ray':'Boreal8,Ice9',
  'Polymorph Any Object':'Construct8,Protean8',
  'Power Word Blind':'Loss7,Night7,Shadow7,Tactics7,Witch7',
  'Power Word Kill':'Blood9,Tactics9,Witch9',
  'Power Word Stun':'Blood8,Witch8',
  'Prayer':'"Archon Good3","Archon Law3",Inquisitor3,Leadership3,O3',
  'Prismatic Sphere':'Construct9,Day9,Defense9,Light9,Purity9,Toil9',
  'Prismatic Spray':'Heavens7',
  'Produce Flame':'Ash2',
  'Project Image':'Deception7',
  'Protection From Chaos':'Inevitable1,Inquisitor1,O1,Purity1',
  'Protection From Energy':'Defense3,Inquisitor3,O3',
  'Protection From Evil':'Inquisitor1,O1,Purity1',
  'Protection From Good':'Inquisitor1,O1,Purity1',
  'Protection From Law':'Inquisitor1,O1,Purity1',
  'Protection From Spells':'Arcana8,Divine8',
  'Prying Eyes':'Witch5',
  'Purify Food And Drink':'O0',
  'Pyrotechnics':'Smoke2',
  'Rage':
    'Boreal2,"Demon Chaos3","Demon Evil3",Ferocity3,Insanity3,Nightmare3,Rage3,Witch3',
  'Rainbow Pattern':'Heavens4',
  'Raise Dead':'Resurrection5,O5,Witch6',
  'Ray Of Enfeeblement':'Shadow1,Witch1',
  'Ray Of Exhaustion':'Witch3',
  'Read Magic':'Inquisitor0,O0,Witch0',
  'Reduce Person':'Witch1',
  'Refuge':'Family7,Freedom7,O7,Revolution7,Witch9',
  'Regenerate':'O7,Restoration7,Witch7',
  'Reincarnate':'Witch5',
  'Remove Blindness/Deafness':'O3,Purity3,Witch3',
  'Remove Curse':'Freedom3,Inquisitor3,O3,Revolution3,Witch3',
  'Remove Disease':'Inquisitor3,O3,Restoration2,Witch3',
  'Remove Fear':'Inquisitor1,O1,Revolution1',
  'Remove Paralysis':'Freedom2,Inquisitor2,O2',
  'Repel Metal Or Stone':'Deep7,Stone8',
  'Repel Vermin':'O4',
  'Repel Wood':'Growth6',
  'Repulsion':'Inquisitor6,Leadership7,Martyr7,O7,Purity7,Starsoul6',
  'Resist Energy':'Flame2,Inquisitor2,O2',
  'Resistance':'Inquisitor0,O0,Witch0',
  'Restoration':'Inquisitor4,Life4,O4',
  'Resurrection':'Divine7,O7,Resurrection7,Witch8',
  'Reverse Gravity':'Starsoul7',
  'Righteous Might':'Battle5,Ferocity5,Growth5,Heroism5,Honor5,Inquisitor5,O5,Resolve5',
  'Sanctuary':'Freedom1,Inquisitor1,O1',
  'Scare':'Witch2',
  'Scintillating Pattern':'Insanity8,Nightmare8',
  'Scrying':'O5,Witch4',
  'Searing Light':'Honor3,Inquisitor3,O3',
  'Secret Chest':'Witch5',
  'Secret Page':'Wards2',
  'Secure Shelter':'Witch4',
  'See Invisibility':'Inquisitor2,Witch2',
  'Sending':'Inquisitor4,O4',
  'Sepia Snake Sigil':'Witch3',
  'Shades':'Night9,Shadow9',
  'Shadow Conjuration':'Loss4,Night4,Shadow4',
  'Shadow Evocation':'Shadow5',
  'Shadow Walk':'Dreamspun6,Shadow6',
  'Shambler':'Decay9,Growth9,Verdant9',
  'Shapechange':'Feather9,Fur9,Protean9',
  'Shatter':'O2',
  'Shield':'Defense1',
  'Shield Of Faith':'Agathion1,Heroism1,Honor1,Inquisitor1,O1',
  'Shield Of Law':'"Archon Law8","Devil Law8",Inevitable8,O8',
  'Shield Other':'Home2,Inquisitor2,Martyr2,O2,Purity2',
  'Shocking Grasp':'Stormborn1',
  'Shout':'Catastrophe5,Rage5,Stormborn4',
  'Silence':'Inquisitor2,O2',
  'Slay Living':'Ancestors5,Bones5,O5,Souls5,Undeath5,Witch6',
  'Sleep':'Dreamspun1,Night1,Witch1',
  'Sleet Storm':'Storms4,Witch3',
  'Solid Fog':'Cloud4,Witch4',
  'Soul Bind':'O9,Witch9',
  'Sound Burst':'O2',
  'Speak With Dead':'Ancestors3,Inquisitor3,Memory3,O3,Witch3',
  'Speak With Plants':'Nature3,Verdant3',
  'Spectral Hand':'Witch2',
  'Spell Immunity':'Defense4,Ferocity4,Inquisitor4,O4,Purity4,Resolve4',
  'Spell Resistance':'Arcana5,Defense5,Inquisitor5,O5',
  'Spell Turning':'Arcana7,Curse7,Fate7',
  'Spike Stones':'Caves4,Deep5,Metal4',
  'Spiritual Weapon':'Blood2,Inquisitor2,O2',
  'Stabilize':'Inquisitor0,O0,Witch0',
  'Statue':'Stone7,Toil8',
  'Status':'O2,Witch2',
  'Stinking Cloud':'Smoke3,Witch3',
  'Stone Shape':'Construct3,Metal3,O3,Toil3',
  'Stone Tell':'Deep6,Nature6,Stone6',
  'Stone To Flesh':'Witch6',
  'Stoneskin':'Deep4,Inquisitor4,Stone5',
  'Storm Of Vengeance':
    'Battle9,Cloud9,Leadership9,Martyr9,O9,Seasons9,Stormborn9,Storms9,Witch9',
  'Suggestion':'"Devil Evil3","Devil Law3",Love3,Lust3,Witch3',
  'Summon Monster I':'O1,Witch1',
  'Summon Monster II':'O2,Witch2',
  'Summon Monster III':'O3,Serpentine3,Witch3',
  'Summon Monster V':'Witch5',
  'Summon Monster IV':'O4,Witch4',
  'Summon Monster IX':'Agathion9,"Archon Good9","Archon Law9","Azata Chaos9","Azata Good9",Daemon9,"Demon Chaos9","Demon Evil9","Devil Evil9","Devil Law9",Inevitable9,O9,Proteus9,Witch9',
  'Summon Monster V':'Flame5,Night5,O5',
  'Summon Monster VI':'O6,Witch6',
  'Summon Monster VII':'Aquatic7,O7,Serpentine7,Witch7',
  'Summon Monster VIII':'O8,Witch8',
  "Summon Nature's Ally IV":'Feather4,Fur4',
  "Summon Nature's Ally VIII":'Feather8,Fur8',
  'Sunbeam':'Day7,Light7',
  'Sunburst':'Day8,Heavens8,Light8,Seasons8',
  'Symbol Of Death':'Language8,O8,Wards8,Witch8',
  'Symbol Of Fear':'O6,Witch6',
  'Symbol Of Insanity':'O8,Witch8',
  'Symbol Of Pain':'O5,Witch5',
  'Symbol Of Persuasion':'O6,Revolution6,Witch6',
  'Symbol Of Sleep':'O5,Witch5',
  'Symbol Of Stunning':'O7,Witch7',
  'Symbol Of Weakness':'O7,Witch7',
  'Sympathy':'Witch8',
  'Telepathic Bond':'Family5,Home5,Inquisitor5,Language5,Thought5,Witch5',
  'Teleport':'Exploration5,Witch5',
  'Teleport Object':'Witch7',
  'Teleportation Circle':'Language9,Wards9,Witch9',
  'Time Stop':'Deception9,Lore9,Thievery9',
  'Tongues':'Agathion3,Inquisitor2,Language3,Lore2,O4,Witch3',
  'Touch Of Fatigue':'Witch0',
  'Touch Of Idiocy':'Insanity2,Lust2,Nightmare2,Witch2',
  'Transformation':'Boreal6,Witch6',
  'Transport Via Plants':'Verdant6',
  'Trap The Soul':'Souls9,Witch8',
  'True Resurrection':'Life9,O9,Resurrection9',
  'True Seeing':'Inquisitor5,Memory5,O5,Witch6',
  'True Strike':'Catastrophe1,Fate1,Inquisitor1,Rage1',
  'Undeath To Death':'Inquisitor6,O6',
  'Undetectable Alignment':'Inquisitor2,O2',
  'Unhallow':'Inquisitor5,O5',
  'Unholy Aura':'Daemon8,"Demon Evil8","Devil Evil8",O8',
  'Unholy Blight':'Daemon4,"Demon Evil4","Devil Evil4",Inquisitor4,O4',
  'Unseen Servant':'Starsoul1,Witch1',
  'Vampiric Touch':'Blood3,Daemon3,Witch3',
  'Virtue':'Inquisitor0,O0',
  'Vision':'Dreamspun7,Lore7,Witch7',
  'Wail Of The Banshee':'Ancestors9,Bones9,Witch9',
  'Wall Of Fire':'Ash4,Battle4,Flame4,Smoke4',
  'Wall Of Ice':'Boreal4,Waves4',
  'Wall Of Iron':'Metal6',
  'Wall Of Stone':'Caves5,Metal5,O5,Stone4',
  'Wall Of Thorns':'Blood5,Decay5,Verdant5',
  'Water Breathing':'Ice3,O3,Waves3',
  'Water Walk':'O3,Oceans3,Witch3',
  'Waves Of Exhaustion':'Ancestors8,Souls8,Toil7,Witch7',
  'Waves Of Fatigue':'Toil5,Witch5',
  'Web':'Witch2',
  'Weird':'Insanity9,Nightmare9',
  'Whirlwind':'Cloud8,Storms8,Stormborn8,Wind8,Winds8',
  'Whispering Wind':'Inquisitor2,Winds1',
  'Wind Walk':'O6,Winds6',
  'Wind Wall':'Cloud2,O3,Winds2',
  'Wood Shape':'Construct2,Toil2',
  'Word Of Chaos':'"Azata Chaos7","Demon Chaos7",Inquisitor6,O7,Proteus7',
  'Word Of Recall':'O6',
  'Zone Of Truth':'Honor2,Inquisitor2,O2,Witch2'
};
PFAPG.TRAITS = {
  // Already declared in Pathfinder.js
};
PFAPG.WEAPONS = {
  'Bardiche':'Level=2 Category=2h Damage=d10 Threat=19',
  'Battle Aspergillum':'Level=1 Category=Li Damage=d6',
  'Bayonet':'Level=1 Category=2h Damage=d6',
  'Bec De Corbin':'Level=2 Category=2h Damage=d10 Crit=3',
  'Bill':'Level=2 Category=2h Damage=d8 Crit=3',
  'Boar Spear':'Level=1 Category=2h Damage=d8',
  'Boomerang':'Level=3 Category=R Damage=d6 Range=30',
  'Brass Knuckles':'Level=0 Category=Un Damage=d3',
  'Cestus':'Level=1 Category=Li Damage=d4 Threat=19',
  'Chain Spear':'Level=3 Category=2h Damage=d6/d6',
  'Chakram':'Level=2 Category=R Damage=d8 Range=30',
  'Double Crossbow':'Level=3 Category=R Damage=d8 Threat=19 Range=80',
  'Falcata':'Level=3 Category=1h Damage=d8 Threat=19 Crit=3',
  'Glaive-Guisarme':'Level=2 Category=2h Damage=d10 Crit=3',
  'Khopesh':'Level=3 Category=1h Damage=d8 Threat=19',
  'Lucerne Hammer':'Level=2 Category=2h Damage=d12',
  'Mancatcher':'Level=3 Category=2h Damage=d2',
  'Pilum':'Level=2 Category=R Damage=d8 Range=20',
  'Sword Cane':'Level=2 Category=1h Damage=d6',
  'Swordbreaker Dagger':'Level=3 Category=Li Damage=d4',
  'Temple Sword':'Level=3 Category=1h Damage=d8 Threat=19',
  'Wooden Stake':'Level=1 Category=Li Damage=d4 Range=10'
};
PFAPG.CLASSES = {
  'Alchemist':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple/Bomb)",' +
      '1:Alchemy,1:Bomb,"1:Brew Potion",1:Mutagen,' +
      '"1:Throw Anything (Alchemist)",2:Discovery,"2:Poison Resistance",' +
      '"2:Poison Use","3:Swift Alchemy","6:Swift Poisoning",' +
      '"14:Persistent Mutagen","18:Instant Alchemy","20:Grand Discovery" ' +
    'Selectables=' +
      '"1:Acid Bomb:Discovery","8:Combine Extracts:Discovery",' +
      '"1:Concentrate Poison:Discovery","6:Concussive Bomb:Discovery",' +
      '"8:Delayed Bomb:Discovery",12:Dilution:Discovery,' +
      '"6:Dispelling Bomb:Discovery","16:Elixir Of Life:Discovery",' +
      '"1:Enhance Potion:Discovery","16:Eternal Potion:Discovery",' +
      '"1:Explosive Bomb:Discovery","1:Extend Potion:Discovery",' +
      '"8:Fast Bombs:Discovery:Discovery","1:Feral Mutagen:Discovery",' +
      '"1:Force Bomb:Discovery","8:Frost Bomb:Discovery",' +
      '"16:Grand Mutagen:Discovery","1:Greater Mutagen:Discovery",' +
      '"1:Infuse Mutagen:Discovery","16:Inferno Bomb:Discovery",' +
      '1:Infusion:Discovery,"12:Madness Bomb:Discovery",' +
      '"12:Poison Bomb:Discovery","1:Precise Bombs:Discovery",' +
      '"1:Shock Bomb:Discovery","1:Smoke Bomb:Discovery",' +
      '"10:Sticky Bomb:Discovery","1:Sticky Poison:Discovery",' +
      '"1:Stink Bomb:Discovery",' +
      '"20:Awakened Intellect:Grand Discovery",' +
      '"20:Eternal Youth:Grand Discovery",' +
      '"20:Fast Healing:Grand Discovery",' +
      '"20:Philosopher\'s Stone:Grand Discovery",' +
      '"20:Poison Touch:Grand Discovery",' +
      '"20:True Mutagen:Grand Discovery" ' +
    'CasterLevelArcane=levels.Alchemist ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Extract1:1=1;2=2;3=3;5=4;9=5,' +
      'Extract2:4=1;5=2;6=3;8=4;12=5,' +
      'Extract3:7=1;8=2;9=3;11=4;15=5,' +
      'Extract4:10=1;11=2;12=3;14=4;18=5,' +
      'Extract5:13=1;14=2;15=3;17=4;19=5,' +
      'Extract6:16=1;17=2;18=3;19=4;20=5 ' +
    'Skills=' +
      'Appraise,Craft,"Disable Device",Fly,Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Nature)",Perception,Profession,"Sleight Of Hand",' +
      'Spellcraft,Survival,"Use Magic Device"',
  'Cavalier':
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '1:Challenge,1:Mount,1:Order,1:Tactician,"3:Cavalier\'s Charge",' +
      '"4:Expert Trainer",5:Banner,"6:Cavalier Feat Bonus",' +
      '"9:Greater Tactician","11:Mighty Charge","12:Demanding Challenge",' +
      '"14:Greater Banner","17:Master Tactician","20:Supreme Charge",' +
      '"features.Order Of The Cockatrice ? 2:Braggart",' +
      '"features.Order Of The Cockatrice ? 8:Steal Glory",' +
      '"features.Order Of The Cockatrice ? 15:Moment Of Triumph",' +
      '"features.Order Of The Dragon ? 2:Aid Allies (Cavalier)",' +
      '"features.Order Of The Dragon ? 8:Strategy",' +
      '"features.Order Of The Dragon ? 15:Act As One",' +
      '"features.Order Of The Lion ? 2:Lion\'s Call",' +
      '"features.Order Of The Lion ? 8:For The King",' +
      '"features.Order Of The Lion ? 15:Shield Of The Liege",' +
      '"features.Order Of The Shield ? 2:Resolute",' +
      '"features.Order Of The Shield ? 8:Stem The Tide",' +
      '"features.Order Of The Shield ? 15:Protect The Meek",' +
      '"features.Order Of The Star ? 2:Calling",' +
      '"features.Order Of The Star ? 8:For The Faith",' +
      '"features.Order Of The Star ? 15:Retribution",' +
      '"features.Order Of The Sword ? 2:By My Honor",' +
      '"features.Order Of The Sword ? 8:Mounted Mastery",' +
      '"features.Order Of The Sword ? 15:Knight\'s Challenge" ' +
    'Selectables=' +
      '"1:Order Of The Cockatrice:Order","1:Order Of The Dragon:Order",' +
      '"1:Order Of The Lion:Order","1:Order Of The Shield:Order",' +
      '"1:Order Of The Star:Order","1:Order Of The Sword:Order" ' +
    'Skills=' +
      'Bluff,Climb,Craft,Diplomacy,"Handle Animal",Intimidate,Profession,' +
      'Ride,"Sense Motive",Swim',
  'Inquisitor':
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Simple/Hand Crossbow/Longbow/Repeating Crossbow/Shortbow)",' +
      '"1:Domain (Inquisitor)",1:Judgment,"1:Monster Lore",1:Orisons,' +
      '"1:Stern Gaze","2:Cunning Initiative","2:Detect Alignment",2:Track,' +
      '"3:Solo Tactics","3:Teamwork Feat",5:Bane,"5:Discern Lies",' +
      '"8:Second Judgment",11:Stalwart,"12:Greater Bane",' +
      '"14:Exploit Weakness","16:Third Judgment",17:Slayer,"20:True Judgment" '+
    'Selectables=' +
      QuilvynUtils.getKeys(Pathfinder.PATHS).filter(x => x.match(/Domain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Domain', '') + '\' ? 1:' + x + ':Domain"').join(',') + ' ' +
    'CasterLevelDivine=levels.Inquisitor ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Inquisitor0:1=4;2=5;3=6,' +
      'Inquisitor1:1=1;2=2;3=3;5=4;9=5,' +
      'Inquisitor2:4=1;5=2;6=3;8=4;12=5,' +
      'Inquisitor3:7=1;8=2;9=3;11=4;15=5,' +
      'Inquisitor4:10=1;11=2;12=3;14=4;18=5,' +
      'Inquisitor5:13=1;14=2;15=3;17=4;19=5,' +
      'Inquisitor6:16=1;17=2;18=3;19=4;20=5 ' +
    'Skills=' +
      'Bluff,Climb,Craft,Diplomacy,Disguise,Heal,Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Dungeoneering)","Knowledge (Nature)",' +
      '"Knowledge (Planes)","Knowledge (Religion)",Perception,Profession,' +
      'Ride,"Sense Motive",Spellcraft,Stealth,Survival,Swim',
  'Oracle':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Simple)",' +
      '1:Mystery,"1:Oracle\'s Curse",1:Orisons,1:Revelation ' +
    'Selectables=' +
      '"1:Battle Mystery:Mystery","1:Bones Mystery:Mystery",' +
      '"1:Flame Mystery:Mystery","1:Heavens Mystery:Mystery",' +
      '"1:Life Mystery:Mystery","1:Lore Mystery:Mystery",' +
      '"1:Nature Mystery:Mystery","1:Stone Mystery:Mystery",' +
      '"1:Waves Mystery:Mystery","1:Wind Mystery:Mystery",' +
      '"1:Clouded Vision:Curse","1:Deaf:Curse","1:Haunted:Curse",' +
      '"1:Lame:Curse","1:Tongues:Curse","1:Wasting:Curse",' +
      // Need to list Combat Healer here since it's available via two Mysteries
      '"7:Combat Healer:Battle Revelation,Life Revelation" ' +
    'CasterLevelArcane=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'O0:1=4;2=5;4=6;6=7;8=8;10=9,' +
      'O1:1=3;2=4;3=5;4=6,' +
      'O2:4=3;5=4;6=5;7=6,' +
      'O3:6=3;7=4;8=5;9=6,' +
      'O4:8=3;9=4;10=5;11=6,' +
      'O5:10=3;11=4;12=5;13=6,' +
      'O6:12=3;13=4;14=5;15=6,' +
      'O7:14=3;15=4;16=5;17=6,' +
      'O8:16=3;17=4;18=5;19=6,' +
      'O9:18=3;19=4;20=6 ' +
    'Skills=' +
      'Craft,Diplomacy,Heal,"Knowledge (History)","Knowledge (Planes)",' +
      '"Knowledge (Religion)",Profession,"Sense Motive",Spellcraft',
  'Summoner':
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '1:Cantrips,1:Eidolon,"1:Life Link (Summoner)","1:Simple Somatics",' +
      '"1:Summon Monster","2:Bond Senses","4:Shield Ally (Summoner)",' +
      '"6:Maker\'s Call",8:Transposition,10:Aspect,' +
      '"12:Greater Shield Ally (Summoner)","14:Life Bond","16:Merge Forms",' +
      '"18:Greater Aspect","20:Twin Eidolon" ' +
    'Selectables=' +
      '"1:Bite Evolution:Evolution",' +
      '"features.Limbs (Arms) Evolution || features.Limbs (Legs) Evolution ? 1:Claws Evolution:Evolution",' +
      '"1:Climb Evolution:Evolution","1:Gills Evolution:Evolution",' +
      '"1:Improved Damage Evolution:Evolution",' +
      '"1:Improved Natural Armor Evolution:Evolution",' +
      '"1:Magic Attacks Evolution:Evolution",' +
      '"animalCompanion.Quadruped Eidolon || animalCompanion.Serpentine Eidolon ? 1:Mount Evolution:Evolution",' +
      '"features.Limbs (Arms) Evolution ? 1:Pincers Evolution:Evolution",' +
      '"animalCompanion.Quadruped Eidolon ? 1:Pounce Evolution:Evolution",' +
      '"1:Pull Evolution:Evolution","1:Push Evolution:Evolution",' +
      '"1:Reach Evolution:Evolution","1:Resistance Evolution:Evolution",' +
      '"1:Scent Evolution:Evolution","1:Skilled Evolution:Evolution",' +
      '"features.Limbs (Arms) Evolution ? 1:Slam Evolution:Evolution",' +
      '"1:Small Eidolon:Evolution:0",' +
      '"features.Tail Evolution ? 1:Sting Evolution:Evolution",' +
      '"1:Swim Evolution:Evolution",' +
      '"1:Tail Evolution:Evolution",' +
      '"features.Tail Evolution ? 1:Tail Slap Evolution:Evolution",' +
      '"1:Tentacle Evolution:Evolution",' +
      '"features.Flight Evolution ? 1:Wing Buffet Evolution:Evolution",' +
      '"1:Ability Increase Evolution:Evolution:2",' +
      '"animalCompanion.Serpentine Eidolon ? 1:Constrict Evolution:Evolution:2",' +
      '"5:Energy Attacks Evolution:Evolution:2",' +
      '"5:Flight Evolution:Evolution:2","1:Gore Evolution:Evolution:2",' +
      '"1:Grab Evolution:Evolution:2",' +
      '"7:Immunity Evolution:Evolution:2",' +
      '"1:Limbs (Arms) Evolution:Evolution:2",' +
      '"1:Limbs (Legs) Evolution:Evolution:2",' +
      '"7:Poison Evolution:Evolution:2",' +
      '"4:Rake Evolution:Evolution:2","6:Rend Evolution:Evolution:2",' +
      '"animalCompanion.Biped Eidolon || animalCompanion.Quadruped Eidolon ? 1:Trample Evolution:Evolution:2",' +
      '"7:Tremorsense Evolution:Evolution:2",' +
      '"features.Bite Evolution ? 1:Trip Evolution:Evolution:2",' +
      '"1:Weapon Training Evolution:Evolution:2",' +
      '"9:Blindsense Evolution:Evolution:3","9:Burrow Evolution:Evolution:3",' +
      '"9:Damage Reduction Evolution:Evolution:3",' +
      '"11:Frightful Presence Evolution:Evolution:3",' +
      '"features.Grab Evolution ? 9:Swallow Whole Evolution:Evolution:3",' +
      '"features.Climb Evolution ? 7:Web Evolution:Evolution:3",' +
      '"features.Blindsense Evolution ? 11:Blindsight Evolution:Evolution:4",' +
      '"9:Breath Weapon Evolution:Evolution:4",' +
      '"11:Fast Healing Evolution:Evolution:4",' +
      '"8:Large Evolution:Evolution:4",' +
      '"9:Spell Resistance Evolution:Evolution:4",' +
      '"features.Large Evolution ? 13:Huge Evolution:Evolution:6" ' +
    'CasterLevelArcane=levels.Summoner ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Summoner0:1=4;2=5;3=6,' +
      'Summoner1:1=1;2=2;3=3;5=4;9=5,' +
      'Summoner2:4=1;5=2;6=3;8=4;12=5,' +
      'Summoner3:7=1;8=2;9=3;11=4;15=5,' +
      'Summoner4:10=1;11=2;12=3;14=4;18=5,' +
      'Summoner5:13=1;14=2;15=3;17=4;19=5,' +
      'Summoner6:16=1;17=2;18=3;19=4;20=5 ' +
    'Skills=' +
      'Craft,Fly,"Handle Animal",Knowledge,Linguistics,Profession,Ride,' +
      'Spellcraft,"Use Magic Device"',
  'Witch':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '1:Cantrips,1:Hex,1:Patron,"1:Witch\'s Familiar" ' +
    'Selectables=' +
      '"1:Agility Patron:Patron","1:Animals Patron:Patron",' +
      '"1:Deception Patron:Patron","1:Elements Patron:Patron",' +
      '"1:Endurance Patron:Patron","1:Plague Patron:Patron",' +
      '"1:Shadow Patron:Patron","1:Strength Patron:Patron",' +
      '"1:Transformation Patron:Patron","1:Trickery Patron:Patron",' +
      '"1:Water Patron:Patron","1:Wisdom Patron:Patron",' +
      '"1:Blight Hex:Hex",' +
      '"1:Cackle Hex:Hex",' +
      '"1:Cauldron Hex:Hex",' +
      '"1:Charm Hex:Hex",' +
      '"1:Coven Hex:Hex",' +
      '"1:Disguise Hex:Hex",' +
      '"1:Evil Eye Hex:Hex",' +
      '"1:Flight Hex:Hex",' +
      '"1:Fortune Hex:Hex",' +
      '"1:Healing Hex:Hex",' +
      '"1:Misfortune Hex:Hex",' +
      '"1:Slumber Hex:Hex",' +
      '"1:Tongues Hex:Hex",' +
      '"1:Ward Hex:Hex",' +
      '"10:Agony Hex:Hex",' +
      '"10:Hag\'s Eye Hex:Hex",' +
      '"10:Major Healing Hex:Hex",' +
      '"10:Nightmares Hex:Hex",' +
      '"10:Retribution Hex:Hex",' +
      '"10:Vision Hex:Hex",' +
      '"10:Waxen Image Hex:Hex",' +
      '"10:Weather Control Hex:Hex",' +
      '"18:Death Curse Hex:Hex",' +
      '"18:Eternal Slumber Hex:Hex",' +
      '"18:Forced Reincarnation Hex:Hex",' +
      '"18:Life Giver Hex:Hex",' +
      '"18:Natural Disaster Hex:Hex" ' +
    'CasterLevelArcane=levels.Witch ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Witch0:1=3;2=4,' +
      'Witch1:1=1;2=2;4=3;7=4,' +
      'Witch2:3=1;4=2;6=3;9=4,' +
      'Witch3:5=1;6=2;8=3;11=4,' +
      'Witch4:7=1;8=2;10=3;13=4,' +
      'Witch5:9=1;10=2;12=3;15=4,' +
      'Witch6:11=1;12=2;14=3;17=4,' +
      'Witch7:13=1;14=2;16=3;19=4,' +
      'Witch8:15=1;16=2;18=3;20=4,' +
      'Witch9:17=1;18=2;19=3;20=4 ' +
    'Skills=' +
      'Craft,Fly,Heal,Intimidate,"Knowledge (Arcana)","Knowledge (History)",' +
      '"Knowledge (Nature)","Knowledge (Planes)",Profession,Spellcraft,' +
      '"Use Magic Device"',
  'Barbarian':
    'Selectables=' +
      '"features.Lesser Beast Totem ? 6:Beast Totem",' +
      '"features.Beast Totem ? 10:Greater Beast Totem",' +
      '"2:Lesser Beast Totem",' +
      '"6:Boasting Taunt",' +
      '"2:Brawler",' +
      '"features.Brawler ? 2:Greater Brawler",' +
      '"features.Lesser Chaos Totem ? 6:Chaos Totem",' +
      '"features.Chaos Totem ? 10:Greater Chaos Totem",' +
      '"2:Lesser Chaos Totem",' +
      '"12:Come And Get Me",' +
      '"features.Superstition ? 8:Disruptive",' +
      '"features.Lesser Elemental Rage ? 8:Elemental Rage",' +
      '"features.Elemental Rage ? 12:Greater Elemental Rage",' +
      '"4:Lesser Elemental Rage",' +
      '"features.Greater Energy Resistance ? 12:Energy Absorption (Rage)",' +
      '"features.Energy Absorption (Rage) ? 16:Energy Eruption",' +
      '"2:Energy Resistance",' +
      '"features.Energy Resistance ? 8:Greater Energy Resistance",' +
      '"2:Ferocious Mount",' +
      '"features.Ferocious Mount ? 8:Greater Ferocious Mount",' +
      '"features.Ferocious Mount ? 8:Ferocious Trample",' +
      '"features.Ferocious Trample ? 12:Greater Ferocious Trample",' +
      '"features.Lesser Fiend Totem ? 6:Fiend Totem",' +
      '"features.Fiend Totem ? 10:Greater Fiend Totem",' +
      '"2:Lesser Fiend Totem",' +
      '"10:Flesh Wound",' +
      '"2:Good For What Ails You",' +
      '"6:Ground Breaker",' +
      '"6:Guarded Life",' +
      '"features.Lesser Hurling ? 8:Hurling",' +
      '"features.Hurling ? 12:Greater Hurling",' +
      '"2:Lesser Hurling",' +
      '"features.Lesser Hurling ? 8:Hurling Charge",' +
      '"features.Reckless Abandon ? 2:Inspire Ferocity",' +
      '2:Knockdown,' +
      '"2:Liquid Courage",' +
      '"2:Overbearing Advance",' +
      '"features.Overbearing Advance ? 6:Overbearing Onslaught",' +
      '"2:Reckless Abandon",' +
      '"2:Roaring Drunk",' +
      '2:Smasher,' +
      '"features.Disruptive ? 12:Spellbreaker",' +
      '"features.Ferocious Mount ? 6:Spirit Steed",' +
      '"features.Lesser Spirit Totem ? 6:Spirit Totem",' +
      '"features.Spirit Totem ? 10:Greater Spirit Totem",' +
      '"2:Lesser Spirit Totem",' +
      '"2:Staggering Drunk",' +
      '"features.Superstition ? 2:Witch Hunter",' +
      '"1:Breaker:Archetype",' +
      '"1:Brutal Pugilist:Archetype",' +
      '"1:Core Barbarian:Archetype",' +
      '"1:Drunken Brute:Archetype",' +
      '"1:Elemental Kin:Archetype",' +
      '"1:Hurler:Archetype",' +
      '"1:Invulnerable Rager:Archetype",' +
      '"1:Mounted Fury:Archetype",' +
      '"1:Savage Barbarian:Archetype",' +
      '"1:Superstitious:Archetype",' +
      '"1:Totem Warrior:Archetype"',
  'Bard':
    'Selectables=' +
      '"1:Arcane Duelist:Archetype",' +
      '"1:Archivist:Archetype",' +
      '"1:Core Bard:Archetype",' +
      '"1:Court Bard:Archetype",' +
      '"1:Detective:Archetype",' +
      '"1:Magician:Archetype",' +
      '"1:Sandman:Archetype",' +
      '"1:Savage Skald:Archetype",' +
      '"1:Sea Singer:Archetype",' +
      '"1:Street Performer:Archetype",' +
      // Need to list Bonded Object here since it's available via two Archetypes
      '"1:Bonded Object:Arcane Bond"',
  'Cleric':
    'Selectables=' +
      QuilvynUtils.getKeys(PFAPG.PATHS).filter(x => x.match(/Subdomain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Subdomain', '') + '\' ? 1:' + x + '"').join(','),
  'Druid':
    'Selectables=' +
      '"1:Aquatic Druid:Archetype",' +
      '"1:Arctic Druid:Archetype",' +
      '"1:Blight Druid:Archetype",' +
      '"1:Cave Druid:Archetype",' +
      '"1:Core Druid:Archetype",' +
      '"1:Desert Druid:Archetype",' +
      '"1:Jungle Druid:Archetype",' +
      '"1:Mountain Druid:Archetype",' +
      '"1:Plains Druid:Archetype",' +
      '"1:Swamp Druid:Archetype",' +
      '"1:Urban Druid:Archetype",' +
      '"1:Animal Shaman:Archetype",' +
      '"features.Blight Druid ? 1:Familiar:Nature Bond",' +
      '"features.Blight Druid || features.Cave Druid ? 1:Darkness Domain:Nature Bond",' +
      '"features.Blight Druid ? 1:Death Domain:Nature Bond",' +
      '"features.Blight Druid ? 1:Destruction Domain:Nature Bond"',
  'Fighter':
    'Selectables=' +
      '"1:Archer:Archetype",' + 
      '"1:Core Fighter:Archetype",' + 
      '"1:Crossbowman:Archetype",' + 
      '"1:Free Hand Fighter:Archetype",' + 
      '"1:Mobile Fighter:Archetype",' + 
      '"1:Phalanx Soldier:Archetype",' + 
      '"1:Polearm Master:Archetype",' + 
      '"1:Roughrider:Archetype",' + 
      '"1:Savage Warrior:Archetype",' + 
      '"1:Shielded Fighter:Archetype",' + 
      '"1:Two-Handed Fighter:Archetype",' + 
      '"1:Two-Weapon Warrior:Archetype",' + 
      '"1:Weapon Master:Archetype"',
  'Monk':
    'Selectables=' +
      '"1:Core Monk:Archetype",' +
      '"1:Drunken Master:Archetype",' +
      '"1:Hungry Ghost Monk:Archetype",' +
      '"1:Ki Mystic:Archetype",' +
      '"1:Monk Of The Empty Hand:Archetype",' +
      '"1:Monk Of The Four Winds:Archetype",' +
      '"1:Monk Of The Healing Hand:Archetype",' +
      '"1:Monk Of The Lotus:Archetype",' +
      '"1:Monk Of The Sacred Mountain:Archetype",' +
      '"1:Weapon Adept:Archetype",' +
      '"1:Zen Archer:Archetype"',
  'Paladin':
    'Selectables=' +
      '"1:Core Paladin:Archetype",' +
      '"1:Divine Defender:Archetype",' +
      '"1:Hospitaler:Archetype",' +
      '"1:Sacred Servant:Archetype",' +
      '"1:Shining Knight:Archetype",' +
      '"1:Undead Scourge:Archetype",' +
      '"1:Warrior Of The Holy Light:Archetype",' +
      '"features.Divine Defender ? 5:Divine Armor:Divine Bond",' +
      '"features.Sacred Servant ? 5:Divine Holy Symbol:Divine Bond"',
  'Ranger':
    'Selectables=' +
      '"2:Combat Style (Crossbow):Combat Style",' +
      '"2:Combat Style (Mounted Combat):Combat Style",' +
      '"2:Combat Style (Natural Weapon):Combat Style",' +
      '"2:Combat Style (Two-Handed Weapon):Combat Style",' +
      '"2:Combat Style (Weapon And Shield):Combat Style",' +
      '"2:Deadly Aim:Crossbow Feat",' +
      '"2:Focused Shot:Crossbow Feat",' +
      '"2:Rapid Reload:Crossbow Feat",' +
      '"6:Crossbow Mastery:Crossbow Feat",' +
      // Crossbow feats that duplicate other styles handled by classRulesExtra
      '"2:Mounted Combat:Mounted Combat Feat",' +
      '"2:Mounted Archery:Mounted Combat Feat",' +
      '"2:Ride-By Attack:Mounted Combat Feat",' +
      '"6:Mounted Shield:Mounted Combat Feat",' +
      '"6:Spirited Charge:Mounted Combat Feat",' +
      '"10:Mounted Skirmisher:Mounted Combat Feat",' +
      '"10:Unseat:Mounted Combat Feat",' +
      '"2:Aspect Of The Beast:Natural Weapon Feat",' +
      '"2:Improved Natural Weapon:Natural Weapon Feat",' +
      '"2:Rending Claws:Natural Weapon Feat",' +
      '"2:Weapon Focus:Natural Weapon Feat",' +
      '"6:Eldritch Fangs:Natural Weapon Feat",' +
      '"6:Vital Strike:Natural Weapon Feat",' +
      '"10:Multiattack:Natural Weapon Feat",' +
      '"10:Improved Vital Strike:Natural Weapon Feat",' +
      '"2:Cleave:Two-Handed Weapon Feat",' +
      '"2:Power Attack:Two-Handed Weapon Feat",' +
      '"2:Pushing Assault:Two-Handed Weapon Feat",' +
      '"2:Shield Of Swings:Two-Handed Weapon Feat",' +
      '"6:Furious Focus:Two-Handed Weapon Feat",' +
      '"6:Great Cleave:Two-Handed Weapon Feat",' +
      '"10:Dreadful Carnage:Two-Handed Weapon Feat",' +
      '"10:Improved Sunder:Two-Handed Weapon Feat",' +
      '"2:Shield Focus:Weapon And Shield Feat",' +
      '"2:Shield Slam:Weapon And Shield Feat",' +
      '"6:Saving Shield:Weapon And Shield Feat",' +
      '"6:Shield Master:Weapon And Shield Feat",' +
      '"10:Bashing Finish:Weapon And Shield Feat",' +
      '"10:Greater Shield Focus:Weapon And Shield Feat",' +
      // W&S feats that duplicate other styles handled by classRulesExtra
      '"1:Beast Master:Archetype",' +
      '"1:Core Ranger:Archetype",' +
      '"1:Guide:Archetype",' +
      '"1:Horse Lord:Archetype",' +
      '"1:Infiltrator:Archetype",' +
      '"1:Shapeshifter:Archetype",' +
      '"1:Skirmisher:Archetype",' +
      '"1:Spirit Ranger:Archetype",' +
      '"1:Urban Ranger:Archetype",' +
      '"3:Form Of The Bear:Shifter\'s Blessing",' +
      '"3:Form Of The Cat:Shifter\'s Blessing",' +
      '"3:Form Of The Dragon:Shifter\'s Blessing",' +
      '"3:Form Of The Eagle:Shifter\'s Blessing",' +
      '"3:Form Of The Jackal:Shifter\'s Blessing",' +
      '"3:Form Of The Otter:Shifter\'s Blessing",' +
      '"3:Aiding Attack:Hunter\'s Trick",' +
      '"3:Bolster Companion:Hunter\'s Trick",' +
      '"3:Catfall:Hunter\'s Trick",' +
      '"3:Chameleon Step:Hunter\'s Trick",' +
      '"3:Cunning Pantomime:Hunter\'s Trick",' +
      '"3:Defensive Bow Stance:Hunter\'s Trick",' +
      '"3:Deft Stand:Hunter\'s Trick",' +
      '"3:Distracting Attack:Hunter\'s Trick",' +
      '"3:Hateful Attack:Hunter\'s Trick",' +
      '"3:Heel:Hunter\'s Trick",' +
      '"3:Hobbling Attack:Hunter\'s Trick",' +
      '"3:Quick Climb:Hunter\'s Trick",' +
      '"3:Quick Healing:Hunter\'s Trick",' +
      '"3:Quick Swim:Hunter\'s Trick",' +
      '"3:Ranger\'s Counsel:Hunter\'s Trick",' +
      '"3:Rattling Strike:Hunter\'s Trick",' +
      '"3:Second Chance Strike:Hunter\'s Trick",' +
      '"3:Sic \'em:Hunter\'s Trick",' +
      '"3:Skill Sage:Hunter\'s Trick",' +
      '"3:Stag\'s Leap:Hunter\'s Trick",' +
      '"3:Surprise Shift:Hunter\'s Trick",' +
      '"3:Tangling Attack:Hunter\'s Trick",' +
      '"3:Trick Shot:Hunter\'s Trick",' +
      '"3:Uncanny Senses:Hunter\'s Trick",' +
      '"3:Upending Strike:Hunter\'s Trick",' +
      '"3:Vengeance Strike:Hunter\'s Trick"',
  'Rogue':
    'Selectables=' +
      '"Assault Leader","Befuddling Strike","Camouflage (Rogue)",' +
      '"Canny Observer",Charmer,"Coax Information","Combat Swipe",' +
      '"Cunning Trigger","Distracting Attack (Rogue)","Expert Leaper",' +
      '"Fast Fingers","Fast Getaway","Fast Picks","Follow Clues",' +
      '"Guileful Polyglot","Hard To Fool","Honeyed Words","Lasting Poison",' +
      '"Nimble Climber","Offensive Defense","Peerless Maneuver",' +
      '"Positioning Attack","Powerful Sneak","Quick Disguise",' +
      '"Quick Trapsmith","Snap Shot","Sniper\'s Eye","Strong Impression",' +
      'Survivalist,"Swift Poison","10:Another Day","10:Deadly Cocktail",' +
      '"10:Entanglement Of Blades","10:Fast Tumble","10:Frugal Trapsmith",' +
      '"10:Hunter\'s Surprise","10:Knock-Out Blow","10:Master Of Disguise",' +
      '"10:Redirect Attack","10:Stealthy Sniper","10:Thoughtful Reexamining",' +
      '"features.Powerful Sneak ? 10:Deadly Sneak",' +
      '"1:Acrobat:Archetype",' +
      '"1:Burglar:Archetype",' +
      '"1:Core Rogue:Archetype",' +
      '"1:Cutpurse:Archetype",' +
      '"1:Investigator:Archetype",' +
      '"1:Poisoner:Archetype",' +
      '"1:Rake:Archetype",' +
      '"1:Scout:Archetype",' +
      '"1:Sniper:Archetype",' +
      '"1:Spy:Archetype",' +
      '"1:Swashbuckler:Archetype",' +
      '"1:Thug:Archetype",' +
      '"1:Trapsmith:Archetype"',
  'Sorcerer':
    'Selectables=' +
      '"1:Bloodline Aquatic:Bloodline",' +
      '"1:Bloodline Boreal:Bloodline",' +
      '"1:Bloodline Deep Earth:Bloodline",' +
      '"1:Bloodline Dreamspun:Bloodline",' +
      '"1:Bloodline Protean:Bloodline",' +
      '"1:Bloodline Serpentine:Bloodline",' +
      '"1:Bloodline Shadow:Bloodline",' +
      '"1:Bloodline Starsoul:Bloodline",' +
      '"1:Bloodline Stormborn:Bloodline",' +
      '"1:Bloodline Verdant:Bloodline"',
  'Wizard':
    'Selectables=' +
      QuilvynUtils.getKeys(PFAPG.SCHOOLS).map(x => '"1:School Specialization (' + x + '):Specialization"').join(',')
};
PFAPG.PRESTIGE_CLASSES = {
  'Battle Herald':
    'Require=' +
      '"baseAttack >= 4",' +
      '"features.Challenge","features.Inspire Courage",' +
      '"skills.Diplomacy >= 5","skills.Intimidate >= 5",' +
      '"skills.Perform (Oratory) >= 5","skills.Profession (Soldier) >= 2" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Bluff,Craft,Diplomacy,"Handle Animal",Heal,Intimidate,' +
      '"Knowledge (Engineering)","Knowledge (History)","Knowledge (Local)",' +
      '"Knowledge (Nobility)",Perception,Profession,Ride,"Sense Motive" ' +
    'Features=' +
      '"1:Inspiring Command","1:Improved Leadership","1:Voice Of Authority",' +
      '"2:Easy March","4:Inspire Greatness",5:Banner,' +
      '"6:Battle Herald Feat Bonus","7:Demanding Challenge",' +
      '"8:Persistent Commands","9:Inspire Last Stand","10:Complex Commands"',
  'Holy Vindicator':
    'Require=' +
      '"baseAttack >= 5",' +
      '"features.Channel Energy",' +
      '"skills.Knowledge (Religion) >= 5",' +
      '"features.Alignment Channel || features.Elemental Channel",' +
      '"casterLevelDivine >= 1" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,Heal,Intimidate,"Knowledge (Planes)","Knowledge (Religion)",' +
      'Ride,"Sense Motive",Spellcraft,Swim ' +
    'Features=' +
      '"1:Channel Energy","1:Vindicator\'s Shield",2:Stigmata,' +
      '"2:Caster Level Bonus","3:Faith Healing","4:Divine Wrath",5:Bloodfire,' +
      '"5:Channel Smite","6:Versatile Channel","7:Divine Judgment",' +
      '9:Bloodrain,"10:Divine Retribution"',
  'Horizon Walker':
    'Require=' +
      '"skills.Knowledge (Geography) >= 6",' +
      '"features.Endurance" ' +
    'HitDie=d10 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Diplomacy,"Handle Animal","Knowledge (Geography)",' +
      '"Knowledge (Nature)","Knowledge (Planes)",Linguistics,Perception,' +
      'Stealth,Survival,Swim ' +
    'Features=' +
      '"1:Favored Terrain","2:Terrain Mastery","3:Terrain Dominance",' +
      '"10:Master Of All Lands"',
  'Master Chymist':
    'Require=' +
      '"spellSlots.Extract3 >= 1",' +
      'features.Mutagen,"features.Feral Mutagen||features.Infuse Mutagen" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Climb,"Escape Artist",Intimidate,' +
      '"Knowledge (Dungeoneering)","Sense Motive",Stealth,Swim ' +
    'Features=' +
      '1:Bomb-Thrower,"1:Mutagenic Form",1:Mutate,"2:Advanced Mutagen",' +
      '"2:Caster Level Bonus",3:Brutality',
  'Master Spy':
    'Require=' +
      'features.Deceitful,"features.Iron Will",' +
      '"skills.Bluff >= 7","skills.Disguise >= 7","skills.Perception >= 5",' +
      '"skills.Sense Motive >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Bluff,Diplomacy,"Disable Device",Disguise,"Escape Artist",Knowledge,' +
      'Linguistics,Perception,"Sense Motive","Sleight Of Hand",Stealth,' +
      '"Use Magic Device" ' +
    'Features=' +
      '"1:Art Of Deception","1:Master Of Disguise","1:Sneak Attack",' +
      '"2:Glib Lie","2:Mask Alignment","3:Nonmagical Aura",' +
      '"3:Superficial Knowledge","4:Concealed Thoughts","4:Quick Change",' +
      '"5:Elude Detection","5:Slippery Mind","6:Shift Alignment",' +
      '"8:Death Attack","8:Fool Casting","9:Hidden Mind",10:Assumption',
  'Nature Warden':
    'Require=' +
      '"baseAttack >= 4",' +
      '"features.Animal Companion","features.Favored Terrain",' +
      '"features.Wild Empathy",' +
      '"skills.Handle Animal >= 5","skills.Knowledge (Geography) >= 5",' +
      '"skills.Knowledge (Nature) >= 5","skills.Survival >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,"Handle Animal",Heal,"Knowledge (Geography)",' +
      '"Knowledge (Nature)",Perception,Ride,"Sense Motive",Survival,Swim ' +
    'Features=' +
      '"1:Companion Bond","1:Natural Empathy","2:Mystic Harmony",' +
      '"2:Wild Stride","2:Caster Level Bonus","3:Animal Speech",4:Silverclaw,' +
      '"5:Favored Terrain",5:Survivalist,6:Woodforging,"7:Companion Walk",' +
      '"7:Plant Speech",8:Ironpaw,"9:Guarded Lands","10:Companion Soul"',
  'Rage Prophet':
    'Require=' +
      '"baseAttack >= 5",' +
      '"features.Oracle\'s Curse","features.Moment Of Clarity",' +
      '"skills.Knowledge (Religion) >= 5",' +
      '"casterLevelDivine >= 1" ' +
    'HitDie=d10 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,Heal,Intimidate,"Knowledge (History)","Knowledge (Religion)",' +
      '"Sense Motive",Spellcraft,Swim ' +
    'Features=' +
      '"1:Savage Seer","1:Spirit Guide","2:Rage Prophet Mystery",' +
      '"2:Raging Healer","2:Caster Level Bonus","3:Indomitable Caster",' +
      '4:Ragecaster,"5:Spirit Guardian","6:Enduring Rage",' +
      '"8:Raging Spellstrength","9:Spirit Warrior","10:Greater Rage"',
  'Stalwart Defender':
    'Require=' +
      '"baseAttack >= 7",' +
      'features.Dodge,features.Endurance,features.Toughness,' +
      '"Armor Proficiency (Medium) || Armor Proficiency (Heavy)" ' +
    'HitDie=d12 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Acrobatics,Climb,Intimidate,Perception,"Sense Motive" ' +
    'Features=' +
      '"1:AC Bonus","1:Defensive Stance","2:Defensive Power",' +
      '"3:Uncanny Dodge","5:Damage Reduction","7:Improved Uncanny Dodge",' +
      '"9:Mobile Defense","10:Last Word"'
};
PFAPG.DEITIES = {
  // clerics with no deity still get two domains.
  'None':'Domain="' + QuilvynUtils.getKeys(PFAPG.PATHS).filter(x => x.match(/Subdomain$/)).map(x => x.replace(' Subdomain', '')).join('","') + '"',
  'Abadar':
    'Domain=Defense,Inevitable,Leadership,Martyr,Metal,Trade',
  'Asmodeus':
    'Domain=Arcana,Ash,Deception,"Devil Evil","Devil Law",Divine,Smoke',
  'Calistria':
    'Domain="Azata Chaos",Curse,Deception,Lust,Memory,Thievery',
  'Cayden Cailean':
    'Domain="Azata Chaos","Azata Good",Exploration,Ferocity,Love,Lust,Resolve',
  'Desna':
    'Domain="Azata Chaos","Azata Good",Curse,Exploration,Fate,Freedom,Revolution',
  'Erastil':
    'Domain="Archon Good","Archon Law",Family,Feather,Fur,Growth,Home',
  'Gorum':
    'Domain=Blood,Ferocity,Proteus,Rage,Resolve,Tactics',
  'Gozreh':
    'Domain=Cloud,Decay,Growth,Oceans,Seasons,Wind',
  'Iomedae':
    'Domain="Archon Good","Archon Law",Day,Heroism,Honor,Light,Tactics',
  'Irori':
    'Domain=Inevitable,Language,Memory,Restoration,Resolve,Thought',
  'Lamashtu':
    'Domain=Deception,"Demon Chaos","Demon Evil",Ferocity,Insanity,Nightmare,Thievery',
  'Nethys':
    'Domain=Arcana,Catastrophe,Divine,Defense,Thought,Wards',
  'Norgorber':
    'Domain=Daemon,Deception,Memory,Murder,Thievery,Thought',
  'Pharasma':
    'Domain=Ancestors,Ice,Memory,Murder,Thievery,Thought',
  'Rovagug':
    'Domain=Blood,Catastrophe,"Demon Chaos","Demon Evil",Proteus,Rage,Storms',
  'Sarenrae':
    'Domain=Agathion,Day,Heroism,Light,Restoration,Resurrection',
  'Shelyn':
    'Domain=Agathion,Cloud,Defense,Fate,Love,Purity',
  'Torag':
    'Domain="Archon Good","Archon Law",Caves,Construct,Defense,Metal,Toil',
  'Urgathoa':
    'Domain=Blood,Daemon,Divine,Ferocity,Murder,Undeath',
  'Zon-Kuthon':
    'Domain=Catastrophe,"Devil Evil","Devil Law",Loss,Murder,Night,Undeath'
};

/* Defines rules related to animal companions and familiars. */
PFAPG.aideRules = function(rules, companions, familiars) {
  Pathfinder.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by Pathfinder method
};

/* Defines rules related to combat. */
PFAPG.combatRules = function(rules, armors, shields, weapons) {
  Pathfinder.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by Pathfinder method
};

/* Defines rules related to basic character identity. */
PFAPG.identityRules = function(
  rules, alignments, classes, deities, factions, paths, races, tracks, traits,
  prestigeClasses, npcClasses
) {
  let newClasses = Object.assign({}, classes);
  for(let clas in classes) {
    let hitDie = QuilvynUtils.getAttrValue(classes[clas], 'HitDie');
    let selectables =
      QuilvynUtils.getAttrValueArray(classes[clas], 'Selectables');
    if(!hitDie) {
      QuilvynRules.featureListRules
        (rules, selectables, clas, 'levels.' + clas, true);
      delete newClasses[clas];
    }
  }
  // PFAPG defines no new races, but this code supports the possibility anyway
  let newRaces = Object.assign({}, races);
  for(let race in races) {
    let features = QuilvynUtils.getAttrValue(races[race], 'Features');
    let selectables =
      QuilvynUtils.getAttrValueArray(races[race], 'Selectables');
    if(!features) {
      QuilvynRules.featureListRules
        (rules, selectables, race, race.charAt(0).toLowerCase() + race.substring(1).replaceAll(' ' , '') + 'Level', true);
      delete newRaces[race];
    }
  }
  Pathfinder.identityRules(
    rules, alignments, newClasses, {}, factions, paths, newRaces, tracks,
    traits, prestigeClasses, npcClasses
  );
  if('Summoner' in newClasses) {
    let summonerSelectables =
      QuilvynUtils.getAttrValueArray(newClasses.Summoner, 'Selectables');
    summonerSelectables.forEach(s => {
      let pieces = s.split(':');
      if(pieces.length > 3 &&
         pieces[2] == 'Evolution' &&
         pieces[3].match(/^\d+$/) &&
         pieces[3] != '1') {
        rules.defineRule('selectableFeatures.excessEvolutionPoints',
          'selectableFeatures.Summoner - ' + pieces[1], '+=', 'source * ' + (pieces[3] - 1)
        );
      }
    });
  }
  for(let clas in classes)
    PFAPG.classRulesExtra(rules, clas);
  for(let clas in prestigeClasses)
    PFAPG.classRulesExtra(rules, clas);
  for(let clas in npcClasses)
    PFAPG.classRulesExtra(rules, clas);
  for(let deity in deities) {
    let domains = QuilvynUtils.getAttrValueArray(deities[deity], 'Domain');
    if(rules.deityStats.domains[deity] == null)
      console.log('Unknown deity "' + deity + '"');
    else if(domains.length == 0)
      console.log('No subdomains listed for deity "' + deity + '"');
    else
      rules.deityStats.domains[deity] += '/' + domains.join('/');
  }
  rules.defineRule('deityDomains',
    'deity', '=', QuilvynUtils.dictLit(rules.deityStats.domains) + '[source]'
  );
  for(let path in paths)
    PFAPG.pathRulesExtra(rules, path);
  for(let race in races)
    PFAPG.raceRulesExtra(rules, race);
};

/* Defines rules related to magic use. */
PFAPG.magicRules = function(rules, schools, spells, spellsLevels) {
  Pathfinder.magicRules(rules, schools, {}, {});
  for(let s in schools) {
    if(['Air', 'Earth', 'Fire', 'Water'].includes(s)) {
      Pathfinder.choiceRules(rules, 'Feature',
        'School Specialization (' + s + ')',
        Pathfinder.FEATURES['School Specialization (%school)'].replaceAll('%school', s)
      );
      Pathfinder.choiceRules(rules, 'Feature',
        'School Opposition (' + s + ')',
        Pathfinder.FEATURES['School Opposition (%school)'].replaceAll('%school', s)
      );
    }
  }
  let allSpells = Object.assign({}, spells, spellsLevels);
  for(let s in allSpells) {
    let attrs = allSpells[s];
    if(!attrs.includes('School=')) {
      if(!Pathfinder.SPELLS[s]) {
        console.log('Unknown spell "' + s + '"');
        continue;
      }
      attrs = Pathfinder.SPELLS[s] + ' Level=' + attrs;
    }
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    let liquids = QuilvynUtils.getAttrValueArray(attrs, 'Liquid');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let schoolAbbr = (school || 'Universal').substring(0, 4);
    for(let i = 0; i < groupLevels.length; i++) {
      let matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + s);
        continue;
      }
      let group = matchInfo[1];
      let level = matchInfo[2] * 1;
      let fullName = s + '(' + group + level + ' ' + schoolAbbr + ')';
      let domainSpell =
        Pathfinder.PATHS[group + ' Domain'] != null ||
        PFAPG.PATHS[group + ' Subdomain'] != null;
      Pathfinder.spellRules
        (rules, fullName, school, group, level, description, domainSpell,
         liquids);
      rules.addChoice('spells', fullName, attrs);
    }
  }
};

/* Defines rules related to character aptitudes. */
PFAPG.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  Pathfinder.talentRules(rules, feats, features, goodies, languages, skills);
  for(let feat in feats)
    PFAPG.featRulesExtra(rules, feat);
  rules.defineRule('traitCount', '', '=', '2');
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * directly derived from the attributes passed to classRules.
 */
PFAPG.classRulesExtra = function(rules, name) {
  let classLevel = 'levels.' + name;
  if(name == 'Alchemist') {
    rules.defineRule('combatNotes.bomb',
      classLevel, '=', null,
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.fastHealing', classLevel, '+=', '5');
    rules.defineRule('featureNotes.discovery',
      classLevel, '=', 'Math.floor(source / 2) + (source==20 ? 1 : 0)'
    );
    rules.defineRule('featureNotes.grandDiscovery', classLevel, '=', '1');
    rules.defineRule('features.Throw Anything',
      'featureNotes.throwAnything(Alchemist)', '=', '1'
    );
    rules.defineRule('saveNotes.poisonResistance',
      classLevel, '=', 'source>=10 ? Infinity : source>=8 ? 6 : source>= 5 ? 4 : 2'
    );
    rules.defineRule('selectableFeatureCount.Alchemist (Discovery)',
      'featureNotes.discovery', '=', null
    );
    rules.defineRule('selectableFeatureCount.Alchemist (Grand Discovery)',
      'featureNotes.grandDiscovery', '=', null
    );
    rules.defineRule('skillNotes.alchemy', classLevel, '=', null);
    Pathfinder.weaponRules(rules, 'Bomb', 3, 'R', '1d6', 20, 2, 20);
    rules.defineRule('bombDamageDice',
      classLevel, '=', 'Math.floor((source + 1) / 2) + "d6"'
    );
    rules.defineRule('bombDamageModifier', 'intelligenceModifier', '=', null);
    rules.defineRule('weapons.Bomb', classLevel, '=', '1');
  } else if(name == 'Cavalier') {
    rules.defineRule('animalCompanionFeatures.Light Armor Proficiency',
      'companionNotes.mount', '=', '1'
    );
    rules.defineRule('animalCompanionFeatures.Share Spells',
      'animalCompanionHasShareSpells', '?', null
    );
    rules.defineRule('animalCompanionHasShareSpells',
      'companionMasterLevel', '=', '1',
      'companionNotes.mount', '=', '0'
    );
    rules.defineRule
      ('channelLevel', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('companionMasterLevel', classLevel, '^=', null);
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.mount', '=', '1');
    rules.defineRule
      ('featCount.Fighter', 'featureNotes.cavalierFeatBonus', '+=', null);
    rules.defineRule
      ('featCount.Order Of The Sword', 'featureNotes.mountedMastery', '=', '1');
    rules.defineRule('featCount.Teamwork',
      'featureNotes.greaterTactician', '+=', '1',
      'featureNotes.masterTactician', '+=', '1',
      'featureNotes.tactician', '+=', '1'
    );
    rules.defineRule('featureNotes.cavalierFeatBonus',
      classLevel, '+=', 'Math.floor(source / 6)'
    );
    rules.defineRule
      ('features.Dazzling Display', 'featureNotes.braggart', '=', '1');
    rules.defineRule
      ('features.Stand Still', 'featureNotes.stemTheTide', '=', '1');
    rules.defineRule('features.Teamwork', 'features.Tactician', '=', null);
    rules.defineRule('magicNotes.layOnHands', 'magicNotes.calling', '+', null);
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.calling', '+', null);
    rules.defineRule
      ('magicNotes.calling', classLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('selectableFeatureCount.Cavalier (Order)',
      'featureNotes.order', '=', null
    );
    rules.defineRule('skillModifier.Ride', 'skillNotes.mount.1', '+', null);
    rules.defineRule('skillNotes.mount.1',
      'skillNotes.mount', '?', null,
      'skillNotes.armorSkillCheckPenalty', '=', null
    );
    // Reversal of Ride armor penalty is handled by Mount feature; this noop
    // gets Mounted Mastery skill note displayed in italics
    rules.defineRule
      ('skillModifier.Ride', 'skillNotes.mountedMastery', '+', '0');
    let allFeats = rules.getChoices('feats');
    ['Mounted Combat', 'Skill Focus (Ride)', 'Spirited Charge', 'Trample',
     'Unseat'].forEach(x => allFeats[x] = allFeats[x].replace('Type=', 'Type="Order Of The Sword",'));
  } else if(name == 'Inquisitor') {
    let allDeities = rules.getChoices('deities');
    for(let d in allDeities) {
       QuilvynUtils.getAttrValueArray(allDeities[d], 'Weapon').forEach(w => {
         rules.defineRule('inquisitorFeatures.Weapon Proficiency (' + w + ')',
           'levels.Inquisitor', '?', null,
           'deityFavoredWeapons', '=',
             'source.split("/").includes("' + w + '") ? 1 : null'
         );
         rules.defineRule('features.Weapon Proficiency (' + w + ')',
           'inquisitorFeatures.Weapon Proficiency (' + w + ')', '=', '1'
         );
       });
    }
    rules.defineRule('combatNotes.bane',
      '', '=', '2',
      'combatNotes.greaterBane', '+', '2'
    );
    rules.defineRule
      ('combatNotes.cunningInitiative', 'wisdomModifier', '=', null);
    rules.defineRule
      ('featCount.Teamwork', 'featureNotes.teamworkFeat', '+=', null);
    rules.defineRule('featureNotes.teamworkFeat',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('selectableFeatureCount.Inquisitor (Domain)',
      'featureNotes.domain(Inquisitor)', '+=', '1'
    );
    rules.defineRule('skillNotes.sternGaze',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule
      ('skillNotes.track', classLevel, '+=', 'Math.floor(source / 2)');
  } else if(name == 'Oracle') {
    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.lame.1', '*', 'source.includes("armor") ? 0 : null'
    );
    rules.defineRule('abilityNotes.lame',
      '', '=', '-10',
      'features.Slow', '+', '5'
    );
    rules.defineRule('abilityNotes.lame.1',
      'features.Lame', '?', null,
      classLevel, '=', 'source>=10 ? " or armor" : ""'
    );
    rules.defineRule('combatNotes.deaf',
      classLevel, '=', 'source<5 ? -4 : source<10 ? -2 : null'
    );
    rules.defineRule('featCount.General',
      'featureNotes.maneuverMastery', '+', null,
      'featureNotes.weaponMastery', '+', null
    );
    rules.defineRule('featureNotes.deaf.1',
      'features.Deaf', '?', null,
      classLevel, '=', 'source<10 ? \'\' : source<15 ? "/Has Scent feature" : "/Has Scent feature and 30\' Tremorsense"'
    );
    rules.defineRule('featureNotes.maneuverMastery',
      classLevel, '=', 'source>=11 ? 2 : source>=7 ? 1 : null'
    );
    rules.defineRule('featureNotes.resiliency(Oracle)',
      classLevel, '=', 'source<7 ? null : "Diehard"'
    );
    rules.defineRule('featureNotes.revelation',
      classLevel, '+=', 'Math.floor((source + 5) / 4)'
    );
    rules.defineRule('featureNotes.weaponMastery',
      classLevel, '=', 'source>=12 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule('featureNotes.weaponMastery.1',
      'features.Weapon Mastery', '?', null,
      classLevel, '=', 'source>=12 ? ", Improved Critical, and Greater Weapon Focus" : source>=8 ? " and Improved Critical" : ""'
    );
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.bondedMount', '=', '1');
    rules.defineRule('features.Armor Proficiency (Heavy)',
      'combatNotes.skillAtArms', '=', '1'
    );
    rules.defineRule('features.Diehard',
      'featureNotes.resiliency(Oracle)', '=', 'source.includes("Diehard") ? 1 : null'
    );
    rules.defineRule('features.Scent',
      'featureNotes.deaf.1', '=', 'source.includes("Scent") ? 1 : null'
    );
    rules.defineRule('features.Weapon Proficiency (Martial)',
      'combatNotes.skillAtArms', '=', '1'
    );
    rules.defineRule('initiative', 'combatNotes.deaf', '+', null);
    rules.defineRule('languageCount', 'skillNotes.tongues', '+', null);
    rules.defineRule('magicNotes.haunted',
      classLevel, '=', '"<i>Mage Hand</i>, <i>Ghost Sound</i>" + (source>=5 ? ", <i>Levitate</i>, <i>Minor Image</i>" : "") + (source>=10 ? ", <i>Telekinesis</i>" : "") + (source>=15 ? "<i>, Reverse Gravity</i>" : "")'
    );
    rules.defineRule('saveNotes.lame',
      classLevel, '=', 'source<5 ? null : source<15 ? "fatigued" : "fatigued and exhausted"'
    );
    rules.defineRule('selectableFeatureCount.Oracle (Curse)',
      "featureNotes.oracle'sCurse", '+=', '1'
    );
    rules.defineRule('selectableFeatureCount.Oracle (Mystery)',
      'featureNotes.mystery', '+=', '1'
    );
    rules.defineRule
      ('skillNotes.tongues', classLevel, '=', 'source<5 ? 1 : 2');
    rules.defineRule('skillNotes.tongues.1',
      'features.Tongues', '?', null,
      classLevel, '=', 'source>=10 ? "/Can understand " + (source>=15 ? "and speak " : "") + "any spoken language" : ""'
    );
    rules.defineRule('speed', 'abilityNotes.lame', '+', null);
    let allSkills = rules.getChoices('skills');
    for(let skill in allSkills) {
      if(skill != 'Intimidate' && allSkills[skill].match(/charisma/i))
        rules.defineRule
          ('skillModifier.' + skill, 'skillNotes.wasting', '+', '-4');
    }
    let allSpells = rules.getChoices('spells');
    ['Mage Hand', 'Ghost Sound', 'Levitate', 'Minor Image', 'Telekinesis',
     'Reverse Gravity'].forEach(s => {
       let spell = QuilvynUtils.getKeys(allSpells, new RegExp(s + '\\('))[0];
       let attrs = allSpells[spell];
       let description = QuilvynUtils.getAttrValue(attrs, 'Description');
       let level =
         QuilvynUtils.getAttrValue(attrs, 'Level').replace(/\D*/, '') - 0;
       let school = QuilvynUtils.getAttrValue(attrs, 'School');
       let fullName =
         s + ' (O' + level + ' [Haunted] ' + school.substring(0, 4) + ')';
       Pathfinder.spellRules(
         rules, fullName, school, 'O', level, description, false, []
       );
       rules.defineRule('spells.' + fullName,
         'magicNotes.haunted', '=', 'source.includes("' + s + '") ? 1 : null'
       );
    });
  } else if(name == 'Summoner') {
    rules.defineRule
      ('animalCompanionFeatures.Link', 'companionIsNotEidolon', '?', null);
    rules.defineRule('animalCompanionFeatures.Share Spells',
      'companionIsNotEidolon', '?', null
    );
    rules.defineRule('animalCompanionStats.AC',
      'eidolonMasterLevel', '+', '(Math.floor(source / 5) + Math.floor((source + 3) / 5) - Math.floor(source / 3)) * 2',
      'companionNotes.improvedNaturalArmorEvolution', '+', null,
      // Large/Huge/Small AC mods net AC and Dex modifiers
      'companionNotes.largeEvolution', '+', 'source=="Huge" ? 1 : 0',
      'companionNotes.smallEidolon', '+', '2' // +1 AC, +2 Dex
    );
    // Size effect on CMB/CMD taken care of in Pathfinder.js
    rules.defineRule('animalCompanionStats.Con',
      'companionNotes.largeEvolution.2', '+', null,
      'companionNotes.smallEidolon', '+', '-2'
    );
    rules.defineRule('animalCompanionStats.Dex',
      'eidolonMasterLevel', '+', 'Math.floor(source / 5) + Math.floor((source + 3) / 5) - Math.floor(source / 3)',
      'companionNotes.largeEvolution.6', '+', null,
      'companionNotes.smallEidolon', '+', '2'
    );
    rules.defineRule('animalCompanionStats.Feats',
      'eidolonMasterLevel', '=', 'Math.floor((source - 1) / 8) * 3 + Math.floor((((source - 1) % 8) + 1) / 3) + 1'
    );
    rules.defineRule('animalCompanionStats.HD',
      'eidolonMasterLevel', '=', 'source - Math.floor(source / 4)'
    );
    rules.defineRule
      ('animalCompanionStats.Save Fort', 'eidolonSaveFort', '=', null);
    rules.defineRule
      ('animalCompanionStats.Save Ref', 'eidolonSaveRef', '=', null);
    rules.defineRule
      ('animalCompanionStats.Save Will', 'eidolonSaveWill', '=', null);
    rules.defineRule('animalCompanionStats.Size',
      'companionNotes.largeEvolution', '=', 'source.charAt(0)',
      'companionNotes.smallEidolon', '=', '"S"'
    );
    rules.defineRule('animalCompanionStats.Skills',
      'eidolonMasterLevel', '=', '(source - Math.floor(source / 4)) * 4'
    );
    rules.defineRule('animalCompanionStats.Str',
      'eidolonMasterLevel', '+', 'Math.floor(source / 5) + Math.floor((source + 3) / 5) - Math.floor(source / 3)',
      'companionNotes.largeEvolution.1', '+', null,
      'companionNotes.smallEidolon', '+', '-4'
    );
    rules.defineRule
      ('animalCompanionStats.Tricks', 'companionIsNotEidolon', '?', null);
    rules.defineRule('companionNotes.burrowEvolution',
      'eidolonSpeed', '=', 'Math.floor(source / 2)',
      'summonerFeatures.Flight Evolution', '+', '(source - 1) * 20'
    );
    rules.defineRule('companionACBoosts',
      'eidolonMasterLevel', '=', 'Math.floor(source / 5)'
    );
    rules.defineRule('companionAttack',
      'eidolonAttackAdjustment', '+', null,
      // Large/Huge/Small attack mods net attack and Str modifiers
      'companionNotes.largeEvolution', '+', '3 + (source=="Huge" ? 3 : 0)',
      'companionNotes.smallEidolon', '+', '-1'
    );
    rules.defineRule('companionAttackBoosts',
      'eidolonMasterLevel', '=', 'Math.floor(source / 5)'
    );
    rules.defineRule('companionBAB',
      'eidolonMasterLevel', '=', 'source - Math.floor(source / 4)'
    );
    rules.defineRule('companionIsNotEidolon',
      'companionMasterLevel', '=', '1',
      'eidolonMasterLevel', '=', '0'
    );
    rules.defineRule('companionMasterLevel', 'eidolonMasterLevel', '^=', null);
    rules.defineRule('companionNotes.abilityIncreaseEvolution',
      'summonerFeatures.Ability Increase Evolution', '=', null
    );
    rules.defineRule('companionNotes.abilityIncreaseEvolution.1',
      'summonerFeatures.Ability Increase Evolution', '=', 'source==1 ? "y" : "ies"'
    );
    rules.defineRule('companionNotes.breathWeaponEvolution',
      'summonerFeatures.Breath Weapon Evolution', '=', null
    );
    rules.defineRule('companionNotes.climbEvolution',
      // The first selection gives base speed; additional +20
      'eidolonSpeed', '=', null,
      'summonerFeatures.Climb Evolution', '+=', '20 * (source - 1)'
    );
    rules.defineRule('companionNotes.improvedDamageEvolution',
      'summonerFeatures.Improved Damage Evolution', '=', null
    );
    rules.defineRule('companionNotes.damageReductionEvolution',
      'summonerFeatures.Damage Reduction Evolution', '=', 'source>=2 ? 10 : 5'
    );
    rules.defineRule('companionNotes.fastHealingEvolution',
      'summonerFeatures.Fast Healing Evolution', '=', null
    );
    rules.defineRule('companionNotes.flightEvolution',
      'eidolonSpeed', '=', null,
      'summonerFeatures.Flight Evolution', '+', '(source - 1) * 20'
    );
    rules.defineRule('companionNotes.immunityEvolution',
      'summonerFeatures.Immunity Evolution', '=', null
    );
    rules.defineRule('companionNotes.improvedNaturalArmorEvolution',
      'summonerFeatures.Improved Natural Armor Evolution', '=', '2 * source'
    );
    rules.defineRule('companionNotes.largeEvolution',
      'summonerFeatures.Large Evolution', '=', 'source==1 ? "Large" : "Huge"'
    );
    rules.defineRule('companionNotes.largeEvolution.1',
      'summonerFeatures.Large Evolution', '=', 'source * 8'
    );
    rules.defineRule('companionNotes.largeEvolution.2',
      'summonerFeatures.Large Evolution', '=', 'source * 4'
    );
    rules.defineRule('companionNotes.largeEvolution.3',
      'summonerFeatures.Large Evolution', '=', 'source==1 ? 1 : 3'
    );
    rules.defineRule('companionNotes.largeEvolution.4',
      'summonerFeatures.Large Evolution', '=', null
    );
    rules.defineRule('companionNotes.largeEvolution.5',
      'summonerFeatures.Large Evolution', '=', 'source==1 ? 10 : 15',
      'animalCompanion.Quadruped Eidolon', 'v', '10',
      'animalCompanion.Serpentine Eidolon', 'v', '10'
    );
    rules.defineRule('companionNotes.largeEvolution.6',
      'summonerFeatures.Large Evolution', '=', 'source * -2'
    );
    rules.defineRule('companionNotes.largeEvolution.7',
      'summonerFeatures.Large Evolution', '=', 'source * -1'
    );
    rules.defineRule('companionNotes.largeEvolution.8',
      'summonerFeatures.Large Evolution', '=', 'source * -2'
    );
    rules.defineRule('companionNotes.largeEvolution.9',
      'summonerFeatures.Large Evolution', '=', 'source * -4'
    );
    rules.defineRule('companionNotes.limbs(Arms)Evolution',
      'summonerFeatures.Limbs (Arms) Evolution', '=', null
    );
    rules.defineRule('companionNotes.limbs(Legs)Evolution',
      'summonerFeatures.Limbs (Legs) Evolution', '=', null
    );
    rules.defineRule('companionNotes.limbs(Legs)Evolution.1',
      'companionNotes.limbs(Legs)Evolution', '=', 'source * 10'
    );
    rules.defineRule('companionNotes.poisonEvolution',
      'summonerFeatures.Poison Evolution', '=', 'source>=2 ? "Con" : "Str"'
    );
    rules.defineRule('companionNotes.pullEvolution',
      'summonerFeatures.Pull Evolution', '=', null
    );
    rules.defineRule('companionNotes.pushEvolution',
      'summonerFeatures.Push Evolution', '=', null
    );
    rules.defineRule('companionNotes.reachEvolution',
      'summonerFeatures.Reach Evolution', '=', null
    );
    rules.defineRule('companionNotes.resistanceEvolution',
      'summonerFeatures.Resistance Evolution', '=', null
    );
    rules.defineRule('companionNotes.skilledEvolution',
      'summonerFeatures.Skilled Evolution', '=', null
    );
    rules.defineRule('companionNotes.swimEvolution',
      'eidolonSpeed', '=', null,
      'summonerFeatures.Swim Evolution', '+', '(source - 1) * 20'
    );
    rules.defineRule('companionNotes.tailEvolution',
      'animalCompanion.Serpentine Eidolon', '+=', '2',
      'summonerFeatures.Tail Evolution', '+=', 'source * 2'
    );
    rules.defineRule('companionNotes.weaponTrainingEvolution.1',
      'summonerFeatures.Weapon Training Evolution', '=', 'source>=2 ? " and martial" : ""'
    );
    rules.defineRule('eidolonAttackAdjustment',
      'features.eidolon', '?', null,
      'animalCompanionStats.HD', '=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('eidolonDamage',
      'features.Eidolon', '?', null,
      'animalCompanionStats.Size', '=', 'source=="S" ? "1d4" : source=="M" ? "1d6" : source=="L" ? "1d8" : "2d6"'
    );
    rules.defineRule('eidolonDamageMinor',
      'features.Eidolon', '?', null,
      'animalCompanionStats.Size', '=', 'source=="S" ? "1d3" : source=="M" ? "1d4" : source=="L" ? "1d6" : "1d8"'
    );
    rules.defineRule('eidolonDamageMajor',
      'features.Eidolon', '?', null,
      'animalCompanionStats.Size', '=', 'source=="S" ? "1d6" : source=="M" ? "1d8" : source=="L" ? "2d6" : "2d8"'
    );
    rules.defineRule('eidolonMasterLevel', classLevel, '=', null);
    rules.defineRule('eidolonPrimaryDamageBonus',
      'features.Eidolon', '?', null,
      'animalCompanionStats.Str', '=', 'Math.floor(Math.floor((source - 10) / 2) * 1.5)'
    );
    rules.defineRule('eidolonSecondaryDamageBonus',
      'features.Eidolon', '?', null,
      'animalCompanionStats.Str', '=', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('eidolonSaveFort',
      'animalCompanion.Serpentine Eidolon', '=', '0',
      'animalCompanionStats.HD', '+', 'Math.floor(source / 3)'
    );
    rules.defineRule('eidolonSaveRef',
      'animalCompanion.Biped Eidolon', '=', '0',
      'animalCompanionStats.HD', '+', 'Math.floor(source / 3)'
    );
    rules.defineRule('eidolonSaveWill',
      'animalCompanion.Biped Eidolon', '=', '0',
      'animalCompanion.Serpentine Eidolon', '=', '0',
      'animalCompanionStats.HD', '+', '2 + Math.floor(source / 2)'
    );
    rules.defineRule('eidolonSpeed',
      // Note that the free legs evolution will give biped +10 and quad +20
      'animalCompanion.Biped Eidolon', '=', '20',
      'animalCompanion.Quadruped Eidolon', '=', '20',
      'animalCompanion.Serpentine Eidolon', '=', '20',
      'summonerFeatures.Limbs (Legs) Evolution', '+', 'source * 10'
    );
    let features = [
      '1:Companion Darkvision', '1:Link (Summoner)',
      '1:Share Spells (Summoner)', '2:Companion Evasion',
      '5:Ability Score Increase', '5:Devotion', '7:Multiattack',
      '11:Companion Improved Evasion'
    ];
    QuilvynRules.featureListRules
      (rules, features, 'Animal Companion', 'eidolonMasterLevel', false);
    rules.defineRule('featureNotes.aspect',
      classLevel, '=', '2',
      'featureNotes.greaterAspect', '+', '4'
    );
    rules.defineRule('magicNotes.summonMonster',
      classLevel, '=', '["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][Math.min(Math.floor((source - 1) / 2), 8)]'
    );
    rules.defineRule('selectableFeatureCount.Summoner (Evolution)',
      classLevel, '=', 'source + 2 + Math.floor((source + 1) / 5)'
    );
    rules.defineRule('selectableFeatures.excessEvolutionPoints',
      // Modify # evolution points required for 2nd selection of some evolutions
      'selectableFeatures.Summoner - Flight Evolution', '+=', '1',
      'selectableFeatures.Summoner - Damage Reduction Evolution', '+=', '2 + source - 1',
      'selectableFeatures.Summoner - Breath Weapon Evolution', '+=', '3',
      'selectableFeatures.Summoner - Fast Healing Evolution', '+=', '3 + source - 1',
      'selectableFeatures.Summoner - Large Evolution', '+=', '3 + (source - 1) * 5'
    );
    rules.defineRule('summonerFeatures.Bite Evolution',
      'animalCompanion.Quadruped Eidolon', '+=', '1',
      'animalCompanion.Serpentine Eidolon', '+=', '1'
    );
    rules.defineRule('summonerFeatures.Claws Evolution',
      'animalCompanion.Biped Eidolon', '+=', '1'
    );
    rules.defineRule('summonerFeatures.Climb Evolution',
      'animalCompanion.Serpentine Eidolon', '+=', '1'
    );
    rules.defineRule('summonerFeatures.Limbs (Arms) Evolution',
      'animalCompanion.Biped Eidolon', '+=', '1'
    );
    rules.defineRule('summonerFeatures.Limbs (Legs) Evolution',
      'animalCompanion.Biped Eidolon', '+=', '1',
      'animalCompanion.Quadruped Eidolon', '+=', '2'
    );
    rules.defineRule('summonerFeatures.Reach Evolution',
      'animalCompanion.Serpentine Eidolon', '+=', '1'
    );
    rules.defineRule('summonerFeatures.Tail Evolution',
      'animalCompanion.Serpentine Eidolon', '+=', '1'
    );
    rules.defineRule('summonerFeatures.Tail Slap Evolution',
      'animalCompanion.Serpentine Eidolon', '+=', '1'
    );
    // Make sure the editor allows multiple selections of selectableFeatures
    rules.defineEditorElement('selectableFeatures');
    rules.defineEditorElement
      ('selectableFeatures', 'Selectable Features', 'setbag',
       'selectableFeatures', 'skills');
  } else if(name == 'Witch') {
    rules.defineRule('familiarMasterLevel', classLevel, '+=', null);
    rules.defineRule
      ('features.Familiar', "featureNotes.witch'sFamiliar", '=', null);
    rules.defineRule('hexDC',
      classLevel, '=', '10 + Math.floor(source / 2)',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('magicNotes.flightHex.1',
      'features.Flight Hex', '?', null,
      classLevel, '=', '(source>=3 ? ", <i>Levitate</i> 1/dy" : "") + (source>=5 ? ", use <i>Fly</i> effects %{levels.Witch} min/dy" : "")'
    );
    rules.defineRule
      ('featureNotes.hex', classLevel, '=', 'Math.floor(source / 2) + 1');
    rules.defineRule
      ('selectableFeatureCount.Witch (Hex)', 'featureNotes.hex', '+=', null);
    rules.defineRule('selectableFeatureCount.Witch (Patron)',
      'featureNotes.patron', '+=', '1'
    );
  } else if(name == 'Barbarian') {
    rules.defineRule('armorClass',
      'combatNotes.nakedCourage.1', '+', null,
      'combatNotes.naturalToughness.1', '+', null
    );
    rules.defineRule('barbarianHasDamageReduction',
      classLevel, '=', '1',
      'barbarianFeatures.Invulnerability', '=', '0',
      'barbarianFeatures.Keen Senses (Barbarian)', '=', '0',
      'barbarianFeatures.Natural Toughness', '=', '0'
    );
    rules.defineRule('barbarianHasFastMovement',
      classLevel, '=', '1',
      'barbarianFeatures.Destructive', '=', '0',
      'barbarianFeatures.Fast Rider', '=', '0',
      'barbarianFeatures.Raging Drunk', '=', '0',
      'barbarianFeatures.Skilled Thrower', '=', '0'
    );
    rules.defineRule('barbarianHasImprovedUncannyDodge',
      classLevel, '=', '1',
      'barbarianFeatures.Bestial Mount', '=', '0',
      'barbarianFeatures.Improved Savage Grapple', '=', '0',
      'barbarianFeatures.Invulnerability', '=', '0'
    );
    rules.defineRule('barbarianHasTrapSense',
      classLevel, '=', '1',
      'barbarianFeatures.Battle Scavenger', '=', '0',
      'barbarianFeatures.Elemental Fury', '=', '0',
      'barbarianFeatures.Extreme Endurance', '=', '0',
      'barbarianFeatures.Naked Courage', '=', '0',
      'barbarianFeatures.Pit Fighter', '=', '0',
      'barbarianFeatures.Sixth Sense', '=', '0'
    );
    rules.defineRule('barbarianHasUncannyDodge',
      classLevel, '=', '1',
      'barbarianFeatures.Bestial Mount', '=', '0',
      'barbarianFeatures.Invulnerability', '=', '0',
      'barbarianFeatures.Savage Grapple', '=', '0'
    );
    rules.defineRule('barbarianFeatures.Damage Reduction',
      'barbarianHasDamageReduction', '?', 'source == 1'
    );
    rules.defineRule('barbarianFeatures.Fast Movement',
      'barbarianHasFastMovement', '?', 'source == 1'
    );
    rules.defineRule('barbarianFeatures.Improved Uncanny Dodge',
      'barbarianHasImprovedUncannyDodge', '?', 'source == 1'
    );
    rules.defineRule('barbarianFeatures.Trap Sense',
      'barbarianHasTrapSense', '?', 'source == 1'
    );
    rules.defineRule('barbarianFeatures.Uncanny Dodge',
      'barbarianHasUncannyDodge', '?', 'source == 1'
    );
    rules.defineRule('combatNotes.invulnerability',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('combatNotes.lesserHurling',
      '', '=', '10',
      'combatNotes.hurling', '+', '10',
      'combatNotes.greaterHurling', '+', '10'
    );
    rules.defineRule('combatNotes.lesserHurling.1',
      'combatNotes.lesserHurling.2', '=', '["Tiny", "Small", "Medium", "Large", "Huge"][source]'
    );
    rules.defineRule('combatNotes.lesserHurling.2',
      'features.Lesser Hurling', '=', '1',
      'features.Small', '+', '-1',
      'features.Large', '+', '1',
      'combatNotes.hurling', '+', '1',
      'combatNotes.greaterHurling', '+', '1'
    );
    rules.defineRule('combatNotes.lesserBeastTotem',
      '', '=', '6',
      'features.Small', '+', '-2',
      'features.Greater Beast Totem', '+', '2'
    );
    rules.defineRule('combatNotes.lesserBeastTotem.1',
      'features.Lesser Beast Totem', '?', null,
      '', '=', '2',
      'features.Greater Beast Totem', '+', '1'
    );
    rules.defineRule('combatNotes.lesserChaosTotem',
      '', '=', '1',
      'features.Chaos Totem', '+', '1',
      'features.Greater Chaos Totem', '+', '1'
    );
    rules.defineRule('combatNotes.nakedCourage',
      classLevel, '=', 'Math.floor((source + 3) / 6)'
    );
    rules.defineRule('combatNotes.nakedCourage.1',
      'armor', '?', 'source == "None"',
      'combatNotes.nakedCourage', '=', null
    );
    rules.defineRule('combatNotes.naturalToughness',
      classLevel, '=', 'Math.floor((source - 4) / 3)'
    );
    rules.defineRule('combatNotes.naturalToughness.1',
      'armor', '?', 'source == "None"',
      'combatNotes.naturalToughness', '=', null
    );
    rules.defineRule('combatNotes.savageGrapple',
      '', '=', '"Half"',
      'combatNotes.improvedSavageGrapple', '=', '"No"'
    );
    rules.defineRule
      ('combatNotes.sixthSense', classLevel, '=', 'Math.floor(source / 3)');
    rules.defineRule('companionBarbarianLevel',
      'features.Bestial Mount', '?', null,
      classLevel, '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('companionMasterLevel', 'companionBarbarianLevel', '+=', null);
    rules.defineRule
      ('damageReduction.-', 'combatNotes.invulnerability', '^=', null);
    rules.defineRule('featureNotes.blindsense',
      'superstitiousLevel', '^=', 'source>=13 ? 30 : null'
    );
    rules.defineRule('featureNotes.keenSenses(Barbarian).1',
      'features.Keen Senses (Barbarian)', '?', null,
      classLevel, '=', '"" + (source>=10 ? ", 60\' Darkvision" : "") + (source>=13 ? ", Scent" : "") + (source>=16 ? ", Blindsense" : "") + (source>=19 ? ", Blindsight" : "")'
    );
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.bestialMount', '=', '1');
    rules.defineRule('features.Blindsense',
      'featureNotes.keenSenses(Barbarian).1', '=', 'source.includes("Blindsense") ? 1 : null'
    );
    rules.defineRule('features.Blindsight',
      'featureNotes.keenSenses(Barbarian).1', '=', 'source.includes("Blindsight") ? 1 : null'
    );
    rules.defineRule('features.Darkvision',
      'featureNotes.keenSenses(Barbarian).1', '=', 'source.includes("Darkvision") ? 1 : null'
    );
    rules.defineRule('features.Low-Light Vision',
      'featureNotes.keenSenses(Barbarian)', '=', '1'
    );
    rules.defineRule('features.Scent',
      'featureNotes.keenSenses(Barbarian).1', '=', 'source.includes("Scent") ? 1 : null'
    );
    rules.defineRule
      ('selectableFeatureCount.Barbarian (Archetype)', classLevel, '=', '1');
  } else if(name == 'Bard') {
    rules.defineRule('bardHasBardicKnowledge',
      classLevel, '=', '1',
      'bardFeatures.Arcane Strike', '=', '0',
      'bardFeatures.Eye For Detail', '=', '0',
      'bardFeatures.Heraldic Expertise', '=', '0',
      'bardFeatures.Magical Talent (Magician)', '=', '0',
      'bardFeatures.Master Of Deception', '=', '0',
      'bardFeatures.Streetwise', '=', '0',
      'bardFeatures.World Traveler (Sea Singer)', '=', '0'
    );
    rules.defineRule('bardHasCountersong',
      classLevel, '=', '1',
      'bardFeatures.Gladhanding', '=', '0',
      'bardFeatures.Improved Counterspell', '=', '0',
      'bardFeatures.Rallying Cry', '=', '0',
      'bardFeatures.Sea Shanty', '=', '0'
    );
    rules.defineRule('bardHasDeadlyPerformance',
      classLevel, '=', '1',
      'bardFeatures.Spell Catching', '=', '0'
    );
    rules.defineRule('bardHasDirgeOfDoom',
      classLevel, '=', '1',
      'bardFeatures.Glorious Epic', '=', '0',
      'bardFeatures.Spell Suppression', '=', '0'
    );
    rules.defineRule('bardHasFascinate',
      classLevel, '=', '1',
      'bardFeatures.Inspiring Blow', '=', '0'
    );
    rules.defineRule('bardHasFrighteningTune',
      classLevel, '=', '1',
      'bardFeatures.Metamagic Mastery (Magician)', '=', '0',
      'bardFeatures.Scandal', '=', '0'
    );
    rules.defineRule('bardHasInspireCompetence',
      classLevel, '=', '1',
      'bardFeatures.Harmless Performer', '=', '0',
      'bardFeatures.Mockery', '=', '0',
      'bardFeatures.Sea Shanty', '=', '0',
      'bardFeatures.Trap Sense', '=', '0'
    );
    rules.defineRule('bardHasInspireCourage',
      classLevel, '=', '1',
      'bardFeatures.Careful Teamwork', '=', '0',
      'bardFeatures.Disappearing Act', '=', '0',
      'bardFeatures.Dweomercraft', '=', '0',
      'bardFeatures.Naturalist', '=', '0',
      'bardFeatures.Satire', '=', '0',
      'bardFeatures.Stealspell', '=', '0'
    );
    rules.defineRule('bardHasInspireGreatness',
      classLevel, '=', '1',
      'bardFeatures.Dramatic Subtext', '=', '0',
      'bardFeatures.Madcap Prank', '=', '0',
      'bardFeatures.True Confession', '=', '0'
    );
    rules.defineRule('bardHasInspireHeroics',
      classLevel, '=', '1',
      'bardFeatures.Greater Stealspell', '=', '0',
      'bardFeatures.Show Yourselves', '=', '0',
      'bardFeatures.Slip Through The Crowd', '=', '0'
    );
    rules.defineRule('bardHasJackOfAllTrades',
      classLevel, '=', '1',
      'bardFeatures.Arcane Armor', '=', '0',
      'bardFeatures.Song Of The Fallen', '=', '0',
      'bardFeatures.Wand Mastery', '=', '0',
      'bardFeatures.Wide Audience', '=', '0'
    );
    rules.defineRule('bardHasLoreMaster',
      classLevel, '=', '1',
      'bardFeatures.Arcane Bond', '=', '0',
      'bardFeatures.Quick Change', '=', '0',
      'bardFeatures.Sneak Attack', '=', '0',
      'bardFeatures.Wide Audience', '=', '0'
    );
    rules.defineRule('bardHasMassSuggestion',
      classLevel, '=', '1',
      'bardFeatures.Battle Song', '=', '0',
      'bardFeatures.Call The Storm', '=', '0',
      'bardFeatures.Mass Bladethirst', '=', '0',
      'bardFeatures.Mass Slumber Song', '=', '0',
      'bardFeatures.Pedantic Lecture', '=', '0'
    );
    rules.defineRule('bardHasSoothingPerformance',
      classLevel, '=', '1',
      'bardFeatures.Berserkergang', '=', '0'
    );
    rules.defineRule('bardHasSuggestion',
      classLevel, '=', '1',
      'bardFeatures.Bladethirst', '=', '0',
      'bardFeatures.Incite Rage', '=', '0',
      'bardFeatures.Lamentable Belaborment', '=', '0',
      'bardFeatures.Slumber Song', '=', '0',
      'bardFeatures.Whistle The Wind', '=', '0'
    );
    rules.defineRule('bardHasVersatilePerformance',
      classLevel, '=', '1',
      'bardFeatures.Arcane Investigation', '=', '0',
      'bardFeatures.Archivist', '=', '0',
      'bardFeatures.Combat Casting', '=', '0',
      'bardFeatures.Expanded Repertoire', '=', '0',
      'bardFeatures.Familiar', '=', '0',
      'bardFeatures.Sneakspell', '=', '0'
    );
    rules.defineRule('bardHasWellVersed',
      classLevel, '=', '1',
      'bardFeatures.Arcane Insight', '=', '0',
      'bardFeatures.Combat Casting', '=', '0',
      'bardFeatures.Extended Performance', '=', '0',
      'bardFeatures.Magic Lore', '=', '0',
      'bardFeatures.Sea Legs', '=', '0'
    );
    rules.defineRule
      ('bardFeatures.Bardic Knowledge', 'bardHasBardicKnowledge', '?', null);
    rules.defineRule
      ('bardFeatures.Countersong', 'bardHasCountersong', '?', null);
    rules.defineRule('bardFeatures.Deadly Performance',
      'bardHasDeadlyPerformance', '?', null
    );
    rules.defineRule
      ('bardFeatures.Dirge Of Doom', 'bardHasDirgeOfDoom', '?', null);
    rules.defineRule('bardFeatures.Fascinate', 'bardHasFascinate', '?', null);
    rules.defineRule
      ('bardFeatures.Frightening Tune', 'bardHasFrighteningTune', '?', null);
    rules.defineRule('bardFeatures.Inspire Competence',
      'bardHasInspireCompetence', '?', null
    );
    rules.defineRule
      ('bardFeatures.Inspire Courage', 'bardHasInspireCourage', '?', null);
    rules.defineRule
      ('bardFeatures.Inspire Greatness', 'bardHasInspireGreatness', '?', null);
    rules.defineRule
      ('bardFeatures.Inspire Heroics', 'bardHasInspireHeroics', '?', null);
    rules.defineRule
      ('bardFeatures.Jack-Of-All-Trades', 'bardHasJackOfAllTrades', '?', null);
    rules.defineRule
      ('bardFeatures.Lore Master', 'bardHasLoreMaster', '?', null);
    rules.defineRule
      ('bardFeatures.Mass Suggestion', 'bardHasMassSuggestion', '?', null);
    rules.defineRule('bardFeatures.Soothing Performance',
      'bardHasSoothingPerformance', '?', null
    );
    rules.defineRule
      ('bardFeatures.Suggestion', 'bardHasSuggestion', '?', null);
    rules.defineRule('bardFeatures.Versatile Performance',
      'bardHasVersatilePerformance', '?', null
    );
    rules.defineRule
      ('bardFeatures.Well-Versed', 'bardHasWellVersed', '?', null);
    rules.defineRule('familiarMasterLevel',
      'seaSingerLevel', '+=', 'source>=2 ? source : null'
    );
    rules.defineRule('featureNotes.arcaneArmor',
      classLevel, '=', 'source>=16 ? "Heavy" : "Medium"'
    );
    rules.defineRule('features.Heavy Armor Proficiency',
      'featureNotes.arcaneArmor', '=', 'source=="Heavy" ? 1 : null'
    );
    rules.defineRule('features.Medium Armor Proficiency',
      'featureNotes.arcaneArmor', '=', '1'
    );
    rules.defineRule('magicNotes.arcaneArmor',
      classLevel, '=', 'source>=16 ? "heavy" : "medium"'
    );
    rules.defineRule('magicNotes.arcaneArmor.1',
      'magicNotes.arcaneArmor', '=', 'source=="heavy" ? -3 : -2',
      'armorWeight', '+', null
    );
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.arcaneArmor.1', 'v', 'source<=0 ? 0 : null'
    );
    rules.defineRule
      ('saveNotes.trapSense', 'sandmanLevel', '+=', 'Math.floor(source / 3)');
    rules.defineRule
      ('selectableFeatureCount.Bard (Archetype)', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Bard (Arcane Bond)',
      'arcaneDuelistLevel', '+=', 'source>=5 ? 1 : null',
      'magicianLevel', '+=', 'source>=5 ? 1 : null'
    );
    rules.defineRule('skillModifier.Bluff',
      'skillNotes.masterOfDeception', '+', 'null', // No-op for italics
      'skillNotes.masterOfDeception.1', '+', null
    );
    rules.defineRule('skillModifier.Knowledge (Arcana)',
      'skillNotes.magicalTalent(Magician)', '+', 'null', // No-op for italics
      'skillNotes.magicalTalent(Magician).1', '+', null
    );
    rules.defineRule('skillModifier.Knowledge (Geography)',
      'skillNotes.worldTraveler(SeaSinger)', '+', 'null', // No-op for italics
      'skillNotes.worldTraveler(SeaSinger).1', '+', null
    );
    rules.defineRule('skillModifier.Knowledge (Local)',
      'skillNotes.worldTraveler(SeaSinger).1', '+', null
    );
    rules.defineRule('skillModifier.Knowledge (Nature)',
      'skillNotes.worldTraveler(SeaSinger).1', '+', null
    );
    rules.defineRule('skillModifier.Linguistics',
      'skillNotes.worldTraveler(SeaSinger).1', '+', null
    );
    rules.defineRule('skillModifier.Spellcraft',
      'skillNotes.magicalTalent(Magician).1', '+', null
    );
    rules.defineRule('skillModifier.Use Magic Device',
      'skillNotes.magicalTalent(Magician).1', '+', null
    );
    rules.defineRule('skillModifier.Sleight Of Hand',
      'skillNotes.masterOfDeception.1', '+', null
    );
    rules.defineRule('skillModifier.Stealth',
      'skillNotes.masterOfDeception.1', '+', null
    );
    rules.defineRule('skillNotes.eyeForDetail',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.heraldicExpertise',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.jack-Of-All-Trades.1',
      'archivistLevel', '=', 'source>=11 ? "; all skills are class skills" : ""'
    );
    rules.defineRule('skillNotes.jack-Of-All-Trades.2',
      'archivistLevel', '=', 'source>=17 ? "; may take 10 on any skill" : ""'
    );
    rules.defineRule('skillNotes.loreMaster',
      'archivistLevel', '^=', 'Math.floor((source + 4) / 6)'
    );
    rules.defineRule('skillNotes.magicalTalent(Magician).1',
      'features.Magical Talent (Magician)', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.masterOfDeception.1',
      'features.Master Of Deception', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.streetwise',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.worldTraveler(SeaSinger).1',
      'features.World Traveler (Sea Singer)', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('sneakAttack', 'sandmanLevel', '+=', 'Math.floor(source / 5)');
  } else if(name == 'Cleric') {
    rules.defineRule('clericRagePowerLevel',
      'features.Rage (Cleric)', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('ragePowerLevel', 'clericRagePowerLevel', '+=', null);
    rules.defineRule('combatNotes.rage(Cleric).1',
      'features.Rage (Cleric)', '?', null,
      classLevel, '=', 'source>=16 ? 2 : source>=12 ? 1 : 0'
    );
    rules.defineRule
      ('featureNotes.ragePowers', 'combatNotes.rage(Cleric).1', '+=', null);
    rules.defineRule('features.Rage Powers',
      'combatNotes.rage(Cleric).1', '=', 'source>0 ? 1 : null'
    );
    rules.defineRule('saveNotes.lesserChaosTotem',
      '', '=', '1',
      'features.Chaos Totem', '+', '1',
      'features.Greater Chaos Totem', '+', '1'
    );
    rules.defineRule('skillNotes.eyesOfTheHawk',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Druid') {
    var allFeats = rules.getChoices('feats');
    rules.defineRule('abilityNotes.naturalSwimmer',
      'speed', '=', 'Math.floor(source / 2)',
      'abilityNotes.seaborn', '*', '2'
    );
    rules.defineRule('abilityNotes.runLikeTheWind.1',
      'features.Natural Swimmer', '?', null,
      'armorWeight', '=', 'source <= 1 ? 1 : null'
    );
    rules.defineRule('druidHasAThousandFaces',
      classLevel, '=', '1',
      'druidFeatures.Deep Diver', '=', '0',
      'druidFeatures.Dunemeld', '=', '0',
      'druidFeatures.Evasion', '=', '0',
      'druidFeatures.Flurry Form', '=', '0',
      'druidFeatures.Mountain Stone', '=', '0',
      'druidFeatures.Plaguebearer', '=', '0',
      'druidFeatures.Slippery', '=', '0',
      'druidFeatures.Verdant Sentinel', '=', '0',
      'druidFeatures.Totemic Summons', '=', '0'
    );
    rules.defineRule('druidHasNatureSense',
      classLevel, '=', '1',
      'druidFeatures.Cavesense', '=', '0'
    );
    rules.defineRule('druidHasResistNaturesLure',
      classLevel, '=', '1',
      'druidFeatures.Arctic Endurance', '=', '0',
      'druidFeatures.Desert Endurance', '=', '0',
      'druidFeatures.Miasma', '=', '0',
      'druidFeatures.Pond Scum', '=', '0',
      "druidFeatures.Resist Ocean's Fury", '=', '0',
      'druidFeatures.Resist Subterranean Corruption', '=', '0',
      'druidFeatures.Resist Temptation', '=', '0',
      'druidFeatures.Savanna Ambush', '=', '0',
      'druidFeatures.Spire Walker', '=', '0',
      'druidFeatures.Torrid Endurance', '=', '0'
    );
    rules.defineRule('druidHasSpontaneousDruidSpell',
      classLevel, '=', '1',
      'druidFeatures.Spontaneous Casting', '=', '0'
    );
    rules.defineRule('druidHasTracklessStep',
      classLevel, '=', '1',
      // BD5 Miasma replaces D3 Trackless Step
      'blightDruidLevel', '=', '0',
      'druidFeatures.Icewalking', '=', '0',
      'druidFeatures.Lightfoot', '=', '0',
      'druidFeatures.Lorekeeper', '=', '0',
      'druidFeatures.Natural Swimmer', '=', '0',
      'druidFeatures.Run Like The Wind', '=', '0',
      'druidFeatures.Sandwalker', '=', '0',
      'druidFeatures.Swamp Strider', '=', '0',
      'druidFeatures.Sure-Footed (Druid)', '=', '0',
      'jungleDruidLevel', '=', '0'
    );
    rules.defineRule('druidHasVenomImmunity',
      classLevel, '=', '1',
      'druidFeatures.Blightblooded', '=', '0',
      'druidFeatures.Canny Charger', '=', '0',
      'druidFeatures.Mental Strength', '=', '0',
      'druidFeatures.Mountain Stance', '=', '0',
      'druidFeatures.Seaborn', '=', '0',
      'druidFeatures.Shaded Vision', '=', '0',
      'druidFeatures.Snowcaster', '=', '0',
      'druidFeatures.Animal Shaman Feat Bonus', '=', '0'
    );
    rules.defineRule('druidHasWildEmpathy',
      classLevel, '=', '1',
      'druidFeatures.Vermin Empathy', '=', '0'
    );
    rules.defineRule('druidHasWildShape',
      classLevel, '=', '1',
      'aquaticDruidLevel', '=', 'source>=6 ? null : 0',
      'arcticDruidLevel', '=', 'source>=6 ? null : 0',
      'caveDruidLevel', '=', 'source>=6 ? null : 0',
      'desertDruidLevel', '=', 'source>=6 ? null : 0',
      'jungleDruidLevel', '=', 'source>=6 ? null : 0',
      'mountainDruidLevel', '=', 'source>=6 ? null : 0',
      'plainsDruidLevel', '=', 'source>=6 ? null : 0',
      'swampDruidLevel', '=', 'source>=6 ? null : 0',
      'urbanDruidLevel', '=', 'source>=8 ? null : 0',
      'animalShamanLevel', '=', 'source>=6 ? null : 0'
    );
    rules.defineRule('druidHasWoodlandStride',
      classLevel, '=', '1',
      'druidFeatures.Aquatic Adaptation', '=', '0',
      'druidFeatures.Arctic Native', '=', '0',
      'druidFeatures.Desert Native', '=', '0',
      'druidFeatures.Lorekeeper', '=', '0',
      'druidFeatures.Marshwight', '=', '0',
      'druidFeatures.Mountaineer', '=', '0',
      'druidFeatures.Plains Traveler', '=', '0',
      'druidFeatures.Tunnelrunner', '=', '0',
      'jungleDruidLevel', '=', 'source>=3 ? null : 0'
    );
    rules.defineRule
      ('druidFeatures.A Thousand Faces', 'druidHasAThousandFaces', '?', null);
    rules.defineRule
      ('druidFeatures.Nature Sense', 'druidHasNatureSense', '?', null);
    rules.defineRule("druidFeatures.Resist Nature's Lure",
      'druidHasResistNaturesLure', '?', null
    );
    rules.defineRule('druidFeatures.Spontaneous Druid Spell',
      'druidHasSpontaneousDruidSpell', '?', null
    );
    rules.defineRule
      ('druidFeatures.Trackless Step', 'druidHasTracklessStep', '?', null);
    rules.defineRule
      ('druidFeatures.Venom Immunity', 'druidHasVenomImmunity', '?', null);
    rules.defineRule
      ('druidFeatures.Wild Empathy', 'druidHasWildEmpathy', '?', null);
    rules.defineRule
      ('druidFeatures.Wild Shape', 'druidHasWildShape', '?', null);
    rules.defineRule
      ('druidFeatures.Woodland Stride', 'druidHasWoodlandStride', '?', null);
    rules.defineRule('featureNotes.animalShamanFeatBonus',
      classLevel, '=', 'Math.floor((source - 5) / 4)'
    );
    rules.defineRule('familiarMasterLevel', 'blightDruidLevel', '+=', null);
    rules.defineRule('featCount.Bear Shaman',
      'features.Bear Totem', '?', null,
      'featureNotes.animalShamanFeatBonus', '=', null
    );
    rules.defineRule('featCount.Eagle Shaman',
      'features.Eagle Totem', '?', null,
      'featureNotes.animalShamanFeatBonus', '=', null
    );
    rules.defineRule('featCount.Lion Shaman',
      'features.Lion Totem', '?', null,
      'featureNotes.animalShamanFeatBonus', '=', null
    );
    rules.defineRule('featCount.Serpent Shaman',
      'features.Serpent Totem', '?', null,
      'featureNotes.animalShamanFeatBonus', '=', null
    );
    rules.defineRule('featCount.Wolf Shaman',
      'features.Wolf Totem', '?', null,
      'featureNotes.animalShamanFeatBonus', '=', null
    );
    rules.defineRule('magicNotes.totemTransformation',
      'features.Bear Totem', '=', '"mammals"',
      'features.Eagle Totem', '=', '"birds"',
      'features.Lion Totem', '=', '"felines"',
      'features.Serpent Totem', '=', '"reptiles"',
      'features.Wolf Totem', '=', '"canines"'
    );
    rules.defineRule('magicNotes.totemicSummons',
      'features.Bear Totem', '=', '"bear"',
      'features.Eagle Totem', '=', '"eagle, roc, or giant eagle"',
      'features.Lion Totem', '=', '"feline"',
      'features.Serpent Totem', '=', '"snake"',
      'features.Wolf Totem', '=', '"canine"'
    );
    rules.defineRule('isNotUrbanDruid',
      classLevel, '=', '1',
      'features.Urban Druid', '=', '0'
    );
    rules.defineRule
      ('selectableFeatureCount.Druid (Archetype)', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Animal Shaman (Totem)',
      'features.Animal Shaman', '?', null,
      classLevel, '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Druid (Nature Bond)',
      'isNotUrbanDruid', '?', null
    );
    rules.defineRule('selectableFeatureCount.Urban Druid (Nature Bond)',
      'features.Urban Druid', '?', null,
      classLevel, '=', '1'
    );
    rules.defineChoice('notes',
      'validationNotes.blightDruidCompanion:Blight Druids may not have an animal companion'
    );
    rules.defineRule('validationNotes.blightDruidCompanion',
      'blightDruidLevel', '=', '0',
      'druidFeatures.Animal Companion', '+', '-1'
    );
    rules.defineRule('wildShapeLevel',
      'aquaticDruidLevel', '+', '-2',
      'arcticDruidLevel', '+', '-2',
      'caveDruidLevel', '+', '-2',
      'desertDruidLevel', '+', '-2',
      'jungleDruidLevel', '+', '-2',
      'mountainDruidLevel', '+', '-2',
      'plainsDruidLevel', '+', '-2',
      'swampDruidLevel', '+', '-2',
      'urbanDruidLevel', '+', '-4',
      'animalShamanLevel', '+', '-2'
    );
    rules.defineRule('speed', 'abilityNotes.runLikeTheWind.1', '+', '10');
    ['Diehard', 'Endurance', 'Great Fortitude', 'Improved Great Fortitude',
     'Toughness'].forEach(f => {
      allFeats[f] = allFeats[f].replace('Type=', 'Type="Bear Shaman",');
    });
    ['Flyby Attack', 'Improved Lightning Reflexes', 'Lightning Reflexes',
     'Skill Focus (Perception)', 'Wind Stance'].forEach(f => {
      allFeats[f] = allFeats[f].replace('Type=', 'Type="Eagle Shaman",');
    });
    ['Dodge', 'Lunge', 'Improved Iron Will', 'Iron Will',
     'Skill Focus (Acrobatics)'].forEach(f => {
      allFeats[f] = allFeats[f].replace('Type=', 'Type="Lion Shaman",');
    });
    ['Combat Expertise', 'Improved Feint', 'Skill Focus (Bluff)', 'Stealthy',
     'Strike Back'].forEach(f => {
      allFeats[f] = allFeats[f].replace('Type=', 'Type="Serpent Shaman",');
    });
    ['Greater Trip', 'Improved Trip', 'Mobility', 'Skill Focus (Stealth)',
     'Spring Attack'].forEach(f => {
      allFeats[f] = allFeats[f].replace('Type=', 'Type="Serpent Shaman",');
    });
    // TODO Disable Air Domain and Weather Domain selectable for Blight Druid
    // TODO Disable Knowledge (Geography) class skill for Cave Druid
  } else if(name == 'Fighter') {
    QuilvynUtils.getKeys(rules.getChoices('weapons')).forEach(weapon => {
      if(weapon.match(/\b(long|short)?bow\b/i)) {
        let prefix =
          weapon.charAt(0).toLowerCase() + weapon.substring(1).replaceAll(' ', '');
        rules.defineRule
          (prefix + 'AttackModifier', 'combatNotes.expertArcher', '+', null);
        rules.defineRule
          (prefix + 'DamageModifier', 'combatNotes.expertArcher', '+', null);
        rules.defineRule(prefix + 'Range', 'combatNotes.hawkeye', '+', null);
      } else if(weapon.match(/\bcrossbow\b/i)) {
        let prefix =
          weapon.charAt(0).toLowerCase() + weapon.substring(1).replaceAll(' ', '');
        rules.defineRule
          (prefix + 'AttackModifier', 'combatNotes.crossbowExpert', '+', null);
        rules.defineRule
          (prefix + 'DamageModifier', 'combatNotes.crossbowExpert', '+', null);
      }
    });
    rules.defineRule('armorClass', 'combatNotes.elusive.1', '+', null);
    rules.defineRule('combatNotes.crossbowExpert',
      classLevel, '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('combatNotes.elusive',
      classLevel, '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('combatNotes.elusive.1',
      'armorWeight', '?', 'source<=1',
      'combatNotes.elusive', '=', null
    );
    rules.defineRule
      ('combatNotes.deftShield', classLevel, '=', 'source>=11 ? 2 : 1');
    rules.defineRule('combatNotes.expertArcher',
      classLevel, '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('combatNotes.deadshot',
      'dexterityModifier', '=', 'Math.max(Math.floor(source / 2), 1)',
      'combatNotes.greaterDeadshot.1', '^', null,
      // Noop to get combatNotes.greaterDeadshot to appear in italics
      'combatNotes.greaterDeadshot', '+', '0'
    );
    rules.defineRule('combatNotes.greaterDeadshot.1',
      'features.Greater Deadshot', '?', null,
      'dexterityModifier', '=', null
    );
    rules.defineRule('combatNotes.hawkeye',
      classLevel, '=', 'Math.floor((source + 2) / 4) * 5'
    );
    rules.defineRule('combatNotes.irresistibleAdvance',
      'shield', '=', 'source=="None" ? 0 : source=="Buckler" ? 1 : source=="Tower" ? 4 : source.match(/Light/) ? 2 : 3'
    );
    rules.defineRule('combatNotes.safeShot',
      'fighterFeatures.Archer', '=', '"Bow"',
      'fighterFeatures.Crossbowman', '=', '"Crossbow"'
    );
    rules.defineRule('combatNotes.savageCharge',
      'combatNotes.savageCharge.1', '=', 'Math.floor(source)'
    );
    rules.defineRule('combatNotes.savageCharge.1',
      'features.Savage Charge', '?', null,
      classLevel, '=', 'source / 2',
      'combatNotes.greaterSavageCharge', '*', '0.5'
    );
    rules.defineRule('combatNotes.shieldMastery.1',
      'combatNotes.shieldMastery', '?', null,
      'shield', '=', 'source=="None" ? null : 5'
    );
    rules.defineRule('combatNotes.towerShieldPenalty',
      'combatNotes.deftShield', '+', null
    );
    rules.defineRule
      ('damageReduction.-', 'combatNotes.shieldMastery.1', '+=', null);
    rules.defineRule('featureNotes.shieldWard',
      'shield', '=', 'source=="None" ? null : "Evasion"'
    );
    rules.defineRule('featureNotes.shieldedFortress',
      'shield', '=', 'source=="None" ? null : source=="Tower" ? "Improved Evasion" : "Evasion"'
    );
    rules.defineRule('features.Evasion',
      'featureNotes.shieldedFortress', '=', 'source=="Evasion" ? 1 : null',
      'featureNotes.shieldWard', '=', 'source=="Evasion" ? 1 : null'
    );
    rules.defineRule('features.Improved Evasion',
      'featureNotes.shieldedFortress', '=', 'source=="Improved Evasion" ? 1 : null'
    );
    rules.defineRule('fighterHasArmorMastery',
      classLevel, '=', '1',
      'fighterFeatures.Deadly Defense', '=', '0',
      'fighterFeatures.Devastating Blow', '=', '0',
      'fighterFeatures.Indomitable Steed', '=', '0',
      'fighterFeatures.Penetrating Shot', '=', '0',
      'fighterFeatures.Polearm Parry', '=', '0',
      'fighterFeatures.Ranged Defense', '=', '0',
      'fighterFeatures.Reversal', '=', '0',
      'fighterFeatures.Shield Mastery', '=', '0',
      'fighterFeatures.Unstoppable Strike', '=', '0'
    );
    rules.defineRule('fighterHasArmorTraining',
      classLevel, '=', '1',
      'fighterFeatures.Active Defense', '=', '0',
      'fighterFeatures.Armored Charger', '=', '0',
      'fighterFeatures.Deadshot', '=', '0',
      'fighterFeatures.Defensive Flurry', '=', '0',
      'fighterFeatures.Elusive', '=', '0',
      'fighterFeatures.Overhand Chop', '=', '0',
      'fighterFeatures.Phalanx Fighting', '=', '0',
      'fighterFeatures.Steadfast Pike', '=', '0',
      'fighterFeatures.Trick Shot (Archer)', '=', '0',
      'fighterFeatures.Weapon Training (Weapon Master)', '=', '0'
    );
    rules.defineRule('fighterHasBravery',
      classLevel, '=', '1',
      'fighterFeatures.Agility', '=', '0',
      'fighterFeatures.Deceptive Strike', '=', '0',
      'fighterFeatures.Hawkeye', '=', '0',
      'fighterFeatures.Pole Fighting', '=', '0',
      'fighterFeatures.Shattering Strike', '=', '0',
      'fighterFeatures.Spark Of Life', '=', '0',
      'fighterFeatures.Stand Firm', '=', '0',
      'fighterFeatures.Steadfast Mount', '=', '0',
      'fighterFeatures.Weapon Guard', '=', '0'
    );
    rules.defineRule('fighterHasWeaponMastery',
      classLevel, '=', '1',
      'fighterFeatures.Natural Weapon Mastery', '=', '0',
      'fighterFeatures.Shield Ward', '=', '0',
      'fighterFeatures.Shielded Fortress', '=', '0',
      'fighterFeatures.Whirlwind Blitz', '=', '0'
    );
    rules.defineRule('fighterHasWeaponTraining',
      classLevel, '=', '1',
      'fighterFeatures.Crossbow Expert', '=', '0',
      'fighterFeatures.Expert Archer', '=', '0',
      'fighterFeatures.Leaping Attack', '=', '0',
      'fighterFeatures.Mounted Mettle', '=', '0',
      'fighterFeatures.Natural Savagery', '=', '0',
      'fighterFeatures.Polearm Training', '=', '0',
      'fighterFeatures.Ready Pike', '=', '0',
      'fighterFeatures.Reliable Strike', '=', '0',
      'fighterFeatures.Shield Fighter', '=', '0',
      'fighterFeatures.Singleton', '=', '0',
      'fighterFeatures.Twin Blades', '=', '0'
    );
    rules.defineRule
      ('fighterFeatures.Armor Mastery', 'fighterHasArmorMastery', '?', null);
    rules.defineRule
      ('fighterFeatures.Armor Training', 'fighterHasArmorTraining', '?', null);
    rules.defineRule('fighterFeatures.Bravery', 'fighterHasBravery', '?', null);
    rules.defineRule
      ('fighterFeatures.Weapon Mastery', 'fighterHasWeaponMastery', '?', null);
    rules.defineRule('fighterFeatures.Weapon Training',
      'fighterHasWeaponTraining', '?', null
    );
    rules.defineRule
      ('selectableFeatureCount.Fighter (Archetype)', classLevel, '=', '1');
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.deftShield.1', '+', '-source'
    );
    rules.defineRule('skillNotes.armoredCharger.1',
      'features.Armored Charger', '?', null,
      'skillNotes.armorSkillCheckPenalty', '=', null,
      // Noop to get Armored Charger note in italics
      'skillNotes.armoredCharger', '+', '0'
    );
    rules.defineRule
      ('skillNotes.deftShield', classLevel, '=', 'source>=11 ? 2 : 1');
    rules.defineRule('skillNotes.deftShield.1',
      'shield', '?', 'source=="Tower"',
      'skillNotes.deftShield', '=', null
    );
    rules.defineRule
      ('skillNotes.hawkeye', classLevel, '=', 'Math.floor((source + 2) / 4)');
    rules.defineRule
      ('skillModifier.Ride', 'skillNotes.armoredCharger.1', '+', null);
  } else if(name == 'Monk') {
    rules.defineRule('combatNotes.adamantineMonk',
      classLevel, '=', 'Math.floor((source - 6) / 3)'
    );
    rules.defineRule('combatNotes.elementalFist',
      'monkOfTheFourWindsLevel', '+', 'Math.floor(source / 5)'
    );
    rules.defineRule
      ('combatNotes.mysticPrescience', classLevel, '=', 'source>=20 ? 4 : 2');
    rules.defineRule('combatNotes.perfectStrike',
      'weaponAdeptLevel', '+', 'source>=10 ? 1 : null',
      'zenArcherLevel', '+', 'source>=10 ? 1 : null'
    );
    rules.defineRule('combatNotes.punishingKick',
      'hungryGhostMonkLevel', '+', 'source>=10 ? Math.floor((source-5) / 5) * 5 : null'
    );
    rules.defineRule('combatNotes.touchOfSerenity',
      'monkOfTheLotusLevel', '+', 'Math.floor(source / 6)'
    );
    rules.defineRule('combatNotes.zenArchery',
      'wisdomModifier', '=', null,
      'dexterityModifier', '+', '-source'
    );
    rules.defineRule
      ('compositeLongbowAttackModifier', 'combatNotes.zenArchery', '+', null);
    rules.defineRule
      ('compositeShortbowAttackModifier', 'combatNotes.zenArchery', '+', null);
    rules.defineRule
      ('longbowAttackModifier', 'combatNotes.zenArchery', '+', null);
    rules.defineRule
      ('shortbowAttackModifier', 'combatNotes.zenArchery', '+', null);
    rules.defineRule
      ('damageReduction.-', 'combatNotes.adamantineMonk', '+=', null);
    rules.defineRule('featCounts.General',
      'featureNotes.wayOfTheBow', '+', '1',
      'featureNotes.wayOfTheBow.1', '+', 'source.includes("+1") ? 1 : null',
      'featureNotes.wayOfTheWeaponMaster', '+', '1',
      'featureNotes.wayOfTheWeaponMaster.1', '+', 'source.includes("+1") ? 1 : null'
    );
    rules.defineRule('featureNotes.drunkenKi',
      '', '=', '1',
      'featureNotes.deepDrinker', '+', '1'
    );
    rules.defineRule('featureNotes.kiPool',
      'featureNotes.kiPool(KiMystic)', '+=', '2',
      // Force to exactly 2 points at level 3; above rule handles higher levels
      'kiMysticLevel', 'v=', 'source==3 ? 2 : null'
    );
    rules.defineRule('featureNotes.wayOfTheBow.1',
      'features.Way Of The Bow', '?', null,
      classLevel, '=', 'source>=10 ? "/+1 General Feat (Weapon Specialization (Bow))" : ""'
    );
    rules.defineRule('featureNotes.wayOfTheWeaponMaster.1',
      'features.Way Of The Weapon Master', '?', null,
      classLevel, '=', 'source>=6 ? "/+1 General Feat (Weapon Specialization (monk weapon))" : ""'
    );
    rules.defineRule
      ('features.Point-Blank Shot', 'featureNotes.pointBlankMaster', '=', '1');
    rules.defineRule('features.Toughness', 'featureNotes.ironMonk', '=', '1');
    rules.defineRule
      ('monkFeatures.Abundant Step', 'monkHasAbundantStep', '?', null);
    rules.defineRule
      ('monkFeatures.Condition Fist', 'monkHasStunningFist', '?', null);
    rules.defineRule
      ('monkFeatures.Diamond Body', 'monkHasDiamondBody', '?', null);
    rules.defineRule
      ('monkFeatures.Diamond Soul', 'monkHasDiamondSoul', '?', null);
    rules.defineRule('monkFeatures.Empty Body', 'monkHasEmptyBody', '?', null);
    rules.defineRule('monkFeatures.Evasion', 'monkHasEvasion', '?', null);
    rules.defineRule('monkFeatures.High Jump', 'monkHasHighJump', '?', null);
    rules.defineRule
      ('monkFeatures.Improved Evasion', 'monkHasImprovedEvasion', '?', null);
    rules.defineRule
      ('monkFeatures.Maneuver Training', 'monkHasManeuverTraining', '?', null);
    rules.defineRule
      ('monkFeatures.Perfect Self', 'monkHasPerfectSelf', '?', null);
    rules.defineRule
      ('monkFeatures.Purity Of Body', 'monkHasPurityOfBody', '?', null);
    rules.defineRule
      ('monkFeatures.Quivering Palm', 'monkHasQuiveringPalm', '?', null);
    rules.defineRule('monkFeatures.Slow Fall', 'monkHasSlowFall', '?', null);
    rules.defineRule('monkFeatures.Still Mind', 'monkHasStillMind', '?', null);
    rules.defineRule
      ('monkFeatures.Stunning Fist', 'monkHasStunningFist', '?', null);
    rules.defineRule
      ('monkFeatures.Timeless Body', 'monkHasTimelessBody', '?', null);
    rules.defineRule('monkFeatures.Tongue Of The Sun And Moon',
      'monkHasTongueOfTheSunAndMoon', '?', null
    );
    rules.defineRule('monkFeatures.Weapon Proficiency (Club/Dagger/Handaxe/Heavy Crossbow/Javelin/Kama/Light Crossbow/Nunchaku/Quarterstaff/Sai/Shortspear/Short Sword/Shuriken/Siangham/Sling/Spear)',
      'monkHasWeaponProficiency', '?', null
    );
    rules.defineRule
      ('monkFeatures.Wholeness Of Body', 'monkHasWholenessOfBody', '?', null);
    rules.defineRule('monkHasAbundantStep',
      classLevel, '=', '1',
      'monkFeatures.Slow Time', '=', '0',
      'monkFeatures.Touch Of Surrender', '=', '0'
    );
    rules.defineRule('monkHasDiamondBody',
      classLevel, '=', '1',
      'monkFeatures.Drunken Courage', '=', '0',
      'monkFeatures.Ki Sacrifice', '=', '0',
      'monkFeatures.Ki Weapons', '=', '0',
      'monkFeatures.Life From A Stone', '=', '0',
      'monkFeatures.Mystic Visions', '=', '0',
      'monkFeatures.Trick Shot (Zen Archer)', '=', '0'
    );
    rules.defineRule('monkHasDiamondSoul',
      classLevel, '=', '1',
      'monkFeatures.Drunken Resilience', '=', '0',
      'monkFeatures.Mystic Prescience', '=', '0',
      'monkFeatures.Sipping Demon', '=', '0'
    );
    rules.defineRule('monkHasEmptyBody',
      classLevel, '=', '1',
      'monkFeatures.Firewater Breath', '=', '0',
      'monkFeatures.Mystic Persistence', '=', '0'
    );
    rules.defineRule('monkHasEvasion',
      classLevel, '=', '1',
      'monkFeatures.Iron Monk', '=', '0',
      'monkFeatures.Way Of The Bow', '=', '0',
      // Way Of The Weapon Master delays Evasion to level 9
      'weaponAdeptLevel', '=', 'source<9 ? 0 : null'
    );
    rules.defineRule('monkHasHighJump',
      classLevel, '=', '1',
      'monkFeatures.Iron Limb Defense', '=', '0'
    );
    rules.defineRule('monkHasImprovedEvasion',
      classLevel, '=', '1',
      'monkFeatures.Adamantine Monk', '=', '0',
      'monkFeatures.Reflexive Shot', '=', '0',
      // Weapon Adept replaces Improved Evasion with Evasion
      'weaponAdeptLevel', '=', '0'
    );
    rules.defineRule('monkHasManeuverTraining',
      classLevel, '=', '1',
      'monkFeatures.Zen Archery', '=', '0'
    );
    rules.defineRule('monkHasPerfectSelf',
      classLevel, '=', '1',
      'monkFeatures.Immortality', '=', '0',
      'monkFeatures.Pure Power', '=', '0',
      'monkFeatures.True Sacrifice', '=', '0'
    );
    rules.defineRule('monkHasPurityOfBody',
      classLevel, '=', '1',
      'monkFeatures.Drunken Strength', '=', '0',
      'monkFeatures.Ki Arrows', '=', '0',
      'monkFeatures.Ki Weapons', '=', '0',
      'monkFeatures.Mystic Insight', '=', '0',
      'monkFeatures.Steal Ki', '=', '0'
    );
    rules.defineRule('monkHasQuiveringPalm',
      classLevel, '=', '1',
      'monkFeatures.Ki Sacrifice', '=', '0',
      'monkFeatures.Touch Of Peace', '=', '0'
    );
    rules.defineRule('monkHasSlowFall',
      classLevel, '=', '1',
      'monkFeatures.Bastion Stance', '=', '0'
    );
    rules.defineRule('monkHasStillMind',
      classLevel, '=', '1',
      'monkFeatures.Drunken Ki', '=', '0',
      'monkFeatures.Ki Mystic', '=', '0',
      'monkFeatures.Point Blank Master', '=', '0',
      'monkFeatures.Versatile Improvisation', '=', '0'
    );
    rules.defineRule('monkHasStunningFist',
      classLevel, '=', '1',
      'monkFeatures.Elemental Fist', '=', '0',
      'monkFeatures.Perfect Strike', '=', '0',
      'monkFeatures.Punishing Kick', '=', '0',
      'monkFeatures.Touch Of Serenity', '=', '0'
    );
    rules.defineRule('monkHasTimelessBody',
      classLevel, '=', '1',
      'monkFeatures.Aspect Master', '=', '0',
      'monkFeatures.Uncanny Initiative', '=', '0'
    );
    rules.defineRule('monkHasTongueOfTheSunAndMoon',
      classLevel, '=', '1',
      'monkFeatures.Ki Focus Bow', '=', '0',
      'monkFeatures.Learned Master', '=', '0',
      'monkFeatures.Vow Of Silence', '=', '0'
    );
    rules.defineRule('monkHasWeaponProficiency',
      classLevel, '=', '1',
      'monkFeatures.Monk Of The Empty Hand', '=', '0'
    );
    rules.defineRule('monkHasWholenessOfBody',
      classLevel, '=', '1',
      'monkFeatures.Ancient Healing Hand', '=', '0',
      'monkFeatures.Life Funnel', '=', '0'
    );
    rules.defineRule
      ('selectableFeatureCount.Monk (Archetype)', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Monk (Aspect)',
      'monkOfTheFourWindsLevel', '=', '1'
    );
    rules.defineRule('skillNotes.learnedMaster.1',
      'features.Learned Master', '?', null,
      'wisdomModifier', '=', null,
      'intelligenceModifier', '+', '-source'
    );
    QuilvynUtils.getKeys(rules.getChoices('skills')).forEach(skill => {
      if(skill == 'Linguistics' || skill.startsWith('Knowledge'))
        rules.defineRule
          ('skillModifier.' + skill, 'skillNotes.learnedMaster.1', '+', null);
    });
  } else if(name == 'Paladin') {
    rules.defineRule('animalCompanionStats.Save Fort',
      'companionNotes.skilledRider', '+', null
    );
    rules.defineRule('animalCompanionStats.Save Ref',
      'companionNotes.skilledRider', '+', null
    );
    rules.defineRule('animalCompanionStats.Save Will',
      'companionNotes.skilledRider', '+', null
    );
    rules.defineRule
      ('companionNotes.skilledRider', 'charismaModifier', '=', null);
    rules.defineRule('magicNotes.sharedDefense.1',
      'features.Shared Defense', '?', null,
      classLevel, '=', 'source>=18 ? ", plus automatic stabilization, immunity to bleed damage, and 25% chance to negate sneak attack and crit damage," : source>=12 ? ", plus automatic stabilization and immunity to bleed damage," : source>=6 ? ", plus automatic stabilization," : ""'
    );
    rules.defineRule('combatNotes.smiteEvil.3',
      'hospitalerLevel', 'v', 'Math.floor((source + 5) / 6)',
      'sacredServantLevel', 'v', 'Math.floor((source + 5) / 6)'
    );
    rules.defineRule
      ('features.Light Of Faith', 'featureNotes.powerOfFaith', '=', '1');
    rules.defineRule('magicNotes.channelEnergy.1',
      // Replace generic Paladin level computation w/Hospitaler-specific
      'hospitalerLevel', '+=', 'Math.floor((source - 2) / 2) - Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.powerOfFaith', '+', null);
    rules.defineRule('magicNotes.lightOfFaith.1',
      'features.Light Of Faith', '?', null,
      classLevel, '=', 'source>=20 ? ", 20 resistance to chosen energy, 50% chance of negating critical hit damage, and healing of 2d4 ability damage" : source>=16 ? ", 10 resistance to chosen energy, 25% chance of negating critical hit damage, and healing of 1d4 ability damage" : source>=12 ? ", 10 resistance to chosen energy, and healing of 1d4 ability damage" : source>=8 ? " and healing of 1d4 ability damage" : ""'
    );
    rules.defineRule
      ('paladinFeatures.Aura Of Faith', 'paladinHasAuraOfFaith', '?', null);
    rules.defineRule
      ('paladinFeatures.Aura Of Justice', 'paladinHasAuraOfJustice', '?', null);
    rules.defineRule
      ('paladinFeatures.Aura Of Resolve', 'paladinHasAuraOfResolve', '?', null);
    rules.defineRule
      ('paladinFeatures.Divine Health', 'paladinHasDivineHealth', '?', null);
    rules.defineRule('paladinFeatures.Mercy', 'paladinHasMercy', '?', null);
    rules.defineRule
      ('paladinFeatures.Smite Evil', 'paladinHasSmiteEvil', '?', null);
    rules.defineRule('paladinHasAuraOfFaith',
      classLevel, '=', '1',
      'paladinFeatures.Shining Light', '=', '0'
    );
    rules.defineRule('paladinHasAuraOfJustice',
      classLevel, '=', '1',
      'paladinFeatures.Aura Of Healing', '=', '0',
      "paladinFeatures.Knight's Charge", '=', '0',
      'paladinFeatures.Undead Annihilation', '=', '0'
    );
    rules.defineRule('paladinHasAuraOfResolve',
      classLevel, '=', '1',
      'paladinFeatures.Call Celestial Ally', '=', '0',
      'paladinFeatures.Aura Of Life', '=', '0'
    );
    rules.defineRule('paladinHasDivineHealth',
      classLevel, '=', '1',
      'paladinFeatures.Skilled Rider', '=', '0'
    );
    rules.defineRule('paladinHasMercy',
      classLevel, '=', '1',
      'paladinFeatures.Shared Defense', '=', '0'
    );
    rules.defineRule('paladinHasSmiteEvil',
      classLevel, '=', '1',
      'hospitalerLevel', '=', 'source<7 ? 0 : null'
    );
    rules.defineRule('paladinHasSpells',
      classLevel, '=', '1',
      'paladinFeatures.Power Of Faith', '=', '0'
    );
    rules.defineRule
      ('selectableFeatureCount.Paladin (Archetype)', classLevel, '=', '1');
    rules.defineRule
      ('selectableFeatureCount.Paladin (Mercy)', 'paladinHasMercy', '?', null);
    rules.defineRule('selectableFeatureCount.Paladin (Domain)',
      'featureNotes.domain(Paladin)', '=', '1'
    );
    rules.defineRule('skillModifier.Ride',
      'skillNotes.skilledRider', '+', '0', // Italics
      'skillNotes.skilledRider.1', '+', null
    );
    rules.defineRule('skillNotes.skilledRider.1',
      'features.Skilled Rider', '?', null,
      'skillNotes.armorSkillCheckPenalty', '=', null
    );
    rules.defineRule('casterLevels.Paladin', 'paladinHasSpells', '?', null);
    rules.defineRule('spellSlotLevel.Paladin', 'paladinHasSpells', '?', null);
  } else if(name == 'Ranger') {
    rules.defineRule('abilityNotes.formOfTheBear',
      '', '=', '4',
      'featureNotes.masterShifter', '^', '8'
    );
    rules.defineRule('abilityNotes.formOfTheBear.1',
      'features.Form Of The Bear', '?', null,
      '', '=', '" and -10 Speed"',
      'featureNotes.masterShifter', '=', '""'
    );
    rules.defineRule('abilityNotes.formOfTheCat',
      '', '=', '10',
      'featureNotes.masterShifter', '^', '20'
    );
    rules.defineRule('abilityNotes.formOfTheDragon',
      '', '=', '0',
      'featureNotes.masterShifter', '^', '30'
    );
    rules.defineRule('abilityNotes.formOfTheEagle',
      '', '=', '0',
      'featureNotes.masterShifter', '^', '40'
    );
    rules.defineRule('abilityNotes.formOfTheOtter',
      '', '=', '30',
      'featureNotes.masterShifter', '^', '60'
    );
    let allSkills = rules.getChoices('skills');
    for(let s in allSkills) {
      if(['Knowledge (Dungeoneering)', 'Knowledge (Geography)', 'Spellcraft'].includes(s) || s.startsWith('Profession')) {
        rules.defineRule('rangerClassSkills.' + s,
          'levels.Ranger', '=', '1',
          'rangerFeatures.Beast Master', '=', '0'
        );
        rules.defineRule('classSkills.' + s,
          'levels.Ranger', '=', 'null',
          'rangerClassSkills.' + s, '=', 'source==1 ? 1 : null'
        );
      } else if(['Handle Animal', 'Knowledge (Nature)'].includes(s)) {
        rules.defineRule('rangerClassSkills.' + s,
          'levels.Ranger', '=', '1',
          'rangerFeatures.Urban Ranger', '=', '0'
        );
        rules.defineRule('classSkills.' + s,
          'levels.Ranger', '=', 'null',
          'rangerClassSkills.' + s, '=', 'source==1 ? 1 : null'
        );
      }
    }
    ['Acrobatics', 'Escape Artist'].forEach(s => {
      rules.defineRule
        ('classSkills.' + s, 'rangerFeatures.Beast Master', '=', '1');
    });
    ['Disable Device', 'Knowledge (Local)'].forEach(s => {
      rules.defineRule
        ('classSkills.' + s, 'rangerFeatures.Urban Ranger', '=', '1');
    });
    rules.defineRule('combatNotes.formOfTheDragon',
      '', '=', '2',
      'featureNotes.masterShifter', '^', '4'
    );
    rules.defineRule('combatNotes.formOfTheJackal',
      '', '=', '"half"',
      'featureNotes.masterShifter', '=', '"full"'
    );
    rules.defineRule("combatNotes.ranger'sLuck.1",
      "rangerFeatures.Ranger's Luck", '?', null,
      classLevel, '=', '""',
      "combatNotes.improvedRanger'sLuck", '=', '" +4"'
    );
    rules.defineRule("combatNotes.ranger'sLuck.2",
      "combatNotes.ranger'sLuck.1", '=', 'source ? " -4" : ""'
    );
    rules.defineRule("featureNotes.hunter'sTricks",
      classLevel, '=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('casterLevels.Ranger', 'rangerHasSpells', '?', null);
    rules.defineRule('spellSlotLevel.Ranger', 'rangerHasSpells', '?', null);
    rules.defineRule
      ('rangerFeatures.Camouflage', 'rangerHasCamouflage', '?', null);
    rules.defineRule
      ('rangerFeatures.Endurance', 'rangerHasEndurance', '?', null);
    rules.defineRule
      ('rangerFeatures.Evasion', 'rangerHasEvasion', '?', null);
    rules.defineRule
      ('rangerFeatures.Favored Enemy', 'rangerHasFavoredEnemy', '?', null);
    rules.defineRule
      ('rangerFeatures.Favored Terrain', 'rangerHasFavoredTerrain', '?', null);
    rules.defineRule('rangerFeatures.Hide In Plain Sight',
      'rangerHasHideInPlainSight', '?', null
    );
    rules.defineRule('rangerFeatures.Improved Evasion',
      'rangerHasImprovedEvasion', '?', null
    );
    rules.defineRule
      ('rangerFeatures.Improved Quarry', 'rangerHasImprovedQuarry', '?', null);
    rules.defineRule
      ('rangerFeatures.Master Hunter', 'rangerHasMasterHunter', '?', null);
    rules.defineRule('rangerFeatures.Quarry', 'rangerHasQuarry', '?', null);
    rules.defineRule
      ('rangerFeatures.Woodland Stride', 'rangerHasWoodlandStride', '?', null);
    rules.defineRule('rangerHasCamouflage',
      classLevel, '=', '1',
      // Presume Infiltrator losing Favored Terrain implies losing Camouflage
      'rangerFeatures.Adaptation', '=', '0',
      'rangerFeatures.Blend In', '=', '0',
      'rangerFeatures.Dual Form Shifter', '=', '0',
      'rangerFeatures.Strong Bond', '=', '0',
      'rangerFeatures.Wisdom Of The Spirits', '=', '0'
    );
    rules.defineRule('rangerHasEndurance',
      classLevel, '=', '1',
      'rangerFeatures.Trapfinding', '=', '0'
    );
    rules.defineRule('rangerHasEvasion',
      classLevel, '=', '1',
      "rangerFeatures.Ranger's Luck", '=', '0'
    );
    rules.defineRule('rangerHasFavoredEnemy',
      classLevel, '=', '1',
      "rangerFeatures.Ranger's Focus", '=', '0'
    );
    rules.defineRule('rangerHasFavoredTerrain',
      classLevel, '=', '1',
      'rangerFeatures.Adaptation', '=', '0',
      'rangerFeatures.Favored Community', '=', '0',
      "rangerFeatures.Shifter's Blessing", '=', '0'
    );
    rules.defineRule('rangerHasHideInPlainSight',
      classLevel, '=', '1',
      'rangerFeatures.Invisibility Trick', '=', '0',
      'rangerFeatures.Spiritual Bond', '=', '0'
    );
    rules.defineRule('rangerHasHuntersBond',
      classLevel, '=', '1',
      'rangerFeatures.Beast Master', '=', '0',
      'rangerFeatures.Guide', '=', '0',
      'rangerFeatures.Mounted Bond', '=', '0',
      'rangerFeatures.Spirit Bond', '=', '0'
    );
    rules.defineRule('rangerHasImprovedEvasion',
      classLevel, '=', '1',
      "rangerFeatures.Improved Ranger's Luck", '=', '0'
    );
    rules.defineRule('rangerHasImprovedQuarry',
      classLevel, '=', '1',
      'rangerFeatures.Inspired Moment', '=', '0'
    );
    rules.defineRule('rangerHasMasterHunter',
      classLevel, '=', '1',
      // Presume Guide losing Favored Enemy implies losing Master Hunter
      'rangerFeatures.Guide', '=', '0',
      'rangerFeatures.Master Shifter', '=', '0'
    );
    rules.defineRule('rangerHasQuarry',
      classLevel, '=', '1',
      'rangerFeatures.Inspired Moment', '=', '0'
    );
    rules.defineRule('rangerHasSpells',
      classLevel, '=', '1',
      "rangerFeatures.Hunter's Tricks", '=', '0'
    );
    rules.defineRule('rangerHasWoodlandStride',
      classLevel, '=', '1',
      'rangerFeatures.Push Through', '=', '0'
    );
    rules.defineRule
      ('selectableFeatureCount.Ranger (Archetype)', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Ranger (Archery Feat)',
      'beastMasterLevel', '+', 'source>=6 ? -1 : null'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Crossbow Feat)',
      'features.Combat Style (Crossbow)', '?', null,
      classLevel, '=', 'source >= 2 ? Math.floor((source + 2) / 4) : null',
      'beastMasterLevel', '+', 'source>=6 ? -1 : null'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Bond)",
      'rangerHasHuntersBond', '?', null
    );
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Trick)",
      'skirmisherLevel', '=', 'Math.floor((source - 3) / 2)'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Mounted Combat Feat)',
      'features.Combat Style (Mounted Combat)', '?', null,
      classLevel, '=', 'source >= 2 ? Math.floor((source + 2) / 4) : null',
      'beastMasterLevel', '+', 'source>=6 ? -1 : null'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Natural Weapon Feat)',
      'features.Combat Style (Natural Weapon)', '?', null,
      classLevel, '=', 'source >= 2 ? Math.floor((source + 2) / 4) : null',
      'beastMasterLevel', '+', 'source>=6 ? -1 : null'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Shifter's Blessing)",
      'shapeshifterLevel', '=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Two-Handed Weapon Feat)',
      'features.Combat Style (Two-Handed Weapon)', '?', null,
      classLevel, '=', 'source >= 2 ? Math.floor((source + 2) / 4) : null',
      'beastMasterLevel', '+', 'source>=6 ? -1 : null'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Two-Weapon Feat)',
      'beastMasterLevel', '+', 'source>=6 ? -1 : null'
    );
    rules.defineRule('selectableFeatureCount.Ranger (Weapon And Shield Feat)',
      'features.Combat Style (Weapon And Shield)', '?', null,
      classLevel, '=', 'source >= 2 ? Math.floor((source + 2) / 4) : null',
      'beastMasterLevel', '+', 'source>=6 ? -1 : null'
    );
    rules.defineRule('skillNotes.formOfTheCat',
      '', '=', '4',
      'featureNotes.masterShifter', '^', '10'
    );
    rules.defineRule('skillNotes.formOfTheOtter',
      '', '=', '8',
      'featureNotes.masterShifter', 'v', '5'
    );
    rules.defineRule('skillNotes.trapfinding',
      'urbanRangerLevel', '+=', 'Math.floor(source / 2)'
    );
    // Handle style feats that duplicate those of core styles
    let allSelectables = rules.getChoices('selectableFeatures');
    ['Precise Shot', 'Improved Precise Shot', 'Pinpoint Targeting',
     'Shot On The Run'].forEach(f => {
      let entry = 'Ranger - ' + f;
      if(entry in allSelectables)
        allSelectables[entry] =
          allSelectables[entry].replace('Type=', 'Type="Ranger (Crossbow Feat)",');
    });
    ['Improved Shield Bash', 'Two-Weapon Fighting'].forEach(f => {
      let entry = 'Ranger - ' + f;
      if(entry in allSelectables)
        allSelectables[entry] =
          allSelectables[entry].replace('Type=', 'Type="Ranger (Weapon And Shield Feat)",');
    });
  } else if(name == 'Rogue') {
    rules.defineRule
      ('featCount.Combat', 'featureNotes.martialTraining', '+=', '1');
    rules.defineRule
      ('features.Improved Steal', 'featureNotes.combatSwipe', '=', '1');
    rules.defineRule('features.Intimidating Prowess',
      'featureNotes.strongImpression', '=', '1'
    );
    rules.defineRule('rogueFeatures.Improved Uncanny Dodge',
      'rogueHasImprovedUncannyDodge', '?', null
    );
    rules.defineRule
      ('rogueFeatures.Trapfinding', 'rogueHasTrapfinding', '?', null);
    rules.defineRule
      ('rogueFeatures.Trap Sense', 'rogueHasTrapSense', '?', null);
    rules.defineRule
      ('rogueFeatures.Uncanny Dodge', 'rogueHasUncannyDodge', '?', null);
    rules.defineRule('rogueHasImprovedUncannyDodge',
      classLevel, '=', '1',
      'rogueFeatures.Distraction (Rogue)', '=', '0',
      'rogueFeatures.Skirmisher (Rogue)', '=', '0',
      'rogueFeatures.Trap Master', '=', '0'
    );
    rules.defineRule('rogueHasTrapfinding',
      classLevel, '=', '1',
      'rogueFeatures.Accuracy', '=', '0',
      "rogueFeatures.Bravado's Blade", '=', '0',
      'rogueFeatures.Expert Acrobat', '=', '0',
      'rogueFeatures.Follow Up', '=', '0',
      'rogueFeatures.Frightening', '=', '0',
      'rogueFeatures.Martial Training', '=', '0',
      'rogueFeatures.Measure The Mark', '=', '0',
      // Poison Use replaces Trapfinding for Poisoner, Trap Sense for Spy
      'poisonerLevel', '=', '0',
      'rogueFeatures.Skilled Liar', '=', '0'
    );
    rules.defineRule('rogueHasTrapSense',
      classLevel, '=', '1',
      'rogueFeatures.Brutal Beating', '=', '0',
      'rogueFeatures.Daring', '=', '0',
      'rogueFeatures.Deadly Range', '=', '0',
      'rogueFeatures.Master Poisoner', '=', '0',
      // Poison Use replaces Trapfinding for Poisoner, Trap Sense for Spy
      'spyLevel', '=', '0',
      "rogueFeatures.Rake's Smile", '=', '0',
      'rogueFeatures.Second Chance (Rogue)', '=', '0',
      'rogueFeatures.Stab And Grab', '=', '0'
    );
    rules.defineRule('rogueHasUncannyDodge',
      classLevel, '=', '1',
      'rogueFeatures.Careful Disarm', '=', '0',
      "rogueFeatures.Scout's Charge", '=', '0'
    );
    rules.defineRule
      ('selectableFeatureCount.Rogue (Archetype)', classLevel, '=', '1');
    rules.defineRule('skillNotes.guilefulPolyglot',
      '', '=', '2',
      'skills.Linguistics', '+', '2'
    );
    rules.defineRule('skillModifier.Acrobatics',
      'skillNotes.expertAcrobat.1', '+', null,
      'skillNotes.expertAcrobat.2', '+', null
    );
    rules.defineRule
      ('skillModifier.Climb', 'skillNotes.expertAcrobat.1', '+', null);
    rules.defineRule('skillModifier.Fly',
      'skillNotes.expertAcrobat.1', '+', null,
      'skillNotes.expertAcrobat.2', '+', null
    );
    rules.defineRule('skillModifier.Sleight Of Hand',
      'skillNotes.expertAcrobat.1', '+', null
    );
    rules.defineRule
      ('skillModifier.Stealth', 'skillNotes.expertAcrobat.1', '+', null);
    rules.defineRule
      ('skillNotes.daring', classLevel, '=', 'Math.floor(source / 3)');
    rules.defineRule('skillNotes.expertAcrobat.1',
      'skillNotes.expertAcrobat', '?', null,
      'armorWeight', '?', 'source==1',
      'skillNotes.armorSkillCheckPenalty', '=', null
    );
    rules.defineRule('skillNotes.expertAcrobat.2',
      'skillNotes.expertAcrobat', '?', null,
      'armorWeight', '=', 'source==0 ? 2 : null'
    );
    rules.defineRule
      ("skillNotes.rake'sSmile", classLevel, '=', 'Math.floor(source / 3)');
  } else if(name == 'Sorcerer') {
    let allFeats = rules.getChoices('feats');
    for(let f in allFeats) {
      if(f.startsWith('Exotic Weapon Proficiency'))
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Bloodline Boreal",');
      else if(f.startsWith('Skill Focus (Craft'))
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Bloodline Protean",');
    }
    rules.defineRule
      ('abilityNotes.earthGlide', 'bloodlineDeepEarthLevel', '+=', null);
    rules.defineRule
      ('combatNotes.aquaticAdaptation(Sorcerer)', classLevel, '?', 'source>=9');
    rules.defineRule('combatNotes.combatPrecognition',
      classLevel, '=', 'Math.floor((source + 1) / 4)'
    );
    rules.defineRule
      ('combatNotes.snakeskin', classLevel, '=', 'Math.floor((source-5) / 4)');
    rules.defineRule
      ('damageReduction.adamantine', 'combatNotes.strengthOfStone', '+=', '10');
    rules.defineRule
      ('damageReduction.piercing', 'saveNotes.deepOne', '+=', '10');
    rules.defineRule('featureNotes.aquaticAdaptation(Sorcerer)',
      classLevel, '?', 'source>=9'
    );
    rules.defineRule('featureNotes.serpentfriend.1',
      'featureNotes.serpentfriend', '?', null,
      classLevel, '=', 'source - 2'
    );
    rules.defineRule('featureNotes.stormchild', classLevel, '?', 'source>=9');
    rules.defineRule
      ('familiarMasterLevel', 'featureNotes.serpentfriend.1', '+=', null);
    rules.defineRule('features.Evasion', 'featureNotes.deepOne', '=', '1');
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.voidwalker', '=', '1');
    rules.defineRule
      ('features.Familiar', 'featureNotes.serpentfriend', '=', '1');
    rules.defineRule
      ('features.Stonecunning', 'featureNotes.rockseer', '=', '1');
    rules.defineRule('magicNotes.rockseer', classLevel, '?', 'source>=15');
    rules.defineRule
      ('saveNotes.aquaticAdaptation(Sorcerer)', classLevel, '?', 'source>=9');
    rules.defineRule
      ('skillNotes.snakeskin', classLevel, '=', 'Math.floor((source - 1) / 4)');
    rules.defineRule
      ('skillNotes.rockseer', 'race', '?', 'source.match(/Dwarf/)');
  } else if(name == 'Wizard') {
    let allSchools = rules.getChoices('schools');
    for(var s in allSchools) {
      if(!(s in PFAPG.SCHOOLS))
        continue;
      let elementalSchool = ['Air', 'Earth', 'Fire', 'Water'].includes(s);
      if(elementalSchool) {
        let oppositeSchool = {
          'Air':'Earth', 'Earth':'Air', 'Fire':'Water', 'Water':'Fire'
        };
        rules.defineRule('wizardFeatures.School Opposition (' + oppositeSchool[s] + ')',
          'wizardFeatures.School Specialization (' + s + ')', '=', '1'
        );
        rules.defineRule('features.School Opposition (' + oppositeSchool[s] + ')',
          'wizardFeatures.School Opposition (' + oppositeSchool[s] + ')', '=', '1'
        );
        for(var i = 1; i <= 9; i++) {
          rules.defineRule('spellSlots.W' + i,
            'magicNotes.schoolSpecialization(' + s + ')', '+', '1'
          );
        }
      } else {
        let baseSchool = {
          'Admixture':'Evocation', 'Banishment':'Abjuration',
          'Controller':'Enchantment', 'Counterspell':'Abjuration',
          'Creation':'Conjuration', 'Enhancement':'Transmutation',
          'Foresight':'Divination', 'Generation':'Evocation',
          'Life':'Necromancy', 'Manipulator':'Enchantment',
          'Phantasm':'Illusion', 'Scryer':'Divination',
          'Shadow':'Illusion', 'Shapechange':'Transmutation',
          'Teleportation':'Conjuration', 'Undead':'Necromancy'
        };
        rules.defineRule('wizardFeatures.School Specialization (' + baseSchool[s] + ')',
          'wizardFeatures.School Specialization (' + s + ')', '=', '1'
        );
      }
    }
    rules.defineRule('features.Improved Counterspell',
      'featureNotes.counterspellMastery', '=', '1'
    );
    rules.defineRule('wizardFeatures.Acid Dart Conjuration',
      'wizardHasAcidDartConjuration', '?', null
    );
    rules.defineRule
      ('wizardFeatures.Aura Of Despair', 'wizardHasAuraOfDespair', '?', null);
    rules.defineRule
      ('wizardFeatures.Blinding Ray', 'wizardHasBlindingRay', '?', null);
    rules.defineRule
      ('wizardFeatures.Change Shape', 'wizardHasChangeShape', '?', null);
    rules.defineRule('wizardFeatures.Dazing Touch Enchantment',
      'wizardHasDazingTouchEnchantment', '?', null
    );
    rules.defineRule('wizardFeatures.Dimensional Steps',
      'wizardHasDimensionalSteps', '?', null
    );
    rules.defineRule("wizardFeatures.Diviner's Fortune",
      'wizardHasDivinersFortune', '?', null
    );
    rules.defineRule
      ('wizardFeatures.Elemental Wall', 'wizardHasElementalWall', '?', null);
    rules.defineRule('wizardFeatures.Enchanting Smile',
      'wizardHasEnchantingSmile', '?', null
    );
    rules.defineRule('wizardFeatures.Energy Absorption',
      'wizardHasEnergyAbsorption', '?', null
    );
    rules.defineRule
      ('wizardFeatures.Force Missile', 'wizardHasForceMissile', '?', null);
    rules.defineRule('wizardFeatures.Grave Touch Necromantic',
      'wizardHasGraveTouchNecromantic', '?', null
    );
    rules.defineRule
      ('wizardFeatures.Intense Spells', 'wizardHasIntenseSpells', '?', null);
    rules.defineRule('wizardFeatures.Invisibility Field',
      'wizardHasInvisibility Field', '?', null
    );
    rules.defineRule('wizardFeatures.Power Over Undead',
      'wizardHasPowerOverUndead', '?', null
    );
    rules.defineRule
      ('wizardFeatures.Protective Ward', 'wizardHasProtectiveWard', '?', null);
    rules.defineRule
      ('wizardFeatures.Scrying Adept', 'wizardHasScryingAdept', '?', null);
    rules.defineRule('wizardFeatures.Telekinetic Fist',
      'wizardHasTelekineticFist', '?', null
    );
    rules.defineRule('wizardHasAcidDartConjuration',
      'conjurationLevel', '=', '1',
      'wizardFeatures.Create Gear', '=', '0',
      'wizardFeatures.Shift', '=', '0'
    );
    rules.defineRule('wizardHasAuraOfDespair',
      'enchantmentLevel', '=', '1',
      'wizardFeatures.Irresistible Demand', '=', '0',
      'wizardFeatures.Shape Emotions', '=', '0'
    );
    rules.defineRule('wizardHasBlindingRay',
      'illusionLevel', '=', '1',
      'wizardFeatures.Binding Darkness', '=', '0',
      'wizardFeatures.Terror', '=', '0'
    );
    rules.defineRule('wizardHasChangeShape',
      'transmutationLevel', '=', '1',
      'wizardFeatures.Perfection Of Self', '=', '0'
    );
    rules.defineRule('wizardHasDazingTouchEnchantment',
      'enchantmentLevel', '=', '1',
      'wizardFeatures.Beguiling Touch', '=', '0'
    );
    rules.defineRule('wizardHasDimensionalSteps',
      'conjurationLevel', '=', '1',
      "wizardFeatures.Creator's Will", '=', '0'
    );
    rules.defineRule('wizardHasDivinersFortune',
      'divinationLevel', '=', '1',
      'wizardFeatures.Prescience', '=', '0',
      'wizardFeatures.Send Senses', '=', '0'
    );
    rules.defineRule('wizardHasElementalWall',
      'evocationLevel', '=', '1',
      'wizardFeatures.Elemental Manipulation', '=', '0'
    );
    rules.defineRule('wizardHasEnchantingSmile',
      'enchantmentLevel', '=', '1',
      'wizardFeatures.Force Of Will', '=', '0'
    );
    rules.defineRule('wizardHasEnergyAbsorption',
      'abjurationLevel', '=', '1',
      'wizardFeatures.Counterspell Mastery', '=', '0',
      // Aura Of Banishment acquired at level 8 instead of 6
      'banishmentLevel', '=', '0'
    );
    rules.defineRule('wizardHasForceMissile',
      'evocationLevel', '=', '1',
      'wizardFeatures.Versatile Evocation', '=', '0',
      'wizardFeatures.Wind Servant', '=', '0'
    );
    rules.defineRule('wizardHasGraveTouchNecromantic',
      'necromancyLevel', '=', '1',
      'wizardFeatures.Bolster', '=', '0',
      'wizardFeatures.Share Essence', '=', '0'
    );
    rules.defineRule('wizardHasIntenseSpells',
      'evocationLevel', '=', '1',
      'wizardFeatures.Lingering Evocations', '=', '0'
    );
    rules.defineRule('wizardHasInvisibilityField',
      'illusionLevel', '=', '1',
      'wizardFeatures.Bedeviling Aura', '=', '0',
      'wizardFeatures.Shadow Step', '=', '0'
    );
    rules.defineRule('wizardHasPowerOverUndead',
      'necromancyLevel', '=', '1',
      'wizardFeatures.Healing Grace', '=', '0'
    );
    rules.defineRule('wizardHasProtectiveWard',
      'abjurationLevel', '=', '1',
      'wizardFeatures.Aura Of Banishment', '=', '0',
      'wizardFeatures.Disruption', '=', '0'
    );
    rules.defineRule('wizardHasScryingAdept',
      'divinationLevel', '=', '1',
      'wizardFeatures.Foretell', '=', '0'
    );
    rules.defineRule('wizardHasTelekineticFist',
      'transmutationLevel', '=', '1',
      'wizardFeatures.Augment', '=', '0',
      'wizardFeatures.Battleshaping', '=', '0'
    );
    rules.defineRule('abilityNotes.earthGlide', 'earthLevel', '+=', null);
    rules.defineRule
      ('abilityNotes.waterSupremacy', classLevel, '?', 'source>=10');
    rules.defineRule
      ('magicNotes.earthSupremacy', classLevel, '?', 'source>=20');
    rules.defineRule('skillModifier.Fly',
      'skillNotes.airSupremacy', '+', 'isNaN(source) ? 6 : source'
    );
    rules.defineRule('skillNotes.airSupremacy',
      classLevel, '=', 'source<20 ? "+" + (2 + Math.floor(source / 5)) : "Automatic nat 20"'
    );
    rules.defineRule('skillModifier.Swim',
      'skillNotes.waterSupremacy', '+', 'isNaN(source) ? 6 : source'
    );
    rules.defineRule('skillNotes.waterSupremacy',
      classLevel, '=', 'source<20 ? "+" + (2 + Math.floor(source / 5)) : "Automatic nat 20"'
    );
  }
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
PFAPG.featRulesExtra = function(rules, name) {
  let matchInfo;
  if(name == 'Aspect Of The Beast (Night Senses)') {
    rules.defineRule('featureNotes.aspectOfTheBeast(NightSenses)',
      '', '=', '"x2 normal distance in poor light"',
      'features.Low-Light Vision', '=', '"30\' b/w vision in darkness"',
      'features.Darkvision', '=', '"+30\' Darkvision"'
    );
  } else if(name == 'Breadth Of Knowledge') {
    QuilvynUtils.getKeys(rules.getChoices('skills')).forEach(s => {
      if(s.startsWith('Knowledge') || s.startsWith('Profession'))
        rules.defineRule
          ('skillModifier.' + s, 'skillNotes.breadthOfExperience', '+', '2');
    });
  } else if((matchInfo = name.match(/^Elemental Focus .(Acid|Cold|Electricity|Fire).$/)) != null) {
    let energy = matchInfo[1];
    rules.defineRule('magicNotes.elementalFocus(' + energy + ')',
      '', '=', '1',
      'magicNotes.greaterElementalFocus(' + energy + ')', '+', '1'
    );
  } else if(name == 'Elemental Fist') {
    rules.defineRule('combatNotes.elementalFist', '', '=', '1');
  } else if(name == 'Extra Bombs') {
    rules.defineRule('combatNotes.bomb', 'combatNotes.extraBombs', '+', null);
    rules.defineRule
      ('combatNotes.extraBombs', 'feats.Extra Bombs', '=', '2 * source');
  } else if(name == 'Extra Discovery') {
    rules.defineRule
      ('featureNotes.discovery', 'featureNotes.extraDiscovery', '+', null);
    rules.defineRule
      ('featureNotes.extraDiscovery', 'feats.Extra Discovery', '=', null);
  } else if(name == 'Extra Hex') {
    rules.defineRule('featureNotes.hex', 'featureNotes.extraHex', '+', null);
    rules.defineRule('featureNotes.extraHex', 'feats.Extra Hex', '=', null);
  } else if(name == 'Extra Rage Power') {
    rules.defineRule
      ('featureNotes.ragePowers', 'featureNotes.extraRagePower', '+', null);
    rules.defineRule
      ('featureNotes.extraRagePower', 'feats.Extra Rage Power', '=', null);
  } else if(name == 'Extra Revelation') {
    rules.defineRule
      ('featureNotes.revelation', 'featureNotes.extraRevelation', '+', null);
    rules.defineRule
      ('featureNotes.extraRevelation', 'feats.Extra Revelation', '=', null);
  } else if(name == 'Extra Rogue Talent') {
    rules.defineRule
      ('featureNotes.rogueTalents', 'featureNotes.extraRogueTalent', '+', null);
    rules.defineRule
      ('featureNotes.extraRogueTalent', 'feats.Extra Rogue Talent', '=', null);
  } else if((matchInfo = name.match(/^Shield Specialization .(.*)./)) != null) {
    rules.defineRule('combatNotes.shieldSpecialization(' + matchInfo[1] + ')',
      '', '=', '1',
      'features.Greater Shield Focus', '+', '1'
    );
  } else if(name == 'Keen Scent') {
    rules.defineRule('features.Scent', 'featureRules.keenScent', '=', '1');
  } else if(name == 'Major Spell Expertise') {
    rules.defineRule('magicNotes.majorSpellExpertise',
      'feats.Major Spell Expertise', '=', null
    );
  } else if(name == 'Minor Spell Expertise') {
    rules.defineRule('magicNotes.minorSpellExpertise',
      'feats.Minor Spell Expertise', '=', null
    );
  } else if(name == 'Perfect Strike') {
    rules.defineRule('combatNotes.perfectStrike', '', '=', '2');
  } else if(name == 'Preferred Spell') {
    rules.defineRule
      ('magicNotes.preferredSpell', 'feats.Preferred Spell', '=', null);
  } else if(name == 'Punishing Kick') {
    rules.defineRule('combatNotes.punishingKick', '', '=', '5');
  } else if(name == 'Touch Of Serenity') {
    rules.defineRule('combatNotes.touchOfSerenity', '', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with bloodline #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
PFAPG.pathRulesExtra = function(rules, name) {
  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ','') + 'Level';
  if(name.match(/Mystery/)) {
    rules.defineRule('selectableFeatureCount.Oracle (' + name.replace('Mystery', 'Revelation') + ')',
      'features.' + name, '?', null,
      'featureNotes.revelation', '=', null
    );
  }
  if(name == 'Rage Subdomain') {
    // Suppress validation notes for Rage clerics w/barbarian powers
    let allSelectables = rules.getChoices('selectableFeatures');
    let powers = QuilvynUtils.getKeys(allSelectables).filter(x => x.startsWith('Barbarian') && !allSelectables[x].includes('Archetype')).map(x => x.replace('Barbarian - ', ''));
    powers.forEach(p => {
      let matchInfo =
        Pathfinder.CLASSES.Barbarian.match('(\\d+):' + p) ||
        PFAPG.CLASSES.Barbarian.match('(\\d+):' + p);
      let level = matchInfo ? matchInfo[1] : '2';
      let note = 'validationNotes.barbarian-' + p.replaceAll(' ', '') +
                 'SelectableFeature';
      rules.defineRule(note,
        pathLevel, '+', 'source >= ' + level + ' ? 1 : null',
        '', 'v', '0' // Needed for multiclass Barbarian/Rage Cleric
      );
    });
  }
  // Level-dependent domain code copied from Pathfinder for related subdomains.
  if(name.match(/(Cloud|Winds) Subdomain/)) { // Air
    rules.defineRule
      ('combatNotes.lightningArc.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('saveNotes.electricityResistance',
      pathLevel, '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );
  } else if(name.match(/(Feather|Fur) Subdomain/)) { // Animal
    rules.defineRule('companionClericLevel', pathLevel, '=', 'source - 3');
    rules.defineRule
      ('magicNotes.speakWithAnimals', pathLevel, '=', 'source + 3');
    if(name == 'Feather Subdomain')
      rules.defineRule('classSkills.Fly', pathLevel, '=', '1');
  } else if(name.match(/(Construct|Toil) Subdomain/)) { // Artifice
    rules.defineRule("combatNotes.artificer'sTouch.1",
      pathLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.dancingWeapons',
      pathLevel, '=', 'Math.floor((source - 4) / 4)'
    );
  } else if(name.match(/(Azata Chaos|Demon Chaos|Proteus) Subdomain/)) {// Chaos
    rules.defineRule('combatNotes.chaosBlade',
      pathLevel, '=', 'Math.floor((source - 4) / 4)'
    );
    rules.defineRule
      ('combatNotes.chaosBlade.1', pathLevel, '=', 'Math.floor(source / 2)');
  } else if(name.match(/(Love|Lust) Subdomain/)) { // Charm
    rules.defineRule('magicNotes.charmingSmile',
      pathLevel, '=', '10 + Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.charmingSmile.1', pathLevel, '=', null);
    rules.defineRule('magicNotes.dazingTouch', pathLevel, '=', null);
  } else if(name.match(/(Family|Home) Subdomain/)) { // Community
    rules.defineRule('magicNotes.calmingTouch.1', pathLevel, '=', null);
    rules.defineRule
      ('saveNotes.unity', pathLevel, '=', 'Math.floor((source - 4) / 4)');
  } else if(name.match(/(Loss|Night) Subdomain/)) { // Darkness
    rules.defineRule('combatNotes.touchOfDarkness',
      pathLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('featureNotes.eyesOfDarkness',
      pathLevel, '=', 'Math.floor(source / 2)'
    );
  } else if(name.match(/(Murder|Undeath) Subdomain/)) { // Death
    rules.defineRule('combatNotes.bleedingTouch',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
  } else if(name.match(/(Catastrophe|Rage) Subdomain/)) { // Destruction
    rules.defineRule('combatNotes.destructiveAura',
      pathLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.destructiveAura.1', pathLevel, '=', null);
    rules.defineRule('combatNotes.destructiveSmite',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
  } else if(name.match(/(Caves|Metal) Subdomain/)) { // Earth
    rules.defineRule
      ('magicNotes.acidDart.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('saveNotes.acidResistance',
      pathLevel, '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );
  } else if(name.match(/(Daemon|Demon Evil|Devil Evil) Subdomain/)) { // Evil
    rules.defineRule('combatNotes.scytheOfEvil',
      pathLevel, '=', 'Math.floor((source - 4) / 4)'
    );
    rules.defineRule
      ('combatNotes.scytheOfEvil.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('combatNotes.touchOfEvil',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
  } else if(name.match(/(Ash|Smoke) Subdomain/)) { // Fire
    rules.defineRule
      ('combatNotes.fireBolt.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('saveNotes.fireResistance',
      pathLevel, '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );
  } else if(name.match(/(Heroism|Honor) Subdomain/)) { // Glory
    rules.defineRule('magicNotes.divinePresence',
      pathLevel, '=', '10 + Math.floor(source / 2)',
      'wisdomModifier', '+', null
    );
    rules.defineRule('magicNotes.divinePresence.1', pathLevel, '=', null);
    rules.defineRule('magicNotes.touchOfGlory', pathLevel, '=', null);
  } else if(name.match(/(Agathion|Archon Good|Azata Good) Subdomain/)) { // Good
    rules.defineRule('combatNotes.holyLance',
      pathLevel, '=', 'Math.floor((source - 4) / 4)'
    );
    rules.defineRule
      ('combatNotes.holyLance.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.touchOfGood',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
  } else if(name.match(/(Restoration|Resurrection) Subdomain/)) { // Healing
    rules.defineRule
      ('magicNotes.rebukeDeath.1', pathLevel, '=', 'Math.floor(source / 2)');
  } else if(name.match(/(Memory|Thought) Subdomain/)) { // Knowledge
    rules.defineRule('magicNotes.remoteViewing', pathLevel, '=', null);
    rules.defineRule('skillNotes.loreKeeper', pathLevel, '=', 'source + 15');
  } else if(name.match(/(Archon Law|Devil Law|Inevitable) Subdomain/)) { // Law
    rules.defineRule('combatNotes.staffOfOrder',
      pathLevel, '=', 'Math.floor((source - 4) / 4)'
    );
    rules.defineRule
      ('combatNotes.staffOfOrder.1', pathLevel, '=', 'Math.floor(source / 2)');
  } else if(name.match(/(Freedom|Revolution) Subdomain/)) { // Liberation
    rules.defineRule("magicNotes.freedom'sCall", pathLevel, '=', null);
    rules.defineRule('magicNotes.liberation', pathLevel, '=', null);
  } else if(name.match(/(Curse|Fate) Subdomain/)) { // Luck
    rules.defineRule
      ('magicNotes.goodFortune', pathLevel, '=', 'Math.floor(source / 6)');
  } else if(name.match(/(Insanity|Nightmare) Subdomain/)) { // Madness
    rules.defineRule('magicNotes.auraOfMadness', pathLevel, '=', null);
    rules.defineRule('magicNotes.auraOfMadness.1',
      pathLevel, '=', '10 + Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.visionOfMadness',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('magicNotes.visionOfMadness.1',
      pathLevel, '=', 'Math.max(1, Math.floor(source / 2))'
    );
  } else if(name.match(/(Arcana|Divine) Subdomain/)) { // Magic
    rules.defineRule('magicNotes.dispellingTouch',
      pathLevel, '=', 'Math.floor((source - 4) / 4)'
    );
  } else if(name.match(/(Leadership|Martyr) Subdomain/)) { // Nobility
    rules.defineRule('magicNotes.inspiringWord',
      pathLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name.match(/(Decay|Growth) Subdomain/)) { // Plant
    rules.defineRule('combatNotes.brambleArmor', pathLevel, '=', null);
    rules.defineRule('combatNotes.brambleArmor.1',
      pathLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('combatNotes.woodenFist',
      pathLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name.match(/(Defense|Purity) Subdomain/)) { // Protection
    rules.defineRule('magicNotes.auraOfProtection',
      pathLevel, '=', 'Math.floor((source - 4) / 4)'
    );
    rules.defineRule('magicNotes.auraOfProtection.1',
      pathLevel, '=', 'source>=14 ? 10 : 5'
    );
    rules.defineRule('magicNotes.auraOfProtection.2', pathLevel, '=', null);
    rules.defineRule
      ('saveNotes.saveBonus', pathLevel, '=', '1 + Math.floor(source / 5)');
  } else if(name.match(/(Ancestors|Souls) Subdomain/)) { // Repose
    rules.defineRule('magicNotes.wardAgainstDeath', pathLevel, '=', null);
  } else if(name.match(/(Language|Wards) Subdomain/)) { // Rune
    rules.defineRule('magicNotes.blastRune', pathLevel, '=', null);
    rules.defineRule('magicNotes.blastRune.1',
      'features.Blast Rune', '?', null,
      pathLevel, '=', 'Math.floor(source / 2)'
    );
  } else if(name.match(/(Ferocity|Resolve) Subdomain/)) { // Strength
    rules.defineRule('magicNotes.mightOfTheGods', pathLevel, '=', null);
    rules.defineRule('magicNotes.mightOfTheGods.1', pathLevel, '=', null);
    rules.defineRule('magicNotes.strengthSurgeTouch',
      pathLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name.match(/(Day|Light) Subdomain/)) { // Sun
    rules.defineRule("magicNotes.sun'sBlessing", pathLevel, '=', null);
    rules.defineRule('magicNotes.nimbusOfLight', pathLevel, '=', null);
    rules.defineRule('magicNotes.nimbusOfLight.1', pathLevel, '=', null);
  } else if(name.match(/(Exploration|Trade) Subdomain/)) { // Travel
    rules.defineRule
      ('magicNotes.dimensionalHop', pathLevel, '=', '10 * source');
  } else if(name.match(/(Deception|Thievery) Subdomain/)) { // Trickery
    rules.defineRule('magicNotes.copycat', pathLevel, '=', null);
    rules.defineRule("magicNotes.master'sIllusion",
      pathLevel, '=', '10 + Math.floor(source / 2)'
    );
    rules.defineRule("magicNotes.master'sIllusion.1", pathLevel, '=', null);
  } else if(name.match(/(Blood|Tactics) Subdomain/)) { // War
    rules.defineRule('combatNotes.battleRage',
      pathLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('combatNotes.weaponMaster', pathLevel, '=', null);
  } else if(name.match(/(Ice|Oceans) Subdomain/)) { // Water
    rules.defineRule
      ('combatNotes.icicle.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('saveNotes.coldResistance',
      pathLevel, '=', 'source>=20 ? Infinity : source>=12 ? 20 : 10'
    );
  } else if(name.match(/(Seasons|Storms) Subdomain/)) { // Weather
    rules.defineRule
      ('combatNotes.stormBurst.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.lightningLord', pathLevel, '=', null);
  } else if(name == 'Bones Mystery') {
    rules.defineRule
      ('channelLevel', 'magicNotes.undeadServitude.1', '=', null);
    rules.defineRule
      ('features.Command Undead', 'features.Undead Servitude', '=', '1');
    rules.defineRule
      ('features.Command Undead', 'features.Undead Servitude', '=', '1');
    rules.defineRule('magicNotes.undeadServitude',
      'charismaModifier', '=', '3 + source',
      'magicNotes.extraChannel', '+', '2'
    );
    rules.defineRule('magicNotes.undeadServitude.1',
      'features.Undead Servitude', '?', null,
      pathLevel, '=', null
    );
    rules.defineRule('validationNotes.extraChannelFeat',
      'features.Undead Servitude', '=', '0'
    );
    rules.defineRule('validationNotes.improvedChannelFeat',
      'features.Undead Servitude', '=', '0'
    );
  } else if(name == 'Flame Mystery') {
    rules.defineRule('featureNotes.cinderDance',
      pathLevel, '=', 'source>=10 ? "Nimble Moves and Acrobatic Steps" : source>=5 ? "Nimble Moves" : null'
    );
    rules.defineRule('features.Acrobatic Steps',
      'featureNotes.cinderDance', '=', 'source.includes("Acrobatic Steps") ? 1 : null'
    );
    rules.defineRule('features.Nimble Moves',
      'featureNotes.cinderDance', '=', 'source.includes("Nimble Moves") ? 1 : null'
    );
    rules.defineRule
      ('magicNotes.gazeOfFlames', pathLevel, '=', 'source>=7 ? source : null');
  } else if(name == 'Heavens Mystery') {
    rules.defineRule
      ('magicNotes.lureOfTheHeavens', pathLevel, '?', 'source>=5');
    rules.defineRule('magicNotes.lureOfTheHeavens.1',
      'features.Lure Of The Heavens', '?', null,
      pathLevel, '=', 'source>=10 ? ", <i>Fly</i> effects for " + source + " min/dy" : ""'
    );
    rules.defineRule('saveNotes.finalRevelation(HeavensMystery)',
      'charismaModifier', '=', null
    );
  } else if(name == 'Life Mystery') {
    rules.defineRule
      ('features.Channel Energy', 'featureNotes.channel', '=', '1');
    // Oracle channeling gives two fewer uses/dy than Cleric
    rules.defineRule
      ('magicNotes.channelEnergy', 'featureNotes.channel', '+', '-2');
    rules.defineRule('magicNotes.channelEnergy.1',
      'levels.Oracle', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.channelEnergy.2',
      'levels.Oracle', '+=', '10 + Math.floor(source / 2)'
    );
  } else if(name == 'Lore Mystery') {
    // NOTE: This calculation works only if taken at lowest possible (7th) level
    rules.defineRule('abilityNotes.mentalAcuity',
      pathLevel, '=', 'Math.floor((source - 4) / 3)'
    );
    rules.defineRule('combatNotes.sidestepSecret.1',
      'combatNotes.sidestepSecret', '?', null,
      'saveNotes.sidestepSecret', '?', null, // For italics
      'charismaModifier', '=', null,
      'dexterityModifier', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
      'combatNotes.sidestepSecret.1', '+', null
    );
    rules.defineRule('magicNotes.whirlwindLesson.1',
      'features.Whirlwind Lesson', '?', null,
      pathLevel, '=', 'source>=7 ? " and share with another " + (source>=15 ? source : 1) + " for %2 hr" : ""'
    );
    rules.defineRule
      ('magicNotes.whirlwindLesson.2', 'charismaModifier', '=', null);
    rules.defineRule('saveNotes.dexterityReflexAdjustment',
      'combatNotes.sidestepSecret.1', '+', null
    );
    rules.defineRule('skillNotes.loreKeeper(Oracle).1',
      'skillNotes.loreKeeper(Oracle)', '?', null,
      'charismaModifier', '=', null,
      'intelligenceModifier', '+', '-source',
      '', '^', '0'
    );
    QuilvynUtils.getKeys(rules.getChoices('skills'), /Knowledge/).forEach(s => {
      rules.defineRule
        ('skillModifier.' + s, 'skillNotes.loreKeeper(Oracle).1', '+', null);
    });
  } else if(name == 'Nature Mystery') {
    rules.defineRule("combatNotes.nature'sWhispers",
      'charismaModifier', '=', null,
      'dexterityModifier', '+', '-source'
    );
    rules.defineRule('companionOracleLevel',
      'oracleFeatures.Bonded Mount', '?', null,
      'levels.Oracle', '=', null
    );
    rules.defineRule
      ('companionMasterLevel', 'companionOracleLevel', '^=', null);
  } else if(name == 'Stone Mystery') {
    rules.defineRule('featureNotes.stoneStability',
      pathLevel, '=', 'source<5 ? null : source<10 ? "Improved Trip feature" : "Improved Trip and Greater Trip features"'
    );
    rules.defineRule('features.Greater Trip',
      'featureNotes.stoneStability', '=', 'source.includes("Greater Trip") ? 1 : null'
    );
    rules.defineRule('features.Improved Trip',
      'featureNotes.stoneStability', '=', 'source.includes("Improved Trip") ? 1 : null'
    );
  } else if(name == 'Waves Mystery') {
    rules.defineRule('abilityNotes.fluidTravel.1',
      pathLevel, '=', 'source>=7 ? " or breathe water and swim 60\'/rd underwater" : ""'
    );
    rules.defineRule('featureNotes.fluidNature',
      pathLevel, '=', 'source>=5 ? "Dodge" : null'
    );
    rules.defineRule('features.Dodge',
      'featureNotes.fluidNature', '=', 'source.includes("Dodge") ? 1 : null'
    );
    rules.defineRule('magicNotes.waterSight',
      pathLevel, '=', 'source>=15 ? "Greater Scrying" : source>=7 ? "Scry" : null'
    );
  } else if(name == 'Wind Mystery') {
    rules.defineRule
      ('features.Brew Potion', 'featureNotes.cauldronHex', '=', '1');
    rules.defineRule
      ('magicNotes.windSight', pathLevel, '=', 'source>=7 ? source : null');
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
PFAPG.raceRulesExtra = function(rules, name) {
  let alternatives = [];
  let prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
  if(name == 'Half-Elf') {
    alternatives = [
      ['Adaptability', 'Ancestral Arms', 'Dual Minded', 'Integrated',
       'Sociable (Half-Elf)', 'Water Child'],
      ['Multitalented', 'Arcane Training', 'Water Child']
    ];
    rules.defineRule('selectableFeatureCount.Half-Elf (Racial Trait)',
      'half-ElfFeatures.Water Child', '+', '-1'
    );
  } else if(name == 'Half-Orc') {
    alternatives = [
      ['Weapon Familiarity (Orc Double Axe)', 'Chain Fighter'],
      ['Intimidating', 'Cavewight', 'Plagueborn', 'Rock Climber', 'Scavenger'],
      ['Orc Ferocity', 'Beastmaster', 'Bestial', 'Gatecrasher', 'Plagueborn',
       'Sacred Tattoo', 'Toothy']
    ];
    rules.defineRule('features.Weapon Familiarity (Dire Flail)',
      'featureNotes.chainFighter', '=', '1'
    );
    rules.defineRule('features.Weapon Familiarity (Net)',
      'featureNotes.beastmaster', '=', '1'
    );
    rules.defineRule('features.Weapon Familiarity (Spiked Chain)',
      'featureNotes.chainFighter', '=', '1'
    );
    rules.defineRule('features.Weapon Familiarity (Whip)',
      'featureNotes.beastmaster', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Flail)',
      'featureNotes.chainFighter', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Heavy Flail)',
      'featureNotes.chainFighter', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Half-Orc (Racial Trait)',
      'half-OrcFeatures.Plagueborn', '+', '-1'
    );
  } else if(name.match(/Dwarf/)) {
    alternatives = [
      ['Dwarf Hatred', 'Ancient Enmity'],
      ['Greed', 'Craftsman', 'Lorekeeper'],
      ['Defensive Training', 'Deep Warrior'],
      ['Hardy', 'Magic Resistant', 'Stubborn'],
      ['Stability', 'Relentless'],
      ['Stonecunning', 'Stonesinger']
    ];
  } else if(name.match(/Elf/)) {
    alternatives = [
      ['Weapon Familiarity (Elven Curve Blade)', 'Spirit Of The Waters'],
      ['Elven Immunities', 'Dreamspeaker', 'Lightbringer'],
      ['Elven Magic', 'Desert Runner', 'Eternal Grudge', 'Lightbringer',
       'Silent Hunter', 'Spirit Of The Waters', 'Woodcraft']
    ];
    rules.defineRule('selectableFeatureCount.Elf (Racial Trait)',
      'elfFeatures.Lightbringer', '+', '-1',
      'elfFeatures.Spirit Of The Waters', '+', '-1'
    );
    rules.defineRule('features.Weapon Proficiency (Longspear)',
      'featureNotes.spiritOfTheWaters', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Net)',
      'featureNotes.spiritOfTheWaters', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Trident)',
      'featureNotes.spiritOfTheWaters', '=', '1'
    );
  } else if(name.match(/Gnome/)) {
    alternatives = [
      ['Defensive Training','Eternal Hope', 'Gift Of Tongues', 'Master Tinker',
       'Warden Of Nature'],
      ['Gnome Hatred', 'Eternal Hope', 'Gift Of Tongues', 'Master Tinker',
       'Warden Of Nature'],
      ['Gnome Magic', 'Magical Linguist', 'Pyromaniac'],
      ['Obsessive', 'Academician'],
      ['Resist Illusion', 'Magical Linguist', 'Pyromaniac']
    ];
    rules.defineRule('skillNotes.giftOfTongues.1',
      'skillNotes.Gift Of Tongues', '?', null,
      '', '=', '0',
      'skills.Linguistics', '+', null
    );
    rules.defineRule('selectableFeatureCount.Gnome (Racial Trait)',
      'gnomeFeatures.Eternal Hope', '+', '-1',
      'gnomeFeatures.Gift Of Tongues', '+', '-1',
      'gnomeFeatures.Magical Linguist', '+', '-1',
      'gnomeFeatures.Master Tinker', '+', '-1',
      'gnomeFeatures.Pyromaniac', '+', '-1',
      'gnomeFeatures.Warden Of Nature', '+', '-1'
    );
  } else if(name.match(/Halfling/)) {
    alternatives = [
      ['Fearless', 'Craven', 'Practicality', 'Wanderlust'],
      ['Halfling Luck', 'Craven', 'Underfoot (Halfling)', 'Wanderlust'],
      ['Keen Senses', 'Low Blow'],
      ['Sure-Footed', 'Outrider', 'Practicality', 'Swift As Shadows',
       'Warslinger']
    ];
    rules.defineRule('selectableFeatureCount.Halfling (Racial Trait)',
      'halflingFeatures.Craven', '+', '-1',
      'halflingFeatures.Practicality', '+', '-1',
      'halflingFeatures.Wanderlust', '+', '-1'
    );
  } else if(name.match(/Human/)) {
    alternatives = [
      ['Bonus Feat','Eye For Talent'],
      ['Skilled', 'Heart Of The Fields', 'Heart Of The Streets',
       'Heart Of The Wilderness']
    ];
    rules.defineRule('skillNotes.heartOfTheWilderness',
      'level', '=', 'Math.floor(source / 2)'
    );
  }
  if(alternatives.length > 0) {
    rules.defineRule('selectableFeatureCount.' + name + ' (Racial Trait)',
      prefix + 'Level', '=', alternatives.length
    );
    for(let i = 0; i < alternatives.length; i++) {
      let group = alternatives[i];
      // Override level-based feature acquisition
      rules.defineRule
        (prefix + 'Features.' + group[0], prefix + 'Level', '=', 'null');
      group.forEach(choice => {
        let note =
          'validationNotes.' + prefix + '-' + choice.replaceAll(' ' , '') + 'Alternatives' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(i);
        let text = 'May only select one from ' + name + ' features ' + group.join(', ');
        rules.defineChoice('notes', note + ':' + text);
        rules.defineRule(note, prefix + 'Features.' + choice, '?', null);
        group.filter(alt => alt != choice).forEach(alt => {
          rules.defineRule(note, prefix + 'Features.' + alt, '+=', '1');
        });
      });
    }
  }
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
PFAPG.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'companion' &&
      ('levels.Cavalier' in attributes ||
       'selectableFeatures.Oracle - Bonded Mount' in attributes)) {
    let howMany = 1;
    for(let attr in attributes) {
      if(attr.startsWith('animalCompanion.'))
        howMany = 0;
    }
    if(howMany > 0) {
      let choices =
        'features.Small' in attributes && attributes['levels.Cavalier'] >= 4 ?
          ['Pony', 'Wolf', 'Boar', 'Dog'] :
        'features.Small' in attributes ? ['Pony', 'Wolf'] : ['Camel', 'Horse'];
      attributes['animalCompanion.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
      attributes.animalCompanionName = SRD35.randomName(null);
    }
  }
  if(attribute == 'companion' && 'levels.Summoner' in attributes) {
    let choices = [];
    let howMany = 1;
    for(let attr in PFAPG.ANIMAL_COMPANIONS) {
      if(!attr.match(/Eidolon/))
        continue;
      if('animalCompanion.' + attr in attributes)
        howMany--;
      else
        choices.push(attr);
    }
    if(howMany == 1 && choices.length > 0) {
      attributes['animalCompanion.' + choices[QuilvynUtils.random(0, choices.length - 1)]] = 1;
      attributes.animalCompanionName = SRD35.randomName(null);
    }
  }
  Pathfinder.randomizeOneAttribute.apply
    (Pathfinder.rules, [attributes, attribute]);
};

/* Returns HTML body content for user notes associated with this rule set. */
PFAPG.ruleNotes = function() {
  return '' +
    "<h2>Quilvyn Pathfinder Advanced Player's Guide Rule Set Notes</h2>\n" +
    '<p>\n' +
    "Quilvyn Pathfinder Advanced Player's Guide Rule Set Version " + PFAPG.VERSION + '\n' +
    '</p>\n' +
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

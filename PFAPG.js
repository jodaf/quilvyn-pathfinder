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
  PFAPG.magicRules(rules, PFAPG.SPELLS, PFAPG.SPELLS_LEVELS_ADDED);
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
    PFAPG.TRAITS, PFAPG.PRESTIGES, {}
  );
  msAfter = new Date().getTime();
  //console.log('identityRules took ' + (msAfter - msBefore) + ' ms');

  rules.randomizeOneAttribute = PFAPG.randomizeOneAttribute;

}

PFAPG.VERSION = '2.3.1.0';

PFAPG.ANIMAL_COMPANIONS = {
  // Eidolon have the same stats as animal companions with modified
  // calculations.
  'Biped Eidolon':
    'Str=16 Dex=12 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=2 Attack=0 Dam=2@1d4 ' +
    'Size=M',
  'Quadruped Eidolon':
    'Str=14 Dex=14 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=2 Attack=0 Dam=1d6 ' +
    'Size=M',
  'Serpentine Eidolon':
    'Str=12 Dex=16 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=2 Attack=0 Dam=1d6,1d6 ' +
    'Size=M'
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
      '"baseAttackBonus >= 11"',
  'Bloody Assault':
    'Type=General,Fighter ' +
    'Require="features.Power Attack","baseAttackBonus >= 6"',
  'Bodyguard':'Type=General,Fighter Require="features.Combat Reflexes"',
  "In Harm's Way":'Type=General,Fighter Require="features.Bodyguard"',
  // Also, age >= 100
  'Breadth Of Experience':'Type=General Require="race =~ \'Dwarf|Elf|Gnome\'"',
  'Bull Rush Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Bull Rush","baseAttackBonus >= 9"',
  'Charge Through':
    'Type=General,Fighter ' +
    'Require="features.Improved Overrun","baseAttackBonus >= 1"',
  'Childlike':'Type=General Require="charisma >= 13","race =~ \'Halfling\'"',
  'Cockatrice Strike':
    'Type=General,Fighter ' +
    'Require="features.Medusa\'s Wrath","baseAttackBonus >= 14"',
  'Combat Patrol':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Combat Reflexes",' +
      'features.Mobility,' +
      '"baseAttackBonus >= 5"',
  // TODO
  // 'Cooperative Crafting':'Type=General Require=""'1 rank in any Craft skill, any item creation feat 
  'Cosmopolitan':'Type=General',
  'Covering Defense':
    'Type=General,Feature ' +
    'Require="features.Shield Focus","baseAttackBonus >= 6"',
  'Crippling Critical':
    'Type=General,Fighter ' +
    'Require="features.Critical Focus","baseAttackBonus >= 13"',
  'Crossbow Mastery':
    'Type=General,Fighter ' +
    'Require="dexterity >= 15","features.Rapid Reload","features.Rapid Shot"',
  'Dastardly Finish':'Type=General,Fighter Require="sneakAttack >= 5"',
  'Dazing Assault':
    'Type=General,Fighter ' +
    'Require="features.Power Attack","baseAttackBonus >= 11"',
  'Deep Drinker':
    'Type=General ' +
    'Require="constitution >= 13","levels.Monk >= 11","features.Drunken Ki"',
  'Deepsight':'Type=General Require="features.Darkvision"',
  'Disarming Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Disarm","baseAttackBonus >= 9"',
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
      '"baseAttackBonus >= 6"',
  'Elemental Fist':
    'Type=General,Fighter ' +
    'Require=' +
      '"constitution >= 13",' +
      '"wisdom >= 13",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttackBonus >= 8"',
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
  'Focused Shot':
    'Type=General,Fighter Require="intelligence >= 13","features.Precise Shot"',
  'Following Step':
    'Type=General,Fighter Require="dexterity >= 13","features.Step Up"',
  'Step Up and Strike':
    'Type=General,Fighter ' +
    'Require="features.Following Step","baseAttackBonus >= 6"',
  'Furious Focus':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttackBonus >= 1"',
  'Dreadful Carnage':
    'Type=General,Fighter ' +
    'Require="strength >= 15","features.Furious Focus","baseAttackBonus >= 11"',
  'Gang Up':'Type=General,Fighter Require="features.Combat Expertise"',
  'Team Up':
    'Type=General,Fighter Require=features.Gang-Up,"baseAttackBonus >= 6"',
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
    'Require="features.Improved Dirty Trick","baseAttackBonus >= 6"',
  'Improved Drag':'Type=General,Fighter Require="features.Power Attack"',
  'Greater Drag':
    'Type=General,Fighter ' +
    'Require="features.Improved Drag","baseAttackBonus >= 6"',
  'Improved Reposition':
    'Type=General,Fighter Require="features.Combat Expertise"',
  'Greater Reposition':
    'Type=General,Fighter ' +
    'Require="features.Improved Reposition","baseAttackBonus >= 6"',
  'Improved Share Spells':'Type=General Require="skills.Spellcraft >= 10"',
  'Improved Steal':'Type=General,Fighter Require="features.Combat Expertise"',
  'Greater Steal':
    'Type=General,Fighter ' +
    'Require="features.Improved Steal","baseAttackBonus >= 6"',
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
    'Require="features.Shot on the Run","baseAttackBonus >= 6"',
  'Pass for Human':
    'Type=General Require="race =~ \'Half-Elf|Half-Orc|Halfling\'"',
  'Perfect Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"wisdom >= 13",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttackBonus >= 8"',
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
      '"baseAttackBonus >= 8"',
  'Pushing Assault':
    'Type=General,Fighter ' +
    'Require="strength >= 15","features.Power Attack","baseAttackBonus >= 1"',
  'Racial Heritage':'Type=General Require="race =~ \'Human\'"',
  'Raging Vitality':'Type=General Require="constitution >= 15",features.Rage',
  'Razortusk':'Type=General Require="race == \'Half-Orc\'"',
  'Rending Claws':
    'Type=General,Fighter ' +
    'Require="strength >= 13",weapons.Claws,"baseAttackBonus >= 6"',
  'Repositioning Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Reposition","baseAttackBonus >= 9"',
  'Saving Shield':'Type=General,Fighter Require="features.Shield Proficiency"',
  'Second Chance':
    'Type=General,Fighter ' +
    'Require="features.Combat Expertise","baseAttackBonus >= 6"',
  'Improved Second Chance':
    'Type=General,Fighter ' +
    'Require="features.Second Chance","baseAttackBonus >= 11"',
  'Shadow Strike':'Type=General,Fighter Require="baseAttackBonus >= 1"',
  'Shared Insight':'Type=General Require="wisdom >= 13","race == \'Half-Elf\'"',
  'Sharp Senses':'Type=General Require="features.Keen Senses"',
  'Shield Of Swings':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttackBonus >= 1"',
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
    'Require="features.Power Attack","baseAttackBonus >= 16"',
  "Summoner's Call":'Type=General Require=features.Eidolon',
  'Sundering Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Sunder","baseAttackBonus >= 9"',
  'Swift Aid':
    'Type=General,Fighter ' +
    'Require="features.Combat Expertise","baseAttackBonus >= 6"',
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
      '"baseAttackBonus >= 8"',
  'Trick Riding':
    'Type=General,Fighter Require="skills.Ride >= 9","features.Mounted Combat"',
  'Mounted Skirmisher':
    'Type=General,Fighter Require="skills.Ride >= 14","features.Trick Riding"',
  'Tripping Strike':
    'Type=General,Fighter ' +
    'Require="features.Improved Trip","baseAttackBonus >= 9"',
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
  'Outflank':'Type=Teamwork,Fighter Require="baseAttackBonus >= 4"',
  'Paired Opportunists':'Type=Teamwork,Fighter',
  'Precise Strike':
    'Type=Teamwork,Fighter Require="dexterity >= 13","baseAttackBonus >= 1"',
  'Shield Wall':'Type=Teamwork,Fighter Require="features.Shield Proficiency"',
  'Shielded Caster':'Type=Teamwork',
  'Swap Places':'Type=Teamwork,Fighter'
};
PFAPG.FEATURES = {
  // Existing base class options
  'Beast Totem':
   'Section=combat Note="+%{levels.Barbarian//4+1} AC during rage"',
  'Greater Beast Totem':
    'Section=combat ' +
    'Note="May make full attack at the end of a charge, increased Lesser Beast Totem effects"',
  'Lesser Beast Totem':
    'Section=combat ' +
    'Note="Claws inflict 1d%V+%{strengthModifier}x%1@20 HP during rage"',
  'Boasting Taunt':
    'Section=combat ' +
    'Note="Successful Intimidate shakes target until attacks self"',
  'Brawler':
    'Section=combat Note="Has Improved Unarmed Strike features during rage"',
  'Greater Brawler':
    'Section=combat ' +
    'Note="Has Two-Weapon Fighting features for unarmed attacks during rage"',
  'Chaos Totem':
    'Section=combat,skill ' +
    'Note=' +
      '"25% chance to ignore critical hit and sneak attack damage during rage",' +
      '"+4 Escape Artist during rage"',
  'Greater Chaos Totem':
    'Section=combat ' +
    'Note="DR %{levels.Barbarian//2}/lawful and weapons are chaotic during rage"',
  'Lesser Chaos Totem':
    'Section=combat ' +
    'Note="+V AC vs. lawful foe, +V saves vs. confusion, insanity, polymorph, and lawful effects during rage"',
  'Come And Get Me':
    'Section=combat ' +
    'Note="May trade +4 foe attack and damage for AOO after every foe attack during rage"',
  'Elemental Rage':
    'Section=combat Note="Attacks do +1d6 energy damage during rage"',
  'Greater Elemental Rage':
   'Section=combat ' +
   'Note="Critical hits do +1d10 or better energy damage during rage"',
  'Lesser Elemental Rage':
    'Section=combat Note="Attacks do +1d6 energy damage 1/rage"',
  'Energy Absorption':
    'Section=combat ' +
    'Note="May convert energy damage to self to 1/3 temporary HP 1/rage"',
  'Energy Eruption':
    'Section=combat ' +
    'Note="May convert energy damage to self to breath attack of equal HP (DC %{10+levels.Barbarian//2+constitutionModifier} half) 1/rage"',
  'Energy Resistance':
    'Section=save ' +
    'Note="Resistance %{levels.Barbarian//2>?1} to chosen energy during rage"',
  'Greater Energy Resistance':
    'Section=combat Note="Chosen energy attack does half damage 1/rage"',
  'Ferocious Mount':
    'Section=combat Note="May give mount rage benefits during rage"',
  'Greater Ferocious Mount':
    'Section=combat Note="May give mount rage power benefits during rage"',
  'Ferocious Trample':
    'Section=combat ' +
    'Note="Mount trample inflicts 1d8+strength (L/H mount 2d6/2d8, Ref half) during rage"',
  'Greater Ferocious Trample':
    'Section=combat ' +
    'Note="Mount may trample targets of same size and overrun during rage"',
  'Fiend Totem':
    'Section=combat ' +
    'Note="Successful foe unarmed or natural weapon attack inflicts 1d6 HP on attacker during rage"',
  'Greater Fiend Totem':
    'Section=combat ' +
    'Note="Adjacent good creatures suffer 2d6 HP and shaken, neutral creatures shaken"',
  'Lesser Fiend Totem':
    'Section=combat ' +
    'Note="Gore attack inflicts 1d{features.Small ? 6 : 8} during rage"',
  'Flesh Wound':
    'Section=combat ' +
    'Note="Successful DC damge Fort reduces damage to half nonlethal 1/rage"',
  'Good For What Ails You':
    'Section=combat Note="Alcohol gives save vs. condition during rage"',
  'Ground Breaker':
    'Section=combat ' +
    'Note="May knock prone adjacent creatures (DC 15 Ref neg) and create difficult terrain 1/rage"',
  'Guarded Life':
    'Section=combat ' +
    'Note="%{levels.Barbarian} HP damage converted to nonlethal when taken to negative HP and automatically stabilizes during rage"',
  'Hurling':
    'Section=combat Note="May hurl 20\' or +1 size objects during rage"',
  'Greater Hurling':
    'Section=combat Note="May hurl 30\' or +2 size objects during rage"',
  'Lesser Hurling':
    'Section=combat ' +
    'Note="R10\' Thrown object inflicts 1d6+%{strengthModifier} or more during rage"',
  'Hurling Charge':
    'Section=combat ' +
    'Note="May make +2 thrown attack while charging during rage"',
  'Inspire Ferocity':
    'Section=combat ' +
    'Note="R30\' May share Reckless Abandon ability with allies for %{charismaModifier} rd"',
  'Knockdown':
    'Section=combat ' +
    'Note="May make trip attack w/out AOO that inflicts %{strengthModifier} HP and knocks prone 1/rage"',
  'Liquid Courage':
    'Section=save ' +
    'Note="Alcohol gives up to +%{levels.Barbarian//4} vs. mind-affecting effects during rage"',
  'Overbearing Advance':
    'Section=combat ' +
    'Note="Successful overrun inflicts %{strengthModifier} HP during rage"',
  'Overbearing Onslaught':
    'Section=combat Note="May make additional -2 overruns during rage"',
  'Reckless Abandon':
    'Section=combat ' +
    'Note="May trade up to -%{levels.Barbarian//4+1} AC for equal attack bonus during rage"',
  'Roaring Drunk':
    'Section=save,skill ' +
    'Note=' +
      '"Alcohol gives up to +%{levels.Barbarian//4} vs. fear during rage",' +
      '"Alcohol gives up to +%{levels.Barbarian//4} Intimidate during rage"',
  'Smasher':
    'Section=combat Note="May have attack ignore object hardness 1/rage"',
  'Spirit Steed':
    'Section=combat ' +
    'Note="Mount gains DR %{levels.Barbarian//2}/magic during rage"',
  'Spirit Totem':
    'Section=combat ' +
    'Note="Spirits give 20% miss chance vs. ranged and non-adjacent attacks during rage"',
  'Greater Spirit Totem':
    'Section=combat ' +
    'Note="Spirits inflict 1d8 HP on adjacent foes, may attack 15\' away for 1d6 HP during rage"',
  'Lesser Spirit Totem':
    'Section=combat ' +
    'Note="Spirit attack inflicts 1d4+%{charismaModifier} HP 1/rd during rage"',
  'Staggering Drunk':
    'Section=combat ' +
    'Note="Alcohol gives up to +%{levels.Barbarian//4} HP vs. AOO during rage"',
  'Witch Hunter':
    'Section=combat ' +
    'Note="Gives +%{levels.Barbarian//4+1} damage vs. spell users"',
  'Destructive':
    'Section=combat ' +
    'Note="+%{levels.Barbarian} damage vs. objects or with sunder"',
  'Battle Scavenger':
    'Section=combat ' +
    'Note="No attack penalty and +%{(levels.Barbarian-3)//3} damage w/improvised and broken weapons"',
  'Savage Grapple"':
   'Section=combat ' +
   'Note="%V grappled penalties/Always has AOO vs. grapple, success gives +2 vs. grapple "',
  'Pit Fighter':
    'Section=combat ' +
    'Note="+%{armor==\'None\' ? 2 : 1} on %{(levels.Barbarian-3)//3} combat maneuvers"',
  'Improved Savage Grapple':
    'Section=combat Note="Increased Savage Grapple effects/Treated as one size larger for grappling and swallowing"',
  'Raging Drunk':
    'Section=combat ' +
    'Note="May drink alcohol or potion w/out AOO during rage/Alchohol extends rage 1 rd"',
  'Elemental Fury':
    'Section=combat ' +
    'Note="Taking %{levels.Barbarian} HP energy damage adds %{levels.Barbarian//3} to daily rage rds"',
  'Skilled Thrower':
    'Section=combat Note="+10\' range for thrown weapons and objects"',
  'Invulnerability':
    'Section=combat Note="DR %{levels.Barbarian//2}/-, dbl nonlethal"',
  'Extreme Endurance':
    'Section=save ' +
    'Note="Inured to choice of hot or cold climate/Resistance %{(levels.Barbarian-3)//3} to choice of fire or cold"',
  'Fast Ride':'Section=feature Note="+5\' Mount speed"',
  'Bestial Mount':'Section=feature Note="Has Animal Companion features"',
  'Naked Courage':
    'Section=combat,save ' +
    'Note=' +
      '"+%V AC in no armor",' +
      '"+%{(levels.Barbarian+3)//6} saves vs. fear in no armor"',
  'Natural Toughness':'Section=combat Note="+V AC in no armor"',
  'Sixth Sense':'Section=combat Note="+%V Initiative/+V AC during surprise rd"',
  'Keen Senses (Barbarian)':
    'Section=feature Note="Has Low-Light Vision%1 features"',

  'Protective Aura':
    'Section=magic ' +
    'Note="R30\' Allies gain +2 AC, +2 saves, and <i>Protection From Evil</i> effects %{levels.Cleric} rd/dy"',
  'Speak With Dead':
    'Section=magic Note="May ask question of corpse %{levels.Cleric}/dy"',
  'Arcane Beacon':
    'Section=magic ' +
    'Note="15\' radius gives arcane spells +1 caster level or DC for 1 rd %{3+wisdomModifier}/dy"',
  'Aura Of Menace':
    'Section=magic ' +
    'Note="30\' radius inflicts -2 AC, attack, and saves on foes %{levels.Cleric} rd/dy"',
  'Wall Of Ashes':
    'Section=magic ' +
    'Note="R100\' %{levels.Cleric*10}\'x20\' ash wall blocks sight, blinds passers (Fort neg) for 1d4 rd, and reveals invisible creatures %{levels.Cleric} min/dy"',
  "Elysium's Call":
    'Section=magic ' +
    'Note="Touch gives immediate enchantment reroll, +2 save vs. enchantment, +2 CMB to escape grapple, and negate 5\' difficult terrain for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Wounding Blade':
    'Section=magic ' +
    'Note="Hit w/touched weapon causes 1 HP bleeding damage (DC 15 Heal or cure ends) for %{levels.Cleric//2} rd %{(levels.Cleric-4)//4}/dy"',
  'Deadly Weather':
    'Section=magic ' +
    'Note="%{levels.Cleric*5}\' radius inflicts choice of rain (-4 Perception and ranged attack), winds (-8 Fly and ranged attack), snow (terrain becomes difficult), or <i>Call Lightning</i> %{levels.Cleric} rd/dy"',
  'Tunnel Runner':
    'Section=feature ' +
    'Note="Gives <i>Spider Climb</i> on stone surfaces, +60\' Darkvision, +%{levels.Cleric} Stealth underground, and +%{wisdomModifier} Initiative underground %{levels.Cleric} min/dy"',
  'Thundercloud':
    'Section=magic ' +
    'Note="R%{levels.Cleric*10+100}\' Fog in 20\' radius moves 30\'/rd, obscures vision, deafens, and inflicts 2d6 HP electricity %{levels.Cleric} rd/dy"',
  'Animate Servant':
    'Section=magic ' +
    'Note="Cast <i>Animate Object</i> %{(levels.Cleric-4)//4}/dy"',
  'Malign Eye':
    'Section=magic ' +
    'Note="R30\' Inflicts -2 saves vs. self spells on target for 1 min or until hits self %{wisdomModifier+3}/dy"',
  'Whispering Evil':
    'Section=magic ' +
    'Note="30\' radius fascinates foes (Will neg) %{levels.Cleric} rd/dy"',
  "Day's Resurgence":
    'Section=magic ' +
    'Note="10 minute ritual gives target 8 hrs rest %{(levels.Cleric-6)//2}/dy"',
  'Aura Of Decay':
    'Section=combat ' +
    'Note="30\' radius inflicts 1d6 HP/rd (plants 2d6 HP) and -1 Strength/rd %{levels.Cleric} rd/dy"',
  'Sudden Shift':
    'Section=combat ' +
    'Note="After foe miss, may teleport 10\' within foe threat range %{wisdomModifier+3}/dy"',
  'Deflection Aura':
    'Section=combat ' +
    'Note="20\' radius gives allies +2 AC and CMD for %{levels.Cleric} rd 1/dy"',
  'Fury Of The Abyss':
    'Section=combat ' +
    'Note="May trade -2 AC for +%{levels.Cleric//2>?1} attack, damage, and CMB for 1 rd %{wisdomModifier+3}/dy"',
  "Hell's Corruption":
    'Section=combat ' +
    'Note="Touch inflicts -2 saves and worse of two skill rolls for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Divine Vessel':
    'Section=magic ' +
    'Note="R15\' Divine spell cast on self gives allies +2 next attack, skill check, or ability check for 1 rd %{wisdomModifier+3}/dy"',
  'Door Sight':
    'Section=magic ' +
    'Note="May see through %{6+levels.Cleric}\\" material after 1 min touch %{wisdomModifier+3}/dy"',
  'Binding Ties':
    'Section=magic ' +
    'Note="Touch transfers condition to self and gives immunity for %{levels.Cleric} rd %{wisdomModifier+3}/dy"',
  'Tugging Strands':
    'Section=combat Note="May force target reroll %{(levels.Cleric-2)//6}/dy"',
  'Eyes Of The Hawk':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Initiative",' +
      '"+%V Perception"',
  'Ferocious Strike':
    'Section=combat ' +
    'Note="Called attack inflicts +%{levels.Cleric//2} HP %{wisdomModifier+3}/dy"',
  "Liberty's Blessing":
    'Section=magic Note="Touch gives additional save %{wisdomModifier+3}/dy"',
  "Predator's Grace":
    'Section=ability,feature ' +
    'Note=' +
      '"+%{10+levels.Cleric//5*5}\' Speed for 1 rd %{wisdomModifier+3}/dy",' +
      '"Has Low-Light Vision features for 1 rd %{wisdomModifier+3}/dy"',
  'Enlarge':'Section=magic Note="May dbl size for 1 rd %{wisdomModifier+3}/dy"',
  'Aura Of Heroism':
    'Section=combat ' +
    'Note="30\' radius gives allies +2 attack, saves, and skill checks %{levels.Cleric} rd/dy"',
  'Guarded Hearth':
    'Section=magic ' +
    'Note="10 min ritual gives targets in %{levels.Cleric//2*5}\' radius notice of intruders and +%{wisdomModifier} attack and saves for %{levels.Cleric} hr 1/dy"',
  'Honor Bound':
    'Section=magic ' +
    'Note="Touch gives additional save vs. enchantment %{wisdomModifier+3}/dy"',
  'Body Of Ice':
    'Section=combat Note="May trade dbl damage from fire for immunity to cold and DR 5/- %{levels.Cleric} rd/dy"',
  'Command':'Section=magic Note="Cast <i>Command</i> %{wisdomModifier+3}/dy"',
  'Insane Focus':
    'Section=magic ' +
    'Note="Touch gives +4 save vs. mind-affecting effects and immunity to confusion (failed save ends and confuses for 1 rd) %{wisdomModifier+3}/dy"',
  'Rune Shift':
    'Section=magic Note="R30\' May move blast rune to adjacent square"',
  'Inspiring Command':
    'Section=magic ' +
    'Note="R30\' Gives %{levels.Cleric//3+1} allies +2 attack, AC, CMD, and skill checks for 1 rd"',
  'Blinding Flash':
    'Section=magic ' +
    'Note="20\' radius blinds creatures up to %{levels.Cleric-1} HD for 1d4 rd (Fort neg), dazzles for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Aura Of Forgetfulness':
    'Section=magic ' +
    'Note="Creatures have no memory of time in 30\' radius and lose 1 spell slot/rd (Will neg) %{levels.Cleric} rd/dy"',
  'Adoration':
   'Section=combat ' +
   'Note="May force foe to forego attack (Will neg) %{wisdomModifier+3}/dy"',
  'Anything To Please':
    'Section=magic ' +
    'Note="R30\' Target attempts to please self (Will neg) %{(levels.Cleric-4)//4}/dy"',
  'Sacrificial Bond':
    'Section=combat ' +
    'Note="R30\' May transfer ally damage to self %{(levels.Cleric-2)//6}/dy"',
  'Recall':
    'Section=skill ' +
    'Note="Touch gives +%{wisdomModifier} Knowledge reroll %{wisdomModifier+3}/dy"',
  'Metal Fist':
    'Section=combat ' +
    'Note="Unarmed attack inflicts 1d6+%{strengthModifier} HP w/out AOO for 1 rd %{wisdomModifier+3}/dy"',
  'Killing Blow':
    'Section=combat ' +
    'Note="Critical hit inflicts %{levels.Cleric//2} HP bleed damage %{(levels.Cleric-4)//4}/dy"',
  'Night Hunter':
    'Section=feature ' +
    'Note="May become invisible to normal vision in dim light or darkness for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Fearful Touch':
    'Section=combat ' +
    'Note="Touch inflicts -2 attack on self and -%{levels.Cleric//2>?1} saves vs. fear for 1 rd %{wisdomModifier+3}/dy"',
  'Surge':
    'Section=feature ' +
    'Note="Wave inflicts %{levels.Cleric+wisdomModifier} CMB bull rush or drag %{wisdomModifier+3}/dy"',
  'Aura Of Chaos':
    'Section=combat ' +
    'Note="30\' radius randomizes creature actions %{levels.Cleric} rd/dy"',
  'Purifying Touch':
    'Section=magic ' +
    'Note="Touch gives additional save vs. effects %{(levels.Cleric-2)//6}/dy"',
  'Rage (Cleric)':
    'Section=combat ' +
    'Note="+4 Str, +4 Con, +2 Will, -2 AC and %1 powers %{levels.Cleric} rd/dy"',
  'Bestow Resolve':
    'Section=magic ' +
    'Note="R20\' Gives allies %{levels.Cleric+wisdomModifier} temporary HP for 1 min %{(levels.Cleric-4)//4}/dy"',
  'Restorative Touch':
    'Section=magic ' +
    'Note="Touch removes choice of dazed, fatigued, shaken, sickened, or staggered %{wisdomModifier+3}/dy"',
  'Gift Of Life':
    'Section=magic ' +
    'Note="Touched corpse dead up to 1 min regains life w/%{levels.Cleric//2} HP for %{levels.Cleric} rd %{(levels.Cleric-4)//4}/dy"',
  'Powerful Persuader':
    'Section=skill ' +
    'Note="May take higher of 2 Diplomacy or Intimidate rolls %{(levels.Cleric-6)//2}/dy"',
  'Untouched By The Seasons':
    'Section=magic ' +
    'Note="Touch gives <i>Endure Elements</i> for %{levels.Cleric} hr %{wisdomModifier+3}/dy"',
  'Cloud Of Smoke':
    'Section=magic Note="R30\' 5\' radius inflicts -2 attack and Perception and gives concealment %{wisdomModifier+3}/dy"',
  'Touch The Spirit World':
    'Section=magic ' +
    'Note="Touched weapon inflicts 1/2 damage (full damage if magic) on incorporeal creatures for %{levels.Cleric} rd %{wisdomModifier+3}/dy"',
  'Gale Aura':
    'Section=magic ' +
    'Note="30\' radius inflicts difficult terrain and no 5\' step %{levels.Cleric} rd/dy"',
  'Seize The Initiative':
    'Section=magic ' +
    'Note="R30\' Target gains choice of 2 Initiative rolls %{wisdomModifier+3}/dy"',
  'Thief Of The Gods':
    'Section=skill ' +
    'Note="May take higher of 2 Disable Device or Sleight Of Hand rolls %{(levels.Cleric-6)//2}/dy"',
  'Read Minds':
    'Section=magic ' +
    'Note="R30\' May read surface thoughts (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{levels.Cleric} rd/dy"',
  'Aura Of Repetition':
    'Section=combat Note="R30\' Forces foes to repeat prior action (Will neg) %{levels.Cleric} rd/dy"',
  'Silver-Tongued Haggler':
    'Section=skill ' +
    'Note="+%{levels.Cleric//2>?1} Bluff, Diplomacy, or Sense Motive %{wisdomModifier+3}/dy"',
  "Death's Kiss":
    'Section=magic ' +
    'Note="Touched healed and harmed as undead for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Warding Rune':
    'Section=magic ' +
    'Note="Damage from blast rune prevents attack on self (Will neg) for %{levels.Cleric//2} rd %{(levels.Cleric-2)//6}/dy"',
  'Wind Blast':
    'Section=magic Note="30\' line inflicts CMB +%{levels.Cleric+wisdomModifier} bull rush %{wisdomModifier+3}/dy"',

  // New base classes
  'Acid Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts acid damage instead of fire and additional 1d6 following round"',
  'Acid Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : source>=5 ? \'Resistance 10\' : \'Resistance 5\'} to acid"',
  'Act As One':
    'Section=combat ' +
    'Note="R30\' May grant move, +2 melee attack, and +2 AC to each ally 1/combat"',
  'Agony Hex':
    'Section=magic ' +
    'Note="R60\' Target nauseated for %{levels.Witch} rd (DC %{hexDC} Fort ends) 1/target/dy"',
  'Aid Allies (Cavalier)':
    'Section=combat Note="Aid Another action gives +%{(levels.Cavalier+4)//6} AC, attack, save, or skill check"',
  'Air Barrier':
    'Section=combat ' +
    'Note="Conjured air shell gives %+{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \', 50% ranged miss chance\' : \'\'} for %{levels.Oracle} hr/dy"',
  'Alchemy':
    'Section=magic,skill ' +
    'Note=' +
      '"May identify potions as with <i>Detect Magic</i> at will/May infuse extracts that duplicate spell effects",' +
      '"+%V Craft (Alchemy)"',
  'Arcane Archivist':
    'Section=magic ' +
    'Note="May cast Sorcerer/Wizard spell from lore book using +1 spell slot 1/dy"',
  'Armor Of Bones':
    'Section=combat ' +
    'Note="Conjured armor gives %+{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/bludgeoning\' : \'\'} for %{levels.Oracle} hr/dy"',
  'Aspect':'Section=feature Note="May apply %V evolution points to self"',
  'Automatic Writing':
    'Section=magic Note="1 hr meditation yields results of %{levels.Oracle>=8 ? \'<i>Commune</i>\' : levels.Oracle>=5 ? \'<i>Divination</i> (90% effective)\' : \'<i>Augury</i> (90% effective)\'} spell 1/dy"',
  'Awakened Intellect':'Section=ability Note="+2 Intelligence"',
  'Awesome Display':
    'Section=magic ' +
    'Note="Treat illusion targets as having %{charismaModifier>?0} fewer HD"',
  'Bane':
    'Section=combat ' +
    'Note="Gains +2 attack and +%Vd6 HP damage with chosen weapon vs. specified creature type for %{levels.Inquisitor} rd/dy"',
  'Banner':
    'Section=combat ' +
    'Note="R60\' allies +%{levels.Cavalier//5+1} save vs. fear and +%{levels.Cavalier//5} charge attack when banner visible"',
  'Battle Mystery':
    'Section=skill ' +
    'Note="Intimidate is a class skill/Knowledge (Engineering) is a class skill/Perception is a class skill/Ride is a class skill"',
  'Battlecry':
    'Section=combat ' +
    'Note="R100\' Allies within hearing gain +%{levels.Oracle>=10 ? 2 : 1} attack, skill checks, and saves for %{charismaModifier} rd %{(levels.Oracle+5)//5}/dy"',
  'Battlefield Clarity':
    'Section=combat ' +
    'Note="May make +4 reroll on failed save vs. blind, deaf, frightened, panicked, paralyzed, shaken, or stunned %{source>=15 ? 3 : source>=7 ? 2 : 1}/dy"',
  'Bleeding Wounds':
    'Section=combat ' +
    'Note="Successful attack inflicts %{(levels.Oracle+5)//5} HP bleeding each rd (DC 15 Heal or healing effect ends)"',
  'Blight Hex':
    'Section=magic ' +
    'Note="May kill all vegetation in %{levels.Witch * 10}\' radius or inflict -1 Con (DC %{hexDC} Will neg)"',
  'Blizzard':
    'Section=combat ' +
    'Note="%{levels.Oracle} 10\' cu inflict %{levels.Oracle}d4 HP cold (Ref half) and reduces vision to 5\' for %{charismaModifier} rd 1/dy"',
  'Bonded Mount':'Section=feature Note="Has mount animal companion"',
  'Braggart':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 attack on demoralized target",' +
      '"Has Dazzling Display features"',
  'Brain Drain':
    'Section=feature ' +
    'Note="R100\' Mental probe inflicts %{levels.Oracle}d4 HP and yields single Knowledge check at target\'s bonus (Will neg) %{(levels.Oracle+5)//5}/dy"',
  'Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict full HP on hit and %{levels.Alchemist+1)//2+intelligenceModifier} HP (Ref half) splash %V/dy"',
  'Bond Senses':
    'Section=feature ' +
    'Note="May use eidolon senses for %{levels.Summoner} rd/dy"',
  'Bones Mystery':
    'Section=skill ' +
    'Note="Bluff is a class skill/Disguise is a class skill/Intimidate is a class skill/Stealth is a class skill"',
  // 'Brew Potion' in SRD35.js
  'Burning Magic':
    'Section=magic ' +
    'Note="Successful fire spell inflicts 1/spell level HP fire for 1d4 rd (Ref ends)"',
  'By My Honor':
    'Section=save Note="+2 choice of save while maintaining alignment"',
  'Cackle Hex':'Section=magic Note="R30\' Extends hex affects 1 rd"',
  'Calling':
    'Section=feature,magic ' +
    'Note=' +
      '"May gain +%{charismaModifier} on chosen ability check, attack, save, or skill check within 1 min after prayer 4/dy",' +
      '"+%V %1"',
  'Cantrips':'Section=magic Note="May cast 0-level spells"',
  'Cauldron Hex':
    'Section=feature,skill ' +
    'Note=' +
      '"Has Brew Potion features",' +
      '"+4 Craft (Alchemy)"',
  'Cavalier Feat Bonus':'Section=feature Note="Gain %V Fighter Feats"',
  "Cavalier's Charge":
    'Section=combat Note="+4 mounted melee attack; no AC penalty afterward"',
  'Challenge':
    'Section=combat ' +
    'Note="Gain +%{levels.Cavalier} HP damage on chosen foe and suffer -2 AC against other foes 1/dy"',
  'Channel':'Section=feature Note="Has Channel Energy feature"',
  'Charm Hex':
    'Section=skill ' +
    'Note="Improves attitude of target animal or humanoid by %{levels.Witch>=8 ? 2 : 1} (DC %{hexDC} Will neg) for %{intelligenceModifier} rd"',
  'Cinder Dance':
    'Section=ability,feature ' +
    'Note=' +
      '"+10 Speed",' +
      '"Has %V features"',
  'Clobbering Strike':
    'Section=combat ' +
    'Note="May make swift action trip attempt w/out AOO after critical hit"',
  'Clouded Vision':
    'Section=feature ' +
    'Note="%{levels.Oracle>=5? 60 : 30}\' vision and darkvision%{levels.Oracle>=10 ? \\", 30\' blindsense\\" : \'\'}%{levels.Oracle>=15 ? \\", 15\' blindsight\\" : \'\'}"',
  'Coat Of Many Stars':'Section=combat Note="Conjured coat gives +{(levels.Oracle+5)//4*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/slashing\' : \'\'} for %{levels.Oracle}/dy"',
  'Combat Healer':
    'Section=feature ' +
    'Note="May use two spell slots to cast quickened Cure spell %{(levels.Oracle-3)//4}/dy"',
  'Combine Extracts':
    'Section=magic Note="May combine two effects into one extract"',
  'Companion Darkvision':
    'Section=companion Note="60\' b/w vision in darkness"',
  'Concentrate Poison':
    'Section=feature ' +
    'Note="May combine two doses to increase frequency by 50% and save DC by 2 for 1 hr"',
  'Concussive Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d4 sonic damage instead of fire and deafens on hit (Fort neg)"',
  'Coven Hex':
    'Section=feature,magic ' +
    'Note=' +
      '"May participate in hag coven",' +
      '"May use aid another to give witches in 30\' radius +1 caster level for 1 rd"',
  'Crystal Sight':
    'Section=feature ' +
    'Note="Can see through %{levels.Oracle}\' earth and %{levels.Oracle}\\" metal"',
  'Cunning Initiative':'Section=combat Note="+%V Initiative"',
  'Deaf':
    'Section=combat,feature,magic,skill ' +
    'Note=' +
      '"-%V Initiative",' +
      '"Has %V",' +
      '"May cast all spells silently",' +
      '"+3 Perception (non-sound)"',
  'Death Curse Hex':
    'Section=magic ' +
    'Note="R30\' Target becomes fatigued (DC %{hexDC} Will neg), then exhausted, then dies (DC %{hexDC} Fort suffers 4d6+%{levels.Witch} HP)"',
  "Death's Touch":
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP negative energy (undead heals and gives +1 channel resistance for 1 min) %{charismaModifier+3}/dy"',
  'Delay Affliction':
    'Section=save ' +
    'Note="May delay effects of failed save vs. disease or poison for %{levels.Oracle} %{levels.Oracle>=15 ? 3 : levels.Oracle >= 7 ? 2 : 1}/dy"',
  'Delayed Bomb':
    'Section=combat ' +
    'Note="May time bomb to explode after up to %{levels.Alchemist} rd"',
  'Demanding Challenge':
    'Section=combat Note="Challenged target suffers -2 AC from others"',
  'Detect Alignment':
    'Section=magic ' +
    'Note="May cast <i>Detect Chaos</i>, <i>Detect Good</i>, <i>Detect Evil</i>, <i>Detect Law</i> at will"',
  'Dilution':'Section=magic Note="May split potion or elixir into two doses"',
  'Discern Lies':'Section=magic Note="May use <i>Discern Lies</i> %{levels.Inquisitor}/dy"',
  'Disguise Hex':
    'Section=magic ' +
    'Note="May use <i>Disguise Self</i> for %{levels.Witch} hr/dy"',
  'Discovery':'Section=feature Note="%V Selections"',
  'Dispelling Bomb':
    'Section=combat ' +
    'Note="May create bomb that dispels magic instead of inflicting damage"',
  'Domain':'Section=feature Note="FILL"',
  'Dweller In Darkness':
    'Section=magic ' +
    'Note="Can use <i>Phantasmal Killer</i>%{levels.Oracle>=17 ? \' on multiple targets\' : \'\'} 1/dy"',
  'Earth Glide':
    'Section=ability ' +
    'Note="Can move %{speed}\' through earth %{levels.Oracle} min/dy"',
  'Eidolon':'Section=feature Note="Special bond and abilities"',
  'Eidolon Bite':'Section=companion Note="Bite attack inflicts %V+%1 HP"',
  'Eidolon Claws':'Section=companion Note="Claw attack inflicts %V HP each"',
  'Eidolon Climb':'Section=companion Note="%V\' Climb speed"',
  'Eidolon Gills':'Section=companion Note="May breathe underwater"',
  'Eidolon Improved Damage':
    'Section=companion ' +
    'Note="Chosen natural attack inflicts 1 die type higher damage"',
  'Eidolon Improved Natural Armor':'Section=companion Note="+%V natural armor"',
  'Eidolon Magic Attacks':
    'Section=companion ' +
    'Note="Attacks count as magic%{levels.Summoner>=10 ? \' and aligned\' : \'\'}"',
  'Eidolon Mount':'Section=companion Note="Master may ride eidolon"',
  'Eidolon Pincers':
    'Section=companion Note="Pincer attack inflicts %V HP each"',
  'Eidolon Pounce':'Section=companion Note="May make full attack after charge"',
  'Eidolon Pull':
    'Section=companion Note="Chosen natural attack allows CMB for 5\' pull"',
  'Eidolon Push':
    'Section=companion Note="Chosen natural attack allows CMB for 5\' push"',
  'Eidolon Reach':
    'Section=companion Note="Reach for chosen natural attack increases 5\'"',
  'Eidolon Scent':'Section=companion Note="R30\' May detect foes by smell"',
  'Eidolon Skilled':'Section=companion Note="+8 on chosen skill"',
  'Eidolon Slam':'Section=companion Note="Slam attack inflicts %V HP each"',
  'Eidolon Sting':'Section=companion Note="Sting attack inflicts %V HP"',
  'Eidolon Swim':'Section=companion Note="Can swim at full speed%1"',
  'Eidolon Tail':'Section=companion Note="+%V Acrobatics (balance)"',
  'Eidolon Tail Slap':'Section=companion Note="Slap attack inflicts %V HP"',
  'Eidolon Tentacle':
    'Section=companion Note="Tentacle attack inflicts %V HP each"',
  'Eidolon Wing Buffet':
    'Section=companion Note="Wing attack inflicts %V HP each"',
  'Eidolon Ability Increase (2)':'Section=companion Note="+2 chosen ability"',
  'Eidolon Constrict (2)':
    'Section=companion Note="Successful grapple doubles damage"',
  'Eidolon Energy Attacks (2)':
    'Section=companion ' +
    'Note="Natural attack inflicts 1d6 HP of chosen energy Type"',
  'Eidolon Flight (2)':'Section=companion Note="May fly at full speed"',
  'Eidolon Gore (2)':'Section=companion Note="Horn attack inflicts %V HP"',
  'Eidolon Grab (2)':
    'Section=companion ' +
    'Note="Successful chosen natural attack allows free CMB to grapple; +4 grapple CMB"',
  'Eidolon Immunity (2)':
    'Section=companion Note="Immune to chosen energy type"',
  'Eidolon Limbs (2)':'Section=companion Note="+%V limbs"',
  'Eidolon Poison (2)':
    'Section=companion ' +
    'Note="Chosen natural attack inflicts +1d4 Str damage (DC %V Fort neg) 1/rd"',
  'Eidolon Rake (2)':
    'Section=companion Note="Claw rake on grappled foe inflicts 2x%V HP"',
  'Eidolon Rend (2)':
    'Section=companion Note="2 successful claw attacks inflicts %V+%1 HP"',
  'Eidolon Trample (2)':
    'Section=companion ' +
    'Note="Full-round automatic overrun inflicts %V+%1 HP (DC %2 Ref half)"',
  'Eidolon Tremorsense (2)':
    'Section=companion Note="R30\' Senses creatures via ground vibrations"',
  'Eidolon Trip (2)':
    'Section=companion Note="Successful bite allows free CMB to trip"',
  'Eidolon Weapon Training (2)':
    'Section=companion Note="Proficient with simple%1 weapons"',
  'Eidolon Blindsense (3)':
    'Section=companion Note="R30\' May detect unseen creatures"',
  'Eidolon Burrow (3)':
    'Section=companion Note="May burrow through earth at half speed"',
  'Eidolon Damage Reduction (3)':
    'Section=companion Note="DR %V/opposite alignment"',
  'Eidolon Frightful Presence (3)':
    'Section=companion ' +
    'Note="R30\' Foes frightened (up to %{animalCompanionStats.HD-4} HD) or shaken (up to %{animalCompanionStats.HD} HD) (DC %V Will neg)"',
  'Eidolon Swallow Whole (3)':
    'Section=companion Note="May use CMB to swallow creature grappled by bite"',
  'Eidolon Web (3)':
    'Section=companion ' +
    'Note="R50\' May entangle target (DC %V Escape Artist or -4 Str neg) 8/dy"',
  'Eidolon Blindsight (4)':
    'Section=companion ' +
    'Note="R30\' Unaffected darkness and foe invisibility and concealment"',
  'Eidolon Breath Weapon (4)':
    'Section=companion ' +
    'Note="30\' cone inflicts %{animalCompanionStats.HD}d6 HP of chosen energy type (DC %V Ref half) %1/dy"',
  'Eidolon Fast Healing (4)':'Section=companion Note="Heals %V HP/rd"',
  'Eidolon Large (4)':
    'Section=companion ' +
    'Note="Size is %V: gains +%1 Str, +%2 Con, +%3 AC, and +%4 CMB/CMD, suffers %5 Dex, %6 Attack, -%7 Fly, -%8 Stealth"',
  'Eidolon Spell Resistance (4)':
    'Section=companion Note="Has Spell Resistance %{levels.Summoner + 11}"',
  'Elixir Of Life':
    'Section=magic ' +
    'Note="May create elixir 1/dy that acts as <i>True Resurrection</i> spell"',
  'Energy Body':
    'Section=feature ' +
    'Note="Energy form lights 10\' radius, inflicts 1d6+%{levels.Oracle} HP positive energy on undead, and heals ally 1d6+%{levels.Oracle} HP 1/rd for %{levels.Oracle} rd/dy"',
  'Enhance Potion':
    'Section=magic ' +
    'Note="May cause imbibed potion to function at caster level %{levels.Alchemist} %{intelligenceModifier}/dy"',
  'Enhanced Cures':
     'Section=magic ' +
     'Note="Level-based healing by Cure spells gives %{levels.Oracle} HP"',
  'Erosion Touch':
    'Section=combat ' +
    'Note="Touch inflicts %{levels.Oracle}d6 HP to objects %{levels.Oracle//3>?1}/dy"',
  'Eternal Potion':
     'Section=magic Note="May make effects of 1 imbibed potion permanent"',
  'Eternal Slumber Hex':
    'Section=magic ' +
    'Note="R30\' Target sleeps permanently (DC %{hexDC} Will neg) 1/target/dy"',
  'Eternal Youth':
    'Section=feature Note="Suffers no ability score penalties from age"',
  'Evil Eye Hex':'Section=magic Note="R30\' Target suffers %{levels.Witch>=8 ? -4 : -2} on choice of AC, ability checks, attack, saves, or skill checks for %{3 + intelligenceModifier} rd (DC %{hexDC} Will 1 rd)"',
  'Expert Trainer':
    'Section=skill ' +
    'Note="+%{levels.Cavalier//2} Handle Animal (mount)/Teach mount in 1/7 time (DC +5)"',
  'Exploit Weakness':
    'Section=combat ' +
    'Note="Critical hit ignores DR, negates regeneration for 1 rd/+1 energy damage HP/die vs. vulnerable foe"',
  'Explosive Bomb':
    'Section=combat ' +
    'Note="Direct hit from bomb inflicts 1d6 HP fire until extinguished; splash extends 10\'"',
  'Extend Potion':
     'Section=magic ' +
     'Note="May double duration of imbibed potion %{intelligenceModifier}/dy"',
  'Familiar Centipede':'Section=skill Note="+3 Stealth"',
  'Familiar Crab':'Section=combat Note="+2 grapple CMB"',
  'Familiar Fox':'Section=save Note="+2 Reflex"',
  'Familiar Octopus':'Section=skill Note="+3 Swim"',
  'Familiar Scorpion':'Section=combat Note="+2 Initiative"',
  'Familiar Spider':'Section=skill Note="+3 Climb"',
  'Fast Bombs':
    'Section=combat Note="May use full attack to throw multiple bombs in a rd"',
  'Fast Healing':'Section=combat Note="Regains %V HP/rd"',
  'Feral Mutagen':
    'Section=combat ' +
    'Note="Imbibing mutagen grants 2 claw attacks for 1d6 HP each, 1 bite attack for 1d8 HP damage, and +2 Intimidate"',
  'Final Revelation (Battle Mystery)':
    'Section=combat ' +
    'Note="May take full-attack action and move %{speed}\'/Critical hits ignore DR/+4 AC vs. critical hits/Remain alive until -%{hitPoints*2} HP"',
  'Final Revelation (Bones Mystery)':
    'Section=combat,magic ' +
    'Note=' +
      '"Automatically stabilize at negative HP",' +
      '"May cast <i>Bleed</i> or <i>Stabilize</i> 1/rd, <i>Animate Dead</i> at will, and <i>Power Word Kill</i> vs. target w/up to 150 HP 1/dy"',
  'Final Revelation (Flame Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to fire spell w/out cost"',
  'Final Revelation (Heavens Mystery)':
    'Section=combat,feature,save ' +
    'Note=' +
      '"Automatically stabilize at negative HP/Critical hits automatically confirmed",' +
      '"+%V Fortitude/+%V Reflex/+%V Will/Immune to fear",' +
      '""',
  'Final Revelation (Life Mystery)':
    'Section=combat,save ' +
    'Note=' +
      '"Remain alive until -%{hitPoints*2} HP",' +
      '"Immune to bleed, death attack, exhaustion, fatigue, nausea effects, negative levels, and sickened effects/Ability scores cannot be drained below 1/Automatic save vs. massive damage"',
  'Final Revelation (Lore Mystery)':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Wish</i> 1/dy",' +
      '"May take 20 on all Knowledge"',
  'Final Revelation (Nature Mystery)':
    'Section=feature ' +
    'Note="Cacooning for 8 hr changes creature type, removes poisons and diseases, and restores HP and abilities 1/dy"',
  'Final Revelation (Stone Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to acid or earth spell w/out cost"',
  'Final Revelation (Waves Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to water spell w/out cost"',
  'Final Revelation (Wind Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to air or electricity spell w/out cost"',
  'Fire Breath':
    'Section=combat ' +
    'Note="15\' cone inflicts %{levels.Oracle}d4 HP fire (Ref half) %{(levels.Oracle+5)//5}/dy"',
  'Firestorm':
    'Section=combat ' +
    'Note="%{levels.Oracle} 10\' cu inflict %{levels.Oracle}d6 HP fire (Ref half) for %{charismaModifier} rd 1/dy"',
  'Flame Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Climb is a class skill/Intimidate is a class skill/Perform is a class skill"',
  'Flight Hex':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast <i>Feather Fall</i> at will%1",' +
      '"+4 Swim"',
  'Fluid Nature':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 CMD vs. bull rush, drag, grapple, reposition, and trip/-4 Foe critical confirmation",' +
      '"Has %V features"',
  'Fluid Travel':
    'Section=ability ' +
    'Note="May move full speed across liquid without contact damage%1"',
  'Focused Trance':
    'Section=skill ' +
    'Note="Trance of 1d6 rd gives +%{levels.Oracle} saves vs. sonic and gaze attack and 1 +20 intelligence skill test %{charismaModifier}/dy"',
  'For The Faith':
    'Section=combat ' +
    'Note="R30\' May grant +%{charismaBonus>?1} to self attack and +%{charismaBonus//2>?1} to allies %{levels.Cavalier//4-1}/dy"',
  'For The King':
    'Section=combat ' +
    'Note="R30\' May give allies +%{charismaModifier} attack and damage for 1 rd"',
  'Force Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d4 force damage instead of fire and knocks prone on hit (Ref neg)"',
  'Forced Reincarnation Hex':
    'Section=magic ' +
    'Note="R30\' Target killed and reincarnated (DC %{hexDC} Will neg) 1/target/dy"',
  'Form Of Flame':
    'Section=magic ' +
    'Note="May use <i>Elemental Body %{levels.Oracle>= 13 ? \'IV\' : levels.Oracle>=11 ? \'III\' : levels.Oracle >= 9 ? \'II\' : \'I\'}</i> to become fire elemental for %{levels.Oracle} hr 1/dy"',
  'Fortune Hex':
    'Section=magic Note="R30\' Target gains reroll on choice of ability check, attack, save, or skill check 1/rd for %{levels.Witch>=16 ? 3 : levels.Witch>=8 ? 2 : 1} rd 1/target/dy"',
  'Freezing Spells':
    'Section=magic ' +
    'Note="Spells that do cold damage slow target for 1%{levels.Oracle>=11 ? \'d4\' : \'\'} rd"',
  'Friend To The Animals':
    'Section=magic,save ' +
    'Note=' +
      '"Knows all <i>Summon Nature\'s Ally</i> spells",' +
      '"R30\' Animals gain +%{charismaModifier} on all saves"',
  'Frost Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d6+%{intelligenceModifier} cold damage instead of fire and staggers on hit (Fort neg)"',
  'Gaseous Form':
    'Section=magic Note="May use <i>Gaseous Form</i> %{levels.Oracle} min/dy"',
  'Gate':'Section=feature Note="FILL"',
  'Gaze Of Flames':
    'Section=feature,magic ' +
    'Note=' +
      '"Can see through fire, fog, and smoke %{levels.Oracle} rd/dy",' +
      '"Can use <i>Clairvoyance</i> via flame %V rd/dy"',
  'Grand Discovery':'Section=feature Note="%V Selection"',
  'Grand Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +6 AC and +8/+6/+4/-2 to strength/intelligence, dexterity/wisdom, and constitution/charisma for %{levels.Alchemist*10} min"',
  'Greater Aspect':'Section=feature Note="Increased Aspect Effects"',
  'Greater Bane':'Section=combat Note="Increased Bane effects"',
  'Greater Banner':
    'Section=combat ' +
    'Note="R60\' allies +2 save vs. charm and compulsion; waving grants allies additional saving throw vs. spells"',
  'Greater Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +4 AC and +6/+4/-2 to strength/intelligence, dexterity/wisdom, and constitution/charisma for %{levels.Alchemist*10} min"',
  'Greater Shield Ally':
    'Section=combat,save ' +
    'Note=' +
      '"+2 ally AC (+4 self) when eidolon is within reach",' +
      '"+2 ally saves (+4 self) when eidolon is within reach"',
  'Greater Tactician':'Section=feature Note="Gain 1 Teamwork feat"',
  'Guiding Star':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"May determine precise location under clear night sky",' +
      '"+%{charismaModifier} wisdom-linked skills under clear night sky",' +
      '"May use Empower Spell, Extend Spell, Silent Spell, or Still Spell outdoors without penalty 1/night"',
  "Hag's Eye Hex":
    'Section=magic Note="Can use <i>Arcane Eye</i> %{levels.Witch} min/dy"',
  'Haunted':
    'Section=feature,magic ' +
    'Note=' +
      '"Malevolent spirits inflict minor annoyances",' +
      '"Know %V spells"',
  'Healing Hands':'Section=feature Note="FILL"',
  'Healing Hex':
    'Section=feature Note="May cast <i>Cure %{levels.Witch>=5 ? \'Moderate\' : \'Light\'} Wounds</i> at will 1/target/dy"',
  'Heat Aura':
    'Section=combat ' +
    'Note="R10\' Heat blast inflicts %{levels.Oracle>?1}d4 HP fire, gives self 20% concealment for 1 rd %{(levels.Oracle+5)//5}/dy"',
  'Heavens Mystery':
    'Section=skill ' +
    'Note="Fly is a class skill/Knowledge (Arcana) is a class skill/Perception is a class skill/Survival is a class skill"',
  'Hex':'Section=feature Note="%V Selections"',
  'Ice Armor':
    'Section=combat ' +
    'Note="Conjured armor gives %+{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/piercing\' : \'\'} for %{levels.Oracle} hr/dy"',
  'Icy Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : source>=5 ? \'Resistance 10\' : \'Resistance 5\'} to cold"',
  'Infuse Mutagen':
     'Section=magic ' +
     'Note="May retain multiple mutagens at the cost of 2 point intelligence damage per"',
  'Inferno Bomb':
    'Section=combat ' +
    'Note="May create bomb that inflicts 6d6 HP fire in dbl splash radius for %{levels.Alchemist} rd"',
  'Infusion':'Section=magic Note="Created extracts persist when not held"',
  'Instant Alchemy':
    'Section=combat,magic ' +
    'Note=' +
      '"May apply poison to a blade as an immediate action",' +
      '"May create alchemical items as a full-round action"',
  'Interstellar Void':
    'Section=combat Note="R30\' Inflicts %{levels.Oracle}d6 HP cold%{levels.Oracle>=15 ? \', exhausted, stunned 1 rd\' : levels.Oracle>=10 ? \', fatigued\' : \'\'} (Fort half HP only) %{levels.Oracle>=10 ? 2 : 1}/dy"',
  'Invisibility':
    'Section=magic Note="May use <i>Invisibility</i> %{levels.Oracle} min/dy%{levels.Oracle>=9 ? \' or <i>Greater Invisibility</i> %{levels.Oracle} rd/dy\' : \'\'}"',
  'Iron Skin':
    'Section=magic ' +
    'Note="Self <i>Stoneskin</i> gives DR 10/adamantine %{source>=15 ? 2 : 1}/dy"',
  'Judgment':
    'Section=combat ' +
    'Note="May pronounce one of these judgments, gaining specified bonus, %{(levels.Inquisitor+2)//3}/dy: destruction (+%{(levels.Inquisitor+3)//3} weapon damage), healing (regains +%{(levels.Inquisitor+3)//3}/rd), justice (+%{(levels.Inquisitor+5)//5} attack%{levels.Inquisitor>=10 ? \', dbl to confirm crit\' : \'\'}), piercing (+%{(levels.Inquisitor+3)//3} to overcome spell resistance), protection (+%{levels.Inquisitor+5)//5} AC%{levels.Inquisitor>=10 ? \', dbl on confirm crit\' : \'\'}), purity (+%{(levels.Inquisitor+5)//5} saves%{levels.Inquisitor>=10 ? \', dbl vs. curses, disease, and poison\' : \'\'}), resiliency (gain DR/%{(levels.Inquisitor+5)//5} %{levels.Inquisitor>=10 ? \'opposed alignment\' : \'magic\'}), resistance (resistance %{(levels.Inquisitor+3)//3*2} to chosen energy), smiting (weapons count as magic%{levels.Inquisitor>=6 ? \', aligned\' : \'\'}%{levels.Inquisitor>=10 ? \', adamantine\' : \'\'} to overcome DR)"',
  "Knight's Challenge":
    'Section=combat ' +
    'Note="Additional daily challenge with +%{charismaBonus} attack and damage and +4 to confirm critical hits"',
  'Lame':
    'Section=ability,save ' +
    'Note=' +
      '"-%V Speed/Speed is unaffected by encumbrance%V",' +
      '"Immune to %V"',
  'Life Bond':
    'Section=combat ' +
    'Note="Damage that would reduce self to negative HP transferred to eidolon"',
  'Life Giver Hex':'Section=magic Note="May use <i>Resurrection</i> 1/dy"',
  'Life Leach':
    'Section=combat ' +
    'Note="R30\' Target suffers %{levels.Oracle<?10}d6 HP (Fort half), self gains equal temporary HP for %{charismaModifier} hr %{(levels.Oracle-3)//4}/dy"',
  'Life Link':
    'Section=combat ' +
    'Note="May establish bond with target that transfers 5 HP damage to self each rd while within $RM\'"',
  'Life Link (Summoner)':
    'Section=combat ' +
    'Note="May transfers damage from eidolon to self to negate forced return to home plane; eidolon must stay w/in 100\' to have full HP"',
  'Life Mystery':
    'Section=skill ' +
    'Note="Handle Animal is a class skill/Knowledge (Nature) is a class skill/Survival is a class skill"',
  'Lifesense':'Section=feature Note="30\' Blindsight"',
  'Lightning Breath':
    'Section=combat ' +
    'Note="R30\' Breath inflicts %{levels.Oracle}d4 electricity (Ref half) %{(levels.Oracle+5)//5}/dy"',
  "Lion's Call":
    'Section=combat ' +
    'Note="R60\' May give allies +%{charismaModifier} vs. fear and +1 attack for %{levels.Cavalier} rd"',
  'Lore Keeper (Oracle)':'Section=skill Note="+%V Knowledge"',
  'Lore Mystery':
    'Section=skill ' +
    'Note="Appraise is a class skill/Knowledge is a class skill"',
  'Lure Of The Heavens':
    'Section=feature,magic ' +
    'Note=' +
      '"Leaves no tracks",' +
      '"May <i>Levitate</i> 6\\" at will%V"',
  'Madness Bomb':
    'Section=combat ' +
    'Note="May create bomb that inflicts 1d4 points of wisdom damage, reducing fire damage by 2d6 HP"',
  'Major Healing Hex':
    'Section=feature Note="May cast <i>Cure %{levels.Witch>=15 ? \'Critical\' : \'Serious\'} Wounds</i> at will 1/target/dy"',
  "Maker's Call":
    'Section=magic Note="May use <i>Dimension Door</i> to call bring eidolon adjacent %{(source - 2) // 4}/dy"',
  'Maneuver Mastery':
    'Section=combat,feature ' +
    'Note=' +
      '"+{levels.Oracle - baseAttackBonus} on chosen combat maneuver",' +
      '"Has Improved Trip%V features"',
  'Mantle Of Moonlight':
    'Section=combat,save ' +
    'Note=' +
      '"Touch forces lycanthrope target into human form%{levels.Oracle>=5 \' or inflicts rage\' : \'\'} for %{levels.Oracle} rd %{levels.Oracle//5>?1}/dy",' +
      '"Immune to lycanthropy"',
  'Master Tactician':'Section=feature Note="Gain 1 Teamwork feat"',
  'Mental Acuity':'Section=ability Note="+%V Intelligence"',
  'Merge Forms':
    'Section=combat ' +
    'Note="May merge into eidolon, becoming protected from harm, for %{levels.Summoner} rd/dy"',
  'Mighty Charge':
    'Section=combat ' +
    'Note="Dbl threat range while mounted; free bull rush, disarm, sunder, or trip afterward w/out AOO"',
  'Mighty Pebble':
    'Section=combat ' +
    'Note="R20\' Thrown pebble +%{levels.Oracle//4} attack inflicts %{levels.Oracle//2>?1}d6+%{levels.Oracle//4} on hit, half in 5\' radius (Ref neg) %{(levels.Oracle+5)//5}/dy"',
  'Misfortune Hex':
    'Section=magic Note="R30\' Target takes worse of two rolls on ability checks, attack, saves, and skill checks (DC %{hexDC} Will neg) for %{levels.Witch>=16 ? 3 : levels.Witch>=8 ? 2 : 1} rd 1/target/dy"',
  'Molten Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : source>=5 ? \'Resistance 10\' : \'Resistance 5\'} to fire"',
  'Moment Of Triumph':
    'Section=feature ' +
    'Note="Automatically confirms critical threats and gains +%{charismaModifier} on ability checks, attack, damage, saves, skillChecks, and AC 1/dy"',
  'Monster Lore':
    'Section=skill ' +
    'Note="+%{wisdomModifier} Knowledge (identify creature abilities and weaknesses)"',
  'Moonlight Bridge':
    'Section=magic ' +
    'Note="10\' x %{levels.Oracle*10}\' span provides passage for 1 dy or until self crosses %{charismaBonus}/dy"',
  'Mount':'Section=feature Note="Special bond and abilities"',
  'Mounted Mastery':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+4 AC vs. attack set against mounted charge/Adds mount\'s strength modifier to charge damage",' +
      '"Gain 1 Order Of The Sword feat",' +
      '"No armor check penalty for Ride"',
  'Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +2 AC and +4/-2 to strength/intelligence, dexterity/wisdom, or constitution/charisma for %{levels.Alchemist*10} min"',
  'Mystery Spell':'Section=feature Note="FILL"',
  'Mystery':'Section=feature Note="1 Selection"',
  'Natural Disaster Hex':
    'Section=magic ' +
    'Note="May use <i>Storm Of Vengeance</i> combined with <i>Earthquake</i> 1/dy"',
  'Natural Divination':
    'Section=feature ' +
    'Note="10 min nature study grants 1 +%{charismaModifier} save, 1 +10 skill check, or 1 +1 Initiative"',
  'Nature Mystery':
    'Section=skill ' +
    'Note="Climb is a class skill/Fly is a class skill/Knowledge (Nature) is a class skill/Survival is a class skill/Swim is a class skill"',
  "Nature's Whispers":'Section=combat Note="+%V AC/+%V CMD"',
  'Near Death':
    'Section=save ' +
    'Note="+%{levels.Oracle>=11 ? 4 : 2} vs. disease, mental effects, poison%{levels.Oracle>=7 ? \', death effects, sleep effects, stunning\' : \'\'"',
  'Nightmares Hex':
    'Section=magic ' +
    'Note="R60\' Can use <i>Nightmare</i> (DC %{hexDC} Will ends) at will"',
  "Oracle's Curse":'Section=feature Note="1 Selection"',
  'Order':'Section=feature Note="1 Selection"',
  'Order Of The Cockatrice':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} HP damage on target of challenge",' +
      '"Must put own interest above others\'",' +
      '"Appraise is a class skill/Perform is a class skill/+%{charismaModifier} DC to intimidate"',
  'Order Of The Dragon':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Allies receive +%{levels.Cavalier//4+1} attack on challenge target",' +
      '"Must defend allies",' +
      '"Perception is a class skill/Survival is a class skill/+%{levels.Cavalier//2>?1} Survival (protect allies)"',
  'Order Of The Lion':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} AC vs. challenge target",' +
      '"Must defend and obey sovereign",' +
      '"Knowledge (Local) is a class skill/Knowledge (Nobility) is a class skill/+%{levels.Cavalier//2>?1} Knowledge (Nobility) (sovereign)"',
  'Order Of The Shield':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} attack vs. challenge target for 1 min if target attacks another",' +
      '"Must defend the lives and property of common folks",' +
      '"Heal is a class skill/Knowledge (Local) is a class skill/+%{levels.Cavalier//2>?1} Heal (others)"',
  'Order Of The Star':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} saves while attacking challenge target",' +
      '"Must protect and serve the faithful",' +
      '"Heal is a class skill/Knowledge (Religion) is a class skill/+%{levels.Cavalier//2>?1} Knowledge (Religion) (chosen faith)"',
  'Order Of The Sword':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} mounted attack vs. challenge target",' +
      '"Must show honor, mercy, and charity",' +
      '"Knowledge (Nobility) is a class skill/Knowledge (Religion) is a class skill/+%{levels.Cavalier//2>?1} Sense Motive (oppose Bluff)"',
  'Orisons':'Section=magic Note="Knows level-0 spells"',
  'Persistent Mutagen':'Section=magic Note="Mutagen effects last 1 hr"',
  "Philosopher's Stone":
    'Section=magic ' +
    'Note="May create stone that turns base metals into silver and gold or creates <i>True Resurrection</i> oil"',
  'Poison Bomb':
    'Section=combat ' +
    'Note="May create bomb that kills creatures up to 6 HD (Fort 1d4 constitution damage for 4-6 HD) and inflicts 1d4 constitution damage on higher HD creatures (Fort half) in dbl splash radius for %{levels.Alchemist} rd"',
  'Poison Resistance':'Section=save Note="Resistance %V poison"',
  // 'Poison Use' in Pathfinder.js
  'Poisonous Touch':
    'Section=combat ' +
    'Note="Touch may inflict 1d3 constitution damage/rd for 6 rd (Con neg)"',
  'Precise Bombs':
    'Section=combat ' +
    'Note="May specify %{intelligenceModifier} squares in bomb splash radius that are unaffected"',
  'Protect The Meek':
    'Section=combat ' +
    'Note="May move and attack as an immediate action; staggered for 1 rd afterward"',
  'Punitive Transformation':
    'Section=magic ' +
    'Note="May cast <i>Baleful Polymorph</i>, lasting %{levels.Oracle} rd, %{charismaModifier}/dy"',
  'Raise The Dead':
    'Section=magic ' +
    'Note="Summoned %{levels.Oracle} HD %{levels.Oracle>= 15 ? \'advanced skeleton or zombie\' : levels.Oracle>=7 ? \'bloody skeleton or fast zombie\' : \'skeleton or zombie\'} serves for %{charismaModifier} rd"',
  'Resiliency (Oracle)':
    'Section=combat,feature ' +
    'Note=' +
      '"Not disabled or staggered at 0 HP",' +
      '"Has %V features"',
  'Resist Life':
    'Section=save ' +
    'Note="Save as undead vs. negative and positive energy%{levels.Oracle>=7 ? \', +\' + (levels.Oracle>=15 ? 6 : levels.Oracle>=11 ? 4 : 2) + \' channel resistance\' : \'\'}"',
  'Resolute':
    'Section=combat ' +
    'Note="In heavy armor, may convert %{(levels.Cavalier+4)/6} HP taken from each attack to nonlethal"',
  'Retribution':
    'Section=combat ' +
    'Note="May make AOO against adjacent foe who strikes fellow member of the faith 1/rd"',
  'Retribution Hex':
    'Section=magic ' +
    'Note="R60\' Target suffers half of damage it inflicts (DC %{hexDC} Will neg) for %{intelligenceModifier} rd"',
  'Revelation':'Section=feature Note="%V Selections"',
  'Rock Throwing':'Section=combat Note="R20\' Thrown rock +1 attack inflicts 2d%{features.Small ? 3 : 4}+%{(strengthModifier*1.5)//1}"',
  'Safe Curing':'Section=magic Note="Cure spells do not provoke AOO"',
  'Second Judgment':'Section=combat Note="May use 2 judgments simultaneously"',
  'Shard Explosion':
    'Section=combat Note="10\' radius inflicts %{levels.Oracle//2>?1}d6 (Ref half) and difficult terrain for 1 rd %{(levels.Oracle+5)//5}/dy"',
  'Shield Ally':
    'Section=combat,save ' +
    'Note=' +
      '"+2 AC when eidolon is within reach",' +
      '"+2 saves when eidolon is within reach"',
  'Shield Of The Liege':
    'Section=combat ' +
    'Note="May redirect attack on adjacent ally to self/Adjacent allies gain +2 AC"',
  'Shock Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d6+%{intelligenceModifier} electricity damage instead of fire and dazzles for 1d4 rd"',
  'Sidestep Secret':
    'Section=combat,save ' +
    'Note=' +
      '"+%V AC",' +
      '"+%V Reflex"',
  'Skill At Arms':
    'Section=combat ' +
    'Note="Weapon Proficiency (Martial)/Armor Proficiency (Heavy)"',
  'Slayer':
    'Section=combat Note="+5 Inquisitor level for chosen judgment effects"',
  'Slumber Hex':
    'Section=magic ' +
    'Note="R30\' May inflict sleep (DC %{hexDC} neg) for %{levels.Witch} rd at will 1/target/dy"',
  'Smoke Bomb':
    'Section=combat ' +
    'Note="May create bomb that obscures vision in dbl splash radius for %{levels.Alchemist} rd"',
  'Solo Tactics':'Section=combat Note="All allies count for Teamwork features"',
  'Soul Siphon':
    'Section=magic ' +
    'Note="R30\' Ranged touch inflicts negative level for %{charismaModifier} min, heals %{levels.Oracle} to self %{(levels.Oracle-3)//4}/dy"',
  'Spark Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : source>=5 ? \'Resistance 10\' : \'Resistance 5\'} to electricity"',
  'Speak With Animals (Oracle)':
    'Section=magic ' +
    'Note="May converse at will with %{(levels.Oracle+3)//3} chosen animal types"',
  'Spirit Boost':
    'Section=magic ' +
    'Note="Up to %{levels.Oracle} excess HP from Cure spell become temporary HP for 1 rd"',
  'Spirit Of Nature':
    'Section=combat ' +
    'Note="At negative HP, stabilize automatically%{levels.Oracle<10 ? \' in natural setting\' : \'\'}%{levels.Oracle>=15 ? \' and gain fast healing 3 for 1d4 rd\' : levels.Oracle>=5 ? \' and gain fast healing 1 for 1d4 rd\' : \'\'}"',
  'Spirit Walk':
    'Section=magic ' +
    'Note="Self becomes incorporeal for %{levels.Oracle} rd %{levels.Oracle>=15 ? 2 : 1}/dy"',
  'Spontaneous Symbology':
    'Section=magic Note="May use spell slot to cast any <i>Symbol</i> spell"',
  'Spray Of Shooting Stars':
    'Section=combat ' +
    'Note="R60\' 5\' radius inflicts %{levels.Oracle}d4 fire (Ref half) %{(levels.Oracle+5)//5}/dy"',
  'Stalwart':
    'Section=save ' +
    'Note="Successful Fortitude or Will save yields no damage instead of half (heavy armor neg)"',
  'Star Chart':'Section=magic Note="May use <i>Commune</i> 1/dy"',
  'Steal Glory':
    'Section=combat ' +
    'Note="May make AOO against threatened target when ally scores a critical hit"',
  'Steelbreaker Skin':
    'Section=combat ' +
    'Note="Skin inflicts %{levels.Oracle} HP on striking weapon%{levels.Oracle>=15 ? \', ignoring 10 points of hardness\' : \'\'} for %{levels.Oracle} min 1/dy"',
  'Stem The Tide':'Section=feature Note="Has Stand Still features"',
  'Stern Gaze':'Section=skill Note="+%V Intimidate/+%V Sense Motive"',
  'Sticky Bomb':
    'Section=combat ' +
    'Note="Targets hit by bombs suffer splash damage on the following rd"',
  'Stink Bomb':
    'Section=combat ' +
    'Note="May create bomb that nauseates for 1d4+1 rd (Fort neg) in dbl splash radius for 1 rd"',
  'Stone Mystery':
    'Section=skill ' +
    'Note="Appraise is a class skill/Climb is a class skill/Intimidate is a class skill/Survival is a class skill"',
  'Stone Stability':
    'Section=combat,feature ' +
    'Note=' +
      '"+4 CMD vs. bull rush and trip while standing on ground",' +
      '"Has %V feature"',
  'Strategy':
    'Section=combat ' +
    'Note="R30\' Grant immediate move, +2 AC for 1 rd, or +2 attack for 1 rd to each ally"',
  'Summon Monster':
    'Section=magic Note="May cast <i>Summon Monster %V</i> for %{levels.Summoner} min when eidolon not present %{3 + charismaModifier}/dy"',
  'Supreme Charge':
    'Section=combat ' +
    'Note="Charge does dbl damage (lance triple); critical hit stuns for 1d4 rd (DC %{baseAttackBonus+10} Will staggered 1d4 rd)"',
  'Surprising Charge':
    'Section=combat ' +
    'Note="May take extra move %{source>=15 ? 3 : source>=7 ? 2 : 1}/dy"',
  'Swift Alchemy':
    'Section=combat,magic ' +
    'Note=' +
      '"May apply poison to a blade as a move action",' +
      '"Creating alchemical items takes half normal time"',
  'Swift Poisoning':
    'Section=combat Note="May apply poison to a blade as a swift action"',
  'Tactician':
    'Section=feature ' +
    'Note="Has Teamwork feat/R30\' may grant Teamwork feat to allies for %{levels.Cavalier//2+1} rd %{levels.Cavalier//5+1}/dy"',
  'Teamwork Feat':'Section=feature Note="Gains %V Teamwork feats"',
  'Think On It':'Section=skill Note="May reroll failed Knowledge at +10 1/day"',
  'Third Judgment':'Section=combat Note="May use 3 judgments simultaneously"',
  // 'Throw Anything' in Pathfinder.js
  'Thunderburst':
    'Section=combat Note="R100\' %{(levels.Oracle+9)//4*5>?20}\' radius inflicts %{levels.Oracle}d6 HP bludgeoning and 1 hr deafness (Fort half HP only) %{(levels.Oracle-3)//4>?1}/dy"',
  'Tongues':
    'Section=combat,feature ' +
    'Note=' +
      '"Can speak only chosen outsider or elemental language during combat",' +
      '"+%V Language Count%1"',
  'Tongues Hex':
    'Section=magic ' +
    'Note="Can understand%{levels.Witch>=5 ? \' and speak\' : \'\'} any spoken language for %{levels.Witch} min/dy"',
  'Touch Of Acid':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP acid %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'; wielded weapons inflict +1d6 HP acid\' : \'\'}"',
  'Touch Of Electricity':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP electricity %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'; wielded weapons are shock\' : \'\'}"',
  'Touch Of Flame':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP fire %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'; wielded weapons are flaming\' : \'\'}"',
  // 'Track' in Pathfinder.js
  'Transcendental Bond':
    'Section=magic Note="May use <i>Telepathic Bond</i>%{levels.Oracle>=10 ? \' and cast touch spell\' : \'\'} %{levels.Oracle}/dy"',
  'Transposition':
    'Section=magic Note="May use Maker\'s Call to swap places w/eidolon"',
  'True Judgment':
    'Section=combat ' +
    'Note="Successful judgment attack kills foe (Fort neg) 1/1d4 rd"',
  'True Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +8 AC and +8/-2 to strength, dexterity, and constitution/intelligence, wisdom, and charisma for %{levels.Alchemist*10} min"',
  'Twin Eidolon':
    'Section=feature ' +
    'Note="May take form of eidolon for %{levels.Summoner} min/dy"',
  'Undead Servitude':
    'Section=feature ' +
    'Note="Can use Command Undead feature %{charismaModifier+3}/dy"',
  'Undo Artifice':
    'Section=feature ' +
    'Note="May disintegrate nonliving item into raw materials (Fort neg) %{charismaModifier}/dy"',
  'Vision Hex':
    'Section=feature ' +
    'Note="Touched target gains vision of possible event within next yr (DC %{hexDC} Will neg)"',
  'Voice Of The Grave':
    'Section=magic Note="May <i>Speak With Dead</i> %{levels.Oracle} rd/dy%{levels.Oracle>=5 ? \', target -\' + (levels.Oracle//5*2) + \' to resist\' : \'\'}"',
  'Vortex Spells':
    'Section=magic ' +
    'Note="Successful critical hit with spell staggers target for 1%{levels.Oracle>=11 ? \'d4\' : \'\'} rd"',
  'War Sight':
    'Section=combat ' +
    'Note="May take choice of %{levels.Oracle>=11 ? 3 : 2} Initiative Rolls%{levels.Oracle>=7 ? \'/May always act in surprise round\' : \'\'}"',
  'Ward Hex':
    'Section=magic ' +
    'Note="Target gains +%{levels.Witch>=16 ? 4 : levels.Witch>=8 ? 3 : 2} AC and saves until hit or failed save"',
  'Wasting':
    'Section=save,skill ' +
    'Note=' +
      '"%{levels.Oracle>=10 ? \'Immune to\' : \'+4 vs.\'} disease%1",' +
      '"-4 Charisma-based skills other than Intimidate"',
  'Water Form':
    'Section=magic ' +
    'Note="May use <i>Elemental Body %{levels.Oracle>= 13 ? \'IV\' : levels.Oracle>=11 ? \'III\' : levels.Oracle >= 9 ? \'II\' : \'I\'}</i> to become water elemental for %{levels.Oracle} hr 1/dy"',
  'Water Sight':
    'Section=feature,magic ' +
    'Note=' +
      '"Can see normally through fog and mist",' +
      '"May use <i>%V</i> via pool %{levels.Oracle} rd/dy"',
  'Waves Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Knowledge (Nature) is a class skill/Swim is a class skill"',
  'Waxen Image Hex':
    'Section=feature ' +
    'Note="R30\' Self controls target action %{intelligenceModifier} times (DC %{hexDC} Will ends)"',
  'Weapon Mastery':
    'Section=feature Note="+%V Feat Count (Weapon Focus%1 with chosen weapon)"',
  'Weather Control Hex':
    'Section=magic ' +
    'Note="May use <i>Control Weather</i> after 1 hr ritual 1/dy"',
  'Whirlwind Lesson':
    'Section=magic Note="May absorb lesson from magical tome in 8 hr%1"',
  'Wind Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Fly is a class skill/Stealth is a class skill"',
  'Wind Sight':
    'Section=magic,skill ' +
    'Note=' +
      '"May use <i>Clairaudience</i> and <i>Clairvoyance</i> on any unobstructed area %V rd/dy",' +
      '"Ignore Perception wind penalties and 100\' distance penalties"',
  'Wings Of Air':'Section=ability Note="Fly %{levels.Oracle>=10 ? 90 : 60}\'"',
  'Wings Of Fire':'Section=ability Note="Fly 60\'"',
  'Wintry Touch':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Oracle//2} HP fire %{charismaModifier+3}/dy%{levels.Oracle>=11 ? \'; wielded weapons are frost\' : \'\'}"',
  "Witch's Familiar":
    'Section=feature Note="Has Familiar features/Familiar stores spells"',
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
    'Note="Claws do %{features.Small ? \'1d3\' : \'1d4\'} HP damage"',
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
    'Note="+2 Knowledge/+2 Profession/May use Knowledge and Profession untrained"',
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
    'Note="May use full-round action to increase threat area by %{baseAttackBonus//5}\'"',
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
    'Note="Critical hit reduces foe speed by half for 1 min (DC %{10 + baseAttackBonus} Fort 1d4 rd)"',
  'Crossbow Mastery':
    'Section=combat Note="May reload crossbow as free action w/out AOO"',
  'Dastardly Finish':
    'Section=combat Note="May coup de grace cowering and stunned targets"',
  'Dazing Assault':
    'Section=feature ' +
    'Note="May suffer -5 attack to daze w/hit (DC %{10 + baseAttackBonus} neg)"',
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
    'Note="Successful Elemental Strike inflicts +1d6 HP of choice of energy type"',
  'Elemental Focus (Acid)':
    'Section=feature Note="+%V DC on spells that inflict acid damage"',
  'Elemental Focus (Cold)':
    'Section=feature Note="+%V DC on spells that inflict cold damage"',
  'Elemental Focus (Electricity)':
    'Section=feature Note="+%V DC on spells that inflict electricity damage"',
  'Elemental Focus (Fire)':
    'Section=feature Note="+%V DC on spells that inflict fire damage"',
  'Elemental Spell (Acid)':
    'Section=magic Note="May convert half of spell damage to acid damage"',
  'Elemental Spell (Cold)':
    'Section=magic Note="May convert half of spell damage to cold damage"',
  'Elemental Spell (Electricity)':
    'Section=magic Note="May convert half of spell damage to electricity damage"',
  'Elemental Spell (Fire)':
    'Section=magic Note="May convert half of spell damage to fire damage"',
  'Elven Accuracy':
    'Section=combat Note="May reroll bow miss due to concealment"',
  'Enforcer':
    'Section=combat ' +
    'Note="May make Intimidation check to shake foe for HP rd (crit also frightened 1 rd) after inflicting nonlethal damage"',
  'Expanded Arcana':
    'Section=magic Note="+1 spells know (+2 of lower than max level)"',
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
  'Greater Steal':'Section=feature Note="FILL"',
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
    'Note="Use better of two rolls when attacking w/kama, nunchaku, quarterstaff, sai or siangham %{level//4>?1}/dy"',
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
    'Section=feature Note="Successful kick attack pushes foe 5\' or knocks prone (DC %{10+level//2+wisdomModifier} neg) %{level//5>?1}/dy"',
  'Pushing Assault':
    'Section=combat ' +
    'Note="May trade Power Attack damage bonus for 5\' push (10\' if critical hit)"',
  'Racial Heritage':
    'Section=feature ' +
    'Note="Count as both human and chosen race for racial effects"',
  'Raging Vitality':
    'Section=combat Note="+2 Con during rage; rage continues if unconscious"',
  'Ray Shield':'Section=combat Note="No damage from ranged touch hit 1/rd"',
  'Razortusk':'Section=combat Note="Bite does 1d4 HP damage"',
  'Reach Spell':
    'Section=magic ' +
    'Note="Cast spell at longer rage uses +1 spell slot/range increase"',
  'Rending Claws':
    'Section=combat Note="Second claw hit in 1 rd does +1d6 HP damage 1/rd"',
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
    'Section=feature Note="+2 AC vs. critical hit/+%V CMD"',
  'Shield Specialization (Heavy)':
    'Section=feature Note="+2 AC vs. critical hit/+%V CMD"',
  'Shield Specialization (Light)':
    'Section=feature Note="+2 AC vs. critical hit/+%V CMD"',
  'Shield Specialization (Tower)':
    'Section=feature Note="+2 AC vs. critical hit/+%V CMD"',
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
    'Note="May move half Slow Fall distance (50\' max) across walls, ceiling, and unsupporting surfaces"',
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
    'Note="May trade -5 attack for 1 rd stun (DC %{10+baseAttackBonus} neg)"',
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
    'Note="May trade damage on attack for preventing spellcasting for 1 rd (DC %{10+level//2+wisdomModifier} Will neg)"',
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
      '"1:Fast Ride","5:Bestial Mount"',
  'Savage Barbarian':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Naked Courage","7:Natural Toughness"',
  'Standard Barbarian':
    'Group=Barbarian ' +
    'Level=levels.Barbarian',
  'Superstitious':
    'Group=Barbarian ' +
    'Level=levels.Barbarian ' +
    'Features=' +
      '"3:Sixth Sense","7:Keen Senses (Barbarian)"',
  'Totem Warrior':
    'Group=Barbarian ' +
    'Level=levels.Barbarian',

  'Agathion Subdomain':
    Pathfinder.PATHS['Good Domain'].replace('Holy Lance', 'Protective Aura'),
  'Ancestors Subdomain':
    Pathfinder.PATHS['Repose Domain'].replace('Ward Against Death', 'Speak With Dead'),
  'Arcane Subdomain':
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
    Pathfinder.PATHS['Law Domain'].replace('Touch Of Evil', "Hell's Corruption"),
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
  'Protean Subdomain':
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
  'Undead Subdomain':
    Pathfinder.PATHS['Death Domain'].replace('Bleeding Touch', "Death's Kiss"),
  'Wards Subdomain':
    Pathfinder.PATHS['Rune Domain'].replace('Spell Rune', 'Warding Rune'),
  'Wind Subdomain':
    Pathfinder.PATHS['Air Domain'].replace('Lightning Arc', 'Wind Blast'),

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
      '"11:Arcane Archivist:Lore Revelation",' +
      '"1:Automatic Writing:Lore Revelation",' +
      '"1:Brain Drain:Lore Revelation",' +
      '"1:Focused Trance:Lore Revelation",' +
      '"1:Lore Keeper:Lore Revelation",' +
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
      '"1:Crystal Strike:Stone Revelation",' +
      '"7:Earth Glide:Stone Revelation",' +
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
    'Description="Poison affecting touched takes effect immediately or does dbl damage for half duration"',
  'Acid Pit':
    'School=Conjuration ' +
    'Level=W4,Summoner4 ' +
    'Description="FILL"',
  'Alchemical Allocation':
    'School=Transmutation ' +
    'Level=Alchemist2 ' +
    'Description="Self gains effect of potion used in next rd w/out swallowing"',
  'Allfood':
    'School=Transmutation ' +
    'Level=R2 ' +
    'Description="Transforms touched $L5 object into edible substance"',
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
    'Level=Alchemist1,C1,D1,R1,W1,Summoner1 ' +
    'Description="Touched gains triple carrying capacity for $L2 rd"',
  'Aqueous Orb':
    'School=Conjuration ' +
    'Level=D3,W3,Summoner3 ' +
    'Description="R$RM\' 10\' diameter sphere douses fires, inflicts 2d6 HP nonlethal (Ref neg) and engulfs (Ref neg), jumps or moves 30\'/rd for $L rd"',
  'Arcane Concordance':
    'School=Evocation ' +
    'Level=B3 ' +
    'Description="10\' radius gives +1 ally spell DC and free use of choice of Enlarge Spell, Extend Spell, Silent Spell, or Still Spell for $L rd"',
  'Arrow Eruption':
    'School=Conjuration ' +
    'Level=R2,W2 ' +
    'Description="R$RL Duplicates of killing arrow attack %{lvl<?15} foes in 30\' radius"',
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
    'Description="Allies in 10\' radius gain immunity to fear for $L10 min"',
  'Ball Lightning':
    'School=Evocation ' +
    'Level=D4,W4 ' +
    'Description="FILL"',
  'Banish Seeming':
    'School=Abjuration ' +
    'Level=Inquisitor3,Witch5 ' +
    'Description="FILL"',
  "Bard's Escape":
    'School=Conjuration ' +
    'Level=B5 ' +
    'Description="FILL"',
  'Beguiling Gift':
    'School=Enchantment ' +
    'Level=B1,Witch1 ' +
    'Description="FILL"',
  'Bestow Grace':
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Blaze Of Glory':
    'School=Conjuration ' +
    'Level=P4 ' +
    'Description="FILL"',
  'Blessing Of Courage and Life':
    'School=Conjuration ' +
    'Level=C2,P2 ' +
    'Description="FILL"',
  'Blessing Of Fervor':
    'School=Transmutation ' +
    'Level=C4 ' +
    'Description="FILL"',
  'Blessing Of The Salamander':
    'School=Transmutation ' +
    'Level=D5,R4 ' +
    'Description="FILL"',
  'Blood Biography':
    'School=Divination ' +
    'Level=B2,C3,Inquisitor3,W3 ' +
    'Description="FILL"',
  'Bloodhound':
    'School=Transmutation ' +
    'Level=Alchemist3,Inquisitor2,R2 ' +
    'Description="FILL"',
  'Bloody Claws':
    'School=Necromancy ' +
    'Level=D4,R3 ' +
    'Description="FILL"',
  "Bomber's Eye":
    'School=Transmutation ' +
    'Level=Alchemist1 ' +
    'Description="FILL"',
  'Borrow Fortune':
    'School=Evocation ' +
    'Level=Fate3,Oracle3 ' +
    'Description="FILL"',
  'Borrow Skill':
    'School=Transmutation ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Bow Spirit':
    'School=Conjuration ' +
    'Level=R4 ' +
    'Description="FILL"',
  'Brand':
    'School=Transmutation ' +
    'Level=Inquisitor0 ' +
    'Description="FILL"',
  'Greater Brand':
    'School=Transmutation ' +
    'Level=Inquisitor4 ' +
    'Description="FILL"',
  'Break':
    'School=Transmutation ' +
    'Level=W1 ' +
    'Description="FILL"',
  'Brilliant Inspiration':
    'School=Evocation ' +
    'Level=B6,Leadership6 ' +
    'Description="FILL"',
  'Bristle':
    'School=Transmutation ' +
    'Level=D1 ' +
    'Description="FILL"',
  'Burning Gaze':
    'School=Evocation ' +
    'Level=D2,W2,Witch2 ' +
    'Description="FILL"',
  'Burst Bonds':
    'School=Evocation ' +
    'Level=Inquisitor1 ' +
    'Description="FILL"',
  'Cacophonous Call':
    'School=Enchantment ' +
    'Level=B2 ' +
    'Description="FILL"',
  'Mass Cacophonous Call':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="FILL"',
  'Calcific Touch':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="FILL"',
  'Call Animal':
    'School=Enchantment ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  'Campfire Wall':
    'School=Evocation ' +
    'Level=B3,D2,R2,W3 ' +
    'Description="FILL"',
  'Cast Out':
    'School=Abjuration ' +
    'Level=Inquisitor3 ' +
    'Description="FILL"',
  'Castigate':
    'School=Enchantment ' +
    'Level=Inquisitor2 ' +
    'Description="FILL"',
  'Mass Castigate':
    'School=Enchantment ' +
    'Level=Inquisitor5 ' +
    'Description="FILL"',
  'Challenge Evil':
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="FILL"',
  'Chameleon Stride':
    'School=Illusion ' +
    'Level=R2 ' +
    'Description="FILL"',
  'Clashing Rocks':
    'School=Conjuration ' +
    'Level=D9,W9,Stone9 ' +
    'Description="FILL"',
  'Cleanse':
    'School=Evocation ' +
    'Level=C5,Divine5,Inquisitor6 ' +
    'Description="FILL"',
  'Cloak Of Dreams':
    'School=Enchantment ' +
    'Level=B5,Nightmare6,W6,Witch6 ' +
    'Description="FILL"',
  'Cloak Of Shade':
    'School=Abjuration ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  'Cloak Of Winds':
    'School=Abjuration ' +
    'Level=D3,R3,W3,Wind3 ' +
    'Description="FILL"',
  'Confess':
    'School=Enchantment ' +
    'Level=Inquisitor2 ' +
    'Description="FILL"',
  'Contagious Flame':
    'School=Evocation ' +
    'Level=W6 ' +
    'Description="FILL"',
  'Coordinated Effort':
    'School=Divination ' +
    'Level=B3,Inquisitor3 ' +
    'Description="FILL"',
  'Corruption Resistance':
    'School=Abjuration ' +
    'Level=Antipaladin2,Inquisitor2,P2 ' +
    'Description="FILL"',
  "Coward's Lament":
    'School=Enchantment ' +
    'Level=Inquisitor4 ' +
    'Description="FILL"',
  "Crafter's Curse":
    'School=Transmutation ' +
    'Level=W1 ' +
    'Description="FILL"',
  "Crafter's Fortune":
    'School=Transmutation ' +
    'Level=Alchemist1,W1 ' +
    'Description="FILL"',
  'Create Pit':
    'School=Conjuration ' +
    'Level=Caves2,W2,Summoner2 ' +
    'Description="FILL"',
  'Create Treasure Map':
    'School=Divination ' +
    'Level=B2,D3,R2,W2 ' +
    'Description="FILL"',
  'Cup Of Dust':
    'School=Transmutation ' +
    'Level=D3,Witch3 ' +
    'Description="FILL"',
  'Dancing Lantern':
    'School=Transmutation ' +
    'Level=B1,C1,R1,W1,Witch1 ' +
    'Description="FILL"',
  'Deadly Finale':
    'School=Evocation ' +
    'Level=B6 ' +
    'Description="FILL"',
  'Deafening Song Bolt':
    'School=Evocation ' +
    'Level=B5 ' +
    'Description="FILL"',
  'Defile Armor':
    'School=Abjuration ' +
    'Level=Inquisitor4,Antipaladin3 ' +
    'Description="FILL"',
  'Deflection':
    'School=Abjuration ' +
    'Level=Defense7,W7 ' +
    'Description="FILL"',
  'Delayed Consumption':
    'School=Transmutation ' +
    'Level=Alchemist5 ' +
    'Description="FILL"',
  'Denounce':
    'School=Enchantment ' +
    'Level=B4,Inquisitor4 ' +
    'Description="FILL"',
  'Detect Aberration':
    'School=Divination ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  'Detonate':
    'School=Evocation ' +
    'Level=Alchemist4,W4 ' +
    'Description="FILL"',
  'Devolution':
    'School=Transmutation ' +
    'Level=W3,Summoner3 ' +
    'Description="FILL"',
  'Discordant Blast':
    'School=Evocation ' +
    'Level=B4 ' +
    'Description="FILL"',
  'Divine Transfer':
    'School=Necromancy ' +
    'Level=P3 ' +
    'Description="FILL"',
  'Divine Vessel':
    'School=Transmutation ' +
    'Level=Oracle8 ' +
    'Description="FILL"',
  'Draconic Reservoir':
    'School=Evocation ' +
    'Level=Alchemist3,W3 ' +
    'Description="FILL"',
  "Dragon's Breath":
    'School=Evocation ' +
    'Level=Alchemist4,W4 ' +
    'Description="FILL"',
  'Dust Of Twilight':
    'School=Conjuration ' +
    'Level=B2,W2 ' +
    'Description="FILL"',
  'Eagle Eye':
    'School=Divination ' +
    'Level=D2,R2 ' +
    'Description="FILL"',
  'Elemental Aura':
    'School=Evocation ' +
    'Level=Alchemist3,W3 ' +
    'Description="FILL"',
  'Elemental Speech':
    'School=Divination ' +
    'Level=B3,C3,D2,W2 ' +
    'Description="FILL"',
  'Elemental Touch':
    'School=Evocation ' +
    'Level=Alchemist2,W2 ' +
    'Description="FILL"',
  'Elude Time':
    'School=Transmutation ' +
    'Level=Alchemist5 ' +
    'Description="FILL"',
  'Enemy Hammer':
    'School=Transmutation ' +
    'Level=W6 ' +
    'Description="FILL"',
  'Enter Image':
    'School=Transmutation ' +
    'Level=B2,C3,W3 ' +
    'Description="FILL"',
  'Euphoric Tranquility':
    'School=Enchantment ' +
    'Level=B6,C8,D8,Love8,W8 ' +
    'Description="FILL"',
  'Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner3 ' +
    'Description="FILL"',
  'Greater Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner4 ' +
    'Description="FILL"',
  'Lesser Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner2 ' +
    'Description="FILL"',
  'Expeditious Excavation':
    'School=Transmutation ' +
    'Level=D1,W1 ' +
    'Description="FILL"',
  'Expend':
    'School=Abjuration ' +
    'Level=W7 ' +
    'Description="FILL"',
  'Feast Of Ashes':
    'School=Transmutation ' +
    'Level=D2,Witch2 ' +
    'Description="FILL"',
  'Feather Step':
    'School=Transmutation ' +
    'Level=B1,D1,R1 ' +
    'Description="FILL"',
  'Mass Feather Step':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description="FILL"',
  'Fester':
    'School=Necromancy ' +
    'Level=Inquisitor3,Witch2 ' +
    'Description="FILL"',
  'Mass Fester':
    'School=Necromancy ' +
    'Level=Inquisitor6,Witch6 ' +
    'Description="FILL"',
  'Fiery Body':
    'School=Transmutation ' +
    'Level=Ash9,W9,Flame9 ' +
    'Description="FILL"',
  'Fire Breath':
    'School=Evocation ' +
    'Level=Alchemist2,W2 ' +
    'Description="FILL"',
  'Fire Of Entanglement':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Fire Of Judgment':
    'School=Evocation ' +
    'Level=P3 ' +
    'Description="FILL"',
  'Fire Of Vengeance':
    'School=Evocation ' +
    'Level=P4 ' +
    'Description="FILL"',
  'Fire Snake':
    'School=Evocation ' +
    'Level=D5,W5 ' +
    'Description="FILL"',
  'Firebrand':
    'School=Transmutation ' +
    'Level=W7 ' +
    'Description="FILL"',
  'Firefall':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="FILL"',
  'Flames Of The Faithful':
    'School=Transmutation ' +
    'Level=Inquisitor2 ' +
    'Description="FILL"',
  'Flare Burst':
    'School=Evocation ' +
    'Level=B1,D1,W1 ' +
    'Description="FILL"',
  'Fluid Form':
    'School=Transmutation ' +
    'Level=Alchemist4,W6,Waves6 ' +
    'Description="FILL"',
  'Mass Fly':
    'School=Transmutation ' +
    'Level=Feather6,W7 ' +
    'Description="FILL"',
  'Foe to Friend':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="FILL"',
  'Follow Aura':
    'School=Divination ' +
    'Level=Inquisitor2 ' +
    'Description="FILL"',
  "Fool's Forbiddance":
    'School=Abjuration ' +
    'Level=B6 ' +
    'Description="FILL"',
  'Forced Repentance':
    'School=Enchantment ' +
    'Level=Inquisitor4,P4 ' +
    'Description="FILL"',
  'Frozen Note':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="FILL"',
  'Gallant Inspiration':
    'School=Divination ' +
    'Level=B2 ' +
    'Description="FILL"',
  'Getaway':
    'School=Conjuration ' +
    'Level=B6,W6 ' +
    'Description="FILL"',
  'Geyser':
    'School=Conjuration ' +
    'Level=D4,W5,Waves5 ' +
    'Description="FILL"',
  'Ghostbane Dirge':
    'School=Transmutation ' +
    'Level=B2,C2,Inquisitor2,P1 ' +
    'Description="FILL"',
  'Mass Ghostbane Dirge':
    'School=Transmutation ' +
    'Level=B4,C5,Inquisitor5,P3 ' +
    'Description="FILL"',
  'Glide':
    'School=Transmutation ' +
    'Level=D2,R1,W2,Summoner2,Witch2 ' +
    'Description="FILL"',
  'Grace':
    'School=Abjuration ' +
    'Level=C2,P1 ' +
    'Description="FILL"',
  'Gravity Bow':
    'School=Transmutation ' +
    'Level=R1,W1 ' +
    'Description="FILL"',
  'Grove Of Respite':
    'School=Conjuration ' +
    'Level=D4,R4,Nature4 ' +
    'Description="FILL"',
  'Guiding Star':
    'School=Divination ' +
    'Level=C3,R2,Witch3 ' +
    'Description="FILL"',
  'Heroic Finale':
    'School=Enchantment ' +
    'Level=B4 ' +
    'Description="FILL"',
  "Hero's Defiance":
    'School=Conjuration ' +
    'Level=P1 ' +
    'Description="FILL"',
  'Hidden Speech':
    'School=Transmutation ' +
    'Level=B2,Inquisitor3,Witch2 ' +
    'Description="FILL"',
  'Hide Campsite':
    'School=Illusion ' +
    'Level=D3,R2 ' +
    'Description="FILL"',
  'Holy Whisper':
    'School=Evocation ' +
    'Level=P3 ' +
    'Description="FILL"',
  'Honeyed Tongue':
    'School=Transmutation ' +
    'Level=B2,Inquisitor2,P1 ' +
    'Description="FILL"',
  'Hungry Pit':
    'School=Conjuration ' +
    'Level=Caves6,W5,Summoner5 ' +
    'Description="FILL"',
  "Hunter's Eye":
    'School=Divination ' +
    'Level=Inquisitor3,R2 ' +
    'Description="FILL"',
  "Hunter's Howl":
    'School=Necromancy ' +
    'Level=R1 ' +
    'Description="FILL"',
  'Hydraulic Push':
    'School=Evocation ' +
    'Level=D1,W1 ' +
    'Description="FILL"',
  'Hydraulic Torrent':
    'School=Evocation ' +
    'Level=D3,W3 ' +
    'Description="FILL"',
  'Ill Omen':
    'School=Enchantment ' +
    'Level=Witch1 ' +
    'Description="FILL"',
  'Innocence':
    'School=Transmutation ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Instant Armor':
    'School=Conjuration ' +
    'Level=C2,P2 ' +
    'Description="FILL"',
  'Instant Enemy':
    'School=Enchantment ' +
    'Level=R3 ' +
    'Description="FILL"',
  'Invigorate':
    'School=Illusion ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Mass Invigorate':
    'School=Illusion ' +
    'Level=B3 ' +
    'Description="FILL"',
  "Jester's Jaunt":
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="FILL"',
  'Keen Senses':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,R1 ' +
    'Description="FILL"',
  "King's Castle":
    'School=Conjuration ' +
    'Level=P4 ' +
    'Description="FILL"',
  "Knight's Calling":
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="FILL"',
  'Lead Blades':
    'School=Transmutation ' +
    'Level=R1 ' +
    'Description="FILL"',
  'Life Bubble':
    'School=Abjuration ' +
    'Level=C5,D4,R3,W5 ' +
    'Description="FILL"',
  'Light Lance':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Lily Pad Stride':
    'School=Transmutation ' +
    'Level=D3 ' +
    'Description="FILL"',
  'Lockjaw':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="FILL"',
  'Marks Of Forbiddance':
    'School=Abjuration ' +
    'Level=P3 ' +
    'Description="FILL"',
  'Mask Dweomer':
    'School=Illusion ' +
    'Level=Witch1 ' +
    'Description="FILL"',
  'Memory Lapse':
    'School=Enchantment ' +
    'Level=B1,Memory2,W1 ' +
    'Description="FILL"',
  'Moonstruck':
    'School=Enchantment ' +
    'Level=D4,Insanity4,Rage6,W4,Witch4 ' +
    'Description="FILL"',
  'Nap Stack':
    'School=Necromancy ' +
    'Level=C3 ' +
    'Description="FILL"',
  'Natural Rhythm':
    'School=Transmutation ' +
    'Level=D2 ' +
    'Description="FILL"',
  "Nature's Exile":
    'School=Transmutation ' +
    'Level=D3,Witch3 ' +
    'Description="FILL"',
  'Negate Aroma':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,R1 ' +
    'Description="FILL"',
  'Oath Of Peace':
    'School=Abjuration ' +
    'Level=P4 ' +
    'Description="FILL"',
  "Oracle's Burden":
    'School=Necromancy ' +
    'Level=Oracle2 ' +
    'Description="FILL"',
  'Pain Strike':
    'School=Evocation ' +
    'Level=W3,Witch3 ' +
    'Description="FILL"',
  'Mass Pain Strike':
    'School=Evocation ' +
    'Level=W5,Witch5 ' +
    'Description="FILL"',
  "Paladin's Sacrifice":
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Perceive Cues':
    'School=Transmutation ' +
    'Level=Alchemist2,Inquisitor2,R2,Witch2 ' +
    'Description="FILL"',
  'Phantasmal Revenge':
    'School=Illusion ' +
    'Level=W7 ' +
    'Description="FILL"',
  'Phantasmal Web':
    'School=Illusion ' +
    'Level=B5,Insanity6,W5 ' +
    'Description="FILL"',
  'Pied Piping':
    'School=Enchantment ' +
    'Level=B6 ' +
    'Description="FILL"',
  'Pillar Of Life':
    'School=Conjuration ' +
    'Level=C5 ' +
    'Description="FILL"',
  'Planar Adaptation':
    'School=Transmutation ' +
    'Level=Alchemist5,C4,W5,Summoner5 ' +
    'Description="FILL"',
  'Mass Planar Adaptation':
    'School=Transmutation ' +
    'Level=W7,Summoner6 ' +
    'Description="FILL"',
  'Pox Pustules':
    'School=Necromancy ' +
    'Level=D2,W2 ' +
    'Description="FILL"',
  'Protective Spirit':
    'School=Conjuration ' +
    'Level=R2 ' +
    'Description="FILL"',
  'Purging Finale':
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="FILL"',
  'Purified Calling':
    'School=Conjuration ' +
    'Level=Summoner4 ' +
    'Description="FILL"',
  'Putrefy Food and Drink':
    'School=Transmutation ' +
    'Level=W0 ' +
    'Description="FILL"',
  'Rally Point':
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="FILL"',
  'Rampart':
    'School=Conjuration ' +
    'Level=D7,W7 ' +
    'Description="FILL"',
  'Rebuke':
    'School=Evocation ' +
    'Level=Inquisitor4 ' +
    'Description="FILL"',
  'Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner3 ' +
    'Description="FILL"',
  'Greater Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner5 ' +
    'Description="FILL"',
  'Lesser Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner1 ' +
    'Description="FILL"',
  'Residual Tracking':
    'School=Divination ' +
    'Level=R1 ' +
    'Description="FILL"',
  'Resounding Blow':
    'School=Evocation ' +
    'Level=Antipaladin4,Inquisitor5,Paladin40 ' +
    'Description="FILL"',
  'Rest Eternal':
    'School=Necromancy ' +
    'Level=Ancestors4,C4,D5,Witch5 ' +
    'Description="FILL"',
  'Restful Sleep':
    'School=Necromancy ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Resurgent Transformation':
    'School=Conjuration ' +
    'Level=Alchemist5 ' +
    'Description="FILL"',
  'Retribution':
    'School=Necromancy ' +
    'Level=Inquisitor3 ' +
    'Description="FILL"',
  'Reviving Finale':
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="FILL"',
  'Righteous Vigor':
    'School=Enchantment ' +
    'Level=Inquisitor3,P2 ' +
    'Description="FILL"',
  'River Of Wind':
    'School=Evocation ' +
    'Level=D4,W4,Wind4 ' +
    'Description="FILL"',
  'Sacred Bond':
    'School=Conjuration ' +
    'Level=C3,Inquisitor2,P2 ' +
    'Description="FILL"',
  'Sacrificial Oath':
    'School=Abjuration ' +
    'Level=Martyr6,P4 ' +
    'Description="FILL"',
  'Saddle Surge':
    'School=Transmutation ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Sanctify Armor':
    'School=Abjuration ' +
    'Level=Inquisitor4,P3 ' +
    'Description="FILL"',
  'Saving Finale':
    'School=Evocation ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Scent Trail':
    'School=Transmutation ' +
    'Level=D2 ' +
    'Description="FILL"',
  'Screech':
    'School=Evocation ' +
    'Level=Witch3 ' +
    'Description="FILL"',
  'Sculpt Corpse':
    'School=Necromancy ' +
    'Level=W1 ' +
    'Description="FILL"',
  'Seamantle':
    'School=Conjuration ' +
    'Level=D8,W8,Waves8 ' +
    'Description="FILL"',
  'Seek Thoughts':
    'School=Divination ' +
    'Level=Alchemist3,B3,Inquisitor3,Memory3,Summoner3,W3,Witch3 ' +
    'Description="FILL"',
  'Shadow Projection':
    'School=Necromancy ' +
    'Level=W4 ' +
    'Description="FILL"',
  'Share Language':
    'School=Divination ' +
    'Level=B1,C2,D2,Language2,W2 ' +
    'Description="FILL"',
  'Share Senses':
    'School=Divination ' +
    'Level=W4,Witch3 ' +
    'Description="FILL"',
  'Shared Wrath':
    'School=Enchantment ' +
    'Level=Inquisitor4 ' +
    'Description="FILL"',
  'Shifting Sand':
    'School=Transmutation ' +
    'Level=D3,W3 ' +
    'Description="FILL"',
  'Sift':
    'School=Divination ' +
    'Level=B0,Inquisitor0 ' +
    'Description="FILL"',
  'Sirocco':
    'School=Evocation ' +
    'Level=D6,Storms6,W60,Wind6 ' +
    'Description="FILL"',
  'Sleepwalk':
    'School=Enchantment ' +
    'Level=Inquisitor4,Witch4 ' +
    'Description="FILL"',
  'Slipstream':
    'School=Conjuration ' +
    'Level=D2,Oceans2,R2,W2,Waves2 ' +
    'Description="FILL"',
  'Snake Staff':
    'School=Transmutation ' +
    'Level=C5,D5 ' +
    'Description="FILL"',
  'Solid Note':
    'School=Conjuration ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Spark':
    'School=Evocation ' +
    'Level=B0,C0,D0,W0,Witch0 ' +
    'Description="FILL"',
  'Spiked Pit':
    'School=Conjuration ' +
    'Level=Caves3,W3,Summoner3 ' +
    'Description="FILL"',
  'Spiritual Ally':
    'School=Evocation ' +
    'Level=C4 ' +
    'Description="FILL"',
  'Spite':
    'School=Abjuration ' +
    'Level=Witch4 ' +
    'Description="FILL"',
  'Stay the Hand':
    'School=Enchantment ' +
    'Level=P4 ' +
    'Description="FILL"',
  'Stone Call':
    'School=Conjuration ' +
    'Level=D2,R2,W2,Stone2 ' +
    'Description="FILL"',
  'Stone Fist':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,W1 ' +
    'Description="FILL"',
  'Stormbolts':
    'School=Evocation ' +
    'Level=C8,D8,W8,Witch8 ' +
    'Description="FILL"',
  'Strong Jaw':
    'School=Transmutation ' +
    'Level=D4,R3 ' +
    'Description="FILL"',
  'Stumble Gap':
    'School=Conjuration ' +
    'Level=W1 ' +
    'Description="FILL"',
  'Stunning Finale':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="FILL"',
  'Suffocation':
    'School=Necromancy ' +
    'Level=Murder5,W5,Witch5 ' +
    'Description="FILL"',
  'Mass Suffocation':
    'School=Necromancy ' +
    'Level=Murder9,W9,Witch9 ' +
    'Description="FILL"',
  'Summon Eidolon':
    'School=Conjuration ' +
    'Level=Summoner2 ' +
    'Description="FILL"',
  'Swarm Skin':
    'School=Transmutation ' +
    'Level=D6,Witch6 ' +
    'Description="FILL"',
  'Thorn Body':
    'School=Transmutation ' +
    'Level=Alchemist3,D4 ' +
    'Description="FILL"',
  'Threefold Aspect':
    'School=Transmutation ' +
    'Level=D5,Witch4 ' +
    'Description="FILL"',
  'Thundering Drums':
    'School=Evocation ' +
    'Level=B3 ' +
    'Description="FILL"',
  'Timely Inspiration':
    'School=Divination ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Tireless Pursuers':
    'School=Transmutation ' +
    'Level=Inquisitor4,R3 ' +
    'Description="FILL"',
  'Tireless Pursuit':
    'School=Transmutation ' +
    'Level=Inquisitor1,R1 ' +
    'Description="FILL"',
  'Touch Of Gracelessness':
    'School=Transmutation ' +
    'Level=B1,W1 ' +
    'Description="FILL"',
  'Touch Of The Sea':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,W1,Waves1 ' +
    'Description="FILL"',
  'Transmogrify':
    'School=Transmutation ' +
    'Level=Summoner4 ' +
    'Description="FILL"',
  'Transmute Potion to Poison':
    'School=Transmutation ' +
    'Level=Alchemist2 ' +
    'Description="FILL"',
  'Treasure Stitching':
    'School=Transmutation ' +
    'Level=B4,C4,W5 ' +
    'Description="FILL"',
  'True Form':
    'School=Abjuration ' +
    'Level=D4,W4 ' +
    'Description="FILL"',
  'Tsunami':
    'School=Conjuration ' +
    'Level=D9,Oceans9,W9,Waves9 ' +
    'Description="FILL"',
  'Twilight Knife':
    'School=Evocation ' +
    'Level=W3,Witch3 ' +
    'Description="FILL"',
  'Twin Form':
    'School=Transmutation ' +
    'Level=Alchemist6 ' +
    'Description="FILL"',
  'Unfetter':
    'School=Transmutation ' +
    'Level=Summoner1 ' +
    'Description="FILL"',
  'Universal Formula':
    'School=Transmutation ' +
    'Level=Alchemist4 ' +
    'Description="FILL"',
  'Unwilling Shield':
    'School=Necromancy ' +
    'Level=B5,Inquisitor5,W6,Witch6 ' +
    'Description="FILL"',
  'Unwitting Ally':
    'School=Enchantment ' +
    'Level=B0 ' +
    'Description="FILL"',
  'Vanish':
    'School=Illusion ' +
    'Level=B1,W1 ' +
    'Description="FILL"',
  'Veil Of Positive Energy':
    'School=Abjuration ' +
    'Level=P1 ' +
    'Description="FILL"',
  'Venomous Bolt':
    'School=Necromancy ' +
    'Level=R3 ' +
    'Description="FILL"',
  'Versatile Weapon':
    'School=Transmutation ' +
    'Level=B2,R2,W3 ' +
    'Description="FILL"',
  'Vomit Swarm':
    'School=Conjuration ' +
    'Level=Alchemist2,Witch2 ' +
    'Description="FILL"',
  'Vortex':
    'School=Evocation ' +
    'Level=D7,W7,Waves7 ' +
    'Description="FILL"',
  'Wake Of Light':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Wall Of Lava':
    'School=Conjuration ' +
    'Level=D8,W8 ' +
    'Description="FILL"',
  'Wall Of Suppression':
    'School=Abjuration ' +
    'Level=W9 ' +
    'Description="FILL"',
  'Wandering Star Motes':
    'School=Illusion ' +
    'Level=B4,W4,Witch4 ' +
    'Description="FILL"',
  'Ward the Faithful':
    'School=Abjuration ' +
    'Level=Inquisitor3 ' +
    'Description="FILL"',
  'Weapon Of Awe':
    'School=Transmutation ' +
    'Level=C2,Inquisitor2,P2 ' +
    'Description="FILL"',
  'Winds Of Vengeance':
    'School=Transmutation ' +
    'Level=C9,D9,W9,Wind9 ' +
    'Description="FILL"',
  'World Wave':
    'School=Transmutation ' +
    'Level=D9,Exploration9,W9,Nature9 ' +
    'Description="FILL"',
  'Wrath':
    'School=Enchantment ' +
    'Level=Inquisitor1 ' +
    'Description="FILL"',
  'Wrathful Mantle':
    'School=Evocation ' +
    'Level=C3,P3 ' +
    'Description="FILL"'

};
PFAPG.SPELLS_LEVELS_ADDED = {

  'Acid Splash':'Inquisitor0',
  'Aid':'Curse2,Inquisitor2,Tactics2',
  'Air Walk':'Wind4',
  'Alarm':'Home1,Inquisitor1',
  'Align Weapon':'Agathion2,"Archon Good2","Archon Law2","Azata Chaos2","Azata Good2",Daemon2,"Demon Chaos2","Demon Evil2","Devil Evil2","Devil Law2",Inevitable2,Inquisitor2,Protean2',
  'Analyze Dweomer':'Arcane6',
  'Animal Shapes':'Feather7,Fur7,Nature8',
  'Animate Dead':'Bones3,Souls3,Undead3',
  'Animate Plants':'Decay7,Growth7',
  'Animate Rope':'Construct1',
  'Antilife Shell':'Fur6,Souls6',
  'Antimagic Field':'Defense6,Divine6,Purity6',
  'Arcane Eye':'Arcane4',
  'Arcane Lock':'Wards1',
  'Arcane Sight':'Inquisitor3',
  'Atonement':'Inquisitor5,Purity5',
  'Augury':'Fate2',
  'Awaken':'Nature5',
  'Bane':'Curse1,Inquisitor1',
  'Banishment':'Inquisitor5',
  'Barkskin':'Decay2,Defense2,Growth2,Nature2',
  'Beast Shape I':'Fur3',
  'Beast Shape III':'Feather5,Fur5',
  'Bestow Curse':'Curse3',
  'Blade Barrier':'Blood6,Inquisitor6,Tactics6',
  'Blasphemy':'Daemon7,"Demon Evil7","Devil Evil7",Inquisitor6',
  'Bleed':'Inquisitor0',
  'Bless Water':'Divine2,Inquisitor1',
  'Bless Weapon':'Heroism2',
  'Bless':'Family1,Inquisitor1,Leadership1,Resolve1',
  'Blight':'Seasons4',
  'Blindness/Deafness':'Loss2,Night2',
  'Break Enchantment':'Curse5,Fate5,Inquisitor5,Restoration5,Revolution5',
  'Breath Of Life':'Life5',
  "Bull's Strength":'Ferocity2,Rage2,Resolve2',
  'Burning Hands':'Ash1,Flame1,Smoke1',
  'Call Lightning':'Catastrophe3,Seasons3,Storms3',
  'Call Lightning Storm':'Storms5',
  'Calm Animals':'Feather1',
  'Calm Emotions':'Family2,Inquisitor2',
  'Cause Fear':'Bones1,Daemon1,Inquisitor1,Murder1,Undead1',
  'Chain Lightning':'Cloud6,Heavens6',
  'Chaos Hammer':'"Azata Chaos4","Demon Chaos4",Inquisitor4,Protean4',
  'Charm Animal':'Nature1',
  'Charm Monster':'Love5,Lust5',
  'Charm Person':'Love1,Lust1',
  'Circle Of Death':'Bones6,Inquisitor6',
  'Clenched Fist':'Ferocity8,Resolve8',
  'Cloak Of Chaos':'"Azata Chaos8","Demon Chaos8",Protean8',
  'Color Spray':'Heavens1',
  'Command':'"Devil Evil1","Devil Law1",Inquisitor1,Toil1',
  'Command Plants':'Growth4',
  'Command Undead':'Inevitable3',
  'Commune':'Inquisitor5',
  'Comprehend Languages':'Inquisitor1,Language1,Memory1,Thought1',
  'Cone Of Cold':'Ice6,Oceans6',
  'Confusion':'Deception4,Lust4,Thievery4',
  'Consecrate':'Inquisitor2',
  'Contact Other Plane':'Lore5',
  'Contagion':'Decay3',
  'Continual Flame':'Day2,Inquisitor3',
  'Control Plants':'Decay8,Growth8',
  'Control Undead':'Bones8',
  'Control Water':'Ice4,Oceans4',
  'Control Weather':'Battle7,Catastrophe7,Seasons7,Storms7,Wind7',
  'Control Winds':'Cloud5,Seasons6,Wind5',
  'Create Food And Water':'Family3',
  'Create Greater Undead':'Murder8,Undead8',
  'Create Undead':'Murder6,Undead6',
  'Create Water':'Inquisitor0',
  'Creeping Doom':'Nature7',
  'Crushing Hand':'Ferocity9,Resolve9',
  'Cure Critical Wounds':'Inquisitor4,Resurrection4',
  'Cure Light Wounds':'Inquisitor1,Restoration1,Resurrection1',
  'Cure Moderate Wounds':'Inquisitor2,Resurrection2',
  'Cure Serious Wounds':'Inquisitor3,Restoration3,Resurrection3',
  'Curse Water':'Inquisitor1',
  'Darkness':'Inquisitor2',
  'Daylight':'Day3,Heavens3,Inquisitor3,Light3',
  'Daze':'Inquisitor0',
  'Death Knell':'Inquisitor2,Murder2',
  'Death Ward':'Inquisitor4,Murder4,Souls4',
  'Deathwatch':'Ancestors1,Souls1',
  'Deeper Darkness':'Inquisitor3,Loss3,Night3',
  'Delay Poison':'Inquisitor2',
  'Demand':'Leadership8,Lust8,Martyr8',
  'Desecrate':'Inquisitor2',
  'Destruction':'Ancestors7,Murder7,Souls7,Undead7',
  'Detect Chaos':'Inquisitor1',
  'Detect Evil':'Inquisitor1',
  'Detect Good':'Inquisitor1',
  'Detect Law':'Inquisitor1',
  'Detect Magic':'Inquisitor0',
  'Detect Poison':'Inquisitor0',
  'Detect Scrying':'Inquisitor4',
  'Detect Thoughts':'Inquisitor2,Thought2',
  'Detect Undead':'Inquisitor1,Life1',
  'Dictum':'"Archon Law7","Devil Law7",Inevitable7,Inquisitor6',
  'Dimension Door':'Trade4',
  'Dimensional Anchor':'Inquisitor3,Wards4',
  'Discern Lies':'Inquisitor4,Leadership4,Martyr4',
  'Disguise Self':'Deception1,Inquisitor1,Thievery1',
  'Disintegrate':'Ash7,Rage7',
  'Dismissal':'Inquisitor4',
  'Dispel Chaos':'"Archon Law5","Devil Law5",Inquisitor5',
  'Dispel Evil':'Agathion5,"Archon Good5","Azata Good5",Inquisitor5',
  'Dispel Good':'Daemon5,"Demon Evil5","Devil Evil5",Inquisitor5',
  'Dispel Law':'"Azata Chaos5","Demon Chaos5",Inquisitor5,Protean5',
  'Dispel Magic':'Arcane3,Divine3,Inquisitor3',
  'Displacement':'Protean3',
  'Disrupt Undead':'Inquisitor0',
  'Disrupting Weapon':'Inquisitor5',
  'Divination':'Inquisitor4,Memory4,Thought4',
  'Divine Favor':'"Archon Good1","Archon Law1",Inquisitor1,Martyr1',
  'Divine Power':'Blood4,Inquisitor4,Tactics4',
  'Dominate Monster':'Love9,Lust9',
  'Doom':'"Demon Chaos1","Demon Evil1",Inquisitor1',
  'Earthquake':'Battle8,Catastrophe8,Caves8,Rage8',
  'Elemental Body IV':'Caves7,Cloud7,Metal7,Oceans7,Smoke7,Wind7',
  'Elemental Swarm':'Caves9,Metal9,Smoke9',
  'Endure Elements':'Day1',
  'Energy Drain':'Loss9,Undead9',
  'Enervation':'Loss5,Undead4',
  'Enlarge Person':'Battle1,Ferocity1,Growth1',
  'Entangle':'Decay1',
  'Enthrall':'Inquisitor2,Leadership2,Love2,Revolution2',
  'Ethereal Jaunt':'Thievery7',
  'Expeditious Retreat':'"Azata Chaos1","Azata Good1",Exploration1,Inquisitor1',
  'Explosive Runes':'Language4',
  'Eyebite':'Curse6',
  'Fabricate':'Construct5',
  'Faerie Fire':'Light1',
  'False Life':'Bones2',
  'False Vision':'Deception5,Thievery5',
  'Fear':'Bones4,Inquisitor4',
  'Feather Fall':'Feather2',
  'Find The Path':'Exploration6,Inquisitor6,Thought6,Trade6',
  'Find Traps':'Inquisitor2',
  'Fire Seeds':'Ash6,Day6,Flame6,Light6,Smoke6',
  'Fire Shield':'Ash5,Day4,Light4,Smoke5',
  'Fire Storm':'Flame7',
  'Fireball':'Ash3,Flame3',
  'Flame Strike':'Day5,Inquisitor5,Light5',
  'Floating Disk':'Trade1',
  'Fly':'"Azata Chaos3","Azata Good3",Exploration3,Feather3,Trade3',
  'Fog Cloud':'Battle2,Ice2,Seasons2,Storms2',
  'Forbiddance':'Inquisitor6',
  'Foresight':'Memory9,Thought9',
  'Freedom':'Freedom9,Revolution9',
  'Freedom Of Movement':'Curse4,Fate4,Freedom4,Inquisitor4,Revolution4',
  'Freezing Sphere':'Ice7',
  'Gaseous Form':'Cloud3,Wind3',
  'Gate':'Heroism9,Honor9,Trade9',
  'Geas/Quest':'Ancestors6,Honor6,Inquisitor5,Love6,Lust6',
  'Gentle Repose':'Ancestors2,Souls2',
  'Ghoul Touch':'Undead2',
  'Glyph Of Warding':'Home3,Inquisitor3,Wards3',
  'Goodberry':'Seasons1',
  'Grasping Hand':'Ferocity7,Resolve7',
  'Greater Command':'Inevitable5,Inquisitor5,Leadership5,Martyr5,Tactics5',
  'Greater Dispel Magic':'Freedom6,Inquisitor6',
  'Greater Glyph Of Warding':'Inquisitor6,Language6',
  'Greater Heroism':'Heroism6',
  'Greater Invisibility':'Inquisitor4',
  'Greater Magic Weapon':'Inquisitor3',
  'Greater Planar Ally':'Tactics8',
  'Greater Restoration':'Life7',
  'Greater Shadow Evocation':'Loss8,Night8',
  'Greater Teleport':'Exploration7,Trade7',
  'Guards And Wards':'Home7,Wards6',
  'Guidance':'Inquisitor0',
  'Gust Of Wind':'Catastrophe2,Wind2',
  'Hallow':'Inquisitor5',
  'Halt Undead':'Inquisitor3',
  'Harm':'Catastrophe6,Decay6,Inquisitor6',
  'Heal':'Inquisitor6,Life6,Restoration6,Resurrection6',
  'Heat Metal':'Light2,Metal2',
  "Heroes' Feast":'Family6,Home6,Inquisitor6,Resolve6',
  'Heroism':'Heroism3,Inquisitor3,Love4',
  'Hide From Undead':'Inquisitor1',
  'Hold Animal':'Fur2',
  'Hold Monster':'Inquisitor4',
  'Hold Person':'Inquisitor2',
  'Holy Aura':'Agathion8,"Archon Good8","Azata Good8",Heroism8,Honor8',
  'Holy Smite':'Agathion4,"Archon Good4","Azata Good4",Heroism4,Honor4,Inquisitor4',
  'Holy Sword':'Heroism7,Honor7',
  'Holy Word':'Agathion7,"Archon Good7","Azata Good7",Inquisitor6',
  'Horrid Wilting':'Bones8,Ice8,Oceans8',
  'Hypnotic Pattern':'Heavens2',
  'Ice Storm':'Ice5,Oceans5,Seasons5',
  'Identify':'Divine1,Lore1',
  'Imbue With Spell Ability':'Divine4,Family4,Home4',
  'Implosion':'Catastrophe9,Rage9',
  'Incendiary Cloud':'Ash8,Flame8,Smoke8',
  'Inflict Critical Wounds':'Catastrophe4,Inquisitor4,Rage4',
  'Inflict Light Wounds':'Inquisitor1',
  'Inflict Moderate Wounds':'Inquisitor2',
  'Inflict Serious Wounds':'Inquisitor3',
  'Insanity':'Insanity7,Love7,Lust7,Nightmare7',
  'Instant Summons':'Language7,Wards7',
  'Invisibility':'Deception2,Inquisitor2,Thievery2',
  'Invisibility Purge':'Inquisitor3',
  'Iron Body':'Metal8',
  'Keen Edge':'Inquisitor3,Murder3',
  'Knock':'Inquisitor2',
  'Legend Lore':'Inquisitor6,Lore4,Memory7,Thought7',
  'Lesser Confusion':'Insanity1,Nightmare1,Protean1',
  'Lesser Geas':'Inquisitor4',
  'Lesser Planar Binding':'Wards5',
  'Lesser Restoration':'Inquisitor2,Life2',
  'Light':'Inquisitor0',
  'Limited Wish':'Construct7',
  'Locate Creature':'Exploration4',
  'Locate Object':'Exploration2,Inquisitor3,Lore3,Thievery3,Trade2',
  "Mage's Disjunction":'Arcane9',
  'Magic Aura':'Arcane1',
  'Magic Circle Against Chaos':'Inquisitor3',
  'Magic Circle Against Evil':'Inquisitor3',
  'Magic Circle Against Good':'Inquisitor3',
  'Magic Circle Against Law':'Inquisitor3',
  'Magic Fang':'Fur1',
  'Magic Mouth':'Arcane2',
  'Magic Stone':'Caves1,Metal1,Stone1',
  'Magic Vestment':'Battle3,Inquisitor3,Martyr3,Resolve3,Tactics3',
  'Magic Weapon':'Blood1,Inquisitor1,Tactics1',
  'Major Creation':'Construct6,Toil6',
  'Mark Of Justice':'Inquisitor5',
  "Mass Bull's Strength":'Battle6,Ferocity6',
  'Mass Cure Critical Wounds':'Family8,Home8,Restoration8,Resurrection8',
  'Mass Cure Light Wounds':'Inquisitor5',
  'Mass Cure Moderate Wounds':'Inquisitor6',
  'Mass Heal':'Life8,Restoration9',
  'Mass Inflict Light Wounds':'Inquisitor5',
  'Mass Inflict Moderate Wounds':'Inquisitor6',
  'Mass Inflict Serious Wounds':'Blood7',
  'Mass Invisibility':'Deception8,Thievery8',
  "Mass Owl's Wisdom":'Lore6',
  'Meld Into Stone':'Stone3',
  'Meteor Swarm':'Heavens9',
  'Mind Blank':'Defense8,Freedom8,Purity8,Revolution8,Thought8',
  'Minor Creation':'Construct4,Toil4',
  'Miracle':'Curse9,Divine9,Family9,Fate9,Home9',
  'Mirror Image':'Deception3',
  'Mislead':'Deception6,Fate6,Thievery6',
  'Modify Memory':'Loss6,Memory6',
  'Moment Of Prescience':'Curse8,Fate8,Lore8,Memory8',
  'Neutralize Poison':'Inquisitor4,Life3,Restoration4',
  'Nightmare':'Insanity5,Night6,Nightmare5',
  'Nondetection':'Inquisitor3',
  'Obscure Object':'Inquisitor3',
  'Obscuring Mist':'Cloud1,Ice1,Loss1,Oceans1,Storms1',
  "Order's Wrath":'"Archon Law4","Devil Law4",Inevitable4,Inquisitor4',
  'Overland Flight':'Exploration5,Heavens5',
  'Phantasmal Killer':'Nightmare4',
  'Phase Door':'Exploration8,Trade8',
  'Planar Ally':'Agathion6,"Archon Good6","Archon Law6","Azata Chaos6","Azata Good6"',
  'Planar Binding':'Daemon6,"Demon Chaos6","Demon Evil6","Devil Evil6","Devil Law6",Inevitable6,Protean6',
  'Plane Shift':'Freedom5',
  'Plant Growth':'Growth3',
  'Poison':'Decay4',
  'Polar Ray':'Ice9',
  'Polymorph Any Object':'Construct8',
  'Power Word Blind':'Loss7,Night7,Tactics7',
  'Power Word Kill':'Blood9,Tactics9',
  'Power Word Stun':'Blood8',
  'Prayer':'"Archon Good3","Archon Law3",Inquisitor3,Leadership3',
  'Prismatic Sphere':'Construct9,Day9,Defense9,Light9,Purity9,Toil9',
  'Prismatic Spray':'Heavens7',
  'Produce Flame':'Ash2',
  'Project Image':'Deception7',
  'Protection From Chaos':'Inevitable1,Inquisitor1,Purity1',
  'Protection From Energy':'Defense3,Inquisitor3',
  'Protection From Evil':'Inquisitor1,Purity1',
  'Protection From Good':'Inquisitor1,Purity1',
  'Protection From Law':'Inquisitor1,Purity1',
  'Protection From Spells':'Arcane8,Divine8',
  'Pyrotechnics':'Smoke2',
  'Rage':'"Demon Chaos3","Demon Evil3",Ferocity3,Insanity3,Nightmare3,Rage3',
  'Rainbow Pattern':'Heavens4',
  'Raise Dead':'Resurrection5',
  'Read Magic':'Inquisitor0',
  'Refuge':'Family7,Freedom7,Revolution7',
  'Regenerate':'Restoration7',
  'Remove Blindness/Deafness':'Purity3',
  'Remove Curse':'Freedom3,Inquisitor3,Revolution3',
  'Remove Disease':'Inquisitor3,Restoration2',
  'Remove Fear':'Inquisitor1,Revolution1',
  'Remove Paralysis':'Freedom2,Inquisitor2',
  'Repel Metal Or Stone':'Stone8',
  'Repel Wood':'Growth6',
  'Repulsion':'Inquisitor6,Leadership7,Martyr7,Purity7',
  'Resist Energy':'Flame2,Inquisitor2',
  'Resistance':'Inquisitor0',
  'Restoration':'Inquisitor4,Life4',
  'Resurrection':'Divine7,Resurrection7',
  'Righteous Might':'Battle5,Ferocity5,Growth5,Heroism5,Honor5,Inquisitor5,Resolve5',
  'Sanctuary':'Freedom1,Heroism1,Honor1,Inquisitor1',
  'Scintillating Pattern':'Insanity8,Nightmare8',
  'Searing Light':'Honor3,Inquisitor3',
  'Secret Page':'Wards2',
  'See Invisibility':'Inquisitor2',
  'Sending':'Inquisitor4',
  'Shades':'Night9',
  'Shadow Conjuration':'Loss4,Night4',
  'Shambler':'Decay9,Growth9',
  'Shapechange':'Feather9,Fur9',
  'Shield':'Defense1',
  'Shield Of Faith':'Agathion1,Heroism1,Honor1,Inquisitor1',
  'Shield Of Law':'"Archon Law8","Devil Law8",Inevitable8',
  'Shield Other':'Home2,Inquisitor2,Martyr2,Purity2',
  'Shout':'Catastrophe5,Rage5',
  'Silence':'Inquisitor2',
  'Slay Living':'Ancestors5,Bones5,Souls5,Undead5',
  'Sleep':'Night1',
  'Sleet Storm':'Storms4',
  'Solid Fog':'Cloud4',
  'Speak With Animals':'Feather1,Fur1',
  'Speak With Dead':'Ancestors3,Inquisitor3,Memory3',
  'Speak With Plants':'Nature3',
  'Spell Immunity':'Defense4,Ferocity4,Inquisitor4,Purity4,Resolve4',
  'Spell Resistance':'Arcane5,Defense5,Inquisitor5',
  'Spell Turning':'Arcane7,Curse7,Fate7',
  'Spike Stones':'Caves4,Metal4',
  'Spiritual Weapon':'Blood2,Inquisitor2',
  'Stabilize':'Inquisitor0',
  'Statue':'Stone7,Toil8',
  'Stinking Cloud':'Smoke3',
  'Stone Shape':'Construct3,Metal3,Toil3',
  'Stone Tell':'Nature6,Stone6',
  'Stoneskin':'Inquisitor4,Stone5',
  'Storm Of Vengeance':'Battle9,Cloud9,Leadership9,Martyr9,Seasons9,Storms9',
  'Suggestion':'"Devil Evil3","Devil Law3",Love3,Lust3',
  'Summon Monster IX':'Agathion9,"Archon Good9","Archon Law9","Azata Chaos9","Azata Good9",Daemon9,"Demon Chaos9","Demon Evil9","Devil Evil9","Devil Law9",Inevitable9,Protean9',
  'Summon Monster V':'Flame5,Night5',
  "Summon Nature's Ally IV":'Feather4,Fur4',
  "Summon Nature's Ally VIII":'Feather8,Fur8',
  'Sunbeam':'Day7,Light7',
  'Sunburst':'Day8,Heavens8,Light8,Seasons8',
  'Symbol Of Death':'Language8,Wards8',
  'Symbol Of Persuasion':'Revolution6',
  'Telepathic Bond':'Family5,Home5,Inquisitor5,Language5,Thought5',
  'Teleport':'Trade5',
  'Teleportation Circle':'Language9,Wards9',
  'Time Stop':'Deception9,Lore9,Thievery9',
  'Tongues':'Agathion3,Inquisitor2,Language3,Lore2',
  'Touch Of Idiocy':'Insanity2,Lust2,Nightmare2',
  'Trap The Soul':'Souls9',
  'True Resurrection':'Life9,Resurrection9',
  'True Seeing':'Inquisitor5,Memory5',
  'True Strike':'Catastrophe1,Fate1,Inquisitor1,Rage1',
  'Undeath To Death':'Inquisitor6',
  'Undetectable Alignment':'Inquisitor2',
  'Unhallow':'Inquisitor5',
  'Unholy Aura':'Daemon8,"Demon Evil8","Devil Evil8"',
  'Unholy Blight':'Daemon4,"Demon Evil4","Devil Evil4",Inquisitor4',
  'Vampiric Touch':'Blood3,Daemon3',
  'Virtue':'Inquisitor0',
  'Vision':'Lore7',
  'Wail Of The Banshee':'Ancestors9,Bones9',
  'Wall Of Fire':'Ash4,Battle4,Flame4,Smoke4',
  'Wall Of Ice':'Waves4',
  'Wall Of Iron':'Metal6',
  'Wall Of Stone':'Caves5,Metal5,Stone4',
  'Wall Of Thorns':'Blood5,Decay5',
  'Water Breathing':'Ice3,Waves3',
  'Water Walk':'Oceans3',
  'Waves Of Exhaustion':'Ancestors8,Souls8,Toil7',
  'Waves Of Fatigue':'Toil5',
  'Weird':'Insanity9,Nightmare9',
  'Whirlwind':'Cloud8,Storms8,Wind8',
  'Whispering Wind':'Inquisitor2,Wind1',
  'Wind Walk':'Wind6',
  'Wind Wall':'Cloud2,Wind2',
  'Wood Shape':'Construct2,Toil2',
  'Word Of Chaos':'"Azata Chaos7","Demon Chaos7",Inquisitor6,Protean7',
  'Zone Of Truth':'Honor2,Inquisitor2'
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
      '"features.Greater Energy Resistance ? 12:Energy Absorption",' +
      '"features.Energy Absorption ? 16:Energy Eruption",' +
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
      '"features.Disruptive Rage ? 12:Spellbreaker",' +
      '"features.Ferocious Mount ? 6:Spirit Steed",' +
      '"features.Lesser Spirit Totem ? 6:Spirit Totem",' +
      '"features.Spirit Totem ? 10:Greater Spirit Totem",' +
      '"2:Lesser Spirit Totem",' +
      '"2:Staggering Drunk",' +
      '"features.Superstition ? 2:Witch Hunter",' +
      '"1:Breaker:Archetype",' +
      '"1:Brutal Pugilist:Archetype",' +
      '"1:Drunken Brute:Archetype",' +
      '"1:Elemental Kin:Archetype",' +
      '"1:Hurler:Archetype",' +
      '"1:Invulnerable Rager:Archetype",' +
      '"1:Mounted Fury:Archetype",' +
      '"1:Savage Barbarian:Archetype",' +
      '"1:Standard Barbarian:Archetype",' +
      '"1:Superstitious:Archetype",' +
      '"1:Totem Warrior:Archetype"',
  'Cleric':
    'Selectables=' +
      QuilvynUtils.getKeys(PFAPG.PATHS).filter(x => x.match(/Subdomain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Subdomain', '') + '\' ? 1:' + x + '"').join(','),
  'Alchemist':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple/Bomb)",' +
      '1:Alchemy,1:Bomb,"1:Brew Potion",1:Mutagen,"1:Throw Anything",' +
      '2:Discovery,"2:Poison Resistance","2:Poison Use","3:Swift Alchemy",' +
      '"6:Swift Poisoning","14:Persistent Mutagen","18:Instant Alchemy",' +
      '"20:Grand Discovery" ' +
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
      '"10:Sticky Bomb:Discovery","1:Stink Bomb:Discovery",' +
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
      '"1:Weapon Proficiency (Simple/Martial)",' +
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
      '1:Domain,1:Judgment,"1:Monster Lore",1:Orisons,"1:Stern Gaze",' +
      '"2:Cunning Initiative","2:Detect Alignment",2:Track,"3:Solo Tactics",' +
      '"3:Teamwork Feat",5:Bane,"5:Discern Lies","8:Second Judgment",' +
      '11:Stalwart,"12:Greater Bane","14:Exploit Weakness",' +
      '"16:Third Judgment",17:Slayer,"20:True Judgment" ' +
    'Selectables=' +
      QuilvynUtils.getKeys(Pathfinder.PATHS).filter(x => x.match(/Domain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Domain', '') + '\' ? 1:' + x + '"').join(',') + ' ' +
    'CasterLevelDivine=levels.Inquisitor ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Inquisitor0:1=4;2=5;3=6,' +
      'Inquisitor1:1=2;2=3;3=4;7=5;11=6,' +
      'Inquisitor2:4=2;5=3;6=4;10=5;14=6,' +
      'Inquisitor3:7=2;8=3;9=4;13=5;17=6,' +
      'Inquisitor4:10=2;11=3;12=4;16=5;20=6,' +
      'Inquisitor5:13=2;14=3;15=4;19=5,' +
      'Inquisitor6:16=2;17=3;18=4;20=5 ' +
    'Skills=' +
      'Bluff,Climb,Craft,Diplomacy,Disguise,Heal,Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Dungeoneering)","Knowledge (Planes)",' +
      '"Knowledge (Religion)",Perception,Profession,Ride,"Sense Motive",' +
      'Spellcraft,Stealth,Survival,Swim',
  'Oracle':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Simple)",' +
      '1:Mystery,"1:Oracle\'s Curse",1:Orisons,1:Revelation,' +
      '"2:Mystery Spell","20:Final Revelation" ' +
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
      'C0:1=4;2=5;4=6;6=7;8=8;10=9,' +
      'C1:1=3;2=4;3=5;4=6,' +
      'C2:4=3;5=4;6=5;7=6,' +
      'C3:6=3;7=4;8=5;9=6,' +
      'C4:8=3;9=4;10=5;11=6,' +
      'C5:10=3;11=4;12=5;13=6,' +
      'C6:12=3;13=4;14=5;15=6,' +
      'C7:14=3;15=4;16=5;17=6,' +
      'C8:16=3;17=4;18=5;19=6,' +
      'C9:18=3;19=4;20=6 ' +
    'Skills=' +
      'Craft,Diplomacy,Heal,"Knowledge (History)","Knowledge (Planes)",' +
      '"Knowledge (Religion)",Profession,"Sense Motive",Spellcraft',
  'Summoner':
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '1:Cantrips,1:Eidolon,"1:Life Link (Summoner)","1:Summon Monster",' +
      '"2:Bond Senses","4:Shield Ally","6:Maker\'s Call",8:Transposition,' +
      '10:Aspect,"12:Greater Shield Ally","14:Life Bond","16:Merge Forms",' +
      '"18:Greater Aspect",19:Gate,"20:Twin Eidolon" ' +
    'Selectables=' +
      '"1:Eidolon Bite:Evolution",' +
      '"1:Eidolon Claws:Evolution",' +
      '"1:Eidolon Climb:Evolution",' +
      '"1:Eidolon Gills:Evolution",' +
      '"1:Eidolon Improved Damage:Evolution",' +
      '"1:Eidolon Improved Natural Armor",' +
      '"1:Eidolon Magic Attacks:Evolution",' +
      '"1:Eidolon Mount:Evolution",' +
      '"1:Eidolon Pincers:Evolution",' +
      '"1:Eidolon Pounce:Evolution",' +
      '"1:Eidolon Pull:Evolution",' +
      '"1:Eidolon Push:Evolution",' +
      '"1:Eidolon Reach:Evolution",' +
      '"1:Eidolon Scent:Evolution",' +
      '"1:Eidolon Skilled:Evolution",' +
      '"1:Eidolon Slam:Evolution",' +
      '"1:Eidolon Sting:Evolution",' +
      '"1:Eidolon Swim:Evolution",' +
      '"1:Eidolon Tail:Evolution",' +
      '"1:Eidolon Tail Slap:Evolution",' +
      '"1:Eidolon Tentacle:Evolution",' +
      '"1:Eidolon Wing Buffet:Evolution",' +
      '"1:Eidolon Ability Increase (2):Evolution",' +
      '"1:Eidolon Constrict (2):Evolution",' +
      '"5:Eidolon Energy Attacks (2):Evolution",' +
      '"5:Eidolon Flight (2):Evolution",' +
      '"1:Eidolon Gore (2):Evolution",' +
      '"1:Eidolon Grab (2):Evolution",' +
      '"7:Eidolon Immunity (2):Evolution",' +
      '"1:Eidolon Limbs (2):Evolution",' +
      '"7:Eidolon Poison (2):Evolution",' +
      '"4:Eidolon Rake (2):Evolution",' +
      '"6:Eidolon Rend (2):Evolution",' +
      '"1:Eidolon Trample (2):Evolution",' +
      '"7:Eidolon Tremorsense (2):Evolution",' +
      '"1:Eidolon Trip (2):Evolution",' +
      '"1:Eidolon Weapon Training (2):Evolution",' +
      '"9:Eidolon Blindsense (3):Evolution",' +
      '"9:Eidolon Burrow (3):Evolution",' +
      '"9:Eidolon Damage Reduction (3):Evolution",' +
      '"11:Eidolon Frightful Presence (3):Evolution",' +
      '"9:Eidolon Swallow Whole (3):Evolution",' +
      '"7:Eidolon Web (3):Evolution",' +
      '"11:Eidolon Blindsight (4):Evolution",' +
      '"9:Eidolon Breath Weapon (4):Evolution",' +
      '"11:Eidolon Fast Healing (4):Evolution",' +
      '"8:Eidolon Large (4):Evolution",' +
      '"9:Eidolon Spell Resistance (4):Evolution" ' +
    'CasterLevelArcane=levels.Summoner ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
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
      '1:Cantrips,1:Hex,"1:Witch\'s Familiar" ' +
    'Selectables=' +
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
      '"Use Magic Device"'
};
PFAPG.PRESTIGES = {
};
PFAPG.DEITIES = {
  // clerics with no deity still get two domains.
  'None':'Domain="' + QuilvynUtils.getKeys(PFAPG.PATHS).filter(x => x.match(/Subdomain$/)).map(x => x.replace(' Subdomain', '')).join('","') + '"',
  'Abadar':
    'Domain=Defense,Inevitable,Leadership,Martyr,Metal,Trade',
  'Asmodeus':
    'Domain=Arcane,Ash,Deception,"Devil Evil","Devil Law",Divine,Smoke',
  'Calistria':
    'Domain="Azata Chaos",Curse,Deception,Lust,Memory,Thievery',
  'Cayden Cailean':
    'Domain="Azata Chaos","Azata Good",Exploration,Ferocity,Love,Lust,Resolve',
  'Desna':
    'Domain="Azata Chaos","Azata Good",Curse,Exploration,Fate,Freedom,Revolution',
  'Erastil':
    'Domain="Archon Good","Archon Law",Family,Feather,Fur,Growth,Home',
  'Gorum':
    'Domain=Blood,Ferocity,Protean,Rage,Resolve,Tactics',
  'Gozreh':
    'Domain=Cloud,Decay,Growth,Oceans,Seasons,Wind',
  'Iomedae':
    'Domain="Archon Good","Archon Law",Day,Heroism,Honor,Light,Tactics',
  'Irori':
    'Domain=Inevitable,Language,Memory,Restoration,Resolve,Thought',
  'Lamashtu':
    'Domain=Deception,"Demon Chaos","Demon Evil",Ferocity,Insanity,Nightmare,Thievery',
  'Nethys':
    'Domain=Arcane,Catastrophe,Divine,Defense,Thought,Wards',
  'Norgorber':
    'Domain=Daemon,Deception,Memory,Murder,Thievery,Thought',
  'Pharasma':
    'Domain=Ancestors,Ice,Memory,Murder,Thievery,Thought',
  'Rovagug':
    'Domain=Blood,Catastrophe,"Demon Chaos","Demon Evil",Protean,Rage,Storms',
  'Sarenrae':
    'Domain=Agathion,Day,Heroism,Light,Restoration,Resurrection',
  'Shelyn':
    'Domain=Agathion,Cloud,Defense,Fate,Love,Purity',
  'Torag':
    'Domain="Archon Good","Archon Law",Caves,Construct,Defense,Metal,Toil',
  'Urgathoa':
    'Domain=Blood,Daemon,Divine,Ferocity,Murder,Undead',
  'Zon-Kuthon':
    'Domain=Catastrophe,"Devil Evil","Devil Law",Loss,Murder,Night,Undead'
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
  Pathfinder.identityRules(
    rules, alignments, newClasses, {}, factions, paths, races, tracks,
    traits, prestigeClasses, npcClasses
  );
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
PFAPG.magicRules = function(rules, spells, spellsLevels) {
  Pathfinder.magicRules(rules, {}, spells);
  for(var s in spellsLevels) {
    if(!Pathfinder.SPELLS[s]) {
      console.log('Unknown spell "' + s + '"');
      continue;
    }
    rules.choiceRules
      (rules, 'Spell', s, Pathfinder.SPELLS[s] + ' Level=' + spellsLevels[s]);
  }
};

/* Defines rules related to character aptitudes. */
PFAPG.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  Pathfinder.talentRules(rules, feats, features, goodies, languages, skills);
  for(let feat in feats)
    PFAPG.raceRulesExtra(rules, feat);
  rules.defineRule('traitCount', '', '=', '2');
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * directly derived from the attributes passed to classRules.
 */
PFAPG.classRulesExtra = function(rules, name) {
  let classLevel = 'levels.' + name;
  if(name == 'Barbarian') {
    rules.defineRule('armorClass',
      'combatNotes.nakedCourage.1', '+', null,
      'combatNotes.naturalToughness.1', '+', null
    );
    rules.defineRule('barbarianFeatures.Damage Reduction',
      'barbarianFeatures.Invulnerability', '=', '0',
      'barbarianFeatures.Keen Senses (Barbarian)', '=', '0',
      'barbarianFeatures.Natural Toughness', '=', '0'
    );
    rules.defineRule('barbarianFeatures.Fast Movement',
      'barbarianFeatures.Destructive', '=', '0',
      'barbarianFeatures.Fast Rider', '=', '0',
      'barbarianFeatures.Raging Drunk', '=', '0',
      'barbarianFeatures.Skilled Thrower', '=', '0'
    );
    rules.defineRule('barbarianFeatures.Improved Uncanny Dodge',
      'barbarianFeatures.Bestial Mount', '=', '0',
      'barbarianFeatures.Improved Savage Grapple', '=', '0',
      'barbarianFeatures.Invulnerability', '=', '0'
    );
    rules.defineRule('barbarianFeatures.Trap Sense',
      'barbarianFeatures.Battle Scavenger', '=', '0',
      'barbarianFeatures.Elemental Fury', '=', '0',
      'barbarianFeatures.Extreme Endurance', '=', '0',
      'barbarianFeatures.Naked Courage', '=', '0',
      'barbarianFeatures.Pit Fighter', '=', '0',
      'barbarianFeatures.Sixth Sense', '=', '0'
    );
    rules.defineRule('barbarianFeatures.Uncanny Dodge',
      'barbarianFeatures.Bestial Mount', '=', '0',
      'barbarianFeatures.Invulnerability', '=', '0',
      'barbarianFeatures.Savage Grapple', '=', '0'
    );
    rules.defineRule
      ('combatNotes.sixthSense', classLevel, '=', 'Math.floor(source / 3)');
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
    rules.defineRule('featureNotes.keenSenses(Barbarian).1',
      'features.Keen Senses (Barbarian)', '?', null,
      classLevel, '=', '"" + (source>=10 ? ", 60\' Darkvision" : "") + (source>=13 ? ", Scent" : "") + (source>=16 ? ", Blindsense" : "") + (source>=19 ? ", Blindsight" : "")'
    );
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.bestialMount', '=', '1');
    rules.defineRule('companionBarbarianLevel',
      'features.Bestial Mount', '?', null,
      classLevel, '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('companionMasterLevel', 'companionBarbarianLevel', '+=', null);
    rules.defineRule
      ('selectableFeatureCount.Barbarian (Archetype)', classLevel, '=', '1');
  } else if(name == 'Cleric') {
    rules.defineRule('combatNotes.rage(Cleric).1',
      'features.Rage (Cleric)', '?', null,
      'levels.Cleric', '=', 'source>=16 ? 2 : source>=12 ? 1 : 0'
    );
    rules.defineRule
      ('featureNotes.ragePowers', 'combatNotes.rage(Cleric).1', '+=', null);
    rules.defineRule('features.Rage Powers',
      'combatNotes.rage(Cleric).1', '=', 'source>0 ? 1 : null'
    );
    rules.defineRule('skillNotes.eyesOfTheHawk',
      'levels.Cleric', '=', 'Math.max(Math.floor(source / 2), 1)'
    );
  } else if(name == 'Alchemist') {
    rules.defineRule('combatNotes.bomb',
      classLevel, '=', null,
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.fastHealing', classLevel, '+=', '5');
    rules.defineRule('featureNotes.discovery',
      classLevel, '=', 'Math.floor(source / 2) + (source==20 ? 1 : 0)'
    );
    rules.defineRule('featureNotes.grandDiscovery', classLevel, '=', '1');
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
    rules.defineRule
      ('channelLevel', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('companionMasterLevel', classLevel, '^=', null);
    rules.defineRule
      ('featCount.Fighter', 'featureNotes.cavalierFeatBonus', '+=', null);
    rules.defineRule
      ('featCount.Order Of The Sword', 'featureNotes.mountedMastery', '=', '1');
    rules.defineRule('featCount.Teamwork',
      'featureNotes.greaterTactician', '+=', '1',
      'featureNotes.masterTactician', '+=', '1'
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
    rules.defineRule('magicNotes.calling',
      'magicNotes.calling.1', '?', null,
      classLevel, '=', 'source>=2 ? Math.floor(source / 2) : null'
    );
    rules.defineRule('magicNotes.calling.1',
      'magicNotes.calling.2', '=',
        'source==1 ? "Channel Energy" : source== 2 ? "Lay On Hands" : "Channel Energy and Lay On Hands"'
    );
    rules.defineRule('magicNotes.calling.2',
      'features.Calling', '?', null,
      'levels.Cleric', '=', '1',
      'levels.Paladin', '+=', '2'
    );
    rules.defineRule('selectableFeatureCount.Cavalier (Order)',
      'featureNotes.order', '=', null
    );
    let allFeats = rules.getChoices('feats');
    ['Mounted Combat', 'Skill Focus (Ride)', 'Spirited Charge', 'Trample',
     'Unseat'].forEach(x => allFeats[x] = allFeats[x].replace('Type=', 'Type="Order Of The Sword",'));
  } else if(name == 'Inquisitor') {
    rules.defineRule('combatNotes.bane',
      '', '=', '2',
      'combatNotes.greaterBane', '+', '2'
    );
    rules.defineRule('combatNotes.cunningInitiative',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('featCount.Teamwork', 'featureNotes.teamworkFeat', '+=', null);
    rules.defineRule('featureNotes.teamworkFeat',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('selectableFeatureCount.Inquisitor', 'levels.Inquisitor', '+=', '1');
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
      '', '=', '10',
      'features.Slow', '+', '5'
    );
    rules.defineRule('abilityNotes.lame.1',
      'features.Lame', '?', null,
      classLevel, '=', 'source>10 ? " or armor" : ""'
    );
    rules.defineRule('combatNotes.deaf',
      classLevel, '=', 'source<5 ? -4 : source<10 ? -2 : null'
    );
    rules.defineRule
      ('featCount.General', 'featureNotes.weaponMastery', '+', null);
    rules.defineRule('featureNotes.deaf',
      classLevel, '=', 'source<10 ? null : source<15 ? "scent feature" : "scent feature, 30\' tremorsense"'
    );
    rules.defineRule('featureNotes.maneuverMastery',
      classLevel, '=', 'source<7 ? null : source<11 ? "" : " and Greater Trip"'
    );
    rules.defineRule('featureNotes.resiliency(Oracle)',
      classLevel, '=', 'source<7 ? null : "Diehard"'
    );
    rules.defineRule('featureNotes.revelation',
      classLevel, '+=', 'Math.floor((source + 5) / 4)'
    );
    rules.defineRule
      ('featureNotes.tongues', classLevel, '=', 'source<5 ? 1 : 2');
    rules.defineRule('featureNotes.tongues.1',
      'features.Tongues', '?', null,
      classLevel, '=', 'source>=10 ? "/Can understand " + (source>=15 ? "and speak " : "") + "any spoken language" : ""'
    );
    rules.defineRule('featureNotes.weaponMastery',
      classLevel, '=', 'source>=12 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule('featureNotes.weaponMastery.1',
      'features.Weapon Mastery', '?', null,
      classLevel, '=', 'source>=12 ? ", Improved Critical, and Greater Weapon Focus" : source>=8 ? " and Improved Critical" : ""'
    );
    rules.defineRule('features.Diehard',
      'featureNotes.resiliency(Oracle)', '=', 'source.includes("Diehard") ? 1 : null'
    );
    rules.defineRule('features.Greater Trip',
      'featureNotes.maneuverMastery', '=', 'source.includes("Greater") ? 1 : null'
    );
    rules.defineRule
      ('features.Improved Trip', 'featureNotes.maneuverMastery', '=', '1');
    rules.defineRule('features.Scent',
      'featureNotes.deaf', '=', 'source.includes("scent") ? 1 : null'
    );
    rules.defineRule('magicNotes.haunted',
      classLevel, '=', '"<i>Mage Hand</i>, <i>Ghost Sound</i>" + (source>5 ? ", <i>Levitate</i>, <i>Minor Image</i>" : "") + (source>10 ? ", <i>Telekinesis</i>" : "") + (source>15 ? "<i>, Reverse Gravity</i>" : "")'
    );
    rules.defineRule('saveNotes.lame',
      classLevel, '=', 'source<5 ? null : source<15 ? "fatigued condition" : "fatigued and exhausted conditions"'
    );
    rules.defineRule('saveNotes.wasting.1',
      'features.Wasting', '?', null,
      classLevel, '=', 'source>=5 ? "/Immune to sickened" + (source>=15 ? " and nauseated" : "") + " condition" : ""'
    );
    rules.defineRule('selectableFeatureCount.Oracle (Curse)',
      "featureNotes.oracle'sCurse", '+=', '1'
    );
    rules.defineRule('selectableFeatureCount.Oracle (Mystery)',
      'featureNotes.mystery', '+=', '1'
    );
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
         s + ' (C' + level + ' [Oracle] ' + school.substring(0, 4) + ')';
       Pathfinder.spellRules(
         rules, fullName, school, 'C', level, description, false, []
       );
       rules.defineRule('spells.' + fullName,
         'magicNotes.haunted', '=', 'source.includes("' + s + '") ? 1 : null'
       );
    });
  } else if(name == 'Summoner') {
    rules.defineRule('companionMasterLevel', 'eidolonMasterLevel', '^=', null);
    rules.defineRule('companionNotes.eidolonBite',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonBite.1',
      'features.Eidolon Bite', '?', null,
      'animalCompanionStats.Str', '=', 'Math.floor(((source - 10) / 2) * 1.5)'
    );
    rules.defineRule('companionNotes.eidolonBreathWeapon(4)',
      'animalCompanionStats.HD', '=', '10 + Math.floor(source / 2)',
      'animalCompanionStats.Con', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionNotes.eidolonBreathWeapon(4).1',
      'features.Eidolon Breath Weapon (4)', '?', null,
      'summonerFeatures.Eidolon Breath Weapon', '=', 'source - 3'
    );
    rules.defineRule('companionNotes.eidolonClaws',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonClimb',
      'summonerFeatures.Eidolon Climb', '=', '20 * source'
    );
    rules.defineRule('companionNotes.eidolonDamageReduction(3)',
      'summonerFeatures.Eidolon Damage Reduction(3)', '=', 'source>=2 ? 10 : 5'
    );
    rules.defineRule('companionNotes.eidolonFastHealing(4)',
      'summonerFeatures.Eidolon Breath Weapon', '=', 'Math.floor((source - 2) / 2)'
    );
    rules.defineRule('companionNotes.eidolonFrightfulPresence(3)',
      'animalCompanionStats.HD', '=', '10 + Math.floor(source / 2)',
      'animalCompanionStats.Cha', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionNotes.eidolonGore(2)',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonImprovedNaturalArmor',
      'summonerFeatures.Eidolon Improved Natural Armor', '=', '2 * source'
    );
    rules.defineRule('companionNotes.eidolonLarge(4)',
      'summonerFeatures.Eidolon Large(4)', '=', 'source>=10 ? "Huge" : "Large"'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).1',
      'features.Eidolon Large (4)', '?', null,
      'companionStats.Size', '+', 'source=="H" ? 16 : 8'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).2',
      'companionStats.Size', '+', 'source=="H" ? 8 : 4'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).3',
      'companionStats.Size', '+', 'source=="H" ? 3 : 1'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).4',
      'companionStats.Size', '+', 'source=="H" ? 2 : 1'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).5',
      'companionStats.Size', '+', 'source=="H" ? -4 : -2'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).6',
      'companionStats.Size', '+', 'source=="H" ? -2 : -1'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).7',
      'companionStats.Size', '+', 'source=="H" ? -4 : -2'
    );
    rules.defineRule('companionNotes.eidolonLarge(4).7',
      'companionStats.Size', '+', 'source=="H" ? -8 : -4'
    );
    rules.defineRule
      ('companionStats.Str, companionNotes.Large(4).1', '+', null);
    rules.defineRule
      ('companionStats.Con, companionNotes.Large(4).2', '+', null);
    rules.defineRule
      ('companionStats.AC, companionNotes.Large(4).3', '+', null);
    rules.defineRule
      ('companionStats.CMB, companionNotes.Large(4).4', '+', null);
    rules.defineRule
      ('companionStats.CMD, companionNotes.Large(4).4', '+', null);
    rules.defineRule
      ('companionStats.Dex, companionNotes.Large(4).5', '+', null);
    rules.defineRule('companionAttack, companionNotes.Large(4).6', '+', null);
    rules.defineRule('companionStats.Size',
      'companionNotes.eidolonLarge(4)', '=', 'source.charAt(0)'
    );
    rules.defineRule('companionNotes.eidolonLimbs(2)',
      'summonerFeatures.Eidolon Limbs(2)', '=', '2 * source'
    );
    rules.defineRule('companionNotes.eidolonPincers',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonPoison(2)',
      'companionStats.HD', '=', '10 + Math.floor(source / 2)',
      'companionStats.Con', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionNotes.eidolonRake(2)',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonRend(2)',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonRend(2).1',
      'features.Eidolon Rend (2)', '?', null,
      'animalCompanionStats.Str', '=', 'Math.floor(((source - 10) / 2) * 1.5)'
    );
    rules.defineRule('companionNotes.eidolonSlam',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d8" : source=="L" ? "2d6" : "1d8"'
    );
    rules.defineRule('companionNotes.eidolonSting',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonSwim',
      'summonerFeatures.Eidolon Swim', '=', 'source>=2 ? "+" ((source - 1) * 20) : ""'
    );
    rules.defineRule('companionNotes.eidolonTail',
      'summonerFeatures.Eidolon Swim', '=', 'source * 2'
    );
    rules.defineRule('companionNotes.eidolonTailSlap',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonTentacle',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonTrample(2)',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonTrample(2).1',
      'features.Eidolon Trample (2)', '?', null,
      'animalCompanionStats.Str', '=', 'Math.floor(((source - 10) / 2) * 1.5)'
    );
    rules.defineRule('companionNotes.eidolonTrample(2).2',
      'animalCompanionStats.HD', '=', '10 + Math.floor(source / 2)',
      'animalCompanionStats.Str', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionNotes.eidolonWeaponTraining(2).1',
      'features.Eidolon Weapon Training (2)', '?', null,
      'summonerFeatures.Eidolon Weapon Training', '=', 'source>=2 ? " and martial" : ""'
    );
    rules.defineRule('companionNotes.eidolonWeb(3)',
      'animalCompanionStats.HD', '=', '10 + source',
      'animalCompanionStats.Con', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionNotes.eidolonWingBuffet',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('eidolonStats.AC',
      'companionNotes.eidolonImprovedNaturalArmor', '+', null
    );
    rules.defineRule('eidolonMasterLevel', classLevel, '=', null);
    rules.defineRule('eidolonStats.AC',
      'features.Eidolon', '?', null,
      'companionMasterLevel', '=', '[1, 1, 0, 0, 0, -1, -1, -1, -2, -2, -1, -3, -3, -2, -4, -4, -3, -5, -4, -4][source - 1]'
    );
    rules.defineRule('eidolonStats.BAB',
      'features.Eidolon', '?', null,
      'companionMasterLevel', '=', '[0, 0, 1, 0, 1, 1, 2, 1, 1, 2, 3, 2, 2, 2, 3, 3, 3, 3, 4, 3][source - 1]'
    );
    rules.defineRule('eidolonStats.Dex',
      'features.Eidolon', '?', null,
      'companionMasterLevel', '+', '[0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2][source - 1]'
    );
    rules.defineRule('eidolonStats.Feats',
      'features.Eidolon', '?', null,
      'companionMasterLevel', '=', '[0, -1, 0, 0, -1, 0, 0, -1, 0, -1, 0, 0, -1, 0, 0, -1, 0, -1, 0, 0][source - 1]'
    );
    rules.defineRule('eidolonStats.HD',
      'features.Eidolon', '?', null,
      'companionMasterLevel', '+', 'source % 4 == 3 ? 0 : -1'
    );
    rules.defineRule('eidolonStats.Skills',
      'features.Eidolon', '?', null,
      'companionMasterLevel', '=', '[2, 5, 9, 8, 11, 14, 18, 17, 20, 23, 27, 26, 29, 32, 36, 35, 38, 41, 45, 44][source - 1]'
    );
    rules.defineRule('eidolonStats.Str', 'eidolonStats.Dex', '=', null);
    ['AC', 'BAB', 'Dex', 'Feats', 'HD', 'Skills', 'Str'].forEach(stat => {
      rules.defineRule
        ('animalCompanionStats.' + stat, 'eidolonStats.' + stat, '+', null);
    });
    let features = [
      '1:Companion Darkvision', '1:Link', '1:Share Spells',
      '2:Companion Evasion', '5:Devotion', '7:Multiattack',
      '11:Companion Improved Evasion'
    ];
    QuilvynRules.featureListRules
      (rules, features, 'Animal Companion', 'eidolonMasterLevel', false);
    rules.defineRule('featureNotes.aspect',
      classLevel, '=', '2',
      'featureNotes.greaterAspect', '+', '4'
    );
    rules.defineRule('magicNotes.summonMonster',
      classLevel, '=', '["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][Math.floor((source - 1) / 2)]'
    );
    rules.defineRule('selectableFeatureCount.Summoner (Evolution)',
      classLevel, '=', 'source + 2 + Math.floor((source + 1) / 5)'
    );
  } else if(name == 'Witch') {
    rules.defineRule('familiarMasterLevel', classLevel, '+=', null);
    rules.defineRule
      ('features.Familiar', "featureNotes.witch'sFamiliar", '=', null);
    rules.defineRule('hexDC',
      classLevel, '=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('magicNotes.flightHex.1',
      'features.Flight Hex', '?', null,
      classLevel, '=', '(source>=3 ? ", <i>Levitate</i> 1/dy" : "") + (source>=5 ? ", <i>Fly</i> %{levels.Witch} min/dy" : "")'
    );
    rules.defineRule
      ('featureNotes.hex', classLevel, '=', 'Math.floor(source / 2) + 1');
    rules.defineRule
      ('selectableFeatureCount.Witch (Hex)', 'featureNotes.hex', '+=', null);
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
  } else if((matchInfo = name.match(/^Elemental Focus .(Acid|Cold|Electricity|Fire).$/)) != null) {
    let energy = matchInfo[1];
    rules.defineRule('magicNotes.elementalFocus(' + energy + ')',
      '', '=', '1',
      'magicNotes.greaterElementalFocus(' + energy + ')', '+', '1'
    );
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
    rules.defineRules('features.Scent', 'featureRules.keenScent', '=', '1');
  } else if(name == 'Major Spell Expertise') {
    rules.defineRule('magicNotes.majorSpellExpertise',
      'feats.Major Spell Expertise', '=', null
    );
  } else if(name == 'Minor Spell Expertise') {
    rules.defineRule('magicNotes.minorSpellExpertise',
      'feats.Minor Spell Expertise', '=', null
    );
  } else if(name == 'Preferred Spell') {
    rules.defineRule
      ('magicNotes.preferredSpell', 'feats.Preferred Spell', '=', null);
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
  if(name == 'Bones Mystery') {
    rules.defineRule
      ('channelLevel', 'featureNotes.undeadServitude.1', '=', null);
    rules.defineRule
      ('features.Command Undead', 'featureNotes.undeadServitude', '=', '1');
    rules.defineRule('featureNotes.undeadServitude.1',
      'features.Undead Servitude', '?', null,
      pathLevel, '=', null
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
    rules.defineRule('magicNotes.lureOfTheHeavens',
      pathLevel, '=', 'source>=10 ? ", fly for " + source + " min/dy" : source>=5 ? "" : null'
    );
    rules.defineRule('saveNotes.finalRevelation(HeavensMystery)',
      'charismaModifier', '=', null
    );
  } else if(name == 'Life Mystery') {
    rules.defineRule
      ('features.Channel Energy', 'featureNotes.channel', '=', '1');
    // Oracle channeling gives two fewer uses/dy than Cleric
    rules.defineRule
      ('magicNotes.channelEnergy', 'featureNotes.channel', '=', '-2');
    rules.defineRule('magicNotes.channelEnergy.1',
      'levels.Oracle', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('magicNotes.channelEnergy.2',
      'levels.Oracle', '+=', '10 + Math.floor(source / 2)'
    );
  } else if(name == 'Lore Mystery') {
    // NOTE: This calculation is correct only if taken at 1st level
    rules.defineRule('abilityNotes.mentalAcuity',
      pathLevel, '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('combatNotes.sidestepSecret',
      'charismaModifier', '=', null,
      'dexterityModifier', '+', '-source'
    );
    rules.defineRule('magicNotes.whirlwindLesson.1',
      'features.Whirlwind Lesson', '?', null,
      pathLevel, '=', 'source>=7 ? " and share with another " + (source>=15 ? source : 1) + " for %2 hr" : ""'
    );
    rules.defineRule
      ('magicNotes.whirlwindLesson.2', 'charismaModifier', '=', null);
    rules.defineRule('saveNotes.sidestepSecret',
      'charismaModifier', '=', null,
      'dexterityModifier', '+', '-source'
    );
    rules.defineRule('skillNotes.loreKeeper(Oracle)',
      'charismaModifier', '=', null,
      'intelligenceModifier', '+', '-source'
    );
  } else if(name == 'Lore Mystery') {
    rules.defineRule('companionOracleLevel',
      'oracleFeatures.Bonded Mount', '?', null,
      'levels.Oracle', '=', null
    );
    rules.defineRule
      ('companionMasterLevel', 'companionOracleLevel', '^=', null);
  } else if(name == 'Nature Mystery') {
    rules.defineRule("combatNotes.nature'sWhispers",
      'charismaModifier', '=', null,
      'dexterityModifier', '+', '-source'
    );
  } else if(name == 'Stone Mystery') {
    rules.defineRule('featureNotes.stoneStability',
      pathLevel, '=', 'source<5 ? null : source<10 ? "Improved Trip" : "Improved Trip and Greater Trip"'
    );
    rules.defineRule('features.Greater Trip',
      'featureNotes.stoneStability', '=', 'source.includes("Greater Trip") ? 1 : null'
    );
    rules.defineRule('features.Improved Trip',
      'featureNotes.stoneStability', '=', 'source.includes("Improved Trip") ? 1 : null'
    );
  } else if(name == 'Waves Mystery') {
    rules.defineRule('abilityNotes.fluidTravel',
      pathLevel, '=', 'source>=7 ? "/May breathe water and swim 60\'/rd underwater" : ""'
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
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
PFAPG.randomizeOneAttribute = function(attributes, attribute) {
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
    "Quilvyn Pathfinder Advanced Player's Guide Rule Set Version ' + PFAPG.VERSION + '\n" +
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

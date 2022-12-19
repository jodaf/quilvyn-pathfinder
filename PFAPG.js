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
  'Flyby Attack':'Type=General Require=skills.Fly',
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

  // Barbarian
  'Beast Totem':
   'Section=combat Note="+%{ragePowerLevel//4+1} AC during rage"',
  'Battle Scavenger':
    'Section=combat ' +
    'Note="No attack penalty and +%{(levels.Barbarian-3)//3} damage w/improvised and broken weapons"',
  'Bestial Mount':'Section=feature Note="Has Animal Companion features"',
  'Blindsight':
    'Section=feature Note="Can locate invisible creatures w/in line of sight"',
  'Boasting Taunt':
    'Section=combat ' +
    'Note="Successful Intimidate shakes target until attacks self"',
  'Brawler':
    'Section=combat Note="Has Improved Unarmed Strike features during rage"',
  'Chaos Totem':
    'Section=combat,skill ' +
    'Note=' +
      '"25% chance to ignore critical hit and sneak attack damage during rage",' +
      '"+4 Escape Artist during rage"',
  'Come And Get Me':
    'Section=combat ' +
    'Note="May trade +4 foe attack and damage for AOO after every foe attack during rage"',
  'Destructive':
    'Section=combat ' +
    'Note="+%{levels.Barbarian//2>?1} damage vs. objects or with sunder"',
  'Elemental Fury':
    'Section=combat ' +
    'Note="Taking %{levels.Barbarian} HP energy damage adds %{levels.Barbarian//3} to daily rage rds"',
  'Elemental Rage':
    'Section=combat Note="Attacks do HP +1d6 energy damage during rage"',
  'Energy Absorption (Rage)':
    'Section=combat ' +
    'Note="May convert energy damage to self to 1/3 temporary HP 1/rage"',
  'Energy Eruption':
    'Section=combat ' +
    'Note="May convert energy damage to self to breath attack of equal HP (DC %{10+ragePowerLevel//2+constitutionModifier} half) 1/rage"',
  'Energy Resistance':
    'Section=save ' +
    'Note="Resistance %{ragePowerLevel//2>?1} to chosen energy during rage"',
  'Extreme Endurance':
    'Section=save ' +
    'Note="Inured to choice of hot or cold climate/Resistance %{(levels.Barbarian-3)//3} to choice of fire or cold"',
  'Fast Rider':'Section=feature Note="+10\' Mount speed"',
  'Ferocious Mount':
    'Section=combat Note="May give mount rage benefits during rage"',
  'Ferocious Trample':
    'Section=combat ' +
    'Note="Mount trample inflicts 1d8+strength (L/H mount 2d6/2d8, Ref half) during rage"',
  'Fiend Totem':
    'Section=combat ' +
    'Note="Successful foe unarmed or natural weapon attack inflicts 1d6 HP on attacker during rage"',
  'Flesh Wound':
    'Section=combat ' +
    'Note="Successful DC damage Fort reduces damage to half nonlethal 1/rage"',
  'Good For What Ails You':
    'Section=combat ' +
    'Note="Alcohol gives save vs. condition or poison during rage"',
  'Greater Beast Totem':
    'Section=combat ' +
    'Note="May make full attack at the end of a charge/Increased Lesser Beast Totem effects"',
  'Greater Brawler':
    'Section=combat ' +
    'Note="Has Two-Weapon Fighting features for unarmed attacks during rage"',
  'Greater Chaos Totem':
    'Section=combat ' +
    'Note="DR %{ragePowerLevel//2}/lawful and weapons are chaotic during rage"',
  'Greater Elemental Rage':
   'Section=combat ' +
   'Note="Critical hits do +1d10 HP or better energy damage during rage"',
  'Greater Energy Resistance':
    'Section=combat Note="Chosen energy attack does half damage 1/rage"',
  'Greater Ferocious Mount':
    'Section=combat Note="May give mount rage power benefits during rage"',
  'Greater Ferocious Trample':
    'Section=combat ' +
    'Note="Mount may trample targets of same size and overrun during rage"',
  'Greater Fiend Totem':
    'Section=combat ' +
    'Note="Adjacent good creatures suffer 2d6 HP and shaken and neutral creatures shaken during range"',
  'Greater Hurling':
    'Section=combat Note="May hurl +30\' or +2 size objects during rage"',
  'Greater Spirit Totem':
    'Section=combat ' +
    'Note="Spirits inflict 1d8 HP on adjacent foes, may attack 15\' away for 1d6 HP during rage"',
  'Ground Breaker':
    'Section=combat ' +
    'Note="May knock prone adjacent creatures (DC 15 Ref neg) and create difficult terrain 1/rage"',
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
    'Section=combat Note="Attacks do +1d6 HP energy damage for 1 rd 1/rage"',
  'Lesser Fiend Totem':
    'Section=combat ' +
    'Note="Gore attack inflicts 1d%{features.Small ? 6 : 8}+%{strengthModifier} HP during rage"',
  'Lesser Hurling':
    'Section=combat ' +
    'Note="R10\' Thrown %V object inflicts 1d6+%{strengthModifier} HP or more during rage"',
  'Lesser Spirit Totem':
    'Section=combat ' +
    'Note="Spirit attack inflicts 1d4+%{charismaModifier} HP 1/rd during rage"',
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
    'Note="+%{armor==\'None\' ? 2 : 1} on CMB or CMD of %{(levels.Barbarian-3)//3} combat maneuvers"',
  'Raging Drunk':
    'Section=combat ' +
    'Note="May drink alcohol or potion w/out AOO during rage/Alcohol extends rage 1 rd"',
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
   'Note="%V grappled penalties/Always has AOO vs. grapple, success gives +2 vs. grapple"',
  'Sixth Sense':
    'Section=combat Note="+%V Initiative/+%V AC during surprise rd"',
  'Skilled Thrower':
    'Section=combat Note="+10\' range for thrown weapons and objects"',
  'Smasher':
    'Section=combat Note="Attack ignores object hardness 1/rage"',
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
    'Section=combat ' +
    'Note="Gives +%{ragePowerLevel//4+1} damage vs. spell users"',

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
    'Note="R30\' Bardic Performance gives weapon of one ally choice of +%{(levels.Bard-3)//3} attack or defending, distance, ghost touch, keen, mighty cleaving, returning, shock, shocking burst, seeking, speed, or wounding property"',
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
    'Note="2 rd Bardic Performance allows spell casting w/out visual or audible components (Perception vs. Sleight Of Hand to detect casting)"',
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
    'Note="Bardic Performance inflicts flat-footed (DC %{10+levels.Bard//2+charismaModifier} Will neg) on foes w/in hearing"',
  'Greater Stealspell':
    'Section=magic ' +
    'Note="Successful Stealspell reveals target\'s spells; may instead steal SR %{levels.Bard//2}"',
  'Harmless Performer':
    'Section=magic ' +
    'Note="Bardic Performance causes foes to lose attack on self (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Heraldic Expertise':
    'Section=skill ' +
    'Note="+%V Diplomacy/+%V Knowledge (History)/+%V Knowledge (Local)/+%V Knowledge (Nobility)/May reroll 1/dy"',
  'Incite Rage':
    'Section=magic ' +
    'Note="R30\' Bardic Performance affects target as <i>Rage</i> spell"',
  'Inspiring Blow':
    'Section=combat ' +
    'Note="Bardic Performance following critical hit gives self %{charismaModifier>?0} temporary HP and R30\' allies +1 attack for 1 rd"',
  // TODO Jack-Of-All-Trades modify level
  'Lamentable Belaborment':
    'Section=magic ' +
    'Note="Bardic Performance inflicts choice of dazed or confused on fascinated creature (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  // TODO Lore Master modify level
  'Madcap Prank':
    'Section=magic ' +
    'Note="R30\' Bardic Performance inflicts random negative effect on target (DC %{10+levels.Bard//2+charismaModifier} Ref neg)"',
  'Magic Lore':
    'Section=save,skill ' +
    'Note=' +
      '"+4 vs. magical traps and language- and symbol-based effects",' +
      '"+%{levels.Bard//2} Spellcraft (identify items and decipher scrolls)/May use Disable Device on magical traps"',
  'Magical Talent (Bard)':
    'Section=skill ' +
    'Note="+%V Knowledge (Arcana)/+%V Spellcraft/+%V Use Magic Device"',
  'Mass Bladethirst':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives +1 or better attack bonus to weapons of multiple allies"',
  'Mass Slumber Song':
    'Section=magic ' +
    'Note="R30\' May cause all fascinated targets to sleep (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Master Of Deception':
    'Section=skill ' +
    'Note="+%V Bluff/+%V Sleight Of Hand/+%V Stealth/May disarm magical traps"',
  'Metamagic Mastery (Bard)':
    'Section=magic Note="Bardic Performance applies metamagic feat to spell"',
  'Mockery':
    'Section=magic ' +
    'Note="Bardic Performance inflicts -%{(levels.Bard+5)//4>?2} on target Charisma and Charisma-based skill checks"',
  'Naturalist':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives allies +%{(levels.Bard+5)//6} AC, attack, and saves vs. abilities of identified creatures"',
  'Pedantic Lecture':
    'Section=magic ' +
    'Note="Bardic Performance inflicts choice of sleep, dazed, or confused on all fascinated creatures (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Probable Path':
    'Section=feature ' +
    'Note="May take 10 on any d20 roll %{(levels.Bard-7)//3>?1}/dy"',
  'Quick Change':
    'Section=skill ' +
    'Note="May don disguise as standard action (-5 check)/May use Bluff as diversion to hide/May take 10 on Bluff and Disguise %{(levels.Bard+1)//6}/dy"',
  'Rallying Cry':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives allies use of self Intimidate check for save vs. fear and despair"',
  'Satire':
    'Section=magic ' +
    'Note="Bardic Performance inflicts -%{(levels.Bard+7)//6} on attack, damage, and saves vs. fear and charm of foes w/in hearing"',
  'Scandal':
    'Section=magic ' +
    'Note="R30\' Bardic Performance inflicts 50% chance to attack nearest creature (DC %{10+levels.Bard//2+charismaModifier} Will neg) on foes w/in hearing"',
  'Sea Legs':
    'Section=combat,save ' +
    'Note="+4 CMD vs. grapple, overrun, and trip",' +
    '"+4 vs. air, water, and knock prone"',
  'Sea Shanty':
    'Section=skill ' +
    'Note="R30\' Allies may use self Perform to save vs. exhaustion, fatigue, nausea, and sickening"',
  'Show Yourselves':
    'Section=combat ' +
    'Note="R30\' Bardic Performance compels foes to reveal selves (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Slip Through The Crowd':
    'Section=magic Note="Disappearing Act allows affected allies to attack"',
  'Slumber Song':
    'Section=magic ' +
    'Note="May cause one fascinated target to sleep (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Sneakspell':
    'Section=magic ' +
    'Note="%{levels.Bard>=6?(levels.Bard>=14?\'+4\':\'+2\')+\' caster level vs. SR and \':\'\'}+%{(levels.Bard+6)//8} DC and Bardic Performance vs. flat-footed foe"',
  'Song Of The Fallen':
    'Section=magic ' +
    'Note="10 rd Bardic Performance summons barbarian warriors as %{levels.Bard>=19 ? \'iron\' : levels.Bard>=16 ? \'bronze\' : levels.Bard>=13 ? \'brass\' : \'silver\'} <i>horn of valhalla</i>"',
  'Spell Catching':
    'Section=magic ' +
    'Note="Bardic Performance and successful caster level check (DC 10 + spell level) negates foe targeted spell and allows immediate recast"',
  'Spell Suppression':
    'Section=magic Note="Bardic Performance acts as <i>Dispel Magic</i>"',
  'Stealspell':
    'Section=magic ' +
    'Note="Touch transfers spell to self (DC %{10+levels.Bard//2+charismaModifier} Will neg) for duration of Bardic Performance"',
  'Still Water':
    'Section=magic ' +
    'Note="R30\' Bardic Performance gives -%{levels.Bard} DC for Profession (Sailor), Swim, Acrobatics (shipboard), and Climb (shipboard)"',
  'Streetwise':
    'Section=skill ' +
    'Note="+%V Bluff/+%V Disguise/+%V Knowledge (Local)/+%V Sleight Of Hand/+%V Diplomacy (crowds or gather information)/+%V Intimidate (crowds)"',
  'True Confession':
    'Section=skill ' +
    'Note="%{levels.Bard>=20 ? 1 : levels.Bard>=15 ? 2 : 1} rd Bardic Performance and successful Sense Motive causes target to reveal lie or compulsion (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Wand Mastery':
    'Section=magic ' +
    'Note="Uses charisma bonus%{levels.Bard>=16 ? \' and caster level\' : \'\'} to calculate save DC of wands"',
  'Whistle The Wind':
   'Section=magic Note="Bardic Performance acts as <i>Gust Of Wind</i> spell"',
  'Wide Audience':
    'Section=magic ' +
    'Note="Bardic Performance affects %{60+(levels.Bard-5)//5*20}\' cone, %{60+(levels.Bard-5)//5*10} radius, or +%{(levels.Bard-5)//5} targets"',
  'World Traveler (Bard)':
    'Section=skill ' +
    'Note="+%V Knowledge (Geography)/+%V Knowledge (Local)/+%V Knowledge (Nature)/+%V Linguistics/May reroll %{(levels.Bard+5)//5}/dy"',

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
    'Note=' +
      '"Cannot Wild Shape into plant creature%{levels.Druid>=10 ? \'; May Wild Shape into vermin\':\'\'}"',
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
    'Note=' +
      '"Cannot Wild Shape into plant creature%{levels.Druid>=12 ? \'; May Wild Shape into giant\':\'\'}"',
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
    'Note="Critical confirmed, +1 damage multiplier, no disarm w/chosen natural weapon"',
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
  'Trick Shot':
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
    'Note="Conjured air shell gives +%{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \', 50% ranged miss chance\' : \'\'} for %{levels.Oracle} hr/dy"',
  'Alchemy':
    'Section=magic,skill ' +
    'Note=' +
      '"May identify potions as with <i>Detect Magic</i> at will/May infuse extracts that duplicate spell effects",' +
      '"+%V Craft (Alchemy)"',
  'Arcane Archivist (Oracle)':
    'Section=magic ' +
    'Note="May cast Sorcerer/Wizard spell from lore book using +1 spell slot 1/dy"',
  'Armor Of Bones':
    'Section=combat ' +
    'Note="Conjured armor gives +%{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/bludgeoning\' : \'\'} for %{levels.Oracle} hr/dy"',
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
  'Coat Of Many Stars':'Section=combat Note="Conjured coat gives +%{(levels.Oracle+5)//4*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/slashing\' : \'\'} for %{levels.Oracle}/dy"',
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
    'Section=combat,save ' +
    'Note=' +
      '"Automatically stabilize at negative HP/Critical hits automatically confirmed",' +
      '"+%V Fortitude/+%V Reflex/+%V Will/Immune to fear"',
  'Final Revelation (Life Mystery)':
    'Section=combat,save ' +
    'Note=' +
      '"Remain alive until -%{hitPoints*2} HP",' +
      '"Immune to bleed, death attack, exhausted, fatigued, nauseated effects, negative levels, and sickened effects/Ability scores cannot be drained below 1/Automatic save vs. massive damage"',
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
    'Note="Trance of 1d6 rd gives +%{levels.Oracle} save vs. sonic and gaze attack and 1 +20 intelligence skill test %{charismaModifier}/dy"',
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
  'Greater Shield Ally (Summoner)':
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
    'Note="Conjured armor gives +%{((levels.Oracle+5)//4)*2>?4} AC%{levels.Oracle>=13 ? \', DR 5/piercing\' : \'\'} for %{levels.Oracle} hr/dy"',
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
      '"+%{levels.Oracle - baseAttackBonus} on chosen combat maneuver",' +
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
  'Shield Ally (Summoner)':
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
  'Flyby Attack':'Section=combat Note="FILL"',
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
      '"14:Metamagic Mastery (Bard)","1:Magical Talent (Bard)",' +
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
      '"18:Call The Storm","1:World Traveler (Bard)",2:Familiar,' +
      '"2:Sea Legs"',
  'Street Performer':
    'Group=Bard ' +
    'Level=levels.Bard ' +
    'Features=' +
      '"1:Disappearing Act","3:Harmless Performer","9:Madcap Prank",' +
      '"15:Slip Through The Crowd",1:Gladhanding,1:Streetwise,' +
      '"5:Quick Change"',

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
  'Undeath Subdomain':
    Pathfinder.PATHS['Death Domain'].replace('Bleeding Touch', "Death's Kiss"),
  'Wards Subdomain':
    Pathfinder.PATHS['Rune Domain'].replace('Spell Rune', 'Warding Rune'),
  'Winds Subdomain':
    Pathfinder.PATHS['Air Domain'].replace('Lightning Arc', 'Wind Blast'),

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

  'Archer':
    'Group=Fighter ' +
    'Level=levels.Fighter ' +
    'Features=' +
      '2:Hawkeye,"3:Trick Shot","5:Expert Archer","9:Safe Shot",' +
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
    'Level=Alchemist1,C1,D1,O1,R1,W1,Summoner1 ' +
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
    'Description="R$RM\' %{(lvl+1)//4} 5\' spheres move 20\'/rd, inflict 3d6 HP electricity in same square (Ref neg; -4 in metal armor) for $L rd"',
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
    'Description="Self gains Scent features, +8 Perception (small), +4 Survival (track via scent), -4 save vs. odor, DC 20 to smell poison for $L hr"',
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
    'Level=Fate3,Oracle3 ' +
    'Description="Self gains better of two immediate d20 rolls and suffers worse of two d20 rolls for 2 rd"',
  'Borrow Skill':
    'School=Transmutation ' +
    'Level=B1 ' +
    'Description="Self gains skill ability of touched for next attempt w/in $L rd"',
  'Bow Spirit':
    'School=Conjuration ' +
    'Level=R4 ' +
    'Description="Conjured spirit makes 1 arrow or bolt attack each rd for $L rd"',
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
    'Level=C5,Divine5,Inquisitor6,O5 ' +
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
    'Level=B1,C1,O1,R1,W1,Witch1 ' +
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
    'Level=B3,C3,D2,O3,W2 ' +
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
    'Level=B2,C3,O3,W3 ' +
    'Description="FILL"',
  'Euphoric Tranquility':
    'School=Enchantment ' +
    'Level=B6,C8,D8,Love8,O8,W8 ' +
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
    'Level=B2,C2,Inquisitor2,O2,P1 ' +
    'Description="FILL"',
  'Mass Ghostbane Dirge':
    'School=Transmutation ' +
    'Level=B4,C5,Inquisitor5,O5,P3 ' +
    'Description="FILL"',
  'Glide':
    'School=Transmutation ' +
    'Level=D2,R1,W2,Summoner2,Witch2 ' +
    'Description="FILL"',
  'Grace':
    'School=Abjuration ' +
    'Level=C2,O2,P1 ' +
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
    'Level=C3,O3,R2,Witch3 ' +
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
    'Level=C2,O2,P2 ' +
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
    'Level=C5,D4,O5,R3,W5 ' +
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
    'Level=C3,O3 ' +
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
    'Level=C5,O5 ' +
    'Description="FILL"',
  'Planar Adaptation':
    'School=Transmutation ' +
    'Level=Alchemist5,C4,O4,W5,Summoner5 ' +
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
    'Level=Ancestors4,C4,O4,D5,Witch5 ' +
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
    'Level=C3,Inquisitor2,O3,P2 ' +
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
    'Level=Alchemist3,B3,Inquisitor3,Summoner3,Thought3,W3,Witch3 ' +
    'Description="FILL"',
  'Shadow Projection':
    'School=Necromancy ' +
    'Level=W4 ' +
    'Description="FILL"',
  'Share Language':
    'School=Divination ' +
    'Level=B1,C2,D2,Language2,O2,W2 ' +
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
    'Level=C5,D5,O5 ' +
    'Description="FILL"',
  'Solid Note':
    'School=Conjuration ' +
    'Level=B1 ' +
    'Description="FILL"',
  'Spark':
    'School=Evocation ' +
    'Level=B0,C0,D0,O0,W0,Witch0 ' +
    'Description="FILL"',
  'Spiked Pit':
    'School=Conjuration ' +
    'Level=Caves3,W3,Summoner3 ' +
    'Description="FILL"',
  'Spiritual Ally':
    'School=Evocation ' +
    'Level=C4,O4 ' +
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
    'Level=C8,D8,O8,W8,Witch8 ' +
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
    'Level=B4,C4,O4,W5 ' +
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
    'Level=C2,Inquisitor2,O2,P2 ' +
    'Description="FILL"',
  'Winds Of Vengeance':
    'School=Transmutation ' +
    'Level=C9,D9,O9,W9,Wind9,Winds9 ' +
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
    'Level=C3,O3,P3 ' +
    'Description="FILL"'

};
PFAPG.SPELLS_LEVELS_ADDED = {

  'Acid Splash':'Inquisitor0',
  'Aid':'Curse2,Inquisitor2,O2,Tactics2',
  'Air Walk':'O4,Winds4',
  'Alarm':'Home1,Inquisitor1',
  'Align Weapon':'Agathion2,"Archon Good2","Archon Law2","Azata Chaos2","Azata Good2",Daemon2,"Demon Chaos2","Demon Evil2","Devil Evil2","Devil Law2",Inevitable2,Inquisitor2,O2,Protean2',
  'Analyze Dweomer':'Arcana6',
  'Animal Shapes':'Feather7,Fur7,Nature8',
  'Animate Dead':'Bones3,O3,Souls3,Undeath3',
  'Animate Objects':'O6',
  'Animate Plants':'Decay7,Growth7',
  'Animate Rope':'Construct1',
  'Antilife Shell':'Fur6,O6,Souls6',
  'Antimagic Field':'Defense6,Divine6,Purity6,O8',
  'Arcane Eye':'Arcana4',
  'Arcane Lock':'Wards1',
  'Arcane Sight':'Inquisitor3',
  'Astral Projection':'O9',
  'Atonement':'Inquisitor5,O5,Purity5',
  'Augury':'Fate2,O2',
  'Awaken':'Nature5',
  'Bane':'Curse1,Inquisitor1,O1',
  'Banishment':'Inquisitor5,O6',
  'Barkskin':'Decay2,Defense2,Growth2,Nature2',
  "Bear's Endurance":'O2',
  'Beast Shape I':'Fur3',
  'Beast Shape III':'Feather5,Fur5',
  'Bestow Curse':'Curse3,O3',
  'Blade Barrier':'Blood6,Inquisitor6,O6,Tactics6',
  'Blasphemy':'Daemon7,"Demon Evil7","Devil Evil7",Inquisitor6,O7',
  'Bleed':'Inquisitor0,O0',
  'Bless':'Family1,Inquisitor1,Leadership1,O1,Resolve1',
  'Bless Water':'Divine2,Inquisitor1,O1',
  'Bless Weapon':'Heroism2',
  'Blight':'Seasons4',
  'Blindness/Deafness':'Loss2,Night2,O3',
  'Break Enchantment':'Curse5,Fate5,Inquisitor5,O5,Restoration5,Revolution5',
  'Breath Of Life':'Life5,O5',
  "Bull's Strength":'Ferocity2,O2,Rage2,Resolve2',
  'Burning Hands':'Ash1,Flame1,Smoke1',
  'Call Lightning':'Catastrophe3,Seasons3,Storms3',
  'Call Lightning Storm':'Storms5',
  'Calm Animals':'Feather1',
  'Calm Emotions':'Family2,Inquisitor2,O2',
  'Cause Fear':'Bones1,Daemon1,Inquisitor1,Murder1,O1,Undeath1',
  'Chain Lightning':'Cloud6,Heavens6',
  'Chaos Hammer':'"Azata Chaos4","Demon Chaos4",Inquisitor4,O4,Protean4',
  'Charm Animal':'Nature1',
  'Charm Monster':'Love5,Lust5',
  'Charm Person':'Love1,Lust1',
  'Circle Of Death':'Bones6,Inquisitor6',
  'Clenched Fist':'Ferocity8,Resolve8',
  'Cloak Of Chaos':'"Azata Chaos8","Demon Chaos8",O8,Protean8',
  'Color Spray':'Heavens1',
  'Command':'"Devil Evil1","Devil Law1",Inquisitor1,O1,Toil1',
  'Command Plants':'Growth4',
  'Command Undead':'Inevitable3',
  'Commune':'Inquisitor5,O5',
  'Comprehend Languages':'Inquisitor1,Language1,Memory1,O1,Thought1',
  'Cone Of Cold':'Ice6,Oceans6',
  'Confusion':'Deception4,Lust4,Thievery4',
  'Consecrate':'Inquisitor2,O2',
  'Contact Other Plane':'Lore5',
  'Contagion':'Decay3,O3',
  'Continual Flame':'Day2,Inquisitor3,O3',
  'Control Plants':'Decay8,Growth8',
  'Control Undead':'Bones8',
  'Control Water':'Ice4,O4,Oceans4',
  'Control Weather':'Battle7,Catastrophe7,O7,Seasons7,Storms7,Wind7',
  'Control Winds':'Cloud5,Seasons6,Wind5,Winds5',
  'Create Food And Water':'Family3,O3',
  'Create Greater Undead':'Murder8,O8,Undeath8',
  'Create Undead':'Murder6,O6,Undeath6',
  'Create Water':'Inquisitor0,O0',
  'Creeping Doom':'Nature7',
  'Crushing Hand':'Ferocity9,Resolve9',
  'Cure Critical Wounds':'Inquisitor4,O4,Resurrection4',
  'Cure Light Wounds':'Inquisitor1,O1,Restoration1,Resurrection1',
  'Cure Moderate Wounds':'Inquisitor2,O2,Resurrection2',
  'Cure Serious Wounds':'Inquisitor3,O3,Restoration3,Resurrection3',
  'Curse Water':'Inquisitor1,O1',
  'Darkness':'Inquisitor2,O2',
  'Daylight':'Day3,Heavens3,Inquisitor3,Light3,O3',
  'Daze':'Inquisitor0',
  'Death Knell':'Inquisitor2,Murder2,O2',
  'Death Ward':'Inquisitor4,Murder4,O4,Souls4',
  'Deathwatch':'Ancestors1,O1,Souls1',
  'Deeper Darkness':'Inquisitor3,Loss3,Night3,O3',
  'Delay Poison':'Inquisitor2,O2',
  'Demand':'Leadership8,Lust8,Martyr8',
  'Desecrate':'Inquisitor2,O2',
  'Destruction':'Ancestors7,Murder7,O7,Souls7,Undeath7',
  'Detect Chaos':'Inquisitor1,O1',
  'Detect Evil':'Inquisitor1,O1',
  'Detect Good':'Inquisitor1,O1',
  'Detect Law':'Inquisitor1,O1',
  'Detect Magic':'Inquisitor0,O0',
  'Detect Poison':'Inquisitor0,O0',
  'Detect Scrying':'Inquisitor4',
  'Detect Thoughts':'Inquisitor2,Thought2',
  'Detect Undead':'Inquisitor1,Life1,O1',
  'Dictum':'"Archon Law7","Devil Law7",Inevitable7,Inquisitor6,O7',
  'Dimension Door':'Trade4',
  'Dimensional Anchor':'Inquisitor3,O4,Wards4',
  'Dimensional Lock':'O8',
  'Discern Lies':'Inquisitor4,Leadership4,Martyr4,O4',
  'Discern Location':'O8',
  'Disguise Self':'Deception1,Inquisitor1,Thievery1',
  'Disintegrate':'Ash7,Rage7',
  'Dismissal':'Inquisitor4,O4',
  'Dispel Chaos':'"Archon Law5","Devil Law5",Inquisitor5,O5',
  'Dispel Evil':'Agathion5,"Archon Good5","Azata Good5",Inquisitor5,O5',
  'Dispel Good':'Daemon5,"Demon Evil5","Devil Evil5",Inquisitor5,O5',
  'Dispel Law':'"Azata Chaos5","Demon Chaos5",Inquisitor5,Protean5,O5',
  'Dispel Magic':'Arcana3,Divine3,Inquisitor3,O3',
  'Displacement':'Protean3',
  'Disrupt Undead':'Inquisitor0',
  'Disrupting Weapon':'Inquisitor5,O5',
  'Divination':'Inquisitor4,Memory4,O4,Thought4',
  'Divine Favor':'"Archon Good1","Archon Law1",Inquisitor1,Martyr1,O1',
  'Divine Power':'Blood4,Inquisitor4,O4,Tactics4',
  'Dominate Monster':'Love9,Lust9',
  'Doom':'"Demon Chaos1","Demon Evil1",Inquisitor1,O1',
  "Eagle's Splendor":'O2',
  'Earthquake':'Battle8,Catastrophe8,Caves8,O8,Rage8',
  'Elemental Body IV':'Caves7,Cloud7,Metal7,Oceans7,Smoke7,Winds7',
  'Elemental Swarm':'Caves9,Metal9,Smoke9',
  'Endure Elements':'Day1,O1',
  'Energy Drain':'Loss9,O9,Undeath9',
  'Enervation':'Loss5,Undeath4',
  'Enlarge Person':'Battle1,Ferocity1,Growth1',
  'Entangle':'Decay1',
  'Enthrall':'Inquisitor2,Leadership2,Love2,O2,Revolution2',
  'Entropic Shield':'O1',
  'Ethereal Jaunt':'O7,Thievery7',
  'Etherealness':'O9',
  'Expeditious Retreat':'"Azata Chaos1","Azata Good1",Exploration1,Inquisitor1',
  'Explosive Runes':'Language4',
  'Eyebite':'Curse6',
  'Fabricate':'Construct5',
  'Faerie Fire':'Light1',
  'False Life':'Bones2',
  'False Vision':'Deception5,Thievery5',
  'Fear':'Bones4,Inquisitor4',
  'Feather Fall':'Feather2',
  'Find The Path':'Exploration6,Inquisitor6,O6,Thought6,Trade6',
  'Find Traps':'Inquisitor2,O2',
  'Fire Seeds':'Ash6,Day6,Flame6,Light6,Smoke6',
  'Fire Shield':'Ash5,Day4,Light4,Smoke5',
  'Fire Storm':'Flame7,O8',
  'Fireball':'Ash3,Flame3',
  'Flame Strike':'Day5,Inquisitor5,Light5,O5',
  'Floating Disk':'Trade1',
  'Fly':'"Azata Chaos3","Azata Good3",Exploration3,Feather3,Trade3',
  'Fog Cloud':'Battle2,Ice2,Seasons2,Storms2',
  'Forbiddance':'Inquisitor6,O6',
  'Foresight':'Memory9,Thought9',
  'Freedom':'Freedom9,Revolution9',
  'Freedom Of Movement':'Curse4,Fate4,Freedom4,Inquisitor4,O4,Revolution4',
  'Freezing Sphere':'Ice7',
  'Gaseous Form':'Cloud3,Winds3',
  'Gate':'Heroism9,Honor9,O9,Trade9',
  'Geas/Quest':'Ancestors6,Honor6,Inquisitor5,Love6,Lust6,O6',
  'Gentle Repose':'Ancestors2,O2,Souls2',
  'Ghoul Touch':'Undeath2',
  'Giant Vermin':'O4',
  'Glyph Of Warding':'Home3,Inquisitor3,O3,Wards3',
  'Goodberry':'Seasons1',
  'Grasping Hand':'Ferocity7,Resolve7',
  'Greater Command':'Inevitable5,Inquisitor5,Leadership5,Martyr5,O5,Tactics5',
  'Greater Dispel Magic':'Freedom6,Inquisitor6,O6',
  'Greater Glyph Of Warding':'Inquisitor6,Language6,O6',
  'Greater Heroism':'Heroism6',
  'Greater Invisibility':'Inquisitor4',
  'Greater Magic Weapon':'Inquisitor3,O4',
  'Greater Planar Ally':'O8,Tactics8',
  'Greater Restoration':'Life7,O7',
  'Greater Scrying':'O7',
  'Greater Shadow Evocation':'Loss8,Night8',
  'Greater Spell Immunity':'O8',
  'Greater Teleport':'Exploration7,Trade7',
  'Guards And Wards':'Home7,Wards6',
  'Guidance':'Inquisitor0,O0',
  'Gust Of Wind':'Catastrophe2,Wind2',
  'Hallow':'Inquisitor5,O5',
  'Halt Undead':'Inquisitor3',
  'Harm':'Catastrophe6,Decay6,Inquisitor6,O6',
  'Heal':'Inquisitor6,Life6,O6,Restoration6,Resurrection6',
  'Heat Metal':'Light2,Metal2',
  'Helping Hand':'O3',
  "Heroes' Feast":'Family6,Home6,Inquisitor6,O6,Resolve6',
  'Heroism':'Heroism3,Inquisitor3,Love4',
  'Hide From Undead':'Inquisitor1,O1',
  'Hold Animal':'Fur2',
  'Hold Monster':'Inquisitor4',
  'Hold Person':'Inquisitor2,O2',
  'Holy Aura':'Agathion8,"Archon Good8","Azata Good8",Heroism8,Honor8,O8',
  'Holy Smite':'Agathion4,"Archon Good4","Azata Good4",Heroism4,Honor4,Inquisitor4,O4',
  'Holy Sword':'Heroism7,Honor7',
  'Holy Word':'Agathion7,"Archon Good7","Azata Good7",Inquisitor6,O7',
  'Horrid Wilting':'Bones8,Ice8,Oceans8',
  'Hypnotic Pattern':'Heavens2',
  'Ice Storm':'Ice5,Oceans5,Seasons5',
  'Identify':'Divine1,Lore1',
  'Imbue With Spell Ability':'Divine4,Family4,Home4,O4',
  'Implosion':'Catastrophe9,O9,Rage9',
  'Incendiary Cloud':'Ash8,Flame8,Smoke8',
  'Inflict Critical Wounds':'Catastrophe4,Inquisitor4,O4,Rage4',
  'Inflict Light Wounds':'Inquisitor1,O1',
  'Inflict Moderate Wounds':'Inquisitor2,O2',
  'Inflict Serious Wounds':'Inquisitor3,O3',
  'Insanity':'Insanity7,Love7,Lust7,Nightmare7',
  'Insect Plague':'O5',
  'Instant Summons':'Language7,Wards7',
  'Invisibility':'Inquisitor2,Thievery2',
  'Invisibility Purge':'Inquisitor3,O3',
  'Iron Body':'Metal8',
  'Keen Edge':'Inquisitor3,Murder3',
  'Knock':'Inquisitor2',
  'Legend Lore':'Inquisitor6,Lore4,Memory7,Thought7',
  'Lesser Confusion':'Insanity1,Nightmare1,Protean1',
  'Lesser Geas':'Inquisitor4',
  'Lesser Planar Ally':'O4',
  'Lesser Planar Binding':'Wards5',
  'Lesser Restoration':'Inquisitor2,Life2,O2',
  'Light':'Inquisitor0,O0',
  'Limited Wish':'Construct7',
  'Locate Creature':'Exploration4',
  'Locate Object':'Exploration2,Inquisitor3,Lore3,O3,Thievery3,Trade2',
  "Mage's Disjunction":'Arcana9',
  'Magic Aura':'Arcana1',
  'Magic Circle Against Chaos':'Inquisitor3,O3',
  'Magic Circle Against Evil':'Inquisitor3,O3',
  'Magic Circle Against Good':'Inquisitor3,O3',
  'Magic Circle Against Law':'Inquisitor3,O3',
  'Magic Fang':'Fur1',
  'Magic Mouth':'Arcana2',
  'Magic Stone':'Caves1,Metal1,O1,Stone1',
  'Magic Vestment':'Battle3,Inquisitor3,Martyr3,O3,Resolve3,Tactics3',
  'Magic Weapon':'Blood1,Inquisitor1,O1,Tactics1',
  'Major Creation':'Construct6,Toil6',
  'Make Whole':'O2',
  'Mark Of Justice':'Inquisitor5,O5',
  "Mass Bear's Endurance":'O6',
  "Mass Bull's Strength":'Battle6,Ferocity6,O6',
  'Mass Cure Critical Wounds':'Family8,Home8,O8,Restoration8,Resurrection8',
  'Mass Cure Light Wounds':'Inquisitor5,O5',
  'Mass Cure Moderate Wounds':'Inquisitor6,O6',
  'Mass Cure Serious Wounds':'O7',
  "Mass Eagle's Splendor":'O6',
  'Mass Heal':'Life8,O9,Restoration9',
  'Mass Inflict Critical Wounds':'O8',
  'Mass Inflict Light Wounds':'Inquisitor5,O5',
  'Mass Inflict Moderate Wounds':'Inquisitor6,O6',
  'Mass Inflict Serious Wounds':'Blood7,O7',
  'Mass Invisibility':'Deception8,Thievery8',
  "Mass Owl's Wisdom":'Lore6,O6',
  'Meld Into Stone':'O3,Stone3',
  'Mending':'O0',
  'Meteor Swarm':'Heavens9',
  'Mind Blank':'Defense8,Freedom8,Purity8,Revolution8,Thought8',
  'Minor Creation':'Construct4,Toil4',
  'Miracle':'Curse9,Divine9,Family9,Fate9,Home9,O9',
  'Mirror Image':'Deception2',
  'Mislead':'Deception6,Fate6,Thievery6',
  'Modify Memory':'Loss6,Memory6',
  'Moment Of Prescience':'Curse8,Fate8,Lore8,Memory8',
  'Neutralize Poison':'Inquisitor4,Life3,O4,Restoration4',
  'Nightmare':'Insanity5,Night6,Nightmare5',
  'Nondetection':'Deception3,Inquisitor3',
  'Obscure Object':'Inquisitor3,O3',
  'Obscuring Mist':'Cloud1,Ice1,Loss1,O1,Oceans1,Storms1',
  "Order's Wrath":'"Archon Law4","Devil Law4",Inevitable4,Inquisitor4,O4',
  'Overland Flight':'Heavens5,Trade5',
  "Owl's Wisdom":'O2',
  'Phantasmal Killer':'Nightmare4',
  'Phase Door':'Exploration8,Trade8',
  'Planar Ally':'Agathion6,"Archon Good6","Archon Law6","Azata Chaos6","Azata Good6",O6',
  'Planar Binding':'Daemon6,"Demon Chaos6","Demon Evil6","Devil Evil6","Devil Law6",Inevitable6,Protean6',
  'Plane Shift':'Freedom5,O5',
  'Plant Growth':'Growth3',
  'Poison':'Decay4,O4',
  'Polar Ray':'Ice9',
  'Polymorph Any Object':'Construct8',
  'Power Word Blind':'Loss7,Night7,Tactics7',
  'Power Word Kill':'Blood9,Tactics9',
  'Power Word Stun':'Blood8',
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
  'Purify Food And Drink':'O0',
  'Pyrotechnics':'Smoke2',
  'Rage':'"Demon Chaos3","Demon Evil3",Ferocity3,Insanity3,Nightmare3,Rage3',
  'Rainbow Pattern':'Heavens4',
  'Raise Dead':'Resurrection5,O5',
  'Read Magic':'Inquisitor0,O0',
  'Refuge':'Family7,Freedom7,O7,Revolution7',
  'Regenerate':'O7,Restoration7',
  'Remove Blindness/Deafness':'O3,Purity3',
  'Remove Curse':'Freedom3,Inquisitor3,O3,Revolution3',
  'Remove Disease':'Inquisitor3,O3,Restoration2',
  'Remove Fear':'Inquisitor1,O1,Revolution1',
  'Remove Paralysis':'Freedom2,Inquisitor2,O2',
  'Repel Metal Or Stone':'Stone8',
  'Repel Vermin':'O4',
  'Repel Wood':'Growth6',
  'Repulsion':'Inquisitor6,Leadership7,Martyr7,O7,Purity7',
  'Resist Energy':'Flame2,Inquisitor2,O2',
  'Resistance':'Inquisitor0,O0',
  'Restoration':'Inquisitor4,Life4,O4',
  'Resurrection':'Divine7,O7,Resurrection7',
  'Righteous Might':'Battle5,Ferocity5,Growth5,Heroism5,Honor5,Inquisitor5,O5,Resolve5',
  'Sanctuary':'Freedom1,Inquisitor1,O1',
  'Scintillating Pattern':'Insanity8,Nightmare8',
  'Scrying':'O5',
  'Searing Light':'Honor3,Inquisitor3,O3',
  'Secret Page':'Wards2',
  'See Invisibility':'Inquisitor2',
  'Sending':'Inquisitor4,O4',
  'Shades':'Night9',
  'Shadow Conjuration':'Loss4,Night4',
  'Shambler':'Decay9,Growth9',
  'Shapechange':'Feather9,Fur9',
  'Shatter':'O2',
  'Shield':'Defense1',
  'Shield Of Faith':'Agathion1,Heroism1,Honor1,Inquisitor1,O1',
  'Shield Of Law':'"Archon Law8","Devil Law8",Inevitable8,O8',
  'Shield Other':'Home2,Inquisitor2,Martyr2,O2,Purity2',
  'Shout':'Catastrophe5,Rage5',
  'Silence':'Inquisitor2,O2',
  'Slay Living':'Ancestors5,Bones5,O5,Souls5,Undeath5',
  'Sleep':'Night1',
  'Sleet Storm':'Storms4',
  'Solid Fog':'Cloud4',
  'Soul Bind':'O9',
  'Sound Burst':'O2',
  'Speak With Dead':'Ancestors3,Inquisitor3,Memory3,O3',
  'Speak With Plants':'Nature3',
  'Spell Immunity':'Defense4,Ferocity4,Inquisitor4,O4,Purity4,Resolve4',
  'Spell Resistance':'Arcana5,Defense5,Inquisitor5,O5',
  'Spell Turning':'Arcana7,Curse7,Fate7',
  'Spike Stones':'Caves4,Metal4',
  'Spiritual Weapon':'Blood2,Inquisitor2,O2',
  'Stabilize':'Inquisitor0,O0',
  'Statue':'Stone7,Toil8',
  'Status':'O2',
  'Stinking Cloud':'Smoke3',
  'Stone Shape':'Construct3,Metal3,O3,Toil3',
  'Stone Tell':'Nature6,Stone6',
  'Stoneskin':'Inquisitor4,Stone5',
  'Storm Of Vengeance':'Battle9,Cloud9,Leadership9,Martyr9,O9,Seasons9,Storms9',
  'Suggestion':'"Devil Evil3","Devil Law3",Love3,Lust3',
  'Summon Monster I':'O1',
  'Summon Monster II':'O2',
  'Summon Monster III':'O3',
  'Summon Monster IV':'O4',
  'Summon Monster IX':'Agathion9,"Archon Good9","Archon Law9","Azata Chaos9","Azata Good9",Daemon9,"Demon Chaos9","Demon Evil9","Devil Evil9","Devil Law9",Inevitable9,O9,Protean9',
  'Summon Monster V':'Flame5,Night5,O5',
  'Summon Monster VI':'O6',
  'Summon Monster VII':'O7',
  'Summon Monster VIII':'O8',
  "Summon Nature's Ally IV":'Feather4,Fur4',
  "Summon Nature's Ally VIII":'Feather8,Fur8',
  'Sunbeam':'Day7,Light7',
  'Sunburst':'Day8,Heavens8,Light8,Seasons8',
  'Symbol Of Death':'Language8,O8,Wards8',
  'Symbol Of Fear':'O6',
  'Symbol Of Insanity':'O8',
  'Symbol Of Pain':'O5',
  'Symbol Of Persuasion':'O6,Revolution6',
  'Symbol Of Sleep':'O5',
  'Symbol Of Stunning':'O7',
  'Symbol Of Weakness':'O7',
  'Telepathic Bond':'Family5,Home5,Inquisitor5,Language5,Thought5',
  'Teleport':'Exploration5',
  'Teleportation Circle':'Language9,Wards9',
  'Time Stop':'Deception9,Lore9,Thievery9',
  'Tongues':'Agathion3,Inquisitor2,Language3,Lore2,O4',
  'Touch Of Idiocy':'Insanity2,Lust2,Nightmare2',
  'Trap The Soul':'Souls9',
  'True Resurrection':'Life9,O9,Resurrection9',
  'True Seeing':'Inquisitor5,Memory5,O5',
  'True Strike':'Catastrophe1,Fate1,Inquisitor1,Rage1',
  'Undeath To Death':'Inquisitor6,O6',
  'Undetectable Alignment':'Inquisitor2,O2',
  'Unhallow':'Inquisitor5,O5',
  'Unholy Aura':'Daemon8,"Demon Evil8","Devil Evil8",O8',
  'Unholy Blight':'Daemon4,"Demon Evil4","Devil Evil4",Inquisitor4,O4',
  'Vampiric Touch':'Blood3,Daemon3',
  'Virtue':'Inquisitor0,O0',
  'Vision':'Lore7',
  'Wail Of The Banshee':'Ancestors9,Bones9',
  'Wall Of Fire':'Ash4,Battle4,Flame4,Smoke4',
  'Wall Of Ice':'Waves4',
  'Wall Of Iron':'Metal6',
  'Wall Of Stone':'Caves5,Metal5,O5,Stone4',
  'Wall Of Thorns':'Blood5,Decay5',
  'Water Breathing':'Ice3,O3,Waves3',
  'Water Walk':'O3,Oceans3',
  'Waves Of Exhaustion':'Ancestors8,Souls8,Toil7',
  'Waves Of Fatigue':'Toil5',
  'Weird':'Insanity9,Nightmare9',
  'Whirlwind':'Cloud8,Storms8,Wind8,Winds8',
  'Whispering Wind':'Inquisitor2,Winds1',
  'Wind Walk':'O6,Winds6',
  'Wind Wall':'Cloud2,O3,Winds2',
  'Wood Shape':'Construct2,Toil2',
  'Word Of Chaos':'"Azata Chaos7","Demon Chaos7",Inquisitor6,O7,Protean7',
  'Word Of Recall':'O6',
  'Zone Of Truth':'Honor2,Inquisitor2,O2'
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
      '"features.Blight Druid == 0 ? 1:Animal Companion:Nature Bond",' +
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
      '1:Cantrips,1:Eidolon,"1:Life Link (Summoner)","1:Summon Monster",' +
      '"2:Bond Senses","4:Shield Ally (Summoner)","6:Maker\'s Call",' +
      '8:Transposition,10:Aspect,"12:Greater Shield Ally (Summoner)",' +
      '"14:Life Bond","16:Merge Forms","18:Greater Aspect",19:Gate,' +
      '"20:Twin Eidolon" ' +
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
    'Domain=Arcana,Catastrophe,Divine,Defense,Thought,Wards',
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
  for(let s in spellsLevels) {
    if(!Pathfinder.SPELLS[s]) {
      console.log('Unknown spell "' + s + '"');
      continue;
    }
    let attrs = Pathfinder.SPELLS[s] + ' Level=' + spellsLevels[s];
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
    rules.defineRule('barbarianHasDamageReduction',
      'levels.Barbarian', '=', '1',
      'barbarianFeatures.Invulnerability', '=', '0',
      'barbarianFeatures.Keen Senses (Barbarian)', '=', '0',
      'barbarianFeatures.Natural Toughness', '=', '0'
    );
    rules.defineRule('barbarianHasFastMovement',
      'levels.Barbarian', '=', '1',
      'barbarianFeatures.Destructive', '=', '0',
      'barbarianFeatures.Fast Rider', '=', '0',
      'barbarianFeatures.Raging Drunk', '=', '0',
      'barbarianFeatures.Skilled Thrower', '=', '0'
    );
    rules.defineRule('barbarianHasImprovedUncannyDodge',
      'levels.Barbarian', '=', '1',
      'barbarianFeatures.Bestial Mount', '=', '0',
      'barbarianFeatures.Improved Savage Grapple', '=', '0',
      'barbarianFeatures.Invulnerability', '=', '0'
    );
    rules.defineRule('barbarianHasTrapSense',
      'levels.Barbarian', '=', '1',
      'barbarianFeatures.Battle Scavenger', '=', '0',
      'barbarianFeatures.Elemental Fury', '=', '0',
      'barbarianFeatures.Extreme Endurance', '=', '0',
      'barbarianFeatures.Naked Courage', '=', '0',
      'barbarianFeatures.Pit Fighter', '=', '0',
      'barbarianFeatures.Sixth Sense', '=', '0'
    );
    rules.defineRule('barbarianHasUncannyDodge',
      'levels.Barbarian', '=', '1',
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
      'combatNotes.lesserHurling.1', '=', '["Tiny", "Small", "Medium", "Large", "Huge"][source]'
    );
    rules.defineRule('combatNotes.lesserHurling.1',
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
      'levels.Bard', '=', '1',
      'bardFeatures.Arcane Strike', '=', '0',
      'bardFeatures.Eye For Detail', '=', '0',
      'bardFeatures.Heraldic Expertise', '=', '0',
      'bardFeatures.Magical Talent (Bard)', '=', '0',
      'bardFeatures.Master Of Deception', '=', '0',
      'bardFeatures.Streetwise', '=', '0',
      'bardFeatures.World Traveler (Bard)', '=', '0'
    );
    rules.defineRule('bardHasCountersong',
      'levels.Bard', '=', '1',
      'bardFeatures.Gladhanding', '=', '0',
      'bardFeatures.Improved Counterspell', '=', '0',
      'bardFeatures.Rallying Cry', '=', '0',
      'bardFeatures.Sea Shanty', '=', '0'
    );
    rules.defineRule('bardHasDeadlyPerformance',
      'levels.Bard', '=', '1',
      'bardFeatures.Spell Catching', '=', '0'
    );
    rules.defineRule('bardHasDirgeOfDoom',
      'levels.Bard', '=', '1',
      'bardFeatures.Glorious Epic', '=', '0',
      'bardFeatures.Spell Suppression', '=', '0'
    );
    rules.defineRule('bardHasFascinate',
      'levels.Bard', '=', '1',
      'bardFeatures.Inspiring Blow', '=', '0'
    );
    rules.defineRule('bardHasFrighteningTune',
      'levels.Bard', '=', '1',
      'bardFeatures.Metamagic Mastery (Bard)', '=', '0',
      'bardFeatures.Scandal', '=', '0'
    );
    rules.defineRule('bardHasInspireCompetence',
      'levels.Bard', '=', '1',
      'bardFeatures.Harmless Performer', '=', '0',
      'bardFeatures.Mockery', '=', '0',
      'bardFeatures.Sea Shanty', '=', '0',
      'bardFeatures.Trap Sense', '=', '0'
    );
    rules.defineRule('bardHasInspireCourage',
      'levels.Bard', '=', '1',
      'bardFeatures.Careful Teamwork', '=', '0',
      'bardFeatures.Disappearing Act', '=', '0',
      'bardFeatures.Dweomercraft', '=', '0',
      'bardFeatures.Naturalist', '=', '0',
      'bardFeatures.Satire', '=', '0',
      'bardFeatures.Stealspell', '=', '0'
    );
    rules.defineRule('bardHasInspireGreatness',
      'levels.Bard', '=', '1',
      'bardFeatures.Dramatic Subtext', '=', '0',
      'bardFeatures.Madcap Prank', '=', '0',
      'bardFeatures.True Confession', '=', '0'
    );
    rules.defineRule('bardHasInspireHeroics',
      'levels.Bard', '=', '1',
      'bardFeatures.Greater Stealspell', '=', '0',
      'bardFeatures.Show Yourselves', '=', '0',
      'bardFeatures.Slip Through The Crowd', '=', '0'
    );
    rules.defineRule('bardHasJackOfAllTrades',
      'levels.Bard', '=', '1',
      'bardFeatures.Arcane Armor', '=', '0',
      'bardFeatures.Song Of The Fallen', '=', '0',
      'bardFeatures.Wand Mastery', '=', '0',
      'bardFeatures.Wide Audience', '=', '0'
    );
    rules.defineRule('bardHasLoreMaster',
      'levels.Bard', '=', '1',
      'bardFeatures.Arcane Bond', '=', '0',
      'bardFeatures.Quick Change', '=', '0',
      'bardFeatures.Sneak Attack', '=', '0',
      'bardFeatures.Wide Audience', '=', '0'
    );
    rules.defineRule('bardHasMassSuggestion',
      'levels.Bard', '=', '1',
      'bardFeatures.Battle Song', '=', '0',
      'bardFeatures.Call The Storm', '=', '0',
      'bardFeatures.Mass Bladethirst', '=', '0',
      'bardFeatures.Mass Slumber Song', '=', '0',
      'bardFeatures.Pedantic Lecture', '=', '0'
    );
    rules.defineRule('bardHasSoothingPerformance',
      'levels.Bard', '=', '1',
      'bardFeatures.Berserkergang', '=', '0'
    );
    rules.defineRule('bardHasSuggestion',
      'levels.Bard', '=', '1',
      'bardFeatures.Bladethirst', '=', '0',
      'bardFeatures.Incite Rage', '=', '0',
      'bardFeatures.Lamentable Belaborment', '=', '0',
      'bardFeatures.Slumber Song', '=', '0',
      'bardFeatures.Whistle The Wind', '=', '0'
    );
    rules.defineRule('bardHasVersatilePerformance',
      'levels.Bard', '=', '1',
      'bardFeatures.Arcane Investigation', '=', '0',
      'bardFeatures.Archivist', '=', '0',
      'bardFeatures.Combat Casting', '=', '0',
      'bardFeatures.Expanded Repertoire', '=', '0',
      'bardFeatures.Familiar', '=', '0',
      'bardFeatures.Sneakspell', '=', '0'
    );
    rules.defineRule('bardHasWellVersed',
      'levels.Bard', '=', '1',
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
      'magicNotes.simpleSomatics.1', 'v', 'source<=0 ? 0 : null'
    );
    rules.defineRule
      ('saveNotes.trapSense', 'sandmanLevel', '+=', 'Math.floor(source / 3)');
    rules.defineRule
      ('selectableFeatureCount.Bard (Archetype)', classLevel, '=', '1');
    rules.defineRule('selectableFeatureCount.Bard (Arcane Bond)',
      'arcaneDuelistLevel', '+=', 'source>=5 ? 1 : null',
      'magicianLevel', '+=', 'source>=5 ? 1 : null'
    );
    rules.defineRule('skillNotes.eyeForDetail',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.heraldicExpertise',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.magicalTalent(Bard)',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.masterOfDeception',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.streetwise',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.worldTraveler(Bard)',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('sneakAttack', 'sandmanLevel', '+=', 'Math.floor(source / 5)');
  } else if(name == 'Cleric') {
    rules.defineRule('clericRagePowerLevel',
      'features.Rage (Cleric)', '?', null,
      'levels.Cleric', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('ragePowerLevel', 'clericRagePowerLevel', '+=', null);
    rules.defineRule('combatNotes.rage(Cleric).1',
      'features.Rage (Cleric)', '?', null,
      'levels.Cleric', '=', 'source>=16 ? 2 : source>=12 ? 1 : 0'
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
      'levels.Cleric', '=', 'Math.max(Math.floor(source / 2), 1)'
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
      'levels.Druid', '=', '1',
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
      'levels.Druid', '=', '1',
      'druidFeatures.Cavesense', '=', '0'
    );
    rules.defineRule('druidHasResistNaturesLure',
      'levels.Druid', '=', '1',
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
      'levels.Druid', '=', '1',
      'druidFeatures.Spontaneous Casting', '=', '0'
    );
    rules.defineRule('druidHasTracklessStep',
      'levels.Druid', '=', '1',
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
      'levels.Druid', '=', '1',
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
      'levels.Druid', '=', '1',
      'druidFeatures.Vermin Empathy', '=', '0'
    );
    rules.defineRule('druidHasWildShape',
      'levels.Druid', '=', '1',
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
      'levels.Druid', '=', '1',
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
      'levels.Druid', '=', '1',
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
      'levels.Fighter', '=', 'source / 2',
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
      'levels.Fighter', '=', '1',
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
      'levels.Fighter', '=', '1',
      'fighterFeatures.Active Defense', '=', '0',
      'fighterFeatures.Armored Charger', '=', '0',
      'fighterFeatures.Deadshot', '=', '0',
      'fighterFeatures.Defensive Flurry', '=', '0',
      'fighterFeatures.Elusive', '=', '0',
      'fighterFeatures.Overhand Chop', '=', '0',
      'fighterFeatures.Phalanx Fighting', '=', '0',
      'fighterFeatures.Steadfast Pike', '=', '0',
      'fighterFeatures.Trick Shot', '=', '0',
      'fighterFeatures.Weapon Training (Weapon Master)', '=', '0'
    );
    rules.defineRule('fighterHasBravery',
      'levels.Fighter', '=', '1',
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
      'levels.Fighter', '=', '1',
      'fighterFeatures.Natural Weapon Mastery', '=', '0',
      'fighterFeatures.Shield Ward', '=', '0',
      'fighterFeatures.Shielded Fortress', '=', '0',
      'fighterFeatures.Whirlwind Blitz', '=', '0'
    );
    rules.defineRule('fighterHasWeaponTraining',
      'levels.Fighter', '=', '1',
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
  } else if(name.match(/(Azata Chaos|Demon Chaos|Protean) Subdomain/)) {// Chaos
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

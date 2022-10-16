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
/* globals Pathfinder */
"use strict";

/*
 * This module loads the rules from Pathfinder 1E supplemental rule books.
 * The PathfinderSupplements function contains methods that load rules for
 * particular parts of rules; raceRules for character races, shieldRules for
 * shields, etc. These member methods can be called independently in order to
 * use a subset of the rules. Similarly, the constant fields of
 * PathfinderSupplements (FEATS, RACES, etc.) can be manipulated to modify the
 * choices.
 */
function PathfinderSupplements(supplement, rules) {

  if(window.Pathfinder == null) {
    alert('The PathfinderSupplements module requires use of the Pathfinder module');
    return;
  }

  if(rules == null)
    rules = Pathfinder.rules;

  if(supplement.match(/Advanced Class/i))
    supplement = 'ACG';
  else if(supplement.match(/Advanced Player/i))
    supplement = 'APG';
  else if(supplement.match(/Advanced Race/i))
    supplement = 'APG';
  else if(supplement.match(/Unchained/i))
    supplement = 'Unchained';
  else
    supplement = 'APG';

  let armors = PathfinderSupplements[supplement + '_ARMORS'] || {};
  let classes = PathfinderSupplements[supplement + '_CLASSES'] || {};
  let deities = PathfinderSupplements[supplement + '_DEITIES'] || {};
  let feats = PathfinderSupplements[supplement + '_FEATS'] || {};
  let features = PathfinderSupplements[supplement + '_FEATURES'] || {};
  let languages = PathfinderSupplements[supplement + '_LANGUAGES'] || {};
  let paths = PathfinderSupplements[supplement + '_PATHS'] || {};
  let prestiges = PathfinderSupplements[supplement + '_PRESTIGES'] || {};
  let races = PathfinderSupplements[supplement + '_RACES'] || {};
  let shields = PathfinderSupplements[supplement + '_SHIELDS'] || {};
  let skills = PathfinderSupplements[supplement + '_SKILLS'] || {};
  let spells = PathfinderSupplements[supplement + '_SPELLS'] || {};
  let traits = PathfinderSupplements[supplement + '_TRAITS'] || {};
  let weapons = PathfinderSupplements[supplement + '_WEAPONS'] || {};

  PathfinderSupplements.combatRules(rules, armors, shields, weapons);
  PathfinderSupplements.magicRules(rules, {}, spells);
  PathfinderSupplements.talentRules
    (rules, feats, features, {}, languages, skills);
  PathfinderSupplements.identityRules(
    rules, {}, classes, deities, {}, paths, races, {}, traits, prestiges, {}
  );

}

PathfinderSupplements.VERSION = '2.3.1.0';

// Advanced Player's Guide
PathfinderSupplements.APG_ARMORS = {
  'Agile Breatplate':'AC=6 Weight=2 Dex=3 Skill=4 Spell=25',
  'Agile Half-Plate':'AC=8 Weight=2 Dex=0 Skill=7 Spell=40',
  'Armored Coat':'AC=4 Weight=2 Dex=3 Skill=2 Spell=20',
  'Quilted Cloth':'AC=1 Weight=1 Dex=8 Skill=0 Spell=10',
  'Wooden':'AC=3 Weight=1 Dex=3 Skill=1 Spell=15'
};
PathfinderSupplements.APG_FEATS = {
  'Additional Traits':'Type=General',
  'Arcane Blast':'Type=General Require=casterLevelArcane,"casterLevel >= 10"',
  'Arcane Shield':'Type=General Require=casterLevelArcane,"casterLevel >= 10"',
  'Arcane Talent':
    'Type=General Require="charisma >= 10","race =~ \'Elf|Gnome\'"',
  'Aspect Of the Beast':'Type=General Require="features.Wild Shape"',
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
  'Elemental Focus':'Type=General',
  'Greater Elemental Focus':'Type=General Require="features.Elemental Focus"',
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
    'Require="features.Improved Repostion","baseAttackBonus >= 9"',
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
  'Shield of Swings':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttackBonus >= 1"',
  'Shield Specialization':
    'Type=General,Fighter ' +
    'Require="features.Shield Focus","features.Fighter >= 4"',
  'Greater Shield Specialization':
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
  'Touch of Serenity':
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
  'Elemental Spell':'Type=Metamagic,Wizard Imply="casterLevel >= 1"',
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
PathfinderSupplements.APG_FEATURES = {
  // Classes
  'Acid Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts acid damage instead of fire and additional 1d6 following round"',
  'Alchemy':
    'Section=magic,skill ' +
    'Note=' +
      '"May identify potions as with <i>Detect Magic</i> at will/May infuse extracts that duplicate spell effects",' +
      '"+%V Craft (Alchemy)"',
  'Aspect':'Section=feature Note="FILL"',
  'Awakened Intellect':'Section=ability Note="+2 Intelligence"',
  'Bane':'Section=feature Note="FILL"',
  'Banner':'Section=feature Note="FILL"',
  'Bomb':
    'Section=combat ' +
    'Note="May create R20\' missiles that inflict %{(levels.Alchemist+1)//2}d6+%{intelligenceModifier} HP (%{levels.Alchemist+1)//2+intelligenceModifier} (Ref half) splash) %{levels.Alchemist + intelligenceModifier}/dy"',
  'Bond Senses':'Section=feature Note="FILL"',
  // 'Brew Potion' in SRD35.js
  'Cantrips':'Section=feature Note="FILL"',
  'Cavalier Feat Bonus':'Section=feature Note="FILL"',
  "Cavalier's Charge":'Section=feature Note="FILL"',
  'Challenge':'Section=feature Note="FILL"',
  'Combine Extracts':
    'Section=magic Note="May combine two effects into one extract"',
  'Concentrate Poison':
    'Section=feature ' +
    'Note="May combine two doses to increase frequency by 50% and save DC by 2 for 1 hr"',
  'Concussive Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d4 sonic damage instead of fire and deafens on hit (Fort neg)"',
  'Cunning Initiative':'Section=feature Note="FILL"',
  'Delayed Bomb':
    'Section=combat ' +
    'Note="May time bomb to explode after up to %{levels.Alchemist} rd"',
  'Demanding Challenge':'Section=feature Note="FILL"',
  'Detect Alignment':'Section=feature Note="FILL"',
  'Dilution':'Section=magic Note="May split potion or elixir into two doses"',
  'Discern Lies':'Section=feature Note="FILL"',
  'Discovery':'Section=feature Note="%V Selections"',
  'Dispelling Bomb':
    'Section=combat ' +
    'Note="May create bomb that dispels magic instead of inflicting damage"',
  'Domain':'Section=feature Note="FILL"',
  'Eidolon':'Section=feature Note="FILL"',
  'Elixir Of Life':
    'Section=magic ' +
    'Note="May create elixir 1/dy that acts as <i>True Resurrection</i> spell"',
  'Enhance Potion':
    'Section=magic ' +
    'Note="May cause imbibed potion to function at caster level %{levels.Alchemist} %{intelligenceModifier}/dy"',
  'Eternal Potion':
     'Section=magic ' +
     'Note="May cause effects of 1 imbibed potion to become permanent"',
  'Eternal Youth':
    'Section=feature Note="Suffers no ability score penalties from age"',
  'Expert Trainer':'Section=feature Note="FILL"',
  'Exploit Weakness':'Section=feature Note="FILL"',
  'Explosive Bomb':
    'Section=combat ' +
    'Note="Direct hit from bomb causes 1d6 HP fire until extinguised; splash extends 10\'"',
  'Extend Potion':
     'Section=magic ' +
     'Note="May double duration of imbibed potion %{intelligenceModifier}/dy"',
  'Fast Bombs':
    'Section=combat Note="May use full attack to throw multiple bombs in a rd"',
  'Fast Healing':'Section=combat Note="Regains %V HP/rd"',
  'Feral Mutagen':
    'Section=combat ' +
    'Note="Imbibing mutagen grants 2 claw attacks for 1d6 HP each, 1 bite attack for 1d8 HP damage, and +2 Intimidate"',
  'Final Revelation':'Section=feature Note="FILL"',
  'Force Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d4 force damage instead of fire and knocks prone on hit (Ref neg)"',
  'Frost Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d6+%{intelligenceModifier} cold damage instead of fire and staggers on hit (Fort neg)"',
  'Gate':'Section=feature Note="FILL"',
  'Grand Discovery':'Section=feature Note="%V Selection"',
  'Grand Hex':'Section=feature Note="FILL"',
  'Grand Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +6 AC and +8/+6/+4/-2 to strength/intelligence, dexterity/wisdom, and constitution/charisma for %{levels.Alchemist*10} min"',
  'Greater Aspect':'Section=feature Note="FILL"',
  'Greater Bane':'Section=feature Note="FILL"',
  'Greater Banner':'Section=feature Note="FILL"',
  'Greater Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +4 AC and +6/+4/-2 to strength/intelligence, dexterity/wisdom, and constitution/charisma for %{levels.Alchemist*10} min"',
  'Greater Shield Ally':'Section=feature Note="FILL"',
  'Greater Tactician':'Section=feature Note="FILL"',
  'Hex':'Section=feature Note="FILL"',
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
  'Judgment':'Section=feature Note="FILL"',
  'Life Bond':'Section=feature Note="FILL"',
  'Life Link':'Section=feature Note="FILL"',
  'Madness Bomb':
    'Section=combat ' +
    'Note="May create bomb that inflicts 1d4 points of wisdom damage, reducing fire damage by 2d6 HP"',
  "Maker's Call":'Section=feature Note="FILL"',
  'Major Hex':'Section=feature Note="FILL"',
  'Master Tactician':'Section=feature Note="FILL"',
  'Merge Forms':'Section=feature Note="FILL"',
  'Mighty Charge':'Section=feature Note="FILL"',
  'Monster Lore':'Section=feature Note="FILL"',
  'Mount':'Section=feature Note="FILL"',
  'Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +2 AC and +4/-2 to strength/intelligence, dexterity/wisdom, or constitution/charisma for %{levels.Alchemist*10} min"',
  'Mystery Spell':'Section=feature Note="FILL"',
  'Mystery':'Section=feature Note="FILL"',
  "Oracle's Curse":'Section=feature Note="FILL"',
  'Order Ability':'Section=feature Note="FILL"',
  'Order':'Section=feature Note="FILL"',
  'Orisons':'Section=feature Note="FILL"',
  'Persistent Mutagen':'Section=magic Note="Mutagen effects last 1 hr"',
  "Philosopher's Stone":
    'Section=magic ' +
    'Note="May create stone that turns base metals into silver and gold or creates <i>True Resurrection</i> oil"',
  'Poison Bomb':
    'Section=combat ' +
    'Note="May create bomb that kills creatures up to 6 HD (Fort 1d4 consitution damage for 4-6 HD) and inflicts 1d4 constitution damage on higher HD creatures (Fort half) in dbl splash radius for %{levels.Alchemist} rd"',
  'Poison Resistance':'Section=save Note="Resistance %V poison"',
  // 'Poison Use' in Pathfinder.js
  'Poisonous Touch':
    'Section=combat ' +
    'Note="Touch may inflict 1d3 constitution damage/rd for 6 rd (Con neg)"',
  'Precise Bombs':
    'Section=combat ' +
    'Note="May specify %{intelligenceModifier} squares in bomb splash radius that are unaffected"',
  'Revelation':'Section=feature Note="FILL"',
  'Second Judgment':'Section=feature Note="FILL"',
  'Shield Ally':'Section=feature Note="FILL"',
  'Shock Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d6+%{intelligenceModifier} electricity damage instead of fire and dazzles for 1d4 rd"',
  'Slayer':'Section=feature Note="FILL"',
  'Smoke Bomb':
    'Section=combat ' +
    'Note="May create bomb that obscures vision in dbl splash radius for %{levels.Alchemist} rd"',
  'Solo Tactics':'Section=feature Note="FILL"',
  'Stalwart':'Section=feature Note="FILL"',
  'Stern Gaze':'Section=feature Note="FILL"',
  'Sticky Bomb':
    'Section=combat ' +
    'Note="Targets hit by bombs suffer splash damage on the following rd"',
  'Stink Bomb':
    'Section=combat ' +
    'Note="May create bomb that nauseates for 1d4+1 rd (Fort neg) in dbl splash radius for 1 rd"',
  'Summon Monster':'Section=feature Note="FILL"',
  'Supreme Charge':'Section=feature Note="FILL"',
  'Swift Alchemy':
    'Section=combat,magic ' +
    'Note=' +
      '"May apply poison to a blade as a move action",' +
      '"Creating alchemical items takes half normal time"',
  'Swift Poisoning':
    'Section=combat Note="May apply poison to a blade as a swift action"',
  'Tactician':'Section=feature Note="FILL"',
  'Teamwork Feat':'Section=feature Note="FILL"',
  'Third Judgment':'Section=feature Note="FILL"',
  // 'Throw Anything' in Pathfinder.js
  // 'Track' in Pathfinder.js
  'Transposition':'Section=feature Note="FILL"',
  'True Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +8 AC and +8/-2 to strength, dexterity, and constitution/intelligence, wisdom, and charisma for %{levels.Alchemist*10} min"',
  'True Judgment':'Section=feature Note="FILL"',
  'Twin Eidolon':'Section=feature Note="FILL"',
  "Witch's Familiar":'Section=feature Note="FILL"',
  // Feats
  'Additional Traits':'Section=feature Note="+2 Trait Count"',
  'Allied Spellcaster':
    'Section=magic ' +
    'Note="Adjacent ally with same feat gives +2 to overcome spell resistance, +4 and +1 spell level with same spell"',
  'Arcane Blast':
    'Section=magic ' +
    'Note="R30\' ranged touch uses spell slot to inflict 2d6 HP + 1d6 HP/slot level"',
  'Arcane Shield':
    'Section=feature Note="Use spell slot to gain +1 AC/slot level"',
  'Arcane Talent':
    'Section=magic ' +
    'Note="Cast chosen W0 spell 3/dy (DC %{10+charismaModifier})"',
  'Aspect Of the Beast':'Section=feature Note="FILL"',
  'Bashing Finish':
    'Section=combat Note="Gain free shield bash after critical hit"',
  'Bloody Assault':
    'Section=combat ' +
    'Note="May trade -5 attack for extra 1d4 HP bleeding damage (DC 15 Heal ends)"',
  'Bodyguard':'Section=feature Note="FILL"',
  'Bouncing Spell':'Section=magic Note="May redirect ineffectual spell"',
  'Breadth Of Experience':
    'Section=skill ' +
    'Note="+2 Knowledge/+2 Profession/May use Knowledge and Profession untrained"',
  'Bull Rush Strike':'Section=feature Note="FILL"',
  'Charge Through':'Section=feature Note="FILL"',
  'Childlike':
    'Section=skill ' +
    'Note="May take 10 on Bluff (appear innocent)/+2 Disguise (human child)"',
  'Cloud Step':'Section=feature Note="FILL"',
  'Cockatrice Strike':'Section=feature Note="FILL"',
  'Combat Patrol':'Section=feature Note="FILL"',
  'Cooperative Crafting':'Section=feature Note="FILL"',
  'Coordinated Defense':'Section=feature Note="FILL"',
  'Coordinated Maneuvers':'Section=feature Note="FILL"',
  'Cosmopolitan':'Section=feature Note="FILL"',
  'Covering Defense':'Section=feature Note="FILL"',
  'Crippling Critical':'Section=feature Note="FILL"',
  'Crossbow Mastery':'Section=feature Note="FILL"',
  'Dastardly Finish':'Section=feature Note="FILL"',
  'Dazing Assault':'Section=feature Note="FILL"',
  'Dazing Spell':'Section=feature Note="FILL"',
  'Deep Drinker':'Section=feature Note="FILL"',
  'Deepsight':'Section=feature Note="FILL"',
  'Disarming Strike':'Section=feature Note="FILL"',
  'Disrupting Shot':'Section=feature Note="FILL"',
  'Disruptive Spell':'Section=feature Note="FILL"',
  "Diviner's Delving":'Section=feature Note="FILL"',
  'Dreadful Carnage':'Section=feature Note="FILL"',
  'Duck and Cover':'Section=feature Note="FILL"',
  'Eagle Eyes':'Section=feature Note="FILL"',
  'Eclectic':'Section=feature Note="FILL"',
  'Ectoplasmic Spell':'Section=feature Note="FILL"',
  'Eldritch Claws':'Section=feature Note="FILL"',
  'Elemental Fist':'Section=feature Note="FILL"',
  'Elemental Focus':'Section=feature Note="FILL"',
  'Elemental Spell':'Section=feature Note="FILL"',
  'Elven Accuracy':'Section=feature Note="FILL"',
  'Enforcer':'Section=feature Note="FILL"',
  'Expanded Arcana':'Section=feature Note="FILL"',
  'Extra Bombs':'Section=feature Note="FILL"',
  'Extra Discovery':'Section=feature Note="FILL"',
  'Extra Hex':'Section=feature Note="FILL"',
  'Extra Rage Power':'Section=feature Note="FILL"',
  'Extra Revelation':'Section=feature Note="FILL"',
  'Extra Rogue Talent':'Section=feature Note="FILL"',
  'Fast Drinker':'Section=feature Note="FILL"',
  'Fast Healer':'Section=feature Note="FILL"',
  'Favored Defense':'Section=feature Note="FILL"',
  'Fight On':'Section=feature Note="FILL"',
  'Focused Shot':'Section=feature Note="FILL"',
  'Focused Spell':'Section=feature Note="FILL"',
  'Following Step':'Section=feature Note="FILL"',
  'Furious Focus':'Section=feature Note="FILL"',
  'Gang Up':'Section=feature Note="FILL"',
  'Gnome Trickster':'Section=feature Note="FILL"',
  'Go Unnoticed':'Section=feature Note="FILL"',
  'Greater Blind-Fight':'Section=feature Note="FILL"',
  'Greater Dirty Trick':'Section=feature Note="FILL"',
  'Greater Drag':'Section=feature Note="FILL"',
  'Greater Elemental Focus':'Section=feature Note="FILL"',
  'Greater Reposition':'Section=feature Note="FILL"',
  'Greater Shield Specialization':'Section=feature Note="FILL"',
  'Greater Steal':'Section=feature Note="FILL"',
  'Groundling':'Section=feature Note="FILL"',
  'Heroic Defiance':'Section=feature Note="FILL"',
  'Heroic Recovery':'Section=feature Note="FILL"',
  'Improved Blind-Fight':'Section=feature Note="FILL"',
  'Improved Dirty Trick':'Section=feature Note="FILL"',
  'Improved Drag':'Section=feature Note="FILL"',
  'Improved Ki Throw':'Section=feature Note="FILL"',
  'Improved Reposition':'Section=feature Note="FILL"',
  'Improved Second Chance':'Section=feature Note="FILL"',
  'Improved Share Spells':'Section=feature Note="FILL"',
  'Improved Sidestep':'Section=feature Note="FILL"',
  'Improved Steal':'Section=feature Note="FILL"',
  'Improved Stonecunning':'Section=feature Note="FILL"',
  "In Harm's Way":'Section=feature Note="FILL"',
  'Intensified Spell':'Section=feature Note="FILL"',
  'Ironguts':'Section=feature Note="FILL"',
  'Ironhide':'Section=feature Note="FILL"',
  'Keen Scent':'Section=feature Note="FILL"',
  'Ki Throw':'Section=feature Note="FILL"',
  'Leaf Singer':'Section=feature Note="FILL"',
  'Light Step':'Section=feature Note="FILL"',
  'Lingering Performance':'Section=feature Note="FILL"',
  'Lingering Spell':'Section=feature Note="FILL"',
  'Lookout':'Section=feature Note="FILL"',
  'Low Profile':'Section=feature Note="FILL"',
  'Lucky Halfling':'Section=feature Note="FILL"',
  'Major Spell Expertise':'Section=feature Note="FILL"',
  'Master Alchemist':'Section=feature Note="FILL"',
  'Merciful Spell':'Section=feature Note="FILL"',
  'Minor Spell Expertise':'Section=feature Note="FILL"',
  'Missile Shield':'Section=feature Note="FILL"',
  'Mounted Shield':'Section=feature Note="FILL"',
  'Mounted Skirmisher':'Section=feature Note="FILL"',
  'Outflank':'Section=feature Note="FILL"',
  'Paired Opportunists':'Section=feature Note="FILL"',
  'Parry Spell':'Section=feature Note="FILL"',
  'Parting Shot':'Section=feature Note="FILL"',
  'Pass for Human':'Section=feature Note="FILL"',
  'Perfect Strike':'Section=feature Note="FILL"',
  'Persistent Spell':'Section=feature Note="FILL"',
  'Point-Blank Master':'Section=feature Note="FILL"',
  'Practiced Tactician':'Section=feature Note="FILL"',
  'Precise Strike':'Section=feature Note="FILL"',
  'Preferred Spell':'Section=feature Note="FILL"',
  'Punishing Kick':'Section=feature Note="FILL"',
  'Pushing Assault':'Section=feature Note="FILL"',
  'Racial Heritage':'Section=feature Note="FILL"',
  'Raging Vitality':'Section=feature Note="FILL"',
  'Ray Shield':'Section=feature Note="FILL"',
  'Razortusk':'Section=feature Note="FILL"',
  'Reach Spell':'Section=feature Note="FILL"',
  'Rending Claws':'Section=feature Note="FILL"',
  'Repositioning Strike':'Section=feature Note="FILL"',
  'Saving Shield':'Section=feature Note="FILL"',
  'Second Chance':'Section=feature Note="FILL"',
  'Selective Spell':'Section=feature Note="FILL"',
  'Shadow Strike':'Section=feature Note="FILL"',
  'Shared Insight':'Section=feature Note="FILL"',
  'Sharp Senses':'Section=feature Note="FILL"',
  'Shield Specialization':'Section=feature Note="FILL"',
  'Shield Wall':'Section=feature Note="FILL"',
  'Shield of Swings':'Section=feature Note="FILL"',
  'Shielded Caster':'Section=feature Note="FILL"',
  'Sickening Spell':'Section=feature Note="FILL"',
  'Sidestep':'Section=feature Note="FILL"',
  'Smash':'Section=feature Note="FILL"',
  'Smell Fear':'Section=feature Note="FILL"',
  'Sociable':'Section=feature Note="FILL"',
  'Spell Perfection':'Section=feature Note="FILL"',
  'Spider Step':'Section=feature Note="FILL"',
  'Stabbing Shot':'Section=feature Note="FILL"',
  'Steel Soul':'Section=feature Note="FILL"',
  'Step Up and Strike':'Section=feature Note="FILL"',
  'Stone Sense':'Section=feature Note="FILL"',
  'Stone Singer':'Section=feature Note="FILL"',
  'Stone-Faced':'Section=feature Note="FILL"',
  'Stunning Assault':'Section=feature Note="FILL"',
  "Summoner's Call":'Section=feature Note="FILL"',
  'Sundering Strike':'Section=feature Note="FILL"',
  'Swap Places':'Section=feature Note="FILL"',
  'Swift Aid':'Section=feature Note="FILL"',
  'Taunt':'Section=feature Note="FILL"',
  'Team Up':'Section=feature Note="FILL"',
  'Teleport Tactician':'Section=feature Note="FILL"',
  'Tenacious Transmutation':'Section=feature Note="FILL"',
  'Thundering Spell':'Section=feature Note="FILL"',
  'Touch of Serenity':'Section=feature Note="FILL"',
  'Trick Riding':'Section=feature Note="FILL"',
  'Tripping Strike':'Section=feature Note="FILL"',
  'Under and Over':'Section=feature Note="FILL"',
  'Underfoot':'Section=feature Note="FILL"',
  'Vermin Heart':'Section=feature Note="FILL"',
  'War Singer':'Section=feature Note="FILL"',
  'Well-Prepared':'Section=feature Note="FILL"',
};
PathfinderSupplements.APG_LANGUAGES = {
};
PathfinderSupplements.APG_PATHS = {
};
PathfinderSupplements.APG_RACES = {
};
PathfinderSupplements.APG_SHIELDS = {
  'Light Steel Quickdraw':'AC=1 Weight=1 Skill=2 Spell=5',
  'Light Wooden Quickdraw':'AC=1 Weight=1 Skill=2 Spell=5'
};
PathfinderSupplements.APG_SKILLS = {
};
PathfinderSupplements.APG_SPELLS = {
};
PathfinderSupplements.APG_TRAITS = {
  // Already declared in Pathfinder.js
};
PathfinderSupplements.APG_WEAPONS = {
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
PathfinderSupplements.APG_CLASSES = {
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
      '1:Challenge,1:Mount,1:Order,1:Tactician,"2:Order Ability",' +
      '"3:Cavalier\'s Charge","4:Expert Trainer",5:Banner,' +
      '"6:Cavalier Feat Bonus","9:Greater Tactician","11:Mighty Charge",' +
      '"12:Demanding Challenge","14:Greater Banner","17:Master Tactician",' +
      '"20:Supreme Charge" ' +
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
    'CasterLevelArcane=levels.Oracle ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
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
      '1:Cantrips,1:Eidolon,"1:Life Link","1:Summon Monster","2:Bond Senses",' +
      '"4:Shield Ally","6:Maker\'s Call",8:Transposition,10:Aspect,' +
      '"12:Greater Shield Ally","14:Life Bond","16:Merge Forms",' +
      '"18:Greater Aspect",19:Gate,"20:Twin Eidolon" ' +
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
      '1:Cantrips,1:Hex,"1:Witch\'s Familiar","10:Major Hex","18:Grand Hex" ' +
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
PathfinderSupplements.APG_PRESTIGES = {
};
PathfinderSupplements.APG_DEITIES = {
};

/* Defines rules related to combat. */
PathfinderSupplements.combatRules = function(rules, armors, shields, weapons) {
  Pathfinder.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by Pathfinder method
};

/* Defines rules related to basic character identity. */
PathfinderSupplements.identityRules = function(
  rules, alignments, classes, deities, factions, paths, races, tracks, traits,
  prestigeClasses, npcClasses
) {
  Pathfinder.identityRules(
    rules, alignments, classes, deities, factions, paths, races, tracks, traits,
    prestigeClasses, npcClasses
  );
  for(let clas in classes)
    PathfinderSupplements.classRulesExtra(rules, clas);
  for(let clas in prestigeClasses)
    PathfinderSupplements.classRulesExtra(rules, clas);
  for(let clas in npcClasses)
    PathfinderSupplements.classRulesExtra(rules, clas);
  for(let race in races)
    PathfinderSupplements.raceRulesExtra(rules, race);
};

/* Defines rules related to magic use. */
PathfinderSupplements.magicRules = function(rules, schools, spells) {
  Pathfinder.magicRules(rules, schools, spells);
};

/* Defines rules related to character aptitudes. */
PathfinderSupplements.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  Pathfinder.talentRules(rules, feats, features, goodies, languages, skills);
  for(let feat in feats)
    PathfinderSupplements.raceRulesExtra(rules, feat);
  rules.defineRule('traitCount', '', '=', '2');
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * directly derived from the attributes passed to classRules.
 */
PathfinderSupplements.classRulesExtra = function(rules, name) {
  let classLevel = 'levels.' + name;
  if(name == 'Alchemist') {
    rules.defineRule('combatNotes.fastHealing', classLevel, '+=', '5');
    rules.defineRule('featureNotes.discovery',
      classLevel, '=', 'Math.floor(source / 2) + (source==20 ? 1 : 0)'
    );
    rules.defineRule('featureNotes.grandDiscovery', classLevel, '=', '1');
    rules.defineRule('saveNotes.poisonResistance',
      classLevel, '=', 'source>=10 ? Infinity : source>=8 ? 6 : source>= 5 ? 4 : 2'
    );
    rules.defineRule
      ('selectableFeatureCount.Discovery', 'featureNotes.discovery', '=', null);
    rules.defineRule('selectableFeatureCount.Grand Discovery',
      'featureNotes.grandDiscovery', '=', null
    );
    rules.defineRule('skillNotes.alchemy', classLevel, '=', null);
  }
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
PathfinderSupplements.featRulesExtra = function(rules, name) {
};

/*
 * Defines in #rules# the rules associated with bloodline #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
PathfinderSupplements.pathRulesExtra = function(rules, name) {
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
PathfinderSupplements.raceRulesExtra = function(rules, name) {
};

/*
 * Defines in #rules# the rules associated with trait #name# that are not
 * directly derived from the parameters passed to traitRules.
 */
PathfinderSupplements.traitRulesExtra = function(rules, name) {
};

/* Returns HTML body content for user notes associated with this rule set. */
PathfinderSupplements.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Pathfinder Supplements Rule Set Notes</h2>\n' +
    '<p>\n' +
    'Quilvyn Pathfinder Supplements Rule Set Version ' + PathfinderSupplements.VERSION + '\n' +
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

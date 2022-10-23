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
/* globals Pathfinder, QuilvynUtils */
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
  let spellLevels =
    PathfinderSupplements[supplement + '_SPELLS_LEVELS_ADDED'] || {};
  let traits = PathfinderSupplements[supplement + '_TRAITS'] || {};
  let weapons = PathfinderSupplements[supplement + '_WEAPONS'] || {};

  PathfinderSupplements.combatRules(rules, armors, shields, weapons);
  PathfinderSupplements.magicRules(rules, spells, spellLevels);
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
  'Acid Skin':'Section=feature Note="FILL"',
  'Act As One':
    'Section=combat ' +
    'Note="R30\' May grant move, +2 melee attack, and +2 AC to each ally 1/combat"',
  'Aid Allies (Cavalier)':
    'Section=combat Note="Aid Another action gives +%{(levels.Cavalier+4)//6} AC, attack, save, or skill check"',
  'Air Barrier':'Section=feature Note="FILL"',
  'Alchemy':
    'Section=magic,skill ' +
    'Note=' +
      '"May identify potions as with <i>Detect Magic</i> at will/May infuse extracts that duplicate spell effects",' +
      '"+%V Craft (Alchemy)"',
  'Arcane Archivist':'Section=feature Note="FILL"',
  'Armor Of Bones':'Section=feature Note="FILL"',
  'Aspect':'Section=feature Note="FILL"',
  'Automatic Writing':'Section=feature Note="FILL"',
  'Awakened Intellect':'Section=ability Note="+2 Intelligence"',
  'Awesome Display':'Section=feature Note="FILL"',
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
  'Bleeding Wounds':'Section=feature Note="FILL"',
  'Blizzard':'Section=feature Note="FILL"',
  'Bonded Mount':'Section=feature Note="FILL"',
  'Braggart':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 attacks on demoralized target",' +
      '"Has Dazzling Display features"',
  'Brain Drain':'Section=feature Note="FILL"',
  'Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict full HP on hit and %{levels.Alchemist+1)//2+intelligenceModifier} HP (Ref half) splash %{levels.Alchemist + intelligenceModifier}/dy"',
  'Bond Senses':'Section=feature Note="FILL"',
  'Bones Mystery':
    'Section=skill ' +
    'Note="Bluff is a class skill/Disguise is a class skill/Intimidate is a class skill/Stealth is a class skill"',
  // 'Brew Potion' in SRD35.js
  'Burning Magic':'Section=feature Note="FILL"',
  'By My Honor':
    'Section=save Note="+2 choice of save while maintaining alignment"',
  'Calling':
    'Section=feature,magic ' +
    'Note=' +
      '"May gain +%{charismaModifier} on chosen ability check, attack, save, or skill check within 1 min after prayer 4/dy",' +
      '"+%V %1"',
  'Cantrips':'Section=feature Note="FILL"',
  'Cavalier Feat Bonus':'Section=feature Note="Gain %V Fighter Feats"',
  "Cavalier's Charge":
    'Section=combat Note="+4 mounted melee attack; no AC penalty afterward"',
  'Challenge':
    'Section=combat ' +
    'Note="Gain +%{levels.Cavalier} HP damage on chosen foe and suffer -2 AC against other foes 1/dy"',
  'Channel':'Section=feature Note="FILL"',
  'Cinder Dance':'Section=feature Note="FILL"',
  'Clobbering Strike':'Section=feature Note="FILL"',
  'Clouded Vision':
    'Section=feature ' +
    'Note="%{levels.Oracle>=5? 60 : 30}\' vision and darkvision%{levels.Oracle>=10 ? \\", 30\' blindsense\\" : \'\'}%{levels.Oracle>=15 ? \\", 15\' blindsight\\" : \'\'}"',
  'Coat Of Many Stars':'Section=feature Note="FILL"',
  'Combat Healer':'Section=feature Note="FILL"',
  'Combine Extracts':
    'Section=magic Note="May combine two effects into one extract"',
  'Concentrate Poison':
    'Section=feature ' +
    'Note="May combine two doses to increase frequency by 50% and save DC by 2 for 1 hr"',
  'Concussive Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d4 sonic damage instead of fire and deafens on hit (Fort neg)"',
  'Crystal Strike':'Section=feature Note="FILL"',
  'Cunning Initiative':'Section=combat Note="+%V Initiative"',
  'Deaf':
    'Section=combat,feature,magic,skill ' +
    'Note=' +
      '"-%V Initiative",' +
      '"Has %V",' +
      '"May cast all spells silently",' +
      '"+3 Perception (non-sound)"',
  "Death's Touch":'Section=feature Note="FILL"',
  'Delay Affliction':'Section=feature Note="FILL"',
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
  'Discovery':'Section=feature Note="%V Selections"',
  'Dispelling Bomb':
    'Section=combat ' +
    'Note="May create bomb that dispels magic instead of inflicting damage"',
  'Domain':'Section=feature Note="FILL"',
  'Dweller In Darkness':'Section=feature Note="FILL"',
  'Earth Glide':'Section=feature Note="FILL"',
  'Eidolon':'Section=feature Note="FILL"',
  'Elixir Of Life':
    'Section=magic ' +
    'Note="May create elixir 1/dy that acts as <i>True Resurrection</i> spell"',
  'Energy Body':'Section=feature Note="FILL"',
  'Enhance Potion':
    'Section=magic ' +
    'Note="May cause imbibed potion to function at caster level %{levels.Alchemist} %{intelligenceModifier}/dy"',
  'Enhanced Cures':'Section=feature Note="FILL"',
  'Erosion Touch':'Section=feature Note="FILL"',
  'Eternal Potion':
     'Section=magic ' +
     'Note="May cause effects of 1 imbibed potion to become permanent"',
  'Eternal Youth':
    'Section=feature Note="Suffers no ability score penalties from age"',
  'Expert Trainer':
    'Section=skill ' +
    'Note="+%{levels.Cavalier//2} Handle Animal (mount)/Teach mount in 1/7 time (DC +5)"',
  'Exploit Weakness':
    'Section=combat ' +
    'Note="Critical hit ignores DR, negates regeneration for 1 rd/+1 energy damage HP/die vs. vulnerable foe"',
  'Explosive Bomb':
    'Section=combat ' +
    'Note="Direct hit from bomb causes 1d6 HP fire until extinguished; splash extends 10\'"',
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
  'Fire Breath':'Section=feature Note="FILL"',
  'Firestorm':'Section=feature Note="FILL"',
  'Flame Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Climb is a class skill/Intimidate is a class skill/Perform is a class skill"',
  'Fluid Nature':'Section=feature Note="FILL"',
  'Fluid Travel':'Section=feature Note="FILL"',
  'Focused Trance':'Section=feature Note="FILL"',
  'For The Faith':
    'Section=combat ' +
    'Note="R30\' May grant +%{charismaBonus>?1} to self attack and +%{charismaBonus//2>?1} to allies %{levels.Cavalier//4-1}/dy"',
  'For The King':
    'Section=combat ' +
    'Note="R30\' May give allies +%{charismaModifier} attack and damage for 1 rd"',
  'Force Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d4 force damage instead of fire and knocks prone on hit (Ref neg)"',
  'Form Of Flame':'Section=feature Note="FILL"',
  'Freezing Spells':'Section=feature Note="FILL"',
  'Friend To The Animals':'Section=feature Note="FILL"',
  'Frost Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d6+%{intelligenceModifier} cold damage instead of fire and staggers on hit (Fort neg)"',
  'Gaseous Form':'Section=feature Note="FILL"',
  'Gate':'Section=feature Note="FILL"',
  'Grand Discovery':'Section=feature Note="%V Selection"',
  'Grand Hex':'Section=feature Note="FILL"',
  'Grand Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +6 AC and +8/+6/+4/-2 to strength/intelligence, dexterity/wisdom, and constitution/charisma for %{levels.Alchemist*10} min"',
  'Greater Aspect':'Section=feature Note="FILL"',
  'Greater Bane':'Section=combat Note="Increased Bane effects"',
  'Greater Banner':
    'Section=combat ' +
    'Note="R60\' allies +2 save vs. charm and compulsion; waving grants allies additional saving throw vs. spells"',
  'Greater Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +4 AC and +6/+4/-2 to strength/intelligence, dexterity/wisdom, and constitution/charisma for %{levels.Alchemist*10} min"',
  'Greater Shield Ally':'Section=feature Note="FILL"',
  'Greater Tactician':'Section=feature Note="Gain 1 Teamwork feat"',
  'Guiding Star':'Section=feature Note="FILL"',
  'Haunted':
    'Section=feature,magic ' +
    'Note=' +
      '"Malevolent spirits cause minor annoyances",' +
      '"Know %V spells"',
  'Healing Hands':'Section=feature Note="FILL"',
  'Heat Aura':'Section=feature Note="FILL"',
  'Heavens Mystery':
    'Section=skill ' +
    'Note="Fly is a class skill/Knowledge (Arcana) is a class skill/Perception is a class skill/Survival is a class skill"',
  'Hex':'Section=feature Note="FILL"',
  'Ice Armor':'Section=feature Note="FILL"',
  'Icy Skin':'Section=feature Note="FILL"',
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
  'Interstellar Void':'Section=feature Note="FILL"',
  'Invisibility':'Section=feature Note="FILL"',
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
  'Life Bond':'Section=feature Note="FILL"',
  'Life Leach':'Section=feature Note="FILL"',
  'Life Link':'Section=feature Note="FILL"',
  'Life Mystery':
    'Section=skill ' +
    'Note="Handle Animal is a class skill/Knowledge (Nature) is a class skill/Survival is a class skill"',
  'Lifesense':'Section=feature Note="FILL"',
  'Lightning Breath':'Section=feature Note="FILL"',
  "Lion's Call":
    'Section=combat ' +
    'Note="R60\' May give allies +%{charismaModifier} vs. fear and +1 attack for %{levels.Cavalier} rd"',
  'Lore Keeper':'Section=feature Note="FILL"',
  'Lore Mystery':
    'Section=skill ' +
    'Note="Appraise is a class skill/Knowledge is a class skill"',
  'Lure Of The Heavens':'Section=feature Note="FILL"',
  'Madness Bomb':
    'Section=combat ' +
    'Note="May create bomb that inflicts 1d4 points of wisdom damage, reducing fire damage by 2d6 HP"',
  'Major Hex':'Section=feature Note="FILL"',
  "Maker's Call":'Section=feature Note="FILL"',
  'Maneuver Mastery':
    'Section=combat,feature ' +
    'Note=' +
      '"+{levels.Oracle - baseAttackBonus} on chosen combat maneuver",' +
      '"Has Improved Trip%V features"',
  'Mantle Of Moonlight':'Section=feature Note="FILL"',
  'Master Tactician':'Section=feature Note="Gain 1 Teamwork feat"',
  'Mental Acuity':'Section=feature Note="FILL"',
  'Merge Forms':'Section=feature Note="FILL"',
  'Mighty Charge':
    'Section=combat ' +
    'Note="Dbl threat range while mounted; free bull rush, disarm, sunder, or trip afterward w/out AOO"',
  'Mighty Pebble':'Section=feature Note="FILL"',
  'Molten Skin':'Section=feature Note="FILL"',
  'Moment Of Triumph':
    'Section=feature ' +
    'Note="Automatically confirms critical threats and gains +%{charismaModifier} on ability checks, attacks, damage, saves, skillChecks, and AC 1/dy"',
  'Monster Lore':
    'Section=skill ' +
    'Note="+%{wisdomModifier} Knowledge (identify creature abilities and weaknesses)"',
  'Moonlight Bridge':'Section=feature Note="FILL"',
  'Mount':'Section=feature Note="Special bond and abilities"',
  'Mounted Mastery':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+4 AC vs. attacks set against mounted charge/Adds mount\'s strength modifier to charge damage",' +
      '"Gain 1 Order Of The Sword feat",' +
      '"No armor check penalty for Ride"',
  'Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +2 AC and +4/-2 to strength/intelligence, dexterity/wisdom, or constitution/charisma for %{levels.Alchemist*10} min"',
  'Mystery Spell':'Section=feature Note="FILL"',
  'Mystery':'Section=feature Note="1 Selection"',
  'Natural Divination':'Section=feature Note="FILL"',
  'Nature Mystery':
    'Section=skill ' +
    'Note="Climb is a class skill/Fly is a class skill/Knowledge (Nature) is a class skill/Survival is a class skill/Swim is a class skill"',
  "Nature's Whispers":'Section=feature Note="FILL"',
  'Near Death':'Section=feature Note="FILL"',
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
      '"Allies receive +%{levels.Cavalier//4+1} attacks on challenge target",' +
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
      '"+%{levels.Cavalier//4+1} attacks vs. challenge target for 1 min if target attacks another",' +
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
      '"+%{levels.Cavalier//4+1} mounted attacks vs. challenge target",' +
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
  'Punitive Transformation':'Section=feature Note="FILL"',
  'Raise The Dead':'Section=feature Note="FILL"',
  'Resiliency (Oracle)':
    'Section=combat,feature ' +
    'Note=' +
      '"Not disabled or staggered at 0 HP",' +
      '"Has %V features"',
  'Resist Life':'Section=feature Note="FILL"',
  'Resolute':
    'Section=combat ' +
    'Note="In heavy armor, may convert %{(levels.Cavalier+4)/6} HP taken from each attack to nonlethal"',
  'Retribution':
    'Section=combat ' +
    'Note="May make AOO against adjacent foe who strikes fellow member of the faith 1/rd"',
  'Revelation':'Section=feature Note="%V Selections"',
  'Rock Throwing':'Section=feature Note="FILL"',
  'Safe Curing':'Section=feature Note="FILL"',
  'Second Judgment':'Section=combat Note="May use 2 judgments simultaneously"',
  'Shard Explosion':'Section=feature Note="FILL"',
  'Shield Ally':'Section=feature Note="FILL"',
  'Shield Of The Liege':
    'Section=combat ' +
    'Note="May redirect attack on adjacent ally to self/Adjacent allies gain +2 AC"',
  'Shock Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d6+%{intelligenceModifier} electricity damage instead of fire and dazzles for 1d4 rd"',
  'Sidestep Secret':'Section=feature Note="FILL"',
  'Skill At Arms':
    'Section=combat ' +
    'Note="Weapon Proficiency (Martial)/Armor Proficiency (Heavy)"',
  'Slayer':
    'Section=combat Note="+5 Inquisitor level for chosen judgment effects"',
  'Smoke Bomb':
    'Section=combat ' +
    'Note="May create bomb that obscures vision in dbl splash radius for %{levels.Alchemist} rd"',
  'Solo Tactics':'Section=combat Note="All allies count for Teamwork features"',
  'Soul Siphon':'Section=feature Note="FILL"',
  'Spark Skin':'Section=feature Note="FILL"',
  'Speak With Animals':'Section=feature Note="FILL"',
  'Spirit Boost':'Section=feature Note="FILL"',
  'Spirit Of Nature':'Section=feature Note="FILL"',
  'Spirit Walk':'Section=feature Note="FILL"',
  'Spontaneous Symbology':'Section=feature Note="FILL"',
  'Spray Of Shooting Stars':'Section=feature Note="FILL"',
  'Stalwart':
    'Section=save ' +
    'Note="Successful Fortitude or Will save yields no damage instead of half (heavy armor neg)"',
  'Star Chart':'Section=feature Note="FILL"',
  'Steal Glory':
    'Section=combat ' +
    'Note="May make AOO against threatened target when ally scores a critical hit"',
  'Steelbreaker Skin':'Section=feature Note="FILL"',
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
  'Stone Stability':'Section=feature Note="FILL"',
  'Strategy':
    'Section=combat ' +
    'Note="R30\' Grant immediate move, +2 AC for 1 rd, or +2 attack for 1 rd to each ally"',
  'Summon Monster':'Section=feature Note="FILL"',
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
  'Think On It':'Section=feature Note="FILL"',
  'Third Judgment':'Section=combat Note="May use 3 judgments simultaneously"',
  // 'Throw Anything' in Pathfinder.js
  'Thunderburst':'Section=feature Note="FILL"',
  'Tongues':
    'Section=combat,feature ' +
    'Note=' +
      '"Can speak only chosen outsider or elemental language during combat",' +
      '"+%V Language Count%1"',
  'Touch Of Acid':'Section=feature Note="FILL"',
  'Touch Of Electricity':'Section=feature Note="FILL"',
  'Touch Of Flame':'Section=feature Note="FILL"',
  // 'Track' in Pathfinder.js
  'Transcendental Bond':'Section=feature Note="FILL"',
  'Transposition':'Section=feature Note="FILL"',
  'True Judgment':
    'Section=combat ' +
    'Note="Successful judgment attack kills foe (Fort neg) 1/1d4 rd"',
  'True Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +8 AC and +8/-2 to strength, dexterity, and constitution/intelligence, wisdom, and charisma for %{levels.Alchemist*10} min"',
  'Twin Eidolon':'Section=feature Note="FILL"',
  'Undead Servitude':'Section=feature Note="FILL"',
  'Undo Artifice':'Section=feature Note="FILL"',
  'Voice Of The Grave':'Section=feature Note="FILL"',
  'Vortex Spells':'Section=feature Note="FILL"',
  'War Sight':
    'Section=combat ' +
    'Note="May take choice of %{levels.Oracle>=11 ? 3 : 2} Initiative Rolls%{levels.Oracle>=7 ? \'/May always act in surprise round\' : \'\'}"',
  'Wasting':
    'Section=save,skill ' +
    'Note=' +
      '"%{levels.Oracle>=10 ? \'Immune to\' : \'+4 vs.\'} disease%1",' +
      '"-4 Charisma-based skills other than Intimidate"',
  'Water Form':'Section=feature Note="FILL"',
  'Water Sight':'Section=feature Note="FILL"',
  'Waves Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Knowledge (Nature) is a class skill/Swim is a class skill"',
  'Weapon Mastery':
    'Section=feature Note="+%V Feat Count (Weapon Focus%1 with chosen weapon)"',
  'Whirlwind Lesson':'Section=feature Note="FILL"',
  'Wind Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Fly is a class skill/Stealth is a class skill"',
  'Wind Sight':'Section=feature Note="FILL"',
  'Wings Of Air':'Section=feature Note="FILL"',
  'Wings Of Fire':'Section=feature Note="FILL"',
  'Wintry Touch':'Section=feature Note="FILL"',
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
  'Battle Mystery':
    'Group="Battle Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      'Battlecry,"Battlefield Clarity","7:Combat Healer","11:Iron Skin",' +
      '"Maneuver Mastery","Resiliency (Oracle)","Skill At Arms",' +
      '"Surprising Charge","War Sight","Weapon Mastery"',
  'Bones Mystery':
    'Group="Bones Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      '"Armor Of Bones","Bleeding Wounds","Death\'s Touch","Near Death",' +
      '"Raise The Dead","Resist Life","7:Soul Siphon","11:Spirit Walk",' +
      '"Undead Servitude","Voice Of The Grave"',
  'Flame Mystery':
    'Group="Flame Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      '"Burning Magic","Cinder Dance","Fire Breath",11:Firestorm,' +
      '"7:Form Of Flame","Heat Aura","Molten Skin","Touch Of Flame",' +
      '"7:Wings Of Fire"',
  'Heavens Mystery':
    'Group="Heavens Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      '"Awesome Display","Coat Of Many Stars","11:Dweller In Darkness",' +
      '"Guiding Star","Interstellar Void","Lure Of The Heavens",' +
      '"Mantle Of Moonlight","Moonlight Bridge","Spray Of Shooting Stars",' +
      '"7:Star Chart"',
  'Life Mystery':
    'Group="Life Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      'Channel,"7:Combat Healer","Delay Affliction","Energy Body",' +
      '"Enhanced Cures","Healing Hands","Life Link",11:Lifesense,' +
      '"Safe Curing","Spirit Boost"',
  'Lore Mystery':
    'Group="Lore Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      '"11:Arcane Archivist","Automatic Writing","Brain Drain",' +
      '"Focused Trance","Lore Keeper","7:Mental Acuity","Sidestep Secret",' +
      '"11:Spontaneous Symbology","Think On It","Whirlwind Lesson"',
  'Nature Mystery':
    'Group="Nature Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      '"Bonded Mount","Erosion Touch","Friend To The Animals","7:Life Leach",' +
      '"Natural Divination","Nature\'s Whispers","Speak With Animals",' +
      '"Spirit Of Nature","Transcendental Bond","Undo Artifice"',
  'Stone Mystery':
    'Group="Stone Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      '"Acid Skin","Clobbering Strike","Crystal Strike","7:Earth Glide",' +
      '"Mighty Pebble","Rock Throwing","Shard Explosion",' +
      '"7:Steelbreaker Skin","Stone Stability","Touch Of Acid"',
  'Waves Mystery':
    'Group="Waves Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      'Blizzard,"Fluid Nature","Fluid Travel","Freezing Spells","Ice Armor",' +
      '"Icy Skin","7:Punitive Transformation","7:Water Form","Water Sight",' +
      '"Wintry Touch"',
  'Wind Mystery':
    'Group="Wind Mystery" ' +
    'Level=levels.Oracle ' +
    'Selectables=' +
      '"Air Barrier","7:Gaseous Form",3:Invisibility,"Lightning Breath",' +
      '"Spark Skin",7:Thunderburst,"Touch Of Electricity","Vortex Spells",' +
      '"Wind Sight","7:Wings Of Air"'
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

  'Absorbing Touch':
    'School=Transmutation ' +
    'Level=Alchemist3 ' +
    'Description="FILL"',
  'Accelerate Poison':
    'School=Transmutation ' +
    'Level=D2,R2,W2 ' +
    'Description="FILL"',
  'Acid Pit':
    'School=Conjuration ' +
    'Level=W4,Summoner4 ' +
    'Description="FILL"',
  'Alchemical Allocation':
    'School=Transmutation ' +
    'Level=Alchemist2 ' +
    'Description="FILL"',
  'Allfood':
    'School=Transmutation ' +
    'Level=R2 ' +
    'Description="FILL"',
  'Alter Winds':
    'School=Transmutation ' +
    'Level=D1,W1 ' +
    'Description="FILL"',
  'Amplify Elixir':
    'School=Transmutation ' +
    'Level=Alchemist3 ' +
    'Description="FILL"',
  'Ant Haul':
    'School=Transmutation ' +
    'Level=Alchemist1,C1,D1,R1,W1,Summoner1 ' +
    'Description="FILL"',
  'Aqueous Orb':
    'School=Conjuration ' +
    'Level=D3,W3,Summoner3 ' +
    'Description="FILL"',
  'Arcane Concordance':
    'School=Evocation ' +
    'Level=B3 ' +
    'Description="FILL"',
  'Arrow Eruption':
    'School=Conjuration ' +
    'Level=R2,W2 ' +
    'Description="FILL"',
  'Aspect of the Bear':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="FILL"',
  'Aspect of the Falcon':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  'Aspect of the Stag':
    'School=Transmutation ' +
    'Level=D4,R3 ' +
    'Description="FILL"',
  'Aspect of the Wolf':
    'School=Transmutation ' +
    'Level=D5,R4 ' +
    'Description="FILL"',
  'Aura of Greater Courage':
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="FILL"',
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
  'Blaze of Glory':
    'School=Conjuration ' +
    'Level=P4 ' +
    'Description="FILL"',
  'Blessing of Courage and Life':
    'School=Conjuration ' +
    'Level=C2,P2 ' +
    'Description="FILL"',
  'Blessing of Fervor':
    'School=Transmutation ' +
    'Level=C4 ' +
    'Description="FILL"',
  'Blessing of the Salamander':
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
    'Level=Oracle3 ' +
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
    'Level=B6 ' +
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
    'Level=D9,W9 ' +
    'Description="FILL"',
  'Cleanse':
    'School=Evocation ' +
    'Level=C5,Inquisitor6 ' +
    'Description="FILL"',
  'Cloak of Dreams':
    'School=Enchantment ' +
    'Level=B5,W6,Witch6 ' +
    'Description="FILL"',
  'Cloak of Shade':
    'School=Abjuration ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  'Cloak of Winds':
    'School=Abjuration ' +
    'Level=D3,R3,W3 ' +
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
    'Level=W2,Summoner2 ' +
    'Description="FILL"',
  'Create Treasure Map':
    'School=Divination ' +
    'Level=B2,D3,R2,W2 ' +
    'Description="FILL"',
  'Cup of Dust':
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
    'Level=W7 ' +
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
  'Dust of Twilight':
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
    'Level=B6,C8,D8,W8 ' +
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
  'Feast of Ashes':
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
    'Level=W9 ' +
    'Description="FILL"',
  'Fire Breath':
    'School=Evocation ' +
    'Level=Alchemist2,W2 ' +
    'Description="FILL"',
  'Fire of Entanglement':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Fire of Judgment':
    'School=Evocation ' +
    'Level=P3 ' +
    'Description="FILL"',
  'Fire of Vengeance':
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
  'Flames of the Faithful':
    'School=Transmutation ' +
    'Level=Inquisitor2 ' +
    'Description="FILL"',
  'Flare Burst':
    'School=Evocation ' +
    'Level=B1,D1,W1 ' +
    'Description="FILL"',
  'Fluid Form':
    'School=Transmutation ' +
    'Level=Alchemist4,W6 ' +
    'Description="FILL"',
  'Mass Fly':
    'School=Transmutation ' +
    'Level=W7 ' +
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
    'Level=D4,W5 ' +
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
  'Grove of Respite':
    'School=Conjuration ' +
    'Level=D4,R4 ' +
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
    'Level=W5,Summoner5 ' +
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
    'Level=B1,W1 ' +
    'Description="FILL"',
  'Moonstruck':
    'School=Enchantment ' +
    'Level=D4,W4,Witch4 ' +
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
  'Oath of Peace':
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
    'Level=B5,W5 ' +
    'Description="FILL"',
  'Pied Piping':
    'School=Enchantment ' +
    'Level=B6 ' +
    'Description="FILL"',
  'Pillar of Life':
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
    'Level=C4,D5,Witch5 ' +
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
  'River of Wind':
    'School=Evocation ' +
    'Level=D4,W4 ' +
    'Description="FILL"',
  'Sacred Bond':
    'School=Conjuration ' +
    'Level=C3,Inquisitor2,P2 ' +
    'Description="FILL"',
  'Sacrificial Oath':
    'School=Abjuration ' +
    'Level=P4 ' +
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
    'Level=D8,W8 ' +
    'Description="FILL"',
  'Seek Thoughts':
    'School=Divination ' +
    'Level=Alchemist3,B3,Inquisitor3,W3,Summoner3,Witch3 ' +
    'Description="FILL"',
  'Shadow Projection':
    'School=Necromancy ' +
    'Level=W4 ' +
    'Description="FILL"',
  'Share Language':
    'School=Divination ' +
    'Level=B1,C2,D2,W2 ' +
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
    'Level=D6,W60 ' +
    'Description="FILL"',
  'Sleepwalk':
    'School=Enchantment ' +
    'Level=Inquisitor4,Witch4 ' +
    'Description="FILL"',
  'Slipstream':
    'School=Conjuration ' +
    'Level=D2,R2,W2 ' +
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
    'Level=W3,Summoner3 ' +
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
    'Level=D2,R2,W2 ' +
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
    'Level=W5,Witch5 ' +
    'Description="FILL"',
  'Mass Suffocation':
    'School=Necromancy ' +
    'Level=W9,Witch9 ' +
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
  'Touch of Gracelessness':
    'School=Transmutation ' +
    'Level=B1,W1 ' +
    'Description="FILL"',
  'Touch of the Sea':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,W1 ' +
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
    'Level=D9,W9 ' +
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
  'Veil of Positive Energy':
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
    'Level=D7,W7 ' +
    'Description="FILL"',
  'Wake of Light':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="FILL"',
  'Wall of Lava':
    'School=Conjuration ' +
    'Level=D8,W8 ' +
    'Description="FILL"',
  'Wall of Suppression':
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
  'Weapon of Awe':
    'School=Transmutation ' +
    'Level=C2,Inquisitor2,P2 ' +
    'Description="FILL"',
  'Winds of Vengeance':
    'School=Transmutation ' +
    'Level=C9,D9,W9 ' +
    'Description="FILL"',
  'World Wave':
    'School=Transmutation ' +
    'Level=Alchemist3 ' +
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
PathfinderSupplements.APG_SPELLS_LEVELS_ADDED = {
  'Acid Splash':'Inquisitor0',
  'Bleed':'Inquisitor0',
  'Create Water':'Inquisitor0',
  'Daze':'Inquisitor0',
  'Detect Magic':'Inquisitor0',
  'Detect Poison':'Inquisitor0',
  'Disrupt Undead':'Inquisitor0',
  'Guidance':'Inquisitor0',
  'Light':'Inquisitor0',
  'Read Magic':'Inquisitor0',
  'Resistance':'Inquisitor0',
  'Stabilize':'Inquisitor0',
  'Virtue':'Inquisitor0',
  'Alarm':'Inquisitor1',
  'Bane':'Inquisitor1',
  'Bless':'Inquisitor1',
  'Bless Water':'Inquisitor1',
  'Cause Fear':'Inquisitor1',
  'Command':'Inquisitor1',
  'Comprehend Languages':'Inquisitor1',
  'Cure Light Wounds':'Inquisitor1',
  'Curse Water':'Inquisitor1',
  'Detect Chaos':'Inquisitor1',
  'Detect Evil':'Inquisitor1',
  'Detect Good':'Inquisitor1',
  'Detect Law':'Inquisitor1',
  'Detect Undead':'Inquisitor1',
  'Disguise Self':'Inquisitor1',
  'Divine Favor':'Inquisitor1',
  'Doom':'Inquisitor1',
  'Expeditious Retreat':'Inquisitor1',
  'Hide From Undead':'Inquisitor1',
  'Inflict Light Wounds':'Inquisitor1',
  'Magic Weapon':'Inquisitor1',
  'Protection From Chaos':'Inquisitor1',
  'Protection From Evil':'Inquisitor1',
  'Protection From Good':'Inquisitor1',
  'Protection From Law':'Inquisitor1',
  'Remove Fear':'Inquisitor1',
  'Sanctuary':'Inquisitor1',
  'Shield Of Faith':'Inquisitor1',
  'True Strike':'Inquisitor1',

  'Aid':'Inquisitor2',
  'Align Weapon':'Inquisitor2',
  'Calm Emotions':'Inquisitor2',
  'Consecrate':'Inquisitor2',
  'Cure Moderate Wounds':'Inquisitor2',
  'Darkness':'Inquisitor2',
  'Death Knell':'Inquisitor2',
  'Delay Poison':'Inquisitor2',
  'Desecrate':'Inquisitor2',
  'Detect Thoughts':'Inquisitor2',
  'Enthrall':'Inquisitor2',
  'Find Traps':'Inquisitor2',
  'Hold Person':'Inquisitor2',
  'Inflict Moderate Wounds':'Inquisitor2',
  'Invisibility':'Inquisitor2',
  'Knock':'Inquisitor2',
  'Remove Paralysis':'Inquisitor2',
  'Resist Energy':'Inquisitor2',
  'Lesser Restoration':'Inquisitor2',
  'See Invisibility':'Inquisitor2',
  'Shield Other':'Inquisitor2',
  'Silence':'Inquisitor2',
  'Spiritual Weapon':'Inquisitor2',
  'Tongues':'Inquisitor2',
  'Undetectable Alignment':'Inquisitor2',
  'Whispering Wind':'Inquisitor2',
  'Zone Of Truth':'Inquisitor2',

  'Arcane Sight':'Inquisitor3',
  'Continual Flame':'Inquisitor3',
  'Cure Serious Wounds':'Inquisitor3',
  'Daylight':'Inquisitor3',
  'Deeper Darkness':'Inquisitor3',
  'Dimensional Anchor':'Inquisitor3',
  'Dispel Magic':'Inquisitor3',
  'Glyph Of Warding':'Inquisitor3',
  'Halt Undead':'Inquisitor3',
  'Heroism':'Inquisitor3',
  'Inflict Serious Wounds':'Inquisitor3',
  'Invisibility Purge':'Inquisitor3',
  'Keen Edge':'Inquisitor3',
  'Locate Object':'Inquisitor3',
  'Magic Circle Against Chaos':'Inquisitor3',
  'Magic Circle Against Evil':'Inquisitor3',
  'Magic Circle Against Good':'Inquisitor3',
  'Magic Circle Against Law':'Inquisitor3',
  'Magic Vestment':'Inquisitor3',
  'Greater Magic Weapon':'Inquisitor3',
  'Nondetection':'Inquisitor3',
  'Obscure Object':'Inquisitor3',
  'Prayer':'Inquisitor3',
  'Protection From Energy':'Inquisitor3',
  'Remove Curse':'Inquisitor3',
  'Remove Disease':'Inquisitor3',
  'Searing Light':'Inquisitor3',
  'Speak With Dead':'Inquisitor3',

  'Chaos Hammer':'Inquisitor4',
  'Cure Critical Wounds':'Inquisitor4',
  'Death Ward':'Inquisitor4',
  'Detect Scrying':'Inquisitor4',
  'Discern Lies':'Inquisitor4',
  'Dismissal':'Inquisitor4',
  'Divination':'Inquisitor4',
  'Divine Power':'Inquisitor4',
  'Fear':'Inquisitor4',
  'Freedom Of Movement':'Inquisitor4',
  'Lesser Geas':'Inquisitor4',
  'Hold Monster':'Inquisitor4',
  'Holy Smite':'Inquisitor4',
  'Inflict Critical Wounds':'Inquisitor4',
  'Greater Invisibility':'Inquisitor4',
  'Neutralize Poison':'Inquisitor4',
  "Order's Wrath":'Inquisitor4',
  'Restoration':'Inquisitor4',
  'Sending':'Inquisitor4',
  'Spell Immunity':'Inquisitor4',
  'Stoneskin':'Inquisitor4',
  'Unholy Blight':'Inquisitor4',

  'Atonement':'Inquisitor5',
  'Banishment':'Inquisitor5',
  'Break Enchantment':'Inquisitor5',
  'Greater Command':'Inquisitor5',
  'Commune':'Inquisitor5',
  'Mass Cure Light Wounds':'Inquisitor5',
  'Dispel Chaos':'Inquisitor5',
  'Dispel Evil':'Inquisitor5',
  'Dispel Good':'Inquisitor5',
  'Dispel Law':'Inquisitor5',
  'Disrupting Weapon':'Inquisitor5',
  'Flame Strike':'Inquisitor5',
  'Geas/Quest':'Inquisitor5',
  'Hallow':'Inquisitor5',
  'Mass Inflict Light Wounds':'Inquisitor5',
  'Mark Of Justice':'Inquisitor5',
  'Righteous Might':'Inquisitor5',
  'Spell Resistance':'Inquisitor5',
  'Telepathic Bond':'Inquisitor5',
  'True Seeing':'Inquisitor5',
  'Unhallow':'Inquisitor5',

  'Blade Barrier':'Inquisitor6',
  'Blasphemy':'Inquisitor6',
  'Circle Of Death':'Inquisitor6',
  'Mass Cure Moderate Wounds':'Inquisitor6',
  'Dictum':'Inquisitor6',
  'Greater Dispel Magic':'Inquisitor6',
  'Find The Path':'Inquisitor6',
  'Forbiddance':'Inquisitor6',
  'Greater Glyph Of Warding':'Inquisitor6',
  'Harm':'Inquisitor6',
  'Heal':'Inquisitor6',
  "Heroes' Feast":'Inquisitor6',
  'Holy Word':'Inquisitor6',
  'Mass Inflict Moderate Wounds':'Inquisitor6',
  'Legend Lore':'Inquisitor6',
  'Repulsion':'Inquisitor6',
  'Undeath To Death':'Inquisitor6',
  'Word Of Chaos':'Inquisitor6'

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
      '"features.Order Of The Sword ? 15:Kight\'s Challenge" ' +
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
      '"1:Lame:Curse","1:Tongues:Curse","1:Wasting:Curse" ' +
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
  for(let path in paths)
    PathfinderSupplements.pathRulesExtra(rules, path);
  for(let race in races)
    PathfinderSupplements.raceRulesExtra(rules, race);
};

/* Defines rules related to magic use. */
PathfinderSupplements.magicRules = function(rules, spells, spellsLevels) {
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
      classLevel, '=', 'source>=10 ? "/Can understand " + (source>=15 ? "and speak " : "") + "any spoken language" : ""'
    );
    rules.defineRule('featureNotes.weaponMastery',
      classLevel, '=', 'source>=12 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule('featureNotes.weaponMastery.1',
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
  if(name.match(/Mystery/)) {
    rules.defineRule('selectableFeatureCount.' + name,
      'features.' + name, '?', null,
      'featureNotes.revelation', '=', null
    );
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
PathfinderSupplements.raceRulesExtra = function(rules, name) {
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

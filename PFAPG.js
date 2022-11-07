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
  console.log('aideRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.combatRules(rules, PFAPG.ARMORS, PFAPG.SHIELDS, PFAPG.WEAPONS);
  msAfter = new Date().getTime();
  console.log('combatRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.magicRules(rules, PFAPG.SPELLS, PFAPG.SPELLS_LEVELS_ADDED);
  msAfter = new Date().getTime();
  console.log('magicRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.talentRules
    (rules, PFAPG.FEATS, PFAPG.FEATURES, {}, PFAPG.LANGUAGES, PFAPG.SKILLS);
  msAfter = new Date().getTime();
  console.log('talentRules took ' + (msAfter - msBefore) + ' ms');
  msBefore = new Date().getTime();
  PFAPG.identityRules(
    rules, {}, PFAPG.CLASSES, PFAPG.DEITIES, {}, PFAPG.PATHS, PFAPG.RACES, {},
    PFAPG.TRAITS, PFAPG.PRESTIGES, {}
  );
  msAfter = new Date().getTime();
  console.log('identityRules took ' + (msAfter - msBefore) + ' ms');

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
PFAPG.FEATS = {
  'Additional Traits':'Type=General',
  'Arcane Blast':'Type=General Require=casterLevelArcane,"casterLevel >= 10"',
  'Arcane Shield':'Type=General Require=casterLevelArcane,"casterLevel >= 10"',
  'Arcane Talent':
    'Type=General Require="charisma >= 10","race =~ \'Elf|Gnome\'"',
  'Aspect Of The Beast':'Type=General Require="features.Wild Shape"',
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
  'Shield Of Swings':
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
PFAPG.FEATURES = {
  // Classes
  'Acid Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts acid damage instead of fire and additional 1d6 following round"',
  'Acid Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : source>=5 ? \'Resistance 10\' : \'Resistance 5\'} to acid"',
  'Act As One':
    'Section=combat ' +
    'Note="R30\' May grant move, +2 melee attack, and +2 AC to each ally 1/combat"',
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
    'Note="Successful attack causes %{(levels.Oracle+5)//5} HP bleeding each rd (DC 15 Heal or healing effect ends)"',
  'Blizzard':
    'Section=combat ' +
    'Note="%{levels.Oracle} 10\' cu inflict %{levels.Oracle}d4 HP cold (Ref half) and reduces vision to 5\' for %{charismaModifier} rd 1/dy"',
  'Bonded Mount':'Section=feature Note="Has mount animal companion"',
  'Braggart':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 attacks on demoralized target",' +
      '"Has Dazzling Display features"',
  'Brain Drain':
    'Section=feature ' +
    'Note="R100\' Mental probe inflicts %{levels.Oracle}d4 HP and yields single Knowledge check at target\'s bonus (Will neg) %{(levels.Oracle+5)//5}/dy"',
  'Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict full HP on hit and %{levels.Alchemist+1)//2+intelligenceModifier} HP (Ref half) splash %{levels.Alchemist + intelligenceModifier}/dy"',
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
  'Calling':
    'Section=feature,magic ' +
    'Note=' +
      '"May gain +%{charismaModifier} on chosen ability check, attack, save, or skill check within 1 min after prayer 4/dy",' +
      '"+%V %1"',
  'Cantrips':'Section=magic Note="May cast 0-level spells"',
  'Cavalier Feat Bonus':'Section=feature Note="Gain %V Fighter Feats"',
  "Cavalier's Charge":
    'Section=combat Note="+4 mounted melee attack; no AC penalty afterward"',
  'Challenge':
    'Section=combat ' +
    'Note="Gain +%{levels.Cavalier} HP damage on chosen foe and suffer -2 AC against other foes 1/dy"',
  'Channel':'Section=feature Note="Has Channel Energy feature"',
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
  'Eidolon Ability Increase':'Section=companion Note="+2 chosen ability"',
  'Eidolon Constrict':
    'Section=companion Note="Successful grapple doubles damage"',
  'Eidolon Energy Attacks':
    'Section=companion ' +
    'Note="Natural attacks inflict 1d6 HP of chosen energy Type"',
  'Eidolon Flight':'Section=companion Note="May fly at full speed"',
  'Eidolon Gore':'Section=companion Note="Horn attack inflicts %V HP"',
  'Eidolon Grab':
    'Section=companion ' +
    'Note="Successful chosen natural attack allows free CMB to grapple; +4 grapple CMB"',
  'Eidolon Immunity':'Section=companion Note="Immune to chosen energy type"',
  'Eidolon Limbs':'Section=companion Note="+%V limbs"',
  'Eidolon Poison':
    'Section=companion ' +
    'Note="Chosen natural attack inflicts +1d4 Str damage (DC %V Fort neg) 1/rd"',
  'Eidolon Rake':
    'Section=companion Note="Claw rake on grappled foe inflicts 2x%V HP"',
  'Eidolon Rend':
    'Section=companion Note="2 successful claw attacks inflicts %V+%1 HP"',
  'Eidolon Trample':'Section=companion Note="FILL"',
  'Eidolon Tremorsense':'Section=companion Note="FILL"',
  'Eidolon Trip':'Section=companion Note="FILL"',
  'Eidolon Weapon Training':'Section=companion Note="FILL"',
  'Eidolon Blindsense':'Section=companion Note="FILL"',
  'Eidolon Burrow':'Section=companion Note="FILL"',
  'Eidolon Damage Reduction':'Section=companion Note="FILL"',
  'Eidolon Frightful Presence':'Section=companion Note="FILL"',
  'Eidolon Swallow Whole':'Section=companion Note="FILL"',
  'Eidolon Web':'Section=companion Note="FILL"',
  'Eidolon Blindsight':'Section=companion Note="FILL"',
  'Eidolon Breath Weapon':'Section=companion Note="FILL"',
  'Eidolon Fast Healing':'Section=companion Note="FILL"',
  'Eidolon Large':'Section=companion Note="FILL"',
  'Eidolon Spell Resistance':'Section=companion Note="FILL"',
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
      '"Immune to bleed, death attacks, exhaustion, fatigue, nausea effects, negative levels, and sickened effects/Ability scores cannot be drained below 1/Automatic save vs. massive damage"',
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
    'Note="Trance of 1d6 rd gives +%{levels.Oracle} saves vs. sonic and gaze attacks and 1 +20 intelligence skill test %{charismaModifier}/dy"',
  'For The Faith':
    'Section=combat ' +
    'Note="R30\' May grant +%{charismaBonus>?1} to self attack and +%{charismaBonus//2>?1} to allies %{levels.Cavalier//4-1}/dy"',
  'For The King':
    'Section=combat ' +
    'Note="R30\' May give allies +%{charismaModifier} attack and damage for 1 rd"',
  'Force Bomb':
    'Section=combat ' +
    'Note="Bomb inflicts %{(levels.Alchemist+1)//2}d4 force damage instead of fire and knocks prone on hit (Ref neg)"',
  'Form Of Flame':
    'Section=magic ' +
    'Note="May use <i>Elemental Body %{levels.Oracle>= 13 ? \'IV\' : levels.Oracle>=11 ? \'III\' : levels.Oracle >= 9 ? \'II\' : \'I\'}</i> to become fire elemental for %{levels.Oracle} hr 1/dy"',
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
  'Grand Hex':'Section=feature Note="FILL"',
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
  'Haunted':
    'Section=feature,magic ' +
    'Note=' +
      '"Malevolent spirits cause minor annoyances",' +
      '"Know %V spells"',
  'Healing Hands':'Section=feature Note="FILL"',
  'Heat Aura':
    'Section=combat ' +
    'Note="R10\' Heat blast inflicts %{levels.Oracle>?1}d4 HP fire, gives self 20% concealment for 1 rd %{(levels.Oracle+5)//5}/dy"',
  'Heavens Mystery':
    'Section=skill ' +
    'Note="Fly is a class skill/Knowledge (Arcana) is a class skill/Perception is a class skill/Survival is a class skill"',
  'Hex':'Section=feature Note="FILL"',
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
  'Major Hex':'Section=feature Note="FILL"',
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
  'Molten Skin':
    'Section=save ' +
    'Note="%{levels.Oracle>=17 ? \'Immune\' : levels.Oracle>=11 ? \'Resistance 20\' : source>=5 ? \'Resistance 10\' : \'Resistance 5\'} to fire"',
  'Moment Of Triumph':
    'Section=feature ' +
    'Note="Automatically confirms critical threats and gains +%{charismaModifier} on ability checks, attacks, damage, saves, skillChecks, and AC 1/dy"',
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
      '"+4 AC vs. attacks set against mounted charge/Adds mount\'s strength modifier to charge damage",' +
      '"Gain 1 Order Of The Sword feat",' +
      '"No armor check penalty for Ride"',
  'Mutagen':
    'Section=magic ' +
    'Note="May brew and drink potion that gives +2 AC and +4/-2 to strength/intelligence, dexterity/wisdom, or constitution/charisma for %{levels.Alchemist*10} min"',
  'Mystery Spell':'Section=feature Note="FILL"',
  'Mystery':'Section=feature Note="1 Selection"',
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
  'Voice Of The Grave':
    'Section=magic Note="May <i>Speak With Dead</i> %{levels.Oracle} rd/dy%{levels.Oracle>=5 ? \', target -\' + (levels.Oracle//5*2) + \' to resist\' : \'\'}"',
  'Vortex Spells':
    'Section=magic ' +
    'Note="Successful critical hit with spell staggers target for 1%{levels.Oracle>=11 ? \'d4\' : \'\'} rd"',
  'War Sight':
    'Section=combat ' +
    'Note="May take choice of %{levels.Oracle>=11 ? 3 : 2} Initiative Rolls%{levels.Oracle>=7 ? \'/May always act in surprise round\' : \'\'}"',
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
  'Weapon Mastery':
    'Section=feature Note="+%V Feat Count (Weapon Focus%1 with chosen weapon)"',
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
  'Aspect Of The Beast':'Section=feature Note="FILL"',
  'Bashing Finish':
    'Section=combat Note="May make free shield bash after critical hit"',
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
  'Shield Of Swings':'Section=feature Note="FILL"',
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
  'Touch Of Serenity':'Section=feature Note="FILL"',
  'Trick Riding':'Section=feature Note="FILL"',
  'Tripping Strike':'Section=feature Note="FILL"',
  'Under and Over':'Section=feature Note="FILL"',
  'Underfoot':'Section=feature Note="FILL"',
  'Vermin Heart':'Section=feature Note="FILL"',
  'War Singer':'Section=feature Note="FILL"',
  'Well-Prepared':'Section=feature Note="FILL"',
};
PFAPG.LANGUAGES = {
};
PFAPG.PATHS = {
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
    'Level=D1,W1,Wind1 ' +
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
  'Aspect Of The Bear':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="FILL"',
  'Aspect Of The Falcon':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  'Aspect Of The Stag':
    'School=Transmutation ' +
    'Level=D4,R3 ' +
    'Description="FILL"',
  'Aspect Of The Wolf':
    'School=Transmutation ' +
    'Level=D5,R4 ' +
    'Description="FILL"',
  'Aura Of Greater Courage':
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
    'Level=D9,W9,Stone9 ' +
    'Description="FILL"',
  'Cleanse':
    'School=Evocation ' +
    'Level=C5,Inquisitor6 ' +
    'Description="FILL"',
  'Cloak Of Dreams':
    'School=Enchantment ' +
    'Level=B5,W6,Witch6 ' +
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
    'Level=W2,Summoner2 ' +
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
    'Level=W9,Flame9 ' +
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
    'Level=B5,W5 ' +
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
    'Level=D8,W8,Waves8 ' +
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
    'Level=D6,W60,Wind6 ' +
    'Description="FILL"',
  'Sleepwalk':
    'School=Enchantment ' +
    'Level=Inquisitor4,Witch4 ' +
    'Description="FILL"',
  'Slipstream':
    'School=Conjuration ' +
    'Level=D2,R2,W2,Waves2 ' +
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
    'Level=D9,W9,Waves9 ' +
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
    'Level=D9,W9,Nature9 ' +
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
  'Aid':'Inquisitor2',
  'Alarm':'Inquisitor1',
  'Align Weapon':'Inquisitor2',
  'Animal Shapes':'Nature8',
  'Animate Dead':'Bones3',
  'Arcane Sight':'Inquisitor3',
  'Atonement':'Inquisitor5',
  'Awaken':'Nature5',
  'Bane':'Inquisitor1',
  'Banishment':'Inquisitor5',
  'Barkskin':'Nature2',
  'Blade Barrier':'Inquisitor6',
  'Blasphemy':'Inquisitor6',
  'Bleed':'Inquisitor0',
  'Bless':'Inquisitor1',
  'Bless Water':'Inquisitor1',
  'Break Enchantment':'Inquisitor5',
  'Breath Of Life':'Life5',
  'Burning Hands':'Flame1',
  'Calm Emotions':'Inquisitor2',
  'Cause Fear':'Bones1,Inquisitor1',
  'Chain Lightning':'Heavens6',
  'Chaos Hammer':'Inquisitor4',
  'Charm Animal':'Nature1',
  'Circle Of Death':'Bones6,Inquisitor6',
  'Color Spray':'Heavens1',
  'Command':'Inquisitor1',
  'Commune':'Inquisitor5',
  'Comprehend Languages':'Inquisitor1',
  'Consecrate':'Inquisitor2',
  'Contact Other Plane':'Lore5',
  'Continual Flame':'Inquisitor3',
  'Control Undead':'Bones8',
  'Control Weather':'Battle7,Wind7',
  'Control Winds':'Wind5',
  'Create Water':'Inquisitor0',
  'Creeping Doom':'Nature7',
  'Cure Critical Wounds':'Inquisitor4',
  'Cure Light Wounds':'Inquisitor1',
  'Cure Moderate Wounds':'Inquisitor2',
  'Cure Serious Wounds':'Inquisitor3',
  'Curse Water':'Inquisitor1',
  'Darkness':'Inquisitor2',
  'Daylight':'Heavens3,Inquisitor3',
  'Daze':'Inquisitor0',
  'Death Knell':'Inquisitor2',
  'Death Ward':'Inquisitor4',
  'Deeper Darkness':'Inquisitor3',
  'Delay Poison':'Inquisitor2',
  'Desecrate':'Inquisitor2',
  'Detect Chaos':'Inquisitor1',
  'Detect Evil':'Inquisitor1',
  'Detect Good':'Inquisitor1',
  'Detect Law':'Inquisitor1',
  'Detect Magic':'Inquisitor0',
  'Detect Poison':'Inquisitor0',
  'Detect Scrying':'Inquisitor4',
  'Detect Thoughts':'Inquisitor2',
  'Detect Undead':'Inquisitor1,Life1',
  'Dictum':'Inquisitor6',
  'Dimensional Anchor':'Inquisitor3',
  'Discern Lies':'Inquisitor4',
  'Disguise Self':'Inquisitor1',
  'Dismissal':'Inquisitor4',
  'Dispel Chaos':'Inquisitor5',
  'Dispel Evil':'Inquisitor5',
  'Dispel Good':'Inquisitor5',
  'Dispel Law':'Inquisitor5',
  'Dispel Magic':'Inquisitor3',
  'Disrupt Undead':'Inquisitor0',
  'Disrupting Weapon':'Inquisitor5',
  'Divination':'Inquisitor4',
  'Divine Favor':'Inquisitor1',
  'Divine Power':'Inquisitor4',
  'Doom':'Inquisitor1',
  'Earthquake':'Battle8',
  'Enlarge Person':'Battle1',
  'Enthrall':'Inquisitor2',
  'Expeditious Retreat':'Inquisitor1',
  'False Life':'Bones2',
  'Fear':'Bones4,Inquisitor4',
  'Find The Path':'Inquisitor6',
  'Find Traps':'Inquisitor2',
  'Fire Seeds':'Flame6',
  'Fire Storm':'Flame7',
  'Fireball':'Flame3',
  'Flame Strike':'Inquisitor5',
  'Fog Cloud':'Battle2',
  'Forbiddance':'Inquisitor6',
  'Freedom Of Movement':'Inquisitor4',
  'Geas/Quest':'Inquisitor5',
  'Glyph Of Warding':'Inquisitor3',
  'Greater Command':'Inquisitor5',
  'Greater Dispel Magic':'Inquisitor6',
  'Greater Glyph Of Warding':'Inquisitor6',
  'Greater Invisibility':'Inquisitor4',
  'Greater Magic Weapon':'Inquisitor3',
  'Greater Restoration':'Life7',
  'Guidance':'Inquisitor0',
  'Gust Of Wind':'Wind2',
  'Hallow':'Inquisitor5',
  'Halt Undead':'Inquisitor3',
  'Harm':'Inquisitor6',
  'Heal':'Inquisitor6,Life6',
  "Heroes' Feast":'Inquisitor6',
  'Heroism':'Inquisitor3',
  'Hide From Undead':'Inquisitor1',
  'Hold Monster':'Inquisitor4',
  'Hold Person':'Inquisitor2',
  'Holy Smite':'Inquisitor4',
  'Holy Word':'Inquisitor6',
  'Horrid Wilting':'Bones8',
  'Hypnotic Pattern':'Heavens2',
  'Identify':'Lore1',
  'Incendiary Cloud':'Flame8',
  'Inflict Critical Wounds':'Inquisitor4',
  'Inflict Light Wounds':'Inquisitor1',
  'Inflict Moderate Wounds':'Inquisitor2',
  'Inflict Serious Wounds':'Inquisitor3',
  'Invisibility Purge':'Inquisitor3',
  'Invisibility':'Inquisitor2',
  'Keen Edge':'Inquisitor3',
  'Knock':'Inquisitor2',
  'Legend Lore':'Inquisitor6,Lore4',
  'Lesser Geas':'Inquisitor4',
  'Lesser Restoration':'Inquisitor2,Life2',
  'Light':'Inquisitor0',
  'Locate Object':'Inquisitor3,Lore3',
  'Magic Circle Against Chaos':'Inquisitor3',
  'Magic Circle Against Evil':'Inquisitor3',
  'Magic Circle Against Good':'Inquisitor3',
  'Magic Circle Against Law':'Inquisitor3',
  'Magic Stone':'Stone1',
  'Magic Vestment':'Battle3,Inquisitor3',
  'Magic Weapon':'Inquisitor1',
  'Mark Of Justice':'Inquisitor5',
  "Mass Bull's Strength":'Battle6',
  'Mass Cure Light Wounds':'Inquisitor5',
  'Mass Cure Moderate Wounds':'Inquisitor6',
  'Mass Heal':'Life8',
  'Mass Inflict Light Wounds':'Inquisitor5',
  'Mass Inflict Moderate Wounds':'Inquisitor6',
  "Mass Owl's Wisdom":'Lore6',
  'Meld Into Stone':'Stone3',
  'Meteor Swarm':'Heavens9',
  'Moment Of Prescience':'Lore8',
  'Neutralize Poison':'Inquisitor4,Life3',
  'Nondetection':'Inquisitor3',
  'Obscure Object':'Inquisitor3',
  "Order's Wrath":'Inquisitor4',
  'Overland Flight':'Heavens5',
  'Prayer':'Inquisitor3',
  'Prismatic Spray':'Heavens7',
  'Protection From Chaos':'Inquisitor1',
  'Protection From Energy':'Inquisitor3',
  'Protection From Evil':'Inquisitor1',
  'Protection From Good':'Inquisitor1',
  'Protection From Law':'Inquisitor1',
  'Rainbow Pattern':'Heavens4',
  'Read Magic':'Inquisitor0',
  'Remove Curse':'Inquisitor3',
  'Remove Disease':'Inquisitor3',
  'Remove Fear':'Inquisitor1',
  'Remove Paralysis':'Inquisitor2',
  'Repel Metal Or Stone':'Stone8',
  'Repulsion':'Inquisitor6',
  'Resist Energy':'Flame2,Inquisitor2',
  'Resistance':'Inquisitor0',
  'Restoration':'Inquisitor4,Life4',
  'Righteous Might':'Battle5,Inquisitor5',
  'Sanctuary':'Inquisitor1',
  'Searing Light':'Inquisitor3',
  'See Invisibility':'Inquisitor2',
  'Sending':'Inquisitor4',
  'Shield Of Faith':'Inquisitor1',
  'Shield Other':'Inquisitor2',
  'Silence':'Inquisitor2',
  'Slay Living':'Bones5',
  'Speak With Dead':'Inquisitor3',
  'Speak With Plants':'Nature3',
  'Spell Immunity':'Inquisitor4',
  'Spell Resistance':'Inquisitor5',
  'Spiritual Weapon':'Inquisitor2',
  'Stabilize':'Inquisitor0',
  'Statue':'Stone7',
  'Stone Tell':'Nature6,Stone6',
  'Stoneskin':'Inquisitor4,Stone5',
  'Storm Of Vengeance':'Battle9',
  'Summon Monster V':'Flame5',
  'Sunburst':'Heavens8',
  'Telepathic Bond':'Inquisitor5',
  'Time Stop':'Lore9',
  'Tongues':'Inquisitor2,Lore2',
  'True Resurrection':'Life9',
  'True Seeing':'Inquisitor5',
  'True Strike':'Inquisitor1',
  'Undeath To Death':'Inquisitor6',
  'Undetectable Alignment':'Inquisitor2',
  'Unhallow':'Inquisitor5',
  'Unholy Blight':'Inquisitor4',
  'Virtue':'Inquisitor0',
  'Vision':'Lore7',
  'Wail Of The Banshee':'Bones9',
  'Wall Of Fire':'Battle4,Flame4',
  'Wall Of Ice':'Waves4',
  'Wall Of Stone':'Stone4',
  'Water Breathing':'Waves3',
  'Whirlwind':'Wind8',
  'Whispering Wind':'Inquisitor2',
  'Word Of Chaos':'Inquisitor6',
  'Zone Of Truth':'Inquisitor2'
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
      '"1:Eidolon Ability Increase:Evolution",' +
      '"1:Eidolon Constrict:Evolution",' +
      '"1:Eidolon Energy Attacks:Evolution",' +
      '"1:Eidolon Flight:Evolution",' +
      '"1:Eidolon Gore:Evolution",' +
      '"1:Eidolon Grab:Evolution",' +
      '"1:Eidolon Immunity:Evolution",' +
      '"1:Eidolon Limbs:Evolution",' +
      '"1:Eidolon Poison:Evolution",' +
      '"1:Eidolon Rake:Evolution",' +
      '"1:Eidolon Rend:Evolution",' +
      '"1:Eidolon Trample:Evolution",' +
      '"1:Eidolon Tremorsense:Evolution",' +
      '"1:Eidolon Trip:Evolution",' +
      '"1:Eidolon Weapon Training:Evolution",' +
      '"1:Eidolon Blindsense:Evolution",' +
      '"1:Eidolon Burrow:Evolution",' +
      '"1:Eidolon Damage Reduction:Evolution",' +
      '"1:Eidolon Frightful Presence:Evolution",' +
      '"1:Eidolon Swallow Whole:Evolution",' +
      '"1:Eidolon Web:Evolution",' +
      '"1:Eidolon Blindsight:Evolution",' +
      '"1:Eidolon Breath Weapon:Evolution",' +
      '"1:Eidolon Fast Healing:Evolution",' +
      '"1:Eidolon Large:Evolution",' +
      '"1:Eidolon Spell Resistance:Evolution" ' +
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
PFAPG.PRESTIGES = {
};
PFAPG.DEITIES = {
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
  Pathfinder.identityRules(
    rules, alignments, classes, deities, factions, paths, races, tracks, traits,
    prestigeClasses, npcClasses
  );
  for(let clas in classes)
    PFAPG.classRulesExtra(rules, clas);
  for(let clas in prestigeClasses)
    PFAPG.classRulesExtra(rules, clas);
  for(let clas in npcClasses)
    PFAPG.classRulesExtra(rules, clas);
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
  } else if(name == 'Summoner') {
    rules.defineRule('companionMasterLevel', 'eliodonMasterLevel', '^=', null);
    rules.defineRule('companionNotes.eidolonBite',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonBite.1',
      'animalCompanionStats.Str', '=', 'Math.floor(((source - 10) / 2) * 1.5)'
    );
    rules.defineRule('companionNotes.eidolonClaws',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonClimb',
      'summonerFeatures.Eidolon Climb', '=', '20 * source'
    );
    rules.defineRule('companionNotes.eidolonGore',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonImprovedNaturalArmor',
      'summonerFeatures.Eidolon Improved Natural Armor', '=', '2 * source'
    );
    rules.defineRule('companionNotes.eidolonLimbs',
      'summonerFeatures.Eidolon Limbs', '=', '2 * source'
    );
    rules.defineRule('companionNotes.eidolonPincers',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "2d6" : source=="L" ? "1d8" : "1d6"'
    );
    rules.defineRule('companionNotes.eidolonPoison',
      'companionStats.HD', '=', '10 + Math.floor(source / 2)',
      'companionStats.Con', '+', 'Math.floor((source - 10) / 2)'
    );
    rules.defineRule('companionNotes.eidolonRake',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonRend',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('companionNotes.eidolonRend.1',
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
    rules.defineRule('companionNotes.eidolonWingBuffet',
      'animalCompanionStats.Size', '=',
        'source=="H" ? "1d8" : source=="L" ? "1d6" : "1d4"'
    );
    rules.defineRule('eidolonStats.AC',
      'companionNotes.eidolonImprovedNaturalArmor', '+', null
    );
    rules.defineRule('eliodonMasterLevel', classLevel, '=', null);
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
    rules.defineRule('eidolonStats.Str', 'eilodonStats.Dex', '=', null);
    ['AC', 'BAB', 'Dex', 'Feats', 'HD', 'Skills', 'Str'].forEach(stat => {
      rules.defineRule
        ('animalCompanionStats.' + stat, 'eilodonStats.' + stat, '+', null);
    });
    let features = [
      '1:Companion Darkvision', '1:Link', '1:Share Spells',
      '2:Companion Evasion', '5:Devotion', '7:Multiattack',
      '11:Companion Improved Evasion'
    ];
    QuilvynRules.featureListRules
      (rules, features, 'Animal Companion', 'eliodonMasterLevel', false);
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
  }
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
PFAPG.featRulesExtra = function(rules, name) {
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

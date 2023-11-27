/*
Copyright 2023, James J. Hayes

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

  PFAPG.aideRules(rules, PFAPG.ANIMAL_COMPANIONS, PFAPG.FAMILIARS);
  PFAPG.combatRules(rules, PFAPG.ARMORS, PFAPG.SHIELDS, PFAPG.WEAPONS);
  PFAPG.magicRules
    (rules, PFAPG.SCHOOLS, PFAPG.SPELLS, PFAPG.SPELLS_LEVELS_ADDED);
  PFAPG.talentRules(rules, PFAPG.FEATS, PFAPG.FEATURES, {}, {}, {});
  PFAPG.identityRules(
    rules, {}, PFAPG.CLASSES, PFAPG.DEITIES, {}, PFAPG.PATHS, PFAPG.RACES, {},
    PFAPG.TRAITS, PFAPG.PRESTIGE_CLASSES, PFAPG.NPC_CLASSES
  );

  for(let c in PFAPG.CLASSES) {
    QuilvynUtils.getAttrValueArray(PFAPG.CLASSES[c], 'Selectables').forEach(s=>{
      if(s.match(/:Archetype|:Mystery|:Order|:Patron/)) {
        rules.defineChoice
          ('subclasses', c + ' - ' + s.replace(/^\d+:/, '').replace(/:.*/, ''));
      }
    });
  }

  rules.defineChoice('preset', 'selectableFeatures:Subclass,set,subclasses');
  rules.randomizeOneAttribute = PFAPG.randomizeOneAttribute;

}

PFAPG.VERSION = '2.4.1.1';

PFAPG.ANIMAL_COMPANIONS = {
  // Eidolons share stats w/animal companions with modified calculations.
  // Damage is calculated from evolutions.
  'Biped Eidolon':
    'Str=16 Dex=12 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=13 Attack=3 Dam=0 ' +
    'Size=M Speed=20', // Save F/R/W: G/B/G
  'Quadruped Eidolon':
    'Str=14 Dex=14 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=14 Attack=2 Dam=0 ' +
    'Size=M Speed=20', // Save F/R/W: G/G/B
  'Serpentine Eidolon':
    'Str=12 Dex=16 Con=13 Int=7 Wis=10 Cha=11 HD=0 AC=15 Attack=1 Dam=0 ' +
    'Size=M Speed=20' // Save F/R/W: B/G/G
};
PFAPG.ARMORS = {
  'Agile Breastplate':'AC=6 Weight=Medium Dex=3 Skill=4 Spell=25',
  'Agile Half-Plate':'AC=8 Weight=Medium Dex=0 Skill=7 Spell=40',
  'Armored Coat':'AC=4 Weight=Medium Dex=3 Skill=2 Spell=20',
  'Quilted Cloth':'AC=1 Weight=Light Dex=8 Skill=0 Spell=10',
  'Wooden':'AC=3 Weight=Light Dex=3 Skill=1 Spell=15'
};
PFAPG.FAMILIARS = {
  // Attack, Dam, AC include all modifiers
  'Centipede':
    'Str=1 Dex=17 Con=10 Int=0 Wis=10 Cha=2 HD=1 AC=17 Attack=5 Dam=1d3-5 ' +
    'Size=T',
  'Crab':
    'Str=7 Dex=15 Con=12 Int=0 Wis=10 Cha=2 HD=1 AC=18 Attack=0 Dam=2@1d2-2 ' +
    'Size=T',
  // Dog + young: Size -1 (AC, Attack +1) Dam -1 die step Str -4 Con -4 Dex +4
  'Fox':
    'Str=9 Dex=17 Con=11 Int=2 Wis=12 Cha=6 HD=1 AC=14 Attack=4 Dam=1d3+1 ' +
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
    'Type=General ' +
    'Require=' +
      '"features.Wild Shape || rangerFeatures.Combat Style (Natural Weapon)"',
  'Aspect Of The Beast (Night Senses)':
    'Type=General ' +
    'Require=' +
      '"features.Wild Shape || rangerFeatures.Combat Style (Natural Weapon)"',
  "Aspect Of The Beast (Predator's Leap)":
    'Type=General ' +
    'Require=' +
      '"features.Wild Shape || rangerFeatures.Combat Style (Natural Weapon)"',
  'Aspect Of The Beast (Wild Instinct)':
    'Type=General ' +
    'Require=' +
      '"features.Wild Shape || rangerFeatures.Combat Style (Natural Weapon)"',
  'Bashing Finish':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Improved Shield Bash",' +
      '"features.Shield Master",' +
      '"features.Two-Weapon Fighting",' +
      '"baseAttack >= 11"',
  'Bloody Assault':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttack >= 6"',
  'Bodyguard':'Type=General,Fighter Require="features.Combat Reflexes"',
  "In Harm's Way":'Type=General,Fighter Require="features.Bodyguard"',
  // Also, age >= 100
  'Breadth Of Experience':
    'Type=General ' +
    // Allow Elf subraces; disallow Half-Elf
    'Require="race =~ \'Dwarf|^Elf| Elf|Gnome\'"',
  'Bull Rush Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"strength >= 13",' +
      '"features.Improved Bull Rush",' +
      '"features.Power Attack",' +
      '"baseAttack >= 9"',
  'Charge Through':
    'Type=General,Fighter ' +
    'Require=' +
      '"strength >= 13",' +
      '"features.Improved Overrun",' +
      '"features.Power Attack",' +
      '"baseAttack >= 1"',
  'Childlike':'Type=General Require="charisma >= 13","race =~ \'Halfling\'"',
  'Cockatrice Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Improved Unarmed Strike",' +
      '"features.Gorgon\'s Fist",' +
      '"features.Medusa\'s Wrath",' +
      '"baseAttack >= 14"',
  'Combat Patrol':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Combat Reflexes",' +
      'features.Mobility,' +
      '"baseAttack >= 5"',
  'Cooperative Crafting':
    'Type=General ' +
    'Require="Sum \'skills.Craft\' > 0","sumItemCreationFeats > 0"',
  'Cosmopolitan':'Type=General',
  'Covering Defense':
    'Type=General,Fighter ' +
    'Require="features.Shield Focus","baseAttack >= 6" ' +
    'Imply="shield =~ \'Light|Heavy|Tower\'"',
  'Crippling Critical':
    'Type=General,Fighter ' +
    'Require="features.Critical Focus","baseAttack >= 13"',
  'Crossbow Mastery':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 15",' +
      '"features.Point-Blank Shot",' +
      '"Sum \'features.Rapid Reload\' > 0",' +
      '"features.Rapid Shot"',
  'Dastardly Finish':'Type=General,Fighter Require="sneakAttack >= 5"',
  'Dazing Assault':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttack >= 11"',
  'Deep Drinker':
    'Type=General ' +
    'Require="constitution >= 13","levels.Monk >= 11","features.Drunken Ki"',
  'Deepsight':'Type=General Require="features.Darkvision"',
  'Disarming Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Disarm",' +
      '"baseAttack >= 9"',
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
    'Type=General,Fighter ' +
    'Require=' +
      '"strength >= 15",' +
      '"weapons.Bite || weapons.Claws",' +
      '"baseAttack >= 6"',
  'Elemental Fist':
    'Type=General,Fighter ' +
    'Require=' +
      '"constitution >= 13",' +
      '"wisdom >= 13",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttack >= 8"',
  'Elemental Focus (Acid)':'Type=General Imply="casterLevel >= 1"',
  'Elemental Focus (Cold)':'Type=General Imply="casterLevel >= 1"',
  'Elemental Focus (Electricity)':'Type=General Imply="casterLevel >= 1"',
  'Elemental Focus (Fire)':'Type=General Imply="casterLevel >= 1"',
  'Greater Elemental Focus (Acid)':
    'Type=General ' +
    'Require="features.Elemental Focus (Acid)" ' +
    'Imply="casterLevel >= 1"',
  'Greater Elemental Focus (Cold)':
    'Type=General ' +
    'Require="features.Elemental Focus (Cold)" ' +
    'Imply="casterLevel >= 1"',
  'Greater Elemental Focus (Electricity)':
    'Type=General ' +
    'Require="features.Elemental Focus (Electricity)" ' +
    'Imply="casterLevel >= 1"',
  'Greater Elemental Focus (Fire)':
    'Type=General ' +
    'Require="features.Elemental Focus (Fire)" ' +
    'Imply="casterLevel >= 1"',
  'Elven Accuracy':
    'Type=General,Fighter ' +
    // Allow Elf subraces; disallow Half-Elf
    'Require="race =~ \'^Elf| Elf\'"',
  'Enforcer':'Type=General,Fighter Require=skills.Intimidate',
  'Expanded Arcana':'Type=General Require="casterLevel >= 1"',
  'Extra Bombs':'Type=General Require=features.Bomb',
  'Extra Discovery':'Type=General Require=features.Discovery',
  'Extra Hex':'Type=General Require=features.Hex',
  'Extra Rage Power':'Type=General Require="features.Rage Powers"',
  'Extra Revelation':'Type=General Require=features.Revelation',
  'Extra Rogue Talent':'Type=General Require="features.Rogue Talents"',
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
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Point-Blank Shot",' +
      '"features.Precise Shot"',
  'Following Step':
    'Type=General,Fighter Require="dexterity >= 13","features.Step Up"',
  'Step Up And Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"features.Following Step",' +
      '"features.Step Up",' +
      '"baseAttack >= 6"',
  'Furious Focus':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttack >= 1"',
  'Dreadful Carnage':
    'Type=General,Fighter ' +
    'Require=' +
      '"strength >= 15",' +
      '"features.Power Attack",' +
      '"features.Furious Focus",' +
      '"baseAttack >= 11"',
  'Gang Up':
    'Type=General,Fighter ' +
    'Require="intelligence >= 13","features.Combat Expertise"',
  'Team Up':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Gang Up",' +
      '"baseAttack >= 6"',
  'Gnome Trickster':
    'Type=General ' +
    'Require="charisma >= 13","race =~ \'Gnome\'","features.Gnome Magic"',
  'Go Unnoticed':'Type=General Require="dexterity >= 13",features.Small',
  'Groundling':
    'Type=General ' +
    'Require="charisma >= 13","race =~ \'Gnome\'","features.Gnome Magic"',
  'Heroic Defiance':
    'Type=General ' +
    'Require=features.Diehard,features.Endurance,"save.Fortitude >= 8"',
  'Heroic Recovery':
    'Type=General ' +
    'Require=features.Diehard,features.Endurance,"save.Fortitude >= 4"',
  'Improved Blind-Fight':
    'Type=General,Fighter ' +
     'Require="skills.Perception >= 10",features.Blind-Fight',
  'Greater Blind-Fight':
    'Type=General,Fighter ' +
    'Require="skills.Perception >= 15","features.Improved Blind-Fight"',
  'Improved Dirty Trick':
    'Type=General,Fighter ' +
    'Require="intelligence >= 13","features.Combat Expertise"',
  'Greater Dirty Trick':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Dirty Trick",' +
      '"baseAttack >= 6"',
  'Improved Drag':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttack >= 1"',
  'Greater Drag':
    'Type=General,Fighter ' +
    'Require=' +
      '"strength >= 13",' +
      '"features.Improved Drag",' +
      '"features.Power Attack",' +
      '"baseAttack >= 6"',
  'Improved Reposition':
    'Type=General,Fighter ' +
    'Require="intelligence >= 13","features.Combat Expertise"',
  'Greater Reposition':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13","features.Improved Reposition","baseAttack >= 6"',
  'Improved Share Spells':
    'Type=General ' +
    'Require=' +
      '"skills.Spellcraft >= 10",' +
      '"features.Animal Companion || features.Familiar" ' +
    'Imply="casterLevel >= 1"',
  'Improved Steal':
    'Type=General,Fighter ' +
    'Require="intelligence >= 13","features.Combat Expertise"',
  'Greater Steal':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Steal",' +
      '"baseAttack >= 6"',
  'Improved Stonecunning':
    'Type=General ' +
    'Require="wisdom >= 13","race =~ \'Dwarf\'",features.Stonecunning',
  'Stone Sense':
    'Type=General ' +
    'Require="features.Improved Stonecunning","skills.Perception >= 10"',
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
      // Allow Elf subraces; disallow Half-Elf
      '"race =~ \'^Elf| Elf\'"',
  'Lingering Performance':'Type=General Require="features.Bardic Performance"',
  'Low Profile':'Type=General,Fighter Require="dexterity >= 13",features.Small',
  'Lucky Halfling':'Type=General Require="race =~ \'Halfling\'"',
  'Master Alchemist':'Type=General Require="skills.Craft (Alchemy) >= 5"',
  'Minor Spell Expertise':'Type=General Require="maxSpellLevel >= 4"',
  'Major Spell Expertise':
    'Type=General ' +
    'Require=' +
      '"features.Minor Spell Expertise",' +
      '"maxSpellLevel >= 9"',
  'Missile Shield':
    'Type=General,Fighter ' +
    'Require="dexterity >= 13","features.Shield Focus" ' +
    'Imply="shield =~ \'Light|Heavy|Tower\'"',
  'Ray Shield':
    'Type=General,Fighter ' +
    'Require="dexterity >= 15","features.Missile Shield",features.Spellbreaker',
  'Mounted Shield':
    'Type=General,Fighter ' +
    'Require="features.Mounted Combat","features.Shield Focus" ' +
    'Imply="shield != \'None\'"',
  'Parry Spell':
    'Type=General ' +
    'Require="skills.Spellcraft >= 15","features.Improved Counterspell" ' +
    'Imply="casterLevel >= 1"',
  'Parting Shot':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      'features.Dodge,' +
      'features.Mobility,' +
      '"features.Point-Blank Shot",' +
      '"features.Shot On The Run",' +
      '"baseAttack >= 6"',
  'Pass For Human':
    'Type=General ' +
    'Require="race =~ \'Half-Elf|Half-Orc\' || features.Childlike"',
  'Perfect Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 13",' +
      '"wisdom >= 13",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttack >= 8"',
  'Point-Blank Master':
    'Type=General,Fighter Require="rangedWeaponSpecialization > 0"',
  'Practiced Tactician':'Type=General Require=features.Tactician',
  'Preferred Spell':
    'Type=General ' +
    'Require="skills.Spellcraft >= 5","features.Heighten Spell" ' +
    'Imply="casterLevel >= 1"',
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
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Reposition",' +
      '"baseAttack >= 9"',
  'Saving Shield':
    'Type=General,Fighter ' +
    'Require="features.Shield Proficiency" ' +
    'Imply="shield =~ \'Light|Heavy|Tower\'"',
  'Second Chance':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"baseAttack >= 6"',
  'Improved Second Chance':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Second Chance",' +
      '"baseAttack >= 11"',
  'Shadow Strike':'Type=General,Fighter Require="baseAttack >= 1"',
  'Shared Insight':'Type=General Require="wisdom >= 13","race == \'Half-Elf\'"',
  'Sharp Senses':'Type=General Require="features.Keen Senses"',
  'Shield Of Swings':
    'Type=General,Fighter ' +
    'Require="strength >= 13","features.Power Attack","baseAttack >= 1"',
  'Shield Specialization (Buckler)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Shield Proficiency",' +
      '"features.Shield Focus",' +
      '"levels.Fighter >= 4"',
  'Shield Specialization (Heavy)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Shield Proficiency",' +
      '"features.Shield Focus",' +
      '"levels.Fighter >= 4"',
  'Shield Specialization (Light)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Shield Proficiency",' +
      '"features.Shield Focus",' +
      '"levels.Fighter >= 4"',
  'Shield Specialization (Tower)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Tower Shield Proficiency",' +
      '"features.Shield Focus",' +
      '"levels.Fighter >= 4"',
  'Greater Shield Specialization (Buckler)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Shield Proficiency",' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization (Buckler)",' +
      '"levels.Fighter >= 12"',
  'Greater Shield Specialization (Heavy)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Shield Proficiency",' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization (Heavy)",' +
      '"levels.Fighter >= 12"',
  'Greater Shield Specialization (Light)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Shield Proficiency",' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization (Light)",' +
      '"levels.Fighter >= 12"',
  'Greater Shield Specialization (Tower)':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Tower Shield Proficiency",' +
      '"features.Greater Shield Focus",' +
      '"features.Shield Specialization (Tower)",' +
      '"levels.Fighter >= 12"',
  'Sidestep':
    'Type=General,Fighter ' +
    'Require="dexterity >= 13",features.Dodge,features.Mobility',
  'Improved Sidestep':
    'Type=General,Fighter ' +
    'Require=' +
      '"dexterity >= 15",' +
      'features.Dodge,' +
      'features.Mobility,' +
      'features.Sidestep',
  'Smash':
    'Type=General,Fighter ' +
    'Require="features.Power Attack","race == \'Half-Orc\'"',
  'Sociable':'Type=General Require="charisma >= 13","race == \'Half-Elf\'"',
  'Spell Perfection':
    'Type=General ' +
    'Require="skills.Spellcraft >= 15","sumMetamagicFeats >= 3"' +
    'Imply="casterLevel >= 1"',
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
    'Require="strength >= 13","features.Power Attack","baseAttack >= 16"',
  "Summoner's Call":'Type=General Require=features.Eidolon',
  'Sundering Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"strength >= 13",' +
      '"features.Improved Sunder",' +
      '"features.Power Attack",' +
      '"baseAttack >= 9"',
  'Swift Aid':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"baseAttack >= 6"',
  'Taunt':'Type=General Require="charisma >= 13",features.Small',
  'Teleport Tactician':
    'Type=General,Fighter ' +
    'Require=' +
      '"features.Combat Reflexes",' +
      'features.Disruptive,' +
      'features.Spellbreaker',
  'Tenacious Transmutation':
    'Type=General ' +
    'Require="features.Spell Focus (Transmutation)" ' +
    'Imply="casterLevel >= 1"',
  'Touch Of Serenity':
    'Type=General,Fighter ' +
    'Require=' +
      '"wisdom >= 18",' +
      '"features.Improved Unarmed Strike",' +
      '"baseAttack >= 8"',
  'Trick Riding':
    'Type=General,Fighter Require="skills.Ride >= 9","features.Mounted Combat"',
  'Mounted Skirmisher':
    'Type=General,Fighter ' +
    'Require=' +
      '"skills.Ride >= 14",' +
      '"features.Mounted Combat",' +
      '"features.Trick Riding"',
  'Tripping Strike':
    'Type=General,Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"features.Combat Expertise",' +
      '"features.Improved Trip",' +
      '"baseAttack >= 9"',
  'Under And Over':
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
  'Duck And Cover':'Type=Teamwork',
  'Lookout':'Type=Teamwork,Fighter',
  'Outflank':'Type=Teamwork,Fighter Require="baseAttack >= 4"',
  'Paired Opportunists':'Type=Teamwork,Fighter',
  'Precise Strike':
    'Type=Teamwork,Fighter Require="dexterity >= 13","baseAttack >= 1"',
  'Shield Wall':'Type=Teamwork,Fighter Require="features.Shield Proficiency"',
  'Shielded Caster':'Type=Teamwork Imply="casterLevel >= 1"',
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
    'Section=skill ' +
    'Note="+2 Knowledge (History) (dwarves and dwarven enemies); may use untrained"',
  'Magic Resistant':
    'Section=magic,save ' +
    'Note=' +
      '"-2 arcane spell concentration",' +
      '"SR %{level+5}"',
  'Relentless':
    'Section=combat ' +
    'Note="+2 CMB to bull rush and overrun when standing on ground"',
  'Stonesinger':
    'Section=magic Note="+1 caster level on earth and stone spells"',
  'Stubborn':
    'Section=save ' +
    'Note="+2 Will vs. charm and compulsion; may retry save 1 rd after failing"',

  // Elf
  'Desert Runner':
    'Section=save ' +
    'Note="+4 Constitution and Fortitude vs. fatigue, exhaustion, and effects from running, forced marches, starvation, thirst, and hot and cold environments"',
  'Dreamspeaker':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Spell DC (Divination)",' +
      '"+1 <i>Sleep</i> DC%{charisma>=15 ? \'/May cast <i>Dream</i> 1/dy\' : \'\'}"',
  'Eternal Grudge':'Section=combat Note="+1 attack vs. dwarves and orcs"',
  'Lightbringer':
    'Section=magic,save ' +
    'Note=' +
      '"+1 caster level on light-based spells and abilities%{intelligence>=10 ? \'/May cast <i>Light</i> at will</i>\' : \'\'}",' +
      '"Immune to light-based blindness and dazzle"',
  'Silent Hunter':
    'Section=skill ' +
    'Note="Reduces moving Stealth penalty by 5/May use -20 Stealth while running"',
  'Spirit Of The Waters':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"Weapon Proficiency (Longspear/Net/Trident)",' +
      '"+4 Swim",' +
      '"May take 10 while swimming/May learn Aquan"',
  'Woodcraft':
    'Section=skill,skill ' +
    'Note=' +
      '"+1 Knowledge (Nature)/+1 Survival",' +
      '"+1 Knowledge (Nature) (forests)/+1 Survival (forests)"',

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
      '"+1 save DC on language-dependent and magical writing spells%{charisma>=11 ? \'/May cast <i>Arcane Mark</i>, <i>Comprehend Languages</i>, <i>Message</i>, and <i>Read Magic</i> 1/dy\' : \'\'}",' +
      '"+2 vs. language-dependent and magical writing spells"',
  'Master Tinker':
    'Section=combat,skill ' +
    'Note=' +
      '"Proficient with any self-made weapon",' +
      '"+1 Disable Device/+1 Knowledge (Engineering)"',
  'Pyromaniac':
    'Section=combat,magic ' +
    'Note=' +
      '"+1 alchemist level for bomb fire damage",' +
      '"+1 caster level on fire and flame spells%{charisma>=11 ? \'/May cast <i>Dancing Lights</i>, <i>Flare</i>, <i>Prestidigitation</i>, and <i>Produce Flame</i> 1/dy\' : \'\'}"',
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
    'Note="May retry Diplomacy to change attitude after failing by 5 or more"',
  'Water Child':
      'Section=skill,skill ' +
      'Note=' +
        '"+4 Swim",' +
        '"May take 10 while swimming/May learn Aquan"',

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
    'Note="Weapon Proficiency (Flail/Heavy Flail)/Weapon Familiarity (Dire Flail/Spiked Chain)"',
  'Gatecrasher':
    'Section=combat Note="+2 Strength checks to break objects/+2 Sunder CMB"',
  'Plagueborn':
    'Section=save ' +
    'Note="+2 vs. disease, ingested poison, nauseated, and sickened"',
  'Rock Climber':'Section=skill Note="+1 Acrobatics/+1 Climb"',
  'Sacred Tattoo':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Scavenger':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Appraise",' +
      '"+2 Perception (find hidden objects, note spoiled food, identify poison by taste)"',
  'Toothy':'Section=combat Note="Bite inflicts 1d4 HP piercing"',

  // Halfling
  'Craven':
    'Section=ability,combat,combat,save ' +
    'Note=' +
      '"+10 Speed when fearful",' +
      '"+1 Initiative",' +
      '"+1 attack when flanking/+1 AC when fearful",' +
      '"-2 vs. fear/No morale bonus on fear saves"',
  'Low Blow':'Section=combat Note="+1 crit confirm on larger foe"',
  'Outrider':'Section=skill Note="+2 Handle Animal/+2 Ride"',
  'Practicality':
    'Section=save,skill,skill ' +
    'Note=' +
      '"+2 vs. illusions",' +
      '"+2 Sense Motive",' +
      '"+2 choice of Craft or Profession"',
  'Swift As Shadows':
    'Section=skill ' +
    'Note="Reduces penalty for moving Stealth by 5, sniping Stealth by 10"',
  'Underfoot (Halfling)':
    'Section=combat,save ' +
    'Note=' +
      '"+1 AC vs. larger foes",' +
      '"+1 Reflex vs. trample"',
  'Wanderlust':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 caster level on movement spells and abilities",' +
      '"+2 Knowledge (Geography)/+2 Survival"',
  'Warslinger':'Section=combat Note="May reload a sling as a free action"',

  // Human
  'Eye For Talent':
    'Section=companion,skill ' +
    'Note=' +
      '"Animal companion, bonded mount, cohort, or familiar gains +2 on choice of ability",' +
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
      '"+5 stabilization checks/Does not die until -%{constitution+level//2} HP",' +
      '"+%V Survival"',

  // Alchemist
  'Acid Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict acid damage instead of fire; a direct hit inflicts an additional 1d6 HP acid the next round"',
  'Alchemy':
    'Section=magic,skill,skill ' +
    'Note=' +
      '"May infuse extracts that duplicate spell effects on self for 1 dy",' +
      '"+%V Craft (Alchemy)",' +
      '"May use Craft (Alchemy) to identify potions"',
  'Awakened Intellect':'Section=ability Note="+2 Intelligence"',
  'Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict %{bombDamageDice}+%{intelligenceModifier} HP fire on hit and %{effectiveAlchemistLevel+1)//2+intelligenceModifier} HP fire splash (DC %{10+levels.Alchemist//2+intelligenceModifier} Ref half) %V/dy"',
  // 'Brew Potion' in SRD35.js
  'Combine Extracts':
    'Section=magic ' +
    'Note="May spend +2 formula slot to combine two formulas into one extract"',
  'Concentrate Poison':
    'Section=feature ' +
    'Note="1 min process combines two poison doses; result yields +50% frequency and +2 save DC when used within 1 hr"',
  'Concussive Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict %{(effectiveAlchemistLevel+1)//2}d4 HP sonic instead of fire; a direct hit deafens for 1 min (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort neg)"',
  'Delayed Bomb':
    'Section=combat ' +
    'Note="May configure bombs to explode after up to %{levels.Alchemist} rd (<i>Dispel Magic</i> or DC %{10+levels.Alchemist+intelligenceModifier} Disable Device neg)"',
  'Dilution':
    'Section=magic Note="May split potion or elixir into two doses 1/dy"',
  'Discovery':'Section=feature Note="%V selections"',
  'Dispelling Bomb':
    'Section=magic ' +
    'Note="May create bombs that inflict <i>Dispel Magic</i> effects on hit instead of damage"',
  'Elixir Of Life':
    'Section=magic ' +
    'Note="1 hr process create elixirs that act as <i>True Resurrection</i> or as a readied self <i>Resurrection</i> for %{intelligenceModifier} dy 1/dy"',
  'Enhance Potion':
    'Section=magic ' +
    'Note="May cause imbibed potion to function at caster level %{levels.Alchemist} %{intelligenceModifier}/dy"',
  'Eternal Potion':
     'Section=magic ' +
     'Note="May make effects of 1 imbibed extended potion permanent"',
  'Eternal Youth':
    'Section=ability Note="Suffers no ability score penalties from age"',
  'Explosive Bomb':
    'Section=combat ' +
    'Note="Direct hit from bomb inflicts additional 1d6 HP fire/rd until extinguished; splash extends 10\'"',
  'Extend Potion':
     'Section=magic ' +
     'Note="May double duration of imbibed potion %{intelligenceModifier}/dy"',
  'Fast Bombs':
    'Section=combat ' +
    'Note="May use a full-attack action to throw multiple bombs per rd"',
  'Fast Healing':'Section=combat Note="Regains %V HP/rd"',
  'Feral Mutagen':
    'Section=magic ' +
    'Note="Mutagen gives 2 claw attacks for 1d%V HP each, 1 bite attack for 1d%1 HP damage, and +2 Intimidate"',
  'Force Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict %{(effectiveAlchemistLevel+1)//2}d4 HP force instead of fire; a direct hit knocks prone (DC %{10+levels.Alchemist//2+intelligenceModifier} Ref neg)"',
  'Frost Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict cold damage instead of fire; a direct hit staggers (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort neg)"',
  'Grand Discovery':
    'Section=feature Note="1 selection/+2 Discovery selections"',
  'Grand Mutagen':
    'Section=magic ' +
    'Note="Mutagen gives +6 AC and +8/+6/+4 to choices of Strength, Dexterity, and Constitution and -2 to Intelligence, Wisdom, and Charisma for %{effectiveAlchemistLevel*10} min"',
  'Greater Mutagen':
    'Section=magic ' +
    'Note="Mutagen gives +4 AC and +6/-2 and +4/-2 to Strength/Intelligence, Dexterity/Wisdom, or Constitution/Charisma for %{effectiveAlchemistLevel*10} min"',
  'Inferno Bomb':
    'Section=combat ' +
    'Note="May create bombs that obscure vision and inflict 6d6 HP fire in dbl splash radius (DC %{10+levels.Alchemist//2+intelligenceModifier} Ref half) for %{levels.Alchemist} rd"',
  'Infuse Mutagen':
     'Section=magic ' +
     'Note="May retain multiple mutagens; suffers -2 Intelligence per additional mutagen"',
  'Infusion':
    'Section=magic ' +
    'Note="Created extracts persist when not held and may be used by others"',
  'Instant Alchemy':
    'Section=combat,magic ' +
    'Note=' +
      '"May apply poison to a weapon as an immediate action",' +
      '"May create alchemical items as a full-round action"',
  'Madness Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict 1d4 points of Wisdom damage, reducing fire damage by 2d6 HP"',
  'Mutagen':
    'Section=magic ' +
    'Note="1 hr process creates potions that give self +2 AC and +4/-2 to Strength/Intelligence, Dexterity/Wisdom, or Constitution/Charisma for %V min"',
  'Persistent Mutagen':
    'Section=magic Note="Mutagen effects last %{effectiveAlchemistLevel} hr"',
  "Philosopher's Stone":
    'Section=magic ' +
    'Note="1 dy process creates stones that turn base metals into silver and gold and can be used for <i>True Resurrection</i> effects"',
  'Poison Bomb':
    'Section=combat ' +
    'Note="May create bombs that kill creatures up to 6 HD (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort 1d4 Constitution damage for 4-6 HD) and inflict 1d4 Constitution damage on higher HD creatures (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort half) in dbl splash radius for %{levels.Alchemist} rd"',
  'Poison Resistance':'Section=save Note="%V to poison"',
  'Poison Touch':
    'Section=combat ' +
    'Note="Touch inflicts 1d3 Constitution damage/rd for 6 rd (DC %{10+levels.Alchemist//2+intelligenceModifier} Constitution neg)"',
  // 'Poison Use' in Pathfinder.js
  'Precise Bombs':
    'Section=combat ' +
    'Note="May specify %{intelligenceModifier} squares in bomb splash radius that are unaffected"',
  'Shock Bomb':
    'Section=combat ' +
    'Note="May create bombs that inflict electricity damage instead of fire; a direct hit dazzles for 1d4 rd"',
  'Smoke Bomb':
    'Section=combat ' +
    'Note="May create bombs that obscure vision in dbl splash radius for %{levels.Alchemist} rd"',
  'Sticky Bomb':
    'Section=combat ' +
    'Note="A direct hit by a bomb inflicts splash damage the following rd"',
  'Sticky Poison':
    'Section=combat ' +
    'Note="Poison applied to a weapon remains effective for %{intelligenceModifier} strikes"',
  'Stink Bomb':
    'Section=combat ' +
    'Note="May create bombs that nauseate for 1d4+1 rd (DC %{10+levels.Alchemist//2+intelligenceModifier} Fort neg) in dbl splash radius for 1 rd"',
  'Swift Alchemy':
    'Section=combat,magic ' +
    'Note=' +
      '"May apply poison to a weapon as a move action",' +
      '"May create alchemical items in half normal time"',
  'Swift Poisoning':
    'Section=combat Note="May apply poison to a weapon as a swift action"',
  'Throw Anything (Alchemist)':
    'Section=combat,feature ' +
    'Note=' +
      '"Splash weapons inflict +%{intelligenceModifier} HP damage",' +
      '"Has Throw Anything feature"',
  'True Mutagen':
    'Section=magic ' +
    'Note="Mutagen gives +8 AC, +8 to Strength, Dexterity, and Constitution, and -2 Intelligence, Wisdom, and Charisma for %{effectiveAlchemistLevel*10} min"',

  // Cavalier
  'Act As One':
    'Section=combat ' +
    'Note="R30\' May give immediate move, +2 melee attack, and +2 AC to allies 1/combat"',
  'Aid Allies (Cavalier)':
    'Section=combat ' +
    'Note="Aid another action gives ally +%{(levels.Cavalier+4)//6+2} AC, attack, save, or skill check"',
  'Banner':
    'Section=combat ' +
    'Note="R60\' Allies gain +%{bannerLevel//5+1} save vs. fear and +%{bannerLevel//5} charge attack when banner is visible"',
  'Braggart':
    'Section=combat,feature ' +
    'Note=' +
      '"+2 attack vs. demoralized target",' +
      '"Has Dazzling Display feature; may use unarmed"',
  'By My Honor':
     'Section=save ' +
     'Note="+2 chosen save unless alignment changes on chosen axis"',
  'Calling':
    'Section=feature,magic ' +
    'Note=' +
      '"May gain +%{charismaModifier} on choice of ability check, attack, save, or skill check within 1 min after prayer 1/choice/dy",' +
      '"+%1 %V level"',
  'Cavalier Feat Bonus':'Section=feature Note="%V Fighter Feats"',
  "Cavalier's Charge":
    'Section=combat ' +
    'Note="+4 mounted charge attack/Suffers no AC penalty after mounted charge"',
  'Challenge':
    'Section=combat ' +
    'Note="May inflict +%{levels.Cavalier} HP damage on chosen foe and suffer -2 AC against other foes %{(levels.Cavalier+2)//3}/dy"',
  'Demanding Challenge':
    'Section=combat ' +
    'Note="Challenged target suffers -2 AC on attacks by others"',
  'Expert Trainer':
    'Section=skill ' +
    'Note="+%{levels.Cavalier//2} Handle Animal (any mount)/May teach any mount in 1/7 time (DC +5)/May train multiple mounts simultaneously (+2 DC/additional mount)"',
  'For The Faith':
    'Section=combat ' +
    'Note="R30\' May give self +%{charismaModifier>?1} attack and allies who follow the same faith +%{charismaModifier//2>?1} attack for 1 rd %{levels.Cavalier//4-1}/dy"',
  'For The King':
    'Section=combat ' +
    'Note="R30\' May give allies +%{charismaModifier} attack and damage for 1 rd 1/combat"',
  'Greater Banner':
    'Section=combat ' +
    'Note="R60\' Allies gain +2 save vs. charm and compulsion/Waving banner gives allies additional save vs. spell or effect"',
  'Greater Tactician':'Section=feature Note="1 Teamwork feat"',
  "Knight's Challenge":
    'Section=combat ' +
    'Note="May make additional Challenge w/+%{charismaModifier} attack and damage and +4 to confirm crit 1/dy"',
  "Lion's Call":
    'Section=combat ' +
    'Note="R60\' May use a standard action speech to give allies +%{charismaModifier} save vs. fear, +1 attack for %{levels.Cavalier} rd, and an immediate save vs. frightened or panicked"',
  'Master Tactician':
    'Section=combat,feature ' +
    'Note=' +
      '"May use Tactician to share 2 Teamwork feats w/allies",' +
      '"1 Teamwork feat"',
  'Mighty Charge':
    'Section=combat ' +
    'Note="Dbl threat range during mounted charge/May make free bull rush, disarm, sunder, or trip w/out provoking AOO after a successful mounted charge"',
  'Moment Of Triumph':
    'Section=combat ' +
    'Note="May automatically confirm crit and gain +%{charismaModifier} on ability checks, attack, damage, saves, skill checks, and AC for 1 rd 1/dy"',
  'Mount':'Section=companion,feature,skill ' +
    'Note=' +
      '"Mount has Light Armor Proficiency feature but lacks Share Spells feature",' +
      '"Has Animal Companion feature w/mount",' +
      '"Suffers no Ride armor penalty w/mount"',
  'Mounted Mastery':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+4 AC vs. attack set against mounted charge/+%{((animalCompanionStats.Str||10)-10)//2} mounted charge damage",' +
      '"1 Order Of The Sword feat",' +
      '"Suffers no Ride armor penalty"',
  'Order':'Section=feature Note="1 selection"',
  'Order Of The Cockatrice':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} HP damage during solo threat of Challenge target",' +
      '"Must put own interest above others\'",' +
      '"Appraise is a class skill/Perform is a class skill",' +
      '"Foes suffer +%{charismaModifier} DC to demoralize using Intimidate"',
  'Order Of The Dragon':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"Allies gain +%{levels.Cavalier//4+1} attack on threatened Challenge target",' +
      '"Must protect allies from harm and defend their honor",' +
      '"Perception is a class skill/Survival is a class skill",' +
      '"+%{levels.Cavalier//2>?1} Survival (care for allies)"',
  'Order Of The Lion':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} AC vs. Challenge target",' +
      '"Must defend and obey sovereign",' +
      '"Knowledge (Local) is a class skill/Knowledge (Nobility) is a class skill",' +
      '"May use Knowledge (Nobility) untrained/+%{levels.Cavalier//2>?1} Knowledge (Nobility) (sovereign)"',
  'Order Of The Shield':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} attack vs. Challenge target for 1 min if target attacks another",' +
      '"Must defend the lives and prosperity of common folk",' +
      '"Heal is a class skill/Knowledge (Local) is a class skill",' +
      '"+%{levels.Cavalier//2>?1} Heal (others)"',
  'Order Of The Star':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} saves while threatening Challenge target",' +
      '"Must protect and serve a faith and its members",' +
      '"Heal is a class skill/Knowledge (Religion) is a class skill",' +
      '"May use Knowledge (Religion) untrained/+%{levels.Cavalier//2>?1} Knowledge (Religion) (chosen faith)"',
  'Order Of The Sword':
    'Section=combat,feature,skill,skill ' +
    'Note=' +
      '"+%{levels.Cavalier//4+1} mounted attack vs. Challenge target",' +
      '"Must show honor, courage, mercy, and charity",' +
      '"Knowledge (Nobility) is a class skill/Knowledge (Religion) is a class skill",' +
      '"+%{levels.Cavalier//2>?1} Sense Motive (oppose Bluff)"',
  'Protect The Meek':
    'Section=combat ' +
    'Note="May take immediate move and attack; staggered for 1 rd afterward"',
  'Resolute':
    'Section=combat ' +
    'Note="May convert %{(levels.Cavalier+2)//4} HP damage per attack to nonlethal when wearing heavy armor"',
  'Retribution':
    'Section=combat ' +
    'Note="May make +2 AOO against adjacent foe who strikes self or follower of the same faith 1/rd; foe crit allows Challenge use"',
  'Shield Of The Liege':
    'Section=combat ' +
    'Note="Adjacent allies gain +2 AC/May redirect an attack on an adjacent ally to self"',
  'Steal Glory':
    'Section=combat ' +
    'Note="May make AOO against threatened target when ally scores a crit"',
  'Stem The Tide':
    'Section=combat,feature ' +
    'Note=' +
      '"May halt foe using attack instead of maneuver",' +
      '"Has Stand Still feature"',
  'Strategy':
    'Section=combat ' +
    'Note="R30\' May give each ally +2 AC for 1 rd, +2 attack for 1 rd, or immediate move 1/combat"',
  'Supreme Charge':
    'Section=combat ' +
    'Note="Mounted charge inflicts dbl damage (lance triple)/Crit during mounted charge inflicts stunned (DC %{baseAttack+10} Will staggered) for 1d4 rd"',
  'Tactician':
    'Section=combat,feature ' +
    'Note=' +
      '"R30\' May share Teamwork feat w/allies for %{tacticianLevel//2+3} rd %V/dy",' +
      '"1 Teamwork feat"',

  // Inquisitor
  'Bane':
    'Section=combat ' +
    'Note="Self gains +2 attack and +%Vd6 HP damage with chosen weapon vs. chosen creature type for %{levels.Inquisitor} rd/dy"',
  'Cunning Initiative':'Section=combat Note="+%V Initiative"',
  'Detect Alignment':
    'Section=magic ' +
    'Note="May cast <i>Detect Chaos</i>, <i>Detect Good</i>, <i>Detect Evil</i>, <i>Detect Law</i> at will"',
  'Discern Lies':
    'Section=magic ' +
    'Note="May use <i>Discern Lies</i> effects %{levels.Inquisitor} rd/dy"',
  'Domain (Inquisitor)':'Section=feature Note="1 selection"',
  'Exploit Weakness':
    'Section=combat ' +
    'Note="Crit ignores DR and negates regeneration for 1 rd/+1 HP per die energy damage vs. vulnerable foe"',
  'Greater Bane':'Section=combat Note="Increased Bane effects"',
  'Judgment':
    'Section=combat ' +
    'Note="May pronounce one of these, gaining the specified bonus until combat ends, %{(levels.Inquisitor+2)//3}/dy: ' +
      'destruction (+%{(levels.Inquisitor+3)//3} weapon damage), ' +
      'healing (regains %{(levels.Inquisitor+3)//3} HP/rd), ' +
      'justice (+%{(levels.Inquisitor+5)//5} attack%{levels.Inquisitor>=10 ? \', dbl to confirm crit\' : \'\'}), ' +
      'piercing (+%{(levels.Inquisitor+3)//3} concentration, +%{(levels.Inquisitor+3)//3} caster level to overcome spell resistance), ' +
      'protection (+%{levels.Inquisitor+5)//5} AC%{levels.Inquisitor>=10 ? \', dbl vs. confirm crit\' : \'\'}), ' +
      'purity (+%{(levels.Inquisitor+5)//5} saves%{levels.Inquisitor>=10 ? \', dbl vs. curse, disease, and poison\' : \'\'}), ' +
      'resiliency (gain DR %{(levels.Inquisitor+5)//5}/%{levels.Inquisitor>=10 ? \'opposed alignment\' : \'magic\'}), ' +
      'resistance (resistance %{(levels.Inquisitor+3)//3*2} to chosen energy), ' +
      'smiting (weapons count as magic%{levels.Inquisitor>=10 ? \', aligned, and adamantine\' : levels.Inquisitor>=6 ? \' and aligned\' : \'\'} to overcome DR)"',
  'Monster Lore':
    'Section=skill ' +
    'Note="+%{wisdomModifier} Knowledge (identify creature abilities and weaknesses)"',
  'Orisons':'Section=magic Note="Knows level-0 spells"',
  'Second Judgment':
    'Section=combat ' +
    'Note="May use 2 Judgments simultaneously; may change 1 as a swift action"',
  'Slayer':
    'Section=combat ' +
    'Note="Effects of choice of Judgment increase to: ' +
      'destruction (+%{(levels.Inquisitor+8)//3} weapon damage), ' +
      'healing (regains %{(levels.Inquisitor+8)//3} HP/rd), ' +
      'justice (+%{(levels.Inquisitor+10)//5} attack), ' +
      'piercing (+%{(levels.Inquisitor+8)//3} concentration, +%{(levels.Inquisitor+8)//3} caster level to overcome spell resistance), ' +
      'protection (+%{levels.Inquisitor+10)//5} AC), ' +
      'purity (+%{(levels.Inquisitor+10)//5} saves), ' +
      'resiliency (gain DR %{(levels.Inquisitor+10)//5}/opposed alignment), ' +
      'resistance (resistance %{(levels.Inquisitor+8)//3*2} to chosen energy)"',
  'Solo Tactics':
    'Section=combat ' +
    'Note="All allies are treated as having the same Teamwork feats for determining feat bonuses"',
  'Stalwart':
    'Section=save ' +
    'Note="Successful Fortitude or Will save in medium or lighter armor yields no damage instead of half"',
  'Stern Gaze':'Section=skill Note="+%V Intimidate/+%V Sense Motive"',
  'Teamwork Feat':'Section=feature Note="1 Teamwork feat"',
  'Teamwork Feat (Inquisitor)':
    'Section=feature,feature ' +
    'Note=' +
      '"%V Teamwork feats",' +
      '"May exchange most recently acquired Teamwork feat %{wisdomModifier}/dy"',
  'Third Judgment':
    'Section=combat ' +
    'Note="May use 3 Judgments simultaneously; may change 1 as a swift action"',
  // 'Track' in Pathfinder.js
  'True Judgment':
    'Section=combat ' +
    'Note="R30\' Successful Judgment attack kills foe (DC %{10+levels.Inquisitor//2+wisdomModifier} Fort neg); must wait 1d4 rd between uses"',

  // Oracle
  'Acid Skin':
    'Section=save ' +
    'Note="%{mysteryLevel>=17 ? \'Immune\' : mysteryLevel>=11 ? \'Resistance 20\' : mysteryLevel>=5 ? \'Resistance 10\' : \'Resistance 5\'} to acid"',
  'Air Barrier':
    'Section=combat ' +
    'Note="Conjured air shell gives +%{((mysteryLevel+5)//4)*2>?4} AC%{mysteryLevel>=13 ? \' and foe 50% ranged miss chance\' : \'\'} %{mysteryLevel} hr/dy"',
  'Arcane Archivist (Oracle)':
    'Section=magic ' +
    'Note="May spend +1 spell slot to cast Sorcerer/Wizard spell from lore book 1/dy"',
  'Armor Of Bones':
    'Section=combat ' +
    'Note="Conjured armor gives +%{(mysteryLevel+5)//4*2>?4} AC%{mysteryLevel>=13 ? \', DR 5/bludgeoning\' : \'\'} %{mysteryLevel} hr/dy"',
  'Automatic Writing':
    'Section=magic ' +
    'Note="1 hr meditation yields results of %{mysteryLevel>=8 ? \'<i>Commune</i>\' : mysteryLevel>=5 ? \'<i>Divination</i> (90% effective)\' : \'<i>Augury</i> (90% effective)\'} spell 1/dy"',
  'Awesome Display':
    'Section=magic ' +
    'Note="Treats illusion targets as having %{charismaModifier>?0} fewer HD"',
  'Battle Mystery':
    'Section=skill ' +
    'Note="Intimidate is a class skill/Knowledge (Engineering) is a class skill/Perception is a class skill/Ride is a class skill"',
  'Battlecry':
    'Section=combat ' +
    'Note="R100\' Allies gain +%{mysteryLevel>=10 ? 2 : 1} attack, skill checks, and saves for %{charismaModifier} rd %{(mysteryLevel+5)//5}/dy"',
  'Battlefield Clarity':
    'Section=save ' +
    'Note="May make +4 reroll on failed save vs. blind, deaf, frightened, panicked, paralyzed, shaken, or stunned %{mysteryLevel>=15 ? 3 : mysteryLevel>=7 ? 2 : 1}/dy"',
  'Bleeding Wounds':
    'Section=magic ' +
    'Note="Successful negative energy spell inflicts %{(mysteryLevel+5)//5} HP bleeding/rd (DC 15 Heal or healing effect ends)"',
  'Blizzard':
    'Section=combat ' +
    'Note="%{mysteryLevel} contiguous 10\' cu inflict %{mysteryLevel}d4 HP cold (DC %{10+mysteryLevel//2+charismaModifier} Ref half), reduce vision to 5\', and inflict +5 Acrobatics DC for %{charismaModifier} rd 1/dy"',
  'Bonded Mount':'Section=feature Note="Has Animal Companion feature w/mount"',
  'Bones Mystery':
    'Section=skill ' +
    'Note="Bluff is a class skill/Disguise is a class skill/Intimidate is a class skill/Stealth is a class skill"',
  'Brain Drain':
    'Section=magic ' +
    'Note="R100\' Mental probe inflicts %{mysteryLevel}d4 HP and yields 1 Knowledge check/rd at target\'s bonus (DC %{10+mysteryLevel//2+charismaModifier} Will neg) for %{charismaModifier} rd %{(mysteryLevel+5)//5}/dy"',
  'Burning Magic':
    'Section=magic ' +
    'Note="Successful fire spell inflicts 1 HP/spell level fire for 1d4 rd (spell DC Ref ends)"',
  'Channel':
    'Section=feature Note="Has Channel Energy feature (positive energy only)"',
  'Cinder Dance':
    'Section=ability,feature ' +
    'Note=' +
      '"+10 Speed",' +
      '"Has %V"',
  'Clobbering Strike':
    'Section=magic ' +
    'Note="May make swift action trip attempt w/out provoking AOO after crit w/attack spell"',
  'Clouded Vision':
    'Section=feature ' +
    'Note="Has %{mysteryLevel>=5? 60 : 30}\' vision and Darkvision%1%2"',
  'Coat Of Many Stars':
    'Section=combat ' +
    'Note="Conjured coat gives +%{(mysteryLevel+5)//4*2>?4} AC%{mysteryLevel>=13 ? \', DR 5/slashing\' : \'\'} for %{mysteryLevel} hr/dy"',
  'Combat Healer':
    'Section=magic ' +
    'Note="May use two spell slots to cast <i>Cure</i> spell as a swift action %{(mysteryLevel-3)//4}/dy"',
  'Crystal Sight':
    'Section=feature ' +
    'Note="Can see through %{mysteryLevel}\' earth, sand, or stone or %{mysteryLevel}\\" metal for %{mysteryLevel} rd/dy"',
  'Deaf':
    'Section=combat,feature,magic,skill ' +
    'Note=' +
      '"%V Initiative",' +
      '"Cannot hear%1",' +
      '"May cast all spells silently",' +
      '"Automatically fails Perception (sound)/-4 opposed Perception%{mysteryLevel>=5 ? \'/+3 Perception (non-sound)\' : \'\'}"',
  "Death's Touch":
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{mysteryLevel//2} HP negative energy (undead heals and gains +2 channel resistance for 1 min) %{charismaModifier+3}/dy"',
  'Delay Affliction':
    'Section=save ' +
    'Note="May delay effects of failed save vs. disease or poison for %{mysteryLevel} hr %{mysteryLevel>=15 ? 3 : mysteryLevel >= 7 ? 2 : 1}/dy"',
  'Dweller In Darkness':'Section=magic Note="Can use <i>%V</i> effects 1/dy"',
  'Energy Body':
    'Section=combat ' +
    'Note="Energy form lights 10\' radius, inflicts 1d6+%{mysteryLevel} HP positive energy on undead w/unarmed attack or when undead hits self w/melee attack, and heals target 1d6+%{mysteryLevel} HP 1/rd for %{mysteryLevel} rd/dy"',
  'Enhanced Cures':
     'Section=magic ' +
     'Note="Caster level bonus for <i>Cure</i> spell effects is +%{mysteryLevel}"',
  'Erosion Touch':
    'Section=combat ' +
    'Note="Touch inflicts %{mysteryLevel}d6 HP to objects and constructs %{mysteryLevel//3+1}/dy"',
  'Final Revelation (Battle Mystery)':
    'Section=combat ' +
    'Note="May take a full-attack action and move %{speed}\' as a full-round action/Crit ignores DR/+4 AC vs. crit/Does not die until -%{constitution*2+1} HP"',
  'Final Revelation (Bones Mystery)':
    'Section=combat,magic ' +
    'Note=' +
      '"Automatically stabilizes at negative HP",' +
      '"May cast <i>Bleed</i> or <i>Stabilize</i> 1/rd, <i>Animate Dead</i> at will, and <i>Power Word Kill</i> vs. target w/up to 150 HP 1/dy"',
  'Final Revelation (Flame Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to fire spells w/out cost"',
  'Final Revelation (Heavens Mystery)':
    'Section=combat,feature,save,save ' +
    'Note=' +
      '"Automatically stabilizes at negative HP/Automatically confirms crit",' +
      '"Automatic <i>Reincarnation</i> 3 dy after death; matures in 1 wk",' +
      '"+%V Fortitude/+%V Reflex/+%V Will",' +
      '"Immune to fear"',
  'Final Revelation (Life Mystery)':
    'Section=combat,save ' +
    'Note=' +
      '"Does not die until -%{constitution*2+1} HP",' +
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
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to cold and water spells w/out cost"',
  'Final Revelation (Wind Mystery)':
    'Section=magic ' +
    'Note="May apply Enlarge Spell, Extend Spell, Silent Spell, or Still Spell to air and electricity spells w/out cost"',
  'Fire Breath':
    'Section=combat ' +
    'Note="15\' cone inflicts %{mysteryLevel}d4 HP fire (DC %{10+mysteryLevel//2+charismaModifier} Ref half) %{1+mysteryLevel//5}/dy"',
  'Firestorm':
    'Section=combat ' +
    'Note="%{mysteryLevel} contiguous 10\' cu inflict %{mysteryLevel}d6 HP fire (DC %{10+mysteryLevel//2+charismaModifier} Ref half) for %{charismaModifier} rd 1/dy"',
  'Flame Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Climb is a class skill/Intimidate is a class skill/Perform is a class skill"',
  'Fluid Nature':
    'Section=combat,feature ' +
    'Note=' +
      '"+4 CMD vs. bull rush, drag, grapple, reposition, and trip/-4 Foe crit confirm",' +
      '"Has %V"',
  'Fluid Travel':
    'Section=ability ' +
    'Note="May move full speed across liquid without contact damage%1 %{mysteryLevel} hr/dy"',
  'Focused Trance':
    'Section=skill ' +
    'Note="1d6 rd trance gives +%{mysteryLevel} save vs. sonic and gaze attack followed by a single +20 Intelligence skill check %{charismaModifier}/dy"',
  'Form Of Flame':
    'Section=magic ' +
    'Note="May use <i>Elemental Body %{mysteryLevel>=13 ? \'IV\' : mysteryLevel>=11 ? \'III\' : mysteryLevel>=9 ? \'II\' : \'I\'}</i> effects to become %{mysteryLevel>=13 ? \'huge\' : mysteryLevel>=11 ? \'large\' : mysteryLevel>=9 ? \'medium\' : \'small\'} fire elemental for %{mysteryLevel} hr 1/dy"',
  'Freezing Spells':
    'Section=magic ' +
    'Note="Target failed save on spells that inflict cold damage also slows target for 1%{mysteryLevel>=11 ? \'d4\' : \'\'} rd"',
  'Friend To The Animals':
    'Section=magic,save ' +
    'Note=' +
      '"Knows all <i>Summon Nature\'s Ally</i> spells",' +
      '"R30\' Animals gain +%{charismaModifier} on all saves"',
  'Gaseous Form':
    'Section=magic ' +
    'Note="May use <i>Gaseous Form</i> effects %{mysteryLevel} min/dy; including others uses equal portion of daily time for each"',
  'Gaze Of Flames':
    'Section=feature,magic ' +
    'Note=' +
      '"Can see through fire, fog, and smoke",' +
      '"R%{mysteryLevel*10}\' Can see out of any flame in range %V rd/dy"',
  'Guiding Star':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"May determine precise location under clear night sky",' +
      '"May use Empower Spell, Extend Spell, Silent Spell, or Still Spell outdoors without cost 1/night",' +
      '"+%{charismaModifier} Wisdom-linked skills under clear night sky"',
  'Haunted':
    'Section=feature,magic ' +
    'Note=' +
      '"Malevolent spirits inflict minor annoyances",' +
      '"Knows %V spells"',
  'Healing Hands':
    'Section=skill,skill ' +
    'Note=' +
      '"+4 Heal",' +
      '"May use Heal on dbl number of people simultaneously/May provide long-term care for self"',
  'Heat Aura':
    'Section=combat ' +
    'Note="10\' radius inflicts %{mysteryLevel//2>?1}d4 HP fire (DC %{10+mysteryLevel//2+charismaModifier} half) and gives self 20% concealment for 1 rd %{(mysteryLevel+5)//5}/dy"',
  'Heavens Mystery':
    'Section=skill ' +
    'Note="Fly is a class skill/Knowledge (Arcana) is a class skill/Perception is a class skill/Survival is a class skill"',
  'Ice Armor':
    'Section=combat ' +
    'Note="Conjured armor gives +%{((mysteryLevel+5)//4)*2>?4} AC%{mysteryLevel>=13 ? \' and DR 5/piercing (both\' : \'(\'} +2 in cold, -2 in heat) for %{mysteryLevel} hr/dy"',
  'Icy Skin':
    'Section=save ' +
    'Note="%{mysteryLevel>=17 ? \'Immune\' : mysteryLevel>=11 ? \'Resistance 20\' : mysteryLevel>=5 ? \'Resistance 10\' : \'Resistance 5\'} to cold"',
  'Interstellar Void':
    'Section=combat ' +
    'Note="R30\' Inflicts %{mysteryLevel}d6 HP cold%{mysteryLevel>=15 ? \', exhausted, stunned 1 rd\' : mysteryLevel>=10 ? \', fatigued\' : \'\'} (DC %{10+mysteryLevel//2+charismaModifier} Fort half HP only) %{mysteryLevel>=10 ? 2 : 1}/dy"',
  'Invisibility':
    'Section=magic ' +
    'Note="May use <i>Invisibility</i> effects %{mysteryLevel} min/dy%{mysteryLevel>=9 ? \' or <i>Greater Invisibility</i> effects \' + mysteryLevel + \' rd/dy\' : \'\'}"',
  'Iron Skin':
    'Section=magic ' +
    'Note="May use self <i>Stoneskin</i> effects %{mysteryLevel>=15 ? 2 : 1}/dy"',
  'Lame':
    'Section=ability,ability,save ' +
    'Note=' +
      '"%V Speed",' +
      '"Speed is unaffected by encumbrance%1",' +
      '"Immune to %V"',
  'Life Leach':
    'Section=combat ' +
    'Note="R30\' Target suffers %{mysteryLevel<?10}d6 HP (DC %{10+mysteryLevel//2+charismaModifier} Fort half) and self gains equal temporary HP for %{charismaModifier} hr %{(mysteryLevel-3)//4}/dy"',
  'Life Link':
    'Section=combat ' +
    'Note="R%{mysteryLevel*10+100}\' May establish bond with up to %{mysteryLevel} targets that transfers 5 HP/rd damage to self"',
  'Life Mystery':
    'Section=skill ' +
    'Note="Handle Animal is a class skill/Knowledge (Nature) is a class skill/Survival is a class skill"',
  'Lifesense':'Section=feature Note="Has 30\' Blindsight"',
  'Lightning Breath':
    'Section=combat ' +
    'Note="30\' line inflicts %{mysteryLevel}d4 HP electricity (DC %{10+mysteryLevel//2+charismaModifier} Ref half) %{mysteryLevel//5+1}/dy"',
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
      '"+%{mysteryLevel - mysteryLevel*3//4} CMB on chosen combat maneuver",' +
      '"+%V General Feat (Improved %{mysteryLevel>=11 ? \' and Greater\' : \'\'} combat maneuver)"',
  'Mantle Of Moonlight':
    'Section=combat,save ' +
    'Note=' +
      '"Touch forces lycanthrope target into human form%{mysteryLevel>=5 ? \' or inflicts <i>Rage</i>\' : \'\'} for %{mysteryLevel} rd %{mysteryLevel//5>?1}/dy",' +
      '"Immune to lycanthropy"',
  'Mental Acuity':'Section=ability Note="+%V Intelligence"',
  'Mighty Pebble':
    'Section=combat ' +
    'Note="R20\' Thrown pebble +%{mysteryLevel//4} attack inflicts %{mysteryLevel//2>?1}d6+%{mysteryLevel//4} HP bludgeoning, half in 5\' radius (DC %{10+mysteryLevel//2+charismaModifier} Ref neg) %{(mysteryLevel+5)//5}/dy"',
  'Molten Skin':
    'Section=save ' +
    'Note="%{mysteryLevel>=17 ? \'Immune\' : mysteryLevel>=11 ? \'Resistance 20\' : mysteryLevel>=5 ? \'Resistance 10\' : \'Resistance 5\'} to fire"',
  'Moonlight Bridge':
    'Section=magic ' +
    'Note="10\' x %{mysteryLevel*10}\' span provides passage for 1 dy or until self crosses %{charismaModifier}/dy"',
  'Mystery':'Section=feature Note="1 selection"',
  'Natural Divination':
    'Section=feature ' +
    'Note="10 min nature study gives a single +%{charismaModifier} save, +10 skill check, or +4 Initiative w/in 1 dy %{mysteryLevel//4+1}/dy"',
  'Nature Mystery':
    'Section=skill ' +
    'Note="Climb is a class skill/Fly is a class skill/Knowledge (Nature) is a class skill/Ride is a class skill/Survival is a class skill/Swim is a class skill"',
  "Nature's Whispers":'Section=combat Note="+%V AC/+%V CMD"',
  'Near Death':
    'Section=save ' +
    'Note="+%{mysteryLevel>=11 ? 4 : 2} vs. disease, mental effects, %{mysteryLevel>=7 ? \'poison, death effects, sleep effects, and stunning\' : \'and poison\'}"',
  "Oracle's Curse":'Section=feature Note="1 selection"',
  // Orisons as Inquisitor
  'Punitive Transformation':
    'Section=magic ' +
    'Note="May use <i>Baleful Polymorph</i> effects, lasting %{mysteryLevel} rd, to transform target into a harmless animal %{charismaModifier}/dy"',
  'Raise The Dead':
    'Section=magic ' +
    'Note="Summoned %{mysteryLevel} HD %{mysteryLevel>= 15 ? \'advanced skeleton or zombie\' : mysteryLevel>=7 ? \'bloody skeleton or fast zombie\' : \'skeleton or zombie\'} serves for %{charismaModifier} rd %{mysteryLevel>=10 ? 2 : 1}/dy"',
  'Resiliency (Oracle)':
    'Section=combat,feature ' +
    'Note=' +
      '"Not disabled or staggered at 0 HP%{mysteryLevel>=11 ? \'/No HP loss from taking action while disabled\' : \'\'}",' +
      '"Has Diehard feature"',
  'Resist Life':
    'Section=save ' +
    'Note="Saves as undead vs. negative and positive energy%{mysteryLevel>=7 ? \' w/+\' + (mysteryLevel>=15 ? 6 : mysteryLevel>=11 ? 4 : 2) + \' channel resistance\' : \'\'}"',
  'Revelation':'Section=feature Note="%V selections"',
  'Rock Throwing':
    'Section=combat ' +
    'Note="R20\' Thrown rock +1 attack inflicts 2d%{features.Small ? 3 : 4}+%{(strengthModifier*1.5)//1} HP"',
  'Safe Curing':'Section=magic Note="<i>Cure</i> spells do not provoke AOO"',
  'Shard Explosion':
    'Section=combat ' +
    'Note="10\' radius inflicts %{mysteryLevel//2>?1}d6 HP piercing (DC %{10+mysteryLevel//2+charismaModifier} Ref half) and difficult terrain for 1 rd %{mysteryLevel//5+1}/dy"',
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
    'Note="R30\' Ranged touch inflicts negative level for %{charismaModifier} min and heals %{mysteryLevel} HP to self %{(mysteryLevel-3)//4}/dy"',
  'Spark Skin':
    'Section=save ' +
    'Note="%{mysteryLevel>=17 ? \'Immune\' : mysteryLevel>=11 ? \'Resistance 20\' : mysteryLevel>=5 ? \'Resistance 10\' : \'Resistance 5\'} to electricity"',
  'Speak With Animals (Oracle)':
    'Section=magic ' +
    'Note="May converse at will with %{mysteryLevel//3+1} chosen animal types"',
  'Spirit Boost':
    'Section=magic ' +
    'Note="Up to %{mysteryLevel} excess HP from a <i>Cure</i> spell become temporary HP for 1 rd"',
  'Spirit Of Nature':
    'Section=combat ' +
    'Note="At negative HP%{mysteryLevel<10 ? \' in a natural setting\' : \'\'}, stabilizes automatically%{mysteryLevel>=15 ? \' and gains fast healing 3 for 1d4 rd\' : mysteryLevel>=5 ? \' and gains fast healing 1 for 1d4 rd\' : \'\'}"',
  'Spirit Walk':
    'Section=magic ' +
    'Note="May become incorporeal for %{mysteryLevel} rd %{mysteryLevel>=15 ? 2 : 1}/dy"',
  'Spontaneous Symbology':
    'Section=magic Note="May use spell slot to cast any <i>Symbol</i> spell"',
  'Spray Of Shooting Stars':
    'Section=combat ' +
    'Note="R60\' 5\' radius inflicts %{mysteryLevel}d4 HP fire (DC %{10+mysteryLevel//2+charismaModifier} Ref half) %{(mysteryLevel+5)//5}/dy"',
  'Star Chart':
    'Section=magic ' +
    'Note="May use <i>Commune</i> effects via 10 min contemplation 1/dy"',
  'Steelbreaker Skin':
    'Section=combat ' +
    'Note="Skin inflicts %{mysteryLevel} HP on striking weapon%{mysteryLevel>=15 ? \', ignoring 10 points of hardness,\' : \'\'} for %{mysteryLevel} min 1/dy"',
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
    'Note="May move as an immediate action %{mysteryLevel>=15 ? 3 : mysteryLevel>=7 ? 2 : 1}/dy"',
  'Think On It':
    'Section=skill Note="May make +10 reroll on failed Knowledge 1/day"',
  'Thunderburst':
    'Section=combat ' +
    'Note="R100\' %{(mysteryLevel+9)//4*5>?20}\' radius inflicts %{mysteryLevel}d6 HP bludgeoning and 1 hr deafness (DC %{10+mysteryLevel//2+charismaModifier} Fort half HP only) %{(mysteryLevel-3)//4>?1}/dy"',
  'Tongues':
    'Section=combat,skill,skill ' +
    'Note=' +
      '"Can speak only chosen outsider or elemental language during combat",' +
      '"+%V Language Count",' +
      '"Can %V any spoken language"',
  'Touch Of Acid':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{mysteryLevel//2} HP acid %{charismaModifier+3}/dy%{mysteryLevel>=11 ? \'; wielded weapons inflict +1d6 HP acid\' : \'\'}"',
  'Touch Of Electricity':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{mysteryLevel//2} HP electricity %{charismaModifier+3}/dy%{mysteryLevel>=11 ? \'; wielded weapons inflict +1d6 HP electricity\' : \'\'}"',
  'Touch Of Flame':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{mysteryLevel//2} HP fire %{charismaModifier+3}/dy%{mysteryLevel>=11 ? \'; wielded weapons inflict +1d6 HP fire\' : \'\'}"',
  'Transcendental Bond':
    'Section=magic ' +
    'Note="May use <i>Telepathic Bond</i> effects on %{charismaModifier} allies %{mysteryLevel} rd/dy%{mysteryLevel>=10 ? \'; may cast touch spell on 1 of these remotely 1/dy\' : \'\'}"',
  'Undead Servitude':'Section=magic Note="May use Command Undead %V/dy"',
  'Undo Artifice':
    'Section=feature ' +
    'Note="May disintegrate nonliving item into raw materials (DC %{10+mysteryLevel//2+charismaModifier} Fort neg) %{charismaModifier}/dy"',
  'Voice Of The Grave':
    'Section=magic ' +
    'Note="May use <i>Speak With Dead</i> effects %{mysteryLevel} rd/dy%1"',
  'Vortex Spells':
    'Section=magic ' +
    'Note="Crit w/spell staggers target for 1%{mysteryLevel>=11 ? \'d4\' : \'\'} rd"',
  'War Sight':
    'Section=combat ' +
    'Note="May take choice of %{mysteryLevel>=11 ? 3 : 2} Initiative rolls%{mysteryLevel>=7 ? \'/May always act in surprise round\' : \'\'}"',
  'Wasting':
    'Section=save,skill ' +
    'Note=' +
      '"%{mysteryLevel>=10 ? \'Immune to\' : \'+4 vs.\'} disease%{mysteryLevel>=5 ? \'/Immune to sickened\' : \'\'}%{mysteryLevel>=15 ? \' and nauseated\' : \'\'}",' +
      '"-4 Charisma-based skills other than Intimidate"',
  'Water Form':
    'Section=magic ' +
    'Note="May use <i>Elemental Body %{mysteryLevel>=13 ? \'IV\' : mysteryLevel>=11 ? \'III\' : mysteryLevel>=9 ? \'II\' : \'I\'}</i> effects to become %{mysteryLevel>=13 ? \'huge\' : mysteryLevel>=11 ? \'large\' : mysteryLevel>=9 ? \'medium\' : \'small\'} water elemental for %{mysteryLevel} hr 1/dy"',
  'Water Sight':
    'Section=feature,magic ' +
    'Note=' +
      '"Can see normally through fog and mist",' +
      '"May use <i>%V</i> effects via pool %{mysteryLevel} rd/dy"',
  'Waves Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Knowledge (Nature) is a class skill/Swim is a class skill"',
  'Weapon Mastery (Oracle)':
    'Section=feature ' +
    'Note="+%V General Feat (Weapon Focus%1 with chosen weapon)"',
  'Whirlwind Lesson':
    'Section=magic Note="May absorb lesson from magical tome in 8 hr%1"',
  'Wind Mystery':
    'Section=skill ' +
    'Note="Acrobatics is a class skill/Escape Artist is a class skill/Fly is a class skill/Stealth is a class skill"',
  'Wind Sight':
    'Section=magic,skill ' +
    'Note=' +
      '"May use <i>Clairaudience/Clairvoyance</i> effects on any unobstructed area %V rd/dy",' +
      '"Ignores Perception wind penalties and first 100\' distance penalties"',
  'Wings Of Air':'Section=ability Note="May fly %{mysteryLevel>=10 ? 90 : 60}\' for %{mysteryLevel} min/dy"',
  'Wings Of Fire':'Section=ability Note="May fly 60\' %{mysteryLevel} min/dy"',
  'Wintry Touch':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{mysteryLevel//2} HP cold %{charismaModifier+3}/dy%{mysteryLevel>=11 ? \'; wielded weapons inflict +1d6 cold\' : \'\'}"',

  // Summoner
  'Ability Increase Evolution':
    'Section=companion Note="+2 each on %V chosen %1"',
  'Ability Score Increase':
    'Section=companion ' +
    'Note="+%{levels.Summoner>=15 ? 3 : levels.Summoner>=10 ? 2 : 1} distributed among eidolon abilities"',
  'Aspect':
    'Section=feature ' +
    'Note="May use 2 points from evolution pool to apply 2 points of evolutions to self"',
  'Bite Evolution':
    'Section=companion ' +
    'Note="Bite inflicts %{eidolonDamage}%{eidolonBiteDamageBonus} HP"',
  'Blindsense Evolution':
    'Section=companion Note="R30\' May detect unseen creatures"',
  'Blindsight Evolution':
    'Section=companion Note="R30\' Can maneuver and fight w/out vision"',
  'Bond Senses':
    'Section=feature ' +
    'Note="May perceive via eidolon senses on same plane for %{levels.Summoner} rd/dy"',
  'Breath Weapon Evolution':
    'Section=companion ' +
    'Note="30\' cone or 60\' line inflicts %{animalCompanionStats.HD}d6 HP of chosen energy type (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Con-10)//2} Ref half) %V/dy"',
  'Burrow Evolution':
    'Section=companion Note="May burrow through earth at %V\'"',
  'Cantrips':'Section=magic Note="May cast 0-level spells"',
  'Claws Evolution':
    'Section=companion ' +
    'Note="Claws inflict %{eidolonDamageMinor}%{eidolonPrimaryDamageBonus} HP each"',
  'Climb Evolution':'Section=companion Note="%V\' Climb"',
  'Companion Darkvision':'Section=companion Note="60\' b/w vision in darkness"',
  'Constrict Evolution':
    'Section=companion Note="Successful grapple inflicts dbl grab damage"',
  'Damage Reduction Evolution':
    'Section=companion Note="DR %V/opposite alignment"',
  'Eidolon':'Section=feature Note="Special bond and abilities"',
  'Energy Attacks Evolution':
    'Section=companion ' +
    'Note="Natural attack inflicts +1d6 HP of chosen energy type"',
  'Fast Healing Evolution':'Section=companion Note="Heals %V HP/rd"',
  'Flight Evolution':'Section=companion Note="%V\' Fly"',
  'Frightful Presence Evolution':
    'Section=companion ' +
    'Note="R30\' Foes suffer frightened (up to %{animalCompanionStats.HD-4} HD) or shaken (up to %{animalCompanionStats.HD} HD) (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Cha-10)//2} Will neg) for 3d6 rd"',
  'Gills Evolution':'Section=companion Note="May breathe underwater"',
  'Gore Evolution':
    'Section=companion ' +
    'Note="Horn inflicts %{eidolonDamage}%{eidolonPrimaryDamageBonus} HP"',
  'Grab Evolution':
    'Section=companion ' +
    'Note="Successful chosen natural attack allows free combat maneuver to grapple/+4 grapple CMB"',
  'Greater Aspect':
    'Section=feature ' +
    'Note="May use 3 points from evolution pool to apply 6 points of evolutions to self"',
  'Greater Shield Ally (Summoner)':
    'Section=combat,save ' +
    'Note=' +
      '"Allies gain +2 AC and self gains +4 AC when eidolon is within reach",' +
      '"Allies gain +2 saves and self gains +4 saves when eidolon is within reach"',
  'Immunity Evolution':
    'Section=companion Note="Immune to choice of %V energy type"',
  'Improved Damage Evolution':
    'Section=companion ' +
    'Note="Choice of %V natural attacks each inflict damage 1 die type higher"',
  'Improved Natural Armor Evolution':
    'Section=companion Note="+%V natural armor"',
  'Large Evolution':
    'Section=companion ' +
    'Note="Size is %V: gains +%1 Strength, +%2 Constitution, +%3 AC, +%4 CMB/CMD%{$\'animalCompanion.Biped Eidolon\' || $\'features.Large Evolution\'>1 ? \', \' + ($\'animalCompanion.Biped Eidolon\' && $\'features.Large Evolution\'>1 ? 15 : 10) + \\"\' reach\\" : \'\'}; suffers %5 Dexterity, %6 Attack, %7 Fly, %8 Stealth"',
  'Life Bond':
    'Section=combat ' +
    'Note="Transfers to eidolon damage that would reduce self to negative HP"',
  'Life Link (Summoner)':
    'Section=combat ' +
    'Note="May transfer damage from eidolon to self to negate forced return to home plane/Eidolon must stay w/in 100\' to have full HP"',
  'Limbs (Arms) Evolution':'Section=companion Note="Has %V pairs of arms"',
  'Limbs (Legs) Evolution':
    'Section=companion Note="%V pairs of legs give +%1 speed"',
  'Link (Summoner)':
    'Section=companion ' +
    'Note="May communicate on same plane w/eidolon over any distance/Shares magic item slots w/eidolon"',
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
    'Note="Pincers inflict %{eidolonDamage}%{eidolonSecondaryDamageBonus} HP each"',
  'Poison Evolution':
    'Section=companion ' +
    'Note="Chosen natural attack inflicts +1d4 %V damage each rd for 4 rd (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Con-10)//2} Fort neg) 1/rd"',
  'Pounce Evolution':
    'Section=companion Note="May take a full-attack action after a charge"',
  'Pull Evolution':
    'Section=companion ' +
    'Note="Successful attack w/choice of %V natural attacks each allow free combat maneuver for 5\' pull"',
  'Push Evolution':
    'Section=companion ' +
    'Note="Successful attack w/choice of %V natural attacks each allow free combat maneuver for 5\' push"',
  'Rake Evolution':
    'Section=companion ' +
    'Note="Claw rake on grappled foe inflicts 2 x %{eidolonDamageMinor}%{eidolonPrimaryDamageBonus} HP"',
  'Reach Evolution':
    'Section=companion Note="+5\' reach w/choice of natural attack"',
  'Resistance Evolution':
    'Section=companion ' +
    'Note="Resistance %{(levels.Summoner+5)//5*5<?15} to %V chosen energy type"',
  'Rend Evolution':
    'Section=companion ' +
    'Note="Successful attacks w/2 claws inflicts +%{eidolonDamageMinor}%{animalCompanionStats.Str<10 ? (animalCompanionStats.Str-10)//2 : animalCompanionStats.Str>11 ? \'+\' + (animalCompanionStats.Str-10)//2*1.5//1 : \'\'} HP"',
  'Scent Evolution':'Section=companion Note="R30\' May detect foes by smell"',
  'Share Spells (Summoner)':
    'Section=companion Note="May cast self spells on eidolon as touch spells"',
  'Shield Ally (Summoner)':
    'Section=combat,save ' +
    'Note=' +
      '"Self gains +2 AC when eidolon is within reach",' +
      '"Self gains +2 saves when eidolon is within reach"',
  'Skilled Evolution':'Section=companion Note="+8 each on choice of %V skill"',
  'Slam Evolution':
    'Section=companion ' +
    'Note="Slams inflict %{eidolonDamageMajor}%{eidolonPrimaryDamageBonus} HP each"',
  'Small Eidolon':
    'Section=companion ' +
    'Note="Size is Small: gains +2 Dexterity, +1 AC, +1 attack, +2 Fly, and +4 Stealth; suffers -4 Strength, -2 Constitution, -1 CMB/CMD, -1 damage die step"',
  'Spell Resistance Evolution':
    'Section=companion Note="Has SR %{levels.Summoner + 11}"',
  'Sting Evolution':
    'Section=companion ' +
    'Note="Stings inflict %{eidolonDamageMinor}%{eidolonPrimaryDamageBonus} HP each"',
  'Summon Monster':
    'Section=magic ' +
    'Note="May cast <i>Summon Monster %V</i>%{levels.Summoner>=19 ? \' or <i>Gate</i>\' : \'\'}, lasting %{levels.Summoner} min, when eidolon not present %{3 + charismaModifier}/dy"',
  'Swallow Whole Evolution':
    'Section=companion ' +
    'Note="May make combat maneuver to swallow creature grappled by bite, inflicting %{eidolonDamage}%{eidolonPrimaryDamageBonus}+1d6 HP/rd"',
  'Swim Evolution':'Section=companion Note="%V\' Swim"',
  'Tail Evolution':'Section=companion Note="+%V Acrobatics (balance)"',
  'Tail Slap Evolution':
    'Section=companion ' +
    'Note="Slaps inflict %{eidolonDamage}%{eidolonSecondaryDamageBonus} HP each"',
  'Tentacle Evolution':
    'Section=companion ' +
    'Note="Tentacles inflict %{eidolonDamageMinor}%{eidolonSecondaryDamageBonus} HP each"',
  'Trample Evolution':
    'Section=companion ' +
    'Note="Full-round automatic overrun inflicts %{eidolonDamage}%{animalCompanionStats.Str<10 ? (animalCompanionStats.Str-10)//2 : animalCompanionStats.Str>11 ? \'+\' + (animalCompanionStats.Str-10)//2*1.5//1 : \'\'} HP (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Str-10)//2} Ref half)"',
  'Transposition':
    'Section=magic Note="May use Maker\'s Call to swap places w/eidolon"',
  'Tremorsense Evolution':
    'Section=companion Note="R30\' May sense creatures via ground vibrations"',
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
    'Note="R50\' May entangle target (DC %{10+animalCompanionStats.HD//2+(animalCompanionStats.Con-10)//2} Escape Artist or -4 Strength neg) 8/dy"',
  'Wing Buffet Evolution':
    'Section=companion ' +
    'Note="2 wing attacks inflict %{eidolonDamageMinor}%{eidolonSecondaryDamageBonus} HP each"',

  // Witch
  'Agony Hex':
    'Section=magic ' +
    'Note="R60\' Target suffers nauseated for %{levels.Witch} rd (DC %{hexDC} Fort ends) 1/target/dy"',
  'Blight Hex':
    'Section=magic ' +
    'Note="Touch kills vegetation in %{levels.Witch * 10}\' radius over 1 wk or inflicts -1 Constitution/dy"',
  'Cackle Hex':
    'Section=magic ' +
    'Note="R30\' Extends self agony, charm, evil eye, fortune, and misfortune hex effects for 1 rd"',
  // Cantrips as Summoner
  'Cauldron Hex':
    'Section=feature,skill ' +
    'Note=' +
      '"Has Brew Potion feature",' +
      '"+4 Craft (Alchemy)"',
  'Charm Hex':
    'Section=skill ' +
    'Note="R30\' Improves attitude of target animal or humanoid by %{levels.Witch>=8 ? 2 : 1} (DC %{hexDC} Will neg) for %{intelligenceModifier} rd 1/target/dy"',
  'Coven Hex':
    'Section=feature,magic ' +
    'Note=' +
      '"May participate in a hag coven",' +
      '"R30\' May use aid another to give target w/Coven Hex +1 caster level for 1 rd"',
  'Death Curse Hex':
    'Section=magic ' +
    'Note="R30\' Target becomes fatigued (DC %{hexDC} Will neg), then exhausted, then dies (DC %{hexDC} Fort suffers 4d6+%{levels.Witch} HP) 1/target/dy"',
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
      '"May use self <i>Feather Fall</i> effects at will%1",' +
      '"+4 Swim"',
  'Forced Reincarnation Hex':
    'Section=magic ' +
    'Note="R30\' Target suffers death and <i>Reincarnate</i> effects (DC %{hexDC} Will neg) 1/target/dy"',
  'Fortune Hex':
    'Section=magic ' +
    'Note="R30\' Target gains the better of 2 rolls on choice of ability check, attack, save, or skill check 1/rd for %{levels.Witch>=16 ? 3 : levels.Witch>=8 ? 2 : 1} rd 1/target/dy"',
  "Hag's Eye Hex":
    'Section=magic ' +
    'Note="Can use <i>Arcane Eye</i> effects %{levels.Witch} min/dy%{$\'features.Coven Hex\' ? \\" and share w/witches in 10\' radius\\" : \'\'}"',
  'Healing Hex':
    'Section=magic ' +
    'Note="May use <i>Cure %{levels.Witch>=5 ? \'Moderate\' : \'Light\'} Wounds</i> effects 1/target/dy"',
  'Hex':'Section=feature Note="%V selections"',
  'Life Giver Hex':
    'Section=magic Note="May use <i>Resurrection</i> effects 1/dy"',
  'Major Healing Hex':
    'Section=magic ' +
    'Note="May use <i>Cure %{levels.Witch>=15 ? \'Critical\' : \'Serious\'} Wounds</i> effects 1/target/dy"',
  'Misfortune Hex':
    'Section=magic ' +
    'Note="R30\' Target suffers worse of 2 rolls on all ability checks, attack, saves, and skill checks (DC %{hexDC} Will neg) for %{levels.Witch>=16 ? 3 : levels.Witch>=8 ? 2 : 1} rd 1/target/dy"',
  'Natural Disaster Hex':
    'Section=magic ' +
    'Note="May combine <i>Storm Of Vengeance</i> and <i>Earthquake</i> effects 1/dy"',
  'Nightmares Hex':
    'Section=magic ' +
    'Note="R60\' May use <i>Nightmare</i> effects (DC %{hexDC} Will ends)"',
  'Patron':
    'Section=feature,magic ' +
    'Note=' +
      '"1 selection",' +
      '"Knows additional spells"',
  'Retribution Hex':
    'Section=magic ' +
    'Note="R60\' Target suffers half of damage it inflicts (DC %{hexDC} Will neg) for %{intelligenceModifier} rd"',
  'Slumber Hex':
    'Section=magic ' +
    'Note="R30\' May use <i>Sleep</i> effects w/out HD limit (DC %{hexDC} Will neg) for %{levels.Witch} rd 1/target/dy"',
  'Tongues Hex':
    'Section=magic ' +
    'Note="May use self <i>Comprehend Languages</i>%{levels.Witch>=5 ? \' and <i>Tongues</i>\' : \'\'} effects for %{levels.Witch} min/dy"',
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
    'Section=feature,magic ' +
    'Note=' +
      '"Has Familiar feature",' +
      '"Familiar stores spells"',

  // Barbarian
  'Beast Totem':'Section=combat Note="+%{ragePowerLevel//4+1} AC during rage"',
  'Battle Scavenger':
    'Section=combat ' +
    'Note="Suffers no attack penalty and gains +%{levels.Barbarian//3} damage w/improvised and broken weapons"',
  'Bestial Mount':
    'Section=companion,feature ' +
    'Note=' +
      '"Mount gains +2 Strength during rage",' +
      '"Has Animal Companion feature w/mount"',
  // Blindsight as Pathfinder.js
  'Boasting Taunt':
    'Section=combat ' +
    'Note="Successful Intimidate during rage (+2 per alcoholic drink taken) inflicts shaken on target until attacks self"',
  'Brawler':'Section=combat Note="%V during rage"',
  'Chaos Totem':
    'Section=combat,skill ' +
    'Note=' +
      '"25% chance to ignore crit and sneak attack damage during rage",' +
      '"+4 Escape Artist during rage"',
  'Come And Get Me':
    'Section=combat ' +
    'Note="May suffer +4 foe attack and damage to gain AOO before every foe attack during rage"',
  'Destructive':
    'Section=combat ' +
    'Note="+%{levels.Barbarian//2>?1} damage vs. objects and with sunder"',
  'Disruptive (Barbarian)':
    'Section=combat Note="+4 foe defensive spell DC during rage"',
  'Elemental Fury':
    'Section=combat ' +
    'Note="Suffering %{levels.Barbarian} HP energy damage increases daily rage rd by %{levels.Barbarian//3}"',
  'Elemental Rage':
    'Section=combat Note="Attacks inflict +1d6 HP energy during rage"',
  'Energy Absorption (Rage)':
    'Section=combat ' +
    'Note="May convert energy damage to self to 1/3 temporary HP 1/rage"',
  'Energy Eruption':
    'Section=combat ' +
    'Note="May convert energy damage to self to R60\' line or R30\' cone breath attack of equal HP (DC %{10+ragePowerLevel//2+constitutionModifier} Ref half) 1/rage"',
  'Energy Resistance':
    'Section=save ' +
    'Note="Resistance %{ragePowerLevel//2>?1} to %V chosen energy during rage"',
  'Extreme Endurance':
    'Section=save ' +
    'Note="Remains comfortable to choice of -50F or 140F/Resistance %{(levels.Barbarian-3)//3} to choice of cold or fire"',
  'Fast Rider':'Section=companion Note="Mount gains +10\' speed"',
  'Ferocious Mount':
    'Section=combat ' +
    'Note="May give mount rage benefits when adjacent or mounted during rage; uses equal amount of daily rage rd"',
  'Ferocious Trample':
    'Section=combat ' +
    'Note="Mount trample inflicts 1d8+1.5xStrength (L/H mount 2d6/2d8, DC %{10+levels.Barbarian//2}+Strength Ref half) during rage"',
  'Fiend Totem':
    'Section=combat ' +
    'Note="Successful foe melee attack inflicts 1d6 HP on attacker during rage"',
  'Flesh Wound':
    'Section=combat ' +
    'Note="May reduce damage to half nonlethal w/a successful DC damage Fort 1/rage"',
  'Good For What Ails You':
    'Section=combat ' +
    'Note="Alcohol gives save vs. condition or poison during rage"',
  'Greater Beast Totem':
    'Section=combat,combat ' +
    'Note=' +
      '"Increased Lesser Beast Totem effects",' +
      '"May take a full-attack action after a charge during rage"',
  'Greater Brawler':
    'Section=combat ' +
    'Note="Penalty for Unarmed attack w/both hands is reduced by 2 on-hand and by 6 off-hand during rage"',
  'Greater Chaos Totem':
    'Section=combat ' +
    'Note="DR %{ragePowerLevel//2}/lawful and weapons are chaotic during rage"',
  'Greater Elemental Rage':
   'Section=combat Note="Crit inflicts +1d10 HP energy or better during rage"',
  'Greater Energy Resistance':
    'Section=combat ' +
    'Note="May halve damage from chosen energy attack before applying Energy Resistance 1/rage"',
  'Greater Ferocious Mount':
    'Section=combat ' +
    'Note="May give mount rage power benefits when mounted during rage"',
  'Greater Ferocious Trample':
    'Section=combat ' +
    'Note="Mount may trample targets of same size and overrun during rage"',
  'Greater Fiend Totem':
    'Section=combat ' +
    'Note="During rage, adjacent good creatures suffer 2d6 HP slashing and shaken, neutral creatures shaken"',
  'Greater Hurling':'Section=combat Note="Increased Lesser Hurling effects"',
  'Greater Spirit Totem':
    'Section=combat ' +
    'Note="During rage, spirits inflict 1d8 HP negative energy on adjacent foes and may make a R15\' +%{baseAttack+charismaModifier} attack that inflicts 1d6 HP"',
  'Ground Breaker':
    'Section=combat ' +
    'Note="Successful attack on floor inflicts knocked prone on adjacent creatures (DC 15 Ref neg) and creates difficult terrain 1/rage"',
  'Guarded Life':
    'Section=combat ' +
    'Note="Stabilizes automatically and converts %{ragePowerLevel} HP damage to nonlethal when taken to negative HP during rage"',
  'Hurling':'Section=combat Note="Increased Lesser Hurling effects"',
  'Hurling Charge':
    'Section=combat ' +
    'Note="May make +2 thrown attack while making 20\'+ charge attack during rage"',
  'Improved Savage Grapple':
    'Section=combat,combat ' +
    'Note=' +
      '"Increased Savage Grapple effects",' +
      '"Treated as one size larger for grappling and swallowing"',
  'Inspire Ferocity':
    'Section=combat ' +
    'Note="R30\' May share Reckless Abandon ability with allies for %{charismaModifier} rd during rage"',
  'Invulnerability':
    'Section=combat,combat ' +
    'Note=' +
      '"DR %V/-",' +
      '"DR %V/- vs. nonlethal"',
  'Keen Senses (Barbarian)':
    'Section=feature ' +
    'Note="Has Low-Light Vision (x3 distance if already present)%1%2%3%4"',
  'Knockdown':
    'Section=combat ' +
    'Note="May make trip attack that inflicts %{strengthModifier} HP and knocks prone w/out provoking AOO 1/rage"',
  'Lesser Beast Totem':
    'Section=combat ' +
    'Note="Two claws inflict 1d%V+%{strengthModifier} x%1@20 HP slashing during rage"',
  'Lesser Chaos Totem':
    'Section=combat,save ' +
    'Note=' +
      '"+%V AC vs. lawful foe during rage",' +
      '"+%V vs. confusion, insanity, polymorph, and lawful effects during rage"',
  'Lesser Elemental Rage':
    'Section=combat Note="Attacks inflict +1d6 HP energy for 1 rd 1/rage"',
  'Lesser Fiend Totem':
    'Section=combat ' +
    'Note="Gore inflicts 1d%{features.Small ? 6 : 8}%{strengthModifier<0 ? strengthModifier : strengthModifier>0 ? \'+\' + strengthModifier : \'\'} HP during rage"',
  'Lesser Hurling':
    'Section=combat ' +
    'Note="R%V\' Ranged touched using thrown %1 object inflicts 1d6+%{strengthModifier} HP or more (DC %{10+levels.Barbarian//2+strengthModifier} Ref half) during rage"',
  'Lesser Spirit Totem':
    'Section=combat ' +
    'Note="Spirits\' +%{baseAttack+charismaModifier} attack inflicts 1d4+%{charismaModifier} HP negative energy 1/rd during rage"',
  'Liquid Courage':
    'Section=save ' +
    'Note="Alcohol gives +1 per drink (max +%{ragePowerLevel//4}) vs. mind-affecting effects during rage"',
  'Naked Courage':
    'Section=combat,save ' +
    'Note=' +
      '"+%V AC in no armor",' +
      '"+%{(levels.Barbarian+3)//6} vs. fear in no armor"',
  'Natural Toughness':'Section=combat Note="+%V AC in no armor"',
  'Overbearing Advance':
    'Section=combat ' +
    'Note="Successful overrun inflicts %{strengthModifier} HP during rage"',
  'Overbearing Onslaught':
    'Section=combat ' +
    'Note="May make additional overruns during rage, suffering -2 CMB for each"',
  'Pit Fighter':
    'Section=combat ' +
    'Note="+%{armor==\'None\' ? 2 : 1} CMB or CMD on choice of %{levels.Barbarian//3} combat maneuvers"',
  'Raging Drunk':
    'Section=combat ' +
    'Note="May drink alcohol or potion w/out provoking AOO during rage/Alcohol extends rage 1 rd and inflicts nauseated for 1 rd after rage (Internal Fortitude neg)"',
  'Reckless Abandon':
    'Section=combat ' +
    'Note="May suffer up to -%{ragePowerLevel//4+1} AC to gain equal attack bonus during rage"',
  'Roaring Drunk':
    'Section=save,skill ' +
    'Note=' +
      '"Alcohol gives +1 per drink (max +%{ragePowerLevel//4}) vs. fear during rage",' +
      '"Alcohol gives +1 per drink (max +%{ragePowerLevel//4}) Intimidate during rage"',
  'Savage Grapple':
   'Section=combat ' +
   'Note="%V grappled penalties/May always take AOO vs. grapple; hit gives +2 CMD vs. grapple"',
  'Sixth Sense':
    'Section=combat,combat ' +
    'Note=' +
      '"+%V Initiative",' +
      '"+%V AC during surprise rd"',
  'Skilled Thrower':
    'Section=combat Note="+10\' range for thrown weapons and objects"',
  'Smasher':'Section=combat Note="May ignore object hardness on attack 1/rage"',
  'Spellbreaker (Barbarian)':
    'Section=combat ' +
    'Note="May take AOO after foe failed defensive casting during rage"',
  'Spirit Steed':
    'Section=combat ' +
    'Note="Mount gains magic natural weapons and DR %{ragePowerLevel//2}/magic during rage"',
  'Spirit Totem':
    'Section=combat ' +
    'Note="Spirits give 20% miss chance vs. ranged and non-adjacent attacks during rage"',
  'Staggering Drunk':
    'Section=combat ' +
    'Note="Alcohol gives +1 AC per drink (max +%{ragePowerLevel//4}) during rage"',
  'Witch Hunter':
    'Section=combat ' +
    'Note="+%{ragePowerLevel//4+1} damage vs. spell users during rage"',

  // Bard
  'Arcane Armor':
    'Section=feature,magic ' +
    'Note=' +
      '"Has %V Armor Proficiency",' +
      '"Suffers no arcane spell failure in %V armor"',
  'Arcane Bond (Bard)':
    'Section=magic Note="May cast known spell through object"',
  'Arcane Insight':
    'Section=magic,save,skill ' +
    'Note=' +
      '"+4 caster level to overcome protection vs. divination",' +
      '"+4 vs. illusions",' +
      '"May find and disable magical traps/+4 vs. disguises"',
  'Arcane Investigation':'Section=magic Note="Has access to additional spells"',
  'Battle Song':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to affect all allies as <i>Rage</i> spell"',
  'Berserkergang':
    'Section=magic ' +
    'Note="May use Bardic Performance to suppress pain, stun, and fear effects and give DR5/- to %{(levels.Bard-9)//3} targets"',
  'Bladethirst':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to give weapon of one ally choice of +%{(levels.Bard-3)//3} attack and damage or one of defending, distance, ghost touch, keen, mighty cleaving, returning, shock, shocking burst, seeking, speed, or wounding properties"',
  'Call The Storm':
    'Section=magic ' +
    'Note="May use Bardic Performance to use <i>Control Water</i>, <i>Control Weather</i>, <i>Control Winds</i>, or <i>Storm Of Vengeance</i> effects"',
  'Careful Teamwork':
    'Section=magic ' +
    'Note="R30\' May use 3 rd Bardic Performance to give allies +%{(levels.Bard+7)//6} Initiative, Perception, Disable Device, Reflex saves, AC vs. traps, and flat-footed AC for 1 hr"',
  'Disappearing Act':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to cause creatures to overlook %{(levels.Bard+7)//6} allies (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Dramatic Subtext':
    'Section=magic ' +
    'Note="May use 2 rd Bardic Performance to cast spell w/out visual or audible components (opposed Perception vs. Sleight Of Hand to detect)"',
  'Dweomercraft':
    'Section=magic ' +
    'Note="May use Bardic Performance to give allies +%{(levels.Bard+7)//6} caster level checks, concentration, and spell attack"',
  'Expanded Repertoire':
    'Section=magic ' +
    'Note="Knows %{(levels.Bard+2)//4} additional spells taken from any arcane class"',
  'Extended Performance':
    'Section=magic ' +
    'Note="May expend a spell slot to extend Bardic Performance effects 1 rd/spell level"',
  'Eye For Detail':
    'Section=skill,skill ' +
    'Note=' +
      '"+%V Knowledge (Local)/+%V Perception/+%V Sense Motive",' +
      '"+%V Diplomacy (gather information)"',
  'Gladhanding':
    'Section=skill ' +
    'Note="Receives dbl normal pay from performing/May use Bluff to improve target attitude for 1 min; 1 step worse afterwards"',
  'Glorious Epic':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to inflict flat-footed (DC %{10+levels.Bard//2+charismaModifier} Will neg) on foes"',
  'Greater Stealspell':
    'Section=magic ' +
    'Note="Successful Stealspell reveals target\'s spells and any spell resistance; may instead steal SR %{levels.Bard//2}"',
  'Harmless Performer':
    'Section=magic ' +
    'Note="May use Bardic Performance to cause foes to lose attack on self (DC %{10+levels.Bard//2+charismaModifier} Will neg; DC %{10+levels.Bard//2+charismaModifier} concentration to redirect targeted spell)"',
  'Heraldic Expertise':
    'Section=skill,skill ' +
    'Note=' +
      '"+%V Diplomacy/+%V Knowledge (History)/+%V Knowledge (Local)/+%V Knowledge (Nobility)",' +
      '"May reroll Diplomacy, Knowledge (History), Knowledge (Local), or Knowledge (Nobility) %{1+levels.Bard//5}/dy"',
  'Incite Rage':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to affect target as <i>Rage</i> spell (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Inspiring Blow':
    'Section=combat ' +
    'Note="May use Bardic Performance following crit to give%{charismaModifier>0 ? \' self \' + charismaModifier + \' temporary HP and\' : \'\'} R30\' allies +1 next attack for 1 rd"',
  'Lamentable Belaborment':
    'Section=magic ' +
    'Note="May use Bardic Performance to inflict choice of dazed or confused on fascinated target (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Madcap Prank':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to inflict on target random choice of blinded, dazzled, deafened, entangled, prone, or nauseated (DC %{10+levels.Bard//2+charismaModifier} Ref neg) for 1 rd"',
  'Magic Lore':
    'Section=save,skill ' +
    'Note=' +
      '"+4 vs. magical traps and language- and symbol-based effects",' +
      '"+%{levels.Bard//2} Spellcraft (identify items and decipher scrolls)/May use Disable Device on magical traps"',
  'Magical Talent':
    'Section=skill ' +
    'Note="+%1 Knowledge (Arcana)/+%1 Spellcraft/+%1 Use Magic Device"',
  'Mass Bladethirst':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to give +1 or more attack bonus to weapons of multiple allies"',
  'Mass Slumber Song':
    'Section=magic ' +
    'Note="R30\' May cause all fascinated targets to sleep (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Master Of Deception':
    'Section=skill,skill ' +
    'Note=' +
      '"+%1 Bluff/+%1 Sleight Of Hand/+%1 Stealth",' +
      '"May use Disable Device to disarm magical traps"',
  'Metamagic Mastery (Bard)':
    'Section=magic ' +
    'Note="May end Bardic Performance to apply metamagic feat to spell w/out extending casting time"',
  'Mockery':
    'Section=magic ' +
    'Note="May use Bardic Performance to inflict -%{(levels.Bard+5)//4>?2} on target Charisma and Charisma-based skill checks"',
  'Naturalist':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to give allies +%{(levels.Bard+5)//6} AC, attack, and saves vs. abilities of creatures identified w/Knowledge check"',
  'Pedantic Lecture':
    'Section=magic ' +
    'Note="May use Bardic Performance to inflict choice of sleep, dazed, or confused on all fascinated creatures (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Probable Path':
    'Section=feature ' +
    'Note="May take 10 on any d20 roll %{(levels.Bard-7)//3>?1}/dy"',
  'Quick Change':
    'Section=skill ' +
    'Note="May don disguise as a standard action (-5 check)/May use Bluff as a diversion to hide/May take 10 on Bluff and Disguise; may take 20 %{(levels.Bard+1)//6}/dy"',
  'Rallying Cry':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to give allies use of self Intimidate check for save vs. fear and despair"',
  'Satire':
    'Section=magic ' +
    'Note="May use Bardic Performance to inflict -%{(levels.Bard+7)//6} on attack, damage, and saves vs. fear and charm on foes w/in hearing"',
  'Scandal':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to inflict on foes 50% chance of attacking nearest creature (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Sea Legs':
    'Section=combat,save ' +
    'Note="+2 CMD vs. grapple, overrun, and trip",' +
    '"+4 vs. air, water, slip, trip, and knocked prone"',
  'Sea Shanty':
    'Section=skill ' +
    'Note="R30\' May use Bardic Performance to allow Allies to use self Perform to save vs. exhausted, fatigued, nauseated, and sickened"',
  'Show Yourselves':
    'Section=combat ' +
    'Note="R30\' May use Bardic Performance to compel foes to reveal selves (DC %{10+levels.Bard//2+charismaModifier} Will neg) and to prevent attacks until fully revealed"',
  'Slip Through The Crowd':
    'Section=magic ' +
    'Note="Disappearing Act allows affected allies to move through occupied squares and attack"',
  'Slumber Song':
    'Section=magic ' +
    'Note="May cause one fascinated target to sleep (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Sneakspell':
    'Section=magic ' +
    'Note="%{levels.Bard>=6?(levels.Bard>=14?\'+4\':\'+2\')+\' caster level vs. SR and \':\'\'}+%{(levels.Bard+6)//8} spell DC and Bardic Performance vs. foes denied Dexterity bonus"',
  'Song Of The Fallen':
    'Section=magic ' +
    'Note="May use 10 rd Bardic Performance to summon barbarian warriors as %{levels.Bard>=19 ? \'iron\' : levels.Bard>=16 ? \'bronze\' : levels.Bard>=13 ? \'brass\' : \'silver\'} <i>horn of valhalla</i>"',
  'Spell Catching':
    'Section=magic ' +
    'Note="Successful save and caster level check (DC 10 + foe caster level) negates and allows immediate recast of foe spell targeted on self; costs Bardic Performance rds equal to spell level"',
  'Spell Suppression':
    'Section=magic ' +
    'Note="May use Bardic Performance to counter Spellcraft-identified spell of level equal to or less than performance rds"',
  'Stealspell':
    'Section=magic ' +
    'Note="Touch transfers spell to self (DC %{10+levels.Bard//2+charismaModifier} Will neg) for duration of Bardic Performance"',
  'Still Water':
    'Section=magic ' +
    'Note="R30\' May use Bardic Performance to give listeners -%{levels.Bard} DC (min DC 10) for Profession (Sailor), Swim, Acrobatics (shipboard), and Climb (shipboard); 10 rd performance extends effect to 1 hr"',
  'Streetwise':
    'Section=skill,skill ' +
    'Note=' +
      '"+%V Bluff/+%V Disguise/+%V Knowledge (Local)/+%V Sleight Of Hand",' +
      '"+%V Diplomacy (crowds or gather information)/+%V Intimidate (crowds)"',
  'True Confession':
    'Section=skill ' +
    'Note="May use %{levels.Bard>=20 ? 1 : levels.Bard>=15 ? 2 : 3} rd Bardic Performance and successful Sense Motive to cause target to reveal lie or compulsion (DC %{10+levels.Bard//2+charismaModifier} Will neg)"',
  'Wand Mastery':
    'Section=magic ' +
    'Note="Uses Charisma bonus to calculate save DC%{levels.Bard>=16 ? \' and caster level to calculate effects\' : \'\'} of spells cast from wands"',
  'Whistle The Wind':
   'Section=magic ' +
   'Note="May use Bardic Performance to use <i>Gust Of Wind</i> effects; 5 rd performance extends effect to 1 min"',
  'Wide Audience':
    'Section=magic ' +
    'Note="Bardic Performance affects %{60+(levels.Bard-5)//5*20}\' cone, %{30+(levels.Bard-5)//5*10}\' radius, or +%{(levels.Bard-5)//5} targets"',
  'World Traveler':
    'Section=skill,skill ' +
    'Note=' +
      '"+%1 Knowledge (Geography)/+%1 Knowledge (Local)/+%1 Knowledge (Nature)/+%1 Linguistics",' +
      '"May reroll Knowledge (Geography), Knowledge (Local), Knowledge (Nature), or Linguistics %{(levels.Bard+5)//5}/dy"',

  // Cleric
  'Adoration':
    'Section=combat ' +
    'Note="May force foe to forego self attack (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{wisdomModifier+3}/dy"',
  'Animate Servant':
    'Section=magic ' +
    'Note="May use <i>Animate Object</i> effects %{(levels.Cleric-4)//4}/dy"',
  'Anything To Please':
    'Section=magic ' +
    'Note="R30\' Target attempts to please self (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{(levels.Cleric-4)//4}/dy"',
  'Arcane Beacon':
    'Section=magic ' +
    'Note="15\' radius gives arcane casters choice of +1 caster level or DC for 1 rd %{3+wisdomModifier}/dy"',
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
    'Note="R30\' May force foes to repeat prior action (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) %{levels.Cleric} rd/dy"',
  'Bestow Resolve':
    'Section=magic ' +
    'Note="R20\' May give allies %{levels.Cleric+wisdomModifier} temporary HP for 1 min %{(levels.Cleric-4)//4}/dy"',
  'Binding Ties':
    'Section=magic ' +
    'Note="Touch transfers condition to self and gives immunity for %{levels.Cleric} rd %{wisdomModifier+3}/dy"',
  'Blinding Flash':
    'Section=magic ' +
    'Note="20\' radius blinds creatures up to %{levels.Cleric-1} HD for 1d4 rd (DC %{10+levels.Cleric//2+wisdomModifier} Fort neg) and dazzles all creatures for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Body Of Ice':
    'Section=combat ' +
    'Note="May suffer dbl damage from fire to gain immunity to cold and DR 5/- %{levels.Cleric} rd/dy"',
  'Cloud Of Smoke':
    'Section=magic ' +
    'Note="R30\' 5\' radius inflicts -2 attack and Perception while in radius + 1 rd and gives concealment %{wisdomModifier+3}/dy"',
  'Command':
    'Section=magic ' +
    'Note="May use <i>Command</i> effects (DC %{10+levels.Cleric//2+wisdomModifier} Will neg) 1/target/dy %{wisdomModifier+3}/dy"',
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
    'Note="Concentration allows self to see through %{6+levels.Cleric}\\" touched material for 10 min after 1 min touch %{wisdomModifier+3}/dy"',
  "Elysium's Call":
    'Section=magic ' +
    'Note="Touch gives immediate save reroll vs. charm and compulsion; also +2 saves vs. charm and compulsion, +2 CMB to escape grapple, and negation of 5\' difficult terrain/rd for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Enlarge':'Section=magic Note="May dbl size for 1 rd %{wisdomModifier+3}/dy"',
  'Eyes Of The Hawk':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Initiative (surprise round)",' +
      '"+%V Perception"',
  'Fearful Touch':
    'Section=combat ' +
    'Note="Touch inflicts -2 attack on self, loss of fear immunity, and -%{levels.Cleric//2>?1} save vs. fear for 1 rd %{wisdomModifier+3}/dy"',
  'Feather Subdomain':
    'Section=magic,skill ' +
    'Note=' +
      '"Casting flying spells on self improves maneuverability by 1 step",' +
      '"Fly is a class skill"',
  'Ferocious Strike':
    'Section=combat ' +
    'Note="Called attack inflicts +%{levels.Cleric//2} HP %{wisdomModifier+3}/dy"',
  'Fury Of The Abyss':
    'Section=combat ' +
    'Note="May suffer -2 AC to gain +%{levels.Cleric//2>?1} attack, damage, CMB, and CMD for 1 rd %{wisdomModifier+3}/dy"',
  'Gale Aura':
    'Section=magic ' +
    'Note="30\' radius inflicts difficult terrain when moving toward self and no 5\' step %{levels.Cleric} rd/dy"',
  'Gift Of Life':
    'Section=magic ' +
    'Note="Touched corpse dead up to 1 min regains life w/%{levels.Cleric//2} HP for %{levels.Cleric} rd %{(levels.Cleric-4)//4}/dy"',
  'Guarded Hearth':
    'Section=magic ' +
    'Note="10 min ritual gives targets in %{levels.Cleric//2*5}\' radius notice of intruders and +%{wisdomModifier} attack and saves for %{levels.Cleric} hr 1/dy"',
  "Hell's Corruption":
    'Section=combat ' +
    'Note="Touch inflicts -2 saves and worse of two rolls on opposed skill checks for %{levels.Cleric//2>?1} rd %{wisdomModifier+3}/dy"',
  'Honor Bound':
    'Section=magic ' +
    'Note="Touch gives additional saves vs. existing charm and compulsion effects %{wisdomModifier+3}/dy"',
  'Insane Focus':
    'Section=magic ' +
    'Note="Touch gives +4 save vs. mind-affecting effects and immunity to confusion (failed save ends and confuses for 1 rd) for 1 min %{wisdomModifier+3}/dy"',
  'Inspiring Command (Cleric)':
    'Section=magic ' +
    'Note="R30\' Gives %{levels.Cleric//3+1} allies +2 attack, AC, CMD, and skill checks for 1 rd"',
  'Killing Blow':
    'Section=combat ' +
    'Note="Crit inflicts %{levels.Cleric//2} HP bleed damage %{(levels.Cleric-4)//4}/dy"',
  "Liberty's Blessing":
    'Section=magic ' +
    'Note="Touch gives save vs. existing spell or effect w/in 1 min %{wisdomModifier+3}/dy"',
  'Malign Eye':
    'Section=magic ' +
    'Note="R30\' Inflicts -2 save vs. self spells on target for 1 min or until hits self %{wisdomModifier+3}/dy"',
  'Metal Fist':
    'Section=combat ' +
    'Note="Unarmed attack inflicts 1d6+%{strengthModifier} HP, ignoring hardness 10, w/out provoking AOO for 1 rd %{wisdomModifier+3}/dy"',
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
      '"Has Low-Light Vision feature for 1 rd %{wisdomModifier+3}/dy"',
  'Protective Aura':
    'Section=magic ' +
    'Note="R30\' May use <i>Protection From Evil</i> effects on allies %{levels.Cleric} rd/dy"',
  'Purifying Touch':
    'Section=magic ' +
    'Note="Touch gives additional saves vs. existing effects %{(levels.Cleric-2)//6}/dy"',
  'Rage (Cleric)':
    'Section=combat ' +
    'Note="+4 Strength, +4 Constitution, +2 Will, -2 AC and %1 powers %{levels.Cleric} rd/dy"',
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
    'Note="R30\' Target gains the better of 2 Initiative rolls %{wisdomModifier+3}/dy"',
  'Silver-Tongued Haggler':
    'Section=skill ' +
    'Note="+%{levels.Cleric//2>?1} Bluff, Diplomacy, or Sense Motive %{wisdomModifier+3}/dy"',
  'Speak With Dead':
    'Section=magic ' +
    'Note="May receive answer to question from corpse w/no saving throw %{levels.Cleric}/dy"',
  'Sudden Shift':
    'Section=combat ' +
    'Note="After foe miss, may teleport 10\' within foe threat range %{wisdomModifier+3}/dy"',
  'Surge':
    'Section=combat ' +
    'Note="Wave inflicts +%{levels.Cleric-0+wisdomModifier} CMB bull rush or drag %{wisdomModifier+3}/dy"',
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
    'Note="Hit w/touched weapon causes 1 HP bleeding/rd (DC 15 Heal or cure ends) for %{levels.Cleric//2} rd %{(levels.Cleric-4)//4}/dy"',

  // Druid
  'Animal Shaman':
    'Section=magic,skill ' +
    'Note=' +
      '"+4 Wild Shape level w/totem animal",' +
      '"+4 Wild Empathy w/totem animal"',
  'Animal Shaman Feat Bonus':'Section=feature Note="%V selections"',
  'Aquatic Adaptation':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in aquatic terrain",' +
      '"Cannot be tracked in aquatic terrain",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, Survival, and Swim in aquatic terrain"',
  'Aquatic Druid':
    'Section=skill ' +
    'Note="Wild Empathy works only with swimming and water creatures; may influence those w/intelligence below 4"',
  'Arctic Endurance':
    'Section=save Note="Remains comfortable down to -50F/Immune to dazzled"',
  'Arctic Native':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in cold or icy terrain",' +
      '"Cannot be tracked in cold or icy terrain",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, and Survival in cold or icy terrain"',
  'Bear Totem':
    'Section=feature ' +
    'Note="Must choose Animal Companion (bear) or one of Animal, Earth, Protection, or Strength Domains for Nature Bond"',
  'Blight Druid':
    'Section=feature ' +
    'Note="Must choose Familiar or Darkness, Death, or Destruction Domain for Nature Bond"',
  'Blightblooded':
    'Section=save Note="Immune to disease, sickened, and nauseated"',
  'Canny Charger':
    'Section=combat ' +
    'Note="May pass through allies\' squares and turn during charge/+4 AC vs. enemy charge/+4 damage when readied vs. charge"',
  'Cave Druid':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"May choose Darkness Domain, but not Air Domain or Weather Domain, for Nature Bond",' +
      '"Cannot Wild Shape into a plant creature%{levels.Druid>=10 ? \'/May Wild Shape into an ooze w/immunity to poison, sneak attack, and crit\':\'\'}",' +
      '"-4 Wild Empathy (oozes)"',
  'Cavesense':
    'Section=skill ' +
    'Note="Knowledge (Dungeoneering) is a class skill/Knowledge (Geography) is not a class skill/+2 Knowledge (Dungeoneering)/+2 Survival"',
  'Deep Diver':
    'Section=combat ' +
    'Note="DR %{levels.Druid//2}/slashing or piercing vs. grappling and crushing/Immune to deep water pressure"',
  'Desert Druid':
    'Section=magic ' +
    'Note="Cannot Wild Shape into a plant creature%{levels.Druid>=10 ? \'/May Wild Shape into a vermin\':\'\'}"',
  'Desert Endurance':
    'Section=feature ' +
    'Note="Remains comfortable to 140F and has reduced need for food and drink"',
  'Desert Native':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in desert terrain",' +
      '"Cannot be tracked in desert terrain",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, and Survival in desert terrain"',
  'Dunemeld':
    'Section=magic,skill ' +
    'Note=' +
      '"May assume insubstantial sand form w/10\' land and burrow speed",' +
      '"Transformation gives +%{levels.Druid} Stealth in desert terrain"',
  'Eagle Totem':
    'Section=feature ' +
    'Note="Must choose Animal Companion (eagle) or one of Air, Animal, Nobility, or Weather Domains for Nature Bond"',
  'Flurry Form':
    'Section=magic,skill ' +
    'Note=' +
      '"May assume insubstantial snow flurry form",' +
      '"Transformation gives +%{levels.Druid} Stealth in cold terrain"',
  'Icewalking':
    'Section=ability,skill ' +
    'Note=' +
      '"Suffers no speed penalty on ice or snow; does not break through snow crust or thin ice",' +
      '"Suffers no Acrobatics, Climb, or Stealth penalty on ice or snow"',
  'Jungle Guardian':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in jungle terrain",' +
      '"Cannot be tracked in jungle terrain",' +
      '"+%{levels.Druid//2} Climb, Knowledge (Geography), Perception, Stealth, and Survival in jungle terrain"',
  'Lightfoot':'Section=feature Note="Undetectable via tremorsense"',
  'Lion Totem':
    'Section=feature ' +
    'Note="Must choose Animal Companion (lion) or one of Animal, Glory, Nobility, or Sun Domains for Nature Bond"',
  'Lorekeeper':
    'Section=skill ' +
    'Note="+2 Diplomacy/+2 Knowledge (History)/+2 Knowledge (Local)/+2 Knowledge (Nobility)/Diplomacy is a class skill/Knowledge (History) is a class skill/Knowledge (Local) is a class skill/Knowledge (Nobility) is a class skill"',
  'Marshwight':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in swamp terrain",' +
      '"Cannot be tracked in swamp terrain",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, Survival, and Swim in swamp terrain"',
  'Mental Strength':'Section=save Note="Immune to charm and compulsion"',
  'Miasma':
    'Section=combat ' +
    'Note="Inflicts sickened on adjacent creatures (DC %{10+levels.Druid//2+wisdomModifier} Fort neg) for 1 rd 1/creature/dy; animals, feys, and plants are instead nauseated for 1 rd, then sickened for 1 min"',
  'Mountain Druid':
    'Section=magic ' +
    'Note="Cannot Wild Shape into a plant creature%{levels.Druid>=12 ? \'/May Wild Shape into a giant\':\'\'}"',
  'Mountain Stance':
    'Section=combat,save ' +
    'Note=' +
      '"+4 CMD vs. forced movement attempts",' +
      '"Immune to petrified/+4 vs. forced movement"',
  'Mountain Stone':
    'Section=magic Note="May transform into a stone outcrop at will"',
  'Mountaineer':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in mountainous terrain",' +
      '"Cannot be tracked in mountainous terrain",' +
      '"+%{levels.Druid//2} Climb, Knowledge (Geography), Perception, Stealth, and Survival in mountainous terrain"',
  'Natural Swimmer':'Section=ability Note="%V\' Swim speed"',
  'Plaguebearer':
    'Section=combat ' +
    'Note="Contact inflicts disease on attacker (DC %{10+levels.Druid//2+wisdomModifier} Fort neg and immune for 1 dy)"',
  'Plains Traveler':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+%{levels.Druid//2} Initiative in plains terrain",' +
      '"Cannot be tracked in plains terrain",' +
      '"+%{levels.Druid//2} Knowledge (Geography), Perception, Stealth, and Survival in plains terrain"',
  'Pond Scum':
    'Section=combat,save ' +
    'Note=' +
      '"DR %{levels.Druid//2}/- vs. swarms",' +
      '"+4 vs. disease and abilities of monstrous humanoids"',
  "Resist Ocean's Fury":
    'Section=save ' +
    'Note="+4 vs. water spells and abilities of aquatic and water creatures"',
  'Resist Subterranean Corruption':
    'Section=save Note="+2 vs. abilities of oozes and aberrations"',
  'Resist Temptation':'Section=save Note="+2 vs. divinations and enchantments"',
  'Run Like The Wind':
    'Section=ability,ability ' +
    'Note=' +
      '"+10\' Speed in light or no armor",' +
      '"May dbl speed for 1 rd 1/hr"',
  'Sandwalker':
    'Section=ability,skill ' +
    'Note=' +
      '"Suffers no speed penalty in sand or desert",' +
      '"Suffers no Acrobatics or Stealth penalty in sand or desert"',
  'Savanna Ambush':
    'Section=combat,skill ' +
    'Note=' +
      '"Self gains concealment when prone in natural surroundings and may stand from prone during surprise round as an immediate action",' +
      '"Suffers no Stealth penalty when prone; -5 penalty when crawling"',
  'Seaborn':
    'Section=ability,feature ' +
    'Note=' +
      '"Increased Natural Swimmer effects",' +
      '"Has aquatic subtype and amphibious trait/Remains comfortable down to -50F"',
  'Serpent Totem':
    'Section=feature ' +
    'Note="Must choose Animal Companion (snake) or one of Animal, Charm, Trickery, or Water Domains for Nature Bond"',
  'Shaded Vision':
    'Section=save ' +
    'Note="+2 vs. gaze, figments, and patterns/Immune to blinded and dazzled"',
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
      '"Remains comfortable to -50F",' +
      '"Immune to altitude sickness",' +
      '"Retains Dexterity bonus during climb"',
  'Spontaneous Casting':
    'Section=magic Note="May cast domain spell in place of prepared spell"',
  'Sure-Footed (Druid)':
    'Section=ability,skill ' +
    'Note=' +
      '"Suffers no speed penalty on slopes, rubble, or scree",' +
      '"Suffers no Acrobatics or Stealth penalty on slopes, rubble, or scree"',
  'Swamp Strider':
    'Section=ability,skill ' +
    'Note=' +
      '"Suffers no speed penalty in bogs or undergrowth",' +
      '"Suffers no Acrobatics or Stealth penalty in bogs or undergrowth"',
  'Torrid Endurance':
    'Section=feature,save ' +
    'Note=' +
      '"Remains comfortable to 140F",' +
      '"+4 vs. disease and exceptional abilities of animals and magical beasts"',
  'Totem Transformation (Bear)':
    'Section=magic ' +
    'Note="Self may use <i>Speak With Animals</i> w/mammals at will and gains one of: +10\' speed and +4 Swim; Low-Light Vision and Scent; +2 AC and Endurance; 1d6 HP bite, 1d4 HP claws, and +2 grapple CMB for %{levels.Druid} min/dy"',
  'Totem Transformation (Eagle)':
    'Section=magic ' +
    'Note="Self may use <i>Speak With Animals</i> w/birds at will and gains one of: 30\' fly speed; Low-Light Vision and +4 Perception; 1d4 HP bite and 1d4 HP talons for %{levels.Druid} min/dy"',
  'Totem Transformation (Lion)':
    'Section=magic ' +
    'Note="Self may use <i>Speak With Animals</i> w/felines at will and gains one of: +20\' speed; Low-Light Vision and Scent; 1d4 HP bite, 1d4 HP claws, rake, and +2 grapple CMB for %{levels.Druid} min/dy"',
  'Totem Transformation (Serpent)':
    'Section=magic ' +
    'Note="Self may use <i>Speak With Animals</i> w/reptiles at will and gains one of: 20\' climb and 20\' swim; +2 AC; Low-Light Vision and Scent; +2 grapple CMB and 1d4 HP bite plus 1 Constitution damage poison for %{levels.Druid} min/dy"',
  'Totem Transformation (Wolf)':
    'Section=magic ' +
    'Note="Self may use <i>Speak With Animals</i> w/canines at will and gains one of: +20\' speed; Low-Light Vision, Scent, and +4 Survival (tracking via scent); 1d4 HP bite with trip and +2 trip CMB for %{levels.Druid} min/dy"',
  'Totemic Summons':
    'Section=magic ' +
    'Note="May cast <i>Summon Nature\'s Ally</i> to summon %V with %{levels.Druid} temporary HP"',
  'Tunnelrunner':
    'Section=ability Note="May move at full speed through narrow passages"',
  'Urban Druid':
    'Section=feature ' +
    'Note="Must choose Nature Bond from Charm, Community, Knowledge, Nobility, Protection, Repose, Rune, and Weather domains"',
  'Verdant Sentinel':
    'Section=magic Note="May cast <i>Tree Shape</i> at will"',
  'Vermin Empathy':
    'Section=skill ' +
    'Note="+%{levels.Druid+charismaModifier} Diplomacy (vermin, disease-bearing)/+%{levels.Druid+charismaModifier-4} Diplomacy (other animals)"',
  'Wolf Totem':
    'Section=feature ' +
    'Note="Must choose Animal Companion (wolf) or one of Animal, Community, Liberation, or Travel Domains for Nature Bond"',

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
      '"Suffers no Ride armor penalty"',
  'Backswing':
    'Section=combat ' +
    'Note="+%V damage on second and following attacks w/two-handed weapon"',
  'Careful Claw':
    'Section=combat ' +
    'Note="Reduces contact damage from a natural attack by %{levels.Fighter//2}"',
  'Critical Specialist':
    'Section=combat ' +
    'Note="Foe suffers +4 DC on crit effects from chosen weapon"',
  'Crossbow Expert':'Section=combat Note="+%V attack and damage w/crossbows"',
  'Deadly Critical':
    'Section=combat ' +
    'Note="May add 1 to crit multiplier w/chosen weapon %{(levels.Fighter-10)//3}/dy"',
  'Deadly Defense':
    'Section=combat ' +
    'Note="May make AOO on every attacking foe after a full-attack action w/both weapons"',
  'Deadshot':'Section=combat Note="+%V damage w/readied crossbow"',
  'Deceptive Strike':
    'Section=combat,skill ' +
    'Note=' +
     '"+%{(levels.Fighter+2)//4} CMB and CMD on disarm",' +
     '"+%{(levels.Fighter+2)//4} Bluff (feint or create distraction to hide)"',
  'Defensive Flurry':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+1)//4} AC when taking a full-attack action w/two weapons"',
  'Deft Doublestrike':
    'Section=combat ' +
    'Note="May make disarm, sunder, or trip w/out provoking AOO after hitting foe w/both weapons"',
  'Deft Shield':
    'Section=combat,skill ' +
    'Note=' +
      '"Reduces tower shield attack penalty by %V",' +
      '"Reduces tower shield skill check penalty by %V"',
  'Devastating Blow':
    'Section=combat ' +
    'Note="May suffer -5 two-handed weapon attack for crit threat on any hit"',
  'Doublestrike':
    'Section=combat Note="May attack w/two weapons as a single action"',
  'Elusive':'Section=combat Note="+%V AC in light or no armor"',
  'Equal Opportunity':'Section=combat Note="May make a two-weapon AOO"',
  'Evasive Archer':
    'Section=combat Note="+%{levels.Fighter>=17?4:2} AC vs. ranged attacks"',
  'Expert Archer':'Section=combat Note="+%V attack and damage w/bows"',
  'Fleet Footed':
    'Section=ability,skill ' +
    'Note=' +
      '"+10 Speed",' +
      '"May take 10 on Acrobatics when threatened/May take 20 on Acrobatics %{levels.Fighter//5}/dy"',
  'Flexible Flanker':'Section=combat Note="May flank from an adjacent square"',
  'Greater Deadshot':'Section=combat Note="Increased Deadshot effects"',
  'Greater Power Attack':
    'Section=combat ' +
    'Note="Using Power Attack w/a two-handed weapon increases damage bonus to +%V"',
  'Greater Savage Charge':
    'Section=combat,combat ' +
    'Note=' +
      '"Increased Savage Charge effects",' +
      '"May charge past allies and over difficult terrain"',
  'Hawkeye':
    'Section=combat,skill ' +
    'Note=' +
      '"+%V\' bow range",' +
      '"+%V Perception"',
  'Improved Balance':
    'Section=combat ' +
    'Note="Reduces two-weapon fighting penalties by 1 or treats one-handed weapon in off hand as a light weapon"',
  'Improved Deadshot':
    'Section=combat Note="Crossbow readied attack negates target Dexterity AC bonus"',
  'Indomitable Steed':
    'Section=combat Note="Self and mount gain DR 5/- when mounted"',
  'Interference':
    'Section=combat ' +
    'Note="Successful disarm or trip maneuver makes foe flat-footed for 1 rd or until hit"',
  'Irresistible Advance':
    'Section=combat Note="+%V CMB on bull rush and overrun"',
  'Leap From The Saddle':
    'Section=combat ' +
    'Note="Successful DC 20 Ride check allows a full-attack action after mount moves"',
  'Leaping Attack':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} attack and damage after 5\' move"',
  'Meteor Shot':
    'Section=combat ' +
    'Note="May suffer -4 attack to have a successful crossbow attack also inflict bull rush or trip"',
  'Mirror Move':
    'Section=combat Note="+%{(levels.Fighter+1)//4} AC vs. chosen weapon"',
  'Mounted Mettle':
    'Section=combat ' +
    'Note="Self and mount gain +%{(levels.Fighter-1)//4} attack and damage when adjacent or mounted"',
  'Natural Savagery':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} attack and damage w/natural weapons and grapple CMB/CMD"',
  'Natural Weapon Mastery':
    'Section=combat ' +
    'Note="+1 damage multiplier and automatically confirms crit w/chosen natural weapon"',
  'Overhand Chop':
    'Section=combat Note="+%V damage a on single attack w/a two-handed weapon"',
  'Penetrating Shot':
    'Section=combat ' +
    'Note="Crit w/crossbow threatens additional inline targets w/a -4 attack"',
  'Perfect Balance':
    'Section=combat Note="Reduces two-weapon fighting penalties by 1"',
  'Phalanx Fighting':
    'Section=combat Note="May use a polearm or spear 1-handed w/a shield"',
  'Piledriver':
    'Section=combat ' +
    'Note="May make bull rush or trip w/out provoking AOO after a successful single attack w/a two-handed weapon"',
  'Pole Fighting':
    'Section=combat ' +
    'Note="May make %{levels.Fighter<18 ? (levels.Fighter-18)//4 + \' \' : \'\'}spear or polearm attack vs. adjacent foes"',
  'Polearm Parry':
    'Section=combat ' +
    'Note="May give an ally attacked by a threatened foe +2 AC and DR 5/- vs. attack"',
  'Polearm Training':
    'Section=combat Note="+%V attack and damage w/spears and polearms"',
  'Quick Sniper':
    'Section=combat,skill ' +
    'Note=' +
      '"May return fire immediately w/a loaded crossbow when hit by a ranged attack",' +
      '"+%{levels.Fighter//2} Stealth when sniping"',
  'Ranged Defense':
    'Section=combat Note="DR 5/- vs. ranged/May catch and re-fire arrows"',
  'Rapid Attack':
    'Section=combat ' +
    'Note="May combine a move w/a full-attack action, but loses highest bonus attack"',
  'Ready Pike':
    'Section=combat ' +
    'Note="May brace weapon as an immediate action for +%{(levels.Fighter-1)//4} attack and damage %{(levels.Fighter-1)//4}/dy"',
  'Relentless Steed':
    'Section=combat,skill ' +
    'Note=' +
      '"Mount may move full speed with heavy load",' +
      '"May reroll Ride or mount save %{(levels.Fighter-7)//4}/dy"',
  'Reliable Strike':
    'Section=combat ' +
    'Note="May reroll attack, crit, miss chance, or damage w/chosen weapon %{levels.Fighter//5}/dy"',
  'Reversal':
    'Section=combat ' +
    'Note="Successful disarm maneuver redirects attack from self to target"',
  'Ride Them Down':
    'Section=combat ' +
    'Note="May take a full-attack action%{features.Trample ? \' or overrun\' : \'\'} during mount move"',
  'Safe Shot':'Section=combat Note="%V attack does not provoke AOO"',
  'Savage Charge':
    'Section=combat ' +
    'Note="May suffer -%V AC to gain +%{levels.Fighter//2} bull rush and overrun and make a +%{levels.Fighter//2} attack w/a natural weapon at end of a charge"',
  'Shattering Strike':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+2)//4} CMB and CMD on sunder and damage vs. objects"',
  'Shield Ally':
    'Section=combat ' +
    'Note="May use heavy or tower shield move to give self and adjacent allies +%{levels.Fighter>=17 ? 4 : 2} AC and +%{levels.Fighter>=17 ? 2 : 1} Reflex%{levels.Fighter>=13 ? \' (or 1 adjacent ally \' + (levels.Fighter>=17 ? \'Improved Evasion, +8 AC, and +4 Reflex)\' : \'Evasion, +4 AC, and +2 Reflex)\') : \'\'} for 1 rd"',
  'Shield Buffet':
    'Section=combat ' +
    'Note="May use a combat maneuver as a %{levels.Fighter>=13 ? \'swift\' : \'move\'} action to inflict -2 attacks and -2 AC vs. self on an adjacent foe"',
  'Shield Fighter':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} shield bash attack and damage/Full attack may alternate freely between shield and weapon"',
  'Shield Guard':
    'Section=combat ' +
    'Note="Foes in adjacent chosen %V cannot flank self or help others flank"',
  'Shield Mastery':'Section=combat Note="DR 5/- w/shield"',
  'Shield Ward':
    'Section=combat,feature,save ' +
    'Note=' +
      '"Shield cannot be disarmed or sundered/+%V touch AC",' +
      '"Has Evasion feature when using a shield",' +
      '"+%V Reflex"',
  'Shielded Fortress':
    'Section=combat,feature ' +
    'Note=' +
      '"Shield cannot be disarmed or sundered/May use move to give Evasion feature to adjacent allies for 1 rd/May use immediate action to give Improved Evasion feature to 1 adjacent ally for 1 rd",' +
      '"Has Evasion feature when using a shield, Improved Evasion when using a tower shield"',
  'Singleton':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+1)//6} attack and damage w/a one-handed weapon when the other hand is free"',
  'Spark Of Life':
    'Section=save ' +
    'Note="+%{(levels.Fighter+2)//4} vs. energy drain and death effects"',
  'Stand Firm':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+2)//4} CMD vs. bull rush, drag, overrun, and trip and saves vs. trample damage"',
  'Steadfast Mount':
    'Section=combat ' +
    'Note="Mount gains +%{(levels.Fighter+2)//4} AC and saves when adjacent or mounted after 1 hr practice"',
  'Steadfast Pike':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+1)//4} readied attacks and AOO w/spears and polearms"',
  'Step Aside':
    'Section=combat ' +
    'Note="May follow foe 5\' step; gains +2 AC vs. that foe for 1 rd"',
  'Sweeping Fend':
    'Section=combat ' +
    'Note="May use a spear or polearm for -4 CMB bull rush or trip"',
  'Timely Tip':
    'Section=combat ' +
    'Note="Successful disarm maneuver negates foe shield bonus for 1 rd"',
  'Trick Shot (Archer)':
    'Section=combat ' +
    'Note="R30\' May use a bow shot to perform choice of %{(levels.Fighter+1)//4} selections from disarm, feint, sunder%{levels.Fighter>=11 ? \', bull rush, grapple, trip\':\'\'} at -4 CMB"',
  'Twin Blades':
    'Section=combat ' +
    'Note="+%{(levels.Fighter-1)//4} attack and damage when taking a full-attack action w/two weapons or a double weapon"',
  'Unavoidable Onslaught':
    'Section=combat ' +
    'Note="May make a mounted charge past allies and over difficult terrain"',
  'Unstoppable Strike':
    'Section=combat ' +
    'Note="May make a touch attack w/chosen weapon, ignoring DR or hardness, 1/rd"',
  'Volley':
    'Section=combat ' +
    'Note="May make a full-round bow attack against all in a 15\' radius"',
  'Weapon Guard':
    'Section=combat ' +
    'Note="+%{(levels.Fighter+2)//4} CMD vs. disarm, sunder, and saves vs. effects with chosen weapon"',
  'Weapon Training (Weapon Master)':
     'Section=combat ' +
     'Note="+%{(levels.Fighter+1)//4} attack and damage w/chosen weapon"',
  'Whirlwind Blitz':
    'Section=combat ' +
    'Note="May take a full-attack or Whirlwind Attack as a standard action"',

  // Monk
  'Adamantine Monk':
    'Section=combat,combat ' +
    'Note=' +
      '"DR %V/-",' +
      '"May spend 1 Ki Point for DR %V/- for 1 rd"',
  'Ancient Healing Hand':
    'Section=combat ' +
    'Note="May spend 2 Ki Points to restore %{levels.Monk} HP to another"',
  'Aspect Master':'Section=combat Note="1 selection"',
  'Aspect Of The Carp':
    'Section=ability,feature ' +
    'Note=' +
      '"%{speed}\' Swim",' +
      '"Has Amphibious feature"',
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
    'Note="%{levels.Monk>=16 ? \'Immune to teleportation,\' : \'May forego move for 1 rd immunity to \'} knocked prone and forced move"',
  'Drunken Courage':
    'Section=save Note="Min 1 drunken Ki Point gives immunity to fear"',
  'Drunken Ki':
    'Section=combat,feature ' +
    'Note=' +
      '"Min 1 drunken Ki Point allows spending 1 Ki Point to move 5\' as a swift action w/out provoking AOO",' +
      '"Gains %V drunken Ki Points for 1 hr from each alcoholic drink (%{(levels.Monk-1)//2} max)"',
  'Drunken Resilience':
    'Section=combat ' +
    'Note="Min 1 drunken Ki Point gives DR %{(levels.Monk-10)//3}/-"',
  'Drunken Strength':
    'Section=combat ' +
    'Note="Min 1 drunken Ki Point allows spending 1 Ki Point for +1d6 HP melee damage%{levels.Monk>=10 ? \'; may instead spend 2\' + (levels.Monk>=15 ? \'-\' + levels.Monk//5 : \'\') + \' drunken Ki Points to increase up to \' + levels.Monk//5 + \'d6\' : \'\'}"',
  'Firewater Breath':
    'Section=combat ' +
    'Note="Min 1 drunken Ki Point allows spending 4 Ki Points for R30\' alcohol-fueled cone that inflicts 20d6 HP fire (DC %{10+levels.Monk//2+wisdomModifier} Ref half)"',
  'Flurry Of Blows (Zen Archer)':
    'Section=combat Note="May only make Flurry Of Blows attacks with a bow"',
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
      '"Has Toughness feature"',
  'Ki Arrows':
    'Section=combat ' +
    'Note="May spend 1 Ki Point to inflict %{unarmedDamageDice}+%{unarmedDamageModifier} HP w/bow"',
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
    'Section=magic ' +
    'Note="May spend entire Ki Pool in 1 hr ritual for effects of <i>Raise Dead</i> (min 6 Ki Points)%{levels.Monk>=15 ? \' or <i>Resurrection</i> (min 8 Ki Points)\' : \'\'}; Ki Points replenish after 1 dy"',
  'Ki Weapons':
    'Section=combat ' +
    'Note="May spend 1 Ki Point to inflict %{unarmedDamageDice}+%{unarmedDamageModifier} w/an improvised weapon for 1 rd%{levels.Monk>=11 ? \'/May spend up to \' + (levels.Monk>=15 ? 5 : 3) + \' Ki Points to give an improvised weapon an enhancement bonus or abilities for 1 rd\' : \'\'}"',
  'Learned Master':
    'Section=skill ' +
    'Note="Knowledge is a class skill/Linguistics is a class skill/+%1 all Knowledge/+%1 Linguistics"',
  'Life From A Stone':
    'Section=combat ' +
    'Note="May use Steal Ki and Life Funnel on a non-living foe"',
  'Life Funnel':
    'Section=combat ' +
    'Note="Critical hit or reducing foe to 0 or negative HP when Ki Pool is not empty restores %{levels.Monk} HP to self"',
  'Mystic Insight':
    'Section=combat ' +
    'Note="R30\' May spend 2 Ki Points to give an ally an attack or save reroll"',
  'Mystic Persistence':
    'Section=combat ' +
    'Note="May spend 2+ Ki Points to create a 20\' radius that gives allies the better of two attack and save rolls for 1 rd + 1 rd per 2 Ki Points spent"',
  'Mystic Prescience':'Section=combat Note="+%V AC/+%V CMD"',
  'Mystic Visions':
    'Section=magic ' +
    'Note="May spend 2 Ki Points to use <i>Divination</i> effects"',
  'Pure Power':'Section=ability Note="+2 Strength/+2 Dexterity/+2 Wisdom"',
  'Reflexive Shot':'Section=combat Note="May make AOO w/bow"',
  'Sipping Demon':
    'Section=combat ' +
    'Note="Self gains +1 temporary HP for 1 hr from a successful attack (+2 from crit; %{levels.Monk} temporary HP max) when Ki Pool is not empty"',
  'Slow Time':
    'Section=combat Note="May spend 6 Ki Points for 2 extra standard actions"',
  'Steal Ki':
    'Section=combat ' +
    'Note="Critical hit or reducing living foe to 0 or negative HP when Ki Pool is not empty transfers 1 Ki Point from foe to self%{levels.Monk>=11 ? \' and gives immediate +\' + wisdomModifier + \' save vs. existing disease\' : \'\'}"',
  'Touch Of Peace':
    'Section=magic ' +
    'Note="May spend 6 Ki Points to have an attack inflict <i>Charm Monster</i> effects for %{levels.Monk} dy instead of HP damage 1/dy"',
  'Touch Of Surrender':
    'Section=magic ' +
    'Note="May spend 6 Ki Points to add <i>Charm Monster</i> effects for %{levels.Monk} dy to damage that reduces foe to 0 or negative HP"',
  'Trick Shot (Zen Archer)':
    'Section=combat ' +
    'Note="May spend 1 Ki Point to ignore concealment, 2 to ignore total concealment or cover, or 3 to ignore total cover w/bow shot for 1 rd"',
  'True Sacrifice':
    'Section=magic ' +
    'Note="May permanently destroy self to use R50\' <i>True Resurrection</i> effects on allies\' corpses"',
  'Uncanny Initiative':'Section=combat Note="May choose Initiative value"',
  'Versatile Improvisation':
    'Section=combat Note="May change the damage type of an improvised weapon"',
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
    'Note="May expend 1 Channel Energy use for a 30\' radius that gives allies stabilization, immunity to bleed damage, save vs. existing affliction 1/dy, and HD HP healing 1/use for %{levels.Paladin} rd"',
  'Aura Of Life':
    'Section=combat ' +
    'Note="10\' radius inflicts on undead -4 Will vs. positive energy and no recovery of HP from channeled negative energy"',
  'Call Celestial Ally':
    'Section=magic ' +
    'Note="May cast <i>%{levels.Paladin<12? \'Lesser \' : levels.Paladin>=16 ? \'Greater \' : \'\'}Planar Ally</i> 1/wk"',
  'Channel Positive Energy (Hospitaler)':
    'Section=magic ' +
    'Note="May use Channel Energy effects %{charismaModifier + 3}/dy"',
  'Divine Bond (Armor)':
    'Section=combat ' +
    'Note="Armor lights 30\' radius and gives +%{(levels.Paladin-2)//3} AC or special properties for %{levels.Paladin} min %{(levels.Paladin-1)//4}/dy"',
  'Divine Bond (Holy Symbol)':
    'Section=magic ' +
    'Note="Holy symbol lights 30\' radius and gives %{(levels.Paladin-2)//3} choices of +1 spell caster level, +1 undead Channel Energy DC, +1d6 Channel Energy, or +1 Lay On Hands use, for %{levels.Paladin} min %{(levels.Paladin-1)//4}/dy"',
  'Domain (Paladin)':'Section=feature Note="1 selection"',
  "Knight's Charge":
    'Section=combat ' +
    'Note="Mounted charge provokes no AOO/Smite Evil at the end of a mounted charge inflicts panicked (DC %{10+levels.Paladin//2+charismaModifier} Will neg) for %{levels.Paladin//2} rd"',
  'Power Of Faith':
   'Section=magic,magic ' +
   'Note=' +
     '"+%{levels.Paladin//4} daily uses of Lay On Hands",' +
     '"May use Lay On Hands for a %{levels.Paladin>=20 ? 60 : 30}\' radius that %{levels.Paladin>=12 ? \'acts a as <i>Daylight</i> spell and \' : \'\'}gives allies +%{levels.Paladin>=20 ? 2 : 1} AC, attack, damage, and saves vs. fear%1 for 1 min"',
  'Shared Defense':
    'Section=magic ' +
    'Note="May expend 1 Lay On Hands use to give +%{levels.Paladin>=15 ? 3: levels.Paladin>=9 ? 2 : 1} AC and CMD%1 to allies in %{5+levels.Paladin//6*5}\' radius for %{charismaModifier} rd"',
  'Shining Light':
    'Section=combat ' +
    'Note="30\' radius inflicts %{levels.Paladin//2}d6 HP and 1 rd blindness on evil creatures (1d4 rd blindness on outsider, dragon, or undead) (DC %{10+levels.Paladin//2+charismaModifier} Ref half HP only); good creatures regain %{levels.Paladin//2}d6 HP and gain +2 ability checks, attack, saves, and skill checks for 1 rd %{(levels.Paladin-11)//3}/dy"',
  'Skilled Rider':
    'Section=companion,skill ' +
    'Note=' +
      '"+%V saves",' +
      '"Suffers no Ride armor penalty"',
  'Undead Annihilation':
    'Section=combat ' +
    'Note="Smite Evil hit on undead destroys foes below %{levels.Paladin*2} HD (DC %{10+levels.Paladin//2+charismaModifier} Will neg)"',

  // Antipaladin
  'Aura Of Cowardice':
    'Section=combat ' +
    'Note="R10\' Foes suffer -4 vs. fear and lose immunity to fear"',
  'Aura Of Depravity':
    'Section=combat,combat ' +
    'Note=' +
      '"DR 5/good",' +
      '"R10\' Foes suffer -4 saves vs. compulsion"',
  'Aura Of Despair (Antipaladin)':
    'Section=combat Note="R10\' Foes suffer -2 on all saves"',
  'Aura Of Evil':'Section=feature Note="Visible to <i>Detect Evil</i>"',
  'Aura Of Sin':
    'Section=combat ' +
    'Note="Self weapons and R10\' attacks are considered evil for overcoming DR"',
  'Aura Of Vengeance':
    'Section=combat ' +
    'Note="R10\' May expend 2 Smite Good uses to grant Smite Good to all allies; must be used w/in 1 rd; bonuses last 1 min"',
  'Channel Negative Energy':
    'Section=magic ' +
    'Note="May expend 2 Touch Of Corruption uses to use Channel Energy effects"',
  'Cruelty':
    'Section=magic ' +
    'Note="Touch Of Corruption inflicts choice of %V (DC %{10+levels.Antipaladin//2+charismaModifier} Fort neg)"',
  'Detect Good':
    'Section=magic Note="May use <i>Detect Good</i> effects at will"',
  'Fiendish Boon':'Section=feature Note="1 selection"',
  'Fiendish Servant':
    'Section=magic ' +
    'Note="May use <i>Summon Monster %V</i> effects to permanently summon %{levels.Antipaladin>=11 ? \'an advanced\' : \'a\'} chaotic evil creature or fiendish animal%{levels.Antipaladin>=15 ? \' w/SR \' + (levels.Antipaladin+11) : \'\'}"',
  'Fiendish Weapon':
    'Section=combat ' +
    'Note="May add %V enhancements and properties to a weapon for %1 min %2/dy"',
  'Plague Bringer':'Section=save Note="Immune to effects of disease"',
  'Smite Good':
    'Section=combat ' +
    'Note="May gain +%{charismaModifier>?0} attack, +%{levels.Antipaladin} HP damage, bypass DR, and +%{charismaModifier>?0} AC vs. chosen good foe (+%{levels.Antipaladin*2} HP on first hit vs. %1) %V/dy"',
  'Touch Of Corruption':
    'Section=magic ' +
    'Note="Touch inflicts %Vd6 HP w/out provoking AOO or heals undead %1/dy"',
  'Unholy Champion':
    'Section=combat,magic ' +
    'Note=' +
      '"DR 10/good",' +
      '"Channel Negative Energy and Touch Of Corruption effects maximized/Smite Good inflicts <i>Banishment</i> effects"',
  'Unholy Resilience':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',

  // Ranger
  'Adaptation':
    'Section=feature ' +
    'Note="May use an adaptation for %{(levels.Ranger+2)//5} favored enemy %{levels.Ranger*10} min/dy"',
  'Aiding Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to give an ally +2 next attack on a foe hit by self for 1 rd"',
  'Beast Master':
    'Section=skill ' +
    'Note="+2 Handle Animal (companion)/+2 Wild Empathy (companion)"',
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
    'Note="May use Hunter\'s Trick to make a ranged attack w/out provoking AOO for 1 rd"',
  'Deft Stand':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to stand up w/out provoking AOO"',
  'Distracting Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict -2 attacks on foe for 1 rd w/a successful attack"',
  'Dual Form Shifter':
    'Section=feature Note="May use 2 Shifter\'s Blessings simultaneously"',
  'Favored Community':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+2 or more Initiative w/in favored community",' +
      '"%{(levels.Ranger+2)//5} selections",' +
      '"+2 or more Knowledge (Local), Perception, Stealth, and Survival and leaves no trail w/in favored community"',
  'Form Of The Bear':'Section=ability Note="+%V Strength%1 in shifted form"',
  'Form Of The Cat':
    'Section=ability,skill ' +
    'Note=' +
      '"+%V Speed in shifted form",' +
      '"+%V Acrobatics and Climb in shifted form"',
  'Form Of The Dragon':
    'Section=ability,combat ' +
    'Note=' +
      '"Fly %V\'/average in shifted form",' +
      '"+%V AC in shifted form"',
  'Form Of The Eagle':
    'Section=ability,skill ' +
    'Note=' +
     '"Fly %V\'/good in shifted form",' +
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
    'Note="May use Hunter\'s Trick to inflict half Speed on land for 1d4 rd with successful attack"',
  'Horse Lord':
    'Section=skill ' +
    'Note="+2 Handle Animal (companion)/+2 Wild Empathy (companion)"',
  "Hunter's Tricks":
    'Section=feature ' +
    'Note="May use %V selections %{levels.Ranger//2+wisdomModifier}/dy"',
  'Improved Empathic Link':
    'Section=companion ' +
    'Note="May share emotions and see through animal companions\' eyes up to 1 mi"',
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
    'Note="May use Hunter\'s Trick for a swift action Heal skill or a move action potion use on an adjacent unconscious ally"',
  'Quick Swim':
    'Section=skill Note="May use Hunter\'s Trick for full speed Swim for 1 rd"',
  "Ranger's Counsel":
    'Section=skill ' +
    'Note="R30\' May use Hunter\'s Trick to give allies +2 on self choice of known skill"',
  "Ranger's Focus":
    'Section=combat ' +
    'Note="+%{2+2*levels.Ranger//5} attack and damage vs. target until surrenders or reduced to 0 or negative HP %{(levels.Ranger+2)//3}/dy"',
  "Ranger's Luck":
    'Section=combat ' +
    'Note="May gain%1 reroll attack or force foe%2 reroll %{(levels.Ranger-4)//5}/dy"',
  'Rattling Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict shaken for 1d4 rd w/a successful attack"',
  'Second Chance Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to immediately reroll a melee miss w/-5 attack"',
  "Shifter's Blessing":
    'Section=feature ' +
    'Note="May use %{(levels.Ranger+2)//5} selections for %{levels.Ranger+wisdomModifier} rd %{(levels.Ranger+2)//5}/dy"',
  "Sic 'em":
    'Section=companion ' +
    'Note="May use Hunter\'s Trick to give animal companion an immediate attack on an adjacent foe"',
  'Skill Sage':
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to take the better of 2 rolls on a known skill"',
  'Spirit Bond':
    'Section=magic ' +
    'Note="May cast <i>Augury</i> and %{levels.Ranger//4} ranger spells w/in favored terrain 1/dy"',
  'Spiritual Bond':'Section=companion Note="R30\' Mount gains %{levels.Ranger} temporary HP and self may take half of mount\'s damage 1/dy"',
  "Stag's Leap":
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to make a running jump w/out a prior move"',
  'Strong Bond':'Section=companion Note="+3 Companion Master Level"',
  'Surprise Shift':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to move 5\' w/out provoking AOO"',
  'Tangling Attack':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict entangled for 1 rd w/a successful attack"',
  'Terrain Bond':
    'Section=combat,skill ' +
    'Note=' +
      '"Allies w/in sight and hearing gain +2 Initiative in favored terrain",' +
      '"Allies w/in sight and hearing gain +2 Perception, Stealth, and Survival and leave no trail in favored terrain"',
  'Trick Shot':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to ignore concealment, soft cover, and partial cover w/a ranged attack"',
  'Uncanny Senses':
    'Section=skill ' +
    'Note="May use Hunter\'s Trick to gain +10 Perception for 1 rd"',
  'Upending Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to inflict trip w/a successful attack"',
  'Vengeance Strike':
    'Section=combat ' +
    'Note="May use Hunter\'s Trick to make an immediate attack on an adjacent foe who hits an ally"',
  'Wisdom Of The Spirits':
    'Section=magic ' +
    'Note="May cast <i>Divination</i> instead of <i>Augury</i> w/in favored terrain or <i>Augury</i> in any terrain"',

  // Rogue
  'Accuracy':
    'Section=combat ' +
    'Note="Suffers only half range penalty on bow and crossbow attacks"',
  'Another Day':
    'Section=combat ' +
    'Note="May take 5\' step to avoid disabling damage 1/dy; staggered for 1 rd afterward"',
  'Assault Leader':
    'Section=combat ' +
    'Note="May give an immediate attack to a flanking ally after missing a flanked foe 1/dy"',
  'Befuddling Strike':
    'Section=combat ' +
    'Note="Successful sneak attack target suffers -2 attacks on self for 1d4 rd"',
  "Bravado's Blade":
    'Section=combat ' +
    'Note="May forego 1d6 HP sneak attack damage for Intimidate check to demoralize; may forego additional damage to gain +5 Intimidate for each 1d6 HP"',
  'Brutal Beating':
    'Section=combat ' +
    'Note="May forego 1d6 HP sneak attack damage to inflict sickened for %{levels.Rogue//2} rd"',
  'Camouflage (Rogue)':
    'Section=skill ' +
    'Note="1 min prep using local foliage gives +4 Stealth in same terrain for remainder of day (damage from area acid, cold, or fire effect ends) 1/dy"',
  'Canny Observer':
    'Section=skill ' +
    'Note="+4 Perception (hear conversation, find concealed and secret items)"',
  'Careful Disarm':
    'Section=skill ' +
    'Note="Disable Device springs trap only on fail by 10+; dbl Trap Sense bonus to avoid trap effects on failure"',
  'Charmer':
    'Section=skill ' +
    'Note="May take better of 2 Diplomacy rolls %{levels.Rogue//5+1}/dy"',
  'Coax Information':
    'Section=skill ' +
    'Note="May use Bluff or Diplomacy instead of Intimidate to change foe attitude"',
  'Combat Swipe':'Section=feature Note="Has Improved Steal feature"',
  'Cunning Trigger':
    'Section=combat Note="R30\' May trigger self trap w/a swift action"',
  'Daring':
    'Section=save,skill ' +
    'Note=' +
      '"+%{levels.Rogue//3} vs. fear",' +
      '"+%V Acrobatics"',
  'Deadly Cocktail':
    'Section=combat ' +
    'Note="May apply 2 different poisons or 2 doses of 1 poison (+2 save DC, +50% frequency) to a weapon at once"',
  'Deadly Range':
    'Section=combat Note="+%{levels.Rogue//3*10}\' ranged sneak attack"',
  'Deadly Sneak':
    'Section=combat ' +
    'Note="During a full-attack action, may suffer -2 attack to treat sneak attack damage 1s and 2s as 3s"',
  'Distracting Attack (Rogue)':
    'Section=combat ' +
    'Note="May forego sneak attack damage to inflict flat-footed vs. chosen ally (Uncanny Dodge neg)"',
  'Distraction (Rogue)':
    'Section=skill ' +
    'Note="May use Bluff vs. Sense Motive to avoid detection after a failed Stealth attempt"',
  'Entanglement Of Blades':
    'Section=combat ' +
    'Note="Successful sneak attack prevents foe 5\' step for 1 rd"',
  'Expert Acrobat':
    'Section=skill ' +
    'Note="Suffers no light armor Acrobatics, Climb, Fly, Sleight Of Hand, or Stealth penalties/+2 Acrobatics and Fly in no armor"',
  'Expert Leaper':
    'Section=skill ' +
    'Note="Always gains running start benefit on jumps/Successful DC 15 Acrobatics negates 20\' damage on deliberate falls"',
  'Fast Fingers':
    'Section=skill ' +
    'Note="May take better of 2 Sleight Of Hand rolls %{levels.Rogue//5+1}/dy"',
  'Fast Getaway':
    'Section=combat ' +
    'Note="May make an immediate %{speed}\' withdraw after a successful sneak attack or Sleight Of Hand"',
  'Fast Picks':
    'Section=skill ' +
    'Note="May use Disable Device to open a lock as a standard action"',
  'Fast Tumble':
    'Section=skill ' +
    'Note="Suffers no Acrobatics penalty to move through a threatened square w/out AOO"',
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
    'Note="May add sneak attack damage to successful attacks on an adjacent foe for 1 rd 1/dy"',
  'Knock-Out Blow':
    'Section=combat ' +
    'Note="May forego sneak attack damage to inflict unconscious for 1d4 rd (DC %{10+levels.Rogue//2+intelligenceModifier} Fort staggered 1 rd) 1/dy"',
  'Lasting Poison':
    'Section=combat ' +
    'Note="May apply poison to last 2 attacks; targets gain +2 save"',
  'Martial Training':
    'Section=feature,feature ' +
    'Note=' +
      '"1 Combat Feat (Martial Weapon Proficiency)",' +
      '"May choose Combat Trick rogue talent twice"',
  'Master Of Disguise':'Section=skill Note="May gain +10 Disguise 1/dy"',
  'Master Poisoner':
    'Section=skill ' +
    'Note="+%{levels.Rogue//2} Craft (Alchemy) (poisons)/May use Craft (Alchemy) and 1 hr lab work to change type of poison"',
  'Measure The Mark':
    'Section=skill ' +
    'Note="Knows target Perception roll before Sleight Of Hand attempt; may make Bluff vs. Sense Motive to avoid detection after aborting Sleight Of Hand"',
  'Nimble Climber':
    'Section=skill ' +
    'Note="Successful DC +10 Climb check after failed Climb avoids falling"',
  'Offensive Defense':
    'Section=combat ' +
    'Note="Successful sneak attack gives self +%{sneakAttack} AC for 1 rd"',
  'Peerless Maneuver':
    'Section=skill ' +
    'Note="May take better of 2 Acrobatics rolls %{levels.Rogue//5+1}/dy"',
  // Poison Use in Pathfinder.js
  'Positioning Attack':
    'Section=combat ' +
    'Note="May move 30\' w/out provoking AOO after a successful melee attack, ending adjacent to the same foe, 1/dy"',
  'Powerful Sneak':
    'Section=combat ' +
    'Note="During a full-attack action, may suffer -2 attack to treat sneak attack damage 1s as 2s"',
  'Quick Disguise':
    'Section=skill ' +
    'Note="Reduces the time needed to create an effective disguise"',
  'Quick Trapsmith':
    'Section=skill ' +
    'Note="May set CR %{levels.Rogue//2} trap as a full-round action"',
  "Rake's Smile":'Section=skill Note="+%V Bluff/+%V Diplomacy"',
  'Redirect Attack':
    'Section=combat ' +
    'Note="May redirect successful attack on self to a new attack on an adjacent creature 1/dy"',
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
    'Note="May make a ranged attack at Initiative 20 during the surprise round"',
  "Sniper's Eye":
    'Section=combat ' +
    'Note="R30\' May inflict ranged sneak attack damage on concealed foes"',
  'Stab And Grab':
    'Section=combat ' +
    'Note="Successful attack with sneak attack or before target acts in the surprise rd inflicts -5 Perception vs. Sleight Of Hand to steal from target"',
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
    'Note="May bypass a trap on any successful Disable Device/May change which creatures can safely pass a magical trap"',

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
      '"May use 100\' telepathy w/aquatic and swimming creatures",' +
      '"May cast on aquatic and swimming creatures <i>Suggestion</i> %{charismaModifier}/dy%{levels.Sorcerer>=15 ? \' and <i>Demand</i> or <i>Greater Planar Ally</i> 1/dy\' : \'\'}"',
  'Aurora Borealis':
    'Section=magic ' +
    'Note="May use modified <i>Wall Of Fire</i> effects that inflict cold damage and fascinate %{levels.Sorcerer*2} HD of creatures w/in 10\' (DC %{10+levels.Sorcerer//2+charismaModifier} Will neg) for %{levels.Sorcerer} rd/dy"',
  'Avatar Of Chaos':
    'Section=magic,save ' +
    'Note=' +
      '"+2 save DC and spell penetration vs. lawful creatures",' +
      '"Immune to acid, petrification, and polymorph"',
  'Blizzard (Sorcerer)':
    'Section=magic ' +
    'Note="May use combined <i>Control Winds</i> and <i>Sleet Storm</i> effects centered on self 1/dy"',
  'Bloodline Aquatic':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 Caster Level on water spells/Summoned water and swimming creatures gain +1 attack and damage",' +
      '"Swim is a class skill"',
  'Bloodline Boreal':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 save DC on cold spells",' +
      '"Survival is a class skill"',
  'Bloodline Deep Earth':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 save DC on spells cast underground",' +
      '"Knowledge (Dungeoneering) is a class skill"',
  'Bloodline Dreamspun':
    'Section=magic,skill ' +
    'Note=' +
      '"Casting targeted spells gives +0.5/spell level to AC and saves vs. target for 1 rd",' +
      '"Sense Motive is a class skill"',
  'Bloodline Protean':
    'Section=magic,skill ' +
    'Note=' +
      '"+4 dispel DC on transmutation and creation spells",' +
      '"Knowledge (Planes) is a class skill"',
  'Bloodline Serpentine':
    'Section=magic,skill ' +
    'Note=' +
      '"May affect animals, magical beasts, and monstrous humanoids with mind-affecting and language-dependent spells",' +
      '"Diplomacy is a class skill"',
  'Bloodline Shadow':
    'Section=magic,skill ' +
    'Note=' +
      '"Casting darkness or shadow spell gives +1/spell level to Stealth for 1d4 rd",' +
      '"Stealth is a class skill"',
  'Bloodline Starsoul':
    'Section=magic,skill ' +
    'Note=' +
      '"Evocation spells inflict dazzled for 1 rd/spell level",' +
      '"Knowledge (Nature) is a class skill"',
  'Bloodline Stormborn':
    'Section=magic,skill ' +
    'Note=' +
      '"+1 save DC on electricity and sonic spells",' +
      '"Knowledge (Nature) is a class skill"',
  'Bloodline Verdant':
    'Section=magic,skill ' +
    'Note=' +
      '"Casting personal spell gives +1/spell level to AC for 1d4 rd",' +
      '"Knowledge (Nature) is a class skill"',
  'Breaching The Gulf':
    'Section=magic ' +
    'Note="+3 caster level on teleportation spells/R30\' May teleport target to void, inflicting 6d6 HP cold/rd and suffocation (DC %{10+levels.Sorcerer//2+charismaModifier} Will neg or ends) 1/dy"',
  'Child Of Ancient Winters':
    'Section=feature,save ' +
    'Note=' +
      '"Has cold subtype",' +
      '"Has immunity to fatigue, exhaustion, sneak attacks, and crit/Has vulnerability to fire"',
  'Cold Steel':
    'Section=magic ' +
    'Note="Touched weapon inflicts +1d6 HP cold for %{levels.Sorcerer//2>?1} rd%{levels.Sorcerer>=9 ? \' or gains <i>icy burst</i> property for \' + (levels.Sorcerer//4) + \' rd\' : \'\'} %{charismaModifier+3}/dy"',
  'Combat Precognition':'Section=combat Note="+%V Initiative"',
  'Crystal Shard':
    'Section=magic ' +
    'Note="Touched metal or stone weapon gains +2 attack and +2d6 HP damage vs. earth, ooze, stone, and metal creatures for 1 min %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy"',
  'Deep One':
    'Section=feature,feature,magic,save,save ' +
    'Note=' +
      '"Has 60\' Blindsense",' +
      '"Has 120\' Blindsight and Evasion feature underwater",' +
      '"Has continuous <i>Freedom Of Movement</i> effects",' +
      '"DR 10/piercing",' +
      '"Resistance 20 to cold/Immune to water pressure damage"',
  'Dehydrating Touch':
    'Section=combat ' +
    'Note="Touch inflicts 1d6+%{levels.Sorcerer//2} HP nonlethal (oozes, plants, and water creatures lethal) and sickened for 1 rd %{charismaModifier+3}/dy"',
  'Den Of Vipers':
    'Section=magic ' +
    'Note="May use <i>Creeping Doom</i> effects w/serpents that inflict Constitution damage and entanglement 1/dy"',
  'Dreamshaper':
    'Section=magic ' +
    'Note="May use <i>Modify Memory</i> or mental <i>Speak With Dead</i> effects %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy"',
  'Earth Glide':
    'Section=ability ' +
    'Note="May move through earth and stone%1, leaving no trace, for %V/dy"',
  'Enveloping Darkness':
    'Section=magic ' +
    'Note="May use entangling <i>Deeper Darkness</i> effects 1/dy"',
  'Eye Of Somnus':
    'Section=magic ' +
    'Note="May use <i>Arcane Eye</i> effects, optionally with <i>Symbol Of Sleep</i> effects, 1/dy"',
  'Icewalker':
    'Section=ability,magic,save ' +
    'Note=' +
      '"Moves across ice and snow at full speed w/out leaving tracks",' +
      '"May use <i>Spider Climb</i> effects at will on icy surfaces",' +
      '"Has cold resistance %{levels.Sorcerer>=9 ? 10 : 5}"',
  'Lullaby':
    'Section=magic ' +
    'Note="May use <i>Lullaby</i> effects that inflict -4 saves vs. sleep effects for 1 min %{charismaModifier+3}/dy"',
  'Massmorph':
    'Section=magic ' +
    'Note="May use <i>Plant Growth</i> and <i>Diminish Plants</i> at will, <i>Tree Shape</i>%{levels.Sorcerer>=15 ? \' or <i>Plant Shape I\' + (levels.Sorcerer>=20 ? \'I\' : \'\') : \'\'}</i> 1/dy"',
  'Minute Meteors':'Section=magic Note="R30\' 5\' diameter inflicts 1d4+%{levels.Sorcerer//2} HP fire (DC %{10+levels.Sorcerer//2+charismaModifier} Ref neg) %{charismaModifier+3}/dy"',
  'Nighteye':
    'Section=feature ' +
    'Note="%{(features.Darkvision ? 60 : 0) + (levels.Sorcerer>=9 ? 60 : 30)}\' b/w vision in darkness"',
  'Photosynthesis':
    'Section=feature,save ' +
    'Note=' +
      '"Has no need to eat/2 hr sleep gives benefits of 8 hr",' +
      '"+%{levels.Sorcerer>=9 ? 4 : 2} vs. poison and sleep"',
  'Protean Resistances':
    'Section=save ' +
    'Note="Has acid resistance %{levels.Sorcerer>=9 ? 10 : 5}/+%{levels.Sorcerer>=9 ? 4 : 2} vs. polymorph, petrification, and transmutation"',
  'Protoplasm':
    'Section=magic ' +
    'Note="R30\' Hurled protoplasm inflicts entanglement and 1 HP acid/rd for 1d3 rd %{charismaModifier+3}/dy"',
  'Raise The Deep':
    'Section=magic ' +
    'Note="May raise water as per%{levels.Sorcerer>=20 ? \' dbl dimension\' : \'\'} <i>Control Water</i> for %{levels.Sorcerer} rd even when no water is present 1/dy"',
  'Reality Wrinkle':
    'Section=combat ' +
    'Note="10\' radius inflicts 20% miss chance on outside attacks for %{levels.Sorcerer} rd/dy"',
  'Ride The Lightning':
    'Section=magic ' +
    'Note="Full-round action moves self %{speed*10}\' w/out provoking AOO, inflicts Thunderbolt effect for %{levels.Sorcerer} rd 1/dy"',
  'Rockseer':
    'Section=feature,magic,skill ' +
    'Note=' +
      '"Has Stonecunning feature%{levels.Sorcerer>=9 ? \'/Has 30\\\' tremorsense\' : \'\'}",' +
      '"Can see 20\' through 1\'/1\\"/3\' stone/metal/wood and dirt for %{levels.Sorcerer} rd/dy",' +
      '"+2 Perception (stone)"',
  'Rooting':
    'Section=magic ' +
    'Note="May suffer Speed reduction to 5\' to gain +4 AC, +10 CMD vs. bull rush, overrun, reposition, and trip, 30\' tremorsense, and regain 1 HP/rd for %{levels.Sorcerer} min/dy"',
  'Scaled Soul':
    'Section=combat,feature,magic,save ' +
    'Note=' +
      '"May use Serpent\'s Fang at will, inflicting damage on choice of ability",' +
      '"Has shapechanger subtype",' +
      '"May use <i>Alter Self</i> or <i>Beast Shape III</i> effects to become a reptilian humanoid or snake at will",' +
      '"Immune to poison and paralysis"',
  "Serpent's Fang":
    'Section=combat ' +
    'Note="%{levels.Sorcerer>=5 ? \'Magical fangs\' : \'Fangs\'} inflict 1d%{features.Small ? 3 : 4}%{strengthModifier>=0 ? \'+\' + strengthModifier : strengthModifier} HP plus poison (1%{levels.Sorcerer>=11 ? \'d4\' : levels.Sorcerer>=5 ? \'d2\' : \'\'} Constitution/rd for 6 rd (DC %{10+levels.Sorcerer//2+constitutionModifier} neg or%{levels.Sorcerer>=7 ? \' twice to\' : \'\'} end)) for %{charismaModifier+3} rd/dy"',
  'Serpentfriend':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Familiar feature (Viper)",' +
      '"May use <i>Speak With Animals</i> at will with reptiles"',
  'Shadow Master (Sorcerer)':
    'Section=feature,magic ' +
    'Note=' +
      '"Suffers no sight penalty from natural or magical darkness",' +
      '"Summoned shadow creatures gain +4 Strength, +4 Constitution, and 20% more reality"',
  'Shadow Well':
    'Section=magic,skill ' +
    'Note=' +
      '"R60\' May use <i>Dimension Door</i> effects in darkness or dim light to swap places w/an ally%{levels.Sorcerer>=13 ? \' or swap 2 allies\' : \'\'} %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy",' +
      '"May use Stealth while being observed when w/in 10\' of a shadow"',
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
      '"May use cold <i>Fire Shield</i> effects that give 20% attack miss and +%{levels.Sorcerer//2} Stealth in snowy or icy areas for %{levels.Sorcerer} rd %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy",' +
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
      '"Suffers no sight penalty from natural or magical darkness",' +
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
      '"Resistance 5 to electricity/Resistance 5 to sonic/Treats wind effects as %{levels.Sorcerer>=9 ? \'2 steps\' : \'1 step\'} less"',
  'Strength Of Stone':
    'Section=ability,combat,combat,save ' +
    'Note=' +
      '"Suffers no penalty for squeezing through tight spaces",' +
      '"DR 10/adamantine",' +
      '"Immune to bull rush, drag, grapple, reposition, and trip maneuvers and push and pull effects when standing on ground",' +
      '"Immune to petrification"',
  'Tanglevine':
    'Section=combat ' +
    'Note="May make R15\' +%{levels.Sorcerer+charismaModifier} CMB disarm, steal, or trip maneuver %{charismaModifier+3}/dy"',
  'Thunderbolt':
    'Section=magic ' +
    'Note="R120\' 5\' radius inflicts %{levels.Sorcerer}d6 HP (half electricity, half sonic) and deafened 1 rd (DC %{10+levels.Sorcerer//2+charismaModifier} Ref half HP only) %{levels.Sorcerer>=20 ? 3 : levels.Sorcerer>=17 ? 2 : 1}/dy"',
  'Thunderstaff':
    'Section=magic ' +
    'Note="Touched weapon inflicts +1d6 HP electricity for %{levels.Sorcerer//2>?1} rd%{levels.Sorcerer>=9 ? \' or gains <i>shocking burst</i> property for \' + (levels.Sorcerer//4) + \' rd\' : \'\'} %{charismaModifier+3}/dy"',
  'Tremor':
    'Section=combat ' +
    'Note="R30\' Shaking ground inflicts +%{levels.Sorcerer+charismaModifier} CMB trip on target %{charismaModifier+3}/dy"',
  'Tremorsense':
    'Section=feature Note="R30\' Senses creatures via ground vibrations"',
  'Voidwalker':
    'Section=feature,feature,save ' +
    'Note=' +
      '"Has Low-Light Vision feature",' +
      '"Does not need to breathe",' +
      '"Resistance 5 to cold/Resistance 5 to fire"',

  // Wizard
  'Acid Cloud':
    'Section=magic ' +
    'Note="R30\' 5\' radius inflicts 1d6+%{levels.Wizard//2} HP acid and sickened for 1 rd (DC %{10+levels.Wizard//2+intelligenceModifier} Fort half HP only; exit neg) %{intelligenceModifier+3}/dy"',
  'Air Supremacy':
    'Section=magic,skill,skill ' +
    'Note=' +
      '"May cast self <i>Feather Fall</i>%{levels.Wizard>=5 ? \', <i>Levitate</i>\' : \'\'}%{levels.Wizard>=10 ? \', <i>Fly</i>\' : \'\'} at will",' +
      '"+%V Fly",' +
      '"Automatic nat 20 on Fly"',
  'Augment':
    'Section=magic ' +
    'Note="Touch gives +%{levels.Wizard>=10 ? 4 : 2} ability or +%{1+levels.Wizard//5} AC for %{levels.Wizard//2>?1} rd %{intelligenceModifier+3}/dy"',
  'Aura Of Banishment':
    'Section=magic ' +
    'Note="30\' radius staggers summoned creatures (Will neg), then returns them to their home plane (Will delays 1 rd) %{levels.Wizard} rd/dy"',
  'Battleshaping':
    'Section=magic ' +
    'Note="May use%{levels.Wizard>=11 ? \' 2\' : \'\'} magical claw, bite, or gore w/+%{levels.Wizard//4} attack and damage for 1 rd %{intelligenceModifier+3}/dy"',
  'Bedeviling Aura':
    'Section=combat ' +
    'Note="30\' radius inflicts half speed, cannot take AOO, and flanked on foes for %{levels.Wizard} rd/dy"',
  'Beguiling Touch':
    'Section=magic ' +
    'Note="Touch inflicts <i>Charm Monster</i> effects (%{levels.Wizard+1} HD, combat, hostility, or DC %{10+levels.Wizard//2+intelligenceModifier} Will neg) for %{levels.Wizard//2} rd %{intelligenceModifier+3}/dy"',
  'Binding Darkness':
    'Section=magic ' +
    'Note="R30\' Ranged touch inflicts entanglement and concealment for %{1+levels.Wizard//5} rd (bright light halves duration) %{intelligenceModifier+3}/dy"',
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
    'Note="10\' radius negates ranged attacks, knocks flying creatures to the ground (DC %{10+levels.Wizard} Fly neg), and bars passage to ground creatures (DC %{10+levels.Wizard} Strength neg) for %{levels.Wizard} rd/dy"',
  'Dancing Flame':
    'Section=magic ' +
    'Note="May move a nonmagical fire 30\', remove squares from self instantaneous fire spell area, or move an effect of a longer self fire spell %{levels.Wizard//2}/dy"',
  'Disruption':
    'Section=combat ' +
    'Note="Touch inflicts DC 15 + 2 x spell level concentration to use spell for %{levels.Wizard//2>?1} rd %{intelligenceModifier+3}/dy"',
  // Earth Glide as Sorcerer
  'Earth Supremacy':
    'Section=combat,magic ' +
    'Note=' +
      '"+%{2+levels.Wizard//5} CMD vs. bull rush, drag, overrun, reposition, and trip when touching the ground/+1 attack and damage when self and foe are both touching the ground",' +
      '"Earth and stone do not block spell effects"',
  'Elemental Manipulation':
    'Section=magic ' +
    'Note="30\' radius modifies energy type of spells and supernatural effects from casters up to level %{levels.Wizard} and creatures up to %{levels.Wizard} HD %{levels.Wizard} rd/dy"',
  'Fire Jet':
    'Section=magic ' +
    'Note="20\' line inflicts 1d6+%{levels.Wizard//2} HP fire and 1d6 HP fire in next rd (DC %{10+levels.Wizard//2+intelligenceModifier} Ref half first rd only) %{intelligenceModifier+3}/dy"',
  'Fire Supremacy':
    'Section=combat,save ' +
    'Note=' +
      '"May use an adjacent fire to inflict %{levels.Wizard//2>?1} HP fire on a successful melee attacker",' +
      '"%{levels.Wizard==20 ? \'Immune\' : levels.Wizard>=10 ? \'Resistance 10\' : \'Resistance 5\'} to fire"',
  'Force Of Will':
    'Section=magic ' +
    'Note="R60\' May transmit thoughts to%{levels.Wizard>=11 ? \' and from\' : \'\'} charmed and dominated creatures%{levels.Wizard>=20 ? \'/Target of self enchantment spell affected for 1 rd after a successful save\' : \'\'}"',
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
    'Note="May substitute a pre-rolled d20 value for any d20 roll for 1 rd %{intelligenceModifier+3}/dy"',
  'Send Senses':
    'Section=magic ' +
    'Note="R%{100+levels.Wizard*10}\' May see or hear remotely for %{levels.Wizard//2>?1} rd %{intelligenceModifier+3}/dy"',
  'Shadow Step':
    'Section=magic ' +
    'Note="May teleport %{levels.Wizard*30}\'/dy (5\' increments), reappearing 5\' off target and gaining foe 20% miss chance for 1 rd; including others uses equal portion of daily distance"',
  'Shape Emotions':
    'Section=magic ' +
    'Note="30\' radius gives allies +4 saves vs. mind-affecting effects and reduction of fear by 1 step or inflicts -2 vs. mind-affecting effects on foes for %{levels.Wizard} rd/dy"',
  'Share Essence':
    'Section=magic ' +
    'Note="Touch gives 1d6+%{levels.Wizard//2} temporary HP for 1 hr and self suffers equal HP nonlethal %{intelligenceModifier+3}/dy"',
  'Shift':
    'Section=magic ' +
    'Note="May use <i>Dimension Door</i> effects to move %{levels.Wizard//2*5>?5}\' %{intelligenceModifier+3}/dy"',
  'Terror':
    'Section=combat ' +
    'Note="Touch causes target to provoke AOO (%{levels.Wizard+1} HD neg) %{intelligenceModifier+3}/dy"',
  'Unstable Bonds':
    'Section=combat ' +
    'Note="Touch inflicts shaken and staggered on a summoned creature for %{levels.Wizard//2} rd %{intelligenceModifier+3}/dy"',
  'Versatile Evocation':
    'Section=magic ' +
    'Note="May change type of damage done by a self energy spell %{intelligenceModifier+3}/dy"',
  'Water Supremacy':
    'Section=ability,feature,skill,skill ' +
    'Note=' +
      '"%{speed}\' Swim",' +
      '"May hold breath for %{constitution*4} rd",' +
      '"+%V Swim",' +
      '"Automatic nat 20 on Swim"',
  'Wave':
    'Section=magic ' +
    'Note="%{5*levels.Wizard}\'x20\' wave moves away 30\'/rd, douses normal fires, and knocks prone or carries away (caster level vs. CMD; DC %{10+levels.Wizard//2+intelligenceModifier} Strength to end) %{levels.Wizard//2} rd/dy"',
  'Wind Servant':
    'Section=magic ' +
    'Note="May blow %{levels.Wizard} lb object 30\', hitting a target w/a ranged touch %{intelligenceModifier+3}/dy"',

  // Battle Herald
  // Banner as Cavalier
  'Battle Magic':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives target +%{inspiringCommandBonus} caster level and concentration checks"',
  'Complex Commands':
    'Section=magic ' +
    'Note="May have 2 inspiring commands%{levels.Bard ? \', or 1 inspiring command and 1 bardic performance,\' : \'\'} active simultaneously"',
  // Demanding Challenge as Cavalier
  'Easy March':
    'Section=magic ' +
    'Note="R60\' Allies can hustle or force march w/out ill effects %{inspiringCommandBonus} hr/dy"',
  'Improved Leadership':
    'Section=feature Note="+%{inspiringCommandBonus} Leadership score"',
  // Inspire Greatness as Bard
  'Inspire Hardiness':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies DR %{inspiringCommandBonus}/-"',
  'Inspire Last Stand':
    'Section=magic ' +
    'Note="R30\' Allies below 0 HP remain conscious, stable, staggered, and able to act, and gain Inspire Courage effects if conscious"',
  'Inspired Tactics':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies +%{inspiringCommandBonus} CMB, CMD, AC vs. combat maneuver AOO, and crit confirm"',
  'Inspiring Command':
    'Section=feature,magic ' +
    'Note=' +
      '"%V selections/Has Inspire Courage feature",' +
      '"Inspiring Command effect for %V rd/dy%{levels.Bard ? \'/May use Bardic Performance for Inspiring Command effects\' : \'\'}"',
  'Keep Your Heads':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies +%{inspiringCommandBonus} Will save and concentration checks"',
  'None Shall Fall':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives %{inspiringCommandBonus} allies additional +%{inspiringCommandBonus} save vs. poison and 1d6 HP healing"',
  'Persistent Commands':
    'Section=magic ' +
    'Note="May allow inspiring commands to continue for %{charismaModifier} rd while incapacitated"',
  'Pincer Maneuver':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies +%{inspiringCommandBonus} AC vs. movement AOO and +%{inspiringCommandBonus} attack and damage when flanking"',
  'Rally':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies additional +%{inspiringCommandBonus} save vs. fear"',
  'Reveille':
    'Section=magic ' +
    'Note="R60\' Inspiring Command awakens allies and gives additional +%{inspiringCommandBonus} save vs. exhaustion, fatigue, and sleep"',
  'Scatter':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives %{inspiringCommandBonus} allies 20% concealment vs. ranged attacks when moving more than 5\'"',
  'Shake It Off':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives target additional +%{inspiringCommandBonus} save vs. ongoing condition"',
  'Sound The Charge':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies +%{inspiringCommandBonus} attack and damage and +%{inspiringCommandBonus*5}\' charge speed"',
  'Sound The Retreat':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies 50% concealment with dbl move or withdraw action"',
  'Stand Firm (Battle Herald)':
    'Section=magic ' +
    'Note="Inspiring Command gives allies +%{inspiringCommandBonus} CMD and Fort saves"',
  'Teamwork':
    'Section=magic ' +
    'Note="R60\' Inspiring Command gives allies +%{inspiringCommandBonus} to aid another rolls and effects"',
  'Tuck And Roll':
    'Section=magic ' +
    'Note="Inspiring Command gives allies +%{inspiringCommandBonus} Acrobatics and Ref saves"',
  'Voice Of Authority':
    'Section=feature,skill,skill ' +
    'Note=' +
      '"+%V Tactician level",' +
      '"+2 Diplomacy/+2 Intimidate",' +
      '"Allies gain +%{$\'levels.Battle Herald\'} Perception and Sense Motive to hear commands and to interpret messages given using Bluff"',

  // Holy Vindicator
  'Bloodfire':
    'Section=combat ' +
    'Note="Channel Smite while using Stigmata inflicts +1d6 HP, sickened, and 1d6 HP/rd bleed (DC %{10 + channelLevel//2} Will ends)"',
  'Bloodrain':
    'Section=magic ' +
    'Note="Channel Energy while using Stigmata inflicts +1d6 HP, sickened, and 1d6 HP bleed/rd (DC %{10 + channelLevel//2} Will ends)"',
  // Caster Level Bonus as Pathfinder.js
  // Channel Smite as Pathfinder.js
  'Divine Judgment':
    'Section=magic ' +
    'Note="May use level 2 spell slot to inflict <i>Death Knell</i> in response to reducing foe to negative HP"',
  'Divine Retribution':
    'Section=magic ' +
    'Note="May use level 3 spell slot to inflict <i>Bestow Curse</i> on foe in response to crit to self or foe"',
  'Divine Wrath':
    'Section=magic ' +
    'Note="May use level 1 spell slot to inflict <i>Doom</i> on foe in response to crit to self or foe"',
  'Faith Healing':
    'Section=magic Note="Self <i>Cure</i> spells have %{$\'levels.Holy Vindicator\'>=8 ? \'maximum\' : \'x1.5\'} effects"',
  'Stigmata':
    'Section=magic ' +
    'Note="May suffer %{$\'levels.Holy Vindicator\'//2} HP/rd bleed damage to gain +%{$\'levels.Holy Vindicator\'//2} choice of attack, damage, AC, caster level checks, or saves and use <i>Bleed</i> and <i>Stabilize</i> at will"',
  'Versatile Channel':
    'Section=magic ' +
    'Note="May use Channel Energy to affect 30\' cone or 120\' line"',
  "Vindicator's Shield":
    'Section=combat ' +
    'Note="May use Channel Energy to gain +%{magicNotes.channelEnergy.1} AC from shield for 1 dy or until struck"',

  // Horizon Walker
  'Master Of All Lands':
    'Section=feature,save ' +
    'Note=' +
      '"+2 Favored Terrain bonus in all terrains",' +
      '"Automatically succeeds on natural temperature and weather saves; R60\' allies receive +2 (+4 in mastered terrain)"',
  'Terrain Dominance':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"Applies Favored Terrain bonus when dealing w/creatures native to %V chosen favored terrains",' +
      '"%V selections",' +
      '"Applies Favored Terrain bonus when dealing w/creatures native to %V chosen favored terrains"',
  'Terrain Dominance (Aligned Plane (%alignment))':
    'Section=combat ' +
    'Note="Weapons count as opposite alignment component for overcoming DR"',
  'Terrain Dominance (Astral Plane)':
    'Section=combat,magic ' +
    'Note=' +
      '"+1 attack and damage vs. outsiders",' +
      '"May use <i>Dimension Door</i> effects %{3+wisdomModifier}/dy"',
  'Terrain Dominance (Cold)':
    'Section=combat,save ' +
    'Note=' +
      '"+1 attack and damage vs. cold creatures",' +
      '"Resistance 20 to cold"',
  'Terrain Dominance (Desert)':
    'Section=save ' +
    'Note="Resistance 10 to fire/Immune to fatigue"',
  'Terrain Dominance (Ethereal Plane)':
    'Section=magic Note="May use <i>Ethereal Jaunt</i> effects 1/dy"',
  'Terrain Dominance (Forest)':
    'Section=magic ' +
    'Note="May use <i>Hallucinatory Terrain</i> effects to create forest images %{3+wisdomModifier}/dy"',
  'Terrain Dominance (Jungle)':
    'Section=magic ' +
    'Note="May use <i>Charm Monster</i> effects on jungle creatures %{3+wisdomModifier}/dy"',
  'Terrain Dominance (Mountain)':'Section=combat Note="DR 2/adamantine"',
  'Terrain Dominance (Plains)':'Section=ability Note="+10 Speed"',
  'Terrain Dominance (Plane Of Air)':
    'Section=magic Note="May use <i>Fly</i> effects %{3+wisdomModifier}/dy"',
  'Terrain Dominance (Plane Of Earth)':
    'Section=feature Note="Has 30\' Tremorsense"',
  'Terrain Dominance (Plane Of Fire)':
    'Section=combat,save ' +
    'Note=' +
      '"+1 attack and damage vs. fire creatures",' +
      '"Resistance 20 to fire"',
  'Terrain Dominance (Plane Of Water)':
    'Section=feature Note="May always move freely underwater"',
  'Terrain Dominance (Swamp)':'Section=feature Note="Has 30\' Tremorsense"',
  'Terrain Dominance (Underground)':'Section=feature Note="+60\' Darkvision"',
  'Terrain Dominance (Urban)':
    'Section=magic ' +
    'Note="May use <i>Charm Person</i> effects %{3+wisdomModifier}/dy"',
  'Terrain Dominance (Water)':'Section=ability Note="+20\' Swim"',
  'Terrain Mastery':
    'Section=feature,skill ' +
    'Note=' +
      '"%V selections",' +
      '"R30\' May give allies +2 Climb, Perception, Stealth, and Survival for %{wisdomModifier>?1} rd when in %V chosen favored terrains"',
  'Terrain Mastery (Aligned Plane (%alignment))':
     'Section=ability ' +
     'Note="May cause detection spells to report self alignment as %alignment"',
  'Terrain Mastery (Astral Plane)':
    'Section=ability Note="+30 Fly speed on planes w/no or subjective gravity"',
  'Terrain Mastery (Cold)':'Section=save Note="Resistance 10 to cold"',
  'Terrain Mastery (Desert)':
    'Section=save Note="Immune to exhaustion; becomes fatigued instead"',
  'Terrain Mastery (Ethereal Plane)':
    'Section=combat ' +
    'Note="Suffers no miss chance from foe fog or mist concealment and only 20% miss chance from total concealment"',
  'Terrain Mastery (Forest)':'Section=skill Note="+4 Stealth"',
  'Terrain Mastery (Jungle)':
    'Section=combat,skill ' +
    'Note=' +
      '"+4 CMD vs. grapple",' +
      '"+4 Escape Artist"',
  'Terrain Mastery (Mountain)':
    'Section=combat,skill ' +
    'Note=' +
      '"Retains Dexterity bonus to AC when climbing",' +
      '"+4 Climb"',
  'Terrain Mastery (Plains)':
    'Section=ability ' +
    'Note="Suffers no speed reduction from medium armor or load"',
  'Terrain Mastery (Plane Of Air)':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 attack and damage vs. flying creatures",' +
      '"+4 Fly"',
  'Terrain Mastery (Plane Of Earth)':
    'Section=combat Note="DR 1/adamantine"',
  'Terrain Mastery (Plane Of Fire)':'Section=save Note="Resistance 10 to fire"',
  'Terrain Mastery (Plane Of Water)':
    'Section=combat,feature,skill ' +
    'Note=' +
      '"+1 attack and damage vs. swimming creatures",' +
      '"May breathe water",' +
      '"+4 Swim"',
  'Terrain Mastery (Swamp)':'Section=skill Note="+4 Perception"',
  'Terrain Mastery (Underground)':
    'Section=feature Note="Has Blind-Fight feature"',
  'Terrain Mastery (Urban)':'Section=skill Note="+4 Diplomacy"',
  'Terrain Mastery (Water)':
    'Section=combat,skill ' +
    'Note=' +
      '"+1 attack and damage vs. swimming creatures",' +
      '"+4 Swim"',

  // Master Chymist
  'Advanced Mutagen':'Section=feature Note="%V selections"',
  'Bomb-Thrower':'Section=combat Note="Increased Bomb effects"',
  'Brutality':
    'Section=combat ' +
    'Note="+%{$\'levels.Master Chymist\'//3*2} damage w/simple weapons and natural attacks while in mutagenic form"',
  'Burly':
    'Section=ability,combat,skill ' +
    'Note=' +
      '"+%{$\'levels.Master Chymist\'//2} Strength and Constitution checks while in mutagenic form",' +
      '"+%{$\'levels.Master Chymist\'//2} CMB and CMD while in mutagenic form",' +
      '"+%{$\'levels.Master Chymist\'//2} Strength-linked skill checks while in mutagenic form"',
  // Caster Level Bonus as Pathfinder.js
  'Disguise':
    'Section=save ' +
    'Note="Successful DC 20 Will allows assuming normal appearance for 1 min while in mutagenic form; extending duration requires additional +1 DC/min saves; must wait 10 min between uses"',
  'Draconic (Black) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"60\' line inflicts 8d8 acid (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to acid"',
  'Draconic (Blue) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"60\' line inflicts 8d8 electricity (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to electricity"',
  'Draconic (Brass) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"60\' line inflicts 8d8 fire (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to fire"',
  'Draconic (Bronze) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"60\' line inflicts 8d8 electricity (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to electricity"',
  'Draconic (Copper) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"60\' line inflicts 8d8 acid (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to acid"',
  'Draconic (Gold) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"30\' cone inflicts 8d8 fire (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to fire"',
  'Draconic (Green) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"30\' cone inflicts 8d8 acid (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to acid"',
  'Draconic (Red) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"30\' cone inflicts 8d8 fire (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to fire"',
  'Draconic (Silver) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"30\' cone inflicts 8d8 cold (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to cold"',
  'Draconic (White) Mutagen':
    'Section=combat,save ' +
    'Note=' +
      '"30\' cone inflicts 8d8 cold (DC %V Ref half) 1/transformation",' +
      '"Resistance 20 to cold"',
  'Dual Mind':
    'Section=save,save ' +
    'Note=' +
      '"+2 Will",' +
      '"Gains additional save vs. enchantment after 1 rd; success forces form change"',
  'Evasion (Master Chymist)':
    'Section=save ' +
    'Note="Reflex save yields no damage instead of half while in mutagenic form"',
  'Extended Mutagen':'Section=magic Note="Dbl mutagen duration"',
  // Feral Mutagen as Alchemist
  'Furious Mutagen':
    'Section=combat ' +
    'Note="Feral Mutagen bite and claw damage increases by 1 die step"',
  // Grand Mutagen as Alchemist
  // Greater Mutagen as Alchemist
  'Growth Mutagen':
    'Section=feature Note="Mutagenic form increases size category by 1 step"',
  'Mutagenic Form':
    'Section=feature ' +
    'Note="Has alternate humanoid form w/its own personality and alignment"',
  'Mutate':
    'Section=feature ' +
    'Note="May assume mutagenic form %V/dy or by consuming mutagen; suffering crit or failed Fort save forces use (DC 25 Will neg)"',
  'Night Vision (Master Chymist)':
    'Section=feature ' +
    'Note="Has 60\' b/w vision in darkness and x2 normal distance in poor light while in mutagenic form"',
  'Nimble':
    'Section=ability,combat,skill ' +
    'Note=' +
      '"+%{$\'levels.Master Chymist\'//2} Dexterity checks while in mutagenic form",' +
      '"+%{$\'levels.Master Chymist\'//2} AC and CMD while in mutagenic form",' +
      '"+%{$\'levels.Master Chymist\'//2} Dexterity-linked skill checks while in mutagenic form"',
  'Restoring Change':
    'Section=combat ' +
    'Note="Changing to/from mutagenic form restores 1d8+%{level} HP"',
  'Scent (Master Chymist)':
    'Section=feature ' +
    'Note="May detect creatures via smell while in mutagenic form"',

  // Master Spy
  'Art Of Deception':
    'Section=skill Note="+%V Bluff/+%V Disguise/+%V Sense Motive"',
  'Assumption':
    'Section=magic ' +
    'Note="May copy aura of touched helpless creature, redirecting detection spells to self"',
  'Concealed Thoughts':
    'Section=save ' +
    'Note="May control effect of spells that detect surface thoughts when cast on self"',
  // Death Attack as Pathfinder.js
  'Elude Detection':
    'Section=save ' +
    'Note="May gain SR %{$\'levels.Master Spy\'+15} vs. divination at will; must wait 1d4 rd between uses"',
  'Fool Casting':
    'Section=save ' +
    'Note="Successful save vs. control spell allows partial effects, dismissible at will"',
  'Glib Lie':
    'Section=save ' +
    'Note="Truth-detecting magic requires DC %{$\'levels.Master Spy\'+15} caster level check to be effective"',
  'Hidden Mind':
    'Section=save ' +
    'Note="May gain immunity to divination and +8 vs. mental effects at will; must wait 1d4 rd between uses"',
  'Mask Alignment':
    'Section=save ' +
    'Note="May cause alignment detection spells directed at self to report choice of alignment"',
  'Master Of Disguise (Master Spy)':
    'Section=skill ' +
    'Note="May create a disguise in half time; reduces Disguise penalties by 1"',
  'Nonmagical Aura':
    'Section=magic Note="May use <i>Magic Aura</i> effects to mask aura 2/dy"',
  'Quick Change (Master Spy)':
    'Section=skill ' +
    'Note="May suffer %{$\'levels.Master Spy\'<8 ? -10 : -5} penalty on Disguise to assume disguise in 2d4 rd"',
  'Shift Alignment':
    'Section=save ' +
    'Note="May modify alignment to change alignment-specific effects of magic directed at self"',
  // Slippery Mind as Pathfinder.js
  'Superficial Knowledge':
    'Section=skill ' +
    'Note="May make +%{$\'levels.Master Spy\'//2} untrained Knowledge and Profession checks related to cover identity"',

  // Nature Warden
  'Animal Speech':
    'Section=magic ' +
    'Note="May use <i>Speak With Animals</i> effects at will in favored terrain, 1/dy elsewhere"',
  // Caster Level Bonus as Pathfinder.js
  'Companion Bond (Nature Warden)':
    'Section=companion,companion ' +
    'Note=' +
      '"Has Empathic Link feature",' +
      '"Companion shares Favored Terrain benefits"',
  'Companion Soul':
    'Section=companion,magic ' +
    'Note=' +
      '"Additional +4 Will vs. enchantment",' +
      '"May use <i>Scrying</i> and <i>Raise Dead</i> effects on animal companion"',
  'Companion Walk':
    'Section=companion ' +
    'Note="May affect animal companion w/self travel and polymorph spells"',
  // Favored Terrain as Pathfinder.js
  'Guarded Lands':
    'Section=feature ' +
    'Note="May gain +2 Favored Terrain and +2 Favored Enemy bonuses in %{wisdomModifier>?1} chosen 1 mile sq areas"',
  'Ironpaw':
    'Section=companion,magic ' +
    'Note=' +
      '"May give animal companion DR %{$\'levels.Nature Warden\'}/cold iron/Natural weapons are considered cold iron for overcoming DR",' +
      '"May give summoned creatures DR %{$\'levels.Nature Warden\'}/cold iron/Natural weapons are considered cold iron for overcoming DR"',
  'Mystic Harmony':
    'Section=combat Note="Adds half favored terrain bonus to AC"',
  'Natural Empathy':
    'Section=skill ' +
    'Note="+%V Wild Empathy checks when in favored terrain/May use Wild Empathy to demoralize%1"',
  'Plant Speech':
    'Section=magic ' +
    'Note="May use <i>Speak With Plants</i> effects at will in favored terrain, 1/dy elsewhere"',
  'Silverclaw':
    'Section=companion,magic ' +
    'Note=' +
      '"Animal companion gains DR %{$\'levels.Nature Warden\'}/silver/Natural weapons are considered silver for overcoming DR",' +
      '"Summoned creatures gain DR %{$\'levels.Nature Warden\'}/silver/Natural weapons are considered silver for overcoming DR"',
  'Survivalist (Nature Warden)':
    'Section=feature ' +
    'Note="Suffers no penalty for improvised weapon and tool use%1"',
  'Wild Stride':
    'Section=feature ' +
    'Note="Self and animal companion may move normally through natural hazards while in favored terrain"',
  'Woodforging':
    'Section=magic ' +
    'Note="May combine <i>Wood Shape</i> and <i>Ironwood</i> effects 1/dy"',

  // Rage Prophet
  // Caster Level Bonus as Pathfinder.js
  'Enduring Rage':
    'Section=magic ' +
    'Note="May spend a spell slot to extend rage 1 rd/spell level"',
  // Greater Rage as Pathfinder.js
  'Indomitable Caster':
    'Section=magic Note="+%{constitutionModifier} concentration checks"',
  'Rage Prophet Mystery':'Section=magic Note="Has access to additional spells"',
  'Ragecaster':
    'Section=magic Note="+%{levels.Barbarian} caster level during Moment Of Clarity%{$\'levels.Rage Prophet\'>=7 ? \'/+\' + constitutionModifier + \' spell DC during rage\' : \'\'}"',
  'Raging Healer':
    'Section=magic Note="May cast self <i>Cure</i> spells while raging"',
  'Raging Spellstrength':
    'Section=magic Note="May cast self personal spells while raging"',
  'Savage Seer':'Section=combat Note="+%V Rage Power Level/+%V Mystery Level"',
  'Spirit Guardian':
    'Section=magic ' +
    'Note="Increases Spirit Guide <i>Guidance</i> bonus to +%{$\'levels.Rage Prophet\'//2} vs. fey, outsider, undead, or incorporeal/May use 1 rd of rage for a swift action that allows armor and weapons to inflict full damage on incorporeal creatures for 1 rd"',
  'Spirit Guide':
    'Section=magic ' +
    'Note="May use effects of <i>Dancing Lights</i>, <i>Ghost Sound</i>, and <i>Mage Hand</i> 1/dy and <i>Guidance</i> 1/rage"',
  'Spirit Warrior':
    'Section=magic ' +
    'Note="Increases Spirit Guide <i>Guidance</i> bonus to +%{$\'levels.Rage Prophet\'} vs. fey, outsider, undead, or incorporeal/May use 1 rd of rage for an immediate action that allows armor and weapons to inflict full damage on incorporeal creatures for 1 rd"',

  // Stalwart Defender
  'Armor Class Bonus (Stalwart Defender)':'Section=combat Note="+%V AC"',
  'Bulwark':
    'Section=skill ' +
    'Note="+%V foe DC for Bluff and movement Acrobatics during stance"',
  // Clear Mind as Pathfinder.js
  // Damage Reduction as Pathfinder.js
  'Defensive Powers':'Section=feature Note="%V selections"',
  'Defensive Stance':
    'Section=combat ' +
    'Note="Voluntary immobility gives +2 AC, +4 Strength, +4 Constitution, and +2 Will for %{($\'levels.Stalwart Defender\' - 1) * 2 + constitutionModifier + 4} rd/8 hr rest; fatigued afterwards for 2 rd per rd in stance"',
  'Fearless Defense':
    'Section=save Note="Immune to shaken and frightened during stance"',
  'Halting Blow':
    'Section=combat Note="Successful movement AOO halts foe during stance"',
  'Immobile':
    'Section=combat ' +
    'Note="+%{$\'levels.Stalwart Defender\'} CMD vs. bull rush, overrun, pull, push, and movement grapple during stance"',
  // Improved Uncanny Dodge as Pathfinder.js
  // Increased Damage Reduction as Pathfinder.js
  'Intercept':
    'Section=combat ' +
    'Note="May suffer damage from an attack directed at an adjacent ally during stance 1/rd"',
  // Internal Fortitude as Pathfinder.js
  'Last Word':
    'Section=combat ' +
    'Note="May make an extra attack w/dbl damage when a hit to self results in negative HP or unconsciousness 1/dy"',
  'Mighty Resilience':
    'Section=combat ' +
    'Note="May negate extra damage and effects from crit or sneak attack 1/stance"',
  'Mobile Defense':'Section=combat Note="May take a 5\' step during stance"',
  'Renewed Defense':
    'Section=combat ' +
    'Note="May regain %{$\'levels.Stalwart Defender\'//2}d8+%{constitutionModifier} HP during stance 1/dy"',
  'Roused Defense':
    'Section=combat ' +
    'Note="May use stance while fatigued; immune to fatigued during stance, exhausted afterward for 10 min per rd in stance"',
  'Smash (Stalwart Defender)':
    'Section=combat ' +
    'Note="May make an extra shield bash or slam attack for 1d%{features.Small ? 3 : 4}+%{strengthModifier//2} HP 1/rd during stance"',
  // Uncanny Dodge as Pathfinder.js
  // Unexpected Strike as Pathfinder.js

  // Feats
  'Additional Traits':'Section=feature Note="+2 Trait Count"',
  'Allied Spellcaster':
    'Section=magic ' +
    'Note="+2 to overcome spell resistance when an adjacent ally has this feat; +4 and +1 caster level when the ally has the same spell"',
  'Arcane Blast':
    'Section=magic ' +
    'Note="R30\' Ranged touch spends a spell slot (level 1 minimum) to inflict 2d6 HP + 1d6 HP/slot level"',
  'Arcane Shield':
    'Section=magic ' +
    'Note="May use a spell slot to gain +1 AC/slot level for 1 rd"',
  'Arcane Talent':'Section=magic Note="May cast chosen Talent0 spell 3/dy"',
  'Aspect Of The Beast (Claws Of The Beast)':
    'Section=combat ' +
    'Note="Claws inflict %{features.Small ? \'1d3\' : \'1d4\'} HP damage"',
  'Aspect Of The Beast (Night Senses)':'Section=feature Note="%V"',
  "Aspect Of The Beast (Predator's Leap)":
    'Section=skill Note="May jump from a standing start w/out increased DC"',
  'Aspect Of The Beast (Wild Instinct)':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Initiative",' +
      '"+2 Survival"',
  'Bashing Finish':
    'Section=combat Note="May make a free shield bash after crit"',
  'Bloody Assault':
    'Section=combat ' +
    'Note="May suffer -5 attack to inflict 1d4 HP/rd bleed damage (DC 15 Heal or magical healing ends)"',
  'Bodyguard':
    'Section=combat ' +
    'Note="May use AOO for an aid another action that gives an adjacent ally +2 AC"',
  'Bouncing Spell':
    'Section=magic ' +
    'Note="May spend +1 spell slot to redirect an ineffective spell to another target"',
  'Breadth Of Experience':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 all Knowledge/+2 all Profession",' +
      '"May use Knowledge and Profession untrained"',
  'Bull Rush Strike':
    'Section=combat Note="May push foe on a crit confirm that exceeds foe CMD"',
  'Charge Through':
    'Section=combat ' +
    'Note="May attempt a free overrun during charge; failure ends charge"',
  'Childlike':
    'Section=skill ' +
    'Note="May take 10 on Bluff (appear innocent)/+2 Disguise (human child)"',
  'Cloud Step':
    'Section=ability Note="May walk %{levels.Monk//2*5<?50}\' on air for 1 rd"',
  'Cockatrice Strike':
    'Section=combat ' +
    'Note="Crit on a full-round unarmed attack petrifies dazed, flat-footed, paralyzed, staggered, stunned, or unconscious foe (DC %{10 + level//2 + wisdomModifier} Fort neg)"',
  'Combat Patrol':
    'Section=combat ' +
    'Note="May use a full-round action to increase threat area by %{baseAttack//5*5}\'"',
  'Cooperative Crafting':
    'Section=skill ' +
    'Note="Assisting another gives +2 Craft or Spellcraft and dbl daily output"',
  'Coordinated Defense':
    'Section=combat ' +
    'Note="+2 CMD (+4 vs. larger foe) when an adjacent ally has this feat"',
  'Coordinated Maneuvers':
    'Section=combat ' +
    'Note="+2 CMB, +2 CMD, and +4 vs. grapple when an adjacent ally has this feat"',
  'Cosmopolitan':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Language Count",' +
      '"Choice of 2 Intelligence, Wisdom, or Charisma skills are class skills"',
  'Covering Defense':
    'Section=combat ' +
    'Note="Total defense action gives +%{shield==\'Tower\' ? 4 : shield=~\'Heavy\' ? 2 : shield==\'None\' ? 0 : 1} AC to an adjacent ally"',
  'Crippling Critical':
    'Section=combat ' +
    'Note="Crit reduces foe speed by half for 1 min (DC %{10 + baseAttack} Fort 1d4 rd)"',
  'Crossbow Mastery':
    'Section=combat ' +
    'Note="May reload a crossbow as a free action w/out provoking AOO"',
  'Dastardly Finish':
    'Section=combat ' +
    'Note="May deliver coups de grace to cowering or stunned targets"',
  'Dazing Assault':
    'Section=combat ' +
    'Note="May suffer -5 attack to daze w/hit (DC %{10 + baseAttack} Fort neg)"',
  'Dazing Spell':
    'Section=magic ' +
    'Note="May use +3 spell slot w/damaging spell to daze target (spell save or Will neg) for spell level rd"',
  'Deep Drinker':'Section=feature Note="Increased Drunken Ki effects"',
  'Deepsight':'Section=feature Note="120\' Darkvision"',
  'Disarming Strike':
    'Section=combat ' +
    'Note="May disarm foe on a crit confirm that exceeds foe CMD"',
  'Disrupting Shot':
    'Section=combat ' +
     'Note="R30\' Casting opponent suffers +4 concentration DC from a successful readied ranged attack"',
  'Disruptive Spell':
    'Section=magic ' +
    'Note="May spend +1 spell slot to inflict a concentration check to use a spell or spell-like ability for 1 rd"',
  "Diviner's Delving":
    'Section=magic ' +
    'Note="Gives +2 checks to overcome divination spell resistance, and concentration divinations require 1 fewer rd"',
  'Dreadful Carnage':
    'Section=combat ' +
    'Note="R30\' Successful Intimidation check demoralizes foes after reducing a foe to 0 or negative HP"',
  'Duck And Cover':
    'Section=combat,save ' +
    'Note=' +
      '"+2 AC vs. ranged if an adjacent ally w/a shield has this feat",' +
      '"May use rolled Reflex save die of an adjacent ally who has this feat; knocked prone afterward"',
  'Eagle Eyes':
    'Section=skill Note="Ignores -5 distance penalties on visual Perception"',
  'Eclectic':'Section=feature Note="May choose 1 additional favored class"',
  'Ectoplasmic Spell':
    'Section=magic ' +
    'Note="May spend +1 spell slot to target an incorporeal or ethereal creature"',
  'Eldritch Claws':
    'Section=combat ' +
    'Note="Natural weapons are considered magic and silver for overcoming DR"',
  'Elemental Fist':
    'Section=combat ' +
    'Note="Unarmed hit inflicts +%Vd6 HP of choice of energy type 1/rd %1/dy"',
  'Elemental Focus (Acid)':
    'Section=magic Note="+%V save DC on spells that inflict acid damage"',
  'Elemental Focus (Cold)':
    'Section=magic Note="+%V save DC on spells that inflict cold damage"',
  'Elemental Focus (Electricity)':
    'Section=magic ' +
    'Note="+%V save DC on spells that inflict electricity damage"',
  'Elemental Focus (Fire)':
    'Section=magic Note="+%V save DC on spells that inflict fire damage"',
  'Elemental Spell (Acid)':
    'Section=magic ' +
    'Note="May use +1 spell slot to convert half or all spell damage to acid damage"',
  'Elemental Spell (Cold)':
    'Section=magic ' +
    'Note="May use +1 spell slot to convert half or all spell damage to cold damage"',
  'Elemental Spell (Electricity)':
    'Section=magic ' +
    'Note="May use +1 spell slot to convert half or all spell damage to electricity damage"',
  'Elemental Spell (Fire)':
    'Section=magic ' +
    'Note="May use +1 spell slot to convert half or all spell damage to fire damage"',
  'Elven Accuracy':
    'Section=combat Note="May reroll a bow miss due to concealment"',
  'Enforcer':
    'Section=combat ' +
    'Note="Successful Intimidation after inflicting nonlethal damage shakes foe for 1 rd/HP damage; crit also frightens 1 rd"',
  'Expanded Arcana':
    'Section=magic Note="+%V spells known, or +%1 of lower than max level"',
  'Extra Bombs':'Section=combat Note="+%V/dy"',
  'Extra Discovery':'Section=feature Note="+%V selections"',
  'Extra Hex':'Section=feature Note="+%V selections"',
  'Extra Rage Power':'Section=feature Note="+%V selections"',
  'Extra Revelation':'Section=feature Note="+%V selections"',
  'Extra Rogue Talent':'Section=feature Note="+%V selections"',
  'Fast Drinker':
    'Section=feature Note="May drink for temporary Ki as a swift action"',
  'Fast Healer':
    'Section=combat ' +
    'Note="Any healing restores %{constitutionModifier//2>?1} additional HP"',
  'Favored Defense':
    'Section=combat ' +
    'Note="Adds half favored enemy bonus to AC and CMD vs. %V chosen favored enemy"',
  'Fight On':
    'Section=combat ' +
    'Note="May gain %{constitutionModifier} temporary HP for 1 min when brought to 0 or negative HP 1/dy"',
  'Flyby Attack':
    'Section=combat Note="May take action any time during fly move"',
  'Focused Shot':
    'Section=combat ' +
    'Note="R30\' +%{intelligenceModifier} HP damage on a bow or crossbow attack"',
  'Focused Spell':
    'Section=magic ' +
    'Note="May spend +1 spell slot to inflict +2 save DC on one chosen target of a multi-target spell"',
  'Following Step':'Section=combat Note="May use Step Up to move 10\'"',
  'Furious Focus':
    'Section=combat ' +
    'Note="Suffers no penalty on first attack using two-handed Power Attack"',
  'Gang Up':
    'Section=combat ' +
    'Note="Always considered flanking when two allies threaten the same foe"',
  'Gnome Trickster':
    'Section=magic ' +
    'Note="May cast <i>Mage Hand</i> and <i>Prestidigitation</i> 1/dy"',
  'Go Unnoticed':
    'Section=skill ' +
    'Note="May use Stealth to hide from flat-footed foes during the first rd of combat"',
  'Greater Blind-Fight':
    'Section=combat ' +
    'Note="Suffers no miss chance from foe concealment, 20% miss chance from total concealment; located unseen attacker gains no ranged attack bonus"',
  'Greater Dirty Trick':
    'Section=combat ' +
    'Note="+2 dirty trick CMB%{$\'features.Improved Dirty Trick\' ? \' (+4 total w/Improved Dirty Trick)\' : \'\'}/Dirty Trick penalty lasts 1d4 rd + 1 rd/5 over target CMD and requires a standard action to remove"',
  'Greater Drag':
    'Section=combat ' +
    'Note="+2 drag CMB%{$\'features.Improved Drag\' ? \' (+4 total w/Improved Drag)\' : \'\'}/Drag target provokes AOO"',
  'Greater Elemental Focus (Acid)':
    'Section=magic Note="Increased Elemental Focus (Acid) effects"',
  'Greater Elemental Focus (Cold)':
    'Section=magic Note="Increased Elemental Focus (Cold) effects"',
  'Greater Elemental Focus (Electricity)':
    'Section=magic Note="Increased Elemental Focus (Electricity) effects"',
  'Greater Elemental Focus (Fire)':
    'Section=magic Note="Increased Elemental Focus (Fire) effects"',
  'Greater Reposition':
    'Section=combat ' +
    'Note="+2 reposition CMB%{$\'features.Improved Reposition\' ? \' (+4 total w/Improved Reposition)\' : \'\'}/Reposition target provokes AOO"',
  'Greater Shield Specialization (Buckler)':
    'Section=combat ' +
    'Note="+2 AC vs. crit%{$\'features.Shield Specialization (Buckler)\' ? \' (+4 total w/Shield Specialization (Buckler))\' : \'\'}; may negate crit 1/dy"',
  'Greater Shield Specialization (Heavy)':
    'Section=combat ' +
    'Note="+2 AC vs. crit%{$\'features.Shield Specialization (Heavy)\' ? \' (+4 total w/Shield Specialization (Heavy))\' : \'\'}; may negate crit 1/dy"',
  'Greater Shield Specialization (Light)':
    'Section=combat ' +
    'Note="+2 AC vs. crit%{$\'features.Shield Specialization (Light)\' ? \' (+4 total w/Shield Specialization (Light))\' : \'\'}; may negate crit 1/dy"',
  'Greater Shield Specialization (Tower)':
    'Section=combat ' +
    'Note="+2 AC vs. crit%{$\'features.Shield Specialization (Tower)\' ? \' (+4 total w/Shield Specialization (Tower))\' : \'\'}; may negate crit 1/dy"',
  'Greater Steal':
    'Section=combat ' +
    'Note="+2 steal CMB%{$\'features.Improved Steal\' ? \' (+4 total w/Improved Steal)\' : \'\'}/Target does not notice a successful steal until after combat"',
  'Groundling':
    'Section=magic ' +
    'Note="May use <i>Speak With Animals</i> w/burrowing animals at will"',
  'Heroic Defiance':
    'Section=combat Note="May delay effects of a harmful condition 1 rd 1/dy"',
  'Heroic Recovery':
    'Section=save ' +
    'Note="May roll an additional Fortitude save vs. a harmful condition 1/dy"',
  'Improved Blind-Fight':
    'Section=combat ' +
    'Note="Suffers no miss chance from foe concealment; R30\' located unseen attacker gains no ranged attack bonus"',
  'Improved Dirty Trick':
    'Section=combat ' +
    'Note="May perform a dirty trick w/out provoking AOO/+2 dirty trick CMB and CMD"',
  'Improved Drag':
    'Section=combat ' +
    'Note="May perform drag w/out provoking AOO/+2 drag CMB and CMD"',
  'Improved Ki Throw':
    'Section=feature ' +
    'Note="May use Ki Throw for a -4 bull rush on another target"',
  'Improved Reposition':
    'Section=combat ' +
    'Note="May perform reposition w/out provoking AOO/+2 reposition CMB and CMD"',
  'Improved Second Chance':
    'Section=combat ' +
    'Note="May make remaining attacks of a full-attack action after Second Chance, suffering a -5 penalty"',
  'Improved Share Spells':
    'Section=companion ' +
    'Note="R5\' May share non-instantaneous self spells w/companion; halves spell effects duration"',
  'Improved Sidestep':
    'Section=combat Note="May move normally on next rd after Sidestep"',
  'Improved Steal':
    'Section=combat ' +
    'Note="May perform a steal w/out provoking AOO/+2 Steal CMB and CMD"',
  'Improved Stonecunning':'Section=skill Note="Increased Stonecunning effects"',
  "In Harm's Way":
    'Section=combat ' +
    'Note="May suffer all damage from an attack aimed at an adjacent ally when using aid another"',
  'Intensified Spell':
    'Section=magic ' +
    'Note="May spend +1 spell slot to raise the spell damage cap by 5 HD"',
  'Ironguts':
    'Section=save,skill ' +
    'Note=' +
      '"+2 vs. ingested poisons, nauseated, and sickened",' +
      '"+2 Survival (find food for self)"',
  'Ironhide':'Section=combat Note="+1 AC"',
  'Keen Scent':'Section=feature Note="Has Scent feature"',
  'Ki Throw':
    'Section=feature ' +
    'Note="May throw foe into an adjacent unoccupied square w/out provoking AOO after a successful unarmed trip"',
  'Leaf Singer':
    'Section=feature ' +
    'Note="Dbl range or area of effect of audible Bardic Performance in forest/+2 Bardic Performance DC vs. feys"',
  'Light Step':
    'Section=ability ' +
    'Note="Treats difficult terrain as normal terrain in natural environments"',
  'Lingering Performance':
    'Section=feature ' +
    'Note="Bardic Performance effects continue for 2 rd after performance ends"',
  'Lingering Spell':
    'Section=magic ' +
    'Note="May spend +1 spell slot to cast an instantaneous spell w/duration 1"',
  'Lookout':
    'Section=combat ' +
    'Note="When an adjacent ally has this feat, may take move and standard actions in the surprise round if both self and ally can act; if only ally can act, self gains a surprise round action after ally"',
  'Low Profile':'Section=combat Note="+1 AC vs. ranged"',
  'Lucky Halfling':
    'Section=save Note="R30\' May reroll an ally saving throw 1/dy"',
  'Major Spell Expertise':
    'Section=magic ' +
    'Note="May use %V chosen spell of 5th level or lower as a spell-like ability 2/dy"',
  'Master Alchemist':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Craft (Alchemy)",' +
      '"May create %{intelligenceModifier>?1} potion doses simultaneously/May craft alchemical items for 1/10 cost"',
  'Merciful Spell':
    'Section=magic Note="May cast spells to inflict nonlethal damage"',
  'Minor Spell Expertise':
    'Section=magic ' +
    'Note="May use %V chosen spell of 1st level as a spell-like ability 2/dy"',
  'Missile Shield':
    'Section=combat Note="Suffers no damage from a ranged hit 1/rd"',
  'Mounted Shield':
    'Section=combat Note="+%V mount AC and Ride checks to avoid mount damage"',
  'Mounted Skirmisher':
    'Section=combat Note="May take a full-attack action during mount move"',
  'Outflank':
    'Section=combat ' +
    'Note="+4 flanking attack when an ally has this feat; crit gives ally AOO"',
  'Paired Opportunists':
    'Section=combat ' +
    'Note="+4 AOO and may share ally AOO when an adjacent ally has this feat and threatens the same foe"',
  'Parry Spell':'Section=magic Note="Countered spell turns back on caster"',
  'Parting Shot':
    'Section=combat ' +
    'Note="May make a ranged attack during withdraw action 1/encounter"',
  'Pass For Human':
    'Section=skill Note="+10 Disguise (pass as human); may take 10 on check"',
  'Perfect Strike':
    'Section=combat ' +
    'Note="May use the best of %V rolls when attacking w/a %1 %2/dy"',
  'Persistent Spell':
    'Section=magic ' +
    'Note="May spend +2 spell slot to force target to take worse of 2 saving throws"',
  'Point-Blank Master':
    'Section=combat ' +
    'Note="Using chosen ranged weapon while threatened provokes no AOO"',
  'Practiced Tactician':
    'Section=combat Note="May use Tactician feature +%V/dy"',
  'Precise Strike':
    'Section=combat Note="+1d6 HP damage when flanking ally has this feat"',
  'Preferred Spell':
    'Section=magic ' +
    'Note="May cast %V chosen spell in place of prepared spell"',
  'Punishing Kick':
    'Section=combat ' +
    'Note="Successful kick attack inflicts choice of %V\' push or %{$\'features.Hungry Ghost Monk\' ? \\"5\' push and \\" : \'\'}knocked prone (DC %{10+level//2+wisdomModifier} neg) %1/dy"',
  'Pushing Assault':
    'Section=combat ' +
    'Note="May trade Power Attack damage bonus for 5\' push (crit 10\')"',
  'Racial Heritage':
    'Section=feature ' +
    'Note="Counts as both human and chosen race for racial effects"',
  'Raging Vitality':
    'Section=combat ' +
    'Note="+2 Constitution during rage; rage continues while unconscious"',
  'Ray Shield':
    'Section=combat Note="Shield absorbs damage from a ranged touch hit 1/rd"',
  'Razortusk':
    'Section=combat Note="Bite inflicts 1d4+%{strengthModifier} HP damage"',
  'Reach Spell':
    'Section=magic ' +
    'Note="May cast touch, close, or medium range spell at longer range; uses +1 spell slot/range increase"',
  'Rending Claws':
    'Section=combat ' +
    'Note="Second claw hit in 1 rd inflicts +1d6 HP damage 1/rd"',
  'Repositioning Strike':
    'Section=combat Note="May move foe w/crit confirm that exceeds foe CMD"',
  'Saving Shield':
    'Section=combat Note="May use shield to give an adjacent ally +2 AC"',
  'Second Chance':
    'Section=combat ' +
    'Note="May forego additional attacks of a full-attack action to reroll a miss on the first attack"',
  'Selective Spell':
    'Section=magic ' +
    // Can't incorporate ability modifier value, since feat can be applied to
    // spells from different sources.
    'Note="May spend +1 spell slot to protect creatures in spell effect area from damage"',
  'Shadow Strike':
    'Section=combat ' +
    'Note="May inflict precision damage on targets w/concealment"',
  'Shared Insight':
    'Section=skill ' +
    'Note="R30\' May use move to give allies +2 Perception for %{wisdomModifier>?1} rd"',
  'Sharp Senses':'Section=skill Note="Increased Keen Senses effects"',
  'Shield Of Swings':
    'Section=combat ' +
    'Note="May reduce two-handed weapon full-attack action damage by half to gain +4 AC and CMD"',
  'Shield Specialization (Buckler)':
    'Section=combat,combat ' +
    'Note=' +
      '"+%V CMD",' +
      '"+2 AC vs. crit"',
  'Shield Specialization (Heavy)':
    'Section=combat,combat ' +
    'Note=' +
      '"+%V CMD",' +
      '"+2 AC vs. crit"',
  'Shield Specialization (Light)':
    'Section=combat,combat ' +
    'Note=' +
      '"+%V CMD",' +
      '"+2 AC vs. crit"',
  'Shield Specialization (Tower)':
    'Section=combat,combat ' +
    'Note=' +
      '"+%V CMD",' +
      '"+2 AC vs. crit"',
  'Shield Wall':
    'Section=combat ' +
    'Note="+1 shield AC bonus when an adjacent ally has this feat and a buckler or light shield; +2 w/a heavy or tower shield"',
  'Shielded Caster':
    'Section=magic ' +
    'Note="+4 concentration when an adjacent ally has this feat and no shield, +5 w/a buckler or light shield, +6 w/a heavy or tower shield/Suffer half concentration DC from foe Disruptive or similar feature"',
  'Sickening Spell':
    'Section=magic ' +
    'Note="May spend +2 spell slot to sicken target (spell save or Fort neg) for spell level rd"',
  'Sidestep':
    'Section=combat ' +
    'Note="May move 5\' w/in threatened area w/out provoking AOO after a foe miss; suffers -5\' move next rd"',
  'Smash':
    'Section=ability,combat ' +
    'Note=' +
      '"+5 Strength checks to force doors",' +
      '"Attacks on inanimate, unattended objects ignore 5 points of hardness"',
  'Smell Fear':
    'Section=skill ' +
    'Note="+4 Perception (smell shaken, frightened, and panicked creatures); may use Perception instead of Sense Motive with such creatures"',
  'Sociable':
    'Section=skill ' +
    'Note="R30\' May use move to give allies +2 Diplomacy for %{charismaModifier>?1} rd"',
  'Spell Perfection':
    'Section=magic ' +
    'Note="May use metamagic feat for one chosen spell w/out cost; spell gains dbl other feat bonuses"',
  'Spider Step':
    'Section=ability ' +
    'Note="May move %{levels.Monk//2*5<?50}\' across walls, ceiling, and unsupportive surfaces for 1 rd"',
  'Stabbing Shot':
    'Section=combat ' +
    'Note="May use first bow attack of a full-attack action to stab and push an adjacent foe 5\'; all attacks suffer -2 penalty"',
  'Steel Soul':'Section=save Note="Increased Hardy effects"',
  'Step Up And Strike':'Section=combat Note="May make AOO after Step Up"',
  'Stone Sense':
    'Section=feature ' +
    'Note="R10\' May sense location of creatures in contact with the ground"',
  'Stone Singer':
    'Section=feature ' +
    'Note="Dbl range or area of effect of audible Bardic Performance underground, also affecting creatures w/tremorsense/+2 Bardic Performance DC vs. earth creatures"',
  'Stone-Faced':
    'Section=skill ' +
    'Note="+4 Bluff (lying and concealing feelings or motives), foe suffers +5 Sense Motive DC"',
  'Stunning Assault':
    'Section=combat ' +
    'Note="May suffer -5 attack to inflict 1 rd stun (DC %{10+baseAttack} Fort neg)"',
  "Summoner's Call":
    'Section=companion ' +
    'Note="Summoned eidolon gains choice of +2 Strength, Dexterity, or Constitution for 10 min"',
  'Sundering Strike':
    'Section=combat ' +
    'Note="May damage foe weapon w/crit confirm that exceeds foe CMD"',
  'Swap Places':
    'Section=combat ' +
    'Note="May swap places w/an adjacent ally who has this feat; ally suffers no AOO"',
  'Swift Aid':
    'Section=combat ' +
    'Note="Aid another as a swift action gives ally +1 AC or +1 on next attack"',
  'Taunt':
    'Section=skill Note="May use Bluff w/out size penalty to demoralize foes"',
  'Team Up':
    'Section=combat ' +
    'Note="May use aid another as a move action when self and 2 allies threaten same foe"',
  'Teleport Tactician':
    'Section=combat ' +
    'Note="Foe teleporting to or from a threatened square provokes AOO"',
  'Tenacious Transmutation':
    'Section=magic ' +
    'Note="Self transmutation spell gains +2 DC to dispel, and effects continue 1 rd after a successful dispel"',
  'Thundering Spell':
    'Section=magic ' +
    'Note="May spend +2 spell slot to deafen target (spell save or Fort neg) for spell level rd"',
  'Touch Of Serenity':
    'Section=combat ' +
    'Note="May forego attack damage to prevent a foe from attacking or spellcasting for %V rd (DC %{10+level//2+wisdomModifier} Will neg) %1/dy"',
  'Trick Riding':
    'Section=combat,skill ' +
    'Note=' +
      '"In light or no armor, may negate 2 hits on mount/rd using Mounted Combat",' +
      '"In light or no armor, gains automatic success on DC 15 or lower Ride checks and suffers no penalty for bareback riding"',
  'Tripping Strike':
    'Section=combat ' +
    'Note="May inflict trip w/crit confirm that exceeds foe CMD"',
  'Under And Over':
    'Section=combat ' +
    'Note="May make an immediate +2 trip maneuver w/out provoking AOO after a larger foe grapple attempt fails"',
  'Underfoot':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 AC vs. AOO from moving through larger foe threat area",' +
      '"+4 Acrobatics (move past larger foes w/out provoking AOO)"',
  'Vermin Heart':
    'Section=magic,skill ' +
    'Note=' +
      '"May target vermin with animal spells and abilities",' +
      '"May use Wild Empathy w/vermin"',
  'War Singer':
    'Section=feature ' +
    'Note="Dbl range or area of effect of audible Bardic Performance in a melee of 12 or more combatants/+2 Bardic Performance DC vs. orcs"',
  'Well-Prepared':
    'Section=skill ' +
    'Note="May use choice of Sleight Of Hand or Survival (DC 10 + GP cost) to produce required mundane item 1/dy"'

};
PFAPG.PATHS = {
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
      .replace('Acid Dart (Wizard)', 'Create Gear')
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
      .replace('Grave Touch (Wizard)', 'Share Essence'),
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
      .replace('Acid Dart (Wizard)', 'Shift'),
  'Undead':
    Pathfinder.SCHOOLS.Necromancy
      .replace('Grave Touch (Wizard)', 'Bolster')
};
PFAPG.SHIELDS = {
  'Light Steel Quickdraw':'AC=1 Weight=Light Skill=2 Spell=5',
  'Light Wooden Quickdraw':'AC=1 Weight=Light Skill=2 Spell=5'
};
// As noted below, the following two spell lists include Witch spells that are
// restricted to particular patrons and Oracle spells that are restricted to
// the Rage Prophet prestige class. randomizeOneElement takes steps to ensure
// that these spells are not randomly assigned to an unqualified character.
PFAPG.SPELLS = {

  'Absorbing Touch':
    'School=Transmutation ' +
    'Level=Alchemist3 ' +
    'Description="Self hand absorbs touched %{lvl} lb object (Fort neg) for %{lvl} dy"',
  'Accelerate Poison':
    'School=Transmutation ' +
    'Level=D2,R2,S2,W2 ' +
    'Description="Poison affecting touched takes effect immediately or inflicts damage twice as often for half duration"',
  'Acid Pit':
    'School=Conjuration ' +
    'Level=S4,W4,Summoner4 ' +
    'Description="R%{100+lvl*10}\' Creates 10\'x10\' %{lvl//2*10<?100}\' deep extradimensional pit containing 5\' of acid for %{lvl+1} rd; creatures on top fall in (Ref neg, adjacent squares Ref+2; DC 30 Climb to exit) and suffer 2d6 HP acid/rd; objects suffer broken after 3 rd (Fort delays 1 rd), then are destroyed 1 rd later (Fort delays 1 rd)"',
  'Alchemical Allocation':
    'School=Transmutation ' +
    'Level=Alchemist2 ' +
    'Description="Self gains effect of chosen potion in next rd w/out consuming it"',
  'Allfood':
    'School=Transmutation ' +
    'Level=R2 ' +
    'Description="Transforms touched %{lvl*5} lb object into 1 day\'s food for %{lvl*5} Medium creatures"',
  'Alter Winds':
    'School=Transmutation ' +
    'Level=D1,O1,S1,W1 ' + // Oracle Wind
    'Description="Increases or decreases %{lvl>=16 ? \'severe\' : lvl>=10 ? \'strong\' : lvl>=4 ? \'moderate\' : \'light\'} winds 1 step in 10\' radius around touched for %{lvl} hr"',
  'Amplify Elixir':
    'School=Transmutation ' +
    'Level=Alchemist3 ' +
    'Description="Variable effects of potions and elixirs consumed by self increase by 1/2 (dbl duration if no variable effects) for %{lvl} rd"',
  'Ant Haul':
    'School=Transmutation ' +
    'Level=Alchemist1,C1,D1,O1,R1,S1,W1,Summoner1 ' +
    'Description="Touched creature gains triple carrying capacity for %{lvl*2} hr"',
  'Aqueous Orb':
    'School=Conjuration ' +
    'Level=D3,S3,W3,Summoner3 ' +
    'Description="R%{100+lvl*10}\' 10\' diameter sphere douses normal fires and acts as <i>Dispel Magic</i> on magical ones, inflicts 2d6 HP nonlethal (Ref neg) and engulfs (Ref neg), moves 30\'/rd and rolls over 10\' obstacles for %{lvl} rd"',
  'Arcane Concordance':
    'School=Evocation ' +
    'Level=B3 ' +
    'Description="10\' radius gives +1 ally spell DC and free use of choice of Enlarge Spell, Extend Spell, Silent Spell, or Still Spell for %{lvl} rd"',
  'Arrow Eruption':
    'School=Conjuration ' +
    'Level=R2,S2,W2 ' +
    'Description="R%{400+lvl*40}\' Duplicates of arrow that killed in prior rd attack %{lvl<?15} foes in 30\' radius"',
  'Aspect Of The Bear':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="Self gains +2 AC and CMB and does not provoke AOO on bull rush, grapple, and overrun for %{lvl} min"',
  'Aspect Of The Falcon':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description="Self gains +3 Perception, +1 ranged attack, and crit of 19-20/x3 w/bows and crossbows for %{lvl} min"',
  'Aspect Of The Stag':
    'School=Transmutation ' +
    'Level=D4,R3 ' +
    'Description="Self gains +2 AC vs. AOO, +20 Speed, full speed in undergrowth, and immediate attack w/antlers (+%{baseAttack+(strengthModifier>?dexterityModifier)} 1d%{features.Small ? 6 : 8}%{strengthModifier>0 ? \'+\' + strengthModifier : strengthModifier<0 ? strengthModifier : \'\'} HP piercing 19-20/x2) after a successful foe AOO for %{lvl} min"',
  'Aspect Of The Wolf':
    'School=Transmutation ' +
    'Level=D5,R4 ' +
    'Description="Self gains +4 Strength and Dexterity, Scent feature, +2 trip attack, and swift trip w/out provoking AOO for %{lvl} min"',
  'Aura Of Greater Courage':
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="Allies in 10\' radius gain immunity to fear for %{lvl*10} min"',
  'Ball Lightning':
    'School=Evocation ' +
    'Level=D4,S4,W4 ' +
    'Description="R%{100+lvl*10}\' %{(lvl+1)//4} 5\' spheres fly 20\'/rd, inflict 3d6 HP electricity (Ref neg; -4 in metal armor) in 5\' square for %{lvl} rd"',
  'Banish Seeming':
    'School=Abjuration ' +
    'Level=Inquisitor3,Witch5 ' +
    'Description="Touch gives +2 <i>Dispel Magic</i> effects vs. %{lvl//4} illusions or reverts magical transformations (check vs. target HD) for %{lvl} rd"',
  "Bard's Escape":
    'School=Conjuration ' +
    'Level=B5 ' +
    'Description="R%{100+lvl*10}\' Self and %{lvl//2} willing targets in 15\' radius teleport to another location within range"',
  'Beguiling Gift':
    'School=Enchantment ' +
    'Level=B1,Witch1 ' +
    'Description="R5\' Target takes and uses offered object (Will neg) for 1 rd"',
  'Bestow Grace':
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="Touched good creature adds its charisma bonus to saves for %{lvl} min"',
  'Blaze Of Glory':
    'School=Conjuration ' +
    'Level=P4 ' +
    'Description="30\' radius restores %{lvl//2}d6 HP to good creatures, inflicts %{lvl//2}d6 HP on evil (Will half), and gives +1 attack, damage, save, and skill to allies and inflicts -1 on foes for %{lvl} rd; self drops to -1 HP and stabilizes"',
  'Blessing Of Courage and Life':
    'School=Conjuration ' +
    'Level=C2,O2,P2 ' +
    'Description="R%{25+lvl//2*5}\' Target gains +2 save vs. fear and death for %{lvl} min; target may end to regain 1d8+%{lvl<?10} HP"',
  'Blessing Of Fervor':
    'School=Transmutation ' +
    'Level=C4,O4 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius gain choice each rd from: +30 Speed; stand as a swift action w/out provoking AOO; extra attack as part of a full-attack action; +2 attack, AC, and Reflex; or free use of metamagic w/spell up to level 2 for %{lvl} rd"',
  'Blessing Of The Salamander':
    'School=Transmutation ' +
    'Level=D5,R4 ' +
    'Description="Touched gains fast healing 5, fire resistance 20, and +2 CMD for %{lvl} rd"',
  'Blood Biography':
    'School=Divination ' +
    'Level=B2,C3,Inquisitor3,O3,S3,W3 ' +
    'Description="Target blood identifies name and type of creature it came from and when and how it was shed (Will neg)"',
  'Bloodhound':
    'School=Transmutation ' +
    'Level=Alchemist3,Inquisitor2,R2 ' +
    'Description="Self gains Scent features, +8 Perception (smell), +4 Survival (track via scent), -4 save vs. odor, and DC 20 Perception to detect poison via scent for %{lvl} hr"',
  'Bloody Claws':
    'School=Necromancy ' +
    'Level=D4,R3 ' +
    'Description="Touched inflicts +%{lvl//2} HP bleed w/natural slashing or piercing attack for %{lvl} min"',
  "Bomber's Eye":
    'School=Transmutation ' +
    'Level=Alchemist1 ' +
    'Description="Self gains +1 throw attack and +10\' throw range for %{lvl} rd"',
  'Borrow Fortune':
    'School=Evocation ' +
    'Level=Fate3,O3 ' +
    'Description="Self gains better of two immediate d20 rolls, then suffers worse of two d20 rolls for 2 rd"',
  'Borrow Skill':
    'School=Transmutation ' +
    'Level=B1 ' +
    'Description="Self may use chosen skill ranks of touched for next attempt w/in %{lvl} rd"',
  'Bow Spirit':
    'School=Conjuration ' +
    'Level=R4 ' +
    'Description="Conjured spirit attacks using self ammo, bonuses, and feats each rd for %{lvl} rd"',
  'Brand':
    'School=Transmutation ' +
    'Level=Inquisitor0 ' +
    'Description="Inflicts 1 HP on touched to etch indelible mark (Fort neg, scraping to remove inflicts 1d6 HP and brand reappears if healed) for %{lvl} dy"',
  'Greater Brand':
    'School=Transmutation ' +
    'Level=Inquisitor4 ' +
    'Description="Inflicts 1d6 HP on touched to etch permanent indelible mark (Fort neg) that glows and sickens when w/in 30\' of self faith symbol"',
  'Break':
    'School=Transmutation ' +
    'Level=S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Breaks medium object target or destroys already-broken target (Fort neg)"',
  'Brilliant Inspiration':
    'School=Evocation ' +
    'Level=B6,Leadership6 ' +
    'Description="R%{25+lvl//2*5}\' Target gains better of two attack, ability, or skill rolls for %{lvl} rd or until nat 20 is rolled"',
  'Bristle':
    'School=Transmutation ' +
    'Level=D1 ' +
    'Description="Touched may trade up to %{lvl//3<?5} natural armor bonus for equal damage bonus each rd for %{lvl} min"',
  'Burning Gaze':
    'School=Evocation ' +
    'Level=D2,S2,W2,Witch2 ' +
    'Description="R30\' Self inflicts 1d6 HP fire/rd on chosen target (Ref ends) each rd for %{lvl} rd"',
  'Burst Bonds':
    'School=Evocation ' +
    'Level=Inquisitor1 ' +
    'Description="Touched restraints suffer %{lvl<?5}d6 HP (Fort half (magical restraints)), ignoring hardness up to 10, or self gains free +%{lvl<?5} CMB and +%{lvl//2<?5} save attempt to break grapple (Fort neg)"',
  'Cacophonous Call':
    'School=Enchantment ' +
    'Level=B2 ' +
    'Description="R$%{25+lvl//2*5}\' Target suffers nauseated (Will neg) for %{lvl} rd"',
  'Mass Cacophonous Call':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius suffer nauseated (Will neg) for %{lvl} rd"',
  'Calcific Touch':
    'School=Transmutation ' +
    'Level=S4,W4 ' +
    'Description="Touched suffers permanent 1d4 Dexterity damage and <i>Slow</i> effects (Fort Dexterity damage only) 1/rd for %{lvl} rd"',
  'Call Animal':
    'School=Enchantment ' +
    'Level=D1,R1 ' +
    'Description="Nearest wild animal of chosen type (CR %{lvl} max) moves toward self for %{lvl} hr"',
  'Campfire Wall':
    'School=Evocation ' +
    'Level=B3,D2,R2,S3,W3 ' +
    'Description="R%{25+lvl//2*5}\' 20\' radius around fire blocks sight and inflicts 1d6 HP fire and 1d6 min glow on those passing toward fire for %{lvl*2} hr"',
  'Cast Out':
    'School=Abjuration ' +
    'Level=Inquisitor3 ' +
    'Description="Touched suffers 2d8+%{lvl<?15} HP and dispel of %{lvl//4} <i>Magic Jar</i> or enchantment effects (Will half HP and 1 effect)"',
  'Castigate':
    'School=Enchantment ' +
    'Level=Inquisitor2 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers fear for %{lvl} rd (Will ends w/1 rd shaken%{deity != \'None\' ? \'; worshipers of \' + deity + \' save -2\' : \'\'})"',
  'Mass Castigate':
    'School=Enchantment ' +
    'Level=Inquisitor5 ' +
    'Description="R%{100+lvl*10}\' %{lvl} targets in 15\' radius suffer fear for %{lvl} rd (Will ends w/1 rd shaken%{deity != \'None\' ? \'; worshipers of \' + deity + \' save -2\' : \'\'})"',
  'Challenge Evil':
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="R%{25+lvl//2*5}\' Evil target must attack self or suffer sickened (Will neg) and self gains +2 melee attack on target for %{lvl} min"',
  'Chameleon Stride':
    'School=Illusion ' +
    'Level=R2 ' +
    'Description="Self gains +4 Stealth and 20% miss from non-adjacent foes for %{lvl} min"',
  'Clashing Rocks':
    'School=Conjuration ' +
    'Level=D9,O9,S9,W9 ' + // Oracle Stone
    'Description="R%{400+lvl*40}\' Ranged touch inflicts 20d6 HP bludgeoning, knocked prone, and buried in rubble (Ref not buried); missed target and creatures in path suffer 10d6 HP and knocked prone (Ref half HP only)"',
  'Cleanse':
    'School=Evocation ' +
    'Level=C5,Divine5,Inquisitor6,O5 ' +
    'Description="Self regains 4d8+%{lvl<?25} HP, recovers from ability damage and conditions, and breaks one enchantment"',
  'Cloak Of Dreams':
    'School=Enchantment ' +
    'Level=B5,Nightmare6,S6,W6,Witch6 ' +
    'Description="Creatures in 5\' radius fall asleep for 1 min (Will neg; creatures w/Scent -4) for %{lvl} rd"',
  'Cloak Of Shade':
    'School=Abjuration ' +
    'Level=D1,R1 ' +
    'Description="%{lvl} touched treat heat from sunlight as 1 level less severe and reduce penalties from sunlight by 1 for %{lvl} hr"',
  'Cloak Of Winds':
    'School=Abjuration ' +
    'Level=D3,O3,R3,S3,W3 ' + // Oracle Wind
    'Description="R%{25+lvl//2*5}\' Foes of target suffer -4 ranged attacks; Tiny foes cannot touch target, are pushed %{lvl*5}\', and suffer 3d6 HP nonlethal (Fort neg) for %{lvl} min"',
  'Confess':
    'School=Enchantment ' +
    'Level=Inquisitor2 ' +
    'Description="R%{25+lvl//2*5}\' Target must answer truthfully one question from self or suffer %{lvl//2<?5}d6 HP and 2d4 rd sickened (Will half HP only)"',
  'Contagious Flame':
    'School=Evocation ' +
    'Level=S6,W6 ' +
    'Description="R%{25+lvl//2*5}\' %{(lvl+1)//4>?3} ranged touch rays in 15\' radius each inflict 4d6 HP fire and move each rd up to %{25+lvl//2*5}\' to a new target for 3 rd"',
  'Coordinated Effort':
    'School=Divination ' +
    'Level=B3,Inquisitor3 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl//3} allies in 15\' radius gain use of self Teamwork feat for %{lvl} min"',
  'Corruption Resistance':
    'School=Abjuration ' +
    'Level=Antipaladin2,Inquisitor2,P2 ' +
    'Description="Touched gains DR %{lvl>=11?15:lvl>=7?10:5}/- vs. chosen alignment magical damage for %{lvl*10} min"',
  "Coward's Lament":
    'School=Enchantment ' +
    'Level=Inquisitor4 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers cumulative -1 AC, attack, and saves/rd (max -5, DC %{spellDifficultyClass.Inquisitor+4} Will neg 1 rd, attacking self resets to 0) for %{lvl} rd"',
  "Crafter's Curse":
    'School=Transmutation ' +
    'Level=S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers -5 Craft (Will neg) for %{lvl} dy"',
  "Crafter's Fortune":
    'School=Transmutation ' +
    'Level=Alchemist1,S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Target gains +5 on next Craft skill check w/in 10 dy"',
  'Create Pit':
    'School=Conjuration ' +
    'Level=Caves2,S2,W2,Summoner2 ' +
    'Description="R%{100+lvl*10}\' Creates 10\'x10\' %{lvl//2*10<?30}\' deep extradimensional pit for %{lvl+1} rd; creatures on top fall in (Ref neg, adjacent squares Ref+2; DC 25 Climb to exit)"',
  'Create Treasure Map':
    'School=Divination ' +
    'Level=B2,D3,R2,S2,W2 ' +
    'Description="Allows use of 1-day-old corpse to create a map to %{lvl//3} treasures that it knew"',
  'Cup Of Dust':
    'School=Transmutation ' +
    'Level=D3,Witch3 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers dehydration (Fort neg) for %{lvl} dy"',
  'Dancing Lantern':
    'School=Transmutation ' +
    'Level=B1,C1,O1,R1,S1,W1,Witch1 ' +
    'Description="Touched lantern lights magically and follows 5\' behind self for %{lvl} hr"',
  'Deadly Finale':
    'School=Evocation ' +
    'Level=B6 ' +
    'Description="R%{25+lvl//2*5}\' Ending Bardic Performance inflicts 2d8 HP sonic, plus 3d6 HP bleed for 1d6 rd (Fort neg bleed), on %{lvl//3} targets in 15\' radius"',
  'Deafening Song Bolt':
    'School=Evocation ' +
    'Level=B5 ' +
    'Description="R%{25+lvl//2*5}\' Ranged touch w/3 bolts in 15\' radius inflicts 3d10 HP sonic and deafened for 1d6 rd each"',
  'Defile Armor':
    'School=Abjuration ' +
    'Level=Inquisitor4,Antipaladin3 ' +
    'Description="Touched armor gives +%{lvl//4} AC, plus DR 5/good while using Judgment or Smite for %{lvl} min"',
  'Deflection':
    'School=Abjuration ' +
    'Level=Defense7,S7,W7 ' +
    'Description="Missed attacks on self inflict new attack on attacker for %{lvl} rd"',
  'Delayed Consumption':
    'School=Transmutation ' +
    'Level=Alchemist5 ' +
    'Description="Delays effects of second consumed extract of up to level 4 up to %{lvl} dy"',
  'Denounce':
    'School=Enchantment ' +
    'Level=B4,Inquisitor4 ' +
    'Description="R%{25+lvl//2*5}\' Creatures in 30\' radius shift attitude toward target 2 levels worse (Will neg) for %{lvl} hr; target suffers -10 Diplomacy checks to improve attitude of those affected"',
  'Detect Aberration':
    'School=Divination ' +
    'Level=D1,R1 ' +
    'Description="R%{400+lvl*40}\' Cone gives self info on aberrations for conc or %{lvl*10} min"',
  'Detonate':
    'School=Evocation ' +
    'Level=Alchemist4,S4,W4 ' +
    'Description="15\' radius inflicts %{lvl}d8 HP (30\' radius half) chosen energy type (Ref half) in next rd; self suffers half HP"',
  'Devolution':
    'School=Transmutation ' +
    'Level=S3,W3,Summoner3 ' +
    'Description="R%{25+lvl//2*5}\' Target eidolon loses %{lvl//5+1} evolutions (Will neg) for %{lvl} rd"',
  'Discordant Blast':
    'School=Evocation ' +
    'Level=B4 ' +
    'Description="10\' radius or 30\' cone inflicts 3d6 HP sonic and +%{lvl+charismaModifier} CMB bull rush"',
  'Divine Transfer':
    'School=Necromancy ' +
    'Level=P3 ' +
    'Description="Touched regains up to %{constitution} HP, transferred from self, and gains DR %{charismaModifier}/evil for %{lvl} rd"',
  'Divine Vessel':
    'School=Transmutation ' +
    'Level=O8 ' +
    'Description="Self gains size category, +6 Strength, +6 Constitution, +3 AC, 60\' Darkvision, SR %{12+lvl}, and alignment-specific effects for %{lvl} rd"',
  'Draconic Reservoir':
    'School=Evocation ' +
    'Level=Alchemist3,S3,W3 ' +
    'Description="Touched can absorb, then release in +1d6 HP damage bonuses, %{lvl*6} HP of specified energy damage w/in %{lvl*10} min"',
  "Dragon's Breath":
    'School=Evocation ' +
    'Level=Alchemist4,S4,W4 ' +
    'Description="60\' line or 30\' cone inflicts %{lvl<?12}d6 HP specified energy damage (Ref half)"',
  'Dust Of Twilight':
    'School=Conjuration ' +
    'Level=B2,S2,W2 ' +
    'Description="R%{100+lvl*10}\' 5\' radius inflicts fatigue (Fort neg) and extinguishes mundane light and light spells up to level 2"',
  'Eagle Eye':
    'School=Divination ' +
    'Level=D2,R2 ' +
    'Description="R%{400+lvl*40}\' Self can view from higher point for %{lvl} min"',
  'Elemental Aura':
    'School=Evocation ' +
    'Level=Alchemist3,S3,W3 ' +
    'Description="Creatures adjacent to self suffer 2d6 HP chosen energy plus energy-specific effects (Ref half HP only) for %{lvl} rd"',
  'Elemental Speech':
    'School=Divination ' +
    'Level=B3,C3,D2,O3,S2,W2 ' +
    'Description="Self can converse w/chosen element creatures for %{lvl} min"',
  'Elemental Touch':
    'School=Evocation ' +
    'Level=Alchemist2,S2,W2 ' +
    'Description="Touch inflicts 1d6 HP chosen energy, plus energy-specific effects, for %{lvl} rd"',
  'Elude Time':
    'School=Transmutation ' +
    'Level=Alchemist5 ' +
    'Description="Self enters suspended animation, becoming impervious to damage, for up to %{lvl} min"',
  'Enemy Hammer':
    'School=Transmutation ' +
    'Level=S6,W6 ' +
    'Description="R%{400+lvl*40}\' Self can use target each rd for 30\' +%{lvl+(intelligenceModifier>?charismaModifier)} throw attack (Fort neg 1 rd, full-round resistance +4), inflicting 2d6 HP (medium target), for %{lvl} rd"',
  'Enter Image':
    'School=Transmutation ' +
    'Level=B2,C3,O3,S3,W3 ' +
    'Description="R%{lvl*50}\' Self can inhabit and interact from images of self w/in range for conc"',
  'Euphoric Tranquility':
    'School=Enchantment ' +
    'Level=B6,C8,D8,Love8,O8,S8,W8 ' +
    'Description="Touched treats all as friends (Will after attacked neg 1 rd), suffers half speed for %{lvl} rd"',
  'Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner3 ' +
    'Description="Touched eidolon gains an evolution costing up to 4 points for %{lvl} min"',
  'Greater Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner4 ' +
    'Description="Touched eidolon gains 1 or 2 evolutions costing up to 6 points total for %{lvl} min"',
  'Lesser Evolution Surge':
    'School=Transmutation ' +
    'Level=Summoner2 ' +
    'Description="Touched eidolon gains an evolution costing up to 2 points for %{lvl} min"',
  'Expeditious Excavation':
    'School=Transmutation ' +
    'Level=D1,S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Moves 5\' cu of dirt; creatures on top fall into pit (Ref neg)"',
  'Expend':
    'School=Abjuration ' +
    'Level=S7,W7 ' +
    'Description="R%{100+lvl*10}\' 20\' radius successively drains creatures\' limited-use magical abilities (Will ends)"',
  'Feast Of Ashes':
    'School=Transmutation ' +
    'Level=D2,Witch2 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers starvation (Fort neg) and eating causes 1 rd nausea (DC 12 Fort neg) for %{lvl*2} dy"',
  'Feather Step':
    'School=Transmutation ' +
    'Level=B1,D1,R1 ' +
    'Description="R%{25+lvl//2*5}\' Target treats difficult terrain as normal terrain for %{lvl*10} min"',
  'Mass Feather Step':
    'School=Transmutation ' +
    'Level=B3,D3,R3 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius treat difficult terrain as normal terrain for %{lvl*10} min"',
  'Fester':
    'School=Necromancy ' +
    'Level=Inquisitor3,Witch2 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers SR %{lvl+12} to spells that grant healing or temporary HP for %{lvl} rd (Fort 1 rd)"',
  'Mass Fester':
    'School=Necromancy ' +
    'Level=Inquisitor6,Witch6 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius suffer SR %{lvl+12} to spells that grant healing or temporary HP for %{lvl} rd (Fort 1 rd)"',
  'Fiery Body':
    'School=Transmutation ' +
    'Level=Ash9,O9,S9,W9 ' + // Oracle Flame
    'Description="Self gains immunity to fire, blindness, crit, ability damage, deafness, disease, drowning, poison, stunning, and physiology spells, half damage from acid or electricity, +6 Dexterity, 40\' Fly, dazzling brightness, +1 fire spell DC, unarmed attacks inflict +3d6 HP fire, regains damage/3 from fire, suffers x1.5 cold damage, and suffers 2d6 HP/rd but gains 50% miss chance in water, for %{lvl} min"',
  'Fire Breath':
    'School=Evocation ' +
    'Level=Alchemist2,S2,W2 ' +
    'Description="3 uses of 15\' cone inflict 4d6, 2d6, and 1d6 HP fire (Ref half) w/in %{lvl} rd"',
  'Fire Of Entanglement':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="Target of next Smite Evil hit suffers entanglement for %{lvl} rd (Ref 1 rd)"',
  'Fire Of Judgment':
    'School=Evocation ' +
    'Level=P3 ' +
    'Description="Target of next Smite Evil hit suffers 1d6 HP divine (1d10 HP on outsider, dragon, or undead), bypassing DR, when attacking anyone but self for %{lvl} rd (Will 1 rd)"',
  'Fire Of Vengeance':
    'School=Evocation ' +
    'Level=P4 ' +
    'Description="Target of next Smite Evil hit suffers 3d8 HP fire on first attack on anyone but self"',
  'Fire Snake':
    'School=Evocation ' +
    'Level=D5,S5,W5 ' +
    'Description="Adjacent %{lvl} contiguous 5\' sq w/in 60\' inflict %{lvl<?15}d6 HP fire (Ref half)"',
  'Firebrand':
    'School=Transmutation ' +
    'Level=S7,W7 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl//4} targets in 15\' radius gain torchlight, immunity to self fire spells, and weapons inflict +1d6 HP fire for %{lvl} rd; target may end for R30\' ranged touch that inflicts 6d6 HP fire"',
  'Firefall':
    'School=Transmutation ' +
    'Level=S4,W4 ' +
    'Description="R%{400+lvl*40}\' 60\' radius around target fire inflicts 5d6 HP fire and catch on fire (Ref half HP only) and 120\' radius inflicts blinded for 1d4+1 rd (Will neg); fire creature target suffers %{lvl} HP; extinguishes normal target fire up 20\' cu"',
  'Flames Of The Faithful':
    'School=Transmutation ' +
    'Level=Inquisitor2 ' +
    'Description="Touched self weapon inflicts +1d6 HP fire (crit while using Judgment also inflicts +1d10 HP fire or more) for %{lvl} rd"',
  'Flare Burst':
    'School=Evocation ' +
    'Level=B1,D1,S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' 10\' radius inflicts dazzled (Fort neg) for 1 min"',
  'Fluid Form':
    'School=Transmutation ' +
    'Level=Alchemist4,O6,S6,W6 ' + // Oracle Waves
    'Description="Self gains DR 10/slashing, +10 reach, +60\' Swim, Amphibious feature, and ability to squeeze through cracks for %{lvl} min"',
  'Mass Fly':
    'School=Transmutation ' +
    'Level=Feather6,S7,W7 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius gain 60\' fly speed for %{lvl*10} min"',
  'Foe To Friend':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="R%{100+lvl*10}\' Redirects or negates foe attack, and foe counts as an ally for flanking, for 1 rd (Will neg)"',
  'Follow Aura':
    'School=Divination ' +
    'Level=Inquisitor2 ' +
    'Description="Self can track chosen alignment %{lvl>=10 ? \'moderate or \' : \'\'}strong aura for %{lvl*10} min"',
  "Fool's Forbiddance":
    'School=Abjuration ' +
    'Level=B6 ' +
    'Description="10\' radius inflicts confusion on foes (Will staggered) while in radius + 1 rd for conc"',
  'Forced Repentance':
    'School=Enchantment ' +
    'Level=Inquisitor4,P4 ' +
    'Description="R%{25+lvl//2*5}\' Evil target (but not of evil subtype) falls prone and makes confession (Will neg) for %{lvl} rd"',
  'Frozen Note':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="Creatures up to %{lvl+3} HD in 30\' radius held spellbound (%{lvl-3}-%{lvl+3} HD DC %{spellDifficultyClass.B+5} Will neg) for conc or %{lvl} rd"',
  'Gallant Inspiration':
    'School=Divination ' +
    'Level=B2 ' +
    'Description="R%{25+lvl//2*5}\' Target immediately gains +2d4 on failed attack or skill roll"',
  'Getaway':
    'School=Conjuration ' +
    'Level=B6,S6,W6 ' +
    'Description="R30\' Self and %{lvl//2} willing pre-selected targets teleport to a prepared location"',
  'Geyser':
    'School=Conjuration ' +
    'Level=D4,O5,S5,W5,Witch5 ' + // Oracle Waves, Witch Water
    'Description="R%{400+lvl*40}\' 5\' sq inflicts 3d6 HP fire and %{lvl//2}d6 falling (Ref half fire only), and surrounding %{lvl*2.5//1}\' radius inflicts 1d6 HP fire, for conc + 1 rd"',
  'Ghostbane Dirge':
    'School=Transmutation ' +
    'Level=B2,C2,Inquisitor2,O2,P1 ' +
    'Description="R%{25+lvl//2*5}\' Incorporeal target suffers half damage from normal attacks and full damage from magic and magic weapons for %{lvl} rd"',
  'Mass Ghostbane Dirge':
    'School=Transmutation ' +
    'Level=B4,C5,Inquisitor5,O5,P3 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} incorporeal targets in 15\' radius suffer half damage from normal attacks and full damage from magic and magic weapons for %{lvl} rd"',
  'Glide':
    'School=Transmutation ' +
    'Level=D2,R1,S2,W2,Summoner2,Witch2 ' +
    'Description="Self falls 60\'/rd and may move horizontally 300\'/rd for %{lvl} min"',
  'Grace':
    'School=Abjuration ' +
    'Level=C2,O2,P1 ' +
    'Description="Self movement provokes no AOO for 1 rd"',
  'Gravity Bow':
    'School=Transmutation ' +
    'Level=R1,S1,W1 ' +
    'Description="Self bow inflicts damage as if 1 size larger for %{lvl} min"',
  'Grove Of Respite':
    'School=Conjuration ' +
    'Level=D4,O4,R4 ' + // Oracle Nature
    'Description="R%{25+lvl//2*5}\' Creates 20\' radius grove that reports intruders and provides water and fruit that feeds 8 and heals 1 HP for %{lvl*2} hr"',
  'Guiding Star':
    'School=Divination ' +
    'Level=C3,O3,R2,Witch3 ' +
    'Description="Self aware of direction and distance to casting location for %{lvl} dy"',
  "Hero's Defiance":
    'School=Conjuration ' +
    'Level=P1 ' +
    'Description="Expending Lay on Hands use on self when reduced to 0 or negative HP heals +1d6 HP"',
  'Heroic Finale':
    'School=Enchantment ' +
    'Level=B4 ' +
    'Description="R%{25+lvl//2*5}\' End of Bardic Performance allows target an immediate move or standard action"',
  'Hidden Speech':
    'School=Transmutation ' +
    'Level=B2,Inquisitor3,Witch2 ' +
    'Description="R%{25+lvl//2*5}\' Self and %{lvl} targets in 15\' radius gain +10 Bluff to exchange secret messages and foes suffer -5 Sense Motive to decipher for %{lvl*10} min"',
  'Hide Campsite':
    'School=Illusion ' +
    'Level=D3,R2 ' +
    'Description="R%{25+lvl//2*5}\' 20\' cu covers camp activity (Will neg on interaction) for %{lvl*2} hr"',
  'Holy Whisper':
    'School=Evocation ' +
    'Level=P3 ' +
    'Description="30\' cone sickens evil creatures for %{lvl} rd and inflicts 2d8 HP on outsiders, dragons, and undead (Fort neg); also gives good creatures +2 attack and damage for 1 rd"',
  'Honeyed Tongue':
    'School=Transmutation ' +
    'Level=B2,Inquisitor2,P1 ' +
    'Description="Self gains best of two Diplomacy rolls to change attitude for %{lvl*10} min or +5 on next Diplomacy roll to gather information"',
  'Hungry Pit':
    'School=Conjuration ' +
    'Level=Caves6,S5,W5,Summoner5 ' +
    'Description="R%{100+lvl*10}\' Creates 10\'x10\' %{lvl//2*10<?100}\' deep extradimensional pit for %{lvl+1} rd; creatures on top fall in (Ref neg, adjacent squares Ref+2; DC 35 Climb to exit) and suffer 4d6 HP bludgeoning/rd (Ref half)"',
  "Hunter's Eye":
    'School=Divination ' +
    'Level=Inquisitor3,R2 ' +
    'Description="R%{100+lvl*10}\' Self can see target when invisible or concealed (except by darkness) and gains +20 Perception to locate target for %{lvl} min"',
  "Hunter's Howl":
    'School=Necromancy ' +
    'Level=R1 ' +
    'Description="Self gains +2 attack, damage, Bluff, Knowledge, Perception, Sense Motive, and Survival vs. targets in 20\' radius (favored enemies shaken instead) (Will neg) for %{lvl} rd"',
  'Hydraulic Push':
    'School=Evocation ' +
    'Level=D1,S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers CMB +%{lvl+(intelligenceModifier>?wisdomModifier>?charismaModifier)} bull rush; also extinguishes normal fires up to 5\' sq"',
  'Hydraulic Torrent':
    'School=Evocation ' +
    'Level=D3,S3,W3 ' +
    'Description="Creatures in 60\' line suffer CMB +%{lvl+(intelligenceModifier>?wisdomModifier>?charismaModifier)} bull rush; immovable objects %{lvl+(intelligenceModifier>?wisdomModifier>?charismaModifier)} Strength to break; also extinguishes normal fires"',
  'Ill Omen':
    'School=Enchantment ' +
    'Level=Witch1 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers worse of two rolls for next %{lvl//5+1} d20 rolls (aware target can use a move action to negate 1) w/in %{lvl} rd"',
  'Innocence':
    'School=Transmutation ' +
    'Level=B1 ' +
    'Description="Self gains +10 Bluff to promote own innocence for %{lvl} min"',
  'Instant Armor':
    'School=Conjuration ' +
    'Level=C2,O2,P2 ' +
    'Description="Self gains effects of %{lvl>=12 ? \'full plate\' : lvl>=9 ? \'half-plate\' : lvl>=6 ? \'banded mail\' : \'chainmail\'} or magical lesser armor for %{lvl} min"',
  'Instant Enemy':
    'School=Enchantment ' +
    'Level=R3 ' +
    'Description="R%{25+lvl//2*5}\' Self gains favored enemy benefits vs. target for %{lvl} min"',
  'Invigorate':
    'School=Illusion ' +
    'Level=B1 ' +
    'Description="Touched ignores effects of fatigued and exhausted for %{lvl*10} min, suffers 1d6 HP nonlethal after"',
  'Mass Invigorate':
    'School=Illusion ' +
    'Level=B3 ' +
    'Description="%{lvl} touched ignore effects of fatigued and exhausted for %{lvl*10} min, suffer 1d6 HP nonlethal after"',
  "Jester's Jaunt":
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="Touched teleported up to 30\' to a safe spot (Will neg)"',
  'Keen Senses':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,R1 ' +
    'Description="Touched gains +2 Perception and Low-Light Vision (or dbl range) for %{lvl} min"',
  "King's Castle":
    'School=Conjuration ' +
    'Level=P4 ' +
    'Description="R%{25+lvl//2*5}\' Self exchanges places w/target ally"',
  "Knight's Calling":
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="R%{25+lvl//2*5}\' Target must move to attack self (Will neg) for 1 rd"',
  'Lead Blades':
    'School=Transmutation ' +
    'Level=R1 ' +
    'Description="Self melee weapons inflict damage as if 1 size larger for %{lvl} min"',
  'Life Bubble':
    'School=Abjuration ' +
    'Level=C5,D4,O5,R3,S5,W5 ' +
    'Description="%{lvl} touched breathe freely, remain comfortable from -40F to 150F, and are unaffected by pressure for %{lvl*2} hr total"',
  'Light Lance':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="Creates a glowing, good-aligned +1 lance that inflicts +2d6 HP vs. evil foes for %{lvl+1} rd"',
  'Lily Pad Stride':
    'School=Transmutation ' +
    'Level=D3 ' +
    'Description="R%{400+lvl*40}\' Self moves across liquid and others can follow w/DC 10 Acrobatics (half speed; full speed inflicts -5 Acrobatics) for %{lvl*10} min"',
  'Lockjaw':
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="Touched gains +4 CMB to grapple w/out provoking AOO after hit w/natural weapon for %{lvl} rd"',
  'Marks Of Forbiddance':
    'School=Abjuration ' +
    'Level=P3 ' +
    'Description="R%{25+lvl//2*5}\' Ally target and foe target cannot attack one another (Will neg 1 rd) for %{lvl} rd"',
  'Mask Dweomer':
    'School=Illusion ' +
    'Level=Witch1 ' +
    'Description="Spell aura on touched becomes immune to <i>Detect Magic</i> for %{lvl} dy"',
  'Memory Lapse':
    'School=Enchantment ' +
    'Level=B1,Memory2,S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' Target forgets prior rd (Will neg)"',
  'Moonstruck':
    'School=Enchantment ' +
    'Level=D4,Insanity4,Rage6,S4,W4,Witch4 ' +
    'Description="R%{100+lvl*10}\' Target suffers dazed for 1 rd, then suffers confused and gains bite attack, two claw attacks, and rage for %{lvl-2} rd, then suffers dazed for 1 rd (Will neg)"',
  'Nap Stack':
    'School=Necromancy ' +
    'Level=C3,O3 ' +
    'Description="30\' radius gives effects of 8 hr sleep in 2 hr for 8 hr"',
  'Natural Rhythm':
    'School=Transmutation ' +
    'Level=D2 ' +
    'Description="Touched gains +1 cumulative damage using natural attacks (max +5, miss resets to +0) for %{lvl} rd"',
  "Nature's Exile":
    'School=Transmutation ' +
    'Level=D3,Witch3 ' +
    'Description="Touched suffers permanent hostility from natural animals and -10 Survival; any animal companion suffers -2 attack, skill checks, and saves (Will neg)"',
  'Negate Aroma':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,R1 ' +
    'Description="R%{25+lvl//2*5}\' Target loses all odors (Fort neg) for %{lvl} hr"',
  'Oath Of Peace':
    'School=Abjuration ' +
    'Level=P4 ' +
    'Description="Self gains +5 AC and saves and DR 10/evil for %{lvl} rd or until attacks"',
  "Oracle's Burden":
    'School=Necromancy ' +
    'Level=O2 ' +
    'Description="R%{100+lvl*10}\' Target suffers self Oracle\'s Curse effects (Will neg) for %{lvl} min"',
  'Pain Strike':
    'School=Evocation ' +
    'Level=S3,W3,Witch3 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers 1d6 HP nonlethal/rd and sickened (Fort neg) and self gains +4 Intimidate vs. target for %{lvl<?10} rd"',
  'Mass Pain Strike':
    'School=Evocation ' +
    'Level=S5,W5,Witch5 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius suffer 1d6 HP nonlethal/rd and sickened (Fort neg) and self gains +4 Intimidate vs. targets for %{lvl<?10} rd"',
  "Paladin's Sacrifice":
    'School=Abjuration ' +
    'Level=P2 ' +
    'Description="R%{25+lvl//2*5}\' Transfers to self immediate damage and negative effects suffered by target"',
  'Perceive Cues':
    'School=Transmutation ' +
    'Level=Alchemist2,Inquisitor2,R2,Witch2 ' +
    'Description="Self gains +5 Perception and Sense Motive for %{lvl*10} min"',
  'Phantasmal Revenge':
    'School=Illusion ' +
    'Level=S7,W7 ' +
    'Description="Spectre from touched %{lvl}-day-old corpse finds killer and inflicts %{lvl*10} HP (Will neg; DC %{spellDifficultyClass.W+7} Fort 5d6+%{lvl} HP)"',
  'Phantasmal Web':
    'School=Illusion ' +
    'Level=B5,Insanity6,S5,W5 ' +
    'Description="R%{100+lvl*10}\' %{lvl} targets in 15\' radius suffer entanglement (Will neg) and nauseated (Fort each rd neg) for %{lvl} rd"',
  'Pied Piping':
    'School=Enchantment ' +
    'Level=B6 ' +
    'Description="Creatures w/chosen physical trait in 90\' radius follow self (Will neg) for conc + %{lvl} rd"',
  'Pillar Of Life':
    'School=Conjuration ' +
    'Level=C5,O5 ' +
    'Description="R%{100+lvl*10}\' Creatures regain 2d8+%{lvl<?20} HP (undead suffer %{lvl<?10}d6 HP (light-sensitive %{lvl<?10}d8)) on first contact w/5\' sq for %{lvl} rd"',
  'Planar Adaptation':
    'School=Transmutation ' +
    'Level=Alchemist5,C4,O4,S5,W5,Summoner5 ' +
    'Description="Self gains immunity to environmental harm from chosen plane and 20 resistance to an associated energy for %{lvl} hr"',
  'Mass Planar Adaptation':
    'School=Transmutation ' +
    'Level=S7,W7,Summoner6 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius gain immunity to environmental harm from chosen plane and 20 resistance to an associated energy for %{lvl} hr"',
  'Pox Pustules':
    'School=Necromancy ' +
    'Level=D2,S2,W2,Witch2 ' +
    'Description="R%{25+lvl//2*5}\' Target suffers sickened and -4 Dexterity (Fort neg; full-round scratch neg sickened for 1 rd) for %{lvl} min"',
  'Protective Spirit':
    'School=Conjuration ' +
    'Level=R2 ' +
    'Description="Successful +%{baseAttack+dexterityModifier} attack by spirit negates %{dexterityModifier>?1} AOO/rd on self for %{lvl} rd"',
  'Purging Finale':
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="R%{25+lvl//2*5}\' End of Bardic Performance removes chosen condition from target"',
  'Purified Calling':
    'School=Conjuration ' +
    'Level=Summoner4 ' +
    'Description="Subsequent summons brings eidolon w/full HP and no ability damage or temporary conditions"',
  'Putrefy Food And Drink':
    'School=Transmutation ' +
    'Level=Witch0 ' +
    'Description="R10\' Fouls a single potion (Will neg) or %{lvl}\' cu food and water"',
  'Rally Point':
    'School=Enchantment ' +
    'Level=P1 ' +
    'Description="R5\' Good creatures gain +2 attacks, +2 saves, and %{lvl*2} temporary HP for 1 rd on first pass through 5\' sq for %{lvl} min"',
  'Rampart':
    'School=Conjuration ' +
    'Level=D7,S7,W7 ' +
    'Description="R%{100+lvl*10}\' Creates 5\'x10\'x%{lvl//2*10}\' linear or 5\'x%{3+lvl}\' radius circular earthen wall (Hardness 0; 180 HP; DC 20 Climb; DC 60 Strength to break)"',
  'Rebuke':
    'School=Evocation ' +
    'Level=Inquisitor4 ' +
    'Description="Foes in 20\' radius suffer %{lvl//2<?5}d8 HP (half sonic, half divine) and staggered for 1 rd %{deity!=\'None\' ? \'(worshipers of \' + deity + \' \' + (lvl<?10) + \'d6 HP and stunned for 1d4 rd) \' : \'\'}(Fort half HP only)"',
  'Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner3 ' +
    'Description="Touched eidolon regains 3d10+%{lvl<?10} HP"',
  'Greater Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner5 ' +
    'Description="Touched eidolon regains 5d10+%{lvl<?20} HP"',
  'Lesser Rejuvenate Eidolon':
    'School=Conjuration ' +
    'Level=Summoner1 ' +
    'Description="Touched eidolon regains 1d10+%{lvl<?5} HP"',
  'Residual Tracking':
    'School=Divination ' +
    'Level=R1 ' +
    'Description="Self has a vision of the creation of touched footprint"',
  'Resounding Blow':
    'School=Evocation ' +
    'Level=Antipaladin4,Inquisitor5,Paladin4 ' +
    'Description="Hits w/held weapon inflict +1d6 HP sonic, plus staggered 1 rd while using Judgment or Smite (Fort neg); crit inflicts stunned 1 rd and deafened 1d6 rd (Fort neg), for %{lvl} rd"',
  'Rest Eternal':
    'School=Necromancy ' +
    'Level=Ancestors4,C4,O4,D5,Witch5 ' +
    'Description="Touched corpse requires DC %{lvl+11} caster check to communicate, resurrect, or animate"',
  'Restful Sleep':
    'School=Necromancy ' +
    'Level=B1 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} targets in 15\' radius regain 2 x level HP from 8 hr sleep and 3 x level HP from a full day\'s rest"',
  'Resurgent Transformation':
    'School=Conjuration ' +
    'Level=Alchemist5 ' +
    'Description="If reduced to %{hitPoints//4} HP w/in %{lvl} hr, self suffers 1d4 Intelligence and Wisdom damage, regains 4d8+%{lvl<?25} HP (25 HP maximum), and gains +4 Constitution, +4 Strength, DR 5/-, and Haste effects for %{lvl} rd, then suffers exhausted and 1d4 points Constitution damage"',
  'Retribution':
    'School=Necromancy ' +
    'Level=Inquisitor3 ' +
    'Description="R%{25+lvl//2*5}\' Target who just damaged self suffers -4 attack, skill checks, and ability checks for %{lvl} rd (Fort 1 rd%{deity != \'None\' ? \'; worshipers of \' + deity + \' save -2\' : \'\'})"',
  'Reviving Finale':
    'School=Conjuration ' +
    'Level=B3 ' +
    'Description="End of Bardic Performance causes 20\' radius to restore 2d6 HP to allies"',
  'Righteous Vigor':
    'School=Enchantment ' +
    'Level=Inquisitor3,P2 ' +
    'Description="Touched gains +1 attack and 1d8 temporary HP from each successful attack (max +4/20 temporary HP; miss resets to +0) for %{lvl} rd"',
  'River Of Wind':
    'School=Evocation ' +
    'Level=D4,O4,S4,W4 ' + // Oracle Wind
    'Description="5\'x120\' line inflicts 4d6 HP nonlethal and knocked prone (Fort half HP only), then 2d6 HP nonlethal, pushed 20\', and knocked prone (Fort 1d6 HP only) for %{lvl-1} rd"',
  'Sacred Bond':
    'School=Conjuration ' +
    'Level=C3,Inquisitor2,O3,P2 ' +
    'Description="Self and touched may cast touch healing spells on each other at R%{25+lvl//2*5}\' for %{lvl*10} min"',
  'Sacrificial Oath':
    'School=Abjuration ' +
    'Level=Martyr6,P4 ' +
    'Description="Self may suffer damage and negative effects instead of touched target (refusal inflicts %{constitution} HP on self) for %{lvl} min"',
  'Saddle Surge':
    'School=Transmutation ' +
    'Level=P2 ' +
    'Description="Self gains +1 Ride and self and mount gain +1 damage per 5\' move (+%{lvl} max) for %{lvl} rd"',
  'Sanctify Armor':
    'School=Abjuration ' +
    'Level=Inquisitor4,P3 ' +
    'Description="Touched armor gives +%{lvl//4} AC, plus DR 5/evil while using Judgment or Smite, for %{lvl} min"',
  'Saving Finale':
    'School=Evocation ' +
    'Level=B1 ' +
    'Description="R%{25+lvl//2*5}\' End of Bardic Performance allows target to reroll failed save"',
  'Scent Trail':
    'School=Transmutation ' +
    'Level=D2 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl} designated creatures in 15\' radius gain +20 Survival to follow target trail and understand scent messages for %{lvl} hr"',
  'Screech':
    'School=Evocation ' +
    'Level=Witch3 ' +
    'Description="Foes in 30\' radius provoke AOO (Fort neg)"',
  'Sculpt Corpse':
    'School=Necromancy ' +
    'Level=S1,W1 ' +
    'Description="Reshapes touched corpse to look like another creature (Will detect (suspicious or familiar))"',
  'Seamantle':
    'School=Conjuration ' +
    'Level=D8,O8,S8,W8,Witch8 ' + // Oracle Waves, Witch Water
    'Description="30\' water column hinders fire spells and gives self +8 AC, +4 Reflex, 30\' slam attack, and touch that extinguishes fires for %{lvl} min"',
  'Seek Thoughts':
    'School=Divination ' +
    'Level=Alchemist3,B3,Inquisitor3,Summoner3,Thought3,S3,W3,Witch3 ' +
    'Description="40\' radius gives self an answer from nearby thoughts for conc or %{lvl} min (Will neg)"',
  'Shadow Projection':
    'School=Necromancy ' +
    'Level=S4,W4 ' +
    'Description="Self becomes an undead shadow for %{lvl} hr; death reduces body to -1 HP"',
  'Share Language':
    'School=Divination ' +
    'Level=B1,C2,D2,Language2,O2,S2,W2 ' +
    'Description="Touched can use %{lvl//4+1} languages self knows for 1 dy"',
  'Share Senses':
    'School=Divination ' +
    'Level=S4,W4,Witch3 ' +
    'Description="R%{400+lvl*40}\' Self can use familiar\'s senses for %{lvl} min"',
  'Shared Wrath':
    'School=Enchantment ' +
    'Level=Inquisitor4 ' +
    'Description="%{lvl} targets in 15\' radius gain +%{1>?lvl//3<?3} attack, damage, and spell resistance checks%{lvl>=12?\', plus dbl crit threat range,\':\'\'} vs. targeted foe for 1 min"',
  'Shifting Sand':
    'School=Transmutation ' +
    'Level=D3,S3,W3 ' +
    'Description="R%{100+lvl*10}\' 10\' radius earth or sand moves 10\'/rd, creates difficult terrain, inflicts -%{lvl} Acrobatics, and entangles and knocks prone (Ref neg) for %{lvl} rd"',
  'Sift':
    'School=Divination ' +
    'Level=B0,Inquisitor0 ' +
    'Description="R30\' Successful -5 Perception notes fine details at range"',
  'Sirocco':
    'School=Evocation ' +
    'Level=D6,O6,Storms6,S6,W6 ' + // Oracle Wind
    'Description="R%{100+lvl*10}\' 60\' high, 20\' radius inflicts 4d6+%{lvl} HP fire, fatigues, and knocks prone (Fort half HP and neg knocked prone; flying creatures DC 15 Fly to avoid) for %{lvl} rd"',
  'Sleepwalk':
    'School=Enchantment ' +
    'Level=Inquisitor4,Witch4 ' +
    'Description="Touched unconscious creature animates and moves at half speed (Will neg) for %{lvl} hr"',
  'Slipstream':
    'School=Conjuration ' +
    'Level=D2,O2,Oceans2,R2,S2,W2,Witch2 ' + // Oracle Waves, Witch Water
    'Description="Creates a wave that moves touched 10\'/rd (20\' downhill) and gives +20\' Swim for %{lvl*10} min"',
  'Snake Staff':
    'School=Transmutation ' +
    'Level=C5,D5,O5 ' +
    'Description="R%{100+lvl*10}\' Transforms up to %{lvl} sticks in 15\' radius into telepathically controlled snakes for %{lvl} rd"',
  'Solid Note':
    'School=Conjuration ' +
    'Level=B1 ' +
    'Description="R%{25+lvl//2*5}\' Note becomes hand-sized physical object (%{lvl+10} Strength, %{10+charismaModifier} AC, %{2 + baseAttack + charismaModifier} CMD) for conc + %{lvl} rd"',
  'Spark':
    'School=Evocation ' +
    'Level=Talent0,B0,C0,D0,O0,S0,W0,Witch0 ' +
    'Description="R%{25+lvl//2*5}\' Burns unattended Fine flammable object (Fort neg)"',
  'Spiked Pit':
    'School=Conjuration ' +
    'Level=Caves3,S3,W3,Summoner3 ' +
    'Description="R%{100+lvl*10}\' Creates 10\'x10\' %{lvl//2*10<?50}\' deep extradimensional pit for %{lvl+1} rd; creatures on top fall in (Ref neg, adjacent squares Ref+2; DC 20 Climb to exit) and suffer +2d6 HP piercing; contact w/walls inflicts 1d6 HP piercing"',
  'Spiritual Ally':
    'School=Evocation ' +
    'Level=C4,O4 ' +
    'Description="R%{100+lvl*10}\' Force being moves 30\'/rd and makes +%{baseAttack+wisdomModifier}%{baseAttack>=5 ? \'/+\' + (baseAttack-5+wisdomModifier) : \'\'}%{baseAttack>=10 ? \'/+\' + (baseAttack-10+wisdomModifier) : \'\'} attacks inflicting 1d10+%{lvl//3<?5} HP for %{lvl} rd (DC d20+%{lvl} SR ends)"',
  'Spite':
    'School=Abjuration ' +
    'Level=Witch4 ' +
    'Description="First successful melee attack or combat maneuver on self inflicts chosen touch spell up to level 4 on attacker w/in %{lvl} hr"',
  'Stay The Hand':
    'School=Enchantment ' +
    'Level=P4 ' +
    'Description="%{100+lvl*10}\' Target suffers negated attack (Will -5 attack and damage) and -2 attack and damage on same creature for %{lvl} rd"',
  'Stone Call':
    'School=Conjuration ' +
    'Level=D2,O2,R2,S2,W2 ' + // Oracle Stone
    'Description="R%{100+lvl*10}\' 40\' radius inflicts 2d6 HP bludgeoning for 1 rd, then difficult terrain for %{lvl-1} rd"',
  'Stone Fist':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,S1,W1 ' +
    'Description="Self unarmed attacks inflict 1d%{features.Small ? 4 : 6}%{strengthModifier>0 ? \'+\' + strengthModifier : strengthModifier < 0 ? strengthModifier : \'\'} HP bludgeoning w/out provoking AOO and ignore object hardness up to 7 for %{lvl} min"',
  'Stormbolts':
    'School=Evocation ' +
    'Level=C8,D8,O8,S8,W8,Witch8 ' +
    'Description="Targets in 30\' radius suffer %{lvl}d8 HP electricity and stunned 1 rd (Fort half HP only)"',
  'Strong Jaw':
    'School=Transmutation ' +
    'Level=D4,R3 ' +
    'Description="Touched natural weapon inflicts damage as +2 size for %{lvl} min"',
  'Stumble Gap':
    'School=Conjuration ' +
    'Level=S1,W1 ' +
    'Description="R%{25+lvl//2*5}\' 5\' square inflicts 1d6 HP and knocked prone (Ref -1 all rolls for 1 rd) for %{lvl+1} rd"',
  'Stunning Finale':
    'School=Enchantment ' +
    'Level=B5 ' +
    'Description="R%{25+lvl//2*5}\' End of Bardic Performance inflicts stunned 1 rd (Fort staggered 1 rd) on 3 targets in 15\' radius"',
  'Suffocation':
    'School=Necromancy ' +
    'Level=Murder5,S5,W5,Witch5 ' +
    'Description="R%{25+lvl//2*5}\' Target drops to 0 HP next rd (Fort staggered 1 rd), then drops to -1 HP (Fort delays 1 rd), then dies (Fort delays 1 rd) for 3 rd"',
  'Mass Suffocation':
    'School=Necromancy ' +
    'Level=Murder9,S9,W9,Witch9 ' +
    'Description="R%{25+lvl//2*5}\' %{lvl//2} targets in 15\' radius drop to 0 HP next rd (Fort staggered 1 rd), then drop to -1 HP (Fort delays 1 rd), then die (Fort delays 1 rd) for %{lvl} rd"',
  'Summon Eidolon':
    'School=Conjuration ' +
    'Level=Summoner2 ' +
    'Description="R%{25+lvl//2*5}\' Brings eidolon companion from home plane for %{lvl} min"',
  'Swarm Skin':
    'School=Transmutation ' +
    'Level=D6,Witch6 ' +
    'Description="Self flesh transforms into controlled insect swarms until destroyed or ordered to return to bones"',
  'Thorn Body':
    'School=Transmutation ' +
    'Level=Alchemist3,D4 ' +
    'Description="Foe melee hits inflict on attacker 1d6+%{lvl<?15} HP piercing, grapple 2d6+%{lvl<?15} HP, and self unarmed attack +1d6 HP, for %{lvl} rd"',
  'Threefold Aspect':
    'School=Transmutation ' +
    'Level=D5,Witch4 ' +
    'Description="Self may transform freely between young (+2 Dexterity and Constitution, -2 Wisdom), adult (+2 Wisdom and Intelligence, -2 Dexterity), and elderly (+4 Wisdom and Intelligence, -2 Strength and Dexterity) for 1 dy"',
  'Thundering Drums':
    'School=Evocation ' +
    'Level=B3 ' +
    'Description="15\' cone inflicts %{lvl<?5}d8 HP sonic and knocked prone (Fort half HP only)"',
  'Timely Inspiration':
    'School=Divination ' +
    'Level=B1 ' +
    'Description="R%{25+lvl//2*5}\' Target retroactively gains +%{lvl//5<?3} on failed attack or skill roll"',
  'Tireless Pursuers':
    'School=Transmutation ' +
    'Level=Inquisitor4,R3 ' +
    'Description="Self and %{lvl//3} touched gain half damage from hustling and forced march and ignore travel fatigue for %{lvl} hr"',
  'Tireless Pursuit':
    'School=Transmutation ' +
    'Level=Inquisitor1,R1 ' +
    'Description="Self gains half damage from hustling and forced march and ignores travel fatigue for %{lvl} hr"',
  'Touch Of Gracelessness':
    'School=Transmutation ' +
    'Level=B1,S1,W1 ' +
    'Description="Touched suffers 1d6+%{lvl//2<?5} Dexterity damage, knocked prone by moving more than half speed, and flying maneuverability reduced one step (Fort half Dexterity damage only) for %{lvl} rd"',
  'Touch Of The Sea':
    'School=Transmutation ' +
    'Level=Alchemist1,D1,O1,S1,W1 ' + // Oracle Waves
    'Description="Touched gains +30\' swim speed and +8 Swim, plus may use run action and may always take 10 while swimming, for %{lvl} min"',
  'Transmogrify':
    'School=Transmutation ' +
    'Level=Summoner4 ' +
    'Description="Replaces evolutions applied to eidolon and self with others 1/dy"',
  'Transmute Potion To Poison':
    'School=Transmutation ' +
    'Level=Alchemist2 ' +
    'Description="Self may use any potion to poison a weapon for %{lvl} min"',
  'Treasure Stitching':
    'School=Transmutation ' +
    'Level=B4,C4,O4,S5,W5 ' +
    'Description="R%{25+lvl//2*5}\' Transforms objects in 10\' cu into embroidery for %{lvl} dy"',
  'True Form':
    'School=Abjuration ' +
    'Level=D4,S4,W4 ' +
    'Description="R%{100+lvl*10}\' Removes polymorph effects from %{lvl//3} targets in 15\' radius (Will neg for polymorph ability, DC 11+effect level for polymorph spell) for %{lvl} rd"',
  'Tsunami':
    'School=Conjuration ' +
    'Level=D9,O9,Oceans9,S9,W9,Witch9 ' + // Oracle Waves, Witch Water
    'Description="R%{400+lvl*40}\' 10\'x10\'x%{lvl*2}\' wave moves 30\'/60\'/rd over land/water, inflicts 8d6 HP bludgeoning (Fort half), +%{lvl+8+(intelligenceModifier>?charismaModifier>?wisdomModifier)} CMB to knock down and sweep away for 5 rd"',
  'Twilight Knife':
    'School=Evocation ' +
    'Level=S3,W3,Witch3 ' +
    'Description="R%{25+lvl//2*5}\' Force knife flanks and makes +%{baseAttack+(intelligenceModifier>?charismaModifier)} attacks on same foe as self, inflicts 1d4 HP plus %{lvl//4}d6 HP sneak attack for %{lvl} rd"',
  'Twin Form':
    'School=Transmutation ' +
    'Level=Alchemist6 ' +
    'Description="Self splits in two; may act from either for %{lvl} rd"',
  'Unfetter':
    'School=Transmutation ' +
    'Level=Summoner1 ' +
    'Description="R%{100+lvl*10}\' Negates eidolon distance limit and damage sharing for %{lvl*10} min"',
  'Universal Formula':
    'School=Transmutation ' +
    'Level=Alchemist4 ' +
    'Description="Extract effects self as any known extract up to level 3"',
  'Unwilling Shield':
    'School=Necromancy ' +
    'Level=B5,Inquisitor5,S6,W6,Witch6 ' +
    'Description="R%{25+lvl//2*5}\' Self gains half damage and +1 AC and saves, target suffers half of damage to self (Will neg) for %{lvl} rd"',
  'Unwitting Ally':
    'School=Enchantment ' +
    'Level=B0 ' +
    'Description="R%{25+lvl//2*5}\' Self counts target as an ally for flanking (Will neg), and foes do not, for 1 rd"',
  'Vanish':
    'School=Illusion ' +
    'Level=B1,S1,W1 ' +
    'Description="Touched becomes invisible for %{lvl<?5} rd or until attacks"',
  'Veil Of Positive Energy':
    'School=Abjuration ' +
    'Level=P1 ' +
    'Description="Self gains +2 AC and +2 saves vs. undead for %{lvl*10} min; dismissal inflicts %{lvl} HP on undead in 5\' radius"',
  'Venomous Bolt':
    'School=Necromancy ' +
    'Level=R3 ' +
    'Description="Fired arrow or bolt inflicts -1d3 Constitution/rd for 6 rd (Fort neg)"',
  'Versatile Weapon':
    'School=Transmutation ' +
    'Level=B2,R2,S3,W3 ' +
    'Description="R%{25+lvl//2*5}\' Target weapon bypasses DR choice of bludgeoning, cold iron, piercing, silver, or slashing for %{lvl} min"',
  'Vomit Swarm':
    'School=Conjuration ' +
    'Level=Alchemist2,Witch2 ' +
    'Description="Self moves insect swarm that attacks all other creatures for %{lvl} rd"',
  'Vortex':
    'School=Evocation ' +
    'Level=D7,O7,S7,W7,Witch7 ' + // Oracle Waves, Witch Elements
    'Description="R%{400+lvl*40}\' 15\' radius inflicts 3d6 HP bludgeoning (Ref neg) on first contact, then 1d8 HP/rd on Medium and smaller (Ref neg) for %{lvl-1} rd; self may eject creatures from the vortex"',
  'Wake Of Light':
    'School=Evocation ' +
    'Level=P2 ' +
    'Description="10\'x120\' trail behind mount makes difficult terrain normal for good creatures and normal terrain difficult for evil creatures for %{lvl} rd"',
  'Wall Of Lava':
    'School=Conjuration ' +
    'Level=D8,S8,W8 ' +
    'Description="R%{100+lvl*10}\' Creates %{lvl} contiguous 5\' sq wall sections for %{lvl} rd; foe strike inflicts 2d6 HP fire on weapon; passage (DC 25 Strength) inflicts 20d6 HP fire; R60\' ranged touch inflicts 10d6 HP fire and destroys 1d4 sections 1/rd; half damage continues for 1d3 rd"',
  'Wall Of Suppression':
    'School=Abjuration ' +
    'Level=S9,W9 ' +
    'Description="R%{100+lvl*10}\' Creates %{lvl*2} 5\' sq wall sections that suppress for %{lvl} rd passing magic effects and spells up to caster level %{lvl} for %{lvl*10} min"',
  'Wandering Star Motes':
    'School=Illusion ' +
    'Level=B4,S4,W4,Witch4 ' +
    'Description="R%{25+lvl//2*5}\' Target loses any concealment and suffers dazed (Will ends and transfers 30\' to nearest foe) for %{lvl} rd"',
  'Ward The Faithful':
    'School=Abjuration ' +
    'Level=Inquisitor3 ' +
    'Description="10\' radius around touched gives +%{lvl>=18?4:lvl>=12?3:2} AC and saves to fellow believers for %{lvl*10} min"',
  'Weapon Of Awe':
    'School=Transmutation ' +
    'Level=C2,Inquisitor2,O2,P2 ' +
    'Description="Touched weapon or unarmed strike gains +2 damage, and crit inflicts 1 rd shaken, for %{lvl} min"',
  'Winds Of Vengeance':
    'School=Evocation ' +
    'Level=C9,D9,O9,S9,W9,Wind9 ' +
    'Description="Self gains 60\' fly and immunity to wind, gas, and ranged weapons; inflicts on attackers 5d8 HP bludgeoning and knocked prone (Fort half HP only), for %{lvl} min"',
  'World Wave':
    'School=Transmutation ' +
    'Level=D9,Exploration9,O9,S9,W9 ' + // Oracle Nature
    'Description="Self rides 20\'x10\' natural terrain oval that forms 30\' wave for %{lvl} rd or 5\' swell for %{lvl} hr, moves %{speed*8}\'/rd, and inflicts 6d6 (wave) or 1d6 (swell) HP bludgeoning to non-natural objects (constructs and undead suffer dbl HP)"',
  'Wrath':
    'School=Enchantment ' +
    'Level=Inquisitor1 ' +
    'Description="Self gains +%{1>?lvl//3<?3} attack, damage, and spell resistance checks%{lvl>=12?\', plus dbl crit threat range,\':\'\'} vs. targeted foe for 1 min"',
  'Wrathful Mantle':
    'School=Evocation ' +
    'Level=C3,O3,P3 ' +
    'Description="Touched gains +%{lvl//4<?5} saves for %{lvl} min; target may dismiss to inflict 2d8 HP force to creatures in 5\' radius"'

};
PFAPG.SPELLS_LEVELS_ADDED = {

  'Acid Splash':'Inquisitor0,Summoner0',
  'Aid':'Alchemist2,Curse2,Inquisitor2,O2,Tactics2',
  'Air Walk':'Alchemist4,O4,Wind4',
  'Alarm':'Home1,Inquisitor1,Summoner1',
  'Align Weapon':
    'Agathion2,"Archon Good2","Archon Law2","Azata Chaos2","Azata Good2",Daemon2,"Demon Chaos2","Demon Evil2","Devil Evil2","Devil Law2",Inevitable2,Inquisitor2,O2,Protean2',
  'Alter Self':'Alchemist2,Summoner2,Witch2',
  'Analyze Dweomer':'Alchemist6,Arcane6,Witch6',
  'Animal Growth':'Witch5', // Witch Animals
  'Animal Shapes':
    'Feather7,Fur7,O8,Witch8', // Oracle Nature; Witch Agility, Animals
  'Animate Dead':'Antipaladin3,O3,Souls3,Undead3,Witch4', // Witch Plague
  'Animate Objects':'O6,Witch6',
  'Animate Plants':'Decay7,Growth7',
  'Animate Rope':'Construct1,Witch1', // Witch Trickery
  'Antilife Shell':'Fur6,O6,Souls6,Witch6', // Witch Animals
  'Antimagic Field':'Defense6,Divine6,Purity6,O8',
  'Antipathy':'Summoner6,Witch8',
  'Arcane Eye':'Alchemist4,Arcane4,O4,Witch4', // Rage Prophet
  'Arcane Lock':'Wards1',
  'Arcane Mark':'Summoner0,Witch0',
  'Arcane Sight':'Alchemist3,Inquisitor3,Witch3',
  'Astral Projection':'O9,Witch9',
  'Atonement':'Inquisitor5,O5,Purity5',
  'Augury':'Fate2,O2,Witch2',
  'Awaken':'O5', // Oracle Nature
  'Baleful Polymorph':'Summoner4,Witch5',
  'Bane':'Antipaladin1,Curse1,Inquisitor1,O1',
  'Banishment':'Inquisitor5,O6,Summoner5',
  'Barkskin':'Alchemist2,Decay2,Defense2,Growth2,O2,Summoner2', // Oracle Nature
  "Bear's Endurance":
    'Alchemist2,O2,Summoner2,Witch2', // Witch Endurance, Transformation
  'Beast Shape I':'Alchemist3,Fur3,Witch3', // Witch Transformation
  'Beast Shape II':'Alchemist4,Witch4', // Witch Transformation
  'Beast Shape III':'Alchemist5,Feather5,Fur5,Witch5', // Witch Transformation
  'Beast Shape IV':'Alchemist6,Witch7', // Witch Animals
  'Bestow Curse':'Antipaladin3,Curse3,O3,Witch3',
  'Binding':'Summoner6',
  'Black Tentacles':'Summoner3,Witch4',
  'Blade Barrier':'Blood6,Inquisitor6,O6,Tactics6',
  'Blasphemy':'Daemon7,"Demon Evil7","Devil Evil7",Inquisitor6,O7',
  'Bleed':'Inquisitor0,O0,Witch0',
  'Bless':'Family1,Inquisitor1,Leadership1,O1,Resolve1',
  'Bless Water':'Divine2,Inquisitor1,O1,Witch1', // Witch Water
  'Bless Weapon':'Heroism2',
  'Blight':'Seasons4,Witch5',
  'Blindness/Deafness':'Antipaladin2,Loss2,Night2,O3,Witch2',
  'Blink':'Witch3', // Witch Deception
  'Blur':'Alchemist2,Summoner2',
  'Break Enchantment':
    'Curse5,Fate5,Inquisitor5,O5,Restoration5,Revolution5,Witch5',
  'Breath Of Life':'O5',
  "Bull's Strength":
    'Alchemist2,Antipaladin2,Ferocity2,O2,Rage2,Resolve2,Summoner2,Witch2', // Witch Strength
  'Burning Hands':'Ash1,O1,Smoke1,Witch1', // Oracle Flame
  'Call Lightning':'Catastrophe3,Seasons3,Storms3',
  'Call Lightning Storm':'Storms5',
  'Calm Animals':'Feather1',
  'Calm Emotions':'Family2,Inquisitor2,O2',
  "Cat's Grace":'Alchemist2,Summoner2,Witch2', // Witch Agility
  'Cause Fear':'Antipaladin1,Daemon1,Inquisitor1,Murder1,O1,Undead1,Witch1',
  'Chain Lightning':'Cloud6,O6,Witch7', // Oracle Heavens
  'Chaos Hammer':'"Azata Chaos4","Demon Chaos4",Inquisitor4,O4,Protean4',
  'Charm Animal':'O1,Witch1', // Oracle Nature; Witch Animals
  'Charm Monster':'Love5,Lust5,Summoner3,Witch4',
  'Charm Person':'Love1,Lust1,Witch1',
  'Chill Touch':'Witch1',
  'Circle Of Death':'Inquisitor6,O6', // Oracle Bones
  'Clairaudience/Clairvoyance':'Witch3',
  'Clenched Fist':'Ferocity8,Resolve8',
  'Clone':'Witch8',
  'Cloudkill':'Witch5',
  'Cloak Of Chaos':'"Azata Chaos8","Demon Chaos8",O8,Protean8',
  'Color Spray':'O1', // Oracle Heavens
  'Command':
    'Antipaladin1,"Devil Evil1","Devil Law1",Inquisitor1,O1,Toil1,Witch1',
  'Command Plants':'Growth4',
  'Command Undead':'Inevitable3,Witch2', // Witch Plague
  'Commune':'Inquisitor5,O5',
  'Comprehend Languages':
    'Alchemist1,Inquisitor1,Language1,Memory1,O1,Thought1,Witch1',
  'Cone Of Cold':'Ice6,Oceans6,Witch6',
  'Confusion':'Deception4,Lust4,Thievery4,Witch4',
  'Consecrate':'Inquisitor2,O2',
  'Contact Other Plane':'Alchemist5,O5,Summoner4,Witch5', // Oracle Lore
  'Contagion':'Antipaladin3,Decay3,O3,Witch3', // Witch Plague
  'Continual Flame':'Day2,Inquisitor3,O3',
  'Control Plants':'Decay8,Growth8',
  'Control Undead':'O7,Witch7', // Oracle Bones; Witch Plague
  'Control Water':'Ice4,O4,Oceans4,Witch4', // Witch Water
  'Control Weather':'Catastrophe7,O7,Seasons7,Storms7,Witch7',
  'Control Winds':'Cloud5,O5,Seasons6,Wind5', // Oracle Wind
  'Create Food And Water':'Family3,O3',
  'Create Greater Undead':'Murder8,O8,Undead8,Witch8', // Witch Plague
  'Create Undead':'Murder6,O6,Undead6,Witch6', // Witch Plague
  'Create Water':'Inquisitor0,O0',
  'Creeping Doom':'O7,Summoner5', // Oracle Nature
  'Crushing Hand':'Ferocity9,Resolve9',
  'Crushing Despair':'Witch4',
  'Cure Critical Wounds':'Alchemist4,Inquisitor4,O4,Resurrection4,Witch5',
  'Cure Light Wounds':
    'Alchemist1,Inquisitor1,O1,Restoration1,Resurrection1,Witch1',
  'Cure Moderate Wounds':'Alchemist2,Inquisitor2,O2,Resurrection2,Witch2',
  'Cure Serious Wounds':
    'Alchemist3,Inquisitor3,O3,Restoration3,Resurrection3,Witch4',
  'Curse Water':'Antipaladin1,Inquisitor1,O1,Witch1', // Witch Water
  'Dancing Lights':'Witch0',
  'Darkness':'Antipaladin2,Inquisitor2,O2,Witch2', // Witch Shadow
  'Darkvision':'Alchemist2,Antipaladin2',
  'Daylight':'Day3,Inquisitor3,Light3,O3',
  'Daze':'Inquisitor0,Summoner0,Witch0',
  'Daze Monster':'Summoner1,Witch2',
  'Death Knell':'Antipaladin1,Inquisitor2,Murder2,O2,Witch2',
  'Death Ward':'Alchemist4,Inquisitor4,Murder4,O4,Souls4,Witch4',
  'Deathwatch':'Ancestors1,O1,Souls1',
  'Deep Slumber':'Witch3',
  'Deeper Darkness':'Antipaladin3,Inquisitor3,Loss3,Night3,O3,Witch3',// Witch Shadow
  'Delay Poison':'Alchemist2,Inquisitor2,O2,Witch2',
  'Demand':'Leadership8,Lust8,Martyr8,Witch8',
  'Desecrate':'Antipaladin2,Inquisitor2,O2',
  'Destruction':'Ancestors7,Murder7,O7,Souls7,Undead7,Witch8',
  'Detect Chaos':'Inquisitor1,O1',
  'Detect Evil':'Inquisitor1,O1',
  'Detect Good':'Inquisitor1,O1',
  'Detect Law':'Inquisitor1,O1',
  'Detect Magic':'Inquisitor0,O0,Summoner0,Witch0',
  'Detect Poison':'Antipaladin1,Inquisitor0,O0,Witch0',
  'Detect Secret Doors':'Alchemist1,Witch1',
  'Detect Scrying':'Inquisitor4,Witch4',
  'Detect Thoughts':'Alchemist2,Inquisitor2,Thought2,Summoner2,Witch2',
  'Detect Undead':'Alchemist1,Inquisitor1,O1,Witch1', // Witch Plague
  'Dictum':'"Archon Law7","Devil Law7",Inevitable7,Inquisitor6,O7',
  'Dimension Door':'Summoner3,Trade4,Witch4',
  'Dimensional Anchor':'Inquisitor3,O4,Summoner3,Wards4',
  'Dimensional Lock':'O8,Summoner6',
  'Discern Lies':'Alchemist4,Inquisitor4,Leadership4,Martyr4,O4,Witch4',
  'Discern Location':'O8,Summoner6,Witch8',
  'Disguise Self':'Alchemist1,Antipaladin1,Deception1,Inquisitor1,Thievery1',
  'Disintegrate':'Ash7,Rage7',
  'Dismissal':'Inquisitor4,O4,Summoner4',
  'Dispel Chaos':'"Archon Law5","Devil Law5",Inquisitor5,O5',
  'Dispel Evil':'Agathion5,"Archon Good5","Azata Good5",Inquisitor5,O5',
  'Dispel Good':
    'Antipaladin4,Daemon5,"Demon Evil5","Devil Evil5",Inquisitor5,O5',
  'Dispel Law':
    'Antipaladin4,"Azata Chaos5","Demon Chaos5",Inquisitor5,O5,Protean5',
  'Dispel Magic':'Antipaladin3,Arcane3,Divine3,Inquisitor3,O3,Summoner3,Witch3',
  'Displacement':'Alchemist3,Protean3,Summoner3',
  'Disrupt Undead':'Inquisitor0',
  'Disrupting Weapon':'Inquisitor5,O5',
  'Divination':'Inquisitor4,Memory4,O4,Thought4,Witch4',
  'Divine Favor':
    '"Archon Good1","Archon Law1",Inquisitor1,Martyr1,O1,Witch1', // Witch Strength
  'Divine Power':'Blood4,Inquisitor4,O4,Tactics4,Witch4', // Witch Strength
  'Dominate Animal':'Witch3', // Witch Animals
  'Dominate Monster':'Love9,Lust9,Summoner6,Witch9',
  'Dominate Person':'Witch5',
  'Doom':'Antipaladin1,"Demon Chaos1","Demon Evil1",Inquisitor1,O1',
  'Dream':'Alchemist5,O5,Witch5', // Witch Wisdom; Rage Prophet
  "Eagle's Splendor":'Alchemist2,Antipaladin2,O2,Summoner2',
  'Earthquake':'Catastrophe8,Caves8,O8,Rage8',
  'Elemental Body I':'Alchemist4',
  'Elemental Body II':'Alchemist5',
  'Elemental Body III':'Alchemist6,Witch6', // Witch Water
  'Elemental Body IV':
    'Caves7,Cloud7,Metal7,Oceans7,Smoke7,Wind7,Witch7', // Witch Water
  'Elemental Swarm':'Caves9,Metal9,Smoke9,Witch9',
  'Endure Elements':'Alchemist1,Day1,O1,Summoner1,Witch1', // Witch Endurance
  'Energy Drain':'Loss9,O9,Undead9,Witch9', // Witch Plague
  'Enervation':'Loss5,Undead4,Witch4',
  'Enlarge Person':
    'Alchemist1,Ferocity1,Growth1,O1,Summoner1,Witch1', // Oracle Battle
  'Entangle':'Decay1',
  'Enthrall':'Inquisitor2,Leadership2,Love2,O2,Revolution2,Witch2',
  'Entropic Shield':'O1',
  'Ethereal Jaunt':'O7,Summoner5,Thievery7,Witch7', // Witch Agility
  'Etherealness':'O9',
  'Expeditious Retreat':
    'Alchemist1,"Azata Chaos1","Azata Good1",Exploration1,Inquisitor1,Summoner1',
  'Explosive Runes':'Language4',
  'Eyebite':'Alchemist6,Curse6,Witch6',
  'Fabricate':'Construct5',
  'Faerie Fire':'Light1',
  'False Life':'Alchemist2,O2,Witch2', // Oracle Bones
  'False Vision':'Deception5,Thievery5',
  'Fear':'Antipaladin4,Inquisitor4,O4,Witch4', // Oracle Bones
  'Feather Fall':'Feather2,Summoner1',
  'Feeblemind':'Witch5',
  'Find The Path':'Exploration6,Inquisitor6,O6,Thought6,Trade6,Witch6',
  'Find Traps':'Inquisitor2,O2,Witch2',
  'Fire Seeds':'Ash6,Day6,Light6,O6,Smoke6', // Oracle Flame
  'Fire Shield':'Alchemist4,Ash5,Day4,Light4,Smoke5,Summoner3',
  'Fire Storm':'O8,Witch8', // Witch Elements
  'Fireball':'Ash3,O3,Witch3', // Oracle Flame; Witch Elements
  'Flame Strike':'Day5,Inquisitor5,Light5,O5,Witch5', // Witch Elements
  'Flaming Sphere':'Witch2', // Witch Elements
  'Floating Disk':'Trade1',
  'Flesh To Stone':'Witch6',
  'Fly':
    'Alchemist3,"Azata Chaos3","Azata Good3",Exploration3,Feather3,Summoner3,Trade3,Witch3',
  'Fog Cloud':'Ice2,O2,Seasons2,Storms2,Witch2', // Oracle Battle
  'Forbiddance':'Inquisitor6,O6',
  'Foresight':'Memory9,Thought9,Witch9',
  'Form Of The Dragon I':'Alchemist6,Witch6', // Witch Transformation
  'Form Of The Dragon II':'Witch7', // Witch Transformation
  'Form Of The Dragon III':'Witch8', // Witch Transformation
  "Fox's Cunning":'Alchemist2,Summoner2',
  'Freedom':'Freedom9,Revolution9',
  'Freedom Of Movement':
    'Alchemist4,Curse4,Fate4,Freedom4,Inquisitor4,O4,Revolution4,Witch4', // Witch Agility
  'Freezing Sphere':'Ice7,Witch6', // Witch Elements
  'Gaseous Form':'Alchemist3,Cloud3,Wind3',
  'Gate':'Heroism9,Honor9,O9,Trade9',
  'Geas/Quest':'Ancestors6,Honor6,Inquisitor5,Love6,Lust6,O6,Witch6',
  'Gentle Repose':'Ancestors2,O2,Souls2,Witch2',
  'Ghost Sound':'O0', // Oracle Haunted
  'Ghoul Touch':'Undead2',
  'Giant Form I':'Alchemist6,Witch7', // Witch Strength
  'Giant Form II':'Witch8', // Witch Strength
  'Giant Vermin':'O4,Witch5', // Witch Plague
  'Glitterdust':'Summoner2,Witch2',
  'Globe Of Invulnerability':'Witch6', // Witch Wisdom
  'Glyph Of Warding':'Home3,Inquisitor3,O3,Wards3,Witch3',
  'Goodberry':'Seasons1',
  'Grasping Hand':'Ferocity7,Resolve7',
  'Grease':'Summoner1',
  'Greater Arcane Sight':'Witch7',
  'Greater Command':'Inevitable5,Inquisitor5,Leadership5,Martyr5,O5,Tactics5',
  'Greater Dispel Magic':'Freedom6,Inquisitor6,O6,Summoner5,Witch6',
  'Greater Glyph Of Warding':'Inquisitor6,Language6,O6',
  'Greater Heroism':'Heroism6,Summoner5,Witch6',
  'Greater Invisibility':'Alchemist4,Antipaladin4,Inquisitor4,Summoner3',
  'Greater Magic Fang':'Summoner3',
  'Greater Magic Weapon':'Antipaladin3,Inquisitor3,O4,Witch3', // Witch Strength
  'Greater Planar Ally':'O8,Tactics8',
  'Greater Planar Binding':'Summoner6',
  'Greater Prying Eyes':'Witch8',
  'Greater Restoration':'O7,Witch7', // Witch Endurance
  'Greater Scrying':'O7,Witch7',
  'Greater Shadow Conjuration':'Witch7', // Witch Shadow
  'Greater Shadow Evocation':'Loss8,Night8,Witch8', // Witch Shadow
  'Greater Spell Immunity':'O8',
  'Greater Teleport':'Exploration7,Summoner5,Trade7,Witch7',
  'Guards And Wards':'Home7,Wards6,Witch6',
  'Guidance':'Inquisitor0,O0,Summoner0,Witch0',
  'Gust Of Wind':'Catastrophe2,O2', // Oracle Wind
  'Hallow':'Inquisitor5,O5',
  'Hallucinatory Terrain':'Witch4', // Witch Trickery
  'Halt Undead':'Inquisitor3',
  'Harm':'Catastrophe6,Decay6,Inquisitor6,O6,Witch7',
  'Haste':'Alchemist3,Summoner2,Witch3', // Witch Agility
  'Heal':'Alchemist6,Inquisitor6,O6,Restoration6,Resurrection6,Witch7',
  'Heat Metal':'Light2,Metal2',
  'Helping Hand':'O3',
  "Heroes' Feast":'Family6,Home6,Inquisitor6,O6,Resolve6',
  'Heroism':'Alchemist3,Heroism3,Inquisitor3,Love4,Summoner3,Witch3',
  'Hide From Undead':'Inquisitor1,O1',
  'Hold Animal':'Fur2',
  'Hold Monster':'Inquisitor4,Summoner4,Witch5',
  'Hold Person':'Antipaladin2,Inquisitor2,O2,Witch2',
  'Holy Aura':'Agathion8,"Archon Good8","Azata Good8",Heroism8,Honor8,O8',
  'Holy Smite':'Agathion4,"Archon Good4","Azata Good4",Heroism4,Honor4,Inquisitor4,O4',
  'Holy Sword':'Heroism7,Honor7',
  'Holy Word':'Agathion7,"Archon Good7","Azata Good7",Inquisitor6,O7',
  'Horrid Wilting':'Ice8,O8,Oceans8,Witch8', // Oracle Bones
  'Hypnotic Pattern':'O2', // Oracle Heavens
  'Hypnotism':'Witch1',
  'Ice Storm':'Ice5,Oceans5,Seasons5,Witch4',
  'Identify':'Alchemist1,Divine1,O1,Summoner1,Witch1', // Oracle Lore
  'Imbue With Spell Ability':'Divine4,Family4,Home4,O4',
  'Implosion':'Catastrophe9,O9,Rage9',
  'Incendiary Cloud':'Ash8,O8,Smoke8,Summoner6', // Oracle Flame
  'Inflict Critical Wounds':'Catastrophe4,Inquisitor4,O4,Rage4,Witch5',
  'Inflict Light Wounds':'Antipaladin1,Inquisitor1,O1,Witch1',
  'Inflict Moderate Wounds':'Antipaladin3,Inquisitor2,O2,Witch2',
  'Inflict Serious Wounds':'Antipaladin4,Inquisitor3,O3,Witch4',
  'Insanity':'Insanity7,Love7,Lust7,Nightmare7,Witch7',
  'Insect Plague':'O5,Summoner4',
  'Instant Summons':'Language7,Wards7,Witch7',
  'Invisibility':
    'Alchemist2,Antipaladin2,Inquisitor2,Summoner2,Thievery2,Witch2', // Witch Deception
  'Invisibility Purge':'Inquisitor3,O3',
  'Iron Body':'Metal8,Witch8', // Witch Endurance
  'Irresistible Dance':'Witch8',
  'Jump':'Alchemist1,Summoner1,Witch1', // Witch Agility, Transformation
  'Keen Edge':'Inquisitor3,Murder3',
  'Knock':'Inquisitor2',
  'Legend Lore':'Inquisitor6,Memory7,O4,Thought7,Witch6', // Oracle Lore
  'Lesser Confusion':'Insanity1,Nightmare1,Protean1',
  'Lesser Geas':'Inquisitor4,Witch4',
  'Lesser Globe Of Invulnerability':'Witch4', // Witch Wisdom
  'Lesser Planar Ally':'O4',
  'Lesser Planar Binding':'Summoner4,Wards5',
  'Lesser Restoration':'Alchemist2,Inquisitor2,O2',
  'Levitate':'Alchemist2,O2,Summoner2,Witch2', // Oracle Haunted
  'Light':'Inquisitor0,O0,Summoner0,Witch0',
  'Lightning Bolt':'Witch3',
  'Limited Wish':'Construct7',
  'Locate Creature':'Exploration4,Summoner3,Witch4',
  'Locate Object':'Exploration2,Inquisitor3,O3,Thievery3,Trade2,Witch3',
  'Mage Armor':'Summoner1,Witch1',
  'Mage Hand':'O0,Summoner0', // Oracle Haunted
  "Mage's Disjunction":'Arcane9,Witch9', // Witch Wisdom
  "Mage's Faithful Hound":'Summoner4',
  'Magic Aura':'Arcane1',
  'Magic Circle Against Chaos':'Inquisitor3,O3,Summoner3',
  'Magic Circle Against Evil':'Inquisitor3,O3,Summoner3',
  'Magic Circle Against Good':'Antipaladin3,Inquisitor3,O3,Summoner3',
  'Magic Circle Against Law':'Antipaladin3,Inquisitor3,O3,Summoner3',
  'Magic Fang':'Fur1,Summoner1',
  'Magic Jar':'Alchemist5,Summoner4,Witch5',
  'Magic Mouth':'Arcane2,Summoner1',
  'Magic Stone':'Caves1,Metal1,O1',
  'Magic Vestment':
    'Inquisitor3,Martyr3,O3,Resolve3,Tactics3,Witch3', // Witch Wisdom
  'Magic Weapon':'Antipaladin1,Blood1,Inquisitor1,O1,Tactics1',
  'Major Image':'Witch3', // Witch Trickery
  'Major Creation':'Construct6,Summoner4,Toil6,Witch5',
  'Make Whole':'O2',
  'Mark Of Justice':'Inquisitor5,O5,Witch5',
  "Mass Bear's Endurance":'O6,Summoner4,Witch6', // Witch Endurance
  "Mass Bull's Strength":'Ferocity6,O6,Summoner4,Witch6', // Witch Strength
  "Mass Cat's Grace":'Summoner4,Witch6', // Witch Agility
  'Mass Charm Monster':'Summoner6,Witch8',
  'Mass Cure Critical Wounds':
    'Family8,Home8,O8,Restoration8,Resurrection8,Witch9',
  'Mass Cure Light Wounds':'Inquisitor5,O5,Witch6',
  'Mass Cure Moderate Wounds':'Inquisitor6,O6,Witch7',
  'Mass Cure Serious Wounds':'O7,Witch8',
  "Mass Eagle's Splendor":'O6,Summoner4',
  "Mass Fox's Cunning":'Summoner4',
  'Mass Enlarge Person':'Summoner3',
  'Mass Heal':'O9,Restoration9',
  'Mass Hold Person':'Witch7',
  'Mass Hold Monster':'Witch9',
  'Mass Inflict Critical Wounds':'O8,Witch9',
  'Mass Inflict Light Wounds':'Inquisitor5,O5,Witch6',
  'Mass Inflict Moderate Wounds':'Inquisitor6,O6,Witch7',
  'Mass Inflict Serious Wounds':'Blood7,O7,Witch8',
  'Mass Invisibility':
    'Deception8,Summoner5,Thievery8,Witch7', // Witch Deception
  "Mass Owl's Wisdom":'O6,Summoner4',
  'Mass Reduce Person':'Summoner3',
  'Mass Suggestion':'Witch6',
  'Maze':'Summoner6,Witch8',
  'Meld Into Stone':'O3',
  'Mending':'O0,Summoner0,Witch0',
  'Message':'Witch0',
  'Meteor Swarm':'O9,Witch9', // Oracle Heavens; Witch Elements
  'Mind Blank':'Defense8,Freedom8,Purity8,Revolution8,Thought8,Witch8',
  'Mind Fog':'Witch5',
  'Minor Creation':'Construct4,Summoner3,Toil4,Witch4',
  'Minor Image':'O2', // Oracle Haunted
  'Miracle':'Curse9,Divine9,Family9,Fate9,Home9,O9,Witch9', // Witch Endurance
  'Mirage Arcana':'Witch5', // Witch Trickery
  'Mirror Image':'Deception2,Witch2', // Witch Trickery
  'Misdirection':'Summoner2',
  'Mislead':'Alchemist6,Deception6,Fate6,Thievery6,Witch6', // Witch Trickery
  'Modify Memory':'Loss6,Memory6',
  'Moment Of Prescience':'Curse8,Fate8,Memory8,O8,Witch8', // Oracle Lore
  'Mount':'Summoner1,Witch1',
  'Neutralize Poison':'Alchemist4,Inquisitor4,O4,Restoration4,Witch4',
  'Nightmare':'Alchemist5,Insanity5,Night6,Nightmare5',
  'Nondetection':'Alchemist3,Antipaladin3,Deception3,Inquisitor3,Summoner3',
  'Obscure Object':'Inquisitor3,O3',
  'Obscuring Mist':'Cloud1,Ice1,Loss1,O1,Oceans1,Storms1,Witch1',
  'Open/Close':'Summoner0',
  "Order's Wrath":'"Archon Law4","Devil Law4",Inevitable4,Inquisitor4,O4',
  'Overland Flight':'Alchemist5,O5,Summoner4,Trade5,Witch5', // Oracle Heavens
  "Owl's Wisdom":'Alchemist2,O2,Summoner2,Witch2', // Witch Wisdom
  'Passwall':'Witch5', // Witch Deception
  'Phantasmal Killer':'Nightmare4,Witch4',
  'Phantom Steed':'Summoner2',
  'Phase Door':'Exploration8,Trade8,Witch7',
  'Planar Ally':'Agathion6,"Archon Good6","Archon Law6","Azata Chaos6","Azata Good6",O6',
  'Planar Binding':
    'Daemon6,"Demon Chaos6","Demon Evil6","Devil Evil6","Devil Law6",Inevitable6,Protean6,Summoner5',
  'Plane Shift':'Freedom5,O5,Summoner5,Witch7',
  'Plant Growth':'Growth3',
  'Plant Shape I':'Alchemist5',
  'Plant Shape II':'Alchemist6',
  'Poison':'Antipaladin4,Decay4,O4,Witch4',
  'Polar Ray':'Ice9',
  'Polymorph':'Alchemist5,Witch5', // Witch Agility
  'Polymorph Any Object':'Construct8',
  'Power Word Blind':'Loss7,Night7,Tactics7,Witch7',
  'Power Word Kill':'Blood9,Tactics9,Witch9',
  'Power Word Stun':'Blood8,Witch8',
  'Prayer':'"Archon Good3","Archon Law3",Inquisitor3,Leadership3,O3',
  'Prismatic Sphere':'Construct9,Day9,Defense9,Light9,Purity9,Toil9',
  'Prismatic Spray':'O7', // Oracle Heavens
  'Produce Flame':'Ash2',
  'Programmed Image':'Witch6', // Witch Deception
  'Project Image':'Deception7',
  'Protection From Arrows':'Alchemist2,Summoner2',
  'Protection From Chaos':'Inevitable1,Inquisitor1,O1,Purity1,Summoner1',
  'Protection From Energy':
    'Alchemist3,Defense3,Inquisitor3,O3,Summoner3,Witch3', // Witch Endurance
  'Protection From Evil':'Inquisitor1,O1,Purity1,Summoner1',
  'Protection From Good':'Antipaladin1,Inquisitor1,O1,Purity1,Summoner1',
  'Protection From Law':'Antipaladin1,Inquisitor1,O1,Purity1,Summoner1',
  'Protection From Spells':'Arcane8,Divine8,Summoner6,Witch8', // Witch Wisdom
  'Prying Eyes':'Witch5',
  'Purify Food And Drink':'O0',
  'Pyrotechnics':'Smoke2',
  'Rage':
    'Alchemist3,"Demon Chaos3","Demon Evil3",Ferocity3,Insanity3,Nightmare3,Rage3,Summoner3,Witch3',
  'Rainbow Pattern':'O4', // Oracle Heavens
  'Raise Dead':'Resurrection5,O5,Witch6',
  'Ray Of Enfeeblement':'Witch1',
  'Ray Of Exhaustion':'Witch3',
  'Read Magic':'Antipaladin1,Inquisitor0,O0,Summoner0,Witch0',
  'Reduce Person':'Alchemist1,Summoner1,Witch1',
  'Refuge':'Family7,Freedom7,O7,Revolution7,Witch9',
  'Regenerate':'O7,Restoration7,Witch7',
  'Reincarnate':'Witch5',
  'Remove Blindness/Deafness':'Alchemist3,O3,Purity3,Witch3',
  'Remove Curse':'Alchemist3,Freedom3,Inquisitor3,O3,Revolution3,Witch3',
  'Remove Disease':'Alchemist3,Inquisitor3,O3,Restoration2,Witch3',
  'Remove Fear':'Inquisitor1,O1,Revolution1',
  'Remove Paralysis':'Freedom2,Inquisitor2,O2',
  'Repel Metal Or Stone':'O8', // Oracle Stone
  'Repel Vermin':'O4',
  'Repel Wood':'Growth6',
  'Repulsion':'Inquisitor6,Leadership7,Martyr7,O7,Purity7,Summoner5',
  'Resist Energy':'Alchemist2,Inquisitor2,O2,Summoner2',
  'Resistance':'Inquisitor0,O0,Summoner0,Witch0',
  'Restoration':'Alchemist4,Inquisitor4,O4',
  'Resurrection':'Divine7,O7,Resurrection7,Witch8',
  'Reverse Gravity':'O7,Witch7', // Oracle Haunted, Witch Trickery
  'Righteous Might':
    'Ferocity5,Growth5,Heroism5,Honor5,Inquisitor5,O5,Resolve5,Witch5', // Witch Strength
  'Sanctuary':'Freedom1,Inquisitor1,O1',
  'Scare':'Antipaladin2,Witch2',
  'Scintillating Pattern':'Insanity8,Nightmare8,Witch8', // Witch Deception
  'Screen':'Witch8', // Witch Trickery
  'Scrying':'O5,Witch4',
  'Searing Light':'Honor3,Inquisitor3,O3',
  'Secret Chest':'Witch5',
  'Secret Page':'Wards2',
  'Secure Shelter':'Witch4',
  'See Invisibility':
    'Alchemist2,Inquisitor2,O2,Summoner2,Witch2', // Rage Prophet
  'Sending':'Alchemist5,Inquisitor4,O4,Summoner4',
  'Sepia Snake Sigil':'Witch3',
  'Sequester':'Summoner5',
  'Shades':'Night9,Witch9', // Witch Shadow
  'Shadow Conjuration':'Loss4,Night4,Witch4', // Witch Shadow
  'Shadow Evocation':'Witch5', // Witch Shadow
  'Shadow Walk':'Alchemist6,O6,Witch6', // Witch Shadow; Rage Prophet
  'Shambler':'Decay9,Growth9',
  'Shapechange':
    'Feather9,Fur9,Witch9', // Witch Agility, Strength, Transformation
  'Shatter':'O2',
  'Shield':'Alchemist1,Defense1,Summoner1',
  'Shield Of Faith':
    'Agathion1,Heroism1,Honor1,Inquisitor1,O1,Witch1', // Witch Wisdom
  'Shield Of Law':'"Archon Law8","Devil Law8",Inevitable8,O8',
  'Shield Other':'Home2,Inquisitor2,Martyr2,O2,Purity2',
  'Shocking Grasp':'Witch1', // Witch Elements
  'Shout':'Catastrophe5,Rage5',
  'Silence':'Antipaladin2,Inquisitor2,O2',
  'Silent Image':'Witch1', // Witch Shadow
  'Simulacrum':'Summoner5',
  'Slay Living':'Ancestors5,Antipaladin4,O5,Souls5,Undead5,Witch6',
  'Sleep':'Night1,Witch1',
  'Sleet Storm':'Storms4,Witch3',
  'Slow':'Summoner2',
  'Solid Fog':'Cloud4,Witch4',
  'Soul Bind':'O9,Witch9',
  'Sound Burst':'O2',
  'Speak With Animals':'Witch2', // Witch Animals
  'Speak With Dead':'Ancestors3,Inquisitor3,Memory3,O3,Witch3',
  'Speak With Plants':'O3', // Oracle Nature
  'Spectral Hand':'O2,Witch2', // Rage Prophet
  'Spell Immunity':
    'Alchemist4,Defense4,Ferocity4,Inquisitor4,O4,Purity4,Resolve4,Witch4', // Witch Endurance
  'Spell Resistance':
    'Alchemist5,Arcane5,Defense5,Inquisitor5,O5,Witch5',// Witch Endurance
  'Spell Turning':'Arcane7,Curse7,Fate7,Summoner5,Witch7', // Witch Wisdom
  'Spike Stones':'Caves4,Metal4',
  'Spider Climb':'Alchemist2,Summoner2',
  'Spiritual Weapon':'Blood2,Inquisitor2,O2',
  'Stabilize':'Inquisitor0,O0,Witch0',
  'Statue':'Alchemist6,O7,Toil8', // Oracle Stone
  'Status':'O2,Witch2',
  'Stinking Cloud':'Smoke3,Witch3',
  'Stone Shape':'Construct3,Metal3,O3,Toil3',
  'Stone Tell':'O6', // Oracle Nature
  'Stone To Flesh':'Witch6',
  'Stoneskin':'Alchemist4,Inquisitor4,O5,Summoner3', // Oracle Stone
  'Storm Of Vengeance':
    'Cloud9,Leadership9,Martyr9,O9,Seasons9,Storms9,Witch9',
  'Suggestion':'"Devil Evil3","Devil Law3",Love3,Lust3,Witch3',
  'Summon Monster I':'Antipaladin1,O1,Summoner1,Witch1',
  'Summon Monster II':'Antipaladin2,O2,Summoner2,Witch2',
  'Summon Monster III':'Antipaladin3,O3,Witch3',
  'Summon Monster IV':'Antipaladin4,O4,Summoner3,Witch4',
  'Summon Monster IX':
    'Agathion9,"Archon Good9","Archon Law9","Azata Chaos9","Azata Good9",Daemon9,"Demon Chaos9","Demon Evil9","Devil Evil9","Devil Law9",Inevitable9,O9,Protean9,Witch9',
  'Summon Monster V':'Night5,O5,Summoner4,Witch5',
  'Summon Monster VI':'O6,Witch6',
  'Summon Monster VII':'O7,Summoner5,Witch7',
  'Summon Monster VIII':'O8,Summoner6,Witch8',
  "Summon Nature's Ally I":'O1', // Oracle Nature
  "Summon Nature's Ally II":'O2', // Oracle Nature
  "Summon Nature's Ally III":'O3', // Oracle Nature
  "Summon Nature's Ally IV":
    'Feather4,Fur4,O4,Witch4', // Oracle Nature; Witch Animals
  "Summon Nature's Ally V":'O5', // Oracle Nature
  "Summon Nature's Ally VI":'O6', // Oracle Nature
  "Summon Nature's Ally VII":'O7', // Oracle Nature
  "Summon Nature's Ally VIII":'Feather8,Fur8,O8', // Oracle Nature
  "Summon Nature's Ally IX":'O9,Witch9', // Oracle Nature; Witch Animals
  'Summon Swarm':'Summoner2',
  'Sunbeam':'Day7,Light7',
  'Sunburst':'Day8,Light8,O8,Seasons8', // Oracle Heavens
  'Symbol Of Death':'Language8,O8,Wards8,Witch8',
  'Symbol Of Fear':'O6,Witch6',
  'Symbol Of Insanity':'O8,Witch8',
  'Symbol Of Pain':'O5,Witch5',
  'Symbol Of Persuasion':'O6,Revolution6,Witch6',
  'Symbol Of Sleep':'O5,Witch5',
  'Symbol Of Stunning':'O7,Witch7',
  'Symbol Of Weakness':'O7,Witch7',
  'Sympathy':'Summoner6,Witch8',
  'Telekinesis':'O5', // Oracle Haunted
  'Telepathic Bond':'Family5,Home5,Inquisitor5,Language5,Thought5,Witch5',
  'Teleport':'Exploration5,Summoner4,Witch5',
  'Teleport Object':'Witch7',
  'Teleportation Circle':'Language9,Summoner6,Wards9,Witch9',
  'Time Stop':
    'Deception9,O9,Thievery9,Witch9', // Oracle Lore; Witch Deception, Trickery
  'Tongues':'Alchemist3,Agathion3,Inquisitor2,Language3,O4,Witch3',
  'Touch Of Fatigue':'Witch0',
  'Touch Of Idiocy':'Insanity2,Lust2,Nightmare2,Witch2',
  'Transformation':'Alchemist6,Witch6',
  'Trap The Soul':'Souls9,Witch8',
  'True Resurrection':'O9,Resurrection9',
  'True Seeing':'Alchemist6,Inquisitor5,Memory5,O5,Summoner5,Witch6',
  'True Strike':'Alchemist1,Catastrophe1,Fate1,Inquisitor1,Rage1',
  'Undeath To Death':'Inquisitor6,O6',
  'Undetectable Alignment':'Alchemist2,Antipaladin2,Inquisitor2,O2',
  'Unhallow':'Inquisitor5,O5',
  'Unholy Aura':'Daemon8,"Demon Evil8","Devil Evil8",O8',
  'Unholy Blight':'Daemon4,"Demon Evil4","Devil Evil4",Inquisitor4,O4',
  'Unseen Servant':'O1,Summoner1,Witch1', // Rage Prophet
  'Vampiric Touch':'Antipaladin3,Blood3,Daemon3,Witch3',
  'Ventriloquism':'Summoner1,Witch1', // Witch Deception
  'Virtue':'Inquisitor0,O0',
  'Vision':'O7,Witch7', // Oracle Lore; Rage Prophet
  'Wail Of The Banshee':'Ancestors9,O9,Witch9', // Oracle Bones
  'Wall Of Fire':'Ash4,O4,Smoke4,Summoner3', // Oracle Battle, Flame
  'Wall Of Ice':'Summoner3,O4,Witch4', // Oracle Waves; Witch Elements
  'Wall Of Iron':'Metal6,Summoner5',
  'Wall Of Stone':'Caves5,Metal5,O5,Summoner4',
  'Wall Of Thorns':'Blood5,Decay5',
  'Water Breathing':'Alchemist3,Ice3,O3,Summoner3,Witch3', // Witch Water
  'Water Walk':'O3,Oceans3,Witch3',
  'Waves Of Exhaustion':'Ancestors8,Souls8,Toil7,Witch7',
  'Waves Of Fatigue':'Toil5,Witch5',
  'Web':'Witch2',
  'Weird':'Insanity9,Nightmare9',
  'Whirlwind':'Cloud8,O8,Storms8,Wind8', // Oracle Wind
  'Whispering Wind':'Inquisitor2,O2,Wind1', // Rage Prophet
  'Wind Walk':'Alchemist6,O6,Wind6',
  'Wind Wall':'Cloud2,O3,Summoner2,Wind2',
  'Wood Shape':'Construct2,Toil2',
  'Word Of Chaos':'"Azata Chaos7","Demon Chaos7",Inquisitor6,O7,Protean7',
  'Word Of Recall':'O6',
  'Zone Of Truth':'Honor2,Inquisitor2,O2,Witch2'
};
PFAPG.TRAITS = {
  // Already declared in Pathfinder.js
};
PFAPG.WEAPONS = {
  'Bardiche':'Level=Martial Category=Two-Handed Damage=d10 Threat=19',
  'Battle Aspergillum':'Level=Simple Category=Light Damage=d6',
  'Bayonet':'Level=Simple Category=Two-Handed Damage=d6',
  'Bec De Corbin':'Level=Martial Category=Two-Handed Damage=d10 Crit=3',
  'Bill':'Level=Martial Category=Two-Handed Damage=d8 Crit=3',
  'Boar Spear':'Level=Simple Category=Two-Handed Damage=d8',
  'Boomerang':'Level=Exotic Category=Ranged Damage=d6 Range=30',
  'Brass Knuckles':'Level=Unarmed Category=Unarmed Damage=d3',
  'Cestus':'Level=Simple Category=Light Damage=d4 Threat=19',
  'Chain Spear':'Level=Exotic Category=Two-Handed Damage=d6/d6',
  'Chakram':'Level=Martial Category=Ranged Damage=d8 Range=30',
  'Double Crossbow':'Level=Exotic Category=Ranged Damage=d8 Threat=19 Range=80',
  'Falcata':'Level=Exotic Category=One-Handed Damage=d8 Threat=19 Crit=3',
  'Glaive-Guisarme':'Level=Martial Category=Two-Handed Damage=d10 Crit=3',
  'Khopesh':'Level=Exotic Category=One-Handed Damage=d8 Threat=19',
  'Lucerne Hammer':'Level=Martial Category=Two-Handed Damage=d12',
  'Mancatcher':'Level=Exotic Category=Two-Handed Damage=d2',
  'Pilum':'Level=Martial Category=Ranged Damage=d8 Range=20',
  'Sword Cane':'Level=Martial Category=One-Handed Damage=d6',
  'Swordbreaker Dagger':'Level=Exotic Category=Light Damage=d4',
  'Temple Sword':'Level=Exotic Category=One-Handed Damage=d8 Threat=19',
  'Wooden Stake':'Level=Simple Category=Light Damage=d4 Range=10'
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
    'SpellAbility=Intelligence ' +
    'SpellSlots=' +
      'Alchemist1:1=1;2=2;3=3;5=4;9=5,' +
      'Alchemist2:4=1;5=2;6=3;8=4;12=5,' +
      'Alchemist3:7=1;8=2;9=3;11=4;15=5,' +
      'Alchemist4:10=1;11=2;12=3;14=4;18=5,' +
      'Alchemist5:13=1;14=2;15=3;17=4;19=5,' +
      'Alchemist6:16=1;17=2;18=3;19=4;20=5 ' +
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
      '"cavalierFeatures.Order Of The Cockatrice ? 2:Braggart",' +
      '"cavalierFeatures.Order Of The Cockatrice ? 8:Steal Glory",' +
      '"cavalierFeatures.Order Of The Cockatrice ? 15:Moment Of Triumph",' +
      '"cavalierFeatures.Order Of The Dragon ? 2:Aid Allies (Cavalier)",' +
      '"cavalierFeatures.Order Of The Dragon ? 8:Strategy",' +
      '"cavalierFeatures.Order Of The Dragon ? 15:Act As One",' +
      '"cavalierFeatures.Order Of The Lion ? 2:Lion\'s Call",' +
      '"cavalierFeatures.Order Of The Lion ? 8:For The King",' +
      '"cavalierFeatures.Order Of The Lion ? 15:Shield Of The Liege",' +
      '"cavalierFeatures.Order Of The Shield ? 2:Resolute",' +
      '"cavalierFeatures.Order Of The Shield ? 8:Stem The Tide",' +
      '"cavalierFeatures.Order Of The Shield ? 15:Protect The Meek",' +
      '"cavalierFeatures.Order Of The Star ? 2:Calling",' +
      '"cavalierFeatures.Order Of The Star ? 8:For The Faith",' +
      '"cavalierFeatures.Order Of The Star ? 15:Retribution",' +
      '"cavalierFeatures.Order Of The Sword ? 2:By My Honor",' +
      '"cavalierFeatures.Order Of The Sword ? 8:Mounted Mastery",' +
      '"cavalierFeatures.Order Of The Sword ? 15:Knight\'s Challenge" ' +
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
      '"3:Solo Tactics","3:Teamwork Feat (Inquisitor)",5:Bane,' +
      '"5:Discern Lies","8:Second Judgment",11:Stalwart,"12:Greater Bane",' +
      '"14:Exploit Weakness","16:Third Judgment",17:Slayer,"20:True Judgment",'+
      '"' + QuilvynUtils.getAttrValueArray(Pathfinder.CLASSES.Cleric, 'Features').filter(x => x.includes('clericDomainFeatures')).map(x => x.replace(/clericDomainFeatures.(\w*)/, 'inquisitorFeatures.$1 Domain')).join('","') + '" ' +
    'Selectables=' +
      '"' + QuilvynUtils.getAttrValueArray(Pathfinder.CLASSES.Cleric, 'Selectables').filter(x => x.includes('Domain')).join('","') + '" ' +
    'CasterLevelDivine=levels.Inquisitor ' +
    'SpellAbility=Wisdom ' +
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
      '1:Mystery,"1:Oracle\'s Curse",1:Orisons,1:Revelation,' +
      '"oracleFeatures.Battle Mystery ? 20:Final Revelation (Battle Mystery)",'+
      '"oracleFeatures.Bones Mystery ? 20:Final Revelation (Bones Mystery)",' +
      '"oracleFeatures.Flame Mystery ? 20:Final Revelation (Flame Mystery)",' +
      '"oracleFeatures.Heavens Mystery ? 20:Final Revelation (Heavens Mystery)",' +
      '"oracleFeatures.Life Mystery ? 20:Final Revelation (Life Mystery)",' +
      '"oracleFeatures.Lore Mystery ? 20:Final Revelation (Lore Mystery)",' +
      '"oracleFeatures.Nature Mystery ? 20:Final Revelation (Nature Mystery)",' +
      '"oracleFeatures.Stone Mystery ? 20:Final Revelation (Stone Mystery)",' +
      '"oracleFeatures.Waves Mystery ? 20:Final Revelation (Waves Mystery)",' +
      '"oracleFeatures.Wind Mystery ? 20:Final Revelation (Wind Mystery)" ' +
    'Selectables=' +
      '"1:Battle Mystery:Mystery","1:Bones Mystery:Mystery",' +
      '"1:Flame Mystery:Mystery","1:Heavens Mystery:Mystery",' +
      '"1:Life Mystery:Mystery","1:Lore Mystery:Mystery",' +
      '"1:Nature Mystery:Mystery","1:Stone Mystery:Mystery",' +
      '"1:Waves Mystery:Mystery","1:Wind Mystery:Mystery",' +
      '"1:Clouded Vision:Curse","1:Deaf:Curse","1:Haunted:Curse",' +
      '"1:Lame:Curse","1:Tongues:Curse","1:Wasting:Curse",' +
      '"oracleFeatures.Battle Mystery ? 1:Battlecry:Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 1:Battlefield Clarity:Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 11:Iron Skin:Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 1:Maneuver Mastery:Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 1:Resiliency (Oracle):Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 1:Skill At Arms:Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 1:Surprising Charge:Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 1:War Sight:Battle Revelation",' +
      '"oracleFeatures.Battle Mystery ? 1:Weapon Mastery (Oracle):Battle Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Armor Of Bones:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Bleeding Wounds:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Death\'s Touch:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Near Death:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Raise The Dead:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Resist Life:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 7:Soul Siphon:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 11:Spirit Walk:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Undead Servitude:Bones Revelation",' +
      '"oracleFeatures.Bones Mystery ? 1:Voice Of The Grave:Bones Revelation",'+
      '"oracleFeatures.Flame Mystery ? 1:Burning Magic:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 1:Cinder Dance:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 1:Fire Breath:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 11:Firestorm:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 7:Form Of Flame:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 1:Gaze Of Flames:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 1:Heat Aura:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 1:Molten Skin:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 1:Touch Of Flame:Flame Revelation",' +
      '"oracleFeatures.Flame Mystery ? 7:Wings Of Fire:Flame Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Awesome Display:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Coat Of Many Stars:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 11:Dweller In Darkness:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Guiding Star:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Interstellar Void:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Lure Of The Heavens:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Mantle Of Moonlight:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Moonlight Bridge:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 1:Spray Of Shooting Stars:Heavens Revelation",' +
      '"oracleFeatures.Heavens Mystery ? 7:Star Chart:Heavens Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Channel:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Delay Affliction:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Energy Body:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Enhanced Cures:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Healing Hands:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Life Link:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 11:Lifesense:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Safe Curing:Life Revelation",' +
      '"oracleFeatures.Life Mystery ? 1:Spirit Boost:Life Revelation",' +
      '"oracleFeatures.Lore Mystery ? 11:Arcane Archivist (Oracle):Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 1:Automatic Writing:Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 1:Brain Drain:Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 1:Focused Trance:Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 1:Lore Keeper (Oracle):Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 7:Mental Acuity:Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 1:Sidestep Secret:Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 11:Spontaneous Symbology:Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 1:Think On It:Lore Revelation",' +
      '"oracleFeatures.Lore Mystery ? 1:Whirlwind Lesson:Lore Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Bonded Mount:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Erosion Touch:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Friend To The Animals:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 7:Life Leach:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Natural Divination:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Nature\'s Whispers:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Speak With Animals (Oracle):Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Spirit Of Nature:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Transcendental Bond:Nature Revelation",' +
      '"oracleFeatures.Nature Mystery ? 1:Undo Artifice:Nature Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Acid Skin:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Clobbering Strike:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Crystal Sight:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 7:Earth Glide:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Mighty Pebble:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Rock Throwing:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Shard Explosion:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 7:Steelbreaker Skin:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Stone Stability:Stone Revelation",' +
      '"oracleFeatures.Stone Mystery ? 1:Touch Of Acid:Stone Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Blizzard:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Fluid Nature:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Fluid Travel:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Freezing Spells:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Ice Armor:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Icy Skin:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 7:Punitive Transformation:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 7:Water Form:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Water Sight:Waves Revelation",' +
      '"oracleFeatures.Waves Mystery ? 1:Wintry Touch:Waves Revelation",' +
      '"oracleFeatures.Wind Mystery ? 1:Air Barrier:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 7:Gaseous Form:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 3:Invisibility:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 1:Lightning Breath:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 1:Spark Skin:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 7:Thunderburst:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 1:Touch Of Electricity:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 1:Vortex Spells:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 1:Wind Sight:Wind Revelation",' +
      '"oracleFeatures.Wind Mystery ? 7:Wings Of Air:Wind Revelation",' +
      // Need to list Combat Healer here since it's available via two Mysteries
      '"7:Combat Healer:Battle Revelation,Life Revelation" ' +
    'CasterLevelDivine=levels.Oracle ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'O0:1=4;2=5;4=6;6=7;8=8;10=9,' +
      'O1:1=3;2=4;3=5;4=6,' +
      'O2:4=3;5=4;6=5;7=6,' +
      'O3:6=3;7=4;8=5;9=6,' +
      'O4:8=3;9=4;10=5;11=6,' +
      'O5:10=3;11=4;12=5;13=6,' +
      'O6:12=3;13=4;14=5;15=6,' +
      'O7:14=3;15=4;16=6;17=6,' +
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
      '"1:Climb Evolution:Evolution",' +
      '"1:Gills Evolution:Evolution",' +
      '"1:Improved Damage Evolution:Evolution",' +
      '"1:Improved Natural Armor Evolution:Evolution",' +
      '"1:Magic Attacks Evolution:Evolution",' +
      '"animalCompanion.Quadruped Eidolon || animalCompanion.Serpentine Eidolon ? 1:Mount Evolution:Evolution",' +
      '"features.Limbs (Arms) Evolution ? 1:Pincers Evolution:Evolution",' +
      '"animalCompanion.Quadruped Eidolon ? 1:Pounce Evolution:Evolution",' +
      '"1:Pull Evolution:Evolution",' +
      '"1:Push Evolution:Evolution",' +
      '"1:Reach Evolution:Evolution",' +
      '"1:Resistance Evolution:Evolution",' +
      '"1:Scent Evolution:Evolution",' +
      '"1:Skilled Evolution:Evolution",' +
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
      '"5:Flight Evolution:Evolution:2",' +
      '"1:Gore Evolution:Evolution:2",' +
      '"1:Grab Evolution:Evolution:2",' +
      '"7:Immunity Evolution:Evolution:2",' +
      '"1:Limbs (Arms) Evolution:Evolution:2",' +
      '"1:Limbs (Legs) Evolution:Evolution:2",' +
      '"7:Poison Evolution:Evolution:2",' +
      '"4:Rake Evolution:Evolution:2",' +
      '"6:Rend Evolution:Evolution:2",' +
      '"animalCompanion.Biped Eidolon || animalCompanion.Quadruped Eidolon ? 1:Trample Evolution:Evolution:2",' +
      '"7:Tremorsense Evolution:Evolution:2",' +
      '"features.Bite Evolution ? 1:Trip Evolution:Evolution:2",' +
      '"1:Weapon Training Evolution:Evolution:2",' +
      '"9:Blindsense Evolution:Evolution:3",' +
      '"9:Burrow Evolution:Evolution:3",' +
      '"9:Damage Reduction Evolution:Evolution:3",' +
      '"11:Frightful Presence Evolution:Evolution:3",' +
      '"features.Grab Evolution ? 9:Swallow Whole Evolution:Evolution:3",' +
      '"features.Climb Evolution ? 7:Web Evolution:Evolution:3",' +
      '"features.Blindsense Evolution ? 11:Blindsight Evolution:Evolution:4",' +
      '"9:Breath Weapon Evolution:Evolution:4",' +
      '"11:Fast Healing Evolution:Evolution:4",' +
      '"8:Large Evolution:Evolution:4",' +
      '"9:Spell Resistance Evolution:Evolution:4" ' +
    'CasterLevelArcane=levels.Summoner ' +
    'SpellAbility=Charisma ' +
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
    'SpellAbility=Intelligence ' +
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
    'Features=' +
      '"barbarianFeatures.Breaker ? 1:Destructive",' +
      '"barbarianFeatures.Breaker ? 3:Battle Scavenger",' +
      '"barbarianFeatures.Brutal Pugilist ? 2:Savage Grapple",' +
      '"barbarianFeatures.Brutal Pugilist ? 3:Pit Fighter",' +
      '"barbarianFeatures.Brutal Pugilist ? 5:Improved Savage Grapple",' +
      '"barbarianFeatures.Drunken Brute ? 1:Raging Drunk",' +
      '"barbarianFeatures.Elemental Kin ? 3:Elemental Fury",' +
      '"barbarianFeatures.Hurler ? 1:Skilled Thrower",' +
      '"barbarianFeatures.Invulnerable Rager ? 1:Invulnerability",' +
      '"barbarianFeatures.Invulnerable Rager ? 3:Extreme Endurance",' +
      '"barbarianFeatures.Mounted Fury ? 1:Fast Rider",' +
      '"barbarianFeatures.Mounted Fury ? 5:Bestial Mount",' +
      '"barbarianFeatures.Savage Barbarian ? 3:Naked Courage",' +
      '"barbarianFeatures.Savage Barbarian ? 7:Natural Toughness",' +
      '"barbarianFeatures.Superstitious ? 3:Sixth Sense",' +
      '"barbarianFeatures.Superstitious ? 7:Keen Senses (Barbarian)" ' +
    'Selectables=' +
      '"barbarianFeatures.Lesser Beast Totem ? 6:Beast Totem",' +
      '"barbarianFeatures.Beast Totem ? 10:Greater Beast Totem",' +
      '"2:Lesser Beast Totem",' +
      '"6:Boasting Taunt",' +
      '"2:Brawler",' +
      '"barbarianFeatures.Brawler ? 2:Greater Brawler",' +
      '"barbarianFeatures.Lesser Chaos Totem ? 6:Chaos Totem",' +
      '"barbarianFeatures.Chaos Totem ? 10:Greater Chaos Totem",' +
      '"2:Lesser Chaos Totem",' +
      '"12:Come And Get Me",' +
      '"barbarianFeatures.Superstition ? 8:Disruptive (Barbarian)",' +
      '"barbarianFeatures.Lesser Elemental Rage ? 8:Elemental Rage",' +
      '"barbarianFeatures.Elemental Rage ? 12:Greater Elemental Rage",' +
      '"4:Lesser Elemental Rage",' +
      '"barbarianFeatures.Greater Energy Resistance ? ' +
        '12:Energy Absorption (Rage)",' +
      '"barbarianFeatures.Energy Absorption (Rage) ? 16:Energy Eruption",' +
      '"2:Energy Resistance",' +
      '"barbarianFeatures.Energy Resistance ? 8:Greater Energy Resistance",' +
      '"2:Ferocious Mount",' +
      '"barbarianFeatures.Ferocious Mount ? 8:Greater Ferocious Mount",' +
      '"barbarianFeatures.Ferocious Mount ? 8:Ferocious Trample",' +
      '"barbarianFeatures.Ferocious Trample ? 12:Greater Ferocious Trample",' +
      '"barbarianFeatures.Lesser Fiend Totem ? 6:Fiend Totem",' +
      '"barbarianFeatures.Fiend Totem ? 10:Greater Fiend Totem",' +
      '"2:Lesser Fiend Totem",' +
      '"10:Flesh Wound",' +
      '"2:Good For What Ails You",' +
      '"6:Ground Breaker",' +
      '"6:Guarded Life",' +
      '"barbarianFeatures.Lesser Hurling ? 8:Hurling",' +
      '"barbarianFeatures.Hurling ? 12:Greater Hurling",' +
      '"2:Lesser Hurling",' +
      '"barbarianFeatures.Lesser Hurling ? 8:Hurling Charge",' +
      '"barbarianFeatures.Reckless Abandon ? 2:Inspire Ferocity",' +
      '2:Knockdown,' +
      '"2:Liquid Courage",' +
      '"2:Overbearing Advance",' +
      '"barbarianFeatures.Overbearing Advance ? 6:Overbearing Onslaught",' +
      '"2:Reckless Abandon",' +
      '"2:Roaring Drunk",' +
      '2:Smasher,' +
      '"barbarianFeatures.Disruptive (Barbarian) ? ' +
        '12:Spellbreaker (Barbarian)",' +
      '"barbarianFeatures.Ferocious Mount ? 6:Spirit Steed",' +
      '"barbarianFeatures.Lesser Spirit Totem ? 6:Spirit Totem",' +
      '"barbarianFeatures.Spirit Totem ? 10:Greater Spirit Totem",' +
      '"2:Lesser Spirit Totem",' +
      '"2:Staggering Drunk",' +
      '"barbarianFeatures.Superstition ? 2:Witch Hunter",' +
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
    'Features=' +
      '"bardFeatures.Arcane Duelist ? 1:Arcane Strike",' +
      '"bardFeatures.Arcane Duelist ? 1:Rallying Cry",' +
      '"bardFeatures.Arcane Duelist ? 6:Bladethirst",' +
      '"bardFeatures.Arcane Duelist ? 18:Mass Bladethirst",' +
      '"bardFeatures.Arcane Duelist ? 2:Combat Casting",' +
      '"bardFeatures.Arcane Duelist ? 6:Disruptive",' +
      '"bardFeatures.Arcane Duelist ? 10:Spellbreaker",' +
      '"bardFeatures.Arcane Duelist ? 14:Penetrating Strike",' +
      '"bardFeatures.Arcane Duelist ? 18:Greater Penetrating Strike",' +
      '"bardFeatures.Arcane Duelist || bardFeatures.Magician ? ' +
        '5:Arcane Bond (Bard)",' +
      '"bardFeatures.Arcane Duelist ? 10:Arcane Armor",' +
      '"bardFeatures.Archivist ? 1:Naturalist",' +
      '"bardFeatures.Archivist ? 6:Lamentable Belaborment",' +
      '"bardFeatures.Archivist ? 18:Pedantic Lecture",' +
      // Moved from level 5 '"bardFeatures.Archivist ? 2:Lore Master",' +
      '"bardFeatures.Archivist ? 2:Magic Lore",' +
      // Moved from level 10 '"bardFeatures.Archivist ? 5:Jack-Of-All-Trades",'+
      '"bardFeatures.Archivist ? 10:Probable Path",' +
      '"bardFeatures.Court Bard ? 1:Satire",' +
      '"bardFeatures.Court Bard ? 3:Mockery",' +
      '"bardFeatures.Court Bard ? 8:Glorious Epic",' +
      '"bardFeatures.Court Bard ? 14:Scandal",' +
      '"bardFeatures.Court Bard ? 1:Heraldic Expertise",' +
      '"bardFeatures.Court Bard ? 5:Wide Audience",' +
      '"bardFeatures.Detective ? 1:Careful Teamwork",' +
      '"bardFeatures.Detective ? 9:True Confession",' +
      '"bardFeatures.Detective ? 15:Show Yourselves",' +
      '"bardFeatures.Detective ? 1:Eye For Detail",' +
      '"bardFeatures.Detective ? 2:Arcane Insight",' +
      '"bardFeatures.Detective ? 1:Arcane Investigation",' +
      '"bardFeatures.Magician ? 1:Dweomercraft",' +
      '"bardFeatures.Magician ? 8:Spell Suppression",' +
      '"bardFeatures.Magician ? 14:Metamagic Mastery (Bard)",' +
      '"bardFeatures.Magician ? 1:Magical Talent",' +
      '"bardFeatures.Magician ? 1:Improved Counterspell",' +
      '"bardFeatures.Magician ? 2:Extended Performance",' +
      '"bardFeatures.Magician ? 2:Expanded Repertoire",' +
      // Handled above '"bardFeatures.Magician ? 5:Arcane Bond (Bard)",' +
      '"bardFeatures.Magician ? 10:Wand Mastery",' +
      '"bardFeatures.Sandman ? 1:Stealspell",' +
      '"bardFeatures.Sandman ? 6:Slumber Song",' +
      '"bardFeatures.Sandman ? 9:Dramatic Subtext",' +
      '"bardFeatures.Sandman ? 15:Greater Stealspell",' +
      '"bardFeatures.Sandman ? 18:Mass Slumber Song",' +
      '"bardFeatures.Sandman ? 20:Spell Catching",' +
      '"bardFeatures.Sandman ? 1:Master Of Deception",' +
      '"bardFeatures.Sandman ? 2:Sneakspell",' +
      '"bardFeatures.Sandman ? 3:Trap Sense",' +
      '"bardFeatures.Sandman ? 5:Sneak Attack",' +
      '"bardFeatures.Savage Skald ? 1:Inspiring Blow",' +
      '"bardFeatures.Savage Skald ? 6:Incite Rage",' +
      '"bardFeatures.Savage Skald ? 10:Song Of The Fallen",' +
      '"bardFeatures.Savage Skald ? 12:Berserkergang",' +
      '"bardFeatures.Savage Skald ? 18:Battle Song",' +
      '"bardFeatures.Sea Singer ? 1:Sea Shanty",' +
      '"bardFeatures.Sea Singer ? 3:Still Water",' +
      '"bardFeatures.Sea Singer ? 6:Whistle The Wind",' +
      '"bardFeatures.Sea Singer ? 18:Call The Storm",' +
      '"bardFeatures.Sea Singer ? 1:World Traveler",' +
      '"bardFeatures.Sea Singer ? 2:Familiar",' +
      '"bardFeatures.Sea Singer ? 2:Sea Legs",' +
      '"bardFeatures.Street Performer ? 1:Disappearing Act",' +
      '"bardFeatures.Street Performer ? 3:Harmless Performer",' +
      '"bardFeatures.Street Performer ? 9:Madcap Prank",' +
      '"bardFeatures.Street Performer ? 15:Slip Through The Crowd",' +
      '"bardFeatures.Street Performer ? 1:Gladhanding",' +
      '"bardFeatures.Street Performer ? 1:Streetwise",' +
      '"bardFeatures.Street Performer ? 5:Quick Change" ' +
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
      '"1:Street Performer:Archetype"',
  'Cleric':
    'Features=' +
      '"clericFeatures.Agathion Subdomain ? 8:Protective Aura",' +
      '"clericFeatures.Ancestors Subdomain ? 8:Speak With Dead",' +
      '"clericFeatures.Arcane Subdomain ? 1:Arcane Beacon",' +
      '"clericFeatures.Archon Good Subdomain || ' +
       'clericFeatures.Archon Law Subdomain ? 8:Aura Of Menace",' +
      '"clericFeatures.Ash Subdomain ? 8:Wall Of Ashes",' +
      '"clericFeatures.Azata Chaos Subdomain || ' +
       'clericFeatures.Azata Good Subdomain ? 1:Elysium\'s Call",' +
      '"clericFeatures.Blood Subdomain ? 8:Wounding Blade",' +
      '"clericFeatures.Catastrophe Subdomain ? 8:Deadly Weather",' +
      '"clericFeatures.Caves Subdomain ? 8:Tunnel Runner",' +
      '"clericFeatures.Cloud Subdomain ? 8:Thundercloud",' +
      '"clericFeatures.Construct Subdomain ? 8:Animate Servant",' +
      '"clericFeatures.Curse Subdomain ? 1:Malign Eye",' +
      '"clericFeatures.Daemon Subdomain ? 8:Whispering Evil",' +
      '"clericFeatures.Day Subdomain ? 8:Day\'s Resurgence",' +
      '"clericFeatures.Decay Subdomain ? 8:Aura Of Decay",' +
      '"clericFeatures.Deception Subdomain ? 1:Sudden Shift",' +
      '"clericFeatures.Defense Subdomain ? 1:Deflection Aura",' +
      '"clericFeatures.Demon Chaos Subdomain || ' +
       'clericFeatures.Demon Evil Subdomain ? 1:Fury Of The Abyss",' +
      '"clericFeatures.Devil Evil Subdomain || ' +
       'clericFeatures.Devil Law Subdomain ? 1:Hell\'s Corruption",' +
      '"clericFeatures.Divine Subdomain ? 1:Divine Vessel",' +
      '"clericFeatures.Exploration Subdomain ? 1:Door Sight",' +
      '"clericFeatures.Family Subdomain ? 1:Binding Ties",' +
      '"clericFeatures.Fate Subdomain ? 8:Tugging Strands",' +
      '"clericFeatures.Feather Subdomain ? 1:Eyes Of The Hawk",' +
      '"clericFeatures.Ferocity Subdomain ? 1:Ferocious Strike",' +
      '"clericFeatures.Freedom Subdomain ? 1:Liberty\'s Blessing",' +
      '"clericFeatures.Fur Subdomain ? 1:Predator\'s Grace",' +
      '"clericFeatures.Growth Subdomain ? 1:Enlarge",' +
      '"clericFeatures.Heroism Subdomain ? 8:Aura Of Heroism",' +
      '"clericFeatures.Home Subdomain ? 8:Guarded Hearth",' +
      '"clericFeatures.Honor Subdomain ? 1:Honor Bound",' +
      '"clericFeatures.Ice Subdomain ? 8:Body Of Ice",' +
      '"clericFeatures.Inevitable Subdomain ? 1:Command",' +
      '"clericFeatures.Insanity Subdomain ? 1:Insane Focus",' +
      '"clericFeatures.Language Subdomain ? 6:Rune Shift",' +
      '"clericFeatures.Leadership Subdomain ? 1:Inspiring Command (Cleric)",' +
      '"clericFeatures.Light Subdomain ? 1:Blinding Flash",' +
      '"clericFeatures.Loss Subdomain ? 8:Aura Of Forgetfulness",' +
      '"clericFeatures.Love Subdomain ? 1:Adoration",' +
      '"clericFeatures.Lust Subdomain ? 8:Anything To Please",' +
      '"clericFeatures.Martyr Subdomain ? 8:Sacrificial Bond",' +
      '"clericFeatures.Memory Subdomain ? 1:Recall",' +
      '"clericFeatures.Metal Subdomain ? 1:Metal Fist",' +
      '"clericFeatures.Murder Subdomain ? 8:Killing Blow",' +
      '"clericFeatures.Night Subdomain ? 1:Night Hunter",' +
      '"clericFeatures.Nightmare Subdomain ? 1:Fearful Touch",' +
      '"clericFeatures.Oceans Subdomain ? 1:Surge",' +
      '"clericFeatures.Protean Subdomain ? 8:Aura Of Chaos",' +
      '"clericFeatures.Purity Subdomain ? 8:Purifying Touch",' +
      '"clericFeatures.Rage Subdomain ? 8:Rage (Cleric)",' +
      '"clericFeatures.Resolve Subdomain ? 8:Bestow Resolve",' +
      '"clericFeatures.Restoration Subdomain ? 1:Restorative Touch",' +
      '"clericFeatures.Resurrection Subdomain ? 8:Gift Of Life",' +
      '"clericFeatures.Revolution Subdomain ? 8:Powerful Persuader",' +
      '"clericFeatures.Seasons Subdomain ? 1:Untouched By The Seasons",' +
      '"clericFeatures.Smoke Subdomain ? 1:Cloud Of Smoke",' +
      '"clericFeatures.Souls Subdomain ? 1:Touch The Spirit World",' +
      '"clericFeatures.Storms Subdomain ? 6:Gale Aura",' +
      '"clericFeatures.Tactics Subdomain ? 1:Seize The Initiative",' +
      '"clericFeatures.Thievery Subdomain ? 8:Thief Of The Gods",' +
      '"clericFeatures.Thought Subdomain ? 8:Read Minds",' +
      '"clericFeatures.Toil Subdomain ? 8:Aura Of Repetition",' +
      '"clericFeatures.Trade Subdomain ? 1:Silver-Tongued Haggler",' +
      '"clericFeatures.Undead Subdomain ? 1:Death\'s Kiss",' +
      '"clericFeatures.Wards Subdomain ? 6:Warding Rune",' +
      '"clericFeatures.Wind Subdomain ? 1:Wind Blast" ' +
    'Selectables=' +
      '"alignment =~ \'Good\' && deityDomains =~ \'Agathion\' ? ' +
        '1:Agathion Subdomain:Domain",' +
      '"deityDomains =~ \'Ancestors\' ? 1:Ancestors Subdomain",' +
      '"deityDomains =~ \'Arcane\' ? 1:Arcane Subdomain",' +
      '"alignment =~ \'Good\' && deityDomains =~ \'Archon Good\' ? ' +
        '1:Archon Good Subdomain:Domain",' +
      '"alignment =~ \'Lawful\' && deityDomains =~ \'Archon Law\' ? ' +
        '1:Archon Law Subdomain:Domain",' +
      '"deityDomains =~ \'Ash\' ? 1:Ash Subdomain",' +
      '"alignment =~ \'Chaotic\' && deityDomains =~ \'Azata Chaos\' ? ' +
        '1:Azata Chaos Subdomain:Domain",' +
      '"alignment =~ \'Good\' && deityDomains =~ \'Azata Good\' ? ' +
        '1:Azata Good Subdomain:Domain",' +
      '"deityDomains =~ \'Blood\' ? 1:Blood Subdomain",' +
      '"deityDomains =~ \'Catastrophe\' ? 1:Catastrophe Subdomain",' +
      '"deityDomains =~ \'Caves\' ? 1:Caves Subdomain",' +
      '"deityDomains =~ \'Cloud\' ? 1:Cloud Subdomain",' +
      '"deityDomains =~ \'Construct\' ? 1:Construct Subdomain",' +
      '"deityDomains =~ \'Curse\' ? 1:Curse Subdomain",' +
      '"alignment =~ \'Evil\' && deityDomains =~ \'Daemon\' ? ' +
        '1:Daemon Subdomain",' +
      '"deityDomains =~ \'Day\' ? 1:Day Subdomain",' +
      '"deityDomains =~ \'Decay\' ? 1:Decay Subdomain",' +
      '"deityDomains =~ \'Deception\' ? 1:Deception Subdomain",' +
      '"deityDomains =~ \'Defense\' ? 1:Defense Subdomain",' +
      '"alignment =~ \'Chaotic\' && deityDomains =~ \'Demon Chaos\' ? ' +
        '1:Demon Chaos Subdomain:Domain",' +
      '"alignment =~ \'Evil\' && deityDomains =~ \'Demon Evil\' ? ' +
        '1:Demon Evil Subdomain:Domain",' +
      '"alignment =~ \'Evil\' && deityDomains =~ \'Devil Evil\' ? ' +
        '1:Devil Evil Subdomain:Domain",' +
      '"alignment =~ \'Lawful\' && deityDomains =~ \'Devil Law\' ? ' +
        '1:Devil Law Subdomain:Domain",' +
      '"deityDomains =~ \'Divine\' ? 1:Divine Subdomain",' +
      '"deityDomains =~ \'Exploration\' ? 1:Exploration Subdomain",' +
      '"deityDomains =~ \'Family\' ? 1:Family Subdomain",' +
      '"deityDomains =~ \'Fate\' ? 1:Fate Subdomain",' +
      '"deityDomains =~ \'Feather\' ? 1:Feather Subdomain",' +
      '"deityDomains =~ \'Ferocity\' ? 1:Ferocity Subdomain",' +
      '"deityDomains =~ \'Freedom\' ? 1:Freedom Subdomain",' +
      '"deityDomains =~ \'Fur\' ? 1:Fur Subdomain",' +
      '"deityDomains =~ \'Growth\' ? 1:Growth Subdomain",' +
      '"deityDomains =~ \'Heroism\' ? 1:Heroism Subdomain",' +
      '"deityDomains =~ \'Home\' ? 1:Home Subdomain",' +
      '"deityDomains =~ \'Honor\' ? 1:Honor Subdomain",' +
      '"deityDomains =~ \'Ice\' ? 1:Ice Subdomain",' +
      '"alignment =~ \'Lawful\' && deityDomains =~ \'Inevitable\' ? ' +
        '1:Inevitable Subdomain",' +
      '"deityDomains =~ \'Insanity\' ? 1:Insanity Subdomain",' +
      '"deityDomains =~ \'Language\' ? 1:Language Subdomain",' +
      '"deityDomains =~ \'Leadership\' ? 1:Leadership Subdomain",' +
      '"deityDomains =~ \'Light\' ? 1:Light Subdomain",' +
      '"deityDomains =~ \'Loss\' ? 1:Loss Subdomain",' +
      '"deityDomains =~ \'Love\' ? 1:Love Subdomain",' +
      '"deityDomains =~ \'Lust\' ? 1:Lust Subdomain",' +
      '"deityDomains =~ \'Martyr\' ? 1:Martyr Subdomain",' +
      '"deityDomains =~ \'Memory\' ? 1:Memory Subdomain",' +
      '"deityDomains =~ \'Metal\' ? 1:Metal Subdomain",' +
      '"deityDomains =~ \'Murder\' ? 1:Murder Subdomain",' +
      '"deityDomains =~ \'Night\\b\' ? 1:Night Subdomain",' +
      '"deityDomains =~ \'Nightmare\' ? 1:Nightmare Subdomain",' +
      '"deityDomains =~ \'Oceans\' ? 1:Oceans Subdomain",' +
      '"alignment =~ \'Chaotic\' && + deityDomains =~ \'Protean\' ? ' +
        '1:Protean Subdomain",' +
      '"deityDomains =~ \'Purity\' ? 1:Purity Subdomain",' +
      '"deityDomains =~ \'Rage\' ? 1:Rage Subdomain",' +
      '"deityDomains =~ \'Resolve\' ? 1:Resolve Subdomain",' +
      '"deityDomains =~ \'Restoration\' ? 1:Restoration Subdomain",' +
      '"deityDomains =~ \'Resurrection\' ? 1:Resurrection Subdomain",' +
      '"deityDomains =~ \'Revolution\' ? 1:Revolution Subdomain",' +
      '"deityDomains =~ \'Seasons\' ? 1:Seasons Subdomain",' +
      '"deityDomains =~ \'Smoke\' ? 1:Smoke Subdomain",' +
      '"deityDomains =~ \'Souls\' ? 1:Souls Subdomain",' +
      '"deityDomains =~ \'Storms\' ? 1:Storms Subdomain",' +
      '"deityDomains =~ \'Tactics\' ? 1:Tactics Subdomain",' +
      '"deityDomains =~ \'Thievery\' ? 1:Thievery Subdomain",' +
      '"deityDomains =~ \'Thought\' ? 1:Thought Subdomain",' +
      '"deityDomains =~ \'Toil\' ? 1:Toil Subdomain",' +
      '"deityDomains =~ \'Trade\' ? 1:Trade Subdomain",' +
      '"deityDomains =~ \'Undead\' ? 1:Undead Subdomain",' +
      '"deityDomains =~ \'Wards\' ? 1:Wards Subdomain",' +
      '"deityDomains =~ \'Wind\' ? 1:Wind Subdomain"',
  'Druid':
    'Features=' +
      '"druidFeatures.Aquatic Druid ? 2:Aquatic Adaptation",' +
      '"druidFeatures.Aquatic Druid ? 3:Natural Swimmer",' +
      '"druidFeatures.Aquatic Druid ? 4:Resist Ocean\'s Fury",' +
      '"druidFeatures.Aquatic Druid ? 9:Seaborn",' +
      '"druidFeatures.Aquatic Druid ? 13:Deep Diver",' +
      '"druidFeatures.Arctic Druid ? 2:Arctic Native",' +
      '"druidFeatures.Arctic Druid ? 3:Icewalking",' +
      '"druidFeatures.Arctic Druid ? 4:Arctic Endurance",' +
      '"druidFeatures.Arctic Druid ? 9:Snowcaster",' +
      '"druidFeatures.Arctic Druid ? 13:Flurry Form",' +
      '"druidFeatures.Blight Druid ? 1:Vermin Empathy",' +
      '"druidFeatures.Blight Druid ? 5:Miasma",' +
      '"druidFeatures.Blight Druid ? 9:Blightblooded",' +
      '"druidFeatures.Blight Druid ? 13:Plaguebearer",' +
      '"druidFeatures.Cave Druid ? 1:Cavesense",' +
      '"druidFeatures.Cave Druid ? 2:Tunnelrunner",' +
      '"druidFeatures.Cave Druid ? 3:Lightfoot",' +
      '"druidFeatures.Cave Druid ? 4:Resist Subterranean Corruption",' +
      '"druidFeatures.Desert Druid ? 2:Desert Native",' +
      '"druidFeatures.Desert Druid ? 3:Sandwalker",' +
      '"druidFeatures.Desert Druid ? 4:Desert Endurance",' +
      '"druidFeatures.Desert Druid ? 9:Shaded Vision",' +
      '"druidFeatures.Desert Druid ? 13:Dunemeld",' +
      '"druidFeatures.Jungle Druid ? 2:Jungle Guardian",' +
      // From level 2 '"druidFeatures.Jungle Druid ? 3:Woodland Stride",'+
      '"druidFeatures.Jungle Druid ? 4:Torrid Endurance",' +
      '"druidFeatures.Jungle Druid ? 13:Verdant Sentinel",' +
      '"druidFeatures.Mountain Druid ? 2:Mountaineer",' +
      '"druidFeatures.Mountain Druid ? 3:Sure-Footed (Druid)",' +
      '"druidFeatures.Mountain Druid ? 4:Spire Walker",' +
      '"druidFeatures.Mountain Druid ? 9:Mountain Stance",' +
      '"druidFeatures.Mountain Druid ? 13:Mountain Stone",' +
      '"druidFeatures.Plains Druid ? 2:Plains Traveler",' +
      '"druidFeatures.Plains Druid ? 3:Run Like The Wind",' +
      '"druidFeatures.Plains Druid ? 4:Savanna Ambush",' +
      '"druidFeatures.Plains Druid ? 9:Canny Charger",' +
      '"druidFeatures.Plains Druid ? 13:Evasion",' +
      '"druidFeatures.Swamp Druid ? 2:Marshwight",' +
      '"druidFeatures.Swamp Druid ? 3:Swamp Strider",' +
      '"druidFeatures.Swamp Druid ? 4:Pond Scum",' +
      '"druidFeatures.Swamp Druid ? 13:Slippery",' +
      '"druidFeatures.Urban Druid ? 1:Spontaneous Casting",' +
      '"druidFeatures.Urban Druid ? 2:Lorekeeper",' +
      '"druidFeatures.Urban Druid ? 4:Resist Temptation",' +
      // From level 13 '"druidFeatures.Urban Druid ? 6:A Thousand Faces",' +
      '"druidFeatures.Urban Druid ? 9:Mental Strength",' +
      '"druidFeatures.Animal Shaman ? 5:Totemic Summons",' +
      '"druidFeatures.Animal Shaman ? 9:Animal Shaman Feat Bonus",' +
      '"druidFeatures.Bear Totem ? 2:Totem Transformation (Bear)",' +
      '"druidFeatures.Eagle Totem ? 2:Totem Transformation (Eagle)",' +
      '"druidFeatures.Lion Totem ? 2:Totem Transformation (Lion)",' +
      '"druidFeatures.Serpent Totem ? 2:Totem Transformation (Serpent)",' +
      '"druidFeatures.Wolf Totem ? 2:Totem Transformation (Wolf)" ' +
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
      '"druidFeatures.Blight Druid ? 1:Familiar:Nature Bond",' +
      '"druidFeatures.Urban Druid || ' +
       'druidFeatures.Serpent Totem ? 1:Charm Domain:Nature Bond",' +
      '"druidFeatures.Urban Druid || ' +
       'druidFeatures.Wolf Totem ? 1:Community Domain:Nature Bond",' +
      '"druidFeatures.Blight Druid || ' +
       'druidFeatures.Cave Druid ? 1:Darkness Domain:Nature Bond",' +
      '"druidFeatures.Blight Druid ? 1:Death Domain:Nature Bond",' +
      '"druidFeatures.Blight Druid ? 1:Destruction Domain:Nature Bond",' +
      '"druidFeatures.Lion Totem ? 1:Glory Domain:Nature Bond",' +
      '"druidFeatures.Urban Druid ? 1:Knowledge Domain:Nature Bond",' +
      '"druidFeatures.Wolf Totem ? 1:Liberation Domain:Nature Bond",' +
      '"druidFeatures.Urban Druid || ' +
       'druidFeatures.Eagle Totem || ' +
       'druidFeatures.Lion Totem ? 1:Nobility Domain:Nature Bond",' +
      '"druidFeatures.Urban Druid || ' +
       'druidFeatures.Bear Totem ? 1:Protection Domain:Nature Bond",' +
      '"druidFeatures.Urban Druid ? 1:Repose Domain:Nature Bond",' +
      '"druidFeatures.Urban Druid ? 1:Rune Domain:Nature Bond",' +
      '"druidFeatures.Bear Totem ? 1:Strength Domain:Nature Bond",' +
      '"druidFeatures.Lion Totem ? 1:Sun Domain:Nature Bond",' +
      '"druidFeatures.Wolf Totem ? 1:Travel Domain:Nature Bond",' +
      '"druidFeatures.Serpent Totem ? 1:Trickery Domain:Nature Bond",' +
      '"druidFeatures.Animal Shaman ? 1:Bear Totem:Totem",' +
      '"druidFeatures.Animal Shaman ? 1:Eagle Totem:Totem",' +
      '"druidFeatures.Animal Shaman ? 1:Lion Totem:Totem",' +
      '"druidFeatures.Animal Shaman ? 1:Serpent Totem:Totem",' +
      '"druidFeatures.Animal Shaman ? 1:Wolf Totem:Totem"',
  'Fighter':
    'Features=' +
      '"fighterFeatures.Archer ? 2:Hawkeye",' +
      '"fighterFeatures.Archer ? 3:Trick Shot (Archer)",' +
      '"fighterFeatures.Archer ? 5:Expert Archer",' +
      '"fighterFeatures.Archer || ' +
       'fighterFeatures.Crossbowman ? 9:Safe Shot",' +
      '"fighterFeatures.Archer ? 13:Evasive Archer",' +
      '"fighterFeatures.Archer ? 17:Volley",' +
      '"fighterFeatures.Archer ? 19:Ranged Defense",' +
      '"fighterFeatures.Crossbowman ? 3:Deadshot",' +
      '"fighterFeatures.Crossbowman ? 5:Crossbow Expert",' +
      '"fighterFeatures.Crossbowman ? 7:Improved Deadshot",' +
      '"fighterFeatures.Crossbowman ? 9:Quick Sniper",' +
      '"fighterFeatures.Crossbowman ? 11:Greater Deadshot",' +
      // Handled above '"fighterFeatures.Crossbowman ? 13:Safe Shot",' +
      '"fighterFeatures.Crossbowman ? 15:Pinpoint Targeting",' +
      '"fighterFeatures.Crossbowman ? 17:Meteor Shot",' +
      '"fighterFeatures.Crossbowman ? 19:Penetrating Shot",' +
      '"fighterFeatures.Free Hand Fighter ? 2:Deceptive Strike",' +
      '"fighterFeatures.Free Hand Fighter ? 3:Elusive",' +
      '"fighterFeatures.Free Hand Fighter ? 5:Singleton",' +
      '"fighterFeatures.Free Hand Fighter ? 9:Timely Tip",' +
      '"fighterFeatures.Free Hand Fighter ? 13:Interference",' +
      '"fighterFeatures.Free Hand Fighter ? 19:Reversal",' +
      '"fighterFeatures.Mobile Fighter ? 2:Agility",' +
      '"fighterFeatures.Mobile Fighter ? 5:Leaping Attack",' +
      '"fighterFeatures.Mobile Fighter ? 11:Rapid Attack",' +
      '"fighterFeatures.Mobile Fighter ? 15:Fleet Footed",' +
      '"fighterFeatures.Mobile Fighter ? 20:Whirlwind Blitz",' +
      '"fighterFeatures.Phalanx Soldier ? 2:Stand Firm",' +
      '"fighterFeatures.Phalanx Soldier ? 3:Phalanx Fighting",' +
      '"fighterFeatures.Phalanx Soldier ? 5:Ready Pike",' +
      '"fighterFeatures.Phalanx Soldier ? 7:Deft Shield",' +
      '"fighterFeatures.Phalanx Soldier ? 9:Shield Ally",' +
      '"fighterFeatures.Phalanx Soldier ? 15:Irresistible Advance",' +
      '"fighterFeatures.Phalanx Soldier ? 20:Shielded Fortress",' +
      '"fighterFeatures.Polearm Master ? 2:Pole Fighting",' +
      '"fighterFeatures.Polearm Master ? 3:Steadfast Pike",' +
      '"fighterFeatures.Polearm Master ? 5:Polearm Training",' +
      '"fighterFeatures.Polearm Master ? 9:Flexible Flanker",' +
      '"fighterFeatures.Polearm Master ? 13:Sweeping Fend",' +
      '"fighterFeatures.Polearm Master ? 17:Step Aside",' +
      '"fighterFeatures.Polearm Master ? 19:Polearm Parry",' +
      '"fighterFeatures.Roughrider ? 2:Steadfast Mount",' +
      '"fighterFeatures.Roughrider ? 3:Armored Charger",' +
      '"fighterFeatures.Roughrider ? 5:Mounted Mettle",' +
      '"fighterFeatures.Roughrider ? 7:Leap From The Saddle",' +
      '"fighterFeatures.Roughrider ? 11:Relentless Steed",' +
      '"fighterFeatures.Roughrider ? 15:Ride Them Down",' +
      '"fighterFeatures.Roughrider ? 15:Unavoidable Onslaught",' +
      '"fighterFeatures.Roughrider ? 19:Indomitable Steed",' +
      '"fighterFeatures.Savage Warrior ? 2:Spark Of Life",' +
      '"fighterFeatures.Savage Warrior ? 5:Natural Savagery",' +
      '"fighterFeatures.Savage Warrior ? 9:Savage Charge",' +
      '"fighterFeatures.Savage Warrior ? 13:Careful Claw",' +
      '"fighterFeatures.Savage Warrior ? 17:Greater Savage Charge",' +
      '"fighterFeatures.Savage Warrior ? 20:Natural Weapon Mastery",' +
      '"fighterFeatures.Shielded Fighter ? 3:Active Defense",' +
      '"fighterFeatures.Shielded Fighter ? 5:Shield Fighter",' +
      '"fighterFeatures.Shielded Fighter ? 9:Shield Buffet",' +
      '"fighterFeatures.Shielded Fighter ? 17:Shield Guard",' +
      '"fighterFeatures.Shielded Fighter ? 19:Shield Mastery",' +
      '"fighterFeatures.Shielded Fighter ? 20:Shield Ward",' +
      '"fighterFeatures.Two-Handed Fighter ? 2:Shattering Strike",' +
      '"fighterFeatures.Two-Handed Fighter ? 3:Overhand Chop",' +
      '"fighterFeatures.Two-Handed Fighter ? 7:Backswing",' +
      '"fighterFeatures.Two-Handed Fighter ? 11:Piledriver",' +
      '"fighterFeatures.Two-Handed Fighter ? 15:Greater Power Attack",' +
      '"fighterFeatures.Two-Handed Fighter ? 19:Devastating Blow",' +
      '"fighterFeatures.Two-Weapon Warrior ? 3:Defensive Flurry",' +
      '"fighterFeatures.Two-Weapon Warrior ? 5:Twin Blades",' +
      '"fighterFeatures.Two-Weapon Warrior ? 9:Doublestrike",' +
      '"fighterFeatures.Two-Weapon Warrior ? 11:Improved Balance",' +
      '"fighterFeatures.Two-Weapon Warrior ? 13:Equal Opportunity",' +
      '"fighterFeatures.Two-Weapon Warrior ? 15:Perfect Balance",' +
      '"fighterFeatures.Two-Weapon Warrior ? 17:Deft Doublestrike",' +
      '"fighterFeatures.Two-Weapon Warrior ? 19:Deadly Defense",' +
      '"fighterFeatures.Weapon Master ? 2:Weapon Guard",' +
      '"fighterFeatures.Weapon Master ? 3:Weapon Training (Weapon Master)",' +
      '"fighterFeatures.Weapon Master ? 5:Reliable Strike",' +
      '"fighterFeatures.Weapon Master ? 9:Mirror Move",' +
      '"fighterFeatures.Weapon Master ? 13:Deadly Critical",' +
      '"fighterFeatures.Weapon Master ? 17:Critical Specialist",' +
      '"fighterFeatures.Weapon Master ? 19:Unstoppable Strike" ' +
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
    'Features=' +
      '"monkFeatures.Drunken Master ? 3:Drunken Ki",' +
      '"monkFeatures.Drunken Master ? 5:Drunken Strength",' +
      '"monkFeatures.Drunken Master ? 11:Drunken Courage",' +
      '"monkFeatures.Drunken Master ? 13:Drunken Resilience",' +
      '"monkFeatures.Drunken Master ? 19:Firewater Breath",' +
      '"monkFeatures.Hungry Ghost Monk ? 1:Punishing Kick",' +
      '"monkFeatures.Hungry Ghost Monk ? 5:Steal Ki",' +
      '"monkFeatures.Hungry Ghost Monk ? 7:Life Funnel",' +
      '"monkFeatures.Hungry Ghost Monk ? 11:Life From A Stone",' +
      '"monkFeatures.Hungry Ghost Monk ? 13:Sipping Demon",' +
      '"monkFeatures.Ki Mystic ? 3:Ki Pool (Ki Mystic)",' +
      '"monkFeatures.Ki Mystic ? 5:Mystic Insight",' +
      '"monkFeatures.Ki Mystic ? 11:Mystic Visions",' +
      '"monkFeatures.Ki Mystic ? 13:Mystic Prescience",' +
      '"monkFeatures.Ki Mystic ? 19:Mystic Persistence",' +
      '"monkFeatures.Monk Of The Empty Hand ? ' +
        '1:Weapon Proficiency (Shuriken)",' +
      '"monkFeatures.Monk Of The Empty Hand ? 3:Versatile Improvisation",' +
      '"monkFeatures.Monk Of The Empty Hand ? ' +
        '4:Ki Pool (Monk Of The Empty Hand)",' +
      '"monkFeatures.Monk Of The Empty Hand ? 5:Ki Weapons",' +
      '"monkFeatures.Monk Of The Four Winds ? 1:Elemental Fist",' +
      '"monkFeatures.Monk Of The Four Winds ? 12:Slow Time",' +
      '"monkFeatures.Monk Of The Four Winds ? 17:Aspect Master",' +
      '"monkFeatures.Monk Of The Four Winds ? 20:Immortality",' +
      '"monkFeatures.Monk Of The Healing Hand ? 7:Ancient Healing Hand",' +
      '"monkFeatures.Monk Of The Healing Hand ? 11:Ki Sacrifice",' +
      '"monkFeatures.Monk Of The Healing Hand ? 20:True Sacrifice",' +
      '"monkFeatures.Monk Of The Lotus ? 1:Touch Of Serenity",' +
      '"monkFeatures.Monk Of The Lotus ? 12:Touch Of Surrender",' +
      '"monkFeatures.Monk Of The Lotus ? 15:Touch Of Peace",' +
      '"monkFeatures.Monk Of The Lotus ? 17:Learned Master",' +
      '"monkFeatures.Monk Of The Sacred Mountain ? 2:Iron Monk",' +
      '"monkFeatures.Monk Of The Sacred Mountain ? 4:Bastion Stance",' +
      '"monkFeatures.Monk Of The Sacred Mountain ? 5:Iron Limb Defense",' +
      '"monkFeatures.Monk Of The Sacred Mountain ? 9:Adamantine Monk",' +
      '"monkFeatures.Monk Of The Sacred Mountain ? 17:Vow Of Silence",' +
      '"monkFeatures.Weapon Adept || monkFeatures.Zen Archer ? ' +
        '1:Perfect Strike",' +
      '"monkFeatures.Weapon Adept ? 2:Way Of The Weapon Master",' +
      '"monkFeatures.Weapon Adept ? 17:Uncanny Initiative",' +
      '"monkFeatures.Weapon Adept ? 20:Pure Power",' +
      '"monkFeatures.Zen Archer ? 1:Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"monkFeatures.Zen Archer ? 1:Flurry Of Blows (Zen Archer)",' +
      // Handed above '"monkFeatures.Zen Archer ? 1:Perfect Strike",' +
      '"monkFeatures.Zen Archer ? 2:Way Of The Bow",' +
      '"monkFeatures.Zen Archer ? 3:Zen Archery",' +
      '"monkFeatures.Zen Archer ? 3:Point-Blank Master",' +
      '"monkFeatures.Zen Archer ? 4:Ki Pool (Zen Archer)",' +
      '"monkFeatures.Zen Archer ? 5:Ki Arrows",' +
      '"monkFeatures.Zen Archer ? 9:Reflexive Shot",' +
      '"monkFeatures.Zen Archer ? 11:Trick Shot (Zen Archer)",' +
      '"monkFeatures.Zen Archer ? 17:Ki Focus Bow" ' +
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
      '"1:Zen Archer:Archetype",' +
      '"monkFeatures.Monk Of The Empty Hand ? 6:Improved Dirty Trick",' +
      '"monkFeatures.Monk Of The Empty Hand ? 6:Improved Steal",' +
      '"monkFeatures.Monk Of The Empty Hand ? 6:Improvised Weapon Mastery",' +
      '"monkFeatures.Zen Archer ? 1:Far Shot",' +
      '"monkFeatures.Zen Archer ? 1:Point-Blank Shot",' +
      '"monkFeatures.Zen Archer ? 1:Precise Shot",' +
      '"monkFeatures.Zen Archer ? 1:Rapid Shot",' +
      '"monkFeatures.Zen Archer ? 6:Focused Shot",' +
      '"monkFeatures.Zen Archer ? 6:Improved Precise Shot",' +
      '"monkFeatures.Zen Archer ? 6:Manyshot",' +
      '"monkFeatures.Zen Archer ? 6:Parting Shot",' +
      '"monkFeatures.Zen Archer ? 10:Pinpoint Targeting",' +
      '"monkFeatures.Zen Archer ? 10:Shot On The Run",' +
      '"monkFeatures.Aspect Master && alignment !~ \'Evil\' ? ' +
        '17:Aspect Of The Carp:Aspect",' +
      '"monkFeatures.Aspect Master && alignment == \'Lawful Good\' ? ' +
        '17:Aspect Of The Ki-Rin:Aspect",' +
      '"monkFeatures.Aspect Master 17:Aspect Of The Monkey:Aspect",' +
      '"monkFeatures.Aspect Master && alignment =~ \'Evil\' ? ' +
        '17:Aspect Of The Oni:Aspect",' +
      '"monkFeatures.Aspect Master 17:Aspect Of The Owl:Aspect",' +
      '"monkFeatures.Aspect Master 17:Aspect Of The Tiger:Aspect"',
  'Paladin':
    'Features=' +
      '"paladinFeatures.Divine Defender ? 3:Shared Defense",' +
      '"paladinFeatures.Hospitaler ? 4:Channel Positive Energy (Hospitaler)",' +
      '"paladinFeatures.Hospitaler ? 11:Aura Of Healing",' +
      '"paladinFeatures.Sacred Servant ? 4:Domain (Paladin)",' +
      '"paladinFeatures.Sacred Servant ? 8:Call Celestial Ally",' +
      '"paladinFeatures.Shining Knight ? 3:Skilled Rider",' +
      '"paladinFeatures.Shining Knight ? 11:Knight\'s Charge",' +
      '"paladinFeatures.Undead Scourge ? 8:Aura Of Life",' +
      '"paladinFeatures.Undead Scourge ? 11:Undead Annihilation",' +
      '"paladinFeatures.Warrior Of The Holy Light ? 4:Power Of Faith",' +
      '"paladinFeatures.Warrior Of The Holy Light ? 14:Shining Light",' +
      '"' + QuilvynUtils.getAttrValueArray(Pathfinder.CLASSES.Cleric, 'Features').filter(x => x.includes('clericDomainFeatures')).map(x => x.replace(/clericDomainFeatures.(\w*)/, 'paladinFeatures.$1 Domain')).join('","') + '" ' +
    'Selectables=' +
      '"1:Core Paladin:Archetype",' +
      '"1:Divine Defender:Archetype",' +
      '"1:Hospitaler:Archetype",' +
      '"1:Sacred Servant:Archetype",' +
      '"1:Shining Knight:Archetype",' +
      '"1:Undead Scourge:Archetype",' +
      '"1:Warrior Of The Holy Light:Archetype",' +
      '"features.Divine Defender ? 5:Divine Bond (Armor):Divine Bond",' +
      '"features.Sacred Servant ? 5:Divine Bond (Holy Symbol):Divine Bond",' +
      '"' + QuilvynUtils.getAttrValueArray(Pathfinder.CLASSES.Cleric, 'Selectables').filter(x => x.includes('Domain')).map(x => 'paladinFeatures.Sacred Servant && ' + x.replace('1:', '4:')).join('","') + '"',
  'Ranger':
    'Features=' +
      '"rangerFeatures.Beast Master ? 6:Improved Empathic Link",' +
      '"rangerFeatures.Beast Master || rangerFeatures.Horse Lord ? ' +
        '12:Strong Bond",' +
      '"rangerFeatures.Guide ? 1:Ranger\'s Focus",' +
      '"rangerFeatures.Guide ? 4:Terrain Bond",' +
      '"rangerFeatures.Guide ? 9:Ranger\'s Luck",' +
      '"rangerFeatures.Guide ? 11:Inspired Moment",' +
      '"rangerFeatures.Guide ? 16:Improved Ranger\'s Luck",' +
      '"rangerFeatures.Horse Lord ? 4:Mounted Bond",' +
      // Handled above '"rangerFeatures.Horse Lord ? 12:Strong Bond",' +
      '"rangerFeatures.Horse Lord ? 17:Spiritual Bond",' +
      '"rangerFeatures.Infiltrator ? 3:Adaptation",' +
      '"rangerFeatures.Shapeshifter ? 3:Shifter\'s Blessing",' +
      '"rangerFeatures.Shapeshifter ? 12:Dual Form Shifter",' +
      '"rangerFeatures.Shapeshifter ? 20:Master Shifter",' +
      '"rangerFeatures.Skirmisher ? 5:Hunter\'s Tricks",' +
      '"rangerFeatures.Spirit Ranger ? 4:Spirit Bond",' +
      '"rangerFeatures.Spirit Ranger ? 12:Wisdom Of The Spirits",' +
      '"rangerFeatures.Urban Ranger ? 3:Favored Community",' +
      '"rangerFeatures.Urban Ranger ? 3:Trapfinding",' +
      '"rangerFeatures.Urban Ranger ? 7:Push Through",' +
      '"rangerFeatures.Urban Ranger ? 12:Blend In",' +
      '"rangerFeatures.Urban Ranger ? 17:Invisibility Trick" ' +
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
      '"2:Aspect Of The Beast (Claws Of The Beast):Natural Weapon Feat",' +
      '"2:Aspect Of The Beast (Night Senses):Natural Weapon Feat",' +
      '"2:Aspect Of The Beast (Predator\'s Leap):Natural Weapon Feat",' +
      '"2:Aspect Of The Beast (Wild Instinct):Natural Weapon Feat",' +
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
    'Features=' +
      '"rogueFeatures.Acrobat ? 1:Expert Acrobat",' +
      '"rogueFeatures.Acrobat ? 3:Second Chance (Rogue)",' +
      '"rogueFeatures.Burglar || rogueFeatures.Trapsmith ? 4:Careful Disarm",' +
      '"rogueFeatures.Burglar ? 8:Distraction (Rogue)",' +
      '"rogueFeatures.Cutpurse ? 1:Measure The Mark",' +
      '"rogueFeatures.Cutpurse ? 3:Stab And Grab",' +
      '"rogueFeatures.Investigator ? 1:Follow Up",' +
      '"rogueFeatures.Poisoner || rogueFeatures.Spy ? 1:Poison Use",' +
      '"rogueFeatures.Poisoner ? 3:Master Poisoner",' +
      '"rogueFeatures.Rake ? 1:Bravado\'s Blade",' +
      '"rogueFeatures.Rake ? 3:Rake\'s Smile",' +
      '"rogueFeatures.Scout ? 4:Scout\'s Charge",' +
      '"rogueFeatures.Scout ? 8:Skirmisher (Rogue)",' +
      '"rogueFeatures.Sniper ? 1:Accuracy",' +
      '"rogueFeatures.Sniper ? 3:Deadly Range",' +
      '"rogueFeatures.Spy ? 1:Skilled Liar",' +
      // Handled above '"rogueFeatures.Spy ? 3:Poison Use",' +
      '"rogueFeatures.Swashbuckler ? 1:Martial Training",' +
      '"rogueFeatures.Swashbuckler ? 3:Daring",' +
      '"rogueFeatures.Thug ? 1:Frightening",' +
      '"rogueFeatures.Thug ? 3:Brutal Beating",' +
      // Handled above '"rogueFeatures.Trapsmith ? 4:Careful Disarm",' +
      '"rogueFeatures.Trapsmith ? 8:Trap Master" ' +
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
    'Features=' +
      '"sorcererFeatures.Bloodline Aquatic ? 1:Dehydrating Touch",' +
      '"sorcererFeatures.Bloodline Aquatic ? 3:Aquatic Adaptation (Sorcerer)",'+
      '"sorcererFeatures.Bloodline Aquatic ? 9:Aquatic Telepathy",' +
      '"sorcererFeatures.Bloodline Aquatic ? 15:Raise The Deep",' +
      '"sorcererFeatures.Bloodline Aquatic ? 20:Deep One",' +
      '"sorcererFeatures.Bloodline Boreal ? 1:Cold Steel",' +
      '"sorcererFeatures.Bloodline Boreal ? 3:Icewalker",' +
      '"sorcererFeatures.Bloodline Boreal ? 9:Snow Shroud",' +
      '"sorcererFeatures.Bloodline Boreal ? 15:Blizzard (Sorcerer)",' +
      '"sorcererFeatures.Bloodline Boreal ? 20:Child Of Ancient Winters",' +
      '"sorcererFeatures.Bloodline Deep Earth ? 1:Tremor",' +
      '"sorcererFeatures.Bloodline Deep Earth ? 3:Rockseer",' +
      '"sorcererFeatures.Bloodline Deep Earth ? 9:Crystal Shard",' +
      '"sorcererFeatures.Bloodline Deep Earth ? 15:Earth Glide",' +
      '"sorcererFeatures.Bloodline Deep Earth ? 20:Strength Of Stone",' +
      '"sorcererFeatures.Bloodline Dreamspun ? 1:Lullaby",' +
      '"sorcererFeatures.Bloodline Dreamspun ? 3:Combat Precognition",' +
      '"sorcererFeatures.Bloodline Dreamspun ? 9:Dreamshaper",' +
      '"sorcererFeatures.Bloodline Dreamspun ? 15:Eye Of Somnus",' +
      '"sorcererFeatures.Bloodline Dreamspun ? 20:Solipsism",' +
      '"sorcererFeatures.Bloodline Protean ? 1:Protoplasm",' +
      '"sorcererFeatures.Bloodline Protean ? 3:Protean Resistances",' +
      '"sorcererFeatures.Bloodline Protean ? 9:Reality Wrinkle",' +
      '"sorcererFeatures.Bloodline Protean ? 15:Spatial Tear",' +
      '"sorcererFeatures.Bloodline Protean ? 20:Avatar Of Chaos",' +
      '"sorcererFeatures.Bloodline Serpentine ? 1:Serpent\'s Fang",' +
      '"sorcererFeatures.Bloodline Serpentine ? 3:Serpentfriend",' +
      '"sorcererFeatures.Bloodline Serpentine ? 9:Snakeskin",' +
      '"sorcererFeatures.Bloodline Serpentine ? 15:Den Of Vipers",' +
      '"sorcererFeatures.Bloodline Serpentine ? 20:Scaled Soul",' +
      '"sorcererFeatures.Bloodline Shadow ? 1:Shadowstrike",' +
      '"sorcererFeatures.Bloodline Shadow ? 3:Nighteye",' +
      '"sorcererFeatures.Bloodline Shadow ? 9:Shadow Well",' +
      '"sorcererFeatures.Bloodline Shadow ? 15:Enveloping Darkness",' +
      '"sorcererFeatures.Bloodline Shadow ? 20:Shadow Master (Sorcerer)",' +
      '"sorcererFeatures.Bloodline Starsoul ? 1:Minute Meteors",' +
      '"sorcererFeatures.Bloodline Starsoul ? 3:Voidwalker",' +
      '"sorcererFeatures.Bloodline Starsoul ? 9:Aurora Borealis",' +
      '"sorcererFeatures.Bloodline Starsoul ? 15:Breaching The Gulf",' +
      '"sorcererFeatures.Bloodline Starsoul ? 20:Starborn",' +
      '"sorcererFeatures.Bloodline Stormborn ? 1:Thunderstaff",' +
      '"sorcererFeatures.Bloodline Stormborn ? 3:Stormchild",' +
      '"sorcererFeatures.Bloodline Stormborn ? 9:Thunderbolt",' +
      '"sorcererFeatures.Bloodline Stormborn ? 15:Ride The Lightning",' +
      '"sorcererFeatures.Bloodline Stormborn ? 20:Storm Lord",' +
      '"sorcererFeatures.Bloodline Verdant ? 1:Tanglevine",' +
      '"sorcererFeatures.Bloodline Verdant ? 3:Photosynthesis",' +
      '"sorcererFeatures.Bloodline Verdant ? 9:Massmorph",' +
      '"sorcererFeatures.Bloodline Verdant ? 15:Rooting",' +
      '"sorcererFeatures.Bloodline Verdant ? 20:Shepherd Of The Trees" ' +
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
PFAPG.NPC_CLASSES = {
  'Antipaladin':
    'Require="alignment == \'Chaotic Evil\'" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Bluff,Craft,Disguise,"Handle Animal",Intimidate,' +
      '"Knowledge (Religion)",Profession,Ride,"Sense Motive",Spellcraft,' +
      'Stealth ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Aura Of Evil","1:Detect Good","1:Smite Good","2:Unholy Resilience",' +
      '"2:Touch Of Corruption","3:Aura Of Cowardice","3:Plague Bringer",' +
      '3:Cruelty,"4:Channel Negative Energy","5:Fiendish Boon",' +
      '"8:Aura Of Despair (Antipaladin)","11:Aura Of Vengeance",' +
      '"14:Aura Of Sin","17:Aura Of Depravity","20:Unholy Champion" ' +
    'Selectables=' +
      '"5:Fiendish Servant:Fiendish Boon","5:Fiendish Weapon:Fiendish Boon",' +
      '"3:Cruelty (Fatigued):Cruelty","3:Cruelty (Shaken):Cruelty",' +
      '"3:Cruelty (Sickened):Cruelty","6:Cruelty (Dazed):Cruelty",' +
      '"6:Cruelty (Diseased):Cruelty","6:Cruelty (Staggered):Cruelty",' +
      '"9:Cruelty (Cursed):Cruelty","9:Cruelty (Exhausted):Cruelty",' +
      '"9:Cruelty (Frightened):Cruelty","9:Cruelty (Nauseated):Cruelty",' +
      '"9:Cruelty (Poisoned):Cruelty","12:Cruelty (Blinded):Cruelty",' +
      '"12:Cruelty (Deafened):Cruelty","12:Cruelty (Paralyzed):Cruelty",' +
      '"12:Cruelty (Stunned):Cruelty" ' +
    'CasterLevelDivine="levels.Antipaladin >= 4 ? levels.Antipaladin - 3 : null" ' +
    'SpellAbility=Charisma ' +
    'SpellSlots=' +
      'Antipaladin1:4=0;5=1;9=2;13=3;17=4,' +
      'Antipaladin2:7=0;8=1;12=2;16=3;20=4,' +
      'Antipaladin3:10=0;11=1;15=2;19=3,' +
      'Antipaladin4:13=0;14=1;18=2;20=3',
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
      '"2:Easy March","4:Inspire Greatness",5:Banner,"6:Teamwork Feat",' +
      '"7:Demanding Challenge","8:Persistent Commands",' +
      '"9:Inspire Last Stand","10:Complex Commands" ' +
    'Selectables=' +
      '"1:Battle Magic:Inspiring Command",' +
      '"1:Inspire Hardiness:Inspiring Command",' +
      '"1:Inspired Tactics:Inspiring Command",' +
      '"1:Keep Your Heads:Inspiring Command",' +
      '"1:None Shall Fall:Inspiring Command",' +
      '"1:Pincer Maneuver:Inspiring Command",' +
      '"1:Rally:Inspiring Command",' +
      '"1:Reveille:Inspiring Command",' +
      '"1:Scatter:Inspiring Command",' +
      '"1:Shake It Off:Inspiring Command",' +
      '"1:Sound The Charge:Inspiring Command",' +
      '"features.Scatter ? 1:Sound The Retreat:Inspiring Command",' +
      '"1:Stand Firm (Battle Herald):Inspiring Command",' +
      '"1:Teamwork:Inspiring Command",' +
      '"1:Tuck And Roll:Inspiring Command"',
  'Holy Vindicator':
    'Require=' +
      '"baseAttack >= 5",' +
      '"features.Channel Energy",' +
      '"skills.Knowledge (Religion) >= 5",' +
      '"Sum \'features.(Alignment|Elemental) Channel\' > 0",' +
      '"casterLevelDivine >= 1" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,Heal,Intimidate,"Knowledge (Planes)","Knowledge (Religion)",' +
      'Ride,"Sense Motive",Spellcraft,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
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
      '"10:Master Of All Lands" ' +
    'Selectables=' +
      '"features.Terrain Mastery (Aligned Plane (Chaotic Evil)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Chaotic Evil)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Chaotic Good)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Chaotic Good)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Chaotic Neutral)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Chaotic Neutral)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Lawful Evil)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Lawful Evil)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Lawful Good)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Lawful Good)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Lawful Neutral)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Lawful Neutral)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Neutral Evil)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Neutral Evil)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Neutral Good)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Neutral Good)):Terrain Dominance",' +
      '"features.Terrain Mastery (Aligned Plane (Neutral)) ? ' +
        '3:Terrain Dominance (Aligned Plane (Neutral)):Terrain Dominance",' +
      '"features.Terrain Mastery (Astral Plane) ? ' +
        '3:Terrain Dominance (Astral Plane):Terrain Dominance",' +
      '"features.Terrain Mastery (Cold) ? ' +
        '3:Terrain Dominance (Cold):Terrain Dominance",' +
      '"features.Terrain Mastery (Desert) ? ' +
        '3:Terrain Dominance (Desert):Terrain Dominance",' +
      '"features.Terrain Mastery (Ethereal Plane) ? ' +
        '7:Terrain Dominance (Ethereal Plane):Terrain Dominance",' +
      '"features.Terrain Mastery (Forest) ? ' +
        '3:Terrain Dominance (Forest):Terrain Dominance",' +
      '"features.Terrain Mastery (Jungle) ? ' +
        '3:Terrain Dominance (Jungle):Terrain Dominance",' +
      '"features.Terrain Mastery (Mountain) ? ' +
        '3:Terrain Dominance (Mountain):Terrain Dominance",' +
      '"features.Terrain Mastery (Plains) ? ' +
        '3:Terrain Dominance (Plains):Terrain Dominance",' +
      '"features.Terrain Mastery (Plane Of Air) ? ' +
        '3:Terrain Dominance (Plane Of Air):Terrain Dominance",' +
      '"features.Terrain Mastery (Plane Of Earth) ? ' +
        '5:Terrain Dominance (Plane Of Earth):Terrain Dominance",' +
      '"features.Terrain Mastery (Plane Of Fire) ? ' +
        '3:Terrain Dominance (Plane Of Fire):Terrain Dominance",' +
      '"features.Terrain Mastery (Plane Of Water) ? ' +
        '3:Terrain Dominance (Plane Of Water):Terrain Dominance",' +
      '"features.Terrain Mastery (Swamp) ? ' +
        '5:Terrain Dominance (Swamp):Terrain Dominance",' +
      '"features.Terrain Mastery (Underground) ? ' +
        '3:Terrain Dominance (Underground):Terrain Dominance",' +
      '"features.Terrain Mastery (Urban) ? ' +
        '3:Terrain Dominance (Urban):Terrain Dominance",' +
      '"features.Terrain Mastery (Water) ? ' +
        '3:Terrain Dominance (Water):Terrain Dominance",' +
      '"2:Terrain Mastery (Aligned Plane (Chaotic Evil)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Chaotic Good)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Chaotic Neutral)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Lawful Evil)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Lawful Good)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Lawful Neutral)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Neutral Evil)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Neutral Good)):Terrain Mastery",' +
      '"2:Terrain Mastery (Aligned Plane (Neutral)):Terrain Mastery",' +
      '"2:Terrain Mastery (Astral Plane):Terrain Mastery",' +
      '"2:Terrain Mastery (Cold):Terrain Mastery",' +
      '"2:Terrain Mastery (Desert):Terrain Mastery",' +
      '"2:Terrain Mastery (Ethereal Plane):Terrain Mastery",' +
      '"2:Terrain Mastery (Forest):Terrain Mastery",' +
      '"2:Terrain Mastery (Jungle):Terrain Mastery",' +
      '"2:Terrain Mastery (Mountain):Terrain Mastery",' +
      '"2:Terrain Mastery (Plains):Terrain Mastery",' +
      '"2:Terrain Mastery (Plane Of Air):Terrain Mastery",' +
      '"2:Terrain Mastery (Plane Of Earth):Terrain Mastery",' +
      '"2:Terrain Mastery (Plane Of Fire):Terrain Mastery",' +
      '"2:Terrain Mastery (Plane Of Water):Terrain Mastery",' +
      '"2:Terrain Mastery (Swamp):Terrain Mastery",' +
      '"2:Terrain Mastery (Underground):Terrain Mastery",' +
      '"2:Terrain Mastery (Urban):Terrain Mastery",' +
      '"2:Terrain Mastery (Water):Terrain Mastery"',
  'Master Chymist':
    'Require=' +
      '"spellSlots.Alchemist3 >= 1",' +
      'features.Mutagen,"features.Feral Mutagen || features.Infuse Mutagen" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Climb,"Escape Artist",Intimidate,' +
      '"Knowledge (Dungeoneering)","Sense Motive",Stealth,Swim ' +
    'Features=' +
      '1:Bomb-Thrower,"1:Mutagenic Form",1:Mutate,"2:Advanced Mutagen",' +
      '"2:Caster Level Bonus",3:Brutality ' +
    'Selectables=' +
      '"2:Burly:Advanced Mutagen",' +
      '"2:Disguise:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Black) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Blue) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Green) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Red) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (White) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Brass) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Bronze) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Copper) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Gold) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Form Of The Dragon I(Alchemist6 Tran) ? 2:Draconic (Silver) Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 10 ? 2:Dual Mind:Advanced Mutagen",' +
      '"2:Evasion (Master Chymist):Advanced Mutagen",' +
      '"2:Extended Mutagen:Advanced Mutagen",' +
      '"2:Feral Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 11/features.Feral Mutagen ? 2:Furious Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16 ? 2:Grand Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 12 ? 2:Greater Mutagen:Advanced Mutagen",' +
      '"effectiveAlchemistLevel >= 16/spells.Enlarge Person(Alchemist1 Tran) || spells.Giant Form I(Alchemist6 Tran) || spells.Polymorph(Alchemist5 Tran) ? 2:Growth Mutagen:Advanced Mutagen",' +
      '"2:Night Vision (Master Chymist):Advanced Mutagen",' +
      '"2:Nimble:Advanced Mutagen",' +
      '"2:Restoring Change:Advanced Mutagen",' +
      '"2:Scent (Master Chymist):Advanced Mutagen"',
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
      '"1:Art Of Deception","1:Master Of Disguise (Master Spy)",' +
      '"1:Sneak Attack","2:Glib Lie","2:Mask Alignment","3:Nonmagical Aura",' +
      '"3:Superficial Knowledge","4:Concealed Thoughts",' +
      '"4:Quick Change (Master Spy)","5:Elude Detection","5:Slippery Mind",' +
      '"6:Shift Alignment","8:Death Attack","8:Fool Casting","9:Hidden Mind",' +
      '10:Assumption',
  'Nature Warden':
    'Require=' +
      '"baseAttack >= 4",' +
      '"features.Animal Companion","features.Favored Terrain",' +
      '"features.Wild Empathy",' +
      '"skills.Handle Animal >= 5","skills.Knowledge (Geography) >= 5",' +
      '"skills.Knowledge (Nature) >= 5","skills.Survival >= 5",' +
      'hasLevel2DivineSpells ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,"Handle Animal",Heal,"Knowledge (Geography)",' +
      '"Knowledge (Nature)",Perception,Ride,"Sense Motive",Survival,Swim ' +
    'Features=' +
      '"1:Companion Bond (Nature Warden)","1:Natural Empathy",' +
      '"2:Mystic Harmony","2:Wild Stride","2:Caster Level Bonus",' +
      '"3:Animal Speech",4:Silverclaw,"5:Favored Terrain",' +
      '"5:Survivalist (Nature Warden)",6:Woodforging,"7:Companion Walk",' +
      '"7:Plant Speech",8:Ironpaw,' +
      '"9:Guarded Lands","10:Companion Soul"',
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
      '"features.Armor Proficiency (Medium) || features.Armor Proficiency (Heavy)" ' +
    'HitDie=d12 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Acrobatics,Climb,Intimidate,Perception,"Sense Motive" ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Tower Shield Proficiency","1:Weapon Proficiency (Martial)",' +
      '"1:Armor Class Bonus (Stalwart Defender)","1:Defensive Stance",' +
      '"2:Defensive Powers","3:Uncanny Dodge","5:Damage Reduction",' +
      '"7:Improved Uncanny Dodge","9:Mobile Defense","10:Last Word" ' +
    'Selectables=' +
      '"2:Bulwark:Defensive Power",' +
      '"2:Clear Mind:Defensive Power",' +
      '"4:Fearless Defense:Defensive Power",' +
      '"features.Bulwark ? 2:Halting Blow:Defensive Power",' +
      '"4:Immobile:Defensive Power",' +
      '"6:Increased Damage Reduction:Defensive Power",' +
      '"2:Intercept:Defensive Power",' +
      '"2:Internal Fortitude:Defensive Power",' +
      '"6:Mighty Resilience:Defensive Power",' +
      '"2:Renewed Defense:Defensive Power",' +
      '"2:Roused Defense:Defensive Power",' +
      '"2:Smash (Stalwart Defender):Defensive Power",' +
      '"4:Unexpected Strike:Defensive Power"'
};
PFAPG.DEITIES = {
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
  rules.defineRule
    ('animalCompanionStats.Melee.1', 'eidolonEvolutionsDamage', '=', null);
  rules.defineRule
    ('animalCompanionStats.Melee.2', 'features.Eidolon', '=', '""');
  // Quilvyn doesn't support rules that use concatenation to build a value, so
  // we place the various evolution damage values into a global array, then use
  // join to create the final value.
  rules.defineRule('eidolonEvolutionsDamage',
    'features.Eidolon', '?', '(PFAPG.EED = []) || true',
    'features.Bite Evolution', '=', 'PFAPG.EED.push("%{eidolonDamage}%{eidolonBiteDamageBonus}") && PFAPG.EED.join(",")',
    'features.Claws Evolution', '=', 'PFAPG.EED.push((2 * source) + "@%{eidolonDamageMinor}%{eidolonPrimaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Gore Evolution', '=', 'PFAPG.EED.push("%{eidolonDamage}%{eidolonPrimaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Pincers Evolution', '=', 'PFAPG.EED.push((2 * source) + "@%{eidolonDamage}%{eidolonSecondaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Rake Evolution', '=', 'PFAPG.EED.push("2@%{eidolonDamageMinor}%{eidolonPrimaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Slam Evolution', '=', 'PFAPG.EED.push((source>1 ? source + "@" : "") + "%{eidolonDamageMajor}%{eidolonPrimaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Sting Evolution', '=', 'PFAPG.EED.push((source>1 ? source + "@" : "") + "%{eidolonDamageMinor}%{eidolonPrimaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Tail Slap Evolution', '=', 'PFAPG.EED.push((source>1 ? source + "@" : "") + "%{eidolonDamage}%{eidolonSecondaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Tentacle Evolution', '=', 'PFAPG.EED.push((source>1 ? source + "@" : "") + "%{eidolonDamageMinor}%{eidolonSecondaryDamageBonus}") && PFAPG.EED.join(",")',
    'features.Wing Buffet Evolution', '=', 'PFAPG.EED.push("%{eidolonDamageMinor}%{eidolonSecondaryDamageBonus}") && PFAPG.EED.join(",")'
  );
};

/* Defines rules related to combat. */
PFAPG.combatRules = function(rules, armors, shields, weapons) {
  Pathfinder.combatRules(rules, armors, shields, weapons);
  // Remove crit info for mancatcher--it doesn't crit
  delete rules.choices.notes['weapons.Mancatcher'];
  rules.defineChoice('notes', 'weapons.Mancatcher:%V (%1 %2%3)');
  rules.defineChoice('notes',
    'damageReduction.Adamantine:%V/%N',
    'damageReduction.Piercing:%V/%N'
  );
};

/* Defines rules related to basic character identity. */
PFAPG.identityRules = function(
  rules, alignments, classes, deities, factions, paths, races, tracks, traits,
  prestigeClasses, npcClasses
) {
  let newClasses = Object.assign({}, classes);
  for(let c in classes) {
    if(!QuilvynUtils.getAttrValue(classes[c], 'HitDie')) {
      let features = QuilvynUtils.getAttrValueArray(classes[c], 'Features');
      let selectables =
        QuilvynUtils.getAttrValueArray(classes[c], 'Selectables');
      QuilvynRules.featureListRules(rules, features, c, 'levels.' + c, false);
      QuilvynRules.featureListRules(rules, selectables, c, 'levels.' + c, true);
      delete newClasses[c];
    }
  }
  // PFAPG defines no new races, but this code supports the possibility anyway
  let newRaces = Object.assign({}, races);
  for(let race in races) {
    if(!QuilvynUtils.getAttrValue(races[race], 'Features')) {
      let selectables =
        QuilvynUtils.getAttrValueArray(races[race], 'Selectables');
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
    // Create an invisible selectable feature that consumes the excess
    // evolution points required for some evolutions.
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
    // Override consumption values for a few evolutions that consume a
    // different value with multiple selections.
    rules.defineRule('selectableFeatures.excessEvolutionPoints',
      'selectableFeatures.Summoner - Flight Evolution', '+=', '1',
      'selectableFeatures.Summoner - Damage Reduction Evolution', '+=', '2 + source - 1',
      'selectableFeatures.Summoner - Breath Weapon Evolution', '+=', '3',
      'selectableFeatures.Summoner - Fast Healing Evolution', '+=', '3 + source - 1',
      'selectableFeatures.Summoner - Large Evolution', '+=', '3 + (source - 1) * 5'
    );
  }
  for(let clas in classes)
    PFAPG.classRulesExtra(rules, clas);
  for(let clas in prestigeClasses)
    PFAPG.classRulesExtra(rules, clas);
  for(let clas in npcClasses)
    PFAPG.classRulesExtra(rules, clas);
  // Append subdomains to each deity's list of domains
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
  for(let race in races)
    PFAPG.raceRulesExtra(rules, race);
};

/* Defines rules related to magic use. */
PFAPG.magicRules = function(rules, schools, spells, spellsLevels) {
  Pathfinder.magicRules(rules, schools, {}, {});
  let allSpells = Object.assign({}, spells, spellsLevels);
  for(let s in allSpells) {
    let attrs = allSpells[s];
    if(!attrs.includes('School=')) {
      if(!(s in Pathfinder.SPELLS)) {
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
        (rules.getChoices('selectableFeatures') != null &&
         ('Cleric - ' + group + ' Subdomain') in rules.getChoices('selectableFeatures')) ||
        PFAPG.CLASSES.Cleric.includes(group + ' Subdomain');
      Pathfinder.spellRules
        (rules, fullName, school, group, level, description, domainSpell,
         liquids);
      rules.addChoice('spells', fullName, attrs);
    }
  }
  for(let school in schools)
    PFAPG.schoolRulesExtra(rules, school);
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
  let featureReplacements = null;

  if(name == 'Alchemist') {

    rules.defineRule('combatNotes.bomb',
      // Master Chymist level does not change bombs/dy
      classLevel, '=', null,
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.fastHealing', classLevel, '+=', '5');
    rules.defineRule('effectiveAlchemistLevel', classLevel, '=', null);
    rules.defineRule('featureNotes.discovery',
      classLevel, '=', 'Math.floor(source / 2) + (source==20 ? 1 : 0)'
    );
    rules.defineRule('features.Throw Anything',
      'featureNotes.throwAnything(Alchemist)', '=', '1'
    );
    rules.defineRule('magicNotes.feralMutagen',
      '', '=', '6',
      'features.Small', '+', '-2'
    );
    rules.defineRule('magicNotes.feralMutagen.1',
      '', '=', '8',
      'features.Small', '+', '-2'
    );
    rules.defineRule
      ('magicNotes.mutagen', 'effectiveAlchemistLevel', '=', 'source * 10');
    rules.defineRule('saveNotes.poisonResistance',
      classLevel, '=', 'source<10 ? "Resistance " + (source>=8 ? 6 : source>=6 ? 4 : 2) : "Immune"'
    );
    rules.defineRule('selectableFeatureCount.Alchemist (Discovery)',
      'featureNotes.discovery', '=', null
    );
    rules.defineRule('selectableFeatureCount.Alchemist (Grand Discovery)',
      'featureNotes.grandDiscovery', '=', '1'
    );
    rules.defineRule('skillNotes.alchemy', classLevel, '=', null);
    Pathfinder.weaponRules(rules, 'Bomb', 'Exotic', 'Ranged', '1d6', 20, 2, 20);
    // Remove crit info for bomb--it doesn't crit
    delete rules.choices.notes['weapons.Bomb'];
    rules.defineChoice('notes', 'weapons.Bomb:%V (%1 %2%3)');
    rules.defineRule('bombDamageDice',
      'effectiveAlchemistLevel', '=', 'Math.floor((source + 1) / 2) + "d6"'
    );
    rules.defineRule('bombDamageModifier', 'intelligenceModifier', '=', null);
    rules.defineRule('weapons.Bomb', 'effectiveAlchemistLevel', '=', '1');

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
    rules.defineRule('bannerLevel', classLevel, '+=', null);
    rules.defineRule
      ('channelLevel', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('combatNotes.tactician',
      'tacticianLevel', '=', 'Math.floor(source / 5) + 1'
    );
    rules.defineRule('companionMasterLevel', classLevel, '^=', null);
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.mount', '=', '1');
    rules.defineRule
      ('featCount.Fighter', 'featureNotes.cavalierFeatBonus', '+=', null);
    rules.defineRule('featCount.Teamwork',
      'featureNotes.greaterTactician', '+=', '1',
      'featureNotes.masterTactician', '+=', '1',
      'featureNotes.tactician', '+=', '1'
    );
    rules.defineRule('featureNotes.cavalierFeatBonus',
      classLevel, '+=', 'Math.floor(source / 6)'
    );
    rules.defineRule('selectableFeatureCount.Cavalier (Order)',
      'featureNotes.order', '=', null
    );
    rules.defineRule('skillModifier.Ride', 'skillNotes.mount.1', '+', null);
    rules.defineRule('skillNotes.mount.1',
      'skillNotes.mount', '?', null,
      'skillNotes.armorSkillCheckPenalty', '=', null
    );
    rules.defineRule('tacticianLevel', classLevel, '=', null);
    let allFeats = rules.getChoices('feats');
    ['Mounted Combat', 'Skill Focus (Ride)', 'Spirited Charge', 'Trample',
     'Unseat'].forEach(f => {
      if(f in allFeats)
        allFeats[f] = allFeats[f].replace('Type=','Type="Order Of The Sword",');
    });
    // Order Of The Cockatrice
    rules.defineRule
      ('features.Dazzling Display', 'featureNotes.braggart', '=', '1');
    // Order Of The Shield
    rules.defineRule
      ('features.Stand Still', 'featureNotes.stemTheTide', '=', '1');
    // Order Of The Star
    rules.defineRule('magicNotes.calling',
      'magicNotes.calling.2', '=', 'source==1 ? "Channel Energy" : source==2 ? "Lay On Hands" : "Channel Energy and Lay On Hands"'
    );
    rules.defineRule('magicNotes.calling.1',
      'features.Calling', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.calling.2',
      'features.Calling', '?', null,
      'levels.Cleric', '+=', '1',
      'levels.Paladin', '+=', '2'
    );
    rules.defineRule
      ('magicNotes.layOnHands', 'magicNotes.calling.1', '+', null);
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.calling.1', '+', null);
    // Order Of The Sword
    rules.defineRule
      ('featCount.Order Of The Sword', 'featureNotes.mountedMastery', '=', '1');
    // Reversal of Ride armor penalty is handled by Mount feature
    rules.defineRule('skillModifier.Ride',
      'skillNotes.mountedMastery', '+', 'null' // italics no-op
    );

  } else if(name == 'Inquisitor') {

    let allDeities = rules.getChoices('deitys');
    for(let d in allDeities) {
       QuilvynUtils.getAttrValueArray(allDeities[d], 'Weapon').forEach(w => {
         rules.defineRule('inquisitorFeatures.Weapon Proficiency (' + w + ')',
           classLevel, '?', null,
           'deityFavoredWeapons', '=',
             'source.split("/").includes("' + w + '") ? 1 : null'
         );
         rules.defineRule('features.Weapon Proficiency (' + w + ')',
           'inquisitorFeatures.Weapon Proficiency (' + w + ')', '=', '1'
         );
       });
    }
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Inquisitor - .* Domain/)) {
        let domain = s.replace('Inquisitor - ', '').replace(' Domain', '');
        rules.defineRule('inquisitorDomainLevels.' + domain,
          'inquisitorFeatures.' + domain + ' Domain', '?', null,
          'levels.Inquisitor', '=', null
        );
        rules.defineRule('casterLevels.' + domain,
          'inquisitorDomainLevels.' + domain, '^=', null
        );
        rules.defineRule('inquisitorDomainLevel',
          'inquisitorDomainLevels.' + domain, '^=', null
        );
      }
    }
    rules.defineRule
      ('casterLevels.Domain', 'inquisitorDomainLevel', '^=', null);
    for(let level = 1; level <= 9; level++) {
      rules.defineRule('spellSlots.Domain' + level,
        'inquisitorDomainLevel', '+=', 'source>=' + (level * 2 - 1) + ' ? 1 : null'
      );
    }
    rules.defineRule('combatNotes.bane',
      '', '=', '2',
      'combatNotes.greaterBane', '+', '2'
    );
    rules.defineRule
      ('combatNotes.cunningInitiative', 'wisdomModifier', '=', null);
    rules.defineRule('featCount.Teamwork',
      'featureNotes.teamworkFeat(Inquisitor)', '+=', null
    );
    rules.defineRule('featureNotes.teamworkFeat(Inquisitor)',
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
    Pathfinder.featureSpells(rules,
      'Detect Alignment', 'Detection', 'charisma', classLevel, '',
      ['Detect Chaos', 'Detect Evil', 'Detect Good', 'Detect Law',
       '5:Discern Lies']
    );

  } else if(name == 'Oracle') {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.lame-1.1', '*', 'source.includes("armor") ? 0 : null'
    );
    rules.defineRule('abilityNotes.lame',
      '', '=', '-10',
      'features.Slow', '+', '5'
    );
    rules.defineRule('abilityNotes.lame-1.1',
      'features.Lame', '?', null,
      'mysteryLevel', '=', 'source>=10 ? " or armor" : ""'
    );
    rules.defineRule('combatNotes.deaf',
      'mysteryLevel', '=', 'source<5 ? -4 : source<10 ? -2 : null'
    );
    rules.defineRule('featureNotes.blindsense',
      'featureNote.cloudedVision.1', '^=', 'source.includes("30") ? 30 : null'
    );
    rules.defineRule('featureNotes.blindsight',
      'featureNote.cloudedVision.2', '^=', 'source.includes("15") ? 15 : null'
    );
    rules.defineRule('featureNotes.cloudedVision.1',
      'features.Clouded Vision', '?', null,
      'mysteryLevel', '=', 'source>=10 ? ", 30\' Blindsense" : ""'
    );
    rules.defineRule('featureNotes.cloudedVision.2',
      'features.Clouded Vision', '?', null,
      'mysteryLevel', '=', 'source>=15 ? ", 15\' Blindsight" : ""'
    );
    rules.defineRule('featureNotes.deaf.1',
      'features.Deaf', '?', null,
      'mysteryLevel', '=', 'source<10 ? \'\' : source<15 ? "/Has Scent feature" : "/Has Scent feature and 30\' Tremorsense"'
    );
    rules.defineRule('featureNotes.revelation',
      classLevel, '+=', 'Math.floor((source + 5) / 4)'
    );
    rules.defineRule('features.Blindsense',
      'featureNotes.cloudedVision.1', '=', 'source.includes("Blindsense") ? 1 : null'
    );
    rules.defineRule('features.Blindsight',
      'featureNotes.cloudedVision.2', '=', 'source.includes("Blindsight") ? 1 : null'
    );
    rules.defineRule('features.Scent',
      'featureNotes.deaf.1', '=', 'source.includes("Scent") ? 1 : null'
    );
    rules.defineRule('initiative', 'combatNotes.deaf', '+', null);
    rules.defineRule('languageCount', 'skillNotes.tongues', '+', null);
    rules.defineRule('magicNotes.haunted',
      'mysteryLevel', '=', '"<i>Mage Hand</i>, <i>Ghost Sound</i>" + (source>=5 ? ", <i>Levitate</i>, <i>Minor Image</i>" : "") + (source>=10 ? ", <i>Telekinesis</i>" : "") + (source>=15 ? "<i>, Reverse Gravity</i>" : "")'
    );
    rules.defineRule('mysteryLevel', classLevel, '+=', null);
    rules.defineRule('saveNotes.lame',
      'mysteryLevel', '=', 'source<5 ? null : source<15 ? "fatigued" : "fatigued and exhausted"'
    );
    rules.defineRule('selectableFeatureCount.Oracle (Curse)',
      "featureNotes.oracle'sCurse", '+=', '1'
    );
    rules.defineRule('selectableFeatureCount.Oracle (Mystery)',
      'featureNotes.mystery', '+=', '1'
    );
    let allSkills = rules.getChoices('skills');
    for(let s in allSkills) {
      if(s != 'Intimidate' && allSkills[s].match(/charisma/i))
        rules.defineRule('skillModifier.' + s, 'skillNotes.wasting', '+', '-4');
    }
    rules.defineRule
      ('skillNotes.tongues', 'mysteryLevel', '=', 'source<5 ? 1 : 2');
    rules.defineRule('skillNotes.tongues-1',
      'mysteryLevel', '=', 'source>=15 ? "understand and speak" : source>=10 ? "understand" : null'
    );
    rules.defineRule('speed', 'abilityNotes.lame', '+', null);
    let mysteries =
      Object.keys(rules.getChoices('selectableFeatures')).filter(x => x.match(/Oracle - .* Mystery/)).map(x => x.replace(/Oracle - (.*) Mystery/, '$1'));
    mysteries.forEach(m => {
      rules.defineRule('selectableFeatureCount.Oracle (' + m + ' Revelation)',
        'features.' + m + ' Mystery', '?', null,
        'featureNotes.revelation', '=', null
      );
    });
    // Battle Mystery
    rules.defineRule('featCount.General',
      'featureNotes.maneuverMastery', '+', null,
      'featureNotes.weaponMastery(Oracle)', '+', null
    );
    rules.defineRule('featureNotes.maneuverMastery',
      'mysteryLevel', '=', 'source>=11 ? 2 : source>=7 ? 1 : null'
    );
    rules.defineRule
      ('featureNotes.resiliency(Oracle)', 'mysteryLevel', '?', 'source >= 7');
    rules.defineRule('featureNotes.weaponMastery(Oracle)',
      'mysteryLevel', '=', 'source>=12 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule('featureNotes.weaponMastery(Oracle).1',
      'features.Weapon Mastery (Oracle)', '?', null,
      'mysteryLevel', '=', 'source>=12 ? ", Improved Critical, and Greater Weapon Focus" : source>=8 ? " and Improved Critical" : ""'
    );
    rules.defineRule('features.Armor Proficiency (Heavy)',
      'combatNotes.skillAtArms', '=', '1'
    );
    rules.defineRule
      ('features.Diehard', 'featureNotes.resiliency(Oracle)', '=', '1');
    rules.defineRule('features.Weapon Proficiency (Martial)',
      'combatNotes.skillAtArms', '=', '1'
    );
    Pathfinder.featureSpells(rules,
      'Iron Skin', 'IronSkin', 'charisma', 'mysteryLevel', null, ['Stoneskin']
    );
    // Suppress validation errors for Weapon Mastery and Maneuver Mastery feats
    for(let feat in rules.getChoices('feats')) {
      if(feat.match(/^((Greater )?Weapon Focus|Improved Critical)/)) {
        let note =
          'validationNotes.' + feat.charAt(0).toLowerCase() + feat.substring(1).replaceAll(' ', '') + 'Feat';
        rules.defineRule(note, 'featureNotes.weaponMastery(Oracle)', '^', '0');
      } else if(feat.match(/^(Greater|Improved) (Bull Rush|Dirty Trick|Disarm|Drag|Grapple|Overrun|Reposition|Steal|Sunder|Trip)/)) {
        let note =
          'validationNotes.' + feat.charAt(0).toLowerCase() + feat.substring(1).replaceAll(' ', '') + 'Feat';
        rules.defineRule(note, 'featureNotes.maneuverMastery', '^', '0');
      }
    }
    // Bones Mystery
    rules.defineRule('channelLevel', 'magicNotes.undeadServitude.1', '=', null);
    rules.defineRule
      ('features.Command Undead', 'features.Undead Servitude', '=', '1');
    rules.defineRule('magicNotes.undeadServitude',
      'charismaModifier', '=', '3 + source',
      'magicNotes.extraChannel', '+', '2'
    );
    rules.defineRule('magicNotes.undeadServitude.1',
      'features.Undead Servitude', '?', null,
      'mysteryLevel', '=', null
    );
    rules.defineRule('magicNotes.voiceOfTheGrave.1',
      'features.Voice Of The Grave', '?', null,
      'mysteryLevel', '=', 'source>=5 ? "; target suffers -" + Math.floor(source / 5) * 2 + " save" : ""'
    );
    rules.defineRule('validationNotes.extraChannelFeat',
      'features.Undead Servitude', '=', '0'
    );
    rules.defineRule('validationNotes.improvedChannelFeat',
      'features.Undead Servitude', '=', '0'
    );
    Pathfinder.featureSpells(rules,
      'Final Revelation (Bones Mystery)', 'BonesOracle', 'charisma',
      'mysteryLevel', '10+mysteryLevel//2+charismaModifier',
      ['Bleed', 'Stabilize', 'Animate Dead', 'Power Word Kill']
    );
    Pathfinder.featureSpells(rules,
      'Voice Of The Grave', 'VoiceOfTheGrave', 'charisma', 'mysteryLevel',
      '10+mysteryLevel//2+charismaModifier', ['Speak With Dead']
    );
    // Flame Mystery
    rules.defineRule('featureNotes.cinderDance',
      'mysteryLevel', '=', 'source>=10 ? "Nimble Moves and Acrobatic Steps features" : source>=5 ? "Nimble Moves feature" : null'
    );
    rules.defineRule('features.Acrobatic Steps',
      'featureNotes.cinderDance', '=', 'source.includes("Acrobatic Steps") ? 1 : null'
    );
    rules.defineRule('features.Nimble Moves',
      'featureNotes.cinderDance', '=', 'source.includes("Nimble Moves") ? 1 : null'
    );
    rules.defineRule('magicNotes.gazeOfFlames',
      'mysteryLevel', '=', 'source>=7 ? source : null'
    );
    Pathfinder.featureSpells(rules,
      'Form Of Flame', 'FormOfFlame', 'charisma', 'mysteryLevel', null,
      ['Elemental Body I', '9:Elemental Body II', '11:Elemental Body III',
       '13:Elemental Body IV']
    );
    // Heavens Mystery
    rules.defineRule('magicNotes.dwellerInDarkness',
      'mysteryLevel', '=', 'source>=17 ? "Weird" : "Phantasmal Killer"'
    );
    rules.defineRule
      ('magicNotes.lureOfTheHeavens', 'mysteryLevel', '?', 'source>=5');
    rules.defineRule('magicNotes.lureOfTheHeavens.1',
      'features.Lure Of The Heavens', '?', null,
      'mysteryLevel', '=', 'source>=10 ? ", <i>Fly</i> effects for " + source + " min/dy" : ""'
    );
    rules.defineRule('saveNotes.finalRevelation(HeavensMystery)',
      'charismaModifier', '=', null
    );
    Pathfinder.featureSpells(rules,
      'Dweller In Darkness', 'DwellerInDarkness', 'charisma', 'mysteryLevel',
      '10+mysteryLevel//2+charismaModifier', ['Phantasmal Killer', '17:Weird']
    );
    Pathfinder.featureSpells(rules,
      'Lure Of The Heavens', 'LureOfTheHeavens', 'charisma', 'mysteryLevel',
      null, ['Levitate', '10:Fly']
    );
    Pathfinder.featureSpells(rules,
      'Mantle Of Moonlight', 'MantleOfMoonlight', 'charisma', 'mysteryLevel',
      '10+mysteryLevel//2+charismaModifier', ['5:Rage']
    );
    Pathfinder.featureSpells(rules,
      'Star Chart', 'StarChart', 'charisma', 'mysteryLevel', null, ['Commune']
    );
    // Life Mystery
    rules.defineRule('channelLevel', 'featureNotes.channel.1', '+=', null);
    rules.defineRule
      ('features.Channel Energy', 'featureNotes.channel', '=', '1');
    rules.defineRule
      ('featureNotes.blindsight', 'featureNotes.lifesense', '^=', '30');
    rules.defineRule('featureNotes.channel.1',
      'features.Channel', '?', null,
      'mysteryLevel', '=', null
    );
    rules.defineRule('features.Blindsight', 'featureNotes.lifesense', '=', '1');
    // Oracle channeling gives two fewer uses/dy than Cleric
    rules.defineRule
      ('magicNotes.channelEnergy', 'featureNotes.channel', '+', '-2');
    // Lore Mystery
    // NOTE: This calculation works only if taken at lowest possible (7th) level
    rules.defineRule('abilityNotes.mentalAcuity',
      'mysteryLevel', '=', 'Math.floor((source - 4) / 3)'
    );
    rules.defineRule('combatNotes.sidestepSecret.1',
      'combatNotes.sidestepSecret', '?', null,
      'saveNotes.sidestepSecret', '?', null, // italics no-op
      'charismaModifier', '=', null,
      'dexterityModifier', '+', '-source',
      '', '^', '0'
    );
    rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
      'combatNotes.sidestepSecret.1', '+', null
    );
    rules.defineRule('magicNotes.whirlwindLesson.1',
      'features.Whirlwind Lesson', '?', null,
      'mysteryLevel', '=', 'source>=7 ? " and share with " + (source>=15 ? source + " others" : "1 other") + " for %2 dy" : ""'
    );
    rules.defineRule('magicNotes.whirlwindLesson.2',
      'features.Whirlwind Lesson', '?', null,
      'charismaModifier', '=', null
    );
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
    Pathfinder.featureSpells(rules,
      'Automatic Writing', 'AutomaticWriting', 'charisma', 'mysteryLevel',
      null, ['Augury', '5:Divination', '8:Commune']
    );
    Pathfinder.featureSpells(rules,
      'Final Revelation (Lore Mystery)', 'LoreOracle', 'charisma',
      'mysteryLevel', null, ['Wish']
    );
    Pathfinder.featureSpells(rules,
      'Spontaneous Symbology', 'SpontaneousSymbology', 'charisma',
      'mysteryLevel', '10+mysteryLevel//2+charismaModifier',
      ['Symbol Of Death', 'Symbol Of Fear', 'Symbol Of Insanity',
       'Symbol Of Pain', 'Symbol Of Persuasion', 'Symbol Of Sleep',
       'Symbol Of Stunning', 'Symbol Of Weakness']
    );
    // Nature Mystery
    rules.defineRule
      ('animalCompanionStats.Int', 'featureNotes.bondedMount', '^', '6');
    rules.defineRule("combatNotes.nature'sWhispers",
      'charismaModifier', '=', null,
      'dexterityModifier', '+', '-source'
    );
    rules.defineRule('companionOracleLevel',
      'oracleFeatures.Bonded Mount', '?', null,
      'mysteryLevel', '=', null
    );
    rules.defineRule
      ('companionMasterLevel', 'companionOracleLevel', '^=', null);
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.bondedMount', '=', '1');
    Pathfinder.featureSpells(rules,
      'Transcendental Bond', 'TranscendentalBond', 'charisma', 'mysteryLevel',
      null, ['Telepathic Bond']
    );
    // Stone Mystery
    rules.defineRule
      ('abilityNotes.earthGlide', 'mysteryLevel', '=', 'source + " min"');
    rules.defineRule('abilityNotes.earthGlide.1',
      'features.Earth Glide', '?', null,
      'mysteryLevel', '=', '""'
    );
    rules.defineRule('featureNotes.stoneStability',
      'mysteryLevel', '=', 'source<5 ? null : source<10 ? "Improved Trip feature" : "Improved Trip and Greater Trip features"'
    );
    rules.defineRule('features.Greater Trip',
      'featureNotes.stoneStability', '=', 'source.includes("Greater Trip") ? 1 : null'
    );
    rules.defineRule('features.Improved Trip',
      'featureNotes.stoneStability', '=', 'source.includes("Improved Trip") ? 1 : null'
    );
    // Waves Mystery
    rules.defineRule('abilityNotes.fluidTravel.1',
      'features.Fluid Travel', '?', null,
      'mysteryLevel', '=', 'source>=7 ? " or breathe water and swim 60\'/rd underwater" : ""'
    );
    rules.defineRule('featureNotes.fluidNature',
      'mysteryLevel', '=', 'source>=5 ? "Dodge feature" : null'
    );
    rules.defineRule('features.Dodge',
      'featureNotes.fluidNature', '=', 'source.includes("Dodge") ? 1 : null'
    );
    rules.defineRule('magicNotes.waterSight',
      'mysteryLevel', '=', 'source>=15 ? "Greater Scrying" : source>=7 ? "Scrying" : null'
    );
    Pathfinder.featureSpells(rules,
      'Punitive Transformation', 'PunitiveTransformation', 'charisma',
      'mysteryLevel', '10+mysteryLevel//2+charismaModifier',
      ['Baleful Polymorph']
    );
    Pathfinder.featureSpells(rules,
      'Water Form', 'WaterForm', 'charisma', 'mysteryLevel', null,
      ['Elemental Body I', '9:Elemental Body II', '11:Elemental Body III',
       '13:Elemental Body IV']
    );
    Pathfinder.featureSpells(rules,
      'Water Sight', 'WaterSight', 'charisma', 'mysteryLevel',
      '10+mysteryLevel//2+charismaModifier', ['Scrying', '15:Greater Scrying']
    );
    // Wind Mystery
    rules.defineRule('magicNotes.windSight',
      'mysteryLevel', '=', 'source>=7 ? source : null'
    );
    Pathfinder.featureSpells(rules,
      'Gaseous Form', 'GaseousForm', 'charisma', 'mysteryLevel', null,
      ['Gaseous Form']
    );
    Pathfinder.featureSpells(rules,
      'Invisibility', 'Invisibility', 'charisma', 'mysteryLevel', null,
      ['Invisibility', '9:Greater Invisibility']
    );
    Pathfinder.featureSpells(rules,
      'Wind Sight', 'WindSight', 'charisma', 'mysteryLevel', null,
      ['7:Clairaudience/Clairvoyance']
    );

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
      'companionNotes.largeEvolution.5', '+', null,
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
    rules.defineRule('animalCompanionStats.Speed',
      'companionNotes.limbs(Legs)Evolution.1', '+', null
    );
    rules.defineRule('animalCompanionStats.Str',
      'eidolonMasterLevel', '+', 'Math.floor(source / 5) + Math.floor((source + 3) / 5) - Math.floor(source / 3)',
      'companionNotes.largeEvolution.1', '+', null,
      'companionNotes.smallEidolon', '+', '-4'
    );
    rules.defineRule
      ('animalCompanionStats.Tricks', 'eidolonMasterLevel', 'v', '0');
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
      'summonerFeatures.Ability Increase Evolution', '=', 'source==1 ? "ability" : "abilities"'
    );
    rules.defineRule('companionNotes.breathWeaponEvolution',
      'summonerFeatures.Breath Weapon Evolution', '=', null
    );
    rules.defineRule('companionNotes.burrowEvolution',
      'eidolonSpeed', '=', 'Math.floor(source / 2)'
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
      // The first selection gives base speed; additional +20
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
      'summonerFeatures.Large Evolution', '=', 'source * -2'
    );
    rules.defineRule('companionNotes.largeEvolution.6',
      'summonerFeatures.Large Evolution', '=', 'source * -1'
    );
    rules.defineRule('companionNotes.largeEvolution.7',
      'summonerFeatures.Large Evolution', '=', 'source * -2'
    );
    rules.defineRule('companionNotes.largeEvolution.8',
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
      'summonerFeatures.Tail Evolution', '=', 'source * 2'
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
    rules.defineRule('eidolonNaturalAttacksAvailable',
      classLevel, '=', '3 + Math.floor((source + 1) / 5)'
    );
    rules.defineRule('eidolonNaturalAttacksChosen',
      'features.Bite Evolution', '+=', '1',
      'features.Claws Evolution', '+=', '1',
      'features.Gore Evolution', '+=', '1',
      'features.Pincers Evolution', '+=', '1',
      'features.Rake Evolution', '+=', '1',
      'features.Slam Evolution', '+=', '1',
      'features.Sting Evolution', '+=', '1',
      'features.Tail Slap Evolution', '+=', '1',
      'features.Tentacle Evolution', '+=', '1',
      'features.Wing Buffet Evolution', '+=', '1'
    );
    rules.defineRule('eidolonBiteDamageBonus',
      'eidolonBiteDamageBonus.1', '=', 'source!=0 ? QuilvynUtils.signed(Math.floor(source)) : ""',
      'eidolonSingleDamageBonus', '=', 'source!=0 ? QuilvynUtils.signed(source) : ""'
    );
    rules.defineRule('eidolonBiteDamageBonus.1',
      'features.Bite Evolution', '=', 'source<2 ? 1 : 1.5',
      'animalCompanionStats.Str', '*', 'Math.floor((source-10)/2)'
    );
    rules.defineRule('eidolonPrimaryDamageBonus',
      'features.Eidolon', '?', null,
      'animalCompanionStats.Str', '=', 'source<10||source>11 ? QuilvynUtils.signed(Math.floor((source-10)/2)) : ""',
      'eidolonSingleDamageBonus', '=', 'source!=0 ? QuilvynUtils.signed(source) : ""'
    );
    rules.defineRule('eidolonSecondaryDamageBonus',
      'features.Eidolon', '?', null,
      'animalCompanionStats.Str', '=', 'source<10||source>13 ? QuilvynUtils.signed(Math.floor((source-10)/4)) : ""',
      'eidolonSingleDamageBonus', '=', 'source!=0 ? QuilvynUtils.signed(source) : ""'
    );
    rules.defineRule('eidolonSingleDamageBonus',
      'eidolonNaturalAttacksChosen', '?', 'source<2',
      'animalCompanionStats.Str', '=', 'source>13 ? Math.floor(Math.floor((source - 10) / 2) * 1.5) : null'
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
      // Note that the free legs evolution gives biped +10 and quad +20
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
    rules.defineRule('magicNotes.summonMonster',
      classLevel, '=', '["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][Math.min(Math.floor((source - 1) / 2), 8)]'
    );
    rules.defineRule('selectableFeatureCount.Summoner (Evolution)',
      classLevel, '=', 'source + 2 + Math.floor((source + 1) / 5)'
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
    QuilvynRules.validAllocationRules(
      rules, 'eidolonNaturalAttacks', 'eidolonNaturalAttacksAvailable',
      'eidolonNaturalAttacksChosen'
    );
    // Suppress error for allocating fewer than max natural attacks
    rules.defineRule
      ('validationNotes.eidolonNaturalAttacksAllocation', '', '^', '0');
    Pathfinder.featureSpells(rules,
      "Maker's Call", 'MakersCall', 'charisma', classLevel, null,
      ['Dimension Door']
    );
    // Make sure the editor allows multiple selections of selectableFeatures
    rules.defineEditorElement('selectableFeatures');
    rules.defineEditorElement
      ('selectableFeatures', 'Selectable Features', 'setbag',
       'selectableFeatures', 'skills');

  } else if(name == 'Witch') {

    rules.defineRule('familiarMasterLevel', classLevel, '+=', null);
    rules.defineRule
      ('featureNotes.hex', classLevel, '=', 'Math.floor(source / 2) + 1');
    rules.defineRule
      ('features.Brew Potion', 'featureNotes.cauldronHex', '=', '1');
    rules.defineRule
      ('features.Familiar', "featureNotes.witch'sFamiliar", '=', '1');
    rules.defineRule('hexDC',
      classLevel, '=', '10 + Math.floor(source / 2)',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('magicNotes.flightHex.1',
      'features.Flight Hex', '?', null,
      classLevel, '=', '(source>=3 ? ", self <i>Levitate</i> 1/dy" : "") + (source>=5 ? ", self <i>Fly</i> effects %{' + classLevel + '} min/dy" : "")'
    );
    rules.defineRule
      ('selectableFeatureCount.Witch (Hex)', 'featureNotes.hex', '+=', null);
    rules.defineRule('selectableFeatureCount.Witch (Patron)',
      'featureNotes.patron', '+=', '1'
    );
    Pathfinder.featureSpells(rules,
      'Disguise Hex', 'DisguiseHex', 'intelligence', classLevel, null,
      ['Disguise Self']
    );
    Pathfinder.featureSpells(rules,
      'Flight Hex', 'FlightHex', 'intelligence', classLevel, null,
      ['Feather Fall', '3:Levitate', '5:Fly']
    );
    Pathfinder.featureSpells(rules,
      'Forced Reincarnation Hex', 'ForcedReincarnationHex', 'intelligence',
      classLevel, null, ['Reincarnate']
    );
    Pathfinder.featureSpells(rules,
      "Hag's Eye Hex", "HagsEyeHex", 'intelligence', classLevel,
      '10+' + classLevel + '//2+intelligenceModifier', ['Arcane Eye']
    );
    Pathfinder.featureSpells(rules,
      'Healing Hex', 'HealingHex', 'intelligence', classLevel, null,
      ['Cure Light Wounds', '5:Cure Moderate Wounds']
    );
    Pathfinder.featureSpells(rules,
      'Life Giver Hex', 'LifeGiverHex', 'intelligence', classLevel, null,
      ['Resurrection']
    );
    Pathfinder.featureSpells(rules,
      'Major Healing Hex', 'MajorHealingHex', 'intelligence', classLevel,
      null, ['Cure Serious Wounds', '15:Cure Critical Wounds']
    );
    Pathfinder.featureSpells(rules,
      'Natural Disaster Hex', 'NaturalDisasterHex', 'intelligence',
      classLevel, '10+' + classLevel + '//2+intelligenceModifier',
      ['Earthquake', 'Storm Of Vengeance']
    );
    Pathfinder.featureSpells(rules,
      'Nightmares Hex', 'NightmaresHex', 'intelligence', classLevel,
      '10+' + classLevel + '//2+intelligenceModifier', ['Nightmare']
    );
    Pathfinder.featureSpells(rules,
      'Slumber Hex', 'SlumberHex', 'intelligence', classLevel, null, ['Sleep']
    );
    Pathfinder.featureSpells(rules,
      'Tongues Hex', 'TonguesHex', 'intelligence', classLevel, null,
      ['Comprehend Languages', '5:Tongues']
    );
    Pathfinder.featureSpells(rules,
      'Weather Control Hex', 'WeatherControlHex', 'intelligence', classLevel,
      null, ['Control Weather']
    );

  } else if(name == 'Barbarian') {

    rules.defineRule
      ('animalCompanionStats.Speed', 'companionNotes.fastRider', '+', '10');
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
    ['Damage Reduction', 'Fast Movement', 'Improved Uncanny Dodge',
     'Trap Sense', 'Uncanny Dodge'].forEach(f => {
      rules.defineRule('barbarianFeatures.' + f,
        'barbarianHas' + f.replaceAll(/ |-/g, ''), '?', null
      );
    });
    rules.defineRule('combatNotes.brawler',
      '', '=', '"Unarmed attack provokes no AOO and may inflict lethal damage"',
      'features.Improved Unarmed Strike', '=', '"Unarmed attacks inflict %{features.Small ? \'1d4\' : \'1d6\'}"'
    );
    rules.defineRule('combatNotes.invulnerability',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('combatNotes.invulnerability-1',
      'combatNotes.invulnerability', '=', 'source * 2'
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
      'combatNotes.greaterBeastTotem', '+', '2'
    );
    rules.defineRule('combatNotes.lesserBeastTotem.1',
      'features.Lesser Beast Totem', '?', null,
      '', '=', '2',
      'combatNotes.greaterBeastTotem', '+', '1'
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
    rules.defineRule
      ('combatNotes.sixthSense-1', classLevel, '=', 'Math.floor(source / 3)');
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
    rules.defineRule('featureNotes.blindsense',
      'featureNotes.keenSenses(Barbarian).3', '=', 'source.includes("30") ? 30 : null'
    );
    rules.defineRule('featureNotes.blindsight',
      'featureNotes.keenSenses(Barbarian).4', '=', 'source.includes("30") ? 30 : null'
    );
    rules.defineRule('featureNotes.keenSenses(Barbarian).1',
      'features.Keen Senses (Barbarian)', '?', null,
      classLevel, '=', 'source>=10 ? ", +60\' Darkvision" : ""'
    );
    rules.defineRule('featureNotes.keenSenses(Barbarian).2',
      'features.Keen Senses (Barbarian)', '?', null,
      classLevel, '=', 'source>=13 ? ", Scent" : ""'
    );
    rules.defineRule('featureNotes.keenSenses(Barbarian).3',
      'features.Keen Senses (Barbarian)', '?', null,
      classLevel, '=', 'source>=16 ? ", 30\' Blindsense" : ""'
    );
    rules.defineRule('featureNotes.keenSenses(Barbarian).4',
      'features.Keen Senses (Barbarian)', '?', null,
      classLevel, '=', 'source>=19 ? ", 30\' Blindsight" : ""'
    );
    rules.defineRule
      ('features.Animal Companion', 'featureNotes.bestialMount', '=', '1');
    rules.defineRule('features.Blindsense',
      'featureNotes.keenSenses(Barbarian).3', '=', 'source.includes("Blindsense") ? 1 : null'
    );
    rules.defineRule('features.Blindsight',
      'featureNotes.keenSenses(Barbarian).4', '=', 'source.includes("Blindsight") ? 1 : null'
    );
    rules.defineRule('features.Darkvision',
      'featureNotes.keenSenses(Barbarian).1', '=', 'source.includes("Darkvision") ? 1 : null'
    );
    rules.defineRule('features.Low-Light Vision',
      'featureNotes.keenSenses(Barbarian)', '=', '1'
    );
    rules.defineRule('features.Scent',
      'featureNotes.keenSenses(Barbarian).2', '=', 'source.includes("Scent") ? 1 : null'
    );
    rules.defineRule('saveNotes.energyResistance',
      'barbarianFeatures.Energy Resistance', '=', null
    );
    rules.defineRule('saveNotes.lesserChaosTotem',
      '', '=', '1',
      'features.Chaos Totem', '+', '1',
      'features.Greater Chaos Totem', '+', '1'
    );
    rules.defineRule
      ('selectableFeatureCount.Barbarian (Archetype)', classLevel, '=', '1');

  } else if(name == 'Bard') {

    featureReplacements = {
      'Bardic Knowledge':[
        'Arcane Strike', 'Heraldic Expertise', 'Eye For Detail',
        'Magical Talent', 'Master Of Deception', 'World Traveler', 'Streetwise'
      ],
      'Countersong':[
        'Rallying Cry', 'Improved Counterspell', 'Sea Shanty', 'Gladhanding'
      ],
      'Deadly Performance':['Spell Catching'],
      'Dirge Of Doom':['Glorious Epic', 'Spell Suppression'],
      'Fascinate':['Inspiring Blow'],
      'Frightening Tune':['Scandal', 'Metamagic Mastery (Bard)'],
      'Inspire Competence':[
        'Mockery', 'Trap Sense', 'Still Water', 'Harmless Performer'
      ],
      'Inspire Courage':[
        'Naturalist', 'Satire', 'Careful Teamwork', 'Dweomercraft',
        'Stealspell', 'Disappearing Act'
      ],
      'Inspire Greatness':[
        'True Confession', 'Dramatic Subtext', 'Madcap Prank'
      ],
      'Inspire Heroics':[
        'Show Yourselves', 'Greater Stealspell', 'Slip Through The Crowd'
      ],
      'Jack-Of-All-Trades':[
        'Arcane Armor', 'Wide Audience', 'Wand Mastery', 'Song Of The Fallen'
      ],
      'Lore Master':[
        'Arcane Bond (Bard)', 'Wide Audience', 'Sneak Attack', 'Quick Change'
      ],
      'Mass Suggestion':[
        'Mass Bladethirst', 'Pedantic Lecture', 'Mass Slumber Song',
        'Battle Song', 'Call The Storm'
      ],
      'Soothing Performance':['Berserkergang'],
      'Suggestion':[
        'Bladethirst', 'Lamentable Belaborment', 'Slumber Song', 'Incite Rage',
        'Whistle The Wind'
      ],
      'Versatile Performance':[
        // Easier to list Arcane Duelist and Archivist instead of features
        'Arcane Duelist', 'Archivist', 'Arcane Investigation',
        'Expanded Repertoire', 'Sneakspell', 'Familiar'
      ],
      'Well-Versed':[
        // Easier to list Arcane Duelist instead of features
        'Arcane Duelist', 'Magic Lore', 'Arcane Insight',
        'Extended Performance', 'Sea Legs'
      ]
    };

    rules.defineRule
      ('selectableFeatureCount.Bard (Archetype)', classLevel, '=', '1');
    // Arcane Duelist
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
    // Archivist
    // Archivists get Jack-Of-All-Trades and Lore Master early
    rules.defineRule('archivistLevel',
      'bardFeatures.Archivist', '?', null,
      'levels.Bard', '=', null
    );
    rules.defineRule('bardFeatures.Jack-Of-All-Trades',
      'archivistLevel', '=', 'source>=5 ? 1 : null'
    );
    rules.defineRule('bardFeatures.Lore Master',
      'archivistLevel', '=', 'source>=2 ? 1 : null'
    );
    rules.defineRule('skillNotes.jack-Of-All-Trades-1',
      'archivistLevel', '=', 'source>=11 ? 1 : null'
    );
    rules.defineRule('skillNotes.jack-Of-All-Trades.1',
      'archivistLevel', '=', 'source>=17 ? "; may take 10 on any skill" : ""'
    );
    rules.defineRule('skillNotes.loreMaster',
      'archivistLevel', '^=', 'Math.floor((source+4) / 6)'
    );
    // Court Bard
    rules.defineRule('skillNotes.heraldicExpertise',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    // Detective
    rules.defineRule('skillNotes.eyeForDetail',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.eyeForDetail-1',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    // Magician
    rules.defineRule('skillModifier.Knowledge (Arcana)',
      'skillNotes.magicalTalent', '+', 'null', // italics no-op
      'skillNotes.magicalTalent.1', '+', null
    );
    rules.defineRule('skillModifier.Spellcraft',
      'skillNotes.magicalTalent.1', '+', null
    );
    rules.defineRule('skillModifier.Use Magic Device',
      'skillNotes.magicalTalent.1', '+', null
    );
    rules.defineRule('skillNotes.magicalTalent.1',
      'features.Magical Talent', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    // Sandman
    rules.defineRule('sandmanLevel',
      'bardFeatures.Sandman', '?', null,
      classLevel, '=', null
    );
    rules.defineRule
      ('saveNotes.trapSense', classLevel, '+=', 'Math.floor(source / 3)');
    rules.defineRule('skillModifier.Bluff',
      'skillNotes.masterOfDeception', '+', 'null', // italics no-op
      'skillNotes.masterOfDeception.1', '+', null
    );
    rules.defineRule('skillModifier.Sleight Of Hand',
      'skillNotes.masterOfDeception.1', '+', null
    );
    rules.defineRule('skillModifier.Stealth',
      'skillNotes.masterOfDeception.1', '+', null
    );
    rules.defineRule('skillNotes.masterOfDeception.1',
      'features.Master Of Deception', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('sneakAttack', 'sandmanLevel', '=', 'Math.floor(source / 5)');
    // Savage Skald
    Pathfinder.featureSpells(rules,
      'Incite Rage', 'InciteRage', 'charisma', classLevel, '', ['Rage']
    );
    // Sea Singer
    rules.defineRule
      ('familiarMasterLevel', classLevel, '+=', 'source>=2 ? source : null');
    rules.defineRule('skillModifier.Knowledge (Geography)',
      'skillNotes.worldTraveler', '+', 'null', // italics no-op
      'skillNotes.worldTraveler.1', '+', null
    );
    rules.defineRule('skillModifier.Knowledge (Local)',
      'skillNotes.worldTraveler.1', '+', null
    );
    rules.defineRule('skillModifier.Knowledge (Nature)',
      'skillNotes.worldTraveler.1', '+', null
    );
    rules.defineRule('skillModifier.Linguistics',
      'skillNotes.worldTraveler.1', '+', null
    );
    rules.defineRule('skillNotes.worldTraveler.1',
      'features.World Traveler', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    Pathfinder.featureSpells(rules,
      'Call The Storm', 'CallTheStorm', 'charisma', classLevel, '',
      ['Control Water','Control Weather','Control Winds','Storm Of Vengeance']
    );
    Pathfinder.featureSpells(rules,
      'Whistle The Wind', 'WhistleTheWind', 'charisma', classLevel, null,
      ['Gust Of Wind']
    );
    // Street Performer
    rules.defineRule('skillNotes.streetwise',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    rules.defineRule('skillNotes.streetwise-1',
      classLevel, '=', 'Math.max(Math.floor(source / 2), 1)'
    );

  } else if(name == 'Cleric') {

    let subdomains = {
      'Air':['Cloud', 'Wind'],
      'Animal':['Feather', 'Fur'],
      'Artifice':['Construct', 'Toil'],
      'Chaos':['Azata Chaos', 'Demon Chaos', 'Protean'],
      'Charm':['Love', 'Lust'],
      'Community':['Family', 'Home'],
      'Darkness':['Loss', 'Night'],
      'Death':['Murder', 'Undead'],
      'Destruction':['Catastrophe', 'Rage'],
      'Earth':['Caves', 'Metal'],
      'Evil':['Daemon', 'Demon Evil', 'Devil Evil'],
      'Fire':['Ash', 'Smoke'],
      'Glory':['Heroism', 'Honor'],
      'Good':['Agathion', 'Archon Good', 'Azata Good'],
      'Healing':['Restoration', 'Resurrection'],
      'Knowledge':['Memory', 'Thought'],
      'Law':['Archon Law', 'Devil Law', 'Inevitable'],
      'Liberation':['Freedom', 'Revolution'],
      'Luck':['Curse', 'Fate'],
      'Madness':['Insanity', 'Nightmare'],
      'Magic':['Arcane', 'Divine'],
      'Nobility':['Leadership', 'Martyr'],
      'Plant':['Decay', 'Growth'],
      'Protection':['Defense', 'Purity'],
      'Repose':['Ancestors', 'Souls'],
      'Rune':['Language', 'Wards'],
      'Strength':['Ferocity', 'Resolve'],
      'Sun':['Day', 'Light'],
      'Travel':['Exploration', 'Trade'],
      'Trickery':['Deception', 'Thievery'],
      'War':['Blood', 'Tactics'],
      'Water':['Ice', 'Oceans'],
      'Weather':['Seasons', 'Storms']
    };
    for(let d in subdomains) {
      subdomains[d].forEach(s => {
        rules.defineRule('casterLevels.' + s,
          'features.' + s + ' Subdomain', '?', null,
          'levels.Cleric', '=', null
        );
        rules.defineRule
          ('clericDomainFeatures.' + d, 'casterLevels.' + s, '=', '1');
        rules.defineRule('casterLevels.' + d, 'casterLevels.' + s, '^=', null);
        // Clerics w/no deity don't need to match deity domain
        rules.defineRule('validationNotes.cleric-' + s.replaceAll(' ', '') + 'SubdomainSelectableFeature',
          'deity', '+', 'source == "None" ? 1 : null'
        );
      });
    }
    featureReplacements = {
      'Acid Dart':['Metal Fist'],
      'Acid Resistance':['Tunnel Runner'],
      'Agile Feet':['Door Sight', 'Silver-Tongued Haggler'],
      'Aura Of Protection':['Purifying Touch'],
      'Battle Rage':['Seize The Initiative'],
      'Bit Of Luck':['Malign Eye'],
      'Bleeding Touch':["Death's Kiss"],
      'Bramble Armor':['Aura Of Decay'],
      'Calming Touch':['Binding Ties'],
      'Charming Smile':['Anything To Please'],
      'Chaos Blade':['Aura Of Chaos'],
      'Cold Resistance':['Body Of Ice'],
      'Copycat':['Sudden Shift'],
      'Dancing Weapons':['Animate Servant', 'Aura Of Repetition'],
      'Dazing Touch':['Adoration'],
      "Death's Embrace":['Killing Blow'],
      'Destructive Aura':['Deadly Weather', 'Rage (Cleric)'],
      'Divine Presence':['Aura Of Heroism'],
      'Electricity Resistance':['Thundercloud'],
      'Eyes Of Darkness':['Aura Of Forgetfulness'],
      'Fire Resistance':['Wall Of Ashes'],
      'Fire Bolt':['Cloud Of Smoke'],
      "Freedom's Call":['Powerful Persuader'],
      'Gentle Rest':['Touch The Spirit World'],
      'Good Fortune':['Tugging Strands'],
      'Icicle':['Surge'],
      'Hand Of The Acolyte':['Arcane Beacon', 'Divine Vessel'],
      "Healer's Blessing":['Gift Of Life'],
      'Holy Lance':['Protective Aura', 'Aura Of Menace'],
      'Inspiring Word':['Inspiring Command (Cleric)'],
      'Leadership (Cleric)':['Sacrificial Bond'],
      'Liberation':["Liberty's Blessing"],
      'Lightning Arc':['Wind Blast'],
      'Lightning Lord':['Gale Aura'],
      'Lore Keeper':['Recall'],
      "Master's Illusion":['Thief Of The Gods'],
      'Might Of The Gods':['Bestow Resolve'],
      'Nimbus Of Light':["Day's Resurgence"],
      'Rebuke Death':['Restorative Touch'],
      'Remote Viewing':['Read Minds'],
      'Resistant Touch':['Deflection Aura'],
      'Scythe Of Evil':['Whispering Evil'],
      'Speak With Animals':['Eyes Of The Hawk', "Predator's Grace"],
      'Spell Rune':['Rune Shift', 'Warding Rune'],
      'Staff Of Order':['Aura Of Menace'],
      'Storm Burst':['Untouched By The Seasons'],
      'Strength Surge (Cleric)':['Ferocious Strike'],
      "Sun's Blessing":['Blinding Flash'],
      'Touch Of Chaos':["Elysium's Call", 'Fury Of The Abyss'],
      'Touch Of Darkness':['Night Hunter'],
      'Touch Of Evil':['Fury Of The Abyss', "Hell's Corruption"],
      'Touch Of Glory':['Honor Bound'],
      'Touch Of Good':["Elysium's Call"],
      'Touch Of Law':["Hell's Corruption", 'Command'],
      'Unity':['Guarded Hearth'],
      'Vision Of Madness':['Insane Focus', 'Fearful Touch'],
      'Ward Against Death':['Speak With Dead'],
      'Weapon Master':['Wounding Blade'],
      'Wooden Fist':['Enlarge'],
    };

    // Agathion
    Pathfinder.featureSpells(rules,
      'Protective Aura', 'ProtectiveAura', 'wisdom', 'casterLevels.Agathion',
      null, ['Protection From Evil']
    );
    // Catastrophe
    Pathfinder.featureSpells(rules,
      'Deadly Weather', 'DeadlyWeather', 'wisdom', 'casterLevels.Catastrophe',
      '', ['Call Lightning']
    );
    // Caves
    Pathfinder.featureSpells(rules,
      'Tunnel Runner', 'TunnelRunner', 'wisdom', 'casterLevels.Caves', null,
      ['Spider Climb']
    );
    // Construct
    Pathfinder.featureSpells(rules,
      'Animate Servant', 'AnimateServant', 'wisdom', 'casterLevels.Construct',
      null, ['Animate Objects']
    );
    // Feather
    rules.defineRule('skillNotes.eyesOfTheHawk',
      'casterLevels.Feather', '=', 'Math.max(Math.floor(source / 2), 1)'
    );
    // Inevitable
    Pathfinder.featureSpells(rules,
      'Command', 'Command', 'wisdom', 'casterLevels.Inevitable',
      '10+casterLevels.Inevitable//2+wisdomModifier', ['Command']
    );
    // Rage
    rules.defineRule('clericRagePowerLevel',
      'features.Rage (Cleric)', '?', null,
      'casterLevels.Rage', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('ragePowerLevel', 'clericRagePowerLevel', '+=', null);
    rules.defineRule('combatNotes.rage(Cleric).1',
      'features.Rage (Cleric)', '?', null,
      'casterLevels.Rage', '=', 'source>=16 ? 2 : source>=12 ? 1 : 0'
    );
    rules.defineRule
      ('featureNotes.ragePowers', 'combatNotes.rage(Cleric).1', '+=', null);
    rules.defineRule('features.Rage Powers',
      'combatNotes.rage(Cleric).1', '=', 'source>0 ? 1 : null'
    );
    // Suppress validation notes for barbarian powers
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
        'casterLevels.Rage', '+', 'source >= ' + level + ' ? 1 : null',
        '', 'v', '0' // Needed for multiclass Barbarian/Rage Cleric
      );
    });
    // Seasons
    Pathfinder.featureSpells(rules,
      'Untouched By The Seasons', 'UntouchedByTheSeasons', 'wisdom',
      'casterLevels.Seasons', null, ['Endure Elements']
    );

  } else if(name == 'Druid') {

    featureReplacements = {
      'A Thousand Faces':[
        'Deep Diver', 'Flurry Form', 'Plaguebearer', 'Dunemeld',
        'Verdant Sentinel', 'Mountain Stone', 'Evasion', 'Slippery',
        'Totemic Summons'
      ],
      'Nature Sense':['Cavesense'],
      "Resist Nature's Lure":[
        "Resist Ocean's Fury", 'Arctic Endurance', 'Miasma',
        'Resist Subterranean Corruption', 'Desert Endurance',
        'Torrid Endurance', 'Spire Walker', 'Savanna Ambush', 'Pond Scum',
        'Resist Temptation'
      ],
      'Spontaneous Druid Spell':['Spontaneous Casting'],
      'Trackless Step':[
        // Easier to list Blight/Swamp Druid rather than their features
        'Natural Swimmer', 'Icewalking', 'Blight Druid', 'Lightfoot',
        'Sandwalker', 'Jungle Druid', 'Sure-Footed (Druid)',
        'Run Like The Wind', 'Swamp Strider', 'Lorekeeper'
      ],
      'Venom Immunity':[
        'Seaborn', 'Snowcaster', 'Blightblooded', 'Shaded Vision',
        'Mountain Stance', 'Canny Charger', 'Mental Strength',
        'Animal Shaman Feat Bonus'
      ],
      'Wild Empathy':['Vermin Empathy'],
      'Woodland Stride':[
        'Aquatic Adaptation', 'Arctic Native', 'Tunnelrunner', 'Desert Native',
        'Mountaineer', 'Plains Traveler', 'Marshwight', 'Lorekeeper'
      ]
    };

    rules.defineRule('classSkills.Knowledge (Geography)',
      classLevel, '=', 'null',
      'druidHasKnowledgeGeography', '=', 'source==1 ? 1 : null'
    );
    rules.defineRule('druidHasKnowledgeGeography',
      classLevel, '=', '1',
      'druidFeatures.Cave Druid', '=', '0'
    );
    rules.defineRule('druidHasWoodlandStride',
      // Woodland Stride for a Jungle Druid is delayed rather than replaced
      'jungleDruidLevel', '=', 'source>=3 ? null : 0'
    );
    rules.defineRule('druidFeatures.A Thousand Faces',
      // Urban Druid gets ATF early
      'urbanDruidLevel', '=', 'source>=6 ? 1 : null'
    );
    rules.defineRule('druidFeatures.Wild Shape',
      'wildShapeLevel', '?', 'source >= 4'
    );

    rules.defineRule('jungleDruidLevel',
      'druidFeatures.Jungle Druid', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('urbanDruidLevel',
      'druidFeatures.Urban Druid', '?', null,
      classLevel, '=', null
    );
    rules.defineRule
      ('selectableFeatureCount.Druid (Archetype)', classLevel, '=', '1');
    // Extend Nature Bond validations w/APG restrictions
    rules.defineRule('validationNotes.druid-AnimalCompanionSelectableFeature',
      'druidFeatures.Blight Druid', '+', '-1',
      'druidFeatures.Urban Druid', '+', '-1'
    );
    rules.defineRule('validationNotes.druid-AirDomainSelectableFeature',
      'druidFeatures.Cave Druid', '+', '-1',
      'druidFeatures.Urban Druid', '+', '-1',
      'druidFeature.Animal Shaman', '+', '-1',
      'druidFeatures.Eagle Totem', '+', '1'
    );
    rules.defineRule('validationNotes.druid-AnimalDomainSelectableFeature',
      'druidFeatures.Urban Druid', '+', '-1'
    );
    rules.defineRule('validationNotes.druid-EarthDomainSelectableFeature',
      'druidFeatures.Urban Druid', '+', '-1',
      'druidFeature.Animal Shaman', '+', '-1',
      'druidFeatures.Bear Totem', '+', '1'
    );
    rules.defineRule('validationNotes.druid-FireDomainSelectableFeature',
      'druidFeatures.Urban Druid', '+', '-1',
      'druidFeature.Animal Shaman', '+', '-1'
    );
    rules.defineRule('validationNotes.druid-PlantDomainSelectableFeature',
      'druidFeatures.Urban Druid', '+', '-1',
      'druidFeature.Animal Shaman', '+', '-1'
    );
    rules.defineRule('validationNotes.druid-WaterDomainSelectableFeature',
      'druidFeatures.Urban Druid', '+', '-1',
      'druidFeature.Animal Shaman', '+', '-1',
      'druidFeature.Serpent Totem', '+', '1'
    );
    rules.defineRule('validationNotes.druid-WeatherDomainSelectableFeature',
      'druidFeatures.Cave Druid', '+', '-1',
      'druidFeature.Animal Shaman', '+', '-1',
      'druidFeature.Eagle Totem', '+', '1'
    );
    let allNotes = rules.getChoices('notes');
    allNotes['validationNotes.druid-AnimalCompanionSelectableFeature'] = 'Requires specific Druid archetype';
    ['Animal Companion', 'Air Domain', 'Animal Domain', 'Earth Domain',
     'Fire Domain', 'Plant Domain', 'Water Domain', 'Weather Domain'].forEach(d => {
      allNotes['validationNotes.druid-' + d.replaceAll(' ', '') + 'SelectableFeature'] =
        'Requires specific Druid archetype';
    });
    // Animal Shaman
    ['Bear', 'Eagle', 'Lion', 'Serpent', 'Wolf'].forEach(a => {
      rules.defineRule('featCount.' + a + ' Shaman',
        'features.' + a + ' Totem', '?', null,
        'featureNotes.animalShamanFeatBonus', '=', null
      );
    });
    rules.defineRule('featureNotes.animalShamanFeatBonus',
      classLevel, '=', 'Math.floor((source - 5) / 4)'
    );
    rules.defineRule('magicNotes.totemicSummons',
      'features.Bear Totem', '=', '"bear"',
      'features.Eagle Totem', '=', '"eagle, roc, or giant eagle"',
      'features.Lion Totem', '=', '"feline"',
      'features.Serpent Totem', '=', '"snake"',
      'features.Wolf Totem', '=', '"canine"'
    );
    rules.defineRule('selectableFeatureCount.Animal Shaman (Totem)',
      'features.Animal Shaman', '?', null,
      classLevel, '=', '1'
    );
    rules.defineRule('wildShapeLevel', 'features.Animal Shaman', '+', '-2');
    let allFeats = rules.getChoices('feats');
    ['Diehard', 'Endurance', 'Great Fortitude', 'Improved Great Fortitude',
     'Toughness'].forEach(f => {
      if(f in allFeats)
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Bear Shaman",');
    });
    ['Flyby Attack', 'Improved Lightning Reflexes', 'Lightning Reflexes',
     'Skill Focus (Perception)', 'Wind Stance'].forEach(f => {
      if(f in allFeats)
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Eagle Shaman",');
    });
    ['Dodge', 'Lunge', 'Improved Iron Will', 'Iron Will',
     'Skill Focus (Acrobatics)'].forEach(f => {
      if(f in allFeats)
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Lion Shaman",');
    });
    ['Combat Expertise', 'Improved Feint', 'Skill Focus (Bluff)', 'Stealthy',
     'Strike Back'].forEach(f => {
      if(f in allFeats)
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Serpent Shaman",');
    });
    ['Greater Trip', 'Improved Trip', 'Mobility', 'Skill Focus (Stealth)',
     'Spring Attack'].forEach(f => {
      if(f in allFeats)
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Wolf Shaman",');
    });
    // Aquatic Druid
    rules.defineRule('abilityNotes.naturalSwimmer',
      'speed', '=', 'Math.floor(source / 2)',
      'abilityNotes.seaborn', '*', '2'
    );
    rules.defineRule('wildShapeLevel', 'features.Aquatic Druid', '+', '-2');
    // Arctic Druid
    rules.defineRule('wildShapeLevel', 'features.Arctic Druid', '+', '-2');
    // Blight Druid
    rules.defineRule('familiarMasterLevel', classLevel, '+=', null);
    // Cave Druid
    rules.defineRule('caveDruidWildShape',
      'druidFeatures.Cave Druid', '?', null,
      classLevel, '=',
        'source < 6 ? null : ' +
        'source < 8 ? "small-medium" : ' +
        'source < 10 ? "tiny-large/small elemental" : ' +
        'source < 12 ? "diminutive-huge/medium elemental/medium ooze" : ' +
        'source < 14 ? "diminutive-huge/large elemental/large ooze" : ' +
        '"diminutive-huge/elemental/large ooze"'
    );
    rules.defineRule('wildShapeLevel', 'features.Cave Druid', '+', '-2');
    rules.defineRule('magicNotes.wildShape',
      'caveDruidWildShape', '=', null,
      'desertDruidWildShape', '=', null,
      'mountainDruidWildShape', '=', null
    );
    // Desert Druid
    rules.defineRule('desertDruidWildShape',
      'druidFeatures.Desert Druid', '?', null,
      classLevel, '=',
        'source < 6 ? null : ' +
        'source < 8 ? "small-medium" : ' +
        'source < 10 ? "tiny-large/small elemental" : ' +
        'source < 12 ? "diminutive-huge/medium elemental/medium vermin" : ' +
        'source < 14 ? "diminutive-huge/large elemental/large vermin" : ' +
        '"diminutive-huge/elemental/huge vermin"'
    );
    rules.defineRule('wildShapeLevel', 'features.Desert Druid', '+', '-2');
    // Jungle Druid
    rules.defineRule('wildShapeLevel', 'features.Jungle Druid', '+', '-2');
    Pathfinder.featureSpells(rules,
      'Verdant Sentinel', 'VerdantSentinel', 'wisdom', classLevel, null,
      ['Tree Shape']
    );
    // Mountain Druid
    rules.defineRule('mountainDruidWildShape',
      'druidFeatures.Mountain Druid', '?', null,
      classLevel, '=',
        'source < 6 ? null : ' +
        'source < 8 ? "small-medium" : ' +
        'source < 10 ? "tiny-large/small elemental" : ' +
        'source < 12 ? "diminutive-huge/medium elemental" : ' +
        'source < 14 ? "diminutive-huge/large elemental/large giant" : ' +
        'source < 16 ? "diminutive-huge/elemental/large giant" : ' +
        '"diminutive-huge/elemental/huge giant"'
    );
    rules.defineRule('wildShapeLevel', 'features.Mountain Druid', '+', '-2');
    // Plains Druid
    rules.defineRule('abilityNotes.runLikeTheWind.1',
      'abilityNotes.runLikeTheWind', '?', null, // Italics
      'armorWeight', '=', 'source <= 1 ? 1 : null'
    );
    rules.defineRule('speed', 'abilityNotes.runLikeTheWind.1', '+', '10');
    rules.defineRule('wildShapeLevel', 'features.Plains Druid', '+', '-2');
    // Swamp Druid
    Pathfinder.featureSpells(rules,
      'Slippery', 'Slippery', 'wisdom', classLevel, null,
      ['Freedom Of Movement']
    );
    rules.defineRule('wildShapeLevel', 'features.Swamp Druid', '+', '-2');
    // Urban Druid
    rules.defineRule('wildShapeLevel', 'features.Urban Druid', '+', '-4');

  } else if(name == 'Fighter') {

    featureReplacements = {
      'Armor Mastery':[
        'Ranged Defense', 'Penetrating Shot', 'Reversal', 'Polearm Parry',
        'Indomitable Steed', 'Shield Mastery', 'Devastating Blow',
        'Deadly Defense', 'Unstoppable Strike'
      ],
      'Armor Training':[
        // Note Rapid Attack (Mobile Fighter) kills AT3+4
        'Trick Shot (Archer)', 'Deadshot', 'Elusive', 'Phalanx Fighting',
        'Steadfast Pike', 'Armored Charger', 'Active Defense',
        'Overhand Chop', 'Defensive Flurry', 'Weapon Training (Weapon Master)'
      ],
      'Bravery':[
        'Hawkeye', 'Deceptive Strike', 'Agility', 'Stand Firm', 'Pole Fighting',
        'Steadfast Mount', 'Spark Of Life', 'Shattering Strike', 'Weapon Guard'
      ],
      'Weapon Mastery':[
        'Whirlwind Blitz', 'Shielded Fortress', 'Natural Weapon Mastery',
        'Shield Ward'
      ],
      'Weapon Training':[
        'Expert Archer', 'Crossbow Expert', 'Singleton', 'Leaping Attack',
        'Ready Pike', 'Polearm Training', 'Mounted Mettle', 'Natural Savagery',
        'Shield Fighter', 'Twin Blades', 'Reliable Strike'
      ]
    };

    rules.defineRule
      ('selectableFeatureCount.Fighter (Archetype)', classLevel, '=', '1');
    // Archer
    rules.defineRule('combatNotes.expertArcher',
      classLevel, '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('combatNotes.hawkeye',
      classLevel, '=', 'Math.floor((source + 2) / 4) * 5'
    );
    rules.defineRule
      ('combatNotes.safeShot', 'fighterFeatures.Archer', '=', '"Bow"');
    rules.defineRule
      ('skillNotes.hawkeye', classLevel, '=', 'Math.floor((source + 2) / 4)');
    QuilvynUtils.getKeys(rules.getChoices('weapons')).forEach(w => {
      let prefix =
        w.charAt(0).toLowerCase() + w.substring(1).replaceAll(' ', '');
      if(w.match(/\b(long|short)?bow\b/i)) {
        rules.defineRule
          (prefix + 'AttackModifier', 'combatNotes.expertArcher', '+=', null);
        rules.defineRule
          (prefix + 'DamageModifier', 'combatNotes.expertArcher', '+=', null);
        rules.defineRule(prefix + 'Range', 'combatNotes.hawkeye', '+=', null);
      }
    });
    // Crossbowman
    rules.defineRule('levelsUntilSafeShot',
      'fighterFeatures.Archer', '=', '9',
      'fighterFeatures.Crossbowman', '=', '13',
      classLevel, '+', '-source'
    );
    rules.defineRule('combatNotes.crossbowExpert',
      classLevel, '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('combatNotes.deadshot',
      'dexterityModifier', '=', 'Math.max(Math.floor(source / 2), 1)',
      'combatNotes.greaterDeadshot', '+', 'null', // italics no-op
      'combatNotes.greaterDeadshot.1', '^', null
    );
    rules.defineRule('combatNotes.greaterDeadshot.1',
      'features.Greater Deadshot', '?', null,
      'dexterityModifier', '=', null
    );
    rules.defineRule('combatNotes.safeShot',
      'fighterFeatures.Crossbowman', '=', '"Crossbow"',
      'levelsUntilSafeShot', '?', 'source<=0'
    );
    QuilvynUtils.getKeys(rules.getChoices('weapons')).forEach(w => {
      let prefix =
        w.charAt(0).toLowerCase() + w.substring(1).replaceAll(' ', '');
      if(w.match(/\bcrossbow\b/i)) {
        rules.defineRule
          (prefix + 'AttackModifier', 'combatNotes.crossbowExpert', '+=', null);
        rules.defineRule
          (prefix + 'DamageModifier', 'combatNotes.crossbowExpert', '+=', null);
      }
    });
    // Free Hand Fighter
    rules.defineRule('armorClass', 'combatNotes.elusive.1', '+', null);
    rules.defineRule('combatNotes.elusive',
      classLevel, '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('combatNotes.elusive.1',
      'armorWeight', '?', 'source<=1',
      'combatNotes.elusive', '=', null
    );
    // Mobile Fighter
    rules.defineRule
      ('skillNotes.armorTraining', 'fighterFeatures.Mobile Fighter', 'v', '2');
    // Phalanx Soldier
    rules.defineRule
      ('combatNotes.deftShield', classLevel, '=', 'source>=11 ? 2 : 1');
    rules.defineRule('combatNotes.towerShieldPenalty',
      'combatNotes.deftShield', '+', null
    );
    rules.defineRule('combatNotes.irresistibleAdvance',
      'shield', '=', 'source=="None" ? 0 : source=="Buckler" ? 1 : source=="Tower" ? 4 : source.match(/Light/) ? 2 : 3'
    );
    rules.defineRule('featureNotes.shieldedFortress.1',
      // Test note instead of feature for italics
      'featureNotes.shieldedFortress', '?', null,
      'shield', '=', 'source=="None" ? null : source=="Tower" ? "Improved Evasion" : "Evasion"'
    );
    rules.defineRule('features.Evasion',
      'featureNotes.shieldedFortress.1', '=', 'source=="Evasion" ? 1 : null'
    );
    rules.defineRule('features.Improved Evasion',
      'featureNotes.shieldedFortress.1', '=', 'source=="Improved Evasion" ? 1 : null'
    );
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
      'skillNotes.deftShield.1', '+', '-source'
    );
    rules.defineRule
      ('skillNotes.deftShield', classLevel, '=', 'source>=11 ? 2 : 1');
    rules.defineRule('skillNotes.deftShield.1',
      'shield', '?', 'source=="Tower"',
      'skillNotes.deftShield', '=', null
    );
    // Polearm Master
    // Weapon lists from core Fighter rules and the APG gear list
    let polearms = [
     'Glaive', 'Guisarme', 'Halberd', 'Ranseur', 'Bardiche', 'Bec De Corbin',
     'Bill', 'Glaive-Guisarme', 'Lucerne Hammer', 'Mancatcher'
    ];
    let spears = [
     'Javelin', 'Lance', 'Longspear', 'Shortspear', 'Spear', 'Trident',
     'Boar Spear', 'Chain Spear'
    ];
    QuilvynUtils.getKeys(rules.getChoices('weapons')).forEach(w => {
      let prefix =
        w.charAt(0).toLowerCase() + w.substring(1).replaceAll(' ', '');
      if(polearms.includes(w) || spears.includes(w)) {
        rules.defineRule
          (prefix+'AttackModifier', 'combatNotes.polearmTraining', '+=', null);
        rules.defineRule
          (prefix+'DamageModifier', 'combatNotes.polearmTraining', '+=', null);
      }
    });
    rules.defineRule('combatNotes.polearmTraining',
      classLevel, '=', 'Math.floor((source - 1) / 4)'
    );
    // Roughrider
    rules.defineRule('skillNotes.armoredCharger.1',
      'features.Armored Charger', '?', null,
      'skillNotes.armorSkillCheckPenalty', '=', null,
      'skillNotes.armoredCharger', '+', 'null' // italics no-op
    );
    rules.defineRule
      ('skillModifier.Ride', 'skillNotes.armoredCharger.1', '+', null);
    // Savage Warrior
    rules.defineRule('combatNotes.savageCharge',
      'combatNotes.savageCharge.1', '=', 'Math.floor(source)'
    );
    rules.defineRule('combatNotes.savageCharge.1',
      'features.Savage Charge', '?', null,
      classLevel, '=', 'source / 2',
      'combatNotes.greaterSavageCharge', '*', '0.5'
    );
    // Shielded Fighter
    rules.defineRule('combatNotes.shieldGuard',
      'shield', '=', 'source=="None" ? null : source.match(/Tower/) ? "3 contiguous squares" : source.match(/Heavy/) ? "2 contiguous squares" : "square"'
    );
    rules.defineRule('combatNotes.shieldMastery.1',
      'combatNotes.shieldMastery', '?', null,
      'shield', '=', 'source=="None" ? null : 5'
    );
    rules.defineRule
      ('combatNotes.shieldWard', 'saveNotes.shieldWard', '=', null);
    rules.defineRule
      ('damageReduction.-', 'combatNotes.shieldMastery.1', '+=', null);
    rules.defineRule('featureNotes.shieldWard.1',
      // Test note instead of feature for italics
      'featureNotes.shieldWard', '?', null,
      'shield', '=', 'source=="None" ? null : "Evasion"'
    );
    rules.defineRule('saveNotes.shieldWard',
      'armor', '=', 'source=="None" ? null : source.match(/Tower/) ? 4 : source.match(/Heavy/) ? 2 : 1'
    );
    rules.defineRule('features.Evasion',
      'featureNotes.shieldWard.1', '=', 'source=="Evasion" ? 1 : null'
    );
    // Two-Handed Fighter
    rules.defineRule('combatNotes.backswing',
      'strengthModifier', '=', 'Math.max(source*2 - Math.floor(source*1.5), 0)'
    );
    rules.defineRule('combatNotes.greaterPowerAttack',
      'baseAttack', '=', 'Math.floor((source + 4) / 4) * 4'
    );
    rules.defineRule('combatNotes.overhandChop',
      'strengthModifier', '=', 'Math.max(source*2 - Math.floor(source*1.5), 0)'
    );

  } else if(name == 'Monk') {

    featureReplacements = {
      'Abundant Step':['Slow Time', 'Touch Of Surrender'],
      'Diamond Body':[
        'Drunken Courage', 'Life From A Stone', 'Mystic Visions', 'Ki Weapons',
        'Ki Sacrifice', 'Trick Shot (Zen Archer)'
      ],
      'Diamond Soul':[
        'Drunken Resilience', 'Sipping Demon', 'Mystic Prescience'
      ],
      'Empty Body':['Firewater Breath', 'Mystic Persistence'],
      'Evasion':['Iron Monk', 'Adamantine Monk', 'Way Of The Bow'],
      'High Jump':['Iron Limb Defense'],
      'Improved Evasion':['Adamantine Monk', 'Reflexive Shot', 'Weapon Adept'],
      'Maneuver Training':['Zen Archery'],
      'Perfect Self':['Immortality', 'True Sacrifice', 'Pure Power'],
      'Purity Of Body':[
        'Drunken Strength', 'Steal Ki', 'Mystic Insight', 'Ki Weapons',
        'Ki Arrows'
      ],
      'Quivering Palm':['Ki Sacrifice', 'Touch Of Peace'],
      'Slow Fall':['Bastion Stance'],
      'Still Mind':[
        'Drunken Ki', 'Ki Mystic', 'Versatile Improvisation',
        'Point-Blank Master'
      ],
      'Stunning Fist':[
        'Punishing Kick', 'Elemental Fist', 'Touch Of Serenity',
        'Perfect Strike'
      ],
      'Timeless Body':['Aspect Master', 'Uncanny Initiative'],
      'Tongue Of The Sun And Moon':[
        'Learned Master', 'Vow Of Silence', 'Ki Focus Bow'
      ],
      'Wholeness Of Body':['Life Funnel', 'Ancient Healing Hand']
    };
    rules.defineRule
      ('monkFeatures.Condition Fist', 'monkHasStunningFist', '?', null);
    rules.defineRule('monkFeatures.Weapon Proficiency (Club/Dagger/Handaxe/Heavy Crossbow/Javelin/Kama/Light Crossbow/Nunchaku/Quarterstaff/Sai/Shortspear/Short Sword/Shuriken/Siangham/Sling/Spear)',
      'monkHasWeaponProficiency', '?', null
    );
    rules.defineRule('monkHasWeaponProficiency',
      classLevel, '=', '1',
      'monkFeatures.Monk Of The Empty Hand', '=', '0'
    );

    rules.defineRule
      ('selectableFeatureCount.Monk (Archetype)', classLevel, '=', '1');
    // Drunken Master
    rules.defineRule('featureNotes.drunkenKi',
      '', '=', '1',
      'featureNotes.deepDrinker', '+', '1'
    );
    // Hungry Ghost Monk
    rules.defineRule('hungryGhostLevel',
      'monkFeatures.Hungry Ghost Monk', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('combatNotes.punishingKick',
      'hungryGhostLevel', '+', 'source>=10 ? Math.floor((source-5) / 5) * 5 : null'
    );
    // Ki Mystic
    rules.defineRule
      ('combatNotes.mysticPrescience', classLevel, '=', 'source<20 ? 2 : 4');
    Pathfinder.featureSpells(rules,
      'Mystic Visions', 'MysticVisions', 'charisma', classLevel, null,
      ['Divination']
    );
    // Monk Of The Empty Hand
    rules.defineRule('emptyHandLevel',
      'monkFeatures.Monk Of The Empty Hand', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('featureNotes.kiPool',
      'featureNotes.kiPool(KiMystic)', '+=', '2',
      // Force to exactly 2 points at level 3; above rule handles higher levels
      'emptyHandLevel', 'v=', 'source==3 ? 2 : null'
    );
    // Monk Of The Four Winds
    rules.defineRule('fourWindsLevel',
      'monkFeatures.Monk Of The Four Winds', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('combatNotes.elementalFist',
      '', '=', '1',
      'fourWindsLevel', '+', 'Math.floor(source / 5)'
    );
    rules.defineRule('selectableFeatureCount.Monk (Aspect)',
      'features.Monk Of The Four Winds', '?', null,
      classLevel, '=', 'source>=17 ? 1 : null'
    );
    Pathfinder.featureSpells(rules,
      'Aspect Of The Oni', 'AspectOfTheOni', 'charisma', classLevel, null,
      ['Gaseous Form']
    );
    // Monk Of The Healing Hand
    Pathfinder.featureSpells(rules,
      'Ki Sacrifice', 'KiSacrifice', 'charisma', classLevel, null,
      ['Raise Dead', '15:Resurrection']
    );
    Pathfinder.featureSpells(rules,
      'True Sacrifice', 'TrueSacrifice', 'charisma', classLevel, null,
      ['True Resurrection']
    );
    // Monk Of The Lotus
    rules.defineRule('lotusLevel',
      'monkFeatures.Monk Of The Lotus', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('combatNotes.touchOfSerenity',
      'lotusLevel', '+', 'Math.floor(source / 6)'
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
    Pathfinder.featureSpells(rules,
      'Touch Of Peace', 'TouchOfPeace', 'charisma', classLevel, null,
      ['Charm Monster']
    );
    Pathfinder.featureSpells(rules,
      'Touch Of Surrender', 'TouchOfSurrender', 'charisma', classLevel, null,
      ['Charm Monster']
    );
    // Monk Of The Sacred Mountain
    rules.defineRule('features.Toughness', 'featureNotes.ironMonk', '=', '1');
    rules.defineRule('combatNotes.adamantineMonk',
      classLevel, '=', 'Math.floor((source - 6) / 3)'
    );
    rules.defineRule('combatNotes.adamantineMonk-1',
      'combatNotes.adamantineMonk', '=', 'source * 2'
    );
    rules.defineRule
      ('damageReduction.-', 'combatNotes.adamantineMonk', '+=', null);
    // Weapon Adept
    // WA delays Evasion to level 9
    rules.defineRule('weaponAdeptLevel',
      'monkFeatures.Weapon Adept', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('monkHasEvasion',
      'weaponAdeptLevel', '=', 'source<9 ? 0 : null'
    );
    rules.defineRule
      ('combatNotes.perfectStrike', 'weaponAdeptLevel', '+', 'source>=10 ? 1 : null');
    rules.defineRule('featCounts.General',
      'featureNotes.wayOfTheWeaponMaster', '+', '1',
      'featureNotes.wayOfTheWeaponMaster.1', '+', 'source.includes("+1") ? 1 : null'
    );
    rules.defineRule('featureNotes.wayOfTheWeaponMaster.1',
      'features.Way Of The Weapon Master', '?', null,
      classLevel, '=', 'source>=6 ? "/+1 General Feat (Weapon Specialization (monk weapon))" : ""'
    );
    // Zen Archer
    // combatNotes.perfectStrike as Weapon Adept
    rules.defineRule('combatNotes.zenArchery',
      'wisdomModifier', '=', null,
      'dexterityModifier', '+', '-source'
    );
    rules.defineRule('featCounts.General',
      'featureNotes.wayOfTheBow', '+', '1',
      'featureNotes.wayOfTheBow.1', '+', 'source.includes("+1") ? 1 : null'
    );
    rules.defineRule('featureNotes.wayOfTheBow.1',
      'features.Way Of The Bow', '?', null,
      classLevel, '=', 'source>=10 ? "/+1 General Feat (Weapon Specialization (Bow))" : ""'
    );
    rules.defineRule
      ('features.Point-Blank Shot', 'featureNotes.pointBlankMaster', '=', '1');
    ['Composite Longbow','Composite Shortbow','Longbow','Shortbow'].forEach(w=>{
      rules.defineRule(w.replaceAll(' ', '') + 'AttackModifier',
        'combatNotes.zenArchery', '+', null
      );
    });
    rules.defineRule('validationNotes.weaponSpecialization(CompositeLongbow)',
      classLevel, '*', 'source<6 ? null : 0'
    );
    rules.defineRule('validationNotes.weaponSpecialization(CompositeShortbow)',
      classLevel, '*', 'source<6 ? null : 0'
    );
    rules.defineRule('validationNotes.weaponSpecialization(Longbow)',
      classLevel, '*', 'source<6 ? null : 0'
    );
    rules.defineRule('validationNotes.weaponSpecialization(Shortbow)',
      classLevel, '*', 'source<6 ? null : 0'
    );
    // Disallow certain monk bonus feats unavailable to Zen Archer archetype
    ['Catch Off-Guard', 'Improved Grapple', 'Scorpion Style', 'Throw Anything',
     "Gorgon's Fist", 'Improved Bull Rush', 'Improved Disarm', 'Improved Feint',
     'Improved Trip', "Medusa's Wrath", 'Spring Attack'].forEach(s => {
      let allNotes = rules.getChoices('notes');
      let note =
        'validationNotes.monk-' + s.replaceAll(' ', '') + 'SelectableFeature';
      if(!(note in allNotes)) {
        console.log('Cannot find note ' + note);
      } else {
        rules.defineRule(note, 'features.Zen Archer', '+', '-1');
        allNotes[note] += ' and not Zen Archer';
      }
    });

  } else if(name == 'Paladin') {

    featureReplacements = {
      'Aura Of Faith':['Shining Light'],
      'Aura Of Justice':[
        'Aura Of Healing', "Knight's Charge", 'Undead Annihilation'
      ],
      'Aura Of Resolve':['Call Celestial Ally', 'Aura Of Life'],
      'Channel Positive Energy':[
        'Channel Positive Energy (Hospitaler)'
      ],
      'Divine Health':['Skilled Rider'],
      'Mercy':['Shared Defense']
    };
    rules.defineRule('paladinHasSpells',
      classLevel, '=', '1',
      'paladinFeatures.Power Of Faith', '=', '0'
    );
    rules.defineRule('casterLevels.Domain', 'paladinDomainLevel', '^=', null);
    rules.defineRule('casterLevels.Paladin', 'paladinHasSpells', '?', null);
    rules.defineRule('spellSlotLevel.Paladin', 'paladinHasSpells', '?', null);
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Paladin - .* Domain/)) {
        let domain = s.replace('Paladin - ', '').replace(' Domain', '');
        rules.defineRule('paladinDomainLevels.' + domain,
          'paladinFeatures.' + domain + ' Domain', '?', null,
          'levels.Paladin', '=', 'source>=4 ? source - 3 : null'
        );
        rules.defineRule('casterLevels.' + domain,
          'paladinDomainLevels.' + domain, '^=', null
        );
        rules.defineRule
          ('paladinDomainLevel', 'paladinDomainLevels.' + domain, '^=', null);
      }
    }
    for(let level = 1; level <= 4; level++) {
      rules.defineRule('spellSlots.Domain' + level,
        'paladinDomainLevel', '+=', 'source>=' + (level * 3 + 1) + ' ? 1 : null'
      );
    }

    rules.defineRule
      ('selectableFeatureCount.Paladin (Archetype)', classLevel, '=', '1');
    rules.defineRule
      ('selectableFeatureCount.Paladin (Mercy)', 'paladinHasMercy', '?', null);
    rules.defineRule('selectableFeatureCount.Paladin (Domain)',
      'featureNotes.domain(Paladin)', '=', '1'
    );
    // Divine Defender
    rules.defineRule('magicNotes.sharedDefense.1',
      'features.Shared Defense', '?', null,
      classLevel, '=', 'source>=18 ? ", plus automatic stabilization, immunity to bleed damage, and 25% chance to negate sneak attack and crit damage," : source>=12 ? ", plus automatic stabilization and immunity to bleed damage," : source>=6 ? ", plus automatic stabilization," : ""'
    );
    // Hospitaler
    rules.defineRule('hospitalerLevel',
      'paladinFeatures.Hospitaler', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('combatNotes.smiteEvil',
      'hospitalerLevel', 'v', 'Math.floor((source + 5) / 6)'
    );
    rules.defineRule('features.Channel Energy',
      'features.Channel Positive Energy (Hospitaler)', '=', '1'
    );
    rules.defineRule('magicNotes.channelEnergy.1',
      'hospitalerLevel', '+=', 'Math.floor((source-2)/2) - Math.floor((source+1)/2)'
    );
    // Sacred Servant
    rules.defineRule('sacredServantLevel',
      'paladinFeatures.Sacred Servant', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('combatNotes.smiteEvil',
      'sacredServantLevel', 'v', 'Math.floor((source + 5) / 6)'
    );
    Pathfinder.featureSpells(rules,
      'Call Celestial Ally', 'CallCelestialAlly', 'wisdom', classLevel,
      null, ['Lesser Planar Ally', '12:Planar Ally', '16:Greater Planar Ally']
    );
    // Shining Knight
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
    rules.defineRule
      ('skillModifier.Ride', 'skillNotes.skilledRider.1', '+', null);
    rules.defineRule('skillNotes.skilledRider.1',
      'skillNotes.skilledRider', '?', null, // Italics
      'skillNotes.armorSkillCheckPenalty', '=', null
    );
    // Undead Scourge
    rules.defineRule('combatNotes.smiteEvil.1',
      'paladinFeatures.Undead Scourge', '=', '"undead"'
    );
    // Warrior Of The Holy Light
    rules.defineRule
      ('magicNotes.layOnHands.1', 'magicNotes.powerOfFaith', '+', null);
    rules.defineRule('magicNotes.powerOfFaith-1.1',
      'features.Power Of Faith', '?', null,
      classLevel, '=', 'source>=20 ? ", 20 resistance to chosen energy, 50% chance of negating crit damage, and healing of 2d4 ability damage" : source>=16 ? ", 10 resistance to chosen energy, 25% chance of negating crit damage, and healing of 1d4 ability damage" : source>=12 ? ", 10 resistance to chosen energy, and healing of 1d4 ability damage" : source>=8 ? " and healing of 1d4 ability damage" : ""'
    );
    Pathfinder.featureSpells(rules,
      'Power Of Faith', 'PowerOfFaith', 'wisdom', classLevel, null,
      ['12:Daylight']
    );

  } else if(name == 'Antipaladin') {

    rules.defineRule
      ('channelLevel', classLevel, '+=', 'source>=4 ? source : null');
    rules.defineRule('combatNotes.fiendishWeapon',
      classLevel, '=', 'Math.floor((source - 2) / 3)'
    );
    rules.defineRule('combatNotes.fiendishWeapon.1', classLevel, '=', null);
    rules.defineRule('combatNotes.fiendishWeapon.2',
      classLevel, '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('combatNotes.smiteGood',
      'features.Smite Good', '?', null,
      classLevel, '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('combatNotes.smiteGood.1',
      'features.Smite Good', '?', null,
      '', '=', '"outsider, dragon, cleric, or paladin"'
    );
    rules.defineRule('damageReduction.good',
      'combatNotes.auraOfDepravity', '^=', '5',
      'combatNotes.unholyChampion', '^=', '10'
    );
    rules.defineRule
      ('features.Channel Energy', 'features.Channel Negative Energy', '=', '1');
    rules.defineRule('magicNotes.fiendishServant',
      classLevel, '=', 'source>=17 ? "IX" : ["III", "IV", "V", "VI", "VII", "VIII"][Math.floor((source - 5)/ 2)]'
    );
    rules.defineRule('magicNotes.touchOfCorruption',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.touchOfCorruption.1',
      classLevel, '=', 'Math.floor(source / 2)',
      'charismaModifier', '+', null,
      'magicNotes.extraChannel', '+', '4',
      'magicNotes.extraLayOnHands', '+', null
    );
    rules.defineRule('saveNotes.unholyResilience',
      'charismaModifier', '=', 'Math.max(source, 0)'
    );
    rules.defineRule('selectableFeatureCount.Antipaladin (Fiendish Boon)',
      classLevel, '=', 'source >= 5 ? 1 : null'
    );
    rules.defineRule('selectableFeatureCount.Antipaladin (Cruelty)',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    let cruelties =
      QuilvynUtils.getKeys(rules.getChoices('selectableFeatures'), /Cruelty/).map(x => x.replace(/^.*Cruelty/, 'Cruelty'));
    let details = {
      'Cruelty (Blinded)':' for %{' + classLevel + '} rd',
      'Cruelty (Cursed)':' as <i>Bestow Curse</i>',
      'Cruelty (Dazed)':' for 1 rd',
      'Cruelty (Diseased)':' as <i>Contagion</i>',
      'Cruelty (Deafened)':' for %{' + classLevel + '} rd',
      'Cruelty (Frightened)':' for %{' + classLevel + '//2} rd',
      'Cruelty (Nauseated)':' for %{' + classLevel + '//3} rd',
      'Cruelty (Paralyzed)':' for 1 rd',
      'Cruelty (Poisoned)':' as <i>Poison</i>',
      'Cruelty (Shaken)':' for %{' + classLevel + '} rd',
      'Cruelty (Sickened)':' for %{' + classLevel + '} rd',
      'Cruelty (Staggered)':' for %{' + classLevel + '//2} rd',
      'Cruelty (Stunned)':' for %{' + classLevel + '//4} rd'
    };
    // Rule used only for its side-effect
    rules.defineRule('magicNotes.cruelty',
      classLevel, '=', '(Pathfinder.crueltiesTaken=[]) ? null : null'
    );
    for(let i = 0; i < cruelties.length; i++) {
      let cruelty = cruelties[i];
      rules.defineRule('magicNotes.cruelty',
        'antipaladinFeatures.' + cruelty, '=', 'Pathfinder.crueltiesTaken.push("' + cruelty.replace(/Cruelty..|.$/g, '').toLowerCase() + (details[cruelty] || '') + '") ? Pathfinder.crueltiesTaken.join(", ") : ""'
      );
    }
    Pathfinder.featureSpells(rules,
      'Cruelty', 'Cruelty', 'charisma', classLevel,
      '10+' + classLevel + '//2+charismaModifier',
      ['Bestow Curse', 'Contagion', 'Poison']
    );
    Pathfinder.featureSpells(rules,
      'Detect Good', 'DetectGood', 'charisma', classLevel, null, ['Detect Good']
    );
    Pathfinder.featureSpells(rules,
      'Fiendish Servant', 'FiendishServant', 'charisma', classLevel, null,
      ['Summon Monster IX']
    );
    Pathfinder.featureSpells(rules,
      'Unholy Champion', 'UnholyChampion', 'charisma', classLevel, '',
      ['Banishment']
    );

  } else if(name == 'Ranger') {

    featureReplacements = {
      'Camouflage':[
        'Strong Bond', 'Dual Form Shifter', 'Wisdom Of The Spirits', 'Blend In',
        // Presume losing Favored Terrain implies losing Camouflage
        'Adaptation'
      ],
      'Evasion':["Ranger's Luck"],
      'Endurance':['Trapfinding'],
      'Favored Enemy':["Ranger's Focus"],
      'Favored Terrain':[
        'Adaptation', "Shifter's Blessing", 'Favored Community'
      ],
      'Hide In Plain Sight':['Spiritual Bond', 'Invisibility Trick'],
      "Hunter's Bond":[
        // Easier to list Beast Master rather than its feature
        'Beast Master', 'Terrain Bond', 'Mounted Bond', 'Spirit Bond'
      ],
      'Improved Evasion':["Improved Ranger's Luck"],
      'Improved Quarry':['Inspired Moment'],
        // Presume losing Favored Enemy implies losing Master Hunter
      'Master Hunter':['Master Shifter', "Ranger's Focus"],
      'Quarry':['Inspired Moment'],
      'Woodland Stride':['Push Through']
    };
    rules.defineRule('rangerHasSpells',
      classLevel, '=', '1',
      "rangerFeatures.Hunter's Tricks", '=', '0'
    );
    rules.defineRule('casterLevels.Ranger', 'rangerHasSpells', '?', null);
    rules.defineRule('spellSlotLevel.Ranger', 'rangerHasSpells', '?', null);
    rules.defineRule
      ('selectableFeatureCount.Ranger (Archetype)', classLevel, '=', '1');
    ['Archery', 'Crossbow', 'Mounted Combat', 'Natural Weapon',
     'Two-Handed Weapon', 'Two-Weapon', 'Weapon And Shield'].forEach(cs => {
      rules.defineRule('selectableFeatureCount.Ranger (' + cs + ' Feat)',
        'features.Combat Style (' + cs + ')', '?', null,
        classLevel, '=', 'source>=2 ? Math.floor((source + 2) / 4) : null'
      );
    });
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Bond)",
      'rangerHasHuntersBond', '?', null
    );
    // Handle new combat style selectables that duplicate those of core styles
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

    // Beast Master
    let allSkills = rules.getChoices('skills');
    for(let s in allSkills) {
      if(['Knowledge (Dungeoneering)', 'Knowledge (Geography)', 'Spellcraft'].includes(s) || s.startsWith('Profession')) {
        rules.defineRule('rangerClassSkills.' + s,
          'levels.Ranger', '=', '1',
          'features.Beast Master', '=', '0'
        );
        rules.defineRule('classSkills.' + s,
          'levels.Ranger', '=', 'null',
          'rangerClassSkills.' + s, '=', 'source==1 ? 1 : null'
        );
      }
    }
    rules.defineRule
      ('classSkills.Acrobatics', 'features.Beast Master', '=', '1');
    rules.defineRule
      ('classSkills.Escape Artist', 'features.Beast Master', '=', '1');
    ['Archery', 'Crossbow', 'Mounted Combat', 'Natural Weapon',
     'Two-Handed Weapon', 'Two-Weapon', 'Weapon And Shield'].forEach(cs => {
      rules.defineRule('selectableFeatureCount.Ranger (' + cs + ' Feat)',
        'features.Improved Empathic Link', '+', '-1'
      );
    });
    rules.defineRule('beastMasterLevel',
      'rangerFeatures.Beast Master', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('rangerFeatures.Animal Companion',
      'beastMasterLevel', '=', 'source>=4 ? 1 : null'
    );
    // Guide
    rules.defineRule("combatNotes.ranger'sLuck.1",
      "rangerFeatures.Ranger's Luck", '?', null,
      classLevel, '=', '""',
      "combatNotes.improvedRanger'sLuck", '=', '" +4"'
    );
    rules.defineRule("combatNotes.ranger'sLuck.2",
      "combatNotes.ranger'sLuck.1", '=', 'source ? " -4" : ""'
    );
    // Horse Lord
    rules.defineRule('rangerFeatures.Animal Companion',
      'features.Mounted Bond', '=', '1'
    );
    // Shapeshifter
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
    rules.defineRule('combatNotes.formOfTheDragon',
      '', '=', '2',
      'featureNotes.masterShifter', '^', '4'
    );
    rules.defineRule('combatNotes.formOfTheJackal',
      '', '=', '"half"',
      'featureNotes.masterShifter', '=', '"full"'
    );
    rules.defineRule('skillNotes.formOfTheCat',
      '', '=', '4',
      'featureNotes.masterShifter', '^', '10'
    );
    rules.defineRule('skillNotes.formOfTheOtter',
      '', '=', '8',
      'featureNotes.masterShifter', 'v', '5'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Shifter's Blessing)",
      'rangerFeatures.Shapeshifter', '?', null,
      classLevel, '=', 'Math.floor((source + 2) / 5)'
    );
    Pathfinder.featureSpells(rules,
      'Master Shifter', 'MasterShifter', 'wisdom', classLevel, null,
      ['Beast Shape IV', 'Form Of The Dragon I']
    );
    // Skirmisher
    rules.defineRule("featureNotes.hunter'sTricks",
      classLevel, '=', 'Math.floor((source - 3) / 2)'
    );
    rules.defineRule("selectableFeatureCount.Ranger (Hunter's Trick)",
      'rangerFeatures.Skirmisher', '?', null,
      classLevel, '=', 'Math.floor((source - 3) / 2)'
    );
    // Spirit Ranger
    Pathfinder.featureSpells(rules,
      'Spirit Bond', 'SpiritBond', 'wisdom', classLevel, null, ['Augury']
    );
    Pathfinder.featureSpells(rules,
      'Wisdom Of The Spirits', 'WisdomOfTheSpirits', 'wisdom', classLevel, null,
      ['Divination']
    );
    // Urban Ranger
    rules.defineRule
      ('skillNotes.trapfinding', classLevel, '+=', 'Math.floor(source / 2)');
    ['Handle Animal', 'Knowledge (Nature)'].forEach(s => {
      rules.defineRule('rangerClassSkills.' + s,
        'levels.Ranger', '=', '1',
        'features.Urban Ranger', '=', '0'
      );
      rules.defineRule('classSkills.' + s,
        'levels.Ranger', '=', 'null',
        'rangerClassSkills.' + s, '=', 'source==1 ? 1 : null'
      );
    });
    rules.defineRule
      ('classSkills.Disable Device', 'features.Urban Ranger', '=', '1');
    rules.defineRule
      ('classSkills.Knowledge (Local)', 'features.Urban Ranger', '=', '1');
    Pathfinder.featureSpells(rules,
      'Invisibility Trick', 'InvisibilityTrick', 'wisdom', classLevel, null,
      ['Greater Invisibility']
    );

  } else if(name == 'Rogue') {

    featureReplacements = {
      'Improved Uncanny Dodge':['Distraction', 'Skirmisher', 'Trap Master'],
      'Trapfinding':[
        // Easier to list Poisoner rather than its feature
        'Expert Acrobat', 'Measure The Mark', 'Follow Up', 'Poisoner',
        "Bravado's Blade", 'Accuracy', 'Skilled Liar', 'Martial Training',
        'Frightening'
      ],
      'Trap Sense':[
        'Second Chance (Rogue)', 'Stab And Grab', 'Master Poisoner',
        // Easier to list Spy rather than its feature
        "Rake's Smile", 'Deadly Range', 'Spy', 'Daring', 'Brutal Beating'
      ],
      'Uncanny Dodge':["Scout's Charge", 'Careful Disarm']
    };
    ['Improved Uncanny Dodge', 'Trapfinding', 'Trap Sense',
     'Uncanny Dodge'].forEach(f => {
      rules.defineRule
        ('rogueFeatures.' + f, 'rogueHas' + f.replaceAll(/ /g, ''), '?', null);
    });
    rules.defineRule
      ('features.Improved Steal', 'featureNotes.combatSwipe', '=', '1');
    rules.defineRule('features.Intimidating Prowess',
      'featureNotes.strongImpression', '=', '1'
    );
    rules.defineRule('skillNotes.guilefulPolyglot',
      '', '=', '2',
      'skills.Linguistics', '+', '2'
    );
    rules.defineRule
      ('selectableFeatureCount.Rogue (Archetype)', classLevel, '=', '1');
    // Acrobat
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
    rules.defineRule('skillNotes.expertAcrobat.1',
      'skillNotes.expertAcrobat', '?', null,
      'armorWeight', '?', 'source==1',
      'skillNotes.armorSkillCheckPenalty', '=', null
    );
    rules.defineRule('skillNotes.expertAcrobat.2',
      'skillNotes.expertAcrobat', '?', null,
      'armorWeight', '=', 'source==0 ? 2 : null'
    );
    // Rake
    rules.defineRule
      ("skillNotes.rake'sSmile", classLevel, '=', 'Math.floor(source / 3)');
    // Spy
    rules.defineRule('levelsUntilPoisonUse',
      'rogueFeatures.Poisoner', '=', '1',
      'rogueFeatures.Spy', '=', '3',
      classLevel, '+', '-source'
    );
    rules.defineRule
      ('rogueFeatures.Poison Use', 'levelsUntilPoisonUse', '?', 'source<=0');
    // Swashbucker
    rules.defineRule
      ('featCount.Combat', 'featureNotes.martialTraining', '+=', '1');
    rules.defineRule
      ('skillNotes.daring', classLevel, '=', 'Math.floor(source / 3)');

  } else if(name == 'Sorcerer') {

    let allFeats = rules.getChoices('feats');
    let bloodlineFeats = {
      'Aquatic': [
        'Athletic', 'Brew Potion', 'Defensive Combat Training', 'Dodge',
        'Mobility', 'Silent Spell', 'Skill Focus (Swim)', 'Toughness'
      ],
      'Boreal': [
        'Arcane Strike', 'Diehard', 'Empower Spell', 'Endurance',
        'Power Attack', 'Skill Focus (Intimidate)', 'Toughness'
      ],
      'Deep Earth': [
        'Acrobatic Steps', 'Alertness', 'Blind-Fight', 'Forge Ring',
        'Nimble Moves', 'Skill Focus (Perception)', 'Stealthy', 'Still Spell'
      ],
      'Dreamspun': [
        'Alertness', 'Blind-Fight', 'Combat Expertise', 'Deceitful',
        'Heighten Spell', 'Improved Feint', 'Persuasive',
        'Skill Focus (Sense Motive)'
      ],
      'Protean': [
        'Agile Maneuvers', 'Defensive Combat Training', 'Enlarge Spell',
        'Great Fortitude', 'Improved Great Fortitude', 'Toughness'
      ],
      'Serpentine': [
        'Combat Casting', 'Combat Reflexes', 'Deceitful', 'Deft Hands',
        'Persuasive', 'Silent Spell', 'Skill Focus (Bluff)', 'Stealthy'
      ],
      'Shadow': [
        'Acrobatic', 'Blind-Fight', 'Dodge', 'Quick Draw', 'Silent Spell',
        'Skill Focus (Stealth)', 'Stealthy', 'Weapon Finesse'
      ],
      'Starsoul': [
        'Blind-Fight', 'Craft Rod', 'Dodge', 'Endurance',
        'Improved Counterspell', 'Improved Iron Will', 'Iron Will',
        'Quicken Spell', 'Skill Focus (Perception)', 'Toughness'
      ],
      'Stormborn': [
        'Deadly Aim', 'Dodge', 'Enlarge Spell', 'Far Shot', 'Great Fortitude',
        'Point-Blank Shot', 'Skill Focus (Fly)', 'Wind Stance'
      ],
      'Verdant': [
        'Acrobatic Steps', 'Craft Staff', 'Endurance', 'Extend Spell', 'Fleet',
        'Nimble Moves', 'Skill Focus (Knowledge (Nature))', 'Toughness'
      ]
    };
    for(let f in allFeats) {
      if(f.startsWith('Exotic Weapon Proficiency'))
        bloodlineFeats.Boreal.push(f);
      else if(f.startsWith('Skill Focus (Craft'))
        bloodlineFeats.Protean.push(f);
      else if(f.startsWith('Spell Focus'))
        bloodlineFeats.Protean.push(f);
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

    // Bloodline Aquatic
    rules.defineRule
      ('combatNotes.aquaticAdaptation(Sorcerer)', classLevel, '?', 'source>=9');
    rules.defineRule
      ('damageReduction.Piercing', 'saveNotes.deepOne', '+=', '10');
    rules.defineRule('featureNotes.aquaticAdaptation(Sorcerer)',
      classLevel, '?', 'source>=9'
    );
    rules.defineRule
      ('featureNotes.blindsense', 'featureNotes.deepOne', '^=', '60');
    rules.defineRule
      ('featureNotes.blindsight', 'featureNotes.deepOne', '^=', '120');
    rules.defineRule('features.Blindsense', 'featureNotes.deepOne', '=', '1');
    rules.defineRule('features.Blindsight', 'featureNotes.deepOne', '=', '1');
    rules.defineRule('features.Evasion', 'featureNotes.deepOne', '=', '1');
    rules.defineRule
      ('saveNotes.aquaticAdaptation(Sorcerer)', classLevel, '?', 'source>=9');
    Pathfinder.featureSpells(rules,
      'Aquatic Telepathy', 'AquaticTelepathy', 'charisma', classLevel, '',
      ['Suggestion', '15:Demand', '15:Greater Planar Ally']
    );
    Pathfinder.featureSpells(rules,
      'Raise The Deep', 'RaiseTheDeep', 'charisma', classLevel, null,
      ['Control Water']
    );
    Pathfinder.featureSpells(rules,
      'Deep One', 'DeepOne', 'charisma', classLevel, null,
      ['Freedom Of Movement']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Aquatic', 'BloodlineAquatic', 'charisma',
      'bloodlineLevels.Aquatic', '',
      ['3:Hydraulic Push', '5:Slipstream', '7:Aqueous Orb',
       '9:Geyser', '11:Control Water', '13:Beast Shape IV',
       '15:Summon Monster VII', '17:Seamantle', '19:World Wave']
    );
    // Bloodline Boreal
    rules.defineRule('magicNotes.icewalker', classLevel, '?', 'source>=9');
    rules.defineRule('casterLevels.Blizzard', classLevel, '+=', null);
    Pathfinder.featureSpells(rules,
      'Blizzard (Sorcerer)', 'Blizzard', 'charisma', classLevel, '',
      ['Control Winds', 'Sleet Storm']
    );
    Pathfinder.featureSpells(rules,
      'Icewalker', 'Icewalker', 'charisma', classLevel, null, ['Spider Climb']
    );
    Pathfinder.featureSpells(rules,
      'Snow Shroud', 'SnowShroud', 'charisma', classLevel, null,
      ['Fire Shield']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Boreal', 'BloodlineBoreal', 'charisma',
      'bloodlineLevels.Boreal', '',
      ['3:Enlarge Person', '5:Rage', '7:Elemental Aura',
       '9:Wall Of Ice', '11:Cone Of Cold', '13:Transformation',
       '15:Giant Form I', '17:Polar Ray', '19:Meteor Swarm']
    );
    // Bloodline Deep Earth
    rules.defineRule('deepEarthLevel',
      'sorcererFeatures.Bloodline Deep Earth', '?', null,
      classLevel, '=', null
    );
    rules.defineRule
      ('abilityNotes.earthGlide', classLevel, '=', 'source + " min"');
    rules.defineRule('abilityNotes.earthGlide.1',
      'features.Earth Glide', '?', null,
      classLevel, '=', '" at half speed"'
    );
    rules.defineRule
      ('damageReduction.Adamantine', 'combatNotes.strengthOfStone', '+=', '10');
    rules.defineRule
      ('features.Stonecunning', 'featureNotes.rockseer', '=', '1');
    rules.defineRule
      ('features.Tremorsense', 'deepEarthLevel', '=', 'source>=9 ? 1 : null');
    rules.defineRule('magicNotes.rockseer', classLevel, '?', 'source>=15');
    rules.defineRule
      ('skillNotes.rockseer', 'race', '?', 'source.match(/Dwarf/)');
    Pathfinder.featureSpells(rules,
      'Bloodline Deep Earth', 'BloodlineDeepEarth', 'charisma',
      'bloodlineLevels.Deep Earth', '',
      ['3:Expeditious Excavation', '5:Darkvision', '7:Shifting Sand',
       '9:Stoneskin', '11:Spike Stones', '13:Stone Tell',
       '15:Repel Metal Or Stone', '17:Earthquake', '19:Clashing Rocks']
    );
    // Bloodline Dreamspun
    rules.defineRule('combatNotes.combatPrecognition',
      classLevel, '=', 'Math.floor((source + 1) / 4)'
    );
    Pathfinder.featureSpells(rules,
      'Dreamshaper', 'Dreamshaper', 'charisma', classLevel,
      '10 + ' + classLevel + '//2 + charismaModifier',
      ['Modify Memory', 'Speak With Dead']
    );
    Pathfinder.featureSpells(rules,
      'Eye Of Somnus', 'EyeOfSomnus', 'charisma', classLevel, '',
      ['Arcane Eye', 'Symbol Of Sleep']
    );
    Pathfinder.featureSpells(rules,
      'Lullaby', 'Lullaby', 'charisma', classLevel, '', ['Lullaby']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Dreamspun', 'BloodlineDreamspun', 'charisma',
      'bloodlineLevels.Dreamspun', '',
      ['3:Sleep', '5:Augury', '7:Deep Slumber',
       '9:Divination', '11:Dream', '13:Shadow Walk',
       '15:Vision', '17:Moment Of Prescience', '19:Astral Projection']
    );
    // Bloodline Protean
    Pathfinder.featureSpells(rules,
      'Spatial Tear', 'SpatialTear', 'charisma', classLevel, '',
      ['Black Tentacles', 'Dimension Door']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Protean', 'BloodlineProtean', 'charisma',
      'bloodlineLevels.Protean', '',
      ['3:Entropic Shield', '5:Blur', '7:Gaseous Form',
       '9:Confusion', '11:Major Creation', '13:Disintegrate',
       '15:Greater Polymorph', '17:Polymorph Any Object', '19:Shapechange']
    );
    // Bloodline Serpentine
    rules.defineRule
      ('combatNotes.snakeskin', classLevel, '=', 'Math.floor((source-5) / 4)');
    rules.defineRule('featureNotes.serpentfriend.1',
      'featureNotes.serpentfriend', '?', null,
      classLevel, '=', 'source - 2'
    );
    rules.defineRule
      ('familiarMasterLevel', 'featureNotes.serpentfriend.1', '+=', null);
    rules.defineRule
      ('features.Familiar', 'featureNotes.serpentfriend', '=', '1');
    rules.defineRule
      ('skillNotes.snakeskin', classLevel, '=', 'Math.floor((source - 1) / 4)');
    Pathfinder.featureSpells(rules,
      'Den Of Vipers', 'DenOfVipers', 'charisma', classLevel, '',
      ['Creeping Doom']
    );
    Pathfinder.featureSpells(rules,
      'Scaled Soul', 'ScaledSoul', 'charisma', classLevel, null,
      ['Alter Self', 'Beast Shape III']
    );
    Pathfinder.featureSpells(rules,
      'Serpentfriend', 'Serpentfriend', 'charisma', classLevel, '',
      ['Speak With Animals']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Serpentine', 'BloodlineSerpentine', 'charisma',
      'bloodlineLevels.Serpentine', '',
      ['3:Hypnotism', '5:Delay Poison', '7:Summon Monster III',
       '9:Poison', '11:Hold Monster', '13:Mass Suggestion',
       '15:Summon Monster VII', '17:Irresistible Dance', '19:Dominate Monster']
    );
    // Bloodline Shadow
    Pathfinder.featureSpells(rules,
      'Enveloping Darkness', 'EnvelopingDarkness', 'charisma', classLevel, '',
      ['Deeper Darkness']
    );
    Pathfinder.featureSpells(rules,
      'Shadow Well', 'ShadowWell', 'charisma', classLevel, null,
      ['Dimension Door']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Shadow', 'BloodlineShadow', 'charisma',
      'bloodlineLevels.Shadow', '',
      ['3:Ray Of Enfeeblement', '5:Darkvision', '7:Deeper Darkness',
       '9:Shadow Conjuration', '11:Shadow Evocation', '13:Shadow Walk',
       '15:Power Word Blind', '17:Greater Shadow Evocation', '19:Shades']
    );
    // Bloodline Starsoul
    rules.defineRule('featureNotes.voidwalker-1', classLevel, '?', 'source>=9');
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.voidwalker', '=', '1');
    Pathfinder.featureSpells(rules,
      'Aurora Borealis', 'AuroraBorealis', 'charisma', classLevel,
      '10 + ' + classLevel + '//2 + charismaModifier', ['Wall Of Fire']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Starsoul', 'BloodlineStarsoul', 'charisma',
      'bloodlineLevels.Starsoul', '',
      ['3:Unseen Servant', '5:Glitterdust', '7:Blink',
       '9:Call Lightning Storm', '11:Overland Flight', '13:Repulsion',
       '15:Reverse Gravity', '17:Greater Prying Eyes', '19:Meteor Swarm']
    );
    // Bloodline Stormborn
    rules.defineRule('featureNotes.stormchild', classLevel, '?', 'source>=9');
    rules.defineRule('features.Blindsense', 'features.Stormchild', '=', '1');
    rules.defineRule('features.Blindsight', 'features.Storm Lord', '=', '1');
    Pathfinder.featureSpells(rules,
      'Bloodline Stormborn', 'BloodlineStormborn', 'charisma',
      'bloodlineLevels.Stormborn', '',
      ['3:Shocking Grasp', '5:Gust Of Wind', '7:Lightning Bolt',
       '9:Shout', '11:Overland Flight', '13:Chain Lightning',
       '15:Control Weather', '17:Whirlwind', '19:Storm Of Vengeance']
    );
    // Bloodline Verdant
    rules.defineRule('features.Tremorsense',
      'features.Rooting', '=', '1',
      'featureNotes.shepherdOfTheTrees', '=', '1'
    );
    Pathfinder.featureSpells(rules,
      'Massmorph', 'Massmorph', 'charisma', classLevel, null,
      ['Diminish Plants', 'Plant Growth', 'Tree Shape', '15:Plant Shape I',
       '20:Plant Shape II']
    );
    Pathfinder.featureSpells(rules,
      'Bloodline Verdant', 'BloodlineVerdant', 'charisma',
      'bloodlineLevels.Verdant', '',
      ['3:Entangle', '5:Barkskin', '7:Speak With Plants',
       '9:Command Plants', '11:Wall Of Thorns', '13:Transport Via Plants',
       '15:Plant Shape III', '17:Animate Plants', '19:Shambler']
    );

  } else if(name == 'Wizard') {

    let allSchools = rules.getChoices('schools');
    for(let s in allSchools) {
      if(!(s in PFAPG.SCHOOLS))
        continue;
      if(s.match(/^(Air|Earth|Fire|Water)$/)) {
        Pathfinder.choiceRules(rules, 'Feature',
          'School Specialization (' + s + ')',
          Pathfinder.FEATURES['School Specialization (%school)'].replaceAll('%school', s)
        );
        Pathfinder.choiceRules(rules, 'Feature',
          'School Opposition (' + s + ')',
          Pathfinder.FEATURES['School Opposition (%school)'].replaceAll('%school', s)
        );
        let oppositeSchool = {
          'Air':'Earth', 'Earth':'Air', 'Fire':'Water', 'Water':'Fire'
        };
        rules.defineRule('wizardFeatures.School Opposition (' + oppositeSchool[s] + ')',
          'wizardFeatures.School Specialization (' + s + ')', '=', '1'
        );
        rules.defineRule('features.School Opposition (' + oppositeSchool[s] + ')',
          'wizardFeatures.School Opposition (' + oppositeSchool[s] + ')', '=', '1'
        );
        for(let i = 1; i <= 9; i++) {
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
    ['Acid Dart (Wizard)', 'Aura Of Despair', 'Blinding Ray', 'Change Shape',
     'Dazing Touch Enchantment', 'Dimensional Steps', "Diviner's Fortune",
     'Elemental Wall', 'Enchanting Smile', 'Energy Absorption', 'Force Missile',
     'Grave Touch (Wizard)', 'Intense Spells', 'Invisibility Field',
     'Power Over Undead', 'Protective Ward', 'Scrying Adept',
      'Telekinetic Fist',
    ].forEach(f => {
      rules.defineRule('wizardFeatures.' + f,
        'wizardHas' + f.replaceAll(/ |'/g, ''), '?', null
      );
    });
    rules.defineRule('wizardHasAcidDart(Wizard)',
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
      // Easier to list this archetype rather than its feature
      'wizardFeatures.School Specialization (Banishment)', '=', '0'
    );
    rules.defineRule('wizardHasForceMissile',
      'evocationLevel', '=', '1',
      'wizardFeatures.Versatile Evocation', '=', '0',
      'wizardFeatures.Wind Servant', '=', '0'
    );
    rules.defineRule('wizardHasGraveTouch(Wizard)',
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

  } else if(name == 'Battle Herald') {

    rules.defineRule('bannerLevel', classLevel, '+=', null);
    rules.defineRule('inspireCourageLevel',
      classLevel, '=', null,
     'bardicPerformanceLevel', '+', null
    );
    rules.defineRule
      ('featCount.Teamwork', 'featureNotes.teamworkFeat', '+=', '1');
    rules.defineRule('featureNotes.inspiringCommand',
      classLevel, '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('featureNotes.voiceOfAuthority', classLevel, '=', null);
    rules.defineRule
      ('features.Inspire Courage', 'featureNotes.inspiringCommand', '=', '1');
    rules.defineRule('inspiringCommandBonus',
      classLevel, '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.inspireCourage',
      'inspireCourageLevel', '=', '1 + Math.floor((source + 1) / 6)'
    );
    rules.defineRule('magicNotes.inspireGreatness',
      classLevel, '+=', 'Math.floor((source - 1) / 3)'
    );
    rules.defineRule('magicNotes.inspiringCommand',
      'charismaModifier', '=', '4 + source',
      classLevel, '+', '(source - 1) * 2'
    );
    rules.defineRule('selectableFeatureCount.Battle Herald (Inspiring Command)',
      'featureNotes.inspiringCommand', '=', null
    );
    rules.defineRule('skillNotes.voiceOfAuthority', classLevel, '=', null);
    rules.defineRule
      ('tacticianLevel', 'featureNotes.voiceOfAuthority', '+', null);

  } else if(name == 'Holy Vindicator') {

    rules.defineRule('channelLevel', classLevel, '+=', null);
    rules.defineRule('magicNotes.casterLevelBonus',
      classLevel, '+=', 'source - Math.floor((source + 3) / 4)'
    );
    Pathfinder.featureSpells(rules,
      'Divine Judgment', 'DivineJudgment', 'wisdom', classLevel, '',
      ['Death Knell']
    );
    Pathfinder.featureSpells(rules,
      'Divine Retribution', 'DivineRetribution', 'wisdom', 'casterLevel', '',
      ['Bestow Curse']
    );
    Pathfinder.featureSpells(rules,
      'Divine Wrath', 'DivineWrath', 'wisdom', 'casterLevel', '', ['Doom']
    );
    Pathfinder.featureSpells(rules,
      'Stigmata', 'Stigmata', 'wisdom', 'casterLevel', '',
      ['Bleed', 'Stabilize']
    );

  } else if(name == 'Horizon Walker') {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.terrainMastery(Plains).1', '^', 'source <= 2 ? 0 : null'
    );
    rules.defineRule('abilityNotes.terrainMastery(Plains).1',
      'features.Terrain Mastery (Plains)', '?', null,
      'armorWeight', '=', null
    );
    rules.defineRule('combatNotes.favoredTerrain',
      classLevel, '+=', 'source - Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.terrainDominance',
      'featureNotes.terrainDominance', '=', null
    );
    rules.defineRule('damageReduction.Adamantine',
      'combatNotes.terrainMastery(PlaneOfEarth)', '=', '1',
      'combatNotes.terrainDominance(Mountain)', '=', '2'
    );
    rules.defineRule('featureNotes.terrainDominance',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule('featureNotes.terrainMastery',
      classLevel, '=', 'Math.floor(source / 2) - (source==10 ? 1 : 0)'
    );
    rules.defineRule('features.Blind-Fight',
      'featureNotes.terrainMastery(Underground)', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Horizon Walker (Terrain Dominance)',
      'featureNotes.terrainDominance', '+', null
    );
    rules.defineRule('selectableFeatureCount.Horizon Walker (Terrain Mastery)',
      'featureNotes.terrainMastery', '=', null
    );
    rules.defineRule('skillNotes.favoredTerrain',
      classLevel, '+=', 'source - Math.floor(source / 3)'
    );
    rules.defineRule('skillNotes.terrainDominance',
      'featureNotes.terrainDominance', '=', null
    );
    rules.defineRule
      ('skillNotes.terrainMastery', 'featureNotes.terrainMastery', '=', null);
    Pathfinder.featureSpells(rules,
      'Terrain Dominance (Astral Plane)', 'AstralPlaneDominance', 'charisma',
      'level', null, ['Dimension Door']
    );
    Pathfinder.featureSpells(rules,
      'Terrain Dominance (Ethereal Plane)', 'EtherealPlaneDominance',
      'charisma', 'level', null, ['Ethereal Jaunt']
    );
    Pathfinder.featureSpells(rules,
      'Terrain Dominance (Forest)', 'ForestDominance', 'charisma',
      'level', '', ['Hallucinatory Terrain']
    );
    Pathfinder.featureSpells(rules,
      'Terrain Dominance (Jungle)', 'JungleDominance', 'charisma',
      'level', '', ['Charm Monster']
    );
    Pathfinder.featureSpells(rules,
      'Terrain Dominance (Plane Of Air)', 'PlaneOfAirDominance', 'charisma',
      'level', null, ['Fly']
    );
    Pathfinder.featureSpells(rules,
      'Terrain Dominance (Urban)', 'UrbanDominance', 'charisma', 'level',
      '', ['Charm Person']
    );

  } else if(name == 'Master Chymist') {

    rules.defineRule('bloodlineDraconicLevel', classLevel, '+=', null);
    ['Black', 'Blue', 'Brass', 'Bronze', 'Copper', 'Gold', 'Green', 'Red',
     'Silver', 'White'].forEach(c => {
      rules.defineRule('combatNotes.draconic(' + c + ')Mutagen',
        classLevel, '=', '10 + source',
        'intelligenceModifier', '+', null
      );
    });
    rules.defineRule('effectiveAlchemistLevel',
      'combatNotes.bomb-Thrower', '+', 'null', // italics no-op
      classLevel, '+', null
    );
    rules.defineRule('featureNotes.advancedMutagen',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('featureNotes.mutate',
      classLevel, '=', 'source>=10 ? 5 : source>= 8 ? 4 : source>=5 ? 3 : 2'
    );
    rules.defineRule('knowsGrowthExtract',
      'spells.Enlarge Person(Alchemist1 Tran)', '=', '1',
      'spells.Giant Form I(Alchemist6 Tran)', '=', '1',
      'spells.Polymorph(Alchemist5 Tran)', '=', '1'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      classLevel, '+=', 'source - 1 - Math.floor(source / 4)'
    );
    rules.defineRule
      ('magicNotes.feralMutagen', 'combatNotes.furiousMutagen', '+', '2');
    rules.defineRule
      ('magicNotes.feralMutagen.1', 'combatNotes.furiousMutagen', '+', '2');
    rules.defineRule
      ('magicNotes.mutagen', 'magicNotes.extendedMutagen', '*', '2');
    rules.defineRule('selectableFeatureCount.Master Chymist (Advanced Mutagen)',
      'featureNotes.advancedMutagen', '=', null
    );

  } else if(name == 'Master Spy') {

    rules.defineRule('combatNotes.deathAttack', classLevel, '+=', null);
    rules.defineRule('combatNotes.deathAttack.1', classLevel, '+=', null);
    rules.defineRule('skillNotes.artOfDeception', classLevel, '=', null);
    rules.defineRule
      ('sneakAttack', classLevel, '+=', 'Math.floor((source + 2) / 3)');
    Pathfinder.featureSpells(rules,
      'Nonmagical Aura', 'NonmagicalAura', 'charisma', 'level', '',
      ['Magic Aura']
    );

  } else if(name == 'Nature Warden') {

    let allClasses =
     Object.assign({}, rules.getChoices('levels'),
                       rules.getChoices('prestiges'),
                       rules.getChoices('nPCs'));
    for(let c in allClasses) {
      if(allClasses[c].includes('CasterLevelDivine=') &&
         allClasses[c].includes('SpellSlots=')) {
        let slots =
          allClasses[c].replace(/.*SpellSlots/, '').replace(/\s.*/, '');
        let matchInfo = slots.match(/\w+2:/g);
        if(matchInfo) {
          matchInfo.forEach(m => {
            rules.defineRule('hasLevel2DivineSpells',
              'spellSlots.' + m.replace(':', ''), '=', '1'
            );
          });
        }
      }
    }
    rules.defineRule('combatNotes.favoredTerrain',
      classLevel, '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('companionMasterLevel', classLevel, '+', null);
    rules.defineRule('companionNotes.companionBond(NatureWarden)-1',
      classLevel, '?', 'source>=5'
    );
    rules.defineRule('featureNotes.survivalist(NatureWarden).1',
      classLevel, '=', 'source>=10 ? "/Improvised weapons and tools are considered masterwork after 1 min examination" : ""'
    );
    rules.defineRule('features.Empathic Link',
      'companionNotes.companionBond(NatureWarden)', '=', '1'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      classLevel, '+=', 'source - Math.floor((source + 3) / 4)'
    );
    rules.defineRule('skillNotes.favoredTerrain',
      classLevel, '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('skillNotes.naturalEmpathy', classLevel, '=', null);
    rules.defineRule('skillNotes.naturalEmpathy.1',
      classLevel, '=', 'source>=4 ? "/May use Wild Empathy w/magical beasts" + (source>=10 ? ", vermin, and plant creatures" : source>=7 ? " and vermin" : "") + " w/out penalty" : ""'
    );
    Pathfinder.featureSpells(rules,
      'Animal Speech', 'AnimalSpeech', 'charisma', classLevel, '',
      ['Speak With Animals']
    );
    Pathfinder.featureSpells(rules,
      'Woodforging', 'Woodforging', 'charisma', classLevel, '',
      ['Wood Shape', 'Ironwood']
    );
    Pathfinder.featureSpells(rules,
      'Plant Speech', 'PlantSpeech', 'charisma', classLevel, '',
      ['Speak With Plants']
    );
    Pathfinder.featureSpells(rules,
      'Companion Soul', 'CompanionSoul', 'charisma', classLevel, '',
      ['Scrying', 'Raise Dead']
    );

  } else if(name == 'Rage Prophet') {

    rules.defineRule('combatNotes.savageSeer', classLevel, '=', null);
    rules.defineRule('magicNotes.casterLevelBonus',
      classLevel, '+=', 'source - 1 - (source>=8 ? 2 : source>=5 ? 1 : 0)'
    );
    Pathfinder.featureSpells(rules,
      'Spirit Guide', 'SpiritGuide', 'charisma', classLevel, '',
      ['Guidance', 'Dancing Lights', 'Ghost Sound', 'Mage Hand']
    );

  } else if(name == 'Stalwart Defender') {

    rules.defineRule('combatNotes.armorClassBonus(StalwartDefender)',
      classLevel, '=', 'Math.floor((source + 2) / 3)'
    );
    // Can reuse barbarian DR feature, but they don't stack
    rules.defineRule('combatNotes.damageReduction',
      classLevel, '^=', 'source>=10 ? 5 : source>=7 ? 3 : source>=5 ? 1 : null'
    );
    rules.defineRule
      ('combatNotes.improvedUncannyDodge', classLevel, '+=', null);
    rules.defineRule('combatNotes.increasedDamageReduction',
      'stalwartDefenderFeatures.Increased Damage Reduction', '=', null
    );
    rules.defineRule('featureNotes.defensivePowers',
      classLevel, '=', 'Math.floor(source /2 )'
    );
    rules.defineRule('selectableFeatureCount.Stalwart Defender (Defensive Power)',
      'featureNotes.defensivePowers', '=', null
    );
    rules.defineRule
      ('skillNotes.bulwark', 'skillNotes.armorSkillCheckPenalty', '=', null);
    rules.defineRule
      ('uncannyDodgeSources', classLevel, '+=', 'source>=3 ? 1 : null');
    // Extend notes for rage features reused for defensive stance
    ['Clear Mind', 'Increased Damage Reduction', 'Internal Fortitude',
     'Unexpected Strike'].forEach(f => {
      let section =
        QuilvynUtils.getAttrValue(Pathfinder.FEATURES[f], 'Section');
      let note = section + 'Notes.' + f.charAt(0).toLowerCase() + f.substring(1).replaceAll(' ', '');
      if(note in rules.getChoices('notes'))
        rules.getChoices('notes')[note] += ' or stance';
      else
        console.log('Cannot find note ' + note);
    });

  }

  if(featureReplacements) {
    for(let f in featureReplacements) {
      let prefix =
        name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '');
      let hasVar = prefix + 'Has' + f.replaceAll(/[-' ]/g, '');
      rules.defineRule(hasVar, classLevel, '=', '1');
      featureReplacements[f].forEach(r => {
        rules.defineRule(hasVar, prefix + 'Features.' + r, '=', '0');
      });
      rules.defineRule(prefix + 'Features.' + f, hasVar, '?', 'source==1');
    }
  }

};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
PFAPG.featRulesExtra = function(rules, name) {
  let matchInfo;
  if(name == 'Arcane Talent') {
    rules.defineRule('spellSlots.Talent0', 'features.Arcane Talent', '=', '1');
    rules.defineRule('casterLevels.Talent',
      'spellSlots.Talent0', '?', null,
      'level', '=', null
    );
    rules.defineRule('spellDifficultyClass.Talent',
      'casterLevels.Talent', '?', null,
      'charismaModifier', '=', '10 + source'
    );
  } else if(name == 'Aspect Of The Beast (Claws Of The Beast)') {
    rules.defineRule('features.Weapon Proficiency (Claws)',
      'combatNotes.aspectOfTheBeast(ClawsOfTheBeast)', '=', '1'
    );
    rules.defineRule('weapons.Claws',
      'combatNotes.aspectOfTheBeast(ClawsOfTheBeast)', '=', '1'
    );
    Pathfinder.weaponRules(rules, 'Claws', 'Unarmed', 'Unarmed', 'd4', 20, 2);
  } else if(name == 'Aspect Of The Beast (Night Senses)') {
    rules.defineRule('featureNotes.aspectOfTheBeast(NightSenses)',
      '', '=', '"x2 normal distance in poor light"',
      'features.Low-Light Vision', '=', '"30\' b/w vision in darkness"',
      'features.Darkvision', '=', '"+30\' Darkvision"'
    );
  } else if(name == 'Breadth Of Experience') {
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
    rules.defineRule('combatNotes.elementalFist.1',
      'features.Elemental Fist', '?', null,
      'level', '=', 'Math.floor(source / 4)',
      'combatNotes.elementalFist.2', '^', null
    );
    rules.defineRule('combatNotes.elementalFist.2',
      'features.Elemental Fist', '?', null,
      'levels.Monk', '=', null,
      'combatNotes.elementalFist.3', '+', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.elementalFist.3',
      'features.Elemental Fist', '?', null,
      'level', '=', null,
      'levels.Monk', '+', '-source'
    );
  } else if(name == 'Expanded Arcana') {
    rules.defineRule
      ('magicNotes.expandedArcana', 'feats.Expanded Arcana', '=', null);
    rules.defineRule('magicNotes.expandedArcana.1',
      'feats.Expanded Arcana', '=', 'source * 2'
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
  } else if(name == 'Favored Defense') {
    rules.defineRule
      ('combatNotes.favoredDefense', 'feats.Favored Defense', '=', null);
  } else if(name == 'Gnome Trickster') {
    Pathfinder.featureSpells(rules,
      'Gnome Trickster', 'GnomeTrickster', 'charisma', 'level', '',
      ['Mage Hand', 'Prestidigitation']
    );
  } else if(name == 'Improved Stonecunning') {
    rules.defineRule
      ('skillNotes.stonecunning', 'skillNotes.improvedStonecunning', '+', '2');
  } else if(name == 'Keen Scent') {
    rules.defineRule('features.Scent', 'featureNotes.keenScent', '=', '1');
  } else if(name == 'Major Spell Expertise') {
    rules.defineRule('magicNotes.majorSpellExpertise',
      'feats.Major Spell Expertise', '=', null
    );
  } else if(name == 'Minor Spell Expertise') {
    rules.defineRule('magicNotes.minorSpellExpertise',
      'feats.Minor Spell Expertise', '=', null
    );
  } else if(name == 'Mounted Shield') {
    rules.defineRule('combatNotes.mountedShield',
      'shield', '=', 'source=="None" ? 0 : source.match(/Heavy/) ? 2 : source.match(/Tower/) ? 4 : 1',
      'combatNotes.shieldFocus', '+', '1',
      'combatNotes.greaterShieldFocus', '+', '1'
    );
  } else if(name == 'Perfect Strike') {
    rules.defineRule('combatNotes.perfectStrike', '', '=', '2');
    rules.defineRule('combatNotes.perfectStrike.1',
      'features.Perfect Strike', '?', null,
      '', '=', '"kama, nunchaku, quarterstaff, sai, or siangham"',
      'features.Zen Archer', '=', '"bow"'
    );
    rules.defineRule('combatNotes.perfectStrike.2',
      'features.Perfect Strike', '?', null,
      'level', '=', 'Math.floor(source / 4)',
      'combatNotes.perfectStrike.3', '^', null
    );
    rules.defineRule('combatNotes.perfectStrike.3',
      'features.Perfect Strike', '?', null,
      'levels.Monk', '=', null,
      'combatNotes.perfectStrike.4', '+', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.perfectStrike.4',
      'features.Perfect Strike', '?', null,
      'level', '=', null,
      'levels.Monk', '+', '-source'
    );
  } else if(name == 'Point-Blank Master') {
    let allWeapons = rules.getChoices('weapons');
    for(let w in allWeapons)
      if(allWeapons[w].includes('Category=Ranged'))
        rules.defineRule('rangedWeaponSpecialization',
          'features.Weapon Specialization (' + w + ')', '+=', '1'
        );
  } else if(name == 'Practiced Tactician') {
    rules.defineRule('combatNotes.practicedTactician',
      'feats.Practiced Tactician', '=', null
    );
    rules.defineRule
      ('combatNotes.tactician', 'combatNotes.practicedTactician', '+', null);
  } else if(name == 'Preferred Spell') {
    rules.defineRule
      ('magicNotes.preferredSpell', 'feats.Preferred Spell', '=', null);
  } else if(name == 'Punishing Kick') {
    rules.defineRule('combatNotes.punishingKick', '', '=', '5');
    rules.defineRule('combatNotes.punishingKick.1',
      'features.Punishing Kick', '?', null,
      'level', '=', 'Math.floor(source / 4)',
      'combatNotes.punishingKick.2', '^', null
    );
    rules.defineRule('combatNotes.punishingKick.2',
      'features.Punishing Kick', '?', null,
      'levels.Monk', '=', null,
      'combatNotes.punishingKick.3', '+', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.punishingKick.3',
      'features.Punishing Kick', '?', null,
      'level', '=', null,
      'levels.Monk', '+', '-source'
    );
  } else if(name == 'Razortusk') {
    rules.defineRule
      ('features.Weapon Proficiency (Bite)', 'combatNotes.razortusk', '=', '1');
    rules.defineRule('weapons.Bite', 'combatNotes.razortusk', '=', '1');
    Pathfinder.weaponRules(rules, 'Bite', 'Unarmed', 'Unarmed', 'd4', 20, 2);
  } else if(name == 'Sharp Senses') {
    rules.defineRule
      ('skillNotes.keenSenses', 'skillNotes.sharpSenses', '+', '2');
  } else if((matchInfo = name.match(/^Shield Specialization .(.*)./)) != null) {
    rules.defineRule('combatNotes.shieldSpecialization(' + matchInfo[1] + ')',
      'shield', '=', 'source=="None" ? 0 : source.match(/Heavy/) ? 2 : source.match(/Tower/) ? 4 : 1',
      'features.Shield Focus', '+', '1',
      'features.Greater Shield Focus', '+', '1'
    );
  } else if(name == 'Touch Of Serenity') {
    rules.defineRule('combatNotes.touchOfSerenity', '', '=', '1');
    rules.defineRule('combatNotes.touchOfSerenity.1',
      'features.Touch Of Serenity', '?', null,
      'level', '=', 'Math.floor(source / 4)',
      'combatNotes.touchOfSerenity.2', '^', null
    );
    rules.defineRule('combatNotes.touchOfSerenity.2',
      'features.Touch Of Serenity', '?', null,
      'levels.Monk', '=', null,
      'combatNotes.touchOfSerenity.3', '+', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.touchOfSerenity.3',
      'features.Touch Of Serenity', '?', null,
      'level', '=', null,
      'levels.Monk', '+', '-source'
    );
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
    rules.defineRule('weapons.Bite', 'combatNotes.toothy', '=', '1');
  } else if(name.match(/Dwarf/)) {
    rules.defineRule('saveNotes.hardy.1', 'saveNotes.steelSoul', '+', '2');
    alternatives = [
      ['Dwarf Hatred', 'Ancient Enmity'],
      ['Greed', 'Craftsman', 'Lorekeeper (Dwarf)'],
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
    rules.defineRule('features.Weapon Proficiency (Longspear)',
      'featureNotes.spiritOfTheWaters', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Net)',
      'featureNotes.spiritOfTheWaters', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Trident)',
      'featureNotes.spiritOfTheWaters', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Elf (Racial Trait)',
      'elfFeatures.Lightbringer', '+', '-1',
      'elfFeatures.Spirit Of The Waters', '+', '-1'
    );
    Pathfinder.featureSpells(rules,
      'Dreamspeaker', 'Dreamspeaker', 'charisma', 'level', '', ['Dream']
    );
    rules.defineRule
      ('casterLevels.Dreamspeaker', 'charisma', '?', 'source >= 15');
    rules.defineRule
      ('spells.Dream(Dreamspeaker5 Illu)', 'charisma', '?', 'source>=15');
    Pathfinder.featureSpells(rules,
      'Lightbringer', 'Lightbringer', 'intelligence', 'level', '', ['Light']
    );
    rules.defineRule
      ('casterLevels.Lightbringer', 'intelligence', '?', 'source>=10');
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
    rules.defineRule('combatNotes.pyromaniac', '?', 'levels.Alchemist', null);
    rules.defineRule('languageCount', 'skillNotes.giftOfTongues.1', '+', null);
    rules.defineRule('skillNotes.giftOfTongues.1',
      'features.Gift Of Tongues', '?', null,
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
    Pathfinder.featureSpells(rules,
      'Magical Linguist', 'MagicalLinguist', 'charisma', 'level', '',
      ['Arcane Mark', 'Comprehend Languages', 'Message', 'Read Magic']
    );
    rules.defineRule
      ('casterLevels.MagicalLinguist', 'charisma', '?', 'source >= 11');
    Pathfinder.featureSpells(rules,
      'Pyromaniac', 'Pyromaniac', 'charisma', 'level', '',
      ['Dancing Lights', 'Flare', 'Prestidigitation', 'Produce Flame']
    );
    rules.defineRule
      ('casterLevels.Pyromaniac', 'charisma', '?', 'source >= 11');
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
    QuilvynRules.prerequisiteRules
      (rules, 'sanity', 'practicality', 'features.Practicality',
       "Sum 'skills.Craft' > 0 || Sum 'skills.Profession' > 0 || skills.Sense Motive > 0");
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
    alternatives.forEach(group => {
      // Override level-based feature acquisition
      rules.defineRule
        (prefix + 'Features.' + group[0], prefix + 'Level', '=', 'null');
      group.forEach(choice => {
        let note =
          'validationNotes.' + prefix + '-' + choice.replaceAll(' ' , '') + 'Alternatives';
        let prohibited = [];
        alternatives.forEach(group => {
          if(group.includes(choice))
            prohibited = prohibited.concat(group.filter(x => x != choice));
        });
        // Filter duplicates
        prohibited =
          prohibited.filter((item, idx) => prohibited.indexOf(item) == idx);
        let text = choice + ' may not be combined with ' + 
            prohibited.join(prohibited.length == 2 ? ' or ' : ', ');
        text = text.replace(/,([^,]*)$/, ', or $1');
        rules.defineChoice('notes', note + ':' + text);
        rules.defineRule(note, prefix + 'Features.' + choice, '=', '0');
        prohibited.forEach(alt => {
          rules.defineRule(note, prefix + 'Features.' + alt, '+', '1');
        });
      });
    });
  }
};

/*
 * Defines in #rules# the rules associated with school #name# that cannot be
 * derived directly from the parameters passed to schoolRules.
 */
PFAPG.schoolRulesExtra = function(rules, name) {
  var prefix =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ','');
  var schoolLevel = prefix + 'Level';
  if(name == 'Air') {
    rules.defineRule('skillNotes.airSupremacy',
      schoolLevel, '=', '2 + Math.floor(source / 5)'
    );
    rules.defineRule
      ('skillNotes.airSupremacy-1', schoolLevel, '?', 'source>=20');
    Pathfinder.featureSpells(rules,
      'Air Supremacy', 'AirSupremacy', 'intelligence', schoolLevel, null,
      ['Feather Fall', '5:Levitate', '10:Fly']
    );
  } else if(name == 'Controller') {
    Pathfinder.featureSpells(rules,
      'Irresistible Demand', 'IrresistibleDemand', 'intelligence', schoolLevel,
      '10+' + schoolLevel + '//2+intelligenceModifier', ['Dominate Monster']
    );
  } else if(name == 'Counterspell') {
    rules.defineRule('features.Improved Counterspell',
      'featureNotes.counterspellMastery', '=', '1'
    );
  } else if(name == 'Creation') {
    Pathfinder.featureSpells(rules,
      "Creator's Will", 'CreatorsWill', 'intelligence', schoolLevel, null,
      ['Minor Creation', '8:Major Creation']
    );
  } else if(name == 'Earth') {
    rules.defineRule
      ('abilityNotes.earthGlide', schoolLevel, '=', 'source + " rd"');
    rules.defineRule('abilityNotes.earthGlide.1',
      'features.Earth Glide', '?', null,
      schoolLevel, '=', '""'
    );
    rules.defineRule
      ('magicNotes.earthSupremacy', schoolLevel, '?', 'source>=20');
  } else if(name == 'Manipulator') {
    Pathfinder.featureSpells(rules,
      'Beguiling Touch', 'BeguilingTouch', 'intelligence', schoolLevel,
      '10+manipulatorLevel//2+intelligenceModifier', ['Charm Monster']
    );
  } else if(name == 'Teleportation') {
    Pathfinder.featureSpells(rules,
      'Shift', 'Shift', 'intelligence', schoolLevel, null, ['Dimension Door']
    );
  } else if(name == 'Water') {
    rules.defineRule
      ('abilityNotes.waterSupremacy', schoolLevel, '?', 'source>=10');
    rules.defineRule('skillNotes.waterSupremacy',
      schoolLevel, '=', '2 + Math.floor(source / 5)'
    );
    rules.defineRule
      ('skillNotes.waterSupremacy-1', schoolLevel, '?', 'source>=20');
  }
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
PFAPG.randomizeOneAttribute = function(attributes, attribute) {
  // Handle limited animal companion choices of Cavalier and Summoner classes
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
  // Avoid inappropriate selection of Witch sponsor and Rage Prophet spells
  let removedSpells = null;
  if(attribute == 'spells' &&
     ('levels.Oracle' in attributes || 'levels.Witch' in attributes)) {
    let qualifiedSpells = [];
    let unqualifiedSpells = [];
    let limitedSpells = {
      'prestige.Rage Prophet': [
        'Arcane Eye(O4 Divi)', 'Dream(O5 Illu)', 'See Invisibility(O2 Divi)',
        'Shadow Walk(O6 Illu)', 'Spectral Hand(O2 Necr)',
        'Unseen Servant(O1 Conj)', 'Vision(O7 Divi)', 'Whispering Wind(O2 Tran)'
      ],
      'selectableFeatures.Oracle - Battle Mystery': [
        'Enlarge Person(O1 Tran)', 'Fog Cloud(O2 Conj)', 'Wall Of Fire(O4 Evoc)'
      ],
      'selectableFeatures.Oracle - Bones Mystery': [
        'False Life(O2 Necr)', 'Fear(O4 Necr)', 'Circle Of Death(O6 Necr)',
        'Control Undead(O7 Necr)', 'Horrid Wilting(O8 Necr)',
        'Wail Of The Banshee(O9 Necr)'
      ],
      'selectableFeatures.Oracle - Flame Mystery': [
        'Burning Hands(O1 Evoc)', 'Fireball(O3 Evoc)', 'Wall Of Fire(O4 Evoc)',
        'Fire Seeds(O6 Conj)', 'Incendiary Cloud(O8 Conj)',
        'Fiery Body(O9 Tran)'
      ],
      'selectableFeatures.Oracle - Friend To The Animals': [
        "Summon Nature's Ally I(O1 Conj)", "Summon Nature's Ally II(O2 Conj)",
        "Summon Nature's Ally III(O3 Conj)", "Summon Nature's Ally IV(O4 Conj)",
        "Summon Nature's Ally V(O5 Conj)", "Summon Nature's Ally VI(O6 Conj)",
        "Summon Nature's Ally VII(O7 Conj)",
        "Summon Nature's Ally VIII(O8 Conj)", "Summon Nature's Ally IX(O9 Conj)"
      ],
      'selectableFeatures.Oracle - Haunted': [
        'Mage Hand(O0 Tran)', 'Ghost Sound(O0 Illu)', 'Levitate(O2 Tran)',
        'Minor Image(O2 Illu)', 'Telekinesis(O5 Tran)',
        'Reverse Gravity(O7 Tran)'
      ],
      'selectableFeatures.Oracle - Heavens Mystery': [
        'Color Spray(O1 Illu)', 'Hypnotic Pattern(O2 Illu)',
        'Rainbow Pattern(O4 Illu)', 'Overland Flight(O5 Tran)',
        'Chain Lightning(O6 Evoc)', 'Prismatic Spray(O7 Evoc)',
        'Sunburst(O8 Evoc)', 'Meteor Swarm(O9 Evoc)'
      ],
      'selectableFeatures.Oracle - Lore Mystery': [
        'Identify(O1 Divi)', 'Legend Lore(O4 Divi)',
        'Contact Other Plane(O5 Divi)', 'Vision(O7 Divi)',
        'Moment Of Prescience(O8 Divi)', 'Time Stop(O9 Tran)'
      ],
      'selectableFeatures.Oracle - Nature Mystery': [
        'Charm Animal(O1 Ench)', 'Barkskin(O2 Tran)',
        'Speak With Plants(B4 Divi)', 'Grove Of Respite(O4 Conj)',
        'Awaken(O5 Tran)', 'Stone Tell(O6 Divi)', 'Creeping Doom(O7 Conj)',
        'Animal Shapes(O8 Tran)', 'World Wave(O9 Tran)'
      ],
      'selectableFeatures.Oracle - Stone Mystery': [
        'Stone Call(O2 Conj)', 'Stoneskin(O5 Abju)', 'Stone Tell(O6 Divi)',
        'Statue(O7 Tran)', 'Repel Metal Or Stone(O8 Abju)',
        'Clashing Rocks(O9 Conj)'
      ],
      'selectableFeatures.Oracle - Waves Mystery': [
        'Touch Of The Sea(O1 Tran)', 'Slipstream(O2 Conj)',
        'Wall Of Ice(O4 Evoc)', 'Geyser(O5 Conj)', 'Fluid Form(O6 Tran)',
        'Vortex(O7 Evoc)', 'Seamantle(O8 Conj)', 'Tsunami(O9 Conj)'
      ],
      'selectableFeatures.Oracle - Wind Mystery': [
        'Alter Winds(O1 Tran)', 'Gust Of Wind(O2 Evoc)',
        'Cloak Of Winds(O3 Abju)', 'River Of Wind(O4 Evoc)',
        'Control Winds(O5 Tran)', 'Sirocco(O6 Evoc)', 'Whirlwind(O8 Evoc)'
      ],
      'selectableFeatures.Witch - Agility Patron': [
        'Jump(Witch1 Tran)', "Cat's Grace(Witch2 Tran)",
        'Haste(Witch3 Tran)', 'Freedom Of Movement(Witch4 Abju)',
        'Polymorph(Witch5 Tran)', "Mass Cat's Grace(Witch6 Tran)",
        'Ethereal Jaunt(Witch7 Tran)', 'Animal Shapes(Witch8 Tran)',
        'Shapechange(Witch9 Tran)'
      ],
      'selectableFeatures.Witch - Animals Patron': [
        'Charm Animal(Witch1 Ench)', 'Speak With Animals(Witch2 Divi)',
        'Dominate Animal(Witch3 Ench)', "Summon Nature's Ally IV(Witch4 Conj)",
        'Animal Growth(Witch5 Tran)', 'Antilife Shell(Witch6 Abju)',
        'Beast Shape IV(Witch7 Tran)', 'Animal Shapes(Witch8 Tran)',
        "Summon Nature's Ally IX(Witch9 Conj)"
      ],
      'selectableFeatures.Witch - Deception Patron': [
        'Ventriloquism(Witch1 Illu)', 'Invisibility(Witch2 Illu)',
        'Blink(Witch3 Tran)', // Confusion is on the Witch4 spell list
        'Passwall(Witch5 Tran)', 'Programmed Image(Witch6 Illu)',
        'Mass Invisibility(Witch7 Illu)', 'Scintillating Pattern(Witch8 Illu)',
        'Time Stop(Witch9 Tran)'
      ],
      'selectableFeatures.Witch - Elements Patron': [
        'Shocking Grasp(Witch1 Evoc)', 'Flaming Sphere(Witch2 Evoc)',
        'Fireball(Witch3 Evoc)', 'Wall Of Ice(Witch4 Evoc)',
        'Flame Strike(Witch5 Evoc)', 'Freezing Sphere(Witch6 Evoc)',
        'Vortex(Witch7 Evoc)', 'Fire Storm(Witch8 Evoc)',
        'Meteor Swarm(Witch9 Evoc)'
      ],
      'selectableFeatures.Witch - Endurance Patron': [
        'Endure Elements(Witch1 Abju)', "Bear's Endurance(Witch2 Tran)",
        'Protection From Energy(Witch3 Abju)', 'Spell Immunity(Witch4 Abju)',
        'Spell Resistance(Witch5 Abju)', "Mass Bear's Endurance(Witch6 Tran)",
        'Greater Restoration(Witch7 Conj)', 'Iron Body(Witch8 Tran)',
        'Miracle(Witch9 Evoc)'
      ],
      'selectableFeatures.Witch - Plague Patron': [
        'Detect Undead(Witch1 Divi)', 'Command Undead(Witch2 Necr)',
        'Contagion(Witch3 Necr)', 'Animate Dead(Witch4 Necr)',
        'Giant Vermin(Witch5 Tran)', 'Create Undead(Witch6 Necr)',
        'Control Undead(Witch7 Necr)', 'Create Greater Undead(Witch8 Necr)',
        'Energy Drain(Witch9 Necr)'
      ],
      'selectableFeatures.Witch - Shadow Patron': [
        'Silent Image(Witch1 Illu)', 'Darkness(Witch2 Evoc)',
        'Deeper Darkness(Witch3 Evoc)', 'Shadow Conjuration(Witch4 Illu)',
        'Shadow Evocation(Witch5 Illu)', 'Shadow Walk(Witch6 Illu)',
        'Greater Shadow Conjuration(Witch7 Illu)',
        'Greater Shadow Evocation(Witch8 Illu)', 'Shades(Witch9 Illu)'
      ],
      'selectableFeatures.Witch - Strength Patron': [
        'Divine Favor(Witch1 Evoc)', "Bull's Strength(Witch2 Tran)",
        'Greater Magic Weapon(Witch3 Tran)', 'Divine Power(Witch4 Evoc)',
        'Righteous Might(Witch5 Tran)', "Mass Bull's Strength(Witch6 Tran)",
        'Giant Form I(Witch7 Tran)', 'Giant Form II(Witch8 Tran)',
        'Shapechange(Witch9 Tran)'
      ],
      'selectableFeatures.Witch - Transformation Patron': [
        'Jump(Witch1 Tran)', "Bear's Endurance(Witch2 Tran)",
        'Beast Shape I(Witch3 Tran)', 'Beast Shape II(Witch4 Tran)',
        'Beast Shape III(Witch5 Tran)', 'Form Of The Dragon I(Witch6 Tran)',
        'Form Of The Dragon II(Witch7 Tran)',
        'Form Of The Dragon III(Witch8 Tran)', 'Shapechange(Witch9 Tran)'
      ],
      'selectableFeatures.Witch - Trickery Patron': [
        'Animate Rope(Witch1 Tran)', 'Mirror Image(Witch2 Illu)',
        'Major Image(Witch3 Illu)', 'Hallucinatory Terrain(Witch4 Illu)',
        'Mirage Arcana(Witch5 Illu)', 'Mislead(Witch6 Illu)',
        'Reverse Gravity(Witch7 Tran)', 'Screen(Witch8 Illu)',
        'Time Stop(Witch9 Tran)'
      ],
      'selectableFeatures.Witch - Water Patron': [
        'Bless Water(Witch1 Tran)', 'Curse Water(Witch1 Necr)',
        'Slipstream(Witch2 Conj)', 'Water Breathing(Witch3 Tran)',
        'Control Water(Witch4 Tran)', 'Geyser(Witch5 Conj)',
        'Elemental Body III(Witch6 Tran)', 'Elemental Body IV(Witch7 Tran)',
        'Seamantle(Witch8 Conj)', 'Tsunami(Witch9 Conj)'
      ],
      'selectableFeatures.Witch - Wisdom Patron': [
        'Shield Of Faith(Witch1 Abju)', "Owl's Wisdom(Witch2 Tran)",
        'Magic Vestment(Witch3 Tran)',
        'Lesser Globe Of Invulnerability(Witch4 Abju)', 'Dream(Witch5 Illu)',
        'Globe Of Invulnerability(Witch6 Abju)', 'Spell Turning(Witch7 Abju)',
        'Protection From Spells(Witch8 Abju)', "Mage's Disjunction(Witch9 Abju)"
      ]
    };
    for(let l in limitedSpells) {
      if(l in attributes)
        qualifiedSpells = qualifiedSpells.concat(limitedSpells[l]);
      else
        unqualifiedSpells = unqualifiedSpells.concat(limitedSpells[l]);
    }
    removedSpells = {};
    unqualifiedSpells = [...new Set(unqualifiedSpells)]; // remove duplicates
    unqualifiedSpells.forEach(s => {
      if(qualifiedSpells.includes(s))
        ; // empty; handles spells appearing in multiple lists
      else if(s in this.choices.spells) {
        removedSpells[s] = this.choices.spells[s];
        delete this.choices.spells[s];
      } else
        console.log('Unknown spell "' + s + '"');
    });
  }
  Pathfinder.randomizeOneAttribute.apply
    (Pathfinder.rules, [attributes, attribute]);
  if(removedSpells)
    Object.assign(this.choices.spells, removedSpells);
};

/* Returns HTML body content for user notes associated with this rule set. */
PFAPG.ruleNotes = function() {
  return '' +
    "<h2>Quilvyn Pathfinder Advanced Player's Guide Rule Set Notes</h2>\n" +
    '<p>\n' +
    "Quilvyn Pathfinder Advanced Player's Guide Rule Set Version " + PFAPG.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn gives the Oracle class its own spell list ("O" spells),\n' +
    '    rather than using spells from the Cleric list. The Oracle spell\n' +
    '    list includes spells particular to individual mysteries and curses\n' +
    '    as well as those particular to the Rage Prophet prestige class;\n' +
    '    when randomly assigning spells, Quilvyn restricts these spells to\n' +
    '    characters with the appropriate feature or Rage Prophet levels.\n' +
    '  </li><li>\n' +
    '    Quilvyn includes in the Witch spell list spells that are made\n' +
    '    available by specific patrons. Quilvyn randomly assigns these\n' +
    '    spells only to characters with the appropriate patron.\n' +
    '  </li><li>\n' +
    '    You can define characters with class features from the core rules\n' +
    '    by selecting the Core archetypes. For example, selecting Core Bard\n' +
    '    gives you a character with the core rule bard features.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Limitations</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn does not note that save DCs for spells cast via the\n' +
    '    Major/Minor Spell Expertise feats are charisma-based.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note the Expanded Arcana requirement that the\n' +
    '    character has levels in a class with limited spells known.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not note the age requirement (100 years or older) for\n' +
    '    the Breadth Of Experience feat.\n' +
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

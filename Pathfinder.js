/* $Id: Pathfinder.js,v 1.1 2011/03/24 23:06:33 jhayes Exp $ */

/*
Copyright 2011, James J. Hayes

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

var PATHFINDER_VERSION = '0.1-20110315';

/*
 * This module loads the rules from the Pathfinder Core Rulebook.  The
 * Pathfinder function contains methods that load rules for particular parts of
 * the PCR; raceRules for character races, magicRules for spells, etc.  These
 * member methods can be called independently in order to use a subset of the
 * PCR rules.  Similarly, the constant fields of Pathfinder (ALIGNMENTS, FEATS,
 * etc.) can be manipulated to modify the choices.
 */
function Pathfinder() {
  var rules = new ScribeRules('Pathfinder', PATHFINDER_VERSION);
  Pathfinder.viewer = new ObjectViewer();
  Pathfinder.createViewers(rules, Pathfinder.VIEWERS);
  Pathfinder.abilityRules(rules);
  Pathfinder.raceRules(rules, Pathfinder.LANGUAGES, Pathfinder.RACES);
  Pathfinder.classRules(rules, Pathfinder.CLASSES);
  Pathfinder.companionRules(rules, Pathfinder.COMPANIONS);
  Pathfinder.skillRules(rules, Pathfinder.SKILLS, Pathfinder.SUBSKILLS);
  Pathfinder.featRules(rules, Pathfinder.FEATS, Pathfinder.SUBFEATS);
  Pathfinder.descriptionRules
    (rules, Pathfinder.ALIGNMENTS, Pathfinder.DEITIES, Pathfinder.GENDERS);
  Pathfinder.equipmentRules
    (rules, Pathfinder.ARMORS, Pathfinder.GOODIES, Pathfinder.SHIELDS,
     Pathfinder.WEAPONS);
  Pathfinder.combatRules(rules);
  Pathfinder.movementRules(rules);
  Pathfinder.magicRules
    (rules, Pathfinder.CLASSES, Pathfinder.DOMAINS, Pathfinder.SCHOOLS);
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', Pathfinder.RANDOMIZABLE_ATTRIBUTES);
  rules.editorElements = SRD35.initialEditorElements();
  rules.randomizeOneAttribute = SRD35.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = Pathfinder.ruleNotes;
  Scribe.addRuleSet(rules);
  Pathfinder.rules = rules;
}

// Arrays of choices
Pathfinder.ALIGNMENTS = SRD35.ALIGNMENTS; // No changes
Pathfinder.ARMORS = SRD35.ARMORS; // No changes
Pathfinder.ATTACK_BONUS_GOOD = SRD35.ATTACK_BONUS_GOOD; // No changes
Pathfinder.ATTACK_BONUS_AVERAGE = SRD35.ATTACK_BONUS_AVERAGE; // No changes
Pathfinder.ATTACK_BONUS_POOR = SRD35.ATTACK_BONUS_POOR; // No changes
Pathfinder.CLASSES = SRD35.CLASSES; // No changes
Pathfinder.COMPANIONS = SRD35.COMPANIONS; // TODO
Pathfinder.DEITIES = [
  'Erastil (LG):Longbow:Animal/Community/Good/Law/Plant',
  'Iomedae (LG):Longsword:Glory/Good/Law/Sun/War',
  'Torag (LG):Warhammer:Artifice/Earth/Good/Law/Protection',
  'Sarenrae (NG):Scimitar:Fire/Glory/Good/Healing/Sun',
  'Shelyn (NG):Glaive:Air/Charm/Good/Luck/Protection',
  'Desna (CG):Starknife:Chaos/Good/Liberation/Luck/Travel',
  'Cayden Cailean (CG):Rapier:Chaos/Charm/Good/Strength/Travel',
  'Abadar (LN):Light Crossbow:Earth/Law/Nobility/Protection/Travel',
  'Irori (LN):Unarmed:Healing/Knowledge/Law/Rune/Strength',
  'Gozreh (N):Trident:Air/Animal/Plant/Water/Weather',
  'Pharasma (N):Dagger:Death/Healing/Knowledge/Repose/Water',
  'Nethys (N):Quarterstaff:Destruction/Knowledge/Magic/Protection/Rune',
  'Gorum (CN):Greatsword:Chaos/Destruction/Glory/Strength/War',
  'Calistria (CN):Whip:Chaos/Charm/Knowledge/Luck/Trickery',
  'Asmodeus (LE):Mace:Evil/Fire/Law/Magic/Trickery',
  'Zon-Kuthon (LE):Darkness/Death/Destruction/Evil/Law',
  'Urgathoa (NE):Scythe:Death/Evil/Magic/Strength/War',
  'Norgorber (NE):Short Sword:Charm/Death/Evil/Knowledge/Trickery',
  'Lamashtu (CE):Falchion:Chaos/Evil/Madness/Strength/Trickery',
  'Rovagug (CE):Greataxe:Chaos/Destruction/Evil/War/Weather'
];
Pathfinder.DOMAINS = SRD35.DOMAINS.concat([
  'Artifice', 'Charm', 'Community', 'Darkness', 'Glory', 'Liberation',
  'Madness', 'Nobility', 'Repose', 'Rune', 'Weather'
]);
Pathfinder.FEATS = SRD35.FEATS; // TODO
Pathfinder.GENDERS = SRD35.GENDERS; // No changes
Pathfinder.GOODIES = SRD35.GOODIES; // No changes
Pathfinder.LANGUAGES = SRD35.LANGUAGES.concat(['Aklo']);
Pathfinder.PROFICIENCY_HEAVY = SRD35.PROFICIENCY_HEAVY; // No changes
Pathfinder.PROFICIENCY_LIGHT = SRD35.PROFICIENCY_LIGHT; // No changes
Pathfinder.PROFICIENCY_MEDIUM = SRD35.PROFICIENCY_MEDIUM; // No changes
Pathfinder.PROFICIENCY_NONE = SRD35.PROFICIENCY_NONE; // No changes
Pathfinder.PROFICIENCY_TOWER = SRD35.PROFICIENCY_TOWER; // No changes
Pathfinder.RACES = SRD35.RACES; // No changes
Pathfinder.RANDOMIZABLE_ATTRIBUTES=SRD35.RANDOMIZABLE_ATTRIBUTES; // No changes
Pathfinder.SAVE_BONUS_GOOD = SRD35.SAVE_BONUS_GOOD; // No changes
Pathfinder.SAVE_BONUS_POOR = SRD35.SAVE_BONUS_POOR; // No changes
Pathfinder.SCHOOLS = SRD35.SCHOOLS; // No changes
Pathfinder.SHIELDS = SRD35.SHIELDS; // No changes
Pathfinder.SKILLS = [
  'Acrobatics:dex', 'Appraise:int', 'Bluff:cha', 'Climb:str', 'Craft:int',
  'Diplomacy:cha', 'Disable Device:int/trained', 'Disguise:cha',
  'Escape Artist:dex', 'Fly:dex', 'Handle Animal:cha/trained',
  'Heal:wis', 'Intimidate:cha', 'Knowledge:int/trained',
  'Linguistics:int/trained', 'Perception:wis', 'Perform:cha',
  'Profession:wis/trained', 'Ride:dex', 'Sense Motive:wis',
  'Sleight Of Hand:dex/trained', 'Spellcraft:int/trained', 'Stealth:dex',
  'Survival:wis', 'Swim:str', 'Use Magic Device:cha/trained'
];
Pathfinder.SUBFEATS = SRD35.FEATS; // TODO
Pathfinder.SUBSKILLS = SRD35.SUBSKILLS;
Pathfinder.SUBSKILLS['Knowledge'] =
  SRD35.SUBSKILLS['Knowledge'].replace('/Architecture', '');
Pathfinder.VIEWERS = SRD35.VIEWERS; // No changes
Pathfinder.WEAPONS = SRD35.WEAPONS; // TODO

/*
// Related information used internally by Pathfinder
Pathfinder.armorsArcaneSpellFailurePercentages = {
  'None': null, 'Padded': 5, 'Leather': 10, 'Studded Leather': 15,
  'Chain Shirt': 20, 'Hide': 20, 'Scale Mail': 25, 'Chainmail': 30,
  'Breastplate': 25, 'Splint Mail': 40, 'Banded Mail': 35, 'Half Plate': 40,
  'Full Plate': 35
};
Pathfinder.armorsArmorClassBonuses = {
  'None': null, 'Padded': 1, 'Leather': 2, 'Studded Leather': 3,
  'Chain Shirt': 4, 'Hide': 3, 'Scale Mail': 4, 'Chainmail': 5,
  'Breastplate': 5, 'Splint Mail': 6, 'Banded Mail': 6, 'Half Plate': 7,
  'Full Plate': 8
};
Pathfinder.armorsMaxDexBonuses = {
  'None': null, 'Padded': 8, 'Leather': 6, 'Studded Leather': 5,
  'Chain Shirt': 4, 'Hide': 4, 'Scale Mail': 3, 'Chainmail': 2,
  'Breastplate': 3, 'Splint Mail': 0, 'Banded Mail': 1, 'Half Plate': 0,
  'Full Plate': 1
};
Pathfinder.armorsSkillCheckPenalties = {
  'None': null, 'Padded': null, 'Leather': null, 'Studded Leather': -1,
  'Chain Shirt': -2, 'Hide': -3, 'Scale Mail': -4, 'Chainmail': -5,
  'Breastplate': -4, 'Splint Mail': -7, 'Banded Mail': -6, 'Half Plate': -7,
  'Full Plate': -6
};
Pathfinder.armorsWeightClasses = {
  'None': 'Light', 'Padded': 'Light', 'Leather': 'Light',
  'Studded Leather': 'Light', 'Chain Shirt': 'Light', 'Hide': 'Medium',
  'Scale Mail': 'Medium', 'Chainmail': 'Medium', 'Breastplate': 'Medium',
  'Splint Mail': 'Heavy', 'Banded Mail': 'Heavy', 'Half Plate': 'Heavy',
  'Full Plate': 'Heavy'
};
Pathfinder.spellsSchools = {

  'Acid Arrow':'Conjuration', 'Acid Fog':'Conjuration',
  'Acid Splash':'Conjuration', 'Aid':'Enchantment', 'Air Walk':'Transmutation',
  'Alarm':'Abjuration', 'Align Weapon':'Transmutation',
  'Alter Self':'Transmutation', 'Analyze Dweomer':'Divination',
  'Animal Growth':'Transmutation', 'Animal Messenger':'Enchantment',
  'Animal Shapes':'Transmutation', 'Animal Trance':'Enchantment',
  'Animate Dead':'Necromancy', 'Animate Objects':'Transmutation',
  'Animate Plants':'Transmutation', 'Animate Rope':'Transmutation',
  'Antilife Shell':'Abjuration', 'Antimagic Field':'Abjuration',
  'Antipathy':'Enchantment', 'Antiplant Shell':'Abjuration',
  'Arcane Eye':'Divination', 'Arcane Lock':'Abjuration',
  'Arcane Mark':'Universal', 'Arcane Sight':'Divination',
  'Astral Projection':'Necromancy', 'Atonement':'Abjuration',
  'Augury':'Divination', 'Awaken':'Transmutation',

  'Baleful Polymorph':'Transmutation', 'Bane':'Enchantment',
  'Banishment':'Abjuration', 'Barkskin':'Transmutation',
  'Bear\'s Endurance':'Transmutation', 'Bestow Curse':'Necromancy',
  'Binding':'Enchantment', 'Black Tentacles':'Conjuration',
  'Blade Barrier':'Evocation', 'Blasphemy':'Evocation', 'Bless':'Enchantment',
  'Bless Water':'Transmutation', 'Bless Weapon':'Transmutation',
  'Blight':'Necromancy', 'Blindness/Deafness':'Necromancy',
  'Blink':'Transmutation', 'Blur':'Illusion', 'Break Enchantment':'Abjuration',
  'Bull\'s Strength':'Transmutation', 'Burning Hands':'Evocation',

  'Call Lightning':'Evocation', 'Call Lightning Storm':'Evocation',
  'Calm Animals':'Enchantment', 'Calm Emotions':'Enchantment',
  'Cat\'s Grace':'Transmutation', 'Cause Fear':'Necromancy',
  'Chain Lightning':'Evocation', 'Changestaff':'Transmutation',
  'Chaos Hammer':'Evocation', 'Charm Animal':'Enchantment',
  'Charm Monster':'Enchantment', 'Charm Person':'Enchantment',
  'Chill Metal':'Transmutation', 'Chill Touch':'Necromancy',
  'Circle Of Death':'Necromancy', 'Clairaudience/Clairvoyance':'Divination',
  'Clenched Fist':'Evocation', 'Cloak Of Chaos':'Abjuration',
  'Clone':'Necromancy', 'Cloudkill':'Conjuration', 'Color Spray':'Illusion',
  'Command':'Enchantment', 'Command Plants':'Transmutation',
  'Command Undead':'Necromancy', 'Commune':'Divination',
  'Commune With Nature':'Divination', 'Comprehend Languages':'Divination',
  'Cone Of Cold':'Evocation', 'Confusion':'Enchantment',
  'Consecrate':'Evocation', 'Contact Other Plane':'Divination',
  'Contagion':'Necromancy', 'Contingency':'Evocation',
  'Continual Flame':'Evocation', 'Control Plants':'Transmutation',
  'Control Undead':'Necromancy', 'Control Water':'Transmutation',
  'Control Weather':'Transmutation', 'Control Winds':'Transmutation',
  'Create Food And Water':'Conjuration', 'Create Greater Undead':'Necromancy',
  'Create Undead':'Necromancy', 'Create Water':'Conjuration',
  'Creeping Doom':'Conjuration', 'Crushing Despair':'Enchantment',
  'Crushing Hand':'Evocation', 'Cure Critical Wounds':'Conjuration',
  'Cure Light Wounds':'Conjuration', 'Cure Minor Wounds':'Conjuration',
  'Cure Moderate Wounds':'Conjuration', 'Cure Serious Wounds':'Conjuration',
  'Curse Water':'Necromancy',

  'Dancing Lights':'Evocation', 'Darkness':'Evocation',
  'Darkvision':'Transmutation', 'Daylight':'Evocation', 'Daze':'Enchantment',
  'Daze Monster':'Enchantment', 'Death Knell':'Necromancy',
  'Death Ward':'Necromancy', 'Deathwatch':'Necromancy',
  'Deep Slumber':'Enchantment', 'Deeper Darkness':'Evocation',
  'Delay Poison':'Conjuration', 'Delayed Blast Fireball':'Evocation',
  'Demand':'Enchantment', 'Desecrate':'Evocation', 'Destruction':'Necromancy',
  'Detect Animals Or Plants':'Divination', 'Detect Chaos':'Divination',
  'Detect Evil':'Divination', 'Detect Good':'Divination',
  'Detect Law':'Divination', 'Detect Magic':'Divination',
  'Detect Poison':'Divination', 'Detect Scrying':'Divination',
  'Detect Secret Doors':'Divination', 'Detect Snares And Pits':'Divination',
  'Detect Thoughts':'Divination', 'Detect Undead':'Divination',
  'Dictum':'Evocation', 'Dimension Door':'Conjuration',
  'Dimensional Anchor':'Abjuration', 'Dimensional Lock':'Abjuration',
  'Diminish Plants':'Transmutation', 'Discern Lies':'Divination',
  'Discern Location':'Divination', 'Disguise Self':'Illusion',
  'Disintegrate':'Transmutation', 'Dismissal':'Abjuration',
  'Dispel Chaos':'Abjuration', 'Dispel Evil':'Abjuration',
  'Dispel Good':'Abjuration', 'Dispel Law':'Abjuration',
  'Dispel Magic':'Abjuration', 'Displacement':'Illusion',
  'Disrupt Undead':'Necromancy', 'Disrupting Weapon':'Transmutation',
  'Divination':'Divination', 'Divine Favor':'Evocation',
  'Divine Power':'Evocation', 'Dominate Animal':'Enchantment',
  'Dominate Monster':'Enchantment', 'Dominate Person':'Enchantment',
  'Doom':'Necromancy', 'Dream':'Illusion',

  'Eagle\'s Splendor':'Transmutation', 'Earthquake':'Evocation',
  'Elemental Swarm':'Conjuration', 'Endure Elements':'Abjuration',
  'Energy Drain':'Necromancy', 'Enervation':'Necromancy',
  'Enlarge Person':'Transmutation', 'Entangle':'Transmutation',
  'Enthrall':'Enchantment', 'Entropic Shield':'Abjuration',
  'Erase':'Transmutation', 'Ethereal Jaunt':'Transmutation',
  'Etherealness':'Transmutation', 'Expeditious Retreat':'Transmutation',
  'Explosive Runes':'Abjuration', 'Eyebite':'Necromancy',

  'Fabricate':'Transmutation', 'Faerie Fire':'Evocation',
  'False Life':'Necromancy', 'False Vision':'Illusion', 'Fear':'Necromancy',
  'Feather Fall':'Transmutation', 'Feeblemind':'Enchantment',
  'Find The Path':'Divination', 'Find Traps':'Divination',
  'Finger Of Death':'Necromancy', 'Fire Seeds':'Conjuration',
  'Fire Shield':'Evocation', 'Fire Storm':'Evocation',
  'Fire Trap':'Abjuration', 'Fireball':'Evocation',
  'Flame Arrow':'Transmutation', 'Flame Blade':'Evocation',
  'Flame Strike':'Evocation', 'Flaming Sphere':'Evocation',
  'Flare':'Evocation', 'Flesh To Stone':'Transmutation',
  'Floating Disk':'Evocation', 'Fly':'Transmutation',
  'Fog Cloud':'Conjuration', 'Forbiddance':'Abjuration',
  'Forcecage':'Evocation', 'Forceful Hand':'Evocation',
  'Foresight':'Divination', 'Fox\'s Cunning':'Transmutation',
  'Freedom':'Abjuration', 'Freedom Of Movement':'Abjuration',
  'Freezing Sphere':'Evocation',

  'Gaseous Form':'Transmutation', 'Gate':'Conjuration',
  'Geas/Quest':'Enchantment', 'Gentle Repose':'Necromancy',
  'Ghost Sound':'Illusion', 'Ghoul Touch':'Necromancy',
  'Giant Vermin':'Transmutation', 'Glibness':'Transmutation',
  'Glitterdust':'Conjuration', 'Globe Of Invulnerability':'Abjuration',
  'Glyph Of Warding':'Abjuration', 'Good Hope':'Enchantment',
  'Goodberry':'Transmutation', 'Grasping Hand':'Evocation',
  'Grease':'Conjuration', 'Greater Arcane Sight':'Divination',
  'Greater Command':'Enchantment', 'Greater Dispel Magic':'Abjuration',
  'Greater Glyph Of Warding':'Abjuration', 'Greater Heroism':'Enchantment',
  'Greater Invisibility':'Illusion', 'Greater Magic Fang':'Transmutation',
  'Greater Magic Weapon':'Transmutation', 'Greater Planar Ally':'Conjuration',
  'Greater Planar Binding':'Conjuration', 'Greater Prying Eyes':'Divination',
  'Greater Restoration':'Conjuration', 'Greater Scrying':'Divination',
  'Greater Shadow Conjuration':'Illusion','Greater Shadow Evocation':'Illusion',
  'Greater Shout':'Evocation', 'Greater Spell Immunity':'Abjuration',
  'Greater Teleport':'Conjuration', 'Guards And Wards':'Abjuration',
  'Guidance':'Divination', 'Gust Of Wind':'Evocation',

  'Hallow':'Evocation', 'Hallucinatory Terrain':'Illusion',
  'Halt Undead':'Necromancy', 'Harm':'Necromancy', 'Haste':'Transmutation',
  'Heal':'Conjuration', 'Heal Mount':'Conjuration',
  'Heat Metal':'Transmutation', 'Helping Hand':'Evocation',
  'Heroes\' Feast':'Conjuration', 'Heroism':'Enchantment',
  'Hide From Animals':'Abjuration', 'Hide From Undead':'Abjuration',
  'Hideous Laughter':'Enchantment', 'Hold Animal':'Enchantment',
  'Hold Monster':'Enchantment', 'Hold Person':'Enchantment',
  'Hold Portal':'Abjuration', 'Holy Aura':'Abjuration',
  'Holy Smite':'Evocation', 'Holy Sword':'Evocation', 'Holy Word':'Evocation',
  'Horrid Wilting':'Necromancy', 'Hypnotic Pattern':'Illusion',
  'Hypnotism':'Enchantment',

  'Ice Storm':'Evocation', 'Identify':'Divination',
  'Illusory Script':'Illusion', 'Illusory Wall':'Illusion',
  'Imbue With Spell Ability':'Evocation', 'Implosion':'Evocation',
  'Imprisonment':'Abjuration', 'Incendiary Cloud':'Conjuration',
  'Inflict Critical Wounds':'Necromancy', 'Inflict Light Wounds':'Necromancy',
  'Inflict Minor Wounds':'Necromancy', 'Inflict Moderate Wounds':'Necromancy',
  'Inflict Serious Wounds':'Necromancy', 'Insanity':'Enchantment',
  'Insect Plague':'Conjuration', 'Instant Summons':'Conjuration',
  'Interposing Hand':'Evocation', 'Invisibility':'Illusion',
  'Invisibility Purge':'Evocation', 'Invisibility Sphere':'Illusion',
  'Iron Body':'Transmutation', 'Ironwood':'Transmutation',
  'Irresistible Dance':'Enchantment',

  'Jump':'Transmutation',

  'Keen Edge':'Transmutation', 'Knock':'Transmutation',
  'Know Direction':'Divination',

  'Legend Lore':'Divination', 'Lesser Confusion':'Enchantment',
  'Lesser Geas':'Enchantment', 'Lesser Globe Of Invulnerability':'Abjuration',
  'Lesser Planar Ally':'Conjuration', 'Lesser Planar Binding':'Conjuration',
  'Lesser Restoration':'Conjuration', 'Levitate':'Transmutation',
  'Light':'Evocation', 'Lightning Bolt':'Evocation', 'Limited Wish':'Universal',
  'Liveoak':'Transmutation', 'Locate Creature':'Divination',
  'Locate Object':'Divination', 'Longstrider':'Transmutation',
  'Lullaby':'Enchantment',

  'Mage Armor':'Conjuration', 'Mage Hand':'Transmutation',
  'Mage\'s Disjunction':'Abjuration', 'Mage\'s Faithful Hound':'Conjuration',
  'Mage\'s Lucubration':'Transmutation',
  'Mage\'s Magnificent Mansion':'Conjuration',
  'Mage\'s Private Sanctum':'Abjuration', 'Mage\'s Sword':'Evocation',
  'Magic Aura':'Illusion', 'Magic Circle Against Chaos':'Abjuration',
  'Magic Circle Against Evil':'Abjuration',
  'Magic Circle Against Good':'Abjuration',
  'Magic Circle Against Law':'Abjuration', 'Magic Fang':'Transmutation',
  'Magic Jar':'Necromancy', 'Magic Missile':'Evocation',
  'Magic Mouth':'Illusion', 'Magic Stone':'Transmutation',
  'Magic Vestment':'Transmutation', 'Magic Weapon':'Transmutation',
  'Major Creation':'Conjuration', 'Major Image':'Illusion',
  'Make Whole':'Transmutation', 'Mark Of Justice':'Necromancy',
  'Mass Bear\'s Endurance':'Transmutation',
  'Mass Bull\'s Strength':'Transmutation', 'Mass Cat\'s Grace':'Transmutation',
  'Mass Charm Monster':'Enchantment', 'Mass Cure Critical Wounds':'Conjuration',
  'Mass Cure Light Wounds':'Conjuration',
  'Mass Cure Moderate Wounds':'Conjuration',
  'Mass Cure Serious Wounds':'Conjuration',
  'Mass Eagle\'s Splendor':'Transmutation',
  'Mass Enlarge Person':'Transmutation', 'Mass Fox\'s Cunning':'Transmutation',
  'Mass Heal':'Conjuration', 'Mass Hold Monster':'Enchantment',
  'Mass Hold Person':'Enchantment', 'Mass Inflict Critical Wounds':'Necromancy',
  'Mass Inflict Light Wounds':'Necromancy',
  'Mass Inflict Moderate Wounds':'Necromancy',
  'Mass Inflict Serious Wounds':'Necromancy', 'Mass Invisibility':'Illusion',
  'Mass Owl\'s Wisdom':'Transmutation', 'Mass Reduce Person':'Transmutation',
  'Mass Suggestion':'Enchantment', 'Maze':'Conjuration',
  'Meld Into Stone':'Transmutation', 'Mending':'Transmutation',
  'Message':'Transmutation', 'Meteor Swarm':'Evocation',
  'Mind Blank':'Abjuration', 'Mind Fog':'Enchantment',
  'Minor Creation':'Conjuration', 'Minor Image':'Illusion',
  'Miracle':'Evocation', 'Mirage Arcana':'Illusion', 'Mirror Image':'Illusion',
  'Misdirection':'Illusion', 'Mislead':'Illusion',
  'Mnemonic Enhancer':'Transmutation', 'Modify Memory':'Enchantment',
  'Moment Of Prescience':'Divination', 'Mount':'Conjuration',
  'Move Earth':'Transmutation',

  'Neutralize Poison':'Conjuration', 'Nightmare':'Illusion',
  'Nondetection':'Abjuration',

  'Obscure Object':'Abjuration', 'Obscuring Mist':'Conjuration',
  'Open/Close':'Transmutation', 'Order\'s Wrath':'Evocation',
  'Overland Flight':'Transmutation', 'Owl\'s Wisdom':'Transmutation',

  'Pass Without Trace':'Transmutation', 'Passwall':'Transmutation',
  'Permanency':'Universal', 'Permanent Image':'Illusion',
  'Persistent Image':'Illusion', 'Phantasmal Killer':'Illusion',
  'Phantom Steed':'Conjuration', 'Phantom Trap':'Illusion',
  'Phase Door':'Conjuration', 'Planar Ally':'Conjuration',
  'Planar Binding':'Conjuration', 'Plane Shift':'Conjuration',
  'Plant Growth':'Transmutation', 'Poison':'Necromancy',
  'Polar Ray':'Evocation', 'Polymorph':'Transmutation',
  'Polymorph Any Object':'Transmutation', 'Power Word Blind':'Enchantment',
  'Power Word Kill':'Enchantment', 'Power Word Stun':'Enchantment',
  'Prayer':'Enchantment', 'Prestidigitation':'Universal',
  'Prismatic Sphere':'Abjuration', 'Prismatic Spray':'Evocation',
  'Prismatic Wall':'Abjuration', 'Produce Flame':'Evocation',
  'Programmed Image':'Illusion', 'Project Image':'Illusion',
  'Protection From Arrows':'Abjuration', 'Protection From Chaos':'Abjuration',
  'Protection From Energy':'Abjuration', 'Protection From Evil':'Abjuration',
  'Protection From Good':'Abjuration', 'Protection From Law':'Abjuration',
  'Protection From Spells':'Abjuration', 'Prying Eyes':'Divination',
  'Purify Food And Drink':'Transmutation', 'Pyrotechnics':'Transmutation',

  'Quench':'Transmutation',

  'Rage':'Enchantment', 'Rainbow Pattern':'Illusion',
  'Raise Dead':'Conjuration', 'Ray Of Enfeeblement':'Necromancy',
  'Ray Of Exhaustion':'Necromancy', 'Ray Of Frost':'Evocation',
  'Read Magic':'Divination', 'Reduce Animal':'Transmutation',
  'Reduce Person':'Transmutation', 'Refuge':'Conjuration',
  'Regenerate':'Conjuration', 'Reincarnate':'Transmutation',
  'Remove Blindness/Deafness':'Conjuration', 'Remove Curse':'Abjuration',
  'Remove Disease':'Conjuration', 'Remove Fear':'Abjuration',
  'Remove Paralysis':'Conjuration', 'Repel Metal Or Stone':'Abjuration',
  'Repel Vermin':'Abjuration', 'Repel Wood':'Transmutation',
  'Repulsion':'Abjuration', 'Resilient Sphere':'Evocation',
  'Resist Energy':'Abjuration', 'Resistance':'Abjuration',
  'Restoration':'Conjuration', 'Resurrection':'Conjuration',
  'Reverse Gravity':'Transmutation', 'Righteous Might':'Transmutation',
  'Rope Trick':'Transmutation', 'Rusting Grasp':'Transmutation',

  'Sanctuary':'Abjuration', 'Scare':'Necromancy',
  'Scintillating Pattern':'Illusion', 'Scorching Ray':'Evocation',
  'Screen':'Illusion', 'Scrying':'Divination', 'Sculpt Sound':'Transmutation',
  'Searing Light':'Evocation', 'Secret Chest':'Conjuration',
  'Secret Page':'Transmutation', 'Secure Shelter':'Conjuration',
  'See Invisibility':'Divination', 'Seeming':'Illusion', 'Sending':'Evocation',
  'Sepia Snake Sigil':'Conjuration', 'Sequester':'Abjuration',
  'Shades':'Illusion', 'Shadow Conjuration':'Illusion',
  'Shadow Evocation':'Illusion', 'Shadow Walk':'Illusion',
  'Shambler':'Conjuration', 'Shapechange':'Transmutation',
  'Shatter':'Evocation', 'Shield':'Abjuration', 'Shield Of Faith':'Abjuration',
  'Shield Of Law':'Abjuration', 'Shield Other':'Abjuration',
  'Shillelagh':'Transmutation', 'Shocking Grasp':'Evocation',
  'Shout':'Evocation', 'Shrink Item':'Transmutation', 'Silence':'Illusion',
  'Silent Image':'Illusion', 'Simulacrum':'Illusion',
  'Slay Living':'Necromancy', 'Sleep':'Enchantment',
  'Sleet Storm':'Conjuration', 'Slow':'Transmutation', 'Snare':'Transmutation',
  'Soften Earth And Stone':'Transmutation', 'Solid Fog':'Conjuration',
  'Song Of Discord':'Enchantment', 'Soul Bind':'Necromancy',
  'Sound Burst':'Evocation', 'Speak With Animals':'Divination',
  'Speak With Dead':'Necromancy', 'Speak With Plants':'Divination',
  'Spectral Hand':'Necromancy', 'Spell Immunity':'Abjuration',
  'Spell Resistance':'Abjuration', 'Spell Turning':'Abjuration',
  'Spellstaff':'Transmutation', 'Spider Climb':'Transmutation',
  'Spike Growth':'Transmutation', 'Spike Stones':'Transmutation',
  'Spiritual Weapon':'Evocation', 'Statue':'Transmutation',
  'Status':'Divination', 'Stinking Cloud':'Conjuration',
  'Stone Shape':'Transmutation', 'Stone Tell':'Divination',
  'Stone To Flesh':'Transmutation', 'Stoneskin':'Abjuration',
  'Storm Of Vengeance':'Conjuration', 'Suggestion':'Enchantment',
  'Summon Instrument':'Conjuration', 'Summon Monster I':'Conjuration',
  'Summon Monster II':'Conjuration', 'Summon Monster III':'Conjuration',
  'Summon Monster IV':'Conjuration', 'Summon Monster IX':'Conjuration',
  'Summon Monster V':'Conjuration', 'Summon Monster VI':'Conjuration',
  'Summon Monster VII':'Conjuration', 'Summon Monster VIII':'Conjuration',
  'Summon Nature\'s Ally I':'Conjuration',
  'Summon Nature\'s Ally II':'Conjuration',
  'Summon Nature\'s Ally III':'Conjuration',
  'Summon Nature\'s Ally IV':'Conjuration',
  'Summon Nature\'s Ally IX':'Conjuration',
  'Summon Nature\'s Ally V':'Conjuration',
  'Summon Nature\'s Ally VI':'Conjuration',
  'Summon Nature\'s Ally VII':'Conjuration',
  'Summon Nature\'s Ally VIII':'Conjuration', 'Summon Swarm':'Conjuration',
  'Sunbeam':'Evocation', 'Sunburst':'Evocation', 'Symbol Of Death':'Necromancy',
  'Symbol Of Fear':'Necromancy', 'Symbol Of Insanity':'Enchantment',
  'Symbol Of Pain':'Necromancy', 'Symbol Of Persuasion':'Enchantment',
  'Symbol Of Sleep':'Enchantment', 'Symbol Of Stunning':'Enchantment',
  'Symbol Of Weakness':'Necromancy', 'Sympathetic Vibration':'Evocation',
  'Sympathy':'Enchantment',

  'Telekinesis':'Transmutation', 'Telekinetic Sphere':'Evocation',
  'Telepathic Bond':'Divination', 'Teleport':'Conjuration',
  'Teleport Object':'Conjuration', 'Teleportation Circle':'Conjuration',
  'Temporal Stasis':'Transmutation', 'Time Stop':'Transmutation',
  'Tiny Hut':'Evocation', 'Tongues':'Divination',
  'Touch Of Fatigue':'Necromancy', 'Touch Of Idiocy':'Enchantment',
  'Transformation':'Transmutation', 'Transmute Metal To Wood':'Transmutation',
  'Transmute Mud To Rock':'Transmutation',
  'Transmute Rock To Mud':'Transmutation', 'Transport Via Plants':'Conjuration',
  'Trap The Soul':'Conjuration', 'Tree Shape':'Transmutation',
  'Tree Stride':'Conjuration', 'True Resurrection':'Conjuration',
  'True Seeing':'Divination', 'True Strike':'Divination',

  'Undeath To Death':'Necromancy', 'Undetectable Alignment':'Abjuration',
  'Unhallow':'Evocation', 'Unholy Aura':'Abjuration',
  'Unholy Blight':'Evocation', 'Unseen Servant':'Conjuration',

  'Vampiric Touch':'Necromancy', 'Veil':'Illusion', 'Ventriloquism':'Illusion',
  'Virtue':'Transmutation', 'Vision':'Divination',

  'Wail Of The Banshee':'Necromancy', 'Wall Of Fire':'Evocation',
  'Wall Of Force':'Evocation', 'Wall Of Ice':'Evocation',
  'Wall Of Iron':'Conjuration', 'Wall Of Stone':'Conjuration',
  'Wall Of Thorns':'Conjuration', 'Warp Wood':'Transmutation',
  'Water Breathing':'Transmutation', 'Water Walk':'Transmutation',
  'Waves Of Exhaustion':'Necromancy', 'Waves Of Fatigue':'Necromancy',
  'Web':'Conjuration', 'Weird':'Illusion', 'Whirlwind':'Evocation',
  'Whispering Wind':'Transmutation', 'Wind Walk':'Transmutation',
  'Wind Wall':'Evocation', 'Wish':'Universal', 'Wood Shape':'Transmutation',
  'Word Of Chaos':'Evocation', 'Word Of Recall':'Conjuration',

  'Zone Of Silence':'Illusion', 'Zone Of Truth':'Enchantment'

};
Pathfinder.strengthMaxLoads = [0,
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 115, 130, 150, 175, 200, 230, 260,
  300, 350, 400, 460, 520, 600, 700, 800, 920, 1040, 1200, 1400
];
*/

/* Defines the rules related to character abilities. */
Pathfinder.abilityRules = function(rules) {
  SRD35.abilityRules(rules); // No changes
}

/* Defines the rules related to character classes. */
Pathfinder.classRules = function(rules, classes) {

  // Level-dependent attributes
  rules.defineRule('classSkillMaxRanks', 'level', '=', 'source + 3'); // TODO
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');
  rules.defineRule('skillPoints', // TODO
    '', '=', '0',
    'level', '^', 'source + 3'
  );
  rules.defineNote
    ('validationNotes.levelsTotal:' +
     'Allocated levels differ from level total by %V');
  rules.defineRule('validationNotes.levelsTotal',
    'level', '+=', '-source',
    /^levels\./, '+=', null
  );

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Barbarian') {

      baseAttack = Pathfinder.ATTACK_BONUS_GOOD;
      features = [
        '1:Fast Movement', '1:Rage', '2:Uncanny Dodge', '3:Trap Sense',
        '5:Improved Uncanny Dodge', '7:Damage Reduction', '11:Greater Rage',
        '14:Indomitable Will', '17:Tireless Rage', '20:Mighty Rage'
      ];
      feats = null;
      hitDie = 12;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'abilityNotes.swiftFootFeature:+%V * 5 speed during rage',
        'combatNotes.animalFuryFeature:Bite attack for d%V+%1 during rage',
        'combatNotes.greaterRageFeature:+6 strength/constitution; +3 Will',
        'combatNotes.guardedStanceFeature:+%V AC during rage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.knockbackFeature:' +
          'Successful bull rush during rage for %V damage',
        'combatNotes.mightyRageFeature:+8 strength/constitution; +4 Will save',
        'combatNotes.mightySwingFeature:' +
          'Potential critical automatically succeeds 1/rage',
        'combatNotes.momentOfClarityFeature:Rage effects suspended for 1 round',
        'combatNotes.noEscapeFeature:x2 speed 1/rage when foe withdraws',
        'combatNotes.powerfulBlowFeature:+%V damage 1/rage',
        'combatNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC for %V rounds %1/day',
        'combatNotes.quickReflexesFeature:+1 AOO/round during rage',
        'combatNotes.rollingDodgeFeature:' +
          '+%V AC vs. ranged for %1 rounds during rage',
        'combatNotes.rousedAngerFeature:Rage even if fatigued',
        'combatNotes.strengthSurgeFeature:' +
          '+%V strength/combat manuever check 1/rage',
        'combatNotes.surpriseAccuracyFeature:+%V attack 1/rage',
        'combatNotes.terrifyingHowlFeature:' +
           'Howl for DC %V will save w/in 30 ft or shaken for d4+1 rounds',
        'combatNotes.tirelessRageFeature:Not fatigued after rage',
        'combatNotes.uncannyDodgeFeature:' +
          'Never flat-footed; adds dexterity modifier to AC vs. invisible foe',
        'combatNotes.unexpectedStrikeFeature:AOO when foe enters threat 1/rage',
        'featureNotes.nightVisionFeature:60% Darkvision during rage',
        'featureNotes.scentFeature:Detect creatures via smell',
        'magicNotes.renewedVigorFeature:Heal %Vd8+%1 damage 1/day during rage',
        'saveNotes.clearMindFeature:Reroll Will save 1/rage',
        'saveNotes.fearlessRageFeature:Cannot be shaken/frightened during rage',
        'saveNotes.indomitableWillFeature:' +
          '+4 enchantment resistance during rage',
        'saveNotes.internalFortitudeFeature:' +
          'Cannot be sickened/nauseated during rage',
        'saveNotes.superstitionFeature:' +
          '+%V vs. spells and supernatural/spell-like abilities during rage',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
        'skillNotes.intimidatingGlareFeature:' +
          'Successful Intimidate during rage shakes foe for at least d4 rounds',
        'skillNotes.ragingClimberFeature:+%V Climb during rage',
        'skillNotes.ragingLeaperFeature:+%V Acrobatic (jump) during rage',
        'skillNotes.ragingSwimmerFeature:+%V Swim during rage',
        'validationNotes.barbarianClassAlignment:Requires Alignment !~ Lawful',
        'validationNotes.clearMindSelectableFeatureLevels:' +
           'Requires Barbarian >= 8',
        'validationNotes.fearlessRangeSelectableFeatureLevels:' +
           'Requires Barbarian >= 12',
        'validationNotes.internalFortitudeSelectableFeatureLevels:' +
           'Requires Barbarian >= 8',
        'validationNotes.increasedDamageReductionSelectableFeatureLevels:' +
           'Requires Barbarian >= 8',
        'validationNotes.mightySwingSelectableFeatureLevels:' +
           'Requires Barbarian >= 12',
        'validationNotes.renewedVigorSelectableFeatureLevels:' +
           'Requires Barbarian >= 8',
        'validationNotes.terrifyingHowelSelectableFeatureLevels:' +
           'Requires Barbarian >= 8',
        'validationNotes.unexpectedStrikeSelectableFeatureLevels:' +
           'Requires Barbarian >= 4'
      ];
      profArmor = Pathfinder.PROFICIENCY_MEDIUM;
      profShield = Pathfinder.PROFICIENCY_HEAVY;
      profWeapon = Pathfinder.PROFICIENCY_MEDIUM;
      saveFortitude = Pathfinder.SAVE_BONUS_GOOD;
      saveReflex = Pathfinder.SAVE_BONUS_POOR;
      saveWill = Pathfinder.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Animal Fury', 'Clear Mind', 'Fearless Rage', 'Guarded Stance',
        'Increased Damage Reduction', 'Internal Fortitude',
        'Intimidating Glare', 'Knockback', 'Low Light Vision', 'Mighty Swing',
        'Moment Of Clarity', 'Night Vision', 'No Escape', 'Powerful Blow',
        'Quick Reflexes', 'Raging Climber', 'Raging Leaper', 'Raging Swimmer',
        'Renewed Vigor', 'Rolling Dodge', 'Roused Anger', 'Scent',
        'Strength Surge', 'Superstition', 'Surprise Accuracy', 'Swift Foot',
        'Terrifying Howl', 'Unexpected Strike'
      ];
      skillPoints = 4;
      skills = [
        'Acrobatics', 'Climb', 'Craft', 'Handle Animal', 'Intimidate',
        'Knowledge (Nature)', 'Perception', 'Ride', 'Survival', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('abilityNotes.fastMovementFeature', 'levels.Barbarian', '+=', '10');
      rules.defineRule('combatNotes.animalFuryFeature',
        '', '=', '4',
        'features.Small', '+', '-1'
      );
      rules.defineRule('combatNotes.animalFuryFeature.1',
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
        'constitutionModifier', '=', '2 + 2 * source',
        'features.Greater Rage', '+', '1',
        'features.Mighty Rage', '+', '1'
      );
      rules.defineRule('combatNotes.rageFeature.1',
        'levels.Barbarian', '+=', '1 + Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.rollingDodgeFeature',
        'levels.Barbarian', '=', '1 + Math.floor(source / 6)'
      );
      rules.defineRule('combatNotes.rollingDodgeFeature.1',
        'constitutionModifier', '=', 'Math.min(1, source)'
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
      rules.defineRule('damageReduction.All',
        'levels.Barbarian', '+=', 'source>=7 ? Math.floor((source-4)/3) : null',
        'features.increasedDamageReduction', '+', null
      );
      rules.defineRule('magicNotes.renewedVigorFeature',
        'levels.Barbarian', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('magicNotes.renewedVigorFeature.1',
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
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);

    } else if(klass == 'Bard') {

      baseAttack = Pathfinder.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Bardic Knowledge', '1:Countersong', '1:Distraction', '1:Fascinate',
        '1:Inspire Courage', '2:Versatile Performance', '2:Well Versed',
        '3:Inspire Competence', '5:Lore Master', '6:Suggestion',
        '8:Dirge Of Doom', '9:Inspire Greatness', '10:Jack Of All Trades',
        '12:Soothing Performance', '14:Frightening Tune', '15:Inspire Heroics',
        '18:Mass Suggestion', '20:Deadly Performance'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.bardicPerformanceFeature:' +
          'Bardic Performance effect %V rounds/day',
        'magicNotes.countersongFeature:' +
          'Perform check vs. sonic magic w/in 30 ft for 10 rounds',
        'magicNotes.deadlyPerformanceFeature:' +
          'Target DC %V Will save or die',
        'magicNotes.dirgeOfDoomFeature:' +
          'Creatures w/in 30 ft shaken while performing',
        'magicNotes.distractionFeature:' +
          'Perform check vs. visual magic w/in 30 ft for 10 rounds',
        'magicNotes.fascinateFeature:' +
          '%V creatures w/in 90 ft DC %1 Will save or spellbound',
        'magicNotes.frighteningTuneFeature:' +
          '30 ft range DC %V Will <i>Cause Fear</i> via performance',
        'magicNotes.inspireCompetenceFeature:' +
          '+%V ally skill checks while performing',
        'magicNotes.inspireCourageFeature:' +
          '+%V attack/damage and charm/fear saves to allies while performing',
        'magicNotes.inspireGreatnessFeature:' +
           '+2d10 HP/+2 attack/+1 Fortitude save to %V allies while performing',
        'magicNotes.inspireHeroicsFeature:' +
          '+4 AC/saves to %V allies while performing',
        'magicNotes.massSuggestionFeature:' +
          '<i>Suggestion</i> to all fascinated creatures',
        'magicNotes.soothingPerformanceFeature:' +
           '30 ft range <i>Mass Cure Serious Wounds</i> via performance',
        'magicNotes.suggestionFeature:' +
          '<i>Suggestion</i> to 1 fascinated creature',
        'saveNotes.wellVersedFeature:+4 vs. bardic effects',
        'skillNotes.bardicKnowledgeFeature:' +
          '+%V all Knowledge; use any Knowledge untrained',
        'skillNotes.jackOfAllTradesFeature:Use any skill untrained',
        'skillNotes.loreMasterFeature:' +
          'Take 10 on any ranked Knowledge skill; take 20 %V/day',
        'skillNotes.versitilePerformanceFeature:' +
          'Substitute Perform ranking for other skills'
      ];
      profArmor = Pathfinder.PROFICIENCY_LIGHT;
      profShield = Pathfinder.PROFICIENCY_HEAVY;
      profWeapon = Pathfinder.PROFICIENCY_LIGHT;
      saveFortitude = Pathfinder.SAVE_BONUS_POOR;
      saveReflex = Pathfinder.SAVE_BONUS_GOOD;
      saveWill = Pathfinder.SAVE_BONUS_GOOD;
      selectableFeatures = [
      ];
      skillPoints = 6;
      skills = [
        'Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy',
        'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge', 'Linguistics',
        'Perception', 'Perform', 'Profession', 'Sense Motive',
        'Sleight Of Hand', 'Spellcraft', 'Stealth', 'Use Magic Device'
      ];
      spellAbility = 'charisma';
      spellsKnown = [
        'B0:1:4/2:5/3:6',
        'B1:1:2/2:3/3:4/7:5/11:6',
        'B2:4:2/5:3/6:4/10:5/14:6',
        'B3:7:2/8:3/9:4/13:5/17:6',
        'B4:10:2/11:3/12:4/16:5/20:6',
        'B5:13:2/14:3/15:4/20:5',
        'B6:16:2/17:3/18:4/20:5'
      ];
      spellsPerDay = [
        'B1:1:1/2:2/3:3/5:4/9:5',
        'B2:4:1/5:2/6:3/8:4/12:5',
        'B3:7:1/8:2/9:3/11:4/15:5',
        'B4:10:1/11:2/12:3/14:4/18:5',
        'B5:13:1/14:2/15:3/17:4/19:5',
        'B6:16:1/17:2/18:3/19:4/20:5'
      ];
      rules.defineRule('casterLevelArcane', 'levels.Bard', '+=', null);
      rules.defineRule('featureNotes.bardicPerformanceFeature',
        'levels.Bard', '=', '2 + 2 * source',
        'charismaModifier', '+', null
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
      rules.defineRule('skillNotes.bardicKnowledgeFeature',
        'levels.Bard', '=', 'Math.min(1, Math.floor(source / 2))'
      );
      rules.defineRule('skillNotes.loreMasterFeature',
        'levels.Bard', '+=', '1 + Math.floor((source + 1) / 6)'
      );

    } else if(klass == 'Cleric') {

      baseAttack = Pathfinder.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = ['1:Aura', '1:Channel Energy', '1:Cleric Spontaneous Casting'];
      hitDie = 8;
      notes = [
        'magicNotes.auraFeature:' +
          'Visible to <i>Detect Chaos/Evil/Good/Law</i> depending on ' +
          'deity\'s alignment',
        'magicNotes.channelEnergyFeature:' +
          'Heal/inflict %Vd6 damage, DC %1 Will for half %2/day',
        'magicNotes.clericSpontaneousCastingFeature:' +
          'Cast <i>Heal</i>/<i>Inflict</i> spell in place of known spell'
      ];
      profArmor = Pathfinder.PROFICIENCY_MEDIUM;
      profShield = Pathfinder.PROFICIENCY_HEAVY;
      profWeapon = Pathfinder.PROFICIENCY_LIGHT;
      saveFortitude = Pathfinder.SAVE_BONUS_GOOD;
      saveReflex = Pathfinder.SAVE_BONUS_POOR;
      saveWill = Pathfinder.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Appraise', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (History)','Knowledge (Nobility)',  'Knowledge (Planes)',
        'Knowledge (Religion)', 'Linguistics', 'Profession', 'Sense Motive',
        'Spellcraft'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'C0:1:"all"', 'C1:1:"all"', 'C2:3:"all"', 'C3:5:"all"',
        'C4:7:"all"', 'C5:9:"all"', 'C6:11:"all"', 'C7:13:"all"',
        'C8:15:"all"', 'C9:17:"all"',
        'Dom1:1:"all"', 'Dom2:3:"all"', 'Dom3:5:"all"', 'Dom4:7:"all"',
        'Dom5:9:"all"', 'Dom6:11:"all"', 'Dom7:13:"all"', 'Dom8:15:"all"',
        'Dom9:17:"all"'
      ];
      spellsPerDay = [
        'C0:1:3/2:4',
        'C1:1:1/2:2/4:3/7:4',
        'C2:3:1/4:2/6:3/9:4',
        'C3:5:1/6:2/8:3/11:4',
        'C4:7:1/8:2/10:3/13:4',
        'C5:9:1/10:2/12:3/15:4',
        'C6:11:1/12:2/14:3/17:4',
        'C7:13:1/14:2/16:3/19:4',
        'C8:15:1/16:2/18:3/20:4',
        'C9:17:1/18:2/19:3/20:4'
      ];
      for(var j = 1; j < 10; j++) {
        rules.defineRule('spellsPerDay.Dom' + j,
          'levels.Cleric', '=',
          'source >= ' + (j * 2 - 1) + ' ? 1 : null');
      }
      rules.defineRule('casterLevelDivine', 'levels.Cleric', '+=', null);
      rules.defineRule('domainCount', 'levels.Cleric', '+=', '2');
      rules.defineRule('magicNotes.channelEnergyFeature',
        'levels.Cleric', '+=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('magicNotes.channelEnergyFeature.1',
        'levels.Cleric', '+=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('magicNotes.channelEnergyFeature.2',
        'charismaModifier', '=', '3 + source'
      );

    } else if(klass == 'Druid') {

      baseAttack = Pathfinder.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Druid Spontaneous Spell', '1:Nature Sense', '1:Wild Empathy',
        '2:Woodland Stride', '3:Trackless Step', '4:Resist Nature\'s Lure',
        '4:Wild Shape', '9:Venom Immunity', '13:Thousand Faces',
        '15:Timeless Body'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tracklessStepFeature:Untrackable outdoors',
        'magicNotes.druidSpontaneousCastingFeature:' +
          'Cast <i>Summon Nature\'s Ally</i> spell in place of known spell',
        'magicNotes.thousandFacesFeature:<i>Alter Self</i> at will',
        'magicNotes.wildShapeFeature:' +
          'Change into creature of size %V for %1 hours %2/day',
        'saveNotes.resistNature\'sLureFeature:+4 vs. spells of feys',
        'saveNotes.venomImmunityFeature:Immune to poisons',
        'skillNotes.natureSenseFeature:+2 Knowledge (Nature)/Survival',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals',
        'validationNotes.druidClassAlignment:Requires Alignment =~ Neutral'
      ];
      profArmor = Pathfinder.PROFICIENCY_MEDIUM;
      profShield = Pathfinder.PROFICIENCY_HEAVY;
      profWeapon = Pathfinder.PROFICIENCY_NONE;
      saveFortitude = Pathfinder.SAVE_BONUS_GOOD;
      saveReflex = Pathfinder.SAVE_BONUS_POOR;
      saveWill = Pathfinder.SAVE_BONUS_GOOD;
      selectableFeatures = [
        'Animal Companion', 'Nature Domains'
      ];
      skillPoints = 4;
      skills = [
        'Climb', 'Craft', 'Fly', 'Handle Animal', 'Heal',
        'Knowledge (Geography)', 'Knowledge (Nature)', 'Perception',
        'Profession', 'Ride', 'Spellcraft', 'Survival', 'Swim'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'D0:1:"all"', 'D1:1:"all"', 'D2:3:"all"', 'D3:5:"all"',
        'D4:7:"all"', 'D5:9:"all"', 'D6:11:"all"', 'D7:13:"all"',
        'D8:15:"all"', 'D9:17:"all"'
      ];
      spellsPerDay = [
        'D0:1:3/2:4',
        'D1:1:1/2:2/4:3/7:4',
        'D2:3:1/4:2/6:3/9:4',
        'D3:5:1/6:2/8:3/11:4',
        'D4:7:1/8:2/10:3/13:4',
        'D5:9:1/10:2/12:3/15:4',
        'D6:11:1/12:2/14:3/17:4',
        'D7:13:1/14:2/16:3/19:4',
        'D8:15:1/16:2/18:3/20:4',
        'D9:17:1/18:2/19:3/20:4'
      ];
      rules.defineRule('casterLevelDivine', 'levels.Druid', '+=', null);
      rules.defineRule('domainCount', 'features.Nature Domains', '+=', '2');
      rules.defineRule('languageCount', 'levels.Druid', '+', '1');
      rules.defineRule('languages.Druidic', 'levels.Druid', '=', '1');
      rules.defineRule('magicNotes.wildShapeFeature',
        'levels.Druid', '=',
          'source < 4 ? null : ' +
          'source < 6 ? "small-medium" : ' +
          'source < 8 ? "tiny-large/small elemental" : ' +
          'source < 10 ? "dimunitive-huge/medium elemental" : ' +
          'source < 12 ? "dimunitive-huge/large elemental/plant" : ' +
          '"dimunitive-huge/elemental/plant";'
      );
      rules.defineRule
        ('magicNotes.wildShapeFeature.1', 'levels.Druid', '=', null);
      rules.defineRule('magicNotes.wildShapeFeature.2',
        'levels.Druid', '=', 'Math.floor((source - 2) / 2)'
      );
      rules.defineRule
        ('selectableFeatureCount.Druid', 'levels.Druid', '=', '1');
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Druid', '+=', null,
        'charismaModifier', '+', null
      );

/*
      // TODO
      rules.defineRule('animalCompanionLevel',
        'levels.Druid', '+=', 'Math.floor((source + 3) / 3)'
      );
      rules.defineRule
        ('animalCompanionMasterLevel', 'levels.Druid', '+=', null);
*/

    } else if(klass == 'Fighter') {

      baseAttack = Pathfinder.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '2:Bravery', '3:Armor Training', '5:Weapon Training',
        '19:Armor Mastery', '20:Weapon Mastery'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.armorMasteryFeature:DR 5/- when using armor/shield',
        'combatNotes.weaponMasteryFeature:' +
          'Critical automatically hits/+1 damage multiplier/no disarm w/' +
          'chosen weapon',
        'combatNotes.weaponTrainingFeature:' +
          'Attack/damage bonus w/weapons from trained groups',
        'saveNotes.braveryFeature:+%V vs. fear',
        'skillNotes.armorTrainingFeature:-%V armor penalty'
      ];
      profArmor = Pathfinder.PROFICIENCY_HEAVY;
      profShield = Pathfinder.PROFICIENCY_TOWER;
      profWeapon = Pathfinder.PROFICIENCY_MEDIUM;
      saveFortitude = Pathfinder.SAVE_BONUS_GOOD;
      saveReflex = Pathfinder.SAVE_BONUS_POOR;
      saveWill = Pathfinder.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Climb', 'Craft', 'Handle Animal', 'Intimidate',
        'Knowledge (Dungeoneering)', 'Knowledge (Engineering)', 'Profession',
        'Ride', 'Survival', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('damageReduction.All', 'combatNotes.armorMasteryFeature', '+=', null);
      rules.defineRule('featCount.Fighter',
        'levels.Fighter', '=', '1 + Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.braveryFeature',
        'levels.Fighter', '=', 'Math.floor((source + 2) / 4)'
      );
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'skillNotes.armorTrainingFeature', '+', null
      );
      rules.defineRule('skillNotes.armorTrainingFeature',
        'levels.Fighter', '=', 'Math.floor((source + 1) / 4)'
      );

    } else if(klass == 'Monk') {

      // TODO flurry of blows attack bonus
      baseAttack = Pathfinder.ATTACK_BONUS_AVERAGE;
      feats = [
        'Catch Off Guard', 'Combat Reflexes', 'Deflect Arrows', 'Dodge',
        'Improved Grapple', 'Scorpion Style', 'Throw Anything',
        'Gorgon\'s Fist', 'Improved Bull Rush', 'Improved Disarm',
        'Improved Feint', 'Improved Trip', 'Mobility', 'Improved Critical',
        'Medusa\'s Wrath', 'Snatch Arrows', 'Spring Attack'
      ];
      features = [
        '1:Two Weapon Fighting', '1:Stunning Fist', '1:Unarmed Strike',
        '2:Evasion', '3:Fast Movement', '3:Maneuver Training', '3:Still Mind',
        '4:Ki Pool', '4:Magic Ki Strike', '4:Slow Fall', '5:High Jump',
        '5:Purity Of Body', '7:Wholeness Of Body',
        '8:Improved Two Weapon Fighting', '9:Improved Evasion',
        '10:Lawful Ki Strike', '11:Diamond Body', '12:Abundant Step',
        '13:Diamond Soul', '15:Greater Two Weapon Fighting',
        '15:Quivering Palm', '16:Adamantine Ki Strike', '17:Timeless Body',
        '17:Tongue Of The Sun And Moon', '19:Empty Body', '20:Perfect Self'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.adamantineKiStrikeFeature:' +
          'Treat ki strike as adamantine weapon',
        'combatNotes.greaterTwoWeaponFightingFeature:Fourth attack at -10',
        'combatNotes.improvedTwoWeaponFightingFeature:Third attack at -5',
        'featureNotes.kiPoolFeature:' +
          'Ki strike/additional attack/+20 speed/+4 AC %V/day',
        'combatNotes.lawfulKiStrikeFeature:Treat ki strike as lawful weapon',
        'combatNotes.magicKiStrikeFeature:Treat ki strike as magic weapon',
        'combatNotes.maneuverTrainingFeature:' + // TODO
          'Use Monk level instead of base attack for combat maneuver bonus',
        'combatNotes.perfectSelfFeature:DR 10/chaotic',
        'combatNotes.quiveringPalmFeature:' +
          'Foe makes DC %V Fortitude save or dies 1/day',
        'combatNotes.stunningFistFeature:TODO', // TODO
        'combatNotes.twoWeaponFightingFeature:Take -2 penalty for extra attack',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tongueOfTheSunAndMoonFeature:Speak w/any living creature',
        'magicNotes.abundantStepFeature:' +
          'Use ki pool to <i>Dimension Door</i> at level %V',
        'magicNotes.emptyBodyFeature:' +
          'Use ki pool for 1 minute <i>Etherealness</i>',
        'magicNotes.wholenessOfBodyFeature:' +
          'Use ki pool to heal %V damage to self/day',
        'saveNotes.diamondBodyFeature:Immune to poison',
        'saveNotes.diamondSoulFeature:DC %V spell resistance',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.perfectSelfFeature:Treat as outsider for magic saves',
        'saveNotes.purityOfBodyFeature:Immune to all disease',
        'saveNotes.slowFallFeature:' +
          'Subtract %V ft from falling damage distance',
        'saveNotes.stillMindFeature:+2 vs. enchantment',
        'skillNotes.highJumpFeature:Use ki pool for +%V Acrobatics (Jump)',
        'validationNotes.Gorgon\'sFistSelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.improvedBullRushSelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.improvedDisarmSelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.improvedFeintSelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.improvedTripSelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.mobilitySelectableFeatureLevels:' +
           'Requires Monk >= 6',
        'validationNotes.improvedCriticalSelectableFeatureLevels:' +
           'Requires Monk >= 10',
        'validationNotes.medusa\'sWrathSelectableFeatureLevels:' +
           'Requires Monk >= 10',
        'validationNotes.snatchArrowsSelectableFeatureLevels:' +
           'Requires Monk >= 10',
        'validationNotes.springAttackSelectableFeatureLevels:' +
           'Requires Monk >= 10',
        'validationNotes.monkClassAlignment:Requires Alignment =~ Lawful',
      ];
      profArmor = Pathfinder.PROFICIENCY_NONE;
      profShield = Pathfinder.PROFICIENCY_NONE;
      profWeapon = Pathfinder.PROFICIENCY_NONE;
      saveFortitude = Pathfinder.SAVE_BONUS_GOOD;
      saveReflex = Pathfinder.SAVE_BONUS_GOOD;
      saveWill = Pathfinder.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Acrobatics', 'Climb', 'Craft', 'Escape Artist', 'Intimidate',
        'Jump', 'Knowledge (History)', 'Knowledge (Religion)', 'Perception',
        'Perform', 'Profession', 'Ride', 'Sense Motive', 'Stealth', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('abilityNotes.fastMovementFeature',
        'levels.Monk', '+=', '10 * Math.floor(source / 3)'
      );
      rules.defineRule // TODO also CMD
        ('armorClass', 'combatNotes.monkArmorClassAdjustment', '+', null);
      rules.defineRule('combatNotes.monkArmorClassAdjustment',
        'levels.Monk', '+=', 'Math.floor(source / 4)',
        'wisdomModifier', '+', 'source > 0 ? source : null'
      );
      rules.defineRule('combatNotes.quiveringPalmFeature',
        'levels.Monk', '+=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.stunningFistFeature.1',
        'levels.Monk', '+=', 'source - Math.floor(source / 4)'
      );
      rules.defineRule('damageReduction.Chaotic',
        'combatNotes.perfectSelfFeature', '+=', '10'
      );
      rules.defineRule('featCount.Monk',
        'levels.Monk', '=', '1 + Math.floor((source + 2) / 4)'
      );
      rules.defineRule('featureNotes.kiPoolFeature',
        'levels.Monk', '=', 'Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('magicNotes.abundantStepFeature',
        'levels.Monk', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule
        ('magicNotes.wholenessOfBodyFeature', 'levels.Monk', '=', null);
      rules.defineRule
        ('resistance.Enchantment', 'saveNotes.stillMindFeature', '+=', '2');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.diamondSoulFeature', '+=', null);
      rules.defineRule
        ('saveNotes.diamondSoulFeature', 'levels.Monk', '+=', '10 + source');
      rules.defineRule('saveNotes.slowFallFeature',
        'levels.Monk', '=',
        'source < 4 ? null : source < 20 ? Math.floor(source / 2) * 10 : "all"'
      );
      rules.defineRule('skillNotes.highJumpFeature', 'levels.Monk', '=', null);
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);
      rules.defineRule('weaponDamage.Unarmed',
        'levels.Monk', '=',
        'source < 12 ? ("d" + (6 + Math.floor(source / 4) * 2)) : ' +
        '              ("2d" + (6 + Math.floor((source - 12) / 4) * 2))'
      );

    } else if(klass == 'Paladin') {

      baseAttack = Pathfinder.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Aura Of Good', '1:Detect Evil', '1:Smite Evil', '2:Divine Grace',
        '2:Lay On Hands', '3:Aura Of Courage', '3:Divine Health', '3:Mercy',
        '4:Channel Energy', '5:Divine Bond', '8:Aura Of Resolve',
        '11:Aura Of Justice', '14:Aura Of Faith', '17:Aura Of Righteousness',
        '17:Resist Evil', '20:Holy Champion'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.auraOfJusticeFeature:' +
          'Grant Smite Evil to allies w/in 10 ft',
        'combatNotes.auraOfRighteousnessFeature:DR %V/evil',
        'combatNotes.smiteEvilFeature:' +
          '+%V attack/+%1 damage/+%2 AC vs. evil foe %3/day',
        'magicNotes.auraOfGoodFeature:Visible to <i>Detect Good</i>',
        'magicNotes.channelEnergyFeature:' +
          'Heal/inflict %Vd6 damage, DC %1 Will for half %2/day',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.holyChampionFeature:' +
          'Maximize lay on hands; smite evil DC %V <i>Banishment</i>',
        'magicNotes.layOnHandsFeature:Harm undead or heal %Vd6 HP %1/day',
        'magicNotes.mercyFeature:Lay on hands removes additional effects',
        'saveNotes.auraOfCourageFeature:Immune fear; +4 to allies w/in 30 ft',
        'saveNotes.auraOfResolveFeature:Immune charm; +4 to allies w/in 30 ft',
        'saveNotes.auraOfRighteousnessFeature:' +
          'Immune compulsion; +4 to allies w/in 30 ft',
        'saveNotes.divineGraceFeature:+%V all saves',
        'saveNotes.divineHealthFeature:Immune to disease',
        'validationNotes.paladinClassAlignment:' +
          'Requires Alignment == Lawful Good'
      ];
      profArmor = Pathfinder.PROFICIENCY_HEAVY;
      profShield = Pathfinder.PROFICIENCY_HEAVY;
      profWeapon = Pathfinder.PROFICIENCY_MEDIUM;
      saveFortitude = Pathfinder.SAVE_BONUS_GOOD;
      saveReflex = Pathfinder.SAVE_BONUS_POOR;
      saveWill = Pathfinder.SAVE_BONUS_GOOD;
      selectableFeatures = ['Divine Mount', 'Divine Weapon']; // TODO
      skillPoints = 2;
      skills = [
        'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (Nobility)',
        'Knowledge (Religion)', 'Profession', 'Ride', 'Sense Motive',
        'Spellcraft'
      ];
      rules.defineRule('casterLevelDivine',
        'levels.Paladin', '+=', 'source >= 4 ? source - 3 : null'
      );
      rules.defineRule('combatNotes.auraOfRighteousnessFeature',
        'levels.Paladin', '=', 'source < 20 ? 5 : 10'
      );
      rules.defineRule('combatNotes.smiteEvilFeature',
        'charismaModifier', '=', 'source > 0 ? source : 0'
      );
      rules.defineRule
        ('combatNotes.smiteEvilFeature.1', 'levels.Paladin', '=', null);
      rules.defineRule('combatNotes.smiteEvilFeature.2',
        'charismaModifier', '=', 'source > 0 ? source : 0'
      );
      rules.defineRule('combatNotes.smiteEvilFeature.3',
        'levels.Paladin', '=', 'Math.floor((source + 2) / 3)'
      );
      rules.defineRule('damageReduction.Evil',
        'combatNotes.auraOfRighteousnessFeature', '+=', null
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
      spellAbility = 'charisma';
      spellsKnown = [
        'P1:4:"all"', 'P2:7:"all"', 'P3:10:"all"', 'P4:13:"all"'
      ];
      spellsPerDay = [
        'P1:4:0/5:1/9:2/13:3/17:4',
        'P2:8:0/9:1/12:2/16:3/20:4',
        'P3:19:0/11:1/15:2/19:3',
        'P4:13:0/14:1/18:2/20:3'
      ];

/*
      // TODO
      rules.defineRule('mountLevel',
        'levels.Paladin', '+=',
        'source < 5 ? null : source < 8 ? 1 : source < 11 ? 2 : ' +
        'source < 15 ? 3 : 4'
      );
      rules.defineRule('mountMasterLevel', 'levels.Paladin', '+=', null);
*/

/*
    } else if(klass == 'Ranger') {

      baseAttack = Pathfinder.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Favored Enemy', '1:Track', '1:Wild Empathy', '2:Rapid Shot',
        '2:Two-Weapon Fighting', '3:Endurance', '4:Animal Companion',
        '6:Manyshot', '6:Improved Two-Weapon Fighting', '7:Woodland Stride',
        '8:Swift Tracker', '9:Evasion', '11:Improved Precise Shot',
        '11:Greater Two-Weapon Fighting', '13:Camouflage',
        '17:Hide In Plain Sight'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.favoredEnemyFeature:' +
          '+2 or more damage vs. %V type(s) of creatures',
        'combatNotes.greaterTwo-WeaponFightingFeature:' +
          'Second off-hand -10 attack',
        'combatNotes.improvedPreciseShotFeature:' +
          'No foe bonus for partial concealment; attack grappling w/no penalty',
        'combatNotes.improvedTwo-WeaponFightingFeature:Additional -5 attack',
        'combatNotes.manyshotFeature:' +
          'Fire up to %V arrows simultaneously at -2 attack/arrow',
        'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
        'combatNotes.two-WeaponFightingFeature:' +
          'Reduce on-hand penalty by 2/off-hand by 6',
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'saveNotes.enduranceFeature:+4 extended physical action',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'skillNotes.camouflageFeature:Hide in any natural terrain',
        'skillNotes.favoredEnemyFeature:' +
          '+2 or more Bluff/Listen/Sense Motive/Spot/Survival ' +
          'vs. %V type(s) of creatures',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.swiftTrackerFeature:Track at full speed',
        'skillNotes.trackFeature:Survival to follow creatures\' trail',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      profArmor = Pathfinder.PROFICIENCY_LIGHT;
      profShield = Pathfinder.PROFICIENCY_HEAVY;
      profWeapon = Pathfinder.PROFICIENCY_MEDIUM;
      saveFortitude = Pathfinder.SAVE_BONUS_GOOD;
      saveReflex = Pathfinder.SAVE_BONUS_GOOD;
      saveWill = Pathfinder.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Combat Style (Archery)', 'Combat Style (Two-Weapon Combat)'
      ];
      skillPoints = 6;
      skills = [
        'Climb', 'Concentration', 'Craft', 'Handle Animal', 'Heal', 'Hide',
        'Jump', 'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
        'Knowledge (Nature)', 'Listen', 'Move Silently', 'Profession', 'Ride',
        'Search', 'Spot', 'Survival', 'Swim', 'Use Rope'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'R1:4:"all"', 'R2:8:"all"', 'R3:11:"all"', 'R4:14:"all"'
      ];
      spellsPerDay = [
        'R1:4:0/6:1/14:2/18:3',
        'R2:8:0/10:1/16:2/19:3',
        'R3:11:0/12:1/17:2/19:3',
        'R4:14:0/15:1/19:2/20:3'
      ];
      rules.defineRule('animalCompanionLevel',
        'levels.Ranger', '+=', 'source<4 ? null : Math.floor((source + 6) / 6)'
      );
      rules.defineRule
        ('animalCompanionMasterLevel', 'levels.Ranger', '+=', null);
      rules.defineRule('casterLevelDivine',
        'levels.Ranger', '+=', 'source < 4 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('combatNotes.manyshotFeature',
        'baseAttack', '=', 'Math.floor((source + 9) / 5)'
      );
      rules.defineRule('rangerFeatures.Rapid Shot',
        'selectableFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Manyshot',
        'selectableFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Improved Precise Shot',
        'selectableFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Two-Weapon Fighting',
        'selectableFeatures.Combat Style (Two-Weapon Combat)', '?', null
      );
      rules.defineRule('rangerFeatures.Improved Two-Weapon Fighting',
        'selectableFeatures.Combat Style (Two-Weapon Combat)', '?', null
      );
      rules.defineRule('rangerFeatures.Greater Two-Weapon Fighting',
        'selectableFeatures.Combat Style (Two-Weapon Combat)', '?', null
      );
      rules.defineRule('selectableFeatureCount.Ranger',
        'levels.Ranger', '=', 'source >= 2 ? 1 : null'
      );
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Ranger', '+=', null,
        'charismaModifier', '+', null
      );

    } else if(klass == 'Rogue') {

      baseAttack = Pathfinder.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Sneak Attack', '1:Trapfinding', '2:Evasion', '3:Trap Sense',
        '4:Uncanny Dodge', '8:Improved Uncanny Dodge'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.cripplingStrikeFeature: ' +
          '2 points strength damage from sneak attack',
        'combatNotes.defensiveRollFeature:' +
          'DC damage Reflex save vs. lethal blow for half damage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.opportunistFeature:AOO vs. foe struck by ally',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.uncannyDodgeFeature:Always adds dexterity modifier to AC',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
        'skillNotes.skillMasteryFeature:' +
          'Never distracted from designated skills',
        'skillNotes.trapfindingFeature:' +
          'Use Search/Disable Device to find/remove DC 20+ traps'
      ];
      profArmor = Pathfinder.PROFICIENCY_LIGHT;
      profShield = Pathfinder.PROFICIENCY_NONE;
      profWeapon = Pathfinder.PROFICIENCY_LIGHT;
      saveFortitude = Pathfinder.SAVE_BONUS_POOR;
      saveReflex = Pathfinder.SAVE_BONUS_GOOD;
      saveWill = Pathfinder.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Crippling Strike', 'Defensive Roll', 'Feat Bonus', 'Improved Evasion',
        'Opportunist', 'Skill Mastery', 'Slippery Mind'
      ];
      skillPoints = 8;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script',
        'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Intimidate', 'Jump',
        'Knowledge (Local)', 'Listen', 'Move Silently', 'Open Lock',
        'Perform', 'Profession', 'Search', 'Sense Motive', 'Sleight Of Hand',
        'Spot', 'Swim', 'Tumble', 'Use Magic Device', 'Use Rope'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule
        ('featCount.General', 'features.Feat Bonus', '+=', 'null');
      rules.defineRule('saveNotes.trapSenseFeature',
        'levels.Rogue', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
      );
      rules.defineRule('selectableFeatureCount.Rogue',
        'levels.Rogue', '+=', 'source>=10 ? Math.floor((source-7)/3) : null'
      );

    } else if(klass == 'Sorcerer') {

      baseAttack = Pathfinder.ATTACK_BONUS_POOR;
      feats = null;
      features = ['1:Summon Familiar'];
      hitDie = 4;
      notes = [
        'featureNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      profArmor = Pathfinder.PROFICIENCY_NONE;
      profShield = Pathfinder.PROFICIENCY_NONE;
      profWeapon = Pathfinder.PROFICIENCY_LIGHT;
      saveFortitude = Pathfinder.SAVE_BONUS_POOR;
      saveReflex = Pathfinder.SAVE_BONUS_POOR;
      saveWill = Pathfinder.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Bluff', 'Concentration', 'Craft', 'Knowledge (Arcana)', 'Profession',
        'Spellcraft'
      ];
      spellAbility = 'charisma';
      spellsKnown = [
        'S0:1:4/2:5/4:6/6:7/8:8/10:9',
        'S1:1:2/3:3/5:4/7:5',
        'S2:4:1/5:2/7:3/9:4/11:5',
        'S3:6:1/7:2/9:3/11:4',
        'S4:8:1/9:2/11:3/13:4',
        'S5:10:1/11:2/13:3/15:4',
        'S6:12:1/13:2/15:3',
        'S7:14:1/15:2/17:3',
        'S8:16:1/17:2/19:3',
        'S9:18:1/19:2/20:3'
      ];
      spellsPerDay = [
        'S0:1:5/2:6',
        'S1:1:3/2:4/3:5/4:6',
        'S2:4:3/5:4/6:5/7:6',
        'S3:6:3/7:4/8:5/9:6',
        'S4:8:3/9:4/10:5/11:6',
        'S5:10:3/11:4/12:5/13:6',
        'S6:12:3/13:4/14:5/15:6',
        'S7:14:3/15:4/16:5/17:6',
        'S8:16:3/17:4/18:5/19:6',
        'S9:18:3/19:4/20:6'
      ];
      rules.defineRule('casterLevelArcane', 'levels.Sorcerer', '+=', null);
      rules.defineRule
        ('familiarLevel', 'levels.Sorcerer', '+=', 'Math.floor(source / 2)');
      rules.defineRule('familiarMasterLevel', 'levels.Sorcerer', '+=', null);

    } else if(klass == 'Wizard') {

      baseAttack = Pathfinder.ATTACK_BONUS_POOR;
      feats = ['Spell Mastery'];
      for(var j = 0; j < Pathfinder.FEATS.length; j++) {
        var pieces = Pathfinder.FEATS[j].split(':');
        if(pieces[1].match(/Item Creation|Metamagic/)) {
          feats[feats.length] = pieces[0];
        }
      }
      features = ['1:Scribe Scroll', '1:Summon Familiar'];
      hitDie = 4;
      notes = [
        'featureNotes.summonFamiliarFeature:Special bond/abilities',
        'magicNotes.scribeScrollFeature:Create scroll of any known spell',
        'magicNotes.wizardSpecialization:Extra %V spell/day each spell level',
        'skillNotes.wizardSpecialization:+2 Spellcraft (%V)'
      ];
      profArmor = Pathfinder.PROFICIENCY_NONE;
      profShield = Pathfinder.PROFICIENCY_NONE;
      profWeapon = Pathfinder.PROFICIENCY_NONE;
      saveFortitude = Pathfinder.SAVE_BONUS_POOR;
      saveReflex = Pathfinder.SAVE_BONUS_POOR;
      saveWill = Pathfinder.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Concentration', 'Craft', 'Decipher Script', 'Knowledge', 'Profession',
        'Spellcraft'
      ];
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:1:"all"', 'W1:1:3/2:5', 'W2:3:2/4:4', 'W3:5:2/6:4',
        'W4:7:2/8:4', 'W5:9:2/10:4', 'W6:11:2/12:4', 'W7:13:2/14:4',
        'W8:15:2/16:4', 'W9:17:2/18:4/19:6/20:8'
      ];
      spellsPerDay = [
        'W0:1:3/2:4',
        'W1:1:1/2:2/4:3/7:4',
        'W2:3:1/4:2/6:3/9:4',
        'W3:5:1/6:2/8:3/11:4',
        'W4:7:1/8:2/10:3/13:4',
        'W5:9:1/10:2/12:3/15:4',
        'W6:11:1/12:2/14:3/17:4',
        'W7:13:1/14:2/16:3/19:4',
        'W8:15:1/16:2/18:3/20:4',
        'W9:17:1/18:2/19:3/20:4'
      ];
      rules.defineRule('casterLevelArcane', 'levels.Wizard', '+=', null);
      rules.defineRule
        ('familiarLevel', 'levels.Wizard', '+=', 'Math.floor(source / 2)');
      rules.defineRule('familiarMasterLevel', 'levels.Wizard', '+=', null);
      rules.defineRule('featCount.Wizard',
        'levels.Wizard', '=', 'source >= 5 ? Math.floor(source / 5) : null'
      );
      for(var j = 0; j < Pathfinder.SCHOOLS.length; j++) {
        var school = Pathfinder.SCHOOLS[j].split(':')[0];
        rules.defineRule('magicNotes.wizardSpecialization',
         'specialize.' + school, '=', '"' + school + '"'
        );
        rules.defineRule('skillNotes.wizardSpecialization',
          'specialize.' + school, '=', '"' + school + '"'
        );
      }
      for(var j = 0; j < 10; j++) {
        rules.defineRule
          ('spellsPerDay.W' + j, 'magicNotes.wizardSpecialization', '+', '1');
      }
*/

    } else
      continue;

    SRD35.defineClass
      (rules, klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       spellsKnown, spellsPerDay, spellAbility);
    if(notes != null)
      rules.defineNote(notes);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + klass);
      }
    }
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + klass);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }

  }

  rules.defineNote
    ('validationNotes.selectableFeaturesTotal:' +
     'Allocated selectable features differ from selectable features count ' +
     'total by %V');
  rules.defineRule('validationNotes.selectableFeaturesTotal',
    /^selectableFeatureCount\./, '+=', '-source',
    /^selectableFeatures\./, '+=', 'source'
  );

};

/* Defines the rules related to combat. */
Pathfinder.combatRules = function(rules) {
  SRD35.combatRules(rules); // TODO
};

/* Defines the rules related to companion creatures. */
Pathfinder.companionRules = function(rules, companions) {
  SRD35.companionRules(rules, companions); // TODO
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Pathfinder.createViewers = function(rules, viewers) {
  SRD35.createViewers(rules, viewers); // No changes
}

/* Defines the rules related to character description. */
Pathfinder.descriptionRules = function(rules, alignments, deities, genders) {
  SRD35.descriptionRules(rules, alignments, deities, genders); // No changes
};

/* Defines the rules related to equipment. */
Pathfinder.equipmentRules = function(rules, armors, goodies, shields, weapons) {
  SRD35.equipmentRules(rules, armors, goodies, shields, weapons); // TODO
};

/* Defines the rules related to feats. */
Pathfinder.featRules = function(rules, feats, subfeats) {
  SRD35.featRules(rules, feats, subfeats); // TODO
};

/* Defines the rules related to spells and domains. */
Pathfinder.magicRules = function(rules, classes, domains, schools) {
  SRD35.magicRules(rules, classes, domains, schools); // TODO
};

/* Defines the rules related to character movement. */
Pathfinder.movementRules = function(rules) {
  SRD35.movementRules(rules); // No changes
};

/* Defines the rules related to character races. */
Pathfinder.raceRules = function(rules, languages, races) {

  rules.defineChoice('languages', languages);
  for(var i = 0; i < languages.length; i++) {
    if(languages[i] == 'Common')
      rules.defineRule('languages.Common', '', '=', '1');
  }
  rules.defineRule('languageCount',
    'race', '=', 'source == "Gnome" ? 3 : source != "Human" ? 2 : 1'
  );
  rules.defineNote
    ('validationNotes.languagesTotal:Allocated languages differ from ' +
     'language total by %V');
  rules.defineRule('validationNotes.languagesTotal',
    'languageCount', '+=', '-source',
    /^languages\./, '+=', null
  );

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, notes;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Half Elf') {

      adjustment = null; // TODO
      features = [
        'Adaptability', 'Elf Blood', 'Keen Senses', 'Low Light Vision',
        'Multitalented', 'Resist Enchantment', 'Sleep Immunity'
      ];
      notes = [
        'featureNodes.elfBloodFeature:Both elf and human for racial effects',
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'featureNotes.multitalented:' +
          '+1 hit point or skill point per level of favored class',
        'saveNotes.resistEnchantmentFeature:+2 vs. enchantment',
        'saveNotes.sleepImmunityFeature:Immune <i>Sleep</i>',
        'skillNotes.adaptability:Skill Focus bonus feat',
        'skillNotes.keenSensesFeature:+2 Perception'
      ];
      rules.defineRule
        ('featCount.General', 'skillNotes.adaptability', '+', '1');
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low Light Vision', '+', null
      );
      rules.defineRule('resistance.Enchantment',
        'saveNotes.resistEnchantmentFeature', '+=', '2'
      );
      rules.defineRule('languages.Elven',
        'race', '=', 'source.indexOf("Elf") >= 0 ? 1 : null'
      );

    } else if(race == 'Half Orc') {

      adjustment = null; // TODO
      features = ['Darkvision', 'Intimidating', 'Orc Blood', 'Orc Ferocity'];
      notes = [
        'combatNotes.orcFerocityFeature:Fight 1 round below zero hit points',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'featureNodes.orcBloodFeature:Both orc and human for racial effects',
        'skillNotes.intimidatingFeature:+2 Intimidate'
      ];
      rules.defineRule('featureNotes.darkvisionFeature',
        'halfOrcFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('languages.Orc',
        'race', '=', 'source.indexOf("Orc") >= 0 ? 1 : null'
      );

    } else if(race.match(/Dwarf/)) {

      adjustment = '+2 constitution/+2 wisdom/-2 charisma';
      features = [
        'Darkvision', 'Defensive Training', 'Dwarf Hatred', 'Greed', 'Hardy',
        'Hatred', 'Slow And Steady', 'Stability', 'Stonecunning'
      ];
      notes = [
        'abilityNotes.slowAndSteadyFeature:No speed penalty in armor',
        'combatNotes.defensiveTrainingFeature:+4 AC vs. giant creatures',
        'combatNotes.dwarfHatredFeature:+1 attack vs. goblinoid/orc',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'saveNotes.hardyFeature:+2 vs. poison/spells',
        'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
        'skillNotes.greedFeature:+2 Appraise involving precious metal or gems',
        'skillNotes.stonecunningFeature:' +
          '+2 Perception involving stone/automatic check w/in 10 ft'
      ];

      rules.defineRule('abilityNotes.slowAndSteadyFeature',
        'abilityNotes.armorSpeedAdjustment', '^', '0'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        raceNoSpace + 'Features.Darkvision', '+=', '60'
      );
      rules.defineRule('languages.Dwarven',
        'race', '=', 'source.indexOf("Dwarf") >= 0 ? 1 : null'
      );
      rules.defineRule
        ('resistance.Poison', 'saveNotes.hardyFeature', '+=', '2');
      rules.defineRule('resistance.Spell', 'saveNotes.hardyFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');

    } else if(race.match(/Elf/)) {

      adjustment = '+2 dexterity/+2 intelligence/-2 constitution';
      features = [
        'Elven Magic', 'Keen Senses', 'Low Light Vision', 'Resist Enchantment',
        'Sleep Immunity'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'magicNotes.elvenMagicFeature:+2 vs. spell resistance',
        'saveNotes.resistEnchantmentFeature:+2 vs. enchantment',
        'saveNotes.sleepImmunityFeature:Immune <i>Sleep</i>',
        'skillNotes.elvenMagicFeature:' +
          '+2 Spellcraft to identify magic item properties',
        'skillNotes.keenSensesFeature:+2 Perception'
      ];
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low Light Vision', '+', null
      );
      rules.defineRule('resistance.Enchantment',
        'saveNotes.resistEnchantmentFeature', '+=', '2'
      );
      rules.defineRule('languages.Elven',
        'race', '=', 'source.indexOf("Elf") >= 0 ? 1 : null'
      );

    } else if(race.match(/Gnome/)) {

      adjustment = '+2 constitution/+2 charisma/-2 strength';
      features = [
        'Defensive Training', 'Gnome Hatred', 'Keen Senses',
        'Low Light Vision', 'Natural Illusionist', 'Natural Spells',
        'Obsessive', 'Resist Illusion', 'Slow', 'Small',
      ];
      notes = [
        'combatNotes.defensiveTrainingFeature:+4 AC vs. giant creatures',
        'combatNotes.gnomeHatredFeature:+1 attack vs. goblinoid/reptilian',
        'combatNotes.smallFeature:+1 AC/attack; -1 combat maneuver',
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'magicNotes.naturalIllusionistFeature:+1 DC on illusion spells',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'saveNotes.resistIllusionFeature:+2 vs. illusions',
        'skillNotes.keenSensesFeature:+2 Perception',
        'skillNotes.obsessiveFeature:+2 on choice of Craft/Profession',
        'skillNotes.smallFeature:+4 Stealth'
      ];

      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low Light Vision', '+', null
      );
      rules.defineRule('languages.Gnome',
        'race', '=', 'source.indexOf("Gnome") >= 0 ? 1 : null'
      );
      rules.defineRule('languages.Sylvan',
        'race', '=', 'source.indexOf("Gnome") >= 0 ? 1 : null'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'charisma', '?', 'source >= 11',
        raceNoSpace + 'Features.Natural Spells', '=',
        '"<i>Dancing Lights</i>/<i>Ghost Sound</i>/<i>Prestidigitation</i>/' +
        '<i>Speak With Animals</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1',
        'level', '=', null,
        raceNoSpace + 'Features.Natural Spells', 'v', '1'
      );
      rules.defineRule
        ('resistance.Illusion', 'saveNotes.resistIllusionFeature', '+=', '2');

    } else if(race.match(/Halfling/)) {

      adjustment = '+2 dexterity/+2 charisma/-2 strength';
      features = [
        'Fearless', 'Halfling Luck', 'Keen Senses', 'Slow', 'Small', 'Sure-Footed'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack; -1 combat maneuver',
        'saveNotes.fearlessFeature:+2 vs. fear',
        'saveNotes.halflingLuckFeature:+1 all saves',
        'skillNotes.keenSensesFeature:+2 Perception',
        'skillNotes.smallFeature:+4 Stealth',
        'skillNotes.sure-FootedFeature:+2 Acrobatics/Climb'
      ];
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Fear', 'saveNotes.fearlessFeature', '+=', '2');
      rules.defineRule
        ('save.Fortitude', 'saveNotes.halflingLuckFeature', '+', '1');
      rules.defineRule
        ('save.Reflex', 'saveNotes.halflingLuckFeature', '+', '1');
      rules.defineRule
        ('save.Will', 'saveNotes.halflingLuckFeature', '+', '1');
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule('languages.Halfling',
        'race', '=', 'source.indexOf("Halfling") >= 0 ? 1 : null'
      );

    } else if(race.match(/Human/)) {

      adjustment = null;
      features = null;
      notes = null;
      rules.defineRule
        ('featCount.General', 'featureNotes.humanFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.humanFeatCountBonus',
        'race', '+=', 'source == "Human" ? 1 : null'
      );
      rules.defineRule('skillNotes.humanSkillPointsBonus',
        'race', '?', 'source == "Human"',
        'level', '=', 'source'
      );
      rules.defineRule
        ('skillPoints', 'skillNotes.humanSkillPointsBonus', '+', null);

    } else
      continue;

    SRD35.defineRace(rules, race, adjustment, features);
    if(notes != null) {
      rules.defineNote(notes);
    }

  }

};


/* Returns HTML body content for user notes associated with this rule set. */
Pathfinder.ruleNotes = function() {
  return '' +
    '<h2>Pathfinder Scribe Module Notes</h2>\n' +
    'Pathfinder Scribe Module Version ' + Pathfinder_VERSION + '\n' +
    '\n'; // TODO
};

/* Defines the rules related to character skills. */
Pathfinder.skillRules = function(rules, skills, subskills) {
  SRD35.skillRules(rules, skills, subskills); // TODO
};

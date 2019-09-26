/*
Copyright 2015, James J. Hayes

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

var PATHFINDER_VERSION = '1.2.0';

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

  var rules = new ScribeRules('Pathfinder', PATHFINDER_VERSION);
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', SRD35.RANDOMIZABLE_ATTRIBUTES);
  rules.editorElements = SRD35.initialEditorElements();
  rules.randomizeOneAttribute = SRD35.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = Pathfinder.ruleNotes;
  Pathfinder.viewer = new ObjectViewer();
  Pathfinder.createViewers(rules, SRD35.VIEWERS);
  Pathfinder.abilityRules(rules);
  Pathfinder.raceRules(
    rules, SRD35.LANGUAGES.concat(Pathfinder.LANGUAGES_ADDED), SRD35.RACES
  );
  Pathfinder.classRules(rules, SRD35.CLASSES, Pathfinder.BLOODLINES);
  Pathfinder.companionRules
    (rules, Pathfinder.ANIMAL_COMPANIONS, Pathfinder.FAMILIARS);
  Pathfinder.skillRules(rules, Pathfinder.SKILLS, Pathfinder.SUBSKILLS);
  Pathfinder.featRules(rules, Pathfinder.FEATS, Pathfinder.SUBFEATS);
  Pathfinder.descriptionRules
    (rules, SRD35.ALIGNMENTS, Pathfinder.DEITIES, SRD35.GENDERS);
  Pathfinder.equipmentRules
    (rules, SRD35.ARMORS, SRD35.GOODIES, SRD35.SHIELDS,
     SRD35.WEAPONS.concat(Pathfinder.WEAPONS_ADDED));
  Pathfinder.combatRules(rules);
  Pathfinder.movementRules(rules);
  Pathfinder.magicRules
    (rules, SRD35.CLASSES, SRD35.DOMAINS.concat(Pathfinder.DOMAINS_ADDED),
     SRD35.SCHOOLS);
  Scribe.addRuleSet(rules);
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

  rules.defineChoice('factions', Pathfinder.FACTIONS);
  rules.defineChoice('random', 'faction');
  rules.defineEditorElement
    ('faction', 'Faction', 'select-one', 'factions', 'levels');
  rules.defineSheetElement('Faction', 'Alignment');

}

// Arrays of choices
Pathfinder.ANIMAL_COMPANIONS = {
  'Ape': 'AC=11 Dam=2x1d4,1d4 Str=13 Dex=17 Con=10 Int=2 Wis=12 Cha=7',
  'Badger': 'AC=12 Dam=1d4 Str=10 Dex=17 Con=15 Int=2 Wis=12 Cha=10',
  'Bear': 'AC=12 Dam=2x1d3,1d4 Str=15 Dex=15 Con=13 Int=2 Wis=12 Cha=6',
  'Boar': 'AC=16 Dam=1d6 Str=13 Dex=12 Con=15 Int=2 Wis=13 Cha=4',
  'Camel': 'AC=11 Dam=1d4 Str=18 Dex=16 Con=14 Int=2 Wis=11 Cha=4',
  'Cheetah': 'AC=11 Dam=2x1d2,1d4 Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6',
  'Constrictor': 'AC=12 Dam=1d3 Str=15 Dex=17 Con=13 Int=1 Wis=12 Cha=2',
  'Crocodile': 'AC=14 Dam=1d6 Str=15 Dex=14 Con=15 Int=1 Wis=12 Cha=2',
  'Deinonychus': 'AC=11 Dam=2x1d6,1d4 Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14',
  'Dog': 'AC=12 Dam=1d4 Str=13 Dex=17 Con=15 Int=2 Wis=12 Cha=6',
  'Eagle': 'AC=11 Dam=2x1d4+1d4 Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6',
  'Hawk': 'AC=11 Dam=2x1d4+1d4 Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6',
  'Horse': 'AC=14 Dam=2x1d6,1d4 Str=16 Dex=13 Con=15 Int=2 Wis=12 Cha=6',
  'Leopard': 'AC=11 Dam=2x1d2,1d4 Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6',
  'Lion': 'AC=11 Dam=2x1d4,1d6 Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10',
  'Owl': 'AC=11 Dam=2x1d4+1d4 Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6',
  'Pony': 'AC=12 Dam=2x1d3 Str=13 Dex=13 Con=12 Int=2 Wis=11 Cha=4',
  'Shark': 'AC=14 Dam=1d4 Str=13 Dex=13 Con=12 Int=2 Wis=11 Cha=4',
  'Small Viper': 'AC=12 Dam=1d3 Str=8 Dex=17 Con=11 Int=1 Wis=12 Cha=2',
  'Tiger': 'AC=11 Dam=2x1d4,1d6 Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10',
  'Velociraptor': 'AC=11 Dam=2x1d6,1d4 Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14',
  'Wolf': 'AC=12 Dam=1d6 Str=13 Dex=15 Con=15 Int=2 Wis=12 Cha=6'
};
Pathfinder.BLOODLINES = [
  'Aberrant', 'Abyssal', 'Arcane', 'Celestial', 'Destined', 'Draconic',
  'Elemental', 'Fey', 'Infernal', 'Undead'
];
Pathfinder.DEITIES = [
  'None::',
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
Pathfinder.DOMAINS_ADDED = [
  'Artifice', 'Charm', 'Community', 'Darkness', 'Glory', 'Liberation',
  'Madness', 'Nobility', 'Repose', 'Rune', 'Weather'
];
Pathfinder.FACTIONS = [
  'Andoran', 'Cheliax', 'The Concordance', 'Dark Archive', 'The Exchange',
  'Grand Lodge', 'Lantern Lodge', 'Liberty\'s Edge', 'None', 'Osirion',
  'Qadira', 'Sczarni', 'Shadow Lodge', 'Silver Crusade', 'Sovereign Court',
  'Taldor'
];
Pathfinder.FAMILIARS = {
  'Bat': 'HD=1 AC=14 Dam=1d3-5 Str=1 Dex=15 Con=6 Int=2 Wis=14 Cha=5',
  'Cat': 'HD=1 AC=12 Dam=2@1d2-4,1d3-4 Str=3 Dex=15 Con=8 Int=2 Wis=12 Cha=7',
  'Hawk': 'HD=1 AC=12 Dam=2@d4-2 Str=6 Dex=17 Con=11 Int=2 Wis=14 Cha=7',
  'Lizard': 'HD=1 AC=12 Dam=1d4-4 Str=3 Dex=15 Con=8 Int=1 Wis=12 Cha=2',
  'Monkey': 'HD=1 AC=12 Dam=1d3-4 Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5',
  'Owl': 'HD=1 AC=12 Dam=1d4-2 Str=6 Dex=17 Con=11 Int=2 Wis=15 Cha=6',
  'Rat': 'HD=1 AC=12 Dam=1d3-4 Str=2 Dex=15 Con=11 Int=2 Wis=13 Cha=2',
  'Raven': 'HD=1 AC=12 Dam=1d3-4 Str=2 Dex=15 Con=8 Int=2 Wis=15 Cha=7',
  'Toad': 'HD=1 AC=14 Dam=0 Str=1 Dex=12 Con=6 Int=1 Wis=15 Cha=4',
  'Tiny Viper': 'HD=1 AC=13 Dam=1d2-2 Str=4 Dex=17 Con=8 Int=1 Wis=13 Cha=2',
  'Weasel': 'HD=1 AC=13 Dam=1d3-4 Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5',

  'Air Elemental': 'HD=2 AC=14 Dam=1d4+1 Str=12 Dex=17 Con=12 Int=4 Wis=11 Cha=11 Level=5',
  'Dire Rat': 'HD=1 AC=11 Dam=1d4 Str=10 Dex=17 Con=13 Int=2 Wis=13 Cha=4 Level=3',
  'Earth Elemental': 'HD=2 AC=18 Dam=1d6+4 Str=16 Dex=8 Con=13 Int=4 Wis=11 Cha=11 Level=5',
  'Fire Elemental': 'HD=2 AC=15 Dam=1d4 Str=10 Dex=13 Con=10 Int=4 Wis=11 Cha=11 Level=5',
  'Homunculus': 'HD=2 AC=12 Dam=1d4-1 Str=8 Dex=15 Con=0 Int=10 Wis=12 Cha=7 Level=7',
  'Imp': 'HD=3 AC=14 Dam=1d4 Str=10 Dex=17 Con=10 Int=13 Wis=12 Cha=14 Level=7',
  'Mephit': 'HD=3 AC=15 Dam=1d3+1 Str=13 Dex=15 Con=12 Int=6 Wis=11 Cha=14 Level=7',
  'Pseudodragon': 'HD=2 AC=14 Dam=1d3-2,1d2-2 Str=7 Dex=15 Con=13 Int=10 Wis=12 Cha=10 Level=7',
  'Quasit': 'HD=3 AC=14 Dam=1d3-1,1d4-1 Str=8 Dex=14 Con=11 Int=11 Wis=12 Cha=11 Level=7',
  'Stirge': 'HD=1 AC=12 Dam=0 Str=3 Dex=19 Con=10 Int=1 Wis=12 Cha=6 Level=5',
  'Water Elemental': 'HD=2 AC=17 Dam=1d6+3 Str=14 Dex=10 Con=13 Int=4 Wis=11 Cha=11 Level=5',

  'Celestial': 'Level=3',
  'Fiendish': 'Level=3'

};
Pathfinder.FEATS = [
  'Acrobatic:', 'Acrobatic Steps:', 'Agile Maneuvers:Combat', 'Alertness:',
  'Alignment Channel:', 'Animal Affinity:', 'Arcane Armor Mastery:Combat',
  'Arcane Armor Training:Combat', 'Arcane Strike:Combat',
  'Armor Proficiency:Combat', 'Athletic:', 'Augment Summoning:',
  'Bleeding Critical:Combat/Critical', 'Blind-Fight:Combat',
  'Blinding Critical:Combat/Critical', 'Brew Potion:Item Creation',
  'Catch Off-Guard:Combat', 'Channel Smite:Combat',
  'Cleave:Combat', 'Combat Casting:', 'Combat Expertise:Combat',
  'Combat Reflexes:Combat', 'Command Undead:',
  'Craft Magic Arms And Armor:Item Creation', 'Craft Rod:Item Creation',
  'Craft Wand:Item Creation', 'Craft Wondrous Item:Item Creation',
  'Critical Focus:Combat', 'Critical Mastery:Combat',
  'Dazzling Display:Combat', 'Deadly Aim:Combat', 'Deadly Stroke:Combat',
  'Deafening Critical:Combat/Critical', 'Deceitful:',
  'Defensive Combat Training:Combat', 'Deflect Arrows:Combat', 'Deft Hands:',
  'Diehard:', 'Disruptive:Combat', 'Dodge:Combat', 'Double Slice:Combat',
  'Elemental Channel:', 'Empower Spell:Metamagic', 'Endurance:',
  'Enlarge Spell:Metamagic', 'Eschew Materials:',
  'Exhausting Critical:Combat/Critical', 'Extend Spell:Metamagic',
  'Extra Channel:', 'Extra Ki:', 'Extra Lay On Hands:', 'Extra Mercy:',
  'Extra Performance:', 'Extra Rage:', 'Far Shot:Combat', 'Fleet:',
  'Forge Ring:Item Creation', 'Gorgon\'s Fist:Combat', 'Great Cleave:Combat',
  'Great Fortitude:', 'Greater Bull Rush:Combat', 'Greater Disarm:Combat',
  'Greater Feint:Combat', 'Greater Grapple:Combat', 'Greater Overrun:Combat',
  'Greater Penetrating Strike:Combat', 'Greater Shield Focus:Combat',
  'Greater Spell Focus:', 'Greater Spell Penetration:', 'Greater Sunder:Combat',
  'Greater Trip:Combat', 'Greater Two-Weapon Fighting:Combat',
  'Greater Vital Strike:Combat', 'Greater Weapon Focus:Combat',
  'Greater Weapon Specialization:Combat', 'Heighten Spell:Metamagic',
  'Improved Bull Rush:Combat', 'Improved Channel:', 'Improved Counterspell:',
  'Improved Critical:Combat', 'Improved Disarm:Combat', 'Improved Familiar:',
  'Improved Feint:Combat', 'Improved Grapple:Combat',
  'Improved Great Fortitude:', 'Improved Initiative:Combat',
  'Improved Iron Will:', 'Improved Lightning Reflexes:',
  'Improved Overrun:Combat', 'Improved Precise Shot:Combat',
  'Improved Shield Bash:Combat', 'Improved Sunder:Combat',
  'Improved Trip:Combat', 'Improved Two-Weapon Fighting:Combat',
  'Improved Unarmed Strike:Combat', 'Improved Vital Strike:Combat',
  'Improvised Weapon Mastery:Combat', 'Intimidating Prowess:Combat',
  'Iron Will:', 'Leadership:', 'Lightning Reflexes:',
  'Lightning Stance:Combat', 'Lunge:Combat', 'Magical Aptitude:',
  'Manyshot:Combat', 'Master Craftsman:', 'Maximize Spell:Metamagic',
  'Medusa\'s Wrath:Combat', 'Mobility:Combat', 'Mounted Archery:Combat',
  'Mounted Combat:Combat', 'Natural Spell:', 'Nimble Moves:',
  'Penetrating Strike:Combat', 'Persuasive:', 'Pinpoint Targeting:Combat',
  'Point Blank Shot:Combat', 'Power Attack:Combat', 'Precise Shot:Combat',
  'Quick Draw:Combat', 'Quicken Spell:Metamagic', 'Rapid Reload:Combat',
  'Rapid Shot:Combat', 'Ride By Attack:Combat', 'Run:', 'Scorpion Style:Combat',
  'Scribe Scroll:Item Creation', 'Selective Channeling:', 'Self Sufficient:',
  'Shatter Defenses:Combat', 'Shield Focus:Combat', 'Shield Master:Combat',
  'Shield Proficiency:Combat', 'Shield Slam:Combat', 'Shot On The Run:Combat',
  'Sickening Critical:Combat/Critical', 'Silent Spell:Metamagic',
  'Skill Focus:', 'Snatch Arrows:Combat', 'Spell Focus:', 'Spell Mastery:',
  'Spell Penetration:', 'Spellbreaker:Combat', 'Spirited Charge:Combat',
  'Spring Attack:Combat', 'Staggering Critical:Combat/Critical',
  'Stand Still:Combat', 'Stealthy:', 'Step Up:Combat', 'Still Spell:Metamagic',
  'Strike Back:Combat', 'Stunning Critical:Combat/Critical',
  'Stunning Fist:Combat', 'Throw Anything:Combat',
  'Tiring Critical:Combat/Critical', 'Toughness:', 'Trample:Combat',
  'Turn Undead:', 'Two-Weapon Defense:Combat', 'Two-Weapon Fighting:Combat',
  'Two-Weapon Rend:Combat', 'Unseat:Combat', 'Vital Strike:Combat',
  'Weapon Finesse:Combat', 'Weapon Focus:Combat', 'Weapon Proficiency:Combat',
  'Weapon Specialization:Combat', 'Whirlwind Attack:Combat',
  'Widen Spell:Metamagic', 'Wind Stance:Combat'
];
Pathfinder.LANGUAGES_ADDED = ['Aklo'];
Pathfinder.SKILLS = [
  'Acrobatics:dex', 'Appraise:int', 'Bluff:cha', 'Climb:str', 'Craft:int',
  'Diplomacy:cha', 'Disable Device:dex/trained', 'Disguise:cha',
  'Escape Artist:dex', 'Fly:dex', 'Handle Animal:cha/trained',
  'Heal:wis', 'Intimidate:cha', 'Knowledge:int/trained',
  'Linguistics:int/trained', 'Perception:wis', 'Perform:cha',
  'Profession:wis/trained', 'Ride:dex', 'Sense Motive:wis',
  'Sleight Of Hand:dex/trained', 'Spellcraft:int/trained', 'Stealth:dex',
  'Survival:wis', 'Swim:str', 'Use Magic Device:cha/trained'
];
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
Pathfinder.SUBFEATS = {
  'Alignment Channel':'Chaos/Evil/Good/Law',
  'Armor Proficiency':'Heavy/Light/Medium',
  'Elemental Channel':'Air/Earth/Fire/Water',
  'Greater Spell Focus':SRD35.SCHOOLS.join('/').replace(/:[^\/]+/g, ''),
  'Greater Weapon Focus':'',
  'Greater Weapon Specialization':'',
  'Improved Critical':'',
  'Master Craftsman':'',
  'Rapid Reload':'Hand/Heavy/Light',
  'Shield Proficiency':'Heavy/Tower',
  'Skill Focus':'',
  'Spell Focus':SRD35.SCHOOLS.join('/').replace(/:[^\/]+/g, ''),
  'Weapon Focus':'',
  'Weapon Proficiency':'Simple',
  'Weapon Specialization':'Dwarven Waraxe/Longsword'
};
Pathfinder.SUBSKILLS = {
  'Craft':'',
  'Knowledge':'Arcana/Dungeoneering/Engineering/Geography/' +
              'History/Local/Nature/Nobility/Planes/Religion',
  'Perform':'Act/Comedy/Dance/Keyboard/Oratory/Percussion/Sing/String/Wind',
  'Profession':''
};
Pathfinder.TRAITS = [
  // Advanced Player's Guide
  'Anatomist:Combat', 'Armor Expert:Combat', 'Bullied:Combat',
  'Courageous:Combat', 'Deft Dodger:Combat', 'Dirty Fighter:Combat',
  'Fencer:Combat', 'Killer:Combat', 'Reactionary:Combat',
  'Resilient:Combat',
  'Birthmark:Faith', 'Caretaker:Faith', 'Child Of The Temple:Faith',
  'Devotee Of The Green:Faith', 'Ease Of Faith:Faith',
  'History Of Heresy:Faith', 'Indomitable Faith:Faith', 'Sacred Conduit:Faith',
  'Sacred Touch:Faith', 'Scholar Of The Great Beyond:Faith',
  'Classically Schooled:Magic', 'Dangerously Curious:Magic',
  'Focused Mind:Magic', 'Gifted Adept:Magic', 'Hedge Magician:Magic',
  'Magical Knack:Magic', 'Magical Lineage:Magic', 'Magical Talent:Magic',
  'Mathematical Prodigy:Magic', 'Skeptic:Magic',
  'Adopted:Social', 'Bully:Social', 'Canter:Social', 'Charming:Social',
  'Child Of The Streets:Social', 'Fast-Talker:Social',
  'Natural-Born Leader:Social', 'Poverty-Stricken:Social',
  'Rich Parents:Social', 'Suspicious:Social',
  'Apothecary:Black Sheep', 'Bitter Nobleman:Black Sheep', 'Exile:Outlander',
  'Lore Seeker:Outlander', 'Missionary:Outlander', 'Sherrif:Favored Child',
  'Tavern Owner:Favored Child',
  'Animal Friend:Gnome', 'Brute:Half-Orc', 'Elven Reflexes:Half-Elf',
  'Failed Apprentice:Half-Elf', 'Forlorn:Elf',
  'Freedom Fighter:Halfling', 'Goldsniffer:Dwarf', 'Outcast:Half-Orc',
  'Rapscallion:Gnome', 'Scholar Of Ruins:Human', 'Tunnel Fighter:Dwarf',
  'Warrior Of Old:Elf', 'Well-Informed:Halfling', 'World Traveler:Human',
  'Desert Child:Regional', 'Highlander:Regional', 'Log Roller:Regional',
  'Militia Veteran:Regional', 'River Rat:Regional', 'Savanna Child:Regional',
  'Vagabond Child:Regional',
  'Child Of Nature:N', 'Demon Hunter:LE', 'Divine Courtesan:CN',
  'Divine Warrior:LG', 'Ear For Music:NG', 'Eyes And Ears Of The City:LG',
  'Flame Of The Dawnflower:NG', 'Fortified Drinker:CG',
  'Guardian Of The Forge:LG', 'Magic Is Life:N', 'Patient Optimist:LG',
  'Starchild:CG', 'Undead Slayer:N', 'Veteran Of Battle:CN',
  'Wisdom In The Flesh:LN',
  // Faction Traits - PS Roleplaying Guild Guide (v10.0)
  'Balanced Offensive:The Concordance', 'Beastspeaker:The Concordance',
  'Natural Negotiator:The Concordance', 'Planar Voyager:The Concordance',
  'Scholar Of Balance:The Concordance',
  'Arcane Archivist:Dark Archive', 'Devil\'s Mark:Dark Archive',
  'Librarian:Dark Archive', 'Master Of Pentacles:Dark Archive',
  'Soul Drinker:Dark Archive',
  'Gold Finger:The Exchange', 'Greasy Palm:The Exchange',
  'Smuggler:The Exchange', 'Tireless:The Exchange', 'Upstanding:The Exchange',
  'Insider Knowledge:Grand Lodge', 'Loyalty:Grand Lodge',
  'Obervant:Grand Lodge', 'Proper Training:Grand Lodge',
  'Teaching Mistake:Grand Lodge',
  'Captain\'s Blade:Liberty\'s Edge', 'Faction Freedom Fighter:Liberty\'s Edge',
  'Indomitable:Liberty\'s Edge', 'Rousing Oratory:Liberty\'s Edge',
  'Whistleblower:Liberty\'s Edge',
  'A Sure Thing:Silver Crusade', 'Beneficient Touch:Silver Crusade',
  'Comparative Religion:Silver Crusade', 'Force For Good:Silver Crusade',
  'Unorthodox Strategy:Silver Crusade',
  'Expert Duelist:Sovereign Court', 'Fashionable:Sovereign Court',
  'Impressive Presence:Sovereign Court', 'Influential:Taldor',
  'Unflappable:Taldor',
  // Faction Traits from prior Guide versions
  'Explorer:Andoran', 'Hunter\'s Eye:Andoran',
  'Fiendish Presence:Cheliax', 'Fires Of Hell:Cheliax',
  'Meridian Strike:Lantern Lodge', 'Meticulous Artisan:Lantern Lodge',
  'Mind Over Matter:Lantern Lodge', 'Storyteller:Lantern Lodge',
  'Weapon Style:Lantern Lodge',
  'Dunewalker:Osiron', 'Mummy-Touched:Osirion',
  'Dervish:Qadira', 'Desert Shadow:Qadira', 'Eastern Mysteries:Qadira',
  'Horse Lord:Qadira',
  'Ancient Historian:Scarab Sages', 'Attuned To The Ancestors:Scarab Sages',
  'Reverent Wielder:Scarab Sages', 'Secrets Of The Sphinx:Scarab Sages',
  'Tomb Raider:Scarab Sages',
  'Aid Allies:Shadow Lodge', 'Fortified:Shadow Lodge', 'Medic:Shadow Lodge',
  'Shadow Diplomat:Shadow Lodge', 'Watchdog:Shadow Lodge',
  'Bad Reputation:Sczarni', 'I Know A Guy:Sczarni', 'Shiv:Sczarni',
  'Trouper:Sczarni',
  'Performance Artist:Taldor', 'Vindictive:Taldor'
];
Pathfinder.WEAPONS_ADDED = [
  'Blowgun:d2r20',
  'Elven Curve Blade:d10@18',
  'Halfling Sling Staff:d8x3r80',
  // removed range 'Sai:d4',
  'Starknife:d4x3r20'
];

// Related information used internally by Pathfinder
Pathfinder.armorsArmorClassBonuses = {
  'None': null, 'Padded': 1, 'Leather': 2, 'Studded Leather': 3,
  'Chain Shirt': 4, 'Hide': 4, 'Scale Mail': 5, 'Chainmail': 6,
  'Breastplate': 6, 'Splint Mail': 7, 'Banded Mail': 7, 'Half Plate': 8,
  'Full Plate': 9
};
Pathfinder.spellsSchools = Object.assign({}, SRD35.spellsSchools, {
  'Beast Shape I':'Transmutation',
  'Beast Shape II':'Transmutation',
  'Beast Shape III':'Transmutation',
  'Beast Shape IV':'Transmutation',
  'Bleed':'Necromancy',
  'Breath Of Life':'Conjuration',
  'Elemental Body I':'Transmutation',
  'Elemental Body II':'Transmutation',
  'Elemental Body III':'Transmutation',
  'Elemental Body IV':'Transmutation',
  'Form Of The Dragon I':'Transmutation',
  'Form Of The Dragon II':'Transmutation',
  'Form Of The Dragon III':'Transmutation',
  'Giant Form I':'Transmutation',
  'Giant Form II':'Transmutation',
  'Greater Polymorph':'Transmutation',
  'Plant Shape I':'Transmutation',
  'Plant Shape II':'Transmutation',
  'Plant Shape III':'Transmutation',
  'Stabilize':'Conjuration'
});
delete Pathfinder.spellsSchools['Cure Minor Wounds'];
delete Pathfinder.spellsSchools['Inflict Minor Wounds'];

/* Defines the rules related to character abilities. */
Pathfinder.abilityRules = function(rules) {
  SRD35.abilityRules(rules);
  // Override intelligence skillPoint adjustment
  rules.defineRule
    ('skillNotes.intelligenceSkillPointsAdjustment', 'level', '*', null);
}

/* Defines the rules related to character classes. */
Pathfinder.classRules = function(rules, classes, bloodlines) {

  // Level-dependent attributes
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');
  rules.defineRule('skillPoints',
    '', '=', '0',
    'level', '^', null
  );
  rules.defineNote
    ('validationNotes.levelAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.levelAllocation.1',
    '', '=', '0',
    'level', '=', null
  );
  rules.defineRule('validationNotes.levelAllocation.2',
    '', '=', '0',
    /^levels\./, '+=', null
  );
  rules.defineRule('validationNotes.levelAllocation',
    'validationNotes.levelAllocation.1', '=', '-source',
    'validationNotes.levelAllocation.2', '+=', null
  );

  rules.defineRule
    ('hitPoints', 'combatNotes.favoredClassHitPoints', '+=', null);
  rules.defineRule
    ('skillPoints', 'skillNotes.favoredClassSkillPoints', '+=', null);

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];
    var klassNoSpace =
      klass.substring(0,1).toLowerCase() + klass.substring(1).replace(/ /g, '');

    if(klass == 'Barbarian') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
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
        'combatNotes.greaterRageFeature:+6 strength/constitution, +3 Will',
        'combatNotes.guardedStanceFeature:+%V AC during rage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.knockbackFeature:' +
          'Successful Bull Rush during rage for %V damage',
        'combatNotes.mightyRageFeature:+8 strength/constitution, +4 Will',
        'combatNotes.mightySwingFeature:Automatic critical 1/rage',
        'combatNotes.momentOfClarityFeature:Rage effects suspended for 1 round',
        'combatNotes.noEscapeFeature:x2 speed 1/rage when foe withdraws',
        'combatNotes.powerfulBlowFeature:+%V damage 1/rage',
        'combatNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC for %V rounds/day',
        'combatNotes.quickReflexesFeature:+1 AOO/round during rage',
        'combatNotes.rollingDodgeFeature:' +
          '+%V AC vs. ranged for %1 rounds during rage',
        'combatNotes.rousedAngerFeature:Rage even if fatigued',
        'combatNotes.strengthSurgeFeature:' +
          '+%V strength/combat maneuver check 1/rage',
        'combatNotes.surpriseAccuracyFeature:+%V attack 1/rage',
        'combatNotes.terrifyingHowlFeature:' +
           'Howl for DC %V will save w/in 30 ft or shaken for d4+1 rounds',
        'combatNotes.tirelessRageFeature:Not fatigued after rage',
        'combatNotes.uncannyDodgeFeature:' +
          'Never flat-footed, adds dexterity modifier to AC vs. invisible foe',
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
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Animal Fury', 'Clear Mind', 'Fearless Rage', 'Guarded Stance',
        'Increased Damage Reduction', 'Internal Fortitude',
        'Intimidating Glare', 'Knockback', 'Low-Light Vision', 'Mighty Swing',
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
        'constitutionModifier', '=', '4 + source',
        'levels.Barbarian', '+', '(source - 1) * 2'
      );
      rules.defineRule('combatNotes.rollingDodgeFeature',
        'levels.Barbarian', '=', '1 + Math.floor(source / 6)'
      );
      rules.defineRule('combatNotes.rollingDodgeFeature.1',
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
      rules.defineRule('damageReduction.All',
        'levels.Barbarian', '+=', 'source>=7 ? Math.floor((source-4)/3) : null',
        'features.Increased Damage Reduction', '+', null
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

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Bardic Knowledge', '1:Bardic Performance', '1:Countersong',
        '1:Distraction', '1:Fascinate', '1:Inspire Courage',
        '1:Simple Somatics',
        '1:Weapon Proficiency (Longsword/Rapier/Sap/Short Sword/Showbow/Whip)',
        '2:Versatile Performance', '2:Well-Versed',
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
        'magicNotes.simpleSomaticsFeature:Reduce armor casting penalty by %V%',
        'magicNotes.soothingPerformanceFeature:' +
           '30 ft range <i>Mass Cure Serious Wounds</i> via performance',
        'magicNotes.suggestionFeature:' +
          '<i>Suggestion</i> to 1 fascinated creature',
        'saveNotes.well-VersedFeature:+4 vs. bardic effects',
        'skillNotes.bardicKnowledgeFeature:' +
          '+%V all Knowledge, use any Knowledge untrained',
        'skillNotes.jackOfAllTradesFeature:Use any skill untrained',
        'skillNotes.loreMasterFeature:' +
          'Take 10 on any ranked Knowledge skill, take 20 %V/day',
        'skillNotes.versatilePerformanceFeature:' +
          'Substitute Perform ranking for associated skills'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
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
        'levels.Bard', '+=', '2 + 2 * source',
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
      rules.defineRule('magicNotes.simpleSomaticsFeature',
        'armor', '+=', 'source.match(/Padded|Leather|Chain Shirt/) ? ' +
        'SRD35.armorsArcaneSpellFailurePercentages[source] : null',
        'shield', '+=', 'SRD35.shieldsArcaneSpellFailurePercentages[source]'
      );
      rules.defineRule('magicNotes.arcaneSpellFailure',
        'magicNotes.simpleSomaticsFeature', '+', '-source'
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

    } else if(klass == 'Cleric') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = ['1:Aura', '1:Channel Energy', '1:Cleric Spontaneous Casting'];
      hitDie = 8;
      notes = [
        'magicNotes.auraFeature:' +
          'Visible to <i>Detect Chaos/Evil/Good/Law</i> depending on ' +
          'deity\'s alignment',
        'magicNotes.channelEnergyFeature:' +
          'Heal/inflict %Vd6 damage 30 ft radius, DC %1 Will for half %2/day',
        'magicNotes.clericSpontaneousCastingFeature:' +
          'Cast <i>Heal</i>/<i>Inflict</i> spell in place of known spell'
      ];
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
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

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Druid Spontaneous Casting', '1:Nature Sense', '1:Wild Empathy',
        '1:Weapon Proficiency (Club/Dagger/Dart/Quarterstaff/Scimitar/Scythe/Sickle/Shortspear/Sling/Spear)',
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
        'skillNotes.wildEmpathyFeature:+%V Diplomacy w/animals',
        'validationNotes.druidClassAlignment:Requires Alignment =~ Neutral',
        'validationNotes.druidClassArmor:' +
          'Requires Armor =~ None|Hide|Leather|Padded',
        'validationNotes.druidClassShield:Requires Shield =~ None|Wooden'
      ];
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
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
      rules.defineRule('domainCount', 'features.Nature Domains', '+=', '1');
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
      rules.defineRule
        ('selectableFeatureCount.Druid', 'levels.Druid', '=', '1');
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Druid', '+=', null,
        'charismaModifier', '+', null
      );

      rules.defineRule('animalCompanionDruidLevel',
        'druidFeatures.Animal Companion', '?', null,
        'levels.Druid', '=', null
      );
      rules.defineRule
        ('animalCompanionMasterLevel', 'animalCompanionDruidLevel', '+=', null);

    } else if(klass == 'Fighter') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '2:Bravery', '3:Armor Training', '5:Weapon Training',
        '19:Armor Mastery', '20:Weapon Mastery'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.armorMasteryFeature:DR 5/- when using armor/shield',
        'combatNotes.armorTrainingFeature:Additional +%V Dex AC bonus',
        'combatNotes.weaponMasteryFeature:' +
          'Critical automatically hits, +1 damage multiplier, no disarm ' +
          'w/chosen weapon',
        'combatNotes.weaponTrainingFeature:' +
          'Attack/damage bonus w/weapons from trained groups',
        'saveNotes.braveryFeature:+%V vs. fear',
        'skillNotes.armorTrainingFeature:Reduce armor skill check penalty by %V'
      ];
      profArmor = SRD35.PROFICIENCY_HEAVY;
      profShield = SRD35.PROFICIENCY_TOWER;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_POOR;
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
        ('armorClass', 'combatNotes.armorTrainingFeature', '+', null);
      rules.defineRule('combatNotes.armorTrainingFeature',
        'dexterityModifier', '=', null,
        'armor', '-', 'SRD35.armorsMaxDexBonuses[source]',
        'levels.Fighter', 'v', 'Math.floor((source + 1) / 4)',
        '', '^', '0'
      );
      rules.defineRule
        ('damageReduction.All', 'combatNotes.armorMasteryFeature', '+=', '5');
      rules.defineRule('featCount.Combat',
        'levels.Fighter', '=', '1 + Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.braveryFeature',
        'levels.Fighter', '=', 'Math.floor((source + 2) / 4)'
      );
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'skillNotes.armorTrainingFeature', '+', '-source'
      );
      rules.defineRule('skillNotes.armorTrainingFeature',
        'levels.Fighter', '=', 'Math.floor((source + 1) / 4)'
      );

    } else if(klass == 'Monk') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = [
        'Catch Off-Guard', 'Combat Reflexes', 'Deflect Arrows', 'Dodge',
        'Improved Grapple', 'Scorpion Style', 'Throw Anything',
        'Gorgon\'s Fist', 'Improved Bull Rush', 'Improved Disarm',
        'Improved Feint', 'Improved Trip', 'Mobility', 'Improved Critical',
        'Medusa\'s Wrath', 'Snatch Arrows', 'Spring Attack'
      ];
      features = [
        '1:Flurry Of Blows', '1:Improved Unarmed Strike',
        '1:Two-Weapon Fighting', '1:Stunning Fist',
        '1:Weapon Proficiency (Club/Dagger/Handaxe/Heavy Crossbow/Javelin/Kama/Light Crossbow/Nunchaku/Quarterstaff/Sai/Shortspear/Short Sword/Shuriken/Siangham/Sling/Spear)',
        '2:Evasion', '3:Fast Movement', '3:Maneuver Training', '3:Still Mind',
        '4:Ki Dodge', '4:Ki Pool', '4:Ki Speed', '4:Ki Strike', '4:Slow Fall',
        '5:High Jump', '5:Purity Of Body', '7:Wholeness Of Body',
        '8:Condition Fist', '8:Improved Two-Weapon Fighting',
        '9:Improved Evasion', '11:Diamond Body', '12:Abundant Step',
        '13:Diamond Soul', '15:Greater Two-Weapon Fighting',
        '15:Quivering Palm', '17:Timeless Body',
        '17:Tongue Of The Sun And Moon', '19:Empty Body', '20:Perfect Self'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'abilityNotes.kiSpeedFeature:Use 1 ki for +20',
        'combatNotes.conditionFist:Stunning Fist may instead make target %V',
        'combatNotes.flurryOfBlowsFeature:' +
          'Full-round %V +%1 monk weapon attacks, use 1 ki for one more',
        'combatNotes.greaterTwo-WeaponFightingFeature:' +
          'Third off-hand -10 attack',
        'combatNotes.improvedTwo-WeaponFightingFeature:' +
          'Second off-hand -5 attack',
        'combatNotes.improvedUnarmedStrikeFeature:' +
          'No AOO on unarmed attack, may deal lethal damage',
        'combatNotes.kiDodgeFeature:Use 1 ki for +4 AC',
        'featureNotes.kiPoolFeature:%V points refills w/8 hours rest',
        'combatNotes.kiStrikeFeature:Unarmed attack is %V',
        'combatNotes.maneuverTrainingFeature:+%V CMB',
        'combatNotes.monkArmorClassAdjustment:+%V AC/CMD',
        'combatNotes.perfectSelfFeature:DR 10/chaotic',
        'combatNotes.quiveringPalmFeature:' +
          'Foe makes DC %V Fortitude save or dies 1/day',
        'combatNotes.stunningFistFeature:' +
          'Foe DC %V Fortitude save or stunned %1/day',
        'combatNotes.twoWeaponFightingFeature:Take -2 penalty for extra attack',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tongueOfTheSunAndMoonFeature:Speak w/any living creature',
        'magicNotes.abundantStepFeature:' +
          'Use 1 ki to <i>Dimension Door</i> at level %V',
        'magicNotes.emptyBodyFeature:Use 1 ki for 1 minute <i>Etherealness</i>',
        'magicNotes.wholenessOfBodyFeature:Use 2 ki to heal %V damage to self',
        'sanityNotes.monkClassArmor:Implies Armor == None',
        'sanityNotes.monkClassShield:Implies Shield == None',
        'saveNotes.diamondBodyFeature:Immune to poison',
        'saveNotes.diamondSoulFeature:DC %V spell resistance',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of half',
        'saveNotes.improvedEvasionFeature:Failed save yields half damage',
        'saveNotes.perfectSelfFeature:Treat as outsider for magic saves',
        'saveNotes.purityOfBodyFeature:Immune to all disease',
        'saveNotes.slowFallFeature:' +
          'Subtract %V ft from falling damage distance',
        'saveNotes.stillMindFeature:+2 vs. enchantment',
        'skillNotes.highJumpFeature:+%V Acrobatics (Jump), use 1 ki for +20',
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
        'validationNotes.monkClassAlignment:Requires Alignment =~ Lawful'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_GOOD;
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
      rules.defineRule
        ('armorClass', 'combatNotes.monkArmorClassAdjustment', '+', null);
      rules.defineRule('combatManeuverDefense',
        'combatNotes.monkArmorClassAdjustment', '+', null
      );
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
      rules.defineRule('combatManeuverBonus',
        'combatNotes.maneuverTrainingFeature', '+', null
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
      // Supress validation checking for monk feats
      for(var j = 0; j < feats.length; j++) {
        var featNoSpace =
          feats[j].substring(0,1).toLowerCase() + feats[j].substring(1).replace(/ /g, '');
        rules.defineRule('validationNotes.' + featNoSpace + 'FeatAbility',
          'levels.Monk', '^', '0'
        );
        rules.defineRule('validationNotes.' + featNoSpace + 'FeatBaseAttack',
          'levels.Monk', '^', '0'
        );
        rules.defineRule('validationNotes.' + featNoSpace + 'FeatFeatures',
          'levels.Monk', '^', '0'
        );
      }

    } else if(klass == 'Paladin') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Aura Of Good', '1:Detect Evil', '1:Smite Evil', '2:Divine Grace',
        '2:Lay On Hands', '3:Aura Of Courage', '3:Divine Health', '3:Mercy',
        '4:Channel Energy', '8:Aura Of Resolve', '11:Aura Of Justice',
        '14:Aura Of Faith', '17:Aura Of Righteousness', '17:Resist Evil',
        '20:Holy Champion'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.auraOfJusticeFeature:' +
          'Grant Smite Evil to allies w/in 10 ft',
        'combatNotes.auraOfRighteousnessFeature:DR %V/evil',
        'combatNotes.divineWeaponFeature:' +
          'Add %V enhancements to weapon for %1 minutes %2/day',
        'combatNotes.smiteEvilFeature:' +
          '+%V attack/+%1 damage/+%2 AC vs. evil foe %3/day',
        'featureNotes.divineMountFeature:Magically summon mount %V/day',
        'magicNotes.auraOfGoodFeature:Visible to <i>Detect Good</i>',
        'magicNotes.channelEnergyFeature:' +
          'Heal/inflict %Vd6 damage 30 ft radius, DC %1 Will for half %2/day',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.holyChampionFeature:' +
          'Maximize lay on hands, smite evil DC %V <i>Banishment</i>',
        'magicNotes.layOnHandsFeature:Harm undead or heal %Vd6 HP %1/day',
        'magicNotes.mercyFeature:Lay on hands removes additional effects',
        'saveNotes.auraOfCourageFeature:Immune fear, +4 to allies w/in 30 ft',
        'saveNotes.auraOfResolveFeature:Immune charm, +4 to allies w/in 30 ft',
        'saveNotes.auraOfRighteousnessFeature:' +
          'Immune compulsion, +4 to allies w/in 30 ft',
        'saveNotes.divineGraceFeature:+%V all saves',
        'saveNotes.divineHealthFeature:Immune to disease',
        'validationNotes.paladinClassAlignment:' +
          'Requires Alignment == Lawful Good'
      ];
      profArmor = SRD35.PROFICIENCY_HEAVY;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = ['Divine Mount', 'Divine Weapon'];
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

      rules.defineRule('animalCompanionPaladinLevel',
        'paladinFeatures.Divine Mount', '?', null,
        'levels.Paladin', '=', 'source >= 5 ? source : null'
      );
      rules.defineRule('animalCompanionMasterLevel',
        'animalCompanionPaladinLevel', '+=', null
      );
      rules.defineRule('featureNotes.divineMountFeature',
        'animalCompanionPaladinLevel', '=',
        'source < 5 ? null : Math.floor((source - 1) / 4)'
      );
      rules.defineRule('animalCompanion.Celestial',
        'animalCompanionPaladinLevel', '^=', 'source < 11 ? null : 1'
      );
      rules.defineRule('animalCompanionNotes.SR',
        'animalCompanionPaladinLevel', '^=', 'source >= 15 ? source + 11 : null'
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

    } else if(klass == 'Ranger') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Favored Enemy', '1:Track', '1:Wild Empathy', '3:Endurance',
        '3:Favored Terrain', '7:Woodland Stride', '8:Swift Tracker',
        '9:Evasion', '11:Quarry', '12:Camouflage', '16:Improved Evasion',
        '17:Hide In Plain Sight', '19:Improved Quarry', '20:Master Hunter'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.favoredEnemyFeature:' +
          '+2 or more attack/damage vs. %V type(s) of creatures',
        'combatNotes.favoredTerrainFeature:+2 initiative in %V terrain type(s)',
        'combatNotes.companionBondFeature:' +
          'Half favored enemy bonus to allies w/in 30 ft for %V rounds',
        'combatNotes.masterHunterFeature:' +
          'Full attack vs. favored enemy requires DC %V Fortitude save or die',
        'combatNotes.quarryFeature:+%V attack/automatic critical vs. target',
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'saveNotes.enduranceFeature:+4 extended physical action',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of half',
        'saveNotes.improvedEvasionFeature:Failed save yields half damage',
        'skillNotes.camouflageFeature:Hide in favored terrain',
        'skillNotes.favoredEnemyFeature:' +
          '+2 or more Bluff/Knowledge/Perception/Sense Motive/Survival ' +
          'vs. %V type(s) of creatures',
        'skillNotes.favoredTerrainFeature:' +
          '+2 Knowledge (Geography)/Perception/Stealth/Survival/leaves no ' +
          'trail in %V terrain type(s)',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.quarryFeature:Take %V to track target',
        'skillNotes.swiftTrackerFeature:Track at full speed',
        'skillNotes.trackFeature:+%V Survival to follow creatures\' trail',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy w/animals',
        'validationNotes.greaterTwo-WeaponFightingSelectableFeatureFeatures:' +
           'Requires Combat Style (Two-Weapon Combat)',
        'validationNotes.greaterTwo-WeaponFightingSelectableFeatureLevels:' +
           'Requires Ranger >= 10',
        'validationNotes.improvedPreciseShotSelectableFeatureFeatures:' +
           'Requires Combat Style (Archery)',
        'validationNotes.improvedPreciseShotSelectableFeatureLevels:' +
           'Requires Ranger >= 6',
        'validationNotes.improvedTwo-WeaponFightingSelectableFeatureFeatures:' +
           'Requires Combat Style (Two-Weapon Combat)',
        'validationNotes.improvedTwo-WeaponFightingSelectableFeatureLevels:' +
           'Requires Ranger >= 6',
        'validationNotes.manyshotSelectableFeatureFeatures:' +
           'Requires Combat Style (Archery)',
        'validationNotes.manyshotSelectableFeatureLevels:' +
           'Requires Ranger >= 6',
        'validationNotes.pinpointTargetingSelectableFeatureFeatures:' +
           'Requires Combat Style (Archery)',
        'validationNotes.pinpointTargetingSelectableFeatureLevels:' +
           'Requires Ranger >= 10',
        'validationNotes.shotOnTheRunSelectableFeatureFeatures:' +
           'Requires Combat Style (Archery)',
        'validationNotes.shotOnTheRunSelectableFeatureLevels:' +
           'Requires Ranger >= 10',
        'validationNotes.twoWeaponDefenseSelectableFeatureFeatures:' +
           'Requires Combat Style (Two-Weapon Combat)',
        'validationNotes.twoWeaponDefenseSelectableFeatureLevels:' +
           'Requires Ranger >= 6',
        'validationNotes.twoWeaponRendSelectableFeatureFeatures:' +
           'Requires Combat Style (Two-Weapon Combat)',
        'validationNotes.twoWeaponRendSelectableFeatureLevels:' +
           'Requires Ranger >= 10'
      ];
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Animal Companion', 'Combat Style (Archery)',
        'Combat Style (Two-Weapon Combat)', 'Companion Bond', 'Far Shot',
        'Point Blank Shot', 'Precise Shot', 'Rapid Shot',
        'Improved Precise Shot', 'Manyshot', 'Pinpoint Targeting',
        'Shot On The Run', 'Double Slice', 'Improved Shield Bash',
        'Quick Draw', 'Two-Weapon Fighting', 'Improved Two-Weapon Fighting',
        'Two-Weapon Defense', 'Greater Two-Weapon Fighting', 'Two-Weapon Rend'
      ];
      skillPoints = 6;
      skills = [
        'Climb', 'Craft', 'Handle Animal', 'Heal', 'Intimidate',
        'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
        'Knowledge (Nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft',
        'Stealth', 'Survival', 'Swim'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'R1:4:"all"', 'R2:7:"all"', 'R3:10:"all"', 'R4:13:"all"'
      ];
      spellsPerDay = [
        'R1:4:0/5:1/9:2/13:3/17:4',
        'R2:7:0/8:1/12:2/16:3/20:4',
        'R3:10:0/11:1/15:2/19:3',
        'R4:13:0/14:1/18:2/20:3'
      ];
      rules.defineRule('casterLevelDivine',
        'levels.Ranger', '+=', 'source >= 4 ? Math.floor(source / 2) : null'
      );
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
        'source >= 2 ? Math.floor((source+6) / 4) + (source>=4 ? 1 : 0) : null'
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

      rules.defineRule('animalCompanionRangerLevel',
        'rangerFeatures.Animal Companion', '?', null,
        'levels.Ranger', '+=', 'source >= 4 ? source - 3 : null'
      );
      rules.defineRule('animalCompanionMasterLevel',
        'animalCompanionRangerLevel', '+=', null
      );

    } else if(klass == 'Rogue') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Sneak Attack', '1:Trapfinding',
        '1:Weapon Proficiency (Hand Crossbow/Rapier/Sap/Shortbow/Short Sword)',
        '2:Evasion', '3:Trap Sense',
        '4:Uncanny Dodge', '8:Improved Uncanny Dodge', '20:Master Strike'
      ];
      notes = [
        'abilityNotes.rogueCrawlFeature:Crawl at half speed',
        'combatNotes.bleedingAttackFeature:' +
          'Sneak attack causes extra %V hp/round until healed',
        'combatNotes.cripplingStrikeFeature: ' +
          '2 points strength damage from sneak attack',
        'combatNotes.defensiveRollFeature:' +
          'DC damage Reflex save vs. lethal blow for half damage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.masterStrikeFeature:' +
          'Sneak attack target DC %V Fortitude or sleep/paralyze/die',
        'combatNotes.opportunistFeature:AOO vs. foe struck by ally',
        'combatNotes.resiliencyFeature:' +
          '1 minute of %V temporary hit points when below 0 hit points 1/day',
        'combatNotes.slowReactionsFeature:' +
          'Sneak attack target no AOO for 1 round',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.standUpFeature:Stand from prone as free action',
        'combatNotes.surpriseAttackFeature:' +
          'All foes flat-footed during surprise round',
        'combatNotes.uncannyDodgeFeature:' +
          'Never flat-footed, adds dexterity modifier to AC vs. invisible foe',
        'featNotes.rogueWeaponTrainingFeature:Add Weapon Focus feat',
        'magicNotes.dispellingAttackFeature:' +
          'Sneak attack acts as <i>Dispel Magic</i> on target',
        'magicNotes.majorMagicFeature:Cast W1 spell 2/day',
        'magicNotes.minorMagicFeature:Cast W0 spell 3/day',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of half',
        'saveNotes.improvedEvasionFeature:Failed save yields half damage',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
        'skillNotes.fastStealthFeature:Use Stealth at full speed',
        'skillNotes.ledgeWalkerFeature:' +
          'Use Acrobatics along narrow surfaces at full speed',
        'skillNotes.quickDisableFeature:Disable Device in half normal time',
        'skillNotes.trapSpotterFeature:' +
          'Automatic Perception check w/in 10 ft of trap',
        'skillNotes.skillMasteryFeature:' +
          'Take 10 despite distraction on %V designated skills',
        'skillNotes.trapfindingFeature:+%V Perception/Disable Device w/traps',
        'validationNotes.cripplingStrikeSelectableFeatureLevels:' +
           'Requires Rogue >= 10',
        'validationNotes.defensiveRollSelectableFeatureLevels:' +
           'Requires Rogue >= 10',
        'validationNotes.dispellingAttackSelectableFeatureLevels:' +
           'Requires Rogue >= 10',
        'validationNotes.improvedEvasionSelectableFeatureLevels:' +
           'Requires Rogue >= 10',
        'validationNotes.majorMagicSelectableFeatureFeatures:' +
           'Requires Minor Magic',
        'validationNotes.opportunistSelectableFeatureLevels:' +
           'Requires Rogue >= 10',
        'validationNotes.rogueWeaponTrainingFeatureFeat:Requires Weapon Focus',
        'validationNotes.skillMasterySelectableFeatureLevels:' +
           'Requires Rogue >= 10',
        'validationNotes.slipperyMindSelectableFeatureLevels:' +
           'Requires Rogue >= 10'
      ];
      hitDie = 8;
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      skillPoints = 8;
      skills = [
        'Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy',
        'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate',
        'Knowledge (Dungeoneering)', 'Knowledge (Local)', 'Linguistics',
        'Perception', 'Perform', 'Profession', 'Sense Motive',
        'Sleight Of Hand', 'Stealth', 'Swim', 'Use Magic Device'
      ];
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Bleeding Attack', 'Combat Trick', 'Fast Stealth', 'Finesse Rogue',
        'Ledge Walker', 'Major Magic', 'Minor Magic', 'Quick Disable',
        'Resiliency', 'Rogue Crawl', 'Slow Reactions', 'Stand Up',
        'Surprise Attack', 'Trap Spotter', 'Rogue Weapon Training',
        'Crippling Strike', 'Defensive Roll', 'Dispelling Attack',
        'Feat Bonus', 'Improved Evasion', 'Opportunist', 'Skill Mastery',
        'Slippery Mind'
      ];
      spellAbility = 'intelligence';
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('casterLevels.Rogue',
        'magicNotes.minorMagicFeature', '?', null,
        'levels.Rogue', '=', null
      );
      rules.defineRule('casterLevels.W', 'casterLevels.Rogue', '=', null);
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
      rules.defineRule('featCount.Combat',
        'features.Combat Trick', '+=', '1',
        'features.Rogue Weapon Training', '+=', '1'
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
        /feats.Weapon Focus/, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Sorcerer') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = null;
      features = ['1:Eschew Materials'];
      hitDie = 6;
      notes = [];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = [];
      skillPoints = 2;
      skills = [
        'Appraise', 'Bluff', 'Craft', 'Fly', 'Intimidate',
        'Knowledge (Arcana)', 'Profession', 'Spellcraft', 'Use Magic Device'
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
        ('selectableFeatureCount.Sorcerer', 'levels.Sorcerer', '=', '1');
      var bloodlinePowers = {
        'Aberrant':
          '1:Acidic Ray/3:Long Limbs/9:Unusual Anatomy/' +
          '15:Alien Resistance/20:Aberrant Form',
        'Abyssal':
          '1:Claws/3:Demon Resistances/9:Strength Of The Abyss/' +
          '15:Added Summonings/20:Demonic Might',
        'Arcane':
          '3:Metamagic Adept/9:New Arcana/15:School Power/20:Arcane Apotheosis',
        'Celestial':
          '1:Heavenly Fire/3:Celestial Resistances/9:Wings Of Heaven/' +
          '15:Conviction/20:Ascension',
        'Destined':
          '1:Touch Of Destiny/3:Fated/9:It Was Meant To Be/' +
          '15:Within Reach/20:Destiny Realized',
        'Draconic':
          '1:Claws/3:Dragon Resistances/9:Breath Weapon/' +
          '15:Wings/20:Power Of Wyrms/20:Blindsense',
        'Elemental':
          '1:Elemental Ray/3:Elemental Resistance/9:Elemental Blast/' +
          '15:Elemental Movement/20:Elemental Body',
        'Fey':
          '1:Laughing Touch/3:Woodland Stride/9:Fleeting Glance/' +
          '15:Fey Magic/20:Soul Of The Fey',
        'Infernal':
          '1:Corrupting Touch/3:Infernal Resistances/9:Hellfire/' +
          '15:On Dark Wings/20:Power Of The Pit',
        'Undead':
          '1:Grave Touch/3:Death\'s Gift/9:Grasp Of The Dead/' +
          '15:Incorporeal Form/20:One Of Us'
      }
      var bloodlineSkills = {
        'Aberrant':'Knowledge (Dungeoneering)',
        'Abyssal':'Knowledge (Planes)',
        'Arcane':'Knowledge',
        'Celestial':'Heal',
        'Destined':'Knowledge (History)',
        'Draconic':'Perception',
        'Elemental':'Knowledge (Planes)',
        'Fey':'Knowledge (Nature)',
        'Infernal':'Diplomacy',
        'Undead':'Knowledge (Religion)'
      }
      var bloodlineSpells = {
        'Aberrant':
          'Enlarge Person/See Invisibility/Tongues/Black Tentacles/' +
          'Feeblemind/Veil/Plane Shift/Mind Blank/Shapechange',
        'Abyssal':
          'Cause Fear/Bull\'s Strength/Rage/Stoneskin/Dismissal/' +
          'Transformation/Greater Teleport/Unholy Aura/Summon Monster IX',
        'Arcane':
          'Identify/Invisibility/Dispel Magic/Dimension Door/' +
          'Overland Flight/True Seeing/Greater Teleport/Power Word Stun/Wish',
        'Celestial':
          'Bless/Resist Energy/Magic Circle Against Evil/Remove Curse/' +
          'Flame Strike/Greater Dispel Magic/Banishment/Sunburst/Gate',
        'Destined':
          'Alarm/Blur/Protection From Energy/Freedom Of Movement/' +
          'Break Enchantment/Mislead/Spell Turning/Moment Of Prescience/' +
          'Foresight',
        'Draconic':
          'Mage Armor/Resist Energy/Fly/Fear/Spell Resistance/' +
          'Form Of The Dragon I/Form Of The Dragon II/' +
          'Form Of The Dragon III/Wish',
        'Elemental':
          'Burning Hands/Scorching Ray/Protection From Energy/' +
          'Elemental Body I/Elemental Body II/Elemental Body III/' +
          'Elemental Body IV/Summon Monster VIII/Elemental Swarm',
        'Fey':
          'Entangle/Hideous Laughter/Deep Slumber/Poison/Tree Stride/' +
          'Mislead/Phase Door/Irresistible Dance/Shapechange',
        'Infernal':
          'Protection From Good/Scorching Ray/Suggestion/Charm Monster/' +
          'Dominate Person/Planar Binding/Greater Teleport/Power Word Stun/' +
          'Meteor Swarm',
        'Undead':
          'Chill Touch/False Life/Vampiric Touch/Animate Dead/' +
          'Waves Of Fatigue/Undeath To Death/Finger Of Death/Horrid Wilting/' +
          'Energy Drain'
      }
      for(var j = 0; j < bloodlines.length; j++) {
        var bloodline = bloodlines[j];
        var bloodlineLevelAttr = 'bloodlineLevel.' + bloodline;
        var powers = bloodlinePowers[bloodline].split('/');
        var skill = bloodlineSkills[bloodline];
        var spells = bloodlineSpells[bloodline].split('/');
        selectableFeatures.push('Bloodline ' + bloodline);
        rules.defineRule(bloodlineLevelAttr,
          'features.Bloodline ' + bloodline, '?', null,
          'levels.Sorcerer', '=', null
        );
        for(var k = 0; k < powers.length; k++) {
          var pieces = powers[k].split(':');
          rules.defineRule('sorcererFeatures.' + pieces[1],
            bloodlineLevelAttr, '=', 'source >= ' + pieces[0] + ' ? 1 : null'
          );
          rules.defineRule('features.' + pieces[1],
            'sorcererFeatures.' + pieces[1], '=', null
          );
        }
        rules.defineRule
          ('classSkills.' + skill, 'features.Bloodline ' + bloodline, '=', '1');
        for(var k = 0; k < spells.length; k++) {
          var spell = spells[k];
          var school = Pathfinder.spellsSchools[spell].substring(0, 4);
          rules.defineRule(
            'spells.' + spell + '(W' + (k+1) + ' ' + school + ')',
            bloodlineLevelAttr, '=', 'source >= ' + (3 + 2 * k) + ' ? 1 : null'
          );
        }
        if(bloodline == 'Aberrant') {
          feats = [
            'Combat Casting', 'Improved Disarm', 'Improved Grapple',
            'Improved Initiative', 'Improved Unarmed Strike', 'Iron Will',
            'Silent Spell', 'Skill Focus (Knowledge (Dungeoneering))'
          ];
          notes = notes.concat([
            'combatNotes.aberrantFormFeature:' +
              'Immune critical hit/sneak attack, DR 5/-',
            'combatNotes.longLimbsFeature:+%V ft touch attack range',
            'combatNotes.unusualAnatomyFeature:' +
              '%V% chance to ignore critical hit/sneak attack',
            'featureNotes.aberrantFormFeature:Blindsight 60 ft',
            'magicNotes.acidicRayFeature:30 ft ranged touch for %Vd6 %1/day',
            'magicNotes.bloodlineAberrantFeature:' +
              'Polymorph spells last 50% longer',
            'saveNotes.alienResistanceFeature:%V spell resistance'
          ]);
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
            'charismaModifier', '=', '1 + source'
          );
          rules.defineRule('saveNotes.alienResistanceFeature',
            bloodlineLevelAttr, '=', 'source + 10'
          );
        } else if(bloodline == 'Abyssal') {
          feats = [
            'Augment Summoning', 'Cleave', 'Empower Spell', 'Great Fortitude',
            'Improved Bull Rush', 'Improved Sunder', 'Power Attack',
            'Skill Focus (Knowledge (Planes))'
          ];
          notes = notes.concat([
            'abilityNotes.strengthOfTheAbyssFeature:+%V strength',
            'combatNotes.clawsFeature:%V+%1%3 %2 rounds/day',
            'featureNotes.demonicMightFeature:Telepathy 60 ft',
            'magicNotes.addedSummoningsFeature:' +
              '<i>Summon Monster</i> brings additional demon/fiendish creature',
            'magicNotes.bloodlineAbyssalFeature:' +
              'Summoned creatures gain DR %V/good',
            'saveNotes.demonicMightFeature:10 acid/cold/fire',
            'saveNotes.demonResistancesFeature:%V electricity/%1 poison'
          ]);
          rules.defineRule('abilityNotes.strengthOfTheAbyssFeature',
            bloodlineLevelAttr, '=', 'source >= 17 ? 6 : source >= 13 ? 4 : 2'
          );
          rules.defineRule('clawsDamageLevel',
            'features.Claws', '=', '1',
            'features.Small', '+', '-1',
            'features.Large', '+', '1',
            bloodlineLevelAttr, '+', 'source >= 7 ? 1 : null'
          );
          rules.defineRule('combatNotes.clawsFeature',
            'clawsDamageLevel', '=',
            '["d3", "d4", "d6", "d8"][source]'
          );
          rules.defineRule
            ('combatNotes.clawsFeature.1', 'strengthModifier', '=', null);
          rules.defineRule
            ('combatNotes.clawsFeature.2', 'charismaModifier', '=', 'source+3');
          rules.defineRule('combatNotes.clawsFeature.3',
            bloodlineLevelAttr, '=',
            'source < 5 ? "" : source < 7 ? ", magic" : ", magic +d6 energy"'
          );
          rules.defineRule('magicNotes.bloodlineAbyssalFeature',
            bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('saveNotes.demonResistancesFeature',
            bloodlineLevelAttr, '=',
            'source>=20 ? "immune" : source >= 9 ? 10 : source >= 3 ? 5 : null'
          );
          rules.defineRule('saveNotes.demonResistancesFeature.1',
            bloodlineLevelAttr, '=',
            'source>=20 ? "immune" : source>=9 ? "+4" : source>=3 ? "+2" : null'
          );
        } else if(bloodline == 'Arcane') {
          feats = [
            'Combat Casting', 'Improved Counterspell', 'Improved Initiative',
            'Iron Will', 'Scribe Scroll', 'Skill Focus (Knowledge (Arcana))',
            'Spell Focus', 'Still Spell'
          ];
          notes = notes.concat([
            'featureNotes.familiarFeature:Special bond/abilities',
            'magicNotes.arcaneApotheosisFeature:' +
              'Expend 3 spell slots to replace 1 magic item charge',
            'magicNotes.bloodlineArcaneFeature:+1 boosted spell DC',
            'magicNotes.bondedObjectFeature:Cast known spell through object',
            'magicNotes.metamagicAdeptFeature:' +
              'Applying metamagic feat w/out increased casting time %V/day',
            'magicNotes.newArcaneFeature:%V additional spells',
            'magicNotes.schoolPowerFeature:+2 DC on spells from chosen school'
          ]);
          selectableFeatures.push('Bonded Object', 'Familiar');
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
            bloodlineLevelAttr, '=',
            'source >= 20 ? "any" : Math.floor((source + 1) / 4)'
          );
          rules.defineRule('magicNotes.newArcanaFeature',
            bloodlineLevelAttr, '=', 'Math.floor((source - 5) / 4)'
          );
        } else if(bloodline == 'Celestial') {
          feats = [
            'Dodge', 'Extend Spell', 'Iron Will', 'Mobility', 'Mounted Combat',
            'Ride-By Attack', 'Skill Focus (Knowledge (Religion))',
            'Weapon Finesse'
          ];
          notes = notes.concat([
            'abilityNotes.wingsOfHeavenFeature:Fly 60/good %V minutes/day',
            'featureNotes.convictionFeature:' +
              'Reroll ability/attack/skill/save 1/day',
            'magicNotes.heavenlyFireFeature:' +
              'Ranged touch heal good/harm evil d4+%V %1/day',
            'magicNotes.bloodlineCelestialFeature:' +
              'Summoned creatures gain DR %V/evil',
            'magicNotes.ascensionFeature:<i>Tongues</i> at will',
            'saveNotes.celestialResistancesFeature:%V acid/cold',
            'saveNotes.ascensionFeature:' +
              'Immune petrification, 10 electricity/fire, +4 poison',
            'saveNotes.powerOfWyrmsFeature:Immune paralysis/sleep'
          ]);
          rules.defineRule('abilityNotes.wingsOfHeavenFeature',
            bloodlineLevelAttr, '=',
            'source >= 20 ? "any" : source >= 9 ? source : null'
          );
          rules.defineRule('magicNotes.bloodlineCelestialFeature',
            bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('magicNotes.heavenlyFireFeature',
            bloodlineLevelAttr, '=', '1 + Math.floor(source / 2)'
          );
          rules.defineRule('magicNotes.heavenlyFireFeature.1',
            'charismaModifier', '=', '1 + source'
          );
          rules.defineRule('saveNotes.celestialResistancesFeature',
            bloodlineLevelAttr, '=',
            'source>=20 ? "immune" : source >= 9 ? 10 : source >= 3 ? 5 : null'
          );
        } else if(bloodline == 'Destined') {
          feats = [
            'Arcane Strike', 'Diehard', 'Endurance', 'Leadership',
            'Lightning Reflexes', 'Maximize Spell',
            'Skill Focus (Knowledge (History))', 'Weapon Focus'
          ];
          notes = notes.concat([
            'combatNotes.destinyRealizedFeature:' +
               'Critical hits confirmed, foe critical requires 20',
            'featureNotes.itWasMeantToBeFeature:' +
              'Reroll attack/critical/spell resistance check %V/day',
            'magicNotes.destinyRealizedFeature:' +
              'Automatically overcome resistance 1/day',
            'magicNotes.touchOfDestinyFeature:' +
              'Touched creature +%V attack/skill/ability/save 1 round %1/day',
            'saveNotes.bloodlineDestinedFeature:' +
              '+spell level on saves 1 round after casting personal spell',
            'saveNotes.fatedFeature:+%V saves when surprised',
            'saveNotes.withinReachFeature:' +
              'DC 20 Will save vs. fatal attack 1/day'
          ]);
          rules.defineRule('featureNotes.itWasMeantToBeFeature',
            bloodlineLevelAttr, '=', 'Math.floor((source - 1) / 8)'
          );
          rules.defineRule('magicNotes.touchOfDestinyFeature',
            bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('magicNotes.touchOfDestinyFeature.1',
            'wisdomModifier', '=', 'source + 3'
          );
          rules.defineRule('saveNotes.fatedFeature',
            bloodlineLevelAttr, '=', 'Math.floor((source + 1) / 4)'
          );
        } else if(bloodline == 'Draconic') {
          feats = [
            'Blind-Fight', 'Great Fortitude', 'Improved Initiative',
            'Power Attack', 'Quicken Spell', 'Skill Focus (Fly)',
            'Skill Focus (Knowledge (Arcana))', 'Toughness'
          ];
          notes = notes.concat([
            'abilityNotes.wingsFeature:Fly %V/average',
            'combatNotes.breathWeaponFeature:%Vd6 (%1 DC Reflex half) %2/day',
            'combatNotes.clawsFeature:%V+%1%3 %2 rounds/day',
            'combatNotes.dragonResistancesFeature:+%V AC',
            'featureNotes.blindsenseFeature:' +
              'Other senses allow detection of unseen objects w/in %V ft',
            'magicNotes.bloodlineDraconicFeature:' +
              '+1 damage/die on spells matching energy type',
            'saveNotes.dragonResistancesFeature:%V vs. energy type'
          ]);
          rules.defineRule('abilityNotes.wingsFeature',
            bloodlineLevelAttr, '^=', 'source >= 15 ? 60 : null'
          );
          rules.defineRule
            ('armorClass', 'combatNotes.dragonResistancesFeature', '+', null);
          rules.defineRule('clawsDamageLevel',
            'features.Claws', '=', '1',
            'features.Small', '+', '-1',
            'features.Large', '+', '1',
            bloodlineLevelAttr, '+', 'source >= 7 ? 1 : null'
          );
          rules.defineRule
            ('combatNotes.breathWeaponFeature', bloodlineLevelAttr, '=', null);
          rules.defineRule('combatNotes.breathWeaponFeature.1',
            bloodlineLevelAttr, '=', '10 + Math.floor(source / 2)',
            'charismaModifier', '+', null
          );
          rules.defineRule('combatNotes.breathWeaponFeature.2',
            bloodlineLevelAttr, '=',
            'source >= 20 ? 3 : source >= 17 ? 2 : source >= 9 ? 1 : null'
          );
          rules.defineRule('combatNotes.clawsFeature',
            'clawsDamageLevel', '=',
            '["d3", "d4", "d6", "d8"][source]'
          );
          rules.defineRule
            ('combatNotes.clawsFeature.1', 'strengthModifier', '=', null);
          rules.defineRule
            ('combatNotes.clawsFeature.2', 'charismaModifier', '=', 'source+3');
          rules.defineRule('combatNotes.clawsFeature.3',
            bloodlineLevelAttr, '=',
            'source < 5 ? "" : source < 7 ? ", magic" : ", magic +d6 energy"'
          );
          rules.defineRule('combatNotes.dragonResistancesFeature',
            bloodlineLevelAttr, '=',
            'source >= 15 ? 4 : source >= 10 ? 2 : source >= 3 ? 1 : null'
          );
          rules.defineRule('featureNotes.blindsenseFeature',
            bloodlineLevelAttr, '^=', '60'
          );
          rules.defineRule('saveNotes.dragonResistancesFeature',
            bloodlineLevelAttr, '=',
            'source>=20 ? "Immune" : source >= 9 ? 10 : source >= 3 ? 5 : null'
          );
        } else if(bloodline == 'Elemental') {
          feats = [
            'Dodge', 'Empower Spell', 'Great Fortitude', 'Improved Initiative',
            'Lightning Reflexes', 'Power Attack',
            'Skill Focus (Knowledge (Planes))', 'Weapon Finesse'
          ];
          notes = notes.concat([
            'abilityNotes.elementalMovementFeature:Special type/bonus',
            'combatNotes.elementalBodyFeature:Immune sneak attack/critical hit',
            'magicNotes.bloodlineElementFeature:' +
              'Change spell energy type to match own',
            'magicNotes.elementalBlastFeature:' +
              '60 ft range 20 ft radius %Vd6 damage (DC %1 Reflex half) %2/day',
            'magicNotes.elementalRayFeature:' +
              '30 ft ranged touch for d6+%1 %V/day',
            'saveNotes.elementalResistance:%V vs. energy type'
          ]);
          rules.defineRule('magicNotes.elementalBlastFeature',
            bloodlineLevelAttr, '=', 'source >= 9 ? source : null'
          );
          rules.defineRule('combatNotes.elementalBlastFeature.1',
            bloodlineLevelAttr, '=', '10 + Math.floor(source / 2)',
            'charismaModifier', '+', null
          );
          rules.defineRule('combatNotes.elementalBlastFeature.2',
            bloodlineLevelAttr, '=',
            'source >= 20 ? 3 : source >= 17 ? 2 : source >= 9 ? 1 : null'
          );
          rules.defineRule('magicNotes.elementalRayFeature',
            'charismaModifier', '=', 'source + 3'
          );
          rules.defineRule('magicNotes.elementalRayFeature.1',
            bloodlineLevelAttr, '=', 'Math.floor(source / 2)'
          );
          rules.defineRule('saveNotes.elementalResistanceFeature',
            bloodlineLevelAttr, '=',
            'source>=20 ? "Immune" : source >= 9 ? 20 : source >= 3 ? 10 : null'
          );
        } else if(bloodline == 'Fey') {
          feats = [
            'Dodge', 'Improved Initiative', 'Lightning Reflexes', 'Mobility',
            'Point Blank Shot', 'Precise Shot', 'Quicken Spell',
            'Skill Focus (Knowledge (Nature))'
          ];
          notes = notes.concat([
            'combatNotes.soulOfTheFeyFeature:' +
              'Animals attack only if magically forced',
            'featureNotes.woodlandStrideFeature:' +
              'Normal movement through undergrowth',
            'magicNotes.bloodlineFeyFeature:+2 compulsion spell DC',
            'magicNotes.feyMagicFeature:Reroll any resistance check',
            'magicNotes.fleetingGlanceFeature:' +
              '<i>Greater Invisibility</i> %V rounds/day',
            'magicNotes.laughingTouchFeature:' +
              'Touch causes 1 round of laughter %V/day',
            'magicNotes.soulOfTheFeyFeature:<i>Shadow Walk</i> 1/day',
            'saveNotes.soulOfTheFeyFeature:Immune poison/DR 10/cold iron'
          ]);
          rules.defineRule('magicNotes.fleetingGlanceFeature',
            bloodlineLevelAttr, '=', 'source >= 9 ? source : null'
          );
          rules.defineRule('magicNotes.laughingTouchFeature',
            'charismaModifier', '=', 'source + 3'
          );
        } else if(bloodline == 'Infernal') {
          feats = [
            'Blind-Fight', 'Combat Expertise', 'Deceitful', 'Extend Spell',
            'Improved Disarm', 'Iron Will', 'Skill Focus (Knowledge (Planes))',
            'Spell Penetration'
          ];
          notes = notes.concat([
            'abilityNotes.onDarkWingsFeature:Fly 60/average',
            'featureNotes.powerOfThePitFeature:Darkvision 60 ft',
            'magicNotes.bloodlineInfernalFeature:+2 charm spell DC',
            'magicNotes.corruptingTouchFeature:' +
              'Touch causes shaken %V rounds %1/day',
            'saveNotes.infernalResistancesFeature:%V fire/%1 poison',
            'saveNotes.powerOfThePitFeature:10 acid/cold'
          ]);
          rules.defineRule('magicNotes.corruptingTouchFeature',
            bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('magicNotes.corruptingTouchFeature.1',
            'charismaModifier', '=', 'source + 3'
          );
          rules.defineRule('saveNotes.infernalResistancesFeature',
            bloodlineLevelAttr, '=',
            'source>=20 ? "immune" : source >= 9 ? 10 : source >= 3 ? 5 : null'
          );
          rules.defineRule('saveNotes.infernalResistancesFeature.1',
            bloodlineLevelAttr, '=',
            'source>=20 ? "immune" : source>=9 ? "+4" : source>=3 ? "+2" : null'
          );
        } else if(bloodline == 'Undead') {
          feats = [
            'Combat Casting', 'Diehard', 'Endurance', 'Iron Will',
            'Skill Focus (Knowledge (Religion))', 'Spell Focus', 'Toughness'
          ];
          notes = notes.concat([
            'combatNotes.oneOfUsFeature:Ignored by unintelligent undead',
            'magicNotes.graveTouchFeature:' +
              'Touch causes shaken/frightened %V rounds %1/day',
            'magicNotes.graspOfTheDadFeature:' +
              '60 ft range 20 ft radius %Vd6 damage (DC %1 Reflex half) %2/day',
            'magicNotes.incorporealFormFeature:Incorporeal %V rounds 1/day',
            'saveNotes.death\'sGiftFeature:%V cold/DR %1/- vs. non-lethal',
            'saveNotes.oneOfUsFeature:' +
              'Immune paralysis/sleep/+4 vs. undead\'s spells'
          ]);
          rules.defineRule('magicNotes.graspOfTheDeadFeature',
            bloodlineLevelAttr, '=', 'source >= 9 ? source : null'
          );
          rules.defineRule('combatNotes.graspOfTheDeadFeature.1',
            bloodlineLevelAttr, '=', '10 + Math.floor(source / 2)',
            'charismaModifier', '+', null
          );
          rules.defineRule('combatNotes.graspOfTheDeadFeature.2',
            bloodlineLevelAttr, '=',
            'source >= 20 ? 3 : source >= 17 ? 2 : source >= 9 ? 1 : null'
          );
          rules.defineRule('magicNotes.graveTouchFeature',
            bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('magicNotes.graveTouchFeature.1',
            'charismaModifier', '=', 'source + 3'
          );
          rules.defineRule('magicNotes.incorporealFormFeature',
            bloodlineLevelAttr, '=', 'source >= 15 ? source : null'
          );
          rules.defineRule('saveNotes.death\'sGiftFeature',
            bloodlineLevelAttr, '=',
            'source>=20 ? "Immune" : source >= 9 ? 10 : source >= 3 ? 5 : null'
          );
          rules.defineRule('saveNotes.death\'sGiftFeature.1',
            bloodlineLevelAttr, '=',
            'source>=20 ? "Immune" : source >= 9 ? 10 : source >= 3 ? 5 : null'
          );
        }
        if(feats != null) {
          rules.defineRule('featCount.' + bloodline,
            bloodlineLevelAttr, '=',
            'source >= 7 ? Math.floor((source - 1) / 6) : null'
          );
          for(var k = 0; k < feats.length; k++) {
            feats[k] += ':' + bloodline;
          }
          Pathfinder.featRules(rules, feats, Pathfinder.SUBFEATS);
          feats = null;
        }
      }

    } else if(klass == 'Wizard') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = ['Spell Mastery'];
      for(var j = 0; j < Pathfinder.FEATS.length; j++) {
        var pieces = Pathfinder.FEATS[j].split(':');
        if(pieces[1].match(/Item Creation|Metamagic/)) {
          feats[feats.length] = pieces[0];
        }
      }
      features = [
        '1:Scribe Scroll', '1:Hand Of The Apprentice',
        '1:Weapon Proficiency (Club/Dagger/Heavy Crossbow/Light Crossbow/Quarterstaff)',
        '8:Metamagic Mastery'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.handOfTheApprenticeFeature:' +
          '+%V 30 ft ranged attack w/melee weapon %1/day',
        'featureNotes.familiarFeature:Special bond/abilities',
        'magicNotes.bondedObjectFeature:Cast known spell through object',
        'magicNotes.metamagicMasteryFeature:Apply metamagic feat %V/day',
        'magicNotes.scribeScrollFeature:Create scroll of any known spell',
        'magicNotes.wizardSpecialization:Extra %V spell/day each spell level',
        'skillNotes.wizardSpecialization:+2 Spellcraft (%V)'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = ['Bonded Object', 'Familiar'];
      skillPoints = 2;
      skills = [
        'Appraise', 'Craft', 'Fly', 'Knowledge', 'Linguistics', 'Profession',
        'Spellcraft'
      ];
      spellAbility = 'intelligence';
      spellsKnown = [
        'W0:1:"all"', 'W1:1:"all"', 'W2:3:"all"', 'W3:5:"all"',
        'W4:7:"all"', 'W5:9:"all"', 'W6:11:"all"', 'W7:13:"all"',
        'W8:15:"all"', 'W9:17:"all"'
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
      rules.defineRule('combatNotes.handOfTheApprenticeFeature',
        'baseAttack', '=', null,
        'intelligenceModifier', '+', null
      );
      rules.defineRule('combatNotes.handOfTheApprenticeFeature.1',
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
        'levels.Wizard', '=', 'source>=8 ? Math.floor((source - 6) / 2) : null'
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
         'specialize.' + school, '=', '"' + school + '"'
        );
        rules.defineRule('skillNotes.wizardSpecialization',
          'specialize.' + school, '=', '"' + school + '"'
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
          notes = notes.concat([
            'magicNotes.protectiveWardFeature:+%V AC 10 ft radius %1/day',
            'saveNotes.energyAbsorptionFeature:Ignore %V HP energy damage/day',
            'saveNotes.energyResistanceFeature:%V chosen energy type'
          ]);
          rules.defineRule('magicNotes.protectiveWardFeature',
            schoolLevelAttr, '=', '1 + Math.floor(source / 5)'
          );
          rules.defineRule('magicNotes.protectiveWardFeature.1',
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
          notes = notes.concat([
            'magicNotes.conjuredDartFeature:d6+%1 ranged touch %V/day',
            'magicNotes.dimensionalStepsFeature:Teleport up to %V ft/day',
            'magicNotes.summoner\'sCharmFeature:' +
              'Summon duration increased %V rounds'
          ]);
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
          notes = notes.concat([
            'combatNotes.forewarnedFeature:' +
              '+%V initiative, always act in surprise round',
            'magicNotes.diviner\'sFortuneFeature:' +
              'Touched creature +%V attack/skill/ability/save 1 round %1/day',
            'magicNotes.scryingAdeptFeature:' +
              'Constant <i>Detect Scrying</i>, +1 scrying subject familiarity'
          ]);
          rules.defineRule('combatNote.forewarnedFeature',
            schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule
            ('initiative', 'combatNote.forewarnedFeature', '+', null);
          rules.defineRule('magicNotes.diviner\'sFortuneFeature',
            schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('magicNotes.diviner\'sFortuneFeature.1',
            'intelligenceModifier', '=', 'source + 3'
          );
        } else if(school == 'Enchantment') {
          notes = notes.concat([
            'magicNotes.auraOfDespairFeature:' +
              'Foes w/in 30 ft -2 ability/attack/damage/save/skill ' +
              '%V rounds/day',
            'magicNotes.dazingTouchFeature:' +
              'Touch attack dazes %V HD foe 1 round %1/day',
            'saveNotes.enchantmentReflectionFeature:' +
              'Successful save reflects enchantment spells on caster',
            'skillNotes.enchantingSmileFeature:+%V Bluff/Diplomacy/Intimidate'
          ]);
          rules.defineRule('magicNotes.auraOfDespairFeature',
            schoolLevelAttr, '=', null
          );
          rules.defineRule('magicNotes.dazingTouchFeature',
            schoolLevelAttr, '=', null
          );
          rules.defineRule('magicNotes.dazingTouchFeature.1',
            'intelligenceModifier', '=', 'source + 3'
          );
          rules.defineRule('skillNotes.enchantingSmileFeature',
            schoolLevelAttr, '=', '1 + Math.floor(source / 5)'
          );
        } else if(school == 'Evocation') {
          notes = notes.concat([
            'magicNotes.elementalWallFeature:' +
              '<i>Wall Of Fire</i>/acid/cold/electricity %V rounds/day',
            'magicNotes.forceMissileFeature:d4+%V <i>Magic Missile</i> %1/day',
            'magicNotes.intenseSpellsFeature:+%V evocation spell damage',
            'magicNotes.penetratingSpellsFeature:' +
              'Best of two rolls to overcome spell resistance'
          ]);
          rules.defineRule
            ('magicNotes.elementalWallFeature', schoolLevelAttr, '=', null);
          rules.defineRule('magicNotes.forceMissileFeature',
            schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('magicNotes.forceMissileFeature.1',
            'intelligenceModifier', '=', 'source + 3'
          );
          rules.defineRule('magicNotes.intenseSpellsFeature',
            schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
        } else if(school == 'Illusion') {
          notes = notes.concat([
            'magicNotes.blindingRayFeature:' +
              'Ranged touch blinds/dazzles 1 round %V/day',
            'magicNotes.extendedIllusionsFeature:' +
              'Illusion duration increased %V rounds',
            'magicNotes.invisibilityFieldFeature:' +
              '<i>Greater Invisibility</i> %V rounds/day'
          ]);
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
          notes = notes.concat([
            'featureNotes.lifeSightFeature:%V blindsight for living/undead',
            'featureNotes.powerOverUndeadFeature:' +
              'Command/Turn Undead bonus feat',
            'magicNotes.necromanticTouchFeature:' +
              'Touch causes shaken/frightened %V rounds %1/day'
          ]);
          rules.defineRule('featureNotes.lifeSightFeature',
            schoolLevelAttr, '=',
            'source >= 8 ? 10 * Math.floor((source - 4) / 4) : null'
          );
          rules.defineRule('featCount.Wizard',
            'featureNotes.powerOverUndeadFeature', '+', '1'
          );
          rules.defineRule('magicNotes.necromanticTouchFeature',
            schoolLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
          );
          rules.defineRule('magicNotes.necromanticTouchFeature.1',
            'intelligenceModifier', '=', 'source + 3'
          );
        } else if(school == 'Transmutation') {
          notes = notes.concat([
            'abilityNotes.physicalEnhancementFeature:+%V %1 of str/dex/con',
            'magicNotes.changeShapeFeature:' +
              '<i>Beast Shape %1</i>/<i>Elemental Body %2</i> %V rounds/day',
            'magicNotes.telekineticFistFeature:Ranged touch for d4+%1 %V/day'
          ]);
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

    } else
      continue;

    SRD35.defineClass
      (rules, klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       spellsKnown, spellsPerDay, spellAbility);
    // Override SRD35 skillPoints rule
    rules.defineRule
      ('skillPoints', 'levels.' + klass, '+', 'source * ' + skillPoints);
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
        var choice = klass + ' - ' + selectable;
        rules.defineChoice('selectableFeatures', choice + ':' + klass);
        rules.defineRule(klassNoSpace + 'Features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
      }
    }

  }

  rules.defineNote
    ('validationNotes.selectableFeatureAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.selectableFeatureAllocation.1',
    '', '=', '0',
    /^selectableFeatureCount\./, '+=', null
  );
  rules.defineRule('validationNotes.selectableFeatureAllocation.2',
    '', '=', '0',
    /^selectableFeatures\./, '+=', null
  );
  rules.defineRule('validationNotes.selectableFeatureAllocation',
    'validationNotes.selectableFeatureAllocation.1', '=', '-source',
    'validationNotes.selectableFeatureAllocation.2', '+=', null
  );

};

/* Defines the rules related to combat. */
Pathfinder.combatRules = function(rules) {
  SRD35.combatRules(rules);
  rules.defineRule('combatManeuverBonus',
    'baseAttack', '=', null,
    'strengthModifier', '+', null
  );
  rules.defineRule('combatManeuverDefense',
    'baseAttack', '=', null,
    'strengthModifier', '+', null,
    'dexterityModifier', '+', null
  );
  rules.defineSheetElement(
    'CombatManeuver', 'CombatStats/',
    '<b>Combat Maneuver Bonus/Defense</b>: %V', '/'
  );
  rules.defineSheetElement('Combat Maneuver Bonus', 'CombatManeuver/', '%V');
  rules.defineSheetElement('Combat Maneuver Defense', 'CombatManeuver/', '%V');
  // Override SRD35 armor bonuses
  rules.defineRule
    ('armorClass', 'armor', '+', 'Pathfinder.armorsArmorClassBonuses[source]');
};

/* Defines the rules related to companion creatures. */
Pathfinder.companionRules = function(rules, companions, familiars) {

  SRD35.companionRules(rules, companions, familiars);

  if(companions != null) {
    var notes = [
      'companionStats.Skills:%V',
      'companionStats.Feats:%V'
    ];
    rules.defineNote(notes);
    // Overrides SRD35 HD calculation
    rules.defineRule('companionStats.HD',
      'animalCompanionLevel', '=', 'null',
      'animalCompanionMasterLevel', '=', 'source + 1 - Math.floor((source+1)/4)'
    );
    rules.defineRule('companionStats.Feats',
      'animalCompanionMasterLevel', '=',
      'source == 18 ? 8 : source >= 10 ? Math.floor((source + 5) / 3) : ' +
      'Math.floor((source + 4) / 3)'
    );
    rules.defineRule('companionStats.Skills',
      'animalCompanionMasterLevel', '=',
      'source + 1 - Math.floor((source + 1) / 4)'
    );
  }

  if(familiars != null) {
    notes = [
      'skillNotes.companionAlertnessFeature:' +
        '+2 Perception/Sense Motive when companion w/in reach',
      'skillNotes.familiarBat:+3 Fly',
      'skillNotes.familiarCat:+3 Stealth',
      'skillNotes.familiarMonkey:+3 Acrobatics'
    ];
    delete rules.choices['notes']['skillNotes.companionAlertnessFeature'];
    delete rules.choices['notes']['skillNotes.familiarBat'];
    delete rules.choices['notes']['skillNotes.familiarCat'];
    rules.defineNote(notes);
    rules.defineRule('skillNotes.familiarMonkey', 'familiar.Monkey', '=', '1');
  }

};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Pathfinder.createViewers = function(rules, viewers) {
  SRD35.createViewers(rules, viewers); // No changes
}

/* Defines the rules related to character description. */
Pathfinder.descriptionRules = function(rules, alignments, deities, genders) {
  SRD35.descriptionRules(rules, alignments, deities, genders);
  // Pathfinder clerics get proficiency in the deity's favored weapon without
  // taking the War domain, and the War domain does not grant Weapon Focus.
  for(var i = 0; i < deities.length; i++) {
    var pieces = deities[i].split(':');
    if(pieces.length < 3 || pieces[1] == "")
      continue;
    var deity = pieces[0];
    var weapons = pieces[1].split('/');
    for(var j = 0; j < weapons.length; j++) {
      var weapon = weapons[j];
      var focusFeature = 'Weapon Focus (' + weapon + ')';
      var proficiencyFeature = 'Weapon Proficiency (' + weapon + ')';
      rules.defineRule('clericFeatures.' + focusFeature, 'levels.Cleric', '?', 'source == 0');
      rules.defineRule
        ('clericFeatures.' + proficiencyFeature, 'domains.War', '=', 'null');
    }
  }
};

/* Defines the rules related to equipment. */
Pathfinder.equipmentRules = function(rules, armors, goodies, shields, weapons) {
  SRD35.equipmentRules(rules, armors, goodies, shields, weapons); // No changes
};

/* Defines the rules related to feats. */
Pathfinder.featRules = function(rules, feats, subfeats) {

  rules.defineRule
    ('features.Weapon Focus', /features.Weapon Focus \(/, '=', '1');
  rules.defineRule('features.Greater Weapon Focus',
    /features.Greater Weapon Focus \(/, '=', '1'
  );

  var allFeats = [];
  for(var i = 0; i < feats.length; i++) {
    var pieces = feats[i].split(':');
    var feat = pieces[0];
    var featSubfeats = subfeats == null ? null : subfeats[feat];
    if(featSubfeats == null) {
      allFeats[allFeats.length] = feat + ':' + pieces[1];
    } else if(featSubfeats != '') {
      featSubfeats = featSubfeats.split('/');
      for(var j = 0; j < featSubfeats.length; j++) {
        allFeats[allFeats.length] =
          feat + ' (' + featSubfeats[j] + '):' + pieces[1];
      }
    }
  }

  for(var i = 0; i < allFeats.length; i++) {

    var pieces = allFeats[i].split(':');
    var feat = pieces[0];
    var matchInfo;
    var notes = null;

    if(feat == 'Acrobatic') {
      notes = [
        'sanityNotes.acrobaticFeatSkills:Implies Acrobatics||Fly',
        'skillNotes.acrobaticFeature:+%V Acrobatics/+%1 Fly'
      ];
      rules.defineRule('skillNotes.acrobaticFeature',
        '', '=', '2',
        'skills.Acrobatics', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.acrobaticFeature.1',
        'features.Acrobatic', '=', '2',
        'skills.Fly', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Acrobatic Steps') {
      notes = [
        'abilityNotes.acrobaticStepsFeature:' +
          'Move through 20 ft of difficult terrain/round',
        'validationNotes.acrobaticStepsFeatAbility:Requires Dexterity >= 15',
        'validationNotes.acrobaticStepsFeatFeatures:Requires Nimble Moves'
      ];
    } else if(feat == 'Agile Maneuvers') {
      notes = [
        'combatNotes.agileManeuversFeature:+%V CMB (dex instead of str)',
        'sanityNotes.agileManeuversFeatAbility:' +
          'Implies Dexterity Modifier exceed Strength Modifier'
      ];
      rules.defineRule('combatNotes.agileManeuversFeature',
        'dexterityModifier', '=', null,
        'strengthModifier', '+', '-source'
      );
      rules.defineRule
        ('combatManeuverBonus', 'combatNotes.agileManeuversFeature', '+', null);
      rules.defineRule('sanityNotes.agileManeuversFeatAbility',
        'feats.Agile Maneuvers', '=', '-1',
        'dexterityModifier', '+', 'source',
        'strengthModifier', '+', '-source',
        '', 'v', '0'
      );
    } else if(feat == 'Alertness') {
      notes = [
        'sanityNotes.alertnessFeatSkills:Implies Perception||Sense Motive',
        'skillNotes.alertnessFeature:+%V Perception/+%1 Sense Motive'
      ];
      rules.defineRule('skillNotes.alertnessFeature',
        '', '=', '2',
        'skills.Perception', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.alertnessFeature.1',
        'features.Alertness', '=', '2',
        'skills.Sense Motive', '+', 'source >= 10 ? 2 : null'
      );
    } else if((matchInfo = feat.match(/^Alignment Channel \((.*)\)$/))!=null) {
      notes = [
        'combatNotes.alignmentChannel(' + matchInfo[1] + ')Feature:' +
          'Channel energy to heal or harm ' + matchInfo[1] + ' outsiders',
        'validationNotes.alignmentChannel(' + matchInfo[1] + ')FeatFeatures:' +
          'Requires Channel Energy'
      ];
    } else if(feat == 'Animal Affinity') {
      notes = [
        'sanityNotes.animalAffinityFeatSkills:Implies Handle Animal||Ride',
        'skillNotes.animalAffinityFeature:+%V Handle Animal/+%1 Ride'
      ];
      rules.defineRule('skillNotes.animalAffinityFeature',
        '', '=', '2',
        'skills.Handle Animal', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.animalAffinityFeature.1',
        'features.Animal Affinity', '=', '2',
        'skills.Ride', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Arcane Armor Mastery') {
      notes = [
        'magicNotes.arcaneArmorMasteryFeature:' +
          'Reduce armored casting penalty 10%',
        'validationNotes.arcaneArmorMasteryFeatCasterLevelArcane:' +
          'Requires Caster Level Arcane >= 7',
        'validationNotes.arcaneArmorMasteryFeatFeatures:' +
          'Requires Arcane Armor Training',
        'validationNotes.arcaneArmorMasteryFeatProficiency:' +
          'Requires Armor Proficiency (Medium) || ' +
          'Class Armor Proficiency Level >= ' + SRD35.PROFICIENCY_MEDIUM
      ];
      rules.defineRule('magicNotes.arcaneSpellFailure',
        '', '^', '0',
        'magicNotes.arcaneArmorMasteryFeature', '+', '-10'
      );
      rules.defineRule('validationNotes.arcaneArmorMasteryFeatProficiency',
        'feats.Arcane Armor Mastery', '=', '-1',
        'features.Armor Proficiency (Medium)', '+', '1',
        'classArmorProficiencyLevel', '+',
        'source >= ' + SRD35.PROFICIENCY_MEDIUM + ' ? 1 : null'
      );
    } else if(feat == 'Arcane Armor Training') {
      notes = [
        'magicNotes.arcaneArmorTrainingFeature:' +
          'Reduce armored casting penalty 10%',
        'validationNotes.arcaneArmorTrainingFeatCasterLevelArcane:' +
          'Requires Caster Level Arcane >= 3',
        'validationNotes.arcaneArmorTrainingFeatProficiency:' +
          'Requires Armor Proficiency (Light) || ' +
          'Class Armor Proficiency Level >= ' + SRD35.PROFICIENCY_LIGHT
      ];
      rules.defineRule('magicNotes.arcaneSpellFailure',
        '', '^', '0',
        'magicNotes.arcaneArmorTrainingFeature', '+', '-10'
      );
      rules.defineRule('validationNotes.arcaneArmorTrainingFeatProficiency',
        'feats.Arcane Armor Training', '=', '-1',
        'features.Armor Proficiency (Light)', '+', '1',
        'classArmorProficiencyLevel', '+',
        'source >= ' + SRD35.PROFICIENCY_LIGHT + ' ? 1 : null'
      );
    } else if(feat == 'Arcane Strike') {
      notes = [
        'combatNotes.arcaneStrikeFeature:' +
          'Imbue weapons with +%V magic damage bonus for 1 round',
        'validationNotes.arcaneStrikeFeatCasterLevelArcane:' +
          'Requires Caster Level Arcane >= 1'
      ];
      rules.defineRule('combatNotes.arcaneStrikeFeature',
        'casterLevelArcane', '=', 'Math.floor((source + 4) / 5)'
      );
    // } else if(feat == 'Armor Proficiency (Heavy)') { // as SRD35
    // } else if(feat == 'Armor Proficiency (Light)') { // as SRD35
    // } else if(feat == 'Armor Proficiency (Medium)') { // as SRD35
    } else if(feat == 'Athletic') {
      notes = [
        'sanityNotes.athleticFeatSkills:Implies Climb||Swim',
        'skillNotes.athleticFeature:+%V Climb/+%1 Swim'
      ];
      rules.defineRule('skillNotes.athleticFeature',
        '', '=', '2',
        'skills.Climb', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.athleticFeature.1',
        'features.Athletic', '=', '2',
        'skills.Swim', '+', 'source >= 10 ? 2 : null'
      );
    // } else if(feat == 'Augment Summoning') { // as SRD35
    } else if(feat == 'Bleeding Critical') {
      notes = [
        'combatNotes.bleedingCriticalFeature:' +
          'Critical hit causes 2d6 damage/round until healed (DC 15)',
        'validationNotes.bleedingCriticalFeatFeatures:Requires Critical Focus',
        'validationNotes.bleedingCriticalFeatBaseAttack:' +
          'Requires Base Attack >= 11'
      ];
    } else if(feat == 'Blind-Fight') {
      notes = [
        'combatNotes.blind-FightFeature:' +
          'Reroll concealed miss, no bonus to invisible foe, no skill check ' +
          'on blinded full speed move'
      ];
    } else if(feat == 'Blinding Critical') {
      notes = [
        'combatNotes.blindingCriticalFeature:' +
          'Critical hit causes permanent blindness, ' +
          'DC %V fortitude save reduces to dazzled d4 rounds',
        'validationNotes.blindingCriticalFeatFeatures:Requires Critical Focus',
        'validationNotes.blindingCriticalFeatBaseAttack:' +
          'Requires Base Attack >= 15'
      ];
      rules.defineRule('combatNotes.blindingCriticalFeature',
        'baseAttack', '=', '10 + source'
      );
    // } else if(feat == 'Brew Potion') { // as SRD35
    } else if(feat == 'Catch Off-Guard') {
      notes = [
        'combatNotes.catchOff-GuardFeature:' +
          'No penalty for improvised weapon, unarmed opponents flat-footed'
      ];
    } else if(feat == 'Channel Smite') {
      notes = [
        'combatNotes.channelSmiteFeature:' +
          'Channel energy into weapon strike as swift action',
        'validationNotes.channelSmiteFeatFeatures:Requires Channel Energy'
      ];
    } else if(feat == 'Cleave') {
      notes = [
        'combatNotes.cleaveFeature:-2 AC for attack against two foes',
        'validationNotes.cleaveFeatAbility:Requires Strength >= 13',
        'validationNotes.cleaveFeatBaseAttack:Requires Base Attack >= 1',
        'validationNotes.cleaveFeatFeatures:Requires Power Attack'
      ];
    // } else if(feat == 'Combat Casting') { // as SRD35
    } else if(feat == 'Combat Expertise') {
      notes = [
        'combatNotes.combatExpertiseFeature:-%V attack/+%1 AC',
        'validationNotes.combatExpertiseFeatAbility:Requires Intelligence >= 13'
      ];
      rules.defineRule('combatNotes.combatExpertiseFeature',
        'baseAttack', '=', '1 + Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.combatExpertiseFeature.1',
        'baseAttack', '=', '1 + Math.floor(source / 4)'
      );
    // } else if(feat == 'Combat Reflexes') { // as SRD35
    } else if(feat == 'Command Undead') {
      notes = [
        'combatNotes.commandUndeadFeature:' +
          'Undead w/in 30 ft %V DC will save or controlled',
        'validationNotes.commandUndeadFeatFeatures:Requires Channel Energy'
      ];
      rules.defineRule('combatNotes.commandUndeadFeature',
        'levels.Cleric', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
    // } else if(feat == 'Craft Magic Arms And Armor') { // as SRD35
    // } else if(feat == 'Craft Rod') { // as SRD35
    // } else if(feat == 'Craft Wand') { // as SRD35
    // } else if(feat == 'Craft Wondrous Item') { // as SRD35
    } else if(feat == 'Critical Focus') {
      notes = [
        'combatNotes.criticalFocusFeature:+4 attack on critical hits',
        'validationNotes.criticalFocusFeatBaseAttack:Requires Base Attack >= 9'
      ];
    } else if(feat == 'Critical Mastery') {
      notes = [
        'combatNotes.criticalMasteryFeature:Apply two effects to critical hits',
        'validationNotes.criticalMasteryFeatFeatures:Requires Critical Focus',
        'validationNotes.criticalMasteryFeatLevels:Requires Fighter >= 14'
      ];
    } else if(feat == 'Dazzling Display') {
      notes = [
        'combatNotes.dazzlingDisplayFeature:' +
          'Intimidate check to demoralize foes w/in 30 ft using focused weapon',
        'validationNotes.dazzlingDisplayFeatFeatures:Requires Weapon Focus'
      ];
    } else if(feat == 'Deadly Aim') {
      notes = [
        'combatNotes.deadlyAimFeature:-%V attack/+%1 damage on ranged attacks',
        'validationNotes.deadlyAimFeatAbility:Requires Dexterity >= 13',
        'validationNotes.deadlyAimFeatBaseAttack:Requires Base Attack >= 1'
      ];
      rules.defineRule('combatNotes.deadlyAimFeature',
        'baseAttack', '=', '1 + Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.deadlyAimFeature.1',
        'baseAttack', '=', '2 * (1 + Math.floor(source / 4))'
      );
    } else if(feat == 'Deadly Stroke') {
      notes = [
        'combatNotes.deadlyStrokeFeature:' +
          'x2 damage/1 point con bleed against stunned/flat-footed foe',
        'validationNotes.deadlyStrokeFeatBaseAttack:Requires Base Attack >= 11',
        'validationNotes.deadlyStrokeFeatFeatures:' +
          'Requires Dazzling Display/Shatter Defenses/Weapon Focus/' +
          'Greater Weapon Focus'
      ];
    } else if(feat == 'Deafening Critical') {
      notes = [
        'combatNotes.deafeningCriticalFeature:' +
          'Critical hit causes permanent deafness, ' +
          'DC %V fortitude save reduces to 1 round',
        'validationNotes.deafeningCriticalFeatFeatures:Requires Critical Focus',
        'validationNotes.deafeningCriticalFeatBaseAttack:' +
          'Requires Base Attack >= 13'
      ];
      rules.defineRule('combatNotes.deafeningCriticalFeature',
        'baseAttack', '=', '10 + source'
      );
    } else if(feat == 'Deceitful') {
      notes = [
        'sanityNotes.deceitfulFeatSkills:Implies Bluff||Disguise',
        'skillNotes.deceitfulFeature:+%V Bluff/+%1 Disguise'
      ];
      rules.defineRule('skillNotes.deceitfulFeature',
        '', '=', '2',
        'skills.Bluff', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.deceitfulFeature.1',
        'features.Deceitful', '=', '2',
        'skills.Disguise', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Defensive Combat Training') {
      notes = ['combatNotes.defensiveCombatTrainingFeature:+%V CMD'];
      rules.defineRule('combatNotes.defensiveCombatTrainingFeature',
        'level', '=', null,
        'baseAttack', '+', '-source'
      );
      rules.defineRule('combatManeuverDefense',
        'combatNotes.defensiveCombatTrainingFeature', '+', null
      );
    // } else if(feat == 'Deflect Arrows') { // as SRD35
    } else if(feat == 'Deft Hands') {
      notes = [
        'sanityNotes.deftHandsFeatSkills:' +
          'Implies Disable Device||Sleight Of Hand',
        'skillNotes.deftHandsFeature:+%V Disable Device/+%1 Sleight Of Hand'
      ];
      rules.defineRule('skillNotes.deftHandsFeature',
        '', '=', '2',
        'skills.Disable Device', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.deftHandsFeature.1',
        'features.Deft Hands', '=', '2',
        'skills.Sleight Of Hand', '+', 'source >= 10 ? 2 : null'
      );
    // } else if(feat == 'Diehard') { // as SRD35
    } else if(feat == 'Disruptive') {
      notes = [
        'combatNotes.disruptiveFeature:+4 foes\' defensive spell DC',
        'validationNotes.disruptiveFeatLevels:Requires Fighter >= 6'
      ]
    // } else if(feat == 'Dodge') { // as SRD35
    } else if(feat == 'Double Slice') {
      notes = [
        'combatNotes.doubleSliceFeature:Add full strength to off-hand damage',
        'validationNotes.doubleSliceFeatAbility:Requires Dexterity >= 15',
        'validationNotes.doubleSliceFeatFeatures:Requires Two-Weapon Fighting'
      ];
    } else if((matchInfo = feat.match(/^Elemental Channel \((.*)\)$/)) != null){
      notes = [
        'combatNotes.elementalChannel(' + matchInfo[1] + ')Feature:' +
          'Channel energy to heal or harm ' + matchInfo[1] + ' outsiders',
        'validationNotes.elementalChannel(' + matchInfo[1] + ')FeatFeatures:' +
          'Requires Channel Energy'
      ];
    // } else if(feat == 'Empower Spell') { // as SRD35
    // } else if(feat == 'Endurance') { // as SRD35
    // } else if(feat == 'Enlarge Spell') { // as SRD35
    // } else if(feat == 'Eschew Materials') { // as SRD35
    } else if(feat == 'Exhausting Critical') {
      notes = [
        'combatNotes.exhaustingCriticalFeature:' +
          'Critical hit causes foe exhaustion',
        'validationNotes.exhaustingCriticalFeatFeatures:' +
          'Requires Critical Focus/Tiring Critical',
        'validationNotes.exhaustingCriticalFeatBaseAttack:' +
          'Requires Base Attack >= 15'
      ];
    // } else if(feat == 'Extend Spell') { // as SRD35
    } else if(feat == 'Extra Channel') {
      notes = [
        'magicNotes.extraChannelFeature:Channel energy +2/day',
        'validationNotes.extraChannelFeatFeatures:Requires Channel Energy'
      ];
      rules.defineRule('magicNotes.channelEnergyFeature.2',
        'magicNotes.extraChannelFeature', '+', '2'
      );
    } else if(feat == 'Extra Ki') {
      notes = [
        'featureNotes.extraKiFeature:+2 Ki pool',
        'validationNotes.extraKiFeatFeatures:Requires Ki Pool'
      ];
      rules.defineRule('featureNotes.kiPoolFeature',
        'featureNotes.extraKiFeature', '+', '2'
      );
    } else if(feat == 'Extra Lay On Hands') {
      notes = [
        'magicNotes.extraLayOnHandsFeature:Lay On Hands +2/day',
        'validationNotes.extraLayOnHandsFeatFeatures:Requires Lay On Hands'
      ];
      rules.defineRule('magicNotes.layOnHandsFeature.1',
        'magicNotes.extraLayOnHandsFeature', '+', '2'
      )
    } else if(feat == 'Extra Mercy') {
      notes = [
        'magicNotes.extraMercyFeature:Lay On Hands gives Mercy effect',
        'validationNotes.extraMercyFeatFeatures:Requires Lay On Hands/Mercy'
      ];
    } else if(feat == 'Extra Performance') {
      notes = [
        'featureNotes.extraPerformanceFeature:' +
          'Use Barding Performance extra 6 rounds/day',
        'validationNotes.extraPerformanceFeatFeatures:' +
          'Requires Bardic Performance'
      ];
      rules.defineRule('featureNotes.bardicPerformanceFeature',
        'featureNotes.extraPerformanceFeature', '+', '6'
      );
    } else if(feat == 'Extra Rage') {
      notes = [
        'featureNotes.extraRageFeature:Rage extra 6 rounds/day',
        'validationNotes.extraRageFeatFeatures:Requires Rage'
      ];
      rules.defineRule('combatNotes.rageFeature',
        'featureNotes.extraRageFeature', '+', '6'
      );
    } else if(feat == 'Far Shot') {
      notes = [
        'combatNotes.farShotFeature:-1 range penalty',
        'validationNotes.farShotFeatFeatures:Requires Point Blank Shot'
      ];
    } else if(feat == 'Fleet') {
      notes = [
        'abilityNotes.fleetFeature:+5 speed in light/no armor'
      ];
      rules.defineRule('speed', 'abilityNotes.fleetFeature', '+', '5');
    } else if(feat == 'Forge Ring') {
      notes = [
        'magicNotes.forgeRingFeature:Create/mend magic ring',
        'validationNotes.forgeRingFeatCasterLevel:Requires Caster Level >= 7'
      ];
    } else if(feat == 'Gorgon\'s Fist') {
      notes = [
        'combatNotes.gorgon\'sFistFeature:' +
          'Unarmed attack vs. slowed foe DC %V fortitude save or staggered',
        'validationNotes.gorgon\'sFistFeatBaseAttack:Requires Base Attack >= 6',
        'validationNotes.gorgon\'sFistFeatFeatures:' +
          'Requires Improved Unarmed Strike/Scorpion Style'
      ];
      rules.defineRule('combatNotes.gorgon\'sFistFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
    // } else if(feat == 'Great Cleave') { // as SRD35
    // } else if(feat == 'Great Fortitude') { // as SRD35
    } else if(feat == 'Greater Bull Rush') {
      notes = [
        'combatNotes.greaterBullRushFeature:' +
          '+2 Bull Rush checks, AOO on Bull Rushed foes',
        'validationNotes.greaterBullRushFeatAbility:Requires Strength >= 13',
        'validationNotes.greaterBullRushFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterBullRushFeatFeatures:' +
          'Requires Improved Bull Rush/Power Attack'
      ];
    } else if(feat == 'Greater Disarm') {
      notes = [
        'combatNotes.greaterDisarmFeature:' +
          '+2 disarm checks, disarmed weapons land 15 ft away',
        'validationNotes.greaterDisarmFeatAbility:Requires Intelligence >= 13',
        'validationNotes.greaterDisarmFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterDisarmFeatFeatures:' +
          'Requires Combat Expertise/Improved Disarm'
      ];
    } else if(feat == 'Greater Feint') {
      notes = [
        'combatNotes.greaterFeintFeature:' +
          'Feinted foe loses dex bonus for full round',
        'validationNotes.greaterFeintFeatAbility:Requires Intelligence >= 13',
        'validationNotes.greaterFeintFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterFeintFeatFeatures:' +
          'Requires Combat Expertise/Improved Feint'
      ];
    } else if(feat == 'Greater Grapple') {
      notes = [
        'combatNotes.greaterGrappleFeature:' +
          '+2 grapple checks, grapple check is move action',
        'validationNotes.greaterGrappleFeatAbility:Requires Dexterity >= 13',
        'validationNotes.greaterGrappleFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterGrappleFeatFeatures:' +
          'Requires Improved Grapple/Improved Unarmed Strike'
      ];
    } else if(feat == 'Greater Overrun') {
      notes = [
        'combatNotes.greaterOverrunFeature:' +
          '+2 overrun checks, AOO on overrun foes',
        'validationNotes.greaterOverrunFeatAbility:Requires Strength >= 13',
        'validationNotes.greaterOverrunFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterOverrunFeatFeatures:' +
          'Requires Improved Overrun/Power Attack'
      ];
    } else if(feat == 'Greater Penetrating Strike') {
      notes = [
        'combatNotes.greaterPenetratingStrikeFeature:' +
          'Focused weapons ignore DR 5/- or DR 10/anything',
        'validationNotes.greaterPenetratingStrikeFeatLevels:' +
          'Requires Fighter >= 16',
        'validationNotes.greaterPenetratingStrikeFeatFeatures:' +
          'Requires Penetrating Strike/Weapon Focus'
      ];
    } else if(feat == 'Greater Shield Focus') {
      notes = [
        'combatNotes.greaterShieldFocusFeature:+1 AC',
        'validationNotes.greaterShieldFocusFeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.greaterShieldFocusFeatFeatures:' +
           'Requires Shield Focus/Shield Proficiency',
        'validationNotes.greaterShieldFocusFeatLevels:Requires Fighter >= 8'
      ];
      rules.defineRule('armorClass',
        'combatNotes.greaterShieldFocusFeature', '+', '1'
      );
    // } else if((matchInfo = feat.match(/^Greater Spell Focus \((.*)\)$/))!=null){ // as SRD35
    // } else if(feat == 'Greater Spell Penetration') { // as SRD35
    } else if(feat == 'Greater Sunder') {
      notes = [
        'combatNotes.greaterSunderFeature:' +
          '+2 sunder checks, foe takes excess damage',
        'validationNotes.greaterSunderFeatAbility:Requires Strength >= 13',
        'validationNotes.greaterSunderFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterSunderFeatFeatures:' +
          'Requires Improved Sunder/Power Attack'
      ];
    } else if(feat == 'Greater Trip') {
      notes = [
        'combatNotes.greaterTripFeature:+2 trip checks, AOO on tripped foes',
        'validationNotes.greaterTripFeatAbility:Requires Intelligence >= 13',
        'validationNotes.greaterTripFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterTripFeatFeatures:' +
          'Requires Combat Expertise/Improved Trip'
      ];
    } else if(feat == 'Greater Two-Weapon Fighting') {
      notes = [
        'combatNotes.greaterTwo-WeaponFightingFeature:' +
          'Third off-hand -10 attack',
        'validationNotes.greaterTwo-WeaponFightingFeatAbility:' +
          'Requires Dexterity >= 19',
        'validationNotes.greaterTwo-WeaponFightingFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.greaterTwo-WeaponFightingFeatFeatures:' +
          'Requires Improved Two-Weapon Fighting/Two-Weapon Fighting'
      ];
    } else if(feat == 'Greater Vital Strike') {
      notes = [
        'combatNotes.greaterVitalStrikeFeature:4x base damage',
        'validationNotes.greaterVitalStrikeFeatBaseAttack:' +
          'Requires Base Attack >= 16',
        'validationNotes.greaterVitalStrikeFeatFeatures:' +
          'Requires Improved Vital Strike/Vital Strike'
      ];
    // } else if((matchInfo = feat.match(/^Greater Weapon Focus \((.*)\)$/))!=null){ // as SRD35
    // } else if((matchInfo = feat.match(/^Greater Weapon Specialization \((.*)\)$/))!=null){ // as SRD35
    // } else if(feat == 'Heighten Spell') { // as SRD35
    } else if(feat == 'Improved Bull Rush') {
      notes = [
        'combatNotes.improvedBullRushFeature:' +
          'No AOO on Bull Rush, +2 Bull Rush check, +2 Bull Rush CMD',
        'validationNotes.improvedBullRushFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedBullRushFeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.improvedBullRushFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Channel') {
      notes = [
        'magicNotes.improvedChannelFeature:+2 DC on channeled energy',
        'validationNotes.improvedChannelFeatFeatures:Requires Channel Energy'
      ];
    // } else if(feat == 'Improved Counterspell') { // as SRD35
    // } else if((matchInfo = feat.match(/^Improved Critical \((.*)\)$/)) != null){ // as SRD35
    } else if(feat == 'Improved Disarm') {
      notes = [
        'combatNotes.improvedDisarmFeature:' +
          'No AOO on Disarm, +2 Disarm check, +2 Disarm CMD',
        'validationNotes.improvedDisarmFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedDisarmFeatFeatures:Requires Combat Expertise'
      ];
    // } else if(feat == 'Improved Familiar') { // as SRD35
    // } else if(feat == 'Improved Feint') { // as SRD35
    } else if(feat == 'Improved Grapple') {
      notes = [
        'combatNotes.improvedGrappleFeature:' +
          'No AOO on Grapple, +2 Grapple check, +2 Grapple CMD',
        'validationNotes.improvedGrappleFeatAbility:Requires Dexterity >= 13',
        'validationNotes.improvedGrappleFeatFeatures:' +
          'Requires Improved Unarmed Strike'
      ];
    } else if(feat == 'Improved Great Fortitude') {
      notes = [
        'saveNotes.improvedGreatFortitudeFeature:Reroll fortitude save 1/day',
        'validationNotes.improvedGreatFortitudeFeatFeatures:' +
          'Requires Great Fortitude'
      ];
    // } else if(feat == 'Improved Initiative') { // as SRD35
    } else if(feat == 'Improved Iron Will') {
      notes = [
        'saveNotes.improvedIronWillFeature:Reroll will save 1/day',
        'validationNotes.improvedIronWillFeatFeatures:Requires Iron Will'
      ];
    } else if(feat == 'Improved Lightning Reflexes') {
      notes = [
        'saveNotes.improvedLightningReflexesFeature:Reroll reflex save 1/day',
        'validationNotes.improvedLightningReflexesFeatFeatures:' +
          'Requires Lightning Reflexes'
      ];
    } else if(feat == 'Improved Overrun') {
      notes = [
        'combatNotes.improvedOverrunFeature:' +
          'No AOO on Overrun, +2 Overrun check, +2 Overrun CMD, ' +
          'foes cannot avoid',
        'validationNotes.improvedOverrunFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedOverrunFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Precise Shot') {
      notes = [
        'combatNotes.improvedPreciseShotFeature:' +
          'No foe AC bonus for partial concealment',
        'validationNotes.improvedPreciseShotFeatAbility:' +
          'Requires Dexterity >= 19',
        'validationNotes.improvedPreciseShotFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.improvedPreciseShotFeatFeatures:' +
          'Requires Point Blank Shot/Precise Shot'
      ];
    // } else if(feat == 'Improved Shield Bash') { // as SRD35
    } else if(feat == 'Improved Sunder') {
      notes = [
        'combatNotes.improvedSunderFeature:' +
          'No AOO on Sunder, +2 Sunder check, +2 Sunder CMD',
        'validationNotes.improvedSunderFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedSunderFeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.improvedSunderFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Trip') {
      notes = [
        'combatNotes.improvedTripFeature:' +
          'No AOO on Trip, +2 Trip check, +2 Trip CMD',
        'validationNotes.improvedTripFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedTripFeatFeatures:Requires Combat Expertise'
      ];
    // } else if(feat == 'Improved Two-Weapon Fighting') { // as SRD35
    // } else if(feat == 'Improved Unarmed Strike') { // as SRD35
    } else if(feat == 'Improved Vital Strike') {
      notes = [
        'combatNotes.improvedVitalStrikeFeature:3x base damage',
        'validationNotes.improvedVitalStrikeFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.improvedVitalStrikeFeatFeatures:Requires Vital Strike'
      ];
    } else if(feat == 'Improvised Weapon Mastery') {
      notes = [
        'combatNotes.improvisedWeaponMasteryFeature:' +
          'No penalties for improvised weapons, ' +
          'improvised weapon damage +step, critical x2@19',
        'validationNotes.improvisedWeaponMasteryFeatBaseAttack:' +
          'Requires Base Attach >= 8',
        'validationNotes.improvisedWeaponMasteryFeatFeatures:' +
          'Requires Catch Off-Guard||Throw Anything'
      ];
    } else if(feat == 'Intimidating Prowess') {
      notes = [
        'sanityNotes.intimidatingProwessFeatAbility:Implies Strength >= 12',
        'sanityNotes.intimidatingProwessFeatSkills:Implies Intimidate',
        'skillNotes.intimidatingProwessFeature:+%V Intimidate'
      ];
      rules.defineRule('skillModifier.Intimidate',
        'skillNotes.intimidatingProwessFeature', '+', null
      );
      rules.defineRule('skillNotes.intimidatingProwessFeature',
        'strengthModifier', '=', null
      );
    // } else if(feat == 'Iron Will') { // as SRD35
    } else if(feat == 'Leadership') {
      notes = [
        'featureNotes.leadershipFeature:Attract followers',
        'validationNotes.leadershipFeatLevel:Requires Level >= 7'
      ];
    // } else if(feat == 'Lightning Reflexes') { // as SRD35
    } else if(feat == 'Lightning Stance') {
      notes = [
        'combatNotes.lightningStanceFeature:' +
          '50% concealment with 2 move/withdraw actions',
        'validationNotes.lightningStanceFeatAbility:Requires Dexterity >= 17',
        'validationNotes.lightningStanceFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.lightningStanceFeatFeatures:Requires Wind Stance'
      ];
    } else if(feat == 'Lunge') {
      notes = [
        'combatNotes.lungeFeature:-2 AC to increase melee range 5 ft',
        'validationNotes.lungeFeatBaseAttack:Requires Base Attack >= 6'
      ];
    } else if(feat == 'Magical Aptitude') {
      notes = [
        'sanityNotes.magicalAptitudeFeatSkills:' +
          'Implies Spellcraft||Use Magic Device',
        'skillNotes.magicalAptitudeFeature:+%V Spellcraft/+%1 Use Magic Device'
      ];
      rules.defineRule('skillNotes.magicalAptitudeFeature',
        '', '=', '2',
        'skills.Spellcraft', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.magicalAptitudeFeature.1',
        'features.Magical Aptitude', '=', '2',
        'skills.Use Magic Device', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Manyshot') {
      notes = [
        'combatNotes.manyshotFeature:Fire 2 arrows simultaneously',
        'validationNotes.manyshotFeatAbility:Requires Dexterity >= 17',
        'validationNotes.manyshotFeatBaseAttack:Requires Base Attack >= 6',
        'validationNotes.manyshotFeatFeatures:' +
          'Requires Point Blank Shot/Rapid Shot'
      ];
    } else if((matchInfo = feat.match(/^Master Craftsman \((.*)\)$/)) != null) {
      skill = matchInfo[1];
      notes = [
        'featureNotes.masterCraftsman(' + skill + ')Feature:' +
          'Use '+skill+' with Craft Magic Arms And Armor/Craft Wondrous Item',
        'skillNotes.masterCraftsman(' + skill + ')Feature:+2 ' + skill,
        'combatNotes.elementalChannel(' + matchInfo[1] + ')Feature:' +
          'Channel energy to heal or harm ' + matchInfo[1] + ' outsiders',
        'validationNotes.masterCraftsman(' + skill + ')FeatSkills:' +
          'Requires ' + skill + ' >= 5'
      ];
    // } else if(feat == 'Maximize Spell') { // as SRD35
    } else if(feat == 'Medusa\'s Wrath') {
      notes = [
        'combatNotes.medusa\'sWrathFeature:' +
          '2 extra unarmed attacks vs. diminished-capacity foe',
        'validationNotes.medusa\'sWrathFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.medusa\'sWrathFeatFeatures:' +
          'Requires Improved Unarmed Strike/Gorgon\'s Fist/Scorpion Style'
      ];
    // } else if(feat == 'Mobility') { // as SRD35
    // } else if(feat == 'Mounted Archery') { // as SRD35
    // } else if(feat == 'Mounted Combat') { // as SRD35
    // } else if(feat == 'Natural Spell') { // as SRD35
    } else if(feat == 'Nimble Moves') {
      notes = [
        'abilityNotes.nimbleMovesFeature:' +
          'Move through 5 ft difficult terrain/round as though normal terrain',
        'validationNotes.nimbleMovesFeatAbility:Requires Dexterity >= 13'
      ];
    } else if(feat == 'Penetrating Strike') {
      notes = [
        'combatNotes.penetratingStrikeFeature:' +
          'Focused weapons ignore DR 5/anything',
        'validationNotes.penetratingStrikeFeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.penetratingStrikeFeatLevels:Requires Fighter >= 12',
        'validationNotes.penetratingStrikeFeatFeatures:Requires Weapon Focus'
      ];
    } else if(feat == 'Persuasive') {
      notes = [
        'sanityNotes.persuasiveFeatSkills:Implies Diplomacy||Intimidate',
        'skillNotes.persuasiveFeature:+%V Diplomacy/+%1 Intimidate'
      ];
      rules.defineRule('skillNotes.persuasiveFeature',
        '', '=', '2',
        'skills.Diplomacy', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.persuasiveFeature.1',
        'features.Persuasive', '=', '2',
        'skills.Intimidate', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Pinpoint Targeting') {
      notes = [
        'combatNotes.pinpointTargetingFeature:' +
          'Ranged attack ignores armor bonus',
        'validationNotes.pinpointTargetingFeatAbility:Requires Dexterity >= 19',
        'validationNotes.pinpointTargetingFeatBaseAttack:' +
          'Requires Base Attack >= 16',
        'validationNotes.pinpointTargetingFeatFeatures:' +
          'Requires Improved Precise Shot/Point-Blank Shot/Precise Shot'
      ];
    // } else if(feat == 'Point Blank Shot') { // as SRD35
    } else if(feat == 'Power Attack') {
      notes = [
        'combatNotes.powerAttackFeature:-%V attack/+%1 damage',
        'validationNotes.powerAttackFeatAbility:Requires Strength >= 13',
        'validationNotes.powerAttackFeatBaseAttack:Requires Base Attack >= 1'
      ];
      rules.defineRule('combatNotes.powerAttackFeature',
        'baseAttack', '=', '1 + Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.powerAttackFeature.1',
        'baseAttack', '=', '2 * (1 + Math.floor(source / 4))'
      );
    // } else if(feat == 'Precise Shot') { // as SRD35
    // } else if(feat == 'Quick Draw') { // as SRD35
    // } else if(feat == 'Quicken Spell') { // as SRD35
    // } else if((matchInfo = feat.match(/^Rapid Reload \((.*)\)$/)) != null) { // as SRD35
    // } else if(feat == 'Rapid Shot') { // as SRD35
    // } else if(feat == 'Ride By Attack') { // as SRD35
    } else if(feat == 'Run') {
      notes = [
        'abilityNotes.runFeature:+1 run speed multiplier',
        'combatNotes.runFeature:Retain dex bonus to AC while running',
        'skillNotes.runFeature:+4 running Jump'
      ];
      rules.defineRule
        ('runSpeedMultiplier', 'abilityNotes.runFeature', '+', '1');
    } else if(feat == 'Scorpion Style') {
      notes = [
        'combatNotes.scorpionStyleFeature:' +
          'Unarmed hit slows foe for %V rounds, DC %1 fortitude negates',
        'validationNotes.scorpionStyleFeatFeatures:' +
           'Requires Improved Unarmed Strike'
      ];
      rules.defineRule('combatNotes.scorpionStyleFeature',
        'wisdomModifier', '=', null
      );
      rules.defineRule('combatNotes.scorpionStyleFeature.1',
        'level', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
    // } else if(feat == 'Scribe Scroll') { // as SRD35
    } else if(feat == 'Selective Channeling') {
      notes = [
        'magicNotes.selectiveChannelingFeature:Avoid up to %V targets',
        'validationNotes.selectiveChannelingFeatAbility:' +
          'Requires Charisma >= 13',
        'validationNotes.selectiveChannelingFeatFeatures:' +
          'Requires Channel Energy'
      ];
      rules.defineRule('magicNotes.selectiveChannelingFeature',
        'wisdomModifier', '=', null
      );
    } else if(feat == 'Self Sufficient') {
      notes = [
        'sanityNotes.selfSufficientFeatSkills:Implies Heal||Survival',
        'skillNotes.selfSufficientFeature:+%V Heal/+%1 Survival'
      ];
      rules.defineRule('skillNotes.selfSufficientFeature',
        '', '=', '2',
        'skills.Heal', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.selfSufficientFeature.1',
        'features.Self Sufficient', '=', '2',
        'skills.Survival', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Shatter Defenses') {
      notes = [
        'combatNotes.shatterDefensesFeature:' +
          'Fearful opponents flat-footed through next round',
        'validationNotes.shatterDefensesFeatBaseAttack:' +
           'Requires Base Attack >= 6',
        'validationNotes.shatterDefensesFeatFeatures:' +
          'Requires Dazzling Display/Weapon Focus'
      ];
    } else if(feat == 'Shield Focus') {
      notes = [
        'combatNotes.shieldFocusFeature:+1 AC',
        'validationNotes.shieldFocusFeatBaseAttack:Requires Base Attack >= 1',
        'validationNotes.shieldFocusFeatFeatures:Requires Shield Proficiency'
      ];
      rules.defineRule
        ('armorClass', 'combatNotes.shieldFocusFeature', '+', '1');
    } else if(feat == 'Shield Master') {
      notes = [
        'combatNotes.shieldMasterFeature:' +
          'No penalty on shield attacks, ' +
          'apply shield enhancements to attack/damage',
        'validationNotes.shieldMasterFeatBaseAttack:Requires Base Attack >= 11',
        'validationNotes.shieldMasterFeatFeatures:' +
          'Requires Improved Shield Bash/Shield Proficiency/Shield Slam/' +
          'Two-Weapon Fighting'
      ];
    // } else if(feat == 'Shield Proficiency (Heavy)') { // as SRD35
    // } else if(feat == 'Shield Proficiency (Tower)') { // as SRD35
    } else if(feat == 'Shield Slam') {
      notes = [
        'combatNotes.shieldSlamFeature:Shield Bash includes Bull Rush',
        'validationNotes.shieldSlamFeatBaseAttack:Requires Base Attack >= 6',
        'validationNotes.shieldSlamFeatFeatures:' +
          'Requires Improved Shield Bash/Shield Proficiency/Two-Weapon Fighting'
      ];
    // } else if(feat == 'Shot On The Run') { // as SRD35
    } else if(feat == 'Sickening Critical') {
      notes = [
        'combatNotes.sickeningCriticalFeature:' +
          'Critical hit causes foe sickening',
        'validationNotes.sickeningCriticalFeatFeatures:Requires Critical Focus',
        'validationNotes.sickeningCriticalFeatBaseAttack:' +
          'Requires Base Attack >= 11'
      ];
    // } else if(feat == 'Silent Spell') { // as SRD35
    } else if((matchInfo = feat.match(/^Skill Focus \((.*)\)$/)) != null) {
      var skill = matchInfo[1];
      var skillNoSpace = skill.replace(/ /g, '');
      var note = 'skillNotes.skillFocus(' + skillNoSpace + ')Feature';
      notes = [
        note + ':+%V checks',
        'sanityNotes.skillFocus(' + skillNoSpace + ')FeatSkills:' +
          'Implies ' + skill
      ];
      rules.defineRule(note,
        '', '=', '3',
        'skills.' + skill, '+', 'source >= 10 ? 3 : null'
      );
      rules.defineRule('skillModifier.' + skill, note, '+', null);
    // } else if(feat == 'Snatch Arrows') { // as SRD35
    // } else if((matchInfo = feat.match(/^Spell Focus \((.*)\)$/)) != null) { // as SRD35
    // } else if(feat == 'Spell Mastery') { // as SRD35
    // } else if(feat == 'Spell Penetration') { // as SRD35
    } else if(feat == 'Spellbreaker') {
      notes = [
        'combatNotes.spellbreakerFeature:AOO on foe failed defensive casting',
        'validationNotes.spellbreakerFeatFeatures:Requires Disruptive',
        'validationNotes.spellbreakerFeatLevels:Requires Fighter >= 10'
      ];
    // } else if(feat == 'Spirited Charge') { // as SRD35
    // } else if(feat == 'Spring Attack') { // as SRD35
    } else if(feat == 'Staggering Critical') {
      notes = [
        'combatNotes.staggeringCriticalFeature:' +
          'Critical hit causes foe staggered d4+1 rounds, ' +
          'DC %V fortitude negates',
        'validationNotes.staggeringCriticalFeatFeatures:' +
          'Requires Critical Focus',
        'validationNotes.staggeringCriticalFeatBaseAttack:' +
          'Requires Base Attack >= 13'
      ];
      rules.defineRule('combatNotes.staggeringCriticalFeature',
        'baseAttack', '=', '10 + source'
      );
    } else if(feat == 'Stand Still') {
      notes = [
        'combatNotes.standStillFeature:CMD check to halt foe movement',
        'validationNotes.standStillFeatFeatures:Requires Combat Reflexes'
      ];
    } else if(feat == 'Stealthy') {
      notes = [
        'sanityNotes.stealthyFeatSkills:Implies Escape Artist||Stealth',
        'skillNotes.stealthyFeature:+%V Escape Artist/+%1 Stealth'
      ];
      rules.defineRule('skillNotes.stealthyFeature',
        '', '=', '2',
        'skills.Escape Artist', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.stealthyFeature.1',
        'features.Stealthy', '=', '2',
        'skills.Stealth', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Step Up') {
      notes = [
        'combatNotes.stepUpFeature:Match foe\'s 5 ft step',
        'validationNotes.stepUpFeatBaseAttack:Requires Base Attack >= 1'
      ];
    // } else if(feat == 'Still Spell') { // as SRD35
    } else if(feat == 'Strike Back') {
      notes = [
        'combatNotes.strikeBackFeature:Attack attackers beyond reach',
        'validationNotes.strikeBackFeatAttackBonus:Requires Attack Bonus >= 11'
      ];
    } else if(feat == 'Stunning Critical') {
      notes = [
        'combatNotes.stunningCriticalFeature:' +
          'Critical hit stuns d4 rounds, DC %V fortitude reduces to staggered',
        'validationNotes.stunningCriticalFeatBaseAttack:' +
           'Requires Base Attack >= 17',
        'validationNotes.stunningCriticalFeatFeatures:' +
           'Requires Critical Focus/Staggering Critical'
      ]
      rules.defineRule('combatNotes.stunningCriticalFeature',
        'baseAttack', '=', '10 + source'
      );
    } else if(feat == 'Stunning Fist') {
      notes = [
        'combatNotes.stunningFistFeature:' +
          'Foe DC %V Fortitude save or stunned %1/day',
        'validationNotes.stunningFistFeatAbility:' +
          'Requires Dexterity >= 13/Wisdom >= 13',
        'validationNotes.stunningFistFeatBaseAttack:Requires Base Attack >= 8',
        'validationNotes.stunningFistFeatFeatures:' +
          'Requires Improved Unarmed Strike'
      ];
      rules.defineRule('combatNotes.stunningFistFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.stunningFistFeature.1',
        'level', '=', 'Math.floor(source / 4)'
      )
    } else if(feat == 'Throw Anything') {
      notes = [
        'combatNotes.throwAnythingFeature:' +
          'No penalty for improvised ranged weapon, +1 attack w/thrown splash'
      ];
    } else if(feat == 'Tiring Critical') {
      notes = [
        'combatNotes.tiringCriticalFeature:Critical hit tires foe',
        'validationNotes.tiringCriticalFeatBaseAttack:' +
           'Requires Base Attack >= 13',
        'validationNotes.tiringCriticalFeatFeatures:Requires Critical Focus'
      ]
    } else if(feat == 'Toughness') {
      notes = ['combatNotes.toughnessFeature:+%V HP'];
      rules.defineRule
        ('combatNotes.toughnessFeature', 'level', '=', 'Math.max(3, source)');
      rules.defineRule('hitPoints', 'combatNotes.toughnessFeature', '+', null);
    // } else if(feat == 'Trample') { // as SRD35
    } else if(feat == 'Turn Undead') {
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Channel energy to cause undead panic, DC %V will save negates',
        'validationNotes.turnUndeadFeatFeatures:Requires Channel Energy'
      ];
      rules.defineRule('combatNotes.turnUndeadFeature',
        'levels.Cleric', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
    // } else if(feat == 'Two-Weapon Defense') { // as SRD35
    // } else if(feat == 'Two-Weapon Fighting') { // as SRD35
    } else if(feat == 'Two-Weapon Rend') {
      notes = [
        'combatNotes.two-WeaponRendFeature:Extra d10+%V damage from double hit',
        'validationNotes.two-WeaponRendFeatAbility:Requires Dexterity >= 17',
        'validationNotes.two-WeaponRendFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.two-WeaponRendFeatFeatures:' +
          'Requires Double Slice/Improved Two-Weapon Fighting/' +
          'Two-Weapon Fighting'
      ];
      rules.defineRule('combatNotes.two-WeaponRendFeature',
        'strengthModifier', '=', 'Math.floor(source * 1.5)'
      );
    } else if(feat == 'Unseat') {
      notes = [
        'combatNotes.unseatFeature:' +
          'Bull Rush after hit w/lance to unseat mounted foe',
        'validationNotes.unseatFeatAbility:Requires Strength >= 13',
        'validationNotes.unseatFeatBaseAttack:Requires Base Attack >= 1',
        'validationNotes.unseatFeatFeatures:' +
          'Requires Mounted Combat/Power Attack/Improved Bull Rush',
        'validationNotes.unseatFeatSkills:Requires Ride'
      ];
    } else if(feat == 'Vital Strike') {
      notes = [
        'combatNotes.vitalStrikeFeature:2x base damage',
        'validationNotes.vitalStrikeFeatBaseAttack:Requires Base Attack >= 6'
      ];
    // } else if(feat == 'Weapon Finesse') { // as SRD35
    // } else if((matchInfo = feat.match(/^Weapon Focus \((.*)\)$/)) != null) { // as SRD35
    // } else if((matchInfo = feat.match(/^Weapon Proficiency \((.*)\)$/))!=null) { // as SRD35
    // } else if((matchInfo = feat.match(/^Weapon Specialization \((.*)\)$/)) != null) { // as SRD35
    // } else if(feat == 'Whirlwind Attack') { // as SRD35
    // } else if(feat == 'Widen Spell') { // as SRD35
    } else if(feat == 'Wind Stance') {
      notes = [
        'combatNotes.windStanceFeature:20% concealment when moving > 5 ft',
        'validationNotes.windStanceFeatAbility:Requires Dexterity >= 15',
        'validationNotes.windStanceFeatBaseAttack:Requires Base Attack >= 6',
        'validationNotes.windStanceFeatFeatures:Requires Dodge'
      ];
    } else {
      SRD35.featRules(rules, [feat + ':' + pieces[1]], null);
      continue;
    }

    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);

  }

  // Override SRD35 feat count computation
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');

};

/* Defines the rules related to spells and domains. */
Pathfinder.magicRules = function(rules, classes, domains, schools) {

  SRD35.magicRules(rules, classes, [], schools);
  schools = rules.getChoices('schools');

  // Delete SRD35 spells that don't exist in Pathfinder
  delete rules.choices['spells']['Cure Minor Wounds(C0 Conj)'];
  delete rules.choices['spells']['Inflict Minor Wounds(C0 Necr)'];
  delete rules.choices['spells']['Cure Minor Wounds(D0 Conj)'];
  delete rules.choices['spells']['Polymorph(W4 Tran)'];

  // Add Pathfinder-specific spells
  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass == 'Cleric') {
      spells = [
        'C0:Bleed', 'C0:Stabilize', 'C4:Chaos Hammer', 'C4:Holy Smite',
        'C4:Order\'s Wrath', 'C4:Unholy Blight', 'C5:Breath Of Life'
      ];
    } else if(klass == 'Druid') {
      spells = ['D0:Stabilize'];
    } else if(klass == 'Sorcerer' || klass == 'Wizard') {
      spells = [
        'W0:Bleed', 'W2:Make Whole', 'W3:Beast Shape I', 'W4:Beast Shape II',
        'W4:Elemental Body I', 'W5:Beast Shape III', 'W5:Elemental Body II',
        'W5:Plant Shape I', 'W5:Polymorph', 'W6:Beast Shape IV',
        'W6:Elemental Body III', 'W6:Form Of The Dragon I',
        'W6:Plant Shape II', 'W7:Elemental Body IV',
        'W7:Form Of The Dragon II', 'W7:Giant Form I', 'W7:Plant Shape III',
        'W7:Greater Polymorph', 'W8:Form Of The Dragon III', 'W8:Giant Form II'
      ];
    } else
      continue;
    for(var j = 0; j < spells.length; j++) {
      var pieces = spells[j].split(':');
      var school = Pathfinder.spellsSchools[pieces[1]];
      spell = pieces[1] + '(' + pieces[0] + ' ' + schools[school] + ')';
      rules.defineChoice('spells', spell);
    }
  }

  // Add domain rules
  var domainFeatures = {
    'Air': '1:Lightning Arc/6:Electricity Resistance',
    'Animal': '1:Speak With Animals/4:Animal Companion',
    'Artifice': '1:Artificer\'s Touch/8:Dancing Weapons',
    'Chaos': '1:Touch Of Chaos/8:Chaos Blade',
    'Charm': '1:Addling Touch/8:Charming Smile',
    'Community': '1:Calming Touch/8:Unity',
    'Darkness': '1:Blind-Fight/1:Touch Of Darkness/8:Eyes Of Darkness',
    'Death': '1:Bleeding Touch/8:Death\'s Embrace',
    'Destruction': '1:Destructive Smite/8:Destructive Aura',
    'Earth': '1:Acid Dart/6:Acid Resistance',
    'Evil': '1:Touch Of Evil/8:Scythe Of Evil',
    'Fire': '1:Fire Bolt/6:Fire Resistance',
    'Glory': '1:Undead Bane/1:Touch Of Glory/8:Divine Presence',
    'Good': '1:Touch Of Good/8:Holy Lance',
    'Healing': '1:Rebuke Death/6:Healer\'s Blessing',
    'Knowledge': '1:Lore Keeper/6:Remote Viewing',
    'Law': '1:Touch Of Law/8:Staff Of Order',
    'Liberation': '1:Liberation/8:Freedom\'s Call',
    'Luck': '1:Bit Of Luck/6:Good Fortune',
    'Madness': '1:Vision Of Madness/8:Aura Of Madness',
    'Magic': '1:Hand Of The Acolyte/8:Dispelling Touch',
    'Nobility': '1:Inspiring Word/8:Noble Leadership',
    'Plant': '1:Wooden Fist/6:Bramble Armor',
    'Protection': '1:Resistance Bonus/1:Resistant Touch/8:Aura Of Protection',
    'Repose': '1:Gentle Rest/8:Ward Against Death',
    'Rune': '1:Scribe Scroll/1:Blast Rune/8:Spell Rune',
    'Strength': '1:Strength Rush/8:Might Of The Gods',
    'Sun': '1:Sun\'s Blessing/8:Nimbus Of Light',
    'Travel': '1:Travel Speed/1:Agile Feet/8:Dimensional Hop',
    'Trickery': '1:Copycat/8:Master\'s Illusion',
    'War': '1:Battle Rage/8:Weapon Master',
    'Water': '1:Icicle/6:Cold Resistance',
    'Weather': '1:Storm Burst/8:Lightning Lord'
  };
  var domainSpells = {
    'Air':
      'Obscuring Mist/Wind Wall/Gaseous Form/Air Walk/Control Winds/' +
      'Chain Lightning/Elemental Body IV/Whirlwind/Elemental Swarm',
    'Animal':
      'Calm Animals/Hold Animal/Dominate Animal/Summon Nature\'s Ally IV/' +
      'Beast Shape III/Antilife Shell/Animal Shapes/' +
      'Summon Nature\'s Ally VIII/Shapechange',
    'Artifice':
      'Animate Rope/Wood Shape/Stone Shape/Minor Creation/Fabricate/' +
      'Major Creation/Wall Of Iron/Instant Summons/Prismatic Sphere',
    'Chaos':
      'Protection From Law/Align Weapon/Magic Circle Against Law/' +
      'Chaos Hammer/Dispel Law/Animate Objects/Word Of Chaos/Cloak Of Chaos/' +
      'Summon Monster IX',
    'Charm':
      'Charm Person/Calm Emotions/Suggestion/Heroism/Charm Monster/' +
      'Geas+Quest/Insanity/Demand/Dominate Monster',
    'Community':
      'Bless/Shield Other/Prayer/Imbue With Spell Ability/Telepathic Bond/' +
      'Heroes\' Feast/Refuge/Mass Cure Critical Wounds/Miracle',
    'Darkness':
      'Obscuring Mist/Blindness+Deafness/Deeper Darkness/Shadow Conjuration/' +
      'Summon Monster V/Shadow Walk/Power Word Blind/' +
      'Greater Shadow Evocation/Shades',
    'Death':
      'Cause Fear/Death Knell/Animate Dead/Death Ward/Slay Living/' +
      'Create Undead/Destruction/Create Greater Undead/Wail Of The Banshee',
    'Destruction':
      'True Strike/Shatter/Rage/Inflict Critical Wounds/Shout/Harm/' +
      'Disintegrate/Earthquake/Implosion',
    'Earth':
      'Magic Stone/Soften Earth And Stone/Stone Shape/Spike Stones/' +
      'Wall Of Stone/Stoneskin/Elemental Body IV/Earthquake/Elemental Swarm',
    'Evil':
      'Protection From Good/Align Weapon/Magic Circle Against Good/' +
      'Unholy Blight/Dispel Good/Create Undead/Blasphemy/Unholy Aura/' +
      'Summon Monster IX',
    'Fire':
      'Burning Hands/Produce Flame/Fireball/Wall Of Fire/Fire Shield/' +
      'Fire Seeds/Elemental Body IV/Incendiary Cloud/Elemental Swarm',
    'Glory':
      'Shield Of Faith/Bless Weapon/Searing Light/Holy Smite/' +
      'Righteous Might/Undeath To Death/Holy Sword/Holy Aura/Gate',
    'Good':
      'Protection From Evil/Align Weapon/Magic Circle Against Evil/' +
      'Holy Smite/Dispel Evil/Blade Barrier/Holy Word/Holy Aura/' +
      'Summon Monster IX',
    'Healing':
      'Cure Light Wounds/Cure Moderate Wounds/Cure Serious Wounds/' +
      'Cure Critical Wounds/Breath Of Life/Heal/Regenerate/' +
      'Mass Cure Critical Wounds/Mass Heal',
    'Knowledge':
      'Comprehend Languages/Detect Thoughts/Speak With Dead/Divination/' +
      'True Seeing/Find The Path/Legend Lore/Discern Location/Foresight',
    'Law':
      'Protection From Chaos/Align Weapon/Magic Circle Against Chaos/' +
      'Order\'s Wrath/Dispel Chaos/Hold Monster/Dictum/Shield Of Law/' +
      'Summon Monster IX',
    'Liberation':
      'Remove Fear/Remove Paralysis/Remove Curse/Freedom Of Movement/' +
      'Break Enchantment/Greater Dispel Magic/Refuge/Mind Blank/Freedom',
    'Luck':
      'True Strike/Aid/Protection From Energy/Freedom Of Movement/' +
      'Break Enchantment/Mislead/Spell Turning/Moment Of Prescience/Miracle',
    'Madness':
      'Lesser Confusion/Touch Of Idiocy/Rage/Confusion/Nightmare/' +
      'Phantasmal Killer/Insanity/Scintillating Pattern/Weird',
    'Magic':
      'Identify/Magic Mouth/Dispel Magic/Imbue With Spell Ability/' +
      'Spell Resistance/Antimagic Field/Spell Turning/' +
      'Protection From Spells/Mage\'s Disjunction',
    'Nobility':
      'Divine Favor/Enthrall/Magic Vestment/Discern Lies/Greater Command/' +
      'Geas+Quest/Repulsion/Demand/Storm Of Vengeance',
    'Plant':
      'Entangle/Barkskin/Plant Growth/Command Plants/Wall Of Thorns/' +
      'Repel Wood/Animate Plants/Control Plants/Shambler',
    'Protection':
      'Sanctuary/Shield Other/Protection From Energy/Spell Immunity/' +
      'Spell Resistance/Antimagic Field/Repulsion/Mind Blank/Prismatic Sphere',
    'Repose':
      'Deathwatch/Gentle Repose/Speak With Dead/Death Ward/Slay Living/' +
      'Undeath To Death/Destruction/Waves Of Exhaustion/Wail Of The Banshee',
    'Rune':
      'Erase/Secret Page/Glyph Of Warding/Explosive Runes/' +
      'Lesser Planar Binding/Greater Glyph Of Warding/Instant Summons/' +
      'Symbol Of Death/Teleportation Circle',
    'Strength':
      'Enlarge Person/Bull\'s Strength/Magic Vestment/Spell Immunity/' +
      'Righteous Might/Stoneskin/Grasping Hand/Clenched Fist/Crushing Hand',
    'Sun':
      'Endure Elements/Heat Metal/Searing Light/Fire Shield/Flame Strike/' +
      'Fire Seeds/Sunbeam/Sunburst/Prismatic Sphere',
    'Travel':
      'Longstrider/Locate Object/Fly/Dimension Door/Teleport/Find The Path/' +
      'Greater Teleport/Phase Door/Astral Projection',
    'Trickery':
      'Disguise Self/Invisibility/Nondetection/Confusion/False Vision/' +
      'Mislead/Screen/Mass Invisibility/Time Stop',
    'War':
      'Magic Weapon/Spiritual Weapon/Magic Vestment/Divine Power/' +
      'Flame Strike/Blade Barrier/Power Word Blind/Power Word Stun/' +
      'Power Word Kill',
    'Water':
      'Obscuring Mist/Fog Cloud/Water Breathing/Control Water/Ice Storm/' +
      'Cone Of Cold/Elemental Body IV/Horrid Wilting/Elemental Swarm',
    'Weather':
      'Obscuring Mist/Fog Cloud/Call Lightning/Sleet Storm/Ice Storm/' +
      'Control Winds/Control Weather/Whirlwind/Storm Of Vengeance'
  };
  for(var i = 0; i < domains.length; i++) {
    var domain = domains[i];
    var notes = [];
    if(domain == 'Air') {
      notes = [
        'combatNotes.lightningArcFeature:' +
          "R30' touch attack for d6+%1 points %V/day",
        'saveNotes.electricityResistanceFeature:%V'
      ];
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
    } else if(domain == 'Animal') {
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'magicNotes.speakWithAnimalsFeature:' +
          '<i>Speak With Animals</i> %V rounds/day'
      ];
      rules.defineRule('animalCompanionClericLevel',
        'domains.Animal', '?', null,
        'levels.Cleric', '=', 'source >= 4 ? source - 3 : null'
      );
      rules.defineRule('animalCompanionMasterLevel',
        'animalCompanionClericLevel', '+=', null
      );
      rules.defineRule('magicNotes.speakWithAnimalsFeature',
        'levels.Cleric', '=', 'source + 3'
      );
      rules.defineRule
        ('classSkills.Knowledge (Nature)', 'domains.Animal', '=', '1');
    } else if(domain == 'Artifice') {
      notes = [
        'combatNotes.artificer\'sTouchFeature:' +
          'Touch attack on objects/constructs for d6+%1 damage %V/day',
        'combatNotes.dancingWeaponsFeature:' +
          'Add <i>dancing</i> to weapon for 4 rounds %V/day',
        'magicNotes.artificer\'sTouchFeature:<i>Mending</i> at will'
      ];
      rules.defineRule('combatNotes.artificer\'sTouchFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.artificer\'sTouchFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.dancingWeaponsFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
      );
    } else if(domain == 'Chaos') {
      notes = [
        'combatNotes.chaosBladeFeature:' +
          'Add <i>anarchic</i> to weapon for %1 rounds %V/day',
        'combatNotes.touchOfChaosFeature:' +
          'Touch attack %V/day causes target to take worse result of d20 ' +
          'rerolls for 1 round'
      ];
      rules.defineRule('combatNotes.chaosBladeFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
      );
      rules.defineRule('combatNotes.chaosBladeFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.touchOfChaosFeature',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Charm') {
      notes = [
        'magicNotes.charmingSmileFeature:' +
          'DC %V <i>Charm Person</i> %1 rounds/day',
        'magicNotes.addlingTouchFeature:' +
          'Touch attack dazes %V HD foe 1 round %1/day'
      ];
      rules.defineRule('magicNotes.charmingSmileFeature',
        'levels.Cleric', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.charmingSmileFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule
        ('magicNotes.addlingTouchFeature', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.addlingTouchFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Community') {
      notes = [
        'magicNotes.calmingTouchFeature:' +
          'Touch heals d6+%1 + removes fatigued/shaken/sickened %V/day',
        'saveNotes.unityFeature:Allies w/in 30 ft use your saving throw %V/day'
      ];
      rules.defineRule
        ('magicNotes.calmingTouchFeature', 'wisdomModifier', '=', 'source + 3');
      rules.defineRule
        ('magicNotes.calmingTouchFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule('saveNotes.unityFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
      );
    } else if(domain == 'Darkness') {
      notes = [
        'combatNotes.blind-FightFeature:' +
          'Reroll concealed miss, no bonus to invisible foe, no skill check ' +
          'on blinded full speed move',
        'combatNotes.touchOfDarknessFeature:' +
          'Touch attack causes 20% miss chance for %V rounds %1/day',
        'featureNotes.eyesOfDarknessFeature:' +
          'Normal vision in any lighting %V rounds/day'
      ];
      rules.defineRule('combatNotes.touchOfDarknessFeature',
        'levels.Cleric', '=', 'source >= 2 ? Math.floor(source / 2) : 1'
      );
      rules.defineRule('combatNotes.touchOfDarknessFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('featureNotes.eyesOfDarknessFeature',
        'levels.Cleric', '=', 'source >= 4 ? Math.floor(source / 2) : null'
      );
    } else if(domain == 'Death') {
      notes = [
        'combatNotes.bleedingTouchFeature:' +
          'Touch attack causes d6 damage/round %V rounds or until healed ' +
          '(DC 15) %1/day',
        'combatNotes.death\'sEmbraceFeature:Healed by channeled negative energy'
      ];
      rules.defineRule('combatNotes.bleedingTouchFeature',
        'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
      );
      rules.defineRule('combatNotes.bleedingTouchFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Destruction') {
      notes = [
        'combatNotes.destructiveAuraFeature:' +
           'Attacks w/in 30 ft +%V damage + critical confirmed %1 rounds/day',
        'combatNotes.destructiveSmiteFeature:+%V damage %1/day'
      ];
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
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Earth') {
      notes = [
        "magicNotes.acidDartFeature:R30' touch attack for d6+%1 points %V/day",
        'saveNotes.acidResistanceFeature:%V'
      ];
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
    } else if(domain == 'Evil') {
      notes = [
        'combatNotes.scytheOfEvilFeature:' +
          'Add <i>unholy</i> to weapon for %1 rounds %V/day',
        'combatNotes.touchOfEvilFeature:' +
          'Touch attack sickens for %V rounds %1/day'
      ];
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
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Fire') {
      notes = [
        'combatNotes.fireBoltFeature:' +
          "R30' touch attack for d6+%1 points %V/day",
        'saveNotes.fireResistanceFeature:%V'
      ];
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
    } else if(domain == 'Glory') {
      notes = [
        'magicNotes.divinePresenceFeature:' +
          'DC %V <i>Sanctuary</i> for allies w/in 30 ft %1 rounds/day',
        'magicNotes.touchOfGloryFeature:' +
           'Touch imparts +%V charisma check bonus %1/day',
        'magicNotes.undeadBaneFeature:+2 DC on energy channeled to harm undead'
      ];
      rules.defineRule('magicNotes.divinePresenceFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor(source / 2) : null',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.divinePresenceFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule
        ('magicNotes.touchOfGloryFeature', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.touchOfGloryFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Good') {
      notes = [
        'combatNotes.holyLanceFeature:' +
          'Add <i>holy</i> to weapon for %1 rounds %V/day',
        'magicNotes.touchOfGoodFeature:' +
          'Touch imparts +%V attack/skill/ability/save for 1 round %1/day'
      ];
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
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Healing') {
      notes = [
        'magicNotes.healer\'sBlessingFeature:%V% bonus on healed damage',
        'magicNotes.rebukeDeathFeature:' +
          'Touch creature below 0 HP to heal d4+%1 HP %V/day'
      ];
      rules.defineRule('magicNotes.healer\'sBlessingFeature',
        'levels.Cleric', '=', 'source >= 6 ? 50 : null'
      );
      rules.defineRule('magicNotes.rebukeDeathFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.rebukeDeathFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
    } else if(domain == 'Knowledge') {
      notes = [
        'magicNotes.remoteViewingFeature:' +
          'Level %V <i>Clairvoyance/clairaudience</i> for %1 rounds/day',
        'skillNotes.loreKeeperFeature:' +
          'Touch attack provides info as per %V Knowledge check'
      ];
      rules.defineRule(/classSkills.Knowledge/, 'domains.Knowledge', '=', '1');
      rules.defineRule('magicNotes.remoteViewingFeature',
        'levels.Cleric', '=', 'source >= 6 ? source : null'
      );
      rules.defineRule
        ('magicNotes.remoteViewingFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule('skillNotes.loreKeeperFeature',
        'levels.Cleric', '=', 'source + 15',
        'wisdomModifier', '+', null
      );
    } else if(domain == 'Law') {
      notes = [
        'combatNotes.staffOfOrderFeature:' +
          'Add <i>axiomatic</i> to weapon for %1 rounds %V/day',
        'magicNotes.touchOfLawFeature:' +
          'Touch imparts "take 11" on all d20 rolls for 1 round %V/day'
      ];
      rules.defineRule('combatNotes.staffOfOrderFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
      );
      rules.defineRule('combatNotes.staffOfOrderFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule
        ('magicNotes.touchOfLawFeature', 'wisdomModifier', '=', 'source + 3');
    } else if(domain == 'Liberation') {
      notes = [
        'magicNotes.freedom\'sCallFeature:' +
          'Allies w/in 30 ft unaffected by movement conditions %V rounds/day',
        'magicNotes.liberationFeature:Ignore movement impediments %V rounds/day'
      ];
      rules.defineRule('magicNotes.freedom\'sCallFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
      rules.defineRule
        ('magicNotes.liberationFeature', 'levels.Cleric', '=', null);
    } else if(domain == 'Luck') {
      notes = [
        'magicNotes.bitOfLuckFeature:' +
          'Touch imparts reroll d20 next round %V/day',
        'magicNotes.goodFortuneFeature:Reroll d20 %V/day'
      ];
      rules.defineRule('magicNotes.bitOfLuckFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.goodFortuneFeature',
        'levels.Cleric', '=', 'source >= 6 ? Math.floor(source / 6) : null'
      );
    } else if(domain == 'Madness') {
      notes = [
        'magicNotes.auraOfMadnessFeature:' +
          'DC Will %V 30 ft <i>Confusion</i> aura %1 rounds/day',
        'magicNotes.visionOfMadnessFeature:' +
          'Touch imparts +%V attack, save, or skill, -%1 others for 3 ' +
          'rounds %2/day'
      ];
      rules.defineRule('magicNotes.auraOfMadnessFeature',
        'levels.Cleric', '=', 'source>=8 ? 10 + Math.floor(source / 2) : null',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.auraOfMadnessFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.visionOfMadnessFeature',
        'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
      );
      rules.defineRule('magicNotes.visionOfMadnessFeature.1',
        'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
      );
      rules.defineRule('magicNotes.visionOfMadnessFeature.2',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Magic') {
      notes = [
        'combatNotes.handOfTheAcolyteFeature:' +
          'Melee weapon +%1 30 ft ranged attack %V/day',
        'magicNotes.dispellingTouchFeature:' +
          '<i>Dispel Magic</i> touch attack %V/day'
      ];
      rules.defineRule('combatNotes.handOfTheAcolyteFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.handOfTheAcolyteFeature.1',
        'baseAttack', '=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('magicNotes.dispellingTouchFeature',
        'levels.Cleric', '=', 'source>=8 ? Math.floor((source - 4) / 4) : null'
      );
    } else if(domain == 'Nobility') {
      notes = [
        'magicNotes.inspiringWordFeature:' +
          "R30' word imparts +2 attack/skill/ability/save to target for %V rounds %1/day",
        'skillNotes.nobleLeadershipFeature:+%V Leadership'
      ];
      rules.defineRule
        ('features.Leadership', 'skillNotes.nobleLeadershipFeature', '=', '1');
      rules.defineRule('magicNotes.inspiringWordFeature',
        'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
      );
      rules.defineRule('magicNotes.inspiringWordFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('skillNotes.nobleLeadershipFeature',
        'levels.Cleric', '=', 'source >= 8 ? 2 : null'
      );
    } else if(domain == 'Plant') {
      notes = [
        'combatNotes.brambleArmorFeature:' +
          'Thorny hide causes d6+%1 damage to striking foes %V/day',
        'combatNotes.woodenFistFeature:' +
          '+%V, no AOO unarmed attacks %1 rounds/day'
      ];
      rules.defineRule
        ('combatNotes.brambleArmorFeature', 'levels.Cleric', '=', null);
      rules.defineRule('combatNotes.brambleArmorFeature.1',
        'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
      );
      rules.defineRule('combatNotes.woodenFistFeature',
        'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
      );
      rules.defineRule('combatNotes.woodenFistFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Protection') {
      notes = [
        'magicNotes.auraOfProtectionFeature:' +
          'Allies w/in 30 ft +%V AC/%1 elements resistance %2 rounds/day',
        'magicNotes.resistantTouchFeature:' +
           'Touch transfers resistance bonus to ally for 1 minute %V/day',
        'saveNotes.resistanceBonusFeature:+%V saves'
      ];
      rules.defineRule('magicNotes.auraOfProtectionFeature',
        'levels.Cleric', '=', 'source>=8 ? Math.floor((source - 4) / 4) : null'
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
    } else if(domain == 'Repose') {
      notes = [
        'magicNotes.gentleRestFeature:Touch staggers %1 rounds %V/day',
        'magicNotes.wardAgainstDeathFeature:' +
          'Creatures w/in 30 ft immune to death effects/energy drain/' +
          'negative levels %V rounds/day'
      ];
      rules.defineRule
        ('magicNotes.gentleRestFeature', 'wisdomModifier', '=', 'source + 3');
      rules.defineRule
        ('magicNotes.gentleRestFeature.1', 'wisdomModifier', '=', null);
      rules.defineRule('magicNotes.wardAgainstDeathFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
    } else if(domain == 'Rune') {
      notes = [
        'magicNotes.blastRuneFeature:' +
          'Rune in adjacent square causes d6+%1 damage for %V rounds %2/day',
        'magicNotes.scribeScrollFeature:Create scroll of any known spell',
        'magicNotes.spellRuneFeature:Add known spell to Blast Rune'
      ];
      rules.defineRule
        ('magicNotes.blastRuneFeature', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.blastRuneFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.blastRuneFeature.2',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Strength') {
      notes = [
        'magicNotes.mightOfTheGodsFeature:+%V strength checks %1 rounds/day',
        'magicNotes.strengthRushFeature:' +
          'Touch imparts +%V melee attack/strength check bonus %1/day'
      ];
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
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Sun') {
      notes = [
        'magicNotes.sun\'sBlessingFeature:' +
          '+%V undead damage, negate channel resistance',
        'magicNotes.nimbusOfLightFeature:' +
          '30 ft radius <i>Daylight</i> does %V HP damage to undead %1 ' +
          'rounds/day'
      ];
      rules.defineRule
        ('magicNotes.sun\'sBlessingFeature', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.nimbusOfLightFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
      rules.defineRule('magicNotes.nimbusOfLightFeature.1',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
    } else if(domain == 'Travel') {
      notes = [
        'abilityNotes.travelSpeedFeature:+10 speed',
        'featureNotes.agileFeetFeature:' +
          'Unaffected by difficult terrain for 1 round %V/day',
        'magicNotes.dimensionalHopFeature:Teleport up to %V ft/day'
      ];
      rules.defineRule('speed', 'abilityNotes.travelSpeedFeature', '+', '10');
      rules.defineRule
        ('featureNotes.agileFeetFeature', 'wisdomModifier', '=', 'source + 3');
      rules.defineRule('magicNotes.dimensionalHopFeature',
        'levels.Cleric', '=', 'source >= 8 ? 10 * source : null'
      );
    } else if(domain == 'Trickery') {
      notes = [
        'magicNotes.copycatFeature:<i>Mirror Image</i> for %V rounds %1/day',
        'magicNotes.master\'sIllusionFeature:' +
          'DC %V 30 ft radius <i>Veil</i> %1 rounds/day'
      ];
      rules.defineRule('classSkills.Bluff', 'domains.Trickery', '=', '1');
      rules.defineRule('classSkills.Disguise', 'domains.Trickery', '=', '1');
      rules.defineRule('classSkills.Stealth', 'domains.Trickery', '=', '1');
      rules.defineRule('magicNotes.copycatFeature', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.copycatFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.master\'sIllusionFeature',
        'levels.Cleric', '=', 'source>=8 ? 10 + Math.floor(source / 2) : null',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.master\'sIllusionFeature.1', 'levels.Cleric', '=', null);
    } else if(domain == 'War') {
      notes = [
        'combatNotes.battleRageFeature:' +
          'Touch imparts +%V damage bonus for 1 round %1/day',
        'combatNotes.weaponMasterFeature:' +
          'Use additional combat feat %V rounds/day'
      ];
      rules.defineRule('combatNotes.battleRageFeature',
        'levels.Cleric', '=', 'Math.max(1, Math.floor(source / 2))'
      );
      rules.defineRule('combatNotes.battleRageFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.weaponMasterFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
    } else if(domain == 'Water') {
      notes = [
        "combatNotes.icicleFeature:R30' touch attack for d6+%1 points %V/day",
        'saveNotes.coldResistanceFeature:%V'
      ];
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
    } else if(domain == 'Weather') {
      notes = [
        'combatNotes.stormBurstFeature:' +
          "R30' touch attack for d6+%1 non-lethal + -2 attack %V/day",
        'magicNotes.lightningLordFeature:<i>Call Lightning</i> %V bolts/day'
      ];
      rules.defineRule('combatNotes.stormBurstFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.stormBurstFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.lightningLordFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
    } else
      continue;
    rules.defineChoice('domains', domain);
    if(domainFeatures[domain] != null) {
      var features = domainFeatures[domain].split('/');
      for(var j = 0; j < features.length; j++) {
        var pieces = features[j].split(':');
        var feature = pieces[pieces.length - 1];
        rules.defineRule
          ('clericFeatures.' + feature, 'domains.' + domain, '=', '1');
        if(pieces.length > 1 && pieces[0] > '1') {
          rules.defineRule('clericFeatures.' + feature,
            'levels.Cleric', '?', 'source >= ' + pieces[0]
          );
        }
        rules.defineRule
          ('features.' + feature, 'clericFeatures.' + feature, '=', '1');
      }
    }
    if(notes != null) {
      rules.defineNote(notes);
    }
    if(domainSpells[domain] != null) {
      var spells = domainSpells[domain].split('/');
      for(var j = 0; j < spells.length; j++) {
        var spell = spells[j].replace('+', '/');
        var school = Pathfinder.spellsSchools[spell];
        spell += '(' + domain + (j + 1) + ' ' + schools[school] + ')';
        rules.defineChoice('spells', spell);
      }
    }
  }

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
    'race', '=', 'source.match(/Gnome/) ? 3 : source.match(/Human/) ? 1 : 2'
  );
  rules.defineNote
    ('validationNotes.languageAllocation:%1 available vs. %2 allocated');
  rules.defineRule('validationNotes.languageAllocation.1',
    '', '=', '0',
    'languageCount', '+=', null
  );
  rules.defineRule('validationNotes.languageAllocation.2',
    '', '=', '0',
    /^languages\./, '+=', null
  );
  rules.defineRule('validationNotes.languageAllocation',
    'validationNotes.languageAllocation.1', '=', '-source',
    'validationNotes.languageAllocation.2', '+=', null
  );

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, notes;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Half Elf') {

      adjustment = '+2 any'; // Player's choice
      features = [
        'Adaptability', 'Elf Blood', 'Keen Senses', 'Low-Light Vision',
        'Multitalented', 'Resist Enchantment', 'Sleep Immunity'
      ];
      notes = [
        'featureNotes.adaptabilityFeature:Skill Focus bonus feat',
        'featureNotes.elfBloodFeature:Elf and human for racial effects',
        'featureNotes.low-LightVisionFeature:x%V normal distance in poor light',
        'featureNotes.multitalentedFeature:Two favored classes',
        'saveNotes.resistEnchantmentFeature:+2 vs. enchantment',
        'saveNotes.sleepImmunityFeature:Immune <i>Sleep</i>',
        'skillNotes.keenSensesFeature:+2 Perception',
        'validationNotes.adaptabilityFeatureFeats:Requires Skill Focus'
      ];
      rules.defineRule
        ('featCount.General', 'featureNotes.adaptabilityFeature', '+', '1');
      rules.defineRule('featureNotes.low-LightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low-Light Vision', '+', null
      );
      rules.defineRule('resistance.Enchantment',
        'saveNotes.resistEnchantmentFeature', '+=', '2'
      );
      rules.defineRule
        ('languages.Elven', 'race', '=', 'source.match(/Elf/) ? 1 : null');
      rules.defineRule('validationNotes.adaptabilityFeatureFeats',
        'features.Adaptability', '=', '-1',
        /feats.Skill Focus/, '+', '1',
        '', 'v', '0'
      );

    } else if(race == 'Half Orc') {

      adjustment = '+2 any'; // Player's choice
      features = [
        'Darkvision', 'Intimidating', 'Orc Blood', 'Orc Ferocity',
        'Weapon Familiarity (Orc Double Axe)',
        'Weapon Proficiency (Falchion/Greataxe)'
      ];
      notes = [
        'combatNotes.orcFerocityFeature:Fight 1 round below zero hit points',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'featureNotes.orcBloodFeature:Orc and human for racial effects',
        'skillNotes.intimidatingFeature:+2 Intimidate'
      ];
      rules.defineRule('featureNotes.darkvisionFeature',
        raceNoSpace + 'Features.Darkvision', '+=', '60'
      );
      rules.defineRule
        ('languages.Orc', 'race', '=', 'source.match(/Orc/) ? 1 : null');

    } else if(race.match(/Dwarf/)) {

      adjustment = '+2 constitution/+2 wisdom/-2 charisma';
      features = [
        'Darkvision', 'Defensive Training', 'Dwarf Hatred', 'Greed', 'Hardy',
        'Slow', 'Steady', 'Stability', 'Stonecunning',
        'Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)',
        'Weapon Proficiency (Battleaxe/Heavy Pick/Warhammer)'
      ];
      notes = [
        'abilityNotes.steadyFeature:No speed penalty in armor',
        'combatNotes.defensiveTrainingFeature:+4 AC vs. giant creatures',
        'combatNotes.dwarfHatredFeature:+1 attack vs. goblinoid/orc',
        'combatNotes.stabilityFeature:+4 CMD vs. Bull Rush/Trip',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'saveNotes.hardyFeature:+2 vs. poison/spells',
        'skillNotes.greedFeature:+2 Appraise involving precious metal/gems',
        'skillNotes.stonecunningFeature:' +
          '+2 Perception involving stone, automatic check w/in 10 ft'
      ];

      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'abilityNotes.steadyFeature', '^', '0'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        raceNoSpace + 'Features.Darkvision', '+=', '60'
      );
      rules.defineRule
        ('languages.Dwarven', 'race', '=', 'source.match(/Dwarf/) ? 1 : null');
      rules.defineRule
        ('resistance.Poison', 'saveNotes.hardyFeature', '+=', '2');
      rules.defineRule('resistance.Spell', 'saveNotes.hardyFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');

    } else if(race.match(/Elf/)) {

      adjustment = '+2 dexterity/+2 intelligence/-2 constitution';
      features = [
        'Elven Magic', 'Keen Senses', 'Low-Light Vision', 'Resist Enchantment',
        'Sleep Immunity', 'Weapon Familiarity (Elven Curve Blade)',
        'Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Longsword/Rapier/Shortbow)'
      ];
      notes = [
        'featureNotes.low-LightVisionFeature:x%V normal distance in poor light',
        'magicNotes.elvenMagicFeature:+2 vs. spell resistance',
        'saveNotes.resistEnchantmentFeature:+2 vs. enchantment',
        'saveNotes.sleepImmunityFeature:Immune <i>Sleep</i>',
        'skillNotes.elvenMagicFeature:' +
          '+2 Spellcraft to identify magic item properties',
        'skillNotes.keenSensesFeature:+2 Perception'
      ];
      rules.defineRule('featureNotes.low-LightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low-Light Vision', '+', null
      );
      rules.defineRule
        ('languages.Elven', 'race', '=', 'source.match(/Elf/) ? 1 : null');
      rules.defineRule('resistance.Enchantment',
        'saveNotes.resistEnchantmentFeature', '+=', '2'
      );

    } else if(race.match(/Gnome/)) {

      adjustment = '+2 constitution/+2 charisma/-2 strength';
      features = [
        'Defensive Training', 'Gnome Hatred', 'Gnome Magic', 'Keen Senses',
        'Low-Light Vision', 'Natural Spells', 'Obsessive', 'Resist Illusion',
        'Slow', 'Small', 'Weapon Familiarity (Gnome Hooked Hammer)'
      ];
      notes = [
        'combatNotes.defensiveTrainingFeature:+4 AC vs. giant creatures',
        'combatNotes.gnomeHatredFeature:+1 attack vs. goblinoid/reptilian',
        'combatNotes.smallFeature:+1 AC/attack, -1 CMD/CMB',
        'featureNotes.low-LightVisionFeature:x%V normal distance in poor light',
        'magicNotes.gnomeMagicFeature:+1 DC on illusion spells',
        'magicNotes.naturalSpellsFeature:%V 1/day as caster %1',
        'saveNotes.resistIllusionFeature:+2 vs. illusions',
        'skillNotes.keenSensesFeature:+2 Perception',
        'skillNotes.obsessiveFeature:+2 on choice of Craft/Profession',
        'skillNotes.smallFeature:+4 Stealth'
      ];

      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('combatManeuverBonus', 'combatNotes.smallFeature', '+', '-1');
      rules.defineRule
        ('combatManeuverDefense', 'combatNotes.smallFeature', '+', '-1');
      rules.defineRule('featureNotes.low-LightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low-Light Vision', '+', null
      );
      rules.defineRule
        ('languages.Gnome', 'race', '=', 'source.match(/Gnome/) ? 1 : null');
      rules.defineRule
        ('languages.Sylvan', 'race', '=', 'source.match(/Gnome/) ? 1 : null');
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'charisma', '?', 'source >= 11',
        raceNoSpace + 'Features.Natural Spells', '=',
        '"<i>Dancing Lights</i>/<i>Ghost Sound</i>/<i>Prestidigitation</i>/' +
        '<i>Speak With Animals</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1', 'level', '=', null);
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Illusion', 'saveNotes.resistIllusionFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');

    } else if(race.match(/Halfling/)) {

      adjustment = '+2 dexterity/+2 charisma/-2 strength';
      features = [
        'Fearless', 'Halfling Luck', 'Keen Senses', 'Slow', 'Small',
        'Sure-Footed', 'Weapon Familiarity (Halfling Sling Staff)',
        'Weapon Proficiency (Sling)'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack, -1 CMD/CMB',
        'saveNotes.fearlessFeature:+2 vs. fear',
        'saveNotes.halflingLuckFeature:+1 all saves',
        'skillNotes.keenSensesFeature:+2 Perception',
        'skillNotes.smallFeature:+4 Stealth',
        'skillNotes.sure-FootedFeature:+2 Acrobatics/Climb'
      ];
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('combatManeuverBonus', 'combatNotes.smallFeature', '+', '-1');
      rules.defineRule
        ('combatManeuverDefense', 'combatNotes.smallFeature', '+', '-1');
      rules.defineRule('languages.Halfling',
        'race', '=', 'source.match(/Halfling/) ? 1 : null'
      );
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

    } else if(race.match(/Human/)) {

      adjustment = '+2 any'; // Player's choice
      features = null;
      notes = null;
      rules.defineRule
        ('featCount.General', 'featureNotes.humanFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.humanFeatCountBonus',
        'race', '+=', 'source.match(/Human/) ? 1 : null'
      );
      rules.defineRule('skillNotes.humanSkillPointsBonus',
        'race', '?', 'source.match(/Human/)',
        'level', '=', null
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
    'Pathfinder Scribe Module Version ' + PATHFINDER_VERSION + '\n' +
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
    '    "Faction Freedom Fighter" to distinguish it from the halfling trait\n' +
    '    of the same name.\n' +
    '  </li><li>\n' +
    '    Use the animal companion editing fields to enter the creature\n' +
    '    types and names of Paladin mounts.\n'+
    '  </li><li>\n' +
    '    The distinction between feats and selectable features is\n' +
    '    arbitrary.  Selectable features could be treated as feats\n' +
    '    restricted to specific classes; however, doing so would\n' +
    '    significantly clutter up the feat selection list.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Scribe provides no place other than the notes section to enter\n' +
    '    mundane possessions like lanterns and rope. The same goes for\n' +
    '    physical description.\n' +
    '  </li><li>\n' +
    '    Scribe presently defines no way to add additional types of armor\n' +
    '    because of all the extra information that would need to be\n' +
    '    specified&#151;arcane spell failure percentage, AC bonus, max\n' +
    '    dexterity bonus, skill check penalty, etc.\n' +
    '  </li><li>\n' +
    '    Scribe has problems dealing with attributes containing an\n' +
    '    uncapitalized word.  This is why, e.g., Scribe defines the skills\n' +
    '    "Sleight Of Hand" and "Knowledge (Arcana)" instead of "Sleight of\n' +
    '    Hand" and "Knowledge (arcana)".  There are other occasions when\n' +
    '    Scribe is picky about case; when defining your own attributes,\n' +
    '    it\'s safest to follow the conventions Scribe uses.\n' +
    '  </li><li>\n' +
    '    The customRule interface is not very intuitive, making it more\n' +
    '    confusing to add new rules than it should be.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Scribe adds the dexterity modifier to attack throws for all\n' +
    '    weapons of characters with the Weapon Finesse feat, not just\n' +
    '    light weapons.\n' +
    '  </li><li>\n' +
    '    Scribe incorrectly validates the Mystic Theurge requirement of\n' +
    '    being able to cast 2nd-level arcane and divine spells.  It checks\n' +
    '    that the character is caster level 3 in each catetory, whereas\n' +
    '    some magic-using classes (e.g., Sorcerer) don\'t allow 2nd-level\n' +
    '    spells until a higher caster level.\n' +
    '  </li><li>\n' +
    '    Scribe lists the fly speed for a 9th-level Dragon Disciple as 30\n' +
    '    instead of the correct 60.\n'+
    '  </li><li>\n' +
    '    When an character ability score is modified, Scribe recalculates\n' +
    '    attributes based on that ability from scratch.  For example,\n' +
    '    bumping intelligence when a character reaches fourth level causes\n' +
    '    Scribe to recompute the number of skill points awarded at first\n' +
    '    level.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n';
};

/* Defines the rules related to character skills. */
Pathfinder.skillRules = function(rules, skills, subskills) {

  rules.defineNote(
    'skillNotes.armorSkillCheckPenalty:-%V dex- and str-based skills',
    'validationNotes.skillMaximum:' +
      'Points allocated to one or more skills exceed maximum',
    'validationNotes.skillAllocation:%1 available vs. %2 allocated'
  );
  rules.defineRule('maxAllowedSkillPoints', 'level', '=', null);
  rules.defineRule('maxAllocatedSkillPoints', /^skills\.[^\.]*$/, '^=', null);
  rules.defineRule('skillNotes.armorSkillCheckPenalty',
    'armor', '=', 'SRD35.armorsSkillCheckPenalties[source]',
    'shield', '+=', 'source == "None" ? 0 : ' +
                    'source == "Tower" ? 10 : ' +
                    'source.match(/Heavy/) ? 2 : 1'
  );
  rules.defineRule('skillPoints',
    '', '=', '0',
    'level', '^', null
  );
  rules.defineRule('validationNotes.skillMaximum',
    'maxAllocatedSkillPoints', '=', '-source',
    'maxAllowedSkillPoints', '+', 'source',
    '', 'v', '0'
  );
  rules.defineRule('validationNotes.skillAllocation.1',
    '', '=', '0',
    'skillPoints', '=', null
  );
  rules.defineRule('validationNotes.skillAllocation.2',
    '', '=', '0',
    /^skills\.[^\.]*$/, '+=', null
  );
  rules.defineRule('validationNotes.skillAllocation',
    'validationNotes.skillAllocation.1', '=', '-source',
    'validationNotes.skillAllocation.2', '+', null
  );

  var abilityNames = {
    'cha':'charisma', 'con':'constitution', 'dex':'dexterity',
    'int':'intelligence', 'str':'strength', 'wis':'wisdom'
  };

  var allSkills = [];
  for(var i = 0; i < skills.length; i++) {
    var pieces = skills[i].split(':');
    var skill = pieces[0];
    var skillSubskills = subskills[skill];
    if(skillSubskills == null) {
      allSkills[allSkills.length] = skill + ':' + pieces[1];
    } else if(skillSubskills != '') {
      skillSubskills = skillSubskills.split('/');
      for(var j = 0; j < skillSubskills.length; j++) {
        var subskill = skill + ' (' + skillSubskills[j] + ')';
        allSkills[allSkills.length] = subskill + ':' + pieces[1];
        rules.defineRule
          ('classSkills.' + subskill, 'classSkills.' + skill, '=', '1');
      }
    }
  }

  for(var i = 0; i < allSkills.length; i++) {
    var pieces = allSkills[i].split(':');
    var skill = pieces[0];
    var ability = pieces[1].replace(/\/.*/, '');
    var matchInfo;
    rules.defineChoice('skills', skill + ':' + pieces[1]);
    rules.defineRule('skillModifier.' + skill,
      'skills.' + skill, '=', null,
      'classSkills.' + skill, '+', '3'
    );
    rules.defineNote('skills.' + skill + ':(%1%2) %V (%3)');
    rules.defineRule('skills.' + skill + '.1', '', '=', '"' + ability + '"');
    rules.defineRule('skills.' + skill + '.2',
      '', '=', '";cc"',
      'classSkills.' + skill, '=', '""'
    );
    rules.defineRule
      ('skills.' + skill + '.3', 'skillModifier.' + skill, '=', null);
    if(abilityNames[ability] != null) {
      var modifier = abilityNames[ability] + 'Modifier';
      rules.defineRule('skillModifier.' + skill, modifier, '+', null);
      if(ability == 'dex' || ability == 'str') {
        rules.defineRule('skillModifier.' + skill,
          'skillNotes.armorSkillCheckPenalty', '+', '-source'
        );
      }
    }
    if(skill == 'Heal') {
      rules.defineChoice('goodies', 'Healer\'s Kit');
      rules.defineRule('skillNotes.goodiesHealAdjustment',
        'goodies.Healer\'s Kit', '+=', '2'
      );
      rules.defineRule
        ('skillModifier.Heal', 'skillNotes.goodiesHealAdjustment', '+', null);
    } else if(skill == 'Linguistics') {
      rules.defineRule('languageCount', 'skills.Linguistics', '+', null);
    }
  }

};

/* Defines the rules related to (optional) character traits. */
Pathfinder.traitRules = function(rules, traits) {

  for(var i = 0; i < traits.length; i++) {

    var pieces = traits[i].split(':');
    var trait = pieces[0];
    var matchInfo;
    var notes = null;

    if(trait == 'A Sure Thing') {
      notes = ['combatNotes.ASureThingFeature:+2 attack vs evil 1/day'];
    } else if(trait == 'Adopted') {
      notes = ['featureNotes.adoptedFeature:Family race traits available'];
    } else if(trait == 'Aid Allies') {
      notes = ['combatNotes.aidAlliesFeature:+1 aid another action'];
    } else if(trait == 'Anatomist') {
      notes = ['combatNotes.anatomistFeature:+1 critical hit rolls'];
    } else if(trait == 'Ancient Historian') {
      notes = [
        'skillNotes.ancientHistorianFeature:+1 Knowledge (History) or Linguistics, learn 1 ancient language'
      ];
    } else if(trait == 'Animal Friend') {
      notes = [
        'saveNotes.animalFriendFeature:+1 Will unhostile animal w/in 30 ft',
        'skillNotes.animalFriendFeature:Handle Animal is class skill'
      ];
      rules.defineRule('classSkills.Handle Animal',
        'skillNotes.animalFriendFeature', '=', '1'
      );
    } else if(trait == 'Apothecary') {
      notes = ['featureNotes.apothecaryFeature:Has reliable poisons source'];
    } else if(trait == 'Arcane Archivist') {
      notes = ['skillNotes.arcaneArchivistFeature:+1 Use Magic Device'];
      rules.defineRule('classSkills.Use Magic Device',
        'skillNotes.arcaneArchivistFeature', '=', '1'
      );
    } else if(trait == 'Armor Expert') {
      notes = ['skillNotes.armorExpertFeature:-1 armor skill check penalty'];
      rules.defineRule('skillNotes.armorSkillCheckPenalty',
        'skillNotes.armorExpertFeature', '+', '-1'
      );
    } else if(trait == 'Attuned To The Ancestors') {
      notes = [
        'magicNotes.attunedToTheAncestorsFeature:<i>Hide From Undead</i> %V rd 1/day'
      ];
      rules.defineRule('magicNotes.attunedToTheAncestorsFeature',
        'level', '=', 'Math.min(Math.floor(source / 2), 1)'
      );
    } else if(trait == 'Bad Reputation') {
      notes = ['skillNotes.badReputationFeature:+2 Intimidate'];
      rules.defineRule
        ('classSkills.Intimidate', 'skillNotes.badReputationFeature', '=', '1');
    } else if(trait == 'Balanced Offensive') {
      notes = [
        'combatNotes.balancedOffensiveFeature:Cleric-like elemental attack %V/day'
      ];
      rules.defineRule('combatNotes.balancedOffensiveFeature',
        'level', '=', '1 + Math.floor(source / 5)'
      );
    } else if(trait == 'Beastspeaker') {
      notes = [
        'skillNotes.beastspeakerFeature:+1 Wild Empathy; no penalty w/elemental animals'
      ];
    } else if(trait == 'Beneficient Touch') {
      notes = ['magicNotes.beneficientTouchFeature:Reroll healing 1s 1/day'];
    } else if(trait == 'Birthmark') {
      notes = ['saveNotes.birthmarkFeature:+2 vs. charm/compulsion'];
    } else if(trait == 'Bitter Nobleman') {
      notes = [
        'skillNotes.bitterNoblemanFeature:+1 choice of Bluff, Sleight Of Hand, Stealth'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Brute') {
      notes = ['skillNotes.bruteFeature:+1 Intimidate'];
      rules.defineRule
        ('classSkills.Intimidate', 'skillNotes.bruteFeature', '=', '1');
    } else if(trait == 'Bullied') {
      notes = ['combatNotes.bulliedFeature:+1 unarmed AOO attack'];
    } else if(trait == 'Bully') {
      notes = ['skillNotes.bullyFeature:+1 Intimidate'];
      rules.defineRule
        ('classSkills.Intimidate', 'skillNotes.bullyFeature', '=', '1');
    } else if(trait == 'Canter') {
      notes = ['skillNotes.canterFeature:+5 Bluff w/secret messages'];
    } else if(trait == 'Captain\'s Blade') {
      notes = [
        'skillNotes.captain\'sBladeFeature:+1 Acrobatics and Climb aboard ship'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Caretaker') {
      notes = ['skillNotes.caretakerFeature:+1 Heal'];
      rules.defineRule
        ('classSkills.Heal', 'skillNotes.caretakerFeature', '=', '1');
    } else if(trait == 'Charming') {
      notes = [
        'magicNotes.charmingFeature:+1 spell DC w/attracted creatures',
        'skillNotes.charmingFeature:+1 Bluff and Diplomacy w/attracted creatures'
      ];
    } else if(trait == 'Child Of Nature') {
      notes = [
        'skillNotes.childOfNatureFeature:+1 Survival finding food and water/Knowledge (Nature)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Child Of The Streets') {
      notes = ['skillNotes.childOfTheStreetsFeature:+1 Sleight Of Hand'];
      rules.defineRule('classSkills.Sleight Of Hand',
        'skillNotes.childOfTheStreetsFeature', '=', '1'
      );
    } else if(trait == 'Child Of The Temple') {
      notes = [
        'skillNotes.childOfTheTempleFeature:+1 Knowledge (Nobility)/Knowledge (Religion)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Classically Schooled') {
      notes = ['skillNotes.classicallySchooledFeature:+1 Spellcraft'];
      rules.defineRule('classSkills.Spellcraft',
        'skillNotes.classicallySchooledFeature', '=', '1'
      );
    } else if(trait == 'Comparative Religion') {
      notes = ['skillNotes.comparativeReligionFeature:+1 Knowledge (Religion)'];
      rules.defineRule('classSkills.Knowledge (Religion)',
        'skillNotes.comparativeReligionFeature', '=', '1'
      );
    } else if(trait == 'Courageous') {
      notes = ['saveNotes.courageousFeature:+2 vs. fear'];
    } else if(trait == 'Dangerously Curious') {
      notes = ['skillNotes.dangerouslyCuriousFeature:+1 Use Magic Device'];
      rules.defineRule('classSkills.Use Magic Device',
        'skillNotes.dangerouslyCuriousFeature', '=', '1'
      );
    } else if(trait == 'Deft Dodger') {
      notes = ['saveNotes.deftDodgerFeature:+1 Reflex'];
      rules.defineRule('save.Reflex', 'saveNotes.deftDodgerFeature', '+', '1');
    } else if(trait == 'Demon Hunter') {
      notes = [
        'skillNotes.demonHunterFeature:+3 Knowledge (Planes) wrt demons',
        'saveNotes.demonHunterFeature:+2 Will vs. demonic mental spells and effects'
      ];
    } else if(trait == 'Dervish') {
      notes = ['combatNotes.dervishFeature:+1 AC vs. move AOO'];
    } else if(trait == 'Desert Child') {
      notes = [
        'saveNotes.desertChildFeature:+4 heat stamina, +1 vs. fire effects'
      ];
    } else if(trait == 'Desert Shadow') {
      notes = ['skillNotes.desertShadowFeature:Full speed Stealth in desert'];
    } else if(trait == 'Devil\'s Mark') {
      notes = [
        'skillNotes.devil\'sMarkFeature:+2 Bluff, Diplomacy, Intimidate, Sense Motive with evil outsiders'
      ];
    } else if(trait == 'Devotee Of the Green') {
      notes = [
        'skillNotes.devoteeOfTheGreenFeature:+1 Knowledge (Geography)/Knowledge (Nature)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Dirty Fighter') {
      notes = ['combatNotes.dirtyFighterFeature:+1 damage when flanking'];
    } else if(trait == 'Divine Courtesan') {
      notes = [
        'skillNotes.divineCourtesanFeature:+1 Diplomacy to gather information/Sense Motive'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Divine Warrior') {
      notes = ['magicNotes.divineWarriorFeature:Enspelled weapons +1 Damage'];
    } else if(trait == 'Dunewalker') {
      notes = [
        'abilityNotes.dunewalkerFeature:Normal movement through sand',
        'saveNotes.dunewalkerFeature:+4 Fort vs heat'
      ];
    } else if(trait == 'Ear For Music') {
      notes = [
        'skillNotes.earForMusicFeature:+1 Perform choice/+2 Knowledge (Local) for art + music'
      ];
    } else if(trait == 'Ease Of Faith') {
      notes = ['skillNotes.easeOfFaithFeature:+1 Diplomacy'];
      rules.defineRule
        ('classSkills.Diplomacy', 'skillNotes.easeOfFaithFeature', '=', '1');
    } else if(trait == 'Eastern Mysteries') {
      notes = ['magicNotes.easternMysteriesFeature:+2 spell DC 1/day'];
    } else if(trait == 'Elven Reflexes') {
      notes = ['combatNotes.elvenReflexesFeature:+2 Initiative'];
      rules.defineRule
        ('initiative', 'combatNotes.elvenReflexesFeature', '+', '2');
    } else if(trait == 'Exile') {
      notes = ['combatNotes.exileFeature:+2 Initiative'];
      rules.defineRule('initiative', 'combatNotes.exileFeature', '+', '2');
    } else if(trait == 'Expert Duelist') {
      notes = ['combatNotes.expertDuelistFeature:+1 AC vs. single foe'];
      rules.defineRule
        ('armorClass', 'combatNotes.expertDuelestFeature', '+', '1');
    } else if(trait == 'Explorer') {
      notes = ['skillNotes.explorerFeature:+1 Survival'];
      rules.defineRule
        ('classSkills.Survival', 'skillNotes.explorerFeature', '=', '1');
    } else if(trait == 'Eyes And Ears Of The City') {
      notes = ['skillNotes.eyesAndEarsOfTheCityFeature:+1 Perception'];
      rules.defineRule('classSkills.Perception',
        'skillNotes.eyesAndEarsOfTheCityFeature', '=', '1'
      );
    } else if(trait == 'Faction Freedom Fighter') {
      notes = [
        'combatNotes.factionFreedomFighterFeature:+1 surprise attack',
        'skillNotes.factionFreedomFighterFeature:+1 Stealth'
      ];
    } else if(trait == 'Failed Apprentice') {
      notes = ['saveNotes.failedApprenticeFeature:+1 vs. arcane spells'];
    } else if(trait == 'Fashionable') {
      notes = [
        'skillNotes.fashionableFeature:+1 Bluff, Diplomacy, Sense Motive when well-dressed'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Fast-Talker') {
      notes = ['skillNotes.fast-TalkerFeature:+1 Bluff'];
      rules.defineRule
        ('classSkills.Bluff', 'skillNotes.fast-TalkerFeature', '=', '1');
    } else if(trait == 'Fencer') {
      notes = ['combatNotes.fencerFeature:+1 attack on AOO with blades'];
    } else if(trait == 'Fiendish Presence') {
      notes = ['skillNotes.fiendishPresenceFeature:+1 Diplomacy/Sense Motive'];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Fires Of Hell') {
      notes = [
        'combatNotes.firesOfHellFeature:Flaming blade +1 Damage for %V rd 1/day'
      ];
      rules.defineRule
        ('combatNotes.firesOfHellFeature', 'charismaModifier', '=', null);
    } else if(trait == 'Flame Of The Dawnflower') {
      notes = [
        'combatNotes.flameOfTheDawnflowerFeature:+2 scimitar critical damage'
      ];
    } else if(trait == 'Focused Mind') {
      notes = ['magicNOtes.focustMindFeature:+2 concentration checks'];
    } else if(trait == 'Force For Good') {
      notes = [
        'spellNotes.forceForGoodFeature:+1 caster level on good-aligned spells'
      ];
    } else if(trait == 'Forlorn') {
      notes = ['saveNotes.forlornFeature:+1 Fortitude'];
      rules.defineRule('save.Fortitude', 'saveNotes.forlornFeature', '+', '1');
    } else if(trait == 'Fortified') {
      notes = [
        'combatNotes.fortifiedFeature:20% chance to negate critical hit or sneak attack 1/day'
      ];
    } else if(trait == 'Fortified Drinker') {
      notes = [
        'saveNotes.fortifiedDrinkerFeature:+2 vs mental effect for 1 hr after drinking'
      ];
    } else if(trait == 'Freedom Fighter') {
      notes = [
        'combatNotes.freedomFighterFeature:+1 attack during escape',
        'skillNotes.freedomFighterFeature:+1 skills during escape'
      ];
      rules.defineRule('classSkills.Escape Artist',
        'skillNotes.halflingFreedomFighterFeature', '=', '1'
      );
    } else if(trait == 'Gifted Adept') {
      notes = ['magicNotes.giftedAdeptFeature:+1 caster level on chosen spell'];
    } else if(trait == 'Gold Finger') {
      notes = [
        'skillNotes.goldFingerFeature:+1 Disable Device/Sleight Of Hand'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Goldsniffer') {
      notes = [
        'skillNotes.goldsnifferFeature:+2 Perception wrt metals, jewels, gems'
      ];
    } else if(trait == 'Greasy Palm') {
      notes = ['10% discount on bribes'];
    } else if(trait == 'Guardian Of The Forge') {
      notes = [
        'skillNotes.guardianOfTheForgeFeature:+1 Knowledge (Engineering)/Knowledge (History)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Hedge Magician') {
      notes = [
        'magicNotes.hedgeMagicianFeature:Reduce magic craft cost by 5%'
      ];
    } else if(trait == 'Highlander') {
      notes = [
        'skillNotes.highlanderFeature:+1 Stealth/+2 in hilly and rocky areas'
      ];
      rules.defineRule
        ('classSkills.Stealth', 'skillNotes.highlanderFeature', '=', '1');
    } else if(trait == 'History Of Heresy') {
      notes = ['saveNotes.historyOfHeresyFeature:+1 vs. divine spells'];
    } else if(trait == 'Horse Lord') {
      notes = ['skillNotes.horseLordFeature:+2 Ride'];
      rules.defineRule
        ('classSkills.Ride', 'skillNotes.horseLordFeature', '=', '1');
    } else if(trait == 'Hunter\'s Eye') {
      notes = [
        'combatNotes.hunter\'sEyeFeature:No penalty for longbow/shortbow 2nd range increment'
      ];
      // NOTE Choice of above also becomes proficient
    } else if(trait == 'I Know A Guy') {
      notes = [
        'skillNotes.iKnowAGuyFeature:+1 Knowledge (Local)/+2 Diplomacy to gather information'
      ];
    } else if(trait == 'Impressive Presence') {
      notes = [
        'combatNotes.impressivePresenceFeature:Adjacent foes DC %V Will save or shaken for 1 rd 1/day'
      ];
      rules.defineRule('combatNotes.impressivePresenceFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
    } else if(trait == 'Indomitable') {
      notes = ['saveNotes.indomitableFeature:+1 vs. enchantment'];
    } else if(trait == 'Indomitable Faith') {
      notes = ['saveNotes.indomitableFaithFeature:+1 Will'];
      rules.defineRule
        ('save.Will', 'saveNotes.indomitableFaithFeature', '+', '1');
    } else if(trait == 'Influential') {
      notes = [
        'magicNotes.influentialFeature:+1 DC on language-dependent spell 1/day',
        'skillNotes.influentialFeature:+3 Diplomacy for requests'
      ];
    } else if(trait == 'Insider Knowledge') {
      notes = [
        'skillNotes.insiderKnowledgeFeature:+1 choice of Diplomacy, Knowledge (Local)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Killer') {
      notes = ['combatNotes.killerFeature:Extra damage on critical hit'];
    } else if(trait == 'Librarian') {
      notes = [
        'skillNotes.librarianFeature:+1 Linguistics/Profession (Librarian)/+1 reading bonus 1/day'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Log Roller') {
      notes = [
        'combatNotes.logRollerFeature:+1 CMD vs. trip',
        'skillNotes.logRollerFeature:+1 Acrobatics'
      ];
    } else if(trait == 'Lore Seeker') {
      notes = [
        'magicNotes.loreSeekerFeature:+1 caster level on 3 spells',
        'skillNotes.loreSeekerFeature:+1 Knowledge (Arcana)'
      ];
      rules.defineRule('classSkills.Knowledge (Arcana)',
        'skillNotes.loreSeekerFeature', '=', '1'
      );
    } else if(trait == 'Loyalty') {
      notes = ['saveNotes.loyaltyFeature:+1 vs enchantment'];
    } else if(trait == 'Magic Is Life') {
      notes = [
        'saveNotes.magicIsLifeFeature:+2 vs. death effects when enspelled/stabilize automatically'
      ];
    } else if(trait == 'Magical Knack') {
      notes = ['magicNotes.magicalKnackFeature:+2 caster level (max %V)'];
      rules.defineRule('magicNotes.magicalKnackFeature', 'level', '=', null);
    } else if(trait == 'Magical Lineage') {
      notes = [
        'magicNotes.magicalLineageFeature:-1 spell level for chosen spell metamagic'
      ];
    } else if(trait == 'Magical Talent') {
      notes = ['magicNotes.magicalTalentFeature:Use chosen cantrip 1/day'];
    } else if(trait == 'Master Of Pentacles') {
      notes = [
        'magicNotes.masterOfPentaclesFeature:+2 Conjuration spell caster level 1/day'
      ];
    } else if(trait == 'Mathematical Prodigy') {
      notes = [
        'skillNotes.mathematicalProdigyFeature:+1 Knowledge (Arcana)/Knowledge (Engineering)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Medic') {
      notes = [
        'magicNotes.medicFeature:+1 caster level with <i>Remove</i> healing',
        'skillNotes.medicFeature:+2 Heal vs. disease, poison'
      ];
    } else if(trait == 'Meridian Strike') {
      notes = ['combatNotes.meridianStrikeFeature:Reroll crit damage 1s 1/day'];
    } else if(trait == 'Meticulous Artisan') {
      notes = ['skillNotes.meticulousArtisanFeature:+1 Craft for Day Job'];
    } else if(trait == 'Militia Veteran') {
      notes = [
        'skillNotes.militiaVeteranFeature:+1 choice of Profession (Soldier), Ride, Survival'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Mind Over Matter') {
      notes = ['saveNotes.mindOverMatterFeature:+1 Will'];
      rules.defineRule
        ('save.Will', 'saveNotes.mindOverMatterFeature', '+', '1');
    } else if(trait == 'Missionary') {
      notes = [
        'magicNotes.missionaryFeature:+1 caster level on 3 spells',
        'skillNotes.missionaryFeature:+1 Knowledge (Religion)'
      ];
      rules.defineRule('classSkills.Knowledge (Religion)',
        'skillNotes.missionaryFeature', '=', '1'
      );
    } else if(trait == 'Mummy-Touched') {
      notes = ['saveNotes.mummy-TouchedFeature:+2 vs. curse, disease'];
    } else if(trait == 'Natural Negotiator') {
      notes = [
        'featureNotes.naturalNegotiatorFeature:Additional language, Diplomacy or Handle Animal is a class skill'
      ];
    } else if(trait == 'Natural-Born Leader') {
      notes = [
        'featureNotes.natural-BornLeaderFeature:+1 Leadership score',
        'saveNotes.natural-BornLeaderFeature:+1 followers\' Will vs. mind-altering effects'
      ];
    } else if(trait == 'Observant') {
      notes = [
        'skillNotes.observantFeature:+1 choice of Perception, Sense Motive'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Outcast') {
      notes = ['skillNotes.outcastFeature:+1 Survival'];
      rules.defineRule
        ('classSkills.Survival', 'skillNotes.outcastFeature', '=', '1');
    } else if(trait == 'Patient Optimist') {
      notes = [
        'skillNotes.patientOptimistFeature:+1 Diplomacy, 1 retry on unfriendly + hostile'
      ];
    } else if(trait == 'Performance Artist') {
      notes = ['skillNotes.performanceArtistFeature:+1 Perform choice'];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Planar Voyager') {
      notes = [
        'combatNotes.planarVoyagerFeature:+1 Initiative off PM plane',
        'saveNotes.planarVoyagerFeature:+1 saves off PM plane',
      ];
    } else if(trait == 'Poverty-Stricken') {
      notes = ['skillNotes.poverty-StrickenFeature:+1 Survival'];
      rules.defineRule('classSkills.Survival',
        'skillNotes.poverty-StrickenFeature', '=', '1'
      );
    } else if(trait == 'Proper Training') {
      notes = [
        'skillNotes.observantFeature:+1 choice of Knowledge (Geography), Knowledge (History)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Rapscallion') {
      notes = [
        'combatNotes.rapscallionFeature:+1 Initiative',
        'skillNotes.rapscallionFeature:+1 Escape Artist'
      ];
      rules.defineRule
        ('initiative', 'combatNotes.rapscallionFeature', '+', '1');
    } else if(trait == 'Reactionary') {
      notes = ['combatNotes.reactionaryFeature:+2 Initiative'];
      rules.defineRule
        ('initiative', 'combatNotes.reactionaryFeature', '+', '2');
    } else if(trait == 'Reverent Wielder') {
      notes = [
        'combatNotes.reverentWielderFeature:+1 disarm, steal, sunder CMD',
        'saveNotes.reverentWielderFeature:Equipment +1 saves'
      ];
    } else if(trait == 'Resilient') {
      notes = ['saveNotes.resilientFeature:+1 Fortitude'];
      rules.defineRule
        ('save.Fortitude', 'saveNotes.resilientFeature', '+', '1');
    } else if(trait == 'Rich Parents') {
      notes = ['featureNotes.richParentsFeature:Starts w/900 GP'];
    } else if(trait == 'River Rat') {
      notes = [
        'combatNotes.riverRatFeature:+1 damage w/daggers',
        'skillNotes.riverRatFeature:+1 Swim'
      ];
      rules.defineRule
        ('classSkills.Swim', 'skillNotes.riverRatFeature', '=', '1');
    } else if(trait == 'Rousing Oratory') {
      notes = [
        'DC 15 on Perform choice gives allies w/in 60\' +1 or better vs. fear for 5 min 1/day'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Sacred Conduit') {
      notes = ['magicNotes.sacredConduitFeature:+1 channeled energy save DC'];
    } else if(trait == 'Sacred Touch') {
      notes = ['magicNotes.sacredTouchFeature:Touch stabilizes'];
    } else if(trait == 'Savanna Child') {
      notes = [
        'skillNotes.savannaChildFeature:+1 choice of Handle Animal, Knowledge (Nature), Ride'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Scholar Of Balance') {
      notes = [
        'skillNotes.scholarOfBalanceFeature:+1 Knowledge (Nature)/Knowledge (Planes)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Scholar Of Ruins') {
      notes = [
        'skillNotes.scholarOfRuinsFeature:+1 Knowledge (Dungeoneering)/Knowledge (Geography)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Scholar Of The Great Beyond') {
      notes = [
        'skillNotes.scholarOfTheGreatBeyondFeature:+1 Knowledge (History)/Knowledge (Planes)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Secrets Of The Sphinx') {
      notes = [
        'skillNotes.secretsOfTheSphinxFeature:+2 Knowledge check 1/day'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Shadow Diplomat') {
      notes = [
        'skillNotes.shadowDiplomatFeature:+1 Diplomacy'
      ];
      rules.defineRule
        ('classSkill.Diplomacy', 'skillNotes.shadowDiplomatFeature', '=', '1');
    } else if(trait == 'Sherrif') {
      notes = [
        'skillNotes.sherrifFeature:+10 local Bluff, Diplomacy, Intimidate 1/session'
      ];
    } else if(trait == 'Shiv') {
      notes = ['combatNotes.shivFeature:+1 surprise piercing/slashing damage'];
    } else if(trait == 'Skeptic') {
      notes = ['saveNotes.skepticFeature:+2 vs. illusions'];
    } else if(trait == 'Smuggler') {
      notes = ['skillNotes.smugglerFeature:+3 Sleight Of Hand to hide object'];
      rules.defineRule('classSkill.Sleight Of Hand',
        'skillNotes.smugglerFeature', '=', '1'
      );
    } else if(trait == 'Soul Drinker') {
      notes = [
        'combatNotes.soulDrinkerFeature:Gain HP equal to slain foe\'s hit dice for 1 min 1/day'
      ];
    } else if(trait == 'Starchild') {
      notes = ['skillNotes.starchildFeature:+4 Survival to avoid being lost'];
    } else if(trait == 'Storyteller') {
      notes = [
        'skillNotes.storytellerFeature:+%V Knowledge choice check 1/scenario'
      ];
      rules.defineRule('skillNotes.storytellerFeature',
        'intelligenceModifier', '=', 'Math.min(1, source + 3)'
      );
    } else if(trait == 'Suspicious') {
      notes = ['skillNotes.suspiciousFeature:+1 Sense Motive'];
      rules.defineRule
        ('classSkills.Sense Motive', 'skillNotes.suspiciousFeature', '=', '1');
    } else if(trait == 'Tavern Owner') {
      notes = ['featureNotes.tavernOwnerFeature:10% extra from treasure sale'];
    } else if(trait == 'Teaching Mistake') {
      notes = [
        'saveNotes.teachingMistakeFeature:+1 save after nat 1 roll 1/scenario'
      ];
    } else if(trait == 'Tireless') {
      notes = [
        'abilityNotes.tirelessFeature:+2 Con vs. nonlethal exertion/environ',
        'combatNotes.tirelessFeature:+1 HP'
      ];
      rules.defineRule('hitPoints', 'combatNotes.tirelessFeature', '+', '1');
    } else if(trait == 'Tomb Raider') {
      notes = [
        'skillNotes.tombRaiderFeature:+1 Knowledge (Dungeoneering)/Perception'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Trouper') {
      notes = [
        'saveNotes.trouperFeature:+1 vs. Perform-related abilities',
        'skillNotes.trouperFeature:+1 Perform choice'
      ];
    } else if(trait == 'Tunnel Fighter') {
      notes = [
        'combatNotes.tunnelFighterFeature:+2 initiative, +1 critical damage underground'
      ];
    } else if(trait == 'Unflappable') {
      notes = [
        'saveNotes.unflappableFeature:+1 vs. fear',
        'skillNotes.unflappableFeature:+3 DC on foes\'s Intimidate'
      ];
    } else if(trait == 'Undead Slayer') {
      notes = ['combatNotes.undeadSlayerFeature:+1 Damage vs. undead'];
    } else if(trait == 'Upstanding') {
      notes = ['skillNotes.upstandingFeature:+1 Diplomacy/Sense Motive'];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Unorthodox Strategy') {
      notes = [
        'skillNotes.unorthodoxStrategyFeature:+2 Acrobatics move through threatened squares'
      ];
    } else if(trait == 'Vagabond Child') {
      notes = [
        'skillNotes.vagabondChildFeature:+1 choice of Disable Device, Escape Artist, Sleight Of Hand'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Veteran Of Battle') {
      notes = [
        'combatNotes.veteranOfBattleFeature:+1 Initiative, draw weapon during surprise round'
      ];
      rules.defineRule
        ('initiative', 'combatNotes.veteranOfBattleFeature', '+', '1');
    } else if(trait == 'Vindictive') {
      notes = [
        'combatNotes.vindictiveFeature:+1 damage vs. successful foe for 1 min 1/day'
      ];
    } else if(trait == 'Warrior Of Old') {
      notes = ['combatNotes.warriorOfOldFeature:+2 Initiative'];
      rules.defineRule
        ('initiative', 'combatNotes.warriorOfOldFeature', '+', '2');
    } else if(trait == 'Watchdog') {
      notes = [
        'skillNotes.watchdogFeature:+1 Sense Motive'
      ];
      rules.defineRule
        ('classSkill.Sense Motive', 'skillNotes.watchdogFeature', '=', '1');
    } else if(trait == 'Weapon Style') {
      notes = ['combatNotes.weaponStyleFeature:Proficient w/1 monk weapon'];
    } else if(trait == 'Well-Informed') {
      notes = [
        'skillNotes.well-InformedFeature:+1 Diplomacy to gather information/Knowledge (Local)'
      ];
      // NOTE Choice of above also becomes class skill
    } else if(trait == 'Whistleblower') {
      notes = ['skillNotes.whistleblowerFeature:+1 Sense Motive'];
      rules.defineRule('classSkill.Sense Motive',
        'skillNotes.whistleblowerFeature', '=', '1'
      );
    } else if(trait == 'Wisdom In The Flesh') {
      notes = [
        'skillNotes.wisdomInTheFleshFeature:Use Wis modifier for chosen Str/Con/Dex skill'
      ];
    } else if(trait == 'World Traveler') {
      notes = [
        'skillNotes.worldTravelerFeature:+1 choice of Diplomacy, Knowledge (Local), Sense Motive'
      ];
      // NOTE Choice of above also becomes class skill
    }

    rules.defineChoice('traits', trait + ':' + pieces[1]);
    rules.defineRule('features.' + trait, 'traits.' + trait, '=', null);
    if(notes != null)
      rules.defineNote(notes);

  }

  rules.defineEditorElement('traits', 'Traits', 'fset', 'traits', 'skills');
  rules.defineSheetElement('Traits', 'Feats+', null, '; ');

}

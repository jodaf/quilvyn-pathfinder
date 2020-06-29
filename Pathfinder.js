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

  Pathfinder.abilityRules(rules);
  Pathfinder.identityRules(
    rules, Pathfinder.ALIGNMENTS, Pathfinder.CLASSES, Pathfinder.DEITIES,
    Pathfinder.GENDERS, Pathfinder.RACES, Pathfinder.FACTIONS, Pathfinder.TRAITS
  );
  Pathfinder.talentRules
    (rules, Pathfinder.FEATS, Pathfinder.FEATURES, Pathfinder.LANGUAGES,
     Pathfinder.SKILLS);
  Pathfinder.combatRules
    (rules, Pathfinder.ARMORS, Pathfinder.SHIELDS, Pathfinder.WEAPONS);
  Pathfinder.magicRules
    (rules, Pathfinder.DOMAINS, Pathfinder.SCHOOLS, Pathfinder.SPELLS);
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

Pathfinder.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
Pathfinder.ANIMAL_COMPANIONS = {
  // Attack, Dam, AC include all modifiers
  'Ape': 'Attack=1 AC=14 Dam=2@1d4+1,1d4+1 Str=13 Dex=17 Con=10 Int=2 Wis=12 Cha=7 Size=M',
  'Badger': 'Attack=1 AC=16 Dam=1d4 Str=10 Dex=17 Con=15 Int=2 Wis=12 Cha=10 Size=S',
  'Bear': 'Attack=3 AC=15 Dam=2@1d3+2,1d4+2 Str=15 Dex=15 Con=13 Int=2 Wis=12 Cha=6 Size=S',
  'Boar': 'Attack=2 AC=18 Dam=1d6+1 Str=13 Dex=12 Con=15 Int=2 Wis=13 Cha=4 Size=S',
  'Camel': 'Attack=3 AC=13 Dam=1d4+4 Str=18 Dex=16 Con=14 Int=2 Wis=11 Cha=4 Size=L',
  'Cheetah': 'Attack=2 AC=17 Dam=2@1d2+1,1d4+1 Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6 Size=S',
  'Constrictor': 'Attack=2 AC=15 Dam=1d3+2 Str=15 Dex=17 Con=13 Int=1 Wis=12 Cha=2 Size=M',
  'Crocodile': 'Attack=3 AC=17 Dam=1d6+2 Str=15 Dex=14 Con=15 Int=1 Wis=12 Cha=2 Size=S',
  'Deinonychus': 'Attack=1 AC=15 Dam=2@1d6,1d4 Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14 Size=S',
  'Dog': 'Attack=2 AC=16 Dam=1d4+1 Str=13 Dex=17 Con=15 Int=2 Wis=12 Cha=6 Size=S',
  'Eagle': 'Attack=1 AC=14 Dam=2@1d4,1d4 Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 Size=S',
  'Hawk': 'Attack=1 AC=14 Dam=2@1d4,1d4 Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 Size=S',
  'Horse': 'Attack=2 AC=14 Dam=2@1d6+3,1d4+3 Str=16 Dex=13 Con=15 Int=2 Wis=12 Cha=6 Size=L',
  'Leopard': 'Attack=2 AC=17 Dam=2@1d2+1,1d4+1 Str=12 Dex=21 Con=13 Int=2 Wis=12 Cha=6 Size=S',
  'Lion': 'Attack=1 AC=14 Dam=2@1d4+1,1d6+1 Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10 Size=M',
  'Owl': 'Attack=1 AC=14 Dam=2@1d4,1d4 Str=10 Dex=15 Con=12 Int=2 Wis=14 Cha=6 Size=S',
  'Pony': 'Attack=1 AC=13 Dam=2@1d3+1 Str=13 Dex=13 Con=12 Int=2 Wis=11 Cha=4 Size=M',
  'Shark': 'Attack=2 AC=17 Dam=1d4+1 Str=13 Dex=15 Con=15 Int=1 Wis=12 Cha=2 Size=S',
  'Tiger': 'Attack=1 AC=14 Dam=2@1d4+1,1d6+1 Str=13 Dex=17 Con=13 Int=2 Wis=15 Cha=10 Size=M',
  'Velociraptor': 'Attack=1 AC=15 Dam=2@1d6,1d4 Str=11 Dex=17 Con=17 Int=2 Wis=12 Cha=14 Size=S',
  'Viper': 'Attack=0 AC=16 Dam=1d3-1 Str=8 Dex=17 Con=11 Int=1 Wis=12 Cha=2 Size=S',
  'Wolf': 'Attack=1 AC=14 Dam=1d6+1 Str=13 Dex=15 Con=15 Int=2 Wis=12 Cha=6 Size=M'
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
  'Splint Mail':SRD35.ARMORS['Split Mail'] + ' AC=7',
  'Banded Mail':SRD35.ARMORS['Banded Mail'] + ' AC=7',
  'Half Plate':SRD35.ARMORS['Half Plate'] + ' AC=8',
  'Full Plate':SRD35.ARMORS['Full Plate'] + ' AC=9'
};
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
    'CasterLevelArcane=l ' +
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
      'B0:Dancing Lights;Daze;Detect Magic;Flare;Ghost Sound;Know Direction;' +
      'Light;Lullaby;Mage Hand;Mending;Message;Open/Close;Prestidigitation;' +
      'Read Magic;Resistance;Summon Instrument",' +
      'B1:Alarm;Animate Rope;Cause Fear;Charm Person;Comprehend Languages;' +
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
      '"1:Spontaneous Cleric Spell" ' +
    'CasterLevelDivine=l ' +
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
      'C9:17=1;18=2;19=3;20=4 ' +
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
      'Summon Monster V;Symbol Of Pain;Symbol of Sleep;True Seeing;Unhallow;' +
      'Wall Of Stone",' +
      '"C6:Animate Objects;Antilife Shell;Banishment;Blade Barrier;' +
      'Create Undead;Find The Path;Forbiddance;Geas/Quest;' +
      'Greater Dispel Magic;Greater Glyph Of Warding;Harm;Heal;' +
      'Heroes\' Feast;Mass Bear\'s Endurance;Mass Bull\'s Strength;' +
      'Mass Cure Moderate Wounds;Mass Eagle\'s Splendor;' +
      'Mass Inflict Moderate Wounds;Mass Owl\'s Wisdom;Planar Ally;' +
      'Summon Monster VI;Symbol Of Fear;Symbol Of Persuasion;' +
      'Undeath To Death;Wind Walk;Word of Recall",' +
      '"C7:Blasphemy;Control Weather;Destruction;Dictum;Ethereal Jaunt;' +
      'Greater Restoration;Greater Scrying;Holy Word;' +
      'Mass Cure Serious Wounds;Mass Inflict Serious Wounds;Refuge;' +
      'Regenerate;Repulsion;Resurrection;Summon Monster VII;' +
      'Symbol Of Stunning;Symbol Of Weakness;Word Of Chaos",' +
      '"C8:Antimagic Field;Cloak Of Chaos;Create Greater Undead;' +
      'Dimensional Lock;Discern Location;Earthquake;Fire Storm;' +
      'Greater Planar Ally;Greater Spell Immunity;Holy Aura;' +
      'Mass Cure Critical Wounds;Mass Inflict Critical Wounds;Shield Of Law;' +
      'Summon Monster VIII;Symbol Of Death;Symbol Of Insanity;Unholy AuraF",' +
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
      'D9:17=1;18=2;19=3;20=4',
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
      '"10:Spring Attack',
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
    'SpellAbility=charmisma ' +
    'SpellsPerDay=' +
      'P1:4=0;5=1;9=2;13=3;17=4,' +
      'P2:8=0;9=1;12=2;16=3;20=4,' +
      'P3:19=0;11=1;15=2;19=3,' +
      'P4:13=0;14=1;18=2;20=3',
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
      'R4:13=0;14=1;18=2;20=3',
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
      '10:Opportunist,"10:Skill Mastery","10:Slippery Mind',
  // TODO Dispelling Attack requires Major Magic requires Minor Magic
  'Sorcerer':
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",1:"Eschew Materials" ' +
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
      'W9:17=1;18=2;19=3;20=4'
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
    '"Summon Nature\'s Ally IV","Beast Shape III",,"Antilife Shell",' +
    '"Animal Shapes",Shapechange',
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
    '"Break Enchantment",Mislead,"Spell Turning","Moment Of Precsience",' +
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
  'Bat': 'Attack=6 HD=1 AC=16 Dam=1d3-5 Str=1 Dex=15 Con=6 Int=2 Wis=14 Cha=5 Size=D',
  'Cat': 'Attack=4 HD=1 AC=14 Dam=2@1d2-4,1d3-4 Str=3 Dex=15 Con=8 Int=2 Wis=12 Cha=7 Size=T',
  'Hawk': 'Attack=5 HD=1 AC=15 Dam=2@1d4-2 Str=6 Dex=17 Con=11 Int=2 Wis=14 Cha=7 Size=T',
  'Lizard': 'Attack=4 HD=1 AC=14 Dam=1d4-4 Str=3 Dex=15 Con=8 Int=1 Wis=12 Cha=2 Size=T',
  'Monkey': 'Attack=4 HD=1 AC=14 Dam=1d3-4 Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5 Size=T',
  'Owl': 'Attack=5 HD=1 AC=15 Dam=2@1d4-2 Str=6 Dex=17 Con=11 Int=2 Wis=15 Cha=6 Size=T',
  'Rat': 'Attack=4 HD=1 AC=14 Dam=1d3-4 Str=2 Dex=15 Con=11 Int=2 Wis=13 Cha=2 Size=T',
  'Raven': 'Attack=4 HD=1 AC=14 Dam=1d3-4 Str=2 Dex=15 Con=8 Int=2 Wis=15 Cha=7 Size=T',
  'Toad': 'Attack=0 HD=1 AC=15 Dam=0 Str=1 Dex=12 Con=6 Int=1 Wis=15 Cha=4 Size=D',
  'Viper': 'Attack=5 HD=1 AC=16 Dam=1d2-2 Str=4 Dex=17 Con=8 Int=1 Wis=13 Cha=2 Size=T',
  'Weasel': 'Attack=4 HD=1 AC=15 Dam=1d3-4 Str=3 Dex=15 Con=10 Int=2 Wis=12 Cha=5 Size=T',

  'Air Elemental': 'Attack=6 HD=2 AC=17 Dam=1d4+1 Str=12 Dex=17 Con=12 Int=4 Wis=11 Cha=11 Level=5 Size=S',
  'Dire Rat': 'Attack=1 HD=1 AC=14 Dam=1d4 Str=10 Dex=17 Con=13 Int=2 Wis=13 Cha=4 Level=3 Size=S',
  'Earth Elemental': 'Attack=6 HD=2 AC=17 Dam=1d6+4 Str=16 Dex=8 Con=13 Int=4 Wis=11 Cha=11 Level=5 Size=S',
  'Fire Elemental': 'Attack=4 HD=2 AC=16 Dam=1d4 Str=10 Dex=13 Con=10 Int=4 Wis=11 Cha=11 Level=5 Size=S',
  'Homunculus': 'Attack=3 HD=2 AC=14 Dam=1d4-1 Str=8 Dex=15 Con=0 Int=10 Wis=12 Cha=7 Level=7 Size=T',
  'Imp': 'Attack=8 HD=3 AC=17 Dam=1d4 Str=10 Dex=17 Con=10 Int=13 Wis=12 Cha=14 Level=7 Size=T',
  'Mephit': 'Attack=5 HD=3 AC=17 Dam=1d3+1 Str=13 Dex=15 Con=12 Int=6 Wis=11 Cha=14 Level=7 Size=S',
  'Pseudodragon': 'Attack=6 HD=2 AC=16 Dam=1d3-2,1d2-2 Str=7 Dex=15 Con=13 Int=10 Wis=12 Cha=10 Level=7 Size=T',
  'Quasit': 'Attack=7 HD=3 AC=16 Dam=1d3-1,1d4-1 Str=8 Dex=14 Con=11 Int=11 Wis=12 Cha=11 Level=7 Size=T',
  'Stirge': 'Attack=7 HD=1 AC=16 Dam=0 Str=3 Dex=19 Con=10 Int=1 Wis=12 Cha=6 Level=5 Size=M',
  'Water Elemental': 'Attack=5 HD=2 AC=17 Dam=1d6+3 Str=14 Dex=10 Con=13 Int=4 Wis=11 Cha=11 Level=5 Size=T'
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
    'Type=Fighter Require="level.Fighter >= 14,"features.Critical Focus"',
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
  // Domains
  'Lightning Arc':"combat:R30' touch 1d6+%1 HP %V/day",
  'Electricity Resistance':'save:%V',
  'Speak With Animals':'magic:<i>Speak With Animals</i> %V rd/day',
  "Artificer's Touch":[
    'combat:Touch attack on objects/constructs 1d6+%1 HP %V/day',
    'magic:<i>Mending</i> at will',
   ],
  'Dancing Weapons':'combat:Add <i>dancing</i> to weapon 4 rd %V/day',
  'Chaos Blade':'combat:Add <i>anarchic</i> to weapon %1 rd %V/day',
  'Touch Of Chaos':
    'combat:Touch attack %V/day causes target to take worse result of d20 rerolls 1 rd',
  'Charming Smile':'magic:DC %V <i>Charm Person</i> %1 rd/day',
  'Addling Touch':'magic:Touch attack dazes %V HD foe 1 rd %1/day',
  'Calming Touch':
    'magic:Touch heals 1d6+%1 HP, removes fatigued/shaken/sickened %V/day',
  'Unity':"save:Allies w/in 30' use your saving throw %V/day",
  'Touch Of Darkness':'combat:Touch attack causes 20% miss chance %V rd %1/day',
  'Eyes Of Darkness':'feature:Normal vision in any lighting %V rd/day',
  'Bleeding Touch':
    'combat:Touch attack causes 1d6 HP/rd %V rd or until healed (DC 15) %1/day',
  "Death's Embrace":'combat:Healed by channeled negative energy',
  'Destructive Aura':
    "combat:Attacks w/in 30' +%V damage + critical confirmed %1 rd/day",
  'Destructive Smite':'combat:+%V damage %1/day',
  'Acid Dart':"magic:R30' touch 1d6+%1 HP %V/day",
  'Acid Resistance':'save:%V',
  'Scythe Of Evil':'combat:Add <i>unholy</i> to weapon %1 rd %V/day',
  'Touch Of Evil':'combat:Touch attack sickens %V rd %1/day',
  'Fire Bolt':"combat:R30' touch 1d6+%1 HP %V/day",
  'Fire Resistance':'save:%V',
  'Divine Presence':
    "magic:DC %V <i>Sanctuary</i> for allies w/in 30' %1 rd/day",
  'Touch Of Glory':'magic:Touch imparts +%V charisma check bonus %1/day',
  'Undead Bane':'magic:+2 DC on energy channeled to harm undead',
  'Holy Lance':'combat:Add <i>holy</i> to weapon %1 rd %V/day',
  'Touch Of Good':
    'magic:Touch imparts +%V attack/skill/ability/save 1 rd %1/day',
  "Healer's Blessing":'magic:%V% bonus on healed damage',
  'Rebuke Death':'magic:Touch creature below 0 HP to heal 1d4+%1 HP %V/day',
  'Remote Viewing':'magic:<i>Clairaudience/Clairvoyance</i> %V rd/day',
  'Lore Keeper':'skill:Touch attack provides info as per %V Knowledge check',
  'Staff Of Order':'combat:Add <i>axiomatic</i> to weapon %1 rd %V/day',
  'Touch Of Law':'magic:Touch imparts "take 11" on all d20 rolls 1 rd %V/day',
  "Freedom's Call":
    "magic:Allies w/in 30' unaffected by movement conditions %V rd/day",
  'Liberation':'magic:Ignore movement impediments %V rd/day',
  'Bit Of Luck':'magic:Touch imparts reroll d20 next rd %V/day',
  'Good Fortune':'magic:Reroll d20 %V/day',
  'Aura Of Madness':"magic:30' <i>Confusion</i> aura %V rd/day",
  'Vision Of Madness':
    'magic:Touch imparts +%V attack, save, or skill, -%1 others 3 rd %2/day',
  'Hand Of The Acolyte':"combat:R30' +%V w/melee weapon %1/day",
  'Dispelling Touch':'magic:<i>Dispel Magic</i> touch attack %V/day',
  'Noble Leadership':'feature:+%V Leadership',
  'Inspiring Word':
    "magic:R30' word imparts +2 attack/skill/ability/save to target %V rd %1/day",
  'Bramble Armor':'combat:Thorny hide causes 1d6+%1 HP to striking foes %V/day',
  'Wooden Fist':'combat:+%V, no AOO unarmed attacks %1 rd/day',
  'Aura Of Protection':
    "magic:Allies w/in 30' +%V AC/%1 elements resistance %2 rd/day",
  'Resistant Touch':
    'magic:Touch transfers resistance bonus to ally 1 minute %V/day',
  'Resistance Bonus':'save:+%V saves',
  'Gentle Rest':'magic:Touch staggers %1 rd %V/day',
  'Ward Against Death':
    "magic:Creatures w/in 30' immune to death effects/energy drain/negative levels %V rd/day",
  'Blast Rune':'magic:Rune in adjacent square causes 1d6+%1 HP %V rd %2/day',
  'Spell Rune':'magic:Add known spell to Blast Rune',
  'Might Of The Gods':'magic:+%V strength checks %1 rd/day',
  'Strength Rush':
    'magic:Touch imparts +%V melee attack/strength check bonus %1/day',
  "Sun's Blessing":'magic:+%V undead damage, negate channel resistance',
  'Nimbus Of Light':
    "magic:30' radius <i>Daylight</i> does %V HP to undead %1 rd/day",
  'Travel Speed':'ability:+10 Speed',
  'Agile Feet':'feature:Unaffected by difficult terrain 1 rd %V/day',
  'Dimensional Hop':"magic:Teleport up to %V'/day",
  'Copycat':'magic:<i>Mirror Image</i> %V rd %1/day',
  "Master's Illusion":
    "magic:DC %V 30' radius <i>Veil</i> %1 rd/day",
  'Battle Rage':'combat:Touch imparts +%V damage bonus 1 rd %1/day',
  'Weapon Master':'combat:Use additional combat feat %V rd/day',
  'Icicle':"combat:R30' touch 1d6+%1 HP %V/day",
  'Cold Resistance':'save:%V',
  'Storm Burst':"combat:R30' touch 1d6+%1 HP non-lethal + -2 attack %V/day",
  'Lightning Lord':'magic:<i>Call Lightning</i> %V bolts/day',
  // Feats
  'Acrobatic':'skill:+%V Acrobatics/+%1 Fly',
  'Acrobatic Steps':"ability:Move through difficult terrain 20'/rd",
  'Agile Maneuvers':'combat:+%V CMB (dex instead of str)',
  'Alertness':'skill:+%V Perception/+%1 Sense Motive',
  'Alignment Channel (Chaos)':
    'combat:Channel Energy to heal or harm Chaos outsiders',
  'Alignment Channel (Evil)':
    'combat:Channel Energy to heal or harm Evil outsiders',
  'Alignment Channel (Good)':
    'combat:Channel Energy to heal or harm Good outsiders',
  'Alignment Channel (Law)':
    'combat:Channel Energy to heal or harm Law outsiders',
  'Animal Affinity':'skill:+%V Handle Animal/+%1 Ride',
  'Arcane Armor Mastery':'magic:Reduce armored casting penalty 10%',
  'Arcane Armor Training':'magic:Reduce armored casting penalty 10%',
  'Arcane Strike':'combat:Imbue weapons with +%V magic damage bonus 1 rd',
  'Athletic':'skill:+%V Climb/+%1 Swim',
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
  'Combat Expertise':'combat:-%V attack/+%1 AC',
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
  'Deceitful':'skill:+%V Bluff/+%1 Disguise',
  'Defensive Combat Training':'combat:+%V CMD',
  'Deft Hands':'skill:+%V Disable Device/+%1 Sleight Of Hand',
  'Disruptive':'combat:+4 foe defensive spell DC',
  'Dodge':'combat:+1 AC/CMD',
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
  'Fleet':'ability:+5 Speed in light/no armor',
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
  'Lightning Stance':'combat:50% concealment with 2 move/withdraw actions',
  'Lunge':"combat:-2 AC to increase melee range 5'",
  'Magical Aptitude':'skill:+%V Spellcraft/+%1 Use Magic Device',
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
  'Persuasive':'skill:+%V Diplomacy/+%1 Intimidate',
  'Pinpoint Targeting':'combat:Ranged attack ignores armor bonus',
  'Power Attack':'combat:-%V attack/+%1 damage',
  'Scorpion Style':'combat:Unarmed hit slows foe %V rd (DC %1 Fort neg)',
  'Selective Channeling':'magic:Avoid up to %V targets',
  'Self-Sufficient':'skill:+%V Heal/+%1 Survival',
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
  'Stealthy':'skill:+%V Escape Artist/+%1 Stealth',
  'Step Up':"combatNotes.stepUpFeature:Match foe's 5' step",
  'Strike Back':'combat:Attack attackers beyond reach',
  'Stunning Critical':'combat:Critical hit stuns 1d4 rd (DC %V Fort staggered)',
  'Stunning Fist':'combat:Foe DC %V Fortitude save or stunned %1/day',
  'Throw Anything':
    'combat:No penalty for improvised ranged weapon, +1 attack w/thrown splash',
  'Tiring Critical':'combat:Critical hit tires foe',
  'Toughness':'combat:+%V HP',
  'Turn Undead':
    'combat:Channel energy to cause undead panic, DC %V will save negates',
  'Two-Weapon Rend':'combat-WeaponRendFeature:Extra 1d10+%V HP from double hit',
  'Unseat':'combat:Bull Rush after hit w/lance to unseat mounted foe',
  'Vital Strike':'combat:2x base damage',
  'Wind Stance':"combat:20% concealment when moving > 5'",
  // Classes
  'Swift Foot':'ability:+5 Speed during rage',
  'Animal Fury':'combat:Bite attack %V+%1 during rage',
  'Guarded Stance':'combat:+%V AC during rage',
  'Knockback':'combat:Successful Bull Rush during rage %V HP',
  'Mighty Swing':'combat:Automatic critical 1/rage',
  'Moment Of Clarity':'combat:Rage effects suspended 1 rd',
  'No Escape':'combat:x2 speed 1/rage when foe withdraws',
  'Powerful Blow':'combat:+%V HP 1/rage',
  'Quick Reflexes':'combat:+1 AOO/rd during rage',
  'Rolling Dodge':'combat:+%V AC vs. ranged %1 rd during rage',
  'Roused Anger':'combat:Rage even if fatigued',
  'Strength Surge':'combat:+%V strength/combat maneuver check 1/rage',
  'Surprise Accuracy':'combat:+%V attack 1/rage',
  'Terrifying Howl':"combat:Howl DC %V will save w/in 30' or shaken 1d4+1 rd",
  'Unexpected Strike':'combat:AOO when foe enters threat 1/rage',
  'Night Vision':"feature:60' Darkvision during rage",
  'Scent':'feature:Detect creatures via smell',
  'Renewed Vigor':'magic:Heal %Vd8+%1 HP 1/day during rage',
  'Clear Mind':'save:Reroll Will save 1/rage',
  'Fearless Rage':'save:Cannot be shaken/frightened during rage',
  'Internal Fortitude':'save:Cannot be sickened/nauseated during rage',
  'Superstition':'save:+%V vs. spells, supernatural, spell-like abilities during rage',
  'Intimidating Glare':
    'skill:Successful Intimidate during rage shakes foe at least 1d4 rd',
  'Raging Climber':'skill:+%V Climb during rage',
  'Raging Leaper':'skill:+%V Acrobatics (jump) during rage',
  'Raging Swimmer':'skill:+%V Swim during rage',
  'Bardic Performance':'feature:Bardic Performance effect %V rd/day',
  'Deadly Performance':'magic:Target DC %V Will save or die',
  'Dirge Of Doom':"magic:Creatures w/in 30' shaken while performing",
  'Distraction':"magic:Perform check vs. visual magic w/in 30' 10 rd",
  'Frightening Tune':"magic:R30' DC %V Will <i>Cause Fear</i> via performance",
  'Soothing Performance':"magic:R30' <i>Mass Cure Serious Wounds</i> via performance",
  'Well-Versed':'save:+4 vs. bardic effects',
  'Bardic Knowledge':'skill:+%V all Knowledge, use any Knowledge untrained',
  'Jack Of All Trades':'skill:Use any skill untrained',
  'Lore Master':'skill:Take 10 on any ranked Knowledge skill, take 20 %V/day',
  'Versatile Performance':'skill:Substitute Perform ranking for associated skills',
  'Channel Energy':"magic:Heal/inflict %Vd6 HP 30' radius (DC %1 Will half) %2/day",
  'Armor Training':[
    'ability:No speed penalty in %V armor',
    'combat:Additional +%V Dex AC bonus',
    'skill:Reduce armor skill check penalty by %V'
  ],
  'Armor Mastery':'combat:DR 5/- when using armor/shield',
  'Weapon Mastery':
    'combat:Critical automatically hits, +1 damage multiplier, no disarm w/chosen weapon',
  'Weapon Training':'combat:Attack/damage bonus w/weapons from trained groups',
  'Bravery':'save:+%V vs. fear',
  'Ki Speed':'ability:Use 1 ki for +20',
  'Condition Fist':'combat:Stunning Fist may instead make target %V',
  'Flurry Of Blows':
    'combat:Full-round %V +%1 monk weapon attacks, use 1 ki for one more',
  'Ki Dodge':'combat:Use 1 ki for +4 AC',
  'Ki Pool':'feature:%V points refills w/8 hours rest',
  'Ki Strike':'combat:Unarmed attack is %V',
  'Maneuver Training':'combat:+%V CMB',
  'Monk Armor Class Adjustment':'combat:+%V AC/CMD',
  'Perfect Self':[
    'combat:DR 10/chaotic',
    'save:Treat as outsider for magic saves'
  ],
  'Quivering Palm':'combat:Foe makes DC %V Fortitude save or dies 1/day',
  'Abundant Step':'magic:Use 2 ki to <i>Dimension Door</i>',
  'Empty Body':'magic:Use 3 ki for 1 minute <i>Etherealness</i>',
  'Wholeness Of Body':'magic:Use 2 ki to heal %V HP to self',
  'High Jump':'skill:+%V Acrobatics (jump), use 1 ki for +20',
  'Aura Of Justice':"combat:Grant Smite Evil to allies w/in 10'",
  'Aura Of Righteousness':'combat:DR %V/evil',
  'Divine Weapon':'combat:Add %V enhancements to weapon %1 minutes %2/day',
  'Divine Mount':'feature:Magically summon mount %V/day',
  'Holy Champion':'magic:Maximize lay on hands, smite evil DC %V <i>Banishment</i>',
  'Lay On Hands':'magic:Harm undead or heal %Vd6 HP %1/day',
  'Mercy':'magic:Lay on hands removes additional effects',
  'Aura Of Resolve':"save:Immune charm, +4 to allies w/in 30'",
  'Aura Of Righteousness':"save:Immune compulsion, +4 to allies w/in 30'",
  'Favored Enemy':[
    'combat:+2 or more attack/damage vs. %V type(s) of creatures',
    'skill:+2 or more Bluff, Knowledge, Perception, Sense Motive, Survival vs. %V type(s) of creatures'
  ],
  'Favored Terrain':[
    'combat:+2 initiative in %V terrain type(s)',
    'skill:+2 Knowledge (Geography), Perception, Stealth, Survival, leaves no trail in %V terrain type(s)'
  ],
  'Companion Bond':"combat:Half favored enemy bonus to allies w/in 30' %V rd",
  'Master Hunter':
    'combat:Full attack vs. favored enemy requires DC %V Fortitude save or die',
  'Quarry':[
    'combat:+%V attack/automatic critical vs. target',
    'skill:Take %V to track target',
  ],
  'Camouflage':'skill:Hide in favored terrain',
  'Track':"skill:+%V Survival to follow creatures' trail",
  'Rogue Crawl':'ability:Crawl at half speed',
  'Bleeding Attack':'combat:Sneak attack causes extra %V HP/rd until healed',
  'Master Strike':'combat:Sneak attack target DC %V Fortitude or sleep/paralyze/die',
  'Resiliency':'combat:1 minute of %V temporary HP when below 0 HP 1/day',
  'Slow Reactions':'combat:Sneak attack target no AOO 1 rd',
  'Stand Up':'combat:Stand from prone as free action',
  'Surprise Attack':'combat:All foes flat-footed during surprise round',
  'Rogue Weapon Training':'feat:+1 Feat',
  'Dispelling Attack':'magic:Sneak attack acts as <i>Dispel Magic</i> on target',
  'Major Magic':'magic:Cast W1 spell 2/day',
  'Minor Magic':'magic:Cast W0 spell 3/day',
  'Fast Stealth':'skill:Use Stealth at full speed',
  'Ledge Walker':'skill:Use Acrobatics along narrow surfaces at full speed',
  'Quick Disable':'skill:Disable Device in half normal time',
  'Trap Spotter':"skill:Automatic Perception check w/in 10' of trap",
  'Trapfinding':'skill:+%V Perception (traps)/Disable Device (traps)',
  'Aberrant Form':[
    'combat:Immune critical hit/sneak attack, DR 5/-',
    "feature:Blindsight 60'"
  ],
  'Long Limbs':"combat:+%V' touch attack range",
  'Unusual Anatomy':'combat:%V% chance to ignore critical hit/sneak attack',
  'Acidic Ray':"magic:R30' %Vd6 HP %1/day",
  'Bloodline Aberrant':'magic:Polymorph spells last 50% longer',
  'Alien Resistance':'save:%V spell resistance',
  'Strength Of The Abyss':'ability:+%V strength',
  'Claws':'combat:%V+%1%3 HP %2 rd/day',
  'Demonic Might':"feature:Telepathy 60'",
  'Added Summonings':
    'magic:<i>Summon Monster</i> brings additional demon/fiendish creature',
  'Bloodline Abyssal':'magic:Summoned creatures gain DR %V/good',
  'Demonic Might':'save:10 acid/cold/fire',
  'Demonic Resistance':'save:%V electricity/%1 poison',
  'Arcane Apotheosis':'magic:Expend 3 spell slots to replace 1 magic item charge',
  'Bloodline Arcane':'magic:+1 boosted spell DC',
  'Bonded Object':'magic:Cast known spell through object',
  'Metamagic Adept':'magic:Applying metamagic feat w/out increased casting time %V/day',
  'New Arcane':'magic:%V additional spells',
  'School Power':'magic:+2 DC on spells from chosen school',
  'Wings Of Heaven':"ability:Fly 60'/good %V minutes/day",
  'Conviction':'feature:Reroll ability/attack/skill/save 1/day',
  'Heavenly Fire':'magic:Ranged touch heal good/harm evil 1d4+%V HP %1/day',
  'Bloodline Celestial':'magic:Summoned creatures gain DR %V/evil',
  'Ascension':[
    'magic:<i>Tongues</i> at will',
    'save:Immune petrification, 10 electricity/fire, +4 poison'
  ],
  'Celestial Resistances':'save:%V acid/cold',
  'Power Of Wyrms':'save:Immune paralysis/sleep',
  'Destiny Realized':[
    'combat:Critical hits confirmed, foe critical requires 20',
    'magic:Automatically overcome resistance 1/day'
  ],
  'It Was Meant To Be':'feature:Reroll attack/critical/spell resistance check %V/day',
  'Touch Of Destiny':'magic:Touched creature +%V attack/skill/ability/save 1 rd %1/day',
  'Bloodline Destined':'save:+spell level on saves 1 rd after casting personal spell',
  'Fated':
    'save:+%V saves when surprisedaveNotes.withinReachFeature:DC 20 Will save vs. fatal attack 1/day',
  'Wings':"ability:Fly %V'/average",
  'Breath Weapon':"combat:%3 %4 %Vd6 HP (%1 DC Reflex half) %2/day",
  'Dragon Resistances':[
    'combat:+%V AC',
    'save:%V vs. %1',
  ],
  'Blindsense':
    "feature:Other senses allow detection of unseen objects w/in %V'",
  'Bloodline Draconic':'magic:+1 damage/die on %V spells',
  'Elemental Movement':'ability:%V/rd',
  'Elemental Blast':"combat:R60' 20' radius %Vd6 HP %3 (DC %1 Reflex half) %2/day",
  'Elemental Body':'combat:Immune sneak attack, critical hit',
  'Bloodline Elemental':'magic:Change spell energy type to match own',
  'Elemental Ray':"magic:R30' 1d6+%1 HP %2 %V/day",
  'Elemental Resistance':'save:%V vs. %1',
  'Soul Of The Fey':'combat:Animals attack only if magically forced',
  'Bloodline Fey':'magic:+2 compulsion spell DC',
  'Fey Magic':'magic:Reroll any resistance check',
  'Fleeting Glance':'magic:<i>Greater Invisibility</i> %V rd/day',
  'Laughing Touch':'magic:Touch causes 1 rd of laughter %V/day',
  'Soul Of The Fey':[
    'magic:<i>Shadow Walk</i> 1/day',
    'save:Immune poison/DR 10/cold iron'
  ],
  'On Dark Wings':"ability:Fly 60'/average",
  'Power Of The Pit':"feature:Darkvision 60'",
  'Bloodline Infernal':'magic:+2 charm spell DC',
  'Corrupting Touch':'magic:Touch causes shaken %V rd %1/day',
  'Infernal Resistances':'save:%V fire/%1 poison',
  'Power Of The Pit':'save:10 acid/cold',
  'One Of Us':[
    'combat:Ignored by unintelligent undead',
    'save:Immune paralysis/sleep/+4 vs. undead\'s spells'
  ],
  'Grave Touch':'magic:Touch causes shaken/frightened %V rd %1/day',
  'Grasp Of The Dead':"magic:R60' 20' radius %Vd6 HP (DC %1 Reflex half) %2/day",
  'Incorporeal Form':'magic:Incorporeal %V rd 1/day',
  "Death's Gift":'save:%V cold/DR %1/- vs. non-lethal',
  'Hand Of The Apprentice':"combat:R30' +%V w/melee weapon %1/day",
  'Metamagic Mastery':'magic:Apply metamagic feat %V/day',
  'Protective Ward':"magic:+%V AC 10' radius %1/day",
  'Energy Absorption':'save:Ignore %V HP energy/day',
  'Energy Resistance':'save:%V chosen energy type',
  'Conjured Dart':'magic:Ranged touch 1d6+%1 HP %V/day',
  'Dimensional Steps':"magic:Teleport up to %V'/day",
  "Summoner's Charm":'magic:Summon duration increased %V rd',
  'Forewarned':'combat:+%V initiative, always act in surprise round',
  "Diviner's Fortune":
    'magic:Touched creature +%V attack/skill/ability/save 1 rd %1/day',
  'Scrying Adept':
    'magic:Constant <i>Detect Scrying</i>, +1 scrying subject familiarity',
  'Aura Of Despair':"magic:Foes w/in 30' -2 ability/attack/damage/save/skill %V rd/day",
  'Dazing Touch':'magic:Touch attack dazes %V HD foe 1 rd %1/day',
  'Enchantment Reflection':'save:Successful save reflects enchantment spells on caster',
  'Enchanting Smile':'skill:+%V Bluff/Diplomacy/Intimidate',
  'Elemental Wall':'magic:<i>Wall Of Fire</i>/acid/cold/electricity %V rd/day',
  'Force Missile':'magic:<i>Magic Missile</i> 1d4+%V HP %1/day',
  'Intense Spell':'magic:+%V evocation spell damage',
  'Penetrating Spells':'magic:Best of two rolls to overcome spell resistance',
  'Blinding Ray':'magic:Ranged touch blinds/dazzles 1 rd %V/day',
  'Extended Illusions':'magic:Illusion duration increased %V rd',
  'Invisibility Field':'magic:<i>Greater Invisibility</i> %V rd/day',
  'Life Sight':'feature:%V blindsight for living/undead',
  'Power Over Undead':'feature:+1 Feat',
  'Necromantic Touch':'magic:Touch causes shaken/frightened %V rd %1/day',
  'Physical Enhancement':'ability:+%V %1 of str/dex/con',
  'Change Shape':'magic:<i>Beast Shape %1</i>/<i>Elemental Body %2</i> %V rd/day',
  'Telekinetic Fist':'magic:Ranged touch 1d4+%1 HP %V/day',
  // Races
  'Adaptability':'feature:+1 Feat',
  'Dwarf Ability Adjustment':'+2 constitution/+2 wisdom/-2 charisma',
  'Elf Ability Adjustment':'+2 dexterity/+2 intelligence/-2 constitution',
  'Elf Blood':'feature:Elf and human for racial effects',
  'Gnome Ability Adjustment':'+2 constitution/+2 charisma/-2 strength',
  'Half-Elf Ability Adjustment':'+2 any',
  'Half-Orc Ability Adjustment':'+2 any',
  'Halfling Ability Adjustement':'+2 dexterity/+2 charisma/-2 strength',
  'Human Ability Adjustment':'+2 any',
  'Low-Light Vision':'feature:x%V normal distance in poor light',
  'Multitalented':'feature:Two favored classes',
  'Resist Enchantment':'save:+2 vs. enchantment',
  'Sleep Immunity':'save:Immune <i>Sleep</i>',
  'Keen Senses':'skill:+2 Perception',
  'Orc Ferocity':'combat:Fight 1 rd below zero HP',
  'Darkvision':"feature:60' b/w vision in darkness",
  'Orc Blood':'feature:Orc and human for racial effects',
  'Intimidating':'skill:+2 Intimidate',
  'Slow':'ability:-10 Speed',
  'Steady':'ability:No speed penalty in armor',
  'Defensive Training':'combat:+4 AC vs. giant creatures',
  'Dwarf Hatred':'combat:+1 attack vs. goblinoid/orc',
  'Stability':'combat:+4 CMD vs. Bull Rush/Trip',
  'Hardy':'save:+2 vs. poison/spells',
  'Greed':'skill:+2 Appraise (precious metals, gems)',
  'Stonecunning':"skill:+2 Perception (stone), automatic check w/in 10'",
  'Elven Magic':[
    'magic:+2 vs. spell resistance',
    'skill:+2 Spellcraft (identify magic item properties)'
  ],
  'Keen Senses':'skill:+2 Perception',
  'Gnome Hatred':'combat:+1 attack vs. goblinoid/reptilian',
  'Small':[
    'combat:+1 AC/attack, -1 CMB/CMD',
    'skill:+2 Fly/+4 Stealth'
  ],
  'Gnome Magic':'magic:+1 DC on illusion spells',
  'Natural Spells':'magic:%V 1/day as caster %1',
  'Resist Illusion':'save:+2 vs. illusions',
  'Obsessive':'skill:+2 choice of Craft or Profession',
  'Fearless':'save:+2 vs. fear',
  'Halfling Luck':'save:+1 all saves',
  'Sure-Footed':'skill-FootedFeature:+2 Acrobatics/Climb',
  // Traits
  'A Sure Thing':'combat:+2 attack vs evil 1/day',
  'Adopted':'feature:Family race traits available',
  'Aid Allies':'combat:+1 aid another action',
  'Anatomist':'combat:+1 critical hit rolls',
  'Ancient Historian':'skill:Choice of Knowledge (History), Linguistics class skill and +1, learn 1 ancient language',
  'Animal Friend':[
    "save:+1 Will when unhostile animal w/in 30'",
    'skill:Handle Animal is class skill'
  ],
  'Apothecary':'feature:Has reliable poisons source',
  'Arcane Archivist':'skill:+1 Use Magic Device/is class skill',
  'Armor Expert':'skillNotes.armorExpertFeature:-1 armor skill check penalty',
  'Attuned To The Ancestors':'magic:<i>Hide From Undead</i> %V rd 1/day',
  'Bad Reputation':'skill:+2 Intimidate/is class skill',
  'Balanced Offensive':'combat:Cleric-like elemental attack %V/day',
  'Beastspeaker':'skill:+1 Diplomacy (animals), no penalty w/elemental animals',
  'Beneficient Touch':'magic:Reroll healing spell 1s 1/day',
  'Birthmark':'save:+2 vs. charm, compulsion',
  'Bitter Nobleman':
    'skill:+1 choice of Bluff, Sleight Of Hand, Stealth/is class skill',
  'Brute':'skill:+1 Intimidate/is class skill',
  'Bullied':'combat:+1 unarmed AOO attack',
  'Bully':'skill:+1 Intimidate/is class skill',
  'Canter':'skill:+5 Bluff (secret message)/Sense Motive (secret message)',
  "Captain's Blade":
    'skill:+1 Acrobatics, Climb when on ship/choice is class skill',
  'Caretaker':'skillNotes.caretakerFeature:+1 Heal/is class skill',
  'Charming':[
    'magic:+1 spell DC w/attracted creatures',
    'skill:+1 Bluff, Diplomacy w/attracted creatures'
  ],
  'Child Of Nature':
    'skill:+1 Knowledge (Nature)/Survival (finding food and water)/choice is class skill',
  'Child Of The Streets':'skill:+1 Sleight Of Hand/is class skill',
  'Child Of The Temple':
    'skill:+1 Knowledge (Nobility)/Knowledge (Religion)/choice is class skill',
  'Clasically Schooled':'skill:+1 Spellcraft/is class skill',
  'Comparative Religion':'skill:+1 Knowledge (Religion)/is class skill',
  'Courageous':'save:+2 vs. fear',
  'Dangerously Curious':'skill:+1 Use Magic Device/is class skill'
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
  'Acrobatics':'Ability=dexterity Class=Barbarian,Bard,,Monk,Rogue',
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
    'Ability=intelligence Untrained=n Class=Bard,,Fighter,Ranger,Rogue,Wizard',
  'Knowledge (Engineering)':
    'Ability=intelligence Untrained=n Class=Bard,Fighter,Wizard',
  'Knowledge (Geography)':
    'Ability=intelligence Untrained=n Class=Bard,Druid,Ranger,Wizard',
  'Knowledge (History)':
    'Ability=intelligence Untrained=n Class=Bard,Cleric,Monk,Wizard',
  'Knowledge (Local)':
    'Ability=intelligence Untrained=n Class=Bard,Rogue,Wizard',
  'Knowledge (Nature)':
    'Ability=intelligence Untrained=n Class=Barbarian,Bard,druid,Ranger,Wizard',
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
    'School=Transmutation Level=W3 ' +
    'Description="Become small (+2 Dex/+1 AC) or medium (+2 Str/+2 AC) animal for $L min"',
  'Beast Shape II':
    'School=Transmutation Level=W4 ' +
    'Description="Become tiny (+4 Dex/-2 Str/+1 AC) or large (+4 Str/-2 Dex/+4 AC) animal for $L min"',
  'Beast Shape III':
    'School=Transmutation Level=W5,Animal5 ' +
    'Description="Become dimunitive (+6 Dex/-4 Str/+1 AC) or huge (+6 Str/-4 Dex/+6 AC) animal or small (+4 Dex/+2 AC) or medium (+4 Str/+4 AC) magical beast for $L min"',
  'Beast Shape IV':
    'School=Transmutation Level=W6 ' +
    'Description="Become tiny (+8 Dex/-2 Str/+3 AC) or large (+6 Str/-2 Dex/+2 Con/+6 AC) magical beast for $L min"',
  'Bleed':
    'School=Necromancy Level=C0,W0 ' +
    'Description="R$RS\' Stabilized target resume dying (Will neg)"',
  'Breath Of Life':
    'School=Conjuration Level=C5 ' +
    'Description="Heal 5d8+$L/max 25 plus resurrect target dead lt 1 rd"',
  'Elemental Body I':
    'School=Transmutation Level=W4 ' +
    'Description="Become small air (+2 Dex/+2 AC/fly 60\'/whirlwind), earth (+2 Str/+4 AC/earth glide), fire (+2 Dex/+2 AC/resist fire/burn), water (+2 Con/+4 AC/swim 60\'/vortex/breathe water) elemental, 60\' darkvision for $L min"',
  'Elemental Body II':
    'School=Transmutation Level=W5 ' +
    'Description="Become medium air (+4 Dex/+3 AC/fly 60\'/whirlwind), earth (+4 Str/+5 AC/earth glide), fire (+4 Dex/+3 AC/resist fire/burn), water (+4 Con/+5 AC/swim 60\'/vortex/breathe water) elemental, 60\' darkvision for $L min"',
  'Elemental Body III':
    'School=Transmutation Level=W6 ' +
    'Description="Become large air (+2 Str/+4 Dex/+4 AC/fly 60\'/whirlwind), earth (+6 Str/-2 Dex/+2 Con/+6 AC/earth glide), fire (+4 Dex/+2 Con/+4 AC/resist fire/burn), water (+2 Str/-2 Dex/+6 Con/+6 AC/swim 60\'/vortex/breathe water) elemental, 60\' darkvision/immune bleed, critical, sneak attack for $L min"',
  'Elemental Body IV':
    'School=Transmutation Level=W7,Air7,Fire7 ' +
    'Description="Become huge air (+4 Str/+6 Dex/+4 AC/fly 120\'/whirlwind), earth (+8 Str/-2 Dex/+4 Con/+6 AC/earth glide), fire (+6 Dex/+4 Con/+4 AC/resist fire/burn), water (+4 Str/-2 Dex/+8 Con/+6 AC/swim 120\'/vortex/breathe water) elemental, 60\' darkvision/immune bleed, critical, sneak attack/DR 5/- for $L min"',
  'Form Of The Dragon I':
    'School=Transmutation Level=W6 ' +
    'Description="Become Medium dragon (+4 Str/+2 Con/+4 AC/Fly 60\'/Darkvision 60\'/breath weapon once 6d8 HP (Ref half)/element resistance/bite 1d8 HP/claws 2x1d6 HP/wings 2x1d4 HP) for $L min"',
  'Form Of The Dragon II':
    'School=Transmutation Level=W7 ' +
    'Description="Become Large dragon (+6 Str/+4 Con/+6 AC/Fly 90\'/Darkvision 60\'/breath weapon twice 8d8 HP (Ref half)/element resistance/bite 2d6 HP/claws 2x1d8 HP/wings 2x1d6 HP) for $L min"',
  'Form Of The Dragon III':
    'School=Transmutation Level=W8 ' +
    'Description="Become Huge dragon (+10 Str/+8 Con/+8 AC/Fly 120\'/Blindsense 60\'/Darkvision 120\'/breath weapon 1/d4 rd 12d8 HP (Ref half)/element immunity/bite 2d8 HP/claws 2x2d6 HP/wings 2x1d8 HP/tail 2d6 HP) for $L min"',
  'Giant Form I':
    'School=Transmutation Level=W7 ' +
    'Description="Become large giant (+6 Str/-2 Dex/+4 Con/+4 AC/low-light vision/form abilities) for $L min"',
  'Giant Form II':
    'School=Transmutation Level=W8 ' +
    'Description="Become huge giant (+8 Str/-2 Dex/+6 Con/+6 AC/low-light vision/form abilities) for $L min"',
  'Greater Polymorph':
    'School=Transmutation Level=W5 ' +
    'Description="Willing target becomes animal/elemental/plant/dragon for $L min"',
  'Plant Shape I':
    'School=Transmutation Level=W5 ' +
    'Description="Become small (+2 Con/+2 AC) or medium (+2 Str/+2 Con/+2 AC) plant creature for $L min"',
  'Plant Shape II':
    'School=Transmutation Level=W6 ' +
    'Description="Become large (+4 Str/+2 Con/+4 AC) plant creature for $L min"',
  'Plant Shape III':
    'School=Transmutation Level=W7 ' +
    'Description="Become huge (+8 Str/-2 Dex/+4 Con/+6 AC) plant creature for $L min"',
  'Stabilize':
    'School=Conjuration Level=C0,D0 ' +
    'Description="R$RS\' Stabilize dying target"'
});
// Delete SRD35 spells that don't exist in Pathfinder
delete Pathfinder.SPELLS['Cure Minor Wounds'];
delete Pathfinder.SPELLS['Inflict Minor Wounds'];
delete Pathfinder.SPELLS['Polymorph'];
Pathfinder.SPELL_LEVEL_CHANGES = {
  'Commune With Nature':'-Animal5',
  'Control Weather':'-Air7',
  'Animate Rope':'+Artificer1',
  'Wood Shape':'+Artificer2',
  'Stone Shape':'+Artificer3',
  'Minor Creation':'+Artificer4',
  'Fabricate':'+Artificer5',
  'Major Creation':'+Artificer6',
  'Wall Of Iron':'+Artificer7',
  'Statue':'+Artificer8',
  'Prismatic Sphere':'+Artificer9',
  'Align Weapon':'+Chaos2,+Evil2',
  'Shatter':'-Chaos2',
  'Charm Person':'+Charm1',
  'Calm Emotions':'+Charm2',
  'Suggestion':'+Charm3',
  'Heroism':'+Charm4',
  'Charm Monster':'+Charm5',
  'Geas/Quest':'+Charm6',
  'Insanity':'+Charm7',
  'Demand':'+Charm8',
  'Dominate Monster':'+Charm9',
  'Bless':'+Community1',
  'Shield Other':'+Community2',
  'Prayer':'+Community3',
  'Imbue With Spell Ability':'+Community4',
  'Telepathic Bond':'+Community5',
  "Heroes' Feast":'+Community6',
  'Refuge':'+Community7',
  'Mass Cure Critical Wounds':'+Community8',
  'Miracle':'+Community9',
  'Obscuring Mist':'+Darkness1',
  'Blindness/Deafness':'+Darkness2',
  'Deeper Darkness':'+Darkness3',
  'Shadow Conjuration':'+Darkness4',
  'Summon Monster V':'+Darkness5',
  'Shadow Walk':'+Darkness6',
  'Power Word Blind':'+Darkness7',
  'Greater Shadow Evocation':'+Darkness8',
  'Shades':'+Darkness9',
  'True Strike':'+Destruction1',
  'Contagion':'-Destruction3',
  'Range':'+Destruction3',
  'Mass Inflict Light Wounds':'-Destruction5',
  'Shout':'+Destruction5',
  'Earthquake':'-Earth7,+Earth8',
  'Iron Body':'-Earth8',
  'Desecrate':'-Evil2',
  'Resist Energy':'-Fire3',
  'Fireball':'+Fire3',
  'Fire Storm':'-Fire7',
  'Shield Of Faith':'+Glory1',
  'Bless Weapon':'+Glory2',
  'Searing Light':'+Glory3',
  'Holy Smite':'+Glory4',
  'Righteous Might':'+Glory5',
  'Undeath To Death':'+Glory6',
  'Holy Sword':'+Glory7',
  'Holy Aura':'+Glory8',
  'Gate':'+Glory9',
  'Aid':'-Good2',
  'Align Weapon':'+Good2',
  'Mass Cure Light Wounds':'-Healing5',
  'Breath Of Life':'+Healing5',
};
Pathfinder.TRACKS = ['Slow', 'Medium', 'Fast'];
Pathfinder.TRAITS = {
  // Advanced Player's Guide
  'Anatomist':'Type=Basic Subtype=Combat',
  'Armor Expert':'Type=Basic Subtype=Combat',
  'Bullied':'Type=Basic Subtype=Combat',
  'Courageous':'Type=Basic Subtype=Combat',
  'Deft Dodger':'Type=Basic Subtype=Combat',
  'Dirty Fighter':'Type=Basic Subtype=Combat',
  'Fencer':'Type=Basic Subtype=Combat',
  'Killer':'Type=Basic Subtype=Combat',
  'Reactionary':'Type=Basic Subtype=Combat',
  'Resilient':'Type=Basic Subtype=Combat',
  'Birthmark':'Type=Basic Subtype=Faith',
  'Caretaker':'Type=Basic Subtype=Faith',
  'Child Of The Temple':'Type=Basic Subtype=Faith',
  'Devotee Of The Green':'Type=Basic Subtype=Faith',
  'Ease Of Faith':'Type=Basic Subtype=Faith',
  'History Of Heresy':'Type=Basic Subtype=Faith',
  'Indomitable Faith':'Type=Basic Subtype=Faith',
  'Sacred Conduit':'Type=Basic Subtype=Faith',
  'Sacred Touch':'Type=Basic Subtype=Faith',
  'Scholar Of The Great Beyond':'Type=Basic Subtype=Faith',
  'Classically Schooled':'Type=Basic Subtype=Magic',
  'Dangerously Curious':'Type=Basic Subtype=Magic',
  'Focused Mind':'Type=Basic Subtype=Magic',
  'Gifted Adept':'Type=Basic Subtype=Magic',
  'Hedge Magician':'Type=Basic Subtype=Magic',
  'Magical Knack':'Type=Basic Subtype=Magic',
  'Magical Lineage':'Type=Basic Subtype=Magic',
  'Magical Talent':'Type=Basic Subtype=Magic',
  'Mathematical Prodigy':'Type=Basic Subtype=Magic',
  'Skeptic':'Type=Basic Subtype=Magic',
  'Adopted':'Type=Basic Subtype=Social',
  'Bully':'Type=Basic Subtype=Social',
  'Canter':'Type=Basic Subtype=Social',
  'Charming':'Type=Basic Subtype=Social',
  'Child Of The Streets':'Type=Basic Subtype=Social',
  'Fast-Talker':'Type=Basic Subtype=Social',
  'Natural-Born Leader':'Type=Basic Subtype=Social',
  'Poverty-Stricken':'Type=Basic Subtype=Social',
  'Rich Parents':'Type=Basic Subtype=Social',
  'Suspicious':'Type=Basic Subtype=Social',
  'Apothecary':'Type=Campaign Subtype="Black Sheep"',
  'Bitter Nobleman':'Type=Campaign Subtype="Black Sheep"',
  'Exile':'Type=Campaign Subtype=Outlander',
  'Lore Seeker':'Type=Campaign Subtype=Outlander',
  'Missionary':'Type=Campaign Subtype=Outlander',
  'Sheriff':'Type=Campaign Subtype="Favored Child"',
  'Tavern Owner':'Type=Campaign Subtype="Favored Child"',
  'Animal Friend':'Type=Race Subtype=Gnome',
  'Brute':'Type=Race Subtype=Half-Orc',
  'Elven Reflexes':'Type=Race Subtype=Half-Elf',
  'Failed Apprentice':'Type=Race Subtype=Half-Elf',
  'Forlorn':'Type=Race Subtype=Elf',
  'Freedom Fighter':'Type=Race Subtype=Halfling',
  'Goldsniffer':'Type=Race Subtype=Dwarf',
  'Outcast':'Type=Race Subtype=Half-Orc',
  'Rapscallion':'Type=Race Subtype=Gnome',
  'Scholar Of Ruins':'Type=Race Subtype=Human',
  'Tunnel Fighter':'Type=Race Subtype=Dwarf',
  'Warrior Of Old':'Type=Race Subtype=Elf',
  'Well-Informed':'Type=Race Subtype=Halfling',
  'World Traveler':'Type=Race Subtype=Human',
  'Desert Child':'Type=Regional Subtype=Desert',
  'Highlander':'Type=Regional Subtype=Hills,Mountains',
  'Log Roller':'Type=Regional Subtype=Forest',
  'Militia Veteran':'Type=Regional Subtype=Town,Village',
  'River Rat':'Type=Regional Subtype=Marsh,River',
  'Savanna Child':'Type=Regional Subtype=Plains',
  'Vagabond Child':'Type=Regional Subtype=Urban',
  'Child Of Nature':'Type=Religion Subtype=N',
  'Demon Hunter':'Type=Religion Subtype=LE',
  'Divine Courtesan':'Type=Religion Subtype=CN',
  'Divine Warrior':'Type=Religion Subtype=LG',
  'Ear For Music':'Type=Religion Subtype=NG',
  'Eyes And Ears Of The City':'Type=Religion Subtype=LG',
  'Flame Of The Dawnflower':'Type=Religion Subtype=NG',
  'Fortified Drinker':'Type=Religion Subtype=CG',
  'Guardian Of The Forge':'Type=Religion Subtype=LG',
  'Magic Is Life':'Type=Religion Subtype=N',
  'Patient Optimist':'Type=Religion Subtype=LG',
  'Starchild':'Type=Religion Subtype=CG',
  'Undead Slayer':'Type=Religion Subtype=N',
  'Veteran Of Battle':'Type=Religion Subtype=CN',
  'Wisdom In The Flesh':'Type=Religion Subtype=LN',
  // Faction Traits - PS Roleplaying Guild Guide (v10.0)
  'Balanced Offensive':'Type=Faction Subtype="The Concordance"',
  'Beastspeaker':'Type=Faction Subtype="The Concordance"',
  'Natural Negotiator':'Type=Faction Subtype="The Concordance"',
  'Planar Voyager':'Type=Faction Subtype="The Concordance"',
  'Scholar Of Balance':'Type=Faction Subtype="The Concordance"',
  'Arcane Archivist':'Type=Faction Subtype="Dark Archive"',
  'Devil\'s Mark':'Type=Faction Subtype="Dark Archive"',
  'Librarian':'Type=Faction Subtype="Dark Archive"',
  'Master Of Pentacles':'Type=Faction Subtype="Dark Archive"',
  'Soul Drinker':'Type=Faction Subtype="Dark Archive"',
  'Gold Finger':'Type=Faction Subtype="The Exchange"',
  'Greasy Palm':'Type=Faction Subtype="The Exchange"',
  'Smuggler':'Type=Faction Subtype="The Exchange"',
  'Tireless':'Type=Faction Subtype="The Exchange"',
  'Upstanding':'Type=Faction Subtype="The Exchange"',
  'Insider Knowledge':'Type=Faction Subtype="Grand Lodge"',
  'Loyalty':'Type=Faction Subtype="Grand Lodge"',
  'Observant':'Type=Faction Subtype="Grand Lodge"',
  'Proper Training':'Type=Faction Subtype="Grand Lodge"',
  'Teaching Mistake':'Type=Faction Subtype="Grand Lodge"',
  'Captain\'s Blade':'Type=Faction Subtype="Liberty\'s Edge"',
  'Faction Freedom Fighter':'Type=Faction Subtype="Liberty\'s Edge"',
  'Indomitable':'Type=Faction Subtype="Liberty\'s Edge"',
  'Rousing Oratory':'Type=Faction Subtype="Liberty\'s Edge"',
  'Whistleblower':'Type=Faction Subtype="Liberty\'s Edge"',
  'A Sure Thing':'Type=Faction Subtype="Silver Crusade"',
  'Beneficient Touch':'Type=Faction Subtype="Silver Crusade"',
  'Comparative Religion':'Type=Faction Subtype="Silver Crusade"',
  'Force For Good':'Type=Faction Subtype="Silver Crusade"',
  'Unorthodox Strategy':'Type=Faction Subtype="Silver Crusade"',
  'Expert Duelist':'Type=Faction Subtype="Sovereign Court"',
  'Fashionable':'Type=Faction Subtype="Sovereign Court"',
  'Impressive Presence':'Type=Faction Subtype="Sovereign Court"',
  'Influential':'Type=Faction Subtype=Taldor',
  'Unflappable':'Type=Faction Subtype=Taldor',
  // Faction Traits from prior Guide versions
  'Explorer':'Type=Faction Subtype=Andoran',
  'Hunter\'s Eye':'Type=Faction Subtype=Andoran',
  'Fiendish Presence':'Type=Faction Subtype=Cheliax',
  'Fires Of Hell':'Type=Faction Subtype=Cheliax',
  'Meridian Strike':'Type=Faction Subtype="Lantern Lodge"',
  'Meticulous Artisan':'Type=Faction Subtype="Lantern Lodge"',
  'Mind Over Matter':'Type=Faction Subtype="Lantern Lodge"',
  'Storyteller':'Type=Faction Subtype="Lantern Lodge"',
  'Weapon Style':'Type=Faction Subtype="Lantern Lodge"',
  'Dunewalker':'Type=Faction Subtype=Osiron',
  'Mummy-Touched':'Type=Faction Subtype=Osirion',
  'Dervish':'Type=Faction Subtype=Qadira',
  'Desert Shadow':'Type=Faction Subtype=Qadira',
  'Eastern Mysteries':'Type=Faction Subtype=Qadira',
  'Horse Lord':'Type=Faction Subtype=Qadira',
  'Ancient Historian':'Type=Faction Subtype="Scarab Sages"',
  'Attuned To The Ancestors':'Type=Faction Subtype="Scarab Sages"',
  'Reverent Wielder':'Type=Faction Subtype="Scarab Sages"',
  'Secrets Of The Sphinx':'Type=Faction Subtype="Scarab Sages"',
  'Tomb Raider':'Type=Faction Subtype="Scarab Sages"',
  'Aid Allies':'Type=Faction Subtype="Shadow Lodge"',
  'Fortified':'Type=Faction Subtype="Shadow Lodge"',
  'Medic':'Type=Faction Subtype="Shadow Lodge"',
  'Shadow Diplomat':'Type=Faction Subtype="Shadow Lodge"',
  'Watchdog':'Type=Faction Subtype="Shadow Lodge"',
  'Bad Reputation':'Type=Faction Subtype=Sczarni',
  'I Know A Guy':'Type=Faction Subtype=Sczarni',
  'Shiv':'Type=Faction Subtype=Sczarni',
  'Trouper':'Type=Faction Subtype=Sczarni',
  'Performance Artist':'Type=Faction Subtype=Taldor',
  'Vindictive':'Type=Faction Subtype=Taldor'
};
Pathfinder.WEAPONS = Object.assign({}, SRD35.WEAPONS, {
  'Bolas':'Level=3 Category=R Damage=d4 Range=10',
  'Blowgun':'Level=1 Category=R Damage=d2 Range=20',
  'Elven Curve Blade':'Level=3 Category=2h Damage=d10@18',
  'Halfling Sling Staff':'Level=3 Category=R Damage=d8x3 Range=80',
  'Sai':'Level=3 Category=Li Damage=d4', // removed range
  'Starknife':'Level=2 Category=Li Damage=d4x3 Range=20'
});

Pathfinder.BLOODLINES = [
  'Aberrant', 'Abyssal', 'Arcane', 'Celestial', 'Destined', 'Draconic (Black)',
  'Draconic (Blue)', 'Draconic (Green)', 'Draconic (Red)', 'Draconic (White)',
  'Draconic (Brass)', 'Draconic (Bronze)', 'Draconic (Copper)',
  'Draconic (Gold)', 'Draconic (Silver)', 'Elemental (Air)',
  'Elemental (Earth)', 'Elemental (Fire)', 'Elemental (Water)', 'Fey',
  'Infernal', 'Undead'
];
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

/* Defines the rules related to character abilities. */
Pathfinder.abilityRules = function(rules) {
  SRD35.abilityRules(rules);
  // Override intelligence skillPoint adjustment
  rules.defineRule
    ('skillNotes.intelligenceSkillPointsAdjustment', 'level', '*', null);
  // NOTE Our rule engine doesn't support indexing into an array. Here, we work
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
}

/* Defines rules related to animal companions and familiars. */
Pathfinder.aideRules = function(rules, companions, familiars) {
  SRD35.aideRules(rules, companions, familiars);
};

/* Defines rules related to combat. */
Pathfinder.combatRules = function(rules, armors, shields, weapons) {
  SRD35.combatRules(rules, armors, shields, weapons);
};

/* Defines the rules related to goodies included in character notes. */
Pathfinder.goodiesRules = function(rules) {
  SRD35.goodiesRules(rules);
};

/* Defines rules related to basic character identity. */
Pathfinder.identityRules = function(
  rules, alignments, classes, deities, factions, genders, races, traits
) {
  SRD35.identityRules(rules, alignments, classes, deities, genders, races);
  for(var faction in factions) {
    rules.choiceRules(rules, 'factions', faction, factions[faction]);
  }
  for(var trait in traits) {
    rules.choiceRules(rules, 'traits', trait, traits[trait]);
  }
  rules.defineEditorElement('traits', 'Traits', 'set', 'traits', 'skills');
  rules.defineSheetElement('Traits', 'Feats+', null, '; ');
  rules.defineChoice('extras', 'traits');
};

/* Defines rules related to magic use. */
Pathfinder.magicRules = function(rules, domains, schools, spells) {
  SRD35.magicRules(rules, domains, schools, spells);
};

/* Defines rules related to character feats, languages, and skills. */
Pathfinder.talentRules = function(rules, feats, features, languages, skills) {
  SRD35.talentRules(rules, feats, features, languages, skills);
  // Override SRD35 feat count computation
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');
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
    // TODO
    result.push(
    );
  else if(type == 'traits')
    // TODO
    result.push(
    );
  else
    return SRD35.choiceEditorElements(rules, type);
  return result
};

/*
 * TODO
 */
Pathfinder.choiceRules = function(rules, type, name, attrs) {
  if(name == null || name == '') {
    console.log('Empty name for ' + type);
    return;
  }
  name = name.replace(/(^|\s)([a-z])/g, function(x) {return x.toUpperCase();});
  if(type == 'alignments')
    Pathfinder.alignmentRules(rules, name);
  else if(type == 'bloodlines')
    Pathfinder.bloodlinesRules(rules, name);
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
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'armors')
    Pathfinder.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'deities')
    Pathfinder.deityRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'weapon'));
  else if(type == 'domains')
    Pathfinder.domainRules(rules, name,
    );
  else if(type == 'factions')
    Pathfinder.factionRules(rules, name);
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
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'feats')
    Pathfinder.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Type'),
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply')
    );
  else if(type == 'features')
    Pathfinder.featureRules(rules, name, attrs);
  else if(type == 'genders')
    Pathfinder.genderRules(rules, name);
  else if(type == 'languages')
    Pathfinder.languageRules(rules, name);
  else if(type == 'levels')
    Pathfinder.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValue(attrs, 'SkillPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Fortitude'),
      QuilvynUtils.getAttrValue(attrs, 'Reflex'),
      QuilvynUtils.getAttrValue(attrs, 'Will'),
      [], // Skills for base classes handled by skillRules
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsPerDay')
    );
  else if(type == 'races')
    Pathfinder.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
  );
  else if(type == 'schools')
    Pathfinder.schoolRules(rules, name);
  else if(type == 'shields')
    Pathfinder.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'skills')
    Pathfinder.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      QuilvynUtils.getAttrValue(attrs, 'Untrained'),
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergy')
    );
  else if(type == 'spells') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var levels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = school.substring(0, 4);
    for(var i = 0; i < levels.length; i++) {
      var groupAndLevel = levels[i];
      var casterGroup = groupAndLevel.length > 3 ? 'Dom' : groupAndLevel.substring(0, groupAndLevel.length - 1);
      var level = groupAndLevel.substring(groupAndLevel.length - 1) * 1;
      var fullSpell = name + '(' + groupAndLevel + ' ' + schoolAbbr + ')';
      rules.addChoice('spells', fullSpell, attrs);
      Pathfinder.spellRules(rules, fullSpell,
        school,
        casterGroup,
        level,
        QuilvynUtils.getAttrValue(attrs, 'Description')
      );
    }
  } else if(type == 'weapons')
    Pathfinder.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Threat'),
      QuilvynUtils.getAttrValue(attrs, 'Crit'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else if(type == 'traits')
    Pathfinder.traitRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'Subtype')
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
};

/*
 * TODO
 */
Pathfinder.armorRules = function(
  rules, name, ac, profLevel, maxDex, skillPenalty, spellFail
) {
  SRD35.armorRules(rules, name, ac, profLevel, maxDex, skillPenalty, skillFail);
};

/*
 * TODO
 */
Pathfinder.classRules = function(
  rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
  saveRef, saveWill, skills, features, selectables, casterLevelArcane,
  casterLevelDivine, spellAbility, spellsPerDay, spells
) {

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

    rules.defineRule('domainCount', 'levels.Cleric', '+=', '2');
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

  } else if(name == 'Druid') {

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
    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'armorTrainingGap', '^', 'source >= 0 ? 0 : null'
    );
    rules.defineRule('armorTrainingGap',
      'armor', '+', '-SRD35.armorsProficiencyLevels[source]',
      'abilityNotes.armorTrainingFeature', '=', 'source == "heavy" ? SRD35.PROFICIENCY_HEAVY : SRD35.PROFICIENCY_MEDIUM'
    );
    rules.defineRule
      ('armorClass', 'combatNotes.armorTrainingFeature', '+', null);
    rules.defineRule('combatManeuverDefense',
      'combatNotes.armorTrainingFeature', '+',null
    );
    rules.defineRule('combatNotes.armorTrainingFeature',
      'dexterityModifier', '=', null,
      'armor', '+', '-SRD35.armorsMaxDexBonuses[source]',
      'levels.Fighter', 'v', 'Math.floor((source + 1) / 4)',
      '', '^', '0'
    );
    rules.defineRule('featCount.Fighter',
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
    rules.defineRule('featCount.Fighter',
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
    if(true)
      return; // TODO
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
      'Arcane':null, // Knowledge (any one)
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
      var baseBloodline = bloodline.split(' (')[0];
      var bloodlineLevelAttr = 'bloodlineLevel.' + bloodline;
      var powers = bloodlinePowers[baseBloodline].split('/');
      var skill = bloodlineSkills[baseBloodline];
      var spells = bloodlineSpells[baseBloodline].split('/');
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
      if(skill != null) {
        rules.defineRule
          ('classSkills.'+skill, 'features.Bloodline ' + bloodline, '=', '1');
      }
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
      } else if(bloodline == 'Abyssal') {
        feats = [
          'Augment Summoning', 'Cleave', 'Empower Spell', 'Great Fortitude',
          'Improved Bull Rush', 'Improved Sunder', 'Power Attack',
          'Skill Focus (Knowledge (Planes))'
        ];
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
          '["1d3", "1d4", "1d6", "1d8"][source]'
        );
        rules.defineRule('combatNotes.clawsFeature.1',
          'features.Claws', '?', null,
          'strengthModifier', '=', null
        );
        rules.defineRule('combatNotes.clawsFeature.2',
          'features.Claws', '?', null,
          'charismaModifier', '=', 'source+3'
        );
        rules.defineRule('combatNotes.clawsFeature.3',
          'features.Claws', '?', null,
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
          'features.Heavenly Fire', '?', null,
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
      } else if(baseBloodline == 'Draconic') {
        var dragonType = bloodline.split(')')[0].split('(')[1];
        var breathShape =
          'GreenRedWhiteGoldSilver'.indexOf(dragonType) >= 0 ? "30' cone" : "60' line";
        var energyType =
          'BlackGreenCopper'.indexOf(dragonType) >= 0 ? 'acid' :
          'BlueBronze'.indexOf(dragonType) >= 0 ? 'electricity' :
          'RedBrassGold'.indexOf(dragonType) >= 0 ? 'fire' : 'cold';
        feats = [
          'Blind-Fight', 'Great Fortitude', 'Improved Initiative',
          'Power Attack', 'Quicken Spell', 'Skill Focus (Fly)',
          'Skill Focus (Knowledge (Arcana))', 'Toughness'
        ];
        rules.defineRule('abilityNotes.wingsFeature',
          bloodlineLevelAttr, '^=', 'source >= 15 ? 60 : null'
        );
        rules.defineRule
          ('armorClass', 'combatNotes.dragonResistancesFeature', '+', null);
        // No bonus to CMD
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
        rules.defineRule('combatNotes.breathWeaponFeature.3',
          bloodlineLevelAttr, '=', '"' + breathShape + '"'
        );
        rules.defineRule('combatNotes.breathWeaponFeature.4',
          bloodlineLevelAttr, '=', '"' + energyType + '"'
        );
        rules.defineRule('combatNotes.clawsFeature',
          'clawsDamageLevel', '=',
          '["1d3", "1d4", "1d6", "1d8"][source]'
        );
        rules.defineRule
          ('combatNotes.clawsFeature.1', 'strengthModifier', '=', null);
        rules.defineRule
          ('combatNotes.clawsFeature.2', 'charismaModifier', '=', 'source+3');
        rules.defineRule('combatNotes.clawsFeature.3',
          bloodlineLevelAttr, '=',
          'source < 5 ? "" : source < 7 ? ", magic" : ", magic +d6 HP ' + energyType + '"'
        );
        rules.defineRule('combatNotes.dragonResistancesFeature',
          bloodlineLevelAttr, '=',
          'source >= 15 ? 4 : source >= 10 ? 2 : source >= 3 ? 1 : null'
        );
        rules.defineRule('featureNotes.blindsenseFeature',
          bloodlineLevelAttr, '^=', '60'
        );
        rules.defineRule('features.Bloodline Draconic',
          bloodlineLevelAttr, '=', '1'
        );
        rules.defineRule('magicNotes.bloodlineDraconicFeature',
          bloodlineLevelAttr, '=', '"' + energyType + '"'
        );
        rules.defineRule('saveNotes.dragonResistancesFeature',
          bloodlineLevelAttr, '=',
          'source>=20 ? "Immune" : source >= 9 ? 10 : source >= 3 ? 5 : null'
        );
        rules.defineRule('saveNotes.dragonResistancesFeature.1',
          bloodlineLevelAttr, '=', '"' + energyType + '"'
        );
      } else if(baseBloodline == 'Elemental') {
        var elementType = bloodline.split(')')[0].split('(')[1];
        var energyType =
          elementType == 'Air' ? 'electricity' :
          elementType == 'Earth' ? 'acid' :
          elementType == 'Fire' ? 'fire' : 'cold';
        var movement =
          elementType == 'Air' ? "Fly 60'" :
          elementType == 'Earth' ? "Burrow 30'" :
          elementType == 'Water' ? "Swim 60'" : "+30 speed";
        feats = [
          'Dodge', 'Empower Spell', 'Great Fortitude', 'Improved Initiative',
          'Lightning Reflexes', 'Power Attack',
          'Skill Focus (Knowledge (Planes))', 'Weapon Finesse'
        ];
        rules.defineRule('abilityNotes.elementalMovementFeature',
          bloodlineLevelAttr, '=', 'source >= 15 ? "' + movement + '" : null'
        );
        rules.defineRule('combatNotes.elementalBlastFeature',
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
        rules.defineRule('combatNotes.elementalBlastFeature.3',
          bloodlineLevelAttr, '=', '"' + energyType + '"'
        );
        rules.defineRule('features.Bloodline Elemental',
          bloodlineLevelAttr, '=', '1'
        );
        rules.defineRule('combatNotes.elementalBodyFeature',
          bloodlineLevelAttr, '=', 'source>=20 ? "' + energyType + '" : null'
        );
        rules.defineRule('magicNotes.elementalRayFeature',
          'charismaModifier', '=', 'source + 3'
        );
        rules.defineRule('magicNotes.elementalRayFeature.1',
          bloodlineLevelAttr, '=', 'Math.floor(source / 2)'
        );
        rules.defineRule('magicNotes.elementalRayFeature.2',
          bloodlineLevelAttr, '=', '"' + energyType + '"'
        );
        rules.defineRule('saveNotes.elementalResistanceFeature',
          bloodlineLevelAttr, '=',
          'source>=20 ? "Immune" : source >= 9 ? 20 : source >= 3 ? 10 : null'
        );
        rules.defineRule('saveNotes.elementalResistanceFeature.1',
          bloodlineLevelAttr, '=', '"' + energyType + '"'
        );
      } else if(bloodline == 'Fey') {
        feats = [
          'Dodge', 'Improved Initiative', 'Lightning Reflexes', 'Mobility',
          'Point-Blank Shot', 'Precise Shot', 'Quicken Spell',
          'Skill Focus (Knowledge (Nature))'
        ];
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
        rules.defineRule('magicNotes.corruptingTouchFeature',
          bloodlineLevelAttr, '=', 'Math.max(1, Math.floor(source / 2))'
        );
        rules.defineRule('magicNotes.corruptingTouchFeature.1',
          'features.Corrupting Touch', '?', null,
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
          'features.Grave Touch', '?', null,
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


  // Override SRD35 skillPoints rule
  rules.defineRule
    ('skillPoints', 'levels.' + name, '+', 'source * ' + skillPoints);

};

/* Defines the rules related to combat. */
Pathfinder.combatRules = function(rules) {
  SRD35.combatRules(rules);
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
  // Override SRD35 armor bonuses
  rules.defineRule
    ('armorClass', 'armor', '+', 'Pathfinder.armorsArmorClassBonuses[source]');
};

/* Defines the rules related to companion creatures. */
Pathfinder.companionRules = function(rules, companions, familiars) {

  SRD35.companionRules(rules, companions, familiars);

  if(companions != null) {
    // Overrides SRD35 HD calculation
    rules.defineRule('animalCompanionStats.HD',
      'companionLevel', '=', 'null',
      'companionMasterLevel', '=', 'source + 1 - Math.floor((source+1)/4)'
    );
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
      'animalCompanionStats.HD', '=', SRD35.ATTACK_BONUS_AVERAGE
    );
    for(var companion in companions) {
      var matchInfo = companions[companion].match(/Level=(\d+)/);
      if(!companion.startsWith('Advanced ') || !matchInfo)
        continue;
      var baseCompanion = companion.replace('Advanced ', '');
      rules.defineRule('animalCompanionStats.Adv',
        'animalCompanion.' + baseCompanion, '=', matchInfo[1]
      );
    }
  }

  if(familiars != null) {
    var notes = [
      'skillNotes.companionAlertnessFeature:' +
        '+2 Perception, Sense Motive when companion w/in reach',
      'skillNotes.familiarBat:+3 Fly',
      'skillNotes.familiarCat:+3 Stealth',
      'skillNotes.familiarMonkey:+3 Acrobatics'
    ];
    delete rules.choices['notes']['skillNotes.companionAlertnessFeature'];
    delete rules.choices['notes']['skillNotes.familiarBat'];
    delete rules.choices['notes']['skillNotes.familiarCat'];
    rules.defineNote(notes);
    rules.defineRule('skillNotes.familiarMonkey', 'familiar.Monkey', '=', '1');
    rules.defineRule('familiarMaxDexOrStr',
      'features.Familiar', '?', null,
      'familiarStats.Dex', '=', null,
      'familiarStats.Str', '^', null
    );
    rules.defineRule('familiarBAB',
      'features.Familiar', '?', null,
      'baseAttack', '=', null
    );
  }

  rules.defineRule('tinyCompanionCMBAbility',
    'animalCompanionStats.Size', '?', 'source == "T" || source == "D"',
    'animalCompanionStats.Dex', '=', null
  );
  rules.defineRule('companionCMBAbility',
    'animalCompanionStats.Str', '=', null,
    'tinyCompanionCMBAbility', '^', null
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
Pathfinder.equipmentRules = function(rules, armors, shields, weapons) {
  SRD35.equipmentRules(rules, armors, shields, weapons);
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

/*
 * TODO
 */
Pathfinder.featRules = function(rules, name, types, requires, implies) {

  if(name == 'Acrobatic') {
    rules.defineRule('skillNotes.acrobaticFeature',
      '', '=', '2',
      'skills.Acrobatics', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.acrobaticFeature.1',
      'features.Acrobatic', '=', '2',
      'skills.Fly', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Agile Maneuvers') {
    rules.defineRule('combatNotes.agileManeuversFeature',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  } else if(name == 'Alertness') {
    rules.defineRule('skillNotes.alertnessFeature',
      '', '=', '2',
      'skills.Perception', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.alertnessFeature.1',
      'features.Alertness', '=', '2',
      'skills.Sense Motive', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Animal Affinity') {
    rules.defineRule('skillNotes.animalAffinityFeature',
      '', '=', '2',
      'skills.Handle Animal', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.animalAffinityFeature.1',
      'features.Animal Affinity', '=', '2',
      'skills.Ride', '+', 'source >= 10 ? 2 : null'
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
      '', '=', '2',
      'skills.Climb', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.athleticFeature.1',
      'features.Athletic', '=', '2',
      'skills.Swim', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Blinding Critical') {
    rules.defineRule('combatNotes.blindingCriticalFeature',
      'baseAttack', '=', '10 + source'
    );
  } else if(name == 'Combat Expertise') {
    rules.defineRule('combatNotes.combatExpertiseFeature',
      'baseAttack', '=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.combatExpertiseFeature.1',
      'features.Combat Expertise', '?', null,
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
      '', '=', '2',
      'skills.Bluff', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.deceitfulFeature.1',
      'features.Deceitful', '=', '2',
      'skills.Disguise', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Defensive Combat Training') {
    rules.defineRule('combatNotes.defensiveCombatTrainingFeature',
      'level', '=', null,
      'baseAttack', '+', '-source'
    );
  } else if(name == 'Deft Hands') {
    rules.defineRule('skillNotes.deftHandsFeature',
      '', '=', '2',
      'skills.Disable Device', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.deftHandsFeature.1',
      'features.Deft Hands', '=', '2',
      'skills.Sleight Of Hand', '+', 'source >= 10 ? 2 : null'
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
      '', '=', '2',
      'skills.Spellcraft', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.magicalAptitudeFeature.1',
      'features.Magical Aptitude', '=', '2',
      'skills.Use Magic Device', '+', 'source >= 10 ? 2 : null'
    );
  } else if(name == 'Persuasive') {
    rules.defineRule('skillNotes.persuasiveFeature',
      '', '=', '2',
      'skills.Diplomacy', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.persuasiveFeature.1',
      'features.Persuasive', '=', '2',
      'skills.Intimidate', '+', 'source >= 10 ? 2 : null'
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
      '', '=', '2',
      'skills.Heal', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.self-SufficientFeature.1',
      'features.Self Sufficient', '=', '2',
      'skills.Survival', '+', 'source >= 10 ? 2 : null'
    );
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
  } else if(name == 'Staggering Critical') {
    rules.defineRule('combatNotes.staggeringCriticalFeature',
      'baseAttack', '=', '10 + source'
    );
  } else if(name == 'Stealthy') {
    rules.defineRule('skillNotes.stealthyFeature',
      '', '=', '2',
      'skills.Escape Artist', '+', 'source >= 10 ? 2 : null'
    );
    rules.defineRule('skillNotes.stealthyFeature.1',
      'features.Stealthy', '=', '2',
      'skills.Stealth', '+', 'source >= 10 ? 2 : null'
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
Pathfinder.deityRules = function(rules, name, domains, favoredWeapons) {
  SRD35.deityRules(rules, name, domains, favoredWeapons);
};

/*
 * TODO
 */
SRD35.domainRules = function(rules, name, spells) {

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
      rules.defineRule('combatNotes.artificer\'sTouchFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.artificer\'sTouchFeature.1',
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
        'levels.Cleric', '=', 'source>=8 ? Math.floor((source - 4) / 4) : null'
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
        'levels.Cleric', '=', 'source>=8 ? 10 + Math.floor(source / 2) : null',
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

/*
 * TODO
 */
Pathfinder.factionRules = function(rules, name) {
  // TODO
};

/* Defines in #rules# the rules associated with gender #name#. */
Pathfinder.genderRules = function(rules, name) {
  SRD35.genderRules(rules, name);
};

/* Defines the rules related to character movement. */
Pathfinder.movementRules = function(rules) {
  SRD35.movementRules(rules); // No changes
};

/*
 * TODO
 */
Pathfinder.raceRules = function(rules, name, features) {

  var raceNoSpace =
    name.substring(0,1).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(name == 'Half-Elf') {

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

  } else if(name == 'Half-Orc') {

    rules.defineRule
      ('languages.Orc', 'race', '=', 'source.match(/Orc/) ? 1 : null');

  } else if(name.match(/Dwarf/)) {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'abilityNotes.steadyFeature', '^', '0'
    );
    rules.defineRule
      ('languages.Dwarven', 'race', '=', 'source.match(/Dwarf/) ? 1 : null');

  } else if(name.match(/Elf/)) {

    rules.defineRule
      ('languages.Elven', 'race', '=', 'source.match(/Elf/) ? 1 : null');

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
      ('languages.Gnome', 'race', '=', 'source.match(/Gnome/) ? 1 : null');
    rules.defineRule
      ('languages.Sylvan', 'race', '=', 'source.match(/Gnome/) ? 1 : null');
    rules.defineRule('magicNotes.naturalSpellsFeature',
      'charisma', '?', 'source >= 11',
      raceNoSpace + 'Features.Natural Spells', '=',
      '"<i>Dancing Lights</i>/<i>Ghost Sound</i>/<i>Prestidigitation</i>/' +
      '<i>Speak With Animals</i>"'
    );
    rules.defineRule('magicNotes.naturalSpellsFeature.1',
      'features.Natural Spells', '?', null,
      'level', '=', null
    );

  } else if(name.match(/Halfling/)) {

    rules.defineRule('languages.Halfling',
      'race', '=', 'source.match(/Halfling/) ? 1 : null'
    );

  }

};

/* Replaces spell names with longer descriptions on the character sheet. */
Pathfinder.spellRules = function(rules, spells, descriptions) {
  SRD35.spellRules(rules, spells, descriptions);
  var notes = rules.getChoices('notes');
  // SRD35 uses wisdomModifier when calculating the save DC for Paladin
  // spells; in Pathfinder we override to use charismaModifier.
  for(var note in notes) {
    var matchInfo = note.match(/^spells.*\(P([\d+])/);
    if(!matchInfo)
      continue;
    var level = matchInfo[1];
    matchInfo = notes[note].match(/\(DC %(\d+)/);
    if(!matchInfo)
      continue;
    rules.defineRule(note + '.' + matchInfo[1],
      'charismaModifier', '=', '10 + source + ' + level
    );
  }
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

/* Defines the rules related to character skills. */
Pathfinder.skillRules = function(rules, skills, subskills) {

  var allSkills = [];
  for(var i = 0; i < skills.length; i++) {
    var pieces = skills[i].split(':');
    var skill = pieces[0];
    var skillSubskills = subskills[skill];
    if(skillSubskills == null) {
      allSkills[allSkills.length] = skills[i];
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
    Pathfinder.defineSkill
      (rules, skill, ability, pieces[1].includes('/trained'), null);
  }

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
                    'source.match(/Heavy/) ? 2 : 1',
    '', '^', '0'
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

};

/* Defines the rules related to (optional) character traits. */
Pathfinder.traitRules = function(rules, name, type, subtype) {

  rules.defineRule('features.' + name, 'traits.' + name, '=', null);

  if(name == 'Armor Expert') {
    rules.defineRule('skillNotes.armorSkillCheckPenalty',
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
  } else if(name == 'Deft Dodger') {
    notes = ['saveNotes.deftDodgerFeature:+1 Reflex'];
    rules.defineRule('save.Reflex', 'saveNotes.deftDodgerFeature', '+', '1');
  } else if(name == 'Demon Hunter') {
    notes = [
      'skillNotes.demonHunterFeature:+3 Knowledge (Planes) wrt demons',
      'saveNotes.demonHunterFeature:+2 Will vs. demonic mental spells and effects'
    ];
  } else if(name == 'Dervish') {
    notes = ['combatNotes.dervishFeature:+1 AC vs. move AOO'];
  } else if(name == 'Desert Child') {
    notes = [
      'saveNotes.desertChildFeature:+4 heat stamina, +1 vs. fire effects'
    ];
  } else if(name == 'Desert Shadow') {
    notes = ['skillNotes.desertShadowFeature:Full speed Stealth in desert'];
  } else if(name == 'Devil\'s Mark') {
    notes = [
      'skillNotes.devil\'sMarkFeature:+2 Bluff, Diplomacy, Intimidate, Sense Motive with evil outsiders'
    ];
  } else if(name == 'Devotee Of The Green') {
    notes = [
      'skillNotes.devoteeOfTheGreenFeature:+1 Knowledge (Geography)/Knowledge (Nature)/choice is class skill'
    ];
  } else if(name == 'Dirty Fighter') {
    notes = ['combatNotes.dirtyFighterFeature:+1 damage when flanking'];
  } else if(name == 'Divine Courtesan') {
    notes = [
      'skillNotes.divineCourtesanFeature:+1 Diplomacy (gather information)/Sense Motive/choice is class skill'
    ];
  } else if(name == 'Divine Warrior') {
    notes = ['magicNotes.divineWarriorFeature:Enspelled weapons +1 damage'];
  } else if(name == 'Dunewalker') {
    notes = [
      'abilityNotes.dunewalkerFeature:Normal movement through sand',
      'saveNotes.dunewalkerFeature:+4 Fort vs heat'
    ];
  } else if(name == 'Ear For Music') {
    notes = [
      'skillNotes.earForMusicFeature:+1 Perform choice/+2 Knowledge (Local) (art, music)'
    ];
  } else if(name == 'Ease Of Faith') {
    notes = ['skillNotes.easeOfFaithFeature:+1 Diplomacy/is class skill'];
    rules.defineRule
      ('classSkills.Diplomacy', 'skillNotes.easeOfFaithFeature', '=', '1');
  } else if(name == 'Eastern Mysteries') {
    notes = ['magicNotes.easternMysteriesFeature:+2 spell DC 1/day'];
  } else if(name == 'Elven Reflexes') {
    notes = ['combatNotes.elvenReflexesFeature:+2 Initiative'];
    rules.defineRule
      ('initiative', 'combatNotes.elvenReflexesFeature', '+', '2');
  } else if(name == 'Exile') {
    notes = ['combatNotes.exileFeature:+2 Initiative'];
    rules.defineRule('initiative', 'combatNotes.exileFeature', '+', '2');
  } else if(name == 'Expert Duelist') {
    notes = ['combatNotes.expertDuelistFeature:+1 AC, CMD vs. single foe'];
    rules.defineRule
      ('armorClass', 'combatNotes.expertDuelistFeature', '+', '1');
    rules.defineRule
      ('combatManeuverDefense', 'combatNotes.expertDuelistFeature', '+', '1');
  } else if(name == 'Explorer') {
    notes = ['skillNotes.explorerFeature:+1 Survival/is class skill'];
    rules.defineRule
      ('classSkills.Survival', 'skillNotes.explorerFeature', '=', '1');
  } else if(name == 'Eyes And Ears Of The City') {
    notes = [
      'skillNotes.eyesAndEarsOfTheCityFeature:+1 Perception/is class skill'
    ];
    rules.defineRule('classSkills.Perception',
      'skillNotes.eyesAndEarsOfTheCityFeature', '=', '1'
    );
  } else if(name == 'Faction Freedom Fighter') {
    notes = [
      'combatNotes.factionFreedomFighterFeature:+1 surprise attack',
      'skillNotes.factionFreedomFighterFeature:+1 Stealth'
    ];
  } else if(name == 'Failed Apprentice') {
    notes = ['saveNotes.failedApprenticeFeature:+1 vs. arcane spells'];
  } else if(name == 'Fashionable') {
    notes = [
      'skillNotes.fashionableFeature:+1 Bluff, Diplomacy, Sense Motive when well-dressed/choice is class skill'
    ];
  } else if(name == 'Fast-Talker') {
    notes = ['skillNotes.fast-TalkerFeature:+1 Bluff/is class skill'];
    rules.defineRule
      ('classSkills.Bluff', 'skillNotes.fast-TalkerFeature', '=', '1');
  } else if(name == 'Fencer') {
    notes = ['combatNotes.fencerFeature:+1 attack on AOO with blades'];
  } else if(name == 'Fiendish Presence') {
    notes = [
      'skillNotes.fiendishPresenceFeature:+1 Diplomacy/Sense Motive/choice is class skill'
    ];
  } else if(name == 'Fires Of Hell') {
    notes = [
      'combatNotes.firesOfHellFeature:Flaming blade +1 damage %V rd 1/day'
    ];
    rules.defineRule
      ('combatNotes.firesOfHellFeature', 'charismaModifier', '=', null);
  } else if(name == 'Flame Of The Dawnflower') {
    notes = [
      'combatNotes.flameOfTheDawnflowerFeature:+2 scimitar critical damage'
    ];
  } else if(name == 'Focused Mind') {
    notes = ['magicNotes.focusedMindFeature:+2 concentration checks'];
  } else if(name == 'Force For Good') {
    notes = [
      'spellNotes.forceForGoodFeature:+1 caster level on good-aligned spells'
    ];
  } else if(name == 'Forlorn') {
    notes = ['saveNotes.forlornFeature:+1 Fortitude'];
    rules.defineRule('save.Fortitude', 'saveNotes.forlornFeature', '+', '1');
  } else if(name == 'Fortified') {
    notes = [
      'combatNotes.fortifiedFeature:20% chance to negate critical hit or sneak attack 1/day'
    ];
  } else if(name == 'Fortified Drinker') {
    notes = [
      'saveNotes.fortifiedDrinkerFeature:+2 vs mental effect 1 hr after drinking'
    ];
  } else if(name == 'Freedom Fighter') {
    notes = [
      'combatNotes.freedomFighterFeature:+1 attack during escape',
      'skillNotes.freedomFighterFeature:+1 skills during escape/Escape Artist is class skill'
    ];
    rules.defineRule('classSkills.Escape Artist',
      'skillNotes.halflingFreedomFighterFeature', '=', '1'
    );
  } else if(name == 'Gifted Adept') {
    notes = ['magicNotes.giftedAdeptFeature:+1 caster level on chosen spell'];
  } else if(name == 'Gold Finger') {
    notes = [
      'skillNotes.goldFingerFeature:+1 Disable Device/Sleight Of Hand/choice is class skill'
    ];
  } else if(name == 'Goldsniffer') {
    notes = [
      'skillNotes.goldsnifferFeature:+2 Perception (metals, jewels, gems)'
    ];
  } else if(name == 'Greasy Palm') {
    notes = ['featureNotes.greasyPalmFeature:10% discount on bribes'];
  } else if(name == 'Guardian Of The Forge') {
    notes = [
      'skillNotes.guardianOfTheForgeFeature:+1 Knowledge (Engineering)/Knowledge (History)/choice is class skill'
    ];
  } else if(name == 'Hedge Magician') {
    notes = [
      'magicNotes.hedgeMagicianFeature:5% discount on magic craft cost'
    ];
  } else if(name == 'Highlander') {
    notes = [
      'skillNotes.highlanderFeature:+1 Stealth/+2 Stealth (hilly and rocky areas)/is class skill'
    ];
    rules.defineRule
      ('classSkills.Stealth', 'skillNotes.highlanderFeature', '=', '1');
  } else if(name == 'History Of Heresy') {
    notes = ['saveNotes.historyOfHeresyFeature:+1 vs. divine spells'];
  } else if(name == 'Horse Lord') {
    notes = ['skillNotes.horseLordFeature:+2 Ride/is class skill'];
    rules.defineRule
      ('classSkills.Ride', 'skillNotes.horseLordFeature', '=', '1');
  } else if(name == 'Hunter\'s Eye') {
    notes = [
      'combatNotes.hunter\'sEyeFeature:No penalty for longbow/shortbow 2nd range increment/proficiency in choice'
    ];
  } else if(name == 'I Know A Guy') {
    notes = [
      'skillNotes.iKnowAGuyFeature:+1 Knowledge (Local)/+2 Diplomacy (gather information)'
    ];
  } else if(name == 'Impressive Presence') {
    notes = [
      'combatNotes.impressivePresenceFeature:Adjacent foes shaken 1 rd 1/day (DC %V Will neg)'
    ];
    rules.defineRule('combatNotes.impressivePresenceFeature',
      'level', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Indomitable') {
    notes = ['saveNotes.indomitableFeature:+1 vs. enchantment'];
  } else if(name == 'Indomitable Faith') {
    notes = ['saveNotes.indomitableFaithFeature:+1 Will'];
    rules.defineRule
      ('save.Will', 'saveNotes.indomitableFaithFeature', '+', '1');
  } else if(name == 'Influential') {
    notes = [
      'magicNotes.influentialFeature:+1 DC on language-dependent spell 1/day',
      'skillNotes.influentialFeature:+3 Diplomacy (requests)'
    ];
  } else if(name == 'Insider Knowledge') {
    notes = [
      'skillNotes.insiderKnowledgeFeature:+1 choice of Diplomacy, Knowledge (Local)/is class skill'
    ];
  } else if(name == 'Killer') {
    notes = ['combatNotes.killerFeature:Extra damage on critical hit'];
  } else if(name == 'Librarian') {
    notes = [
      'skillNotes.librarianFeature:+1 Linguistics/Profession (Librarian)/choice is class skill/+1 reading bonus 1/day'
    ];
  } else if(name == 'Log Roller') {
    notes = [
      'combatNotes.logRollerFeature:+1 CMD vs. trip',
      'skillNotes.logRollerFeature:+1 Acrobatics'
    ];
  } else if(name == 'Lore Seeker') {
    notes = [
      'magicNotes.loreSeekerFeature:+1 caster level on 3 spells',
      'skillNotes.loreSeekerFeature:+1 Knowledge (Arcana)/is class skill'
    ];
    rules.defineRule('classSkills.Knowledge (Arcana)',
      'skillNotes.loreSeekerFeature', '=', '1'
    );
  } else if(name == 'Loyalty') {
    notes = ['saveNotes.loyaltyFeature:+1 vs enchantment'];
  } else if(name == 'Magic Is Life') {
    notes = [
      'saveNotes.magicIsLifeFeature:+2 vs. death effects when enspelled/stabilize automatically'
    ];
  } else if(name == 'Magical Knack') {
    notes = ['magicNotes.magicalKnackFeature:+2 caster level (max %V)'];
    rules.defineRule('magicNotes.magicalKnackFeature', 'level', '=', null);
  } else if(name == 'Magical Lineage') {
    notes = [
      'magicNotes.magicalLineageFeature:-1 spell level for chosen spell metamagic'
    ];
  } else if(name == 'Magical Talent') {
    notes = ['magicNotes.magicalTalentFeature:Use chosen cantrip 1/day'];
  } else if(name == 'Master Of Pentacles') {
    notes = [
      'magicNotes.masterOfPentaclesFeature:+2 Conjuration spell caster level 1/day'
    ];
  } else if(name == 'Mathematical Prodigy') {
    notes = [
      'skillNotes.mathematicalProdigyFeature:+1 Knowledge (Arcana)/Knowledge (Engineering)/choice is class skill'
    ];
  } else if(name == 'Medic') {
    notes = [
      'magicNotes.medicFeature:+1 caster level with <i>Remove</i> healing',
      'skillNotes.medicFeature:+2 Heal (disease, poison)'
    ];
  } else if(name == 'Meridian Strike') {
    notes = ['combatNotes.meridianStrikeFeature:Reroll crit damage 1s 1/day'];
  } else if(name == 'Meticulous Artisan') {
    notes = ['skillNotes.meticulousArtisanFeature:+1 Craft for day job'];
  } else if(name == 'Militia Veteran') {
    notes = [
      'skillNotes.militiaVeteranFeature:+1 choice of Profession (Soldier), Ride, Survival/is class skill'
    ];
  } else if(name == 'Mind Over Matter') {
    notes = ['saveNotes.mindOverMatterFeature:+1 Will'];
    rules.defineRule
      ('save.Will', 'saveNotes.mindOverMatterFeature', '+', '1');
  } else if(name == 'Missionary') {
    notes = [
      'magicNotes.missionaryFeature:+1 caster level on 3 spells',
      'skillNotes.missionaryFeature:+1 Knowledge (Religion)/is class skill'
    ];
    rules.defineRule('classSkills.Knowledge (Religion)',
      'skillNotes.missionaryFeature', '=', '1'
    );
  } else if(name == 'Mummy-Touched') {
    notes = ['saveNotes.mummy-TouchedFeature:+2 vs. curse, disease'];
  } else if(name == 'Natural Negotiator') {
    notes = [
      'featureNotes.naturalNegotiatorFeature:Additional language',
      'skillNotes.naturalNegotiatorFeature:Choice of Diplomacy, Handle Animal is a class skill'
    ];
  } else if(name == 'Natural-Born Leader') {
    notes = [
      'featureNotes.natural-BornLeaderFeature:+1 Leadership score',
      "saveNotes.natural-BornLeaderFeature:+1 followers' Will vs. mind-altering effects"
    ];
  } else if(name == 'Observant') {
    notes = [
      'skillNotes.observantFeature:+1 choice of Perception, Sense Motive/is class skill'
    ];
  } else if(name == 'Outcast') {
    notes = ['skillNotes.outcastFeature:+1 Survival/is class skill'];
    rules.defineRule
      ('classSkills.Survival', 'skillNotes.outcastFeature', '=', '1');
  } else if(name == 'Patient Optimist') {
    notes = [
      'skillNotes.patientOptimistFeature:+1 Diplomacy, 1 retry on unfriendly or hostile'
    ];
  } else if(name == 'Performance Artist') {
    notes = [
      'skillNotes.performanceArtistFeature:+1 choice of Perform/is class skill'
    ];
  } else if(name == 'Planar Voyager') {
    notes = [
      'combatNotes.planarVoyagerFeature:+1 Initiative off PM plane',
      'saveNotes.planarVoyagerFeature:+1 saves off PM plane',
    ];
  } else if(name == 'Poverty-Stricken') {
    notes = ['skillNotes.poverty-StrickenFeature:+1 Survival/is class skill'];
    rules.defineRule('classSkills.Survival',
      'skillNotes.poverty-StrickenFeature', '=', '1'
    );
  } else if(name == 'Proper Training') {
    notes = [
      'skillNotes.properTrainingFeature:+1 choice of Knowledge (Geography), Knowledge (History)/is class skill'
    ];
  } else if(name == 'Rapscallion') {
    notes = [
      'combatNotes.rapscallionFeature:+1 Initiative',
      'skillNotes.rapscallionFeature:+1 Escape Artist'
    ];
    rules.defineRule
      ('initiative', 'combatNotes.rapscallionFeature', '+', '1');
  } else if(name == 'Reactionary') {
    notes = ['combatNotes.reactionaryFeature:+2 Initiative'];
    rules.defineRule
      ('initiative', 'combatNotes.reactionaryFeature', '+', '2');
  } else if(name == 'Reverent Wielder') {
    notes = [
      'combatNotes.reverentWielderFeature:+1 disarm, steal, sunder CMD',
      'saveNotes.reverentWielderFeature:Equipment +1 saves'
    ];
  } else if(name == 'Resilient') {
    notes = ['saveNotes.resilientFeature:+1 Fortitude'];
    rules.defineRule
      ('save.Fortitude', 'saveNotes.resilientFeature', '+', '1');
  } else if(name == 'Rich Parents') {
    notes = ['featureNotes.richParentsFeature:Start w/900 GP'];
  } else if(name == 'River Rat') {
    notes = [
      'combatNotes.riverRatFeature:+1 damage w/daggers',
      'skillNotes.riverRatFeature:+1 Swim/is class skill'
    ];
    rules.defineRule
      ('classSkills.Swim', 'skillNotes.riverRatFeature', '=', '1');
  } else if(name == 'Rousing Oratory') {
    notes = [
      "skillNotes.rousingOratoryFeature:Choice of Perform is class skill/DC 15 gives allies w/in 60' +1 or better vs. fear 5 min 1/day"
    ];
  } else if(name == 'Sacred Conduit') {
    notes = ['magicNotes.sacredConduitFeature:+1 channeled energy save DC'];
  } else if(name == 'Sacred Touch') {
    notes = ['magicNotes.sacredTouchFeature:Touch stabilizes'];
  } else if(name == 'Savanna Child') {
    notes = [
      'skillNotes.savannaChildFeature:+1 choice of Handle Animal, Knowledge (Nature), Ride/is class skill'
    ];
  } else if(name == 'Scholar Of Balance') {
    notes = [
      'skillNotes.scholarOfBalanceFeature:+1 Knowledge (Nature)/Knowledge (Planes)/choice is class skill'
    ];
  } else if(name == 'Scholar Of Ruins') {
    notes = [
      'skillNotes.scholarOfRuinsFeature:+1 Knowledge (Dungeoneering)/Knowledge (Geography)/choice is class skill'
    ];
  } else if(name == 'Scholar Of The Great Beyond') {
    notes = [
      'skillNotes.scholarOfTheGreatBeyondFeature:+1 Knowledge (History)/Knowledge (Planes)/choice is class skill'
    ];
  } else if(name == 'Secrets Of The Sphinx') {
    notes = [
      'skillNotes.secretsOfTheSphinxFeature:+2 Knowledge check 1/day/choice of Knowledge is class skill'
    ];
  } else if(name == 'Shadow Diplomat') {
    notes = [
      'skillNotes.shadowDiplomatFeature:+1 Diplomacy/is class skill'
    ];
    rules.defineRule
      ('classSkill.Diplomacy', 'skillNotes.shadowDiplomatFeature', '=', '1');
  } else if(name == 'Sheriff') {
    notes = [
      'skillNotes.sheriffFeature:+10 local Bluff, Diplomacy, Intimidate 1/session'
    ];
  } else if(name == 'Shiv') {
    notes = ['combatNotes.shivFeature:+1 surprise piercing/slashing damage'];
  } else if(name == 'Skeptic') {
    notes = ['saveNotes.skepticFeature:+2 vs. illusions'];
  } else if(name == 'Smuggler') {
    notes = [
      'skillNotes.smugglerFeature:+3 Sleight Of Hand (hide object)/is class skill'
    ];
    rules.defineRule('classSkill.Sleight Of Hand',
      'skillNotes.smugglerFeature', '=', '1'
    );
  } else if(name == 'Soul Drinker') {
    notes = [
      "combatNotes.soulDrinkerFeature:Gain HP equal to slain foe's hit dice 1 min 1/day"
    ];
  } else if(name == 'Starchild') {
    notes = ['skillNotes.starchildFeature:+4 Survival (avoid becoming lost), know North'];
  } else if(name == 'Storyteller') {
    notes = [
      'skillNotes.storytellerFeature:+%V choice of Knowledge check 1/scenario'
    ];
    rules.defineRule('skillNotes.storytellerFeature',
      'intelligenceModifier', '=', 'Math.max(source + 3, 1)'
    );
  } else if(name == 'Suspicious') {
    notes = ['skillNotes.suspiciousFeature:+1 Sense Motive/is class skill'];
    rules.defineRule
      ('classSkills.Sense Motive', 'skillNotes.suspiciousFeature', '=', '1');
  } else if(name == 'Tavern Owner') {
    notes = ['featureNotes.tavernOwnerFeature:10% extra from treasure sale'];
  } else if(name == 'Teaching Mistake') {
    notes = [
      'saveNotes.teachingMistakeFeature:+1 save after nat 1 save roll 1/scenario'
    ];
  } else if(name == 'Tireless') {
    notes = [
      'abilityNotes.tirelessFeature:+2 Con vs. nonlethal exertion/environ',
      'combatNotes.tirelessFeature:+1 HP'
    ];
    rules.defineRule('hitPoints', 'combatNotes.tirelessFeature', '+', '1');
  } else if(name == 'Tomb Raider') {
    notes = [
      'skillNotes.tombRaiderFeature:+1 Knowledge (Dungeoneering)/Perception/choice is class skill'
    ];
  } else if(name == 'Trouper') {
    notes = [
      'saveNotes.trouperFeature:+1 vs. Perform-related abilities',
      'skillNotes.trouperFeature:+1 choice of Perform'
    ];
  } else if(name == 'Tunnel Fighter') {
    notes = [
      'combatNotes.tunnelFighterFeature:+2 initiative, +1 critical damage underground'
    ];
  } else if(name == 'Unflappable') {
    notes = [
      'saveNotes.unflappableFeature:+1 vs. fear',
      'skillNotes.unflappableFeature:+3 resist Intimidate DC'
    ];
  } else if(name == 'Undead Slayer') {
    notes = ['combatNotes.undeadSlayerFeature:+1 damage vs. undead'];
  } else if(name == 'Upstanding') {
    notes = [
      'skillNotes.upstandingFeature:+1 Diplomacy/Sense Motive/choice is class skill'
    ];
  } else if(name == 'Unorthodox Strategy') {
    notes = [
      'skillNotes.unorthodoxStrategyFeature:+2 Acrobatics (traverse threatened squares)'
    ];
  } else if(name == 'Vagabond Child') {
    notes = [
      'skillNotes.vagabondChildFeature:+1 choice of Disable Device, Escape Artist, Sleight Of Hand/is class skill'
    ];
  } else if(name == 'Veteran Of Battle') {
    notes = [
      'combatNotes.veteranOfBattleFeature:+1 Initiative, draw weapon during surprise round'
    ];
    rules.defineRule
      ('initiative', 'combatNotes.veteranOfBattleFeature', '+', '1');
  } else if(name == 'Vindictive') {
    notes = [
      'combatNotes.vindictiveFeature:+1 damage vs. successful foe 1 min 1/day'
    ];
  } else if(name == 'Warrior Of Old') {
    notes = ['combatNotes.warriorOfOldFeature:+2 Initiative'];
    rules.defineRule
      ('initiative', 'combatNotes.warriorOfOldFeature', '+', '2');
  } else if(name == 'Watchdog') {
    notes = [
      'skillNotes.watchdogFeature:+1 Sense Motive/is class skill'
    ];
    rules.defineRule
      ('classSkill.Sense Motive', 'skillNotes.watchdogFeature', '=', '1');
  } else if(name == 'Weapon Style') {
    notes = [
      'combatNotes.weaponStyleFeature:Proficient with choice of monk weapon'
    ];
  } else if(name == 'Well-Informed') {
    notes = [
      'skillNotes.well-InformedFeature:+1 Diplomacy (gather information)/Knowledge (Local)/choice is class skill'
    ];
  } else if(name == 'Whistleblower') {
    notes = [
      'skillNotes.whistleblowerFeature:+1 Sense Motive/is class skill'
    ];
    rules.defineRule('classSkill.Sense Motive',
      'skillNotes.whistleblowerFeature', '=', '1'
    );
  } else if(name == 'Wisdom In The Flesh') {
    notes = [
      'skillNotes.wisdomInTheFleshFeature:Use Wis modifier for chosen Str/Con/Dex skill/is class skill'
    ];
  } else if(name == 'World Traveler') {
    notes = [
      'skillNotes.worldTravelerFeature:+1 choice of Diplomacy, Knowledge (Local), Sense Motive/is class skill'
    ];
  }

};

/*
 * A convenience function that adds #name# to the list of known skills in
 * #rules#.  #ability# is the three-character abbreviation for the skill's
 * primary ability ("str", "int", "dex", etc.). #trainedOnly# is a boolean
 * indicating whether only those trained in the skill can use it.
 * #classes#, if not null, is either "all" or a slash-delimited list of class
 * names, indicating the classes for which this skill is a class skill.
 */
Pathfinder.defineSkill = function(rules, name, ability, trainedOnly, classes) {

  var abilityNames = {
    'cha':'charisma', 'con':'constitution', 'dex':'dexterity',
    'int':'intelligence', 'str':'strength', 'wis':'wisdom'
  };

  rules.defineChoice('skills', name + ':' + (ability ? ability : ''));
  rules.defineRule('classSkillBump.' + name,
    'skills.' + name, '?', 'source > 0',
    'classSkills.' + name, '=', '3'
  );
  rules.defineRule('skillModifier.' + name,
    'skills.' + name, '=', 'source',
    'classSkillBump.' + name, '+', null
  );
  rules.defineNote('skills.' + name + ':(%1%2) %V (%3)');
  rules.defineRule
    ('skills.' + name + '.1', 'skills.' + name, '=', '"' + ability + '"');
  rules.defineRule('skills.' + name + '.2',
    'skills.' + name, '?', '1',
    '', '=', '";cc"',
    'classSkills.' + name, '=', '""'
  );
  rules.defineRule('skills.' + name + '.3', 'skillModifier.' + name, '=', null);

  if(ability && abilityNames[ability]) {
    rules.defineRule
      ('skillModifier.' + name, abilityNames[ability] + 'Modifier', '+', null);
    if(ability == 'dex' || ability == 'str') {
      rules.defineRule('skillModifier.' + name,
        'skillNotes.armorSkillCheckPenalty', '+', '-source'
      );
    }
  }

  if(name == 'Fly') {
    rules.defineRule('skillModifier.Fly', 'features.Large', '+', '-2');
  }
  if(name == 'Linguistics') {
    rules.defineRule('languageCount', 'skills.Linguistics', '+', null);
  }

  if(classes == 'all') {
    rules.defineRule('classSkills.' + name, 'level', '=', '1');
  } else if(classes) {
    classes = classes.split('/');
    for(var i = 0; i < classes.length; i++)
      rules.defineRule('classSkills.' + name, 'levels.'+classes[i], '=', '1');
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

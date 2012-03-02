/* $Id: Pathfinder.js,v 1.7 2012/03/02 23:57:12 jhayes Exp $ */

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

var PATHFINDER_VERSION = '0.2-20120101';

/*
 * This module loads the rules from the Pathfinder Core Rulebook.  The
 * Pathfinder function contains methods that load rules for particular parts of
 * the PCR; raceRules for character races, magicRules for spells, etc.  These
 * member methods can be called independently in order to use a subset of the
 * PCR rules.  Similarly, the constant fields of Pathfinder (ALIGNMENTS, FEATS,
 * etc.) can be manipulated to modify the choices.
 */
function Pathfinder() {

  if(window.SRD35 == null) {
    alert('The Pathfinder module requires use of the SRD35 module');
    return;
  }

  for(var attr in SRD35.spellsSchools) {
    Pathfinder.spellsSchools[attr] = SRD35.spellsSchools[attr];
  }
  delete Pathfinder.spellsSchools['Cure Minor Wounds'];
  delete Pathfinder.spellsSchools['Inflict Minor Wounds'];

  var rules = new ScribeRules('Pathfinder', PATHFINDER_VERSION);
  Pathfinder.viewer = new ObjectViewer();
  Pathfinder.createViewers(rules, SRD35.VIEWERS);
  Pathfinder.abilityRules(rules);
  Pathfinder.raceRules(
    rules, SRD35.LANGUAGES.concat(Pathfinder.LANGUAGES_ADDED), SRD35.RACES
  );
  Pathfinder.classRules(rules, SRD35.CLASSES, Pathfinder.BLOODLINES);
  Pathfinder.companionRules(rules, Pathfinder.COMPANIONS);
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
  rules.defineChoice('preset', 'race', 'level', 'levels');
  rules.defineChoice('random', SRD35.RANDOMIZABLE_ATTRIBUTES);
  rules.editorElements = SRD35.initialEditorElements();
  rules.randomizeOneAttribute = SRD35.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = Pathfinder.ruleNotes;
  Scribe.addRuleSet(rules);
  Pathfinder.rules = rules;

}

// Arrays of choices
Pathfinder.BLOODLINES = [
  'Aberrant', 'Abyssal', 'Arcane', 'Celestial', 'Destined', 'Draconic',
  'Elemental', 'Fey', 'Infernal', 'Undead'
];
Pathfinder.COMPANIONS = ['Animal Companion', 'Familiar'];
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
Pathfinder.DOMAINS_ADDED = [
  'Artifice', 'Charm', 'Community', 'Darkness', 'Glory', 'Liberation',
  'Madness', 'Nobility', 'Repose', 'Rune', 'Weather'
];
Pathfinder.FEATS = [
  'Acrobatic:', 'Acrobatic Steps:', 'Agile Maneuvers:Combat', 'Alertness:',
  'Alignment Channel:', 'Animal Affinity:', 'Arcane Armor Mastery:Combat',
  'Arcane Armor Training:Combat', 'Arcane Strike:Combat',
  'Armor Proficiency:Combat', 'Athletic:', 'Augment Summoning:',
  'Bleeding Critical:Combat/Critical', 'Blind Fight:Combat',
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
  'Diplomacy:cha', 'Disable Device:int/trained', 'Disguise:cha',
  'Escape Artist:dex', 'Fly:dex', 'Handle Animal:cha/trained',
  'Heal:wis', 'Intimidate:cha', 'Knowledge:int/trained',
  'Linguistics:int/trained', 'Perception:wis', 'Perform:cha',
  'Profession:wis/trained', 'Ride:dex', 'Sense Motive:wis',
  'Sleight Of Hand:dex/trained', 'Spellcraft:int/trained', 'Stealth:dex',
  'Survival:wis', 'Swim:str', 'Use Magic Device:cha/trained'
];
Pathfinder.SUBFEATS = {
  'Alignment Channel':'Chaos/Evil/Good/Law',
  'Armor Proficiency':'Heavy/Light/Medium',
  'Elemental Channel':'Air/Earth/Fire/Water',
  'Greater Spell Focus':'',
  'Greater Weapon Focus':'',
  'Greater Weapon Specialization':'',
  'Improved Critical':'',
  'Master Craftsman':'',
  'Rapid Reload':'Hand/Heavy/Light',
  'Shield Proficiency':'Heavy/Tower',
  'Skill Focus':'',
  'Spell Focus':'',
  'Weapon Focus':'Longsword',
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
Pathfinder.WEAPONS_ADDED = [
  'Blowgun:d2r20',
  'Elven Curve Blade:d10@18',
  'Halfling Sling Staff:d8x3r80',
  'Sai:d4', // removed range
  'Starknife:d4x3r20'
];

// Related information used internally by Pathfinder
Pathfinder.armorsArmorClassBonuses = {
  'None': null, 'Padded': 1, 'Leather': 2, 'Studded Leather': 3,
  'Chain Shirt': 4, 'Hide': 4, 'Scale Mail': 5, 'Chainmail': 6,
  'Breastplate': 6, 'Splint Mail': 7, 'Banded Mail': 7, 'Half Plate': 8,
  'Full Plate': 9
};
Pathfinder.spellsSchools = {
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
};

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
  rules.defineRule('classSkillMaxRanks', 'level', '=', null);
  rules.defineRule
    ('featCount.General', 'level', '=', 'Math.floor((source + 1) / 2)');
  rules.defineRule('skillPoints',
    '', '=', '0',
    'level', '^', null
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
        'combatNotes.greaterRageFeature:+6 strength/constitution; +3 Will',
        'combatNotes.guardedStanceFeature:+%V AC during rage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.knockbackFeature:' +
          'Successful bull rush during rage for %V damage',
        'combatNotes.mightyRageFeature:+8 strength/constitution; +4 Will save',
        'combatNotes.mightySwingFeature:Automatic critical 1/rage',
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
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_POOR;
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
        '2:Versatile Performance', '2:Well Versed', '3:Inspire Competence',
        '5:Lore Master', '6:Suggestion', '8:Dirge Of Doom',
        '9:Inspire Greatness', '10:Jack Of All Trades',
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
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_GOOD;
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

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
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

      rules.defineRule
        ('animalCompanionMasterLevel', 'levels.Druid', '+=', null);

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
        'combatNotes.weaponMasteryFeature:' +
          'Critical automatically hits/+1 damage multiplier/no disarm w/' +
          'chosen weapon',
        'combatNotes.weaponTrainingFeature:' +
          'Attack/damage bonus w/weapons from trained groups',
        'saveNotes.braveryFeature:+%V vs. fear',
        'skillNotes.armorTrainingFeature:-%V armor penalty'
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
        ('damageReduction.All', 'combatNotes.armorMasteryFeature', '+=', null);
      rules.defineRule('featCount.Combat',
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

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = [
        'Catch Off-Guard', 'Combat Reflexes', 'Deflect Arrows', 'Dodge',
        'Improved Grapple', 'Scorpion Style', 'Throw Anything',
        'Gorgon\'s Fist', 'Improved Bull Rush', 'Improved Disarm',
        'Improved Feint', 'Improved Trip', 'Mobility', 'Improved Critical',
        'Medusa\'s Wrath', 'Snatch Arrows', 'Spring Attack'
      ];
      features = [
        '1:Flurry Of Blows', '1:Two-Weapon Fighting', '1:Stunning Fist',
        '1:Unarmed Strike', '2:Evasion', '3:Fast Movement',
        '3:Maneuver Training', '3:Still Mind', '4:Ki Pool',
        '4:Magic Ki Strike', '4:Slow Fall', '5:High Jump', '5:Purity Of Body',
        '7:Wholeness Of Body', '8:Improved Two-Weapon Fighting',
        '9:Improved Evasion', '10:Lawful Ki Strike', '11:Diamond Body',
        '12:Abundant Step', '13:Diamond Soul', '15:Greater Two-Weapon Fighting',
        '15:Quivering Palm', '16:Adamantine Ki Strike', '17:Timeless Body',
        '17:Tongue Of The Sun And Moon', '19:Empty Body', '20:Perfect Self'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.adamantineKiStrikeFeature:' +
          'Treat ki strike as adamantine weapon',
        'combatNotes.flurryOfBlowsFeature:' +
          'Extra attack(s) w/monk weapon using +%V Base Attack Bonus',
        'combatNotes.greaterTwoWeaponFightingFeature:Fourth attack at -10',
        'combatNotes.improvedTwoWeaponFightingFeature:Third attack at -5',
        'featureNotes.kiPoolFeature:' +
          'Ki strike/additional attack/+20 speed/+4 AC %V/day',
        'combatNotes.lawfulKiStrikeFeature:Treat ki strike as lawful weapon',
        'combatNotes.magicKiStrikeFeature:Treat ki strike as magic weapon',
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
          'Use ki pool to <i>Dimension Door</i> at level %V',
        'magicNotes.emptyBodyFeature:' +
          'Use ki pool for 1 minute <i>Etherealness</i>',
        'magicNotes.wholenessOfBodyFeature:' +
          'Use ki pool to heal %V damage to self/day',
        'saveNotes.diamondBodyFeature:Immune to poison',
        'saveNotes.diamondSoulFeature:DC %V spell resistance',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of half',
        'saveNotes.improvedEvasionFeature:Failed save yields half damage',
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
      rules.defineRule
        ('combatNotes.flurryOfBlowsFeature', 'levels.Monk', '=', null);
      rules.defineRule
        ('armorClass', 'combatNotes.monkArmorClassAdjustment', '+', null);
      rules.defineRule('combatManeuverDefense',
        'combatNotes.monkArmorClassAdjustment', '+', null
      );
      rules.defineRule('combatNotes.monkArmorClassAdjustment',
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

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
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
        'combatNotes.divineWeaponFeature:' +
          'Add %V enhancements to weapon for %1 minutes %2/day',
        'combatNotes.smiteEvilFeature:' +
          '+%V attack/+%1 damage/+%2 AC vs. evil foe %3/day',
        'featureNotes.divineMountFeature:Special bond/abilities',
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

      rules.defineRule('animalCompanionMasterLevel',
        'levels.Paladin', '+=', 'Math.floor((source + 3) / 3)'
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
        '3:Favored Terrain', '4:Hunter\'s Bond', '7:Woodland Stride',
        '8:Swift Tracker', '9:Evasion', '11:Quarry', '12:Camouflage',
        '16:Improved Evasion', '17:Hide In Plain Sight', '19:Improved Quarry',
        '20:Master Hunter'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.favoredEnemyFeature:' +
          '+2 or more attack/damage vs. %V type(s) of creatures',
        'combatNotes.favoredTerrainFeature:+2 initiative in %V terrain type(s)',
        'combatNotes.hunter\'sBondFeature:' +
          'half favored enemy bonus to allies w/in 30 ft for %V rounds',
        'combatNotes.masterHunterFeature:' +
          'Full attack vs. favored enemy requires DC %V Fortitude save or die',
        'combatNotes.quarryFeature:+%V attack/automatic critical vs. target',
        'featureNotes.hunter\'sBond:Animal companion w/pecial bond/abilities',
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
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals',
        'validationNotes.greaterTwoWeaponFightingSelectableFeatureFeatures:' +
           'Requires Combat Style (Two-Weapon Combat)',
        'validationNotes.greaterTwoWeaponFightingSelectableFeatureLevels:' +
           'Requires Ranger >= 10',
        'validationNotes.improvedPreciseShotSelectableFeatureFeatures:' +
           'Requires Combat Style (Archery)',
        'validationNotes.improvedPreciseShotSelectableFeatureLevels:' +
           'Requires Ranger >= 6',
        'validationNotes.improvedTwoWeaponFightingSelectableFeatureFeatures:' +
           'Requires Combat Style (Two-Weapon Combat)',
        'validationNotes.improvedTwoWeaponFightingSelectableFeatureLevels:' +
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
        'Combat Style (Archery)', 'Combat Style (Two-Weapon Combat)',
        'Far Shot', 'Point Blank Shot', 'Precise Shot', 'Rapid Shot',
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
        'levels.Ranger', '+=', '1 + Math.floor((source + 2) / 5)'
      );
      rules.defineRule
        ('combatNotes.hunter\'sBondFeature', 'wisdomModifier', '=', null);
      rules.defineRule('combatNotes.masterHunterFeature',
        'levels.Ranger', '=', 'Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.quarryFeature',
        '', '=', '2',
        'features.Improved Quarry', '^', '4'
      );
      rules.defineRule('selectableFeatureCount.Ranger',
        'levels.Ranger', '=', 'source >= 2 ? 1 : null'
      );
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('skillNotes.favoredTerrainFeature',
        'levels.Ranger', '+=', '1 + Math.floor((source + 2) / 5)'
      );
      rules.defineRule('skillNotes.quarryFeature',
        '', '=', '10',
        'features.Improved Quarry', '^', '20'
      );
      rules.defineRule('skillNotes.trackFeature',
        'levels.Ranger', '+=', 'Math.min(1, Math.floor(source / 2))'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Ranger', '+=', null,
        'charismaModifier', '+', null
      );

      rules.defineRule('animalCompanionMasterLevel',
        'levels.Ranger', '+=', 'source<4 ? null : Math.floor(source / 3)'
      );

    } else if(klass == 'Rogue') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Sneak Attack', '1:Trapfinding', '2:Evasion', '3:Trap Sense',
        '4:Uncanny Dodge', '8:Improved Uncanny Dodge', '20:Master Strike'
      ];
      notes = [
        'abilityNotes.rogueCrawl:Crawl at half speed',
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
          '1 minunte of %V temporary hit points when below 0 hit points 1/day',
        'combatNotes.slowReactionsFeature:' +
          'Sneak attack target no AOO for 1 round',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.standUpFeature:Stand from prone as free action',
        'combatNotes.surpriseAttackFeature:' +
          'All foes flat-footed during surprise round',
        'combatNotes.uncannyDodgeFeature:' +
          'Never flat-footed; adds dexterity modifier to AC vs. invisible foe',
        'magicNotes.dispellingAttackFeature:' +
          'Sneak attack acts as <i>Dispel Magic</i> on target',
        'magicNotes.majorMagicFeature:Cast W1 spell at level %V DC %1 2/day',
        'magicNotes.minorMagicFeature:Cast W0 spell at level %V DC %1 3/day',
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
          'Never distracted from designated skills',
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
        'Surprise Attack', 'Trap Spotter', 'Weapon Training',
        'Crippling Strike', 'Defensive Roll', 'Dispelling Attack',
        'Feat Bonus', 'Improved Evasion', 'Opportunist', 'Skill Mastery',
        'Slippery Mind'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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
      rules.defineRule('featCount.Combat', 'features.Combat Trick', '+=', '1');
      rules.defineRule
        ('featCount.General', 'features.Feat Bonus', '+=', 'null');
      rules.defineRule
        ('features.Weapon Finesse', 'features.Finesse Rogue', '=', '1');
      rules.defineRule
        ('featCount.Combat', 'features.Weapon Training', '+=', '1');
      rules.defineRule
        ('magicNotes.majorMagicFeature', 'levels.Rogue', '=', null);
      rules.defineRule
        ('magicNotes.majorMagicFeature.1', 'intelligenceModifier', '=', null);
      rules.defineRule
        ('magicNotes.minorMagicFeature', 'levels.Rogue', '=', null);
      rules.defineRule
        ('magicNotes.minorMagicFeature.1', 'intelligenceModifier', '=', null);
      rules.defineRule('selectableFeatureCount.Rogue',
        'levels.Rogue', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('skillNotes.trapfindingFeature',
        'levels.Rogue', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.trapSenseFeature',
        'levels.Rogue', '+=', 'Math.floor(source / 3)'
      );

    } else if(klass == 'Sorcerer') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = null;
      features = ['1:Eschew Materials'];
      hitDie = 6;
      notes = [
        // Aberrant
        'combatNotes.aberrantFormFeature:' +
          'Immune critical hit/sneak attack; DR 5/-',
        'combatNotes.longLimbsFeature:+%V ft touch attack range',
        'combatNotes.unusualAnatomyFeature:' +
          '%V% chance to ignore critical hit/sneak attack',
        'featureNotes.aberrantFormFeature:Blindsight 60 ft',
        'magicNotes.acidicRayFeature:Ranged touch for %Vd6 %1/day',
        'magicNotes.bloodlineAberrantFeature:Polymorph spells last 50% longer',
        'saveNotes.alienResistanceFeature:%V spell resistance',
        // Abyssal
        'abilityNotes.strengthOfTheAbyssFeature:+%V strength',
        'combatNotes.clawsFeature:TODO',
        'featureNotes.demonicMightFeature:Telepathy 60 ft',
        'magicNotes.addedSummoningsFeature:' +
          '<i>Summon Monster</i> brings additional demon/fiendish creature',
        'magicNotes.bloodlineAbyssalFeature:Summoned creatures gain DR %V/good',
        'saveNotes.demonicMightFeature:' +
          'Immune electricity/poison; resistance 10 acid/cold/fire',
        'saveNotes.demonResistancesFeature:TODO',
        // Arcane
        'magicNotes.bloodlineArcaneFeature:+1 boosted spell DC',
        // Celestial
        // Destined
        // Draconic
        // Elemental
        // Fey
        // Infernal
        // Undead
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = [
      ];
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
      rules.defineRule('featCount.Sorcerer',
        'levels.Sorcerer', '=', 'Math.floor((source - 1) / 6)'
      );
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
          '1:Arcane Bond/3:Metamagic Adept/9:New Arcana/' +
          '15:School Power/20:Arcane Apotheosis',
        'Celestial':
          '1:Heavenly Fire/3:Celestial Resistances/9:Wings Of Heaven/' +
          '15:Conviction/20:Ascension',
        'Destined':
          '1:Touch Of Destiny/3:Fated/9:It Was Meant To Be/' +
          '15:Within Reach/20:Destiny Realized',
        'Draconic':
          '1:Claws/3:Dragon Resistances/9:Breath Weapon/' +
          '15:Wings/20:Power Of Wyrms',
        'Elemental':
          '1:Elemental Ray/3:Elemental Resistance/9:Elemental Blast/' +
          '15:Elemental Movement/20:Elemental Body',
        'Fey':
          '1:Laughing Touch/3:Woodland Stride/9:Fleeting Glance/' +
          '15:Fey Magic/20:Soul Of The Fey',
        'Infernal':
          '1:Corrupting Touch/3:Infernal Rsistances/9:Hellfire/' +
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
          'Alarm/Blur/Proection From Energy/Freedom Of Movement/' +
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
        for(var j = 0; j < powers.length; j++) {
          var pieces = powers[j].split(':');
          rules.defineRule('sorcererFeatures.' + pieces[1],
            bloodlineLevelAttr, '=', 'source >= ' + pieces[0] + ' ? 1 : null'
          );
          rules.defineRule('features.' + pieces[1],
            'sorcererFeatures.' + pieces[1], '=', null
          );
        }
        rules.defineRule
          ('classSkills.' + skill, 'features.Bloodline ' + bloodline, '=', '1');
        for(var j = 0; j < spells.length; j++) {
          var spell = spells[j];
          var school = Pathfinder.spellsSchools[spell].substring(0, 4);
          rules.defineRule(
            'spells.' + spell + ' (W' + (j+1) + ' ' + school + ')',
            bloodlineLevelAttr, '=', 'source >= ' + (3 + 2 * j) + ' ? 1 : null'
          );
        }
      }
      // Aberrant
      rules.defineRule('combatNotes.longLimbsFeature',
        'levels.Sorcerer', '=', 'source >= 17 ? 15 : source >= 11 ? 10 : 5'
      );
      rules.defineRule('combatNotes.unusualAnatomyFeature',
        'levels.Sorcerer', '=', 'source >= 13 ? 50 : 25'
      );
      rules.defineRule('magicNotes.acidicRayFeature',
        'levels.Sorcerer', '=', '1 + Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.acidicRayFeature.1',
        'charismaModifier', '=', '1 + source'
      );
      rules.defineRule('saveNotes.alienResistanceFeature',
        'levels.Sorcerer', '=', 'source + 10'
      );
      // Abyssal
      rules.defineRule('abilityNotes.strengthOfTheAbyssFeature',
        'levels.Sorcerer', '=', 'source >= 17 ? 6 : source >= 13 ? 4 : 2'
      );
      rules.defineRule('magicNotes.bloodlineAbyssalFeature',
        'levels.Sorcerer', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      // Arcane
      // Celestial
      // Destined
      // Draconic
      // Elemental
      // Fey
      // Infernal
      // Undead
          
    } else if(klass == 'Wizard') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = ['Spell Mastery'];
      for(var j = 0; j < Pathfinder.FEATS.length; j++) {
        var pieces = Pathfinder.FEATS[j].split(':');
        if(pieces[1].match(/Item Creation|Metamagic/)) {
          feats[feats.length] = pieces[0];
        }
      }
      features = ['1:Arcane Bond', '1:Scribe Scroll'];
      hitDie = 6;
      notes = [
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
      selectableFeatures = null;
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
      rules.defineRule
        ('featCount.Wizard', 'levels.Wizard', '=', 'Math.floor(source / 5)');
      for(var j = 0; j < SRD35.SCHOOLS.length; j++) {
        var school = SRD35.SCHOOLS[j].split(':')[0];
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
      // TODO Specialization

      rules.defineRule
        ('familiarLevel', 'levels.Wizard', '+=', 'Math.floor(source / 2)');
      rules.defineRule('familiarMasterLevel', 'levels.Wizard', '+=', null);

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
  SRD35.combatRules(rules);
  rules.defineRule('combatManeuverBonus',
    'baseAttack', '=', null,
    'strengthModifier', '+', null,
    'features.Small', '+', '-1',
    'features.Large', '+', '1'
  );
  rules.defineRule('combatManeuverDefense',
    'baseAttack', '=', null,
    'strengthModifier', '+', null,
    'dexterityModifier', '+', null,
    'features.Small', '+', '-1',
    'features.Large', '+', '1'
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
Pathfinder.companionRules = function(rules, companions) {
  SRD35.companionRules(rules, companions);
  // Override SRD35 animal companion HD progression
  rules.defineRule('animalCompanionStats.hitDice',
    'animalCompanionMasterLevel', '=', 'source + 1 - Math.floor((source+1) / 4)'
  );
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
Pathfinder.createViewers = function(rules, viewers) {
  SRD35.createViewers(rules, viewers); // No changes
}

/* Defines the rules related to character description. */
Pathfinder.descriptionRules = function(rules, alignments, deities, genders) {
  SRD35.descriptionRules(rules, alignments, [], genders); // No changes
  CustomExamples.deityRules(rules, deities);
};

/* Defines the rules related to equipment. */
Pathfinder.equipmentRules = function(rules, armors, goodies, shields, weapons) {
  SRD35.equipmentRules(rules, armors, goodies, shields, weapons);
  // Override SRD35 skill penalty rules
  rules.defineNote('skillNotes.armorSkillCheckPenalty:' +
    '-%V dexterity- and strength-based skills'
  );
  rules.defineRule('skillNotes.armorSwimCheckPenalty',
    'skillNotes.armorSkillCheckPenalty', '=', '0'
  );
};

/* Defines the rules related to feats. */
Pathfinder.featRules = function(rules, feats, subfeats) {

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

    rules.defineRule
      ('features.Weapon Focus', /features.Weapon Focus \(/, '=', '1');
    rules.defineRule('features.Greater Weapon Focus',
      /features.Greater Weapon Focus \(/, '=', '1'
    );

    if(feat == 'Acrobatic') {
      notes = [
        'sanityNotes.acrobaticFeatSkills:Requires Acrobatics||Fly',
        'skillNotes.acrobaticFeature:+%V Acrobatics/+%1 Fly'
      ];
      rules.defineRule('skillNotes.acrobaticFeature',
        '', '=', '2',
        'skills.Acrobatics', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.acrobaticFeature.1',
        '', '=', '2',
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
        'combatNotes.agileManeuversFeature:' +
          'Combat maneuver bonus uses dexterity instead of strength',
        'sanityNotes.agileManeuversFeatAbility:' +
          'Requires Dexterity Modifier exceed Strength Modifier'
      ];
      rules.defineRule('combatNotes.dexterityCombatManeuverAdjustment',
        'combatNotes.agileManeuversFeature', '?', null,
        'dexterityModifier', '=', 'source || null'
      );
      rules.defineRule('combatNotes.strengthCombatManeuverAdjustment',
        'combatNotes.agileManeuversFeature', '*', '0'
      );
      rules.defineRule
        ('cmd', 'combatNotes.dexterityCombatManeuverAdjustment', '+', null);
    } else if(feat == 'Alertness') {
      notes = [
        'sanityNotes.alertnessFeatSkills:Requires Perception||Sense Motive',
        'skillNotes.alertnessFeature:+%V Perception/+%1 Sense Motive'
      ];
      rules.defineRule('skillNotes.alertnessFeature',
        '', '=', '2',
        'skills.Perception', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.alertnessFeature.1',
        '', '=', '2',
        'skills.Sense Motive', '+', 'source >= 10 ? 2 : null'
      );
    } else if((matchInfo = feat.match(/^Alignment Channel \((.*)\)$/))!=null) {
      notes = [
        'combatNotes.alignmentChannel(' + matchInfo[1] + ')Feature:' +
          'Channel energy to heal or harm ' + matchInfo[1] + ' outsiders'
      ];
    } else if(feat == 'Animal Affinity') {
      notes = [
        'sanityNotes.animalAffinityFeatSkills:Requires Handle Animal||Ride',
        'skillNotes.animalAffinityFeature:+%V Handle Animal/+%1 Ride'
      ];
      rules.defineRule('skillNotes.animalAffinityFeature',
        '', '=', '2',
        'skills.Handle Animal', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.animalAffinityFeature.1',
        '', '=', '2',
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
        'validationNotes.arcaneArmorTrainingFeatCasterLevelArcane:' +
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
        'sanityNotes.athleticFeatSkills:Requires Climb||Swim',
        'skillNotes.athleticFeature:+%V Climb/+%1 Swim'
      ];
      rules.defineRule('skillNotes.athleticFeature',
        '', '=', '2',
        'skills.Climb', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.athleticFeature.1',
        '', '=', '2',
        'skills.Swim', '+', 'source >= 10 ? 2 : null'
      );
    // } else if(feat == 'Augment Summoning') { // as SRD35
    } else if(feat == 'Bleeding Critical') {
      notes = [
        'combatNotes.bleedingCriticalFeature:' +
          'Critical hit causes 2d6 damage/round until healed (DC 15)',
        'validationNotes.bleedingCriticalFeatFeature:Requires Critical Focus',
        'validationNotes.bleedingCricialFeatBaseAttack:' +
          'Requires Base Attack >= 11'
      ];
    } else if(feat == 'Blind Fight') {
      notes = [
        'combatNotes.blindFightFeature:' +
          'Reroll concealed miss/no bonus to invisible foe/no skill check ' +
          'on blinded full speed move'
      ];
    } else if(feat == 'Blinding Critical') {
      notes = [
        'combatNotes.blindingCriticalFeature:' +
          'Critical hit causes permanent blindness; ' +
          'DC %V fortitude save reduces to dazzled d4 rounds',
        'validationNotes.blindingCriticalFeatFeature:Requires Critical Focus',
        'validationNotes.blindingCricialFeatBaseAttack:' +
          'Requires Base Attack >= 15'
      ];
      rules.defineRule('combatNotes.blindingCriticalFeature',
        'baseAttack', '=', '10 + source'
      );
    // } else if(feat == 'Brew Potion') { // as SRD35
    } else if(feat == 'Catch Off-Guard') {
      notes = [
        'combatNotes.catchOffGuardFeature:' +
          'No penalty for improvised weapon; unarmed opponents flat-footed'
      ];
    } else if(feat == 'Channel Smite') {
      notes = [
        'combatNotes.channelSmiteFeature:' +
          'Channel energy into weapon strike as swift action',
        'validationNotes.channelSmiteFeatFeature:Requires Channel Energy'
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
        'validationNotes.commandUndeadFeatFeature:Requires Channel Energy'
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
          'Critical hit causes permanent deafness; ' +
          'DC %V fortitude save reduces to 1 round',
        'validationNotes.deafeningCriticalFeatFeature:Requires Critical Focus',
        'validationNotes.deafeningCricialFeatBaseAttack:' +
          'Requires Base Attack >= 13'
      ];
      rules.defineRule('combatNotes.deafeningCriticalFeature',
        'baseAttack', '=', '10 + source'
      );
    } else if(feat == 'Deceitful') {
      notes = [
        'sanityNotes.deceitfulFeatSkills:Requires Bluff||Disguise',
        'skillNotes.deceitfulFeature:+%V Bluff/+%1 Disguise'
      ];
      rules.defineRule('skillNotes.deceitfulFeature',
        '', '=', '2',
        'skills.Bluff', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.deceitfulFeature.1',
        '', '=', '2',
        'skills.Disguise', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Defensive Combat Training') {
      notes = ['combatNotes.defensiveCombatTrainingFeature:+%V CMD'];
      rules.defineRule('combatNotes.defensiveCombatTrainingFeature',
        'level', '=', null,
        'baseAttack', '+', '-source'
      );
      rules.defineRule
        ('cmd', 'combatNotes.defensiveCombatTrainingFeature', '+', null);
    // } else if(feat == 'Deflect Arrows') { // as SRD35
    } else if(feat == 'Deft Hands') {
      notes = [
        'sanityNotes.deftHandsFeatSkills:' +
          'Requires Disable Device||Sleight Of Hand',
        'skillNotes.deftHandsFeature:+%V Disable Device/+%1 Sleight Of Hand'
      ];
      rules.defineRule('skillNotes.deftHandsFeature',
        '', '=', '2',
        'skills.Disable Device', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.deftHandsFeature.1',
        '', '=', '2',
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
        'validationNotes.doubleSliceFeatFeature:Requires Two-Weapon Fighting'
      ];
    } else if((matchInfo = feat.match(/^Elemental Channel \((.*)\)$/)) != null){
      notes = [
        'combatNotes.elementalChannel(' + matchInfo[1] + ')Feature:' +
          'Channel energy to heal or harm ' + matchInfo[1] + ' outsiders'
      ];
    // } else if(feat == 'Empower Spell') { // as SRD35
    // } else if(feat == 'Endurance') { // as SRD35
    // } else if(feat == 'Enlarge Spell') { // as SRD35
    // } else if(feat == 'Eschew Materials') { // as SRD35
    } else if(feat == 'Exhausting Critical') {
      notes = [
        'combatNotes.exhaustingCriticalFeature:' +
          'Critical hit causes foe exhaustion',
        'validationNotes.exhaustingCriticalFeatFeature:' +
          'Requires Critical Focus/Tiring Critical',
        'validationNotes.exhaustingCricialFeatBaseAttack:' +
          'Requires Base Attack >= 15'
      ];
    // } else if(feat == 'Extend Spell') { // as SRD35
    } else if(feat == 'Extra Channel') {
      notes = [
        'magicNotes.extraChannelFeature:Channel energy +2/day',
        'validationNotes.extraChannelFeatFeature:Requires Channel Energy'
      ];
      rules.defineRule('magicNotes.channelEnergyFeature.2',
        'magicNotes.extraChannelFeature', '+', '2'
      );
    } else if(feat == 'Extra Ki') {
      notes = [
        'featureNotes.extraKiFeature:+2 Ki pool',
        'validationNotes.extraKiFeatFeature:Requires Ki Pool'
      ];
      rules.defineRule('featureNotes.kiPoolFeature',
        'featureNotes.extraKiFeature', '+', '2'
      );
    } else if(feat == 'Extra Lay On Hands') {
      notes = [
        'magicNotes.extraLayOnHandsFeature:Lay On Hands +2/day',
        'validationNotes.extraLayOnHandsFeatFeature:Requires Lay On Hands'
      ];
      rules.defineRule('magicNotes.layOnHandsFeature.1',
        'magicNotes.extraLayOnHandsFeature', '+', '2'
      )
    } else if(feat == 'Extra Mercy') {
      notes = [
        'magicNotes.extraMercyFeature:Lay On Hands gives Mercy effect',
        'validationNotes.extraMercyFeatFeature:Requires Lay On Hands/Mercy'
      ];
    } else if(feat == 'Extra Performance') {
      notes = [
        'featureNotes.extraPerformanceFeature:' +
          'Use Barding Performance extra 6 rounds/day',
        'validationNotes.extraPerformanceFeatFeature:' +
          'Requires Bardic Performance'
      ];
      rules.defineRule('featureNotes.bardicPerformanceFeature',
        'featureNotes.extraPerformanceFeature', '+', '6'
      );
    } else if(feat == 'Extra Rage') {
      notes = [
        'featureNotes.extraRageFeature:Rage extra 6 rounds/day',
        'validationNotes.extraRageFeatFeature:Requires Rage'
      ];
      rules.defineRule('combatNotes.rageFeature.1',
        'featureNotes.extraRageFeature', '+', '6'
      );
    } else if(feat == 'Far Shot') {
      notes = [
        'combatNotes.farShotFeature:-1 range penalty',
        'validationNotes.farShotFeatFeatures:Requires Point Blank Shot'
      ];
    } else if(feat == 'Fleet') {
      notes = [
        'abilityNotes.fleetFeature:+%V speed in light/no armor'
      ];
      rules.defineRule('speed', 'fleetFeature', '+', '5');
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
          '+2 bull rush checks; AOO on bull rushed foes',
        'validationNotes.greaterBullRushFeatAbility:Requires Strength >= 13',
        'validationNotes.greaterBullRushFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterBullRushFeatFeatures:' +
          'Requires Improved Bull Rush/Power Attack'
      ];
    } else if(feat == 'Greater Disarm') {
      notes = [
        'combatNotes.greaterDisarmFeature:' +
          '+2 disarm checks; disarmed weapons land 15 ft away',
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
          '+2 grapple checks; grapple check is move action',
        'validationNotes.greaterGrappleFeatAbility:Requires Dexterity >= 13',
        'validationNotes.greaterGrappleFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterGrappleFeatFeatures:' +
          'Requires Improved Grapple/Improved Unarmed Strike'
      ];
    } else if(feat == 'Greater Overrun') {
      notes = [
        'combatNotes.greaterOverrunFeature:' +
          '+2 overrun checks; AOO on overrun foes',
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
          '+2 sunder checks;foe takes excess damage',
        'validationNotes.greaterSunderFeatAbility:Requires Strength >= 13',
        'validationNotes.greaterSunderFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterSunderFeatFeatures:' +
          'Requires Improved Sunder/Power Attack'
      ];
    } else if(feat == 'Greater Trip') {
      notes = [
        'combatNotes.greaterTripFeature:+2 trip checks; AOO on tripped foes',
        'validationNotes.greaterTripFeatAbility:Requires Intelligence >= 13',
        'validationNotes.greaterTripFeatBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.greaterTripFeatFeatures:' +
          'Requires Combat Expertise/Improved Trip'
      ];
    } else if(feat == 'Greater Two-Weapon Fighting') {
      notes = [
        'combatNotes.greaterTwoWeaponFightingFeature:' +
          'Third attack with off-hand weapon at -10 attack',
        'validationNotes.greaterTwoWeaponFightingFeatAbility:' +
          'Requires Dexterity >= 19',
        'validationNotes.greaterTwoWeaponFightingFeatBaseAttack:' +
          'Requires Base Attack >= 11',
        'validationNotes.greaterTwoWeaponFightingFeatFeatures:' +
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
          'No AOO on Bull Rush; +2 Bull Rush check; +2 Bull Rush CMD',
        'validationNotes.improvedBullRushFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedBullRushFeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.improvedBullRushFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Channel') {
      notes = [
        'magicNotes.improvedChannelFeature:+2 DC on channeled energy',
        'validationNotes.improvedChannelFeatFeature:Requires Channel Energy'
      ];
    // } else if(feat == 'Improved Counterspell') { // as SRD35
    // } else if((matchInfo = feat.match(/^Improved Critical \((.*)\)$/)) != null){ // as SRD35
    } else if(feat == 'Improved Disarm') {
      notes = [
        'combatNotes.improvedDisarmFeature:' +
          'No AOO on Disarm; +2 Disarm check; +2 Disarm CMD',
        'validationNotes.improvedDisarmFeatAbility:Requires Intelligence >= 13',
        'validationNotes.improvedDisarmFeatFeatures:Requires Combat Expertise'
      ];
    // } else if(feat == 'Improved Familiar') { // as SRD35
    // } else if(feat == 'Improved Feint') { // as SRD35
    } else if(feat == 'Improved Grapple') {
      notes = [
        'combatNotes.improvedGrappleFeature:' +
          'No AOO on Grapple; +2 Grapple check; +2 Grapple CMD',
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
          'No AOO on Overrun; +2 Overrun check; +2 Overrun CMD; ' +
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
          'No AOO on Sunder; +2 Sunder check; +2 Sunder CMD',
        'validationNotes.improvedSunderFeatAbility:Requires Strength >= 13',
        'validationNotes.improvedSunderFeatBaseAttack:',
          'Requires Base Attack >= 1',
        'validationNotes.improvedSunderFeatFeatures:Requires Power Attack'
      ];
    } else if(feat == 'Improved Trip') {
      notes = [
        'combatNotes.improvedTripFeature:' +
          'No AOO on Trip; +2 Trip check; +2 Trip CMD',
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
          'No penalties for improvised weapons; ' +
          'improvised weapon damage +step, critical x2@19',
        'validationNotes.improvisedWeaponMasteryFeatBaseAttack:' +
          'Requires Base Attach >= 8',
        'validationNotes.improvisedWeaponMasteryFeatFeatures:' +
          'Requires Catch Off-Guard||Throw Anything'
      ];
    } else if(feat == 'Intimidating Prowess') {
      notes = [
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
          'Requires Spellcraft||Use Magic Device',
        'skillNotes.magicalAptitudeFeature:+%V Spellcraft/+%1 Use Magic Device'
      ];
      rules.defineRule('skillNotes.magicalAptitudeFeature',
        '', '=', '2',
        'skills.Spellcraft', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.magicalAptitudeFeature.1',
        '', '=', '2',
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
          '2 extra unarmed attacks vs. diminshed-capacity foe',
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
        'combatNotes.greaterPenetratingStrikeFeature:' +
          'Focused weapons ignore DR 5/anything',
        'validationNotes.penetratingStrikeFeatBaseAttack:' +
          'Requires Base Attack >= 1',
        'validationNotes.penetratingStrikeFeatLevels:Requires Fighter >= 12',
        'validationNotes.penetratingStrikeFeatFeatures:Requires Weapon Focus'
      ];
    } else if(feat == 'Persuasive') {
      notes = [
        'sanityNotes.persuasiveFeatSkills:Requires Diplomacy||Intimidate',
        'skillNotes.persuasiveFeature:+%V Diplomacy/+%1 Intimidate'
      ];
      rules.defineRule('skillNotes.persuasiveFeature',
        '', '=', '2',
        'skills.Diplomacy', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.persuasiveFeature.1',
        '', '=', '2',
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
        ('runSpeedMultiplier', 'combatNotes.runFeature', '+', '1');
    } else if(feat == 'Scorpion Style') {
      notes = [
        'combatNotes.scorpionStyleFeature:' +
          'Unarmed hit slows foe for %V rounds; DC %1 fortitude negates',
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
        'validationNotes.selectiveChannelingFeatFeature:Requires Channel Energy'
      ];
      rules.defineRule('magicNotes.selectiveChannelingFeature',
        'wisdomModifier', '=', null
      );
    } else if(feat == 'Self Sufficient') {
      notes = [
        'sanityNotes.selfSufficientFeatSkills:Requires Heal||Survival',
        'skillNotes.selfSufficientFeature:+%V Heal/+%1 Survival'
      ];
      rules.defineRule('skillNotes.selfSufficientFeature',
        '', '=', '2',
        'skills.Heal', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.selfSufficientFeature.1',
        '', '=', '2',
        'skills.Survival', '+', 'source >= 10 ? 2 : null'
      );
    } else if(feat == 'Shatter Defenses') {
      notes = [
        'combatNotes.shatterDefensesFeature:' +
          'Fearful opponents flat-footed through next round',
        'validationNotes.shatterDefensesFeatBaseAttack:' +
           'Requires Base Attack >= 6',
        'validationNotes.shatterDefensesFeatFeature:' +
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
          'No penalty on shield attacks; ' +
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
        'validationNotes.sickeningCriticalFeatFeature:Requires Critical Focus',
        'validationNotes.sickeningCricialFeatBaseAttack:' +
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
          'Requires ' + skill
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
          'Critical hit causes foe staggered d4+1 rounds; ' +
          'DC %V fortitude negates',
        'validationNotes.staggeringCriticalFeatFeature:Requires Critical Focus',
        'validationNotes.staggeringCricialFeatBaseAttack:' +
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
        'sanityNotes.stealthyFeatSkills:Requires Escape Artist||Stealth',
        'skillNotes.stealthyFeature:+%V Escape Artist/+%1 Stealth'
      ];
      rules.defineRule('skillNotes.stealthyFeature',
        '', '=', '2',
        'skills.Escape Artist', '+', 'source >= 10 ? 2 : null'
      );
      rules.defineRule('skillNotes.stealthyFeature.1',
        '', '=', '2',
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
          'Critical hit stuns d4 rounds; DC %V fortitude reduces to staggered',
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
          'No penalty for improvised ranged weapon; +1 attack w/thrown splash'
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
        ('combatNotes.toughnessFeature', 'level', '=', 'Math.min(3, source)');
      rules.defineRule('hitPoints', 'combatNotes.toughnessFeature', '+', null);
    // } else if(feat == 'Trample') { // as SRD35
    } else if(feat == 'Turn Undead') {
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Channel energy to cause undead panic; DC %V will save negates',
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
      SRD35.featRules(rules, [feat], null);
      continue;
    }

    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);

  }

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

  // Add Pathfinder-specific domains
  for(var i = 0; i < domains.length; i++) {
    var domain = domains[i];
    var features = [];
    var notes = [];
    var spells = [];
    if(domain == 'Air') {
      features = ['Lightning Arc', 'Electricity Resistance'];
      notes = [
        'combatNotes.lightningArcFeature:' +
          'Ranged touch attack for d6+%1 points %V/day',
        'saveNotes.electricityResistanceFeature:%V'
      ];
      spells = [
        'Obscuring Mist', 'Wind Wall', 'Gaseous Form', 'Air Walk',
        'Control Winds', 'Chain Lightning', 'Elemental Body IV', 'Whirlwind',
        'Elemental Swarm'
      ];
      rules.defineRule
        ('combatNotes.lightningArcFeature', 'wisdomModifier', '=', 'source+3');
      rules.defineRule('combatNotes.lightningArcFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.electricityResistanceFeature:',
        'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                              'source >= 12 ? 20 : ' +
                              'source >= 6 ? 10 : null'
      );
    } else if(domain == 'Animal') {
      features = ['Speak With Animals', 'Animal Companion'];
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'magicNotes.speakWithAnimalsFeature:' +
          '<i>Speak With Animals</i> %V rounds/day'
      ];
      spells = [
        'Calm Animals', 'Hold Animal', 'Dominate Animal',
        'Summon Nature\'s Ally IV', 'Beast Shape III', 'Antilife Shell',
        'Animal Shapes', 'Summon Nature\'s Ally VIII', 'Shapechange'
      ];
      rules.defineRule('animalClericLevel',
        'domains.Animal', '?', null,
        'levels.Cleric', '=', null
      );
      rules.defineRule
        ('animalCompanionMasterLevel', 'animalClericLevel', '=', 'source - 3');
      rules.defineRule('magicNotes.speakWithAnimalsFeature',
        'levels.Cleric', '=', 'source + 3'
      );
      rules.defineRule
        ('classSkills.knowledge(Nature)', 'domans.Animal', '=', '1');
    } else if(domain == 'Artiface') {
      features = ['Artificer\'s Touch', 'Dancing Weapons'];
      notes = [
        'combatNotes.artificer\'sTouchFeature:' +
          'Melee touch attack on objects/constructs for d6+%1 damage %V/day',
        'combatNotes.dancingWeaponsFeature:' +
          'Add <i>dancing</i> to weapon for 4 rounds %V/day',
        'magicNotes.artificer\'sTouchFeature:<i>Mending</i> at will'
      ];
      spells = [
        'Animate Rope', 'Wood Shape', 'Stone Shape', 'Minor Creation',
        'Fabricate', 'Major Creation', 'Wall Of Iron', 'Instant Summons',
        'Prismatic Sphere'
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
      features = ['Touch Of Chaos', 'Chaos Blade'];
      notes = [
        'combatNotes.chaosBladeFeature:' +
          'Add <i>anarchic</i> to weapon for %1 rounds %V/day',
        'combatNotes.touchOfChaosFeature:' +
          'Touch attack %V/day causes target to take worse result of d20 ' +
          'rerolls for 1 round'
      ];
      spells = [
        'Protection From Law', 'Align Weapon', 'Magic Circle Against Law',
        'Chaos Hammer', 'Dispel Law', 'Animate Objects', 'Word Of Chaos',
        'Cloak Of Chaos', 'Summon Monster IX'
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
      features = ['Dazing Touch', 'Charming Smile'];
      notes = [
        'combatNotes.dazingTouchFeature:' +
          'Touch attack dazes %V HD foe 1 round %V/day',
        'magicNotes.charmingSmileFeature:' +
          'DC %V <i>Charm Person</i> %1 rounds/day'
      ];
      spells = [
        'Charm Person', 'Calm Emotions', 'Suggestion', 'Heroism',
        'Charm Monster', 'Geas/Quest', 'Insanity', 'Demand', 'Dominate Monster'
      ];
      rules.defineRule
        ('combatNotes.dazingTouchFeature', 'levels.Cleric', '=', null);
      rules.defineRule('combatNotes.dazingTouchFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.charmingSmileFeature',
        'levels.Cleric', '=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.charmingSmileFeature.1', 'levels.Cleric', '=', null);
    } else if(domain == 'Community') {
      features = ['Calming Touch', 'Unity'];
      notes = [
        'magicNotes.calmingTouchFeature:' +
          'Touch %V/day heals d6+%1 + removes fatigued/shaken/sickened',
        'saveNotes.unityFeature:Allies w/in 30 ft use your saving throw %V/day'
      ];
      spells = [
        'Bless', 'Shield Other', 'Prayer', 'Imbue With Spell Ability',
        'Telepathic Bond', 'Heroes\' Feast', 'Refuge',
        'Mass Cure Critical Wounds', 'Miracle'
      ];
      rules.defineRule
        ('magicNotes.calmingTouchFeature', 'wisdomModifier', '=', 'source + 3');
      rules.defineRule
        ('magicNotes.calmingTouchFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule('saveNotes.unityFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
      );
    } else if(domain == 'Darkness') {
      features = ['Blind Fight', 'Touch Of Darkness', 'Eyes Of Darkness'];
      notes = [
        'combatNotes.blindFightFeature:' +
          'Reroll concealed miss/no bonus to invisible foe/no skill check ' +
          'on blinded full speed move',
        'combatNotes.touchOfDarknessFeature:' +
          'Touch attack causes 20% miss chance for %V rounds %1/day',
        'featureNotes.eyesOfDarknessFeature:' +
          'Normal vision in any lighting %V rounds/day'
      ];
      spells = [
        'Obscuring Mist', 'Blindness/Deafness', 'Deeper Darkness',
        'Shadow Conjuration', 'Summon Monster V', 'Shadow Walk',
        'Power Word Blind', 'Greater Shadow Evocation', 'Shades'
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
      features = ['Bleeding Touch', 'Death\'s Embrace'];
      notes = [
        'combatNotes.bleedingTouchFeature:' +
          'Touch attack causes d6 damage/round %V rounds or until healed ' +
          '(DC 15) %1/day',
        'combatNotes.death\'sEmbraceFeature:Healed by channeled negative energy'
      ];
      spells = [
        'Cause Fear', 'Death Knell', 'Animate Dead', 'Death Ward',
        'Slay Living', 'Create Undead', 'Destruction', 'Create Greater Undead',
        'Wail Of The Banshee'
      ];
      rules.defineRule('combatNotes.bleedingTouchFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.bleedingTouchFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.death\'sEmbraceFeature',
        'levels.Cleric', '=', 'source >= 8 ? 1 : null'
      );
    } else if(domain == 'Destruction') {
      features = ['Destructive Smite', 'Destructive Aura'];
      notes = [
        'combatNotes.destructiveAuraFeature:' +
           'Attacks w/in 30 ft +%V damage + critical confirmed %1 rounds/day',
        'combatNotes.destructiveSmiteFeature:+%V damage %1/day'
      ];
      spells = [
        'True Strike', 'Shatter', 'Rage', 'Inflict Critical Wounds', 'Shout',
        'Harm', 'Disintegrate', 'Earthquake', 'Implosion'
      ];
      rules.defineRule('combatNotes.destructiveAuraFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor(source / 2) : null'
      );
      rules.defineRule('combatNotes.destructiveAuraFeature.1',
        'levels.Cleric', '=', null
      );
      rules.defineRule('combatNotes.destructiveSmiteFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.destructiveSmiteFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Earth') {
      features = ['Acid Dart', 'Acid Resistance'];
      notes = [
        'combatNotes.acidDartFeature:d6+%1 ranged touch %V/day',
        'saveNotes.electricityResistanceFeature:%V'
      ];
      spells = [
        'Magic Stone', 'Soften Earth And Stone', 'Stone Shape', 'Spike Stones',
        'Wall Of Stone', 'Stoneskin', 'Elemental Body IV', 'Earthquake',
        'Elemental Swarm'
      ];
      rules.defineRule('combatNotes.acidDartFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.acidDartFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.acidResistanceFeature:',
        'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                              'source >= 12 ? 20 : ' +
                              'source >= 6 ? 10 : null'
      );
    } else if(domain == 'Evil') {
      features = ['Touch Of Evil', 'Scythe Of Evil'];
      notes = [
        'combatNotes.scytheOfEvilFeature:' +
          'Add <i>unholy</i> to weapon for %1 rounds %V/day',
        'combatNotes.touchOfEvilFeature:' +
          'Touch attack sickens for %V rounds %1/day'
      ];
      spells = [
        'Protection From Good', 'Align Weapon', 'Magic Circle Against Good',
        'Unholy Blight', 'Dispel Good', 'Create Undead', 'Blasphemy',
        'Unholy Aura', 'Summon Monster IX'
      ];
      rules.defineRule('combatNotes.scytheOfEvilFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
      );
      rules.defineRule('combatNotes.scytheOfEvilFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.touchOfEvilFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.touchOfEvilFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Fire') {
      features = ['Fire Bolt', 'Fire Resistance'];
      notes = [
        'combatNotes.fireBoltFeature:' +
          'Ranged touch attack for d6+%1 points %V/day',
        'saveNotes.fireResistanceFeature:%V'
      ];
      spells = [
        'Burning Hands', 'Produce Flame', 'Fireball', 'Wall Of Fire',
        'Fire Shield', 'Fire Seeds', 'Elemental Body IV', 'Incendiary Cloud',
        'Elemental Swarm'
      ];
      rules.defineRule
        ('combatNotes.fireBoltFeature', 'wisdomModifier', '=', 'source + 3');
      rules.defineRule('combatNotes.fireBoltFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.fireResistanceFeature:',
        'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                              'source >= 12 ? 20 : ' +
                              'source >= 6 ? 10 : null'
      );
    } else if(domain == 'Glory') {
      features = ['Undead Bane', 'Touch Of Glory', 'Divine Presence'];
      notes = [
        'magicNotes.divinePresenceFeature:' +
          'DC %V <i>Sanctuary</i> for allies w/in 30 ft %1 rounds/day',
        'magicNotes.touchOfGloryFeature:Impart +%V charisma check bonus %V/day',
        'magicNotes.undeadBaneFeature:+2 DC on energy channeled to harm undead'
      ];
      spells = [
        'Shield Of Faith', 'Bless Weapon', 'Searing Light', 'Holy Smite',
        'Righteous Might', 'Undeath To Death', 'Holy Sword', 'Holy Aura',
        'Gate'
      ];
      rules.defineRule('magicNotes.divinePresenceFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor(source / 2) : null',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.divinePresenceFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.touchOfGloryFeature',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Good') {
      features = ['Touch Of Good', 'Holy Lance'];
      notes = [
        'combatNotes.holyLanceFeature:' +
          'Add <i>holy</i> to weapon for %1 rounds %V/day',
        'magicNotes.touchOfGoodFeature:' +
          'Touch imparts +%V attack/skill/ability/save for 1 round %1/day'
      ];
      spells = [
        'Protection From Evil', 'Align Weapon', 'Magic Circle Against Evil',
        'Holy Smite', 'Dispel Evil', 'Blade Barrier', 'Holy Word', 'Holy Aura',
        'Summon Monster IX'
      ];
      rules.defineRule('combatNotes.holyLanceFeature',
        'levels.Cleric', '=', 'source >= 8 ? Math.floor((source-4) / 4) : null'
      );
      rules.defineRule('combatNotes.holyLanceFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.touchOfGoodFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.touchOfGoodFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Healing') {
      features = ['Rebuke Death', 'Healer\'s Blessing'];
      notes = [
        'magicNotes.healer\'sBlessingFeature:50% bonus on healed damage',
        'magicNotes.rebukeDeathFeature:' +
          'Touch creature below 0 HP to heal d4+%1 HP %V/day'
      ];
      spells = [
        'Cure Light Wounds', 'Cure Moderate Wounds', 'Cure Serious Wounds',
        'Cure Critical Wounds', 'Breath Of Life', 'Heal', 'Regenerate',
        'Mass Cure Critical Wounds', 'Mass Heal'
      ];
      rules.defineRule('magicNotes.healer\'sBlessingFeature',
        'levels.Cleric', '=', 'source >= 6 ? 1 : null'
      );
      rules.defineRule('magicNotes.rebukeDeathFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.rebukeDeathFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
    } else if(domain == 'Knowledge') {
      features = ['Lore Keeper', 'Remove Viewing'];
      notes = [
        'magicNotes.remoteViewingFeature:' +
          'Level %V <i>Clairvoyance/clairaudience</i> for %1 rounds/day',
        'skillNotes.loreKeeperFeature:' +
          'Touch creature equal to %V Knowledge check'
      ];
      spells = [
        'Comprehend Languages', 'Detect Thoughts', 'Speak With Dead',
        'Divination', 'True Seeing', 'Find The Path', 'Legend Lore',
        'Discern Location', 'Foresight'
      ];
      rules.defineRule(/classSkills.knowledge/, 'domans.Knowledge', '=', '1');
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
      features = ['Touch Of Law', 'Staff Of Order'];
      notes = [
        'combatNotes.staffOfOrderFeature:' +
          'Add <i>axiomatic</i> to weapon for %1 rounds %V/day',
        'magicNotes.touchOfLawFeature:' +
          'Touched creature can "take 11" on all d20 rolls for 1 round %V/day'
      ];
      spells = [
        'Protection From Chaos', 'Align Weapon', 'Magic Circle Against Chaos',
        'Order\'s Wrath', 'Dispel Chaos', 'Hold Monster', 'Dictum',
        'Shield Of Law', 'Summon Monster IX'
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
      features = ['Liberation', 'Freedom\'s Call'];
      notes = [
        'magicNotes.freedom\'sCallFeature:' +
          'Allies w/in 30 ft unaffected by movement conditions %V rounds/day',
        'magicNotes.liberationFeature:Ignore movement impediments %V rounds/day'
      ];
      spells = [
        'Remove Fear', 'Remove Paralysis', 'Remove Curse',
        'Freedom Of Movement', 'Break Enchantment', 'Greater Dispel Magic',
        'Refuge', 'Mind Blank', 'Freedom'
      ];
      rules.defineRule('abilityNotes.freedom\'sCallFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
      rules.defineRule
        ('abilityNotes.liberationFeature', 'levels.Cleric', '=', null);
    } else if(domain == 'Luck') {
      features = ['Bit Of Luck', 'Good Fortune'];
      notes = [
        'magicNotes.bitOfLuckFeature:' +
          'Touched creature reroll d20 next round %V/day',
        'magicNOtes.goodFortuneFeature:Reroll d20 %V/day'
      ];
      spells = [
        'True Strike', 'Aid', 'Protection From Energy', 'Freedom Of Movement',
        'Break Enchantment', 'Mislead', 'Spell Turning',
        'Moment Of Prescience', 'Miracle'
      ];
      rules.defineRule('magicNotes.bitOfLuckFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.goodFortuneFeature',
        'levels.Cleric', '=', 'source >= 6 ? Math.floor(source / 6) : null'
      );
    } else if(domain == 'Madness') {
      features = ['Vision Of Madness', 'Aura Of Madness'];
      notes = [
        'magicNotes.auraOfMadnessFeature:' +
          'DC Will %V 30 ft <i>Confusion</i> aura %1 rounds/day',
        'magicNotes.visionOfMadnessFeature:' +
          'Touched creature +%V attack, save, or skill, -%1 others for 3 ' +
          'rounds %2/day'
      ];
      spells = [
        'Lesser Confusion', 'Touch Of Idiocy', 'Rage', 'Confusion',
        'Nightmare', 'Phantasmal Killer', 'Insanity', 'Scintillating Pattern',
        'Weird'
      ];
      rules.defineRule('magicNotes.auraOfMadnessFeature',
        'levels.Cleric', '=', 'source>=8 ? 10 + Math.floor(source / 2) : null',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.auraOfMadnessFeature.1', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.visionsOfMadnessFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.visionsOfMadnessFeature.1',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.visionsOfMadnessFeature.2',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Magic') {
      features = ['Hand Of The Acolyte', 'Dispelling Touch'];
      notes = [
        'combatNotes.handOfTheAcolyteFeature:' +
          'Melee weapon +%1 30 ft ranged attack %V/day',
        'magicNotes.dispellingTouchFeature:' +
          '<i>Dispel Magic</i> touch attack %V/day'
      ];
      spells = [
        'Identify', 'Magic Mouth', 'Dispel Magic', 'Imbue With Spell Ability',
        'Spell Resistance', 'Antimagic Field', 'Spell Turning',
        'Protection From Spells', 'Mage\'s Disjunction'
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
      features = ['Inspiring Word', 'Noble Leadership'];
      notes = [
        'magicNotes.inspiringWordFeature:' +
          'Word imparts +%2 attack/skill/ability/save for %V rounds %1/day',
        'skillNotes.nobleLeadershipFeature:+%V Leadership'
      ];
      spells = [
        'Divine Favor', 'Enthrall', 'Magic Vestment', 'Discern Lies',
        'Greater Command', 'Geas/Quest', 'Repulsion', 'Demand',
        'Storm Of Vengeance'
      ];
      rules.defineRule
        ('features.Leadership', 'skillNotes.nobleLeadershipFeature', '=', '1');
      rules.defineRule('magicNotes.inspiringWordFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.inspiringWordFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('skillNotes.nobleLeadershipFeature',
        'levels.Cleric', '=', 'source >= 8 ? 2 : null'
      );
    } else if(domain == 'Plant') {
      features = ['Wooden Fist', 'Bramble Armor'];
      notes = [
        'combatNotes.brambleArmorFeature:' +
          'Thorny hide causes d6+%1 damage to striking foes %V/day',
        'combatNotes.woodenFistFeature:+%V, no AOO unarmed attacks %V/day'
      ];
      spells = [
        'Entangle', 'Barkskin', 'Plant Growth', 'Command Plants',
        'Wall Of Thorns', 'Repel Wood', 'Animate Plants', 'Control Plants',
        'Shambler'
      ];
      rules.defineRule
        ('combatNotes.brambleArmorFeature', 'levels.Cleric', '=', null);
      rules.defineRule('combatNotes.brambleArmorFeature.1',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.woodenFistFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
    } else if(domain == 'Protection') {
      features = ['Resistance Bonus', 'Resistant Touch', 'Aura Of Protection'];
      notes = [
        'magicNotes.auraOfProtectionFeature:' +
          'Allies w/in 30 ft +%V AC %1 elements resistance %2 rounds/day',
        'magicNotes.resistantTouchFeature:' +
           'Touch transfers resistance bonus to ally for 1 minute %V/day',
        'saveNotes.resistanceBonusFeature:+%V saves'
      ];
      spells = [
        'Sanctuary', 'Shield Other', 'Protection From Energy',
        'Spell Immunity', 'Spell Resistance', 'Antimagic Field', 'Repulsion',
        'Mind Blank', 'Prismatic Sphere'
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
      rules.defineRule(/^save./, 'saveNotes.resistanceBonusFeature', '+', null);
    } else if(domain == 'Repose') {
      features = ['Gentle Rest', 'Ward Against Death'];
      notes = [
        'magicNotes.gentleRestFeature:Touch staggers %1 rounds %V/day',
        'magicNotes.wardAgainstDeathFeature:' +
          'Creatures w/in 30 ft immune to death effects/energy drain/' +
          'negative levels %V rounds/day'
      ];
      spells = [
        'Deathwatch', 'Gentle Repose', 'Speak With Dead', 'Death Ward',
        'Slay Living', 'Undeath To Death', 'Destruction',
        'Waves Of Exhaustion', 'Wail Of The Banshee'
      ];
      rules.defineRule
        ('magicNotes.gentleRestFeature', 'wisdomModifier', '=', 'source + 3');
      rules.defineRule
        ('magicNotes.gentleRestFeature.1', 'wisdomModifier', '=', null);
      rules.defineRule('magicNotes.wardAgainstDeathFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
    } else if(domain == 'Rune') {
      features = ['Scribe Scroll', 'Blast Rune', 'Spell Rune'];
      notes = [
        'magicNotes.blastRuneFeature:' +
          'Rune in adjacent square causes d6+%1 damage for %V rounds %2/day',
        'magicNotes.scribeScrollFeature:Create scroll of any known spell',
        'magicNotes.spellRuneFeature:Add known spell to Blast Rune'
      ];
      spells = [
        'Erase', 'Secret Page', 'Glyph Of Warding', 'Explosive Runes',
        'Lesser Planar Binding', 'Greater Glyph Of Warding', 'Instant Summons',
        'Symbol Of Death', 'Teleportation Circle'
      ];
      rules.defineRule('magicNotes.blastRune', 'levels.Cleric', '=', null);
      rules.defineRule('magicNotes.blastRune.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.blastRune.2',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.spellRune',
        'levels.Cleric', '=', 'source >= 8 ? 1 : null'
      );
    } else if(domain == 'Strength') {
      features = ['Strength Surge', 'Might Of The Gods'];
      notes = [
        'magicNotes.mightOfTheGodsFeature:+%V strength checks %1 rounds/day',
        'magicNotes.strengthSurgeFeature:' +
          'Touch gives +%V melee attack/strength check bonus %1/day'
      ];
      spells = [
        'Enlarge Person', 'Bull\'s Strength', 'Magic Vestment',
        'Spell Immunity', 'Righteous Might', 'Stoneskin', 'Grasping Hand',
        'Clenched Fist', 'Crushing Hand'
      ];
      rules.defineRule('magicNotes.mightOfTheGodsFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
      rules.defineRule('magicNotes.mightOfTheGodsFeature.1',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
      rules.defineRule('magicNotes.strengthSurgeFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.strengthSurgeFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
    } else if(domain == 'Sun') {
      features = ['Sun\'s Blessing', 'Nimbus Of Light'];
      notes = [
        'magicNotes.sun\'sBlessingFeature:' +
          '+%V undead damage and no resistance to channeled energy',
        'magicNotes.nimbusOfLightFeature:' +
          '30 ft aura of <i>Daylight</i> does %V HP damage to undead %1 ' +
          'rounds/day'
      ];
      spells = [
        'Endure Elements', 'Heat Metal', 'Searing Light', 'Fire Shield',
        'Flame Strike', 'Fire Seeds', 'Sunbeam', 'Sunburst', 'Prismatic Sphere'
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
      features = ['Travel Speed', 'Agile Feet', 'Dimensional Hop'];
      notes = [
        'abilityNotes.travelSpeedFeature:+10 speed',
        'featureNotes.agileFeetFeature:' +
          'Unaffected by difficult terrain for 1 round %V/day',
        'magicNotes.dimensionalHopFeature:Teleport up to %V ft/day'
      ];
      spells = [
        'Longstrider', 'Locate Object', 'Fly', 'Dimension Door', 'Teleport',
        'Find The Path', 'Greater Teleport', 'Phase Door', 'Astral Projection'
      ];
      rules.defineRule('speed', 'abilityNotes.travelSpeed', '+', '10');
      rules.defineRule
        ('featureNotes.agileFeetFeature', 'wisdomModifier', '=', 'source + 3');
      rules.defineRule('magicNotes.dimensionalHopFeature',
        'levels.Cleric', '=', 'source >= 8 ? 10 * source : null'
      );
    } else if(domain == 'Trickery') {
      features = ['Copycat', 'Master\'s Illusion'];
      notes = [
        'magicNotes.copycatFeature:<i>Mirror Image</i> for %V rounds %1/day',
        'magicNotes.master\'sIllusionFeature:' +
          'DC %V 30 ft <i>Veil</i> %1 rounds/day'
      ];
      spells = [
        'Disguise Self', 'Invisibility', 'Nondetection', 'Confusion',
        'False Vision', 'Mislead', 'Screen', 'Mass Invisibility', 'Time Stop'
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
      features = ['Battle Rage', 'Weapon Master'];
      notes = [
        'combatNotes.battleRageFeature:Touch gives +%V damage bonus %1/day',
        'combatNotes.weaponMasterFeature:' +
          'Use additional combat feat %V rounds/day'
      ];
      spells = [
        'Magic Weapon', 'Spiritual Weapon', 'Magic Vestment', 'Divine Power',
        'Flame Strike', 'Blade Barrier', 'Power Word Blind', 'Power Word Stun',
        'Power Word Kill'
      ];
      rules.defineRule('combatNotes.battleRageFeature',
        'levels.Cleric', '=', 'source == 1 ? 1 : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.battleRageFeature.1',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.weaponMasterFeature',
        'levels.Cleric', '=', 'source >= 8 ? source : null'
      );
    } else if(domain == 'Water') {
      features = ['Icicle', 'Cold Resistance'];
      notes = [
        'combatNotes.icicleFeature:d6+%1 ranged touch %V/day',
        'saveNotes.coldResistanceFeature:%V'
      ];
      spells = [
        'Obscuring Mist', 'Fog Cloud', 'Water Breathing', 'Control Water',
        'Ice Storm', 'Cone Of Cold', 'Elemental Body IV', 'Horrid Wilting',
        'Elemental Swarm'
      ];
      rules.defineRule('combatNotes.icicleFeature',
        'wisdomModifier', '=', 'source + 3'
      );
      rules.defineRule('combatNotes.icicleFeature.1',
        'levels.Cleric', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.coldResistanceFeature:',
        'levels.Cleric', '=', 'source >= 20 ? "Immune" : ' +
                              'source >= 12 ? 20 : ' +
                              'source >= 6 ? 10 : null'
      );
    } else if(domain == 'Weather') {
      features = ['Storm Burst', 'Lightning Lord'];
      notes = [
        'combatNotes.stormBurstFeature:' +
          'd6+%1 non-lethal + -2 attack ranged touch %V/day',
        'magicNotes.lightningLordFeature:<i>Call Lightning</i> %V bolts/day'
      ];
      spells = [
        'Obscuring Mist', 'Fog Cloud', 'Call Lightning', 'Sleet Storm',
        'Ice Storm', 'control Winds', 'Control Weather', 'Whirlwind',
        'Storm Of Vengeance'
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
    if(features != null) {
      for(var j = 0; j < features.length; j++) {
        var feature = features[j];
        rules.defineRule
          ("clericFeatures." + feature, 'domains.' + domain, '=', '1');
        rules.defineRule
          ("features." + feature, 'clericFeatures.' + feature, '=', '1');
      }
    }
    if(notes != null) {
      rules.defineNote(notes);
    }
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var spell = spells[j];
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

      adjustment = null; // Player's choice
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

      adjustment = null; // Player's choice
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
        'combatNotes.smallFeature:+1 AC/attack; -1 CMD/CMB',
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
      rules.defineRule
        ('combatManeuverBonus', 'combatNotes.smallFeature', '+', '-1');
      rules.defineRule
        ('combatManeuverDefense', 'combatNotes.smallFeature', '+', '-1');
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
        'combatNotes.smallFeature:+1 AC/attack; -1 CMD/CMB',
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
        ('combatManeuverBonus', 'combatNotes.smallFeature', '+', '-1');
      rules.defineRule
        ('combatManeuverDefense', 'combatNotes.smallFeature', '+', '-1');
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
    'Pathfinder Scribe Module Version ' + Pathfinder_VERSION + '\n' +
    '\n'; // TODO
};

/* Defines the rules related to character skills. */
Pathfinder.skillRules = function(rules, skills, subskills) {
  SRD35.skillRules(rules, skills, subskills, null);
  // Override SRD35 50% penalty for cross-class skills w/+3 for class skills
  var allSkills = [];
  for(var i = 0; i < skills.length; i++) {
    var pieces = skills[i].split(':');
    var skill = pieces[0];
    var skillSubskills = subskills[skill];
    if(skillSubskills == null) {
      allSkills[allSkills.length] = skill;
    } else {
      for(var subskill in skillSubskills.split('/')) {
        allSkills[allSkills.length] = skill + ' (' + subskill + ')';
      }
    }
  }
  for(var skill in allSkills) {
    rules.defineRule('skillModifier.' + skill,
      'skills.' + skill, '=', null,
      'classSkills.' + skills, '+', '3'
    );
  }
};

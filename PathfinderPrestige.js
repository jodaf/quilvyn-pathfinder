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

/*
 * This module loads the Prestige class rules from the Pathfinder Reference
 * Document.  Member methods can be called independently in order to use
 * a subset of the rules.  Similarly, the constant fields of PathfinderPrestige
 * (CLASSES) can be thined to limit the user's choices.
 */
function PathfinderPrestige() {
  if(window.Pathfinder == null) {
    alert('The PathfinderPrestige module requires use of the Pathfinder module');
    return;
  }
  PathfinderPrestige.identityRules
    (Pathfinder.rules, PathfinderPrestige.CLASSES);
  PathfinderPrestige.talentRules(Pathfinder.rules, PathfinderPrestige.FEATURES);
}

PathfinderPrestige.CLASSES = {
  'Arcane Archer':
    'Require=' +
      '"baseAttack >= 6","casterLevelArcane >= 1","features.Point-Blank Shot",'+
      '"features.Precise Shot",' +
      '"features.Weapon Focus (Longbow) || features.Weapon Focus (Shortbow)" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=Perception,Ride,Stealth,Survival ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Enhance Arrows","2:Caster Level Bonus","2:Imbue Arrow",' +
      '"3:Elemental Arrows","4:Seeker Arrow","5:Distance Arrows",' +
      '"6:Phase Arrow","8:Hail Of Arrows","9:Aligned Arrows",' +
      '"10:Arrow Of Death"',
  'Arcane Trickster':
    'Require=' +
      '"alignment !~ /Lawful/","features.sneakAttack >= 2",' +
      '"skills.Disable Device >= 4","skills.Escape Artist >= 4",' +
      '"skills.Knowledge (Arcana) >= 4","Sum /^spells.Mage Hand/ >= 1",' +
      '"Sum /^spells.*[BW]3/ >= 0" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Climb,Diplomacy,"Disable Device",Disguise,' +
      '"Escape Artist",Knowledge,Perception,"Sense Motive","Sleight Of Hand",' +
      'Spellcraft,Stealth,Swim ' +
    'Features=' +
        '"1:Caster Level Bonus","1:Ranged Legerdemain","2:Sneak Attack",' +
        '"3:Impromptu Sneak Attack","5:Tricky Spells","9:Invisible Thief",' +
        '"10:Surprise Spells"',
  'Assassin':
    'Require=' +
      '"alignment =~ /Evil/","skills.Disguise >= 2","skill.Stealth >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,Climb,Diplomacy,"Disable Device",Disguise,' +
      '"Escape Artist",Intimidate,Linguistics,Perception,"Sense Motive",' +
      '"Sleight Of Hand",Stealth,Swim,"Use Magic Device" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Punching Dagger/Rapier/Sap/Shortbow/Composite Shortbow/Short Sword)",' +
      '"1:Death Attack","1:Poison Use","1:Sneak Attack","2:Poison Tolerance",' +
      '"2:Uncanny Dodge","4:Hidden Weapons","4:True Death",' +
      '"5:Improved Uncanny Dodge","6:Quiet Death","8:Hide In Plain Sight",' +
      '"9:Swift Death","10:Angel Of Death"',
  'Dragon Disciple':
    'Require=' +
      '"features.Bloodline Draconic","languages.Draconic","race !~ /Dragon/",' +
      '"skills.Knowledge (Arcana) >= 5" ' +
      // TODO arcane spells w/out prep
    'HitDie=d12 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=Diplomacy,"Escape Artist",Fly,Knowledge,Perception,Spellcraft ' +
    'Features=' +
      '"1:Blood Of Dragons","2:Caster Level Bonus","2:Dragon Bite",' +
      '"2:Strength Boost","3:Breath Weapon",5:Blindsense,' +
      '"6:Constitution Boost","7:Dragon Form","8:Intelligence Boost",9:Wings',
  'Duelist':
    'Require=' +
      '"baseAttack >= 6",features.Dodge,features.Mobility,' +
      '"features.Weapon Finesse","skills.Acrobatics >= 2",' +
      '"Sum /^skills.Perform / >= 2" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,"Escape Artist",Perception,Perform,"Sense Motive" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Simple)",' +
      '"1:Canny Defense","1:Precise Strike","2:Improved Reaction",2:Parry,' +
      '"3:Enhanced Mobility","4:Combat Reflexes",4:Grace,5:Riposte,' +
      '"6:Acrobatic Charge","7:Elaborate Defense","9:Deflect Arrows",' +
      '"9:No Retreat","10:Crippling Critical"',
  'Eldritch Knight':
    'Require=' +
      '"features.Weapon Proficiency (Martial)","Sum /^spells.*[BW]3/ >= 0" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,"Knowledge (Arcana)","Knowledge (Nobility)",Linguistics,Ride,' +
      '"Sense Motive",Spellcraft,Swim ' +
    'Features=' +
      '"1:Diverse Training","2:Caster Level Bonus","10:Spell Critical"',
  'Loremaster':
    'Require=' +
      '"Sum /^features.Skill Focus .Knowledge/ >= 0",' +
      '"Sum /^spells.*Divi/ >= 7","Sum /^spells.*3 Divi/ >= 1" ' +
      // TODO Any two Knowledge skills >= 7
    'HitDie=d6 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Appraise,Diplomacy,"Handle Animals",Heal,Knowledge,Linguistics,' +
      'Perform,Spellcraft,"Use Magic Device" ' +
    'Features=' +
      '"1:Caster Level Bonus",2:Lore,"4:Bonus Language,"6:Greater Lore",' +
      '"10:True Lore" ' +
    'Selectables=' +
      '"1:Applicable Knowledge","1:Dodge Trick","1:Instant Mastery",' +
      '"1:More Newfound Arcana","Newfound Arcana","1:Secret Health",' +
      '"1:Secret Knowledge Of Avoidance","1:Secrets Of Inner Strength",' +
      '"1:The Lore Of True Stamina","1:Weapon Trick"',
  'Mystic Theurge':
    'Require=' +
      '"casterLevelArcane >= 3","casterLevelDivine >= 3",' +
      '"skills.Knowledge (Arcana) >= 3","skills.Knowledge (Religion) >= 3" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      '"Knowledge (Arcana)","Knowledge (Religion)","Sense Motive",Spellcraft ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Combined Spells","10:Spell Synthesis"',
  'Pathfinder Chronicler':
    'Require=' +
      '"skills.Linguistics >= 3","skills.Perform (Oratory) >= 5",' +
      '"skills.Profession (Scribe) >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Diplomacy,Disguise,"Escape Artist",Intimidate,' +
      'Knowledge,Linguistics,Perception,Perform,Ride,"Sense Motive",' +
      '"Sleight Of Hand",Survival,"Use Magic Device" ' +
    'Features=' +
      '"1:Bardic Knowledge","1:Deep Pockets","1:Master Scribe",' +
      '"2:Live To Tell The Tale",2:Pathfinding,"3:Bardic Performance",' +
      '3:Countersong,3:Distraction,3:Fascinate,"3:Improved Aid",' +
      '"3:Inspire Courage","4:Epic Tales","5:Inspire Competence",' +
      '"5:Whispering Campaign","6:Inspired Action","7:Call Down The Legends",' +
      '8:Suggestion,"10:Dirge Of Doom","10:Lay Of The Exalted Dead"',
  'Shadowdancer':
    'Require=' +
      '"features.Combat Reflexes",features.Dodge,features.Mobility,' +
      '"skills.Stealth >= 5","skills.Perform (Dance) >= 2" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Acrobatics,Bluff,Diplomacy,Diguise,"Escape Artist",Perception,' +
      'Perform,"Slight Of Hand",Stealth ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Composite Shortbow/Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Mace/Morningstar/Punching Dagger/Quarterstaff/Rapier/Sap/Shortbow/Short Sword)",' +
      '"1:Hide In Plain Sight",2:Darkvision,2:Evasion,"2:Uncanny Dodge",' +
      '"3:Shadow Illusion","3:Summon Shadow","4:Shadow Call","4:Shadow Jump",' +
      '"5:Defensive Roll","5:Improved Uncanny Dodge","7:Slippery Mind",' +
      '"8:Shadow Power","10:Improved Evasion","10:Shadow Master" ' +
    'Selectables=' +
      '"3:Bleeding Attack","3:Combat Trick","3:Fast Stealth",' +
      '"3:Finesse Rogue","3:Ledge Walker","3:Major Magic","3:Minor Magic",' +
      '"3:Quick Disable",3:Resiliency,"3:Rogue Crawl","3:Slow Reactions",' +
      '"3:Stand Up","3:Surprise Attack","3:Trap Spotter",' +
      '"3:Rogue Weapon Training","3:Crippling Strike","3:Defensive Roll",' +
      '"3:Dispelling Attack","3:Feat Bonus","3:Improved Evasion",' +
      '3:Opportunist,"3:Skill Mastery","3:Slippery Mind"'
};
PathfinderPrestige.FEATURES = {
  'Acrobatic Charge':'combat:May charge in difficult terrain',
  'Aligned Arrows':'combat:Arrows anarchic/axiomatic/holy/unholy',
  'Angel Of Death':'combat:Death attack dusts corpse 1/day',
  'Applicable Knowledge':'feature:+1 General Feat',
  'Arrow Of Death':
    'combat:Special arrow requires foe DC %V fortitude save or die',
  'Blindsense':
    "feature:Other senses allow detection of unseen objects w/in %V'",
  'Blood Of Dragons':
    'feature:Dragon Disciple level triggers Bloodline Draconic features',
  'Bonus Language':'feature:%V additional language(s)',
  'Call Down The Legends':'magic:Summon 2d4 level 4 barbarians 1/week',
  'Canny Defense':'combat:+%V AC when lightly/unarmored',
  'Caster Level Bonus':'magic:+%V base class level for spells known/per day',
  'Combined Spells':
    'magic:Fill spell slots up to level %V with spells from different class',
  'Constitution Boost':'ability:+2 Constitution',
  'Crippling Critical':'combat:Critical hit causes follow-on damage',
  'Death Attack':
    'combat:Foe DC %V fortitude save on successful sneak attack after 3 rd of study or die/paralyzed d6+%1 rd',
  'Deep Pockets':[
    'feature:Retrieve any small object from backpack as a full-round action',
    'skill:+4 Sleight Of Hand (conceal small objects)'
  ],
  'Defensive Roll':
    'combat:DC damage Reflex save vs. lethal blow for half damage',
  'Dirge Of Doom':"magic:Creatures w/in 30' shaken while performing",
  'Distance Arrows':'combat:x2 range',
  'Distraction':"magic:Perform check vs. visual magic w/in 30' 10 rd",
  'Diverse Training':
    'feature:Eldritch Knight level satisfies Fighter/arcane feat prerequisite',
  'Dragon Bite':'combat:d%V+%1%2 bite when using claws',
  'Dragon Disciple':'combat:+%V',
  'Dragon Form':'magic:<i>Form Of The Dragon %V</i> %1/day',
  'Elaborate Defense':'combat:+%V AC when fighting defensively',
  'Elemental Arrows':'combat:Arrows %V',
  'Enhance Arrow':'combat:Arrows treated as +1 magic weapons',
  'Enhanced Mobility':'combat:+4 AC vs. movement AOO when lightly/unarmored',
  'Epic Tales':'magic:Bardic Performance effect via writing%V',
  'Grace':'save:+2 Reflex when lightly/unarmored',
  'Greater Lore':'skill:+10 Spellcraft (identify magic item properties)',
  'Hail Of Arrows':'combat:Simultaneously fire arrows at %V targets 1/day',
  'Hidden Weapons':'skill:+%V Sleight Of Hand (hide weapons)',
  'Imbue Arrow':'magic:Center spell where arrow lands',
  'Impromptu Sneak Attack':'combat:Declare any attack a sneak attack %V/day',
  'Improved Aid':'combat:Aid Another action gives +4 bonus',
  'Improved Reaction':'combat:+%V Initiative',
  'Inspired Action':'magic:Use Bardic Performance to give ally extra %V action',
  'Instant Mastery':'skill:4 ranks in untrained skill',
  'Intelligence Boost':'ability:+2 Intelligence',
  'Invisible Thief':'magic:<i>Greater Invisibility</i> %V rd/day',
  'Lay Of The Exalted Dead':'magic:Summon d4+1 level 5 barbarians 1/week',
  'Live To Tell The Tale':'save:Extra saving throw vs permanent contion %V/day',
  'Lore':'skill:+%V all Knowledge, use any Knowledge untrained',
  'Master Scribe':
    'skill:+%V Linguistics/Profession (Scribe)/Use Magic Device (Scrolls)',
  'More Newfound Arcana':'magic:Bonus level 2 spell',
  'Newfound Arcana':'magic:Bonus level 1 spell',
  'No Retreat':'combat:AOO on foe withdraw',
  'Parry':
    'combat:Hit on full-round attack negates foe attack instead of damaging',
  'Pathfinding':[
    'ability:Treat trackless terrain as road',
    'save:+5 vs. <i>Maze</i>',
    'skill:+5 Survival (avoid becoming lost), DC 15 Survival to extend to companion'
  ],
  'Phase Arrow':'combat:Arrow passes through normal obstacles %V/day',
  'Poison Tolerance':'save:+%V vs. poison',
  'Poison Use':'feature:No chance of self-poisoning when applying to blade',
  'Precise Strike':'combat:+%V HP with light piercing weapon',
  'Quiet Death':'combat:Stealth check to perform Death Attack unnoticed',
  'Ranged Legerdemain':"combat:+5 DC on Disable Device/Sleight Of Hand at 30'",
  'Riposte':'combat:AOO after parry',
  'Secret Health':'combat:+3 HP',
  'Secret Knowledge Of Avoidance':'save:+2 Reflex',
  'Secrets Of Inner Strength':'save:+2 Will',
  'Seeker Arrow':'combat:Arrow maneuvers to target %V/day',
  'Shadow Call':'magic:<i>Shadow Conjuration</i> %V/day',
  'Shadow Illusion':'magic:<i>Silent Image</i> %V/day',
  'Shadow Jump':'magic:<i>Dimension Door</i> between shadows %V feet/day',
  'Shadow Master':[
    'combat:DR 10/-, critical hit blinds d6 rd in dim light',
    'save:+2 saves in dim light'
  ],
  'Shadow Power':'magic:<i>Shadow Evocation</i> %V/day',
  'Sneak Attack':'combat:%Vd6 HP extra when surprising or flanking',
  'Spell Critical':'magic:Cast swift spell after critical hit',
  'Spell Synthesis':
    'magic:Cast two spells simultaneously, +2 vs. resistance, target -2 saves',
  'Strength Boost':'ability:+%V Strength',
  'Summon Shadow':
    'magic:Summon unturnable Shadow companion with %V HP, character attack/save, +4 will vs. channeled energy',
  'Surprise Spells':'combat:Sneak attack spell damage vs flat-footed foes',
  'Swift Death':'combat:Death attack w/out prior study 1/day',
  'The Lore Of True Stamina':'save:+2 Fortitude',
  'Tricky Spells':'magic:Silent/Still spell %V/day',
  'True Death':
    'combat:Raising victim requires DC %V <i>Remove Curse</i> or DC %1 caster level check',
  'True Lore':'magic:<i>Legend Lore</i>, <i>Analyze Dweomer</i> 1/day',
  'Weapon Trick':'combat:+1 Attack',
  'Whispering Campaign':
    'magic:<i>Doom</i>/<i>Enthrall</i> via Bardic Performance'
};

/* Defines the rules related to SRDv3.5 Prestige Classes. */
PathfinderPrestige.identityRules = function(rules, classes) {
  for(var clas in classes) {
    rules.choiceRules(rules, 'levels', clas, classes[clas]);
    PathfinderPrestige.classRulesExtra(rules, clas);
    // Pathfinder prestige classes use different progressions for saves
    for(var save in {'Fortitude':'', 'Reflex':'', 'Will':''}) {
      var value = QuilvynUtils.getAttrValue(classes[clas], save);
      rules.defineRule('class' + save + 'Bonus',
        'levels.' + clas, '+', 'Math.floor((source + 1) / ' + (value == '1/2' ? '2' : '3') + ')'
      );
    }
  }
};

/* Defines rules related to character features. */
PathfinderPrestige.talentRules = function(rules, features) {
  for(var feature in features) {
    rules.choiceRules(rules, 'features', feature, features[feature]);
  }
};

/* Defines the rules related to Pathfinder Prestige Classes. */
PathfinderPrestige.classRulesExtra = function(rules, name) {

  if(name == 'Arcane Archer') {

    rules.defineRule(
      'combatNotes.arrowOfDeathFeature', 'charismaModifier', '=', 'source + 20'
    );
    rules.defineRule('combatNotes.elementalArrowsFeature',
     'levels.Arcane Archer', '=',
     'source < 7 ? "flaming/frost/shock" : "flaming burst/icy burst/shocking burst"'
    );
    rules.defineRule
      ('combatNotes.hailOfArrowsFeature', 'levels.Arcane Archer', '+=', null);
    rules.defineRule(
      'combatNotes.phaseArrowFeature', 'levels.Arcane Archer', '=',
      'Math.floor((source - 4) / 2)'
    );
    rules.defineRule(
      'combatNotes.seekerArrowFeature', 'levels.Arcane Archer', '=',
      'Math.floor((source - 2) / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonusFeature',
      'levels.Arcane Archer', '=',
      'source >= 2 ? source - Math.floor((source + 3) / 4) : null'
    );

  } else if(name == 'Arcane Trickster') {

    rules.defineRule('combatNotes.impromptuSneakAttackFeature',
      'levels.Arcane Trickster', '+=', 'source < 7 ? 1 : 2'
    );
    rules.defineRule('combatNotes.sneakAttackFeature',
      'levels.Arcane Trickster', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonusFeature',
      'levels.Arcane Trickster', '+=', null
    );
    rules.defineRule('magicNotes.invisibleThiefFeature',
      'levels.Arcane Trickster', '+=', null
    );
    rules.defineRule('magicNotes.trickySpellsFeature',
      'levels.Arcane Trickster', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('validationNotes.arcaneTricksterClassFeatures',
      'levels.Arcane Trickster', '=', '-1',
      // Check standard classes that provide 2d6 Sneak Attack
      'levels.Assassin', '+', 'source >= 3 ? 1 : null',
      'levels.Rogue', '+', 'source >= 3 ? 1 : null',
      '', 'v', '0'
    );
    rules.defineRule
      ('countmagehandspells', /^spells.Mage Hand\(.*\)$/, '+=', '1');
    rules.defineRule('validationNotes.arcaneTricksterClassSpells',
      'levels.Arcane Trickster', '=', '-11',
      'countmagehandspells', '+', '10',
      'spellsKnown.B3', '+', '1',
      'spellsKnown.S3', '+', '1',
      'spellsKnown.W3', '+', '1',
      '', 'v', '0'
    );

  } else if(name == 'Assassin') {

    rules.defineRule('combatNotes.deathAttackFeature',
      'levels.Assassin', '+=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.deathAttackFeature.1', 'levels.Assassin', '+=', null);
    rules.defineRule('combatNotes.sneakAttackFeature',
      'levels.Assassin', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.trueDeathFeature',
      'levels.Assassin', '+=', '10 + source'
    );
    rules.defineRule('combatNotes.trueDeathFeature.1',
      'levels.Assassin', '+=', '15 + source'
    );
    rules.defineRule
      ('resistance.Poison', 'saveNotes.poisonToleranceFeature', '+=', null);
    rules.defineRule('saveNotes.poisonToleranceFeature',
      'levels.Assassin', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('skillNotes.hiddenWeaponFeature', 'levels.Assassin', '=', null);
    rules.defineRule('assassinFeatures.Improved Uncanny Dodge',
      'assassinFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodgeFeature',
      'levels.Assassin', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Assassin', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Dragon Disciple') {

    rules.defineRule('abilityNotes.wingsFeature',
      'levels.Dragon Disciple', '+=', 'source >= 9 ? 30 : null'
    );
    rules.defineRule('abilityNotes.strengthBoostFeature',
      'levels.Dragon Disciple', '+=', 'source>=4 ? 4 : source>=2 ? 2 : null'
    );
    rules.defineRule('armorClass',
      'combatNotes.dragonDiscipleArmorClassAdjustment', '+', null
    );
    rules.defineRule
      ('bloodlineLevel.Draconic', 'levels.Dragon Disciple', '+=', null);
    rules.defineRule('combatNotes.dragonBiteFeature',
      'levels.Dragon Disciple', '?', 'source >= 2',
      '', '=', '6',
      'features.Small', '=', '4',
      'features.Large', '=', '8'
    );
    rules.defineRule('combatNotes.breathWeaponFeature.2',
      'levels.Dragon Disciple', '+=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule('combatNotes.dragonBiteFeature.1',
      'features.Dragon Bite', '?', null,
      'strengthModifier', '=', 'Math.floor(source * 1.5)'
    );
    rules.defineRule('combatNotes.dragonBiteFeature.2',
      'features.Dragon Bite', '?', null,
      'levels.Dragon Disciple', '=', 'source >= 6 ? ", d6 energy" : ""'
    );
    rules.defineRule('combatNotes.dragonDiscipleArmorClassAdjustment',
      'levels.Dragon Disciple', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule
      ('constitution', 'abilityNotes.constitutionBoostFeature', '+', '2');
    rules.defineRule('featCount.Draconic',
      'levels.Dragon Disciple', '+=', 'Math.floor((source + 4) / 6)'
    );
    rules.defineRule
      ('features.Bloodline Draconic', 'levels.Dragon Disciple', '=', '1');
    rules.defineRule('featureNotes.blindsenseFeature',
      'levels.Dragon Disciple', '^=', 'source >= 5 ? 30 : source >= 10 ? 60 : null'
    );
    rules.defineRule
      ('intelligence', 'abilityNotes.intelligenceBoostFeature', '+', '2');
    rules.defineRule('magicNotes.casterLevelBonusFeature',
      'levels.Dragon Disciple', '+=', 'source - Math.floor((source + 3) / 4)'
    );
    rules.defineRule('magicNotes.dragonFormFeature',
      'levels.Dragon Disciple', '=', 'source < 10 ? "I" : "II"'
    );
    rules.defineRule('magicNotes.dragonFormFeature.1',
      'levels.Dragon Disciple', '=', 'source < 10 ? 1 : 2'
    );
    rules.defineRule('strength',
      'abilityNotes.strengthBoostFeature', '+', null
    );
    rules.defineRule('validationNotes.dragonDiscipleClassBloodline',
      'levels.Sorcerer', '?', null,
      'levels.Dragon Disciple', '=', '-1',
      'sorcererFeatures.Bloodline Draconic', '+', '1'
    );
    rules.defineRule('validationNotes.dragonDiscipleClassSpells',
      'levels.Dragon Disciple', '=', '-1',
      // Check standard ways to learn arcane spells w/out study
      'levels.Bard', '+', '1',
      'levels.Sorcerer', '+', '1',
      'features.Spell Mastery', '+', '1',
      '', 'v', '0'
    );

  } else if(name == 'Duelist') {

    rules.defineRule
      ('armorClass', 'combatNotes.cannyDefenseFeature', '+', null);
    rules.defineRule('combatNotes.cannyDefenseFeature',
      'intelligenceModifier', '+=', 'source < 0 ? null : source',
      'levels.Duelist', 'v', null
    );
    rules.defineRule('combatNotes.elaborateDefenseFeature',
      'levels.Duelist', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.improvedReactionFeature',
      'levels.Duelist', '+=', 'source < 2 ? null : source < 8 ? 2 : 4'
    );
    rules.defineRule
      ('combatNotes.preciseStrikeFeature', 'levels.Duelist', '=', null);
    rules.defineRule
      ('initiative', 'combatNotes.improvedReactionFeature', '+', null);
    rules.defineRule('save.Reflex', 'saveNotes.graceFeature', '+', null);

  } else if(name == 'Eldritch Knight') {

    rules.defineRule('featCount.Fighter',
      'levels.Eldritch Knight', '+=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('magicNotes.casterLevelBonusFeature',
      'levels.Eldritch Knight', '+=', 'source > 1 ? source - 1 : null'
    );
    rules.defineRule('validationNotes.eldritchKnightClassSpells',
      'levels.Eldritch Knight', '=', '-1',
      /^spellsKnown\.(AS|B|S|W)3/, '+', '1',
      '', 'v', '0'
    );

  } else if(name == 'Loremaster') {

    rules.defineRule('armorClass', 'combatNotes.dodgeTrickFeature', '+', '1');
    rules.defineRule('baseAttack', 'combatNotes.weaponTrickFeature', '+','1');
    rules.defineRule('casterLevelArcane', 'levels.Loremaster', '+=', null);
    rules.defineRule('featCount.General',
      'featureNotes.applicableKnowledgeFeature', '+', '1'
    );
    rules.defineRule('featureNotes.bonusLanguageFeature',
      'levels.Loremaster', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule('hitPoints', 'combatNotes.secretHealthFeature', '+','3');
    rules.defineRule
      ('languageCount', 'featureNotes.bonusLanguageFeature', '+', null);
    rules.defineRule
      ('magicNotes.casterLevelBonusFeature', 'levels.Loremaster', '+=', null);
    rules.defineRule
      ('save.Fortitude', 'saveNotes.theLoreOfTrueStaminaFeature', '+', '2');
    rules.defineRule
      ('save.Will', 'saveNotes.secretsOfInnerStrengthFeature', '+', '2');
    rules.defineRule('save.Reflex',
      'saveNotes.secretKnowledgeOfAvoidanceFeature', '+', '2'
    );
    rules.defineRule('selectableFeatureCount.Loremaster',
      'levels.Loremaster', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      (/^skillModifier\.Knowledge/, 'skillNotes.loreFeature', '+=', null);
    rules.defineRule('skillNotes.loreFeature',
      'levels.Loremaster', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('countskillfocusknowledgefeats',
      /^features.Skill Focus \(Knowledge/, '+=', '1'
    );
    rules.defineRule('validationNotes.loremasterClassFeats',
      'levels.Loremaster', '=', '-103',
      'countskillfocusknowledgefeats', '+', '100',
      '', 'v', '0'
    );
    var feats = rules.getChoices('feats');
    for(var feat in feats) {
      if(feats[feat].match(/Item Creation|Metamagic/)) {
        rules.defineRule
          ('validationNotes.loremasterClassFeats', 'feats.' + feat, '+', '1');
      }
    }
    rules.defineRule('validationNotes.loremasterClassSkills',
      'levels.Loremaster', '=', '-2',
      /^skills\.Knowledge \(.*\)$/, '+=', 'source >= 7 ? 1 : null',
      '', 'v', '0'
    );
    rules.defineRule('countdivspells', /^spells\..*Divi\)$/, '+=', '1');
    rules.defineRule('validationNotes.loremasterClassSpells',
      'levels.Loremaster', '=', '-101',
      'countdivspells', '+', 'source >= 7 ? 100 : null',
      /^spells\..*3 Divi\)/, '+', '1',
      '', 'v', '0'
    );

  } else if(name == 'Mystic Theurge') {

    rules.defineRule('magicNotes.casterLevelBonusFeature',
      'levels.Mystic Theurge', '=', null
    );
    rules.defineRule('magicNotes.combinedSpellsFeature',
      'levels.Mystic Theurge', '+=', 'Math.floor((source + 1) / 2)'
    );

  } else if(name == 'Pathfinder Chronicler') {

    rules.defineRule('casterLevels.Doom',
      'levels.Pathfinder Chronicler', '^=', 'source < 5 ? null : source'
    );
    rules.defineRule('casterLevels.Enthrall',
      'levels.Pathfinder Chronicler', '^=', 'source < 5 ? null : source'
    );
    rules.defineRule('casterLevels.Suggestion',
      'levels.Pathfinder Chronicler', '^=', 'source < 3 ? null : source'
    );
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calcuated even for non-Wizard Pathfinder Chroniclers.
    rules.defineRule('casterLevels.W',
      'levels.Pathfinder Chronicler', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('featureNotes.bardicPerformanceFeature',
      'levels.Pathfinder Chronicler', '+=', '2 + 2 * (source - 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.epicTalesFeature',
      'levels.Pathfinder Chronicler', '=',
      'source >= 8 ? " or reading by others" : ""'
    );
    rules.defineRule('magicNotes.fascinateFeature',
      'levels.Pathfinder Chronicler', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.fascinateFeature.1',
      'levels.Pathfinder Chronicler', '+=', '10 + Math.floor((source-2) / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.inspiredActionFeature',
      'levels.Pathfinder Chronicler', '=',
      'source < 9 ? "Move" : "Move/Standard"'
    );
    rules.defineRule('magicNotes.inspireCompetenceFeature',
      'levels.Pathfinder Chronicler', '+=', '1 + Math.floor((source - 1) / 4)'
    );
    rules.defineRule('magicNotes.inspireCourageFeature',
      'levels.Pathfinder Chronicler', '+=', '1 + Math.floor((source - 1) / 6)'
    );
    rules.defineRule('saveNotes.liveToTellTheTaleFeature',
      'levels.Pathfinder Chronicler', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule(/^skillModifier.Knowledge/,
      'skillNotes.bardicKnowledgeFeature', '+', null
    );
    rules.defineRule('skillNotes.bardicKnowledgeFeature',
      'levels.Pathfinder Chronicler', '+=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('skillNotes.masterScribeFeature',
      'levels.Pathfinder Chronicler', '+=', null
    );

  } else if(name == 'Shadowdancer') {

    rules.defineRule('casterLevels.Silent Image',
      'levels.Shadowdancer', '^=', 'source < 3 ? null : source'
    );
    rules.defineRule('casterLevels.Dimennsion Door',
      'levels.Shadowdancer', '^=', 'source < 4 ? null : source'
    );
    rules.defineRule('casterLevels.Greater Shadow Conjuration',
      'levels.Shadowdancer', '^=', 'source < 10 ? null : source'
    );
    rules.defineRule('casterLevels.Shadow Conjuration',
      'levels.Shadowdancer', '^=', 'source < 4 ? null : source'
    );
    rules.defineRule('casterLevels.Shadow Evocation Image',
      'levels.Shadowdancer', '^=', 'source < 8 ? null : source'
    );
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calcuated even for non-Wizard Shadowdancers.
    rules.defineRule('casterLevels.W',
      'levels.Shadowdancer', '=', 'source < 3 ? null : 1'
    );
    rules.defineRule('featureNotes.darkvisionFeature',
      'shadowdancerFeatures.Darkvision', '+=', '60'
    );
    rules.defineRule('magicNotes.shadowCallFeature',
      'levels.Shadowdancer', '=', 'Math.floor(source / 2) - 1'
    );
    rules.defineRule('magicNotes.shadowIllusionFeature',
      'levels.Shadowdancer', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.shadowJumpFeature',
      'levels.Shadowdancer', '=', '40 * Math.pow(2, Math.floor(source/2)-2)'
    );
    rules.defineRule('magicNotes.shadowPowerFeature',
      'levels.Shadowdancer', '=', 'source < 8 ? null : source < 10 ? 1 : 2'
    );
    rules.defineRule('magicNotes.summonShadowFeature',
      'hitPoints', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('selectableFeatureCount.Shadowdancer',
      'levels.Shadowdancer', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('shadowdancerFeatures.Improved Uncanny Dodge',
      'shadowdancerFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodgeFeature',
      'levels.Shadowdancer', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Shadowdancer', '+=', 'source >= 2 ? 1 : null'
    );

  }

};

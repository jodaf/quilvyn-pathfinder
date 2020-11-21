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

/*jshint esversion: 6 */
"use strict";

/*
 * This module loads the Prestige class rules from the Pathfinder Reference
 * Document.  Member methods can be called independently in order to use
 * a subset of the rules.  Similarly, the constant fields of PathfinderPrestige
 * (CLASSES, FEATURES) can be manipulated to modify the choices.
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
    'Skills=' +
      'Perception,Ride,Stealth,Survival ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Enhance Arrows","2:Caster Level Bonus","2:Imbue Arrow",' +
      '"3:Elemental Arrows","4:Seeker Arrow","5:Distance Arrows",' +
      '"6:Phase Arrow","8:Hail Of Arrows","9:Aligned Arrows",' +
      '"10:Arrow Of Death"',
  'Arcane Trickster':
    'Require=' +
      '"alignment !~ \'Lawful\'","features.sneakAttack >= 2",' +
      '"skills.Disable Device >= 4","skills.Escape Artist >= 4",' +
      '"skills.Knowledge (Arcana) >= 4","Sum \'^spells\\.Mage Hand\' >= 1",' +
      '"Sum \'^spells\\..*[BW]3\' >= 0" ' +
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
      '"alignment =~ \'Evil\'","skills.Disguise >= 2","skill.Stealth >= 5" ' +
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
      '"languages.Draconic","race !~ \'Dragon\'",' +
      '"skills.Knowledge (Arcana) >= 5",' +
      '"levels.Bard > 0 || levels.Sorcerer > 0",' +
      // i.e., Arcane spells w/out prep
      '"levels.Sorcerer == 0 || sorcererFeatures.Bloodline Draconic" ' +
    'HitDie=d12 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Diplomacy,"Escape Artist",Fly,Knowledge,Perception,Spellcraft ' +
    'Features=' +
      '"1:Blood Of Dragons","1:Natural Armor","2:Caster Level Bonus",' +
      '"2:Dragon Bite","2:Strength Boost",5:Blindsense,' +
      '"6:Constitution Boost","7:Dragon Form","8:Intelligence Boost" ' +
    'Selectables=' +
      '"1:Bloodline Draconic (Black)","1:Bloodline Draconic (Blue)",' +
      '"1:Bloodline Draconic (Green)","1:Bloodline Draconic (Red)",' +
      '"1:Bloodline Draconic (White)","1:Bloodline Draconic (Brass)",' +
      '"1:Bloodline Draconic (Bronze)","1:Bloodline Draconic (Copper)",' +
      '"1:Bloodline Draconic (Gold)","1:Bloodline Draconic (Silver)"',
  'Duelist':
    'Require=' +
      '"baseAttack >= 6",features.Dodge,features.Mobility,' +
      '"features.Weapon Finesse","skills.Acrobatics >= 2",' +
      '"Sum \'^skills\\.Perform \' >= 2" ' +
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
      '"features.Weapon Proficiency (Martial)",' +
      '"Sum \'^spells\\..*[BW]3\' >= 0" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,"Knowledge (Arcana)","Knowledge (Nobility)",Linguistics,Ride,' +
      '"Sense Motive",Spellcraft,Swim ' +
    'Features=' +
      '"1:Diverse Training","2:Caster Level Bonus","10:Spell Critical"',
  'Loremaster':
    'Require=' +
      '"Sum \'^features\\.Skill Focus .Knowledge\' >= 0",' +
      '"Sum \'^spells\\..*Divi\' >= 7","Sum \'^spells\\..*3 Divi\' >= 1",' +
      '"CountKnowledgeGe7 >= 2" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Appraise,Diplomacy,"Handle Animals",Heal,Knowledge,Linguistics,' +
      'Perform,Spellcraft,"Use Magic Device" ' +
    'Features=' +
      '"1:Caster Level Bonus",2:Lore,"4:Bonus Language","6:Greater Lore",' +
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
      '3:Opportunist,"3:Skill Mastery","3:Slippery Mind" ' +
    'CasterLevelArcane=levels.Shadowdancer ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Shadowdancer1:3=1,' +
      'Shadowdancer4:4=2,' +
      'Shadowdancer5:8=1,' +
      'Shadowdancer7:10=1 ' +
    'Spells=' +
      '"Shadowdancer1:Silent Image",' +
      '"Shadowdancer4:Dimension Door;Shadow Conjuration",' +
      '"Shadowdancer5:Shadow Evocation",' +
      '"Shadowdancer7:Greater Shadow Conjuration"'
};
PathfinderPrestige.FEATURES = {
  'Acrobatic Charge':'Section=combat Note="May charge in difficult terrain"',
  'Aligned Arrows':
    'Section=combat Note="Arrows anarchic, axiomatic, holy, or unholy"',
  'Angel Of Death':'Section=combat Note="Death attack dusts corpse 1/dy"',
  'Applicable Knowledge':'Section=feature Note="+1 General Feat"',
  'Arrow Of Death':
    'Section=combat Note="Special arrow kills foe (DC %V Fort neg)"',
  'Blood Of Dragons':
    'Section=feature ' +
    'Note="Dragon Disciple level triggers Bloodline features"',
  'Bonus Language':'Section=feature Note="+%V Language Count"',
  'Call Down The Legends':
    'Section=magic Note="Summon 2d4 level 4 barbarians 1/wk"',
  'Canny Defense':'Section=combat Note="+%V AC in light or no armor"',
  'Caster Level Bonus':
    'Section=magic ' +
    'Note="+%V base class level for spells known and spells per day"',
  'Combined Spells':
    'Section=magic ' +
    'Note="Fill spell slots up to level %V with spells from different class"',
  'Constitution Boost':'Section=ability Note="+2 Constitution"',
  'Crippling Critical':
    'Section=combat Note="Critical hit causes follow-on damage"',
  'Death Attack':
    'Section=combat ' +
    'Note="Sneak attack after 3 rd of study causes death or paralysis d6+%1 rd (DC %V Fort neg)"',
  'Deep Pockets':
    'Section=feature,skill ' +
    'Note="Retrieve any small object from backpack as a full-round action",' +
         '"+4 Sleight Of Hand (conceal small objects)"',
  'Distance Arrows':'Section=combat Note="x2 range"',
  'Diverse Training':
    'Section=feature ' +
    'Note="Eldritch Knight level satisfies Fighter or arcane feat prerequisite"',
  'Dragon Bite':'Section=combat Note="d%V+%1%2 bite when using claws"',
  'Dragon Disciple':'Section=combat Note="+%V"',
  'Dragon Form':'Section=magic Note="<i>Form Of The Dragon %V</i> %1/dy"',
  'Elaborate Defense':'Section=combat Note="+%V AC when fighting defensively"',
  'Elemental Arrows':'Section=combat Note="Arrows %V"',
  'Enhance Arrow':'Section=combat Note="Arrows treated as +1 magic weapons"',
  'Enhanced Mobility':
    'Section=combat Note="+4 AC vs. movement AOO in light or no armor"',
  'Epic Tales':'Section=magic Note="Bardic Performance effect via writing%V"',
  'Grace':'Section=save Note="+2 Reflex in light or no armor"',
  'Greater Lore':
    'Section=skill Note="+10 Spellcraft (identify magic item properties)"',
  'Hail Of Arrows':
    'Section=combat Note="Simultaneously fire arrows at %V targets 1/dy"',
  'Hidden Weapons':'Section=skill Note="+%V Sleight Of Hand (hide weapons)"',
  'Imbue Arrow':'Section=magic Note="Center spell where arrow lands"',
  'Impromptu Sneak Attack':
    'Section=combat Note="Declare any attack a sneak attack %V/dy"',
  'Improved Aid':'Section=combat Note="Aid Another action gives +4 bonus"',
  'Improved Reaction':'Section=combat Note="+%V Initiative"',
  'Inspired Action':
    'Section=magic Note="Use Bardic Performance to give ally extra %V action"',
  'Instant Mastery':'Section=skill Note="4 ranks in untrained skill"',
  'Intelligence Boost':'Section=ability Note="+2 Intelligence"',
  'Invisible Thief':
    'Section=magic Note="<i>Greater Invisibility</i> %V rd/dy"',
  'Lay Of The Exalted Dead':
    'Section=magic Note="Summon d4+1 level 5 barbarians 1/wk"',
  'Live To Tell The Tale':
    'Section=save Note="Extra saving throw vs permanent condition %V/dy"',
  'Lore':'Section=skill Note="+%V All Knowledge/use any Knowledge untrained"',
  'Master Scribe':
    'Section=skill ' +
    'Note="+%V Linguistics/=%v Profession (Scribe)/+%V Use Magic Device (scrolls)"',
  'More Newfound Arcana':'Section=magic Note="Bonus level 2 spell"',
  'Newfound Arcana':'Section=magic Note="Bonus level 1 spell"',
  'No Retreat':'Section=combat Note="AOO on foe withdraw"',
  'Parry':
    'Section=combat ' +
    'Note="Hit on full-round attack negates foe attack instead of damaging"',
  'Pathfinding':
    'Section=ability,save,skill ' +
    'Note="Treat trackless terrain as road",' +
         '"+5 vs. <i>Maze</i>",' +
         '"+5 Survival (avoid becoming lost), DC 15 Survival to extend to companion"',
  'Phase Arrow':
    'Section=combat Note="Arrow passes through normal obstacles %V/dy"',
  'Poison Tolerance':'Section=save Note="+%V vs. poison"',
  'Poison Use':
    'Section=feature Note="No chance of self-poisoning when applying to blade"',
  'Precise Strike':'Section=combat Note="+%V HP with light piercing weapon"',
  'Quiet Death':
    'Section=combat Note="Stealth check to perform Death Attack unnoticed"',
  'Ranged Legerdemain':
    'Section=skill Note="+5 DC on Disable Device and Sleight Of Hand at 30\'"',
  'Riposte':'Section=combat Note="AOO after parry"',
  'Secret Health':'Section=combat Note="+3 HP"',
  'Secret Knowledge Of Avoidance':'Section=save Note="+2 Reflex"',
  'Secrets Of Inner Strength':'Section=save Note="+2 Will"',
  'Seeker Arrow':'Section=combat Note="Arrow maneuvers to target %V/dy"',
  'Shadow Call':'Section=magic Note="<i>Shadow Conjuration</i> %V/dy"',
  'Shadow Illusion':'Section=magic Note="<i>Silent Image</i> %V/dy"',
  'Shadow Jump':
    'Section=magic Note="<i>Dimension Door</i> between shadows %V\'/dy"',
  'Shadow Master':
    'Section=combat,save ' +
    'Note="DR 10/-, critical hit blinds d6 rd in dim light",' +
         '"+2 saves in dim light"',
  'Shadow Power':'Section=magic Note="<i>Shadow Evocation</i> %V/dy"',
  'Spell Critical':'Section=magic Note="Cast swift spell after critical hit"',
  'Spell Synthesis':
    'Section=magic ' +
    'Note="Cast two spells simultaneously, +2 vs. resistance, target -2 saves"',
  'Strength Boost':'Section=ability Note="+%V Strength"',
  'Summon Shadow':
    'Section=magic ' +
    'Note="Summon unturnable Shadow companion with %V HP, character attack/save, +4 will vs. channeled energy"',
  'Surprise Spells':
    'Section=combat Note="Sneak attack spell damage vs flat-footed foes"',
  'Swift Death':'Section=combat Note="Death attack w/out prior study 1/dy"',
  'The Lore Of True Stamina':'Section=save Note="+2 Fortitude"',
  'Tricky Spells':'Section=magic Note="Use Silent Spell and Still Spell %V/dy"',
  'True Death':
    'Section=combat ' +
    'Note="Raising victim requires DC %V <i>Remove Curse</i> or DC %1 caster level check"',
  'True Lore':
    'Section=magic Note="<i>Legend Lore</i>, <i>Analyze Dweomer</i> 1/dy"',
  'Weapon Trick':'Section=combat Note="+1 Melee Attack/+1 Ranged Attack"',
  'Whispering Campaign':
    'Section=magic Note="<i>Doom</i>/<i>Enthrall</i> via Bardic Performance"'
};

/* Defines rules related to basic character identity. */
PathfinderPrestige.identityRules = function(rules, classes) {
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots', 'Spells']);
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
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

/* Defines rules related to character aptitudes. */
PathfinderPrestige.talentRules = function(rules, features) {
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
PathfinderPrestige.classRulesExtra = function(rules, name) {

  if(name == 'Arcane Archer') {

    rules.defineRule(
      'combatNotes.arrowOfDeath', 'charismaModifier', '=', 'source + 20'
    );
    rules.defineRule('combatNotes.elementalArrows',
     'levels.Arcane Archer', '=',
     'source < 7 ? "flaming/frost/shock" : "flaming burst/icy burst/shocking burst"'
    );
    rules.defineRule
      ('combatNotes.hailOfArrows', 'levels.Arcane Archer', '+=', null);
    rules.defineRule(
      'combatNotes.phaseArrow', 'levels.Arcane Archer', '=',
      'Math.floor((source - 4) / 2)'
    );
    rules.defineRule(
      'combatNotes.seekerArrow', 'levels.Arcane Archer', '=',
      'Math.floor((source - 2) / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Arcane Archer', '=',
      'source >= 2 ? source - Math.floor((source + 3) / 4) : null'
    );

  } else if(name == 'Arcane Trickster') {

    rules.defineRule('combatNotes.impromptuSneakAttack',
      'levels.Arcane Trickster', '+=', 'source < 7 ? 1 : 2'
    );
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Arcane Trickster', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Arcane Trickster', '+=', null
    );
    rules.defineRule('magicNotes.invisibleThief',
      'levels.Arcane Trickster', '+=', null
    );
    rules.defineRule('magicNotes.trickySpells',
      'levels.Arcane Trickster', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('countmagehandspells', /^spells.Mage.Hand\(.*\)$/, '+=', '1');

  } else if(name == 'Assassin') {

    rules.defineRule('combatNotes.deathAttack',
      'levels.Assassin', '+=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.deathAttack.1', 'levels.Assassin', '+=', null);
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Assassin', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.trueDeath',
      'levels.Assassin', '+=', '10 + source'
    );
    rules.defineRule('combatNotes.trueDeath.1',
      'levels.Assassin', '+=', '15 + source'
    );
    rules.defineRule
      ('resistance.Poison', 'saveNotes.poisonTolerance', '+=', null);
    rules.defineRule('saveNotes.poisonTolerance',
      'levels.Assassin', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.hiddenWeapon', 'levels.Assassin', '=', null);
    rules.defineRule('assassinFeatures.Improved Uncanny Dodge',
      'assassinFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Assassin', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Assassin', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Dragon Disciple') {

    rules.defineRule('abilityNotes.wings',
      'levels.Dragon Disciple', '+=', 'source >= 9 ? 30 : null'
    );
    rules.defineRule('abilityNotes.strengthBoost',
      'levels.Dragon Disciple', '+=', 'source>=4 ? 4 : source>=2 ? 2 : null'
    );
    rules.defineRule('armorClass',
      'combatNotes.dragonDiscipleArmorClassAdjustment', '+', null
    );
    rules.defineRule('combatNotes.breathWeapon',
      'levels.Dragon Disciple', '+=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule('combatNotes.dragonBite',
      'levels.Dragon Disciple', '?', 'source >= 2',
      '', '=', '6',
      'features.Small', '=', '4',
      'features.Large', '=', '8'
    );
    rules.defineRule('combatNotes.dragonBite.1',
      'features.Dragon Bite', '?', null,
      'strengthModifier', '=', 'Math.floor(source * 1.5)'
    );
    rules.defineRule('combatNotes.dragonBite.2',
      'features.Dragon Bite', '?', null,
      'levels.Dragon Disciple', '=', 'source >= 6 ? ", d6 energy" : ""'
    );
    rules.defineRule('combatNotes.dragonDiscipleArmorClassAdjustment',
      'levels.Dragon Disciple', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('combatNotes.naturalArmor',
      'levels.Dragon Disciple', '+', 'source >= 7 ? 3 : source >= 4 ? 2 : 1'
    );
    rules.defineRule
      ('constitution', 'abilityNotes.constitutionBoost', '+', '2');
    rules.defineRule('featCount.Draconic',
      'levels.Dragon Disciple', '=', 'source<2 ? null : Math.floor((source + 4) / 6)'
    );
    rules.defineRule
      ('features.Bloodline Draconic', 'levels.Dragon Disciple', '=', '1');
    rules.defineRule('featureNotes.blindsense',
      'levels.Dragon Disciple', '^=', 'source >= 5 ? 30 : source >= 10 ? 60 : null'
    );
    rules.defineRule
      ('intelligence', 'abilityNotes.intelligenceBoost', '+', '2');
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Dragon Disciple', '+=', 'source - Math.floor((source + 3) / 4)'
    );
    rules.defineRule('magicNotes.dragonForm',
      'levels.Dragon Disciple', '=', 'source < 10 ? "I" : "II"'
    );
    rules.defineRule('magicNotes.dragonForm.1',
      'levels.Dragon Disciple', '=', 'source < 10 ? 1 : 2'
    );
    rules.defineRule('sorcererFeatures.Breath Weapon',
      'levels.Dragon Disciple', '=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule('sorcererFeatures.Wings',
      'levels.Dragon Disciple', '=', 'source >= 9 ? 1 : null'
    );
    rules.defineRule('strength', 'abilityNotes.strengthBoost', '+', null);
    // Choice of Draconic Bloodline if not Sorcerer
    rules.defineRule('selectableFeatureCount.Dragon Disciple',
      'levels.Dragon Disciple', '=', '1',
      'levels.Sorcerer', 'v', '0'
    );
    rules.defineRule('features.Bloodline Draconic',
      'selectableFeatureCount.Dragon Disciple', '=', 'source == 1 ? 1 : null'
    );
    rules.defineRule('bloodlineDraconicLevel',
      'selectableFeatureCount.Dragon Disciple', '=', 'source == 1 ? 0 : null',
      'levels.Dragon Disciple', '+', null
    );

  } else if(name == 'Duelist') {

    rules.defineRule('armorClass', 'combatNotes.cannyDefense', '+', null);
    rules.defineRule('combatNotes.cannyDefense',
      'intelligenceModifier', '+=', 'source < 0 ? null : source',
      'levels.Duelist', 'v', null
    );
    rules.defineRule('combatNotes.elaborateDefense',
      'levels.Duelist', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.improvedReaction',
      'levels.Duelist', '+=', 'source < 2 ? null : source < 8 ? 2 : 4'
    );
    rules.defineRule('combatNotes.preciseStrike', 'levels.Duelist', '=', null);
    rules.defineRule('initiative', 'combatNotes.improvedReaction', '+', null);
    rules.defineRule('save.Reflex', 'saveNotes.grace', '+', null);

  } else if(name == 'Eldritch Knight') {

    rules.defineRule('featCount.Fighter',
      'levels.Eldritch Knight', '+=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Eldritch Knight', '+=', 'source > 1 ? source - 1 : null'
    );

  } else if(name == 'Loremaster') {

    var allSkills = rules.getChoices('skills');
    for(var skill in allSkills) {
      if(skill.startsWith('Knowledge'))
        rules.defineRule('CountKnowledgeGe7',
          'skills.' + skill, '+=', 'source >= 7 ? 1 : null'
        );
    }
    rules.defineRule('armorClass', 'combatNotes.dodgeTrick', '+', '1');
    rules.defineRule('baseAttack', 'combatNotes.weaponTrick', '+','1');
    rules.defineRule('casterLevelArcane', 'levels.Loremaster', '+=', null);
    rules.defineRule
      ('featCount.General', 'featureNotes.applicableKnowledge', '+', '1');
    rules.defineRule('featureNotes.bonusLanguage',
      'levels.Loremaster', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule('hitPoints', 'combatNotes.secretHealth', '+','3');
    rules.defineRule('languageCount', 'featureNotes.bonusLanguage', '+', null);
    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Loremaster', '+=', null);
    rules.defineRule
      ('save.Fortitude', 'saveNotes.theLoreOfTrueStamina', '+', '2');
    rules.defineRule('save.Will', 'saveNotes.secretsOfInnerStrength', '+', '2');
    rules.defineRule
      ('save.Reflex', 'saveNotes.secretKnowledgeOfAvoidance', '+', '2');
    rules.defineRule('selectableFeatureCount.Loremaster',
      'levels.Loremaster', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('skillNotes.lore', 'levels.Loremaster', '+=', 'Math.floor(source / 2)');
    rules.defineRule('countskillfocusknowledgefeats',
      /^features.Skill\sFocus\s\(Knowledge/, '+=', '1'
    );

  } else if(name == 'Mystic Theurge') {

    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Mystic Theurge', '=', null
    );
    rules.defineRule('magicNotes.combinedSpells',
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
    rules.defineRule('featureNotes.bardicPerformance',
      'levels.Pathfinder Chronicler', '+=', '2 + 2 * (source - 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.epicTales',
      'levels.Pathfinder Chronicler', '=',
      'source >= 8 ? " or reading by others" : ""'
    );
    rules.defineRule('magicNotes.fascinate',
      'levels.Pathfinder Chronicler', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.fascinate.1',
      'levels.Pathfinder Chronicler', '+=', '10 + Math.floor((source-2) / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.inspiredAction',
      'levels.Pathfinder Chronicler', '=',
      'source < 9 ? "Move" : "Move/Standard"'
    );
    rules.defineRule('magicNotes.inspireCompetence',
      'levels.Pathfinder Chronicler', '+=', '1 + Math.floor((source - 1) / 4)'
    );
    rules.defineRule('magicNotes.inspireCourage',
      'levels.Pathfinder Chronicler', '+=', '1 + Math.floor((source - 1) / 6)'
    );
    rules.defineRule('saveNotes.liveToTellTheTale',
      'levels.Pathfinder Chronicler', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule(/^skillModifier.Knowledge/,
      'skillNotes.bardicKnowledge', '+', null
    );
    rules.defineRule('skillNotes.bardicKnowledge',
      'levels.Pathfinder Chronicler', '+=', 'Math.max(1, Math.floor(source / 2))'
    );
    rules.defineRule('skillNotes.masterScribe',
      'levels.Pathfinder Chronicler', '+=', null
    );

  } else if(name == 'Shadowdancer') {

    rules.defineRule('featureNotes.darkvision',
      'shadowdancerFeatures.Darkvision', '+=', '60'
    );
    rules.defineRule('magicNotes.shadowCall',
      'levels.Shadowdancer', '=', 'Math.floor(source / 2) - 1'
    );
    rules.defineRule('magicNotes.shadowIllusion',
      'levels.Shadowdancer', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.shadowJump',
      'levels.Shadowdancer', '=', '40 * Math.pow(2, Math.floor(source/2)-2)'
    );
    rules.defineRule('magicNotes.shadowPower',
      'levels.Shadowdancer', '=', 'source < 8 ? null : source < 10 ? 1 : 2'
    );
    rules.defineRule('magicNotes.summonShadow',
      'hitPoints', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('selectableFeatureCount.Shadowdancer',
      'levels.Shadowdancer', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('shadowdancerFeatures.Improved Uncanny Dodge',
      'shadowdancerFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Shadowdancer', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Shadowdancer', '+=', 'source >= 2 ? 1 : null'
    );

  }

};

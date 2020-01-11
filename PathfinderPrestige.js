/*
Copyright 2019, James J. Hayes

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
  PathfinderPrestige.classRules(Pathfinder.rules, PathfinderPrestige.CLASSES);
}

PathfinderPrestige.CLASSES = [
  'Arcane Archer', 'Arcane Trickster', 'Assassin', 'Dragon Disciple',
  'Duelist', 'Eldritch Knight', 'Loremaster', 'Mystic Theurge',
  'Pathfinder Chronicler', 'Shadowdancer'
];
PathfinderPrestige.SAVE_BONUS_GOOD = 'Math.floor((source + 1) / 2)';
PathfinderPrestige.SAVE_BONUS_POOR = 'Math.floor((source + 1) / 3)';

/* Defines the rules related to Pathfinder Prestige Classes. */
PathfinderPrestige.classRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];
    var klassNoSpace =
      klass.substring(0,1).toLowerCase() + klass.substring(1).replace(/ /g, '');

    if(klass == 'Arcane Archer') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      features = [
        '1:Enhance Arrows', '2:Caster Level Bonus', '2:Imbue Arrow',
        '3:Elemental Arrows', '4:Seeker Arrow', '5:Distance Arrows',
        '6:Phase Arrow', '8:Hail Of Arrows', '9:Aligned Arrows',
        '10:Arrow Of Death'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.arrowOfDeathFeature:' +
          'Special arrow requires foe DC %V fortitude save or die',
        'combatNotes.alignedArrowsFeature:Arrows anarchic/axiomatic/holy/unholy',
        'combatNotes.distanceArrowsFeature:x2 range',
        'combatNotes.elementalArrowsFeature:Arrows %V',
        'combatNotes.enhanceArrowFeature:Arrows treated as +1 magic weapons',
        'combatNotes.hailOfArrowsFeature:' +
          'Simultaneously fire arrows at %V targets 1/day',
        'combatNotes.phaseArrowFeature:' +
          'Arrow passes through normal obstacles %V/day',
        'combatNotes.seekerArrowFeature:Arrow maneuvers to target %V/day',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.imbueArrowFeature:Center spell where arrow lands',
        'validationNotes.arcaneArcherClassBaseAttack:Requires Base Attack >= 6',
        'validationNotes.arcaneArcherClassCasterLevel:' +
          'Requires Caster Level Arcane >= 1',
        'validationNotes.arcaneArcherClassFeats:' +
          'Requires Point Blank Shot/Precise Shot/' +
          'Weapon Focus (Longbow)||Weapon Focus (Shortbow)'
      ];
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon =  SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveReflex = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveWill = PathfinderPrestige.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Perception', 'Ride', 'Stealth', 'Survival'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule(
        'combatNotes.arrowOfDeathFeature', 'charismaModifier', '=', '20+source'
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

    } else if(klass == 'Arcane Trickster') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      features = [
        '1:Caster Level Bonus', '1:Ranged Legerdemain', '2:Sneak Attack',
        '3:Impromptu Sneak Attack', '5:Tricky Spells', '9:Invisible Thief',
        '10:Surprise Spells'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.impromptuSneakAttackFeature:' +
          'Declare any attack a sneak attack %V/day',
        'combatNotes.rangedLegerdemainFeature:' +
          '+5 DC on Disable Device/Sleight Of Hand at 30 ft',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.surpriseSpellsFeature:' +
          'Sneak attack spell damage vs flat-footed foes',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.invisibleThiefFeature:' +
          '<i>Greater Invisibility</i> %V rounds/day',
        'magicNotes.trickySpellsFeature:Silent/Still spell %V/day',
        'validationNotes.arcaneTricksterClassAlignment:' +
          'Requires Alignment !~ Lawful',
        'validationNotes.arcaneTricksterClassFeatures:' +
          'Requires Sneak Attack >= 2',
        'validationNotes.arcaneTricksterClassSkills:' +
          'Requires Disable Device >= 4/Escape Artist >= 4/' +
          'Knowledge (Arcana) >= 4',
        'validationNotes.arcaneTricksterClassSpells:' +
          'Requires Mage Hand/arcane level 3'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = PathfinderPrestige.SAVE_BONUS_POOR;
      saveReflex = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveWill = PathfinderPrestige.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Appraise', 'Bluff', 'Climb', 'Diplomacy', 'Disable Device',
        'Disguise', 'Escape Artist', 'Knowledge', 'Perception', 'Sense Motive',
        'Sleight Of Hand', 'Spellcraft', 'Stealth', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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
      rules.defineRule('validationNotes.arcaneTricksterClassSpells',
        'levels.Arcane Trickster', '=', '-11',
        // NOTE: False valid w/multiple Mage Hand spells
        /^spells\.Mage Hand/, '+=', '10',
        /^spellsKnown\.(AS|B|S|W)3/, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Assassin') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Death Attack', '1:Poison Use', '1:Sneak Attack',
        '1:Weapon Proficiency ' +
          '(Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Punching Dagger/Rapier/Sap/Shortbow/Composite Shortbow/Short Sword)',
        '2:Poison Tolerance', '2:Uncanny Dodge', '4:Hidden Weapons',
        '4:True Death', '5:Improved Uncanny Dodge', '6:Quiet Death',
        '8:Hide In Plain Sight', '9:Swift Death', '10:Angel Of Death'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.angelOfDeathFeature:Death attack dusts corpse 1/day',
        'combatNotes.deathAttackFeature:' +
          'Foe DC %V fortitude save on successful sneak attack after 3 ' +
          'rounds of study or die/paralyzed for d6+%1 rounds',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.quietDeathFeature:' +
          'Stealth check to perform Death Attack unnoticed',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.swiftDeathFeature:Death attack w/out prior study 1/day',
        'combatNotes.trueDeathFeature:' +
          'Raising victim requires DC %V <i>Remove Curse</i> or ' +
          'DC %1 caster level check',
        'combatNotes.uncannyDodgeFeature:Always adds dexterity modifier to AC',
        'featureNotes.poisonUseFeature:' +
          'No chance of self-poisoning when applying to blade',
        'saveNotes.poisonToleranceFeature:+%V vs. poison',
        'skillNotes.hiddenWeaponsFeature:+%V Sleight Of Hand (hide weapons)',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'validationNotes.assassinClassAlignment:Requires Alignment =~ Evil',
        'validationNotes.assassinClassSkills:' +
          'Requires Disguise >= 2/Stealth >= 5'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = PathfinderPrestige.SAVE_BONUS_POOR;
      saveReflex = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveWill = PathfinderPrestige.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Acrobatics', 'Bluff', 'Climb', 'Diplomacy', 'Disable Device',
        'Disguise', 'Escape Artist', 'Intimidate', 'Linguistics', 'Perception',
        'Sense Motive', 'Sleight Of Hand', 'Stealth', 'Swim', 'Use Magic Device'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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

    } else if(klass == 'Dragon Disciple') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Blood Of Dragons', '2:Caster Level Bonus', '2:Dragon Bite',
        '2:Strength Boost', '3:Breath Weapon', '5:Blindsense',
        '6:Constitution Boost', '7:Dragon Form', '8:Intelligence Boost',
        '9:Wings'
      ];
      hitDie = 12;
      notes = [
        'abilityNotes.constitutionBoostFeature:+2 constitution',
        'abilityNotes.intelligenceBoostFeature:+2 intelligence',
        'abilityNotes.strengthBoostFeature:+%V strength',
        'combatNotes.dragonBiteFeature:d%V+%1%2 bite when using claws',
        'combatNotes.dragonDiscipleArmorClassAdjustment:+%V',
        'featureNotes.blindsenseFeature:' +
          'Other senses allow detection of unseen objects w/in %V ft',
        'featureNotes.bloodOfDragonsFeature:' +
          'Dragon Disciple level triggers Bloodline Draconic features',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.dragonFormFeature:<i>Form Of The Dragon %V</i> %1/day',
        'validationNotes.dragonDiscipleClassBloodline:Requires Draconic',
        'validationNotes.dragonDiscipleClassLanguages:Requires Draconic',
        'validationNotes.dragonDiscipleClassRace:Requires Race !~ Dragon',
        'validationNotes.dragonDiscipleClassSkills:' +
          'Requires Knowledge (Arcana) >= 5',
        'validationNotes.dragonDiscipleClassSpells:' +
          'Requires arcane spells w/out preparation'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveReflex = PathfinderPrestige.SAVE_BONUS_POOR;
      saveWill = PathfinderPrestige.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Diplomacy', 'Escape Artist', 'Fly', 'Knowledge', 'Perception',
        'Spellcraft'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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
        'strengthModifier', '=', 'Math.floor(source * 1.5)'
      );
      rules.defineRule('combatNotes.dragonBiteFeature.2',
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

    } else if(klass == 'Duelist') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      features = [
        '1:Canny Defense', '1:Precise Strike', '2:Improved Reaction',
        '2:Parry', '3:Enhanced Mobility', '4:Combat Reflexes', '4:Grace',
        '5:Riposte', '6:Acrobatic Charge', '7:Elaborate Defense',
        '9:Deflect Arrows', '9:No Retreat', '10:Crippling Critical'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.acrobaticChargeFeature:May charge in difficult terrain',
        'combatNotes.cannyDefenseFeature:+%V AC when lightly/unarmored',
        'combatNotes.cripplingCriticalFeature:' +
          'Critical hit causes follow-on damage',
        'combatNotes.elaborateDefenseFeature:+%V AC when fighting defensively',
        'combatNotes.enhancedMobilityFeature:' +
          '+4 AC vs. movement AOO when lightly/unarmored',
        'combatNotes.improvedReactionFeature:+%V initiative',
        'combatNotes.noRetreatFeature:AOO on foe withdraw',
        'combatNotes.parryFeature:' +
          'Hit on full-round attack negates foe attack instead of damaging',
        'combatNotes.preciseStrikeFeature:' +
          '+%V damage with light piercing weapon',
        'combatNotes.riposteFeature:AOO after parry',
        'saveNotes.graceFeature:+2 Reflex when lightly/unarmored',
        'validationNotes.duelistClassBaseAttack:Requires Base Attack >= 6',
        'validationNotes.duelistClassFeats:' +
          'Requires Dodge/Mobility/Weapon Finesse',
        'validationNotes.duelistClassSkills:' +
          'Requires Acrobatics >= 2/Sum Perform >= 2'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = PathfinderPrestige.SAVE_BONUS_POOR;
      saveReflex = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveWill = PathfinderPrestige.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Acrobatics', 'Bluff', 'Escape Artist', 'Perception', 'Perform',
        'Sense Motive'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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

    } else if(klass == 'Eldritch Knight') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      features = [
       '1:Diverse Training', '2:Caster Level Bonus', '10:Spell Critical'
     ];
      hitDie = 10;
      notes = [
        'featureNotes.diverseTrainingFeature:' +
          'Eldritch Knight level satisfies Fighter/arcane feat prerequisite',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.spellCriticalFeature:Cast swift spell after critical hit',
        'validationNotes.eldritchKnightClassWeaponProficiencyLevel:' +
          'Requires Class Weapon Proficiency Level>='+SRD35.PROFICIENCY_MEDIUM,
        'validationNotes.eldritchKnightClassSpells:Requires arcane level 3'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveReflex = PathfinderPrestige.SAVE_BONUS_POOR;
      saveWill = PathfinderPrestige.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Climb', 'Knowledge (Arcana)', 'Knowledge (Nobility)', 'Linguistics',
        'Ride', 'Sense Motive', 'Spellcraft', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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

    } else if(klass == 'Loremaster') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      features = [
        '1:Caster Level Bonus', '2:Lore', '4:Bonus Language', '6:Greater Lore',
        '10:True Lore'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.dodgeTrickFeature:+1 AC',
        'combatNotes.secretHealthFeature:+3 HP',
        'combatNotes.weaponTrickFeature:+1 Attack',
        'featureNotes.applicableKnowledgeFeature:Bonus feat',
        'featureNotes.bonusLanguageFeature:%V additional language(s)',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'skillNotes.greaterLoreFeature:' +
          '+10 Spellcraft (identify magic item properties)',
        'magicNotes.moreNewfoundArcanaFeature:Bonus level 2 spell',
        'magicNotes.newfoundArcanaFeature:Bonus level 1 spell',
        'magicNotes.trueLoreFeature:' +
          '<i>Legend Lore</i>, <i>Analyze Dweomer</i> 1/day',
        'saveNotes.secretKnowledgeOfAvoidanceFeature:+2 Reflex',
        'saveNotes.secretsOfInnerStrengthFeature:+2 Will',
        'saveNotes.theLoreOfTrueStaminaFeature:+2 Fortitude',
        'skillNotes.instantMasteryFeature:4 ranks in untrained skill',
        'skillNotes.loreFeature:+%V all Knowledge, use any Knowledge untrained',
        'validationNotes.loremasterClassFeats:' +
          'Requires Skill Focus in any Knowledge skill/' +
          'any 3 metamagic or item creation',
        'validationNotes.loremasterClassSkills:Requires any 2 Knowledge >= 7',
        'validationNotes.loremasterClassSpells:' +
          'Requires any 7 divination/any level 3 divination'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = PathfinderPrestige.SAVE_BONUS_POOR;
      saveReflex = PathfinderPrestige.SAVE_BONUS_POOR;
      saveWill = PathfinderPrestige.SAVE_BONUS_GOOD;
      selectableFeatures = [
        'Applicable Knowledge', 'Dodge Trick', 'Instant Mastery',
        'More Newfound Arcana', 'Newfound Arcana', 'Secret Health',
        'Secret Knowledge Of Avoidance', 'Secrets Of Inner Strength',
        'The Lore Of True Stamina', 'Weapon Trick'
      ];
      skillPoints = 4;
      skills = [
        'Appraise', 'Diplomacy', 'Handle Animals', 'Heal', 'Knowledge',
        'Linguistics', 'Perform', 'Spellcraft', 'Use Magic Device'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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
      rules.defineRule('validationNotes.loremasterClassFeats',
        'levels.Loremaster', '=', '-13',
        // NOTE: False valid w/multiple Skill Focus (.* Knowledge) feats
        /^features.Skill Focus.*Knowledge/, '+', '10',
        // NOTE: False valid w/Natural Spell
        /^features\..*Spell$/, '+', '1',
        /^features\.(Brew|Craft|Forge|Scribe)/, '+', '1',
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.loremasterClassSkills',
        'levels.Loremaster', '=', '-2',
        /^skillModifier\.Knowledge/, '+=', 'source >= 7 ? 1 : null',
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.loremasterClassSpells',
        'levels.Loremaster', '=', '-107',
        // NOTE: False valid w/multiple Div3 spells
        /^spells\..*Div3/, '+', '100',
        /^spells\..*Div\d/, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Mystic Theurge') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = null;
      features = [
        '1:Caster Level Bonus', '1:Combined Spells', '10:Spell Synthesis'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.combinedSpellsFeature:' +
          'Fill spell slots up to level %V with spells from different class',
        'magicNotes.spellSynthesisFeature:' +
          'Cast two spells simultaneously, +2 vs. resistance, target -2 saves',
        'validationNotes.mysticTheurgeClassCasterLevelArcane:' +
          'Requires Caster Level Arcane >= 3',
        'validationNotes.mysticTheurgeClassCasterLevelDivine:' +
          'Requires Caster Level Divine >= 3',
        'validationNotes.mysticTheurgeClassSkills:' +
          'Requires Knowledge (Arcana) >= 3/Knowledge (Religion) >= 3'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      skillPoints = 2;
      skills = [
        'Knowledge (Arcana)', 'Knowledge (Religion)', 'Sense Motive',
        'Spellcraft'
      ];
      saveFortitude = PathfinderPrestige.SAVE_BONUS_POOR;
      saveReflex = PathfinderPrestige.SAVE_BONUS_POOR;
      saveWill = PathfinderPrestige.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('magicNotes.casterLevelBonusFeature',
        'levels.Mystic Theurge', '=', null
      );
      rules.defineRule('magicNotes.combinedSpellsFeature',
        'levels.Mystic Theurge', '+=', 'Math.floor((source + 1) / 2)'
      );

    } else if(klass == 'Pathfinder Chronicler') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Bardic Knowledge', '1:Deep Pockets', '1:Master Scribe',
        '2:Live To Tell The Tale', '2:Pathfinding', '3:Bardic Performance',
        '3:Countersong', '3:Distraction', '3:Fascinate', '3:Improved Aid',
        '3:Inspire Courage', '4:Epic Tales', '5:Inspire Competence',
        '5:Whispering Campaign', '6:Inspired Action', '7:Call Down The Legends',
        '8:Suggestion', '10:Dirge Of Doom', '10:Lay Of The Exalted Dead'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.pathfindingFeature:Treat trackless terrain as road',
        'combatNotes.improvedAidFeature:Aid Another action gives +4 bonus',
        'featureNotes.bardicPerformanceFeature:' +
          'Bardic Performance effect %V rounds/day',
        'featureNotes.deepPocketsFeature:' +
          'Retrieve any small object from backpack as a full-round action',
        'magicNotes.callDownTheLegendsFeature:' +
          'Summon 2d4 level 4 barbarians 1/week',
        'magicNotes.countersongFeature:' +
          'Perform check vs. sonic magic w/in 30 ft for 10 rounds',
        'magicNotes.dirgeOfDoomFeature:' +
          'Creatures w/in 30 ft shaken while performing',
        'magicNotes.distractionFeature:' +
          'Perform check vs. visual magic w/in 30 ft for 10 rounds',
        'magicNotes.epicTalesFeature:' +
          'Bardic Performance effect via writing%V',
        'magicNotes.fascinateFeature:' +
          '%V creatures w/in 90 ft DC %1 Will save or spellbound',
        'magicNotes.inspiredActionFeature:' +
          'Use Bardic Performance to give ally extra %V action',
        'magicNotes.inspireCompetenceFeature:' +
          '+%V ally skill checks while performing',
        'magicNotes.inspireCourageFeature:' +
          '+%V attack/damage and charm/fear saves to allies while performing',
        'magicNotes.layOfTheExaltedDeadFeature:' +
          'Summon d4+1 level 5 barbarians 1/week',
        'magicNotes.suggestionFeature:' +
          '<i>Suggestion</i> to 1 fascinated creature',
        'magicNotes.whisperingCampaignFeature:' +
          '<i>Doom</i>/<i>Enthrall</i> via Bardic Performance',
        'saveNotes.liveToTellTheTaleFeature:' +
          'Extra saving throw vs permanent contion %V/day',
        'saveNotes.pathfindingFeature:+5 vs. <i>Maze</i>',
        'skillNotes.bardicKnowledgeFeature:' +
          '+%V all Knowledge, use any Knowledge untrained',
        'skillNotes.deepPocketsFeature:' +
          '+4 Sleight Of Hand (conceal small objects)',
        'skillNotes.masterScribeFeature:+%V Linguistics/Profession (Scribe)/Use Magic Device (Scrolls)',
        'skillNotes.pathfindingFeature:' +
          '+5 Survival (avoid becoming lost), DC 15 Survival to extend to companion',
        'validationNotes.pathfinderChroniclerClassSkills:' +
          'Requires Linguistics >= 3/Perform (Oratory) >= 5/Profession (Scribe) >= 5'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      skillPoints = 8;
      skills = [
        'Appraise', 'Bluff', 'Diplomacy', 'Disguise', 'Escape Artist',
        'Intimidate', 'Knowledge', 'Linguistics', 'Perception', 'Perform',
        'Ride', 'Sense Motive', 'Sleight Of Hand', 'Survival',
        'Use Magic Device'
      ];
      saveFortitude = PathfinderPrestige.SAVE_BONUS_POOR;
      saveReflex = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveWill = PathfinderPrestige.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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

    } else if(klass == 'Shadowdancer') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Hide In Plain Sight',
        '1:Weapon Proficiency (Composite Shortbow/Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Mace/Morningstar/Punching Dagger/Quarterstaff/Rapier/Sap/Shortbow/Short Sword)',
        '2:Darkvision', '2:Evasion', '2:Uncanny Dodge', '3:Shadow Illusion',
        '3:Summon Shadow', '4:Shadow Call', '4:Shadow Jump', '5:Defensive Roll',
        '5:Improved Uncanny Dodge', '7:Slippery Mind', '8:Shadow Power',
        '10:Improved Evasion', '10:Shadow Master'
      ];
      notes = [
        'combatNotes.defensiveRollFeature:' +
          'DC damage Reflex save vs. lethal blow for half damage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.shadowMasterFeature:' +
           'DR 10/-, critical hit blinds for d6 rounds in dim light',
        'combatNotes.uncannyDodgeFeature:' +
          'Never flat-footed, adds dexterity modifier to AC vs. invisible foe',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.shadowCallFeature:DC %V <i>Shadow Conjuration</i> %1/day',
        'magicNotes.shadowIllusionFeature:DC %V <i>Silent Image</i> %1/day',
        'magicNotes.shadowJumpFeature:' +
           '<i>Dimension Door</i> between shadows %V feet/day',
        'magicNotes.shadowPowerFeature:DC %V <i>Shadow Evocation</i> %1/day',
        'magicNotes.summonShadowFeature:' +
          'Summon unturnable Shadow companion with ' +
          '%V HP, character attack/save, +4 will vs. channeled energy',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of half',
        'saveNotes.improvedEvasionFeature:Failed save yields half damage',
        'saveNotes.shadowMasterFeature:+2 saves in dim light',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'validationNotes.shadowdancerClassFeatures:' +
          'Requires Combat Reflexes/Dodge/Mobility',
        'validationNotes.shadowdancerClassSkills:' +
          'Requires Stealth >= 5/Perform (Dance) >= 2'
      ];
      hitDie = 8;
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      skillPoints = 6;
      skills = [
        'Acrobatics', 'Bluff', 'Diplomacy', 'Diguise', 'Escape Artist',
        'Perception', 'Perform', 'Slight Of Hand', 'Stealth'
      ];
      saveFortitude = PathfinderPrestige.SAVE_BONUS_POOR;
      saveReflex = PathfinderPrestige.SAVE_BONUS_GOOD;
      saveWill = PathfinderPrestige.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Bleeding Attack', 'Combat Trick', 'Fast Stealth', 'Finesse Rogue',
        'Ledge Walker', 'Major Magic', 'Minor Magic', 'Quick Disable',
        'Resiliency', 'Rogue Crawl', 'Slow Reactions', 'Stand Up',
        'Surprise Attack', 'Trap Spotter', 'Rogue Weapon Training',
        'Crippling Strike', 'Defensive Roll', 'Dispelling Attack',
        'Feat Bonus', 'Improved Evasion', 'Opportunist', 'Skill Mastery',
        'Slippery Mind'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('featureNotes.darkvisionFeature',
        'shadowdancerFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('magicNotes.shadowCallFeature',
        'charismaModifier', '=', '14 + source'
      );
      rules.defineRule('magicNotes.shadowCallFeature.1',
        'levels.Shadowdancer', '=', 'Math.floor(source / 2) - 1'
      );
      rules.defineRule('magicNotes.shadowIllusionFeature',
        'charismaModifier', '=', '11 + source'
      );
      rules.defineRule('magicNotes.shadowIllusionFeature.1',
        'levels.Shadowdancer', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.shadowJumpFeature',
        'levels.Shadowdancer', '=', '40 * Math.pow(2, Math.floor(source/2)-2)'
      );
      rules.defineRule('magicNotes.shadowPowerFeature',
        'charismaModifier', '=', '15 + source'
      );
      rules.defineRule('magicNotes.shadowPowerFeature.1',
        'levels.Shadowdancer', '=', 'Math.floor(source / 2) - 3'
      );
      rules.defineRule('magicNotes.summonShadowFeature',
        'hitPoints', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('selectableFeatureCount.Shadowdancer',
        'levels.Shadowdancer', '+=', 'Math.floor(source / 3)'
      );

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

};

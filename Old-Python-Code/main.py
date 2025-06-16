import os
import ast
import random
#import MainMenu

import json

# Specifies the size of the windows command prompt console
#os.system("mode con cols=80 lines=60")


class Player(object):

    def __init__(self, name, player_class, max_hp, hp, strength, ac, sta,
                 max_mana, mana, equipment, items, gold, xp, back, used_item,
                 weapon, armor, combat, special, room):
        self.name = name
        self.player_class = player_class
        self.max_hp = max_hp
        self.hp = hp
        self.strength = strength
        self.ac = ac
        self.sta = sta
        self.max_mana = max_mana
        self.mana = mana
        self.equipment = equipment
        self.items = items
        self.gold = gold
        self.xp = xp
        self.back = back
        self.used_item = used_item
        self.weapon = weapon
        self.armor = armor
        self.combat = combat
        self.special = special
        self.room = room

    level = 1

    def attack(self, enemy):
        """Attack method for fighter class."""
        player.back = False
        while True:
            print('\n[Weapon] | [Gut] punch | [Back]')
            choice = input('Select Attack > ').lower()
            if choice == 'back':
                player.back = True
                break
            elif choice in 'weapon':
                self.melee_attack(enemy)
                break
            elif choice == 'gut':
                if player.special < 1:
                    input('\nYou can\'t get a good shot at their stomach!')
                    continue
                else:
                    player.special -= 2
                    enemy.stunned = 1
                    damage = random.randint(1, 3)
                    enemy.hp -= damage
                    input(f'''
{self.name} punches {enemy.name} in the stomach for {damage} damage!
{enemy.name} doubles over in pain. > ''')
                break

    def melee_attack(self, enemy):
        """Basic melee attack for all classes."""
        attack = 2 + self.strength + int(self.sta * random.random())
        damage = int(random.random() * (self.sta / 2)) + self.strength
        if attack >= enemy.ac:
            input(
                f'\n{self.name} strikes {enemy.name} with their {self.weapon} for {damage} damage!'
            )
            enemy.hp -= damage
        else:
            print(f'\n{self.name} missed!')

    def thievery(self, enemy):
        """Handles additional options for thieves in combat."""
        player.back = False
        while True:
            choice = input('\n[Steal] | [Backstab] | [Back] > ').lower()
            if choice == 'back':
                player.back = True
                break
            elif choice == 'steal':
                if random.randint(0, 10) > 2:
                    loot_type = random.randint(1, 100)
                    if loot_type > 65:
                        gold = random.randint(1, 15)
                        player.gold += gold
                        input(f'\nYou successfully steal {gold} gold!')
                        break
                    elif 16 < loot_type < 65:
                        i = random.choice(items)
                        player.items.append(i)
                        input(f'\nYou successfully steal a {i.name}!')
                        break
                    elif 0 < loot_type < 15:
                        i = random.choice(weapons)
                        player.equipment.append(i)
                        input(f'\nYou successfully steal a {i.name}!')
                        break
                    else:
                        i = random.choice(magic_items)
                        player.equipment.append(i)
                        input(f'\nYou successfully steal a {i.name}!')
                        break
                else:
                    input('\nThe creature catches you rifling through its '
                          'things!')
                    break
            elif choice == 'backstab':
                if player.special < 1:
                    input('\nYou are too exhausted to attempt another '
                          'backstab!')
                else:
                    input('\nYou attempt to maneuver behind the creature...')
                    attack = 5 + self.strength + int(
                        self.sta * random.random())
                    damage = int(random.random() *
                                 (self.sta / 2)) + self.strength + 10
                    if attack >= enemy.ac:
                        input(
                            f'\n{self.name} backstabs {enemy.name} with their {self.weapon} for {damage} damage!'
                        )
                        enemy.hp -= damage
                        player.special -= 1
                        break
                    else:
                        print(f'\n{self.name} missed!')
                        player.special -= 1
                        break

    def spells(self, enemy):
        """Spells menu that only mages have access to."""
        player.back = False
        while True:
            print('\n[Heal | 4 MP] | [Fireball | 7 MP] | [Stun | 10 MP]' \
                   ' | [Back] > ')
            print(f' MP: {player.mana}')
            choice = input('\nSelect Spell > ').lower()
            if choice == 'back':
                player.back = True
                break
            elif choice == 'heal':
                if player.mana < 4:
                    print('You do not have enough mana to cast Heal!')
                else:
                    self.hp += 8
                    self.mana -= 4
                    if self.hp > self.max_hp:
                        self.hp = self.max_hp
                    print(f'\n{player.name} casts Heal and regains 8 HP!')
                    break
            elif choice == 'fireball':
                if not player.combat:
                    input('\nNothing to cast Fireball on! > ')
                elif player.mana < 7:
                    print('You do not have enough mana to cast Fireball!')
                else:
                    self.mana -= 7
                    spell_damage = random.randint(12, 15)
                    enemy.hp -= spell_damage
                    print(
                        f'\n{player.name} casts Fireball! {enemy.name} takes {spell_damage} damage!'
                    )
                    break
            elif choice == 'stun':
                if not player.combat:
                    input('\nNothing to cast Stun on! > ')
                elif player.mana < 5:
                    print('You do not have enough mana to cast Stun!')
                else:
                    self.mana -= 10
                    enemy.stunned = 2
                    input(
                        f'\n{self.name} casts Stun! {enemy.name}\'s eyes glaze over...'
                    )
                    break

    def inv(self):
        """First layer of inventory function.  Displays list of items
               currently in inventory and actions that can be performed with
               them."""
        player.back = False
        while True:
            if len(self.equipment) < 1 and len(
                    self.items) < 1 and self.gold < 1:
                print('\nYou are not currently carrying anything.')
            else:
                print('\n////////////////////////////')
                print('You are currently carrying...')
                print('\nEquipment:')
                for i in self.equipment:
                    print(i.name)
                print('\nItems:')
                if len(player.items) < 1:
                    print('None')
                else:
                    for i in self.items:
                        print(i.name)
                print(f'\nGold: {player.gold}')
            choice = input('\n[Equip] | [Use] | [Inspect] | [Back] > ').lower()
            if choice == 'equip':
                self.change_equipment()
                if player.back:
                    continue
                else:
                    break
            elif choice == 'use':
                if player.combat:
                    player.used_item = True
                    break
                elif not player.combat:
                    self.use_item(spider)
            elif choice == 'inspect':
                self.inspect()
                continue
            elif choice == 'back':
                player.back = True
                break
            else:
                continue

    def change_equipment(self):
        """Handles the [Equip] option from first inventory menu."""
        player.back = False
        while True:
            print('\nEquipment:')
            for i in self.equipment:
                print(self.equipment.index(i), i.name)
            try:
                choice = input('\nSelect item with its number or '
                               '[Back] > ').lower()
                if choice == 'back':
                    player.back = True
                    break
                intchoice = int(choice)
                if player.weapon == self.equipment[intchoice].name or \
                        player.armor == self.equipment[intchoice].name:
                    confirm = input(
                        f'Would you like to unequip the {self.equipment[intchoice].name}? > '
                    ).lower()
                    if 'yes' in confirm:
                        self.equipment[intchoice].unequip()
                        break
                else:
                    confirm = input(
                        f'Would you like to equip the {self.equipment[intchoice].name}? > '
                    ).lower()
                    if 'yes' in confirm:
                        self.equipment[intchoice].equip()
                        break
            except ValueError:
                continue

    def use_item(self, enemy):
        """Handles [Use] from first inventory menu."""
        player.used_item = False
        player.back = False
        while not player.used_item:
            print('\nItems:')
            for i in self.items:
                print(self.items.index(i), i.name)
            try:
                choice = input('\nSelect item by its number or '
                               '[Back] > ').lower()
                if choice == 'back':
                    player.back = True
                    break
                intchoice = int(choice)
                itemchoice = self.items[intchoice]
                confirm = input(
                    f'Would you like to use the {self.items[intchoice].name}? > '
                ).lower()
                if 'yes' in confirm:
                    # These if statements are figuring out if the item chosen
                    # will add HP/Mana to the player or deal damage to the enemy
                    if itemchoice.plus_mana == 0 and itemchoice.damage == 0:
                        self.hp += itemchoice.plus_hp
                        if self.hp > self.max_hp:
                            self.hp = self.max_hp
                        input(
                            f'\n{self.name} uses the {itemchoice.name} and regains {itemchoice.plus_hp} HP!'
                        )
                        del self.items[intchoice]
                        player.used_item = True
                    elif itemchoice.plus_hp == 0 and itemchoice.damage == 0:
                        self.mana += itemchoice.plus_mana
                        if self.mana > self.max_mana:
                            self.mana = self.max_mana
                        input(
                            f'\n{self.name} uses the {itemchoice.name} and regains {itemchoice.plus_mana} MP!'
                        )
                        del self.items[intchoice]
                        player.used_item = True
                    elif itemchoice.plus_hp == 0 and itemchoice.plus_mana == 0:
                        if not player.combat:
                            input(f'\nNothing to use {itemchoice.name} on!')
                        else:
                            input(
                                f'\n{self.name} uses the {itemchoice.name} on {enemy.name} and deals {itemchoice.damage} damage!'
                            )
                            enemy.hp -= itemchoice.damage
                            del self.items[intchoice]
                            player.used_item = True
            except ValueError:
                continue

    def inspect(self):
        """Handles [Inspect] option from inventory menu.  Displays an item's
               stats given its index in player.equipment."""
        player.back = False
        print('\nEquipment:')
        for i in self.equipment:
            print(self.equipment.index(i), i.name)
        while True:
            try:
                choice = input(
                    '\nInspect an item by its number or [BACK] > ').lower()
                if choice == 'back':
                    player.back = True
                    break
                intchoice = int(choice)
                if hasattr(self.equipment[intchoice], 'attack'):
                    print('\n', self.equipment[intchoice].name.title())
                    print(f'Attack: {self.equipment[intchoice].attack}')
                    print(
                        f'AC Penalty: {self.equipment[intchoice].ac_penalty}')
                else:
                    print('\n', self.equipment[intchoice].name.title())
                    print(f'Defense: {self.equipment[intchoice].defense}')
            except ValueError:
                print('\nChoose an item by its number')

    def status(self):
        """Displays current player status."""
        player.back = False
        while True:
            print('\n////////////////////////////')
            print(f'{player.name}\'s status:')
            print(f'HP: {player.hp}, MP: {player.mana}')
            print(f'Strength: {player.strength}, Stamina: {player.sta}')
            print(f'AC: {player.ac}')
            print('\nEquipped:')
            if player.weapon == '':
                print('Weapon: None')
            else:
                print(f'Weapon: {player.weapon}')
            if player.armor == '':
                print('Armor: None')
            else:
                print(f'Armor: {player.armor}')
            print('\nItems:')
            if len(player.items) < 1:
                print('None')
            else:
                for i in player.items:
                    print(i.name)
            print(f'\nLevel {player.level} {player.player_class}')
            print(f'XP to next level: {10 - player.xp}')
            back = input('\n[Back] > ')
            if back in 'back':
                player.back = True
                break

    def flee(self):
        """Handles the [Flee] option from the combat menu.  Randomly
               determines if the monster blocks your flight attempt."""
        while True:
            flee_chance = random.randint(1, 10)
            if flee_chance > 4:
                input('\nYou scramble through the door behind you and '
                      'flee! > ')
                input('\nYou find yourself in an unfamiliar room with one '
                      'untried door. > ')
                room_selector()
            else:
                input('\nAs you turn to leave the monster blocks your '
                      'exit!')
                break

    def levelup(self):
        self.max_hp += 5
        self.strength += 2
        self.ac += 1
        self.sta += 2
        self.max_mana += 5
        self.level += 1
        self.xp = 0
        input(f'\n{player.name} has gained a level!')

    def rest(self):
        """Handles [Rest] option from main menu."""
        confirm = input('Are you sure you would like to rest? > ').lower()
        if confirm == 'no':
            player.back = True
        else:
            hours = random.randint(2, 6)
            mp_regained = hours * 3
            input('''
You spread the threadbare bedroll from your backpack on the ground before you.
Moments after you lay down, you begin to doze off. > ''')
            if random.randint(0, 10) > 6:
                monster_during_rest()
            else:
                input(f'\nYou awaken after {hours} hours feeling refreshed.')
                if player.player_class == 'mage':
                    if player.hp == player.max_hp and \
                            player.mana != player.max_mana:
                        player.mana += mp_regained
                        if self.mana > self.max_mana:
                            self.mana = self.max_mana
                        print(f'\n{player.name} regains {mp_regained} MP!')
                    elif player.hp != player.max_hp and player.mana == player.max_mana:
                        player.hp += hours
                        if self.hp > self.max_hp:
                            self.hp = self.max_hp
                        print(f'\n{player.name} regains {hours} HP!')
                    else:
                        player.hp += hours
                        player.mana += mp_regained
                        if self.hp > self.max_hp:
                            self.hp = self.max_hp
                        if self.mana > self.max_mana:
                            self.mana = self.max_mana
                        print(
                            f'\n{player.name} regains {hours} HP and {mp_regained} MP!'
                        )
                #else:
                #if player.hp != player.max_hp:
                #player.hp += hours
                #if self.hp > self.max_hp:
                #self.hp = self.max_hp
                #print(f'\n{player.name} regains {hours} HP!')###


class Monster(object):

    def __init__(self, name, max_hp, hp, strength, ac, sta, xp, weapon,
                 stunned):
        self.name = name
        self.max_hp = max_hp
        self.hp = hp
        self.strength = strength
        self.ac = ac
        self.sta = sta
        self.xp = xp
        self.weapon = weapon
        self.stunned = stunned

    def melee_attack(self, enemy):
        """Basic melee attack for monsters."""
        attack = 2 + self.strength + int(self.sta * random.random())
        damage = int(random.random() * (self.sta / 2)) + self.strength
        if attack >= enemy.ac:
            print(
                f'\n{self.name} strikes {enemy.name} with their {self.weapon} for {damage} damage!'
            )
            enemy.hp -= damage
        else:
            print(f'\n{self.name} missed!')


class Boss(object):

    def __init__(self, name, hp, ac, spells, stunned):
        self.name = name
        self.hp = hp
        self.ac = ac
        self.spells = spells
        self.stunned = stunned

    def attack(self, player):
        """The boss's basic attack."""
        damage = random.randint(5, 7)
        if random.randint(1, 10) > 4:
            player.hp -= damage
            input(
                f'\n{self.name} casts {random.choice(self.spells)} on {player.name} for {damage} damage!'
            )
        else:
            input(f'\n{self.name}\'s spell fizzles!')

    def special_attack(self, player):
        """Special attack that the boss uses every three turns."""
        damage = random.randint(8, 15)
        if random.randint(1, 10) > 4:
            player.hp -= damage
            input(f'''
{self.name}'s eyes glaze over as an unnatural maelstrom materializes within
the chamber.  Bits of debris and intense winds tear at {player.name}\'s body
for {damage} damage. ''')

    def transform(self):
        """Boss transforms once first form is reduced to 0 HP.  He gains
               HP/AC and a new attack."""
        input('''
The figure suddenly springs into the air and hovers a short ways off the
ground. Spears of light begin to radiate from its body, eroding the
surrounding skin and clothing.  You shield your eyes from an eruption of
intense light and behold the transformed figure.  A hulking demon nearly
thirty feet tall stands before you, covered in thick black fur and sporting
huge talons each the size of a long spear. > ''')
        self.name = 'a hulking demon'
        self.hp = 25
        self.ac = 10

    def transform_attack(self, player):
        """New basic attack for the boss once he's transformed."""
        damage = random.randint(8, 12)
        if random.randint(1, 10) > 4:
            player.hp -= damage
            input(f'''
{self.name} slashes {player.name} with their monstrous claws for {damage} damage!'''
                  )
        else:
            input(f'\n{self.name} misses with their monstrous claws!')

    def boss_battle(self, player):
        """Separate method to handle combat with the boss since a few
               special cases are required."""
        turn = 1
        player.combat = True
        player.special = 2
        while True:
            combat_choice(player, self)
            if self.name == 'a mysterious figure' and self.hp <= 0:
                self.transform()
            elif self.hp < 1:
                input('''
The demon is slain and the evil corruption plaguing the land has been
destroyed.''')
                input('\n\n\n\nGame Over')
                quit()
            if self.stunned > 0:
                input(f'\n{self.name} is stunned!')
                self.stunned -= 1
            elif turn % 3 == 0:
                self.special_attack(player)
            elif turn % 3 != 0 and self.name == 'a hulking demon':
                input(f'\n{self.name} readies their attack...')
                self.transform_attack(player)
            else:
                input(f'\n{self.name} begins to chant softly...')
                self.attack(player)
            if player.hp < 1:
                input(f'''
{player.name} has been slain by {self.name}!\n\n\n\n\nGame Over. > ''')
                quit()
            turn += 1


# Classes for all the items in the game follow.
class Weapon(object):

    def __init__(self, name, attack, ac_penalty, price):
        self.name = name
        self.attack = attack
        self.ac_penalty = ac_penalty
        self.price = price

    def equip(self):
        player.strength += self.attack
        player.sta += self.attack / 2
        player.ac -= self.ac_penalty
        player.weapon = self.name
        print(f'\nYou have equipped the {self.name}.')

    def unequip(self):
        player.strength -= self.attack
        player.sta -= self.attack / 2
        player.ac += self.ac_penalty
        player.weapon = ''
        print(f'\nYou have unequipped the {self.name}.')


class MagicWeapon(object):

    def __init__(self, name, attack, ac_penalty, price):
        self.name = name
        self.attack = attack
        self.ac_penalty = ac_penalty
        self.price = price

    def equip(self):
        player.strength += self.attack
        player.sta += self.attack / 2
        player.ac -= self.ac_penalty
        player.weapon = self.name
        print(f'\nYou have equipped the {self.name}.')

    def unequip(self):
        player.strength -= self.attack
        player.sta -= self.attack / 2
        player.ac += self.ac_penalty
        player.weapon = ''
        print(f'\nYou have unequipped the {self.name}.')


class Armor(object):

    def __init__(self, name, defense, price):
        self.name = name
        self.defense = defense
        self.price = price

    def equip(self):
        player.ac += self.defense
        player.armor = self.name
        print(f'\nYou have equipped the {self.name}.')

    def unequip(self):
        player.ac -= self.defense
        player.armor = ''
        print(f'\nYou have unequipped the {self.name}.')


class Item(object):

    def __init__(self, name, plus_hp, plus_mana, damage, price):
        self.name = name
        self.plus_hp = plus_hp
        self.plus_mana = plus_mana
        self.damage = damage
        self.price = price


def combat(player, enemy):
    """Handles the logic flow of combat."""
    enemy.hp = enemy.max_hp
    player.combat = True
    player.special = 2
    while True:
        combat_choice(player, enemy)
        if enemy.hp < 1:
            victory(player, enemy)
            break
        if enemy.stunned > 0:
            input(f'\n{enemy.name} is stunned!')
            enemy.stunned -= 1
        else:
            input(f'\n{enemy.name} readies their attack... > ')
            enemy.melee_attack(player)
        # Player death
        if player.hp < 1:
            print(f'\n{enemy.name} has vanquished {player.name}!')
            input('\nGame Over.')
            quit()


def combat_choice(player, enemy):
    """This is the menu that is brought up for the player at the start of
         each combat round."""
    print(f'\n{player.name}\'s HP: {player.hp}')
    print(f'{player.name}\'s MP: {player.mana}')
    while True:
        print(f'\n{enemy.name}\'s HP: {enemy.hp}')
        if player.room == final_room:
            if player.player_class == 'mage':
                choice = input('\n[Attack] | [Spells] | [Inventory] | '
                               '[Status] > ').lower()
            elif player.player_class == 'thief':
                choice = input('\n[Attack] | [Thievery] | [Inventory] | '
                               '[Status] > ').lower()
            else:
                choice = input(
                    '\n[Attack] | [Inventory] | [Status] > ').lower()
        elif player.player_class == 'mage':
            choice = input('\n[Attack] | [Spells] | [Inventory] | '
                           '[Status] | [Flee] > ').lower()
        elif player.player_class == 'thief':
            choice = input('\n[Attack] | [Thievery] | [Inventory] | '
                           '[Status] | [Flee] > ').lower()
        else:
            choice = input('\n[Attack] | [Inventory] | [Status] | '
                           '[Flee] > ').lower()
        if choice == 'attack':
            if player.player_class == 'fighter':
                player.attack(enemy)
                if player.back:
                    continue
            else:
                player.melee_attack(enemy)
            break
        elif choice == 'spells':
            player.spells(enemy)
            if player.back:
                continue
            else:
                break
        elif choice == 'thievery':
            player.thievery(enemy)
            if player.back:
                continue
            else:
                break
        elif choice == 'inventory':
            player.inv()
            if player.used_item:
                player.use_item(enemy)
                if not player.used_item:
                    continue
                elif player.used_item:
                    break
            elif player.back:
                continue
            else:
                break
        elif choice == 'status':
            player.status()
            if player.back:
                continue
            else:
                break
        elif choice == 'flee':
            player.flee()
            break


def victory(player, enemy):
    """Victory conditions."""
    player.combat = False
    xp_gained = enemy.xp
    hp_regained = random.randint(1, 4)
    mp_regained = random.randint(1, 3)
    print(f'\n{player.name} has vanquished {enemy.name}!')
    gold_gained = random.randint(1, 10)
    player.gold += gold_gained
    if player.player_class == 'mage':
        player.xp += xp_gained
        player.hp += hp_regained
        player.mana += mp_regained
        if player.hp > player.max_hp:
            player.hp = player.max_hp
        if player.mana > player.max_mana:
            player.mana = player.max_mana
        input(
            f'{player.name} regains {hp_regained} HP, {mp_regained} MP, gains {gold_gained} gold, and gains {xp_gained} experience! > '
        )
    else:
        player.xp += xp_gained
        player.hp += hp_regained
        if player.hp > player.max_hp:
            player.hp = player.max_hp
        input(
            f'{player.name} regains {hp_regained} HP, gains {gold_gained} gold, and gains {xp_gained} experience! > '
        )
    if player.xp > 9:
        player.levelup()


def room_selector():
    """Randomly selects the next room from the random_room list.
         When the player has visited enough rooms, go to final room."""
    # Track how many rooms have been visited
    if not hasattr(room_selector, 'visits'):
        room_selector.visits = 0

    # After certain number of rooms, go to final room
    if room_selector.visits >= 5:  # Adjust number as desired
        final_room.enter()
    else:
        # Choose a random room without removing it
        i = random.choice(random_room)
        room_selector.visits += 1
        i()


def monster_chance():
    """Randomly determine if a monster is present in a room or not."""
    if random.randint(0, 10) > 3:
        return True
    else:
        return False


def random_monster():
    """Randomly selects a monster from the list, starts combat."""
    i = random.choice(random_monsters)
    if len(random_monsters) == 0:
        pass
    elif player.player_class == 'thief':
        print(
            f'\nYou open the door quietly and can see {i.name} patrolling the next room.'
        )
        choice = input('Do you attempt to sneak past the creature? > ').lower()
        if choice == 'yes':
            stealth_chance = random.randint(1, 100)
            if stealth_chance > 40:
                input(f'\nYou slip by {i.name} unnoticed. > ')
            else:
                random_monsters.remove(i)
                input(
                    f'\nYou\'ve alerted {i.name}!  The creature rushes toward you!'
                )
                combat(player, i)
        else:
            random_monsters.remove(i)
            print(f'\nYou rush toward {i.name}!')
            combat(player, i)
    else:
        random_monsters.remove(i)
        input(f'\nAs you open the door {i.name} rushes toward you!')
        combat(player, i)


def monster_during_rest():
    """Determines if a monster will attack while the player rests."""
    i = random.choice(random_monsters)
    input(f'''
You abrubtly wake from your slumber to the sound of {i.name} rushing
toward you! ''')
    combat(player, i)


def loot_chance():
    """Chance that the player will find loot."""
    chance = random.randint(1, 100)
    if chance > 55:
        return True
    else:
        return False


def loot():
    """Determines type of loot, appends it to player.equipment
         or player.items."""
    loot_type = random.randint(1, 100)
    if 36 < loot_type < 75:
        i = random.choice(items)
        player.items.append(i)
        input(f'\nYou find a {i.name}!')
    elif 0 < loot_type < 35:
        i = random.choice(weapons)
        player.equipment.append(i)
        input(f'\nYou find a {i.name}!')
    else:
        i = random.choice(magic_items)
        player.equipment.append(i)
        input(f'\nYou find a {i.name}!')


def agency():
    """Displays non-combat menu of choices for the player when they enter
         a room."""
    while True:
        if player.player_class == 'mage':
            if player.room == shop:
                print(f'\n{player.name}\'s HP: {player.hp}, MP: {player.mana}')
                choice = input('[Search] | [Shop] | [Inventory] | [Spells]'
                               ' | [Status] | [Rest] | [Proceed] > ').lower()
            else:
                print(f'\n{player.name}\'s HP: {player.hp}, MP: {player.mana}')
                choice = input('[Search] | [Inventory] | [Spells] | '
                               '[Status] | [Rest] | [Proceed] > ').lower()
        else:
            if player.room == shop:
                print(f'\n{player.name}\'s HP: {player.hp}')
                choice = input('[Search] | [Shop] | [Inventory] | [Status]'
                               ' | [Rest] | [Proceed] > ').lower()
            else:
                print(f'\n{player.name}\'s HP: {player.hp}')
                choice = input('[Search] | [Inventory] | [Status] | [Rest] | [Proceed] > ').lower()
        if choice == 'search':
            player.room.search()
            continue
        elif choice == 'inventory':
            player.inv()
            continue
        elif choice == 'shop':
            shop.shop()
        elif choice == 'spells':
            player.spells(goblin)
            continue
        elif choice == 'status':
            player.status()
            continue
        elif choice == 'rest':
            player.back = False
            player.rest()
            if player.back:
                continue
        elif choice == 'proceed':
            player.room.proceed()


# All the room objects follow. Room.enter() is called when a room
# is randomly selected by room_selector() from the random_room list


class Room1(object):
    possible_loot = True

    def enter(self):
        """The line  below changes the 'room' attribute of main.player,
               so it can be used in the agency() function to call the right
               [Search] and [Proceed] functions. """
        #main.player.room = room1
        if monster_chance():
            random_monster()
            print(
                "\n The room is dimly lit by clumps of luminescent fungi growing in the cracks of the stone walls."
            )
        else:
            print(
                "\n You open the door to a room dimly lit by clumps of luminescent fungi growing in the cracks of "
                "the stone walls.")
        agency()

    def search(self):
        input('''
You spot a pile of skeletal remains in the room's far corner.  As you approach
the pile it becomes clear the remains belonged to an orc clan, presumably
living somewhere in the mine.  The bodies were piled carelessly and much of
their clothing looks relatively intact. > ''')
        search = input('\nSearch the remains? > ').lower()
        if search == 'yes':
            if Room1.possible_loot:
                if loot_chance():
                    input(
                        'You sift through the remains and uncover some treasure!'
                    )
                    loot()
                    Room1.possible_loot = False
                else:
                    print(
                        '\nYou find nothing of value amongst the remains. > ')
                    Room1.possible_loot = False
            else:
                print('\nYou find nothing of value amongst the remains. > ')

    def proceed(self):
        print('''
You are faced with two paths, a rusted [iron] door directly ahead and a simple
copper door down a [hallway] to your left.''')
        while True:
            choice = input('\nWhich do you choose? > ')
            if choice == 'iron':
                if player.player_class == 'thief':
                    input('The door is locked!  Attempt to unlock? > ')
                    input('You successfully unlock the door!')
                    player.xp += 3
                    input('\nYou gain 3 experience!')
                    if player.xp > 9:
                        player.levelup()
                    room_selector()
                else:
                    input('The door is locked!')
            elif choice == 'hallway':
                room_selector()
            else:
                print('\nChoose a door to continue.')
                continue


class Room2(object):
    possible_loot = True

    def enter(self):
        player.room = room2
        if monster_chance():
            random_monster()
        print('''\n\n\n\n\n
You have entered a large open chamber.  Iron tracks lead down three separate
tunnels, each blocked by a hastily constructed door.  A distant mechanical
CLANK momentarily disturbs the total silence.''')
        agency()

    def search(self):
        input('\nYou see many orphaned mine carts along the tracks. > ')
        search = input('\nSearch the mine carts? > ').lower()
        if search == 'yes':
            if Room2.possible_loot:
                if loot_chance():
                    input('You scour each mine cart, at last discovering some '
                          'treasure!')
                    loot()
                    Room2.possible_loot = False
                else:
                    print('\nYou find only ore dust and ruined mining '
                          'equipment. > ')
                    Room2.possible_loot = False
            else:
                print('\nYou find only ore dust and ruined mining '
                      'equipment. > ')

    def proceed(self):
        print('''
There are three doors at the end of three tunnels ahead of you. One to the
[east], one to the [west], and one that continues to the [south].''')
        while True:
            choice = input('\nWhich do you choose? > ')
            if choice == 'west':
                if player.player_class == 'thief':
                    input('The door is locked!  Attempt to unlock? > ')
                    input('You successfully unlock the door!')
                    player.xp += 3
                    input('\nYou gain 3 experience!')
                    if player.xp > 9:
                        player.levelup()
                    shop.enter()
                else:
                    input('The door is locked!')
            elif choice == 'east' or choice == 'south':
                shop.enter()
            else:
                print("\nChoose a door to continue.")
                continue


class Room3(object):
    possible_loot = True

    def enter(self):
        player.room = room3
        if monster_chance():
            random_monster()
        print('''\n\n\n\n\n
You find yourself in a short hallway connected to a large open chamber.  The
chamber itself is shaped like a great stone bowl, and as you approach the end
of the hallway you can see the floor down a thirty foot stairway below.  At
the center of the bowl is an ancient looking tree reaching nearly forty feet
upwards to meet the ceiling.  The tree is seemingly giving off its own curious
light, dimly illuminating the room.  On the other side of the great bowl are
two stairways leading to two more doors.''')
        agency()

    def search(self):
        input('''
You notice several pillars lining the upper-level of the bowl.  Many of these
pillars look to have some portion of their stonework hollowed out and a few
seem to contain various items hidden within. > ''')
        search = input('\nSearch the stone pillars? > ').lower()
        if search == 'yes':
            if Room3.possible_loot:
                if loot_chance():
                    input('You comb through the hollow pillars,'
                          ' finally discovering some treasure! > ')
                    loot()
                    Room3.possible_loot = False
                else:
                    print('\nYou find only bits of stone and ruined '
                          'paper. > ')
                    Room3.possible_loot = False
            else:
                print('\nYou find only bits of stone and ruined '
                      'paper. > ')

    def proceed(self):
        print('''
As you make your way down the many steps ahead you are suddenly aware of a
low hum, gradually increasing in volume to eventually reverberate across the
entire chamber and become a powerful roar of vibration.''')
        input('\nYou involuntarily clasp your hands to your ears. > ')
        print('''
In an instant the clamor dissipates, returning the chamber to utter silence.
As you regain your composure you are addressed by a voice in the darkness.''')
        input('\n"Traveler...what purpose have you in this place?" > ')
        while True:
            choice1 = input('''
[Who] are you?"
To [destroy] the evil within this mine."
To [plunder] the mine's lost treasures." > ''').lower()
            if choice1 == 'who':
                input('''
As the words leave your mouth the ancient tree before you vibrates softly.
Two large yellow eyes materialize in the bark and fix themselves upon
you. > ''')
                print('''
"I have no name, and your kind has no words for my being. My very existence is
beyond anything in your experience - you will never fully understand my true
essence.  Be content to perceive me as your kind often does - simply a
benevolent nature spirit."''')
                while True:
                    choice2 = input('''
[What] do you want?"
"You're a [talking] tree!" > ''').lower()
                    if choice2 == 'what':
                        input('''
"My influence has been usurped by a nefarious sorcerer seeking to enter the
upper planes by way of my own deep connection with them.  It is this
corruption that is responsible for the evil recently pouring forth from this
mine. Find the sorcerer deeper inside and destroy him." > ''')
                        input('''
"If you refuse to help or fail in this task my connection with the planes will
be severed and I will slowly wither into nonexistence.  The evil lurking in
this region will gradually increase in ferocity and your civilization will be
overrun.  However, the higher order of the universe is not concerned with such
trivial matters, so your choice is ultimately meaningless."
\n"I leave you now." > ''')
                        input('''
The large yellow eyes disappear and the ancient tree gradually ceases its
vibration. The room is returned to stillness once more. > ''')
                        break
                    elif choice2 == 'talking':
                        input('''
"Yes.  I can see your intellect is not evolved enough to truly comprehend my
plight.  Our interaction will not be fruitful.  I leave you now to your
simplistic awe." > ''')
                        input('''
The large yellow eyes disappear and the ancient tree gradually ceases its
vibration. The room is returned to stillness once more. > ''')
                        break
                    else:
                        print('\nChoose an option to continue.')
                        continue
            elif choice1 == 'destroy':
                input('''
As the words leave your mouth the ancient tree before you vibrates softly.
Two large yellow eyes materialize in the bark and fix themselves upon you. > '''
                      )
                input('''
"You are near the end of that particular quest, traveler. I am known to your
kind as...a benevolent spirit, of a sort.  My influence has been usurped by a
nefarious sorcerer seeking to enter the upper planes by way of my own deep
connection with them.  It is this corruption that is responsible for the evil
recently pouring forth from this mine. Find the sorcerer deeper in the mines
and destroy him." > ''')
                input('''
"If you refuse to help or fail in this task my connection with the planes will
be severed and I will slowly wither into nonexistence.  The evil lurking in
this region will gradually increase in ferocity and your civilization will be
overrun.  However, the higher order of the universe is not concerned with such
trivial matters so your choice is ultimately meaningless."
\n"I will leave you now." > ''')
                input('''
The large yellow eyes disappear and the ancient tree gradually ceases its
vibration. The room is returned to stillness once more. > ''')
                break
            elif choice1 == 'plunder':
                input('''
As the words leave your mouth the ancient tree before you vibrates softly.
Two large yellow eyes materialize in the bark and fix themselves upon you. > '''
                      )
                input('''
"Simple creature!  Concerned only with earthly wealth and materials!  You are
no true champion.  Seek your plunder, mortal, your nonexistence draws near." > '''
                      )
                input('''
The large yellow eyes disappear and the ancient tree gradually ceases its
vibration. The room is returned to stillness once more. > ''')
                break
            else:
                print('\nChoose an option to continue.')
                continue
            break
        print('''
Ahead of you lie two stone stairways winding up the sides of the bowl
structure.  At their termination are two doors: one a dark [blue] color and
the other a soft [green].''')
        while True:
            choice3 = input('\nWhich do you choose? > ').lower()
            if choice3 == 'blue' or choice3 == 'green':
                room_selector()
            else:
                print('\nChoose a door to continue')
                continue


class Room4(object):

    def enter(self):
        player.room = room4
        if monster_chance():
            random_monster()
        print('''\n\n\n\n\n
You find yourself in a dark and cluttered room.  The faint sound of dripping
water echoes in the darkness.''')
        agency()

    def search(self):
        input('''
You can see mundane mining tools in various stages of disrepair throughout
this large room.  Despite your best efforts you are unable to find anything
of value amongst them. > ''')

    def proceed(self):
        print('''
The way forward is marked by two doors.  One made of [steel] and one of
[wood].''')
        while True:
            choice = input('\nWhich do you choose? > ')
            if choice == 'steel' or choice == 'wood':
                room_selector()
            else:
                print('\nChoose a door to continue.')
                continue


class Shop(object):

    def enter(self):
        player.room = shop
        input('''\n\n\n\n\n
You open the door and are greeted by a most curious sight.  A small goblin
sits behind a dusty wooden counter, his height extended by the stack of ancient
tomes serving as his chair.  Behind him are many rows of shelves containing
various weapons, armor, and items. > ''')
        input('''
The goblin recognizes your surprise and is quick to address your fears. > ''')
        input('''
"Woah there, human!  Stay your blade - I am not like my small minded brethren
you have no doubt encountered on your journey here.  I am but a simple
merchant. I seek only trade and riches, I have no desire to maim or kill.
Sneezlebrixx is my name.  Please, have a look at my wares!" > ''')
        agency()

    def search(self):
        input('''
The room is damp and dimly lit, and the walls are all made of cold stone.
Sneezlebrixx's shop looks fairly well maintained, however, and many of the
items on display look to be in excellent condition. > ''')

    def shop(self):
        """Displays shop menu and options."""
        print('\n"What would you like to see, human?"')
        while True:
            print(f'\nGold: {player.gold}')
            item_type = input('[Weapons] | [Armor] | [Items] | [Magic] Items'
                              ' | [Back] > ').lower()
            if item_type == 'back':
                break
            elif item_type == 'weapons':
                print('\nWeapons:')
                for i in weapons:
                    print(weapons.index(i), i.name)
                while True:
                    try:
                        choice = input(
                            '\nInspect an item with its number or [Back] > ')
                        if choice == 'back':
                            break
                        else:
                            print('\n', weapons[int(choice)].name.title())
                            print(
                                f'Attack: {weapons[int(choice)].attack} \t AC Penalty: {weapons[int(choice)].ac_penalty}'
                            )
                            print(
                                f'\nPrice: {weapons[int(choice)].price} gold')
                        while True:
                            print(f'\n{player.name}\'s gold: {player.gold}')
                            confirm = input('[Buy] | [Back] > ').lower()
                            if confirm == 'back':
                                break
                            elif confirm == 'buy':
                                if player.gold < weapons[int(choice)].price:
                                    print('You don\'t have enough gold!')
                                else:
                                    player.gold -= weapons[int(choice)].price
                                    player.equipment.append(
                                        weapons[int(choice)])
                                    input(
                                        f'\nYou have purchased the {weapons[int(choice)].name}!'
                                    )
                                    break
                        break
                    except ValueError:
                        continue
            elif item_type == 'armor':
                print('\nArmor:')
                for i in armor:
                    print(armor.index(i), i.name)
                while True:
                    try:
                        choice = input(
                            '\nInspect an item with its number or [Back] > ')
                        if choice == 'back':
                            break
                        else:
                            print('\n', armor[int(choice)].name.title())
                            print(f'Defense: {armor[int(choice)].defense}')
                            print(f'\nPrice: {armor[int(choice)].price} gold')
                            while True:
                                print(
                                    f'\n{player.name}\'s gold: {player.gold}')
                                confirm = input('[Buy] | [Back] > ').lower()
                                if confirm == 'back':
                                    break
                                elif confirm == 'buy':
                                    if player.gold < armor[int(choice)].price:
                                        print('You don\'t have enough gold!')
                                    else:
                                        player.gold -= armor[int(choice)].price
                                        player.equipment.append(
                                            armor[int(choice)])
                                        input(
                                            f'\nYou have purchased the {armor[int(choice)].name}!'
                                        )
                                        break
                            break
                    except ValueError:
                        continue
            elif item_type == 'items':
                print('\nItems:')
                for i in items:
                    print(items.index(i), i.name)
                while True:
                    try:
                        choice = input(
                            '\nInspect an item with its number or [Back] > ')
                        if choice == 'back':
                            break
                        else:
                            print('\n', items[int(choice)].name.title())
                            print(f'HP Bonus: {items[int(choice)].plus_hp}', \
                                  '\t', f'MP Bonus: {items[int(choice)].plus_mana}')
                            print(f'Damage: {items[int(choice)].damage}')
                            print(f'\nPrice: {items[int(choice)].price} gold')
                            while True:
                                print(
                                    f'\n{player.name}\'s gold: {player.gold}')
                                confirm = input('[Buy] | [Back] > ').lower()
                                if confirm == 'back':
                                    break
                                elif confirm == 'buy':
                                    if player.gold < items[int(choice)].price:
                                        print('You don\'t have enough gold!')
                                    else:
                                        player.gold -= items[int(choice)].price
                                        player.items.append(items[int(choice)])
                                        input(
                                            f'\nYou have purchased the {items[int(choice)].name}!'
                                        )
                                        break
                            break
                    except ValueError:
                        continue
            elif item_type == 'magic':
                print('\nMagic Items:')
                for i in magic_items:
                    print(magic_items.index(i), i.name)
                while True:
                    try:
                        choice = input(
                            '\nInspect an item with its number or [Back] > ')
                        if choice == 'back':
                            break
                        else:
                            print('\n', magic_items[int(choice)].name.title())
                            print(
                                f'Attack: {magic_items[int(choice)].attack} \t AC Penalty: {magic_items[int(choice)].ac_penalty}'
                            )
                            print(
                                f'\nPrice: {magic_items[int(choice)].price} gold'
                            )
                            while True:
                                print(
                                    f'\n{player.name}\'s gold: {player.gold}')
                                confirm = input('[Buy] | [Back] > ').lower()
                                if confirm == 'back':
                                    break
                                elif confirm == 'buy':
                                    if player.gold < magic_items[int(
                                            choice)].price:
                                        print('You don\'t have enough gold!')
                                    else:
                                        player.gold -= magic_items[int(
                                            choice)].price
                                        player.equipment.append(
                                            magic_items[int(choice)])
                                        input(
                                            f'\nYou have purchased the {magic_items[int(choice)].name}!'
                                        )
                                        break
                            break
                    except ValueError:
                        continue

    def proceed(self):
        input('''
Sneezlebrixx shows you to the shop's exit: a squat wooden door clearly
designed for smaller creatures such as kobolds or halflings.  The goblin
waves as you bend down to open the tiny door. > ''')
        room_selector()


class MineEntrance(object):

    def enter(self):
        player.room = mine_entrance
        input('''
You turn to leave the smithy.  The closing door behind you muffles the sound
of Fenton losing a struggle to contain his thunderous laughter. \n> ''')
        input('''
\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n
You journey south and eventually come upon the dismal looking mine.  A flash
of lightning many miles away briefly illuminates the mine's entrance in the
valley below.  The mine's neglected state strongly suggests that it has been
abandoned by humans for some time, though there are ominous signs of more
recent inhabitants.
\nA cold rain begins to drizzle. \n> ''')
        input('\nYou grit your teeth and begin the descent. \n> ')
        if monster_chance():
            input('''
You carefully make your way down the rotting stairs to the mine's entrance.
The distant scuttle of a frightened mouse sounds as you approach the pitch
black opening. \n> ''')
            input('\nYou light a torch --')
            i = random.choice(random_monsters)
            input(f'''
The sudden flame illuminates {i.name} just ahead!
The creature snarls and rushes toward you! \n> ''')
            combat(player, i)
            print(
                f'\n{i.name}\'s corpse falls at the foot of the mine\'s door.')
            agency()
        else:
            print('''
You carefully make your way down the rotting stairs to the mine's entrance.
The distant scuttle of a frightened mouse sounds as you approach the pitch
black opening.  You light a torch and extend your sight into the unknown dark
a short ways.  You finally glimpse the door to the mine.''')
            agency()

    def search(self):
        input('''
You stand in a dilapidated mining quarry, abandoned by the local townsfolk
for many years.  Nearby you can see bits of various mining tools, ruined from
their long exposure to the elements.  You see many piles of discarded half-
eaten food clearly not of human origin.  Ahead of you stands the door used to
enter the mine. > ''')

    def proceed(self):
        input('\nYou grasp the doorknob. > ')
        room_selector()


# Final room - displays some text and eventually triggers the boss battle
class FinalRoom(object):
    searched = 0

    def enter(self):
        player.room = final_room
        input('''\n\n\n\n\n
You fling open the door and are greeted by an intense gust of warm, earthy
air.  Before you stretches a long and cramped corridor with a downward
slope.  You're forced to crouch as you begin the descending trek. > ''')
        input('''
As you descend the ambient temperature noticeably increases.  The stone
masonry in the walls, floor, and ceiling around you slowly give way to
formless mud and earth.  Finally you reach the corridor's end as it culminates
in a curious stone archway.
\nYou pass under the arch and into the chamber beyond. > ''')
        input('''
You stand now in a truly immense underground chamber dominated by a
tremendous lake.  Though you can clearly hear the sounds of lapping water
nearby, much of the lake itself is obscured by the extreme darkness of the
chamber.  The gloom is sharply broken by a few lone rays of sunlight pouring
in from a crack in the chamber's ceiling.  The light partially illuminates a
small island at the lake's center and a narrow bridge leading to it from the
shore you now stand upon. > ''')
        agency()

    def search(self):
        FinalRoom.searched = 1
        input('''
You see the silhouette of a figure standing at a pedestal on the island.  The
figure's back is turned to you and the being is clearly preoccupied with some
complex task involving its hands. > ''')

    def proceed(self):
        if FinalRoom.searched:
            choice = input('''
Quietly [approach] the figure. | [Call] out to the figure. > ''').lower()
        else:
            input('''
You see the silhouette of a figure standing at a pedestal on the island.  The
figure's back is turned to you and the being is clearly preoccupied with some
complex task involving its hands. > ''')
        choice = input('''
Quietly [approach] the figure. | [Call] out to the figure. > ''').lower()
        if choice == 'approach':
            input('''
You silently make your way across the bridge.  When you near the halfway mark
the figure's attention is seemingly broken from its present task as it slowly
turns around. > ''')
            input('''
Suddenly you find yourself face to face with the figure, inexplicably
transported from your previous location some fifty feet behind.  The
figure is entirely shrouded in dark robes save for a ghostly white mouth
visible inside its deep cowl.  As the mouth begins to speak, small pebbles
nearby raise off the ground and you feel a curious tingling throughout your
body... > ''')
            sorcerer.boss_battle(player)
        elif choice == 'call':
            choice1 = input('''
[Who] are you?!
[What] are you doing?
[Stop] what you are doing at once! > ''').lower()
            if choice1 == 'who' or choice1 == 'what' or choice1 == 'stop':
                input('''
You call out to the figure, a moment passes and its attention is broken from
its present task.  The figure slowly turns around. > ''')
                input('''
Suddenly you find yourself face to face with the figure, inexplicably
transported from your previous location some three-hundred feet behind.  The
figure is entirely shrouded in dark robes save for a ghostly white mouth
visible inside its deep cowl.  As the mouth begins to speak, small pebbles
nearby raise off the ground and you feel a curious tingling throughout your
body... > ''')
                sorcerer.boss_battle(player)
            else:
                print('\nChoose an action to continue')
        else:
            print('\nChoose an action to continue.')


def start():
    """Called when roomz.py is executed, begins the game loop."""
    # Reset room visits counter
    if hasattr(room_selector, 'visits'):
        room_selector.visits = 0

    player.name = input('''
As you enter the sweltering smithy a gruff looking man behind the counter
keeps his eyes fixed on the parchment sprawled in front of him.  He bellows in
your direction: \n\n\n"NAME?" \n> ''')
    input(f'''
"Glad to meet ye, {player.name}. I'm requisitions officer Brenton. I understand yer.. " >
''')
    input('''
The hulking man pauses in mid-sentence to deftly crush a
large insect crawling near his hand.  He proceeds to clean
the sticky green mess by wiping his hand on his trousers. \n> ''')
    print('''
"My apologies.  Where were we? Ah yes - I'm told yer the one's been
appointed to clear Grogg's Mine.  About time, ye ask me!  Naught but evil
mischief comin' from that forsaken place these days.  In any case let's get
ye geared and on ye way."''')
    while True:
        player.player_class = input('''
"Tell me, d'ye figure yerself more of a [fighter], [thief], or one of them
[mage] types?" \n> ''').lower()
        if player.player_class == 'fighter':
            input(f'''
"We're gonna get along great, {player.name}!  Let me just grab ye some suitable arms
and armor from the store room." \n> ''')
            input('''
Fenton returns with a well crafted bastard sword, set of full platebody, and
a healing potion. \n> ''')
            player.mp = 0
            player.equipment.append(bastard_sword)
            player.equipment.append(plate)
            player.items.append(healing_potion)
            player.equipment[0].equip()
            player.equipment[1].equip()
            input('')
            print('''
"Now ye look like a proper warrior!  Head south and you'll come to the mine.
Best o' luck to ye!"''')
            mine_entrance.enter()
        elif player.player_class == 'thief':
            input(f'''
"Don't surprise me, {player.name}.  Ye got that skulky look to ye.  Keep ye fingers
to yerself while I go fetch yer gear from the store room." \n> ''')
            input('''
Fenton returns with a well crafted dagger, a tough looking leather jerkin, and
a healing potion. \n> ''')
            player.mp = 0
            player.equipment.append(dagger)
            player.equipment.append(leather)
            player.items.append(healing_potion)
            player.equipment[0].equip()
            player.equipment[1].equip()
            input('')
            print('''
"Now ye look a bit more prepared.  Head south and you'll come to the mine.
Best o' luck to ye!"''')
            mine_entrance.enter()
        elif player.player_class == 'mage':
            player.max_mana = 35
            player.mana = 35
            input(f'''
"Fancy yerself one o' them fidgety wizards, eh {player.name}? We ain't got much
'round here fer yer type, but I'll see what I can find." \n> ''')
            input('''
Fenton returns with a gnarled looking staff, some freshly pressed robes, and
a mana potion. \n> ''')
            player.equipment.append(staff)
            player.equipment.append(robes)
            player.items.append(mana_potion)
            player.equipment[0].equip()
            player.equipment[1].equip()
            input('')
            print('''
"Now ye look ready to save our mine!  Just head south, ye can't miss 'er.
Best o' luck to ye!"''')
            mine_entrance.enter()
        else:
            print('\nChoose a class to continue.')
            continue


#file_name = "title.txt"

#  Title screen with sick ASCII Art
#def title():
#   with open(file_name, 'r') as t:
#        print(t.read())

# Instantiating the room classes from above so they can be used in main.py
mine_entrance = MineEntrance()
room1 = Room1()
room2 = Room2()
room3 = Room3()
room4 = Room4()
shop = Shop()
final_room = FinalRoom()

#mainm = MainMenu.MainGame("Player")

# Weapons - attributes are name, attack, AC penalty, price.
bastard_sword = Weapon('bastard sword', 4, 1, 20)
staff = Weapon('gnarled staff', 2, 0, 15)
dagger = Weapon('dagger', 2, 0, 8)
spear = Weapon('spear', 3, 1, 16)
mace = Weapon('mace', 3, 0, 12)
two_hander = Weapon('two handed sword', 5, 2, 25)
poleaxe = Weapon('poleaxe', 6, 3, 30)

# Magic Items - attributes are name, attack, AC penalty, price.
magic_axe = MagicWeapon('Glowing Two-Handed Axe', 6, 2, 35)
magic_dagger = MagicWeapon('Poisoned Dagger', 3, 0, 30)

# Armor - attributes are name, defense, price
leather = Armor('leather jerkin', 2, 10)
plate = Armor('plated mail', 4, 15)
robes = Armor('cloth robe', 1, 8)

# Items - attributes are name, plus_hp, plus_mana, damage, price
healing_potion = Item('healing potion', 10, 0, 0, 5)
mana_potion = Item('mana potion', 0, 10, 0, 5)
frost_potion = Item('frost potion', 0, 0, 10, 5)

# Monsters - attributes are: Name, max HP, HP, strength, AC, sta, XP,
# weapon, stunned.
orc = Monster('an orc', 21, 21, 2, 3, 7, 5, 'mace', 0)
goblin = Monster('a goblin', 20, 20, 2, 8, 8, 4, 'dagger', 0)
kobold = Monster('a kobold', 19, 19, 3, 7, 8, 5, 'flail', 0)
spider = Monster('a giant tarantula', 21, 21, 4, 6, 7, 6, 'fangs', 0)

# Player - attributes are: Name, class, Max HP, HP, STR, AC, STA, Max Mana,
# MANA equipment, items, gold, xp, back, used_item, weapon, armor, combat,
# special, room.
player = Player('', '', 21, 21, 2, 6, 5, 0, 0, [], [], 15, 0, False, False, '',
                '', False, 0, None)

#Boss - attributes are: Name, HP, AC, spells, stunned.
sorcerer = Boss('a mysterious figure', 20, 8,
                ['lightning strike', 'fireball', 'meteor', 'ice strike'], 0)

# Lists of functions, objects for randomization/use in selector functions.
random_monsters = [orc, goblin, kobold, spider]
random_room = [room1.enter, room2.enter, room3.enter, room4.enter]
items = [healing_potion, mana_potion, frost_potion]
weapons = [bastard_sword, staff, dagger, spear, mace, two_hander, poleaxe]
armor = [leather, plate, robes]
magic_items = [magic_axe, magic_dagger]

#shop.shop()
start()

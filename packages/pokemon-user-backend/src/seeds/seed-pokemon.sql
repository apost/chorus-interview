INSERT INTO pokemon_prototype (prototype_id, display_id, name) VALUES
(1, 1, 'Bulbasaur'),
(2, 2, 'Ivysaur'),
(3, 3, 'Venusaur'),
(4, 4, 'Charmander'),
(5, 5, 'Charmeleon'),
(6, 6, 'Charizard'),
(7, 7, 'Squirtle'),
(8, 8, 'Wartortle'),
(9, 9, 'Blastoise'),
(10, 10, 'Caterpie')
ON CONFLICT (prototype_id) DO UPDATE SET
display_id = EXCLUDED.display_id,
name = EXCLUDED.name;
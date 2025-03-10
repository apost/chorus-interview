INSERT INTO team (team_id, profile_id) VALUES
(1, 1),
(2, 2)
ON CONFLICT (team_id) DO UPDATE SET
profile_id = EXCLUDED.profile_id;
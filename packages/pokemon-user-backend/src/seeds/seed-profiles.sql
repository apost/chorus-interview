INSERT INTO profile (profile_id, username, created_at) VALUES
(1, 'Red', NOW()),
(2, 'blue', NOW())
ON CONFLICT (profile_id) DO UPDATE SET
username = EXCLUDED.username,
created_at = EXCLUDED.created_at;
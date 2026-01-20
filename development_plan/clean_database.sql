-- CLEAN SLATE DATABASE RESET
-- Run this in your Supabase SQL Editor to start fresh

-- 1. Delete all existing data (Order matters due to foreign keys)
DELETE FROM activity_logs;
DELETE FROM tasks;
DELETE FROM media_attachments;
DELETE FROM deals;
DELETE FROM customers;
DELETE FROM profiles;
DELETE FROM workspaces;

-- 2. Optional: If you want to drop and recreate tables (more thorough)
-- DROP TABLE IF EXISTS activity_logs CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS media_attachments CASCADE;
-- DROP TABLE IF EXISTS deals CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS workspaces CASCADE;
-- DROP TYPE IF EXISTS customer_status CASCADE;
-- DROP TYPE IF EXISTS deal_stage CASCADE;
-- DROP TYPE IF EXISTS task_status CASCADE;
-- DROP TYPE IF EXISTS task_priority CASCADE;
-- DROP TYPE IF EXISTS user_role CASCADE;

-- 3. You're ready! Now go to Authentication → Users in Supabase Dashboard 
-- and delete all users to ensure everything is truly fresh.
-- Then go to Storage and empty any buckets (like 'attachments').


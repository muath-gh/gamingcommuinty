/*
  # Player Discovery System Schema

  1. New Tables
    - `player_profiles`
      - `id` (uuid, primary key) - references auth.users
      - `display_name` (text) - player's display name
      - `bio` (text) - player bio/description
      - `avatar_url` (text) - profile picture URL
      - `discord_tag` (text) - Discord username
      - `play_style` (text) - casual, competitive, hardcore
      - `mic_available` (boolean) - has microphone
      - `timezone` (text) - player timezone
      - `age_group` (text) - age range
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `game_preferences`
      - `id` (uuid, primary key)
      - `player_id` (uuid) - references player_profiles
      - `game_name` (text) - name of the game
      - `platform` (text) - PC, PlayStation, Xbox, Nintendo Switch, Mobile
      - `skill_level` (text) - beginner, intermediate, advanced, expert
      - `rank_info` (text) - optional rank/tier information
      - `hours_played` (integer) - approximate hours
      - `preferred_modes` (text[]) - game modes they prefer
      - `created_at` (timestamptz)
    
    - `discovery_posts`
      - `id` (uuid, primary key)
      - `player_id` (uuid) - references player_profiles
      - `game_name` (text) - game looking for players
      - `platform` (text) - platform
      - `activity_type` (text) - Co-op, Competitive, Casual, Ranked, etc.
      - `team_size` (text) - 1v1, 2v2, Squad, etc.
      - `description` (text) - post description
      - `looking_for` (text[]) - what they're looking for in teammates
      - `voice_required` (boolean) - voice chat required
      - `status` (text) - active, filled, expired
      - `play_time` (text) - when they want to play
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
    
    - `discovery_interests`
      - `id` (uuid, primary key)
      - `post_id` (uuid) - references discovery_posts
      - `interested_player_id` (uuid) - references player_profiles
      - `message` (text) - optional message
      - `status` (text) - pending, accepted, declined
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Players can read all profiles
    - Players can only update their own profile
    - Players can create and read discovery posts
    - Players can manage their own posts
    - Players can express interest in posts
*/

-- Create player_profiles table
CREATE TABLE IF NOT EXISTS player_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  discord_tag text DEFAULT '',
  play_style text DEFAULT 'casual',
  mic_available boolean DEFAULT false,
  timezone text DEFAULT 'UTC',
  age_group text DEFAULT '18-24',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_preferences table
CREATE TABLE IF NOT EXISTS game_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES player_profiles(id) ON DELETE CASCADE NOT NULL,
  game_name text NOT NULL,
  platform text NOT NULL,
  skill_level text DEFAULT 'intermediate',
  rank_info text DEFAULT '',
  hours_played integer DEFAULT 0,
  preferred_modes text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create discovery_posts table
CREATE TABLE IF NOT EXISTS discovery_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES player_profiles(id) ON DELETE CASCADE NOT NULL,
  game_name text NOT NULL,
  platform text NOT NULL,
  activity_type text NOT NULL,
  team_size text NOT NULL,
  description text DEFAULT '',
  looking_for text[] DEFAULT '{}',
  voice_required boolean DEFAULT false,
  status text DEFAULT 'active',
  play_time text DEFAULT 'anytime',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Create discovery_interests table
CREATE TABLE IF NOT EXISTS discovery_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES discovery_posts(id) ON DELETE CASCADE NOT NULL,
  interested_player_id uuid REFERENCES player_profiles(id) ON DELETE CASCADE NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, interested_player_id)
);

-- Enable RLS
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_interests ENABLE ROW LEVEL SECURITY;

-- Player Profiles Policies
CREATE POLICY "Anyone can view player profiles"
  ON player_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON player_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON player_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Game Preferences Policies
CREATE POLICY "Anyone can view game preferences"
  ON game_preferences FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own game preferences"
  ON game_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id));

CREATE POLICY "Users can update their own game preferences"
  ON game_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id));

CREATE POLICY "Users can delete their own game preferences"
  ON game_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id));

-- Discovery Posts Policies
CREATE POLICY "Anyone can view active discovery posts"
  ON discovery_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create discovery posts"
  ON discovery_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id));

CREATE POLICY "Users can update their own discovery posts"
  ON discovery_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id));

CREATE POLICY "Users can delete their own discovery posts"
  ON discovery_posts FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM player_profiles WHERE id = player_id));

-- Discovery Interests Policies
CREATE POLICY "Users can view interests on their posts"
  ON discovery_interests FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT player_id FROM discovery_posts WHERE id = post_id
    ) OR auth.uid() IN (
      SELECT id FROM player_profiles WHERE id = interested_player_id
    )
  );

CREATE POLICY "Users can express interest in posts"
  ON discovery_interests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM player_profiles WHERE id = interested_player_id));

CREATE POLICY "Users can update their own interests"
  ON discovery_interests FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM player_profiles WHERE id = interested_player_id))
  WITH CHECK (auth.uid() IN (SELECT id FROM player_profiles WHERE id = interested_player_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_preferences_player_id ON game_preferences(player_id);
CREATE INDEX IF NOT EXISTS idx_game_preferences_game_name ON game_preferences(game_name);
CREATE INDEX IF NOT EXISTS idx_discovery_posts_player_id ON discovery_posts(player_id);
CREATE INDEX IF NOT EXISTS idx_discovery_posts_game_name ON discovery_posts(game_name);
CREATE INDEX IF NOT EXISTS idx_discovery_posts_status ON discovery_posts(status);
CREATE INDEX IF NOT EXISTS idx_discovery_interests_post_id ON discovery_interests(post_id);
CREATE INDEX IF NOT EXISTS idx_discovery_interests_player_id ON discovery_interests(interested_player_id);
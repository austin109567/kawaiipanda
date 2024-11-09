import { FC, useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Star, TrendingUp, User, Sword, Twitter, MessageCircle, Camera, Edit2, Check } from 'lucide-react';
import { playerService } from '../../services/playerService';
import { ConnectPrompt } from '../ConnectPrompt';
import { ProfileUpload } from './ProfileUpload';
import { GuildSelector } from './GuildSelector';
import { LevelDisplay } from '../LevelDisplay';
import { Player } from '../../types/player';

export const RaidProfile: FC = () => {
  const { publicKey } = useWallet();
  const [playerStats, setPlayerStats] = useState<Player | null>(null);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [editingTwitter, setEditingTwitter] = useState(false);
  const [newTwitter, setNewTwitter] = useState('');
  const [editingDiscord, setEditingDiscord] = useState(false);
  const [newDiscord, setNewDiscord] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!publicKey) return;

    // Initialize player stats
    const stats = playerService.getPlayer(publicKey.toString());
    if (!stats) {
      playerService.enrollPlayer(publicKey.toString());
    }
    setPlayerStats(stats || playerService.getPlayer(publicKey.toString()));

    // Set up listener for updates
    const updateStats = () => {
      setPlayerStats(playerService.getPlayer(publicKey.toString()));
    };

    playerService.addListener(publicKey.toString(), updateStats);
    return () => playerService.removeListener(publicKey.toString(), updateStats);
  }, [publicKey]);

  if (!publicKey) {
    return <ConnectPrompt />;
  }

  if (!playerStats) return null;

  const handleUsernameSubmit = () => {
    if (!publicKey || !newUsername.trim()) return;
    const success = playerService.setUsername(publicKey.toString(), newUsername.trim());
    if (success) {
      setEditingUsername(false);
      setPlayerStats(playerService.getPlayer(publicKey.toString()));
    }
  };

  const handleTwitterSubmit = () => {
    if (!publicKey || !newTwitter.trim()) return;
    const success = playerService.setTwitterHandle(publicKey.toString(), newTwitter.trim());
    if (success) {
      setEditingTwitter(false);
      setPlayerStats(playerService.getPlayer(publicKey.toString()));
    }
  };

  const handleDiscordSubmit = () => {
    if (!publicKey || !newDiscord.trim()) return;
    const success = playerService.setDiscordHandle(publicKey.toString(), newDiscord.trim());
    if (success) {
      setEditingDiscord(false);
      setPlayerStats(playerService.getPlayer(publicKey.toString()));
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !publicKey) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        const success = playerService.setProfilePicture(publicKey.toString(), imageData);
        if (success) {
          setPlayerStats(playerService.getPlayer(publicKey.toString()));
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
          <img 
            src="/assets/pandas/runningpandaflip.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
          Raid Profile
          <img 
            src="/assets/pandas/runningpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Update Your Raid Profile and View Your Panda Pack
        </p>
      </div>

      {/* User Profile Section */}
      <div className="gradient-box p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="relative group">
            <button
              onClick={handleProfilePictureClick}
              className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary-pink/20 group-hover:border-primary-pink/40 transition-all cursor-pointer relative"
            >
              {playerStats.profilePicture ? (
                <img
                  src={playerStats.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/assets/defaultpfp.jpg"
                  alt="Default Profile"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-6">
            {/* Username */}
            <div>
              {editingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                    className="px-3 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white flex-1"
                  />
                  <button
                    onClick={handleUsernameSubmit}
                    className="p-2 text-primary-pink hover:text-primary-pink/80 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {playerStats.username || 'Set Username'}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingUsername(true);
                      setNewUsername(playerStats.username || '');
                    }}
                    className="p-2 text-neutral-lightGray hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              {/* Twitter Handle */}
              <div className="flex items-center gap-4">
                <Twitter className="w-5 h-5 text-primary-pink" />
                {editingTwitter ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={newTwitter}
                      onChange={(e) => setNewTwitter(e.target.value)}
                      placeholder="@username"
                      className="px-3 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white flex-1"
                    />
                    <button
                      onClick={handleTwitterSubmit}
                      className="p-2 text-primary-pink hover:text-primary-pink/80 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-white">
                      {playerStats.twitterHandle || 'Add Twitter Handle'}
                    </span>
                    <button
                      onClick={() => {
                        setEditingTwitter(true);
                        setNewTwitter(playerStats.twitterHandle || '');
                      }}
                      className="p-2 text-neutral-lightGray hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Discord Handle */}
              <div className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 text-primary-pink" />
                {editingDiscord ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={newDiscord}
                      onChange={(e) => setNewDiscord(e.target.value)}
                      placeholder="username#0000"
                      className="px-3 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white flex-1"
                    />
                    <button
                      onClick={handleDiscordSubmit}
                      className="p-2 text-primary-pink hover:text-primary-pink/80 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-white">
                      {playerStats.discordHandle || 'Add Discord Handle'}
                    </span>
                    <button
                      onClick={() => {
                        setEditingDiscord(true);
                        setNewDiscord(playerStats.discordHandle || '');
                      }}
                      className="p-2 text-neutral-lightGray hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guild Selection */}
      <GuildSelector wallet={publicKey.toString()} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="gradient-box p-8">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary-main" />
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-white">Level & XP</h3>
          </div>
          <div className="space-y-2">
            <LevelDisplay xp={playerStats.experience} showProgress size="lg" />
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
              Total XP: {playerStats.experience.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="gradient-box p-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary-main" />
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-white">Global Rank</h3>
          </div>
          <p className="text-2xl font-bold text-primary-main">
            #{playerService.getLeaderboard().findIndex(p => p.wallet === publicKey?.toString()) + 1}
          </p>
        </div>

        <div className="gradient-box p-8">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary-main" />
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-white">Quests Completed</h3>
          </div>
          <p className="text-2xl font-bold text-primary-main">
            {playerStats.questsCompleted}
          </p>
        </div>

        <div className="gradient-box p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sword className="w-4 h-4 text-primary-main" />
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-white">Raid Bosses</h3>
          </div>
          <p className="text-2xl font-bold text-primary-main">
            {playerStats.raidBossesDefeated}
          </p>
        </div>
      </div>

      {/* Profile Upload Modal */}
      {showProfileUpload && (
        <ProfileUpload
          wallet={publicKey.toString()}
          onUpload={() => {
            setShowProfileUpload(false);
            setPlayerStats(playerService.getPlayer(publicKey.toString()));
          }}
        />
      )}
    </div>
  );
};
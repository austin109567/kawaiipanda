import { FC, useState, useRef } from 'react';
import { Edit2, Save, X, Upload } from 'lucide-react';
import { Guild } from '../../types/guild';
import { guildService } from '../../services/guildService';

export const GuildAdmin: FC = () => {
  const [editingGuildId, setEditingGuildId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guild>>({});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guilds = guildService.getGuilds() || [];

  const handleEdit = (guild: Guild) => {
    setEditingGuildId(guild.id);
    setEditForm(guild);
  };

  const handleSave = () => {
    if (!editingGuildId || !editForm) return;

    guildService.updateGuild(editingGuildId, editForm);
    setEditingGuildId(null);
    setEditForm({});
  };

  const handleImageUpload = async (file: File) => {
    if (!file || !editingGuildId) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setEditForm(prev => ({ ...prev, imageUrl: imageData }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading guild image:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Guild Administration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guilds.map(guild => (
          <div
            key={guild.id}
            className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-primary-pink/20"
          >
            {editingGuildId === guild.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                    Guild Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-lightGray mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/40">
                      {editForm.imageUrl ? (
                        <img
                          src={editForm.imageUrl}
                          alt={editForm.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-neutral-lightGray" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editForm.imageUrl || ''}
                        onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })}
                        placeholder="Enter image URL"
                        className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white text-sm"
                      />
                      <div className="text-sm text-neutral-lightGray">or</div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-primary-pink/20 text-primary-pink rounded-lg hover:bg-primary-pink/30 transition-colors text-sm"
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingGuildId(null)}
                    className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 text-primary-pink hover:text-primary-pink/80 transition-colors rounded-lg hover:bg-primary-pink/10"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={guild.imageUrl}
                        alt={guild.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{guild.name}</h3>
                      <p className="text-sm text-neutral-lightGray">
                        {guild.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(guild)}
                    className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-neutral-lightGray mb-4">
                  {guild.description}
                </p>

                <div className="text-sm text-neutral-lightGray">
                  Archetype: {guild.archetype}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
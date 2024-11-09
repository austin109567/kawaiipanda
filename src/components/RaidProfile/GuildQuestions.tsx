import { FC, useState } from 'react';
import { X, ArrowLeft, Share2 } from 'lucide-react';
import { guildQuestions } from '../../data/guildQuestions';
import { Guild } from '../../types/guild';
import { guildService } from '../../services/guildService';
import { useWallet } from '@solana/wallet-adapter-react';

interface GuildQuestionsProps {
  onComplete: (guild: Guild) => void;
  onClose: () => void;
}

export const GuildQuestions: FC<GuildQuestionsProps> = ({ onComplete, onClose }) => {
  const { publicKey } = useWallet();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; archetype: Guild['archetype']; }[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [assignedGuild, setAssignedGuild] = useState<Guild | null>(null);
  
  // Get 5 random questions
  const [questions] = useState(() => {
    const shuffled = [...guildQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (archetype: Guild['archetype']) => {
    if (!publicKey) return;

    const newAnswers = [...answers, { questionId: currentQuestion.id, archetype }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const guild = guildService.assignGuild(publicKey.toString(), newAnswers);
      setAssignedGuild(guild);
      setShowCongrats(true);
      onComplete(guild);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
    }
  };

  const handleShareToTwitter = () => {
    if (!assignedGuild) return;
    
    const text = `I just joined ${assignedGuild.name} on @KibalzXYZ! 🐼✨`;
    const url = 'https://kibalz.xyz';
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  return (
    <div className="guild-questionnaire">
      <div 
        className="guild-questionnaire-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="guild-questionnaire-content">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-primary-main/20">
          <h3 className="text-xl font-bold text-white">Choose Your Panda Pack</h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Close questionnaire"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {showCongrats && assignedGuild ? (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary-main mb-4">
                <img
                  src={assignedGuild.imageUrl}
                  alt={assignedGuild.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  Welcome to {assignedGuild.name}!
                </h4>
                <p className="text-neutral-lightGray">
                  {assignedGuild.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleShareToTwitter}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share on Twitter
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="text-center mb-8">
                <p className="text-sm text-neutral-lightGray">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <div className="w-full bg-primary-main/20 h-1 rounded-full mt-2">
                  <div 
                    className="h-full bg-primary-main rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-lg text-white text-center px-4">
                {currentQuestion.question}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(choice.archetype)}
                    className="w-full px-6 py-4 bg-black/40 border border-primary-main/20 rounded-lg text-white hover:bg-primary-main/10 hover:border-primary-main/40 transition-all text-left active:scale-[0.98]"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {currentQuestionIndex > 0 && (
                <button
                  onClick={handlePreviousQuestion}
                  className="flex items-center gap-2 text-neutral-lightGray hover:text-white transition-colors mt-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous Question
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import { FC, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, ExternalLink, Trash2, ArrowLeft } from 'lucide-react';
import { submissionService } from '../../services/submissionService';
import { playerService } from '../../services/playerService';
import { QuestSubmissionRecord } from '../../types/submission';
import { Link } from 'react-router-dom';

export const SubmissionsAdmin: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionData, setSubmissionData] = useState(submissionService.getSubmissionPage(1));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setSubmissionData(submissionService.getSubmissionPage(currentPage));
  }, [currentPage]);

  const handleDelete = (id: string) => {
    if (submissionService.deleteSubmission(id)) {
      setSubmissionData(submissionService.getSubmissionPage(currentPage));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < submissionData.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-neutral-lightGray hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Admin Panel
        </Link>
        <h1 className="text-2xl font-bold text-white">Quest Submissions</h1>
      </div>

      {/* Table */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-primary-pink/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/40 border-b border-primary-pink/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Screenshot</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">URL</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-pink/10">
              {submissionData.submissions.map((submission) => {
                const player = playerService.getPlayer(submission.wallet);
                return (
                  <tr 
                    key={submission.id}
                    className="hover:bg-primary-pink/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-neutral-lightGray whitespace-nowrap">
                      {new Date(submission.dateSubmitted).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {player?.username || player?.handle || 
                        `${submission.wallet.slice(0, 4)}...${submission.wallet.slice(-4)}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        submission.questType === 'raid' 
                          ? 'bg-primary-pink/20 text-primary-pink'
                          : 'bg-primary-teal/20 text-primary-teal'
                      }`}>
                        {submission.questType === 'raid' ? 'Raid Quest' : 'Daily Quest'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {submission.screenshot ? (
                        <button
                          onClick={() => setSelectedImage(submission.screenshot!)}
                          className="p-2 bg-primary-pink/10 text-primary-pink rounded-lg hover:bg-primary-pink/20 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-neutral-lightGray text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary-pink hover:text-primary-pink/80 transition-colors"
                      >
                        <span className="text-sm truncate max-w-[200px]">
                          {submission.url}
                        </span>
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-400/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {submissionData.submissions.length === 0 && (
          <div className="text-center py-8 text-neutral-lightGray">
            No submissions found
          </div>
        )}
      </div>

      {/* Pagination */}
      {submissionData.totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-neutral-lightGray">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, submissionData.totalSubmissions)} of {submissionData.totalSubmissions} submissions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink hover:bg-primary-pink/20 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white">
              Page {currentPage} of {submissionData.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === submissionData.totalPages}
              className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink hover:bg-primary-pink/20 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          />
          <div className="relative max-w-2xl w-full aspect-video">
            <img
              src={selectedImage}
              alt="Submission screenshot"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
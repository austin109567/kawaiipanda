import { QuestSubmissionRecord, SubmissionPage } from '../types/submission';

class SubmissionService {
  private static instance: SubmissionService;
  private submissions: QuestSubmissionRecord[] = [];
  private readonly ITEMS_PER_PAGE = 10;

  private constructor() {
    const savedData = localStorage.getItem('submissions');
    if (savedData) {
      try {
        this.submissions = JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse saved submissions:', error);
      }
    }
  }

  static getInstance(): SubmissionService {
    if (!SubmissionService.instance) {
      SubmissionService.instance = new SubmissionService();
    }
    return SubmissionService.instance;
  }

  private save(): void {
    try {
      localStorage.setItem('submissions', JSON.stringify(this.submissions));
    } catch (error) {
      console.error('Failed to save submissions:', error);
    }
  }

  addSubmission(submission: Omit<QuestSubmissionRecord, 'id' | 'dateSubmitted'>): void {
    const newSubmission: QuestSubmissionRecord = {
      ...submission,
      id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateSubmitted: Date.now()
    };

    this.submissions.unshift(newSubmission);
    this.save();
  }

  getSubmissionPage(page: number): SubmissionPage {
    const startIndex = (page - 1) * this.ITEMS_PER_PAGE;
    const endIndex = startIndex + this.ITEMS_PER_PAGE;
    const totalPages = Math.ceil(this.submissions.length / this.ITEMS_PER_PAGE);

    return {
      submissions: this.submissions.slice(startIndex, endIndex),
      currentPage: page,
      totalPages,
      totalSubmissions: this.submissions.length
    };
  }

  deleteSubmission(id: string): boolean {
    const index = this.submissions.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.submissions.splice(index, 1);
    this.save();
    return true;
  }
}

export const submissionService = SubmissionService.getInstance();
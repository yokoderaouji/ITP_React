export interface ReportDialogProps {
  isOpen: boolean;
  storyTitle: string;
  kidName: string;
  userStoryId: number;
  ViewState:'new' | 'old';
  onClose: () => void;
  onTokenExpired?: () => void;
}
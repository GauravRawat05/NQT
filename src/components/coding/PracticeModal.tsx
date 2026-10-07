import React from 'react';
import { ProblemDetailModal } from './ProblemDetailModal';
import { CodingProblem } from '../../types/coding';

interface PracticeModalProps {
  problem: CodingProblem;
  onClose: () => void;
  onMarkSolved: (id: string) => void;
  savedDraft?: string;
  onSaveDraft?: (id: string, code: string) => void;
  isSolved?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  problem,
  onClose,
  onMarkSolved,
  isSolved = false,
  isBookmarked = false,
  onToggleBookmark = () => {}
}) => {
  return (
    <ProblemDetailModal
      problem={problem}
      isSolved={isSolved}
      isBookmarked={isBookmarked}
      onToggleSolved={onMarkSolved}
      onToggleBookmark={onToggleBookmark}
      onClose={onClose}
    />
  );
};

export default PracticeModal;

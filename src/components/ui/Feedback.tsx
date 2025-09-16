import React from 'react';

type FeedbackProps = {
  feedback: {
    rating: 'Great' | 'Normal' | 'Bad' | null;
    comment: string;
  };
  onFeedbackChange: (rating: 'Great' | 'Normal' | 'Bad' | null, comment: string) => void;
  disabled?: boolean;
};

const ratingOptions = {
  Great: '😊',
  Normal: '😐',
  Bad: '😞',
};

const Feedback: React.FC<FeedbackProps> = ({ feedback, onFeedbackChange, disabled = false }) => {
  const { rating, comment } = feedback;
  const showCommentBox = rating === 'Great' || rating === 'Bad';

  const handleRatingClick = (newRating: 'Great' | 'Normal' | 'Bad') => {
    if (disabled) return;
    // If clicking the same rating again, un-select it
    const finalRating = rating === newRating ? null : newRating;
    onFeedbackChange(finalRating, comment);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    onFeedbackChange(rating, e.target.value);
  };

  return (
    <div className={`mt-8 bg-gray-800 p-6 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-xl font-semibold text-gray-200 mb-4">How was your shift?</h3>
      <div className="flex justify-center space-x-4 mb-4">
        {Object.entries(ratingOptions).map(([key, emoji]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleRatingClick(key as 'Great' | 'Normal' | 'Bad')}
            className={`p-3 text-4xl rounded-full transition-transform transform hover:scale-110 ${
              rating === key ? 'bg-gray-700 ring-2 ring-emerald-500' : 'bg-gray-900'
            }`}
            aria-label={key}
            disabled={disabled}
          >
            {emoji}
          </button>
        ))}
      </div>
      {showCommentBox && (
        <div>
          <label htmlFor="shift-comment" className="block text-sm font-medium text-gray-400 mb-2">
            Please add a comment (required):
          </label>
          <textarea
            id="shift-comment"
            rows={3}
            value={comment}
            onChange={handleCommentChange}
            placeholder="Your feedback is valuable..."
            className="block w-full rounded-md bg-gray-900 border-gray-600 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default Feedback;

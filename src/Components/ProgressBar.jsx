/* eslint-disable react/prop-types */
export default function ProgressBar({
  index,
  numQuestions,
  points,
  maxPossiblePoints,
}) {
  return (
    <header className='progress'>
      {/* progress bar it is built in */}
      <progress max={numQuestions} value={index} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

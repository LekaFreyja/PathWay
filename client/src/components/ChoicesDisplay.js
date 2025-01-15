import React, { useEffect, useState } from 'react';

const ChoicesDisplay = ({ sceneId, setBranch, setOrder, onChoicesComplete }) => {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const response = await fetch(`/api/choices?sceneId=${sceneId}`);
        const data = await response.json();
        setChoices(data);
      } catch (error) {
        console.error('Error fetching choices:', error);
      }
    };

    fetchChoices();
  }, [sceneId]);

  const handleChoiceClick = (choice) => {
    setBranch(choice.nextSceneId);
    setOrder(0);
    onChoicesComplete();
  };

  if (choices.length === 0) {
    return null;
  }

  return (
    <div className="choices-container">
      {choices.map((choice) => (
        <button key={choice.id} onClick={() => handleChoiceClick(choice)}>
          {choice.text}
        </button>
      ))}
    </div>
  );
};

export default ChoicesDisplay;
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const totalCards = 5;
  const [fronts, setFronts] = useState([]);  // Store front of cards
  const [backsPreloaded, setBacksPreloaded] = useState([]);  // Store preloaded back HTML
  const [backsOnDemand, setBacksOnDemand] = useState([]);  // Store on-demand fetched back HTML
  const [currBackPreloaded, setCurrBackPreloaded] = useState('');
  const [currBackOnDemand, setCurrBackOnDemand] = useState('');
  const [currentCard, setCurrentCard] = useState(0);  // Index of the current card
  const [isFront, setIsFront] = useState(true);  // Control whether front or back is shown
  const [isVisible, setIsVisible] = useState(false);  // Control visibility for transition

  // Fetch the first 3 card fronts and preloaded backs when the app loads
  useEffect(() => {
    fetchCardFronts(0, 3);
    fetchCardBackPreloaded(0);
  }, []);

  // Add a slight delay before setting visibility to true for transition
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 500);  // 100ms delay
    return () => clearTimeout(timeout);
  }, [currentCard]);

  // Fetch a range of card fronts from the backend
  const fetchCardFronts = async (start, count) => {
    const newFronts = [...fronts];

    for (let i = start; i < start + count && i < totalCards; i++) {
      if (!newFronts[i]) {  // Check if the card has already been fetched
        try {
          const response = await fetch(`http://localhost:5000/front/${i + 1}`);
          const data = await response.json();
          newFronts[i] = data.front;
        } catch (error) {
          console.error('Error fetching card front data:', error);
        }
      }
    }

    setFronts(newFronts);
  };

  // Fetch and store preloaded back HTML content
  const fetchCardBackPreloaded = async (cardIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/back/${cardIndex + 1}`);
      const data = await response.json();
      const newBacksPreloaded = [...backsPreloaded];
      newBacksPreloaded[cardIndex] = data.back;
      setBacksPreloaded(newBacksPreloaded);
    } catch (error) {
      console.error('Error fetching preloaded card back data:', error);
    }
  };

  // Fetch and display on-demand back HTML content
  const fetchCardBackOnDemand = async (cardIndex) => {
    try {
      const response = await fetch(`http://localhost:5000/back/${cardIndex + 1}`);
      const data = await response.json();
      setCurrBackOnDemand(data.back);  // Set on-demand back content
    } catch (error) {
      console.error('Error fetching on-demand card back data:', error);
    }
  };

  // Function to handle moving to the next card and preloading additional fronts and backs
  const handleNextCard = () => {
    setIsVisible(false);  // Reset visibility to trigger transition on next card
    setCurrentCard((prevCard) => {
      const nextCardIndex = (prevCard + 1) % totalCards;

      // Pre-fetch the 4th card when the 1st card is removed, and the 5th card when the 2nd card is removed
      if (nextCardIndex + 2 < totalCards) {  
        fetchCardFronts(nextCardIndex + 2, 1);  // Pre-fetch two cards ahead
        fetchCardBackPreloaded(nextCardIndex);  // Preload the back content ahead of time
      }
      return nextCardIndex;  // Move to the next card
    });
    setIsFront(true);  // Reset to showing the front of the next card
  };

  // Function to display the large HTML content for both preloaded and on-demand back
  const showBack = () => {
    // Preloaded back (left side)
    setCurrBackPreloaded(backsPreloaded[currentCard] || 'Loading back...');
    
    // On-demand back (right side)
    fetchCardBackOnDemand(currentCard);
    
    setIsFront(false);  // Switch to showing the back of the card
  };

  return (
    <div className="App">
      <header className="App-header">
        {currentCard < fronts.length ? (
          <>
            <div>
              {isFront ? (
                fronts[currentCard]
              ) : (
                <div className="back-content">
                  {/* Left side - Preloaded Back */}
                  <div className="back-section">
                    <div>Preloaded</div>
                    <div dangerouslySetInnerHTML={{ __html: currBackPreloaded }} />
                  </div>
                  {/* Right side - On-Demand Back */}
                  <div className="back-section">
                    <div>On Demand</div>
                    <div dangerouslySetInnerHTML={{ __html: currBackOnDemand || 'Loading back...' }} />
                  </div>
                </div>
              )}
            </div>
            <button onClick={isFront ? showBack : () => setIsFront(true)}>
              {isFront ? 'Show Back' : 'Show Front'}
            </button>
            <br />
            <button onClick={handleNextCard}>Remove Card / Show Next Card</button>
          </>
        ) : (
          <p>No more cards to show.</p>
        )}
        <p>{fronts.filter(Boolean).length} cards loaded out of {totalCards}</p>
      </header>
    </div>
  );
}

export default App;

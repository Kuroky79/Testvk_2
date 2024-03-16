import React, { useState, useEffect } from 'react';
import './styles.css'
const App = () => {
  const [catFact, setCatFact] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchCatFact = async () => {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data = await response.json();
      setCatFact(data.fact);
      // Устанавливаем курсор после первого слова
      const textarea = document.getElementById('catFactTextarea') as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.focus();
        const spaceIndex = data.fact.indexOf(' ');
        textarea.setSelectionRange(spaceIndex + 1, spaceIndex + 1);
      }
    } catch (error) {
      console.error('Error fetching cat fact:', error);
    }
  };

  const fetchAge = async () => {
    try {
      const response = await fetch(`https://api.agify.io/?name=${name}`);
      const data = await response.json();
      setAge(data.age);
    } catch (error) {
      console.error('Error fetching age:', error);
    }
  };

  useEffect(() => {
    if (name && !isFetching) {
      const timeoutId = setTimeout(() => {
        setIsFetching(true);
        fetchAge();
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [name, isFetching]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFetching(true);
    fetchAge();
  };

  return (
      <div className="container">
        <div>
          <textarea className="area" id="catFactTextarea" value={catFact} readOnly></textarea>
          <button className="button" onClick={fetchCatFact}>Get Cat Fact</button>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
          <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
            />
            <button className="button" type="submit" disabled={!name || isFetching}>
              Get Age
            </button>
          </form>
          {age !== null && <p>Age: {age}</p>}
        </div>
      </div>
  );
};

export default App;

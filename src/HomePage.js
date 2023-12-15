// UserProfile.js (or any relevant component)
import React, { useState, useEffect } from 'react';
import moment from 'moment';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [userCal, setUserCal] = useState(null);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('');
  const [food, setFood] = useState('');
  const [totalCalories, setTotalCalories] = useState('');
  const [dateCal, setDateCal] = useState('');
  const [showCal, setShowCal] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const dateStorage = localStorage.getItem('date');
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/find-user/' + userId);
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Something went wrong');
        setUser(null);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    const dataToSend = {
      user: userId,
      entries: [
        {
          date: date,
          food,
          totalCalories: parseInt(totalCalories, 10),
        },
      ],
    };
    console.log(dataToSend);

    try {
      const response = await fetch('http://localhost:5000/calorie-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Calorie entry saved:', responseData);
        setDate('');
        setFood('');
        setTotalCalories('');
      } else {
        console.error('Failed to save calorie entry');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCalDay = async (e) => {
    localStorage.setItem('date', dateCal);

    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    console.log(dateCal)
    try {
      const response = await fetch(`http://localhost:5000/users/total-calories/${userId}/${dateCal}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid JSON response');
      }

      const userData = await response.json();
      setUserCal(userData);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error.message);
      setError('Something went wrong');
      setUserCal(null);
    } finally {
      setShowCal(!showCal);
    }
  }
  

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Height: {user.height}</p>
          <p>Weight: {user.weight}</p>
          <p>Email: {user.email}</p>
          {/* Display other user-specific data as needed */}
        </div>
      ) : (
        <p>{error || 'Loading...'}</p>
      )}
      <h1>
        Food
      </h1>
      <form onSubmit={handleSubmit}>
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <br />
      <label>
        Food:
        <input type="text" value={food} onChange={(e) => setFood(e.target.value)} />
      </label>
      <br />
      <label>
        Total Calories:
        <input
          type="number"
          value={totalCalories}
          onChange={(e) => setTotalCalories(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
    <br/>
    <form onSubmit={handleCalDay}>
      <label>
        Date:
        <input type="date" value={dateCal} onChange={(e) => setDateCal(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
    {userCal ? (
        <div>
          <p>User ID: {userCal.userid}</p>
          <ul>
            {userCal.entries.map((entry, index) => (
              <li key={index}>
                <p>Date: {entry.date}</p>
                <p>Food: {entry.food}</p>
                <p>Calories: {entry.totalCalories}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{error || 'No entries on this date'}</p>
      )}
    </div>
  );
};

export default HomePage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [emailLog, setEmailLog] = useState('');
  const [passLog, setPassLog] = useState('');

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch('http://localhost:5000/register', {
        method: 'post',
        body: JSON.stringify({ name, height, weight, age, email, pass }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();
      console.warn(data);
      console.log(name,email,pass);
      if (result.ok) {
        alert('Data saved successfully');
        setEmail('');
        setName('');
        setPass('');
      } else {
        alert('Failed to save data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const HandleOnSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch('http://localhost:5000/login', {
        method: 'POST',
        body: JSON.stringify({ emailLog, passLog }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await result.json();
  
      if (result.ok) {
        const token = data.token;
        const user = data.user;
        localStorage.setItem('user_id', user._id);
  
        console.log(`Welcome,${user._id} ${user.name} (${user.email})`);
        navigate('/HomePage');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  

  // const handleOnSubmit2 = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const result = await fetch('http://localhost:5000/calorie', {
  //       method: 'post',
  //       body: JSON.stringify({ name,email,pass }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const data = await result.json();
  //     console.warn(data);

  //     if (result.ok) {
  //       alert('Data saved successfully');
  //       setEmail('');
  //       setName('');
  //       setPass('');
  //     } else {
  //       alert('Failed to save data');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //   }
  // };

  return (
    <>
      <h1>This is React WebApp</h1>
      <h2>Register</h2>
      <form>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <input
          type="number"
          placeholder="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          placeholder="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit" onClick={handleOnSubmit}>
          Submit
        </button>
      </form>
      <h2>Login</h2>
      <form>
        <input
          type="email"
          placeholder="email"
          value={emailLog}
          onChange={(e) => setEmailLog(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={passLog}
          onChange={(e) => setPassLog(e.target.value)}
        />
        <button type="submit" onClick={HandleOnSubmitLogin}>
          Submit
        </button>
      </form>

      
      {/* <form>
        <input
          type="text"
          placeholder="food"
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />
        <input
          type="text"
          placeholder="calorie"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
        <button type="submit" onClick={handleOnSubmit2}>
          Submit
        </button>
      </form> */}
    </>
  );
}

export default LoginPage;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const signup = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      alert("Signup successful!");
      nav('/');
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <input className="w-full border p-2 mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="w-full border p-2 mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2" onClick={signup}>Signup</button>
    </div>
  );
}

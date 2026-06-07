import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '../Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), // Kusafisha nafasi zilizoachwa bahati mbaya
        password 
      });
      
      if (error) {
        toast.error("Kosa: " + error.message);
      } else if (data.session) {

        //toast.success("Karibu tena!");
        
        // Tunampa React muda kidogo wa ku-save session kwenye LocalStorage
       // setTimeout(() => {
          // 'replace: true' inazuia mtumiaji kurudi login page akibonyeza 'back'
          navigate("/dashboard", { replace: true });
          
          // Kama mzozo bado upo, unaweza kutumia hii badala ya navigate:
          // window.location.href = "/dashboard";
       // }, 1000); 
       
      }
    } catch (err) {
      toast.error("Kuna tatizo la kiufundi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-center" reverseOrder={false} /> 
      <div className="auth-box">
        <div className="auth-header">
          <h2>Login</h2>
          <p>Karibu tena kwenye Duka </p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Barua Pepe</label>
            <input 
              type="email" 
              placeholder="mfano@gmail.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>Nenosiri</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                Inachakata...
              </span>
            ) : 'Ingia Sasa'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Huna akaunti? <span className="register-link" onClick={() => navigate("/dashboard/register")}>Jisajili hapa</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
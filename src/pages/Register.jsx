import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../Auth.css'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // ADD THIS
  
  const navigate = useNavigate();

  const generateDefaultNameFromEmail = (email) => {
    if (!email) return "Skyfall User";
    
    const emailPrefix = email.split('@')[0];
    let name = emailPrefix.replace(/[._]/g, ' ');
    name = name.replace(/-/g, ' ');
    name = name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    if (!name || name.length < 2 || /^\d+$/.test(name.replace(/\s/g, ''))) {
      return "Skyfall User";
    }
    
    return name;
  };

  // FUNCTION MPYA YA KUUNDA PROFILE (ILIYOREKEBISHWA)
const createUserProfile = async (userId, email) => {
    try {
      const defaultName = generateDefaultNameFromEmail(email);
      const baseUsername = defaultName.toLowerCase().replace(/\s/g, '');
      const username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
      
      console.log("Creating profile for user:", userId);
      
      // 1. ANGALIA KAMA PROFILE IPO
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (existingProfile) {
        console.log("Profile already exists, skipping creation");
        return true;
      }
      
      // 2. INGIZA DATA (Email imeondolewa hapa kwa sababu haipo kwenye table yako)
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          // email: email, <--- ONDOA HII LINE, HAIPO KWENYE DATABASE YAKO
          full_name: defaultName,
          username: username,
          avatar_url: null,
          bio: `Hi! I'm ${defaultName} on Skyfall`,
          // created_at haipo kwenye list yako, kama database haina iondoe pia
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error("Profile creation error details:", error);
        
        if (error.code === '23505') return true; // Duplicate
        
        if (error.message.includes('row-level security policy')) {
          toast.error("Tatizo la usalama wa database (RLS).");
          return false;
        }
        
        return false;
      }
      
      console.log("Profile created successfully");
      return true;
      
    } catch (err) {
      console.error("Unexpected error in profile creation:", err);
      return false;
    }
  };

  // HANDLESIGNUP ILIYOREKEBISHWA KABISA
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    
    // VALIDATION ZAIDI
    if (!email.trim()) {
      toast.error('Tafadhali weka barua pepe');
      setErrorMessage('Barua pepe inahitajika');
      return;
    }
    
    // VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Tafadhali weka barua pepe halali');
      setErrorMessage('Barua pepe si sahihi (mfano: jina@gmail.com)');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Tafadhali weka nenosiri');
      setErrorMessage('Nenosiri inahitajika');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Nenosiri lazima liwe na herufi 6 au zaidi');
      setErrorMessage('Nenosiri lazima iwe na herufi 6+');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Nenosiri hazilingani! Tafadhali kagua tena.');
      setErrorMessage('Manenosiri hayafanani');
      return;
    }

    setLoading(true);
    
    try {
      console.log("Starting registration for:", email);
      
      // SIGN UP USER
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`, // Change to login, not dashboard
          data: {
            full_name: generateDefaultNameFromEmail(email),
          }
        }
      });
      
      console.log("Signup response:", { user: data?.user?.id, error: error?.message });
      
      if (error) {
        // HANDLE SPECIFIC SUPABASE ERRORS
        if (error.message.includes('already registered')) {
          toast.error("Barua pepe tayari imesajiliwa. Tafadhali ingia au tumia email nyingine.");
          setErrorMessage('Email tayari ipo');
        } else if (error.message.includes('password')) {
          toast.error("Nenosiri dhaifu. Tumia herufi 6 au zaidi.");
          setErrorMessage('Nenosiri dhaifu');
        } else {
          toast.error("Hitilafu: " + error.message);
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }
      
      // CHECK IF USER WAS CREATED
      if (!data?.user) {
        console.error("No user data returned");
        toast.error("Hitilafu ya kusajili. Tafadhali jaribu tena.");
        setLoading(false);
        return;
      }
      
      console.log("User created successfully with ID:", data.user.id);
      
      // WAIT A BIT FOR SUPABASE TRIGGERS
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // CREATE PROFILE (with retry)
      let profileCreated = false;
      let retries = 0;
      const maxRetries = 3;
      
      while (!profileCreated && retries < maxRetries) {
        profileCreated = await createUserProfile(data.user.id, email);
        if (!profileCreated && retries < maxRetries - 1) {
          console.log(`Retrying profile creation (attempt ${retries + 2})...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        retries++;
      }
      
      if (profileCreated) {
        toast.success(
          `Karibu ${generateDefaultNameFromEmail(email)}! Akaunti yako imeundwa.`,
          { duration: 4000 }
        );
        
        // TRY AUTO LOGIN
        console.log("Attempting auto-login...");
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!signInError) {
          console.log("Auto-login successful");
          toast.success("Unaingizwa kwenye dashboard...");
          // Small delay before navigation
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          console.error("Auto-login failed:", signInError);
          // If auto-login fails, maybe email confirmation is required
          if (signInError.message.includes('Email not confirmed')) {
            toast.success("Tafadhali kagua email yako ili kuthibitisha akaunti, kisha ingia.");
          } else {
            toast.success("Akaunti imeundwa. Tafadhali ingia kwa kutumia email na password yako.");
          }
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        toast.error("Akaunti imeundwa lakini kuna tatizo. Tafadhali ingia manually.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
      
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      toast.error("Hitilafu isiyotarajiwa. Tafadhali jaribu tena.");
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>Register Account</h2>
          <p>Start with Skyfall.com</p>
        </div>

        {/* SHOW ERROR MESSAGE IF ANY */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c00',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
            />
            <small style={{ color: '#999', fontSize: '11px', marginTop: '4px', display: 'block' }}>
              Your default name will be: {email ? generateDefaultNameFromEmail(email) : '...'}
            </small>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Choose a strong password (min 6 characters)" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Repeat your password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                disabled={loading}
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? 
            <span 
              onClick={() => navigate("/login")} 
              style={{cursor: 'pointer', color: '#ff6a00', fontWeight: 'bold', marginLeft: '5px'}}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
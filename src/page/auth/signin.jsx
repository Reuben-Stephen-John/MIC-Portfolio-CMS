import Navbar from "../../components/Navbar";
import "./signin.css";
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const SignInForm = ({ session }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  searchParams.get('page');
  const callback= searchParams.get('callback');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      setErrorMsg("Invalid login Credentials");
      console.log(error);
    } else {
      console.log(data);
    }
  };
  useEffect(() => {
    if (session) {
      navigate(callback|| '/auth/events/search');
    }
  }, [session, navigate,callback]);

  return (
    <div className="background">
        <Navbar />
      <div className="big-container">
        <div className="flex-center">
          <div className="column border-right" id="sideview">
            <h2>MIC Admin Panel</h2>
            <p className="p">An Admin Panel for Mic Leads and Event Managers</p>
            <p className=" new text-gray-600 mt-4">
              Don't have an account?{" "}
              <a href="" className="text-blue-500 hover:underline">
                Contact Admin
              </a>
            </p>
          </div>

          <div className="column form">
            <form onSubmit={handleSubmit} className="form-container">
              <h1>Sign In</h1>
              <div className="mb-4">
                <label htmlFor="email" className="lab">
                  E-mail ID
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="lab">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errorMsg && <div className="error-text">{errorMsg}</div>}
              <div className="flex justify-center bt">
                <button type="submit">
                  {loading && !errorMsg ? (<span>Loading</span>) : (<span>Login</span>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

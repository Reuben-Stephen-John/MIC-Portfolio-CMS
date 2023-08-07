import React, {useState} from 'react';
import './Navbar.css';
import logo from "../images/logo.png";
import logoauth from '../images/mic-logo auth.png'
import { useLocation } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { supabase } from '../supabaseClient';


function Navbar() {
  const [click, setClick] = useState(false);
    const location = useLocation();
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
        } else {
            // Redirect or perform any other actions after successful logout
            console.log('User logged out');
        }
    };
    const renderNavElements = () => {
      if (location.pathname === '/') {
        return (
          <>
              <nav className="navbar flex justify-center">
                  <div className="navbar-container">
                      <Link to="/" className="navbar-logo">
                          <img src={logo} alt=''/>
                      </Link>
                      
                      <div className='menu-icon' onClick={handleClick}>
                        <iconify-icon  icon={click ? 'line-md:menu-to-close-alt-transition':'line-md:close-to-menu-transition'} width="30" height="30" ></iconify-icon>
                      </div>
                      <ul className={click ? 'nav-menu active': 'nav-menu'}>
                        <li className='nav-item'>
                          <Link to={'/'} className='nav-links' onClick={closeMobileMenu}>
                            Home
                          </Link>
                        </li>
                        <li className='nav-item'>
                          <Link to="#about" smooth className='nav-links' onClick={closeMobileMenu}>
                            About
                          </Link>
                        </li>
                        <li className='nav-item'>
                          <Link to="#events" smooth className='nav-links' onClick={closeMobileMenu}>
                            Events
                          </Link>
                        </li>
                        <li className='nav-item'>
                          <Link to="#contact" smooth className='nav-links' onClick={closeMobileMenu}>
                            Contact
                          </Link>
                        </li>
                      </ul>
                  </div>
              </nav>
          </>
        )
          
      } else if(location.pathname === '/auth'){
        return (
          <>
              <nav className="nav-auth-signgin flex justify-center">
                  <div className="nav-auth-container">
                      <Link to="/" className="nav-auth-logo">
                          <img src={logoauth} alt='' />
                      </Link>
                      <div className='menu-icon' onClick={handleClick}>
                          <iconify-icon icon={click ? 'line-md:menu-to-close-alt-transition' : 'line-md:close-to-menu-transition'} width="30" height="30" ></iconify-icon>
                      </div>
                      <ul className={click ? 'navbar-auth-menu active' : 'navbar-auth-menu'}>
                          <li className='navbar-auth-item'>
                              <Link to={'/'} className='nav-auth-text' onClick={closeMobileMenu}>
                                  Go Back
                              </Link>
                          </li>
                      </ul>
                  </div>
              </nav>
          </>
      );

      }
      else {
        return (
          <>
              <nav className="nav-auth flex justify-center">
                  <div className="nav-auth-container">
                      <Link to="/" className="nav-auth-logo">
                          <img src={logoauth} alt='' />
                      </Link>
                      <div className='menu-icon' onClick={handleClick}>
                          <iconify-icon icon={click ? 'line-md:menu-to-close-alt-transition' : 'line-md:close-to-menu-transition'} width="30" height="30" ></iconify-icon>
                      </div>
                      <ul className={click ? 'navbar-auth-menu active' : 'navbar-auth-menu'}>
                          <li className='navbar-auth-item'>
                              <Link to={'/auth/events/search'} className='nav-auth-inside-text' onClick={closeMobileMenu}>
                                  Events
                              </Link>
                          </li>
                          <li className='navbar-auth-item'>
                              <Link to={'/auth/profiles/search'} smooth className='nav-auth-inside-text' onClick={closeMobileMenu}>
                                  Profiles
                              </Link>
                          </li>
                          <li className='navbar-auth-item'>
                              <Link className='nav-auth-inside-text' onClick={handleLogout}>
                                  SignOut
                              </Link>
                          </li>
                      </ul>
                  </div>
              </nav>
          </>
      );

      }
  }
  return (
    <>
  {renderNavElements()}
    </>
  )
}

export default Navbar
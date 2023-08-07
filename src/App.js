import HomePage from "./page/homepage.page";
import SignInForm from "./page/auth/signin";
import EventAddForm from "./page/auth/Events/eventform";
import EventEditForm from "./page/auth/Events/editeventform";
import MemberList from "./page/auth/profiles/membersearch";
import AddMember from './page/auth/profiles/addMember'
import EditMember from "./page/auth/profiles/editMember";
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import './App.css';
import EventSearch from "./page/auth/Events/eventsearch";
//fonts
import './fonts/SFPRODISPLAYBOLD.woff';
import './fonts/SFPRODISPLAYREGULAR.woff';
import './fonts/SFProDisplay-Light.woff';
import AOS from 'aos';
import 'aos/dist/aos.css';




function App() {
    AOS.init({  // Global settings:
        disable: false,
        startEvent: 'DOMContentLoaded', 
        initClassName: 'aos-init', 
        animatedClassName: 'aos-animate', 
        useClassNames: false, 
        disableMutationObserver: false, 
        debounceDelay: 50, 
        throttleDelay: 99, 
        
        offset: 120, 
        delay: 200, 
        duration: 1500, 
        easing: 'ease', 
        once: false, 
        mirror: false, 
        anchorPlacement: 'top-bottom',
    });
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
    return (
        <>
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="auth/" element={<SignInForm session={session}/>}/>
                <Route path="auth/events/addevent/" element={<EventAddForm session={session}/>}/>
                <Route path="auth/events/editevent/:id" element={<EventEditForm session={session}/>}/>
                <Route path="auth/events/search" element={<EventSearch session={session}/>}/>
                <Route path="auth/profiles/search" element={<MemberList session={session}/>}/>
                <Route path="auth/profiles/addmember" element={<AddMember session={session}/>}/>
                <Route path="auth/profiles/editmember/:id" element={<EditMember session={session}/>}/>
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </Router>
        {/* <MemberList /> */}
       
        </>
    );
}
export default App;
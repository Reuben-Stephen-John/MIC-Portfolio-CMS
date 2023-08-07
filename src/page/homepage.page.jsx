import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Stats from "../components/Stats";
import VitCards from "../components/VitCards";
import OurTeams from "../components/OurTeams";
import Events from "../components/Events";
import Departments from "../components/Departments";
import Footer from "../components/Footer";

import '../App.css';

const HomePage = () => {
    return (
        <>
            <div className="grad-bg">
                <Navbar />
                <Hero />
            </div>
            <Intro />
            <Stats />
            <VitCards />
            <OurTeams />
            <Events />
            <Departments />
            <Footer />
        </>
    );
};
export default HomePage;
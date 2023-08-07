import ReactImageFallback from "react-image-fallback";
import Loading from "../images/loading.gif"
import MicLogo from "../images/mic-logo.png"
import React,{useState,useEffect} from 'react'
import { supabase } from "../supabaseClient";
const OurTeam = () => {
    const [members,setMembers]=useState({
      faculty: [],
      president: [],
      advisory: [],
      secretary: [],
      core: []
    });
    const OurTeamDetails = {
        faculty: [],
        president: [],
        advisory: [],
        secretary: [],
        core: []
      };
      const coreOrder = [
        "MLSA Lead",
        "Web dev Lead",
        "App dev Lead",
        "Web dev Core",
        "App dev Core",
        "Competitive Programming Lead",
        "Competitive Programming Core",
        "Cybersecurity, Technical Lead",
        "Cyber Security Lead",
        "Cyber Security Core",
        "Management Lead",
        "Management Core",
        "Design Lead",
        "Design Core"
      ];
    useEffect(() => {
      fetchData();
    }, []);
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("members").select("*");
        console.log(data);
        if (error) {
          throw error;
        }        
        for (const member of data) {
          if (member.position === "Associate Professor") {
            OurTeamDetails.faculty.push(member);
          } else if (member.position === "President" || member.position === "Vice President") {
            OurTeamDetails.president.push(member);
          } else if (member.position === "Advisory") {
            OurTeamDetails.advisory.push(member);
          } else if (
            member.position === "Technical Secretary" ||
            member.position === "Management Secretary" ||
            member.position === "Content & Design Secretary"
          ) {
            OurTeamDetails.secretary.push(member);
          } else {
            OurTeamDetails.core.push(member);
          }
        }        
        OurTeamDetails.core.sort((a, b) => {
          const orderA = coreOrder.indexOf(a.position);
          const orderB = coreOrder.indexOf(b.position);
          return orderA - orderB;
        })
        console.log(OurTeamDetails);
        setMembers(OurTeamDetails);
      } catch (error) {
        console.log("Error fetching members:", error.message);
      }
    };
    return (
        <>
            <section id="OurTeams">
                <div>
                    <h2 className="flex justify-center m-7">Our Team</h2>
                    <div className="flex flex-row flex-wrap justify-center w-full mt-[30px] px-[10%] gap-10">
                        
                        <div className="hover:-translate-y-1 hover:scale-110 duration-300 flex justify-center min-w-[350px] w-[350px] gap-8 rounded-[30px] p-[1%] shadow-[0_3px_20px_0px_rgba(0,0,0,0.2)]" onClick={() => (window.open(members.faculty[0].linkedin, '_blank'))} >
                            <div className="w-[35%] flex self-center">
                                <ReactImageFallback className="w-[100%] rounded-full" src={`https://uumsoqotclyqmloyiflh.supabase.co/storage/v1/object/public/Profiles/${members.faculty[0]?.profile_picture}`} initialImage={Loading} fallbackImage={MicLogo} alt="Associate proffesor" />
                            </div>
                            <div className="w-[70%]">
                                <h4>{members.faculty[0]?.name}</h4>
                                <p className="text-[15px] text-black font-semibold">{members.faculty[0]?.position}</p>
                                <p className="pt-4 text-black text-[15px]">
                                    {members.faculty[0]?.quote}
                                </p>
                            </div>
                        </div>

                        <div className="hover:-translate-y-1 hover:scale-110 duration-300 flex justify-center min-w-[350px] w-[350px] gap-8 rounded-[30px] p-[1%] shadow-[0_3px_20px_0px_rgba(0,0,0,0.2)]" onClick={() => (window.open(members.faculty[0].linkedin, '_blank'))} >
                            <div className="w-[35%] flex self-center">
                                <ReactImageFallback className="w-[100%] rounded-full" src={`https://uumsoqotclyqmloyiflh.supabase.co/storage/v1/object/public/Profiles/${members.faculty[1]?.profile_picture}`} initialImage={Loading} fallbackImage={MicLogo} alt="Associate proffesor" />
                            </div>
                            <div className="w-[70%]">
                                <h4>{members.faculty[1]?.name}</h4>
                                <p className="text-[15px] text-black font-semibold">{members.faculty[1]?.position}</p>
                                <p className="pt-4 text-black text-[15px]">
                                    {members.faculty[1]?.quote}
                                </p>
                            </div>
                        </div>

                    </div>

                    
                    <div className="flex justify-center">
                        <div className="flex flex-row justify-center flex-wrap w-full m-[30px]">
                            {members.president.map((item, index) => (
                                <OurTeamCard key={index} {...item} />
                            ))
                            }
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex flex-row justify-center flex-wrap w-full mx-[30px]">
                            {members.secretary.map((item, index) => (
                                <OurTeamCard key={index} {...item} />
                            ))
                            }
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex flex-row justify-center flex-wrap w-full mx-[30px]">
                            {members.core.map((item, index) => (
                                <OurTeamCard key={index} {...item} />
                            ))
                            }
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex flex-row justify-center flex-wrap w-full m-[30px]">
                            {members.advisory.map((item, index) => (
                                <OurTeamCard key={index} {...item} />
                            ))
                            }
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

export default OurTeam;


const OurTeamCard = ({ name, profile_picture, position, quote, linkedin }) => {
    return (<>
        <div className="flex justify-center mt-[30px] mx-[10px]">

            <div className="hover:-translate-y-1 hover:scale-110 duration-300 flex flex-row justify-center w-[350px] gap-8 rounded-[30px] p-[4%] shadow-[0_3px_20px_0px_rgba(0,0,0,0.2)]" onClick={() => (window.open(linkedin, '_blank'))} >
                <div className="w-[35%] flex self-center">
                    <ReactImageFallback className="w-[100%] rounded-full aspect-square" src={`https://uumsoqotclyqmloyiflh.supabase.co/storage/v1/object/public/Profiles/${profile_picture}`} initialImage={Loading} fallbackImage={MicLogo} alt="MIC core member" />
                </div>
                <div className="w-[70%]">
                    <h4>{name}</h4>
                    <p className="text-[14px] text-black font-semibold">{position}</p>
                    <p className="pt-4 text-[16px] text-black">
                        {quote}
                    </p>
                </div>
            </div>

        </div>
    </>);
};
import React, { useState, useEffect,useCallback } from "react";
import { HashLink as Link } from 'react-router-hash-link';
import { useNavigate,useParams } from 'react-router-dom';
import { supabase } from "../../../supabaseClient";
import '../Events/eventform.css';
import '../Events/Banner.css'
import Navbar from '../../../components/Navbar';


const EditMember = ({session}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [memberUrl, setMemberUrl] = useState(null);
  const [eventFile, setEventFile] = useState(null);
  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id);
      if (error) {
        throw error;
      }
      console.log(id)
      setEventFile(data[0].profile_picture);
      if (data[0].profile_picture) downloadImage(data[0].profile_picture);

      setMemberdata({
        name: data[0].name,
        linkedin: data[0].linkedin,
        position: data[0].position,
        quote: data[0].quote,
      });
    } catch (error) {
      console.log("Error fetching events:", error.message);
    }
  }, [id]);

  useEffect(() => {
    if (!session) {
        navigate(`/auth?callback=/auth/profiles/editmember/${id}`);
    }
    fetchEvents();
  }, [session, navigate,id,fetchEvents]); // Define the available positions here
    
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from("Profiles").download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setMemberUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  const [Memberdata, setMemberdata] = useState({
    name: '',
    linkedin: '',
    position: '',
    quote: '',
  });

  const handleChange = (e) => {
    setMemberdata({...Memberdata, [e.target.name]: e.target.value})
  };
  const uploadAvatar = async (event) => {
    try {
      console.log(fileName);
      let { error: uploadError } = await supabase.storage
        .from("Profiles")
        .upload(fileName, picture);
      if (uploadError) {
        throw uploadError;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
      if (imgData) {
        if (!fileName) {
          alert("Please upload an image.");
          return;
        }
        await supabase.storage.from("Profiles").remove([eventFile]);
        uploadAvatar();
        let { data, error } = await supabase
        .from("members")
        .update({
          profile_picture: fileName,
          name: Memberdata.name,
          linkedin:Memberdata.linkedin,
          position: Memberdata.position,
          quote: Memberdata.quote,
        })
        .eq("id", id);
        setLoading(false);
        if (error) {
          console.log(error);
        } else {
          console.log(data);
          navigate("/auth/profiles/search");
          alert("Profile successfully Updated!");
        }
      }
      const emptyFields = validateFields();
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.join(", ");
      alert(`Please fill in the following fields: ${fieldNames}`);
      return;
    }
    setLoading(true);
    if(!imgData){
      let { data, error } = await supabase
      .from("members")
      .update({
        name: Memberdata.name,
        linkedin:Memberdata.linkedin,
        position: Memberdata.position,
        quote: Memberdata.quote,
      })
      .eq("id", id);
      setLoading(false);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        navigate("/auth/profiles/search");
        alert("Profile successfully Updated!");
      }
    }
};
const validateFields = () => {
  const emptyFields = [];
  for (const field in Memberdata) {
    if (Memberdata.hasOwnProperty(field) && !Memberdata[field]) {
      emptyFields.push(field);
    }
  }
  return emptyFields;
}
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);
  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      setPicture(e.target.files[0]);
      const file = e.target.files[0];
      const fileExt = file?.name.split(".").pop();
      setFileName(`${Math.random()}.${fileExt}`);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
    <div className="eventpage">
          <Navbar />
          <div className="main">
            <h1 className="h1">ADD MEMBER</h1>
            <form onSubmit={handleSubmit}>
              <div className="main-container">
                <div className="box1">
                  <div className="maininput-container text">
                    <label htmlFor="event-name">Full Name:</label>
                    <br />
                    <input type="text" id="eventname" name="name" value={Memberdata.name} onChange={handleChange} required />
                  </div>
                  <div className="maininput-container">
                    <label htmlFor="time">Postion:</label>
                    <br />
                    <input type="text" id="time" name="position" value={Memberdata.position} onChange={handleChange} required/>
                  </div>
                  <div className="maininput-container">
                    <label htmlFor="time">Quote:</label>
                    <br />
                    <input type="text" id="time" name="quote" value={Memberdata.quote} onChange={handleChange} required/>
                  </div>
                  <div className="maininput-container">
                    <label htmlFor="registrationlink">Linkedin:</label>
                    <br />
                    <input type="url" id="registrationlink" name="linkedin" value={Memberdata.linkedin} onChange={handleChange} required/>
                  </div>
                </div>
                <div className="box1 ">
                <div className="maininput-container">
                  <label htmlFor="time">Profile Picture:</label>
                  <div>
                  {imgData ? (  
                    <img
                      src={imgData}
                      alt="Avatar"
                      className="avatar image"
                      style={{ height: 160, width: 160 }}
                    />
                  ) : memberUrl ? (  
                    <img
                      src={memberUrl}
                      alt="Avatar"
                      className="avatar image"
                      style={{ height: 160, width: 160 }}
                    />
                  ) : (
                    <div
                      className="avatar no-image"
                      style={{ height: 160, width: 160 }}
                    />
                  )}
                    <div style={{ width: 160 }}>
                      <label className="button primary block" htmlFor="single">
                        {uploading ? "Re-uploading ..." : "Re-upload"}
                      </label>
                      <input
                        style={{
                          visibility: "hidden",
                          position: "absolute",
                        }}
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={onChangePicture}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div className="buttons-container">
                <Link to={'/auth/profiles/search'} className="button-back">Back</Link>
                <button type="submit" className="button-save">{loading ? 'Editing...' : 'Edit Member'}</button>
              </div>
            </form>
          </div>
        </div>

    </>
  )
}

export default EditMember
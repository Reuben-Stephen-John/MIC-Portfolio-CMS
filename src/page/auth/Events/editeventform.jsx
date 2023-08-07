import React, { useState, useEffect ,useCallback} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import Navbar from "../../../components/Navbar";
import { HashLink as Link } from "react-router-hash-link";
import './Banner.css';
const EventEditForm = ({ session }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [eventUrl, setEventUrl] = useState(null);
  const [eventFile, setEventFile] = useState(null);

  const [Eventdata, setEventdata] = useState({
    title: "",
    description: "",
    time_start: "",
    time_end: "",
    date: "",
    venue: "",
    fee: "",
    registration_link: "",
  });
  
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from("Events").download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setEventUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id);
      if (error) {
        throw error;
      }
      setEventFile(data[0].cover_photo);
      if (data[0].cover_photo) downloadImage(data[0].cover_photo);

      setEventdata({
        title: data[0].event_name,
        description: data[0].description,
        time_start: data[0].time_start,
        time_end: data[0].time_end,
        date: data[0].date,
        venue: data[0].venue,
        fee: data[0].fee,
        registration_link: data[0].registration_link,
      });
    } catch (error) {
      console.log("Error fetching events:", error.message);
    }
  }, [id]);

  useEffect(() => {
    if (!session) {
      navigate(`/auth?callback=/auth/events/editevent/${id}`);
    }
    fetchEvents();
  }, [session, navigate,id,fetchEvents]);

  const handleChange = (e) => {
    setEventdata({ ...Eventdata, [e.target.name]: e.target.value });
  };

  async function uploadAvatar(event) {
    try {
      let { error: uploadError } = await supabase.storage
        .from("Events")
        .upload(fileName, picture);

      if (uploadError) {
        throw uploadError;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imgData) {
      if (!fileName) {
        alert("Please upload an image.");
        return;
      }
      await supabase.storage.from("Events").remove([eventFile]);
      uploadAvatar();
      let { data, error } = await supabase
      .from("events")
      .update({
        cover_photo: fileName,
        event_name: Eventdata.title,
        description: Eventdata.description,
        time_start: Eventdata.time_start,
        time_end: Eventdata.time_end,
        date: Eventdata.date,
        venue: Eventdata.venue,
        fee: Eventdata.fee,
        registration_link: Eventdata.registration_link,
      })
      .eq("id", id);
      setLoading(false);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        navigate("/auth/events/search");
        alert("Event successfully Updated!");
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
      .from("events")
      .update({
        event_name: Eventdata.title,
        description: Eventdata.description,
        time_start: Eventdata.time_start,
        time_end: Eventdata.time_end,
        date: Eventdata.date,
        venue: Eventdata.venue,
        fee: Eventdata.fee,
        registration_link: Eventdata.registration_link,
      })
      .eq("id", id);
      setLoading(false);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        navigate("/auth/events/search");
        alert("Event successfully Updated!");
      }
    }

    
  };

  const validateFields = () => {
    const emptyFields = [];
    for (const field in Eventdata) {
      if (Eventdata.hasOwnProperty(field) && !Eventdata[field]) {
        emptyFields.push(field);
      }
    }
    return emptyFields;
  };

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
          <h1 className="h1">ADD EVENT</h1>
          <form onSubmit={handleSubmit}>
            <div className="main-container">
              <div className="box1">
                <div className="maininput-container text">
                  <label htmlFor="event-name">Event Name:</label>
                  <br />
                  <input
                    type="text"
                    id="eventname"
                    name="title"
                    value={Eventdata.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="maininput-container">
                  <label htmlFor="fee">Fee:</label>
                  <br />
                  <input
                    type="text"
                    id="fee"
                    name="fee"
                    value={Eventdata.fee}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="maininput-container">
                  <label htmlFor="time">Time Start:</label>
                  <br />
                  <input
                    type="time"
                    id="time"
                    name="time_start"
                    value={Eventdata.time_start}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="maininput-container">
                  <label htmlFor="time">Description:</label>
                  <br />
                  <input
                    type="text"
                    id="time"
                    name="description"
                    value={Eventdata.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="maininput-container">
                  <label htmlFor="time">Event Banner:</label>
                  <div>
                  {imgData ? (  
                    <img
                      src={imgData}
                      alt="Avatar"
                      className="avatar image"
                      style={{ height: 160, width: 160 }}
                    />
                  ) : eventUrl ? (  
                    <img
                      src={eventUrl}
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
              <div className="box1 ">
                <div className="maininput-container">
                  <label htmlFor="date">Date: </label>
                  <br />
                  <input
                    type="date"
                    id="time"
                    name="date"
                    value={
                      Eventdata.date
                        ? new Date(Eventdata.date).toISOString().split("T")[0]
                        : ""
                    }
                    min={new Date().toISOString().split("T")[0]} // Set the minimum date to today
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="maininput-container">
                  <label htmlFor="registrationlink">Registration Link:</label>
                  <br />
                  <input
                    type="url"
                    id="registrationlink"
                    name="registration_link"
                    value={Eventdata.registration_link}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="maininput-container">
                  <label htmlFor="time">Time End:</label>
                  <br />
                  <input
                    type="time"
                    id="time"
                    name="time_end"
                    value={Eventdata.time_end}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="maininput-container">
                  <label htmlFor="venue">Venue:</label>
                  <br />
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={Eventdata.venue}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="buttons-container">
              <Link to={"/auth/events/search"} className="button-back">
                Back
              </Link>
              <button type="submit" className="button-save">
                {loading ? "Updating ..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EventEditForm;

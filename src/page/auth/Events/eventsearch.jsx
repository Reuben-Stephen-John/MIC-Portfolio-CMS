  import Navbar from "../../../components/Navbar";
  import "./eventsearch.css";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { HashLink as Link } from "react-router-hash-link";
  import { supabase } from "../../../supabaseClient";
  import calender from "../../../Icons/calendar-plus-regular.svg";
  import clock from "../../../Icons/clock-regular.svg";
  import location from "../../../Icons/location-dot-solid.svg";
  import add from "../../../Icons/plus-solid.svg";
  import edit from "../../../Icons/pen-solid.svg";
  import trash from "../../../Icons/trash-can-solid.svg";
  import close from "../../../images/close.svg";
  import Loading from "../../../images/loading.gif"
  import MicLogo from "../../../images/mic-logo.png"
  import ReactImageFallback from "react-image-fallback";

  const EventSearch = ({ session }) => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
      if (!session) {
        navigate("/auth?callback=/auth/events/search");
      }
      fetchEvents();
    }, [session, navigate]);

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*");
        if (error) {
          throw error;
        }
        setEvents(data);
        setFilteredEvents(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching events:", error.message);
      }
    };
    const handleEdit = (id) => {
      navigate(`/auth/events/editevent/${id}`);
    };
    const handleCardClick = (event) => {
      setExpandedEvent(event);
    };

    const handleCloseClick = () => {
      setExpandedEvent(null);
    };

    // Function to delete a row and its associated storage element
    const deleteEvent = async (e,eventId, coverPhotoKey) => {
      e.stopPropagation();
      const confirmed = window.confirm(
        "Are you sure you want to delete this member?"
      );
      if (confirmed) {
        try {
          // Delete the row from the 'events' table
          const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", eventId);
          if (error) {
            throw error;
          }

          // Delete the storage element associated with the row
          await supabase.storage.from("Events").remove([coverPhotoKey]);
          // Close the expanded card if the deleted event is currently expanded
          
          alert("Event deleted successfully");

          fetchEvents();
        } catch (error) {
          console.log("Error deleting event:", error.message);
        }
      }
    };

    // Usage example
    const handleDelete = (e,event) => {
      if(expandedEvent)
      {
        setExpandedEvent(null);
      }
      const { id, cover_photo: coverPhotoKey } = event;
      deleteEvent(e,id, coverPhotoKey);
    };

    const [eventTitle, setEventTitle] = useState("");
    const [eventType, setEventType] = useState("current");

    const handleInputChange = (e) => {
      if (e.target.name === "title") {
        setEventTitle(e.target.value);
      } else if (e.target.name === "event_type") {
        setEventType(e.target.value);
      }
    };
    const handleFormSubmit = (e) => {
      e.preventDefault();
      filterEvents();
    };
    const filterEvents = () => {
      const filtered = events.filter((event) => {
        const titleMatch = event.event_name.toLowerCase().includes(eventTitle.toLowerCase());
        const typeMatch = eventType === "all" || (eventType === "past" && event.date < new Date().toISOString()) || (eventType === "upcoming" && event.date >= new Date().toISOString());
        return titleMatch && typeMatch;
      });
    
      setFilteredEvents(filtered);
    };   
    
    return (
      <>
        <Navbar />
        <div className="eventSearchContainer">
          <div className="wrapper">
            <div className="top">
              <div className="topHeading">
                <h3>Event List</h3>
              </div>    
            <Link to={"/auth/events/addevent"} className="buttonDiv">
              <img src={add} className="buttonDivimg" alt="+" />
              Add Event
            </Link>
            </div>
            <form className="filter" onSubmit={handleFormSubmit}>
              <div className="m">
                <div className="form-group ">
                  <input
                    className="eventname"
                    type="text"
                    id="eventname"
                    name="title"
                    placeholder="Event Name"
                    value={eventTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group ">
                  <select
                    className="eventtype"
                    value={eventType}
                    onChange={handleInputChange}
                    name="event_type"
                  > 
                    <option value="all">All Events</option>
                    <option value="past">Past Events</option>
                    <option value="upcoming">Upcoming Events</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <button type="submit" className="submitButton">
                  Submit
                </button>
              </div>
            </form>
            <hr className="hr" />
            <div className="bottom">
              {filteredEvents.map((event, index) => (
                <div
                  className="bottomInnerDiv"
                  key={index}
                  onClick={() => handleCardClick(event)}
                >
                  <div className="imgDiv">
                    <ReactImageFallback src={`https://uumsoqotclyqmloyiflh.supabase.co/storage/v1/object/public/Events/${event.cover_photo}`} initialImage={Loading} fallbackImage={MicLogo} alt="Events Image" />
                  </div>

                  <div className="contentDiv">
                    <div className="heading">
                      <h3>{event.event_name}</h3>
                    </div>
                    <div className="content">
                      <div className="contentDivInner">
                        <div className="details">
                          <span>
                            <img src={calender} alt="Calendar" />
                          </span>
                          <p>{event.date}</p>
                        </div>
                        <div className="details">
                          <span>
                            <img src={clock} alt="Clock" />
                          </span>
                          <p>{event.time_start}</p>
                        </div>
                        <div className="details">
                          <span>
                            <img src={location} alt="Location" />
                          </span>
                          <p>{event.venue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="optionsDiv">
                    <div className="editDiv" onClick={() => handleEdit(event.id)}>
                      <img src={edit} alt="Edit" />
                    </div>
                    <div
                      className="deleteDiv"
                      onClick={(e) => handleDelete(e,event)}
                    >
                      <img src={trash} alt="Delete" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {expandedEvent && (
          <div className="expanded-card">
            <div className="close-butt" onClick={handleCloseClick}>
              <span>
                <img src={close} alt="Close" />
              </span>
            </div>
            <div className="scrollable-content">
              <div className="expanded-img">
              <ReactImageFallback src={`https://uumsoqotclyqmloyiflh.supabase.co/storage/v1/object/public/Events/${expandedEvent.cover_photo}`} initialImage={Loading} fallbackImage={MicLogo} alt="Events Image" />
              </div>
              <div className="expanded-content">
                <div className="expanded-title">
                  <span>{expandedEvent.event_name}</span>
                </div>
                <div className="expanded-desc">{expandedEvent.description}</div>
                <div className="expanded-details">
                  <div className="expanded-detail">
                    <span>
                      <img src={calender} alt="Calendar" />
                    </span>
                    <p>{expandedEvent.date}</p>
                  </div>
                  <div className="expanded-detail">
                    <span>
                      <img src={clock} alt="Clock" />
                    </span>
                    <p>{expandedEvent.time_start}</p>
                  </div>
                  <div className="expanded-detail">
                    <span>
                      <img src={location} alt="Location" />
                    </span>
                    <p>{expandedEvent.venue}</p>
                  </div>
                </div>
                <div className="expanded-options">
                  <div
                    className="editDiv"
                    onClick={() => handleEdit(expandedEvent)}
                  >
                    <img src={edit} alt="Edit" />
                  </div>
                  <div
                    className="deleteDiv"
                    onClick={(e) => handleDelete(e,expandedEvent)}
                  >
                    <img src={trash} alt="Delete" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  export default EventSearch;

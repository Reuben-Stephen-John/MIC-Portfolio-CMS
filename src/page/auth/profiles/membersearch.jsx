import "../Events/eventsearch.css";
import Navbar from "../../../components/Navbar";
import edit from "../../../Icons/pen-solid.svg";
import trash from "../../../Icons/trash-can-solid.svg";
import add from "../../../Icons/plus-solid.svg";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { supabase } from "../../../supabaseClient";
import Loading from "../../../images/loading.gif"
import MicLogo from "../../../images/mic-logo.png"
import ReactImageFallback from "react-image-fallback";

const MemberList = ({ session }) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (!session) {
      navigate('/auth?callback=/auth/profiles/search');
    }
    fetchMembers();
  }, [session, navigate]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .range(0, 9);
      if (error) {
        throw error;
      }
      setMembers(data);
      setFilteredMembers(data);
      const unique = [...new Set(data.map((member) => member.position))];
      setUniquePositions(unique);
    } catch (error) {
      console.log('Error fetching members:', error.message);
    }
  };

  const deleteMember = async (memberId, coverPhotoKey) => {
    const confirmed = window.confirm("Are you sure you want to delete this member?");
    if (confirmed) {
      try {
        const { error } = await supabase.from('members').delete().eq('id', memberId);
        if (error) {
          throw error;
        }

        await supabase.storage.from('Profiles').remove([coverPhotoKey]);
        alert('Member deleted successfully');

        fetchMembers();
      } catch (error) {
        console.log('Error deleting member:', error.message);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/auth/profiles/editmember/${id}`);
  };

  const handleDelete = (member) => {
    const { id, profile_picture: coverPhotoKey } = member;
    if (id) {
      deleteMember(id, coverPhotoKey);
    }
  };

  const [memberName, setMemberName] = useState('');
  const [memberType, setMemberType] = useState('');

  const handleInputChange = (e) => {
    if (e.target.name === 'title') {
      setMemberName(e.target.value);
    } else if (e.target.name === 'event_type') {
      setMemberType(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    filterMembers();
    console.log('Member Name:', memberName);
    console.log('Member Type:', memberType);
  };

  const filterMembers = () => {
    const filtered = members.filter((member) => {
      const titleMatch =member.name.toLowerCase().includes(memberName.toLowerCase());
      const typeMatch = memberType ? member.position === memberType : true;
      return titleMatch && typeMatch;
    });
    setFilteredMembers(filtered);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  // Calculate pagination indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <>
      <Navbar />
      <div className="eventSearchContainer">
        <div className="wrapper">
          <div className="top">
            <div className="topHeading">
              <h3>Mic Member List</h3>
            </div>              
              <Link to={'/auth/profiles/addmember'} className="buttonDiv">
              <img src={add} className="buttonDivimg" alt="+" />
                Add Member
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
                  placeholder="Member Name"
                  value={memberName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group ">
                <select
                  id="eventtype"
                  name="event_type"
                  value={memberType}
                  onChange={handleInputChange}
                >
                  <option value="">All Positions</option>
                  {uniquePositions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="submitButton">Submit</button>
            </div>
          </form>
          <hr className="hr" />
          <div className="bottom">
            {paginatedMembers.map((member, ind) => {
              return (
                <div className="bottomInnerDiv n" key={ind}>
                  <div className="imgDiv">
                  <ReactImageFallback src={`https://uumsoqotclyqmloyiflh.supabase.co/storage/v1/object/public/Profiles/${member.profile_picture}`} initialImage={Loading} fallbackImage={MicLogo} alt="Profile Image" />
                  </div>
                  <div className="contentDiv c">
                    <div className="heading">
                      <h3>{member.name}</h3>
                    </div>
                    <div className="content">
                      <div className="contentDivInner">
                        <div className="details">
                          <p>{member.position}</p>
                        </div>
                        <div className="details">
                        <p>{member.quote && member.quote.length > 50 ? member.quote.substring(0, 50) + '...' : member.quote}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="optionsDiv">
                    <div className="editDiv" onClick={() => handleEdit(member.id)}>
                      <img src={edit} alt="Edit" />
                    </div>
                    <div className="deleteDiv" onClick={() => handleDelete(member)}>
                      <img src={trash} alt="delete" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= filteredMembers.length}
          >
            Next
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default MemberList;

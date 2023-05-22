import { FormEvent, useEffect, useState } from "react";
import { IJob, NextPageWithLayout } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head";
import Modal from "react-modal";
import axios from "@/axios";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { GiClarinet } from "react-icons/gi";
import { toast } from "react-hot-toast";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.40)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Jobs: NextPageWithLayout = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = () => {
    axios
      .get("/api/jobs", {
        params: {
          title: filterTitle,
          location: filterLocation,
          role: filterRole,
        },
      })
      .then((response) => {
        setJobs(response.data);
      });
  };

  const toggleCreateForm = () => {
    setShowCreateForm((prevState) => !prevState);
  };

  const createJob = (e: FormEvent) => {
    e.preventDefault();

    setTitle("");
    setLocation("");
    setRole("");

    axios.post("/api/jobs", { title, location, role }).then((response) => {
      toast.success("Job created succesfully");
      getJobs();
    });
  };

  const removeJob = (id: string) => {
    if (window.confirm("Are you sure you want to remove this job?")) {
      axios.post("/api/removeJob", { jobId: id }).then((response) => {
        if (response.data.success) {
          toast.success("Job deleted succesfully");
          getJobs();
        }
      });
    }
  };

  const applyFilters = () => {
    getJobs();
    setShowFilterModal(false);
  };

  return (
    <>
      <Head>
        <title>Jobs</title>
      </Head>
      <Modal
        style={customStyles}
        isOpen={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <form onSubmit={applyFilters}>
          <div className="left-modal-element">
            <label htmlFor="title">TITLE: </label>
            <input
              id="title"
              type="text"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
            />
          </div>
          <div className="left-modal-element">
            <label htmlFor="location">LOCATION: </label>
            <input
              id="location"
              type="text"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
          <div className="left-modal-element">
            <label htmlFor="role">ROLE: </label>
            <input
              id="role"
              type="text"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            />
          </div>
          <button
            className="btn reply-submit"
            style={{ width: "100%", marginTop: "20px" }}
          >
            Update
          </button>
        </form>
      </Modal>
      <div className="job-area">
        <div className="job-buttons">
          {!!user.company && (
            <>
              <button
                onClick={toggleCreateForm}
                className="left-button chat-btn"
              >
                Create a job advertisement
                <i className="fa-solid fa-plus"></i>
              </button>
            </>
          )}
          <button
            onClick={() => setShowFilterModal(true)}
            className="right-button"
          >
            <i className="fa-solid fa-sort"></i> Filter
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={createJob} className="job-creation-form">
            <div>
              <input
                style={{ width: "100%" }}
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "5px" }}>
              <input
                style={{ width: "100%" }}
                type="text"
                placeholder="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "5px" }}>
              <input
                style={{ width: "100%" }}
                type="text"
                placeholder="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <button
              className="btn reply-submit"
              style={{ marginTop: "10px", width: "100%" }}
            >
              Create
            </button>
          </form>
        )}

        <div className="jobs">
          {jobs.map((job) => (
            <div key={job._id} className="job">
              {job.user!._id === user._id && (
                <div onClick={() => removeJob(job._id)} className="job-remover">
                  <i className="fa fa-x"></i>
                </div>
              )}
              <div className="job-content-area">
                <Link
                  href={`/profile/${job.user!.slug}`}
                  className="job-content-area-profile"
                >
                  <Avatar user={job.user!} style={{ color: "unset" }} />
                </Link>
                <div className="job-content-area-content">
                  <div className="job-content-name">{job.title}</div>
                  <div className="job-location-and-role">
                    <div className="job-content-area-2">
                      <div className="job-heading">location:</div>
                      <div className="job-content">{job.location}</div>
                    </div>
                    <div className="job-content-area-2">
                      <div className="job-heading">role:</div>
                      <div className="job-content">{job.role}</div>
                    </div>
                  </div>
                </div>
              </div>
              {job.user?.slug !== user.slug && (
                <Link
                  href={`/chat/${job.user?.slug}`}
                  className="job-content-search"
                >
                  <GiClarinet size={30} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Jobs.authorization = true;

export default Jobs;

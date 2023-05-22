import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { IUser } from "@/types";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "@/axios";
// @ts-ignore
import omit from "lodash/omit";
import { IoIosRemoveCircle } from "react-icons/io";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  user: IUser;
}

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

const RightSideEditModal = ({ user, isOpen, onRequestClose }: Props) => {
  const { login } = useAuth();
  const [about, setAbout] = useState(user.about);
  const [interest, setInterest] = useState("");
  const [interests, setInterests] = useState(user.interests);
  const [educationText, setEducationText] = useState("");
  const [educationDate, setEducationDate] = useState("");
  const [education, setEducation] = useState(user.education);
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState(user.skills);
  const [experienceText, setExperienceText] = useState("");
  const [experienceDate, setExperienceDate] = useState("");
  const [experiences, setExperiences] = useState(user.experiences);
  const router = useRouter();

  const submit = (e: FormEvent) => {
    e.preventDefault();

    axios
      .post("/api/updateUserData", {
        about,
        interests: interests.map((interest) => omit(interest, "_id")),
        education: education.map((education) => omit(education, "_id")),
        skills: skills.map((skill) => omit(skill, "_id")),
        experiences: experiences.map((experience) => omit(experience, "_id")),
      })
      .then((response) => {
        const data = response.data;

        if (data.error) {
          toast.error(data.error);
        } else if (data.success) {
          toast.success(data.success.message);
          onRequestClose();
          login(data.success.token);
          router.reload();
        }
      });
  };

  const addInterest = (e: FormEvent) => {
    e.preventDefault();

    if (!interest) {
      toast.error("Please enter an interest");
      return;
    }

    setInterests([...interests, { _id: nanoid(), name: interest }]);
    setInterest("");
  };

  const removeInterest = (id: string) => {
    setInterests(interests.filter((interest) => interest._id !== id));
  };

  const addEducation = (e: FormEvent) => {
    e.preventDefault();

    if (!educationText) {
      toast.error("Please enter an education info");
      return;
    }
    if (!educationDate) {
      toast.error("Please enter a valid date");
      return;
    }
    setEducation([
      ...education,
      { _id: nanoid(), name: educationText, date: educationDate },
    ]);
    setEducationText("");
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((education) => education._id !== id));
  };

  const addSkill = (e: FormEvent) => {
    e.preventDefault();

    if (!skill) {
      toast.error("Please enter a skill");
      return;
    }

    setSkills([...skills, { _id: nanoid(), name: skill }]);
    setSkill("");
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill._id !== id));
  };

  const addExperience = (e: FormEvent) => {
    e.preventDefault();

    if (!experienceText) {
      toast.error("Please enter an experience");
      return;
    }

    if (!experienceDate) {
      toast.error("Please enter a valid date");
      return;
    }

    setExperiences([
      ...experiences,
      { _id: nanoid(), name: experienceText, date: experienceDate },
    ]);
    setExperienceText("");
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((experience) => experience._id !== id));
  };

  return (
    <Modal style={customStyles} isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="left-modal-element">
        <label htmlFor="about">ABOUT: </label>
        <input
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>

      <form onSubmit={addInterest}>
        <div className="left-modal-element">
          <label htmlFor="interests">INTERESTS: </label>
          <div
            style={{
              display: "flex",
              gap: "3px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <input
              style={{ width: "100%" }}
              id="interests"
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
            <button className="reply-submit">Add</button>
          </div>
        </div>
        <ul>
          {interests.map((interest) => (
            <li
              key={interest._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <p style={{ textTransform: "capitalize" }}>- {interest.name}</p>
              <button
                className="modal-remover"
                onClick={() => removeInterest(interest._id)}
              >
                <IoIosRemoveCircle />
              </button>
            </li>
          ))}
        </ul>
      </form>

      <form onSubmit={addSkill}>
        <div className="left-modal-element">
          <label htmlFor="skills">SKILLS: </label>
          <input
            style={{ width: "100%" }}
            id="skills"
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <button className="reply-submit">Add</button>
        </div>
        <ul>
          {skills.map((skill) => (
            <li
              key={skill._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <p style={{ textTransform: "capitalize" }}>- {skill.name}</p>
              <button
                className="modal-remover"
                onClick={() => removeSkill(skill._id)}
              >
                <IoIosRemoveCircle />
              </button>
            </li>
          ))}
        </ul>
      </form>

      <form onSubmit={addEducation}>
        <div className="left-modal-element">
          <label htmlFor="education">EDUCATION: </label>
          <input
            id="education"
            type="text"
            value={educationText}
            onChange={(e) => setEducationText(e.target.value)}
          />
          <input
            type="date"
            value={educationDate}
            onChange={(e) => setEducationDate(e.target.value)}
          />
          <button className="reply-submit">Add</button>
        </div>
        <ul>
          {education.map((education) => (
            <li
              key={education._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <p style={{ textTransform: "capitalize" }}>
                - {education.name}{" "}
                {new Date(education.date).toLocaleDateString()}
              </p>
              <button
                className="modal-remover"
                onClick={() => removeEducation(education._id)}
              >
                <IoIosRemoveCircle />
              </button>
            </li>
          ))}
        </ul>
      </form>

      <form onSubmit={addExperience}>
        <div className="left-modal-element">
          <label htmlFor="experiences">EXPERIENCES: </label>
          <input
            id="experiences"
            type="text"
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
          />
          <input
            type="date"
            value={experienceDate}
            onChange={(e) => setExperienceDate(e.target.value)}
          />
          <button className="reply-submit">Add</button>
        </div>
        <ul>
          {experiences.map((experience) => (
            <li
              key={experience._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <p style={{ textTransform: "capitalize" }}>
                - {experience.name}{" "}
                {new Date(experience.date).toLocaleDateString()}
              </p>
              <button
                className="modal-remover"
                onClick={() => removeExperience(experience._id)}
              >
                <IoIosRemoveCircle />
              </button>
            </li>
          ))}
        </ul>
      </form>
      <button
        onClick={submit}
        className="btn reply-submit chat-btn"
        style={{ width: "100%", marginTop: "20px", height: "40px" }}
      >
        Update
      </button>
    </Modal>
  );
};

export default RightSideEditModal;

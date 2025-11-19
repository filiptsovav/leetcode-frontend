import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaDoorOpen } from "react-icons/fa";
import avatarImg from "../assets/avatar.jpeg"; // положи файл сюда

export default function Dashboard({ username = "User" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      {/* Аватар по центру */}
      <div
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          backgroundColor: "rgba(92, 184, 92, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          marginBottom: "20px",
        }}
      >
        <img
          src={avatarImg}
          alt="User Avatar"
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      </div>

      {/* Приветствие */}
      <h3
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#343a40",
        }}
      >
        Hello, {username}! <br />
        What are we solving today?
      </h3>

      {/* Кнопки вертикально */}
      <div
        className="d-flex flex-column align-items-center gap-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        {[
          { text: "View Statistics", to: "/statistics" },
          { text: "Suggest a Task", to: "/taskSuggestion" },
          { text: "Task Selected", to: "/tasks/chosen" },
        ].map((btn) => (
          <button
            key={btn.text}
            onClick={() => navigate(btn.to)}
            className="btn btn-primary btn-lg"
            style={{
              width: "100%",
              padding: "22px 0",
              fontSize: "1.3rem",
              fontWeight: "500",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            {btn.text}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="btn d-flex align-items-center"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(220, 53, 69, 0.9)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "10px 18px",
          boxShadow: "0 0 10px rgba(0,0,0,0.4)",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(186,28,37,0.9)")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(220,53,69,0.9)")}
      >
        <FaDoorOpen style={{ marginRight: "8px" }} />
        Logout
      </button>
    </div>
  );
}

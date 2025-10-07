import React, { useState, useEffect, CSSProperties } from "react";

const slides = [
  {
    image: "public/Images/rms3.png",
    text: "Join our dynamic team and unlock your potential with exciting career opportunities tailored to your growth and success",
  },
  {
    image: "public/Images/rms2.png",
    text: "We value innovation, collaboration, and dedication, fostering a work environment where every individual can thrive",
  },
  {
    image: "public/Images/rms1.jpg",
    text: "Explore a variety of roles across different domains and take the next step in your professional journey with us",
  },
];

const Slideshow: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [initialShowComplete, setInitialShowComplete] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => setInitialShowComplete(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!initialShowComplete) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [initialShowComplete]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const styles: { [key: string]: CSSProperties } = {
    slideshow: {
      position: "relative",
      width: "100%",
      height: "600px",
      margin: "20px auto",
      overflow: "hidden",
      backgroundColor: "#000",
    },
    slide: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0,
      transition: "opacity 1s ease-in-out",
      zIndex: 1,
      display: "block",
    },
    slideVisible: {
      opacity: 1,
      zIndex: 2,
    },
    textOverlay: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // Center text
      color: "white",
      fontSize: "2.3rem", // Larger font
      fontWeight: 700,
      textAlign: "center",
      textShadow: "0 4px 20px rgba(0,0,0,0.7)", // Stronger shadow
      padding: "0 40px", // Some side padding
      zIndex: 3,
      maxWidth: "80%",   // Prevent overflow
      lineHeight: 1.2,
    },
    nav: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(0,0,0,0.4)",
      color: "white",
      border: "none",
      fontSize: "2rem",
      cursor: "pointer",
      padding: "0 10px",
      userSelect: "none",
      zIndex: 4,
    },
    leftBtn: {
      left: "10px",
    },
    rightBtn: {
      right: "10px",
    },
  };

  return (
    <div style={styles.slideshow}>
      {slides.map((slide, index) => {
        const isVisible = index === current;
        return (
          <div
            key={index}
            style={{ ...styles.slide, ...(isVisible ? styles.slideVisible : {}) }}
            aria-hidden={!isVisible}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {isVisible &&
              <div style={styles.textOverlay}>{slide.text}</div>
            }
          </div>
        );
      })}
      <button
        style={{ ...styles.nav, ...styles.leftBtn }}
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        style={{ ...styles.nav, ...styles.rightBtn }}
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Slideshow;
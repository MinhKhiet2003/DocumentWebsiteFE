import React from 'react';
import './ScrollToTopButton.css';
const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button className="scroll-to-top" onClick={scrollToTop}>
      <i className="fa-solid fa-up-long"></i>
    </button>
  );
};

export default ScrollToTopButton;
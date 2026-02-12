import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Import assets
import mainGif from './assets/main.gif';
import img1 from './assets/img1.jpeg';
import img2 from './assets/img2.jpeg';
import img3 from './assets/img3.jpeg';
import img4 from './assets/img4.jpeg';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 10 + Math.random() * 10
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
      {hearts.map(heart => (
        <span
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
};

const Snow = () => {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 5 + 2, // 2px to 7px
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2 // 2s to 5s falling speed
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 100 }}>
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Image configuration for the collage
const collageImages = [
  { src: img1, alt: "Memory 1", rotate: -10, top: "-20px", left: "-140px" },
  { src: img2, alt: "Memory 2", rotate: 15, top: "-40px", right: "-150px" },
  { src: img3, alt: "Memory 3", rotate: -5, bottom: "-20px", left: "-160px" },
  { src: img4, alt: "Memory 4", rotate: 8, bottom: "-10px", right: "-130px" },
];

function App() {
  const [accepted, setAccepted] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });

  const handleYesClick = () => {
    setAccepted(true);
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const moveNoButton = () => {
    // Logic to keep button within viewport
    const btnWidth = 100; // approx
    const btnHeight = 50; // approx

    // Get viewport dimensions
    const maxWidth = window.innerWidth - btnWidth - 40; // padding
    const maxHeight = window.innerHeight - btnHeight - 40;

    // Generate random position relative to valid area, centered roughly
    // We actually want a translation from its original position (0,0 in the flex container)
    // But since we use animate={{x, y}}, these are offsets.
    // If we want random screen position, we can calculate offsets from the center (where it presumably starts)
    // A simpler approach for "fleeing" is just randomizing a bit further but keeping it safe.

    // Let's just bound it to a safe box around the center (where the button roughly is)
    // Depending on screen size, the box size changes.

    const rangeX = Math.min(window.innerWidth * 0.8, 400); // 80% width or 400px
    const rangeY = Math.min(window.innerHeight * 0.6, 400); // 60% height or 400px

    const x = Math.random() * rangeX - rangeX / 2;
    const y = Math.random() * rangeY - rangeY / 2;

    setNoBtnPosition({ x, y });
  };

  return (
    <div className="container">
      <FloatingHearts />
      <Snow />

      <AnimatePresence mode="wait">
        {accepted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ position: 'relative', marginBottom: '30px' }}>
              <img
                src={mainGif}
                alt="Success"
                className="success-img"
              />
            </div>

            <h1 className="success-title">Yay! I knew it! ❤️</h1>
            <p style={{ marginTop: '10px', fontSize: '1.2rem', color: '#888' }}>Our journey continues...</p>
          </motion.div>
        ) : (
          <motion.div
            key="proposal"
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, width: '100%' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Collage Container */}
            <div className="collage-container">
              {/* Main Centered GIF */}
              <motion.img
                src={mainGif}
                alt="Us"
                style={{
                  width: '280px',
                  borderRadius: '15px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  border: '5px solid white',
                  position: 'relative',
                  zIndex: 10
                }}
                initial={{ y: -10 }}
                animate={{ y: 10 }}
                transition={{ repeat: Infinity, repeatType: "mirror", duration: 2, ease: "easeInOut" }}
              />

              {/* Surrounding Images */}
              {collageImages.map((img, index) => (
                <motion.div
                  key={index}
                  style={{
                    position: 'absolute',
                    top: img.top,
                    left: img.left,
                    right: img.right,
                    bottom: img.bottom,
                    zIndex: 5,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: img.rotate }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.1, zIndex: 20, rotate: 0 }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '4px solid white',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.15)'
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <h1 className="question-text">Will you be my Valentine?</h1>

            <div className="buttons-container">
              <motion.button
                whileHover={{ scale: 1.15, boxShadow: '0 10px 25px rgba(255, 77, 109, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYesClick}
                className="btn-yes"
              >
                Yes! 💖
              </motion.button>

              <motion.button
                animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={moveNoButton} // extra safety for click attempts
                className="btn-no"
                // Ensure it doesn't get partially offscreen if possible, but the 'fleeing' makes it hard to click anyway.
                style={{ position: noBtnPosition.x !== 0 ? 'absolute' : 'relative' }}
              >
                No 😢
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

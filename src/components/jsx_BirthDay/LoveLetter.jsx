import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, SkipForward } from "lucide-react";
import HeartLoading from "../HeartLoading";

export default function LoveLetter({
  celebrant,
  loveVideoUrl,
  loveVideoPoster,
  loveVideoUrls = [],
}) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ใช้ loveVideoUrls ถ้ามี หรือใช้ loveVideoUrl เดียว
  const videos = loveVideoUrls.length > 0 ? loveVideoUrls : (loveVideoUrl ? [loveVideoUrl] : []);

  // ฟังก์ชันสำหรับเปลี่ยนวิดีโอถัดไป
  const handleVideoEnd = () => {
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  };

  // ฟังก์ชันสำหรับคลิกเปลี่ยนวิดีโอถัดไป
  const handleNextVideo = () => {
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  };

  // ฟังก์ชันสำหรับเล่น/หยุดวิดีโอ
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play เมื่อเปลี่ยนวิดีโอ
  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement && videos.length > 0) {
      videoElement.play().catch(() => {
        // ถ้า autoplay ไม่ทำงาน (browser policy) จะไม่แสดง error
      });
    }
  }, [currentVideoIndex, videos.length]);

  // ฟังก์ชันเมื่อวิดีโอโหลดเสร็จ
  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  // ฟังก์ชันเมื่อเปลี่ยนวิดีโอ
  const handleVideoChange = () => {
    setIsLoading(true);
  };

  // เปลี่ยนวิดีโอ
  useEffect(() => {
    handleVideoChange();
  }, [currentVideoIndex]);

  if (videos.length === 0) {
    return (
      <section
        id="letter"
        className="bd-container"
        style={{ paddingBottom: "4rem" }}
      >
        <div className="bd-card" style={{ padding: "1.25rem" }}>
          <h2 className="bd-section-title">
            <Heart size={22} color="#e11d48" /> My Love Letter to You
          </h2>
          <p style={{ color: "#374151", lineHeight: 1.75 }}>
            To {celebrant},<br />
            Thank you for being my safe place and my greatest adventure. You light
            up my world with your laughter, your patience, and your heart.
          </p>
          <p style={{ marginTop: 12, color: "#374151" }}>
            Happiest Birthday, my love. 🎂💫
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="letter"
      className="bd-container"
      style={{ paddingBottom: "4rem" }}
    >
      <div className="bd-card" style={{ padding: "1.25rem" }}>
        <h2 className="bd-section-title">
          <Heart size={22} color="#e11d48" /> My Love Letter to You
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.75 }}>
          To {celebrant},<br />
          Thank you for being my safe place and my greatest adventure. You light
          up my world with your laughter, your patience, and your heart.
        </p>
        <p style={{ marginTop: 12, color: "#374151" }}>
          Happiest Birthday, my love. 🎂💫
        </p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          style={{ marginTop: 16 }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
              border: "1px solid #fee2e2",
              // เปลี่ยนจาก aspect-ratio 16:9 เป็น auto height
              minHeight: "400px", // ความสูงขั้นต่ำ
              maxHeight: "80vh", // ความสูงสูงสุด 80% ของ viewport
            }}
          >
            {/* Loading Animation */}
            {isLoading && (
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                zIndex: 10,
              }}>
                <HeartLoading size={80} color="#e11d48" />
              </div>
            )}

            <div style={{ 
              position: "relative", 
              width: "100%", 
              height: "100%",
              minHeight: "400px"
            }}>
              <video
                key={currentVideoIndex} // ใช้ key เพื่อบังคับ re-render เมื่อเปลี่ยนวิดีโอ
                src={videos[currentVideoIndex]}
                controls
                playsInline
                preload="metadata"
                autoPlay
                muted
                loop={videos.length === 1} // loop เฉพาะเมื่อมีวิดีโอเดียว
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedData={handleVideoLoaded}
                onCanPlay={handleVideoLoaded}
                poster={loveVideoPoster}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // เปลี่ยนจาก "cover" เป็น "contain" เพื่อแสดงวิดีโอเต็ม
                  display: "block",
                }}
              />
            </div>
            
            {/* แสดงข้อมูลวิดีโอปัจจุบัน */}
            {videos.length > 1 && (
              <div style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: "12px",
                fontWeight: 500
              }}>
                {currentVideoIndex + 1} / {videos.length}
              </div>
            )}

            {/* ปุ่ม Next Video */}
            {videos.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextVideo}
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  background: "rgba(225, 29, 72, 0.9)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(225, 29, 72, 1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(225, 29, 72, 0.9)";
                }}
              >
                <SkipForward size={14} />
                Next Video
              </motion.button>
            )}

            {/* แสดงสถานะการเล่น */}
            <div style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 4,
              fontSize: "12px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4
            }}>
              {isPlaying ? "▶️ Playing" : "⏸️ Paused"}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

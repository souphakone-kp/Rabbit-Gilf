import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function HeartLoading({ size = 60, color = "#e11d48" }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      padding: "2rem",
    }}>
      {/* หัวใจหลักที่เต้น */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart size={size} color={color} fill={color} />
      </motion.div>

      {/* หัวใจเล็กๆ ที่ลอยรอบๆ */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: size * 0.3,
            height: size * 0.3,
          }}
          animate={{
            x: [
              Math.cos((i * 60) * Math.PI / 180) * 80,
              Math.cos((i * 60 + 180) * Math.PI / 180) * 80,
              Math.cos((i * 60) * Math.PI / 180) * 80,
            ],
            y: [
              Math.sin((i * 60) * Math.PI / 180) * 80,
              Math.sin((i * 60 + 180) * Math.PI / 180) * 80,
              Math.sin((i * 60) * Math.PI / 180) * 80,
            ],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        >
          <Heart size={size * 0.3} color={color} fill={color} />
        </motion.div>
      ))}

      {/* ข้อความ Loading */}
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          color: color,
          fontSize: "1.1rem",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Loading... ��
      </motion.div>

      {/* วงกลมที่หมุนรอบๆ */}
      <motion.div
        style={{
          position: "absolute",
          width: size * 2.5,
          height: size * 2.5,
          border: `2px solid ${color}`,
          borderRadius: "50%",
          opacity: 0.3,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* วงกลมเล็กที่หมุนทวนเข็ม */}
      <motion.div
        style={{
          position: "absolute",
          width: size * 1.5,
          height: size * 1.5,
          border: `1px solid ${color}`,
          borderRadius: "50%",
          opacity: 0.5,
        }}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
} 
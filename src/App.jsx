import { Routes, Route, useLocation } from "react-router-dom";
import BirthdaySite, { DEFAULT_REASONS } from "./components/birthDay";
import "./index.css";
import love from "./assets/love.png";
import love1 from "./assets/love1.png";
import love2 from "./assets/love2.png";
import love3 from "./assets/love3.png";
import love4 from "./assets/love4.png";
import love5 from "./assets/love5.png";
import love6 from "./assets/love6.png";
import love7 from "./assets/love7.png";
import happyBirthday from "./mp3/happy-birthday-334876.mp3";
import loveVideo from "./vdo/vdoToNut.mp4";
import Jigsaw from "./components/Jigsaw";
import { AnimatePresence, motion } from "framer-motion";
import r1 from "./assets/reason1.png";
import r2 from "./assets/reason2.png";
import r3 from "./assets/reason3.png";
import r4 from "./assets/reason4.png";
import r5 from "./assets/reason5.png";
import r6 from "./assets/reason6.png";
import r7 from "./assets/reason7.png";
import r8 from "./assets/reason8.png";
import r9 from "./assets/reason9.png";
import r10 from "./assets/reason10.png";
export default function App() {
  const location = useLocation();
  const imgs = [love1, love2, love3, love4, love5, love6, love7];
  const reasonsImages = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route
            path="/"
            element={
              <BirthdaySite
                celebrant="LookNut"
                birthday={new Date(2025, 10, 10)}
                images={imgs}
                songUrl={happyBirthday}
                reasons={DEFAULT_REASONS}
                themePrimary="#e11d48"
                heroImage={love}
                reasonsImages={reasonsImages}
                loveVideoUrl={loveVideo}         // +++ pass the video
                loveVideoPoster={love}           // + optional poster (image)
              />
            }
          />
          <Route path="/jigsaw" element={<Jigsaw images={imgs} defaultPieces={16} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
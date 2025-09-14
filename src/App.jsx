import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import vdoToNutsea1 from "./vdo/vdoToNut_sea1.MP4";
import vdoToNutsea2 from "./vdo/vdoToNut_sea2.MP4";
import vdoToNut1 from "./vdo/vdoToNut1.MP4";
import vdoToNut2 from "./vdo/vdoToNut2.MP4";
import vdoToNut3 from "./vdo/vdoToNut3.MP4";
import vdoToNut4 from "./vdo/vdoToNut4.MP4";
import vdoToNut5 from "./vdo/vdoToNut5.MP4";
import vdoToNut6 from "./vdo/vdoToNut6.MP4";
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
import Messages from "./components/Messages";

export default function App() {
  const location = useLocation();
  const imgs = [love1, love2, love3, love4, love5, love6, love7];
  const reasonsImages = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10];
  const loveVideos = [vdoToNutsea1,vdoToNutsea2,vdoToNut1, vdoToNut2, vdoToNut3, vdoToNut4, vdoToNut5, vdoToNut6];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="bd-route-wrap"
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
                loveVideoUrl={loveVideos[0]}
                loveVideoPoster={love}
                loveVideoUrls={loveVideos}
              />
            }
          />
          <Route path="/jigsaw" element={<Jigsaw images={imgs} defaultPieces={5} />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

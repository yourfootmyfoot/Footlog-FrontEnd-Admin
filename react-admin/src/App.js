import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";

import Club from "./scenes/domain/club";
import Guest from "./scenes/domain/guest";
import Match from "./scenes/domain/match";
import Member from "./scenes/domain/member";

import EnrollClub from "./scenes/enroll/club";
import EnrollGuest from "./scenes/enroll/guest";
import EnrollMatch from "./scenes/enroll/match";
import EnrollMember from "./scenes/enroll/member";

import Login from "./scenes/login";

import Ask from "./scenes/ask";
import Contacts from "./scenes/contacts";
import ConClub from "./scenes/contacts/conClub";
import Bar from "./scenes/bar";



import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />

          <main className="content">
            
            <Topbar setIsSidebar={setIsSidebar} />

            <Routes>

              <Route path="/" element={<Dashboard />} />
              <Route path="/domain/club" element={<Club />} />
              <Route path="/domain/guest" element={<Guest />} />
              <Route path="/domain/match" element={<Match />} />
              <Route path="/domain/member" element={<Member />} />
              
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/conClub" element={<ConClub />} />

              <Route path="/" element={<Ask />} />
              <Route path="/enroll/club" element={<EnrollClub />} />
              <Route path="/enroll/guest" element={<EnrollGuest />} />
              <Route path="/enroll/match" element={<EnrollMatch />} />
              <Route path="/enroll/member" element={<EnrollMember />} />
              
              <Route path="/login" element={<Login/>}/>
              
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

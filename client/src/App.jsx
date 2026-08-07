import { Routes, Route } from 'react-router-dom';
import Layout from './components/nav/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import Ai from './pages/Ai';
import RoadmapQuestions from './pages/RoadmapQuestions';
import RoadmapDetail from './pages/RoadmapDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DocumentGuide from './pages/DocumentGuide';
import PageAIHelper from './components/PageAIHelper';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/:id" element={<SchemeDetail />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/roadmap/questions" element={<RoadmapQuestions />} />
          <Route path="/roadmap/:id" element={<RoadmapDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/document-guide/:docId" element={<DocumentGuide />} />
        </Route>
      </Routes>
      <PageAIHelper />
    </>
  );
}

import {ReactNode} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore.ts';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Container, CssBaseline } from '@mui/material';
import { Posts } from './pages/Posts.tsx';
import { CreatePost } from './pages/CreatePost.tsx';
import Header from './components/Header.tsx';
import {Home} from './pages/Home.tsx';
import Profile from "./pages/Profile.tsx";
import { CreateProfile } from './pages/CreateProfile.tsx';
import Post from "./pages/Post.tsx";


const PrivateRoute = ({ element }: { element: ReactNode }) => {
  const { user } = useAuthStore();
  return user ? element : <Navigate to=
                                        "/login" />;
};
const PublicRoute = ({ element }: { element: ReactNode }) => {
  const { user } = useAuthStore();
  return !user ? element : <Navigate to=
                                         "/" />;
};
export const App = () => {
  return (
      <>
        <CssBaseline />
        <Header />
        <Container sx={{ mt: 5 }}>
          <Routes>
            <Route path=
                       "/" element={<PrivateRoute element={<Posts />} />} />
              <Route path=
                         "/post" element={<PrivateRoute element={<Post />} />} />
              <Route path=
                         "/post/:id" element={<PrivateRoute element={<Post />} />} />
            <Route path=
                       "/add-post" element={<PrivateRoute element={<CreatePost />} />}
            />
            <Route path=
                       "/login" element={<PublicRoute element={<Login />} />} />
            <Route path=
                       "/register" element={<PublicRoute element={<Register />} />} />
            <Route path=
                       "*" element={<Navigate to="/" />} />
            <Route path=
                       "/home" element={<PrivateRoute element={<Home />}/>}/>
            <Route path=
                       "/profile" element={<PrivateRoute element={<Profile />}/>}/>
            <Route path="/create-profile"
                        element={<PrivateRoute element={<CreateProfile />} />}/>

          </Routes>
        </Container>
      </>
  );
};
export default App;
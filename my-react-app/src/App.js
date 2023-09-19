import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home page/Home';
import SignUp from './Pages/Sign up page/Sign up/SignUp';
import SignIn from './Pages/Sign up page/Sign in/SignIn';
import GameList from './Components/game data fetch/GameList';
import GameDetail from './Pages/Game details page/GameDetails';
import Anticipated from './Components/game data fetch/Anticipated';
import Recommender from './Pages/Recommender Page/Recommender';
import Searchbar from './Components/Search bar/Searchbar';
import NoPage from './Pages/NoPage';
import Browse from './Pages/Browse page/Browse';
import MyList from './Pages/MyList/MyList';
import CompletedList from './Pages/MyList/CompletedList';
import BacklogList from './Pages/MyList/BacklogList';
import DroppedList from './Pages/MyList/DroppedList';
import OnHold from './Pages/MyList/OnHold';

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recommender" element={<Recommender />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/mylist" element={<MyList />} />
          <Route path="/completed-list" element={<CompletedList />} />
          <Route path="/onhold-list" element={<OnHold />} />
          <Route path="/backlog-list" element={<BacklogList />} />
          <Route path="/dropped-list" element={<DroppedList />} />
          <Route exact path='/' Component={Searchbar} />
          <Route exact path='/' Component={GameList} />
          <Route exact path='/' Component={Anticipated} />
          <Route path="/game/:id" Component={GameDetail} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

import { useState } from 'react';
import './App.css';
import logo from './assets/federal-svg.svg';
import menu from './assets/menu.svg';

function App() {
  const [page, setPage] = useState('home');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = (type) => {
    let url = '';
    if (type === 'posts') {
      url = 'https://jsonplaceholder.typicode.com/posts';
    } else if (type === 'comments') {
      url = 'https://jsonplaceholder.typicode.com/comments';
    } else if (type === 'albums') {
      url = 'https://jsonplaceholder.typicode.com/albums';
    } else if (type === 'photos') {
      url = 'https://jsonplaceholder.typicode.com/photos';
    } else if (type === 'todos') {
      url = 'https://jsonplaceholder.typicode.com/todos';
    } else if (type === 'users') {
      url = 'https://jsonplaceholder.typicode.com/users';
    }

    fetch(url)
      .then(response => response.json())
      .then(data => setData(data));
  };

  const renderPage = () => {
    if (page === 'posts' || page === 'comments' || page === 'albums' || page === 'photos' || page === 'users' || page === 'todos') {
      return (
        <div className='content-box'>
          {data.map(item => (
            <div className='card' key={item.id}>
              <h3>{page === 'posts' ? item.title : page === 'comments' ? item.name : page === 'albums' ? item.title : page === 'users' ? item.name : page === 'todos' ? item.title : item.title}</h3>
              <p>{item.body}</p>
              {page === 'comments' && <p>Email: {item.email}</p>}
              <p>ID: {item.id}</p>
              {page === 'albums' && <p>User ID: {item.userId}</p>}
              {page === 'photos' && (
                <>
                  <p>Album ID: {item.albumId}</p>
                  <img src={item.thumbnailUrl} alt={item.title} />
                </>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return <div className='content-box'>Welcome</div>;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className='content'>
          <button className="hamburger-button" onClick={() => setSidebarVisible(!sidebarVisible)}>
            <img className="hamburger" src={menu} alt="hamburger" />
          </button>
          <a href='#'>
            <img className="logo" src={logo} alt="logo" />
          </a>
        </div>

        <div className="navbar-links">
          <a href="#" onClick={() => setPage('home')}>HOME</a>
          <a href="#" onClick={() => setPage('about')}>ABOUT</a>
          <a href="#" onClick={() => setPage('contact')}>CONTACT US</a>
          <a href="#" onClick={() => setPage('careers')}>CAREERS</a>
        </div>
      </nav>
      <div className="main-content">
        <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
          <div className='logos'>
            <div className='logo-container'>
              <button className='hamburger-button2' onClick={() => setSidebarVisible(!sidebarVisible)}>
                <img className="hamburger2" src={menu} alt="hamburger" />
              </button>
            </div>
          </div>
          <button className='page-button' onClick={() => { setPage('posts'); fetchData('posts'); }}>POSTS</button>
          <button className='page-button' onClick={() => { setPage('comments'); fetchData('comments'); }}>COMMENTS</button>
          <button className='page-button' onClick={() => { setPage('albums'); fetchData('albums'); }}>ALBUMS</button>
          <button className='page-button' onClick={() => { setPage('photos'); fetchData('photos'); }}>PHOTOS</button>
          <button className='page-button' onClick={() => { setPage('todos'); fetchData('todos'); }}>TODOS</button>
          <button className='page-button' onClick={() => { setPage('users'); fetchData('users'); }}>USERS</button>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import './App.css';
import logo from './assets/federal-svg.svg';
import menu from './assets/menu.svg';
import editText from './assets/edit-svg.png';
import deleteLogo from './assets/delete.svg';

const UserCreationModal = ({ isOpen, onClose, onSubmit, user }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedUser = Object.fromEntries(formData.entries());
    onSubmit(updatedUser);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{user ? 'Edit User' : 'Create User'}</h2>
        <form className='user-form' onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" defaultValue={user ? user.name : ''} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" defaultValue={user ? user.email : ''} required />
          </label>
          <label>
            Username:
            <input type="text" name="username" defaultValue={user ? user.username : ''} required />
          </label>
          <label>
            Phone:
            <input type="number" name="phone" defaultValue={user ? user.phone : ''} required />
          </label>
          <label>
            Website:
            <input type="text" name="website" defaultValue={user ? user.website : ''} required />
          </label>
          <div className='btn-container'>

          <button className='submitBtn' type="submit">{user ? 'Update' : 'Submit'}</button>
          <button className='closeBtn' type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserTable = ({ data, onDelete, onEdit }) => (
  <table className='user-table'>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Username</th>
        <th>Phone</th>
        <th>Website</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map(user => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.username}</td>
          <td>{user.phone}</td>
          <td>{user.website}</td>
          <td>
          <div className='actionsBtn'>
            <button className='editBtn' onClick={() => onEdit(user)}>
              <img className='edit' src={editText} alt='edit' />
            </button>
            <button className='deleteBtn' onClick={() => onDelete(user.id)}>
              <img className='delete' src={deleteLogo} alt='delete' />
            </button>
          </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

function App() {
  const [page, setPage] = useState('home');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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

    if (searchQuery) {
      url += `?q=${searchQuery}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => setData(data));
  };

  const renderPage = () => {
    if (page === 'users') {
      return <UserTable data={data} onDelete={handleDeleteUser} onEdit={handleEditUser} />;
    } else if (['posts', 'comments', 'albums', 'photos', 'todos'].includes(page)) {
      return (
        <div className='content-box'>
          {data.map(item => (
            <div className='card' key={item.id}>
              <h3>{page === 'posts' || page === 'albums' || page === 'todos' ? item.title : item.name}</h3>
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
    }
  };

  const handleUserCreation = (newUser) => {
    if (editingUser) {
      setData(data.map(user => (user.id === editingUser.id ? { ...user, ...newUser } : user)));
      setEditingUser(null);
    } else {
      const newId = data.length ? Math.max(data.map(user => user.id)) + 1 : 1;
      setData([...data, { ...newUser, id: newId }]);
    }
    setPage('users');
  };

  const handleDeleteUser = (id) => {
    setData(data.filter(user => user.id !== id));
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
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
          <button className='page-button' onClick={() => setIsModalOpen(true)}>CREATE USER</button>
        </div>
        {renderPage()}
      </div>
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <UserCreationModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }} 
        onSubmit={handleUserCreation} 
        user={editingUser}
      />
    </div>
  );
}

export default App;

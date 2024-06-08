/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@mui/material/styles';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  TablePagination
} from '@mui/material';
import { Menu as MenuIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import logo from './assets/federal-svg.svg';
import LoginPage from './LoginPage';
import './App.css';


const UserCreationModal = ({ isOpen, onClose, onSubmit, user }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedUser = Object.fromEntries(formData.entries());
    onSubmit(updatedUser);
    onClose();
  };



  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            name="name"
            defaultValue={user ? user.name : ''}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            name="email"
            defaultValue={user ? user.email : ''}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            name="username"
            defaultValue={user ? user.username : ''}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            name="phone"
            defaultValue={user ? user.phone : ''}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Website"
            type="text"
            name="website"
            defaultValue={user ? user.website : ''}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
          <Button type="submit" color="primary">
            {user ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const UserTable = ({ data, onDelete, onEdit }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Website</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>{user.website}</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(user)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(user.id)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

function App() {
  const [page, setPage] = useState('home');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [data, setData] = useState([]);
  const [searchQuery,] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(theme === 'light'? 'dark' : 'light');
  };

  useEffect(() => {
    if (page !== 'home') {
      fetchData(page);
    }
  }, [page]);

  const fetchData = (type) => {
    let url = `https://jsonplaceholder.typicode.com/${type}`;
    if (searchQuery) {
      url += `?q=${searchQuery}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data));
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const renderPage = () => {
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    if (page === 'users') {
      return <UserTable data={paginatedData} onDelete={handleDeleteUser} onEdit={handleEditUser} />;
    } else if (['posts', 'comments', 'albums', 'photos', 'todos'].includes(page)) {
      return (
        <Container sx={{ my: 13,ml: 30 }}>
          {paginatedData.map(item => (
            <Card key={item.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h5">
                  {page === 'posts' || page === 'albums' || page === 'todos' ? item.title : item.name}
                </Typography>
                {page !== 'photos' && (
                  <Typography variant="body1">{item.body}</Typography>
                )}
                {page === 'comments' && <Typography variant="body2">Email: {item.email}</Typography>}
                <Typography variant="body2">ID: {item.id}</Typography>
                {page === 'albums' && <Typography variant="body2">User ID: {item.userId}</Typography>}
                {page === 'photos' && (
                  <>
                    <Typography variant="body2">Album ID: {item.albumId}</Typography>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.thumbnailUrl}
                      alt={item.title}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          ))}
          <TablePagination
            component="div"
            count={data.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
      );
    }
  };

  const handleUserCreation = (newUser) => {
    if (editingUser) {
      setData(data.map(user => (user.id === editingUser.id ? { ...user, ...newUser } : user)));
      setEditingUser(null);
      setSnackbarMessage('User updated successfully');
      setSnackbarSeverity('success');
    } else {
      const newId = data.length ? Math.max(data.map(user => user.id)) + 1 : 1;
      setData([...data, { ...newUser, id: newId }]);
      setSnackbarMessage('User created successfully');
      setSnackbarSeverity('success');
    }
    setPage('users');
    setSnackbarOpen(true);
  };

  const handleDeleteUser = (id) => {
    setData(data.filter(user => user.id !== id));
    setSnackbarMessage('User deleted successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setSnackbarMessage('Login successful');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={theme === 'light'? lightTheme : darkTheme}>
    <div className="App containerBOX">
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setSidebarVisible(!sidebarVisible)}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="logo" style={{ height: 40, marginRight: 'auto' }} />
          <div>
            <Button color="inherit" onClick={() => setPage('home')}>HOME</Button>
            <Button color="inherit" onClick={() => setPage('about')}>ABOUT</Button>
            <Button color="inherit" onClick={() => setPage('contact')}>CONTACT US</Button>
            <Button color="inherit" onClick={() => setPage('careers')}>CAREERS</Button>
            <Button color="inherit" onClick={toggleTheme}>
                {theme === 'light'? 'Dark Mode' : 'Light Mode'}
              </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="persistent" anchor="left" open={sidebarVisible} onClose={() => setSidebarVisible(false)}>
        <List className='list'>
          <ListItem button onClick={() => { setPage('posts'); fetchData('posts'); }}>
            <ListItemText primary="POSTS" />
          </ListItem>
          <ListItem button onClick={() => { setPage('comments'); fetchData('comments'); }}>
            <ListItemText primary="COMMENTS" />
          </ListItem>
          <ListItem button onClick={() => { setPage('albums'); fetchData('albums'); }}>
            <ListItemText primary="ALBUMS" />
          </ListItem>
          <ListItem button onClick={() => { setPage('photos'); fetchData('photos'); }}>
            <ListItemText primary="PHOTOS" />
          </ListItem>
          <ListItem button onClick={() => { setPage('todos'); fetchData('todos'); }}>
            <ListItemText primary="TODOS" />
          </ListItem>
          <ListItem button onClick={() => { setPage('users'); fetchData('users'); }}>
            <ListItemText primary="USERS" />
          </ListItem>
          <ListItem button onClick={() => setIsModalOpen(true)}>
            <ListItemText primary="CREATE USER" />
          </ListItem>
        </List>
      </Drawer>

      <UserCreationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
        onSubmit={handleUserCreation}
        user={editingUser}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {renderPage()}
    </div>
    </ThemeProvider>
  );
}
const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#333',
    },
    secondary: {
      main: '#666',
    },
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#ccc',
    },
  },
});

export default App;

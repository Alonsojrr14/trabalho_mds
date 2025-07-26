import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Box,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from "@mui/material";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import { getAllMovies } from "../api-helpers/api-helpers";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "../store";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [movies, setMovies] = useState([])
    const [value, setValue] = useState(0);
    useEffect(()=>{
        getAllMovies().then((data)=>setMovies(data.movies))
        .catch((err) => console.log(err))
    },[]);

    const logout = (isAdmin) => {
        dispatch(isAdmin ? adminActions.logout() : userActions.logout());
      };

      const handleChange = (e, val) => {
        const movie = movies.find((m) => m.title === val);
        if (isUserLoggedIn && movie?._id) {
          navigate(`/booking/${movie._id}`);
        }
      };
  return (
    <AppBar position="sticky" sx={{ bgcolor: "#2b2d42" }}>
      <Toolbar>
        <Box width="20%">
          <Link to="/" style={{ color: "white" }}>
          <MovieCreationIcon />
          </Link>
        </Box>
        <Box width="50%" marginRight={"auto"} marginLeft="auto">
          <Autocomplete
          onChange={handleChange}
            freeSolo
            options={movies?.map((option) => option.title) || []}
            renderInput={(params) => (
                <TextField
                variant="standard"
                {...params}
               
                  sx={{
                    borderRadius: 2,
                    input: { color: "white" },
                    bgcolor: "#2b2d42",
                    padding: "6px",
                  }}
                
                  placeholder="Search Movies"
                

                />
              )}
            />
        </Box>
        <Box display="flex">
          <Tabs
            onChange={(e, val) => setValue(val)}
            value={value}
            textColor="inherit"
          >
            <Tab LinkComponent={Link} to="/movies" label="Movies" />
            {!isAdminLoggedIn && !isUserLoggedIn && [
              <Tab key="admin" label="Admin" LinkComponent={Link} to="/admin" />,
              <Tab key="auth" label="Auth" LinkComponent={Link} to="/auth" />
            ]}
            {isUserLoggedIn && [
              <Tab key="profile" label="Profile" LinkComponent={Link} to="/user" />,
              <Tab
                key="logout-user"
                onClick={() => logout(false)}
                label="Logout"
                LinkComponent={Link}
                to="/"
              />
            ]}
            {isAdminLoggedIn && [
              <Tab key="add" label="Add Movie" LinkComponent={Link} to="/add" />,
              <Tab key="profile-admin" label="Profile" LinkComponent={Link} to="/user-admin" />,
              <Tab
                key="logout-admin"
                onClick={() => logout(true)}
                label="Logout"
                LinkComponent={Link}
                to="/"
              />
            ]}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

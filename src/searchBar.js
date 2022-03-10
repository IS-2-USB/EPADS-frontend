import SearchIcon from '@mui/icons-material/Search';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SearchBar = () => {
    return (
        <form action="/" method="get" style={{ display: 'flex', justifyContent: 'right' }}>
            <TextField
                id="outlined-basic"
                variant="outlined"
                label="Buscar"
            />
            <Button variant="outlined">
                <SearchIcon />
            </Button>
        </form>
    );
}

export default SearchBar;
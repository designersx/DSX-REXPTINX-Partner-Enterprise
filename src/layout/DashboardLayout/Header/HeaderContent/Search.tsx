// material-ui
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// assets
import { SearchNormal1 } from '@wandersonalwes/iconsax-react';

interface SearchProps {
  value: string;
  onChange?: (value: string) => void; // make it optional for safety
}

// ==============================|| HEADER CONTENT - SEARCH ||============================== //
export default function Search({ value, onChange }: SearchProps) {
  console.log(value)
  return (
    <Box sx={{ width: '100%', ml: { xs: 0, md: 2 }, mb: 2 }}>
      {/* <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          id="header-search"
          value={value} // bind the value
          onChange={(e) => onChange?.(e.target.value)} // safe call if onChange exists
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchNormal1 size={16} />
            </InputAdornment>
          }
          placeholder="Search Agent..."
          sx={{ '& .MuiOutlinedInput-input': { p: 1.5 } }}
        />
      </FormControl> */}
    </Box>
  );
}

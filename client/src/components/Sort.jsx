import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import { setActiveSort } from "../redux/user/sortfilterSlice";

const Sort = () => {
  const dispatch = useDispatch();
  const { control } = useForm({
    defaultValues: {
      price: "",
      year: "",
    },
  });

  const handlePriceChange = (value) => {
    dispatch(setActiveSort(value));
  };

  const handleYearChange = (value) => {
    dispatch(setActiveSort(value));
  };

  return (
    <div className="flex gap-4">
      <Controller
        control={control}
        name="price"
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Price"
            size="small"
            sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', backgroundColor: 'white' } }}
            onChange={(e) => {
              field.onChange(e.target.value);
              handlePriceChange(e.target.value);
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="price_asc">Low to High</MenuItem>
            <MenuItem value="price_desc">High to Low</MenuItem>
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="year"
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Year"
            size="small"
            sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: '0.75rem', backgroundColor: 'white' } }}
            onChange={(e) => {
              field.onChange(e.target.value);
              handleYearChange(e.target.value);
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="year_asc">Low to High</MenuItem>
            <MenuItem value="year_desc">High to Low</MenuItem>
          </TextField>
        )}
      />
    </div>
  );
};

export default Sort;

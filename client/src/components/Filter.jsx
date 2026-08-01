import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setActiveFilters } from "../redux/user/sortfilterSlice";

const Filter = () => {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const handleData = (data) => {
    const typeMapping = {
      suv: "car_type",
      sedan: "car_type",
      hatchback: "car_type",
      automatic: "transmition",
      manual: "transmition",
    };

    // Transform the form data object into an array of objects with the desired structure
    const transformedData = Object.entries(data)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => ({ [key]: value, type: typeMapping[key] }));

    dispatch(setActiveFilters(transformedData));
  };

  return (
    <form className="w-full" onChange={handleSubmit(handleData)}>
      <div className="w-full mb-6">
        <h3 className="font-bold text-slate-700 mb-3 text-sm">Car Type</h3>
        <FormGroup>
          <FormControlLabel
            control={
              <Controller
                name="suv"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field["value"] ?? false}
                    size="small"
                    sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                  />
                )}
              />
            }
            label={<span className="text-sm text-slate-600">SUV</span>}
          />
          <FormControlLabel
            control={
              <Controller
                name="sedan"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field["value"] ?? false}
                    size="small"
                    sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                  />
                )}
              />
            }
            label={<span className="text-sm text-slate-600">Sedan</span>}
          />
          <FormControlLabel
            control={
              <Controller
                name="hatchback"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field["value"] ?? false}
                    size="small"
                    sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                  />
                )}
              />
            }
            label={<span className="text-sm text-slate-600">Hatchback</span>}
          />
        </FormGroup>
      </div>

      <div className="w-full border-t border-slate-100 pt-6">
        <h3 className="font-bold text-slate-700 mb-3 text-sm">Transmission</h3>
        <FormGroup>
          <FormControlLabel
            control={
              <Controller
                name="automatic"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field["value"] ?? false}
                    size="small"
                    sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                  />
                )}
              />
            }
            label={<span className="text-sm text-slate-600">Automatic</span>}
          />
          <FormControlLabel
            control={
              <Controller
                name="manual"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field["value"] ?? false}
                    size="small"
                    sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                  />
                )}
              />
            }
            label={<span className="text-sm text-slate-600">Manual</span>}
          />
        </FormGroup>
      </div>
    </form>
  );
};

export default Filter;

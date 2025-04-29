import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import { useReeEntities } from '@/hooks/useReeEntities';

interface EnergyTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  includeEmpty?: boolean;
}

const EnergyTypeFilter: React.FC<EnergyTypeFilterProps> = ({
  value,
  onChange,
  label = 'Tipo de Energía',
  helperText,
  includeEmpty = true,
}) => {
  const { reeEntities, loading, error } = useReeEntities();

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  if (error) {
    return <FormHelperText error>Error al cargar los tipos de energía</FormHelperText>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="energy-type-select-label">{label}</InputLabel>
      <Select
        labelId="energy-type-select-label"
        value={value}
        label={label}
        onChange={handleChange}
        disabled={loading}
      >
        {includeEmpty && (
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
        )}
        {reeEntities.map((entity) => (
          <MenuItem key={entity.energyType} value={entity.energyType}>
            {entity.energyType}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default EnergyTypeFilter;
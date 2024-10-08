import { CheckIcon, MinusSmIcon } from '@heroicons/react/solid';
import { Box, SvgIcon, useTheme } from '@mui/material';
import { ListHeaderTitle } from '@/components/lists/ListHeaderTitle';

interface MigrationSelectionBoxProps {
  allSelected: boolean;
  numSelected: number;
  onSelectAllClick: () => void;
  disabled: boolean;
}

export const MigrationSelectionBox = ({
  numSelected,
  allSelected,
  onSelectAllClick,
  disabled,
}: MigrationSelectionBoxProps) => {
  const theme = useTheme();
  const selectionBoxStyle = {
    border: `2px solid ${theme.palette.text.secondary}`,
    background: theme.palette.text.secondary,
    width: 16,
    height: 16,
    borderRadius: '2px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (disabled) {
    return (
      <ListHeaderTitle>
        <Box
          sx={{
            ...selectionBoxStyle,
            background: theme.palette.action.disabledBackground,
            border: `2px solid ${theme.palette.action.disabled}`,
            '&:hover': {
              cursor: 'not-allowed',
            },
          }}
        />
      </ListHeaderTitle>
    );
  }
  return (
    <ListHeaderTitle onClick={onSelectAllClick}>
      {allSelected ? (
        <Box sx={selectionBoxStyle} data-cy={`migration-checkbox-all`}>
          <SvgIcon sx={{ fontSize: '14px', color: 'background.paper' }}>
            <CheckIcon />
          </SvgIcon>
        </Box>
      ) : numSelected !== 0 ? (
        <Box sx={selectionBoxStyle} data-cy={`migration-checkbox-all`}>
          <SvgIcon sx={{ fontSize: '16px', color: 'background.paper' }}>
            <MinusSmIcon />
          </SvgIcon>
        </Box>
      ) : (
        <Box
          sx={{
            ...selectionBoxStyle,
            background: 'white',
          }}
          data-cy={`migration-checkbox-all`}
        />
      )}
    </ListHeaderTitle>
  );
};

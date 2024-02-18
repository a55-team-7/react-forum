import { NavLink, useRouteMatch } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

export const CustomNavLink = ({ to, children }) => {
  let match = useRouteMatch({
    path: to,
    exact: to === '/',
  });

  return (
    <Box
      as={NavLink}
      to={to}
      color={match ? 'blue.500' : 'gray.500'} // Change color based on active state
    >
      {children}
    </Box>
  );
};
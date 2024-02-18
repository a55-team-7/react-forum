import { useMatch, Link as RouterLink } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export const CustomNavLink = ({ to, children }) => {
  let match = useMatch(to);

  return (
    <Box
      as={RouterLink}
      to={to}
      color={match ? 'blue.500' : 'gray.500'} // Change color based on active state
    >
      {children}
    </Box>
  );
};

CustomNavLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node
};
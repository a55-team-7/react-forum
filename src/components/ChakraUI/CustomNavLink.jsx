import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, useColorModeValue, useTheme } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export const CustomNavLink = ({ to, children }) => {
    const location = useLocation();
    let isActive = location.pathname.startsWith(to);

    // If the link is "ReadIT", it should never appear active
    if (to === "/home") {
        isActive = false;
    }

    const activeColor = useColorModeValue("white", "brand.300"); // Always white for active links
    const inactiveColor = useColorModeValue("white", "brand.200");

    const theme = useTheme();
    const activeBorderColor = theme.colors.brand[300]; // Use brand color for active border

    return (
        <Box
            as={RouterLink}
            to={to}
            color={isActive ? activeColor : inactiveColor} // Change color based on active state
            borderLeft={isActive ? `2px solid ${activeBorderColor}` : "none"} // Use brand color for active border
        >
            {children}
        </Box>
    );
};

CustomNavLink.propTypes = {
    to: PropTypes.string,
    children: PropTypes.node
};

<CustomNavLink to="/home">ReadIT</CustomNavLink>

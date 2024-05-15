import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

interface PropType {
    component: React.FC;
}

const PrivateRoute: FC<PropType> = ({ component: Component }) => {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) return <Component />;
    return <Navigate to='/login' />;
};

export default PrivateRoute;
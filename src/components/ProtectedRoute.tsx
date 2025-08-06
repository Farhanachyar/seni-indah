'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, loading } = useAuthContext();
  const router = useRouter();

  const getRoleLevel = (role: string): number => {
    const roleHierarchy: { [key: string]: number } = {
      'super_admin': 3,  
      'admin': 2,        
      'moderator': 1,    
      'user': 0          
    };

    return roleHierarchy[role] || 0;
  };

  const canAccessRole = (userRole: string, requiredRole: string): boolean => {
    const userLevel = getRoleLevel(userRole);
    const requiredLevel = getRoleLevel(requiredRole);

    return userLevel >= requiredLevel;
  };

  useEffect(() => {

    console.log('ProtectedRoute Debug:', {
      loading,
      isAuthenticated,
      user,
      requiredRole,
      userRole: user?.role,
      userLevel: user?.role ? getRoleLevel(user.role) : 0,
      requiredLevel: requiredRole ? getRoleLevel(requiredRole) : 0,
      canAccess: user?.role && requiredRole ? canAccessRole(user.role, requiredRole) : false
    });

    if (!loading) {

      if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to:', redirectTo);
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user?.role) {
        if (!canAccessRole(user.role, requiredRole)) {
          console.log('❌ Role hierarchy violation:', {
            userRole: user.role,
            userLevel: getRoleLevel(user.role),
            requiredRole: requiredRole,
            requiredLevel: getRoleLevel(requiredRole),
            redirecting: '/unauthorized'
          });
          router.push('/unauthorized');
          return;
        } else {
          console.log('✅ Role hierarchy check passed:', {
            userRole: user.role,
            userLevel: getRoleLevel(user.role),
            requiredRole: requiredRole,
            requiredLevel: getRoleLevel(requiredRole)
          });
        }
      }

      console.log('✅ Access granted');
    }
  }, [isAuthenticated, user, loading, requiredRole, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-gray-600 font-medium">Loading...</p>
            <p className="text-xs text-gray-400">Checking authentication & permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role && !canAccessRole(user.role, requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
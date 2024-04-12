

import React from 'react';
import { useRouter } from 'next/router';

interface UserProfileLinkProps {
    userId: string,
    children: React.ReactNode
}

const UserProfileLink = (props : UserProfileLinkProps) => {

const { children, userId } = props 

  const router = useRouter();

  const handleClick = () => {
    router.push(`/profile?id=${userId}`);
  };

  return (
    <span className="hover:underline cursor-pointer" onClick={handleClick}>
      {children}
    </span>
  );
};

export default UserProfileLink;

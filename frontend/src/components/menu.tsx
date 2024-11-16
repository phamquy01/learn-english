'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import apiAuthRequest from '@/apiRequests/auth';
import { handleErrorApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
export default function Menu() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await apiAuthRequest.logoutFromNextClientToServer();
      router.push('/login');
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      router.refresh();
    }
  };

  const handleNavigateCard = () => {
    router.push('/cards');
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar>
          <AvatarImage
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.webiconio.com%2Fdetail%2F255%2F&psig=AOvVaw0kJzKa8s9EdtKGgG37MjDM&ust=1731163190092000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDHss37zIkDFQAAAAAdAAAAABAE"
            alt="user"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleNavigateCard}>
            Cards
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

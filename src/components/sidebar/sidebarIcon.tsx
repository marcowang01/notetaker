'use client'

import React, { FunctionComponent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Icons } from '@/types/icons';
import ChatIcon from "@/icons/chat";
import FolderIcon from "@/icons/folder";
import AddIcon from "@/icons/add";
import AccountIcon from "@/icons/profile";


const sidebarIconMap = {
  [Icons.Chat]: ChatIcon,
  [Icons.Folder]: FolderIcon,
  [Icons.Add]: AddIcon,
  [Icons.Account]: AccountIcon
}

type SidebarIconProps = {
  iconName: Icons;
  label: string;
  href: string;
};

export default function SidebarIcon({ iconName, label, href }: SidebarIconProps) {
  const pathname = usePathname()

  // Class to apply when the href matches the pathname
  const activeClass = pathname === href ? 'opacity-100 bg-gray-350' : 'hover:bg-gray-300 opacity-70';

  const Icon = sidebarIconMap[iconName];

  return (
    <Link href={href} className={`text-sm font-light flex flex-col items-center rounded-lg px-2 py-1 lowercase transition duration-150 ease-in-out ${activeClass}`}>
      <Icon className="h-8 w-8 stroke-current stroke-0.5" />
      {label}
    </Link>
  );
  
}

import React, { FunctionComponent } from 'react';
import Link from 'next/link';

import SidebarIcon from './sidebarIcon';
import UploadButton from './uploadButton';
import RecordButton from './recordButton';
import { Icons } from '@/types/icons';

export default function Sidebar() {
  return (
    <div 
      className="h-full p-4 flex flex-col justify-between border-r-[1px]"
      style={{ borderColor: 'var(--light-gray-rgb)' }}
    >
      <div className="h-full flex flex-col justify-start gap-2">
        <SidebarIcon iconName={Icons.Chat} label="Ask" href="/chat" />
        <SidebarIcon iconName={Icons.Folder} label="Notes" href="/notes" />
        <RecordButton/>
        <UploadButton/>
      </div>
      <SidebarIcon iconName={Icons.Account} label="Profile" href="/profile" />
    </div>
  );
}

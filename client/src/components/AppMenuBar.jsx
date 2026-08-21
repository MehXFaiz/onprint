import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";
import {
  Folder,
  FolderPlus,
  FileText,
  Users,
  UserCheck,
  Settings,
  Bell,
  Calendar,
  CheckCircle,
  Upload,
} from "lucide-react";

export default function AppMenuBar({ className = "" }) {
  return (
    <Menubar className={`bg-white border-b border-slate-200 shadow-xs rounded-b-lg ${className}`}>
      {/* Projects Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-slate-600" />
          <span>Projects</span>
        </MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <span>New Project</span>
          </MenubarItem>
          <MenubarItem className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>All Projects</span>
          </MenubarItem>
          <MenubarItem className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-slate-500" />
            <span>Completed Projects</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Teams Menu with Submenu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-600" />
          <span>Teams</span>
        </MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-500" />
            <span>All Members</span>
          </MenubarItem>
          <MenubarItem className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <span>Create Team</span>
          </MenubarItem>

          <MenubarSeparator />

          {/* Proper Nested Submenu */}
          <MenubarSub>
            <MenubarSubTrigger className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Manage Teams</span>
              </div>
            </MenubarSubTrigger>
            <MenubarSubContent className="w-48">
              <MenubarItem className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Team Settings</span>
              </MenubarItem>
              <MenubarItem className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Team Members</span>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      {/* Calendar Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>Calendar</span>
        </MenubarTrigger>
        <MenubarContent className="w-48">
          <MenubarItem className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>View Calendar</span>
          </MenubarItem>
          <MenubarItem className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Schedule Task</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Notifications */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-600" />
          <span>Notifications</span>
        </MenubarTrigger>
        <MenubarContent className="w-48">
          <MenubarItem className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>All Notifications</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Files Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-slate-600" />
          <span>Files</span>
        </MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload File</span>
          </MenubarItem>
          <MenubarItem className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>My Files</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

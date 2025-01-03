import { LuSearch } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { AiOutlineNotification } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { ThemeButton } from "@/components/theme/theme-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import SideTriggerMbl from "../sidebar/sidebar-trigger-mobile";

const Navbar = async ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("bg-card", className)}
      // animation="scaleY"
      // className={`sticky top-0 z-50 backdrop-blur-lg ${
      // 	isScrolled
      // 		? "shadow-md dark:shadow-lg dark:shadow-slate-500/25 bg-background/20 dark:bg-background/35"
      // 		: "bg-transparent"
      // }`}
    >
      <div className="flex items-center justify-between py-1 pt-2 md:py-2 px-2 md:px-2">
        {/* SEARCH BAR */}
        <div className="hidden md:flex relative flex-1">
          <div className="absolute h-full flex justify-center items-center ml-2 pointer-events-none">
            <LuSearch className="text-gray-500 dark:text-gray-400 w-4 h-4" />
          </div>
          <Input
            type="search"
            placeholder="Search....."
            className="bg-background pl-7 placeholder:select-none rounded-sm max-h-8 border-none"
          />
        </div>

        {/* SIDEBAR TRIGGER */}
        <div className="md:hidden">
          <SideTriggerMbl type="mobile" />
        </div>

        {/* ICONS AND USERS */}
        <div className="flex-1 flex items-center gap-2 md:gap-4 justify-end">
          <div className="bg-muted hover:bg-slate-400/30 rounded-full p-1 flex items-center justify-center cursor-pointer">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <AiOutlineNotification className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Messages</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-muted hover:bg-slate-400/30 rounded-full p-1 flex items-center justify-center cursor-pointer relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <IoNotificationsOutline className="w-5 h-5" />
                  <span className="absolute select-none -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-white flex justify-center items-center text-[11px]">
                    5
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <ThemeButton />

          {/* <div className="flex flex-col">
						<span className="text-xs leading-3 font-medium text-gray-600 dark:text-slate-300 max-w-[60px] truncate min-[480px]:max-w-full">
							John Doe
						</span>
						<span className="text-[10px] text-gray-500 dark:text-slate-400 text-right">
							Admin
						</span>
					</div>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="relative group cursor-pointer transition-all duration-300">
								<Avatar>
									<AvatarImage
										src="/avatar.png"
										alt=""
										className="rounded-full group-hover:ring-4 group-hover:ring-slate-300 dark:group-hover:ring-slate-700 "
									/>
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Profile</p>
						</TooltipContent>
					</Tooltip>
				</div> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

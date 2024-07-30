"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import useUser from "@/hooks/user";
import { DashboardIcon } from "@radix-ui/react-icons";
import { ArrowLeft, User2Icon, Users2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LightLogo from "@/img/logo/light.png";
import DarkLogo from "@/img/logo/dark.png";

export const ProtectedNavbar = () => {
  const { user } = useUser();

  const pathname = usePathname();
  const { theme } = useTheme();

  const logoPath = theme === "light" ? LightLogo : DarkLogo;

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-[20px]">
        <Link href="/">
          <div className="relative w-[120px] h-[45px]">
            <Image
              className="object-contain"
              src={DarkLogo}
              fill
              alt="ifix-logo"
            />
          </div>
        </Link>

        <NavigationMenuItem>
          {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
            <NavigationMenuLink href="/dashboard/settigns/users">
              <Button variant="ghost">
                <Users2Icon className="size-[15px] mr-[10px]" /> Users
              </Button>
            </NavigationMenuLink>
          ) : null}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

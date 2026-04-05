import * as React from "react";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & { initials?: string };

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, initials, children, ...props }, ref) => (
  // No-op visual avatar: keep API for imports but render nothing
  <></>
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <></>
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <></>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };

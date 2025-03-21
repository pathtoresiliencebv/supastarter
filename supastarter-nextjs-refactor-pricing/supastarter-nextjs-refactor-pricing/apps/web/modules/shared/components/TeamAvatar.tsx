import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/avatar";
import BoringAvatar from "boring-avatars";
import { forwardRef, useMemo } from "react";

export const TeamAvatar = forwardRef<
  HTMLSpanElement,
  {
    name: string;
    avatarUrl?: string | null;
    className?: string;
  }
>(({ name, avatarUrl, className }, ref) => {
  const avatarSrc = useMemo(() => avatarUrl ?? undefined, [avatarUrl]);

  return (
    <Avatar ref={ref} className={className}>
      <AvatarImage src={avatarSrc} />
      <AvatarFallback>
        <BoringAvatar
          size={96}
          name={name}
          variant="marble"
          colors={["#4e6df5", "#e5a158", "#9dbee5", "#ced3d9"]}
        />
      </AvatarFallback>
    </Avatar>
  );
});

TeamAvatar.displayName = "TeamAvatar";

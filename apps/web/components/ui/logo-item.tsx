import React, { SVGProps } from "react";

interface LogoItemProps {
  image: React.FC<SVGProps<SVGSVGElement>>;
  name: string;
  version?: string;
  badge?: React.ReactNode;
}

export function LogoItem({ image: Image, name, version, badge }: LogoItemProps) {
  return (
    <div className="flex items-center gap-2 text-zinc-400">
      <Image className="h-5 w-5 fill-current" />
      <span className="text-sm font-medium">{name}</span>
      {version && <span className="text-xs text-zinc-500">v{version}</span>}
      {badge && <span className="ml-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">{badge}</span>}
    </div>
  );
}

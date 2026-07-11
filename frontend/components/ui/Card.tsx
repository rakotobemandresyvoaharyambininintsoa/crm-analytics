import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-lg
        transition-all
        duration-300
        hover:border-violet-500/40
        hover:shadow-violet-500/10
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: CardTitleProps) {
  return (
    <h2
      className={`text-lg font-semibold text-white ${className}`}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  children,
  className = "",
}: CardDescriptionProps) {
  return (
    <p
      className={`text-sm text-slate-400 ${className}`}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
}: CardContentProps) {
  return (
    <div className={`px-6 pb-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}: CardFooterProps) {
  return (
    <div
      className={`
        border-t
        border-slate-800
        p-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}
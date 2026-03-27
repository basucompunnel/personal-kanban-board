import Link from "next/link";

interface AuthFormFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export function AuthFormFooter({ text, linkText, linkHref }: AuthFormFooterProps) {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link href={linkHref} className="font-medium text-primary hover:underline">
        {linkText}
      </Link>
    </div>
  );
}

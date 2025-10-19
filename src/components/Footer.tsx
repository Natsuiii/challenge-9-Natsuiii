import Link from "next/link";
import { Clapperboard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between text-sm text-white/70">
        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="h-6 w-6 rounded-md bg-white/20 grid place-items-center">
            <Clapperboard className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold">Movie</span>
        </Link>

        <p>Copyright ©2025 Movie Explorer</p>
      </div>
    </footer>
  );
}

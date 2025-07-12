"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signInWithEmail } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";

interface EmailLoginFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  nextUrl?: string | null;
}

export const EmailLoginForm = ({
  isLoading,
  setIsLoading,
  nextUrl,
}: EmailLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signInWithEmail(email, password, nextUrl || undefined);

    if (result.success && result.redirectTo) {
      router.push(result.redirectTo);
    } else if (result.error) {
      setError(result.error);
    } else {
      setError("Ocorreu um erro desconhecido.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="email"
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 pl-10"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-muted-foreground hover:text-foreground absolute top-3 right-3 h-4 w-4 focus:outline-none"
          >
            {isPasswordVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Carregando..." : "Fazer Login"}
      </Button>

      <div className="flex items-center justify-between">
        <Link href="/signup" variant="muted">
          Criar conta
        </Link>
        <Link href="/forgot-password" variant="muted">
          Esqueci minha senha
        </Link>
      </div>
    </form>
  );
};

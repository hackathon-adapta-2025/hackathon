"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
}

export const SignupForm = ({
  isLoading,
  setIsLoading,
  onSuccess,
}: SignupFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePassword = () => {
    if (password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres";
    }
    if (password !== confirmPassword) {
      return "As senhas não coincidem";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const pwdError = validatePassword();
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(email, password, name);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Ocorreu um erro ao tentar criar sua conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            autoComplete="name"
          />
        </div>
      </div>

      {/* Email */}
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

      {/* Senha */}
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 pl-10"
            autoComplete="new-password"
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

      {/* Confirmar Senha */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="confirmPassword"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10 pl-10"
            autoComplete="new-password"
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
        {isLoading ? "Carregando..." : "Criar Conta"}
      </Button>

      <div className="flex justify-center">
        <Link href="/login" variant="muted">
          Já tem uma conta? Faça login
        </Link>
      </div>
    </form>
  );
};

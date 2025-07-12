"use server";

import { createClient } from "@/lib/supabaseServer";
import getGeoLocation from "@/models/Geo";
import getWather from "@/models/Weather";
import { redirect } from "next/navigation";

export interface ForgotPasswordState {
  message: string | null;
  error: string | null;
  success: boolean;
}

export interface ResetPasswordState {
  message: string | null;
  error: string | null;
  success: boolean;
}

export type ChangePasswordState = {
  message: string | null;
  error: string | null;
  success: boolean;
};

function getCallbackUrl(baseCallbackPath: string, nextUrl?: string): string {
  let callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${baseCallbackPath}`;
  if (nextUrl && nextUrl.startsWith("/")) {
    callbackUrl += `?next=${encodeURIComponent(nextUrl)}`;
  } else if (nextUrl) {
    console.warn(
      `Invalid nextUrl "${nextUrl}" provided. Not appending to callback.`
    );
  }
  return callbackUrl;
}

export async function signInWithGoogle(nextUrl?: string) {
  const supabase = await createClient();
  const redirectTo = getCallbackUrl("/auth/callback", nextUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    throw error;
  }

  // Redirect to the Google OAuth page
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
  nextUrl?: string
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Email login error:", error);
      return { error: mapAuthError(error.message) };
    }

    if (data.user) {
      const redirectTo = getCallbackUrl("/auth/callback", nextUrl);
      return {
        success: true,
        redirectTo,
      };
    }

    return { success: false, error: "Usuário não encontrado após login." };
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return { error: "Ocorreu um erro inesperado. Por favor, tente novamente." };
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      return { error: mapAuthError(error.message) };
    }

    // Não faz redirect aqui, pois o usuário precisa confirmar o e-mail primeiro.
    return {
      success: true,
      emailConfirmationRequired: true, // Indica que a confirmação por e-mail é necessária.
    };
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return { error: "Ocorreu um erro inesperado. Por favor, tente novamente." };
  }
}

export async function forgotPassword(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;

  if (!email || email.trim() === "") {
    return {
      message: null,
      error: "O campo de e-mail é obrigatório.",
      success: false,
    };
  }

  try {
    const supabase = await createClient();
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      // Log the error but return a generic success message for security
      console.error("Forgot Password Error:", error);

      if (
        error.message.includes("For security purposes") ||
        error.message.includes("Unable to validate email address")
      ) {
        return {
          error: mapAuthError(error.message),
          success: false,
          message: null,
        };
      }

      return {
        message:
          "Se o email estiver cadastrado, um link de redefinição foi enviado.",
        error: null,
        success: true,
      };
    }

    return {
      message:
        "Se o email estiver cadastrado, um link de redefinição foi enviado.",
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error during forgot password:", error);
    return {
      message: null,
      error: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      success: false,
    };
  }
}

export async function resetPassword(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return {
      message: null,
      error: "Preencha os dois campos de senha.",
      success: false,
    };
  }

  if (password !== confirmPassword) {
    return {
      message: null,
      error: "As senhas não coincidem.",
      success: false,
    };
  }

  if (password.length < 8) {
    return {
      message: null,
      error: "A senha deve ter pelo menos 8 caracteres.",
      success: false,
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      console.error(
        "Reset Password - Server Action: No authenticated user found or error fetching user before updateUser.",
        userError
      );
      return {
        message: null,
        error:
          "Sua sessão expirou ou não pôde ser verificada. Por favor, tente o link de redefinição novamente ou contate o suporte.",
        success: false,
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Reset Password Error (from updateUser):", error);
      return {
        message: null,
        error:
          mapAuthError(error.message) ||
          "Falha ao redefinir a senha. O link pode ter expirado ou ser inválido.",
        success: false,
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error(
        "Reset Password - Server Action: Could not refetch user after update call."
      );
    }

    return {
      message:
        "Sua senha foi redefinida com sucesso! Você agora também pode fazer login com sua nova senha.",
      error: null,
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error during password reset:", error);
    return {
      message: null,
      error: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      success: false,
    };
  }
}

export async function changePassword(
  prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      message: null,
      error: "Todos os campos de senha são obrigatórios.",
      success: false,
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      message: null,
      error: "As senhas não coincidem.",
      success: false,
    };
  }

  if (newPassword.length < 8) {
    return {
      message: null,
      error: "A nova senha deve ter pelo menos 8 caracteres.",
      success: false,
    };
  }

  try {
    const supabase = await createClient();

    // First verify the current user is authenticated
    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      console.error(
        "Change Password - Server Action: No authenticated user found or error fetching user.",
        userError
      );
      return {
        message: null,
        error: "Sua sessão expirou. Por favor, faça login novamente.",
        success: false,
      };
    }

    const { data, error } = await supabase.rpc("change_password", {
      current_plain_password: currentPassword,
      new_plain_password: newPassword,
    });

    if (error) {
      console.error("Change Password RPC Error:", error);
      return {
        message: null,
        error: "Falha ao alterar a senha. Tente novamente mais tarde.",
        success: false,
      };
    }

    if (data === "incorrect") {
      return {
        message: null,
        error: "Senha atual incorreta. Por favor, verifique e tente novamente.",
        success: false,
      };
    } else if (data === "success") {
      return {
        message: "Sua senha foi alterada com sucesso!",
        error: null,
        success: true,
      };
    } else {
      return {
        message: null,
        error: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        success: false,
      };
    }
  } catch (error) {
    console.error("Unexpected error during password change:", error);
    return {
      message: null,
      error: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      success: false,
    };
  }
}

export async function signOut() {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Função para mapear mensagens de erro do Supabase para mensagens amigáveis em português
// Helper function for mapping errors (keep this)
function mapAuthError(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials": "Email ou senha incorretos.",
    "Email not confirmed":
      "Por favor, confirme seu email antes de fazer login.",
    "Password should be at least 8 characters":
      "A senha deve ter pelo menos 8 caracteres.",
    "New password should be different from the old password.":
      "A nova senha deve ser diferente da anterior",
    "User already registered": "Este email já está cadastrado.",
    "For security purposes, you can only request this once every 60 seconds":
      "Por segurança, você só pode solicitar isso uma vez a cada 60 segundos.",
    "Unable to validate email address: invalid format":
      "Formato de email inválido.",
    "Password should not be empty": "A senha não pode estar vazia.",
  };

  return (
    errorMap[errorMessage] || "Ocorreu um erro. Por favor, tente novamente."
  );
}

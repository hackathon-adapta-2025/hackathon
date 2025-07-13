// src/components/onboarding/step5.tsx
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Upload, X, Image } from "lucide-react";
import { useState, useRef } from "react";

interface Step5Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function Step5({ form }: Step5Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    id: string;
    fileUrl: string;
    fileName: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    setIsLoading(true);
    setLocationStatus("idle");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Definir os valores no formulário
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);

        setLocationStatus("success");
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        setLocationStatus("error");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSkip = () => {
    // Limpar os valores de localização se o usuário optar por pular
    form.setValue("latitude", undefined);
    form.setValue("longitude", undefined);
    setLocationStatus("idle");
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se é uma imagem
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Verificar tamanho do arquivo (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 10MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/attachments/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao fazer upload");
      }

      const result = await response.json();

      setUploadedImage({
        id: result.id,
        fileUrl: result.fileUrl,
        fileName: result.fileName,
      });

      // Salvar o ID do attachment no formulário
      form.setValue("profilePicture", result.fileUrl);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Limpar o input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    form.setValue("profilePicture", "");
  };

  const latitude = form.watch("latitude");
  const longitude = form.watch("longitude");
  const hasLocation = latitude !== undefined && longitude !== undefined;

  return (
    <div className="flex flex-col gap-6 bg-muted p-4 rounded-lg shadow-sm dark:border dark:border-border">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h2 className="text-2xl font-semibold">Localização e Foto</h2>
        <p className="text-muted-foreground max-w-sm">
          Compartilhe sua localização para recomendações personalizadas e
          adicione uma foto para personalizar seu perfil.
        </p>
      </div>

      <div className="space-y-6">
        {/* Seção de Localização */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <MapPin className="w-8 h-8 text-primary" />
          </div>

          {hasLocation ? (
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-green-600">
                ✓ Localização obtida com sucesso!
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="mt-6"
              >
                Remover localização
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleGetLocation}
                disabled={isLoading}
                className="w-full max-w-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Obtendo localização...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Permitir localização
                  </>
                )}
              </Button>

              {locationStatus === "error" && (
                <p className="text-sm text-destructive">
                  Não foi possível obter sua localização. Verifique se você
                  permitiu o acesso à localização no seu navegador.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Seção de Upload de Imagem */}
        <div className="border-t pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <Image className="w-8 h-8 text-primary" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-medium">Adicionar Foto</h3>
              <p className="text-sm text-muted-foreground">
                Opcional - Personalize seu perfil com uma foto
              </p>
            </div>

            {uploadedImage ? (
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <img
                    src={uploadedImage.fileUrl}
                    alt="Imagem enviada"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-green-600">
                  ✓ Imagem enviada com sucesso!
                </p>
                <p className="text-xs text-muted-foreground">
                  {uploadedImage.fileName}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full max-w-xs"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar da galeria
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Máximo 10MB • JPG, PNG, GIF
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Campos ocultos para armazenar dados */}
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Image } from "lucide-react";
import { useState, useRef } from "react";
import { uploadAttachment } from "@/actions/attachments";

interface Step2Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function Step2({ form }: Step2Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{
    id: string;
    fileUrl: string;
    fileName: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const result = await uploadAttachment(formData);

      if (!result.success) {
        throw new Error(result.error || "Erro ao fazer upload");
      }

      if (!result.data) {
        throw new Error(result.error || "Erro ao fazer upload");
      }

      setUploadedImage({
        id: result.data.id,
        fileUrl: result.data.fileUrl,
        fileName: result.data.fileName,
      });

      // Salvar o ID do attachment no formulário
      form.setValue("profilePicture", result.data.fileUrl);
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

  return (
    <div className="flex flex-col gap-6 bg-muted p-4 rounded-lg shadow-sm dark:border dark:border-border">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h2 className="text-2xl font-semibold">Adicionar Foto de Perfil</h2>
        <p className="text-muted-foreground max-w-sm">
          Personalize seu perfil com uma foto. Este passo é opcional, mas
          recomendado para uma experiência mais personalizada.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <Image className="w-8 h-8 text-primary" />
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

        {/* Campo oculto para armazenar dados */}
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

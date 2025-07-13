"use client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { Progress } from "@/components/ui/progress";
import { Step1 } from "@/components/onboarding/step1";
import { Step2 } from "@/components/onboarding/step2";
import { Step3 } from "@/components/onboarding/step3";
import { Step4 } from "@/components/onboarding/step4";
import { Step5 } from "@/components/onboarding/step5";

export default function OnboardingForm() {
  const {
    form,
    currentStep,
    totalSteps,
    prevStep,
    onSubmit,
    isPending,
    isFirstStep,
    isLastStep,
    nextStep,
    handleFinish,
  } = useOnboardingForm();

  const progress = (currentStep / totalSteps) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 form={form} />;
      case 2:
        return <Step2 form={form} />;
      case 3:
        return <Step3 form={form} />;
      case 4:
        return <Step4 form={form} />;
      case 5:
        return <Step5 form={form} />;
      default:
        return <Step1 form={form} />;
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <Progress
          size="lg"
          value={progress}
          className="mb-4"
          variant="primary"
          glowEffect
        />
        <p className="text-muted-foreground text-center text-sm">
          Passo {currentStep} de {totalSteps}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={prevStep}
              disabled={isFirstStep}
              className={isFirstStep ? "invisible" : ""}
            >
              Voltar
            </Button>
            {isLastStep ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleFinish}
                disabled={isPending}
                size="lg"
              >
                {isPending ? "Salvando..." : "Finalizar"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                disabled={isPending}
                size="lg"
              >
                Próximo
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

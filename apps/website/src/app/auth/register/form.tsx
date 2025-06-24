"use client";

import z from "zod/v4";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

import { authenticationClientside } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import { Label } from "@/components/ui/label";

import Link from "next/link";

const registerFormDefaultValues = {
  email: "",
  password: "",
  name: "",
};

const registerFormValidators = {
  onSubmit: z.object({
    name: z.string().min(2, "Tu nombre debe tener al menos 2 caracteres"),
    email: z.email("Dirección de correo electrónico no válida"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  }),
};

const generateRegisterPayload = (value: typeof registerFormDefaultValues) => ({
  email: value.email,
  password: value.password,
  name: value.name,
});

export function AuthenticationRegisterForm() {
  const router = useRouter();

  const authenticationRegisterFormInstance = useForm({
    defaultValues: registerFormDefaultValues,
    validators: registerFormValidators,
    onSubmit: async ({ value }) => {
      await authenticationClientside.signUp.email(generateRegisterPayload(value), {
        onSuccess: () => {
          router.push("/dashboard");
          toast.success("Sign up successful");
        },
        onError: (error) => {
          toast.error(error.error.message, { position: "top-center" });
        },
      });
    },
  });

  const handleSubmitRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void authenticationRegisterFormInstance.handleSubmit();
  };

  return (
    <>
      <form onSubmit={handleSubmitRegisterForm} className="space-y-4">
        <div>
          <authenticationRegisterFormInstance.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Nombre completo</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="Ej: John Doe"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-muted-foreground text-xs">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </authenticationRegisterFormInstance.Field>
        </div>

        <div>
          <authenticationRegisterFormInstance.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="tu@email.com"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-muted-foreground text-xs">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </authenticationRegisterFormInstance.Field>
        </div>

        <div>
          <authenticationRegisterFormInstance.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Contraseña</Label>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="••••••••"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-muted-foreground text-xs">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </authenticationRegisterFormInstance.Field>
        </div>

        <authenticationRegisterFormInstance.Subscribe>
          {(state) => (
            <Button type="submit" className="w-full" disabled={!state.canSubmit || state.isSubmitting}>
              {state.isSubmitting ? "Procesando..." : "Registrarse"}
            </Button>
          )}
        </authenticationRegisterFormInstance.Subscribe>
      </form>
      <div className="mt-4 text-center">
        <Button asChild variant="link">
          <Link href="/auth/login">¿Ya tienes una cuenta? Inicia sesión</Link>
        </Button>
      </div>
    </>
  );
}

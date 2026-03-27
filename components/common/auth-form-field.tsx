"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AuthFormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  isLoading?: boolean;
}

export function AuthFormField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  isLoading = false,
}: AuthFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className="rounded-xs"
              placeholder={placeholder}
              type={type}
              disabled={isLoading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

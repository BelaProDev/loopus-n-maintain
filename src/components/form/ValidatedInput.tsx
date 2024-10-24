import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { validateField } from '@/lib/formValidation';
import { cn } from "@/lib/utils";

interface ValidatedInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  maxLength?: number;
  isTextarea?: boolean;
  className?: string;
}

const ValidatedInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  maxLength,
  isTextarea = false,
  className
}: ValidatedInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched && value) {
      const validationError = validateField(name, value);
      setError(validationError);
    }
  }, [value, name, touched]);

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateField(name, value);
    setError(validationError);
  };

  const commonProps = {
    id,
    name,
    value,
    onChange,
    required,
    maxLength,
    onBlur: handleBlur,
    className: cn(
      error ? "border-red-500" : "",
      className
    )
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isTextarea ? (
        <Textarea {...commonProps} />
      ) : (
        <Input type={type} {...commonProps} />
      )}
      {maxLength && (
        <p className="text-xs text-gray-500 mt-1">
          {value.length}/{maxLength} characters
        </p>
      )}
      {error && touched && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ValidatedInput;
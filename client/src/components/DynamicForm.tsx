/**
 * Componente de Formulário Dinâmico
 * Renderiza formulários baseados em metadata da API usando shadcn/ui
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import type { FormFieldMetadata } from '../types/po-ui.types';

interface DynamicFormProps {
  fields: FormFieldMetadata[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  initialData?: Record<string, any>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  loading = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Validar campos obrigatórios
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      if (field.obrigatorio && !formData[field.nome]) {
        newErrors[field.nome] = `${field.label} é obrigatório`;
      }

      // Validações adicionais
      if (field.validacao && formData[field.nome]) {
        const value = formData[field.nome];

        if (field.validacao.minLength && value.length < field.validacao.minLength) {
          newErrors[field.nome] = `Mínimo ${field.validacao.minLength} caracteres`;
        }

        if (field.validacao.maxLength && value.length > field.validacao.maxLength) {
          newErrors[field.nome] = `Máximo ${field.validacao.maxLength} caracteres`;
        }

        if (field.validacao.pattern) {
          const regex = new RegExp(field.validacao.pattern);
          if (!regex.test(value)) {
            newErrors[field.nome] = 'Formato inválido';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Lidar com mudanças de campo
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Lidar com submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar campo de acordo com tipo
  const renderField = (field: FormFieldMetadata) => {
    if (!field.visivel) {
      return null;
    }

    const commonProps = {
      id: field.nome,
      disabled: loading || submitting,
    };

    switch (field.tipo) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <div key={field.nome} className="mb-4">
            <Label htmlFor={field.nome}>{field.label}</Label>
            <Input
              {...commonProps}
              type={field.tipo}
              placeholder={field.placeholder}
              value={formData[field.nome] || ''}
              onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
            />
            {errors[field.nome] && <p className="text-sm text-red-500 mt-1">{errors[field.nome]}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.nome} className="mb-4">
            <Label htmlFor={field.nome}>{field.label}</Label>
            <Input
              {...commonProps}
              type="number"
              placeholder={field.placeholder}
              min={field.validacao?.min}
              max={field.validacao?.max}
              step={0.01}
              value={formData[field.nome] || ''}
              onChange={(e: any) => handleFieldChange(field.nome, parseFloat(e.target.value))}
            />
            {errors[field.nome] && <p className="text-sm text-red-500 mt-1">{errors[field.nome]}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.nome} className="mb-4">
            <Label htmlFor={field.nome}>{field.label}</Label>
            <Input
              {...commonProps}
              type="date"
              value={formData[field.nome] || ''}
              onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
            />
            {errors[field.nome] && <p className="text-sm text-red-500 mt-1">{errors[field.nome]}</p>}
          </div>
        );

      case 'color':
        return (
          <div key={field.nome} className="mb-4">
            <Label htmlFor={field.nome}>{field.label}</Label>
            <Input
              {...commonProps}
              type="color"
              value={formData[field.nome] || '#000000'}
              onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
            />
            {errors[field.nome] && <p className="text-sm text-red-500 mt-1">{errors[field.nome]}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.nome} className="mb-4">
            <Label htmlFor={field.nome}>{field.label}</Label>
            <Textarea
              {...commonProps}
              placeholder={field.placeholder}
              value={formData[field.nome] || ''}
              onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
            />
            {errors[field.nome] && <p className="text-sm text-red-500 mt-1">{errors[field.nome]}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.nome} className="mb-4">
            <Label htmlFor={field.nome}>{field.label}</Label>
            <Select
              value={formData[field.nome] || ''}
              onValueChange={(value: any) => handleFieldChange(field.nome, value)}
              disabled={loading || submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {field.opcoes?.map((opcao) => (
                  <SelectItem key={opcao.valor} value={opcao.valor}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.nome] && <p className="text-sm text-red-500 mt-1">{errors[field.nome]}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.nome} className="mb-4 flex items-center space-x-2">
            <Checkbox
              id={field.nome}
              checked={formData[field.nome] || false}
              onCheckedChange={(checked: any) => handleFieldChange(field.nome, checked)}
              disabled={loading || submitting}
            />
            <Label htmlFor={field.nome} className="font-normal cursor-pointer">
              {field.label}
            </Label>
            {errors[field.nome] && <p className="text-sm text-red-500 mt-1">{errors[field.nome]}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {fields
        .sort((a, b) => a.ordem - b.ordem)
        .map((field) => renderField(field))}

      <div className="mt-6 flex gap-2">
        <Button type="submit" disabled={loading || submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading || submitting}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default DynamicForm;

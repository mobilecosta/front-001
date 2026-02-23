/**
 * Componente de Formulário Dinâmico
 * Renderiza formulários baseados em metadata da API
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
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
      fullWidth: true,
      margin: 'normal' as const,
      label: field.label,
      placeholder: field.placeholder,
      error: !!errors[field.nome],
      helperText: errors[field.nome],
      disabled: loading || submitting,
    };

    switch (field.tipo) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <TextField
            key={field.nome}
            {...commonProps}
            type={field.tipo}
            value={formData[field.nome] || ''}
            onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
          />
        );

      case 'number':
        return (
          <TextField
            key={field.nome}
            {...commonProps}
            type="number"
            inputProps={{
              min: field.validacao?.min,
              max: field.validacao?.max,
              step: 0.01,
            }}
            value={formData[field.nome] || ''}
            onChange={(e: any) => handleFieldChange(field.nome, parseFloat(e.target.value))}
          />
        );

      case 'date':
        return (
          <TextField
            key={field.nome}
            {...commonProps}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData[field.nome] || ''}
            onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
          />
        );

      case 'color':
        return (
          <TextField
            key={field.nome}
            {...commonProps}
            type="color"
            value={formData[field.nome] || '#000000'}
            onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <TextField
            key={field.nome}
            {...commonProps}
            multiline
            rows={4}
            value={formData[field.nome] || ''}
            onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
          />
        );

      case 'select':
        return (
          <FormControl key={field.nome} fullWidth margin="normal" error={!!errors[field.nome]}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.nome] || ''}
              onChange={(e: any) => handleFieldChange(field.nome, e.target.value)}
              label={field.label}
              disabled={loading || submitting}
            >
              <MenuItem value="">
                <em>Selecione...</em>
              </MenuItem>
              {field.opcoes?.map((opcao: any) => (
                <MenuItem key={opcao.valor} value={opcao.valor}>
                  {opcao.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            key={field.nome}
            control={
              <Checkbox
                checked={formData[field.nome] || false}
                onChange={(e: any) => handleFieldChange(field.nome, e.target.checked)}
                disabled={loading || submitting}
              />
            }
            label={field.label}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      {fields
        .sort((a, b) => a.ordem - b.ordem)
        .map((field) => renderField(field))}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Salvar'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={loading || submitting}
          >
            Cancelar
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DynamicForm;

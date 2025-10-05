import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import type { RTAFormData, APIResponse, InsuranceOption } from '../types/rta';

// Validation schema
const rtaSchema = z.object({
  insurance_company: z.enum(['allstate', 'progressive'], {
    message: 'Selecione uma seguradora'
  }),
  seller_name: z.string().min(1, 'Nome do vendedor é obrigatório'),
  seller_address: z.string().min(1, 'Endereço do vendedor é obrigatório'),
  owner_name: z.string().min(1, 'Nome do proprietário é obrigatório'),
  owner_dob: z.string().min(1, 'Data de nascimento é obrigatória'),
  owner_license: z.string().min(1, 'Número da licença é obrigatório'),
  owner_residential_address: z.string().min(1, 'Endereço residencial é obrigatório'),
  owner_license_issued_state: z.string().optional(),
  vin: z.string().min(17, 'VIN deve ter 17 caracteres').max(17, 'VIN deve ter 17 caracteres'),
  year: z.number().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano inválido'),
  make: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  body_style: z.string().min(1, 'Estilo do corpo é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  cylinders: z.number().optional(),
  passengers: z.number().optional(),
  doors: z.number().optional(),
  odometer: z.number().optional(),
  previous_title_number: z.string().optional(),
  previous_title_state: z.string().optional(),
  previous_title_country: z.string().optional(),
  gross_sale_price: z.number().min(0, 'Preço deve ser positivo'),
  purchase_date: z.string().min(1, 'Data de compra é obrigatória'),
  insurance_effective_date: z.string().min(1, 'Data efetiva do seguro é obrigatória'),
  insurance_policy_change_date: z.string().optional(),
});

const insuranceOptions: InsuranceOption[] = [
  {
    id: 'allstate',
    name: 'Allstate',
    description: 'Template da seguradora Allstate'
  },
  {
    id: 'progressive',
    name: 'Progressive',
    description: 'Template da seguradora Progressive'
  }
];

const bodyStyles = [
  'Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Wagon', 'Truck', 'Van'
];

const colors = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Other'
];

export const RTAForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<RTAFormData>({
    resolver: zodResolver(rtaSchema),
    defaultValues: {
      insurance_company: 'allstate',
      year: new Date().getFullYear(),
      gross_sale_price: 0,
    }
  });

  const selectedInsurance = watch('insurance_company');

  const onSubmit = async (data: RTAFormData) => {
    setIsSubmitting(true);
    setApiResponse(null);

    try {
      console.log('Enviando dados:', data);
      
      const response = await fetch('http://localhost:5000/api/rta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (response.ok) {
        // Resposta é um arquivo PDF
        const blob = await response.blob();
        console.log('Blob size:', blob.size, 'type:', blob.type);
        
        const url = window.URL.createObjectURL(blob);
        
        // Auto download do PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = `RTA_${data.insurance_company}_${data.owner_name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpar o URL do blob
        window.URL.revokeObjectURL(url);
        
        console.log('Download iniciado!');
        setApiResponse({
          success: true,
          message: 'RTA gerado e baixado com sucesso!'
        });
      } else {
        // Se não for 200, tentar ler como JSON para pegar o erro
        const errorResult = await response.json();
        setApiResponse({
          error: errorResult.error || 'Erro desconhecido'
        });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setApiResponse({
        error: 'Erro de conexão com o servidor'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setApiResponse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center">
              <FileText className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Gerador de RTA
                </h1>
                <p className="text-blue-100 mt-1">
                  Preencha os dados para gerar o documento RTA automaticamente
                </p>
              </div>
            </div>
          </div>

          {/* Response Message */}
          {apiResponse && (
            <div className="px-8 py-4 border-b border-gray-200">
              {apiResponse.error ? (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-red-800 font-medium">{apiResponse.error}</span>
                </div>
              ) : (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-green-800 font-medium">
                    RTA gerado com sucesso! O download deve iniciar automaticamente.
                  </span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
            {/* Insurance Company Selection */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                💼 Selecionar Seguradora
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insuranceOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`relative flex cursor-pointer rounded-xl border-2 p-6 focus:outline-none transition-all duration-200 ${
                      selectedInsurance === option.id
                        ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('insurance_company')}
                      value={option.id}
                      className="sr-only"
                    />
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <div className={`font-semibold text-lg ${
                            selectedInsurance === option.id ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {option.name}
                          </div>
                          <div className={`mt-1 ${
                            selectedInsurance === option.id ? 'text-blue-700' : 'text-gray-500'
                          }`}>
                            {option.description}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 transition-all ${
                          selectedInsurance === option.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedInsurance === option.id && (
                          <div className="h-3 w-3 rounded-full bg-white m-0.5" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.insurance_company && (
                <p className="text-red-600 text-sm font-medium">{errors.insurance_company.message}</p>
              )}
            </div>

            {/* Seller Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                🏪 Informações do Vendedor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Nome do Vendedor</label>
                  <input
                    type="text"
                    {...register('seller_name')}
                    className="form-input"
                    placeholder="Ex: João Silva"
                  />
                  {errors.seller_name && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.seller_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Endereço do Vendedor</label>
                  <input
                    type="text"
                    {...register('seller_address')}
                    className="form-input"
                    placeholder="Ex: 123 Main St, City, State, ZIP"
                  />
                  {errors.seller_address && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.seller_address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                👤 Informações do Proprietário
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Nome do Proprietário</label>
                  <input
                    type="text"
                    {...register('owner_name')}
                    className="form-input"
                    placeholder="Ex: Maria Santos"
                  />
                  {errors.owner_name && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.owner_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    {...register('owner_dob')}
                    className="form-input"
                  />
                  {errors.owner_dob && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.owner_dob.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Número da Licença</label>
                  <input
                    type="text"
                    {...register('owner_license')}
                    className="form-input"
                    placeholder="Ex: 123456789"
                  />
                  {errors.owner_license && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.owner_license.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Estado/País da Licença (Opcional)</label>
                  <input
                    type="text"
                    {...register('owner_license_issued_state')}
                    className="form-input"
                    placeholder="Ex: MA"
                  />
                  {errors.owner_license_issued_state && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.owner_license_issued_state.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Endereço Residencial</label>
                  <input
                    type="text"
                    {...register('owner_residential_address')}
                    className="form-input"
                    placeholder="Ex: 456 Oak Ave, City, State, ZIP"
                  />
                  {errors.owner_residential_address && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.owner_residential_address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                🚗 Informações do Veículo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="form-label">VIN (17 caracteres)</label>
                  <input
                    type="text"
                    {...register('vin')}
                    className="form-input"
                    placeholder="Ex: 1HGBH41JXMN109186"
                    maxLength={17}
                  />
                  {errors.vin && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.vin.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Ano</label>
                  <input
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    className="form-input"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    placeholder="Ex: 2021"
                  />
                  {errors.year && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.year.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Marca</label>
                  <input
                    type="text"
                    {...register('make')}
                    className="form-input"
                    placeholder="Ex: Honda"
                  />
                  {errors.make && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.make.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Modelo</label>
                  <input
                    type="text"
                    {...register('model')}
                    className="form-input"
                    placeholder="Ex: Civic"
                  />
                  {errors.model && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.model.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Estilo do Corpo</label>
                  <select {...register('body_style')} className="form-select">
                    <option value="">Selecione...</option>
                    {bodyStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                  {errors.body_style && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.body_style.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Cor</label>
                  <select {...register('color')} className="form-select">
                    <option value="">Selecione...</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  {errors.color && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.color.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Número de Cilindros (Opcional)</label>
                  <input
                    type="number"
                    {...register('cylinders', { valueAsNumber: true })}
                    className="form-input"
                    min={1}
                    max={16}
                    placeholder="Ex: 4"
                  />
                  {errors.cylinders && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.cylinders.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Número de Passageiros (Opcional)</label>
                  <input
                    type="number"
                    {...register('passengers', { valueAsNumber: true })}
                    className="form-input"
                    min={1}
                    max={15}
                    placeholder="Ex: 5"
                  />
                  {errors.passengers && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.passengers.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Número de Portas (Opcional)</label>
                  <input
                    type="number"
                    {...register('doors', { valueAsNumber: true })}
                    className="form-input"
                    min={1}
                    max={6}
                    placeholder="Ex: 4"
                  />
                  {errors.doors && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.doors.message}</p>
                  )}
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="form-label">Odômetro em Milhas (Opcional)</label>
                  <input
                    type="number"
                    {...register('odometer', { valueAsNumber: true })}
                    className="form-input"
                    min={0}
                    placeholder="Ex: 25000"
                  />
                  {errors.odometer && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.odometer.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Previous Title Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                📋 Informações do Título Anterior
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Número do Título Anterior (Opcional)</label>
                  <input
                    type="text"
                    {...register('previous_title_number')}
                    className="form-input"
                    placeholder="Ex: CN539192"
                  />
                  {errors.previous_title_number && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.previous_title_number.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Estado do Título Anterior (Opcional)</label>
                  <input
                    type="text"
                    {...register('previous_title_state')}
                    className="form-input"
                    placeholder="Ex: MA"
                  />
                  {errors.previous_title_state && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.previous_title_state.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">País do Título Anterior (Opcional)</label>
                  <input
                    type="text"
                    {...register('previous_title_country')}
                    className="form-input"
                    placeholder="Ex: USA"
                  />
                  {errors.previous_title_country && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.previous_title_country.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sale Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                💰 Informações da Venda
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Preço Bruto da Venda ($)</label>
                  <input
                    type="number"
                    {...register('gross_sale_price', { valueAsNumber: true })}
                    className="form-input"
                    min={0}
                    step={0.01}
                    placeholder="Ex: 25000.00"
                  />
                  {errors.gross_sale_price && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.gross_sale_price.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Data da Compra</label>
                  <input
                    type="date"
                    {...register('purchase_date')}
                    className="form-input"
                  />
                  {errors.purchase_date && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.purchase_date.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                🛡️ Informações do Seguro
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Data Efetiva do Seguro</label>
                  <input
                    type="date"
                    {...register('insurance_effective_date')}
                    className="form-input"
                  />
                  {errors.insurance_effective_date && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.insurance_effective_date.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Data de Mudança da Apólice (Opcional)</label>
                  <input
                    type="date"
                    {...register('insurance_policy_change_date')}
                    className="form-input"
                  />
                  {errors.insurance_policy_change_date && (
                    <p className="text-red-600 text-sm mt-1 font-medium">{errors.insurance_policy_change_date.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando RTA...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar RTA
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
              >
                Limpar Formulário
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
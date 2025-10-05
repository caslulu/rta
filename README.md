# Auto RTA - Gerador de Documentos RTA

Uma aplicação web moderna para preenchimento automático de documentos RTA (Registration and Title Application) para seguradoras Allstate e Progressive.

## Funcionalidades

- ✅ Interface React moderna e responsiva
- ✅ Validação de formulários com TypeScript e Zod
- ✅ Suporte para templates Allstate e Progressive
- ✅ Preenchimento automático de PDFs
- ✅ Download automático dos documentos gerados
- ✅ API REST backend em Flask
- ✅ Validação de dados robusta

## Estrutura do Projeto

```
auto-rta/
├── backend/           # API Flask
│   ├── app/
│   │   ├── assets/    # Templates PDF
│   │   ├── routes/    # Rotas da API
│   │   ├── services/  # Lógica de negócio
│   │   └── util/      # Utilitários
│   └── main.py        # Aplicação principal
└── frontend/          # Interface React
    ├── src/
    │   ├── components/ # Componentes React
    │   ├── types/      # Tipos TypeScript
    │   └── main.tsx    # App principal
    └── package.json
```

## Como Executar

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

A API estará disponível em `http://localhost:5000`

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

A interface estará disponível em `http://localhost:5173`

## Endpoints da API

### POST `/api/rta`
Gera um documento RTA preenchido.

**Body (JSON):**
```json
{
  "insurance_company": "allstate|progressive",
  "seller_name": "string",
  "seller_address": "string",
  "owner_name": "string",
  "owner_dob": "YYYY-MM-DD",
  "owner_license": "string",
  "owner_residential_address": "string",
  "vin": "string (17 chars)",
  "year": number,
  "make": "string",
  "model": "string",
  "body_style": "string",
  "color": "string",
  "gross_sale_price": number,
  "purchase_date": "YYYY-MM-DD",
  "insurance_effective_date": "YYYY-MM-DD"
}
```

**Response:** PDF file download

### GET `/api/health`
Verifica se a API está funcionando.

## Tecnologias

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod (validação)
- Lucide React (ícones)
- Vite (bundler)

### Backend
- Flask
- pypdf (manipulação de PDF)
- Flask-CORS

## Campos do Formulário

- **Seguradora**: Allstate ou Progressive
- **Vendedor**: Nome e endereço
- **Proprietário**: Nome, data de nascimento, licença, endereço
- **Veículo**: VIN, ano, marca, modelo, estilo, cor
- **Venda**: Preço bruto, data de compra
- **Seguro**: Data efetiva

## Validações

- VIN deve ter exatamente 17 caracteres
- Datas no formato YYYY-MM-DD
- Campos obrigatórios são validados
- Ano do veículo entre 1900 e ano atual + 1
- Preço deve ser positivo

## Desenvolvimento

O projeto usa boas práticas de TypeScript, validação robusta com Zod, e interface moderna com Tailwind CSS. O backend é simples e focado apenas na funcionalidade de RTA.
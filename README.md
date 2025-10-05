# Auto RTA - Gerador de Documentos RTA

Uma aplicação web moderna para preenchimento automático de documentos RTA (Registration and Title Application) para seguradoras Allstate e Progressive.

## 🚀 Deploy no Render

### Configuração do Web Service:

1. **Repository:** Conecte seu repositório GitHub
2. **Build Command:**
   ```bash
   cd frontend && npm install && npm run build && cd .. && rm -rf backend/static && mkdir -p backend/static && cp -r frontend/dist/* backend/static/ && pip install -r requirements.txt
   ```
3. **Start Command:**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:$PORT start:app
   ```

### Variáveis de Ambiente:
- `PYTHON_VERSION`: `3.11`
- `NODE_VERSION`: `18`

## 🛠️ Desenvolvimento Local

### Opção 1: Script automático (recomendado)
```bash
./dev.sh
```

### Opção 2: Manual

#### Backend (Flask)
```bash
cd backend
pip install -r ../requirements.txt
python main.py
```

#### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Build para Produção

### Script automático:
```bash
./build.sh
```

### Manual:
```bash
# Build frontend
cd frontend
npm install
npm run build

# Move para backend
cd ..
rm -rf backend/static
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

# Instala dependências backend
pip install -r requirements.txt

# Inicia aplicação
python start.py
```

## Funcionalidades

- ✅ Interface React moderna e responsiva
- ✅ Validação de formulários com TypeScript e Zod
- ✅ Suporte para templates Allstate e Progressive
- ✅ Preenchimento automático de PDFs
- ✅ Download automático dos documentos gerados
- ✅ API REST backend em Flask
- ✅ Deploy unificado (frontend + backend)
- ✅ Validação de dados robusta

## Estrutura do Projeto

```
auto-rta/
├── start.py           # Aplicação principal para produção
├── build.sh           # Script de build
├── dev.sh             # Script de desenvolvimento
├── requirements.txt   # Dependências Python
├── backend/           # API Flask
│   ├── app/
│   │   ├── assets/    # Templates PDF
│   │   ├── routes/    # Rotas da API
│   │   ├── services/  # Lógica de negócio
│   │   └── util/      # Utilitários
│   └── main.py        # App desenvolvimento
└── frontend/          # Interface React
    ├── src/
    │   ├── components/ # Componentes React
    │   ├── types/      # Tipos TypeScript
    │   └── main.tsx    # App principal
    └── package.json
```

## URLs

### Desenvolvimento:
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

### Produção:
- Aplicação: https://seu-app.onrender.com
- API: https://seu-app.onrender.com/api

## Endpoints da API

### POST `/api/rta`
Gera um documento RTA preenchido.

### GET `/api/health`
Verifica se a API está funcionando.

## Tecnologias

### Frontend
- React 19 + TypeScript
- CSS Custom + React Hook Form + Zod validation
- Vite (build tool)

### Backend
- Flask 3.0 + Flask-CORS
- pypdf (manipulação de PDF)
- Gunicorn (production server)

## Comandos para Deploy no Render

### Build Command:
```bash
cd frontend && npm install && npm run build && cd .. && rm -rf backend/static && mkdir -p backend/static && cp -r frontend/dist/* backend/static/ && pip install -r requirements.txt
```

### Start Command:
```bash
gunicorn -w 4 -b 0.0.0.0:$PORT start:app
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
# Frontend - Auto RTA Generator

Interface React moderna para geração de documentos RTA (Registration and Title Application).

## Funcionalidades

- 🎨 Interface moderna com Tailwind CSS
- 📱 Design responsivo
- ✅ Validação de formulários em tempo real
- 🏢 Suporte para templates Allstate e Progressive
- 📄 Download automático de PDFs
- 🔧 TypeScript para type safety
- ⚡ Vite para desenvolvimento rápido

## Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## Estrutura

```
src/
├── components/
│   └── RTAForm.tsx          # Formulário principal
├── types/
│   └── rta.ts               # Tipos TypeScript
├── App.tsx                  # App principal
├── main.tsx                 # Entry point
└── index.css                # Estilos globais
```

## Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Lucide React** - Ícones
- **Vite** - Build tool

## API Integration

O frontend se conecta ao backend Flask em `http://localhost:5000/api/rta` para gerar os PDFs.

## Validações

- Campos obrigatórios
- VIN deve ter 17 caracteres
- Datas no formato correto
- Valores numéricos válidos
- Seleção de seguradora obrigatória

# Insurance System (RTA + Auto-Trello)

Projeto monorepo com:
- Backend Flask do RTA e API de Trello em `auto-rta/backend`
- Frontend React + Vite + Tailwind na raiz em `frontend`

A pasta `auto-rta` agora contém somente o que é específico do RTA/backend. Metadados como README e .gitignore ficam na raiz do repositório.

## Estrutura

```
/
├─ README.md                # Este arquivo
├─ .gitignore               # Ignora artefatos Node/Python e build
├─ frontend/                # SPA (RTA + Trello UI)
│  ├─ src/
│  ├─ vite.config.ts        # outDir -> auto-rta/backend/static
│  └─ ...
├─ auto-rta/
│  ├─ backend/
│  │  ├─ app/
│  │  │  ├─ routes/         # /api/rta, /api/trello, /api/trello/auth-check
│  │  │  ├─ services/
│  │  │  └─ util/
│  │  ├─ static/            # build do Vite (ignorado no git)
│  │  └─ main.py
│  ├─ start.py              # entry de produção
│  ├─ requirements.txt
│  └─ backend/requirements.txt
└─ auto-trello/             # utilitários legados (opcional)
```

## Desenvolvimento

- Frontend (raiz)
  - `npm install`
  - `npm run dev`
- Backend (auto-rta)
  - Crie um venv e instale dependências de `auto-rta/requirements.txt` e `auto-rta/backend/requirements.txt`
  - Rode `python auto-rta/start.py` (servirá a SPA de `backend/static` em produção; no dev use o Vite)

Opcional: use os scripts já existentes em `auto-rta` (dev/build) se preferir.

## Build de produção

- Na raiz: `cd frontend && npm run build`
  - O Vite publica em `auto-rta/backend/static`
- Ative o venv e instale `pip install -r auto-rta/requirements.txt && pip install -r auto-rta/backend/requirements.txt`
- Rode `gunicorn -w 4 -b 0.0.0.0:$PORT auto-rta/start:app` (Render/produção)

## Variáveis de Ambiente (Trello)

- `TRELLO_KEY`
- `TRELLO_TOKEN`
- `TRELLO_ID_LIST`
- `TRELLO_URL` (opcional; padrão `https://api.trello.com/1/cards`)

Teste suas credenciais:
- `GET /api/trello/auth-check` → valida key/token e a lista (se informada)

## Notas de UI (Trello)

- VIN auto-preenche Marca/Modelo/Ano via NHTSA VPIC e mostra um preview; os campos não aparecem para edição.
- Documento é exibido como `Documento: XXXXXXXX - UF` no card do Trello.
- Datas são formatadas para MM/DD/YYYY.
- Endereço é composto por Rua, Apt (opcional), Cidade, Estado e ZIP.
- Pelo menos um veículo é obrigatório; botão de remover desabilita quando houver apenas um.

## Troubleshooting rápido

- 401 do Trello: confira KEY/TOKEN/ID da lista e permissões do token; use `/api/trello/auth-check`.
- Build do Vite ok mas SPA branca em produção: confirme que `frontend/vite.config.ts` aponta `outDir` para `../auto-rta/backend/static` e que está servindo `index.html`.

# Guia para desplegar en GitHub Pages

## Paso 1: Crear repositorio en GitHub (si aún no existe)

1. Ve a https://github.com/new
2. Crea un nuevo repositorio llamado `docusaurus` (o el nombre que prefieras)
3. **IMPORTANTE**: Déjalo vacio (sin README, ni .gitignore)

## Paso 2: Agregar el remote y hacer push

En PowerShell, desde `telegram-agent-ui-phase3.5/`:

```powershell
# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/docusaurus.git

# Hacer push de los cambios
git branch -M main
git push -u origin main
```

## Paso 3: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `docusaurus/build`
4. Haz clic en **Save**

GitHub Pages ahora buildea automáticamente desde `docusaurus/build`.

## Paso 4: Configurar Docusaurus (Opcional pero recomendado)

Para que Docusaurus trabaje mejor con GitHub Pages, abre `docusaurus/docusaurus.config.ts` y busca:

```typescript
url: 'https://example.com',
baseUrl: '/',
```

Reemplaza `example.com` con tu URL de GitHub Pages (usualmente `https://TU_USUARIO.github.io`):

```typescript
url: 'https://TU_USUARIO.github.io',
baseUrl: '/docusaurus/',
```

Si tu repositorio es `telegram-agent-ui`, la baseUrl es `/telegram-agent-ui/`.

## Paso 5: Deployar cambios futuros

Después de hacer cambios locales:

```powershell
cd docusaurus
npm run build

cd ..
git add docusaurus/build/ docusaurus/docs/ ...
git commit -m "Update: descripción de cambios"
git push origin main
```

GitHub Pages se actualizará automáticamente en unos minutos.

## URLs finales

- Repositorio: `https://github.com/TU_USUARIO/telegram-agent-ui`
- Sitio en vivo: `https://TU_USUARIO.github.io/docusaurus`

## Verificar deployment

- Ve a **Settings** → **Pages** en tu repositorio
- Busca el link del sitio o visita manualmente: `https://TU_USUARIO.github.io/telegram-agent-ui`

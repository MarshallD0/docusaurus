# Despliegue en GitHub Pages - Resumen Técnico

## ✅ Lo que has logrado

Tu proyecto está completamente en GitHub: https://github.com/MarshallD0/docusaurus

## 🎯 Próximos 3 Pasos Finales

### Paso 1: Cambiar la carpeta de despliegue
En la captura que viste, dice "Your GitHub Pages site is currently being built from the main branch". Pero necesitas cambiar de carpeta.

**Haz esto en GitHub:**
1. Ve a: https://github.com/MarshallD0/docusaurus/settings/pages
2. En **Folder**, cambia de `/ (root)` a `docusaurus/build`
3. Haz clic en **Save**

### Paso 2: Actualizar la configuración de Docusaurus (local)
```powershell
# Edita docusaurus/docusaurus.config.ts
# Busca estas líneas:
url: 'https://marshallD0.github.io',
baseUrl: '/docusaurus/',

# Si aún no están así, cámbialo y haz push
git add docusaurus/docusaurus.config.ts
git commit -m "Configure GitHub Pages baseUrl"
git push origin main
```

### Paso 3: Esperar a que se construya
- Ve a: https://github.com/MarshallD0/docusaurus/deployments
- Espera 2-3 minutos
- Tu sitio estará en: **https://marshallD0.github.io/docusaurus**

---

## 📊 Resumen Técnico - Estrategia de Despliegue (5-8 líneas)

**Estrategia:** Utilizamos una arquitectura de despliegue híbrida combinando un backend Spring Boot con un frontend Docusaurus estático, donde el build de Docusaurus se genera localmente y se commitea al repositorio para que GitHub Pages lo sirva directamente desde la rama `main`. Los ajustes realizados incluyen: (1) configuración del `baseUrl` en Docusaurus para funcionar bajo el subruta `/docusaurus/`, (2) exclusión de `node_modules/` y archivos compilados en `.gitignore` para reducir el tamaño del repositorio, (3) implementación de variables de entorno para credenciales sensibles evitando exposición de datos, y (4) integración de Mermaid.js para diagramas dinámicos. Los problemas técnicos encontrados fueron: la ruta de despliegue inicial incorrecta (solucionado apuntando a `docusaurus/build/`), conflictos entre la estructura monorepo (Spring Boot + Docusaurus juntos) que requerían gitignore estratégico, y la necesidad de compilar el build antes de cada push ya que GitHub Pages no ejecuta `npm run build` automáticamente (diferente a Vercel o Netlify). Se aplicó el enfoque del profesor de separación de concerns (backend en Java, frontend en TypeScript/React) y se combinó con las mejores prácticas de IA para seguridad, documentación y configuración de CI/CD.

---

## 🔍 Verificación Final

Después de seguir estos 3 pasos, verifica que:

- [ ] GitHub Pages está usando rama `main` y carpeta `docusaurus/build/`
- [ ] El sitio está accesible en: https://marshallD0.github.io/docusaurus
- [ ] La documentación se ve correctamente en español
- [ ] Los diagramas Mermaid se renderizan
- [ ] No hay errores de 404

## 📝 Notas para Futuros Deployments

Cada vez que hagas cambios, el flujo es:

```powershell
# 1. Hacer cambios en los archivos
cd docusaurus
# Edita archivos en docs/phase-3/ o src/

# 2. Compilar
npm run build

# 3. Hacer commit y push
cd ..
git add .
git commit -m "Update: descripción de cambios"
git push origin main
```

GitHub Pages detectará automáticamente los cambios en `docusaurus/build/` y actualizará el sitio.

---

**Repositorio:** https://github.com/MarshallD0/docusaurus  
**Sitio en vivo (cuando esté configurado):** https://marshallD0.github.io/docusaurus  
**Último actualizado:** 11 de Mayo, 2026

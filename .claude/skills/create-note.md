---
name: create-note
description: Crear una nueva nota para la seccion Notas de frankuxui.dev. Pregunta el tema, genera titulo, contenido, emoji, color y tags.
user_invocable: true
agent: note-writer
---

# Crear nota

Skill para crear una nueva nota en la seccion "Notas" de frankuxui.dev.

## Instrucciones

Cuando el usuario invoque este skill:

1. **Si el usuario no ha indicado el tema**, preguntale usando AskUserQuestion:
   - "Sobre que tema te gustaria escribir esta nota?"
   - Ofrece opciones de categoria: Programacion, Diseno, Reflexion personal, Herramientas, Historia/Suceso

2. **Una vez tengas el tema**, lee las notas existentes en `src/content/notes/` para:
   - Evitar colores de accentColor repetidos
   - Mantener coherencia de tono y estilo
   - Verificar que no exista una nota similar

3. **Busca un emoji apropiado** consultando https://emojipedia.org/es/twitter para encontrar el emoji mas expresivo y relevante para el tema. Usa WebFetch para consultar la pagina de emojis relacionados.

4. **Genera la nota completa** siguiendo las pautas del agente note-writer:
   - Frontmatter con todos los campos requeridos
   - Contenido en el estilo de Frank (primera persona, cercano, tecnico)
   - Nombre de archivo en kebab-case sin tildes

5. **Guarda el archivo** en `src/content/notes/{slug}.md`

6. **Confirma al usuario** mostrando:
   - Titulo de la nota
   - Emoji y color elegidos
   - Tags asignados
   - Ruta del archivo creado

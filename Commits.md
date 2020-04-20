# Estructura de los commits

## Estructura
>tipo(alcance): descripción

## Tipos
* **Feat:** nueva caracteristica.
* **Fix:** corrección de error.
* **Docs:** cambios en la documentación.
* **Style:** cambios que no afectan el significado del código (espacio en blanco, formato, puntos y comas, etc.).
* **Refactor:** cambio en el código que no corrige un error ni agrega una caracteristica.
* **Perft:** cambio de codigo que mejora el rendimiento.
* **Test:** agregar pruebas faltantes.
* **Chore:** cambios en el proceso de construcción o en herramientas y bibliotecas auxiliares.

## Alcance
El alcance puede ser cualquier cosa que especifique el lugar del cambio de confirmación.

## Descripción
Contiene una breve descripción del cambio:
* Usar el imperativo, presente: "change" no "changed" ni "changes"
* No poner en mayúscula la primera letra
* No coloque un punto al final
* La longitud total del mensaje de confirmación no debe superar los 50 caracteres
* Describir qué hace el commit, no qué problema se relaciona o corrige
* Ser breve pero descriptivo: debemos entender bien lo que hace el commit al leer el tema

## Ejemplo
```bash
git commit -m "style(nav)" -m "change main color"
```
# Calculadora de Propinas y Consumo

Aplicacion web desarrollada con React para calcular el total de una orden y el porcentaje de propina de forma rapida e intuitiva. Este proyecto forma parte de mi proceso de aprendizaje en un curso de React, y me permitio practicar conceptos clave como el manejo de estado, componentes reutilizables, tipado con TypeScript y separacion de responsabilidades dentro de una aplicacion frontend.

El objetivo principal de la app es resolver una situacion comun: seleccionar productos de un menu, calcular el subtotal de consumo, elegir un porcentaje de propina y obtener el total final a pagar.

## Que problema resuelve

En muchos contextos, especialmente en restaurantes o pedidos grupales, calcular propinas puede volverse repetitivo o propenso a errores. Esta aplicacion automatiza ese calculo y permite:

- Agregar productos del menu a una orden.
- Aumentar la cantidad si se selecciona un producto repetido.
- Eliminar productos de la orden.
- Seleccionar un porcentaje de propina.
- Calcular subtotal, propina y total final.
- Reiniciar la orden al guardarla.

## Lo que practique

Este proyecto esta enfocado en reforzar bases importantes de React:

- Uso de `useState` para manejar la orden y el porcentaje de propina.
- Creacion de un custom hook (`useOrder`) para centralizar la logica de negocio.
- Uso de `useMemo` para calcular subtotal, propina y total de forma eficiente.
- Comunicacion entre componentes mediante props.
- Renderizado condicional para mostrar la orden solo cuando hay productos seleccionados.
- Tipado de datos con TypeScript para trabajar con estructuras mas seguras.
- Estilos con Tailwind CSS para construir una interfaz clara y responsive.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint
- React Compiler

## Estructura principal

```text
src/
  components/
    MenuItem.tsx
    OrderContents.tsx
    OrderTotals.tsx
    TipPorcentageForm.tsx
  data/
    db.ts
  helpers/
    index.ts
  hooks/
    useOrder.ts
  types/
    index.ts
  App.tsx
```

## Componentes destacados

`useOrder`
Centraliza el estado de la aplicacion. Desde este hook se controla la orden, la propina, la logica para agregar productos, eliminar productos y reiniciar la orden.

`OrderTotals`
Calcula y muestra el subtotal, la propina y el total a pagar. Utiliza `useMemo` para evitar calculos innecesarios cuando los datos no cambian.

`TipPorcentageForm`
Permite seleccionar el porcentaje de propina mediante inputs tipo radio, manteniendo la seleccion sincronizada con el estado de React.

`OrderContents`
Muestra los productos agregados a la orden y permite eliminarlos.

## Mejoras implementadas

- Separacion de la logica principal en un custom hook.
- Componentizacion de la interfaz para que el codigo sea mas facil de leer y mantener.
- Calculos derivados optimizados con `useMemo`.
- Interfaz responsive usando Tailwind CSS.
- Estado inicial limpio y reinicio de orden despues de guardarla.

## Posibles mejoras futuras

- Mejorar la experiencia visual con una UI mas pulida y moderna.
- Agregar animaciones suaves al anadir o eliminar productos.
- Permitir porcentajes de propina personalizados.
- Guardar ordenes en localStorage para mantener datos al recargar la pagina.
- Anadir filtros o categorias al menu.
- Agregar pruebas unitarias para validar la logica del hook `useOrder`.
- Mejorar la accesibilidad de los controles interactivos.

## Como ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Crear una version de produccion:

```bash
npm run build
```

## Aprendizaje principal

Mas que una calculadora, este proyecto representa una practica real de como construir una aplicacion React organizada. Aprendi a dividir responsabilidades, mover logica fuera de los componentes visuales y trabajar con datos derivados a partir del estado.

Es un proyecto pequeno, pero muestra fundamentos importantes para seguir creciendo como desarrollador frontend: claridad en el codigo, manejo de estado, composicion de componentes y atencion a la experiencia del usuario.

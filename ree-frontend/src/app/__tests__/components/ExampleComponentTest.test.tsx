import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Este es un componente de ejemplo para demostrar los tests
const ExampleComponent = ({ title }: { title: string }) => (
  <div>
    <h1 data-testid="title">{title}</h1>
    <p>Este es un componente de ejemplo para pruebas</p>
  </div>
);

describe('ExampleComponent', () => {
  it('renderiza correctamente con el título proporcionado', () => {
    render(<ExampleComponent title="Título de Prueba" />);
    
    const titleElement = screen.getByTestId('title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Título de Prueba');
  });
});

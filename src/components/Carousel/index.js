import React from 'react';
import PosterCarousel from './PosterCarousel';
import ThumbCarousel from './ThumbCarousel';
import { CAROUSEL_TYPES } from '../../utils/constants';

// Factory que renderiza el tipo de carrusel apropiado
const Carousel = ({ carousel, onItemPress, testID }) => {
  // Selecciono el componente de carrusel apropiado basado en el tipo
  switch (carousel.type) {
    case CAROUSEL_TYPES.POSTER:
      return (
        <PosterCarousel
          carousel={carousel}
          onItemPress={onItemPress}
          testID={testID || `poster-carousel-${carousel.id}`}
        />
      );

    case CAROUSEL_TYPES.THUMB:
      return (
        <ThumbCarousel
          carousel={carousel}
          onItemPress={onItemPress}
          testID={testID || `thumb-carousel-${carousel.id}`}
        />
      );

    default:
      // Tipo desconocido - default a thumb style
      console.warn(`Unknown carousel type: ${carousel.type}, using thumb`);
      return (
        <ThumbCarousel
          carousel={carousel}
          onItemPress={onItemPress}
          testID={testID || `default-carousel-${carousel.id}`}
        />
      );
  }
};

// También exporto los componentes individuales para uso directo si es necesario
export { PosterCarousel, ThumbCarousel };
export default Carousel;

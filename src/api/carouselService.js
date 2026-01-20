import apiClient from './client';
import { ENDPOINTS } from '../utils/constants';

export const getCarousels = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.DATA);

    // Validación de que la respuesta es un array
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }

    return response.data;
  } catch (error) {
    console.error('Failed to fetch carousels:', error.message);
    throw error;
  }
};

// Valido y limpio las URLs de imágenes
// placeimg.com está muerto (DNS no resuelve), devuelvo null para usar placeholder local
const fixBrokenImageUrl = (url) => {
  if (!url) return null;

  // placeimg.com está muerto - devuelvo null para mostrar placeholder estilizado
  if (/^https?:\/\/placeimg\.com/i.test(url)) {
    return null;
  }

  // Convierto http a https para otras URLs
  return url.replace(/^http:\/\//i, 'https://');
};

// Transforma los items del carrusel para mostrarlos en la UI
export const transformCarouselData = (carousels) => {
  return carousels.map((carousel, index) => ({
    ...carousel,
    id: `carousel-${index}`,
    items: carousel.items.map((item, itemIndex) => ({
      ...item,
      id: `${carousel.type}-item-${itemIndex}`,
      hasVideo: Boolean(item.videoUrl),
      imageUrl: fixBrokenImageUrl(item.imageUrl),
    })),
  }));
};

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

// Fijo las URLs de las imágenes que están caidas
// Reemplazo placeimg.com por picsum.photos
const fixBrokenImageUrl = (url) => {
  if (!url) return null;

  // Reemplazo placeimg.com con picsum.photos
  const placeImgRegex = /^https?:\/\/placeimg\.com\/(\d+)\/(\d+)/i;
  const match = url.match(placeImgRegex);

  if (match) {
    const [, width, height] = match;
    return `https://picsum.photos/${width}/${height}`;
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

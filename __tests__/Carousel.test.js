/**
 * Carousel Component Tests
 * Unit tests for the carousel components
 *
 * Challenge requirement: "Test unitario básico en carrusel usando Jest"
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Carousel from '../src/components/Carousel';
import CarouselItem from '../src/components/Carousel/CarouselItem';
import PosterCarousel from '../src/components/Carousel/PosterCarousel';
import ThumbCarousel from '../src/components/Carousel/ThumbCarousel';

// Mock data
const mockPosterCarousel = {
  id: 'carousel-1',
  title: 'Test Poster Carousel',
  type: 'poster',
  items: [
    {
      id: 'poster-item-0',
      title: 'Movie 1',
      imageUrl: 'https://example.com/image1.jpg',
      videoUrl: 'https://example.com/video1.mp4',
      hasVideo: true,
      description: 'Description 1',
    },
    {
      id: 'poster-item-1',
      title: 'Movie 2',
      imageUrl: 'https://example.com/image2.jpg',
      videoUrl: null,
      hasVideo: false,
      description: 'Description 2',
    },
  ],
};

const mockThumbCarousel = {
  id: 'carousel-2',
  title: 'Test Thumb Carousel',
  type: 'thumb',
  items: [
    {
      id: 'thumb-item-0',
      title: 'Video 1',
      imageUrl: 'https://example.com/thumb1.jpg',
      videoUrl: 'https://example.com/video1.mp4',
      hasVideo: true,
      description: 'Description 1',
    },
  ],
};

const mockItem = {
  id: 'item-1',
  title: 'Test Item',
  imageUrl: 'https://example.com/image.jpg',
  videoUrl: 'https://example.com/video.mp4',
  hasVideo: true,
  description: 'Test description',
};

describe('Carousel Factory', () => {
  it('renders PosterCarousel for type "poster"', () => {
    const { getByText } = render(
      <Carousel carousel={mockPosterCarousel} onItemPress={jest.fn()} />
    );

    expect(getByText('Test Poster Carousel')).toBeTruthy();
  });

  it('renders ThumbCarousel for type "thumb"', () => {
    const { getByText } = render(
      <Carousel carousel={mockThumbCarousel} onItemPress={jest.fn()} />
    );

    expect(getByText('Test Thumb Carousel')).toBeTruthy();
  });

  it('defaults to ThumbCarousel for unknown type', () => {
    const unknownCarousel = { ...mockThumbCarousel, type: 'unknown' };
    const { getByText } = render(
      <Carousel carousel={unknownCarousel} onItemPress={jest.fn()} />
    );

    expect(getByText('Test Thumb Carousel')).toBeTruthy();
  });
});

describe('CarouselItem', () => {
  const mockOnPress = jest.fn();
  const defaultDimensions = { width: 100, height: 150 };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders item title correctly', () => {
    const { getByText } = render(
      <CarouselItem
        item={mockItem}
        dimensions={defaultDimensions}
        onPress={mockOnPress}
        testID="test-item"
      />
    );

    expect(getByText('Test Item')).toBeTruthy();
  });

  it('calls onPress with item when pressed', () => {
    const { getByTestId } = render(
      <CarouselItem
        item={mockItem}
        dimensions={defaultDimensions}
        onPress={mockOnPress}
        testID="test-item"
      />
    );

    fireEvent.press(getByTestId('test-item'));
    expect(mockOnPress).toHaveBeenCalledWith(mockItem);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing when onPress is not provided', () => {
    const { getByText } = render(
      <CarouselItem
        item={mockItem}
        dimensions={defaultDimensions}
        testID="test-item"
      />
    );

    expect(getByText('Test Item')).toBeTruthy();
  });
});

describe('PosterCarousel', () => {
  it('renders carousel title', () => {
    const { getByText } = render(
      <PosterCarousel carousel={mockPosterCarousel} onItemPress={jest.fn()} />
    );

    expect(getByText('Test Poster Carousel')).toBeTruthy();
  });

  it('renders all items', () => {
    const { getByText } = render(
      <PosterCarousel carousel={mockPosterCarousel} onItemPress={jest.fn()} />
    );

    expect(getByText('Movie 1')).toBeTruthy();
    expect(getByText('Movie 2')).toBeTruthy();
  });

  it('calls onItemPress when item is pressed', () => {
    const mockOnItemPress = jest.fn();
    const { getByTestId } = render(
      <PosterCarousel
        carousel={mockPosterCarousel}
        onItemPress={mockOnItemPress}
        testID="poster-carousel"
      />
    );

    fireEvent.press(getByTestId('poster-carousel-item-0'));
    expect(mockOnItemPress).toHaveBeenCalledWith(mockPosterCarousel.items[0]);
  });
});

describe('ThumbCarousel', () => {
  it('renders carousel title', () => {
    const { getByText } = render(
      <ThumbCarousel carousel={mockThumbCarousel} onItemPress={jest.fn()} />
    );

    expect(getByText('Test Thumb Carousel')).toBeTruthy();
  });

  it('renders all items', () => {
    const { getByText } = render(
      <ThumbCarousel carousel={mockThumbCarousel} onItemPress={jest.fn()} />
    );

    expect(getByText('Video 1')).toBeTruthy();
  });

  it('calls onItemPress when item is pressed', () => {
    const mockOnItemPress = jest.fn();
    const { getByTestId } = render(
      <ThumbCarousel
        carousel={mockThumbCarousel}
        onItemPress={mockOnItemPress}
        testID="thumb-carousel"
      />
    );

    fireEvent.press(getByTestId('thumb-carousel-item-0'));
    expect(mockOnItemPress).toHaveBeenCalledWith(mockThumbCarousel.items[0]);
  });
});

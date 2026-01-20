/**
 * DetailScreen Component Tests
 * Unit tests for the detail screen components
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {
  VideoSection,
  InfoSection,
  ActionButtons,
} from '../src/components/DetailScreen';

// Mock data
const mockItemWithVideo = {
  id: 'item-1',
  title: 'Test Movie',
  description: 'This is a test description for the movie.',
  imageUrl: 'https://example.com/image.jpg',
  videoUrl: 'https://example.com/video.mp4',
  hasVideo: true,
};

const mockItemWithoutVideo = {
  id: 'item-2',
  title: 'Test Movie No Video',
  description: 'This item has no video.',
  imageUrl: 'https://example.com/image2.jpg',
  videoUrl: null,
  hasVideo: false,
};

const mockItemNoDescription = {
  id: 'item-3',
  title: 'No Description Movie',
  description: '',
  imageUrl: 'https://example.com/image3.jpg',
  videoUrl: 'https://example.com/video3.mp4',
  hasVideo: true,
};

describe('VideoSection', () => {
  const mockOnClose = jest.fn();
  const mockOnPlayPress = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnPlayPress.mockClear();
  });

  it('renders image preview when not playing', () => {
    const { getByTestId } = render(
      <VideoSection
        item={mockItemWithVideo}
        isPlaying={false}
        onPlayPress={mockOnPlayPress}
        onClose={mockOnClose}
        testID="video-section"
      />
    );

    expect(getByTestId('video-section-image')).toBeTruthy();
  });

  it('shows play button when item has video', () => {
    const { getByTestId } = render(
      <VideoSection
        item={mockItemWithVideo}
        isPlaying={false}
        onPlayPress={mockOnPlayPress}
        onClose={mockOnClose}
        testID="video-section"
      />
    );

    expect(getByTestId('video-section-play-button')).toBeTruthy();
  });

  it('does not show play button when item has no video', () => {
    const { queryByTestId } = render(
      <VideoSection
        item={mockItemWithoutVideo}
        isPlaying={false}
        onPlayPress={mockOnPlayPress}
        onClose={mockOnClose}
        testID="video-section"
      />
    );

    expect(queryByTestId('video-section-play-button')).toBeNull();
  });

  it('calls onPlayPress when play button is pressed', () => {
    const { getByTestId } = render(
      <VideoSection
        item={mockItemWithVideo}
        isPlaying={false}
        onPlayPress={mockOnPlayPress}
        onClose={mockOnClose}
        testID="video-section"
      />
    );

    fireEvent.press(getByTestId('video-section-play-button'));
    expect(mockOnPlayPress).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is pressed in fullscreen', () => {
    const mockOnToggleFullscreen = jest.fn();
    const { getByTestId } = render(
      <VideoSection
        item={mockItemWithVideo}
        isPlaying={true}
        isFullscreen={true}
        onPlayPress={mockOnPlayPress}
        onClose={mockOnClose}
        onToggleFullscreen={mockOnToggleFullscreen}
        fullscreenDimensions={{ width: 800, height: 400 }}
        testID="video-section"
      />
    );

    fireEvent.press(getByTestId('video-section-close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('InfoSection', () => {
  it('renders title correctly', () => {
    const { getByText } = render(
      <InfoSection
        item={mockItemWithVideo}
        testID="info-section"
      />
    );

    expect(getByText('Test Movie')).toBeTruthy();
  });

  it('renders description correctly', () => {
    const { getByText } = render(
      <InfoSection
        item={mockItemWithVideo}
        testID="info-section"
      />
    );

    expect(getByText('This is a test description for the movie.')).toBeTruthy();
  });

  it('shows default text when description is empty', () => {
    const { getByText } = render(
      <InfoSection
        item={mockItemNoDescription}
        testID="info-section"
      />
    );

    expect(getByText('Sin descripcion disponible')).toBeTruthy();
  });

  it('renders branding text', () => {
    const { getByText } = render(
      <InfoSection
        item={mockItemWithVideo}
        testID="info-section"
      />
    );

    expect(getByText('TOOLBOX')).toBeTruthy();
  });
});

describe('ActionButtons', () => {
  it('renders all action buttons', () => {
    const { getByTestId } = render(<ActionButtons testID="action-buttons" />);

    expect(getByTestId('action-buttons-share')).toBeTruthy();
    expect(getByTestId('action-buttons-download')).toBeTruthy();
  });

  it('renders button labels correctly', () => {
    const { getByText } = render(<ActionButtons testID="action-buttons" />);

    expect(getByText('Compartir')).toBeTruthy();
    expect(getByText('Descargar')).toBeTruthy();
  });
});

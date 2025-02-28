//import React from 'react';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExternalLink } from '../ExternalLink';
import { openBrowserAsync } from 'expo-web-browser';
import { Platform } from 'react-native';

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

describe('ExternalLink Component', () => {
  const testHref = 'https://example.com';

  it('renders correctly', () => {
    const { getByText } = render(<ExternalLink href={testHref}>Click Me</ExternalLink>);
    expect(getByText('Click Me')).toBeTruthy();
  });
  

  it('calls openBrowserAsync on native platforms and prevents default behavior', async () => {
    Platform.OS = 'android'; // Simulate a native platform
    const { getByText } = render(<ExternalLink href={testHref}>Click Me</ExternalLink>);
    const link = getByText('Click Me');

    const mockEvent = { preventDefault: jest.fn() };
    await fireEvent.press(link, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(openBrowserAsync).toHaveBeenCalledWith(testHref);
  });
	/*
  it('does not call openBrowserAsync on web platforms', async () => {
    Platform.OS = 'web'; // Simulate a web platform
    const { getByText } = render(<ExternalLink href={testHref}>Click Me</ExternalLink>);
    const link = getByText('Click Me');

    const mockEvent = { preventDefault: jest.fn() };
    await fireEvent.press(link, mockEvent);

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(openBrowserAsync).not.toHaveBeenCalled();
  });
  */
  
});
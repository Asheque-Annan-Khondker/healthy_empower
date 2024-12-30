import { render } from '@testing-library/react-native';
import App from '../../../../React/App';

describe('Integration Test Example', () => {
  test('renders App component correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('Welcome to Healthy Empowerer')).toBeTruthy();
	});
});
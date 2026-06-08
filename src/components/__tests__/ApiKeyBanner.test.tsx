/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { ApiKeyBanner } from '../ApiKeyBanner'

test('renders nothing when missing=false', () => {
  const { container } = render(<ApiKeyBanner missing={false} />)
  expect(container).toBeEmptyDOMElement()
})

test('renders banner with setup instructions when missing=true', () => {
  render(<ApiKeyBanner missing={true} />)
  expect(screen.getByText(/DEEPSEEK_API_KEY is not set/i)).toBeInTheDocument()
  expect(screen.getByText(/\.env\.local/i)).toBeInTheDocument()
})

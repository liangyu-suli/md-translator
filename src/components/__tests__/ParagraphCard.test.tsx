/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ParagraphCard, ParagraphState } from '../ParagraphCard'

const loadingPara: ParagraphState = { index: 0, en: '', zh: '', status: 'loading' }
const donePara: ParagraphState = { index: 0, en: 'Hello world', zh: '你好世界', status: 'done' }
const errorPara: ParagraphState = { index: 0, en: 'Failed text', zh: '', status: 'error', error: 'API quota exceeded' }

test('renders skeleton in loading state', () => {
  const { container } = render(<ParagraphCard paragraph={loadingPara} mode="hybrid" onRetry={() => {}} />)
  expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
})

test('renders en and zh text in hybrid mode', () => {
  render(<ParagraphCard paragraph={donePara} mode="hybrid" onRetry={() => {}} />)
  expect(screen.getByText('Hello world')).toBeInTheDocument()
  expect(screen.getByText('你好世界')).toBeInTheDocument()
})

test('renders only en text in EN mode', () => {
  render(<ParagraphCard paragraph={donePara} mode="en" onRetry={() => {}} />)
  expect(screen.getByText('Hello world')).toBeInTheDocument()
  expect(screen.queryByText('你好世界')).not.toBeInTheDocument()
})

test('renders only zh text in ZH mode', () => {
  render(<ParagraphCard paragraph={donePara} mode="zh" onRetry={() => {}} />)
  expect(screen.queryByText('Hello world')).not.toBeInTheDocument()
  expect(screen.getByText('你好世界')).toBeInTheDocument()
})

test('renders error message and retry button in error state', () => {
  render(<ParagraphCard paragraph={errorPara} mode="hybrid" onRetry={() => {}} />)
  expect(screen.getByText('API quota exceeded')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
})

test('calls onRetry with index and en when retry is clicked', async () => {
  const onRetry = jest.fn()
  render(<ParagraphCard paragraph={errorPara} mode="hybrid" onRetry={onRetry} />)
  await userEvent.click(screen.getByRole('button', { name: /retry/i }))
  expect(onRetry).toHaveBeenCalledWith(0, 'Failed text')
})
